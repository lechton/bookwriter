# React 19 Production Lectures: Skills (`v11.1`)

`v11.1` is the first skill set of `projects/react-11`, and it is the live set named in `AGENTS.md`. It started as an exact copy of `projects/react-10/skills/v10.7/`, which stays unchanged as history in react-10. #2026_11_12_01_group_1

`v10.7` started as an exact copy of `v10.6`. `v10.6` stays unchanged as history. #2026_11_11_01_group_1

`v10.6` started as an exact copy of `v10.5`. `v10.5` stays unchanged as history. #2026_11_08_02_group_1

The earlier sets, `v10.1` to `v10.7`, live in `projects/react-10/skills/`.

## Why `v11.1` changed how a lecture is made #2026_11_12_02_group_5

In Lecture 16, the version with the owner's own definitions read best, but the definitions sat in boxes before the screen, and the version that kept the screen said each idea twice. So in `v11.1` a lecture is built from pieces that are written and checked first. The owner's words, 2026-11-12: definitions and principles are the two kinds of pieces, and "if we start with concrete definitions and verify there are no errors, then models can build with definitions and principles better."

Each lesson now has two files: the prelecture, which holds the definitions and every other piece, and the lecture, which is written from it. The principle map and the first draft are no longer written. The brief is [brief_2026_11_12_02](../../brief/brief_2026_11_12_02.md).

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
| [prelecture](prelecture/SKILL.md) | Opus | The prelecture: the names, the terms, the screen, the intro, the definitions, the principles with their proof on the screen, and the order #2026_11_12_02_group_2 |
| [definitions](definitions/SKILL.md) | Opus, and every writer | How each definition is written by the owner's notes, made for this lecture, with reminders fitted to the chapter, clear names, and one place in the lecture #2026_11_12_02_group_1 |
| [lecture](lecture/SKILL.md) | Every writer | Who you write for, which move to pick, how to write each sentence, the parts of a lecture, and the final read |
| [intro](intro/SKILL.md) | Opus, and every writer | The intro of a lecture, from the short question under the title to the Rule of Thumb: the owner's checklist and the owner's intros for Lessons 14, 15, and 16 #2026_11_12_04_group_2 |
| [examples](examples/SKILL.md) | Every writer | Full passages: a PROPER example beside a COUNTER-EXAMPLE, why the counter-example fails, and what is at stake, one entry per chapter #2026_11_09_02_group_2 |
| [clarity](clarity/SKILL.md) | Every writer | The owner's checklist for maximum clarity, with before and after examples: numbering, grounding, what is going on, the clearest image, no AI slop, a summary before a complex path, common vocabulary #2026_11_09_04_group_1, real DO and DO NOT DO examples #2026_11_09_07_group_1, clarity-first writing style #2026_11_10_01_group_1, and no fake "they look identical under the hood" similarity #2026_11_10_02_group_1 |
| [moves](moves/) | Every writer | Five moves: [Smallest code first](moves/smallest-code-first.md), [Side by side](moves/side-by-side.md), [Everyday image](moves/everyday-image.md), [Steps for a surprise](moves/steps-for-a-surprise.md), [Both orders first](moves/both-orders-first.md) |
| [figures](figures/SKILL.md) | Every writer | The exact syntax of code blocks, highlights, `tree` figures, browser previews, columns, file panels, principle cards, and definition boxes |
| [titles](titles/SKILL.md) | Every writer | The owner's list of good titles, grouped by the job each title does, with one hard rule: no -ing in a title #2026_11_12_03_group_2 |
| [check](check/SKILL.md) | Argon and Opus | The prelecture's check, the writer's read, the fresh second read, the runtime check of the lecture, the build, and the report |

## The pipeline #2026_11_12_02_group_5

| Step | File | Written by | Skills |
| --- | --- | --- | --- |
| 1. Prelecture | `01-01-md-PRE-lectures/v1/{NN}.md` | Opus | prelecture, definitions, intro, lecture, titles, examples |
| 2. Prelecture check | fixes in the prelecture | Opus, the same thread | check Step A #2026_11_12_07_group_1 |
| 3. The owner reads the prelecture | | The owner | |
| 4. Lecture | `01-02-md-LECTURES/v1/{NN}.md` | Argon, in a fresh thread | lecture, definitions, titles, intro, examples, clarity, moves, figures, check Step B |
| 5. Second read | the lecture, fixed in place | Argon, in another fresh thread | lecture, definitions, titles, clarity, moves, figures, check Step C |
| 6. Runtime check and build | `lab/reports/{NN}.md`, fixes in the lecture, then `node src/build-river.mjs {NN}` | Opus, in a fresh thread | check Step D, figures, lecture |
| 7. Later corrections | `01-02-md-LECTURES/v1/{NN}.md` only, then rebuilt | Any thread | lecture |

The maps in `01-01-map-principles/` and the drafts in `01-01-md-DRAFT-lectures/` of earlier lessons stay as history.

The production prompt is [notes/prompt_v11.1.md](../../notes/prompt_v11.1.md).

For any River work, load only the skills in `skills/v11.1/`. Do not read files from `projects/react-09`.

## Editing the skills

- [editing-skills/SKILL.md](editing-skills/SKILL.md): how to write and edit these skills, and how to show the owner every edit first. Read it before any edit.
- [prompt-writing/SKILL.md](prompt-writing/SKILL.md) and [prompt-writing/quality-checklist.md](prompt-writing/quality-checklist.md): the workspace rules for every instruction edit, copied unchanged from `v10.4`.
- [RULE-TAGS.md](RULE-TAGS.md): one row for each group of edits.
