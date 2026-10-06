---
name: code-comment-audit
description: Post-edit audit skill to scan, calibrate, and verify code comments, speech bubbles, indentation offsets, and targeted token pointer alignments across all lecture code blocks.
---

# Code Comment Audit

This skill governs post-edit scanning and calibration of code comments across lecture Markdown files. It ensures that every code snippet carries clear, direct speech-bubble annotations that point precisely at the load-bearing keywords, props, and function calls being explained. All instructions are formulated as evaluative questions.

## Audit Scope | 01 | Universal Code Coverage and Summary Exceptions

- [ ] Are all code snippets across the lecture audited for explanatory comments, including titled introductory theory blocks, comparative principle breakout cards (when present in syntax principles), and Stage C progressive assembly steps? #2026_10_03_02_group_1 revised by #2026_10_03_12_group_1
- [ ] **The Summary vs Principle Card Distinction**: Are comparative summary blocks at the very end of the lecture kept strictly comment-free? Are the code pair cards of every principle authored strictly *inside* the `> [!PRINCIPLE]` container with `>` prefixes and trailing comments? #2026_10_03_02_group_1 revised by #2026_10_03_12_group_1, #2026_10_04_09_group_1, and #2026_10_06_04_group_3
- [ ] **The On-Demand Audit Protocol (Phase 2 Post-Draft Audit & Verification Gate)**: Is the code comment audit executed on demand as a dedicated secondary pass after lecture drafting is complete, following the 5-step detection procedure across all code blocks? Initial drafting (Phase 1) produces plain code with natural comments and zero tildes. On demand (or before final print certification), this audit pass scans all code blocks, isolates focal tokens using the Token Targeting Anatomy table, wraps them in tildes (`~token~`), verifies 80/68 width budgets, and confirms zero gate failures via `node src/diagnose-lecture.mjs {NN} --audit --revised` before compiling the PDF. #2026_10_04_01_group_1 revised by #2026_10_04_04_group_1 and #2026_10_04_10_group_1
- [ ] **The Audited Copy Lives in the Revised Folder**: Does the audit work on `02-01-md-revised/<version>/{NN}.md`, never on the working lecture? When no revised copy exists yet, is `01-02-md-LECTURES/<version>/{NN}.md` copied there first; when one exists, is it audited in place so earlier revisions survive? The working lectures in `01-02-md-LECTURES/` keep plain trailing comments with zero tildes, because every drafting session reads them. #2026_10_04_10_group_1
    * **Step 1: Comment Scan & Density Verification**: Scan all titled code fences (`title="..."`) and comparative principle cards. Check block density (at least 1 comment per titled block with 3+ lines, Invariant 4; principle cards have at least 1 comment, Invariant 5). Verify summary blocks (`right`/`wrong`) are strictly comment-free (Invariant 6). Check spacing to ensure no 3-consecutive-line commenting (Invariant 7).
    * **Step 2: Focal Token Identification**: For each line with a trailing comment, locate the specific semantic target being explained (the prop, state setter, hook call, callback, parameter, dynamic value, or event handler). Distinguish structural/shell lines (function declaration headers, return shells) which remain plain (zero tildes) from targeted value/action lines.
    * **Step 3: Token Wrapping & Tilde Parity**: Wrap ONLY the focal token in tildes (`~token~`). For multiline data collection records, wrap the complete final item (`~{ id: '...', ... }~`). Ensure an even number of tildes per line (Invariant 3). Ensure every line with a `~token~` has a trailing comment (Invariant 2), and every trailing comment on a non-shell line has a `~token~` (Invariant 1).
    * **Step 4: Line Width & Clearance Calibration**: Check that lines with target tokens and comments do not exceed 80 characters (68 characters in principle callouts; Invariant 8). If a line is cramped, break attributes or arguments across lines to give the comment room.
    * **Step 5: Automated Algorithmic Verification**: Run `node src/diagnose-lecture.mjs {NN} --audit` to mechanically verify all 9 deterministic invariants (including token targeting). If any invariant fails, resolve it immediately before compiling PDF outputs.

- [ ] PROPER EXAMPLE: Auditing an introductory theory block for targeted comments:

> ```jsx title="Parent Callback Delegation"
> export default function ArticleCard({ article, ~onSelect~ }) { // Callback prop passed down from parent
>   return (
>     <article className="article-card">
>       <h3>{article.title}</h3>
>       <button type="button" onClick=~{() => onSelect(article.id)}~> // Inline arrow function delays execution until user clicks
>         Read Story
>       </button>
>     </article>
>   );
> }
> ```

Notes: Introductory theory block carries clear, targeted comments on the callback prop and event handler binding.

- [ ] PROPER EXAMPLE: Auditing principle breakout cards for speech bubbles:

> *It is best practice to do this:*
> `function FilterBar({ onSelectCategory }) {`
> `  return (`
> `    <button onClick=~{() => onSelectCategory('business')}~> // Passes clean category string to parent`
> `      Business`
> `    </button>`
> `  );`
> `}`
> 
> *Instead of doing this:*
> `function FilterBar({ filters }) {`
> `  return (`
> `    <button onClick=~{() => { filters.category = 'business'; }}~> // Mutating props breaks unidirectional data flow`
> `      Business`
> `    </button>`
> `  );`
> `}`

Notes: Principle comparative cards carry surgical speech bubbles pointing directly at the differentiating token, satisfying the autonomous conclusion test.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Adding comments inside comparative summary blocks:

> ```jsx right
> function SelectButton({ id, onSelect }) {
>   return <button type="button" onClick={() => onSelect(id)}>Select</button>; // Accessible button callback
> }
> ```

Notes: Violates the workspace rule prohibiting code comments inside comparative summary snippets.

## Comment Value & Placement | 02 | Scannable Explanations, Data Blocks, and Action Lines

- [ ] Are comments concise yet substantive (typically 4 to 8 words, such as "Imports child card", "Static article collection", or "Logs selected article identifier"), providing immediate browsing orientation while strictly avoiding unhelpful 1-word or 2-word telegram labels ("Click", "Input", "Local")? #2026_10_03_03_group_1 revised by #2026_10_03_05_group_1
- [ ] **The Surgical Token Rule**: When a speech bubble explains a specific identifier, prop, variable, or value, does `~token~` isolate ONLY that single focal word, rather than wrapping boilerplate syntax? For multiline data collections (arrays or objects of records), is the entire final item line (`~{ id: '...', title: '...' }~`) underlined so the speech bubble anchors cleanly across the complete data entity rather than pointing to an arbitrary inner value? #2026_10_03_07_group_1 revised by #2026_10_03_09_group_1
- [ ] **The Structural Line vs Targeted Value Standard**: Does every comment explaining an assigned value, prop, parameter, callback, or default fallback attach to an explicit target token (`~token~`), reserving untargeted plain lines strictly for opening function headers (`function App() {`) or return shells (`return <main>`)? Leaving parameter, prop, or default assignment lines untargeted is strictly forbidden, as it drops the speech bubble into the left margin away from the code being explained. #2026_10_03_07_group_1 revised by #2026_10_03_10_group_1
- [ ] **The Bubble Spacing Rule**: Do code blocks maintain natural breathing room (typically 1 to 2 comments on load-bearing lines per block), avoiding commenting 3 or more consecutive lines in a row to prevent vertical speech bubble pileups? #2026_10_03_07_group_1
- [ ] **The Data Placement Rule**: When commenting on multiline data collections (arrays or objects with items), is the comment placed at the end of the last value to summarize the whole collection together, rather than interrupting the opening declaration line? #2026_10_03_03_group_1
- [ ] **The Action Placement Rule**: When a comment describes a runtime action (such as logging to the console), is it attached to the actual line of execution, and does the target underline wrap ONLY the actual content/argument inside `console.log(~'content'~)`, rather than underlining the boilerplate `console.log` keyword or the entire line? #2026_10_03_03_group_1 revised by #2026_10_03_05_group_1

### Token Targeting Anatomy: What Gets Wrapped vs What Stays Plain #2026_10_03_07_group_1

| Construct | Correct Code with Target Token | Why only that token is wrapped | What NOT to do (The Underline Everything Trap) |
| :--- | :--- | :--- | :--- |
| **Child Component Tag** | `<article>~<EditorialByline />~</article>` | Anchors pointer tail to the nested component. | `~<article><EditorialByline /></article>~` |
| **Prop / Event Binding** | `<button onClick=~{handleSave}~>` | Anchors pointer tail to the callback handler. | `~<button onClick={handleSave}>~` |
| **Prop Destructuring** | `function Card({ ~edition~ }) {` | Anchors pointer tail to the input property. | `~function Card({ edition }) {~` |
| **Default Prop / Fallback** | `onSelect = ~() => {}~` | Anchors pointer tail to the default fallback value. | Leaving line untargeted, dropping bubble into the left margin. |
| **Ternary Condition** | `const cls = ~isLong~ ? 'deep' : 'quick';` | Anchors pointer tail to the controlling flag. | `~const cls = isLong ? 'deep' : 'quick';~` |
| **Console Payload** | `console.log(~'Article loaded'~);` | Anchors pointer tail to the logged argument. | `~console.log('Article loaded');~` |
| **Data Collection Item** | `~{ id: 'tech', title: 'Tech' }~` | Anchors speech bubble across the entire data record summarizing the collection. | Isolating an arbitrary inner string like `~'tech'~` when the comment summarizes the object. |
| **General Statement** | `function App() { // Root coordinator` | **No tildes!** Pointer rests at line indentation. | `~function App() {~ // Root coordinator` |
| **Return Shell** | `return <main className="feed">; // Shell` | **No tildes!** Comment explains layout structure. | `~return <main className="feed">;~` |

- [ ] PROPER EXAMPLE: Proper pointer positioning and placement across imports, data, and logs:

> ```jsx title="App.jsx" startLine="1" continues="bottom"
> import ~ArticleCard~ from './components/ArticleCard.jsx'; // Imports child card
> 
> const articles = [
>   { id: 'art-1', title: 'City Transit Expands' },
>   ~{ id: 'art-2', title: 'Clean Energy Accord' }~ // Static article collection
> ];
> 
> export default function App() {
>   function handleSelect(id) {
>     console.log(~'Selected article:', id~); // Logs selected article identifier
>   }
> ```

Notes: The import comment points directly at `ArticleCard`; the data comment sits at the end of the last value summarizing the collection; the log comment attaches to the actual `console.log` line and wraps only `'Selected article:', id`.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Misplaced comments and untargeted lines:

> ```jsx title="App.jsx" startLine="1" continues="bottom"
> import ArticleCard from './components/ArticleCard.jsx'; // Imports child card
> 
> const articles = [ // Static article collection
>   { id: 'art-1', title: 'City Transit Expands' },
>   { id: 'art-2', title: 'Clean Energy Accord' }
> ];
> 
> export default function App() {
>   function handleSelect(id) { // Logs selected article identifier
>     console.log('Selected article:', id);
>   }
> ```

Notes: Lacks target tokens (`~target~`), leaving pointer tails misaligned at the left margin; the data comment interrupts the opening line before values are seen; the log comment is attached to the function declaration instead of the log execution.

## Voice and Phrasing | 03 | Clear, Direct, and Easy-to-Understand Balloons

- [ ] Are balloon comments written in direct, natural, upper-intermediate (B2) conversational English that any junior developer can understand immediately? #2026_10_03_02_group_1
- [ ] Are comments tag-free, avoiding artificial system tags or rigid labels (such as `// [CORRECT]:` or `// [AUDIT]:`) that sound like automated machine prompts? #2026_10_03_02_group_1
- [ ] Does each comment explain the *purpose* or *consequence* of the line (what it accomplishes or why it is needed) rather than merely echoing code tokens? #2026_10_03_02_group_1
- [ ] Do comments form a complete 4-to-8-word explanatory thought, matching one of the 10 golden comment patterns while strictly avoiding 1-word or 2-word telegram shorthand ("Click", "Bound", "Local", "Input")? #2026_10_03_05_group_1

### The 10 Golden Comment Exemplars #2026_10_03_05_group_1 (revised #2026_10_03_07_group_1)

| # | Pedagogical Case | Target Token & Code Line | Explanatory Speech Bubble Comment |
| :--- | :--- | :--- | :--- |
| 1 | **Anti-Pattern / Trap** | `~articleCount~ = articleCount + 1;` | `// **WRONG:** mutates outside variable during render` |
| 2 | **Safe Mutation Fix** | `const list = ~[...stories, { id: 'ad' }]~;` | `// Fresh local array copy avoids mutating props` |
| 3 | **Console Log Target** | `console.log(~'render Article:', itemNumber~);` | `// StrictMode invokes this twice during development` |
| 4 | **Event Handler Reference** | `<button type="button" onClick=~{handleSave}~>` | `// Uncalled function reference runs only on click` |
| 5 | **Delayed Callback with Arg** | `onClick=~{() => onSelect(story.id)}~` | `// Inline arrow delays execution until user clicks` |
| 6 | **Event Propagation Halt** | `e.~stopPropagation~();` | `// Halts event bubbling to protect parent card` |
| 7 | **Browser Default Cancellation** | `e.~preventDefault~();` | `// Cancels native browser full-page reload on submit` |
| 8 | **Multiline Data Collection** | `const ~articles~ = [` | `// Declared outside App to avoid recreating array on each render` |
| 9 | **Declarative Dynamic Class** | `const ~cls~ = isLong ? 'badge-depth' : 'badge-quick';` | `// Pure ternary calculation resolves class in JSX` |
| 10 | **Import Boundary Definition** | `import ~StatusBadge~ from './StatusBadge.jsx';` | `// Imports child badge presentation boundary` |

- [ ] PROPER EXAMPLE: Explaining the architectural consequence in plain English:

> `onClick=~{handlePublish}~ // Passes function reference without parentheses so React calls it on click`

Notes: Explains clearly why parentheses are omitted and what React will do when the event occurs.

- [ ] PROPER EXAMPLE: Explaining concrete runtime mechanics and avoided re-allocation #2026_10_03_06_group_1:

> `const ~articles~ = [ // Declared outside App to avoid recreating array on each render`

Notes: Explains the concrete mechanical reason for placing data outside the component (preventing fresh array allocation on every render cycle).

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Abstract academic labels without operational cause or consequence #2026_10_03_06_group_1:

> `const ~articles~ = [ // Static collection outside render`

Notes: Uses clinical textbook jargon ("collection", "static") that merely names what the object is in the abstract without explaining why it sits outside the component or what runtime penalty it avoids.

- [ ] HALF-WAY EXAMPLE: Partial attempt that echoes code without explaining consequence:

> `onClick=~{handlePublish}~ // Sets handlePublish on onClick prop`

Notes: Technically true but completely unhelpful; simply repeats the code identifiers without explaining execution timing.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Telegram shorthand and single-word labels:

> `onClick=~{save}~ // Click`
> `onSubmit=~{handleSubmit}~ // Submit`
> `<article onClick=~{check}~> // Bound`
> `console.log(~'test'~); // Log`

Notes: Telegram shorthand merely repeats an event or role in 1 word, giving the student zero insight into runtime execution or consequence.

## Vertical Alignment & Tab Indentation | 04 | Positioning Balloons Directly Under Target Lines

- [ ] Does every balloon comment immediately follow the exact code line whose behavior it clarifies, avoiding floating comments attached to unrelated rows? #2026_10_03_02_group_1
- [ ] Is the speech bubble horizontally indented to match the line above, with tabs and leading spaces respected so the comment box naturally mirrors the code indentation (`--indent-offset`)? #2026_10_03_02_group_1

- [ ] PROPER EXAMPLE: Indented speech bubble aligning with nested JSX:

> ```jsx
>       <ArticleCard
>         key={story.id}
>         article={story}
>         onSelect=~{handleSelect}~ // Passes handler reference downward without calling it
>       />
> ```

Notes: The comment on `onSelect` attaches directly to its attribute line and inherits the 8-space indentation of the JSX element.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Detaching comments from their operative lines:

> ```jsx
>       // Passes handler reference downward without calling it
>       <ArticleCard
>         key={story.id}
>         article={story}
>         onSelect={handleSelect}
>       />
> ```

Notes: Placing the comment as a standalone full line above the component detaches it from the specific prop, losing vertical precision.

## Pointer Targeting & Offset Calibration | 05 | Pixel-Accurate Pointer Tails

- [ ] Does EVERY comment wrap its specific newsworthy target token in tildes (`~target~`)? #2026_10_03_03_group_1
- [ ] Does the balloon comment's upward pointer tail point directly at the exact word or phrase being commented on, rather than defaulting to the left edge of the code container? #2026_10_03_02_group_1
- [ ] Is the targeted word or phrase wrapped in tildes (`~target~`) or bold markers (`**target**`) before the trailing `//` comment, enabling the compiler to compute `--token-offset` to the center of the token? #2026_10_03_02_group_1
- [ ] When a target token is analyzed, does the compiler use the page column benchmark (column 36 for editor blocks, column 30 for principle cards) to decide between Left Starting Point and Right Starting Point? #2026_10_03_02_group_1
- [ ] If the token sits on the left side of the page (colIndex <= 36), does the balloon use the Left Starting Point (anchored on the left at line indentation, extending right, with pointer on the left)? #2026_10_03_02_group_1
- [ ] If the token sits on the right side of the page (colIndex > 36), does the balloon use the Right Starting Point (anchored on the right at token center + shoulder, extending left via `.cmt-bubble-right`, with pointer on the right)? #2026_10_03_02_group_1

- [ ] PROPER EXAMPLE: Left Starting Point for token on the left side of the page (colIndex <= 36):

> `<button type="button" ~onClick={onSave}~> // Passes function reference directly to native button click listener`

Notes: With the target token at column 33 (<= 36), the compiler uses Left Starting Point, anchoring the bubble at the line indentation and placing the pointer from the left directly under `onClick={onSave}`.

- [ ] PROPER EXAMPLE: Right Starting Point for token on the right side of the page (colIndex > 36):

> `export default function ArticleCard({ article, ~onSelect~ }) { // Callback prop passed down from parent`

Notes: With `onSelect` at column 51 (> 36), the compiler uses Right Starting Point via `.cmt-bubble-right`, anchoring the bubble from the right (`--right-edge`) with a 24px shoulder and pointing directly at `onSelect`.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Leaving the target unmarked when commenting on a specific token:

> `<button onClick={openArticle(id)}> // Evaluates immediately on page load during render`

Notes: Without target markers, the pointer tail falls back to the left indent of `<button`, missing the actual expression being discussed.

## Visual Highlighting & Spacing | 06 | Dotted Underlining and Vertical Clearance

- [ ] Is the pointed-at word or phrase underlined by a clean, crisp dotted line (`.target-token`, 2.5px dotted `#64748b` with `padding-bottom: 3.5px`) in a defined slate shade that remains clearly distinct even on single-character tokens (like `0` or `p`) and clears letter descenders without touching the pointer tip? #2026_10_03_08_group_1
- [ ] Is there sufficient vertical distance between the code line and the comment balloon (`margin-top: 11px` in editor, `13px` in principle cards) so the pointer tail points cleanly at the dotted line with minimal breathing room without touching it? #2026_10_03_08_group_1
- [ ] Does the dotted underline adopt contextual color overrides in comparative blocks when highlighting specific behaviors (green `#2ca662` for recommended patterns, red `#de5252` for anti-patterns and cautions)? #2026_10_03_08_group_1

- [ ] PROPER EXAMPLE: Crisp dotted underline in slate shade with descender clearance:

> `export default function ArticleCard({ article, ~onSelect~ }) { // Callback prop passed down from parent`

Notes: The target token `onSelect` receives a 2.5px dotted underline in `#64748b` with `padding-bottom: 3.5px`, and the bubble maintains an 11px vertical clearance with a clean minimal distance between the pointer tip and the dotted line.

> `*It is best practice to do this:*`
> `<button onClick=~{handlePublish}~>Publish</button> // Passes uncalled function reference to run on click`
> 
> `*Instead of doing this:*`
> `<button onClick=~{handlePublish()}~>Publish</button> // Parentheses call the function immediately during render`

Notes: In the "do" card, `{handlePublish}` receives a green dotted line; in the "dont" card, `{handlePublish()}` receives an amber/red dotted line.

## Line Budget & Formatting | 07 | Preserving the 10-Line Code Budget and Line Widths

- [ ] When breaking attributes across lines to add targeted comments, does each standalone body code fence remain within the 10-line executable budget? #2026_10_03_02_group_1
- [ ] Are single lines containing code and target tokens kept within the 80-character boundary (68 characters in principle callout cards), preventing right-side clipping against card edges or badges? #2026_10_03_02_group_1

- [ ] PROPER EXAMPLE: Compact multi-line element under 10 lines:

> ```jsx title="Naive Execution Attempt"
> function ArticleCard({ title, id }) {
>   function openArticle(articleId) {
>     console.log('Opened article:', articleId);
>   }
>   return (
>     <button onClick=~{openArticle(id)}~> // Evaluates immediately on page load during render
>       Read {title}
>     </button>
>   );
> }
> ```

Notes: Total 10 lines, clean layout, targeted token comment, well under the 80-character boundary.

## Deterministic Code Block Invariants | 08 | Automated Algorithmic Gate
 
All 9 invariants below are verified mechanically via `node src/diagnose-lecture.mjs {NN} --audit --revised` on the audited copy. Any violation halts the build pipeline with exit code 1. #2026_10_03_11_group_1 revised by #2026_10_03_12_group_1, #2026_10_04_06_group_1, and #2026_10_04_10_group_1

- [ ] **Invariant 1: Token and Comment Pairing (No Unanchored Comments)**: Does every code line carrying a trailing comment (`//` or `/*`) contain an explicit target anchor (`~token~`), reserving unanchored lines strictly for opening function headers or return shells? Lines explaining parameters, default values, props, variables, or expressions must never omit target tildes. #2026_10_03_10_group_1
- [ ] **Invariant 2: No Orphan Tokens (Comment Requirement)**: Does every line containing a `~token~` anchor carry a trailing comment on that exact line, preventing dangling dotted underlines without speech bubbles? #2026_10_03_10_group_1
- [ ] **Invariant 3: Tilde Syntax Parity**: Does every line with target tokens contain an even number of tildes, ensuring all target spans are cleanly closed without broken syntax? #2026_10_03_10_group_1
- [ ] **Invariant 4: Universal Block Density (Zero Barren Blocks)**: Does every titled fenced code block (`title="..."`) with 3 or more lines contain at least 1 targeted speech bubble, preventing blank margins in print? #2026_10_03_10_group_1
- [ ] **Invariant 5: Mandatory Principle Card Bubbles (Zero Barren Cards)**: Does every comparative principle breakout card (`*It is best practice to do this:*`, `*Instead of doing this:*`, `*We should do this:*`, `*We should not do this:*`) contain at least 1 speech bubble with a target token? #2026_10_03_10_group_1
- [ ] **Invariant 6: Strict Summary Block Quarantine**: Are tagged comparative summary blocks (` ```jsx right ` and ` ```jsx wrong ` beneath `**DO THIS:**` and `**DO NOT DO THIS:**` headers) kept strictly 100% comment-free, reserving comments solely for instructional and principle bodies? #2026_10_03_10_group_1
- [ ] **Invariant 7: Bubble Stacking Spacing**: Are speech bubbles spaced with at least 1 line of breathing room, strictly avoiding commenting 3 or more consecutive lines in a row to prevent vertical layout collisions? #2026_10_03_10_group_1
- [ ] **Invariant 8: Scope and Width Boundaries**: Are target tokens kept surgical (under 28 characters for single values, under 60 characters for complete data collection objects), and are all lines strictly within their width budgets (80 characters for body editor windows, 68 characters for principle callout cards)? #2026_10_03_10_group_1
- [ ] **Invariant 9: Zero Multi-line Code in Content (Zero Raw Code as Text)**: Are there 0 occurrences of multi-line code, consecutive backtick lines, or unquoted card headers in narrative content outside fences and callouts? Multi-line code belongs strictly inside titled fenced code blocks (` ```jsx `) or inside `> [!PRINCIPLE]` callouts with `>` prefixes on every line. #2026_10_03_12_group_1
