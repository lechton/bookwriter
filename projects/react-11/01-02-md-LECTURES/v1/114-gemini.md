# Lecture 114: How the Subscribe Button Knows the Server Is Still Working

*(While the email travels to the server, how does the button inside the form know it must read `Subscribing...`?)*

> INTERVIEW QUESTION | ❱ CORE | How does a nested field read the form's pending state during a server action?

---

## VS | A Plain Submit Button vs. a Button Calling `useFormStatus`: both dispatch actions, but only `useFormStatus` tracks server execution

> When a user taps a submit button and the interface remains static, they assume the tap failed and click again. **A nested component inside a `<form>` queries form status directly by calling `useFormStatus`. It receives a `pending` boolean that remains true until the server responds**. You use this flag to update the button label and disable user input, preventing accidental duplicate submissions on slow mobile connections.

Consider how you manage this interaction in traditional browser JavaScript. You attach a submit event listener, locate the button element in the DOM, disable it manually, and change its text content. Once the network request finishes, you restore the button text and remove the disabled attribute:

```js title="Plain JavaScript: you change the button yourself"
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  ~button.disabled = true~; // You lock the button by hand
  button.textContent = 'Subscribing...';
  await fetch('/subscribe', { method: 'POST', body: new FormData(form) });
  button.disabled = false; // You unlock it when the answer is back
  button.textContent = 'Subscribe';
});
```

React eliminates manual DOM manipulation. When you assign an asynchronous action to a form, React wraps the submission inside an internal Transition. Because React controls the execution cycle, it knows exactly when the submission starts and when the promise settles. React publishes this status through an internal form context. Any nested component can read that state by invoking `useFormStatus`:

```jsx title="React: the button asks the form it sits in"
const { ~pending~ } = useFormStatus(); // true from the tap until the action finishes
<button type="submit" disabled={pending}>{pending ? 'Subscribing...' : 'Subscribe'}</button>
```

You first encountered this Hook in Lesson 43, where a comment form executed an asynchronous action entirely inside the browser. In this architecture, the form action invokes a remote Server Function instead. The Hook functions identically in both environments. The component consumes the exact same `pending` property, except the execution window now covers a complete network round trip.

Keep this fundamental architectural rule in mind throughout this lesson:

**The pending state belongs to the `<form>`. Any component rendered inside that form reads the status using `useFormStatus`. The parent component rendering the `<form>` tag itself cannot read this Hook.**

> [!DEFINITION]
> **useActionState and isPending.** [REVIEW] `useActionState` is a React Hook that links component state with an asynchronous form action.
> 1. You supply an action function and initial state: `const [state, formAction, isPending] = useActionState(action, initial)`.
> 2. You attach `formAction` to the form: `<form action={formAction}>`.
> 3. Submitting the form triggers the action inside a Transition and sets `isPending` to `true`.
>
> Whatever value the action returns becomes the new `state`, and `isPending` returns to `false` when the Transition completes. Only the component calling `useActionState` can read `isPending` directly (Lesson 42).

> [!DEFINITION]
> **useFormStatus.** [REVIEW] `useFormStatus` is a Hook provided by `react-dom` that tracks the status of an enclosing HTML form.
> 1. You call the Hook inside a child component rendered within a `<form>`: `const { pending, data, method, action } = useFormStatus()`.
> 2. The Hook accepts no arguments and automatically discovers the parent form through React's internal context.
> 3. During submission, `pending` switches to `true`, providing immediate feedback without manual prop drilling.
>
> The Hook stores no local state. The parent `<form>` publishes its status, and whenever that status changes, React automatically re-renders every child component consuming `useFormStatus` (Lesson 43).

> [!DEFINITION]
> **Transition.** [REVIEW] A Transition is an asynchronous state update that React executes in the background without blocking the user interface.
> 1. React marks updates wrapped in `startTransition` as non-urgent background tasks.
> 2. An active Transition allows urgent user events, like typing or clicking, to interrupt rendering without freezing the page.
> 3. React exposes an `isPending` flag that remains `true` until all background updates finish rendering.
>
> When you assign an asynchronous function to a form's `action` prop, React automatically executes that submission inside a Transition (Lesson 41).

> [!DEFINITION]
> **Server Function.** [REVIEW] A Server Function is an asynchronous function that executes strictly on the server runtime.
> 1. You declare the function in a file marked with the `'use server'` directive.
> 2. Client components import an opaque reference rather than the server implementation code.
> 3. Invoking the reference sends a network request, executes the server routine, and returns a serialized response to the browser (Lesson 110).
>
> Server Functions process backend logic securely, but client callers can invoke them at will, making strict server-side input validation essential.

> [!DEFINITION]
> **Hydration.** [REVIEW] Hydration is the phase where React boots in the browser and attaches event listeners to pre-rendered server HTML.
> 1. The server delivers static HTML so the user sees the page layout immediately.
> 2. The browser downloads and evaluates the client JavaScript bundle in the background.
> 3. React walks the existing DOM tree, binds event handlers, and activates component Hooks.
>
> Before hydration finishes, no client-side React code executes, meaning Hooks like `useFormStatus` cannot alter the user interface (Lesson 104).

### The Problem of Repeated Submissions on Slow Connections

Consider the newsletter signup form placed at the bottom of our blog post from Lesson 113. A user visits the post on a mobile device over a high-latency connection. The page renders completely, and client hydration finishes. The visitor enters `john@example.com` and clicks the Subscribe button:

```page caption="The newsletter form right after the reader taps Subscribe, while the email travels to the server."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email | john@example.com
  submit: Subscribe
```

For several seconds, the interface provides no visual feedback. The button remains active, displaying the default label. The user assumes the initial click did not register and clicks a second time.

**Both submissions travel to the server sequentially.** The first request creates the subscriber record in the database. The second request arrives shortly after, detects the existing email, and returns a validation error. The user registered for the very first time, yet the interface reports that the address is already subscribed:

```page caption="The newsletter form after both taps: the reader signed up once, and the page says the email is already subscribed."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email |
  error: john@example.com is already subscribed.
  submit: Subscribe
```

The desired behavior is clear. While the server processes the submission, the button should display `Subscribing...` and reject additional clicks. However, the submit button lives inside its own component, `SubscribeButton`, nested within `SubscribeBox`. The asynchronous processing occurs remotely on the server. How does the isolated button component determine that the server is still executing?

The button inspects the status of its enclosing form. By calling `useFormStatus`, the button reads the `pending` boolean published by the form. The form remains pending throughout the execution of its action, which awaits the completion of the Server Function:

```tree dir=right caption="One tap on Subscribe, seen by the button, while the Server Function runs on the server."
One tap on Subscribe, seen by the button
- +Before the tap | The form is **not submitting** | `pending` is **`false`**: the button reads **Subscribe**
- +During the trip to the server and back | The form waits for **`subscribe`** to answer | `pending` is **`true`**: the button reads **Subscribing...** and cannot be tapped
- +After the answer comes back | The submit is **over** | `pending` is **`false`** again: the button reads **Subscribe**
```

**Why this matters:** Developers typically test applications on high-speed local networks where server responses return within milliseconds. On a fast connection, duplicate clicks rarely occur. On a cellular connection with high latency, users encounter this issue on their very first interaction.

### Common Architectural Mistakes

1. **Calling `useFormStatus` inside the box component**, which declares the `<form>` element. In this position, `pending` never evaluates to `true`.
2. **Expecting a Server Component form to display pending states without a client boundary**, and attempting to call Hooks directly inside a Server Component.
3. **Omitting the `'use client'` directive from the button file.** The button functions while consumed by Client Components, but throws build errors the moment a Server Component imports it.

### Four Ways to Show That the Server Is Still Working

React provides two distinct flags that indicate an active form submission. One flag is `isPending` from the action state Hook. The other flag is `pending` from the form status Hook. During an active submission, both flags switch to true simultaneously. The architectural difference lies entirely in component scope. The action flag is scoped to the component calling the action state Hook. In contrast, any nested component inside the form can access `pending` without prop drilling.

Developers select among four primary patterns to display loading indicators on submit buttons, depending on component hierarchy:

```tree caption="Four ways to show that a Server Function is still working, and the button each one fits."
Four ways to show that the server is still working
- +`disabled={isPending}` in the same component [`useActionState`] | The button is written **inside the component that calls `useActionState`** | Fits a button **next to the Hook**
- +`isPending` passed as a prop [`<SubscribeButton isPending={isPending} />`] | The form's component **hands the flag one level down** | Fits a button **one level below**
- +`useFormStatus` in the button's component [`pending`] | The button **asks the form above it** | Fits a button **reused in many forms**, at **any depth**, and a form **rendered by a Server Component**
- +`useTransition` around the call [`startTransition`] | A click handler **calls the Server Function** | Fits a button that is **not in a form**
```

The official documentation demonstrates the first two patterns for simple forms. The fourth pattern matches standalone buttons with manual event handlers, as demonstrated in Lesson 110. This lesson focuses on the third pattern. Using `useFormStatus` creates reusable submit buttons that function seamlessly even when rendered inside Server Components.

## SECTION | The Newsletter Form Under a Blog Post

Our project retains the file structure established in Lesson 113. We introduce one new component and update one existing file:

```files title="blog: the newsletter form" caption="The files of the newsletter form. SubscribeButton.jsx is new, and SubscribeBox.jsx renders it in place of its plain button."
src/
  db.js | stand-in | Plays the database, unchanged
  actions.js | Server Functions | Starts with `'use server'`; `subscribe(previousState, formData)` returns `{ error }` or `{ message }`, unchanged
  SubscribeBox.jsx | Client Component | Calls `useActionState`; renders `<SubscribeButton />` in place of its plain button
  SubscribeButton.jsx | Client Component | New: starts with `'use client'`, reads `pending` with `useFormStatus`, and shows `Subscribing...`
  ErrorBoundary.jsx | from Lesson 72 | Unchanged
  App.jsx | Server Component | Renders the post and `<SubscribeBox />` inside `<ErrorBoundary>`, unchanged
```

**PRINCIPLES:** Form submission state belongs strictly to the enclosing form element, allowing any descendant component to consume it. Five core principles govern this model:
1. **`pending` from `useFormStatus`: the button reads `Subscribing...` until the server answers.** The flag remains `true` from user dispatch until the Server Function finishes, disabling repeated clicks.
2. **`useFormStatus` in the component rendering `<form>`: `pending` stays `false`.** The Hook only inspects ancestor forms located above the calling component in the element tree.
3. **`data`, `method`, and `action`: these properties describe the active submission, not the response.** Server return values resolve exclusively through `useActionState`.
4. **`'use client'` on the button component: the button functions within Server Component forms.** The parent form stays on the server while the interactive button executes on the client.
5. **`pending` before hydration: the button displays `Subscribe`, requiring server-side validation.** User submissions prior to client bundle execution bypass client-side Hook logic.

---

## PRINCIPLE | `pending` from `useFormStatus`: the button reads `Subscribing...` until the server answers

> [!PRINCIPLE]
> **Principle 1: useFormStatus: The Button Reads pending Until the Server Answers**
>
> *Invoke `useFormStatus` inside a component nested within the form; `pending` stays `true` until the Server Function completes, enabling dynamic button text and preventing duplicate submissions.*
>
> Server Functions incur network latency, taking several seconds on mobile connections. React executes the form action within an internal Transition, maintaining the form in a pending state until the asynchronous promise settles. A nested button consumes this pending status directly from the form context without props, using the identical Hook syntax seen with client-side actions.
>
> **DO THIS:**
> ```jsx
> export default function SubscribeButton() {
>   const { pending } = useFormStatus();
>   return (
>     <button type="submit" ~disabled={pending}~> {/* Reads Subscribing... and refuses a second tap */}
>       {pending ? 'Subscribing...' : 'Subscribe'}
>     </button>
>   );
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function SubscribeButton() {
>   return ~<button type="submit">~Subscribe</button>; // **WRONG:** looks dead during the wait, so the reader taps twice
> }
> ```

### Implementation: A Button Connected to Form Context

Here is the complete implementation of the button component. It consumes `pending` from the enclosing form context, applying it to both the button label and the `disabled` attribute:

```jsx title="src/SubscribeButton.jsx"
'use client';

import { useFormStatus } from 'react-dom';

export default function SubscribeButton() {
  const { ~pending~ } = useFormStatus(); // true from the tap until subscribe answers
  return (
    <button type="submit" ~disabled={pending}~> {/* A second tap does nothing while the email travels */}
      {pending ? 'Subscribing...' : 'Subscribe'}
    </button>
  );
}
```

Note the import source: `useFormStatus` is exported by the `react-dom` package rather than core React. The top `'use client'` directive establishes a client boundary, explored in depth under Principle 4.

The parent component imports the button:

```jsx title="src/SubscribeBox.jsx" startLine="3"
import { useActionState } from 'react';
import { subscribe } from './actions';
~import SubscribeButton from './SubscribeButton';~ // The new file, imported by its default name
```

The parent replaces its native submit button with the new component:

```jsx title="src/SubscribeBox.jsx" startLine="12"
      <form action={formAction}>
        <label>
          Your email
          <input name="email" />
        </label>
        {state.error && <p>{state.error}</p>}
        ~<SubscribeButton />~ {/* Was <button type="submit">Subscribe</button> */}
        {state.message && <p>{state.message}</p>}
      </form>
```

Notice the simplicity of this integration. Our application code never manually toggles boolean state, and no props pass into the button. React manages the lifecycle of the form action, toggles internal context, and re-renders the button automatically.

### VS | Client-Side Actions vs. Server Functions: Unified Button Syntax

Compare the form from Lesson 43 with our server-backed form. Each form renders an internal button component:

```jsx title="A form whose action runs in the browser, and a form whose action calls the server"
<form ~action={addComment}~><PostButton /></form> {/* Lesson 43: addComment runs in the browser */}
<form ~action={formAction}~><SubscribeButton /></form> {/* formAction calls subscribe on the server */}
```

From the perspective of the button component, both architectures are functionally identical. The button component shares the exact internal structure of the comment button from earlier lessons. Both call the same Hook, inspect the same `pending` property, and bind the same `disabled` attribute. The Hook does not concern itself with where execution takes place. It only evaluates whether the parent form is currently executing an active action.

You might assume the server must emit signaling events to notify the browser when execution starts and finishes. In reality, no coordination signals are required. The browser manages the asynchronous execution cycle locally:
1. Because the form `action` receives a function, React executes the submission within an internal Transition.
2. The wrapper function dispatches the network request to the Server Function and awaits the returned promise.
3. While the promise remains unsettled, the Transition continues running, keeping the form in a pending state.

### Runtime Visual Feedback

When the user enters `john@example.com` and clicks Subscribe, React immediately updates the interface. While the network request travels to the server, the button displays `Subscribing...` and disables click interactions (as seen in Lesson 21):

```page caption="The newsletter form while subscribe runs on the server: the button reads Subscribing... and cannot be tapped."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email | john@example.com
  submit: Subscribing... | | disabled
```

When the server completes execution and responds, React coordinates three updates simultaneously. The confirmation message renders, React automatically resets uncontrolled form fields following a successful submission (as seen in Lesson 45), and the button restores its default label:

```page caption="The same form after the server answered: the thanks line, an empty email field, and the button back on Subscribe."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email |
  submit: Subscribe
line: You are subscribed! | good
```

Inspecting the DOM in browser developer tools reveals standard HTML elements. React merely mutates the `disabled` attribute and updates text nodes:

```dom caption="The Elements panel during the wait: React has set disabled on the button and changed its text."
+ <button type="submit" disabled="">Subscribing...</button> | note: pending is true
```

### VS | Label Updates Alone vs. Disabling the Element

Altering the button text solves only half the problem. Compare these two button implementations:

```jsx title="The button without disabled, and with disabled={pending}"
<button type="submit">{pending ? 'Subscribing...' : 'Subscribe'}</button> {/* The text changes, and a second tap still submits */}
<button type="submit" ~disabled={pending}~>{pending ? 'Subscribing...' : 'Subscribe'}</button> {/* A second tap does nothing */}
```

On a high-speed development machine, both variants appear to function identically. However, their runtime behavior differs fundamentally. Without the `disabled` property, clicking the button during an ongoing request dispatches a second submission. Applying `disabled={pending}` instructs the browser to drop subsequent click events entirely while the action remains active.

Why does the unblocked second click produce an error message rather than a second confirmation? React does not run concurrent submissions in parallel. Instead, React queues form actions sequentially:
1. The user inputs an unregistered address like `john@example.com` and clicks Subscribe.
2. React invokes the action wrapper, which dispatches the server function and marks the form as pending.
3. Because the button remains clickable, the user clicks again during the network delay.
4. React places the second action submission into a sequential queue behind the active request (as seen in Lesson 42).
5. The first action completes on the server, stores the record in the database, and returns a success payload.
6. The second action begins execution, detects the newly inserted email in the database, and returns a duplicate error.
7. React assigns the final action result to `state`, overwriting the success response with the rejection error.

React documentation notes that action handlers process sequentially. Binding `disabled={pending}` accomplishes two critical tasks. It signals visual progress to the user, and it prevents additional requests from queuing behind the initial submission.

### Common Mistake: Creating Isolated Buttons Without Form Awareness

Developers frequently extract buttons into standalone components while neglecting form state integration:

```jsx title="src/SubscribeButton.jsx" bad="2"
export default function SubscribeButton() {
  return <button type="submit">Subscribe</button>; // **WRONG:** no pending state, so the button looks dead during the wait
}
```

During local testing with negligible latency, the missing loading state goes unnoticed because responses return instantly. On high-latency mobile networks, users double-click and receive duplicate registration rejections. The resolution requires wiring `useFormStatus` to display contextual text and bind the `disabled` attribute.

Remember: pending state belongs to the form element, and descendant components access that state through `useFormStatus`.

---

## PRINCIPLE | `useFormStatus` in the component that renders `<form>`: `pending` stays `false`

> [!PRINCIPLE]
> **Principle 2: useFormStatus Next to the Form Tag: pending Stays false**
>
> *`useFormStatus` only detects forms situated above the calling component; inside the component declaring the `<form>` element, `pending` remains `false` across all submissions without raising errors.*
>
> The component returning the `<form>` tag is an ancestor of the form, not a descendant. The Hook searches upward through the component tree, detects no enclosing form, and returns default idle values. To track pending state in the form component itself, inspect `isPending` from `useActionState` or delegate the button to a child component.
>
> **DO THIS:**
> ```jsx
> export default function SubscribeBox() {
>   const [state, formAction] = useActionState(subscribe, { error: null });
>   return (
>     <form action={formAction}>
>       <input name="email" />
>       ~<SubscribeButton />~ {/* Calls useFormStatus inside the form */}
>     </form>
>   );
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function SubscribeBox() {
>   const [state, formAction] = useActionState(subscribe, { error: null });
>   const { ~pending~ } = useFormStatus(); // **WRONG:** this component renders the form, so pending stays false
>   return (
>     <form action={formAction}>
>       <input name="email" />
>       <button type="submit" disabled={pending}>Subscribe</button>
>     </form>
>   );
> }
> ```

### Tree Hierarchy Determines Hook Visibility

Why did we encapsulate the submit button inside a separate component? Because the parent component renders the form element, calling the Hook in that same component appears more straightforward. Consider invoking the Hook in both locations:

```jsx title="The same useFormStatus line in SubscribeBox and in SubscribeButton"
function SubscribeBox() {
  const { ~pending~ } = useFormStatus(); // Renders the <form> tag below: pending stays false
  return <form action={formAction}>...</form>;
}

function SubscribeButton() {
  const { ~pending~ } = useFormStatus(); // Rendered inside the <form>: pending is true during the submit
  return <button type="submit" disabled={pending}>...</button>;
}
```

Although the invocations use identical syntax, their execution contexts differ fundamentally. The internal form behaves exactly like a Context provider, meaning only descendant components wrapped within that provider can consume its published values:
- **`SubscribeButton`** is rendered inside the `<form>` tree, providing an ancestor form for the Hook to discover.
- **`SubscribeBox`** renders the `<form>` tag in its return statement. The form sits below the component in the tree, meaning the Hook finds no enclosing provider.

React documentation explicitly confirms this limitation: "`useFormStatus` will not track the status of a `<form>` rendered in the same component." When no ancestor form exists above the component, `pending` defaults permanently to `false`.

```tree caption="The same useFormStatus line in the component that renders the form tag, and in a component rendered inside the form."
Where `useFormStatus` is called
- !In `SubscribeBox` [renders `<form>`] | The form is **below** the component | No form above it: `pending` is **always `false`**
- +In `SubscribeButton` [inside `<form>`] | The form is **above** the component | `pending` is **`true`** while the submit runs
```

### The Failure Mode of Inline Invocations

Consider what occurs when a developer keeps the button markup within the parent component and invokes `useFormStatus` there:

```jsx title="src/SubscribeBox.jsx" bad="9"
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { subscribe } from './actions';

export default function SubscribeBox() {
  const [state, formAction] = useActionState(subscribe, { error: null });
  const { ~pending~ } = useFormStatus(); // **WRONG:** SubscribeBox renders the form, so pending is always false
  return (
    <section>
      <h2>Get new posts by email</h2>
      <form action={formAction}>
        <label>
          Your email
          <input name="email" />
        </label>
        {state.error && <p>{state.error}</p>}
        <button type="submit" disabled={pending}>
          {pending ? 'Subscribing...' : 'Subscribe'}
        </button>
        {state.message && <p>{state.message}</p>}
      </form>
    </section>
  );
}
```

When the user submits the form, the action runs on the server. However, the button remains static throughout the network round trip. The user can click repeatedly, and the browser console remains silent:

```page caption="The newsletter form while subscribe runs, with useFormStatus called in SubscribeBox: the button never changes."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email | john@example.com
  submit: Subscribe
console: quiet
```

**React emits no warning because an absence of an ancestor form is a valid runtime condition.** The Hook interprets this state as an idle system. Consequently, the bug remains silent during local development. The developer assumes the lack of loading text stems from instant local server responses. In production, users on high-latency devices face duplicate submission errors.

### Native Status Tracking via useActionState

The parent component has no need to call `useFormStatus`. It already initializes `useActionState`, which exposes `isPending` as its third array element:

```jsx title="The pending flag in SubscribeBox, and the pending flag in SubscribeButton"
const [state, formAction, ~isPending~] = useActionState(subscribe, { error: null }); // In SubscribeBox
const { ~pending~ } = useFormStatus(); // In SubscribeButton, inside the form
```

Both flags evaluate to `true` while the identical submission executes. The `isPending` flag indicates whether an action managed by this specific `useActionState` instance is active. The `pending` flag indicates whether the enclosing form element is submitting. The distinction centers strictly on component positioning:
- **In the component declaring `useActionState`**, access the transition state via `isPending`.
- **In any child component nested inside the form**, access the form state via `useFormStatus` without props.

Two valid patterns correct the mistake shown above:
1. Bind `disabled={isPending}` directly inside the parent component.
2. Extract the button into a dedicated child component rendered inside the form.

We deliberately implement the second approach. As Principle 4 demonstrates, forms rendered by Server Components do not execute `useActionState` and therefore lack an `isPending` flag entirely.

Remember: pending state belongs to the form. Consume it from within the form tree, never from the component declaring the `<form>` element.

---

## PRINCIPLE | `data`, `method`, and `action`: they describe the submit on its way, never the answer of the server

> [!PRINCIPLE]
> **Principle 3: useFormStatus Values: They Describe the Submit, Not the Answer**
>
> *`useFormStatus` exposes `pending`, `data`, `method`, and `action` to represent outgoing submission details; server response data is never included.*
>
> The `data` property provides the active `FormData` payload during submission and returns `null` when idle. The `method` property mirrors the HTTP method of the form, resolving to `'post'` when using Server Functions. The `action` property references the function passed to the form, which matches `formAction` when paired with `useActionState`. Server return values and validation errors resolve exclusively through the state returned by `useActionState`.
>
> **DO THIS:**
> ```jsx
> const { pending, ~data~ } = useFormStatus(); // The email being sent, while pending
> return <p>{pending && `Subscribing ${data.get('email')}...`}</p>;
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const { ~result~ } = useFormStatus(); // **WRONG:** useFormStatus has no answer from the server; result is undefined
> return <p>{result}</p>;
> ```

### Inspecting Outgoing Submission Parameters

The `useFormStatus` Hook returns an object containing four distinct properties describing the in-flight submission. Right after the user clicks Subscribe, the component can access these values:

```jsx title="The four values useFormStatus returns, right after the tap"
const { pending, data, method, action } = useFormStatus();

~pending~ // true: the form is submitting
~data~.get('email') // 'john@example.com': the form data being sent
~method~ // 'post': how the form sends it
~action~ // formAction: the function passed to the form's action prop
```

While no submission is active, `pending` remains false and `data` evaluates to null.

Every property exposed by `useFormStatus` details the outgoing request. None of them contain values returned by the server. Server responses, whether success confirmations or rejection objects, reach the user interface through state managed by `useActionState` (as seen in Lesson 113).

```tree caption="What useFormStatus describes, and where the answer of the server comes from."
Two things the newsletter form knows about one submit
- +The submit on its way [`useFormStatus`] | `pending`, `data`, `method`, `action` | Read by **any component inside the form**
- +The answer that came back [`useActionState`] | `state`, such as **`{ message: 'You are subscribed!' }`** | Read by **the component that calls `useActionState`**
```

### Comparing Client Form Data with Server Arguments

The `data` object captures form input values at the precise moment of submission. The Server Function receives those same values as its second argument:

```jsx title="The same email, read in the button and on the server"
data.get('email') // In SubscribeButton, in the browser: 'john@example.com'
formData.get('email') // In subscribe, on the server: 'john@example.com'
```

Both objects expose identical field entries for the active submission. Their execution context defines the only difference. The button inspects `data` locally in the client browser to power optimistic UI states during transit. The server parameter represents the serialized payload transmitted across the network (as seen in Lesson 110). React documentation illustrates this pattern by displaying in-flight user data alongside a progress indicator while the request executes.

### Why the Method Property Resolves to POST

The `method` property evaluates to either get or post. In our component JSX, the `<form>` element omits an explicit method attribute. Standard HTML forms without a specified method default to GET. Despite this, `method` returns post.

The Hook derives its method value from the rendered `<form>` element. When server rendering generates markup for a form whose action targets a Server Function, React injects `method="POST"` into the element. React documentation specifies that when `action` receives a function, the HTTP method defaults to POST regardless of manual configuration. This attribute ensures the form can submit to the server prior to JavaScript evaluation (as seen in Lesson 112). After client hydration, the element retains this configuration, causing `method` to return post.

Contrast this behavior with the client-only form from Lesson 43. That form executed purely within the browser and lacked server-rendered action attributes. Consequently, its `method` property evaluated to get while pending.

### Understanding Action References

The `action` property returns a direct reference to whichever function was assigned to the form element:

```jsx title="The action prop in Lesson 113's form, and in Lesson 112's form"
<form ~action={formAction}~>...</form> {/* Lesson 113 and this lesson: useFormStatus gives action as formAction */}
<form ~action={subscribe}~>...</form> {/* Lesson 112: useFormStatus gives action as the reference to subscribe */}
```

While both configurations ultimately dispatch the server routine, their direct references point to different functions. In our current implementation, `action` references the action wrapper returned by `useActionState`. This wrapper coordinates React transitions and dispatches the underlying logic. Only in forms that assign the Server Function directly to the JSX `action` prop, as explored in Lesson 112, does the Hook reference the raw Server Function.

### Common Mistake: Querying Server Responses from Form Status

Developers often expect `useFormStatus` to expose response data when the server completes its execution:

```jsx title="src/SubscribeButton.jsx" bad="2"
export default function SubscribeButton() {
  const { pending, ~result~ } = useFormStatus(); // **WRONG:** there is no result; result is undefined
  return <button type="submit">{result ? 'Done!' : 'Subscribe'}</button>;
}
```

The button never transitions to the completed label because `result` remains undefined. The Hook exclusively supplies submission metadata. Server response data resolves into the state variable returned by `useActionState` within the parent component. This architectural separation explains why confirmation messages and validation errors render inside the parent component rather than the button.

Remember: `useFormStatus` monitors in-flight submission progress, whereas `useActionState` captures the resolved server response.

---

## PRINCIPLE | `'use client'` on the button's own file: the same button works inside a Server Component form

> [!PRINCIPLE]
> **Principle 4: Declaring use client in the Button Module: Universal Form Compatibility**
>
> *Place `'use client'` at the top of the button component file; this enables the button to track the pending state of forms rendered by Server Components while keeping the parent form on the server.*
>
> The `useFormStatus` Hook executes exclusively in client runtime environments. Server Components cannot invoke React Hooks, meaning they cannot supply an `isPending` prop. A button reading form context requires no passed props, functioning under any form. By declaring its own client boundary, the button executes on the client regardless of where it is imported.
>
> **DO THIS:**
> ```jsx
> ~'use client';~ // The button is client code even when a Server Component imports it
>
> import { useFormStatus } from 'react-dom';
>
> export default function SubscribeButton() {
>   const { pending } = useFormStatus();
>   return <button type="submit" disabled={pending}>{pending ? 'Subscribing...' : 'Subscribe'}</button>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~import { useFormStatus } from 'react-dom';~ // **WRONG:** no 'use client' above, so a Server Component form makes this a Server Component
>
> export default function SubscribeButton() {
>   const { pending } = useFormStatus();
>   return <button type="submit" disabled={pending}>{pending ? 'Subscribing...' : 'Subscribe'}</button>;
> }
> ```

### Integrating Client Buttons into Server Component Forms

Review the architectural baseline from Lesson 112, where the form component was a pure Server Component. That implementation did not display inline server responses, binding the Server Function directly to the form:

```jsx title="src/SubscribeBox.jsx, Lesson 112's version, with our new button"
import { subscribe } from './actions';
import SubscribeButton from './SubscribeButton';

export default function SubscribeBox() { // No directive: a Server Component
  return (
    <section>
      <h2>Get new posts by email</h2>
      <form ~action={subscribe}~> {/* Lesson 112: the form calls the Server Function directly */}
        <label>
          Your email
          <input name="email" />
        </label>
        ~<SubscribeButton />~ {/* The only part of the form that runs in the browser */}
      </form>
    </section>
  );
}
```

A minor signature difference exists between these examples. In Lesson 112, the server action accepted form data as its sole parameter. Our current implementation retains the signature from Lesson 113, taking previous state followed by form data.

This server-rendered component cannot track submission progress on its own. Server Components do not support React Hooks (as seen in Lesson 108). Consequently, it cannot invoke `useActionState` or generate an `isPending` flag to pass downward. Options requiring parent-level state flags remain unavailable.

The contextual approach via `useFormStatus` remains fully operational. Because the button requires no passed props, it queries the surrounding form regardless of which component rendered the form element:

```jsx title="The same button in Lesson 113's Client Component form, and in Lesson 112's Server Component form"
<form action={formAction}><SubscribeButton /></form> {/* Rendered by a Client Component */}
<form action={subscribe}><SubscribeButton /></form> {/* Rendered by a Server Component */}
```

The button component functions identically across both architectures. In each case, it reads status updates from its parent form element. React engineering notes highlight this exact capability: enabling design system components to access form state without requiring prop drilling.

### Defining Explicit Client Boundaries

The `useFormStatus` Hook is part of `react-dom` and requires a client execution environment. Therefore, the button component must execute on the client. A module joins the client bundle through one of two mechanisms (as seen in Lesson 106):
1. The module defines an explicit `'use client'` directive at the top of the file.
2. An existing Client Component imports the module into its dependency graph.

Within the client-rendered form from Lesson 113, the second condition already applies. The parent module declares `'use client'`, ensuring all imported dependencies run on the client. Compare the button module with and without its own directive when imported there:

```jsx title="SubscribeButton.jsx without its own 'use client'"
import { useFormStatus } from 'react-dom'; // Client code anyway: SubscribeBox.jsx imports it and starts with 'use client'
```

```jsx title="SubscribeButton.jsx with its own 'use client'"
~'use client';~ // The same client code: here the directive changes nothing
import { useFormStatus } from 'react-dom';
```

In this specific context, both variations behave identically. Official documentation confirms that when a Client Component imports a file containing `'use client'`, the directive introduces no additional runtime changes.

Now place those same two button files inside a form rendered by a Server Component. The architectural outcome changes drastically:
- **Without `'use client'`**, the Server Component imports the file as another server module. The server environment does not export client Hooks, causing the build or runtime to throw an import failure.
- **With `'use client'`**, the import statement establishes a clear network boundary. Only the button component ships to the client bundle. The surrounding form layout and input elements remain strictly on the server.

```tree caption="SubscribeButton.jsx with and without its own 'use client', under a Client Component form and under a Server Component form."
Does the button's file need its own `'use client'`?
- +Under Lesson 113's Client Component form | The button is client code **either way** | The directive **has no effect**: both work
- !Under Lesson 112's Server Component form, without the directive | The button becomes a **Server Component** | The Hook **cannot be imported**: the page fails with an error
- +Under Lesson 112's Server Component form, with the directive | The import is the **boundary** | Only the button **runs in the browser**; the form stays on the server
```

### Delayed Failures in Reusable Design Components

**A shared button module lacking `'use client'` fails only when imported into a new server context, often long after initial development.** Consider how this occurs:
1. An engineer creates the button without `'use client'`. It renders without issue because existing forms all reside within Client Components.
2. Later, another developer imports the component into a form declared inside a Server Component.
3. Because the import originates from server code, React treats the button module as a Server Component.
4. The server runtime cannot resolve `useFormStatus`, causing rendering to fail before generating HTML.

The button implementation remained unchanged, yet the environment of the caller altered its execution context. Explicitly marking reusable UI components with `'use client'` prevents this cross-environment failure.

### Common Mistake: Converting Entire Forms into Client Components

When seeking to add loading states to a Server Component form, developers sometimes attach `useFormStatus` directly to the parent form component. When the server environment throws an error, they respond by adding `'use client'` to the parent file:

```jsx title="src/SubscribeBox.jsx" bad="1"
~'use client';~ // **WRONG:** only the button needs the browser, and now the whole component goes into the bundle

import { useFormStatus } from 'react-dom';
```

While this eliminates the import error, the architectural decision degrades performance. The entire form layout, inputs, and associated static markup are bundled into client JavaScript. Furthermore, the violation described in Principle 2 immediately surfaces. Because the Hook resides in the component declaring the `<form>` element, `pending` remains permanently false. The proper solution keeps the form on the server and isolates interactive logic inside a dedicated client button component.

When an application requires displaying returned server validation directly in the UI, the form requires `useActionState` and naturally becomes a Client Component (as seen in Lesson 113). Pure Server Component forms remain ideal when actions trigger external navigations or background processing without inline state display.

Remember: pending state belongs to the form, even when rendered by Server Components. Only the child component consuming that status must execute on the client.

---

## PRINCIPLE | `pending` before hydration: the button stays on `Subscribe`, so only the server can stop a duplicate

> [!PRINCIPLE]
> **Principle 5: Submissions Prior to Hydration: The Button Retains Its Default State**
>
> *Initial server rendering generates the form in an idle state, displaying the default button label; submissions dispatched before client hydration execute without client-side Hook updates.*
>
> The `useFormStatus` Hook can update the user interface only after React initializes in the browser. Before hydration, the form remains fully functional because it uses standard HTML POST mechanics to dispatch the Server Function. Treat loading indicators and disabled attributes as progressive user experience improvements, and enforce all security and data constraints on the server.
>
> **DO THIS:**
> ```js
> export async function subscribe(previousState, formData) {
>   const email = formData.get('email');
>   if (~await db.subscribers.has(email)~) { // Checks every submit, with or without JavaScript
>     return { error: `${email} is already subscribed.` };
>   }
>   await db.subscribers.add(email);
>   return { message: 'You are subscribed!' };
> }
> ```
>
> **DO NOT DO THIS:**
> ```js
> export async function subscribe(previousState, formData) {
>   ~await db.subscribers.add(formData.get('email'));~ // **WRONG:** trusts disabled={pending}, which the first HTML does not have
>   return { message: 'You are subscribed!' };
> }
> ```

### Submitting While the JavaScript Bundle Downloads

Revisit the visitor accessing the application over a constrained connection prior to script download (as seen in Lesson 112). The server pre-renders and streams the HTML markup, making the article and subscription form visible immediately. While the client bundle downloads in the background, the user fills in `john@example.com` and clicks Subscribe.

The button label does not change. It continues to display the default label, and the user can click again without restriction:

```page caption="The newsletter form after a tap made before the JavaScript bundle has loaded: the button still reads Subscribe."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email | john@example.com
  submit: Subscribe
```

**Users on degraded connections who experience the longest network delays are the very users who interact before hydration finishes.** The timeline unfolds in four stages:
1. The server renders the component tree to static HTML (as seen in Lesson 102). Because no action is executing during rendering, `pending` evaluates to false, outputting an enabled button with default text.
2. The visitor clicks the submit button while the script bundle remains in transit.
3. Because client-side React code has not booted, `useFormStatus` cannot re-render the button with updated text.
4. The submission succeeds regardless. Because the form specifies a Server Function, the browser performs a native HTTP POST request directly to the endpoint (as seen in Lesson 112).

The initial document displays the button exactly as rendered on the server:

```dom caption="The Elements panel before hydration: the button as the server rendered it, with no submit running."
! <button type="submit">Subscribe</button> | note: No disabled, and no React yet to add it
```

### VS | Post-Hydration Submissions vs. Pre-Hydration Submissions

Contrast user interactions occurring before and after hydration:
- **Submissions following hydration**: React intercepts the submit event, activates transitions, updates `pending` to `true`, and disables the button element.
- **Submissions preceding hydration**: The browser handles submission natively without JavaScript, leaving `pending` unset and the button enabled.

From the server viewpoint, both submissions execute identically. The server receives the form data and runs the underlying logic. However, the client button reflects fundamentally different states. Dynamic labels and disabled attributes exist only when client JavaScript is running.

```tree caption="The same tap on Subscribe, after hydration and before the bundle loads."
One tap on Subscribe, at two moments
- +After hydration | **React** runs the action and sets **`pending`** | The button reads **Subscribing...** and **cannot be tapped**
- !Before the bundle loads | **No React code** runs in the browser yet | The button stays on **Subscribe**: no Hook has run
```

React documentation underlines that forms submit successfully before script bundles finish loading. The HTML form architecture guarantees core functionality. Dynamic progress indicators represent an enhancement layered on top once client scripts execute.

### Common Mistake: Relying on Client Attributes for Data Integrity

Observing that the client button disables upon clicking, a developer might remove duplicate validation from the server action:

```js title="src/actions.js" bad="7"
'use server';

import { db } from './db';

export async function subscribe(previousState, formData) {
  const email = formData.get('email');
  ~await db.subscribers.add(email);~ // **WRONG:** trusts disabled={pending}, which does not exist before hydration
  return { message: 'You are subscribed!' };
}
```

Binding `disabled={pending}` improves usability, but it offers zero database protection:
1. On fast local development setups, bundles load instantly, making the disabled state appear infallible.
2. On slow networks, the pre-rendered HTML contains no disabled attribute, allowing early visitors to submit multiple times.
3. Malicious actors or external scripts can post requests directly to the server endpoint without using the browser interface (as seen in Lesson 113).

Only server-side validation guarantees database consistency.

Remember: client pending state provides user feedback in the browser, while the server must validate and protect every incoming transaction.

---

## All 5 Principles Together

### The Complete Code

The database module simulates persistence storage, unchanged:

```js title="src/db.js"
const subscribers = [];

export const db = {
  subscribers: {
    async has(email) {
      return subscribers.includes(email);
    },
    async add(email) {
      subscribers.push(email);
    },
  },
};
```

The server actions module contains the Server Function, unchanged. It validates every incoming request regardless of client interface state:

```js title="src/actions.js"
'use server';

import { db } from './db';

export async function subscribe(previousState, formData) {
  const email = formData.get('email');
  if (~await db.subscribers.has(email)~) { // Principle 5: the check on the server, with or without JavaScript
    return { error: `${email} is already subscribed.` };
  }
  await db.subscribers.add(email);
  return { message: 'You are subscribed!' };
}
```

`SubscribeBox.jsx` preserves server responses in state and mounts the child button component within its form:

```jsx title="src/SubscribeBox.jsx"
'use client';

import { useActionState } from 'react';
import { subscribe } from './actions';
import SubscribeButton from './SubscribeButton';

export default function SubscribeBox() {
  const [state, formAction] = useActionState(subscribe, { error: null }); // Principle 3: the answer lives here
  return (
    <section>
      <h2>Get new posts by email</h2>
      <form ~action={formAction}~> {/* Principle 2: the form above SubscribeButton */}
        <label>
          Your email
          <input name="email" />
        </label>
        {state.error && <p>{state.error}</p>}
        ~<SubscribeButton />~ {/* Principle 1: no pending prop */}
        {state.message && <p>{state.message}</p>}
      </form>
    </section>
  );
}
```

`SubscribeButton.jsx` defines the isolated button component:

```jsx title="src/SubscribeButton.jsx"
~'use client';~ // Principle 4: client code under any form

import { useFormStatus } from 'react-dom';

export default function SubscribeButton() {
  const { ~pending~ } = useFormStatus(); // Principles 1 and 5: true from the tap until subscribe answers, after hydration
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Subscribing...' : 'Subscribe'}
    </button>
  );
}
```

`ErrorBoundary.jsx` is the standard class component from Lesson 72, unchanged:

```jsx title="src/ErrorBoundary.jsx"
'use client';

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

`App.jsx` renders the article layout and encapsulates the subscription box inside an Error Boundary:

```jsx title="src/App.jsx"
import SubscribeBox from './SubscribeBox';
import ErrorBoundary from './ErrorBoundary';

export default function App() {
  return (
    <main>
      <h1>Park Opens Today</h1>
      <p>The city opened a new park on Main Street.</p>
      <ErrorBoundary fallback={<p>Could not subscribe. Try again later.</p>}>
        <SubscribeBox />
      </ErrorBoundary>
    </main>
  );
}
```

### The Order in Which Things Run

```tree dir=right caption="The order in which the components and the Server Function run, from the first HTML to the answer under the form."
From the first HTML to the answer on the screen
- +1. On the server [`App` `ErrorBoundary` `SubscribeBox` `SubscribeButton`] | The framework renders the page to HTML | No submit is running: the button reads **Subscribe**
- +2. Hydration [`SubscribeButton`] | React attaches to the HTML in the browser | From now on, `useFormStatus` **can change the button**
- +3. The tap [`formAction`] | React sends the form in a Transition | `pending` turns **`true`**: the button reads **Subscribing...** and is disabled
- +4. The answer [`subscribe` returns] | The returned value becomes **`state`** in `SubscribeBox` | `pending` turns **`false`**: the button reads **Subscribe**, and the answer line appears
```

### Summary

| Aspect | What a Developer Might Expect | What React Does |
| :--- | :--- | :--- |
| **Submission status tracking** | Server sends start and finish signals | Browser manages status locally while the action awaits the server response |
| **Button code with Server Functions** | Dedicated syntax required for server actions | Identical `useFormStatus` syntax as used with browser actions |
| **Disabling the button element** | Optional cosmetic enhancement | Necessary to prevent queued duplicate submissions |
| **Calling Hook in parent form component** | Parent owns the form and knows its state | Component declares `<form>` so it has no ancestor form and returns `false` |
| **Status flag inside parent component** | Calling `useFormStatus` | Reading `isPending` directly from `useActionState` |
| **Accessing server return values** | Available inside `useFormStatus` | Handled by `state` in `useActionState`; `useFormStatus` only reflects submission metadata |
| **HTTP method without method attribute** | Defaults to `'get'` | Resolves to `'post'` because React injects POST for Server Function actions |
| **Button module without `'use client'`** | Functions globally | Functions under Client Components but fails when imported into Server Components |
| **Submissions prior to hydration** | Button shows loading indicator | No client script has run, so button retains default markup |

Remember the central principle of this lesson: **The pending state belongs to the `<form>`. Any component rendered inside that form reads its status through `useFormStatus`. The component declaring the `<form>` element cannot.**

---

## For the Interview

> **The Interview Question:** How does a nested field read the form's pending state during a server action?

### How to Answer Clearly in 30 Seconds

"A nested component imports `useFormStatus` from `react-dom` and inspects `pending`. The Hook consumes the status of the ancestor `<form>` through internal context, eliminating prop drilling. When the form action invokes a Server Function, React runs the execution inside a Transition. The form remains pending until the server responds. Three core rules govern its use:
1. **Call the Hook inside child components.** Calling it inside the component rendering the `<form>` always returns `false`. In that parent component, inspect `isPending` from `useActionState`.
2. **The Hook describes the submission, not the response.** It returns `pending`, `data`, `method`, and `action`. Server return values resolve exclusively through `useActionState`.
3. **Declare `'use client'` on the button module.** This ensures the component functions properly even when embedded in Server Component forms that cannot execute Hooks."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why not just pass `isPending` from `useActionState` down as a prop?"**
   Passing props works when a button sits directly below the component calling `useActionState`. Official documentation illustrates this pattern with small forms. However, shared design components appear across multiple layouts at varying nesting depths. Prop drilling forces intermediate components to forward props unnecessarily (as seen in Lesson 28). Furthermore, forms rendered by Server Components lack `useActionState` entirely, leaving no `isPending` prop to pass. The Hook exists precisely to allow nested components to access form state independently.

2. **"Why does `useFormStatus` return `pending: false` when called in the component declaring the form?"**
   The Hook searches upward through the component tree for an ancestor `<form>`. The component returning `<form>` markup is an ancestor of that element, not a child. Finding no parent form above itself, the Hook returns idle defaults: `pending` evaluates to `false` and `data` is `null`. React raises no error because an unnested Hook call represents an idle state. React documentation explicitly states that the Hook will not track a form rendered in the same component.

3. **"Does the pending state work before client hydration completes?"**
   No. The server pre-renders HTML in an idle state, outputting default text without a disabled attribute. Submissions dispatched before JavaScript evaluation execute natively through standard browser POST requests. Because client-side React code has not booted, `useFormStatus` cannot trigger UI updates. When paired with `useActionState`, React automatically replays submissions entered before hydration (as seen in Lesson 137). Therefore, client pending states provide user interface feedback, while Server Functions must enforce backend validation on every submission.

```tree dir=right caption="Interview comparison: the two flags of one submit, and the component that can read each one."
Two flags for the same submit
- +`isPending` [`useActionState`] | **`true`** while the action runs | Read only by **the component that calls `useActionState`**
- +`pending` [`useFormStatus`] | **`true`** while the form submits | Read by **any component inside the form**, with no prop
```
