# Lecture 54: Why a Re-render Is Usually Fast and Harmless

*(Why does the Console fill up with lines from a component that did not change?)*

> INTERVIEW QUESTION | ❱❱ MORE | When does a component re-render, and why is re-rendering children usually fast and harmless?

---

## VS | Rendering vs. Committing: React calls the function again, but changes only the DOM nodes that differ

> You type one letter into a chat, and a `console.log` inside an untouched message prints a new line. **That line marks a re-render: React called the component function again to compute its latest JSX, but it updates the DOM only where that JSX changed**. Calling a function that returns unchanged JSX costs very little JavaScript execution time and requires zero DOM work, so measure performance before adding optimizations.

Remember how you change a page in plain JavaScript? You find the one element, and you change it yourself. Nothing else on the page runs:

```js title="Plain JavaScript: you change the one element yourself"
document.getElementById('count').~textContent = '4 messages'~; // Only this element changes, and no other code runs
```

In React, you never manipulate the DOM directly. Instead, you call a state setter, and React handles the update across two distinct phases:
1. **React renders.** It calls your component function from the top to compute the new JSX. It also calls every child component returned in that JSX tree. This execution is the re-render, and this is what a `console.log` inside a component body prints.
2. **React commits.** It compares the new JSX elements with the previous elements, and changes only the real DOM nodes that actually differ.

```jsx title="React: you call the setter, and React decides what to change"
~setText('O')~; // React calls ChatRoom and its children again, then changes only the DOM nodes that differ
```

A line that says rendered in the Console means React executed this JavaScript function. It does not mean React rebuilt that section of the page. Rendering and committing occur together, but they remain two separate steps.

> [!DEFINITION]
> **Rendering and committing.** [REVIEW] Every screen update has two separate steps. Rendering is React calling your component functions to get their JSX. Committing is React changing the DOM so that it matches that JSX. A component can render without any change on the page, when its JSX is the same as last time (Lesson 13).

> [!DEFINITION]
> **StrictMode calls every component twice.** [REVIEW] Our project mounts `<App />` inside `<StrictMode>`. In development, StrictMode calls every component function twice on purpose, so every `console.log` inside a component prints two lines. With React Developer Tools installed, the second line of each pair appears slightly dimmed in the Console. In production, each component is called once (Lesson 47).

### One Letter, and an Untouched Message Logs Again

Here is the smallest chat screen that shows this behavior. `ChatRoom` stores user input in local state. `Message` displays a single message:

```jsx title="The smallest chat screen"
function ChatRoom() {
  const [text, setText] = useState('');
  return (
    <>
      <Message text="Hi!" />
      <input value={text} ~onChange={e => setText(e.target.value)}~ /> {/* Every letter the user types calls setText */}
    </>
  );
}

function Message({ text }) {
  ~console.log('Message rendered:', text);~ // Prints each time React calls Message
  return <p>{text}</p>;
}
```

When the page loads, the message Hi! appears above an empty text field. The Console already shows two lines, because StrictMode invoked `Message` twice:

```page width=text caption="The smallest chat screen when it opens: one message, Hi!, above an empty input field, and two lines in the Console."
line: Hi!
form:
  field:  |
log: Message rendered: Hi!
log: Message rendered: Hi!
```

Now clear the Console. Next, the user types the single letter O into the field:

```page width=text caption="The same screen after the user types O: the message still reads Hi!, and the Console prints Message rendered: Hi! again."
line: Hi!
form:
  field:  | O | good
log: Message rendered: Hi!
log: Message rendered: Hi!
```

**React called `Message` again, even though the message never changed.** Its `text` prop remained the string Hi!, and the screen still displays Hi!. Typing another letter repeats this exact cycle.

So what did React change in the DOM? Nothing. `Message` returned the same paragraph element as before, so React left the DOM node untouched. React documentation states this clearly: React does not touch the DOM if the rendering result is the same as last time.

```tree dir=right caption="One letter typed by the user: React calls Message again, but the p node on the page stays as it was."
What one letter does to `Message`
- +Render [`<Message text="Hi!" />`] | React **calls `Message` again** | The Console prints **`Message rendered: Hi!`**
- +Commit [`<p>Hi!</p>`] | The result is **the same as last time** | React **leaves the `<p>` node alone**
```

> [!DEFINITION]
> **A re-render.** [NEW] A re-render is React calling a component function again, after its first render, to get its new JSX. It happens for exactly three reasons. First, the component's own state changed. Second, its parent re-rendered. Third, a context it reads got a different value. A re-render is only a function call: React then changes the DOM only where the new JSX differs from the old one (Lesson 54).

### What a Re-render Costs the User

The user never sees a re-render. The user only notices whether typing feels responsive on the screen.
1. **The common case.** Each keystroke re-renders a few components in a couple of milliseconds, and each letter appears instantly. Adding manual optimizations everywhere changes nothing visible for the user. It only makes component code harder to maintain.
2. **The rare case.** A component re-rendering on every keystroke performs heavy computation, causing typing to stutter. React documentation describes this lag as jank, where letters appear with a noticeable delay.

Which case are you facing? A list of Console lines cannot tell you. Only an accurate measurement reveals the real performance cost.

### The Rule of Thumb: measure first, then pick a fix

**A re-render simply means React called your function again, which is very fast. Leave default re-renders alone, measure with tools, and optimize only when users feel lag.**

Experienced developers recognize three classic misunderstandings:
1. **Assuming rendered means rebuilt the DOM.** It does not. It only means React executed the component function. Each log line reports a JavaScript call, not a DOM change.
2. **Assuming twenty log lines mean a slow application.** A developer sees multiple log lines after a single click and wraps every component in memoization without profiling first.
3. **Assuming a child re-renders only when its props change.** It does not. By default, a child re-renders whenever its parent component re-renders.

When profiling confirms that a component is genuinely slow, you have four practical ways to resolve it:
1. **Keep the code simple and measure first.** This strategy applies to most cases, and it forms the core lesson here. React documentation explicitly warns against premature optimization.
2. **Move state down, or pass unchanged JSX through `children`.** This architecture isolates fast-changing state to the components that need it, avoiding unnecessary renders higher up (Lesson 58).
3. **Memoize components and values using `memo`, `useMemo`, and `useCallback`.** Memoization stores prior results and reuses them while inputs remain unchanged. This technique helps components that re-render frequently with heavy render calculations (Lessons 55 to 57).
4. **Use the React Compiler to memoize automatically** during the project build step (Lesson 63).

Keep the central lesson in mind. **A re-render is React calling your function again, and that is fast: React updates only the DOM nodes whose output actually changed.**

## SECTION | The Chat Room with Three Messages

Why build a chat room? Because every letter typed into a draft input re-renders every message currently on screen. That scenario frequently causes developer anxiety: a developer logs output from a message component, types a word, and watches log lines multiply.

By the end of this lesson, our chat room includes a theme toggle button, three messages, a text input, and a send button. When the page loads, the Console logs each component execution, followed by a final line measuring total elapsed time:

```page width=text caption="The finished chat room when the page loads: a Toggle theme button, three messages, an empty input field, a Send button, and the first lines in the Console."
line: [Toggle theme]
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field:  |
  button: Send
log: ChatRoom rendered | ChatRoom.jsx:13
log: ChatRoom rendered | ChatRoom.jsx:13
log: Message rendered: Hi! | Message.jsx:6
log: Message rendered: Hi! | Message.jsx:6
log: Message rendered: Lunch at 12? | Message.jsx:6
log: Message rendered: Lunch at 12? | Message.jsx:6
log: Message rendered: Sure | Message.jsx:6
log: Message rendered: Sure | Message.jsx:6
log: ChatRoom mount 1.80 ms | App.jsx:6
```

The user performs three primary actions on this interface:
1. Types into the message input field.
2. Clicks the send button.
3. Clicks the theme toggle button.

The project contains six files. Context and styling arrive in Principle 2, while profiler measurement arrives in Principle 4:

```files title="chat-room: File Explorer" caption="How the chat room files sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `<App />` inside `<StrictMode>`
  App.jsx | parent | Holds `theme` in state, provides `ThemeContext`, and measures `ChatRoom` with `<Profiler>`
  ThemeContext.js | named export | Exports `ThemeContext`, created with `createContext('light')`
  index.css | styles | The `.light` and `.dark` classes for a message
  components/
    ChatRoom.jsx | default export | Holds `messages` and `text` in state, and renders the list, the input field, and `Send`
    Message.jsx | default export | Reads `ThemeContext` and renders one `<li>`
```

Two log statements in our code track every render: one in `ChatRoom`, and another in `Message`. Official React documentation demonstrates re-renders the same way, placing a log inside the component body.

**PRINCIPLES:** A re-render is simply React calling a component function again. It stems from three specific triggers, remains distinct from DOM mutation, and has a measurable execution duration. Four principles follow:
1. **Principle 1: A State Change Renders Every Component Below It Again.** When `ChatRoom` state changes, React calls the component and every child message again, even if message contents are unchanged. React never calls components above it.
2. **Principle 2: A Context Change Renders Every Reader Again.** Any component reading a context re-renders when the nearest provider above receives a different `value`. No intermediate component can block this update.
3. **Principle 3: React Changes Only the DOM Nodes That Differ.** When sending a message, React calls four `Message` functions, but only one returns new JSX. React inserts one new list item and leaves existing nodes untouched.
4. **Principle 4: Measure Before You Optimize.** Counting console lines shows execution count, not execution duration. Using `<Profiler>` gives the exact duration in milliseconds. Optimize only when an interaction feels sluggish.

---

## PRINCIPLE | setText: ChatRoom and every Message below it render again, even with the same props

> [!PRINCIPLE]
> **Principle 1: Parent Re-render: A State Change Renders Every Component Below It Again**
>
> *When the state of a component changes, React re-renders that component and every component it returns, down the tree, even when the props of a child did not change; React does not call the components above it.*
>
> A child does not wait for new props. React calls it whenever its parent re-renders, so every letter typed into the field re-runs every message. Keep fast-changing state, such as the text of an `<input>` field, in the component that needs it, so each letter re-renders as little of the tree as possible.
>
> **DO THIS:**
> ```jsx
> function ChatRoom() {
>   const [text, setText] = ~useState('')~; // Each letter re-renders ChatRoom and its messages only
>   return <input value={text} onChange={e => setText(e.target.value)} />;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function App() {
>   const [text, setText] = ~useState('')~; // **WRONG:** the text of the field at the top: each letter re-renders App and everything below it
>   return <ChatRoom text={text} setText={setText} />;
> }
> ```

### A child re-renders because its parent re-rendered

Revisit the smallest chat example. `Message` received the identical text prop Hi! on every keystroke, yet React invoked it each time. Why does this occur? Because React does not automatically verify whether child props changed. When `ChatRoom` re-renders, React executes every component returned in its JSX tree, including `Message`:

```jsx title="The smallest chat screen, again"
function ChatRoom() {
  const [text, setText] = useState('');
  return (
    <>
      ~<Message text="Hi!" />~ {/* ChatRoom returns this tag on every render, so React calls Message every time */}
      <input value={text} onChange={e => setText(e.target.value)} />
    </>
  );
}
```

A child component re-renders for two distinct reasons: its own internal state changed, or its parent component re-rendered. As React documentation explains, React normally re-renders a component whenever its parent re-renders.

What about prop updates? A prop change is not an independent trigger. It is simply the new value passed down during the parent re-render. Developers often assume that unchanged props cause React to skip the child. By default, React never skips a child.

### The chat room with three messages

Now let us examine the modular project files. The root `App` component renders `ChatRoom`:

```jsx title="src/App.jsx"
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  return <ChatRoom />;
}
```

`ChatRoom` manages two state values: the array of messages and the current input text. It renders one `<Message>` for each item, followed by the text input:

```jsx title="src/components/ChatRoom.jsx"
import { useState } from 'react';
import Message from './Message.jsx';

const initialMessages = [
  { id: 1, text: 'Hi!' },
  { id: 2, text: 'Lunch at 12?' },
  { id: 3, text: 'Sure' },
];

export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState('');
  ~console.log('ChatRoom rendered');~ // Prints each time React calls ChatRoom

  return (
    <section>
      <ul>
        {messages.map(m => (
          <Message key={m.id} text={m.text} />
        ))}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
    </section>
  );
}
```

`Message` logs its rendered text and outputs a list item:

```jsx title="src/components/Message.jsx"
export default function Message({ text }) {
  ~console.log('Message rendered:', text);~ // Prints each time React calls Message
  return <li>{text}</li>;
}
```

Notice that two different variables share the name text. In `ChatRoom`, `text` represents component state holding user input. In `Message`, `text` represents the prop received from the parent.

When the page loads, React calls `ChatRoom`, followed by all three message items, with StrictMode doubling each line:

```page width=text caption="The chat room when the page loads: three messages, an empty input field, and two Console lines for every component."
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field:  |
log: ChatRoom rendered | ChatRoom.jsx:13
log: ChatRoom rendered | ChatRoom.jsx:13
log: Message rendered: Hi! | Message.jsx:2
log: Message rendered: Hi! | Message.jsx:2
log: Message rendered: Lunch at 12? | Message.jsx:2
log: Message rendered: Lunch at 12? | Message.jsx:2
log: Message rendered: Sure | Message.jsx:2
log: Message rendered: Sure | Message.jsx:2
```

Clear the Console, and type the single letter O into the field:

```page width=text caption="The chat room after the user types O: the three messages stay the same, and the Console prints all the same lines again."
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field:  | O | good
log: ChatRoom rendered | ChatRoom.jsx:13
log: ChatRoom rendered | ChatRoom.jsx:13
log: Message rendered: Hi! | Message.jsx:2
log: Message rendered: Hi! | Message.jsx:2
log: Message rendered: Lunch at 12? | Message.jsx:2
log: Message rendered: Lunch at 12? | Message.jsx:2
log: Message rendered: Sure | Message.jsx:2
log: Message rendered: Sure | Message.jsx:2
```

**Typing one letter into the input re-executes every message function, even though no message changed.** The sequence occurs in five clear steps:
1. The user types O, causing the change handler to call `setText('O')`.
2. React re-renders `ChatRoom` because its internal state changed. The Console logs ChatRoom rendered.
3. `ChatRoom` returns three `<Message>` tags again with their existing string props.
4. React invokes `Message` three times because their parent re-rendered. The Console logs the three message lines.
5. React never calls `App`. Only `ChatRoom` state updated, and `App` sits above it in the tree (Lesson 13).

Typing the letter K triggers the exact same five steps.

```tree caption="What React calls after one letter typed into the chat room field."
`App` | **Not called**: it sits above the state that changed
- +`ChatRoom` | **Re-rendered**: its own `text` state changed
  - +`Message` with `Hi!` | **Re-rendered**: its parent re-rendered
  - +`Message` with `Lunch at 12?` | **Re-rendered**: its parent re-rendered
  - +`Message` with `Sure` | **Re-rendered**: its parent re-rendered
```

### The real mistake: twenty lines, and an optimization everywhere

This sequence illustrates how unnecessary optimization cycles often begin:
1. A developer places a log statement inside a child component to debug unrelated behavior.
2. They interact with a parent form input or button.
3. The Console fills with repetitive child logs, showing twenty lines for twenty children.
4. The developer assumes the application has slowed down without taking real measurements.
5. They immediately wrap every component and callback in memoization utilities from Lessons 55 to 57.

React documentation highlights the trade-off of this habit. While some developers memoize aggressively, the downside is that code readability suffers substantially, while the user experiences zero perceptible difference.

### Three facts interviewers ask about

**Setting state to its existing value skips re-rendering.** If your handler calls `setText('')` while the input is already empty, React compares the previous and next values using `Object.is` (Lesson 35). Because both values match, React bails out of re-rendering `ChatRoom` and its children. The documentation notes that in rare cases React may execute the component once before skipping downstream children.

**Multiple state updates in one event trigger a single re-render.** React automatically batches updates (Lesson 16). A handler that calls two setters causes only one render cycle. We examine this with the send action in Principle 3.

**State placement dictates the scope of downstream re-renders.** Our input state lives inside `ChatRoom`, rather than in `App`. As a result, typing re-renders `ChatRoom` and its list items, leaving parent components untouched. React documentation advises keeping fast-moving temporary state localized instead of placing it at the top of the tree. A component at the root re-renders the entire application tree beneath it, making misplaced state expensive.

---

## PRINCIPLE | useContext: a different provider value renders every reader again

> [!PRINCIPLE]
> **Principle 2: Context: A Context Change Renders Every Component That Reads It Again**
>
> *A component that reads a context with `useContext` re-renders when the closest provider above it gets a different `value`, compared with `Object.is`; no component between the provider and the reader can stop it.*
>
> A prop reaches a child only when its parent renders again. A context reader is re-rendered by React itself when the value of the provider changes. A string value such as `'dark'` changes only when the theme changes. An object written in place on the provider is a new object on every render, so every reader re-renders every time.
>
> **DO THIS:**
> ```jsx
> <ThemeContext ~value={theme}~> {/* A string: readers re-render only when the theme really changes */}
>   <ChatRoom />
> </ThemeContext>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <ThemeContext ~value={{ theme, setTheme }}~> {/* **WRONG:** a new object on every render of App re-renders every reader, even when theme stayed the same */}
>   <ChatRoom />
> </ThemeContext>
> ```

### VS | The theme as a prop vs. the theme from context: who makes Message render with the new theme

Our chat messages should turn dark when the user toggles the theme. That theme can reach `Message` through two different channels. Both patterns apply the theme as a CSS class name on the list item, making messages dark upon click:

```jsx title="The theme passed as a prop to Message"
<Message ~theme={theme}~ text={m.text} /> {/* ChatRoom must receive theme, and write it on every tag */}

function Message({ theme, text }) {
  return <li className={theme}>{text}</li>;
}
```

```jsx title="The theme read from ThemeContext inside Message"
function Message({ text }) {
  const theme = ~useContext(ThemeContext)~; // React finds the closest ThemeContext above and returns its value
  return <li className={theme}>{text}</li>;
}
```

Both approaches produce identical visual styling, but their update mechanisms differ completely. The key distinction lies in what causes `Message` to re-render with the updated theme:
- **When passed as a prop**, the value flows strictly through the component hierarchy. It reaches `Message` only when `ChatRoom` re-renders and passes the new prop down.
- **When read through `useContext`**, React directly triggers a re-render of `Message` when the provider receives a new value. As the documentation confirms, React automatically re-renders every component reading a context starting from the provider that receives a changed value.

This provides a third reason for a component to re-render: its consumed context value changed. React evaluates provider values using `Object.is`. Because primitive strings compare by value, switching between dark and light represents an explicit value change.

Why is this difference so important? Because intermediate components can skip re-rendering. In Lesson 55 we explore `memo`, which allows a component to skip re-rendering when props remain identical. If `ChatRoom` used `memo` and skipped re-rendering, a theme passed as a prop would never reach the messages. A theme provided through context reaches `Message` regardless, because `memo` only inspects props. React documentation notes that skipping parent re-renders with `memo` does not prevent child consumers from receiving updated context values.

```tree caption="Two ways the theme can reach Message, and what makes Message re-render in each."
How the theme reaches `Message`
- +As a prop [`<Message theme={theme} />`] | Reaches `Message` **only when its parent renders again** | If a component in between **skips its re-render**, the new theme **never arrives**
- +From context [`useContext`] | React re-renders `Message` **when the value of the provider changes** | **No component in between can stop it**
```

### ThemeContext in the chat room

We implement the context pattern. First, create the context definition file:

```js title="src/ThemeContext.js"
import { createContext } from 'react';

export const ThemeContext = ~createContext('light')~; // The value a reader gets with no provider above it
```

`App` holds the theme state, renders the toggle button, and wraps `ChatRoom` in the context provider:

```jsx title="src/App.jsx"
import { useState } from 'react';
import { ThemeContext } from './ThemeContext.js';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext ~value={theme}~> {/* Every reader below gets 'light', then 'dark' after the click */}
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle theme
      </button>
      <ChatRoom />
    </ThemeContext>
  );
}
```

`Message` consumes the theme from context and assigns it as a class name:

```jsx title="src/components/Message.jsx"
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext.js';

export default function Message({ text }) {
  const theme = ~useContext(ThemeContext)~; // Not a prop: React returns the value of the closest provider
  console.log('Message rendered:', text);
  return <li className={theme}>{text}</li>;
}
```

The stylesheet defines the color rules for both states:

```css title="src/index.css"
.light { background: white; color: black; }
.dark { background: #222; color: white; }
```

Clear the Console, and click the theme toggle button:

```page width=text caption="The chat room after the user clicks Toggle theme: the three messages turn dark, and every component below the provider logs again."
line: [Toggle theme]
line: Hi! | good
line: Lunch at 12? | good
line: Sure | good
form:
  field:  |
log: ChatRoom rendered | ChatRoom.jsx:13
log: ChatRoom rendered | ChatRoom.jsx:13
log: Message rendered: Hi! | Message.jsx:6
log: Message rendered: Hi! | Message.jsx:6
log: Message rendered: Lunch at 12? | Message.jsx:6
log: Message rendered: Lunch at 12? | Message.jsx:6
log: Message rendered: Sure | Message.jsx:6
log: Message rendered: Sure | Message.jsx:6
```

**One click re-renders the entire tree below `App`, updating each message for two concurrent reasons.** The sequence unfolds in six steps:
1. The user clicks the button, triggering `setTheme('dark')` in `App`.
2. React re-renders `App` because its state updated.
3. `App` renders `<ThemeContext value="dark">`. Through `Object.is`, the string dark differs from light.
4. React re-renders `ChatRoom` because its parent re-rendered, logging ChatRoom rendered.
5. React re-renders each `Message` due to both its parent re-rendering and its consumed context changing, logging three message lines.
6. During the commit phase, React modifies the class attribute on all three list items from light to dark.

A second click toggles the styling back to light.

Notice that in this simple component tree, the context trigger coincides with the parent re-render. Because theme state lives in `App`, all child components re-render from the parent update anyway. Isolating the context re-render alone requires wrapping intermediate components in `memo`, as shown in Lesson 55.

### The real mistake: a new object as the value of the provider

Developers frequently attempt to share both a state value and its updater function via context:
1. They provide an inline object such as `value={{ theme, setTheme }}` on the provider element.
2. `App` re-renders for any reason, such as an update to an unrelated state variable.
3. The inline curly braces allocate a fresh object instance on every render pass of `App`.
4. Because `Object.is` evaluates object references, the context value always counts as changed, forcing every consuming component to re-render unnecessarily.

As the documentation warns, creating a new object literal forces React to re-render all deep consumer components. In small applications this overhead is negligible, but Lesson 59 details how to cache context values properly.

---

## PRINCIPLE | The commit: React changes only the DOM nodes whose result is different

> [!PRINCIPLE]
> **Principle 3: Render vs. Commit: React Changes Only the DOM Nodes That Differ**
>
> *Rendering is React calling the components and working out what changed; committing is React changing only the DOM nodes that differ; painting is the browser drawing the result. A child that returns the same JSX as last time causes zero DOM changes.*
>
> A Console line that says "rendered" reports a function call, not a change on the page. After the user clicks `Send`, four `Message` functions run and one `<li>` is added. A stable key lets React match each new result to its old node, and that is what keeps a re-render cheap.
>
> **DO THIS:**
> ```jsx
> {messages.map(m => (
>   <Message ~key={m.id}~ text={m.text} /> // The same key on every render: React keeps the old li nodes
> ))}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> {messages.map(m => (
>   <Message ~key={Math.random()}~ text={m.text} /> // **WRONG:** a new key on every render: React removes and rebuilds every li
> ))}
> ```

### The Send button

Now let users submit new messages. `ChatRoom` introduces a submission handler:

```jsx title="src/components/ChatRoom.jsx" startLine="15"
  function handleSend() {
    ~setMessages([...messages, { id: messages.length + 1, text }]);~ // A new array with one more message
    setText(''); // Empties the input field
  }
```

Place the send button immediately following the text input:

```jsx title="src/components/ChatRoom.jsx" startLine="27"
      <input value={text} onChange={e => setText(e.target.value)} />
      <button ~onClick={handleSend}~>Send</button> {/* Calls handleSend when the user clicks Send */}
```

Inside the handler, `text` reads the captured state snapshot from the current render (Lesson 15). Our code generates an incremented id, while the key attribute preserves DOM continuity across list items (Lesson 18).

### VS | What the Console shows vs. what the Elements panel shows: four calls, one new node

The user enters OK. Clear the Console, and click Send:

```page width=text caption="The chat room after the user types OK and clicks Send: a fourth message OK, an empty input field, and four Message lines in the Console."
line: [Toggle theme]
line: Hi!
line: Lunch at 12?
line: Sure
line: OK | good
form:
  field:  |
  button: Send
log: ChatRoom rendered | ChatRoom.jsx:13
log: ChatRoom rendered | ChatRoom.jsx:13
log: Message rendered: Hi! | Message.jsx:6
log: Message rendered: Hi! | Message.jsx:6
log: Message rendered: Lunch at 12? | Message.jsx:6
log: Message rendered: Lunch at 12? | Message.jsx:6
log: Message rendered: Sure | Message.jsx:6
log: Message rendered: Sure | Message.jsx:6
log: Message rendered: OK | Message.jsx:6
log: Message rendered: OK | Message.jsx:6
```

Now inspect the Elements tab in browser developer tools for the same user action:

```dom caption="The Elements panel after Send: React added one li for OK, and the three earlier li nodes are the same nodes as before the click."
<ul>
  <li class="light">Hi!</li> | note: The same node as before the click
  <li class="light">Lunch at 12?</li> | note: The same node as before the click
  <li class="light">Sure</li> | note: The same node as before the click
  + <li class="light">OK</li> | note: The only node React added
</ul>
```

**The Console indicates four rendered messages, but the Elements inspector shows only one added DOM node.** Both observations are completely accurate. React called four `Message` functions, but only one produced new output. Consequently, the commit phase inserts a single list item while preserving the previous three nodes. The process follows six steps:
1. The user clicks Send, causing the send handler to update `messages` and clear `text`.
2. React batches both state updates into a single re-render of `ChatRoom`.
3. React invokes `Message` four times, generating four log statements.
4. React compares each newly returned JSX element against the previous render output. Three elements remain unchanged, so React leaves their existing DOM nodes in place.
5. React creates and attaches the new list item for OK, then resets the input element value.
6. The browser recalculates layout and paints the new text onto the screen.

React documentation describes this exact pipeline. During rendering, React calculates which properties changed since the previous render. In the commit phase, it applies minimal necessary operations to synchronize the DOM. Finally, the browser repaints the display, a browser step distinct from React component rendering.

```tree dir=right caption="One click on Send: four Message functions run, one li is added, and the browser paints one new line."
What one click on `Send` costs
- +Render [`Message` x4] | React **calls four functions** | Three return **the same `<li>` as last time**
- +Commit [`<li class="light">OK</li>`] | React **adds one node** | Leaves **the three old `<li>` nodes alone**
- +Paint | The browser **draws the new line** | The rest of the screen **stays as it was**
```

This pipeline explains why re-rendering is typically fast and harmless. Executing a component function that produces unchanged JSX consumes minimal JavaScript processing and triggers zero DOM mutations.

### What a re-render does not touch

Developers who confuse re-rendering with DOM reconstruction often worry that a re-render erases active user state, such as entered text, focus, or scroll position. A normal re-render preserves all of these. While typing OK, `ChatRoom` re-renders on every character, yet input focus and cursor position remain steady because React retains the underlying input element.

The documentation illustrates this with a clock component updating every second. React updates the heading text while preserving an adjacent input field without disturbing user keystrokes.

This stability requires pure rendering (Lesson 14). If re-rendering a component causes visual anomalies or unexpected behavior, the underlying component contains an impurity bug that must be resolved directly rather than masked with memoization.

### The real mistake: a key that changes on every render

A re-render remains lightweight only when React can match new JSX nodes to existing DOM elements using stable keys. If a developer provides random keys such as `key={Math.random()}`, every render assigns fresh identities to every item. React cannot match new nodes with old ones, so it unmounts and recreates all DOM elements from scratch. Unstable keys turn an efficient virtual DOM comparison into an expensive and disruptive DOM rebuild on every keystroke.

---

## PRINCIPLE | Profiler: actualDuration measures how long a re-render took

> [!PRINCIPLE]
> **Principle 4: Measure First: Read actualDuration Before You Optimize**
>
> *Measure a re-render before optimizing it: wrap the part of the tree in `<Profiler>`, read `actualDuration` in `onRender`, and act only when an interaction has a lag the user can feel.*
>
> The number of log lines says how many times a function ran, never how long it took. `actualDuration` gives the time in milliseconds. Development numbers are higher than production ones, so confirm a slow case on a production build and a slow device before you change the code.
>
> **DO THIS:**
> ```jsx
> <Profiler id="ChatRoom" ~onRender={onRender}~> {/* Prints the real cost of every re-render */}
>   <ChatRoom />
> </Profiler>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function Message({ text }) {
>   ~console.log('Message rendered:', text)~; // **WRONG:** as proof that the page is slow: it counts how many times Message ran, not how long it took
>   return <li>{text}</li>;
> }
> ```

### A log line counts calls, a measurement counts time

Console logs display execution frequency, but they never measure duration. Twenty quick function calls might finish in two milliseconds, whereas one expensive computation could block the main thread for half a second. Instead of guessing performance from call counts, measure execution duration directly. React provides a dedicated timing component for this purpose, called `<Profiler>`:

```jsx title="Measuring ChatRoom with Profiler"
import { Profiler } from 'react';

function onRender(id, phase, actualDuration) {
  ~console.log(id, phase, actualDuration.toFixed(2), 'ms');~ // Prints the name, the phase, and the time
}

<Profiler ~id="ChatRoom" onRender={onRender}~> {/* Measures ChatRoom and every component inside it */}
  <ChatRoom />
</Profiler>
```

React documentation notes that `<Profiler>` measures the programmatic rendering performance of a component tree. Imported directly from the React package, it accepts two essential props:
1. **`id`** is a custom string label identifying the profiled UI region, which React passes back into the timing callback.
2. **`onRender`** is a callback function that React invokes with timing metrics each time components within the profiled tree update.

React passes six parameters to the callback: id, phase, actualDuration, baseDuration, startTime, and commitTime. Our callback inspects the first three:
- **`phase`** indicates why the tree rendered, returning mount for initial rendering or update for subsequent re-renders.
- **`actualDuration`** reports the time in milliseconds spent rendering the profiled subtree for that update, representing the true rendering cost.
- **`baseDuration`** estimates how long rendering the entire subtree would take without any memoization.

### Profiler in the chat room

We update `App` with three modifications:
1. Import `Profiler` from the React package.
2. Define the `onRender` callback outside the component body.
3. Wrap `<ChatRoom />` inside `<Profiler>`, nested within the provider.

```jsx title="src/App.jsx"
import { useState, Profiler } from 'react';
import { ThemeContext } from './ThemeContext.js';
import ChatRoom from './components/ChatRoom.jsx';

function onRender(id, phase, actualDuration) {
  console.log(id, phase, actualDuration.toFixed(2), 'ms');
}

export default function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext value={theme}>
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle theme
      </button>
      ~<Profiler id="ChatRoom" onRender={onRender}>~ {/* Adds no node to the DOM */}
        <ChatRoom />
      </Profiler>
    </ThemeContext>
  );
}
```

When the page loads, the initial measurement logs with the mount phase. Clear the Console, and type the single letter O:

```page width=text caption="The chat room after the user types O, measured: after the eight render lines, onRender prints ChatRoom update and about two milliseconds."
line: [Toggle theme]
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field:  | O | good
  button: Send
log: ChatRoom rendered | ChatRoom.jsx:13
log: ChatRoom rendered | ChatRoom.jsx:13
log: Message rendered: Hi! | Message.jsx:6
log: Message rendered: Hi! | Message.jsx:6
log: Message rendered: Lunch at 12? | Message.jsx:6
log: Message rendered: Lunch at 12? | Message.jsx:6
log: Message rendered: Sure | Message.jsx:6
log: Message rendered: Sure | Message.jsx:6
log: ChatRoom update 2.00 ms | App.jsx:6
```

**Eight render lines appeared in the Console, yet the entire re-render took only around two milliseconds.** That duration accounts for `ChatRoom` and three messages, with each component called twice by StrictMode. The interaction feels completely instantaneous.

React documentation establishes a clear standard: if users experience no perceptible lag, adding `memo` is unnecessary. For an isolated calculation inside a component, the documentation suggests that calculations taking one millisecond or longer may benefit from memoization. Keep in mind that this benchmark applies to production builds rather than development runs.

### Development numbers are higher than real ones

Development measurements always reflect inflated timing numbers compared to production environments:
1. **StrictMode invokes components twice and React executes development validation checks.** As the documentation warns, measuring performance during development does not provide accurate real-world numbers.
2. **Production builds run optimized code with development checks stripped out.** To obtain genuine metrics, create a production build and test it on target devices. Notice that `<Profiler>` is disabled in standard production builds by default, requiring a dedicated profiling build.
3. **Developer workstations usually possess faster processors than consumer phones.** Use developer tools CPU throttling to simulate real user hardware constraints accurately.

### When a re-render is not harmless

Profiling is vital because certain re-renders do carry significant performance penalties:
1. **Rendering logic contains heavy computation.** As documentation notes, normal rendering is rarely expensive unless looping over thousands of objects.
2. **A component re-renders frequently with identical props**, repeating expensive calculations on every render.
3. **State placed near the root of the tree updates frequently**, causing massive cascading re-renders across the entire component tree.
4. **High-frequency interactions trigger rapid updates**, such as dragging canvas elements or sliders.
5. **Mismatched Effects trigger cascading state loops**, causing components to re-render repeatedly (Lesson 34).

Before applying memoization, follow the recommended optimization order from the documentation:
1. Accept JSX as `children` to bypass rendering unchanged trees.
2. Keep state local to the components that need it.
3. Ensure rendering logic remains strictly pure.
4. Remove unnecessary Effects that trigger redundant update cycles.

If a specific user interaction still feels laggy, profile the component tree using the React Developer Tools profiler (Lesson 64). To measure single calculations within a component, use browser console timing utilities.

### The real mistake: optimizing without measuring

1. A developer observes numerous re-renders and prematurely wraps every component in `memo` (Lesson 55).
2. A parent component passes an inline object literal or arrow function prop.
3. The component re-renders anyway, because newly generated references break memoization comparisons.
4. The resulting codebase becomes harder to read and maintain, while delivering zero user performance improvement.

A simple `<Profiler>` measurement would have proven immediately that no optimization was needed.

---

## All 4 Principles Together

### The complete chat room

Here is the whole project. The main entry file mounts App inside StrictMode:

```jsx title="src/main.jsx"
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

```js title="src/ThemeContext.js"
import { createContext } from 'react';

export const ThemeContext = createContext('light');
```

```css title="src/index.css"
.light { background: white; color: black; }
.dark { background: #222; color: white; }
```

```jsx title="src/App.jsx"
import { useState, Profiler } from 'react';
import { ThemeContext } from './ThemeContext.js';
import ChatRoom from './components/ChatRoom.jsx';

function onRender(id, phase, actualDuration) {
  console.log(id, phase, actualDuration.toFixed(2), 'ms');
}

export default function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext ~value={theme}~> {/* Principle 2: a new theme re-renders every reader */}
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle theme
      </button>
      ~<Profiler id="ChatRoom" onRender={onRender}>~ {/* Principle 4: measures every re-render of ChatRoom */}
        <ChatRoom />
      </Profiler>
    </ThemeContext>
  );
}
```

```jsx title="src/components/ChatRoom.jsx"
import { useState } from 'react';
import Message from './Message.jsx';

const initialMessages = [
  { id: 1, text: 'Hi!' },
  { id: 2, text: 'Lunch at 12?' },
  { id: 3, text: 'Sure' },
];

export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = ~useState('')~; // Principle 1: each letter re-renders ChatRoom and its messages
  console.log('ChatRoom rendered');

  function handleSend() {
    setMessages([...messages, { id: messages.length + 1, text }]);
    setText('');
  }

  return (
    <section>
      <ul>
        {messages.map(m => (
          <Message ~key={m.id}~ text={m.text} /> // Principle 3: a stable key keeps the old li nodes
        ))}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </section>
  );
}
```

```jsx title="src/components/Message.jsx"
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext.js';

export default function Message({ text }) {
  const theme = useContext(ThemeContext);
  console.log('Message rendered:', text);
  return <li className={theme}>{text}</li>;
}
```

### Which components React calls for each action

The three user interactions originate from two distinct points in the component tree. Typing and sending messages update `ChatRoom` state, whereas toggling the theme updates `App` state:

```tree caption="Which components React calls when the user types, clicks Send, and clicks Toggle theme in the chat room."
The action of the user and the components React calls
- +Types a letter in the field | The **own state** of `ChatRoom` changed | React calls **`ChatRoom` and its three `Message` functions**, not `App`
- +Clicks `Send` | The **own state** of `ChatRoom` changed, **one re-render for two setters** | React calls **`ChatRoom` and four `Message` functions**, and adds **one `<li>`**
- +Clicks `Toggle theme` | The **own state** of `App` changed, and the **context value** changed | React calls **`App`, `ChatRoom`, and every `Message`**, and changes **each `class`**
```

| Aspect | What Developers Often Assume | What React Does |
| :--- | :--- | :--- |
| **A child with the same props** | React will not call it, because nothing it receives changed | React calls it whenever its parent re-renders |
| **A component that reads context** | It updates only when its parent passes something new | React re-renders it when the `value` of the provider changes by `Object.is` |
| **A "rendered" line in the Console** | The page was rebuilt | React called a function; the commit changes only the DOM nodes that differ |
| **Twenty log lines after one click** | The page is slow, so every component needs an optimization | Only `actualDuration` tells the cost; optimize when the user can feel a lag |

Remember the central lesson of this chapter. **A re-render is React calling your function again, and that is cheap: React changes only the DOM nodes whose result is different.**

---

## For the Interview

> **The Interview Question:** When does a component re-render, and why is re-rendering children usually fast and harmless?

### How to Answer Clearly in 30 Seconds

"A component re-renders for three reasons: its own state changed, its parent re-rendered, or a context it reads received a new value. A child component re-renders with its parent even when its props remain unchanged. Setting state to its existing value by `Object.is` skips the re-render. Re-rendering is usually fast and harmless for two reasons:
1. **A re-render is simply a JavaScript function call.** React executes the component to calculate its JSX representation, which is normally extremely fast.
2. **Rendering is distinct from committing.** React compares new JSX with previous output and updates only the DOM nodes that differ. A child returning identical JSX causes zero DOM mutations, and the browser only repaints what changed.

Always measure performance with `<Profiler>` and `actualDuration` or the React Developer Tools profiler, optimizing only when users experience genuine lag."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Does a child re-render if its props did not change?"**
   **Yes.** By default, React re-renders every child component returned by a re-rendering parent down the tree. In our chat room, every typed letter re-renders every `Message`, even though `text` props stay identical. A prop update is not an independent trigger, but simply new data passed during the parent render. React never calls components above the updated component. To skip unchanged children, use component composition, `memo`, or the React Compiler (Lessons 55, 58, and 63).
2. **"Is re-rendering the same as repainting the DOM?"**
   **No.** React updates the screen across three phases. Rendering is React executing component functions to compute virtual output. Committing is React applying minimal necessary DOM mutations. Painting is the browser drawing updated pixels to the screen. After clicking Send, React executes four `Message` functions, but inserts only one new list item while leaving existing nodes untouched. Unchanged JSX causes zero DOM updates, preserving user input focus and cursor placement.
3. **"When is a re-render not harmless, and what do you do about it?"**
   Re-renders become problematic in specific scenarios. They degrade performance when rendering logic performs heavy computation, when root components update continuously, during high-frequency drag events, or when cascading Effects trigger update loops. If re-rendering produces visual glitches, the component contains an impurity bug that must be fixed directly. Otherwise, measure actual duration in production builds under CPU throttling. If sluggishness is confirmed, relocate state locally and compose JSX with `children` before applying memoization hooks.

```tree caption="Interview summary: the three causes of a re-render, and why a re-render is usually cheap."
When and why a component re-renders
- +Its own state changed [`setText`] | React re-renders **this component and everything below it** | Components **above it are not called**
- +Its parent re-rendered | Happens **even when its props are the same** | A changed prop is **only what the parent passes**
- +A context it reads changed [`useContext`] | The provider got a **different `value` by `Object.is`** | **No component in between can stop it**
```
