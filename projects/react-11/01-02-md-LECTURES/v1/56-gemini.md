# Lecture 56: What useMemo Caches, and When It Is Wasted Work

*(How do you make React keep the result of a slow calculation between renders, and when does that only add code?)*

> INTERVIEW QUESTION | ❱❱ MORE | What does useMemo cache, and when is it wasted work?

---

## VS | A Filter in the Body vs. the Same Filter in `useMemo`: the plain line runs on every render, the `useMemo` line reuses the last result

> React executes the entire component body on every re-render. A filter over thousands of messages recalculates on every keystroke, even in a field unrelated to search. **Wrap the calculation in `useMemo`, and React caches the result between renders.** React returns the stored value as long as its dependencies remain unchanged. This optimization pays off only for measured slow calculations or props passed to memoized children. Wrapping lightweight calculations merely adds boilerplate without performance gains.

In Lesson 55, you saw what happens when a user types a letter into the chat. The setter updates local state, prompting React to call the chat room component function again. React cannot selectively execute individual statements inside a component function. It re-executes the entire body from top to bottom on every render (as seen in Lesson 13). For lightweight calculations, re-executing those lines takes almost no time.

Now picture a chat room holding 5,000 messages, featuring a search input at the top and a message input at the bottom. The statement filtering those messages sits directly in the component body. Whenever the user types a reply into the message input, JavaScript filters all 5,000 messages from scratch. The search text did not change, so the resulting array is identical. You need a way to tell React: keep the result of this filter and recompute it only when the messages array or search query actually changes.

This preservation is exactly what `useMemo` provides. **React caches the return value and reuses it as long as every dependency matches its previous value**. A dependency is any reactive value read by the calculation, such as state or props. In this chat room, the dependencies are the messages array and the search text. Just like in Lesson 55, this entire lesson centers on what JavaScript and React consider identical.

> [!DEFINITION]
> **A re-render.** [REVIEW] A re-render occurs when React calls a component function again to compute fresh JSX. It happens for three reasons: local state updates, parent re-renders, or context value changes. Every statement directly in the component body runs again on each re-render. React executes the JavaScript function and updates only the real DOM elements that changed (Lesson 54).

> [!DEFINITION]
> **Object.is.** [REVIEW] `Object.is(a, b)` is the JavaScript comparison method React uses to test whether two values are identical. For primitive values like strings and numbers, it compares their values directly. For objects, arrays, and functions, it checks reference identity: two distinct arrays holding identical items return false because they occupy different locations in memory (Lesson 37).

> [!DEFINITION]
> **memo.** [REVIEW] `memo` is a higher-order component provided by React. It wraps a component to skip re-rendering when incoming props match previous props. When the parent re-renders, React compares each prop using `Object.is`. If all props match, React reuses the previous rendered output. Passing a freshly created array on every render counts as a prop change and prevents skipping (Lesson 55).

> [!DEFINITION]
> **StrictMode calls every component twice.** [REVIEW] In development mode, mounting an application inside StrictMode causes React to invoke every component function and render calculation twice. This intentional double invocation helps detect unintended side effects and impure calculations. Production builds execute component functions and Hook calculations only once (Lesson 47).

### The Smallest Chat with useMemo

Here is the smallest chat example demonstrating the problem: a search field, three messages, and a message drafting input. A helper function named `filterMessages` keeps only messages matching the search query. It logs a message to the console on every execution so you can track run counts. In this initial version, the filter call sits directly in the body of `ChatRoom`:

```jsx title="A chat that filters its messages in the component body"
import { useState } from 'react';

const initialMessages = [
  { id: 1, text: 'Hi!' },
  { id: 2, text: 'Lunch at 12?' },
  { id: 3, text: 'Sure' },
];

function filterMessages(messages, query) {
  console.log('Filtering messages for:', query);
  return messages.filter(m => m.text.toLowerCase().includes(query.toLowerCase()));
}

function ChatRoom() {
  const [messages] = useState(initialMessages);
  const [query, setQuery] = useState('');
  const [text, setText] = useState('');

  const visibleMessages = ~filterMessages(messages, query)~; // Runs on every render of ChatRoom

  return (
    <>
      <label>Search messages <input value={query} onChange={e => setQuery(e.target.value)} /></label>
      <ul>
        {visibleMessages.map(m => <li key={m.id}>{m.text}</li>)}
      </ul>
      <label>Message <input value={text} onChange={e => setText(e.target.value)} /></label>
    </>
  );
}
```

When the page opens, the console displays two lines. That output reflects StrictMode executing `ChatRoom` twice in development:

```page width=text caption="The smallest chat when the page opens: three messages, two empty fields, and two lines in the Console."
form:
  field: Search messages |
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field: Message |
log: Filtering messages for:
log: Filtering messages for:
```

Now the user types 'OK' into the message input. The search query remains empty, and the displayed message list does not change. Yet each keystroke appends two more lines to the console:

```page width=text caption="After the user types OK in the Message field: the same list, and two more Console lines for each letter."
form:
  field: Search messages |
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field: Message | OK | good
log: Filtering messages for:
log: Filtering messages for:
log: Filtering messages for:
log: Filtering messages for:
log: Filtering messages for:
log: Filtering messages for:
```

**React filtered the identical three messages against the same empty query on every single keystroke.** Why did this happen? Each character invokes the text state updater, triggering a re-render of the chat room component. Because the filter call sits directly in the component body, JavaScript executes it on every pass. The plain function call provides no instructions telling React to reuse the previous array.

To resolve this inefficiency, wrap the calculation in `useMemo`. You supply two arguments: a pure calculation function wrapped in an arrow function, and an array of dependencies read by that calculation:

```jsx title="The same filter inside useMemo"
const visibleMessages = ~useMemo~( // Reuses the last result while messages and query stay the same
  () => filterMessages(messages, query),
  [messages, query]
);
```

Reload the page and type 'OK' into the message input again. This time, the console contains only the initial lines logged during page mount:

```page width=text caption="With useMemo, after the user types OK in the Message field: the Console still holds only the two lines from the page load."
form:
  field: Search messages |
line: Hi!
line: Lunch at 12?
line: Sure
form:
  field: Message | OK | good
log: Filtering messages for:
log: Filtering messages for:
```

Next, the user types 'l' into the search input. Because the search query changed, the filter executes, and the view updates to show only the matching message:

```page width=text caption="With useMemo, after the user types l in the Search messages field: one message left, and two new Console lines."
form:
  field: Search messages | l | good
line: Lunch at 12?
form:
  field: Message | OK
log: Filtering messages for:
log: Filtering messages for:
log: Filtering messages for: l
log: Filtering messages for: l
```

Both implementations display identical items on the screen. **The visual outcome is identical, but the runtime behavior is completely different.** The unmemoized code filters the array on every render pass. By contrast, the memoized version executes the calculation only when the messages array or search query changes. On every other render, React bypasses the filter function and returns the cached array directly.

```tree caption="A plain line runs its calculation on every render; a useMemo line reuses the stored result until a dependency changes."
What happens to the filter when `ChatRoom` re-renders
- !Written directly in the body [`filterMessages`] | Runs on **every render** of `ChatRoom` | A letter in the `Message` field **filters again**
- +Inside `useMemo` [`useMemo`] | Runs only when **`messages` or `query` changed** | A letter in the `Message` field **reuses the stored array**
```

### Why It Is Called useMemo

You encountered this terminology in Lesson 55. The term `memo` derives from **memoization**, which describes caching function outputs. A cache stores the most recent calculation result and reuses it while input arguments remain unchanged. As official documentation explains, caching return values this way is called memoization, giving the `useMemo` Hook its name. Like all built-in React Hooks, its identifier begins with the prefix `use`.

In standard JavaScript without React, you would implement this caching mechanism manually. You maintain variables for previous inputs and outputs, verifying equality before recalculating:

```js title="Plain JavaScript: a cache for the filter, written by hand"
let lastMessages = null;
let lastQuery = null;
let lastResult = null;

function cachedFilter(messages, query) {
  if (~Object.is(messages, lastMessages) && Object.is(query, lastQuery)~) return lastResult; // The same inputs as last time: reuse the old result
  lastMessages = messages;
  lastQuery = query;
  lastResult = filterMessages(messages, query);
  return lastResult;
}
```

The `useMemo` Hook automates this caching pattern inside the component lifecycle. The dependency list takes the place of manual input tracking variables. The return value delivers the cached calculation output. React maintains an isolated cache record for each component instance in the tree, exactly as it isolates state per component instance (as seen in Lesson 12).

These two optimization tools serve distinct purposes. The `memo` utility caches rendered component output across renders. The `useMemo` Hook caches the return value of an individual calculation inside a component.

> [!DEFINITION]
> **useMemo.** [NEW] `useMemo` is a built-in React Hook that caches the result of a calculation between re-renders:
> 1. You pass a pure calculation function and a dependency array: `const visibleMessages = useMemo(() => filterMessages(messages, query), [messages, query])`.
> 2. On initial mount, React invokes the calculation function and stores the returned result on the internal Hook fiber.
> 3. On subsequent re-renders, React compares each dependency against its previous value using `Object.is`.
>
> If all dependencies match, React returns the cached value and skips the calculation entirely. If any dependency changes, React re-executes the calculation function and stores the fresh result (Lesson 56).

### What the User Feels

In real production applications, users experience this behavior as typing latency. A chat application might maintain thousands of messages in memory, filtering them in real time as someone composes a reply. When an expensive filter runs on every keystroke, characters appear sluggishly in the input. The official React documentation notes that running unneeded calculations during text entry makes typing feel unresponsive.

1. **Wrapping an expensive filter in `useMemo`** ensures typing in the message input skips the calculation entirely. React re-executes the filter only when search text changes or when new messages arrive.
2. **Wrapping an inexpensive calculation in `useMemo`**, such as checking whether the message string is non-empty, yields zero noticeable improvement. The official documentation confirms there is no benefit to memoizing cheap calculations. It only produces longer, less maintainable code.

### The Rule of Thumb: measure first, and keep every dependency the same

**React reuses the cached calculation as long as every dependency remains identical. Apply memoization only when performance profiling reveals a slow operation, and ensure dependencies maintain stable references.**

Experienced developers guard against four common pitfalls:
1. **Memoizing every calculation indiscriminately without profiling.** When calculations take negligible time, users notice no speed difference while code complexity increases.
2. **Assuming memoization accelerates initial page loads.** It does not. React documentation emphasizes that `useMemo` cannot speed up the initial mount, because initial rendering must calculate the result first.
3. **Treating memoization as a semantic requirement.** React may discard cached values under certain conditions. The documentation states that code must remain functionally correct without memoization.
4. **Supplying dependencies created freshly on every render.** Passing unstable object or array literals causes dependency comparisons to fail constantly, defeating the cache entirely.

When a calculation inside a component appears sluggish, evaluate four standard solutions:
1. **Perform the calculation directly during rendering without caching.** This approach remains the standard default (as seen in Lessons 22 and 34). Official guidelines emphasize that unmemoized code is usually completely sufficient.
2. **Cache the result using `useMemo`.** This choice suits expensive calculations whose reactive dependencies change infrequently. This lesson explores this pattern in depth.
3. **Move state lower down the tree or lift content into children.** Restructuring component trees prevents expensive subtrees from re-rendering in the first place (as seen in Lesson 58).
4. **Enable React Compiler.** The automated compiler memoizes computations at build time, removing the need for manual memoization in most components (as seen in Lesson 63).

```tree caption="Four ways developers handle a calculation that seems slow inside a component."
A calculation in a component seems slow
- +1. Calculate during rendering | The default, and **usually fine** | Lessons 22 and 34
- +2. Cache it with `useMemo` | Fits a calculation that is **noticeably slow** and whose dependencies **rarely change** | This lesson
- +3. Move state lower or pass `children` | The slow part **does not re-render at all** | Lesson 58
- +4. React Compiler | Memoizes calculations **at build time** | Lesson 63
```

## SECTION | The Chat Room with a Search Field

Why use a chat room for this study? A chat interface demonstrates two contrasting user inputs: one that alters the filtered dataset, the search field, and one that does not, the reply drafting input. This contrast represents the classic scenario where developers reach for memoization. Building upon the chat interface from Lesson 55, this lesson adds live search capabilities. The completed interface consists of four primary elements:

1. A search field positioned at the top of the interface.
2. The message list displaying an active history of 5,000 items. The first three items read 'Hi!', 'Lunch at 12?', and 'Sure'. The remaining items read 'Message 4' through 'Message 5000'.
3. A draft input located at the bottom of the view.
4. A send button, disabled while the draft input contains no text.

```page width=text caption="The finished chat room when the page opens, with the middle of the long history left out: the search field, the messages, the message field, and a greyed-out Send."
form:
  field: Search messages |
line: Hi!
line: Lunch at 12?
line: Sure
empty: 4,996 more messages
line: Message 5000
form:
  field: Message |
  button: Send | | disabled
```

The user interacts with the search input, enters replies into the text field, and submits messages. Three pieces of state manage this interface inside the chat room: the message history, the search query, and the draft message.

The project structure contains five files within the source directory:

```files title="chat-room: File Explorer" caption="How the files of our chat room sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `App` inside `<StrictMode>`
  App.jsx | parent | Renders `ChatRoom`
  messages.js | helpers | Exports `createMessages` and `filterMessages`
  components/
    ChatRoom.jsx | state | Holds `messages`, `query`, and `text`, and filters the history with `useMemo`
    MessageList.jsx | memoized list | Exports the memoized `MessageList`, one `<li>` per message
```

How can you verify that React skipped the calculation? You use the diagnostic logging pattern recommended in official React guides: adding a logging statement inside the filter function. The helper function logs the search term whenever it executes. When that log output is absent, React skipped the filter function entirely. In development mode with StrictMode active, log lines appear in pairs.

**CORE PRINCIPLES:** React reuses cached calculations as long as dependencies evaluate to identical values. Memoization is not an arbitrary performance toggle. Four guiding principles govern its use:
1. **Principle 1: useMemo Skips the Filter While the User Types a Message.** React executes the calculation on mount and stores the result. Subsequent renders reuse the cached value when dependencies match, re-executing only when a dependency changes.
2. **Principle 2: Measure First with console.time.** Apply `useMemo` only after performance profiling demonstrates a measurable bottleneck. Wrapping lightweight operations yields no benefits and complicates maintenance. Memoization never accelerates the initial render.
3. **Principle 3: useMemo Gives the Memoized MessageList the Same Array.** Calling array filtering methods produces a new array instance on every invocation, causing memoized children to re-render. Caching the array preserves reference identity so child components can skip rendering.
4. **Principle 4: An Object Made in the Body Breaks the Cache.** Instantiating objects directly inside a component body allocates new references on every render pass. Create helper objects inside the calculation function to preserve cache stability.

---

## PRINCIPLE | `useMemo`: the calculation runs again only when a dependency changes

> [!PRINCIPLE]
> **Principle 1: useMemo: React Reuses the Stored Result Until a Dependency Changes**
>
> *Write `useMemo(calculateValue, dependencies)` to cache the result of a calculation between re-renders; React calls the calculation on the first render, and again only when a dependency changed by `Object.is`.*
>
> React runs the whole body of a component on every re-render, so a calculation written directly in the body runs every time, even when its inputs did not change. `useMemo` stores the result. On the next render, React compares each dependency with its old value. When all of them are the same, React hands back the stored result and skips the calculation.
>
> **DO THIS:**
> ```jsx
> const visibleMessages = useMemo(
>   () => filterMessages(messages, query),
>   ~[messages, query]~ // A letter in the Message field reuses the stored array
> );
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const visibleMessages = ~useMemo~(() => filterMessages(messages, query)); // **WRONG:** no dependency list, so the filter runs on every render
> ```

### VS | A Line in the Body vs. the Same Line in `useMemo`: one runs every time, one only when its inputs change

Here are the two implementation styles placed side by side:

```jsx title="The filter written directly, and the same filter inside useMemo"
const visibleMessages = filterMessages(messages, query); // Runs on every render of ChatRoom
const visibleMessages = ~useMemo~(() => filterMessages(messages, query), [messages, query]); // Runs only when messages or query changed
```

Developers new to React often assume that if search input has not changed, the filter will not run. But React does not inspect which variables an unmemoized line reads. It executes every line inside the component function on every re-render. As official guides explain, React re-executes the entire component body on each render pass. Only the memoized statement instructs React to reuse the previous calculation output.

### The Three Parts of a useMemo Line

A call to `useMemo` accepts two arguments and returns a cached value:

```jsx title="The three parts of a useMemo line"
const visibleMessages = useMemo(
  ~() => filterMessages(messages, query)~, // 1. The calculation function: React calls it, not our code
  ~[messages, query]~ // 2. The dependencies: every value the calculation reads
);
```

1. **The calculation function** is the first argument passed to the Hook. Official documentation states this function must be pure, take no arguments, and return a value of any type. Your code provides the definition, while React controls its execution timing.
2. **The dependency array** forms the second argument. Official guidelines describe dependencies as every reactive value referenced inside the calculation function. Because this calculation reads the message list and query string, both values must be declared in the array. On every render pass, React compares each entry against its prior value using `Object.is`. This matches the dependency comparison mechanics used by Effects (as seen in Lesson 35). Always declare dependency arrays inline, keeping array length constant across renders.
3. **The cached return value** represents the computed output assigned to the variable. On initial render, it holds the result of invoking your calculation function. On subsequent renders, it delivers either the stored result or a fresh computation if dependencies changed.

Why do you pass a callback function rather than invoking the filter directly? JavaScript evaluates function arguments eagerly before calling an outer function. If you passed a direct function call, JavaScript would execute the filter before the Hook even runs. Passing a callback lets React decide whether to execute the calculation or skip it.

The variables accessed inside the arrow function are the state values for the current render. Because the arrow function is declared within the component body, it captures those values through closure scope (as seen in Lesson 15).

```tree dir=right caption="How React handles the three parts of a useMemo line on each render of ChatRoom."
One `useMemo` line on each render of `ChatRoom`
- +1. The calculation function [`calculateValue`] | Our code **writes** it; **React calls** it | Must be **pure** and take **no arguments**
- +2. The dependencies [`messages` `query`] | React compares each one with **the last render** | Uses **`Object.is`**, as an Effect does
- +3. The cached value [`visibleMessages`] | The **stored result** when nothing changed | A **fresh result** when one dependency changed
```

### The Helpers File and useMemo in ChatRoom

To maintain clean separation of concerns, utility helpers live in a dedicated messages file. The `createMessages` helper generates the initial history: 5,000 items, with the first three containing realistic conversation text. The `filterMessages` helper retains items whose text contains the query string, ignoring case differences:

```js title="src/messages.js"
const firstTexts = ['Hi!', 'Lunch at 12?', 'Sure'];

export function createMessages() {
  const messages = [];
  for (let i = 0; i < 5000; i++) {
    const text = i < 3 ? firstTexts[i] : 'Message ' + (i + 1);
    messages.push({ id: i, text });
  }
  return messages;
}

export function filterMessages(messages, query) {
  console.log('Filtering messages for:', query);
  const lowerQuery = query.toLowerCase();
  return messages.~filter~(m => m.text.toLowerCase().includes(lowerQuery)); // Builds a new array, even when the search is empty
}
```

When the search input is empty, every item matches the query, causing the view to show the entire history.

Next, the chat room component imports `useMemo` and wraps the filter calculation:

```jsx title="src/components/ChatRoom.jsx"
import { useMemo, useState } from 'react';
import { createMessages, filterMessages } from '../messages.js';
import MessageList from './MessageList.jsx';

export default function ChatRoom() {
  const [messages, setMessages] = useState(~createMessages~); // The function itself: React calls it on the first render only
  const [query, setQuery] = useState('');
  const [text, setText] = useState('');

  const visibleMessages = ~useMemo~( // Filters only when messages or query changed
    () => filterMessages(messages, query),
    [messages, query]
  );

  return (
    <section>
      <label>Search messages <input value={query} onChange={e => setQuery(e.target.value)} /></label>
      <MessageList messages={visibleMessages} />
      <label>Message <input value={text} onChange={e => setText(e.target.value)} /></label>
    </section>
  );
}
```

Notice that `createMessages` is passed to `useState` as a function reference without invoking it. This ensures React executes the initialization function only during initial component mounting. Invoking `createMessages()` directly in the argument position would force JavaScript to build 5,000 objects on every keystroke, discarding them immediately.

The message list remains an unmemoized component at this stage. It maps over the incoming array to render individual items:

```jsx title="src/components/MessageList.jsx"
export default function MessageList({ messages }) {
  return (
    <ul>
      {messages.map(m => <li key={m.id}>{m.text}</li>)}
    </ul>
  );
}
```

### What the Console Shows When the User Types and Searches

**Typing in the message input skips the filter calculation, while modifying the search query runs it.** Here is the complete execution sequence:

1. The initial page load executes. React runs the calculation function, caches the resulting array, and assigns it to the visible messages variable. The console records the filtering message with an empty search query. In development, StrictMode invokes the calculation twice, producing two identical log entries.
2. The user types a character into the message draft field. The state setter triggers a re-render of the chat room.
3. React evaluates the Hook call and compares current dependencies with their prior values. Both the messages array and the search string remain unchanged.
4. React immediately returns the cached array without running the calculation function. No filtering log appears in the console.
5. The user types a second character, and React reuses the cached array once again.
6. Next, the user types a search term into the search input. The search state transitions from an empty string to the new letter.
7. React detects that a dependency changed, invokes the calculation function, and stores the newly computed array. The rendered list shrinks to display only matching messages, and the console logs the filtering operation.

Here is the console output captured when the page loads:

```devconsole caption="The Console when the chat room loads: the filter runs once, and StrictMode prints a copy of the line."
Filtering messages for:
Filtering messages for: | Strict Mode copy
```

Clear the console to inspect subsequent update logs. Here are the entries printed after typing 'OK' in the draft input, followed by 'l' in the search input:

```devconsole caption="The new lines after the user types OK and then l: the two letters in the Message field print nothing, and the search prints the filter line."
Filtering messages for: l | letter l in Search messages
Filtering messages for: l | Strict Mode copy
```

```page width=text caption="The chat room after the user types OK in the Message field and l in the Search messages field."
form:
  field: Search messages | l | good
line: Lunch at 12?
form:
  field: Message | OK
```

One subtlety requires attention: while the filter calculation was skipped, the list item elements were not. Because the message list component remains a plain, unmemoized child, updating message draft state causes it to re-render all 5,000 list items (as seen in Lesson 54). Memoizing the calculation saved the filtering loop, but not child component rendering. Principle 3 addresses how to optimize the child list.

### The Real Mistake: No Dependency List

Troubleshooting sections in official React documentation highlight this frequent error. A developer wraps an expensive function inside the Hook but omits the dependency array argument:

```jsx title="useMemo without its dependency list"
const visibleMessages = ~useMemo~(() => filterMessages(messages, query)); // **WRONG:** no dependency list, so React calls the filter on every render
```

1. The application continues to render correct search results.
2. As the user enters text in the message field, filtering logs appear on every keystroke.
3. The developer mistakenly concludes that the Hook does not work.

The Hook functions properly, but it has no dependencies to compare. Official guides warn that omitting the dependency array causes React to re-execute the calculation on every render pass. Providing the dependency array restores expected caching behavior.

### Five Facts About the Calculation Function

1. **The calculation executes during rendering, requiring absolute purity.** Official guides state that caching functions properly only for pure calculations. If a calculation mutates external data, such as pushing new entries into an existing state array, StrictMode will duplicate that side effect. Producing and modifying a fresh local array inside the calculation is completely safe. The React Hooks linter rule enforces this standard: computations cached by `useMemo` must compute values without side effects.
2. **StrictMode executes the calculation twice in development.** React deliberately runs calculation functions two times to expose accidental mutations and impurities. This behavior occurs exclusively in development environments, with React retaining one of the calculated outputs (as seen in Lesson 47).
3. **React does not provide a semantic guarantee that cached values persist forever.** Official documentation notes that React preserves cached values under normal operations, but may release cached memory under specific conditions. Examples include editing source files during development or components suspending while awaiting asynchronous data (as seen in Lesson 69). If application correctness requires retaining a value across renders, store it in state or in a ref (as seen in Lessons 12 and 30).
4. **As a React Hook, useMemo must be called at the component top level.** You cannot invoke Hooks inside loops, nested functions, or conditional branches. To cache a calculation for each list item, extract a child component and call `useMemo` inside it (as seen in Lesson 38).
5. **Memoization during render replaces manual state synchronization via Effects.** Official guides recommend `useMemo` over `useEffect` when computing derived data from existing state. Using an Effect to store calculated results in state triggers unnecessary extra render passes and can cause visual inconsistencies (as seen in Lesson 34).

---

## PRINCIPLE | `console.time`: measure first, and cache only a calculation that is slow

> [!PRINCIPLE]
> **Principle 2: Measure First: useMemo Pays Off Only for a Slow Calculation**
>
> *Wrap a calculation in `useMemo` only when `console.time` shows it is slow, about `1ms` or more, and it runs again on renders where its dependencies did not change.*
>
> `useMemo` skips work only on renders where the dependencies stayed the same, and it never makes the first render faster. Around a cheap check, there is nothing to skip: the user sees no difference, and the code gets an arrow function and a dependency list that can go wrong. Measure on a throttled CPU, in a production build, before you decide.
>
> **DO THIS:**
> ```jsx
> const canSend = ~text.trim() !== ''~; // Cheap: written directly
> const visibleMessages = useMemo(() => filterMessages(messages, query), [messages, query]); // Measured as slow
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const canSend = ~useMemo~(() => text.trim() !== '', [text]); // **WRONG:** nothing to skip, and text changes at every letter anyway
> ```

### VS | `canSend` Written Directly vs. `canSend` in `useMemo`: the exact same page, with more code

The send button should be disabled when the message input is empty. Validating this condition requires a single string inspection. Compare the direct implementation with the memoized version:

```jsx title="The check for Send written directly, and inside useMemo"
const canSend = text.trim() !== ''; // Reads one short string on each render
const canSend = ~useMemo~(() => text.trim() !== '', [text]); // The same answer, with more code
```

From the user perspective, both versions produce identical application behavior. The send button enables and disables at the exact same moments. Why is memoization useless here? Two physical reasons explain why:
1. **The calculation has no meaningful cost to eliminate.** Trimming a single short string executes in a fraction of a microsecond.
2. **The calculation would not be skipped regardless.** The draft text string changes on every keystroke in the input, causing dependencies to change and triggering the calculation anyway.

Wrapping this statement introduces unnecessary syntax without providing any runtime savings.

Beginners often assume memoization automatically speeds up any JavaScript operation. In reality, the Hook saves time only when skipping calculations during re-renders where dependencies stayed constant. When operations are trivial, skipping them saves no perceptible time. Official React guidance suggests that unless you create or iterate over thousands of objects, a calculation is unlikely to be expensive. Because our message filter loops over 5,000 items, it might warrant memoization, but only objective profiling can confirm it.

### Measuring the Filter with console.time

Inspecting source code cannot reveal whether an algorithm constitutes a bottleneck. Concrete profiling provides the necessary data. The browser methods `console.time` and `console.timeEnd` benchmark execution time (as seen in Lesson 54). The first method starts a named timer, the second stops it, and the developer console prints the elapsed milliseconds. Place them around the unmemoized filter:

```jsx title="src/components/ChatRoom.jsx"
console.time('filter messages');
const visibleMessages = filterMessages(messages, query);
console.timeEnd(~'filter messages'~); // Must match the label given to console.time
```

Now type a character into the message draft field. Each render prints timer output directly in the console. Exact durations vary depending on machine hardware:

```devconsole caption="The Console after one letter in the Message field, with the timer around the plain filter line."
Filtering messages for: | letter O
filter messages: 0.6640625 ms
Filtering messages for: | Strict Mode copy
filter messages: 0.18701171875 ms
```

Official documentation establishes a practical threshold: when recorded calculation time totals roughly 1 millisecond or more, memoizing that operation becomes worthwhile.

Two environmental factors can distort local measurements:
1. **Development computers run significantly faster than typical consumer mobile devices.** Official guides recommend evaluating performance under simulated device constraints, using browser CPU throttling tools (as seen in Lesson 54).
2. **Development bundles include debugging infrastructure, and StrictMode duplicates component executions.** Accurate performance numbers require testing production builds on realistic user hardware.

Concrete timing data must guide your decisions rather than intuition. If filtering 5,000 items takes well under a millisecond on throttled hardware, an unmemoized statement remains completely appropriate. If execution reaches or exceeds one millisecond, memoization provides valuable efficiency gains, because the operation runs on unrelated keystrokes while input data rarely changes.

Now retain the timer statements and wrap the calculation inside `useMemo`:

```jsx title="src/components/ChatRoom.jsx"
console.time('filter messages');
const visibleMessages = ~useMemo~(() => filterMessages(messages, query), [messages, query]); // Skipped on letters in the Message field
console.timeEnd('filter messages');
```

Type into the draft input once more. The recorded duration falls near zero, because React delivers the cached array reference without invoking the filter function.

### What useMemo Never Speeds Up: the First Render

Reload the application page. During initial mount, the timer records the full execution duration of the filter. Because no previous cache exists on mount, React must execute the calculation function to generate the initial value. Official documentation emphasizes that `useMemo` cannot accelerate initial renders. Its sole purpose is skipping redundant computations during subsequent update passes.

### The Real Mistake: Wrapping Every Calculation

Indiscriminately wrapping every statement yields no benefits for users while harming code legibility. Development teams frequently fall into this pattern:

1. A team adopts a blanket policy to wrap every computation in `useMemo`, believing it guarantees optimal speed.
2. Developers wrap string concatenations, array lengths, and button status checks.
3. Every line accumulates boilerplate arrow functions and dependency lists, increasing the risk of missing dependencies.
4. End users experience zero measurable improvement in application responsiveness.

Official documentation addresses this exact scenario directly. While excessive memoization rarely causes critical harm, it makes application code noticeably harder to read. Furthermore, including even one dependency that produces a new reference on every render invalidates memoization across the entire component.

### When useMemo Is Worth Adding

Official documentation highlights three primary scenarios where `useMemo` provides real value:

1. **The calculation is measurably slow, and its dependencies change infrequently.** This matches our message filter once profiling confirms significant execution time.
2. **The computed value is passed as a prop to a child component wrapped in `memo`.** Principle 3 explores this cooperative pattern.
3. **The computed value serves as a dependency for another Hook.** This includes dependencies passed to downstream Effects or secondary memoization Hooks.

The architectural granularity of an application also influences performance requirements. When user actions trigger coarse page transitions or full section replacements, memoization is rarely needed. When user actions trigger granular real-time updates, such as dragging items on an interactive canvas, memoization becomes essential.

The introduction of React Compiler refines these development practices. Official guidelines recommend relying on the automated compiler for standard codebases, reserving manual `useMemo` calls for cases requiring precise control. In existing codebases, preserve working memoization calls unless thorough profiling validates their removal (as seen in Lesson 63).

### The Send Button

The chat room now incorporates the direct validity check for the send button without memoization. It also introduces `handleSend`, appending the new message to the history and clearing the input. Having completed our profiling, the timing statements are removed:

```jsx title="src/components/ChatRoom.jsx"
import { useMemo, useState } from 'react';
import { createMessages, filterMessages } from '../messages.js';
import MessageList from './MessageList.jsx';

let nextId = 5000;

export default function ChatRoom() {
  const [messages, setMessages] = useState(createMessages);
  const [query, setQuery] = useState('');
  const [text, setText] = useState('');

  const visibleMessages = useMemo(
    () => filterMessages(messages, query),
    [messages, query]
  );
  const canSend = ~text.trim() !== ''~; // Cheap: written directly, with no useMemo

  function handleSend() {
    setMessages([...messages, { id: nextId++, text }]);
    setText('');
  }

  return (
    <section>
      <label>Search messages <input value={query} onChange={e => setQuery(e.target.value)} /></label>
      <MessageList messages={visibleMessages} />
      <label>Message <input value={text} onChange={e => setText(e.target.value)} /></label>
      <button ~disabled={!canSend}~ onClick={handleSend}>Send</button> {/* Greyed out while the Message field is empty */}
    </section>
  );
}
```

The next message identifier begins at 5000 because the initial history occupies identifiers 0 through 4999 (as seen in Lesson 19).

When the user clicks the send button, updating message state creates a new array reference. Because messages changed, React re-executes the filter with the active query. The console logs a fresh filtering message, and the new message renders at the end of the list.

---

## PRINCIPLE | `useMemo` with `memo`: the memoized child receives the same array and skips

> [!PRINCIPLE]
> **Principle 3: Same Array for memo: useMemo Lets a Memoized Child Skip**
>
> *When you pass a calculated array or object to a component wrapped in `memo`, wrap the calculation in `useMemo`, so the child receives the same value until a dependency changes.*
>
> `filter`, `map`, and object literals build a new value on every render, even when the content is the same. `memo` compares each prop by `Object.is`, so a new array with the same messages counts as a changed prop, and the child renders again. `useMemo` hands back the very same array while its dependencies stay the same, so `memo` can skip the child.
>
> **DO THIS:**
> ```jsx
> const visibleMessages = ~useMemo~(() => filterMessages(messages, query), [messages, query]); // The same array on letters in the Message field
> return <MessageList messages={visibleMessages} />;
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const visibleMessages = ~filterMessages(messages, query)~; // **WRONG:** a new array on every render, so the memoized MessageList renders anyway
> return <MessageList messages={visibleMessages} />;
> ```

### VS | The Same Messages vs. the Same Array: `memo` checks which array it is, not what it holds

In Lesson 55, you learned that a component wrapped in `memo` skips re-rendering when props remain unchanged. Now suppose you wrap the child message list component in `memo`, and the parent passes the filtered messages array as a prop. Consider the two ways to generate that prop:

```jsx title="Two ways to make the array that goes to the memoized MessageList"
const visibleMessages = ~filterMessages(messages, query)~; // A new array on every render of ChatRoom
const visibleMessages = ~useMemo~(() => filterMessages(messages, query), [messages, query]); // The same array until messages or query changes
```

A developer might assume that because filtered items did not change, the memoized child will skip execution. **The array contents may look identical, but they are not the same object reference**. Array filtering methods construct a brand new array on every call, even if every item passes (as seen in Lesson 19). Because `memo` compares incoming props using `Object.is`, two distinct arrays holding identical items evaluate as unequal (as seen in Lesson 55). Official React documentation explains that filtering always creates a different array reference, just as an object literal always creates a distinct object.

```tree caption="A memoized child receives a new array from the plain filter line, and the same array from the useMemo line."
What `memo` sees in the `messages` prop after a letter in the `Message` field
- !From the plain filter line [`filterMessages`] | The **same messages** in a **new array** | `Object.is` says **different**, so React **renders `MessageList` again**
- +From the `useMemo` line [`useMemo`] | The **same array** as last time | `Object.is` says **same**, so React **skips `MessageList`**
```

### MessageList in memo

The child component file imports `memo`, wraps the component function, and logs a message whenever it renders:

```jsx title="src/components/MessageList.jsx"
import { memo } from 'react';

const MessageList = ~memo~(function MessageList({ messages }) { // Skips while messages is the same array
  console.log('MessageList rendered');
  return (
    <ul>
      {messages.map(m => <li key={m.id}>{m.text}</li>)}
    </ul>
  );
});

export default MessageList;
```

### What Happens on a Letter Without useMemo, and With It

**Without memoizing the calculation, `memo` on the child cannot skip rendering. With `useMemo`, child skipping succeeds.** First, examine what happens when the parent uses a plain filter call:

1. The user enters a character into the message draft input. The parent re-renders and executes the filter, returning a fresh array holding the same 5,000 items.
2. React compares the newly passed messages prop against the previous prop using `Object.is`. The two array references differ.
3. React executes the message list component, iterating over all 5,000 messages again. The console records list rendering on every keystroke, even though the component is wrapped in `memo`.

```devconsole caption="With the plain filter line, one letter in the Message field runs the filter and renders the memoized MessageList again."
Filtering messages for: | letter O
Filtering messages for: | Strict Mode copy
MessageList rendered
MessageList rendered | Strict Mode copy
```

Now consider the parent component using `useMemo` as introduced in Principle 1:

1. The user types another character in the draft input. The Hook verifies that dependencies did not change and returns the cached array reference.
2. The child prop receives the identical array reference from the previous render pass. React skips executing the child component, and no log appears in the console.
3. When the user types into the search field, query state changes. The filter executes, producing a new array, and the child list re-renders with filtered items as expected.

```devconsole caption="With the useMemo line, one letter in the Message field prints nothing."
= No messages
```

The visual output remains unchanged in both scenarios. Inspecting the DOM elements panel reveals no changes to list items. React reconciles new elements against previous elements and modifies nothing in the DOM (as seen in Lesson 13). The difference lies entirely in JavaScript execution: recalculating 5,000 rows on every keystroke versus doing zero work.

Official documentation summarizes this dynamic succinctly. You do not need to wrap every calculation in `useMemo` unless you have a specific objective. In this scenario, the objective is preserving reference identity for a child wrapped in `memo`.

### The Real Mistake: memo Without useMemo

Developers frequently encounter this frustrating optimization failure:

1. Profiling tools identify child component rendering as a latency source during text entry (as seen in Lesson 54).
2. The developer wraps the child component in `memo` (as seen in Lesson 55).
3. The parent continues passing unmemoized arrays or objects generated during render.
4. Input latency persists because every keystroke provides a fresh array reference, forcing the child to render anyway.
5. The developer removes `memo`, wrongly assuming component memoization is ineffective.

Resolving this bottleneck requires one adjustment in the parent: caching the generated value with `useMemo`. Memoizing the child component and stabilizing reference identity in the parent operate as a cooperative system.

### Three Facts for the Interview

1. **Rendering DOM elements frequently costs more than raw array calculations.** Official documentation points out that as item counts scale, rendering child elements produces far greater overhead than filtering arrays. Profiling very large lists requires virtualized rendering strategies (as seen in Lesson 62).
2. **The useMemo Hook can also cache JSX elements directly.** Because JSX tags evaluate to JavaScript objects, returning `<MessageList />` from `useMemo` achieves skipping behavior comparable to component memoization. Official documentation notes that identical JSX references prevent re-renders, but recommends wrapping components in `memo` for cleaner component design.
3. **The useMemo Hook caches values, whereas useCallback caches functions.** Official guides clarify that `useMemo` retains the result of invoking a function, while `useCallback` retains the function reference itself. Stabilizing callback functions passed to memoized children requires `useCallback` (as seen in Lesson 57). Supplying objects to context providers relies on `useMemo` to prevent consumer re-renders (as seen in Lesson 59).

---

## PRINCIPLE | `searchOptions` in the dependencies: a new object on every render breaks the cache

> [!PRINCIPLE]
> **Principle 4: Object Dependencies: An Object Made in the Body Breaks the Cache**
>
> *Never list an object created in the component body as a dependency of `useMemo`; create it inside the calculation function, and list the values it is made from.*
>
> Every line of the component body runs on every render, so an object literal there is a new object each time. `useMemo` compares dependencies by `Object.is`, finds the new object different, and runs the calculation on every render. A string or a number with the same value is the same for `Object.is`, so depending on `query` keeps the cache working.
>
> **DO THIS:**
> ```jsx
> const visibleMessages = useMemo(() => {
>   const searchOptions = { text: query, matchCase: false };
>   return searchMessages(messages, searchOptions);
> }, [messages, ~query~]); // A string: the same on letters in the Message field
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const searchOptions = { text: query, matchCase: false };
> const visibleMessages = useMemo(
>   () => searchMessages(messages, searchOptions),
>   [messages, ~searchOptions~] // **WRONG:** a new object on every render, so the filter runs every time
> );
> ```

### VS | The Same Text vs. the Same Object: a string compares by value, an object by identity

React tests dependency array values using `Object.is`. Compare how identity comparison treats identical strings versus identical objects:

```js title="The same text, and two objects with the same text"
Object.is(~'ok', 'ok'~); // true: two strings with the same letters are the same value
Object.is(~{ text: 'ok' }, { text: 'ok' }~); // false: two objects, made one after the other
```

Developers often assume that an object containing identical properties evaluates as the same value. **Property values may look identical, but reference identity is completely different.** The `Object.is` method compares objects by memory reference rather than structural shape. Component memoization inspects incoming props using the exact same rule (as seen in Lesson 55). Because every statement in a component body executes on each render pass, object literals allocate fresh instances every time. Official documentation notes that all code directly inside a component body re-executes on every re-render. Consequently, declaring an object in the component body and adding it to a dependency array causes comparisons to fail continuously. This mirrors the classic dependency pitfall found in Effects (as seen in Lesson 37).

This scenario commonly arises when search functions accept structured configuration options.

### A Shared Search Helper

Suppose a teammate refactors the filtering logic into a shared search helper. The function accepts an options object containing search text and case-sensitivity preferences, logging each execution to the console:

```js title="src/messages.js"
export function searchMessages(messages, { text, matchCase }) {
  console.log('Filtering messages for:', text);
  return messages.filter(m =>
    matchCase ? m.text.includes(text) : m.text.toLowerCase().includes(text.toLowerCase())
  );
}
```

In the chat room, the developer constructs the options object in the component body, adding it to the dependency array:

```jsx title="src/components/ChatRoom.jsx"
const searchOptions = ~{ text: query, matchCase: false }~; // A new object on every render of ChatRoom
const visibleMessages = useMemo(
  () => searchMessages(messages, searchOptions),
  [messages, searchOptions]
);
```

**Notice the hidden trap: the Hook call is present and filtering functions correctly, yet the computation runs on every keystroke.** Here is why:

1. The user interface functions as expected, correctly filtering items by search text.
2. The user types a character into the draft message input. The chat room re-renders and constructs a brand new options object in memory.
3. React compares the newly allocated options object against the previous instance using `Object.is`. The memory references differ.
4. React invokes the calculation function, producing a new messages array on every keystroke.
5. The new array reference is passed to the memoized message list, forcing all 5,000 rows to re-render.

```devconsole caption="With searchOptions in the dependency list, one letter in the Message field runs the filter and renders MessageList again."
Filtering messages for: | letter O
Filtering messages for: | Strict Mode copy
Filtering messages for: | Strict Mode copy
MessageList rendered
MessageList rendered | Strict Mode copy
```

Why do three filter logs appear? In development mode, StrictMode calls the calculation twice during the initial component render. The deliberate second render pass of the chat room allocates yet another options object, triggering a third calculation. In production builds, the filter runs once per keystroke. In both environments, filtering recalculates on keystrokes that modified none of its inputs.

When configured, the React Hooks linter flags this dependency issue. It warns that an object created in the component body changes on every render pass.

### The Fix: Create the Object Inside the Calculation Function

To resolve this issue, instantiate the configuration object inside the calculation function, declaring only the primitive search query in dependencies:

```jsx title="src/components/ChatRoom.jsx"
const visibleMessages = useMemo(() => {
  const searchOptions = { text: query, matchCase: false }; // Built only when the calculation runs
  return searchMessages(messages, searchOptions);
}, [messages, ~query~]); // A string: the same on every letter in the Message field
```

The dependencies now consist of the message list and a primitive string. Because strings with matching characters evaluate as identical under `Object.is`, the reference cannot change accidentally. As official documentation notes, primitive strings cannot accidentally become different across renders. Typing in the draft input no longer triggers the filter, and child component rendering is successfully skipped.

```tree caption="Where the searchOptions object is created decides whether useMemo can reuse its stored result."
Where `searchOptions` is created
- !In the component body, listed as a dependency [`searchOptions`] | A **new object** on every render | `useMemo` **runs the filter at every letter**
- +Inside the calculation function [`query`] | Built **only when the filter runs** | `useMemo` **reuses the stored array** on letters in the `Message` field
```

An alternative solution wraps the options object in its own `useMemo` call. While functionally valid, official guides prefer creating objects inside the calculation callback. Doing so eliminates an unstable dependency entirely rather than introducing extra memoization layers.

The final project files retain the simpler filtering helper, keeping dependencies restricted to messages and the search query.

### Finding the Dependency That Breaks the Cache

When a memoized calculation unexpectedly runs on every render, official guides provide a reliable technique to isolate the unstable dependency:

1. Log the dependency array immediately before the Hook call, inspecting its items in the console.
2. In browser developer tools, right-click logged arrays from two consecutive renders and store each as a global variable. The browser assigns them default variable names.
3. Compare individual array elements sequentially using the identity comparison method.
4. Any dependency pair returning false represents the unstable reference breaking your cache. Official guides advise removing that dependency or ensuring it receives a stable reference.

### The Real Mistake: Returning an Object from an Arrow Function

When memoizing an object literal, JavaScript syntax can create unexpected bugs:

```jsx title="Caching an options object with useMemo"
const searchOptions = useMemo(() => ~{ text: query }~, [query]); // **WRONG:** these braces start a function body, so it returns undefined
const searchOptions = useMemo(() => {
  return ~{ text: query }~; // An explicit return gives back the object
}, [query]);
```

Immediately following an arrow, opening curly braces denote a function body rather than an object literal. Without an explicit return statement, the function body evaluates to undefined, causing the Hook to cache undefined. While wrapping the object in parentheses resolves syntax ambiguity, official documentation recommends an explicit return statement for maximum readability.

### The Same Rule in Effects

Declaring objects in a component body and listing them as Effect dependencies forces Effects to re-run on every render pass. Official guides recommend resolving this by moving object creation directly inside the Effect callback (as seen in Lesson 37).

Even in modern applications utilizing React Compiler, manual memoization retains its utility when supplying stable dependencies to Effects (as seen in Lesson 63).

---

## All 4 Principles Together

### The Complete Files

Here are the complete source files for the optimized chat application. The expensive filter uses `useMemo`. The lightweight validity check runs directly. The message list relies on `memo`:

```files title="chat-room: File Explorer" caption="The five files of the finished chat room inside src/, next to index.html."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `App` inside `<StrictMode>`
  App.jsx | parent | Renders `ChatRoom`
  messages.js | helpers | Exports `createMessages` and `filterMessages`
  components/
    ChatRoom.jsx | state | Holds `messages`, `query`, and `text`, filters with `useMemo`, and renders the two fields and `Send`
    MessageList.jsx | memoized list | Exports the memoized `MessageList`
```

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  ~<StrictMode>~ {/* In development, React calls each component and each calculation function twice */}
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

```js title="src/messages.js"
const firstTexts = ['Hi!', 'Lunch at 12?', 'Sure'];

export function createMessages() {
  const messages = [];
  for (let i = 0; i < 5000; i++) {
    const text = i < 3 ? firstTexts[i] : 'Message ' + (i + 1);
    messages.push({ id: i, text });
  }
  return messages;
}

export function filterMessages(messages, query) {
  console.log('Filtering messages for:', query);
  const lowerQuery = query.toLowerCase();
  return messages.~filter~(m => m.text.toLowerCase().includes(lowerQuery)); // A new array on every call
}
```

```jsx title="src/components/ChatRoom.jsx"
import { useMemo, useState } from 'react';
import { createMessages, filterMessages } from '../messages.js';
import MessageList from './MessageList.jsx';

let nextId = 5000;

export default function ChatRoom() {
  const [messages, setMessages] = useState(createMessages);
  const [query, setQuery] = useState('');
  const [text, setText] = useState('');

  const visibleMessages = ~useMemo~( // Principle 1: filters only when messages or query changed
    () => filterMessages(messages, query),
    [messages, query] // Principle 4: two plain values, no object made in the body
  );
  const canSend = ~text.trim() !== ''~; // Principle 2: cheap, so written directly

  function handleSend() {
    setMessages([...messages, { id: nextId++, text }]);
    setText('');
  }

  return (
    <section>
      <label>Search messages <input value={query} onChange={e => setQuery(e.target.value)} /></label>
      <MessageList ~messages={visibleMessages}~ /> {/* Principle 3: the same array until messages or query changes */}
      <label>Message <input value={text} onChange={e => setText(e.target.value)} /></label>
      <button disabled={!canSend} onClick={handleSend}>Send</button>
    </section>
  );
}
```

```jsx title="src/components/MessageList.jsx"
import { memo } from 'react';

const MessageList = ~memo~(function MessageList({ messages }) { // Principle 3: skips while messages is the same array
  console.log('MessageList rendered');
  return (
    <ul>
      {messages.map(m => <li key={m.id}>{m.text}</li>)}
    </ul>
  );
});

export default MessageList;
```

### How React Calls the Components

When the application mounts, React calls the root component first, then the chat room, and finally the message list. During execution, the chat room computes filtered messages through the Hook and passes the resulting array downward:

```tree caption="The component tree of the chat room and the order in which React calls each component when the page loads."
`App` [1. Called first] | **Root component** | Returns `<ChatRoom />`
- +`ChatRoom` [2. Called second] | Holds **`messages`, `query`, and `text`** | `useMemo` **calls `filterMessages`** on the first render
  - +`MessageList` [3. Called third] | Wrapped in **`memo`** | Renders **one `<li>` per message**
```

### What Runs After Each Action of the User

| What the user does | Does the filter run? | Does `MessageList` render? |
| :--- | :--- | :--- |
| **The page loads** | Yes: nothing is stored yet | Yes: first render |
| **Types a letter in the `Message` field** | No: `messages` and `query` are the same, so `useMemo` returns the stored array | No: `memo` receives the same array |
| **Types a letter in the `Search messages` field** | Yes: `query` changed | Yes: a new array with the matching rows |
| **Clicks `Send`** | Yes: `messages` is a new array | Yes: a new array, with one more row when the new message matches the search |

Here is the whole lesson in one table:

| Aspect | The Habit That Wastes Work | The React Rule |
| :--- | :--- | :--- |
| **A slow calculation** | Written directly in the body, so it runs at every letter in an unrelated field | Wrapped in `useMemo`, with every value it reads in the dependency list |
| **A cheap calculation** | Wrapped in `useMemo` because someone said it is faster | Written directly; measured with `console.time` before any `useMemo` |
| **A value for a memoized child** | A freshly filtered array on every render, so `memo` never skips | The array from `useMemo`, the same until a dependency changes |
| **An object as a dependency** | Built in the body and listed in the dependency list, so React never reuses the stored result | Built inside the calculation function, with the plain values it is made from in the list |

Keep the fundamental rule of this lesson in mind. **React reuses cached calculation results as long as dependencies remain identical.** Memoization saves computational work only for heavy calculations or values delivered to memoized children.

---

## For the Interview

> **The Interview Question:** What does useMemo cache, and when is it wasted work?

### How to Answer Clearly in 30 Seconds

"`useMemo` caches the result of an expensive calculation between component re-renders. On initial mount, React invokes the calculation function and stores its returned value. On subsequent re-renders, React checks dependency values using `Object.is`. If every dependency matches, React returns the cached result without recalculating. If any dependency changes, React re-executes the calculation. Memoization proves valuable in three primary scenarios:
1. **Noticeably slow calculations**: operations taking roughly 1 millisecond or more whose dependencies change infrequently.
2. **Stable props for memoized components**: passing cached arrays or objects so child components wrapped in `memo` can skip rendering.
3. **Stable dependencies for other Hooks**: preserving reference identity for downstream Effects or memoized values.

Around lightweight computations, `useMemo` represents wasted effort. It provides no performance benefit, cannot accelerate initial mount, and harms code legibility."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Should we wrap every calculation in `useMemo` to be safe?"**
   **No.** `useMemo` saves time only on re-renders where dependencies remain unchanged. Trivial operations offer no computational cost to eliminate. Official documentation states there is no benefit to memoizing cheap calculations. Unnecessary memoization clutters codebases with boilerplate and risks breaking caches through unstable dependencies. Profile first using `console.time`, and memoize only verified bottlenecks. For modern projects, React Compiler automates memoization where appropriate.
2. **"Your `useMemo` recalculates on every render. Why?"**
   Two common causes account for this failure. First, the dependency array was omitted, forcing React to recalculate on every render pass. Second, a dependency receives an unstable reference on every render, such as an object literal declared in the component body. Because `Object.is` tests objects by reference, newly allocated objects always evaluate as changed. To diagnose it, log dependencies and inspect them across renders. The fix involves moving object creation inside the calculation function and depending only on primitive values.
3. **"Can your code rely on `useMemo` to keep a value between renders?"**
   **No.** React does not treat `useMemo` as a semantic guarantee. React may discard cached values to reclaim memory, during development Fast Refresh, or when components suspend. Official documentation specifies that code must remain functionally correct without memoization. When values must persist across renders, store them in state or in a ref. Furthermore, calculations must remain pure, because React executes them during rendering, and StrictMode duplicates them in development.

```tree dir=right caption="Interview summary: when useMemo saves work and when it is wasted work."
When is `useMemo` worth adding?
- +A slow calculation, measured [`console.time`] | About **`1ms` or more**, with dependencies that **rarely change** | `useMemo` **skips it** on unrelated re-renders
- +A value for a `memo` child [`messages={visibleMessages}`] | The child receives the **same array** | `memo` **can skip** the child
- !A cheap calculation [`text.trim`] | Nothing worth skipping | **No benefit**, and the code is **harder to read**
- !An object made in the body as a dependency [`searchOptions`] | A **new object** on every render | React **never reuses** the stored result
```
