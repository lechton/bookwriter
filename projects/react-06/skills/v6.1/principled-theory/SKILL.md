---
name: principled-theory
description: Governs the authoring of independent, complete, principle-based theory sections, zero-new-concept case studies, and interview-framed pedagogy across React lectures.
---

# Principled Theory

This skill governs the authoring of principle-based curriculum analysis: constructing an independent, complete theory section before the practical example, enforcing the zero-new-concept invariant across case studies and terminal sections, structuring principles with canonical callout syntax and dual comparative cases, providing tangible accompaniments (tables, diagrams, code blocks, bullet breakdowns), and framing every mechanism from the perspective of an engineering candidate preparing for a senior technical interview.

Digests: `01-02-md-LECTURES/04.md` (the canonical benchmark for principle-based lessons) and `skills/v6.0/lecture-structure/SKILL.md`.

## Architectural Philosophy | 01 | Autonomous and Complete Theory Law #2026_09_24_02_group_1

[ ] Author the theory section (`### Principles of React: {Topic}`) as an entirely independent, self-contained, and comprehensive body of knowledge structured with numbered `> [!PRINCIPLE]` callouts.
[ ] Ensure every underlying compiler transformation, language grammar invariant, DOM interface requirement, and execution edge case is fully unpacked and justified in the theory section before the practical example begins.
[ ] Enable an interview candidate to master 100% of the topic's mental model and pass technical examination purely from reading the theory section alone, without needing the practical example to clarify basic mechanics.
[ ] Ban deferring foundational explanations to later sections: never write "we will see how this works in the practical example" or leave a syntax rule unjustified in the theory.

```markdown
PROPER EXAMPLE:
### Principles of React: The Core Laws of JSX Grammar

To prepare for any technical interview, we must separate theory from application and establish the nine fundamental laws governing the React compiler. In JSX, HTML markup strings do not exist. Every tag, attribute, inline style, and comment is transformed into JavaScript function calls and plain JavaScript objects. We formalize these rules into nine standalone principles.

> [!PRINCIPLE]
> **Principle 1: Single Root Invariant**
> Every JSX component return statement must produce exactly **one root element** or container.
> 
> *We should do this:*
> `return (<div><img /><h2 /></div>);`
> 
> *We should not do this:*
> `return (<img /><h2 />);`

A React component is a standard JavaScript function. In JavaScript, a `return` statement can only return a single value or expression. When you write two adjacent tags at the root level, JavaScript cannot evaluate them as a single expression. Under the hood, JSX compiles into `_jsx(type, props)` function calls. Just as you cannot return two separate function calls without wrapping them in an array or container object, you cannot return adjacent JSX tags.
```

```markdown
HALF WAY EXAMPLE:
### JSX Rules
In React, there are several rules like single roots and closing tags. We'll introduce these briefly, and then explore them in depth through our newsroom case study.
```
*Note: A half-way example outlines the rules at a high level but defers the actual architectural derivation and compiler mechanics to the case study, violating the autonomous theory law.*

```markdown
COUNTER-EXAMPLE:
### Introduction to JSX
JSX lets you write HTML in JavaScript. Let's start building our newsroom component right away to see how JSX works in practice!
```
*Note: A counter-example skips principled theory entirely and forces the reader to discover platform mechanics by trial and error inside application code.*

## Scope & Invariant Isolation | 02 | The Zero-New-Concept Case Study Law #2026_09_24_02_group_1

[ ] Enforce that the practical example / case study (`### Let's Design a Practical Example`, Stages A through E) introduces strictly ZERO new concepts, terms, properties, hooks, or syntax rules.
[ ] Restrict the case study entirely to synthesizing, assembling, and exercising the principles that were already formally baptized and mechanically explained in the theory section.
[ ] If a property (e.g. `aria-label`, `tabIndex`, `style`), helper function, or syntax pattern appears in a practical example component, verify that it was explicitly analyzed as a principle in the preceding theory. If it was not taught in theory, either introduce it as a principle in the theory section first or remove it from the case study code.
[ ] Treat any appearance of ungrounded syntax in Stage C assembly steps as a critical pedagogical defect.

```markdown
PROPER EXAMPLE:
In Lecture 4, the case study builds `NewsAlert.jsx`. Every single feature in `NewsAlert.jsx`—the outer container `<div>` (Principle 1), the self-closing `<img />` and `<input />` (Principle 3), `className` (Principle 4), `htmlFor` (Principle 4), `tabIndex={1}` (Principle 5), `style={{ ... }}` with camelCase keys (Principle 6), `{/* comment */}` (Principle 7), and `aria-label="Subscribe"` (Principle 8)—was explicitly taught as a standalone principle in the preceding theory. Zero ungrounded syntax is introduced in the component code.
```

```markdown
COUNTER-EXAMPLE:
In the theory section, the author only explains single root elements and closing tags. Then in Step 3 of the practical example, the author suddenly writes `<input tabIndex={0} aria-label="Search" style={{ display: 'none' }} />` without ever having explained why `tabindex` is camelCase, why `aria-label` retains hyphens, or why `style` takes double curly braces.
```
*Note: The counter-example forces the reader to confront novel, unexplained syntax during practical assembly, destroying the clarity of the guided build.*

## Terminal Digests Fidelity | 03 | Zero-New-Concept Terminal Sections Law #2026_09_24_02_group_1

[ ] **The Closed-World Lexicon Law**: Enforce that downstream terminal digest sections—`### Where you will meet this`, `### Glossary`, `## Beyond the basics`, `### Summary`, the closing comparison table, and the ad-hoc marginal notes—introduce strictly NO new concepts, terms, or unbaptized classifications. The Theory section establishes the entire universe of discourse; terminal sections synthesize and ground only what was already formally taught.
[ ] Use `### Where you will meet this` exclusively to ground the already-introduced principles into concrete professional engineering contexts (e.g. newsroom breaking dispatches, multi-column editorial desks, e-commerce checkouts).
[ ] Restrict `### Glossary` entries strictly to terms that were explicitly introduced and bolded in the lecture body.
[ ] Use `## Beyond the basics` to point candidates to official documentation links (`https://react.dev/...`) that deepen the exact principles taught in the chapter, rather than introducing unrelated peripheral APIs.
[ ] Ensure `### Summary` distills the principles into crisp decision rules (`➔`) and right/wrong takeaways without introducing fresh syntax.

```markdown
PROPER EXAMPLE:
In Lecture 4's Glossary, every defined term—Abstract Syntax Tree (AST), JSX Transform, React Fragment, Single Root Invariant, DOM Property Alignment, Self-Closing Tag—was explicitly unpacked during the explanation of Principles 1 through 9.
```

```markdown
COUNTER-EXAMPLE:
Adding "SyntheticEvent" or "Reconciliation Fiber" into the Glossary of Lecture 4 when those concepts were never mentioned or baptized in the body of the lecture.
```
*Note: A glossary that introduces orphan terms confuses the student and breaks curriculum linearity.*

## Principle Anatomy & Formatting | 04 | Canonical Principle Structure and Comparative Cases #2026_09_24_02_group_1

[ ] Format every principle as a dedicated callout block using the `> [!PRINCIPLE]` tag.
[ ] **The Direct Normative Principle Law**: Formulate every principle title and definition as a **direct normative statement**—an authoritative, prescriptive rule of action telling the engineer what they must do, what they should do, or what they must avoid.
    - **Ban Pseudo-Intellectual Noun Jargon**: Strictly ban passive academic noun clusters and reflexive filler words like *"Invariant"*, *"Proscription"*, *"Disjunction"*, *"Fragmentation"*, or *"Delimitation"*. Instead of passive labels (e.g. `Client Subpath Import Invariant` or `Zero-DOM Fragmentation`), author active, memorable commands (e.g. `Principle 1: Always Import createRoot from react-dom/client` or `Principle 2: Group Siblings with React Fragments to Avoid Extra DOM Nodes`).
    - **Action-Oriented Titles**: The title must immediately communicate the required architectural choice or trap to avoid in 2 seconds.
    - **Prescriptive Definition**: The definition sentence must articulate the obligation or best practice directly to the reader, grounded in platform behavior.
[ ] Structure the principle header with bold continuous numbering: `> **Principle N: Catchy Normative Title**`.
[ ] State the principle definition on the next line as a clear, authoritative, bold statement articulating the platform rule.
[ ] **The Tangible UI Consequence Clause (Parenthetical Reality Anchor)**: When a principle articulates an engine or rendering rule, include a concrete parenthetical explaining the physical screen consequence for the end user (e.g. `(so {count && <Badge />} literally prints a stray "0" on screen when count is zero)` or `(which passes the literal string "{avatarPath}" to the browser)`). Reject academic word-salad like "the numeric primitive 0 renders visibly as text" without stating what the user actually sees on screen.
[ ] **The Strict-Reserve Marginalia Law**: Marginal glosses (`>> phrase : explanation`) are STRICTLY CONDITIONAL and must ONLY be used when there is a genuinely confusing, counter-intuitive, or load-bearing technical concept in the definition (e.g. `React Fragment`, `expressions that resolve to a value vs control-flow statements`, `native browser DOM property names`).
    - **Never Define Plain English**: Trivial phrases, self-evident words, or ordinary conversational English (e.g. "waits for user interaction", "quotes for static strings", "immediately during rendering") must NEVER be glossed. Defining everyday words treats the reader like a child and clutters the document with boring filler.
    - **Default to Quiet White Space**: If a principle statement is already plain, clear, and straightforward, leave the left margin completely empty! Clean white space is infinitely more authoritative and readable than forced, redundant definitions.
    - **Strict Verbatim Extraction**: When a gloss IS warranted, the phrase on the left of the colon MUST be an exact string present verbatim within the definition sentence.
    - **Zero External Jargon**: Never introduce outside textbook classifications, abstract categories, or words NOT present in the definition (e.g. introducing "primitive" or "DOM node" if those words do not appear in the definition is strictly forbidden).
    - **Cognitive Hurdle Decoding**: The explanation must decode the exact physical hurdle a reader has when encountering that phrase in simple, clear, human words.
[ ] When pertinent, follow the definition with comparative code cases using one of two approved pedagogical pairs:
    - Pair 1 (Syntax / Language Validity):
      `> *We should do this:*`
      `> \`code snippet\``
      `> `
      `> *We should not do this:*
      `> \`code snippet\``
    - Pair 2 (Best Practice / Idiomatic Architecture):
      `> *It is best practice to do this:*`
      `> \`code snippet\``
      `> `
      `> *Instead of doing this:*`
      `> \`code snippet\``
[ ] Use Pair 1 (`We should do this:` / `We should not do this:`) whenever the comparison contrasts valid code against code that causes compiler crashes, syntax errors, or invalid runtime failures.
[ ] Use Pair 2 (`It is best practice to do this:` / `Instead of doing this:`) whenever both code snippets compile and run, but one approach represents clean, idiomatic architecture while the other introduces architectural pitfalls, memory bloat, or layout disruption (e.g. wrapper `<div>` vs React Fragment).
[ ] **Principle Card Layout & Code Presentation**:
    - **Full-Width Badge-Aligned Code Blocks**: Code snippets inside comparison cards must start flush with the left margin (aligned with the badge icon above), stacking vertically below the card header rather than being indented into a narrow right column. This maximizes horizontal space and prevents awkward wrapped lines.
    - **Strict Line-Length Budget (<= 40 Characters)**: Every code line inside a principle comparison card must strictly stay within 40 characters. The code font size is anchored at 15px (`0.88rem`, matching the rest of the book) to guarantee crystal-clear legibility. At 15px in a standard 377px comparison card, lines exceeding 40 characters will wrap or clip. Never shrink font size to fit long lines; instead, break long statements across multiple concise lines pre-emptively or prune decorative tokens.
    - **Post-Code Explanatory Notes (After, Not Before)**:
      - Explanatory remarks or commentary accompanying a code case must appear **AFTER** the code, on the next line (never before the code).
      - In markdown, write comments on the line following the backtick code (e.g. `// Defensive check halts with clear diagnostic error`).
      - Notes are rendered as distinct human text (serif italics with a subtle dashed divider and breathing room), clearly separating contextual explanation from executable code.
    - **Mandatory Return Parentheses**: When a code case includes a JSX return statement, always wrap the return value in parentheses (e.g. `return (<div>...</div>);`), even for single-line returns, adhering strictly to the Universal JSX Return Parentheses Law (#2026_09_24_03_group_1).

```markdown
PROPER EXAMPLE (Direct Normative Title with Genuinely Confusing Term Glossed & <= 40 Char Code):
> [!PRINCIPLE]
> **Principle 2: Pass Only Value-Producing Expressions Inside Curly Braces**
> You must place exclusively **JavaScript expressions that resolve to a value** inside curly braces, strictly avoiding control-flow statements.
> 
> >> JavaScript expressions that resolve to a value : code that calculates a result you can pass or store (like a ternary or addition)
> >> control-flow statements : code that guides execution flow (like if, for, or while) without producing any value
> 
> *We should do this:*
> `{isSenior ? 'Senior' : 'Staff'}`
> 
> *We should not do this:*
> `{if (isSenior) { 'Senior' }}`
```

```markdown
COUNTER-EXAMPLE (Dry Academic Noun Jargon):
> [!PRINCIPLE]
> **Principle 2: Expressions Only Invariant**
> The curly brace window accepts exclusively JavaScript expressions that resolve to a value, strictly rejecting control-flow statements.
```
*Note: Fails the Direct Normative Principle Law by using passive specification jargon ("Expressions Only Invariant") instead of an action-oriented instruction telling the developer what to do.*

```markdown
PROPER EXAMPLE (Clean White Space - No Confusing Terms, Zero Marginalia):
> [!PRINCIPLE]
> **Principle 3: Always Close Every Tag Explicitly**
> Every JSX tag must be **explicitly terminated**—using a matching closing tag or a self-closing trailing slash.
> 
> *We should do this:*
> `<img src="/photo.jpg" alt="Photo" />`
> 
> *We should not do this:*
> `<img src="/photo.jpg" alt="Photo">`
```
*Note: Principle 3 uses direct, active normative phrasing and self-explanatory English. Adding forced definitions for "closing tag" or "trailing slash" would be boring and patronizing, so the left margin is left completely clean.*

```markdown
PROPER EXAMPLE (Best Practice - Pair 2 with Direct Normative Title):
> [!PRINCIPLE]
> **Principle 2: Group Siblings with React Fragments to Avoid Extra DOM Nodes**
> Adjacent sibling elements must be grouped with a **React Fragment** (`<>...</>`) to satisfy the single root invariant without injecting wrapper nodes into the DOM.
> 
> >> React Fragment : ghost container that groups child tags without creating a DOM node
> >> wrapper nodes : extra HTML elements (like a div) added only to hold other elements
> 
> *It is best practice to do this:*
> `return (<><img /><h2 /></>);`
> 
> *Instead of doing this:*
> `return (<div><img /><h2 /></div>);`
```

```markdown
COUNTER-EXAMPLE (Violating Verbatim Marginalia Law):
> [!PRINCIPLE]
> **Principle 5: Values in JSX**
> Booleans and null render nothing in JSX, while numbers print.
> 
> >> primitive : a fundamental data value in JavaScript that is not an object
> >> lexical scope : region of code where variable names are evaluated
```
*Note: Fails the Verbatim Marginalia Law because neither "primitive" nor "lexical scope" appears in the definition sentence. The margin must only decode words actually present in the text.*

## Pedagogical Substrate | 05 | Mandatory Tangible Accompaniments & Term Analysis #2026_09_24_04_group_1

[ ] Accompany every principle with rich, tangible pedagogical substrates that make the underlying mechanic immediately concrete and visual:
    - **The Term-by-Term Analytical Exposition Law**: Every principle card MUST be immediately followed by dedicated analytical prose that rigorously deconstructs each load-bearing technical term present in the principle definition:
        - **Lexical Isolation**: Every key term in the principle definition (e.g. `UI = f(data)`, `native ES modules`, `Fiber root`, `SyntheticEvent`, `parameter destructuring`, `setAttribute`) must be explicitly extracted, defined, and mechanically analyzed in the text.
        - **Multi-Layer Architectural Deconstruction**: When a principle touches multiple platform boundaries, author a mandatory numbered breakdown (e.g. 1. HTML text layer, 2. ECMAScript language grammar, 3. Browser C++ DOM object layer) rather than a single generic narrative paragraph.
        - **Direct Senior Interview Questions**: For counter-intuitive rules or complex syntax, explicitly pose and answer the senior interview questions (e.g. "Candidates face two core interview questions: 1. Why double curly braces? 2. Why camelCase keys?").
        - **The Banned 1-Paragraph Summary Reflex**: Strictly ban writing a single generic 3-to-4 sentence paragraph that merely restates the principle card. If a principle only has a single flat summary paragraph without term deconstruction, it is incomplete and fails pedagogical audit.
    - **Comparative Markdown Tables**: Use full-width 3-column reference tables (`**HTML (NAIVE PASTE)**<br>(raw markup string) | **REACT JSX (CORRECT)**<br>(transpiled syntax) | **INTERVIEW TAKEAWAY (THE "WHY")**<br>(compiler and engine rationale)`) to contrast naive markup against correct React syntax and compiler rationale.
    - **Right vs Wrong Code Editors**: Provide top-level code blocks with line numbers and speech bubbles clearly distinguishing compiler crashes (`// **WRONG:** ...`) from correct patterns (`// **RIGHT:** ...`).
    - **Standalone HTML Figures**: Include standalone HTML/CSS diagrams (following Archetypes in `figures/SKILL.md`) whenever spatial arrangements, DOM trees, or compilation pipelines require visual intuition.

```markdown
PROPER EXAMPLE:
In Lecture 4:
1. Principle 4 uses a 3-layer breakdown: 1. HTML Attributes (Markup Text), 2. JavaScript Reserved Keywords (Language Grammar), 3. Browser DOM Properties (Living Objects).
2. Principle 6 poses and answers the two senior interview questions: 1. Why double curly braces? 2. Why camelCase keys?
3. Principle 8 analyzes the physical DOM difference between Property Assignment (`domNode.className = ...`) and Attribute Assignment (`domNode.setAttribute('aria-label', ...)`).
4. Principles 4 through 8 are synthesized into a comprehensive 3-column comparative reference table contrasting HTML naive paste vs React JSX vs Interview takeaway.
5. Transpiled code blocks directly follow JSX code blocks, showing the exact `_jsx()` output.
6. Figure `04-00-jsx-root-and-fragments.html` visually contrasts a bloated DOM tree with extra wrapper divs against a clean containerless DOM tree using React Fragments.
```

```markdown
COUNTER-EXAMPLE:
Stating "Principle 5: Attributes are camelCase" followed by two sentences of text and no code block, no table, no runtime breakdown, and no transpiled output.
```
*Note: A bare assertion without tangible evidence forces the student to memorize arbitrary rules rather than understanding browser engine mechanics.*

## Interview Stance & Cognitive Framing | 06 | Senior Candidate Interview Framing Standard #2026_09_24_02_group_1

[ ] Frame every principle from the perspective of an engineering candidate preparing for a senior or staff technical interview.
[ ] Contrast superficial candidate answers with authoritative platform reality:
    - Reject hand-waving explanations (e.g. "React likes camelCase because it looks nice").
    - Provide the exact W3C specification rationale, ECMAScript parser boundary, or browser engine implementation (e.g. "The W3C DOM Level 2 HTML specification defined `HTMLInputElement.tabIndex` as a camelCase IDL attribute in 1998; React maps props to DOM object properties rather than HTML text attributes").
[ ] Include `> [!TIP]` callouts titled `**To impress the interviewer:**` to distill complex compiler behavior into memorable interview talking points.
[ ] **The Anti-Repetition `[!WILD]` Law**: Include `> [!WILD]` callouts strictly to address counter-intuitive edge cases, unexpected platform surprises, or engine side-effects. NEVER repeat or summarize lessons already taught in the theory or case study. The `[!WILD]` section must deliver a genuine, eye-opening surprise with new, high-stakes information (e.g. why an extra wrapper `<div>` silently destroys CSS Flexbox and Grid parent-child layout relationships).

```markdown
PROPER EXAMPLE:
> [!TIP]
> **To impress the interviewer:** When asked why React uses `className` instead of `class`, avoid saying "because `class` is a reserved word in JavaScript." Modern JavaScript engines easily allow reserved words as object keys. The true reason is **DOM Property Alignment**: React's JSX transpiler maps attributes directly to properties on living browser DOM nodes (`element.className`), not raw HTML markup strings. In 1998, the W3C DOM Level 1 specification chose `className` to prevent collisions in early browsers, and React strictly aligns with that established browser standard.
```

```markdown
COUNTER-EXAMPLE:
"Remember to use className in React, because class is reserved in JS. It's just how React works."
```
*Note: Gives a naive answer that fails senior engineering interviews and fails to explain browser DOM architecture.*

## Universal Authoring Template | 07 | Universal Principle-Based Lesson Template & Lecture 4 Benchmark #2026_09_24_02_group_1

[ ] Assemble every principle-based lecture adhering strictly to this universal structural blueprint:
    1. **Title & Question**: `# Lecture {n}: {Clear Title}` on line 1; `> INTERVIEW QUESTION | ❱ CORE | ...` on line 2.
    2. **The 7-Beat Problem Ladder**: Numbered beats 1 to 7 establishing a high-stakes newsroom failure caused by missing the principle.
    3. **Problem Setup Section**: `### {Catchy Problem Heading}` showing naive code and the immediate compiler error or runtime defect.
    4. **Principle-Based Theory Section**: `### Principles of React: {Topic Core Laws}`:
       - Opening framing distinguishing theory from practical application.
       - Continuously numbered principles: `> [!PRINCIPLE]` with `Principle 1`, `Principle 2`, ... `Principle N`.
       - For each principle: Title, Definition, Do/Don't or Best Practice cases, engine derivation, and tangible accompaniments.
       - Comparative summary table consolidating all rules.
       - Transpiled compiler output comparing JSX source to raw JavaScript `_jsx()` calls.
    5. **Zero-New-Concept Practical Example**: `### Let's Design a Practical Example`:
       - Stage A: ` ```components ` and ` ```files `.
       - Stage B: Assembly Pipeline Figure (`figures/{NN}-01-...html`).
       - Stage C: Sequential Assembly Steps 1 through 4 (strictly synthesizing the principles).
       - Stage D: `### Component Summary` with Role Mode panel.
       - Stage E: Architecture Audit Table (`figures/{NN}-02-...html`).
    6. **Terminal Digests**:
       - `### Where you will meet this` (real-world scenarios).
       - `### Glossary` (definitions of bolded terms).
       - `## Beyond the basics` (4 to 6 live official documentation links).
       - `### Summary` (decision rules `➔` and right/wrong takeaways).
       - Closing Comparative Table.

```markdown
PROPER EXAMPLE:
Consult Lecture 4 (`01-02-md-LECTURES/04.md`) as the canonical golden reference implementing this exact 7-part architecture across 9 comprehensive principles.
```
