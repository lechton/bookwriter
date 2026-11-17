# Lecture 45: Form Resets, requestFormReset, and Progressive Enhancement

*(When you click Submit, why does React empty your form, and how do you keep what the user typed?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do React 19 form actions manage automatic form resets, manual requestFormReset, and progressive enhancement?

---

## 1. React 19 Empties the Form for You When the Action Finishes

### 1.1 Classic HTML empties the boxes by loading a brand-new page

A plain HTML form with `action="/signup"` works like a link. When the user clicks **Submit**, the browser sends the named fields to the server, drops the current page, and shows the page the server sends back. The boxes come back empty because they are new boxes on a new page. No code cleared them.

```html title="index.html"
<form ~action="/signup"~ method="post"> <!-- Sends the named fields to /signup and loads the page the server sends back -->
  <input name="username" />
  <button type="submit">Submit</button>
</form>
```

> **Classic HTML** ➔ the browser loads a new page ➔ the new boxes start empty.

### 1.2 Plain JavaScript keeps the page, so clearing the boxes is your job

Loading a new page for every submit is slow, and the screen flashes white. So in plain JavaScript we catch the submit with `onSubmit` and call `e.preventDefault()` to keep the current page. Our own code then sends the data in the background. Keeping the page has one consequence: the same boxes stay on screen with the same text inside. To empty them, your code calls `reset()`.

```js title="signup.js"
function handleSubmit(e) {
  ~e.preventDefault()~; // Keeps the current page, so the same boxes stay on screen
  sendDataToServer(e.currentTarget);
  ~e.currentTarget.reset()~; // Your code empties the boxes, because nothing else will
}
```

> **Plain JavaScript** ➔ the page stays ➔ the text stays until your code calls `reset()`.

### 1.3 React 19 keeps the page and clears the boxes for you

React 19 gives you both: the page stays, and the boxes clear. Pass your function to `<form action={save}>` (Lesson 41). When the user clicks **Send**, React keeps the page, packs every named field into a `FormData` object, and passes it to `save`. When `save` finishes, React empties the boxes. You did not need to call `e.preventDefault()`, and you did not need to call `reset()`.

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

This default is exactly right for a comment box. The reader types "Great post!", clicks **Send**, and the comment appears under the article. The empty box tells the reader that the comment went through. If the text stayed in the box, the reader would wonder whether **Send** worked, and click it again.

### 1.5 On long forms the server can reject, we do NOT want the boxes emptied

> [!WARNING]
> **Here the default works against the user.** On a sign-up form with a username, an email address, and contact details, the server may reject a single field. React empties every box anyway, and the user must retype the fields that were fine. The next two sections fix this in two steps: Section 2 shows the server's answer, and Section 3 keeps the user's text.

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

Start with the shortest version: pass `signUp` straight to the form. The user types `john` and an email address, clicks **Create account**, and one second later both boxes are empty. No message appears anywhere, so the user has no idea what went wrong:

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

The cause is in how a plain form action works. It calls `signUp` and ignores whatever `signUp` returns. The message "Username john is taken." comes back, and nothing stores it. Without state, `App` has no reason to render again, so the message never reaches the screen.

### 2.2 Wrap `signUp` in `useActionState` so the answer reaches the screen

The user needs to see why the sign-up failed, right under the boxes. That means the server's answer must live in React state, because a change in state is what makes `App` render again. The hook built for this is `useActionState` (Lesson 42). We give it `signUp`, because `signUp` holds what the user just sent and waits for the server's reply. React gives back two things. The first, `message`, holds whatever `signUp` returns. The second, `formAction`, goes on the form in place of `signUp`:

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

Now the message appears under the button, and the user can see what to fix. Half of the problem is solved. Both boxes are still empty:

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

Why are the boxes still empty? For the user, the sign-up failed. For React, nothing failed: `signUp` ran to the end and returned a value. React does not read the words inside the message, so "Username john is taken." and "Welcome, john!" look the same to it. Both mean the action finished, and a finished action is the signal for React to empty the boxes.

> **`signUp` returns a message** ➔ React counts the action as finished ➔ the message shows, and the boxes empty.

### 2.4 Do not handle an undesirable response as an error ➔ an undesirable response is still a valid response

Once you know that a normal return empties the boxes, one idea looks tempting: make the function fail on purpose with `throw`. Resist it. A taken username is not a broken program. The server worked, the network worked, and the server sent back a clear answer that the user can act on. That is a valid response, and a valid response is returned, not thrown:

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

React treats a thrown error as a crash, not as an answer. `useActionState` never receives a value, so `message` never updates. React sends the crash up to the nearest Error Boundary (Lesson 72). If no Error Boundary sits above the form, React removes the whole form from the screen (Lesson 42). The user loses the boxes, the button, and the message at once. Keep `throw` for real breakage, such as a bug in your code, where an Error Boundary is the right place to land.

> [!TAKEAWAY]
> **Return every answer the server sends, the welcome and the rejection alike.** Returning keeps the form on screen and puts the message in state. One problem is left for Section 3: after a rejection, the boxes are still empty.

---

## SECTION | 3. Keep the User's Text After a Rejection with defaultValue

### 3.1 A reset does not blank a box: it puts back the box's starting text

Most developers picture a form reset as wiping every box blank. That picture is wrong, and it hides the fix. A reset puts each box back to its starting text, which JSX sets with `defaultValue` (Lesson 20):

```jsx title="What a reset does to two boxes"
<input name="email" /> {/* Starting text is empty, so a reset empties this box */}
<input name="email" ~defaultValue="john@mail.com"~ /> {/* Starting text is set, so a reset puts john@mail.com back */}
```

Our boxes came back empty only because their starting text was empty. So the goal changes. We do not need to stop the reset. We need each box to have the right starting text at the moment the reset runs.

### 3.2 Return the typed text as the new `defaultValue` ➔ the message shows, and the text stays

`signUp` already has everything the user typed, because the form hands it the submitted fields. So on a rejection, `signUp` returns the message together with the typed username and email. On success, it returns the welcome message with empty strings. Each box then reads its starting text from that state:

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

The order inside React makes this work. When the action finishes, React first renders `App` with the new state, which updates each `defaultValue`. Only then does it reset the form, and the reset copies that new starting text into each box. Here is the rejection of `john`:

```page caption="On rejection: the new starting text is in place before the reset, so both typed fields come back."
heading: Create account
form:
  field: Username | john | good
  field: Email | john@mail.com | good
  submit: Create account
line: Username john is taken. | bad
console: quiet
```

The user changes `john` to `john7` and clicks **Create account** again. This time the server accepts, the starting text is set to empty strings, and the same reset clears both boxes:

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

A controlled input keeps its text in React state instead of in the box (Lesson 20). The box shows whatever that state holds, and `App` renders again on every key the user presses. That cost pays off when the screen changes while the user types, such as a password-strength bar (Lesson 40):

```jsx title="Controlled input: value paired with onChange"
<input name="password" value={password} ~onChange={e => setPassword(e.target.value)}~ /> {/* React state holds the text, and App renders on every key */}
```

For ordinary sign-up fields, `defaultValue` is the simpler choice, because `App` renders only when the form is sent. With a controlled input, clearing the box after success is your job: set its state back to an empty string.

### 3.4 Do not use `value` without `onChange` ➔ the box stops accepting typing

Many developers reach for `value` out of habit. Without `onChange`, it tells React that the box must always show `state.email`. React puts that text back after every key the user presses, so nothing the user types appears. React also prints a warning in the Console:

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

When you see that warning on a form field, switch the field to `defaultValue`.

---

## SECTION | 4. With onSubmit, Clear the Boxes When the Server Answers, Not When the User Clicks

### 4.1 With `onSubmit`, React leaves the clearing to you

Many existing forms still catch the submit themselves with `onSubmit`, then run the action inside `startTransition` (Lessons 11, 41, and 66). React's automatic reset belongs to `<form action>`, so a form that uses `onSubmit` never resets on its own. After a successful sign-up, the welcome message appears, and the old text stays in both boxes:

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

`startTransition` starts the action and returns at once, without waiting for the server. So `form.reset()` on the next line runs at 0 seconds, a full second before the server answers. The boxes empty while the server is still deciding. If the server then rejects the username, the user's text is already gone.

### 4.3 Call `requestFormReset` inside `startTransition` ➔ the boxes reset when the server answers

React DOM provides `requestFormReset` for exactly this case. Call it inside the same `startTransition` as the action:

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

Inside a Transition, `requestFormReset(form)` means "reset this form when the Transition ends", not "reset it now". React waits for `signUp` to finish, renders the new starting text, and then resets, exactly as a form action does on its own.

> **`form.reset()`** ➔ resets at 0 seconds, on click · **`requestFormReset(form)`** ➔ resets when the action finishes.

### 4.4 Call `form.reset()` on click only for an instant live chat box

One screen does want the box cleared on click: a live chat built with `useOptimistic` (Lesson 44). The message appears in the chat the moment the user presses **Send**, before the server answers. An empty box at that same moment lets the user start the next message right away. On sign-up, login, and checkout forms, wait for the server with `requestFormReset`.

---

## SECTION | 5. Make Send Work Before JavaScript Finishes Loading

A user on slow train Wi-Fi receives your HTML in 0.1 seconds, while the JavaScript takes 3 seconds. Whether a tap on **Create account** at 0.5 seconds works depends on three choices: the tags you write, where the HTML is built, and where the action points.

### 5.1 Build a real `<form>` with `name` and `type="submit"`, not a `div` with `onClick`

An `onClick` handler is JavaScript, so it does nothing until JavaScript arrives. Until then, a `div` styled as a button is plain text:

```jsx title="A fake form built from a div" bad="3"
<section>
  <input value={email} onChange={e => setEmail(e.target.value)} />
  <div ~onClick={handleCreate}~>Create account</div> {/* **WRONG:** plain text until JavaScript attaches onClick */}
</section>
```

A real form does not need JavaScript to send. The browser sends every named input when the user clicks a `<button type="submit">` (Lesson 40):

```jsx title="A real HTML form" good="2,3"
<form action={formAction}>
  <input ~name="email"~ defaultValue={state.email} /> {/* The browser sends this value under the name email */}
  <button ~type="submit"~>Create account</button> {/* The browser submits the form on its own */}
</form>
```

### 5.2 A browser-only app like plain Vite cannot send early: its page is empty until JavaScript loads

Real form tags are necessary, but not enough. In a plain Vite app, the HTML the server sends holds only an empty `<div id="root"></div>` (Lesson 7). React builds the form in the browser after the JavaScript arrives, so at 0.5 seconds there is no form to tap:

```dom caption="The HTML of a plain Vite app before JavaScript loads: an empty root div and no form."
! <div id="root"></div> | note: Empty until the JavaScript arrives and React builds the form
```

### 5.3 Server HTML is not enough while the action is a browser function

With Server-Side Rendering, the server puts the finished form into the HTML, so the user sees the boxes at 0.1 seconds (Lesson 102). If the action is a function that lives in your browser JavaScript, though, the HTML has nowhere to send the data. The tap still waits for JavaScript.

### 5.4 Point the action to a URL or a Server Function ➔ Send works before JavaScript loads

Give the server-rendered form a destination the browser can reach on its own: a URL such as `"/signup"`, or a React Server Function (Lesson 110):

```jsx title="A form the browser can send by itself" good="1"
<form ~action="/signup"~ method="post"> {/* Sends with a page load before JavaScript, and without one after React takes over */}
  <input name="email" />
  <button type="submit">Create account</button>
</form>
```

A tap at 0.5 seconds now sends every named field the classic way, with a page load. When the JavaScript arrives at 3 seconds, React takes over the same form, and later submits run without a reload.

> [!DEFINITION]
> **Progressive enhancement.** Building a version that works with plain HTML first, then letting JavaScript make it smoother once it loads, is called **progressive enhancement** (as MDN defines it). Writing a real `<form>`, a `name` on every input, and a submit button costs nothing even in a Vite app, and it keeps the form ready for Server-Side Rendering later.

---

## SECTION | 6. Every Piece Together

### 6.1 The complete Create Account form

Together with the server helper from Section 2, this is the whole form, with every rule from this lesson in place:

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
