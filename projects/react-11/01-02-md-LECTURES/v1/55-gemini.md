# Lecture 55: When memo Skips a Re-render, and When It Cannot

*(How do you tell React to skip a child whose props did not change, and why does it sometimes not skip?)*

> INTERVIEW QUESTION | ❱❱ MORE | When should you wrap a component in React.memo, and when does it fail to skip re-renders?

---

## VS | A Plain `Message` vs. a Memoized `Message`: React calls the plain one on every keystroke, and skips the memoized one while its props stay the same

> When a user types a single character into an input field, React re-renders every child component returned by the parent, even when child props remain unchanged. **Wrap the child component in `memo`, and React compares each prop against its previous value using `Object.is`, skipping execution when every prop matches**. This optimization pays off only for computationally expensive components. It fails completely when the parent passes a freshly allocated object, array, or function on each render.

In Lesson 54, you saw how state updates propagate down the component tree. When a user types into the chat input, the parent component updates its state and re-renders. By default, React calls every child component function returned by the parent JSX, even when those child components receive unchanged props. Under normal circumstances, re-executing lightweight functions costs almost no processor time and produces no user-facing delay.

Now imagine a chat view displaying several hundred messages, where each message component performs complex formatting or contains expensive subtrees. Every keystroke would invoke hundreds of sluggish component functions, causing noticeable latency in the text field. In this situation, you want React to inspect incoming props before re-executing the child. If the incoming props match the previous props, React should skip the function execution and reuse its previous output.

This selective skipping is precisely what `memo` provides. **A memoized component skips execution only while every single prop matches its previous value.** Understanding this behavior requires examining what JavaScript and React consider equal.

> [!DEFINITION]
> **A re-render.** [REVIEW] A re-render occurs when React invokes a component function after initial mount to calculate fresh JSX output. It happens for three reasons: component state updates, parent re-renders, or context value changes. By default, children re-render alongside their parent even when props remain identical. A re-render executes JavaScript code, but React touches the DOM only where new JSX output differs from previous output (Lesson 54).

> [!DEFINITION]
> **Object.is.** [REVIEW] `Object.is(a, b)` is the JavaScript comparison method React uses to test whether two values are identical. For primitive values like strings and numbers, it compares values directly. For objects, arrays, and functions, it compares memory references: two separate objects with identical properties evaluate to false because they reside at different memory addresses (Lesson 37).

> [!DEFINITION]
> **StrictMode calls every component twice.** [REVIEW] In development mode, mounting an application inside StrictMode causes React to invoke every component function twice. This intentional double invocation helps uncover unintentional side effects during rendering, causing every console log inside a component body to print two consecutive lines. Production builds execute each component function only once (Lesson 47).

### The Smallest Chat with memo

Here is the smallest chat example demonstrating memoization. The chat room component manages user input in local state, while the message component is wrapped in `memo`:

```jsx title="One memoized message and an input field"
import { memo, useState } from 'react';

const Message = ~memo~(function Message({ text }) { // memo wraps our message component
  console.log('Message rendered:', text);
  return <li>{text}</li>;
});

function ChatRoom() {
  const [text, setText] = useState('');
  return (
    <>
      <ul>
        <Message ~text="Hi!"~ /> {/* The same string on every render of ChatRoom */}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
    </>
  );
}
```

When the page loads, the Console displays two lines from the initial mount, which reflects development mode running under StrictMode:

```page width=text caption="The smallest chat when the page opens: one message, Hi!, above an empty input field, and two lines in the Console."
line: Hi!
form:
  field:  |
log: Message rendered: Hi!
log: Message rendered: Hi!
```

Now the user types the letters `OK` into the input field. Each keystroke triggers a state update in the parent component, causing it to re-render. Yet the Console continues to display only the two initial log entries:

```page width=text caption="The smallest chat after the user types OK: the Console still holds only the two lines from the page load."
line: Hi!
form:
  field:  | OK | good
log: Message rendered: Hi!
log: Message rendered: Hi!
```

React skipped invoking the message component on both keystrokes. Before executing the child function, React compared the incoming text prop against its previous value. Because the string prop remained unchanged, React reused the previous render output without executing the component function.

Next, we add a second prop to the message component: an inline arrow function representing a delete handler:

```jsx title="The same memoized message with one more prop, a function"
<Message text="Hi!" ~onDelete={() => {}}~ /> {/* A new function on every render of ChatRoom */}
```

We refresh the browser and type `OK` again. This time, every single keystroke appends two additional log lines to the Console, behaving as if `memo` were completely absent:

```page width=text caption="With the onDelete arrow function, after the user types OK: two lines from the page load, then two more for each letter."
line: Hi!
form:
  field:  | OK | good
log: Message rendered: Hi!
log: Message rendered: Hi!
log: Message rendered: Hi!
log: Message rendered: Hi!
log: Message rendered: Hi!
log: Message rendered: Hi!
```

The empty arrow function appears identical across renders in your source code, but JavaScript does not treat it as the same value. The text string evaluates to the identical primitive value on every pass. In contrast, evaluating an arrow function expression allocates a brand-new function instance in memory during each render of the parent. When React compares props using `Object.is`, it finds that the callback prop holds a different function reference. A single changed prop causes React to re-render the child component.

```tree caption="A memoized component is skipped while every prop is the same as last time, and rendered again when one prop is new."
What React does with a memoized `Message` when `ChatRoom` re-renders
- +Every prop is the same as last time [`text="Hi!"`] | The string **`"Hi!"` equals** the old `"Hi!"` | React **skips** `Message` and keeps the last result
- !One prop is new [`onDelete`] | An arrow function written in `ChatRoom` is **new on every render** | React **renders** `Message` again, as if `memo` were not there
```

### Why It Is Called memo

The term memoization comes from computer science, describing an optimization technique where expensive computation results are stored in a cache. When identical inputs appear again, the program returns the cached result instead of repeating the computation. The official React documentation describes memoizing simply as caching.

In plain JavaScript, implementing a memoization cache requires storing the previous inputs alongside the computed output, checking equality before executing the function:

```js title="Plain JavaScript: a cache you write yourself"
let lastText = null;
let lastResult = null;

function cachedMessage(text) {
  if (~Object.is(text, lastText)~) return lastResult; // The same input as last time: reuse the old result
  lastText = text;
  lastResult = renderMessage(text);
  return lastResult;
}
```

The `memo` function automates this caching pattern for component rendering. For any React component, the inputs to the function are its props. React compares each incoming prop against its previous value, invoking the component function only when at least one prop has changed.

> [!DEFINITION]
> **memo and a memoized component.** [NEW] `memo` is a higher-order component provided by React that accepts a component function and returns an enhanced, memoized component. When the parent component re-renders, React inspects incoming props against previous props using `Object.is`. If all props match, React skips executing the component and reuses its previous JSX elements. If any prop differs, React invokes the component function normally (Lesson 55).

### What the User Feels

End users never inspect function call logs or component trees. Users notice only interface responsiveness, particularly when typing into form fields. In a conversation view with hundreds of entries, re-executing heavy message components on every keystroke blocks the main browser thread. This delay causes typed characters to appear with a frustrating stutter, which React documentation describes as janky typing.

1. **When memoized components receive stable props**, React skips executing child components, allowing keystrokes to process smoothly without input lag.
2. **When even a single prop receives a fresh reference**, React re-executes the memoized component anyway. The user experiences the same typing delay, while the codebase gains unnecessary complexity. The official documentation warns that a single unstable value is enough to break memoization for an entire component.

### The Rule of Thumb: measure first, and keep every prop the same

**`memo` skips execution only while every prop matches its previous value. Introduce it only when profiling reveals perceptible rendering lag, and ensure that no prop receives a freshly constructed object or function on every render.**

Senior engineers recognize four common misconceptions regarding `memo`:
1. **Assuming `memo` prevents all possible re-renders.** Developers are surprised when inline function props, context updates, or internal component state trigger a re-render.
2. **Assuming React inspects nested object properties.** React performs shallow equality checks and never inspects values nested within objects or arrays.
3. **Wrapping components without measuring real rendering overhead.** Adding memoization without profiling inflates boilerplate without producing any measurable performance improvement for users.
4. **Relying on `memo` for application correctness.** Memoization is strictly an optional performance optimization. If application behavior breaks when `memo` is removed, the component architecture contains an underlying bug.

When a child component re-renders frequently with identical props, consider four distinct remedies:
1. **Profile first and leave harmless re-renders alone.** Measure component duration using `<Profiler>` (as seen in Lesson 54). If user interactions remain fluid, optimization is unnecessary.
2. **Push state down or pass JSX elements as children.** Colocating state near dependent components or leveraging component composition avoids unnecessary re-renders without memoization (Lesson 58).
3. **Wrap expensive children in `memo` and stabilize incoming props.** This approach targets computationally intensive components that re-render frequently with matching props. Values constructed during parent execution must also be stabilized using `useMemo` and `useCallback` (Lessons 56 and 57).
4. **Enable the React Compiler.** The compiler analyzes JavaScript code and automatically applies memoization optimizations during the build step (Lesson 63).

```tree caption="Four ways developers handle a child that re-renders often with the same props."
A child re-renders often with the same props
- +1. Measure first with `<Profiler>` | Fits when the user feels **no lag** | No code to add
- +2. Move state lower or pass `children` | The docs list these **first** | Lesson 58
- +3. Wrap the slow child in `memo` | Fits a child that renders **often**, with the **same props**, and **slowly** | This lesson
- +4. React Compiler | Applies the equivalent of `memo` **at build time** | Lesson 63
```

## SECTION | The Chat Room with a Delete Button on Each Message

Why use a chat room? Typing in a message input re-renders the parent component, which in turn re-renders every message displayed above it. This pattern represents the classic scenario where developers first attempt to apply `memo`. Building on the chat room from Lesson 54, we wrap individual message items in `memo`. The resulting interface comprises four primary elements:

1. A theme toggle button at the top of the interface.
2. A list of three initial messages, each equipped with its own delete button.
3. A text input field for composing a new message.
4. A send button to submit the message.

```page width=text caption="The finished chat room: a theme button, three messages with Delete buttons, the input field, and Send."
line: [Toggle theme]
line: Hi! [Delete]
line: Lunch at 12? [Delete]
line: Sure [Delete]
form:
  field:  |
  button: Send
```

Users interact with the chat by typing text, submitting messages, toggling the color theme, and deleting existing messages. Three separate state variables control the application. The theme state resides in `App`, while the messages array and input draft state reside in `ChatRoom`.

The project structure organizes these concerns across six files:

```files title="chat-room: File Explorer" caption="How the files of our chat room sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `App` inside `<StrictMode>` and imports `index.css`
  App.jsx | parent | Holds `theme` state and the `Toggle theme` button, and renders `ChatRoom`
  ThemeContext.js | context | Exports `ThemeContext`, created with `createContext`
  index.css | styles | The `.light` and `.dark` classes
  components/
    ChatRoom.jsx | state | Holds `messages` and `text`, renders the messages, the input field, and `Send`
    Message.jsx | memoized | Exports the memoized `Message`
```

How do we verify whether React skipped rendering a message? We place a `console.log` call inside each component body. The chat room logs that it rendered, while each message logs its rendered text. When a message log is absent, React skipped executing that component. Because development runs under StrictMode, each execution outputs two identical lines in the Console.

**PRINCIPLES:** A memoized component skips execution only while every prop matches its previous value. Four central principles govern this behavior:
1. **Principle 1: memo Skips the Message While Its Props Stay the Same.** Wrap the component in `memo` and export the resulting value. When the parent re-renders, React skips child execution if all incoming props match previous values.
2. **Principle 2: Object.is Compares Each Prop.** Primitive strings and numbers compare by value. Objects, arrays, and functions declared inside the parent allocate fresh memory references on every render, causing shallow equality checks to fail.
3. **Principle 3: memo Checks Props Only.** A memoized component still re-renders whenever a consumed context changes or when the component updates its own internal state.
4. **Principle 4: A Function Written in the Parent Breaks memo.** Passing an inline arrow function or a function declared in the parent body provides a new reference on every keystroke, forcing the memoized child to re-render.

---

## PRINCIPLE | `memo`: React skips the component while every prop stays the same

> [!PRINCIPLE]
> **Principle 1: memo: React Skips a Memoized Component While Its Props Stay the Same**
>
> *Wrap a component in `memo` and use the component it returns; when the parent re-renders, React skips it as long as every prop is the same as last time.*
>
> Every keystroke re-renders the parent component. Without `memo`, React re-executes every child message even when each message receives identical text. Wrapping a function in `memo` leaves the underlying function intact, producing an enhanced component that shallowly compares props before executing. If you export the original plain function instead of the memoized result, React skips nothing.
>
> **DO THIS:**
> ```jsx
> const Message = memo(function Message({ text }) {
>   return <li>{text}</li>;
> });
> export default ~Message~; // Exports the memoized component: messages with the same text are skipped
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function Message({ text }) {
>   return <li>{text}</li>;
> }
> memo(Message);
> export default ~Message~; // **WRONG:** exports the plain function, so every message renders at every letter
> ```

### VS | `function Message` vs. `memo(function Message)`: the same page, but only the memoized one is skipped

Here are two distinct implementations of the message component. Both share identical internal logic: each logs to the Console and returns a list item. The sole structural difference is the wrapping call to `memo`:

```jsx title="Message as a plain function"
function ~Message~({ text }) { // React calls it on every render of ChatRoom
  console.log('Message rendered:', text);
  return <li>{text}</li>;
}
```

```jsx title="Message wrapped in memo"
const Message = ~memo~(function Message({ text }) { // React skips it while text stays the same
  console.log('Message rendered:', text);
  return <li>{text}</li>;
});
```

On initial page load, both implementations render identical markup and output identical log messages. The crucial behavioral divergence appears when the user types a character:
- **With the plain function**, the keystroke triggers a state update in the parent, prompting React to call the child function again. The Console prints another log entry.
- **With `memo`**, the parent component re-renders as usual. However, React detects that the incoming text prop matches the previous string, skipping the child function entirely. No log entry appears.

```tree caption="A plain Message and a memoized Message show the same page, but only the memoized one is skipped when the user types."
What happens to `Message` when the user types in the field
- !Plain function [`function Message`] | React calls it **on every render** of `ChatRoom` | New `Message rendered:` lines **at every letter**
- +Wrapped in `memo` [`memo`] | React compares `text` with the old `text` | Same string, so React **skips** it: **no new line**
```

### memo Returns a New Component

Imported from the React library, `memo` does not mutate or modify your original function declaration. Instead, it wraps your function and returns an enhanced component. The official React documentation emphasizes that `memo` returns a new, memoized component rather than altering the existing one.

To benefit from memoization, you must render the wrapped component returned by `memo`. That returned component contains the comparison logic React executes prior to rendering.

Whether you reference `memo` or `React.memo` makes no functional difference. Both syntax styles access the exact same function:

```jsx title="memo imported by name, and memo read from the React object"
import React, { memo } from 'react';

function MessageRow({ text }) {
  return <li>{text}</li>;
}

const Message = ~memo~(MessageRow); // memo imported by name, as React's docs write it
const SameMessage = ~React.memo~(MessageRow); // The same function, read from the React object
```

### The Message File Exports What memo Returns

We now construct the initial version of our chat application. The message module wraps the function in `memo` and exports the memoized component reference:

```jsx title="src/components/Message.jsx"
import { ~memo~ } from 'react'; // memo is a function React provides

const Message = ~memo~(function Message({ text }) { // memo returns a new, memoized component
  console.log('Message rendered:', text);
  return <li>{text}</li>;
});

export default ~Message~; // Exports the memoized component, not our plain function
```

Because `Message` stores the value returned by `memo`, it is declared as a constant rather than a standard function declaration. Here is the operational sequence:
1. When the module loads, JavaScript evaluates the call to `memo`, passing the component function as an argument.
2. The `memo` utility returns a new memoized component.
3. The module assigns this returned component to a constant and exports it as the default export.
4. The parent component imports the memoized component and renders it using standard JSX tags.

We retain the explicit name in the wrapped function expression. Retaining this component name preserves clear identification in React Developer Tools and error stack traces.

The chat room component manages the messages array, the input draft state, and the send button. It renders message items just as it would render unmemoized components:

```jsx title="src/components/ChatRoom.jsx"
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
    setMessages([...messages, { id: ~nextId++~, text }]); // Gives the new message the id 4, then 5, and so on
    setText('');
  }

  return (
    <section>
      <ul>
        {messages.map(m => (
          <Message key={m.id} ~text={m.text}~ /> // Each message gets a string, the same on every render
        ))}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </section>
  );
}
```

Notice that the identifier counter begins at 4. The three predefined message objects already occupy identifiers 1 through 3. Calculating identifiers from array length fails when items are deleted, because subsequent additions duplicate existing keys. Maintaining a module-level counter guarantees unique keys across all modifications (as seen in Lesson 19).

### What the Console Shows When the User Types and Sends

**While a user types into the input field, only the parent component re-renders. When the user submits a new entry, React renders only the newly appended message.** Here is the full execution sequence:

1. On initial load, React renders the chat room and all three messages for the first time.
2. The user types the letter `O`. Updating local state causes the parent component to re-render, logging that it rendered.
3. The parent JSX returns three message elements holding unchanged text strings.
4. React compares each incoming text string against its previous value using `Object.is`. Because the strings match, React skips executing the message component.
5. The user types the letter `K`, repeating this exact comparison cycle.
6. The user clicks send. The parent re-renders with four messages. The first three messages retain their original text props and are skipped. Only the newly appended message executes.

Here is the Console output on initial page load:

```devconsole caption="The Console when the chat room loads: ChatRoom and each message render once, and StrictMode prints a copy of each line."
ChatRoom rendered
ChatRoom rendered | Strict Mode copy
Message rendered: Hi!
Message rendered: Hi! | Strict Mode copy
Message rendered: Lunch at 12?
Message rendered: Lunch at 12? | Strict Mode copy
Message rendered: Sure
Message rendered: Sure | Strict Mode copy
```

After clearing the Console, typing `OK` and clicking send outputs the following entries:

```devconsole caption="The new lines after the user types OK and clicks Send: two letters render only ChatRoom, and Send renders only the new message."
ChatRoom rendered | letter O
ChatRoom rendered | Strict Mode copy
ChatRoom rendered | letter K
ChatRoom rendered | Strict Mode copy
ChatRoom rendered | Send
ChatRoom rendered | Strict Mode copy
Message rendered: OK
Message rendered: OK | Strict Mode copy
```

```page width=text caption="The chat room after the user types OK and clicks Send: four messages and an empty input field."
line: Hi!
line: Lunch at 12?
line: Sure
line: OK | good
form:
  field:  |
  button: Send
```

Visually, both memoized and unmemoized versions produce identical screens. The existing DOM nodes remain untouched in either case, because React reconciles unchanged JSX trees without modifying the real DOM (as seen in Lesson 54). What `memo` eliminates is the runtime cost of executing the component functions.

### The Real Mistake: memo Is Called, and Its Result Is Thrown Away

A common beginner mistake occurs when a developer wraps a component function in `memo` but continues to export the original function:

```jsx title="src/components/Message.jsx" bad="6,7"
function Message({ text }) {
  console.log('Message rendered:', text);
  return <li>{text}</li>;
}

~memo(Message)~; // **WRONG:** the memoized component is created, then thrown away
export default ~Message~; // **WRONG:** exports the plain function, so every message still renders at every letter
```

The parent component imports the unmemoized function, causing messages to re-render on every keystroke. The developer mistakenly concludes that `memo` is broken. In reality, the enhanced component was discarded upon creation. The official documentation instructs developers to wrap the component and use the returned value in place of the original function.

```jsx title="src/components/Message.jsx" good="6"
function Message({ text }) {
  console.log('Message rendered:', text);
  return <li>{text}</li>;
}

export default ~memo(Message)~; // Exports the memoized component that memo returns
```

### When memo Is Worth Adding

Because `memo` introduces comparison overhead without changing visual output, it provides value only when skipping a component yields a perceptible performance gain:

1. **Target expensive components that re-render frequently with identical props.** The official documentation states that `memo` is beneficial only when a component re-renders often with identical props and contains costly rendering calculations.
2. **Profile before optimizing.** Measure rendering duration using `<Profiler>` under production conditions (as seen in Lesson 54). If user interactions display no detectable lag, adding `memo` adds maintenance overhead without user benefit.
3. **Recognize that memoization is an optimization rather than a guarantee.** React reserves the right to re-render memoized components during internal cache purges.
4. **Ensure components adhere to pure rendering.** A memoized component must always return identical JSX when provided with identical props (as seen in Lesson 14).
5. **Avoid blanket memoization across an entire codebase.** While wrapping components introduces minimal runtime harm, it clutters codebase readability with unnecessary boilerplate.
6. **Rely on the React Compiler in modern setups.** When enabled, the compiler handles memoization automatically at build time, eliminating the need for manual `React.memo` declarations (Lesson 63).

---

## PRINCIPLE | `Object.is` on each prop: the same string passes, a new object never does

> [!PRINCIPLE]
> **Principle 2: Shallow Equality: React Compares Each Prop by Object.is**
>
> *React compares each prop with its old value by `Object.is`: strings, numbers, and booleans by value, and objects, arrays, and functions by identity.*
>
> Two distinct objects containing identical properties are not equal in JavaScript. Constructing an inline object literal on a JSX tag allocates a new object reference during every render of the parent. Consequently, a memoized child component re-renders on every keystroke, defeating optimization. To preserve memoization, pass primitive values, pass existing state objects, or reference module-level constants.
>
> **DO THIS:**
> ```jsx
> <Message key={m.id} ~text={m.text}~ /> // A string equals the old string, so React skips the message
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <Message key={m.id} ~message={{ text: m.text }}~ /> // **WRONG:** a new object on every render, so every message renders again
> ```

### VS | The Same Value vs. the Same Object: a string compares by value, an object by identity

Before re-rendering a memoized component, React tests whether each prop matches its prior value using `Object.is` (as seen in Lesson 37). Consider how `Object.is` evaluates primitive values versus objects:

```js title="Object.is with a number, a string, and two objects"
Object.is(3, 3); // true
Object.is('Hi!', 'Hi!'); // true
Object.is(~{ text: 'Hi!' }, { text: 'Hi!' }~); // false: two different objects with the same field
```

The comparison outcome depends on the category of data being evaluated:
- **Primitives** such as strings, numbers, and booleans compare by value. Two identical string literals always evaluate to equal.
- **Reference types** including objects, arrays, and functions compare by memory address. Two distinct object instances containing identical properties occupy separate locations in memory. In JavaScript terminology, comparing references tests identity rather than content.

This behavior reflects foundational JavaScript principles. Evaluating an object literal always allocates a fresh reference:

```js title="Plain JavaScript: the same fields, two objects"
const a = { text: 'Hi!' };
const b = { text: 'Hi!' };
console.log(~a === b~); // false: a and b are two different objects
console.log(~a === a~); // true: the very same object
```

> [!DEFINITION]
> **Shallow equality.** [NEW] Shallow equality is the comparison strategy React applies to memoized component props. React compares each prop individually using `Object.is`, without inspecting nested object properties. If every top-level prop evaluates to true under `Object.is`, the props are shallowly equal. Because shallow comparison checks only references, primitive values match when their data matches, whereas objects match only when referencing the exact same memory address (Lesson 55).

```tree caption="How Object.is compares a prop with its old value: primitives by value, objects, arrays, and functions by identity."
How React compares one prop with its old value
- +Primitive [`'Hi!'` `3` `true`] | Compared **by value** | `'Hi!'` and `'Hi!'` are **the same**
- !Object, array, or function | Compared **by identity**, never by its fields | Two objects with the same fields are **not the same**
```

### VS | `text={m.text}` vs. `message={{ text: m.text }}` vs. `message={m}`: a string, a new object, and the object from state

Consider three alternative approaches for passing message data to a memoized child component:

```jsx title="Three ways to give a memoized message its text"
<Message ~text={m.text}~ /> {/* 1. A string: the same value on every render */}
<Message ~message={{ text: m.text }}~ /> {/* 2. A new object on every render of ChatRoom */}
<Message ~message={m}~ /> {/* 3. The object from state: the same object until our code replaces it */}
```

Here is how React evaluates incoming props during a parent re-render:
1. **With a primitive string prop**, the child receives a string primitive matching the prior value. React skips executing the component.
2. **With an inline object literal**, JavaScript allocates a new object instance on every render of the parent. React detects a new object reference and re-renders the child.
3. **With an object passed from state**, the child receives the existing object stored in state. Because typing text modifies draft state rather than the messages array, the object reference remains stable, allowing React to skip rendering.

While the first two approaches display identical text on screen, their memory semantics are entirely different. The string literal provides a stable primitive value, whereas the inline object literal allocates a new reference on every pass.

Similarly, while the second and third approaches pass an object with matching content, their references diverge. The inline literal constructs a new instance during each execution, while the state reference points to a persistent object created once.

### What Happens When Message Takes an Object Literal

**Passing an inline object literal produces an identical visual interface while completely breaking memoization.** Suppose a developer rewrites the message component to accept an object prop:

```jsx title="src/components/Message.jsx: an object prop"
const Message = memo(function Message({ ~message~ }) { // The message now takes one object
  console.log('Message rendered:', message.text);
  return <li>{message.text}</li>;
});
```

The parent component then constructs that object inline inside the iteration:

```jsx title="src/components/ChatRoom.jsx: an object prop"
{messages.map(m => (
  <Message key={m.id} ~message={{ text: m.text }}~ /> // **WRONG:** a new object for each message on every render
))}
```

Here is the resulting execution sequence:
1. The application mounts, displaying all messages as expected.
2. The user enters a character into the input field, prompting the parent component to re-render.
3. During rendering, JavaScript evaluates three new object literals.
4. React compares each newly allocated object against the prior object using `Object.is`. Because the memory references differ, React determines that the props have changed.
5. React re-executes all message components, outputting log statements for every item.

```devconsole caption="With an object literal as the message prop, one letter renders ChatRoom and all three messages again."
ChatRoom rendered | letter O
ChatRoom rendered | Strict Mode copy
Message rendered: Hi!
Message rendered: Hi! | Strict Mode copy
Message rendered: Lunch at 12?
Message rendered: Lunch at 12? | Strict Mode copy
Message rendered: Sure
Message rendered: Sure | Strict Mode copy
```

Replacing the inline literal with the state object preserves memoization during typing. The item variable references an existing object in the state array. That reference remains unchanged until state updates produce a replacement array containing new objects (as seen in Lesson 19).

Passing individual primitive values remains the simplest and most resilient architecture. The official React documentation advises developers to pass the minimal necessary information as individual primitive props rather than passing entire objects.

### The Real Mistake: a Style Object on a Memoized Message

A frequent pitfall involves passing inline style configurations to a memoized component:

```jsx title="src/components/ChatRoom.jsx"
<Message key={m.id} text={m.text} ~style={{ color: 'gray' }}~ /> // **WRONG:** a new style object at every letter
```

JavaScript creates a new style object on every execution of the parent component. Because the style prop receives a new reference, every message re-renders on every keystroke. Developers often fail to notice this issue and assume `memo` is ineffective.

To resolve this issue, extract static objects outside the component body. Moving the style declaration to module scope ensures it is allocated once when the file loads:

```jsx title="src/components/ChatRoom.jsx"
const grayText = { color: 'gray' }; // Created once, above the component

<Message key={m.id} text={m.text} ~style={grayText}~ /> // The same object on every render, so memo still skips
```

The same principle applies to JSX elements. React compiles JSX tags into plain JavaScript objects. JSX elements passed as children to a memoized component represent newly instantiated objects on each render, causing child memoization to break unless stabilized.

When an object prop must be derived from changing state, use the `useMemo` Hook to cache the reference between renders (Lesson 56).

### The Second Argument of memo: arePropsEqual

By default, `memo` checks props using shallow equality. You can optionally supply a custom comparison function as a second argument, commonly named `arePropsEqual`:

```jsx title="A custom comparison function as the second argument of memo"
const Message = memo(function Message({ message }) {
  return <li>{message.text}</li>;
}, ~arePropsEqual~); // React calls this function instead of comparing each prop by Object.is

function arePropsEqual(oldProps, newProps) {
  return ~oldProps.message.text === newProps.message.text~; // true: React skips the message
}
```

The custom function must return true if the new props produce identical output, instructing React to skip rendering. The official documentation notes two critical requirements:
1. **Compare all props, including function callbacks.** Function props often close over parent state. If your custom comparison ignores callback props, the child component risks invoking outdated functions that reference stale state.
2. **Avoid deep recursive comparisons.** Traversing arbitrary nested object trees on every render introduces substantial performance penalties that can freeze user interfaces. Always ensure the comparison logic executes faster than the rendering work it avoids.

Passing primitive props directly eliminates the need for custom comparison functions.

---

## PRINCIPLE | `useContext` and `useState`: they still render a memoized component, because `memo` checks props only

> [!PRINCIPLE]
> **Principle 3: memo Checks Props Only: Context and Own State Still Re-render**
>
> *`memo` compares only the props from the parent; a memoized component still re-renders when a context it reads changes or when its own state changes.*
>
> When the user toggles the application theme, React re-renders memoized messages that consume the theme context, even if message text props remain untouched. This re-render is essential: preventing it would leave messages displaying light styling after the user selected dark mode. Memoization intercepts parent-driven prop updates, leaving context and internal state triggers fully active.
>
> **DO THIS:**
> ```jsx
> const Message = memo(function Message({ text }) {
>   const theme = ~useContext(ThemeContext)~; // A new theme renders the message again, as it should
>   return <li className={theme}>{text}</li>;
> });
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <ThemeContext ~value={{ theme, setTheme }}~> {/* **WRONG:** a new object on every render of App re-renders every message that reads it */}
>   <ChatRoom />
> </ThemeContext>
> ```

### memo Checks Props, Not Context

The `memo` wrapper inspects only the props passed by the parent component on the JSX tag. Values consumed via context do not pass through props, and internal component state is managed separately. Consequently, `memo` does not intercept context or state updates, allowing both to trigger re-renders normally.

Here is the memoized message component enhanced to consume a theme context (as seen in Lesson 28):

```jsx title="A memoized message that reads a context"
const Message = memo(function Message({ text }) {
  const theme = ~useContext(ThemeContext)~; // Not a prop: memo never compares it
  console.log('Message rendered:', text);
  return <li className={theme}>{text}</li>;
});
```

When the theme context updates, React re-renders the message component even though its text prop remains unchanged. This behavior is necessary. When a user switches to dark mode, message elements must update their styling to reflect the change. If `memo` blocked context updates, the interface would display stale styling.

Developers frequently misunderstand this behavior, assuming that `memo` stops all re-renders under any circumstance. The official React documentation clarifies that a memoized component re-renders whenever its own state changes or when a context it consumes receives a new value. Memoization pertains strictly to props received from the parent.

Reviewing the three primary causes of re-renders reveals that `memo` addresses only parent-driven prop updates:

```tree caption="The three causes of a re-render: memo blocks the parent cause while the props stay the same, and leaves the other two."
Three causes of a re-render for a memoized `Message`
- +The parent re-renders [`ChatRoom`] | `memo` compares the props | **Skipped** while every prop is the same
- !A context it reads changes [`useContext`] | Not a prop, so `memo` **never sees it** | **Renders again**
- !Its own state changes [`useState`] | Not a prop, so `memo` **never sees it** | **Renders again**
```

### The Theme Comes Back

We reintroduce the theme feature to our chat application (as seen in Lesson 54). The context definition module remains unchanged:

```js title="src/ThemeContext.js"
import { createContext } from 'react';

export const ThemeContext = ~createContext('light')~; // The theme is light when no provider is above
```

The root application component holds theme state, renders the toggle button, and provides the current theme value to the subtree:

```jsx title="src/App.jsx"
import { useState } from 'react';
import { ThemeContext } from './ThemeContext.js';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext ~value={theme}~> {/* Every message below reads this value */}
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle theme</button>
      <ChatRoom />
    </ThemeContext>
  );
}
```

The memoized message component consumes the active theme and applies it as a CSS class on the list item:

```jsx title="src/components/Message.jsx"
import { memo, useContext } from 'react';
import { ThemeContext } from '../ThemeContext.js';

const Message = memo(function Message({ text }) {
  const theme = ~useContext(ThemeContext)~; // React finds the closest provider above and returns its value
  console.log('Message rendered:', text);
  return <li className={theme}>{text}</li>;
});

export default Message;
```

The accompanying stylesheet defines light and dark color schemes:

```css title="src/index.css"
.light {
  background: white;
  color: black;
}

.dark {
  background: #222;
  color: white;
}
```

### What Happens When the User Clicks Toggle theme

**When a user toggles the theme, message props remain untouched, yet React re-renders every message component because the consumed context changed.** Here is the step-by-step sequence:

1. The user clicks the theme toggle button, prompting the root component to update theme state to dark.
2. The root component re-renders and re-renders the unmemoized chat room component, logging that it rendered.
3. The chat room returns message elements holding identical text strings. Evaluated on props alone, `memo` would skip these elements.
4. However, the context provider supplied a new string value, which all message components consume.
5. React re-executes each message component to calculate updated styling, logging three render entries.
6. React commits the updated class names to the DOM, switching messages to the dark theme.

```devconsole caption="One click on Toggle theme renders ChatRoom and all three memoized messages, because each message reads the theme."
ChatRoom rendered | Toggle theme
ChatRoom rendered | Strict Mode copy
Message rendered: Hi!
Message rendered: Hi! | Strict Mode copy
Message rendered: Lunch at 12?
Message rendered: Lunch at 12? | Strict Mode copy
Message rendered: Sure
Message rendered: Sure | Strict Mode copy
```

```dom caption="The Elements panel after one click on Toggle theme: each message now has the dark class."
<ul>
+ <li class="dark">Hi!</li> | note: Rendered again because the theme changed
+ <li class="dark">Lunch at 12?</li>
+ <li class="dark">Sure</li>
</ul>
```

Even if the parent chat room were memoized and skipped, the child messages would still re-render. React delivers fresh context values directly to consumer components regardless of intermediate memoization boundaries. The official documentation confirms that skipping re-renders with `memo` does not prevent children from receiving fresh context updates.

When the user subsequently types into the input field, neither message props nor the context value change. React successfully skips rendering the messages.

Internal component state behaves similarly. If each message component maintained an internal like state, updating that state would re-render the message regardless of memoization.

### The Real Mistake: an Object as the Value of the Provider

A common error arises when passing multiple values through context as an unmemoized object:

```jsx title="src/App.jsx"
<ThemeContext ~value={{ theme, setTheme }}~> {/* **WRONG:** a new object on every render of App */}
```

Whenever the root component re-renders for any reason, JavaScript allocates a new object reference for the context value (as seen in Lesson 54). This triggers Principle 2: a new object reference is never equal under `Object.is`. Every consumer component deep in the tree re-renders on every update, bypassing memoization entirely. The official documentation explains that an inline object creates a new reference on every pass, forcing all consumer components to re-render. Keeping context values stable between renders is addressed in Lesson 59.

---

## PRINCIPLE | `onDelete={() => ...}`: a new function on every render, so `memo` skips nothing

> [!PRINCIPLE]
> **Principle 4: Function Props: A Function Created in the Parent Breaks memo**
>
> *A function written inside the parent, on the tag or in its body, is a new function on every render, so a memoized child that receives it renders every time.*
>
> When a delete button functions properly and the user interface appears correct, developers rarely realize that memoization is broken. Every keystroke re-renders the parent component, which constructs new arrow function instances for each child. React detects changed function props and re-renders every message. To avoid breaking memoization, declare functions outside components when possible, or stabilize them using `useCallback`.
>
> **DO THIS:**
> ```jsx
> function formatTime(date) {
>   return date.toLocaleTimeString();
> }
>
> <Message key={m.id} text={m.text} ~formatTime={formatTime}~ /> // Declared outside ChatRoom: the same function on every render
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <Message key={m.id} text={m.text} ~onDelete={() => handleDelete(m.id)}~ /> // **WRONG:** a new function on every render, so memo skips nothing
> ```

### VS | An Arrow Function on the Tag vs. a Named Function Inside ChatRoom: both are new on every render

As demonstrated earlier, an inline arrow function prop causes child memoization to fail on every render. In JavaScript, functions are first-class objects. Just like an object literal, defining a function inside a component allocates a fresh function instance in memory during every render. This allocation occurs whether the function is written as an inline arrow or declared by name within the component body:

```jsx title="Two ways to give each message its Delete handler"
<Message text={m.text} ~onDelete={() => handleDelete(m.id)}~ /> {/* 1. A new arrow function for each message on every render */}
<Message text={m.text} id={m.id} ~onDelete={handleDelete}~ /> {/* 2. handleDelete is declared inside ChatRoom, so it is new on every render too */}
```

These two examples appear syntactically distinct, leading many developers to believe that a named function declaration remains stable between renders. From the perspective of `memo`, both approaches produce the identical defect. Evaluating either function declaration during component execution instantiates a brand-new function reference in memory. The official React documentation notes that creating a function during parent rendering always instantiates a new reference, even when the function body is identical.

Because `Object.is` compares references rather than function source code, React considers the prop changed and re-renders the child.

### The Delete Button on Each Message

We now add a delete action to each message. The parent component implements a handler that removes an item by identifier (as seen in Lesson 19). It passes this handler down as a callback prop (as seen in Lesson 23):

```jsx title="src/components/ChatRoom.jsx" startLine="21"
  function handleDelete(id) {
    setMessages(messages.filter(m => m.id !== id));
  }

  return (
    <section>
      <ul>
        {messages.map(m => (
          <Message key={m.id} text={m.text} ~onDelete={() => handleDelete(m.id)}~ /> // A new arrow function for each message on every render
        ))}
      </ul>
```

The message component accepts the callback and attaches it to a button element:

```jsx title="src/components/Message.jsx" startLine="4"
const Message = memo(function Message({ text, ~onDelete~ }) { // The function ChatRoom wrote on the tag
  const theme = useContext(ThemeContext);
  console.log('Message rendered:', text);
  return (
    <li className={theme}>
      {text} <button onClick={onDelete}>Delete</button>
    </li>
  );
});
```

How does each inline arrow function identify which message to remove? The function creates a closure, capturing the message identifier variable from the surrounding iteration. When the user clicks the button on the first message, that specific arrow function executes and passes identifier 1 to the handler.

### What Happens on the Next Letter

**The delete button functions correctly and the screen updates as expected, yet every message re-renders on every subsequent keystroke.** Here is the underlying execution flow:

1. The page mounts, rendering each message alongside its delete button.
2. The user clicks delete on the middle message, and React removes it from the list.
3. The user types the letter `O` into the text field, triggering a parent re-render.
4. During parent rendering, the iteration evaluates a fresh arrow function for each remaining message.
5. React compares incoming props for each child. While the text prop remains unchanged, the callback prop references a newly allocated function.
6. Because one prop changed under `Object.is`, React re-executes every message component as if `memo` were absent.

```page width=text caption="The chat room after the user clicks Delete on Lunch at 12? and types O: the message is gone, and the page looks right."
line: [Toggle theme]
line: Hi! [Delete]
line: Sure [Delete]
form:
  field:  | O | good
  button: Send
```

```devconsole caption="One letter after the Delete button was added: ChatRoom and every message render again."
ChatRoom rendered | letter O
ChatRoom rendered | Strict Mode copy
Message rendered: Hi!
Message rendered: Hi! | Strict Mode copy
Message rendered: Sure
Message rendered: Sure | Strict Mode copy
```

On screen, the application behaves smoothly. Only profiling tools or console logs reveal that the memoized children are re-rendering on every keystroke.

### The Real Mistake: the Shortest Way to Pass an Item

Writing an inline arrow callback inside a list iteration represents the most common pattern for passing item identifiers to handlers. The official documentation for the React Compiler highlights this exact scenario, noting that inline arrow callbacks allocate new function instances on every render, consistently breaking child memoization.

The documentation highlights an additional subtlety. Even if the underlying handler function is stabilized using `useCallback`, wrapping it in an unstabilized inline arrow still breaks memoization. Resolving this pattern is covered in Lesson 57.

### How to Keep a Function the Same Between Renders

The official React documentation recommends two primary strategies for maintaining stable function references. Declare functions outside component scope when independent, or use `useCallback` to cache definitions between renders.

1. **Extract static helper functions outside the component.** Functions that do not reference props or state can be declared at module scope, such as a time formatting helper. These functions are created once when the file loads, providing a permanent stable reference.
2. **Stabilize state-dependent handlers with `useCallback`.** Handlers that access local component state must remain within the component body. Stabilizing these functions across renders is the focus of Lesson 57.
3. **Rely on the built-in stability of state setters.** State updater functions returned by `useState` are guaranteed by React to have a stable identity across all re-renders. Passing an updater function directly never breaks `memo`.
4. **Leverage the React Compiler.** The compiler identifies callback patterns and optimizes them automatically, preserving memoization without manual Hook management (Lesson 63).

Our chat application retains the inline arrow function for now. While `memo` is present on the message component, it does not skip execution during typing due to the unstable callback prop. We maintain this implementation intentionally, preparing to resolve callback stability in Lesson 57.

---

## All 4 Principles Together

### The Complete Files

Here is the complete implementation of the chat application. The message component is wrapped in `memo`, accepts string and function props, and consumes the theme context:

```files title="chat-room: File Explorer" caption="The six files of the finished chat room inside src/, next to index.html."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `App` inside `<StrictMode>` and imports `index.css`
  App.jsx | parent | Holds `theme`, renders `Toggle theme` and the provider around `ChatRoom`
  ThemeContext.js | context | Exports `ThemeContext`
  index.css | styles | The `.light` and `.dark` classes
  components/
    ChatRoom.jsx | state | Holds `messages` and `text`, passes `text` and `onDelete` to each message
    Message.jsx | memoized | Exports `memo` around `function Message`
```

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  ~<StrictMode>~ {/* In development, React calls each component twice */}
    <App />
  </StrictMode>
);
```

```js title="src/ThemeContext.js"
import { createContext } from 'react';

export const ThemeContext = createContext('light');
```

```jsx title="src/App.jsx"
import { useState } from 'react';
import { ThemeContext } from './ThemeContext.js';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext ~value={theme}~> {/* Principle 3: a new theme renders every message that reads it */}
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle theme</button>
      <ChatRoom />
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
let nextId = 4;

export default function ChatRoom() {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState('');
  console.log('ChatRoom rendered');

  function handleSend() {
    setMessages([...messages, { id: nextId++, text }]);
    setText('');
  }

  function handleDelete(id) {
    setMessages(messages.filter(m => m.id !== id));
  }

  return (
    <section>
      <ul>
        {messages.map(m => (
          <Message key={m.id} text={m.text} ~onDelete={() => handleDelete(m.id)}~ /> // Principles 2 and 4: text stays the same, onDelete is new on every render
        ))}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </section>
  );
}
```

```jsx title="src/components/Message.jsx"
import { memo, useContext } from 'react';
import { ThemeContext } from '../ThemeContext.js';

const Message = ~memo~(function Message({ text, onDelete }) { // Principle 1: React checks the props before calling Message
  const theme = useContext(ThemeContext);
  console.log('Message rendered:', text);
  return (
    <li className={theme}>
      {text} <button onClick={onDelete}>Delete</button>
    </li>
  );
});

export default Message;
```

```css title="src/index.css"
.light {
  background: white;
  color: black;
}

.dark {
  background: #222;
  color: white;
}
```

### How React Calls the Components

On initial application mount, rendering begins at the root component, proceeds through the chat room inside the provider, and renders each message sequentially from top to bottom:

```tree caption="The component tree of the chat room and the order in which React calls each component when the page loads."
`App` [1. Holds `theme`] | Renders the `Toggle theme` button and the provider around `ChatRoom`
- +`ChatRoom` [2. Logs `ChatRoom rendered`] | Holds `messages` and `text` | Renders one `<Message>` per message
  - +`Message` for `Hi!` [3. Logs `Message rendered: Hi!`] | Memoized | Reads `theme` from the context
  - +`Message` for `Lunch at 12?` [4. Logs `Message rendered: Lunch at 12?`] | Memoized | Reads `theme` from the context
  - +`Message` for `Sure` [5. Logs `Message rendered: Sure`] | Memoized | Reads `theme` from the context
```

### Which Messages Render After Each Action of the User

**Because the delete callback prop receives a fresh arrow function on every pass, user interactions currently re-render all message components.** The rightmost column indicates how the components will behave once function stability is introduced in Lesson 57:

| What the user does | `ChatRoom` | The messages, with the arrow function in `onDelete` | The messages, if `onDelete` stayed the same function |
| :--- | :--- | :--- | :--- |
| Types a letter in the field | Renders, because `text` changed | Every message renders, because `onDelete` is new | Every message is skipped |
| Clicks `Send` | Renders, because `messages` and `text` changed | Every message renders, the new one included | Only the new message renders |
| Clicks `Toggle theme` | Renders, because its parent `App` rendered | Every message renders | Every message renders, because the theme changed |
| Clicks `Delete` on one message | Renders, because `messages` changed | Every remaining message renders | Every remaining message is skipped |

Here is the central doctrine of this lesson summarized:

| Aspect | The Common Habit | The React Rule |
| :--- | :--- | :--- |
| **Wrapping** | Call `memo` and keep using the plain function | Use the memoized component that `memo` returns |
| **Comparing props** | Expect React to compare what is inside an object | React compares each prop by `Object.is`: primitives by value, objects by identity |
| **Objects on the tag** | Write `{{ }}` on the tag of a memoized child | Pass a string, the object from state, or a constant created outside the component |
| **Context and own state** | Expect a memoized component never to re-render | A context it reads and its own state still re-render it |
| **Functions on the tag** | Write an arrow function on each memoized message | A function created during the render is new each time, so keep it the same or leave `memo` out |
| **When to use it** | Wrap every component just in case | Measure first; wrap a child that renders often, with the same props, and slowly |

Remember the defining rule: `memo` skips component execution only while every prop matches its previous value under `Object.is`. Newly allocated objects or functions never equal past values.

---

## For the Interview

> **The Interview Question:** When should you wrap a component in React.memo, and when does it fail to skip re-renders?

### How to Answer Clearly in 30 Seconds

"`memo` is a higher-order component that returns a memoized component. When its parent re-renders, React shallowly compares incoming props against previous props using `Object.is`, skipping component execution if all props match. Primitive strings and numbers compare by value, whereas objects, arrays, and functions compare by reference. I apply `memo` only when profiling reveals a slow component that re-renders frequently with identical props. Memoization fails to skip re-renders under three conditions:
1. **Unstable prop references**: when the parent passes inline object literals, newly allocated arrays, or inline arrow functions such as `onDelete={() => handleDelete(m.id)}`.
2. **Context changes**: `memo` checks incoming props only, so updates to consumed context values bypass it entirely.
3. **Internal state updates**: changes to a component's own state always trigger a re-render."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"What comparison mechanism does `memo` use by default?"**
   React performs a shallow comparison across all props using `Object.is`. It never inspects nested object properties or array elements. Consequently, passing an inline object literal creates a new reference during parent rendering, which fails shallow equality. State objects remain equal across renders until updated. Developers can supply a custom comparison function as a second argument, called `arePropsEqual`. This custom function must compare all props, including function callbacks, and must avoid expensive recursive traversals that could degrade performance.
2. **"Why does a memoized component continue to re-render on every keystroke?"**
   The most common reason is an unstable prop reference created during parent rendering, such as an inline arrow callback `onClick={() => handleClick(item)}` or an inline style object. Because a single changed prop triggers a re-render, one unstable reference invalidates memoization. Remedies include passing primitive values, declaring static objects and functions outside the component, or stabilizing values with `useMemo` and `useCallback`. Consumed context updates and internal component state changes also cause re-renders by design.
3. **"Should you wrap every component in `memo` proactively?"**
   No. Memoization adds comparison overhead and clutters code without guaranteeing performance gains. If an application requires `memo` to function correctly, its underlying state logic contains a flaw. Developers should measure rendering durations with Profiler in production builds, applying `memo` only where profiling demonstrates meaningful gains. In modern toolchains, the React Compiler handles memoization automatically at build time, eliminating the need for manual wrappers.

```tree dir=right caption="Interview summary: when memo skips a re-render and when it cannot."
A memoized component when its parent re-renders
- +Every prop is the same by `Object.is` [`text={m.text}`] | React **skips** the component
- !One prop is an object or function created in the parent [`message={{ text: m.text }}`] | React **renders it again**, as if `memo` were not there
- !A context it reads or its own state changes [`useContext` `useState`] | `memo` **never sees it**, so React **renders it again**
```
