---
name: principled-theory
description: Governs the authoring of independent, complete, principle-based theory sections, zero-new-concept case studies, and interview-framed pedagogy across React lectures.
---

# Principled Theory

This skill governs the authoring of principle-based curriculum analysis: constructing an independent, complete theory section before the practical example, maintaining zero new concepts across case studies and terminal sections, structuring principles with canonical callout syntax and dual comparative cases, providing tangible accompaniments (tables, diagrams, code blocks, bullet breakdowns), and framing every mechanism from the perspective of an engineering candidate preparing for a senior technical interview.

Digests: `01-02-md-LECTURES/04.md` (the canonical benchmark for principle-based lessons) and `skills/v6.0/lecture-structure/SKILL.md`.

## Architectural Philosophy | 01 | Theory-First Foundation and Autonomous Principles #2026_09_25_03_group_1

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
> **Principle 1: Produce a Single Root Element**
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
- [ ] Is the case study restricted entirely to synthesizing, assembling, and exercising the principles formally introduced and explained in the theory section?
- [ ] If a property (e.g. `aria-label`, `tabIndex`, `style`), helper function, or syntax pattern appears in a practical example component, was it explicitly analyzed as a principle in the preceding theory?
- [ ] Does Stage C avoid introducing ungrounded syntax during assembly steps?

- [ ] PROPER EXAMPLE: Case study strictly exercising taught principles:

In Lecture 4, the case study builds `NewsAlert.jsx`. Every feature in `NewsAlert.jsx`—the outer container `<div>` (Principle 1), self-closing `<img />` and `<input />` (Principle 3), `className` (Principle 4), `htmlFor` (Principle 4), `tabIndex={1}` (Principle 5), `style={{ ... }}` with camelCase keys (Principle 6), `{/* comment */}` (Principle 7), and `aria-label="Subscribe"` (Principle 8)—was explicitly taught as a standalone principle in the preceding theory. Zero ungrounded syntax is introduced in the component code.

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

In Lecture 4's Glossary, every defined term—Abstract Syntax Tree (AST), JSX Transform, React Fragment, Single Root Invariant, DOM Property Alignment, Self-Closing Tag—was explicitly unpacked during the explanation of Principles 1 through 9.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Introducing orphan terms in downstream sections:

Adding "SyntheticEvent" or "Reconciliation Fiber" into the Glossary of Lecture 4 when those concepts were not introduced or analyzed in the body of the lecture.

Notes: A glossary that introduces orphan terms confuses the student and breaks curriculum linearity.

## Principle Anatomy & Formatting | 04 | Operational Principle Definitions and Comparative Cases #2026_09_25_03_group_1

- [ ] Is every principle formatted as a dedicated callout block using the `> [!PRINCIPLE]` tag?
- [ ] Are principle titles and definitions formulated as direct operational statements articulating the exact architectural choice, physical browser/engine mechanics, and the real-world bug prevented?
- [ ] Are authoritarian commands and preachy negative phrasing ("you must do this", "you must recognize", "must do that") strictly removed in favor of calm, operational educator statements ("We organize...", "We pass...", "Components return...")?
- [ ] Are passive academic noun clusters (such as "Client Subpath Import Invariant" or "Zero-DOM Fragmentation") replaced with active, memorable operational guidance (e.g. `Principle 1: Always Import createRoot from react-dom/client` or `Principle 5: Subtrees Form Natural Isolation Boundaries That Protect Sibling Nodes`)?
- [ ] Does the principle header use bold continuous numbering: `> **Principle N: Active Descriptive Title**`?
- [ ] Is the principle definition stated on the next line as a clear operational statement articulating the platform rule and its physical engine consequence?
- [ ] Are marginal glosses (`>> phrase : explanation`) used selectively, only when a genuinely confusing or load-bearing technical concept appears in the definition?
- [ ] Are self-evident words and everyday conversational English left without glosses, maintaining clean white space?
- [ ] When a gloss is used, is the phrase on the left of the colon an exact verbatim substring from the definition sentence, decoding the hurdle without introducing outside textbook jargon?
- [ ] Are comparative code cases provided using approved pedagogical pairs:
    * Pair 1 (Syntax / Language Validity): `*We should do this:*` / `*We should not do this:*` (used when contrasting valid code against compiler crashes, syntax errors, or runtime failures).
    * Pair 2 (Best Practice / Idiomatic Architecture): `*It is best practice to do this:*` / `*Instead of doing this:*` (used when both snippets run, but one represents clean idiomatic architecture while the other introduces pitfalls or memory bloat).
- [ ] Are code snippets in principle cards full-width, badge-aligned, and kept strictly within 40 characters per line (breaking long imports or JSX attributes across indented lines) without mid-line wrapping? #2026_09_26_01_group_1
- [ ] Are comments in principle code snippets formulated as short, visceral action pairs (active verb phrases contrasting the physical code action, such as `// Composing custom React components` vs. `// Dumping raw HTML tags`)? #2026_09_26_01_group_1
- [ ] Are abstract academic buzzwords and disembodied labels (such as "Horizontal cross-component coupling", "Conflating components with DOM nodes", "Monolithic entanglement", or "Rigid coupling") strictly avoided in code comments and subtitles? #2026_09_26_01_group_1
- [ ] Are both comparative code cards symmetrical and populated with real, runnable code, ensuring the anti-pattern demonstrates the actual physical code mistake rather than an empty placeholder or comment-only box? #2026_09_26_01_group_1
- [ ] Do code snippets preserve standard 2-space JSX nesting, proper newlines, closing brackets on separate lines, and registered filenames from the lecture tree? #2026_09_26_01_group_1
- [ ] Are JSX return statements in code cases wrapped in parentheses? #2026_09_24_03_group_1

- [ ] PROPER EXAMPLE: Visceral action-paired comments and symmetrical component comparisons:

> [!PRINCIPLE]
> **Principle 2: Distinguish the Component Render Tree from the Browser DOM Tree**
> We conceptualize the **component render tree as a logical hierarchy of React elements**, completely decoupled from the physical HTML tags rendered in browser memory.
> 
> >> component render tree : the logical hierarchy of React components that models application structure
> >> browser DOM tree : the platform-specific tree of living C++ HTML element nodes rendered by the browser engine
> 
> *It is best practice to do this:*
> `// Composing custom React components`
> `<NewsLayout>`
> `  <SiteHeader />`
> `  <FeedGrid />`
> `</NewsLayout>`
> 
> *Instead of doing this:*
> `// Dumping raw HTML tags`
> `<div className="layout">`
> `  <header><h1>News</h1></header>`
> `  <div className="grid">...</div>`
> `</div>`

Notes: Uses concrete, visceral action phrases (`Composing custom React components` vs. `Dumping raw HTML tags`) that describe what is physically written on the page, with symmetrical code blocks under 40 characters. #2026_09_26_01_group_1

- [ ] PROPER EXAMPLE: Symmetrical comparison illustrating disk imports vs runtime rendering:

> [!PRINCIPLE]
> **Principle 3: Separate the Component Render Tree from the Module Dependency Tree**
> We distinguish the **runtime render tree formed by component composition** from the static module graph formed by file import statements.
> 
> *It is best practice to do this:*
> `// JSX composition mounts the UI`
> `<EditorialFeed>`
> `  <ArticleCard />`
> `</EditorialFeed>`
> 
> *Instead of doing this:*
> `// Disk imports alone do not render UI`
> `import ArticleCard`
> `  from './ArticleCard.jsx';`
> `// Never mounted in a JSX return!`

Notes: The anti-pattern contains actual code (the unmounted disk import broken across two lines to satisfy the 40-character line width budget), not an empty card. #2026_09_26_01_group_1

- [ ] PROPER EXAMPLE: Active title with confusing term glossed and concise code:

> [!PRINCIPLE]
> **Principle 2: Pass Only Value-Producing Expressions Inside Curly Braces**
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
> **Principle 5: Component Re-Renders Cascade Automatically to All Subtree Descendants**
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
> **Principle 3: Always Close Every Tag Explicitly**
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
> **Principle 2: Group Siblings with React Fragments to Avoid Extra DOM Nodes**
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

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Glossing words not present in the definition:

> [!PRINCIPLE]
> **Principle 5: Values in JSX**
> Booleans and null render nothing in JSX, while numbers print.
> 
> >> primitive : a fundamental data value in JavaScript that is not an object
> >> lexical scope : region of code where variable names are evaluated

Notes: Fails because neither "primitive" nor "lexical scope" appears in the definition sentence.

## Principle Anatomy & Formatting | 05 | Content-Driven Principle Count & Anti-Minimization Standard #2026_09_25_03_group_1 revised by #2026_09_25_07_group_1

- [ ] Is the number of principles strictly derived from the topic's inherent architectural invariants and failure modes in `01-01-map/{nn}.md`, establishing one principle per distinct platform law (e.g. 3, 4, 5, 6, 7, 8) rather than following arbitrary quotas? #2026_09_25_07_group_1
- [ ] Is the Minimization / Lazy Collapse Fallacy avoided: ensuring the author does NOT lazily compress a rich, multi-invariant topic (such as Q01's 5 foundational mental shifts or Q04's 8 JSX grammar laws) down to 2 or 3 principles? #2026_09_25_07_group_1
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

- [ ] PROPER EXAMPLE: Comprehensive analytical substrate:

In Lecture 4:
1. Principle 4 uses a 3-layer breakdown: 1. HTML Attributes (Markup Text), 2. JavaScript Reserved Keywords (Language Grammar), 3. Browser DOM Properties (Living Objects).
2. Principle 6 poses and answers the two senior interview questions: 1. Why double curly braces? 2. Why camelCase keys?
3. Principle 8 analyzes the physical DOM difference between Property Assignment (`domNode.className = ...`) and Attribute Assignment (`domNode.setAttribute('aria-label', ...)`).
4. Principles 4 through 8 are synthesized into a comprehensive 3-column comparative reference table contrasting HTML naive paste vs React JSX vs Interview takeaway.
5. Transpiled code blocks directly follow JSX code blocks, showing the exact `_jsx()` output.
6. Figure `04-00-jsx-root-and-fragments.html` visually contrasts a bloated DOM tree with extra wrapper divs against a clean containerless DOM tree using React Fragments.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Bare assertion without substrate:

Stating "Principle 5: Attributes are camelCase" followed by two sentences of text and no code block, no table, no runtime breakdown, and no transpiled output.

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
       - Continuously numbered principles: `> [!PRINCIPLE]` with `Principle 1`, `Principle 2`, ... `Principle N` (adaptable count, operational definitions).
       - For each principle: Title, Operational Definition, Do/Don't or Best Practice cases, engine derivation, and tailored accompaniments.
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
- [ ] Is Lecture 4 (`01-02-md-LECTURES/04.md`) referenced as the canonical golden benchmark for principle-based lessons?
