# Skill: Write a Chapter's Lecture in Parts (one part per coding snippet)

## What this skill is for
A chapter is a folder of coding snippets — one per section md — each illustrating a single concept. This skill turns the whole chapter into one audio lecture delivered in PARTS: one self-contained lecture part per snippet, written into the chapter's `md-lecture/` folder, that read end to end as a single continuous spoken lecture. It is written to be executed by an AI agent — for example Google Gemini inside Antigravity.

This skill is ORCHESTRATION only. The method for writing any single part is `write_lecture_plus_5.md`. Read that skill first and obey it in full for every part: the listener and the leaky buffer, the five doctrines, the World / Term / Mechanism systems, the design pass, the voice and its eight banned moves, TTS-safety, and the eight-gate final check. This skill adds three things on top — how to SPLIT a chapter into parts, how to keep the parts ONE lecture, and how to OUTPUT them.

## The core principle: the snippet is a seed, not a fence
Each coding snippet is the OPPORTUNITY to teach a concept — never the limit of what its part teaches. A part is anchored to its snippet's concept, but it expands to whatever that concept rests on: the host-language mechanism one layer down, the contrast case the snippet does not show, the foundation the listener needs before the snippet can mean anything. That is `write_lecture_plus_5.md`'s own law — every rule rides on a mechanism; depth has a floor, not a ceiling — read here as permission. Go wherever teaching the concept honestly leads, including well outside the snippet. The snippet anchors the part; it does not cage it. A part that taught only the snippet's one visible case has failed the predictive test.

## Read the inputs first
1. `chapter.md` — the chapter's spine: the ordered section list, what each section teaches, and the HOOK each section hands to the next. The connective tissue is already designed here. Honour the order and the hooks.
2. `md/NN-*.md` — the sections, in order. Each carries the snippet (code plus its comments), a Summary, and an Explanation. Treat each as the SOURCE TEXT for that part — the material and the standard of accuracy — exactly as `write_lecture_plus_5.md` treats any source: teach the material, not the file. The part will often look structurally unlike the md, and that is correct.
3. The Explanation and the code comments hand you the mechanism and the contrasts to teach. Never narrate the code; teach the concept it stands for.

## The chapter design pass — run it ONCE, before any part
The parts cohere only if they share one design. Before writing a single part, run `write_lecture_plus_5.md`'s design pass at CHAPTER scope and record it in `md-lecture/_chapter-design.md`:
- ONE example world for the whole chapter — the example bible — with each entity's point of first introduction placed across the parts. (Inhabit the chapter's existing world consistently; do not restart it per part.)
- ONE term ledger for the whole chapter: the five to twelve standard terms the listener owns by the end, each with its canonical one-breath definition. A term is baptised in the part where it first earns its place and re-anchored on every later return, across part boundaries.
- ONE through-line: the single claim every part is an instance or consequence of. It is given in `chapter.md`; restate it here as the spine.
- The order and the per-part hooks, copied from `chapter.md`.
Designing this once is what stops each part re-introducing the world and re-coining the terms — the failure that makes parts read as strangers instead of one lecture.

## Writing each part
For each section, in order, write one part by `write_lecture_plus_5.md` in full, under these orchestration constraints:
- BRIDGE IN. Open by re-anchoring the previous part's concept — the term plus its one-breath reminder clause — and turning toward this one. The cold-open standard still holds: found whatever scene this part's first problem needs.
- TEACH WHOLE. Build the mechanism under the snippet with its contrasts, both sides spoken; derive the snippet's behaviour as a because-corollary; then expand to the foundations the concept needs. Length follows mechanism, never the md's word count.
- HOOK OUT. Close on the exact question the NEXT part answers — the hook from `chapter.md` — per `write_lecture_plus_5.md`'s rule that every section closes by raising the next one's question.
- SHARED MEMORY. Use the chapter term ledger and world bible. Never redefine a term an earlier part already baptised; re-anchor it. Never re-introduce an entity already standing; re-anchor it.

## The frame parts
- `00-intro` — the chapter opening: orientation (what this lecture stands on, the promise to point to the code snippet, the capability the listener leaves with) and, where the world needs founding, the world-building groundwork, by `write_lecture_plus_5.md`'s orientation rules. It ends on the first real problem, not a windup.
- `99-outro` — the chapter close: the synthesis and the closing roll — the whole term ledger at its tightest, woven into the through-line — by `write_lecture_plus_5.md`'s closing rules. No congratulations.

## Output
- One markdown file per part in `md-lecture/`, named to match its section: `00-intro.md`, `01-<slug>.md`, … , `99-outro.md`.
- Each file is PURE LECTURE PROSE. The first line is a TITLE naming that part's own movement — the lecture's title, distinct from the section's, by `write_lecture_plus_5.md`'s title rule. It is never the word "Lecture" and never a `## Lecture` heading. Then the spoken script.
- No code blocks, no tables, no filenames rendered as filenames, no symbols a synthetic voice cannot read, no em-dashes anywhere.
- The parts in order, heard end to end, must be one lecture: one world, one set of terms, every part bridged to its neighbours.
- **Combined Final Lecture**: Once all individual parts are complete, you MUST combine them into a single file by running the assembly script: `cd Pencil && node book/build-lecture.mjs <chapter_folder>`. This produces `<chapter>_LECTURE.md` in `book/out/`.

## Before shipping each part
Run `write_lecture_plus_5.md`'s eight gates on it, then two chapter gates:
- CONTINUITY gate. The part bridges in from the previous concept and hooks the next; no term is re-defined that an earlier part already baptised; the world is the same world throughout.
- LEDGER gate. Every term used is in the chapter ledger; any term first baptised in this part is added to `_chapter-design.md` so later parts re-anchor it instead of re-coining it.
