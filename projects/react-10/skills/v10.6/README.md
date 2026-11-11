# React 19 Production Lectures: Skills (`v10.6`)

`v10.6` is the skill set for the River Version of `projects/react-10`. It started as an exact copy of `v10.5`, and it is the live set named in `AGENTS.md`. `v10.5` stays unchanged as history. #2026_11_08_02_group_1

## Why `v10.5` exists

The opening of Lecture 21 was one long paragraph that told again what a one-line click handler already showed. The `v10.4` skills caused it:
- They had grown to about 122,000 characters.
- Each problem got a new rule on top of the old ones, and some rules said the opposite of each other.
- They used labels such as "the Angle" and "the cut test" that a new reader cannot follow.
- They told the writer to rewrite every sentence the build listed as long. Lecture 21 got 47 rewrites.

Lectures 17 to 19 read best, and they were written by teaching with examples. So `v10.5` teaches with **moves**: ways of explaining that worked in approved lectures, each with a good and a bad example. The rules fit on one page. The brief is [brief_2026_11_07_11](../../brief/brief_2026_11_07_11.md).

## The skills

| Skill | Who uses it | What it covers |
| --- | --- | --- |
| [lecture](lecture/SKILL.md) | Every writer | Who you write for, which move to pick, how to write each sentence, the parts of a lecture, and the final read |
| [opening-essence](opening-essence/SKILL.md) | Every writer | How the start of a lecture and of each principle opens: the four moves, the nine examples, and Back to the basics |
| [examples](examples/SKILL.md) | Every writer | Full passages: a PROPER example beside a COUNTER-EXAMPLE, why the counter-example fails, and what is at stake, one entry per chapter #2026_11_09_02_group_2 |
| [clarity](clarity/SKILL.md) | Every writer | The owner's checklist for maximum clarity, with before and after examples: numbering, grounding, what is going on, the clearest image, no AI slop, a summary before a complex path, common vocabulary #2026_11_09_04_group_1, real DO and DO NOT DO examples #2026_11_09_07_group_1, clarity-first writing style #2026_11_10_01_group_1, and no fake "they look identical under the hood" similarity #2026_11_10_02_group_1 |
| [moves](moves/) | Every writer | Five moves: [Smallest code first](moves/smallest-code-first.md), [Side by side](moves/side-by-side.md), [Everyday image](moves/everyday-image.md), [Steps for a surprise](moves/steps-for-a-surprise.md), [Both orders first](moves/both-orders-first.md) |
| [figures](figures/SKILL.md) | Every writer | The exact syntax of code blocks, highlights, `tree` figures, browser previews, columns, file panels, and principle cards |
| [map](map/SKILL.md) | Opus | The principle map: facts, the example page, and the move each principle uses |
| [check](check/SKILL.md) | Argon and Opus | The writer's read, the second read that writes the final lecture, the runtime check in `lab/`, the build, and the report |

## The pipeline

| Step | File | Written by | Skills |
| --- | --- | --- | --- |
| 1. Map | `01-01-map-principles/v1/{NN}.md` | Opus | map, lecture |
| 2. First draft | `01-01-md-DRAFT-lectures/v1/{NN}.md` | Argon | lecture, moves, figures, check Step A |
| 3. Final lecture | `01-02-md-LECTURES/v1/{NN}.md` | Argon, in a fresh thread | lecture, moves, figures, check Step B |
| 4. Runtime check and build | `lab/reports/{NN}.md`, fixes in the lecture, then `node src/build-river.mjs {NN}` | Opus, in a fresh thread | check Step C, figures, lecture |
| 5. Later corrections | `01-02-md-LECTURES/v1/{NN}.md` only, then rebuilt | Any thread | lecture |

The production prompt is [notes/prompt_v10.6.md](../../notes/prompt_v10.6.md).

For any River work, load only the skills in `skills/v10.6/`. Do not read files from `projects/react-09`.

## Editing the skills

- [editing-skills/SKILL.md](editing-skills/SKILL.md): how to write and edit these skills, and how to show the owner every edit first. Read it before any edit.
- [prompt-writing/SKILL.md](prompt-writing/SKILL.md) and [prompt-writing/quality-checklist.md](prompt-writing/quality-checklist.md): the workspace rules for every instruction edit, copied unchanged from `v10.4`.
- [RULE-TAGS.md](RULE-TAGS.md): one row for each group of edits.
