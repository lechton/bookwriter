# OPERATIONAL AUDIT CHECKLIST: React 19 Production Lectures (react-lecture-03)

This checklist enforces the mechanical, pedagogical, architectural, and visual invariants for every lecture authored in `react-lecture-03`. Run through this gate before marking any lecture as complete.

## Operational Directives: `ppp`, `ppi`, and `nnn`
- **`ppp` (Please Proceed)**: General execution trigger. When the user prompt contains `ppp`, it means "proceed": immediately execute the approved plan, author or edit files, and run builds without requesting further confirmation.
- **`ppi` (Proceed with Instructions Only)**: Instructions-only execution trigger. When the prompt contains `ppi`, you are allowed to proceed and edit the instructions, but **ONLY the instructions** and **NOT any particular lecture or other file to adapt from the instructions**. You MUST stop the moment you finish polishing and fixing the instructions.
- **`nnn` (Chat-Only Constraint)**: General chat-only constraint. When the prompt contains `nnn`, do NOT make any edits or create any files in the workspace, and do not run modifying commands. Strictly discuss, brainstorm, analyze, and refine ideas in the chat until explicitly ordered to proceed.

---

## Gate 0: The Developer-at-the-Keyboard Gate (The Anti-Internal-Engine Trap & Tired Reader Standard)
- [ ] **No Internal-Engine Trap:** Verify prose does NOT speak from the compiler's or engine's perspective, never treats technical terms as Platonic forms, and bans bureaucratic brochure-speak (*"fundamentally alters its submission runtime across four core guarantees"*).
- [ ] **Developer-at-the-Keyboard Guidance:** Verify the author guides the reader step by step from the desk, in accessible CEFR B2 vocabulary, as if the reader is tired and has a short attention span, yet delivers complete, interview-winning depth.
- [ ] **Utilitarian Three-Anchor Formula:** Does every concept clarify: (1) what the developer writes, (2) what tedious boilerplate is eliminated (contrasting with manual `useState` keystroke tracking, `e.preventDefault()`, and `try / finally` loading flags), and (3) what concrete behavior happens in the browser?
- [ ] **The Lucid Step-by-Step Sentence Gate (Ban on Comma-Separated Run-On Sentences):** Verify that prose does NOT pack multiple conceptual stages into a single comma-separated sentence (e.g. *"When a user submits the form, React intercepts the native submit event automatically, gathers all contained inputs that declare a name attribute into a native browser FormData instance, and passes that dictionary directly to the action function"*). Instead, verify that prose flows like clear water: (1) reminds the physical basics (the form, inputs, and `name` attributes), (2) explains what happens when the user interacts or submits, (3) explains the data aggregation into `FormData`, and (4) explains where that data arrives.
- [ ] **The Practical Developer Reality Gate (Ban on Normative Universe Decrees):** Verify that the author does NOT proclaim arrogant universal decrees (*"Developers never author `e.preventDefault()`"*), but writes from the practical developer's lived reality (*"Developers never need to write `e.preventDefault()` anymore. Why? React now prevents full-page document reloads... At the same time, standard keyboard interactions are preserved: the user, for example, can press Enter to submit without any problem"*).

---

## Gate 0.1: The Topic Fidelity & Architectural Independence Gate (MANDATORY TOPIC INDEPENDENCE)
- [ ] **100% Faithful to Assigned Question Bank Row:** Read `questions/questions.md` row `# | Tier | Topic | Question | Hook`. The lecture's title, opening ladder, code examples, and figures MUST be derived 100% from this exact assigned question.
- [ ] **Strict Prohibition on Adjacent Lecture Cloning:** It is STRICTLY FORBIDDEN to carry over, reuse, or clone the components, hooks, scenarios, or diagrams from an adjacent lecture.
  - *Example*: When authoring Lecture 41 (`#form_actions`), the hero mechanism is the `<form action={fn}>` and `<button formAction={fn}>` attributes, native `FormData` harvesting, background React Transitions, and uncontrolled input resetting. It MUST NOT be hijacked by or turned into a clone of Lecture 40 (`useFormStatus` and `<SubmitButton>`).
- [ ] **Topic-Specific Scenario & Component Design:** Author custom application scenarios and components tailored specifically to demonstrate this question's unique platform primitives.

---

## Gate 1: Typology Tagging & Opening Ladder Gate
- [ ] **Verbatim Question Box:** Line 2 matches `> INTERVIEW QUESTION | {tier} | {question text copied verbatim}`.
- [ ] **Beat Count:** Exactly 7 numbered beats opening the body adhering to the Canonical 7-Slot Blueprint: (1) Scene, (2) Setup, (3) Mismatch Action, (4) Direct Conflict Question, (5) Danger, (6) Mystery, (7) Promise.
- [ ] **Sentence Length Ceiling:** Strict $\le 20$ words per sentence. No sentence over 20 words.
- [ ] **Formatting:** Zero em-dashes (`—`). Numbered beats (`1.`, `2.`). Single continuous line per beat (never hard-wrap).
- [ ] **Strict Ban on Premature Mechanism Naming:** Never name the lecture's mechanism terms in beats 1–6 (the mechanism is earned later in the body). Describe the visible, physical behavior instead.
- [ ] **Single Tangible Actor:** One person with an unambiguous real-world role (e.g. Elena, a newsroom journalist).
- [ ] **Zero Newsroom Jargon:** Ban industry jargon like "byline", "masthead", "copy", "wire", "dispatch desk". Use "author profile", "site header", "text", "live feed".

---

## Gate 2: Put Yourself in the Student's Shoes & Invisible Empathy
- [ ] **What is changing:** Remind the reader how we used to solve the problem, and show what the new feature makes easier.
- [ ] **What looks weird or surprising:** Address unexpected patterns directly in the prose (e.g. zero props for ambient context, or the total absence of `onSubmit`/`e.preventDefault()` and `useState` for form actions).
- [ ] **Technical grounding in plain English:** Explain all complex terms in plain English before using them. Ban raw jargon dumps.
- [ ] **Invisible Scaffolding (Zero Meta-Labels):** Absolutely zero meta-labels (`1. Novelty:`, `2. Weirdness:`, `Cognitive Inference:`, `Part (a/b/c)`) appear anywhere in the output.
- [ ] **Strict Ban on Invented Metaphors:** Unofficial metaphors ("radio tower", "Wi-Fi bubble", "ambient receiver", "satellite dish") are PERMANENTLY BANNED.
- [ ] **Standard React Vocabulary Gate (Strict Ban on Invented Vocabulary):** Always explain key terms on their first introduction. Authors are STRICTLY FORBIDDEN from ever inventing new technical vocabulary that does not exist and MUST ONLY use standard React and web platform vocabulary (as established in official specifications and `react.dev`). When describing developer habits, common mistakes, or runtime problems, describe the plain reality in clear English: NEVER reify descriptive situations into fake proper nouns or pseudo-academic buzzwords:
  - *Plain reality*: "Developers often fall into the habit of controlling every input." ➔ **DO NOT USE fake term**: `**controlled form illusion**`.
  - *Plain reality*: "Typing triggers a render on every keypress, which gets slow." ➔ **DO NOT USE fake term**: `**keystroke tracking fatigue**`.
  - *Plain reality*: "Passing props through intermediate wrappers that do not need them." ➔ Use standard vocabulary: `**prop drilling**`.
  - *Plain reality*: "Inputs that read DOM values on submit without React state." ➔ Use standard vocabulary: `**uncontrolled components**` / `**uncontrolled inputs**`.

---

## Gate 3: Structural Scaffold & Visual Panels
- [ ] **The File Explorer (` ```files `):** Dedicated strictly to disk hierarchy with clean macOS chrome (`File | Role | Description`), tagged with roles (`parent`, `boundary`, `consumer`, `button`, `state`, `child`), matching the real code 1:1.
- [ ] **The Component Code Architecture Panel (` ```component-code `):** Full-width canvas displaying component hierarchy with tokenized code, connecting JSX, hook subscriptions, colored kind tabs, and rendered terminal UI controls.
- [ ] **The Architectural Curation Law (Anti-Full-Code-Dump Gate):** Verify that the component panels are strictly architectural skeletons. Copy-pasting full component code, local state hooks (`useState`), validation loops, or multi-line fetch logic is STRICTLY BANNED. The panel curates ONLY: (1) parent mounting tag, (2) boundary declaration and action prop, (3) key inputs and action controls participating in the circuit, and (4) terminal UI indicator. The panel must be scannable in under 5 seconds.
- [ ] **Mandatory Component Explorer (` ```components `):** Exactly one panel placed before the first code implementation block, containing EVERY file shown or imported, using proper visual kinds, and wrapping all JSX tags cleanly across lines with indentation.
- [ ] **Zero "none" Display:** Column 2 is strictly for meaningful props; `none` is suppressed automatically.
- [ ] **Anti-Leaf Law:** The academic term "leaf" is PERMANENTLY BANNED. Use `parent`, `child`, `nested child`, `grandchild`, `ancestor`, `descendant`, or `terminal UI control`.

---

## Gate 4: The 4-Phase Information Flow Lifecycle
- [ ] **Phased Text Section Present:** Dedicated section deconstructing the topic's data flow across 4 sequential phases (`#### Phase 1: ...` through `#### Phase 4: ...`).
- [ ] **Concise Bullets with Bold Micro-Leads:** Exactly 3 to 4 concise bullets per phase, each opening with a bold micro-lead (`* **Micro-lead**: ...`). Long dense prose paragraphs are strictly banned.
- [ ] **Standard Terminology Only:** Strict use of official React and web platform terms (`FormData`, `Transition`, `Context Provider`, `prop drilling`, `native browser event`, `event bubbling`, `server action`, `re-render`).
- [ ] **Mandatory Inline Parenthetical Gloss Law:** Every newly introduced technical term MUST be immediately followed by a 4-to-10 word plain-English explanation enclosed in parentheses right next to it.
- [ ] **Topic-Adaptive Cadence:** The 4 phases must match the authentic lifecycle of this specific topic:
  - *Form Actions*: Submission Trigger & Button Action Resolution $\to$ Native `FormData` Harvesting $\to$ Transition Execution $\to$ Uncontrolled Input Reset.
  - *Form Status*: Native Event Bubbling $\to$ Automatic Context Provider Boundary $\to$ Nested Hook Subscription $\to$ Isolated Component Re-render.
  - *Action State*: Action Dispatch $\to$ Asynchronous Reducer Execution $\to$ Transition Broadcasting $\to$ State Settlement.
  - *Optimistic UI*: Synchronous Optimistic Update $\to$ Background Request $\to$ Server Reconciliation $\to$ Rollback/Settlement.

---

## Gate 5: The 5-Stage Practical Example & Code Showcase Architecture
Under `### Let's Design a Practical Example <Component1> <Component2>`:
- [ ] **Stage A (Scaffold & File Explorer):** Introduce component roles and disk hierarchy via the ` ```files ` panel.
- [ ] **Stage B (Assembly Pipeline Roadmap):** Embed introductory multi-step Progressive Assembly Step Cards figure (`figures/{NN}-01-code-assembly-pipeline.html`, Template 09 `templates/09-progressive-assembly-step-cards.html`, as established in Lecture 40) with color-coded horizontal stage cards mirroring the collaborative step sequence.
- [ ] **Stage C (Sequential Implementation Steps):** Walk through code assembly using the collaborative pair-programming sequence: `### Step 1: First, we...`, `### Step 2: Next, we...`, `### Step 3: Then, we...`, `### Step 4: Finally, we...` (Step 4 mounting `App.jsx`).
- [ ] **Stage D (Direct Lessons Lead-in):** Conclude the code walkthrough with `### Direct Lessons from the Experiment: Naive Expectation vs Reality`, detailing what would be the naive expectation versus what we learned from the experiment.
- [ ] **Stage E (Mandatory Concluding Lessons Table):** The definitive final step is the dedicated Architecture Audit Table (`figures/{NN}-02-architecture-audit.html`, Archetype 10):
  - Eyebrow strictly set to `LESSONS FROM THE CODE` in uppercase.
  - Title reflects the lecture's domain challenge (e.g. `The Declarative Form Submission Challenge`).
  - 3-column comparative matrix: `Component Layer` | `Naive Expectation (Legacy Approach)` | `What Happened (React 19 Reality)`.
  - Layer rows customized 100% to this lecture's architecture (strictly obeying the Anti-Leaf Law).
  - Final Verdict row contrasting `FRAGILE COUPLING` in red uppercase against `BULLETPROOF MODULARITY` in teal uppercase.
  - Sits directly on page substrate with heavy 3px rules, fitting cleanly on a single PDF page with caption.

---

## Gate 6: Strict 10-Line Hard Code Ceiling & Continuation Attributes
- [ ] **Strict 10-Line Hard Ceiling:** No code block in pre-lecture or lecture may exceed 10 lines of executable code. Any code block containing line 11 is a defect.
- [ ] **Zero Leading Empty Lines:** No code snippet may start with an empty line. `startLine` must begin immediately on the first line of executable code.
- [ ] **Option A Continuation Attributes:**
  - First block: `continues="bottom"`
  - Middle block: `continues="both"` (NOT "top bottom")
  - Final block: `continues="top"`
- [ ] **Continuous Line Numbering:** `startLine` must reflect exact continuous line numbers within the same file.
- [ ] **No Back-to-Back Code Blocks:** Two consecutive code blocks without intervening prose are strictly forbidden.
- [ ] **Pedagogical Comments:** Large body code blocks ($\ge 8$ lines) must carry end-of-line comments (`code; // annotation with **BOLD KEYWORD**`). Summary code blocks (`right`/`wrong`) must have zero comments.
- [ ] **Host Element & Hero Prop Visibility (The "Never Headless" Gate):** Whenever prose introduces or explains a JSX prop, HTML attribute, or element-level binding (such as `<form action={...}>` or `<button formAction={...}>`), does the immediate code snippet physically render the host element with that prop bound? Headless functions or isolated hook signatures without their host JSX tags are strictly forbidden.

---

## Gate 7: Natural Conversational Dot-Connecting & Strict Locality
- [ ] **Anti-Robotic Code Recitation:** Deconstructions must NOT open every sentence with line numbers or passively read syntax.
- [ ] **Definitely Point to Constructs:** Name the specific function, input, or attribute in a natural engineering conversation.
- [ ] **Strict Locality:** Every statement maps directly to code physically present in that snippet; never attribute future or external framework behaviors to local setters or guard clauses.
- [ ] **3 Load-Bearing Deconstruction Pillars:**
  1. *Inversion of Focus & Architectural Contrast*: What is deliberately omitted compared to legacy code (zero `value`/`onChange`, zero keystroke re-renders).
  2. *Runtime Engine & Browser Mechanics*: What happens in memory, DOM buffers, and React's fiber work loop.
  3. *Engineering Rationale & Causal Transitions*: Why this pattern prevents real-world bugs, connecting sequential steps by engineering necessity.

---

## Gate 8: "In The Wild" Grounding Cards (`> [!WILD]`)
- [ ] **Cadence:** Exactly one `> [!WILD]` card per major technical section (H2/H3).
- [ ] **Knife Paradigm:**
  - Opens with a short, punchy, bold leading question (6–9 words, zero syntax clutter).
  - Speaks with everyday tactile familiarity (*"Can you imagine...", "Remember the blinking cursor..."*).
  - Takes the reader by the hand with intentional repetition.
  - Always bolds all clarified key terms (`**imperative**`, `**declarative**`, `**physical DOM**`, `**virtual DOM**`, `**action prop**`).
  - Banishes technical minutiae and method names; cuts straight to the "aha moment".

---

## Gate 9: Standalone Glossary & Real-World Contexts
- [ ] **Where You Will Meet This:** 3 to 5 concrete one-line scenarios describing real-world application moments.
- [ ] **Standalone Glossary:** 4 to 6 core terms introduced in the lecture, formatted as `- **Term**: Plain-English definition and concrete engineering role without em-dashes.` Renders on its own dedicated standalone page in the PDF (`page-break-before: always;`).

---

## Gate 10: Streetwise Summary & Closing Comparison Table
- [ ] **Summary Structure:**
  - Authoritative **Technical Title** in bold on its own line (`**Technical Title**`).
  - Practical context opening directly without conversational filler ("Look, in practice...").
  - `❒ Subtitles` section headers.
  - Numbered points (`1.`, `2.`) with indented sub-bullets using `<br>&nbsp;&nbsp;&nbsp;&nbsp;(a) ...` on a single continuous line.
  - Core principles highlighted with `➔ NEVER / ALWAYS / IF ... THEN ...`.
  - `**DO THIS:**` with ` ```jsx right ` (zero comments inside code).
  - `**DO NOT DO THIS:**` with ` ```jsx wrong ` (zero comments inside code).
- [ ] **Closing Table (Exact Shape):**
  - Exactly 3 columns: `| | **COLUMN B**<br>(subtitle) | **COLUMN C**<br>(subtitle) |`.
  - Divider row: `| ---: | :--- | :--- |`.
  - Bold dimensions in column 1.
  - Long code strings split across separate backticks with `<br>` to prevent PDF padding breaks.

---

## Gate 11: Mechanical Build Gate
- [ ] **Zero Warnings:** Run `node src/build-lectures.mjs {n}`. The build MUST exit with ZERO warnings. A `warn` is a defect.
- [ ] **Full Reader Build:** Full compilation `node src/build-lectures.mjs` generates all three reader themes (`teal`, `black`, `old`) without warnings.

---

## Gate 12: Law of Visual Verification
- [ ] **Routine Prose Ban & "Zero Pagination Defects" Pretext Prohibition:** Never take screenshots of text, pre-lectures, or markdown prose. Fabricating pretexts such as "checking pagination", "verifying page breaks", or confirming "zero pagination defects" is strictly banned. Do NOT take any screenshot UNLESS the whole instructions are consulted first to confirm an authorized figure canvas trigger.
- [ ] **Surgical Figure Inspection:** Whenever an HTML figure (`md-lectures/figures/*.html`) or visual panel is created or modified, determine its exact page number in the compiled PDF, render ONLY that single page via `pdftoppm -png -r 150 -f <page> -l <page>`, inspect via `view_file`, verify 1:1 code synchronization and zero visual collisions, and DELETE the inspection PNG immediately.



