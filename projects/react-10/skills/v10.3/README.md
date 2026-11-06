# React 19 Production Lectures: Skills (`v10.3`)

`v10.3` is the live skill set for the River Version of `projects/react-10`. It replaces the eight `v10.2` writing skills with four short files written in plain words. #2026_11_06_02_group_1

## Why `v10.3` exists

On 2026-11-06, the Lecture 20 opening followed every `v10.2` rule and still did not explain itself. It never said what `value` or `onChange` do. It said "NOT the same thing!" without showing the steps behind it. The skills had grown to about 135,000 characters, written in the same dense style they asked writers to avoid. `v10.3` keeps what the skills taught, says it once, and puts one plain instruction first. The brief is [brief_2026_11_06_02](../../brief/brief_2026_11_06_02.md). `v10.2` stays unchanged as history.

## The four skills

| Skill | Who uses it | What it covers |
| --- | --- | --- |
| [v1/writing](v1/writing/SKILL.md) | Every writer | The one instruction that matters most, explaining new code words, showing the steps behind every result, the voice, the shape of a lecture, and the final read |
| [v1/figures](v1/figures/SKILL.md) | Every writer | The exact syntax of code blocks, highlights, `tree` figures, browser previews, columns, file panels, and principle cards |
| [v1/map](v1/map/SKILL.md) | Opus | The principle map: facts, the example page, new code words, and the steps behind each result |
| [v1/check](v1/check/SKILL.md) | Argon and Opus | The writer's read, the second read that writes the final lecture, the runtime check in `lab/`, the build, and the report |

## The pipeline

| Step | File | Written by | Skills |
| --- | --- | --- | --- |
| 1. Map | `01-01-map-principles/v1/{NN}.md` | Opus | map, writing |
| 2. First draft | `01-01-md-DRAFT-lectures/v1/{NN}.md` | Argon | writing, figures, check Step A |
| 3. Final lecture | `01-02-md-LECTURES/v1/{NN}.md` | Argon, in a fresh thread | writing, figures, check Step B |
| 4. Runtime check and build | `lab/reports/{NN}.md`, fixes in the lecture, then `node src/build-river.mjs {NN}` | Opus, in a fresh thread | check Step C, figures, writing |
| 5. Later corrections | `01-02-md-LECTURES/v1/{NN}.md` only, then rebuilt | Any thread | writing Section 10 |

The production prompt is [notes/prompt_v10.3.md](../../notes/prompt_v10.3.md).

For any River work, load only the skills in `skills/v10.3/`. Work from `questions/questions.md`, `01-01-map/{NN}.md`, the React documentation, and the map of the same lesson. Do not read files from `projects/react-09`.

## Editing the skills

- [skill-surveillance/SKILL.md](skill-surveillance/SKILL.md): how to edit these skills. Read it first.
- [prompt-writing/SKILL.md](prompt-writing/SKILL.md) and [prompt-writing/quality-checklist.md](prompt-writing/quality-checklist.md): the workspace rules for every instruction edit.
- [RULE-TAGS.md](RULE-TAGS.md): one row for each group of edits.
