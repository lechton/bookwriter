# React 19 Production Lectures: Skills System (`v10.2`)

Version **`v10.2`** holds one skill set, the **River Version (`v1`)**, in `skills/v10.2/v1/`. Each lesson has one example, chosen anew for that lesson, that grows from Principle 1 to Principle N and is never taught a second time at the end.

## What `v10.2` changes #2026_11_06_01_group_1

`v10.2` is a copy of `v10.1` with five groups of rules added after the Lecture 20 correction of 2026-11-06. Every rule of `v10.1` is kept. The brief is [brief_2026_11_06_01](../../brief/brief_2026_11_06_01.md).

- Browser previews draw real controls, show only what the real page shows, and show the Console messages React prints. #2026_11_06_01_group_2
- Each browser chooses its width: `width=text` for small single-column previews, full width for wide content and comparisons. #2026_11_06_01_group_3
- When the mechanism shows on a page, the chapter opens with its browser preview before the code. #2026_11_06_01_group_4
- Corrections after a lecture is finished go into the final lecture only, and the HTML and PDF are rebuilt. #2026_11_06_01_group_5

The renderer features these rules use (`select:`, `check:`, `button:`, the Console panel, and `width=text`) exist in react-10's `src/build-river.mjs` only, so these rules are not mirrored into the skills of earlier projects.
## Where `v10.1` came from #2026_11_05_01_group_1

`projects/react-10` continues the River Version of `projects/react-09`. The skills in `skills/v10.1/v1/` are the react-09 River skills of `skills/v9.4/v2/`, with no rule changed. Only the paths moved: every `v2` folder is now `v1`, and every skill name ends in `-v1`. The maps, drafts, lectures, HTML, and PDFs of react-09 River Lessons 01 to 13 were copied unchanged into the `v1` folders of this project. The history of earlier versions, from `v9.1` to `v9.4`, is in [react-09 v9.4 README](../../../react-09/skills/v9.4/README.md). The brief is [brief_2026_11_05_01](../../brief/brief_2026_11_05_01.md).

React-09 still holds the Original Version, the older multi-stage pipeline. Its skills and files are never read for River work in this project, because their prose and metaphors leak into River text.

## The River pipeline

| Step | File | Written by | Skill |
| --- | --- | --- | --- |
| 1. Principle map | `01-01-map-principles/v1/{NN}.md` | Opus | [v1/map-principles](v1/map-principles/SKILL.md), [v1/opening-essence](v1/opening-essence/SKILL.md) |
| 2. First draft | `01-01-md-DRAFT-lectures/v1/{NN}.md`, the whole lecture from top to bottom | Argon | [v1/opening-essence](v1/opening-essence/SKILL.md), [v1/lecture-structure](v1/lecture-structure/SKILL.md), [v1/lecture-voice](v1/lecture-voice/SKILL.md), [v1/content-benchmarks](v1/content-benchmarks/SKILL.md), [v1/code-and-figures](v1/code-and-figures/SKILL.md) |
| 3. Lecture | `01-02-md-LECTURES/v1/{NN}.md` | Argon, in a fresh thread that did not write the draft | [v1/simplify](v1/simplify/SKILL.md), [v1/opening-essence](v1/opening-essence/SKILL.md), with the step 2 skills |
| 4. Runtime check | `lab/reports/{NN}.md`, with fixes in the lecture, then built to `01-03-md-lectures-HTML/v1/` and `01-04-md-lectures-PDF/v1/` by `node src/build-river.mjs {NN}` | Opus, in a fresh thread, with the cases in `lab/cases/{NN}/` | [v1/verification](v1/verification/SKILL.md) Stage C, [v1/code-and-figures](v1/code-and-figures/SKILL.md), [v1/lecture-voice](v1/lecture-voice/SKILL.md), [lab/README.md](../../lab/README.md) |
| 5. Later corrections | `01-02-md-LECTURES/v1/{NN}.md` only, then rebuilt with `node src/build-river.mjs {NN}`; the map, the first draft, the HTML, and the PDF are never edited by hand | Any thread | [v1/lecture-structure](v1/lecture-structure/SKILL.md) Section 5 #2026_11_06_01_group_5 |

[v1/verification](v1/verification/SKILL.md) holds the gates: Stage A is the first draft's reading, Stage B is the lecture after the simplify pass, and Stage C runs the lecture's code in `lab/`, with the build and the links last. #2026_11_05_02_group_1 The production prompt that runs the three steps is [notes/prompt_v10.2.md](../../notes/prompt_v10.2.md).

## Canonical version names

| Version tag | Canonical name | Skills folder | Principle maps | Drafts | Lectures | Build script |
| --- | --- | --- | --- | --- | --- | --- |
| **`v1`** | **River Version** | `skills/v10.2/v1/` | `01-01-map-principles/v1/` | `01-01-md-DRAFT-lectures/v1/` | `01-02-md-LECTURES/v1/` | `node src/build-river.mjs` |

> **Source rule**: for a River map, first draft, lecture, or runtime check, load only the skills in `skills/v10.2/v1/`. Work from `questions/questions.md`, `01-01-map/{NN}.md`, the official React corpus, the River map of the same lesson, and the reference sections listed in [v1/content-benchmarks](v1/content-benchmarks/SKILL.md) Section 1.

`01-01-md-PRE-lectures/v1/07.md` is kept as history: it is the one pre-lecture written under react-09 `v9.2`, before `v9.3` removed that step.

## Part A: River Version (`v1`) skills

| # | Skill | Used by | Responsibility |
| --- | --- | --- | --- |
| 1 | [opening-essence-v1](v1/opening-essence/SKILL.md) | Opus, Argon | Opens every chapter and every principle by stripping away all project furniture, showing the naked mechanism in its simplest lines, elaborating every nuance of confusion in direct language (*"Yes, it is the exact same thing!"* or *"It may look the same, or work the same at first, but it is NOT the same thing!"*), and unlocking technical words through their everyday human meaning before stepping into the project files. |
| 2 | [map-principles-v1](v1/map-principles/SKILL.md) | Opus | The fact sheet and the lesson's example, chosen anew: scope, runtime behavior from the corpus, ledger, terms, opening essence, root distinctions, real mistakes as events, interview depth, bridges, example steps, code names, interview points. No drafted lecture sentences. |
| 3 | [lecture-structure-v1](v1/lecture-structure/SKILL.md) | Argon | The three zones of a River lecture, used for the first draft and the lecture. |
| 4 | [lecture-voice-v1](v1/lecture-voice/SKILL.md) | Argon | Writing the first draft from the map one principle at a time, and the voice: one idea per sentence, plain words for the parts, zero parentheses, chronological order. |
| 5 | [content-benchmarks-v1](v1/content-benchmarks/SKILL.md) | Argon | The reference lectures to read first, and twelve benchmarks with approved passages and rejected drafts: root, real bugs, everyday openings, the on-stage walk, plain lead-ins, handshakes, bridges, cause before effect, believable examples, figures after the text, sentences with worth, principle cards in human words. |
| 6 | [code-and-figures-v1](v1/code-and-figures/SKILL.md) | Argon | Code blocks, `~token~` balloons, `tree` figures, browser previews, `files` panels, and principle cards. |
| 7 | [simplify-v1](v1/simplify/SKILL.md) | Argon, fresh thread | Assumes the first draft is convoluted from top to bottom and rewrites it for maximum clarity into the lecture. |
| 8 | [verification-v1](v1/verification/SKILL.md) | Argon, Opus | Stage A first draft, Stage B lecture, Stage C runtime check in `lab/` with the build and links, and the completion report. #2026_11_05_02_group_1 |

## Part B: Shared meta-rules and skill surveillance

- [skill-surveillance/SKILL.md](skill-surveillance/SKILL.md): governs every skill edit. Full-scale demos and title catalogs instead of isolated bans, cross-skill demo upkeep, and good examples taken only from approved lecture text.
- [prompt-writing/SKILL.md](prompt-writing/SKILL.md): meta-rules for writing skills: *Prune Before Banning*, *Teach by Living Example*, *General Standards Over Micro-Regulations*.
- [prompt-writing/quality-checklist.md](prompt-writing/quality-checklist.md): the quality gate for skill edits.
- [RULE-TAGS.md](RULE-TAGS.md): the tag index for this skill set.
