# Lecture 58: How Passing JSX as children Replaces memo, useMemo, and useCallback

*(How can a theme button change the colors of a chat without re-rendering every message?)*

> INTERVIEW QUESTION | ❱❱ MORE | How does component composition replace memoization without useCallback or useMemo?

---

## VS | `<ChatRoom />` Written by the Wrapper vs. Passed In as `children`: the same screen, but only one re-renders the chat

> A theme button changes only the visual colors of a page, yet a single click causes React to re-render every message in the chat below it. **Move the theme state into a dedicated wrapper component, and let the parent component write the chat tag and pass it in as `children`**. Because the parent component does not execute again on that click, it passes the exact same chat element instance to React. React skips re-rendering the chat without requiring `memo` or any Hook.

In Lesson 54, we examined how React handles component updates by default. When a component experiences a state update, React executes that component function again. React then recursively re-renders every component whose JSX tag appears inside its returned tree, continuing all the way down. Keeping theme state in the top-level `App` component forces the entire application tree to re-render on every toggle, even when components only need new CSS colors.

Lessons 55 through 57 resolved unwanted re-renders using memoization. We wrapped message rows in `memo`, and added Hooks for each object or callback prop. Each Hook requires maintaining an explicit dependency array, where a single unstable reference invalidates the optimization. This lesson prevents identical re-renders without adding any memoization Hooks or wrappers. By restructuring our component hierarchy, we move one JSX tag up into a parent component and move one piece of state down into a leaf component.

The governing principle of this lesson is straightforward. **React does not care where a component appears on the screen. React cares which component evaluates its JSX tag, and whether that component executed again during the current render pass.**

> [!DEFINITION]
> **The default re-render.** [REVIEW] When a component's state changes, React calls that component function again. React then recursively calls every component written as a tag in its returned JSX tree, regardless of whether their incoming props changed (Lesson 54).

> [!DEFINITION]
> **The children prop.** [REVIEW] Everything placed between the opening and closing tags of a component, such as `<Card><p>Hi</p></Card>`, is passed to that component as the `children` prop. The receiving component renders that content inside its JSX using `{children}` (Lesson 9).

> [!DEFINITION]
> **StrictMode calls every component twice.** [REVIEW] Our project mounts `<App />` inside `<StrictMode>`. In development mode, StrictMode calls every component function twice to expose accidental side effects. In production builds, each component executes only once (Lesson 47).

### The Smallest Page with a Theme Button

Here is the smallest example demonstrating the problem: a button that toggles between light and dark themes, alongside a single chat message.

```page width=text caption="The page when it opens: a Toggle theme button and one message, Hi!."
line: [Toggle theme]
line: Hi!
```

In our initial version, `App` stores the theme state and directly writes the `<ChatRoom />` tag in its own returned JSX:

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

When the user clicks Toggle theme, the page background switches to dark, and the browser console logs two render notices:

```devconsole caption="The real Console after one click on Toggle theme, with theme in App: StrictMode prints the line twice."
+ ChatRoom rendered | App.jsx:4
+ ChatRoom rendered | App.jsx:4
```

This behavior represents default React rendering. Because the state of `App` updated, React re-executes `App`. Because the App component evaluates `<ChatRoom />` during its render, React executes `ChatRoom` as well. StrictMode causes the log to appear twice in development. To keep console logs readable, subsequent console examples in this lesson display a single line per render.

Now we make one structural change. We extract the theme state, the container `<div>`, and the button into a separate component named `ThemeWrapper`. `ThemeWrapper` does not directly write `<ChatRoom />`. Instead, it renders `{children}` where nested content belongs. The parent component writes `<ChatRoom />` between the tags of `ThemeWrapper`:

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

When the user clicks Toggle theme, the visual style switches to dark as expected. This time, however, the console logs only one line, and `ChatRoom rendered` never appears:

```devconsole caption="The Console after one click on Toggle theme, with theme in ThemeWrapper."
+ ThemeWrapper rendered | App.jsx:5
```

On the screen, both implementations produce identical results. Inspecting the browser Elements panel after the click reveals the exact same DOM structure:

```dom caption="The Elements panel after one click on Toggle theme. Both versions show exactly these nodes."
+ <div class="dark"> | note: The only node that changed: light became dark
    <button>Toggle theme</button>
    <p>Hi!</p>
  </div>
```

**The visual output is identical, but the internal execution is completely different.** In both versions, the paragraph `<p>Hi!</p>` renders inside the same container `<div>`. The critical distinction lies in which component evaluates the `<ChatRoom />` tag:
- **With theme state in `App`**, the component whose state changed directly evaluates the tag. React executes `App`, which constructs a new JSX element and forces `ChatRoom` to re-render.
- **With theme state in `ThemeWrapper`**, the parent component `App` evaluates the tag once. Because `App` has no state changes, it does not re-render. React executes only `ThemeWrapper`, which passes through the existing chat element without re-rendering it.

```tree caption="The same ChatRoom inside the same div: the component that writes the tag decides whether a click re-renders it."
Which component writes `<ChatRoom />`?
- !The component whose state changes [`App` holds `theme`] | A click re-renders `App` | React **re-renders `ChatRoom`** too
- +The parent above the wrapper [`App` writes it between the `ThemeWrapper` tags] | A click re-renders **only `ThemeWrapper`** | `App` did not run again, so React **skips `ChatRoom`**
```

The official React documentation summarizes this rule clearly: "When a component visually wraps other components, let it accept JSX as children. This way, when the wrapper component updates its own state, React knows that its children don't need to re-render." Neither version requires `memo` or memoization Hooks.

> [!DEFINITION]
> **Composition.** [NEW] In software architecture, composition is the practice of combining simpler, focused units to build complex structures. In React, component composition means assembling interfaces by nesting components through JSX tags, allowing an outer component to host nested elements that it does not directly instantiate. `ThemeWrapper` hosts the chat layout, while `App` defines and instantiates the chat component (Lesson 58).

### What the User Feels

In our unmemoized chat from Lessons 54 through 57, clicking Toggle theme re-rendered every individual message row. Typing a single character into the input field caused the same full re-render. In a chat with a long history or complex row components, typing becomes sluggish as keypresses queue behind rendering work. The React documentation notes that unnecessary re-renders in large lists cause typing to feel janky.

While memoization can eliminate this input lag, it introduces code complexity and maintenance costs. As the React documentation explains: "The downside of this approach is that code becomes less readable. Also, not all memoization is effective: a single value that's 'always new' is enough to break memoization for an entire component."

This lesson solves the identical rendering delay using plain React component composition in two steps:
1. Move the theme state into a wrapper component that receives the chat through the `children` prop.
2. Move the input text state down into a self-contained input component.

With these two adjustments, the message rows skip re-rendering during theme toggles and keystrokes, completely free of memoization Hooks.

### The Rule of Thumb: ask which component writes the tag

**Before introducing `memo` or caching Hooks, ask two fundamental questions: which component evaluates the slow JSX tag, and does that component re-render?** If the component that re-renders does not directly evaluate the slow tag, React skips that child subtree automatically.

Experienced React developers recognize four common misconceptions regarding component re-renders:
1. **Assuming visual nesting dictates render cycles.** Re-renders are determined by which component evaluates the JSX tag, not which container surrounds it on screen.
2. **Reaching for memoization prematurely.** Profiling state ownership often reveals that moving state down or lifting JSX into children eliminates re-renders with less complexity.
3. **Lifting transient state too high.** Storing keystroke values or hover states at the top of the component tree forces large, unrelated subtrees to re-evaluate on every frame.
4. **Assuming `children` prevents every re-render unconditionally.** When the component holding `children` undergoes a state update, its own children skip rendering, but actions updating the child's own parent still trigger re-renders.

When a frequently changing state variable re-renders an expensive area of the interface, you have five distinct architectural options:
1. **Leave default rendering intact and measure with `<Profiler>`.** If users experience no frame drops or typing delays, optimization is unnecessary (Lesson 54).
2. **Pass the expensive subtree as `children` to the stateful component.** This pattern suits wrapper components like theme containers, modal dialogs, or layout shells (Lesson 58).
3. **Move state down into an isolated leaf component.** This pattern isolates high-frequency updates, such as text inputs or hover highlights, from sibling components (Lesson 58).
4. **Wrap the child in `memo` and stabilize incoming props.** This pattern becomes necessary when the parent component must directly evaluate the child tag during its own re-render (Lessons 55 to 57).
5. **Adopt the React Compiler.** The compiler automatically memoizes JSX elements and values during the build pipeline (Lesson 63).

```tree caption="Five ways to handle a state that changes often above a slow part of the page; this lesson teaches ways 2 and 3."
A state that changes often re-renders a slow part
- +1. Measure first [`<Profiler>`] | The user feels **no lag** | **Leave it**
- +2. Pass the slow part as `children` [`<ThemeWrapper><ChatRoom /></ThemeWrapper>`] | A wrapper **owns the state** and visually wraps the slow part | **This lesson**, Principles 1 and 2
- +3. Move the state down [`MessageInput`] | Only **one small part** uses the state | **This lesson**, Principle 3
- +4. `memo` with `useMemo` and `useCallback` | The component that re-renders **must write** the slow child | Lessons 55 to 57
- +5. React Compiler | Caches JSX **when the app is built** | Lesson 63
```

## SECTION | The Chat Room from Lessons 54 to 57, with No Memoization

We reconstruct the chat room application from Lessons 54 through 57. The interface displays a Toggle theme button at the top, three chat messages, a text input field, and a Send button:

```page width=text caption="The chat room when the page opens: a Toggle theme button, three messages, an empty message field, and a Send button."
line: [Toggle theme]
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field: |
  button: Send
```

We begin without any `memo` wrappers or caching Hooks. We also remove two elements from prior lessons that are not needed here: `ThemeContext` and the Delete button. No component in this design reads theme values in JavaScript. Instead, applying a `.dark` CSS class to the container element controls color styling entirely through the stylesheet.

> [!DEFINITION]
> **An inherited CSS property.** [NEW] Certain CSS properties naturally cascade from an ancestor element down to all nested descendant elements. The `color` property behaves this way: setting `color: white` on a container `<div>` automatically renders all nested `<li>` text in white without requiring inline styles or component props. This CSS inheritance enables our message rows to adapt to theme changes without executing JavaScript re-renders (Lesson 58).

In this starting implementation, `App` manages the theme state and directly renders the chat interface:

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

The `ChatRoom` component stores two independent state variables. The first is `messages`, and the second is the input string `text`. It maps over the messages array to render each message row:

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

The `Message` component is a simple presentational function without `memo`:

```jsx title="src/components/Message.jsx" startLine="1"
export default function Message({ text }) {
  console.log('Message rendered:', text);
  return <li>{text}</li>;
}
```

Observe the console output when interacting with this unoptimized setup. Clicking Toggle theme logs four lines. Typing the character O into the text field also logs four lines:

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

With three simple messages, this redundant rendering finishes in microseconds. In a real-world chat containing hundreds of messages, however, every keystroke must wait for React to re-render the entire list before updating the screen.

By the end of this lesson, our application architecture will be organized into seven clean files without a single memoization Hook:

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

**PRINCIPLES:** React re-renders the component that initiated a state update and all child components directly declared within its returned JSX. To eliminate unnecessary work without memoization, we strategically place state where it is consumed and control which component instantiates each child tag. Four principles guide this structure:
1. **Principle 1: children: the Wrapper Re-renders Alone, and the Chat Its Parent Wrote Is Skipped.** Placing theme state inside a wrapper that accepts `children` allows the parent component to instantiate the chat. Toggling the theme re-renders only the wrapper.
2. **Principle 2: A React Element: the Same Object as Last Time Means No Re-render.** JSX tags evaluate to plain JavaScript element objects. Because the parent component did not execute again, React receives the exact same element reference and skips re-rendering the child.
3. **Principle 3: MessageInput with Its Own text: Typing Re-renders Only the Message Input.** Moving transient input state down into an isolated component restricts keystroke re-renders strictly to the input field itself.
4. **Principle 4: ChatRoom with a New Message: a Component That Re-renders Still Re-renders What It Writes.** Composition optimizes child components passed in from above, but a component that re-renders still re-evaluates all tags written in its own body. Adding a message updates `messages` state and legitimately re-renders all rows.

---

## PRINCIPLE | `children`: the wrapper re-renders alone, and the chat its parent wrote is skipped

> [!PRINCIPLE]
> **Principle 1: children: the Wrapper Re-renders Alone, and the Chat Its Parent Wrote Is Skipped**
>
> *When a component visually wraps an expensive subtree and owns frequently updating state, have it accept that subtree as `children`, and instantiate the child tag in the parent above.*
>
> Changing state re-renders the component owning that state, along with every tag written in its JSX body. When a wrapper component directly writes `<ChatRoom />`, every theme change forces the chat and its rows to re-render. When `App` instantiates `<ChatRoom />` between the wrapper tags, the wrapper merely positions `{children}`. Because `App` did not re-render, React updates the wrapper and skips the chat entirely, without `memo` or prop comparisons.
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

Developers frequently attempt an incomplete refactoring. They move theme state into `ThemeWrapper`, but the wrapper still writes `<ChatRoom />` directly in its own return statement:

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

From the perspective of `ChatRoom`, this intermediate version behaves identically to keeping theme state in `App`. In both cases, the component undergoing the state update directly writes `<ChatRoom />` in its JSX. Each state update forces the wrapper to re-execute, re-evaluating the chat tag and triggering a child re-render. Relocating state does not prevent re-renders if the component still instantiates the child tag.

The optimization succeeds only when the child tag moves out of the stateful component. The wrapper places `{children}`, while the stable parent component `App` instantiates the child tag:

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

We apply this architectural pattern to our chat application. We create `ThemeWrapper` as a dedicated component file. It manages the theme state, the container `<div>`, and the toggle button:

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

The root `App` component no longer manages state. Its sole responsibility is placing `<ChatRoom />` between the wrapper tags:

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

When the user clicks Toggle theme, the chat interface turns dark, and the console records only a single line:

```devconsole caption="The Console after one click on Toggle theme, with the chat passed as children."
+ ThemeWrapper rendered | ThemeWrapper.jsx:5
```

Prior to this change, clicking the toggle logged `ChatRoom rendered` and three separate message logs. Now none of those logs appear, and no component uses `memo`. Here is the exact sequence of events during that click:
1. The user clicks Toggle theme, invoking the state updater to set `theme` to `'dark'`.
2. Because only `ThemeWrapper` holds this state, React schedules a re-render exclusively for `ThemeWrapper`. The console records `ThemeWrapper rendered`.
3. `ThemeWrapper` returns a new container `<div>` with the updated class name. Inside, it references the same `children` prop received from `App`. Because `App` did not re-render, this child reference remains unchanged.
4. React reconciles `ThemeWrapper` and discovers the identical child element reference. It skips calling `ChatRoom` and skips all nested message rows.
5. React updates the DOM by giving the `<div>` the class `dark`. Through CSS inheritance, the browser turns every message inside it dark.

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

The `ThemeWrapper` component never imports `ChatRoom` and never writes its JSX tag. React gathers whatever markup `App` writes between the opening and closing wrapper tags and assigns it to `props.children`. `ThemeWrapper` simply outputs that existing prop within its rendered tree (Lesson 9).

Notice that no component passes theme data down to `ChatRoom` or `Message` through props. The messages turn dark because `color` is an inherited CSS property. Setting the `.dark` class on the parent `<div>` allows the browser engine to style all nested text nodes automatically, removing the need for React component updates.

### VS | `memo` on the Chat vs. the Chat Passed as `children`: the same quiet Console, but only one compares props

Lesson 55 addressed this same problem using manual memoization. In that design, theme state remained in `App`, while `memo` wrapped the chat component and each message row. Compare the two approaches:

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

**Both approaches keep the console quiet, but their runtime mechanics differ fundamentally.** Wrapping a component in `memo` forces React to perform shallow comparisons on every incoming prop whenever the parent component re-renders. If even one prop produces a new reference, the memoization check fails and the component re-renders (Lesson 55). Passing content as `children` avoids prop comparisons entirely. React skips the component because its parent never executed, leaving the child element reference completely unchanged.

In real-world applications, relying on `memo` frequently triggers an escalating cascade of optimization hooks:
1. A developer notices redundant console logs during theme toggles.
2. They wrap the target component and its descendants in `memo` (Lesson 55).
3. Passing objects or callbacks requires adding `useMemo` and `useCallback` to preserve reference equality across renders (Lessons 56 and 57).
4. Any forgotten dependency or newly created inline object breaks the memoization barrier, while incomplete dependency arrays risk stale closures (Lesson 57).
5. The official React documentation recommends simpler structural composition first: "When a component visually wraps other components, let it accept JSX as children."

> [!DEFINITION]
> **A wrapper component.** [NEW] The React documentation defines a wrapper component as one that visually wraps other components, such as a modal dialog, card container, or our theme container `<div>`. Consider a framed photograph: repainting the wooden frame does not modify the image inside. `ThemeWrapper` encloses the chat without instantiating it, so updating the wrapper state never touches the enclosed chat (Lesson 58).

---

## PRINCIPLE | A React element: the same object as last time means React does not call the component

> [!PRINCIPLE]
> **Principle 2: A React Element: the Same Object as Last Time Means No Re-render**
>
> *A JSX tag evaluates to an element object when its enclosing component executes; when React receives the exact same element object reference across renders, it skips re-rendering that component.*
>
> Writing `<ChatRoom />` does not immediately execute the `ChatRoom` function. It creates an immutable JavaScript object describing the component type and props. React inspects this object during reconciliation to determine whether rendering is necessary. Because `App` executed only once, it created the `ChatRoom` element object once. When `ThemeWrapper` updates, it hands that same cached object back to React. Because React elements are frozen upon creation, identical object references guarantee identical output, enabling React to skip execution. Conversely, writing a tag inside a re-rendering component creates a brand-new object on every pass.
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

Why does React skip executing `ChatRoom` even though it resides inside the `<div>` whose class name just changed? The answer lies in how JSX works. Writing a JSX tag does not invoke the underlying component function. It evaluates to a plain JavaScript object representing a virtual DOM node:

```jsx title="A JSX tag and the object it becomes"
const element = ~<ChatRoom />~; // An object like { type: ChatRoom, props: {} }, made when this line runs
```

The official React documentation illustrates this concept using a todo list component:

```jsx title="React's docs: a JSX node and the object it becomes"
<List items={visibleTodos} /> // "A JSX node like this..."
{ type: List, props: { items: visibleTodos } } // "...is an object like this"
```

The `type` property stores a reference to the component function itself. The `props` property contains an object holding all attributes declared on the tag.

> [!DEFINITION]
> **A React element.** [NEW] A React element is an immutable plain JavaScript object created when a JSX expression evaluates, such as `{ type: ChatRoom, props: {} }`. React documentation also refers to this as a JSX node. Evaluating JSX creates a description of the UI rather than invoking the component. React inspects this element during reconciliation and decides whether executing `type` is required (Lesson 58).

**The JSX tag and the JavaScript object are the exact same entity.** JSX provides syntactic sugar for object creation. Evaluating that object is entirely separate from invoking the component function `ChatRoom`. React defers function execution until reconciliation.

```tree caption="Writing a JSX tag makes an element object; React decides later whether to call the component."
What `<ChatRoom />` really is
- +The tag we write [`<ChatRoom />`] | Written in the JSX of `App` | **Made when `App` runs**
- +The element object React gets [`type: ChatRoom` `props: {}`] | **The exact same thing**, written as an object | Describes the tag; **calls nothing**
- +React's decision while it renders | Compares the element with the one from the last render | **Same object**: React skips `ChatRoom`
```

### Same Object or New Object: The Question of Lesson 55

Lessons 55 through 57 demonstrated that JavaScript determines object equality by reference rather than structure. Evaluating two distinct object literals with identical properties returns false under strict comparison:

```js title="Two objects with the same fields"
const a = { type: 'ChatRoom' };
const b = { type: 'ChatRoom' };

console.log(~a === b~); // false: the same fields, but two different objects
console.log(~a === a~); // true: the very same object
```

React applies this exact reference check to elements during reconciliation. Each time an expression containing `<ChatRoom />` executes, JavaScript allocates a brand-new object in memory, even if all attributes remain identical. The critical question is whether the line creating `<ChatRoom />` executed again during the current render:
- **When `ThemeWrapper` writes the tag**, that JSX expression evaluates on every theme toggle. Each toggle produces a new object instance, prompting React to execute `ChatRoom`.
- **When `App` writes the tag**, that JSX expression evaluates only when `App` executes. Because toggling theme does not trigger `App`, no new object is created, and React skips `ChatRoom`.

### The Life of the ChatRoom Element

Here is the complete lifecycle of the chat element from initial mount through a theme update:
1. During initial mount, React executes `App`. Evaluating `<ChatRoom />` creates a single React element object in memory.
2. React places this element into `props.children` and invokes `ThemeWrapper`.
3. The wrapper returns a container `<div>` holding the `children` element. Because the chat is mounting for the first time, React executes `ChatRoom`.
4. The user clicks Toggle theme. Because only wrapper state updated, React re-renders `ThemeWrapper` while `App` remains dormant.
5. The wrapper returns new elements for its container `<div>` and button. Inside, it passes the existing `children` object reference unchanged.
6. During reconciliation, React compares the new tree with the previous render. The `<div>` class attribute changed, so React updates the DOM. However, the `ChatRoom` element possesses the identical object reference as before, so React completely skips invoking `ChatRoom`.

```tree dir=right caption="App makes the ChatRoom element once, and ThemeWrapper hands the same object back to React on every click."
The life of the `<ChatRoom />` element
- +1. First render [`App` runs] | `App` makes **one element object** for `<ChatRoom />`
- +2. Inside the wrapper [`props.children`] | React hands that object to `ThemeWrapper`
- +3. A click on Toggle theme [`ThemeWrapper` runs] | `ThemeWrapper` places **the same object** again | `App` did not run, so **no new object** exists
- +4. React compares | Same object as last time | **React does not call `ChatRoom`**
```

### Why the Same Object Is Safe to Skip

React safely bypasses execution for identical element references because React elements are immutable. The official React documentation states: "You must treat React elements and their props as immutable and never change their contents after creation. In development, React will freeze the returned element and its `props` property shallowly."

Because an element cannot mutate after creation, an identical object reference guarantees that neither its `type` nor its incoming props have changed. The documentation concludes: "A JSX node object could not have changed over time, so React knows it's safe to skip a re-render."

This immutability explains why moving state alone failed in Principle 1. When `ThemeWrapper` directly declared `<ChatRoom />`, each render created a brand-new element object in memory. While the code appeared unchanged, the memory reference was different. As the documentation emphasizes: "the node has to *actually be the same object*, not merely look the same in code."

### VS | `children` from `App` vs. `useMemo` Around One JSX Node: the exact same skip, but only one needs a Hook

There is an alternative way to preserve an identical element reference: wrapping the JSX node inside `useMemo` within the stateful component (Lesson 56):

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

**From React's reconciliation perspective, both patterns produce the exact same outcome.** In both cases, React receives an identical element reference across renders and skips executing `ChatRoom`. Regarding caching JSX with `useMemo`, the React documentation confirms: "The behavior would be the same." The difference lies in developer ergonomics and constraints. Using `useMemo` requires importing a Hook, declaring dependencies, and adhering to Hook rules that forbid conditional invocation. Passing `children` achieves the same optimization through clean component architecture without any Hook restrictions.

### Two More Things Interviewers Ask

The React Compiler automates this element caching at build time. It wraps static JSX in automated cache checks and reuses elements across parent re-renders (Lesson 63).

This reference-based bailout is not unique to the prop name `children`. Any prop that carries JSX elements behaves identically, including the `fallback={<Loading />}` prop on `<Suspense>`. What matters to React is referential equality: when the component defining the JSX does not re-render, its element reference remains stable.

---

## PRINCIPLE | `MessageInput` with its own `text`: typing re-renders only the message input

> [!PRINCIPLE]
> **Principle 3: MessageInput with Its Own text: Typing Re-renders Only the Message Input**
>
> *When only an isolated part of an interface consumes a piece of state, such as text inside an `<input>` field, move that state down into a dedicated component and communicate updates upward using a callback prop.*
>
> Every user keystroke updates the input string. When that input state lives inside `ChatRoom`, each character typed forces `ChatRoom` and every message row to re-render, even though message rows never read the input text. Moving input state into a separate `MessageInput` component confines keystroke re-renders strictly to `MessageInput`. When the user clicks Send, `MessageInput` passes the completed string upward through `onSend`, updating `ChatRoom` exactly once instead of on every keypress.
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

Toggling the theme no longer triggers message re-renders, but typing into the input field still does. Why? The input `text` state resides inside `ChatRoom` alongside the message history. Updating `text` on each keystroke forces `ChatRoom` to re-execute, re-evaluating every JSX tag in its returned tree.

Individual message rows never consume `text`. Only the `<input>` element and the Send button interact with that value. To eliminate wasted work, we move `text` state down into an isolated component named `MessageInput`. The React documentation describes this as moving state down, serving as the architectural counterpart to lifting state up (Lesson 24). Compare both designs:

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

**The user interface appears identical, but the internal render footprint is drastically reduced.** In both implementations, the user types a message and clicks Send. With state in `ChatRoom`, typing a single character forces the chat component and every message row to re-render. With state in `MessageInput`, typing re-renders only the input component, leaving all message rows untouched.

The React documentation highlights this design principle: "Prefer local state and don't lift state up any further than necessary. For example, don't keep transient state like forms and whether an item is hovered at the top of your tree or in a global state library."

> [!DEFINITION]
> **Local state and transient state.** [NEW] Local state is state confined strictly to the specific component that consumes it, such as `text` residing within `MessageInput`. Transient state represents short-lived values that fluctuate rapidly before completing an action, such as ongoing keystrokes in a draft message or hover indicators on list items. React architecture guidelines dictate keeping transient state low in the component hierarchy to prevent high-frequency re-render ripples across surrounding views (Lesson 58).

### The Message Input in Our Chat

We encapsulate this input logic into a dedicated component named `MessageInput`. It manages the local `text` state, the input field, and the Send button:

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

The parent `ChatRoom` removes input text while retaining the `messages` array. It imports `MessageInput` and receives the completed message string through a callback prop (Lesson 23):

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

The user types the letter O, followed by K:

```page width=text caption="The chat after the user types OK in the message field."
line: [Toggle theme]
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field: | OK
  button: Send
```

After each keystroke, the console records only a single line:

```devconsole caption="The Console after the user types O and then K, with text in MessageInput."
+ MessageInput rendered | MessageInput.jsx:5
+ MessageInput rendered | MessageInput.jsx:5
```

Neither `ChatRoom rendered` nor any message row logs appear, and no component requires `memo`. Because each keystroke modifies state held exclusively inside `MessageInput`, React limits execution strictly to that single component.

### Where Did onSend, text, and the Empty Field Come From?

The `onSend` identifier is a standard component callback prop. `ChatRoom` passes its local event handler using the attribute `onSend={handleSend}`. When the user clicks Send, `MessageInput` invokes this function with its current `text` value as an argument. `ChatRoom` remains unaware of intermediate draft strings during typing, receiving the text payload only when submission occurs.

After invoking the callback, `MessageInput` calls `setText('')` to reset its input element. `ChatRoom` cannot reset this field directly because React maintains strict state encapsulation, preventing components from directly mutating state owned by another component.

### VS | A New `onSend` Function on Every Render vs. `onSend` in `useCallback`: the exact same page

In `ChatRoom`, the `handleSend` function reference is recreated on every render pass. A developer accustomed to manual memoization might consider wrapping it in `useCallback`. In this architecture, however, wrapping the handler provides no benefit. Because the input component is not wrapped in `memo`, React will re-render it whenever `ChatRoom` re-renders regardless of prop equality. Instantiating a plain function reference incurs negligible runtime overhead (Lesson 57).

### Two Tools, One Question

Placing transient state too high up in the tree often prompts developers to introduce unnecessary memoization wrappers:
1. A developer places draft input text in `ChatRoom` because the Send button needs access to the final value.
2. Keystrokes trigger continuous re-renders across all message rows.
3. The developer wraps every message row in `memo` to silence the re-renders (Lesson 55).
4. The root issue was misplaced state, as noted in the React guidelines: "don't keep transient state like forms ... at the top of your tree".

Both moving state down and passing JSX as `children` resolve the same architectural question: which component evaluates the expensive child tag, and does that component re-render? Use these criteria to choose between them:
- **Pass the slow part as `children`** when the expensive content is visually enclosed by the component that manages state, such as chat messages enclosed by a theme container.
- **Move state down** when the stateful logic is localized to a sibling widget, such as an input field positioned next to a message history list.

Adjusting state boundaries is a natural part of React architecture. The documentation notes: "It is common that you will move state down or back up while you're still figuring out where each piece of the state 'lives'."

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
> *Passing JSX as `children` and moving state down protect components instantiated by an unchanged parent; when the state of `ChatRoom` itself updates, React still re-renders every child tag written in its own JSX.*
>
> Clicking Send updates the `messages` array in `ChatRoom`. Because `ChatRoom` re-renders, its mapping loop creates four new `<Message>` elements in memory, prompting React to execute each `Message` component. This represents standard React rendering, and in small lists it executes rapidly. Similarly, the optimization in Principle 1 fails if `theme` state is lifted back into `App`, because `App` then re-executes on each toggle and creates new `<ChatRoom />` elements. When rows are genuinely expensive, profile first, then apply `memo` directly to the row.
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

Following the optimizations in Principles 1 through 3, toggling the theme and typing characters produce zero message row logs. However, when the user clicks Send with OK in the input field, the console logs an entry for every message row. This is expected behavior. `ChatRoom` maps over the messages array in its own body, and its state just changed:

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

Here is the step-by-step execution path following that click:
1. The user clicks Send. The input component calls `onSend` with the string OK, then clears its field with `setText('')`.
2. Inside the chat, the `handleSend` callback updates the `messages` state with a new four-item array.
3. React batches both state updates into a single render pass (Lesson 16). It executes `ChatRoom`, logging `ChatRoom rendered`.
4. During execution, the mapping loop in `ChatRoom` evaluates four new `<Message>` JSX tags, producing four new element instances. React executes `Message` for each item.
5. React re-renders `MessageInput` because `ChatRoom` directly evaluates its tag. Its input field now displays an empty string.
6. `ThemeWrapper rendered` does not appear. The state of `ThemeWrapper` did not change, and updates do not flow upward to ancestors.

**Component composition shields only those elements instantiated by a parent that did not re-render. Composition never prevents a component from re-rendering tags written directly inside its own return statement.** The React documentation confirms: "By default, when a component re-renders, React re-renders all of its children recursively." With three or four message items, this default execution is near-instantaneous, and Lesson 54 emphasizes measuring before adding memoization.

The `MessageInput` component preserves its position in the DOM tree, so React maintains its internal state across renders (Lesson 25). The input cleared only because `MessageInput` explicitly invoked `setText('')`.

### VS | `theme` Kept in `ThemeWrapper` vs. `theme` Lifted Back Up into `App`: the same tags, but only one keeps the chat quiet

Consider a scenario where an application header needs access to the current theme to display a matching logo. A developer might lift `theme` state back into `App` and pass it down as props (Lesson 24). In this design, the wrapper no longer owns state, receiving `theme` and `onToggle` as props instead:

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

**The JSX markup appears nearly identical, but lifting state dismantles the optimization.** Both implementations pass `<ChatRoom />` between wrapper tags. In the second version, however, `App` owns the changing state. Every toggle re-renders `App`, which evaluates `<ChatRoom />` again and generates a new element object reference in memory. React sees a new element and re-renders the chat and all message rows:

```devconsole caption="The Console after one click on Toggle theme, with theme lifted back up into App."
+ ThemeWrapper rendered | ThemeWrapper.jsx:2
+ ChatRoom rendered | ChatRoom.jsx:14
+ Message rendered: Hi! | Message.jsx:2
+ Message rendered: Lunch at 12? | Message.jsx:2
+ Message rendered: Sure | Message.jsx:2
+ MessageInput rendered | MessageInput.jsx:5
```

Lifting state higher than necessary silently invalidates composition bailouts:
1. A header requires theme data, prompting a developer to lift `theme` into `App`.
2. `App` now re-renders on every theme toggle.
3. Each render of `App` creates a brand-new `<ChatRoom />` element object, forcing all descendant rows to re-render.
4. Adhering to React guidance prevents this issue: "don't lift state up any further than necessary." Lesson 59 explains how shared state can be read cleanly without this penalty.

A similar constraint applies if an individual row consumes `theme` directly in JavaScript via props or `useContext`. Any component reading a changing value must re-render to reflect the updated state. In our implementation, message rows read no JavaScript theme state, relying entirely on CSS class inheritance so React can skip them.

```tree caption="When the two tools stop working: the component that writes the rows re-renders, or the state moves back up."
What the two tools do not skip
- !`ChatRoom` gets a new message [`setMessages`] | `ChatRoom` re-renders and **writes every `Message` again** | **Every row re-renders**: this is normal
- !`theme` lifted back up into `App` [`App` holds `theme`] | `App` re-renders and makes a **new `<ChatRoom />` element** | **Every row re-renders** on every click
- !A row reads the theme in JavaScript [`theme` prop] [`useContext`] | The row **uses the value that changed** | **That row must re-render**
```

### When the Rows Themselves Are Slow

In certain application designs, a re-rendering component must evaluate expensive child tags directly, just as `ChatRoom` maps over message rows when sending a message. In large datasets with complex row calculations, this scenario justifies manual `memo` optimization after profiling. The React documentation outlines this threshold (Lessons 54 and 55). "Optimizing with `memo` is only valuable when your component re-renders often with the same exact props, and its re-rendering logic is expensive."

The documentation advises verifying bottlenecks with profiling tools. "If a specific interaction still feels laggy, use the React Developer Tools profiler to see which components would benefit the most from memoization, and add memoization where needed." Lesson 64 explores profiler workflows.

The React Compiler can manage these memoization checks automatically. As described in the official documentation, changing component state triggers recursive child re-renders unless manual or compiler-driven memoization applies. The compiler inserts equivalent memoization logic during build compilation (Lesson 63).

---

## All 4 Principles Together

### The Complete Files

Here is the complete chat room application code. Each state variable resides within the most specific component that consumes it. The chat tree passes into the theme container as `children`. No file requires `memo` or caching Hooks.

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

When the application loads, React begins at `App` and traverses the component hierarchy from top to bottom. `App` produces no log output, while each child component logs its execution once:

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

Remember the foundational insight of this lesson: **React does not care where a component sits on the screen. It cares which component writes its tag, and whether that component ran again.**

---

## For the Interview

> **The Interview Question:** How does component composition replace memoization without useCallback or useMemo?

### How to Answer Clearly in 30 Seconds

"React re-renders the component whose state changed, along with every component directly instantiated in its returned JSX tree. Component composition leverages this rule through two primary patterns:
1. **Pass the expensive subtree as `children`**: A wrapper component managing fast-updating state, such as a theme, accepts child content between its tags, while the parent component instantiates that child. When the wrapper updates, the parent does not re-render, so React receives the exact same element object and skips re-rendering the child.
2. **Move state down**: Transient state used by a single widget, such as text in an input field, is moved down into a dedicated component so keystrokes re-render only that specific component.

Neither technique requires `memo`, `useMemo`, `useCallback`, or dependency arrays. Composition cannot prevent a component from re-rendering tags written directly in its own body. When a component must write an expensive child locally, verify the delay with the Profiler and wrap the child in `memo`."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"`ChatRoom` sits inside the `<div>` that just changed. Why does React not re-render it?"**
   Because visual layout on screen is independent of JSX evaluation ownership. Writing a JSX tag produces a plain element object when the enclosing component executes. `App` created `<ChatRoom />` once and never re-executed during the theme toggle. Consequently, `ThemeWrapper` delivers the exact same element object reference to React. Because React elements are immutable, identical object references guarantee that neither props nor component types have changed, allowing React to skip re-rendering. As the React documentation explains: "if React sees the same exact JSX as during the previous render, it won't try to re-render your component."
2. **"Is passing JSX as `children` the same as wrapping that JSX in `useMemo`?"**
   From the perspective of React reconciliation, yes. Both techniques supply React with an identical element reference across renders, prompting the documentation to state: "The behavior would be the same." However, `useMemo` requires managing Hook imports, maintaining dependency arrays, and adhering to Hook rules against conditional calls. Passing `children` achieves identical stability purely through component nesting. The same rule applies to any prop holding JSX, such as `fallback` on `<Suspense>`. The React Compiler performs equivalent caching automatically at build time.
3. **"When does composition not help?"**
   Composition cannot eliminate re-renders in three specific scenarios. First, when a re-rendering component directly instantiates the expensive child within its own body, as when `ChatRoom` maps over `messages` to render each `Message`. Second, when state is lifted into a common ancestor that re-renders and produces new element objects on every pass. Third, when a child component consumes the updated value directly through props or `useContext`, because displaying new data requires a re-render. In the first scenario, if performance lag is confirmed, measure with the React Profiler and wrap the child in `memo`.

```tree caption="Interview summary: composition skips the parts a re-rendering component did not write; memo is for the parts it must write."
Stopping needless re-renders in an interview answer
- +Pass the slow part as `children` | The wrapper owns the state; the **parent above writes the tag** | Same element object, so **React skips it**
- +Move the state down | State lives in the **lowest component** that uses it | Changes re-render **only that component**
- !The component that re-renders writes the slow child | Composition **cannot help here** | **Measure, then `memo`** on the child
```
