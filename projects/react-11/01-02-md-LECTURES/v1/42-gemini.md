# Lecture 42: How useActionState Remembers the Last Answer and the Pending Flag

*(How does a form show what its last submit answered, and whether a submit is still running?)*

> INTERVIEW QUESTION | ❱ CORE | How does useActionState manage a form's submitted state and pending flag?

---

## VS | A plain form action `action={signup}` vs. the action from the Hook `action={signupAction}`: the plain action loses what it returns, the Hook keeps it as state

> Form submissions require displaying two distinct feedback states: submission progress and server response. When using a plain form action, React runs the function but discards whatever value it returns. **You should pass your action function to `useActionState` instead**. React stores the returned result as component state, and provides an `isPending` flag that remains true while the action executes.

Modern forms routinely provide feedback after submission. Common examples include success confirmations, validation warnings, and loading indicators while the server processes data. A standard form action introduced in Lesson 41 executes on submission, but React discards any value the function returns. Without a dedicated tool, developers must create multiple state variables to store the returned message and track pending status manually. **The `useActionState` Hook eliminates this manual wiring by storing the action's returned value in state and providing an automated `isPending` flag.**

Consider a newsletter subscription form with an email input and a submit button. While the server validates the address, the button should show a loading indicator and disable further clicks. Once the request resolves, the page should display the confirmation message returned by the server. Where does that returned text go when using a plain action? A plain form action discards the returned value completely. With `useActionState`, React captures that return value and stores it as component state for the next render.

**Why this matters:** A plain form action discards its return value, preventing server responses from reaching the screen. Managing this feedback manually requires two separate `useState` hooks, one for the message and another for the loading state. You must also synchronize both setters across every success and failure branch. The `useActionState` Hook provides both the stored response and the pending flag in a single declaration.

### What a Form Action Returns

Let us review the conclusion of Lesson 41. You assign an asynchronous function to the form `action` prop, and React invokes it with form data upon submission:

```jsx title="A plain form action, as in Lesson 41"
function signup(formData) {
  ~return 'Thanks, you are signed up!';~ // React calls signup, and then ignores this text
}

<form action={signup}>
```

Where does that returned string go? React invokes the action function, but ignores its return value. No error occurs, but the returned data is lost.

In plain JavaScript, capturing a return value is straightforward. Because your code calls the function directly, you capture its return value in a local variable:

```js title="Plain JavaScript: you call the function, so the answer is yours"
const message = ~signup(formData)~; // You called it, so you get what it returns
document.getElementById('message').textContent = message;
```

In React, your code never calls the action directly. The browser form invokes the handler when the user clicks the submit button. Because you do not call the function, you cannot write an assignment statement to capture its result. React must capture the return value for you.

This is the exact role of `useActionState`. You instruct React to execute your action, capture whatever value it returns, and provide that value back to the component as reactive state.

```jsx title="React: useActionState catches the answer for you"
const [message, signupAction, isPending] = ~useActionState(signup, null)~; // message starts as null, then holds what signup returned

<form action={~signupAction~}> {/* The form calls signupAction, and signupAction calls signup */}
```

> [!DEFINITION]
> **What is a form action?** [REVIEW] A form action is a function assigned to the `action` prop of a `<form>`, written as `<form action={signup}>`.
> When the user submits the form, React invokes this function with a single argument: a `FormData` object containing the submitted fields. You retrieve values using `formData.get('email')`.
> React prevents browser page reloads automatically. When the action completes successfully without unhandled errors, React clears all uncontrolled inputs.
> Crucially, React ignores any value that a plain form action returns (Lesson 41).

> [!DEFINITION]
> **What is useActionState?** [NEW] `useActionState` is a React Hook that manages state updated by an action, preserving the action's latest return value across component re-renders.
> The Hook accepts two required arguments: your action function and the initial state value. Calling `useActionState(signup, null)` initializes the state as `null` and registers `signup` as the submission handler.
> It returns an array of three items in exact order: the current state value, an action dispatch wrapper to pass to your form, and a boolean `isPending` flag.
> The `<form>` must receive the returned action wrapper rather than your raw function. This wrapper enables React to intercept submissions, capture the return value, and trigger a re-render.
> React holds this state in the component fiber, updating the value whenever the action returns a new result (Lesson 42).

Submitting a form also introduces network latency. Talking to a remote server requires time to complete. During this wait, the button should display a loading label and reject duplicate clicks.

React tracks asynchronous action execution internally during transitions (Lesson 41). However, a plain form action provides no state variable for your component to read. The `useActionState` Hook solves this by exposing that transition state directly through its third returned value.

> [!DEFINITION]
> **What is isPending?** [NEW] `isPending` is a boolean flag returned as the third item from `useActionState`, indicating whether an action is currently executing.
> React switches `isPending` to `true` the moment the user submits the form. It remains `true` while asynchronous promises resolve and switches back to `false` only after React renders the updated state to the screen.
> React manages this flag automatically through an internal transition. Your component code only reads the boolean value and never calls a setter to toggle it.
> In short: the return value of your action becomes component state, and `isPending` tracks the active execution lifecycle (Lesson 42).

```tree caption="A plain form action vs. the same action given to useActionState."
What happens to the answer of `signup`
- !A plain form action [`action={signup}`] | React calls `signup` and **ignores what it returns** | No message on the screen, and **no variable for the wait**
- +The same action through `useActionState` [`action={signupAction}`] | React calls `signup` and **stores what it returns** as `message` | The message is on the screen, and **`isPending`** tracks the wait
```

### The Rule of Thumb: does the screen show the answer of the last submit?

**If the screen must display the result of the latest submission, use `useActionState`. Return every response value from the action, and inspect `isPending` to control interactive elements.**

Without this Hook, you must coordinate two independent pieces of state manually. One state hook stores the response message, a second state hook tracks submission progress, and your event handler must toggle both variables correctly across every execution branch. Omitting a single state update produces noticeable user interface bugs:
1. The submit button remains permanently disabled in a loading state, locking the user out.
2. A previous confirmation message remains visible even after a subsequent submission fails.

In React applications, developers choose between three primary strategies for handling submission feedback:
1. **Manual state in a submit handler.** Two `useState` calls manage message and pending state manually (Lessons 33 and 40). This approach works across all React versions and outside form actions.
2. **State combined with transitions.** Using `useState` alongside `useTransition` allows multiple actions to run in parallel. The official documentation recommends this combination when simultaneous background tasks must execute concurrently.
3. **The action state Hook.** Using `useActionState` represents the modern standard when an interface displays the result of the latest submission and requests run sequentially.

This lesson focuses on `useActionState`, comparing it directly with manual state in Principle 4.

A senior developer avoids four classic mistakes:
1. **Passing the raw action to the form.** The function executes, but React never captures the return value, leaving state unchanged without raising errors.
2. **Keeping a single parameter on the action.** React supplies previous state in the first argument, displacing form data to the second slot and causing runtime property access crashes.
3. **Throwing known validation errors.** Throwing an exception bypasses state capture entirely, triggering an error boundary and removing the form from view.
4. **Toggling pending flags manually.** An unhandled rejection skips subsequent cleanup lines, leaving the interface permanently frozen in a loading state.

The following sections examine each pitfall within a complete newsletter subscription component.

## SECTION | A Newsletter Sign-up Form

Our example represents a newsletter subscription banner at the footer of a news portal. It contains a title heading, an email input field, and a Sign up button.

When a user submits john@example.com, the interface performs two sequential updates:
1. For one second while the network request runs, the button displays "Signing up..." and rejects further clicks.
2. Once the server confirms the address, a status message appears below the button confirming the subscription.

::: row caption="The sign-up form when the page opens, while the sign-up runs, and after the answer comes back."
::: col title="When the page opens" tag="no line yet"
```page size=mini
heading: Get our weekly news
form:
  field: Email
  submit: Sign up
```
:::
::: col title="While the sign-up runs" tag="Signing up..."
```page size=mini
heading: Get our weekly news
form:
  field: Email | john@example.com
  submit: Signing up... | | disabled
```
:::
::: col title="After the answer comes back" tag="one line" tone=good
```page size=mini
heading: Get our weekly news
form:
  field: Email
  submit: Sign up
line: Thanks! john@example.com is signed up. | good
```
:::
:::

If the user submits the identical email address a second time, the server rejects it, and the status line displays "This email is already signed up".

Consequently, the component must track two key pieces of information across submissions:
1. **The response from the latest submission.** This value represents the displayed status message, whether a confirmation notice or a validation error.
2. **The active execution state.** This boolean value determines whether the button shows a loading label and disables user interaction during network transit.

The project contains three source files:

```files title="newsletter: File Explorer" caption="How the files of our sign-up form sit inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports the default export of `./App.jsx` and mounts it, unchanged from Lesson 7
  App.jsx | form | Holds the `signup` action and exports `Newsletter` as default
  api.js | stand-in server | Exports `signUp`, which answers after one second, from Principle 3
```

The mock API module simulates a remote server, mirroring the pattern established in Lesson 41. It is provided as project infrastructure rather than taught as new syntax. It maintains an in-memory array of registered addresses, introduces a one-second delay, and returns one of two outcomes:
1. **A validation error string** if the submitted email already exists in the array.
2. **A null value** when the subscription succeeds without conflict.

```js title="src/api.js"
const emails = [];

export async function signUp(email) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (emails.includes(email)) {
    return 'This email is already signed up';
  }
  emails.push(email);
  return null;
}
```

The one-second delay exists intentionally so that you can observe the pending state transition in the browser.

Now let us construct the component and examine common failure modes along the way:

**PRINCIPLES:** What your action returns becomes state. While your action runs, `isPending` is `true`. Four governing principles emerge:
1. **Principle 1: The Form Receives the Action Returned by the Hook.** Pass `signupAction` to the form; passing your raw `signup` function discards the return value.
2. **Principle 2: Previous State Precedes Form Data.** Structure the action as `signup(previousState, formData)` even if the previous value is unused.
3. **Principle 3: Action Return Values Determine Displayed State.** Return expected validation failures as values; throw exceptions only for unanticipated application bugs.
4. **Principle 4: React Automates the Pending Lifecycle.** The submit button derives its loading status directly from `isPending` without manual state flags.

---

## PRINCIPLE | `useActionState`: the form gets `signupAction`, and React keeps what `signup` returns

> [!PRINCIPLE]
> **Principle 1: The Form Receives the Action Returned by the Hook**
>
> *Invoke `useActionState(signup, null)` in the component body, unpack the state value, the action wrapper, and `isPending`, and pass that action wrapper to `<form action={...}>`.*
>
> React captures the return value only when the submission invokes the action wrapper produced by `useActionState`. This generated wrapper executes your custom `signup` function, intercepts its return value, and commits that value to state. If you pass your raw `signup` function directly to `<form action={...}>`, the action still runs, but React discards its return value without raising any console warnings.
>
> **DO THIS:**
> ```jsx
> const [message, signupAction, isPending] = useActionState(signup, null);
>
> <form action={~signupAction~}> {/* React stores what signup returns in message */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const [message, signupAction, isPending] = useActionState(signup, null);
>
> <form action={~signup~}> {/* **WRONG:** signup runs, but message stays null and no line appears */}
> ```

### The first sign-up form

Here is the initial version of the form component in the App file. In this opening step, `signup` ignores the input value and returns a fixed confirmation string:

```jsx title="src/App.jsx"
import { useActionState } from 'react';

function signup() {
  return 'Thanks, you are signed up!';
}

export default function Newsletter() {
  const [message, signupAction, isPending] = ~useActionState(signup, null)~; // Three values: the state, the action, the flag

  return (
    <form action={~signupAction~}> {/* The form gets signupAction, not signup */}
      <h2>Get our weekly news</h2>
      <label>
        Email <input name="email" />
      </label>
      <button>Sign up</button>
      {~message &&~ <p>{message}</p>} {/* No line while message is null */}
    </form>
  );
}
```

The `useActionState` Hook accepts two parameters:
1. **`signup`**: your action handler, the function that executes when the user submits the form.
2. **`null`**: the initial state value, which `message` holds prior to the first submission.

The Hook returns an array with three items. Array destructuring assigns local names to each item in exact order (Lesson 12):
1. **`message`**: the current state value. It equals `null` on initial render and holds whatever value `signup` returns after each submission.
2. **`signupAction`**: the action wrapper created by React. Pass this function to the form `action` prop. The official documentation refers to this as a dispatch action, since each execution dispatches an action submission to React.
3. **`isPending`**: a boolean flag that stays `true` while an action executes. Principle 4 uses this value to drive the button state.

When the page first renders, `message` is `null`. Consequently, React renders no paragraph below the button:

```page caption="The sign-up form on the first render: message is null, so no line appears."
heading: Get our weekly news
form:
  field: Email
  submit: Sign up
```

The user enters john@example.com and clicks Sign up. The confirmation paragraph appears, and the input field clears automatically:

```page caption="The sign-up form after the user clicks Sign up: the text that signup returned is on the screen."
heading: Get our weekly news
form:
  field: Email
  submit: Sign up
line: Thanks, you are signed up! | good
```

The empty input reflects the automatic reset behavior introduced in Lesson 41. Because the input element omits a `value` prop, it remains uncontrolled. When an action completes without throwing unhandled exceptions, React automatically clears all uncontrolled form fields.

### Who calls signup? React does

Your application code never calls `signup` directly, nor does it invoke a state setter function. Instead, React orchestrates the entire submission lifecycle:
1. The form invokes the handler assigned to its `action` prop, which is `signupAction`.
2. The wrapper `signupAction` starts an internal transition and invokes your custom `signup` function.
3. The `signup` function completes and returns the string `'Thanks, you are signed up!'`.
4. React stores that returned string in state under `message` and re-renders the component. Because `message` is no longer `null`, the confirmation paragraph appears.

### VS | A setter `setMessage` vs. an action `signupAction`: your code calls the setter, the form calls the action

The initial declaration of `useActionState` closely resembles a `useState` hook declaration:

```jsx title="With useState and with useActionState"
const [message, ~setMessage~] = useState(null); // Two values: your code calls setMessage with the new message
const [message, ~signupAction~, isPending] = useActionState(signup, null); // Three values: the form calls signupAction
```

While the syntax looks similar, the architectural mechanics differ fundamentally. Both hooks initialize `message` to `null`, but their second returned values serve completely different roles:
- **With `useState`**, the second value is an imperative setter function. Your application code calls this setter directly, passing the new state value as an argument.
- **With `useActionState`**, the second value is an action dispatch wrapper. Your code never passes data to this function. Instead, the form invokes it upon submission, React executes your action, and React automatically captures whatever value the action returns.

```tree caption="The second value of useState is a setter your code calls; the second value of useActionState is an action the form calls."
Where the new `message` comes from
- +With `useState` [`setMessage`] | Your code **calls the setter** with the new message | Two values: **`message`** and **`setMessage`**
- +With `useActionState` [`signupAction`] | The **form calls the action**, and React stores **what `signup` returns** | Three values: **`message`**, **`signupAction`**, and **`isPending`**
```

### Mistake: the form gets signup itself

A common beginner mistake is passing the raw `signup` function directly to the form `action` prop, reverting to the pattern from Lesson 41:

```jsx title="src/App.jsx" startLine="11" bad="1"
    <form action={~signup~}> {/* **WRONG:** signup runs, but React does nothing with what it returns */}
```

The user clicks Sign up. The `signup` function executes, but no confirmation appears below the button, and the browser console remains silent.

Why does this happen? Passing a raw function creates a standard form action, and React discards whatever a standard form action returns. Only the wrapper `signupAction` captures the returned result and commits it to `message`. Your raw function has no link to React state.

### Mistake: calling the action while the component renders

Another mistake occurs when a developer attempts to execute the action immediately on page load by invoking it in the component body:

```jsx title="src/App.jsx" startLine="7" bad="3"
export default function Newsletter() {
  const [message, signupAction, isPending] = useActionState(signup, null);
  ~signupAction()~; // **WRONG:** runs on every render, and each call asks for another render
```

This invocation creates an infinite render cycle. Calling the action requests a state update, which triggers a re-render, which immediately invokes the action again. React halts this loop immediately with a runtime error: Cannot update action state while rendering.

Action handlers must only execute in response to user interactions. In this component, that means executing only when the user submits the form.

Remember: assign `signupAction` to the form, allowing React to store whatever `signup` returns.

---

## PRINCIPLE | `signup(previousState, formData)`: the previous state comes first, the form data second

> [!PRINCIPLE]
> **Principle 2: The Previous State Comes First, the Form Data Second**
>
> *Define every action passed to `useActionState` with two parameters, `signup(previousState, formData)`, even when the function ignores the previous state value.*
>
> A standard form action receives the `FormData` object as its first argument. When routed through `useActionState`, React injects the previous state value at the first position, pushing the `FormData` object to the second position. If an action retains the single-parameter signature, it receives the previous state value instead of the form data, causing property access calls like `formData.get()` to crash with a `TypeError`.
>
> **DO THIS:**
> ```jsx
> function signup(~previousState, formData~) { // formData holds the form data
>   const email = formData.get('email');
>   return `Thanks! ${email} is signed up.`;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function signup(~formData~) { // **WRONG:** formData holds the previous state, null on the first submit
>   const email = formData.get('email');
>   return `Thanks! ${email} is signed up.`;
> }
> ```

### Two parameters, not one

Now our `signup` action must extract the email address entered by the user. In Lesson 41, a standard form action received a single parameter representing the form data. Through `useActionState`, React invokes the function with two positional arguments:

```jsx title="With formData alone and with previousState first"
function signup(~formData~) { // A plain form action: React passes the form data first
  const email = formData.get('email');
}

function signup(~previousState, formData~) { // Through useActionState: the previous state first, the form data second
  const email = formData.get('email');
}
```

Both function bodies read the email address with identical syntax. However, the caller determines what arrives in each argument position:
- **A plain form action** is invoked directly by React with the `FormData` instance in the first parameter slot.
- **An action managed by `useActionState`** is invoked through the wrapper `signupAction`. This wrapper supplies the previous state value first, pushing the `FormData` instance to the second parameter slot.

### What previousState holds

The `previousState` parameter contains whatever value `signup` returned during the preceding execution:
1. On the initial submission, it contains the initial state value configured in the Hook, which is `null`.
2. On every subsequent submission, it contains the value returned by `signup` on the previous submit.

You encountered this functional pattern previously in Lesson 27 when working with reducers. A reducer receives the current state and returns the next state. Because of this architectural symmetry, the React documentation refers to this action signature as a reducer action.

> [!DEFINITION]
> **What is a reducer?** [REVIEW] A reducer is a function that accepts the current state and an action payload, returning the next state value. You provide it to the `useReducer` Hook.
> Standard reducers must remain strictly pure. They compute next states without triggering side effects or making network requests.
> An action passed to `useActionState` shares this identical signature of transforming previous state into next state. The essential difference is that an action can be asynchronous, performing server requests before returning the next state (Lesson 27).

Our newsletter `signup` function does not read `previousState` yet. Nonetheless, `previousState` must occupy the first parameter slot because JavaScript maps arguments by positional order.

### Mistake: keeping the one-parameter shape

Suppose a developer migrates a working form action into `useActionState`, but forgets to update its parameter list:

```jsx title="src/App.jsx" startLine="3" bad="1"
function signup(~formData~) { // **WRONG:** React puts the previous state here, so formData holds null
  const email = formData.get('email');
  return `Thanks! ${email} is signed up.`;
}
```

The page renders without issue initially, but the first submission crashes the component completely. Here is the sequence of events:
1. The user enters john@example.com and clicks Sign up.
2. React invokes `signup`, passing null as the first argument and the `FormData` instance as the second argument.
3. Because the function defines only one parameter named `formData`, JavaScript binds that parameter to the first argument, `null`.
4. The function executes `formData.get('email')`. Because `null` possesses no methods, JavaScript throws a `TypeError`.

The confirmation message never renders. The entire form unmounts from the document, and the browser console logs a runtime error:

```page caption="The page after the first submit when signup keeps the one-parameter shape: the sign-up form is gone."
blank
console: Uncaught TypeError: Cannot read properties of null (reading 'get')
  warn: An error occurred in the <Newsletter> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

The component unmounts for the same architectural reason discussed in Lesson 41. React bubbles unhandled action exceptions up to the nearest Error Boundary (Lesson 38). Because our sample application defines no Error Boundary, React removes the crashed component tree from view.

### The fix: add previousState in first place

To resolve this issue, declare `previousState` as the first parameter. The second parameter now receives the `FormData` object, allowing the action to read the email address correctly:

```jsx title="src/App.jsx" startLine="3" good="1"
function signup(~previousState, formData~) { // React fills previousState first, then formData
  const email = formData.get('email');
  return `Thanks! ${email} is signed up.`;
}
```

```page caption="The sign-up form after the user signs up with john@example.com: the line now names the email."
heading: Get our weekly news
form:
  field: Email
  submit: Sign up
line: Thanks! john@example.com is signed up. | good
```

```tree caption="What arrives in each parameter when useActionState calls the action on a submit."
What React passes to `signup` through `signupAction`
- !One parameter, `formData` [`formData`] | The only parameter gets the **previous state**, `null` on the first submit | `formData.get` fails with a **`TypeError`**
- +Two parameters, `previousState` and `formData` [`previousState` `formData`] | First place: the **previous state**; second place: the **form data** | `formData.get` reads **`john@example.com`**
```

Remember: when using `useActionState`, the previous state arrives in the first slot and the form data in the second slot.

---

## PRINCIPLE | `return error`: what the action returns becomes the message on the screen

> [!PRINCIPLE]
> **Principle 3: What the Action Returns Becomes the Message**
>
> *Return every answer intended for user display, including expected validation failures like duplicate emails; throw exceptions only for unanticipated application crashes.*
>
> The `useActionState` Hook provides no imperative setter function. The sole mechanism for updating displayed state is returning a new value from the action function. React stores this returned value and triggers a re-render. Conversely, thrown exceptions never convert into state; React routes unhandled errors to the nearest Error Boundary, unmounting the interface instead of displaying a helpful error message.
>
> **DO THIS:**
> ```jsx
> async function signup(previousState, formData) {
>   const error = await signUp(formData.get('email'));
>   if (error) {
>     ~return error;~ // The line shows "This email is already signed up"
>   }
>   return 'Thanks!';
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> async function signup(previousState, formData) {
>   const error = await signUp(formData.get('email'));
>   if (error) {
>     ~throw new Error(error);~ // **WRONG:** the text never reaches the line, and the whole form disappears
>   }
>   return 'Thanks!';
> }
> ```

### One action, two answers

Our component contains no state setter function. The displayed message updates through a single mechanism: the return value of the action. Consequently, an action that returns different values based on server validation produces different feedback messages on screen.

We now connect `signup` to our mock server API. The action becomes an `async` function because it awaits the server response (Lesson 41):

```jsx title="src/App.jsx" startLine="1"
import { useActionState } from 'react';
import { signUp } from './api.js';

async function signup(previousState, formData) {
  const email = formData.get('email');
  const error = await ~signUp(email)~; // null when it went through, the error text otherwise
  if (error) {
    ~return error;~ // Answer 1: the error text becomes message
  }
  ~return `Thanks! ${email} is signed up.`;~ // Answer 2: the thanks text becomes message
}
```

Whichever string `signup` returns, React stores that value in state under `message` and displays it in the interface.

### Two submits, two lines, and no setter

Submitting the identical email address twice yields two distinct feedback messages without writing a single state setter:
1. The user enters john@example.com and clicks Sign up. React invokes `signup` with `previousState` set to null.
2. The mock server waits one second and returns `null` because the email address is new. The action returns the confirmation string, and React renders it.
3. The user submits john@example.com again. React invokes `signup`, passing the previous confirmation string as `previousState`.
4. The mock server detects the existing address and returns an error string. The action returns this string, and React replaces the confirmation message on screen.

::: row caption="The same email signed up twice: the first answer is the thanks text, the second is the error text."
::: col title="After the first sign-up" tag="thanks text" tone=good
```page size=mini
heading: Get our weekly news
form:
  field: Email
  submit: Sign up
line: Thanks! john@example.com is signed up. | good
```
:::
::: col title="After the second sign-up" tag="error text" tone=bad
```page size=mini
heading: Get our weekly news
form:
  field: Email
  submit: Sign up
line: This email is already signed up | bad
```
:::
:::

Notice that the input field clears after both submissions. From React's perspective, returning an error message string is a normal, successful function execution. Because the action completed without throwing an unhandled exception, React resets all uncontrolled form fields as expected.

### VS | A returned error `return error` vs. a thrown error `throw new Error(error)`: only the returned one becomes state

A duplicate email represents a business validation failure. Developers accustomed to exception handling might attempt to throw an error:

```jsx title="With return error and with throw new Error"
if (error) {
  ~return error;~ // The text becomes message, and the line shows it
}

if (error) {
  ~throw new Error(error);~ // **WRONG:** the text never reaches message
}
```

Both statements halt execution inside `signup` at the same moment. However, only a returned value converts into component state:
- **With `return error`**, React stores the returned string in state. The user reads "This email is already signed up" directly below the button.
- **With `throw new Error(error)`**, the error string never becomes state. React routes the exception to the nearest Error Boundary, unmounting the form completely as shown in Principle 2.

The official React documentation draws a strict boundary between these two error categories:
1. **Expected validation failures**, such as duplicate accounts or invalid inputs, represent normal application responses. Return them as values to display helpful feedback.
2. **Unexpected runtime failures**, such as network dropouts or code crashes, represent exceptional defects. Throw them so Error Boundaries can handle recovery.

Remember: values returned from an action become component state, while thrown exceptions bypass state entirely.

---

## PRINCIPLE | `isPending`: React turns the flag on and off, so the button never freezes

> [!PRINCIPLE]
> **Principle 4: React Automates the Pending Lifecycle**
>
> *Read `isPending` from `useActionState` to disable the submit button and display loading feedback while the action executes.*
>
> Indicating submission progress requires a boolean flag that switches to `true` during request transit and reverts to `false` when the response renders. When managed manually with `useState`, an unexpected exception can skip the cleanup setter, leaving the interface permanently frozen. The `useActionState` Hook provides this flag automatically as its third value, synchronized across the entire transition lifecycle.
>
> **DO THIS:**
> ```jsx
> <button disabled={~isPending~}> {/* React sets isPending around the action */}
>   {isPending ? 'Signing up...' : 'Sign up'}
> </button>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> setIsPending(true);
> const error = await signUp(email);
> ~setIsPending(false);~ // **WRONG:** skipped when signUp throws, so the button stays on Signing up...
> ```

### The Signing up... button

The third value returned by `useActionState` controls interactive feedback on the submit button:

```jsx title="A button driven by isPending"
<button disabled={~isPending~}> {/* Refuses clicks while a sign-up runs */}
  {~isPending ?~ 'Signing up...' : 'Sign up'} {/* The text during the wait, and the text after */}
</button>
```

The native HTML `disabled` attribute prevents user clicks while active. The `isPending` flag remains `true` from the moment the user clicks submit until React finishes rendering the returned result.

### VS | A flag by hand `setIsPending` vs. the flag from the Hook `isPending`: React sets the flag, so there is no line to forget

Prior to React 19, developers tracked pending states manually within submit event handlers (Lesson 33). Here is the newsletter component using manual state:

```jsx title="With setIsPending by hand"
const [message, setMessage] = useState(null);
const [isPending, setIsPending] = useState(false);

async function handleSubmit(e) {
  e.preventDefault();
  const email = new FormData(e.target).get('email');
  ~setIsPending(true);~ // Your code turns the flag on
  const error = await signUp(email);
  setMessage(error ? error : `Thanks! ${email} is signed up.`);
  ~setIsPending(false);~ // Your code must remember to turn it off
}
```

Now compare that implementation with the declarative approach provided by `useActionState`:

```jsx title="With isPending from useActionState"
const [message, signupAction, ~isPending~] = useActionState(signup, null); // React turns isPending on and off
```

On the button itself, both approaches produce identical visual behavior. During submission, the button displays "Signing up..." for one second before returning to "Sign up".

However, form resetting behaves differently. With the manual approach, the submitted email remains in the input field. React resets uncontrolled inputs only after native form actions, whereas the manual version relies on an `onSubmit` handler (Lesson 41).

The most substantial advantage lies in code reliability. With `useActionState`, both manual setter calls disappear. React manages the pending lifecycle internally because it coordinates the action transition.

### Mistake: the flag that never turns off

Manual pending management introduces a common failure mode. If an asynchronous network request throws an exception, the reset setter never executes:
1. The submit handler invokes `setIsPending(true)`.
2. The network request throws an exception due to a connection dropout.
3. Execution halts immediately, skipping the line calling `setIsPending(false)`.
4. The button remains permanently disabled and stuck on "Signing up...", locking the user out.

Fixing this manual pattern requires wrapping every request in `try` and `finally` blocks. With `useActionState`, there is no cleanup setter to omit. If an action throws an error, React catches it, updates the transition, and routes the exception to an Error Boundary without leaving frozen controls behind.

### The old line stays until the new answer arrives

We now integrate the pending button state into our App file:

```jsx title="src/App.jsx" startLine="22"
      <button disabled={~isPending~}> {/* true while signup runs */}
        {isPending ? 'Signing up...' : 'Sign up'}
      </button>
```

Observe the transition when submitting a second email address. While the server processes the request, the button indicates loading, but the status line continues displaying the previous message:
1. The status line currently displays "Thanks! john@example.com is signed up." from the previous submission.
2. The user enters a different address and clicks Sign up.
3. The `isPending` flag becomes `true`, switching the button text to "Signing up..." and disabling clicks.
4. Because the action has not returned yet, `message` remains unchanged. React preserves the previous confirmation line on screen.
5. One second later, the action returns. In a single synchronized render, React updates the status line with the new response and restores the button to its active state.

::: row caption="A sign-up with mia@example.com: the old line stays during the wait, and the new line replaces it after."
::: col title="During the one-second wait" tag="old line, Signing up..."
```page size=mini
heading: Get our weekly news
form:
  field: Email | mia@example.com
  submit: Signing up... | | disabled
line: Thanks! john@example.com is signed up.
```
:::
::: col title="After the wait" tag="new line, Sign up" tone=good
```page size=mini
heading: Get our weekly news
form:
  field: Email
  submit: Sign up
line: Thanks! mia@example.com is signed up. | good
```
:::
:::

```tree caption="Two ways to show the wait: a flag your code sets by hand, or isPending from useActionState."
Who turns the pending flag on and off
- !With `setIsPending` by hand [`setIsPending`] | Your code turns the flag **on before** the request and **off after** it | If the request throws, the button **stays on Signing up... forever**
- +With `isPending` from `useActionState` [`isPending`] | **React** turns the flag on when the action starts and off when its answer is shown | **No line to forget**: no `useState`, no `setIsPending`, no `finally`
```

Remember: React manages the `isPending` lifecycle automatically. Your component code only inspects the flag.

---

## All 4 Principles Together

### The complete project

Here is the finished newsletter subscription component. The action signature accepts both arguments, returns user-facing feedback, and binds `isPending` directly to the button:

```jsx title="src/App.jsx"
import { useActionState } from 'react';
import { signUp } from './api.js';

async function signup(~previousState, formData~) { // Principle 2: the previous state first, the form data second
  const email = formData.get('email');
  const error = await signUp(email);
  if (error) {
    ~return error;~ // Principle 3: a known error is returned and becomes message
  }
  return `Thanks! ${email} is signed up.`;
}

export default function Newsletter() {
  const [message, signupAction, isPending] = ~useActionState(signup, null)~; // Principle 1: the state, the action, the flag

  return (
    <form action={~signupAction~}> {/* Principle 1: the form gets the returned action */}
      <h2>Get our weekly news</h2>
      <label>
        Email <input name="email" />
      </label>
      <button disabled={~isPending~}> {/* Principle 4: React turns isPending on and off */}
        {isPending ? 'Signing up...' : 'Sign up'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

The accompanying mock API module remains unchanged:

```js title="src/api.js"
const emails = [];

export async function signUp(email) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (emails.includes(email)) {
    return 'This email is already signed up';
  }
  emails.push(email);
  return null;
}
```

### What happens on one submit, in order

When the application mounts, React renders `Newsletter` once. The `message` state initializes to null, and `isPending` initializes to false. Each subsequent submission follows four sequential steps:

```tree dir=right caption="What happens, in order, from the click on Sign up to the new line under the button."
One submit of the sign-up form
- +1. The user clicks Sign up [`signupAction`] | The form calls **`signupAction`** with the form data | `isPending` becomes **true**: the button reads **Signing up...**
- +2. `signupAction` calls `signup` [`previousState` `formData`] | React passes the **previous state** first and the **form data** second | `signup` waits **one second** for `signUp`
- +3. `signup` returns a text [`return`] | React stores it as the new **`message`** | The line under the button shows **the new answer**
- +4. The same render [`isPending`] | `isPending` becomes **false** | The button reads **Sign up** again
```

| Aspect | With `useState` by hand | With `useActionState` |
| :--- | :--- | :--- |
| **State management** | Two `useState` calls track response message and loading status | Single Hook provides state value, action wrapper, and pending flag |
| **Form binding** | Form requires manual `onSubmit` event handler and cancellation | Form binds directly to the action wrapper via `<form action={...}>` |
| **Message updates** | Handlers call imperative setter functions with new text | React captures whatever value the action function returns |
| **Validation errors** | Code invokes setters with validation error strings | Action returns validation errors directly as state values |
| **Pending lifecycle** | Handlers toggle boolean flags manually across try and finally | React manages transition lifecycle and sets `isPending` automatically |

To summarize the core architectural rule: **what your action returns becomes state, and while your action runs, `isPending` is `true`.**

---

## For the Interview

> **The Interview Question:** How does useActionState manage a form's submitted state and pending flag?

### How to Answer Clearly in 30 Seconds

"`useActionState` takes an action function and an initial state value. It returns three values: the current state, an action wrapper for the form, and an `isPending` flag. When the user submits the form, React calls the action function with two positional arguments: the previous state value first and the `FormData` object second. Whatever value the action returns automatically becomes the new state, updating the interface without manual setter calls. Three core conventions govern its use:
1. **Bind the returned action wrapper to the form.** Passing the raw action executes the function, but React ignores the return value and leaves state unchanged.
2. **Return expected validation errors as values.** Domain validation errors become state and render in the UI, whereas thrown exceptions route to Error Boundaries.
3. **Derive loading states from `isPending`.** React toggles this flag through an internal transition, eliminating manual loading state flags and cleanup blocks."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why does the action receive the previous state as its first argument?"**
   Because `useActionState` follows the reducer pattern of computing next state from previous state. On the initial submission, the first argument holds the initial state value. On subsequent submissions, it holds whatever value the action returned previously. Unlike traditional reducers in `useReducer` that must remain synchronous and pure, an action in `useActionState` can be asynchronous, performing network requests before returning the next state. Because JavaScript binds arguments positionally, `previousState` must occupy the first parameter slot, placing `formData` in the second slot.
2. **"What happens if the user submits the form twice before the first answer comes back?"**
   When the submit button is disabled via `isPending`, subsequent submissions are prevented. If the button remains enabled, React queues rapid submissions sequentially. React executes each queued action one after another, passing the resolved state of each execution as `previousState` to the next. The `isPending` flag remains `true` until the entire queue finishes executing. If parallel background execution is required, the React documentation recommends combining `useState` with `useTransition` directly instead.
3. **"How do you handle and display server errors with useActionState?"**
   Distinguish between anticipated validation failures and unanticipated system crashes. Expected validation failures, such as duplicate records or invalid fields, are returned as values from the action function. React commits them to state, allowing the component to render the error message cleanly. Unanticipated crashes, such as network timeouts or server 500 errors, should be thrown as exceptions. Thrown exceptions bypass state updates, cancel queued submissions, and propagate directly to the nearest Error Boundary.

```tree dir=right caption="Interview comparison: what useState and useActionState share, and how the new message arrives."
`useState` vs. `useActionState` for a form message
- +`useState` [`setMessage`] | Keeps the message **between renders** | Your code **calls the setter**, and sets the pending flag **by hand**
- +`useActionState` [`signupAction` `isPending`] | Keeps the message **between renders** | React stores **what the action returns**, and sets **`isPending`** itself
```
