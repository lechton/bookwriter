# Lecture 40: Choosing Between Controlled State and Uncontrolled FormData

*(Does every field of a form need its own state variable?)*

> INTERVIEW QUESTION | ❱ CORE | Should a form use controlled state or uncontrolled FormData, and how do you choose?

---

## VS | State `value` and `onChange` vs. the Browser `name` and `FormData`: both keep the typed text, only state renders again

> A form can have many fields, and giving each one its own `useState` forces React to re-render the entire form on every keystroke. **Keep state only for fields that must update the screen in real time as the user types.** For all other fields, rely on the browser and read their values at submission using `FormData`.

In React applications, forms often contain numerous inputs. Developers frequently connect every single input to a state variable out of habit. A form with ten fields ends up with ten `useState` declarations, ten setter functions, and ten change handlers. This pattern creates unnecessary complexity and performance overhead. **You only need `useState` for fields that actively change the visual interface as the user types.** Native browser inputs already manage their own internal text buffers. **You can leave the remaining fields uncontrolled and read their values upon submission with `FormData`.**

Consider a signup form with five fields: First Name, Last Name, City, Email, and Password. Ask yourself: does the interface need to respond immediately to every keystroke in every field? In this form, only the Password field requires live feedback, updating a color-coded strength indicator directly beneath it. The other four fields require no immediate visual reaction while the user types. Their values are only needed once, at the moment the user clicks submit. Although all five inputs reside in the same component, only one requires React state.

**Why this matters:** Declaring state for all five fields forces React to execute the component function and reconcile the virtual DOM for every letter typed. In this scenario, only the Password field benefits from `useState`. The browser natively retains the values of the other four fields until you read them at submission using `FormData`.

### A Form in Plain JavaScript

To understand uncontrolled forms, look at how plain JavaScript reads form values. You attach a submit listener to the form and inspect its inputs only when the user submits:

```js title="Reading a form at submit in plain JavaScript"
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = ~new FormData(form)~; // Asks the browser for every field that has a name
  console.log(~formData.get('email')~); // 'john@mail.com'
});
```

Notice what you did not do. You did not maintain a JavaScript variable to capture each letter while the user typed. Native HTML `<input>` elements manage their own internal value buffers automatically. You simply query the final values when the submission event occurs.

In Lesson 20, you learned how React implements the opposite pattern through controlled fields. In a controlled field, React state acts as the single source of truth, and the input element displays whatever string state currently holds:

```jsx title="A controlled field"
const [password, setPassword] = useState('');

<input ~value={password}~ onChange={e => setPassword(e.target.value)} /> {/* The field shows only what password holds in state */}
```

> [!DEFINITION]
> **Controlled and uncontrolled fields.** [REVIEW] A controlled field binds its value directly to React state, making React the single source of truth.
> 1. A controlled field passes `value={state}` and `onChange={e => setState(e.target.value)}`. React updates state and re-renders the component on every keystroke.
> 2. An uncontrolled field omits the `value` prop. The browser DOM manages the text buffer, and React does not re-render as the user types.
> 3. An input must remain either controlled or uncontrolled for its entire lifecycle. Switching from one to the other produces a React warning (Lesson 20).

Visually, both types of inputs appear identical to the user. Each shows typed characters immediately. Under the hood, their runtime mechanics differ completely:
1. **The controlled field** calls a state setter on every keystroke. Calling a setter instructs React to schedule a re-render of the component (Lesson 13). React re-executes the component function for every character typed.
2. **The uncontrolled field** triggers no state changes. The browser updates the input element in the DOM directly, and React performs zero work while the user types.

Why did Lesson 20 introduce controlled fields? Because user interfaces often need to respond dynamically to typing in real time. A password strength indicator that turns green after eight characters requires immediate access to the current string, along with a component re-render to display the updated message. Native browser inputs cannot trigger React re-renders on their own. React state provides that capability.

That distinction governs your choice for every input in an application.

### The Rule of Thumb: does the page change while the user types?

**Evaluate each field individually: does any part of the interface need to update or react while the user types into this field? If yes, store its value in React state. If the application only needs the data when the user submits the form, assign the field a `name` attribute and extract its value at submit time with `FormData`.**

A senior developer guards against three common mistakes:
1. **An uncontrolled field missing a `name` attribute.** The `FormData` API ignores unnamed inputs. Calling `formData.get()` returns `null` silently without throwing any error or warning.
2. **Controlling every field out of reflex.** In large forms with dozens of fields, controlling every input forces React to re-render the entire component tree on every keystroke, causing noticeable input lag on lower-powered devices.
3. **Placing form state too high in the component tree.** Storing input state in a root component like `App` causes the entire page, including static headers and navigation bars, to re-render on every keystroke.

The following sections illustrate each concept using a small shop signup form.

## SECTION | The Sign up Form of a Small Shop

Our example is the signup page of a small online store called `MyShop`. The page contains an Email input, a Password input, a hint message beneath the password, and a submit button.

```page caption="The Sign up form when the page opens."
heading: MyShop
section: Sign up
form:
  field: Email
  field: Password
line: Use 8 or more characters
form:
  submit: Sign up
```

Observe how the interface responds as the user interacts with each input:
1. **The user enters `john@mail.com` into the Email input.** No other element on the page needs to react to this text. The store only needs the email address once, when the user clicks Sign up.
2. **The user enters the password `secret12`.** The hint message below the input updates dynamically as characters are entered. It displays `Use 8 or more characters` until the eighth character is typed, at which point it updates to `Looks good`.

```page caption="The same form after the user types john@mail.com and the 8-character password secret12."
heading: MyShop
section: Sign up
form:
  field: Email | john@mail.com
  field: Password | •••••••• | good
line: Looks good | good
form:
  submit: Sign up
```

Apply the Rule of Thumb to each input:
1. **The Email field.** No part of the page responds to keystrokes in this input. It remains uncontrolled: it receives an HTML `name` attribute, and our code extracts its value upon form submission.
2. **The Password field.** The validation hint must update on every keystroke. It requires controlled state to trigger immediate re-renders.

One form uses two different strategies. Combining controlled and uncontrolled inputs in the same form is standard practice: you choose the appropriate strategy field by field rather than locking the entire form into one approach.

The project consists of five files:

```files title="signup-page: File Explorer" caption="How the files of our Sign up page sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and renders `SiteHeader` and `SignupForm`
  components/
    SiteHeader.jsx | default export | Exports `SiteHeader`, the header with the shop name
    SignupForm.jsx | default export | Exports `SignupForm`, the form with the Email and Password fields
```

`App` renders the header and the form together on the page:

```jsx title="src/App.jsx"
import SiteHeader from './components/SiteHeader.jsx';
import SignupForm from './components/SignupForm.jsx';

export default function App() {
  return (
    <main>
      ~<SiteHeader />~ {/* The header with the shop name */}
      ~<SignupForm />~ {/* The form this lesson builds, one field at a time */}
    </main>
  );
}
```

```jsx title="src/components/SiteHeader.jsx"
export default function SiteHeader() {
  return (
    <header>
      <h1>MyShop</h1>
    </header>
  );
}
```

Now let's construct the form step by step, examining the underlying mechanics and edge cases along the way:

**PRINCIPLES:** Place an input into React state only when the interface must update while the user types. Keep all other inputs uncontrolled, and extract their values at submit time with `FormData`. Four principles govern this architecture:
1. **Principle 1: `name` Is the Key FormData Uses.** At submit time, `new FormData(e.currentTarget)` collects every input that has a `name` attribute. An input without a `name` attribute is omitted and yields `null`.
2. **Principle 2: An Uncontrolled Field Renders Nothing While the User Types.** A controlled field triggers a component re-render on every keystroke. In large forms, that extra work degrades performance.
3. **Principle 3: Control a Field When the Page Changes on Every Keystroke.** The password hint requires both the latest string and a re-render after every character. Only controlled state provides both.
4. **Principle 4: Keep the State of a Field in the Form Component.** A state change re-renders the component declaring that state and all its descendants. Keeping field state inside `SignupForm` prevents unrelated components like `SiteHeader` from re-rendering during typing.

---

## PRINCIPLE | `name` and `FormData`: the browser hands you every named field at submit

> [!PRINCIPLE]
> **Principle 1: `name` Is the Key FormData Uses**
>
> *Give every field that you read at submit a `name`, build the form data with `new FormData(e.currentTarget)`, and read each field with `formData.get` and that same name.*
>
> You do not need React state to capture what the user typed. The browser natively stores the text of every input field. When the form submits, `FormData` collects every field with an HTML `name` attribute, using that `name` as the lookup key. An input without a `name` attribute is completely ignored by `FormData`, causing `formData.get` to return `null` without throwing any runtime error.
>
> **DO THIS:**
> ```jsx
> function handleSubmit(e) {
>   e.preventDefault();
>   const formData = new FormData(e.currentTarget);
>   console.log(formData.get('email'));
> }
> <input ~name="email"~ /> {/* formData.get('email') returns the typed email */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleSubmit(e) {
>   e.preventDefault();
>   const formData = new FormData(e.currentTarget);
>   console.log(formData.get('email'));
> }
> ~<input />~ {/* **WRONG:** no name, so formData.get('email') returns null */}
> ```

### `FormData` in React, in its smallest form

`FormData` is not a React-specific feature. It is a standard browser Web API available in all modern JavaScript environments. The only requirement is providing a reference to the `<form>` DOM element.

In plain JavaScript, you locate the form element using `document.querySelector('form')`. In React, you do not query the DOM manually. When the user submits a form, React invokes your `onSubmit` handler and passes a synthetic event object. The property `e.currentTarget` points directly to the `<form>` DOM element that received the handler (Lesson 11). Passing `e.currentTarget` to `new FormData()` gives you access to all named inputs using standard browser methods:

```jsx title="Reading the Email field at submit with FormData"
function handleSubmit(e) {
  e.preventDefault();
  const formData = ~new FormData(e.currentTarget)~; // e.currentTarget is the <form> element React created
  console.log(~formData.get('email')~); // Logs the text stored under the name email
}

<form onSubmit={handleSubmit}>
  <input ~name="email"~ /> {/* This name becomes the key in the form data */}
  <button type="submit">Sign up</button>
</form>
```

> [!DEFINITION]
> **What is FormData?** [NEW] `FormData` is a standard browser Web API object that stores form field entries as key-value pairs. You instantiate it by passing a form DOM element: `new FormData(e.currentTarget)`.
> 1. It extracts every submittable input element that carries a `name` attribute, using the `name` as the key and the current input text as the value.
> 2. You read individual entries using the getter method: `formData.get('email')`.
> 3. It serializes the input values at the exact moment of instantiation, so you create it inside the submit event handler.
> 4. An input missing a `name` attribute is omitted from serialization. Requesting an unrecorded key via `formData.get()` returns `null` without throwing an error (Lesson 40).

Three standard HTML and DOM mechanisms accomplish the entire task without any React-specific APIs:
1. **`name`** is a standard HTML attribute. React passes it directly to the underlying DOM `<input>` element. The React documentation notes that the `name` attribute serves as the key in the serialized form data.
2. **`new FormData(e.currentTarget)`** reads the form DOM node and gathers all named fields at the exact moment of submission.
3. **`formData.get('email')`** retrieves the string stored under the key `'email'`.

The string passed to `formData.get('email')` and the attribute value in `name="email"` represent the single point of connection between your component code and the DOM input. They must match character for character.

```tree dir=right caption="How the text in the Email field reaches our code at submit: the name on the field becomes the key in the form data."
How `john@mail.com` reaches `handleSubmit`
- +1. The field [`name="email"`] | The user types **`john@mail.com`** | The **browser** keeps the text
- +2. The form data [`new FormData`] | Built when the user **clicks Sign up** | Holds one entry: **`email`** with **`john@mail.com`**
- +3. Our code [`formData.get`] | Asks for the entry named **`email`** | Gets **`john@mail.com`**
```

Here is the initial implementation of `SignupForm`, containing only the uncontrolled Email input:

```jsx title="src/components/SignupForm.jsx"
export default function SignupForm() {
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(~formData.get('email')~); // Logs john@mail.com when the user clicks Sign up
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <label>
        Email
        <input ~name="email"~ /> {/* Uncontrolled: the browser keeps what the user types */}
      </label>
      <button type="submit">Sign up</button>
    </form>
  );
}
```

When the user enters `john@mail.com` and clicks Sign up, calling `e.preventDefault()` stops the browser from initiating a full-page HTTP navigation (Lesson 11). The browser console logs the submitted email address:

```page caption="The Sign up page after the user types john@mail.com and clicks Sign up."
heading: MyShop
section: Sign up
form:
  field: Email | john@mail.com | good
  submit: Sign up
log: john@mail.com | SignupForm.jsx:5
```

### VS | `e.target` vs. `e.currentTarget` inside `onSubmit`: both are the `<form>` element

In their documentation examples, the React team often writes `new FormData(e.target)`. Our example code writes `new FormData(e.currentTarget)`. Which approach is technically correct?

Inside a form submit handler attached to `<form onSubmit={...}>`, both properties usually reference the same DOM node. In standard DOM event dispatching, `e.target` represents the element that originated the event, while `e.currentTarget` represents the element whose event listener is currently executing (Lesson 11). Because form submission events originate at the `<form>` level and the listener is attached to that same `<form>`, both properties refer to that form DOM element. Using `e.currentTarget` is a safer engineering habit because it always guarantees a reference to the element hosting the listener, even if an event bubbles up from a nested control.

### A field without `name` has no entry in the form data

Developers accustomed to controlled inputs often forget to add `name` attributes because controlled fields do not require them:

```jsx title="src/components/SignupForm.jsx" startLine="11"
      <label>
        Email
        ~<input />~ {/* **WRONG:** no name, so the form data has no entry called email */}
      </label>
```

**Omitting the `name` attribute causes your submission logic to receive no data, while the interface gives zero indication of failure.** Here is the sequence of events:
1. The user types `john@mail.com` into the input and clicks the Sign up button.
2. `e.preventDefault()` prevents page reload, and no JavaScript exception is thrown.
3. `new FormData()` inspects all controls inside the form. Because the input has no `name` attribute, it is not recognized as a submittable control and is omitted from the serialized dataset.
4. Calling `formData.get('email')` searches for a key that does not exist in the collection and returns `null`.
5. The console prints `null`, and your backend submission payload fails silently without the email address.

::: row caption="The same Email field with and without name: only the field with name reaches the form data."
::: col title="Email field with name" tag="the email reaches our code" tone=good
```page size=mini
form:
  field: Email | john@mail.com | good
  submit: Sign up
log: john@mail.com | SignupForm.jsx:5
```
```jsx title="SignupForm.jsx" good="1"
<input ~name="email"~ /> {/* Stored under the key email */}
```
`formData.get('email')` finds the entry and returns the text.
:::
::: col title="Email field without name" tag="the email is missing" tone=bad
```page size=mini
form:
  field: Email | john@mail.com | bad
  submit: Sign up
log: null | SignupForm.jsx:5
```
```jsx title="SignupForm.jsx" bad="1"
~<input />~ {/* **WRONG:** no name, so no entry in the form data */}
```
The field shows the email, but the form data never holds it.
:::
:::

Remember this core rule: no `name` attribute means no entry in `FormData`. The HTML `name` attribute acts as the lookup key.

---

## PRINCIPLE | A field with only `name`: a keystroke does not render the component

> [!PRINCIPLE]
> **Principle 2: An Uncontrolled Field Renders Nothing While the User Types**
>
> *A field with `value` and `onChange` makes React render the component after every keystroke. A field with only a `name` makes React render nothing while the user types.*
>
> Both field types display the user's keystrokes immediately, which can create the illusion that their runtime costs are identical. They are not. A controlled field invokes a state setter on every keystroke, and every state update forces React to re-render the component holding that state. When an application only needs the input value upon submission, that continuous rendering provides no benefit, and in complex forms it produces noticeable input lag.
>
> **DO THIS:**
> ```jsx
> <input ~name="email"~ /> {/* Read once at submit, no render while the user types */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const [email, setEmail] = useState('');
> <input value={email} ~onChange={e => setEmail(e.target.value)}~ /> {/* **WRONG:** renders the form on every keystroke, though the page reads the email only at submit */}
> ```

### The same Email field, two ways, and one log line

You can verify component rendering directly by placing a log statement at the top level of the component function. Every time React executes `SignupForm`, a message prints to the console:

```jsx title="A log line that prints on every render"
export default function SignupForm() {
  ~console.log('SignupForm rendered');~ // Prints every time React calls SignupForm
```

Now compare the Email field implemented as uncontrolled versus controlled:

```jsx title="Email with name"
<input ~name="email"~ /> {/* The browser keeps the text */}
```

```jsx title="Email with value and onChange"
const [email, setEmail] = useState('');

<input value={email} ~onChange={e => setEmail(e.target.value)}~ /> {/* Every keystroke calls setEmail */}
```

When the page loads and the user types the letters jo into each version, both inputs visually display `jo`. The console logs, however, tell two completely different stories:

::: row caption="The same Email field written two ways: both show jo, but only the field with value and onChange renders SignupForm after every keystroke."
::: col title="Email with name" tag="no render while typing" tone=good
```page size=mini
form:
  field: Email | jo | good
```
```devconsole
+ SignupForm rendered
+ SignupForm rendered
```
The two lines come from the page load. Typing `jo` adds none.
:::
::: col title="Email with value and onChange" tag="one render per keystroke" tone=bad
```page size=mini
form:
  field: Email | jo | good
```
```devconsole
+ SignupForm rendered
+ SignupForm rendered
+ SignupForm rendered
+ SignupForm rendered
+ SignupForm rendered
+ SignupForm rendered
```
Two lines come from the page load, then two more after each of the 2 keystrokes.
:::
:::

Why do two log lines appear per render? In development mode, React `<StrictMode>` intentionally executes component functions twice to help detect unexpected side effects during rendering (Lesson 14). With React DevTools active, the second log entry in each pair is slightly dimmed.

Here is what happens during each keystroke under each approach:
- **With `name` alone**, the browser handles the input natively. The browser updates the DOM element's internal text buffer. Because no React state was modified, React has no reason to re-render `SignupForm`.
- **With `value` and `onChange`**, every keystroke fires an event listener that calls `setEmail` with the latest string. Changing state schedules a component re-render (Lesson 13), prompting React to re-execute `SignupForm` and pass the new state back into the `<input>` element.

The official React documentation summarizes this concisely: "When you use a controlled input, you set the state on every keystroke."

```tree caption="What happens after one keystroke by the user in each version of the Email field."
One keystroke in the Email field
- +With `name` [`name="email"`] | The **browser** writes the letter into the field | **No state** changes, so React **renders nothing**
- !With `value` and `onChange` [`value={email}` `onChange`] | `onChange` calls **`setEmail`** with the new text | React **renders `SignupForm` again**, and the field shows the new text
```

### The cost is the render, not the field

In our minimal two-field form, one re-render per keystroke completes in a fraction of a millisecond. The performance cost becomes significant as the size and complexity of the component tree expand.

**Beware: when every input in a large form is tied to state, typing a single character anywhere forces React to re-render the entire form.** Consider how developers encounter this issue:
1. After learning controlled components, a developer declares separate `useState` hooks for all forty fields in a complex enterprise form.
2. The user types a single character into one input.
3. React re-executes the component function, instantiates JSX elements for all forty fields, and reconciles the entire virtual DOM tree.
4. On a mobile phone or budget laptop, this repeated work creates noticeable latency between typing and visual feedback.

The React documentation specifically cautions that when a state-holding component renders a large tree on every keystroke, "this can get slow".

In reality, most of those forty fields are never read until the user clicks Save. They require no live interface synchronization while typing. Giving each field an HTML `name` attribute and extracting values at submit time with `FormData` eliminates all re-rendering overhead during typing.

Because our Email field is only read when the user submits, it remains uncontrolled:

```jsx title="src/components/SignupForm.jsx"
export default function SignupForm() {
  ~console.log('SignupForm rendered');~ // Prints on page load, and never while the user types the email
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData.get('email'));
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <label>
        Email
        <input ~name="email"~ /> {/* Uncontrolled: the browser keeps the email until submit */}
      </label>
      <button type="submit">Sign up</button>
    </form>
  );
}
```

Remember this guideline: if the application only reads the value upon submission, the field does not belong in state.

---

## PRINCIPLE | `value` and `onChange`: the page can change on every keystroke

> [!PRINCIPLE]
> **Principle 3: Control a Field When the Page Changes on Every Keystroke**
>
> *Put a field in state with `value` and `onChange` when the page must change while the user types, and read that field from state at submit.*
>
> A real-time validation hint beneath an input requires two things on every keystroke: immediate access to the current string, and a component re-render to display the updated feedback. An uncontrolled field provides neither capability because the browser retains the text internally and React never re-renders. A controlled field provides both. The remaining fields in the form can remain uncontrolled because you decide the strategy for each input individually.
>
> **DO THIS:**
> ```jsx
> const [password, setPassword] = useState('');
> <input type="password" ~value={password}~ onChange={e => setPassword(e.target.value)} /> {/* Each keystroke renders the form */}
> <p>{password.length < 8 ? 'Use 8 or more characters' : 'Looks good'}</p>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <input type="password" ~name="password"~ /> {/* **WRONG:** no state and no render, so the hint can never change */}
> <p>Use 8 or more characters</p>
> ```

### The password hint, two ways

Now examine the Password field and its validation hint. The requirements specify that the hint must read `Use 8 or more characters` until the input reaches eight characters, at which point it should display `Looks good`. Compare both implementations:

```jsx title="Password with name"
<input type="password" ~name="password"~ /> {/* The browser keeps the text, and React renders nothing */}
<p>Use 8 or more characters</p>
```

```jsx title="Password with value and onChange"
const [password, setPassword] = useState('');

<input type="password" ~value={password}~ onChange={e => setPassword(e.target.value)} /> {/* Every keystroke saves the text into password */}
<p>{~password.length < 8~ ? 'Use 8 or more characters' : 'Looks good'}</p> {/* Picks the hint on every render */}
```

Consider what occurs when the user types the eight-character password `secret12` into each version:

::: row caption="The same Password field written two ways: both show 8 dots, but only the field with value and onChange updates the hint."
::: col title="Password with name" tag="the hint never changes" tone=bad
```page size=mini
form:
  field: Password | •••••••• | bad
line: Use 8 or more characters | bad
```
The password has 8 characters, and the hint still asks for 8.
:::
::: col title="Password with value and onChange" tag="the hint follows the typing" tone=good
```page size=mini
form:
  field: Password | •••••••• | good
line: Looks good | good
```
After the eighth character, the hint says `Looks good`.
:::
:::

Both input fields mask characters with dots as expected. With an uncontrolled input, however, the validation hint fails completely for two reasons:
1. **The component has no string value to evaluate.** The text resides entirely within the browser DOM node, leaving the component with no `password` variable to inspect with `.length`.
2. **React does not re-render.** Even if the component could read the DOM node directly, typing fires no state setters, so React never re-executes the component function to recalculate the ternary expression.

A controlled field solves both problems. Every keystroke triggers `setPassword`, saving the updated string into React state and prompting React to re-render the component with the new `password` value.

When is a controlled field genuinely necessary? The React documentation clarifies that you should use controlled fields when component state is required to re-render the interface on every edit. Common production use cases include:
1. **Real-time display or validation**, such as password strength meters, remaining character counters, or instant search auto-complete suggestions.
2. **Programmatic value manipulation**, such as a button that clears an input or fills it with default data.
3. **Coordinated form controls**, such as disabling the submit button until required fields pass validation (Lesson 21).

### The email from FormData, the password from state

Our Password field requires state because of the live hint. The Email field remains uncontrolled with an HTML `name` attribute. When the form submits, our handler retrieves each value from its respective source of truth:

```jsx title="src/components/SignupForm.jsx"
import { useState } from 'react';

export default function SignupForm() {
  const [password, setPassword] = useState('');
  console.log('SignupForm rendered');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = ~formData.get('email')~; // From the browser, read once at submit
    console.log({ email, ~password~ }); // From state
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <label>
        Email
        <input ~name="email"~ /> {/* Uncontrolled: read at submit */}
      </label>
      <label>
        Password
        <input
          type="password"
          ~value={password}~ // Controlled: shows only what password holds
          onChange={e => setPassword(e.target.value)}
        />
      </label>
      <p>{~password.length < 8~ ? 'Use 8 or more characters' : 'Looks good'}</p> {/* Changes after the eighth character */}
      <button type="submit">Sign up</button>
    </form>
  );
}
```

The Password input does not define a `name` attribute because our submission code never queries `FormData` for the password. It accesses `password` directly from component state.

When the user enters `john@mail.com`, the console prints no new messages. When the user enters `secret12`, two `SignupForm rendered` messages appear per keystroke, exactly as described in Principle 2. If you clear the console and click Sign up, form submission triggers no state updates, React schedules no re-renders, and the console outputs both values:

```page caption="The Sign up form after the user types john@mail.com and secret12, the Console is cleared, and the user clicks Sign up."
heading: MyShop
section: Sign up
form:
  field: Email | john@mail.com | good
  field: Password | •••••••• | good
line: Looks good | good
form:
  submit: Sign up
log: {email: 'john@mail.com', password: 'secret12'} | SignupForm.jsx:11
```

### `useState('')`, never `useState()`

When creating controlled text inputs, always initialize state with an empty string: `useState('')` (Lesson 20). What happens if you call `useState()` without an initial argument?
1. `password` initializes to `undefined`. Passing `value={undefined}` signals to React that the input should behave as uncontrolled.
2. When the user types the first character, `password` updates to a string value, switching the input to controlled mode. React logs a red console warning: "A component is changing an uncontrolled input to be controlled".

In our specific component, the application crashes even earlier: evaluating `password.length` when `password` is `undefined` throws a runtime error, "Cannot read properties of undefined", crashing the render phase before anything mounts.

Remember: if an interface element must update as the user types, store the value in React state and initialize that state with `''`.

---

## PRINCIPLE | `useState` in `SignupForm`: each keystroke renders only the form

> [!PRINCIPLE]
> **Principle 4: Keep the State of a Field in the Form Component**
>
> *Write the `useState` of a controlled field in the component that holds the form, not in `App`, so each keystroke renders only the form.*
>
> A state update re-renders the component declaring that state as well as all nested components inside its tree. Placing input state at the top level of an application forces the entire page, including static headers, to re-render on every keystroke. Keeping that state inside the form component isolates the re-renders exclusively to the form.
>
> **DO THIS:**
> ```jsx
> function SignupForm() {
>   const [password, setPassword] = ~useState('')~; // Each keystroke renders only SignupForm
> }
> export default function App() {
>   return <main><SiteHeader /><SignupForm /></main>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function App() {
>   const [password, setPassword] = ~useState('')~; // **WRONG:** each keystroke renders App, SiteHeader, and SignupForm
>   return <main><SiteHeader /><SignupForm password={password} onPasswordChange={setPassword} /></main>;
> }
> ```

### The same `password` state in two places

Every keystroke in the Password field re-renders the component that manages the `password` state. The component that re-renders is determined by where you place the `useState` call.

To observe this behavior, add a log statement to `SiteHeader` as well:

```jsx title="src/components/SiteHeader.jsx"
export default function SiteHeader() {
  ~console.log('SiteHeader rendered');~ // Prints every time React calls SiteHeader
  return (
    <header>
      <h1>MyShop</h1>
    </header>
  );
}
```

In the first architecture, `App` declares the `password` state and passes both the value and the setter down to `SignupForm` as props (Lesson 24):

```jsx title="src/App.jsx with the state in App"
export default function App() {
  const [password, setPassword] = ~useState('')~; // Every keystroke changes state in App
  return (
    <main>
      <SiteHeader />
      <SignupForm password={password} onPasswordChange={setPassword} />
    </main>
  );
}
```

In this setup, `SignupForm` maintains no state of its own. Its Password input displays the `password` prop supplied by `App` and delegates change handling to the callback prop (Lesson 23):

```jsx title="The Password field inside SignupForm, with the state in App"
<input type="password" value={password} onChange={e => ~onPasswordChange~(e.target.value)} /> {/* Calls setPassword of App, so the state in App changes */}
```

In the second architecture, `App` holds no state, and `SignupForm` encapsulates `password` locally, as shown in Principle 3:

```jsx title="src/App.jsx with the state in SignupForm"
export default function App() {
  return (
    <main>
      <SiteHeader />
      ~<SignupForm />~ {/* SignupForm holds password itself */}
    </main>
  );
}
```

Both architectures render the same visual interface, update the password hint identically, and submit the same data. Only the console reveals the underlying performance difference. When the page loads and the user types the single character `s` into the Password field:

::: row caption="The same password state placed in App or in SignupForm: the page is the same, but only the state in App renders SiteHeader on every keystroke."
::: col title="State in App" tag="the header renders on every keystroke" tone=bad
```devconsole
+ SiteHeader rendered
+ SiteHeader rendered
+ SignupForm rendered
+ SignupForm rendered
+ SiteHeader rendered
+ SiteHeader rendered
+ SignupForm rendered
+ SignupForm rendered
```
After the four page-load lines, the keystroke renders the header and the form again.
:::
::: col title="State in SignupForm" tag="only the form renders" tone=good
```devconsole
+ SiteHeader rendered
+ SiteHeader rendered
+ SignupForm rendered
+ SignupForm rendered
+ SignupForm rendered
+ SignupForm rendered
```
After the four page-load lines, the keystroke renders only the form. The header stays still.
:::
:::

**When state resides in `App`, typing a single character forces `SiteHeader` to re-render, even though nothing in the header has changed.** Here is the step-by-step execution path:
1. The `onChange` handler calls `onPasswordChange`, which triggers the `setPassword` state setter located inside `App`.
2. React schedules a re-render of `App`.
3. Re-rendering `App` causes React to re-execute every child component in its returned JSX tree: both `SiteHeader` and `SignupForm`.
4. The console prints `SiteHeader rendered` on every single keystroke.

This demonstrates a foundational rule of React rendering: a state change re-renders the component declaring that state and all components nested within it. When state lives in `App`, the entire page re-renders. When state is colocated inside `SignupForm`, only the form re-renders.

```tree caption="Where the password state lives decides which components React renders after every keystroke by the user."
Which components render after one keystroke
- !State in `App` [`App`] | React renders **`App`** again | `SiteHeader` and `SignupForm` **both render**, so the **whole page** renders on every keystroke
- +State in `SignupForm` [`SignupForm`] | React renders **`SignupForm`** again | `SiteHeader` **stays still**, and only the **form** renders on every keystroke
```

How do codebases end up with the unoptimized pattern? Often developers declare form state directly inside a page-level component alongside other layout logic. On small pages, the performance penalty goes unnoticed. On complex pages with heavy navigation bars or data visualizations, re-rendering the entire page on every keystroke creates sluggish typing behavior.

The React documentation recommends state colocation as the primary remedy: keep field state localized inside the specific component that renders the input. Only two exceptions warrant lifting state higher:
1. **Other sibling components genuinely require the live typed text.** In that case, lifting state is necessary (Lesson 24). When rendering large downstream trees becomes expensive, React provides `useDeferredValue` to preserve input responsiveness, which Lesson 68 covers in detail.
2. **Other components only need the text upon submission.** In that scenario, keep the inputs uncontrolled, give them HTML `name` attributes, and read their values at submit time with `FormData` as shown in Principle 1.

Remember: keep form state as close to the form controls as possible so each keystroke re-renders only the form.

---

## All 4 Principles Together

### The complete files

The Email input uses an HTML `name` attribute and is read once at submit time using `FormData`. The Password input is controlled through React state because its validation hint updates in real time. That state is colocated inside `SignupForm`, ensuring `SiteHeader` does not re-render during typing.

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  ~<StrictMode>~ {/* In development, React calls each component twice per render */}
    <App />
  </StrictMode>
);
```

```jsx title="src/App.jsx"
import SiteHeader from './components/SiteHeader.jsx';
import SignupForm from './components/SignupForm.jsx';

export default function ~App~() { // 1. Called 1st when the page loads, and holds no state
  return (
    <main>
      <SiteHeader />
      <SignupForm />
    </main>
  );
}
```

```jsx title="src/components/SiteHeader.jsx"
export default function ~SiteHeader~() { // 2. Called 2nd on page load, and never while the user types
  console.log('SiteHeader rendered');
  return (
    <header>
      <h1>MyShop</h1>
    </header>
  );
}
```

```jsx title="src/components/SignupForm.jsx"
import { useState } from 'react';

export default function ~SignupForm~() { // 3. Called 3rd on page load, and again after every keystroke in the Password field
  const [password, setPassword] = ~useState('')~; // Principles 3 and 4: in state, in the form component
  console.log('SignupForm rendered');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = ~new FormData(e.currentTarget)~; // Principle 1: collects every field that has a name
    const email = formData.get('email');
    console.log({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign up</h2>
      <label>
        Email
        <input ~name="email"~ /> {/* Principles 1 and 2: uncontrolled, no render while the user types */}
      </label>
      <label>
        Password
        <input
          type="password"
          ~value={password}~ // Principle 3: controlled, so the hint follows every keystroke
          onChange={e => setPassword(e.target.value)}
        />
      </label>
      <p>{password.length < 8 ? 'Use 8 or more characters' : 'Looks good'}</p>
      <button type="submit">Sign up</button>
    </form>
  );
}
```

On initial page load, the console displays the rendering sequence of both logging components, each printed twice due to StrictMode:

```devconsole
+ SiteHeader rendered
+ SiteHeader rendered
+ SignupForm rendered
+ SignupForm rendered
```

When the user enters `john@mail.com`, the console output remains unchanged. When the user enters `secret12`, two `SignupForm rendered` lines appear after each keystroke. After clearing the console and clicking Sign up, the submission handler logs the collected data:

```page caption="The finished Sign up page after the user types john@mail.com and secret12, the Console is cleared, and the user clicks Sign up."
heading: MyShop
section: Sign up
form:
  field: Email | john@mail.com | good
  field: Password | •••••••• | good
line: Looks good | good
form:
  submit: Sign up
log: {email: 'john@mail.com', password: 'secret12'} | SignupForm.jsx:11
```

### When React calls each component

During initial mounting, React executes `App`, then `SiteHeader`, and finally `SignupForm`. After mounting, only one user interaction causes React to re-render: typing into the Password input, which re-renders `SignupForm` in isolation. Entering text into the Email input and clicking the Sign up button trigger zero component re-renders:

```tree caption="Which components React calls on page load, on a keystroke in each field, and on submit."
`App` [1. Called on page load] | Holds **no state** | Renders `<SiteHeader />` and `<SignupForm />`
- +`SiteHeader` [2. Called on page load] | Logs `SiteHeader rendered` | **Never** called again while the user types
- +`SignupForm` [3. Called on page load] | Logs `SignupForm rendered` | Called again after **every keystroke in the Password field**
  - +Email field [`name="email"`] | Typing calls **no component** | Read **once** in `handleSubmit` with `FormData`
  - +Password field [`value={password}`] | Typing calls **`SignupForm`** again | The hint changes after the **eighth character**
```

| Where it goes wrong | What the user sees | The fix |
| :--- | :--- | :--- |
| **A field without `name`** | The sign up code gets `null`, with no error | Write the same name on the field and in `formData.get` |
| **Every field in state** | In a large form, the letters appear late | Give a field state only when the page changes while the user types |
| **The hint with only a `name`** | The hint never changes | Make the field controlled with `value` and `onChange` |
| **`useState()` with no start value** | A blank page, or the uncontrolled to controlled error | Start the state with `''` |
| **The state of a field in `App`** | Every keystroke renders the whole page | Keep the state in the component that holds the form |

To summarize the core architectural rule: **place an input into React state only when the interface must update while the user types. Keep all other inputs uncontrolled, and read their values once upon submission with `FormData`.**

---

## For the Interview

> **The Interview Question:** Should a form use controlled state or uncontrolled FormData, and how do you choose?

### How to Answer Clearly in 30 Seconds

"I choose field by field rather than making an all-or-nothing decision for the entire form. A controlled field uses `value` and `onChange` to store its text in React state, which causes React to re-render the component on every keystroke. An uncontrolled field lets the browser DOM store the text, and I extract its value once at submission using `new FormData(e.currentTarget)` and `formData.get`, matching the input's HTML `name` attribute. My decision criteria are:
1. **Uncontrolled with `FormData`** whenever the application only needs field values upon form submission. This avoids unnecessary re-renders while typing and reduces boilerplate code.
2. **Controlled with state** whenever the interface must respond dynamically to every keystroke, such as displaying password strength indicators, enforcing character limits, rendering live search suggestions, or disabling a submit button until inputs pass validation.
3. **A mixed approach** in production forms: I read controlled inputs directly from component state and uncontrolled inputs from `FormData`. I always colocate controlled state within the form component itself so typing re-renders only that form."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Your `FormData` code returns `null` for a field. What happened?"**
   The `<input>` element is missing an HTML `name` attribute, or the string passed to `formData.get()` does not match the `name` attribute exactly. Browser `FormData` serialization only collects submittable inputs that possess a valid `name` attribute. When an input lacks a `name`, it is skipped entirely, causing `formData.get()` to return `null` without throwing an exception or logging a warning. If you need to convert an entire `FormData` instance into a plain JavaScript object, you can call `Object.fromEntries(formData.entries())`. Furthermore, a `FormData` instance can be passed directly as the `body` option in a native `fetch` request.
2. **"Aren't controlled inputs always slow?"**
   No. The performance overhead comes from rendering, not from storing state itself. A compact form with a handful of controlled inputs renders in sub-millisecond time. Performance degradation occurs when the component holding state renders an extensive component tree on every keystroke, such as a large administrative form where dozens of inputs each hold individual state, or when field state is declared at the top-level `App` component. The corrective steps, in order of priority:
   1. Keep inputs uncontrolled when their values are only needed upon submission.
   2. Colocate controlled state down into the specific component that renders the input controls.
   3. When an expansive descendant tree must genuinely consume the typed text, wrap that downstream update in `useDeferredValue` (covered in Lesson 68) to keep typing responsive without blocking the main thread.
3. **"Can one field be controlled at first and uncontrolled later, or both at once?"**
   No. A React input cannot be both controlled and uncontrolled simultaneously, and switching between modes during a component lifecycle is an anti-pattern. React determines whether an input is controlled based on the presence of a defined `value` prop. If an input initializes with `useState()` where the initial value is `undefined`, React mounts it as uncontrolled. Once typing updates state to a defined string, React detects a mode change and logs a warning: "A component is changing an uncontrolled input to be controlled". Controlled text inputs must always initialize with an empty string `''`. Different inputs within the same form can still adopt different strategies. In React 19, form actions receive a `FormData` instance directly as their first argument, reinforcing uncontrolled inputs as the natural, idiomatic baseline for submission-only workflows (Lesson 41).

```tree dir=right caption="Interview comparison: how to choose between a controlled field and an uncontrolled field read with FormData."
How to choose for each field of a form
- +Uncontrolled, read with `FormData` [`name="email"`] | The page reads the field **only at submit** | **No render** while the user types, and it needs a **`name`**
- +Controlled, kept in state [`value` `onChange`] | The page **changes on every edit**, or a button also **changes the text** | **One render per keystroke**, so keep the state in the **component that holds the form**
```
