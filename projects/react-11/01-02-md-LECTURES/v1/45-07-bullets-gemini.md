# Lecture 45: Form Resets, requestFormReset, and Progressive Enhancement

*(When you click Submit, why does React empty your form, and how do you keep what the user typed?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do React 19 form actions manage automatic form resets, manual requestFormReset, and progressive enhancement?

---

## 1. React 19 Empties the Form for You When the Action Finishes

### 1.1 Classic HTML empties the boxes by loading a brand-new page

- **The full-page flash:** You fill in a form, click **Submit**, and the entire browser window goes white for a second while the screen reloads.
- **The page you knew is gone:** The browser did not clear your input boxes; it threw away the entire page and painted a brand-new HTML document from scratch.
- **Why the boxes are clean:** Those empty boxes are brand-new DOM elements born five milliseconds ago; nothing was wiped, the old page was simply destroyed.

```html title="index.html"
<form ~action="/signup"~ method="post"> <!-- Sends the named fields to /signup and loads the page the server sends back -->
  <input name="username" />
  <button type="submit">Submit</button>
</form>
```

> **Classic HTML** ➔ the browser loads a new page ➔ the new boxes start empty.

### 1.2 Plain JavaScript keeps the page, so clearing the boxes is your job

- **Stopping the white flash:** Nobody wants their screen blinking on every click, so single-page apps call `e.preventDefault()` to pin the page in place.
- **The ghost in the box:** Because the page never leaves, those exact same `<input>` tags stay glued to the screen, holding every character you typed.
- **The chore is on you:** The data flew across the network in the background, but the browser will never touch your inputs. Unless your code explicitly calls `reset()`, your old text sits there forever.

```js title="signup.js"
function handleSubmit(e) {
  ~e.preventDefault()~; // Keeps the current page, so the same boxes stay on screen
  sendDataToServer(e.currentTarget);
  ~e.currentTarget.reset()~; // Your code empties the boxes, because nothing else will
}
```

> **Plain JavaScript** ➔ the page stays ➔ the text stays until your code calls `reset()`.

### 1.3 React 19 keeps the page and clears the boxes for you

- **The best of both worlds:** React 19 stops the page reload, but brings back that clean-slate feel automatically.
- **No manual wiring:** You hand your function to `<form action={save}>` (Lesson 41) without writing `e.preventDefault()`, and React gathers the fields for you.
- **The automatic wipe:** The exact millisecond your server function resolves, React resets the form for you; no manual reset required.

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

- **The snap-clean confirmation:** You type *"Great article!"* and hit **Send**. The box snaps clean. That empty box is the app telling you that it saved your thought.
- **The phantom click problem:** Imagine if React left the text sitting there. You would stare at *"Great article!"*, wonder if your Wi-Fi dropped, and smash the button a second time.
- **Where this default shines:** On single-purpose append boxes such as chat rooms, todo lists, and comment sections, React wiping the form is the exact behavior every user expects.

### 1.5 On long forms the server can reject, we do NOT want the boxes emptied

> [!WARNING]
> **The nightmare scenario.** You spend two minutes typing your username, an email address, and shipping details on a sign-up form. The server rejects just the username because `john` is taken. React sees the server call finish, assumes the action is done, and ruthlessly blanks every single box on the page. Your valid email and address are vaporized, forcing you to retype everything. That is where React's helpful default turns into a disaster.

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

- **The silent drop:** You write `<form action={signUp}>`, type `john`, and click **Create account**. The server checks its database and answers *"Username taken"*, but your function returns that string straight into thin air.
- **The vanishing act:** React has nowhere to store that return value, so no state updates and the screen never re-renders.
- **Left in the dark:** One second later, your boxes go blank, nothing appears on screen, and the user is left wondering why account creation failed.

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

- **Giving the server a voice:** If you want a message on screen, React needs a state variable to trigger a fresh render.
- **The handoff:** You pass the action into `useActionState` (Lesson 42), which catches the return value and hands you back a live `message` state variable.
- **The error lands on screen:** You drop `{message && <p>{message}</p>}` right under the button; now the user actually sees the taken username error.
- **The remaining sting:** The message is finally there, but look at the input fields above it: both boxes are still stripped completely bare.

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

- **React does not read English:** To you and me, *"Username taken"* means the sign-up failed. To React, `signUp` simply reached its return statement and resolved its Promise.
- **A promise kept:** React does not know that a welcome greeting is a celebration and a taken username is bad news; to the engine, both mean the action completed without crashing.
- **The wipe fires anyway:** In React 19, any finished action is the green light to trigger a form reset. That is why your error message appears right above two wiped-out, empty boxes.

> **`signUp` returns a message** ➔ React counts the action as finished ➔ the message shows, and the boxes empty.

### 2.4 Do not handle an undesirable response as an error ➔ an undesirable response is still a valid response

- **The desperate hack:** You see React wiping the inputs when the Promise resolves, so you try throwing an error to make it fail and stop the wipe.
- **A taken username is not a plane crash:** The user typing an existing name is ordinary app traffic; the server did its job, the network did its job, and the answer is valid data.
- **The white screen disaster:** If you throw, `useActionState` never gets your message; instead, the crash bubbles straight up to the nearest Error Boundary (Lesson 72).
- **The vanishing form:** If you do not have an Error Boundary, React deletes the entire form from the screen (Lesson 42); never throw for expected user validation failures.

> [!TAKEAWAY]
> **Return every answer the server sends, the welcome and the rejection alike.** Returning keeps the form on screen and stores the response in state. The final challenge is keeping the user text inside the boxes during a rejection.

---

## SECTION | 3. Keep the User's Text After a Rejection with defaultValue

### 3.1 A reset does not blank a box: it puts back the box's starting text

- **The big misunderstanding:** Almost every developer thinks a form reset wipes an input to pure blank space.
- **What the browser actually does:** The HTML specification states that a reset restores an input to its starting text, which React sets with `defaultValue` (Lesson 20).
- **The empty string trap:** Our input fields went completely blank only because their initial default value was an empty string.
- **The lightbulb moment:** You never needed to stop React from resetting; you just need each box to hold the typed text as its starting value when that reset fires.

```jsx title="What a reset does to two boxes"
<input name="email" /> {/* Starting text is empty, so a reset empties this box */}
<input name="email" ~defaultValue="john@mail.com"~ /> {/* Starting text is set, so a reset puts john@mail.com back */}
```

### 3.2 Return the typed text as the new defaultValue ➔ the message shows, and the text stays

- **The action holds the keys:** Your `signUp` function already has the user's typed text inside its `formData` argument.
- **Returning the state bundle:** When the server rejects, `signUp` returns the error message bundled together with the typed values.
- **Committing before wiping:** React re-renders `App` first, which binds the user's typed words straight to the `defaultValue` props on both live inputs.
- **The reset fires safely:** Only after committing those new default values does React trigger its form reset, restoring the user's text right where they typed it.
- **Clean slate on victory:** When the user fixes their name and submits successfully, `signUp` returns empty strings for both fields, so the exact same reset clears the inputs completely.

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

- **Uncontrolled speed:** Leaving inputs uncontrolled with `defaultValue` is clean and fast because the browser DOM handles typing without waking React up.
- **When controlled inputs matter:** Storing text in state with `value` paired with `onChange` has a render cost. It is worth that cost only when the UI must react to every letter (Lesson 40).
- **The manual reset chore:** With controlled inputs, React state completely overrules the DOM, so React's automatic form reset does nothing; clearing the field after success requires manually resetting that state variable.

### 3.4 Do not use value without onChange ➔ the box stops accepting typing

- **The frozen input trap:** A developer grabs `value` instead of `defaultValue` and forgets to attach a change handler.
- **The keyboard lock:** When you set `value` without `onChange`, you tell React that the DOM element must strictly match the state value at all times.
- **Erasing on every keystroke:** Every time the user taps a key, React stomps over the new character with the unchanged state text.
- **The Console alarm:** The box feels completely dead to the user, and React screams a warning in the browser Console.
- **The quick fix:** Whenever you need an editable field that submits with a form, reach for `defaultValue`.

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

- **Stepping off the rails:** In older forms or complex pages with `<form onSubmit={handleSubmit}>`, you grab the steering wheel and call `e.preventDefault()`.
- **React steps aside:** React's built-in reset feature lives only on `<form action>`; the moment you use `onSubmit`, React promises never to touch your inputs.
- **The lingering text:** The sign-up succeeds, the welcome banner pops up, but the user's password and email remain stuck in the boxes until you write code to kick them out.

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

- **The quick-draw blunder:** You wrap your submission in `startTransition`, and on the very next line you write `form.reset()`.
- **The race condition:** `startTransition` kicks off a slow network trip in the background and returns instantly; `form.reset()` fires at 0 milliseconds, right this instant.
- **Erased before the server even wakes up:** The browser blanks the boxes while the packet is still crossing the network.
- **The gut punch:** One second later, the server replies that the username is taken; the error message appears, but the user's email was already vaporized a full second ago.

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

- **Why form.reset is too blunt:** Standard DOM `form.reset()` is a dumb hammer; it knows nothing about network latency or React state transitions.
- **Putting the reset on hold:** Calling `requestFormReset(form)` inside `startTransition` instructs React to defer the reset until the Transition finishes and commits its state.
- **The 0-second mark:** The user clicks Submit, the network call starts, and the inputs sit completely untouched while the user waits.
- **The 1-second mark:** The server rejects `john`. React re-renders, painting the user's typed name and email right into the inputs as their new starting values.
- **The safe landing:** Only now does React execute `requestFormReset(form)`, restoring the boxes to their newly committed starting values so the user's text stays right in front of them.

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

- **The fast-lane exception:** The one place you want instant 0-second clearing is a live chat box using `useOptimistic` (Lesson 44).
- **The chat muscle memory:** You hit Enter on a message, expecting the bubble to pop into the conversation thread immediately and the input box to clear instantly for your next sentence.
- **Waiting feels broken:** If a chat box made you wait for the server roundtrip before clearing, typing would feel sluggish and unnatural.
- **The takeaway:** Clear instantly at 0 seconds for optimistic live chat; wait for the server with `requestFormReset` for everything else.

---

## SECTION | 5. Make Send Work Before JavaScript Finishes Loading

### 5.1 Build a real form with name and type="submit", not a div with onClick

- **The slow train ride:** A user on a spotty mobile connection downloads your HTML in 100 milliseconds, but the JavaScript bundle takes three full seconds to arrive.
- **The dead click trap:** A styled `div` with an `onClick` listener is completely lifeless until JavaScript boots; tapping it at 500 milliseconds does nothing at all.
- **Browser-native muscle:** A semantic HTML `<form>` with a submit button and named inputs does not need a single line of JavaScript to function (Lesson 40).

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

- **The empty shell:** Writing proper form tags in a client-only Vite app still cannot save you on slow connections.
- **The blank root:** The initial HTML delivered by the server holds only an empty `<div id="root"></div>` (Lesson 7).
- **Nothing to click:** The form does not exist in the initial document; until client JavaScript executes and mounts React, there is literally no form on screen to tap.

```dom caption="The HTML of a plain Vite app before JavaScript loads: an empty root div and no form."
! <div id="root"></div> | note: Empty until the JavaScript arrives and React builds the form
```

### 5.3 Server HTML is not enough while the action is a browser function

- **Painted but stranded:** Server-Side Rendering paints the form in the initial HTML in 100 milliseconds (Lesson 102), displaying the inputs immediately.
- **Nowhere to send:** If `<form action={myFunction}>` points to a browser function living in your client bundle, the browser has no target endpoint to submit to before that bundle loads.
- **The tap waits:** Clicking the button still does nothing until client JavaScript downloads and attaches the handler.

### 5.4 Point the action to a URL or a Server Function ➔ Send works before JavaScript loads

- **Giving the browser a destination:** Point your server-rendered form to a real backend URL like `"/signup"` with `method="post"`, or back it with a React Server Function (Lesson 110).
- **Instant baseline:** When the user taps **Create account** at 500 milliseconds, the browser performs a classic HTTP POST without waiting for client JavaScript.
- **Seamless takeover:** When the client JavaScript bundle finishes loading at 3 seconds, React hydrates the form; all future submissions happen smoothly without page reloads.

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
