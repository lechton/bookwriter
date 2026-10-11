Project: {PROJECT}. Lesson: {NN}. Work only on this lesson. All paths are relative to this project folder.

Current folders (resolved by the script for this run; these are the only current version):
- Skills: {SKILLS_DIR}
- Pre-lectures: {PRE_DIR}
- Lectures: {LEC_DIR}
- Figures: {LEC_DIR}/figures

The script may have already archived any earlier draft of this lesson. Write the pre-lecture {PRE_DIR}/{NN}.md and the lecture {LEC_DIR}/{NN}.md from scratch, with the figures the skills require, then build the HTML and PDF. Load the skills in the order given in {SKILLS_DIR}/README.md.

Sources, in order:
(a) The lesson map 01-01-map/{NN}.md and the principle map 01-01-map-principles/{NN}.md. The principle map is the contract: teach its principles in its order, and handle every other ledger row as its disposition says (Prerequisite: a one-line recall naming the owner lesson; Preview: one sentence naming the owner lesson). Treat its roles, placement, mechanism, and defect as raw material; never paste its wording into a principle box.
(b) The principle standard: {SKILLS_DIR}/principle-definition/SKILL.md. Its Golden Exemplar Bank is the model for format and depth.
(c) The official documentation the maps cite, in the corpus at {CORPUS}. Read it before writing.
(d) Your own knowledge of the pain points good tutors and authors address on this topic.

What you may read for consistency: the lectures and pre-lectures in the current folders above whose lesson number is lower than {NN}. Read them only to see what the series has already introduced and explained, so you build on it instead of repeating or contradicting it. Do not copy their content, and do not take their principles, structure, or wording as a model.

What you must not read:
- Any archive/ folder, anywhere in the project.
- Any previous version folder: every lecture, pre-lecture, figure, or skills folder other than the current folders listed above, even when it holds the same lesson number.
- Files from other projects in this workspace.

Principles (most important): each box must be clearly read and understood on a first pass, clear like the water to both junior and senior developer. For each principle, cover properlhy Steps 1 to 8 of principle-definition in the pre-lecture's [principle-steps]. Choose the shape by Step 2: either plain sentences (for easier to understand principles), bullets  when the principle has some internal complexity and particularly when the reader must tell two look-alike roles apart. Every box clarifies the runtime defect.

- make sure you consult your own knowledge (as an AI) on pain points raised by various tutorials and videos and other sources where charismatic tutors or authors try to address these issues, as general context considering before responding 
- the most important instruction: make sure the language of the whole text and the language of the principles AND the explanations of the principles, all conform to easy-to-read standards, with exceptional clarity! 
- make sure all elements, variable names etc, use common vocabulary a basic english speaker would recognise, e.g. prefer variable named colour or name or title instead of schema, tone etc, prefer an element Article rather than Masthead, using proper React syntax of course. Similarly NEVER use idiosyncratic news terms for the examples, never use "byline" of a story, or "wire" a story, use instead "Latest News" etc. 
- Make sure you remind shortly to the reader complex JS operations you introduce for the first time in the series of questions, e.g. what is a ternary conditional operator, what is  destructuring  etc. Of course this is not to happen in all lectures, but in the first where they appear


Gates: run `node src/diagnose-lecture.mjs {NN}` and `node src/build-lectures.mjs`. Report the exact output, including any DRAFT PASS lines or failures. Do not claim a clean pass. Change no file other than this lesson's own deliverables.
