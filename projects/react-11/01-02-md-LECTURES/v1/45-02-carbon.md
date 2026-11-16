# Lecture 45: Form Resets, requestFormReset, and Progressive Enhancement

*(Why does a form forget what the user typed after the server says no, and how do you keep it?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do React 19 form actions manage automatic form resets, manual requestFormReset, and progressive enhancement?

---

## VS | A Refusal for the User vs. a Success for React: React resets the form whenever the action function ends without an error

> **In a React form, a refusal from the server still empties every field, because React resets the form whenever the action function ends without an error. Therefore, you need to write the action function so that it always returns what the user typed, together with the error message.**

Forms reject user input every day: a username is already taken, a discount code has expired, or a hotel date is booked. When the server refuses one field, you expect the form to stay filled so the user can fix one word and submit again. In a React form with an action function, React empties every field anyway. Writing an action function that returns only the error message is a bad practice, because that function ends without an error and triggers React's automatic reset. **Therefore, you need to write the action function so that it returns the submitted field values alongside the error message, and pass them into `defaultValue`.**

Two separate places hold data on a form page, and confusing them causes this bug:
- **The browser** holds what the user typed inside each uncontrolled `<input>` element, alongside that field's default value.
- **React** holds the state returned by the action function.

When the action function ends without an error, React resets the browser's fields back to their default values and never touches React's state.

### Back to `form.reset()`

In plain JavaScript, every `<form>` element has a built-in `reset()` method that puts each field back to its starting text:

```js title="Resetting a form in plain JavaScript"
const form = document.getElementById('signup');
~form.reset()~; // The browser puts every field back to its starting text
```

In Lesson 41, an `onSubmit` handler had to call that method by hand. When JSX passes a function to `<form action>`, React runs that same reset automatically as soon as the action function finishes:

```jsx title="The automatic reset in React"
<form ~action={save}~> {/* React calls save, then resets the form when save ends */}
```

Three building blocks from earlier lessons meet on this form:

> [!DEFINITION]
> **The action of a form.** [REVIEW] In plain HTML, the `action` attribute holds a destination URL, and the browser sends the form there with a full page reload.
> 1. In React 19, `action` also accepts a function: `<form action={save}>`.
> 2. On submit, React stops the page reload, collects every named field into a `FormData` object, and calls `save` inside a Transition.
> 3. When `save` finishes without an error, React resets every uncontrolled field in the form (Lesson 41).

> [!DEFINITION]
> **useActionState.** [REVIEW] Calling `const [state, formAction] = useActionState(signUp, initialState)` connects a form action to React state.
> 1. JSX passes `formAction` to `<form action={formAction}>`.
> 2. On submit, React calls `signUp(previousState, formData)`.
> 3. Whatever value `signUp` returns becomes the new `state`, and React re-renders the component to display it (Lesson 42).

> [!DEFINITION]
> **The default value of a field.** [REVIEW] Every uncontrolled `<input>` element in the browser keeps two separate strings: the current text the user typed, and its default value.
> 1. In React, JSX sets that starting text with `defaultValue="John"`, leaving the browser free to handle keystrokes without re-rendering the component.
> 2. When a form reset runs, the browser discards the typed text and restores each field to its `defaultValue`.
> 3. A field with no `defaultValue` resets to an empty string (Lesson 20).

Automatic resets feel convenient when an action saves a comment or creates an account. Now watch what happens when the server refuses the data.

Picture a Create account form. The user types `john` and `john@mail.com`, then clicks **Create account**:

```page caption="The Create account form after the user has typed a username and an email, before the click."
heading: Create account
form:
  field: Username | john
  field: Email | john@mail.com
  submit: Create account
console: quiet
```

One second later, the server answers that `john` is taken. The error message appears at the bottom, and both fields go blank at the same moment:

```page caption="The same form one second after the click: the refusal line appears above two empty fields."
heading: Create account
form:
  field: Username | | bad
  field: Email | | bad
  submit: Create account
line: Username john is taken. | bad
console: quiet
```

The email address was valid, yet the user must type both fields again.

Why did React clear the fields when registration failed? React never reads the human meaning of the server's message. The action function returned a string and ended without an error, so React counted the action as complete and reset every uncontrolled field to its default value.

```tree caption="How the user and React read the same server answer."
What `Username john is taken.` means
- !For the user | The server **refused the name** | The user expects to **edit one word** and submit again
- +For React | The action function **ended without an error** | React **resets every uncontrolled field** to its default value
```

### How One Strange Line Keeps the Text

You cannot turn off React's reset on `<form action>`, but your JSX controls what each field resets to. Look at the line that keeps the user's email on the screen:

```jsx title="The line that keeps the email after a refusal" good="1"
<input name="email" ~defaultValue={state.email}~ /> {/* The reset restores the email that the action returned */}
```

Before seeing the whole component, notice what looks strange here. Normally, `defaultValue` holds a fixed starting string like `"john@mail.com"`. Here, `defaultValue` reads `state.email`, the value that the action function just returned from the failed submit. React renders the component with that new `defaultValue`, runs its reset, and restores `john@mail.com` right into the field:

```page caption="The Create account form one second after the click, when defaultValue reads from state."
heading: Create account
form:
  field: Username | john | good
  field: Email | john@mail.com | good
  submit: Create account
line: Username john is taken. | bad
console: quiet
```

### The Rule of Thumb: What Is the Default Value After the Action?

**Ask one question about every uncontrolled field inside `<form action>`: what is the default value of this field after the action? After React runs its reset, that default value is what the user sees.**

On a refusal, that default value must hold what the user just typed so the reset puts their text back. On a success, that default value must be empty so the same reset clears the form.

## SECTION | A Create Account Form with a Username and an Email

Our project is a Create account form in a small Vite app with a Username field, an Email field, and a submit button.

```files title="create-account: File Explorer" caption="How the files of our Create account project sit inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it into `#root`
  App.jsx | form | Exports `App` as default and imports `createAccount` from `./api.js`
  api.js | stand-in server | Exports `createAccount`, which waits one second and refuses `john`
```

A small helper in `api.js` stands in for the server. It waits one second, refuses `john`, and accepts every other username:

```js title="src/api.js"
const takenUsernames = ['john'];

export function createAccount(username) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (~takenUsernames.includes(username)~) { // Refuses john with an error string
        resolve(`Username ${username} is taken.`);
      } else {
        resolve(null); // Accepts any other username
      }
    }, 1000);
  });
}
```

**PRINCIPLES:** Two places hold data on this page: the browser holds each uncontrolled field and its default value, while React holds the action state. Five principles follow:
1. **Principle 1: A Successful Action Empties the Form.**
2. **Principle 2: A Returned Error Is a Success for React.**
3. **Principle 3: `defaultValue` From State Puts the Text Back.**
4. **Principle 4: `requestFormReset` Resets a Form Submitted Through `onSubmit`.**
5. **Principle 5: `name` and `type="submit"` Let the Browser Send the Form Alone.**

---

## PRINCIPLE | `action={save}`: React resets every uncontrolled field after save returns

> [!PRINCIPLE]
> **Principle 1: A Successful Action Empties the Form**
>
> *When the function passed to `<form action>` finishes without an error, React resets every uncontrolled field in that form to its default value.*
>
> Your code does not call `form.reset()`, and the browser does not reload the page. React passes the submitted `FormData` to the action function, waits for it to finish, and resets every uncontrolled field in the DOM. Calling `reset()` manually inside an async action is a bad practice because it clears the fields before the server responds.
>
> **DO THIS:**
> ```jsx
> <form ~action={save}~> {/* React calls save, then resets uncontrolled fields when save finishes */}
>   <input name="username" />
>   <button type="submit">Save</button>
> </form>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> async function save(formData) {
>   ~document.getElementById('signup').reset();~ // **WRONG:** clears the fields before await finishes, duplicating React's reset
>   await sendToServer(formData);
> }
> ```

Start with the smallest form that uses `<form action>`: one uncontrolled input, one submit button, and a function that logs the submitted username.

```jsx title="src/App.jsx"
function save(formData) {
  console.log(formData.get('username')); // Logs john from the submitted FormData
}

export default function App() {
  return (
    <form ~action={save}~> {/* React intercepts submit and runs save */}
      <label>Username <input name="username" /></label>
      <button type="submit">Save</button>
    </form>
  );
}
```

The user types `john` and clicks **Save**:

```page caption="Right after the user clicks Save: the Console logs john, and React empties the field."
form:
  field: Username | | good
  submit: Save
log: john | App.jsx:2
```

No line in `App.jsx` cleared the field, and the page never reloaded:
1. The user clicked **Save**, so React intercepted the browser submit and called `save` with `FormData`.
2. The function `save` logged `john` and ended without an error.
3. React reset every uncontrolled field in the `<form>` back to its default value, which was empty.

Notice which fields React resets. A plain `<input name="username" />` is uncontrolled, meaning the browser holds its text (Lesson 40), so the reset clears it. A controlled input with `value` and `onChange` displays React state instead (Lesson 20). Because a DOM form reset never changes React state, controlled fields keep whatever their state variable holds.

---

## PRINCIPLE | `return error`: the refusal line appears, and React still resets the form

> [!PRINCIPLE]
> **Principle 2: A Returned Error Is a Success for React**
>
> *An action function that returns an error message resolves normally without throwing, so React displays the message from state and resets uncontrolled fields at the same moment.*
>
> Expected validation errors such as a taken username belong in return values so `useActionState` can render them on screen. However, returning only the error string is a bad practice on uncontrolled forms because React treats any non-throwing return as a completed action and empties every field. Trying to block that reset with `throw new Error()` is worse: React skips state and hands the exception to the nearest Error Boundary.
>
> **DO THIS:**
> ```jsx
> if (error) {
>   ~return error;~ // React stores error as state; Principle 3 restores the typed fields
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> if (error) {
>   ~throw new Error(error);~ // **WRONG:** skips state and crashes into the nearest Error Boundary
> }
> ```

Now connect the form component to `createAccount` through `useActionState` so the page displays the server's answer below the button:

```jsx title="src/App.jsx" bad="8"
import { useActionState } from 'react';
import { createAccount } from './api.js';

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const error = await createAccount(username);
  if (error) {
    ~return error;~ // **WRONG:** returns only the message, so React resets both fields to empty
  }
  return `Welcome, ${username}!`;
}

export default function App() {
  const [message, formAction] = useActionState(signUp, '');

  return (
    <form action={formAction}>
      <h1>Create account</h1>
      <label>Username <input name="username" /></label>
      <label>Email <input name="email" /></label>
      <button type="submit">Create account</button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

When the user submits `john` and `john@mail.com`, this component produces the broken screen from the opening. The refusal message appears at the bottom while both inputs go blank:
1. **In React's state**, `signUp` returned the refusal string, so `message` holds it and the paragraph below the button renders it.
2. **In the browser's fields**, `signUp` returned normally instead of throwing an exception, so React ran its form reset and restored both uncontrolled fields to empty strings.

The Console stays silent because nothing crashed. If you test only with a free username like `john7`, you see `Welcome, john7!` below two empty fields and ship the bug to production without noticing it.

### VS | `return error` vs. `throw new Error(error)`: React stores only a returned value as state

A developer who spots the unwanted reset might try throwing an exception in `signUp` to stop React from counting the action as a success. Throwing stops the reset, and destroys the form along with it:
- **With `return error`**, React stores the string in `useActionState`, renders the feedback message, and resets the uncontrolled fields.
- **With `throw new Error(error)`**, React never updates `useActionState`. It sends the thrown error to the nearest Error Boundary (Lesson 72), and with no Error Boundary above `App`, React unmounts the whole page (Lesson 42).

Server validation failures are expected answers, not crashes. Keep `return`, and give the reset the right `defaultValue` in Principle 3.

---

## PRINCIPLE | `defaultValue` from state: the reset puts back what the user typed

> [!PRINCIPLE]
> **Principle 3: defaultValue From State Puts the Text Back**
>
> *To preserve user input after a server refusal, write the action function to return the submitted field values in its state object, and pass each value to `defaultValue`.*
>
> React renders the new action state before running the post-action reset on the DOM. When a refusal returns `{ message: error, username, email }`, each `<input>` receives the user's text as its new `defaultValue`, and the reset restores that text onto the screen. When registration succeeds, the action returns empty strings, and the same reset clears the form.
>
> **DO THIS:**
> ```jsx
> <input name="email" ~defaultValue={state.email}~ /> {/* Restores john@mail.com on refusal, clears on success */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <input name="email" ~value={state.email}~ /> {/* **WRONG:** value without onChange locks the input */}
> ```

### The State Becomes One Object

Instead of a single message string, `useActionState` now stores one object with three properties: the message, the username, and the email. On a refusal, `signUp` returns the submitted strings; on a success, `signUp` returns empty strings for both fields:

```jsx title="src/App.jsx" startLine="4" good="9,11"
const initialState = { message: '', username: '', email: '' };

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const error = await createAccount(username);
  if (error) {
    return ~{ message: error, username, email }~; // Keeps both typed values in state on refusal
  }
  return ~{ message: `Welcome, ${username}!`, username: '', email: '' }~; // Clears default values on success
}
```

Inside the form, each input reads its `defaultValue` from `state`:

```jsx title="src/App.jsx" startLine="20" good="2,3"
      <h1>Create account</h1>
      <label>Username <input name="username" ~defaultValue={state.username}~ /></label> {/* Restores john on refusal */}
      <label>Email <input name="email" ~defaultValue={state.email}~ /></label> {/* Restores john@mail.com on refusal */}
```

When the user submits those taken values, React updates `defaultValue` on both fields and resets them back to that typed text. That produces the fixed refusal screen from the opening. Next, the user edits `john` to `john7` and clicks **Create account** again. Now `signUp` returns empty strings for both fields, so the reset clears the form cleanly:

```page caption="After the user fixes john to john7 and clicks Create account: the greeting appears and both fields clear."
heading: Create account
form:
  field: Username |
  field: Email |
  submit: Create account
line: Welcome, john7! | good
console: quiet
```

### VS | `defaultValue={state.email}` vs. `value={state.email}`: defaultValue lets the user type, value alone freezes the field

Because `value` sets text on controlled inputs, developers often write `value={state.email}` by mistake. Passing `value` without `onChange` turns the input read-only (Lesson 20), blocks every keystroke, and logs a warning:

```page width=full caption="With value={state.email} and no onChange handler: the Email field refuses every keystroke."
heading: Create account
form:
  field: Username |
  field: Email | | bad
  submit: Create account
console: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
```

Adding both `value={email}` and `onChange` creates a controlled field, which also keeps text across a refusal because React never resets controlled inputs. Use a controlled field when the screen updates on every keystroke, such as a live password bar (Lesson 40). Otherwise, `defaultValue={state.email}` keeps the field uncontrolled and re-renders `App` only when the action finishes.

```tree caption="Three ways to wire the Email input, and what happens when the user types and submits."
Wiring the Email field on `<form action>`
- +`defaultValue` from state [`defaultValue={state.email}`] | Browser handles typing; reset **restores `state.email`** | `App` renders **only when the action finishes**
- +Controlled field [`value={email}` `onChange`] | React **never resets** a controlled field | `App` renders **on every keystroke**
- !`value` without `onChange` [`value={state.email}`] | The input **freezes** as read-only | User **cannot type**, and React logs a **warning**
```

---

## PRINCIPLE | `requestFormReset(form)`: React resets a form submitted through onSubmit when the action ends

> [!PRINCIPLE]
> **Principle 4: requestFormReset Resets a Form Submitted Through onSubmit**
>
> *When a form submits through `onSubmit` instead of `<form action>`, call `requestFormReset(form)` from `'react-dom'` inside `startTransition` so React resets the fields when the Transition finishes.*
>
> React runs an automatic reset only when JSX passes a function to `<form action>`. Legacy forms that call `e.preventDefault()` inside `onSubmit` never trigger that automatic reset, leaving old text in the fields after a success. Calling `requestFormReset(form)` schedules React's coordinated reset for the end of the Transition, whereas `form.reset()` clears the fields too early on click.
>
> **DO THIS:**
> ```jsx
> startTransition(() => {
>   formAction(new FormData(form));
>   ~requestFormReset(form);~ // Waits for the Transition, then resets with the new state
> });
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> startTransition(() => {
>   formAction(new FormData(form));
> });
> ~form.reset();~ // **WRONG:** empties every field on click, one second before the server answers
> ```

### VS | `form.reset()` vs. `requestFormReset(form)`: the browser resets now, React resets when the action ends

Teams migrating older forms often keep an `onSubmit` handler with `e.preventDefault()` (Lessons 11 and 41). Inside it, the handler calls `formAction` within `startTransition` (Lesson 67). Because the form has no `action` prop, React never resets the fields on its own. After `john7` succeeds, the welcome greeting appears while both typed values stay stuck inside the inputs:

```page caption="A form submitted through onSubmit without requestFormReset: the welcome message appears, and the old text stays."
heading: Create account
form:
  field: Username | john7 | bad
  field: Email | john@mail.com | bad
  submit: Create account
line: Welcome, john7! | good
console: quiet
```

### The Fix: the Handler Calls requestFormReset Inside the Transition

Import `requestFormReset` from React DOM and call it inside the same `startTransition` block:

```jsx title="src/App.jsx" startLine="1" good="2"
import { useActionState, startTransition } from 'react';
import { ~requestFormReset~ } from 'react-dom'; // Imported from react-dom
import { createAccount } from './api.js';
```

```jsx title="src/App.jsx" startLine="20" good="6"
  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(() => {
      formAction(new FormData(form));
      ~requestFormReset(form);~ // Resets the form when signUp finishes, matching <form action>
    });
  }
```

Why not call `form.reset()` instead? The browser runs `form.reset()` immediately on click, wiping the fields a full second before the server replies. On a taken username, the fields vanish and then pop back in one second later. Immediate `form.reset()` fits only optimistic inputs such as a chat box using `useOptimistic` (Lesson 44), where the message box clears the instant the user presses Send.

---

## PRINCIPLE | `name` and `type="submit"`: the browser can send the form before JavaScript loads

> [!PRINCIPLE]
> **Principle 5: name and a Submit Button Let the Browser Send the Form Alone**
>
> *A form can submit before client JavaScript loads only when built with a `<form>` tag, a `name` attribute on every field, a `<button type="submit">`, and an action the browser can send without client scripts.*
>
> On slow mobile networks, server-rendered HTML can reach the screen seconds before the JavaScript bundle finishes downloading. Standard HTML form tags let the browser serialize and submit fields natively during that gap, whereas `<div onClick>` buttons and unnamed inputs do nothing until JavaScript runs.
>
> **DO THIS:**
> ```jsx
> <form action={formAction}>
>   <input ~name="email"~ defaultValue={state.email} /> {/* Sent by the browser and read by FormData */}
>   <button ~type="submit"~>Create account</button> {/* Submits natively without a click handler */}
> </form>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <section>
>   <input value={email} onChange={e => setEmail(e.target.value)} />
>   <div ~onClick={handleCreate}~>Create account</div> {/* **WRONG:** dead on screen until JavaScript loads */}
> </section>
> ```

### VS | `action="/signup"` vs. `action={formAction}`: the browser understands a URL, only React can call a function

```jsx title="A URL action vs. a client function action"
<form ~action="/signup"~ method="post"> {/* Browser sends named fields to /signup without JavaScript */}
<form ~action={formAction}~> {/* Client function lives in JavaScript memory, so React must load first */}
```

> [!DEFINITION]
> **Progressive enhancement.** [NEW] Progressive enhancement builds a working baseline with standard HTML first, and layers richer JavaScript behavior on top once scripts load.
> 1. MDN defines it as providing essential content and functionality to every user, while delivering enhanced interaction when the browser environment supports it.
> 2. For forms, the baseline is native HTML serialization of named fields (Lesson 40), and the enhanced layer adds in-place validation state and Transition resets without a page reload (Lesson 102).

For the browser to send a form before client JavaScript runs, four pieces must be present:
1. **A real `<form>` element.**
2. **A `name` attribute on every input**, which gives each submitted value its key.
3. **A native `<button type="submit">`**, which triggers form submission without `onClick`.
4. **An action the browser can reach without client JavaScript**: either a URL string, or a Server Function in a server-rendered React setup.

### What a Vite App Shows Before Its JavaScript Runs

In a client-only Vite app, progressive enhancement does not run yet because the user sees a blank screen before JavaScript loads. The server sends `index.html` with an empty root div (Lesson 7), so no form exists in the DOM until `main.jsx` downloads and mounts the app:

```dom caption="The Elements panel in our Vite app before main.jsx runs: an empty root div."
! <div id="root"></div> | note: Empty until client JavaScript downloads and mounts App
```

Keeping a real `<form>`, named inputs, and a submit button costs nothing today and prepares the component for Server-Side Rendering (Lesson 102). Once a framework renders the HTML on the server with a Server Function in `action`, users can submit before the bundle loads (Lesson 110). React's `useActionState` even replays pre-hydration submissions automatically (Lesson 137).

---

## All 5 Principles Together

### The Complete Form Component

Paired with the stand-in server file from Part 2, here is the finished form component. Principles 1, 2, 3, and 5 work together on `<form action>`, while Principle 4 stands ready whenever a legacy form uses `onSubmit`:

```jsx title="src/App.jsx"
import { useActionState } from 'react';
import { createAccount } from './api.js';

const initialState = { message: '', username: '', email: '' };

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const error = await createAccount(username);
  if (error) {
    ~return { message: error, username, email }~; // Principle 2: return state instead of throwing
  }
  return { message: `Welcome, ${username}!`, username: '', email: '' };
}

export default function App() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form ~action={formAction}~> {/* Principle 1: React resets uncontrolled fields when signUp finishes */}
      <h1>Create account</h1>
      <label>Username <input ~name="username"~ defaultValue={state.username} /></label> {/* Principle 5: named field */}
      <label>Email <input name="email" ~defaultValue={state.email}~ /></label> {/* Principle 3: reset restores typed email */}
      <button ~type="submit"~>Create account</button> {/* Principle 5: native submit button */}
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

### What React Does After One Click

```tree dir=right caption="The five steps from one click on Create account to the post-action reset."
One click on Create account
- +1. Collect [`FormData`] | React reads **every field with a `name`**
- +2. Run action [`await createAccount`] | React calls `signUp` **inside a Transition**
- +3. Return state [`{ message, username, email }`] | Normal return, **no thrown error**
- +4. Re-render `App` [`defaultValue={state.email}`] | React updates **each field's `defaultValue`**
- +5. Reset DOM form | Browser fields revert to `defaultValue` | **Kept on refusal, cleared on success**
```

| The Situation | What Goes Wrong | The React Rule |
| :--- | :--- | :--- |
| **A completed `<form action>`** | Calling `form.reset()` manually clears fields before `await` finishes | Let React reset uncontrolled fields automatically when the action returns |
| **A validation refusal from the server** | Returning only `error` wipes every uncontrolled field; throwing crashes the form | Write the action function to return `{ message, ...fields }` as state, never to `throw` expected errors |
| **Restoring typed text after a refusal** | Writing `value={state.email}` without `onChange` freezes the input | Bind `defaultValue={state.email}` so the automatic reset restores the text |
| **Submitting through `onSubmit`** | React skips automatic resets, and `form.reset()` clears too early on click | Call `requestFormReset(form)` from `'react-dom'` inside `startTransition` |
| **Submitting before JavaScript loads** | `<div onClick>`, unnamed inputs, and client-only Vite apps send nothing | Use `<form>`, `name`, `<button type="submit">`, and SSR with a URL or Server Function |

Two places hold the text: React's state updates `defaultValue` first, and React's DOM reset restores each uncontrolled field to that `defaultValue` right after.

---

## For the Interview

> **The Interview Question:** How do React 19 form actions manage automatic form resets, manual requestFormReset, and progressive enhancement?

### How to Answer Clearly in 30 Seconds

"When JSX passes a function to `<form action>`, React runs it inside a Transition. Whenever that function finishes without throwing an unhandled error, React automatically resets every uncontrolled field to its `defaultValue`. Because a returned validation error resolves normally, React resets the form on server refusals too. To preserve typed input, the action returns the submitted values in `useActionState` and each field binds `defaultValue` to that state. For legacy `onSubmit` handlers, you call `requestFormReset(form)` from `react-dom` inside `startTransition` so the reset waits for the action. Finally, progressive enhancement requires native `<form>`, `name` attributes, `<button type="submit">`, and server-rendered HTML backed by a URL or a Server Function."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Our sign-up form clears the email field when the server says the username is taken. Why, and how do you fix it?"**
   React resets uncontrolled fields whenever a `<form action>` function finishes without throwing, so a returned error message still triggers the reset. Write the action function to return the submitted `username` and `email` in `useActionState`, and pass them into each input's `defaultValue`. React re-renders with the new `defaultValue` first, so the reset puts the typed text back on refusal and clears it when success returns empty strings. Avoid passing `value={state.email}` without `onChange`, because that turns the input read-only.
2. **"What is the difference between `form.reset()` and `requestFormReset(form)`?"**
   Both restore uncontrolled fields to their `defaultValue`, but they run at different times. The browser's `form.reset()` clears the fields immediately on click, before an async server check has answered. Your handler calls `requestFormReset(form)` from `'react-dom'` inside `startTransition`, which delays the reset until the Transition finishes and updates the fields in sync with the new action state. You need `requestFormReset` only when submitting via handlers like `onSubmit`, since `<form action>` runs that coordinated reset automatically.
3. **"Does `<form action={fn}>` work before JavaScript loads?"**
   Not in a client-only single-page app like plain Vite, which serves an empty `<div id="root"></div>` and holds `fn` only in client JavaScript memory. Before scripts load, a browser can submit a form only when Server-Side Rendering already delivered the HTML and `action` points to a URL or a Server Function. Building forms today with `<form>`, `name` on every input, and `<button type="submit">` ensures they work natively once rendered on the server.
