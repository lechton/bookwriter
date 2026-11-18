# Lecture 45: Form Resets, requestFormReset, and Progressive Enhancement

*(How does a form keep what the user typed when the server refuses it, and how does it reset after success?)*

> INTERVIEW QUESTION | ❱ MORE | How do React 19 form actions manage automatic form resets, manual requestFormReset, and progressive enhancement?

---

## VS | Automatic Form Reset vs. defaultValue From State: React resets after every action that does not throw

> When a form sends its fields to an action function, the server can still refuse them, like a username that is already taken or a fully booked date. **You should write the action function so that it returns what the user typed, together with the error message.** Because the action function ended without throwing, React resets the form even after a refusal, so without that return value, the user has to type everything all over again.

**Key idea: the reset puts each input back to its default value. To keep the user's text after a refusal, make that text the default value: the action returns it in state, and each input reads it through `defaultValue`.**

In plain JavaScript, when your code handles the submit event and stops the page reload, the browser leaves every field exactly as the user typed it. If you want the form to start over, your code must call the form's own `reset()` method. React 19 reverses that habit. When you pass a function to the `action` prop of a `<form>`, React resets every uncontrolled field as soon as that function finishes without throwing.

That automatic reset is exactly what you want after a success. The user sends a message or creates an account, and every input clears for the next entry. But the same reset also fires after a refusal, because React never reads the message your action returns. **React asks one question only: did the action throw? A refusal for the user is still a success for React.**

Suppose a user fills out a registration form with a username and an email address. They click **Create account**. The server checks the database and replies that the username is taken. To you and the user, that is a failure. Inside your action, you caught that validation response and returned an error message. The function returned normally instead of throwing, so React treats the action as a success. React displays your message, and at the same moment, it wipes every uncontrolled field clean. The email address the user typed correctly is gone, and they must retype the whole form.

**Why:** React does not inspect the text inside your returned message. It checks one physical condition: did the action throw an error? If the function returns normally, React resets every input to its default value. If an input has no default value, the reset leaves it empty. The fix is not to stop the reset. The fix is to make the user's text the default value, so the reset restores it.

> [!NOTE]
> **What you already know:** [REVIEW] `defaultValue` sets the starting text of an uncontrolled input, and the browser holds the text after that (Lesson 20). `useActionState` keeps what an action returns as state and gives you the dispatcher; the action receives the previous state first, then the form data (Lesson 42). The browser builds a `FormData` object from every named field at submit time (Lesson 40).

### A Form Action in Two Lines of Code

Here are the two tools side by side:

```jsx title="The automatic reset vs. defaultValue from state"
<form ~action={signUp}~> {/* React resets all uncontrolled fields when signUp returns without throwing */}
  <input name="email" ~defaultValue={state.email}~ /> {/* The reset restores the email returned in state */}
</form>
```

> [!DEFINITION]
> **What is the automatic reset?** [NEW] The automatic reset is a React 19 mechanism that resets every uncontrolled field in a form after its `action` function finishes without throwing an error (Lesson 41). React calls the browser's own `HTMLFormElement.reset()` method on the form element, so each uncontrolled input returns to its default value (Lesson 45).

> [!DEFINITION]
> **What is a default value?** [NEW] A default value is the text an input goes back to when its form resets. It is not the text currently on the screen. It is the starting text the browser stored for that input. In React, the `defaultValue` prop sets this starting text on an uncontrolled input (Lesson 20).

```tree caption="How React interprets an action return vs. how the user sees it."
What a returned refusal means
- !For the user | The server refused the submission | Expects the typed email **to stay in place**
- +For React | The action returned without throwing | The action **succeeded**, so React **resets the form**
```

### The Smallest Action: Submitting a Username

Here is an uncontrolled input inside a form with an action:

```jsx title="src/App.jsx"
function save(formData) {
  console.log(formData.get('username')); // Prints the submitted username
}

export default function App() {
  return (
    <form ~action={save}~> {/* React calls save and resets uncontrolled fields upon completion */}
      <input name="username" />
      <button type="submit">Save</button>
    </form>
  );
}
```

The user types `john` and clicks Save:

```page width=text caption="The form before clicking Save, with john typed into the input."
form:
  field: Username | john
  submit: Save
console: quiet
```

```page width=text caption="After clicking Save: the Console prints john, and React empties the input."
form:
  field: Username | | good
  submit: Save
log: john | App.jsx:2
```

The user types `john`, and React builds a `FormData` object from the named input. React calls `save` with that object, so the Console prints `john`. Then `save` returns without throwing, and React resets the form. The input had no `defaultValue`, so the reset leaves it empty. No line of our code called a reset method, and the page did not reload.

### The Rule of Thumb: Return Typed Values on Refusal

**Always return submitted field values in state on refusal, and wire them to `defaultValue`.**

When an action rejects a submission, return both the error message and the submitted field values in the action state. Pass those values to each input through `defaultValue`. React still runs its automatic reset, but now the reset restores the user's text instead of blank space.

A senior developer also knows the three classic mistakes:
1. **Writing `value` instead of `defaultValue`.** Writing `value={state.email}` without an `onChange` handler freezes the input, rendering it read-only and preventing the user from typing.
2. **Throwing an error to stop the reset.** Throwing an error aborts the action and triggers the nearest Error Boundary, replacing your entire form with a crash screen.
3. **Calling `form.reset()` at the start of an action.** Calling the browser's native `form.reset()` immediately clears all inputs before the server even responds, wiping out the user's input before you know whether the submission succeeded.

The rest of the lesson shows how each piece works on a real registration form.

## SECTION | The Create Account Form

Our page is a user registration form: a username input, an email input, and a Create account button.

```page width=text caption="The Create account form when the page opens."
heading: Create account
form:
  field: Username |
  field: Email |
  submit: Create account
console: quiet
```

We simulate server validation with `api.js`. It waits one second and refuses the username `john`, just like a real database rejecting a duplicate account.

```files title="create-account: File Explorer" caption="How the files of our Create account form sit inside src/."
index.html | entry | The HTML document where React mounts into the root container
src/
  main.jsx | boundary | Mounts App into the root DOM element
  App.jsx | form | Displays the registration form and calls useActionState
  api.js | stand-in server | Exports createAccount to simulate server validation
```

**PRINCIPLES:** React resets uncontrolled form fields after every action that does not throw. Five practical principles follow:
1. **Principle 1: <form action>: React Automatically Resets Uncontrolled Fields When the Action Succeeds.** React resets all uncontrolled fields after an action returns without throwing.
2. **Principle 2: return error: A Returned Error Counts as a Success and Still Resets the Form.** Returning an error message does not throw, so React resets the form and clears every input.
3. **Principle 3: defaultValue: Reading Returned Text From State Restores Input Values After the Reset.** Feeding submitted text back through `defaultValue` ensures the reset restores what the user typed.
4. **Principle 4: requestFormReset: React DOM Resets Uncontrolled Fields by Hand Inside a Transition.** Submissions using event handlers require `requestFormReset` from React DOM to coordinate resets with state updates.
5. **Principle 5: name and type="submit": Standard HTML Form Elements Keep Working Before JavaScript Loads.** Building forms with native elements ensures submissions still work on slow networks before bundles load.

---

## PRINCIPLE | <form action>: React automatically resets uncontrolled fields when the action succeeds

> [!PRINCIPLE]
> **Principle 1: The Automatic Reset: Successful Form Actions Clear Uncontrolled Fields**
>
> *When a function passed to `<form action>` finishes without throwing an error, React automatically resets every uncontrolled field in the form.*
>
> In React 19, submitting a form through the `action` prop does not reload the page. React intercepts the submission, builds a `FormData` object from every named field, and runs the action inside a Transition. When the action returns without throwing, React calls the form element's own `reset()` method. Every uncontrolled input goes back to its default value. A controlled input with `value` and `onChange` is not reset at all, because React state owns its text.
>
> **DO THIS:**
> ```jsx
> function save(formData) {
>   console.log(formData.get('username'));
> }
> <form action={save}>
>   <input ~name="username"~ /> {/* Uncontrolled input resets automatically after save finishes */}
>   <button type="submit">Save</button>
> </form>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <form action={save}>
>   <input name="username" ~value={name}~ onChange={e => setName(e.target.value)} /> {/* **WRONG:** a controlled input ignores the form reset, so you must clear its state yourself */}
>   <button type="submit">Save</button>
> </form>
> ```

### How React Resets Uncontrolled Fields Upon Completion

When you pass a function to the `action` prop of a `<form>`, React takes over the submission lifecycle (Lesson 41).

In a traditional HTML form, clicking a submit button makes the browser send the form and load a new page. React 19 stops that navigation. It builds a `FormData` object from the form, runs your action inside a Transition, and keeps the user on the same page.

When the action returns, React checks one thing: did it throw? If the answer is no, React calls the DOM `reset()` method on the form element. That step is the **automatic reset**.

The reset touches only uncontrolled fields. An uncontrolled input keeps its text in the browser, with no React state behind it. A controlled input keeps its text in React state through `value` and `onChange`. The DOM reset cannot change React state, so a controlled field stays as it is. It also renders on every keystroke.

For an uncontrolled input, the reset restores the default value the input had when it first rendered. If the input started with no default value, the reset leaves it blank.

```jsx title="Uncontrolled input vs. controlled input"
<input name="username" /> {/* Uncontrolled: the browser holds the value and React resets it */}
<input name="username" value={name} onChange={e => setName(e.target.value)} /> {/* Controlled: state holds the value */}
```

**The reset follows the owner of the text: the browser for an uncontrolled input, React state for a controlled one.**

---

## PRINCIPLE | return error: a returned error message counts as a success and still resets the form

> [!PRINCIPLE]
> **Principle 2: Action Return Values: Returning an Error Message Still Triggers a Form Reset**
>
> *An action that returns an error message completes normally without throwing, so React treats it as a success and resets the form.*
>
> React cannot read the meaning of the string or object your action returns. It only distinguishes an action that completes normally from one that throws an uncaught error. When server validation rejects an input, returning an error string like `'Username is taken'` is standard practice with `useActionState`. Because the function returned normally, React runs the automatic reset and displays the error at the same time.
>
> **DO THIS:**
> ```jsx
> if (error) {
>   ~return error;~ // Returns error string as state, allowing the component to render feedback cleanly
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> if (error) {
>   ~throw new Error(error);~ // **WRONG:** throwing an error crashes into the nearest Error Boundary instead of showing inline validation
> }
> ```

### Building the Registration Action

Now we build the Create account form. First, `api.js` simulates a server endpoint. It checks the submitted username against a list, waits one second with `setTimeout`, and resolves with an error message if the name is `john`:

```js title="src/api.js"
const takenUsernames = ['john'];

export function createAccount(username) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (~takenUsernames.includes(username)~) { // Checks whether username is taken
        resolve(`Username ${username} is taken.`);
      } else {
        resolve(null);
      }
    }, 1000);
  });
}
```

The `includes` method is the array method that asks whether the list already holds the name.

Next, the component uses `useActionState` (Lesson 42). The action `signUp` reads the form data, awaits `createAccount`, and returns the error message if the server rejects the name:

```jsx title="src/App.jsx"
import { useActionState } from 'react';
import { createAccount } from './api.js';

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const error = await createAccount(username);
  if (error) {
    ~return error;~ // Returned normally: React counts this as a successful action
  }
  return `Welcome, ${username}!`;
}

export default function App() {
  const [message, formAction] = useActionState(signUp, '');

  return (
    <form ~action={formAction}~> {/* React resets the form after signUp completes */}
      <h1>Create account</h1>
      <label>Username <input name="username" /></label>
      <label>Email <input name="email" /></label>
      <button type="submit">Create account</button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

`useActionState` calls `signUp` with the previous state first, then the form data. It returns the current state and the dispatcher you pass to the form. The React docs also call that dispatcher `dispatchAction`. The action returns the error as a normal value. It does not throw.

### The Surprise on Refusal

Watch what happens when the user types `john` and `john@mail.com`, then clicks **Create account**:

```page width=text caption="One second after clicking Create account: the refusal line appears and both inputs are wiped."
heading: Create account
form:
  field: Username | | bad
  field: Email | | bad
  submit: Create account
line: Username john is taken. | bad
console: quiet
```

**The error line and the empty fields appear together. The form looks like a failure, but React treated the action as a success.** Here is the exact sequence:
1. The user types `john` into the username field and `john@mail.com` into the email field, then submits.
2. React calls `signUp` inside a Transition with `formData`.
3. The server helper `createAccount` pauses for one second and resolves with `'Username john is taken.'`.
4. `signUp` executes `return error`.
5. React receives the returned string and updates `message` in state.
6. Because `signUp` returned normally without throwing, React considers the action complete and runs the automatic reset.
7. Both inputs reset to their initial empty values.

The user typed their email address correctly, yet React wiped it out alongside the invalid username. Now the user has to type everything again.

### Why Throwing an Error Is Not the Answer

A junior developer might think: "If returning an error triggers the reset, I will throw an error instead!"

```jsx title="Returning an error vs. throwing an error"
if (error) {
  ~return error;~ // Returns data: becomes state and allows user to recover
}

if (error) {
  ~throw new Error(error);~ // **WRONG:** crashes the component tree to the nearest Error Boundary
}
```

It might seem tempting, but throwing an error causes far worse problems. In React, throwing an error during rendering or action processing interrupts normal execution. Instead of displaying the message inline, React unmounts the form and hands the crash to the nearest Error Boundary (Lesson 72). If your application lacks an Error Boundary, the screen goes completely white.

Expected validation refusals must always be returned as data, never thrown as unhandled exceptions (Lesson 42). The solution is not to prevent the reset. The solution is to make the reset work in our favor.

---

## PRINCIPLE | defaultValue: reading returned text from state restores input values after the reset

> [!PRINCIPLE]
> **Principle 3: Preserving Input: defaultValue Restores User Text When the Form Resets**
>
> *To retain what the user typed after a server refusal, return the submitted values in action state and bind them to `defaultValue`.*
>
> React provides no flag to disable the automatic reset on form actions. But a reset does not empty an input by itself. It restores the input to its default value. By returning the submitted fields alongside the error message in `useActionState`, the component can give those values to the inputs through `defaultValue`. When React resets the form, each input returns to the user's text. On a successful submission, the action returns empty values, so the same reset clears the form.
>
> **DO THIS:**
> ```jsx
> <input name="email" ~defaultValue={state.email}~ /> {/* Resets to the user's previously typed email after a refusal */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <input name="email" ~value={state.email}~ /> {/* **WRONG:** setting value without onChange freezes the field and blocks typing */}
> ```

### Making the User Text the Default Value

React gives you no setting to turn off the automatic reset for an action. But remember what a reset actually does: it restores each input to its default value.

By default, an `<input />` has an empty default value. That is why the reset leaves it blank. Change the default value to the text the user submitted, and the reset restores that text instead.

In React, you set the starting default value of an uncontrolled input with the `defaultValue` prop (Lesson 20):

```jsx title="No defaultValue vs. defaultValue from state"
<input name="email" /> {/* Form reset clears the field */}
<input name="email" ~defaultValue={state.email}~ /> {/* Form reset restores whatever state.email holds */}
```

**Both inputs receive the exact same reset. The only difference is the value the reset returns to.**

### Expanding State to Hold Form Fields

To give the inputs default values, we expand the action state into an object that holds the message, username, and email:

```jsx title="src/App.jsx" startLine="4"
const initialState = { message: '', username: '', email: '' };

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const error = await createAccount(username);
  if (error) {
    return ~{ message: error, username, email }~; // Returns the user's text on refusal
  }
  return ~{ message: `Welcome, ${username}!`, username: '', email: '' }~; // Clears fields on success
}
```

The returned object uses JavaScript shorthand property names. When an object key matches the name of a local variable, you write the identifier once:

```js
{ message: error, username, email } // shorthand: the key and the variable share one name
{ message: error, username: username, email: email } // the same object, written out
```

The success line uses a template literal. The backticks build one string, and `${username}` inserts the submitted name into it.

Now we connect `defaultValue` on each input to our state:

```jsx title="src/App.jsx" startLine="16"
export default function App() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form action={formAction}>
      <h1>Create account</h1>
      <label>Username <input name="username" ~defaultValue={state.username}~ /></label> {/* Restores username on refusal */}
      <label>Email <input name="email" ~defaultValue={state.email}~ /></label> {/* Restores email on refusal */}
      <button type="submit">Create account</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

`defaultValue` gives each uncontrolled input a starting text. The input stays uncontrolled, so the user can type normally, and React does not render on every keystroke.

### Refusal Keeps Text, Success Clears Text

Look at the elegance of this pattern. On refusal, `signUp` returns the submitted values, and the reset restores them:

::: row caption="The registration form after a refusal vs. after a success, using defaultValue from state."
::: col title="After refusal" tag="text preserved" tone=good
```page size=mini
heading: Create account
form:
  field: Username | john | good
  field: Email | john@mail.com | good
  submit: Create account
line: Username john is taken. | bad
console: quiet
```
The user fixes the username and submits again.
:::
::: col title="After success" tag="form cleared" tone=good
```page size=mini
heading: Create account
form:
  field: Username |
  field: Email |
  submit: Create account
line: Welcome, john7! | good
console: quiet
```
On success, empty values clear the form for the next entry.
:::
:::

The reset is identical in both columns. The only change is the default value the action returned. After a refusal, the default value is the user's text, so the reset restores it. After a success, the default value is empty, so the reset clears the form.

### Why value Freezes the Input

Why can you not simply write `value={state.email}`?

In React, passing `value` to an input without an `onChange` handler turns that input into a controlled read-only element (Lesson 20). The field freezes completely:

```page width=text caption="Passing value without onChange locks the email input and triggers a React warning."
heading: Create account
form:
  field: Username |
  field: Email | | bad
  submit: Create account
console: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
```

The user cannot click into the field to add, change, or delete a single character.

A controlled input with `value` and `onChange` is a different tool. It renders on every keystroke, which suits a live hint. Here, `defaultValue` is the right tool because the browser holds the text and React renders only when the action returns.

The `useActionState` docs also name two other ways to reset the state. You can send a reset signal to the action, or change a `key` so the component remounts with fresh state (Lesson 25). In a server-rendered app, the state your action returns must be serializable, because it travels from the server to the browser (Lesson 110).

---

## PRINCIPLE | requestFormReset: React DOM resets uncontrolled fields by hand inside a Transition

> [!PRINCIPLE]
> **Principle 4: Manual Form Resets: requestFormReset Coordinates Resets With Transitions**
>
> *When you submit a form outside the action prop, call `requestFormReset(form)` inside a Transition to ask React for the same reset.*
>
> Forms submitted through conventional event handlers like `onSubmit` do not trigger React's automatic form reset. If a component dispatches the action state update manually inside `startTransition`, the inputs keep their submitted values even after a successful completion. The browser's native `form.reset()` clears the inputs immediately, before server validation finishes. In contrast, `requestFormReset(form)` from `react-dom` schedules the reset to run with the Transition commit, so the inputs clear only after the action completes.
>
> **DO THIS:**
> ```jsx
> startTransition(() => {
>   formAction(new FormData(form));
>   ~requestFormReset(form)~; // Resets uncontrolled inputs when the action transition completes
> });
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> startTransition(() => {
>   formAction(new FormData(form));
> });
> ~form.reset()~; // **WRONG:** clears fields immediately before the server responds, destroying inputs prematurely
> ```

### Submitting Forms Without the action Prop

Many production codebases migrate older forms to React 19 step by step. An existing form often relies on `onSubmit` with `e.preventDefault()` (Lesson 11).

You can still trigger the action state dispatcher manually. The React documentation says an action dispatcher must be called inside an action or a Transition, so you wrap the call in `startTransition` (Lesson 67):

```jsx title="src/App.jsx" startLine="1"
import { useActionState, startTransition } from 'react';
import { createAccount } from './api.js';
```

```jsx title="src/App.jsx" startLine="16"
export default function App() {
  const [state, formAction] = useActionState(signUp, initialState);

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(() => {
      ~formAction(new FormData(form))~; // Runs signUp, but no automatic reset occurs
    });
  }

  return (
    <form ~onSubmit={handleSubmit}~> {/* No action prop: React does not reset this form automatically */}
      <h1>Create account</h1>
      <label>Username <input name="username" defaultValue={state.username} /></label>
      <label>Email <input name="email" defaultValue={state.email} /></label>
      <button type="submit">Create account</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

Now submit with a valid username `john7`. The action completes and returns a welcome message.

Look at the result on screen:

```page width=text caption="Submitting via onSubmit without a manual reset leaves old text in the fields after success."
heading: Create account
form:
  field: Username | john7 | bad
  field: Email | john@mail.com | bad
  submit: Create account
line: Welcome, john7! | good
console: quiet
```

The welcome line appears, but the inputs still hold `john7` and `john@mail.com`.

**React resets a form automatically only when the form was submitted through the `action` prop. A form submitted through `onSubmit` gets no automatic reset.** That is why the old text stays.

### Coordinating Manual Resets with requestFormReset

To reset the form manually, developers might reach for the browser's native `form.reset()` method. But calling `form.reset()` runs immediately and synchronously:

```jsx title="The browser reset vs. React DOM reset"
import { requestFormReset } from 'react-dom';

~form.reset()~; // Browser method: wipes inputs immediately, before the server answers
~requestFormReset(form)~; // React DOM function: coordinates reset with the Transition commit
```

If you call `form.reset()` immediately in your click handler, the form wipes clean the moment the user clicks, long before the server replies. If the server then refuses the username, the user's input was destroyed a full second earlier.

To solve this, React DOM provides `requestFormReset`. It tells React to schedule a form reset that synchronizes with the pending Transition:

```jsx title="src/App.jsx" startLine="1"
import { useActionState, startTransition } from 'react';
import { ~requestFormReset~ } from 'react-dom'; // Imported from react-dom
import { createAccount } from './api.js';
```

```jsx title="src/App.jsx" startLine="20"
  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(() => {
      formAction(new FormData(form));
      ~requestFormReset(form)~; // Requests a coordinated reset when the transition commits
    });
  }
```

Calling `requestFormReset(form)` inside `startTransition` coordinates the reset with the completion of the action. When the action finishes, React applies the state update and resets the form in the same coordinated pass.

---

## PRINCIPLE | name and type="submit": standard HTML form elements keep working before JavaScript loads

> [!PRINCIPLE]
> **Principle 5: Progressive Enhancement: Native Form Elements Work Without JavaScript**
>
> *Use genuine `<form>` elements with named inputs and submit buttons so submissions can function before JavaScript executes.*
>
> Progressive enhancement gives every user a basic version that works, then adds the richer version when the browser can run it. A browser natively understands how to collect named inputs inside a `<form>` and send them when the user clicks a `<button type="submit">`. A form built from custom `<div>` tags and inline click handlers is inert until client JavaScript downloads and executes. Semantic HTML keeps the form operable on slow connections and in server-rendered pages.
>
> **DO THIS:**
> ```jsx
> <form action={formAction}>
>   <input ~name="email"~ /> {/* Native name attribute allows browsers to extract data independently */}
>   <button ~type="submit"~>Create account</button> {/* Native submit button triggers submission without custom event listeners */}
> </form>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <section>
>   <input value={email} onChange={e => setEmail(e.target.value)} />
>   <div ~onClick={handleCreate}~>Create account</div> {/* **WRONG:** div elements cannot trigger native form submissions before scripts load */}
> </section>
> ```

### The Baseline of Web Forms

Imagine a user on a mobile device with a slow connection. The initial HTML document has loaded, but the client JavaScript bundle is still downloading over the network. The user fills out the form and taps **Create account**.

Will the form submit?

That depends entirely on how the form is constructed:

```jsx title="A form with a URL action vs. a form with a function action"
<form ~action="/signup"~ method="post"> {/* The browser sends named fields to /signup natively */}
<form ~action={formAction}~> {/* Only React can call formAction, requiring JavaScript to execute */}
```

The browser understands HTML form mechanics. If a form has a URL action and the post method, the browser packages every named input into an HTTP request and sends it directly.

When `action` holds a JavaScript function like `formAction`, only React can invoke it. Until the client JavaScript bundle downloads and executes, clicking submit does nothing in a purely client-rendered application.

### Progressive Enhancement and Graceful Degradation

Designing applications to function at a basic level before adding rich client logic is called **progressive enhancement**.

Progressive enhancement establishes a dependable baseline of core functionality for all users. You then layer advanced interactivity on top as browser capabilities and network speeds allow. It is related to graceful degradation, which focuses on allowing complex systems to degrade smoothly when errors occur.

To support progressive enhancement, every form requires four native ingredients:
1. **A genuine `<form>` element.**
2. **A `name` attribute on every field.** The browser uses this attribute as the key in the submitted form data.
3. **A native submit button**, written as `<button type="submit">`.
4. **An action the browser can dispatch**, such as an endpoint URL or a Server Function in a full-stack framework.

Our form already includes the first three elements. Giving inputs a `name` attribute costs nothing and allows `new FormData(form)` to extract values with JavaScript (Lesson 40).

A form built this way is **progressively enhanced**: it works as plain HTML first, and React adds the richer behavior when the JavaScript runs.

### Client-Only Vite vs. Server Rendering

In a client-only Vite application, the server initially sends an empty HTML file:

```dom caption="What the browser Elements panel shows before client scripts execute in Vite."
! <div id="root"></div> | note: Empty container until client scripts download and execute
```

Before `main.jsx` runs, there is no form on screen at all (Lesson 07).

In modern full-stack frameworks, React renders the initial HTML on the server with server-side rendering (Lesson 102). The user sees the form immediately. A Server Component can render the form (Lesson 108), and a Client Component can render it as well when the page needs browser interactivity. When the form's action is a Server Function marked with `'use server'`, React prepares the form for early submissions (Lesson 110).

If a user submits before hydration finishes, the browser can send the form natively, and React can replay the submission once hydration completes (Lesson 137). The `permalink` option gives the browser a real URL to navigate to when the form is submitted before hydration. After the page becomes interactive, the option has no effect.

Semantic HTML prepares the app for progressive enhancement without a major rewrite later.

---

## All 5 Principles Together

### The Complete Registration System

Here is the complete registration flow. First, our stand-in server simulation in `api.js`:

```js title="src/api.js"
const takenUsernames = ['john'];

export function createAccount(username) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (takenUsernames.includes(username)) {
        resolve(`Username ${username} is taken.`);
      } else {
        resolve(null);
      }
    }, 1000);
  });
}
```

Here is the finished registration component in `App.jsx`. It passes the action dispatcher to the form element, returns user input upon validation refusal, and binds fields to `defaultValue`:

```jsx title="src/App.jsx"
import { useActionState } from 'react';
import { createAccount } from './api.js';

const initialState = { message: '', username: '', email: '' };

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const error = await createAccount(username);
  if (error) {
    return { message: error, username, email }; // Principle 2: returns submitted text on refusal
  }
  return { message: `Welcome, ${username}!`, username: '', email: '' };
}

export default function App() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form ~action={formAction}~> {/* Principle 1: React resets the form after action completion */}
      <h1>Create account</h1>
      <label>Username <input ~name="username"~ defaultValue={state.username} /></label> {/* Principle 5: named input for progressive enhancement */}
      <label>Email <input name="email" ~defaultValue={state.email}~ /></label> {/* Principle 3: defaultValue restores text after reset */}
      <button ~type="submit"~>Create account</button> {/* Principle 5: native submit button */}
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

### Lifecycle of a Form Action

Here is the exact step-by-step lifecycle when the user submits the registration form:

```tree dir=right caption="Lifecycle of a form submission from click to reset."
User clicks Create account
- +1. Browser builds data [`FormData`] | Collects **all named inputs**
- +2. React invokes action in Transition [`await createAccount`] | Executes server validation **asynchronously**
- +3. Action returns state [`{ message, username, email }`] | Returns **without throwing**
- +4. React renders component [`defaultValue={state.email}`] | Inputs receive **updated default values**
- +5. React executes automatic reset | Inputs restore **to default values** | User text **preserved**
```

**The whole lesson in one sentence: React resets the form after every action that does not throw. The reset restores the default value, so the user's text must become the default value.**

| The Situation | The Plain Habit | The React Rule |
| :--- | :--- | :--- |
| **A successful action** | Empty every field by hand at the end of the handler | React resets every uncontrolled field after a function in `<form action>` returns |
| **A refusal from the server** | Expect inputs to retain text because the server rejected the data | A returned error is a success for React, which triggers an automatic reset |
| **Preserving user input** | Assign state to `value` without an `onChange` handler | Return text in state and bind to `defaultValue`, so the reset restores it |
| **Submitting with `onSubmit`** | Call `form.reset()` immediately in the click handler | Call `requestFormReset(form)` inside the Transition to coordinate with state updates |
| **Supporting slow connections** | Use non-semantic elements with custom click handlers | Use semantic `<form>`, named inputs, and submit buttons for progressive enhancement |

---

## For the Interview

> **The Interview Question:** How do React 19 form actions manage automatic form resets, manual requestFormReset, and progressive enhancement?

### How to Answer Clearly in 30 Seconds

"When a function is passed to `<form action>`, React intercepts the submission, builds a `FormData` object, and runs the action in a Transition. When the action returns without throwing, React resets every uncontrolled field. A returned validation error is not an exception, so React treats a refusal as a success and resets the form anyway. Three rules follow:
1. **Keep the text on refusal.** The reset restores each field to its default value, so the action returns the submitted values in `useActionState` state and each input reads them through `defaultValue`.
2. **Reset a form submitted with `onSubmit` by hand.** No automatic reset happens there. Call `requestFormReset(form)` from `react-dom` inside a Transition to coordinate the reset with the state update.
3. **Build the form from native HTML.** A real `<form>`, a `name` on every field, and a submit button let the browser send the form before JavaScript loads. Progressive enhancement supplies the baseline, and React adds the richer behavior when the bundle runs."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Our registration form clears the email field whenever a username is taken. Why does this happen, and how do you resolve it?"**
   React automatically resets uncontrolled form fields after any action that does not throw an error. Returning an error message string from an action completes normally, so React triggers the automatic reset. To resolve this, return the submitted field values alongside the error message in your action state. Bind each input to `defaultValue={state.field}`. When the automatic reset fires, it restores the field to the returned value rather than blank. Do not use `value` without `onChange`, because that freezes the input as read-only.
2. **"What is the physical difference between calling `form.reset()` and calling `requestFormReset(form)`?"**
   Calling the browser's native `form.reset()` method executes immediately and synchronously, clearing input fields before asynchronous server validation completes. Calling `requestFormReset(form)` from `react-dom` inside a Transition schedules the reset to execute when the Transition commits. This ensures that the reset occurs simultaneously with the state update, mirroring the timing of React's automatic action resets.
3. **"Can a form using a React 19 action function submit successfully before client JavaScript downloads?"**
   In a client-only Vite application, no form exists in the DOM until client scripts execute and mount into the root container. However, in a full-stack framework with server-side rendering, the form is rendered into initial HTML. If the form uses native `<form>`, named inputs, and a submit button, the browser submits data natively. Setting the action to a URL or a Server Function using `'use server'` allows HTTP POST submissions before client bundles download. With `useActionState`, React can also replay submissions entered before hydration completes.

```tree caption="Summary of form field behavior across different submission approaches."
How form inputs behave upon submission
- !Uncontrolled input without default value | Automatic reset restores empty initial value | User text **lost on refusal**
- +Uncontrolled input with `defaultValue` from state | Automatic reset restores returned text | User text **preserved on refusal**
- +Controlled input with `value` and `onChange` | Input ignores automatic form resets | Requires **manual state reset**
```
