# Lecture 113: How a Server Function's Answer Reaches the Line Under the Email Field

*(How does the server's "already subscribed" get onto the page, right under the email field?)*

> INTERVIEW QUESTION | ❱ CORE | How do a Server Function's return values and errors reach the UI?

---

## VS | A Form `action={subscribe}` vs. `useActionState(subscribe)`: both run the Server Function, only `useActionState` keeps its answer

> In JavaScript, a function returns a value directly to its caller. **When a form calls a Server Function, pass that action through `useActionState` so React stores the returned value in state**. Without this Hook, the native form element is the caller. The server returns the rejection, but no component state receives it, and the user never sees the error message.

Consider how return statements operate in standard JavaScript. A returned value travels directly back to the line that invoked the function. If that caller captures the value in a variable, you can inspect it. If no variable captures the result, the value is dropped:

```js title="Plain JavaScript: the caller receives the returned value"
const total = ~add(2, 3)~; // The caller keeps the answer: total is 5
add(2, 3); // The function still returns 5, but no variable receives it
```

A Server Function obeys this exact execution rule. In Lesson 110, our custom event handler invoked the Server Function directly, so our code captured the returned response in local state:

```jsx title="Our handler is the caller, so our code receives the answer"
const answer = await ~subscribe(email)~; // answer holds what subscribe returned
```

In Lesson 112, we assigned the Server Function directly to the form element. When the user submits `<form action={subscribe}>`, the form itself acts as the caller. React bundles the fields and dispatches the server call. When the server responds, no component variable captures the returned object. Just like calling a function without assigning its return value, the server sends a response, but nothing stores it.

**This is why you wire the Server Function through `useActionState`** (as seen in Lesson 42). React manages the execution cycle, intercepts the returned data, and stores it in component state:

```jsx title="useActionState keeps the answer of the Server Function"
const [state, formAction] = ~useActionState(subscribe, { error: null })~; // state holds what subscribe returned last
<form ~action={formAction}~> {/* The form calls formAction, and React calls subscribe */}
```

Picture a newsletter signup form placed below a blog post. A visitor registers with `john@example.com` and clicks Subscribe. Later, that same visitor forgets their earlier signup and submits the exact same email address. The server queries the database, detects the duplicate address, and returns a rejection. How does that rejection message travel across the network and render directly beneath the email field?

**Why:** Only the server can identify a duplicate subscriber because only the server accesses the database. Yet the user interface renders in the client browser. That validation result must cross the network, and client state must preserve it. The workflow spans three distinct stages:
1. The server function returns a plain JavaScript object containing the validation failure in its `error` property.
2. React transmits a serialized copy of that object across the network to the client browser (as seen in Lesson 110).
3. The `useActionState` Hook captures that object as state, enabling the component to render the message under the input field.

```tree dir=right caption="The three steps from the refusal on the server to the line under the email field."
How the server's answer reaches the screen
- +1. On the server [`return { error }`] | `subscribe` **returns** the refusal as an object
- +2. Over the network | React sends a **serialized copy** of the returned value to the browser
- +3. In the browser [`state.error`] | `useActionState` keeps the copy as **state**, and the component **shows it under the email field**
```

A clear architectural boundary determines how different errors reach the user interface. An expected validation issue that the user can correct is returned as standard data. An unexpected infrastructure failure, such as a crashed database, is thrown as an exception. A returned value populates component state, while a thrown exception bypasses state and triggers the nearest Error Boundary.

Here is the central rule to guide your design:

**A Server Function delivers feedback by returning data, and `useActionState` stores that data in state. Return validation issues the user can fix, and throw unexpected infrastructure exceptions.**

> [!DEFINITION]
> **Server Function.** [REVIEW] A Server Function is an asynchronous function that executes exclusively on the server runtime.
> 1. You mark the function or its module with the `'use server'` directive: `export async function subscribe(formData)`.
> 2. Client code imports an opaque reference rather than the server source code.
> 3. Invoking the reference sends a network request, executes the server logic, and returns a serialized response (Lesson 110).
>
> Server Functions access server resources directly, but arguments sent by clients represent untrusted input that you must always validate on the server.

> [!DEFINITION]
> **useActionState.** [REVIEW] `useActionState` is a React Hook that synchronizes component state with the execution of a form action.
> 1. You provide an action and initial state: `const [state, formAction] = useActionState(action, initialState)`.
> 2. You pass `formAction` to a form element: `<form action={formAction}>`.
> 3. Submitting the form passes the previous state and form data to your action: `action(previousState, formData)`.
>
> Whatever the action returns becomes the updated `state`, prompting React to re-render the component with fresh values (Lesson 42).

> [!DEFINITION]
> **Serializable value.** [REVIEW] A serializable value is any data structure that React can convert into text, transmit over the network, and rebuild on the receiving side.
> 1. Supported types include primitives like strings, numbers, booleans, and `null`.
> 2. Plain objects and arrays containing only serializable entries are fully supported.
> 3. Custom class instances, DOM references, functions, and standard `Error` objects cannot cross this boundary (Lesson 107).
>
> Every parameter passed into a Server Function and every value returned to the client must remain strictly serializable.

> [!DEFINITION]
> **Error Boundary.** [REVIEW] An Error Boundary is a React component that catches runtime exceptions thrown within its child subtree.
> 1. It implements lifecycle methods to record failures when child components throw during rendering or action dispatching.
> 2. It unmounts the broken subtree and renders an alternative fallback UI.
> 3. It confines failures to isolated regions so the remainder of the application stays mounted and functional (Lesson 72).
>
> An Error Boundary catches unexpected exceptions, including unhandled errors re-thrown by `useActionState`.

> [!DEFINITION]
> **Hydration.** [REVIEW] Hydration is the process where React attaches event listeners to server-rendered HTML.
> 1. The server generates and delivers static HTML so visitors read content immediately.
> 2. The client downloads and parses the JavaScript bundle in the background.
> 3. React inspects the existing DOM structure and attaches event listeners such as `onClick` and `onSubmit` (Lesson 104).
>
> Before hydration completes, only native browser behaviors like standard link navigation and native form submissions work.

### Where Readers Usually Go Wrong

1. **They return an error object while retaining `<form action={subscribe}>`.** They expect the returned error to render automatically. However, the native form element is the caller, and native HTML forms do not store JavaScript return values in state.
2. **They keep the single-argument signature from Lesson 112.** When wrapped in `useActionState`, React supplies the previous state as the first argument and form data as the second. A parameter named `formData` in the first position receives the previous state instead of input entries.
3. **They throw an exception for a validation issue, or return a raw `Error` instance.** Throwing an exception unmounts the form and displays a generic fallback screen. Returning an `Error` instance fails because class instances are not serializable text, causing React to reject the value during render.

### The Two Questions to Ask

**For every Server Function, ask: which caller receives the returned value?** If a native form element receives the response directly, the data is lost. Wire the Server Function through `useActionState` so React stores the returned value in component state.

**Then ask: can the user fix this issue by editing their submission?** If user input can resolve the issue, return a descriptive data object. If an unexpected system failure occurred, throw an exception so the nearest Error Boundary catches it.

### Four Ways to Show a Server Function's Answer

When presenting the outcome of a Server Function, developers choose between four distinct strategies. Each pattern addresses a specific operational requirement:

```tree caption="Four ways to show a Server Function's answer, and the job each one fits."
Four ways to show a Server Function's answer
- +Our own handler with `useState` [`await subscribe` `setError`] | Our code calls the Server Function and **sets the message by hand** | Fits a button that is **not in a form**; does **nothing before hydration**
- +`useActionState` with the Server Function [`useActionState` `formAction`] | React keeps the **last returned value** as state | Fits **a form that shows its last answer**, even **before JavaScript loads**
- +The Server Function straight in `action` [`action={subscribe}`] | The form calls the Server Function and **keeps no answer** | Fits a form with **nothing to show** except the emptied field
- !A thrown error caught by an Error Boundary [`throw` `ErrorBoundary`] | The **fallback** replaces the part that failed | Fits only **unexpected failures**, never a refusal the user can fix
```

This lesson implements the second strategy. Along the way, it explains why the third strategy drops return data, and demonstrates when the fourth approach is required.

## SECTION | The Newsletter Form Under a Blog Post

Here is what the user must see after subscribing a second time with the same email:

```page caption="What the user must see after subscribing a second time with the same email."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email |
  error: john@example.com is already subscribed.
  submit: Subscribe
```

We keep the files of the newsletter form from Lesson 112. Three of them change, and the Error Boundary of Lesson 72 joins in Principle 4:

```files title="blog: the newsletter form" caption="The files of the newsletter form. db.js, actions.js, and SubscribeBox.jsx change in this lesson, and ErrorBoundary.jsx joins in Principle 4."
src/
  db.js | stand-in | Plays the database; gains `db.subscribers.has(email)`, which says whether the email is already saved
  actions.js | Server Functions | Starts with `'use server'`; `subscribe` returns `{ error }` or `{ message }`
  SubscribeBox.jsx | Client Component | Gains `'use client'` and `useActionState`, and shows the answer under the email field
  ErrorBoundary.jsx | from Lesson 72 | The class component that shows a fallback when a child throws; gains `'use client'`
  App.jsx | Server Component | Renders the post and `<SubscribeBox />`, wrapped in `<ErrorBoundary>` in Principle 4
```

The button still shows no pending indicator while the network request is in flight. A button that inspects the pending status of its enclosing form arrives in the next lesson (Lesson 114).

**PRINCIPLES:** A Server Function communicates results through its return value, and a form relies on `useActionState` to store that feedback. Five principles follow:
1. **`action={subscribe}`: the form is the caller, so the returned refusal reaches no code of ours.** The answer comes back to the browser, React empties the email field as after a success, and nothing shows the refusal.
2. **`useActionState`: whatever the Server Function returns becomes `state`.** The Server Function receives the previous state first and the form data second.
3. **`state.error`: the refusal appears exactly where the component writes it.** Under the email field, the user knows at once which field is wrong.
4. **`throw` in a Server Function: the error skips `state` and reaches the nearest Error Boundary.** The fallback replaces the whole form, so throw only failures the user cannot fix.
5. **`useActionState` with a Server Function: the refusal appears even before JavaScript loads.** The server renders the page again with the answer already under the email field.

---

## PRINCIPLE | `action={subscribe}`: the form is the caller, so the returned refusal reaches no code of ours

> [!PRINCIPLE]
> **Principle 1: The Caller Gets the Answer: `action={subscribe}` Drops the Server's Refusal**
>
> *A Server Function returns data directly to its caller; when a form invokes it through `action={subscribe}`, no component state captures the response.*
>
> The server returns the validation failure, and React transmits the object back to the browser. However, the native form element invoked the action, and native forms do not retain return values. Returning a data object completes the action without raising an exception. Because the action completed without throwing an error, React considers the submission successful and resets uncontrolled form inputs. The email field empties, leaving the user without any error message.
>
> **DO THIS:**
> ```jsx
> const [state, formAction] = useActionState(subscribe, { error: null });
> <form ~action={formAction}~> {/* useActionState keeps what subscribe returns */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <form ~action={subscribe}~> {/* **WRONG:** subscribe returns { error }, and no code of ours ever reads it */}
> ```

### `subscribe` Gains the Duplicate Check

To reject duplicate registrations, the server must first determine whether an address is already recorded. Our stand-in database introduces a new helper method named `has`:

```js title="src/db.js"
const subscribers = [];

export const db = {
  subscribers: {
    async ~has~(email) { // New: true when the email is already saved
      return subscribers.includes(email);
    },
    async add(email) {
      subscribers.push(email);
    },
  },
};
```

The `subscribe` action now verifies the email before creating a new record. When the address already exists, it returns a validation error:

```js title="src/actions.js"
'use server';

import { db } from './db';

export async function subscribe(formData) {
  const email = formData.get('email');
  if (await db.subscribers.has(email)) {
    ~return { error: `${email} is already subscribed.` };~ // The refusal, sent back to whoever called subscribe
  }
  await db.subscribers.add(email);
}
```

The component structure from Lesson 112 remains initially unmodified, delegating directly to `subscribe`:

```jsx title="src/SubscribeBox.jsx"
<form ~action={subscribe}~> {/* Unchanged from Lesson 112: the form is the caller */}
  <label>
    Your email
    <input name="email" />
  </label>
  <button type="submit">Subscribe</button>
</form>
```

### The Second Click With the Same Email

**The server rejects the duplicate email, yet the user interface looks identical to a successful signup.** The validation response reaches the client browser, but no component element displays it. Here is the sequence when a user submits `john@example.com` a second time:
1. React gathers the form entries and dispatches an HTTP request executing the server function (as seen in Lesson 112).
2. The server database check confirms the email already exists, prompting the function to return a rejection object.
3. React serializes that return value and transmits the response payload back to the browser.
4. No component code captures the payload. The native form dispatched the call, and native form elements do not store return data.
5. Because the server function returned data rather than throwing an exception, React treats the submission as successful. React resets uncontrolled inputs, leaving an empty field with no feedback (as seen in Lesson 45).

```page caption="The page after the second click with the same email: an empty field and no line, exactly as after a real signup."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email | | bad
  submit: Subscribe
```

### The Mistake: Returning an Answer That Nothing Reads

A developer implements the duplicate email check, returns the error object, and verifies the form:
1. The developer submits a brand new email address. The input field resets, which appears correct.
2. A QA tester enters that exact email a second time. The input field empties again, but no validation message appears.
3. The developer checks browser logs and finds zero error entries. The server function executed without throwing an exception. It simply returned an object that no component state captured.

The solution is to allocate component storage for that returned data. That storage is managed by the `useActionState` Hook.

Remember: a function returns values directly to its caller. With `<form action={subscribe}>`, the form element is the caller, and native forms discard return values.

---

## PRINCIPLE | `useActionState`: whatever the Server Function returns becomes `state`

> [!PRINCIPLE]
> **Principle 2: useActionState: The Server Function's Answer Becomes state**
>
> *Pass the Server Function to `useActionState` inside a Client Component, assign the resulting `formAction` to the form, and structure the action as `subscribe(previousState, formData)`.*
>
> `useActionState` operates consistently whether the action executes locally or across the network. When paired with a Server Function, React transmits submitted data to the server, executes the server logic, and brings back a serialized return value. That value becomes component state, triggering a re-render. The component calling the Hook must declare `'use client'`, and its initial state must remain serializable.
>
> **DO THIS:**
> ```js
> export async function subscribe(~previousState, formData~) { // React passes the last state first, the form data second
>   const email = formData.get('email');
> ```
>
> **DO NOT DO THIS:**
> ```js
> export async function subscribe(~formData~) { // **WRONG:** with useActionState, this parameter receives the previous state
>   const email = formData.get('email');
> ```

### What `useActionState` Does, in Plain JavaScript

Think of `useActionState` as an internal state container that React manages on your behalf. On every form submission, React executes the equivalent of two straightforward lines:

```js title="What useActionState does on every submit, written as plain JavaScript"
let state = ~{ error: null }~; // The starting value, before any submit
state = await ~subscribe(state, formData)~; // The last answer goes in, and the new answer comes out
```

React then re-renders the component using the updated state, ensuring the interface reflects the latest response. You never call a manual state setter. The return value of the Server Function acts as the state update.

### VS | An Action in the Browser vs. a Server Function: the same Hook, the same `state`

In Lesson 42, the action executed as client-side code in the browser. Here, the action is the Server Function `subscribe`, imported from the actions module:

```jsx title="With the action written in the browser"
async function signup(previousState, formData) {
  return { message: 'You are subscribed!' };
}

const [state, formAction] = useActionState(~signup~, { error: null }); // React calls signup in the browser
<form action={formAction}>
```

```jsx title="With the Server Function imported from actions.js"
import { subscribe } from './actions';

const [state, formAction] = useActionState(~subscribe~, { error: null }); // React calls subscribe on the server, with the same two arguments
<form action={formAction}>
```

**Yes, the component mechanics are identical.** From the component's perspective, the workflow does not change. You invoke the same Hook, receive state alongside an action handler, and pass that action to the form. Whatever the action returns becomes updated state. The `useActionState` Hook manages state transitions regardless of where the action executes.

The primary difference is the network boundary separating client and server. Submitted entries travel to the server as serialized payloads, and the return value returns through the same transport mechanism. Consequently, every value handled by `useActionState` across this boundary must be serializable, including its initial state.

The official React documentation states: "When using Server Functions, `initialState` needs to be serializable." Our initial state of `{ error: null }` is a plain JavaScript object, fulfilling that requirement.

```tree caption="The action in the browser and the Server Function share everything in the component, and differ only in where the action runs."
`useActionState` with two kinds of action
- +The action in the browser [`signup`] | React calls it with **previousState, formData** | The returned value **becomes state**
- +The Server Function [`subscribe`] | React calls it **on the server** with the same two arguments | The returned value **travels back serialized** and **becomes state**
```

### Two Changes in Our Files

First, the server action function gains an extra initial parameter representing previous state, placing form entries second. The function also returns a confirmation message upon successful completion:

```js title="src/actions.js"
'use server';

import { db } from './db';

export async function subscribe(~previousState, formData~) { // React passes the last state first
  const email = formData.get('email');
  if (await db.subscribers.has(email)) {
    return { error: `${email} is already subscribed.` };
  }
  await db.subscribers.add(email);
  ~return { message: 'You are subscribed!' };~ // New: the answer for a successful signup
}
```

Our application code never passes the previous state argument directly. React supplies that argument during invocation. On the initial submission, it equals the initial state `{ error: null }`. On subsequent submissions, it contains whatever the function returned on the previous run (as seen in Lesson 42).

Second, the component invokes `useActionState`. The form element now points to the generated `formAction` instead of the raw server reference:

```jsx title="src/SubscribeBox.jsx"
~'use client'~; // useActionState is a Hook, so this file must be client code

import { useActionState } from 'react';
import { subscribe } from './actions';

export default function SubscribeBox() {
  const [state, formAction] = ~useActionState(subscribe, { error: null })~; // state holds what subscribe returned last
  return (
    <section>
      <h2>Get new posts by email</h2>
      <form ~action={formAction}~> {/* The form now calls the function React returned */}
        <label>
          Your email
          <input name="email" />
        </label>
        <button type="submit">Subscribe</button>
      </form>
    </section>
  );
}
```

The `formAction` identifier represents the wrapped handler returned by `useActionState`. When a user submits, React dispatches the call to the server, awaits the response, and stores the return value in state.

The rendered output has not changed yet. The component stores the response in state, but does not display it anywhere. Principle 3 introduces the interface elements needed to show that feedback.

### Two Lines That Surprise Readers of Lesson 112

**The component file requires the `'use client'` directive.** In Lesson 112, `SubscribeBox` was a Server Component because a form passing a raw Server Function to `action` requires no Hooks. Here it invokes `useActionState`, and React Hooks execute exclusively within Client Components (as seen in Lesson 108). React documentation confirms that `useActionState` can only be invoked in client code.

**The Server Function continues to run exclusively on the server runtime, even when imported by a Client Component.** The `'use server'` directive at the head of the actions file establishes every exported function as a Server Function. The client JavaScript bundle receives only an opaque network reference to `subscribe`, rather than its underlying code (as seen in Lesson 110). As a result, server logic and direct database queries remain securely on the server.

### VS | `subscribe(formData)` vs. `subscribe(previousState, formData)`: the form data moves to second place

With `useActionState`, form inputs move into the second parameter position:

```js title="With formData alone and with previousState first"
async function subscribe(~formData~) {} // Lesson 112: formData is the first argument
async function subscribe(~previousState, formData~) {} // With useActionState: formData is the second argument
```

**While this looks like a minor parameter addition, the difference is critical.** As React documentation notes, an action managed by `useActionState` receives an additional first argument representing the previous or initial state. The submitted form entries shift into the second argument position.

### The Mistake: Keeping the One Parameter of Lesson 112

A developer wraps the existing `subscribe` function in `useActionState`, but neglects to update its parameter list. The subsequent submission fails on the server without saving data:
1. React invokes the action, supplying the previous state as the first argument.
2. The single parameter named `formData` receives `{ error: null }`, which is a plain JavaScript object.
3. Plain objects do not have a `get` method, causing the server runtime to throw a `TypeError` when reading form data.
4. Execution aborts immediately before checking or inserting records.

The fix requires declaring both parameters in order, even when the function body ignores the first argument:

```js title="src/actions.js"
export async function subscribe(~previousState, formData~) { // formData is now the second argument
  const email = formData.get('email');
```

Remember: `useActionState` preserves the previous return value and passes it as the first argument to every subsequent action invocation.

---

## PRINCIPLE | `state.error`: the refusal appears exactly where the component writes it

> [!PRINCIPLE]
> **Principle 3: Known Errors: Return the Refusal as State and Show It Next to Its Field**
>
> *Return anticipated validation errors as structured state, such as `{ error: '...' }`, and render `state.error` directly adjacent to the input it describes.*
>
> The server determines the validation message, while the client component determines where that feedback renders. React transports the returned object across the network, updates component state, and initiates a re-render without requiring manual setters. Initialize `useActionState` with a matching shape like `{ error: null }` so initial render passes safely evaluate properties.
>
> **DO THIS:**
> ```jsx
> <input name="email" />
> ~{state.error && <p>{state.error}</p>}~ {/* The refusal appears under the field it is about */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const [state, formAction] = useActionState(subscribe, ~null~); // **WRONG:** state.error throws a TypeError on the first render
> ```

### The Server Decides the Words, the Component Decides the Place

The server controls the exact text of the validation message, while the client component controls its layout position. Here is the entire composition in four concise lines:

```jsx title="The answer placed next to what it is about"
<input name="email" />
~{state.error && <p>{state.error}</p>}~ {/* The refusal: right under the email field */}
<button type="submit">Subscribe</button>
~{state.message && <p>{state.message}</p>}~ {/* The thanks: under the button */}
```

When `state.error` contains text, the paragraph beneath the input field renders (as seen in Lesson 10). When that property evaluates to `null`, React renders nothing in that location.

> [!DEFINITION]
> **Known error.** [NEW] A known error is an anticipated validation condition that a user can correct through adjusted input.
> 1. Common examples include duplicate email addresses, invalid zip codes, or missing required fields.
> 2. Official React guidance recommends returning known errors as part of action state to display feedback in the UI.
> 3. Developers also classify these as validation errors because the server checks or validates incoming user submissions (Lesson 113).
>
> Returning validation feedback as state keeps the component mounted and responsive so the user can easily update their entries.

From React's perspective, rendering `state.error` immediately beneath an input or at the bottom of a form makes no difference. React simply draws JSX wherever you place it.

From the user's perspective, placement is paramount. A targeted message directly below the problematic field immediately clarifies what went wrong. A generic message at the bottom of a lengthy form forces the user to guess which entry caused the failure.

### Placing the Two Lines in `SubscribeBox`

The component adds one line under the email field, and another line beneath the submit button:

```jsx title="src/SubscribeBox.jsx" startLine="10"
      <form action={formAction}>
        <label>
          Your email
          <input name="email" />
        </label>
        ~{state.error && <p>{state.error}</p>}~ {/* Under the field it is about */}
        <button type="submit">Subscribe</button>
        ~{state.message && <p>{state.message}</p>}~ {/* Under the button */}
      </form>
```

When the component mounts initially, `state` equals `{ error: null }`. Because both conditional expressions evaluate to false or null, neither feedback paragraph renders. The visitor sees only the input field and the submit button.

### The First Click and the Second Click

**The server determines the rejection message, and it appears under the input field without manual setters in our code.** React transports the returned object, updates component state, and triggers a re-render. Here is the lifecycle for an initial submission with an unregistered email:
1. The user enters `john@example.com` and clicks Subscribe.
2. React invokes `subscribe` on the server, passing `{ error: null }` as the previous state alongside the form data.
3. Because the email address is not yet registered, the server function stores it and returns an object containing the success message.
4. React receives the payload, assigns it as new state, and re-renders the component. The confirmation message renders below the button.
5. Because the server function completed without throwing an exception, React considers the submission successful and resets uncontrolled inputs (as seen in Lesson 45).

```page caption="The page after the first click: the email is saved, and the thanks line appears under the button."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email |
  submit: Subscribe
line: You are subscribed! | good
```

Later, the user enters that exact same email address again:
1. The user enters `john@example.com` and clicks Subscribe.
2. React calls `subscribe`, and this time the previous state argument holds the confirmation object from the earlier submission.
3. The server database check confirms the email already exists, prompting the function to return a rejection object.
4. React assigns this object as the active state. Because the new state provides an `error` property and no `message` property, the confirmation text disappears, and the rejection message renders under the email field.

```page caption="The page after the second click with the same email: the refusal sits right under the email field."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email |
  error: john@example.com is already subscribed.
  submit: Subscribe
```

Two distinct interface behaviors on this page are handled directly by React rather than manual application code:
- **The previous success message vanishes.** React completely replaces the state object with the new return value. It does not merge properties, so the previous `message` field no longer exists.
- **The input field resets again.** Because `subscribe` returned a data object without throwing an unhandled exception, React treats the action lifecycle as complete and successful. React automatically resets uncontrolled form fields (as seen in Lesson 45). The user still sees their email address mentioned in the error message itself. To retain entered text across resets, you can supply `defaultValue` derived from state (as seen in Lesson 45).

### The Mistake: Starting `useActionState` With `null`

A developer specifies an initial state of `null`, assuming it cleanly represents an absence of responses:

```jsx title="src/SubscribeBox.jsx"
const [state, formAction] = useActionState(subscribe, ~null~); // **WRONG:** state is null on the first render
```

The component still attempts to read `state.error`. During the initial render, the state variable holds null, so attempting to read a nested property crashes JavaScript with a TypeError. The component throws before producing any DOM markup.

Because no Error Boundary wraps the component yet, the unhandled exception unmounts the entire page tree. The visitor sees a blank viewport, and the browser records a crash:

```page caption="The page when the starting value is null: an empty screen, and a TypeError in the Console."
blank
console: TypeError: Cannot read properties of null (reading 'error')
```

The solution is to initialize state with the exact shape returned by the action, matching the structure used in official React examples:

```jsx title="src/SubscribeBox.jsx"
const [state, formAction] = useActionState(subscribe, ~{ error: null }~); // state.error is null, and nothing crashes
```

Remember: the server defines the text of the validation failure. The client component determines its placement, rendering feedback directly next to the input it describes.

---

## PRINCIPLE | `throw` in a Server Function: the error skips `state` and reaches the nearest Error Boundary

> [!PRINCIPLE]
> **Principle 4: Return or Throw: Only a Returned Refusal Becomes state**
>
> *Return recoverable validation issues as plain data objects, and throw only unexpected system exceptions that an Error Boundary must catch.*
>
> A returned data payload becomes component state, rendering wherever your JSX specifies. An unhandled exception never populates state. React intercepts the thrown exception, re-throws it from `useActionState`, cancels any pending submissions in the queue, and prompts the nearest Error Boundary to mount its fallback interface. Because data crossing the network must remain serializable, return descriptive error strings rather than native JavaScript `Error` objects.
>
> **DO THIS:**
> ```js
> if (await db.subscribers.has(email)) {
>   ~return { error: `${email} is already subscribed.` };~ // The user can fix it, so it becomes state
> }
> ```
>
> **DO NOT DO THIS:**
> ```js
> if (await db.subscribers.has(email)) {
>   ~throw new Error(`${email} is already subscribed.`);~ // **WRONG:** the fallback replaces the whole form
> }
> ```

### `throw` in Plain JavaScript Jumps to the Nearest `catch`

Recall how `throw` operates in plain JavaScript. When an exception occurs, execution halts immediately and jumps directly to the nearest enclosing `catch` block:

```js title="Plain JavaScript: throw skips every line until the nearest catch"
try {
  ~throw new Error('The database is not answering')~; // Jumps straight to catch
  console.log('Saved'); // Never runs
} catch (err) {
  console.log(err.message); // Logs The database is not answering
}
```

Standard JSX components do not wrap themselves in individual try and catch statements. In React applications, an Error Boundary serves that defensive role. It intercepts thrown exceptions from child components and displays fallback markup in place of the crashed subtree (as seen in Lesson 72).

### VS | `return { error }` vs. `throw new Error()`: both stop `subscribe`, only the returned value becomes `state`

Up to this point, our server returned validation issues that the user could resolve by submitting different input. Now consider an unexpected system outage: the database server is completely unreachable. The Server Function can halt execution in two distinct ways:

```js title="Returning the refusal and throwing it"
~return { error: `${email} is already subscribed.` };~ // Becomes state: the line appears under the email field
~throw new Error('The database is not answering');~ // Never becomes state: the Error Boundary shows its fallback
```

Both approaches halt the execution of the Server Function, and both communicate that an operation did not succeed. While they seem similar on the surface, their runtime behaviors diverge completely:
- **With `return { error }`**, the returned payload travels back across the network and becomes updated state, rendering an in-place validation message.
- **With `throw`**, no state update occurs. React re-throws the exception inside `useActionState`. The closest parent Error Boundary catches the failure and unmounts the form, displaying fallback content.

Official React documentation emphasizes this separation: handle expected validation issues by returning state, and reserve thrown exceptions for unexpected conditions. When an unexpected error occurs, React cancels queued actions and exposes the nearest Error Boundary by re-throwing the error from `useActionState`.

```tree caption="A returned refusal and a thrown error both stop subscribe, and they land in two different places."
Two ways for `subscribe` to say no
- +Return the refusal [`return { error }`] | The value **becomes state** | The line appears **under the email field**; the user can fix the email
- !Throw an error [`throw`] | React **throws it again** from `useActionState` | The nearest Error Boundary **replaces the form** with its fallback
```

### Wrapping the Form in an Error Boundary

We reintroduce the `ErrorBoundary` component from Lesson 72. The component file requires a `'use client'` directive at the top because `App` is a Server Component, and class components execute only in client environments.

Without that directive, the server fails during component evaluation because the Server Component runtime does not provide a base `Component` class:

```jsx title="src/ErrorBoundary.jsx"
~'use client'~; // New: a class component runs only in client code

import { Component } from 'react';
```

Next, we enclose `<SubscribeBox />` inside the boundary. The fallback property defines user-friendly markup explaining the failure:

```jsx title="src/App.jsx"
import SubscribeBox from './SubscribeBox';
import ErrorBoundary from './ErrorBoundary';

export default function App() {
  return (
    <main>
      <h1>Park Opens Today</h1>
      <p>The city opened a new park on Main Street.</p>
      <ErrorBoundary ~fallback={<p>Could not subscribe. Try again later.</p>}~> {/* Shown if SubscribeBox throws */}
        <SubscribeBox />
      </ErrorBoundary>
    </main>
  );
}
```

The `subscribe` action does not intercept unexpected database errors. When the database throws, the exception escapes `subscribe` as an unhandled error. To observe this in development, we simulate a database crash:

```js title="src/db.js" startLine="8"
    async add(email) {
      ~throw new Error('The database is not answering');~ // A stand-in for a database that is down
    },
```

### The Click While the Database Is Down

**The fallback message replaces the broken form, while the remainder of the article remains intact.** Because an unhandled exception never populates component state, it cannot render inside `SubscribeBox`. Here is the sequence when a visitor submits an email while the database is down:
1. React dispatches the form submission to the server runtime.
2. On the server, the database operation raises an exception, causing the Server Function to reject.
3. The exception is marshaled back to the client browser, where React re-throws it from `useActionState` inside `SubscribeBox`.
4. React cancels any remaining form actions pending in the queue.
5. The nearest Error Boundary wrapped around `<SubscribeBox />` catches the exception and renders its fallback interface.

```page caption="The page after the click while the database is down: the fallback replaces the form, and the article stays."
heading: Park Opens Today
line: The city opened a new park on Main Street.
line: Could not subscribe. Try again later. | bad
console: Error: The database is not answering
console: The above error occurred in the <SubscribeBox> component. React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
```

The fallback message originates from the `fallback` prop supplied to the Error Boundary. The terminal console messages stem from React's development runtime, highlighting the exception and identifying which component triggered it.

Even though the exception was raised on the server runtime, it is caught by an Error Boundary running in the client browser. React achieves this by propagating the failure over the transport stream and re-throwing it from the Hook inside the client component.

### Mistake 1: Returning the `Error` Object Itself

A developer might attempt to display unexpected database errors under the input field by catching the exception and returning the caught object directly:

```js title="src/actions.js"
try {
  await db.subscribers.add(email);
} catch (err) {
  return { error: ~err~ }; // **WRONG:** err is an Error object, not the text of the error
}
```

An `Error` instance is a JavaScript class instance rather than a plain data structure. React documentation defines strict boundaries for allowable Server Function return types. Custom class instances are excluded from that specification, and `Error` objects cannot be transmitted as serialized data.

If you attempt to return a raw `Error` object, two significant defects occur:
1. The `state.error` property holds a class instance, and React cannot render raw objects as JSX children. When the component attempts to render `<p>{state.error}</p>`, React throws a rendering exception, forcing the Error Boundary to take over anyway.
2. In production builds, React automatically strips exception details during network serialization to prevent leaking server vulnerabilities. The client receives only a generic hash rather than your original error text.

The proper approach returns a serializable string by reading the message property from the error object:

```js title="src/actions.js"
} catch (err) {
  return { error: ~err.message~ }; // A string: the line under the email field reads The database is not answering
}
```

### Mistake 2: Throwing for the Known Refusal

The opposite mistake is throwing an exception for an expected validation scenario that the user could easily resolve:

```js title="src/actions.js"
if (await db.subscribers.has(email)) {
  ~throw new Error(`${email} is already subscribed.`);~ // **WRONG:** the fallback replaces the form, and queued submits are cancelled
}
```

When a Server Function throws for an expected validation scenario, the visitor never sees targeted feedback beneath the input field. The Error Boundary unmounts the form and replaces it with generic fallback UI, preventing the user from correcting the email address. React documentation advises catching expected errors and returning structured state rather than throwing.

Remember: returning data updates component state, whereas throwing exceptions invokes the nearest Error Boundary.

---

## PRINCIPLE | `useActionState` with a Server Function: the refusal appears even before JavaScript loads

> [!PRINCIPLE]
> **Principle 5: Before Hydration: The Server Renders the Refusal Into the Page**
>
> *Render the form in a Client Component, wire the Server Function through `useActionState`, and display feedback from state so validation messages render even before client JavaScript downloads.*
>
> Prior to hydration, the browser submits the form using native HTTP POST mechanics, and the server executes the Server Function. The server runtime renders Client Components into HTML during server execution. It renders the form using the returned value as state, returning a complete HTML document with the error message in place. A button relying on an `onClick` handler cannot achieve this because custom handlers exist only after the script bundle loads.
>
> **DO THIS:**
> ```jsx
> const [state, formAction] = useActionState(subscribe, { error: null });
> <form ~action={formAction}~> {/* Before hydration, the server sends the page back with state.error */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <button ~onClick={handleClick}~>Subscribe</button> {/* **WRONG:** before hydration, no handler is attached and nothing is sent */}
> ```

### Old-School Forms: the Server Sends Back a Page With the Error in It

Consider how traditional web forms functioned before client-side scripting became ubiquitous. The browser submitted form data through a native POST request, and the server responded with an entirely new HTML document. If validation failed, the server embedded the error message directly into that returned page. No client JavaScript execution was necessary.

Pairing `useActionState` with a Server Function restores this baseline reliability without requiring custom fallback logic.

### The Same Tap on the Slow Phone

Revisit the visitor from Lesson 112 browsing over a slow cellular connection. The server has delivered initial HTML containing the article and form markup. While the client script bundle downloads in the background, the visitor enters `john@example.com` and taps Subscribe.

The duplicate error appears directly beneath the input field, even though `useActionState` is a React Hook and zero client JavaScript has executed. Official React documentation confirms that when paired with a Server Function, `useActionState` allows server responses to render before hydration finishes.

React specifies three conditions to display action errors without client scripts:
1. The `<form>` element is rendered by a Client Component.
2. The action assigned to the form is a Server Function.
3. The component displays feedback using `useActionState`.

Our `SubscribeBox` component already fulfills all three criteria. This capability requires no additional code, providing built-in resilience across varied network speeds.

### VS | Lesson 112's Form vs. This Form: the same request, only this page comes back with the refusal

Compare the two form designs when submitted prior to script hydration:

```jsx title="Lesson 112's form and this lesson's form"
<form ~action={subscribe}~> {/* Lesson 112: the page loads again with no message */}
<form ~action={formAction}~> {/* With useActionState: the page loads again with the refusal under the email field */}
```

**The outgoing request is identical.** In both architectures, the browser submits the form natively, and the server executes `subscribe` (as seen in Lesson 112).

**The returned HTML is completely different.** Only the form using `useActionState` returns markup containing the error message, because the server renders the component using that returned data as state.

Here is how each implementation behaves when submitted before client scripts finish loading:
1. **A button with a custom click handler** ignores the interaction completely because event listeners arrive only after scripts download (as seen in Lesson 110).
2. **A raw form action** submits natively, but reloads the page with empty fields and no validation feedback (as seen in Lesson 112).
3. **A form using `useActionState`** submits natively and reloads with the validation error rendered directly under the input field.

### How the Line Gets Into a Page That Ran No JavaScript

**The server, rather than the client browser, embeds the rejection message into the rendered document.** Server frameworks render Client Components into static HTML during initial generation (as seen in Lesson 102). Consequently, the server renders `SubscribeBox` using the returned validation result as its active state. Here is the lifecycle in sequence:
1. The browser performs a native form POST containing the entered email, following the mechanism explored in Lesson 112.
2. On the server runtime, the framework invokes `subscribe` with initial state and the received form entries.
3. The server function identifies the duplicate record and returns the rejection object.
4. The server re-renders the component tree with state set to that return value, producing fresh HTML.
5. The browser displays the resulting document. The validation error sits under the input before any client JavaScript runs.

```page caption="The page the server sends back after the tap on the slow phone, before any JavaScript has run."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email |
  error: john@example.com is already subscribed.
  submit: Subscribe
```

Your application code does not manually orchestrate this multi-page submission loop. React frameworks automate this pipeline, matching form submissions to their respective action states.

### The Mistake: Showing the Answer With Our Own Click Handler

A developer attempts to display validation feedback using the client-centric pattern from Lesson 110, attaching a click listener that updates local state with the server response:
1. The workflow functions seamlessly on high-speed development machines where script bundles download instantly.
2. On a congested network, a visitor taps Subscribe before scripts finish downloading. No listener exists, so the submission drops silently (as seen in Lesson 112).
3. By using `useActionState` and assigning its action wrapper to the form, that same tap submits reliably and returns visible validation feedback.

The `useActionState` Hook provides additional benefits for forms submitted prior to hydration. React replays user submissions made while scripts were loading, and supports a permalink URL parameter for progressive enhancement routing (Lesson 137).

Remember: before client JavaScript executes, the server generates the validation message into the returned HTML document, echoing the durability of classic web forms.

---

## All 5 Principles Together

### The Complete Code

The stand-in database, featuring the `has` verification method. The `add` method saves subscribers normally now that testing is complete:

```js title="src/db.js"
const subscribers = [];

export const db = {
  subscribers: {
    async ~has~(email) { // Principle 1: true when the email is already saved
      return subscribers.includes(email);
    },
    async add(email) {
      subscribers.push(email);
    },
  },
};
```

The actions module defines the Server Function, returning structured responses for both success and validation scenarios:

```js title="src/actions.js"
'use server';

import { db } from './db';

export async function subscribe(~previousState, formData~) { // Principle 2: the form data comes second
  const email = formData.get('email');
  if (await db.subscribers.has(email)) {
    ~return { error: `${email} is already subscribed.` };~ // Principle 3: a known error, returned as state
  }
  await db.subscribers.add(email); // Principle 4: a database failure throws to the Error Boundary
  return { message: 'You are subscribed!' };
}
```

The newsletter component is a Client Component that tracks action outcomes in state and renders targeted feedback directly beside the input:

```jsx title="src/SubscribeBox.jsx"
'use client';

import { useActionState } from 'react';
import { subscribe } from './actions';

export default function SubscribeBox() {
  const [state, formAction] = ~useActionState(subscribe, { error: null })~; // Principle 2: state holds the last answer
  return (
    <section>
      <h2>Get new posts by email</h2>
      <form ~action={formAction}~> {/* Principle 5: works before and after hydration */}
        <label>
          Your email
          <input name="email" />
        </label>
        ~{state.error && <p>{state.error}</p>}~ {/* Principle 3: the refusal under the email field */}
        <button type="submit">Subscribe</button>
        {state.message && <p>{state.message}</p>}
      </form>
    </section>
  );
}
```

The Error Boundary is the client class component from Lesson 72, updated with a client directive:

```jsx title="src/ErrorBoundary.jsx"
~'use client'~; // Principle 4: a class component runs only in client code

import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static ~getDerivedStateFromError~(error) { // Principle 4: React calls this when a child throws
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

The top-level application component renders the article layout and wraps the newsletter component in an Error Boundary:

```jsx title="src/App.jsx"
import SubscribeBox from './SubscribeBox';
import ErrorBoundary from './ErrorBoundary';

export default function App() {
  return (
    <main>
      <h1>Park Opens Today</h1>
      <p>The city opened a new park on Main Street.</p>
      <ErrorBoundary ~fallback={<p>Could not subscribe. Try again later.</p>}~> {/* Principle 4: catches a thrown error */}
        <SubscribeBox />
      </ErrorBoundary>
    </main>
  );
}
```

### The Order in Which Things Run

```tree dir=right caption="The order in which the components and the Server Function run, from the first page to the answer under the email field."
From the click to the answer on the screen
- +1. On the server [`App` `ErrorBoundary` `SubscribeBox`] | The framework renders the page to HTML | `state` is **`{ error: null }`**, so no line shows
- +2. The click [`formAction`] | Before hydration, **the browser** posts the form; after it, **React** sends it | `subscribe` runs **on the server** with **previousState, formData**
- +3. The answer [`return` or `throw`] | A returned value travels back and **becomes state** | A thrown error goes to the **Error Boundary**
- +4. The screen [`state.error` `state.message`] | `SubscribeBox` renders again with the new state | The refusal sits **under the email field**, the thanks **under the button**
```

### Summary

| Aspect | What a Developer Might Expect | What React Does |
| :--- | :--- | :--- |
| **A returned error with `action={subscribe}`** | It renders on the page automatically | It returns to the form element which discards it; uncontrolled fields reset on completion |
| **Storage for the response** | A specialized Server Function channel | The standard `useActionState` Hook; the returned payload becomes component state |
| **Parameters of `subscribe`** | Only the form data argument | The previous state argument first, and the submitted form data second |
| **Component module type** | Can remain a Server Component | Requires `'use client'` because `useActionState` is a React Hook |
| **Feedback placement** | Determined globally by the server | Positioned wherever the component renders `state.error`, such as directly beneath the input |
| **Initial state value** | `null`, indicating no prior submission | `{ error: null }`, matching the returned data shape and remaining fully serializable |
| **A thrown exception** | Renders beneath the input field | Bypasses component state entirely; the nearest Error Boundary catches it and renders fallback UI |
| **Returning an `Error` instance** | Forwards the error object to the client | Fails because class instances cannot render as JSX children; return `err.message` instead |
| **Submissions before hydration** | Fails because Hooks require JavaScript | The server renders the returned validation state directly into the generated HTML document |

Remember the central rule of this lesson. **A Server Function delivers feedback by returning data, and `useActionState` stores that data in state. Return validation issues the user can fix, and throw unexpected infrastructure exceptions.**

---

## For the Interview

> **The Interview Question:** How do a Server Function's return values and errors reach the UI?

### How to Answer Clearly in 30 Seconds

"A Server Function communicates outcomes through its return value. React serializes that value on the server and transmits it to the client. However, that data only reaches the UI if component state captures it. If a form invokes a Server Function directly through `action={subscribe}`, the native form element discards the return value. To display feedback, wire the Server Function through `useActionState` in a Client Component and pass its resulting `formAction` to the form.
1. **The Server Function receives `previousState` first and `formData` second**, and whatever it returns becomes updated component state.
2. **Known validation errors are returned as plain data**, allowing the component to render `state.error` directly adjacent to the input field.
3. **Unexpected infrastructure failures are thrown as exceptions.** React re-throws them inside `useActionState`, aborts pending actions, and prompts the nearest Error Boundary to mount fallback UI.

Because data crosses the network, return serializable strings rather than native `Error` instances. With this pattern, the server can render validation errors into HTML even before client scripts load."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why not throw an error for every failure and catch it in an Error Boundary?"**
   Because an Error Boundary replaces the failed subtree with fallback markup. For a recoverable issue like a duplicate email, the user loses the form and cannot submit corrections. React also aborts any queued form actions. React documentation recommends catching expected errors within the action and returning error state. Reserve thrown exceptions for unexpected infrastructure crashes.

2. **"What can a Server Function return?"**
   Only serializable values: strings, numbers, booleans, `null`, and plain objects or arrays composed of those types. Class instances like `Error` are not supported, so return `err.message` instead of `err`. The `initialState` parameter of `useActionState` must also remain serializable. The action can return a single string or an object with descriptive properties.

3. **"Can the browser check the email instead, with `required` on the email field?"**
   Client validation improves responsiveness, but cannot replace server validation for two reasons. First, checking existing subscribers requires direct database access. Second, external clients can dispatch HTTP requests directly to endpoints without using our client form. React documentation notes that Server Function arguments are client-controlled and must be treated as untrusted input (Lessons 130 and 162).

```tree dir=right caption="Interview comparison: where a returned answer and a thrown error land."
Where a Server Function's answer lands
- +A returned value [`return { error }`] | Travels back **serialized** | Becomes **state**; the component shows it **next to its field**
- !A thrown error [`throw`] | React **throws it again** from `useActionState` | The nearest **Error Boundary** shows its fallback
```
