# Lecture 45: Form Resets, requestFormReset, and Progressive Enhancement

*(When you click Submit, why does React empty your form, and how do you keep what the user typed?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do React 19 form actions manage automatic form resets, manual requestFormReset, and progressive enhancement?

---

## 1. React 19 Empties the Form for You When the Action Finishes

### 1.1 Classic HTML empties the boxes by loading a brand-new page

- **The baseline mechanism:** In plain HTML, submitting `<form action="/signup">` works like following a link. The browser unloads the entire document and requests a brand-new page from the server.
- **The full-page flash:** You click **Submit**, and the screen flashes white while the browser unloads your page and renders the server response from scratch.
- **Why the boxes are empty:** Those empty input boxes are brand-new DOM elements created five milliseconds ago. No code reset them; the old document was simply destroyed.
- **The engineering verdict:** Pure HTML gives you clean inputs after submission, but full-page white flashes ruin the single-page application experience.

```html title="index.html"
<form ~action="/signup"~ method="post"> <!-- Sends the named fields to /signup and loads the page the server sends back -->
  <input name="username" />
  <button type="submit">Submit</button>
</form>
```

> **Classic HTML** ➔ the browser loads a new page ➔ the new boxes start empty.

### 1.2 Plain JavaScript keeps the page, so clearing the boxes is your job

- **The SPA trade-off:** Single-page applications intercept submit with `onSubmit` and call `e.preventDefault()`. That cancels page navigation so the current view stays mounted.
- **The ghost in the box:** Because the page never unloads, the exact same `<input>` tags remain in browser memory with every character you typed.
- **The manual reset chore:** The data travels to the server in the background, but the browser will never touch your inputs. Unless your code explicitly calls `reset()`, your old text sits there forever.
- **The engineering verdict:** JavaScript prevents white flashes, but forces you to write manual cleanup code on every single form handler.

```js title="signup.js"
function handleSubmit(e) {
  ~e.preventDefault()~; // Keeps the current page, so the same boxes stay on screen
  sendDataToServer(e.currentTarget);
  ~e.currentTarget.reset()~; // Your code empties the boxes, because nothing else will
}
```

> **Plain JavaScript** ➔ the page stays ➔ the text stays until your code calls `reset()`.

### 1.3 React 19 keeps the page and clears the boxes for you

- **The unified default:** React 19 bridges both worlds. When you pass an asynchronous function to `<form action={save}>` (Lesson 41), React manages the entire lifecycle.
- **Zero navigation code:** React automatically intercepts the submit event to keep the page mounted, collects fields into `FormData`, and calls your function.
- **The automatic wipe:** The exact millisecond your action Promise resolves, React automatically triggers a DOM reset on that form.
- **The engineering verdict:** You do not write `e.preventDefault()`, and you do not call `reset()`. React gives you single-page persistence and automatic form clearing out of the box.

```jsx title="src/App.jsx"
export default function CommentForm() {
  return (
    <form ~action={save}~> {/* Keeps the page, passes FormData to save, and empties the boxes when save finishes */}
      <input name="comment" />
      <button type="submit">Send</button>
    </form>
  );
}
```

> **React 19** ➔ the page stays ➔ React empties the boxes when the action finishes.

### 1.4 Where to embrace the default: single-entry append forms ➔ DO NOTHING

- **The architectural role:** This is where React 19's automatic wipe is your greatest asset. You write a plain `<form action={save}>` and write zero reset code.
- **The UX confirmation:** On single-purpose append forms such as comment boxes, chat inputs, and todo lists, the automatic wipe serves as the user's visual receipt that their message was saved.
- **Preventing phantom clicks:** If the words lingered in the box after clicking **Send**, the user would assume the network dropped and click the button a second time, creating duplicate records.
- **The decision rule:** If a form only appends a new item to a list, validation rarely rejects. Embrace the default and write no custom reset logic.
- **The boundary line:** This zero-code approach works only because there are no other fields on screen. The moment a form contains multiple fields the server can reject, this exact same default turns destructive.

### 1.5 Where the default turns hostile: multi-field forms ➔ OVERRIDE IT

> [!WARNING]
> **The multi-field trap.** You spend two minutes typing a username, an email address, and shipping details on a sign-up form. The server rejects just the username because `john` is taken. React sees the server call complete, assumes the action succeeded, and ruthlessly blanks every single box on the page. Your valid email and address are vaporized, forcing you to retype everything. That is where React's helpful default turns into a disaster. The next two sections show how to override it: Section 2 captures the server error, and Section 3 preserves the user's valid text.

---

## SECTION | 2. Show the Server's Answer Under the Boxes with useActionState

Every example from here on uses one small server helper. It waits one second, rejects the username `john` as already taken, and accepts any other name:

```js title="src/api.js"
const takenUsernames = ['john'];

export function createAccount(username) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (~takenUsernames.includes(username)~) { // Answers john with a message string, one second later
        resolve('Username ' + username + ' is taken.');
      } else {
        resolve(null);
      }
    }, 1000);
  });
}
```

### 2.1 A plain form action throws the server's answer away

- **The architectural flaw:** Passing `signUp` directly to `<form action={signUp}>` creates a black hole for return values.
- **The silent drop:** The user types `john`, enters an email, and clicks **Create account**. The server replies with a taken username rejection, and `signUp` returns that string.
- **No state, no re-render:** A plain form action has no React state variable to store return values. Without a state change, React has no trigger to re-render the view, so the returned message vanishes into thin air.
- **The broken user experience:** One second later, both input boxes go blank, nothing appears on screen, and the user is left wondering why registration failed.

```jsx title="src/App.jsx" bad="4,9"
async function signUp(formData) {
  const username = formData.get('username');
  const error = await createAccount(username); // Server answers: "Username john is taken."
  ~return error~; // **WRONG:** a plain form action ignores this returned value
}

export default function App() {
  return (
    <form ~action={signUp}~> {/* **WRONG:** calls signUp, keeps nothing it returns, and empties both boxes */}
      <label>Username <input name="username" /></label>
      <label>Email <input name="email" /></label>
      <button type="submit">Create account</button>
    </form>
  );
}
```

### 2.2 Wrap `signUp` in `useActionState` so the answer reaches the screen

- **The architectural solution:** To display server messages on screen, that data must live in React state to drive component re-renders.
- **The hook connection:** You pass the action into `useActionState` (Lesson 42), which catches the return value and hands you back a live `message` state variable.
- **Displaying the feedback:** You render `{message && <p>{message}</p>}` under the submit button. Now the user actually sees the error message when the server rejects their input.
- **The remaining half of the puzzle:** The server message is now visible, but look at the input fields above it: both boxes are still stripped completely bare.

```jsx title="src/App.jsx" good="14,22" bad="8"
import { useActionState } from 'react';
import { createAccount } from './api.js';

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const error = await createAccount(username);
  if (error) {
    ~return error~; // **WRONG:** the message reaches the screen, yet the boxes get no text to come back to
  }
  return 'Welcome, ' + username + '!';
}

export default function App() {
  const [message, ~formAction~] = useActionState(signUp, ''); // Whatever signUp returns becomes message
  return (
    <form action={formAction}>
      <h1>Create account</h1>
      <label>Username <input name="username" /></label>
      <label>Email <input name="email" /></label>
      <button type="submit">Create account</button>
      {~message && <p>{message}</p>~} {/* Shows the server's answer under the boxes */}
    </form>
  );
}
```

```page caption="With useActionState: the server's answer appears under the button, yet both boxes are still empty."
heading: Create account
form:
  field: Username | | bad
  field: Email | | bad
  submit: Create account
line: Username john is taken. | bad
console: quiet
```

### 2.3 React cannot tell good news from bad news: a returned message counts as a finished action

- **Human semantics vs runtime facts:** To a developer, *"Username taken"* means the submission failed. To JavaScript, `signUp` reached its return statement and resolved its Promise normally.
- **No linguistic parsing:** React does not read English words inside returned strings. It does not know that a welcome greeting is success and a taken username is a rejection.
- **The reset signal:** In React 19, any resolved action Promise signals that the action completed. A completed action is the exact trigger that runs the automatic form reset.
- **The root problem:** The error message renders, but React wipes the input boxes anyway because the action resolved successfully.

> **`signUp` returns a message** ➔ React counts the action as finished ➔ the message shows, and the boxes empty.

### 2.4 Do not handle an undesirable response as an error ➔ an undesirable response is still a valid response

- **The dangerous hack:** Seeing that returning a string triggers a form reset, developers often try throwing an error with `throw new Error(error)` to force a failure.
- **Validation data is not a crash:** A user typing an existing username is routine application traffic. The server and network worked as expected, and the validation response is valid data.
- **The crash cascade:** If you throw, `useActionState` never receives your message. Instead, the rejected Promise bubbles straight up to the nearest Error Boundary (Lesson 72).
- **The white screen disaster:** If no Error Boundary wraps your form, React unmounts the entire component tree (Lesson 42). The form, inputs, and button disappear from the screen.
- **The decision rule:** Always return validation errors as application data. Reserve `throw` strictly for unexpected runtime exceptions.

> [!TAKEAWAY]
> **Return every answer the server sends, the welcome and the rejection alike.** Returning keeps the form mounted and stores the response in state. The final challenge is keeping the user's text inside the boxes during a rejection.

---

## SECTION | 3. Keep the User's Text After a Rejection with defaultValue

### 3.1 A reset does not blank a box: it puts back the box's starting text

- **The core revelation:** Most developers believe a form reset wipes an input to pure blank space. That belief is false.
- **What the HTML specification says:** A DOM reset restores an input to its initial starting text, which React configures using `defaultValue` (Lesson 20).
- **Why our inputs emptied:** Our input fields went completely blank in Section 2 only because their initial default value was an empty string.
- **The architectural pivot:** You do not need to prevent React from resetting. You simply need each input to have the user's typed text as its `defaultValue` when that reset executes.

```jsx title="What a reset does to two boxes"
<input name="email" /> {/* Starting text is empty, so a reset empties this box */}
<input name="email" ~defaultValue="john@mail.com"~ /> {/* Starting text is set, so a reset puts john@mail.com back */}
```

### 3.2 Return the typed text as the new defaultValue ➔ the message shows, and the text stays

- **The payload pattern:** On rejection, `signUp` returns an object containing the error message bundled together with the typed values. On success, it returns empty strings for both fields.
- **The binding pattern:** You bind `<input name="username" defaultValue={state.username} />` and `<input name="email" defaultValue={state.email} />`.
- **The React commit sequence:** When `signUp` returns, React re-renders `App` first. That render commits the typed values to the `defaultValue` props on both DOM inputs.
- **The reset executes safely:** Only after committing those new default values does React trigger its form reset. The reset restores the inputs to their newly committed `defaultValue`, keeping the user's text on screen!
- **Clean slate on success:** When the user fixes their username to `john7`, the server accepts. The action returns empty strings, React commits empty default values, and the reset blanks the boxes cleanly.

```jsx title="src/App.jsx" good="11,13,22,23"
import { useActionState } from 'react';
import { createAccount } from './api.js';

const initialState = { message: '', username: '', email: '' };

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const error = await createAccount(username);
  if (error) {
    return ~{ message: error, username, email }~; // Rejected: the typed text becomes the new starting text
  }
  return ~{ message: 'Welcome, ' + username + '!', username: '', email: '' }~; // Accepted: the starting text goes back to empty
}

export default function App() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form action={formAction}>
      <h1>Create account</h1>
      <label>Username <input name="username" ~defaultValue={state.username}~ /></label> {/* The reset copies state.username into this box */}
      <label>Email <input name="email" ~defaultValue={state.email}~ /></label> {/* The reset copies state.email into this box */}
      <button type="submit">Create account</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

```page caption="On rejection: the new starting text is in place before the reset, so both typed fields come back."
heading: Create account
form:
  field: Username | john | good
  field: Email | john@mail.com | good
  submit: Create account
line: Username john is taken. | bad
console: quiet
```

```page caption="On success: the starting text is empty, so the same reset clears both boxes."
heading: Create account
form:
  field: Username | | good
  field: Email | | good
  submit: Create account
line: Welcome, john7! | good
console: quiet
```

> **Server rejects** ➔ return the typed text ➔ the reset puts it back · **Server accepts** ➔ return empty strings ➔ the reset clears the boxes.

### 3.3 Use value with onChange only when the screen must react to every keystroke

- **The uncontrolled advantage:** Uncontrolled inputs with `defaultValue` let the browser manage typing directly. React renders only on form submission, keeping your app fast and simple.
- **When controlled inputs are required:** Storing text in state with `value` paired with `onChange` has a render cost. It is worth that cost only when the UI must react to every letter (Lesson 40).
- **The manual reset requirement:** With controlled inputs, React state completely overrides DOM state. React's automatic DOM reset has no effect on controlled inputs, so resetting after success requires manually clearing your state variables.

### 3.4 Do not use value without onChange ➔ the box stops accepting typing

- **The read-only trap:** A developer writes `value` instead of `defaultValue` and forgets to attach a change handler.
- **The keyboard lock:** When you set `value` without `onChange`, you tell React that the DOM element must strictly match state at all times.
- **Erasing user keystrokes:** Every time the user types a character, React immediately renders the unchanged state value back into the input, overwriting the new keystroke.
- **The Console warning:** The field appears completely frozen to the user, and React logs an error warning in the browser Console.
- **The decision rule:** Whenever you need an editable field that submits with a form action, always reach for `defaultValue`.

```jsx title="Read-only trap: value without onChange" bad="1"
<input name="email" ~value={state.email}~ /> {/* **WRONG:** React puts state.email back after every key, so typing does nothing */}
```

```page width=full caption="With value and no onChange: the Email box ignores the keyboard, and React prints a Console warning."
heading: Create account
form:
  field: Username |
  field: Email | | bad
  submit: Create account
console: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
```

---

## SECTION | 4. With onSubmit, Clear the Boxes When the Server Answers, Not When the User Clicks

### 4.1 With onSubmit, React leaves the clearing to you

- **The legacy architectural path:** Many existing codebases handle submissions manually using `<form onSubmit={handleSubmit}>`, executing the action inside `startTransition` (Lessons 11, 41, and 66).
- **Automatic resets belong to actions:** React's built-in reset feature lives exclusively on the `<form action>` prop.
- **The manual responsibility:** When you use `onSubmit` and call `e.preventDefault()`, you take full control of the submission lifecycle. React does not touch your form inputs.
- **The lingering input problem:** When the action succeeds, the welcome message renders, but the old text remains stuck in both boxes until your code clears it.

```page caption="An onSubmit form with no reset: the welcome message appears, and the old text stays in both boxes."
heading: Create account
form:
  field: Username | john7 | bad
  field: Email | john@mail.com | bad
  submit: Create account
line: Welcome, john7! | good
console: quiet
```

### 4.2 Do not call `form.reset()` on click while the server is still checking

- **The naive instinct:** To empty the boxes, developers often place the native DOM method `form.reset()` right after calling `startTransition`.
- **The 0-second race condition:** The `startTransition` call kicks off a slow network request in the background and returns immediately. The `form.reset()` call on the very next line runs synchronously at 0 milliseconds.
- **Wiping before the server replies:** The browser empties every input box before the request has even reached the server.
- **The disastrous result:** One second later, the server replies that the username is taken. The error message appears, but the user's typed email was already vaporized a full second ago.

```jsx title="src/App.jsx" bad="7"
function handleSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  startTransition(() => {
    formAction(new FormData(form));
  });
  ~form.reset()~; // **WRONG:** runs at 0 seconds, while the server needs 1 second to answer
}
```

### 4.3 Call requestFormReset inside startTransition ➔ the boxes reset when the server answers

- **Why React DOM exports requestFormReset:** Standard DOM `form.reset()` is blind to React Transitions and asynchronous network latency, running immediately on the spot.
- **Deferring the reset:** Calling `requestFormReset(form)` inside `startTransition` instructs React to defer the reset until the Transition finishes and commits its state.
- **The 0-second mark:** The user clicks Submit, the network request begins, and the inputs sit completely untouched while the user waits.
- **The 1-second mark:** The server rejects `john`. React re-renders, committing the user's typed text as the updated `defaultValue` props on both inputs.
- **The safe execution:** Only now does React execute `requestFormReset(form)`. It restores the boxes to their newly committed starting values, keeping the user's text intact.

```jsx title="src/App.jsx" good="2,9"
import { useActionState, startTransition } from 'react';
import { ~requestFormReset~ } from 'react-dom'; // Comes from react-dom, not from react

function handleSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  startTransition(() => {
    formAction(new FormData(form));
    ~requestFormReset(form)~; // Resets the form when this Transition ends, not now
  });
}
```

> **`form.reset()`** ➔ resets at 0 seconds, on click · **`requestFormReset(form)`** ➔ resets when the action finishes.

### 4.4 Call `form.reset()` on click only for an instant live chat box

- **The single valid exception:** The one place you want instant 0-second clearing is a live chat box using `useOptimistic` (Lesson 44).
- **The chat mental model:** You hit Enter on a message, expecting the message bubble to appear immediately in the chat thread and the input box to clear instantly for your next sentence.
- **Sluggish latency:** If a chat box made you wait for the server roundtrip before clearing, typing would feel sluggish and unnatural.
- **The decision rule:** Clear instantly at 0 seconds for optimistic live chat; coordinate the reset with `requestFormReset` for all registration, login, and payment forms.

---

## SECTION | 5. Make Send Work Before JavaScript Finishes Loading

### 5.1 Build a real form with name and type="submit", not a div with onClick

- **The slow connection reality:** A user on a spotty mobile network downloads your initial HTML in 100 milliseconds, but the JavaScript bundle takes three seconds to arrive.
- **The inert element trap:** A styled `div` with an `onClick` listener is completely lifeless until JavaScript boots. Tapping it at 500 milliseconds does nothing at all.
- **Native browser power:** A semantic HTML `<form>` with a submit button and named inputs does not need a single line of JavaScript to function (Lesson 40).

```jsx title="A fake form built from a div" bad="3"
<section>
  <input value={email} onChange={e => setEmail(e.target.value)} />
  <div ~onClick={handleCreate}~>Create account</div> {/* **WRONG:** plain text until JavaScript attaches onClick */}
</section>
```

```jsx title="A real HTML form" good="2,3"
<form action={formAction}>
  <input ~name="email"~ defaultValue={state.email} /> {/* The browser sends this value under the name email */}
  <button ~type="submit"~>Create account</button> {/* The browser submits the form on its own */}
</form>
```

### 5.2 A browser-only app like plain Vite cannot send early: its page is empty until JavaScript loads

- **The client-only limitation:** Writing semantic form tags in a client-only single-page app cannot enable early submissions.
- **The empty root element:** The initial HTML delivered by a Vite development server holds only an empty `<div id="root"></div>` (Lesson 7).
- **No form to click:** The form does not exist in the initial HTML document. Until client JavaScript executes and mounts React, there is literally no form on screen to tap.

```dom caption="The HTML of a plain Vite app before JavaScript loads: an empty root div and no form."
! <div id="root"></div> | note: Empty until the JavaScript arrives and React builds the form
```

### 5.3 Server HTML is not enough while the action is a browser function

- **Painted but stranded:** Server-Side Rendering paints the form in the initial HTML in 100 milliseconds (Lesson 102), displaying the inputs immediately.
- **The missing destination:** If `<form action={myFunction}>` references a browser function living in your client bundle, the browser has no target endpoint to submit to before that bundle loads.
- **The waiting tap:** Tapping the submit button still does nothing until client JavaScript downloads and attaches the handler.

### 5.4 Point the action to a URL or a Server Function ➔ Send works before JavaScript loads

- **Providing a native destination:** Point your server-rendered form to a real backend URL like `"/signup"` with `method="post"`, or back it with a React Server Function (Lesson 110).
- **Instant baseline functionality:** When the user taps **Create account** at 500 milliseconds, the browser performs a classic HTTP POST without waiting for client JavaScript.
- **Seamless client takeover:** When the client JavaScript bundle finishes loading at 3 seconds, React hydrates the form. All future submissions happen smoothly without page reloads.

```jsx title="A form the browser can send by itself" good="1"
<form ~action="/signup"~ method="post"> {/* Sends with a page load before JavaScript, and without one after React takes over */}
  <input name="email" />
  <button type="submit">Create account</button>
</form>
```

> [!DEFINITION]
> **Progressive enhancement.** Building a foundation that functions using pure HTML, then letting JavaScript enhance the experience once loaded, is known as **progressive enhancement** (as MDN defines it). Using semantic form elements, `name` attributes, and submit buttons costs nothing in client-only applications, while ensuring the markup remains ready for Server-Side Rendering later.

---

## SECTION | 6. Every Piece Together

### 6.1 The complete Create Account form

Combined with the server helper from Section 2, this is the complete component incorporating all architectural patterns from this lesson:

```jsx title="src/App.jsx" good="11,13,20,22,23,24"
import { useActionState } from 'react';
import { createAccount } from './api.js';

const initialState = { message: '', username: '', email: '' };

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const error = await createAccount(username);
  if (error) {
    return ~{ message: error, username, email }~; // A rejection is a valid answer: return it with the typed text
  }
  return ~{ message: 'Welcome, ' + username + '!', username: '', email: '' }~; // Success: empty starting text clears the boxes
}

export default function App() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form ~action={formAction}~> {/* Keeps the page, runs signUp, and resets the boxes when it finishes */}
      <h1>Create account</h1>
      <label>Username <input ~name="username"~ defaultValue={state.username} /></label> {/* A named field the browser can send by itself */}
      <label>Email <input name="email" ~defaultValue={state.email}~ /></label> {/* Keeps the valid email when the username is rejected */}
      <button ~type="submit"~>Create account</button> {/* A real submit button */}
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

### 6.2 The decision map: what you want, what to do, and what to avoid

| What You Want | DO THIS | DO NOT DO THIS |
| :--- | :--- | :--- |
| **Clear the boxes after a normal send** | Pass your function to `<form action={fn}>` and let React reset the boxes when `fn` finishes | Build the form from a `<div onClick>`, or call `form.reset()` before the server answers |
| **Show the server's answer under the boxes** | Wrap the action in `useActionState` and `return` the message | Use a plain `<form action={fn}>` alone, or `throw` a valid rejection as an error |
| **Keep the user's text after a rejection** | Return the typed fields and bind `<input defaultValue={state.email} />` | Write `<input value={state.email} />` without `onChange`, which blocks typing |
| **Reset an `onSubmit` form when the server answers** | Call `requestFormReset(form)` from `'react-dom'` inside `startTransition` | Call `form.reset()` on click, except in an optimistic live chat box |
| **Let slow-Wi-Fi users send before JavaScript loads** | Render a real `<form>` on the server, with `name`, `<button type="submit">`, and a URL or Server Function as `action` | Expect a plain Vite app or a browser-only function to send before JavaScript arrives |

---

## For the Interview

> **The Interview Question:** How do React 19 form actions manage automatic form resets, manual requestFormReset, and progressive enhancement?

### How to Answer Clearly in 30 Seconds

"Passing a function to `<form action>` cancels the page reload and passes `FormData` to your function inside a Transition. Whenever that action's Promise resolves, React automatically resets every uncontrolled `<input>` to its `defaultValue`. Because returning a validation message resolves the Promise normally, React still resets the form on server rejections. A rejection is a valid response, so I return it instead of throwing, which would send the form into an Error Boundary. I wrap the action in `useActionState` and return `{ message, ...fields }`. Binding each input's `defaultValue` to that state commits the new starting text before the reset runs, keeping text on error and clearing it on success. For manual `onSubmit` handlers, I call `requestFormReset(form)` from `'react-dom'` inside `startTransition` so the reset waits for the Transition to finish. Finally, progressive enhancement works before JavaScript loads when Server-Side Rendering outputs `<form>`, `name`, and `<button type="submit">` backed by a URL or Server Function."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"When our server rejects a taken username, why do our `<form action>` inputs still go blank, and why shouldn't we `throw new Error()` to stop it?"**
   A rejected username is a valid response, not an error. An `async` action that returns it resolves its Promise normally, and React resets uncontrolled inputs whenever an action's Promise resolves. Throwing turns that valid answer into a crash: it skips `useActionState` and goes to the nearest Error Boundary, unmounting the `<form>` if none exists. Instead, return `{ message, username, email }` from the action and bind `defaultValue={state.email}`. React updates `defaultValue` first, and its reset copies the user's text right back into the inputs.
2. **"What is the exact runtime difference between `form.reset()` and `requestFormReset(form)`?"**
   Both restore uncontrolled DOM inputs to their `defaultValue`, yet they run at different times. Calling `form.reset()` inside `onSubmit` runs at 0 seconds on click while the server check is still pending, which fits only `useOptimistic` chat boxes. Calling `requestFormReset(form)` from `'react-dom'` inside `startTransition` schedules the reset for the end of the Transition, after `useActionState` updates `defaultValue`.
3. **"Why doesn't `<form action={myFunction}>` work before JavaScript loads in a plain Vite app?"**
   Two reasons: a client-only Vite server sends an empty `<div id="root"></div>` with no `<form>` in the initial HTML, and `myFunction` exists only inside the client JavaScript bundle. Sending before JavaScript loads requires Server-Side Rendering to output `<form>`, `name`, and `<button type="submit">` HTML backed by a URL or Server Function. Once JavaScript loads, React takes over that same form and sends without a reload.
