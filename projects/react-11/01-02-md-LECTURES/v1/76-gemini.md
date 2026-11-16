# Lecture 76: What a JSX Tag Becomes

*(What does `<h1>Hello</h1>` turn into, before React puts anything on the page?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | What does JSX compile into, and what is an element object?

---

## VS | A JSX tag vs. the real `<h1>` on the page: the tag is a plain object that only describes the heading

> In plain JavaScript, `document.createElement('h1')` produces a real DOM heading that you can populate with text and append to the page. **In React, a JSX tag like `<h1>Hello</h1>` compiles into a function call returning a plain JavaScript element object**. React inspects that descriptor object during render and creates the actual DOM node during commit. The object in your application code is an immutable blueprint, not a live browser node.

You write JSX every day when building interfaces: `<h1 className="greeting">Hello</h1>`. Because JSX tags look like HTML, it is easy to assume that this markup creates a DOM node immediately. It does not. Web browsers cannot parse JSX syntax natively. Before your source code reaches the browser, the build tool transforms every tag into a standard JavaScript function call (Lesson 07).

Here is the same heading, written as a tag and as the call that React documents:

```jsx title="The same heading, written as a JSX tag and as a createElement call"
import { createElement } from 'react';

const withJsx = ~<h1 className="greeting">Hello</h1>~; // What you write
const byHand = ~createElement('h1', { className: 'greeting' }, 'Hello')~; // What it means: the exact same object
```

Notice the distinction in names. React's `createElement` function is completely different from the browser's `document.createElement` method. Although they share a name, they perform two separate jobs:
1. **The browser's `document.createElement('h1')`** creates an actual DOM element node. It provides browser methods like `focus` and `append`.
2. **React's `createElement('h1', ...)`** creates a lightweight JavaScript descriptor object. It describes the desired tag, its attributes, and its children without creating a DOM node.

Who places the actual heading into the browser DOM? React does. Your component returns descriptor objects, React reconciles them, and React creates the real `<h1>` element during the commit phase (Lesson 13).

Why this matters: As long as you imagine a JSX tag as a real DOM node, three everyday bugs seem baffling:
1. You attempt to call `focus` on a tag saved in a variable. JavaScript throws a TypeError because plain objects lack DOM methods.
2. You attempt to mutate properties on an element after creating it. In development mode, JavaScript throws a TypeError because React freezes element objects.
3. You attempt to render an object received from a server directly as a child. React throws an error because server JSON objects lack React's internal element marker.

Once you understand that a JSX tag produces a plain descriptor object, each of these runtime behaviors makes total sense.

### One Tag, Opened in the Console

Let us inspect that element object directly. Assign a single JSX tag to a variable and print it to the browser console:

```jsx title="One JSX tag, stored in a variable and logged"
const title = ~<h1 className="greeting">Hello</h1>~; // Puts nothing on the page
console.log(title); // Prints the object below in the Console
```

```devconsole caption="The Console after the two lines above run: one object, opened with its small triangle."
v {$$typeof: Symbol(react.transitional.element), type: 'h1', key: null, props: {…}, _owner: null, …}
  $$typeof: Symbol(react.transitional.element) | Marks the object as a real React element
  key: null | No key was written on the tag
  props: {className: 'greeting', children: 'Hello'} | The attribute, and the text between the tags
  type: "h1" | The tag name, as a string
  _owner: null | Added by React in development
  _store: {validated: 0} | Added by React in development
  ref: null | No ref on the tag; React 19 keeps a ref in props
  _debugInfo: null | Added by React in development
  _debugStack: Error: react-stack-top-frame | Added by React in development
  _debugTask: {run: ƒ} | Added by React in development
```

No heading appears on the web page. The browser console displays no DOM node and no HTML markup. It displays a plain JavaScript object.

> [!DEFINITION]
> **A React element.** [REVIEW] A React element is a plain, immutable JavaScript object that describes what should appear on the screen.
> 1. You write a JSX tag: `const element = <h1>Hello</h1>`.
> 2. The build tool compiles the tag into a function call that returns an element object with `type` and `props`.
> 3. React reads the element during render and creates the corresponding DOM node during the commit phase.
>
> An element holds no state and owns no DOM nodes. It is merely a blueprint; React consumes the object, and whenever a component re-renders, it creates fresh element objects (Lessons 02 and 13).

Four primary fields on this element object govern rendering:
1. **`type`** specifies what to render. In this example, it is the string `'h1'`, indicating a built-in HTML tag.
2. **`props`** holds all tag attributes. Its `children` property contains whatever content sits between the opening and closing tags (Lesson 09).
3. **`key`** holds the unique identifier assigned to the tag, or `null` when no key is specified.
4. **`$$typeof`** contains an internal symbol identifying the object as a genuine React element. You never configure this property manually; React assigns it automatically.

The remaining properties support React's internal developer tooling. In development mode, React attaches debug fields such as `_owner` and other internal metadata. Application code should never read or depend on these internal properties. The `ref` property remains `null`. This occurs because React 19 passes refs directly inside component props.

### The Rule of Thumb: the tag describes, React builds

**A JSX tag is a function call that returns a plain object. Writing a tag creates nothing in the DOM. React evaluates the returned object later and constructs the appropriate UI elements.**

```tree dir=right caption="A JSX tag becomes a plain object that describes the screen; React creates the real DOM node later."
What `<h1 className="greeting">Hello</h1>` becomes
- +1. The JSX tag [`<h1 className="greeting">Hello</h1>`] | What **you write** in the file | The build turns it into **a function call**
- +2. The React element [`type` `props` `key` `$$typeof`] | A **plain object** that the call returns | It **describes** the heading; nothing is on the page yet
- +3. The DOM node [`<h1 class="greeting">`] | Created **by React during the commit** | Only for an element that **reaches React**
```

Experienced developers avoid three common misconceptions regarding elements:
1. **Avoiding JSX in variables.** Some developers fear that assigning JSX to a variable executes components eagerly or allocates heavy DOM structures. The official React documentation clarifies that creating element objects is extremely lightweight, so there is no need to avoid storing them in variables or helper functions.
2. **Reading `key` inside child components.** The child component receives `undefined` because React reserves keys for reconciliation (Lesson 18).
3. **Mutating an element's props directly.** Trying to alter existing element objects violates immutability and throws runtime errors.

The remainder of this lesson demonstrates each principle using a concrete comment list application.

## SECTION | The Comment List Under an Article

Our example application is a comment section underneath an online article. This familiar interface displays a section heading followed by individual comment entries.

```page width=text caption="The comment list under an article: a heading and two comments."
heading: Comments
line: John: Great article!
line: Mia: Me too!
```

Developers construct list interfaces like this constantly. Here, understanding element objects shifts from abstract theory to daily debugging practice. When a comment fails to appear or displays stale text, you open browser developer tools to inspect element descriptors. Each list row requires a `key`, and comment records arrive asynchronously from a backend server as JSON. Consequently, this simple screen exercises every property on the React element object.

The demonstration project consists of four modular files:

```files title="comment-list: File Explorer" caption="The four files of our comment list inside src/."
src/
  main.jsx | boundary | Mounts `App` with `createRoot`, inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and renders `<CommentList />`
  CommentList.jsx | default export | Holds the `comments` array and maps each comment to a `<Comment />` element
  Comment.jsx | default export | Shows one comment line and logs `Comment rendered:` with the author
```

The root application entry point mounts `App` inside StrictMode, while `App` renders the comment list:

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

```jsx title="src/App.jsx"
import CommentList from './CommentList.jsx';

export default function App() {
  return <CommentList />;
}
```

The `Comment` component displays the author name in bold text followed by the comment body. Its logging statement confirms each time React invokes the component function:

```jsx title="src/Comment.jsx"
export default function Comment({ author, text }) {
  ~console.log('Comment rendered:', author);~ // Prints one line each time React calls Comment
  return <p><b>{author}</b>: {text}</p>;
}
```

The `CommentList` component stores two comment records in an array. Using the array `map` method, it creates one `<Comment />` element for each entry (Lesson 18):

```jsx title="src/CommentList.jsx"
import Comment from './Comment.jsx';

const comments = [
  { id: 1, author: 'John', text: 'Great article!' },
  { id: 2, author: 'Mia', text: 'Me too!' },
];

export default function CommentList() {
  return (
    <section>
      <h2>Comments</h2>
      {comments.map(c => (
        ~<Comment key={c.id} author={c.author} text={c.text} />~ // One element for each comment
      ))}
    </section>
  );
}
```

The rendered page displays the section title and both comments. The console outputs two log entries per comment because development mode `<StrictMode>` executes render functions twice to detect side effects (Lessons 14 and 47):

```page width=text caption="The working comment list: the heading, two comments, and two Console lines for each comment."
heading: Comments
line: John: Great article!
line: Mia: Me too!
log: Comment rendered: John | Comment.jsx:2
log: Comment rendered: John | Comment.jsx:2
log: Comment rendered: Mia | Comment.jsx:2
log: Comment rendered: Mia | Comment.jsx:2
```

Each upcoming principle modifies the comment list component to demonstrate an isolated experiment, and then restores working code.

**PRINCIPLES:** A JSX tag compiles into a function call returning a plain descriptor object. React inspects these objects during render, and only elements returned into React's tree reach the browser screen. Five fundamental principles govern this architecture:
1. **Principle 1: A JSX Tag and createElement Build the Same Element.** The compiler transforms every JSX tag into a function call. Tag names, attributes, and child nodes map directly to function arguments.
2. **Principle 2: A Comment Kept in a Variable Never Reaches the Page.** Creating an element does not execute component functions or create DOM nodes. Element objects contain no DOM manipulation methods.
3. **Principle 3: key Leaves props for the Element.** React removes `key` from component props, coerces it to a string, and stores it directly on the element object. The component never receives `key` as a prop.
4. **Principle 4: A Frozen Element Rejects New Text.** React freezes element objects and their props in development mode, so property mutations throw errors. Displaying new content requires creating a fresh element.
5. **Principle 5: A JSON Copy Loses $$typeof.** JSON serialization cannot preserve symbol values. Deserialized objects lack React's internal element marker, causing React to reject them during render.

---

## PRINCIPLE | JSX tag: a function call that returns the same element as `createElement`

> [!PRINCIPLE]
> **Principle 1: The JSX Transform: A JSX Tag and createElement Build the Same Element**
>
> *Before the browser gets the file, a build tool turns every JSX tag into a function call; `createElement(type, props, ...children)` is the call React documents, and it gives the exact same element as the tag.*
>
> Browsers cannot parse JSX syntax natively, so compilers like Vite transform each tag before delivering code. The tag name becomes the `type` argument, tag attributes form the `props` object, and nested tags become children. A capitalized tag name preserves your component function reference. A lowercase tag name converts to a string, which React interprets as a native DOM element.
>
> **DO THIS:**
> ```jsx
> ~<Comment author="John" text="Great article!" />~ // type is our Comment function, so React calls Comment
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~<comment author="John" text="Great article!" />~ // **WRONG:** type is the string 'comment', so Comment never runs!
> ```

Here is a component tag from React's documentation, written both ways:

```jsx title="A component tag written with JSX and with createElement"
<Greeting name="Taylor" /> {/* Written with JSX */}
~createElement(Greeting, { name: 'Taylor' })~ // Written by hand: the same element
```

The React documentation emphasizes that both lines produce identical element objects. Each component of a JSX tag maps to a specific function argument:
1. **The tag name maps to the first argument, `type`.** Here it passes the `Greeting` component function itself without invoking it.
2. **The attributes map to the second argument, `props`.** Here it passes an object containing the `name` property.
3. **Nested content maps to subsequent arguments representing children.** Because `<Greeting />` is self-closing, it passes no child arguments. In our opening heading example, the string `'Hello'` served as the third argument.

```tree dir=right caption="Each part of a JSX tag lands in one argument of createElement."
How a tag maps onto `createElement`
- +1. The tag name [`h1` `Greeting`] | Becomes the **first argument**, `type` | A **string** for a built-in tag, **your function** for a component
- +2. The attributes [`className="greeting"` `name="Taylor"`] | Become the **second argument**, `props` | One object, as in Lesson 08
- +3. Between the tags [`Hello`] | Become **the rest of the arguments** | React stores them in `props.children`
```

### VS | `<Comment />` vs. `<comment />`: your function or a built-in tag name

You already follow the convention of capitalizing React component names (Lesson 04). Now you can observe the compiler mechanism behind this rule. The initial letter dictates what the compiler assigns to `type`:

```jsx title="A capital first letter and a lowercase first letter"
<Comment /> {/* Becomes createElement with Comment as type: React calls your function */}
~<comment />~ // Becomes createElement with the string 'comment' as type: a built-in HTML tag
```

When a tag begins with an uppercase letter, the compiler places the function identifier `Comment` into `type`. When a tag begins with a lowercase letter, the compiler treats the name as a string literal `'comment'`. React interprets string types as standard HTML tags and will never execute your component function for lowercase tags.

### Why two tags side by side need a wrapper

This compilation model also explains why React components must return a single root tag (Lesson 02). Because each JSX tag compiles into a function call returning an object, placing two adjacent tags produces two separate expressions without an enclosing container:

```jsx title="Two tags with no wrapper, and the same two tags inside a section"
const withoutWrapper = ~<h2>Comments</h2><p>John: Great article!</p>~; // **WRONG:** two objects side by side: the build stops with an error
const withSection = <section><h2>Comments</h2><p>John: Great article!</p></section>; // One object, with the heading and the line as its children
```

Standard JavaScript functions cannot return two distinct values simultaneously without an array or wrapper. As the React documentation explains, JSX transforms into plain JavaScript objects, and returning multiple sibling objects requires wrapping them in an array or parent container. Wrapping adjacent tags in an enclosing element, such as `<section>`, or a Fragment `<>...</>`, combines multiple child descriptors into a single parent element.

### Who writes the call: the JSX transform

Developers rarely invoke element creation functions manually. Modern build tooling like Vite automatically converts JSX tags during compilation (Lessons 02 and 07).

> [!DEFINITION]
> **The JSX transform.** [NEW] The JSX transform is the compile step that turns JSX tags into JavaScript function calls before code reaches the browser.
> 1. Browsers cannot parse JSX syntax natively.
> 2. A compiler like Vite transforms each tag into a runtime helper call, such as `_jsxDEV` or `createElement`.
> 3. The transformed call executes at runtime to produce plain React element objects.
>
> JSX and React are independent tools. JSX provides convenient declarative syntax, while React consumes the resulting element objects to construct the UI (Lessons 07 and 76).

In development mode, Vite compiles tags into calls to `_jsxDEV` (Lesson 02). This helper function originates from React's internal development runtime module. Production builds use an optimized production runtime module instead. The build compiler inserts these imports automatically, freeing component files from importing runtime helpers manually.

Consequently, modern React components utilize JSX syntax without explicitly importing React. React 19 expects this modern compilation pipeline. Legacy configurations formerly transformed tags into `React.createElement`, which mandated importing `React` into every file. When older projects run obsolete transform pipelines, React 19 issues this console warning:

```devconsole width=full caption="The warning React 19 prints when an app still uses the old JSX transform."
! Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform
```

`createElement` remains the official public API for constructing elements manually. When writing manual element factories, you import `createElement` directly from the `react` package.

### The same list, written with createElement

Developers can author component output using two equivalent syntaxes:
1. **JSX syntax.** The vast majority of developers prefer JSX because its XML-like structure mirrors the resulting UI hierarchy clearly. This workflow relies on build tooling like Vite (Lesson 07).
2. **Manual `createElement` calls.** Teams that cannot run a build compiler or choose not to use JSX can invoke `createElement` directly.

Both approaches construct identical element trees. To demonstrate this equivalence, examine our comment list component rewritten entirely without JSX markup:

```jsx title="src/CommentList.jsx, written with createElement"
import { createElement } from 'react';
import Comment from './Comment.jsx';

const comments = [
  { id: 1, author: 'John', text: 'Great article!' },
  { id: 2, author: 'Mia', text: 'Me too!' },
];

export default function CommentList() {
  return createElement(
    ~'section'~, // 1. The section tag: a string
    null, // 2. No attributes on the section
    createElement('h2', null, 'Comments'), // 3. First child: the heading
    comments.map(c =>
      ~createElement(Comment, { key: c.id, author: c.author, text: c.text })~ // 4. Second child: the array of comments
    )
  );
}
```

The browser renders the exact same DOM structure and logs identical console output:

```page width=text caption="The comment list built with createElement: the exact same page and the same Console lines."
heading: Comments
line: John: Great article!
line: Mia: Me too!
log: Comment rendered: John | Comment.jsx:2
log: Comment rendered: John | Comment.jsx:2
log: Comment rendered: Mia | Comment.jsx:2
log: Comment rendered: Mia | Comment.jsx:2
```

Two architectural details in this programmatic version warrant close attention:
1. **`key` resides in the props object argument.** When calling `createElement`, you pass `key` alongside regular attributes such as author. Principle 3 reveals how React immediately extracts `key` from props.
2. **The mapped array passes as a single child argument.** When rendering dynamic collections, passing the mapped array as a single argument allows React to validate sibling keys and issue missing key warnings.

Why do development teams overwhelmingly favor JSX over manual calls? Visual readability and hierarchy. In nested `createElement` trees, matching opening functions to closing parentheses becomes tedious. Furthermore, the React documentation categorizes manual `createElement` usage as an edge-case approach, recommending JSX for standard applications. We now return our comment list to clean JSX.

Remember: A JSX tag compiles into a function call, and that call returns a plain JavaScript object.

---

## PRINCIPLE | React element: creating it calls no component and puts nothing on the page

> [!PRINCIPLE]
> **Principle 2: React Elements: An Element Describes the Screen and Renders Nothing by Itself**
>
> *A JSX tag returns a React element, a plain object that describes what to show; creating it does not call the component and does not create a DOM node.*
>
> React executes a component function only when it evaluates an element returned into the active render tree. An element assigned to a variable remains an inert JavaScript object in memory. Because elements are lightweight descriptions, creating them incurs minimal overhead. To access real browser DOM nodes, use a React ref.
>
> **DO THIS:**
> ```jsx
> const inputRef = useRef(null);
> function handleReply() {
>   ~inputRef.current.focus();~ // The real input field on the page, after the commit
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const field = <input placeholder="Write a reply" />;
> function handleReply() {
>   ~field.focus();~ // **WRONG:** field is a plain element object, so focus is not a function!
> }
> ```

The React documentation illustrates an element object in simplified form:

```js title="The element for the Greeting tag, slightly simplified by React's docs"
{
  ~type: Greeting~, // Your function itself, not called
  props: { name: 'Taylor' },
  key: null,
  ref: null,
}
```

Inspect the `type` property in this object. It holds a reference to the `Greeting` function without invoking it. The React documentation explicitly notes that instantiating this object does not render the component or generate browser DOM nodes.

When does `Greeting` actually run? Only when React traverses an element returned by an active component. An element retained in a local variable remains an inert descriptor object in memory.

### VS | An element in the `return` vs. an element in a variable: only the returned one reaches React

Suppose a developer wants to inspect a preview element for a new comment before publishing it. Inside `CommentList`, the developer creates the element and logs it to the console, leaving the component return statement unchanged:

```jsx title="src/CommentList.jsx" startLine="8"
export default function CommentList() {
  const preview = ~<Comment author="Leo" text="First!" />~; // Creates an element; nothing calls Comment yet
  console.log(preview);
  return (
    <section>
      <h2>Comments</h2>
      {comments.map(c => (
        <Comment key={c.id} author={c.author} text={c.text} />
      ))}
    </section>
  );
}
```

Leo's preview comment appears solely inside the console object log. The browser page continues displaying only John and Mia, and the console shows no render log for Leo:

::: row caption="After adding preview: the page still shows two comments, and the Console shows Leo's element but no line from Comment for Leo."
::: col title="On the Page" tone=plain
```page size=mini
heading: Comments
line: John: Great article!
line: Mia: Me too!
```
:::
::: col title="In Chrome's Console Panel" tone=good
```devconsole source="CommentList.jsx:10"
v {$$typeof: Symbol(react.transitional.element), type: ƒ, key: null, props: {…}, _owner: FiberNode, …}
  key: null
  props: {author: 'Leo', text: 'First!'}
  type: ƒ Comment({ author, text }) | Our function itself, not called
> {$$typeof: Symbol(react.transitional.element), type: ƒ, key: null, props: {…}, _owner: FiberNode, …} | The second call of CommentList, from StrictMode
+ Comment rendered: John
+ Comment rendered: John
+ Comment rendered: Mia
+ Comment rendered: Mia
```
:::
:::

Here is the precise sequence of operations:
1. React invokes `CommentList`. Its first statement evaluates `<Comment author="Leo" text="First!" />` to create `preview`. The element holds the `Comment` function in `type` alongside author and text props.
2. `console.log` logs the descriptor object. Because React has not invoked `Comment` for Leo, no render message appears.
3. `CommentList` returns the section containing John and Mia. The `preview` element is absent from this returned tree.
4. React receives the returned tree and invokes `Comment` for John and Mia. Each execution logs its corresponding message.
5. Because React never received Leo's element, it never invokes `Comment` for Leo and never creates DOM elements for it.

Two properties in the logged object illustrate key element characteristics. The `type` property stores a direct reference to the `Comment` function because the tag began with a capital letter. The `key` property defaults to `null` because no key attribute was declared.

### The component, the element, and the DOM node

Three related technical terms describe distinct entities in React architecture:
1. **The component** is your JavaScript function, such as `Comment`. It is stored inside an element's `type` property.
2. **The element** is the plain object returned by `<Comment author="Leo" text="First!" />`. It serves as a declarative blueprint of what to render.
3. **The DOM node** is the real browser `<p>` element on the page. React constructs it during the commit phase, and only for elements included in the returned tree (Lesson 13).

```tree caption="The component is the function, the element is the object, and the DOM node is what React creates on the page."
Three things behind one comment line
- +The component [`Comment`] | **Your function** | Sits in the element's **`type`** field
- +The element [`<Comment author="Leo" text="First!" />`] | A **plain object** that describes the line | Costs almost nothing to create; **renders nothing** by itself
- +The DOM node [`<p>`] | The **real paragraph** on the page | Created **by React during the commit**, only for elements React receives
```

Because React elements are standard JavaScript objects, you can place them anywhere normal values can reside: in local variables, arrays, or component props like `children` (Lesson 09). Creating elements costs almost nothing. You never need to avoid storing JSX expressions in variables or helper routines.

React recommends treating element objects as **opaque**. Once an element is created, application code should treat it as an immutable token to hand to React rather than reading and modifying its internal properties directly.

> [!DEFINITION]
> **A React node.** [NEW] A React node is any value that React can render as part of its component tree.
> 1. React elements are nodes created by JSX tags or `createElement`.
> 2. Primitive values like strings and numbers render as browser text nodes.
> 3. Booleans, `null`, and `undefined` are valid nodes that render nothing on the screen.
> 4. Arrays of nodes and portals are also valid renderable nodes.
>
> Every React element is a React node, but not every node is an element. Elements are specific JavaScript objects containing `type` and `props` (Lesson 76).

### The real mistake: calling focus on an element

In traditional vanilla JavaScript, you query an `<input>` node from the document and invoke `focus` directly on it:

```js title="Plain JavaScript: you hold the real input field"
~document.querySelector('input').focus()~; // A real element of the page, so focus exists
```

This works in vanilla JavaScript because `querySelector` returns a genuine browser DOM node. Now consider what happens when a developer applies this mental model to React. A reply form features an input field alongside a submit button. When the user clicks the button, the developer attempts to move focus into the input by calling `focus` on an element stored in a variable:

```jsx title="src/ReplyForm.jsx"
export default function ReplyForm() {
  const field = <input placeholder="Write a reply" />;

  function handleReply() {
    ~field.focus();~ // **WRONG:** field is an element object, not the input field on the page, so focus does not exist!
  }

  return (
    <>
      {field}
      <button onClick={handleReply}>Reply</button>
    </>
  );
}
```

When the user clicks Reply, the browser cursor fails to enter the input box, and the console reports a runtime exception:

```page width=text caption="After the user clicks Reply: the cursor is not in the input field, and the Console shows a TypeError."
form:
  field: Write a reply | | bad
  button: Reply
error: Uncaught TypeError: field.focus is not a function
```

The variable `field` holds a plain React element object, not a browser DOM node. The object contains properties like `type` and `props`, but none of the imperative methods provided by the browser DOM. When code attempts to invoke a non-existent method, JavaScript throws a TypeError.

The real browser `<input>` element exists only after React completes its commit phase. To access that underlying DOM node, use a React ref (Lesson 31). When you attach a ref to a JSX tag, React assigns the underlying browser node to `ref.current` after mounting:

```jsx title="src/ReplyForm.jsx"
import { useRef } from 'react';

export default function ReplyForm() {
  const inputRef = useRef(null);

  function handleReply() {
    ~inputRef.current.focus();~ // current holds the real input field on the page
  }

  return (
    <>
      <input ref={inputRef} placeholder="Write a reply" />
      <button onClick={handleReply}>Reply</button>
    </>
  );
}
```

With a ref in place, clicking Reply successfully moves focus to the live input field.

Remember: A React element is merely a blueprint describing an interface. Only React creates the actual DOM node, and only a ref provides access to it.

---

## PRINCIPLE | key: React keeps it on the element, so the component never receives it

> [!PRINCIPLE]
> **Principle 3: The key Field: key Lives on the Element, Not in props**
>
> *React takes `key` out of the props written on the tag, turns it into a string, and stores it on the element as `element.key`; the component never receives it.*
>
> Although `key` and standard props look identical in JSX tags, React routes them to different destinations. Custom props like `author` pass into the component's `props` argument. The `key` attribute remains on the element object for React's reconciliation engine. Reading `key` inside a component yields `undefined`. If a component requires the same identifier, pass it under a different prop name.
>
> **DO THIS:**
> ```jsx
> <Comment key={c.id} ~id={c.id}~ author={c.author} text={c.text} /> // id reaches Comment as a prop
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function Comment({ ~key~, author, text }) { // **WRONG:** key is never in props, so it is undefined!
>   return <p id={'comment-' + key}>{text}</p>;
> }
> ```

### VS | `key` vs. `author` on the same tag: one goes to React, one goes to the component

You declare `key` and regular props side by side on a JSX tag:

```jsx title="key and author written on the same tag"
const element = <Comment ~key={1}~ author="John" />; // key: '1' on the element; props: { author: 'John' }
```

Despite their similar appearance in markup, they are routed to separate locations. The `author` attribute is placed inside the component's `props` object. The `key` attribute is assigned directly to `element.key`. The React documentation notes that `key` is special and will not be accessible via `element.props.key`.

```tree caption="key and author sit on the same tag but land in two different places on the element."
Where each attribute of `<Comment key={1} author="John" />` lands
- +`author="John"` | Goes **into `props`** | The component reads it as **`author`**
- +`key={1}` | Goes **onto the element** as **`element.key`** | Turned into the **string `'1'`**; `props` has **no `key`**
```

### Logging the first element of the list

To observe this separation directly, inspect the elements generated by `map` inside `CommentList`. Store the mapped elements in an array, log the first element, and return the collection:

```jsx title="src/CommentList.jsx" startLine="8"
export default function CommentList() {
  const items = comments.map(c => (
    <Comment key={c.id} author={c.author} text={c.text} />
  ));
  ~console.log(items[0]);~ // The element for John's comment
  return (
    <section>
      <h2>Comments</h2>
      {items}
    </section>
  );
}
```

The screen output remains unchanged. In the console, the logged element reveals that `key` is stored as a string, while `props` contains only author and text:

```devconsole source="CommentList.jsx:12" caption="The element for John's comment: the key is a string on the element, and props has no key."
v {$$typeof: Symbol(react.transitional.element), type: ƒ, key: '1', props: {…}, _owner: FiberNode, …}
  key: "1" | A string, though c.id is the number 1
  props: {author: 'John', text: 'Great article!'} | No key inside props
  type: ƒ Comment({ author, text })
> {$$typeof: Symbol(react.transitional.element), type: ƒ, key: '1', props: {…}, _owner: FiberNode, …} | The second call of CommentList, from StrictMode
+ Comment rendered: John
+ Comment rendered: John
+ Comment rendered: Mia
+ Comment rendered: Mia
```

Notice that although `c.id` supplied numeric 1, the console displays `"1"` as a string. During element construction, React performs three distinct actions:
1. It removes `key` from the props bag passed to the tag.
2. It coerces the key value into a string. If no key was supplied, it defaults to `null`.
3. It attaches the coerced string directly to `element.key`, completely isolated from `props`.

### The real mistake: reading key inside the component

A common mistake occurs when a child component needs its own identifier, such as generating an HTML element id for deep linking. A developer tries to read `key` directly from props:

```jsx title="src/Comment.jsx"
export default function Comment({ ~key~, author, text }) { // **WRONG:** key is not in props, so it is undefined!
  return <p id={'comment-' + key}><b>{author}</b>: {text}</p>;
}
```

The page renders without crashing, but every comment receives the broken attribute `id="comment-undefined"`. In development mode, React detects access to `key` on props and emits this explicit warning (Lesson 18):

```devconsole width=full caption="The warning React prints when a component reads key from its props."
x Comment: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)
```

The React documentation explains that components never receive `key` as a prop because React reserves keys as internal reconciliation hints. To consume the same identifier inside child rendering logic, pass the value explicitly under a separate prop name like `id`:

```jsx title="src/CommentList.jsx" startLine="13"
<Comment key={c.id} ~id={c.id}~ author={c.author} text={c.text} /> // id reaches Comment as a normal prop
```

Why does React enforce this strict boundary? Because keys serve React's internal reconciler, not component logic. During re-renders, React compares the `type` and `key` of element descriptors across renders to determine whether to preserve, update, or discard existing DOM instances.

In earlier React versions, `ref` was similarly excluded from props and attached directly to the element. React 19 modernized this behavior: function components now receive `ref` directly as a standard prop, and accessing `element.ref` is deprecated.

Remember: The `key` property belongs to React's reconciler. When a component requires the identifier, pass it under a distinct prop name.

---

## PRINCIPLE | props of an element: frozen after creation, so new text needs a new element

> [!PRINCIPLE]
> **Principle 4: Immutable Elements: Create a New Element Instead of Changing One**
>
> *React elements and their props never change after creation; in development, React freezes them shallowly, so an assignment throws in a module, and different text needs a new element.*
>
> An element is a finished description. In development, React calls `Object.freeze` on each element and its `props`, and every module runs in strict mode, so assigning to `props.text` throws a `TypeError` and the page goes blank. In production the freeze is skipped, but the rule holds. To show different text, create a new element, which is cheap.
>
> **DO THIS:**
> ```jsx
> const edited = ~<Comment author="Leo" text="Edited" />~; // A new element with the new text
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const preview = <Comment author="Leo" text="First!" />;
> ~preview.props.text = 'Edited';~ // **WRONG:** the element is frozen in development, so this throws a TypeError!
> ```

The React documentation establishes a strict contract regarding element immutability (Lesson 58). You must treat React elements and their props as immutable and never change their contents after creation. In development, React shallowly freezes both the returned element object and its `props` object to enforce this rule.

To understand how freezing works, observe standard JavaScript behavior:

```js title="Plain JavaScript: a frozen object inside a module"
const user = Object.freeze({ name: 'John' });
~user.name = 'Mia';~ // Throws a TypeError, because a module runs in strict mode
```

Two definitions explain that behavior.

> [!DEFINITION]
> **Object.freeze.** [NEW] `Object.freeze` is a built-in JavaScript method that prevents adding, removing, or modifying properties on an object.
> 1. In development mode, React calls `Object.freeze` on every newly created element object and its `props`.
> 2. The freeze is shallow, meaning nested objects passed inside props remain unfrozen unless separately frozen.
> 3. Any attempt to modify a property of a frozen object in strict mode throws an immediate `TypeError`.
>
> Freezing enforces element immutability, ensuring that React can safely compare elements and trust that rendered descriptions do not mutate unexpectedly (Lesson 76).

> [!DEFINITION]
> **JavaScript strict mode.** [NEW] JavaScript strict mode is an opt-in runtime mode that catches silent coding mistakes and turns them into explicit errors.
> 1. In non-strict mode, assigning to a frozen object property fails silently without updating the value.
> 2. In strict mode, assigning to a read-only property throws an immediate `TypeError`.
> 3. All ES modules with `import` or `export` statements run in JavaScript strict mode by default.
>
> JavaScript strict mode is a language-level engine feature. It is completely separate from React's `<StrictMode>` development wrapper (Lessons 05 and 76).

Because modern React applications execute as ES modules, mutating a frozen element property triggers an immediate runtime exception rather than failing silently.

### Changing Leo's text inside CommentList

Consider what occurs when a developer attempts to alter the text of Leo's preview element before rendering:

```jsx title="src/CommentList.jsx" startLine="8"
export default function CommentList() {
  const preview = <Comment author="Leo" text="First!" />;
  ~preview.props.text = 'Edited';~ // **WRONG:** assigns to a frozen object inside a module
  return (
    <section>
      <h2>Comments</h2>
      {comments.map(c => (
        <Comment key={c.id} author={c.author} text={c.text} />
      ))}
    </section>
  );
}
```

This single assignment breaks rendering and blanks the screen. The existing comments disappear, and the console reports a property assignment error:

```page width=text caption="The page after preview.props.text is assigned in development: the page is blank, and JavaScript reports a read-only property."
blank
error: Uncaught TypeError: Cannot assign to read only property 'text' of object '#<Object>'
warn: An error occurred in the <CommentList> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

Here is why this failure occurs step by step:
1. React invokes `CommentList`, whose first statement instantiates `preview`. In development mode, React shallowly freezes both the element object and its `props` container.
2. The subsequent statement attempts to assign `'Edited'` to `preview.props.text`.
3. Because the file is an ES module running in JavaScript strict mode, the JavaScript runtime throws a TypeError.
4. The exception interrupts `CommentList` before it can return its UI. Because rendering failed without an error boundary, React unmounts the component tree and clears the screen.

React performs this shallow freezing exclusively during development. In production builds, the freeze step is omitted to optimize performance, meaning property assignment would fail to throw an error. However, the architectural requirement of immutability remains absolute.

### Creating a new element instead

To display modified content, construct a brand-new element containing the updated values:

```jsx title="src/CommentList.jsx" startLine="9"
const edited = ~<Comment author="Leo" text="Edited" />~; // A new element: cheap, and nothing is frozen
```

Mutating an existing element violates immutability and throws in development. Creating a fresh element allocates an inexpensive descriptor object without side effects. We now remove the experimental preview code, restoring `CommentList` to its working state.

```tree caption="Changing a created element throws in development; creating a new element is the fix."
Two ways to give Leo's comment the text Edited
- !Assign into the element [`preview.props.text = 'Edited'`] | Changes a **frozen** object inside a **module** | JavaScript throws a **`TypeError`**, and the page goes **blank**
- +Create a new element [`<Comment author="Leo" text="Edited" />`] | Makes a **new object** from new props | **Cheap**, and nothing is changed
```

### The real mistake: changing the props of children

This same mutation bug frequently surfaces when developers build container components. Suppose an author pins John's comment to the top of the discussion. A `PinnedComment` wrapper receives the comment element via its `children` prop (Lesson 09):

```jsx title="src/CommentList.jsx"
<PinnedComment>
  ~<Comment author="John" text="Great article!" />~ {/* Arrives inside PinnedComment as children */}
</PinnedComment>
```

The wrapper tries to prefix the comment text by mutating `children.props` directly:

```jsx title="src/PinnedComment.jsx"
export default function PinnedComment({ children }) {
  ~children.props.text = 'Pinned: ' + children.props.text;~ // **WRONG:** children is a frozen element!
  return children;
}
```

In development mode, this mutation crashes with the same TypeError. While React offers a legacy `cloneElement` utility to derive elements from existing ones, the documentation cautions that cloning creates brittle, hard-to-maintain code. The standard React design pattern passes raw data props and allows the component to construct its own element tree:

```jsx title="src/PinnedComment.jsx"
import Comment from './Comment.jsx';

export default function PinnedComment({ author, text }) {
  return ~<Comment author={author} text={'Pinned: ' + text} />~; // Builds a new element from props
}
```

With this clean pattern, `<PinnedComment author="John" text="Great article!" />` renders `John: Pinned: Great article!` reliably without errors.

Why does React demand strict immutability for elements? Because immutable descriptors allow React's reconciler to skip re-rendering unchanged subtrees safely (Lesson 58). Mutating elements during render also violates component purity by mutating values created outside the current render pass (Lesson 14).

Remember: Never mutate an existing element object. Always instantiate a new element.

---

## PRINCIPLE | `$$typeof`: only JSX and `createElement` make a real element, never JSON

> [!PRINCIPLE]
> **Principle 5: The $$typeof Field: Only JSX and createElement Make Elements**
>
> *A real element carries a `Symbol` in `$$typeof`; JSON cannot hold a `Symbol`, so an object rebuilt from JSON is not an element, `isValidElement` returns `false`, and React refuses to render it.*
>
> An object containing `type` and `props` does not constitute a valid React element. Only JSX compilation and `createElement` attach React's internal security symbol to `$$typeof`. Because `JSON.stringify` discards symbol properties, server JSON payloads cannot masquerade as React elements. Attempting to render raw server objects triggers an invalid child error. To display backend data, render its string or number properties explicitly.
>
> **DO THIS:**
> ```jsx
> <p>~{comment.text}~</p> // A string from the server: React shows it as text
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <p>~{comment}~</p> // **WRONG:** a plain object from JSON has no $$typeof, so React refuses it!
> ```

React provides a built-in utility function to verify whether an arbitrary value is a genuine element:

```jsx title="What isValidElement says about a JSX tag and a plain object"
isValidElement(<p />); // true: made by JSX
~isValidElement({ age: 42 })~; // false: a plain object
```

The `isValidElement` function validates whether an object meets React's internal element requirements. The official documentation notes that only JSX expressions and objects produced by `createElement` qualify as valid elements.

### What JSON does to a Symbol

Observe how standard JavaScript handles symbols during JSON serialization:

```js title="Plain JavaScript: a Symbol does not survive JSON"
const user = { name: 'John', tag: Symbol.for('vip') };
~JSON.stringify(user)~; // Gives the text {"name":"John"}: the Symbol field is gone
```

> [!DEFINITION]
> **A JavaScript Symbol.** [NEW] A `Symbol` is a primitive JavaScript data type that represents a unique, immutable identifier.
> 1. Unlike strings or numbers, symbols cannot be serialized into JSON text.
> 2. Global symbols created with `Symbol.for` register across execution contexts by key name.
> 3. React assigns `Symbol.for('react.transitional.element')` to the `$$typeof` field of every valid element.
>
> Because JSON serialization strips symbol values, untrusted data received from servers cannot forge a valid React element object (Lesson 76).

JSON supports strings, numbers, booleans, null, arrays, and plain objects. It has no representation for symbols. When `JSON.stringify` encounters a symbol property, it silently omits that key from the serialized output.

### VS | A real element vs. its JSON copy: they look the same, only one is an element

Now observe what happens when a real React element passes through JSON serialization and deserialization:

```jsx title="A real element and its copy through JSON"
import { isValidElement } from 'react';

const name = <b>John</b>;
const copy = ~JSON.parse(JSON.stringify(name))~; // Rebuilds a plain object from JSON text

console.log(isValidElement(name), isValidElement(copy)); // true false
console.log(name.$$typeof, copy.$$typeof); // Symbol(react.transitional.element) undefined
```

```devconsole caption="The real element passes isValidElement; its JSON copy has no $$typeof and fails."
+ true false
+ Symbol(react.transitional.element) undefined
```

The deserialized object mirrors the original element in structure. It contains identical type, key, and property values. However, `copy` lost its `$$typeof` symbol during serialization. Consequently, React does not recognize it as an element:
1. `JSON.stringify(name)` converts the element into text, omitting the symbol-based `$$typeof` property.
2. `JSON.parse` instantiates a new plain object lacking `$$typeof`.
3. Checking the original element with `isValidElement` returns true, whereas checking the JSON copy returns false.

### Showing the copy in the comment list

Comment records typically arrive from servers as JSON payloads (Lesson 33). What happens if an application attempts to render the deserialized copy inside our comment list? Define `name` and `copy` at the top of the file, and attempt to render the copy:

```jsx title="src/CommentList.jsx" startLine="8"
const name = <b>John</b>;
const copy = JSON.parse(JSON.stringify(name));

export default function CommentList() {
  return (
    <section>
      <h2>Comments</h2>
      {comments.map(c => (
        <Comment key={c.id} author={c.author} text={c.text} />
      ))}
      ~<p>{copy}</p>~ {/* **WRONG:** copy is a plain object, not an element */}
    </section>
  );
}
```

React refuses to render the deserialized object, and the entire page unmounts into a blank screen. The console reports a fatal rendering exception (Lesson 03):

```page width=text caption="The page after the JSON copy is placed between tags: the page is blank, and React refuses the object."
blank
log: Comment rendered: John | Comment.jsx:2
log: Comment rendered: John | Comment.jsx:2
log: Comment rendered: Mia | Comment.jsx:2
log: Comment rendered: Mia | Comment.jsx:2
log: Comment rendered: John | Comment.jsx:2
log: Comment rendered: John | Comment.jsx:2
log: Comment rendered: Mia | Comment.jsx:2
log: Comment rendered: Mia | Comment.jsx:2
error: Uncaught Error: Objects are not valid as a React child (found: object with keys {type, key, props, _owner, _store}). If you meant to render a collection of children, use an array instead.
warn: An error occurred in the <p> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

Notice that the `Comment rendered` messages appear before the error. React invokes both `Comment` components before encountering the invalid child. When a render error occurs, React attempts a second render pass before unmounting the tree. This retry causes the log messages to repeat.

When React inspects the child inside `<p>`, it discovers an object lacking a valid `$$typeof` symbol. Because the object is neither a recognized element nor a renderable primitive like text, React throws an exception. We now remove the invalid paragraph and restore `CommentList`.

Why does React attach a unique symbol marker to elements? The React core team designed this mechanism as a cross-site scripting security defense:
1. Web applications frequently store user-submitted input in databases and return that data to clients as JSON.
2. If React accepted any plain object containing type and props as an element, an attacker could craft JSON containing dangerous attributes like `dangerouslySetInnerHTML`.
3. Because JSON cannot represent JavaScript symbols, attacker-controlled JSON payloads can never forge the `$$typeof` symbol. React safely rejects the payload.

React's general security guidance remains straightforward: Never inject raw HTML without sanitizing untrusted content (Lesson 48).

### The real mistake: showing the server's object instead of its text

In practice, developers encounter this error not from malicious payloads, but from accidentally rendering raw data objects instead of specific text properties:

```jsx title="src/CommentList.jsx"
const comment = { id: 1, author: 'John', text: 'Great article!' }; // One comment, as the server sends it

<p>~{comment}~</p> {/* **WRONG:** a plain object: Objects are not valid as a React child */}
<p>~{comment.text}~</p> {/* A string: React shows Great article! */}
```

Rendering the raw `comment` object throws an invalid child error (Lesson 03). Rendering `comment.text` succeeds because strings are valid React nodes. Always extract and render specific primitive properties from data models.

Applications rarely invoke `isValidElement` directly. The helper answers only whether an object is a React element. It does not determine whether a value is renderable, since valid nodes like strings and numbers are not elements.

Once React validates element descriptors, it maps them into an internal tree representation known as Fiber nodes. A future lesson examines this reconciliation tree in depth.

Remember: Only JSX and `createElement` construct authentic React elements. Data delivered via JSON represents plain application state.

---

## All 5 Principles Together

### The complete files

Having verified all five principles, our comment list application stands in its clean, production-ready form. Every element is declared with JSX, returned directly through component render paths, identified by a key, and treated as immutable:

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

```jsx title="src/App.jsx"
import CommentList from './CommentList.jsx';

export default function App() {
  return ~<CommentList />~; // Principle 1: an element whose type is CommentList
}
```

```jsx title="src/CommentList.jsx"
import Comment from './Comment.jsx';

const comments = [
  { id: 1, author: 'John', text: 'Great article!' },
  { id: 2, author: 'Mia', text: 'Me too!' },
];

export default function CommentList() {
  return (
    <section>
      <h2>Comments</h2>
      {comments.map(c => (
        ~<Comment key={c.id} author={c.author} text={c.text} />~ // Principles 3 and 4: a new element per comment, with its key on the element
      ))}
    </section>
  );
}
```

```jsx title="src/Comment.jsx"
export default function Comment({ author, text }) {
  ~console.log('Comment rendered:', author);~ // Principle 2: runs only for elements React receives
  return <p><b>{author}</b>: {text}</p>;
}
```

### The order in which React calls the components

When the application mounts, React starts from the root element passed to `render`. It evaluates each component element top-down as it traverses the tree. The browser renders the heading and comments, while development console logging records two invocations per component:

```page width=text caption="The finished comment list: the heading, two comments, and two Console lines for each comment under StrictMode."
heading: Comments
line: John: Great article!
line: Mia: Me too!
log: Comment rendered: John | Comment.jsx:2
log: Comment rendered: John | Comment.jsx:2
log: Comment rendered: Mia | Comment.jsx:2
log: Comment rendered: Mia | Comment.jsx:2
```

```tree caption="The order in which React calls the components, from the element App returns down to one Comment per comment."
`App` [1. Called first] | Returns the element **`<CommentList />`**
- +`CommentList` [2. Called second] | Returns a `<section>` element with the heading and **two `<Comment />` elements**
  - +`Comment` for John [3. Called third, key `'1'`] | Logs **`Comment rendered: John`** and returns a `<p>` element
  - +`Comment` for Mia [4. Called fourth, key `'2'`] | Logs **`Comment rendered: Mia`** and returns a `<p>` element
```

| Aspect | What developers often believe | What React does |
| :--- | :--- | :--- |
| **What JSX becomes** | The browser reads JSX as HTML | A build tool turns each tag into a function call; `createElement` gives the exact same element |
| **What an element is** | `<Comment />` runs `Comment` and puts a paragraph on the page | It makes a plain object; React calls `Comment` only for elements it receives, and creates the `<p>` during the commit |
| **Where `key` goes** | Every attribute on the tag is a prop | `key` is taken out of `props`, turned into a string, and stored on the element |
| **Changing an element** | The element is my object, so I can change its text | Elements are immutable and frozen in development; new text needs a new element |
| **What counts as an element** | Any object with `type` and `props` | Only JSX and `createElement` set `$$typeof`; a JSON copy is refused |

Remember the core insight of this lesson. **A JSX tag compiles into a function call returning a plain descriptor object, which React evaluates during render to construct the UI.**

---

## For the Interview

> **The Interview Question:** What does JSX compile into, and what is an element object?

### How to Answer Clearly in 30 Seconds

JSX is a syntax extension that browsers cannot execute natively. Before code reaches the browser, a build compiler transforms each JSX tag into a function call. In development, Vite compiles tags into `_jsxDEV` calls from React's runtime module, while the documented manual equivalent is `createElement(type, props, ...children)`. Both calls return a React element, which is a lightweight, immutable JavaScript object describing a piece of UI. Four primary fields define the element:
1. **`type`** stores a string like `'p'` for built-in HTML elements, or a component function reference for capitalized tags.
2. **`props`** stores all attributes, holding nested content in `props.children`.
3. **`key`** is extracted from props, coerced to a string, or set to `null` when omitted.
4. **`$$typeof`** contains React's internal symbol identifying authentic elements, preventing forged JSON objects from being rendered.

Creating an element does not invoke component functions or create DOM nodes. Elements are immutable blueprints that React freezes in development.

### Three Classic Follow-Up Questions Interviewers Ask

1. **"What is the difference between a component, an element, and a DOM node?"**
   A component is a JavaScript function, such as `Comment`. An element is the plain descriptor object returned by `<Comment />`, storing the function in its `type` property. It merely describes what should appear. A DOM node is the real browser element that React instantiates during the commit phase, and only for elements included in the returned tree. That is why calling `focus` on an element variable fails with a TypeError: element objects lack DOM methods. Accessing the underlying DOM node requires a React ref.
2. **"Why can't a component read its own `key`, and why does `element.key` show `'1'` when we passed the number `1`?"**
   The `key` attribute is metadata for React's reconciler, not component business logic. When React creates an element, it removes `key` from `props`, coerces the value to a string, and stores it directly on `element.key`. During re-renders, React compares element keys to determine whether to reuse or recreate underlying DOM instances. Within child component props, `key` is `undefined`. If a component requires the same identifier, pass it explicitly under an alternate prop name like `id`.
3. **"What is `$$typeof` for, and what happens if you render an element that went through JSON?"**
   The `$$typeof` property stores a JavaScript symbol that certifies an object as an authentic React element. Only JSX compilation and `createElement` attach this symbol. Because `JSON.stringify` discards symbol values, an element serialized and deserialized through JSON retains `type` and `props` but loses `$$typeof`. Passing this object to `isValidElement` returns `false`, and React throws an invalid child error during render. The React team introduced this mechanism to prevent cross-site scripting vulnerabilities where user-submitted JSON payloads attempt to inject malicious elements containing raw HTML.

```tree dir=right caption="Interview comparison: a real element made by JSX vs. a look-alike object rebuilt from JSON."
What React accepts as an element
- +Made by JSX or `createElement` [`<b>John</b>`] | Carries **`$$typeof`**, a `Symbol` | `isValidElement` is **`true`**; React **renders it**
- !Rebuilt from JSON [`JSON.parse`] | Has `type` and `props`, but **no `$$typeof`** | `isValidElement` is **`false`**; React throws **Objects are not valid as a React child**
```
