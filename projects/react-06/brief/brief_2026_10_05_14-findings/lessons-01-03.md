# Audit of Lectures 01-03 (react-06, question bank Version 3)

Paths below are relative to `P = projects/react-06`. `L` = `P/01-02-md-LECTURES/v6/NN.md`, `PRE` = `P/01-01-md-PRE-lectures/v6/NN.md`, `REV` = `P/02-01-md-revised/v6/NN.md`.

General notes that apply to all three lessons:

- The revised copies (`REV/01.md`, `REV/02.md`, `REV/03.md`) are identical to the lectures except for `~highlight~` markers inside code. I checked this with a diff after stripping `~`. Every lecture line number in this report is therefore also the revised-copy line number. The "Revised copy" line in each section only repeats that fact.
- None of the three lectures cites another lesson by number ("Lecture N", "QN"). The only cross-lesson pointers are unnumbered previews (sentences that mention later topics), "Where you will meet this" items, "Beyond the basics" links, and glossary entries. Check A lists every one of them.
- Rows 1-13 have the same text in bank Versions 2 and 3. Because these lectures cite no numbers, the stale-number problem from the Version 1 reorder does not occur here. The problems are principle drift from older maps and scope leaks.
- Inline `// comment` markers inside JSX code blocks are not reported. They are a pipeline convention: `src/build-code-plus.mjs` extracts them as annotations.

---

## Lesson 01 (#what_is_react)

**Verdict: Whole lecture should be re-produced.** The principle set comes from `01-01-map-principles/v_old_01/01.md`, not the current map. Lecture P4 "Store Data in JavaScript Variables, Not in HTML Attributes" is old P2 almost word for word. Lecture P5 "Virtual DOM Reconciliation" is old P4. Lecture P3, about class-toggling intermediate states, appears in neither map. Map Principle 1 is missing. Props carry the whole practical example, including a props-versus-destructuring "crossroad" that belongs to Q06, even though the map requires a module-level constant. Re-render patching, which the map defers to Q15, is demonstrated at length.

### B. Principle alignment (current map has 5 principles; lecture has 5)

| Map principle | Lecture match | Mismatch |
|---|---|---|
| P1 Treat React as a component library you adopt one root at a time | none | Missing. No library-versus-framework framing, no one-root island, no view-source versus DevTools proof, and no sentence naming `createRoot` as Q09's subject. |
| P2 Treat the screen as a projection of your data | Lecture P1 "Build Components as Functions That Turn Data into Markup (UI = f(data))" (L:54-99) | Out of order (lecture P1 versus map P2). The substance drifts: the rule talks about re-running "when data changes" (re-render, Q15), and the body proves a `null` selector crash instead of the map's proof (a log inside a used component versus an unused one, then plain HTML in the DOM). |
| P3 Declare the destination instead of commanding each step | Lecture P3 "Write Declarative UI Descriptions Instead of Scripting Imperative DOM Transitions" (L:165-215) | The substance is different. The lecture's failure is a `classList` sequence aborted halfway (an "intermediate state"). The map's failure is a forgotten query: nine of ten name locations updated, the tenth stale. The lecture version also needs an `isPro` prop and a ternary (Q06, Q10). |
| P4 Keep one source of truth per fact | Lecture P2 "Pass Data Downward from a Single Source of Truth to Prevent State Drift" (L:101-163) | The substance is different. The lecture teaches props and "unidirectional data flow" (owner Q06 `#props`, a Preview row in the map). The map uses one `readerName` constant read by both widgets. Out of order (lecture P2 versus map P4). |
| P5 Leave React's DOM to React | Lecture P5 "Use Virtual DOM Reconciliation to Surgically Patch the DOM Without Destroying Focus" (L:261-311) | The substance is different. The map's rule is "never modify, move, or remove nodes inside React's root". The lecture instead promotes "virtual DOM reconciliation" as the principle. The map allows "virtual DOM" only as myth-busting prose, defers minimal patching across re-renders to Q15 `#render_and_commit`, and gives reconciliation to Q77 `#reconciliation_internals`. |
| (extra) | Lecture P4 "Store Data in JavaScript Variables, Not in HTML Attributes" (L:217-259) | Extra. It has no row in the current Candidate Ledger; it is old-map P2. Drop it, or keep at most one sentence inside map P3's prose. |

### E. Required Lesson Proofs

- P1: missing. There is no static page with `<div id="root">`, no view-source versus DevTools comparison, and no Q09 sentence.
- P2: missing. There is no `console.log` in `SiteHeader` compared with an unused component, and no Q15 preview sentence. L:95-97 shows only the final HTML.
- P3: partial. L:22-31 shows `updateHeaderUser` missing the mobile drawer. It does not show "nine of ten updated, the tenth still greeting the old name". The React side (L:349-359) uses props instead of a constant.
- P4: partial. Both widgets agree (L:349-359), but through props. The step where the constant is edited, the page reloads, and both widgets change together is missing.
- P5: missing. There is no plain-script proof that focuses an input, rewrites a sibling with `innerHTML`, and shows `document.activeElement === document.body` and the old node disconnected. Focus loss is described only in prose (L:33, L:288-290). The Q15 Clock preview sentence and the Q30 refs escape-hatch sentence are missing.

### Findings

| # | file:line | current text (short quote) | problem | required edit | evidence |
|---|---|---|---|---|---|
| 1 | L:52-311 | "we formalize the five governing principles of declarative synchronization" + P1-P5 boxes | The principle set comes from `v_old_01/01.md` plus one invented principle (see table B). | Rebuild the section with the map's five principles in map order: (1) adopt React one root at a time; (2) the screen is a projection of your data; (3) declare the destination instead of commanding each step; (4) one source of truth per fact; (5) leave React's DOM to React. Each needs its Required Lesson Proof. | `01-01-map-principles/01.md` "## Principles"; `v_old_01/01.md` lines 29-47 |
| 2 | L:101-122, 150-163 | "Data flows in only one direction in React, passing from parent components down to children through **props**" | Scope leak (C). Props and unidirectional flow belong to Q06 `#props` (map Preview row "Data flows one way, down through props"). The bank's design notes say Q1 must purge "premature props destructuring". | Replace with map P4: one `const readerName = 'Clara Foster'` at module level, read directly by `Greeting` and `SubscriberBadge`. Add one preview sentence: "Lecture 6 (`#props`) shows how a parent hands values to each child." | map Authorized Scope ("one module-level constant instead of props or state"); `questions.md` invariants ("permanently purging premature props destructuring") |
| 3 | L:347-398 | "developers encounter a classic pedagogical crossroad: whether to receive the raw `props` argument ... or unpack properties directly" | Scope leak (C). The props-object-versus-destructuring choice is Q06 material, taught in full here. | Delete the Option 1 / Option 2 crossroad (L:365-398). Rewrite Steps 1-3 so `ReaderGreeting` and `SubscriberBadge` take no parameters and read the shared module constant. | card 01 Scope Boundary; card 06 |
| 4 | L:349-359 with L:347 | "Notice how `SiteHeader` imports both child widgets" | Code error (D). `SiteHeader.jsx` uses `ReaderGreeting` and `SubscriberBadge` but contains no import lines, so the module would throw `ReferenceError: ReaderGreeting is not defined`. The prose claims imports that are not shown. | Keep all components and the `readerName` constant in one file (imports are Q08 `#imports`). Alternatively, show the imports with one sentence: "Lecture 8 (`#imports`) explains these import lines." | L:349-359 has no `import` |
| 5 | L:44, 48, 56, 163, 215, 263, 292-311 | "When the input data changes, React evaluates the function again"; "When `readerName` changes ... React creates two lightweight JavaScript objects" | Scope leak (C). Re-renders and minimal patching across renders are Deferred to Q15 `#render_and_commit` (rows "On re-render React applies only the minimal necessary operations ..." and "React does not touch the DOM ..."). The card says to keep data static. | Delete the prev/next descriptor demonstration (L:292-311). Replace it with one preview sentence: "Lecture 15 (`#render_and_commit`) shows React changing only the text that differs while an input keeps its typed text." | map Candidate Ledger Deferred rows to Q15; card 01 Scope Boundary |
| 6 | L:48, 263-265, 305, 463 (Glossary "Reconciliation") | "compares it to the previous tree through a process called **reconciliation**" | Scope leak (C). The reconciliation algorithm is Deferred to Q77 `#reconciliation_internals`. The map uses the official wording "calculating which properties changed and applying the minimal necessary operations". | Use the official phrase. Drop the "Reconciliation" glossary entry, or reword it as a preview: "covered in Lecture 77 (`#reconciliation_internals`)". | map row "Reconciliation matches element type and tree position" → Q77; map Completion Gate vocabulary note |
| 7 | L:48, 462 | "**UI descriptor tree** (traditionally referred to as the **virtual DOM**)" | Vocabulary. The map says "virtual DOM" appears only as myth-busting and that "UI descriptor tree" is not react.dev vocabulary. | Delete the paragraph framing. Keep the virtual DOM myth only in the TIP (L:322), which already matches the map's Supporting row. | map Supporting row "Virtual DOM is community vocabulary ..." |
| 8 | L:87-90 | `_jsx("h1", { children: ["Welcome, ", user.name] })` | Factual error (D). The automatic runtime emits `_jsxs` when an element has several static children in an array. | Write `_jsxs("h1", { children: ["Welcome, ", user.name] })`, or drop the compiler block, because compile output is Q03's topic. | Babel/automatic JSX runtime output |
| 9 | L:215 | "React compares the existing browser DOM against your newly returned descriptor" | Factual error (D). React compares the new elements with the previous render's tree held in memory. It never reads the live DOM to diff. | Delete the sentence. If anything is kept, it must say React compares the new description with the previous one in memory. Under the static scope, use only a Q15 preview. | react.dev render-and-commit Step 3 |
| 10 | L:305 | "It verifies that the `<span>` element itself, its layout geometry, and its sibling `<input>` are identical" | Factual error (D). React does not compare layout geometry. It compares element type, position, key, and props. | Delete this together with finding 5. | react.dev preserving-and-resetting-state |
| 11 | L:294-308 | descriptor `children: 'Clara F.'` then `textNode.data = 'Welcome, Clara Foster'` | Internal inconsistency (D). `Welcome, {readerName}` produces two text nodes, and React updates only the one that changed ("Clara Foster"). The descriptor and the patched string do not match. | Delete this together with finding 5. | L:271 versus L:301 versus L:308 |
| 12 | L:120-121 | `setNav(user.name); setBadge(user.name);` | Scope leak and confusion (C). The `setX` names read as React state setters (Q14 `#use_state`) inside a "plain JavaScript" counter-example. | Replace with DOM writes: `document.getElementById('nav').textContent = name;` and `document.getElementById('badge').textContent = name;`. | card 01 Scope Boundary (no `useState`) |
| 13 | L:173-213 | `function StatusBadge({ isPro }) { ... {isPro ? 'PRO MEMBER' : 'FREE READER'} ...}` | Scope leak (C). A prop plus a JSX ternary is Q06 `#props` and Q10 `#conditional_rendering`. | Delete this together with finding 1 (map P3 uses the missed-query proof, not class toggling). | map P3 Required Lesson Proof |
| 14 | L:217-259 | "Principle 4: Store Data in JavaScript Variables, Not in HTML Attributes" | Extra principle (B), with no current ledger row. L:246 also uses vague filler ("expensive C++ layout tree", "parse strings from living C++ nodes") instead of naming an exact defect. | Remove the box and its section. | `v_old_01/01.md` Principle 2 |
| 15 | L:421 | "the mounting engine evaluates the full component tree in memory and paints" | Vocabulary. The map's Completion Gate rejects "mounting engine" as non-react.dev wording. Mounting itself is Q09. | Replace with: "React calls `App`, then `SiteHeader`, then each widget, and puts the resulting HTML into the page. Lecture 9 (`#create_root`) shows how the page hands React its root." | map Completion Gate; map Preview row → Q09 |
| 16 | L:46, 484 | "A component is a standard JavaScript function whose name starts with an uppercase letter"; "ALWAYS start component function names with an uppercase letter" | Scope (C, minor). The capitalization rule is Q02 `#component_anatomy`. A one-sentence preview is allowed, but the Summary states it as a rule of this lesson. | Keep one preview sentence: "Lecture 2 (`#component_anatomy`) explains why the name must start with a capital letter." Remove the Summary bullet at L:484. | map Preview row → Q02 |
| 17 | L:486 | "keep child components stateless" | Scope (C, minor). It uses state vocabulary before Q14. | Replace with: "IF several widgets show the same fact THEN read it from one shared value." | card 01 Scope Boundary |
| 18 | L:480, 516-525 (tables), L:313-319 | "pass it downward via props"; "Centralized parent data passed downward through props"; "State Storage" row | These carry the props framing and the extra principle into the Summary and tables. | Rebuild both tables and the Summary from the five map principles once the lecture is re-produced. | follows findings 1, 2, 14 |
| 19 | (missing) | (no sentence) | The map requires one-sentence previews that the lecture never includes: Q09 `createRoot`, Q15 pipeline, Q12 purity ("same data, same screen"), Q30 refs escape hatch, and Q23 lifting (where a changing fact will live). | Add these previews, each with its v3 number and tag: Lecture 9 (`#create_root`), Lecture 15 (`#render_and_commit`), Lecture 12 (`#purity`), Lecture 30 (`#dom_refs`), Lecture 23 (`#lifting_state`). | map Preview rows; map P1/P2/P4/P5 proofs |

### A. References checked

The lecture contains no numbered cross-lesson references.

- L:31 "if an element is added later": this is not a lesson reference.
- L:451-455 "Where you will meet this" (navigation bars, carts, feeds): these are real-world uses, not lesson pointers. They are fine, but items 1 and 2 frame the fix as "passing data downward" (props, Q06). Reword them to say "one shared value".
- L:467 Beyond the basics, describing-the-ui ("how React transforms declarative JSX tags into descriptor objects"): the topic is owned by Q03 `#jsx` and Q76 `#create_element_deep`. The direction (forward) is correct and no number is given. Optionally add "(Lecture 3, `#jsx`)".
- L:468, your-first-component: owned by Q02 `#component_anatomy`. Correct (forward). Optionally add "(Lecture 2)".
- L:469, passing-props: owned by Q06 `#props`. Correct (forward). Optionally add "(Lecture 6)".
- L:470, createElement: owned by Q76 `#create_element_deep`. Correct (forward). Optionally add "(Lecture 76)".
- L:462-463 glossary "UI Descriptor Tree" and "Reconciliation": these preview Q77 material without saying so (see findings 6 and 7).

References checked and correct: L:467, 468, 469, 470 (unnumbered, forward, correct owners). L:451-455 are not lesson references.

### Pre-lecture and revised copy

- **PRE/01.md** has the same findings at these lines:
  - #1: PRE:43-160 (boxes 45-64, 68-89, 93-115, 119-136, 140-158; derivations 66, 91, 117, 138, 160)
  - #2: PRE:68-91 and 197
  - #3: PRE:215-253
  - #4: PRE:197 and 201-211
  - #5: PRE:37, 39, 91 ("When the parent re-renders with updated data"), 160
  - #6: PRE:39, 142-144, 322
  - #7: PRE:39, 321
  - #12: PRE:87-88
  - #13: PRE:100-115, 117
  - #14: PRE:119-138
  - #15: PRE:278
  - #16: PRE:38, 343
  - #17: PRE:345
  - #18: PRE:162-169, 339, 376-385
  - References: Beyond the basics PRE:326-329, Where you will meet PRE:312-314, Glossary PRE:321-322
  - Findings #8-#11 do not apply: the pre-lecture has no compiler, descriptor, or text-node blocks.
- **Unique to PRE/01.md:**
  - PRE:160: "deconstruct the computational cost of DOM mutations and the performance rationale behind in-memory diffing". This contradicts the TIP at PRE:171 and the map, which say the guarantee is correctness, not speed. Rewrite it as "React applies the minimal necessary operations; the benefit is correct updates, not raw speed."
  - PRE:160 also claims React "calculates that the container `<header>`, the layout, and surrounding elements are identical". This is the same factual error as finding #10.
- **REV/01.md:** same line numbers as the lecture for every finding. There are no differences except `~` markers.

---

## Lesson 02 (#component_anatomy)

**Verdict: Principle section must be rebuilt.** The lecture follows `v_old_01/02.md`: PascalCase, render purity, intentional return paths, and JSX versus direct calls. Its intro (L:54) still says "capitalization, purity, and return contracts". The current map has three principles: PascalCase, top-level declaration with no nested definitions, and JSX invocation. Lecture P2 (purity, StrictMode) and P3 (return contract) must go. The nested-definition principle is missing. Lecture P3 also contains a React 18+ factual error, and the opening story claims there is no console warning, which is false.

### B. Principle alignment (current map has 3 principles; lecture has 4)

| Map principle | Lecture match | Mismatch |
|---|---|---|
| P1 Capitalize custom component names with PascalCase | Lecture P1 (L:56-119) | Substance matches. The compile output string is wrong (finding 3), and the claim of no console output is wrong (finding 2). |
| P2 Declare components at the top level of the module and never nest their definitions | none | Missing. There is no `EditorialByline` nested inside `ArticleCard`, no function-identity proof, and no Q24 preview. |
| P3 Render components declaratively in JSX rather than calling them as functions | Lecture P4 (L:230-291) | Substance matches. The position differs (lecture P4 versus map P3). The proof differs: the lecture shows compiler output, while the map asks for the React DevTools tree with `ArticleCard` missing versus present. |
| (extra) | Lecture P2 "Keep Component Rendering Pure and Free of Outside Side Effects" (L:121-177) | Extra. The ledger makes purity a Preview owned by Q12 `#purity` ("previewed in one sentence"). StrictMode is owned by Q46 `#strict_mode`, and concurrent rendering by Q66 `#concurrent_rendering`. |
| (extra) | Lecture P3 "Fulfill the Pure Return Contract and Use Null to Explicitly Suppress Output" (L:179-228) | Extra and factually wrong (finding 1). Returning `null` to render nothing is owned by Q10 `#conditional_rendering` (map 03 ledger Deferred row "... or returning null" → Q10). The ASI parentheses point is a Supporting row in map 02 and is already handled in Step 1. |

### E. Required Lesson Proofs

- P1: mostly present. It has the lowercase DOM node (L:97-99), compiled output (L:91-93, L:115-117), and the PascalCase fix. Two parts are wrong: the compiled string (should be `"articleCard"`), and "no console error", because React logs a casing warning in development.
- P2: missing entirely.
- P3: partial. The compiled output contrast is present (L:261-289). The React DevTools tree comparison (`ArticleCard` absent under `App` versus present as its own node) is missing.

### Findings

| # | file:line | current text (short quote) | problem | required edit | evidence |
|---|---|---|---|---|---|
| 1 | L:179-228, 299, 497 | "Forgetting a return statement causes the function to evaluate to `undefined`, triggering a fatal development crash"; "Error: Nothing was returned from render" | Factual error (D), high confidence. Since React 18, a component may return `undefined`. It renders nothing and throws no error. The lecture even contradicts itself at L:365 ("returns `undefined` ... blank card with zero errors"). | Delete Principle 3 and its section, plus table row 3 (L:299). Keep the ASI parentheses point only as supporting prose in Step 1, as now. Its real danger is a silently blank card, which L:365 already states correctly. If `return null` is mentioned, add: "Lecture 10 (`#conditional_rendering`) shows how to render nothing on purpose." | React 18 release notes ("Components can now render undefined"); L:365 |
| 2 | L:7, 14-16, 40, 452 | "Why does the build compile with zero errors and zero console warnings"; "the browser developer console reports zero warnings" | Factual error (D), high confidence. In development, React DOM logs ``<articleCard /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.`` For an all-lowercase unknown tag it logs ``The tag <articlecard> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.`` The terminal build is clean; the browser console is not. | Rewrite the ladder step 4 and the opening as: "the build passes, the page shows nothing, and the only clue is a red console line saying `<articleCard /> is using incorrect casing`". Add that console line to the P1 proof. Card 02 Friction and map 02 P1 proof ("no console error") need the same fix, so report this to the map owner. | React DOM development warnings (createInstance casing and unknown-tag checks) |
| 3 | L:33, 75, 92, 297, 327, 495 | `_jsx("articlecard", {})` | Factual error (D). The compiler keeps the tag text exactly as written: `_jsx("articleCard", {})`. The browser lowercases the name when it creates the element in an HTML document, which is why DevTools shows `<articlecard>`. | Write `_jsx("articleCard", {})` in compiled output. Keep `<articlecard></articlecard>` for the DOM view. Explain in one sentence that the browser lowercases HTML tag names. Card 02 and map 02 repeat the error, so report it upstream. | Babel automatic runtime output; HTML `createElement` lowercasing |
| 4 | L:121-177, 298, 441, 500-501 | "Principle 2: Keep Component Rendering Pure ... React StrictMode intentionally calls your function twice" | Extra principle (B) and scope leak (C). Purity is owned by Q12 `#purity`, StrictMode by Q46 `#strict_mode`, and concurrent rendering (L:177) by Q66 `#concurrent_rendering`. L:155 "StrictMode intentionally mounts every component twice" also mixes up double rendering with the effect re-mount. | Delete the box and its section. Replace with one preview sentence: "A component must also be pure, returning the same markup for the same inputs; Lecture 12 (`#purity`) shows what breaks when it is not." Remove table rows L:298 and L:500 and the StrictMode reference in L:501. | map 02 Preview row → Q12; v3 rows 12, 46, 66 |
| 5 | (missing) | (no nested-definition content) | Missing principle (B, E). Map P2 says to declare components at module top level and never nest a definition inside another component. | Add a principle box and section: declare `function EditorialByline()` inside `ArticleCard`, show that each `ArticleCard` call creates a new `EditorialByline` function (for example, compare references kept from two calls), then move it to module scope. End with: "Lecture 24 (`#component_identity`) shows the state this resets." | map 02 Principle 2 and Required Lesson Proof |
| 6 | L:50, 228, 268, 291, 390, 404, 408, 414, 434-435, 462, 464 | "React splits execution into ... **Render Phase** and the **Commit Phase** ... **Fiber node**"; "registering a dedicated fiber node" | Scope leak (C). Render and commit phases belong to Q15 `#render_and_commit`. Fiber belongs to Q78 `#fiber_architecture`. Re-render isolation (L:291) belongs to Q54 `#re-render_mechanics`. The map's P3 rule says "position in the fiber tree", but its proof is DevTools-only. | Delete L:50 and the Glossary entries "Fiber Node" and "Render Phase". Describe direct calls by the observable symptom: "`ArticleCard` disappears from the React DevTools component tree and its markup is folded into `App`". Add one preview sentence: "Lecture 15 (`#render_and_commit`) shows what React does with each component it calls." | v3 rows 15, 54, 78; map 02 P3 proof |
| 7 | L:129-131, 166-175, 187-207, 220-228 | `function ArticleCard({ edition })`; `({ edition = 1 })`; `({ isPublished })`; `if (!isLive) return null` | Scope leak (C). Props (Q06 `#props`), default values (Q07 `#children`), and conditional returns (Q10) appear. The card says "Do not introduce props". | These go away with findings 1 and 4. All remaining components must take no parameters. | card 02 Scope Boundary |
| 8 | L:228 | "When props update later [em-dash] such as changing `isPublished` to `true` [em-dash] React re-evaluates" | This line contains em-dashes, which the workspace law forbids. It also adds a props and re-render scope leak. | Delete it together with finding 1. | AGENTS.md "Zero em-dashes" |
| 9 | L:336-341, 390, 393, 407 | `components/ArticleCard.jsx`; `import ArticleCard from './components/ArticleCard.jsx'` | Scope leak (C). The card says "Do not introduce ... multi-file trees". Imports are a Q08 `#imports` Preview. | Put `ArticleCard` and `App` in one file (`App.jsx`) and drop the import. Alternatively, keep the import with one sentence: "Lecture 8 (`#imports`) covers splitting components into files." | card 02 Scope Boundary; map 02 Preview row → Q08 |
| 10 | L:384, 458, 499 | "It returns a single root container element"; "ALWAYS return a single root element or React Fragment" | Scope (C, minor). The single-root rule and Fragments are Q03 `#jsx` (a Preview). The Summary states them as this lesson's rule. | Keep L:384 as a preview: "(why one root is required is the subject of Lecture 3, `#jsx`)". Remove the Summary bullet L:458 and table row L:499. | map 02 Preview row → Q03 |
| 11 | L:75, 327 versus L:297 | "checks the Unicode category of the first letter" / "Unicode casing" versus "ASCII casing" | Internal inconsistency (D, minor). The JSX transform treats a tag as a built-in element when it starts with a lowercase ASCII letter (or contains a dash). | Use "lowercase first letter" in all places, without naming Unicode or ASCII. | Babel `isCompatTag` (`/^[a-z]/`) |
| 12 | L:54 | "candidates must explain why React enforces strict capitalization, purity, and return contracts ... the four governing principles" | Intro is stale (B). | Replace with: "three governing principles: capitalized names, top-level definitions, and declarative invocation". | map 02 Principles |
| 13 | L:426 | "allows the parent shell to manage lifecycles and error boundaries" | This is an unnumbered preview of Q72 `#error_boundaries`. Acceptable, but "lifecycles" is vague. | Optional: "lets React track each widget as its own component (error boundaries, Lecture 72, `#error_boundaries`)". | v3 row 72 |

### A. References checked

The lecture contains no numbered cross-lesson references.

- L:14 "calculateReadingTime" matched "later" in the search; it is not a reference.
- L:228 "When props update later": a forward pointer to props (Q06) and re-render (Q15). It is out of scope; see finding 8.
- L:268 "cannot manage future state hooks or lifecycles": a forward pointer to Q14 `#use_state` and Q37 `#rules_of_hooks`. The direction is correct and it is acceptable as a one-clause preview. Optionally add "(Lecture 37, `#rules_of_hooks`)".
- L:291 "If `ArticleCard` needs to re-render in response to future data changes": a forward pointer to re-render mechanics, Q54 `#re-render_mechanics`. It teaches Q54 material, so remove it (finding 6).
- L:425-427 "Where you will meet this": real-world uses. Item 2 previews Q72 (finding 13).
- L:439 Beyond the basics, your-first-component: Q02 itself, plus exports owned by Q08 `#imports`. Correct.
- L:440, writing-markup-with-jsx: owned by Q03 `#jsx`. Correct (forward). Optionally add "(Lecture 3)".
- L:441, keeping-components-pure and StrictMode: owned by Q12 `#purity` and Q46 `#strict_mode`. Correct (forward). Optionally add "(Lectures 12 and 46)".
- L:442, createElement: owned by Q76 `#create_element_deep`. Correct (forward).
- L:434-435 glossary "Fiber Node" and "Render Phase": these preview Q78 and Q15 without saying so (finding 6).

References checked and correct: L:268, 439, 440, 441, 442 (unnumbered, forward, correct owners). L:14 is not a lesson reference.

### Pre-lecture and revised copy

- **PRE/02.md** has the same findings at these lines:
  - #1: PRE:92-111 and 137, 304. PRE:111 quotes the message as `Error: ArticleCard(...): Nothing was returned from render`.
  - #2: PRE:7, 14-15, 36 ("without console errors"), 258
  - #3: PRE:68, 140, 302
  - #4: PRE:70-90, 136, 247, 307-308
  - #5: missing in PRE as well
  - #6: PRE:43, 130, 197, 213, 215, 221, 240-241, 268, 270
  - #7: PRE:78-81, 100-108
  - #9: PRE:150-156, 197, 202
  - #10: PRE:162, 191, 264, 306
  - #11: PRE:36 ("ASCII"), 68 ("Unicode"), 135 ("ASCII"), 140 ("Unicode")
  - #12: PRE:47
  - #13: PRE:232
  - References: PRE:130 ("future state hooks"), Beyond the basics PRE:245-248, Where you will meet PRE:231-233, Glossary PRE:240-241
  - Finding #8 does not apply: the pre-lecture has no em-dash.
- **Unique to PRE/02.md:**
  - PRE:90 says the counter jumps "from 0 to 2 immediately" because StrictMode "evaluates the component twice ... per mount". This is the same StrictMode leak as finding #4; remove it with that section.
  - PRE:111 calls the `null` slot an "empty slot in the virtual DOM tree". Remove it with finding #1.
- **REV/02.md:** same line numbers as the lecture for every finding, including the em-dash at REV:228.

---

## Lesson 03 (#jsx)

**Verdict: Small edits.** The four principles match the current map in count and order. The titles follow the older wording of `v_old_01/03.md` ("Return a Single Root Expression", "Map Attribute Names to CamelCase DOM Properties"), but the substance is the same. These fixes are needed:

- Principle 4 lacks the map's `aria-*` / `data-*` hyphen exception.
- The Fragment proof does not show the grid collapsing from three columns to one.
- Three factual claims need correcting: the comma operator, `element.className` assignment, and "compiler warnings".
- Fiber, commit-phase, and keyed-fragment material should be trimmed to previews.

### B. Principle alignment (current map has 4 principles; lecture has 4)

| Map principle | Lecture match | Mismatch |
|---|---|---|
| P1 Enclose multiple adjacent elements in a single parent container | Lecture P1 (L:54-124) | Matches. |
| P2 Prefer React Fragments over dummy wrappers when grouping siblings | Lecture P2 (L:129-202) | The substance matches, but the proof differs (see E). |
| P3 Explicitly close every JSX tag, including self-closing elements | Lecture P3 (L:207-270) | Matches. `<br>` is not part of the proof. |
| P4 Write standard HTML attributes in camelCase while keeping hyphens on aria and data attributes | Lecture P4 "Map Attribute Names to CamelCase DOM Properties to Prevent Keyword Collisions" (L:275-343) | Partial. The `aria-*` / `data-*` exception, which is half of the map rule, is missing from the box, the body, the matrix (L:347-353), and the Summary (L:522-526). |

### E. Required Lesson Proofs

- P1: present (L:79-122). Minor issue: the error snippet text at L:93-96 does not match the source at L:82-83 ("City Transit Accord" versus "City Transit Accord Finalized").
- P2: partial. The map asks for three `ArticleCard`s in a `display: grid; grid-template-columns: repeat(3, 1fr)` container: the dummy `<div>` makes one cell, and `<>` restores three columns. The lecture shows a grid DOM listing (L:169-176) with no CSS and no visible collapse. Step 2 (L:445) switches to a flex column.
- P3: present (L:228-268). It lacks the `<br>` half. The error snippet at L:244 shows `alt="Metro"`, which the source at L:232 does not have.
- P4: partial. The `class`/`for` warnings are shown without the "Did you mean `className`?" / "Did you mean `htmlFor`?" suffix. The `aria-label="Story card"` and `data-testid="article-card"` step that ends with a clean console is missing. L:338 compiles `htmlFor: "email-field"`, but the source at L:324 says `htmlFor="sub"`.

### Findings

| # | file:line | current text (short quote) | problem | required edit | evidence |
|---|---|---|---|---|---|
| 1 | L:275-343, 347-353, 522-526 | "Name JSX attributes using camelCase to align with browser DOM element object properties" | Principle substance is incomplete (B, E). The `aria-*` / `data-*` exception is missing. | Retitle the box "Write standard HTML attributes in camelCase while keeping hyphens on aria and data attributes". Add to the rule: "`aria-*` and `data-*` keep their dashes." In the body, add `aria-label="Story card"` and `data-testid="article-card"` to the fixed `<article>` and show a clean console. Add a matrix row and a Summary bullet for the exception. | map 03 Principle 4 Rule and Required Lesson Proof |
| 2 | L:343 | "React iterates over this object and assigns `element.className = 'tag'` and `element.htmlFor = 'email-field'` directly to the living DOM element's properties" | Factual error (D). React DOM writes these as the HTML attributes `class` and `for` (it sets attributes, not the `className`/`htmlFor` properties). Only the names follow the DOM property names. | Replace with: "The names come from the browser's own DOM property names, `className` and `htmlFor`; when React writes them to the page it sets the `class` and `for` attributes you see in the Elements panel." | React DOM `setProp` (`className` → `class` attribute, `htmlFor` → `for`) |
| 3 | L:526 | "NEVER write ... `class` or `for` in JSX attributes, which triggers compiler warnings and parser collisions" | Factual error (D). `class="x"` compiles without any error or warning. React DOM logs a runtime development warning, ``Invalid DOM property `class`. Did you mean `className`?``, and the attribute still reaches the DOM. | Replace with: "NEVER write `class` or `for` in JSX: React logs `Invalid DOM property` warnings in the browser console and reviewers reject it." | L:309 already says compilers allow it, so L:526 contradicts the lecture's own text |
| 4 | L:46 | "writing two adjacent tags is mathematically identical to writing `return _jsx('h2'), _jsx('p');`" | Factual error (D). The comma version is valid JavaScript and silently returns only the second element. Adjacent JSX tags are a parse error. They are not identical. | Replace with: "Two adjacent tags would be two function calls side by side, which is not valid JavaScript; even the comma operator, `return _jsx('h2'), _jsx('p')`, would keep only the paragraph and silently drop the headline." | ECMAScript grammar; react.dev writing-markup DeepDive |
| 5 | L:311-313 | "Warning: Invalid DOM property `class`." / "`for`." | Proof incomplete (E). The map's expected text includes "Did you mean 'className'?" / "Did you mean 'htmlFor'?". | Show the full lines: ``Invalid DOM property `class`. Did you mean `className`?`` and ``Invalid DOM property `for`. Did you mean `htmlFor`?`` | map 03 P4 proof |
| 6 | L:167-176, 445 | grid DOM listing with no CSS; Step 2 uses "`display: flex` and `flex-direction: column`" | Proof partial (E). The three-column grid collapse is never shown. | Add the map's grid proof: `.newsroom-grid { display: grid; grid-template-columns: repeat(3, 1fr); }` with three `ArticleCard`s. Show the dummy `<div>` occupying one cell (all cards stacked in the first column), then `<>` restoring three columns. | map 03 P2 Required Lesson Proof |
| 7 | L:463 | "registering a dedicated fiber node" | Scope leak (C). Fiber belongs to Q78 `#fiber_architecture`. | Replace with: "renders `<EditorialDispatch />` as a component tag, as Lecture 2 (`#component_anatomy`) requires". | v3 row 78 |
| 8 | L:48, 202, 205, 343, 470 | "during the commit phase"; "during reconciliation, React detects this symbol" | Scope (C, minor). Commit and reconciliation are Q15 `#render_and_commit` and Q77 `#reconciliation_internals` vocabulary. | Use plain wording: "when React puts the result on the page it skips the Fragment and places its children directly in the parent". Allow at most one preview: "Lecture 15 (`#render_and_commit`) names this step." | v3 rows 15, 77 |
| 9 | L:205, 401, 404, 481, 514 | "`<React.Fragment key={id}>` is required when rendering mapped collections"; "IF mapping over collections ... THEN use explicit `<React.Fragment key={id}>`" | Scope (C). Keyed fragments are a Preview owned by Q11 `#rendering_lists` (one sentence). The Summary bullet at L:514 teaches it as a rule, and L:481 maps collections. | Keep one preview sentence (L:205 or L:404): "The long form `<Fragment>` can take a `key`; Lecture 11 (`#rendering_lists`) shows when a list needs one." Remove the Summary bullet L:514. Reword L:481 without `map`/`key`, for example "table rows and definition lists, where a `<div>` between `<tbody>` and `<tr>` is invalid HTML". | map 03 Preview row → Q11 |
| 10 | L:303, 327 | `<input id="sub" tabIndex={1} />` | Scope leak (C). Curly-brace expressions are excluded by card 03 ("Do not introduce dynamic curly brace expressions"). Q04 `#jsx_expressions` owns them. | Remove `tabIndex={1}`, or write `tabIndex="1"`. | card 03 Scope Boundary |
| 11 | L:448, 462 | `import EditorialDispatch from './components/EditorialDispatch.jsx'`; "It imports `EditorialDispatch` as a first-class function identifier" | Scope (C, minor). Imports belong to Q08 `#imports`. | Keep both components in `App.jsx`, or add one preview sentence: "Lecture 8 (`#imports`) covers this import line." | v3 row 8 |
| 12 | L:205 | "`<React.Fragment>` compiles to `_jsx(React.Fragment, { children: [...] })`" | Minor factual inaccuracy (D). With an array of several children the compiler emits `_jsxs`, as the lecture itself shows at L:194 and L:372. L:404 also says `_jsx(Fragment, ...)`. | Write `_jsxs(Fragment, { children: [...] })` in both places. | L:194, 372 |
| 13 | L:93-96, 244, 338 | error snippets and compiled output that do not match their sources | Internal inconsistency (proof quality). | Make each error snippet and compiled block echo its source exactly: L:82-83 text, L:232 with no `alt`, and `htmlFor: "sub"`. | L:82-83 versus 94-95; L:232 versus 244; L:324 versus 338 |
| 14 | L:473 | "Extra wrapper divs break semantic screen-reader outlines" | Vague claim (D, low). A `<div>` has no role and does not change the accessibility outline. The real defects are invalid nesting (`<div>` inside `<tbody>`/`<ul>`) and broken flex/grid children. | Replace with the exact defect: "an extra `<div>` inside a `<ul>` or `<tbody>` is invalid HTML, and inside a grid it becomes one cell holding every card". | Doctrine principle 5 (Name the Exact Platform Defect) |

### A. References checked

The lecture contains no numbered cross-lesson references.

- L:438-440 Step 1 checklist: "PascalCase naming" and "multi-line return inside parentheses" are Q02 prerequisites, restated as a checklist. Not a reference. Acceptable as a short reminder; optionally add "(from Lecture 2, `#component_anatomy`)". The direction (earlier) would be correct.
- L:459 "If an engineer later inspects the page": not a lesson reference.
- L:480-482 "Where you will meet this": item 2 previews Q11 (finding 9). Items 1 and 3 are real-world uses.
- L:495 Beyond the basics, writing-markup-with-jsx: Q03 itself. Correct.
- L:496, Fragment reference including keyed fragments: owned by Q11 `#rendering_lists` for keys and Q30 `#dom_refs` for Fragment refs. Correct (forward).
- L:497, legacy new JSX transform blog: owned by Q03 and Q76 `#create_element_deep`. Correct.
- L:498, common DOM components: owned by Q83 `#html_components` (attributes and styles) and Q13 `#event_handling` (event bindings). Correct (forward).

References checked and correct: L:438-440, 495, 496, 497, 498. L:459 is not a lesson reference.

### Pre-lecture and revised copy

- **PRE/03.md** has the same findings at these lines:
  - #1: PRE:114-131, 135-141, 319-323
  - #2: PRE:116, 131 (weaker wording: "map seamlessly to DOM properties")
  - #3: PRE:323
  - #4: PRE:40
  - #6: PRE:240 (flex only; no grid proof anywhere in PRE)
  - #8: PRE:41, 265
  - #9: PRE:199, 201, 218, 278, 293, 311
  - #11: PRE:240, 244
  - #12: PRE:93 ("`<>...</>` compiles to `_jsx(React.Fragment, ...)`"), 201
  - #14: PRE:268
  - References: Beyond the basics PRE:292-295, Where you will meet PRE:277-279
  - Findings #5, #7, #10, #13 have no counterpart: the pre-lecture has no console-warning block, no fiber mention, no `tabIndex={1}` code, and no error snippets.
- **Unique to PRE/03.md:**
  - PRE:112 explains the unclosed `<img>` error as the parser reaching "the end of the file" with an "unterminated token". The lecture (L:238-241) shows the closing-tag mismatch instead. Align PRE with the lecture: the parser meets `</div>` while `<img>` is still open and reports "Expected corresponding JSX closing tag for `<img>`".
  - PRE:234 lists `className="dispatch-badge"`, but the code at PRE:226 uses `className="badge"`. Make them match.
- **REV/03.md:** same line numbers as the lecture for every finding.

---

## Follow-ups outside lectures 01-03 (upstream sources)

- Card `P/01-01-map/02.md` (Friction, Under the Hood) and map `P/01-01-map-principles/02.md` (P1 Rule and Proof, Senior Answer) repeat two errors from Lesson 02. First, they say lowercase tags show "no console error" or "no warning", but React DOM logs a casing or unrecognized-tag warning in development. Second, they give the compiled output as `_jsx("articlecard")`, but the compiler keeps the source casing: `_jsx("articleCard")`. Correct both before Lecture 02 is re-authored.
- Card `P/01-01-map/03.md` (Under the Hood) uses the comma-operator idea that leads to Lesson 03 finding #4. The map's Senior Answer is acceptable, but authors should not describe adjacent tags as "identical" to a comma expression.
