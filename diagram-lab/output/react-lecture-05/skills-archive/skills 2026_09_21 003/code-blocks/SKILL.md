---
name: code-blocks
description: Governs code windows, line ceilings, continuation attributes, and comment conventions inside lectures; use when writing or reviewing any code block in a lecture.
---

# Code Blocks

This skill governs how code blocks are authored in lecture Markdown: editor windows and filename tabs, the 10-line hard ceiling, continuation attributes that stitch long files across progressive steps, end-of-line `//` comment bubbles, structured assembly annotations (`CODE LOGIC` and `DATA FLOW`), and right/wrong comparative blocks. The build compiler (`src/build-lectures.mjs`) parses plain Markdown fences and generates styled HTML editor windows.

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

[ ] Author code blocks using plain Markdown syntax and standard `//` comments only.
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

[ ] When a single component file is sliced across multiple steps in Stage C, stitch the snippets together using continuation attributes on the code fences:
    * First snippet: `title="Name.jsx" startLine="1" continues="bottom"`
    * Intermediate snippets: `title="Name.jsx" startLine="NN" continues="both"`
    * Final snippet: `title="Name.jsx" startLine="NN" continues="top"`
[ ] The builder compiles matching continuation attributes into seamless editor windows featuring continuation tabs, proving to the reader that the code belongs to one continuous file.
[ ] Calculate `startLine="NN"` accurately so line numbering reflects the cumulative line position within the assembled file.

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

[ ] Attach code comments directly to the end of the line they annotate: `code; // annotation`.
[ ] The build compiler automatically extracts inline `//` comments and transforms them into floating speech bubbles in the right-hand panel of the editor window.
[ ] Avoid placing comments on their own standalone lines above code unless writing a general block header: standalone comment lines take up full vertical rows and prevent speech bubble generation.

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

## Structured Annotations | 12 | The CODE LOGIC and DATA FLOW Tags #2026_09_20_04_group_6

[ ] In Stage C assembly steps, annotate load-bearing lines with one of the two structured tags:
    * `// **CODE LOGIC:**<br>[one concise clause]`
    * `// **DATA FLOW:**<br>[one concise clause]`
[ ] Apply the two tags based on the primary role of the line:
    * Use `CODE LOGIC` when the line computes, validates, locks, or manages internal state.
    * Use `DATA FLOW` when data, callbacks, or events cross a component boundary.
[ ] Never stack both tags on the same line: choose the single most significant architectural duty of that line.
[ ] Write the annotation text following `<br>` as a single concise clause with load-bearing words bolded; never insert multi-sentence paragraphs into comment bubbles.
[ ] Restrict structured tags strictly to Stage C assembly steps. All other code blocks (introductory snippets, anti-pattern comparisons, summary blocks) use standard concise comments.

[ ] PROPER EXAMPLE: make sure you follow this example, using structured tags on appropriate lines:

> ```jsx
> const [query, setQuery] = useState(''); // **CODE LOGIC:**<br>Holds search query locally for per-keystroke synchronization
> <LiveSearchInput query={query} onChange={setQuery} /> // **DATA FLOW:**<br>Passes state downward and callback setter for inverse flow
> ```

Notes: Line 1 manages local state (`CODE LOGIC`); Line 2 passes props across a boundary (`DATA FLOW`).

[ ] COUNTER-EXAMPLE: do not follow this bad example, writing long paragraphs inside annotations:

> ```jsx
> const contributor = formData.get('contributor'); // **CODE LOGIC:**<br>Reads the contributor name from the native buffer that the browser maintains, which was populated while the user typed, and this happens with zero re-renders because React never runs during typing
> ```

Notes: The annotation text is an entire run-on paragraph, overwhelming the speech bubble layout.

## Right & Wrong Blocks | 13 | Anti-Pattern Window Tags and Directive Headers

[ ] Author right and wrong anti-pattern comparisons using the `right` or `wrong` window tag on the opening fence: ` ```jsx right ` or ` ```jsx wrong `.
[ ] The compiler renders the `right` tag with an emerald checkmark side panel and the `wrong` tag with a rose cross side panel.
[ ] Place a flush-left directive header in bold directly above the code fence:
    * `**DO THIS:** [concise instruction in normal weight]`
    * `**DO NOT DO THIS:** [concise instruction in normal weight]`
[ ] Keep the code inside right and wrong blocks completely free of comments: the instruction lives in the header line above the block, and comments inside the snippet create visual clutter.
[ ] Restrict right and wrong blocks to closing `### Summary` sections and direct in-body anti-pattern comparisons. Do not apply them to terminal commands, configuration files, or standard scaffolding steps.

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
