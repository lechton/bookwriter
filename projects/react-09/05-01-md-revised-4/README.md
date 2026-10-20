# Revision 4: revision 3 with code balloons

Revision 4 is a copy of each accepted revision 3 lesson (`04-01-md-revised-3/`) with one change: its code is drawn as the full lecture draws it, light, with white and grey lines in turn, and its comments become balloons that point at a dotted-underlined token. The text, the figures, and the examples are revision 3's and are written there; this folder only adds the balloons. Lectures 3, 10, and 11 are done.

The pass is described in `skills/v8.1/summary-revision-4`: how a lesson is copied, which blocks get a balloon and what it says, the width each code line fits, what the build draws, and how a copy is archived when revision 3 changes. #2026_10_17_04_group_3

## The folder

- `v1/NN.md`: the copies with their balloons. Build each from `projects/react-08` with `node src/build-revised-4.mjs NN`; the build lists any block still missing a balloon as a `[CHECK FAILED]` line.
- `../05-02-md-revised-4-html/v1/` and `../05-03-md-revised-4-pdf/v1/`: the outputs, in the `original` theme.
- Code: `src/build-revised-4.mjs` and `src/revised-4/editor.mjs`. Styles: `src/revised-4/base.css` and `src/revised-4/themes/original.css`.
