---
name: lecture-structure
description: Governs the section skeleton, practical example staging, naming, and closing tables of a production lecture; use when assembling or revising lecture structure.
---

# Lecture Structure

This skill governs how a production lecture is assembled: the two-phase workflow, the section skeleton in its exact order, the principle thread's place in it (the spoken preview, the labels, the summary, the closing line), the practical example that applies the thread, component naming rules, and the closing comparison table. It covers structure and placement only; prose wording belongs to `lecture-voice`, code formatting to `code-blocks`, UI panels to `ui-panels`, and standalone HTML figures to `figures`.

Digests: `skills/old-instructions/AUTHOR-BRIEF.md` and `skills/old-instructions/instructions.md` (phases, implementation sequence, format spec).

## Workflow & Phases | 01 | The Pre-Lecture Blueprint Precedes the Lecture

- [ ] Is the Phase 1 pre-lecture blueprint authored in `01-01-md-PRE-lectures/<version>/{nn}.md` (targeting the latest version by default) before authoring production lecture prose? #2026_09_24_05_group_1
- [ ] Does the blueprint lock the structural skeleton, authorized technical vocabulary, and causal explanation flow before long-form writing begins?
- [ ] Do blueprint headings mirror the final lecture headings, mapping upcoming elements into atomic bullets with pedagogical qualifications?
- [ ] Is the approved blueprint treated as the quality gate for Phase 2, revising the blueprint when structural defects are identified rather than improvising patches in the lecture file?
- [ ] Are all five practical example stages (Stages A through E) planned as concrete elements in the blueprint before drafting code? #2026_09_20_01_group_1 revised by #2026_09_20_05_group_1

## Workflow & Phases | 02 | The Production Lecture Expands the Blueprint

- [ ] Is the Phase 2 production lecture in `01-02-md-LECTURES/<version>/{n}.md` (targeting the latest version by default) written by systematically expanding the approved pre-lecture blueprint? #2026_09_24_05_group_1
- [ ] Do the lecture file number, blueprint number, and question bank row index match exactly?
- [ ] Does the lecture deliver comprehensive technical coverage of the assigned mechanism, providing a definitive source of depth for the curriculum?

## Workflow & Phases | 03 | Lecture-First Production Order

- [ ] Is the full production lecture authored before creating any distilled review artifacts or summaries derived from it?
- [ ] Do distillations inherit their depth from a fully resolved lecture rather than guesswork about what matters?
- [ ] Are unfamiliar concepts unpacked in the lecture so downstream materials inherit grounded definitions?

## Workflow & Phases | 04 | Blueprint Traceability

- [ ] Does every paragraph in the production lecture trace directly back to an element planned in the approved pre-lecture blueprint?
- [ ] If a new technical claim, code block, or panel is required, is it added to the blueprint first to keep the files synchronized?
- [ ] Do conceptual foundation paragraphs (marked with ◇ in the blueprint) and runtime mechanics paragraphs (marked with ★) retain their planned grounding when expanded?

## Workflow & Phases | 05 | Verification Inside the Workflow

- [ ] Are pre-lecture verification gates passed before drafting the production lecture?
- [ ] Are structural traceability and pedagogical clarity gates verified before marking any lecture complete?
- [ ] Is a clean compiler build (zero warnings) verified alongside teaching quality?

## Workflow & Phases | 06 | Topic Fidelity and Architectural Independence

- [ ] Is each lecture dedicated strictly to answering its assigned interview question from the question bank?
- [ ] Does the lecture expand the specific hook and engineering challenge assigned to the question from the question bank, grounding it in universal everyday UI elements (such as item counters, ticket orders, shopping carts, or like buttons, built from plain parts such as a title, a name, a date, a time, a colour, or a counter; not niche elements such as a badge, `lecture-voice` Section 03) while strictly replacing any idiosyncratic newsroom or contrived domain lore with clean, common vocabulary? #2026_09_21_02_group_1 revised by #2026_10_07_05_group_1 and #2026_10_11_05_group_1
- [ ] Are component architectures, code setups, and figures designed specifically for the assigned mechanism rather than copied from adjacent lectures?
- [ ] Does the lecture respect the Curriculum Dependency Law, restricting code syntax, hooks, and references to what has been formally introduced up to that question (e.g. in `questions/questions.md` Version 3: no `useState` before Q14, no callback props before Q13, no `useEffect` before Q31)? #2026_09_21_02_group_1 revised by #2026_09_21_06_group_1 and #2026_10_05_04_group_1
- [ ] Is the lecture governed by both maps: `01-01-map/{nn}.md` for syllabus scope and `01-01-map-principles/{nn}.md` for the exact operational principle set and order? #2026_09_25_06_group_1 revised by #2026_09_26_19_group_1
- [ ] Does every numbered lecture principle trace one-to-one to the approved principle map, while ledger rows marked `Supporting`, `Prerequisite`, or `Preview` appear as theory prose, one-line recalls, or one-sentence forward mentions that name the owner lesson rather than as extra principles? #2026_09_26_19_group_1 revised by #2026_09_26_21_group_2
- [ ] Is every `lecture` message in `node src/handout.mjs {nn}` delivered in the lecture where the blueprint planned it? Does each forward promise the lecture makes have a matching `promise` message to that lesson, sent with `node src/handout.mjs add`? A promise kept only in prose breaks silently when the bank renumbers. #2026_10_06_02_group_5

## Section Skeleton | 07 | Canonical Skeleton Order #2026_09_25_03_group_1

- [ ] Is every production lecture assembled in this top-to-bottom sequence:
    1. Document Title: `# Lecture {n}: {Short Title}` on line 1.
    2. Interview Question Callout: `> INTERVIEW QUESTION | ...` on line 2.
    3. The opening problem: 2 or 3 numbered lines, bare under the callout (`lecture-voice` Section 15). #2026_10_11_04_group_2
    4. First Section: `### {plain sentence}` opening with the theme, its options, and the one this chapter teaches, then the questions the lecture answers and the recall list of earlier lessons the questions stand on (Section 12). #2026_10_10_01_group_5 revised by #2026_10_12_01_group_1
    5. Runway: one to three `### {plain sentence}` sections that teach every new idea and code form the question cycles need, before the first question (Section 12). #2026_10_10_01_group_5
    6. Principled Theory: `### Principles of React: {Topic}`, then the map's Spoken Preview, then one question cycle per approved principle-map entry, in its order, each ending in its `> [!PRINCIPLE]` callout (Section 12C). #2026_09_26_19_group_1 revised by #2026_10_10_01_group_5, #2026_10_11_04_group_3, and #2026_10_15_03_group_3
    7. Practical Example Section, where the thread is applied (Sections 15 to 20): #2026_10_15_03_group_4
       - `### Let's Design a Practical Example`: Open the practical example section with this exact clean heading, avoiding trailing component names. #2026_09_21_11_group_1
       - The framing paragraph: what we build now, at its real size, and that each step applies one principle in thread order (Section 15). #2026_10_15_03_group_4
       - Stage A: Scaffold UI Canvas (` ```components `) and File Explorer (` ```files `).
       - Stage B: Assembly / Scaffolding Pipeline Figure (`figures/{NN}-01-code-assembly-pipeline.html`), one card per step with its principle's label.
       - Stage C: one step per principle, in thread order, each a decision made with that principle and ending on its visible result (Section 16). #2026_09_25_05_group_1 revised by #2026_10_15_03_group_4
       - Stage D: Component Summary (`### Component Summary` with Role Mode panel), then one closing paragraph (Section 19).
       - Stage E, when it earns its place: Architecture Audit Table (`figures/{NN}-02-architecture-audit.html`, Section 20).
    8. Real-World Applications: `### Where you will meet this`, then `### For the interview` (Section 13). #2026_10_10_01_group_5
    9. Reference Glossary: `### Glossary` (defining bolded terms introduced earlier in text; zero orphan terms).
    10. Advanced Topics & Official Documentation: `## Beyond the basics` (4 to 6 authoritative bullets linking directly to live official website documentation via `(see [react.dev/...](https://react.dev/...))`; local repository paths and GitHub links are avoided; forces a PDF page break via `## `). #2026_09_21_32_group_1 revised by #2026_09_21_33_group_1
    11. Practical Review: `### Summary`.
    12. Closing Comparison Table: Three-column comparative matrix as the final block of the file.
- [ ] Is at least one standalone HTML figure embedded per lecture adhering strictly to the `figures` skill?
- [ ] Where an answer or a runway section explains a sequence (a queue, a timeline, two objects in memory), does it use an ASCII diagram fence, ` ```ascii title="{plain title}" `, built from the lesson's real values and true in every line? The build renders it as a full-width card. A diagram that claims what React does not do teaches the wrong model: Lecture 17's first diagram showed a repaint after every setter call "without batching", but a browser paints after the click handler returns, even in plain JavaScript, so the picture was false. #2026_10_10_01_group_5

## Section Skeleton | 08 | Document Title Formatting

- [ ] Is there exactly one `# ` heading per lecture, placed on line 1?
- [ ] Does it follow the standard pattern: `# Lecture {n}: {Short Title}`?
- [ ] Does the lecture number `{n}` match the question bank row, with a title that captures the core technical takeaway in plain language?

- [ ] PROPER EXAMPLE: Matching number and clear title:

> ```markdown
> # Lecture 61: What Makes a Good Key and Why Index Fails
> ```

Notes: The number matches the question bank, and the title states the technical topic clearly.

## Section Skeleton | 09 | Line-2 Interview Question Callout

- [ ] Is the interview question callout placed on line 2, immediately below the document title with no blank line between them?
- [ ] Is the callout formatted using the exact syntax: `> INTERVIEW QUESTION | {tier} | {question text}`?
- [ ] Is the question text copied verbatim from the question bank row?
- [ ] Is the curriculum tier specified accurately: `❱ CORE`, `❱❱ MORE`, or `❱❱❱ ADVANCED` (appended with ` (Server)` for server-focused questions)?

- [ ] PROPER EXAMPLE: Line-2 callout with server tier:

> ```markdown
> > INTERVIEW QUESTION | ❱ CORE (Server) | What is a Server Component and how does it differ from a Client Component?
> ```

Notes: Placed on line 2, preserves the server tier tag, and quotes the bank question verbatim.

## Section Skeleton | 10 | Semantic Heading Levels

- [ ] Is `### ` used as the standard heading level for all lecture sections and assembly steps so they flow inline without forcing page breaks?
- [ ] Is `## ` reserved exclusively for major structural milestones requiring a forced page break in the PDF (such as `## Beyond the basics`)?
- [ ] Is the document title on line 1 the single `# ` heading in the file?
- [ ] Do the numbered opening lines lead immediately into the first `### ` heading with no orphan paragraphs between them? #2026_10_11_04_group_2

## Section Skeleton | 10B | Section Headings the Lesson Writes #2026_10_07_01_group_2

- [ ] Is every section heading the lesson writes for itself (the first section, the runway sections, and the text after `Question N:`) one plain sentence in sentence case, the same title rule as a principle box (`principle-definition` Section 01)? Does it say what the section shows, with no riddle the reader must solve first? #2026_10_07_01_group_2
- [ ] Do the fixed skeleton headings keep their exact wording from Section 07 (`Principles of React: {Topic}`, `Let's Design a Practical Example`, `Component Summary`, `Where you will meet this`, `Glossary`, `Beyond the basics`, `Summary`), do question headings keep the form `### Question N: {plain sentence}` (Section 12C), and do step headings keep their Section 16 form? The blueprint mirrors the same headings. #2026_10_07_01_group_2 revised by #2026_10_10_01_group_5
- [ ] COUNTER-EXAMPLE: `### Question 1: State Batching` and `### Question 4: Updater Purity & StrictMode` (Lecture 17: labels in Title Case that name a topic; the reader learns nothing about what the question shows). PROPER: `### Question 1: Two setters in one click give one render`. #2026_10_10_01_group_5

- [ ] PROPER EXAMPLE: `### The like count changes, but the screen does not` (says what the reader is about to watch). #2026_10_07_01_group_2
- [ ] PROPER EXAMPLE: `### Three steps from a click to the screen` (names the topic in plain words). #2026_10_07_01_group_2
- [ ] COUNTER-EXAMPLE: `### A Like Button That Counts in Secret` (Title Case, and "in secret" is a riddle: who counts, and where?). #2026_10_07_01_group_2
- [ ] COUNTER-EXAMPLE: `### A Like That Reaches the Server One Click Late` (Title Case, and "one click late" must be decoded before the reader knows the problem: the server receives the old count). #2026_10_07_01_group_2

## Section Skeleton | 11 | Standard Body Progression & Engine Mechanics #2026_09_20_04_group_4 revised by #2026_09_20_05_group_1, #2026_09_20_27_group_1, and #2026_09_25_03_group_1

- [ ] Does the lecture body progress logically: (1) the theme, its options, and the recall list, (2) the runway that teaches what the questions need, (3) the spoken preview and the question cycles under `### Principles of React: {Topic}`, (4) the practical example, one step per principle, and (5) the closing sections, ending on the summary that repeats the thread? #2026_09_25_03_group_1 revised by #2026_10_10_01_group_5, #2026_10_12_01_group_1, and #2026_10_15_03_group_3
- [ ] Are underlying browser engine consequences explicitly deconstructed (for example, showing how replacing HTML with `innerHTML` wipes input focus and resets CSS transitions, whereas React reconciliation preserves node identity and focus)? #2026_09_20_27_group_1
- [ ] Are friction cards placed at the end of the topic after walking through the broken attempt, engine behavior, and working code? #2026_09_21_03_group_1 revised by #2026_09_21_08_group_1 and #2026_09_21_09_group_1

## Section Skeleton | 12 | The Recall List and the Runway Before the Questions #2026_09_20_24_group_1 revised by #2026_09_20_25_group_1, #2026_09_25_03_group_1, #2026_10_10_01_group_5, #2026_10_11_01_group_3, #2026_10_11_04_group_1, #2026_10_11_06_group_3, #2026_10_12_01_group_1, #2026_10_12_02_group_1, #2026_10_12_03_group_1, #2026_10_12_04_group_1, #2026_10_12_05_group_1, #2026_10_12_06_group_1, #2026_10_12_07_group_1, and #2026_10_15_05_group_1

The first section and the runway are the lesson's introduction. They teach the ideas the questions stand on, by their proper names (`children`, props, declarative, imperative), starting from what the reader already knows. When the reader understands the introduction, every answer can go deeper instead of starting from zero. The introduction teaches; it does not advertise the lesson or talk about interviews. #2026_10_11_04_group_1

The first section opens with the lesson's theme: the general question every developer meets, of which this lesson's topic is the answer. When developers really choose between two ways to answer it, the section shows both and says which one this chapter teaches, so the reader meets the chapter's idea as a choice they understand. When there is no such choice, the section goes from the theme straight to the chapter's idea, starting from the code the reader already writes. A list of ways serves a real choice; it is not a frame every lesson fills. The theme, and its options when it has any, come from the map's `## Theme and Options` (`map-principles` Section 05B). #2026_10_12_01_group_1 revised by #2026_10_12_07_group_1

- [ ] Does the first section open with the theme, in plain words, starting from a page or a piece of code the reader knows? #2026_10_12_01_group_1
- [ ] Does the theme pass the pertinence test? Would a developer who knows both ways really pick between them for the same job today, and could an interviewer ask when to use each? If not (one way is only the reader's starting point, or nobody would choose it once they know the other), the section names the starting point in a sentence, teaches the chapter's idea, and has no list of ways and no `[!WAYS]` box. #2026_10_12_07_group_1
- [ ] When the theme passes the pertinence test, does it show each real option with its shortest code (the call and, where the difference sits inside the component, the inside too), say in one sentence who decides what in each, and then say which option this chapter teaches? A real option is one the reader knows from an earlier lesson or one React offers. A later lesson's option is named in one sentence with its lecture, never taught here. #2026_10_12_01_group_1
- [ ] Is every option shown fairly, with the situation where it fits? The chapter's option is not better everywhere, and an earlier option is never shown only so it can fail. #2026_10_12_01_group_1
- [ ] After the options are explained, does a `> [!WAYS] {title}` box sum them up (the blueprint's `[ways]` element), one numbered paragraph per option, each separated by a blank `>` line? Does every line repeat the same frame, name the option by its exact technical term in bold, say where it comes from (an earlier lecture, plain JavaScript, or this chapter), and explain it in plain words (`lecture-voice` Section 22)? #2026_10_12_03_group_1

- [ ] PROPER EXAMPLE: The owner's frame for Lecture 1 (2026-10-12): #2026_10_12_03_group_1

> > [!WAYS] Two ways to update the DOM when a value changes
> >
> > (1) Update the DOM with **imperative programming** (plain JavaScript): you give the browser every command yourself, finding each element and setting its text.
> >
> > (2) Update the DOM with **declarative programming** (this chapter): you declare what each element should show, and React updates the DOM to match.

Notes: The same frame twice makes the difference stand out. Each line gives the term an interviewer expects and the meaning a candidate can say aloud. #2026_10_12_03_group_1

- [ ] COUNTER-EXAMPLE: "(1) Change the page with **commands** (plain JavaScript)… (2) Change the page with a **description** (this chapter)…" Notes: The writer's own words replaced the terms, so the box teaches nothing the reader can name in an interview (`lecture-voice` Section 22). #2026_10_12_03_group_1

- [ ] Do the questions then show the chosen option at work (its forms and the mistakes readers really make with it), and, when the introduction has options, does the closing comparison table return to them (Section 25)? #2026_10_12_01_group_1 revised by #2026_10_12_07_group_1

- [ ] PROPER EXAMPLE: Lecture 7's first section, built from the owner's sketch (2026-10-12). The last paragraph keeps the owner's sentence: #2026_10_12_01_group_1

> Every website shows the same kind of card many times. A shop shows each product in the same frame, and a blog shows each story in the same box. The design stays the same; only the content changes. So every React developer meets the same question: how does one card component show different content each time?
>
> React gives two answers. The first one you know from Lecture 6: the card takes a prop and places the value in its own markup.
>
> ```jsx
> <ContentCard name="Paul" />
> ```
>
> Inside `ContentCard`, the code is `<p>My name is {name}</p>`. The card decides what the content looks like, and the caller only gives the value.
>
> The second answer is to write the content between the card's tags:
>
> ```jsx
> <ContentCard>
>   <p>My name is Paul</p>
> </ContentCard>
> ```
>
> React takes everything between `<ContentCard>` and `</ContentCard>` and hands it to the card as a prop named `children`. Inside the card, the code is just `{children}`. Here the caller writes the content, and the card only gives the design around it.
>
> In this chapter, we write one React component that keeps the design the same and lets each story decide its own content. In React, this approach is enabled by a prop named `children`. We will see it with one child, with several, with none, and together with props, and at the end we will see when each answer fits.

Notes: The reader knows the question before the answer, sees both options on the same card with the same name, and knows which one the chapter follows. The prop option is not a straw man: a card whose content always has the same shape (a price tag with a name and a price) is right to use props. #2026_10_12_01_group_1

- [ ] COUNTER-EXAMPLE: Lecture 7's first section before (2026-10-11): it opened on the news site, gave the chapter's sentence, and went on "Before we get there, let's see why the props from Lecture 6 are not enough." Notes: The only other option appears so it can fail, and the reader never learns when props are the better answer. #2026_10_12_01_group_1

- [ ] COUNTER-EXAMPLE: "There are three ways to show different content in a card: props, `children`, or copying the card's markup for every story." Notes: Nobody would copy the markup once they know components (Lecture 2). The third option was invented to make a list of three, and it teaches the reader nothing about the choice. #2026_10_12_01_group_1

- [ ] COUNTER-EXAMPLE: Lecture 8's box (2026-10-12): "(1) Organize components in a **monolithic file** (Lecture 5) … (2) Organize components with **ES modules** (this chapter) …" Notes: No developer who knows modules chooses one giant file, so the first "way" is only the reader's starting point dressed as a rival, credited to a lecture that never taught it as a choice, and defended with an invented use. The section should say where the reader stands (every component in `App.jsx`, Lecture 5) and go straight to modules. The real pair of this lesson, default and named exports, belongs to its questions. #2026_10_12_07_group_1

- [ ] Does the first section name the questions the lecture answers (two or three, in bold, in the reader's words) and end with the recall list from the blueprint: one bold-led bullet per earlier lesson the questions stand on, with its lecture number and two or three sentences in the lesson's story? #2026_10_10_01_group_5
- [ ] Does the recall list name only lessons that come before this one? A later lesson is one sentence of preview in the text, never a recall bullet (`pre-lecture` Section 13C). #2026_10_11_01_group_3
- [ ] Do the runway sections, between the first section and `### Principles of React: {Topic}`, teach every new idea and code form the questions use (the blueprint's `[runway]` elements), so no question, answer, or box teaches an idea for the first time? #2026_10_10_01_group_5
- [ ] Does the text avoid jumping directly from high-level problem motivation into the practical code assembly section?
- [ ] In foundational lectures, does the runway introduce and deconstruct syntax primitives before they appear in multi-file code examples or formal principles?
- [ ] Is the introduction written to these six standards? #2026_10_11_04_group_1 revised by #2026_10_12_04_group_1
    1. **One idea at a time.** Each paragraph and each code fence carries one new idea.
    2. **Say what it is for, then name it and show it.** One or two warm sentences say what the reader is about to do and why, then the idea's proper name comes with the shortest code that shows it: the exact term an interviewer uses, with its meaning in plain words (`lecture-voice` Section 22). An example never drops in cold. #2026_10_11_06_group_3 revised by #2026_10_12_03_group_1
    3. **Say who does what.** Each sentence says plainly whether the browser, React, or our code acts.
    4. **Confirm with a second tiny example.** A second, different snippet shows the same idea working again, and one closing sentence states the idea as a rule.
    5. **Explain the code while you show it.** Point into the code and say what it does: the place where something goes, what fills it, and how it differs from what the reader already knows. Say it fully once, without engine details the reader does not need yet (`intro-examples.md`, "Example 2: Content between the tags"). #2026_10_12_02_group_1
    6. **Every sentence teaches the subject; none announces what the text is about to do.** Lecture 1 opened a paragraph with "To answer it, we need one term first": a sentence about the lesson's plan, not about the page. The paragraph reads better starting with the subject itself ("The browser does not show your HTML file directly."). #2026_10_12_04_group_1
- [ ] PROPER EXAMPLE: Lecture 7's first section, above (theme and options). Every code fence comes after a sentence that says what it shows. #2026_10_11_06_group_3 revised by #2026_10_12_01_group_1

- [ ] COUNTER-EXAMPLE: The first Lecture 7 section: "With what Lecture 6 taught, you would write the news card with one prop for each piece it shows:", then the code. Notes: A cold drop. The reader sees code without knowing what the chapter is about or what the code is for (`intro-examples.md`, "Failed: the Lecture 7 cold drop"). #2026_10_11_06_group_3

- [ ] Did the introduction pass the file-name evaluation? Before a file name or a path appears in the opening, ask whether the reader needs that name to follow the idea. It is a judgment call, judged by one standard: pedagogical clarity. A name that tells the reader where the code lives stays; a name that only decorates goes. When two or more files need to be named, the folder structure comes first in plain words (which folder holds which file), shown in the same ` ```files ` panel the case study uses (`ui-panels` Section 04), and the file names come after (`intro-examples.md`, "Example 3: File names in the introduction"). #2026_10_12_05_group_1 revised by #2026_10_12_06_group_1

- [ ] When the lesson keeps several components in one file because the series has not taught `import` and `export` yet (Lectures 2 to 7 keep them in `App.jsx`, and Lecture 8 splits them), does the project section say so once, in plain words? It says what React allows (several components in one file, convenient when they are small and work together, as react.dev's "Your First Component" says), what a real app usually does (each main component in its own file), why this lesson differs (the reader sees every component at once), and where the split is taught (Lecture 8). The files panel row for `App.jsx` can carry the same point. A reader who is never told takes one long `App.jsx` for the way real apps are built. #2026_10_15_05_group_1
  - PROPER EXAMPLE: Lecture 2: "This time `main.jsx` shows a component called `App`, and every component of the lesson lives in one file, `App.jsx`. React allows that: a file can hold several components, and the React documentation keeps small components that work together in one file. A real app usually gives each main component its own file, such as `ArticleCard.jsx`, so that no file grows to hundreds of lines. This lesson keeps every component in `App.jsx` so that you can see all of them at once. Lecture 8 shows how to give each component its own file with `import` and `export`." A later lesson says it in one or two sentences: "As in Lecture 2, one file is a choice for learning, so that you see every component at once. A real app gives each main component its own file, and Lecture 8 shows how." #2026_10_15_05_group_1
  - COUNTER-EXAMPLE: Lecture 3 before (2026-10-15): "The code runs in the same small project as Lecture 2. Every component lives in `App.jsx`, and `main.jsx` shows `App`." Notes: The layout reads as a fact about React projects. Nothing tells the reader that it is a choice for learning, or where real apps differ. #2026_10_15_05_group_1
  - COUNTER-EXAMPLE: "Putting several components in one file is bad practice, and real developers never do it." Notes: Not true. The React documentation keeps small, related components together, and the lesson's own answer to "Can several components live in one file?" is yes. The sentence corrects one wrong picture with another. #2026_10_15_05_group_1

- [ ] Do the introduction's sections read like the approved examples in `intro-examples.md` beside this file? The examples show moves: take the moves, never their topic, names, or code. #2026_10_11_04_group_1

## Section Skeleton | 12B | Autonomous Theory, Boxed Principles, and Multi-Invariant Coverage #2026_09_24_01_group_1

- [ ] Is theory completely separated from application: are the runway and the question cycles complete before the practical case study begins?
- [ ] When a lecture covers multiple foundational syntax rules or invariants, does every declared rule receive dedicated mechanical derivation and code demonstration in theory?
- [ ] Do the boxed principles match `01-01-map-principles/{nn}.md` one-to-one in order and operational decision, one question cycle per map principle, with no downstream rediscovery of the principle set? #2026_09_26_19_group_1 revised by #2026_09_26_21_group_2 and #2026_10_10_01_group_5
- [ ] Is each principle box copied unchanged from the blueprint, with its `[question-cycle]` plan lines left behind in the blueprint? #2026_10_04_10_group_1 revised by #2026_10_06_04_group_3 and #2026_10_10_01_group_5
- [ ] Are interior reference tables styled as full-width (`table.reference-table`) and kept modular?
- [ ] Does the practical case study (Stage C) contain zero syntax tokens, props, HTML tags, or attributes that were not formally taught and grounded in theory first?

Notes: The box is governed by `skills/v9.1/principle-definition/` (rules and the casebook of approved boxes) and the question and answer around it by `skills/v9.1/principled-theory/`; this section only places them in the lecture. #2026_10_06_04_group_3 revised by #2026_10_06_05_group_4 and #2026_10_10_01_group_5

## Section Skeleton | 12C | The Question Cycle #2026_10_10_01_group_5 revised by #2026_10_11_06_group_1

Each map principle reaches the reader as one cycle: a question the reader would ask, with code they could write; the answer, which explains what happens; and the box, which turns the answer into a rule for production code. The cycle is written from the blueprint's `[question-cycle]` plan. #2026_10_10_01_group_5

- [ ] Does `### Principles of React: {Topic}` open with the map's Spoken Preview, word for word, and then go to Question 1, with the cycles in map order? The preview is one paragraph for the anchor and one short paragraph per principle, each opening with its place (First, Second, Third). It lets a listener hear the whole thread once, so each question arrives as the next step of something they already hold. #2026_10_10_01_group_5 revised by #2026_10_11_04_group_3 and #2026_10_15_03_group_3

  - PROPER EXAMPLE: Lecture 1: "Everything in this lesson comes down to one idea: we describe the page from data, and React makes the browser match." Then "First, declarative programming, which means describing what the page shows, not how to change it: we write what each element shows for the data, and React changes the DOM to match, so our code never finds an element by hand." and one paragraph each for the second and third labels. #2026_10_15_03_group_3
  - COUNTER-EXAMPLE: Lecture 7 opened its principles with "In technical interviews, engineering candidates are closely evaluated on container composition..." and a description of the cycle format. It talked about the lesson instead of saying what the lesson teaches, and the reader learned nothing they could use in Question 1. #2026_10_11_04_group_3 revised by #2026_10_15_03_group_3
- [ ] Does each cycle follow this order? #2026_10_10_01_group_5
    1. `### Question N: {plain sentence}`.
    2. The scenario in prose: the situation in the lesson's story, the code in a fence, and what the screen or console shows, told as sentences.
    3. The reader's question, one bold sentence on its own line.
    4. A `---` line, then `**ANSWER**` on its own line.
    5. The verdict: a bold sentence that starts with `**The code` and says whether it does what the reader wanted, followed by one plain sentence naming the cause.
    6. The answer in prose: what happens, in the order it happens, ending in what the reader sees. Ideas from the runway or an earlier lecture are recalled in a few words, not taught again.
    7. When the verdict is "does not", the fix: the corrected code, and why it gives the right result. When the obvious fix has a catch, the answer keeps going instead of handing the catch to a new question: the fix a junior developer writes first, what it still gets wrong, and the code a senior developer writes. #2026_10_11_06_group_1
    8. An ASCII diagram when the sequence is easier to see than to read (Section 07).
    9. The `> [!PRINCIPLE]` box.
- [ ] Does the scenario tell what the code does in sentences, instead of a bullet list that repeats each line of the code? #2026_10_10_01_group_5
- [ ] Does the answer use sentences for steps that follow one another, and bullets only where the reader must tell two look-alike things apart? #2026_10_10_01_group_5
- [ ] Is every claim in the question true for the code shown, including counts of clicks, renders, and values? #2026_10_10_01_group_5
- [ ] PROPER EXAMPLE: A full cycle, written from the plan in `pre-lecture` Section 13B: #2026_10_10_01_group_5

> ````markdown
> ### Question 2: Three setter calls in one click add one ticket
>
> The "+3 Tickets" button should add three tickets to the order. The order starts at 0, and the click handler calls the setter three times:
>
> ```jsx title="TicketOrder.jsx"
> function handleAddThree() {
>   setTickets(tickets + 1); // tickets is 0 here
>   setTickets(tickets + 1); // still 0 here
>   setTickets(tickets + 1); // and still 0 here
> }
> ```
>
> After one click, the counter shows 1. After a second click, it shows 2.
>
> **Why does one click add one ticket instead of three?**
>
> ---
>
> **ANSWER**
>
> **The code does not do what we wanted.** All three lines compute the same number.
>
> During this click, `tickets` is 0 on every line of the handler, as Lecture 16 showed. So each line computes 0 + 1 and adds the same step to the queue: replace the value with 1. After the handler, React applies the three steps in order. The value becomes 1, then 1 again, then 1 again, and the screen shows 1.
>
> The fix is the updater from the start of this lecture. React gives each updater the result of the step before it, so three `setTickets(t => t + 1)` lines take the value from 0 to 1, then to 2, then to 3.
>
> ```ascii title="Plain values and updaters in the queue"
> setTickets(tickets + 1) x3     setTickets(t => t + 1) x3
> step 1: replace with 1 -> 1    step 1: 0 + 1 -> 1
> step 2: replace with 1 -> 1    step 2: 1 + 1 -> 2
> step 3: replace with 1 -> 1    step 3: 2 + 1 -> 3
> screen: 1                      screen: 3
> ```
>
> > [!PRINCIPLE]
> > **Principle 2: To change the same state twice in one click, pass an updater**
> > ...
> ````

Notes: The scenario is told in sentences, the code comments give the values, the question is one sentence, the verdict names the cause, and the answer recalls the queue and the updater in a few words because the runway taught them. The fix appears before the box, so the box's right card is code the reader has just seen work. #2026_10_10_01_group_5

- [ ] HALF WAY EXAMPLE: Lecture 17, Question 1. The cycle has every part, but the answer is three bold-led bullets ("It does not update line by line", "It waits for the handler to finish", "It updates the screen once") for three steps that simply follow one another; plain sentences would carry them with less weight. #2026_10_10_01_group_5

- [ ] Is every fix the answer presents one the author believes is complete? A fix the author knows is incomplete is shown as the junior step inside the same answer, never left as the answer so that the next question can repair it. A new question starts only when the reader would ask something new, in a new situation. #2026_10_11_06_group_1

- [ ] COUNTER-EXAMPLE: Lecture 7, Questions 4 and 5. Question 4 ended on `className={'card ' + className}` as the fix. Question 5 then showed that this fix prints `class="card undefined"` when the caller passes no class, and repaired it with `className = ''`. The reader asked nothing new; Question 5 existed only because the map numbered it. #2026_10_11_06_group_1

- [ ] PROPER EXAMPLE: The same problem answered in one cycle, from junior to senior: #2026_10_11_06_group_1

> To keep both classes, a first fix joins them by hand: `className={'card ' + className}`. A story with `className="featured"` now gets `class="card featured"`. But a story that passes no class gets `class="card undefined"`, because `className` is `undefined` and `+` turns it into the text "undefined". An experienced developer adds the default from Lecture 6 in the parameter list, `className = ''`, so a missing class becomes an empty string and the story gets `class="card "`.

Notes: One question, one answer that ends one step later. The default is recalled from Lecture 6 in a few words, not taught as a new principle. #2026_10_11_06_group_1

- [ ] COUNTER-EXAMPLE: Lecture 17, Question 2. Under the code came three bullets that repeated it line by line ("First, you call `setTickets(tickets + 1)` expecting to add the first ticket", "Right below it, you call..."), which the reader had just read. Question 3 of the same lecture asked about "multiple clicks", while the bug it showed comes from one click. #2026_10_10_01_group_5


## Section Skeleton | 13 | Where You Will Meet This, For the Interview, Glossary & Summary #2026_09_21_19_group_1 revised by #2026_10_07_03_group_1, #2026_10_07_04_group_1, and #2026_10_07_06_group_1

- [ ] Is `### Where you will meet this` placed immediately after the practical example, including 3 to 5 concise real-world use cases? #2026_10_15_03_group_4
- [ ] Is `### For the interview` placed immediately after `Where you will meet this`? #2026_10_07_03_group_1
- [ ] Does `### For the interview` start by repeating the interview question on top, formatted on one continuous line as a blockquote: `> **The Interview Question:** [Question text verbatim from line 2]`? #2026_10_07_04_group_1
- [ ] Does `### For the interview` deconstruct the interview dynamic across four distinct, battle-tested beats: #2026_10_07_03_group_1 revised by #2026_10_07_06_group_1
      1. **The Hidden Signal**: What the interviewer is really probing (differentiating junior syntax recitation from senior systems understanding of the runtime loop).
      2. **The Classic Trap**: The primary misconception candidates blurt out (and why it fails physically on the whiteboard).
      3. **What is Actually Going On**: What really happens, told with the lesson's own code and values (the queue with its numbers, the value fixed for the handler), in words a candidate can say aloud, with no compiler jargon. #2026_10_07_06_group_1 revised by #2026_10_10_01_group_7
      4. **Where It Gets Tricky**: Practical, high-stakes edge cases, asynchronous pauses (`await`), race conditions, and runtime boundary protections (such as `StrictMode` double-invocation). #2026_10_07_06_group_1
- [ ] Is `### Glossary` placed immediately after `For the interview`, defining 4 to 6 core terms formatted on single lines as `- **Term**: Plain-English definition and concrete engineering role.`?
- [ ] Is `### Summary` placed immediately after the Glossary, written as a practical review of when to write this code and why it matters?
- [ ] Is the summary structured with an authoritative bold title on line 1, followed by `❒ {Subtitle}` category headings and `➔ {DECISION_RULE}` lines formatted as independent paragraphs separated by blank lines?
- [ ] Does the summary repeat the thread? Its bold title is the anchor ("**Describing the page from data**"), its `❒` subtitles are the box labels word for word and in order, and after the last rule it ends on the map's Closing Line in bold, on its own line, before the DO THIS cards. The reader then leaves with the same shape the preview announced: one idea, its steps, and one sentence that holds them. #2026_10_15_03_group_3
- [ ] Are actionable decision rules emphasized on dedicated lines starting with `➔` using bold keywords?
- [ ] Does every summary rule keep the boundary of the box it comes from? A box that says when to pass an updater gives an `IF ... THEN` rule, not `ALWAYS`. Lecture 17's summary said "ALWAYS use updater functions", while the map's Principle 3 says a plain value is fine for one update per click. #2026_10_10_01_group_5
- [ ] Are nested sub-points or secondary notes rendered as `<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) ...` on continuous lines?

- [ ] PROPER EXAMPLE: Living exemplar of battle-tested interview coaching from Lecture 17:

> ```markdown
> ### For the interview
> 
> > **The Interview Question:** How does React queue multiple state updates, and when do you need an updater function?
> 
> **1. The Hidden Signal**
> 
> The interviewer is not testing whether you know arrow function syntax. They are probing whether you understand React's render loop and batching pipeline. A junior developer assumes state setters trigger immediate micro-renders. A senior engineer steps to the whiteboard and draws the update queue. They explain that setters do not compute state inside the click handler. Instead, setters append instructions to an internal FIFO queue. React waits until the handler finishes, enters the render phase, and reduces that queue.
> 
> **2. The Classic Trap**
> 
> The classic trap appears when an interviewer writes three consecutive setter calls on the board. Candidates often guess the count increments by three. When told it only increments by one, they claim React debounced or ignored two calls. That explanation fails the interview. React never ignores your setter calls. It faithfully appends three separate replace instructions to the queue. Because all three calls read the initial snapshot value of zero, all three queue the instruction replace with one. Another fatal trap is placing network requests or analytics calls inside an updater function. Because updaters execute during render, StrictMode runs them twice in development, triggering duplicate network requests and corrupted logs.
> 
> **3. What is Actually Going On**
> 
> Each setter call adds one step to a queue. React does not touch the screen while the click handler runs. When the handler returns, React applies the steps in order and renders once.
> 
> With `count` at 0, `setCount(count + 1)` three times queues the same step three times: replace with 1. The screen shows 1.
> 
> An updater like `c => c + 1` is a different kind of step: React passes it the result of the step before. Three updaters take the value from 0 to 1, to 2, and to 3.
> 
> Reach for an updater whenever your next value depends on other updates in the same handler. Also use updaters after an async pause, where user interactions have already changed the state.
> 
> **4. Where It Gets Tricky**
> 
> *What does React render if you call `setCount(count + 5)`, then `setCount(c => c + 1)`, then `setCount(42)` from zero?*
> 
> The final rendered count is 42. React evaluates the queue in strict sequential order during the next render pass. First, `count + 5` queues a replacement with 5. Next, the updater receives 5 and returns 6. Finally, 42 replaces the running calculation completely, discarding earlier results.
> 
> *Why are updater functions critical when setting state after an await?*
> 
> An async function pauses execution while network requests resolve. During that pause, user interactions can trigger other renders, leaving the snapshot stale. If two async requests resolve and call `setCount(count + 1)`, both read the stale zero. One ticket increment is permanently lost. An updater function bypasses the stale closure and reads the live pending total from React memory.
> 
> *Why does StrictMode run updater functions twice in development?*
> 
> React runs updaters twice to detect accidental side effects. Because React processes updaters during render, an updater that changes anything outside itself changes it twice. If an updater modifies an external object or array, running it twice produces double entries. This intentional double run surfaces the corruption in development before it reaches production.
> ```

Notes: Commentary on what makes this living exemplar work:
1. *The Spoken Reality*: Beat 3 replaces compiler terminology ("layout thrashing", "receiving running pending total") with the lesson's own queue and its numbers, which a candidate can draw on a whiteboard. An earlier version told it as a waiter carrying an order to a kitchen; the reader then had to translate the story back into code, and the story's "one dish cooked once" did not match three queued steps. #2026_10_10_01_group_7
2. *Disproving Myths with Physics*: Beat 2 dismantles the hand-waving myth that React "debounces" setters, proving with exact queue arithmetic why three calls produce 1.
3. *Real Stakes in Edge Cases*: Beat 4 demonstrates physical data loss (lost ticket purchase when multiple async requests finish out of order) and real-world development traps (`StrictMode` double-invocation exposing impure mutations).

- [ ] COUNTER-EXAMPLE: Bureaucratic compiler jargon, abstract summaries, and sports colloquialisms:

> ```markdown
> ### For the interview
> 
> **1. The Hidden Signal**
> 
> Interviewers ask this question to probe whether you understand React's batching model and execution pipeline. A junior candidate assumes setters re-render immediately.
> 
> **2. The Classic Trap**
> 
> The common wrong answer is that calling setCount three times will increment by three.
> 
> **3. The 60-Second Senior Response**
> 
> React batches updates to prevent visual layout thrashing within a single user action. Passing a plain value queues a replacement instruction, while an updater function queues a calculation that receives the running pending total...
> 
> **4. Follow-Up Curveballs**
> 
> What happens if you mix setters? The screen shows 42.
> ```

- [ ] PROPER EXAMPLE: Summary decision rules and subtitles separated by blank lines:

> ```markdown
> ### Summary
> 
> **Architectural Takeaways & Decision Matrix**
> 
> ❒ Direct Root Mounting
> 
> ➔ ALWAYS verify that the DOM container element exists before calling `createRoot()` to prevent fatal null pointer exceptions.
> 
> ➔ IF building a single-page application THEN mount the root component once at the application entry point.
> 
> ❒ Multi-Tree Applications
> 
> ➔ ALWAYS isolate independent micro-frontends into separate `createRoot()` trees with dedicated DOM nodes.
> ```

## Practical Example | 14 | Section Title Format & Clean Heading #2026_09_21_02_group_1 revised by #2026_09_21_11_group_1

- [ ] Is the practical example section titled simply and cleanly as `### Let's Design a Practical Example`?
- [ ] Does the heading avoid appending component names, file names, or domain features? #2026_09_21_11_group_1
- [ ] Does the heading avoid generic corporate process labels, reading as an inviting invitation to build?

- [ ] PROPER EXAMPLE: Clean, universal practical example heading:

> ```markdown
> ### Let's Design a Practical Example
> ```

Notes: Inviting, concise, and uncluttered; component names belong in the File Explorer and individual step titles.

## Practical Example | 15 | The Framing Paragraph, Then Stages A & B #2026_10_15_03_group_4

The questions taught each principle on the smallest code that shows it. The practical example is where the reader uses them together, on the example at its real size. It opens with a few sentences that say so, because a reader who meets a canvas with no word before it does not know what to look for. #2026_10_15_03_group_4

- [ ] Does the section open with a framing paragraph before any panel? It says what we build now and at what size (the scale the bank's hook promises, such as a name in several places), that each step applies one principle of the lesson in the same order, and what to keep open while reading (the dev server, the Elements panel, the console). #2026_10_15_03_group_4

  - PROPER EXAMPLE: Lecture 1: "Each question tested one principle on the smallest header that shows it. Now we build the header from the opening at its real size. Mary's name shows in three places: the greeting, the corner, and the account menu. The number of her new messages shows in two: the Messages link, and a notice below it. The header also holds the search box she types into. Each of the three steps applies one principle of this lesson, in the same order, and ends with what the page shows, so keep the dev server running and the Elements panel open." #2026_10_15_03_group_4
  - COUNTER-EXAMPLE: The first react-08 demo of Lecture 1 put the canvas, the files panel, and the figure straight under the heading. The reader saw a finished header they had already seen in the runway, with no sentence saying what was new or what to watch (brief 2026-10-15-02). #2026_10_15_03_group_4

- [ ] Does Stage A then show the Rendered UI Canvas (` ```components `) with the completed interface, followed by the File Explorer (` ```files `) showing the files the steps build or inspect? #2026_10_15_03_group_4
- [ ] Does Stage B follow with the assembly pipeline figure (`figures/{NN}-01-code-assembly-pipeline.html`), one card per step, each card carrying its step title and the label of the principle it applies? #2026_09_25_05_group_1 revised by #2026_10_15_03_group_4

## Practical Example | 16 | Stage C: One Step per Principle, Combined on a Larger Example #2026_09_20_04_group_4 revised by #2026_09_20_26_group_1, #2026_09_21_02_group_1, #2026_09_25_05_group_1, #2026_09_25_07_group_1, and #2026_10_15_03_group_4

The case study neither teaches nor repeats. It combines what the questions taught in one new, larger situation, so the reader sees the principles work together and makes each decision with a principle they already hold. #2026_10_15_03_group_4

- [ ] Does each step apply one principle (or one stretch of a grouped thread, `map-principles` Section 04B), in thread order, so the step count follows the thread (two steps at least, and five when the thread has five principles, as in Lecture 3)? Does each step say in its first sentence which principle it applies, by its label? #2026_10_15_03_group_4
- [ ] Does each step make one decision the reader has not watched yet, on the larger example, with a principle already taught? Apply the per-step test: a decision made with an earlier principle stays; a decision that needs a new idea means the idea belongs earlier in the lesson (the runway or a question), so move it there; a step that decides nothing, only re-adding lines the reader has seen finished, is cut. #2026_10_15_03_group_4
- [ ] Does each step end with its visible result: what the screen, the Elements panel, or the console now shows, in a sentence or a panel? When a step changes data, does it ask the reader to predict the result before showing it? #2026_10_15_03_group_4
- [ ] Does the example grow to the size the bank's hook promises (a value in several places, a second value, a longer list), within the map's Authorized Scope, so the cost the lesson warned about becomes visible on the page? #2026_10_15_03_group_4

  - PROPER EXAMPLE: Lecture 1. Step 1, "we describe the header from its data", applies the first principle: two variables at the top of `SiteHeader`, no DOM call, and the Elements panel shows the header inside the empty root. Step 2, "we read each value in every place that shows it", applies the second: five places read two variables, and the notice, where a typed "3" slips in most easily, reads `{unreadCount}`. Step 3, "we change both values while the user types", applies the third: the reader predicts, then sees five texts change while "elections" stays in the search box. No step teaches a new idea, and none shows code the questions already showed. #2026_10_15_03_group_4
  - HALF WAY EXAMPLE: The same three steps, each ending on its code. The decisions are right, but the reader never sees the result the lesson trained them to look for, so Step 3's five changes are a claim rather than an observation. #2026_10_15_03_group_4
  - COUNTER-EXAMPLE: The first react-08 demo of Lecture 1: "add the greeting", "add the corner", "add the search box". The runway and Questions 2 and 3 had already shown the finished ten lines, so the steps cut them up and rebuilt them, and no step decided anything (brief 2026-10-15-02). #2026_10_15_03_group_4

- [ ] Does the example model an authentic, elegant component that a professional tutorial or senior staff engineer would design, capturing the genuine essence of the mechanism rather than a contrived, artificial toy widget? #2026_09_25_05_group_1
- [ ] Does the progression avoid the artificial "4-file shredding" pattern, keeping closely related logic cohesive rather than inventing trivial 2-line helper files or unnatural imports just to fill an arbitrary step quota? #2026_09_25_05_group_1
- [ ] Does each Stage C heading end with the exact file being built, using active collaborative phrasing tailored to the step count (e.g. for 2 steps: `Step 1: First...` / `Step 2: Finally...`; for 3 steps: `Step 1: First...` / `Step 2: Next...` / `Step 3: Finally...`; for 4 steps: `Step 1: First...` / `Step 2: Next...` / `Step 3: Then...` / `Step 4: Finally...`)? #2026_09_21_10_group_1 revised by #2026_09_25_05_group_1
- [ ] Does the final step represent a meaningful architectural milestone (such as completing the feature, wiring the interactive loop, or composing the widget into a realistic consumer feed), avoiding perfunctory boilerplate mounts that teach nothing new? #2026_09_25_05_group_1
- [ ] Are UI building blocks called components, avoiding "presenter" jargon ("pure presenter", "header presenter")? #2026_09_21_10_group_1
- [ ] In Archetype A (Component-Driven Assembly), when the steps build several components, are they assembled top-down within the thread order (parent container declaring child prop interfaces first; child components fulfilling props middle; consumer integration sealed last)? When the thread and the file order disagree, the thread decides, because each step applies one principle. #2026_10_15_03_group_4
- [ ] Does every code snippet across all steps stay within the 10-line code ceiling with zero leading blank lines, focusing on clean idiomatic component architecture and natural explanatory comments without tildes? #2026_10_03_04_group_1 revised by #2026_10_04_01_group_1
- [ ] Is every window in the steps a view of the file the step heading names, under that file's name and at its real line numbers? The file's first appearance, when it needs more than one window, is a continuation chain; each later change shows the changed lines where they now sit, one window per place, with a sentence naming the component and the line (`code-blocks` Sections 06 and 06B). Lecture 3 is the model: Step 1 pastes `App.jsx` as lines 1 to 9 and 10 to 19, Step 2 closes line 5 and line 13, and Step 4 says that the new `<section>` moved `App` down before it shows lines 13 to 22. The same holds for the windows in the answers. #2026_10_15_04_group_1

- [ ] PROPER EXAMPLE: Professional, cohesive 3-step component assembly:

> ### Step 1: First, we construct the weather card container <WeatherCard.jsx>
> ### Step 2: Next, we build the interactive city search <CitySearch.jsx>
> ### Step 3: Finally, we compose the weekly forecast page <ForecastPage.jsx>

Notes: 3 steps; each file represents an authentic component with a load-bearing architectural role; zero trivial helper files.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Artificial 4-file shredding and trivial helper components:

> ### Step 1: First, we construct the outer container <WeatherAlert.jsx>
> ### Step 2: Next, we build the title text <AlertTitle.jsx>
> ### Step 3: Then, we declare the input control <AlertControls.jsx>
> ### Step 4: Finally, we mount the feature inside <App.jsx>

Notes: Forces 4 files by extracting a 2-line `<h2>` and a single `<input>` into separate files just to fulfill a 4-step quota, resulting in unnatural imports and amateurish code architecture.

## Practical Example | 17 | Stage C: Callback Tracing, Decoupling & Scaffolding Narration #2026_09_21_02_group_1 revised by #2026_09_25_03_group_1

- [ ] Does the commentary in each assembly step deliver meaningful architectural explanations connecting code to developer intent and engine behavior, strictly avoiding mechanical line-by-line recitation or robotic code-mapping formulas? #2026_09_25_03_group_1
- [ ] In component-driven lectures, when a child invokes a callback prop (`onSelect`, `onChange`, `onSubmit`), does prose trace the complete Upward Wire circuit (callback origin, parent declaration, child statelessness, parent memory execution, inverse data flow)?
- [ ] In component-driven lectures, are component boundaries justified using the Negative Counterfactual circuit (what breaks if merged, concrete disaster, physical code invariants, symmetric refactoring proofs)?
- [ ] In scaffolding and tooling lectures, are concrete engine mechanics narrated (what is written to disk, what the browser parses and runs, what runtime failures are eliminated)?

## Practical Example | 18 | Pedagogical Crossroads: Grasping Opportunities to Teach Fundamentals #2026_09_21_12_group_1 revised by #2026_09_21_14_group_1 and #2026_09_22_11_group_1

- [ ] When a step meets a choice developers often get wrong, does the text pause to weigh it with what the lesson already taught? A fundamental the reader does not have yet belongs in the runway or a question, not in a step (Section 16). Lecture 1, Step 2 asks why the account menu does not get its own component, and answers with what the reader has: without props, which Lecture 6 teaches, it would need its own copy of the name. #2026_10_15_03_group_4
- [ ] Does the crossroad follow the [pedagogical-crossroads](../pedagogical-crossroads/SKILL.md) skill:
    1. Declaring both options upfront in an unordered bullet list with teal arrow markers (`- **Option 1...` and `- **Option 2...`), previewing concrete syntax tokens? #2026_09_22_11_group_1
    2. Maintaining strict lexical consistency across the entire crossroad, avoiding shifting labels?
    3. Presenting the two options in separate, integrated code snippets with symmetric margin comments?
    4. Providing focused prose deconstructing engine behavior, junior pitfalls, and senior architectural trade-offs?

## Practical Example | 19 | Stage D: Component Summary #2026_09_20_09_group_1 revised by #2026_09_21_02_group_1, #2026_09_21_16_group_1, and #2026_09_21_20_group_1

- [ ] Is the practical experiment concluded under the heading `### Component Summary` without trailing subtitles?
- [ ] Does the heading render as a full-width horizontal title across the page with generous vertical space below it?
- [ ] Is the Component Role panel placed immediately below the heading, scoped to the core architecture (maximum 3 items), and rendered bare on the page substrate? Does it describe what the steps built and what each file does, saying plainly when a file was prepared and no step changed it? #2026_10_15_03_group_4
- [ ] Is the practical example closed by one paragraph after the panel: what a developer from the old habit expected, what React 19 did on the larger example, and each step's principle named once, in thread order? This paragraph is the example's one ending; the closing sections that follow have their own jobs. #2026_10_15_03_group_4

  - PROPER EXAMPLE: Lecture 1: "A developer who comes from plain JavaScript expects the update code to grow with the header: five places mean five commands for every change... In React 19, the header grew from two places to five, and the update code stayed at zero lines. Each step applied one principle. The header is described from data, every place reads one variable, and a change of the data ends in exactly the texts that changed, while the search box stays as the user left it." #2026_10_15_03_group_4
  - COUNTER-EXAMPLE: The first react-08 demo of Lecture 1 ended its example three times: the closing paragraph, the audit table, and the closing comparison table each said "commands against one description" again, and the role panel explained `main.jsx`, which no step built (brief 2026-10-15-02). #2026_10_15_03_group_4

## Practical Example | 20 | Stage E: Architecture Audit Table, When It Shows Something New #2026_10_15_03_group_4

The audit table walks the layers of the built example, from the parent to the last control, and sets what a developer expected beside what happened. It earns its place when the example has several layers that each behave differently, so the table shows a comparison the steps could not show one at a time. When the steps already ended on their results, as Lecture 1's one-component header does, the table only repeats them, and the owner removed it. #2026_10_15_03_group_4

- [ ] When the lecture includes the table, does it show something the steps did not: several components or layers side by side, each with the expectation and the result? #2026_10_15_03_group_4
- [ ] Is it the Archetype 10 figure (`figures/{NN}-02-architecture-audit.html`, `figures` Section 14): an uppercase eyebrow (`LESSONS FROM THE CODE`), a title naming the lecture's engineering challenge, three columns (`Component Layer`, `Naive Expectation`, `What Happened`) with shading on the reality column, and a verdict row? #2026_10_15_03_group_4

## Component Naming | 21 | Everyday Vocabulary and Clear Roles

- [ ] Are component names chosen from universally understood everyday English words, allowing any developer to instantly picture what the component represents?
- [ ] Are names simplified if a reader cannot immediately picture the on-screen element?

- [ ] PROPER EXAMPLE: Components named with everyday words:

> `SearchBar`, `RecipeTitle`, `SearchSummary`, `CommentSection`, `FeedbackPortal`

Notes: Each name conveys an immediate mental image, allowing the reader to understand the component's role before inspecting its code.

## Component Naming | 22 | Avoid Noun Pileups and Visual Shape Slang

- [ ] Does the naming avoid combining three or more nouns into a single component name?
- [ ] Are components named after what they represent in the application rather than visual shapes or internal jargon (`Badge`, `Ticker`, `Prompter`, `ShelfCategory`)?

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Piling up nouns and visual shape slang:

> `SearchResultsBadge`, `ForecastStatsBadge`, `RecipePrompter`, `FeedbackSwitcher`

Notes: Piles up nouns and relies on visual shape jargon rather than meaningful application roles.

## Component Naming | 23 | Name by Role, Not HTML Tags

- [ ] Are components named after their functional role in the user interface rather than raw HTML tags or table coordinates (avoiding `...Row`, `...Cell`, `...Div`, `...Span`):
    * `...Item` for individual list entries (such as `TodoItem` or `CartItem`).
    * `...Header` for section dividers (such as `CategoryHeader`).

- [ ] PROPER EXAMPLE: Naming by role instead of HTML tags:

> `TodoItem` instead of `TodoRow`, `CartItem` instead of `CartItemRow`, `CategoryHeader` instead of `CategoryRow`

Notes: The names describe the functional role of the element, ensuring the name remains accurate even if markup is refactored from table rows to list elements.

## Component Naming | 24 | Standard Genealogical Hierarchy Terms

- [ ] Are standard genealogical terms used when describing component relationships across prose, figures, and UI panels (`parent`, `child`, `nested child`, `grandchild`, `ancestor`, `descendant`, and `terminal UI control`)?
- [ ] Are informal or idiosyncratic terms like `leaf component` or `outer shell wrapper` avoided?

## Closing Tables | 25 | Closing Table Placement & Contrast #2026_10_12_01_group_1 revised by #2026_10_12_07_group_1

- [ ] Does the lecture end with the comparison table as the definitive final block of the Markdown file, placed directly under `### Summary`?
- [ ] When the introduction has options, does the table compare them (the map's `## Theme and Options`), with a row that says when each one fits, so the lesson ends on the question it opened with? Lecture 7's table compares a prop and `children` and ends on "use a prop when the card decides the content's shape, `children` when the caller does". #2026_10_12_01_group_1
- [ ] In lectures where no direct alternative exists, is a structured "What to Remember" matrix used mapping core terms to operational invariants?
- [ ] In the summary comparative decision blocks (under `**DO THIS:**` and `**DO NOT DO THIS:**`), are code blocks kept strictly comment-free, obeying workspace law that keeps summary decision cards stark and uncluttered? #2026_10_03_04_group_1

## Closing Tables | 26 | Standard Three-Column Table Shape

- [ ] Is the closing comparison table formatted in a fixed three-column markdown structure:
    1. First header cell empty (`| |`).
    2. Second and third column titles formatted as uppercase names with a one-word lowercase subtitle: `**CAPS**<br>(subtitle)`.
    3. Table alignment divider row set to `| ---: | :--- | :--- |` (right-aligning dimension column, left-aligning content columns).
    4. Every body row starting with a bold dimension title (`**Dimension**`).
- [ ] Are all titles kept inside the header row to ensure clean table rendering in the PDF without duplicate unstyled rows?

- [ ] PROPER EXAMPLE: Standard closing table layout:

> ```markdown
> | | **VANILLA JS**<br>(Manual DOM) | **REACT**<br>(Declarative Components) |
> | ---: | :--- | :--- |
> | **Who updates the DOM** | You, node by node, by hand | React, from the description your component returns |
> | **Reuse** | Copy-paste with different IDs | Components carry their own logic everywhere |
> ```

Notes: Leaves the top-left cell empty, formats headers with capitalized names and subtitles, right-aligns dimensions, and provides direct, concise contrasts.

## Closing Tables | 27 | Inline Code Wrapping in Table Cells

- [ ] Is explanatory prose separated from an inline code string inside table cells using a `<br>` tag placed after the prose?
- [ ] Are multi-expression code strings split across separate inline code spans joined by `<br>` rather than a single long span that wraps mid-token?
- [ ] Is `<br>` placed between separate code spans, avoiding placement inside an inline code span?

- [ ] PROPER EXAMPLE: Splitting code spans cleanly:

> ```markdown
> | **Mounting** | Two-step:<br>`createRoot(node)`<br>`.render(<App />)` | One call: `hydrateRoot` |
> ```

Notes: Each code span remains whole and uninterrupted, avoiding awkward hyphenations and background breaks in print.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Single long code span wrapping mid-expression:

> ```markdown
> | **Mounting** | `createRoot(node).render(<App />)` | One call: `hydrateRoot` |
> ```

Notes: The single long code span wraps mid-expression across narrow column boundaries, creating broken background padding in the PDF.

## Closing Tables | 28 | Pure HTML/Markdown Standard & Anti-LaTeX Syntax #2026_09_22_09_group_1

- [ ] Does the document avoid all LaTeX math syntax (`$...$`, `$$...$$`) and LaTeX commands (`\rightarrow`, `\leftarrow`, `\le`, `\ge`, `\times`, `\cdot`, `\frac`) across all prose, bullets, and table cells?
- [ ] When authoring directional sequences, hierarchies, or life cycles, is the unicode arrow (`→`, U+2192) or descriptive English words ("to", "leads to") used?
- [ ] When rendering mathematical formulas or purity expressions, are they wrapped as inline code spans (e.g. `y = f(x)`, `UI = f(state)`) or written in standard prose?
- [ ] When rendering mathematical inequalities or relational comparisons, are unicode characters (`≤`, `≥`, `≠`) or standard comparison operators (`<=`, `>=`, `!==`) used in code spans?

- [ ] PROPER EXAMPLE: Clean code spans and unicode symbols:

> ```markdown
> | **Purity Guarantee** | Strictly pure function: `y = f(x)` with identical inputs producing identical JSX |
> | **Component Hierarchy** | Top-down tree flow: ShopLayout → ProductGrid → ProductCard |
> ```

Notes: Uses standard code spans and unicode arrows that render natively without raw dollar signs or LaTeX commands.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Raw unrendered LaTeX math syntax:

> ```markdown
> | **Purity Guarantee** | Strictly pure function: $y = f(x)$ with identical inputs producing identical JSX |
> | **Component Hierarchy** | Top-down tree flow: ShopLayout $\rightarrow$ ProductGrid $\rightarrow$ ProductCard |
> ```

Notes: Emits raw unrendered dollar signs (`$y = f(x)$`) and broken LaTeX backslash commands (`\rightarrow`) into the output document.
