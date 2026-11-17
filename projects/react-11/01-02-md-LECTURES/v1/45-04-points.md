# Lecture 45: Form Resets, requestFormReset, and Progressive Enhancement

*(When you click Submit, why does React empty your form, and how do you keep what the user typed?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do React 19 form actions manage automatic form resets, manual requestFormReset, and progressive enhancement?

---

## 1. You Push Send: What Happens to the Page and to the Text in the Boxes?

### 1.1 You push Send in classic HTML ➔ the whole page reloads, and every box comes back empty

In plain HTML, `<form action="/signup">` treats submitting a form like navigating to a new link. The browser packages your named inputs into an HTTP request, discards the current document, and renders a fresh HTML page from the server. Every `<input>` starts empty because it is a newly created element on a brand-new page.

```html title="index.html"
<form ~action="/signup"~ method="post"> <!-- Navigates to /signup and loads a fresh HTML document -->
  <input name="username" />
  <button type="submit">Submit</button>
</form>
```

> **Classic HTML** ➔ browser loads a fresh page ➔ new `<input>` elements start empty.

### 1.2 You push Send in plain JavaScript ➔ the page stays open, and your text stays in the boxes unless you clear it

In single-page apps, we handle `onSubmit` and call `e.preventDefault()` to cancel that browser navigation while JavaScript sends the data in the background. Because the exact same `<input>` elements stay mounted in the DOM, every character the user typed remains inside them after **Submit**. Clearing those live DOM nodes requires calling `reset()` explicitly:

```js title="signup.js"
function handleSubmit(e) {
  ~e.preventDefault()~; // Cancels page navigation so the current DOM stays mounted
  sendDataToServer(e.currentTarget);
  ~e.currentTarget.reset()~; // Explicitly clears the live <input> elements
}
```

> **Plain JavaScript** ➔ `e.preventDefault()` keeps the DOM mounted ➔ text stays until you call `reset()`.

### 1.3 You push Send in React 19 ➔ the page stays open, AND React clears every box for you

React 19 lets you pass a function straight to `<form action={save}>` (Lesson 41). When the user clicks **Send**, React cancels the browser reload automatically and packs every named input into a `FormData` object. React then passes that object straight into `save`:

```jsx title="src/App.jsx"
export default function CommentForm() {
  return (
    <form ~action={save}~> {/* Cancels reload, passes FormData to save, and resets every input when save finishes */}
      <input name="comment" />
      <button type="submit">Send</button>
    </form>
  );
}
```

Once `save` finishes running, React triggers an automatic reset on the `<form>`. You did not need to call `e.preventDefault()` to keep the page open, and you did not need to call `reset()` to clear the inputs.

> **React 19 `<form action>`** ➔ runs `save` on the open page ➔ resets every uncontrolled input when `save` finishes.

### 1.4 Where automatic clearing fits: single-shot inputs like a blog comment box

For one-box actions like posting a comment under an article, automatic clearing matches what the user expects. Their new comment appears in the list below, and the freshly emptied box confirms that the message went through.

### 1.5 Where we do NOT want automatic clearing: multi-field forms when validation fails

> [!WARNING]
> **Multi-field validation errors:** On a sign-up form with username, email, and contact details, a single rejected field should leave every box intact so the user can edit one word and submit again. Because React resets the whole form anyway, valid fields get wiped right alongside the rejected one.

---

## SECTION | 2. When the Server Rejects an Input: Getting the Error Message onto the Screen

To trace every step clearly, let us add a small server helper in our API file. It waits one second, rejects the taken username `john`, and accepts every other username:

```js title="src/api.js"
const takenUsernames = ['john'];

export function createAccount(username) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (~takenUsernames.includes(username)~) { // Rejects john by resolving with an error message string
        resolve('Username ' + username + ' is taken.');
      } else {
        resolve(null);
      }
    }, 1000);
  });
}
```

### 2.1 You push Send with plain `<form action={signUp}>` ➔ both boxes go blank, and no error message appears under the box

Watch what happens if we pass `signUp` directly to `<form action={signUp}>` without connecting any state:

```jsx title="src/App.jsx" bad="4,9"
async function signUp(formData) {
  const username = formData.get('username');
  const error = await createAccount(username); // Server replies: "Username john is taken."
  ~return error~; // **WRONG:** plain <form action> discards whatever value signUp returns
}

export default function App() {
  return (
    <form ~action={signUp}~> {/* **WRONG:** calls signUp(formData), stores no return value, and resets both inputs */}
      <label>Username <input name="username" /></label>
      <label>Email <input name="email" /></label>
      <button type="submit">Create account</button>
    </form>
  );
}
```

Why did that returned error string never reach the screen? Because `<form action={signUp}>` only invokes `signUp(formData)` and discards its return value. Nothing saves that string into React state, so `App` never re-renders with a message below the input, while React still resets both boxes as soon as `signUp` finishes.

### 2.2 You wrap `signUp` in `useActionState` ➔ the error message appears under the box, yet both boxes still go blank

To render the server's reply below the input box, `App` needs that reply stored in React state. Since `signUp` receives the submitted form data and awaits the server's answer, we pass that function into `useActionState` (Lesson 42). React gives back `[message, formAction]`, and submitting the form forwards the form data into `signUp`. Once the action finishes, React saves its return value into `message` and re-renders `App`:

```jsx title="src/App.jsx" good="14,22" bad="8"
import { useActionState } from 'react';
import { createAccount } from './api.js';

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const error = await createAccount(username);
  if (error) {
    ~return error~; // **WRONG:** updates message in React state, yet leaves no starting text for the reset boxes
  }
  return 'Welcome, ' + username + '!';
}

export default function App() {
  const [message, ~formAction~] = useActionState(signUp, ''); // Wraps signUp so its return value becomes message state

  return (
    <form action={formAction}>
      <h1>Create account</h1>
      <label>Username <input name="username" /></label>
      <label>Email <input name="email" /></label>
      <button type="submit">Create account</button>
      {~message && <p>{message}</p>~} {/* Renders message visibly below the inputs whenever non-empty */}
    </form>
  );
}
```

When the user submits `john` and their email address, `"Username john is taken."` now renders visibly below the button, yet both input boxes still reset to blank:

```page caption="With useActionState returning only message: the error appears below the button, yet both inputs reset to blank."
heading: Create account
form:
  field: Username | | bad
  field: Email | | bad
  submit: Create account
line: Username john is taken. | bad
console: quiet
```

Updating `message` only updates React state. The `<input>` boxes themselves are uncontrolled browser elements, and React still resets them when `signUp` finishes.

### 2.3 Why React still resets the boxes: the user sees a rejected username, whereas React sees a resolved Promise

At the JavaScript runtime level, an async function that reaches `return error` resolves its Promise normally, just like `return 'Welcome!'` does. React checks only whether the action's Promise resolved or threw an error. It cannot read the English words inside `message` to know that `"Username john is taken."` means the sign-up was rejected.

> **Action reaches `return`** ➔ Promise resolves normally ➔ `useActionState` updates `message`, AND React resets every uncontrolled box.

### 2.4 Dead end: you throw an error to stop the reset ➔ instead of keeping the boxes, the entire form disappears from the screen

Since React resets the form whenever the action's Promise resolves, developers often ask what happens if `signUp` rejects its Promise deliberately with `throw new Error(error)`:

```jsx title="src/App.jsx" bad="4"
async function signUp(previousState, formData) {
  const username = formData.get('username');
  const error = await createAccount(username);
  if (error) {
    ~throw new Error(error)~; // **WRONG:** rejects the Promise, skips useActionState, and bubbles to Error Boundary
  }
  return 'Welcome, ' + username + '!';
}
```

We prefer `return` over `throw` for validation because throwing aborts action state updates completely. Instead, React routes the uncaught error up to the nearest Error Boundary (Lesson 72). Without an Error Boundary above `App`, **React unmounts the entire `<form>` from the page** (Lesson 42).

> [!TAKEAWAY]
> **Keep `return` for validation feedback.** Returning keeps the `<form>` mounted and updates `useActionState`. That leaves one focused question for Section 3: how do we make React's automatic reset restore the user's typed text instead of wiping it?

---

## SECTION | 3. Keeping the User's Text Inside the Boxes While Showing the Error Below

### 3.1 What a form reset actually does on screen ➔ it puts each box back to its starting text rather than forcing it blank

In the browser DOM, every `<input>` stores two separate strings: its live text as the user types, and its starting text set by JSX's `defaultValue` prop (Lesson 20). Running a form reset copies `defaultValue` back into the live box:

```jsx title="How a browser reset treats two inputs"
<input name="email" /> {/* defaultValue is "": a form reset empties this box */}
<input name="email" ~defaultValue="john@mail.com"~ /> {/* defaultValue is set: a form reset puts "john@mail.com" back into the box */}
```

Our boxes in Section 2 only went blank because we gave them no `defaultValue`, leaving their starting text as `""`.

### 3.2 You return the submitted text into `defaultValue` ➔ on error, the message appears below AND your text stays in the boxes; on success, every box clears

Why does binding `defaultValue` to `useActionState` solve both rejection and success? Because when `signUp` finishes, React commits the new `state` to the DOM *before* running its automatic form reset in that same update batch:

```jsx title="src/App.jsx" good="11,13,22,23"
import { useActionState } from 'react';
import { createAccount } from './api.js';

const initialState = { message: '', username: '', email: '' };

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const error = await createAccount(username);
  if (error) {
    return ~{ message: error, username, email }~; // Rejection: sets defaultValue to the user's submitted strings
  }
  return ~{ message: 'Welcome, ' + username + '!', username: '', email: '' }~; // Success: sets defaultValue back to empty strings
}

export default function App() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form action={formAction}>
      <h1>Create account</h1>
      <label>Username <input name="username" ~defaultValue={state.username}~ /></label> {/* Reset copies state.username into the box */}
      <label>Email <input name="email" ~defaultValue={state.email}~ /></label> {/* Reset copies state.email into the box */}
      <button type="submit">Create account</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

When `john` is rejected, React updates `defaultValue` to the submitted username and email first, and its immediate reset copies both strings right back into the inputs:

```page caption="On rejection: React commits the new defaultValue first, so the reset restores both typed fields."
heading: Create account
form:
  field: Username | john | good
  field: Email | john@mail.com | good
  submit: Create account
line: Username john is taken. | bad
console: quiet
```

When the user edits `john` to `john7` and submits again, the action returns empty strings for both fields. React updates `defaultValue` to `""` and the exact same reset clears both boxes cleanly:

```page caption="On success: signUp returns empty strings for defaultValue, so the reset clears both boxes."
heading: Create account
form:
  field: Username | | good
  field: Email | | good
  submit: Create account
line: Welcome, john7! | good
console: quiet
```

> **Server rejects** ➔ return submitted fields into `defaultValue` ➔ reset restores text · **Server accepts** ➔ return empty strings into `defaultValue` ➔ reset clears boxes.

### 3.3 Alternative when checking every keystroke live ➔ pairing `value` with `onChange` updates the box on every letter you type

```jsx title="Controlled input: value paired with onChange"
<input name="password" value={password} ~onChange={e => setPassword(e.target.value)}~ /> {/* React state owns the text and re-renders on every keystroke */}
```

Pairing `value` with `onChange` creates a controlled input whose text lives in React state rather than the DOM (Lesson 20). Because React reconciles the input against state on every render, browser form resets leave controlled inputs untouched, while `App` re-renders on every keystroke. We prefer `defaultValue` for standard form fields. Reserve controlled inputs with `onChange` for fields whose UI updates live on each character, such as a password-strength meter (Lesson 40).

### 3.4 Dead end: you pass `value` without `onChange` ➔ text sits in the box, yet pressing keys on your keyboard types nothing on screen

```jsx title="Read-only trap: value without onChange" bad="1"
<input name="email" ~value={state.email}~ /> {/* **WRONG:** overwrites every keystroke back to state.email */}
```

Passing `value={state.email}` without `onChange` locks the DOM input's value after every key event. React discards whatever character the user pressed (Lesson 20) and prints a Console warning:

```page width=full caption="Passing value={state.email} without onChange locks the Email box and prints a React Console warning."
heading: Create account
form:
  field: Username |
  field: Email | | bad
  submit: Create account
console: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
```

---

## SECTION | 4. Handling Submit Yourself with onSubmit: Controlling the Exact Moment the Boxes Clear

### 4.1 Default when you handle `onSubmit` yourself ➔ `"Welcome!"` appears below, while your old text stays stuck in the boxes

Older React forms attach `onSubmit`, cancel navigation, and invoke their action inside `startTransition` (Lessons 11, 41, and 66). Because your handler intercepted the submit event before `<form action>` owned it, React leaves DOM resets to your code. Submitted text stays stuck in the inputs even after success:

```page caption="An onSubmit form with no reset call: Welcome appears below, while submitted text stays in both boxes."
heading: Create account
form:
  field: Username | john7 | bad
  field: Email | john@mail.com | bad
  submit: Create account
line: Welcome, john7! | good
console: quiet
```

### 4.2 Dead end for server validation: calling `form.reset()` wipes the boxes on click, before the server even answers

```jsx title="src/App.jsx" bad="7"
function handleSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  startTransition(() => {
    formAction(new FormData(form));
  });
  ~form.reset()~; // **WRONG:** runs synchronously at 0s while the 1s server request is still pending
}
```

Calling `startTransition` starts the async action without pausing your submit handler, so `form.reset()` on the next line runs synchronously at 0 seconds on click. That resets every box to its *old* `defaultValue` one full second before the server responds, wiping the user's text while validation is still running.

### 4.3 Clearing at the right moment: `requestFormReset` inside `startTransition` waits until the server answers

To match automatic action resets inside an `onSubmit` handler, import `requestFormReset` from React DOM and call it inside the same Transition:

```jsx title="src/App.jsx" good="2,10"
import { useActionState, startTransition } from 'react';
import { ~requestFormReset~ } from 'react-dom'; // Imported from react-dom

function handleSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  startTransition(() => {
    formAction(new FormData(form));
    ~requestFormReset(form)~; // Queues the reset to run when this Transition commits its final state
  });
}
```

Calling `requestFormReset(form)` inside `startTransition` ties the reset to that active Transition. React waits until `signUp` resolves, commits the updated `defaultValue` props from state, and resets the form in that same commit.

> **`form.reset()`** ➔ resets synchronously at 0s on click · **`requestFormReset(form)`** ➔ waits for the Transition to commit updated `defaultValue` first.

### 4.4 Where we prefer instant `form.reset()` over `requestFormReset`: live chat inputs with `useOptimistic`

In a live chat composer using `useOptimistic` (Lesson 44), pressing **Send** appends the message to the visible chat list immediately at 0 seconds before the network responds. There, we prefer synchronous `form.reset()` on click so the typing box clears on the exact same frame and the user can type their next message right away.

---

## SECTION | 5. Pushing Send on Slow Wi-Fi Before JavaScript Finishes Downloading

Suppose a commuter on slow train Wi-Fi receives your HTML in 0.1 seconds. The JavaScript bundle takes 3 seconds to download, and the user taps **Create account** at 0.5 seconds.

### 5.1 Fake form built from `div` tags ➔ you tap Send before JavaScript loads, and nothing happens on screen

Before the JavaScript bundle downloads and hydrates the page, React's `onClick` handlers are not attached to the DOM yet:

```jsx title="Inert markup before JavaScript loads" bad="3"
<section>
  <input value={email} onChange={e => setEmail(e.target.value)} />
  <div ~onClick={handleCreate}~>Create account</div> {/* **WRONG:** plain div has no native submit behavior before JS attaches onClick */}
</section>
```

By contrast, a real HTML `<form>` with named inputs and `<button type="submit">` activates the browser's built-in form submitter natively without waiting for JavaScript (Lesson 40):

```jsx title="Semantic HTML form markup" good="2,3"
<form action={formAction}>
  <input ~name="email"~ defaultValue={state.email} /> {/* Browser includes this value under the key "email" */}
  <button ~type="submit"~>Create account</button> {/* Triggers native browser form submission */}
</form>
```

### 5.2 Client-only app like plain Vite ➔ until JavaScript downloads, the user sees an empty white screen

Even with semantic `<form>` tags in your JSX, a client-only Vite app sends an HTML file containing only an empty `<div id="root"></div>` (Lesson 7). Because React creates the `<form>` DOM nodes in the browser after the 3-second JavaScript bundle arrives, no form exists on screen to tap at 0.5 seconds:

```dom caption="Initial HTML in a client-only Vite app before JavaScript downloads: an empty #root container."
! <div id="root"></div> | note: Empty until the 3-second JavaScript bundle downloads and mounts App
```

### 5.3 Server-rendered form with a browser-only function ➔ the form appears at 0.1s, yet tapping Send still waits on JavaScript

With Server-Side Rendering, the server sends the finished `<form>` HTML at 0.1 seconds so the user can read and fill out the inputs immediately (Lesson 102). However, if `action={clientFn}` points to a function defined only inside your client JavaScript bundle, the raw HTML `<form>` has no server endpoint to reach until that bundle downloads.

### 5.4 Server-rendered form with a server target ➔ tapping Send works at 0.1s AND upgrades to no-reload sends once JavaScript loads

When a server-rendered `<form>` points to a URL string like `"/signup"` or a React Server Function (Lesson 110), the initial HTML carries a live HTTP destination:

```jsx title="Server-reachable form action" good="1"
<form ~action="/signup"~ method="post"> {/* Submits via native HTTP POST before JS loads; upgrades to smooth Transition after hydration */}
  <input name="email" />
  <button type="submit">Create account</button>
</form>
```

Tapping **Create account** at 0.5 seconds submits every named input via a standard browser POST. Once JavaScript finishes loading at 3.0 seconds, React hydrates that same `<form>` and upgrades future submits to smooth Transitions. It even replays submissions queued right before hydration completed (Lesson 137).

> [!DEFINITION]
> **Progressive enhancement.** Delivering a baseline HTML form that submits natively before scripts arrive, and upgrading that same markup to smooth client-side Transitions once JavaScript hydrates, is called **progressive enhancement** (as MDN defines it). Writing `<form>`, `name` on every `<input>`, and `<button type="submit">` even in a Vite app today keeps your markup semantic and ready for Server-Side Rendering later.

---

## SECTION | 6. Complete Reference: Working Code, UI Decision Map, and Interview Answers

### 6.1 Complete Create Account component

Paired with our server helper from Section 2, here is the complete component combining `useActionState`, `defaultValue`, and semantic HTML form tags:

```jsx title="src/App.jsx" good="11,13,20,22,23,24"
import { useActionState } from 'react';
import { createAccount } from './api.js';

const initialState = { message: '', username: '', email: '' };

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const error = await createAccount(username);
  if (error) {
    return ~{ message: error, username, email }~; // Resolves with message + submitted strings for defaultValue
  }
  return ~{ message: 'Welcome, ' + username + '!', username: '', email: '' }~; // Resolves with empty strings so reset clears inputs
}

export default function App() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form ~action={formAction}~> {/* Cancels reload, runs signUp, and resets uncontrolled inputs on completion */}
      <h1>Create account</h1>
      <label>Username <input ~name="username"~ defaultValue={state.username} /></label> {/* Named input; restored on error, cleared on success */}
      <label>Email <input name="email" ~defaultValue={state.email}~ /></label> {/* Preserves valid email when username is rejected */}
      <button ~type="submit"~>Create account</button> {/* Native HTML submit trigger */}
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

### 6.2 UI experience to React mechanism at a glance

| UI Experience You Want | DO THIS | DO NOT DO THIS |
| :--- | :--- | :--- |
| **Keep the page open and clear inputs after a normal submit** | Pass your function to `<form action={fn}>` so React resets uncontrolled inputs when `fn` finishes | Use `<div onClick>` or call `form.reset()` before an async check finishes |
| **Show a server error message below the input box** | Wrap your action in `useActionState` and `return` the message string | Pass `fn` to plain `<form action={fn}>` alone, or run `throw new Error(msg)` which unmounts `<form>` |
| **Keep typed text inside the boxes when validation fails** | Return submitted fields from the action and bind `<input defaultValue={state.email} />` | Pass `<input value={state.email} />` without `onChange`, which locks the keyboard |
| **Reset an `onSubmit` form only after the server responds** | Call `requestFormReset(form)` from `'react-dom'` inside `startTransition` | Call `form.reset()` on click at 0s, unless clearing an optimistic live chat box |
| **Let slow-Wi-Fi users submit before JavaScript loads** | Render `<form>`, `name`, and `<button type="submit">` on the server with a URL or Server Function `action` | Expect a client-only Vite `#root` or a browser-only closure to submit before JavaScript downloads |

---

## For the Interview

> **The Interview Question:** How do React 19 form actions manage automatic form resets, manual requestFormReset, and progressive enhancement?

### How to Answer Clearly in 30 Seconds

"Passing a function to `<form action>` cancels the page reload and passes `FormData` to your function inside a Transition. Whenever that action's Promise resolves, React automatically resets every uncontrolled `<input>` to its `defaultValue`. Because returning a validation message resolves the Promise normally, React still resets the form on server rejections. To show the error and preserve typed fields without throwing into an Error Boundary, wrap the action in `useActionState` and return `{ message, ...fields }`. Binding each input's `defaultValue` to that state commits the updated `defaultValue` before the reset runs, keeping text on error and clearing it on success. For manual `onSubmit` handlers, call `requestFormReset(form)` from `'react-dom'` inside `startTransition` so the reset waits for the Transition to finish. Finally, progressive enhancement works before JavaScript loads when Server-Side Rendering outputs `<form>`, `name`, and `<button type="submit">` backed by a URL or Server Function."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"When our server rejects a taken username, why do our `<form action>` inputs still go blank, and why shouldn't we `throw new Error()` to stop it?"**
   An `async` action that reaches `return error` resolves its Promise normally, and React resets uncontrolled inputs whenever an action's Promise resolves. Throwing with `throw new Error()` rejects the Promise, which skips `useActionState` completely and bubbles the crash to the nearest Error Boundary, unmounting the `<form>` if none exists. Instead, return `{ message, username, email }` from the action into `useActionState` and bind `defaultValue={state.email}`. React updates `defaultValue` first, and its reset copies the user's text right back into the inputs.
2. **"What is the exact runtime difference between `form.reset()` and `requestFormReset(form)`?"**
   Both restore uncontrolled DOM inputs to their `defaultValue`, yet they execute at different times. Calling `form.reset()` inside `onSubmit` runs synchronously at 0 seconds on click while the server check is still pending, which fits only `useOptimistic` chat boxes. Calling `requestFormReset(form)` from `'react-dom'` inside `startTransition` schedules the reset for the Transition's final commit, after `useActionState` updates `defaultValue`.
3. **"Why doesn't `<form action={myFunction}>` work before JavaScript loads in a plain Vite app?"**
   Two reasons: a client-only Vite server sends an empty `<div id="root"></div>` with no `<form>` in the initial HTML, and `myFunction` exists only inside the client JavaScript bundle. Submitting before JavaScript loads requires Server-Side Rendering to send `<form>`, `name`, and `<button type="submit">` HTML backed by a URL or Server Function. Once JavaScript hydrates, React upgrades that same form to smooth Transitions.
