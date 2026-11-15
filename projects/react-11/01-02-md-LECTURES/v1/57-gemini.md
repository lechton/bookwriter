# Lecture 57: What useCallback Caches, and When You Actually Need It

*(Why does a row wrapped in memo still render on every keystroke, and when does useCallback fix it?)*

> INTERVIEW QUESTION | ❱❱ MORE | What does useCallback do, and when do you actually need it?

---

## VS | A Plain `handleDelete` vs. `handleDelete` in `useCallback`: the same code, but only one stays the same function

> In JavaScript, two functions with identical source code are separate object instances in memory. Every time a component re-renders, JavaScript recreates every function declared inside its body. **A child component wrapped in `memo` receives a brand-new function reference on every keystroke, causing it to re-render even when its displayed data never changed**. Wrap that function in `useCallback`, and React preserves the identical function instance between renders until a dependency changes. This stability allows memoized children to skip redundant rendering.

In Lesson 55, wrapping a list item component in `memo` allowed React to skip re-rendering when incoming props remained unchanged. While that optimization succeeds with primitive values such as strings or numbers, passing a callback function such as `onDelete` causes the optimization to fail. The breakdown occurs because of how JavaScript handles function identity and reference equality.

In JavaScript, functions are objects stored in heap memory. When the JavaScript engine evaluates a function declaration or arrow expression, it allocates a distinct object instance. Even when two functions share identical code character for character, they occupy different memory addresses:

```js title="Two functions with the same code"
const a = () => console.log('Hi');
const b = () => console.log('Hi');

console.log(~a === b~); // false: the same code, but two different functions
console.log(~a === a~); // true: the very same function
```

When a component re-renders, React executes the entire component function from top to bottom. Every function declared directly inside the component body is instantiated anew on each render pass. The parent might pass this newly created function as a prop to a child wrapped in `memo`. When comparing the previous prop with the incoming prop, React evaluates them using `Object.is`. Because `Object.is` compares object references, testing two distinct function instances returns false. The `memo` wrapper detects a changed prop reference and immediately re-renders the child component.

To prevent these unnecessary re-renders, React must maintain a stable reference to the callback function across render cycles. The `useCallback` Hook provides this capability: **`useCallback` caches a function definition between renders and returns the identical function instance until one of its declared dependencies changes**. As in Lessons 55 and 56, understanding performance optimization requires understanding how JavaScript and React evaluate reference equality.

> [!DEFINITION]
> **memo.** [REVIEW] `memo` is a higher-order component provided by React that wraps a component to memoize its rendered output. When the parent component re-renders, React performs a shallow comparison of all incoming props against their previous values using `Object.is`. If every prop reference matches, React skips executing the component function and reuses the previous rendered output. Passing a freshly instantiated callback function on every render counts as a prop change and forces the child to re-render (Lesson 55).

> [!DEFINITION]
> **StrictMode calls every component twice.** [REVIEW] In development mode, mounting an application inside StrictMode causes React to invoke every component function and render calculation twice. This deliberate double invocation exposes unintentional side effects and ensures rendering purity. Production builds execute component functions and Hook initializations only once (Lesson 47).

### The Smallest Chat with useCallback

Here is the smallest chat example demonstrating the problem: one message with a Delete button, and an input field to type a reply. `Message` is wrapped in `memo` and logs a message to the console each time React executes it:

```jsx title="A memoized Message and a plain handleDelete"
const Message = memo(function Message({ id, text, onDelete }) {
  console.log('Message rendered:', text);
  return (
    <li>
      {text} <button onClick={() => onDelete(id)}>Delete</button>
    </li>
  );
});

function ChatRoom() {
  const [messages, setMessages] = useState([{ id: 1, text: 'Hi!' }]);
  const [text, setText] = useState('');

  function ~handleDelete~(id) { // A brand-new function every time ChatRoom runs
    setMessages(messages.filter(m => m.id !== id));
  }

  return (
    <>
      <ul>
        {messages.map(m => (
          <Message key={m.id} id={m.id} text={m.text} onDelete={handleDelete} />
        ))}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
    </>
  );
}
```

When the application first mounts in the browser, the console displays two log entries. This output reflects development StrictMode invoking the `Message` component function twice:

```page width=text caption="The smallest chat when the page opens: one message with a Delete button, an empty field, and two lines in the Console."
line: Hi! [Delete]
form:
  field:  |
log: Message rendered: Hi!
log: Message rendered: Hi!
```

After clearing the console, the user types the letters `OK` into the text input:

```page width=text caption="The same chat after the user types OK: the message renders again on every keystroke, though its text never changed."
line: Hi! [Delete]
form:
  field:  | OK
log: Message rendered: Hi!
log: Message rendered: Hi!
log: Message rendered: Hi!
log: Message rendered: Hi!
```

**Even though `Message` is wrapped in `memo`, the component re-renders twice on every single keystroke.** The message text never changed, yet the console logged two renders for `O` and two renders for `K`. Here is the sequence of events at runtime:
1. The user types `O`. The input's `onChange` event fires, calling `setText('O')`. This schedules a state update for `ChatRoom`.
2. React re-renders `ChatRoom`, executing its function body from top to bottom. During this execution, JavaScript re-evaluates the `function handleDelete` declaration, allocating a new function instance in memory.
3. React renders the JSX list and passes the new `handleDelete` function as the `onDelete` prop to the Message component.
4. The `memo` higher-order component compares incoming props with previous props using `Object.is`. The id and text props match, but `onDelete` points to a new function reference.
5. Because the reference check fails, `memo` cannot skip the render. React executes `Message` again, printing the log lines.

To solve this problem, wrap `handleDelete` in the `useCallback` Hook provided by React. The Hook accepts two arguments: the callback function to cache, and a dependency array listing every reactive value read inside that function:

```jsx title="The same handleDelete, wrapped in useCallback"
const handleDelete = ~useCallback~((id) => { // The same function on every render until messages changes
  setMessages(messages.filter(m => m.id !== id));
}, [messages]);
```

After clearing the console again, the user types `OK` into the input:

```page width=text caption="The chat with useCallback after the user types OK: the Console stays empty, because the message skips both keystrokes."
line: Hi! [Delete]
form:
  field:  | OK
quiet: No new lines after the user types OK
```

The console remains completely empty. Because typing updates only the `text` state variable, the `messages` array remains identical. React returns the cached `handleDelete` function instance from memory. The `memo` wrapper compares all props using `Object.is`. Because all props match their previous values, React skips executing `Message`.

Both implementations share the exact same logic and delete messages correctly when clicked. The critical distinction lies in the memory reference of the callback passed to `Message`:
- **The plain `handleDelete` declaration** creates a new function instance on every render pass of `ChatRoom`, causing `memo` to detect a changed prop and re-render the child.
- **The `handleDelete` wrapped in `useCallback`** preserves the identical function instance across renders as long as `messages` remains unchanged, allowing `memo` to confirm that all props match and skip re-rendering.

```tree caption="The plain handleDelete and the handleDelete from useCallback hold the same code, but only one stays the same function after a keystroke."
Two ways to write `handleDelete` for a memoized `Message`
- !A plain function [`function handleDelete`] | `ChatRoom` creates a **new function** on every render | `memo` sees a **changed `onDelete`** and **renders `Message` again**
- +Wrapped in `useCallback` [`useCallback`] | React hands back the **same function** while `messages` stays the same | `memo` sees **the same props** and **skips `Message`**
```

### Why It Is Called useCallback

A callback is a function passed as an argument to another component or routine, intended to be executed at a later time in response to an event. In this chat component, the `onDelete` prop is a callback: `ChatRoom` passes it to the message row, which invokes it when the user clicks Delete. The `useCallback` Hook gets its name because its primary purpose is to cache these callback function instances between re-renders, giving them stable reference identities. React's documentation describes its role directly: it lets you cache a function definition between re-renders.

### What the User Feels

Redundant re-renders directly degrade user experience during continuous interactions like typing. In an application displaying hundreds of list items or rows with heavy layout computations, re-executing every row component on every single keystroke occupies the main JavaScript thread. This thread contention introduces noticeable input latency, causing typed characters to lag behind physical keystrokes. When `useCallback` preserves callback references and child components are memoized, child renders are skipped entirely. The main thread remains unblocked, and input fields respond instantaneously.

### The Rule of Thumb: ask who compares the function

**The `useCallback` Hook provides value only when another piece of code compares the incoming function reference against its previous value: either a child component wrapped in `memo`, or the dependency array of an Effect or another Hook.** In any other context, generating a new function instance in JavaScript is virtually instantaneous and has zero effect on performance.

Software teams frequently encounter four common mistakes when working with `useCallback`:
1. **Wrapping every event handler indiscriminately**, including functions passed directly to native HTML elements like `<button>`. This increases code complexity without providing any performance benefit.
2. **Writing an inline arrow function on the child component tag**, such as `onDelete={() => handleDelete(m.id)}`. This creates a brand-new wrapper function on every render, immediately defeating memoization.
3. **Assuming `useCallback` stops JavaScript from defining the function.** JavaScript still evaluates the arrow function inside the component body on every render pass; React merely chooses whether to store it or return the previously cached instance.
4. **Omitting reactive variables from the dependency array** in an attempt to keep the reference stable. This produces a stale closure, causing the function to operate on obsolete data.

When a memoized child component accepts a callback prop from its parent, consider five architectural approaches:
1. **Leave the function plain and measure performance first** using the React DevTools Profiler (as covered in Lesson 54). If interactions feel fast and frame rates remain smooth, optimization is unnecessary.
2. **Declare the function outside the component** if it does not read any props, state, or component-scoped variables. Because it is declared in module scope, its reference never changes.
3. **Wrap the function in `useCallback` and the child in `memo`** when the callback depends on component state or props and is passed to an expensive child component.
4. **Restructure component composition** by lifting content or passing components via the `children` prop, which isolates state updates and eliminates the need for manual memoization (as covered in Lesson 58).
5. **Use the React Compiler**, which automatically analyzes dependencies and memoizes functions and components at build time (as covered in Lesson 63).

```tree caption="Five ways to handle a function passed to a memoized child."
A memoized child receives a function from its parent
- +1. Leave it and measure [`<Profiler>`] | Fits when the user feels **no lag** | Lesson 54
- +2. Declare it outside the component | Fits a function that **uses nothing** from the component | It **never changes**
- +3. `useCallback` with `memo` [`useCallback`] | Fits a function that needs **props or state** | This lesson
- +4. Pass `children` or move state lower | Much memoization becomes **unnecessary** | Lesson 58
- +5. React Compiler | Memoizes functions **at build time** | Lesson 63
```

## SECTION | The Chat Room with a Delete Button on Each Message

In this section, we expand the chat application to manage a list of messages, an input field, and a Send button. We deliberately exclude the theme toggle from Lesson 55, because a theme change independently re-renders every item and would introduce a confounding variable into our console logs. The interface displays three messages, Hi!, Lunch at 12?, and Sure, each paired with a dedicated Delete button:

```page width=text caption="Our chat room when the page opens: three messages with a Delete button each, an empty field, and a Send button."
line: Hi! [Delete]
line: Lunch at 12? [Delete]
line: Sure [Delete]
form:
  field:  |
  button: Send
```

The user can type into the input field, click Send to append a message, or click Delete to remove an existing row. `ChatRoom` tracks two state variables: the current `messages` array and the draft text string. Console log statements inside `ChatRoom` and each `Message` row allow us to observe exactly which components re-render during each user interaction.

```files title="chat-room: File Explorer" caption="How the files of our chat room sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and renders `<ChatRoom />`
  components/
    ChatRoom.jsx | state | Holds `messages` and `text`, and passes `handleDelete` to every `Message`
    Message.jsx | memo | Exports `Message` wrapped in `memo`; its Delete button calls `onDelete` with its `id`
```

**PRINCIPLES:** The `useCallback` Hook performs one dedicated task: caching a function definition between renders and returning the same function instance until its dependencies change. This behavior leads to four core principles:
1. **Principle 1: useCallback Returns the Same Function Instance Until a Dependency Changes.** On initial render, React caches the function without calling it. On subsequent renders, React returns the cached function instance as long as every listed dependency matches by `Object.is`, allowing memoized children to skip re-rendering.
2. **Principle 2: An Inline Arrow Function on the JSX Tag Defeats useCallback.** Defining an inline function directly on the child tag allocates a brand-new function instance on every render pass, even if it merely forwards arguments to a cached handler. Always pass the cached function directly, and provide necessary identifiers such as `id` as separate props.
3. **Principle 3: List Every Value the Function Reads, or Stop Reading It.** Omitting dependencies traps stale variables inside the callback closure. If the callback reads state solely to compute the next state value, use a state updater function to remove that state variable from the dependency array entirely.
4. **Principle 4: Use useCallback Only Where React Compares the Function Reference.** Wrapping callbacks passed to native DOM elements such as `<button>` or unmemoized components provides no performance benefit and introduces unnecessary code overhead.

---

## PRINCIPLE | `useCallback`: React hands back the same function until a dependency changes

> [!PRINCIPLE]
> **Principle 1: useCallback: React Hands Back the Same Function Until a Dependency Changes**
>
> *Wrap a callback passed to a memoized child component in `useCallback` so React preserves the identical function instance between renders as long as its dependencies remain unchanged.*
>
> Every parent re-render recreates unmemoized functions, presenting child components with changed prop references and triggering child re-renders. `useCallback` caches the function instance created during the initial render and returns that same instance on later renders when dependencies match by `Object.is`. The memoized child receives an identical reference and skips re-rendering. Note that `useCallback` never executes the function during render, nor does it prevent JavaScript from evaluating the inline expression.
>
> **DO THIS:**
> ```jsx
> const handleDelete = ~useCallback~((id) => { // The same function while messages stays the same
>   setMessages(messages.filter(m => m.id !== id));
> }, [messages]);
>
> <Message id={m.id} text={m.text} onDelete={handleDelete} />
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ~handleDelete~(id) { // **WRONG:** a new function on every render, so the memoized Message renders on every keystroke
>   setMessages(messages.filter(m => m.id !== id));
> }
>
> <Message id={m.id} text={m.text} onDelete={handleDelete} />
> ```

### The Two Arguments of useCallback

A `useCallback` call accepts two arguments and returns a single cached function instance:

```jsx title="The two things we hand to useCallback"
const handleDelete = useCallback(~(id) => {~ // 1. Our function: React may hand it back later
  setMessages(messages.filter(m => m.id !== id));
}, ~[messages]~); // 2. The dependency list: every value our function reads
```

1. **The function definition** passed as the first argument. React stores this function reference internally on the component Fiber node. React does not execute this function during rendering; it executes only when invoked by an event handler or consumer.
2. **The dependency array** passed as the second argument. It lists every reactive value from component scope read by the function, such as props and state variables. During subsequent renders, React compares each item against its previous value using `Object.is`.

### What useCallback Returns on Each Render

1. **On initial render**, React stores the initial function instance along with its dependency values in the Hook state cell and returns that function instance.
2. **On every subsequent render**, JavaScript re-evaluates the arrow function expression in the component body. React then inspects the dependency array:
   - If every dependency matches its previous value by `Object.is`, React discards the newly created function instance and returns the cached function instance.
   - If any dependency has changed, React stores the new function instance along with the new dependency values and returns the new instance.

```tree dir=right caption="What useCallback hands back on the first render and on every render after it."
What `useCallback` returns
- +1. First render | React **stores our function** with its dependency list | Returns it **without calling it**
- +2. Later render, the same dependencies | JavaScript creates a new function, and **React ignores it** | Returns the **stored function**
- !3. Later render, a changed dependency | React keeps the **function of this render** | Returns that **new function** and stores it
```

Developers are often surprised to learn that `useCallback` does not prevent the creation of new functions in JavaScript. Because the component function runs from top to bottom on each render, JavaScript inevitably executes the arrow function syntax and allocates a new function object. The role of `useCallback` is to decide whether React keeps that newly allocated object or discards it in favor of the previously cached reference. As the React documentation states, React ignores the new function and returns the cached function if nothing changed.

> [!DEFINITION]
> **useCallback and the cached function.** [NEW] `useCallback(fn, dependencies)` is a built-in React Hook that persists a function reference across renders. During the initial mount, React stores `fn` and its dependencies on the component Fiber node and returns `fn` without invoking it. On subsequent renders, React compares each dependency using `Object.is`. When all dependencies match, React returns the cached function instance, allowing memoized children to skip rendering. If any dependency changes, React updates its cache with the newly created function and returns it (Lesson 57).

### Why Message Skips a Keystroke

**After a keystroke, React skips executing `Message` because every prop it receives is identical by reference to the previous render.** Here is the runtime sequence when the user types `O`:
1. Typing the character calls setText, which schedules a re-render of `ChatRoom`.
2. During execution, `useCallback` returns the cached `handleDelete` instance because messages did not change.
3. React inspects the dependencies of `useCallback`. Because `messages` has not changed, `Object.is` confirms the array reference is identical. React returns the cached `handleDelete` function reference.
4. The `memo` wrapper compares incoming props for each row: id, text, and `onDelete`. All three match their previous references.
5. React skips calling `Message`, avoiding all child rendering work and leaving the console quiet.

The Delete button functionality remains fully intact. When the user clicks Delete on the first row, the component invokes `onDelete(1)`, which triggers `setMessages` and removes the item.

### VS | `useCallback(fn)` vs. `useMemo(() => fn)`: the exact same cached function

In Lesson 56, `useMemo` cached the return value of a calculation. Because functions in JavaScript are first-class values, `useMemo` can also cache a function if the calculation returns one:

```jsx title="useCallback with our function"
const handleDelete = ~useCallback~((id) => { // Caches the function we pass, without calling it
  setMessages(messages.filter(m => m.id !== id));
}, [messages]);
```

```jsx title="useMemo whose calculation returns our function"
const handleDelete = ~useMemo~(() => (id) => { // Calls the outer arrow and caches the function it returns
  setMessages(messages.filter(m => m.id !== id));
}, [messages]);
```

These two implementations produce identical runtime behavior. `useMemo` executes its outer function during render and caches the returned value, which in this case is the inner callback. `useCallback` eliminates the outer factory function, accepting the callback directly and storing it without invocation. Under the hood, React implements `useCallback(fn, deps)` as syntactic sugar for `useMemo(() => fn, deps)`. As the React documentation notes, the sole purpose of `useCallback` is to eliminate the boilerplate of writing an extra nested wrapper function.

```tree caption="useCallback, and useMemo with a function inside, give the same cached function."
Two ways to cache `handleDelete`
- +`useCallback` with our function [`useCallback`] | Caches **the function we pass** | Hands back the **same `handleDelete`** while `messages` stays the same
- +`useMemo` with an arrow that returns our function [`useMemo`] | Caches **the result of calling the outer arrow**, which is our function | **Exact same result**, with one extra arrow to write
```

### useCallback in Our Chat Room

Now let us examine how the code is organized into separate files within the project. The `Message` component resides in its own module:

```jsx title="src/components/Message.jsx"
import { memo } from 'react';

const Message = ~memo~(function Message({ id, text, onDelete }) { // Skips the render when id, text, and onDelete are the same
  console.log('Message rendered:', text);
  return (
    <li>
      {text} <button onClick={() => onDelete(id)}>Delete</button>
    </li>
  );
});

export default Message;
```

The `ChatRoom` component manages the list of messages, the input field, and the Send button:

```jsx title="src/components/ChatRoom.jsx"
import { useCallback, useState } from 'react';
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

  const handleDelete = ~useCallback~((id) => { // The same function on every render while messages stays the same
    setMessages(messages.filter(m => m.id !== id));
  }, [messages]);

  function handleSend() {
    setMessages([...messages, { id: nextId++, text }]);
    setText('');
  }

  return (
    <section>
      <ul>
        {messages.map(m => (
          <Message key={m.id} id={m.id} text={m.text} ~onDelete={handleDelete}~ /> // Every row gets the one cached function
        ))}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </section>
  );
}
```

After clearing the console, the user types `OK` into the text field:

```page width=text caption="Our chat room after the user types OK: only ChatRoom renders, and the three messages skip both keystrokes."
line: Hi! [Delete]
line: Lunch at 12? [Delete]
line: Sure [Delete]
form:
  field:  | OK
  button: Send
log: ChatRoom rendered
log: ChatRoom rendered
log: ChatRoom rendered
log: ChatRoom rendered
```

`ChatRoom` renders twice for each typed character because of development StrictMode. Not a single `Message` row re-renders. If `handleDelete` had remained a plain unmemoized function, those two keystrokes would have printed twelve log lines: three rows multiplied by two letters, doubled by StrictMode.

### The Real Mistake: useCallback Without memo

**Wrapping a function in `useCallback` without wrapping the receiving child component in `memo` achieves zero render savings.**
Consider what happens when wrapping the delete handler in `useCallback` while leaving `Message` as a plain component:
1. The user types a character, and `ChatRoom` re-renders.
2. `useCallback` returns the cached function instance as expected.
3. React evaluates the JSX and encounters `<Message />`. By default in React, whenever a parent component renders, all child components render unconditionally, regardless of whether their props changed (as seen in Lesson 54).
4. Because `Message` lacks a `memo` wrapper, React never compares its props. The child component executes on every keystroke.
For `useCallback` to prevent child re-renders, the receiving component must actively check its incoming props via `memo`.

### The Cache Is Only a Speed-Up

`useCallback` is strictly a performance optimization, not a semantic guarantee that a function instance will never be discarded. React may purge its internal Hook cache under certain conditions. This occurs during Hot Module Replacement in development or when a component suspends while waiting for asynchronous data (covered in Lesson 69). Code must remain functionally correct even if React recalculates the callback on every render. If an application relies on a stable reference for fundamental application logic rather than performance, use a ref or state variable instead (as seen in Lesson 30).

---

## PRINCIPLE | `onDelete={() => handleDelete(m.id)}`: a new arrow function on every render undoes `useCallback`

> [!PRINCIPLE]
> **Principle 2: Pass the Cached Function Itself: an Arrow Function on the Tag Is New on Every Render**
>
> *Pass the stable function from `useCallback` directly to the memoized child, and supply any required item identifiers as separate props.*
>
> A prop receives whatever expression is written after the equals sign in JSX. Writing an inline arrow function there creates a new function instance on every render pass, even if that arrow function merely invokes a cached callback. The `memo` wrapper detects a changed prop reference and re-renders the child. Passing the cached function directly preserves prop stability, allowing the child component to invoke it with its own prop data.
>
> **DO THIS:**
> ```jsx
> <Message key={m.id} id={m.id} text={m.text} ~onDelete={handleDelete}~ /> {/* The same cached function on every render */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <Message key={m.id} text={m.text} ~onDelete={() => handleDelete(m.id)}~ /> {/* **WRONG:** a new arrow function on every render, so every row renders again */}
> ```

### VS | An Arrow Function on the Tag vs. the Cached Function on the Tag: both delete the right message, only one stays the same

In Lesson 55, `Message` did not receive an `id` prop. Instead, each list item tag declared an inline arrow function that passed `m.id` directly to `handleDelete`. Compare the two approaches, assuming `handleDelete` is wrapped in `useCallback` in both cases:

```jsx title="An arrow function on the tag vs. the cached function on the tag"
<Message key={m.id} text={m.text} ~onDelete={() => handleDelete(m.id)}~ /> {/* A new arrow function on every render */}
<Message key={m.id} id={m.id} text={m.text} ~onDelete={handleDelete}~ /> {/* The one cached function, the same on every render */}
```

Both patterns trigger message deletion correctly when clicked. However, the value assigned to the `onDelete` prop differs fundamentally:
- The first tag assigns an inline arrow function created dynamically during the current render pass. Although it delegates to `handleDelete`, the prop itself is a newly allocated function object.
- The second tag assigns `handleDelete` directly, passing the identical cached function reference across all renders.

### Why Every Row Still Renders

**When an inline arrow function is written on the child tag, every list row re-renders on every keystroke, completely nullifying the benefit of `useCallback`.** Here is the step-by-step breakdown when the user types `O`:
1. Typing the character schedules a re-render of `ChatRoom`.
2. As the parent component executes, `useCallback` returns the stable delete handler because `messages` did not change.
3. The `messages.map` loop iterates to construct the JSX tree. In doing so, JavaScript evaluates the inline arrow `() => handleDelete(m.id)`, allocating a new function instance for each list item.
4. React passes this new arrow function as the `onDelete` prop to `<Message />`.
5. The `memo` wrapper compares previous props against next props with `Object.is`. Because the inline arrow function reference is brand new, `Object.is` returns false.
6. `memo` fails to skip rendering, and React executes `Message` for every item in the list.

```page width=text caption="With an arrow function on the tag, the user types O and all three messages render again."
line: Hi! [Delete]
line: Lunch at 12? [Delete]
line: Sure [Delete]
form:
  field:  | O
  button: Send
log: ChatRoom rendered
log: ChatRoom rendered
log: Message rendered: Hi!
log: Message rendered: Hi!
log: Message rendered: Lunch at 12?
log: Message rendered: Lunch at 12?
log: Message rendered: Sure
log: Message rendered: Sure
```

The resulting console output is identical to having no `useCallback` at all. As the React documentation warns, wrapping a function in `useCallback` while passing an inline wrapper like `() => handleClick(item)` is a subtle mistake that completely breaks memoization.

### Where the id Goes Instead

How does the inline arrow function access `m.id`? It captures `m` from the surrounding lexical scope created by `map`.

> [!DEFINITION]
> **A closure.** [NEW] A closure is a fundamental JavaScript mechanism where an inner function retains access to variables declared in its outer enclosing scope, even after that outer function has finished executing. In `messages.map(m => <Message onDelete={() => handleDelete(m.id)} />)`, each inline arrow function closes over the specific `m` variable from that iteration. Closures are a standard JavaScript feature, not a React-specific API (Lesson 57).

To eliminate the inline arrow on the tag, pass `id` as an independent prop: `<Message id={m.id} onDelete={handleDelete} />`. Inside `Message`, the button click handler invokes `onDelete(id)`:

```jsx title="src/components/Message.jsx" startLine="7"
      {text} <button onClick={~() => onDelete(id)~}>Delete</button> {/* An arrow function on a plain button: nothing compares it */}
```

Notice that an inline arrow function still exists inside `Message` on the native `<button>`. This inline function is recreated on every render of `Message`, but it causes no performance degradation. The `<button>` element is a built-in DOM element rather than a memoized React component; React attaches the event listener directly without performing prop memoization checks.

### Why Not Call useCallback for Each Row Inside map?

Developers encountering this issue sometimes consider calling `useCallback` inside the `map` loop to cache a unique function for each item. That approach violates the Rules of Hooks. Hooks must be called only at the top level of a component, never inside loops, conditions, or nested functions (as seen in Lesson 38). Calling Hooks conditionally or dynamically alters Hook call order, corrupting React internal fiber state. The recommended design pattern is to extract the row into its own memoized component and supply item identifiers through props. The React Compiler also handles this scenario automatically at build time (as covered in Lesson 63).

```tree caption="An arrow function on the Message tag vs. the cached function with the id as its own prop."
Two ways to pass `handleDelete` to each `Message`
- !An arrow function written on the tag | A **new arrow function** on every render of `ChatRoom` | `memo` sees a **changed `onDelete`**, and **every row renders**
- +The cached function and the `id` [`onDelete={handleDelete}` `id={m.id}`] | Every row gets **the one cached function** | `Message` calls `onDelete` with its own `id`, and **the rows skip the keystroke**
```

---

## PRINCIPLE | Dependencies of `useCallback`: list every value the function reads, or stop reading it

> [!PRINCIPLE]
> **Principle 3: Dependencies: List Every Value the Function Reads, or Stop Reading It**
>
> *Declare every reactive value read by the function in its dependency array; when a function reads state solely to compute the next state, pass an updater function to the state setter and remove that state from the dependencies.*
>
> The dependency array specifies when React must recreate the cached function. Omitting dependencies while continuing to read them causes the function to capture outdated scope variables, leading to stale closure bugs where the interface displays corrupted or revived state. To maintain a stable function reference safely, rewrite the logic so the function no longer accesses the reactive value directly, as updater functions do for state variables.
>
> **DO THIS:**
> ```jsx
> const handleDelete = useCallback((id) => {
>   setMessages(~ms => ms.filter(m => m.id !== id)~); // Reads the latest list, so the empty list tells the truth
> }, []);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const handleDelete = useCallback((id) => {
>   setMessages(messages.filter(m => m.id !== id));
> }, ~[]~); // **WRONG:** keeps the first render's messages, so a deleted message comes back
> ```

### Three Dependency Lists for handleDelete

The dependency array indicates which variables the callback reads from component scope. When any listed value changes, React produces a fresh function instance. Developers write `handleDelete` in three distinct ways:

```jsx title="1. With messages in the dependency list"
const handleDelete = useCallback((id) => {
  setMessages(messages.filter(m => m.id !== id));
}, ~[messages]~); // A new handleDelete after every change of messages
```

```jsx title="2. With an empty list, still reading messages"
const handleDelete = useCallback((id) => {
  setMessages(messages.filter(m => m.id !== id));
}, ~[]~); // **WRONG:** the same function forever, holding the messages of the first render
```

```jsx title="3. With an empty list and an updater function"
const handleDelete = useCallback((id) => {
  setMessages(~ms => ms.filter(m => m.id !== id)~); // Reads the latest list from React, not messages
}, []);
```

Here is how the three approaches behave:
1. **With `messages` in the dependency list**, `handleDelete` is functionally correct. However, React generates a new function instance whenever `messages` updates, such as when deleting or sending a message.
2. **With an empty list while continuing to read `messages`**, `handleDelete` remains stable forever. However, it permanently holds the initial messages array, causing deleted items to reappear.
3. **With an empty list and an updater function**, `handleDelete` remains stable across all renders and always operates on the most recent state provided by React.

### With messages in the List, Every Row Renders After Each Delete

**When `messages` is included in the dependency array, every remaining list item re-renders after every deletion.**
Suppose the user clicks Delete on `Hi!`. Calling `setMessages` updates the state with a new array reference. When `ChatRoom` re-renders, `useCallback` detects that the list array changed and creates a new function instance. Consequently, Lunch at 12? and Sure receive a changed `onDelete` prop, forcing both rows to re-render:

```page width=text caption="With messages in the list, the user clicks Delete on Hi! and both remaining messages render again."
line: Lunch at 12? [Delete]
line: Sure [Delete]
form:
  field:  |
  button: Send
log: ChatRoom rendered
log: ChatRoom rendered
log: Message rendered: Lunch at 12?
log: Message rendered: Lunch at 12?
log: Message rendered: Sure
log: Message rendered: Sure
```

The same re-render cascade happens whenever a user clicks Send. In large lists, adding or removing a single item causes every existing row in the list to re-render.

### With an Empty List, a Deleted Message Comes Back

Attempting to keep `handleDelete` stable by removing `messages` from the dependency array triggers an ESLint warning:

> React Hook useCallback has a missing dependency: 'messages'. Either include it or remove the dependency array.

The linter suggests providing an updater function to `setMessages`. If a developer ignores this warning, the application encounters a critical state bug.

**With an empty dependency array, `handleDelete` permanently closes over the initial render's state, causing previously deleted messages to resurrect on subsequent deletions.** Here is the runtime sequence:
1. On the initial render, `useCallback` caches `handleDelete`. The function closes over the initial messages array: Hi!, Lunch at 12?, and Sure (as covered in Lesson 15).
2. The user deletes `Hi!`. The callback filters Hi! out of that initial array, updating state to Lunch at 12? and Sure.
3. When `ChatRoom` re-renders, the empty dependency array instructs React to return the cached `handleDelete` function from render 1. That function still references the original three-item array in its closure.
4. Next, the user clicks Delete on `Sure`. The callback executes again, filtering Sure out of its closed-over initial array containing Hi!, Lunch at 12?, and Sure.
5. Because that initial array still contains Hi!, the filter returns Hi! and Lunch at 12?. The deleted message Hi! reappears on screen.

```page width=text caption="With an empty list, still reading messages: the page after the user deletes Hi!."
line: Lunch at 12? [Delete]
line: Sure [Delete]
form:
  field:  |
  button: Send
```

```page width=text caption="The same page after the user then deletes Sure: Hi! comes back."
line: Hi! [Delete] | bad
line: Lunch at 12? [Delete]
form:
  field:  |
  button: Send
```

The application corrupted user data without throwing any console errors or warnings. Only the code linter flagged the problem.

> [!DEFINITION]
> **A stale closure.** [NEW] A stale closure is a function instance that captures and retains variable references from an earlier render pass. Because the Hook dependency array failed to declare those reactive variables, React never refreshed the function reference, leaving the callback to operate on outdated state or props. As the React documentation explains, stale closures produce subtle bugs where components read obsolete data without producing runtime errors (Lesson 57).

Omitting the dependency array entirely is a separate mistake: calling `useCallback(fn)` without a second argument creates a new function on every render, providing zero caching.

### An Updater Function Takes messages Out of the List

The proper architectural solution is to stop reading the `messages` state variable inside `handleDelete`. Instead, pass an updater function to `setMessages` (as covered in Lesson 16). React calls the updater function with the current pending state as its argument, which we name `ms`, and uses the returned value as the next state.

Because the callback no longer accesses messages in its lexical scope, `messages` is no longer a dependency. The state setter function returned by `useState` has a guaranteed stable identity across the component lifecycle, so it does not need to be listed either. The empty dependency array truthfully reflects the function's inputs:

```jsx title="src/components/ChatRoom.jsx" startLine="16"
  const handleDelete = useCallback((id) => {
    setMessages(~ms => ms.filter(m => m.id !== id)~); // React passes the latest list as ms
  }, []);
```

Now, when the user deletes Hi! and then Sure, only Lunch at 12? remains. No log lines appear for the surviving row because its `onDelete` prop never changed. If the user then types `OK` and clicks Send, only the newly created row renders:

```page width=text caption="With the updater function, the user clicks Send with OK: only the new message renders."
line: Lunch at 12? [Delete]
line: OK [Delete]
form:
  field:  |
  button: Send
log: ChatRoom rendered
log: ChatRoom rendered
log: Message rendered: OK
log: Message rendered: OK
```

Only the new item renders, while `Lunch at 12?` skips re-rendering. As the React documentation advises, memoized functions should maintain as few dependencies as possible.

```tree caption="Three dependency lists for handleDelete and what the user sees with each."
Three ways to write the dependency list of `handleDelete`
- !With `messages` in the list [`[messages]`] | **Correct**, but a **new function** after every Delete and Send | **Every remaining row renders** after each change
- !An empty list, still reading `messages` [`messages.filter`] | The **same function forever**, holding the **first render's list** | A **deleted message comes back**: a stale closure
- +An empty list and an updater function [`ms => ms.filter`] | The **same function forever**, reading the **latest list** from React | **Only the new row renders** after Send
```

---

## PRINCIPLE | `useCallback` on a plain `<button>`: nothing compares the function, so nothing gets faster

> [!PRINCIPLE]
> **Principle 4: Two Real Cases: Use useCallback Only Where React Compares the Function**
>
> *Apply `useCallback` only when passing a function as a prop to a component wrapped in `memo`, or when supplying a function to the dependency array of an Effect or another Hook; keep all other handlers as plain functions.*
>
> The sole purpose of `useCallback` is to maintain a stable reference identity between renders. That reference identity only matters if another piece of code checks it using `Object.is`. Handlers attached to native DOM elements such as `<button>` or unmemoized components are never checked, meaning `useCallback` provides zero performance gain while adding maintenance overhead and potential stale closure risks.
>
> **DO THIS:**
> ```jsx
> function ~handleSend~() { // A plain function: the button compares nothing
>   setMessages([...messages, { id: nextId++, text }]);
>   setText('');
> }
>
> <button onClick={handleSend}>Send</button>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const handleSend = ~useCallback~(() => { // **WRONG:** nothing compares onClick on a button, so this gains nothing
>   setMessages([...messages, { id: nextId++, text }]);
>   setText('');
> }, [messages, text]);
>
> <button onClick={handleSend}>Send</button>
> ```

### VS | A Plain `handleSend` vs. `handleSend` in `useCallback`: the exact same page, with more code

In our chat application, the delete handler benefited from `useCallback` because the message component is wrapped in `memo`. Now consider `handleSend`, which connects to a standard HTML `<button>`:

```jsx title="A plain handleSend on the Send button"
function ~handleSend~() { // A new function on every render
  setMessages([...messages, { id: nextId++, text }]);
  setText('');
}

<button onClick={handleSend}>Send</button>
```

```jsx title="A handleSend from useCallback on the Send button"
const handleSend = ~useCallback~(() => { // The same function while messages and text stay the same
  setMessages([...messages, { id: nextId++, text }]);
  setText('');
}, [messages, text]);

<button onClick={handleSend}>Send</button>
```

Both versions result in identical runtime performance and behavior. When clicked, the message appends to the list and the input clears. Why does `useCallback` provide zero benefit here?
1. The `<button>` is a native HTML element, not a memoized React component. React updates DOM event listeners directly without comparing prop references to skip work.
2. The `handleSend` function reads `text`, which updates on every keystroke. Because `text` is in the dependency array, `useCallback` returns a new function instance on every single keystroke anyway.

### The Two Places Where useCallback Matters

The React documentation identifies exactly two legitimate scenarios where caching a function reference is beneficial:
1. **Passing the function as a prop to a component wrapped in `memo`**, as shown with `onDelete`.
2. **Passing the function as a dependency to another Hook**, such as a `useEffect` hook that invokes the callback.

For all other handlers, wrapping them in `useCallback` provides no performance advantage. As the official React documentation notes, while wrapping functions causes no catastrophic harm, it clutters code, degrades readability, and increases dependency management overhead.

Consider the second case: an Effect connecting to a chat room that specifies `createOptions` in its dependency array:

```jsx title="A function used as a dependency of an Effect, from the React docs"
const createOptions = ~useCallback~(() => { // The same function while roomId stays the same
  return { serverUrl: 'https://localhost:1234', roomId: roomId };
}, [roomId]);

useEffect(() => {
  const options = createOptions();
  const connection = createConnection(options);
  connection.connect();
  return () => connection.disconnect();
}, ~[createOptions]~); // Runs again only when createOptions changes
```

Without `useCallback`, `createOptions` would be recreated as a new function instance on every render pass. The `useEffect` hook would detect a changed dependency after every render, repeatedly disconnecting and reconnecting to the server (as covered in Lesson 35). While `useCallback` resolves this issue, the documentation suggests an even cleaner solution. Declaring `createOptions` directly inside the Effect removes the function dependency entirely (as covered in Lesson 37).

```tree caption="Where useCallback helps: only where React compares the function with the one from the last render."
Where a cached function makes a difference
- +A prop of a component wrapped in `memo` [`onDelete={handleDelete}`] | `memo` **compares** the prop by `Object.is` | The same function lets the child **skip its render**
- +A dependency of an Effect or another Hook [`createOptions`] | React **compares** the dependency list | The same function stops the Effect from **running after every render**
- !A plain HTML element, or a child without `memo` [`<button onClick={handleSend}>`] | **Nothing compares** the function | **No gain**, and one more dependency list to keep correct
```

### The Real Mistake: Wrapping Every Handler

Routinely wrapping every event handler in `useCallback` is a common anti-pattern in React development:
1. Developers read that `useCallback` optimizes rendering performance.
2. They wrap form submit handlers, button click listeners, and input change handlers across the entire application in `useCallback`.
3. Every wrapped handler introduces a dependency array that must be actively maintained. Over time, missing dependencies lead to stale closure bugs.
4. Rendering performance remains unchanged because neither native DOM elements nor unmemoized components check function references.

Before wrapping any function in `useCallback`, always check if another component or Hook compares that function reference. If nothing compares it, declare it as a plain function. When an interface feels slow, measure rendering bottlenecks with the React Profiler in a production build before introducing memoization (as covered in Lesson 54).

### Where Else You Meet useCallback

Three additional contexts frequently appear in architecture reviews and technical interviews:
1. **Custom Hooks that return functions.** React recommends wrapping functions returned by custom Hooks in `useCallback`. This allows consumers to include them safely in their own Hook dependency arrays (as covered in Lesson 39).
2. **Context values containing functions.** When passing functions through Context, wrap them in `useCallback` and the outer object in `useMemo`. This prevents unnecessary consumer re-renders (as covered in Lesson 59).
3. **The React Compiler.** Modern React tooling automates memoization at build time. When using the React Compiler, manual `useCallback` invocations are reserved for specialized scenarios requiring explicit reference control (as covered in Lesson 63).

---

## All 4 Principles Together

### The Complete Files

Review the complete implementation of the chat application. The delete handler uses `useCallback` with an updater function, the send handler remains plain, and each message row is wrapped in `memo`:

```files title="chat-room: File Explorer" caption="The four files of the finished chat room inside src/ and src/components/, next to index.html."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and renders `<ChatRoom />`
  components/
    ChatRoom.jsx | state | Holds `messages` and `text`; caches `handleDelete` with `useCallback`; keeps `handleSend` plain
    Message.jsx | memo | Exports `Message` wrapped in `memo`; its Delete button calls `onDelete` with its `id`
```

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  ~<StrictMode>~ {/* In development, React calls each component twice */}
    <App />
  </StrictMode>
);
```

```jsx title="src/App.jsx"
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  return <ChatRoom />;
}
```

```jsx title="src/components/Message.jsx"
import { memo } from 'react';

const Message = ~memo~(function Message({ id, text, onDelete }) { // Skips the render when id, text, and onDelete are the same
  console.log('Message rendered:', text);
  return (
    <li>
      {text} <button onClick={() => onDelete(id)}>Delete</button>
    </li>
  );
});

export default Message;
```

```jsx title="src/components/ChatRoom.jsx"
import { useCallback, useState } from 'react';
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

  const handleDelete = ~useCallback~((id) => { // Principles 1 and 3: one cached function for the life of ChatRoom
    setMessages(ms => ms.filter(m => m.id !== id));
  }, []);

  function ~handleSend~() { // Principle 4: a plain function on a plain button
    setMessages([...messages, { id: nextId++, text }]);
    setText('');
  }

  return (
    <section>
      <ul>
        {messages.map(m => (
          <Message key={m.id} id={m.id} text={m.text} ~onDelete={handleDelete}~ /> // Principle 2: the cached function itself
        ))}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </section>
  );
}
```

### How React Calls the Components

On initial mount, React executes `App`, then `ChatRoom`, and finally each message row from top to bottom. In development, StrictMode invokes each component twice:

```tree caption="The component tree of the chat room and the order in which React calls each component when the page opens."
`App` [1. Called first] | Returns `<ChatRoom />`
- +`ChatRoom` [2. Logs `ChatRoom rendered`] | Holds `messages` and `text` | **Runs again after every keystroke** and every click
  - +`Message` for `Hi!` [3. Logs `Message rendered: Hi!`] | Receives the **cached `handleDelete`** | **Skips** every keystroke
  - +`Message` for `Lunch at 12?` [4. Logs `Message rendered: Lunch at 12?`] | Receives the **cached `handleDelete`** | **Skips** every keystroke
  - +`Message` for `Sure` [5. Logs `Message rendered: Sure`] | Receives the **cached `handleDelete`** | **Skips** every keystroke
```

Following the initial mount, a keystroke in the input field updates `text` and triggers a re-render of `ChatRoom` only. After clearing the console, the user types `OK`:

```page width=text caption="The finished chat room after the user types OK: only ChatRoom renders."
line: Hi! [Delete]
line: Lunch at 12? [Delete]
line: Sure [Delete]
form:
  field:  | OK
  button: Send
log: ChatRoom rendered
log: ChatRoom rendered
log: ChatRoom rendered
log: ChatRoom rendered
```

### What Runs After Each Action of the User

In Lesson 55, without callback memoization, every user action forced every row in the list to re-render. Here is the rendering profile of the same application when using a memoized callback:

| What the user does | `ChatRoom` | The rows, with the arrow function in `onDelete` | The rows, with the cached `handleDelete` |
| :--- | :--- | :--- | :--- |
| **Types a letter in the field** | Renders, because `text` changed | Every row renders, because `onDelete` is new | Every row is skipped |
| **Clicks `Send`** | Renders, because `messages` and `text` changed | Every row renders, the new one included | Only the new row renders |
| **Clicks `Delete` on one row** | Renders, because `messages` changed | Every remaining row renders | Every remaining row is skipped |

Here is the entire lesson summarized across four core architectural dimensions:

| Aspect | The Habit That Breaks It | The React Rule |
| :--- | :--- | :--- |
| **The function prop** | A plain `handleDelete`, new on every render, so the memoized row renders on every keystroke | Wrap it in `useCallback`, so the row receives the same function |
| **The tag** | `onDelete={() => handleDelete(m.id)}`, a new arrow function on every render | `onDelete={handleDelete}` and `id={m.id}`, so the row calls `onDelete(id)` itself |
| **The dependency list** | Remove `messages` from the list while still reading it, so a deleted message comes back | Use `ms => ms.filter(...)`, so the empty list tells the truth |
| **Where to use it** | Wrap every handler, also the ones on a plain `<button>` | Use it only for a prop of a `memo` child, or a dependency of an Effect or another Hook |

**The `useCallback` Hook preserves a function instance across renders until declared dependencies change. It provides value only when another component or Hook compares that reference: either a child wrapped in `memo` or a Hook dependency list.**

---

## For the Interview

> **The Interview Question:** What does useCallback do, and when do you actually need it?

### How to Answer Clearly in 30 Seconds

"`useCallback` caches a function definition between renders, preserving its reference identity until declared dependencies change. On initial render, React stores the function and returns it without execution. On subsequent renders, React checks dependencies using `Object.is`: if all match, it returns the cached instance; if any changed, it stores and returns the new instance. It does not prevent JavaScript from evaluating function expressions during render; React simply decides which instance to return. It is necessary in two primary scenarios:
1. **Passing a callback as a prop to a child component wrapped in `memo`**, ensuring the child can skip re-rendering. The cached function must be passed directly rather than wrapped in an inline arrow on the tag.
2. **Passing a callback as a dependency to another Hook**, such as `useEffect` or a custom Hook, to prevent unintended re-executions.

Everywhere else, including handlers on native HTML elements like `<button>`, wrapping functions provides no performance benefit and clutters code. Finally, always declare all read values in the dependency array or use state updaters to prevent stale closures."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"What is the difference between `useCallback` and `useMemo`?"**
   `useMemo` invokes its calculation function during render and caches the returned result. `useCallback` caches the function definition itself without invoking it. Writing `useCallback(fn, deps)` is functionally identical to writing `useMemo(() => fn, deps)`. React implements `useCallback` as a convenience API so developers can avoid writing an extra nested wrapper function.
2. **"I wrapped my handler in `useCallback`, and the memoized list items still render on every keystroke. Why?"**
   Three common issues cause this breakdown. First, the child component might not actually be wrapped in `memo`, meaning it re-renders unconditionally whenever its parent renders. Second, the JSX tag might contain an inline arrow function wrapping the handler, such as `onClick={() => handleClick(item)}`, which generates a new function reference on every render. Third, a listed dependency might be changing on every render, such as an object or array recreated in the parent body.
3. **"Can you rely on `useCallback` to keep a function the same forever?"**
   No. `useCallback` is strictly a performance optimization, not a semantic guarantee. React may invalidate its Hook cache during Fast Refresh in development or when concurrent rendering suspends while loading asynchronous data. If application correctness depends on maintaining a mutable reference that never resets or triggers re-renders, use a ref created with `useRef` instead.

```tree dir=right caption="Interview summary: when useCallback helps and when it gains nothing."
When is `useCallback` worth adding?
- +A prop of a `memo` child [`onDelete={handleDelete}`] | The child receives the **same function** | `memo` **can skip** the child
- +A dependency of an Effect or another Hook [`createOptions`] | The dependency list sees **the same function** | The Effect **does not run again** after every render
- !A handler on a plain `<button>` [`handleSend`] | **Nothing compares** it | **No gain**, and the code is **harder to read**
- !An arrow function on the tag around the cached function [`onDelete`] | A **new function** on every render | `memo` **never skips**
```
