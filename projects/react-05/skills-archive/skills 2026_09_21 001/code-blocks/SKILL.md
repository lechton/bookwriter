---
name: code-blocks
description: Governs code windows, line ceilings, continuation attributes, and comment conventions inside lectures; use when writing or reviewing any code block in a lecture.
---

# Code Blocks

This skill governs how code blocks are authored in lecture Markdown: the code window and its `title` attribute, the 10-line hard ceiling, the continuation attributes that stitch a long file across micro-steps, and the `//` comment conventions that drive the speech-bubble rendering. The build script (`src/build-lectures.mjs`) transforms every code block into an editor-style window, so the author writes plain Markdown and the builder produces the styled HTML. Digests: skills/old-instructions/instructions.md (code block format) and AUTHOR-BRIEF.md (hard format rules).

## Code Windows | 01 | Open and close every code block cleanly

[ ] Open each code block with a language tag the highlighter knows: ` ```jsx `, ` ```js `, ` ```tsx `, ` ```ts `, ` ```javascript `, or ` ```typescript `, and close it with ` ``` ` on its own line, so every opener has a matching closer.

[ ] Prefer the `jsx` tag for component code, since all six supported tags share the same JS/JSX tokenizer and the choice mainly drives the default filename tab.

[ ] Aim for complete, runnable snippets, since a snippet the reader could paste and run teaches more than a fragment that cannot stand alone.

[ ] PROPER EXAMPLE: make sure you follow this example, a complete minimal component in a clean code window:

> ```jsx
> import { useState } from 'react';
> export default function App() {
>   const [count, setCount] = useState(0);
>   return <button onClick={() => setCount(count + 1)}>Clicks: {count}</button>;
> }
> ```

Notes: the opener carries the language tag, the closer sits on its own line, and the snippet is dense and runnable with no blank lines.

## Code Windows | 02 | Give every code block a filename tab

[ ] Write the `title="..."` attribute on the code window opener whenever the default derived filename would mislead, since the editor chrome with its filename tab renders for every code block.

[ ] Rely on the derived default when it fits: `jsx`/`javascript` yields `App.jsx`, `tsx`/`typescript` yields `App.tsx`, `js` yields `App.js`, `ts` yields `App.ts`, and anything else yields `code.txt`, so the override is only needed when the real filename differs.

[ ] Use a real, registered filename for runnable project code, and a conceptual title without a `.jsx` extension (such as `title="Historical Pattern"`) for legacy or pre-React 19 comparisons, so the compiler raises no completeness warnings about fictitious files.

[ ] PROPER EXAMPLE: make sure you follow this example, overriding the default tab with the real file name:

> ```jsx title="SearchBar.jsx"
> export default function SearchBar({ query, onChange }) {
>   return <input value={query} onChange={(e) => onChange(e.target.value)} />;
> }
> ```

Notes: the reader sees a `SearchBar.jsx` tab instead of the misleading default `App.jsx`, and the name matches a real file in the lecture.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```jsx title="Search Input Prompter Widget FINAL v2.jsx"
> export default function SearchBar({ query, onChange }) {
>   return <input value={query} onChange={(e) => onChange(e.target.value)} />;
> }
> ```

Notes: the title names a file that does not exist anywhere in the project, so the compiler completeness check flags it and the reader hunts for a phantom file.

## Code Windows | 03 | Keep the editor dense and narrow

[ ] Write snippets without blank lines where you can, since every source line becomes a numbered row and blank lines render as empty numbered rows that waste vertical space.

[ ] Keep top-level code flush against the left margin, since indentation inside code blocks is rendered literally and stray leading spaces shift the code right.

[ ] Keep every line under about 80 characters, and break long object literals and JSX attributes yourself, one property or attribute per row, so the break lands where the code reads best rather than where the container happens to wrap.

[ ] Prefer one prop per line in JSX lectures, since the built row wraps as a safety net, not as a style, and a self-chosen break reads cleaner than an accidental one.

[ ] PROPER EXAMPLE: make sure you follow this example, self-broken attributes at natural boundaries:

> ```jsx
> <button
>   formAction={() => saveArticle(article)}
>   disabled={pending}
> >
>   Save
> </button>
> ```

Notes: each attribute owns its row, so no line approaches the wrap threshold and the reader's eye tracks the props cleanly.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```jsx
> <button formAction={() => saveArticle(article)} disabled={pending} style={{ marginTop: 12, padding: '6px 14px' }}>Save</button>
> ```

Notes: the line far exceeds 80 characters, so the built row wraps mid-attribute and the parallel visual layout of the editor breaks.

## Code Windows | 04 | Leave the styling to the builder

[ ] Write plain Markdown code and `//` comments only, since the build script produces the editor window, the traffic-light dots, the filename tab, the line numbers, the alternating row backgrounds, and the bubble markup.

[ ] Avoid hand-written `<span>` tags, CSS classes, or bubble markup in lecture Markdown, since the highlighter double-encodes them and the output is wrong.

[ ] PROPER EXAMPLE: make sure you follow this example, author-side source only:

> ```jsx
> const [count, setCount] = useState(0); // the pair every component starts from
> ```

Notes: the author wrote one code line and one `//` comment; the builder turns the comment into a speech bubble under the row, and no markup was hand-written.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```jsx
> const [count, setCount] = useState(0); <span class="kw">const</span> <div class="bubble">the pair</div>
> ```

Notes: the hand-written span and bubble markup get double-encoded by the highlighter, so the raw tags appear as literal text inside the rendered editor.

## Ceilings | 05 | Honor the 10-line hard ceiling

[ ] Keep every code block at 10 or fewer lines of executable code, since line 11 is a defect in both pre-lecture blueprints and production lectures.

[ ] Treat the ceiling as the driver of progressive code assembly: a large or multi-step component is sliced across sequential micro-steps, each block within the ceiling, each accompanied by focused explanatory prose between the slices.

[ ] PROPER EXAMPLE: make sure you follow this example, a component introduced in two compliant slices:

> ```jsx
> export default function FeedbackApp() {
>   const [likes, setLikes] = useState(0);
>   const [saved, setSaved] = useState(false);
>   async function saveLike() {
>     await fetch('/api/like', { method: 'POST' });
>     setSaved(true);
>   }
> ```

> ```jsx
>   return (
>     <button onClick={() => { setLikes(likes + 1); saveLike(); }}>
>       Likes: {likes}
>     </button>
>   );
> }
> ```

Notes: each slice fits the ceiling and the intervening prose explains the step, so the reader assembles the file piece by piece instead of swallowing a wall of syntax.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```jsx
> export default function FeedbackApp() {
>   const [likes, setLikes] = useState(0);
>   const [saved, setSaved] = useState(false);
>   const [pending, setPending] = useState(false);
>   const [error, setError] = useState(null);
>   async function saveLike() {
>     setPending(true);
>     try {
>       await fetch('/api/like', { method: 'POST' });
>       setSaved(true);
>     } catch (e) {
>       setError(e);
>     } finally {
>       setPending(false);
>     }
>   }
>   return <button onClick={() => { setLikes(likes + 1); saveLike(); }}>Likes: {likes}</button>;
> }
> ```

Notes: the block runs far past line 10, so it reads as a monolithic dump and the reader loses the micro-step rhythm the ceiling exists to protect.

## Ceilings | 06 | Comment the body blocks that earn it

[ ] Give every non-trivial body code block of roughly 8 or more lines clear pedagogical end-of-line comments attached to its critical expressions, state declarations, effects, or handler dispatches, since uncommented bare walls of syntax teach nothing.

[ ] Keep summary code blocks comment-free instead, since the `right`/`wrong` window format carries the instruction above the block (see the Right and Wrong section below in this skill).

[ ] PROPER EXAMPLE: make sure you follow this example, an 8-line body block with end-of-line labels:

> ```jsx
> likes += 1;        // 1. optimistic override: increment **LOCALLY** immediately
> await saveLike();  // 2. tell the server to **SAVE** the change
> likes -= 1;        // 3. rollback: if the request failed, **REVERT** the override
> ```

Notes: each load-bearing line carries a short label, so the bubbles tell the three-step story while the prose around the snippet carries the explanation.

## Continuations | 07 | Stitch sliced files with continuation attributes

[ ] Mark the first slice of a continued file with `continues="bottom"` and `startLine="1"` plus the `title`, since it renders the full macOS window bar with dots and tab and a flat bottom edge.

[ ] Mark every middle slice with `continues="both"` and `startLine="NN"`, since it renders flat top and bottom and resumes line numbering from `NN`.

[ ] Mark the final slice with `continues="top"` and `startLine="NN"`, since it renders a flat top with a rounded bottom and seals the file cleanly.

[ ] PROPER EXAMPLE: make sure you follow this example, a file split into a top and a bottom slice:

> ```jsx title="App.jsx" startLine="1" continues="bottom"
> export default function App() {
>   const [items, setItems] = useState([]);
> ```

> ```jsx startLine="3" continues="top"
>   return <ItemList items={items} />;
> }
> ```

Notes: the first block owns the window chrome and the number 1, the second resumes at 3 with a flat top, and together they read as one file across the page break.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```jsx title="App.jsx"
> export default function App() {
>   const [items, setItems] = useState([]);
> ```

> ```jsx title="App.jsx"
>   return <ItemList items={items} />;
> }
> ```

Notes: two standalone windows each carry their own dots and tab and both restart at line 1, so the reader sees two disjoint files instead of one continued file.

## Continuations | 08 | Let the sticky note continuation tab do its work

[ ] Expect the compiler to render a sticky note continuation tab automatically when a continued block opens a new section heading, showing the filename and a `(continued)` tag, so the reader knows which file resumed.

[ ] Expect only the first continued block in a new section to get the tab, since the compiler suppresses redundant tabs on subsequent continuation blocks within the same section while preserving continuous line numbers.

[ ] Rely on this placement gate rather than hand-placing anything, since the tab's spacing, indentation, and clearance are computed by the builder.

## Continuations | 09 | Start every code block on real code

[ ] Begin each code block immediately on its first line of executable code, since a leading empty line wastes a numbered row and shifts `startLine` away from the code it should point at.

[ ] PROPER EXAMPLE: make sure you follow this example, code flush against the opener:

> ```jsx
> const [query, setQuery] = useState('');
> return <SearchBar query={query} onChange={setQuery} />;
> ```

Notes: row 1 is real code, the line numbering is honest, and the editor stays dense.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```jsx
>
> const [query, setQuery] = useState('');
> return <SearchBar query={query} onChange={setQuery} />;
> ```

Notes: the leading empty line renders as an empty numbered row 1, so every subsequent line number is off by one against the source.

## Comments | 10 | Attach every comment to its code line

[ ] Write comments as end-of-line comments in the form `code; // annotation`, so each bubble hangs below the exact line it annotates and points its tail up at it.

[ ] Avoid comment-only lines inside code blocks, since a bubble beside an empty row leaves the reader unable to tell which line it belongs to, and the build's merge of a comment-only line into the next code line's bubble is a safety net that logs a note, not an authoring pattern.

[ ] Put introductions to a block of code in the prose above the snippet, so the code block stays a set of line labels rather than a narration vehicle.

[ ] PROPER EXAMPLE: make sure you follow this example, the label riding its own line:

> ```jsx
> const el = <h1>Hello</h1>; // 1. React turns this markup into an **ELEMENT** object
> ```

Notes: the bubble sits directly under the element line with its tail pointing up, so the pairing is unambiguous on screen.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```jsx
> // 1. the element is created through React
> const el = <h1>Hello</h1>;
> ```

Notes: the comment-only line renders as an annotation with no code beside it, and the next row is code with no annotation, so the reader cannot pair them.

## Comments | 11 | Know the exact `//` comment rule

[ ] Write comments as `//` followed by a space and the text, since the first `//` on a line that is followed by a space or the end of the line marks the comment start, and everything from there to the end of the line becomes the bubble text.

[ ] Trust the protection for `//` inside URLs, since `'https://example.com'` and `file://` and `http://` are untouched by the comment rule because the `//` there is followed by characters, not a space.

[ ] Expect a bare trailing `//` with no text to be dropped cleanly by the build, so no dangling arrow renders.

[ ] Expect the first letter of a comment to be auto-capitalized in the bubble, and expect `**bold**` runs to render as tag-styled bold inside it.

## Comments | 12 | Use the supported comment formatting only

[ ] Use `**double asterisks**` for the key term inside a comment, since bold is the only inline formatting the highlighter supports there.

[ ] Avoid inline code, links, and italics inside comments, since they are not parsed and would show as literal characters; reference an identifier as plain text, in caps if it is the load-bearing word.

[ ] Use `//` per-line comments rather than `{/* */}` JSX comments or `/* ... */` block comments, since only the per-line `//` form produces the bubble styling and block comments render as plain code.

[ ] Signal verdicts with words rather than glyphs, since the build strips checkmark and cross glyphs from comments on purpose; write `// **WRONG:** reads the prop once` instead.

[ ] PROPER EXAMPLE: make sure you follow this example, word verdicts and bold only:

> ```jsx
> const [count, setCount] = useState(initialCount); // **WRONG:** copies the prop **ONCE** into local state
> const double = useMemo(() => count * 2, [count]); // **RIGHT:** recomputes only when count changes
> ```

Notes: both bubbles carry a leading verdict word and one caps load-bearing term, and nothing inside them relies on unsupported formatting.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```jsx
> const [count, setCount] = useState(initialCount); // ✔️ copies the prop `once` into [local state](https://react.dev)
> ```

Notes: the glyph is stripped by the build, the inline code backticks and the link render as literal characters, so the bubble arrives mangled.

## Comments | 13 | Keep each comment a short label

[ ] Keep a comment to a verdict word, a step number, or a one-phrase gloss plus one caps load-bearing word, since the bubble is a label for the line, and explanations of the line belong in the prose around the snippet.

[ ] Shorten a comment whose wrapped bubble looks awkward, since the bubble wraps internally by itself in the build and the code block is not the place for paragraphs.

[ ] Delete a comment that is not pedagogically necessary, since every comment always renders and none are collapsible; aim for no comment kept merely for completeness.

[ ] PROPER EXAMPLE: make sure you follow this example, a one-phrase label:

> ```jsx
> const { title } = props; // **WRONG:** reads the prop once, never follows updates
> ```

Notes: the comment names the exact consequence beside the offending line in one short sentence, and the prose carries the deeper explanation.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```jsx
> const { title } = props; // destructuring copies the value out of the props object at the moment this line runs, which means that later updates to the prop in the parent will not be reflected here because the snapshot was taken once, and this is a common trap in components that receive changing values from a server fetch that resolves after mount
> ```

Notes: the comment is a paragraph, so the bubble wraps into a tall awkward block and buries the line it labels; the material belongs in prose.

## Comments | 14 | Mark the single load-bearing word in caps bold

[ ] Wrap the one keyword that carries the lesson in `**CAPS**`, since the highlighter renders it as bold in a darker grey, and the reader takes that word away from the line.

[ ] Use one caps word per comment, occasionally two, since a whole sentence in caps carries no emphasis at all.

[ ] PROPER EXAMPLE: make sure you follow this example, the takeaway word carrying the line:

> ```jsx
> const b = useState(value); // **RIGHT:** changes schedule a **RE-RENDER**, reads live
> ```

Notes: the word RE-RENDER is the lesson of the line and it lands in caps bold inside the bubble.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```jsx
> const b = useState(value); // CHANGES SCHEDULE A RE-RENDER AND READS LIVE FOREVER
> ```

Notes: every word is caps, no word is bold, and the takeaway drowns in shouting.

## Comments | 15 | Reserve verdict prefixes for real contrasts

[ ] Start a comment with `**RIGHT:**` or `**WRONG:**` only when the line stands in an active comparison with a bug, an anti-pattern, or a paired right/wrong contrast, since labeling everyday code as RIGHT when no wrong counterpart exists adds noise.

[ ] Author standard non-comparative lines with a direct insightful annotation instead, keeping the single caps load-bearing keyword in bold without an artificial verdict label.

[ ] PROPER EXAMPLE: make sure you follow this example, a direct annotation on a neutral line:

> ```jsx
> const [status, setStatus] = useState('idle'); // submission status kept in **LOCAL** state
> ```

Notes: no wrong pattern is being contrasted, so the comment teaches directly and the caps word LOCAL carries the line.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```jsx
> const [status, setStatus] = useState('idle'); // **RIGHT:** submission status kept in LOCAL state
> ```

Notes: there is no wrong counterpart anywhere near this line, so the RIGHT verdict answers a question nobody asked and dilutes real verdicts elsewhere.

## Comments | 16 | Number the steps inside a sequence snippet

[ ] Prefix each comment with its step number when a code block shows a sequence of operations, since the numbers survive into the rendered bubbles and give the reader a clear path through the snippet.

[ ] PROPER EXAMPLE: make sure you follow this example, three aligned numbered labels:

> ```jsx
> likes += 1;        // 1. optimistic override: increment **LOCALLY** immediately
> await saveLike();  // 2. tell the server to **SAVE** the change
> likes -= 1;        // 3. rollback: if the request failed, **REVERT** the override
> ```

Notes: the reader's eye tracks down the three bubbles and reads the story in order, with the caps words anchoring each step.

## Comments | 17 | Place comments sensibly on very wide lines

[ ] Place the comment on its own line inside the block, on the very next line, only when the code line itself is exceptionally wide and a trailing comment would hit the right edge of the editor and wrap into two rows, breaking the parallel visual layout.

[ ] Treat this as the single exception to end-of-line placement, since it exists to protect the reader's row alignment, not to reopen comment-only lines as a habit.

## Highlighter | 18 | Know the token classes the builder computes

[ ] Expect JavaScript keywords such as `const`, `return`, `function`, `await`, `import`, and `export` to render in the deep magenta keyword class.

[ ] Expect an identifier followed by `(` to render in the teal function class, so `createRoot()`, `map(`, and `console.log(` get the function color.

[ ] Expect number literals such as `0` and `3.14` to render in the magenta number-literal class.

[ ] Expect string literals in double, single, or template quotes to render in the green string class, including the `'use client'` and `'use server'` directives, which are strings and render green.

[ ] Expect every `useXxx` identifier, built-in or custom by naming convention, to render in the orange React hook class, covering `useState`, `useMemo`, `useActionState`, `useFormStatus`, and a custom `useCart` alike.

[ ] Expect plain identifiers such as variable names, property accesses, and component names to render in the default ink color with no span, since a component name used as JSX rather than a call is an identifier, not a function token.

[ ] Treat these classes as builder output rather than author input, so the author writes plain code and lets the colors derive from the source.

## Highlighter | 19 | Stay within the supported languages

[ ] Use `jsx`, `js`, `tsx`, `ts`, `javascript`, or `typescript` for all lecture code, since they share the same JS/JSX highlighter and there is no language-specific branching.

[ ] Extend the highlighter in `src/build-lectures.mjs` with a new tokenizer branch keyed on the code block language when CSS, HTML, or shell material genuinely needs different tokenization, rather than forcing it through the JS tokenizer.

## Highlighter | 20 | Respect the known limitations

[ ] Expect a template literal such as `` `Hello ${name}` `` to be treated as one string token, with the interpolation not separately highlighted, so document a long template literal in prose when the interpolated part matters.

[ ] Avoid regex literals containing `//` in lecture code, since the followed-by-space-or-end-of-line rule protects most cases but a regex like `/foo//bar/` mis-tokenizes.

[ ] Avoid multi-line `/* ... */` block comments, since they render as plain code with no bubble styling and break the bubble aesthetic of the design system.

[ ] Keep the editor treatment expectations to lecture code blocks only, since the card pipeline uses a minimal `<pre><code>` style defined in the card CSS and does not share this highlighting (see the ui-panels skill).

## Right and Wrong | 21 | Mark right and wrong blocks with the window tag

[ ] Add `right` or `wrong` directly to the code block language tag, as in ` ```jsx right ` or ` ```jsx wrong `, so the builder generates the side-panel SVG indicator, an emerald checkmark or a rose cross.

[ ] Keep the code inside these blocks free of comments, since the instruction lives on the line above and duplicate verdicts inside the block clutter the panel.

[ ] Restrict this format to closing `### Summary` blocks and direct in-body anti-pattern comparisons where a broken or legacy approach is contrasted with a modern React 19 pattern, since scaffolding commands, documentation placeholders, CLI flags, and standard setup steps are not verdicts.

[ ] PROPER EXAMPLE: make sure you follow this example, the directive above and the tag on the window:

> **DO THIS:** read the input value through state on every render
>
> ```jsx right
> const [title, setTitle] = useState('');
> return <input value={title} onChange={(e) => setTitle(e.target.value)} />;
> ```

Notes: the bold uppercase directive sits flush-left on the line directly above the block, the `right` tag generates the emerald indicator, and the code itself carries no comments.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```jsx wrong
> // DO NOT DO THIS
> // this reads the DOM directly
> const title = document.querySelector('input').value;
> return <input defaultValue={title} />;
> ```

Notes: the directive is missing above the block, the verdict is duplicated as comments inside the code where comments are banned, and the bold instruction line the format requires never appears.

## Assembly Annotations | 22 | The CODE LOGIC and DATA FLOW tags #2026_09_20_04_group_6

[ ] Annotate the load-bearing lines of the practical example's assembly fences with one of the two structured tags: `// **CODE LOGIC:**<br>` for what the line does mechanically, and `// **DATA FLOW:**<br>` for which direction data moves and where it lands, so each bubble names the line's job in the architecture.
[ ] Treat these tags as the sanctioned exception to the short-label comment rule (Comments 13): inside the practical example fences the tag plus one clause is allowed, and everywhere else the short-label rule holds unchanged.
[ ] Write the payload after the `<br>` as one clause, not a paragraph: a single statement of mechanism or movement, with the load-bearing words in bold, since the bubble still wraps internally and the fence is still not the place for prose.
[ ] Choose between the two tags by the line's job: CODE LOGIC annotates what the line computes, locks, or manages, while DATA FLOW annotates what crosses a boundary and in which direction; never stack both tags on one line.
[ ] Keep every other fence (comparisons, summaries, definitions, scaffolding) on the short-label rule, since the structured tags exist to carry the top-down architecture story of the guided build, not to decorate every block.

[ ] PROPER EXAMPLE: make sure you follow this example, both tags on the lines that earn them, from Lecture 40 Step 1:

> ```jsx
> const [query, setQuery] = useState(''); // **CODE LOGIC:**<br>Holds search state locally because filtering requires per-keystroke sync
> <LiveSearchInput query={query} onChange={setQuery} /> // **DATA FLOW:**<br>Passes state downward and setter callback for inverse flow
> ```

Notes: the state line gets CODE LOGIC because it computes and manages, the mounting line gets DATA FLOW because it moves state and the setter across the parent-child boundary, and each payload is one clause.

[ ] HALF WAY EXAMPLE: do not follow this example, the right tag carrying a paragraph:

> ```jsx
> const contributor = formData.get('contributor'); // **CODE LOGIC:**<br>Reads the contributor name from the native buffer that the browser maintains, which was populated while the user typed, and this happens with zero re-renders because React never runs during typing
> ```

Notes: the tag is right but the payload is a paragraph, so the bubble wraps tall and buries the line; the shipped standard keeps it to one clause (Reads contributor name from native buffer with zero re-renders).

[ ] COUNTER-EXAMPLE: do not follow this bad example, the vague untagged label:

> ```jsx
> <ArticleCorrectionForm /> // sets up the form stuff
> ```

Notes: no tag, no mechanism, no direction; the reader learns nothing about the zero-props decision the line makes, where the shipped standard reads `// **DATA FLOW:**<br>Mounted with zero props; manages its own submission lifecycle`.
