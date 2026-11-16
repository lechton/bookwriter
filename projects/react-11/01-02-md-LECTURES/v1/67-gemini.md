# Lecture 67: How the Search Box Stays Fast While a Slow List Renders

*(Why does typing stutter when the same text also filters a long list?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do you keep typing responsive while a big re-render runs with useTransition?

---

## VS | One `query` for the Field and the List vs. a Second `searchQuery` in a Transition: one freezes the typing, two let every letter in at once

> In a search interface filtering a heavy list, typed characters must appear on screen immediately, while filtered results can settle a moment later. **`useTransition` separates a single keystroke into two distinct updates: an urgent update for the `<input>` element, and a non-urgent Transition for the filtered list**. The list itself computes no faster, but React executes that work in interruptible background slices, ensuring subsequent keystrokes never wait.

Consider a search bar on an e-commerce catalog or blog. Typing `1` followed by `2` progressively narrows the displayed items below the field. Users readily tolerate a brief delay for search results to settle. Users immediately notice and dislike typing lag when letters appear late.

As established in Lesson 66, the browser executes work on a single main thread. That same thread processes JavaScript execution, handles user keystrokes, calculates layout geometry, and paints visual pixels. While React computes a computationally expensive list on the main thread, the browser cannot service user input.

In a controlled `<input>` field, the visible character on screen is driven directly by React state. React synchronizes `query` with the DOM `value` property of the input. Consequently, a typed character appears only after React completes a re-render with the new state value and commits those changes to the DOM.

When that exact same `query` state also filters a computationally heavy list, updating the text input and filtering the items occur within a single render pass. **The text field cannot update until the entire list finishes rendering.**

```jsx title="One query for the field and the list"
<input value={~query~} onChange={e => setQuery(e.target.value)} /> {/* The field shows query */}
<PostList query={~query~} /> {/* The slow list reads the same query */}
```

The solution applies the priority decoupling introduced in Lesson 66 to user input events. A single user interaction produces two distinct state transitions. The official React documentation notes that a single user input should result in both an urgent update and a non-urgent one.

```jsx title="One keystroke, two state variables"
setQuery(text); // Urgent: the field shows the letter at once
~startTransition~(() => { // A Transition: React renders the new list in the background
  setSearchQuery(text);
});
```

Keep one guiding rule in mind throughout this lesson. **The `<input>` field must update immediately, while the filtered list can settle moments later.**

### The Words This Lesson Stands On

> [!DEFINITION]
> **A controlled `<input>` field.** [REVIEW] A controlled input binds its visual value directly to React state: `<input value={query} onChange={e => setQuery(e.target.value)} />`.
> 1. The component holds the current string in state and supplies it to the input element via the `value` prop.
> 2. When the user types, the browser fires an `onChange` event, prompting our handler to pass the new text to `setQuery`.
> 3. The input field displays only what state dictates, so the typed character reaches the screen only after React re-renders with the updated state and commits that change to the DOM (Lesson 20).

> [!DEFINITION]
> **An urgent update and a Transition.** [REVIEW] React prioritizes state updates according to user expectations.
> 1. An urgent update, such as calling `setQuery('1')` directly inside an event listener, renders synchronously to completion without interruption to provide instant feedback.
> 2. A Transition wraps state setters inside `startTransition`, instructing React to render the resulting tree in interruptible chunks in the background while yielding the main thread to pending browser events.
> 3. If an urgent user interaction arrives while a Transition is rendering, React discards the unfinished background work to handle the urgent update first (Lesson 66).

> [!DEFINITION]
> **memo.** [REVIEW] `memo` is a React higher-order component that prevents unnecessary child renders: `const PostList = memo(function PostList({ query }) { ... })`.
> 1. When the parent component re-renders, React inspects the props passed to the memoized child.
> 2. React compares each new prop against its previous value using `Object.is` shallow equality.
> 3. If all props remain identical, React skips executing the component function entirely and reuses its previous rendered output (Lesson 55).

### VS | `query` vs. `searchQuery`: the same text at two speeds

Both state variables receive identical string values from the same user keystroke. Once the user stops typing, both variables store the exact same string. Despite holding identical text, each variable serves a completely different scheduling role:
- **`query`** updates immediately on every keystroke, ensuring the controlled input element reflects typed text without delay.
- **`searchQuery`** transitions in the background and can safely lag behind or skip intermediate keystrokes when the user types quickly.

The complete strategy in this lesson unfolds across six concrete steps:
1. We maintain two separate state variables: `query` for the text input, and `searchQuery` for the list.
2. On every keystroke, `query` updates immediately as an urgent update.
3. The second variable `searchQuery` updates within a Transition, enabling React to render the list concurrently in the background.
4. Wrapping the list component in `memo` ensures the urgent update render skips the heavy list entirely.
5. If the user types a new character before the list finishes rendering, React discards the outdated render and processes the latest query.
6. The boolean flag `isPending` signals that background work is active, allowing us to visually dim the existing list while the new one prepares.

Steps 1 through 3 and step 5 adapt the concurrent rendering workflow from Lesson 66 to keyboard interactions. Steps 4 and 6 introduce list memoization and pending visual feedback for responsive search fields.

```tree caption="One keystroke makes two updates: the field changes at once, and the list follows in the background."
One keystroke in the search field
- +Urgent update [`setQuery`] | Puts the typed letter **in the field** | The user sees the letter **at once**
- +Transition [`setSearchQuery`] | React renders the new list **in the background** | The list **follows a moment later**
```

### What Is at Stake

At stake is the fundamental responsiveness of the text input. An input element must register and display every keystroke instantly. The React documentation explains that urgent updates like typing or clicking require immediate responses to match physical intuitions about responsive interfaces.

When a text field waits on a slow list render, typed characters stutter and appear in delayed bursts. The user cannot tell that the CPU is busy computing list items. The user only perceives an unresponsive input field that drops keystrokes.

Developers frequently make three architectural errors when optimizing search fields:
1. **Wrapping the text input state setter inside `startTransition`.** The React documentation explicitly forbids using a Transition for state variables that control form inputs. Principle 2 explores this failure mode.
2. **Adding a second state variable while omitting `memo` on the list component.** The input continues to freeze on keystrokes, leading developers to assume transitions failed. Principle 3 explains the mechanics.
3. **Assuming transitions accelerate list rendering.** A Transition does not reduce component render time. It merely grants priority to user interactions and yields the main thread.

### The Rule of Thumb: does the user type into it?

**Ask one decisive question about text driving a slow list: does the user directly type into it? If yes, keep the text input state urgent, and isolate the list behind its own state variable updated inside `startTransition`.**

### Five Ways to Handle Typing over a Slow List

Handling text inputs that filter heavy datasets is a frequent engineering challenge. Experienced developers evaluate five distinct strategies:
1. **Retain default synchronous rendering.** This approach suffices when list rendering executes quickly without perceptible UI latency. The React team advises avoiding premature optimization.
2. **Virtualize the list container.** Virtualization renders only the rows currently visible within the browser viewport, as detailed in Lesson 62. This works well for massive lists of lightweight items.
3. **Coordinate two state variables with `useTransition`.** This technique forms the core of this lesson. It suits components that manage both state setters and require an `isPending` indicator.
4. **Pair a single state variable with `useDeferredValue`.** Covered in Lesson 68, this approach excels when search text arrives as an external prop without direct access to a state setter.
5. **Debounce or throttle the update.** Debouncing delays rendering until the user pauses typing. Throttling caps updates to a fixed frequency. Both still block the main thread once rendering begins.

```tree caption="Five ways to handle typing over a slow list, and when each one fits."
Typing in a search field that drives a slow list
- +Leave it as it is | Fits when the list **renders fast enough** | **No extra code**
- +Virtualized list | Fits when the list is **long but each row is cheap** | Renders **only the rows on the screen**
- +Two state variables and `useTransition` [`query` `searchQuery`] | Fits when **we own both set functions** | Gives us **`isPending`** to show the list is behind
- +One state variable and `useDeferredValue` | Fits when the text **comes from a prop** | Taught in **Lesson 68**
- !Debouncing or throttling | **Waits a fixed time**, then renders | ~The render **still blocks** the next keystroke
```

Because our component owns the text input element and manages both state setters directly, this lesson implements the third strategy.

## SECTION | A Blog's Posts Page with a Search Field

Our demonstration project implements a blog posts page. At the top sits an `<input>` element with the placeholder `Search posts`. Below sits a catalog of 500 post titles, running from `Post #1` to `Post #500`. The list displays only titles containing the current query string. When the input field is empty, all 500 titles appear.

```page width=text caption="The Posts page when it opens: an empty search field and the top of the list of 500 posts."
form:
  field:
line: Post #1
line: Post #2
line: Post #3
line: Post #4
```

Each post item artificially pauses for one millisecond during rendering, matching the synthetic workload from Lesson 66. This delay simulates the rendering cost of real production items containing thumbnails, formatted dates, and markdown summaries.

Throughout this lesson, we trace the interface as the user types `1` followed by `2`:
- Typing `1` matches 176 items: every post title containing the digit `1`.
- Typing `12` matches 15 items: post 12, post 112, the ten items from 120 to 129, and posts 212, 312, and 412.

The project structure contains four files. The entry file mounts the root component inside `<StrictMode>` as introduced in Lesson 07, remaining unchanged throughout our refactoring:

```files title="posts-page: File Explorer" caption="How the files of the Posts page sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `App` inside `<StrictMode>`; unchanged in this lesson
  App.jsx | parent | Exports `App` as default and renders `<SearchPage />`
  components/
    SearchPage.jsx | state | Holds the state of the search field and renders the field and `<PostList />`
    PostList.jsx | list | Builds the 500 titles and exports `PostList`, which renders one `SlowPost` per match
```

We begin with the naive single-state implementation and systematically refine it:

**PRINCIPLES:** The text input must respond instantly, while the list can settle moments later. Five architectural principles guide this design:
1. **Principle 1: One State Variable Freezes the Input.** When a single state variable coordinates both the input field and a slow list, typed characters stall until the entire list finishes rendering.
2. **Principle 2: Two State Variables Decouple Render Urgency.** The input state setter remains urgent, while a secondary state variable updates inside `startTransition` to drive list rendering in the background.
3. **Principle 3: Component Memoization Bypasses the Heavy List.** Updating parent state re-renders all unmemoized children. Wrapping the list in `memo` allows the urgent pass to skip list rendering entirely.
4. **Principle 4: Subsequent Keystrokes Abort Stale Renders.** When a user types a new character before a background list render completes, React discards the outdated work and renders the latest text.
5. **Principle 5: Visual Indicators Reside Outside Memoized Trees.** The `isPending` flag signals background activity. Styling a container wrapper avoids passing changing props to the memoized list.

---

## PRINCIPLE | One `query` for the field and the list: every letter waits for the whole list

> [!PRINCIPLE]
> **Principle 1: One `query` State: Every Letter Waits for the Whole List**
>
> *When a single state variable coordinates both a controlled input field and a heavy list, every keystroke forces a full list render before the typed character can appear on screen.*
>
> The text input displays `query`, while the list component filters rows against that same `query`. When the user types a character, React must evaluate every matching slow row before committing the new text to the DOM. Until that commit occurs, the input displays old text, giving the impression that the interface has frozen.
>
> **DO THIS:**
> ```jsx
> <input value={query} onChange={handleChange} /> {/* handleChange sets query at once and searchQuery in a Transition */}
> <PostList query={~searchQuery~} /> {/* The list reads its own state variable, which Principle 2 adds */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <input value={query} onChange={e => setQuery(e.target.value)} />
> <PostList query={~query~} /> {/* **WRONG:** every letter waits until all the matching slow posts have rendered */}
> ```

### The Posts Page with One `query`

This starting implementation uses a standard controlled field from Lesson 20, filtering list items dynamically during rendering as demonstrated in Lesson 22. The root app file simply renders the search page:

```jsx title="src/App.jsx"
import SearchPage from './components/SearchPage.jsx';

export default function App() {
  return ~<SearchPage />~; // The whole page lives in SearchPage
}
```

The search page component manages the `query` state and supplies it directly to the list:

```jsx title="src/components/SearchPage.jsx"
import { useState } from 'react';
import PostList from './PostList.jsx';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <>
      <input
        value={query}
        onChange={e => ~setQuery(e.target.value)~} // Every keystroke is an urgent update
        placeholder="Search posts"
      />
      <PostList query={~query~} /> {/* The list gets the same text as the field */}
    </>
  );
}
```

The list component file constructs post titles, filters matching records, and renders a slow post component for each match:

```jsx title="src/components/PostList.jsx"
const posts = [];
for (let i = 1; i <= 500; i++) {
  posts.push('Post #' + i);
}

export default function PostList({ query }) {
  console.log('PostList rendered:', query);
  const results = posts.filter(title => ~title.includes(query)~); // Fast: 500 short strings
  return (
    <ul>
      {results.map(title => <SlowPost key={title} title={title} />)}
    </ul>
  );
}

function SlowPost({ title }) {
  const startTime = performance.now();
  while (performance.now() - startTime < ~1~) {} // Slow: waits 1 millisecond for every post
  return <li>{title}</li>;
}
```

Three identifiers in this module belong to our application logic:
- **`posts`** is a module-level array containing 500 string titles. It initializes once when the file loads, independent of component state or props.
- **`results`** stores the filtered array of matching titles. The component recalculates this array on every render pass, as shown in Lesson 22.
- **`SlowPost`** simulates heavy rendering from Lesson 66, receiving a `title` prop and utilizing that unique title as its React `key`, as covered in Lesson 18.

The `console.log` call outputs a log entry whenever React evaluates `PostList`, as examined in Lesson 54. Because this project mounts within `<StrictMode>`, React invokes components twice in development mode, as described in Lesson 47. Consequently, each log entry appears twice in the console output.

### Why the Letter Waits for the List

**The typed character `1` cannot appear until React finishes rendering all matching rows.** Filtering 500 strings in JavaScript requires negligible time. Rendering 176 simulated slow posts consumes at least 176 milliseconds of main thread execution. In development mode, Strict Mode doubles this computation by invoking component functions twice.

Tracing the execution timeline when a user types `1` followed immediately by `2` reveals the bottleneck:
1. The initial page displays an empty input field and all 500 posts.
2. The user types `1`, scheduling an urgent state update via `setQuery('1')`.
3. React renders the search page component, followed by `PostList`, which synchronously executes 176 slow child components. The console logs `PostList rendered: 1`.
4. While React computes these components, the user types `2`. Because React monopolizes the main thread with an uninterrupted render, the browser queues the keystroke without updating the display.
5. React finally commits the render to the DOM, displaying `1` in the input and mounting 176 list items at the exact same instant.
6. The browser now processes the queued `2` keystroke. Calling `setQuery('12')` triggers another synchronous render pass for 15 slow items before finally rendering `12`.

The user observes an input box that freezes before abruptly jumping forward. Once typing ceases, the interface eventually stabilizes. The console records three distinct log pairs: the initial page load with empty text, followed by one pair for each typed character:

```page width=text caption="The Posts page after the user typed 12: the field shows 12, the list shows the 15 matching posts, and Strict Mode prints each line twice."
form:
  field:  | 12
line: Post #12
line: Post #112
line: Post #120
line: Post #121
line: Post #122
line: Post #123
line: Post #124
line: Post #125
line: Post #126
line: Post #127
line: Post #128
line: Post #129
line: Post #212
line: Post #312
line: Post #412
log: PostList rendered: | PostList.jsx:7
log: PostList rendered: | PostList.jsx:7
log: PostList rendered: 1 | PostList.jsx:7
log: PostList rendered: 1 | PostList.jsx:7
log: PostList rendered: 12 | PostList.jsx:7
log: PostList rendered: 12 | PostList.jsx:7
```

```tree dir=right caption="With one query, the typed letter and the slow list share one render, so the letter waits for the list."
The user types `1` in the search field
- +1. Urgent update [`setQuery`] | `query` becomes `'1'`
- !2. One render for both | React renders **176 slow posts** | The field **still looks empty**
- +3. Commit | The field shows **`1`** and the list shows **176 posts** **at the same moment**
```

### The Real Mistake: Blaming the Filter

Observing an input field freeze over a filtered list often leads developers to a mistaken conclusion:
1. A developer assumes the array `filter` operation causes the lag, attempting to optimize it with `useMemo`, as explored in Lesson 56.
2. Typing latency remains unchanged. Because `query` changes on every keystroke, `useMemo` invalidates its cache and recalculates the array on every render anyway.
3. Array filtering is computationally cheap. The true bottleneck is invoking component functions and generating DOM elements for dozens or hundreds of items.

The official React documentation addresses this scenario directly: sometimes re-rendering cannot be skipped because the UI genuinely requires updating. The list must update; what we can control is how and when that update executes relative to user input.

Remember: binding both the input element and the slow list to a single state variable forces typed characters to wait for the entire list render.

---

## PRINCIPLE | `useTransition`: one keystroke makes an urgent update for the field and a Transition for the list

> [!PRINCIPLE]
> **Principle 2: Two State Variables: `useTransition` Splits One Keystroke into an Urgent Update and a Transition**
>
> *Call `useTransition` at the top level of the component to obtain `isPending` and `startTransition`. Keep the input setter urgent, and update a secondary state variable `searchQuery` inside `startTransition`.*
>
> Text inputs require immediate visual feedback, so their state must update synchronously. List updates can tolerate slight delays, making them ideal for background processing via a Transition. Splitting a single keystroke across two state variables allows React to schedule the updates at separate priorities.
>
> **DO THIS:**
> ```jsx
> function handleChange(e) {
>   const text = e.target.value;
>   setQuery(text);
>   ~startTransition~(() => { // Only the state of the list is a Transition
>     setSearchQuery(text);
>   });
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleChange(e) {
>   ~startTransition~(() => { // **WRONG:** the state that controls the field is now a Transition
>     setQuery(e.target.value);
>   });
> }
> ```

### `useTransition`: Standalone `startTransition` Augmented with `isPending`

In Lesson 66, we imported `startTransition` directly from the `react` package to schedule non-urgent updates. The `useTransition` Hook provides that identical scheduling mechanism while adding a reactive pending state.

> [!DEFINITION]
> **useTransition.** [NEW] `useTransition` is a React Hook designed to manage concurrent state updates in the background.
> 1. You invoke `useTransition` at the top level of a component with no arguments, following standard Hook rules (Lesson 38).
> 2. It returns a tuple containing exactly two elements: a boolean `isPending` flag and a `startTransition` function.
> 3. Calling `startTransition` wraps state setter calls, instructing React to compute their renders concurrently without blocking high-priority user interactions (Lesson 67).

```jsx title="Calling useTransition at the top level of SearchPage"
const [~isPending~, ~startTransition~] = useTransition(); // React returns the two items in this order
```

The returned `isPending` boolean signals when background rendering is active, a capability we leverage in Principle 5.

The `startTransition` function returned by the Hook performs the same concurrent scheduling as the standalone function imported in Lesson 66. As the React documentation explains, the standalone function behaves similarly to `useTransition` but omits the `isPending` indicator. When a component needs to reflect transition progress in its markup, the Hook is required.

```tree caption="startTransition from useTransition and startTransition imported from react: the same job, but only the Hook gives isPending."
Two places to get `startTransition`
- +From the Hook [`useTransition`] | Marks the updates inside it as a **Transition** | Also gives **`isPending`** | Only **inside a component**
- +Imported from `react` | **Same job**: marks the updates as a **Transition** | ~Gives **no `isPending`** | Works **anywhere**, such as a data library
```

### Why the State of the Field Must Stay Outside the Transition

A common misconception is assuming that wrapping the input state setter inside `startTransition` will eliminate typing lag:

```jsx title="The state of the field inside startTransition" bad="2"
startTransition(() => {
  ~setQuery(e.target.value)~; // **WRONG:** the state that controls the field is now a Transition
});
```

The official React documentation warns against this pattern, noting that Transitions cannot control input state because text inputs must synchronize with user events without delay.

A controlled input displays its bound state variable. If that state setter is deferred inside a Transition, the input cannot update synchronously with the keyboard event. The typed character fails to appear until the background render finishes. Typing rapidly can cause intermediate characters to be dropped, leaving the input field desynchronized from user intent.

This necessity explains why a single keystroke requires two state variables. The text input and the filtered list require the same text string evaluated at different execution priorities. The input requires immediate synchronous feedback, whereas the list can compute asynchronously in the background.

### The Posts Page with `query` and `searchQuery`

To implement priority separation, only the search page component requires modification. We import `useTransition`, declare `searchQuery`, and update both variables inside an event handler:

```jsx title="src/components/SearchPage.jsx" good="6,7,12,13,14,20"
import { useState, ~useTransition~ } from 'react'; // useTransition comes from React, like useState
import PostList from './PostList.jsx';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const text = e.target.value;
    setQuery(text); // Urgent: the field shows the letter
    startTransition(() => {
      ~setSearchQuery(text)~; // Transition: the list follows in the background
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} placeholder="Search posts" />
      <PostList query={~searchQuery~} /> {/* The list now reads searchQuery */}
    </>
  );
}
```

The local constant `text` captures `e.target.value` so both setters receive identical input. The child list component retains its original `query` prop name while receiving the value of `searchQuery`, leaving the list file unchanged for now.

### The Surprise: the Field Still Freezes

**Despite introducing two state variables, the input field still freezes upon typing.** Separating the state updates failed to prevent child component re-execution. Tracing React's evaluation order when typing `1` explains why:
1. Calling `setQuery('1')` triggers an urgent update, while `setSearchQuery('1')` queues a background Transition.
2. React prioritizes the urgent update. The search page component re-renders with `query` set to `'1'`. At this point, `searchQuery` still contains the initial empty string.
3. As established in Lesson 54, whenever a parent component re-renders, React recursively re-renders all child components by default. Because `PostList` is not memoized, it executes with its previous empty query, rendering all 500 slow items.
4. The console logs `PostList rendered: ` with empty text. React finishes evaluating all 500 child components before committing `'1'` to the text input.
5. React then processes the Transition in the background, logging `PostList rendered: 1` and updating the list to 176 items.

```page width=text caption="After the user typed 1, with two state variables and a plain PostList: the top of the 176 matching posts, and a Console that shows the list rendered again with the old empty text."
form:
  field:  | 1
line: Post #1
line: Post #10
line: Post #11
line: Post #12
log: PostList rendered: | PostList.jsx:7
log: PostList rendered: | PostList.jsx:7
log: PostList rendered: | PostList.jsx:7
log: PostList rendered: | PostList.jsx:7
log: PostList rendered: 1 | PostList.jsx:7
log: PostList rendered: 1 | PostList.jsx:7
```

Analyzing the console output demonstrates the issue:
- **The first log pair** originates from the initial mount.
- **The second log pair** reveals the flaw: `PostList` executed all 500 items using the stale query during the urgent render pass, blocking the text input.
- **The third log pair** represents the subsequent Transition execution.

A Transition controls when its wrapped state change computes. It does not prevent a parent component render from executing unmemoized child components. Principle 3 resolves this obstacle.

---

## PRINCIPLE | `memo` on `PostList`: the urgent render skips the slow list

> [!PRINCIPLE]
> **Principle 3: `memo` on the Slow List: The Urgent Update Must Skip `PostList`**
>
> *Wrap the slow list component in `memo` so that during an urgent parent render, React skips list execution while `searchQuery` remains unchanged.*
>
> Each keystroke re-renders the parent search page, which normally cascades to all children. An unmemoized list re-renders on every keystroke, keeping the input frozen. Wrapping the list in `memo` allows React to verify that incoming props have not changed, skipping component execution during the urgent pass and isolating slow work inside the Transition.
>
> **DO THIS:**
> ```jsx
> const PostList = ~memo~(function PostList({ query }) { // Skipped while query holds the old text
>   const results = posts.filter(title => title.includes(query));
>   return <ul>{results.map(title => <SlowPost key={title} title={title} />)}</ul>;
> });
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ~PostList~({ query }) { // **WRONG:** renders all its slow posts on every keystroke, so the field still freezes
>   const results = posts.filter(title => title.includes(query));
>   return <ul>{results.map(title => <SlowPost key={title} title={title} />)}</ul>;
> }
> ```

### VS | A Plain `PostList` vs. a `PostList` Wrapped in `memo`: only the wrapped list skips the urgent render

Principle 2 illustrated a fundamental React behavior: re-rendering a parent component re-renders its children by default. Wrapping an update inside `startTransition` does not override this behavior.

As demonstrated in Lesson 55, wrapping a component in `memo` instructs React to compare incoming props with previous props using `Object.is`. During the urgent update pass, `searchQuery` retains its previous value, meaning the list props remain strictly unchanged.

Comparing the two component declarations highlights the difference:

```jsx title="A plain PostList vs. a PostList wrapped in memo"
function PostList({ query }) { ... } // Renders again every time SearchPage renders
const PostList = ~memo~(function PostList({ query }) { ... }); // Skips the render when query is the same as last time
```

While both implementations display identical markup once settled, their execution behavior during urgent parent re-renders diverges sharply:
- **The standard component** re-executes its expensive rendering logic during the urgent pass, stalling the text input.
- **The memoized component** is skipped by React because its props have not changed, allowing the urgent render to finish in milliseconds.

A Transition schedules when deferred state updates execute. Only component memoization prevents parent renders from evaluating expensive children prematurely.

### The Posts Page with `memo` on `PostList`

To protect the urgent render pass from expensive list execution, we wrap `PostList` in `memo` within its module file:

```jsx title="src/components/PostList.jsx" good="1,8"
import { memo } from 'react';

const posts = [];
for (let i = 1; i <= 500; i++) {
  posts.push('Post #' + i);
}

const PostList = ~memo~(function PostList({ query }) { // Skipped when query did not change
  console.log('PostList rendered:', query);
  const results = posts.filter(title => title.includes(query));
  return (
    <ul>
      {results.map(title => <SlowPost key={title} title={title} />)}
    </ul>
  );
});

function SlowPost({ title }) {
  const startTime = performance.now();
  while (performance.now() - startTime < 1) {} // Waits 1 millisecond for every post
  return <li>{title}</li>;
}

export default PostList;
```

### What Happens When the User Types `1` Now

**With memoization in place, typed characters appear instantly while list filtering proceeds concurrently in the background.** A single keystroke triggers two distinct render passes, with `PostList` participating only in the second:
1. The user types `1` into the input element.
2. **The urgent render pass:** React evaluates the search page component with updated `query` state. Because the search query state remains empty, `PostList` receives unchanged props and is skipped by `memo`. No log entries are emitted.
3. React immediately commits the urgent render to the DOM, displaying `1` in the text field while preserving the existing 500 list items on screen.
4. **The concurrent Transition pass:** React begins rendering the deferred state change in the background. Now `searchQuery` supplies the updated string, prompting `PostList` to evaluate 176 slow posts without blocking the main thread.
5. The console logs `PostList rendered: 1`. Upon completing the background work, React commits the Transition, updating the list display to 176 items.

Temporarily, the text input displays `'1'` while the list continues showing all 500 items. This deliberate lag keeps the user interface responsive during intensive computation:

::: row caption="One keystroke, two commits: the field changes first, and the list follows after the Transition."
::: col title="After the urgent update" tag="field first" tone=good
```page size=mini
form:
  field:  | 1 | good
line: Post #1
line: Post #2
line: Post #3
log: PostList rendered: | PostList.jsx:9
log: PostList rendered: | PostList.jsx:9
```
The field shows `1`. The list still shows all 500 posts, and the Console still holds only the two lines from the page load.
:::
::: col title="After the Transition" tag="list follows" tone=good
```page size=mini
form:
  field:  | 1 | good
line: Post #1
line: Post #10
line: Post #11
log: PostList rendered: | PostList.jsx:9
log: PostList rendered: | PostList.jsx:9
log: PostList rendered: 1 | PostList.jsx:9
log: PostList rendered: 1 | PostList.jsx:9
```
The list now shows the 176 posts that contain `1`.
:::
:::

```tree dir=right caption="With memo, the render for the urgent update skips PostList, and only the Transition renders the slow posts."
The user types `1`
- +1. First render, urgent update [`query`] | `PostList` gets `''` again, so **`memo` skips it** | The field shows **`1` at once**
- +2. Second render, Transition [`searchQuery`] | `PostList` gets `'1'` and renders **176 slow posts in the background**
- +3. Commit of the Transition | The list changes to **176 posts**
```

### The Real Mistake: Concluding That `useTransition` Does Nothing

Failing to pair concurrent transitions with component memoization is one of the most frequent mistakes in React performance tuning:
1. A developer implements `useTransition` and coordinates two state variables exactly as documented.
2. The developer forgets to wrap the downstream list component in `memo`.
3. The interface continues to stutter during typing, leading the developer to assume `useTransition` failed to optimize the application.
4. Inspecting console output exposes the breakdown. On each keystroke, the console logs `PostList rendered:` with the old text because the urgent render cascades down the component tree.

The official React documentation emphasizes that without `memo`, child components re-render during the urgent pass anyway, neutralizing the concurrent optimization.

Remember: a Transition successfully defers heavy rendering only when `memo` shields the child component from the parent component's urgent render pass.

---

## PRINCIPLE | A new keystroke during a Transition: React throws away the unfinished list

> [!PRINCIPLE]
> **Principle 4: Interrupted Transitions: A New Keystroke Drops the Unfinished List**
>
> *React can interrupt an active Transition whenever a new urgent update arrives, discarding stale background calculations to render the latest query state.*
>
> When a user types rapidly, each keystroke triggers an immediate urgent update. If the background render for an earlier keystroke is still processing, React abandons that work and prioritizes rendering the newest input text. Only state setter calls executed synchronously inside the `startTransition` callback receive interruptible scheduling.
>
> **DO THIS:**
> ```jsx
> setQuery(text);
> startTransition(() => {
>   ~setSearchQuery(text)~; // Made during the call: a Transition the next keystroke can interrupt
> });
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> setQuery(text);
> startTransition(() => {
>   setTimeout(() => ~setSearchQuery(text)~, 300); // **WRONG:** runs later, outside the Transition, so it blocks the next keystroke
> });
> ```

### Two Fast Keystrokes, and One List That Never Appears

**When a user types rapidly, React never paints intermediate search results to the screen.** The text input displays `'1'` and then `'12'` without stutter. The list transitions directly from 500 items to 15 items, completely skipping the intermediate 176 items.

The React documentation notes that when multiple updates occur in succession, React throws out unfinished background rendering work and computes only the latest requested state.

The existing implementation from Principle 3 handles this automatically. Examining the sequence when typing `1` followed immediately by `2` reveals how interruption functions:
1. The user types `'1'`, instantly updating the input field as established in Principle 3.
2. React initiates the background Transition, beginning to render the 176 matching posts in memory.
3. The user types `'2'` while background rendering is still active. This incoming keystroke represents an urgent update, preempting the background Transition.
4. React executes and commits the urgent update: the input displays `'12'`. Because the deferred search query has not yet committed, `memo` skips `PostList`, and the list continues displaying the original 500 posts.
5. React discards the abandoned render for `'1'` and begins a fresh Transition render for `'12'`, evaluating 15 posts.
6. React commits the finished Transition, updating the displayed list directly from 500 items to 15 items.

::: row caption="The user types 1, then 2, before the list for 1 is ready: the field answers each keystroke, and the list jumps from 500 posts to 15."
::: col title="After the user types 2" tag="field first" tone=good
```page size=mini
form:
  field:  | 12 | good
line: Post #1
line: Post #2
line: Post #3
```
The field shows `12`. The list still shows all 500 posts.
:::
::: col title="After the Transition for 12" tag="list follows" tone=good
```page size=mini
form:
  field:  | 12 | good
line: Post #12
line: Post #112
line: Post #120
```
The list shows the 15 posts that contain `12`. The list for `1` never appeared.
:::
:::

The browser console may still output `PostList rendered: 1` for the aborted render. That log confirms React initiated component execution in memory, but that virtual DOM tree was discarded before reaching the commit phase.

Because React separates rendering from committing, unfinished concurrent trees never mutate the real DOM. Users are spared from watching stale intermediate renders flash across the screen.

```tree dir=right caption="A new keystroke interrupts the Transition: React handles the keystroke first and renders only the latest text."
The user types `1`, then `2`, quickly
- +1. Urgent update for `1` | The field shows **`1` at once**
- !2. Transition for `1` | 176 posts render in the background | ~**Interrupted** by the next keystroke
- +3. Urgent update for `12` | The field shows **`12` at once**
- +4. Transition for `12` | React renders **only the latest text** | The list shows **15 posts**; the list for `1` **never appears**
```

### VS | A Transition vs. a Debounce: both keep typing smooth, only the Transition can be interrupted

Developers frequently turn to debouncing to smooth search typing: delaying state updates until 300 milliseconds elapse without user input. Although both patterns aim to improve typing responsiveness, their underlying execution models differ fundamentally:
- **Debouncing** delays list updates by an arbitrary duration. Once that timer expires, the resulting render executes synchronously and monopolizes the main thread, blocking subsequent keystrokes.
- **Transitions** start rendering immediately without artificial delays, yielding the main thread whenever new user input arrives.

Debouncing remains the correct technique when managing asynchronous operations outside React rendering, such as throttling network requests to an external API.

### The Real Mistake: Mixing a Delay into the Transition

Attempting to combine a timer delay with concurrent scheduling often leads to nesting `setTimeout` inside `startTransition`:

This pattern fails because `startTransition` marks only those state updates executed synchronously during its callback invocation. Code executed inside a timer runs after the callback finishes, falling outside the transition scope.

Because asynchronous timers escape the transition context, the delayed state update executes as an urgent update, once again blocking keystrokes during list rendering.

Remember: urgent user interactions always take precedence, and React automatically discards abandoned renders to compute the latest state.

---

## PRINCIPLE | `isPending`: fade the old list on a wrapper outside `PostList`

> [!PRINCIPLE]
> **Principle 5: Pending Visual State: `isPending` Fades the Old Results Outside the List**
>
> *The `isPending` flag remains `true` while a Transition computes in the background. Apply this visual state to an external wrapper element rather than passing it into the memoized list.*
>
> While the text input updates instantaneously, list filtering trails behind. Applying a subtle dimming effect indicates to users that fresh results are loading. This visual indicator must reside on a parent container element, because toggling props directly on a memoized component forces it to re-render during the urgent pass.
>
> **DO THIS:**
> ```jsx
> <div style={{ ~opacity: isPending ? 0.7 : 1~ }}> {/* PostList keeps the same props */}
>   <PostList query={searchQuery} />
> </div>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <PostList query={searchQuery} ~isPending={isPending}~ /> {/* **WRONG:** a changed prop on every keystroke, so memo renders all the slow posts */}
> ```

### A Faded List Communicates Background Activity

Recall the interface state following an urgent update in Principle 3. The input field displays `'1'`, while the list continues displaying 500 posts. Without visual feedback, users cannot discern whether the application is processing or ignoring their input.

The `isPending` flag provides the reactive signal needed to communicate this background work.

> [!DEFINITION]
> **isPending and a pending visual state.** [NEW] `isPending` is a boolean provided by `useTransition` that reflects concurrent rendering activity.
> 1. React automatically manages `isPending`, switching it to `true` when `startTransition` begins and returning it to `false` once the final transition commits to the screen.
> 2. A pending visual state provides immediate feedback, such as reducing container opacity, to indicate that newer results are actively being computed.
> 3. Styling an outer container keeps visual indicators decoupled from child component props, protecting memoization boundaries (Lesson 67).

```jsx title="Fading the old list while the Transition is pending"
<div style={{ ~opacity: isPending ? 0.7 : 1~ }}> {/* Faded while the new list renders, full strength after */}
  <PostList query={searchQuery} />
</div>
```

The CSS `opacity` property smoothly adjusts visual transparency. Setting opacity to `0.7` dims the container to signal loading, returning to `1` when the final render commits.

### VS | A Wrapper `<div>` vs. an `isPending` Prop on `PostList`: only the wrapper keeps `memo` working

Passing `isPending` as a direct prop to `PostList` seems intuitive, but doing so immediately dismantles our performance optimization:

```jsx title="The fade on a wrapper div vs. isPending passed into PostList"
<div style={{ opacity: isPending ? 0.7 : 1 }}><PostList query={searchQuery} /></div> {/* The props of PostList stay the same */}
<PostList query={searchQuery} ~isPending={isPending}~ /> {/* PostList gets a changed prop on every keystroke */}
```

While both approaches visually dim the list during transitions, their impact on React component memoization is radically different:
- **Styling an outer wrapper `<div>`** leaves child props untouched. `PostList` receives unchanged props during the urgent pass, allowing `memo` to skip execution completely.
- **Passing `isPending` directly into `PostList`** changes prop values from `false` to `true` during the urgent pass. `memo` detects changed props and executes all slow child rows, reintroducing typing lag.

```tree caption="Where the fade goes decides whether memo can still skip the slow list."
Showing that the list is behind
- +On a wrapper `<div>` in `SearchPage` [`style={{ opacity: isPending ? 0.7 : 1 }}`] | `PostList` gets the **same `query`** | `memo` **skips** the list; the field answers **at once**
- !As a prop of `PostList` [`isPending={isPending}`] | The prop **changes** from `false` to `true` | `memo` **renders** all the slow posts; ~the field **freezes again**
```

Replacing the entire list with a generic loading spinner creates a disorienting visual flicker on every keystroke. The React documentation notes that hiding content containers behind loading spinners disrupts user focus. Dimming the existing list maintains visual continuity while signaling progress.

### The Posts Page with the Faded List

Implementing this pending feedback requires modifying only the search page component, wrapping the list in a container styled via `isPending`:

```jsx title="src/components/SearchPage.jsx" startLine="17" good="4"
  return (
    <>
      <input value={query} onChange={handleChange} placeholder="Search posts" />
      <div style={{ ~opacity: isPending ? 0.7 : 1~ }}> {/* isPending comes from useTransition */}
        <PostList query={searchQuery} />
      </div>
    </>
  );
```

### What Happens When the User Types `1` Now

**The existing list dims the instant typing begins, restoring full opacity when the filtered results commit.** The execution flow proceeds as follows:
1. The user inputs character `'1'`.
2. During the urgent render pass, `isPending` evaluates to `true`. The text field updates to `'1'`, and the container wrapper renders with an opacity of `0.7`.
3. Because `PostList` props remain identical, `memo` skips list component execution during this urgent pass.
4. React renders the background Transition concurrently. During this phase, `searchQuery` supplies the updated string, while `isPending` prepares to reset to false for the final commit.
5. React commits the finished transition, displaying 176 matching posts at full opacity.

If the user types 2 while the transition computes, `isPending` remains true, and the list updates directly from dimmed initial items to filtered final items.

Inspecting the browser DOM reveals standard inline styles reflecting the transition state:

```dom caption="The Elements panel while the Transition is pending: the wrapper div holds opacity 0.7 around the old list."
+ <div style="opacity: 0.7;"> | note: Pending: the old list of 500 posts, faded
    <ul>
      <li>Post #1</li>
      <li>Post #2</li>
      <li>Post #3</li>
    </ul>
  </div>
```

Once the background transition commits, the container wrapper resets to `style="opacity: 1;"`, housing the newly filtered list elements.

Remember: apply `isPending` styling to an external container element to avoid invalidating memoization on downstream components.

---

## All 5 Principles Together

### The Complete Project

Here is the finalized Posts application structure. The entry point file remains untouched, mounting the root component within Strict Mode.

```jsx title="src/App.jsx"
import SearchPage from './components/SearchPage.jsx';

export default function App() {
  return ~<SearchPage />~; // React calls App, then SearchPage
}
```

```jsx title="src/components/SearchPage.jsx"
import { useState, useTransition } from 'react';
import PostList from './PostList.jsx';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, ~startTransition~] = useTransition(); // Principle 2: isPending and startTransition

  function handleChange(e) {
    const text = e.target.value;
    ~setQuery(text)~; // Principle 2: urgent, the field shows the letter at once
    startTransition(() => {
      ~setSearchQuery(text)~; // Principles 2 and 4: a Transition the next keystroke can interrupt
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} placeholder="Search posts" />
      <div style={{ ~opacity: isPending ? 0.7 : 1~ }}> {/* Principle 5: the old list fades while the new one renders */}
        <PostList query={searchQuery} />
      </div>
    </>
  );
}
```

```jsx title="src/components/PostList.jsx"
import { memo } from 'react';

const posts = [];
for (let i = 1; i <= 500; i++) {
  posts.push('Post #' + i);
}

const PostList = ~memo~(function PostList({ query }) { // Principle 3: skipped while query holds the old text
  console.log('PostList rendered:', query);
  const results = posts.filter(title => title.includes(query));
  return (
    <ul>
      {results.map(title => <SlowPost key={title} title={title} />)}
    </ul>
  );
});

function SlowPost({ title }) {
  const startTime = performance.now();
  while (performance.now() - startTime < ~1~) {} // Principle 1: each post waits 1 millisecond
  return <li>{title}</li>;
}

export default PostList;
```

### How React Calls the Components After One Keystroke

On initial page load, React executes the root component, evaluates the search page, and renders all 500 initial post rows. When the user types `'1'`, React executes two distinct render passes, engaging the slow list only during the second:

```tree caption="The order in which React calls the components after the user types 1: the urgent update skips PostList, and the Transition renders it."
`SearchPage` after the user types `1`
- +1. Render for the urgent update | React calls **`SearchPage`** with `query` `'1'` and `searchQuery` `''` | **`PostList` is skipped** by `memo` | The field shows **`1`**; the old list **fades**
- +2. Render for the Transition | React calls **`SearchPage`**, then **`PostList`** with `'1'` | `PostList` calls **176 `SlowPost`** components **in the background** | The list shows **176 posts at full strength**
```

| Aspect | The Habit That Freezes the Field | The React Rule |
| :--- | :--- | :--- |
| **The state** | One `query` for both the field and the slow list, so every letter waits for the list | `query` for the field, and `searchQuery` for the list |
| **The Transition** | Wrapping the field's own `setQuery` in `startTransition` | `setQuery` stays urgent; only `setSearchQuery` goes inside `startTransition` |
| **The list** | A plain `PostList`, which renders its slow posts on every keystroke | `PostList` wrapped in `memo`, so the urgent update skips it |
| **Fast typing** | Expecting a finished list for every letter, or adding a fixed delay | React drops the unfinished list and renders only the latest text |
| **The sign** | Passing `isPending` into `PostList`, or hiding the list behind `Loading...` | Fading the old list on a wrapper `<div>` outside `PostList` |

Remember the foundational principle of this lesson: **The text input must respond immediately, while the filtered list can settle moments later.**

---

## For the Interview

> **The Interview Question:** How do you keep typing responsive while a big re-render runs with useTransition?

### How to Answer Clearly in 30 Seconds

"When one state variable coordinates a text input and a heavy list, every keystroke triggers an urgent render pass. This blocks user input until the entire list renders. Using `useTransition`, we split that keystroke into two updates with differing priorities. The input state setter remains urgent to update the text synchronously, while a secondary state setter runs inside `startTransition` to compute list filtering in the background. Three architectural rules make this work:
1. **Memoize the list component:** Wrapping the list in `memo` ensures it is skipped during the parent component's urgent render pass.
2. **Leverage concurrent interruption:** If the user types subsequent characters, React discards stale background calculations and processes only the latest query.
3. **Isolate pending indicators:** The `isPending` flag allows dimming the existing list, but this visual state must be placed on an outer wrapper to preserve the memoization of the list."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why can't you put the input's own state inside `startTransition`?"**
   Because controlled form inputs require immediate synchronous updates to keep the DOM element synchronized with user keystrokes. Deferring input state inside a Transition causes typing lag and dropped characters. Maintaining two distinct variables lets `query` update the input synchronously while `searchQuery` filters the list in the background. When search text arrives as an external prop without a local setter, `useDeferredValue` serves this purpose (as seen in Lesson 68).
2. **"Does `useTransition` make the list render faster? How is it different from debouncing?"**
   No, `useTransition` does not reduce component computation time. It simply prioritizes urgent user events and allows React to discard intermediate renders that are no longer needed. Debouncing delays rendering by a fixed timer, after which synchronous execution still blocks the main thread. A Transition initiates immediately and yields to incoming keystrokes without arbitrary delays. Debouncing remains preferable for off-thread operations such as throttling server API requests.
3. **"Which updates count as a Transition?"**
   Only state updates triggered synchronously during the execution of the `startTransition` callback. Updates scheduled inside asynchronous callbacks like `setTimeout` or following an `await` expression run outside the transition boundary and execute as urgent updates. Form actions and `useActionState` manage asynchronous transitions automatically for form submissions (as seen in Lessons 41 and 42).

```tree dir=right caption="Interview comparison: one state variable for the field and the list vs. two state variables with useTransition."
Typing in a search field that drives a slow list
- !One state variable [`query`] | Every keystroke renders **the whole list** first | The field **freezes** until the list is done
- +Two state variables with `useTransition` [`query` `searchQuery`] | The field updates **at once**; the list renders **in the background** | With **`memo`** on the list and **`isPending`** outside it, typing stays **smooth**
```
