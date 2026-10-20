#!/usr/bin/env python3
"""Move every file of one lecture into its folder's archive/ subfolder, or move it back.

Usage (from projects/react-08):
    python3 archive_lecture.py 14                 # archive Lecture 14 of the latest version
    python3 archive_lecture.py 14 --dry-run       # show the plan, move nothing
    python3 archive_lecture.py 14 --version v6    # pick the version folder explicitly
    python3 archive_lecture.py 14 --list          # list archived versions of Lecture 14
    python3 archive_lecture.py 14 --restore 2026-10-04-0843
    python3 archive_lecture.py 10 --in 03-03-md-revised-2-pdf --match '10-ink.*'   # only some files

Safety: files are only moved, never deleted or overwritten. Every archived name carries
a timestamp. The whole plan is checked before the first move; if any target name is taken
the script stops without moving anything, and a failure midway moves the files back.
Every move is appended to ARCHIVE-LOG.md.
"""

import argparse
import fnmatch
import os
import re
import sys
from datetime import datetime
from pathlib import Path

PROJECT = Path(__file__).resolve().parent
LOG_FILE = PROJECT / "ARCHIVE-LOG.md"
STAMP_FORMAT = "%Y-%m-%d-%H%M"
STAMPED_NAME = re.compile(r"^(?P<stem>.+)-(?P<stamp>\d{4}-\d{2}-\d{2}-\d{4})(?P<suffix>\.[^.]+)$")

# (base folder, subfolder inside the version folder) for every place a lecture leaves files.
LOCATIONS = [
    ("01-01-md-PRE-lectures", ""),
    ("01-02-md-LECTURES", ""),
    ("01-02-md-LECTURES", "figures"),
    ("01-03-md-lectures-HTML", ""),
    ("01-04-md-lectures-PDF", ""),
    ("02-01-md-revised-1", ""),
    ("02-02-md-revised-1-html", ""),
    ("02-03-md-revised-1-pdf", ""),
    ("03-01-md-revised-2", ""),
    ("03-02-md-revised-2-html", ""),
    ("03-03-md-revised-2-pdf", ""),
    ("04-01-md-revised-3", ""),
    ("04-02-md-revised-3-html", ""),
    ("04-03-md-revised-3-pdf", ""),
    ("05-01-md-revised-4", ""),
    ("05-02-md-revised-4-html", ""),
    ("05-03-md-revised-4-pdf", ""),
]


def bn(n):
    return f"{n:02d}"


def latest_version():
    base = PROJECT / "01-02-md-LECTURES"
    versions = [d.name for d in base.iterdir() if d.is_dir() and re.fullmatch(r"v\d+", d.name)]
    if not versions:
        sys.exit("No version folder (v1, v2, ...) found in 01-02-md-LECTURES.")
    return max(versions, key=lambda v: int(v[1:]))


def folders(version):
    for base, sub in LOCATIONS:
        folder = PROJECT / base / version / sub if sub else PROJECT / base / version
        if folder.is_dir():
            yield folder


def belongs_to(name, n):
    """True for 14.md, 14.html, 14-pro.html, 14-01-code-assembly-pipeline.html; false for 140.md."""
    stem = name.split(".", 1)[0]
    return stem == bn(n) or stem.startswith(bn(n) + "-")


def rel(path):
    return path.relative_to(PROJECT).as_posix()


def plan_archive(n, version, stamp, exclude=(), only_in=(), match=()):
    """exclude: base folders (such as "01-01-md-PRE-lectures") whose files stay in place.
    only_in: when given, only these base folders are touched.
    match: when given, only file names matching one of these glob patterns (such as "10-ink.*") move."""
    moves = []
    for folder in folders(version):
        base = folder.relative_to(PROJECT).parts[0]
        if base in exclude or (only_in and base not in only_in):
            continue
        for f in sorted(folder.iterdir()):
            if match and not any(fnmatch.fnmatch(f.name, g) for g in match):
                continue
            if f.is_file() and belongs_to(f.name, n):
                dest = folder / "archive" / f"{f.stem}-{stamp}{f.suffix}"
                moves.append((f, dest))
    return moves


def plan_restore(n, version, stamp):
    moves = []
    for folder in folders(version):
        archive = folder / "archive"
        if not archive.is_dir():
            continue
        for f in sorted(archive.iterdir()):
            m = STAMPED_NAME.match(f.name)
            if f.is_file() and m and m["stamp"] == stamp and belongs_to(m["stem"] + m["suffix"], n):
                moves.append((f, folder / f"{m['stem']}{m['suffix']}"))
    return moves


def list_archived(n, version):
    found = {}
    for folder in folders(version):
        archive = folder / "archive"
        if not archive.is_dir():
            continue
        for f in archive.iterdir():
            m = STAMPED_NAME.match(f.name)
            if f.is_file() and m and belongs_to(m["stem"] + m["suffix"], n):
                found.setdefault(m["stamp"], []).append(rel(f))
    return found


def check(moves):
    """Refuse the whole plan if any target exists or two files would land on one name."""
    problems = [f"target already exists: {rel(dest)}" for _, dest in moves if dest.exists()]
    targets = [dest for _, dest in moves]
    problems += [f"two files would share: {rel(d)}" for d in set(targets) if targets.count(d) > 1]
    return problems


def execute(moves):
    done = []
    try:
        for src, dest in moves:
            size = src.stat().st_size
            dest.parent.mkdir(exist_ok=True)
            os.rename(src, dest)
            done.append((src, dest))
            if not dest.is_file() or dest.stat().st_size != size:
                raise OSError(f"size check failed after moving {rel(src)}")
    except OSError as err:
        for src, dest in reversed(done):
            if dest.exists() and not src.exists():
                os.rename(dest, src)
        sys.exit(f"Stopped: {err}. Every file moved so far was put back.")


def log(action, n, reason, moves):
    if not LOG_FILE.exists():
        LOG_FILE.write_text("# Archive Log\n\nEvery move made by archive_lecture.py, newest last. Files are only moved, never deleted.\n\n")
    when = datetime.now().strftime("%Y-%m-%d %H:%M")
    with LOG_FILE.open("a") as fh:
        for src, dest in moves:
            fh.write(f"- {when} | {action} Q{n} | {reason} | {rel(src)} -> {rel(dest)}\n")


def archive(n, version=None, stamp=None, dry_run=False, reason="manual", exclude=(), only_in=(), match=()):
    """Archive every file of lecture n, except those under the base folders in exclude.
    Returns the list of (source, destination) moves."""
    version = version or latest_version()
    stamp = stamp or datetime.now().strftime(STAMP_FORMAT)
    moves = plan_archive(n, version, stamp, exclude, only_in, match)
    problems = check(moves)
    if problems:
        sys.exit("Nothing moved:\n  " + "\n  ".join(problems))
    if moves and not dry_run:
        execute(moves)
        log("archive", n, reason, moves)
    return moves


def restore(n, stamp, version=None, dry_run=False, reason="manual"):
    version = version or latest_version()
    moves = plan_restore(n, version, stamp)
    problems = [p.replace("target already exists", "working file already exists (archive it first)") for p in check(moves)]
    if problems:
        sys.exit("Nothing moved:\n  " + "\n  ".join(problems))
    if moves and not dry_run:
        execute(moves)
        log("restore", n, reason, moves)
    return moves


def main():
    ap = argparse.ArgumentParser(description="Archive or restore every file of one lecture, without deleting anything.")
    ap.add_argument("lecture", type=int, help="lecture number, e.g. 14")
    ap.add_argument("--version", help="version folder such as v6 (default: the latest in 01-02-md-LECTURES)")
    ap.add_argument("--dry-run", action="store_true", help="show the plan and move nothing")
    ap.add_argument("--list", action="store_true", help="list the archived versions of this lecture")
    ap.add_argument("--restore", metavar="STAMP", help="move the version archived under STAMP back into place")
    ap.add_argument("--reason", default="manual", help="short note written to ARCHIVE-LOG.md")
    ap.add_argument("--in", dest="only_in", action="append", default=[], metavar="FOLDER", help="archive only from this base folder (repeatable), e.g. 03-03-md-revised-2-pdf")
    ap.add_argument("--match", action="append", default=[], metavar="GLOB", help="archive only file names matching this pattern (repeatable), e.g. '10-ink.*'")
    args = ap.parse_args()
    version = args.version or latest_version()

    if args.list:
        found = list_archived(args.lecture, version)
        if not found:
            print(f"No timestamped archive of Q{args.lecture} in {version}.")
        for stamp in sorted(found):
            print(f"{stamp}:")
            for path in sorted(found[stamp]):
                print(f"  {path}")
        return

    if args.restore:
        moves = restore(args.lecture, args.restore, version, args.dry_run, args.reason)
        verb = "Would restore" if args.dry_run else "Restored"
    else:
        moves = archive(args.lecture, version, None, args.dry_run, args.reason, only_in=tuple(args.only_in), match=tuple(args.match))
        verb = "Would archive" if args.dry_run else "Archived"

    if not moves:
        print(f"Nothing to move for Q{args.lecture} in {version}.")
        return
    print(f"{verb} {len(moves)} file(s) of Q{args.lecture} ({version}):")
    for src, dest in moves:
        print(f"  {rel(src)} -> {rel(dest)}")
    if not args.dry_run:
        print(f"Logged in {rel(LOG_FILE)}.")


if __name__ == "__main__":
    main()
