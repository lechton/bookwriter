# Lecture 58: How Passing JSX as children Replaces memo, useMemo, and useCallback

*(How can a theme button change the colors of a chat without re-rendering every message?)*

> INTERVIEW QUESTION | ❱❱ MORE | How does component composition replace memoization without useCallback or useMemo?

---

## VS | `<ChatRoom />` Written by the Wrapper vs. Passed In as `children`: the same screen, but only one re-renders the chat

> A theme button changes only the colors of a page, yet one click on it makes React re-render every message of the chat below it. **Move the theme into a wrapper component, and let the parent above write the chat tag and pass it in as `children`**. The parent component does not run again on the click. React receives the exact same element object as last time, skipping the chat without `memo` or any Hook.

When the state of a component changes, React calls that component function again. It also calls every component written as a tag in that JSX, and every component below them. A theme stored in `App` therefore re-renders the entire page on every click, even parts that only change color (Lesson 54).

Lessons 55 to 57 stopped this with memoization: `memo` on the rows, plus a Hook for every object and function passed as props. Each Hook requires a dependency array, and a single unstable reference breaks the optimization. This lesson prevents the exact same re-renders without any memoization. We only restructure the component tree: one tag moves up to the parent, and one piece of state moves down.

The core architectural rule fits in one sentence, and the entire lesson builds on it. **React does not decide re-renders by where a component appears on screen. It checks which component creates the JSX element, and whether that creator ran again.**

> [!DEFINITION]
> **The default re-render.** [REVIEW] When component state changes, React calls that component function again. React also calls every component written in its returned JSX, and recurses down that entire subtree regardless of whether props changed (Lesson 54).

> [!DEFINITION]
> **The children prop.** [REVIEW] Content placed between a component's opening and closing tags arrives inside that component as `props.children`. The parent evaluates the child JSX tag, and the wrapper component receives the resulting element object and renders it with `{children}` (Lesson 9).

> [!DEFINITION]
> **StrictMode calls every component twice.** [REVIEW] Our project mounts `<App />` inside `<StrictMode>`. In development, StrictMode invokes every component function twice to expose accidental side effects during rendering, so each `console.log` logs twice. In production, React calls each component only once (Lesson 47).

### The Smallest Page with a Theme Button

Here is the smallest page that shows it: a button that switches the theme between light and dark, and one chat message.

```page width=text caption="The page when it opens: a Toggle theme button and one message, Hi!."
line: [Toggle theme]
line: Hi!
```

In the first version, `App` owns the theme state and directly writes the `<ChatRoom />` tag in its returned JSX:

```jsx title="App.jsx: theme lives in App, and App writes the ChatRoom tag"
import { useState } from 'react';

function ChatRoom() {
  console.log('ChatRoom rendered');
  return <p>Hi!</p>;
}

export default function App() {
  const [theme, setTheme] = useState('light');
  return (
    <div className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle theme</button>
      ~<ChatRoom />~ {/* Written by App, the component whose state changes */}
    </div>
  );
}
```

The user clicks `Toggle theme`. The page turns dark, and the Console prints `ChatRoom rendered` again:

```devconsole caption="The real Console after one click on Toggle theme, with theme in App: StrictMode prints the line twice."
+ ChatRoom rendered | App.jsx:4
+ ChatRoom rendered | App.jsx:4
```

This is React's default behavior. The state of `App` changed, so React calls `App` again. Because `App` writes the chat tag in its JSX, React executes `ChatRoom` as well. StrictMode causes the line to log twice in development. To keep subsequent Console examples easy to read, every other Console block in this lesson shows one line per render.

Now we make one structural change. We move the theme state, the wrapper `<div>`, and the button into a dedicated component named `ThemeWrapper`. `ThemeWrapper` does not instantiate `<ChatRoom />` directly. Instead, it renders `{children}` where the nested content belongs. `App` now writes the chat tag between the opening and closing wrapper tags:

```jsx title="App.jsx: theme lives in ThemeWrapper, and App writes the ChatRoom tag between its tags"
import { useState } from 'react';

function ThemeWrapper({ children }) {
  const [theme, setTheme] = useState('light');
  console.log('ThemeWrapper rendered');
  return (
    <div className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle theme</button>
      ~{children}~ {/* Places whatever App wrote between the tags */}
    </div>
  );
}

function ChatRoom() {
  console.log('ChatRoom rendered');
  return <p>Hi!</p>;
}

export default function App() {
  return (
    <ThemeWrapper>
      ~<ChatRoom />~ {/* Written by App, which has no state and does not run again */}
    </ThemeWrapper>
  );
}
```

The user clicks `Toggle theme`. The page switches to dark styling exactly as before. This time the Console logs only one line, and `ChatRoom rendered` does not appear:

```devconsole caption="The Console after one click on Toggle theme, with theme in ThemeWrapper."
+ ThemeWrapper rendered | App.jsx:5
```

On the screen, you cannot tell the two versions apart. Open the Elements panel after the click, and both show exactly the same nodes:

```dom caption="The Elements panel after one click on Toggle theme. Both versions show exactly these nodes."
+ <div class="dark"> | note: The only node that changed: light became dark
    <button>Toggle theme</button>
    <p>Hi!</p>
  </div>
```

**Both versions produce the exact same DOM structure, but their render lifecycles are completely different.** In both cases, the message paragraph sits inside the styled `<div>`. The critical difference is which component instantiates the `<ChatRoom />` element:
- **With `theme` in `App`**, the component whose state changed directly creates the chat element on every render. React calls `App`, evaluates `<ChatRoom />`, and re-renders the chat.
- **With the theme in `ThemeWrapper`**, the parent component created the chat element, and that parent experienced no state change. React calls only `ThemeWrapper`. Because the chat element came from a parent that did not run again, React leaves `ChatRoom` untouched.

```tree caption="The same ChatRoom inside the same div: the component that writes the tag decides whether a click re-renders it."
Which component writes `<ChatRoom />`?
- !The component whose state changes [`App` holds `theme`] | A click re-renders `App` | React **re-renders `ChatRoom`** too
- +The parent above the wrapper [`App` writes it between the `ThemeWrapper` tags] | A click re-renders **only `ThemeWrapper`** | `App` did not run again, so React **skips `ChatRoom`**
```

The React documentation summarizes this rule directly: "When a component visually wraps other components, let it accept JSX as children. This way, when the wrapper component updates its own state, React knows that its children don't need to re-render." Neither version uses `memo` or any memoization Hook.

> [!DEFINITION]
> **Composition.** [NEW] In React, composition is the design pattern of assembling components by nesting them through props like `children`. Instead of hardcoding child components inside a parent, a container component accepts elements from the outside and renders them in place. `ThemeWrapper` provides the container layout, while `App` chooses and creates the nested chat element (Lesson 58).

### What the User Feels

In the unmemoized chat from earlier lessons, clicking `Toggle theme` re-renders every message row. Every keystroke in the input field causes the exact same cascade. In a large chat room with heavy rows, this creates input latency where typed characters lag behind the keyboard. The React documentation notes that unnecessary list re-renders make typing feel unresponsive and janky.

The memoization strategies from earlier lessons resolve the lag, but introduce maintenance friction. The React documentation highlights this trade-off: "The downside of this approach is that code becomes less readable. Also, not all memoization is effective: a single value that's 'always new' is enough to break memoization for an entire component."

This lesson eliminates the lag using standard component architecture through two structural moves:
1. The theme state moves into a container component that accepts the chat as `children`.
2. The input field state moves down into an isolated input component.

With these two changes in place, message rows skip both theme clicks and keystrokes, without a single memoization Hook.

### The Rule of Thumb: ask which component writes the tag

**Before reaching for `memo`, ask two diagnostic questions: which component creates the slow JSX element, and did that component re-render?** If the re-rendering component did not instantiate the slow element, React reuses the previous element and skips the child component entirely.

Four common pitfalls regularly confuse developers:
1. **Assuming screen layout dictates re-render cascades.** Visual containment does not trigger renders. What matters is which component evaluated the JSX tag during its execution.
2. **Reaching for memoization before examining state placement.** The React documentation explicitly recommends accepting JSX as children and preferring local state before introducing memoization.
3. **Hoisting short-lived state too high in the tree.** Storing input text or hover flags high up forces large component subtrees to re-render on every minor event.
4. **Assuming `children` prevents all descendant re-renders.** Clicking Send updates chat state and re-renders the rows, which is expected behavior rather than a defect.

When frequently changing state re-renders an expensive area of the interface, you have five architectural options:
1. **Leave it alone and measure first using `<Profiler>`.** If users experience no perceptible stutter, optimization is unnecessary (Lesson 54).
2. **Pass the expensive subtree as `children` to the stateful container.** This pattern fits components that visually wrap child content, such as modals, sidebars, or theme wrappers. Principles 1 and 2 teach this approach.
3. **Push state down into a dedicated leaf component.** This pattern isolates rapidly changing values, like form inputs, so only the leaf re-renders. Principle 3 teaches this pattern.
4. **Wrap the child in `memo` and memoize incoming props.** This approach is required when a re-rendering component must create the expensive child itself (Lessons 55 to 57).
5. **Rely on the React Compiler.** The compiler automatically analyzes component boundaries and caches JSX elements during build time (Lesson 63).

```tree caption="Five ways to handle a state that changes often above a slow part of the page; this lesson teaches ways 2 and 3."
A state that changes often re-renders a slow part
- +1. Measure first [`<Profiler>`] | The user feels **no lag** | **Leave it**
- +2. Pass the slow part as `children` [`<ThemeWrapper><ChatRoom /></ThemeWrapper>`] | A wrapper **owns the state** and visually wraps the slow part | **This lesson**, Principles 1 and 2
- +3. Move the state down [`MessageInput`] | Only **one small part** uses the state | **This lesson**, Principle 3
- +4. `memo` with `useMemo` and `useCallback` | The component that re-renders **must write** the slow child | Lessons 55 to 57
- +5. React Compiler | Caches JSX **when the app is built** | Lesson 63
```

## SECTION | The Chat Room from Lessons 54 to 57, with No Memoization

We build the chat room from earlier lessons again. It has a `Toggle theme` button at the top, three messages, an input field for a new message, and a Send button:

```page width=text caption="The chat room when the page opens: a Toggle theme button, three messages, an empty message field, and a Send button."
line: [Toggle theme]
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field: |
  button: Send
```

We begin with a clean baseline that contains no `memo` calls and no caching Hooks. We also remove two pieces from earlier lessons: the theme context and the delete button. No component reads the active theme in JavaScript. The `.dark` class on the container `<div>` controls background and text styling, allowing standard CSS inheritance to handle visual changes.

> [!DEFINITION]
> **An inherited CSS property.** [NEW] An inherited CSS property automatically flows from an ancestor element down to all nested elements inside it. Setting `color: white` on a parent `<div>` applies white text to nested `<li>` elements without requiring separate class names. This allows message rows to update their text colors purely through CSS cascades without React state updates (Lesson 58).

`App` holds the theme, and it writes the chat:

```jsx title="src/App.jsx: the starting version" startLine="1"
import { useState } from 'react';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  const [theme, setTheme] = useState('light');
  return (
    <div className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      ~<ChatRoom />~ {/* Written by App, so every click on Toggle theme re-renders the chat */}
    </div>
  );
}
```

`ChatRoom` holds two state variables. The first is `messages`. The second is `text`, the text of the `<input>` field. It writes one `Message` per message:

```jsx title="src/components/ChatRoom.jsx: the starting version" startLine="1"
import { useState } from 'react';
import Message from './Message.jsx';

const initialMessages = [
  { id: 1, text: 'Hi!' },
  { id: 2, text: 'Lunch at 12?' },
  { id: 3, text: 'Sure' },
];
let nextId = 4;

export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState('');
  console.log('ChatRoom rendered');

  function handleSend() {
    setMessages([...messages, { id: nextId++, text }]);
    setText('');
  }

  return (
    <section>
      <ul>
        {messages.map(m => <Message key={m.id} text={m.text} />)}
      </ul>
      <input placeholder="Message" value={text} ~onChange={e => setText(e.target.value)}~ /> {/* Every keystroke changes the state of ChatRoom */}
      <button onClick={handleSend}>Send</button>
    </section>
  );
}
```

`Message` is a plain component, with no `memo`:

```jsx title="src/components/Message.jsx" startLine="1"
export default function Message({ text }) {
  console.log('Message rendered:', text);
  return <li>{text}</li>;
}
```

Now observe the Console output. The user clicks `Toggle theme` once, and then types the letter `O` into the input field. Both actions trigger the exact same cascade of four render logs:

::: row caption="The Console after one click on Toggle theme, and after one keystroke in the message field: both re-render the chat and every row."
::: col title="After one click on Toggle theme" tag="every row re-renders" tone=bad
```devconsole
+ ChatRoom rendered | ChatRoom.jsx:14
+ Message rendered: Hi! | Message.jsx:2
+ Message rendered: Lunch at 12? | Message.jsx:2
+ Message rendered: Sure | Message.jsx:2
```
The page only changed color. The messages did not change.
:::
::: col title="After the user types O" tag="every row re-renders" tone=bad
```devconsole
+ ChatRoom rendered | ChatRoom.jsx:14
+ Message rendered: Hi! | Message.jsx:2
+ Message rendered: Lunch at 12? | Message.jsx:2
+ Message rendered: Sure | Message.jsx:2
```
Only the field changed. The messages did not change.
:::
:::

With only three static messages, re-renders happen fast enough to go unnoticed. In a production chat with hundreds of complex rows, every typed character pauses while React reconciles every single message.

At the end of this lesson, the chat lives in seven files, and none of them holds `memo` or a memoization Hook:

```files title="chat-room: File Explorer" caption="How the final chat room sits inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` and mounts it inside `<StrictMode>`
  index.css | styles | Defines the `.light` and `.dark` classes
  App.jsx | parent | Exports `App`, which writes `<ChatRoom />` between the `ThemeWrapper` tags
  components/
    ThemeWrapper.jsx | wrapper | Exports `ThemeWrapper`, which holds `theme` and places `{children}`
    ChatRoom.jsx | state owner | Exports `ChatRoom`, which holds `messages`; imports `Message` and `MessageInput`
    Message.jsx | row | Exports `Message`, a plain component that shows one message
    MessageInput.jsx | local state | Exports `MessageInput`, which holds `text` and calls `onSend`
```

**PRINCIPLES:** React re-renders the component whose state changed, along with every component instantiated in its returned JSX. To prevent wasteful re-renders without relying on memoization, we strategically decide which component creates each JSX element and where each piece of state resides. Four architectural principles follow:
1. **Principle 1: children: the Wrapper Re-renders Alone, and the Chat Its Parent Wrote Is Skipped.** A container that holds theme state accepts the chat as `children`, while `App` creates the chat element. Toggling the theme re-renders only the wrapper.
2. **Principle 2: A React Element: the Same Object as Last Time Means No Re-render.** Evaluating a JSX tag instantiates a plain element object. Because `App` did not re-render, React receives the exact same element reference and skips the child component.
3. **Principle 3: MessageInput with Its Own text: Typing Re-renders Only the Message Input.** Moving input text into a dedicated component confines typing re-renders to that isolated leaf.
4. **Principle 4: ChatRoom with a New Message: a Component That Re-renders Still Re-renders What It Writes.** Composition only preserves elements created by a parent that did not run. When chat state changes, the chat component legitimately re-renders every row it instantiates.

---

## PRINCIPLE | `children`: the wrapper re-renders alone, and the chat its parent wrote is skipped

> [!PRINCIPLE]
> **Principle 1: children: the Wrapper Re-renders Alone, and the Chat Its Parent Wrote Is Skipped**
>
> *When a component visually wraps a slow part and owns the state that changes, let it take that part as `children`, and write the part's tag in the parent above.*
>
> A click that changes `theme` re-renders the component holding `theme`, along with every element instantiated in its JSX. When the wrapper directly creates `<ChatRoom />`, each theme click cascades down to the chat and every message row. When `App` instantiates `<ChatRoom />` and passes it between wrapper tags, the wrapper only places `{children}`, and `App` does not re-render. React re-renders the wrapper and skips the chat entirely, without calling `memo` or inspecting props.
>
> **DO THIS:**
> ```jsx
> function ThemeWrapper({ children }) {
>   const [theme, setTheme] = useState('light');
>   return <div className={theme}>{children}</div>;
> }
> export default function App() {
>   return <ThemeWrapper>~<ChatRoom />~</ThemeWrapper>; // Written by App: a theme change skips ChatRoom
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ThemeWrapper() {
>   const [theme, setTheme] = useState('light');
>   return <div className={theme}>~<ChatRoom />~</div>; // **WRONG:** written by ThemeWrapper, so every theme change re-renders ChatRoom
> }
> ```

### Moving the State Is Not Enough

Developers often attempt an incomplete refactoring: they move the theme state into `ThemeWrapper`, but leave the `<ChatRoom />` tag hardcoded inside the wrapper return statement:

```jsx title="ThemeWrapper holds theme and still writes the ChatRoom tag itself"
function ThemeWrapper() {
  const [theme, setTheme] = useState('light');
  return (
    <div className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle theme</button>
      ~<ChatRoom />~ {/* **WRONG:** written by ThemeWrapper, so every click re-renders ChatRoom */}
    </div>
  );
}
```

From the perspective of the chat, this produces the exact same performance defect as keeping state in `App`. In both setups, the component experiencing the state update directly instantiates the `<ChatRoom />` element, forcing the chat to re-render on every toggle. Relocating state without relocating element creation solves nothing.

The performance gain occurs only when the child tag moves out of the wrapper. The wrapper receives and renders `{children}`, while the enclosing parent creates the tag:

```jsx title="ThemeWrapper holds theme and places children; App writes the tag"
function ThemeWrapper({ ~children~ }) { // Receives the chat that App wrote
  const [theme, setTheme] = useState('light');
  return (
    <div className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle theme</button>
      {children}
    </div>
  );
}
```

```tree caption="Three places for theme and the ChatRoom tag; only the last one leaves ChatRoom alone on a click."
Where `theme` lives, and which component writes `<ChatRoom />`
- !`theme` in `App` [`App` writes the tag] | A click re-renders `App` | **`ChatRoom` re-renders**
- !`theme` in `ThemeWrapper` [`ThemeWrapper` writes the tag] | A click re-renders `ThemeWrapper` | **`ChatRoom` re-renders**: the exact same thing
- +`theme` in `ThemeWrapper` [`App` writes the tag between its tags] | A click re-renders only `ThemeWrapper` | **`ChatRoom` is skipped**
```

### The Theme Wrapper in Our Chat

Now we apply this architecture to the chat. `ThemeWrapper` is placed in a dedicated file. It manages the theme state, renders the container `<div>` and the toggle button, and slots in `{children}`:

```jsx title="src/components/ThemeWrapper.jsx" startLine="1"
import { useState } from 'react';

export default function ThemeWrapper({ ~children~ }) { // Everything App writes between the tags
  const [theme, setTheme] = useState('light');
  console.log('ThemeWrapper rendered');
  return (
    <div className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      {children}
    </div>
  );
}
```

`App` no longer holds any state. It only writes the chat between the wrapper tags:

```jsx title="src/App.jsx" startLine="1"
import ThemeWrapper from './components/ThemeWrapper.jsx';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  return (
    <ThemeWrapper>
      ~<ChatRoom />~ {/* Written by App, which holds no state */}
    </ThemeWrapper>
  );
}
```

The user clicks `Toggle theme`, and the whole chat turns dark. The Console prints one line:

```devconsole caption="The Console after one click on Toggle theme, with the chat passed as children."
+ ThemeWrapper rendered | ThemeWrapper.jsx:5
```

Before this architectural change, clicking the toggle printed `ChatRoom rendered` alongside three `Message rendered:` logs. Now those logs disappear completely, without using `memo`. Here is the exact runtime sequence that occurs when the button is clicked:
1. The user clicks the toggle button, invoking the state updater that sets `theme` to `'dark'`.
2. Because state changed only inside `ThemeWrapper`, React schedules a render solely for `ThemeWrapper`. The Console prints `ThemeWrapper rendered`.
3. `ThemeWrapper` returns a new container `<div>` with the updated class. Inside that container, it renders the exact same `children` reference it received from `App`. Because `App` never re-rendered, no new child element was created.
4. React detects that the child element reference is identical to the previous render, skipping `ChatRoom` and all underlying `Message` components.
5. React applies the `'dark'` class name to the container DOM node. Browser CSS inheritance updates the font colors of the nested text nodes automatically.

```dom caption="The Elements panel after one click on Toggle theme: only the class of the div changes."
+ <div class="dark"> | note: The only change: light became dark
    <button>Toggle theme</button>
    <section>
      <ul>
        <li>Hi!</li>
        <li>Lunch at 12?</li>
        <li>Sure</li>
      </ul>
      <input placeholder="Message" value="">
      <button>Send</button>
    </section>
  </div>
```

### Where Did children and the Dark Text Come From?

`ThemeWrapper` does not import `ChatRoom` and contains no reference to its component function. React bundles whatever elements `App` places between the wrapper tags into `props.children`. `ThemeWrapper` simply interpolates this prop into its returned JSX (Lesson 9).

No component passes the active theme string down to the chat or message rows. The messages darken because `color` is an inherited CSS property. The browser automatically cascades the text color from the parent container down through all descendant DOM elements. The UI reflects the new theme instantly, while React skips the entire JavaScript component tree.

### VS | `memo` on the Chat vs. the Chat Passed as `children`: the same quiet Console, but only one compares props

Lesson 55 resolved this re-render through explicit memoization. In that approach, theme state remained in `App`, and `memo` wrapped both the chat container and individual message rows. Compare both patterns:

```jsx title="With memo: theme stays in App, and memo wraps ChatRoom"
const ChatRoom = ~memo~(function ChatRoom() { // Skipped only while every prop passes the comparison
  console.log('ChatRoom rendered');
  return <p>Hi!</p>;
});
```

```jsx title="With children: theme in ThemeWrapper, and App writes the tag"
<ThemeWrapper>
  ~<ChatRoom />~ {/* Skipped because App did not run again: there is nothing to compare */}
</ThemeWrapper>
```

**Both approaches silence the Console, but their underlying mechanisms operate on different principles.** In both cases, toggling the theme avoids logging `ChatRoom rendered`. However, `memo` requires React to perform shallow equality checks on every incoming prop whenever `App` renders. Passing an unstable object or inline callback breaks `memo` immediately (Lesson 55). With `children`, React performs no prop comparisons at all. The child element was created by `App`, and because `App` never executed, React reuses the existing element directly.

In production applications, relying exclusively on `memo` often triggers cascading complexity:
1. A developer notices `ChatRoom rendered` logging on every minor state update.
2. They wrap `ChatRoom` and nested rows in `memo` (Lesson 55).
3. Every callback and object prop passed into those components now requires `useCallback` or `useMemo` with explicit dependency lists (Lessons 56 and 57).
4. A single unmemoized prop or omitted dependency invalidates the cache or introduces stale closures (Lesson 57).
5. The React documentation recommends the architectural alternative first: "When a component visually wraps other components, let it accept JSX as children."

> [!DEFINITION]
> **A wrapper component.** [NEW] A wrapper component is a structural component designed to enclose other interface elements, providing shared styling, container markup, or contextual state. Examples include dialogs, layout grids, cards, and theme wrappers. By receiving child content through `children`, the wrapper can update its own internal state without causing the passed-in component tree to re-render (Lesson 58).

---

## PRINCIPLE | A React element: the same object as last time means React does not call the component

> [!PRINCIPLE]
> **Principle 2: A React Element: the Same Object as Last Time Means No Re-render**
>
> *Evaluating a JSX tag creates a plain element object; when React receives the exact same element reference during a render cycle, it skips calling the component.*
>
> Writing `<ChatRoom />` does not immediately invoke `ChatRoom`. Instead, it creates an immutable object containing `type` and `props`, leaving execution decisions to React's reconciler. `App` created this element during its initial render. When `ThemeWrapper` re-renders, it returns that identical object reference back to React. Because React elements are frozen upon creation, identical object identity guarantees that props cannot have changed, allowing React to skip re-rendering. Conversely, tags evaluated inside a re-rendering component produce fresh object references on every render, even when their syntax is identical.
>
> **DO THIS:**
> ```jsx
> export default function App() {
>   return <ThemeWrapper>~<ChatRoom />~</ThemeWrapper>; // Made once by App: the same object on every theme change
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ThemeWrapper() {
>   const [theme, setTheme] = useState('light');
>   return <div className={theme}>~<ChatRoom />~</div>; // **WRONG:** a new element object on every run, so ChatRoom re-renders
> }
> ```

### A JSX Tag Is a Plain Object

React does not call `ChatRoom`, despite the component sitting directly inside the container whose class name just changed. This occurs because writing a JSX tag does not execute the underlying component function. JSX is syntactic sugar that compiles into an element creation call, producing a plain JavaScript object:

```jsx title="A JSX tag and the object it becomes"
const element = ~<ChatRoom />~; // An object like { type: ChatRoom, props: {} }, made when this line runs
```

The React documentation demonstrates the same structure with a list:

```jsx title="React's docs: a JSX node and the object it becomes"
<List items={visibleTodos} /> // "A JSX node like this..."
{ type: List, props: { items: visibleTodos } } // "...is an object like this"
```

The `type` property holds a reference to the component function itself. The `props` property holds an object containing every attribute and child passed to the tag.

> [!DEFINITION]
> **A React element.** [NEW] A React element is a lightweight, immutable JavaScript object that describes what should appear on the screen, such as `{ type: ChatRoom, props: {} }`. Writing `<ChatRoom />` produces this descriptor rather than executing the component function. React inspects the element during reconciliation and determines whether to invoke the component function or reuse the existing DOM subtree (Lesson 58).

A JSX tag is simply a readable syntax for creating this descriptive object. Creating an element descriptor is distinct from invoking the component function. React evaluates the element tree during render time to decide whether invoking `type` is actually necessary.

```tree caption="Writing a JSX tag makes an element object; React decides later whether to call the component."
What `<ChatRoom />` really is
- +The tag we write [`<ChatRoom />`] | Written in the JSX of `App` | **Made when `App` runs**
- +The element object React gets [`type: ChatRoom` `props: {}`] | **The exact same thing**, written as an object | Describes the tag; **calls nothing**
- +React's decision while it renders | Compares the element with the one from the last render | **Same object**: React skips `ChatRoom`
```

### Same Object or New Object: The Question of Lesson 55

Lessons 55 through 57 centered on one fundamental question: do two references point to the exact same object in memory? You can test this behavior in the Console using plain objects:

```js title="Two objects with the same fields"
const a = { type: 'ChatRoom' };
const b = { type: 'ChatRoom' };

console.log(~a === b~); // false: the same fields, but two different objects
console.log(~a === a~); // true: the very same object
```

React applies this exact reference equality check to elements during reconciliation. Each time an expression containing `<ChatRoom />` evaluates, JavaScript allocates a new object in memory, even if every internal property matches. The fundamental performance question is therefore: did the component that evaluated `<ChatRoom />` execute again?
- **When `ThemeWrapper` writes the tag**, the JSX expression executes on every toggle. Each run allocates a distinct element reference, prompting React to call `ChatRoom`.
- **When `App` writes the tag**, the expression evaluates only when `App` executes. Theme toggles do not re-render `App`, so the element reference remains identical, allowing React to skip `ChatRoom`.

### The Life of the ChatRoom Element

Tracing the lifecycle of the chat element from initial mount through a user interaction clarifies why reference equality matters:
1. On initial mount, React invokes `App`. Evaluating `<ChatRoom />` creates an element descriptor object in memory.
2. React assigns that element object to `props.children` and calls `ThemeWrapper`.
3. `ThemeWrapper` returns a container `<div>` element wrapping the received child elements. Because this is the initial render, React executes `ChatRoom` to construct the DOM nodes.
4. The user clicks `Toggle theme`. Because state changed inside the wrapper, React queues a re-render for `ThemeWrapper`, leaving `App` uncalled.
5. The wrapper creates a new `<div>` element with the updated class name and re-emits the existing `children` object reference.
6. React reconciles the returned tree against the previous output. The `<div>` class has changed, so React updates the DOM attribute. The `ChatRoom` element retains identical object identity, so React skips executing `ChatRoom`.

```tree dir=right caption="App makes the ChatRoom element once, and ThemeWrapper hands the same object back to React on every click."
The life of the `<ChatRoom />` element
- +1. First render [`App` runs] | `App` makes **one element object** for `<ChatRoom />`
- +2. Inside the wrapper [`props.children`] | React hands that object to `ThemeWrapper`
- +3. A click on Toggle theme [`ThemeWrapper` runs] | `ThemeWrapper` places **the same object** again | `App` did not run, so **no new object** exists
- +4. React compares | Same object as last time | **React does not call `ChatRoom`**
```

### Why the Same Object Is Safe to Skip

React safely skips re-rendering because React elements are immutable data structures. The React documentation highlights this invariant: "You must treat React elements and their props as immutable and never change their contents after creation. In development, React will freeze the returned element and its `props` property shallowly."

Because element objects cannot mutate after creation, an identical object reference guarantees identical `type` and `props`. The documentation concludes: "A JSX node object could not have changed over time, so React knows it's safe to skip a re-render."

This immutability explains why moving state alone failed in Principle 1. When `ThemeWrapper` directly writes `<ChatRoom />`, each invocation allocates a new element descriptor. Even though the markup appears identical in your editor, reference comparison fails. The documentation emphasizes: "the node has to *actually be the same object*, not merely look the same in code."

### VS | `children` from `App` vs. `useMemo` Around One JSX Node: the exact same skip, but only one needs a Hook

There is a second technique for returning a stable element reference to React. `ThemeWrapper` can cache the JSX element using `useMemo` (Lesson 56):

```jsx title="With children passed from App: App makes the element once"
<ThemeWrapper>
  ~<ChatRoom />~ {/* App made this object once, and does not run again */}
</ThemeWrapper>
```

```jsx title="With useMemo inside ThemeWrapper: a Hook caches the element"
function ThemeWrapper() {
  const [theme, setTheme] = useState('light');
  const chat = ~useMemo~(() => <ChatRoom />, []); // The same object on every render, kept by a Hook
  return <div className={theme}>{chat}</div>;
}
```

**From the perspective of React's reconciler, both approaches accomplish the exact same optimization.** In both snippets, `ThemeWrapper` provides an identical element reference on subsequent renders, allowing React to skip executing `ChatRoom`. The React documentation notes that when wrapping a JSX node in `useMemo`, "The behavior would be the same." The difference lies in code clarity and architectural ergonomics. Using `useMemo` requires importing a Hook, managing dependency arrays, and adhering to Hook rules, including the restriction that Hooks cannot be invoked conditionally. Passing JSX as `children` achieves identical caching purely through component composition.

### Two More Things Interviewers Ask

The React Compiler performs this element caching automatically during build compilation. The React documentation explains that the compiler wraps child JSX expressions in cache checks, reusing the previously allocated element whenever incoming props remain stable. Lesson 63 explores the compiler in depth.

This optimization is not restricted to the prop named `children`. Any prop that carries a JSX element behaves identically, including custom slot props or `fallback` on `<Suspense>`. What matters to React's reconciler is reference equality: an element avoids re-rendering whenever its creator component does not execute again.

---

## PRINCIPLE | `MessageInput` with its own `text`: typing re-renders only the message input

> [!PRINCIPLE]
> **Principle 3: MessageInput with Its Own text: Typing Re-renders Only the Message Input**
>
> *When a state variable is needed by only one localized part of the interface, move that state down into a dedicated leaf component and communicate upward via callbacks.*
>
> Every keystroke updates input field text. When that state lives in `ChatRoom`, typing re-renders the entire chat and every message row, even though the messages do not consume input text. Moving the string into `MessageInput` restricts keystroke re-renders exclusively to the input component. `MessageInput` delivers the completed string upward via an `onSend` callback only when the user submits, shielding `ChatRoom` from intermediate typing events.
>
> **DO THIS:**
> ```jsx
> function MessageInput({ onSend }) {
>   const [~text~, setText] = useState(''); // Each keystroke re-renders only MessageInput
>   return <input value={text} onChange={e => setText(e.target.value)} />;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ChatRoom() {
>   const [messages, setMessages] = useState(initialMessages);
>   const [~text~, setText] = useState(''); // **WRONG:** each keystroke re-renders ChatRoom and every Message
>   return <input value={text} onChange={e => setText(e.target.value)} />;
> }
> ```

### VS | `text` in `ChatRoom` vs. `text` in `MessageInput`: the same chat for the user, but only one re-renders the rows on every letter

A user clicking `Toggle theme` no longer triggers row re-renders, but typing into the input field still does. This occurs because the input text lives in `ChatRoom` alongside the `messages` array. Every keystroke updates `ChatRoom` state, forcing everything `ChatRoom` creates to re-render.

The message rows do not read `text`. Only the input field and its submission button consume this value. Moving `text` down into a dedicated component named `MessageInput` implements the inverse of lifting state up (Lesson 24). Compare both architectures:

```jsx title="With text in ChatRoom: every keystroke changes the state of ChatRoom"
export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);
  const [~text~, setText] = useState(''); // **WRONG:** each keystroke re-renders ChatRoom and every Message
  console.log('ChatRoom rendered');
```

```jsx title="With text in MessageInput: every keystroke changes only the state of MessageInput"
function MessageInput({ onSend }) {
  const [~text~, setText] = useState(''); // Each keystroke re-renders only MessageInput
  console.log('MessageInput rendered');
```

**Both versions present an identical user interface, but their state boundaries create entirely different render footprints.** With `text` stored in `ChatRoom`, typing fires a full subtree re-render on every character. With `text` localized inside `MessageInput`, keystrokes re-render only the input element itself.

The React documentation emphasizes this design rule: "Prefer local state and don't lift state up any further than necessary. For example, don't keep transient state like forms and whether an item is hovered at the top of your tree or in a global state library."

> [!DEFINITION]
> **Local state and transient state.** [NEW] Local state is state encapsulated within the specific component that directly consumes it, such as draft text inside `MessageInput`. Transient state represents short-lived, high-frequency user interactions, such as form drafts or hover indicators. The React documentation advises keeping transient state positioned low in the component hierarchy to prevent high-frequency events from triggering expensive subtree re-renders (Lesson 58).

### The Message Input in Our Chat

`MessageInput` lives in its own file. It encapsulates the local `text` state, the text field, and the submission button:

```jsx title="src/components/MessageInput.jsx" startLine="1"
import { useState } from 'react';

export default function MessageInput({ onSend }) {
  const [text, setText] = useState('');
  console.log('MessageInput rendered');

  function handleClick() {
    ~onSend(text)~; // Hands the finished text up to ChatRoom
    setText(''); // Empties its own field
  }

  return (
    <div>
      <input placeholder="Message" value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleClick}>Send</button>
    </div>
  );
}
```

`ChatRoom` no longer manages input text, retaining only `messages`. It imports `MessageInput` and receives completed text through a callback prop (Lesson 23):

```jsx title="src/components/ChatRoom.jsx" startLine="1"
import { useState } from 'react';
import Message from './Message.jsx';
import MessageInput from './MessageInput.jsx';

const initialMessages = [
  { id: 1, text: 'Hi!' },
  { id: 2, text: 'Lunch at 12?' },
  { id: 3, text: 'Sure' },
];
let nextId = 4;

export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);
  console.log('ChatRoom rendered');

  function handleSend(text) {
    setMessages([...messages, { id: nextId++, text }]);
  }

  return (
    <section>
      <ul>
        {messages.map(m => <Message key={m.id} text={m.text} />)}
      </ul>
      ~<MessageInput onSend={handleSend} />~ {/* The message input now keeps its own text */}
    </section>
  );
}
```

The user types `O`, then `K`:

```page width=text caption="The chat after the user types OK in the message field."
line: [Toggle theme]
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field: | OK
  button: Send
```

After each keystroke, the Console prints one line:

```devconsole caption="The Console after the user types O and then K, with text in MessageInput."
+ MessageInput rendered | MessageInput.jsx:5
+ MessageInput rendered | MessageInput.jsx:5
```

`ChatRoom rendered` and row render logs no longer appear, without requiring `memo` on any component. Because each keystroke updates state isolated inside `MessageInput`, React executes only `MessageInput`.

### Where Did onSend, text, and the Empty Field Come From?

`onSend` is a standard callback prop passed by the chat component via `onSend={handleSend}`. When the user clicks Send, `MessageInput` invokes this callback, passing its local `text` as an argument. `ChatRoom` receives the completed message content on submit without tracking individual keystrokes.

After firing the callback, `MessageInput` resets its draft field by calling `setText('')`. Because component state is strictly encapsulated, `ChatRoom` cannot manipulate the internal state of `MessageInput` directly.

### VS | A New `onSend` Function on Every Render vs. `onSend` in `useCallback`: the exact same page

`handleSend` is recreated as a fresh function instance whenever `ChatRoom` renders. In a memoized architecture, this would require `useCallback` to maintain reference stability (Lesson 57). In this composition architecture, **wrapping the function changes nothing**. Because the input component is not wrapped in `memo`, React does not perform prop equality checks on `onSend`. Reallocating the callback function carries negligible cost (Lesson 57).

### Two Tools, One Question

Hoisting transient state too high often motivates premature memoization:
1. A developer keeps input text in `ChatRoom` beside `messages` so the submission logic can read it.
2. Keystrokes cause the entire message list to re-render repeatedly.
3. The developer wraps the message rows in `memo` to suppress the re-render cascades (Lesson 55).
4. The React documentation identifies the simpler architectural remedy: "don't keep transient state like forms ... at the top of your tree".

Passing JSX as `children` and pushing state down solve the same underlying problem: separating re-rendering components from expensive subtrees. Choose between them based on visual hierarchy:
- **Pass the expensive subtree as `children`** when it is visually enclosed by the component holding state, as the chat is enclosed by the theme `<div>`.
- **Move state down** when state is consumed by an adjacent sibling rather than the expensive subtree, as the input field sits beside the message list.

The React documentation treats moving state as standard development practice. It notes that developers often move state down or back up while figuring out where each piece belongs.

```tree caption="Two tools without memoization: pass the slow part as children, or move the state down."
Which component writes the slow part, and does it re-render?
- +Pass the slow part as `children` [`<ThemeWrapper><ChatRoom /></ThemeWrapper>`] | The slow part **sits inside** the markup of the component with the state | The parent above writes the tag, **so a theme change skips it**
- +Move the state down [`MessageInput` holds `text`] | The slow part **sits next to** the part that uses the state | The state goes into **its own small component**, so typing skips the rows
```

---

## PRINCIPLE | `ChatRoom` with a new message: a component that re-renders still re-renders every tag it writes

> [!PRINCIPLE]
> **Principle 4: ChatRoom with a New Message: a Component That Re-renders Still Re-renders What It Writes**
>
> *Component composition skips only those elements created by components that did not execute; when `ChatRoom` state changes, React re-renders every child element `ChatRoom` creates.*
>
> Submitting a message updates `messages` inside `ChatRoom`. As `ChatRoom` re-renders, its mapping loop allocates fresh `<Message>` element objects, causing React to invoke each `Message` component. This represents standard React rendering and executes efficiently for moderate list sizes. Furthermore, the optimization from Principle 1 collapses if `theme` is lifted back into `App`, because `App` then re-renders on every click and instantiates a new `<ChatRoom />` element. If message rows are genuinely expensive, measure render times with the Profiler before introducing `memo`.
>
> **DO THIS:**
> ```jsx
> export default function App() {
>   return <ThemeWrapper>~<ChatRoom />~</ThemeWrapper>; // theme stays in ThemeWrapper: a click skips every row
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function App() {
>   const [theme, setTheme] = useState('light');
>   return (
>     <ThemeWrapper theme={theme} onToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
>       ~<ChatRoom />~ {/* **WRONG:** App re-renders on every click, so every row re-renders */}
>     </ThemeWrapper>
>   );
> }
> ```

### One Click on Send Prints a Line for Every Row

After applying Principles 1 through 3, toggling themes and typing characters trigger no row re-renders. However, submitting a message with `OK` in the input field logs a render for every message row. This is expected behavior: `ChatRoom` owns the `messages` array, and its state just changed:

```page width=text caption="The chat after the user clicks Send with OK in the field: a fourth message and an empty field."
line: [Toggle theme]
line: Hi!
line: Lunch at 12?
line: Sure
line: OK
form:
  field: |
  button: Send
```

```devconsole caption="The Console after one click on Send with OK in the field."
+ ChatRoom rendered | ChatRoom.jsx:14
+ Message rendered: Hi! | Message.jsx:2
+ Message rendered: Lunch at 12? | Message.jsx:2
+ Message rendered: Sure | Message.jsx:2
+ Message rendered: OK | Message.jsx:2
+ MessageInput rendered | MessageInput.jsx:5
```

The step-by-step execution flow illustrates why this happens:
1. The user clicks `Send`. The input component fires `onSend` with the draft string and clears its local field using `setText('')`.
2. Inside the chat component, `handleSend` invokes `setMessages` with a new four-item array.
3. React batches both state updates into a single render pass (Lesson 16). It executes `ChatRoom`, printing `ChatRoom rendered`.
4. During this execution, the mapping expression inside `ChatRoom` instantiates four new `<Message>` element objects. Unlike the stable `children` reference in Principle 2, these are newly allocated descriptors, prompting React to render each `Message`.
5. React also renders `MessageInput` because `ChatRoom` creates its tag. Its local text state is now reset.
6. `ThemeWrapper rendered` does not appear because wrapper state did not change, and the wrapper sits higher in the tree.

**Composition strategies only skip components whose element descriptors were created by an uncalled parent. They never prevent a component from re-rendering the elements it creates directly.** The React documentation confirms this rule: "By default, when a component re-renders, React re-renders all of its children recursively." For short lists, this default re-render behavior is practically instantaneous, and Lesson 54 advises measuring before optimizing.

`MessageInput` preserves its DOM position across renders, so React retains its component state (Lesson 25). The input clears solely because `MessageInput` called its own state updater.

### VS | `theme` Kept in `ThemeWrapper` vs. `theme` Lifted Back Up into `App`: the same tags, but only one keeps the chat quiet

Suppose an application header requires theme access to render an appropriate logo. A developer might lift `theme` state back into `App` and pass values downward (Lesson 24). In this scenario, the wrapper relinquishes state ownership, receiving `theme` and an `onToggle` callback as props:

```jsx title="src/components/ThemeWrapper.jsx: with theme lifted back up into App" startLine="1"
export default function ThemeWrapper({ ~theme, onToggle~, children }) { // theme now arrives from App
  console.log('ThemeWrapper rendered');
  return (
    <div className={theme}>
      <button onClick={onToggle}>Toggle theme</button>
      {children}
    </div>
  );
}
```

Compare the two versions of `App`:

```jsx title="With theme in ThemeWrapper: App holds no state"
export default function App() {
  return (
    <ThemeWrapper>
      ~<ChatRoom />~ {/* App does not run again on a click, so this element stays the same object */}
    </ThemeWrapper>
  );
}
```

```jsx title="With theme lifted back up into App"
export default function App() {
  const [theme, setTheme] = useState('light');

  function handleToggle() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeWrapper theme={theme} onToggle={handleToggle}>
      ~<ChatRoom />~ {/* **WRONG:** App runs on every click and makes a new element, so every row re-renders */}
    </ThemeWrapper>
  );
}
```

**Although the JSX syntax appears unchanged, the runtime performance characteristics are completely reversed.** Both examples pass `<ChatRoom />` between wrapper tags. In the second example, however, `App` owns the changing state. Every theme click triggers a re-render of `App`, which allocates a fresh `<ChatRoom />` element descriptor. React receives a new element reference and re-renders the entire chat subtree:

```devconsole caption="The Console after one click on Toggle theme, with theme lifted back up into App."
+ ThemeWrapper rendered | ThemeWrapper.jsx:2
+ ChatRoom rendered | ChatRoom.jsx:14
+ Message rendered: Hi! | Message.jsx:2
+ Message rendered: Lunch at 12? | Message.jsx:2
+ Message rendered: Sure | Message.jsx:2
+ MessageInput rendered | MessageInput.jsx:5
```

Lifting state upward inadvertently dismantles the composition optimization:
1. A sibling component requires theme data, prompting the developer to hoist state into `App`.
2. `App` now re-renders whenever the theme toggles.
3. Every render of `App` allocates a fresh `<ChatRoom />` element object, forcing every message row to re-render.
4. The React documentation cautions against this pattern: "don't lift state up any further than necessary." Lesson 59 demonstrates how sibling components can consume shared state without imposing render cascades.

A similar constraint applies when a child component consumes changing state directly via props or `useContext`. Any component reading a dynamic value must re-render when that value updates. Our message rows consume no theme state in JavaScript, relying exclusively on CSS cascades, which allows React to bypass them.

```tree caption="When the two tools stop working: the component that writes the rows re-renders, or the state moves back up."
What the two tools do not skip
- !`ChatRoom` gets a new message [`setMessages`] | `ChatRoom` re-renders and **writes every `Message` again** | **Every row re-renders**: this is normal
- !`theme` lifted back up into `App` [`App` holds `theme`] | `App` re-renders and makes a **new `<ChatRoom />` element** | **Every row re-renders** on every click
- !A row reads the theme in JavaScript [`theme` prop] [`useContext`] | The row **uses the value that changed** | **That row must re-render**
```

### When the Rows Themselves Are Slow

In certain scenarios, a re-rendering component must instantiate an expensive child, just as `ChatRoom` instantiates message rows upon message submission. If rendering hundreds of rows causes measurable latency, applying `memo` becomes appropriate after benchmarking. The React documentation defines clear criteria for manual memoization (Lessons 54 and 55). It notes that `memo` is only valuable when a component re-renders frequently with identical props and expensive render logic.

The documentation recommends profiling before optimizing. If an interaction feels laggy, use the React Developer Tools profiler to see which components benefit most from memoization. Lesson 64 demonstrates how to profile component renders.

The React Compiler automates this memoization process. As the documentation explains, "when a component's state changes, React will re-render that component and all of its children, unless you have applied some form of manual memoization". The compiler automatically injects memoization checks during build time, which Lesson 63 explores.

---

## All 4 Principles Together

### The Complete Files

Here is the complete chat room. Every piece of state lives in the lowest component that uses it. The chat is passed to the theme wrapper as `children`. No file holds `memo` or a memoization Hook.

```jsx title="src/main.jsx" startLine="1"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```css title="src/index.css" startLine="1"
.light {
  background: white;
  color: black;
}

.dark {
  background: #222;
  color: white;
}
```

```jsx title="src/App.jsx" startLine="1"
import ThemeWrapper from './components/ThemeWrapper.jsx';
import ChatRoom from './components/ChatRoom.jsx';

export default function ~App~() { // 1. Called first; holds no state, so it runs only when the page opens
  return (
    <ThemeWrapper>
      ~<ChatRoom />~ {/* Principles 1 and 2: written by App, so a theme change skips it */}
    </ThemeWrapper>
  );
}
```

```jsx title="src/components/ThemeWrapper.jsx" startLine="1"
import { useState } from 'react';

export default function ~ThemeWrapper~({ children }) { // 2. Called second, and again on every click on Toggle theme
  const [theme, setTheme] = useState('light');
  console.log('ThemeWrapper rendered');
  return (
    <div className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      {children}
    </div>
  );
}
```

```jsx title="src/components/ChatRoom.jsx" startLine="1"
import { useState } from 'react';
import Message from './Message.jsx';
import MessageInput from './MessageInput.jsx';

const initialMessages = [
  { id: 1, text: 'Hi!' },
  { id: 2, text: 'Lunch at 12?' },
  { id: 3, text: 'Sure' },
];
let nextId = 4;

export default function ~ChatRoom~() { // 3. Called third, and again after every Send
  const [messages, setMessages] = useState(initialMessages);
  console.log('ChatRoom rendered');

  function handleSend(text) {
    setMessages([...messages, { id: nextId++, text }]);
  }

  return (
    <section>
      <ul>
        {messages.map(m => <Message key={m.id} text={m.text} />)} {/* Principle 4: written by ChatRoom, so Send re-renders every row */}
      </ul>
      <MessageInput onSend={handleSend} />
    </section>
  );
}
```

```jsx title="src/components/Message.jsx" startLine="1"
export default function ~Message~({ text }) { // 4. Called once per message, after ChatRoom
  console.log('Message rendered:', text);
  return <li>{text}</li>;
}
```

```jsx title="src/components/MessageInput.jsx" startLine="1"
import { useState } from 'react';

export default function ~MessageInput~({ onSend }) { // 5. Called last, and again on every keystroke
  const [text, setText] = useState(''); // Principle 3: the text lives in the one component that uses it
  console.log('MessageInput rendered');

  function handleClick() {
    onSend(text);
    setText('');
  }

  return (
    <div>
      <input placeholder="Message" value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleClick}>Send</button>
    </div>
  );
}
```

### How React Calls the Components

When the page opens, React starts at `App` and follows the tags from top to bottom. `App` prints nothing, and every other component prints one line:

```devconsole caption="The Console when the page opens, one line per call."
+ ThemeWrapper rendered | ThemeWrapper.jsx:5
+ ChatRoom rendered | ChatRoom.jsx:14
+ Message rendered: Hi! | Message.jsx:2
+ Message rendered: Lunch at 12? | Message.jsx:2
+ Message rendered: Sure | Message.jsx:2
+ MessageInput rendered | MessageInput.jsx:5
```

```tree caption="The component tree of the chat room, the order in which React calls each component when the page opens, and which component writes each tag."
1. `App`, called first | Holds no state and prints nothing | **Writes** `<ThemeWrapper>` and `<ChatRoom />`
- +2. `ThemeWrapper`, called second | Holds `theme` and places `{children}` | Re-renders **alone** on Toggle theme
  - +3. `ChatRoom`, called third | Holds `messages`; written by **`App`**, passed as `children` | Re-renders on **Send**
    - +4. `Message`, called once per message | Written by **`ChatRoom`** in its `map` | Re-renders **with `ChatRoom`**
    - +5. `MessageInput`, called last | Holds `text`; written by **`ChatRoom`** | Re-renders **alone** on every keystroke
```

### What Runs After Each Action of the User

| What the user does | Whose state changes | What React re-renders | Why |
| :--- | :--- | :--- | :--- |
| **Clicks `Toggle theme`** | `ThemeWrapper` | `ThemeWrapper` only | `App` wrote `<ChatRoom />` and did not run again, so the element is the same object |
| **Types a letter in the field** | `MessageInput` | `MessageInput` only | `text` lives in the one component that uses it |
| **Clicks `Send`** | `ChatRoom` and `MessageInput` | `ChatRoom`, every `Message`, and `MessageInput` | `ChatRoom` writes the rows and the message input in its own JSX |
| **Clicks `Toggle theme` with `theme` lifted into `App`** | `App` | Everything | `App` makes a new `<ChatRoom />` element on every run |

Remember the one sentence of this lesson. **React does not decide re-renders by where a component appears on screen. It checks which component creates the JSX element, and whether that creator ran again.**

---

## For the Interview

> **The Interview Question:** How does component composition replace memoization without useCallback or useMemo?

### How to Answer Clearly in 30 Seconds

"React re-renders the component whose state changed, along with every element created in its returned JSX. Component composition optimizes performance by restructuring who creates each element:
1. **Pass expensive children via props:** A container owning dynamic state accepts its subtree as `children`, while an outer parent instantiates the child tag. When the container updates, the outer parent does not re-render, so the child element retains identical object identity, allowing React to skip it.
2. **Push state down:** Transient state consumed by a single leaf component, like input text, moves into that dedicated component, confining render cascades exclusively to that leaf.

Neither technique requires `memo`, `useMemo`, `useCallback`, or dependency arrays. Because composition cannot prevent a component from re-rendering elements it instantiates directly, I profile expensive children that must remain co-located. I apply `memo` only when measured latency warrants it."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"`ChatRoom` sits inside the `<div>` that just changed. Why does React not re-render it?"**
   Because visual nesting does not determine render cascades. Evaluating a JSX tag instantiates a plain element descriptor. `App` created `<ChatRoom />` during its initial render and did not execute again during the theme toggle. `ThemeWrapper` returns that identical element reference to React. Because React elements are immutable, identical reference identity guarantees unchanged props, allowing React to skip re-rendering. The React documentation notes: "if React sees the same exact JSX as during the previous render, it won't try to re-render your component."
2. **"Is passing JSX as `children` the same as wrapping that JSX in `useMemo`?"**
   From the perspective of React's reconciler, yes. Both techniques preserve element reference equality across renders, and the React documentation confirms that "The behavior would be the same." However, `useMemo` introduces Hook overhead, requires dependency tracking, and cannot be invoked conditionally. Passing JSX as `children` achieves reference stability purely through component composition. This pattern applies to any prop carrying JSX, including custom slots and `<Suspense>` fallbacks. The React Compiler performs identical element caching automatically at build time.
3. **"When does composition not help?"**
   Composition cannot prevent re-renders in three specific cases. First, when the re-rendering component directly instantiates the expensive child in its own JSX, as `ChatRoom` instantiates message rows upon submission. Second, when state is lifted into the outer parent, forcing that parent to execute and generate new element instances on every update. Third, when the child component directly consumes the updating value via props or context, necessitating a re-render to reflect the change. If co-located child components create perceptible UI lag, I benchmark with the React Profiler and apply `memo` to the child.

```tree caption="Interview summary: composition skips the parts a re-rendering component did not write; memo is for the parts it must write."
Stopping needless re-renders in an interview answer
- +Pass the slow part as `children` | The wrapper owns the state; the **parent above writes the tag** | Same element object, so **React skips it**
- +Move the state down | State lives in the **lowest component** that uses it | Changes re-render **only that component**
- !The component that re-renders writes the slow child | Composition **cannot help here** | **Measure, then `memo`** on the child
```
