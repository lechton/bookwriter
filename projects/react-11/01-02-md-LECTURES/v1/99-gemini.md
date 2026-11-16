# Lecture 99: How Old Code Wrote Refs: String Refs, Ref Callbacks, createRef, and forwardRef

*(How did old React code reach a real `<input>` element before `useRef` existed?)*

> INTERVIEW QUESTION | LEGACY | How did refs work before hooks: createRef, callback refs, and forwardRef?

---

## VS | Today's `useRef` vs. Old Class Refs: the same job, but React puts the element in a different place

> Modern React provides `useRef` to hold direct references to rendered DOM elements. **Before Hooks existed, class components solved this using string identifiers, callback functions, or `createRef`.** React 19 removed string refs entirely. That makes migration essential when updating older codebases.

In standard JavaScript, scripts query the DOM directly using methods like `document.getElementById`. In declarative React, components describe UI through JSX, and React constructs the actual DOM nodes during its commit phase. When an application needs to manage focus or measure element sizes, React must provide access to that underlying node. Today, function components request that DOM node using `useRef` (Lesson 31). Because class components solved these same needs before Hooks, production repositories still contain older patterns. Understanding where React stores the element in each pattern is critical when maintaining or modernizing older components.

Consider a chat interface with a text field and a Send button. The user types a message and clicks Send. The text clears, and keyboard focus remains inside the field so the user can continue typing immediately. Clicking the Send button shifts browser focus away from the text input. Declarative JSX offers props for attributes like value, but provides no prop to command focus imperatively (Lesson 31). The click handler must obtain the underlying input node directly and invoke the browser `focus` method on it.

**Why:** Legacy ref patterns appear interchangeable at first glance, leading developers to attempt mechanical line-by-line translations. In reality, each approach relies on a distinct storage mechanism. React 19 throws a fatal error on string refs, unmounting the application. Copying `createRef` into a function component recreates the ref object on every render, discarding stored timer identifiers. Safe refactorings require understanding how React stores and updates the referenced node in each version.

### The Same Job, Four Ways

Start from what you know. Here is the same task in plain JavaScript and in modern React:

```jsx title="Plain JavaScript and today's React"
document.~getElementById('message')~.focus(); // Plain JavaScript: you grab the element yourself
~inputRef.current~.focus(); // Today's React: React put the element into the ref for you
```

The second line works because the JSX assigns `<input ref={inputRef} />`. Older class code expressed that `ref` in several different ways. Here is the same message field written in the four patterns encountered in real codebases:

```jsx title="Four ways to ask React for the same input element"
<input ~ref="input"~ /> {/* 1. A string: the handler reads this.refs.input */}
<input ~ref={el => { this.input = el; }}~ /> {/* 2. A function: the handler reads this.input */}
<input ~ref={this.inputRef}~ /> {/* 3. An object from createRef: the handler reads this.inputRef.current */}
<input ~ref={inputRef}~ /> {/* 4. An object from useRef: the handler reads inputRef.current */}
```

From the perspective of user interaction in React 18, each approach produces the identical result: focus returns to the input field after sending.

Under the hood, React processes each pattern differently because each assigns the DOM element to a different destination:
1. **A string identifier.** Writing `ref="input"` instructs React to store the DOM node on the class instance inside `this.refs.input`. React 19 dropped support for this pattern.
2. **A callback function.** React executes the provided function and passes the DOM node as an argument, allowing custom logic to store it on `this.input`.
3. **An object from `createRef`.** React assigns the DOM node directly to the `current` property of the created ref object.
4. **An object from `useRef`.** React assigns the DOM node to the `current` property of a persistent ref object managed across renders.

```tree caption="Four ways to give the same input element to a ref, and where React puts the element each time."
Where each way of writing a ref keeps the `<input>` element
- !A string [`ref="input"`] | React keeps it **under a name** in `this.refs` | **Removed** in React 19
- +A function [`ref={el => ...}`] | React **calls your function** with the element | Your code keeps it in **`this.input`**
- +An object from `createRef` [`ref={this.inputRef}`] | React **fills `current`** of an object the class keeps | Made **once per instance** in a class
- +An object from `useRef` [`ref={inputRef}`] | React **fills `current`** of an object React keeps | The way of **function components today**
```

Objects returned by `createRef` and `useRef` share an identical shape: a plain object with a single current property set to null. In a class component, initializing `createRef` as an instance property runs only once when the instance mounts. In contrast, invoking `createRef` inside a function component body creates a fresh object during every render cycle. That difference represents one of the most frequent mistakes made during component migration.

> [!DEFINITION]
> **What is a ref?** [REVIEW] A ref is a persistent container holding a mutable value across renders without triggering a re-render when changed. In function components, `useRef(null)` returns `{ current: null }`.
> When assigned to a JSX element like `<input ref={inputRef} />`, React sets `inputRef.current` to the corresponding browser DOM element during the commit phase.
> The stored reference allows imperative DOM interactions, such as calling `inputRef.current.focus()` directly (Lesson 31).

> [!DEFINITION]
> **What is a class component, and what is its instance?** [REVIEW] Before Hooks, components were defined as ES6 classes: `class MessageForm extends Component`. Mounting the component creates a distinct instance of that class in memory.
> Component methods access this instance using the `this` keyword. Component state resides in `this.state` and updates via `this.setState`.
> Custom properties attached to the instance, such as `this.input`, persist across re-renders for the full lifetime of the component (Lesson 96).

### The Rule of Thumb: where does React put the element?

**When reading older ref code, identify where React stores the referenced element. Then translate that storage to modern function component conventions: `useRef` for host elements, or `ref` passed as a standard prop.**

You encounter these patterns across three primary component boundaries:
1. **Inside class components.** String refs are removed in React 19. Callback refs remain supported. The `createRef` function continues to exist as a Legacy React API.
2. **Inside function components.** The modern standard is `useRef`. Callback refs remain useful for dynamic collections and element measurement (Lessons 31 and 86).
3. **Across custom component boundaries.** Older code relied on `forwardRef` in React 18 and earlier. React 19 accepts `ref` as an ordinary prop on function components (Lesson 85).

```tree caption="Where each way of writing a ref lives today: in class components, in function components, and on your own components."
Ways of writing a ref that you meet in real code
- +In a class component [`ref="input"` `ref={el => ...}` `createRef`] | The string is **removed** in React 19 | The function and `createRef` **still work**
- +In a function component [`useRef` `ref={el => ...}`] | `useRef` is **the way of today** | A function still works for special cases
- +On your own component [`forwardRef` `ref` as a prop] | `forwardRef` belongs to **React 18 and earlier** | React 19 passes `ref` **as an ordinary prop**
```

This lesson focuses on identifying legacy ref patterns and translating them into idiomatic modern React. The goal is reading and modernizing existing code, not introducing legacy patterns into new features.

## SECTION | A Chat Field with a Send Button

Our example page displays a chat message input accompanied by a Send button.

```page caption="The chat field when the page opens: an empty message field and a Send button."
card: input=Write a message...
line: [Send]
```

When the user enters text and clicks Send, the application must fulfill two requirements:
1. The text field must clear its contents.
2. Keyboard focus must remain in the field so the user can immediately type another message.

```page caption="After the user types Hi and clicks Send: the field is empty, and the cursor is still in it."
card: typed= | good=typed
line: [Send]
```

Here is the baseline implementation written as an older class component before adding refs:

```jsx title="src/MessageForm.jsx"
import { Component } from 'react';

export default class MessageForm extends Component {
  state = { text: '' };

  handleChange = (e) => {
    this.setState({ text: e.target.value });
  };

  handleSend = () => {
    ~this.setState({ text: '' })~; // The easy part: the field empties
  };

  render() {
    return (
      <div>
        <input
          value={this.state.text}
          onChange={this.handleChange}
          placeholder="Write a message..."
        />
        <button onClick={this.handleSend}>Send</button>
      </div>
    );
  }
}
```

Clearing the text field is straightforward. Updating state to an empty string causes React to re-render the controlled input with an empty value (Lesson 20).

Managing keyboard focus requires imperative control. The handler must acquire a reference to the real DOM node, and each principle below accesses that node differently.

The chat form implementation evolves across three distinct architectures:
1. In Principles 1 through 3, the entire component resides in a single class file named `MessageForm.jsx`.
2. In Principle 4, `MessageForm` converts into a modern function component.
3. In Principles 5 and 6, the input element extracts into `MessageInput.jsx` for reuse across multiple views, wrapped by a higher-order component named `withTracking`.

The example omits network communication and message history to focus strictly on DOM node access and focus management.

```files title="chat-field: File Explorer" caption="The files of the chat field at the end of the lesson, inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `MessageForm` from `./MessageForm.jsx` and mounts it inside `<StrictMode>`
  MessageForm.jsx | parent | Exports `MessageForm` as default, holds `text` in state, and imports `MessageInput` and `withTracking`
  MessageInput.jsx | child | Exports `MessageInput` as default and renders the `<input>`, from Principle 5 on
  withTracking.jsx | wrapper | Exports `withTracking`, which wraps a component, from Principle 6 on
```

**PRINCIPLES:** Every ref pattern establishes a specific storage location for the underlying node. Six architectural principles follow:
1. **String refs: React 19 removed `ref="input"`.** Unhandled string refs crash rendering, requiring migration to callback refs or `createRef`.
2. **Ref callbacks: React calls your function with the element, and later with `null`.** Creating inline callbacks on each render triggers detach and attach calls on every keystroke.
3. **`createRef` in a class: one object per instance.** React populates the `current` property during the commit phase of the render.
4. **`createRef` in a function: a new object on every render.** Focus commands may appear functional, but non-DOM values like interval timers reset on each render.
5. **A ref on a class component holds the instance.** The parent receives the mounted class instance and can invoke its methods directly.
6. **`forwardRef`: every component on the way must pass the ref on.** React 19 treats `ref` as a standard prop, eliminating the need for `forwardRef`.

---

## PRINCIPLE | `ref="input"`: React 19 no longer reads the string, and the page goes blank

> [!PRINCIPLE]
> **Principle 1: String Refs: React 19 Removed `ref="input"` and `this.refs`**
>
> *In legacy class components, assigning a string to `ref` directed React to store the DOM element inside `this.refs`; React 19 removed string refs entirely, requiring conversion to callback refs or `createRef`.*
>
> In React 18, string refs remain operational, successfully restoring focus after sending. React 19 refuses to process string refs and terminates rendering with an unhandled exception, causing the component tree to unmount. Modernize legacy codebases by running the React 19 codemod or manually replacing string refs with callback refs or `createRef`.
>
> **DO THIS:**
> ```jsx
> inputRef = createRef();
> handleSend = () => {
>   ~this.inputRef.current~.focus(); // React 19 fills the object, so the cursor comes back
> };
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> handleSend = () => {
>   ~this.refs.input~.focus(); // **WRONG:** React 19 removed string refs, and the page goes blank
> };
> ```

In the earliest class components, developers assigned a plain string identifier to the `ref` prop:

```jsx title="A string ref in a class"
<input ~ref="input"~ /> {/* You write only a name */}
~this.refs.input~.focus(); // React kept the element under that name
```

This syntax is known as a **string ref**. You supplied an arbitrary text name, and React handled element tracking behind the scenes.

Your application code never initialized `this.refs`. In React 18 and earlier versions, React automatically attached a plain JavaScript dictionary to each class instance. When mounting the input element, React stored a direct reference to the rendered DOM node at `this.refs.input`. The click handler accessed that property to invoke native browser methods.

Here is the chat field implementation utilizing a string ref:

```jsx title="src/MessageForm.jsx"
import { Component } from 'react';

export default class MessageForm extends Component {
  state = { text: '' };

  handleChange = (e) => {
    this.setState({ text: e.target.value });
  };

  handleSend = () => {
    this.setState({ text: '' }); // The field empties
    ~this.refs.input~.focus(); // The cursor goes back into the field
  };

  render() {
    return (
      <div>
        <input
          ~ref="input"~ // React keeps this input under the name input
          value={this.state.text}
          onChange={this.handleChange}
          placeholder="Write a message..."
        />
        <button onClick={this.handleSend}>Send</button>
      </div>
    );
  }
}
```

In React 18 and earlier, this code functions as intended. The user enters a message:

```page caption="With a string ref in React 18: the user types Hi into the message field."
card: typed=Hi
line: [Send]
```

Clicking Send clears the field, and cursor focus promptly returns to the input:

```page caption="With a string ref in React 18: after Send, the field is empty and the cursor is in it."
card: typed= | good=typed
line: [Send]
```

### React 19 removed string refs

React initially deprecated string refs in React 16.3. String refs forced React to track the currently executing component instance continuously. That dependency introduced performance overhead, created naming conflicts, and hindered internal compiler optimizations. React 19 dropped support for string refs completely.

**Beware! In React 19, retaining a string ref does not simply fail to focus. The entire component tree crashes during render.** Here is the runtime sequence during the initial render:
1. React parses the JSX and encounters a string assigned to the `ref` prop.
2. React 19 validates refs against supported types: functions, ref objects, or nullish values. Finding a string, React halts rendering and throws an exception.
3. If no Error Boundary wraps the tree, React unmounts all rendered markup, leaving a completely blank screen.

```page caption="With a string ref in React 19: the page is blank when it opens, and the Console shows why."
blank
console: Uncaught Error: Expected ref to be a function, an object returned by React.createRef(), or undefined/null.
  warn: An error occurred in the <input> component.
```

The official React upgrade tooling provides an automated codemod to migrate these assignments. The codemod scans your files and converts string refs into callback refs:

```bash title="Terminal"
npx codemod@latest react/19/replace-string-ref
```

The React release notes also specify `createRef` as a direct alternative for class components. Both replacements are fully valid. Principle 2 examines callback refs, and Principle 3 details `createRef`.

A common misconception treats `ref="input"` and `ref={inputRef}` as superficial syntax differences. They operate on entirely different runtime models. A string ref relied on React managing an internal instance dictionary that no longer exists in React 19. Passing a ref object provides an explicit container that your code controls and React populates safely.

---

## PRINCIPLE | Ref callback: React calls your function with the element, and later with `null`

> [!PRINCIPLE]
> **Principle 2: Ref Callbacks: React Calls the Function with the Element and with `null`**
>
> *Passing a function to `ref` creates a ref callback; React invokes it with the DOM element upon mounting and with `null` upon unmounting, and defining inline callbacks causes detach and attach calls on every render.*
>
> The upgrade tooling replaces string refs with callback functions that assign the DOM element directly to an instance property. The user experience remains seamless. However, an inline arrow function declared inside the render method creates a new function reference on every keystroke, forcing React to detach the old callback with null and attach the new one with the DOM element. Store the callback as a stable class method and verify the element exists before using it.
>
> **DO THIS:**
> ```jsx
> setInput = (el) => {
>   this.input = el;
>   if (~el~) el.focus(); // Skips the call with null
> };
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <input ref={el => { this.input = el; ~el.focus()~; }} /> // **WRONG:** throws a TypeError when React calls it with null
> ```

The official upgrade guide replaces string refs with functions passed to the `ref` prop:

```jsx title="A string ref and a ref callback on the same input"
<input ~ref="input"~ /> {/* Before: the handler reads this.refs.input */}
<input ~ref={el => { this.input = el; }}~ /> {/* After: the handler reads this.input */}
```

Both implementations return focus to the text field after sending. Under the hood, their mechanics diverge. With a string ref, React retained the node inside its own dictionary. With a callback ref, React delegates storage entirely to your function. React supplies the DOM node, and your callback determines where to save it.

Assigning a function to the `ref` attribute registers a **ref callback** (Lessons 31 and 86). React executes this callback at two distinct lifecycle events:
- **When the DOM element mounts into the document**, React calls the callback with the underlying DOM node.
- **When the DOM element unmounts from the document**, React calls the callback with `null` to clear the reference.

In a class component, the callback often assigns the node to an instance property. Because the arrow function executes in the scope of the class, `this` refers to the component instance (Lesson 96). Executing `this.input = el` attaches the DOM node directly to the instance, where `handleSend` reads it.

### The chat field with a ref callback

We update `MessageForm.jsx` by swapping the string ref for a ref callback. We also log each invocation to inspect when React calls the function:

```jsx title="src/MessageForm.jsx"
import { Component } from 'react';

export default class MessageForm extends Component {
  state = { text: '' };

  handleChange = (e) => {
    this.setState({ text: e.target.value });
  };

  handleSend = () => {
    this.setState({ text: '' });
    ~this.input~.focus(); // Reads the element your callback saved
  };

  render() {
    return (
      <div>
        <input
          ref={~el => {~ // React calls this function with the element, or with null
            console.log(el);
            this.input = el;
          }}
          value={this.state.text}
          onChange={this.handleChange}
          placeholder="Write a message..."
        />
        <button onClick={this.handleSend}>Send</button>
      </div>
    );
  }
}
```

The user experience remains unchanged: after clicking Send, the input clears and cursor focus stays in the field.

### The callback runs again after every keystroke

**Beware! An inline callback does not execute merely once on mount. It runs twice on every single keystroke, even when the input element never leaves the page.**

When mounting in development mode, the browser console prints three distinct logs. React attaches the ref with the DOM node. Next, `<StrictMode>` temporarily unmounts and remounts the component to ensure cleanup logic behaves deterministically, logging `null` followed by the DOM node (Lesson 47):

```page caption="When the page opens in development, the Console shows the input element, then null, then the input element again."
card: input=Write a message...
line: [Send]
log: <input placeholder="Write a message..." value=""> | MessageForm.jsx:20
log: null | MessageForm.jsx:20
log: <input placeholder="Write a message..." value=""> | MessageForm.jsx:20
```

Clearing the console and typing a single character reveals two immediate log entries:

```page caption="After the user types H, the Console shows null and then the input element."
card: typed=H
line: [Send]
log: null | MessageForm.jsx:20
log: <input placeholder="Write a message..." value="H"> | MessageForm.jsx:20
```

Here is the exact runtime sequence that causes those two invocations:
1. Typing a character triggers `onChange`, which calls `this.setState` and schedules a component re-render.
2. The `render` method executes and instantiates a brand new arrow function in memory.
3. During reconciliation, React compares the previous ref prop with the new ref prop. Because their function references differ, React detaches the old callback by calling it with `null`.
4. React immediately attaches the new callback by calling it with the current DOM node.
5. `this.input` receives the DOM node once again, allowing the Send button to restore focus.

The React documentation highlights this behavior. Passing an inline function creates a new reference on every render, prompting React to clear the old ref before applying the new one.

### VS | A callback written in `render` vs. a callback kept as a class field: one is new on every render

To eliminate unnecessary detach and attach cycles, store the callback as a stable class field. Class field arrows initialize once during instance creation and maintain identical references across renders:

```jsx title="A ref callback created once, as a class field"
class MessageForm extends Component {
  ~setInput~ = (el) => { // Created once, when React creates the instance
    this.input = el;
  };

  render() {
    return <input ref={~this.setInput~} />; // The same function on every render
  }
}
```

Both approaches store the DOM element in `this.input`, so the Send button functions identically in either case. The difference lies in runtime efficiency and console output. An inline function triggers two callback executions per keystroke. A stable class method triggers the callback only when the input actually mounts or unmounts.

```tree caption="A ref callback written inside render vs. a ref callback kept as a class field."
Where the ref callback is created
- +Written inside `render` [`ref={el => ...}`] | A **new function** on every render | React calls it with **`null`, then with the element**, after every keystroke
- +Kept as a class field [`ref={this.setInput}`] | The **same function** on every render | React calls it **only on attach and detach**
```

### A callback that calls focus on `null`

A frequent implementation error occurs when attempting to focus the input immediately upon mounting by invoking `focus` directly inside the callback:

```jsx title="src/MessageForm.jsx" startLine="18"
        <input
          ref={el => {
            this.input = el;
            ~el.focus()~; // **WRONG:** React also calls this with null, and null has no focus method
          }}
```

React always calls ref callbacks with `null` when detaching the ref. Attempting to call `focus` on null throws an unhandled `TypeError`. Without an Error Boundary, React unmounts the component tree. When this error manifests depends on your environment:
- **In development**, `<StrictMode>` unmounts and remounts components on load, crashing the page immediately on startup.
- **In production**, the initial mount succeeds and places focus correctly. However, typing the first character triggers a re-render, creating a new inline arrow and provoking a detach call with `null`. The page crashes mid-typing.

In development, the browser console prints two successive errors: the first during StrictMode unmount, and the second when React tears down the crashed component tree:

```page caption="With focus called on the element without a check, in development: the page is blank as soon as it opens."
blank
console: Uncaught TypeError: Cannot read properties of null (reading 'focus')
  warn: An error occurred in the <input> component.
  error: Uncaught TypeError: Cannot read properties of null (reading 'focus')
  warn: An error occurred in the <input> component.
```

The correct pattern guards element access with a conditional check. Because React passes `null` during cleanup, verifying that `el` is truthy prevents exceptions during unmount and re-render cycles:

```jsx title="src/MessageForm.jsx" startLine="18"
        <input
          ref={el => {
            this.input = el;
            if (~el~) el.focus(); // Skips the call with null
          }}
```

Four further architectural details regarding callback refs frequently appear in technical interviews:
1. **React 19 supports ref cleanup functions.** Ref callbacks in React 19 can return an explicit cleanup function. When provided, React invokes that cleanup function upon unmount instead of passing `null` to the callback (Lesson 86).
2. **Implicit returns cause TypeScript errors.** The shorthand arrow `ref={el => this.input = el}` implicitly returns the assigned value. React 19 expects ref callbacks to return either nothing or a cleanup function, so always wrap the assignment in explicit braces (Lesson 86).
3. **Strict Mode tests ref teardown in development.** Strict Mode simulates an immediate unmount and remount cycle upon initial load to ensure cleanup handlers function properly (Lesson 47).
4. **Callback refs support dynamic lists.** Because the Rules of Hooks prohibit calling `useRef` inside loops, managing DOM nodes across dynamic lists relies on callback refs to populate an array or map.

---

## PRINCIPLE | `createRef` in a class: one ref object for each instance

> [!PRINCIPLE]
> **Principle 3: `createRef`: One Ref Object for Each Class Instance**
>
> *In class components, declaring `inputRef = createRef()` as an instance property creates a single `{ current: null }` container per instance; passing `ref={this.inputRef}` directs React to populate `this.inputRef.current`.*
>
> The `createRef` utility supplies class components with the same object structure that `useRef` provides to function components. Declaring it as a class property executes once during instance creation, preserving the container across all re-renders. The referenced DOM node resides inside `current`, never on the container object itself. Modern function components achieve the identical behavior using `useRef`.
>
> **DO THIS:**
> ```jsx
> handleSend = () => {
>   ~this.inputRef.current~.focus(); // React put the input element into current
> };
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> handleSend = () => {
>   ~this.inputRef.focus()~; // **WRONG:** the element sits in this.inputRef.current, so this throws a TypeError
> };
> ```

The primary alternative to callback refs in class components is `createRef`. Provided by the core React package, `createRef` is imported alongside `Component`. It accepts no arguments and returns a plain JavaScript object with a single `current` property initialized to `null`:

```jsx title="What createRef returns"
const inputRef = ~createRef()~; // { current: null }
```

That encapsulates its entire implementation. The resulting object is structurally identical to writing `{ current: null }` manually. It matches the exact shape returned by `useRef` in modern function components (Lesson 30). When attached to a JSX tag, React populates `current` with the underlying DOM node during the commit phase (Lesson 31).

In a class component, the timing of object creation is essential. Declaring it as a class field ensures it executes only once:

```jsx title="createRef in a class"
class MessageForm extends Component {
  ~inputRef = createRef();~ // Runs once, when React creates the instance

  handleSend = () => {
    this.inputRef.current.focus(); // React put the input element into current
  };

  render() {
    return <input ~ref={this.inputRef}~ />; // React fills this.inputRef.current with the element
  }
}
```

A class field initializes when React constructs the component instance. The resulting container remains attached to the instance for the entire lifespan of the component.

### The chat field with `createRef`

We update `MessageForm.jsx` by adopting `createRef`:

```jsx title="src/MessageForm.jsx"
import { Component, ~createRef~ } from 'react'; // createRef comes from react, like Component

export default class MessageForm extends Component {
  state = { text: '' };
  ~inputRef = createRef();~ // One object for this instance

  handleChange = (e) => {
    this.setState({ text: e.target.value });
  };

  handleSend = () => {
    this.setState({ text: '' });
    ~this.inputRef.current~.focus(); // The element React put into current
  };

  render() {
    return (
      <div>
        <input
          ref={this.inputRef}
          value={this.state.text}
          onChange={this.handleChange}
          placeholder="Write a message..."
        />
        <button onClick={this.handleSend}>Send</button>
      </div>
    );
  }
}
```

The application continues to behave as expected. After clicking Send, the input clears and focus returns to the field.

### VS | A ref callback vs. `createRef` in the same class: React calls the first and fills the second

Both alternatives reliably access the input element, providing identical behavior to the user. The distinction lies in how React interacts with the reference. React executes a callback ref. React mutates a `createRef` object.

```tree caption="A ref callback and a createRef object in the same class: React calls the first and fills the second."
Two ways a class gets the `<input>` element
- +A ref callback [`ref={this.setInput}`] | React **calls your function** with the element | Your function keeps it in **`this.input`**
- +A `createRef` object [`ref={this.inputRef}`] | React **fills `current`** with the element | The handler reads **`this.inputRef.current`**
```

Legacy codebases also initialize `createRef` inside the constructor. The official React documentation on class components frequently demonstrates this convention:

```jsx title="createRef as a class field and inside the constructor"
class MessageForm extends Component {
  ~inputRef = createRef();~ // As a class field
}

class MessageForm extends Component {
  constructor(props) {
    super(props);
    ~this.inputRef = React.createRef();~ // Inside the constructor, through the React object
  }
}
```

Both notations achieve identical outcomes. Each initializes a ref container once during instance construction and attaches it to the instance.

### VS | `createRef` in a class vs. `useRef` in a function: the instance keeps one object, React keeps the other

When converting a class component into a function component, the class property becomes a `useRef` call. Every instance reference `this.inputRef.current` simplifies to `inputRef.current`:

```jsx title="The same ref in a class and in a function component"
~inputRef = createRef();~ // In the class: one object, kept by the instance
const inputRef = ~useRef(null)~; // In the function: one object, kept by React
```

Both patterns provide a stable `{ current }` container throughout the component lifecycle, and React updates `current` with the mounted element. The distinction centers on who owns the container between renders. The class instance retains the `createRef` object. React internally retains the `useRef` object. Official migration guidelines instruct developers to replace calls to `createRef` with calls to `useRef`.

The official documentation classifies `createRef` as a Legacy React API. While React continues to export `createRef` for backwards compatibility, modern development discourages its use in new code in favor of function components and `useRef`.

---

## PRINCIPLE | `createRef` in a function: a new object on every render, so use `useRef`

> [!PRINCIPLE]
> **Principle 4: Migration: `createRef` in a Function Body Loses Its Value on Every Render**
>
> *Calling `createRef()` inside a function component body generates a fresh `{ current: null }` object on every render; replace it with `useRef(null)`, which returns the identical object across all renders.*
>
> A direct line-by-line migration often preserves createRef inside the function body. DOM focus commands may continue to work because React reassigns host element refs during every commit phase. However, any custom value written to current, such as an interval timer identifier, is erased on the subsequent render. Modern function components rely on useRef to preserve a stable container throughout the component lifecycle.
>
> **DO THIS:**
> ```jsx
> function MessageForm() {
>   const timerRef = ~useRef(null)~; // The same object on every render: Send stops the timer
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function MessageForm() {
>   const timerRef = ~createRef()~; // **WRONG:** a new object on every render: the timer ID is lost
> }
> ```

When manually converting classes to functions, developers frequently copy `createRef` declarations directly into the function body:

```jsx title="createRef and useRef inside a function component"
const inputRef = ~createRef()~; // A brand-new { current: null } on every render
const inputRef = ~useRef(null)~; // The same object on every render
```

Both declarations appear similar in syntax and may seem to behave identically in simple tests. However, their underlying behavior is fundamentally different. React documentation specifies that `createRef` always produces a brand new object, whereas `useRef` consistently returns the identical object across renders.

This difference stems from component execution models. A function component re-executes its entire body on every render (Lesson 12). In a class, field initializers run only once during instance creation. In a function body, invoking `createRef()` executes on every render cycle, constructing an isolated object each time and abandoning the previous instance. In contrast, `useRef` instructs React to maintain a persistent container across renders.

### The chat field as a function with `createRef`

Here is our chat field after a mechanical conversion that retained `createRef` in the function body:

```jsx title="src/MessageForm.jsx"
import { createRef, useState } from 'react';

export default function MessageForm() {
  const [text, setText] = useState('');
  const inputRef = ~createRef()~; // **WRONG:** a new object on every render

  function handleSend() {
    setText('');
    inputRef.current.focus();
  }

  return (
    <div>
      <input
        ref={inputRef}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

When testing this component, typing text and clicking Send successfully clears the field and restores cursor focus. The conversion appears complete. Here is why focus continues to function despite the flaw:
1. Typing a character triggers `setText`, which schedules a re-render of `MessageForm`.
2. The function body executes again, and `createRef()` produces a fresh ref object with its current field reset to `null`.
3. During the commit phase, React attaches the rendered DOM node to this newly generated object (Lesson 13).
4. Clicking Send invokes the handler from the most recent render, which accesses that latest ref object containing the DOM element.

Because React reassigns host element refs during each commit phase, the bug remains invisible when managing simple DOM nodes. The underlying defect surfaces the moment application code stores arbitrary values inside `current`.

### A draft timer that never stops

Modern messaging applications frequently save drafts in the background at regular intervals while typing. We enhance the chat component to illustrate this scenario. The component initiates a timer on the first keystroke and clears it when Send is clicked. To keep the example concise, the timer logs a message to the console. The timer identifier is stored inside a second ref (Lesson 30):

```jsx title="src/MessageForm.jsx"
import { createRef, useState } from 'react';

export default function MessageForm() {
  const [text, setText] = useState('');
  const inputRef = createRef();
  const timerRef = ~createRef()~; // **WRONG:** a new object with current set to null on every render

  function handleChange(e) {
    setText(e.target.value);
    if (timerRef.current === null) {
      timerRef.current = setInterval(() => console.log('Draft saved'), 5000);
    }
  }

  function handleSend() {
    ~clearInterval(timerRef.current)~; // **WRONG:** receives null, so no timer stops
    timerRef.current = null;
    setText('');
    inputRef.current.focus();
  }

  return (
    <div>
      <input
        ref={inputRef}
        value={text}
        onChange={handleChange}
        placeholder="Write a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

**Beware! When using `createRef`, every keystroke initiates a brand new timer, and clicking Send fails to cancel any of them.** Here is the runtime sequence when typing a message and clicking Send:
1. Typing the first character triggers the input handler. Finding `null` in `timerRef.current`, it starts an interval and saves the timer ID inside the current render ref object.
2. The state update triggers a re-render. Calling `createRef()` returns a fresh object where the current field resets to `null`. The previous timer ID remains trapped in the abandoned ref object.
3. Typing a second character re-executes the handler. Because `timerRef.current` is `null` again, the code starts a second background timer.
4. Clicking Send invokes the handler from the latest render, which passes `null` to `clearInterval`.
5. Both timers continue executing indefinitely in the background.

Shortly after sending the message, the text field is empty, but the console logs multiple draft save notices every five seconds:

```page caption="A few seconds after the user types Hi and clicks Send, with createRef: two timers still print Draft saved."
card: typed= | good=typed
line: [Send]
log: Draft saved | MessageForm.jsx:11
log: Draft saved | MessageForm.jsx:11
```

The component now performs unintended background work. Even though the message was sent and the input cleared, abandoned timers consume resources and attempt to save non-existent drafts.

### The fix: `useRef` keeps one object

The resolution replaces both `createRef()` declarations with `useRef(null)`:

```jsx title="src/MessageForm.jsx" startLine="1"
import { ~useRef~, useState } from 'react'; // useRef replaces createRef

export default function MessageForm() {
  const [text, setText] = useState('');
  const inputRef = ~useRef(null)~; // The same object on every render
  const timerRef = ~useRef(null)~; // Keeps the timer ID between renders
```

Retesting the flow demonstrates correct lifecycle behavior:
1. The initial keystroke launches one background timer and stores its identifier in `timerRef.current`.
2. Subsequent keystrokes inspect the persistent ref, find the existing timer identifier, and avoid creating duplicate intervals.
3. Clicking Send provides the active timer identifier to `clearInterval`, stopping the timer cleanly.

```page caption="A few seconds after the user types Hi and clicks Send, with useRef: the timer has stopped, and the Console stays quiet."
card: typed= | good=typed
line: [Send]
console: quiet
```

```tree caption="createRef in a function body vs. useRef: a new object on every render vs. one object kept by React."
`createRef` vs. `useRef` inside a function component
- !`createRef` in the body [`const timerRef = createRef`] | A **new `{ current: null }`** on every render | The timer ID is **lost** on the next render, so `Send` **stops no timer**
- +`useRef` [`const timerRef = useRef`] | **React keeps one object** for the component | The timer ID **survives** every render, so `Send` **stops the timer**
```

The migration rule is straightforward. React documentation compares refs to instance fields. An instance property `this.value` in a class translates to `valueRef.current` in a function. An instance field initialized with `createRef` maps to `useRef(null)`, never to a raw createRef call inside the function body.

---

## PRINCIPLE | `ref` on a class component: `current` holds the instance, not an element

> [!PRINCIPLE]
> **Principle 5: Refs to Classes: `current` Holds the Component Instance**
>
> *Attaching `ref` to a class component causes React to assign the mounted component instance to `ref.current`, allowing the parent to call instance methods; function components achieve this by forwarding the ref or using `useImperativeHandle`.*
>
> Placing a ref on a host element captures the underlying DOM node, whereas placing a ref on a class component captures the class instance itself. Calling focus on that ref executes your custom class method rather than the native browser method. If the class component is rewritten as a plain function that ignores ref, current remains null, causing subsequent method calls to throw a TypeError.
>
> **DO THIS:**
> ```jsx
> function MessageInput({ ref, ...props }) {
>   return <input ~ref={ref}~ {...props} />; // The parent's ref reaches the input element
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function MessageInput(~{ value, onChange }~) { // **WRONG:** drops ref, so the parent's current stays null
>   return <input value={value} onChange={onChange} />;
> }
> ```

In the preceding examples, the ref attached directly to a native `<input>` element. Legacy codebases frequently attach refs to custom class components as well. Imagine the input field extracted into its own class named `MessageInput` that exposes a custom `focus` method:

```jsx title="A ref on the input tag and a ref on the MessageInput class"
<input ~ref={this.inputRef}~ /> {/* current holds the input element */}
<MessageInput ~ref={this.inputRef}~ /> {/* current holds the MessageInput instance */}
```

In both scenarios, the handler executes `this.inputRef.current.focus()` and successfully focuses the input field. While the syntax and outcome appear identical, the underlying target differs completely:
- **When attached to a built-in `<input>` tag**, the current field holds the browser DOM element, and `focus` is the browser native method.
- **When attached to a custom `MessageInput` component**, the current field holds the mounted class instance, and `focus` is a custom method authored on that class.

The **component instance** represents the object created by React when instantiating a class component (Lesson 96). When a ref targets a class component, React populates the ref with that instance. This enables parent components to invoke arbitrary methods declared on the child component.

### The `<input>` moves into its own file

Because chat inputs often share common formatting across an application, the element moves into its own component. `MessageInput` manages its own internal DOM node using a callback ref and exposes a public `focus` method for parents:

```jsx title="src/MessageInput.jsx"
import { Component } from 'react';

export default class MessageInput extends Component {
  ~focus~() { // Your own method: the parent calls it through the ref
    this.input.focus();
  }

  render() {
    return (
      <input
        ref={el => { this.input = el; }}
        value={this.props.value}
        onChange={this.props.onChange}
        placeholder="Write a message..."
      />
    );
  }
}
```

`MessageForm` remains a class component. It imports `MessageInput` and assigns its `createRef` object to that custom tag:

```jsx title="src/MessageForm.jsx"
import { Component, createRef } from 'react';
import MessageInput from './MessageInput.jsx';

export default class MessageForm extends Component {
  state = { text: '' };
  inputRef = createRef();

  handleChange = (e) => {
    this.setState({ text: e.target.value });
  };

  handleSend = () => {
    this.setState({ text: '' });
    this.inputRef.current.~focus()~; // Runs the focus method of MessageInput
  };

  render() {
    return (
      <div>
        <MessageInput
          ~ref={this.inputRef}~ // React puts the MessageInput instance into current
          value={this.state.text}
          onChange={this.handleChange}
        />
        <button onClick={this.handleSend}>Send</button>
      </div>
    );
  }
}
```

React populates `this.inputRef.current` across three steps:
1. React instantiates the `MessageInput` class component during rendering.
2. Observing the `ref` prop on a class component tag, React assigns the created class instance to `this.inputRef.current` instead of a DOM element.
3. When Send is clicked, the parent handler calls `focus` on that instance, which in turn calls the native browser `focus` method on the internal DOM node.

The rendered user interface remains unchanged. The browser inspection tools reveal only standard DOM elements, because component instances exist purely in JavaScript memory.

### What a ref holds depends on the tag

The same ref assignment points to three distinct values depending on the type of tag it decorates:

```tree caption="What ref.current holds on a built-in tag, on a class component, and on a function component that ignores ref."
What `this.inputRef.current` holds
- +On a built-in tag [`<input ref={this.inputRef} />`] | React puts the **element** into `current` | `focus` is the **browser's method**
- +On a class component [`<MessageInput ref={this.inputRef} />`] | React puts the **component instance** into `current` | `focus` is **your method**
- !On a function component that ignores `ref` [`<MessageInput ref={this.inputRef} />`] | React has **nothing to put** into `current` | `current` stays **`null`**
```

### The class becomes a function, and the call fails

A critical bug frequently emerges during migration when converting `MessageInput` into a basic function component:

```jsx title="src/MessageInput.jsx"
export default function ~MessageInput~({ value, onChange }) { // **WRONG:** ignores ref and has no focus method
  return <input value={value} onChange={onChange} placeholder="Write a message..." />;
}
```

The parent continues passing its ref to `MessageInput` and expects to invoke `focus` through it. The text field renders correctly and accepts user input. However, clicking Send triggers an error:
1. The function component does not forward or attach the ref to any underlying DOM element, giving React nothing to assign.
2. `this.inputRef.current` remains `null`.
3. The parent handler attempts to invoke `focus` on null, throwing an unhandled `TypeError`.

The field clears because the state update preceded the method call, but focus is never restored:

```page caption="After the class MessageInput becomes a function that ignores ref, the user types Hi and clicks Send."
card: input=Write a message... | bad=input
line: [Send]
console: Uncaught TypeError: Cannot read properties of null (reading 'focus')
```

Two solutions resolve this issue, based on patterns from earlier lessons:
- **Forward the `ref` to the underlying host element.** In React 19, the function component receives `ref` as a prop and assigns it directly to `<input ref={ref} />` (Lesson 85). The parent ref then holds the actual DOM node.
- **Expose a controlled imperative API via `useImperativeHandle`.** When the parent must not access the raw DOM element, `useImperativeHandle` limits the exposed methods to an explicit public interface (Lesson 50).

Two additional architectural rules regarding class refs are relevant during interviews:
1. **React 19 does not pass `ref` as a prop to class components.** While React 19 treats `ref` as a prop on function components, class components never receive `this.props.ref` because refs on classes specifically target the component instance.
2. **Component encapsulation cautions against excessive imperative refs.** Directly querying child methods couples parent and child components tightly. The official React guidance recommends using declarative props whenever possible.

---

## PRINCIPLE | `forwardRef`: every component on the way must pass the ref on

> [!PRINCIPLE]
> **Principle 6: `forwardRef`: Every Function on the Way Must Pass the Ref On**
>
> *Prior to React 19, function components did not receive refs through props, requiring every intermediate wrapper, including higher-order components, to use `forwardRef` and pass `ref={ref}`; in React 19, `ref` is a standard prop, making `forwardRef` obsolete.*
>
> Higher-order components introduce intermediate wrappers between parents and target DOM nodes. The parent ref reaches the underlying input element only when every component in the hierarchy explicitly accepts and passes it along. Omitting a ref forwarding step leaves current as null, causing subsequent method invocations to throw a TypeError. In React 19, spreading props naturally propagates refs like any other property.
>
> **DO THIS:**
> ```jsx
> return forwardRef(function Tracked(props, ref) {
>   return <WrappedComponent {...props} ~ref={ref}~ />; // Passes the parent's ref on to MessageInput
> });
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> return forwardRef(function Tracked(props, ref) {
>   return ~<WrappedComponent {...props} />~; // **WRONG:** receives the ref and drops it, so current stays null
> });
> ```

> [!DEFINITION]
> **What is a higher-order component?** [NEW] A higher-order component is a function that accepts an existing component and returns a new component that renders it with enhanced functionality.
> The term parallels higher-order functions in JavaScript, which accept or return functions, such as the standard `map` method.
> Legacy codebases used higher-order components to share cross-cutting concerns, such as analytics tracking, across multiple components: `const TrackedMessageInput = withTracking(MessageInput)`.
> By established convention, higher-order component function names begin with the prefix `with` (Lesson 99).

Here is the higher-order component pattern written for React 18 alongside its modern React 19 equivalent. The `withTracking` function accepts a component named WrappedComponent and returns an enhanced component named `Tracked` that renders it:

```jsx title="A higher-order component with forwardRef, for React 18"
function withTracking(WrappedComponent) {
  return ~forwardRef~(function Tracked(props, ref) { // Receives the ref as a second argument
    return <WrappedComponent {...props} ref={ref} />;
  });
}
```

```jsx title="The same higher-order component without forwardRef, for React 19"
function withTracking(WrappedComponent) {
  return function Tracked(~props~) { // The ref arrives inside props
    return <WrappedComponent {...props} />;
  };
}
```

In React 19, both definitions function identically. Because `ref` is a standard prop, spreading props automatically forwards the ref to `WrappedComponent` (Lesson 85). In React 18, their behavior diverged completely. Standard function components did not receive refs through props, so omitting `forwardRef` caused the ref to stop at `Tracked`.

### The chat field behind `withTracking`

When teams modernized `MessageInput` into a function component under React 18, they wrapped it in `forwardRef` to accept refs from parents (Lesson 85):

```jsx title="src/MessageInput.jsx"
import { forwardRef } from 'react';

export default ~forwardRef~(function MessageInput(props, ref) { // React passes the ref as the second argument
  return <input {...props} ~ref={ref}~ placeholder="Write a message..." />; // The ref reaches the input element
});
```

To log analytics across all chat inputs, the team places `withTracking` in its own file:

```jsx title="src/withTracking.jsx"
import { forwardRef } from 'react';

export default function withTracking(WrappedComponent) {
  return ~forwardRef~(function Tracked(props, ref) { // Receives the parent's ref
    return <WrappedComponent {...props} ~ref={ref}~ />; // Passes the ref on to MessageInput
  });
}
```

`MessageForm`, still implemented as a class, wraps `MessageInput` once at module scope and assigns its ref to the enhanced component:

```jsx title="src/MessageForm.jsx"
import { Component, createRef } from 'react';
import MessageInput from './MessageInput.jsx';
import withTracking from './withTracking.jsx';

const ~TrackedMessageInput~ = withTracking(MessageInput); // Tracked, which renders MessageInput

export default class MessageForm extends Component {
  state = { text: '' };
  inputRef = createRef();

  handleChange = (e) => {
    this.setState({ text: e.target.value });
  };

  handleSend = () => {
    this.setState({ text: '' });
    this.inputRef.current.focus();
  };

  render() {
    return (
      <div>
        <TrackedMessageInput
          ~ref={this.inputRef}~ // The ref must travel through Tracked and MessageInput
          value={this.state.text}
          onChange={this.handleChange}
        />
        <button onClick={this.handleSend}>Send</button>
      </div>
    );
  }
}
```

`WrappedComponent` represents `MessageInput`. Invoking `withTracking(MessageInput)` executes once during module evaluation. `MessageInput` is passed as the `WrappedComponent` argument. The returned `Tracked` component retains that reference through closure scope (Lesson 15) and renders it during each cycle.

### How the ref travels to the `<input>`

**Beware! The parent component never accesses the `<input>` element directly. The ref reaches the DOM node only because every intermediate layer explicitly propagates it.** Here is the full traversal path:
1. `MessageForm` attaches its ref to `TrackedMessageInput`.
2. TrackedMessageInput represents the `Tracked` component wrapped inside `forwardRef`. React calls `Tracked` with props and passes the ref as the second argument.
3. Tracked renders `MessageInput` and explicitly forwards the ref using `ref={ref}`. `MessageInput` is also wrapped in `forwardRef`.
4. React calls `MessageInput`, supplying props and the identical ref.
5. `MessageInput` attaches the ref directly to the native `<input>` tag.
6. During the commit phase, React assigns the rendered DOM node to `this.inputRef.current`, two levels beneath the parent.

The parent handler continues calling `this.inputRef.current.focus()`. While the call looks identical to Principle 5, its target is different. Here, `current` holds the browser DOM node directly, invoking the browser native method.

```tree dir=right caption="How the parent's ref travels through Tracked and MessageInput to the input element in React 18."
The path of `this.inputRef` before React 19
- +1. `MessageForm` [`<TrackedMessageInput ref={this.inputRef} />`] | The parent puts the ref **on the wrapper**
- +2. `Tracked` [`forwardRef`] | Receives the ref as a **second argument** | Passes it on with **`ref={ref}`**
- +3. `MessageInput` [`forwardRef`] | Receives the same ref | Puts it **on the `<input>`**
- +4. The `<input>` element | React puts it into **`this.inputRef.current`** during the commit
```

### One forgotten `ref={ref}` breaks the path

If an engineer modifies `Tracked` and accidentally omits `ref={ref}`, the forwarding chain breaks:

```jsx title="src/withTracking.jsx" startLine="4"
  return forwardRef(function Tracked(props, ref) {
    return ~<WrappedComponent {...props} />~; // **WRONG:** receives the ref and drops it
  });
```

The component continues to display text correctly. However, because `Tracked` receives the ref but fails to pass it down, React finds no DOM element to attach. Consequently, `this.inputRef.current` remains `null`. When Send is clicked, the text field clears, but attempting to focus throws a `TypeError`. The official React documentation specifically identifies this pitfall: forgetting to apply the received ref to an underlying element.

```tree caption="A wrapper that passes the ref on vs. a wrapper that drops it."
What `Tracked` does with the ref it receives
- +Passes it on [`<WrappedComponent {...props} ref={ref} />`] | The ref reaches **`MessageInput` and the `<input>`** | `Send` puts **the cursor back**
- !Drops it [`<WrappedComponent {...props} />`] | The ref **stops at `Tracked`** | `current` stays **`null`**, and `Send` throws a **`TypeError`**
```

A related mistake occurs when `MessageInput` forwards refs correctly, but `withTracking` returns an unwrapped function component:

```jsx title="src/withTracking.jsx"
export default function withTracking(WrappedComponent) {
  return function ~Tracked~(props) { // **WRONG in React 18:** a plain function receives no ref
    return <WrappedComponent {...props} />;
  };
}
```

In React 18, the incoming ref terminates at `Tracked`. As the React documentation explains, standard function components cannot receive ref attributes without `forwardRef`. Clicking Send throws an identical `TypeError`. In React 19, Tracked automatically receives `ref` inside `props`, and spreading props carries it through. Upgrading to React 19 naturally eliminates this class of bugs.

### VS | `forwardRef` vs. `ref` as a prop: React 18 needs the wrapper, React 19 does not

In React 19, `ref` operates as a standard prop for function components (Lesson 85). Both components can eliminate `forwardRef`:

```jsx title="MessageInput with forwardRef and with ref as a prop"
const MessageInput = ~forwardRef~(function MessageInput(props, ref) { /* ... */ }); // React 18 and earlier
function MessageInput(~{ ref, ...props }~) { /* ... */ } // React 19: ref is a prop
```

In React 19, both syntax variants successfully receive the parent ref and attach it to the input element. The React documentation states that `forwardRef` is no longer needed in React 19 and will be deprecated in future releases.

Four additional React 19 migration details frequently arise in technical discussions:
1. **Passing `ref` as a prop requires the modern JSX transform.** React 19 mandates this transform, requiring projects still using legacy transforms to upgrade their build configurations.
2. **`ReactDOM.findDOMNode` was removed entirely.** Previously used to query DOM nodes from class instances, it undermined component modularity and harmed performance. Attaching refs to host tags is the modern replacement.
3. **Strict Mode invokes `forwardRef` render functions twice in development**, verifying purity in the same manner as standard components (Lesson 47).
4. **Best practices limit ref exposure to leaf components.** Reusable primitive components like buttons and text inputs should forward refs, while composite domain components should encapsulate their internal markup.

One additional breaking change affects legacy code accessing `element.ref` on JSX elements. React 19 deprecates this property and logs an error in the console:

```devconsole width=full
x Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release.
```

---

## All 6 Principles Together

### The chat field in React 19

Here is the complete chat form refactored for React 19. `MessageForm` is a function component using `useRef`. The `withTracking` wrapper returns a plain function. `MessageInput` accepts `ref` as a standard prop:

```jsx title="src/MessageForm.jsx"
import { useRef, useState } from 'react';
import MessageInput from './MessageInput.jsx';
import withTracking from './withTracking.jsx';

const TrackedMessageInput = withTracking(MessageInput);

export default function MessageForm() {
  const [text, setText] = useState('');
  const inputRef = ~useRef(null)~; // Principles 3 and 4: one object for the whole life of the component
  const timerRef = ~useRef(null)~; // Principle 4: the timer ID survives every render

  function handleChange(e) {
    setText(e.target.value);
    if (timerRef.current === null) {
      timerRef.current = setInterval(() => console.log('Draft saved'), 5000);
    }
  }

  function handleSend() {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setText('');
    ~inputRef.current.focus()~; // Principle 6: current holds the input element, two components below
  }

  return (
    <div>
      <TrackedMessageInput ~ref={inputRef}~ value={text} onChange={handleChange} /> {/* Principle 6: ref is a prop */}
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

```jsx title="src/withTracking.jsx"
export default function withTracking(WrappedComponent) {
  return function Tracked(props) {
    return <WrappedComponent ~{...props}~ />; // Carries ref on, because ref is inside props
  };
}
```

```jsx title="src/MessageInput.jsx"
export default function MessageInput(~{ ref, ...props }~) { // Principle 6: no forwardRef in React 19
  return <input {...props} ref={ref} placeholder="Write a message..." />;
}
```

Typing a message and clicking Send clears the field, retains focus inside the input, and cancels the draft interval cleanly:

```page caption="The finished chat field in React 19 after the user types Hi and clicks Send."
card: typed= | good=typed
line: [Send]
console: quiet
```

### How React passes the ref down and fills it

When rendering mounts the view, React evaluates components from parent to child, then assigns the ref during the commit phase:

```tree dir=right caption="The order in which React calls the components of the chat field and fills inputRef."
How `inputRef` reaches the `<input>` in React 19
- +1. `MessageForm` | Creates **`inputRef`** with `useRef` | Renders `<TrackedMessageInput ref={inputRef} />`
- +2. `Tracked` | Receives `ref` **inside `props`** | Renders `<MessageInput {...props} />`
- +3. `MessageInput` | Reads **`ref`** as a prop | Renders `<input ref={ref} />`
- +4. The commit | React puts the `<input>` element into **`inputRef.current`** | `handleSend` can **put the cursor back**
```

| Principle | Old code | React 19 | What breaks |
| :--- | :--- | :--- | :--- |
| **1. String ref** | `ref="input"` and `this.refs.input` | Removed: use a ref callback or `createRef` | The page goes blank after the upgrade |
| **2. Ref callback** | `ref={el => { this.input = el; }}` | Still valid; may return a cleanup function | A callback written in `render` runs twice after every keystroke; using its element without a check fails on `null` |
| **3. `createRef` in a class** | `inputRef = createRef()` as a class field | Still exported, a Legacy React API; use `useRef` in a function | Nothing, as long as it stays a class field |
| **4. `createRef` in a function** | Copied into the body during a migration | Replace it with `useRef(null)` | A timer ID in `current` is lost, and the timer never stops |
| **5. Ref on a class** | `current` holds the component instance | Still the instance, and still not a prop | A class turned into a function that ignores `ref` leaves `current` as `null` |
| **6. `forwardRef`** | Every function on the way uses `forwardRef` and `ref={ref}` | `ref` is a prop; `forwardRef` is no longer necessary | One dropped `ref={ref}` leaves `current` as `null` |

Remember the underlying concept connecting all ref patterns. **Every ref directs React where to attach an underlying node: in a named dictionary, through a custom callback, or inside a container property. Modern React streamlines this model by removing string refs, treating `ref` as an ordinary prop, and using `useRef` as the standard container.**

---

## For the Interview

> **The Interview Question:** How did refs work before hooks: createRef, callback refs, and forwardRef?

### How to Answer Clearly in 30 Seconds

"Refs establish a direct channel between component logic and underlying DOM nodes, enabling imperative operations like restoring input focus. Before Hooks introduced `useRef`, class components relied on three primary approaches:
1. **String refs**: assigning a string like `ref="input"` stored the node on `this.refs.input`. Deprecated in React 16.3, React 19 removed them completely.
2. **Callback refs**: a function passed to `ref` that React calls with the DOM node on mount and with `null` on unmount. Inline functions recreate the callback, triggering detach and attach calls on every render.
3. **`createRef`**: an API that initializes an object with a `current` property, stored as a class instance field and populated by React during the commit phase.

Passing refs to custom function components previously required `forwardRef`, with every intermediate wrapper explicitly propagating the ref. React 19 simplifies this by treating `ref` as a standard prop, deprecating `forwardRef`, and standardizing on `useRef` for persistent references in function components."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Is `createRef` the same as `useRef`?"**
Both APIs construct an identical object structure containing a single `current` property that React updates. The distinction centers on lifecycle persistence. In a class component, `createRef` executes once as an instance field initializer, binding the object to the instance. In a function component, calling `createRef` executes on every render, returning a brand new object each time and discarding any stored non-DOM state. In contrast, `useRef` instructs React to maintain the same object across renders. When migrating a class component to a function component, every instance `createRef` call translates directly to `useRef(null)`.
2. **"Why does my ref callback get called with `null` after every keystroke?"**
This occurs when declaring the callback as an inline function inside the component render method or function body. Every keystroke updates state and re-renders the component, generating a new function reference in memory. When reconciling props, React detects a new function reference on `ref`. It cleans up the previous callback by invoking it with `null`, then immediately invokes the new callback with the current DOM node. Defining the callback as a stable class method or wrapping it in `useCallback` stabilizes the reference, ensuring React calls it only during true mount and unmount events. In React 19, ref callbacks can also return an explicit cleanup function that React calls instead of passing `null`.
3. **"We are upgrading an old app to React 19. What do we do with its refs?"**
First, run the automated React codemod to replace all string refs with callback refs or `createRef`, since string refs cause immediate runtime crashes in React 19. Second, eliminate `forwardRef` from existing function components and higher-order components, accessing `ref` directly as a prop and forwarding it through prop spreading. Third, replace any usages of `ReactDOM.findDOMNode` or `element.ref` with direct host element refs. Remember that refs placed on class components continue to reference the class instance rather than passing through as props. Finally, when refactoring legacy classes into function components, convert all `createRef` instance fields to `useRef(null)`.
