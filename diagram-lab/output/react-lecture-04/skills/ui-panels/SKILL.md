---
name: ui-panels
description: Governs the Rendered UI Canvas, files, and component-code panels embedded in lectures; use when adding or reviewing any UI panel in a lecture.
---

# UI Panels

This skill governs the three UI panel kinds a lecture embeds: the ` ```components ` Rendered UI Canvas panel, the ` ```files ` File Explorer panel, and the ` ```component-code ` Component Code Architecture panel. It covers the rendered UI canvas that introduces practical examples, the markdown syntax the builder consumes, the disk hierarchy in the file explorer, and the role summary cards in the experiment review. Plain code blocks and comments belong to the code-blocks skill; html-figure authoring belongs to the figures skill.

Digests: skills/old-instructions/instructions.md (rendered UI canvas, file explorer, and component role panels)

## Rendered UI Canvas | 01 | Every practical example opens with the visual destination

[ ] Open Stage A of every practical example with a ` ```components ` Rendered UI Canvas panel, so the learner sees the finished interface before reading any implementation code.
[ ] The panel shows the authentic rendered user interface on screen without code distractions, establishing the visual goal that the subsequent assembly steps construct.
[ ] Expect the build to verify the presence of UI panels, so a clean build is the signal that this visual foundation is in place.
[ ] Prefer the generated canvas as the Stage A visual anchor, showing the component hierarchy and native interactive controls (`[button: ...]`, `[input: ...]`, `[badge: ...]`) rather than code snippets.

## Rendered UI Canvas | 02 | Place the canvas at the opening of Stage A

[ ] Place the ` ```components ` canvas under the practical example heading in Stage A, following the scenario introduction.
[ ] Use the canvas to show component boundaries, nesting, and interactive controls so the learner pictures the running widget before building its parts.
[ ] Remember that a multi-component layout is the typical case, but a single component owning native inputs or interactive buttons also earns a clean canvas.

## Rendered UI Canvas | 03 | Single-component and multi-component layouts

[ ] Treat a single `.jsx` file as a normal case for the canvas when an example centers on a single component, showing its rendered inputs, buttons, or badges directly.
[ ] For multi-component systems, indent child components under their parent container by two spaces, so the nesting on screen mirrors the React tree hierarchy.
[ ] When an example coordinates multiple child views, display each child with its terminal controls so the relationship between siblings is visible at a glance.

[ ] PROPER EXAMPLE: make sure you follow this example, a single-component canvas:

> ```components title="national-times - Rendered UI Canvas"
> CorrectionDesk.jsx | none | form | [input: Elena Rostova] ;; [button: Submit Correction]
> ```

Notes: the learner sees the owning component and its interactive controls in one glance before any implementation code begins.

## Rendered UI Canvas | 04 | Show the visual destination before the code that builds it

[ ] Introduce the practical scenario in prose, then place the ` ```components ` canvas before the ` ```files ` disk hierarchy, so the visual destination precedes the disk structure.
[ ] Let the visual canvas speak for itself without cluttering the cards with JSX syntax or hook calls; code implementation belongs in subsequent editor blocks.
[ ] Follow the canvas with the ` ```files ` panel and the progressive assembly pipeline figure in Stage B, so the learner transitions smoothly from UI destination to construction steps.

## Panel Syntax | 05 | One entry per line with four fields

[ ] Write one entry per line in the ` ```components ` block, with the fields in order: bare file name, optional displayed context after the first `|`, optional visual kind after the second `|`, and optional rendered UI elements after the third `|`.
[ ] Keep the displayed context short, a prop, callback, condition, or state annotation, so it reads as italic text beside the component label without crowding it.
[ ] Choose the visual kind from the supported set (`shell`, `header`, `navigation`, `profile`, `badge`, `counter`, `card`, `form`, `table`, `button`, `branch`, `instances`, `generic`) or omit it and let the builder infer a kind from the filename, so the canvas stays deterministic.
[ ] Write the rendered lines field as the component's real UI elements on screen (such as `[button: ...]`, `[input: ...]`, or `[badge: ...]`), individual controls separated by `;;`, with `**bold**` allowed for the load-bearing value.

## Panel Syntax | 06 | Bare filenames and exact two-space indentation

[ ] Write the first field as a bare filename (`App.jsx`, `Header.jsx`, `cart.js`), so the left tree keeps the canonical top-level shape.
[ ] Avoid path prefixes such as `components/Header.jsx`, because the build assigns every `.jsx`/`.tsx` file to the `components/` folder and every plain module (`.js`/`.ts`) to the `state/` folder automatically.
[ ] Use exactly two spaces per nesting level, with the first entry as the single root, so the tree structure the learner sees matches the nesting the builder renders.
[ ] Remember that a nested `.jsx`/`.tsx` entry renders inside its parent on the right canvas while a module entry (`.js`, `.ts`) is listed in the left file tree only, so module entries never appear on the canvas.

## Panel Syntax | 07 | The window title attribute

[ ] Give every panel a `title="..."` attribute with a short project name followed by `- Rendered UI Canvas`, so the panel's top bar names the project the learner is looking at.

[ ] PROPER EXAMPLE: make sure you follow this example, a clean two-level canvas:

> ```components title="dashboard-app - Rendered UI Canvas"
> Dashboard.jsx | none | shell
>   Button.jsx | none | button | [button: Save Profile]
> ```

Notes: the root is the first entry, the child is indented two spaces, each field is separated by `|`, and the title names the project.

## Connection Rules | 08 | The empty props cell rule

[ ] Reserve the second column for meaningful passed props such as `onSubmit={handleSubmit}` or `theme="dark"`, so the column always carries real information.
[ ] When no props are passed, leave the props cell empty or write `none`, so the parser can suppress the literal string and keep the component title uncluttered.
[ ] Trust the parser to suppress the literal `none` entirely, so the learner never reads a printed `none` on the card.

## Connection Rules | 09 | Terminal UI controls on interactive elements

[ ] Let terminal child components (buttons, input fields, badges, status banners) culminate in the rendered UI element, written as `[button: ...]`, `[input: ...]`, or `[badge: ...]`, so the card ends in what the learner actually sees on screen.
[ ] Avoid stuffing code snippets or JSX syntax inside the canvas cards; the canvas exists to show authentic rendered user interface, while code belongs in subsequent editor blocks.
[ ] Separate multiple interactive controls using `;;`, letting each input, button, or badge render distinctly inside the component card.

[ ] PROPER EXAMPLE: make sure you follow this example, terminal controls in a form child:

> ```components title="profile-app - Rendered UI Canvas"
> FeedbackPortal.jsx | none | shell
>   ArticleCorrectionForm.jsx | none | form | [input: Elena Rostova] ;; [input: Describe the correction...] ;; [button: Submit Correction]
> ```

Notes: each control renders as a clean native widget, matching the finished interface without code distractions.

## Terminology | 10 | Genealogical names, not the academic term leaf

[ ] Avoid the academic computer science term "leaf" (and "leaf node", "leaf component", "leaf control") in lectures and panels, because it is not standard React terminology and it creates academic distance.
[ ] Use the natural genealogical terms of `react.dev` and idiomatic engineering discussion instead: `parent` for the enclosing container component, `child` for the directly rendered nested component, `nested child` and `grandchild` for deeply placed descendants, `ancestor` for components higher up the tree, `descendant` for components lower down the tree, and `terminal UI control` for buttons, inputs, or badges that render native DOM elements.
[ ] Prefer `child component`, `nested child`, `grandchild`, or `terminal button` over "leaf component" or "leaf button", so the vocabulary matches what the reader meets in official documentation.

## Rendered UI Canvas | 11 | Snippet-free authentic interface #2026_09_20_04_group_5

[ ] Use the ` ```components ` panel titled `{project} - Rendered UI Canvas` to open Stage A of a practical example: snippet-free entries showing only the finished interface, placed before the files scaffold and before Step 1, so the reader sees the destination before the road.
[ ] Keep the canvas free of `[code: ...]` snippets entirely, with the props column carrying `none` or the real props and the rendered-lines field showing the authentic UI the user will see, because the canvas exists to remove code distractions, not to carry them.

[ ] PROPER EXAMPLE: make sure you follow this example, the canvas panel opening a practical example, from Lecture 40:

> ```components title="national-times - Rendered UI Canvas"
> FeedbackPortal.jsx | none | shell
>   LiveSearchInput.jsx | none | form | [input: Filter headlines...] ;; [badge: Live Headline Filter]
>   ArticleCorrectionForm.jsx | none | form | [input: Elena Rostova] ;; [input: Describe the correction...] ;; [button: Submit Correction]
> ```

Notes: zero code snippets, the tree mirrors the nesting the steps will build, and each card ends in the real UI elements, so the reader pictures the finished portal before writing a line of it.

## Files and Component Code | 12 | The files panel shows the disk hierarchy

[ ] Use the ` ```files ` panel when the learner needs the file and folder hierarchy on disk, with macOS window chrome, authentic file and folder icons, and a tidy row layout of File / Directory, Role, and Description.
[ ] Tag every file with its architectural role (`parent`, `boundary`, `consumer`, `button`, `state`, `child`) plus an immediate physical description of its responsibility, so each row answers what the file does in one scan.
[ ] Tailor the file tree to the specific topic under study, so filenames always serve the lesson at hand; copying filenames from an adjacent lecture breaks the panel's connection to this lecture's code.

[ ] PROPER EXAMPLE: make sure you follow this example, a files panel for a form-actions topic:

> ```files title="national-times: File Explorer"
> src/
>   App.jsx | parent | Top-level layout container mounting the newsroom workspace
>   components/
>     ArticleEditor.jsx | boundary | Renders declarative form with action and formAction overrides
> ```

Notes: each row names a real file of this lecture's example, tags its role, and describes its physical responsibility in one line.

## Files and Component Code | 13 | The component-code panel shows full-width code fidelity

[ ] Use the ` ```component-code ` panel when component hierarchy needs full code fidelity on a full-width canvas, so multi-line connecting JSX, action definitions, hook invocations such as `const { pending } = useFormStatus();` or `const [state, formAction] = useActionState(...)`, and rendered buttons such as `[button: Publish Story]` can breathe naturally.
[ ] Keep the panel's contents faithful to the components, props, and actions physically present in that specific lecture, so the canvas is a window into this lecture's code and nothing else.
[ ] Rely on the panel's signature aesthetic (top-left colored kind badge tabs, dashed perimeters matching component kinds, tokenized syntax highlighting, rendered terminal UI controls), so hierarchy and code read together.

## Files and Component Code | 14 | Panels are architectural skeletons, not full listings

[ ] Treat ` ```component-code ` panels as architectural skeletons rather than complete file listings, so the reader scans structure instead of re-reading implementation.
[ ] Curate the panel down to the load-bearing primitives: the parent mounting tag, the enclosing container boundary and its connecting action or prop, the primary inputs or child components participating in the interaction, the load-bearing hook, action prop, or override attribute in the cross-component circuit, and the terminal return tag with its rendered UI control.
[ ] Leave incidental local noise out of the panel: unrelated local state hooks, imperative function bodies, validation loops, multi-line fetch calls, incidental wrapper divs, secondary paragraph tags, and feedback alerts, so local logic stays in the lecture code where it belongs.
[ ] Aim for the 5-second scan standard: a reader should understand the data, event, and boundary relationships across the tree in five seconds without reading any local component logic.

## Role Panels | 15 | The component-code panel in role mode for Stage D #2026_09_20_04_group_5

[ ] Use the component-code panel in role mode, placed at the head of the Lessons from the Experiment stage, when the reader needs what each component is and how it relates to its neighbors, with zero code and serif prose in place of snippets. #2026_09_20_09_group_1
[ ] Give the role-mode panel a meaningful domain title reflecting the logic of the component hierarchy, such as `Summary: The Logic of Nested Components` (e.g. `title="Summary: The Logic of Nested Components"`), strictly banning generic corporate labels like `Component Role & Relationship Architecture` and removing project prefixes like `national-times:`. #2026_09_20_09_group_1
[ ] Role-Mode 4-Field Syntax: Every role-mode entry MUST use all 4 pipe-separated fields: `file | props | kind | [role: ...]`. Placing `[role: ...]` in field 2 or 3 is invalid because field 2 is parsed as props and field 3 as kind tab; the parser only triggers the serif summary card (`.surface-ui-role`) when `[role: ...]` occupies field 4 (`renders`). #2026_09_20_10_group_1
[ ] 2-Space Indentation for Child Components: All nested child components in the tree MUST be indented by exactly 2 spaces per tree level (`  Child.jsx`). Zero indentation causes the parser to treat children as orphan root components, which triggers a build error. #2026_09_20_10_group_1
[ ] Write each role-mode entry as a `[role: ...]` payload in the fourth field, following the four-beat rhythm: what the component is, what it owns or receives, the relational contrast against its siblings, and the motivation answered directly inside the same entry, voiced either plainly (To isolate the parent from typing re-renders) or with a question marker when the entry genuinely begs one. #2026_09_20_12_group_1
[ ] Keep the role entries synchronized with the lecture's real architecture, naming the exact props and state the code uses, so the panel stays a window into this lecture's code even while showing none of it.

[ ] PROPER EXAMPLE: make sure you follow this example, a multi-component role-mode panel with 4 fields, 2-space child indentation, and the four-beat rhythm with a meaningful title, from Lecture 40: #2026_09_20_09_group_1, #2026_09_20_10_group_1

> ```component-code title="Summary: The Logic of Nested Components"
> FeedbackPortal.jsx | none | parent | [role: The **parent component** orchestrates the overall portal layout. It owns the **live search state**. Also, it actively provides two things: the **state (props)** and **updater functions** downward to **LiveSearchInput**. Notice it deliberately passes **zero props** to **ArticleCorrectionForm**. Why? To isolate the parent from typing re-renders.]
>   LiveSearchInput.jsx | query={query} onChange={setQuery} | form | [role: This is the **controlled child component**. It receives two things from the parent: the **state (`query`)** and the **updater function (`onChange`)**. Notice it locks the input's displayed value directly to React state. Why? To filter published headlines in real time on every single keystroke.]
>   ArticleCorrectionForm.jsx | none | form | [role: This is the **uncontrolled child component**. Notice it receives **zero props** and **zero callbacks** from the parent. The browser stores all text in its native C++ buffer. When does React read the data? Only once, on submit, using **`FormData`**. This keeps typing at 60 FPS with zero parent re-renders.]
> ```

Notes: beat one names what it is, beat two what it owns and provides, beat three the deliberate contrast with the sibling, and the motivation is answered inside the entry. Zero code appears, and the prose still carries the exact prop names and the zero-props decision. All 4 fields are present on every line, and child components are indented with 2 spaces. The Why? marker is one voice for the fourth beat, not a required one; a panel where every entry asks the same question reads as a chant. #2026_09_20_12_group_1
