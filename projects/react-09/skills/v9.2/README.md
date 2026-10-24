# React 19 Production Lectures: Skills System (`v9.2`)

Version **`v9.2`** keeps **two separate skill sets** inside `skills/v9.2/` so that rules from the two lecture formats never mix:

1. **`skills/v9.2/v1/`, the Original Version (`v1`)**: the multi-stage pipeline (`01-01-map-principles/v1/`, `01-01-md-PRE-lectures/v1/`, `01-02-md-LECTURES/v1/`, `02-01-md-revised-1..4/v1/`), unchanged from `v9.1`.
2. **`skills/v9.2/v2/`, the River Version (`v2`)**: three steps, with one example that grows from Principle 1 to Principle N and is never taught a second time at the end.

## What changed from `v9.1` #2026_10_24_01_group_1

In `v9.1`, River lectures were written straight from the principle map, and every first draft of Lectures 01 to 06 came out convoluted. `v9.2` adds a pre-lecture between the map and the lecture, so the content is right before any lecture page is written. The evidence is in `notes/06-river-v2-persistent-convolution-evidence-brief.md`, and the decisions are in `brief/brief_2026_10_24_01.md`.

## The River pipeline

| Step | File | Written by | Skill |
| --- | --- | --- | --- |
| 1. Principle map | `01-01-map-principles/v2/{NN}.md` | Opus | [v2/map-principles](v2/map-principles/SKILL.md) |
| 2. Pre-lecture | `01-01-md-PRE-lectures/v2/{NN}.md` | Argon | [v2/pre-lecture](v2/pre-lecture/SKILL.md) |
| 3. Lecture | `01-02-md-LECTURES/v2/{NN}.md`, built to `01-03-md-lectures-HTML/v2/` and `01-04-md-lectures-PDF/v2/` by `node src/build-river.mjs {NN}` | Argon | [v2/lecture-structure](v2/lecture-structure/SKILL.md), [v2/lecture-voice](v2/lecture-voice/SKILL.md), [v2/code-and-figures](v2/code-and-figures/SKILL.md) |

[v2/verification](v2/verification/SKILL.md) holds the gates for steps 2 and 3: Stage A checks the pre-lecture's content, Stage B reads the lecture as a learner, and Stage C runs the scripts last.

## Canonical version names

| Version tag | Canonical name | Skills folder | Principle maps | Pre-lectures | Lectures | Build script |
| --- | --- | --- | --- | --- | --- | --- |
| **`v1`** | **Original Version** | `skills/v9.2/v1/` | `01-01-map-principles/v1/` | `01-01-md-PRE-lectures/v1/` | `01-02-md-LECTURES/v1/` | `node src/build-lectures.mjs` |
| **`v2`** | **River Version** | `skills/v9.2/v2/` | `01-01-map-principles/v2/` | `01-01-md-PRE-lectures/v2/` | `01-02-md-LECTURES/v2/` | `node src/build-river.mjs` |

> **Separation rule**:
> - For a **River Version (`v2`)** map, pre-lecture, or lecture, load only the skills in `skills/v9.2/v2/`, and never read `v1` maps, pre-lectures, or lectures: their prose and metaphors leak into River text. Work from `questions/questions.md`, `01-01-map/{NN}.md`, the official React corpus, the live runtime, the River map and pre-lecture of the same lesson, and the reference sections listed in [v2/pre-lecture](v2/pre-lecture/SKILL.md) Section 5.
> - For an **Original Version (`v1`)** map or lecture, load only the skills in `skills/v9.2/v1/`.

## Part A: River Version (`v2`) skills

| # | Skill | Used by | Responsibility |
| --- | --- | --- | --- |
| 1 | [map-principles-v2](v2/map-principles/SKILL.md) | Opus | The fact sheet: scope, verified runtime behavior, ledger, terms, root distinctions, real mistakes as events, interview depth, bridges, example steps, code names, interview points. No drafted lecture sentences. |
| 2 | [pre-lecture-v2](v2/pre-lecture/SKILL.md) | Argon | Stages every section in beats written as final sentences, and owns the content benchmarks: root, real bugs, everyday openings, the on-stage walk, plain lead-ins, handshakes, bridges, cause before effect, believable examples, figures after the text, sentences with worth, principle cards in human words. Ends with a Content Gates report. |
| 3 | [lecture-structure-v2](v2/lecture-structure/SKILL.md) | Argon | The three zones of a River lecture, used for the pre-lecture's headings and the lecture's pages. |
| 4 | [lecture-voice-v2](v2/lecture-voice/SKILL.md) | Argon | Writing the lecture from the pre-lecture one principle at a time, and the voice: one idea per sentence, plain words for the parts, zero parentheses, chronological order. |
| 5 | [code-and-figures-v2](v2/code-and-figures/SKILL.md) | Argon | Code blocks, `~token~` balloons, `tree` figures, browser previews, `files` panels, and principle cards. |
| 6 | [verification-v2](v2/verification/SKILL.md) | Argon | Stage A pre-lecture content, Stage B lecture reading, Stage C scripts, and the completion report. |

## Part B: Original Version (`v1`) skills

All 18 Original Version skills live unchanged inside `skills/v9.2/v1/`:
- [v1/map-principles/SKILL.md](v1/map-principles/SKILL.md)
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
