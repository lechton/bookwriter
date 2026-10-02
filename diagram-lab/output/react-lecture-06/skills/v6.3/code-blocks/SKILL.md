---
name: code-blocks
description: Governs code windows, line ceilings, continuation attributes, and comment conventions inside lectures; use when writing or reviewing any code block in a lecture.
---

# Code Blocks

This skill governs how code blocks are authored in lecture Markdown: editor windows and filename tabs, the 10-line ceiling, continuation attributes that stitch long files across progressive steps, end-of-line `//` comment bubbles, tag-free natural English comments, and right/wrong comparative blocks. The build compiler (`src/build-lectures.mjs`) parses plain Markdown fences and generates styled HTML editor windows.

Digests: `skills/old-instructions/instructions.md` (code block format) and `skills/old-instructions/AUTHOR-BRIEF.md` (hard format rules).

## Code Windows | 01 | Clean Fencing and Supported Language Tags

- [ ] Does every code block open with a recognized language tag (` ```jsx `, ` ```js `, ` ```tsx `, ` ```ts `, ` ```javascript `, ` ```typescript `, or ` ```bash `)?
- [ ] Does every code block close with a matching closing fence ` ``` ` placed on its own line?
- [ ] Is `jsx` preferred as the standard language tag for React component code?
- [ ] Are code snippets complete and runnable when demonstrating a pattern, providing self-contained execution rather than disconnected fragments?

- [ ] PROPER EXAMPLE: Complete minimal component in a clean code window:

> ```jsx
> import { useState } from 'react';
> export default function App() {
>   const [count, setCount] = useState(0);
>   return (<button onClick={() => setCount(count + 1)}>Clicks: {count}</button>);
> }
> ```

Notes: Uses the `jsx` language tag, closes cleanly, and provides a runnable component with zero leading empty lines.

## Code Windows | 02 | Filename Tabs and Title Attributes

- [ ] Does the opening code fence include a `title="..."` attribute whenever the default filename does not match the actual file name?
- [ ] Are derived defaults relied upon when suitable (`jsx` yields `App.jsx`, `tsx` yields `App.tsx`, `js` yields `App.js`, and `ts` yields `App.ts`), with titles specified whenever introducing other files?
- [ ] Do runnable project snippets use registered filenames from the lecture's file tree (such as `title="SearchBar.jsx"`)?
- [ ] Do historical or pre-React 19 comparisons use explicit conceptual titles without `.jsx` extensions (such as `title="Historical Pattern"` or `title="Naive Implementation"`), avoiding compiler warnings on unregistered files?

- [ ] PROPER EXAMPLE: Overriding the default tab with a recognized project filename:

> ```jsx title="SearchBar.jsx"
> export default function SearchBar({ query, onChange }) {
>   return (<input value={query} onChange={(e) => onChange(e.target.value)} />);
> }
> ```

Notes: Explicitly names `SearchBar.jsx`, matching the project file tree and providing an accurate editor tab.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Cluttered or unregistered filename tabs:

> ```jsx title="Search Input Prompter Widget FINAL v2.jsx"
> export default function SearchBar({ query, onChange }) {
>   return (<input value={query} onChange={(e) => onChange(e.target.value)} />);
> }
> ```

Notes: Uses a cluttered, unregistered filename that does not exist in the project, triggering compiler warnings and confusing the reader.

## Code Windows | 03 | Density, Indentation & 80-Character Boundary

- [ ] Are empty lines inside code blocks eliminated where possible, preserving compact numbered vertical rows in print?
- [ ] Is top-level code kept flush against the left margin, avoiding stray leading spaces that misalign editor rendering?
- [ ] Do all code lines stay within the 80-character boundary, breaking long object literals, method chains, and JSX attribute lists across multiple rows?
- [ ] Are JSX elements formatted with one prop per line whenever a component takes two or more attributes or whenever a single line exceeds 80 characters, ensuring readability without accidental wrapping or PDF clipping? #2026_09_26_17_group_1

- [ ] PROPER EXAMPLE: Formatting attributes with natural line breaks:

> ```jsx
> <button
>   formAction={() => saveArticle(article)}
>   disabled={pending}
> >
>   Save
> </button>
> ```

Notes: Each attribute occupies its own line, keeping the snippet comfortably below the 80-character boundary.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Unbroken single-line attribute lists:

> ```jsx
> <button formAction={() => saveArticle(article)} disabled={pending} style={{ marginTop: 12, padding: '6px 14px' }}>Save</button>
> ```

Notes: Far exceeds 80 characters, forcing accidental mid-attribute line wraps that break visual editor alignment in PDF layout.

## Code Windows | 04 | Zero Author-Side HTML Styling

- [ ] Are code blocks authored using plain Markdown syntax and authentic language comments (`//` for JavaScript, `{/* ... */}` for JSX tags/elements, `#` for Bash/Shell, or `<!--` for HTML)? #2026_09_21_23_group_1 #2026_09_28_01_group_1
- [ ] Does the block avoid raw HTML `<span>` tags, inline CSS classes, or hardcoded bubble containers, allowing the compiler to generate editor chrome automatically?
- [ ] Are raw HTML tags kept out of code fences, avoiding double-encoded entities that disrupt syntax highlighting?

## Line Ceilings | 05 | The 10-Line Code Ceiling

- [ ] Does every code block contain 10 or fewer lines of executable code?
- [ ] Are components longer than 10 lines sliced across sequential micro-steps?
- [ ] Does slicing code support step-by-step deconstruction, preventing overwhelming walls of code from tiring readers?

- [ ] PROPER EXAMPLE: Focused component under the 10-line ceiling:

> ```jsx title="ReaderGreeting.jsx"
> export default function ReaderGreeting({ readerName }) {
>   return (
>     <div className="greeting-box">
>       <span>Welcome back, {readerName}</span>
>     </div>
>   );
> }
> ```

Notes: Complete, focused, 7 lines total, easily scanned and deconstructed in a single view.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Multi-concern component in a single un-sliced window:

> ```jsx title="SiteHeader.jsx"
> export default function SiteHeader({ readerName, tier, onLogout }) {
>   const [open, setOpen] = useState(false);
>   const badgeColor = tier === 'premium' ? 'gold' : 'blue';
>   return (
>     <header className="site-header">
>       <h1>The National Times</h1>
>       <ReaderGreeting readerName={readerName} />
>       <SubscriberBadge tier={tier} color={badgeColor} />
>       <button onClick={() => setOpen(!open)}>Menu</button>
>       {open && <NavMenu onLogout={onLogout} />}
>     </header>
>   );
> }
> ```

Notes: 14 lines long, combines 3 distinct UI concerns, exceeds the 10-line budget, and benefits from being sliced across progressive micro-steps.

## File Continuations | 06 | Slicing Files with Continuation Attributes

- [ ] When a single component file is sliced across multiple steps in Stage C, are snippets stitched together using continuation attributes on code fences: #2026_09_21_31_group_1
    * First snippet: `title="Name.jsx" startLine="1" continues="bottom"`
    * Intermediate snippets: `title="Name.jsx" startLine="NN" continues="both"`
    * Final snippet: `title="Name.jsx" startLine="NN" continues="top"`
- [ ] Does the builder compile matching continuation attributes into seamless editor windows with continuation tabs, signaling continuous file progress?
- [ ] Are continuation attributes (`continues`) reserved specifically for slicing a single continuous file across line budgets, avoiding use for progressive revisions of different code states?
- [ ] Do intermediate and final continuation blocks (`continues="both"` or `continues="top"`) set `startLine > 1`, calculated as `previous_startLine + previous_lineCount`, avoiding re-declaring `export default function ...` or re-opening `return (`? #2026_09_21_31_group_1

- [ ] PROPER EXAMPLE: Slicing a component across continuation fences:

> ```jsx title="FeedbackPortal.jsx" startLine="1" continues="bottom"
> export default function FeedbackPortal() {
>   const [query, setQuery] = useState('');
>   return (
>     <div className="portal-container">
>       <LiveSearchInput query={query} onChange={setQuery} />
> ```
> 
> *(prose deconstructing parent state and prop passing)*
> 
> ```jsx title="FeedbackPortal.jsx" startLine="6" continues="top"
>       <ArticleCorrectionForm />
>     </div>
>   );
> }
> ```

Notes: The first block opens with `continues="bottom"`, and the closing block picks up at line 6 with `continues="top"`, stitching the file seamlessly.

## File Continuations | 07 | Real Executable Code at Block Openers

- [ ] Does every code block start directly on its first line of real, executable code?
- [ ] Does the code block avoid leading blank lines or decorative comments so that `startLine` accurately counts real code?
- [ ] Are leading blank lines avoided to prevent empty numbered rows from appearing at the top of the editor window?

## Code Comments | 08 | Inline Comments and Speech Bubble Rendering

- [ ] Are code comments attached directly to the end of the line they annotate (`code; // annotation`, `<Component /> {/* annotation */}`, or `command # annotation`)? #2026_09_21_23_group_1 #2026_09_28_01_group_1
- [ ] Does the snippet leverage compiler comment extraction—supporting standard `//` in JavaScript statements, native `{/* ... */}` (and `/* ... */`) in JSX markup/elements, native `#` in Bash/Shell, and `<!--` in HTML—to generate floating speech bubbles in the right-hand panel? #2026_09_21_23_group_1 #2026_09_28_01_group_1
- [ ] Are standalone comment lines avoided where possible, keeping the two-column layout balanced?
- [ ] Does every narrative code block (≥3 lines) feature end-of-line comments on its load-bearing lines, maintaining two-column editor balance? #2026_09_21_30_group_1 (refining #2026_09_21_17_group_1)
- [ ] Do code comments track the mind of the reader, matching the vocabulary and concepts introduced in the surrounding prose on that exact line? #2026_09_21_13_group_1

- [ ] PROPER EXAMPLE: End-of-line comments driving speech bubbles across JavaScript and JSX:

> ```jsx
> const [query, setQuery] = useState(''); // Stores current search text
> return (
>   <Fragment> {/* Explicit container supporting key attribute */}
>     <input value={query} onChange={setQuery} /> {/* Synchronizes input on keypress */}
>   </Fragment>
> );
> ```

Notes: Comments sit naturally at the end of each line using appropriate syntax (`//` for JS logic, `{/* ... */}` inside JSX markup), extracted automatically by the compiler into structured speech bubbles.

## Code Comments | 09 | Syntax Safety and Bubble Formatting

- [ ] Are speech bubble comments written using plain alphanumeric characters and minimal inline markdown?
- [ ] Do comments avoid trailing commas, semicolons, or stray closing symbols that could disrupt tokenization?
- [ ] Are raw HTML tags avoided inside comment strings?
- [ ] Are comments kept concise, functioning as compact labels for rapid scanning rather than paragraphs?

## Code Comments | 10 | The Single Load-Bearing Word in Uppercase Bold

- [ ] Is the single load-bearing architectural term in each standard comment formatted in uppercase bold (`// Renders subscriber **NAME**` or `// Captures keypress in **STATE**`)?
- [ ] Is bold uppercase formatting restricted to exactly one keyword per comment, preserving visual contrast?

- [ ] PROPER EXAMPLE: Highlighting a single load-bearing keyword:

> ```jsx
> const [status, setStatus] = useState('idle'); // Tracks submission **STATUS**
> ```

Notes: The single load-bearing concept is highlighted, making the role of the state variable immediately clear.

## Code Comments | 11 | Sequential Numbering in Multi-Step Snippets

- [ ] When a snippet demonstrates a multi-step execution pipeline, are steps numbered sequentially inside the comments (`// (1) ...`, `// (2) ...`, `// (3) ...`)?
- [ ] Does sequential numbering guide the reader through the chronological execution path (e.g. event trigger → state update → DOM reconciliation)?

- [ ] PROPER EXAMPLE: Numbering sequential steps:

> ```jsx
> const formData = new FormData(e.currentTarget); // (1) Harvest native input values
> const title = formData.get('title');            // (2) Extract specific form field
> setTitle(title);                                // (3) Synchronize into React state
> ```

Notes: Clearly labels the 3-step pipeline in chronological order.

## Code Comments | 12 | Tag-Free Code Comments & The Verdict Tag Protocol #2026_09_21_18_group_1 (superseding #2026_09_21_15_group_1)

- [ ] Are code comments authored in clean, natural English without uppercase category prefix tags?
- [ ] Are bureaucratic category tags avoided across all code blocks (dropping `CODE LOGIC:`, `DATA FLOW:`, `CLIENT API:`, `COMPONENT:`, `DOM CONTAINER:`, `ROOT INITIALIZATION:`, `TREE PROJECTION:`)?
- [ ] When demonstrating broken code (illegal syntax, compiler crashes, reserved keyword collisions, runtime exceptions), does the comment lead with the clear verdict tag `// **WRONG:** [consequence with uppercase bold **KEYWORD**]`? #2026_09_21_30_group_1
- [ ] When code is runnable but flawed (performance bottleneck, memory leak, fragile selector), does the comment use a descriptive uppercase qualifier (e.g. `// **SLOW:** 45s cold start compiling all **FILES** into memory`, `// **FRAGILE:** breaks silently if markup changes **ID**`, or `// **LEAK:** uncleaned subscription retains **MEMORY**`)? #2026_09_21_30_group_1
- [ ] In standard working code (Stage C assembly, idiomatic solutions), are clean, tag-free comments used, avoiding `**RIGHT:**` when no broken counterpart is being contrasted?
- [ ] Are comments kept concise and readable within the speech bubble layout?
- [ ] In principle comparison cards (`> [!PRINCIPLE]`), do comments follow the Visceral Action-Pair Standard (#2026_09_26_01_group_1), describing the developer's physical code action with active verb phrases (e.g. `// Composing custom React components` vs `// Dumping raw HTML tags`) while strictly avoiding academic buzzwords ("conflating", "coupling", "entanglement")? #2026_09_26_01_group_1

- [ ] PROPER EXAMPLE: Clean natural comments without prefix tags:

> ```jsx
> const [query, setQuery] = useState(''); // Holds search query for per-keystroke **SYNCHRONIZATION**
> <LiveSearchInput query={query} onChange={setQuery} /> // Passes query downward and setter for **INVERSE FLOW**
> ```

Notes: Comments explain the physical role in natural English with single bold keywords; zero category prefix tags.

- [ ] PROPER EXAMPLE (THE CONTRAST EXCEPTION): Contrasting anti-patterns against valid patterns:

> ```jsx
> const title = props.headline; // **WRONG:** bypasses declared component contracts
> const { headline } = props;  // **RIGHT:** unpacks declared prop explicitly
> ```

Notes: The `**WRONG:**` and `**RIGHT:**` tags are permitted here because the block explicitly contrasts an anti-pattern against the correct pattern.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Redundant bureaucratic classification prefix tags:

> ```jsx
> const [query, setQuery] = useState(''); // **CODE LOGIC:**<br>Holds search query locally
> <LiveSearchInput query={query} onChange={setQuery} /> // **DATA FLOW:**<br>Passes state downward
> ```

Notes: Clutters speech bubbles with redundant classification tags instead of natural explanation.

## Right & Wrong Blocks | 13 | Anti-Pattern Window Tags and Directive Headers

- [ ] Are right and wrong comparative blocks authored using the `right` or `wrong` window tag on the opening fence (` ```jsx right ` or ` ```jsx wrong `)?
- [ ] Does the compiler render the `right` tag with an emerald checkmark side panel and the `wrong` tag with a rose cross side panel?
- [ ] Is a flush-left directive header in bold placed directly above the code fence:
    * `**DO THIS:** [concise instruction in normal weight]`
    * `**DO NOT DO THIS:** [concise instruction in normal weight]`
- [ ] Is code inside tagged `right` and `wrong` blocks kept free of internal comments, allowing the directive header above the block to carry the instruction?
- [ ] Are tagged `right` and `wrong` blocks reserved for closing `### Summary` sections, while narrative editor windows in the main body remain standard blocks with speech bubble comments? #2026_09_21_17_group_1

- [ ] PROPER EXAMPLE: Clean directive header with tagged fence:

> **DO THIS:** read input values through component state on every render
>
> ```jsx right
> const [title, setTitle] = useState('');
> return (<input value={title} onChange={(e) => setTitle(e.target.value)} />);
> ```

Notes: Bold directive header placed above the code block, `right` tag applied to fence, and zero internal comments.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Missing directive header and duplicate internal comments:

> ```jsx wrong
> // DO NOT DO THIS
> // this reads the DOM directly
> const title = document.querySelector('input').value;
> return (<input defaultValue={title} />);
> ```

Notes: Missing the external directive header, and duplicates instructions as internal comments where comments are avoided.

## Callout Code Windows | 14 | Inset Display Code Blocks in Alert Cards #2026_09_22_10_group_1

- [ ] When illustrating syntax transformations, compiler AST outputs, or input/output pairings inside alert callouts (`[!WILD]`, `[!TIP]`, `[!NOTE]`), are code snippets authored as dedicated display blocks using backticks? #2026_09_22_10_group_1
- [ ] Does the callout avoid embedding multi-word statements, JSX elements, or transpiled function calls into running text as inline pills, preventing horizontal text overflow in print? #2026_09_22_10_group_1
- [ ] Are input code and output transpilation separated onto their own lines with distinct introductory lead-ins ("When nesting elements in JSX:" and "The compiler translates inner tags into a children prop:")? #2026_09_22_10_group_1
- [ ] Are structured JSX and nested function calls formatted across multiple indented lines so the AST hierarchy and prop mappings are immediately clear? #2026_09_22_10_group_1
- [ ] Do code blocks inside callouts render with a clean 1px perimeter and light drop shadow on a pure white surface, omitting heavy left accent stripes? #2026_09_22_10_group_1

- [ ] PROPER EXAMPLE: Formatted code blocks inside an alert card:

> ```markdown
> > [!WILD]
> > **How does JSX compile nested children under the hood?**
> >
> > When nesting elements in JSX:
> > `<ArticleBox>
> >   <Headline title="Breaking" />
> > </ArticleBox>`
> >
> > The JSX compiler converts the inner tag directly into a prop named `children`:
> > `_jsx(ArticleBox, {
> >   children: _jsx(Headline, {
> >     title: "Breaking"
> >   })
> > })`
> >
> > If you pass multiple sibling elements, `props.children` becomes an array of React elements. The `children` prop is not magic; it is simply a standard JavaScript object property populated automatically by the JSX parser whenever tags enclose content.
> ```

Notes: Indented multi-line snippets deconstruct the compiler AST cleanly without overflowing the card container. #2026_09_22_10_group_1

## Display Code Invariants | 14B | Single-Block Multiline Backtick Invariant #2026_09_25_09_group_1 revised by #2026_09_26_14_group_1

- [ ] Are multiline code snippets in narrative prose paragraphs enclosed within a single pair of opening and closing backticks, avoiding shredded line-by-line backticks in narrative text? #2026_09_25_09_group_1
- [ ] In principle comparative cards (`*It is best practice to do this:*` / `*Instead of doing this:*`), does the author wrap each code line in single backticks (e.g. `` `  return (` ``) with rigid 2-space JSX nesting to guarantee that leading indentation is never stripped by markdown parsers? #2026_09_26_14_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid in narrative prose: Shredded line-by-line backticks in narrative text:
> `return (`
> `  <article className="card">`
> `    <h2>title</h2>`
> `  </article>`
> `);`

Notes: In narrative prose, wrapping every line in separate backticks forces the compiler to treat each line as an independent callout block, producing multiple stacked boxes with orphaned closing tags. #2026_09_25_09_group_1

- [ ] PROPER EXAMPLE: Single-block multiline backticks in narrative prose:
> `return (
>   <article className="card">
>     <h2>title</h2>
>   </article>
> );`

Notes: In narrative prose, a single pair of opening and closing backticks allows the compiler to render one coherent display card preserving internal line breaks and indentation. In contrast, principle comparison cards (`[!PRINCIPLE]`) use dedicated line-by-line backticks (`  code`) to populate the dual-column comparison grid with rigid indentation. #2026_09_25_09_group_1 revised by #2026_09_26_14_group_1

## JSX Return Formatting | 15 | Parentheses on JSX Returns #2026_09_24_03_group_1

- [ ] Are JSX return values wrapped in parentheses `(...)`, including single-line returns (`return (<span>{name}</span>);` rather than bare `return <span>{name}</span>;`)?
- [ ] Is wrapping JSX returns in parentheses applied consistently across code examples, component functions, principle cards, right/wrong snippets, and summaries?
- [ ] Does wrapping JSX returns in parentheses protect against Automatic Semicolon Insertion (ASI) issues when lines are refactored across rows?

- [ ] PROPER EXAMPLE: Wrapping one-line returns in parentheses:

> ```jsx title="ReaderGreeting.jsx"
> export default function ReaderGreeting({ name }) {
>   return (<span>Welcome, {name}</span>);
> }
> ```

Notes: Wraps the one-line JSX return in parentheses, establishing consistent defensive patterns against Automatic Semicolon Insertion bugs.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Omitting parentheses on a JSX return:

> ```jsx title="ReaderGreeting.jsx"
> export default function ReaderGreeting({ name }) {
>   return <span>Welcome, {name}</span>;
> }
> ```

Notes: Omits parentheses on the JSX return, which can lead to silent ASI errors when lines are broken.
