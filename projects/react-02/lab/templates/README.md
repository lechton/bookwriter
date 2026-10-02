# Lab Figure Templates

Archived figure designs for the React Interview Lectures lab paths.

- `01-01-forensic-dom-drift-duel-lavender.html` — the lavender "duel" panel
  (manual wires vs. reactive pipeline), an early iteration. Kept as palette
  reference.
- `01-01-forensic-dom-drift-minimal.html` — two-column minimal diagram, a
  later iteration before the TSX-based design.
- `01-01-forensic-dom-drift-tsx-literal.html` — direct transcription of
  `react-lecture-02/various/html/manual_vs_declarative_react.tsx` at browser
  scale (large paddings/fonts, `shadow-sm` softeners). Kept for comparison.

Current live figure: `01-forensic-investigator/figures/01-01-forensic-dom-drift.html`
— the TSX design **adapted** to the figure slot: same structure (title above
frame, header info row, event pill, Imperative (with JavaScript) / VS /
Declarative (with React) columns, orange stale cell) and same palette
(`#f5effd` frame, violet accents, orange failure), but print-scale type and
spacing, thin 1px hairlines, and **no shadows anywhere** (`box-shadow: none`
on every element, including the root, which also strips the
`lecture.css` `.component-explorer` grey border/white fill/overflow
clip that wraps every figure card).
