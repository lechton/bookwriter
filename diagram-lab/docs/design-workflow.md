# Design Workflow — Experimental Card Authoring

**Status:** experimental, installed 2026-07-19 · **Governs:** new card authoring in `output/exp-*` folders · **Does not change:** the README production contract or any existing demo (integration decision pending, see `docs/briefs/260719_003.md` §10)

This workflow operationalizes briefs 001–003: diagnose the learner first, cast a metaphor second, render third. It exists so any model (local Gemini, an assistant, a human) produces cards that resolve a real confusion in a matching design genre, instead of depicting the topic.

## Inputs

1. The topic and its one key code example (National Times world, idiomatic Svelte 5).
2. `docs/metaphor-registry.md` — the Used Metaphors list (name + genre). Freshness and genre variety are checked against it.
3. Style grammar: `assets/styles/` tokens and the house rules in `README.md` (print-safe, 130mm, no JS, one line per paragraph, no blank lines inside diagram markup).

## The design block (v2, mandatory before any markup)

```text
PHASE A — DIAGNOSE THE LEARNER
A1. STUMBLE: list two or three things the average reader commonly confuses or holds vague here. Pick the most common; phrase it as their silent expectation.
A2. WHY IT FEELS RIGHT: one sentence — what prior experience teaches this expectation? Never strawman the learner.
A3. THE KEY: one sentence — the single distinction that resolves the confusion. This is the card's payload; cut all else.
A4. TYPE + SCENE: classify the confusion (violation, fog, choice) and say what scene would stage its resolution.
PHASE B — CAST AND RENDER
B1. CAST: three candidate scenes that can stage the resolution (not merely depict the mechanism), one line each, different families (flow, container, comparison, machine, social).
B2. MAP: each code element = one scene element, and the wrong expectation must appear visibly (crossed out, dashed, ghosted). Unmapped parts → recast.
B3. NAME: concept name, fresh against the Used Metaphors registry.
B3.5 STUDY: pick two reference screenshots from docs/_shots/ (the originals) and list two or three craft moves to borrow — a texture, a rotation, badges, a watermark, object mimicry. Borrowing moves at render level is the point; the metaphor stays original because CAST owns it.
B4. RENDER: compose the scene from assets/styles/metaphors.css (visual menu: output/exp-004_gallery/html/_shots/); custom inline CSS only for gaps, and a gap used twice gets promoted into the library. Arrows are operations; zones named; light backgrounds; the resolution is the visual center.
B5. CHECK: hand the diagram to an imaginary confused reader — does it answer THEIR question, or restate the topic? If it restates, return to A1.
TEXT: **Q.** is the learner's confusion in their own words; **Answer.** verdict first; **Why it works.** why the reasonable expectation fails.
```

## Operating procedure

1. Create or reuse the experiment folder `output/exp-NNN_<topic>/md/`. One folder per experiment; numbered variant files inside (`01_topic_metaphor.md`); undo = delete the file or folder. Existing demos are frozen.
2. Emit the A/B reasoning into a sidecar `NN_topic.thinking.md` next to the card. The card itself stays clean.
3. Author the card per the contract, including the `**Diagram concept.** <Name>` line immediately before the diagram markup.
4. Build: `node src/build.mjs exp-NNN_<topic>` (html + pdf via Prince).
5. Screenshot: `node src/shot.mjs exp-NNN_<topic> deck`.
6. Judge against the rubric below, looking at the PNG. Any "no" routes back to the phase that failed.
7. Iterate in place within the experiment folder; when a variant wins, promotion to a production deck is an explicit copy action, never automatic.
8. Register the shipped metaphor (name, topic, deck, genre) in `docs/metaphor-registry.md`.

## Judging rubric

Pedagogy axis:
- P1. The card names a real, common confusion (A1 is honest, not invented drama).
- P2. The design stages the resolution of exactly that confusion — not the mechanism in general.
- P3. The genre matches the confusion type (violation → contrast, fog → grounding scene, choice → asymmetric comparison).

Design axis:
- D1. Named scene (label chip carries the concept name).
- D2. Mapping complete: every code element appears as a scene element; the wrong expectation is visible.
- D3. Arrows are operations (labeled or unambiguous); zones are named.
- D4. Print-safe: light backgrounds, monochrome-legible, fits 130mm without shrink-to-fit.
- D5. Fresh: concept name and genre not overused in the registry.
- D6. The scene is drawn, not just labeled: a reader could guess the concept name from the picture alone (guards against "wrecking ball with no ball" — a metaphor that lives only in the chip text).
- D7. Paired score: rate the card 0–10 against its nearest original from the registry (innovation + professionalism), recorded in the experiment log.

## Honesty notes

- A model authoring both a control card and a workflow card biases the comparison; control arms must be written in good faith under the old contract. Definitive validation is running this workflow through a fresh model session (e.g. local Gemini) with only this file plus the registry as instructions.
- Known failure modes this workflow guards against: invented confusions (A2 is the guard), contrast monoculture (typology + registry are the guards), pedagogy theater (B5 is the guard).
