# Lecture 54: Why a Re-render Is Usually Fast and Harmless

*(Why does the Console fill up with lines from a component that did not change?)*

> INTERVIEW QUESTION | ❱❱ MORE | When does a component re-render, and why is re-rendering children usually fast and harmless?

---

## VS | A Re-render `Message rendered` vs. a DOM Change `<li>`: React calls the function again, but changes only the DOM nodes that differ

> You type a single character into an input field, and an untouched message component logs to the Console. **That log line confirms a re-render.** React executed the message component function again to compute its new JSX elements. React mutates the real DOM only when those newly returned elements differ from the previous render output. Calling a lightweight JavaScript function costs negligible CPU time and causes zero DOM changes when its JSX matches, so measure real performance before introducing optimizations.

In standard JavaScript, your code searches the document tree and updates that specific DOM element directly. No other code runs, and no other UI elements are queried:

```js title="Plain JavaScript: you change the one element yourself"
document.getElementById('count').~textContent = '4 messages'~; // Only this element changes, and no other code runs
```

In declarative React, your code never mutates DOM nodes directly. Instead, you trigger a state update, and React executes a two-step cycle:
1. **React renders.** It invokes your component function from top to bottom to compute its current JSX output. React also invokes every child component returned by that JSX. This function execution is the re-render, which is what `console.log` statements inside components report.
2. **React commits.** It compares the new JSX elements against the previous render output. React applies changes only to the specific DOM nodes that differ.

```jsx title="React: you call the setter, and React decides what to change"
~setText('O')~; // React calls ChatRoom and its children again, then changes only the DOM nodes that differ
```

A log line in the Console means that React invoked a component function. It does not mean that React rebuilt that section of the browser DOM. Developers often treat rendering and DOM mutations as the same event, but they are completely separate operations.

> [!DEFINITION]
> **Rendering and committing.** [REVIEW] Every screen update has two separate steps. Rendering is React calling your component functions to get their JSX. Committing is React changing the DOM so that it matches that JSX. A component can render without any change on the page, when its JSX is the same as last time (Lesson 13).

> [!DEFINITION]
> **StrictMode calls every component twice.** [REVIEW] Our project mounts `<App />` inside `<StrictMode>`. In development, StrictMode calls every component function twice on purpose, so every `console.log` inside a component prints two lines. With React Developer Tools installed, the second line of each pair appears slightly dimmed in the Console. In production, each component is called once (Lesson 47).

### One Letter, and an Untouched Message Logs Again

Here is the smallest chat screen that shows this behavior. `ChatRoom` stores user input in state, while `Message` displays an individual message:

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

When the page opens, one message sits above an empty input field. The Console already shows two lines, because StrictMode invoked `Message` twice:

```page width=text caption="The smallest chat screen when it opens: one message, Hi!, above an empty input field, and two lines in the Console."
line: Hi!
form:
  field:  |
log: Message rendered: Hi!
log: Message rendered: Hi!
```

We clear the Console. The user now types the letter `O` into the field:

```page width=text caption="The same screen after the user types O: the message still reads Hi!, and the Console prints Message rendered: Hi! again."
line: Hi!
form:
  field:  | O | good
log: Message rendered: Hi!
log: Message rendered: Hi!
```

**React invoked the child component again even though the displayed message did not change.** The prop text still equals `"Hi!"`, and the screen displays the identical text. Each subsequent keystroke triggers this exact sequence.

So what did React modify in the real DOM? React modified nothing. The component returned the same `<p>` element structure as before, so React left the existing DOM node untouched. The official React documentation states that React leaves the DOM unchanged whenever the render output matches the previous pass.

```tree dir=right caption="One letter typed by the user: React calls Message again, but the p node on the page stays as it was."
What one letter does to `Message`
- +Render [`<Message text="Hi!" />`] | React **calls `Message` again** | The Console prints **`Message rendered: Hi!`**
- +Commit [`<p>Hi!</p>`] | The result is **the same as last time** | React **leaves the `<p>` node alone**
```

> [!DEFINITION]
> **A re-render.** [NEW] A re-render occurs when React invokes a component function again, after its initial mount, to calculate fresh JSX output. It happens for three specific reasons. First, the component updates its own state. Second, its parent component re-renders. Third, a React context consumed by the component receives a new provider value. A re-render is simply a JavaScript function call. React mutates DOM nodes only where the newly returned JSX differs from the previous render output (Lesson 54).

### What a Re-render Costs the User

Users never observe internal JavaScript execution directly. Users notice only interface responsiveness, such as whether typed letters appear instantly on screen:
1. **The common case.** Each keystroke re-renders a handful of child components in one or two milliseconds. The character appears in the input field without delay. Adding optimization wrappers to lightweight components delivers zero visible benefit. It only adds boilerplate and harms code readability.
2. **The rare case.** A component executed during the keystroke performs heavy calculations, creating noticeable input lag. Characters appear with an irritating delay. The official React documentation notes that a sluggish component can make typing feel unresponsive and stutter on screen.

Which scenario applies to your app? A list of log entries in the Console cannot answer that question. Only an accurate runtime profile provides the answer.

### The Rule of Thumb: measure first, then pick a fix

**A re-render is simply React executing your function again, and standard function calls are fast. Leave the code intact, measure execution time, and optimize only when users experience real lag.**

Senior developers recognize three common misconceptions:
1. **Assuming a render log indicates a DOM rebuild.** A log entry confirms a JavaScript function invocation. It does not indicate a DOM mutation.
2. **Assuming numerous log entries prove an application is slow.** A developer spots twenty log lines after a single interaction and wraps every component in memoization without measuring performance.
3. **Assuming child components re-render only when props change.** By default, whenever a parent component re-renders, React re-renders every child component returned in its JSX tree.

When profiling reveals a genuine performance bottleneck, developers apply four primary solutions:
1. **Profile first before changing code.** This strategy fits most applications. The official React documentation cautions developers against premature optimization.
2. **Push state down or pass elements as children.** Colocating state near the components that need it prevents higher-level components from re-rendering unnecessarily (Lesson 58).
3. **Memoize with `memo`, `useMemo`, and `useCallback`.** Memoization caches computation results and skips re-renders when input values remain unchanged. This technique targets expensive components that re-render frequently with identical props (Lessons 55 to 57).
4. **Enable the React Compiler.** The compiler analyzes component code and inserts memoization automatically during the build step (Lesson 63).

Remember the central lesson: a re-render is simply React calling your function again, and React mutates only the DOM nodes that actually changed.

## SECTION | The Chat Room with Three Messages

Why use a chat room? Typing a single character into an input field causes every message on screen to re-render. This scenario highlights a common source of developer concern: placing a log inside a list item, typing a word, and watching the Console flood with output.

By the end of this lesson, our chat room includes a theme toggle button, three message items, a text input field, and a submit button. When the application loads, the Console logs each component invocation, followed by a final timing measurement:

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

The user performs three primary interactions on this screen:
1. Enters text into the input field.
2. Clicks the `Send` button.
3. Clicks the `Toggle theme` button.

The application spans six files. The theme context and CSS file arrive in Principle 2, while the profiler measurement arrives in Principle 4:

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

Two logging statements track component execution: one log inside the chat room component, and one inside the message component. The official React documentation relies on this exact technique to demonstrate component execution cycles.

**PRINCIPLES:** A re-render is simply React executing a component function again. It stems from three specific triggers, remains distinct from DOM mutations, and carries a measurable runtime cost. Four core principles guide this behavior:
1. **Principle 1: Parent Re-render: A State Change Renders Every Component Below It Again.** Updating local state causes React to re-render that component and all nested children, even when child props remain identical. Components above the state owner do not re-render.
2. **Principle 2: Context: A Context Change Renders Every Component That Reads It Again.** Updating the context provider value causes React to re-render all consumer components directly. Intermediate components cannot block this update.
3. **Principle 3: Render vs. Commit: React Changes Only the DOM Nodes That Differ.** Submitting a message causes React to execute four child component functions, but only one returns new markup. React inserts a single list node and leaves existing nodes untouched.
4. **Principle 4: Measure First: Read actualDuration Before You Optimize.** Counting console entries reveals call frequency, but `<Profiler>` reports actual execution time. Optimize only when profiling demonstrates real input delay.

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

Review the minimal chat screen again. The message component received the same prop after every keystroke, yet React invoked it each time. Why? React does not check whether child props changed before calling a child function. When `ChatRoom` re-renders, React executes every component that `ChatRoom` returns in its JSX tree:

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

A child component therefore has a second reason to re-render, besides updating its own state: its parent component re-rendered. The official React documentation confirms that React normally re-renders a component whenever its parent re-renders.

What about a prop update? Changing a prop is not an independent trigger. It is simply the new value passed down during the parent component's re-render. Many developers assume that React skips child components whose props remain unchanged, but React executes them by default.

### The chat room with three messages

The chat room now expands into dedicated modular files. `App` serves as the root container rendering `ChatRoom`:

```jsx title="src/App.jsx"
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  return <ChatRoom />;
}
```

`ChatRoom` manages two state variables: the message list array and the active input text. It renders a list of message elements followed by the input field:

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

`Message` logs a line to the Console and returns an individual list item element:

```jsx title="src/components/Message.jsx"
export default function Message({ text }) {
  ~console.log('Message rendered:', text);~ // Prints each time React calls Message
  return <li>{text}</li>;
}
```

Notice an important naming detail: two distinct variables use the identifier text. In the chat room component, the text state stores whatever characters the user typed. In the message component, the text prop represents the string passed to that specific item.

When the page loads initially, React calls the container component followed by each of the three messages. StrictMode doubles every logged line:

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

We clear the Console. The user now types the letter `O` into the field:

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

**Typing a single character into the field re-executes every message component on screen, even though message contents remained identical.** Here is the sequential order of operations:
1. The user types `O`. The input change handler calls `setText('O')`.
2. React re-renders `ChatRoom` because its internal state changed. The Console outputs `ChatRoom rendered`.
3. The component returns the three child message elements again with their existing strings.
4. React invokes each child message function because the parent component re-rendered. The Console logs three message lines.
5. React does not invoke `App`. Only the state of the chat container changed, and parent components higher up do not re-render (Lesson 13).

When the user types `K`, the same five steps repeat.

```tree caption="What React calls after one letter typed into the chat room field."
`App` | **Not called**: it sits above the state that changed
- +`ChatRoom` | **Re-rendered**: its own `text` state changed
  - +`Message` with `Hi!` | **Re-rendered**: its parent re-rendered
  - +`Message` with `Lunch at 12?` | **Re-rendered**: its parent re-rendered
  - +`Message` with `Sure` | **Re-rendered**: its parent re-rendered
```

### The real mistake: twenty lines, and an optimization everywhere

This pattern triggers unnecessary optimization anxiety across many teams:
1. A developer adds a log statement to a child component while debugging an unrelated feature.
2. They type into an input field or click a button in the parent component.
3. The Console outputs a wall of logs: twenty lines for twenty child items.
4. Without profiling execution duration, they assume the page has slowed down.
5. They wrap every component and callback in memoization hooks.

The official React documentation warns against this reaction: attempting to memoize everything harms code readability without delivering any noticeable benefit to users.

### Three facts interviewers ask about

**Setting state to the value it already holds skips the re-render.** Suppose your code calls `setText('')` when the input field is already empty. React compares the previous and next state values using `Object.is` (Lesson 35). Because the values are identical, React bails out and skips re-rendering the component and its children. The documentation notes that React may occasionally run the component function one extra time before bailing out of child renders.

**Multiple state updates in one event trigger a single re-render.** React automatically batches state updates triggered within the same event handler (Lesson 16). An event handler that calls two state setters causes React to re-render the component exactly once. We examine this batching with the submit button in Principle 3.

**Where state lives determines how much of the tree re-renders.** In our project, the input text state lives in `ChatRoom` rather than `App`. Each keystroke re-renders only `ChatRoom` and its message items, leaving higher components untouched. The official React documentation advises against storing transient state at the top of the tree. Transient state refers to frequently changing data needed only momentarily, such as active input text or hover flags. Placing such state at the root forces the entire application to re-evaluate on every keystroke.

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

Our messages should adopt dark styling when the user clicks the theme toggle button. The active theme can reach the message component through two distinct pathways. Both approaches assign the theme class to the list item element, styling the messages dark upon clicking:

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

Both patterns produce the same visual output initially, but their underlying mechanics differ:
- **With props**, the updated theme travels downward through every intermediate component. The child receives the new prop only when its direct parent re-renders and forwards the attribute.
- **With `useContext`**, React directly subscribes the consumer component to the context provider. When the provider value changes by `Object.is`, React schedules a re-render for all subscribing components automatically.

A component reading context therefore has a third reason to re-render: the context value changed. React evaluates the previous and next provider values using `Object.is`. Because string comparisons evaluate text content, `'dark'` and `'light'` register as different values.

Why does this architectural distinction matter? It matters because intermediate components might skip rendering. In Lesson 55 we explore `memo`, which allows a component to skip re-rendering when its props remain unchanged. If an intermediate container skips re-rendering, an updated prop cannot travel past it to reach deeper children. In contrast, context updates bypass intermediate components completely. The official React documentation confirms that memoization in intermediate components cannot block context updates from reaching consumer components.

```tree caption="Two ways the theme can reach Message, and what makes Message re-render in each."
How the theme reaches `Message`
- +As a prop [`<Message theme={theme} />`] | Reaches `Message` **only when its parent renders again** | If a component in between **skips its re-render**, the new theme **never arrives**
- +From context [`useContext`] | React re-renders `Message` **when the value of the provider changes** | **No component in between can stop it**
```

### ThemeContext in the chat room

We implement the context pattern. First, a dedicated module instantiates the context:

```js title="src/ThemeContext.js"
import { createContext } from 'react';

export const ThemeContext = ~createContext('light')~; // The value a reader gets with no provider above it
```

`App` introduces the theme state, the toggle button, and the context provider wrapping the chat container:

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

`Message` reads the theme from context and applies it as a CSS class:

```jsx title="src/components/Message.jsx"
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext.js';

export default function Message({ text }) {
  const theme = ~useContext(ThemeContext)~; // Not a prop: React returns the value of the closest provider
  console.log('Message rendered:', text);
  return <li className={theme}>{text}</li>;
}
```

The stylesheet defines the color palette for each class:

```css title="src/index.css"
.light { background: white; color: black; }
.dark { background: #222; color: white; }
```

We clear the Console. The user clicks the theme toggle button:

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

**Clicking the button once re-renders the component tree below `App`, executing each message component for two distinct reasons simultaneously.** Here is the sequential order of operations:
1. The user clicks the button. The event handler calls `setTheme('dark')` in the parent component.
2. React re-renders `App` because its state changed.
3. The provider receives `'dark'`, which `Object.is` evaluates as different from the initial light theme.
4. React re-renders `ChatRoom` because its parent component re-rendered. The Console logs a line.
5. React re-renders each child message for two concurrent reasons: its parent re-rendered, and its consumed context changed.
6. During the commit phase, React updates the class attribute of the three list item elements from `light` to `dark`.

Clicking the button a second time toggles the theme back to light.

Notice an important detail about this layout: you cannot observe context-triggered re-renders in isolation here. Because the theme state lives in `App` above the entire tree, parent re-rendering coincides with context updates. Isolating context-driven re-renders on their own requires wrapping intermediate components in `memo` (Lesson 55).

### The real mistake: a new object as the value of the provider

Developers frequently bundle state values and dispatch functions into an inline object on the provider:
1. They write `value={{ theme, setTheme }}` directly on the provider element.
2. The parent component re-renders for any reason, such as an unrelated state update.
3. The inline object literal instantiates a brand-new object reference on every render pass, so `Object.is` evaluates the value as changed.
4. Every consumer component that reads the context re-renders, even when the underlying theme remained identical.

The official React documentation warns that passing an inline object reference forces all context consumers to re-render. In larger applications, this creates unnecessary re-render cascades. We address the proper caching fix in Lesson 59.

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

The user can now submit a new message. `ChatRoom` introduces an event handler to process submissions:

```jsx title="src/components/ChatRoom.jsx" startLine="15"
  function handleSend() {
    ~setMessages([...messages, { id: messages.length + 1, text }]);~ // A new array with one more message
    setText(''); // Empties the input field
  }
```

The submit button renders adjacent to the input field:

```jsx title="src/components/ChatRoom.jsx" startLine="27"
      <input value={text} onChange={e => setText(e.target.value)} />
      <button ~onClick={handleSend}~>Send</button> {/* Calls handleSend when the user clicks Send */}
```

Inside the submit handler, the text variable captures the state snapshot from the current render pass (Lesson 15). The handler generates a unique identifier, and stable keys ensure React preserves existing DOM nodes across renders (Lesson 18).

### VS | What the Console shows vs. what the Elements panel shows: four calls, one new node

The user types `OK`. We clear the Console, and the user clicks `Send`:

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

The browser Elements inspector monitors the identical click, revealing what actually happened in the DOM:

```dom caption="The Elements panel after Send: React added one li for OK, and the three earlier li nodes are the same nodes as before the click."
<ul>
  <li class="light">Hi!</li> | note: The same node as before the click
  <li class="light">Lunch at 12?</li> | note: The same node as before the click
  <li class="light">Sure</li> | note: The same node as before the click
  + <li class="light">OK</li> | note: The only node React added
</ul>
```

**The Console indicates that React rendered four messages, whereas the Elements panel confirms that React inserted only one node.** Both statements are accurate. React executed four message component functions, but only one returned newly generated markup. During the commit phase, React inserted a single list item element and left the three preexisting nodes intact. Here is the sequential order of operations:
1. The user clicks `Send`. The handler calls `setMessages` with four items, followed by `setText('')`.
2. React batches both state updates into a single re-render of `ChatRoom`.
3. React invokes the four message functions. The Console outputs four message log entries.
4. React compares each newly returned JSX element against the previous render output. Three elements match, so React leaves their corresponding DOM nodes untouched.
5. React creates and inserts a single DOM node for the new message, and resets the input field value.
6. The browser engine repaints the updated area of the screen.

The official React documentation describes this exact reconciliation process. During a re-render, React calculates which properties have changed since the previous render pass. Next, during the commit phase, React applies minimal DOM mutations to align the browser DOM with the latest render output. Finally, the browser repaints the screen. The documentation labels this final step painting to prevent confusion with React rendering.

```tree dir=right caption="One click on Send: four Message functions run, one li is added, and the browser paints one new line."
What one click on `Send` costs
- +Render [`Message` four times] | React **calls four functions** | Three return **the same `<li>` as last time**
- +Commit [`<li class="light">OK</li>`] | React **adds one node** | Leaves **the three old `<li>` nodes alone**
- +Paint | The browser **draws the new line** | The rest of the screen **stays as it was**
```

This reconciliation model explains why most re-renders remain fast and harmless. Executing a JavaScript function that returns identical JSX costs minimal processing time and zero DOM mutations.

### What a re-render does not touch

Developers who equate re-rendering with redrawing the DOM often worry about losing user state. They fear that re-renders reset active input text, text cursor position, or page scroll offsets. In reality, React preserves all of them. While the user types into the field, the component re-renders after every keystroke while the text cursor remains in place. React retains the existing input DOM element and updates only differing attributes.

The official documentation illustrates this principle with a timer component that re-renders every second. React updates the heading text showing the time, but leaves adjacent input fields untouched.

This preservation relies on pure rendering (Lesson 14). As the documentation warns, visual glitches during re-renders point to side effects inside render functions. Fix the underlying bug rather than masking it with memoization.

### The real mistake: a key that changes on every render

Re-renders remain fast because React uses keys to match new JSX elements to existing DOM nodes. If code assigns unstable keys such as `key={Math.random()}`, every render pass produces a brand-new key identifier. React fails to match incoming elements to existing nodes. As a result, React unmounts and reconstructs every list item from scratch. The documentation notes that dynamically generated keys destroy DOM continuity, forcing complete node recreation and degrading performance.

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

Console logs count function calls, not elapsed duration. Twenty component executions might take two milliseconds, while a single unoptimized calculation could block the thread for an entire second. Counting console entries to gauge performance is like counting runner strides to determine speed: you need an actual timer. React provides this measurement tool through `<Profiler>`:

```jsx title="Measuring ChatRoom with Profiler"
import { Profiler } from 'react';

function onRender(id, phase, actualDuration) {
  ~console.log(id, phase, actualDuration.toFixed(2), 'ms');~ // Prints the name, the phase, and the time
}

<Profiler ~id="ChatRoom" onRender={onRender}~> {/* Measures ChatRoom and every component inside it */}
  <ChatRoom />
</Profiler>
```

The official documentation explains that `<Profiler>` measures React tree rendering performance programmatically. It accepts two primary props:
1. **`id`** is a string identifying the profiled UI section. React forwards this identifier to the callback so you can pinpoint which component tree logged the timing.
2. **`onRender`** is a callback function invoked by React after each commit within the profiled tree.

React provides six parameters to the callback: `id`, `phase`, and four timing numbers. Our profiling function inspects the first three values:
- **`phase`** indicates the render trigger. It returns `"mount"` on initial tree insertion and `"update"` on subsequent re-renders.
- **`actualDuration`** represents the milliseconds spent rendering the profiled tree for the current update. This value reveals the true cost of the re-render.
- **`baseDuration`** estimates how long rendering the tree would take without memoization optimizations.

### Profiler in the chat room

`App` introduces three specific adjustments:
1. It imports `Profiler` from the React package.
2. It declares the `onRender` callback outside the component body.
3. It wraps `ChatRoom` in `<Profiler>` inside the theme context provider.

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

When the page loads, the initial timing measurement outputs to the Console with the phase mount. We clear the Console, and the user types the letter `O`:

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

**Eight console entries appear, but the entire update took approximately two milliseconds.** That measurement encompasses the chat container and all three messages, including StrictMode double-invocations. The user experiences instantaneous input response.

The official documentation provides this guiding rule: if an update causes no perceptible lag, wrapping components in `memo` is unnecessary.

For individual calculations inside a component, the documentation suggests memoizing if the calculation takes one millisecond or longer. That guideline applies to production measurements rather than development mode.

### Development numbers are higher than real ones

Development measurements are consistently higher than production performance:
1. **StrictMode double-invocations and development validation.** React executes components twice in development and runs extensive internal safety checks.
2. **Production optimizations.** Production builds strip debugging assertions and optimize execution. The documentation recommends validating performance bottlenecks on production builds using target user hardware.
3. **Hardware disparities.** Developer laptops feature powerful processors compared to typical mobile devices. Use browser CPU throttling to simulate real-world mobile performance accurately.

### When a re-render is not harmless

When do re-renders cause genuine performance issues?
1. **Computationally heavy render logic.** Complex loops or expensive algorithms running during render cause perceptible frame drops.
2. **Frequent re-rendering of expensive components.** Repeating heavy calculations on every keystroke blocks the main thread.
3. **High-level state placement.** Storing rapid state updates near the tree root forces broad re-render cascades.
4. **High-frequency granular interactions.** Rapid drag-and-drop actions or animations demand 60 frames per second.
5. **Cascading Effects.** Effects that trigger state updates repeatedly create render loops (Lesson 34).

Order of solutions recommended by React documentation:
1. Pass components as children or use composition.
2. Colocate state locally near consumer elements.
3. Keep render functions pure.
4. Eliminate redundant Effects.

If interface lag persists after these steps, profile the interaction with the React Developer Tools profiler (Lesson 64). To measure isolated calculations within a component, use the browser `console.time` and `console.timeEnd` methods.

### The real mistake: memo everywhere, and no measurement

1. A developer observes numerous re-render logs and wraps every component in `memo` (Lesson 55).
2. However, a parent passes an inline object or arrow function as a prop.
3. The component re-renders anyway because the prop reference changes on every pass. The documentation warns that a single unstable reference breaks memoization for the entire component.
4. The codebase becomes cluttered and harder to understand, while performance remains unchanged.

Profiling with `<Profiler>` would have confirmed that the initial re-renders cost negligible time and required no intervention.

---

## All 4 Principles Together

### The complete chat room

Here is the entire application across its modular files. The entry file mounts `App` inside `<StrictMode>`:

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

User interactions originate from two separate levels of the component hierarchy. Typing and submitting modify state in `ChatRoom`, while toggling the theme modifies state in `App`:

```tree caption="Which components React calls when the user types, clicks Send, and clicks Toggle theme in the chat room."
The action of the user and the components React calls
- +Types a letter in the field | The **own state** of `ChatRoom` changed | React calls **`ChatRoom` and its three `Message` functions**, not `App`
- +Clicks `Send` | The **own state** of `ChatRoom` changed, **one re-render for two setters** | React calls **`ChatRoom` and four `Message` functions**, and adds **one `<li>`**
- +Clicks `Toggle theme` | The **own state** of `App` changed, and the **context value** changed | React calls **`App`, `ChatRoom`, and every `Message`**, and changes **each `class`**
```

| Aspect | What Developers Often Assume | What React Does |
| :--- | :--- | :--- |
| **A child with the same props** | React skips it because inputs did not change | React re-renders it whenever its parent re-renders |
| **A component reading context** | Updates only when its direct parent passes new props | React re-renders it when the provider value changes by `Object.is` |
| **A "rendered" log in Console** | The browser reconstructed the DOM elements | React executed a JavaScript function, mutating DOM only where output differs |
| **Numerous logs after an interaction** | The page is slow and requires immediate optimization | Log counts show call frequency, not duration; optimize only for perceptible lag |

Remember the central lesson: a re-render is simply React calling your function again, and React mutates only the DOM nodes that actually changed.

---

## For the Interview

> **The Interview Question:** When does a component re-render, and why is re-rendering children usually fast and harmless?

### How to Answer Clearly in 30 Seconds

"A component re-renders for three reasons: its own state changed, its parent re-rendered, or a context it reads got a different value. A child re-renders with its parent even when its props are the same. Setting state to the value it already holds, by `Object.is`, skips the re-render. Re-rendering is usually harmless for two reasons:
1. **A re-render is only a function call.** React calls the component to get its JSX, and that is usually very fast.
2. **Rendering is not committing.** React compares the new result with the last one and changes only the DOM nodes that differ. A child that returns the same JSX causes zero DOM changes, and the browser paints only what changed.

So I measure first with `<Profiler>` and `actualDuration`. I optimize only when an interaction produces lag the user can feel."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Does a child re-render if its props did not change?"**
   **Yes.** By default, React re-renders every component that a re-rendered component returns, down the tree. In our chat room, each letter typed into the field re-renders every `Message`, although their `text` props stay the same. A changed prop is not a separate cause, only what the new render of the parent passes down. React does not call the components above the one whose state changed. To skip a child with matching props, use tools like memo, child elements, or the React Compiler. Lessons 55, 58, and 63 cover these options.
2. **"Is re-rendering the same as repainting the DOM?"**
   **No.** There are three steps. Rendering is React calling the components and working out what changed. Committing is React applying the smallest set of changes to the DOM. Painting is the browser drawing the screen. After the user clicks `Send` in our chat room, React calls four `Message` functions, but adds only one `<li>` and leaves the other three nodes untouched. A re-render that returns the same JSX causes no DOM change, so the typed text and the cursor in an `<input>` field stay where they are.
3. **"When is a re-render not harmless, and what do you do about it?"**
   A re-render has real cost when rendering logic is expensive, or when high-level components re-render frequently. It also matters during granular interactions or cascading Effects. If a re-render causes a visible problem, that is a bug in an impure component, and the fix is to make rendering pure. Otherwise I measure with `<Profiler>` on a production build and a slowed-down device. If it is really slow, I first keep state low and pass JSX as `children`, and only then reach for `memo`, `useMemo`, or `useCallback`.

```tree caption="Interview summary: the three causes of a re-render, and why a re-render is usually cheap."
When and why a component re-renders
- +Its own state changed [`setText`] | React re-renders **this component and everything below it** | Components **above it are not called**
- +Its parent re-rendered | Happens **even when its props are the same** | A changed prop is **only what the parent passes**
- +A context it reads changed [`useContext`] | The provider got a **different `value` by `Object.is`** | **No component in between can stop it**
```
