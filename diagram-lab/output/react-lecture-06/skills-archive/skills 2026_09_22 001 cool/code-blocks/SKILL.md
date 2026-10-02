---
name: code-blocks
description: Governs code windows, line ceilings, continuation attributes, and comment conventions inside lectures; use when writing or reviewing any code block in a lecture.
---

# Code Blocks

This skill governs how code blocks are authored in lecture Markdown: editor windows and filename tabs, the 10-line hard ceiling, continuation attributes that stitch long files across progressive steps, end-of-line `//` comment bubbles, tag-free natural English comments, and right/wrong comparative blocks. The build compiler (`src/build-lectures.mjs`) parses plain Markdown fences and generates styled HTML editor windows.

Digests: `skills/old-instructions/instructions.md` (code block format) and `skills/old-instructions/AUTHOR-BRIEF.md` (hard format rules).

## Code Windows | 01 | Clean Fencing and Supported Language Tags

[ ] Open every code block with a recognized language tag: ` ```jsx `, ` ```js `, ` ```tsx `, ` ```ts `, ` ```javascript `, ` ```typescript `, or ` ```bash `.
[ ] Close every code block with a matching closing fence ` ``` ` placed on its own line.
[ ] Prefer `jsx` as the standard language tag for all React component code.
[ ] Author complete, runnable snippets whenever demonstrating a pattern: a self-contained snippet that can be executed in an editor teaches more effectively than disconnected fragments.

[ ] PROPER EXAMPLE: make sure you follow this example, a complete minimal component in a clean code window:

> ```jsx
> import { useState } from 'react';
> export default function App() {
>   const [count, setCount] = useState(0);
>   return <button onClick={() => setCount(count + 1)}>Clicks: {count}</button>;
> }
> ```

Notes: Uses the `jsx` language tag, closes cleanly, and provides a runnable component with zero leading empty lines.

## Code Windows | 02 | Filename Tabs and Title Attributes

[ ] Add a `title="..."` attribute to the opening code fence whenever the default filename does not match the actual file name.
[ ] Rely on derived defaults when they fit: `jsx` yields `App.jsx`, `tsx` yields `App.tsx`, `js` yields `App.js`, and `ts` yields `App.ts`. Override the title whenever introducing another file in the project.
[ ] Use registered filenames from the lecture's file tree for runnable project code (such as `title="SearchBar.jsx"`).
[ ] Use explicit conceptual titles without `.jsx` extensions for historical or pre-React 19 comparisons (such as `title="Historical Pattern"` or `title="Naive Implementation"`). This prevents the compiler from flagging fictitious files.

[ ] PROPER EXAMPLE: make sure you follow this example, overriding the default tab with a real filename:

> ```jsx title="SearchBar.jsx"
> export default function SearchBar({ query, onChange }) {
>   return <input value={query} onChange={(e) => onChange(e.target.value)} />;
> }
> ```

Notes: Explicitly names `SearchBar.jsx`, matching the project file tree and providing an accurate editor tab.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```jsx title="Search Input Prompter Widget FINAL v2.jsx"
> export default function SearchBar({ query, onChange }) {
>   return <input value={query} onChange={(e) => onChange(e.target.value)} />;
> }
> ```

Notes: Uses a cluttered, unregistered filename that does not exist in the project, triggering compiler warnings and confusing the reader.

## Code Windows | 03 | Density, Indentation & 80-Character Boundary

[ ] Eliminate empty lines inside code blocks where possible: every source line renders as a numbered row in print, and blank lines waste vertical space.
[ ] Keep top-level code flush against the left margin: indentation is rendered literally by the compiler, so stray leading spaces misalign the editor.
[ ] Keep all code lines under 80 characters. Break long object literals, method chains, and JSX attribute lists across multiple rows manually.
[ ] Format JSX elements with one prop per line whenever a component takes two or more attributes, ensuring props remain readable without accidental wrapping.

[ ] PROPER EXAMPLE: make sure you follow this example, formatting attributes with natural line breaks:

> ```jsx
> <button
>   formAction={() => saveArticle(article)}
>   disabled={pending}
> >
>   Save
> </button>
> ```

Notes: Each attribute occupies its own line, keeping the snippet comfortably below the 80-character boundary.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```jsx
> <button formAction={() => saveArticle(article)} disabled={pending} style={{ marginTop: 12, padding: '6px 14px' }}>Save</button>
> ```

Notes: Far exceeds 80 characters, forcing accidental mid-attribute line wraps that break visual editor alignment in PDF layout.

## Code Windows | 04 | Zero Author-Side HTML Styling

[ ] Author code blocks using plain Markdown syntax and natural language comments (`//` for JavaScript/JSX, `#` for Bash/Shell, or `<!--` for HTML). #2026_09_21_23_group_1
[ ] Never insert raw HTML `<span>` tags, inline CSS classes, or hardcoded bubble containers into lecture code blocks: the build script automatically constructs macOS traffic lights, tab bars, alternating row shading, and speech bubbles.
[ ] Inserting raw HTML tags inside code fences causes the syntax highlighter to double-encode entities and corrupts the rendered window.

## Line Ceilings | 05 | The 10-Line Hard Ceiling

[ ] Restrict every code block to 10 or fewer lines of executable code: line 11 is an automatic quality defect.
[ ] Slicing components longer than 10 lines across sequential micro-steps is mandatory.
[ ] Slicing code forces thorough, step-by-step deconstruction, preventing overwhelming walls of code from alienating tired readers.

[ ] PROPER EXAMPLE: make sure you follow this example, a focused component under the 10-line ceiling:

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

[ ] COUNTER-EXAMPLE: do not follow this bad example, dumping a multi-concern component into a single window:

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

Notes: 14 lines long, combines 3 distinct UI concerns, exceeds the 10-line budget, and must be sliced across progressive micro-steps.

## File Continuations | 06 | Slicing Files with Continuation Attributes

[ ] When a single component file is sliced across multiple steps in Stage C, stitch the snippets together using continuation attributes on the code fences: #2026_09_21_31_group_1
    * First snippet: `title="Name.jsx" startLine="1" continues="bottom"`
    * Intermediate snippets: `title="Name.jsx" startLine="NN" continues="both"`
    * Final snippet: `title="Name.jsx" startLine="NN" continues="top"`
[ ] The builder compiles matching continuation attributes into seamless editor windows featuring continuation tabs, proving to the reader that the code belongs to one continuous file.
[ ] Slicing Invariant vs Progressive Refactoring: Continuation attributes (`continues`) are strictly reserved for slicing a single continuous file across line budgets. Never use continuation attributes for progressive revisions or refactorings of the same component. Intermediate and final continuation blocks (`continues="both"` or `continues="top"`) MUST have `startLine > 1`, calculated strictly as `previous_startLine + previous_lineCount`. Continuation blocks must NEVER re-declare `export default function ...` or re-open `return (` if already declared in the opening block. #2026_09_21_31_group_1

[ ] PROPER EXAMPLE: make sure you follow this example, slicing a component across continuation fences:

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

[ ] Start every code block directly on its first line of real, executable code.
[ ] Never begin a code block with a blank line or a decorative comment: `startLine` must count real code.
[ ] Leading blank lines create empty numbered rows at the top of the editor window, degrading layout presentation in print.

## Code Comments | 08 | Inline Comments and Speech Bubble Rendering

[ ] Attach code comments directly to the end of the line they annotate: `code; // annotation` or `command # annotation`. #2026_09_21_23_group_1
[ ] The build compiler automatically extracts inline comments—supporting standard `//` in JavaScript/JSX, native `#` in Bash/Shell, and `<!--` in HTML—and transforms them into floating speech bubbles in the right-hand panel of the editor window. #2026_09_21_23_group_1
[ ] Avoid placing comments on their own standalone lines above code unless writing a general block header: standalone comment lines take up full vertical rows and prevent speech bubble generation.
[ ] The Algorithmic Comment Audit Gate: Protect the two-column editor layout. Leaving any narrative code block (≥3 lines, including Shell, JSON, HTML, and JSX) with zero comments produces a barren, unbalanced window and fails the audit. Every non-trivial code block must carry end-of-line comments on its load-bearing lines. Each comment must feature exactly one load-bearing term in uppercase bold (e.g. `// Compiles JSX on demand via **ESBUILD**` or `npm run dev # Launches local server on **PORT** 5173`). Banning comments in tagged summary right/wrong blocks does NOT mean stripping comments from narrative code windows. #2026_09_21_30_group_1 (refining #2026_09_21_17_group_1)
[ ] Comments Must Follow the Content of the Text: Code comments must track the mind of the reader. What the surrounding text underlines, introduces, or discusses, the code comments must also underline on that exact line of code, using the same vocabulary. Never leave the primary concept discussed in the prose unannotated while placing comments only on secondary lines below it. #2026_09_21_13_group_1

[ ] PROPER EXAMPLE: make sure you follow this example, end-of-line comments driving speech bubbles:

> ```jsx
> const [query, setQuery] = useState(''); // Stores current search text
> return <input value={query} onChange={setQuery} />; // Synchronizes input on keypress
> ```

Notes: Each comment sits at the end of its line, allowing the compiler to generate structured speech bubbles.

## Code Comments | 09 | Syntax Safety and Bubble Formatting

[ ] Write speech bubble comments using plain alphanumeric characters and minimal inline markdown.
[ ] Avoid trailing commas, semicolons, or stray closing symbols inside comments that could disrupt parser tokenization.
[ ] Never embed raw HTML tags inside comment strings.
[ ] Keep comments concise: a speech bubble is a compact label designed for rapid scanning, not an explanatory paragraph.

## Code Comments | 10 | The Single Load-Bearing Word in Uppercase Bold

[ ] Emphasize the single load-bearing architectural term in each standard comment by formatting it in uppercase bold: `// Renders subscriber **NAME**` or `// Captures keypress in **STATE**`.
[ ] Restrict bold uppercase formatting to exactly one keyword per comment. Bolding entire sentences eliminates visual contrast and defeats the purpose of the callout.

[ ] PROPER EXAMPLE: make sure you follow this example, highlighting a single load-bearing keyword:

> ```jsx
> const [status, setStatus] = useState('idle'); // Tracks submission **STATUS**
> ```

Notes: The single load-bearing concept is highlighted, making the role of the state variable immediately clear.

## Code Comments | 11 | Sequential Numbering in Multi-Step Snippets

[ ] When a snippet demonstrates a multi-step execution pipeline, number the steps sequentially inside the comments: `// (1) ...`, `// (2) ...`, `// (3) ...`.
[ ] Sequential numbering guides the reader's eye through the chronological execution path (for example, event trigger $\rightarrow$ state update $\rightarrow$ DOM reconciliation).

[ ] PROPER EXAMPLE: make sure you follow this example, numbering sequential steps:

> ```jsx
> const formData = new FormData(e.currentTarget); // (1) Harvest native input values
> const title = formData.get('title');            // (2) Extract specific form field
> setTitle(title);                                // (3) Synchronize into React state
> ```

Notes: Clearly labels the 3-step pipeline in chronological order.

## Code Comments | 12 | Tag-Free Code Comments & The Verdict Tag Law #2026_09_21_18_group_1 (superseding #2026_09_21_15_group_1)

[ ] Author all code comments in clean, natural English without uppercase category prefix tags.
[ ] Ban all category tags across all code blocks: strictly drop `CODE LOGIC:`, `DATA FLOW:`, `CLIENT API:`, `COMPONENT:`, `DOM CONTAINER:`, `ROOT INITIALIZATION:`, `TREE PROJECTION:`, and similar classification labels. Speech bubbles exist to explain line mechanics to the reader, not to catalog bureaucratic taxonomies.
[ ] The Broken Code & Trap Verdict Mandate: Whenever a line of code is flat-out WRONG (illegal syntax, fatal compiler crashes, reserved keyword collisions, unclosed tags, returning multiple root siblings, runtime exceptions, or illegal mutations), the comment MUST lead with the verdict tag `// **WRONG:** [consequence with uppercase bold **KEYWORD**]`. The reader requires an immediate, unequivocal verdict on broken code. #2026_09_21_30_group_1
[ ] Problematic & Flawed Code Qualifiers (**SLOW:**, **FRAGILE:**, **LEAK:**): When code is syntactically valid and runnable but suffers from a specific architectural flaw or performance bottleneck that the text wants to flag, do NOT use `**WRONG:**`. The author should find a short uppercase qualifier naming the specific problem and prefix the comment with it: e.g. `// **SLOW:** 45s cold start compiling all **FILES** into memory`, `// **FRAGILE:** breaks silently if markup changes **ID**`, or `// **LEAK:** uncleaned subscription retains **MEMORY**`. #2026_09_21_30_group_1
[ ] Standard Working Code: In Stage C assembly steps, idiomatic solutions, and pedagogical walkthroughs, author clean, tag-free comments with a single load-bearing term in uppercase bold (Section 10) or sequential numbering (Section 11). Never prefix standard code with `**RIGHT:**` when no wrong counterpart is being contrasted.
[ ] Keep comments concise: a speech bubble is a compact label designed for rapid scanning, not an explanatory paragraph.

[ ] PROPER EXAMPLE: make sure you follow this example, using clean natural comments without prefix tags:

> ```jsx
> const [query, setQuery] = useState(''); // Holds search query for per-keystroke **SYNCHRONIZATION**
> <LiveSearchInput query={query} onChange={setQuery} /> // Passes query downward and setter for **INVERSE FLOW**
> ```

Notes: Comments explain the physical role in natural English with single bold keywords; zero category prefix tags.

[ ] PROPER EXAMPLE (THE EXCEPTION): make sure you follow this example when labeling contrasting right vs wrong lines:

> ```jsx
> const title = props.headline; // **WRONG:** bypasses declared component contracts
> const { headline } = props;  // **RIGHT:** unpacks declared prop explicitly
> ```

Notes: The `**WRONG:**` and `**RIGHT:**` tags are permitted here because the block explicitly contrasts an anti-pattern against the correct pattern.

[ ] COUNTER-EXAMPLE: do not follow this bad example, stuffing bureaucratic uppercase category tags into comments:

> ```jsx
> const [query, setQuery] = useState(''); // **CODE LOGIC:**<br>Holds search query locally
> <LiveSearchInput query={query} onChange={setQuery} /> // **DATA FLOW:**<br>Passes state downward
> ```

Notes: Clutters speech bubbles with redundant classification tags instead of natural explanation.

## Right & Wrong Blocks | 13 | Anti-Pattern Window Tags and Directive Headers

[ ] Author right and wrong anti-pattern comparisons using the `right` or `wrong` window tag on the opening fence: ` ```jsx right ` or ` ```jsx wrong `.
[ ] The compiler renders the `right` tag with an emerald checkmark side panel and the `wrong` tag with a rose cross side panel.
[ ] Place a flush-left directive header in bold directly above the code fence:
    * `**DO THIS:** [concise instruction in normal weight]`
    * `**DO NOT DO THIS:** [concise instruction in normal weight]`
[ ] Keep the code inside tagged `right` and `wrong` blocks completely free of internal comments: the instruction lives in the directive header above the block (`**DO THIS:**` / `**DO NOT DO THIS:**`), and internal comments create visual clutter. This comment ban applies strictly and exclusively to blocks carrying the `right` or `wrong` fence tag.
[ ] Restrict tagged `right` and `wrong` blocks to closing `### Summary` sections. All narrative macOS editor windows in the main body (such as `title="Naive Pattern"` or `title="Historical Pattern"` in Section 1) are standard code blocks, not tagged comparison fences, and must include inline speech bubble comments to highlight friction points. #2026_09_21_17_group_1

[ ] PROPER EXAMPLE: make sure you follow this example, clean directive header with tagged fence:

> **DO THIS:** read input values through component state on every render
>
> ```jsx right
> const [title, setTitle] = useState('');
> return <input value={title} onChange={(e) => setTitle(e.target.value)} />;
> ```

Notes: Bold directive header placed above the code block, `right` tag applied to fence, and zero internal comments.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```jsx wrong
> // DO NOT DO THIS
> // this reads the DOM directly
> const title = document.querySelector('input').value;
> return <input defaultValue={title} />;
> ```

Notes: Missing the external directive header, and duplicates instructions as internal comments where comments are banned.
