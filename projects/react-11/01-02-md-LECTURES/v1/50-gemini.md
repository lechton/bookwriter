# Lecture 50: How a Child Hands Its Parent Only focus with useImperativeHandle

*(How does a Comment button in one component put the cursor in an input field that lives in another component?)*

> INTERVIEW QUESTION | ❱❱ MORE | How does a child expose a focused API to its parent through a ref?

---

## VS | `ref` on the `<input>` vs. `useImperativeHandle`: the parent gets the whole element, or only `focus`

> Attaching a ref to a native `<input>` tag gives your component direct access to the underlying DOM node, allowing an event handler to focus it. **When that `<input>` lives inside a child component, the child determines what the parent ref receives: the entire DOM element, or a restricted object containing only `focus`**. Expose only what the parent genuinely needs. A parent holding the raw DOM element can alter styles or attributes without the child component ever knowing.

In Lesson 31, a button and a text input existed within the same component. Attaching a ref to the native input element caused React to assign the real DOM node to `inputRef.current` during the commit phase. The click handler invoked `focus()` on that DOM node, immediately placing the cursor in the field.

In production applications, triggering buttons and input fields frequently reside in separate components. In a social feed, for example, each post displays a comment box. Because the comment field carries its own internal logic and presentation, it is extracted into a dedicated child component called `CommentInput`. The Comment button remains in the parent `Post` component. This architecture raises an important question: how can `Post` place the cursor into an `<input>` element that it does not render directly?

The setup begins similarly to Lesson 31. `Post` creates a ref and passes it to the child tag as a prop: `<CommentInput ref={commentRef} />`. However, placing a ref on a custom component does not automatically drill down to the DOM elements rendered inside it. React enforces encapsulation by default: custom components do not expose their internal DOM nodes to external parents unless explicitly programmed to do so.

> [!DEFINITION]
> **To expose.** [NEW] When a parent attaches a ref to a child component, the value that the child makes accessible through `ref.current` is what the child exposes. By default, a custom component exposes nothing; the parent ref remains `null` until the child explicitly forwards an internal DOM node or returns a custom handle (Lesson 50).

The child component must choose what contract it exposes to its parent:
- **The complete DOM element.** `CommentInput` attaches the parent ref directly to its internal `<input>` tag. `Post` receives the native DOM node with all its browser methods and properties, exactly as in Lesson 31.
- **A restricted handle containing only `focus`.** `CommentInput` retains the native input element in an internal private ref. It then provides `Post` with a small object exposing a single `focus` method. React supplies the `useImperativeHandle` Hook specifically to create this boundary.

That small object represents what technical interviews call a focused API: a restricted set of methods the parent is allowed to invoke, without leaking unnecessary DOM capabilities.

This pattern mirrors standard JavaScript module design. A module keeps internal state private within its file scope and exports only a dedicated function. Other files can invoke the exported function without ever gaining access to the underlying variable:

```js title="Plain JavaScript: a file shares one function, not the element"
const input = document.getElementById('comment'); // Stays private inside this file
export function ~focusComment~() { // The only thing other files can use
  input.focus();
}
```

The `useImperativeHandle` Hook establishes that exact boundary for React components. The real input element remains private inside `CommentInput`, while the parent receives only the explicit methods returned by the child:

```jsx title="React: CommentInput shares one method, not the element"
const inputRef = useRef(null); // Stays private inside CommentInput
~useImperativeHandle~(ref, () => ({ // The only thing Post can use
  focus() { inputRef.current.focus(); },
}));
```

**Why this boundary matters:** On the screen, both implementations produce the exact same interactive behavior. When the user clicks Comment, `Post` executes `commentRef.current.focus()`, and the cursor immediately enters the field. The crucial distinction is what `commentRef.current` actually contains. When given the raw DOM element, `Post` can also modify inline styles, read internal text values, or remove DOM nodes directly. None of those mutations appear anywhere in the source code of `CommentInput`. The React documentation warns that manually manipulating another component's DOM nodes introduces fragility. With `useImperativeHandle`, the Post component receives a custom object defined by the child, exposing `focus` and nothing else.

```tree caption="Two things CommentInput can expose to Post through the same ref: the whole input element, or an object with only focus."
What `commentRef.current` holds in `Post`
- !The ref on the `<input>` [`<input ref={ref} />`] | `Post` gets **the real `<input>` element** | `Post` can focus it, **and also change its style or remove it**
- +`useImperativeHandle` [`useImperativeHandle`] | `Post` gets **an object `CommentInput` wrote** | `Post` can **only focus** the field
```

Keep the fundamental rule in mind: **a parent component receives only what the child explicitly exposes. Binding the ref directly to the `<input>` gives the parent the entire DOM element. Using `useImperativeHandle` gives the parent only the specific methods you choose to return.**

### The Rule of Thumb: determining what to expose

**Ask one question: what capability does the parent genuinely require from the child? If it needs an imperative action that no prop can express, such as focusing or scrolling, provide a handle with that single method. If it needs to control what the child displays, pass a declarative prop.**

Experienced engineers guard against three common mistakes:
1. **Assuming a ref on a custom component behaves like a ref on a native tag.** React treats a ref on a custom component as an ordinary prop. The ref stays `null` until the child assigns it, and the click throws a `TypeError`.
2. **Believing `useImperativeHandle` hides the DOM node from the document.** The `<input>` element still renders in the DOM tree and appears in browser developer tools; only the reference held by the parent changes.
3. **Exposing stateful operations through the handle**, such as `clear` or `open`. If a prop or state variable can express the intended outcome, use declarative props instead.

The rest of this lesson walks through each scenario using a live application.

## SECTION | A Post with a Comment Button

Our application displays a single post from a feed, pared down to its essential pieces: the post text, a Comment button, and an empty comment field:

```page width=text caption="The post when the page opens: the post line, the Comment button, and an empty comment field."
line: John: Lunch at noon?
line: [Comment]
card: input=Write a comment...
console: quiet
```

The goal is clear. When the user clicks Comment, the cursor immediately jumps into the comment field, allowing the user to type `Yes!` without manually clicking into the field:

```page width=text caption="The goal: the user clicks Comment and types Yes! right away."
line: John: Lunch at noon?
line: [Comment]
card: typed=Yes! | good=typed
console: quiet
```

Initially, the Comment button has no click handler attached. The root `App` component renders the single post:

```jsx title="src/App.jsx"
import Post from './components/Post.jsx';

export default function App() {
  return <Post />;
}
```

The `Post` component renders the post text, the inactive Comment button, and the `CommentInput` child component:

```jsx title="src/components/Post.jsx"
import CommentInput from './CommentInput.jsx';

export default function Post() {
  return (
    <article>
      <p>John: Lunch at noon?</p>
      ~<button>Comment</button>~ {/* No onClick yet: the click does nothing */}
      <CommentInput />
    </article>
  );
}
```

The `CommentInput` component isolates the text input markup:

```jsx title="src/components/CommentInput.jsx"
export default function CommentInput() {
  return ~<input placeholder="Write a comment..." />~; // The input lives here, not in Post
}
```

The application entry file mounts `App` inside `<StrictMode>`, following the setup established in Lesson 07. The project structure is organized as follows:

```files title="post-comment: File Explorer" caption="How the post project files sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and renders `<Post />`
  components/
    Post.jsx | parent with the button | The post line, the Comment button, and from Principle 1 the `commentRef` it passes to `CommentInput`
    CommentInput.jsx | child with the input | The `<input>`, and from Principle 3 its own `inputRef` and `useImperativeHandle`
```

Each principle modifies a single aspect of this project and illustrates the visual and runtime consequences.

**PRINCIPLES:** A ref passed to a custom component remains inactive until that component explicitly assigns or handles it. Four principles guide this mechanism:
1. **Principle 1: A ref on a custom component is received as a prop.** Until `CommentInput` forwards the ref to a native tag, the ref remains `null`. Then clicking the button throws a `TypeError`.
2. **Principle 2: Forwarding the ref directly exposes the complete DOM node.** `Post` can invoke `focus()`, but it can also manipulate styles or attributes without any record in the child component.
3. **Principle 3: `useImperativeHandle` exposes only the returned methods.** The Post component receives an object containing `focus`, while any unexposed property reads evaluate to `undefined`.
4. **Principle 4: Reserve handles for actions that props cannot express.** Focus management belongs in a handle, while rendered input text and visibility states belong in props.

---

## PRINCIPLE | `<CommentInput ref={commentRef} />`: the ref stays `null` until `CommentInput` puts it on a built-in tag

> [!PRINCIPLE]
> **Principle 1: ref as a Prop: A Ref on Our Own Component Stays null Until It Reaches a Built-In Tag**
>
> *A ref written on our own component is only a prop; the component must take `ref` from its props and put it on a built-in tag before the parent's `ref.current` holds an element.*
>
> React fills a ref with an element only on a built-in tag such as `<input>`. On `<CommentInput ref={commentRef} />`, React has no element to give, so it hands `ref` to `CommentInput` as a prop. If `CommentInput` ignores it, `commentRef.current` stays `null`, and the click on Comment throws a `TypeError`.
>
> **DO THIS:**
> ```jsx
> function CommentInput({ ref }) {
>   return <input ~ref={ref}~ placeholder="Write a comment..." />; // React puts the input into the parent's ref
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ~CommentInput~() { // **WRONG:** never reads ref, so commentRef.current stays null and the click throws
>   return <input placeholder="Write a comment..." />;
> }
> ```

Here is the same ref attached to two different tags. The first is a native browser `<input>` element. The second is `MyInput`, a custom component that returns an input element:

```jsx title="The same ref on a built-in tag and on our own component"
const inputRef = useRef(null);

<input ~ref={inputRef}~ /> {/* React puts this <input> element into inputRef.current */}
<MyInput ~ref={inputRef}~ /> {/* inputRef.current stays null unless MyInput puts ref on a tag */}
```

Although the JSX syntax appears identical, the runtime behavior is completely different. React can assign a DOM element to a ref only when an actual DOM node exists. For the native `<input>` tag, React instantiates the DOM element during the commit phase and populates `inputRef.current` (Lesson 31). For `<MyInput>`, no direct DOM node exists; `MyInput` is a JavaScript function, not a built-in browser element.

React therefore treats `ref` as an ordinary prop passed into `MyInput`. The ref remains inert until `MyInput` explicitly reads and assigns it.

```tree caption="The same ref attribute on a built-in tag and on a component we wrote."
Where the `ref` attribute is written
- +On a built-in tag [`<input ref={inputRef} />`] | React has **a real element** for this tag | React puts **the element into `inputRef.current`** in the commit
- !On our own component [`<MyInput ref={inputRef} />`] | `MyInput` is **a function**, not a browser tag | `ref` is **just a prop**, and `inputRef.current` **stays `null`**
```

### Post passes a ref to CommentInput, and the click throws an error

In our application, the Post component initializes a ref using `useRef(null)` and passes it to `<CommentInput ref={commentRef} />`. When the user clicks Comment, the click handler attempts to invoke `focus`:

```jsx title="src/components/Post.jsx"
import { useRef } from 'react';
import CommentInput from './CommentInput.jsx';

export default function Post() {
  const commentRef = useRef(null);

  function handleCommentClick() {
    ~commentRef.current.focus();~ // Expects the input inside CommentInput
  }

  return (
    <article>
      <p>John: Lunch at noon?</p>
      <button onClick={handleCommentClick}>Comment</button>
      <CommentInput ~ref={commentRef}~ /> {/* Looks like the ref on an input in Lesson 31 */}
    </article>
  );
}
```

The `CommentInput` component remains unchanged. It returns the `<input>` element without accepting the `ref` prop.

**Attempting to focus an unattached ref triggers an immediate runtime exception when the user clicks Comment.** The runtime failure unfolds in five steps:
1. The Post component creates `commentRef`, which initially holds `null`.
2. React hands `commentRef` to `CommentInput` as a prop, but the child never reads it.
3. Because no native DOM tag received the ref, `commentRef.current` remains `null`.
4. The user clicks Comment, causing `handleCommentClick` to invoke `commentRef.current.focus()`.
5. Because `commentRef.current` holds `null`, JavaScript cannot access properties on it. The click handler throws an unhandled `TypeError`, and the cursor never enters the field.

```page width=text caption="After the user clicks Comment: the cursor stays out of the comment field, and the Console shows a TypeError."
line: John: Lunch at noon?
line: [Comment]
card: input=Write a comment... | bad=input
console: Uncaught TypeError: Cannot read properties of null (reading 'focus')
```

The page appears unchanged to the user, presenting a button that seems completely unresponsive. The browser console records the classic null reference error: "Uncaught TypeError: Cannot read properties of null".

### The solution: CommentInput accepts ref as a prop

Resolving this error requires two small adjustments inside `CommentInput`:

```jsx title="src/components/CommentInput.jsx"
export default function CommentInput(~{ ref }~) { // 1. Takes the ref that Post wrote on the CommentInput tag
  return <input ~ref={ref}~ placeholder="Write a comment..." />; // 2. Puts it on the built-in input
}
```

In React 19, a `ref` attribute passed to a custom component arrives directly on that component's props object alongside other attributes. The child component destructors `{ ref }` from its incoming props, identical to reading a standard prop like `{ name }` (Lesson 08). Lesson 85 covers the complete history of `ref` as a prop.

A critical detail is that only one ref container exists. The `ref` prop received by CommentInput references the exact same container object instantiated as `commentRef` in Post. During the commit phase, React assigns the native input DOM node to `ref.current`. Because both components point to the same container, `Post` accesses that same DOM node through `commentRef.current`.

When the user clicks Comment, the cursor immediately appears inside the field, ready for input:

```page width=text caption="After the fix, the user clicks Comment and types Yes! right away."
line: John: Lunch at noon?
line: [Comment]
card: typed=Yes! | good=typed
console: quiet
```

```tree dir=right caption="How the ref that Post writes on the CommentInput tag reaches the input inside CommentInput."
How `commentRef` reaches the `<input>`
- +1. `Post` writes the ref on the tag [`<CommentInput ref={commentRef} />`] | React puts `ref` **into the props** of `CommentInput`
- +2. `CommentInput` takes it out [`{ ref }`] | The same way as **`{ name }`** in Lesson 08
- +3. `CommentInput` puts it on the input [`<input ref={ref} />`] | In the commit, React puts **the input element** into `commentRef.current`
```

---

## PRINCIPLE | `<input ref={ref} />` in the child: the parent gets the whole element, not only `focus`

> [!PRINCIPLE]
> **Principle 2: Passing ref On: The Parent Gets the Whole DOM Element**
>
> *When a child puts the parent's ref on its `<input>`, the parent holds the real element and can do anything the browser allows with it, not only `focus`.*
>
> The ref carries the whole element, with `style`, `value`, and every other property of an input. A parent that asked for the field only to focus it can also change how it looks, and no line of the child's file shows it. Expose an element only from low-level reusable components, such as a plain text input or a button.
>
> **DO THIS:**
> ```jsx
> function handleCommentClick() {
>   ~commentRef.current.focus();~ // Uses the ref only for the one action JSX cannot say
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleCommentClick() {
>   commentRef.current.focus();
>   ~commentRef.current.style.opacity = 0.5;~ // **WRONG:** Post changes the look of a field that CommentInput owns
> }
> ```

Following the fix, `commentRef.current` in `Post` holds the actual HTML input element. It is not an abstraction or proxy; it is the exact DOM node returned by browser methods like `document.getElementById`. Consequently, the parent can invoke `focus()`, but it can also manipulate any other native property or method supported by the browser:

```jsx title="Two things the parent can do with the whole element"
~commentRef.current.focus();~ // Puts the cursor in the field
~commentRef.current.style.opacity = 0.5;~ // Draws the field half see-through
```

The `style` property is provided by the browser DOM rather than React. Every DOM element possesses a `style` declaration block that manages inline styles. Setting `style.opacity` to `0.5` commands the browser rendering engine to display the element at fifty percent opacity.

The React documentation highlights this consequence directly. Forwarding a ref allows the parent to manage focus, but also empowers it to perform arbitrary DOM operations like modifying CSS styles.

### An unintended style assignment in Post modifies the child component

Suppose a developer adds a second statement to the click handler in `Post`:

```jsx title="src/components/Post.jsx" startLine="7"
  function handleCommentClick() {
    commentRef.current.focus();
    ~commentRef.current.style.opacity = 0.5;~ // Changes how the input inside CommentInput looks
  }
```

The source file of CommentInput remains untouched, containing only `{ ref }` and the rendered `<input>` element.

**The click handler now alters the visual presentation of the child component, leaving no trace in the child component's code.** When the user clicks Comment, the cursor enters the field, and the input visually fades. React produces no warning or error, because the code violates no React rules; the browser simply executes the direct DOM modification instructed by `Post`.

Inspecting the DOM tree in the Elements panel reveals the source of the faded styling. The `<input>` element now carries an inline `style` attribute that exists in no JSX template:

```dom caption="The Elements panel after the click: the input carries a style that only Post wrote."
<article>
  <p>John: Lunch at noon?</p>
  <button>Comment</button>
  ! <input placeholder="Write a comment..." style="opacity: 0.5;"> | note: Set by Post, not by CommentInput
</article>
```

An engineer inspecting `CommentInput` to debug the faded appearance finds no opacity rules or style attributes in the component file. The mutation originates in a completely different file.

### Why leaking raw DOM elements makes code fragile

While a faded input serves as a simple visual demonstration, the true architectural hazard compounds across four developmental stages:
1. A developer forwards `ref` to the internal `<input>` simply to enable parent focus control.
2. Later requirements encourage the parent to rely on additional DOM properties, such as reading input text via `commentRef.current.value` or toggling classes.
3. Eventually, the maintainer of `CommentInput` refactors its internal structure. The `<input>` is replaced with a rich-text editable `<div>` to support markdown and mentions.
4. Every read of `commentRef.current.value` in the parent now returns `undefined`, because generic div elements lack a value property. The runtime defect surfaces in `Post`, even though the underlying code modification took place inside `CommentInput`.

The React documentation explicitly warns that exposing internal DOM nodes creates tight coupling and makes future refactoring difficult. Moreover, if a parent component mutates or removes DOM elements managed by React, the reconciliation engine can produce inconsistent visual states or runtime crashes (Lesson 31).

When is exposing the complete DOM element appropriate? React guidelines separate components by architectural layer. Exposing native DOM nodes is standard practice for low-level design primitives like reusable buttons or raw text inputs. Conversely, feature-level application components like comment boxes, user avatars, or dialogs should encapsulate their DOM structure.

A generic `MyInput` component used across an entire design system is a low-level primitive; exposing its DOM node is standard. Our `CommentInput` component belongs to a specific feature domain, the comment thread. It should keep its underlying DOM nodes encapsulated.

---

## PRINCIPLE | `useImperativeHandle`: the parent gets only the methods the child returns

> [!PRINCIPLE]
> **Principle 3: useImperativeHandle: The Parent Gets Only the Methods the Child Returns**
>
> *To give the parent only some methods, the child keeps the real element in its own ref and calls `useImperativeHandle(ref, createHandle, dependencies)` at the top level; React puts the object that `createHandle` returns into the parent's `ref.current`, in place of the element.*
>
> With the whole element, the parent can do anything to the child's field. With a handle, the parent holds an object the child wrote, and anything not on it, such as `style` or `value`, is `undefined`. The `<input>` stays on the page as before. Only what the parent holds changes.
>
> **DO THIS:**
> ```jsx
> function CommentInput({ ref }) {
>   const inputRef = useRef(null);
>   ~useImperativeHandle~(ref, () => ({ // Post's ref receives only focus
>     focus() { inputRef.current.focus(); },
>   }), []);
>   return <input ref={inputRef} placeholder="Write a comment..." />;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleSend() {
>   sendComment(~commentRef.current.value~); // **WRONG:** the handle has no value, so this sends undefined
> }
> ```

Here is the minimal implementation from the React documentation. The MyInput component retains the native `<input>` in a private ref and provides the parent with an object containing only `focus`:

```jsx title="MyInput gives its parent only focus"
import { useRef, useImperativeHandle } from 'react';

function MyInput({ ref }) {
  const realInputRef = ~useRef(null)~; // 1. A second ref that only MyInput sees

  ~useImperativeHandle~(ref, () => ({ // 2. Tells React what the parent's ref receives
    focus() {
      realInputRef.current.focus(); // 3. Our focus calls the real input's focus
    },
  }));

  return <input ~ref={realInputRef}~ />; // 4. The real input goes into MyInput's own ref
}
```

Two distinct refs now operate in coordination, each with a defined role:
1. **`realInputRef` remains private to `MyInput`.** It is attached to the native `<input>` element, receiving the real DOM node from React during commit.
2. **`ref` represents the public handle for the parent.** It is never passed to a DOM element. Instead, `useImperativeHandle` configures what object value populates `ref.current`.

The React documentation explicitly highlights this separation: in this architecture, the incoming `ref` prop is no longer attached to the native `<input>` element.

According to the documentation, `useImperativeHandle` is a React Hook that lets you customize the handle exposed as a ref. You import it from `react` and call it at the top level of the component body, conforming to the Rules of Hooks (Lesson 38). It accepts three arguments:
1. **`ref`**: The ref received from the parent component as a prop.
2. **`createHandle`**: A function taking no arguments that returns the custom object assigned to `ref.current`. Typically, this function returns an object containing the specific methods you want to expose.
3. **`dependencies`, optional**: An array of reactive values referenced by `createHandle`, evaluated similarly to effect dependencies (Lesson 32).

Whenever a value in the dependency array changes, React executes `createHandle` after the re-render and assigns the newly created handle object to the ref. If the dependency array is omitted entirely, React re-creates the handle after every re-render.

> [!DEFINITION]
> **An imperative handle.** [NEW] An imperative handle is the custom JavaScript object returned by `createHandle` that React assigns to a parent ref. The React documentation describes it as a constrained object that exposes a deliberate set of methods. While declarative programming describes desired UI states, imperative code issues explicit execution commands (Lesson 01). An imperative handle provides a controlled surface through which a parent issues necessary commands like `focus` to a child (Lesson 50).

```tree dir=right caption="The three arguments of useImperativeHandle and what React does with them."
`useImperativeHandle` in `MyInput`
- +1. `ref` | The parent's ref, **received as a prop**
- +2. `createHandle` | Returns **the object** the parent's ref will hold
- +3. `dependencies`, optional | Decides **when React makes a new handle** | Left out: **a new handle after every re-render**
```

### VS | `ref` on the input vs. `useImperativeHandle`: the same click, two different things in the parent's ref

Here are the two versions of `CommentInput` next to each other. Each one shows what `Post` finds in `commentRef.current` after the commit:

::: row caption="With the ref on the input, Post holds the real input element; with useImperativeHandle, Post holds an object with only focus."
::: col title="The ref on the input" tag="the whole element" tone=bad
```jsx title="CommentInput.jsx"
export default function CommentInput({ ref }) {
  return <input ~ref={ref}~ />; // commentRef.current is the input element
}
```
The parent can focus it, read its value, and change its style.
:::
::: col title="useImperativeHandle" tag="only focus" tone=good
```jsx title="CommentInput.jsx"
export default function CommentInput({ ref }) {
  const inputRef = useRef(null);
  ~useImperativeHandle~(ref, () => ({ // commentRef.current is this object
    focus() {
      inputRef.current.focus();
    },
  }), []);
  return <input ref={inputRef} />;
}
```
`Post` can call `focus`, and nothing else.
:::
:::

While both approaches deliver the identical visual result and interaction, their underlying architecture is completely different. When binding the ref directly to the input, `commentRef.current` points to the native DOM element. When using `useImperativeHandle`, it points to our custom handle object exposing only `focus`. Accessing `commentRef.current.style` evaluates to `undefined`, because the custom object defines no style property.

Furthermore, the consumer invocation in `Post` remains identical:

```jsx title="The line in Post, for both versions of CommentInput"
~commentRef.current.focus();~ // Element: the browser's focus. Handle: our focus, which calls the browser's focus
```

The consumer line remains identical because both targets supply a method named `focus`. In the handle implementation, our custom `focus` method delegates directly to the private DOM node's native `focus()` method. Naming the handle method `focus` preserves API compatibility, allowing `Post` to trigger the action without depending on the internal implementation.

### CommentInput encapsulates the input and exposes only focus

Here is the production implementation of `CommentInput` in our project. It supplies an empty dependency array `[]`, adhering to official recommendations:

```jsx title="src/components/CommentInput.jsx"
import { useRef, useImperativeHandle } from 'react';

export default function CommentInput({ ref }) {
  const inputRef = ~useRef(null)~; // CommentInput's own ref for the real input

  ~useImperativeHandle~(ref, () => ({ // Post's ref receives this object, not the input
    focus() {
      inputRef.current.focus();
    },
  }), ~[]~); // The handle uses no props or state, so every re-render keeps the same handle

  return <input ~ref={inputRef}~ placeholder="Write a comment..." />; // React puts the input into inputRef.current
}
```

The `Post` component maintains its concise one-line handler: `commentRef.current.focus()`.

The lifecycle and ref values update across five coordinated steps:
1. When the page loads, React renders `Post` and `CommentInput`, followed by the DOM commit phase.
2. During the commit phase, React populates `inputRef.current` inside `CommentInput` with the real DOM element.
3. Simultaneously, React assigns our custom handle object containing `focus` to `commentRef.current` in Post.
4. When the user clicks Comment, Post invokes our `focus` method, which calls `inputRef.current.focus()`.
5. Because the user click occurs after commit, `inputRef.current` reliably references the mounted DOM element (Lesson 31), successfully focusing the field.

```page width=text caption="With useImperativeHandle, the user clicks Comment and types Yes! right away, as before."
line: John: Lunch at noon?
line: [Comment]
card: typed=Yes! | good=typed
console: quiet
```

The handle introduces zero visual changes to the rendered document. The browser Elements panel displays the identical input element as before, free of any extraneous inline attributes:

```dom caption="The Elements panel with useImperativeHandle: the same input as before, with no style attribute."
<article>
  <p>John: Lunch at noon?</p>
  <button>Comment</button>
  + <input placeholder="Write a comment..."> | note: Still on the page; only Post's ref holds something else
</article>
```

### Direct style mutations now trigger a runtime error

Suppose the unintended opacity assignment from Principle 2 remains in `handleCommentClick`:

```jsx title="src/components/Post.jsx" startLine="7"
  function handleCommentClick() {
    commentRef.current.focus();
    ~commentRef.current.style~.opacity = 0.5; // **WRONG:** our object has no style, so this reads undefined
  }
```

**Because the imperative handle exposes only `focus`, attempting to access `style` throws an immediate runtime error.** The React documentation explicitly marks this exact failure: modifying styles fails because the underlying DOM node is encapsulated. When the user clicks Comment:
1. The first line executes `commentRef.current.focus()`, successfully placing the cursor inside the input field.
2. The second line evaluates `commentRef.current.style`. Because our handle object defines no `style` property, the expression evaluates to `undefined`.
3. Attempting to set opacity on `undefined` causes JavaScript to throw an unhandled `TypeError`.
4. The input element preserves its normal styling. Because `focus()` executed prior to the error, the cursor remains active in the field, allowing the user to type a reply normally.

```page width=text caption="With the opacity line kept, the user clicks Comment and types Yes!: the field keeps its look, and the Console shows a TypeError."
line: John: Lunch at noon?
line: [Comment]
card: typed=Yes! | good=typed
console: Uncaught TypeError: Cannot set properties of undefined (setting 'opacity')
```

That runtime error confirms that the imperative handle is enforcing its boundary. `Post` can no longer reach into or modify the internal styling of a component it does not own.

### Unexposed properties evaluate quietly to undefined

This encapsulation boundary also applies to property reads, which fail silently rather than throwing errors. Suppose `Post` previously inspected user input using `commentRef.current.value` when it held the raw DOM node. Once CommentInput transitions to an imperative handle, that read evaluates to `undefined` because the handle defines no `value` property.

No immediate exception is raised at the call site. `Post` simply receives `undefined`, and downstream logic may fail unexpectedly when processing the missing value. Whenever refactoring a child component to use `useImperativeHandle`, review parent consumers to ensure they only invoke methods explicitly declared in the handle contract.

---

## PRINCIPLE | `useImperativeHandle`: only for actions no prop can say, such as `focus`

> [!PRINCIPLE]
> **Principle 4: Props First: A Handle Holds Only What No Prop Can Say**
>
> *Put in a handle only actions that no prop can say, such as focusing, scrolling, selecting text, or starting an animation; when a prop or state can say it, use the prop.*
>
> A ref is an escape hatch, as Lessons 30 and 31 showed, and so is a handle. A method such as `open`, `close`, or `clear` turns the parent's code back into commands that someone must remember to send. A prop such as `isOpen` or `text` lets state decide what the screen shows, so no command can be forgotten.
>
> **DO THIS:**
> ```jsx
> <CommentInput ref={commentRef} ~text={text}~ onTextChange={setText} /> {/* After a send, setText('') in Post empties the field */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useImperativeHandle(ref, () => ({
>   focus() { inputRef.current.focus(); },
>   ~clear~() { inputRef.current.value = ''; }, // **WRONG:** state and the value prop can already say what the field shows
> }), []);
> ```

Once developers learn `useImperativeHandle`, they often begin treating every parent-child interaction as an imperative method. The React documentation addresses this tendency with an example involving a dialog modal:

```jsx title="Two ways for a parent to open a Modal"
~modalRef.current.open();~ // Handle: the parent sends a command, and later must send close
<Modal ~isOpen={isOpen}~ /> {/* Prop: the parent's state says whether the modal is open */}
```

Both patterns allow the parent to determine modal visibility, but their underlying architectures are fundamentally opposed:
- **With the declarative `isOpen` prop**, the parent manages visibility in state and passes it as a prop (Lessons 08 and 12). React guarantees that the rendered interface remains synchronized with state.
- **With imperative `open` and `close` methods**, the parent issues procedural commands that must be triggered at every transition point. If any code branch forgets to call `close()`, the modal remains open on screen.

The React documentation gives a clear recommendation for dialogs: it is better to take `isOpen` as a prop like `<Modal isOpen={isOpen} />` rather than exposing imperative methods.

### `clear()` vs. `setText('')`: procedural commands vs. declarative state

The same design question arises when clearing the comment field after submission. One option is adding an imperative `clear()` method to the handle alongside `focus()`. The alternative manages the comment text through declarative state:

```jsx title="Emptying the comment field with a handle method, and with state"
~commentRef.current.clear();~ // Handle: Post must remember this command after every send
~setText('');~ // State: the input shows value={text}, so React empties it on the next render
```

In the declarative state pattern, `Post` maintains a `text` state variable. It passes `text` down as a prop, along with an `onTextChange` callback that triggers on every keystroke (Lesson 23):

```jsx title="src/components/CommentInput.jsx, with the text kept in Post"
import { useRef, useImperativeHandle } from 'react';

export default function CommentInput({ ref, ~text~, onTextChange }) { // Post owns the text and passes it down
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
  }), []);

  return <input ref={inputRef} ~value={text}~ onChange={e => onTextChange(e.target.value)} placeholder="Write a comment..." />; // The field always shows what text holds in Post
}
```

This pattern constitutes a standard controlled input (Lesson 20). When `Post` calls `setText('')`, React automatically clears the input on the subsequent re-render.

While exposing a clear method might seem convenient, `clear()` and `focus()` represent fundamentally different concepts. The text displayed inside an input is visible interface state. Visible UI state belongs in component state and travels through declarative props. Focus, by contrast, represents a transient imperative action; JSX has no declarative prop that specifies current cursor placement (Lesson 31). Consequently, `focus` belongs in an imperative handle, while `clear` should remain managed through state.

```tree caption="What goes into a handle and what stays a prop."
What the parent wants from the child
- +An action no prop can say [`focus` `scrollIntoView`] | Focusing, scrolling, selecting text, **starting an animation** | **A method on the handle**
- !Something a prop can say [`clear` `open` `close`] | What the field shows, **whether a modal is open** | **A prop from state**, such as `value` or `isOpen`
```

The React documentation summarizes the rule directly. Use refs only for imperative behaviors that cannot be expressed as props, such as scrolling to a node, focusing an element, or selecting text. If an interaction can be expressed through a prop, avoid using a ref.

---

## All 4 Principles Together

### The complete post project

The entry file mounts `App` inside `<StrictMode>`:

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

`App` renders one post:

```jsx title="src/App.jsx"
import Post from './components/Post.jsx';

export default function App() {
  return <Post />;
}
```

`Post` holds the ref and the click handler:

```jsx title="src/components/Post.jsx"
import { useRef } from 'react';
import CommentInput from './CommentInput.jsx';

export default function Post() {
  const commentRef = ~useRef(null)~; // Principle 3: after the commit, holds the handle with only focus

  function handleCommentClick() {
    ~commentRef.current.focus();~ // Principles 2 and 4: only the one action no prop can say
  }

  return (
    <article>
      <p>John: Lunch at noon?</p>
      <button onClick={handleCommentClick}>Comment</button>
      <CommentInput ~ref={commentRef}~ /> {/* Principle 1: arrives in CommentInput as a prop */}
    </article>
  );
}
```

`CommentInput` keeps the input element to itself and exposes only `focus`:

```jsx title="src/components/CommentInput.jsx"
import { useRef, useImperativeHandle } from 'react';

export default function CommentInput(~{ ref }~) { // Principle 1: the ref that Post wrote on the tag
  const inputRef = useRef(null);

  ~useImperativeHandle~(ref, () => ({ // Principles 3 and 4: only focus, nothing a prop could say
    focus() {
      inputRef.current.focus();
    },
  }), []);

  return <input ref={inputRef} placeholder="Write a comment..." />;
}
```

The user clicks Comment and starts typing at once:

```page width=text caption="The finished post: the user clicks Comment and types Yes! right away."
line: John: Lunch at noon?
line: [Comment]
card: typed=Yes! | good=typed
console: quiet
```

### Component execution order and ref initialization

When the page loads, React executes the component tree in hierarchical order. During the initial render phase, both ref containers hold `null`. Once the commit phase completes, React populates each ref according to its configuration:

```tree caption="The order in which React calls the components, and what each ref holds after the commit."
`App` [1. Called first] | **Root component** | Renders `<Post />`
- +`Post` [2. Called second] | Creates **`commentRef`**, `null` during the render | After the commit: **the handle with only `focus`**
  - +`CommentInput` [3. Called third] | Creates **`inputRef`**, `null` during the render | After the commit: **the real `<input>` element**
```

| What `CommentInput` does with the ref | What `commentRef.current` holds | What the user sees after the click on Comment |
| :--- | :--- | :--- |
| **Ignores `ref`** | `null` | The button appears unresponsive, and the console records a `TypeError` |
| **Puts `ref` on the `<input>`** | The real `<input>` element | The cursor enters the field, but `Post` can also mutate styles or DOM nodes directly |
| **Calls `useImperativeHandle` with only `focus`** | An object with only `focus` | The cursor enters the field, while external property reads safely return `undefined` |
| **Adds `clear` or `open` to the handle** | An object with commands for things a prop could say | The UI functions initially, but state synchronization becomes fragile; declarative props like `text` or `isOpen` prevent missed updates |

To reiterate the central lesson: **a parent component receives only what the child explicitly exposes. Attaching the ref directly to an `<input>` gives the parent the complete DOM node. Using `useImperativeHandle` ensures the parent receives only the specific methods you choose to return.**

---

## For the Interview

> **The Interview Question:** How does a child expose a focused API to its parent through a ref?

### How to Answer Clearly in 30 Seconds

"By default, component DOM nodes are private, so a ref passed to a custom component remains `null`. In React 19, that ref arrives directly as a prop. If the child forwards the ref directly to an internal `<input>`, the parent receives the complete DOM node and can modify styles or attributes without the child's knowledge. To expose only what the parent requires, the child keeps the DOM node in a private ref and calls `useImperativeHandle` at the top level. It passes the parent ref and a factory function returning a restricted object, such as one containing only a `focus` method. React assigns that object to `ref.current` during the commit phase. Three key principles maintain this architecture:
1. **The parent syntax remains consistent**: `ref.current.focus()` executes identically on a raw DOM node or a custom handle, while unexposed properties evaluate to `undefined`.
2. **The DOM structure remains unaffected**: the underlying `<input>` renders normally in the DOM tree; only the object exposed to the parent ref changes.
3. **Prioritize declarative props**: reserve imperative handles strictly for behaviors that cannot be modeled with props, such as focusing, scrolling, or text selection, while using props like `isOpen` for modal visibility."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"How did a component receive a ref before React 19?"**
   In earlier React versions, components had to be wrapped in the `forwardRef` higher-order component, which passed the ref as a second argument after props. React 19 simplified this by passing refs directly as standard props, making `forwardRef` unnecessary for new code (Lesson 99).
2. **"Do the methods of a handle have to match DOM methods?"**
   No. The `createHandle` function can return any arbitrary object with custom method names. For example, a child component can expose a compound method like `scrollAndFocusAddComment()`. This single call coordinates scrolling and focusing across multiple internal nodes.
3. **"What happens if you leave out the dependency list?"**
   React executes `createHandle` after every re-render of the child component, assigning a newly created handle object to the parent ref each time. Providing a dependency array ensures React re-creates the handle only when tracked values change. Passing an empty array `[]` maintains a stable handle instance across re-renders when the handle depends on no props or state.

```tree dir=right caption="Interview comparison: exposing the whole DOM node vs. exposing a handle with useImperativeHandle."
The whole node vs. a handle in an interview
- !Pass `ref` on to the input [`<input ref={ref} />`] | The parent holds **the real DOM node** | The parent can **change styles or remove it**; fits **low-level inputs and buttons**
- +Return a handle [`useImperativeHandle`] | The parent holds **an object the child wrote** | The parent can call **only the chosen methods**, such as `focus`
```
