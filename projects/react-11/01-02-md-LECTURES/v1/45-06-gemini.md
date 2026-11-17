# Lecture 45: Form Resets, requestFormReset, and Progressive Enhancement

*(When you click Submit, why does React empty your form, and how do you keep what the user typed?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do React 19 form actions manage automatic form resets, manual requestFormReset, and progressive enhancement?

---

## 1. React 19 Empties the Form for You When the Action Finishes

### 1.1 Classic HTML empties the boxes by loading a brand-new page

A plain HTML form with `action="/signup"` works like a link. When the user clicks **Submit**, the browser packages every named field into an HTTP request. It unloads the current document, sends the request to the server, and waits for a response. When the server responds, the browser renders a fresh HTML page from scratch. The input boxes on screen appear empty because they are brand-new elements on a new page. No code cleared them. The old document was destroyed.

```html title="index.html"
<form ~action="/signup"~ method="post"> <!-- Sends the named fields to /signup and loads the page the server sends back -->
  <input name="username" />
  <button type="submit">Submit</button>
</form>
```

> **Classic HTML** ➔ the browser loads a new page ➔ the new boxes start empty.

### 1.2 Plain JavaScript keeps the page, so clearing the boxes is your job

Loading a new page for every submit is slow, and the screen flashes white. Single-page applications avoid this by intercepting submit with `onSubmit` and calling `e.preventDefault()`. That call tells the browser to keep the current document open. Your own JavaScript function then sends the data across the network in the background. Because the page stays open, the exact same `<input>` elements stay mounted in memory. Every character the user typed remains inside the boxes. To empty those boxes, your code calls `reset()` explicitly.

```js title="signup.js"
function handleSubmit(e) {
  ~e.preventDefault()~; // Keeps the current page, so the same boxes stay on screen
  sendDataToServer(e.currentTarget);
  ~e.currentTarget.reset()~; // Your code empties the boxes, because nothing else will
}
```

> **Plain JavaScript** ➔ the page stays ➔ the text stays until your code calls `reset()`.

### 1.3 React 19 keeps the page and clears the boxes for you

React 19 combines both behaviors into a single feature. You pass an asynchronous function to `<form action={save}>` (Lesson 41). When the user clicks **Send**, React stops the page reload so the current view stays alive. It collects every named field into a `FormData` object and passes it to `save`. Once `save` resolves its Promise, React automatically triggers a DOM reset on that form. You do not need to call `e.preventDefault()`, and you do not need to call `reset()`.

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

### 1.4 Keep the automatic clearing on one-box forms like a comment box

This automatic reset is ideal for single-entry forms. Consider a comment box under a blog post. The user types a comment and clicks **Send**. The new comment appears in the list below. The input box clears immediately, confirming that the comment went through and preparing the field for the next thought. If the text lingered in the box, the user would assume the submission failed and click the button a second time.

### 1.5 On long forms the server can reject, we do NOT want the boxes emptied

> [!WARNING]
> **Here the default works against the user.** On a sign-up form with a username, an email address, and profile details, the server may reject a single taken username. React treats the completed network response as a finished action, resets the form, and empties every box anyway. The user loses their valid email and address, and must retype everything. The next two sections solve this problem: Section 2 shows the server message, and Section 3 preserves the user text.

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

Start with the most direct code: pass `signUp` straight to `<form action={signUp}>`. The user types `john`, enters an email, and clicks **Create account**. One second later, both boxes go blank. No error message appears anywhere on the screen. The user has no idea why the submission failed:

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

Why did the message vanish? A plain form action executes `signUp` and drops whatever it returns. The string `"Username john is taken."` comes back from the server, but nothing stores it in React state. Because no state updated, React has no reason to re-render the component. The message never reaches the screen.

### 2.2 Wrap `signUp` in `useActionState` so the answer reaches the screen

To show the server's answer under the boxes, that text must live in React state. A state update is the only mechanism that tells React to re-render the component with the new message. React provides `useActionState` (Lesson 42) for this purpose. We pass `signUp` into `useActionState`, along with an initial state value. React returns the state variable and an enhanced action function:

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

Now `message` holds the returned string, and React re-renders the component to show the error under the button. Half of the problem is solved. Look at the input fields, however: both boxes are still empty:

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

Why are the boxes still empty? To the user, account creation failed. But to the JavaScript runtime, `signUp` did not fail: it ran to completion and returned a value. React does not inspect the English words inside the returned string. It does not know that `"Welcome, john!"` is success while `"Username john is taken."` is rejection. Both are resolved Promises. To React 19, any resolved action Promise means the action completed. And a completed action is the exact trigger that fires the automatic form reset.

> **`signUp` returns a message** ➔ React counts the action as finished ➔ the message shows, and the boxes empty.

### 2.4 Do not handle an undesirable response as an error ➔ an undesirable response is still a valid response

Once you see that returning a value empties the boxes, one shortcut looks tempting: throw an error with `throw new Error(error)`. Never do this for invalid user input. A taken username is not a software defect. The server worked, the network worked, and the server delivered a clear validation answer. An undesirable response is still a valid response, and valid responses must be returned as data:

```jsx title="src/App.jsx" bad="5"
async function signUp(previousState, formData) {
  const username = formData.get('username');
  const error = await createAccount(username);
  if (error) {
    ~throw new Error(error)~; // **WRONG:** turns a valid answer into a crash
  }
  return 'Welcome, ' + username + '!';
}
```

React treats a thrown error as an unhandled crash. When an action throws, `useActionState` does not update the state with your message. React sends the error up to the nearest Error Boundary (Lesson 72). If no Error Boundary exists above the form, React unmounts the entire component tree (Lesson 42). The user loses the form, the inputs, and the submit button all at once. Reserve `throw` for real software bugs where an Error Boundary should catch a broken render.

> [!TAKEAWAY]
> **Return every answer the server sends, the welcome and the rejection alike.** Returning keeps the form on screen and stores the response in state. The final challenge is keeping the user text inside the boxes during a rejection.

---

## SECTION | 3. Keep the User's Text After a Rejection with defaultValue

### 3.1 A reset does not blank a box: it puts back the box's starting text

Most developers assume that a form reset always wipes every input completely blank. That assumption is wrong, and correcting it reveals the solution. In standard browser behavior, a form reset restores each input to its initial starting value. In React JSX, that starting value is configured with `defaultValue` (Lesson 20):

```jsx title="What a reset does to two boxes"
<input name="email" /> {/* Starting text is empty, so a reset empties this box */}
<input name="email" ~defaultValue="john@mail.com"~ /> {/* Starting text is set, so a reset puts john@mail.com back */}
```

Our boxes went blank in Section 2 only because their starting values were empty strings. To preserve the user's text on a server rejection, we do not need to cancel the reset. We need each box to hold the typed text as its starting value when the reset fires.

### 3.2 Return the typed text as the new `defaultValue` ➔ the message shows, and the text stays

The action already holds what the user typed through the `formData` argument. On rejection, `signUp` returns an object containing the error message along with the submitted username and email. On success, it returns the welcome message with empty strings:

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

The execution order inside React makes this work seamlessly. When `signUp` returns the object, React first re-renders `App` with the new state. That render assigns the typed values to the `defaultValue` props on both inputs. Only after committing those new default values to the DOM does React execute the form reset. The reset copies the updated starting values into each input:

```page caption="On rejection: the new starting text is in place before the reset, so both typed fields come back."
heading: Create account
form:
  field: Username | john | good
  field: Email | john@mail.com | good
  submit: Create account
line: Username john is taken. | bad
console: quiet
```

When the user modifies `john` to `john7` and submits again, the server accepts the registration. The action returns empty strings for `username` and `email`. React sets the default values back to empty strings, the reset runs, and both input boxes clear cleanly:

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

### 3.3 Use `value` with `onChange` only when the screen must react to every keystroke

An uncontrolled input paired with `defaultValue` leaves character storage to the browser DOM. The component renders only when the form submits. That architecture is lightweight and fast. A controlled input, by contrast, stores its text in React state with `value` and `onChange` (Lesson 20). Every keypress triggers an event, updates state, and re-renders the component. That extra work is justified only when the interface must respond during typing, such as a live password meter (Lesson 40). With controlled inputs, React state dictates the text, so clearing the input after success requires manually resetting that state variable.

### 3.4 Do not use `value` without `onChange` ➔ the box stops accepting typing

A frequent pitfall is writing `value` while omitting `onChange`. When you set `value` without `onChange`, you tell React that the input must strictly match state at all times. When the user types into the box, the browser updates the input. But React immediately renders the unchanged state value back into the node, erasing what the user typed. The input field appears completely frozen, and React logs a warning in the Console:

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

When you see that Console warning on an editable form input, switch the prop to `defaultValue`.

---

## SECTION | 4. With onSubmit, Clear the Boxes When the Server Answers, Not When the User Clicks

### 4.1 With `onSubmit`, React leaves the clearing to you

Many codebases manage submissions with `<form onSubmit={handleSubmit}>`, invoking the action inside `startTransition` (Lessons 11, 41, and 66). Automatic form resetting belongs exclusively to the `<form action>` prop. When you attach `onSubmit` and call `e.preventDefault()`, you take full control of submission. React does not touch the form inputs. When the action succeeds, the welcome message renders, but the old text remains in both boxes:

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

To empty the boxes, developers often place the native DOM method `form.reset()` right after `startTransition`:

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

Why does this fail? Look at the execution timeline. The `startTransition` call launches the asynchronous server action in the background and returns immediately. It does not pause JavaScript execution. The `form.reset()` call on the following line runs synchronously at 0 seconds. The browser empties every input box before the request has even reached the server. When the server rejects the username one second later, the user text is already gone. The user must retype their valid email address from memory.

### 4.3 Call `requestFormReset` inside `startTransition` ➔ the boxes reset when the server answers

This timing conflict explains why React DOM exports `requestFormReset`. Native `form.reset()` has no awareness of React Transitions or asynchronous server operations. It runs immediately on the spot. To synchronize the form reset with the completion of a Transition, React provides `requestFormReset(form)`:

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

Calling `requestFormReset(form)` inside `startTransition` instructs React to defer the reset. React waits for the asynchronous action to finish and commits the resulting state update to the DOM. Only then does it trigger the form reset. Here is the step-by-step runtime sequence:
1. At 0 seconds, the user clicks **Submit**. The `startTransition` callback executes. The input boxes are untouched.
2. At 1 second, the server responds with a taken username rejection.
3. `useActionState` receives the rejection data and updates the state object with the typed values.
4. React re-renders the component and commits the updated `defaultValue` props to the DOM elements.
5. React now executes `requestFormReset(form)`.
6. The reset restores the inputs to their newly committed `defaultValue` values.
Because the reset waited for the Transition to commit, the typed text remains in the boxes on rejection. On success, empty default values clear the form cleanly.

> **`form.reset()`** ➔ resets at 0 seconds, on click · **`requestFormReset(form)`** ➔ resets when the action finishes.

### 4.4 Call `form.reset()` on click only for an instant live chat box

Is there ever a valid scenario for calling `form.reset()` synchronously at 0 seconds? Yes: an optimistic live chat interface built with `useOptimistic` (Lesson 44). In a chat application, pressing Enter immediately appends the message bubble to the conversation thread. The user expects the message input to clear at that exact moment so they can compose their next message without waiting for server acknowledgment. For registration, login, and payment forms, however, always coordinate the reset with the server response using `requestFormReset`.

---

## SECTION | 5. Make Send Work Before JavaScript Finishes Loading

A user on a slow mobile connection may receive your initial HTML in 100 milliseconds, while the JavaScript bundle takes 3 seconds to download and parse. Whether clicking **Create account** at 500 milliseconds succeeds depends on three technical factors: semantic markup, rendering architecture, and action targets.

### 5.1 Build a real `<form>` with `name` and `type="submit"`, not a `div` with `onClick`

An `onClick` handler requires JavaScript event listeners attached by React. Until that code executes, an element styled as a button cannot respond to user interaction:

```jsx title="A fake form built from a div" bad="3"
<section>
  <input value={email} onChange={e => setEmail(e.target.value)} />
  <div ~onClick={handleCreate}~>Create account</div> {/* **WRONG:** plain text until JavaScript attaches onClick */}
</section>
```

A standard HTML form requires no JavaScript to submit. The browser engine natively collects every input with a `name` attribute and creates an HTTP POST request whenever the user clicks `<button type="submit">` (Lesson 40):

```jsx title="A real HTML form" good="2,3"
<form action={formAction}>
  <input ~name="email"~ defaultValue={state.email} /> {/* The browser sends this value under the name email */}
  <button ~type="submit"~>Create account</button> {/* The browser submits the form on its own */}
</form>
```

### 5.2 A browser-only app like plain Vite cannot send early: its page is empty until JavaScript loads

Writing semantic tags is essential, but it is not sufficient on its own. In a client-only single-page application like standard Vite, the server sends an initial HTML file containing only an empty `<div id="root"></div>` (Lesson 7). React constructs the form inside the browser after the JavaScript bundle arrives. At 500 milliseconds, no inputs or buttons exist on screen to click:

```dom caption="The HTML of a plain Vite app before JavaScript loads: an empty root div and no form."
! <div id="root"></div> | note: Empty until the JavaScript arrives and React builds the form
```

### 5.3 Server HTML is not enough while the action is a browser function

With Server-Side Rendering, the server generates the full HTML form before delivery, displaying the inputs and button at 100 milliseconds (Lesson 102). However, if `<form action={myFunction}>` references a function located only in client-side code, the browser has no target endpoint to submit to before JavaScript arrives. The form cannot submit until client-side hydration completes.

### 5.4 Point the action to a URL or a Server Function ➔ Send works before JavaScript loads

Give the server-rendered form an action target that the browser can handle natively. Point it to a URL like `"/signup"` with `method="post"`, or use a React Server Function (Lesson 110):

```jsx title="A form the browser can send by itself" good="1"
<form ~action="/signup"~ method="post"> {/* Sends with a page load before JavaScript, and without one after React takes over */}
  <input name="email" />
  <button type="submit">Create account</button>
</form>
```

Clicking **Create account** at 500 milliseconds now triggers a standard browser HTTP POST request. The server receives the data and renders the response page. Once the client JavaScript arrives at 3 seconds, React hydrates the page. Future submissions are handled without full-page reloads.

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
