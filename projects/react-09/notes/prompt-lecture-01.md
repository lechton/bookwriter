PROJECT: React 08
Lesson NN: 02
Exception Status: YES

Project: {PROJECT}. Lesson: {NN}. Work only on this lesson. All paths are relative to this project folder.

Current folders (resolved by the script for this run; these are the only current version):
- Skills: {SKILLS_DIR}
- Pre-lectures: {PRE_DIR}
- Lectures: {LEC_DIR}
- Figures: {LEC_DIR}/figures

Your deliverables: the blueprint {PRE_DIR}/{NN}.md, the lecture {LEC_DIR}/{NN}.md with the figures the skills require, the HTML and PDF from the build, and a report at logs/{NN}-report.md. Change no other file. Write everything from scratch.

## 1. The contract

Important Exception: if Exception Status is YES you are asked to get consult for any interesting explanations already found in the archived file within this same Project. This means you ignore the ban underneath, when it comes to geting consultations from the archived files, but it concerns only the acrhive in the current project React 08, which you are advised to consult 

The principle map 01-01-map-principles/{NN}.md is the contract. Before anything else, run `node src/diagnose-map.mjs {NN}`. If the map is missing or the command reports any FAIL, write only the report, say why, and stop. Do not write a blueprint or a lecture without a passing map.

Read the map this way:
- Each `### Principle N` becomes one question cycle in the lecture, in the map's order, and ends in Principle N's box. Never merge, split, reorder, add, or drop a principle.
- `Real Mistake` decides the box cards: a filled Real Mistake gives a right card and a wrong card; `none` gives the right card alone.
- `Fix In` means the cycle that shows the mistake also shows its fix. When it names a later principle, that later cycle adds only what the first did not show: its own Real Mistake and its boundary.
- `Condition` and the Review Point hold the rule's boundary. Keep it in the box, the answer, and the summary. A rule with a boundary is never written as ALWAYS.
- The `## Terms` rows marked New become the runway: each word or idea is taught before the first question, in the order the questions need it. Rows marked Recall, and the ledger's Prerequisite rows, become the recall list: a few words each, naming the lesson. Preview rows get one sentence naming the owner lesson. Supporting and Merged rows go into theory prose or "### For the interview".
- Use the map's facts, never its wording. Replace story names from the map (such as "Free Passes", `setPasses`, newsroom words) with everyday ones: count, tickets, items, likes, cart, user, name.

## 2. Sources, in this order

1. The lesson map 01-01-map/{NN}.md and the principle map.
2. The skills in {SKILLS_DIR}, loaded in the order {SKILLS_DIR}/README.md gives for writing a pre-lecture and then a lecture. The lecture's shape comes from the skills: lecture-structure Sections 07, 10B, 12, and 12C; principled-theory; principle-definition with its casebook examples.md; lecture-voice; code-blocks. Follow them; do not invent another shape.
3. The official documentation the maps cite, in the corpus at {CORPUS}. Read it before writing. Every claim about React's behavior must match it.
4. The lectures and blueprints in the current folders with a lesson number lower than {NN}. Read them only to learn what the series has already taught, so your recall list is true and you never teach a thing twice.
5. The most recent archived version of this same lesson, if one exists: {LEC_DIR}/archive/ and {PRE_DIR}/archive/, files whose names start with {NN}. Use it only as a checklist: which facts, examples, and terms it covered, so the new lecture misses none of them. Never copy its structure, headings, wording, or boxes; it was written under older rules and its shape is what this rewrite replaces.

Do not read any other archive file, any other version folder, or any other project.

## 3. Write the blueprint

Follow {SKILLS_DIR}/pre-lecture/SKILL.md. The blueprint holds, in order: the recall list, the runway, and for each principle one `[question-cycle]` plan followed by its finished box. Each plan has the eight lines of pre-lecture Section 13B: Question, Code and result, Verdict, Answer, Fix, Rule with boundary, Needs, Diagram.

Then check the blueprint before you write the lecture. Reread it once against each of these, and fix it until every one is true:
- One plan per map principle, same order, same numbers.
- Each Question is one a beginner would really ask about the code shown, and its counts are true (one click, two calls, the value it shows).
- Each Code and result is what React actually does, checked against the documentation. Trace the code by hand: the value of each state variable after each line, and what the screen shows.
- Each Verdict agrees with the map: "works" when Real Mistake is none, "does not work" when it is filled.
- Each Rule tells the reader what to write, keeps its boundary, and uses only words the runway, the recall list, or an earlier answer taught. Every word in a Needs line appears in the runway or the recall list.
- Each box's right card is the fix the answer showed, with general names; its wrong card, when there is one, is the Real Mistake.

## 4. Write the lecture

Write the lecture from the blueprint, never from memory of the map. Teach each principle as one question cycle in the order of lecture-structure Section 12C: `### Question N: {plain sentence}` in sentence case; the scenario in prose and code; the bold question on its own line; `---`; `**ANSWER**`; the verdict starting with `**The code`; the answer on the reader's own code; the fix; an ASCII diagram where the order of events matters; the principle box last. After the cycles, follow the closing skeleton of lecture-structure Section 07: the practical example, `### Where you will meet this`, `### For the interview` (opening with `> **The Interview Question:** [question]`), `### Glossary`, `## Beyond the basics`, and `### Summary`.

While writing:
- Explain with the reader's own code and ASCII diagrams, not with outside comparisons (waiters, newsrooms, photographs).
- Do not repeat the code line by line in bullets; say what it does in sentences.
- A comment after JSX markup is written `{/* ... */}`, never `//`. A comment says what the reader cannot see in the line, such as the value at that moment.
- Give each name its role on first mention ("the setter `setCount`"). Repeat the noun when "it" could point at two things.
- In the summary, every rule keeps its boundary (IF ... THEN).
- The first time the series uses a JavaScript form (destructuring, a ternary, an arrow function returning an object), explain it in a sentence or two.

## 5. Stop instead of guessing

Stop, write the report, and change nothing further when:
- the documentation contradicts the map;
- a principle needs a word or idea that is neither in the map's Terms nor taught by an earlier lesson;
- you cannot make a question cycle true without changing what the map says.
Name the principle, quote the conflicting lines, and say what you would change. A stopped run with a clear report is a good result; a lecture that hides the conflict is not.

## 6. Check the lecture, reading first and scripts last

First run the reading gates of {SKILLS_DIR}/verification/SKILL.md Section 21 on the finished lecture. Reread it cycle by cycle against the blueprint: the same question, the same verdict, the same rule with its boundary, the same cards. Fix what differs.

Only then run, in this order:
1. `node src/diagnose-lecture.mjs {NN}`: fix every FAIL and rerun until none is left. Read each INDICATION and fix the ones that are real.
2. `node src/build-lectures.mjs {NN}`: fix every warning and rebuild until it is clean.
3. `node src/build-lectures.mjs` for the reader deck.

## 7. The report

Write logs/{NN}-report.md:
- First, one line per reading gate: what you found and what you fixed, with the line or principle. "Passed" alone is not a line.
- Then any archive checklist item you deliberately left out, and why.
- Then the exact final output of diagnose-lecture and of the build, including DRAFT PASS lines and any failure. Never claim a clean pass you did not see.
