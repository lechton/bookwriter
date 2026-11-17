# Lecture 45: Form Resets, requestFormReset, and Progressive Enhancement

*(When you click Submit, why does React empty your form, and how do you keep what the user typed?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do React 19 form actions manage automatic form resets, manual requestFormReset, and progressive enhancement?

---

## When the User Clicks Submit, Who Empties the Boxes on the Form?

### 1. Classic HTML: the browser reloads the page, so every box comes back empty

In plain HTML, when you type into a `<form>` and click Submit, the browser sends your data and reloads the entire page from scratch. Nothing runs a special command to clear your text: every `<input>` box comes back empty simply because the browser loaded a brand-new page.

```html title="index.html"
<form ~action="/signup"~ method="post"> <!-- Browser sends the data to /signup and reloads the entire page -->
  <input name="username" />
  <button type="submit">Submit</button>
</form>
```

> **Click Submit** ➔ browser reloads the whole page ➔ every box comes back empty.

### 2. Plain JavaScript: you stop the reload, so the text stays in the boxes

Reloading the whole page on every click is slow, so in plain JavaScript you attach an `onSubmit` function and call `e.preventDefault()`. That stops the browser from reloading the page while your JavaScript code sends the data. Because the page never reloaded, whatever the user typed stays inside the `<input>` boxes after Submit, unless your code explicitly clears them with `form.reset()`:

```js title="signup.js"
function handleSubmit(e) {
  ~e.preventDefault()~; // Stops the browser from reloading the page
  sendDataToServer(e.currentTarget);
  ~e.currentTarget.reset()~; // Clears the text inside every box on the form by hand
}
```

> **Click Submit** ➔ your code stops the reload ➔ text stays in the boxes unless you call `form.reset()`.

### 3. Modern React: React stops the reload, and still empties every box automatically

In React 19, you skip `onSubmit` and pass your function straight into `<form action={save}>` (Lesson 41):

```jsx title="src/App.jsx"
export default function CommentForm() {
  return (
    <form ~action={save}~> {/* React stops the reload, runs save, and empties every box when save finishes */}
      <input name="comment" />
      <button type="submit">Send</button>
    </form>
  );
}
```

When the user clicks **Send**, React stops the page reload and runs `save`. Look at what happens next: you never wrote `e.preventDefault()`, and you never called `form.reset()`. Yet the instant `save` finishes running, **all the text inside every `<input>` box disappears.**

Wait: why would React delete the user's text when you never asked it to?

Because this is intentional default design. Picture sending a comment under a blog post. You type a message, click **Send**, the input text disappears from your box, and your new comment appears under the blog post. That is the normal default behavior of a form. Otherwise, every **Send** would leave your old message sitting inside the box, and it would not even feel like you sent anything.

> **Click Submit** ➔ React stops the reload and runs `save` ➔ React empties every box automatically, mimicking classic HTML without reloading the page.

> [!WARNING]
> **Where this default becomes frustrating:** Emptying the box makes sense when you send a blog comment, yet it becomes frustrating when a form holds data like your email address, username, and contact details. If the server rejects even one field, React still empties every box on the form, and the user has to write all of them again from scratch.

---

## SECTION | When the Server Rejects a Field: Did the Submit Succeed? Yes and No

Picture a Create account form with two boxes: Username and Email. Our test server in `api.js` waits one second, rejects the username `john` because someone already took it, and accepts every other username:

```js title="src/api.js"
const takenUsernames = ['john'];

export function createAccount(username) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (~takenUsernames.includes(username)~) { // Rejects john and returns a plain message string
        resolve('Username ' + username + ' is taken.');
      } else {
        resolve(null);
      }
    }, 1000);
  });
}
```

Now watch what happens on screen. The user types `john` and `john@mail.com`, then clicks **Create account**:

```page caption="The Create account form after the user types john and john@mail.com, right before clicking."
heading: Create account
form:
  field: Username | john
  field: Email | john@mail.com
  submit: Create account
console: quiet
```

One second later, the server answers `"Username john is taken."` That message appears at the bottom, and at the exact same moment **both boxes go completely blank**:

```page caption="One second after clicking: the server rejects john, and React empties both boxes anyway."
heading: Create account
form:
  field: Username | | bad
  field: Email | | bad
  submit: Create account
line: Username john is taken. | bad
console: quiet
```

There was nothing wrong with `john@mail.com`, yet the Email box is empty too. The user must type both fields all over again.

### Why React emptied the boxes: NO for the user, YES for React

When the server answered `"Username john is taken."`, did the form submission succeed? **Yes and no**, depending on who you ask:

- **NO in real life, for the user:** No account was created. The user only wants to change `john` to `john7` and click **Create account** again.
- **YES in JavaScript, for React:** React cannot read English sentences to tell good news from bad news. React only checks whether your JavaScript function ran to the end without crashing. Because your function finished normally, React counts the job as done and empties every `<input>` box.

> **User submits john** ➔ server replies `"Username john is taken."` ➔ your function finishes without crashing ➔ React counts the run as finished and empties every box.

### Path A: Send the server's answer back as a normal message, using `return`

To show a server message on the page, you connect your form function to React state with `useActionState` (Lesson 42). Whatever value your `signUp` function returns becomes the new `message` displayed under the button:

```jsx title="src/App.jsx" bad="6"
import { useActionState } from 'react';
import { createAccount } from './api.js';

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const error = await createAccount(username);
  if (error) {
    ~return error~; // **WRONG:** displays the message, yet returns only the message so React empties both boxes
  }
  return 'Welcome, ' + username + '!';
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

Returning the message puts `"Username john is taken."` onto the screen, which is what we want. Because `return` ends the function normally without crashing, React also empties both boxes right away, which we will fix in Part 3.

### Path B: Wait, what if you handle the response like a classic error, using `throw`?

Every JavaScript developer knows classic error handling with `throw new Error()`. If React empties the form whenever your function finishes normally, why not crash on purpose with `throw` when the username is taken? Would that leave the boxes alone?

```jsx title="src/App.jsx" bad="4"
async function signUp(previousState, formData) {
  const username = formData.get('username');
  const error = await createAccount(username);
  if (error) {
    ~throw new Error(error)~; // **WRONG:** skips useActionState and crashes the entire <form> off the screen!
  }
  return 'Welcome, ' + username + '!';
}
```

Do not do this! When your function runs `throw new Error(error)`, React treats it as an unexpected application crash, not a polite form message. React skips `useActionState` completely and sends the crash up to the nearest Error Boundary (Lesson 72). With no Error Boundary above `App`, **React removes the entire `<form>` from the screen** (Lesson 42).

> **Return with `return`** ➔ shows the message and keeps the form ➔ **DO THIS.** **Crash with `throw`** ➔ removes the entire `<form>` from the screen ➔ **DO NOT DO THIS.**

> [!TAKEAWAY]
> **A taken username is normal user input, not a program crash.** Always use `return` so `useActionState` can show the message under the form. That leaves us with one clear question: if you *must* use `return`, and `return` *always* makes React reset the form, how can you keep the user's typed words inside the boxes?

---

## SECTION | If React Always Resets the Form, How Do You Keep What the User Typed?

### First, look at what "resetting a form" actually means to the browser

Most people assume that resetting a form wipes every `<input>` box completely blank. That is a myth. **When the browser resets a form, it puts every `<input>` box back to its starting text**, which JSX writes as `defaultValue` (Lesson 20):

```jsx title="Two inputs during a browser reset"
<input name="email" /> {/* No starting text: a reset puts this box back to "" */}
<input name="email" ~defaultValue="john@mail.com"~ /> {/* Starting text set: a reset puts "john@mail.com" right back into the box */}
```

Your boxes only went blank earlier because you gave them no starting text at all! Once you see how a reset works, the fix clicks into place. Right before React resets the form, make the user's typed words the new `defaultValue` of each box.

> **Reset a box with no starting text** ➔ box goes blank · **Reset a box with `defaultValue`** ➔ box goes right back to `defaultValue`.

### How to keep the user's words in three steps

Two separate places hold data here: React holds the state object returned by `signUp`, and the browser holds each `<input>` box on the page. Connect them in three steps:

1. **Grab what the user typed and return it with the message:** inside `signUp`, read both submitted fields from `formData`, and return them alongside the message when the server says no.
2. **Plug those returned words in as each box's starting text:** pass the returned username and email into `defaultValue` on the two `<input>` tags.
3. **Let React run its automatic reset as usual:** React updates `defaultValue` first and resets each box right after, putting `john` and the user's email right back into the boxes!

```jsx title="src/App.jsx" good="9,11,21,22"
import { useActionState } from 'react';
import { createAccount } from './api.js';

const initialState = { message: '', username: '', email: '' };

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const error = await createAccount(username);
  if (error) {
    return ~{ message: error, username, email }~; // Server said NO: keeps typed words as the new starting text
  }
  return ~{ message: 'Welcome, ' + username + '!', username: '', email: '' }~; // Server said YES: sets starting text back to empty
}

export default function App() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form action={formAction}>
      <h1>Create account</h1>
      <label>Username <input name="username" ~defaultValue={state.username}~ /></label> {/* Reset restores john on rejection */}
      <label>Email <input name="email" ~defaultValue={state.email}~ /></label> {/* Reset restores john@mail.com on rejection */}
      <button type="submit">Create account</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

Watch how that single setup handles **both** server answers automatically. First, the user submits the taken name `john`, and one second later both typed fields stay right on screen above the rejection message:

```page caption="When the server rejects john: defaultValue holds the typed strings, so React's reset puts both back."
heading: Create account
form:
  field: Username | john | good
  field: Email | john@mail.com | good
  submit: Create account
line: Username john is taken. | bad
console: quiet
```

Next, the user changes `john` to `john7` without retyping the email address, and clicks **Create account** again. Now the server says yes, `signUp` returns empty strings, and the exact same reset clears both boxes cleanly:

```page caption="When the user fixes john to john7 and submits again: signUp returns empty strings, so both boxes clear."
heading: Create account
form:
  field: Username | | good
  field: Email | | good
  submit: Create account
line: Welcome, john7! | good
console: quiet
```

> **Server says NO** ➔ return typed strings ➔ reset keeps the user's text · **Server says YES** ➔ return empty strings ➔ reset clears the boxes.

### Wait: developers usually put text into an input box with `value`. Why use `defaultValue` instead?

When developers want text inside an `<input>`, they often reach for `value` out of habit. Compare the three ways to wire text into an `<input>` inside `<form action>`, and see what happens to the user in each case:

#### Choice 1: Set only the starting text and let the user type freely, with `defaultValue`

```jsx title="Uncontrolled input with defaultValue" good="1"
<input name="email" ~defaultValue={state.email}~ /> {/* Browser handles typing; React wakes up only on Submit */}
```

The browser lets the user type freely without re-rendering `App` on every letter (Lesson 40). When the submit finishes, React updates `defaultValue` and restores `state.email`.

> **Choice 1 · `defaultValue={state.email}`** ➔ user types freely, zero extra renders, reset restores text ➔ **DO THIS for normal form boxes.**

#### Choice 2: Lock the box to one fixed text with no way to update it, using `value` alone

```jsx title="Locked input: value with no onChange" bad="1"
<input name="email" ~value={state.email}~ /> {/* **WRONG:** locks the box to state.email so the user cannot type a single letter */}
```

Passing `value={state.email}` without `onChange` tells React that this box must display *only* that state string, forever (Lesson 20). When the user clicks inside the Email box and presses keys on the keyboard, **zero letters appear**, and React logs a read-only warning:

```page width=full caption="With value={state.email} and no onChange: the Email box is frozen solid and React prints a Console warning."
heading: Create account
form:
  field: Username |
  field: Email | | bad
  submit: Create account
console: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
```

> **Choice 2 · `value={state.email}` without `onChange`** ➔ freezes the keyboard solid ➔ **DO NOT DO THIS.**

#### Choice 3: Update React state on every single keystroke, with `value` and `onChange`

```jsx title="Controlled input: value paired with onChange"
<input name="password" value={password} ~onChange={e => setPassword(e.target.value)}~ /> {/* Re-renders on every letter; React never resets controlled boxes */}
```

Pairing `value` with `onChange` builds a classic controlled input (Lesson 20). Because React state owns its text, a browser form reset ignores controlled boxes completely, so the text stays across a rejection too. However, `App` re-renders on every single keystroke. Use a controlled box only when the screen must update live as the user types, such as a red-or-green password-strength bar (Lesson 40).

> **Choice 3 · `value` + `onChange`** ➔ skips React's reset, re-renders on every letter ➔ **DO THIS ONLY when the UI reacts to every keystroke.**

---

## SECTION | Catching Submit the Old-Fashioned Way with onSubmit: When Should You Clear the Boxes?

Not every form in a codebase uses `<form action={formAction}>` yet. Older React forms often catch the click themselves with `<form onSubmit={handleSubmit}>` and call `e.preventDefault()` (Lessons 11 and 41).

That changes one big rule. With `<form action={formAction}>`, React owns the submit and resets the boxes automatically. When you catch the submit yourself with `onSubmit`, **React steps back and never resets the boxes on its own**. Look at the three ways developers try to handle that reset:

### Try 1: Never clear the boxes at all

Inside the submit handler, your code calls `formAction` inside `startTransition` (Lesson 66), and calls no reset function at all. When the user submits `john7` and the server accepts it, `"Welcome, john7!"` appears at the bottom, yet the old text stays stuck inside both boxes:

```page caption="An onSubmit form with no reset call: Welcome appears, yet the submitted text stays stuck in both boxes."
heading: Create account
form:
  field: Username | john7 | bad
  field: Email | john@mail.com | bad
  submit: Create account
line: Welcome, john7! | good
console: quiet
```

> **Try 1 · Never clear the boxes** ➔ old text stays stuck after success, making Submit look broken ➔ **DO NOT DO THIS.**

### Try 2: Clear the boxes immediately on click, with plain `form.reset()`

To clear those stuck boxes, developers often add `form.reset()` right inside `handleSubmit`:

```jsx title="src/App.jsx" bad="7"
function handleSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  startTransition(() => {
    formAction(new FormData(form));
  });
  ~form.reset()~; // **WRONG:** empties every box at 0 seconds, while the server still takes 1 second to answer!
}
```

Watch the clock here. The browser runs `form.reset()` **at 0 seconds**, the instant the user clicks the button, while `createAccount` is still waiting **1 full second** for the server! The user sees their text vanish before anyone even knows whether the server accepted it. If `john` was taken, the boxes go empty for one second and then pop back in a second later.

> **Try 2 · `form.reset()` on click** ➔ empties every box at 0s before the server has even answered ➔ **DO NOT DO THIS when waiting for server validation.**

### Try 3: Ask React to wait and reset only when the server finishes, with `requestFormReset`

React DOM gives you `requestFormReset(form)` so `onSubmit` forms get that exact same end-of-action reset. Import `requestFormReset` from React DOM and call it inside `startTransition`:

```jsx title="src/App.jsx" good="2,10"
import { useActionState, startTransition } from 'react';
import { ~requestFormReset~ } from 'react-dom'; // Imported from react-dom

function handleSubmit(e) {
  e.preventDefault();
  const form = e.currentTarget;
  startTransition(() => {
    formAction(new FormData(form));
    ~requestFormReset(form)~; // Waits 1s for formAction to finish, updates defaultValue, then resets!
  });
}
```

Now React holds off during the 1-second server check. The moment `signUp` returns, React updates `defaultValue` and resets the form in one step. That keeps the text when the server says no, and clears the boxes when the server says yes.

> **Try 3 · `requestFormReset(form)` inside `startTransition`** ➔ waits for the server, updates `defaultValue`, and resets right on time ➔ **DO THIS on `onSubmit` forms.**

### Wait: is clearing the box at 0 seconds with `form.reset()` ever what you want?

Yes, on one specific kind of screen: **a live chat box**. When you press **Send** in a chat app using `useOptimistic` (Lesson 44), your message jumps straight into the chat list at 0 seconds. There, you want the typing box empty immediately so the user can start typing their next message without waiting for the server. On sign-up, login, or checkout forms where the server might reject a field, wait for the server instead.

---

## SECTION | Slow Wi-Fi: What Happens When the User Clicks Submit Before JavaScript Downloads?

Imagine a user on slow train Wi-Fi opening your sign-up page on a phone. The HTML arrives in 0.1 seconds, while the JavaScript bundle takes 3 full seconds to download. What happens if the user fills out the boxes and taps **Create account** during those 3 seconds?

### First: did you build a real HTML form, or a fake form out of `div` tags?

Before JavaScript downloads, click handlers like `onClick` do not exist yet. If you built a "fake" form out of generic `<div>` tags and inputs with no `name`, tapping the button on slow Wi-Fi does nothing at all:

```jsx title="Fake form built from divs" bad="3"
<section>
  <input value={email} onChange={e => setEmail(e.target.value)} />
  <div ~onClick={handleCreate}~>Create account</div> {/* **WRONG:** dead text on screen until JavaScript finishes downloading */}
</section>
```

When you build a real HTML `<form>` with named inputs and a `type="submit"` button, the browser already knows how to send every field without JavaScript (Lesson 40):

```jsx title="Real HTML form tags" good="2,3"
<form action={formAction}>
  <input ~name="email"~ defaultValue={state.email} /> {/* Browser labels this value as "email" */}
  <button ~type="submit"~>Create account</button> {/* Triggers native browser form submission without onClick */}
</form>
```

> **Fake `<div>` form** ➔ dead on screen until JavaScript loads ➔ **DO NOT DO THIS.** **Real `<form>` with `name`** ➔ browser submits every field natively ➔ **DO THIS.**

### Wait: if `action={formAction}` is a JavaScript function, how could the browser run it before JavaScript downloads?

Trick question: **the browser cannot run a JavaScript function before JavaScript downloads**! Whether that early tap works depends on where your HTML is built, and where `action` sends the data:

#### Setup 1: A browser-only React app, like plain Vite

In a plain Vite app, the server sends an `index.html` file holding only an empty `<div id="root"></div>` (Lesson 7). Until the JavaScript bundle finishes downloading at 3.0 seconds, the screen is completely blank:

```dom caption="The HTML page in a plain Vite app before JavaScript downloads: an empty #root div."
! <div id="root"></div> | note: Empty until client JavaScript downloads and mounts App
```

> **Setup 1 · Browser-only Vite app** ➔ screen is blank until JavaScript loads ➔ **there is no form on screen to tap yet.**

#### Setup 2: Server sends the HTML form first, yet `action` is a browser-only function

With Server-Side Rendering, the server sends the finished `<form>` HTML at 0.1 seconds, so the commuter sees the boxes right away (Lesson 102). However, if `action={clientFn}` is a plain function living only inside your browser JavaScript bundle, the submit still has to wait until JavaScript arrives.

> **Setup 2 · Server HTML + browser-only function** ➔ user sees the form at 0.1s, yet submitting still waits for JavaScript.

#### Setup 3: Server sends the HTML form first, AND `action` points to the server

When a server-rendered `<form>` points to a URL string like `action="/signup"` or a React Server Function (Lesson 110), the HTML carries a real server destination:

```jsx title="A form destination the browser can reach without client JavaScript" good="1"
<form ~action="/signup"~ method="post"> {/* At 0.1s the browser posts to /signup; after hydration React upgrades it */}
  <input name="email" />
  <button type="submit">Create account</button>
</form>
```

Now both moments on the train work seamlessly:
- **At 0.1 seconds, before JavaScript arrives:** the browser sends every `name` field to `/signup` the classic HTML way, with a page reload, so the user's submit still goes through!
- **At 3.0 seconds, once JavaScript arrives:** React takes over that exact same `<form>` and upgrades future submits to smooth, no-reload updates, and `useActionState` can even replay submissions queued right before hydration finished (Lesson 137).

> [!DEFINITION]
> **Progressive enhancement.** Building a basic HTML version that works on its own first, and letting JavaScript upgrade it to a smoother experience once scripts finish loading, is called **progressive enhancement** (as MDN defines it). Even in a plain Vite app today, writing `<form>`, `name` on every `<input>`, and `<button type="submit">` costs zero extra work and makes your form ready for Server-Side Rendering later.

---

## SECTION | Every Piece Together on One Page

### 1. The complete Create Account component

Paired with `api.js` from Part 2, here is the complete `App.jsx` component with every piece working together:

```jsx title="src/App.jsx" good="11,13,20,22,23,24"
import { useActionState } from 'react';
import { createAccount } from './api.js';

const initialState = { message: '', username: '', email: '' };

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const error = await createAccount(username);
  if (error) {
    return ~{ message: error, username, email }~; // Returns message + typed words instead of throwing
  }
  return ~{ message: 'Welcome, ' + username + '!', username: '', email: '' }~; // Clears starting text on success
}

export default function App() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form ~action={formAction}~> {/* Stops page reload and resets boxes automatically when signUp finishes */}
      <h1>Create account</h1>
      <label>Username <input ~name="username"~ defaultValue={state.username} /></label> {/* Named field; restores username on rejection */}
      <label>Email <input name="email" ~defaultValue={state.email}~ /></label> {/* Restores email on rejection, clears on success */}
      <button ~type="submit"~>Create account</button> {/* Real HTML submit button */}
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

### 2. Every decision in one glance: human goal first, code second

| What You Want to Do | DO THIS | DO NOT DO THIS |
| :--- | :--- | :--- |
| **Clear the form after a normal submit** | Pass your function to `<form action={fn}>` and let React clear uncontrolled boxes when `fn` finishes | Call `form.reset()` manually inside `fn` before the server answers |
| **Show a server rejection message** | Return `{ message, ...typedFields }` as normal state for `useActionState` | Run `throw new Error(message)`, which skips state and crashes the `<form>` off the screen |
| **Keep typed words on screen after a rejection** | Pass returned state into `<input defaultValue={state.email} />` so React's reset puts the words back | Write `<input value={state.email} />` with no `onChange`, which freezes the keyboard |
| **Reset an old-fashioned `onSubmit` form after the server answers** | Call `requestFormReset(form)` from `'react-dom'` inside `startTransition` | Call `form.reset()` on click at 0s, unless emptying an optimistic live chat box |
| **Let slow-Wi-Fi users submit before JavaScript downloads** | Combine Server-Rendered HTML + `<form>` + `name` + `<button type="submit">` + URL or Server Function | Build fake forms with `<div onClick>` or expect client-only Vite to show HTML before JavaScript loads |

---

## For the Interview

> **The Interview Question:** How do React 19 form actions manage automatic form resets, manual requestFormReset, and progressive enhancement?

### How to Answer Clearly in 30 Seconds

"When you pass a function to `<form action>`, React stops the page reload and runs your function inside a Transition. Whenever that function finishes without throwing an unhandled error, React automatically resets every uncontrolled `<input>` back to its `defaultValue`. Because returning a validation message finishes the function normally, React still resets the form on server rejections. To keep what the user typed without crashing the form, the action returns the submitted fields in `useActionState`, and each input binds `defaultValue` to that state. On rejection the reset puts the user's text back, and on success returning empty strings clears the boxes. For older `onSubmit` forms, call `requestFormReset(form)` from `'react-dom'` inside `startTransition` so the reset waits for the server instead of wiping on click like `form.reset()`. Finally, progressive enhancement works before JavaScript loads when Server-Side Rendering sends `<form>`, `name`, and `<button type="submit">` backed by a URL or Server Function."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"When our server says a username is already taken, our React 19 form wipes the user's email box too. Why did that happen, and how do you fix it?"**
   React cannot tell whether a returned string is good news or bad news. It resets every uncontrolled field whenever the `<form action>` function finishes without throwing. Never `throw new Error()` to stop the reset, because throwing skips `useActionState` and crashes the form into the nearest Error Boundary. Instead, return `{ message, username, email }` from the action and pass `defaultValue={state.email}` to the input. A browser reset restores each input to its `defaultValue`, not to an empty string. React updates `defaultValue` first and puts the user's email right back on rejection, while returning empty strings on success clears the form.
2. **"What is the difference between `form.reset()` and `requestFormReset(form)`?"**
   Both restore uncontrolled fields to their `defaultValue`, yet they run at different moments. Plain JavaScript's `form.reset()` wipes the boxes at 0 seconds on click, before an async server check answers; that fits only optimistic UI like a live chat box. Calling `requestFormReset(form)` from `'react-dom'` inside `startTransition` waits until the Transition finishes. It updates `defaultValue` from the new state first, and resets the instant the server's answer arrives. You only need `requestFormReset` on `onSubmit` forms, since `<form action>` runs that timed reset automatically.
3. **"Does `<form action={myFunction}>` submit before JavaScript finishes loading?"**
   Not in a client-only app like plain Vite, where the server sends an empty `<div id="root"></div>` and `myFunction` lives only in the JavaScript bundle. For a user on slow Wi-Fi to submit before JavaScript loads, the server must render the `<form>` HTML ahead of time. Every input needs a `name`, the button needs `type="submit"`, and `action` must point to a URL or a React Server Function. Once JavaScript finishes loading, React upgrades that same form to smooth no-reload submissions.
