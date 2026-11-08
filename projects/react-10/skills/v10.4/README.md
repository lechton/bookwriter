# React 19 Production Lectures: Skills (`v10.4`)

`v10.4` is the live skill set for the River Version of `projects/react-10`. It keeps the four short `v10.3` files and changes when a writer explains code and walks through steps. #2026_11_06_03_group_5

## What `v10.4` changes

Lectures 20 and 21, written under `v10.3`, turned into tours of their code. Lecture 20 opened with paragraphs that defined one code word after another, before the reader had seen anything happen. Lecture 21 explained every helper word of its plain JavaScript example, such as `classList`, `async`, and `try`, and put a numbered list after almost every block. The cause was two `v10.3` rules with no limit: explain every new code word, and put steps before every result. The `v10.2` rule that a sentence must not recite its code block was lost in the rewrite.

`v10.4` changes four things:
- A writer explains the words the lesson is about, when the reader needs them. Words from earlier lessons are known. Helper words stay out of the example where possible.
- Steps answer a surprise: the facts come first, then the reader's question, and the steps show what the code does not show.
- The code block carries the names. A sentence that says them again is reciting.
- The final reads look for what is too much as well as what is missing.

On 2026-11-07, one more change was made inside `v10.4`. Before the reader's question, the writer lays out the facts it needs, and every version of the code is named by its one difference, never by its place on the page or by a letter. The brief is [brief_2026_11_07_01](../../brief/brief_2026_11_07_01.md). #2026_11_07_01_group_3

The same day, a second change gave the lectures character and rigor. The map records an Angle for each principle: a fact the learner would not expect, which explains a result on the page. The writer builds the passage on that fact in plain sentences, and every remark must pass the other-lesson test and the cut test. Every reference names its thing in full the first time, so "After Clear" becomes "When the user clicks the Clear button". The brief is [brief_2026_11_07_02](../../brief/brief_2026_11_07_02.md). #2026_11_07_02_group_3

A third change that day replaced the tired reader of `writing` Section 1 with a reader whose knowledge the writer tracks: the earlier lessons and what the lecture has said so far. Each explanation starts from something that reader holds, and each sentence grows out of the one before. The rule "One idea per sentence" became "Let each sentence follow from the one before", because it had turned Lecture 20 into rows of short sentences that did not connect. The brief is [brief_2026_11_07_03](../../brief/brief_2026_11_07_03.md). #2026_11_07_03_group_4

A fourth change that day made the reader's knowledge cumulative across the lecture. What the opening or an earlier principle has already taught stays learned, so later principles spend words only on what is new in that step instead of re-teaching `useState` or translating every handler into "puts X into Y with setY". The brief is [brief_2026_11_07_04](../../brief/brief_2026_11_07_04.md). #2026_11_07_04_group_3

A fifth change that day wrote Section 4 of `writing` for the fast thinker and the impatient reader. When comparing two props or patterns (`A` and `B`), the writer leads straight with what `A` does and what `B` does in clear technical and practical precision, instead of holding the distinction back in suspense across several paragraphs, and follows with the logical-philosophical reality on the page rather than a mechanical code trace. The brief is [brief_2026_11_07_05](../../brief/brief_2026_11_07_05.md). #2026_11_07_05_group_3

A sixth change that day locked the style of `Principle N` titles across the map, draft, and final lecture. Each principle title names one concrete physical action or fact on the page in a few plain words, such as `onChange Sends Every Key into State` or `value Without onChange Freezes the Box`, instead of packing the full conditional rule or abstract developer terms into the heading. The brief is [brief_2026_11_07_06](../../brief/brief_2026_11_07_06.md). #2026_11_07_06_group_1

A seventh change that day extended `writing` Section 4 and `check` Step B against cryptic token-swapping leads (`"On a <select> menu, value sits on the menu tag itself, never selected on an option"`, `"On a tick box, checked replaces value"`) and repetitive `A`-vs-`B` ping-pong in prose. Instead of algebraic riddles or inlining full tags in a sentence, the writer states the first way in plain words and shows its code on separate lines, then states why the second way is needed and shows its code on separate lines. The brief is [brief_2026_11_07_07](../../brief/brief_2026_11_07_07.md). #2026_11_07_07_group_1

The brief is [brief_2026_11_06_03](../../brief/brief_2026_11_06_03.md). `v10.3` stays unchanged as history.

## Why `v10.3` existed

On 2026-11-06, the Lecture 20 opening followed every `v10.2` rule and still did not explain itself. It never said what `value` or `onChange` do. It said "NOT the same thing!" without showing the steps behind it. The skills had grown to about 135,000 characters, written in the same dense style they asked writers to avoid. `v10.3` keeps what the skills taught, says it once, and puts one plain instruction first. The brief is [brief_2026_11_06_02](../../brief/brief_2026_11_06_02.md). `v10.2` stays unchanged as history.

## The four skills

| Skill | Who uses it | What it covers |
| --- | --- | --- |
| [v1/writing](v1/writing/SKILL.md) | Every writer | The one instruction that matters most, writing from what the reader knows so each sentence grows from the last, explaining the lesson's own words, the facts and steps behind a surprise, naming each version by its difference, the Angle that gives a passage its character, precise references, the voice, the shape of a lecture, and the final read |
| [v1/figures](v1/figures/SKILL.md) | Every writer | The exact syntax of code blocks, highlights, `tree` figures, browser previews, columns, file panels, and principle cards |
| [v1/map](v1/map/SKILL.md) | Opus | The principle map: facts, the example page, the words to teach, the facts, question, and steps behind each surprise, and the Angle |
| [v1/check](v1/check/SKILL.md) | Argon and Opus | The writer's read, the second read that writes the final lecture, the runtime check in `lab/`, the build, and the report |

## The pipeline

| Step | File | Written by | Skills |
| --- | --- | --- | --- |
| 1. Map | `01-01-map-principles/v1/{NN}.md` | Opus | map, writing |
| 2. First draft | `01-01-md-DRAFT-lectures/v1/{NN}.md` | Argon | writing, figures, check Step A |
| 3. Final lecture | `01-02-md-LECTURES/v1/{NN}.md` | Argon, in a fresh thread | writing, figures, check Step B |
| 4. Runtime check and build | `lab/reports/{NN}.md`, fixes in the lecture, then `node src/build-river.mjs {NN}` | Opus, in a fresh thread | check Step C, figures, writing |
| 5. Later corrections | `01-02-md-LECTURES/v1/{NN}.md` only, then rebuilt | Any thread | writing Section 10 |

The production prompt is [notes/prompt_v10.4.md](../../notes/prompt_v10.4.md).

For any River work, load only the skills in `skills/v10.4/`. Work from `questions/questions.md`, `01-01-map/{NN}.md`, the React documentation, and the map of the same lesson. Do not read files from `projects/react-09`.

## Editing the skills

- [skill-surveillance/SKILL.md](skill-surveillance/SKILL.md): how to edit these skills. Read it first.
- [skill-style/SKILL.md](skill-style/SKILL.md): how to write a skill, a rule, or a brief so a tired reader understands it on the first read. #2026_11_07_10_group_1
- [edit-preview/SKILL.md](edit-preview/SKILL.md): how to show the owner every edit in react-10 as a rendered diff before making it. #2026_11_07_08_group_1
- [prompt-writing/SKILL.md](prompt-writing/SKILL.md) and [prompt-writing/quality-checklist.md](prompt-writing/quality-checklist.md): the workspace rules for every instruction edit.
- [RULE-TAGS.md](RULE-TAGS.md): one row for each group of edits.
