#!/usr/bin/env python3
"""Move every file of one chapter/lecture into its folder's archive/ subfolder, or move it back.

Usage (from projects/tort-01):
    python3 archive_lecture.py 01                 # archive Chapter 01 (.md and .html)
    python3 archive_lecture.py 01 --dry-run       # show the plan, move nothing
    python3 archive_lecture.py 01 --list          # list archived versions of Chapter 01
    python3 archive_lecture.py 01 --restore 2026-11-02-0215

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

LOCATIONS = [
    "md-lectures",
    "md-lectures-html",
    "md-lectures-pdf",
]


def bn(n):
    return f"{n:02d}"


def folders():
    for base in LOCATIONS:
        folder = PROJECT / base
        if folder.is_dir():
            yield folder


def belongs_to(name, n):
    """True for 01.md, 01-chapter-01.md, 01-chapter-01.html; false for 010.md."""
    stem = name.split(".", 1)[0]
    return stem == bn(n) or stem.startswith(bn(n) + "-")


def rel(path):
    return path.relative_to(PROJECT).as_posix()


def plan_archive(n, stamp, exclude=(), only_in=(), match=()):
    moves = []
    for folder in folders():
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


def plan_restore(n, stamp):
    moves = []
    for folder in folders():
        archive_dir = folder / "archive"
        if not archive_dir.is_dir():
            continue
        for f in sorted(archive_dir.iterdir()):
            m = STAMPED_NAME.match(f.name)
            if f.is_file() and m and m["stamp"] == stamp and belongs_to(m["stem"] + m["suffix"], n):
                moves.append((f, folder / f"{m['stem']}{m['suffix']}"))
    return moves


def list_archived(n):
    found = {}
    for folder in folders():
        archive_dir = folder / "archive"
        if not archive_dir.is_dir():
            continue
        for f in archive_dir.iterdir():
            m = STAMPED_NAME.match(f.name)
            if f.is_file() and m and belongs_to(m["stem"] + m["suffix"], n):
                found.setdefault(m["stamp"], []).append(rel(f))
    return found


def check(moves):
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
            fh.write(f"- {when} | {action} Ch{bn(n)} | {reason} | {rel(src)} -> {rel(dest)}\n")


def archive(n, stamp=None, dry_run=False, reason="manual", exclude=(), only_in=(), match=()):
    stamp = stamp or datetime.now().strftime(STAMP_FORMAT)
    moves = plan_archive(n, stamp, exclude, only_in, match)
    problems = check(moves)
    if problems:
        sys.exit("Nothing moved:\n  " + "\n  ".join(problems))
    if moves and not dry_run:
        execute(moves)
        log("archive", n, reason, moves)
    return moves


def restore(n, stamp, dry_run=False, reason="manual"):
    moves = plan_restore(n, stamp)
    problems = [p.replace("target already exists", "working file already exists (archive it first)") for p in check(moves)]
    if problems:
        sys.exit("Nothing moved:\n  " + "\n  ".join(problems))
    if moves and not dry_run:
        execute(moves)
        log("restore", n, reason, moves)
    return moves


def main():
    ap = argparse.ArgumentParser(description="Archive or restore every file of one chapter, without deleting anything.")
    ap.add_argument("lecture", type=int, help="chapter/lecture number, e.g. 1")
    ap.add_argument("--dry-run", action="store_true", help="show the plan and move nothing")
    ap.add_argument("--list", action="store_true", help="list the archived versions of this chapter")
    ap.add_argument("--restore", metavar="STAMP", help="move the version archived under STAMP back into place")
    ap.add_argument("--reason", default="manual", help="short note written to ARCHIVE-LOG.md")
    ap.add_argument("--in", dest="only_in", action="append", default=[], metavar="FOLDER", help="archive only from this base folder")
    ap.add_argument("--match", action="append", default=[], metavar="GLOB", help="archive only file names matching this pattern")
    args = ap.parse_args()

    if args.list:
        found = list_archived(args.lecture)
        if not found:
            print(f"No timestamped archive of Ch{bn(args.lecture)}.")
        for stamp in sorted(found):
            print(f"{stamp}:")
            for path in sorted(found[stamp]):
                print(f"  {path}")
        return

    if args.restore:
        moves = restore(args.lecture, args.restore, args.dry_run, args.reason)
        verb = "Would restore" if args.dry_run else "Restored"
    else:
        moves = archive(args.lecture, None, args.dry_run, args.reason, only_in=tuple(args.only_in), match=tuple(args.match))
        verb = "Would archive" if args.dry_run else "Archived"

    if not moves:
        print(f"Nothing to move for Ch{bn(args.lecture)}.")
        return
    print(f"{verb} {len(moves)} file(s) of Ch{bn(args.lecture)}:")
    for src, dest in moves:
        print(f"  {rel(src)} -> {rel(dest)}")
    if not args.dry_run:
        print(f"Logged in {rel(LOG_FILE)}.")


if __name__ == "__main__":
    main()
