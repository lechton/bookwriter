# React 19 Production Lectures: Skills System (`v9.3`)

Version **`v9.3`** keeps **two separate skill sets** inside `skills/v9.3/` so that rules from the two lecture formats never mix:

1. **`skills/v9.3/v1/`, the Original Version (`v1`)**: the multi-stage pipeline (`01-01-map-principles/v1/`, `01-01-md-PRE-lectures/v1/`, `01-02-md-LECTURES/v1/`, `02-01-md-revised-1..4/v1/`), unchanged from `v9.1`.
2. **`skills/v9.3/v2/`, the River Version (`v2`)**: three steps, with one example that grows from Principle 1 to Principle N and is never taught a second time at the end.

## What changed from `v9.2` #2026_10_24_02_group_1

`v9.2` added a pre-lecture between the map and the lecture. Lecture 07 still came out convoluted, and the owner had to ask for a clearer version by hand, as for Lectures 01 to 06. A writer who rereads its own text fills the gaps from memory. So `v9.3` removes the pre-lecture: the first draft is the whole lecture, and a fresh thread that never saw the writing simplifies it into the lecture. The twelve content benchmarks of the old pre-lecture live on in [v2/content-benchmarks](v2/content-benchmarks/SKILL.md).

## The River pipeline

| Step | File | Written by | Skill |
| --- | --- | --- | --- |
| 1. Principle map | `01-01-map-principles/v2/{NN}.md` | Opus | [v2/map-principles](v2/map-principles/SKILL.md) |
| 2. First draft | `01-01-md-DRAFT-lectures/v2/{NN}.md`, the whole lecture from top to bottom | Argon | [v2/lecture-structure](v2/lecture-structure/SKILL.md), [v2/lecture-voice](v2/lecture-voice/SKILL.md), [v2/content-benchmarks](v2/content-benchmarks/SKILL.md), [v2/code-and-figures](v2/code-and-figures/SKILL.md) |
| 3. Lecture | `01-02-md-LECTURES/v2/{NN}.md`, built to `01-03-md-lectures-HTML/v2/` and `01-04-md-lectures-PDF/v2/` by `node src/build-river.mjs {NN}` | Argon, in a fresh thread that did not write the draft | [v2/simplify](v2/simplify/SKILL.md), with the step 2 skills |

[v2/verification](v2/verification/SKILL.md) holds the gates: Stage A is the first draft's reading, and Stage B is the lecture after the simplify pass, with the build and the links last.

## Canonical version names

| Version tag | Canonical name | Skills folder | Principle maps | Drafts | Lectures | Build script |
| --- | --- | --- | --- | --- | --- | --- |
| **`v1`** | **Original Version** | `skills/v9.3/v1/` | `01-01-map-principles/v1/` | `01-01-md-PRE-lectures/v1/` | `01-02-md-LECTURES/v1/` | `node src/build-lectures.mjs` |
| **`v2`** | **River Version** | `skills/v9.3/v2/` | `01-01-map-principles/v2/` | `01-01-md-DRAFT-lectures/v2/` | `01-02-md-LECTURES/v2/` | `node src/build-river.mjs` |

> **Separation rule**:
> - For a **River Version (`v2`)** map, first draft, or lecture, load only the skills in `skills/v9.3/v2/`, and never read `v1` maps, pre-lectures, or lectures: their prose and metaphors leak into River text. Work from `questions/questions.md`, `01-01-map/{NN}.md`, the official React corpus, the live runtime, the River map of the same lesson, and the reference sections listed in [v2/content-benchmarks](v2/content-benchmarks/SKILL.md) Section 1.
> - For an **Original Version (`v1`)** map or lecture, load only the skills in `skills/v9.3/v1/`.

## Part A: River Version (`v2`) skills

| # | Skill | Used by | Responsibility |
| --- | --- | --- | --- |
| 1 | [map-principles-v2](v2/map-principles/SKILL.md) | Opus | The fact sheet: scope, verified runtime behavior, ledger, terms, root distinctions, real mistakes as events, interview depth, bridges, example steps, code names, interview points. No drafted lecture sentences. |
| 2 | [lecture-structure-v2](v2/lecture-structure/SKILL.md) | Argon | The three zones of a River lecture, used for the first draft and the lecture. |
| 3 | [lecture-voice-v2](v2/lecture-voice/SKILL.md) | Argon | Writing the first draft from the map one principle at a time, and the voice: one idea per sentence, plain words for the parts, zero parentheses, chronological order. |
| 4 | [content-benchmarks-v2](v2/content-benchmarks/SKILL.md) | Argon | The reference lectures to read first, and twelve benchmarks with approved passages and rejected drafts: root, real bugs, everyday openings, the on-stage walk, plain lead-ins, handshakes, bridges, cause before effect, believable examples, figures after the text, sentences with worth, principle cards in human words. |
| 5 | [code-and-figures-v2](v2/code-and-figures/SKILL.md) | Argon | Code blocks, `~token~` balloons, `tree` figures, browser previews, `files` panels, and principle cards. |
| 6 | [simplify-v2](v2/simplify/SKILL.md) | Argon, fresh thread | Assumes the first draft is convoluted from top to bottom and rewrites it for maximum clarity into the lecture. |
| 7 | [verification-v2](v2/verification/SKILL.md) | Argon | Stage A first draft, Stage B lecture with the build and links, and the completion report. |

## Part B: Original Version (`v1`) skills

All 18 Original Version skills live unchanged inside `skills/v9.3/v1/`:- [v1/map-principles/SKILL.md](v1/map-principles/SKILL.md)
- [v1/pre-lecture/SKILL.md](v1/pre-lecture/SKILL.md)
- [v1/lecture-structure/SKILL.md](v1/lecture-structure/SKILL.md)
- [v1/lecture-voice/SKILL.md](v1/lecture-voice/SKILL.md)
- [v1/pedagogical-crossroads/SKILL.md](v1/pedagogical-crossroads/SKILL.md)
- [v1/code-blocks/SKILL.md](v1/code-blocks/SKILL.md)
- [v1/code-comment-audit/SKILL.md](v1/code-comment-audit/SKILL.md)
- [v1/ui-panels/SKILL.md](v1/ui-panels/SKILL.md)
- [v1/figures/SKILL.md](v1/figures/SKILL.md)
- [v1/principle-definition/SKILL.md](v1/principle-definition/SKILL.md)
- [v1/principled-theory/SKILL.md](v1/principled-theory/SKILL.md)
- [v1/lecture-revision/SKILL.md](v1/lecture-revision/SKILL.md)
- [v1/verification/SKILL.md](v1/verification/SKILL.md)
- [v1/build/SKILL.md](v1/build/SKILL.md)
- [v1/summary-edition/SKILL.md](v1/summary-edition/SKILL.md)
- [v1/summary-figures/SKILL.md](v1/summary-figures/SKILL.md)
- [v1/summary-audit/SKILL.md](v1/summary-audit/SKILL.md)
- [v1/summary-revision-4/SKILL.md](v1/summary-revision-4/SKILL.md)

## Part C: Shared meta-rules and skill surveillance

- [skill-surveillance/SKILL.md](skill-surveillance/SKILL.md): governs every skill edit. Full-scale demos and title catalogs instead of isolated bans, cross-skill demo upkeep, and good examples taken only from approved lecture text.
- [prompt-writing/SKILL.md](prompt-writing/SKILL.md): meta-rules for writing skills: *Prune Before Banning*, *Teach by Living Example*, *General Standards Over Micro-Regulations*.
- [prompt-writing/quality-checklist.md](prompt-writing/quality-checklist.md): the quality gate for skill edits.
- [RULE-TAGS.md](RULE-TAGS.md): the tag index across the skill suite.
