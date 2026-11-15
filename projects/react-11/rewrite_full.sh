#!/bin/sh
# Full rewrite of one lesson or a range: Opus 5.5 high writes NN.md from react-10,
# then Gemini 3.8 Flash high writes NN-gemini.md, then everything is committed and pushed.
# Usage, from projects/react-11:  ./rewrite_full.sh 46   or   ./rewrite_full.sh 47 58
set -e
cd "$(dirname "$0")"
[ -n "$1" ] || { echo "usage: ./rewrite_full.sh FROM [TO]"; exit 1; }
FROM=$1; TO=${2:-$1}
LECT=01-02-md-LECTURES/v1
HTML=01-03-md-lectures-HTML/v1/theme1
MARK=$(mktemp)

stage_run_files() {
  find audit/bookrewrite audit/bookrewrite-soft "$LECT/archive" "$HTML/archive" \
    -type f -newer "$MARK" -exec git add -- {} + 2>/dev/null || true
  git add -- ARCHIVE-LOG.md
}

for N in $(seq -f %02g "$FROM" "$TO"); do
  touch "$MARK"
  factory workflow bookrewrite lesson=$N model=droid/claude-opus-5-5:high
  [ "$LECT/$N.md" -nt "$MARK" ] || { echo "Lesson $N: Opus wrote no new $N.md, stopping"; exit 1; }
  git add -- "$LECT/$N.md" "$HTML/$N.html"
  stage_run_files
  git commit -q -m "rewrite lesson $N from react-10 with Opus 5.5 high ($N)"

  touch "$MARK"
  factory workflow bookrewrite-soft lesson=$N model=droid/gemini-3.8-flash:high
  [ "$LECT/$N-gemini.md" -nt "$MARK" ] || { echo "Lesson $N: Gemini wrote no new $N-gemini.md, stopping"; exit 1; }
  git add -- "$LECT/$N-gemini.md" "$HTML/$N-gemini.html"
  stage_run_files
  git diff --cached --quiet || git commit -q -m "keep the run notes of lesson $N"
done
git push
echo "Done: lessons $FROM to $TO rewritten, committed, and pushed."
