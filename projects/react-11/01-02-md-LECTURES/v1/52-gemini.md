# Lecture 52: How Two Password Fields Get Their Own ids with useId

*(How can one component, placed twice on a form, connect each label to its own input field?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do you generate IDs that are unique, stable, and safe across server and client?

---

## VS | An id written by hand vs. `useId`: the same id in every copy, or a different id for each copy

> In static HTML, you connect a label to an `<input>` using a manually written `id` attribute. **In React, reusable components render multiple times on one page, requiring `useId` to generate distinct identifiers for each instance**. A hardcoded string duplicates across every copy, while `Math.random()` produces conflicting values between server HTML and client hydration.

In standard HTML, a form connects an input control to its label through an `id` attribute. The `<label>` element references that identifier using its `for` attribute:

```html title="Plain HTML: one label, one input field, one id"
<label for="email">Email</label>
<input ~id="email"~ /> <!-- The label above names this id -->
```

This identifier connects the label to the input control, providing two essential browser behaviors. First, clicking the label text activates and focuses the input field. Second, assistive technology such as a screen reader announces the label when a user navigates to the control.

> [!DEFINITION]
> **A screen reader.** [REVIEW] A screen reader is assistive software that reads webpage content aloud for users with visual impairments. When focus moves to an `<input>` element, the screen reader announces its associated label so the user understands what information to enter. Tools of this kind are called assistive technology (Lesson 20).

In JSX, you declare the identical relationship with one syntax change. Because `for` is a reserved keyword in JavaScript, React JSX uses `htmlFor` instead (Lesson 02):

```jsx title="The same pair in JSX"
<label ~htmlFor="email"~>Email</label> {/* htmlFor in JSX becomes for in the HTML */}
<input id="email" />
```

In static HTML documents, each form field is authored once, ensuring its identifier is unique across the document. In React, components serve as reusable building blocks that render multiple times on the same page. Every instance runs the same component code. If a component hardcodes a string such as `id="password"`, every mounted instance shares that exact identifier.

React provides a built-in Hook to eliminate manual identifiers:

```jsx title="Asking React for an id"
const id = ~useId()~; // React returns a different string for each copy of the component
return <input id={id} />;
```

> [!DEFINITION]
> **useId.** [NEW] `useId` is a built-in React Hook imported from `react`. It takes no arguments and returns a unique, stable string such as `_r_0_`. Each mounted instance of a component receives its own distinct string that persists for the lifetime of that component. You assign this string to element `id` attributes and corresponding `htmlFor` or `aria-` attributes. During server-side rendering, `useId` produces the identical string on both the server and client (Lesson 52).

### A sign-up form with two password fields

Consider a common sign-up interface. The form requires the user to enter their chosen password twice: once in a primary `Password` field and once in a `Confirm password` field. Beneath each field, an identical requirement hint appears:

```page caption="The sign-up form: two password fields, each with its label and its hint."
heading: Create account
form:
  field: Password
line: The password should contain at least 18 characters
form:
  field: Confirm password
line: The password should contain at least 18 characters
```

Both fields share identical visual styling and behavior. In a production codebase, you avoid duplicating this markup manually. Instead, you encapsulate the label, input, and hint into a single `PasswordField` component, rendering it twice in the form.

Because `PasswordField` is written once but mounts twice, the component itself cannot determine its instance count. The component cannot inspect the document to discover whether other copies exist. React manages the component tree and knows where every instance sits. By calling `useId`, each copy requests a unique identifier directly from React.

Developers typically attempt three approaches to assign this identifier, but two of them cause serious defects:
1. **A hardcoded string** repeats across every mounted copy. Both inputs render `id="password"`, meaning a click on the `Confirm password` label mistakenly moves focus to the first field.
2. **`Math.random()`** generates a distinct number per instance, allowing the form to function in a client-only app. However, when a server pre-renders the HTML (Lesson 46), the server generates one number and the client generates another, triggering hydration errors.
3. **`useId()`** generates a unique string per instance while guaranteeing identical values across both server rendering and client hydration.

Here are the three approaches side by side, each in the one line where they differ:

```jsx title="Three ways to fill the id inside PasswordField"
const id = ~'password'~; // 1. Written by hand: the same string in every copy
const id = ~'field-' + Math.random()~; // 2. A random number: a new one every time the component runs
const id = ~useId()~; // 3. Asked from React: one per copy, the same on the server and in the browser
```

In an isolated component with only one copy, all three strategies set matching values on the label and input. However, their behaviors diverge completely when multiple instances exist or when server rendering is introduced.

```tree caption="Three ways to fill the id of PasswordField, and where each one breaks."
Three ways to fill the id of `PasswordField`
- !Written by hand [`'password'`] | Works with **one copy** on the page | With two copies, **both fields share one id**, and the second label reaches the first field
- !A random number [`Math.random`] | Works in an app that runs **only in the browser** | With server rendering, **the server and the browser pick two different numbers**
- +Asked from React [`useId`] | **A different id for each copy** | **The same id** on the server and in the browser
```

Remember the central lesson of this chapter. **A component never invents its own element identifiers: it requests them from `useId`, because only React knows where each component instance lives in the tree.**

### What a wrong id costs the user

An invalid or duplicated identifier breaks form usability for users even when the visual layout appears correct to developers:
1. **The user focuses and types into the wrong field.** When an identifier is hardcoded, clicking the `Confirm password` label shifts focus to the first `Password` field. Subsequent typing enters text into the initial password instead of confirming it.
2. **The second field loses its accessible label.** Browsers associate labels with the first matching identifier in DOM order. Consequently, the first field receives multiple labels, while the second field has none. A screen reader user navigating to the confirmation field hears an unlabelled input.
3. **Server rendering and client hydration diverge.** When using `Math.random()` with server rendering, React logs console errors during page load. The official React documentation warns that hydration differences can cause slowdowns or attach event listeners to incorrect elements.

### The Rule of Thumb: every id inside a component comes from useId

**Whenever a component assigns an id to an element, and a label or accessibility attribute references that identifier, always retrieve the identifier from `useId`. Never hardcode strings, and never generate them with `Math.random()` or module-level counters.**

Does every form label require an explicit identifier? Not necessarily. Developers choose between three approaches to connect a label to its field:
1. **Nesting the input inside the label.** Wrapping an `<input>` inside a `<label>` creates an implicit association without needing an explicit identifier. While this covers the label, helper text still requires an explicit identifier via `aria-describedby`. Furthermore, explicit associations using `htmlFor` and `id` provide the widest compatibility across assistive tools.
2. **Hardcoding the identifier manually.** This approach functions only if the component appears exactly once across the entire application. The official React documentation advises against hardcoding identifiers in components.
3. **Generating the identifier with `useId()`.** This approach works reliably for any component that may render multiple times, and supports server-side rendering seamlessly.

```jsx title="The field inside the label: the label needs no id, but the hint still does"
<label>
  Password
  <input type="password" ~aria-describedby="password-hint"~ /> {/* The hint is reached only by its id */}
</label>
```

Our sign-up form includes a hint paragraph beneath each input, so this lesson implements explicit associations with `htmlFor` and `id`.

Senior engineers recognize three classic mistakes:
1. **Hardcoding an identifier inside a component template**, testing only a single instance during local development.
2. **Generating identifiers using `Math.random()` or global counters**, which fails when the component runs in server-rendered environments.
3. **Using `useId` to generate React list keys**, mistaking DOM accessibility identifiers for reconciliation keys.

## SECTION | The Create Account Form

Our working example is the sign-up form introduced earlier. The project structure consists of two source files:

```files title="signup-form: File Explorer" caption="The files of our sign-up form."
src/
  App.jsx | page | Exports `App` as default: the title and two `PasswordField` tags
  PasswordField.jsx | field | Exports `PasswordField` as default: the label, the password field, and the hint
```

The `App` component renders two instances of `PasswordField`, passing a distinct label to each:

```jsx title="src/App.jsx"
import PasswordField from './PasswordField.jsx';

export default function App() {
  return (
    <form>
      <h1>Create account</h1>
      ~<PasswordField label="Password" />~ {/* 1st copy */}
      ~<PasswordField label="Confirm password" />~ {/* 2nd copy */}
    </form>
  );
}
```

The App file remains unchanged throughout this chapter. We will modify only `PasswordField` across each principle. In Principle 4, we examine server rendering, adding server entry files to inspect hydration behavior.

**PRINCIPLES:** A form control and its label must share a unique identifier that never conflicts with other elements in the document. Four core principles govern this workflow:
1. **Principle 1: An id written by hand repeats in every copy.** The browser connects every label with that `htmlFor` to the first field only.
2. **Principle 2: `useId` gives each copy its own id.** Call it once, at the top level of the component, and pass its string to both `htmlFor` and `id`.
3. **Principle 3: One `useId` call names the field and its hint.** Add a different ending to the one string for each element, such as `id + '-hint'`.
4. **Principle 4: `Math.random` gives the server and the browser two ids.** With server rendering, the component runs twice, and only `useId` makes the same string both times.

---

## PRINCIPLE | `id="password"` inside a component: every copy repeats the same id

> [!PRINCIPLE]
> **Principle 1: An id Written by Hand Repeats in Every Copy**
>
> *An id written by hand inside a component appears once for every copy of the component, and the browser connects every label with that `htmlFor` to the first element only.*
>
> An id must be unique on the whole page. A component is written once, but React runs it once for every tag, so a fixed id appears once for every copy. When two fields share one id, a click on the second label puts the cursor in the first field, and the second field has no label for a screen reader. React prints no error.
>
> **DO THIS:**
> ```jsx
> function PasswordField({ label }) {
>   const id = ~useId()~; // A different id for each copy, as Principle 2 shows
>   return (
>     <div>
>       <label htmlFor={id}>{label}</label>
>       <input type="password" id={id} />
>     </div>
>   );
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function PasswordField({ label }) {
>   return (
>     <div>
>       <label htmlFor="password">{label}</label>
>       <input type="password" ~id="password"~ /> {/* **WRONG:** two copies give two fields with one id */}
>     </div>
>   );
> }
> ```

### Two elements with one id

Consider what happens when you author an input and label in plain HTML, and then paste that exact pair a second time:

```jsx title="The same label and field written twice"
<label htmlFor="name">Name</label>
<input ~id="name"~ /> {/* 1st field: the label above reaches it */}
<label htmlFor="name">Name</label>
<input ~id="name"~ /> {/* **WRONG:** 2nd field with the same id: the label above reaches the 1st field */}
```

Clicking the second `Name` label focuses the first input field instead of the second. Under the HTML specification, an `id` must be unique across the entire document. When multiple elements share identical identifiers, the browser label resolution algorithm selects the first matching element in document tree order. The second input becomes completely disconnected from its label.

Developers rarely paste duplicate elements manually. However, reusable React components produce this exact duplicate markup whenever a component is rendered multiple times.

### The hint and aria-describedby

Our password control requires an additional relationship: its requirement hint. A screen reader automatically announces a field's primary label, but it does not read separate explanatory text below the field by default. The input must explicitly declare which element provides its description.

> [!DEFINITION]
> **aria-describedby.** [NEW] `aria-describedby` is an accessibility attribute placed on an input. It accepts the `id` of an element that provides supplementary description, such as helper text or validation requirements. When a screen reader focuses the input, it announces the primary label followed by the description text. In JSX, all `aria-` attributes retain their standard hyphenated names (Lesson 02).

```jsx title="A field connected to its label and to its hint"
<label htmlFor="password">Password</label>
<input type="password" id="password" ~aria-describedby="password-hint"~ /> {/* Points at the hint by its id */}
<p ~id="password-hint"~>The password should contain at least 18 characters</p> {/* The hint that describes the field */}
```

Consequently, each password input instance requires two distinct identifiers: one for the input control itself, and one for its explanatory hint.

### PasswordField with the ids written by hand

Here is our initial `PasswordField` implementation. It copies the markup structure directly from static HTML, retaining hardcoded identifiers:

```jsx title="src/PasswordField.jsx" bad="5,6"
export default function PasswordField({ label }) {
  return (
    <div>
      <label htmlFor="password">{label}</label>
      <input type="password" ~id="password"~ aria-describedby="password-hint" /> {/* **WRONG:** the same id in every copy */}
      <p ~id="password-hint"~> {/* **WRONG:** the same hint id in every copy */}
        The password should contain at least 18 characters
      </p>
    </div>
  );
}
```

If only one `PasswordField` exists on the entire page, this code functions properly. When rendered twice, the interface malfunctions. The component code is identical in both cases. With one instance, the identifier names a single unique input. With two instances, that identifier duplicates, and the browser resolves every association to the first control.

### The form looks right, and the second label reaches the first field

**The form appears visually correct, and React emits no warnings, yet clicking the second label focuses the first field.** Here is the runtime sequence:
1. React executes `PasswordField` for each instance declared in the parent component (Lesson 04). Each execution outputs the hardcoded identifiers, producing duplicate identifier attributes in the DOM.
2. The browser renders two visual field rows, each displaying a label, input, and hint. The developer console displays no errors.
3. The user clicks the label text `Confirm password`.
4. The browser searches the DOM for an element matching the identifier. Following DOM tree order, it selects the first input element and places focus there.
5. The user types their password, sending all text input into the first field while leaving the confirmation field completely empty.

```page caption="The form after the user clicks the words Confirm password and types: the text lands in the Password field."
heading: Create account
form:
  field: Password | •••••••••••••••••• | bad
line: The password should contain at least 18 characters
form:
  field: Confirm password | | bad
line: The password should contain at least 18 characters
console: quiet
```

Inspecting the DOM in browser developer tools reveals duplicate identifiers across both component instances:

```dom caption="The Elements panel: both copies of PasswordField carry the same two ids."
<form>
  <h1>Create account</h1>
  <div>
    <label for="password">Password</label>
!   <input id="password" aria-describedby="password-hint" type="password"> | note: 1st field with the id password
    <p id="password-hint">The password should contain at least 18 characters</p>
  </div>
  <div>
    <label for="password">Confirm password</label>
!   <input id="password" aria-describedby="password-hint" type="password"> | note: 2nd field with the same id
!   <p id="password-hint">The password should contain at least 18 characters</p> | note: 2nd hint with the same id
  </div>
</form>
```

This DOM duplication severely damages accessibility. The browser links both labels to the first input. As a result, the first field possesses two distinct accessible names, while the second field possesses none. When a screen reader user navigates to `Confirm password`, the assistive software announces an unlabelled input.

```tree dir=right caption="With an id written by hand, both labels reach the first field, and the second field has no label."
Two copies of `PasswordField` with `id="password"`
- +1st label [`Password`] | Looks for the first element with **`id="password"`** | Reaches **the 1st field**, as intended
- !2nd label [`Confirm password`] | Looks for the first element with **`id="password"`** | Also reaches **the 1st field**
- !2nd field | **No label** reaches it | A click on its label never brings the cursor here, and a screen reader reads **no name**
```

### Why this bug reaches the users

This defect frequently slips into production because isolated components appear to work during initial development. An engineer tests a single input in isolation and verifies that clicking the label focuses the field. Later, another developer adds a second instance to the form, and the page renders without errors.

React does not validate DOM identifier uniqueness because HTML attributes pass directly to the underlying DOM node without restriction. Because no build warnings or runtime exceptions occur, duplicate identifier bugs remain undetected until reported by end users.

The official MDN documentation highlights this exact dilemma: document identifiers must remain unique, which proves difficult in modern component-driven architectures. MDN specifically recommends framework-provided tools such as React's `useId` Hook as the standard solution.

---

## PRINCIPLE | useId: each copy of the same component gets its own id

> [!PRINCIPLE]
> **Principle 2: useId Gives Each Copy of a Component Its Own id**
>
> *Call `useId()` at the top level of the component, and pass the one string it returns to both `htmlFor` and `id`; every copy of the component gets a different string.*
>
> A component cannot write its id by hand, because it does not know how many copies of it are on the page. React does. `useId` returns a string made from the place where this copy sits on the page. So the label and the field of one copy match, and two copies never clash. The string is not meant to be read, and it changed between React versions, so your code never depends on it.
>
> **DO THIS:**
> ```jsx
> function PasswordField({ label }) {
>   const id = ~useId()~; // One string for this copy
>   return (
>     <div>
>       <label htmlFor={id}>{label}</label>
>       <input type="password" id={id} />
>     </div>
>   );
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> {labels.map((label) => {
>   const id = ~useId()~; // **WRONG:** a Hook inside map breaks the Rules of Hooks
>   return <input key={label} id={id} />;
> })}
> ```

### The smallest component with useId

Here is a minimal component requesting an identifier directly from React:

```jsx title="NameField.jsx"
import { useId } from 'react';

function NameField() {
  const id = ~useId()~; // A new string for each copy of NameField
  return (
    <>
      <label htmlFor={id}>Name</label>
      <input ~id={id}~ /> {/* The label above names this same string */}
    </>
  );
}
```

You import `useId` directly from React, just like other built-in Hooks (Lesson 12). The React documentation describes `useId` as a specialized Hook for generating unique IDs intended for accessibility attributes. Accessibility attributes allow you to declare relationships between related elements, enabling assistive software to announce labels and hints correctly.

Each call to `useId` produces an opaque string tied to that specific component instance in the tree. If you render `<NameField />` multiple times, each instance receives an entirely distinct string.

Compare a hardcoded identifier with an identifier generated by `useId`:

```jsx title="The id written by hand vs. the id from useId"
<label htmlFor="name">Name</label><input ~id="name"~ /> {/* The same string in every copy */}
<label htmlFor={id}>Name</label><input ~id={id}~ /> {/* id holds the string useId returned for this copy */}
```

Within a single component instance, both techniques produce matching attributes on the label and input.

However, once multiple component copies render on the same page, the behaviors diverge fundamentally. The hardcoded string `"name"` repeats on every instance, breaking label associations. In contrast, `useId` produces a unique string for each instance, ensuring every label connects exclusively to its own input.

```tree caption="An id written by hand vs. an id from useId: the same pair inside one copy, a different result on a page with two copies."
Where the id of `NameField` comes from
- +Inside one copy | `htmlFor` and `id` hold **one value** in both versions | The label **reaches its field** in both versions
- !Written by hand, two copies on the page [`"name"`] | The **same string** in every copy | The second label **reaches the first field**
- +From `useId`, two copies on the page [`useId`] | A **different string** for each copy | Each label **reaches its own field**
```

### PasswordField with useId

Now update `PasswordField` to request its identifier from React. We import the `useId` Hook and call it at the top level of the component function, replacing the hardcoded password string with `{id}`:

```jsx title="src/PasswordField.jsx" good="1,4,7,8"
import { useId } from 'react';

export default function PasswordField({ label }) {
  const id = ~useId()~; // 1. One string for this copy of PasswordField
  return (
    <div>
      <label ~htmlFor={id}~>{label}</label> {/* 2. The label names this copy's field */}
      <input type="password" ~id={id}~ aria-describedby="password-hint" /> {/* 3. The field carries the same string */}
      <p id="password-hint">
        The password should contain at least 18 characters
      </p>
    </div>
  );
}
```

The App file requires no modifications. When the App component renders, React executes the first `PasswordField` instance, and `useId` returns an initial string. React then executes the second instance, and `useId` produces a different string. Developer tools reflect these unique values:

```dom caption="The Elements panel: each copy of PasswordField now carries its own id, made by React."
<form>
  <h1>Create account</h1>
  <div>
+   <label for="_r_0_">Password</label> | note: Matches the 1st field
+   <input id="_r_0_" aria-describedby="password-hint" type="password"> | note: 1st copy: one string
    <p id="password-hint">The password should contain at least 18 characters</p>
  </div>
  <div>
+   <label for="_r_1_">Confirm password</label> | note: Matches the 2nd field
+   <input id="_r_1_" aria-describedby="password-hint" type="password"> | note: 2nd copy: another string
!   <p id="password-hint">The password should contain at least 18 characters</p> | note: The hint still shares one id
  </div>
</form>
```

These generated strings are internal implementation details produced by React. They are not intended for display or manual string parsing. In modern React releases, client-only builds format these strings with prefixes such as `_r_`. The internal formatting differs across React versions, so application code should treat them as opaque values.

When the user clicks the `Confirm password` label, the browser now places focus into the second field as expected:

```page caption="The form after the user clicks the words Confirm password and types: the text lands in the Confirm password field."
heading: Create account
form:
  field: Password
line: The password should contain at least 18 characters
form:
  field: Confirm password | •••••••••••••••••• | good
line: The password should contain at least 18 characters
console: quiet
```

Only one duplication remains: both hint paragraphs still share the hardcoded identifier `id="password-hint"`. Principle 3 resolves this remaining conflict.

### Where the string comes from

React derives each identifier from the component's hierarchical position in the component tree, termed its parent path. The parent path represents the branch of components leading from the application root to that specific child. Here, both instances descend from `App`, but one occupies the first child slot and the other occupies the second. Because their positions in the tree differ, React generates distinct strings for each.

Furthermore, this positional identifier remains stable across re-renders. As long as a component instance stays mounted at its position in the tree, subsequent re-renders return the exact same identifier string.

### useId at the top level, never inside map

Suppose a component renders an array of fields dynamically using `.map()`. A developer might attempt to call `useId()` inside the iteration callback:

```jsx title="src/App.jsx" bad="5"
export default function App() {
  return (
    <form>
      {['Password', 'Confirm password'].map((label) => {
        const id = ~useId()~; // **WRONG:** a Hook called inside map breaks the Rules of Hooks
        return (
          <div key={label}>
            <label htmlFor={id}>{label}</label>
            <input type="password" id={id} />
          </div>
        );
      })}
    </form>
  );
}
```

Because `useId` is a React Hook, it must follow the Rules of Hooks (Lesson 38). Call Hooks only at the top level of a component function, never inside loops, conditions, or nested functions. React relies on a stable, predictable call order across renders to associate internal Hook state with component fibers. Calling Hooks inside dynamic loops violates this contract.

The standard architectural remedy is extracting each item into a dedicated component. Each `PasswordField` instance calls `useId` once at its own top level, while the array map loop simply instantiates the components:

```jsx title="src/App.jsx" good="4"
export default function App() {
  return (
    <form>
      {['Password', 'Confirm password'].map((label) => ~<PasswordField key={label} label={label} />~)} {/* Each copy calls useId once for itself */}
    </form>
  );
}
```

---

## PRINCIPLE | `id + '-hint'`: one useId call names the input field and its hint

> [!PRINCIPLE]
> **Principle 3: One useId Call Names the Field and Its Hint**
>
> *When one component needs several related ids, call `useId` once and add a different ending to its string for each element, such as `id + '-input'` and `id + '-hint'`.*
>
> A `useId` string is already unique to this copy of the component, so any ending added to it stays unique to this copy. Every id of the component comes from that one string: the field, the hint, and any other element that a label or an `aria-` attribute points at. An id left behind, written by hand, still repeats in every copy.
>
> **DO THIS:**
> ```jsx
> const id = useId();
> <input id={id + '-input'} ~aria-describedby={id + '-hint'}~ /> {/* Points at this copy's hint */}
> <p id={id + '-hint'}>The password should contain at least 18 characters</p>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const id = useId();
> <input id={id} ~aria-describedby="password-hint"~ /> {/* **WRONG:** every copy points at the first hint */}
> <p id="password-hint">The password should contain at least 18 characters</p>
> ```

### One call, several ids

Many components render multiple related elements that each need unique identifiers. The official React documentation presents a form containing first and last name fields. Rather than calling `useId` repeatedly, the component calls it once and appends a distinct suffix for each element:

```jsx title="One useId call, two ids"
function Form() {
  const id = ~useId()~; // One string for this copy of Form
  return (
    <form>
      <label htmlFor={id + '-firstName'}>First Name:</label>
      <input ~id={id + '-firstName'}~ type="text" /> {/* The string, plus -firstName */}
      <label htmlFor={id + '-lastName'}>Last Name:</label>
      <input ~id={id + '-lastName'}~ type="text" /> {/* The same string, plus -lastName */}
    </form>
  );
}
```

Standard string concatenation combines the unique base string with custom suffixes. React supplies the unique prefix, while your code provides meaningful suffixes such as `-firstName` or `-lastName`. The React documentation refers to this pattern as a shared prefix.

Compare calling `useId` once with calling it separately for every DOM element:

```jsx title="Two useId calls vs. one useId call with two endings"
const inputId = ~useId()~; // 1st call: the id of the field
const hintId = ~useId()~; // 2nd call: the id of the hint
const id = ~useId()~; // One call instead: id + '-input' for the field, id + '-hint' for the hint
```

From the perspective of document accessibility, both implementations achieve identical results. Both approaches provide unique identifiers for the input and hint within an instance, while preventing collisions with other instances. Because the base string is already guaranteed unique to the component copy, any suffix appended to it remains globally unique. Using a shared prefix avoids unnecessary Hook invocations while keeping element relationships clear.

### The final PasswordField

In Principle 2, the password input received a dynamic identifier, while the hint retained a hardcoded string. We now derive both element identifiers from the single `useId` base string:

```jsx title="src/PasswordField.jsx" good="7,8,9"
import { useId } from 'react';

export default function PasswordField({ label }) {
  const id = ~useId()~; // One string for this copy of PasswordField
  return (
    <div>
      <label htmlFor={id + '-input'}>{label}</label>
      <input type="password" ~id={id + '-input'}~ ~aria-describedby={id + '-hint'}~ /> {/* The field, and the hint it points at */}
      <p ~id={id + '-hint'}~> {/* The hint, with an id of this copy only */}
        The password should contain at least 18 characters
      </p>
    </div>
  );
}
```

This represents the final implementation of `PasswordField`. The visual appearance of the form remains unchanged because the rendered hint text is identical. The improvement is evident in the DOM structure and screen reader output:

```dom caption="The Elements panel: each copy builds its two ids from one useId string."
<form>
  <h1>Create account</h1>
  <div>
+   <label for="_r_0_-input">Password</label>
+   <input id="_r_0_-input" aria-describedby="_r_0_-hint" type="password"> | note: 1st copy: one start, two endings
+   <p id="_r_0_-hint">The password should contain at least 18 characters</p>
  </div>
  <div>
+   <label for="_r_1_-input">Confirm password</label>
+   <input id="_r_1_-input" aria-describedby="_r_1_-hint" type="password"> | note: 2nd copy: another start
+   <p id="_r_1_-hint">The password should contain at least 18 characters</p>
  </div>
</form>
```

Within each instance, both element pairs match cleanly. The label references its own field through `id + '-input'`, while the field references its own hint through `aria-describedby`. Between instances, every generated identifier is unique. When focus reaches the confirmation input, a screen reader announces `Confirm password` followed by that instance's own hint.

```tree caption="How one useId string becomes every id of one copy of PasswordField."
One `useId` string in each copy of `PasswordField` [`const id = useId`]
- +The field and its label [`id + '-input'`] | The label's `htmlFor` and the field's `id` | The label **reaches its own field**
- +The hint [`id + '-hint'`] | The field's `aria-describedby` and the hint's `id` | A screen reader reads **this copy's hint**
```

### The hint that was left behind

Partial migrations introduce subtle defects that easily escape code review. An engineer might update the primary input to use `useId` while leaving secondary helper text hardcoded. Because clicking the label focuses the correct input, the component appears fixed.

However, if both hint elements retain `id="password-hint"`, every input's `aria-describedby` resolves to the first hint in document order. While both hints share identical copy, users notice no defect. But if a designer later modifies the confirmation hint or adds dynamic validation messages, screen readers on subsequent fields will read the initial hint instead. Generating all related identifiers from one shared prefix prevents this bug entirely.

---

## PRINCIPLE | Math.random: the server and the browser pick two different ids

> [!PRINCIPLE]
> **Principle 4: Math.random Gives the Server and the Browser Two ids**
>
> *With server rendering, the id in the server's HTML must equal the id React makes in the browser; `Math.random()` and a counter cannot promise that, and `useId` can, as long as both render the same tree.*
>
> With server rendering, every component runs twice: once on the server, and once again in the browser during hydration. `Math.random()` gives a new number each time, and a counter depends on the order in which the copies run. So the browser's ids differ from the server's, and React reports a hydration mismatch. `useId` builds its string from the parent path of the component, which is the same on both sides.
>
> **DO THIS:**
> ```jsx
> function PasswordField({ label }) {
>   const id = ~useId()~; // The same string on the server and in the browser
>   return <label htmlFor={id + '-input'}>{label}</label>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function PasswordField({ label }) {
>   const id = ~'field-' + Math.random()~; // **WRONG:** the server and the browser pick two different numbers
>   return <label htmlFor={id + '-input'}>{label}</label>;
> }
> ```

### A random id vs. an id from useId

Developers attempting to avoid duplicate identifiers often reach for `Math.random()`. Compare this approach with `useId`:

```jsx title="An id from Math.random vs. an id from useId"
const id = ~'field-' + Math.random()~; // A new number every time the component runs
const id = ~useId()~; // The same string every time this copy runs at the same place
```

In a purely client-rendered single-page app, both approaches generate distinct strings per instance, and label clicks work as expected. However, the strategies diverge as soon as server rendering is introduced. With server rendering, the component executes twice: first on the server to generate HTML, and second in the browser during hydration.
- **With `Math.random()`**, the server selects one random value, while the client selects a completely different random value. The identifiers on the server and client no longer match.
- **With `useId()`**, React derives the identifier deterministically from tree position rather than random numbers. Because both environments render matching trees, both produce the identical identifier string.

Executing `Math.random()` during rendering also violates component purity (Lesson 14). Pure components must produce identical output when provided identical inputs. React's purity guidelines specifically flag `Math.random()` during render as a direct cause of hydration mismatches.

### The same form, rendered on a server

Modern web frameworks often render initial markup on the server. The browser displays that static HTML immediately, and React then connects event handlers to the existing DOM nodes (Lesson 46).

> [!DEFINITION]
> **Hydration.** [REVIEW] Pre-rendered server HTML contains static markup without active JavaScript event listeners. When the client bundle downloads, React executes the component tree in the browser and attaches event handlers to the existing HTML markup without re-creating DOM nodes. This initialization step is called hydration (Lesson 46).

To observe hydration mechanics clearly, we can simulate the server output locally, matching the structure used in official React examples:
1. **`index.html` stores the pre-rendered HTML.** We write the form markup inside `<div id="root">` exactly as a server would emit it.
2. **`main.jsx` invokes `hydrateRoot` rather than `createRoot`.** `hydrateRoot` instructs React to attach itself to pre-existing DOM elements rather than rendering from scratch.

In standard framework applications, the framework runtime handles this hydration call automatically.

```files title="signup-form: File Explorer" caption="The sign-up form as a server-rendered app: index.html already holds the form."
index.html | server HTML | Holds the form as the server rendered it, inside `<div id="root">`
src/
  main.jsx | boundary | Calls `hydrateRoot` on `#root` with `<App />`
  App.jsx | page | Unchanged: the title and two `PasswordField` tags
  PasswordField.jsx | field | The id comes from `Math.random`, then from `useId`
```

```jsx title="src/main.jsx"
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

~hydrateRoot~(document.getElementById('root'), <App />); // Attaches React to the HTML already inside #root
```

Here is the password field component implemented with `Math.random()` instead of `useId()`:

```jsx title="src/PasswordField.jsx" bad="2"
export default function PasswordField({ label }) {
  const id = ~'field-' + Math.random()~; // **WRONG:** a new number on the server, another in the browser
  return (
    <div>
      <label htmlFor={id + '-input'}>{label}</label>
      <input type="password" id={id + '-input'} aria-describedby={id + '-hint'} />
      <p id={id + '-hint'}>
        The password should contain at least 18 characters
      </p>
    </div>
  );
}
```

The server rendered this component for each instance and embedded the resulting numbers directly into the HTML document. Servers typically emit this markup without whitespace between tags, so we format the markup on a single line. Unintended line breaks inside `#root` introduce extra text nodes that would trigger separate hydration warnings. Here is the relevant snippet from `index.html`:

```html title="index.html"
<div id="root"><form><h1>Create account</h1><div><label for="field-0.7194028361928475-input">Password</label><input type="password" id="field-0.7194028361928475-input" aria-describedby="field-0.7194028361928475-hint"><p id="field-0.7194028361928475-hint">The password should contain at least 18 characters</p></div><div><label for="field-0.2381946507712039-input">Confirm password</label><input type="password" id="field-0.2381946507712039-input" aria-describedby="field-0.2381946507712039-hint"><p id="field-0.2381946507712039-hint">The password should contain at least 18 characters</p></div></form></div>
```

### What happens on every page load

**The identical component that functioned in the browser now produces conflicting identifiers between server and client, prompting React to report a hydration mismatch.** Here is the execution sequence during page load:
1. The server renders each `PasswordField` instance. Each call to `Math.random()` evaluates to a specific number, which the server writes into the static HTML markup.
2. The browser downloads and displays that HTML markup. Form labels correctly reference their inputs, and the visual page appears instantly.
3. The JavaScript bundle arrives. To attach event listeners, React runs `PasswordField` again during client hydration, and `Math.random()` generates new random numbers.
4. React compares its newly rendered virtual DOM attributes against the attributes in the existing DOM. The identifier attributes do not match.
5. In development mode, React reports a hydration error in the console.

A hydration mismatch is React's designation for discrepancies between server-rendered markup and the initial client render. The error message specifically identifies `Math.random()` as a common culprit:

```devconsole width=full caption="The Console in development: the first line of React's hydration message, the line that names Math.random, and the link at its end."
x A tree hydrated but some attributes of the server rendered HTML didn't match the client properties. This won't be patched up. This can happen if a SSR-ed Client Component used:
  - Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
  https://react.dev/link/hydration-mismatch
```

The error message references two standard terms: SSR stands for server-side rendering (Lesson 46), and a Client Component refers to a component evaluated in the client runtime environment.

The official documentation emphasizes that hydration mismatches should always be treated as real bugs rather than harmless warnings. React does not patch up attribute discrepancies during hydration. Consequently, the DOM node may retain the server's attribute while React's internal fiber tree expects the client's value. In extreme scenarios, this discrepancy can cause event listeners to attach to incorrect elements.

Why must React re-execute components during client hydration? Because hydration attaches reactive event handlers to DOM elements. For hydration to align event listeners accurately, client rendering output must match server HTML perfectly.

```tree dir=right caption="With Math.random, the server and the browser each run PasswordField and pick a different number."
One page load of the server-rendered sign-up form
- +1. On the server [`Math.random`] | `PasswordField` runs and picks **one number** for each copy | The HTML holds **`field-0.7194...`**
- +2. In the browser, before the JavaScript | The user sees **the server's HTML** | Each label points at **its own field**
- !3. In the browser, during hydration [`Math.random`] | `PasswordField` runs **again** and picks **new numbers** | The ids **differ** from the HTML on the page
- !4. In the Console | React reports **a hydration mismatch** | The attributes are **not patched up**
```

### A counter is no fix either

When confronted with hydration errors, developers often attempt to use a module-scoped counter variable that increments on every call:

```jsx title="src/PasswordField.jsx" bad="4"
let nextId = 0;

export default function PasswordField({ label }) {
  const id = 'field-' + ~nextId++~; // **WRONG:** depends on the order in which the copies run
  return <label htmlFor={id}>{label}</label>;
}
```

A global counter assigns numbers strictly in the order components execute. This strategy succeeds only if the client hydrates components in the exact sequence the server rendered them. The React documentation notes that hydration order does not always mirror server emission order, especially with asynchronous boundaries or streaming SSR.

In contrast, `useId` does not depend on execution order because React calculates the identifier from component tree ancestry. If the server and client trees have matching structures, the calculated parent path remains identical regardless of rendering order.

### The same form with useId

Restoring `useId()` inside `PasswordField` resolves the hydration mismatch. Because the server and client construct identical component trees, each copy receives matching strings on both sides. The server HTML and initial client render align seamlessly, and the console remains quiet.

::: row caption="The server-rendered sign-up form with an id from Math.random vs. with an id from useId."
::: col title="With Math.random" tag="two different ids" tone=bad
```devconsole
x A tree hydrated but some attributes of the server rendered HTML didn't match the client properties.
```
```jsx title="PasswordField.jsx" bad="1"
const id = 'field-' + ~Math.random()~; // **WRONG:** two numbers for one copy
```
The server and the browser pick two numbers.
:::
::: col title="With useId" tag="one id on both sides" tone=good
```devconsole
= No messages
```
```jsx title="PasswordField.jsx" good="1"
const id = ~useId()~; // One string on both sides
```
The server and the browser make the same string.
:::
:::

One prerequisite applies: `useId` requires identical component trees across server and client rendering. If a component tree branches conditionally based on environment checks such as `typeof window !== 'undefined'`, the server and client construct different trees. In that scenario, tree paths diverge and `useId` will generate mismatched identifiers.

---

## All 4 Principles Together

### The complete sign-up form

Here is the complete implementation of the sign-up form. The `App` component renders two `PasswordField` instances. Each instance invokes `useId` at its top level, constructing both its input identifier and hint identifier from that single base string:

```jsx title="src/App.jsx"
import PasswordField from './PasswordField.jsx';

export default function App() {
  return (
    <form>
      <h1>Create account</h1>
      ~<PasswordField label="Password" />~ {/* 1st copy: one useId string */}
      ~<PasswordField label="Confirm password" />~ {/* 2nd copy: another useId string */}
    </form>
  );
}
```

```jsx title="src/PasswordField.jsx"
import { useId } from 'react';

export default function PasswordField({ label }) {
  const id = ~useId()~; // Principles 2 and 4: one string per copy, the same on the server and in the browser
  return (
    <div>
      <label htmlFor={id + '-input'}>{label}</label>
      <input type="password" id={id + '-input'} ~aria-describedby={id + '-hint'}~ /> {/* Principle 3: one start, two endings */}
      <p id={id + '-hint'}>
        The password should contain at least 18 characters
      </p>
    </div>
  );
}
```

### How React calls the components, in order

During rendering, React executes `App` first. It then calls `PasswordField` for each declared tag from top to bottom. In each instance, `useId` yields the unique string corresponding to that component's position:

```tree caption="The order in which React calls the components of the sign-up form, and the useId string of each copy."
`App` [1. Called first] | Returns the form with **two `PasswordField` tags**
- +1st `PasswordField` [2. `label="Password"`] | `useId` returns **the string of the 1st copy** | The label, the field, and the hint use **that string plus an ending**
- +2nd `PasswordField` [3. `label="Confirm password"`] | `useId` returns **another string** | Its label, field, and hint **never clash** with the 1st copy
```

| Way to fill the id | One copy on the page | Two copies on the page | Server rendering |
| :--- | :--- | :--- | :--- |
| **Written by hand**, `'password'` | Works | Both fields share one id, so the second label reaches the first field | The same string on both sides, but still a duplicate |
| **`Math.random()`** | Works | Each copy gets its own id | The server and the browser pick two numbers, so React reports a hydration mismatch |
| **A counter**, `nextId++` | Works | Each copy gets its own id | Depends on the order of hydration, which may differ from the server's |
| **`useId()`** | Works | Each copy gets its own id | The same string on both sides, when both render the same tree |

Remember the central lesson of this chapter. **A component never invents its own element identifiers: it requests them from `useId`, because only React knows where each component instance lives in the tree.**

---

## For the Interview

> **The Interview Question:** How do you generate IDs that are unique, stable, and safe across server and client?

### How to Answer Clearly in 30 Seconds

"HTML element identifiers must be unique across the document, and a label connects exclusively to the first matching element in DOM order. When a component renders multiple times, hardcoded IDs duplicate, causing secondary labels to focus the first input. To prevent this, I call `useId()` at the top level of the component and pass the returned string to `htmlFor` and `id`. If a component requires multiple IDs, such as an input and an `aria-describedby` hint, I derive them from a single `useId` call using suffixes like `id + '-hint'`. I avoid `Math.random()` and global counters because they produce mismatched IDs between server-rendered HTML and client hydration. React generates `useId` strings from the component tree parent path, guaranteeing identical values on both server and client without risk of collisions."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Can you use `useId` to make the keys of a list?"**
   **No.** The React documentation explicitly states that `useId` should not be used to generate list keys. Keys must be generated from your data. A key identifies an item of data across renders, such as an entity ID from a database (Lesson 18). An identifier from `useId` represents a physical slot in the component tree, not a specific data record. Additionally, `useId` is a Hook, meaning calling it inside a `.map()` callback violates the Rules of Hooks.
2. **"Why is `useId` better than a counter such as `nextId++`?"**
   A global counter produces numbers sequentially based on component render order. In server-side rendering, client components may hydrate in a different sequence than server HTML was emitted, particularly with streaming SSR and concurrent features. Consequently, the same component instance could receive mismatched numbers between server and client. React computes `useId` from the component's hierarchical parent path, ensuring identical identifiers across environments regardless of render sequence or timing.
3. **"Two separate React apps run on the same page. Can their ids clash?"**
   **Yes.** When two independent React roots mount on a single webpage, their default `useId` sequences can collide. To prevent collisions, pass an `identifierPrefix` option to `createRoot` for each root, such as `'app-a'` and `'app-b'`. React will prepend this unique prefix to every generated ID. For server-rendered applications, pass the identical prefix to both server streaming functions and `hydrateRoot`.

```tree dir=right caption="Interview summary: what useId guarantees, and what it is not for."
What `useId` guarantees
- +Unique on the page | A **different string for each copy** of the component | Each label reaches **its own field**
- +The same on the server and in the browser | Built from the **parent path**, not from chance | **No hydration mismatch**, as long as both render **the same tree**
- !Not for list keys | A key comes **from the data** | `useId` belongs to **a place on the page**, not to an item
```
