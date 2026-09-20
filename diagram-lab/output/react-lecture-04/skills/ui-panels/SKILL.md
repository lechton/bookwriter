---
name: ui-panels
description: Governs the Component Explorer, files, and component-code panels embedded in lectures; use when adding or reviewing any UI panel in a lecture.
---

# UI Panels

This skill governs the three UI panel kinds a lecture can embed: the ` ```components ` Component Explorer panel, the ` ```files ` File Explorer panel, and the ` ```component-code ` Component Code Architecture panel. It covers the intro component-tree check that decides what the first panel shows, the markdown syntax the builder consumes, the connection rules that tie the file tree to the rendered UI, and the traceability standard that lets a reader follow every construct up and down the tree. Plain code blocks and comments belong to the code-blocks skill; html-figure authoring belongs to the figures skill.

Digests: skills/old-instructions/instructions.md (component explorer panels and the intro component-tree check)

## Intro Component-Tree Check | 01 | Every lecture carries at least one components panel

[ ] Aim for at least one ` ```components ` panel in every lecture, so the learner always gets a visual map of where the mechanism lives before reading its code.
[ ] The check questions decide what the panel shows, never whether one exists, so treat the panel as a required part of the lecture's structure rather than an optional recap.
[ ] Expect the build to print a warning for any lecture with zero panels, so a clean build is the signal that this standard is met.
[ ] Prefer the generated Component Explorer as the intro visual, so the learner sees the properly designed component tree rather than a substitute; an ASCII tree, a prose-only description, a comparison table, or a diagram placed after the code does not satisfy this check.

## Intro Component-Tree Check | 02 | Answer the check questions before the first code block

[ ] Before writing the first code block for the lecture's central mechanism, answer these questions in the working plan: does the learner need to know which component owns the state, ref, resource, or behavior; does the mechanism depend on nesting, repeated instances, a conditional branch, a component boundary, or the identity and lifetime of a rendered DOM element; and would seeing the component and rendered target before the code remove ambiguity that prose alone leaves behind.
[ ] Place the panel after the visceral opening and a short prose description of what the learner is looking at, but before the first React code block that implements the mechanism, so the panel works as the map rather than the recap.
[ ] Consider a panel whenever understanding depends on seeing where something lives, which component owns it, what is nested or repeated, what crosses a boundary, or which rendered element a component-local reference identifies, so ownership and structure are visible rather than inferred.
[ ] Remember that a graph with several components is the obvious case but not the only one, so a single component owning an important DOM node, conditional subtree, ref target, or lifecycle-sensitive browser resource can also earn a panel.

## Intro Component-Tree Check | 03 | A single file is not a reason to skip the panel

[ ] Treat a single `.jsx` file as a normal case for the panel rather than an exemption, so the learner still sees the owning component and its rendered target.
[ ] For a component-local DOM identity mechanism, prefer a single-root panel with the appropriate visual kind and a concise annotation naming the reference and its target, so the local relationship is explicit.
[ ] When a mechanism looks ownership-free, use a single-root panel naming the owning component and its rendered target, so there is always a visual anchor for the mechanism.

[ ] PROPER EXAMPLE: make sure you follow this example, a single-root panel for a DOM ref mechanism:

> ```components title="national-times - Component Explorer"
> CorrectionDesk.jsx | inputRef receives the rendered input node | form
> ```

Notes: the learner sees the owning component, the exact rendered target, and the local ref in one glance, which prose alone leaves ambiguous.

## Intro Component-Tree Check | 04 | Show the visual destination before the code that builds it

[ ] Name the intended visual arrangement in prose first, stating what the page contains, which component owns the logic, which component or DOM target appears inside it, and what data, callback, condition, or reference connects them, so the panel is an explanation rather than decoration.
[ ] Place the ` ```components ` block immediately after that visual explanation and before the first React code block implementing the relationship, so the generated panel is the first visual representation the learner meets.
[ ] Frame the panel through the component's architectural responsibility, grounding which file owns the state, props, or DOM boundaries, and let the visual canvas speak for itself as the prose leads into the code implementation.
[ ] Show the code in dependency order after the panel: parent or repeated arrangement first, then the child or shared definition, then the interaction or variant, so the code matches the panel's filenames, instances, annotations, and nesting.
[ ] Derive the mechanism after the code, explaining why React produces that relationship and what changes when the relevant state or data changes, so the visual target and its implementation are both in view before the analysis.
[ ] Keep this order for every component panel, so an earlier standalone prerequisite example stays allowed while the first code for the structural relationship itself always follows its panel.

## Panel Syntax | 05 | One entry per line with four fields

[ ] Write one entry per line in the ` ```components ` block, with the fields in order: bare file name, optional displayed context after the first `|`, optional visual kind after the second `|`, and optional rendered lines after the third `|`.
[ ] Keep the displayed context short, a prop, callback, condition, or state annotation, so it reads as italic text beside the component label without crowding it.
[ ] Choose the visual kind from the supported set (`shell`, `header`, `navigation`, `profile`, `badge`, `counter`, `card`, `form`, `table`, `button`, `branch`, `instances`, `generic`) or omit it and let the builder infer a kind from the filename, so the canvas stays deterministic.
[ ] Write the rendered lines field as the component's real UI on screen and connecting code snippets, individual lines separated by `;;`, with `**bold**` allowed for the load-bearing value, so the canvas replaces the kind's mock surface while the kind still sets the frame color and label.
[ ] Prefer including the rendered lines field in every new panel, so the panel satisfies the Component Explorer Code-Connection Standard described below.

## Panel Syntax | 06 | Bare filenames and exact two-space indentation

[ ] Write the first field as a bare filename (`App.jsx`, `Header.jsx`, `cart.js`), so the left tree keeps the canonical top-level shape.
[ ] Avoid path prefixes such as `components/Header.jsx`, because the build assigns every `.jsx`/`.tsx` file to the `components/` folder and every plain module (`.js`/`.ts`) to the `state/` folder automatically.
[ ] Use exactly two spaces per nesting level, with the first entry as the single root, so the tree structure the learner sees matches the nesting the builder renders.
[ ] Remember that a nested `.jsx`/`.tsx` entry renders inside its parent on the right canvas while a module entry (`.js`, `.ts`) is listed in the left file tree only, so module entries never appear on the canvas.

## Panel Syntax | 07 | The window title attribute

[ ] Give every panel a `title="..."` attribute with a short project name followed by `- Component Explorer`, so the panel's top bar names the project the learner is looking at.

[ ] PROPER EXAMPLE: make sure you follow this example, a complete two-level explorer:

> ```components title="dashboard-app - Component Explorer"
> Dashboard.jsx | theme={theme} | shell
>   Button.jsx | label="Save" onClick={handleSave} | button
> ```

Notes: the root is the first entry, the child is indented two spaces, each field is separated by `|`, and the title names the project.

## Connection Rules | 08 | The empty props cell rule

[ ] Reserve the second column for meaningful passed props such as `onSubmit={handleSubmit}` or `theme="dark"`, so the column always carries real information.
[ ] When no props are passed, leave the props cell empty or write `none`, so the parser can suppress the literal string and keep the component title uncluttered.
[ ] Trust the parser to suppress the literal `none` entirely, so the learner never reads a printed `none` on the card.

## Connection Rules | 09 | Connecting JSX and hook snippets

[ ] Declare the exact connecting JSX that mounts each child in the parent's rendered lines, so the glue between the file tree and the canvas is visible.
[ ] Have nested consumers declare the load-bearing hook or state that connects them to the parent context, so the upward connection is as visible as the downward one.
[ ] Preserve leading spaces in snippets such as `[code:   <Child />]`, so the rendered JSX keeps natural indentation.

[ ] PROPER EXAMPLE: make sure you follow this example, a parent mounting a provider around a child:

> ```components title="profile-app - Component Explorer"
> App.jsx | none | generic | [code: return (] ;; [code:   <UserProvider>] ;; [code:     <ProfileCard />] ;; [code:   </UserProvider>] ;; [code: );]
> ```

Notes: the mounting JSX is real code the learner can trace, and the child appears inside the boundary exactly as it does in the source.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```components title="profile-app - Component Explorer"
> App.jsx | none | generic
>   ProfileCard.jsx | none | card
> ```

Notes: with no connecting snippets the panel shows a file tree and a mock surface but hides the actual glue, so the learner cannot see how the child is mounted or connected.

## Connection Rules | 10 | Code snippets stay above the children

[ ] Keep all code snippets at the top of the component card before nested children, so the reader meets the code before descending into the tree.
[ ] Keep even wrapping tags such as `<div>` and `</div>` together at the top, indented to show what is being mounted, so the mounting structure stays in one readable block.
[ ] Let the nested child card sit directly below the code block inside the dashed perimeter, so nothing ever appears at the bottom below the child.

## Connection Rules | 11 | Terminal UI controls and multi-line wrapping

[ ] Let terminal child components (buttons, input fields, badges, status banners) culminate in the rendered UI element, written as `[button: ...]`, `[input: ...]`, or `[badge: ...]`, so the card ends in what the learner actually sees on screen.
[ ] Render monospace code with transparent, unformatted styling embedded directly into the card background, so the code reads as part of the card rather than sitting inside a fake IDE box.
[ ] Let all code and JSX elements word-wrap (`white-space: pre-wrap; word-wrap: break-word;`), so long content flows instead of overflowing.
[ ] Break multi-token JSX elements cleanly across separate lines with indentation, so a single horizontal line never collides with the card's dashed border.

[ ] PROPER EXAMPLE: make sure you follow this example, a terminal button wrapped across lines:

> ```components title="profile-app - Component Explorer"
> SaveButton.jsx | none | button | [code: return (] ;; [code:   <button type="submit" disabled={loading} className="btn">] ;; [code:     {loading ? "Saving..." : "Save Profile"}] ;; [code:   </button>] ;; [code: );] ;; [button: Save Profile]
> ```

Notes: the element wraps with natural indentation, the closing tag is clean, and the card ends in the rendered button matching the idle state of the code.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```components title="profile-app - Component Explorer"
> SaveButton.jsx | none | button | [code: return <button type="submit" disabled={loading} className="btn">{loading ? "Saving..." : "Save Profile"}</button>] ;; [button: Save Profile]
> ```

Notes: the crushed single-line element runs into the dashed border and becomes unreadable at a glance, which is exactly what the wrapping rule prevents.

## Connection Rules | 12 | The panel tells the truth about the code

[ ] Keep every code snippet, prop, variable name, hook invocation, and JSX tag in the panel physically present in the lecture's runnable script blocks, so the visual tools stay a direct, faithful window into the real code.
[ ] Avoid fictional props, mock hooks, or simplified variants that differ from the lecture code, so the learner is never shown a shape the code does not have.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```components title="story-app - Component Explorer"
> StoryList.jsx | none | card | [code: const isSaved = useOptimistic(false);] ;; [code: return <ul>{items}</ul>;]
> ```

Notes: if the lecture code actually defines `useOptimistic({ isSaved, count })` with a reducer, the single-boolean panel is fiction, and the learner cannot map the panel onto the code they read next.

## Connection Rules | 13 | Crisp exactness in condensed snippets

[ ] Present even redacted or condensed snippets with crisp exactness, so props use exact casing and values matching the code and tags close cleanly.
[ ] Prefer properly parenthesized block returns (`return (`) when returning JSX elements, so the snippet reads as complete code rather than a naked fragment.
[ ] Avoid ambiguous, naked, or broken fragments such as unparenthesized returns or mismatched closing tags, so every line of the panel parses at a glance.

## Connection Rules | 14 | Every consumed variable has a visible origin

[ ] Give every variable, prop, or hook consumed in the panel a visible declaration or explicit origin, so the reader can trace the complete data flow.
[ ] Show the `const handleAction = ...` declaration when a function is passed to an `action` or `onClick`, so the handler has a home in the panel.
[ ] Show the `useState` declaration when state is used, so state never appears out of thin air.

## Terminology | 15 | Genealogical names, not the academic term leaf

[ ] Avoid the academic computer science term "leaf" (and "leaf node", "leaf component", "leaf control") in lectures and panels, because it is not standard React terminology and it creates academic distance.
[ ] Use the natural genealogical terms of `react.dev` and idiomatic engineering discussion instead: `parent` for the enclosing container component, `child` for the directly rendered nested component, `nested child` and `grandchild` for deeply placed descendants, `ancestor` for components higher up the tree, `descendant` for components lower down the tree, and `terminal UI control` for buttons, inputs, or badges that render native DOM elements.
[ ] Prefer `child component`, `nested child`, `grandchild`, or `terminal button` over "leaf component" or "leaf button", so the vocabulary matches what the reader meets in official documentation.

## Traceability | 16 | Two-way traceability through the whole tree

[ ] Open every panel-bearing relationship with a 2-sentence lead-in explaining the upward and the downward mechanism, so the reader knows which way data and events travel before looking at the cards.
[ ] Trace downwards by writing `<Child prop={value} />` in the parent's JSX snippet, showing the incoming prop in the child's top-level layer badge pill, and showing `{prop}` projected into the child's own markup or local expressions, so the downward path is readable in three places.
[ ] Trace upwards by showing the enclosing boundary in the parent's snippet (for example `[code: <UserProvider value={session}>] ;; [code:   <ProfileCard />] ;; [code: </UserProvider>]`), keeping the child's top pill a clean component name with zero clutter, and declaring the upward hook connection in the child's snippet (for example `[code: const { session } = useContext(UserContext);]`), so the upward path is just as explicit.
[ ] Trace to the physical UI by concluding the child's code with its complete return statement wrapped cleanly across lines directly preceding the rendered UI element, so the reader sees how state or props control the element without horizontal cramping.
[ ] Keep props synchronized between the parent JSX and the child's top-level layer badge pill, so the two views of the same prop never disagree.

[ ] PROPER EXAMPLE: make sure you follow this example, the canonical benchmark panel with full declarations and parentheses:

> ```components title="dashboard-app - Component Explorer"
> App.jsx | none | generic | [code: const session = useSession();] ;; [code: return (] ;; [code:   <UserProvider value={session}>] ;; [code:     <ProfileCard />] ;; [code:   </UserProvider>] ;; [code: );]
>   ProfileCard.jsx | none | card | [code: const { session } = useContext(UserContext);] ;; [code: return (] ;; [code:   <div className="card">] ;; [code:     <h2>{session.name}</h2>] ;; [code:     <LogoutButton />] ;; [code:   </div>] ;; [code: );]
>     LogoutButton.jsx | none | button | [code: const handleLogout = async () => {] ;; [code:   await api.logout();] ;; [code: };] ;; [code: return (] ;; [code:   <button onClick={handleLogout} className="btn-logout">] ;; [code:     Sign Out] ;; [code:   </button>] ;; [code: );] ;; [button: Sign Out]
> ```

Notes: every consumed value is declared (`useSession`, `useContext`, `handleLogout`), every return is parenthesized, the provider boundary is visible in the parent, and the deepest card ends in the rendered button, so the whole tree can be traced both ways without mystery.

## Files and Component Code | 17 | The files panel shows the disk hierarchy

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

## Files and Component Code | 18 | The component-code panel shows full-width code fidelity

[ ] Use the ` ```component-code ` panel when component hierarchy needs full code fidelity on a full-width canvas, so multi-line connecting JSX, action definitions, hook invocations such as `const { pending } = useFormStatus();` or `const [state, formAction] = useActionState(...)`, and rendered buttons such as `[button: Publish Story]` can breathe naturally.
[ ] Keep the panel's contents faithful to the components, props, and actions physically present in that specific lecture, so the canvas is a window into this lecture's code and nothing else.
[ ] Rely on the panel's signature aesthetic (top-left colored kind badge tabs, dashed perimeters matching component kinds, tokenized syntax highlighting, rendered terminal UI controls), so hierarchy and code read together.

## Files and Component Code | 19 | Panels are architectural skeletons, not full listings

[ ] Treat ` ```component-code ` and ` ```components ` panels as architectural skeletons rather than complete file listings, so the reader scans structure instead of re-reading implementation.
[ ] Curate the panel down to the load-bearing primitives: the parent mounting tag, the enclosing container boundary and its connecting action or prop, the primary inputs or child components participating in the interaction, the load-bearing hook, action prop, or override attribute in the cross-component circuit, and the terminal return tag with its rendered UI control.
[ ] Leave incidental local noise out of the panel: unrelated local state hooks, imperative function bodies, validation loops, multi-line fetch calls, incidental wrapper divs, secondary paragraph tags, and feedback alerts, so local logic stays in the lecture code where it belongs.
[ ] Aim for the 5-second scan standard: a reader should understand the data, event, and boundary relationships across the tree in five seconds without reading any local component logic.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> ```components title="story-app - Component Explorer"
> ArticleEditor.jsx | none | form | [code: const [notice, setNotice] = useState("");] ;; [code: const handlePublish = async (e) => {] ;; [code:   e.preventDefault();] ;; [code:   const res = await fetch("/api/publish", { method: "POST" });] ;; [code:   if (!res.ok) setNotice("Publish failed");] ;; [code: };] ;; [code: return <form action={handlePublish}>] ;; [code:   <button>Publish Story</button>] ;; [code: </form>;]
> ```

Notes: the local notice state and the multi-line fetch body are incidental noise; the curated panel would keep the `<form action={...}>` boundary, the load-bearing hook, and the `[button: Publish Story]` terminal control, and let the lecture code carry the rest.

## Two Panel Modes | 20 | The components panel has two faces: explorer and canvas #2026_09_20_04_group_5

[ ] Use the components panel in explorer mode, with connecting code snippets per the Connection Rules above, when it introduces a mechanism and precedes the first code block that implements that mechanism.
[ ] Use the components panel in canvas mode, titled `{project} - Rendered UI Canvas`, when it opens a practical example: snippet-free entries showing only the finished interface, placed before the files scaffold and before Step 1, so the reader sees the destination before the road.
[ ] Keep canvas mode free of `[code: ...]` snippets entirely, with the props column carrying `none` or the real props and the rendered-lines field showing the authentic UI the user will see, because the canvas exists to remove code distractions, not to carry them.
[ ] Frame the canvas in prose exactly as the shipped standard does, telling the reader that the panel represents the authentic rendered user interface on screen, without code distractions, before any code appears.

[ ] PROPER EXAMPLE: make sure you follow this example, the canvas mode panel opening a practical example, from Lecture 40:

> ```components title="national-times - Rendered UI Canvas"
> FeedbackPortal.jsx | none | shell
>   LiveSearchInput.jsx | none | form | [input: Filter headlines...] ;; [badge: Live Headline Filter]
>   ArticleCorrectionForm.jsx | none | form | [input: Elena Rostova] ;; [input: Describe the correction...] ;; [button: Submit Correction]
> ```

Notes: zero code snippets, the tree mirrors the nesting the steps will build, and each card ends in the real UI elements, so the reader pictures the finished portal before writing a line of it.

## Two Panel Modes | 21 | The component-code panel has two modes: code fidelity and role #2026_09_20_04_group_5

[ ] Use the component-code panel in code-fidelity mode, per the Files and Component Code sections above, when the reader needs the connecting code itself on a full-width canvas.
[ ] Use the component-code panel in role mode, placed at the head of the Direct Lessons stage, when the reader needs what each component is and how it relates to its neighbors, with zero code and serif prose in place of snippets.
[ ] Write each role-mode entry as a `[role: ...]` payload in the fourth field, following the four-beat rhythm: what the component is, what it owns or receives, the relational contrast against its siblings, and the Why? question answered directly inside the same entry.
[ ] Keep the role entries synchronized with the lecture's real architecture, naming the exact props and state the code uses, so the panel stays a window into this lecture's code even while showing none of it.

[ ] PROPER EXAMPLE: make sure you follow this example, a role-mode entry in the four-beat rhythm, from Lecture 40:

> ```component-code
> FeedbackPortal.jsx | none | parent | [role: The **parent component** orchestrates the overall portal layout. It owns the **live search state**. Also, it actively provides two things: the **state (props)** and **updater functions** downward to **LiveSearchInput**. Notice it deliberately passes **zero props** to **ArticleCorrectionForm**. Why? To isolate the parent from typing re-renders.]
> ```

Notes: beat one names what it is, beat two what it owns and provides, beat three the deliberate contrast with the sibling, and the Why? is answered inside the entry. Zero code appears, and the prose still carries the exact prop names and the zero-props decision.
