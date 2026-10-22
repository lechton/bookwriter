# Running Brief: User Corrections & Candidate Rules for River Version (`v2`) Skills

This brief records every pedagogical correction, directive, and authoring standard given by the user during the Lecture 4 (`experiment-04-river`) workstream.
- **Canonical Version Names**:
  - **`v1` = Original Version** (`skills/v9.1/v1/`, `01-01-map-principles/v1/`, `01-02-md-LECTURES/v1/`)
  - **`v2` = River Version** (`skills/v9.1/v2/`, `01-01-map-principles/v2/`, `01-02-md-LECTURES/v2/`, `01-03-md-lectures-HTML/v2/`, `01-04-md-lectures-PDF/v2/`)

---

## 1. Reader Persona: Short Attention Span, CEFR B2 Language, and a Headache
- **User Directive**:
  > *"Assume the reader has short attention span, needs B2 language and has a headache. You need to always keep the reader engaged. Why on earth the reader should start reading about this or that detail? Compare with the existing lessons, read them couple of time to compare, please do not make it worse than the existing lessons."*
- **What Went Wrong**:
  - Starting a section with a dry, mechanical procedural chore: *"Let's start by pulling one `<article>` out of `App` and putting it into its own function called `ArticleCard`. We add a `console.log('ArticleCard runs')` inside it so we can see every time the function actually runs:"*
  - Opening the chapter with a 28-line wall of code before the reader even feels the problem.
- **Candidate Skill Rule (Motivation Before Mechanics / Headache Test)**:
  - **Never open a chapter or section with a procedural chore** (*"Let's pull X out of Y and add a console.log..."*). A tired reader with a headache will stop reading immediately if they do not know **why** they should care.
  - **Open with a 3-line human problem and the shortest possible 3–5 line code example** that shows the core idea in 5 seconds.
  - **Keep sentences short (7–15 words on average), calm, and strictly CEFR B2**. Every paragraph must earn the reader's attention before asking them to read code.

---

## 2. Real Coding Bugs vs. Genuine Interview Depth (Never Inflate Nitpicks into Fake Common Bugs)
- **User Directive**:
  > *"BEFORE you mention a central issue e.g. 'If ArticleCard is just a JavaScript function that returns JSX, why can't I write {ArticleCard()} inside `<main>` and call it myself?' Make sure it is a REAL and COMMON issue that ACTUAL developers have to face in coding, debugging (IMPORTANT BUG!) or common theoretical struggle during code interview! Some questions are important due to their implications in theoretical understanding in a code interview (focus on that) other issues due to the common bugs they appear. What you do is none. You focus on theoretical details, and nitpick as if it is common bug. STOP IT! REWRITE THE WHOLE THING taking into consideration what a coder needs to be concerned about when writing code or taking an interview (theoretical depth). To my knowledge no person will even try to run a component as function, is there a trap in an interview question to that? If not, just mention it once and focus on what is really really important, and put it in the center of your analysis."*
- **What Went Wrong**:
  - Treating `{ArticleCard()}` (calling a component as a function inside JSX) as if it were a common beginner coding mistake and building the centerpiece of Principle 1 around it. In reality, almost no coder writes `{ArticleCard()}` by accident; it is at most a brief theoretical follow-up in an interview.
- **Candidate Skill Rule (The Two Valid Reasons a Section Exists: Real Bug or Interview Depth)**:
  - Before introducing any concept, question, or contrast, classify why it matters and tell the reader upfront:
    1. **A real, painful coding or debugging bug** that developers actually hit in practice (e.g., forgetting to render `<ArticleCard />` so the card never appears; naming a component `<footer />` or `<articleCard />` so React silently renders an empty HTML tag; putting JSX on the line below a bare `return` so ASI returns `undefined` with zero console errors; defining `CommentBox` inside `ArticleCard` so every re-render destroys the `<input>` and wipes out typed text and cursor focus).
    2. **A genuine theoretical struggle in code interviews** (e.g., *What is a component and what does "rendering" actually mean? Who calls `ArticleCard`? Why is there no `<ArticleCard>` tag in the browser's Elements panel? Why is `PascalCase` a compiler rule rather than a style convention? Why does nesting a component create a new function reference `fn1 !== fn2` on each render?*).
  - **Never invent fake "common bugs" out of theoretical edge cases.** If a point is an interview-only nuance (like `<ArticleCard />` vs `{ArticleCard()}`), address it concisely in the interview section rather than making it the main drama of the coding narrative.

---

## 3. Every Division Must Be a Division of Pertinence (No Dropped-Bomb Taxonomies or Name-Drops)
- **User Directive**:
  > *"(1) DOM Helper Functions (Plain JS) ... (2) Components (React) ... This is dropped like a bomb, no explanation, why? Why on earth we talk about DOM helper functions? What are those? You just name dropped this? Are there other places you do this? When you divide things make sure you explain the mental model of the reader of WHY the division is pertinent to his daily practice or interview? EVERY division is a division of pertinence. Example: birds fly and animals walk. OK, why? Well if you are a hunter then birds fly means you need to avoid them, or animals walk to stalk them. Without clear pertinence, division makes no sense."*
- **What Went Wrong**:
  - Dropping a `[!WAYS]` box contrasting `(1) DOM Helper Functions (createCard())` vs `(2) Components (<ArticleCard />)` out of nowhere. "DOM helper functions" was never introduced, and no React developer sits at their keyboard choosing between `createCard()` and `<ArticleCard />`.
  - Dropping other terms without preparation or pertinence: mentioning `main.jsx` (taught in Lecture 7), `<StrictMode>` (taught in Lecture 14), `state` (taught in Lecture 12), `ESLint`, and `_jsx()` without first grounding them in what the reader already knows.
- **Candidate Skill Rule (The Law of Pertinent Division & Zero Dropped Bombs)**:
  - **Every division is a division of pertinence ("The Hunter's Rule")**: Never divide a topic into categories (e.g., `(1) X vs. (2) Y`) just to fill a diagram or a `[!WAYS]` box. Before you divide two things, state **who the reader is in this situation** (debugging a blank page, writing a component in JSX, or answering an interviewer) and **what different action or consequence follows from each side of the division**:
    - *Proper Example (Lecture 10)*: Hiding an element (`hidden`) vs. leaving it out (`&&`). Pertinence: Hidden JSX still runs (`{user.name}` crashes when `user` is `null`), whereas left-out JSX never runs; hiding preserves typed input text, whereas leaving it out destroys the DOM node.
    - *Proper Example (Lecture 3/4)*: A **built-in HTML tag** (`<article>`, `<footer>`, small first letter) vs. **our React component tag** (`<ArticleCard />`, `<Footer />`, capital first letter). Pertinence: Both use `< >` inside the same JSX block, so the first letter is how React decides whether to create a plain browser HTML element or call our JavaScript function.
    - *Counter-Example*: `(1) DOM Helper Functions (createCard()) vs (2) React Components (<ArticleCard />)` — dropped out of thin air with zero relevance to what the reader is writing or debugging.
  - **No Name-Dropping ("No Dropped Bombs")**: Never mention a tool, file, or future concept (`DOM helper functions`, `main.jsx`, `StrictMode`, `state`, `ESLint`, `_jsx`) as if the reader already knows why it is there. If a term is not needed for this lesson's core bug or interview answer, cut it. If it connects to an earlier lesson, remind the reader in one plain sentence what it is before using it.

---

## 4. Harmonized "River" Architecture (Teaching Each Principle Once Without Triple Repetition)
- **User Directives (from earlier in the session)**:
  - Harmonize the chapter into a single flowing narrative around the **numbered Principles (Principle 1..4)** instead of repeating the same material three times across a disconnected Runway, Q1..Q4, and Step 1..4 Practical Example.
  - Include **The Moral of the Story** and the **4-Principle Overview Table** near the beginning so the reader sees the whole map before diving into Section 1..4.
  - End each section with its **numbered Principle Card (`Principle 1..4`)** containing the 1-sentence italicized rule, the short mechanism summary, and the `DO THIS` / `DO NOT DO THIS` code blocks.
  - Keep **pure black (`#000000`) font color on pure white (`#ffffff`) background** in HTML previews for maximum reading clarity.
  - **Never generate PDFs, screenshots, or images unless explicitly asked.**

---

## 5. Visual Box-to-Boxes Diagrams for All Grouped & Compared Information (Vertical & Horizontal `tree` Boxes)
- **User Directive**:
  > *"In our previous 11-gemini examples and other -gemini or -argon examples we had a way to present diagrams in boxes. It was a good custom although unnecessary and repetitive. I'd like you to make a scan and find ALL possible information the reader learns in groups (not the principles themselves this time) and add a visual figure with box (extra to the text) for maximum visual clarity. Example, the text presents two types of this, two types of that, two different definitions, every element that is in comparison to another. example: camelCase vs PascalCase vs blabla_blabla (has a name??) -> Variable name conventions (box) → boxes with other name conventions. The box-to-boxes diagram can be vertical or horizontal, you adapt. Please use these horizontal and vertical boxes we used for maximum clarity all over the text."*
- **What Changed from Earlier `-gemini` / `-argon` Drafts**:
  - In earlier `-gemini` and `-argon` drafts, `tree` (box-to-boxes) diagrams were used repetitively to re-list the 4 principles at the top of every single section (`tree size=mini here="..."`).
  - Instead of repeating the principles tree, use **vertical (`tree` downward)** and **horizontal (`tree dir=right` left-to-right)** box-to-boxes diagrams **as an extra visual aid alongside the text** whenever the reader learns **information in groups or comparisons** (two types of something, two or three naming conventions like `camelCase` vs `PascalCase` vs `snake_case`, two different definitions, or side-by-side runtime outcomes).
- **Candidate Skill Rule (Box-to-Boxes Figures for Grouped & Contrasted Concepts)**:
  - **Do not use `tree` diagrams to repeat the 4-principle outline at the start of every section.**
  - **Do scan the chapter for every grouped or compared concept**—any place where the prose introduces 2–4 types, definitions, naming conventions, or contrasted behaviors—and **add a box-to-boxes diagram (`tree` vertical or `tree dir=right` horizontal) in addition to the prose**:
    - **Adapt vertical vs. horizontal to fit the comparison**:
      - Use **vertical box-to-boxes (`tree`)** when a root category splits into 2–3 peer types, definitions, or hierarchy branches side by side (e.g., *Ways to join words in a code name* $\rightarrow$ `camelCase` vs. `PascalCase` vs. `snake_case`; *Two kinds of tags in JSX* $\rightarrow$ Built-in HTML tags vs. React component tags; *Two ways to use a function* $\rightarrow$ Calling it with `()` vs. Handing the function reference without `()`; *Component hierarchy in `App.jsx`*).
      - Use **horizontal box-to-boxes (`tree dir=right`)** when a root action or rule branches into 2–3 specific cases and their runtime consequences (`->` outcome) on the right (e.g., *What the first letter of a JSX tag does* $\rightarrow$ `<articleCard />` vs. `<footer />` vs. `<ArticleCard />`; *Three ways to write `return` in a component* $\rightarrow$ one-line `return`, multi-line `return (`, and bare `return` with a line break; *Where `CommentBox` is defined* $\rightarrow$ Top level vs. Nested inside `ArticleCard`).
    - **Always keep the diagram extra to the text**: The prose still explains the group clearly in plain B2 sentences; the box-to-boxes figure sits right below (or beside) the explanation so a tired reader can see the whole group and contrast at a single glance.

---

## 6. No Fake Suspense & No Absurd Incomplete/Negative Framing ("When You Do A and B, But Forget C, Then Oops!")
- **User Directive**:
  > *"When you write your first component, two questions come up right away: 1. In coding: You write function ArticleCard() at the top of App.jsx, save the file, and look at the browser. The card is not there, and the Console shows no error at all. Why didn't your function run? 2. In an interview: The interviewer asks, 'What is a React component, who calls it, and what does the word rendering actually mean?' If you only say 'A component is a function that returns HTML,' you have missed the most important half of the answer. — New broken principle we need to consider: This is a negative principle where it becomes absurd to read. It is like saying 1 + 1 is not 2, and implying we forgot to mention '=' as in 1 + 1 = 2. It may be interesting for the junior, but confusing to the senior who reads it. The second bullet breaks every rule of talking in clear way with clear (and often short) sentences. The common pedagogical error is to keep some form of suspense from the reader, something he will understand later on. NOOOO! Always be clear. When you do A and B but forget to add C, then oops... you have a problem. When you write one function inside another, but you forget to invoke the component, you see nothing. (why?) This is because the function of the component itself from the declaration of the component are two separate steps. See how I write it here? Consider these principles (add them in the brief) and reread the whole chapter all over to find such gaps."*
- **What Went Wrong**:
  - Framing a section opener as a mysterious riddle that hides the missing step: *"You write `function ArticleCard()` at the top of `App.jsx`, save the file, and the card is not there. Why didn't your function run?"* To a senior developer, this reads like saying *"1 + 1 is not 2"* while hiding the fact that you forgot to write `=`.
  - Writing a long, convoluted second bullet thatwithholds the actual answer ("you have missed the most important half of the answer") instead of stating both halves in short, clear sentences right away.
- **Candidate Skill Rule (Zero Suspense: State Complete Cause-and-Effect Upfront)**:
  - **Never keep suspense from the reader.** Do not pose a fake mystery (*"You write X, save, and nothing happens! Why?"*) that withholds the missing step until three paragraphs later.
  - **Use the explicit *"When you do A and B, but forget to add C, you get a problem—because X and Y are two separate steps"* pattern**:
    - *Proper Example*: *"Putting a component on the screen takes **two separate steps**: (1) **declaring** the component function (`function ArticleCard()`), and (2) **invoking** it as a tag (`<ArticleCard />`) inside `App`. When you write `function ArticleCard()` and `function App()`, **but you forget to invoke `<ArticleCard />` inside `App`**, you see nothing on the screen. Why? Because declaring a component function and invoking that component are two separate steps."*
    - *Counter-Example*: *"You write `function ArticleCard()` at the top of `App.jsx`, save the file, and look at the browser. The card is not there. Why didn't your function run?"* (Hides the missing step to create artificial suspense.)

---

## 7. Zero Worthless Descriptive Sentences (Lead Every Paragraph with the Point / Surprise)
- **User Directive**:
  > *"Another example: 'On the last line, addEventListener receives sayHello without parentheses. Our code does not call sayHello() there. We hand the function itself (a function reference) to the browser, and the browser calls it later whenever the user clicks.' This sentence says NOTHING. It is an empty descriptive sentence. It is worthless. The text is filled with worthless sentences? Avoid worthless sentences, which means state the worth of each sentence, the value of its idea. Example of the previous (rewrite): '**Where did the parenthesis go?** Notice the previous example how the addEventListener works. Do you notice something strange here? It invokes `sayHello` and not `sayHello()`, it does not have the parenthesis. We hand the function itself (a function reference) to the browser, and then the browser calls it later whenever the user clicks. **React works the same way!** When we put two cards on the page, we do not call ArticleCard() with parentheses. Instead, we write `<ArticleCard />` twice inside App. It's similar to what we saw with the addEventListener in vanilla javascript.'"*
- **What Went Wrong**:
  - Writing flat, mechanical play-by-play narration of code lines (*"On the last line, `addEventListener` receives `sayHello` without parentheses..."*, *"When you save this file, the page shows only Latest Articles..."*) without telling the reader **what to notice** or **why the sentence matters**.
- **Candidate Skill Rule (State the Worth of the Idea First)**:
  - **Never write flat line-by-line code narration** (*"On the last line, X receives Y"*).
  - **Open every explanation paragraph with a bold, high-value hook or question that points straight at the surprise or takeaway** (*"**Where did the parentheses go?**"*, *"**React works the same way!**"*, *"**Why is the Console completely silent here?**"*, *"**Why did our typed text disappear on update?**"*). Every sentence must justify its existence by pointing out something the reader needs to notice.

---

## 8. Let the Diagram Do the Heavy Lifting (Prune Redundant Technical Prose)
- **User Directive**:
  > *"Then you can remove this: 'Each `<ArticleCard />` tag hands your ArticleCard function to React. While React runs App, it sees the two `<ArticleCard />` tags and calls ArticleCard once for each tag.' since it is already in the diagram, and it is too technical, the diagram shows it better."*
- **What Went Wrong**:
  - Keeping a dry, technical paragraph right above or below a box-to-boxes diagram that already shows the exact same step-by-step mapping more clearly.
- **Candidate Skill Rule (Don't Repeat in Dry Prose What the Box Diagram Shows Better)**:
  - When a box-to-boxes diagram already shows a mechanical mapping (such as `First <ArticleCard /> tag -> React calls ArticleCard() (1st time)` and `Second <ArticleCard /> tag -> React calls ArticleCard() (2nd time)`), **delete the dry technical sentences that merely repeat the diagram**. Keep the prose focused on the human takeaway (e.g., *"In React, when React calls your component function to ask what markup it returns, that call is called **rendering**."*).

---

## 9. Make Box-to-Boxes Comparison Diagrams Explicitly Prescriptive (`✗` vs. `✓`)
- **User Directive**:
  > *"Wait this diagram: 'Two ways to use a function: Call it yourself right now (with parentheses ()) ... vs Hand the function reference over (no parentheses) ...' It should not have a X on the left side and tick on the right? Make these diagrams prescriptive clearly — e.g. we do not do this that we can do in javascript blabla vs we do this in jsx."*
- **What Went Wrong**:
  - Leaving the left/wrong branch of a comparison box-to-boxes diagram neutral (no `✗` / `!` marker) instead of clearly telling the reader *"✗ We do NOT do this in JSX"* vs. *"✓ We DO this in JSX"*.
- **Candidate Skill Rule (Prescriptive `✗` vs. `✓` on Every Comparison Box-to-Boxes Diagram)**:
  - Whenever a box-to-boxes diagram contrasts two or three ways/conventions/places in the context of React, **make every branch explicitly prescriptive with `✗` (`!`) and `✓` (`+`)** and state clearly in the box label or note **what we do NOT do in React/JSX vs. what we DO in React/JSX**:
    - Example: `✗ Do NOT call the component yourself with () ({ArticleCard()})` vs. `✓ DO hand the component to React as a tag (<ArticleCard />)`.
    - Example: `✗ camelCase (articleCard) — Do NOT use for React components` / `✗ snake_case (article_card) — Do NOT use for React components` vs. `✓ PascalCase (ArticleCard) — DO use for all React components`.

---

## 10. Never Hand-Craft HTML; Use the Standard Lesson Code Editor (Zebra Rows + Balloon Comments) & Stacked Full-Width Principle Snippets
- **User Directives**:
  1. **Never edit `.html` by hand**: Always compile HTML from Markdown via script (`node notes/build-experiment-04-river.mjs`, ~20ms). Hand-crafting HTML wastes minutes of turnaround time and drifts from the Markdown source.
  2. **Remove dense numbered preview lists before the opening section**: Do not drop a 3-item numbered summary right under the `> INTERVIEW QUESTION` banner before the reader has even entered the first section—it is confusing and overwhelms a reader with a headache.
  3. **Direct Principle Headings**:
     - Use **`### Four Principles of [Topic]`** instead of meta-headings like `### Four Questions That Matter in Daily Coding and Interviews`.
     - Label the summary callout box **`PRINCIPLES`** instead of `The Moral of the Story`.
  4. **Standard Lesson Code Theme (`revised-4/editor.mjs`) with Balloon Comments**:
     - Render all code blocks using the exact light code editor from normal lessons (`src/revised-4/editor.mjs` + `src/revised-4/base.css`): alternating white (`#ffffff`) and light grey (`#f4f4f4`) zebra rows (`.row.odd`, `.row.even`), line numbers (`.num`), file tab bar (`.bar`, `.tab`), and syntax token colors (`#93275a` keywords/numbers, `#156a64` functions, `#1a7d2e` strings, `#c2410c` hooks).
     - Mark commented target tokens with `~token~` in the Markdown source so `editorBlock()` renders **speech-bubble balloon comments** (`.bubble`) directly underneath the highlighted `.target-token`, with `✓ RIGHT` / `✗ WRONG` chips where appropriate.
     - **Never style balloon comments (`.bubble`) in italics; use `15px` upright sans-serif**: Italics inside code blocks are hard to read, `13.5px` feels too small, and `17px` is too large. Keep the original `.bubble` box styling (`border: 1px solid #d0d0d0`, padding, shadow) untouched and set `font: normal 15px/1.45 var(--font-sans)`.
  5. **Stacked Full-Width `✓ DO THIS` / `✗ DO NOT DO THIS` in Principle Cards**:
     - Inside every Principle box, stack `✓ DO THIS` (`ed-right` with green left indicator bar and checkmark icon) and `✗ DO NOT DO THIS` (`ed-wrong` with red left indicator bar and cross icon) **full-width one under the other** (`flex-direction: column`), never cramped side-by-side in two narrow columns.

---

## 11. Flow Like Water: Keep Our Exceptional Principle Boxes, Yellow `PRINCIPLES` Box, and Explanations, Written in Calm, Code-Free B2 Prose
- **User Directives**:
  1. *"Notice for example how it starts, how it is easy to flow, how it does not drops component names like the `<blabla/>` and the `<blibli/>` of the functin `myblabla.()` blabla... The original version flows like a water. Small sentences, clear B2 vocabulary, direct to the point. Multiple and easy to read titles, maximum clarity. Your text is convoluted and repetitive, adds unecesssary complexity, drops names of functions and components in the text all the time, making it a struggle to read."*
  2. *"wait, you used all the information from the old text of the normal lesson? I was hoping you would use your own text for principles (it was better), you just copied the old ?? there are parts of the old text that still make no sense, and I was hoping you could make them even better, by using the STYLE of the old text, not by totally replacing it!!! and as for the principles, the yellow box of your own previous creation, and the boxes of principles you had created are exceptional"*
- **What Went Wrong**:
  - First, stuffing 4–6 inline code tokens (`function ArticleCard()`, `<ArticleCard />`, `<article>`, `_jsx('articleCard', {})`, `OldFn === NewFn`) into almost every narrative sentence instead of speaking in plain English nouns (*"the card"*, *"the function"*, *"the tag"*, *"the footer"*, *"the comment box"*).
  - Second, over-correcting by copying the old normal lecture's content verbatim—which threw away our superior Principle explanations, our yellow `PRINCIPLES` box, and our 4 `[!PRINCIPLE]` cards, and reintroduced parts of the old text that made no sense.
- **Candidate Skill Rule (Synthesize Superior Principle Explanations & Boxes with Water-Like B2 Narrative Prose)**:
  1. **Keep the Exceptional Yellow `PRINCIPLES` Box, the 4-Principle Overview Table, the 20 Box-to-Boxes Diagrams, and the 4 `[!PRINCIPLE]` Cards**: Our structured yellow `PRINCIPLES` box (with the 4 numbered items explaining *why* each principle matters in daily debugging and interviews), our 4-Principle Overview Table, and our 4 `[!PRINCIPLE]` cards (`Principle 1` .. `Principle 4` with stacked `DO THIS` / `DO NOT DO THIS` editors) are the backbone of the lesson—never replace them with old lecture text.
  2. **Fix Any Gaps in the Old Lecture Content**: Always use our clearer, complete pedagogical explanations (for example: *why* we split a 20-card page into a reusable component; why `<footer />` with a small `f` is the quietest version of the capitalization bug because `<footer>` is a real HTML tag and logs zero Console warnings; why defining `CommentBox` inside `ArticleCard` creates a brand-new function on every update and wipes out `"See you there"` and cursor focus).
  3. **Write the Narrative Prose in the Water-Like B2 Style (Speak in Human Nouns, Not Inline Code Litter)**: Once a short code block shows `ArticleCard`, `Footer`, or `CommentBox`, refer to them in the narrative paragraphs as *"the card"*, *"the footer"*, *"the comment box"*, *"the function"*, or *"the tag"*. Do not drop `<blabla />` and `function myBlabla()` four times in a single sentence.
  4. **Use Multiple Short, Declarative Sentence Titles (`###`) and Split Code into 4–8 Line Pieces (`startLine`)**: Guide the reader from one small step to the next with calm, clear sentence headings (*"A page is made of pieces, and each piece is a function"*, *"Writing the function and using its tag are two separate steps"*, *"The quietest version of this bug: a name that matches a real HTML tag"*, *"A component defined inside another component wipes out what the user typed"*) and split code blocks (`startLine="1"`, then `startLine="11"`) separated by a single guiding sentence.

---

## 12. Two Permanent Visual Rules for Boxes and Box-to-Boxes Diagrams: New-Line Key Message with `[svg important]`, Parenthesis-Free Code Chips, and `15px` Multi-Line `[svg]` Points
- **User Directives**:
  1. **First permanent change (Key message on a new line with distinct `DO`, `DO NOT`, and `IMPORTANT` SVG icons and colors)**:
     - Instead of cramming `Built-in HTML tags (<main>, <article>, <footer>) — start with a small letter` onto one line, place the key message on a **new line** (`.t-key`):
       - **Positive / `DO` key message (`.t-key-good`, prefix `| +...`)**: Green background (`#dcfce7`), green border (`#16a34a`), and a green **circle-checkmark SVG icon** (`GOOD_KEY_SVG`, `#15803d`), e.g. `✓ DO use for every React component`.
       - **Negative / `DO NOT` key message (`.t-key-bad`, prefix `| ~...` or inside a `✗` `.t-bad` box)**: Red background (`#fee2e2`), red border (`#dc2626`), and a red **circle-cross SVG icon** (`BAD_KEY_SVG`, `#b91c1c`), e.g. `✗ Do NOT use for React components`. Never give `DO` and `DO NOT` key messages the same yellow appearance!
       - **Neutral important fact (`.t-key-info`, prefix `| !...`)**: Amber background (`#fef9c3`), amber border (`#eab308`), and an amber **circle-`!` SVG icon** (`IMPORTANT_SVG`), e.g. `! They start with a small letter`.
     - Also set `white-space: nowrap` on `.tree code` so inline JSX tags like `<ArticleCard />` and `<articleCard />` never break across two lines (`<ArticleCard` / `/>`).
  2. **Second permanent change (Zero parentheses `(` or `)` in titles, Principle boxes, yellow `PRINCIPLES` boxes, tables, diagrams, captions, and prose + `15px` multi-line `[svg]` rules with bold keywords and descriptive phrasing)**:
     - **Avoid ALL parentheses `(` and `)` everywhere outside of fenced code blocks**: Never use parentheses in `##` / `###` titles, `[!PRINCIPLE]` boxes (headers, italic rules, or explanations), the yellow `PRINCIPLES` box, tables, box-to-boxes (`tree`) headers/chips/notes/captions, or narrative prose. Why? Because JavaScript/JSX code already contains parentheses (`function ArticleCard()`, `{ArticleCard()}`, `return (`), so wrapping code or explanations in outer parentheses creates visual absurdities like `always open the parenthesis on the same line as return (return ()`!
     - Use CSS chip groups (`[...]`, rendered as `.t-chips` / `.t-chip-group`) in diagram headers, and use words like *"such as"*, *"for example"*, or em-dashes in prose, tables, and Principle boxes—with **zero** `(` or `)` characters outside fenced code blocks.
     - **Never render the rules/facts inside a box as a tiny `13px` single line joined by ` · `** (`Start with a small letter · Known to the browser · Created directly in the browser DOM`), which is practically invisible. Render each rule/fact on **its own line** (`15px`, `.t-point`) with a leading **`[svg]` icon** (`POINT_SVG`), **bold keywords (`**...**`)**, and **descriptive phrasing** (*"They start with a **small letter**"*, *"They are **known** to the browser"*, *"Created **directly** in the browser DOM"*) rather than ambiguous imperative fragments (*"Start with a small letter"*).

---

## 13. Low-Attention-Span Anchoring, Avoiding Code Elements in Prose, and Explaining the Concept Before Asking "What If"
- **User Directives**:
  1. **Low-attention-span anchoring (restate the cause right inside the consequence sentence)**:
     - Instead of: *"Even though both names match, the function never runs! When you save the file:"*
     - Write: *"When you **forget to start with a capital letter**, even though both names may look similar, the function never runs! When you save the file:"*
     - Why: A reader with a low attention span or fatigue should never have to scroll back up to the code block to remember what mistake caused the outcome. Restate the cause in bold right at the start of the sentence (**"When you forget to start with a capital letter..."**, **"When you only write the function and forget to place its tag..."**, **"When you put a line break right after `return` without opening a parenthesis..."**, **"When you define one component inside another component..."**).
  2. **Avoid code elements, log strings, and error text inside the prose**:
     - Instead of: *"In the Console panel: `"articleCard runs"` never prints, and React prints two red warnings saying the tag uses incorrect casing and is unrecognized in this browser."*
     - Write: *"In the Console panel: The component never prints, and React prints two red warnings."*
     - Why: Dropping log strings (`"articleCard runs"`, `"See you there"`), HTML tags (`<main>`, `<input>`), and long error strings (`ReferenceError: ArticleCard is not defined`) into the paragraph text makes it noisy and tiring. Let the code blocks and box diagrams carry the exact code literals, and keep the prose simple, clear, and elegant.
  3. **Explain the concept directly instead of pointing to irrelevant locations (`in App`, `at the top`)**:
     - Instead of: *"What if you capitalize the tag in `App`, but leave a small letter on the function at the top? Then the two names no longer match, and the whole page fails with `ReferenceError: ArticleCard is not defined`. You must start both the function and the tag with a capital letter:"*
     - Write: *"**We need to capitalize the name in two places.** This is an important detail: we write the name of the component in the definition of the function, such as `function ArticleCard`, and we also write the same name in a second place, in the name of the tag we use, such as `<ArticleCard />`. Both need to start with a capital letter. What if we capitalize one and not the other? Then the two names no longer match, and the whole page fails with an error. You must start **both** the function and the tag with a capital letter:"*
  4. **Use everyday, specific language in titles (no literary idioms like "The quietest version" or vague nouns like "a name")**:
     - Instead of: `### The quietest version of this bug: a name that matches a real HTML tag`
     - Write: `### The bug that is even trickier: a component name that resembles a real HTML tag`
     - Why: Nobody says *"the quietest version"* in everyday speech, and *"a name"* is too vague—always name the exact thing (*"a component name"*, *"a component function"*, *"a component tag"*).

---

## 14. Sentence Syntax Law: One Idea Per Sentence, Chronological Order of Thoughts, Zero Multi-Clause Packing, and Zero Compound Noun Stacks
- **User Directive**:
  > *"Suppose we add a comment box under each article card. Because the comment box is used only inside the card, a developer might be tempted to write the comment box function inside the card function, the way plain JavaScript sometimes puts a small helper inside another function. Do you see why this paragraph fail the style of writing we suggested to use? My question is why it fails. Why after discussing so much how to mimic the original text in short sentences, B2 clear structure and vocabulary, you leave back convoluted complexity. Why we cannot fix this? what can we do to fix this?"*
- **What Went Wrong**:
  - **Multi-clause compression bias**: Packing three separate thoughts—a reason (`Because the comment box is used only inside the card,`), a hedged action (`a developer might be tempted to write the comment box function inside the card function,`), and a background analogy (`the way plain JavaScript sometimes puts a small helper inside another function.`)—into a single 37-word, 3-clause sentence.
  - **Checking vocabulary while ignoring syntax**: Every individual word (*comment, box, card, developer, write, function, helper*) is a simple B2 word, which masked the fact that the *sentence structure* was a 3-clause maze.
  - **Backwards idea order**: Tacking the prerequisite JavaScript habit (`", the way plain JavaScript..."`) onto the very end of the sentence as an afterthought instead of stating it in chronological order before the React mistake.
  - **Compound noun stacking**: Writing *"the comment box function inside the card function"* instead of *"the comment box inside the card"*.
- **Candidate Skill Rule (Mechanical Sentence-Structure Standard & Build-Time Audit)**:
  1. **One Sentence = One Idea (Hard Cap of ~18–20 Words, Maximum 1 Subordinate Clause)**:
     - Never merge a **reason** (`Because X,`), an **action** (`Y does Z,`), and an **analogy/consequence** (`the way W...` / `which causes V...`) into a single sentence. Give each thought its own sentence and its own period.
  2. **Strict Chronological Order of Thoughts (1. What the page needs $\rightarrow$ 2. Where it is used $\rightarrow$ 3. The familiar JS habit $\rightarrow$ 4. The React mistake)**:
     - Never front-load a passive `Because...` clause or tack `, the way...` onto the tail of a sentence. State the steps in the exact order the human brain pictures them:
       - *Counter-Example (37-word multi-clause knot)*: *"Suppose we add a comment box under each article card. Because the comment box is used only inside the card, a developer might be tempted to write the comment box function inside the card function, the way plain JavaScript sometimes puts a small helper inside another function."*
       - *Proper Example (4 short, chronological B2 sentences, 9–16 words each)*: *"Now we want to add a comment box under each article card. Only the card uses this comment box. In plain JavaScript, you sometimes put a small helper function inside the function that uses it. So you might try to write the comment box inside the card."*
  3. **No Compound Noun Stacks (*"the [X] function inside the [Y] function"*)**:
     - Never stack three nouns together (*"the comment box function"*, *"the card function"*, *"the article card component tag"*). Once the reader knows each piece is a component, use the simple human noun (*"the comment box"*, *"the card"*) or a clear `for`/`of` phrase (*"the function for the comment box"*).
  4. **Automated Build-Time Prose Linter**:
     - Enforce a sentence-length and clause-pattern check in the build script (`build-experiment-04-river.mjs`) that flags any prose sentence over 22 words or containing multi-clause glue patterns (`, the way `, `, which means `, `, whereas `, `Because ..., ...,`), so convoluted sentences are caught automatically at build time.

---

## 16. Chat Interaction Rule: Never Use the Technical Questionnaire Tool (`AskUser`)
- **User Directive**:
  > *"NEVER I repeat NEVER ask me options in technical way through the chat here. Always ask me explicitly through stoping the chat and waiting for my response. Add this in the general rules in the project."*
- **Rule**:
  - Never invoke `AskUser` or any technical questionnaire UI widget. Whenever asking the user a question or presenting options, write the question and options clearly in normal chat text, end the message, and wait for the user's reply.

---

## 17. Preserve the Comprehensive General Concepts Introduction (Runway) Before the Questions and Principles
- **User Directive**:
  > *"Keep in mind (please add it in the rules) that if you study the existing skills (for the normal lecture, with prelecture) it makes sure it has a clear structure with questions and principles, and then adds in the beginning clear and comprehensive introduction to general concepts that are necessary for the reader. We need to keep this comprehensiveness."*
- **Candidate Skill Rule (Two-Zone Lecture Architecture: Comprehensive General Concepts Runway First, Root-Grounded Principles Second)**:
  1. **Every lecture must begin with a comprehensive General Concepts Introduction (The Runway) before Principle 1** (governed by `lecture-structure/SKILL.md` Section 12):
     - Open with the general theme/problem every developer meets (and if developers genuinely choose between two valid ways to solve it, show both fairly and summarize them in a `> [!WAYS]` box).
     - Briefly recall the earlier lectures this chapter stands on.
     - Dedicate 1 to 3 `###` Runway sections to teaching every new general concept and syntax primitive the chapter needs—**one idea at a time**, starting from familiar HTML/JavaScript, stating what it is for, naming the exact technical term, showing the shortest working code example (3–5 lines), and explaining who does what (the browser, React, or our code).
     - **Why this is mandatory**: No Principle or Question may teach a foundational general concept from zero while simultaneously explaining a bug or rule. When the Runway teaches the general concepts thoroughly at the start, every Principle can focus 100% on its Root Distinction, Question, and Rule.
  2. **See Companion Brief**: [05-principle-map-and-pipeline-consultation-brief.md](./05-principle-map-and-pipeline-consultation-brief.md) for the full consultation on upgrading `01-01-map-principles/{nn}.md` to include the `## General Concepts Introduction (Runway Plan)` and the 4 Principle upgrades so `pre-lecture` is no longer needed.


- **User Directive**:
  > *"Writing the component function and using its tag are two separate steps — This title was a product of philosophical pedagogy where we start our pedagogical explanation from the root, and the root typically stems down to some fundamental nuances that appear the same to the junior developer, but the senior developer understands the grounding. Do we have in the rules this concept crystalized with examples?"*
- **Where It Partially Existed Before vs. What Was Missing**:
  - In `skills/v9.1/summary-edition/SKILL.md`, this idea was only partially recorded inside two narrow box rules for Lecture 11:
    - Section 07C (`[!AHA]` box): *"Does step 1 state the most elementary fact the cause rests on, a fact the reader already holds but has never tied to this case (two lists with two separate orders; a variable React watches against one it does not)?"*
    - Section 12 (`[!PRINCIPLE]` box): *"When the principle rests on two things that look alike but are separate (such as an array of items in JavaScript memory and the list of DOM elements on the screen), does `Why it happens:` open with that root separation?"*
  - **What was missing**: It was **not** crystallized as a general law of **Philosophical Pedagogy** governing **section titles (`###`), opening paragraphs, and the core structure of every principle across all lectures**—specifically the law that **almost every React bug and interview trap happens because two fundamentally distinct steps, layers, or identities appear to be one single thing to a junior developer, whereas the senior developer knows how they are separate**.
- **Candidate Skill Rule (The Law of Philosophical Pedagogy: Start from the Root Distinction Between What Looks the Same to the Junior and What Is Separate for the Senior)**:
  1. **Find the Root Distinction Before Writing the Title (`###`) or Opening Paragraph**:
     - Before explaining any bug, rule, or interview question, ask: **"Which two things look like one single thing to a junior developer here, even though they are two separate things in JavaScript, React, or the browser?"**
     - Make that root distinction the **declarative `###` title** and the **very first sentence** of the explanation. Never start in the middle of the symptoms or mechanics; start at the root distinction, because once the reader sees that the two things are separate, the bug, the fix, and the senior interview answer become obvious by themselves.
  2. **Living Examples Across Lectures (PROPER vs. COUNTER-EXAMPLE Pairs)**:
     - **Example 1 — Declaring vs. Rendering a Component (Lecture 4, Principle 1)**:
       - *What appears the same to the junior*: "I wrote `function ArticleCard()` in my file, so the card should be on the screen." (Writing the component and showing it on the screen feel like one step.)
       - *The senior's root grounding*: **Writing the component function** (saving the function in memory) and **using its `<Tag />`** (telling React to call that function) are **two separate steps**.
       - **PROPER EXAMPLE (Root-First Title & Opening)**:
         > `### Writing the component function and using its tag are two separate steps`
         > `Putting a component on the screen takes **two separate steps**: first you declare the function, and then you use its tag inside App.`
       - **COUNTER-EXAMPLE (Starts in the Middle with a Symptom Riddle)**:
         > `### Why doesn't ArticleCard show up when we save App.jsx?`
         > `You write function ArticleCard() in App.jsx, save the file, and look at the browser. Nothing appears on the screen. Why didn't your function run?`
     - **Example 2 — Calling a Function Yourself vs. Handing a Function Reference to React (Lecture 4, Principle 1)**:
       - *What appears the same to the junior*: `sayHello()` and `sayHello` (or `{ArticleCard()}` and `<ArticleCard />`) both look like "using the function."
       - *The senior's root grounding*: **Calling a function yourself right now** (with parentheses) and **handing the function itself to someone else to call later** (a function reference, or a JSX `<Tag />`) are **two separate actions**.
       - **PROPER EXAMPLE (Root-First Title & Opening)**:
         > `### A function runs when you call it, or when you hand it to someone else`
         > `With parentheses, our code calls the function right now. Without parentheses, we hand the function itself to the browser. Passing a function without calling it is called a **function reference**, and the browser calls it later whenever the user clicks. **React works the same way!**`
       - **COUNTER-EXAMPLE (Starts with Mechanical Code Narration)**:
         > `### Passing sayHello to addEventListener`
         > `On the last line, addEventListener receives sayHello without parentheses. In React, we write <ArticleCard /> twice inside App.`
     - **Example 3 — Style Convention for Humans vs. Compiler Rule for JSX (Lecture 4, Principle 2)**:
       - *What appears the same to the junior*: `camelCase` (`articleCard`) and `PascalCase` (`ArticleCard`) look like a harmless style preference, just like naming variables in plain JavaScript.
       - *The senior's root grounding*: In plain JavaScript, capitalization is **only a style habit for human readers**. In React JSX, the first letter of a tag is **a strict compiler rule** that separates built-in HTML tags (small letter) from your component functions (capital letter).
       - **PROPER EXAMPLE (Root-First Title & Opening)**:
         > `### In React, a capital first letter is a compiler rule, not a style habit`
         > `In plain JavaScript, choosing myName or MyName is only a matter of style for human readers; JavaScript runs both the same way. In React JSX, however, **the first letter of a tag is a strict compiler rule**.`
       - **COUNTER-EXAMPLE (Surface Rule Without the Root Distinction)**:
         > `### Always use PascalCase for components`
         > `In React, you must always name your components using PascalCase so that React can render them properly.`
     - **Example 4 — Identical Code in the Editor vs. Same Function in Memory (Lecture 4, Principle 4)**:
       - *What appears the same to the junior*: A `CommentBox` function written inside `ArticleCard` has the exact same name and code on every render, so it looks like "the same component."
       - *The senior's root grounding*: **Having the same code in your file** and **being the same function in memory (`OldFn === NewFn`)** are **two separate things**. A top-level function is created once when the file loads; a nested function is created brand-new in memory every time the outer function runs.
       - **PROPER EXAMPLE (Root-First Title & Opening)**:
         > `### A function inside another function is made again on every call`
         > `To see why the comment box was wiped out, look at how JavaScript handles functions in two different places: a function at the **top level** of a file is created **once**, when the file loads. A function **nested inside another function** is created **brand-new in memory each time the outer function runs**.`
       - **COUNTER-EXAMPLE (Jumps Straight to React Jargon)**:
         > `### Why nested components unmount on re-render`
         > `During reconciliation, React compares the fiber type reference at each tree position and unmounts the subtree when the reference changes.`
     - **Example 5 — Array of Objects in Memory vs. DOM Elements on the Screen (Lecture 11, Principle 3)**:
       - *What appears the same to the junior*: The list of emails on the screen feels like it *is* the `emails` array in JavaScript.
       - *The senior's root grounding*: **The array of objects in JavaScript memory** and **the list of DOM elements on the screen** are **two separate lists** with separate orders, and `key` is the chain that links each DOM element to its object in memory.
       - **PROPER EXAMPLE (Root-First Opening)**:
         > `The array of items in our JavaScript code and the list of DOM elements on the screen are two separate lists. A key is the chain that links each DOM element on the screen to its specific object in memory.`
       - **COUNTER-EXAMPLE (Starts in the Middle of the Story)**:
         > `When a user ticks the checkbox on the first row and a new item arrives at index 0, React reuses the first row by position.`

---

## 18. Minimal, Video-Demo-Friendly, Visually Clear Examples & Embedded UI Browser Previews (`-gemini` Standard)
- **User Directive**:
  > *"we need for the River version to make sure to apply some changes that we have seen been applied in the 11-gemini and other -gemini versions, the examples need to be selected in way that are minimal in presenting this code problem, not hyper-complex mixing with other princpiles, but most importantly, they need to be picked so that the code examples can be seen visually very clear in UI element in a small browser in the screen, in order to be presented in demo in a video, we need clear and UI visual friendly and cognitive friendly examples. This is key. Examples from previous chapters can be used also to be extended in new reference (no need to reference always the previous chapters in detail, no more cognitive load, just use the same example IF and ONLY IF You think it can be adapted to new principle in new lesson.*
  > *Then, we need to show the UI browser in the book as well, to clearly show to the reader what is going on in the examples. With minimal yet clear UI browser that shows archetypical example of what is presented."*
- **Core Rules for the River Version (`v2`)**:
  1. **Minimal, Isolated, Video-Demo-Friendly Examples**:
     - Every code example must be **minimal** in presenting the exact code problem of that principle, without mixing in extra elements or unrelated principles.
     - Every code example must produce a **visually obvious UI result inside a small browser window** so it works in a live video demo and in a compact browser preview in the book:
       - *Proper Example (Lecture 1 — `Cart.jsx`)*: A shopping cart with **two lines** in Principles 1 and 2 (`<p>Items: {count}</p>` and `<button>Buy {count} items</button>`), adding the third line (`<input placeholder="Note to the shop" />` where the shopper typed `"Please ring the bell"`) **only in Principle 3** when demonstrating that React preserves typed text and focus while `innerHTML` wipes them out.
       - *Counter-Example (Old Lecture 1 — `SiteHeader.jsx`)*: A cluttered header with 5 separate places (`Welcome back, Mary`, `Signed in as Mary`, `<button>Mary</button>`, `Messages: 3`, `You have 3 new messages`) plus `<input placeholder="Search" />` already mixed into Principles 1 and 2 before Principle 3 even uses it.
  2. **Reuse/Extend Examples Only When Natural—And Without Back-Reference Cognitive Load**:
     - An example from an earlier chapter (such as `ArticleCard`, `Cart`, or `Mail`) may be reused or extended in a later chapter **if and only if** it naturally fits the new principle.
     - **Never burden the reader with heavy back-reference prose** (*"As we saw in Lecture 1 and Lecture 2, recall these three facts..."*). Introduce the example directly and self-contained in the lesson with zero cross-chapter cognitive load.
  3. **Embed Minimal UI Browser Previews Directly in the Book (`page`, `shop`, `mail`, `dom`, `devconsole`, `overlay`, and `::: row` / `::: col`)**:
     - Whenever a code snippet produces a page result, a visual bug, a DOM difference, a Console output, or a build error, show the **minimal UI browser preview** right in the book alongside or below the code using `src/build-river.mjs` blocks (` ```page `, ` ```shop `, ` ```mail `, ` ```dom `, ` ```devconsole `, ` ```overlay `, and side-by-side `::: row` / `::: col` columns).
     - Highlight the exact UI element that changed or broke (`good` in green vs. `bad` in red) so the reader sees the visual outcome in one glance.


