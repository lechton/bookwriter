
> **TEMPLATE STATUS - INHERITED FROM react-lecture-03 (copied 2026-09-17)**
> This document is the react-lecture-03 authoring law, copied verbatim as the starting point for fastapi-01. It still contains React-specific mandates (Component Explorer gate, .jsx fences, ElectroShop, react.dev paths, React hooks vocabulary) that MUST be re-grounded for FastAPI before lecture authoring begins. The open adaptation decisions are tracked in ./ADAPTATION-TODO.md. Everything below this banner is the inherited template.


# Pre-Lecture / Prelecture Instructions: Phase 1 Iteration Guide

This document is the authoritative specification for authoring a **pre-lecture** (also referred to as a **prelecture**) in `diagram-lab/output/react-lecture-03/md-pre-lectures/`.

The pre-lecture / prelecture is the **first iteration of the material** before creating the full production lecture in `md-lectures/{nn}.md`. It establishes maximum coherence and clarity, plans the causal flow of every paragraph and code block, and locks in the technical vocabulary before writing begins.

---

## 1. Core Purpose and Philosophy

A full lecture in `md-lectures/` requires tight coordination across prose, code snippets, visual components, figures, and summaries. Writing a prelecture first guarantees three critical outcomes:

1. **Maximum Coherence and Flow**: Every paragraph, code snippet, and visual element is planned with an explicit causal reason to exist. Each element explains what it covers, why it must follow the previous block, and how it prepares the ground for the next.
2. **Locking In Technical Terms (Anti-Jargon Barrier)**: The pre-lecture locks in the exact technical terms that this lecture is authorized to introduce. When authoring the subsequent production lecture, introducing any technical terms outside those mapped in the prelecture is strictly forbidden. This completely prevents jargon pollution and cognitive overload.
3. **In-Situ Pedagogy (The `◼` Separator)**: Pedagogical qualifications are not detached into abstract essays; they live directly on each element. Each bullet uses `◼` to attach its educational objective, role, and key emphasis directly to the content it governs.

---

## 2. The Direct Structural Mirror

A pre-lecture does not contain abstract meta-sections. It **directly mirrors the exact headings and structure of the final production lecture**.

- **File Naming**: Matching question numbers with two-digit padding: `md-pre-lectures/{nn}.md` (e.g. `01.md`, `02.md`, ... `100.md`, ... `180.md`).
- **Headings**: The `#`, `##`, and `###` headings in the prelecture are identical to the headings that will appear in the final lecture.
- **Bullets**: Under each heading, every upcoming block of the lecture is represented by a single bullet point containing a **pre-element**.
- **Bold Key Terms Law**: Key terms in any paragraph MUST be in **bold** (e.g. `**imperative DOM scripting**`, `**state drift**`, `**component**`). Every concept introduced must be visually anchored with bold formatting.
- **Formatting Rule**: Never hard-wrap. One continuous line per bullet, paragraph, or table row. Never use em-dashes (`—`).

---

## 3. Pre-Element Taxonomy & The Real Code Law

Every bullet point in the prelecture begins with an atomic pre-element tag indicating what production element it will become:

- **`[p]`**: A prose paragraph (or a standalone prose line in a series, e.g. in real-world applications).
- **`[grounding]`**: A dedicated real-world grounding card (**`⚡ IN THE WILD`**). Anchors the technical concept into physical DevTools reality, broken screen states, or production incident friction.
- **`[code]`**: An exact, literal code fence. **The Real Code Law**: Abstract descriptions of code (such as "a function that does X") are strictly prohibited. The pre-lecture MUST contain the exact, runnable 8–12 line code snippet that will appear in the lecture.
- **`[components]`**: A Component Explorer panel showing file tree hierarchy and rendered UI.
- **`[figure]`**: A standalone HTML figure illustrating browser/engine mechanics.
- **`[callout]`**: A callout box (`> [!TIP]` to impress the interviewer or `> [!KEY]` for core takeaways).
- **`[glossary]`**: A dedicated glossary entry in the pre-lecture under `### Glossary` (which lives between `### Where you will meet this` and `### Summary`). Formatted as `- [glossary] Term ◼ Plain-English definition explaining the concept and its concrete engineering role without em-dashes.`
- **`[table]`**: A closing comparison table.
- **`[ladder-1]` through `[ladder-6]`**: The 6 sequential opening ladder beats (Scene, Code Moment, Question, Danger, Mystery, Promise).

---

## 4. The "In The Wild" Grounding Law (`[grounding]` -> `> [!WILD]`) & The Knife Paradigm

A tired developer with a short attention span cannot digest pure textbook abstractions or dry, bureaucratic paragraphs. Every major technical section must include a dedicated `[grounding]` card (which compiles into a `> [!WILD]` alert rendered with the eyebrow **`⚡ IN THE WILD`** in production).

### The Primary Mission: Discharging Counter-Intuitive Confusion (The "Aha Moment")
The core objective of `⚡ IN THE WILD` is NOT to summarize the section. Its purpose is to **isolate the single most common point of confusion** for students—the exact mechanism or trade-off that feels counter-intuitive, slippery, or unnatural when first encountered in the text. The card is engineered specifically to trigger an immediate **"aha moment"** that permanently dissolves that confusion.

### The Knife Paradigm: Simple, Familiar, and Straight to the Point
Grounding cards do NOT read like dry, passive textbook explanations or technical API specs. They must obey **The Knife Paradigm**:
1. **Short & Catchy Leading Question (6–9 words)**: Every card MUST open with a **short, punchy, bold leading question** (`**What is the problem with updating the physical DOM?**` or `**What does imperative vs declarative really mean?**`). Keep it broad, catchy, and memorable. NEVER stuff specific API methods, code syntax, or technical minutiae into the question.
2. **Intentional Repetition & "Taking the Reader by the Hand"**: We do NOT assume the reader has a long attention span. When explaining difficult or confusing concepts, you must literally take the reader by the hand. Point directly and **repeatedly use various forms of repetition** (etymological repetition, contrasting repetition, re-anchoring). Drive the point home multiple times in plain language until it cannot be misunderstood.
3. **Mandatory Bolding of Clarified Key Concepts**: The card's explicit job is to clarify load-bearing technical terms (such as `**imperative**`, `**declarative**`, `**physical DOM**`, `**virtual DOM**`, `**single source of truth**`). You must return to these concepts and **ALWAYS keep them in bold** every time they appear in the card. Never leave clarified terms unbolded.
4. **Zero Technical Clutter**: Grounding cards are NOT for syntax deconstruction or method tracing. Strip out technical filler (no background polling routines, no variable loops, no line numbers or compiler trivia). Anchor purely to **sensory, tactile user friction** (the blinking cursor disappearing, keystrokes swallowed into thin air, on-screen badges disagreeing).
5. **Conversational Familiarity & Relatable Scenarios**: Speak with direct, everyday familiarity (*"Can you imagine...?"*, *"Remember the blinking cursor that appears when completing a form? Well... it vanishes completely"*).
6. **Straight-to-the-Point Resolution**: Contrast the physical friction directly with React's intuitive solution in plain English.

### Contrast: Bad Examples vs. Cardinal Standard (Chapter 01 Demos)

> [!CAUTION]
> **Bad Example 1 (Stiff, passive, overly detailed, no leading question, no bolded key terms — REJECTED):**<br>
> The Renamed ID Trap<br>
> A design system refactor cleans up the HTML template, changing `<div id="user-badge">` to `<div id="account-pill">`. No TypeScript error is thrown. No compiler warns you. But three separate JavaScript files silently break in production because their document.getElementById queries now evaluate to null. Component boundaries eliminate this fragility by encapsulating markup and behavior together, making selector drift impossible.

> [!CAUTION]
> **Bad Example 2 (Over-long technical question, body bogged down in technical trivia — REJECTED):**<br>
> What happens when you wipe the DOM with innerHTML?<br>
> You are typing your shipping address into an online checkout form. Suddenly, an asynchronous poll refreshes the delivery fees. The naive script wipes the container and rebuilds the HTML from scratch. What happens to your input box? It is destroyed and replaced with a twin. The blinking cursor vanishes. Keyboard focus drops. Your next four keystrokes disappear into thin air. React's reconciliation engine solves this by keeping the physical input element alive in the browser. It diffs the tree in memory and updates the fee text, leaving your active cursor untouched.

> [!TIP]
> **Cardinal Standard Demo 1: Intentional Repetition & Key Term Bolding (MANDATORY BENCHMARK):**<br>
> **What does imperative vs declarative really mean?** Imagine a subscriber named Elena logs into The National Times. Her name appears in ten different places across the screen, from the sidebar to the navigation bar. But what happens when she updates her account to use a pen name? In plain JavaScript, you are forced to write manual commands to find and rewrite every single spot. You need to hunt down each and every "name" variable, manually. If you miss in one place, it does not update. This is the problem with **imperative programming**: it is **imperative** to hunt down and update all variables, time and time again. Which, in turn, can lead to many silent failures. This silent failure is exactly why you need the **declarative** component model of React: it eliminates manual DOM hunting to ensure your entire interface stays perfectly synchronized automatically.

> [!TIP]
> **Cardinal Standard Demo 2: Tactile Sensory Friction & Virtual DOM Clarity (MANDATORY BENCHMARK):**<br>
> **What is the problem with updating the physical DOM?** Can you imagine a routine update of the DOM while you are typing in a form? The container is destroyed and instantly rebuilt. Remember the blinking cursor that appears when completing a form? Well... it vanishes completely, and your next few keystrokes disappear into thin air. React prevents this frustrating wipeout entirely. Instead of destroying the **physical DOM**, it compares the new updates in memory (**virtual DOM**) and only changes what is absolutely necessary, leaving your active typing perfectly untouched.

### Anatomy of a `[grounding]` Pre-Element
```markdown
- [grounding] Leading Question: [Short, catchy, bold question: max 6–9 words, zero syntax clutter]
  Confusion Point: [The counter-intuitive concept or friction to discharge: e.g. why manual updates fail or DOM wipes drop focus]
  Scene & Repetition: [Everyday familiar hook using intentional repetition and taking the reader by the hand]
  Key Terms (Bold): [Mandatory bolding of all clarified terms: e.g. **imperative**, **declarative**, **physical DOM**]
  Resolution: [How React's core mechanism solves it cleanly, creating the "aha moment"]
```

### Cadence
Include exactly **one `[grounding]` card per major technical section (H2/H3)**. This provides a natural cognitive resting point and grounds every technical breakthrough in tactile engineering reality.

---

## 5. The Complete Nomenclature Law (The Classic & Modern Dual-Canon Mandate)

Whenever you dedicate a paragraph or section to describing a runtime phenomenon, architectural pattern, or data structure, **withholding its formal nomenclature is strictly prohibited** (The Anti-"Voldemort" Law). You must explicitly deliver the **Dual-Canon Terminology**:

1. **The Classic / Industry-Standard Term**: What 95% of senior interviewers, engineering teams, and existing codebases call it across the table (e.g., `virtual DOM`, `prop drilling`, `synthetic events`).
2. **The Modern / Official Documentation Term**: How current framework specifications, RFCs, and modern official docs describe it today (e.g., `UI descriptor tree`, `React elements`, `context propagation`).
3. **The Concrete Physical Reality**: A plain-English grounding of what it actually is in RAM or the browser engine (e.g., *lightweight plain JavaScript objects in memory*).
4. **Mandatory Bolding**: Always bold canonical terms upon introduction (`**virtual DOM**`, `**UI descriptor tree**`, `**reconciliation**`).
5. **The Grounding Section Trigger (`⚡ IN THE WILD`)**: If the transition, distinction, or relationship between the classic term and modern term is counter-intuitive or causes widespread developer confusion (e.g., *"Is the virtual DOM a simulated browser or just JS objects?"*, *"Why does modern React speak of descriptor trees?"*), **dedicate an `⚡ IN THE WILD` grounding card** specifically to discharge that confusion and trigger an immediate "aha moment".

---

## 6. The Zero-Unexplained-Syntax Law & Code Self-Audit

The greatest defect in technical education is code dumping: presenting code snippets with unexplained parameters, keywords, or symbols. To eliminate this permanently:

1. **Mandatory Code Self-Audit**: Right after every `[code]` block in the prelecture, include a structured audit listing every keyword, parameter, attribute, method, or symbol introduced in that snippet.
2. **Explanatory Proximity Guarantee**: Every audited item in the snippet MUST be explicitly assigned to a subsequent `[p]` bullet that unpacks its mechanics line-by-line.
3. **No Consecutive Code Fences**: Two back-to-back code blocks without intervening prose are strictly forbidden. If a lecture shows a child component and then a parent component, the child's implementation must be fully deconstructed before the parent is shown.

```text
- [code] ComponentName.jsx:
```jsx title="ComponentName.jsx"
// Literal runnable code fence here
```
◼ **Code Self-Audit (What this snippet introduces):**
1. [Keyword / Construct]: Exact line number and role.
2. [Parameter / Signature]: What data enters and how it is structured.
3. [JSX / Syntax Token]: How symbols like curly braces behave.

- [p] Deconstructing Line X: Explicitly explains item 1 and item 2 from the audit. ◼ Pedagogical goal.
- [p] Deconstructing Line Y: Explicitly explains item 3 from the audit. ◼ Pedagogical goal.
```

---

## 7. The Dual-Form CLI Command & Scaffolding Anatomy Law

When introducing terminal scaffolding commands (such as `npm create vite@latest`), you must provide **two distinct forms** and thoroughly deconstruct the generated project architecture:

1. **The Generic Formula (in the prose)**: Provide the abstract parameter pattern (e.g. `npm create vite@latest <app_name> -- --template react`).
   - Explicitly explain what `<app_name>` means in practice: it dictates the literal folder name created on disk and populates the `"name"` field in `package.json`.
   - Explain naming constraints: all lowercase, numbers, and hyphens without spaces or uppercase letters.
   - Explain angle bracket notation: `<...>` is standard POSIX documentation notation indicating a required user placeholder, which the student replaces without typing literal angle brackets.
   - Explain tool flags: why `npm create` runs `create-vite` in memory without global installation, why the double-dash `--` is required to pass arguments through npm to the generator, and what `--template react` selects.
2. **The Concrete Runnable Execution (in the code fence)**: Provide the exact, runnable command with the chapter's actual project name (e.g. `npm create vite@latest national-weather -- --template react`).
   - Copy-paste safety: Never put unquoted placeholders like `<app_name>` inside runnable bash fences, as unquoted `<` and `>` cause shell redirection syntax errors.
3. **Physical File & Folder Anatomy**: Never treat generated projects as opaque magic. Explicitly deconstruct every file and directory created on disk:
   - `package.json`: Project manifest declaring dependencies (`react`, `react-dom`), devDependencies (`vite`, `@vitejs/plugin-react`), and npm scripts (`dev`, `build`).
   - `index.html`: The root entry HTML shell containing `<div id="root"></div>` and the modern native module script `<script type="module" src="/src/main.jsx"></script>`.
   - `vite.config.js`: The central build configuration file registering `@vitejs/plugin-react`. Decompress this into three distinct systems: (a) JSX compilation (transforming `<Tag />` into standard JavaScript function calls browsers can execute), (b) Fast Refresh (updating component code in browser memory during dev without reloading or resetting state), and (c) Rollup production bundling (merging and minifying separate component files into optimized deployment assets).
   - `src/`: Source code directory containing `main.jsx` (DOM root mounting), `App.jsx` (root component), and CSS styles.
   - `node_modules/` & `package-lock.json`: Downloaded packages and locked dependency tree created by `npm install`.

---

## 8. Pedagogical Anti-Compression & Precision Laws

1. **The Bullet Decompression & Anti-Jargon Smuggling Law (The Tired Reader Standard for Lists)**: Bullet points are high-risk compression traps. Authors must never use bullets as an excuse to abbreviate explanations or smuggle unbaptized jargon. Every bullet introducing a file, configuration, or dependency must be written for a tired developer with a splitting headache using CEFR B2 vocabulary. Never pack multiple unexplained systems (e.g. *"JSX compilation, Fast Refresh, and Rollup bundling"*) into a single sentence. For every tool or compiler mentioned, unpack: (1) what it is, (2) what it physically transforms from $A$ to $B$, and (3) its tangible developer or browser benefit.
2. **The Problem-Condition Heading Law ("When" Over "Why" for Failure States)**: Never use "Why" for headings introducing bugs, blank screens, performance delays, or runtime failure symptoms (e.g. never write *"Why does client-side rendering show a white screen?"*). "Why" falsely implies intentional design or permanent reality. Always use **"When"** (e.g. *"When does client-side rendering show a white screen?"*), which correctly frames the problem as a situational condition, timing delay, or operational boundary.
3. **The Anti-Tail-End Name-Dropping Law (Zero Orphan Buzzwords at Paragraph Ends)**: Never conclude a paragraph, section, or callout card by dropping a new technical term or proper noun into the final sentence without immediately unpacking its mechanics. If a named system (such as **Hot Module Replacement**) represents the climax or resolution of an explanation, you must physically deconstruct it in that exact place: state how the server connects to the browser (e.g. a live connection), what payload moves (e.g. only the changed module), and how the browser swaps it in memory without refreshing or clearing form state.
4. **The Pre-Lecture Comparative Code Law (Summary & Anti-Pattern Comparisons Only)**: In the pre-lecture blueprint, comparative code blocks (`DO THIS:` and `DO NOT DO THIS:`) must be written out in full runnable code fences with `right` / `wrong` tags, where **ONLY the uppercase directive is bold** (`**DO THIS:** [instruction in normal weight]` and `**DO NOT DO THIS:** [instruction in normal weight]`), and accompanied by Dual Code Self-Audits (explaining what makes the right code resilient, and the exact runtime failure or state drift triggered by the wrong code). Summarizing comparative code as abstract placeholders is strictly forbidden. Scope of application is strictly restricted to: (1) closing `### Summary` blocks to summarize key points of thinking and error avoidance, and (2) direct in-body **anti-pattern comparisons** where a broken or legacy architectural approach is contrasted with a modern React 19 pattern (e.g. manual DOM queries vs declarative JSX). NEVER apply `DO NOT DO THIS` to terminal scaffolding commands, documentation placeholders, CLI flags, or standard setup steps.
5. **The Pre-Lecture Standalone Glossary Mandate**: Every pre-lecture blueprint MUST include `### Glossary` directly between `### Where you will meet this` and `### Summary`. It defines 4 to 6 core terms introduced or reinforced in the lecture, each formatted as `- [glossary] Term ◼ Plain-English definition and concrete engineering role without em-dashes.` This locks in definitions and technical vocabulary before full lecture authoring begins.

---

## 9. Bullet Anatomy with the `◼` Separator

Every bullet point in a pre-lecture / prelecture is structured into two parts separated by the black square `◼`:

```text
- [pre-element] Content & Causal Flow ◼ Pedagogical Qualifications
```

### Left of `◼`: Content & Causal Flow
- **What this element covers**: The specific concept, code snippet, or visual arrangement being introduced.
- **Causal flow**: Why this element belongs here, why it naturally follows the previous element, and how it leads into the next.

### Right of `◼`: Pedagogical Qualifications
- **Educational Objective**: The specific pedagogical goal of this element.
- **What to Underline**: What must be emphasized, clarified, or highlighted for the learner.
- **Technical Terms**: Any technical term introduced and baptized in this element.

---

## 10. Pre-Lecture Quality Gate

Before approving a prelecture or moving to full lecture authoring, verify:
1. **Structural Mirror**: The pre-lecture matches the final lecture's headings and sections 1:1.
2. **Literal Code**: Every `[code]` pre-element contains the real, runnable code fence, never an abstract summary.
3. **Zero Unexplained Syntax**: Every code snippet includes a Code Self-Audit, and every audited item has an assigned `[p]` deconstruction bullet.
4. **No Back-to-Back Code**: Consecutive code fences without intervening deconstructive prose are completely absent.
5. **Causal Continuity**: Every bullet explains why it follows the previous block and leads into the next.
6. **Dual-Canon Nomenclature**: All technical mechanisms are named with both their classic industry term and modern official term; no "Voldemort" circumlocutions.
7. **Term Locking**: All technical terms intended for the lecture are explicitly declared within their respective `[p]` bullets; no unmapped jargon may enter the subsequent lecture.
8. **Bullet Decompression**: Bullet points must never bundle multiple unbaptized concepts; every file and tool introduced in a list is deconstructed into its $A \to B$ transformation and developer benefit.
9. **Conditional Headings**: Failure-state cards and questions strictly use "When" instead of "Why".
10. **Zero Tail-End Name Drops**: No paragraph or callout card terminates on an unbaptized buzzword.
11. **Glossary Section**: `### Glossary` is explicitly planned with 4 to 6 terms between `Where you will meet this` and `Summary`.
12. **Full Comparative Code**: All `DO THIS` and `DO NOT DO THIS` blocks feature full runnable code fences with dual self-audits.
13. **Formatting**: Strictly one continuous line per bullet; no hard-wrapping; zero em-dashes.
14. **Cautious Visual Verification**: Do not run routine screenshot scans (`pdftoppm`) on the output. Page inspection via screenshots is strictly restricted to cases where the actual visual design, CSS styling, or figure geometry of the page has been modified.
