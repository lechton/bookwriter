#!/bin/sh
# Full rewrite of one lesson or a range: Opus 5.5 high writes NN.md from react-10,
# then Gemini 3.8 Flash high (Antigravity account) writes NN-gemini.md, then everything is committed and pushed.
# Opus runs on the Factory Droid account.
# Usage, from projects/react-11:  ./rewrite_full.sh 46   or   ./rewrite_full.sh 47 58
set -e
cd "$(dirname "$0")"
[ -n "$1" ] || { echo "usage: ./rewrite_full.sh FROM [TO]"; exit 1; }
FROM=$1; TO=${2:-$1}
LECT=01-02-md-LECTURES/v1
HTML=01-03-md-lectures-HTML/v1/theme1
MARK=$(mktemp)

# The soft flow's cleanup sends stop signals that killed this loop, even from
# another process group. The loop ignores those signals; each factory command
# runs in its own group with the default signal behavior restored, so it can
# still be stopped. Stop the loop itself with: kill -9 <pid>.
trap '' TERM HUP INT
run_alone() {
  python3 -c 'import os,sys,signal
os.setpgrp()
for s in (signal.SIGTERM, signal.SIGHUP, signal.SIGINT):
    signal.signal(s, signal.SIG_DFL)
os.execvp(sys.argv[1], sys.argv[1:])' "$@"
}

# A kill can land seconds before the agent saves its files, while the agent
# finishes on its own in Synara. Wait for both files instead of checking once.
wait_new() {
  T=0
  until [ "$1" -nt "$MARK" ] && [ "$2" -nt "$MARK" ]; do
    T=$((T+10))
    [ "$T" -gt 1800 ] && return 1
    sleep 10
  done
}

# The soft agent commits in the same repo; a clash on git's lock must retry,
# not kill the loop.
g() {
  T2=0
  until "$@"; do
    T2=$((T2+1))
    [ "$T2" -ge 30 ] && return 1
    sleep 2
  done
}

stage_run_files() {
  find audit/bookrewrite audit/bookrewrite-soft "$LECT/archive" "$HTML/archive" \
    -type f -newer "$MARK" -exec g git add -- {} + 2>/dev/null || true
  g git add -- ARCHIVE-LOG.md
}

for N in $(seq -f %02g "$FROM" "$TO"); do
  touch "$MARK"
  run_alone factory workflow bookrewrite lesson=$N model=droid/claude-opus-5-5:high
  wait_new "$LECT/$N.md" "$HTML/$N.html" || { echo "Lesson $N: Opus wrote no new $N.md, stopping"; exit 1; }
  g git add -- "$LECT/$N.md" "$HTML/$N.html"
  stage_run_files
  g git commit -q -m "rewrite lesson $N from react-10 with Opus 5.5 high ($N)"

  touch "$MARK"
  # The Gemini flow ends as "stopped" with an error code even when it wrote and pushed its file; the check below decides.
  run_alone factory workflow bookrewrite-soft lesson=$N "model=antigravity/Gemini 3.8 Flash:high" || true
  wait_new "$LECT/$N-gemini.md" "$HTML/$N-gemini.html" || { echo "Lesson $N: Gemini wrote no new $N-gemini.md, stopping"; exit 1; }
  g git add -- "$LECT/$N-gemini.md" "$HTML/$N-gemini.html"
  stage_run_files
  git diff --cached --quiet || g git commit -q -m "keep the run notes of lesson $N"
done
g git push
echo "Done: lessons $FROM to $TO rewritten, committed, and pushed."
