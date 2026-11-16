# Lecture 85: How a Search Field Receives ref as an Ordinary Prop

*(How does a parent reach an `<input>` that lives inside a child component?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | How does React 19 treat ref as an ordinary prop, and how does it replace forwardRef?

---

## VS | `forwardRef` vs. `ref` as a Prop: the parent writes the same tag, only the place where the child finds `ref` changes

> You already know how a parent hands a value such as `placeholder` to a child component: it writes it on the tag, and the child reads it from its props. **In React 19, a ref travels exactly the same way: the child reads it from its props and puts it on its own `<input>`.** Before React 19, React stripped `ref` before passing props to a function component, so the child had to be wrapped in `forwardRef` to receive it as a separate second argument. Today, that wrapper is no longer needed because React passes `ref` straight into the props object.

In plain JavaScript, you locate a rendered DOM element with `document.getElementById` and call DOM methods directly on it:

```js title="page.js"
~document.getElementById('search')~.focus(); // You grab the input, then put the cursor in it
```

In React, you do not query or create real DOM elements directly. Instead, you declare JSX, and React creates the corresponding browser DOM nodes during the commit phase. A ref provides an escape hatch to access a real DOM element once React mounts it. When you attach `ref={inputRef}` to a built-in `<input />` tag, React assigns that real browser DOM element to `inputRef.current` during the commit phase. From then on, you can call standard browser DOM methods like `focus()`, exactly as you would in plain JavaScript (Lesson 31):

```jsx title="App.jsx"
const inputRef = useRef(null);

<input ~ref={inputRef}~ /> {/* React puts this input element into inputRef.current */}

inputRef.current.focus(); // Later, in a click handler: the same focus as in plain JavaScript
```

This direct attachment works when the `<input>` tag is rendered directly in the parent component's own JSX. In production applications, however, form inputs usually live inside reusable child components, such as a custom `SearchInput` shared across the application. When the parent renders `<SearchInput ref={inputRef} />`, a fundamental question arises: `SearchInput` is a custom JavaScript function, not a built-in browser DOM tag. Which internal element should React assign to `inputRef.current`? React cannot make that choice automatically. Instead, React passes the ref object to `SearchInput`, and `SearchInput` decides which internal element receives it.

**Why this matters:** If the child component does not forward the ref to its inner `<input>`, `inputRef.current` in the parent remains `null`. When the user clicks `Search`, calling `inputRef.current.focus()` throws a `TypeError` because `inputRef.current` is `null`. The cursor never enters the field, and the user cannot type. This lesson explains how a child component receives a ref in React 19 and forwards it to the underlying DOM node.

> [!DEFINITION]
> **A ref on a built-in tag.** [REVIEW] A ref is a persistent container object with a single mutable property, `current`, that React preserves across re-renders for a component instance.
> 1. A parent component instantiates the ref: `const inputRef = useRef(null)`. On the initial render, `inputRef.current` is initialized to `null`.
> 2. You attach the ref to a built-in tag: `<input ref={inputRef} />`.
> 3. During the commit phase, after inserting the real DOM node into the document, React assigns that DOM element directly to `inputRef.current`.
>
> A ref stores data across renders without causing re-renders when mutated. React populates `ref.current` with a browser DOM node only on built-in HTML tags like `<input>` or `<button>`. When placed on a custom function component, React does not attach a DOM node automatically, because a custom component is a JavaScript function and not a DOM element (Lesson 31).

> [!DEFINITION]
> **Props.** [REVIEW] Props are the inputs passed from a parent component down to a child component.
> 1. A parent specifies attributes on a JSX tag: `<SearchInput placeholder="Looking for something?" />`.
> 2. React collects all attributes into a single JavaScript object called `props`.
> 3. React invokes the child function component with that `props` object as its first argument: `function SearchInput({ placeholder })`.
>
> In React, data flows strictly downward from parent to child through props. A **function component** is a component defined as a standard JavaScript function that receives props and returns JSX (Lesson 08).

### The same parent tag, two shapes of the child

The parent always writes the same tag:

```jsx title="The parent's tag, the same for both shapes of MyInput"
const inputRef = useRef(null);

<MyInput ~ref={inputRef}~ placeholder="Looking for something?" /> {/* After the commit, inputRef.current holds the input element */}
```

At work, you will meet the child in two shapes. In code written before React 19, the child is wrapped in a function from React called `forwardRef`. React calls the child with two separate arguments, `props` and `ref`:

```jsx title="With forwardRef: ref arrives as a second argument, after props"
const MyInput = ~forwardRef~(function MyInput(props, ~ref~) { // ref sits next to props, not inside it
  return <input placeholder={props.placeholder} ref={ref} />;
});
```

In React 19, the child is a plain function again. `ref` arrives inside the props object, next to `placeholder`:

```jsx title="With ref as a prop: ref arrives inside props, next to placeholder"
function MyInput(~{ placeholder, ref }~) { // ref is unpacked exactly like placeholder
  return <input placeholder={placeholder} ref={ref} />;
}
```

From the perspective of the parent component and the rendered page, the interface is identical. The parent declares the ref and writes `<MyInput ref={inputRef} />`. The child component forwards the ref by placing `ref={ref}` on the underlying `<input>`. Once the commit phase completes, `inputRef.current` holds the exact same browser DOM element in both cases. The only difference is architectural: in React 19, `ref` is delivered directly within the `props` object rather than through a separate wrapper function.

```tree caption="The parent's tag stays the same; only the place where the child finds ref changes."
Where `MyInput` finds the ref from `<MyInput ref={inputRef} />`
- +With `forwardRef` [`props, ref`] | React hands `ref` as a **second argument**, outside `props` | Code written for **React 18 and earlier**
- +With `ref` as a prop [`{ placeholder, ref }`] | React puts `ref` **inside `props`**, next to `placeholder` | The way to write **every new component in React 19**
```

React's announcement of React 19 summarizes this upgrade in one sentence: "Starting in React 19, you can now access `ref` as a prop for function components."

### The Rule of Thumb: `ref` is a prop, so pass it on like one

**In React 19, treat `ref` on your custom component exactly like any other prop: destructure it from props, and pass it forward until it is attached to a built-in DOM element.**

Developers usually run into two common pitfalls:
1. **They still reach for `forwardRef` in a new component.** The official React documentation notes: "New function components will no longer need `forwardRef`". While `forwardRef` remains backward-compatible for existing code, modern code should omit it entirely (Lesson 99 covers legacy migration in detail).
2. **They think `ref` is still kept out of `props`, the way `key` is (Lesson 18).** React's upgrade guide confirms: "ref is now a regular prop". Only `key` stays out.

A related Hook, `useImperativeHandle`, lets a child component expose a customized object with specific methods instead of the raw DOM element (Lesson 50). Most form interactions only require direct DOM access, so this lesson focuses on standard DOM forwarding.

---

## SECTION | A Store Header with a Search Button

The example project represents the header of an online store: a `Search` navigation button, followed by a search input showing the placeholder text `Looking for something?`.

```page width=text caption="The store header when the page opens: the Search button and an empty search field."
line: [Search]
card: input=Looking for something?
console: quiet
```

When the user clicks the `Search` button, the application immediately shifts keyboard focus to the search field, allowing the customer to begin typing `shoes` without having to manually click the input field first:

```page width=text caption="The same header after the user clicks Search and types shoes right away."
line: [Search]
card: typed=shoes | good=typed
console: quiet
```

The search field is encapsulated in its own component, `SearchInput`, because that same field is reused across multiple views of the store. The `Search` button lives in the parent component, `App`. The user interaction happens in `App`, but the target `<input>` element lives inside `SearchInput`.

```files title="store-header: File Explorer" caption="The project files of the store header at the start of the lesson."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `<App />` inside `<StrictMode>` into `#root`
  App.jsx | parent | Creates `inputRef` and renders the Search button and `<SearchInput />`
  SearchInput.jsx | default export | Exports `SearchInput`, the search field
```

Here is `App.jsx`. It remains unchanged throughout this lesson, except for a brief diagnostic demonstration in Principle 5:

```jsx title="src/App.jsx"
import { useRef } from 'react';
import SearchInput from './SearchInput.jsx';

export default function App() {
  const inputRef = useRef(null);

  function handleSearchClick() {
    ~inputRef.current.focus();~ // Puts the cursor in the element that inputRef holds
  }

  return (
    <header>
      <nav>
        <button onClick={handleSearchClick}>Search</button>
      </nav>
      <SearchInput ~ref={inputRef}~ placeholder="Looking for something?" /> {/* The ref goes to our own component */}
    </header>
  );
}
```

**PRINCIPLES:** Each principle traces how this ref travels from `App` down to the final browser `<input>` element:
1. **`ref` arrives in props, next to `placeholder`.** `SearchInput` destructures `{ placeholder, ref }` and attaches `ref` directly to its `<input>`.
2. **`forwardRef` is the old way.** It passes `ref` as a second argument. It still works, but a new component does not need it.
3. **Every intermediate component must forward `ref`.** When the `<input>` sits nested several components deep, the ref travels only as far as each component explicitly forwards it.
4. **`{...props}` automatically forwards `ref`.** Spreading `props` passes the ref without an explicit `ref=` attribute. Using `{ ref, ...otherProps }` separates the ref, requiring an explicit `ref={ref}` on the element.
5. **The JSX element stores the ref in `element.props.ref`.** Accessing the legacy property `element.ref` logs a deprecation error in the console.

---

## PRINCIPLE | `{ placeholder, ref }`: the child receives the ref like any other prop

> [!PRINCIPLE]
> **Principle 1: ref as a Prop: A Function Component Reads ref from Its Props**
>
> *In React 19, a `ref` written on our own function component arrives in its props next to every other prop; the component unpacks it and passes it on to a built-in tag.*
>
> React fills a ref with an element only on a built-in tag such as `<input>`. On `<SearchInput ref={inputRef} />`, React has no element to give, so it hands the ref to `SearchInput` in its props, the same way it hands over `placeholder`. When `SearchInput` puts that ref on its `<input>`, the click on `Search` finds the field. When `SearchInput` ignores the ref, `inputRef.current` stays `null`.
>
> **DO THIS:**
> ```jsx
> function SearchInput({ placeholder, ref }) {
>   return <input placeholder={placeholder} ~ref={ref}~ />; // React puts the input into App's inputRef
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function SearchInput({ placeholder }) {
>   return <input ~placeholder={placeholder}~ />; // **WRONG:** the ref is never passed on, so inputRef.current stays null
> }
> ```

Look at the two attributes `App` writes on the tag, and at how `SearchInput` receives them:

```jsx title="ref and placeholder on the same tag, and in the same parameter list"
<SearchInput ~ref={inputRef}~ ~placeholder="Looking for something?"~ /> {/* Two attributes on our own component */}

function SearchInput(~{ placeholder, ref }~) { // Both arrive in the same props object
  return <input placeholder={placeholder} ref={ref} />;
}
```

Both `ref` and `placeholder` travel the exact same road:
1. `App` writes both attributes on the `SearchInput` tag.
2. React bundles both attributes into a single props object and invokes `SearchInput` with it.
3. `SearchInput` destructures both props directly in its parameter list.
4. `SearchInput` passes both props to its internal `<input>` tag.

On the way into `SearchInput`, `ref` behaves as a prop like any other. React's documentation explains that a component receives `ref` "just like any other prop". React's release notes call this feature **`ref` as a prop**.

The single difference between the two props appears only at the end of the line, when they are applied to the built-in `<input>` tag:
- **`placeholder`** instructs the browser to show the grey text `Looking for something?` inside the empty field.
- **`ref`** instructs React to assign the created browser DOM node to `inputRef.current` during the commit phase, as a ref on a built-in tag always does.

```tree dir=right caption="The steps that ref and placeholder share from the parent's tag to the input, and the one thing that differs at the end."
How `ref` and `placeholder` reach the `<input>`
- +1. `App` writes both on the tag [`<SearchInput ref={inputRef} />`] | `ref` and `placeholder` are **two attributes** on one tag
- +2. React builds one props object [`{ placeholder, ref }`] | `SearchInput` **unpacks both** in its parameter list
- +3. `SearchInput` passes both on [`<input ref={ref} />`] | `placeholder` shows the **grey text** | `ref` gets **the input element** in the commit
```

### The store header, step 1: SearchInput unpacks ref

Here is our real `SearchInput.jsx`, the same smallest code in its own file:

```jsx title="src/SearchInput.jsx"
export default function SearchInput(~{ placeholder, ref }~) { // ref arrives from App's tag, next to placeholder
  return <input placeholder={placeholder} ~ref={ref}~ />; // React puts this input element into App's inputRef
}
```

The `ref` parameter inside `SearchInput` and the `inputRef` variable inside `App` reference the exact same container object in memory. `SearchInput` does not receive a copy; it receives the identical object reference instantiated by `useRef(null)`. Consequently, when React populates `ref.current` during the commit phase, it mutates that shared ref container. `inputRef.current` in `App` immediately holds the rendered `<input>` DOM element. When the user clicks `Search`, `inputRef.current.focus()` executes without error, and the cursor appears in the field:

```page width=text caption="After the user clicks Search and types shoes: the cursor reached the input inside SearchInput."
line: [Search]
card: typed=shoes | good=typed
console: quiet
```

Open the Elements panel. The `<input>` shows its placeholder attribute, but no `ref` attribute. React uses `ref` internally as a DOM instruction and never renders it into the HTML:

```dom caption="What the Elements panel shows for the store header: the input carries its placeholder and no ref attribute."
<header>
  <nav>
    <button>Search</button>
  </nav>
  + <input placeholder="Looking for something?"> | note: Rendered by SearchInput; ref is not an HTML attribute
</header>
```

### The real mistake: unpacking only placeholder

Take the same file and forget one word: the child unpacks only `{ placeholder }`. No built-in tag carries the ref, so React never attaches the DOM node. The parent's ref keeps holding `null`, and the click handler calls `focus` on `null`:

```page width=text caption="When SearchInput ignores ref, the user clicks Search and the cursor stays out of the field."
line: [Search]
card: input=Looking for something? | bad=input
console: Uncaught TypeError: Cannot read properties of null (reading 'focus')
```

React's documentation gives the fix in plain words: "add `ref` to the list of props your component accepts and pass `ref` as a prop to the relevant child built-in component". That is exactly what our `SearchInput.jsx` above implements.

### What interviewers add

1. **The parent's code never changed.** `<MyInput ref={inputRef} />` was written the same way before React 19. Only the child's side changed.
2. **A ref reaches only the component its tag names.** It does not travel further by itself. Each component decides whether to pass it on, as Principle 3 shows.

---

## PRINCIPLE | `forwardRef`: the old wrapper still works, but a new component does not need it

> [!PRINCIPLE]
> **Principle 2: forwardRef: The Older Way Hands ref In as a Second Argument**
>
> *Before React 19, a function component received a ref only when wrapped in `forwardRef`, whose render function gets `props` and `ref` as two arguments; in React 19, write the component without `forwardRef` and unpack `ref` from its props.*
>
> `forwardRef` still works in React 19, and the parent's tag is the same for both shapes. React's docs now list it as a legacy API that "will be deprecated in a future release". When you meet it in older code, remove the wrapper, add `ref` to the unpacked props, and keep `ref={ref}` on the tag.
>
> **DO THIS:**
> ```jsx
> function SearchInput(~{ placeholder, ref }~) { // React 19: ref arrives as a prop
>   return <input placeholder={placeholder} ref={ref} />;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const SearchInput = ~forwardRef~(function SearchInput(props, ref) { // **WRONG:** a new component wrapped in a legacy API it no longer needs
>   return <input placeholder={props.placeholder} ref={ref} />;
> });
> ```

Open a code base written for React 18, and you will find our `SearchInput.jsx` in this shape:

```jsx title="src/SearchInput.jsx, written for React 18"
import { forwardRef } from 'react';

const SearchInput = ~forwardRef~(function SearchInput(props, ~ref~) { // React calls this function with props and ref
  return <input placeholder={props.placeholder} ref={ref} />;
});

export default SearchInput;
```

Read it from the outside in:
1. `forwardRef` is a higher-order function from React. You hand it a function, and it gives back a new wrapped component.
2. React's docs call the function you hand it the **render function**: "React calls this function with the props and `ref` that your component received from its parent."
3. Under this older API, `props` holds `placeholder` only, and `ref` comes second, as its own separate argument.

The name `SearchInput` appears twice. The first one, after `const`, is the component that `App` imports. The second one, after `function`, is our own name for the render function. Giving the render function a name helps React DevTools display a recognizable component name during debugging.

React's docs say `forwardRef` "lets your component expose a DOM node to the parent component with a ref". Why did we ever need it? Because before React 19, `ref` was not a prop. A ref written on a plain function component was dropped by React and never reached the component. React's docs say a component returned by `forwardRef` "is also able to receive a `ref` prop", unlike "React components defined as plain functions". In React 19, every function component receives `ref` directly inside its props object, so the wrapper has nothing left to do.

### VS | `forwardRef` vs. `ref` as a prop: the same outside, different inside

For `App` and for the rendered page, it is the exact same thing. `App.jsx` does not change by a single letter, and clicking `Search` puts the cursor in the same field.

Inside `SearchInput`, however, the function signature is different:
- **With `forwardRef`**, React calls the render function with two arguments. `props` holds `placeholder` only, and `ref` comes second.
- **With `ref` as a prop**, React calls `SearchInput` with one props object, and `ref` sits inside it, next to `placeholder`.

```tree caption="The two shapes of SearchInput: App and the page stay the same, and only the place of ref inside the child changes."
Two shapes of the same `SearchInput`
- +With `forwardRef` [`forwardRef`] | React calls the render function with **two arguments** | `props` holds `placeholder`; `ref` is the **second argument**
- +With `ref` as a prop [`{ placeholder, ref }`] | React calls `SearchInput` with **one props object** | `ref` sits **inside `props`**, next to `placeholder`
```

### forwardRef still works, and it is on its way out

The older file still works in React 19. Nothing breaks when you upgrade. But React's docs state: "In React 19, `forwardRef` is no longer necessary. Pass `ref` as a prop instead. `forwardRef` will be deprecated in a future release."

Two words tell you where `forwardRef` stands today:
- **Deprecated** means the API still works today, but React has announced that it will be removed in a future major version. React's release notes state: "In future versions we will deprecate and remove `forwardRef`."
- **Legacy API** is the category React's documentation now files `forwardRef` under. The Legacy React APIs "are not recommended for use in newly written code".

So write every new component with `ref` as a prop. To update an older `forwardRef` component, take three simple steps:
1. Remove the `forwardRef` wrapper call and delete its import statement.
2. Add `ref` to the props the component unpacks, as in `{ placeholder, ref }`.
3. Keep `ref={ref}` on the built-in tag.

React's announcement also provided a **codemod**, an automated script that rewrites your code for you to make this change across a whole project.

### The real mistake: wrapping in forwardRef and never using ref

React's docs list this exact problem: "My component is wrapped in `forwardRef`, but the `ref` to it is always `null`". It happens like this:
1. A developer wraps `SearchInput` in `forwardRef` and assumes the wrapper alone attaches the DOM element.
2. The render function receives `(props, ref)`, but returns `<input placeholder={props.placeholder} />` without attaching `ref={ref}`.
3. During the commit phase, `inputRef.current` stays `null`, and clicking `Search` throws the same `TypeError` as in Principle 1.

The documentation explains: "This usually means that you forgot to actually use the `ref` that you received." The rule is the same in both patterns. In the old pattern, wrapping is not enough. In the new pattern, unpacking is not enough. In both, the ref must reach a built-in tag.

### What interviewers add

1. **Strict Mode calls the render function twice.** React's documentation explains that in Strict Mode, React calls a `forwardRef` render function twice in development to uncover unintended side effects (Lesson 47).
2. **`memo` and `lazy` accept `forwardRef` components.** An older component wrapped in `forwardRef` can still be wrapped with `memo` or loaded asynchronously with `lazy` (Lessons 55 and 70).
3. **`useImperativeHandle` used to need `forwardRef`.** In older code, the Hook got its ref from the render function's second argument. In React 19, it receives the `ref` prop directly (Lesson 50).
4. **The parent never knew the difference.** Updating a child from `forwardRef` to `ref` as a prop requires zero changes to any parent component.

---

## PRINCIPLE | `ref={ref}`: the ref reaches the `<input>` only if every component on the way passes it on

> [!PRINCIPLE]
> **Principle 3: Forwarding a Ref: Every Component on the Way Passes ref On**
>
> *When the built-in tag sits several components deep, each of our components on the way unpacks `ref` and writes `ref={ref}` on the next tag, until a built-in tag receives it.*
>
> A ref travels one component at a time, like any prop. React fills it only when it lands on a built-in tag such as `<input>`. Then the parent's ref holds that element, however deep it sits. If any component on the way leaves `ref` out, the ref stops there, the parent's ref stays `null`, and the click throws a `TypeError`.
>
> **DO THIS:**
> ```jsx
> function SearchInput({ placeholder, ref }) {
>   return <TextInput placeholder={placeholder} ~ref={ref}~ />; // Forwards the ref to TextInput, which puts it on the input
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function SearchInput({ placeholder, ref }) {
>   return <TextInput ~placeholder={placeholder}~ />; // **WRONG:** the ref stops here, so inputRef.current stays null
> }
> ```

The store has more fields than the search field: a coupon field in the cart, and an email field at checkout. The team wants all of them to share identical styling and behavior, so it creates one shared component, `TextInput`, for every text field. `SearchInput` now renders `TextInput` instead of its own `<input>`.

A shared text field is exactly the kind of component React's docs name as the right place to expose a DOM element: "reusable low-level components like buttons or text inputs".

Here is the minimal code showing two components, each passing `ref` on:

```jsx title="Two of our components on the way to the input"
function SearchInput({ placeholder, ref }) {
  return <TextInput placeholder={placeholder} ~ref={ref}~ />; // Passes the ref on to our own TextInput
}

function TextInput({ placeholder, ref }) {
  return <input className="text-input" placeholder={placeholder} ~ref={ref}~ />; // Passes it to the built-in input
}
```

**The ref travels one component at a time, like any prop. It goes no deeper than the last component that passes it on.** `App` never directly renders the `<input>`, yet clicking `Search` puts the cursor in it. Here is the exact path the ref follows:
1. `App` renders `<SearchInput ref={inputRef} ... />`.
2. React calls `SearchInput` with `ref` in its props.
3. `SearchInput` returns `<TextInput ... ref={ref} />`. Because `TextInput` is our own custom component and not a built-in tag, React has no DOM element to give yet.
4. React calls `TextInput` with the same ref in its props.
5. `TextInput` returns `<input ... ref={ref} />`, a built-in browser DOM tag.
6. During the commit phase, React assigns this physical `<input>` DOM node to the ref, which is the exact object that `App` created as `inputRef`.

React's docs use one verb for steps 3 and 5: a component **forwards** the ref. Their own example explains: "The `FormField` component forwards that ref to `MyInput`, which forwards it to a browser `<input>` DOM node." Forwarding a ref is identical to forwarding any prop: passing on a value received from above (Lesson 09).

```tree dir=right caption="How the ref created in App passes through two of our components until a built-in input receives it."
How `inputRef` reaches the `<input>` inside `TextInput`
- +1. `App` [`<SearchInput ref={inputRef} />`] | Gives the ref to `SearchInput` **as a prop**
- +2. `SearchInput` [`<TextInput ref={ref} />`] | **Forwards** it to our own `TextInput` | No element yet: `TextInput` is **not a built-in tag**
- +3. `TextInput` [`<input ref={ref} />`] | **Forwards** it to the built-in `<input>` | In the commit, React puts **the input element** into `inputRef.current`
```

### The store header, step 2: TextInput

Here is the new file, and the updated `SearchInput.jsx` that uses it. `App.jsx` does not change:

```jsx title="src/TextInput.jsx"
export default function TextInput({ placeholder, ref }) {
  return <input className="text-input" placeholder={placeholder} ~ref={ref}~ />; // The built-in tag that receives the ref
}
```

```jsx title="src/SearchInput.jsx"
import TextInput from './TextInput.jsx';

export default function SearchInput({ placeholder, ref }) {
  return <TextInput placeholder={placeholder} ~ref={ref}~ />; // Forwards App's ref one component deeper
}
```

The Elements panel now shows the `class` that `TextInput` added. Neither `SearchInput` nor `TextInput` appears as an HTML tag in the DOM; only the `<input>` they produce is written to the page (Lesson 04):

```dom caption="What the Elements panel shows after TextInput renders the input: one input with its class and placeholder."
<header>
  <nav>
    <button>Search</button>
  </nav>
  + <input class="text-input" placeholder="Looking for something?"> | note: Rendered by TextInput, inside SearchInput
</header>
```

### The real mistake: one component on the way forgets ref

**A ref does not navigate to the `<input>` on its own. If one component on the way leaves it out, the click handler fails.**

```jsx title="src/SearchInput.jsx"
export default function SearchInput({ placeholder, ref }) {
  return <TextInput ~placeholder={placeholder}~ />; // **WRONG:** ref is unpacked but never passed on to TextInput
}
```

Here is what happens step by step:
1. `SearchInput` unpacks `{ placeholder, ref }`, but writes only `placeholder` on the `TextInput` tag.
2. `TextInput` receives no ref prop. Its unpacked `ref` parameter evaluates to `undefined`, because no attribute on its tag provided one.
3. React never connects a DOM node to `inputRef`. `inputRef.current` remains `null`, and clicking `Search` throws the fatal `TypeError` from Principle 1.

The same failure occurs when the `<input>` renders conditionally. Suppose `TextInput` returns `{showInput && <input ref={ref} />}`, and `showInput` is `false`. Then, as React's documentation warns, "the ref won't be forwarded to any node". The docs add: "This is particularly easy to miss if the condition is hidden inside another component".

### What interviewers add

1. **How deep can a ref go?** Through as many components as pass it on. React's docs illustrate a chain passing from a form, to a form field, to a text input, and finally to the built-in `<input>`.
2. **Which components should expose an element?** Low-level UI primitives, such as a text input or a button. Application-level domain components, such as an avatar or a comment list, should encapsulate their internal DOM.
3. **When should you avoid using a ref?** React's docs emphasize: "If you can express something as a prop, you should not use a ref." For example, control whether a dialog is open by passing an `isOpen` prop. A ref is reserved for imperative operations that cannot be expressed as declarative props, such as focusing an input, scrolling an element, or measuring layout (Lesson 50).

---

## PRINCIPLE | `{...props}`: the spread carries the ref along, `{ ref, ...otherProps }` leaves it out

> [!PRINCIPLE]
> **Principle 4: Spread and ref: {...props} Passes ref Because ref Is in props**
>
> *In React 19, a component that writes `{...props}` on a built-in tag passes the ref along with the other props; after `{ ref, ...otherProps }`, the rest no longer holds the ref, so write `ref={ref}` on the tag yourself.*
>
> A spread copies every field of the object it spreads. In React 19, `props` holds `ref`, so `{...props}` puts the ref on the `<input>` with no `ref=` line. A rest property that names `ref` first takes it out of the rest. With `forwardRef`, `props` never held the ref, so the spread never carried it.
>
> **DO THIS:**
> ```jsx
> function TextInput({ ref, ...otherProps }) {
>   return <input {...otherProps} ~ref={ref}~ />; // The ref taken out of otherProps goes back on by hand
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function TextInput({ ref, ...otherProps }) {
>   return <input ~{...otherProps}~ />; // **WRONG:** otherProps holds every prop except ref, so the ref is dropped
> }
> ```

`TextInput` passes every prop it gets to the `<input>`. Writing each prop by hand becomes tedious and repetitive, so developers use the JSX spread `{...props}` (Lesson 09). The spread copies every enumerable key from the `props` object onto the JSX tag. Now ask: is `ref` one of those keys? In React 19, yes.

Here are three versions of `TextInput` with a spread. The critical difference is whether `ref` is still inside the object being spread:

```jsx title="With {...props}: ref is inside props"
function TextInput(props) {
  return <input className="text-input" ~{...props}~ />; // Spreads placeholder and ref onto the input
}
```

```jsx title="With { ref, ...otherProps } and ref={ref}: ref is taken out, then written by hand"
function TextInput({ ref, ...otherProps }) {
  return <input className="text-input" {...otherProps} ~ref={ref}~ />; // otherProps has placeholder; ref is written by hand
}
```

```jsx title="With { ref, ...otherProps } alone: ref is taken out and dropped"
function TextInput({ ref, ...otherProps }) {
  return <input className="text-input" ~{...otherProps}~ />; // **WRONG:** otherProps has no ref, so the input never gets it
}
```

> [!DEFINITION]
> **A rest property.** [NEW] In a parameter list, `...otherProps` collects every property that is not explicitly extracted before it. Consider an object with properties `firstName`, `lastName`, and `age`. Writing `{ firstName, ...rest }` binds `firstName` to its own variable, while `rest` collects only `lastName` and `age`. In `{ ref, ...otherProps }`, `ref` is named first, leaving `otherProps` with everything except `ref`. React's documentation frequently uses this pattern when separating framework props from HTML attributes (Lesson 85).

The first two versions do the exact same thing. Both apply `placeholder` and `ref` to the `<input>`, and clicking `Search` focuses the input in both.

The second and third versions look almost identical, but they behave very differently. The rest property collects all props except `ref`. Without the explicit `ref={ref}` attribute on the tag, nothing passes the ref to the `<input>`, so `inputRef.current` remains `null`.

```tree caption="Three versions of TextInput with a spread, and whether the ref reaches the input in each."
Is `ref` still inside the object that is spread?
- +With `{...props}` [`<input {...props} />`] | `props` **holds `ref`** | The spread puts **`ref` on the input**
- +With `{ ref, ...otherProps }` and `ref={ref}` [`{...otherProps} ref={ref}`] | `otherProps` **has no `ref`** | The **hand-written** `ref={ref}` puts it on the input
- !With `{ ref, ...otherProps }` alone [`{...otherProps}`] | `otherProps` **has no `ref`** | **Nothing** puts it on the input: `inputRef.current` stays **`null`**
```

### The spread passes a ref that no line writes

**The version with `{...props}` has no `ref=` attribute anywhere in JSX, yet clicking `Search` still works.** Developers often encounter this when modernizing an older component:
1. A developer examines a `forwardRef` version of `TextInput` that spread `props` and placed `ref={ref}` after the spread.
2. They remove the `forwardRef` wrapper and change the function signature to `function TextInput(props)`.
3. Because the separate `ref` argument is gone, they delete the explicit `ref={ref}` attribute as well. The tag now reads `<input className="text-input" {...props} />`.
4. When testing the application, clicking `Search` still focuses the input field.

It works because the spread carries `ref` automatically. React passes `TextInput` a single props object containing both `placeholder` and `ref`. `{...props}` copies every field from that object onto the `<input>`. Because `<input>` is a built-in HTML tag, React assigns the DOM node to the ref during the commit phase.

With legacy `forwardRef`, that same spread never carried the ref. React's docs describe the older render function's `props` parameter as "the props passed by the parent component", while the ref arrived separately as a second parameter. That is why legacy code was required to write `ref={ref}` after spreading props.

### The store header, step 3: TextInput spreads its props

Our `TextInput` now spreads `props`. If a caller passes additional props later, such as `type="search"`, they reach the `<input>` without requiring changes to `TextInput.jsx`. `SearchInput.jsx` and `App.jsx` remain unchanged:

```jsx title="src/TextInput.jsx"
export default function TextInput(props) {
  return <input className="text-input" ~{...props}~ />; // Carries placeholder and ref onto the input
}
```

The user interface works exactly as before. The user clicks `Search`, and the cursor appears in the field.

### What interviewers add

1. **`key` does not travel with the spread.** React's documentation notes that "your components won't receive `key` as a prop" (Lesson 18). Because `props` never holds `key`, spreading `{...props}` never carries `key`. `ref` became an ordinary prop in React 19, but `key` did not.
2. **A spread forwards every prop indiscriminately.** Spreading an unchecked props object onto a built-in tag also passes props the HTML tag does not support, prompting React to warn about unknown DOM attributes in development (Lesson 09). `ref` is safe from this warning because every built-in tag accepts `ref`.
3. **Writing `ref={ref}` by hand remains completely valid.** React's docs state that repeating props explicitly is not an error and can make code easier to understand. The pattern with `{ ref, ...otherProps }` and an explicit `ref={ref}` makes it immediately clear where the ref lands.

---

## PRINCIPLE | `element.props.ref`: the JSX object keeps the ref inside props, `key` stays outside

> [!PRINCIPLE]
> **Principle 5: element.props.ref: The Element Object Keeps ref Inside props**
>
> *In React 19, the element that JSX builds from `<SearchInput ref={inputRef} />` keeps the ref in `element.props.ref`; reading the old `element.ref` logs an error, and `key` still stays outside `props`.*
>
> The ref is a prop from the moment the tag becomes an object, which is why the component later finds it in its props. Older code that reads `element.ref` still gets the ref, but the Console says "ref is now a regular prop", and the field will be removed. Read `element.props.ref` instead, and in application code, avoid reading element fields at all.
>
> **DO THIS:**
> ```jsx
> const element = <SearchInput ref={inputRef} />;
> console.log(~element.props.ref~); // The ref object, where React 19 keeps it
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const element = <SearchInput ref={inputRef} />;
> console.log(~element.ref~); // **WRONG:** the old field; React logs that ref is now a regular prop
> ```

Remember what a JSX tag produces when evaluated: a plain JavaScript object with properties `type`, `props`, and `key` (Lesson 76). We saw that `ref` is a prop inside `SearchInput`. It becomes a prop one step earlier as well, inside that element object.

Here is how `ref` enters the element's `props`:
1. The compiler transforms `<SearchInput ref={inputRef} placeholder="..." />` into a JSX creation function call (Lesson 02).
2. That call returns a lightweight React element object with `type: SearchInput` and a `props` property.
3. In React 19, `ref` is placed directly inside `props`, right next to `placeholder`.
4. When React renders `SearchInput`, it passes this exact `props` object, allowing the component to access `ref` directly from its parameter list.

This structure relies on the **new JSX transform** standard in modern React tooling. React's upgrade guide confirms that React 19 requires the new JSX transform because capabilities like accessing `ref` as a prop depend on it.

To observe this structure, add a short test to the click handler in `App.jsx`. It creates one `SearchInput` element without rendering it, and logs two of its properties:

```jsx title="src/App.jsx" startLine="7"
  function handleSearchClick() {
    inputRef.current.focus();
    const element = <SearchInput ref={inputRef} placeholder="Looking for something?" />; // A test element, never rendered
    console.log(~element.props.ref~); // The ref object App created
    console.log(~element.ref~); // **WRONG:** the old field; reading it logs an error
  }
```

The user clicks `Search`. The cursor lands in the search field as usual, and the handler reads two properties. In the browser Console, however, a red error appears between the two log outputs:

```devconsole width=full
{current: input.text-input} | App.jsx:10
x Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.
{current: input.text-input} | App.jsx:11
```

### VS | `element.props.ref` vs. `element.ref`: the new place and the old place

- **`element.props.ref`** holds the ref object that `App` created. By the time the click handler runs, the commit phase is complete, so its `current` property already points to the rendered `<input>` DOM element.
- **`element.ref`** is the legacy property where older versions of React placed refs outside `props`. React's upgrade guide marks it as deprecated in favor of `element.props.ref`. Accessing `element.ref` still returns the ref object during the transition period, but logs a deprecation error the first time it is read.

```tree caption="Where ref and key sit in the element object that JSX builds in React 19."
The element object for `<SearchInput ref={inputRef} placeholder="..." />`
- +`element.props.ref` [`props.ref`] | **The new place** of the ref, next to `props.placeholder` | Holds the ref object `App` created
- !`element.ref` [`element.ref`] | **The old place**, outside `props` | Reading it logs **an error** in the Console
- +`element.key` [`element.key`] | `key` **still stays outside** `props` | Components **never receive** `key` as a prop
```

### Who reads element.ref

Application code rarely inspects an element's internal fields directly. React's documentation advises treating every element "as opaque after it's created, and only render it". This console warning primarily surfaces in older third-party libraries that inspect or clone child elements, such as utility libraries using `React.cloneElement`. When such libraries run on React 19, the Console displays this warning until the library updates its code to read `element.props.ref` instead.

Once you have verified the console behavior, remove the test lines from `App.jsx`.

### What interviewers add

1. **Class components are different.** React's release notes state: "`ref`s passed to classes are not passed as props since they reference the component instance." Placing a ref on a class component still assigns a reference to the component instance itself. Lesson 99 covers class components and instance refs in detail.
2. **`key` is still not a prop.** React 19 moved `ref` into `props`, but not `key`: inside a component, `props.key` evaluates to `undefined`. When a parent passes a `key`, attempting to read `props.key` logs a warning in the Console starting with "`key` is not a prop" (Lesson 18).

---

## All 5 Principles Together

### The complete store header

Here is the complete header, without the diagnostic lines from Principle 5. `App` creates the ref, `SearchInput` forwards it, and `TextInput` spreads it onto the `<input>`:

```jsx title="src/App.jsx"
import { useRef } from 'react';
import SearchInput from './SearchInput.jsx';

export default function App() {
  const inputRef = useRef(null);

  function handleSearchClick() {
    ~inputRef.current.focus();~ // After the commit, inputRef holds the input inside TextInput
  }

  return (
    <header>
      <nav>
        <button onClick={handleSearchClick}>Search</button>
      </nav>
      <SearchInput ~ref={inputRef}~ placeholder="Looking for something?" /> {/* Principle 1: ref goes in as a prop */}
    </header>
  );
}
```

```jsx title="src/SearchInput.jsx"
import TextInput from './TextInput.jsx';

export default function SearchInput(~{ placeholder, ref }~) { // Principles 1 and 2: ref unpacked from props, no forwardRef
  return <TextInput placeholder={placeholder} ~ref={ref}~ />; // Principle 3: forwards the ref one component deeper
}
```

```jsx title="src/TextInput.jsx"
export default function TextInput(props) {
  return <input className="text-input" ~{...props}~ />; // Principle 4: the spread carries placeholder and ref
}
```

### How React calls the components, and where the ref lands

When the page mounts, React calls `App`, then `SearchInput`, then `TextInput`, in the order of their JSX tags. Throughout this render phase, `inputRef.current` remains `null`. The ref simply travels down through component props. React assigns the real DOM element at the end of the update cycle, during the commit phase:

```tree caption="The order in which React calls App, SearchInput, and TextInput, and where the ref travels at each step."
`App` [1. Called first] | Creates **`inputRef`**, `null` during the render | Writes it **on the `SearchInput` tag**
- +`SearchInput` [2. Called second] | Receives `ref` **in its props** | **Forwards** it to `TextInput`
  - +`TextInput` [3. Called third] | Spreads `props`, **ref included**, onto the built-in `<input>` | After the commit: `inputRef.current` holds **the input element**
```

The user clicks `Search`, and the cursor appears in the field:

```page width=text caption="The finished store header after the user clicks Search and types shoes."
line: [Search]
card: typed=shoes | good=typed
console: quiet
```

| Aspect | The Habit from React 18 | The React 19 Rule |
| :--- | :--- | :--- |
| **Receiving a ref** | Wrap the component in `forwardRef` and read `ref` as a second argument | Unpack `ref` from props, like `placeholder` |
| **Older `forwardRef` code** | Keep adding `forwardRef` to every new component | Leave old code working; write new components without it, and remove the wrapper when you update one |
| **A ref two components deep** | Expect the ref to find the `<input>` inside by itself | Every component on the way forwards it with `ref={ref}` |
| **Spreading props** | Write `ref={ref}` after every spread, because `props` never held the ref | `{...props}` carries `ref`; after `{ ref, ...otherProps }`, write `ref={ref}` by hand |
| **The element object** | Read the ref from `element.ref`, beside `key` | Read `element.props.ref`; only `key` stays outside `props` |

Remember the central principle of this lesson: **In React 19, `ref` is an ordinary prop just like `placeholder`: the child unpacks it and passes it on, until it lands on a built-in tag.**

---

## For the Interview

> **The Interview Question:** How does React 19 treat ref as an ordinary prop, and how does it replace forwardRef?

### How to Answer Clearly in 30 Seconds

"In React 19, function components receive `ref` directly inside `props`, like any ordinary prop. When a parent renders `<SearchInput ref={inputRef} />`, the child component unpacks `{ placeholder, ref }` and passes `ref` to a built-in tag, such as `<input ref={ref} />`. During the commit phase, React assigns that browser DOM element to the parent's ref. Before React 19, function components could not receive `ref` as a prop, requiring the `forwardRef` wrapper to receive `ref` as a separate second argument. The parent syntax is identical in both versions. `forwardRef` remains backward-compatible, but the React documentation notes it is no longer necessary and will be deprecated, so new components omit it. Three practical rules follow from `ref` being a prop:
1. **A ref travels only as far as components explicitly forward it.** Each component along the path must forward it, or the parent ref remains `null`.
2. **`{...props}` automatically forwards the ref.** Rest destructuring that extracts `ref` leaves it out of the rest object, requiring you to attach `ref={ref}` by hand.
3. **The element stores it in `element.props.ref`.** Accessing `element.ref` logs a deprecation warning, while `key` remains strictly isolated outside `props`."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Do you have to remove `forwardRef` from existing code when you upgrade to React 19?"**
   No. Existing components wrapped in `forwardRef` continue to work without errors in React 19, and parent components require zero changes. React's docs state that `forwardRef` "will be deprecated in a future release", and categorize it under Legacy React APIs, which are "not recommended for use in newly written code". For new development, write function components with `ref` as a prop. When refactoring an older component, remove the wrapper, add `ref` to the unpacked props, and keep `ref={ref}` on the tag. React's release notes also provide an automated codemod to handle this refactoring across entire codebases.
2. **"A parent passes a ref to your component, but `ref.current` is always `null`. What do you check?"**
   First, verify that the ref actually reaches a built-in HTML tag. React attaches a DOM element to a ref only when the ref is placed on a built-in tag such as `<input>` or `<button>`. On a custom component, `ref` is merely a prop. Walk down from the parent: each component must unpack `ref` and forward it using `ref={ref}`, or spread a props object that contains it. Second, verify that the target tag actually renders. If the `<input>` sits behind a condition that evaluates to `false`, React never mounts the node, and as the docs warn, "the ref won't be forwarded to any node". In legacy `forwardRef` code, the cause is usually the one the docs cite: "you forgot to actually use the `ref` that you received."
3. **"Is `ref` now exactly like any other prop? What about `key`?"**
   For function components, yes: `ref` arrives in `props`, `{...props}` carries it, and the virtual element stores it in `element.props.ref`. Two limitations remain. First, `key` is still not a prop: as React's docs state, "your components won't receive `key` as a prop", so `props.key` evaluates to `undefined` and accessing it logs a warning. Second, a ref passed to a class component is not a prop, because it references the class component instance itself. Finally, using `ref` as a prop requires the modern JSX transform standard in React 19.

```tree dir=right caption="Interview comparison: what changed for ref in React 19, and what stayed the same."
`ref` in React 19
- +What changed [`{ placeholder, ref }`] | A function component **receives `ref` in props** | `forwardRef` is **no longer needed**; `{...props}` **carries the ref**; the element keeps it in **`props.ref`**
- +What stayed the same [`<SearchInput ref={inputRef} />`] | The **parent's tag** | React fills the ref **only on a built-in tag**, during the commit
- !What is still not a prop [`key`] | **`key`** never reaches the component | A ref on a **class component** still points at the instance
```
