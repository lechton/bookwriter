# React 19 Production Lectures: Skills (`v10.5`)

`v10.5` is the skill set for the River Version of `projects/react-10`. It takes over from `v10.4` once `AGENTS.md` names it as the live set. `v10.4` stays unchanged as history. #2026_11_07_11_group_7

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
| [opening-essence](opening-essence/SKILL.md) | Every writer | How the start of a lecture and of each principle opens: the four moves, the seven examples, and Back to the basics |
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

The production prompt is [notes/prompt_v10.5.md](../../notes/prompt_v10.5.md).

For any River work, load only the skills in `skills/v10.5/`. Do not read files from `projects/react-09`.

## Editing the skills

- [editing-skills/SKILL.md](editing-skills/SKILL.md): how to write and edit these skills, and how to show the owner every edit first. Read it before any edit.
- [prompt-writing/SKILL.md](prompt-writing/SKILL.md) and [prompt-writing/quality-checklist.md](prompt-writing/quality-checklist.md): the workspace rules for every instruction edit, copied unchanged from `v10.4`.
- [RULE-TAGS.md](RULE-TAGS.md): one row for each group of edits.
