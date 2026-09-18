#!/usr/bin/env python3
"""
write-lectures.py — batch lecture writer driving a fresh agent interaction per lecture.

Inputs (the elegant three):
  --path   <project folder, or any folder inside it such as .../md-lectures-pdf>
  --count  <number of remaining lectures to create>
  (--bank, --engine, --model, --timeout, --dry-run, --no-build for fine control;
   the "what to do" is the script's one built-in task: create the next lecture
   for the next unanswered question, iterating until the count is met.)

Per lecture the script:
  1. finds the next question row in the bank with no md-lectures/{n}.md yet,
  2. starts a NEW agy (Antigravity CLI) interaction — or gemini, see --engine —
     in the project folder, and waits for it to finish,
  3. verifies the lecture file exists and is substantial, retrying once with
     a fresh interaction on failure,
  4. runs the project build (node src/build-lectures.mjs) and, if that
     lecture has warnings, sends ONE fix round (again a fresh interaction),
  5. moves to the next missing lecture.

Engines: "agy" (default, the Antigravity CLI: agy -p ... --dangerously-skip-
permissions) and "gemini" (gemini --yolo with the workspace-trust env var).
agy is discovered on PATH or at ~/.local/bin/agy; it must be authenticated
(run `agy` once interactively if a headless call reports an auth error).

Generic across projects: the project root is discovered by walking up from
--path until a folder holds both md-lectures/ and AUTHOR-BRIEF.md; the
question bank is discovered at ../../questions-*/questions.md relative to
the project root (override with --bank).

Examples:
  python3 write-lectures.py --path .../diagram-lab/output/accessibility-01/md-lectures-pdf --count 9
  python3 write-lectures.py --path ../react-lecture-01 --count 1 --dry-run
"""

import argparse
import glob
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

MARKER_FILES = ("AUTHOR-BRIEF.md", "instructions.md")
LECTURES_DIR = "md-lectures"
BUILD_SCRIPT = "src/build-lectures.mjs"
MIN_LECTURE_BYTES = 2000  # a real lecture is thousands of bytes; a stub is not


# ---------------- discovery ----------------

def find_project_root(start: Path) -> Path:
    """Walk up from --path until a folder contains md-lectures/ plus a brief."""
    for candidate in [start, *start.parents]:
        if (candidate / LECTURES_DIR).is_dir() and any((candidate / m).is_file() for m in MARKER_FILES):
            return candidate
    sys.exit(f"error: no project root above {start} (need {LECTURES_DIR}/ plus AUTHOR-BRIEF.md)")


def find_bank(root: Path, override: str | None) -> Path:
    if override:
        bank = Path(override).expanduser().resolve()
        if not bank.is_file():
            sys.exit(f"error: bank not found: {bank}")
        return bank
    matches = sorted(glob.glob(str(root / ".." / ".." / "questions-*" / "questions.md")))
    if len(matches) == 1:
        return Path(matches[0])
    if len(matches) > 1:
        # Generic disambiguation: a project named "<topic>-NN" (accessibility-01,
        # react-lecture-01) matches the bank folder "questions-<topic>".
        stem = re.sub(r"-(lecture-)?\d+$", "", root.name)
        prefixed = [m for m in matches if Path(m).parent.name == f"questions-{stem}"]
        if len(prefixed) == 1:
            return Path(prefixed[0])
        sys.exit("error: multiple banks found:\n  " + "\n  ".join(matches) + "\npass --bank to choose one")
    sys.exit(f"error: no questions-*/questions.md two levels above {root}; pass --bank")


def parse_bank_rows(bank: Path) -> list[str]:
    """Return the raw bank table rows, in file order, keyed by question number."""
    rows = {}
    for line in bank.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^\|\s*(\d+)\s*\|", line)
        if m and "---" not in line:
            rows.setdefault(int(m.group(1)), line.strip())
    if not rows:
        sys.exit(f"error: no numbered question rows in {bank}")
    return [rows[n] for n in sorted(rows)]


def existing_lecture_numbers(root: Path) -> set[int]:
    have = set()
    for f in (root / LECTURES_DIR).glob("*.md"):
        if m := re.fullmatch(r"(\d+)\.md", f.name):
            have.add(int(m.group(1)))
    return have


# ---------------- the task ----------------

def lecture_filename(n: int) -> str:
    return f"{n:02d}.md"


def row_number(row: str) -> int:
    return int(re.match(r"\|\s*(\d+)", row).group(1))


def build_prompt(root: Path, row: str, n: int, fix_warnings: str = "") -> str:
    brief = (root / "AUTHOR-BRIEF.md").read_text(encoding="utf-8")
    target = f"{LECTURES_DIR}/{lecture_filename(n)}"
    fix_block = f"\n\nThe file {target} exists but the build reported these violations you must repair in place:\n{fix_warnings}\n" if fix_warnings else ""
    return (
        "You are writing one lecture for the interview series whose project folder you are standing in. "
        "Read instructions.md (the project law) first, then follow it exactly.\n\n"
        f"--- AUTHOR-BRIEF (the working subset you must obey) ---\n{brief}\n--- END BRIEF ---\n\n"
        f"The question row from the bank:\n{row}\n\n"
        f"Your task: create the lecture file at {target} for this exact question, "
        f"following instructions.md and the brief (Opening Ladder, the canvas panel before the first "
        f"code fence, a verbatim quote with its citation path, the summary shape, the closing table "
        f"as the last block). Write ONLY {target}; do not modify any other file.{fix_block}\n"
        f"When the file is complete, print the single line: DONE {n}"
    )


AGY_FALLBACK = Path.home() / ".local" / "bin" / "agy"


def resolve_engine(preferred: str | None) -> tuple[str, str]:
    """Return (engine, executable). agy first (user request), gemini as fallback."""
    order = [preferred] if preferred else ["agy", "gemini"]
    for name in order:
        if name == "agy":
            found = shutil.which("agy") or (str(AGY_FALLBACK) if AGY_FALLBACK.is_file() else None)
        else:
            found = shutil.which("gemini")
        if found:
            return name, found
    sys.exit("error: neither agy (Antigravity CLI) nor gemini found; install one or pass --engine with a full path")


def run_agent(engine: str, exe: str, root: Path, prompt: str, model: str | None, timeout: int) -> tuple[int, str]:
    # The agent's own guard (agy --print-timeout defaults to 5m) must never fire
    # before ours; give it the full budget and keep a small buffer for startup.
    minutes = max(1, timeout // 60)
    if engine == "agy":
        cmd = [exe, "-p", prompt, "--dangerously-skip-permissions", f"--print-timeout", f"{minutes}m"]
        if model:
            cmd += ["--model", model]
        env = {**os.environ}
    else:
        cmd = [exe, "--yolo"]
        if model:
            cmd += ["--model", model]
        cmd += ["-p", prompt]
        # Headless gemini needs the workspace trusted; without this gemini 0.4x
        # refuses --yolo outside interactive trust setup.
        env = {**os.environ, "GEMINI_CLI_TRUST_WORKSPACE": "true"}
    try:
        proc = subprocess.run(cmd, cwd=str(root), capture_output=True, text=True, timeout=timeout + 60, env=env)
        return proc.returncode, (proc.stdout + "\n" + proc.stderr).strip()
    except subprocess.TimeoutExpired:
        return 124, f"{engine} interaction timed out after {timeout}s and was killed"


def run_build(root: Path) -> list[str]:
    """Return the build log's warn lines for the lecture just written."""
    try:
        proc = subprocess.run(["node", BUILD_SCRIPT, "--no-pdf"], cwd=str(root), capture_output=True, text=True, timeout=300)
        return [l.strip() for l in (proc.stdout + proc.stderr).splitlines() if l.strip().startswith("warn")]
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return []


# ---------------- the loop ----------------

def main() -> None:
    ap = argparse.ArgumentParser(description="Create the next N missing lectures, one fresh Gemini interaction each.")
    ap.add_argument("--path", required=True, help="project folder (or any folder inside it, e.g. .../md-lectures-pdf)")
    ap.add_argument("--count", type=int, required=True, help="number of remaining lectures to create")
    ap.add_argument("--bank", help="explicit path to questions.md (default: discovered ../../questions-*/questions.md)")
    ap.add_argument("--engine", choices=["agy", "gemini"], help="agent CLI to drive (default: agy, gemini as fallback)")
    ap.add_argument("--model", help="gemini model override (e.g. gemini-2.5-pro)")
    ap.add_argument("--timeout", type=int, default=1200, help="seconds to wait per gemini interaction (default 1200)")
    ap.add_argument("--no-build", action="store_true", help="skip the build-and-fix round after each lecture")
    ap.add_argument("--dry-run", action="store_true", help="show the plan and prompt preview without invoking gemini")
    args = ap.parse_args()

    root = find_project_root(Path(args.path).expanduser().resolve())
    bank = find_bank(root, args.bank)
    engine, exe = resolve_engine(args.engine)
    rows = parse_bank_rows(bank)
    have = existing_lecture_numbers(root)
    missing = [r for r in rows if row_number(r) not in have]

    print(f"project : {root}")
    print(f"bank    : {bank} ({len(rows)} questions)")
    print(f"engine  : {engine} ({exe})")
    print(f"written : {sorted(have) if have else 'none yet'}")
    todo = missing[: args.count]
    if not todo:
        print("nothing to do: every bank question already has a lecture.")
        return
    print(f"plan    : {len(missing)} missing, creating the next {len(todo)} -> "
          + ", ".join(str(row_number(r)) for r in todo))
    print()

    if args.dry_run:
        n = row_number(todo[0])
        preview = build_prompt(root, todo[0], n)
        print(f"--- prompt preview for lecture {n} ---\n{preview[:1200]}\n... (truncated)")
        return

    ok, failed = [], []
    for row in todo:
        n = row_number(row)
        target = root / LECTURES_DIR / lecture_filename(n)
        print(f"=== lecture {n} ({time.strftime('%H:%M:%S')}) ===")
        print(f"question: {row[:110]}")

        created = False
        for attempt in (1, 2):
            print(f"{engine} interaction {attempt} for md-lectures/{lecture_filename(n)} ...")
            code, output = run_agent(engine, exe, root, build_prompt(root, row, n), args.model, args.timeout)
            if code == 0 and target.is_file() and target.stat().st_size >= MIN_LECTURE_BYTES:
                created = True
                print(f"created : md-lectures/{lecture_filename(n)} ({target.stat().st_size} bytes)")
                break
            reason = f"{engine} failed" if code != 0 else "file missing or too small after run"
            print(f"attempt {attempt} failed ({reason}); {'retrying' if attempt == 1 else 'giving up on this lecture'}")
            print("  agent output tail: " + output[-400:].replace("\n", "\n  "))

        if not created:
            failed.append(n)
            continue

        if not args.no_build and (root / BUILD_SCRIPT).is_file():
            warns = [w for w in run_build(root) if lecture_filename(n) in w]
            if warns:
                print(f"build   : {len(warns)} warning(s); one fix round with a fresh interaction")
                code, output = run_agent(engine, exe, root, build_prompt(root, row, n, fix_warnings="\n".join(warns)), args.model, args.timeout)
                warns2 = [w for w in run_build(root) if lecture_filename(n) in w]
                if warns2:
                    print(f"build   : still {len(warns2)} warning(s) after the fix round:")
                    for w in warns2:
                        print("  " + w)
                    failed.append(n)
                    continue
            print("build   : clean (zero warnings)")
        ok.append(n)
        print()

    print(f"summary : {len(ok)} created" + (f" ({', '.join(map(str, ok))})" if ok else "")
          + (f"; {len(failed)} need attention ({', '.join(map(str, failed))})" if failed else ""))
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
