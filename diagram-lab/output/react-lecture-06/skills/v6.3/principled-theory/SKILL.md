---
name: principled-theory
description: Governs the authoring of independent, complete, principle-based theory sections, zero-new-concept case studies, and interview-framed pedagogy across React lectures.
---

# Principled Theory

This skill governs the one-to-one expansion of an approved principle map into curriculum analysis: constructing an independent, complete theory section before the practical example, maintaining zero new concepts across case studies and terminal sections, structuring principles with canonical callout syntax and evidence-based review cases, providing tangible accompaniments (tables, diagrams, code blocks, bullet breakdowns), and framing every mechanism from the perspective of an engineering candidate preparing for a senior technical interview. #2026_09_26_19_group_1

Digests: `01-02-md-LECTURES/v5/04.md` (the canonical living benchmark for principle-based lessons, lines 90–380) and `skills/v6.3/lecture-structure/SKILL.md`.

Notes: Exemplars in this skill write `Principle N`. They model voice, contrast quality, and explanation substrate; they never assign a decision to a lesson or a position in a list, because the approved principle map supplies every real number. The v5 benchmark lecture keeps its own historical numbering, which predates the principle maps and decides nothing about ownership or count. #2026_09_26_21_group_3

## Architectural Philosophy | 01 | Theory-First Foundation and Autonomous Principles #2026_09_25_03_group_1

- [ ] **The Living Benchmark Reading Gate**: Did the author read the canonical benchmark principles in Lecture 4 (`01-02-md-LECTURES/v5/04.md#L90-L380`) using `view_file` BEFORE authoring, modifying, or auditing principles, anchoring directly into its lucid B2 English, 3-beat physical machine traces, explicit code fence titles, and contract-driven principle breakdown? #2026_09_26_09_group_1
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
> `return (<div><img /><h2 /></div>);`
> 
> *We should not do this:*
> `return (<img /><h2 />);`

A React component is a standard JavaScript function. In JavaScript, a `return` statement can only return a single value or expression. When you write two adjacent tags at the root level, JavaScript cannot evaluate them as a single expression. Under the hood, JSX compiles into `_jsx(type, props)` function calls. Just as you cannot return two separate function calls without wrapping them in an array or container object, you cannot return adjacent JSX tags.
```

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

- [ ] Do downstream terminal sections—`### Where you will meet this`, `### Glossary`, `## Beyond the basics`, `### Summary`, comparative tables, and marginal notes—introduce zero new concepts, terms, or ungrounded classifications?
- [ ] Is `### Where you will meet this` used exclusively to ground already-introduced principles into concrete professional engineering contexts?
- [ ] Are `### Glossary` entries restricted strictly to terms explicitly introduced and bolded in the lecture body?
- [ ] Does `## Beyond the basics` point to official documentation links (`https://react.dev/...`) that deepen the exact principles taught in the chapter?
- [ ] Does `### Summary` distill the principles into crisp decision rules (`➔`) and right/wrong takeaways without introducing fresh syntax?

- [ ] PROPER EXAMPLE: Terminal sections grounding existing principles:

In a JSX grammar lecture's Glossary, every defined term (Abstract Syntax Tree, JSX Transform, React Fragment, Self-Closing Tag, DOM Property Alignment) was explicitly unpacked in the body of the lecture before it appeared in the Glossary. #2026_09_26_21_group_3

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Introducing orphan terms in downstream sections:

Adding "SyntheticEvent" or "Reconciliation Fiber" into the Glossary of a JSX grammar lecture when those concepts were not introduced or analyzed in the body of the lecture.

Notes: A glossary that introduces orphan terms confuses the student and breaks curriculum linearity.

## Principle Anatomy & Formatting | 04 | Operational Principle Definitions and Evidence-Based Review Cases #2026_09_25_03_group_1 revised by #2026_09_26_19_group_1

- [ ] Is every principle formatted as a dedicated callout block using the `> [!PRINCIPLE]` tag?
- [ ] **Calibrated Interview Vocabulary & Anti-Circumlocution Standard**: Does the principle use exact industry vocabulary where senior interviewers specifically grade candidates on canonical terms (e.g. **Slot Composition**, **Inversion of Control**, **Opaque Data Structure**, **Unidirectional Data Flow**)? In these critical architectural cases, are vague conversational circumlocutions that avoid standard terms strictly avoided? Do we avoid casting a blanket maximum net that forces academic jargon into simple mechanics? Does the vocabulary cover what needs to be covered—not more, not less? #2026_09_26_11_group_1 revised by #2026_09_27_01_group_1
- [ ] Does the principle definition decompress the concept across 2 to 3 calm, active sentences (averaging 12–18 words)? Does it follow a clear 3-beat rhythm? Beat 1 introduces the plain physical entity or distinction. Beat 2 states what the platform does or does not do automatically. Beat 3 gives the concrete developer action and the bug prevented. #2026_09_26_03_group_1 revised by #2026_09_27_01_group_1
- [ ] Is the principle definition written in fluent, natural prose without robotic bold-parentheses stuffing (e.g. strictly avoiding trailing parentheticals like `(**single common parent**)` or `(**conflicting, desynchronized values**)` in prose)? Are formal technical terms embedded naturally into the sentence and bolded inline where they occur naturally, letting the marginal gloss (`>> term : definition`) provide the isolated dictionary definition? #2026_09_26_06_group_1
- [ ] Does the principle explanation follow a physical machine trace, walking the reader step-by-step through the layers: (1) Developer JSX input, (2) Compiler AST or `_jsx()` function call, and (3) Browser DOM node or visual screen render? #2026_09_26_09_group_1
- [ ] **The Principle Explanation Substrate Standard (Tangible Pedagogical Variety)**: Does every principle's operational derivation contain concrete, titled code blocks demonstrating the physical machine layers (compiler output, evaluated expressions, browser renders, or syntax failures) rather than relying on dry, text-only paragraphs? Derivations must anchor into the living benchmark of Lesson 04 (`01-02-md-LECTURES/v5/04.md#L90-L380`), selecting the pedagogical substrate that organically creates an "aha moment" for that specific invariant (e.g. mental model contrast, grammar proof, runtime evaluation walkthrough, or variable extraction). Authors must strictly avoid rigid cookie-cutter homogenization—never forcing an identical 5-part template or a mandatory 1-to-5 numbered list under every principle. Purely textual prose without code blocks under a principle is a critical pedagogical defect. #2026_09_26_16_group_1 revised by #2026_09_26_18_group_1
- [ ] **Natural Code Comments & Anti-Shouting Standard**: Are inline code comments written in clean, active English describing the code action (e.g. `// Short-circuits to boolean value`, `// Evaluates left side zero`), strictly avoiding markdown asterisks or uppercase label shouting inside code comments (e.g. avoiding `// Top-level **ROOT**` or `// Layout **BRANCH**`)? #2026_09_26_18_group_1
- [ ] Is the explanation written in calm, lucid B2 conversational English that provides "aha moments" by explaining why the engine behaves as it does (e.g. "Because 0 is a number, React creates a real browser text node. React hides booleans, but it never hides numbers."), avoiding robotic compliance phrasing, defensive contortions, and academic jargon? #2026_09_26_09_group_1
- [ ] **Empathetic Pitfall & Probabilistic Scenario Framing in Derivations**: When walking through common misconceptions, runtime bugs, or naive implementation patterns in derivations, are they introduced as realistic, empathetic possibilities (e.g. *"A junior developer may fall into this trap..."*, *"It is possible that a student of React may assume X, thinking this because of Y..."*, *"We sometimes see developers encounter this confusion..."*) rather than asserting absolute, sweeping claims about what beginners or developers always do? Does the derivation clearly validate the intuitive reason behind the naive attempt (*"they may think this because..."*) before demonstrating the engine's physical reality? #2026_09_27_05_group_1
- [ ] **The Canonical Noun + Plain Human Verb Standard**: Does the principle pair canonical platform nouns (`props`, `children`, `virtual DOM`) with simple, active everyday verbs (`pass`, `receive`, `render`, `check`)? Does it avoid pompous academic dressing (such as `"lives authoritatively"`, `"write-only projection surface"`, `"governing operational paradigm"`)? Does the definition speak like a clear-headed mentor explaining physical reality to a junior developer? #2026_09_26_12_group_1 revised by #2026_09_27_01_group_1
- [ ] **The Two-Step Translation Protocol: Extraction of Information & Translation to Easy-to-Read Language**: Does the author follow the two-step process when bringing rules from `01-01-map-principles/{nn}.md` into production lectures:
    1. **Step 1: Extraction of Core Information**: Did the author isolate and retrieve all the underlying architectural information, technical mechanisms, and platform invariants from the map, treating the map strictly as an information source?
    2. **Step 2: Translation to Easy-to-Read Language**: Did the author translate that information into clear, easy-to-read, and easy-to-understand language by following the governing standards of this skill (the 3-Beat Operational Rhythm in Rule 104, the Calibrated Interview Vocabulary in Rule 103, the Canonical Noun + Plain Human Verb Standard in Rule 110) and anchoring into the models in the Golden Exemplar Bank? #2026_09_26_13_group_1 revised by #2026_09_27_04_group_1
- [ ] Does the principle header use bold continuous numbering: `> **Principle N: Active Descriptive Title**`?
- [ ] Are marginal glosses (`>> phrase : explanation`) used selectively, only when a genuinely confusing or load-bearing technical concept appears in the definition?
- [ ] Are self-evident words and everyday conversational English left without glosses, maintaining clean white space?
- [ ] When a gloss is used, is the phrase on the left of the colon an exact verbatim substring from the definition sentence, decoding the hurdle without introducing outside textbook jargon?
- [ ] When an authentic two-sided contrast clarifies the approved operational decision, are comparative code cases labeled using the fitting pedagogical pair: #2026_09_26_19_group_1
    * Pair 1 (Syntax / Language Validity): `*We should do this:*` / `*We should not do this:*` (used when contrasting valid code against compiler crashes, syntax errors, or runtime failures).
    * Pair 2 (Best Practice / Idiomatic Architecture): `*It is best practice to do this:*` / `*Instead of doing this:*` (used when both snippets run, but one represents clean idiomatic architecture while the other introduces pitfalls or memory bloat).
- [ ] When no honest negative case exists, does the explanation use a single positive proof or a conditional comparison instead of inventing a prohibition to complete a pair? #2026_09_26_19_group_1
- [ ] **Model and Non-Syntax Principle Card-Free Standard**: When a principle governs an architectural mental model (`Kind: Model`), runtime execution timing, a CLI command workflow (e.g. `npm run dev`), or file naming rules (`.jsx` vs `.js`), does the `> [!PRINCIPLE]` callout block omit comparative code cards entirely (no `*We should do this:*` or `*Instead of doing this:*`), presenting cleanly with just the active title, definition, and marginal glosses? Is the concrete demonstration or prediction proved via titled code blocks in the operational explanation below? #2026_09_26_21_group_2 revised by #2026_09_27_12_group_1
- [ ] **In-File Scope and Layer Symmetry Standard**: When comparative code cards are warranted, do both cards demonstrate competing peer lines of code belonging to the **exact same file, language, and lexical scope** (e.g. JSX vs JSX inside the same component, or JavaScript vs JavaScript inside `main.jsx`), avoiding cross-layer comparisons (such as contrasting an HTML container tag against a JavaScript function call), shell/terminal CLI commands in code boxes, or identical code with only different file comments? #2026_09_26_06_group_1 revised by #2026_09_26_19_group_1 and #2026_09_27_12_group_1
- [ ] Does the "Instead of doing this:" / "We should not do this:" case show realistic code that developers actually write in the specific domain of the question, rather than generic artificial strawmen (such as indiscriminately injecting `document.body.appendChild()` or `window.x` into lessons where no developer would write them)? #2026_09_26_06_group_1 revised by #2026_09_26_17_group_1
- [ ] **Map Ownership Standard**: Does every principle govern a decision that the approved `01-01-map-principles/{nn}.md` assigns to this lesson, with candidates the map's ledger routes to other lessons handled as one-line recalls (`Prerequisite`) or one-sentence forward mentions that name the owner lesson (`Preview`) rather than as principles? #2026_09_26_17_group_1 revised by #2026_09_26_19_group_1 and #2026_09_26_21_group_2
- [ ] When a chapter contains multiple principles, does each principle govern a distinct, independent architectural dimension rather than repeatedly attacking the same anti-pattern (e.g. avoiding repeating "monolithic file dumping" across four separate principles)? #2026_09_26_06_group_1
- [ ] Are code snippets in principle cards full-width, badge-aligned, and kept strictly within the standard 80-character boundary without mid-line wrapping? #2026_09_26_01_group_1 revised by #2026_09_27_09_group_1
- [ ] **The Bottom-Attached Speech-Bubble Comment Model Standard**: Are comments in principle code snippets ALWAYS authored at the bottom/trailing end of the target code line (`code // comment`), rather than on separate lines preceding the code? #2026_09_27_06_group_1 revised by #2026_09_27_13_group_1
    * **Upward-Pointer Attachment Model**: The speech bubble cloud (`.cmt-bubble`) has an upward pointer (`▲`) on its top edge and renders directly beneath the target code line. Authoring comments on standalone lines *above* the code inverts the layout, causing the pointer to point into card headers or into preceding lines. Comments must ALWAYS be placed at the bottom of the code line (`code // comment`) so the bubble sits beneath the code it annotates.
    * **Plain, Visceral English**: Comments must be written in simple, conversational human words. Strictly ban corporate slogans, marketing buzzwords, and academic dressing (such as "owning masthead branding", "orchestration boundary", "application truth", or "here we add elements").
    * **Concrete Explanatory Role**: State plainly *what this specific element does* or *why this exact line fails* (e.g. `// Putting this tag inside article makes it a child component`, `// Parent omits child tag from JSX`, `// Never runs: child cannot execute on its own`, `// Crash: NewsHeader cannot reach variables inside Feed`).
    * **Clear Action Contrast**: When two cases are compared, the comments on both cards form a paired explanation showing why the positive case succeeds and why the negative case breaks or violates architecture.
- [ ] **The Autonomous Conclusion Standard (Self-Contained Bubble Test)**: Can the reader deduce both the developer's physical mistake and the governing rule with 100% autonomy, looking *only* at the card's code line and its comment bubble without reading surrounding text or guessing what an unseen file contains? #2026_09_27_10_group_1
    * **Direct Token / Syntax Binding**: Comments must explain the physical syntax right in front of the reader (e.g. *“default export cannot use curly braces { }”*, *“named export cannot omit curly braces { }”*, *“cannot omit parentheses on JSX return”*).
    * **Ban on Disembodied Compiler Error Code Mimicry**: Never mimic raw, cryptic compiler diagnostics (e.g. *“Missing named export”*, *“Invalid hook call”*, *“Parsing error”*) that refer to external unseen files. Always state the physical code conflict present on that exact line.
- [ ] **Single-Page Callout Budget**: Principle callouts render in full-width breakout mode by default (`code-plus`). When comparative code cards are present, are code snippets kept compact (4–8 lines per card, max 2–3 comment bubbles per card) so that the callout block fits comfortably on a single page alongside the principle header and definition without triggering an awkward page break? #2026_09_27_06_group_1 revised by #2026_09_27_12_group_1
- [ ] When a two-card comparison is warranted, are both cards symmetrical and populated with real, runnable code, ensuring the anti-pattern demonstrates the actual physical code mistake rather than an empty placeholder or comment-only box? #2026_09_26_01_group_1 revised by #2026_09_26_19_group_1
- [ ] Do all fenced code blocks carry explicit, descriptive titles (such as `title="Compiler Output"`, `title="Browser Render"`, `title="Component Source"`, `title="Evaluated Expression"`, `title="Safe Boolean Comparison"`), preventing uninformative default fallbacks like `App.jsx` or `code.txt`? #2026_09_26_09_group_1
- [ ] Do code snippets preserve standard 2-space JSX nesting, proper newlines, closing brackets on separate lines, and registered filenames from the lecture tree? #2026_09_26_01_group_1
- [ ] Are JSX return statements in code cases wrapped in parentheses? #2026_09_24_03_group_1
- [ ] Are code lines in principle comparative cases (`*It is best practice to do this:*` / `*Instead of doing this:*`) authored with individual line-by-line backticks (e.g. `` `  return (` ``) with rigid 2-space indentation to ensure markdown parsers and PDF engines never strip leading whitespace? #2026_09_26_14_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: The Pompous Academic Bureaucrat Anti-Pattern (Corporate Word Salad): #2026_09_26_12_group_1

> [!PRINCIPLE]
> **Principle N: Store Application State in JavaScript Memory, Never in HTML Attributes**
> Application state lives authoritatively in JavaScript memory as variables, numbers, and objects. The browser DOM is strictly a write-only projection surface; components never query HTML attributes (getAttribute, dataset) to determine application truth or drive business logic.

Notes: Pompous, stiff, and bureaucratic. Shrouds simple mechanics in high-flown pseudo-intellectual dressing ("lives authoritatively", "write-only projection surface", "determine application truth", "drive business logic"). A tired developer reading this gains zero physical clarity. Replace with plain, active verbs: "Store your data in JavaScript variables, not in HTML tags. React uses the DOM only to display results, so your code never reads HTML attributes like data-tier to figure out what is happening in your app." #2026_09_26_12_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: The Compressed Participial Chain (Textbook Congestion): #2026_09_26_13_group_1

> [!PRINCIPLE]
> **Principle N: Use Virtual DOM Reconciliation to Surgically Patch the DOM Without Destroying Focus**
> React updates the screen using virtual DOM reconciliation, comparing two lightweight object trees in memory before touching the browser. Because React updates only the specific text node that changed instead of wiping the container with innerHTML, the browser preserves living elements and keeps the active text cursor alive.

Notes: Stuffed with participial chaining ("..., comparing two lightweight object trees in memory before touching the browser..."). It squashes four concepts into a single breathless clause. A reader cannot visualize the sequence. Decompress into natural human order: (1) physical consequence first, (2) named mechanism second, and (3) step-by-step trace in memory and DOM third. #2026_09_26_13_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: The Exhausted Spec Dump in Principle Boxes: #2026_09_26_15_group_1

> [!PRINCIPLE]
> **Principle N: Enforce PascalCase Capitalization to Emit Function Identifiers**
> When you mount a component in JSX, starting its name with a capital letter tells the compiler to run your JavaScript function instead of creating an empty browser tag. If you write `<articleCard />` in lowercase, the browser creates an unknown HTML element and renders a blank screen without throwing an error. React enforces this distinction through the JSX compiler AST branch. When the compiler encounters an uppercase tag like `<ArticleCard />`, it emits an unquoted function identifier `_jsx(ArticleCard)`. React holds the function pointer in memory, runs `ArticleCard()`, and paints the returned markup to the page.

Notes: Fails because it mistakes the Principle Definition Box for the entire technical section. It stuffs 5 sentences and 84 words with compiler AST jargon (`_jsx(ArticleCard)`), function pointer mechanics, and DOM painting steps. A principle definition is an architectural compass: 2 to 3 calm, memorable sentences (35–50 words). Keep compiler transformation code and deep machine traces in the prose explanation underneath the code cards, where they can be properly unpacked and visualized. #2026_09_26_15_group_1

### The Principle Definition Canon (Golden Exemplar Bank) #2026_09_26_13_group_1 revised by #2026_09_26_20_group_1

- [ ] PROPER EXAMPLE: Component PascalCase Capitalization pattern: #2026_09_26_15_group_1 revised by #2026_09_26_20_group_1

> [!PRINCIPLE]
> **Principle N: Enforce PascalCase Capitalization to Emit Function Identifiers**
> Always name custom components with a capital letter in **PascalCase** so React knows to run your function. When a tag starts with an uppercase letter, React invokes your component and renders its markup. Lowercase tags are treated as native HTML, causing the browser to render an empty unknown element and fail silently.
> 
> >> function identifier : an unquoted reference to a JavaScript function in memory
> 
> *It is best practice to do this:*
> `function ArticleCard() { // PascalCase emits function reference`
> `  return (`
> `    <article className="card">`
> `      <h2>Morning Dispatch</h2>`
> `    </article>`
> `  );`
> `}`
> 
> *Instead of doing this:*
> `function articleCard() { // Lowercase emits string literal`
> `  return (`
> `    <article className="card">`
> `      <h2>Morning Dispatch</h2>`
> `    </article>`
> `  );`
> `}`

Notes: Exactly 3 sentences, 46 words. Punchy, memorable, and human. Establishes the rule (PascalCase), the happy path (React invokes component), and the silent failure (empty unknown HTML element). Leaves the AST compiler mechanics (`_jsx("articlecard")` vs `_jsx(ArticleCard)`) and Unicode categories for the deep explanation prose below the cards. #2026_09_26_15_group_1

- [ ] PROPER EXAMPLE: Pure Return Contract vs Imperative DOM Mutation pattern: #2026_09_26_15_group_1 revised by #2026_09_26_20_group_1

> [!PRINCIPLE]
> **Principle N: Return Declarative UI Descriptors Instead of Mutating the DOM Directly**
> React components must return a description of what the screen should look like instead of modifying the DOM by hand. Your component function should be a pure calculation that returns JSX or `null`. If a component mutates the real page during render, it bypasses React's memory tracking and creates duplicate elements or broken UI.
> 
> >> UI descriptor : a lightweight object describing what markup should appear on screen
> >> pure rendering calculation : a function that produces the same UI descriptor without modifying outside state or DOM nodes
> 
> *It is best practice to do this:*
> `function NewsSnippet({ text }) { // Returning declarative UI descriptor`
> `  return (`
> `    <p className="summary">{text}</p>`
> `  );`
> `}`
> 
> *Instead of doing this:*
> `function NewsSnippet({ text }) { // Mutating DOM directly during render`
> `  document.body.append(text);`
> `  return null;`
> `}`

Notes: 3 sentences, 56 words. Pure architectural law. Explains what to do (return UI descriptor), the contract (pure calculation returning JSX or null), and the failure (duplicate elements, broken UI). Leaves the Two-Phase Commit Pipeline (render vs commit phase) and StrictMode double-invocation for the prose below. #2026_09_26_15_group_1

- [ ] PROPER EXAMPLE: Virtual DOM Reconciliation with natural 3-step sequence: #2026_09_26_13_group_1 revised by #2026_09_26_20_group_1

> [!PRINCIPLE]
> **Principle N: Use Virtual DOM Reconciliation to Surgically Patch the DOM Without Destroying Focus**
> When data changes, React updates only the specific text or element that changed instead of wiping the whole container with `innerHTML`. It achieves this precision through **virtual DOM reconciliation**. Before touching the real browser, React builds a fresh tree of objects in memory and checks it against the previous tree. It finds the exact difference and updates only that single node in the browser, keeping living elements and the active text cursor alive.
> 
> >> virtual DOM reconciliation : comparing two lightweight object trees in memory to find differences before touching the page
> >> focus preservation : keeping the active text cursor alive inside an input field during UI updates
> 
> *It is best practice to do this:*
> `return ( // Patching text nodes surgically`
> `  <span>Welcome, {readerName}</span>`
> `);`
> 
> *Instead of doing this:*
> `header.innerHTML = // Wiping container nodes with innerHTML`
> `  '<span>' + readerName + '</span>';`

Notes: Follows the natural 3-step sequence: (1) states the physical screen contrast first (surgical node update vs wiping with innerHTML), (2) names the canonical platform mechanism (virtual DOM reconciliation), and (3) traces the physical memory-to-DOM sequence without participial chaining. #2026_09_26_13_group_1

- [ ] PROPER EXAMPLE: Declarative UI Descriptions vs Imperative DOM Transitions pattern: #2026_09_26_13_group_1 revised by #2026_09_26_20_group_1

> [!PRINCIPLE]
> **Principle N: Write Declarative UI Descriptions Instead of Scripting Imperative DOM Transitions**
> In React, you use **declarative UI** to describe what the screen should look like for every state. You never write **imperative DOM scripts** that add or remove CSS classes step by step (`classList.add`, `classList.remove`). If a script fails halfway through those steps, the element gets stuck in a broken intermediate state. React prevents this by swapping to the complete target design in one clean step.
> 
> >> declarative UI : describing what the screen should look like instead of scripting each DOM change
> >> intermediate state : a broken half-way condition where old and new styles collide during transitions
> 
> *It is best practice to do this:*
> `function Status({ isPro }) { // Declaring target visual end-state`
> `  return (`
> `    <span className={`
> `      isPro ? 'pro' : 'standard'`
> `    }>Status</span>`
> `  );`
> `}`
> 
> *Instead of doing this:*
> `function setStatus(isPro) { // Toggling DOM classes step by step`
> `  const el = get('status');`
> `  if (isPro) el.classList.add('pro');`
> `  else el.classList.remove('pro');`
> `}`

Notes: Clearly contrasts the declarative target description against the fragile step-by-step imperative transition. Explains why the bug happens (script failing halfway) in simple, human terms. #2026_09_26_13_group_1

- [ ] PROPER EXAMPLE: Store Data in JavaScript Variables, Not in HTML Attributes pattern: #2026_09_26_13_group_1 revised by #2026_09_26_20_group_1

> [!PRINCIPLE]
> **Principle N: Store Data in JavaScript Variables, Not in HTML Attributes**
> Keep your data in JavaScript variables, numbers, and objects, not in HTML elements. React uses the DOM only to display results, so your code never reads HTML attributes like `data-tier` to figure out what is happening in your app.
> 
> >> write-only DOM : using the browser page only to display results, never to store app data
> >> DOM state coupling : an anti-pattern where code reads HTML attributes to make decisions
> 
> *It is best practice to do this:*
> `const user = { name: 'Clara', tier: 'PRO' };`
> `return <Badge tier={user.tier} />; // Reading state from JavaScript memory`
> 
> *Instead of doing this:*
> `const badge = document.getElementById('badge');`
> `const tier = badge.getAttribute('data-tier'); // Reading state from DOM attributes`

Notes: Perfectly pairs canonical nouns (state, DOM, HTML attributes) with plain human verbs (keep, use, display, read). Zero bureaucratic fluff. #2026_09_26_13_group_1

- [ ] PROPER EXAMPLE: Unidirectional Data Flow from a Single Source of Truth pattern: #2026_09_26_13_group_1 revised by #2026_09_26_20_group_1

> [!PRINCIPLE]
> **Principle N: Pass Data Downward from a Single Source of Truth to Prevent State Drift**
> Data flows in only one direction in React, passing from parent components down to children through **props**. This rule is called **unidirectional data flow**. Because all related widgets receive their data from a **single source of truth**, they always update together. This prevents **state drift**, where different parts of the screen show conflicting information for the same user.
> 
> >> unidirectional data flow : passing data strictly downward from parent to child components via props
> >> state drift : a defect where two UI elements display contradictory data for the same entity
> 
> *It is best practice to do this:*
> `function Header({ user }) { // Distributing data from single parent`
> `  return (`
> `    <header>`
> `      <Greeting name={user.name} />`
> `      <Badge name={user.name} />`
> `    </header>`
> `  );`
> `}`
> 
> *Instead of doing this:*
> `function syncUser(user) { // Updating widgets in separate queries`
> `  setNav(user.name);`
> `  setBadge(user.name);`
> `}`

Notes: Decompresses parent-to-child data flow and state drift into 4 calm, sequential sentences without participatory congestion. #2026_09_26_13_group_1

- [ ] PROPER EXAMPLE: Component Functions Turning Data into Markup pattern: #2026_09_26_13_group_1 revised by #2026_09_26_20_group_1

> [!PRINCIPLE]
> **Principle N: Build Components as Functions That Turn Data into Markup (UI = f(data))**
> React builds user interfaces using **component functions** that turn data directly into markup: `UI = f(data)`. When data changes, React runs the function again with new values, so you never have to search the page with `document.getElementById` or update nodes by hand.
> 
> >> component function : a function that receives data inputs and returns markup descriptors
> >> null selector crash : a crash that happens when code cannot find a renamed element on the page
> 
> *It is best practice to do this:*
> `// Projecting UI directly from arguments`
> `function Header({ user }) {`
> `  return (`
> `    <h1>Welcome, {user.name}</h1>`
> `  );`
> `}`
> 
> *Instead of doing this:*
> `// Querying and mutating DOM nodes`
> `function updateHeader(user) {`
> `  const el =`
> `    document.getElementById('name');`
> `  el.textContent = user.name;`
> `}`

Notes: Clean B2 active verbs. Contrasts declarative function parameter projection against manual imperative document searching and null crashes. #2026_09_26_13_group_1

- [ ] PROPER EXAMPLE: React Component Elements vs Direct Function Invocations pattern: #2026_09_26_06_group_1 revised by #2026_09_26_20_group_1

> [!PRINCIPLE]
> **Principle N: Render Components Using JSX Tags, Not Direct Function Calls**
> When mounting a component, write it as a JSX tag like `<ArticleCard />` so React registers the component in its tree. Calling a component as a raw JavaScript function like `{ArticleCard()}` executes the code immediately but bypasses React's lifecycle and hook tracking.
> 
> >> JSX element tag : syntax that tells React to manage a component's lifecycle and render tree presence
> 
> *It is best practice to do this:*
> `function NewsFeed() {`
> `  return (`
> `    <main>`
> `      <ArticleCard />`
> `    </main>`
> `  );`
> `}`
> 
> *Instead of doing this:*
> `function NewsFeed() {`
> `  return (`
> `    <main>`
> `      {ArticleCard()}`
> `    </main>`
> `  );`
> `}`

Notes: Illustrates a deep React runtime invariant rather than a trivial syntax error. Calling a component directly as a function compiles and runs in plain JavaScript, but it prevents React from managing fibers, lifecycles, and hook states. #2026_09_26_06_group_1

- [ ] PROPER EXAMPLE: Contract separation, physical machine tracing, and explicit code titles (two adjacent contracts from the v5 benchmark lecture): #2026_09_26_09_group_1 revised by #2026_09_26_20_group_1 and #2026_09_26_21_group_3

In the v5 benchmark lecture (`01-02-md-LECTURES/v5/04.md#L90-L380`), React's conditional rendering rules are not lazily lumped into a single principle or reduced to a catalog of JavaScript primitives. Instead, they are taught as two distinct architectural contracts:

1. **Principle N: Booleans, Null, and Undefined Render Nothing to Enable Inline Conditionals**
React automatically suppresses boolean values (`true`, `false`), `null`, and `undefined`, rendering zero DOM nodes when they appear inside curly braces. This suppression whitelist enables inline conditional rendering with the logical AND (`&&`) operator without printing boolean words to the screen.

> [!PRINCIPLE]
> **Principle N: Booleans, Null, and Undefined Render Nothing to Enable Inline Conditionals**
> React automatically suppresses boolean values (`true`, `false`), `null`, and `undefined`, rendering zero DOM nodes when they appear inside curly braces. This suppression whitelist enables inline conditional rendering with the logical AND (`&&`) operator without printing boolean words to the screen.
> 
> >> suppression whitelist : React's built-in rule that renders zero DOM nodes for booleans, null, and undefined
> >> inline conditional rendering : using JavaScript logical operators inside JSX to display elements conditionally
> 
> *Use this when the false case should add nothing:*
> `{isUrgent && ( // Concise one-sided condition with &&`
> `  <span className="badge">LIVE</span>`
> `)}`
> 
> *Use this when the absent branch should remain explicit:*
> `{isUrgent ? ( // Explicit no-node branch with a ternary`
> `  <span className="badge">LIVE</span>`
> `) : null}`

2. **Principle N: Guard Numeric Conditionals with Explicit Booleans to Prevent Rogue Zero Output**
React suppresses booleans and nullish values but always renders primitive numbers as living DOM text nodes. When evaluating numeric counters or array lengths with logical AND (`&&`), developers must convert the count to an explicit boolean to prevent rendering an orphaned `0` in the browser.

> [!PRINCIPLE]
> **Principle N: Guard Numeric Conditionals with Explicit Booleans to Prevent Rogue Zero Output**
> React suppresses booleans and nullish values but always renders primitive numbers as living DOM text nodes. When evaluating numeric counters or array lengths with logical AND (`&&`), developers must convert the count to an explicit boolean to prevent rendering an orphaned `0` in the browser.
> 
> >> rogue zero : an unintended visible 0 rendered when a numeric 0 short-circuits in JSX
> >> explicit boolean guard : converting numeric expressions to true or false before evaluating &&
> 
> *We should do this:*
> `{unreadCount > 0 && ( // Guarding count with comparison`
> `  <Badge count={unreadCount} />`
> `)}`
> 
> *We should not do this:*
> `{unreadCount && ( // Passing raw numeric counter`
> `  <Badge count={unreadCount} />`
> `)}`

Both principles walk through the physical machine trace with explicit titles (`title="Component Source"`, `title="Evaluated Expression"`, `title="Browser Render"`, `title="Safe Boolean Comparison"`). Notice the calm, lucid prose: *"It is possible that a developer may assume React hides all falsy values, expecting zero to disappear because it is falsy in JavaScript. Look at what happens when you write a message counter using the `&&` operator..."* Zero robotic parenthetical clutter, zero stiff academic jargon, and clear physical aha moments. #2026_09_26_09_group_1 revised by #2026_09_27_05_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: The robotic bold-parentheses stuffing anti-pattern: #2026_09_26_06_group_1

> [!PRINCIPLE]
> **Principle N: Lift Shared State to the Closest Common Parent**
> We store shared data once in the common parent component that wraps our widgets (**single common parent**). We pass that data down to each child through props so different parts of the screen never show conflicting information (**conflicting, desynchronized values**).

Notes: Fails because it mechanically appends bold parentheses `(**single common parent**)` and `(**conflicting, desynchronized values**)` to the ends of sentences. This robotic tagging clutters prose and degrades the publication's editorial quality. Write fluent English and let the marginal gloss (`>>`) define the formal terms. #2026_09_26_06_group_1

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

Notes: Fails because forgetting the `return` statement is a trivial JavaScript syntax typo, not a React architectural principle. Senior developers and interview candidates do not need a principle warning against forgetting `return`. The principle must contrast declarative UI descriptors against imperative DOM mutations (`document.body.appendChild`). #2026_09_26_06_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: The absurd data conversion strawman: #2026_09_26_06_group_1

> [!PRINCIPLE]
> **Principle N: Render Dynamic Primitives in JSX**
> 
> *It is best practice to do this:*
> <span>{readTime}</span>
> 
> *Instead of doing this:*
> <span>{String(readTime)}</span>

Notes: Fails because React natively renders numbers into text nodes; calling `String(readTime)` produces identical DOM output and is not an authentic architectural mistake. A genuine contrast shows a real failure, such as a raw numeric count on the left of `&&` that prints `0`, or a real choice, such as `&&` for a one-sided addition versus a ternary when the false case has its own output. #2026_09_26_06_group_1 revised by #2026_09_26_21_group_3

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Repetitive monolithic anti-patterns across multiple principles: #2026_09_26_06_group_1

In a component-tree lecture, one principle contrasts components with monolithic HTML in App.jsx, the next contrasts props with the same monolithic HTML, a third contrasts subtrees with it, and a fourth contrasts terminal UI controls with it. #2026_09_26_21_group_3

Notes: Fails because four separate principles are attacking the exact same strawman ("dumping everything into one file"). Each principle must isolate an independent architectural invariant: Dimension 1 (Compositional Boundaries vs Monolithic Templates), Dimension 2 (Unidirectional Downward Props vs Global Window State), Dimension 3 (Logical Component Ownership vs Physical DOM Nesting). #2026_09_26_06_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: The single-sentence compression trap and buzzword train: #2026_09_26_03_group_1

> [!PRINCIPLE]
> **Principle N: Model User Interfaces as Hierarchical Component Trees**
> We structure user interfaces as a **directed hierarchy of nested components**, establishing top-level roots, intermediate branch containers, and terminal UI controls rather than flat, monolithic markup.

Notes: Fails completely. Crams five dense taxonomic categories ("directed hierarchy", "nested components", "top-level roots", "intermediate branch containers", "terminal UI controls") into one breathless run-on sentence. A tired developer hits a wall of abstract jargon before understanding what physical code to write. #2026_09_26_03_group_1

- [ ] PROPER EXAMPLE: Active title with confusing term glossed and concise code:

> [!PRINCIPLE]
> **Principle N: Pass Only Value-Producing Expressions Inside Curly Braces**
> Place exclusively **JavaScript expressions that resolve to a value** inside curly braces, avoiding control-flow statements.
> 
> >> JavaScript expressions that resolve to a value : code that calculates a result you can pass or store (like a ternary or addition)
> >> control-flow statements : code that guides execution flow (like if, for, or while) without producing any value
> 
> *We should do this:*
> `{isSenior ? 'Senior' : 'Staff'}`
> 
> *We should not do this:*
> `{if (isSenior) { 'Senior' }}`

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Authoritarian preachy command:

> [!PRINCIPLE]
> **Principle N: Component Re-Renders Cascade Automatically to All Subtree Descendants**
> You must recognize that updating a parent component re-evaluates all child descendants on that branch (unless memoized), keeping state local to leaf nodes to prevent unnecessary cascading renders.

Notes: Uses authoritarian phrasing ("You must recognize"), introduces state concepts prematurely before props, and fails to operationally explain how to structure the tree.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Abstract academic jargon and buzzwords in comments:

> *It is best practice to do this:*
> `// Vertical prop propagation`
> `<Feed stories={stories} />`
> 
> *Instead of doing this:*
> `// Horizontal cross-component coupling`
> `window.selectedStory = 42;`

Notes: Fails because "Horizontal cross-component coupling" and "Vertical prop propagation" are abstract buzzwords that obscure physical reality. The comments must describe the concrete action: `// Passing data downward through props` vs. `// Storing data on window to bypass props`. #2026_09_26_01_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Vague textbook labels and empty anti-pattern cards:

> *It is best practice to do this:*
> `// Modular architecture`
> `<EditorialFeed><ArticleCard /></EditorialFeed>`
> 
> *Instead of doing this:*
> `// Conflating components with DOM nodes`
> `// Never mounted in a JSX return!`

Notes: Fails on two fronts: (1) uses academic jargon ("Conflating components with DOM nodes"), and (2) leaves the right-hand card completely empty of executable or illustrative code. #2026_09_26_01_group_1

- [ ] PROPER EXAMPLE: Clean white space with zero unnecessary marginalia:

> [!PRINCIPLE]
> **Principle N: Always Close Every Tag Explicitly**
> Every JSX tag is **explicitly terminated**, using a matching closing tag or a self-closing trailing slash.
> 
> *We should do this:*
> `<img src="/photo.jpg" alt="Photo" />`
> 
> *We should not do this:*
> `<img src="/photo.jpg" alt="Photo">`

Notes: Uses direct operational phrasing and self-explanatory English. The left margin is kept clean.

- [ ] PROPER EXAMPLE: Best practice comparison (Pair 2):

> [!PRINCIPLE]
> **Principle N: Group Siblings with React Fragments to Avoid Extra DOM Nodes**
> Adjacent sibling elements are grouped with a **React Fragment** (`<>...</>`) to satisfy the single root requirement without injecting wrapper nodes into the DOM.
> 
> >> React Fragment : ghost container that groups child tags without creating a DOM node
> >> wrapper nodes : extra HTML elements (like a div) added only to hold other elements
> 
> *It is best practice to do this:*
> `return (<><img /><h2 /></>);`
> 
> *Instead of doing this:*
> `return (<div><img /><h2 /></div>);`

- [ ] PROPER EXAMPLE: Card-free callout for a Model or architectural invariant: #2026_09_27_12_group_1

> [!PRINCIPLE]
> **Principle N: Hand React One Container and Expect It to Replace That Container's Contents**
> Give React ownership of one physical DOM element by passing it to `createRoot`. The first time you call `root.render`, React replaces all existing HTML inside that container with your component tree. Any HTML outside that container, such as a static header or footer in `index.html`, remains untouched in the browser.
> 
> >> container element : a physical HTML tag on the page that React takes over to display its component tree
> >> placeholder content : temporary HTML placed inside the container that displays while JavaScript downloads

Notes: When a principle governs an architectural mental model or execution lifecycle rather than a direct in-file syntax choice, the callout box cleanly omits comparative cards entirely. The operational proof (such as observing a placeholder disappear and outside HTML survive in the Elements panel) is demonstrated in titled code blocks in the prose explanation below. #2026_09_27_12_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: The Layer Mismatch Fake Card Anti-Pattern: #2026_09_27_12_group_1

> [!PRINCIPLE]
> **Principle N: Hand React One Container and Expect It to Replace That Container's Contents**
> 
> *It is best practice to do this:*
> `<div id="root"><p>Loading...</p></div>`
> 
> *Instead of doing this:*
> `const root = createRoot(document.body);`

Notes: Fails completely because it invents a fake card pair that contrasts two different languages and files (HTML in index.html vs JavaScript in main.jsx). Comparative cards must represent peer lines of code within the exact same file and language. When no in-file negative alternative exists, omit the cards entirely. #2026_09_27_12_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: The Terminal Command in Code Box Fake Card: #2026_09_27_12_group_1

> [!PRINCIPLE]
> **Principle N: Serve the App Over HTTP Through Vite**
> 
> *We should do this:*
> `npm run dev // Opens http://localhost:5173 with hot reload`
> 
> *We should not do this:*
> `open file:///Users/project/index.html // Blocked by browser CORS policy`

Notes: Fails because it forces terminal CLI commands and desktop shell actions into JavaScript comparative code cards with speech bubbles. Tooling and CLI workflows belong in titled terminal code blocks (```bash) in the section body, not inside principle callout cards. #2026_09_27_12_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: The Identical Code / Comment-Only Difference Fake Card: #2026_09_27_12_group_1

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

Notes: Fails because the code inside both cards is 100% identical; only an artificial comment points to a different file extension. File naming rules belong in the principle definition and explanatory text, not in forced comparative code cards. #2026_09_27_12_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Comments Preceding Code Lines (The Inverted Bubble Trap): #2026_09_27_13_group_1

> [!PRINCIPLE]
> **Principle N: Match Operator to Branch Shape**
> 
> *It is best practice to do this:*
> `// Ternary cleanly presents two alternate choices`
> `{isLive ? <LiveBadge /> : <StaticDate />}`

Notes: Fails because placing the comment line *above* the code causes the speech bubble to render above the code line. Because `.cmt-bubble` has an upward-pointing pointer arrow (`▲`) on its top edge, it points away from the code into the card header or into preceding lines. Comments must ALWAYS be placed at the bottom of the code line (trailing inline: `{isLive ? <LiveBadge /> : <StaticDate />} // Ternary cleanly presents two alternate choices`) so the speech bubble sits directly beneath the code with its arrow pointing up into it. #2026_09_27_13_group_1

### The Targeted Speech-Bubble Comment Canon (The 4 Core Architectural Models) #2026_09_27_06_group_1

Every comment inside a principle code snippet is compiled into a dedicated, line-targeted speech bubble cloud (`.cmt-bubble`) with an upward-pointing pointer arrow (`▲`) aligned with indentation. Authors must use the four canonical models below when framing comparative code cases:

- [ ] PROPER EXAMPLE: Model 1 — Component Hierarchy & JSX Nesting (Syntax / Structure Contrast): #2026_09_27_06_group_1

> [!PRINCIPLE]
> **Principle N: Read the Hierarchy from JSX Nesting, Not from the File**
> The render tree is created by what each component returns in JSX, not by where its function is written in a file. React builds parent-child relationships purely from the element descriptors returned during rendering. Read your component nesting inside returned markup to understand the hierarchy, preventing confusion when moving functions around a file.
> 
> >> render tree : a hierarchy of component element descriptors created by what functions return in JSX
> 
> *We should do this:*
> `function ArticleCard() {`
> `  return (`
> `    <article className="card">`
> `      <EditorialByline /> // Putting this tag inside article makes it a child component`
> `    </article>`
> `  );`
> `}`
> 
> *We should not do this:*
> `function EditorialByline() { // Writing this function first does not make it a parent`
> `  return <span>By Clara</span>;`
> `}`
> `function ArticleCard() { // Order in the file has no effect on component hierarchy`
> `  return <article className="card" />;`
> `}`

Notes: Comments attach directly to the lines that demonstrate the rule. The positive comment explains why `EditorialByline` is a child (it is nested inside the JSX return). The negative comments explain why declaring a function first does not make it an ancestor.

- [ ] PROPER EXAMPLE: Model 2 — Layout Decomposition into Root, Branch, and Leaf (Architecture Contrast): #2026_09_27_06_group_1

> [!PRINCIPLE]
> **Principle N: Decompose a Monolithic Layout into Root, Branch, and Leaf Components**
> Decompose a layout into root, branch, and leaf components, giving each component a single clear responsibility. React lets you compose small components into larger structures without adding extra HTML wrappers or slowing down rendering. Extract a section of markup once it represents a distinct concern or grows its own logic, avoiding both 500-line monoliths and one-tag component clutter.
> 
> >> separation of concerns : assigning each component a single focused task in the user interface
> 
> *It is best practice to do this:*
> `function App() {`
> `  return <div className="app">`
> `    <NewsHeader /> // Shows the newspaper title at the top`
> `    <EditorialFeed /> // Shows the list of articles`
> `  </div>;`
> `}`
> 
> *Instead of doing this:*
> `function App() {`
> `  return <div className="app">`
> `    <header> // Header markup is written directly inside App`
> `      <h1>The National Times</h1>`
> `    </header>`
> `    <main> // Article markup is hardcoded here`
> `      <article><h3>Accord</h3></article>`
> `    </main>`
> `  </div>;`
> `}`

Notes: Explains what each branch does in plain human language ("Shows the newspaper title at the top") without corporate jargon ("masthead branding"). Shows the anti-pattern as concrete inlined markup cluttering the root. Compact 5-to-10 line snippets guarantee both cards fit on one page.

- [ ] PROPER EXAMPLE: Model 3 — Top-Down Render Walk (Execution Sequence Contrast): #2026_09_27_06_group_1

> [!PRINCIPLE]
> **Principle N: Expect Rendering to Walk the Tree from the Root Down**
> React visits the component tree strictly from the root downward during rendering. The runtime calls the root component first and evaluates a child only after its parent returns an element descriptor for it. Trace your component execution top-down from parent to child, remembering that a child never runs independently of its parent.
> 
> >> top-down render walk : the execution sequence where React evaluates parents before their children
> 
> *We should do this:*
> `function EditorialFeed() {`
> `  console.log("1. Feed runs"); // React runs this parent function first`
> `  return <main><ArticleCard /></main>; // Returning this tag tells React to run ArticleCard next`
> `}`
> `function ArticleCard() {`
> `  console.log("2. Card runs");`
> `  return <article>Dispatch</article>;`
> `}`
> 
> *We should not do this:*
> `function EditorialFeed() {`
> `  return <main>Feed offline</main>; // Parent omits child tag from JSX`
> `}`
> `function ArticleCard() { // Never runs: child cannot execute on its own`
> `  return <article>Dispatch</article>;`
> `}`

Notes: Both cards use symmetrical, concrete code. The positive card logs numbers and explains why the child runs next. The negative card shows the omitted tag and explains why the child function never executes. Never leave the counter-example empty.

- [ ] PROPER EXAMPLE: Model 4 — Unidirectional Data Flow via Closest Common Ancestor (Data Path Contrast): #2026_09_27_06_group_1

> [!PRINCIPLE]
> **Principle N: Route Shared Data Through the Closest Common Ancestor**
> Data travels only along parent-child edges from the top down. React provides no horizontal communication pathways between sibling components in the render tree. Place shared data in the closest common ancestor and pass it down each branch, avoiding broken variable references between siblings.
> 
> >> closest common ancestor : the lowest component in the tree that sits above all components needing shared data
> 
> *It is best practice to do this:*
> `function App() {`
> `  const edition = "Morning"; // Parent holds data so both children can share it`
> `  return (`
> `    <div>`
> `      <NewsHeader edition={edition} /> // Sends edition down to the header`
> `      <Feed edition={edition} /> // Sends edition down to the feed`
> `    </div>`
> `  );`
> `}`
> 
> *Instead of doing this:*
> `function EditorialFeed() {`
> `  const edition = "Morning"; // edition is defined inside Feed, so only Feed can see it`
> `  return <main>Feed</main>;`
> `}`
> `function NewsHeader() {`
> `  return <header>{edition}</header>; // Crash: NewsHeader cannot reach variables inside Feed`
> `}`

Notes: Explains the exact failure mode ("Crash: NewsHeader cannot reach variables inside Feed"). The positive card demonstrates clean downward routing through props.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Glossing words not present in the definition:

> [!PRINCIPLE]
> **Principle N: Values in JSX**
> Booleans and null render nothing in JSX, while numbers print.
> 
> >> primitive : a fundamental data value in JavaScript that is not an object
> >> lexical scope : region of code where variable names are evaluated

Notes: Fails because neither "primitive" nor "lexical scope" appears in the definition sentence.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Untranslated Map Text (Textbook Transcription): #2026_09_27_04_group_1

> [!PRINCIPLE]
> **Principle N: Pass Elements as Children Props**
> Whatever JSX you nest between a component's tags arrives in props under the key children. React packages nested elements into the exact same props object as regular attributes. This allows a container to accept dynamic content without dictating what that content must be.

Notes: Misses Step 2. Transcribes the map's draft text directly without translating it into natural, easy-to-read prose. Phrases like "Whatever JSX you nest...", "arrives in props", and "dictating" read like dense textbook specifications rather than clear spoken instruction.

- [ ] PROPER EXAMPLE: Information Translated to Easy-to-Read Language: #2026_09_27_04_group_1

> [!PRINCIPLE]
> **Principle N: Pass Elements as Children Props**
> When you place elements between a component's tags, React passes them to that component as a prop named children. React packages nested markup into the exact same props object as regular attributes. This allows a container to display dynamic content without hardcoding what that content must be.

Notes: Fulfills both steps. Extracted the core mechanism from the map in Step 1, then translated it in Step 2 into easy-to-read, easy-to-understand conversational English using active everyday verbs ("place", "passes") and clear sentence structure.

### The Principle Explanation Canon (Benchmark Pedagogical Patterns from Lesson 04) #2026_09_26_18_group_1

- [ ] PROPER EXAMPLE: The Grammar / Compiler Proof Pattern (v5 benchmark, Lesson 04): #2026_09_26_18_group_1 revised by #2026_09_26_21_group_3

Deconstructs a syntax error by explaining the underlying language grammar rather than memorizing rules. Opens with developer frustration, shows the compiler's function call mapping, poses a rhetorical JavaScript grammar proof, and demonstrates the valid expression resolution.

```markdown
Developers often wonder why they cannot write familiar control-flow statements like `if (isUrgent) { ... }` inside JSX curly braces. It feels frustrating because `if` statements are fundamental building blocks of JavaScript.

The reason is rooted in standard JavaScript grammar, not a limitation invented by React. Under the hood, every JSX tag compiles into a standard JavaScript function call. When you write `<span className="badge">{ ... }</span>`, the compiler turns it into `_jsx("span", { children: ... })`.

In JavaScript, function arguments and object properties must be **expressions**—units of code that evaluate to a single value. Look at what happens if the compiler allowed an `if` statement inside the curly braces:

```jsx title="Compiler Output"
// What the compiler would have to generate:
_jsx("span", {
  children: if (isUrgent) { "URGENT" } // SyntaxError: statement forbidden
});
```

Would you ever write `console.log(if (isUrgent) { "URGENT" })` in normal JavaScript? Of course not! Standard JavaScript throws `SyntaxError: Unexpected token 'if'` because statements produce no value and cannot be passed into functions.

To display conditional text, you must use an expression that evaluates to a value. A ternary operator (`isUrgent ? "URGENT" : "STANDARD"`) evaluates to a single concrete string, which JavaScript happily passes to the function:

```jsx title="Compiler Output"
_jsx("span", {
  children: isUrgent ? "URGENT" : "STANDARD" // Valid: passes single expression
});
```
```

Notes: Zero cookie-cutter numbered lists. Creates an undeniable "aha moment" through JavaScript grammar deduction. #2026_09_26_18_group_1

- [ ] PROPER EXAMPLE: The Runtime Evaluation Walkthrough Pattern (v5 benchmark, Lesson 04): #2026_09_26_18_group_1 revised by #2026_09_26_20_group_1 and #2026_09_26_21_group_3

Deconstructs an authentic runtime defect (the Rogue Zero bug). Walks through JavaScript `&&` operator short-circuiting, contrasts stringification vs DOM text node rendering, explains why numbers are kept alive, and provides the three production remedies.

```markdown
It is possible that a developer may assume React hides all falsy values, expecting zero to disappear because it is falsy in JavaScript. Look at what happens when you write a message counter using the `&&` operator:

```jsx title="Component Source"
const unreadCount = 0; // Numeric count initialized to zero

<div>
  {unreadCount && <Badge count={unreadCount} />} // Evaluates left side zero
</div>
```

When there are no new messages, `unreadCount` is `0`. A developer may naturally think: *"Zero is falsy. Since React hides falsy values, nothing will show up inside the `<div>`."* But that intuition clashes with how JavaScript evaluates expressions.

Watch what JavaScript actually does:
1. JavaScript evaluates the left side of `&&`: `unreadCount`.
2. In JavaScript, `0` is a falsy value.
3. Because the left side is falsy, the `&&` operator stops immediately and returns that left-hand value: **the number `0`**.
4. The code inside the container becomes `{0}`.

Now React inspects what is inside the `<div>`:
- Is it `true` or `false`? **No.**
- Is it `null`? **No.**
- Is it `undefined`? **No.**
- It is a **number** (`0`).

React hides booleans, but it **never hides numbers**. In user interfaces, the number zero is important data—a bank balance of `$0`, a shopping cart with `0` items, or a game score of `0` must be visible to the user. Because `0` is a number, React creates a real browser text node:

```html title="Browser Render"
<div>0</div> <!-- Renders rogue zero as living text node! -->
```

Instead of an empty container, the browser paints a literal **`0`** on the screen! The bug happened because JavaScript gave React a **number** (`0`), not a **boolean** (`false`). To make the element disappear cleanly, you must make sure the left side of the `&&` evaluates to a real boolean. You have three production choices:

First, convert the count with a comparison operator (`> 0`):
```jsx title="Safe Boolean Comparison"
<div>{unreadCount > 0 && <Badge count={unreadCount} />}</div>
```

Second, cast the number explicitly using `Boolean()`:
```jsx title="Explicit Boolean Cast"
<div>{Boolean(unreadCount) && <Badge count={unreadCount} />}</div>
```

Third, use an explicit ternary operator that returns `null` for the empty state:
```jsx title="Ternary with Null"
<div>{unreadCount > 0 ? <Badge count={unreadCount} /> : null}</div>
```
```

Notes: The numbered list here is used exclusively where it belongs—tracing the exact 4-step short-circuiting of the `&&` operator in JavaScript—rather than being stamped as a generic 1-to-5 checklist across the entire lecture. #2026_09_26_18_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: The Cookie-Cutter Numbered List & Comment Shouting Anti-Pattern: #2026_09_26_18_group_1

Stamping the identical 5-part structure onto every single principle, ending each principle with an identical 5-item numbered list (`Watch how the runtime executes: 1. React does X, 2. React does Y, 3. React does Z, 4. React does W, 5. React climbs up`), while shouting with markdown bolding inside code comments (`// Top-level **ROOT**`, `// Layout **BRANCH**`, `// Missing </header> **TAG**`).

Notes: Fails because it replaces genuine pedagogical insight with bureaucratic form-filling. Code comments should use natural English without markdown asterisks, and the pedagogical format must emerge organically from the mechanism. #2026_09_26_18_group_1

## Principle Anatomy & Formatting | 05 | Approved Map Traceability and Content-Driven Coverage #2026_09_25_03_group_1 revised by #2026_09_25_07_group_1, #2026_09_26_19_group_1, and #2026_09_26_20_group_1

- [ ] Do the lecture's principles and their order come directly from the approved `01-01-map-principles/{nn}.md`, leaving discovery, ownership, and selection to the `map-principles` workflow? #2026_09_26_19_group_1 revised by #2026_09_26_20_group_1 and #2026_09_26_21_group_2
- [ ] Does the lecture preserve one-to-one coverage by expanding every approved operational decision without merging distinct entries or splitting one entry into redundant principles? #2026_09_25_07_group_1 revised by #2026_09_26_09_group_1 and #2026_09_26_19_group_1
- [ ] Is the depth and number of explanatory points following each principle flexible and pertinent to the complexity of the mechanism, permanently abolishing fixed quotas (such as "always exactly 2 bullets" or "always exactly 3 bullets")?
- [ ] Does each principle receive the exact pedagogical substrate it warrants—whether a 3-layer architectural breakdown, an AST transformation snippet, an engine diagram, or a focused two-point deduction?
- [ ] Does the text avoid padding trivial principles with filler points or artificially compressing deep principles to hit an arbitrary bullet count?

## Pedagogical Substrate | 06 | Tangible Accompaniments & Term Analysis #2026_09_24_04_group_1

- [ ] Is every principle accompanied by tangible pedagogical substrates that make the underlying mechanic immediately concrete and visual?
- [ ] Is every principle card followed by dedicated analytical prose that rigorously deconstructs each load-bearing technical term present in the definition?
- [ ] When a principle touches multiple platform boundaries, is a structured breakdown used (e.g. 1. HTML markup layer, 2. ECMAScript language layer, 3. Browser DOM layer)?
- [ ] For counter-intuitive rules or complex syntax, are direct interview questions explicitly posed and answered?
- [ ] Does the text avoid flat, single-paragraph summaries that merely restate the principle card without term deconstruction?
- [ ] Are comparative markdown tables, right/wrong code editors, and standalone HTML figures provided where spatial arrangements or compilation pipelines require visual intuition?

- [ ] PROPER EXAMPLE: Comprehensive analytical substrate: #2026_09_26_21_group_3

In a JSX grammar lecture:
1. The attribute-naming principle uses a 3-layer breakdown: 1. HTML Attributes (Markup Text), 2. JavaScript Reserved Keywords (Language Grammar), 3. Browser DOM Properties (Living Objects).
2. A principle with counter-intuitive syntax poses and answers the senior interview questions it raises (for an inline `style` object: 1. Why double curly braces? 2. Why camelCase keys?).
3. The accessibility-attribute explanation analyzes the physical DOM difference between Property Assignment (`domNode.className = ...`) and Attribute Assignment (`domNode.setAttribute('aria-label', ...)`).
4. The attribute rules are synthesized into a comprehensive 3-column comparative reference table contrasting HTML naive paste vs React JSX vs Interview takeaway.
5. Transpiled code blocks directly follow JSX code blocks, showing the exact `_jsx()` output.
6. Figure `04-00-jsx-root-and-fragments.html` visually contrasts a bloated DOM tree with extra wrapper divs against a clean containerless DOM tree using React Fragments.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Bare assertion without substrate:

Stating "Principle N: Attributes are camelCase" followed by two sentences of text and no code block, no table, no runtime breakdown, and no transpiled output.

Notes: Forces the student to memorize arbitrary rules rather than understanding browser engine mechanics.

## Interview Stance & Cognitive Framing | 07 | Senior Candidate Interview Framing Standard #2026_09_24_02_group_1

- [ ] Is every principle framed from the perspective of an engineering candidate preparing for a senior or staff technical interview?
- [ ] Are superficial candidate answers contrasted with authoritative platform reality (W3C specifications, ECMAScript parser boundaries, engine implementations)?
- [ ] Are `> [!TIP]` callouts titled `**To impress the interviewer:**` included to distill complex behavior into memorable interview talking points?
- [ ] Are `> [!WILD]` callouts reserved for counter-intuitive edge cases, unexpected platform surprises, or engine side-effects, avoiding repetition of already-taught material?

- [ ] PROPER EXAMPLE: Authoritative interview framing:

> [!TIP]
> **To impress the interviewer:** When asked why React uses `className` instead of `class`, avoid saying "because `class` is a reserved word in JavaScript." Modern JavaScript engines easily allow reserved words as object keys. The true reason is **DOM Property Alignment**: React's JSX transpiler maps attributes directly to properties on living browser DOM nodes (`element.className`), not raw HTML markup strings. In 1998, the W3C DOM Level 1 specification chose `className` to prevent collisions in early browsers, and React aligns with that established browser standard.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Naive superficial answer:

"Remember to use className in React, because class is reserved in JS. It's just how React works."

Notes: Gives a naive answer that fails senior engineering interviews and fails to explain browser DOM architecture.

## Universal Authoring Template | 08 | Universal Principle-Based Lesson Template & Lecture 4 Benchmark #2026_09_25_03_group_1

- [ ] Is every principle-based lecture assembled adhering to this universal structural blueprint:
    1. **Title & Question**: `# Lecture {n}: {Clear Title}` on line 1; `> INTERVIEW QUESTION | ❱ CORE | ...` on line 2.
    2. **The 7-Beat Problem Ladder**: Numbered beats 1 to 7 establishing a high-stakes newsroom failure caused by missing the principle.
    3. **Problem Setup Section**: `### {Catchy Problem Heading}` showing naive code and the immediate compiler error or runtime defect.
    4. **Theoretical Introduction Section**: `### {Theoretical Concept}` (such as *What is a React Component?* or *The Three Trees Model*) providing complete theoretical introduction and mental model grounding before principles.
    5. **Principle-Based Section**: `### Principles of React: {Topic}`:
       - Opening framing distinguishing theory from practical application.
       - Continuously numbered principles: `> [!PRINCIPLE]` with `Principle 1`, `Principle 2`, ... `Principle N` (one per approved map entry, operational definitions). #2026_09_26_21_group_3
       - For each approved map entry: Title, Operational Definition, the review case warranted by its evidence, engine derivation, and tailored accompaniments. #2026_09_26_19_group_1
       - Comparative summary table consolidating all rules.
       - Transpiled compiler output comparing JSX source to raw JavaScript `_jsx()` calls.
    6. **Zero-New-Concept Practical Example**: `### Let's Design a Practical Example`:
       - Stage A: ` ```components ` and ` ```files `.
       - Stage B: Assembly Pipeline Figure (`figures/{NN}-01-...html`).
       - Stage C: Sequential Assembly Steps 1 through 4 (accompanied by **Meaningful Pedagogical Commentary** explaining architectural lessons rather than mechanical line mapping).
       - Stage D: `### Component Summary` with Role Mode panel.
       - Stage E: Architecture Audit Table (`figures/{NN}-02-...html`).
    7. **Terminal Digests (Zero Knowledge Gaps)**:
       - `### Where you will meet this` (real-world scenarios).
       - `### Glossary` (definitions of bolded terms introduced earlier in text; zero orphan terms).
       - `## Beyond the basics` (4 to 6 live official documentation links).
       - `### Summary` (decision rules `➔` and right/wrong takeaways).
       - Closing Comparative Table.
- [ ] Is Lecture 4 (`01-02-md-LECTURES/v5/04.md#L90-L380`) referenced as the canonical living benchmark for principle-based lessons, setting the standard for lucid B2 English, the 3-beat physical machine trace, and explicit code fence titles, while its own principle set and numbering decide nothing about any lesson's principle map? #2026_09_26_09_group_1 revised by #2026_09_26_19_group_1 and #2026_09_26_21_group_3
