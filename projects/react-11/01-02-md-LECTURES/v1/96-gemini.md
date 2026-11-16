# Lecture 96: How a Class Component Works, and How to Read One Today

*(What does a React component look like when it is written as a JavaScript class, and how do you turn it into a function?)*

> INTERVIEW QUESTION | LEGACY | How do class components work, and how do you read one today?

---

## VS | A Class Component vs. a Function Component: the same props in, the same JSX out, only the places change

> Before React introduced Hooks in 2019, any component that managed mutable state was declared as a JavaScript class. Many production applications continue to run these legacy components today. **A class component implements the exact same component contract as a modern function, but anchors props, state, and event callbacks to a single instance object referenced through this**. Once you recognize where each piece resides on the class instance, you can safely inspect an existing class, fix defects, or migrate it into a clean function component.

When opening an established project, you might encounter `class Post extends Component` alongside constructor bindings, state declarations, and update calls. At first glance, this syntax resembles an entirely different framework. In reality, the underlying component model is identical. React introduced Hooks in February 2019 with version 16.8. Prior to that milestone, every component requiring local state was authored as an ES6 class. React 19 continues to support and execute class components, meaning you will frequently encounter them across enterprise applications.

Every architectural principle you already know about React functions applies directly to class components. Both patterns accept input properties, preserve state across render passes, respond to user events, and declare markup. The class architecture merely relocates each capability to a dedicated instance property. Input attributes live on `this.props`. Persistent state lives on `this.state`. State updates occur through `this.setState`. Finally, the returned user interface moves into a required class method named `render`.

**Why:** Two specific differences between classes and functions alter runtime behavior and frequently trigger production bugs. First, `this.setState` merges updated fields into the existing state object, whereas a `useState` setter replaces state values completely. Second, standard class methods lose their execution context when invoked as detached callbacks, causing unbound event handlers to crash at runtime. When developers treat a class component as merely cosmetic syntax, they often remove vital constructor bindings or attempt naive line by line migrations. These missteps produce silent update failures, unhandled exceptions, and buttons that revert unexpectedly.

### Back to Classes in Plain JavaScript

To understand React class components, revisit how standard ES6 JavaScript classes operate. A class functions as an object blueprint. You declare the class structure once, and the `new` operator creates as many isolated object instances as your application requires:

```js title="A class in plain JavaScript"
class Dog {
  constructor(name) {
    ~this.name = name~; // Runs once for each new object, and gives it its first field
  }
  bark() {
    console.log(~this.name~ + ' says woof'); // this is the object bark was called on
  }
}

const rex = ~new Dog('Rex')~; // Makes one object from the class
rex.bark(); // The Console shows Rex says woof
```

> [!DEFINITION]
> **What is a class?** [NEW] A class is an ES6 blueprint for instantiating objects with shared methods and encapsulated properties.
> 1. Calling `new Dog('Rex')` allocates an isolated object in memory called an instance.
> 2. The constructor is a dedicated initialization method that JavaScript runs once when allocating each instance to assign initial fields.
> 3. A method is a function declared inside the class body, such as `bark`.
> 4. Inside a method, `this` refers to the specific instance receiving the method invocation, meaning `rex.bark()` resolves `this.name` to `'Rex'` (Lesson 96).

React manages instantiation internally, so application code never invokes `new` directly. When React encounters a JSX element like `<Greeting name="Taylor" />`, the reconciler performs three sequential operations:
1. It instantiates the `Greeting` class in memory.
2. It assigns the element attributes to the instance under `this.props`.
3. It invokes the `render` method on that instance to obtain the JSX tree.

### The Smallest Class Component

Here is the same greeting component written in both paradigms:

```jsx title="Greeting as a class"
import { Component } from 'react';

class Greeting ~extends Component~ { // Builds Greeting on top of the Component class from React
  ~render()~ { // React calls render on the instance to get the JSX
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

```jsx title="Greeting as a function"
function Greeting({ ~name~ }) { // The props arrive as the first parameter
  return <h1>Hello, {name}!</h1>;
}
```

Both implementations are rendered with the exact same JSX tag:

```jsx title="One tag for either form"
<Greeting ~name="Taylor"~ /> {/* The class and the function both receive name */}
```

```page width=text caption="What both forms put on the page."
heading: Hello, Taylor!
console: quiet
```

**Both versions produce the exact same DOM output.** The parent component renders `<Greeting name="Taylor" />` identically regardless of whether the child is a class or a function. The differences are purely structural:
1. The JSX is returned from the `render` method rather than from a function body.
2. Input properties are accessed through the instance property `this.props` rather than receiving a destructured parameter.

> [!DEFINITION]
> **What does extends mean?** [NEW] The `extends` keyword establishes prototype inheritance between a subclass and React's foundational `Component` base class.
> 1. Writing `class Greeting extends Component` inherits React's built-in state management and rendering plumbing.
> 2. Every instance automatically inherits instance properties like `this.props` and lifecycle methods like `this.setState`.
> 3. The browser DOM remains completely agnostic of the component paradigm, displaying the identical `<h1>` element in the Elements inspector (Lesson 96).

### The Rule of Thumb: every `this.` has a place in a function

**Read every `this.` in a class as a question: where does this piece live in a function?** The answer is always one of these:

| In the class | In a function |
| :--- | :--- |
| `this.props.name` | the parameter `name` |
| `this.state = { liked: false, saved: false }` | one `useState` call for each field |
| `this.setState({ liked: true })` | the setter `setLiked(true)` |
| the method `handleLike` and its `bind` line | a function `handleLike` inside the component |
| the `return` inside `render` | the `return` of the function |
| the constructor | nothing |

When evaluating an existing class component, select one of three engineering approaches based on your requirements:
1. **Preserve the working class.** If you are making a small bug fix or minor update to stable legacy code, keep the class intact to prevent accidental regressions. The React documentation confirms that class components remain supported, though functions are recommended for new code.
2. **Migrate the class into a function.** If the component requires new capabilities, state hooks, or modern libraries, convert it to a function component. React Hooks cannot run inside class components, making migration necessary to consume context or effect hooks.
3. **Retain the class for Error Boundaries.** Some specialized error handling capabilities have no function equivalent. React provides no hook alternative for `componentDidCatch`, so Error Boundaries must continue to be authored as class components (Lesson 72).

Senior engineers stay vigilant regarding five architectural subtleties where misunderstandings produce severe bugs:
1. **The `this` keyword inside a class method does not automatically point to the component instance.** JavaScript evaluates `this` dynamically at call time, so passing a method as an event handler strips its context unless explicitly bound.
2. **`this.setState` merges partial updates while function setters replace state entirely.** Passing a single property update to a class preserves unmentioned fields, whereas passing that same partial object to a `useState` setter deletes the omitted keys.
3. **`this.setState` updates are asynchronously scheduled requests.** Calling `this.setState` does not mutate `this.state` synchronously within the currently executing handler; the change applies only during the subsequent render pass (Lesson 15).
4. **Explicit constructors are largely redundant in modern JavaScript.** Modern class field initializers allow state and bound arrow methods to be declared directly in the class body without constructor boilerplate.
5. **React Hooks cannot execute inside class components.** Attempting to call hooks within class methods triggers a fatal invariant violation, requiring a component refactor to use hook features.

The remainder of this lesson analyzes a production class component piece by piece and then demonstrates a complete migration.

## SECTION | A Photo Post with Like and Save

Picture an interactive photo card in a social feed. The post displays an author credit alongside two interactive buttons: Like and Save. When a user clicks Like, the label changes to Liked. When a user clicks Save, the label changes to Saved. Both states operate independently without resetting each other.

```page width=text caption="The post when the page opens: the author line and two buttons."
line: Photo by Mia
line: [Like] [Save]
console: quiet
```

```page width=text caption="The same post after the user clicks Like and then Save."
line: Photo by Mia
line: [Liked] [Saved] | good
console: quiet
```

Our team inherits this post component from a legacy codebase authored in 2019 before Hooks existed. Today an engineer must inspect the code, resolve existing defects, and migrate it into a clean function component.

The project contains three files in the source folder:

```files title="photo-post: File Explorer" caption="How the files of our photo post sit inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and renders `<Post author="Mia" />`
  Post.jsx | class component | Exports the 2019 `Post` class as default
```

The parent `App` component is a standard function that renders the class component like any other element:

```jsx title="src/App.jsx"
import Post from './Post.jsx';

export default function App() {
  return <Post ~author="Mia"~ />; // A function component renders a class component like any tag
}
```

The legacy post implementation contains four foundational architectural elements common to older codebases:
1. The `render` method and its reliance on `this.props`.
2. The constructor and its initialization of `this.state`.
3. State scheduling through `this.setState`.
4. Event handler methods bound inside the constructor.

Each principle below analyzes one element in depth. Principle 5 then performs a complete migration from the class to a modern function component.

**PRINCIPLES:** A class component mirrors modern component architecture, but stores its props, state, and handlers on a single instance object named `this`. Five core principles govern its mechanics:
1. **Principle 1: `render()` Returns What the Post Shows.** React invokes `render` on the instance and reads element attributes through `this.props`. Hooks cannot execute inside class methods.
2. **Principle 2: The Constructor Fills `this.state` Before the First Render.** All class state consolidates into one object. The constructor initializes this object immediately following `super(props)`. A class field achieves the identical result with cleaner syntax.
3. **Principle 3: `this.setState` Merges Only the Fields It Is Given.** Calling `this.setState({ liked: true })` updates `liked` while preserving other state fields automatically. The updated state becomes accessible on the subsequent render pass.
4. **Principle 4: An Unbound `this.handleLike` Crashes the Click.** Passing a method as an event callback detaches its execution context, setting `this` to undefined and triggering a runtime `TypeError`. Binding in the constructor or using an arrow class field ensures the instance remains intact.
5. **Principle 5: One `useState` Call per Field Replaces `this.state`.** Function setters replace state completely rather than merging. Migrating to a single state object without careful spreading erases unmentioned fields on every update.

---

## PRINCIPLE | `render()`: React calls it on the instance, and the props of the tag are on `this.props`

> [!PRINCIPLE]
> **Principle 1: `render()` Returns What the Post Shows**
>
> *A class component extends React's base `Component`. React calls its `render` method to obtain the JSX tree, and that method reads input attributes from `this.props`.*
>
> While class syntax appears distinct, it accepts the same incoming props and returns the same JSX tree as a function component. The structural difference is purely mechanical: markup generation moves into the `render` method, and attributes attach to `this.props`. React Hooks remain strictly prohibited because they require a function component execution frame.
>
> **DO THIS:**
> ```jsx
> class Post extends Component {
>   render() {
>     return <p>Photo by {~this.props.author~}</p>; // React put the props of the tag on this.props
>   }
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> class Post extends Component {
>   render() {
>     const theme = ~useContext(ThemeContext)~; // **WRONG:** a Hook inside a class stops the page with Invalid hook call
>     return <p className={theme}>Photo by {this.props.author}</p>;
>   }
> }
> ```

### `Component` and `React.Component`: one base class, two names

Older codebases reference React's base class using one of two standard import conventions. Both patterns are functionally identical and appear throughout production code:

```jsx title="Two ways to name the same base class"
class Post extends ~Component~ {} // After the line import { Component } from 'react'
class Post extends ~React.Component~ {} // After the line import React from 'react'
```

**Both declarations access the exact same class definition.** The first pattern imports the named `Component` export directly. The second pattern imports the default `React` namespace and accesses `Component` as a property.

### The post with only `render`

The initial post implementation defines only the required `render` method. Both buttons display static fallback labels for now:

```jsx title="src/Post.jsx"
import { Component } from 'react';

export default class Post extends Component {
  ~render()~ { // React calls render on the Post instance to get the JSX
    return (
      <article>
        <p>Photo by {~this.props.author~}</p> {/* Shows Mia, from the tag Post author="Mia" */}
        <button>Like</button>
        <button>Save</button>
      </article>
    );
  }
}
```

```page width=text caption="The post rendered by the class: the author line and two buttons."
line: Photo by Mia
line: [Like] [Save]
console: quiet
```

The class never explicitly declares an argument for props, yet `this.props.author` reliably resolves to `'Mia'`. React coordinates this data flow across four concrete steps:
1. `Post` subclasses `Component`, establishing prototype linkage to React's base class.
2. For the element tag `<Post author="Mia" />`, React instantiates `Post` in memory.
3. React assigns the JSX attributes to that instance as `this.props`.
4. React invokes `render` on the instance, allowing the method to access `this.props.author`.

The React documentation states this parity directly: reading `this.props` in a class is equivalent to accessing props parameters in a function. The name `render` is mandatory. The reconciler looks specifically for this method, which serves as the only required lifecycle method in a class component.

The `render` method adheres to the same purity constraints as a function component body. It must remain pure, returning identical JSX whenever given identical props and state (Lesson 14). During development, React StrictMode invokes `render` twice to help uncover unintended side effects (Lesson 47).

### A Hook inside the class stops the page

Suppose the application manages its visual theme in a context provider named `ThemeContext` (Lesson 28). A developer accustomed only to modern function components might attempt to call `useContext` directly inside `render`:

**DO NOT DO THIS:**
```jsx title="src/Post.jsx" startLine="3" bad="3"
export default class Post extends Component {
  render() {
    const theme = ~useContext(ThemeContext)~; // **WRONG:** Hooks do not work inside a class component
    return <article className={theme}>Photo by {this.props.author}</article>;
  }
}
```

React immediately halts execution with an invariant error: "Invalid hook call. Hooks can only be called inside of the body of a function component." Because the exception occurs during the render phase without an enclosing error boundary, the entire component tree unmounts and leaves the browser screen blank (Lesson 72).

The Rules of Hooks explicitly enforce this boundary: never call Hooks inside class components. To incorporate context consumers or other hook-based features, the component must be migrated into a function, as demonstrated in Principle 5.

---

## PRINCIPLE | `constructor` and `this.state`: all the state is one object, ready before the first render

> [!PRINCIPLE]
> **Principle 2: The Constructor Fills `this.state` Before the First Render**
>
> *Initialize `this.state` exactly once prior to the initial render pass, either within `constructor(props)` immediately following `super(props)`, or as a direct class field declaration. After initialization, all state updates must occur through `this.setState`.*
>
> Class components do not use `useState`. All component state is consolidated into a single object stored on the instance. The constructor configures this object before React invokes `render`, and must call `super(props)` before referencing `this`. Modern class fields achieve the same initialization with less ceremony. Constructors must avoid side effects because development StrictMode executes them twice.
>
> **DO THIS:**
> ```jsx
> class Post extends Component {
>   constructor(props) {
>     ~super(props)~; // First line: Component sets up the instance, then this is safe to use
>     this.state = { liked: false, saved: false };
>   }
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> class Post extends Component {
>   constructor(props) {
>     ~this.state~ = { liked: false, saved: false }; // **WRONG:** this before super throws a ReferenceError
>     super(props);
>   }
> }
> ```

### VS | The Constructor vs. a Class Field: both set `this.state` before the first render

In a function component, each independent piece of state is declared via its own `useState` call. In a class component, all state fields reside within a single object assigned to `this.state`. Older codebases initialize this state object in one of two locations.

The traditional location is the constructor method:

```jsx title="Starting the state in the constructor"
class Post extends Component {
  constructor(props) {
    ~super(props)~; // 1. Runs the constructor of Component first
    ~this.state~ = { liked: false, saved: false }; // 2. All the state of the post, in one object
  }
}
```

The constructor executes once when JavaScript instantiates the class in memory. React passes the element props to the constructor, ensuring state initializes before the component renders markup to the screen.

In JavaScript subclassing, `super` refers to the parent base class constructor. Calling `super(props)` invokes the initialization logic in `Component` with the incoming attributes. JavaScript strictly forbids referencing `this` prior to `super()`, requiring parent construction to execute as the very first statement.

The modern alternative uses a public class field:

```jsx title="Starting the state with a class field"
class Post extends Component {
  ~state~ = { liked: false, saved: false }; // The same object, set on every new instance
}
```

A class field declares a property directly within the class body outside any method. The JavaScript engine attaches this property to each new instance during object construction. Writing a class field like `state = { ... }` gives every post instance its own initial state without requiring a boilerplate constructor.

**Both patterns produce the identical runtime result.** Each new post instance receives an initialized `this.state` object before React invokes `render`. The official React documentation notes that when modern JavaScript syntax is available, explicit constructors are rarely required. React's own class examples favor class fields.

```tree caption="Two ways to start the state of a class: in the constructor, or as a class field."
Two ways to give `Post` its first `this.state`
- +In the constructor [`super` `this.state = ...`] | Runs once for each **new instance** | `super` must come **before any use of `this`**
- +As a class field [`state = ...`] | Written straight in the **class body** | **Exact same result**, with no constructor at all
```

### One object in a class, one variable per field in a function

The React documentation emphasizes that defining `state` in a class component is equivalent to calling `useState` in a function component. While the goal is identical, the data structures differ significantly:
- **The class component** bundles every state property into a single composite object.
- **The function component** typically decomposes state into individual variables for each property.

This structural distinction directly influences how class updates merge in Principle 3 and why migration errors occur in Principle 5.

### The post reads its labels from `this.state`

Our post component now receives its constructor, allowing button labels to reflect dynamic state values:

```jsx title="src/Post.jsx" startLine="3"
export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = { liked: false, saved: false };
  }

  render() {
    return (
      <article>
        <p>Photo by {this.props.author}</p>
        <button>{~this.state.liked~ ? 'Liked' : 'Like'}</button> {/* false on the first render, so it reads Like */}
        <button>{~this.state.saved~ ? 'Saved' : 'Save'}</button> {/* false on the first render, so it reads Save */}
      </article>
    );
  }
}
```

The rendered output initially remains unchanged: the author credit appears above the Like and Save buttons. The buttons do not yet attach event handlers.

The constructor is the only location where code may assign directly to `this.state`. In all other methods, state must be updated using `this.setState`. If a click handler attempts direct mutation like `this.state.liked = true`, the object in memory changes, but React receives no update notification. Because no re-render is scheduled, the button display remains permanently stuck.

### Two mistakes in a 2019 constructor

The first critical mistake is accessing `this` before invoking `super(props)`:

**DO NOT DO THIS:**
```jsx title="src/Post.jsx" startLine="4" bad="2"
  constructor(props) {
    ~this.state~ = { liked: false, saved: false }; // **WRONG:** this is used before super, so JavaScript throws a ReferenceError
    super(props);
  }
```

A `ReferenceError` occurs because JavaScript forbids using `this` in a subclass before the parent constructor completes. The runtime crashes the moment React instantiates the component, preventing the post from ever rendering. The language specification mandates that `super` must be called before `this` is accessed.

The second mistake involves introducing side effects during construction. Older codebases occasionally trigger network requests or analytics calls inside the constructor. In development, React StrictMode instantiates components twice and discards one instance, causing duplicate analytics pings and leaked connections. React documentation explicitly warns against executing side effects or subscriptions inside constructors. Dedicated lifecycle methods like `componentDidMount` handle post-mount operations in Lesson 97.

---

## PRINCIPLE | `this.setState`: only the fields you name change, and only on the next render

> [!PRINCIPLE]
> **Principle 3: `this.setState` Merges Only the Fields It Is Given**
>
> *Calling `this.setState({ liked: true })` requests a re-render where `liked` is updated and all other state fields remain untouched. The currently executing code continues to observe the previous `this.state` snapshot.*
>
> Because a class consolidates all state into one object, React allows handlers to specify only the fields that change. React shallowly merges these fields into state for the subsequent render. Like function state setters, `this.setState` schedules an update rather than performing an immediate in-place mutation, requiring handlers to compute future values before dispatching.
>
> **DO THIS:**
> ```jsx
> handleLike() {
>   this.setState({ ~liked: !this.state.liked~ }); // Changes liked, and saved stays as it was
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> handleLike() {
>   this.setState({ liked: !this.state.liked });
>   saveLike(~this.state.liked~); // **WRONG:** this.state is still the old state, so the server gets the old value
> }
> ```

### The object you give `this.setState` is a list of changes

Suppose the post is saved but not yet liked, and the user clicks the Like button:

```jsx title="this.setState with one field, while the state holds two"
state = { liked: false, saved: true }; // Before the click: saved, not liked

handleLike() {
  this.setState({ ~liked: true~ }); // Next render: liked is true, and saved is still true
}
```

The object passed to `this.setState` does not represent the complete new state tree. Instead, it serves as a patch of desired changes. React shallowly merges the specified keys into `this.state` while leaving unmentioned keys completely intact.

Shallow merging operates exclusively on top-level properties. React copies the updated `liked` and `saved` keys in the same manner as an object spread (Lesson 17).

Consequently, these two invocations achieve the exact same state outcome:

```jsx title="Naming one field, and naming every field by hand"
this.setState({ ~liked: true~ }); // The merge keeps saved without being told
this.setState({ ~liked: true, saved: this.state.saved~ }); // The same next state, written out by hand
```

**Both calls produce the exact same next state.** React's automatic shallow merge preserves `saved` without manual intervention. For this reason, legacy class components rarely copy unmodified fields into `this.setState` calls.

### The post gets its two handlers

Our post now receives dedicated methods for each interactive button, with each method updating a single state property:

```jsx title="src/Post.jsx" startLine="3"
export default class Post extends Component {
  constructor(props) {
    super(props);
    this.state = { liked: false, saved: false };
    this.handleLike = this.handleLike.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  handleLike() {
    this.setState({ ~liked: !this.state.liked~ }); // Flips liked, and keeps saved
  }

  handleSave() {
    this.setState({ ~saved: !this.state.saved~ }); // Flips saved, and keeps liked
  }

  render() {
    return (
      <article>
        <p>Photo by {this.props.author}</p>
        <button onClick={~this.handleLike~}>{this.state.liked ? 'Liked' : 'Like'}</button> {/* Hands React the bound method */}
        <button onClick={this.handleSave}>{this.state.saved ? 'Saved' : 'Save'}</button>
      </article>
    );
  }
}
```

The constructor includes explicit `.bind(this)` assignments to preserve execution context inside both handlers. Principle 4 explores what happens if these lines are omitted.

The `this.setState` method is inherited directly from the `Component` base class. Calling it signals to React that this component and its child subtree must re-render with updated state data.

When the user clicks Save and subsequently clicks Like, the UI updates smoothly:

```page width=text caption="The post after the user clicks Save: Like and Saved."
line: Photo by Mia
line: [Like] [Saved]
console: quiet
```

```page width=text caption="The post after the user then clicks Like: Liked and Saved."
line: Photo by Mia
line: [Liked] [Saved] | good
console: quiet
```

The Save button remains in its active Saved state after clicking Like because shallow merging preserved `saved: true`.

### `this.state` still holds the old value right after `this.setState`

Calling `this.setState` does not update `this.state` synchronously within the active call stack. The React documentation clarifies that `this.setState` only influences the value returned by `this.state` starting from the next render. This behavior reflects the standard state snapshot model (Lesson 15).

Consider a scenario where the post must inform a remote server whenever the user toggles a like, using a helper function named `saveLike`:

**DO NOT DO THIS:**
```jsx title="src/Post.jsx"
handleLike() {
  this.setState({ liked: !this.state.liked });
  saveLike(~this.state.liked~); // **WRONG:** on the first click the button shows Liked, but the server receives false
}
```

**DO THIS:**
```jsx title="src/Post.jsx"
handleLike() {
  const nextLiked = !this.state.liked;
  this.setState({ liked: nextLiked });
  saveLike(~nextLiked~); // The server receives true, the same value the button shows
}
```

Calculate the next value first, store it in a local constant, and supply that consistent value to both the state updater and external services.

### The updater function

When an event handler must perform multiple sequential updates on the same state field, class components pass an updater function instead of an object:

```jsx title="this.setState with an updater function, and a setter with one"
this.setState(~prevState => ({ liked: !prevState.liked })~); // React queues it and hands it the pending state
setLiked(~l => !l~); // The updater function of a setter, for comparison
```

**Both paradigms follow the identical updater contract.** React queues the updater callback and invokes it with the pending state calculation rather than reading from the stale snapshot (Lesson 16).

---

## PRINCIPLE | `bind(this)` in the constructor: the handler keeps its instance when React calls it on a click

> [!PRINCIPLE]
> **Principle 4: An Unbound `this.handleLike` Crashes the Click**
>
> *Assigning `onClick={this.handleLike}` passes the method reference as a detached callback. When clicked, `this` is `undefined`, causing `this.setState` to throw a `TypeError`. Bind methods inside the constructor or declare them as arrow functions within class fields.*
>
> In JavaScript, `this` is determined by call-site invocation rather than lexical definition. Because React executes event callbacks independently and class bodies run in strict mode, an unbound method receives `undefined` for `this`. The component mounts cleanly, but user interactions trigger fatal exceptions. Explicit constructor binding or arrow class fields guarantee the handler retains its instance reference.
>
> **DO THIS:**
> ```jsx
> class Post extends Component {
>   state = { liked: false };
>   handleLike = ~() =>~ { // An arrow in a class field: this is the instance on every click
>     this.setState({ liked: !this.state.liked });
>   };
>   render() {
>     return <button onClick={this.handleLike}>{this.state.liked ? 'Liked' : 'Like'}</button>;
>   }
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> class Post extends Component {
>   state = { liked: false };
>   handleLike() {
>     this.setState({ liked: !this.state.liked });
>   }
>   render() {
>     return <button onClick={~this.handleLike~}>{this.state.liked ? 'Liked' : 'Like'}</button>; // **WRONG:** never bound, so this is undefined on the click
>   }
> }
> ```

### A method called on its object, and the same method called alone

To understand this error, examine standard JavaScript execution without React. Returning to the earlier `Dog` class, observe how calling `bark` behaves across two invocation styles:

```js title="Calling a method on its object, and calling it alone"
const rex = new Dog('Rex');
~rex.bark()~; // Called on rex: this is rex, and the Console shows Rex says woof

const bark = rex.bark;
~bark()~; // Called alone: this is undefined, and the line throws a TypeError
```

**Although both lines execute the exact same function, their execution contexts differ fundamentally:**
- Invoking `rex.bark()` calls the function directly on the dog object, binding `this` to that instance.
- Invoking `bark()` executes the extracted function alone, leaving `this` as undefined.

In JavaScript, `this` is determined by how a function is called, not where it was declared. Declaring a method inside a class does not automatically bind it to an instance.

The value resolves to `undefined` because class bodies execute in strict mode by default. Under strict mode rules, detached function calls do not default `this` to the global window object, but instead leave it `undefined`.

### VS | JavaScript Strict Mode vs. React `<StrictMode>`: the same name for two different things

While sharing a similar name, these two concepts operate at entirely different levels:
- **JavaScript strict mode** is a core language feature that prevents silent errors and ensures detached functions receive `undefined` for `this`.
- **React `<StrictMode>`** is a development component that renders components twice to detect unintended side effects (Lesson 47).

### `onClick={this.handleLike}` hands React the method alone

Examine the button declaration in our post component:

```jsx title="src/Post.jsx" startLine="23"
<button onClick={~this.handleLike~}>{this.state.liked ? 'Liked' : 'Like'}</button> {/* Reads the method and hands it to React */}
```

Passing `onClick={this.handleLike}` extracts the method reference and supplies it to React as a callback (Lesson 11). When the user clicks, React triggers this function independently without an instance prefix.

Suppose an engineer reviewing the constructor removes the binding line for `handleLike`, assuming it to be redundant boilerplate:

```jsx title="src/Post.jsx" startLine="4"
  constructor(props) {
    super(props);
    this.state = { liked: false, saved: false };
    this.handleSave = ~this.handleSave.bind(this)~; // Only Save is still bound: the line for handleLike was deleted
  }
```

```page width=text caption="The post without the bind line for handleLike, when the page opens: no error yet."
line: Photo by Mia
line: [Like] [Save]
console: quiet
```

```page width=text caption="The same post right after the user clicks Like: the button stays on Like, and the Console shows a TypeError."
line: Photo by Mia
line: [Like] [Save] | bad
console: Uncaught TypeError: Cannot read properties of undefined (reading 'setState')
```

**The post mounts without error, but clicking Like crashes immediately.** The runtime breakdown proceeds as follows:
1. React renders the post initially. The render method extracts `this.handleLike` and registers the function reference with `onClick`.
2. The user clicks the Like button.
3. React invokes the registered handler callback detached from any instance.
4. Because the class executes in strict mode, `this` evaluates to `undefined`.
5. Executing `this.setState` attempts property access on undefined, triggering an uncaught `TypeError`.
6. Because the exception occurs within an event callback rather than during rendering, React leaves the mounted UI visible, leaving the button unresponsive.

Because the underlying cause is located in the constructor far from the button markup, diagnosing this bug can prove frustrating. Adding new buttons without corresponding constructor bindings creates identical crashes.

### Two fixes: `bind` in the constructor, or an arrow function in a class field

**The traditional solution binds the method explicitly inside the constructor.** Calling `bind` returns a new function bound permanently to the designated instance:

```jsx title="src/Post.jsx" startLine="4" good="4"
  constructor(props) {
    super(props);
    this.state = { liked: false, saved: false };
    this.handleLike = ~this.handleLike.bind(this)~; // Stores a copy of handleLike tied to this instance
    this.handleSave = this.handleSave.bind(this);
  }
```

This binding logic operates across three steps:
1. Inside the constructor, `this` refers to the newly allocated component instance.
2. Invoking `this.handleLike.bind(this)` generates a bound function that permanently locks its execution context to that instance.
3. The constructor reassigns this bound function back onto the instance under the same name, ensuring `render` passes a safe callback.

**The modern solution declares the handler as an arrow function within a class field.** Arrow functions do not declare an independent `this` binding, instead inheriting `this` lexically from their enclosing scope. Within a class field, lexical `this` resolves to the instance being created:

```jsx title="src/Post.jsx" startLine="3"
export default class Post extends Component {
  state = { liked: false, saved: false };

  handleLike = ~() =>~ { // An arrow in a class field: this is always the instance
    this.setState({ liked: !this.state.liked });
  };

  handleSave = () => {
    this.setState({ saved: !this.state.saved });
  };
```

The render method remains unchanged, referencing both handler methods on its buttons.

**Both patterns guarantee safe event handling.** Whether using constructor binding or arrow class fields, `onClick` receives a function with a stable instance reference. Arrow class fields eliminate the need for an explicit constructor entirely.

```tree caption="Three ways to hand handleLike to onClick, and what this is when the user clicks."
What `this` is inside `handleLike` on the click
- !A method with no `bind` [`onClick={this.handleLike}`] | React calls the function **alone** | `this` is **`undefined`**, and the click throws a **`TypeError`**
- +`bind` in the constructor [`this.handleLike.bind`] | A copy **tied to the instance** | `this` is the **instance**, and the button reads **Liked**
- +An arrow in a class field [`handleLike` `=>`] | The arrow has **no `this` of its own** | `this` is the **instance**, and the button reads **Liked**
```

---

## PRINCIPLE | One `useState` per field: the translated function keeps every field the class kept

> [!PRINCIPLE]
> **Principle 5: One `useState` Call per Field Replaces `this.state`**
>
> *To migrate a class component, move the JSX into a function body, receive props as parameters, assign each state field its own `useState` call, convert methods into local functions, and eliminate all `this` references. Function setters replace state values completely, so preserving a single state object requires explicit object spreading on every update.*
>
> A naive line by line translation may appear functional on initial load. However, while `this.setState` automatically merges partial updates, function state setters replace state entirely. Consequently, updating a single property on a shared state object erases omitted fields. Assigning each property its own `useState` hook avoids accidental data loss.
>
> **DO THIS:**
> ```jsx
> const [liked, setLiked] = useState(false);
> const [saved, setSaved] = useState(false);
> function handleLike() {
>   ~setLiked(!liked)~; // Changes liked only, and saved has its own variable
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const [post, setPost] = useState({ liked: false, saved: false });
> function handleLike() {
>   setPost({ ~liked: !post.liked~ }); // **WRONG:** replaces the whole state, so saved is gone
> }
> ```

### React's three steps to translate a class

When a component requires modern React features like `useContext`, migration to a function component becomes necessary. The official React documentation outlines three straightforward steps:
1. Declare a function component that accepts incoming props as arguments and initializes state variables.
2. Convert class methods into standard functions declared inside the component body.
3. Replace all property lookups that rely on `this` with the local variables and helper functions.

Applying these steps produces a clean function component:

```jsx title="src/Post.jsx"
import { useState } from 'react';

export default function Post({ ~author~ }) { // this.props.author becomes the parameter author
  const [liked, setLiked] = ~useState(false)~; // The liked field becomes its own state variable
  const [saved, setSaved] = useState(false);

  function handleLike() {
    ~setLiked(!liked)~; // this.setState with liked becomes setLiked
  }

  function handleSave() {
    setSaved(!saved);
  }

  return (
    <article>
      <p>Photo by {author}</p>
      <button onClick={~handleLike~}>{liked ? 'Liked' : 'Like'}</button> {/* No this, so nothing to bind */}
      <button onClick={handleSave}>{saved ? 'Saved' : 'Save'}</button>
    </article>
  );
}
```

**The migrated function behaves identically to the original class.** The component mounts cleanly and responds to clicks exactly as before. Every legacy construct translates directly into modern equivalents:
1. `this.props.author` becomes the destructured `author` parameter (Lesson 08).
2. Each property on `this.state` becomes an independent `useState(false)` hook.
3. Each class method becomes a closure function inside `Post`.
4. The return statement of `render` becomes the primary return statement of the component.
5. The constructor and its associated bindings are removed completely.

Method binding becomes obsolete because function components do not rely on class instances or `this`. Handlers close over the reactive state variables of the current render pass (Lesson 15).

### The trap: one state object with a setter loses a field

Developers frequently attempt a seemingly direct translation by preserving a single composite state object:

**DO NOT DO THIS:**
```jsx title="src/Post.jsx" startLine="4" bad="4,8"
  const [post, setPost] = useState({ liked: false, saved: false });

  function handleLike() {
    setPost({ ~liked: !post.liked~ }); // **WRONG:** the whole state becomes this one field, and saved is gone
  }

  function handleSave() {
    setPost({ ~saved: !post.saved~ }); // **WRONG:** the whole state becomes this one field, and liked is gone
  }
```

**This syntax looks deceptively familiar, but its runtime behavior is fundamentally different.** Calling `this.setState({ liked: true })` merges `liked` into the existing object. By contrast, a `useState` setter performs no merging whatsoever. The documentation defines the setter argument as the complete next state value. Calling `setPost({ liked: true })` replaces the entire state object with `{ liked: true }`, discarding all other properties.

**Preserving a single state object without spreading causes subsequent updates to erase omitted fields.** Notice what occurs when a user interacts with both buttons:

```page width=text caption="The translated post with one state object, after the user clicks Save: Like and Saved, as expected."
line: Photo by Mia
line: [Like] [Saved]
console: quiet
```

```page width=text caption="The same post after the user then clicks Like: Saved has turned back into Save."
line: Photo by Mia
line: [Liked] [Save] | bad
console: quiet
```

Here is the precise sequence of events:
1. The post mounts with its initial state object, rendering Like and Save.
2. The user clicks Save. Invoking `setPost({ saved: true })` replaces state with that single-property object. Because `post.liked` is now `undefined`, the Like button renders its fallback label Like.
3. The user then clicks Like. Invoking `setPost({ liked: true })` overwrites state completely, erasing the saved property.
4. The Save button unexpectedly reverts to Save even though the user never interacted with it.

This bug easily escapes detection during superficial testing. Clicking a single button appears to succeed, while sequential interactions silently corrupt state. Performing automated migrations that blindly replace `this.setState` with a single setter introduces this defect into every multi-property component.

### Two fixes: one variable per field, or a spread of the old object

The recommended fix separates state properties into independent `useState` variables as shown earlier. Each setter manages an isolated value, preventing cross-property interference.

Alternatively, if you choose to maintain a composite state object, you must manually spread previous properties on every update (Lesson 17):

```jsx title="src/Post.jsx" startLine="6" good="2"
  function handleLike() {
    setPost({ ~...post~, liked: !post.liked }); // Copies saved from the old object, then changes liked
  }
```

**Both approaches produce the identical user experience.** Manual object spreading replicates the automatic shallow merge that `this.setState` previously handled natively.

Combining state into a single object is primarily useful when properties update together concurrently. Because Like and Save toggle through independent interactions, separate state variables represent the cleaner architecture (Lesson 22).

---

## All 5 Principles Together

### The complete files

Here is the legacy 2019 class component containing all four foundational patterns:

```jsx title="src/Post.jsx, the 2019 class"
import { Component } from 'react';

export default class Post extends Component {
  constructor(props) {
    ~super(props)~; // Principle 2: super first, then this is safe
    this.state = { liked: false, saved: false }; // Principle 2: all the state in one object
    this.handleLike = ~this.handleLike.bind(this)~; // Principle 4: ties the method to this instance
    this.handleSave = this.handleSave.bind(this);
  }

  handleLike() {
    this.setState({ ~liked: !this.state.liked~ }); // Principle 3: merges liked, keeps saved
  }

  handleSave() {
    this.setState({ saved: !this.state.saved });
  }

  ~render()~ { // Principle 1: React calls render on the instance
    return (
      <article>
        <p>Photo by {this.props.author}</p>
        <button onClick={this.handleLike}>{this.state.liked ? 'Liked' : 'Like'}</button>
        <button onClick={this.handleSave}>{this.state.saved ? 'Saved' : 'Save'}</button>
      </article>
    );
  }
}
```

Here is the modern function component equivalent following a complete migration:

```jsx title="src/Post.jsx, the function today"
import { useState } from 'react';

export default function Post({ author }) {
  const [liked, setLiked] = ~useState(false)~; // Principle 5: one state variable per field
  const [saved, setSaved] = useState(false);

  function handleLike() {
    setLiked(!liked);
  }

  function handleSave() {
    setSaved(!saved);
  }

  return (
    <article>
      <p>Photo by {author}</p>
      <button onClick={handleLike}>{liked ? 'Liked' : 'Like'}</button>
      <button onClick={handleSave}>{saved ? 'Saved' : 'Save'}</button>
    </article>
  );
}
```

The parent application file requires zero modifications, rendering `<Post author="Mia" />` identically across both implementations:

```jsx title="src/App.jsx"
import Post from './Post.jsx';

export default function App() {
  return <Post ~author="Mia"~ />; // The same tag for the class and for the function
}
```

### How React calls each form when the page opens

When the page loads, React evaluates `App` first and encounters the `<Post />` element. The two paradigms then traverse different execution paths to yield the same JSX tree:

```tree caption="What React calls when the page opens: App first, then Post in either form, which returns the same JSX."
How React renders `App` and then `<Post author="Mia" />`
- +The class form [`class Post`] | 1. React calls **`App`**, which returns `<Post author="Mia" />` | 2. React makes a **`Post` instance** and runs the **constructor** | 3. React calls **`render`** on the instance and gets the JSX
- +The function form [`function Post`] | 1. React calls **`App`**, which returns `<Post author="Mia" />` | 2. React calls the function **`Post`** with the props | 3. **`useState`** hands back `liked` and `saved`, and `Post` returns the JSX
```

```page width=text caption="The finished post, the same for both forms, after the user clicks Like and Save."
line: Photo by Mia
line: [Liked] [Saved] | good
console: quiet
```

### Where each piece lives, in the class and in the function

| Piece | The 2019 class | The function today |
| :--- | :--- | :--- |
| **The JSX** | Returned by the `render` method | Returned by the function |
| **The props** | Read from `this.props.author` | Read from the parameter `author` |
| **The state** | One object on `this.state`, set in the constructor or a class field | One `useState` call per field |
| **The update** | `this.setState` merges the given fields | A setter replaces the whole state |
| **The handlers** | Methods, bound in the constructor or written as arrow class fields | Plain functions inside the component, with nothing to bind |
| **Hooks** | Do not work | Work |

Remember the foundational mental model of this lesson. **A class component is the same component you already write, with its props, its state, and its handlers all moved onto one object, this.**

---

## For the Interview

> **The Interview Question:** How do class components work, and how do you read one today?

### How to Answer Clearly in 30 Seconds

"A class component implements the same component contract as a modern function: it receives props, manages state across renders, and returns JSX. The class extends React's base Component and returns markup from a required render method. All component data and methods attach to a single instance object referenced through this:
1. **Props** attach to `this.props`.
2. **State** is consolidated into `this.state`, initialized once in the constructor after `super(props)` or declared as a class field.
3. **`this.setState`** shallowly merges partial updates into the state object, scheduling a re-render for the next pass.
4. **Handlers** must be bound in the constructor or authored as arrow class fields because React executes detached event callbacks without an instance context, leaving `this` undefined.

To read a class today, map each instance property onto its modern function equivalent. Lookups on `this.props` become function parameters, state fields map to individual `useState` hooks, and methods become local functions. Class components remain supported, but function components are recommended for modern development because Hooks only run in functions."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why did 2019 code bind every method in the constructor?"**
   Because JavaScript determines `this` dynamically at call time based on invocation context. In JSX, assigning `onClick={this.handleLike}` passes the method reference as a standalone callback. When the user clicks, React invokes the handler detached from the class instance. Because class bodies run in JavaScript strict mode, `this` resolves to `undefined`, causing `this.setState` to throw an uncaught `TypeError`. Adding `this.handleLike = this.handleLike.bind(this)` creates a bound function locked permanently to the instance. Arrow class fields achieve the same result without constructor ceremony because arrow functions capture `this` lexically. Function components do not use `this`, eliminating binding entirely.

2. **"What is the difference between `this.setState` and the setter from `useState`?"**
   Both tools schedule an asynchronous re-render and preserve previous state snapshots within currently executing code, meaning logging state immediately after calling either returns the old value. Both also accept functional updater callbacks like `this.setState(prev => ...)` and `setLiked(l => !l)`. The critical architectural difference is that `this.setState` shallowly merges the provided object into existing state, whereas a `useState` setter completely replaces the state value. Migrating `this.setState({ liked: true })` to `setPost({ liked: true })` on a composite state object erases all omitted fields unless developers explicitly spread the previous object.

3. **"Can you still write class components in React 19, and when do you still need one?"**
   Class components remain fully supported in React 19, though React documentation advises using functions for new development. Hooks cannot run inside class components, meaning classes that require modern features like `useContext` must be migrated. One specific capability still strictly requires a class: Error Boundaries (Lesson 72). React currently provides no function hook equivalent for `componentDidCatch` or `static getDerivedStateFromError`. React 19 also deprecated or removed legacy class features like `propTypes`, `contextTypes`, and legacy string refs with `this.refs`. Lifecycle methods like `componentDidMount` belong to Lesson 97.

```tree dir=right caption="Interview comparison: how each piece of a 2019 class maps onto a function component today."
From a 2019 class to a function today
- +Props and JSX [`this.props` `render`] | Become the **parameters** and the **return** of the function | Same props in, **same JSX out**
- +State [`this.state` `this.setState`] | Become **one `useState` call per field** | `this.setState` **merged**, a setter **replaces**
- +Handlers [`bind` `=>`] | Become **plain functions** inside the component | **No `this`**, so nothing to bind
```
