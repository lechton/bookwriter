# Lecture 45: Form Resets, requestFormReset, and Progressive Enhancement

*(Why does a form forget what the user typed after the server says no, and how do you keep it?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do React 19 form actions manage automatic form resets, manual requestFormReset, and progressive enhancement?

---

## VS | A Server Rejection for the User vs. a Completed Action for React: React automatically resets uncontrolled fields whenever an action resolves without an unhandled error

> When a form submits to an action, the server can still reject the data. A username might be taken, or an entered code might be invalid. **You should write the action function to return the submitted values alongside the error message**. Because the action finished without throwing an unhandled exception, React resets the form automatically. Without those returned values in state, the user loses their entered text and must type everything again.

In standard browser JavaScript, invoking `form.reset()` restores every form field to its initial value. In React 19, assigning a function to the `action` attribute changes this behavior. React automatically resets the form whenever that action function finishes without throwing an unhandled exception. When saving a profile or posting a comment, clearing the form is convenient. However, when the server rejects a submission with a validation error, React still executes that exact same reset. To preserve the user's text after a rejection, your action must return the submitted values, and your component must pass them into `defaultValue`.

Consider a registration form requesting a username and an email address. The user types values into both inputs and clicks Submit. The server responds that the chosen username is already taken. At that exact moment, both input fields go blank. Why does React clear the form if registration failed? React does not inspect server validation logic. It only detects that your action function resolved without an unhandled error, so it marks the submission complete and resets the form.

**Why this matters:** React does not interpret the human meaning of your server response. It only knows that the action promise completed without crashing. React therefore resets every uncontrolled field to its default value. Here is the core conflict: a validation rejection for the user counts as a completed action for React. If the action returns the submitted field values in its state, the next render supplies them to `defaultValue`, restoring the user's text on screen.

### Back to `form.reset()`

Consider the native DOM reset method. Browsers provide `form.reset()` on every HTML form element. Calling it reverts all inputs to their starting text:

```js title="Resetting a form in plain JavaScript"
const form = document.getElementById('signup');
~form.reset()~; // Every field goes back to the text it started with
```

In Lesson 41, an `onSubmit` handler had to trigger this method manually. With React 19 form actions, you never need to write that line. React resets uncontrolled fields automatically as soon as the action function finishes:

```jsx title="The same reset in React"
<form ~action={save}~> {/* React calls save, then resets the form when save ends */}
```

> [!DEFINITION]
> **The action of a form.** [REVIEW] In native HTML, the `action` attribute specifies a destination URL. The browser submits the form data there and triggers a full page navigation.
> 1. In React 19, the `action` attribute also accepts an asynchronous function: `<form action={save}>`.
> 2. When the user submits the form, React intercepts the native submit event and collects the inputs into a `FormData` object.
> 3. React executes `save` within an asynchronous Transition without reloading the browser page.
> 4. When `save` completes without throwing an unhandled error, React automatically resets all uncontrolled fields in the form (Lesson 41).

Automatic form resets work smoothly for successful submissions. Now observe what happens when a submission fails validation.

Here is a Create account form. The user enters `john` and `john@mail.com`, then clicks Create account:

```page caption="The Create account form after the user has typed a username and an email, before the click."
heading: Create account
form:
  field: Username | john
  field: Email | john@mail.com
  submit: Create account
console: quiet
```

One second later, an error banner reports that the username is taken. At that exact moment, both inputs clear:

```page caption="The same form one second after the click: the refusal line, and two empty fields."
heading: Create account
form:
  field: Username | | bad
  field: Email | | bad
  submit: Create account
line: Username john is taken. | bad
console: quiet
```

The email address was completely valid. Now the user must type it all over again.

Why did this wipe occur? To the user, a message like `Username john is taken.` represents a rejection. To React, it represents a successful execution.

React never inspects the content of the string or object your action returns. It checks only one condition: did the function throw an unhandled error? A returned validation error is a normal return value, not an exception. Because the function finished normally, React treats the submission as successful and triggers the automatic reset.

```tree caption="The same answer from the server, read by the user and by React."
What `Username john is taken.` means
- !For the user | The server **said no** | The user expects to **fix one word** and try again
- +For React | The action **returned a value** and **did not throw** | The action **succeeded**, so React **resets the form**
```

What does this automatic reset restore? It restores the default value of each field.

> [!DEFINITION]
> **The default value of a field.** [NEW] Every uncontrolled `<input>` element maintains two separate values in the browser. The first is its current interactive value, which updates as the user types. The second is its default value, which records its initial text.
> 1. In native HTML, you declare initial text with `value="John"`. In React, you declare initial text with `defaultValue="John"` (Lesson 20).
> 2. Because `defaultValue` leaves the field uncontrolled, the user can type and edit text freely without triggering component renders.
> 3. When a reset occurs, the browser discards the typed text and restores the field to its default value.
> 4. A field without `defaultValue` reverts to an empty string (Lesson 45).

Our two input fields specified no default values, so the automatic reset empties them completely.

This reveals the central architectural lesson. You cannot disable React's automatic post-action reset on `<form action>`. However, you control what the reset restores. If your action returns the entered text and assigns it to `defaultValue`, the reset restores the user's input.

### The Rule of Thumb: what is the default value of this field?

**Ask one question about every uncontrolled input: what is its default value? After the action completes, that default value is what the user sees.**

Developers often assume React resets a form only when a database record is created. React does not evaluate business logic. React resets uncontrolled inputs whenever an action function finishes without throwing an unhandled exception.

Two distinct concerns affect the user experience:
1. **After a validation error**, the user must retype the entire form unless the submitted values are preserved.
2. **On a slow network connection**, the user may submit the form before client JavaScript finishes downloading. Whether that submission succeeds depends on how the form is constructed.

There are three ways to manage form values across submissions:
1. **`defaultValue` backed by action state**. This is the idiomatic React 19 approach for forms using `<form action>` and `useActionState`. The inputs remain native HTML elements, supporting progressive enhancement before client scripts execute.
2. **Controlled inputs using `value` and `onChange`** (Lesson 20). React never resets a controlled input because component state strictly determines the visible text. This approach fits inputs requiring real-time validation on every keystroke.
3. **`onSubmit` paired with `requestFormReset`** (Lessons 11 and 41). React does not reset forms submitted through `onSubmit` automatically. Your code explicitly invokes `requestFormReset` when the action completes. This fits legacy forms undergoing migration to React Actions.

```tree caption="Three ways to keep the user's text after the server says no."
Three ways to keep the text after a refusal
- +1. `defaultValue` from state [`defaultValue={state.email}`] | React **still resets** the form | The reset **puts back** the text the action returned
- +2. `value` and `onChange` [`value={email}`] | React **does not reset** a controlled field | The page **renders on every keystroke**
- +3. `onSubmit` and `requestFormReset` [`e.preventDefault`] | **No automatic reset** happens | Your code **asks for the reset** when the action ends
```

## SECTION | A Create Account Form with a Username and an Email

Our example application is a registration form in a small Vite project. It contains a Username input, an Email input, and a Create account button.

The server is simulated by a helper function that waits one second and rejects the username `john`. A production API rejects duplicate usernames in this exact manner.

```files title="create-account: File Explorer" caption="How the files of our Create account form sit inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it into `#root`
  App.jsx | form | Exports `App` as default and imports `createAccount` from `./api.js`
  api.js | stand-in server | Exports `createAccount`, which waits one second and refuses `john`
```

Here is the simulated server implementation:

```js title="src/api.js"
const takenUsernames = ['john'];

export function createAccount(username) {
  return new Promise(resolve => {
    setTimeout(() => {
      if (~takenUsernames.includes(username)~) { // john is taken
        resolve(`Username ${username} is taken.`);
      } else {
        resolve(null); // Any other name is free
      }
    }, 1000);
  });
}
```

The function `createAccount` returns a Promise. After one second, it resolves with an error message if the name is `john`, and `null` for any other name. The component awaits this Promise.

Each principle below explores one stage of this form, demonstrating how it breaks and how to repair it:

**PRINCIPLES:** When an action function finishes without an unhandled error, React resets the form. That reset restores every uncontrolled input to its default value. Five principles explain this workflow:
1. **Principle 1: A Successful Action Empties the Form.** React resets uncontrolled fields after the function in `<form action>` resolves. No manual reset code is required.
2. **Principle 2: A Returned Error Is a Success for React.** Returning a validation error resolves the action normally, clearing input fields as the error message renders.
3. **Principle 3: `defaultValue` From State Brings the Text Back.** The action returns the submitted input values, and the reset restores them into each field.
4. **Principle 4: `requestFormReset` Resets a Form Submitted Through `onSubmit`.** React does not reset forms submitted through `onSubmit` automatically, so your code requests the reset explicitly.
5. **Principle 5: `name` and a Submit Button Let the Browser Send the Form Alone.** A form can submit before client JavaScript loads only when built using standard HTML elements.

---

## PRINCIPLE | `action={save}`: React resets every uncontrolled field after save returns

> [!PRINCIPLE]
> **Principle 1: A Successful Action Empties the Form**
>
> *When the function passed to `<form action>` completes without throwing an unhandled error, React resets every uncontrolled field in that form.*
>
> No line of application code clears the fields, and the page does not reload. React invokes the action function with submitted form data. When the action finishes, React restores every uncontrolled field to its default value. A controlled field is not affected by this reset because its value is driven by React state.
>
> **DO THIS:**
> ```jsx
> <form action={save}>
>   <input ~name="username"~ /> {/* Uncontrolled: React empties it after save returns */}
>   <button type="submit">Save</button>
> </form>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <form action={save}>
>   <input name="username" ~value={name}~ onChange={e => setName(e.target.value)} /> {/* **WRONG:** a controlled field is not reset, so john stays after Save */}
>   <button type="submit">Save</button>
> </form>
> ```

Start with the smallest form that uses an action: one input, one submit button, and a function that reads the submitted text.

```jsx title="src/App.jsx"
function save(formData) {
  console.log(formData.get('username')); // Prints john
}

export default function App() {
  return (
    <form ~action={save}~> {/* React calls save with the form data on submit */}
      <label>Username <input name="username" /></label>
      <button type="submit">Save</button>
    </form>
  );
}
```

The user types `john` and clicks Save:

```page caption="The small form before the click, with john typed into the Username field."
form:
  field: Username | john
  submit: Save
console: quiet
```

```page caption="The same form right after the click: the Console shows john, and the field is empty."
form:
  field: Username | | good
  submit: Save
log: john | App.jsx:2
```

The input field is empty, and the page did not reload. Here is the exact sequence of events:
1. The user clicked Save. React intercepted browser submission and called `save` with the `FormData`.
2. The function `save` logged `john` and finished without throwing an unhandled error.
3. Because the action succeeded, React triggered an automatic form reset. Every uncontrolled field returned to its default value.
4. Because the input specified no default value, it reverted to an empty string.

This is the exact same reset as native `form.reset()`, which earlier lessons invoked manually (Lesson 41). The React documentation defines this rule directly: after an action function completes successfully, all uncontrolled input elements inside the form are reset. For React, a successful action means the function finished without throwing an unhandled exception.

A vital distinction to remember is the term uncontrolled. A standard `<input name="username" />` is uncontrolled, meaning the browser DOM stores its internal value (Lesson 40). A field using `value` and `onChange` is controlled, meaning React state dictates its display (Lesson 20). Because a form reset does not modify React component state, a controlled input still displays `john` after Save.

Remember: whenever an action finishes without an unhandled error, React automatically resets the form.

---

## PRINCIPLE | `return error`: the refusal line appears, and React still resets the form

> [!PRINCIPLE]
> **Principle 2: A Returned Error Is a Success for React**
>
> *An action that returns an error message resolves normally for React, causing React to clear uncontrolled fields at the exact moment the error message appears.*
>
> React does not evaluate the human meaning of an action's return value. It only determines whether the function threw an unhandled error. Expected validation errors, such as a duplicate username, should be returned as state values, exactly as the React documentation recommends. Because the function returns normally, React resets the form, wiping user input at the exact moment the error banner renders. Throwing an error instead does not preserve the text: an unhandled thrown error crashes the form and activates the nearest Error Boundary.
>
> **DO THIS:**
> ```jsx
> if (error) {
>   ~return error;~ // The refusal line appears; Principle 3 brings the text back
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> if (error) {
>   ~throw new Error(error);~ // **WRONG:** no refusal line: the nearest Error Boundary replaces the form
> }
> ```

Now let's examine the complete registration component. The interface needs to display server feedback below the submit button, so it manages that response with `useActionState`.

> [!DEFINITION]
> **useActionState.** [REVIEW] The `useActionState` Hook manages state updated by an asynchronous form action.
> 1. Calling `useActionState(signUp, '')` returns two items: the current state and a wrapped action dispatcher `formAction`.
> 2. You attach `formAction` to the form element: `<form action={formAction}>`.
> 3. On submission, React executes `signUp` with two arguments: the previous state and the submitted `FormData`.
> 4. Whatever value `signUp` returns becomes the new state, triggering a re-render to display the update.
> 5. Expected validation failures, like an unavailable username, are returned as normal state rather than thrown as exceptions (Lesson 42).

```jsx title="src/App.jsx"
import { useActionState } from 'react';
import { createAccount } from './api.js';

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const error = await createAccount(username);
  if (error) {
    ~return error;~ // Returned, not thrown: for React, the action succeeded
  }
  return `Welcome, ${username}!`;
}

export default function App() {
  const [message, formAction] = useActionState(signUp, '');

  return (
    <form ~action={formAction}~> {/* React resets the form after signUp returns */}
      <h1>Create account</h1>
      <label>Username <input name="username" /></label>
      <label>Email <input name="email" /></label>
      <button type="submit">Create account</button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

The variable `message` stores the most recent value returned by `signUp`. Prior to submission, it holds the initial empty string, so no banner renders.

**The error banner and the empty fields appear simultaneously.** Here is the complete execution order:
1. The user enters `john` and `john@mail.com`, then clicks Create account.
2. React executes `signUp`, passing the previous state and the collected `FormData`.
3. The helper `createAccount` pauses one second, then returns `'Username john is taken.'`.
4. The action `signUp` returns that error string. Because it returned without throwing, React treats the submission as successful.
5. React re-renders `App` with the new state, displaying `Username john is taken.`.
6. React executes the post-action form reset, leaving both input fields completely empty.

```page caption="The Create account form one second after the click with the username john."
heading: Create account
form:
  field: Username | | bad
  field: Email | | bad
  submit: Create account
line: Username john is taken. | bad
console: quiet
```

The developer console remains quiet because no JavaScript exception occurred.

This bug frequently escapes detection during manual testing. A developer testing with an available name, such as `john7`, sees the welcome greeting and two cleared fields. That is the desired behavior following a successful registration. The defect only surfaces when a real user enters invalid data and loses everything they typed.

One further detail deserves attention. The automatic reset modifies only the DOM input fields on the screen. It does not alter the state stored in `useActionState`. As a result, `message` continues to hold the rejection string, and the error banner stays visible.

### VS | `return error` vs. `throw new Error(error)`: only a returned value becomes state

A developer encountering this issue might attempt to prevent the reset by throwing an exception instead of returning a value:

```jsx title="With return error and with throw new Error"
if (error) {
  ~return error;~ // Returned: React treats it as a normal answer
}

if (error) {
  ~throw new Error(error);~ // **WRONG:** thrown: React treats it as an unexpected error
}
```

Both statements halt the execution of `signUp`. However, only a returned value is recorded as component state:
- **With `return error`**, React stores the returned message in state, renders the error banner, and executes the form reset.
- **With `throw new Error(error)`**, the message never becomes state. React routes the thrown exception to the nearest Error Boundary (Lesson 72). Because our application lacks an Error Boundary, the entire component unmounts and disappears (Lesson 42).

Throwing an exception removes both the input fields and the error banner from view. Returning the error message remains the correct architectural choice. To keep the user's input visible, the data must be preserved through state, as demonstrated in Principle 3.

---

## PRINCIPLE | `defaultValue` from state: the reset puts back what the user typed

> [!PRINCIPLE]
> **Principle 3: defaultValue From State Brings the Text Back**
>
> *To keep user input after a validation rejection, return the submitted values inside the action state and connect each field's `defaultValue` to that state.*
>
> The automatic post-action reset cannot be disabled on `<form action>`. However, the reset strictly restores each field to its current default value. When the action returns the user's entered text and the component assigns those values to `defaultValue`, the reset restores the typed content. After a successful submission, the action returns empty values, allowing the exact same reset mechanism to clear the form.
>
> **DO THIS:**
> ```jsx
> <input name="email" ~defaultValue={state.email}~ /> {/* After a refusal, the field shows john@mail.com again */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <input name="email" ~value={state.email}~ /> {/* **WRONG:** value without onChange freezes the field, and the user cannot type */}
> ```

React provides no configuration setting to turn off automatic resets for `<form action>`. However, remember what a form reset actually does: it restores every input element to its default value. You control that default value through component props.

```jsx title="A field with no default value vs. a field whose default value comes from state"
<input name="email" /> {/* The reset empties the field */}
<input name="email" ~defaultValue={state.email}~ /> {/* The reset puts back whatever state.email holds */}
```

Both input elements undergo the exact same automatic reset upon action completion. The difference lies entirely in what their default values specify:
1. **The action returns the submitted text** alongside the status message.
2. **Each input field reads that text through its `defaultValue` prop.**

When the automatic reset executes, it restores the text that the user originally typed.

### The state becomes one object

The action state now needs to hold three distinct pieces of data: the feedback message, the username, and the email. We combine them into a single state object.

When the server rejects a submission, `signUp` returns the error message paired with the submitted form values. When the server confirms registration, it returns empty strings, ensuring the form clears upon success:

```jsx title="src/App.jsx" startLine="4"
const initialState = { message: '', username: '', email: '' };

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const error = await createAccount(username);
  if (error) {
    return ~{ message: error, username, email }~; // Keeps what the user typed
  }
  return ~{ message: `Welcome, ${username}!`, username: '', email: '' }~; // Empties both fields
}
```

The rejection return statement uses JavaScript object property shorthand. When an object property name matches the local variable name, declaring the identifier once creates the property:

```js title="The shortcut and the long form"
{ ~username, email~ } // The shortcut
{ username: username, email: email } // The same object, written in full
```

Each input field now binds its default value to the corresponding state property:

```jsx title="src/App.jsx" startLine="16"
export default function App() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form action={formAction}>
      <h1>Create account</h1>
      <label>Username <input name="username" ~defaultValue={state.username}~ /></label> {/* The reset puts back john after a refusal */}
      <label>Email <input name="email" ~defaultValue={state.email}~ /></label> {/* The reset puts back john@mail.com after a refusal */}
      <button type="submit">Create account</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

**After a validation rejection, the reset mechanism that previously emptied the inputs now restores the user's text.** Here is the full interaction:
1. The user enters `john` and `john@mail.com`, then clicks Create account.
2. The action returns an object containing the error message alongside `john` and `john@mail.com`.
3. React re-renders `App` with this state. Each input receives an updated default value reflecting the submitted input.
4. React executes the post-action form reset. Each input reverts to its default value, preserving `john` and `john@mail.com` on screen.
5. The user adjusts `john` to `john7` and submits again.
6. The action `signUp` returns `Welcome, john7!` along with empty strings for username and email.
7. Because the default values are now empty strings, the automatic reset clears both input fields cleanly.

::: row caption="The same form after a refusal and after a success, with defaultValue read from state."
::: col title="After the refusal" tag="text kept" tone=good
```page size=mini
heading: Create account
form:
  field: Username | john | good
  field: Email | john@mail.com | good
  submit: Create account
line: Username john is taken. | bad
console: quiet
```
The user fixes one word and clicks again.
:::
::: col title="After the success" tag="form emptied" tone=good
```page size=mini
heading: Create account
form:
  field: Username |
  field: Email |
  submit: Create account
line: Welcome, john7! | good
console: quiet
```
After a success, the user wants an empty form.
:::
:::

### VS | `defaultValue={state.email}` vs. `value={state.email}`: value without onChange freezes the field

Because `value` controls visible input text, developers might feel inclined to write `value={state.email}`. While the syntax looks similar, its runtime behavior is fundamentally different.

Setting `value` without an `onChange` listener locks the input element (Lesson 20). The user cannot type or delete a single character, and React outputs a warning:

```page width=full caption="The Create account form with value={state.email} on the Email field: the field refuses every letter."
heading: Create account
form:
  field: Username |
  field: Email | | bad
  submit: Create account
console: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
```

A controlled input equipped with both `value` and `onChange` also preserves entered text because React never resets controlled elements. The distinction lies in rendering overhead:
- **With a controlled input**, React re-renders the component on every single keystroke.
- **With `defaultValue`**, React re-renders the component only when the action settles. While the user types, the browser handles keystrokes internally without re-rendering the component.

```tree caption="Three ways to write the Email field, and what each one does after a refusal."
The Email field after `Username john is taken.`
- !No default value [`name="email"`] | The reset puts the field back to **empty** | The user must **type the email again**
- +`defaultValue` from state [`defaultValue={state.email}`] | The reset puts back **what the user typed** | `App` renders **only when the action returns**
- !`value` without `onChange` [`value={state.email}`] | The field **freezes** | The user **cannot type**, and React prints a **warning**
```

Remember: the form reset restores each field to its default value. Configure `defaultValue` to match the text you wish to preserve.

---

## PRINCIPLE | `requestFormReset(form)`: a form submitted through onSubmit resets when the action ends

> [!PRINCIPLE]
> **Principle 4: requestFormReset Resets a Form Submitted Through onSubmit**
>
> *When a form is submitted without the `action` prop, call `requestFormReset(form)` from `'react-dom'` inside the Transition, so the fields reset when the action ends.*
>
> React resets form inputs automatically only when an action is passed directly to `<form action>`. Forms submitted through a conventional `onSubmit` handler retain stale input values after a successful submission. The `requestFormReset` utility instructs React to perform that same reset, deferring execution until the enclosing Transition completes. In contrast, calling native `form.reset()` clears the fields immediately, before the server has even responded.
>
> **DO THIS:**
> ```jsx
> startTransition(() => {
>   formAction(new FormData(form));
>   ~requestFormReset(form);~ // The fields reset together with the new state
> });
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> startTransition(() => {
>   formAction(new FormData(form));
> });
> ~form.reset();~ // **WRONG:** the fields empty at the click, before the server says whether the name is free
> ```

### VS | `form.reset()` vs. `requestFormReset(form)`: the browser resets now, React resets when the action ends

Standard JavaScript provides `form.reset()` on the DOM form node. React DOM complements this with a dedicated reset helper named `requestFormReset`:

```jsx title="The browser's reset vs. the reset of React DOM"
import { requestFormReset } from 'react-dom';

~form.reset();~ // The browser empties the fields right now
~requestFormReset(form);~ // React empties the fields when the current Transition ends
```

Both utilities return uncontrolled fields to their default values. The difference lies strictly in execution timing:
- **With `form.reset()`**, the browser resets inputs immediately upon invocation, even while the asynchronous action awaits the server.
- **With `requestFormReset(form)`**, React delays the reset until the enclosing Transition settles. The input fields update in the exact same render as the new action state.

This is the identical reset React performs automatically for `<form action>`. You invoke it manually only when submitting forms through alternative event mechanisms.

### React never resets a form submitted through `onSubmit`

Certain applications avoid attaching actions directly to `<form action>`. Teams migrating legacy codebases often retain their existing `onSubmit` handlers (Lessons 11 and 41) and trigger `formAction` manually.

React rules require manual `formAction` calls to run inside a Transition. The submit handler wraps the invocation in `startTransition`, which is imported from `'react'`. Later chapters explore Transitions comprehensively (Lesson 67). For our immediate purpose, one core mechanism matters: React tracks when the Transition completes, which coincides with `signUp` resolving.

```jsx title="src/App.jsx" startLine="1"
import { useActionState, startTransition } from 'react';
import { createAccount } from './api.js';
```

```jsx title="src/App.jsx" startLine="16" bad="23,28"
export default function App() {
  const [state, formAction] = useActionState(signUp, initialState);

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(() => {
      ~formAction(new FormData(form))~; // Runs signUp, but no form action ran, so nothing resets the form
    });
  }

  return (
    <form ~onSubmit={handleSubmit}~> {/* No form action: React never resets this form by itself */}
      <h1>Create account</h1>
      <label>Username <input name="username" defaultValue={state.username} /></label>
      <label>Email <input name="email" defaultValue={state.email} /></label>
      <button type="submit">Create account</button>
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

The property `e.currentTarget` references the `<form>` DOM element whose submit listener is active. The handler assigns it to a local variable before entering the Transition.

**The success message appears, but the input fields still display the entered text.** Here is the sequence of events:
1. The user inputs `john7` and `john@mail.com`, then clicks Create account.
2. The handler `handleSubmit` cancels native submission and executes `formAction` within a Transition.
3. The function `signUp` resolves with `Welcome, john7!` and empty default strings.
4. React re-renders `App` with the updated state, making the default values empty.
5. However, no automatic reset executes because the form lacked an `action` attribute. The input fields stubbornly retain what the user typed.

```page caption="The Create account form submitted through onSubmit, after a success: the welcome line next to the old text."
heading: Create account
form:
  field: Username | john7 | bad
  field: Email | john@mail.com | bad
  submit: Create account
line: Welcome, john7! | good
console: quiet
```

### The fix: ask for the reset inside the Transition

The solution requires one import and a single function call placed inside the active `startTransition` callback:

```jsx title="src/App.jsx" startLine="1"
import { useActionState, startTransition } from 'react';
import { ~requestFormReset~ } from 'react-dom'; // The reset function comes from React DOM
import { createAccount } from './api.js';
```

```jsx title="src/App.jsx" startLine="20"
  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    startTransition(() => {
      formAction(new FormData(form));
      ~requestFormReset(form);~ // The fields reset when signUp has finished, like a form action
    });
  }
```

The form now behaves identically to an automated `<form action={formAction}>` submission. Following a successful registration, the inputs clear completely. Following a rejection, the reset restores the submitted values from `defaultValue`, exactly as outlined in Principle 3. The handler explicitly requests the coordinated reset that `<form action>` receives automatically.

### `form.reset()` empties the fields too early

Because `form.reset()` is a familiar browser API, developers often reach for it immediately after dispatching an action. However, the browser executes that reset synchronously.

The fields clear the instant the user clicks the button, a full second before the server responds. If the server subsequently returns `Username john is taken.`, the user has already watched their inputs vanish as if registration succeeded. One second later, the rejection banner appears, and the inputs suddenly repopulate with default values from updated state. This creates an unsettling, flickering interface.

The React documentation demonstrates immediate `form.reset()` calls in one specific scenario: optimistic chat messaging using `useOptimistic`. In a chat stream, the user expects the message input to clear immediately upon submission regardless of server latency. Standard registration forms represent the opposite requirement: input text must remain stable until server confirmation.

---

## PRINCIPLE | `name` and `type="submit"`: the browser can send the form before JavaScript loads

> [!PRINCIPLE]
> **Principle 5: name and a Submit Button Let the Browser Send the Form Alone**
>
> *A form functions before client JavaScript finishes loading only when built as a standard `<form>` element containing named fields and a native submit button, paired with an action the browser can dispatch independently.*
>
> Progressive enhancement ensures every user receives functional core features through standard HTML, upgrading to dynamic client interactions once JavaScript finishes loading. A web browser can serialize and submit form data on its own only when provided with standard semantic elements: a `<form>`, fields with `name` attributes, a `<button type="submit">`, and an action the browser recognizes, such as an endpoint URL or a Server Function. Client-side functions require an active React runtime, and non-semantic elements like clickable `<div>` tags do nothing before scripts execute.
>
> **DO THIS:**
> ```jsx
> <form action={formAction}>
>   <input ~name="email"~ /> {/* The browser and FormData both read this name */}
>   <button ~type="submit"~>Create account</button> {/* A click submits the form, with or without a handler */}
> </form>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <section>
>   <input value={email} onChange={e => setEmail(e.target.value)} />
>   <div ~onClick={handleCreate}~>Create account</div> {/* **WRONG:** no form, no name, no submit button: nothing is sent before JavaScript loads */}
> </section>
> ```

Picture this registration form loaded on a mobile device over a congested network connection. The initial visual interface has appeared, but the client JavaScript bundle is still downloading. The user taps Create account.

Does that submission transmit any data? The outcome depends entirely on what the `action` attribute specifies.

### VS | `action="/signup"` vs. `action={formAction}`: the browser understands a URL, only React can call a function

```jsx title="An action with a URL vs. an action with a function"
<form ~action="/signup"~ method="post"> {/* The browser sends the form to /signup by itself */}
<form ~action={formAction}~> {/* Only React can call formAction, so React must be running */}
```

Both forms look identical on the screen. However, the browser natively understands a URL without running any JavaScript. It gathers every input element that has a `name` attribute and transmits their values to `/signup` using an HTTP POST request.

A JavaScript function behaves differently. It exists only within client application memory. Until React executes, the browser has no way to invoke that function.

> [!DEFINITION]
> **Progressive enhancement.** [NEW] Progressive enhancement is a design methodology that establishes a functional baseline using standard HTML, subsequently layering enhanced capabilities when client scripts run. The MDN documentation defines it as providing essential content and core functionality to all users, then delivering enhanced features to capable browsers.
> For form handling, the baseline consists of native HTML submissions processed by the browser. The enhanced experience includes seamless in-place updates, instant validation feedback without page reloads, and coordinated form resets (Lesson 45).

A form requires four structural elements to submit independently:
1. **A semantic `<form>` element.**
2. **A `name` attribute on every field.** The browser only transmits fields with a `name`, using that attribute as the payload key.
3. **A native submit button**, such as `<button type="submit">`. Clicking it submits the form natively without requiring a click handler.
4. **An action the browser can dispatch without client JavaScript**: an endpoint URL, or a Server Function in a server-rendered framework.

Our form already incorporates the first three requirements, requiring no additional engineering effort. The `name` attribute read by `formData.get('username')` is the exact same identifier the browser uses during native submission (Lesson 40).

### What our Vite app shows before its JavaScript runs

**Our client-side Vite application displays nothing to the user before its JavaScript executes.** It does not display an unenhanced form. It displays an entirely blank screen. Here is why:
1. The browser receives `index.html`, which contains only an empty root container (Lesson 7).
2. The application entry point has not executed yet, so React has not mounted the component tree.
3. No form elements exist in the DOM for the user to submit.

```page caption="Our Create account app on a phone whose JavaScript has not loaded yet."
blank
```

```dom caption="What the Elements panel shows before main.jsx runs: the root div with nothing inside."
! <div id="root"></div> | note: Empty until main.jsx runs and React renders App
```

In an application that renders exclusively within the browser, progressive enhancement takes effect when the team adopts Server-Side Rendering (Lesson 102). In that architecture, the HTML markup of the form arrives before the JavaScript bundle finishes downloading.

When the `action` attribute references a Server Function, React documentation notes that forms can be submitted before client scripts load (Lesson 110). Using `useActionState`, React can also capture and replay submissions made before hydration completed (Lesson 137). Preserving semantic HTML structure ensures the form is fully prepared for that architectural evolution.

### The mistake that breaks it

The most common anti-pattern involves building buttons or fields that only JavaScript can interpret:
1. A developer builds the submit button as a `<div onClick>` because a click listener seems sufficient.
2. Another input field omits the `name` attribute because client state tracks its value.
3. The interface functions properly while client scripts run without interruption.
4. Later, the engineering team introduces server rendering so pages appear rapidly on low-bandwidth devices.
5. A user clicks the button before the JavaScript bundle hydrates. Because a `<div>` is not a native submit button, the browser transmits nothing. Furthermore, an input lacking a `name` attribute is completely ignored by browser serialization.

---

## All 5 Principles Together

### The complete files

Here is the simulated server implementation:

```js title="src/api.js"
const takenUsernames = ['john'];

export function createAccount(username) {
  return new Promise(resolve => {
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

The component connects `formAction` directly to `<form action>`, allowing React to manage automatic resets. The action returns the submitted field values in state, and each input reads them through `defaultValue`:

```jsx title="src/App.jsx"
import { useActionState } from 'react';
import { createAccount } from './api.js';

const initialState = { message: '', username: '', email: '' };

async function signUp(previousState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const error = await createAccount(username);
  if (error) {
    ~return { message: error, username, email }~; // Principle 2: returned, not thrown
  }
  return { message: `Welcome, ${username}!`, username: '', email: '' };
}

export default function App() {
  const [state, formAction] = useActionState(signUp, initialState);

  return (
    <form ~action={formAction}~> {/* Principle 1: React resets the form after signUp returns */}
      <h1>Create account</h1>
      <label>Username <input ~name="username"~ defaultValue={state.username} /></label> {/* Principle 5: a name the browser can send */}
      <label>Email <input name="email" ~defaultValue={state.email}~ /></label> {/* Principle 3: the reset puts back the typed email */}
      <button ~type="submit"~>Create account</button> {/* Principle 5: a real submit button */}
      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

Principle 4 is not needed in this component file because the form uses `<form action>`. A form relying on `onSubmit` adds `requestFormReset(form)` inside its Transition.

### What React does after one click

The application component renders when the page initially loads, and renders again when `signUp` finishes. The exact sequence of operations following a click on Create account is:

```tree dir=right caption="The order of the steps after the user clicks Create account on the finished form."
One click on Create account
- +1. React builds the form data [`FormData`] | Reads **every named field**
- +2. React calls `signUp` in a Transition [`await createAccount`] | Waits **one second** for the stand-in server
- +3. `signUp` returns the new state [`message, username, email`] | Returned, **not thrown**: the action **succeeded**
- +4. React renders `App` [`defaultValue={state.email}`] | Each field gets its **new default value**
- +5. React resets the form | Each field goes back to its default value | **Text kept** after a refusal, **form empty** after a success
```

| The Situation | The Plain Habit | The React Rule |
| :--- | :--- | :--- |
| **A successful action** | Empty every field by hand at the end of the handler | React resets every uncontrolled field after a function in `<form action>` returns |
| **A refusal from the server** | Expect the fields to stay, because the server said no | A returned error is a success for React, so React resets the form |
| **Keeping the user's text** | Write `value` so the field shows the text | Return the text in state and read it through `defaultValue`, so the reset puts it back |
| **A form submitted through `onSubmit`** | Call `form.reset()` right after the click | Call `requestFormReset(form)` inside the Transition, so the reset waits for the action |
| **A user whose JavaScript has not loaded** | Build the button as a `<div onClick>` and leave fields without `name` | Use a real `<form>`, a `name` on every field, a submit button, and an action the browser can send |

One last time, the guiding rule of this lesson: **When an action finishes without throwing an unhandled error, React resets the form. The reset restores every uncontrolled field to its default value.**

---

## For the Interview

> **The Interview Question:** How do React 19 form actions manage automatic form resets, manual requestFormReset, and progressive enhancement?

### How to Answer Clearly in 30 Seconds

"When a function is passed to `<form action>`, React intercepts submission and invokes the function with form data inside a Transition. Once that action resolves without an unhandled error, React automatically resets all uncontrolled fields to their default values. Because returned validation errors resolve normally, they trigger this reset as well. Three key principles follow:
1. **Preserving input on validation failure**: Because the reset restores each field to its default value, the action returns the user's submitted values as state, and each input reads them through `defaultValue`.
2. **`requestFormReset` for `onSubmit`**: When submitting a form through `onSubmit`, React does not reset the fields automatically. We invoke `requestFormReset(form)` from `react-dom` inside the Transition to trigger the reset once the action completes.
3. **Progressive enhancement**: Forms should support submission before client JavaScript loads. Use semantic `<form>` tags, named inputs, and a native submit button, connected to an endpoint URL or a Server Function in a server-rendered environment."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Our sign-up form clears the email after the server says the username is taken. Why, and how do you fix it?"**
   React resets uncontrolled form fields whenever an action resolves without an unhandled exception. Because a returned validation message is a normal return value, React treats the submission as successful and triggers the automatic reset. That reset restores each field to its current default value. To preserve entered text, the action must return the submitted values alongside the error message, and each input must bind its `defaultValue` to that state. Upon rejection, the reset restores the submitted values. Upon successful creation, the action returns empty values, clearing the fields. Using `value` instead of `defaultValue` without an `onChange` handler freezes the input field.
2. **"What is the difference between `form.reset()` and `requestFormReset(form)`?"**
   Both functions restore uncontrolled inputs to their default values. The difference is execution timing. Native `form.reset()` executes immediately on the DOM element, clearing the fields before the server has responded. In contrast, `requestFormReset(form)` is exported by React DOM and is called inside an active Transition. React defers the reset until the action completes, synchronizing the field update with the new state render. React performs this coordinated reset automatically for `<form action>`, so `requestFormReset` is needed only when submitting through alternative handlers like `onSubmit`.
3. **"Does a form with a function in `action` work before JavaScript loads?"**
   Not in a purely client-rendered application. A client function exists only in memory after JavaScript executes, and an SPA like Vite serves an empty root div before hydration. Native browsers can submit independently only when the `action` points to an endpoint URL. However, in a server-rendered application using React Server Components, an action can reference a Server Function. The server delivers rendered form HTML immediately, the browser can submit it prior to hydration, and `useActionState` can queue or replay submissions once client scripts mount.

```tree caption="Interview summary: what decides whether a field keeps the user's text after a form action."
Does the field keep the text after the action?
- !Uncontrolled field with no default value | The reset puts it back to **empty** | Text **lost** after a refusal
- +Uncontrolled field with `defaultValue` from state | The reset puts back **the returned text** | Text **kept** after a refusal, **emptied** after a success
- +Controlled field with `value` and `onChange` | React **does not reset** it | Your code **clears the state** itself
```
