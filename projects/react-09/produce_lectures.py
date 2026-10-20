#!/usr/bin/env python3
"""
produce_lectures.py — Antigravity (agy) CLI orchestrator for react-lecture-06.

Runs one fresh agy (Gemini) CLI session per lecture. The script algorithmically
finds the questions that are not yet answered (a question is answered when its
production lecture 01-02-md-LECTURES/{nn}.md exists on disk), takes the next
unanswered one in bank order, and prompts the agent to write the Phase 1
pre-lecture and the Phase 2 production lecture for it under the project's
proper instruction system: the skills/ folder (load order per skills/README.md),
never the frozen legacy files in skills/old-instructions/.

Each session writes the pre-lecture (01-01-md-PRE-lectures/{nn}.md), the production
lecture (01-02-md-LECTURES/{nn}.md) with its HTML figure files, then builds the
project with `node src/build-lectures.mjs` until the build is clean, so the
per-lecture PDF (01-04-md-lectures-PDF/{nn}.pdf) and the combined course-reader deck
are produced. Only after the current question's PDF is verified fresh on disk
does the script launch the next iteration with a brand-new agy process, again
on the next unanswered question. Any failure (model not available, agy exits
non-zero, missing or stale PDF/deck) stops the whole run.

Usage:
    python3 produce_lectures.py 3                     # next 3 UNANSWERED questions, auto-detect start
    python3 produce_lectures.py --start 40 --chapters 1
                                                       # (--start scans forward to the next unanswered
    python3 produce_lectures.py --dry-run             # show plan + prompt, invoke nothing)
    python3 produce_lectures.py --model gemini-3.1-pro-high --chapters 2
    python3 produce_lectures.py --start 40 --force    # deliberately rewrite answered Q40

Question ranges:
    python3 produce_lectures.py --range 41-60         # every unanswered question in Q41-Q60, in order
    python3 produce_lectures.py --range 41-60 --chapters 2
                                                       # (a range defaults to the whole span; --chapters caps it)
    python3 produce_lectures.py --range 40-45 --force # rewrite ALL questions in the span, answered or not
"""

import argparse
import glob
import json
import os
import queue
import re
import subprocess
import sys
import threading
import time
from datetime import datetime
from pathlib import Path

# ----------------------------------------------------------------------------- paths

PROJECT = Path(__file__).resolve().parent
WORKSPACE = PROJECT.parent.parent
PROMPT_TEMPLATE = PROJECT / "produce_prompt.md"
QUESTIONS_MD = PROJECT / "questions" / "questions.md"

def resolve_skills_dir(project_dir: Path):
    skills_base = project_dir / "skills"
    if skills_base.is_dir():
        version_dirs = [
            c for c in skills_base.iterdir()
            if c.is_dir() and re.match(r"^v?\d+(\.\d+)*", c.name, re.I)
        ]
        if version_dirs:
            def sort_key(p):
                parts = re.sub(r"^v", "", p.name, flags=re.I).split(".")
                return [int(x) if x.isdigit() else 0 for x in parts]
            version_dirs.sort(key=sort_key)
            latest = version_dirs[-1]
            raw_v = re.sub(r"^v", "", latest.name, flags=re.I)
            return latest, f"v{raw_v}", f"skills/{latest.name}"
    return skills_base, "v6.0", "skills"

SKILLS_DIR, SKILLS_VERSION, SKILLS_REL = resolve_skills_dir(PROJECT)
SKILLS_README = SKILLS_DIR / "README.md"

def resolve_version_dir(base_dir: Path, explicit_version: str = None) -> tuple[Path, str, str]:
    """Finds the version directory inside base_dir.
    Returns (resolved_path, version_tag, rel_path).
    Defaults to latest version folder if version folders exist, else base_dir."""
    if not base_dir.is_dir():
        return base_dir, "", base_dir.name
    if explicit_version:
        compound_match = re.match(r"^v?(\d+(?:\.\d+)*)-v?(\d+)$", explicit_version, re.I)
        if compound_match:
            explicit_version = f"v{compound_match.group(2)}"
        ver = explicit_version if explicit_version.startswith("v") else f"v{explicit_version}"
        target = base_dir / ver
        if target.is_dir():
            return target, ver, f"{base_dir.name}/{ver}"
        raw_target = base_dir / explicit_version
        if raw_target.is_dir():
            return raw_target, explicit_version, f"{base_dir.name}/{explicit_version}"
        return target, ver, f"{base_dir.name}/{ver}"
    
    subdirs = [
        d for d in base_dir.iterdir()
        if d.is_dir() and re.match(r"^v?\d+(\.\d+)*", d.name, re.I)
    ]
    if subdirs:
        def sort_key(p):
            parts = re.sub(r"^v", "", p.name, flags=re.I).split(".")
            return [int(x) if x.isdigit() else 0 for x in parts]
        subdirs.sort(key=sort_key)
        latest = subdirs[-1]
        raw_v = re.sub(r"^v", "", latest.name, flags=re.I)
        return latest, f"v{raw_v}", f"{base_dir.name}/{latest.name}"
    return base_dir, "", base_dir.name


LEC_DIR, LEC_VERSION, LEC_REL = resolve_version_dir(PROJECT / "01-02-md-LECTURES")
PRE_DIR, PRE_VERSION, PRE_REL = resolve_version_dir(PROJECT / "01-01-md-PRE-lectures", LEC_VERSION)
PDF_DIR, PDF_VERSION, PDF_REL = resolve_version_dir(PROJECT / "01-04-md-lectures-PDF", LEC_VERSION)
FIG_DIR = LEC_DIR / "figures"
LOG_DIR = PROJECT / "agy-logs"


def set_active_version(explicit_version: str = None):
    global LEC_DIR, LEC_VERSION, LEC_REL
    global PRE_DIR, PRE_VERSION, PRE_REL
    global PDF_DIR, PDF_VERSION, PDF_REL
    global FIG_DIR
    LEC_DIR, LEC_VERSION, LEC_REL = resolve_version_dir(PROJECT / "01-02-md-LECTURES", explicit_version)
    PRE_DIR, PRE_VERSION, PRE_REL = resolve_version_dir(PROJECT / "01-01-md-PRE-lectures", explicit_version or LEC_VERSION)
    PDF_DIR, PDF_VERSION, PDF_REL = resolve_version_dir(PROJECT / "01-04-md-lectures-PDF", explicit_version or LEC_VERSION)
    FIG_DIR = LEC_DIR / "figures"

DECK_GLOB = "React*.pdf"           # combined course-reader PDFs regenerated by the build
MAX_QUESTION = 180                 # size of the question bank
DEFAULT_AGY = "agy"                 # Antigravity CLI on PATH (v1.2.5: agy)
DEFAULT_MODEL = "gemini-3.8-flash-high"
DEFAULT_TIMEOUT_MIN = 120          # per-iteration agy --print-timeout

# Verification floors: catch stub files the agent may leave behind.
MIN_PRE_BYTES = 200
MIN_LEC_BYTES = 1000
MIN_PDF_BYTES = 20000


def bn(n):
    """Lecture file basename: zero-padded for 1-99, natural for 100+ (01.md, 100.md)."""
    return f"{n:02d}"


# ----------------------------------------------------------------------------- question bank

def answered_questions():
    """Sorted list of question numbers whose production lecture exists on disk."""
    if not LEC_DIR.is_dir():
        return []
    return sorted(int(m.group(1)) for f in os.listdir(LEC_DIR)
                  if (m := re.match(r"^(\d+)\.md$", f)))


def next_unanswered(start=1):
    """Lowest question >= start with no production lecture yet (None = bank fully answered)."""
    answered = set(answered_questions())
    for n in range(max(1, start), MAX_QUESTION + 1):
        if n not in answered:
            return n
    return None


def parse_range(spec):
    """Parse 'LO-HI' (an inclusive question-number span) into (lo, hi)."""
    m = re.match(r"^(\d+)\s*-\s*(\d+)$", str(spec).strip())
    if not m:
        sys.exit(f"FATAL: --range expects LO-HI (for example 41-60), got: {spec!r}")
    lo, hi = int(m.group(1)), int(m.group(2))
    if not (1 <= lo <= hi <= MAX_QUESTION):
        sys.exit(f"FATAL: --range {lo}-{hi} is outside the bank (1-{MAX_QUESTION}) "
                 f"or empty (LO must be <= HI).")
    return lo, hi


def parse_question_row(n):
    """Pull the row `| n | tier | topic | question | hook |` from questions.md."""
    if not QUESTIONS_MD.is_file():
        sys.exit(f"FATAL: question bank not found: {QUESTIONS_MD}")
    text = QUESTIONS_MD.read_text(encoding="utf-8")
    for line in text.splitlines():
        if not re.match(rf"^\|\s*{n}\s*\|", line):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) >= 5:
            return {"tier": cells[1], "topic": cells[2],
                    "question": cells[3], "hook": cells[4]}
    return None


# ----------------------------------------------------------------------------- prompt

def resolve_corpus():
    """Absolute corpus path from the workspace config (`node tools/resolve.mjs corpus`)."""
    try:
        proc = subprocess.run(["node", "tools/resolve.mjs", "corpus"], cwd=str(WORKSPACE),
                              capture_output=True, text=True, timeout=30)
    except FileNotFoundError:
        sys.exit("FATAL: node not found; it is needed to resolve the corpus path")
    path = proc.stdout.strip()
    if proc.returncode != 0 or not path:
        sys.exit("FATAL: the corpus key is not configured: " + (proc.stderr.strip() or "no output")
                 + "\nSet it in bookwriter-project.local.json at the workspace root.")
    if not Path(path).is_dir():
        sys.exit(f"FATAL: the corpus folder does not exist: {path}")
    return path


def build_prompt(n, row, corpus):
    """The session header (question row, working-directory check) followed by the editable
    template in PROMPT_TEMPLATE with its placeholders filled for this run."""
    if not PROMPT_TEMPLATE.is_file():
        sys.exit(f"FATAL: prompt template not found: {PROMPT_TEMPLATE}")
    body = PROMPT_TEMPLATE.read_text(encoding="utf-8").strip()
    values = {
        "PROJECT": PROJECT.name.replace("-", " ").title(),
        "NN": bn(n),
        "SKILLS_DIR": SKILLS_REL,
        "PRE_DIR": PRE_REL,
        "LEC_DIR": LEC_REL,
        "CORPUS": corpus,
    }
    for key, value in values.items():
        body = body.replace("{" + key + "}", value)
    leftover = sorted(set(re.findall(r"\{[A-Z_]+\}", body)))
    if leftover:
        sys.exit(f"FATAL: unknown placeholder(s) in {PROMPT_TEMPLATE.name}: {', '.join(leftover)}")
    # The agy session starts outside the project, so the agent must cd in first. Added after
    # Q16: that session spent its whole turn on `find` and exited 0 with zero deliverables.
    header = f"""ppp: proceed immediately, execute everything, ask no confirmation questions.

Your FIRST command must be `cd {PROJECT} && pwd && ls`. Do not search for the project with `find`. Finish only after {PRE_REL}/{bn(n)}.md, {LEC_REL}/{bn(n)}.md, and {PDF_REL}/{bn(n)}.pdf exist, checked with `ls -la` on those paths.

The question row, verbatim from questions/questions.md:
- Number: {n}
- Tier: {row['tier']}
- Topic tag: {row['topic']}
- Question (copy verbatim into the lecture callout): {row['question']}
- Hook (the seed of the opening scenario; grow it, never replace it): {row['hook']}"""
    return header + "\n\n" + body


def archive_for_rewrite(n):
    """Move every existing file of a lecture (blueprint, lecture, figures, HTML, PDF, revised
    copies) into their archive folders before a session starts, so the session writes from
    scratch, as the prompt template promises. Runs on every launch (a forced rewrite, or an
    unanswered lesson that kept a blueprint or figures from an interrupted run). Delegates to
    archive_lecture.py, which never deletes or overwrites."""
    import archive_lecture
    moves = archive_lecture.archive(n, version=LEC_VERSION or None, reason="produce_lectures: archive before writing")
    return [dest for _, dest in moves]


def archive_lecture_plan(n):
    """The moves archive_for_rewrite would make, without moving anything (for --dry-run)."""
    import archive_lecture
    return archive_lecture.archive(n, version=LEC_VERSION or None, dry_run=True)


# ----------------------------------------------------------------------------- agy runner

def _snippet(text, limit=110):
    """Collapse whitespace and truncate an event text for the console line."""
    s = re.sub(r"\s+", " ", str(text)).strip()
    return s if len(s) <= limit else s[:limit - 3] + "..."


def summarize_event(raw_line):
    """One console line summarizing a stream-json event (raw line is logged verbatim)."""
    try:
        obj = json.loads(raw_line)
    except (ValueError, TypeError):
        return _snippet(raw_line) or "(empty line)"
    ev = obj.get("event", "?")
    if ev == "init":
        init = obj.get("init", {})
        return f"session started: model {init.get('model', '?')}, " \
               f"{len(init.get('tools', []))} tools, permission {init.get('permission_mode', '?')}"
    if ev == "step_update":
        d = obj.get("step_update", {})
        parts = [f"step {d.get('step_index', '?')} {d.get('state', '?')} "
                 f"{d.get('step_type', '?')}"]
        if d.get("duration_seconds") is not None:
            parts[0] += f" ({d['duration_seconds']:.1f}s)"
        for key in ("tool_name", "name", "title", "file_path", "path", "command"):
            if d.get(key):
                parts.append(_snippet(d[key], 80))
                break
        if d.get("text_delta"):
            parts.append(_snippet(d["text_delta"]))
        return " | ".join(p for p in parts if p)
    if ev == "result":
        d = obj.get("result", {})
        base = f"RESULT {d.get('status', '?')} ({d.get('duration_seconds', 0):.0f}s, " \
               f"{d.get('num_turns', '?')} turns)"
        if d.get("response"):
            base += " | " + _snippet(d["response"])
        return base
    # Unknown event shape: compact dump, truncated.
    return _snippet(json.dumps(obj, ensure_ascii=False), 200)


def preflight_model(agy, model):
    """Check the agy CLI is alive and the model is listed. Returns an error string or None."""
    try:
        proc = subprocess.run([agy, "models"], capture_output=True, text=True, timeout=120)
    except FileNotFoundError:
        return f"agy CLI not found at '{agy}' (is it installed and on PATH?)"
    except subprocess.TimeoutExpired:
        return "`agy models` preflight timed out after 120s"
    if proc.returncode != 0:
        return f"`agy models` exited {proc.returncode}: {proc.stderr.strip()[:300]}"
    if model not in (proc.stdout or ""):
        return f"model '{model}' is not available to the CLI right now. Run `agy models` to see the current list."
    return None


def run_agy(agy, model, effort, timeout_min, skip_permissions, prompt, corpus, log_path, t0):
    """One fresh agy process for one iteration, in stream-json mode: every event the CLI
    emits (session init, each step update, the final result) is summarized to the console
    with an elapsed timestamp the moment it arrives, the raw event line goes to the log
    verbatim, and a heartbeat prints every HEARTBEAT_SEC seconds of silence. Returns exit code."""
    cmd = [agy, "--prompt", prompt, "--model", model,
           "--add-dir", str(PROJECT),
           "--add-dir", corpus,
           "--output-format", "stream-json"]
    if effort:
        cmd += ["--effort", effort]
    if skip_permissions:
        cmd += ["--dangerously-skip-permissions"]
    cmd += ["--print-timeout", f"{timeout_min}m"]

    HEARTBEAT_SEC = 45

    with open(log_path, "w", encoding="utf-8") as log:
        log.write(f"# agy run | start {datetime.now().isoformat()}\n")
        log.write(f"# model: {model} | timeout: {timeout_min}m | cwd: {PROJECT}\n")
        log.write(f"# command flags: {cmd[:1]} <prompt {len(prompt)} chars> "
                  + " ".join(cmd[2:]) + "\n\n")
        log.write("=== PROMPT ===\n" + prompt + "\n\n=== OUTPUT ===\n")
        log.flush()

        print(f"    launching fresh agy session (model {model}, timeout {timeout_min}m)...",
              flush=True)
        proc = subprocess.Popen(cmd, cwd=str(PROJECT), stdout=subprocess.PIPE,
                                stderr=subprocess.STDOUT, text=True, bufsize=1)

        # Reader thread: pushes each output line onto a queue, then None at EOF, so the
        # main loop can wait with a timeout and print heartbeats during silent stretches.
        lines = queue.Queue()
        wrote_anything = []   # non-empty when the session performed a file-writing tool event
        WRITE_TOOLS = {"write_to_file", "replace_file_content",
                       "multi_replace_file_content", "sed_file"}

        def _reader():
            try:
                for line in proc.stdout:
                    lines.put(line)
            finally:
                lines.put(None)

        threading.Thread(target=_reader, daemon=True).start()

        watchdog = timeout_min * 60 + 600   # CLI kills itself at --print-timeout; this is the backstop
        started = time.time()
        try:
            while True:
                try:
                    line = lines.get(timeout=HEARTBEAT_SEC)
                except queue.Empty:
                    mins = (time.time() - started) / 60
                    msg = f"heartbeat: no CLI output for {HEARTBEAT_SEC}s " \
                          f"({mins:.1f} min into this question, process still running)"
                    print(f"    [{mins:4.1f}m] ... {msg}", flush=True)
                    log.write(f"# {msg}\n")
                    log.flush()
                    continue
                if line is None:
                    break
                mins = (time.time() - started) / 60
                log.write(line)
                log.flush()
                print(f"    [{mins:4.1f}m] {summarize_event(line)}", flush=True)
                try:
                    ev = json.loads(line).get("step_update") or {}
                    tname = ev.get("tool_name", "")
                    tinfo = ev.get("tool_info") or {}
                    if tname in WRITE_TOOLS:
                        wrote_anything.append(1)
                    elif tname == "run_command" and \
                            "build-lectures" in str(tinfo.get("parameters") or ""):
                        wrote_anything.append(1)
                except (ValueError, TypeError):
                    pass
            proc.wait(timeout=watchdog)
        except KeyboardInterrupt:
            print("\n    interrupted by user — terminating agy process", flush=True)
            proc.terminate()
            try:
                proc.wait(timeout=15)
            except subprocess.TimeoutExpired:
                proc.kill()
            return 130
        except subprocess.TimeoutExpired:
            print("    watchdog expired — killing agy process", flush=True)
            proc.kill()
            proc.wait()
            return 124
    if proc.returncode == 0 and not wrote_anything:
        print("    note: agy exited 0 with zero file-writing tool events; "
              "deliverables may be missing and the verification floors will confirm",
              flush=True)
    return proc.returncode


# ----------------------------------------------------------------------------- verification

def fresh(path, t0, min_bytes=0):
    return (path.is_file() and path.stat().st_size >= min_bytes
            and path.stat().st_mtime >= t0 - 5)


def verify_iteration(n, t0):
    """All gates must pass: prelecture, lecture, per-lecture PDF, reader deck. Returns failure list."""
    pre = PRE_DIR / f"{bn(n)}.md"
    lec = LEC_DIR / f"{bn(n)}.md"
    pdf = PDF_DIR / f"{bn(n)}.pdf"
    failures = []

    if not (pre.is_file() and pre.stat().st_size >= MIN_PRE_BYTES):
        failures.append(f"prelecture missing/stub: {pre}")
    if not (lec.is_file() and lec.stat().st_size >= MIN_LEC_BYTES):
        failures.append(f"lecture missing/stub: {lec}")
    if not fresh(pdf, t0, MIN_PDF_BYTES):
        failures.append(f"per-lecture PDF missing/stale/too small: {pdf}")
    decks = [Path(p) for p in glob.glob(str(PDF_DIR / DECK_GLOB))]
    if not decks or not any(fresh(d, t0) for d in decks):
        failures.append(f"course-reader deck not regenerated this run (glob: {PDF_DIR / DECK_GLOB})")
    return failures


# ----------------------------------------------------------------------------- main loop

def main():
    ap = argparse.ArgumentParser(
        description="Orchestrate the agy (Antigravity/Gemini) CLI to produce "
                    "react-lecture-06 lectures: one fresh CLI session per unanswered "
                    "question, verified end to end before the next one starts.")
    ap.add_argument("chapters", nargs="?", type=int, default=None,
                    help="how many unanswered questions/lectures to produce this run (default 1)")
    ap.add_argument("--chapters", dest="chapters_flag", type=int, default=None,
                    help="same as the positional argument")
    ap.add_argument("--start", type=int, default=None,
                    help="scan unanswered questions starting at this number "
                         "(default: scan the whole bank from Q1 for the first unanswered)")
    ap.add_argument("--range", dest="question_range", default=None, metavar="LO-HI",
                    help="process this inclusive span of question numbers (for example 41-60): "
                         "the unanswered ones in bank order by default, every question in the "
                         "span with --force; defaults to the whole span unless --chapters caps "
                         "it; mutually exclusive with --start")
    ap.add_argument("--model", default=DEFAULT_MODEL,
                    help=f"agy model slug (default: {DEFAULT_MODEL}; see `agy models`)")
    ap.add_argument("--effort", default=None, choices=["low", "medium", "high"],
                    help="optional reasoning effort flag passed through to agy")
    ap.add_argument("--timeout-min", type=int, default=DEFAULT_TIMEOUT_MIN,
                    help=f"per-iteration agy --print-timeout in minutes (default {DEFAULT_TIMEOUT_MIN})")
    ap.add_argument("--agy", default=DEFAULT_AGY,
                    help=f"path to the Antigravity CLI (default: {DEFAULT_AGY} on PATH)")
    ap.add_argument("--no-preflight", action="store_true",
                    help="skip the `agy models` availability check before each iteration")
    ap.add_argument("--no-skip-permissions", action="store_true",
                    help="do not pass --dangerously-skip-permissions to agy "
                         "(interactive permission prompts will then block print mode)")
    ap.add_argument("--force", action="store_true",
                    help="with --start: produce exactly that question even if its lecture "
                         "already exists (every file of that lecture is first moved to archive/ by archive_lecture.py, then rewritten); without --force, --start scans "
                         "forward to the next unanswered question")
    ap.add_argument("--version", default=None,
                    help="lecture version subdirectory (default: latest version, e.g. v1)")
    ap.add_argument("--dry-run", action="store_true",
                    help="print the plan, the parsed question row, and the prompt; invoke nothing")
    args = ap.parse_args()

    if args.version:
        set_active_version(args.version)

    chapters = args.chapters if args.chapters is not None else args.chapters_flag
    if chapters is not None and chapters < 1:
        sys.exit("FATAL: --chapters must be >= 1")

    # --- startup sanity
    if not (PROJECT / "src" / "build-lectures.mjs").is_file():
        sys.exit(f"FATAL: not inside the react-lecture-06 project (build script missing at {PROJECT}/src)")
    if not SKILLS_README.is_file():
        sys.exit(f"FATAL: the skills instruction system is missing ({SKILLS_REL}/README.md not found)")

    corpus = resolve_corpus()

    answered = answered_questions()
    answered_set = set(answered)
    scan_mode = True   # dynamic mode: after each success, find the next unanswered question
    queue = []         # question numbers to process, in order

    if args.question_range and args.start is not None:
        sys.exit("FATAL: use either --start or --range, not both")

    if args.question_range:
        lo, hi = parse_range(args.question_range)
        scan_mode = False
        if args.force:
            queue = list(range(lo, hi + 1))
            note = f"forced: every question in Q{lo}-Q{hi}, answered or not"
        else:
            queue = [q for q in range(lo, hi + 1) if q not in answered_set]
            if not queue:
                sys.exit(f"FATAL: every question in Q{lo}-Q{hi} is already answered; "
                         f"nothing to do (use --force --range to rewrite the span deliberately).")
            note = f"the {len(queue)} unanswered question(s) in Q{lo}-Q{hi}"
        if chapters is None:
            chapters = len(queue)   # a range defaults to the whole span
    elif args.force and args.start is not None:
        if not (1 <= args.start <= MAX_QUESTION):
            sys.exit(f"FATAL: --start {args.start} is outside the bank (1-{MAX_QUESTION}).")
        queue = [args.start]
        scan_mode = False
        note = "forced rewrite of an already-answered question"
    elif args.start is not None:
        n = next_unanswered(args.start)
        if n is None:
            sys.exit(f"FATAL: every question from Q{args.start} to Q{MAX_QUESTION} is already "
                     f"answered; nothing to do (use --force --start to rewrite one deliberately).")
        queue = [n]
        note = (f"first unanswered at or after Q{args.start}"
                if n != args.start else f"Q{args.start} (unanswered)")
    else:
        n = next_unanswered(1)
        if n is None:
            sys.exit(f"FATAL: all {MAX_QUESTION} questions are answered — the bank is exhausted.")
        queue = [n]
        note = "first unanswered in the whole bank"

    if chapters is None:
        chapters = 1

    compound_ver = f"{SKILLS_VERSION}-{LEC_VERSION.lstrip('v')}" if LEC_VERSION else SKILLS_VERSION
    print(f"react-lecture-06 agy orchestrator")
    print(f"  project      : {PROJECT}")
    print(f"  default ver  : {compound_ver} (skills {SKILLS_VERSION} + lessons {LEC_VERSION or 'root'})")
    print(f"  lectures dir : {LEC_REL} (Version {LEC_VERSION or 'root'})")
    print(f"  skills       : {SKILLS_REL} (Edition {SKILLS_VERSION})")
    print(f"  model        : {args.model}")
    print(f"  iterations   : {chapters}"
          + (f" (of {len(queue)} queued)" if not scan_mode and len(queue) > chapters else ""))
    print(f"  answered     : {len(answered)}/{MAX_QUESTION} "
          + ("(" + ", ".join(str(a) for a in answered) + ")" if answered else "(none)"))
    if args.question_range:
        print(f"  range        : Q{lo}-Q{hi}")
    print(f"  first question: Q{queue[0]} ({note})")

    n = queue[0]
    row = parse_question_row(n)
    if row is None:
        sys.exit(f"FATAL: question Q{n} not found in {QUESTIONS_MD}")
    prompt = build_prompt(n, row, corpus)

    if args.dry_run:
        print("\n=== DRY RUN — nothing will be invoked ===")
        print(f"\nPlan: {len(queue)} question(s) queued, {chapters} iteration(s) this run")
        print("  " + " ".join(f"Q{q}" for q in queue[:chapters])
              + (" ..." if len(queue) > chapters else ""))
        print(f"\nQuestion Q{n}:")
        for k, v in row.items():
            print(f"  {k:8}: {v}")
        print(f"\nagy command: {args.agy} --prompt <see below> --model {args.model}"
              f" --add-dir {PROJECT} --add-dir {corpus}"
              f"{' --effort ' + args.effort if args.effort else ''}"
              f"{' --dangerously-skip-permissions' if not args.no_skip_permissions else ''}"
              f" --print-timeout {args.timeout_min}m  (cwd: {PROJECT})")
        existing = archive_lecture_plan(n)
        if existing:
            print(f"\nBefore launch, archive_lecture.py would archive {len(existing)} file(s) of Q{n}:")
            for src, dest in existing:
                print(f"  {src.relative_to(PROJECT)} -> {dest.relative_to(PROJECT)}")
        print("\n=== PROMPT ===\n")
        print(prompt)
        print("\n=== END DRY RUN ===")
        return

    LOG_DIR.mkdir(exist_ok=True)
    results = []
    print()

    produced = 0
    while queue and produced < chapters:
        n = queue.pop(0)
        row = parse_question_row(n)
        if row is None:
            print(f"    Q{n} not found in the question bank — stopping.")
            results.append((n, "no-question-row", 0, None, "row missing in questions.md"))
            break
        stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        for dest in archive_for_rewrite(n):
            print(f"    archived before writing: {dest.relative_to(PROJECT)}")
        prompt = build_prompt(n, row, corpus)
        log_path = LOG_DIR / f"q{bn(n)}_{stamp}.log"

        print(f"[{produced + 1}/{chapters}] Q{n} — tier {row['tier']} — {row['topic']}")
        print(f"    log: {log_path}")

        if not args.no_preflight:
            err = preflight_model(args.agy, args.model)
            if err:
                print(f"    PREFLIGHT FAILED: {err}")
                results.append((n, "preflight-failed", 0, log_path, err))
                break

        t0 = time.time()
        code = run_agy(args.agy, args.model, args.effort, args.timeout_min,
                       not args.no_skip_permissions, prompt, corpus, log_path, t0)
        elapsed = time.time() - t0

        if code != 0:
            print(f"    agy exited {code} after {elapsed / 60:.1f} min — stopping (log: {log_path})")
            results.append((n, f"agy-exit-{code}", elapsed, log_path, "see log"))
            break

        failures = verify_iteration(n, t0)
        if failures:
            for f in failures:
                print(f"    VERIFY FAILED: {f}")
            print(f"    Q{n} not verified — stopping. Fix the issue, then rerun; "
                  f"the run resumes where it stopped. (log: {log_path})")
            results.append((n, "verify-failed", elapsed, log_path, "; ".join(failures)))
            break

        mins = elapsed / 60
        print(f"    VERIFIED: prelecture + lecture + {bn(n)}.pdf + reader deck all present "
              f"({mins:.1f} min)")
        results.append((n, "ok", elapsed, log_path, ""))
        produced += 1

        # dynamic mode only: append the next unanswered question in bank order
        if scan_mode:
            nxt = next_unanswered(n + 1)
            if nxt is None:
                print(f"    question bank exhausted: every question is now answered.")
                break
            queue.append(nxt)

    # --- final report
    print("\n" + "=" * 72)
    print("RUN REPORT")
    print("=" * 72)
    ok = sum(1 for r in results if r[1] == "ok")
    for n, status, elapsed, log_path, note in results:
        mark = "DONE" if status == "ok" else "STOP"
        print(f"  Q{n:<4} {mark:5} {status:16} {elapsed / 60:6.1f} min  "
              + (Path(log_path).name if log_path else "-")
              + (f"  [{note}]" if note else ""))
    print(f"\n  {ok}/{len(results)} iteration(s) completed successfully"
          + ("" if ok == chapters else " — run stopped early; rerun to resume"))
    sys.exit(0 if ok == chapters and ok == len(results) else 1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\ninterrupted — no partial iteration will be trusted; rerun to resume")
        sys.exit(130)
