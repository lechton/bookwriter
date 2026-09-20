# Skill: Authoring the Information Flow Phased-Text Section (The 4-Phase Protocol)

## What This Skill Is For
When teaching component hierarchies, async action dispatching, hook subscriptions, and state propagation (such as React 19's `useFormStatus`, Context, or Server Actions), authors often make one of two critical mistakes:
1. **The Diagram Cop-Out**: Relying entirely on an abstract diagram with arrows and boxes, assuming the visual carries the explanation. The student sees boxes, but gains zero understanding of the underlying browser and React runtime lifecycle.
2. **The Metaphor Trap**: Inventing creative fantasy metaphors ("ambient radio tower", "Wi-Fi bubble", "ambient receiver") that sound clever but leave the student unprepared for professional engineering discussions and technical interviews.

This skill establishes the **Information Flow Phased-Text Section**: a dedicated, structured, phased text breakdown directly in the lecture body that deconstructs the physical and logical lifecycle of information flow step-by-step.

---

## The Four Mandatory Guidelines

### 1. Structure & Format: Short Pedagogical Phases with Concise Bullets
- Divide the information flow into sequential, numbered phases (e.g., `#### Phase 1: ...`, `#### Phase 2: ...`, `#### Phase 3: ...`, `#### Phase 4: ...`).
- Each phase must contain 3 to 4 concise bullet points.
- Every bullet point MUST open with a bold micro-lead summarizing the takeaway (`* **First, the user clicks the button**: ...`).
- Long, dense paragraphs of prose are strictly prohibited in this section. Prioritize rapid visual scanning and immediate clarity.

### 2. Standard Terminology Only (Zero Invented Metaphors)
- Strictly use official, standard React, DOM, and web platform terminology:
  - `native browser event`
  - `event bubbling`
  - `Context Provider`
  - `prop drilling`
  - `server action`
  - `re-render`
  - `ancestor` and `descendant`
  - `subscriber / consumer`
- Creative analogies and unofficial metaphors (`radio tower`, `Wi-Fi bubble`, `ambient receiver`, `satellite dish`) are **PERMANENTLY BANNED**. Stick strictly to technical reality so students speak like experienced senior engineers.

### 3. The Mandatory Inline Parenthetical Gloss Law
- **Scan every single technical term** before publishing.
- On its introduction, every technical concept MUST be immediately followed by a concise 4-to-10 word plain-English explanation enclosed in parentheses right next to it.
- **Never assume the reader already knows the term.** A tired developer with a headache must never be forced to leave the page or look up external documentation.
- Standard Gloss Lexicon Examples:
  - `nested (placed inside multiple layers of components)`
  - `bubbling (a browser event traveling upward through ancestor elements toward the top of the page)`
  - `server action (an asynchronous background function running on the server to process form data)`
  - `Context Provider (a built-in component that shares data downward to all nested components without passing props)`
  - `prop drilling (the tedious requirement of passing data down through intermediate components that do not need it just to reach a child that does)`
  - `re-render (executing the component function again to compute updated visual HTML on screen)`
  - `props (input arguments passed from a parent component down to a child)`

### 4. Topic-Adaptive Pedagogical Cadence
Structure the 4 phases to trace the authentic physical and logical lifecycle of the lecture's specific subject. **NEVER force an unrelated topic (e.g., Form Actions, Optimistic UI, Action State) into an ambient Context/useFormStatus pattern.**

#### Topic Pattern A: Ambient Form Status & Context (`useFormStatus`, Context)
- **Phase 1 (Upward)**: Native DOM event bubbling from child button up to enclosing form container (zero React props).
- **Phase 2 (Boundary)**: The container element acting automatically as a Context Provider upon intercepting the event.
- **Phase 3 (Downward)**: The child component hook reading that Context directly without touching intermediate layout wrappers.
- **Phase 4 (Performance)**: Isolated re-rendering (the child updates visuals while parent and intermediate wrappers remain inert).

#### Topic Pattern B: Declarative Form Actions (`<form action={...}>`, `<button formAction={...}>`, Transitions)
- **Phase 1 (Trigger & Resolution)**: Form submission trigger and button action resolution (determining whether `<button formAction>` overrides `<form action>`).
- **Phase 2 (Data Harvesting)**: Native `FormData` buffer collection from all named input fields without controlled state.
- **Phase 3 (Transition Execution)**: Background asynchronous React Transition dispatch (non-blocking pending state preserving responsiveness).
- **Phase 4 (State Settlement & Reset)**: Action promise resolution, automatic uncontrolled input resetting, and UI settlement.

#### Topic Pattern C: Optimistic UI Mutations (`useOptimistic`)
- **Phase 1 (User Action & Immediate Dispatch)**: Event dispatch and immediate synchronous optimistic layer update before the network request flies.
- **Phase 2 (Asynchronous Network Flight)**: Action promise execution in the background while UI reflects expected state instantly.
- **Phase 3 (Server Reconciliation)**: Server response arrival and reconciliation with canonical server state.
- **Phase 4 (Rollback or Settlement)**: Clean resolution or automatic rollback if the background action rejects.

---

## Canonical Reference Benchmarks

### Benchmark 1: Form Status Flow (`useFormStatus`)

```markdown
#### Phase 1: The Native Submit Event Bubbles Upward (No Props Needed!)

* **First, the user clicks the button**: The user clicks the submit button, which sits nested (placed inside multiple layers of components) deep inside layout wrappers—such as a `<Form>` containing a `<Card>`, containing a `<Row>`, containing the `<Button>`.
* **The event bubbles upward**: When a browser event travels upward through ancestor elements toward the top of the page, it is called "bubbling." The browser dispatches a native submit event (the browser's built-in form submission signal) that travels up through every container until it hits the parent `<form>`.
* **The browser handles the flight**: This upward journey is handled automatically by the browser DOM engine, without needing any React props (input arguments passed from parent to child) or custom click handlers to courier the event upward.

#### Phase 2: The Form Becomes an Automatic Context Provider

* **React intercepts the event**: When the bubbling submit event reaches the `<form action={...}>` boundary, React intercepts it and kicks off the asynchronous server action (the background function running on the server to process form data).
* **The form acts as a Context Provider**: The standard `<form>` element automatically acts as a built-in Context Provider (a component that shares data downward to all nested components without passing props).
* **State broadcasts downward**: The form now directs data flow in the opposite direction: from the parent down to nested children. It supplies an internal state object containing `pending: true` (a flag indicating the submission is currently in flight) to all elements inside it.
* **Zero manual wrappers required**: You do not have to create, configure, or wrap components in a custom `<Context.Provider>`—React handles this entire provider setup behind the scenes.

#### Phase 3: The Button Consumes the Form Context

* **The button calls the hook**: The nested submit button executes `useFormStatus()` (a built-in React hook that reads status from the nearest ancestor form).
* **State reaches the button directly**: Because the hook subscribes directly to the form's built-in Context, the `pending` state bypasses the intermediate card and row layout wrappers completely.
* **Prop drilling is eliminated**: This completely removes prop drilling (the tedious requirement of passing data down through intermediate components that do not need it just to reach a child that does).

#### Phase 4: Laser-Focused Component Updates (Optimized Performance!)

* **Only the button re-renders**: Because only the submit button subscribed to `useFormStatus()`, only the button re-renders (executes its component function again to update its visual HTML on screen). It disables itself (`disabled={true}`) and displays active transmission progress.
* **Parent containers remain inert**: The parent `<form>` and all intermediate card wrappers do not re-render (0 re-renders), preventing unnecessary layout recalculations and preserving maximum UI performance.
* **Context resets when finished**: Once the asynchronous server action completes, React resets the internal context to `pending: false`, causing the button to re-render one final time to unlock and restore its idle label.
```

### Benchmark 2: Declarative Form Actions Flow (`<form action={...}>`)

```markdown
#### Phase 1: Form Submission Trigger and Action Resolution

* **User activates submission**: The user triggers form submission either by clicking a submission button or pressing Enter inside a text input.
* **Action resolution determines handler**: React checks if the clicked submit button specifies a `formAction` attribute (a button-level action override). If present, that specific function is selected; otherwise, the parent `<form action={...}>` handler is chosen.
* **Default browser navigation is intercepted**: React intercepts the native submit event automatically, preventing full-page document reload without needing an explicit `e.preventDefault()`.

#### Phase 2: Native FormData Harvesting from Named Inputs

* **Browser constructs FormData buffer**: React leverages the browser's built-in `FormData` constructor, automatically harvesting values from all contained input fields that have a `name` attribute.
* **Uncontrolled inputs provide immediate access**: Unlike legacy controlled forms, React reads directly from the DOM elements at submission time, eliminating per-keystroke re-renders and boilerplate change handlers.
* **Payload passed as argument**: The assembled `FormData` instance is passed directly as the primary argument to the resolved action function.

#### Phase 3: Background Asynchronous React Transition Execution

* **Action executes inside a transition**: React wraps the invocation of the asynchronous action inside a transition (a non-blocking background render priority).
* **Application stays fully responsive**: Because execution is scheduled as a transition, the user interface remains responsive to clicks, typing, and tab navigation while the async request is in flight.
* **Form status is updated**: React marks the enclosing form boundary as pending, allowing hooks like `useActionState` or descendant `useFormStatus` to reflect in-flight status.

#### Phase 4: Automated Uncontrolled Input Reset and State Settlement

* **Promise resolution settles the lifecycle**: Once the asynchronous action function resolves successfully, React completes the transition lifecycle.
* **Uncontrolled fields reset automatically**: If the form contains uncontrolled inputs, React automatically resets their values back to their default states on successful submission.
* **Visual state synchronizes**: Any component state updated by the action (or returned values) triggers a clean declarative re-render to reflect the newly saved data.
```

---

## Transition to Code: The "Let's Build the Code!" Standard

Immediately following the Information Flow Phased-Text section, the next section of the lecture MUST be titled:
`### Let's Build the Code!`

**Strictly Banned Headings**:
- `### Progressive Assembly: Code Implementation Pipeline` (PERMANENTLY BANNED)
- `### Progressive Code Implementation` (PERMANENTLY BANNED)
- Any corporate or pompous jargon.

**Standard Lecture Progression**:
1. **Component Architecture & Explorer**: Establishes the layout and the core architectural question.
2. **Information Flow Lifecycle**: Deconstructs data flow and events across the 4-Phase Protocol.
3. **`### Let's Build the Code!`**: Features the code assembly overview figure and launches the sequential step-by-step code implementation (`### Step 1: ...`, `### Step 2: ...`).
4. **Architectural Comparison & Review**: Closing table, Where You Will Meet This, Glossary, and Summary.

