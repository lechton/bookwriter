---
name: principled-theory
description: Governs the authoring of independent, complete, principle-based theory sections, the explanation under each principle box, and zero-new-concept case studies across React lectures.
---

# Principled Theory

This skill governs the one-to-one expansion of an approved principle map into curriculum analysis: an independent, complete theory section before the practical example, zero new concepts across case studies and terminal sections, and the explanation under each principle box, with the code that proves it. #2026_09_26_19_group_1 revised by #2026_10_06_04_group_3

Digests: `skills/v6.5/principle-definition/SKILL.md` governs the box itself (title, definition, side notes, code pair), and its casebook `skills/v6.5/principle-definition/examples.md` shows good and failing boxes and paragraphs with their analyses (Case 12 is the paragraph under the box). `skills/v6.5/lecture-structure/SKILL.md` governs the lecture's sections and their order. #2026_10_04_09_group_1 revised by #2026_10_06_04_group_3

Notes: The approved principle map supplies every real principle number; exemplars here write `Principle N`. The published lectures 01 to 13 are not drafting models: their boxes and paragraphs appear in the casebook as failing cases where they teach something. #2026_09_26_21_group_3 revised by #2026_10_06_04_group_3

## Architectural Philosophy | 01 | Theory-First Foundation and Autonomous Principles #2026_09_25_03_group_1

- [ ] Before writing or reviewing principles, did the author read the casebook (`principle-definition/examples.md`) and take its moves (follow the reader's question, say what the reader would see), not its wording? #2026_10_06_04_group_3
- [ ] Does the lecture provide a complete theoretical introduction section (`### ...`, such as *What is a React Component?* or *The Three Trees Model*) before introducing the principles section, thoroughly unpacking foundational platform concepts so principles never introduce unanchored abstractions?
- [ ] Is the principles section (`### Principles of React: {Topic}`) authored as an independent, self-contained distillation of platform laws structured with numbered `> [!PRINCIPLE]` callouts?
- [ ] Is every underlying compiler transformation, language grammar invariant, DOM interface requirement, and execution edge case fully unpacked and justified in the theory before the practical example begins?
- [ ] Can an interview candidate master the topic's mental model and pass technical examination purely from reading the theory and principles, without needing the practical example to clarify basic mechanics?
- [ ] Does the theory section avoid deferring foundational explanations to later sections (avoiding phrases like "we will see how this works in the practical example")?

- [ ] PROPER EXAMPLE: Complete autonomous theory leading into principles:

```markdown
### What is JSX and Why Does React Transform Markup?

In standard browser JavaScript, HTML markup strings do not exist as native language types. When you write tags in a script file, the JavaScript runtime cannot parse them directly. React introduces JSX as an XML-like syntax extension that compiles into standard JavaScript function calls. Before learning the governing principles of JSX, we must understand the compiler transformation: every tag `<div className="card" />` converts directly into a call to `_jsx('div', { className: 'card' })`.

### Principles of React: The Core Laws of JSX Grammar

To prepare for any technical interview, we formalize the governing rules enforced by the JSX compiler:

> [!PRINCIPLE]
> **Principle N: Produce a Single Root Element**
> We return exactly **one root element** or container from every component, ensuring the function resolves to a single JavaScript expression.
> 
> *We should do this:*
> `return (<div><img /><h2 /></div>); // Wrapping container resolves to a single JavaScript expression`
> 
> *We should not do this:*
> `return (<img /><h2 />); // Adjacent root elements cannot resolve to a single return value`

A React component is a standard JavaScript function. In JavaScript, a `return` statement can only return a single value or expression. When you write two adjacent tags at the root level, JavaScript cannot evaluate them as a single expression. Under the hood, JSX compiles into `_jsx(type, props)` function calls. Just as you cannot return two separate function calls without wrapping them in an array or container object, you cannot return adjacent JSX tags.
```

Notes: The example shows where theory sits relative to the principles, not how a box should read; the box wording follows principle-definition. #2026_10_06_04_group_3

- [ ] HALF WAY EXAMPLE: Partial approach to avoid: Deferring mechanical derivation to the case study:

```markdown
### JSX Rules
In React, there are several rules like single roots and closing tags. We'll introduce these briefly, and then explore them in depth through our newsroom case study.
```

Notes: Outlines rules at a high level but defers actual architectural derivation and compiler mechanics to the case study, leaving the theory incomplete.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Skipping principled theory entirely:

```markdown
### Introduction to JSX
JSX lets you write HTML in JavaScript. Let's start building our newsroom component right away to see how JSX works in practice!
```

Notes: Skips principled theory entirely and forces the reader to discover platform mechanics by trial and error inside application code.

## Scope & Invariant Isolation | 02 | Zero New Concepts in the Case Study #2026_09_24_02_group_1

- [ ] Does the practical example / case study (`### Let's Design a Practical Example`, Stages A through E) introduce zero new concepts, terms, properties, hooks, or syntax rules?
- [ ] Is the case study restricted to synthesizing, assembling, and exercising the principles and supporting explanations introduced in the theory section? #2026_09_26_21_group_2
- [ ] If a property (e.g. `aria-label`, `tabIndex`), helper function, or syntax pattern appears in a practical example component, was it explained in the preceding theory, either as an approved principle or as supporting explanation under one, so case-study syntax is grounded without adding principles the map does not contain? #2026_09_26_21_group_2
- [ ] Does Stage C avoid introducing ungrounded syntax during assembly steps?

- [ ] PROPER EXAMPLE: Case study strictly exercising taught principles:

In a JSX grammar lecture, the case study builds `NewsAlert.jsx`. Every feature in it (the outer container `<div>`, the self-closing `<img />` and `<input />`, `className` and `htmlFor`, `tabIndex={0}`, and `aria-label="Subscribe"`) was explained in the preceding theory, either as a principle or as supporting explanation under one. Zero ungrounded syntax is introduced in the component code. #2026_09_26_21_group_3

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Introducing unexplained syntax during practical assembly:

In the theory section, the author only explains single root elements and closing tags. Then in Step 3 of the practical example, the author suddenly writes `<input tabIndex={0} aria-label="Search" style={{ display: 'none' }} />` without having explained why `tabIndex` is camelCase, why `aria-label` retains hyphens, or why `style` takes double curly braces.

Notes: Forces the reader to confront novel, unexplained syntax during practical assembly, distracting from the guided build.

## Terminal Digests Fidelity | 03 | Zero New Concepts in Terminal Sections #2026_09_24_02_group_1

- [ ] Do downstream terminal sections (`### Where you will meet this`, `### Glossary`, `## Beyond the basics`, `### Summary`, comparative tables, and marginal notes) introduce zero new concepts, terms, or ungrounded classifications?
- [ ] Is `### Where you will meet this` used exclusively to ground already-introduced principles into concrete professional engineering contexts?
- [ ] Are `### Glossary` entries restricted strictly to terms explicitly introduced and bolded in the lecture body?
- [ ] Does `## Beyond the basics` point to official documentation links (`https://react.dev/...`) that deepen the exact principles taught in the chapter?
- [ ] Does `### Summary` distill the principles into crisp decision rules (`➔`) and right/wrong takeaways without introducing fresh syntax?

- [ ] PROPER EXAMPLE: Terminal sections grounding existing principles:

In a JSX grammar lecture's Glossary, every defined term (Abstract Syntax Tree, JSX Transform, React Fragment, Self-Closing Tag, DOM Property Alignment) was explicitly unpacked in the body of the lecture before it appeared in the Glossary. #2026_09_26_21_group_3

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Introducing orphan terms in downstream sections:

Adding "SyntheticEvent" or "Reconciliation Fiber" into the Glossary of a JSX grammar lecture when those concepts were not introduced or analyzed in the body of the lecture.

Notes: A glossary that introduces orphan terms confuses the student and breaks curriculum linearity.

## The Explanation Under the Box | 04 | Proof in Code, Words the Reader Can Picture #2026_09_25_03_group_1 revised by #2026_09_26_19_group_1 and #2026_10_06_04_group_3

- [ ] Was every box written under `principle-definition` and its casebook? This skill governs what follows the box. #2026_10_04_09_group_1 revised by #2026_10_06_04_group_3
- [ ] Does the explanation answer the questions the box leaves open, in the order the reader would ask them, and show the claim in titled code blocks whose output the lesson's proofs verified? A block already shown earlier is named by its title, not printed again; each new block adds or changes the lines the principle is about. #2026_09_26_16_group_1 revised by #2026_10_06_03_group_4 and #2026_10_06_04_group_3
- [ ] Does the explanation trace only the layers the principle touches, ending in what the reader can see: the screen, the console, DevTools, or the build output? The compiler layer (`_jsx()` calls) belongs to principles about what JSX compiles to. Words for hardware and engine internals (CPU, stack frame, memory slot, Fiber) stay out unless the principle is about them. #2026_09_26_09_group_1 revised by #2026_10_06_03_group_6
- [ ] Is it written in calm, plain English that says why React behaves as it does in words the reader can picture (e.g. "Because 0 is a number, React shows it. React hides booleans, but it never hides numbers.")? #2026_09_26_09_group_1 revised by #2026_10_06_04_group_3
- [ ] When the explanation walks through a tempting mistake, does it say why the mistake feels right before showing what happens (*"A developer may expect X, because Y..."*), without claiming that every beginner makes it? #2026_09_27_05_group_1
- [ ] Do the code blocks carry descriptive titles (such as `title="Console Output"`, `title="Browser Render"`, `title="Component Source"`), never fallbacks like `App.jsx` or `code.txt`, and keep 2-space JSX nesting, parenthesized JSX returns, and file names from the lecture tree? #2026_09_26_09_group_1 revised by #2026_10_06_04_group_3
- [ ] Are code comments plain English saying what the line does or prints, at the end of the line they explain, without markdown asterisks or uppercase shouting? #2026_09_26_18_group_1 revised by #2026_10_06_04_group_3
- [ ] Does each principle get the explanation its content needs (a proof block, a table, a figure, a short list where steps really happen in order), never one fixed template or numbered list stamped under every principle? #2026_09_26_18_group_1 revised by #2026_10_06_04_group_3

- [ ] COUNTER-EXAMPLE: Pattern to avoid: The cookie-cutter explanation. Every principle ends with the same five-item list (*"Watch how the runtime executes: 1. React does X, 2. React does Y..."*), and code comments shout (`// Top-level **ROOT**`). Notes: The shape must come from the mechanism; the casebook's Case 12 shows a paragraph that follows the reader's questions instead. #2026_09_26_18_group_1 revised by #2026_10_06_04_group_3

### Choosing the Code Pair #2026_09_26_06_group_1 revised by #2026_10_06_04_group_3

Every box ends with a code pair (principle-definition sets the labels). The checks below are about choosing an honest pair. #2026_10_06_04_group_3

- [ ] Do both cards show peer code from the same file, language, and scope (JSX against JSX in one component, JavaScript against JavaScript in `main.jsx`), never an HTML tag against a JavaScript call, a terminal command, or identical code with different comments? #2026_09_26_06_group_1 revised by #2026_09_27_12_group_1 and #2026_10_06_04_group_3
- [ ] Does the wrong card show code developers really write in this domain, not an artificial strawman (such as `document.body.appendChild()` or `window.x` in lessons where no one would write them)? #2026_09_26_06_group_1 revised by #2026_09_26_17_group_1
- [ ] Are both cards real, runnable code, compact enough that the box fits on one page (about 4 to 8 lines per card)? #2026_09_26_01_group_1 revised by #2026_09_27_12_group_1 and #2026_10_06_04_group_3
- [ ] Could the reader tell, from the two cards and their comments alone, what goes wrong and what to write? Comments state the conflict on that line (*"default export cannot use curly braces"*), never a compiler message about an unseen file (*"Missing named export"*). #2026_09_27_10_group_1 revised by #2026_10_06_04_group_3

- [ ] COUNTER-EXAMPLE: Pattern to avoid: The trivial syntax typo strawman: #2026_09_26_06_group_1

> [!PRINCIPLE]
> **Principle N: Always Return JSX from Components**
> 
> *We should do this:*
> function Card() {
>   return (
>     <div>Story</div>
>   );
> }
> 
> *We should not do this:*
> function Card() {
>   <div>Story</div>
> }

Notes: Fails because forgetting the `return` statement is a trivial JavaScript syntax typo, not a React principle. The contrast worth a box is a component that returns a description of the screen against one that changes the page by hand. #2026_09_26_06_group_1 revised by #2026_10_06_04_group_3

- [ ] COUNTER-EXAMPLE: Pattern to avoid: The absurd data conversion strawman: #2026_09_26_06_group_1

> [!PRINCIPLE]
> **Principle N: Render Dynamic Primitives in JSX**
> 
> *It is best practice to do this:*
> <span>{readTime}</span>
> 
> *Instead of doing this:*
> <span>{String(readTime)}</span>

Notes: Fails because React shows numbers as text already; calling `String(readTime)` produces identical output and is not a mistake anyone needs warning about. A genuine contrast shows a real failure, such as a raw count on the left of `&&` that prints `0`, or a real choice, such as `&&` for a one-sided addition versus a ternary when the false case has its own output. #2026_09_26_06_group_1 revised by #2026_09_26_21_group_3

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Repetitive anti-patterns across principles: #2026_09_26_06_group_1

In a component-tree lecture, one principle contrasts components with monolithic HTML in App.jsx, the next contrasts props with the same monolithic HTML, a third contrasts subtrees with it, and a fourth contrasts small UI controls with it. #2026_09_26_21_group_3

Notes: Fails because four principles attack the same strawman ("dumping everything into one file"). Each principle needs its own surprise and therefore its own pair. #2026_09_26_06_group_1 revised by #2026_10_06_04_group_3

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Buzzwords in comments:

> *It is best practice to do this:*
> `<Feed stories={stories} /> // Vertical prop propagation`
> 
> *Instead of doing this:*
> `window.selectedStory = 42; // Horizontal cross-component coupling`

Notes: The comments must say the concrete action: `// Passes stories down as a prop` against `// Stores the story on window, outside React`. #2026_09_26_01_group_1 revised by #2026_10_06_04_group_3

- [ ] COUNTER-EXAMPLE: Pattern to avoid: The empty card:

> *It is best practice to do this:*
> `<EditorialFeed><ArticleCard /></EditorialFeed> // Modular architecture`
> 
> *Instead of doing this:*
> `// Conflating components with DOM nodes`

Notes: The wrong card holds no code, and both comments are labels instead of what the line does. #2026_09_26_01_group_1 revised by #2026_10_06_04_group_3

- [ ] COUNTER-EXAMPLE: Pattern to avoid: The layer mismatch: #2026_09_27_12_group_1

> [!PRINCIPLE]
> **Principle N: Hand React One Container and Expect It to Replace That Container's Contents**
> 
> *It is best practice to do this:*
> `<div id="root"><p>Loading...</p></div>`
> 
> *Instead of doing this:*
> `const root = createRoot(document.body);`

Notes: Fails because it contrasts two languages in two files (HTML in `index.html` against JavaScript in `main.jsx`). A same-file pair exists: `createRoot(document.getElementById('root'))` against `createRoot(document.body)`, with comments saying what each one replaces. #2026_09_27_12_group_1 revised by #2026_10_06_04_group_3

- [ ] COUNTER-EXAMPLE: Pattern to avoid: A terminal command in a card: #2026_09_27_12_group_1

> [!PRINCIPLE]
> **Principle N: Serve the App Over HTTP Through Vite**
> 
> *We should do this:*
> `npm run dev // Opens http://localhost:5173 with hot reload`
> 
> *We should not do this:*
> `open file:///Users/project/index.html // Blocked by browser CORS policy`

Notes: Terminal commands belong in titled `bash` blocks in the explanation. When no honest same-file pair exists, the topic is usually a setup step rather than a principle; raise it in the map instead of forcing a card. #2026_09_27_12_group_1 revised by #2026_10_06_04_group_3

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Identical code, different comment: #2026_09_27_12_group_1

> [!PRINCIPLE]
> **Principle N: Keep JSX in .jsx Files**
> 
> *We should do this:*
> `// File: src/App.jsx`
> `export default function App() { return <h1>The National Times</h1>; }`
> 
> *We should not do this:*
> `// File: src/App.js`
> `export default function App() { return <h1>The National Times</h1>; } // Fails build: Unexpected JSX`

Notes: Both cards hold the same code; only a comment differs. Show the code that differs instead, such as the import line `import App from './App.jsx'` against `import App from './App.js'`. #2026_09_27_12_group_1 revised by #2026_10_06_04_group_3

- [ ] COUNTER-EXAMPLE: Pattern to avoid: A comment above the line it explains: #2026_09_27_13_group_1

> *It is best practice to do this:*
> `// Ternary cleanly presents two alternate choices`
> `{isLive ? <LiveBadge /> : <StaticDate />}`

Notes: The build draws each comment as a bubble under its own line, pointing up, so a comment on its own line points at nothing. Put it at the end of the line it explains. #2026_09_27_13_group_1 revised by #2026_10_06_04_group_3

## Principle Anatomy & Formatting | 05 | Approved Map Traceability and Content-Driven Coverage #2026_09_25_03_group_1 revised by #2026_09_25_07_group_1, #2026_09_26_19_group_1, and #2026_09_26_20_group_1

- [ ] Do the lecture's principles and their order come directly from the approved `01-01-map-principles/{nn}.md`, leaving discovery, ownership, and selection to the `map-principles` workflow? #2026_09_26_19_group_1 revised by #2026_09_26_20_group_1 and #2026_09_26_21_group_2
- [ ] Does every principle govern a decision the map assigns to this lesson, with candidates the map routes elsewhere handled as one-line recalls (`Prerequisite`) or one-sentence forward mentions that name the owner lesson (`Preview`)? #2026_09_26_17_group_1 revised by #2026_09_26_21_group_2
- [ ] Does the lecture preserve one-to-one coverage by expanding every approved operational decision without merging distinct entries or splitting one entry into redundant principles? #2026_09_25_07_group_1 revised by #2026_09_26_09_group_1 and #2026_09_26_19_group_1
- [ ] Is the depth and number of explanatory points following each principle flexible and pertinent to the complexity of the mechanism, with no fixed quotas (such as "always exactly 2 bullets" or "always exactly 3 bullets")?
- [ ] Does the text avoid padding trivial principles with filler points or artificially compressing deep principles to hit an arbitrary bullet count?

## Interview Callouts | 06 | Tips and Surprises #2026_09_24_02_group_1 revised by #2026_10_06_04_group_3

- [ ] Are `> [!TIP]` callouts titled `**To impress the interviewer:**` used where a principle gives the reader something short and true to say in an interview, in the same plain words as the lesson?
- [ ] Are `> [!WILD]` callouts reserved for surprising edge cases, without repeating material already taught?
- [ ] For a rule that feels arbitrary, does the explanation pose and answer the question an interviewer would ask about it (*"Why double curly braces?"*)? #2026_09_24_04_group_1 revised by #2026_10_06_04_group_3
