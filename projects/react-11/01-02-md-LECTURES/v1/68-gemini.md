# Lecture 68: How the Old List Stays on Screen While the New One Renders

*(How can one state variable feed the search field at once and the slow list a moment later?)*

> INTERVIEW QUESTION | ❱❱ MORE | What does useDeferredValue defer, and how is it different from a transition?

---

## VS | One `query` for the Field and the List vs. a Deferred `query` for the List: one freezes the typing, the deferred one lets the field go first

> In a search field filtering a heavy list, every character typed by the user must appear on screen immediately, while filtered results can settle a moment later. **`useDeferredValue(query)` provides the slow list with a deferred copy of `query` that lags behind: displaying the previous results first, and the updated results moments later**. The list itself renders no faster, but the input field never waits for it, and the component requires only a single state variable.

In Lesson 67, we saw how a controlled `<input>` element binds directly to state. The browser fires an input event on each keystroke, our event handler updates state, and React re-renders the component. The typed character reaches the screen only after React finishes rendering and commits the new state to the DOM (Lesson 20).

When that same state variable also filters a computationally expensive list, React processes the text field and the entire list in a single render pass. Because JavaScript runs on a single thread, the browser cannot paint the typed character until every slow item finishes rendering. **The keystroke waits for the list.**

Lesson 67 resolved this bottleneck using two state variables and `startTransition`. This lesson achieves the same smooth user experience using a single state variable and one additional Hook call:

```jsx title="One state variable and one Hook"
const [query, setQuery] = useState('');
const deferredQuery = ~useDeferredValue(query)~; // React returns a version of query that lags behind

<input value={~query~} onChange={e => setQuery(e.target.value)} /> {/* The field reads query */}
<PostList query={~deferredQuery~} /> {/* The list reads the deferred version */}
```

Notice the final two JSX lines. The `<input>` element reads `query` directly. The child list component reads `deferredQuery`.

What is `deferredQuery`? At runtime, it is a primitive string, identical in type to `query`. When the page is idle, both variables store the exact same text. Only immediately after a keystroke, during the initial re-render, `deferredQuery` retains its previous value. The official documentation explains that the deferred value will lag behind the latest value.

Every keystroke therefore triggers two coordinated render passes in sequence:

::: row caption="One keystroke by the user: the field changes at once, and the list follows a moment later."
::: col title="Right after the keystroke" tag="field first" tone=good
```page size=mini
form:
  field:  | 1 | good
line: Post #1
line: Post #2
line: Post #3
```
The field shows `1`. The list still shows all 500 posts.
:::
::: col title="A moment later" tag="list follows" tone=good
```page size=mini
form:
  field:  | 1 | good
line: Post #1
line: Post #10
line: Post #11
```
The list now shows the 176 posts whose title contains `1`.
:::
:::

Our code sets no timer and manages no manual delay. React coordinates both render passes automatically. As the official documentation states, React will first re-render without updating the deferred value, and then try to re-render with the newly received value in the background.

Keep one central rule in mind throughout this lesson. **The `<input>` field receives the new text immediately, while the list receives the previous text first and catches up in the background.**

### The Words This Lesson Stands On

> [!DEFINITION]
> **A controlled `<input>` field.** [REVIEW] A controlled input binds its visual value directly to React component state: `<input value={query} onChange={e => setQuery(e.target.value)} />`.
> 1. The component owns the state via `useState` and passes the current string to the input through the `value` prop.
> 2. When the user types, the browser fires an `onChange` event, prompting the event handler to call `setQuery` with the updated string.
> 3. The input field displays only what React state supplies, so the newly typed character appears on screen only after React re-renders and commits the update to the DOM (Lesson 20).

> [!DEFINITION]
> **memo.** [REVIEW] `memo` is a React higher-order component that skips re-rendering a child when its incoming props have not changed: `const PostList = memo(function PostList({ query }) { ... })`.
> 1. When the parent component re-renders, React checks whether each prop passed to the memoized child matches its previous value.
> 2. React compares each prop using `Object.is` shallow equality.
> 3. If all props are identical, React skips executing the child component function entirely and reuses its existing rendered output (Lesson 55).

> [!DEFINITION]
> **A Transition.** [REVIEW] A Transition marks a state update as non-urgent by wrapping its setter call inside `startTransition`.
> 1. Urgent updates, such as typing into a text field, run immediately to keep the user interface responsive.
> 2. A Transition instructs React to render the associated tree in interruptible slices in the background while yielding the main thread to pending browser events.
> 3. If a new user interaction arrives while the background render is underway, React abandons the incomplete work to prioritize the new urgent update first (Lessons 66 and 67).

### VS | `query` vs. `deferredQuery`: the same text, one render apart

Both values originate from the same single state variable. When the page first mounts, both hold an empty string. Once the user pauses typing, both synchronize to the exact same text, such as `12`. Although both variables store identical strings when idle, they serve distinct timing roles during an update:
- **`query`** receives the latest text immediately, ensuring the controlled input element updates without visual lag.
- **`deferredQuery`** retains the previous text during the first render, and then receives the latest text during a subsequent background render.

To defer means to postpone work until later. What does `useDeferredValue` postpone? It never postpones the state update itself. The `query` state updates immediately, and the text input displays the typed character on screen right away.

The Hook defers only the child components that consume the deferred value. The official documentation explains that `useDeferredValue` lets you defer updating a non-critical part of the user interface and let other parts update first.

### What Is at Stake

At stake is the responsiveness of the input field. A text input must react to user keystrokes without perceptible delay. While the new search results are being computed, the user should continue viewing the previous results, without encountering an unresponsive cursor or an artificial empty screen.

Without concurrent scheduling, users experience typing friction from the very first keystroke. As the official documentation notes, typing into the input feels very janky because each keystroke forces the entire list to re-render immediately in a non-interruptible way.

Developers frequently make three common mistakes when using this Hook:
1. **Assuming `useDeferredValue` accelerates rendering.** The Hook does not make slow component calculations faster. Rendering 176 slow list items consumes the exact same computation time. The Hook simply allows the text input to render first.
2. **Assuming the Hook introduces a fixed timer delay.** Unlike a debounce function, the Hook introduces no arbitrary timeout. The official documentation confirms that there is no fixed delay caused by `useDeferredValue` itself.
3. **Omitting `memo` from the slow child component.** When the slow child is unmemoized, it re-renders during the urgent pass anyway, leaving typing just as slow as before. Principle 1 demonstrates why memoization is essential.

### The Rule of Thumb: must the slow part show the newest text at once?

**Ask one architectural question about the heavy section: must it display the newest input immediately? If not, pass `useDeferredValue(text)` to the child component and wrap that child in `memo`. The text input receives the live state value right away, and the heavy section catches up during an interruptible background pass.**

### VS | `useDeferredValue` vs. `useTransition`: the same page, a different thing marked

The primary interview question asks how `useDeferredValue` differs from a Transition. To an end user viewing the browser, the two mechanisms feel identical. In both cases, the input field reflects typing instantly while the filtered list updates smoothly in the background.

The structural difference lies in what each tool marks in your code:
- **A Transition marks a state setter update.** Your code wraps the state setter inside `startTransition`, which requires direct access to that setter function.
- **A deferred value marks a derived value.** Your code passes an existing value to `useDeferredValue`, requiring access only to the value itself.

The official documentation summarizes the practical distinction clearly. You can wrap an update into a Transition only if you have access to the `set` function of that state. If you want to start a Transition in response to some prop or a custom Hook value, try `useDeferredValue` instead. Principle 3 demonstrates this pattern directly.

### Four Ways to Handle Typing over a Slow List

Filtering a heavy list from a search field is a standard production challenge. An experienced engineer chooses among four distinct approaches:
1. **A single state variable paired with `useDeferredValue`.** This is the primary architecture taught in this lesson. It is ideal when maintaining a single state variable, or when filtering based on a prop or a custom Hook return value. The official documentation notes that you can have one state variable, and add `useDeferredValue` which will lag behind the real value.
2. **Two distinct state variables coordinated with `useTransition`.** Taught in Lesson 67, this pattern suits components that own the state setter and require a built-in `isPending` flag. As the official documentation explains, you can declare two separate state variables, updating one urgently and the other inside a Transition.
3. **Isolating independent state in an isolated component.** This architecture applies when the heavy component does not depend on the typed query. Moving input state into an isolated leaf component prevents the rest of the tree from re-rendering on keystrokes. When the heavy section does depend on the query, the documentation recommends `useDeferredValue` to keep the input responsive during heavy re-renders.
4. **Debouncing or throttling with a timer.** These techniques enforce a fixed delay before triggering updates. The official documentation warns that debouncing still produces a janky experience because synchronous renders remain blocking. A timer merely postpones the moment when computation blocks the thread. Debouncing remains valuable for rate-limiting network requests to external servers, but concurrent React provides a superior solution for UI rendering.

```tree caption="Four ways to handle typing over a slow list, and when each one fits."
Typing in a search field that drives a slow list
- +One state variable and `useDeferredValue` [`query` `deferredQuery`] | Fits when there is **one state variable**, or the text **comes from a prop** | Taught in **this lesson**
- +Two state variables and `useTransition` [`query` `searchQuery`] | Fits when **we own the set function** | Gives us **`isPending`**
- +Keep the slow part away from the text | Fits when the slow part **does not need the text** | Only the **small field component** renders again
- !Debouncing or throttling | **Waits a fixed time**, then renders | ~The render **still blocks** the next keystroke
```

## SECTION | A Blog's Posts Page with a Search Field

This lesson deliberately reuses the blog search page introduced in Lesson 67. The visual user interface and interactive behavior remain identical to the previous implementation. Only the internal scheduling mechanism used to coordinate heavy rendering changes.

The user interface presents a text `<input>` element with the placeholder text `Search posts`. Below the input sits a list containing 500 post titles, indexed from `Post #1` to `Post #500`. The list displays only titles containing the current search string. When the input is empty, all 500 items render.

```page width=text caption="The Posts page when it opens: an empty search field and the top of the list of 500 posts."
form:
  field:
line: Post #1
line: Post #2
line: Post #3
line: Post #4
```

Each item simulates heavy computation by executing a synchronous one-millisecond loop during render, matching the benchmarks in Lessons 66 and 67.

Across our walkthrough scenarios, the user types character `1`, followed by `2`:
- With `1`, the list contains 176 posts: every title whose number contains the digit 1.
- With `12`, the list contains 15 posts: post 12, post 112, the ten items from 120 through 129, and posts 212, 312, and 412.

The application entry file mounts the root component inside `<StrictMode>` (Lesson 07), remaining constant throughout our examples:

```files title="posts-page: File Explorer" caption="How the files of the Posts page sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `App` inside `<StrictMode>`; unchanged in this lesson
  App.jsx | parent | Exports `App` as default and renders `<SearchPage />`
  components/
    SearchPage.jsx | state | Holds `query` and renders the search field and the list
    PostList.jsx | list | Builds the 500 titles and exports `PostList`, wrapped in `memo`
    SearchResults.jsx | child | Added in Principle 3: receives `query` as a prop and renders `PostList`
```

We start where standard implementations begin. The search page component holds a single state variable and passes it directly to the list:

```jsx title="src/components/SearchPage.jsx"
import { useState } from 'react';
import PostList from './PostList.jsx';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search posts"
      />
      <PostList query={~query~} /> {/* The list gets the new text on every keystroke */}
    </>
  );
}
```

The list file remains identical to the version from Lesson 67, already wrapped in `memo`:

```jsx title="src/components/PostList.jsx"
import { memo } from 'react';

const posts = [];
for (let i = 1; i <= 500; i++) {
  posts.push('Post #' + i);
}

const PostList = ~memo~(function PostList({ query }) { // Skipped only when query is the same as last time
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
  while (performance.now() - startTime < ~1~) {} // Waits 1 millisecond for every post
  return <li>{title}</li>;
}

export default PostList;
```

**The text input still freezes on every keystroke, even though the list component is wrapped in `memo`.** Memoization skips executing a component only when its incoming props remain identical to its previous render. Because `query` changes with every character typed, `memo` detects a new prop value and re-renders the list every time. The character 1 appears on screen only after all 176 slow post items finish evaluating.

The list must eventually re-render to reflect the query. While we cannot eliminate that computation, we can control when that computation takes place.

**PRINCIPLES:** The `<input>` field receives the new text immediately. The list receives the previous text first and updates in the background. Three architectural principles emerge:
1. **Principle 1: `useDeferredValue` Hands `PostList` the Old `query` First.** On each keystroke, React renders urgently using the previous deferred value, enabling `memo` to skip the list so the input updates immediately. React then performs an interruptible background render with the new query.
2. **Principle 2: `query !== deferredQuery` Fades the Old List.** Because `useDeferredValue` does not provide an `isPending` boolean, our code derives staleness by comparing the live and deferred values, applying a dimming style to an outer container.
3. **Principle 3: `SearchResults` Defers a `query` It Only Receives.** When a child component receives a query string as a prop without access to a state setter, it cannot start a Transition. The child can nonetheless call `useDeferredValue` on the incoming prop.

---

## PRINCIPLE | `useDeferredValue(query)`: the list gets the old text first, so the field answers at once

> [!PRINCIPLE]
> **Principle 1: Deferred Value: `useDeferredValue` Hands `PostList` the Old `query` First**
>
> *When one state variable drives a search field and a slow list, pass the list `useDeferredValue(query)` and keep the list in `memo`; on each keystroke, React first renders with the old value, then renders again in the background with the new one.*
>
> The field must show each letter the moment the user types it, but the list is slow. With the deferred value, the first render gives the list the same text as last time, so `memo` skips it and the field answers at once. The list catches up in the background render. When the user types again, React drops that unfinished work and starts over with the latest text. There is no timer, and the list renders no faster than before.
>
> **DO THIS:**
> ```jsx
> const PostList = ~memo~(function PostList({ query }) { // Skipped in the first render, while query holds the old text
>   const results = posts.filter(title => title.includes(query));
>   return <ul>{results.map(title => <SlowPost key={title} title={title} />)}</ul>;
> });
> <PostList query={deferredQuery} />
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ~PostList~({ query }) { // **WRONG:** without memo, the first render renders every slow post anyway
>   const results = posts.filter(title => title.includes(query));
>   return <ul>{results.map(title => <SlowPost key={title} title={title} />)}</ul>;
> }
> <PostList query={deferredQuery} />
> ```

### One Line Added, One Prop Changed

Consider what you would implement manually. You would preserve the previous string in temporary storage. You would allow the input element to paint the new character right away, while handing the previous string to the list. Once the typed letter is painted on screen, you would supply the updated string to the list. Calling `useDeferredValue` automates this exact two-phase sequence:

```jsx title="Passing query vs. passing deferredQuery to the list"
const deferredQuery = ~useDeferredValue(query)~; // The one line we add

<PostList ~query={query}~ /> {/* Before: the list gets the new text on every keystroke */}
<PostList ~query={deferredQuery}~ /> {/* After: the old text first, the new text in the background */}
```

> [!DEFINITION]
> **useDeferredValue and a deferred value.** [NEW] `useDeferredValue` is a built-in React Hook that defers updating a non-critical portion of the component tree: `const deferredQuery = useDeferredValue(query)`.
> 1. You import the Hook from `'react'` and invoke it at the top level of your component function (Lesson 38).
> 2. You pass the live value you wish to defer, and the Hook returns a deferred version of that value.
> 3. During the initial urgent render after a state change, the Hook returns the previous value, allowing memoized children to skip rendering while the input updates on screen.
> 4. React then automatically schedules an interruptible background render where the Hook returns the updated value, allowing the deferred components to catch up (Lesson 68).

On each keystroke, React coordinates two distinct render passes for the search page component:
1. **The urgent first render** runs immediately upon keystroke. During this pass, `query` holds the latest typed string, while `deferredQuery` still yields the previous string.
2. **The background render** begins as soon as the urgent pass commits to the screen. During this pass, `deferredQuery` updates to the new string. React schedules this pass automatically without custom application code.

Now examine the difference between the two prop patterns:
- **With `query={query}`**, the list receives a new prop value on every keystroke. Because the incoming prop differs, `memo` cannot skip the component. The typed letter in the input waits while 176 slow posts calculate synchronously.
- **With `query={deferredQuery}`**, the list receives its previous prop value during the first pass. Because the prop is identical under `Object.is`, `memo` skips evaluating the list, allowing the input to paint instantly. The 176 slow posts calculate only during the background render.

```tree dir=right caption="One keystroke makes two renders, and only the second one renders the slow list."
The user types `1`
- +1. First render [`deferredQuery`] | `query` is **`'1'`**; `deferredQuery` is still **`''`** | **`memo` skips** the list; the field shows **`1` at once**
- +2. Background render | `deferredQuery` becomes **`'1'`** | `PostList` renders **176 slow posts**; the list **catches up**
```

### The Posts Page with `deferredQuery`

Only the search page component file requires modification:

```jsx title="src/components/SearchPage.jsx" good="1,6,15"
import { useState, ~useDeferredValue~ } from 'react'; // useDeferredValue comes from React, like useState
import PostList from './PostList.jsx';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = ~useDeferredValue(query)~; // The old text in the first render, the new text in the background

  return (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search posts"
      />
      <PostList query={~deferredQuery~} /> {/* The list reads the deferred value */}
    </>
  );
}
```

The list file requires no changes because the list component is already wrapped in `memo`.

### What Happens When the User Types `1`

**A single user keystroke produces two distinct render phases, and the slow list executes only during the second phase.** Here is the runtime sequence:
1. The user types `1` into the input. The browser fires an input event, and our `onChange` handler calls `setQuery('1')`.
2. **The urgent first render:** React executes the search page component with the updated state in `query`. Crucially, `useDeferredValue(query)` returns the previous empty string.
3. The memoized list component receives the empty string prop. Because this matches its previous prop value under `Object.is`, `memo` skips the component function entirely. No new log entry appears in the developer console.
4. React commits the urgent render to the DOM: the input field displays `1`, while the list continues showing all 500 initial posts.
5. **The background render:** immediately after the urgent render paints on screen, React re-renders the component tree in the background. Now `useDeferredValue(query)` yields `'1'`. The list component receives the new string and evaluates 176 slow items, logging `PostList rendered: 1`.
6. React commits the completed background render to the DOM: the list updates to display the 176 filtered posts.

The React team described step 5 when launching concurrent rendering: React will attempt the deferred render right after the first render is reflected on the screen.

Because our project runs inside `<StrictMode>`, console messages appear twice during development renders (Lesson 47). The initial pair reflects the mount render with empty query state:

::: row caption="One keystroke, two commits: the first render skips the list, and the background render renders it."
::: col title="After the first render" tag="field first" tone=good
```page size=mini
form:
  field:  | 1 | good
line: Post #1
line: Post #2
line: Post #3
log: PostList rendered: | PostList.jsx:9
log: PostList rendered: | PostList.jsx:9
```
The field shows `1`. The list still shows all 500 posts, and the Console holds only the two lines from the page load.
:::
::: col title="After the background render" tag="list follows" tone=good
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

### Typing Fast: the List for `1` Never Appears

**When the user types `2` before the list for `1` finishes rendering, React discards that background render and transitions directly to `12`.** The text input reflects `1` followed immediately by `12` without delay. The displayed list transitions directly from 500 posts to 15 posts.

Here is the exact runtime sequence when the user types `2` while the 176 items for `1` are still calculating in the background:
1. The new keystroke interrupts the background render. The official documentation confirms that the background re-render is interruptible: if another update to the value occurs, React restarts the background re-render from scratch.
2. React prioritizes the urgent keystroke. In this new urgent pass, `query` updates to `'12'`.
3. At this moment, `deferredQuery` still evaluates to the empty string rather than `'1'`. Because the background render for `'1'` was discarded before commit, the last committed deferred value remains the empty string. Consequently, `memo` skips the list component again.
4. React commits the urgent pass: the text field displays `12`, while the screen still presents all 500 original posts.
5. React initiates a fresh background render using the latest value `'12'`, filtering the list down to 15 matching items. The documentation confirms that React will always use the latest provided value.
6. React commits the new background render: the visible list transitions directly from 500 posts to 15 posts.

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
::: col title="After the background render for 12" tag="list follows" tone=good
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

The console may still print `PostList rendered: 1` if React began evaluating items before discarding the pass. That log entry indicates only that execution started; nothing reaches the browser DOM until a render pass commits (Lesson 66).

If the user continues typing faster than the list can calculate, background renders are repeatedly restarted, and the list updates only after typing pauses. The official documentation notes that an intensive visualization will only re-render after the user stops typing.

### VS | A Deferred Value vs. a Debounce: no timer, and the next keystroke can interrupt

Developers observing the delayed list often assume a timer is running behind the scenes. There is no timer. A single keystroke triggers two render passes, and the background pass begins immediately once the urgent pass paints. The official documentation notes that as soon as React finishes the original re-render, React immediately starts working on the background re-render with the new deferred value.

In traditional JavaScript codebases, developers reach for debouncing: wrapping state updates inside `setTimeout` until keystrokes pause. While both techniques keep typing responsive, their underlying mechanics are entirely different:
- **With a debounce timer**, the list update waits an arbitrary delay, such as 300 milliseconds. When the timer fires, the resulting render executes synchronously, blocking the main thread and freezing any subsequent keystroke.
- **With a deferred value**, the background render begins immediately, and any incoming keystroke cleanly interrupts that work. The official documentation emphasizes that unlike debouncing or throttling, it does not require choosing any fixed delay.

The scheduling pace also adapts dynamically to client hardware. On a high-performance machine, the background render completes almost instantaneously with no perceptible lag. On a constrained mobile device, the deferred list yields execution time to keep typing fluid.

### The Page Does Not Defer When It Opens

When the page first mounts, the search page component renders for the very first time. Because no previous state exists in memory, React has no prior content to display as a placeholder. The component therefore renders all 500 slow posts once during initial mount.

The official documentation explains the initial behavior: `useDeferredValue` will not defer during initial render because there is no previous version of value that it can render instead.

The term option refers to an optional second argument, `initialValue`, introduced in React 19:

```jsx title="The second parameter of useDeferredValue"
const deferredQuery = useDeferredValue(query, ~''~); // The initial render uses '', then React renders again in the background with query
```

When an initial value is supplied, the Hook returns that initial value during mount and schedules an immediate background render with the actual live value. On our search page this changes nothing, because `query` already initializes to an empty string.

### The Real Mistake: a Deferred Value with a Plain `PostList`

This common architectural mistake leads developers to believe the Hook is broken:
1. A developer reads that `useDeferredValue` keeps input typing smooth.
2. The developer calls `useDeferredValue` in the parent and passes the deferred string to the child list.
3. The developer forgets to wrap the child list component in `memo`.
4. During the urgent first pass, the parent re-renders with new query state. By default in React, re-rendering a parent re-renders all of its children, even when their incoming props have not changed (Lesson 54).
5. The unmemoized list evaluates all 500 slow items during the urgent pass anyway, blocking the main thread and freezing the text input.

The official documentation highlights this requirement: without `memo`, the child component must re-render anyway, defeating the purpose of the optimization.

The two tools form an interdependent pair. The deferred value maintains identical prop values during the urgent pass, and `memo` transforms those identical props into a skipped render.

Remember: the list receives the previous text first, and `memo` ensures that processing the previous text costs nothing.

---

## PRINCIPLE | `query !== deferredQuery`: true exactly while the list still shows the old results

> [!PRINCIPLE]
> **Principle 2: Stale Content: `query !== deferredQuery` Fades the Old List**
>
> *`useDeferredValue` gives no `isPending`; compare the two values with `const isStale = query !== deferredQuery;`, and fade a wrapper around the memoized list with `opacity: isStale ? 0.5 : 1`.*
>
> Right after a keystroke, the field shows the new text, and the list still shows the old results. Without a sign, the user may think the search is broken. The list is behind exactly when `query` and `deferredQuery` differ, so the comparison is the sign. It must sit outside `PostList`, because `isStale` changes in the first render, and any changed prop makes `memo` render the slow list again.
>
> **DO THIS:**
> ```jsx
> <div style={{ ~opacity: isStale ? 0.5 : 1~ }}> {/* PostList keeps the same props */}
>   <PostList query={deferredQuery} />
> </div>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <PostList query={deferredQuery} ~isStale={isStale}~ /> {/* **WRONG:** a changed prop in the first render, so memo renders all the slow posts */}
> ```

### The Two Values Already Tell Us the List Is Behind

Return to the moment immediately following the urgent first render. The text input displays `1`, while the list still presents all 500 initial posts. Without a visual indicator, the user might assume the search filter failed to execute.

When using `useTransition`, the returned `isPending` boolean supplied that visual signal (Lesson 67). In contrast, `useDeferredValue` returns only the deferred value itself. It provides no built-in pending flag.

However, a dedicated Hook flag is unnecessary. Ask yourself: when are the displayed results behind? Exactly when the current input text differs from the string passed to the list. The comparison itself provides the indicator:

```jsx title="Fading the old list while the two values differ"
const isStale = ~query !== deferredQuery~; // true while the list shows results for older text

<div style={{ ~opacity: isStale ? 0.5 : 1~ }}> {/* Faded while the list is behind, full strength after */}
  <PostList query={deferredQuery} />
</div>
```

> [!DEFINITION]
> **Stale content and isStale.** [NEW] Stale content refers to rendered user interface elements that reflect previous state while an updated render is computing in the background.
> 1. When a user enters new input, the active screen shows existing results until the background render finishes.
> 2. To avoid confusing the user, applications provide visual feedback indicating that displayed content does not yet match the current input.
> 3. `isStale` is a plain boolean variable calculated in our own component logic by checking `query !== deferredQuery`. React provides no dedicated Hook flag for this state (Lesson 68).

The inequality operator `!==` yields `true` whenever the two strings differ. During the urgent first pass, `isStale` evaluates to `true`. Once the background render completes and commits, both variables match, returning `isStale` to `false`.

The CSS property `opacity` controls visual transparency. An opacity of `0.5` renders the element semi-transparent, while `1` renders it at full visual weight. The official documentation uses `0.5` in its stale indicator examples.

### VS | `isPending` vs. `isStale`: React gives one, our code works out the other

Both variables convey the same message to the user interface: the list is catching up in the background. Although their visual purpose is identical, their origins differ:

```jsx title="The sign from useTransition vs. the sign from useDeferredValue"
const [~isPending~, startTransition] = useTransition(); // React gives the flag
const ~isStale~ = query !== deferredQuery; // Our code works it out from two values it already has
```

- **`isPending`** is provided directly by React as part of the tuple returned by `useTransition`.
- **`isStale`** is computed locally by our own component by comparing two variables already in scope.

### The Posts Page with the Faded List

Only the search page component file requires updating:

```jsx title="src/components/SearchPage.jsx" good="7,16"
import { useState, useDeferredValue } from 'react';
import PostList from './PostList.jsx';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const isStale = ~query !== deferredQuery~; // Our own variable: true while the list is behind

  return (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search posts"
      />
      <div style={{ ~opacity: isStale ? 0.5 : 1~ }}> {/* The fade sits outside PostList */}
        <PostList query={deferredQuery} />
      </div>
    </>
  );
}
```

The list file remains unchanged.

### What Happens When the User Types `1` Now

**The previous list dims in the exact moment the character `1` appears in the input, and the new list appears at full opacity.** Here is the runtime sequence:
1. The user types `1`.
2. In the urgent first render, the query state holds '1' while the deferred query remains an empty string, causing `isStale` to evaluate to true. The container `<div>` receives an inline style of `opacity: 0.5`.
3. The memoized list component receives the unchanged empty string, allowing `memo` to skip re-rendering.
4. React commits the urgent render: the input displays `1`, and the existing 500 items appear visibly dimmed.
5. In the subsequent background render, `deferredQuery` catches up to `'1'`. Both variables match, so `isStale` becomes `false`. The list component renders the 176 matching posts.
6. React commits the background render: the 176 filtered items appear at full opacity.

If the user types 2 during step 5, `query` updates to '12' while the deferred value remains empty. The list remains dimmed until the 15 matching items finish computing. The official documentation notes that as soon as you start typing, the stale result list gets slightly dimmed until the new result list loads.

The Elements panel reveals the dimming effect as an inline style on the container element:

```dom caption="The Elements panel right after the user typed 1: the wrapper div holds opacity 0.5 around the old list."
+ <div style="opacity: 0.5;"> | note: Stale: the old list of 500 posts, faded
    <ul>
      <li>Post #1</li>
      <li>Post #2</li>
      <li>Post #3</li>
    </ul>
  </div>
```

When the background render commits, that same container updates to `style="opacity: 1;"`, and the child list displays the 176 filtered items.

### VS | A Wrapper `<div>` vs. an `isStale` Prop on `PostList`: only the wrapper keeps `memo` working

Passing the staleness indicator directly into the list component feels intuitive, but doing so reintroduces the typing freeze:

```jsx title="The fade on a wrapper div vs. isStale passed into PostList"
<div style={{ opacity: isStale ? 0.5 : 1 }}><PostList query={deferredQuery} /></div> {/* The props of PostList stay the same */}
<PostList query={deferredQuery} ~isStale={isStale}~ /> {/* PostList gets a changed prop in the first render */}
```

Both patterns apply visual dimming, but their impact on memoization is completely different:
- **Placing opacity on an outer wrapper `<div>`** keeps the props of `PostList` strictly identical during the urgent pass. `memo` skips the component, ensuring the input updates immediately.
- **Passing `isStale` as a prop to `PostList`** changes that prop from `false` to `true` during the urgent first pass. `memo` detects a changed prop and re-renders all 500 slow items immediately, freezing the input.

This mirrors the pitfall of passing `isPending` into the memoized list in Lesson 67. The solution is identical: manage the dimming style in the parent on a container wrapping the memoized child.

```tree caption="Where the fade goes decides whether memo can still skip the slow list."
Showing that the list is behind
- +On a wrapper `<div>` in `SearchPage` [`opacity`] | `PostList` gets the **same `query`** | `memo` **skips** the list; the field answers **at once**
- !As a prop of `PostList` [`isStale={isStale}`] | The prop **changes** from `false` to `true` | `memo` **renders** all the slow posts; ~the field **freezes again**
```

### A Short Wait Before the Fade

On modern hardware, the background render often completes in a few milliseconds. Having the list flash transparent on every single keystroke can distract users. The official documentation suggests using CSS transitions to delay dimming so that visual feedback feels gradual:

```jsx title="Delaying the fade with the CSS transition property"
<div style={{
  opacity: isStale ? 0.5 : 1,
  ~transition: isStale ? 'opacity 0.2s 0.2s linear' : 'opacity 0s 0s linear'~ // Fades after a short wait, returns at once
}}>
  <PostList query={deferredQuery} />
</div>
```

The CSS `transition` property is a native browser styling rule. It shares a name with React Transitions but operates entirely at the browser layout layer.

Remember: content is stale exactly when the live and deferred strings differ, and the dimming style must be placed on a wrapper outside the memoized child.

---

## PRINCIPLE | `useDeferredValue` in a child: it defers a `query` it only receives

> [!PRINCIPLE]
> **Principle 3: Deferring a Prop: `SearchResults` Defers a `query` It Only Receives**
>
> *A Transition needs the set function of the state; when a component only receives the text, as a prop or from a custom Hook, call `useDeferredValue` on the value it receives and pass the deferred value to the memoized list.*
>
> `useTransition` and `useDeferredValue` give the user the same page: the field at once, the list a moment later. They differ in what they mark. A Transition marks a state update, so the code must hold the set function. A deferred value marks a value, so it works in a child that only receives `query`. Defer strings and numbers, not an object built during rendering.
>
> **DO THIS:**
> ```jsx
> function SearchResults({ query }) {
>   const deferredQuery = ~useDeferredValue(query)~; // Works on a value the component only receives
>   return <PostList query={deferredQuery} />;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function SearchResults({ query, sort }) {
>   const deferred = useDeferredValue(~{ query, sort }~); // **WRONG:** a new object on every render causes a background render every time
>   return <PostList query={deferred.query} />;
> }
> ```

### A Component That Has the Text, but Not the Set Function

In production architectures, state ownership is frequently separated from child rendering. A parent component manages the search field and holds state, while a child component receives the search string as a prop to render results (Lesson 24). Here is that child component:

```jsx title="A child that defers the text it receives"
function SearchResults({ ~query~ }) { // query arrives as a prop; there is no setQuery here
  const deferredQuery = ~useDeferredValue(query)~; // The child can still defer the value
  return <PostList query={deferredQuery} />;
}
```

The child component receives no `setQuery` function. It cannot wrap the state update inside `startTransition`, because the state setter belongs to the parent. However, the child can call `useDeferredValue` directly on the incoming prop value.

The same architectural pattern applies when consuming custom Hooks that expose read-only state values (Lesson 39). Your component receives the value without access to the internal updater function.

### VS | `useTransition` vs. `useDeferredValue`: it marks the update vs. it marks the value

Both Hooks share core concurrent capabilities:
1. Both keep input typing urgent and responsive.
2. Both render the computationally heavy list in an interruptible background pass.
3. Both discard unfinished background renders when a new keystroke arrives.
4. Both require wrapping the heavy child component in `memo`.

To the end user, both approaches produce the exact same responsive behavior. The difference lies in what each Hook marks:

```jsx title="Marking a state update vs. marking a value"
startTransition(() => { ~setSearchQuery(text)~; }); // useTransition marks the update, so it needs the set function
const deferredQuery = ~useDeferredValue(query)~; // useDeferredValue marks the value, so it needs only the value
```

The official documentation clarifies the distinction on its Hook reference page. `useTransition` lets you mark a state transition as non-blocking and allow other updates to interrupt it. Meanwhile, `useDeferredValue` lets you defer updating a non-critical part of the user interface and let other parts update first.

In short: a Transition initiates at the site where state is set. A deferred value is created where the value is consumed, even in components that have no access to the state setter.

| Aspect | With `useTransition` | With `useDeferredValue` |
| :--- | :--- | :--- |
| **What it marks** | A state update, inside `startTransition` | A value, passed to `useDeferredValue` |
| **What it needs** | The set function of the state | Only the value |
| **State variables on our page** | Two: `query` and `searchQuery` | One: `query` |
| **The sign that the list is behind** | `isPending`, given by React | `query !== deferredQuery`, worked out by our code |
| **What the user sees** | The field at once, the list a moment later | The same |

### The Posts Page with `SearchResults`

The search page component retains `query` and renders the input, delegating results to a child component:

```jsx title="src/components/SearchPage.jsx" good="2,14"
import { useState } from 'react';
import SearchResults from './SearchResults.jsx';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search posts"
      />
      <SearchResults query={~query~} /> {/* The child gets the text, not setQuery */}
    </>
  );
}
```

The new results component manages the Hook, computes `isStale`, and renders the container wrapper:

```jsx title="src/components/SearchResults.jsx" good="4,5"
import { useDeferredValue } from 'react';
import PostList from './PostList.jsx';

export default function SearchResults({ ~query~ }) { // A prop from SearchPage
  const deferredQuery = ~useDeferredValue(query)~; // Deferred here, where the value is used
  const isStale = query !== deferredQuery;

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      <PostList query={deferredQuery} />
    </div>
  );
}
```

The list file remains unchanged.

### What Happens When the User Types `1` Now

**The user interface behaves identically to Principle 2, even though the Hook now lives in a child component that never sees `setQuery`.** For the end user, placing the Hook in the child component produces the exact same result. Here is the runtime sequence:
1. The user types `1`. The parent search page re-renders with `'1'` stored in `query`.
2. The child component receives the new prop and executes its component function. This execution is lightweight: it reads two variables and returns a container `<div>`.
3. Inside the child, `useDeferredValue(query)` returns the previous empty string. The derived `isStale` flag evaluates to true, and the memoized list receives the unchanged empty string, allowing `memo` to skip execution.
4. React commits the urgent render: the text input displays `1`, and the container dims to reflect stale content.
5. In the subsequent background render, `deferredQuery` updates to `'1'`. The list component renders the 176 matching items, the dimming effect clears, and the console logs `PostList rendered: 1`.

### The Real Mistake: Deferring an Object Built During Rendering

This subtle bug appears when a child component consumes multiple filter props:
1. The child component receives a search query and a sort order. Attempting to defer both at once, a developer creates a compound object inline: `useDeferredValue({ query, sort })`.
2. The Hook compares each incoming value against the previous value using `Object.is` equality, the same comparison used by `memo` (Lesson 55). In JavaScript, object literals created during render evaluate to new memory references on every execution, even when their properties are identical.
3. Because the object reference changes on every pass, the Hook detects an ostensibly new value on every render, triggering an unnecessary background re-render every time. The official documentation warns that creating a new object during rendering and immediately passing it to `useDeferredValue` causes unnecessary background re-renders.
4. The solution is to pass primitive values like strings and numbers directly to separate Hook calls, or pass memoized objects created outside render.

```jsx title="One object built during rendering vs. one call for each string"
const deferred = useDeferredValue(~{ query, sort }~); // **WRONG:** a new object on every render, so a background render every time
const deferredQuery = ~useDeferredValue(query)~; // A string: compared by its text
const deferredSort = ~useDeferredValue(sort)~; // A string: compared by its text
```

### Where Each One Fits

Three core guidelines help determine when to use each concurrent primitive:
1. **Inside a Transition, deferred values provide no additional benefit.** The official documentation notes that inside a Transition, `useDeferredValue` always returns the new value immediately. It spawns no deferred render because the update is already deferred.
2. **Distinct architectural scopes.** Transitions mark entire state updates as non-blocking, making them ideal for router navigations and page transitions. Deferred values excel in consumer components where a specific leaf UI widget should lag behind live user input.
3. **Network requests are not throttled.** Calling `useDeferredValue` does not prevent or cancel network requests triggered on keystrokes. The official documentation emphasizes that `useDeferredValue` does not by itself prevent extra network requests; it defers only the rendering of resulting UI elements.

Lesson 69 explores how deferred values interact with Suspense boundaries to maintain existing content on screen during asynchronous data fetching.

Remember: a Transition requires access to the state setter, while a deferred value requires access only to the value itself.

---

## All 3 Principles Together

### The Complete Project

Here is the complete Posts page. The entry file is unchanged and mounts `App` inside `<StrictMode>`.

```jsx title="src/App.jsx"
import SearchPage from './components/SearchPage.jsx';

export default function App() {
  return ~<SearchPage />~; // React calls App, then SearchPage
}
```

```jsx title="src/components/SearchPage.jsx"
import { useState } from 'react';
import SearchResults from './SearchResults.jsx';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  return (
    <>
      <input
        value={query}
        onChange={e => ~setQuery(e.target.value)~} // One state variable: the field shows every letter at once
        placeholder="Search posts"
      />
      <SearchResults query={~query~} /> {/* Principle 3: the child gets the text, not setQuery */}
    </>
  );
}
```

```jsx title="src/components/SearchResults.jsx"
import { useDeferredValue } from 'react';
import PostList from './PostList.jsx';

export default function SearchResults({ query }) {
  const deferredQuery = ~useDeferredValue(query)~; // Principles 1 and 3: the old text first, the new text in the background
  const isStale = ~query !== deferredQuery~; // Principle 2: true while the list is behind

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      <PostList query={deferredQuery} />
    </div>
  );
}
```

```jsx title="src/components/PostList.jsx"
import { memo } from 'react';

const posts = [];
for (let i = 1; i <= 500; i++) {
  posts.push('Post #' + i);
}

const PostList = ~memo~(function PostList({ query }) { // Principle 1: skipped while query holds the old text
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
  while (performance.now() - startTime < 1) {} // Each post waits 1 millisecond
  return <li>{title}</li>;
}

export default PostList;
```

### How React Calls the Components After One Keystroke

On initial mount, React renders the component hierarchy in sequence: calling the root component, the search page, the results container, and finally the list. The list component then evaluates each individual slow post. When the user types `1`, React executes two distinct render passes, with the list participating only in the background pass:

```tree caption="The order in which React calls the components after the user types 1: the first render skips PostList, and the background render renders it."
`SearchPage` after the user types `1`
- +1. First render | React calls **`SearchPage`**, then **`SearchResults`** with `query` `'1'` | `deferredQuery` is still empty, so **`PostList` is skipped** by `memo` | The field shows **`1`**; the old list **fades**
- +2. Background render | React calls **`SearchResults`** with `deferredQuery` `'1'`, then **`PostList`** | `PostList` calls **176 `SlowPost`** components | The list shows **176 posts at full strength**
```

| Aspect | The Habit That Freezes or Confuses | The React Rule |
| :--- | :--- | :--- |
| **The prop of the list** | Passing `query` to the list, so every letter waits for the slow posts | Passing `deferredQuery`, so the first render gives the list the old text |
| **The list itself** | A plain `PostList`, which renders its slow posts in the first render | `PostList` wrapped in `memo`, so the first render skips it |
| **The timing** | Expecting a fixed delay, like a debounce | No timer: the background render starts right after the first one, and a new keystroke starts it again |
| **The sign** | Looking for `isPending`, or passing `isStale` into `PostList` | `query !== deferredQuery`, shown on a wrapper `<div>` outside `PostList` |
| **The text from a prop** | Reaching for `useTransition` without a set function | `useDeferredValue` on the value the component receives |

Remember the core guiding rule of this lesson. **The `<input>` field receives the new text immediately, while the list receives the previous text first and catches up in the background.**

---

## For the Interview

> **The Interview Question:** What does useDeferredValue defer, and how is it different from a transition?

### How to Answer Clearly in 30 Seconds

"`useDeferredValue` accepts a value and returns a deferred copy of that value. On each state update, React executes an urgent render pass with the previous deferred value, followed by an interruptible background pass with the updated value. What it defers is rendering the non-critical child components consuming that deferred value, such as a computationally heavy results list. It does not defer the state update itself, and it does not defer network requests. Three architectural requirements make it work:
1. **Memoization with `memo` on the heavy child**: during the urgent pass, the child receives its previous prop value, allowing `memo` to skip execution so the text input updates immediately.
2. **Interruptible background scheduling without timers**: the background render begins immediately once the urgent pass paints, and subsequent keystrokes restart the background pass using the latest value.
3. **Deriving staleness without `isPending`**: checking `query !== deferredQuery` indicates that displayed content is stale, allowing us to dim a wrapper container outside the memoized list.

The primary difference from a Transition is what each primitive marks. A Transition marks a state update and requires access to the state setter function. A deferred value marks a derived value and operates on values received via props or custom Hooks."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Does `useDeferredValue` make the list render faster? Is it a debounce?"**
   No to both questions. The list takes the exact same computation time to render. The Hook informs React that rendering the list can be deprioritized so that it does not block user input. A debounce function forces a fixed delay before executing, and the eventual render still blocks the main thread. In contrast, `useDeferredValue` introduces no artificial delay: the background pass begins immediately, and subsequent keystrokes interrupt background work. On fast hardware, users perceive no delay at all. Debouncing remains appropriate for rate-limiting network calls, not UI rendering.
2. **"When do you pick `useDeferredValue` over `useTransition`?"**
   Choose `useDeferredValue` when the component rendering the heavy content receives the value as a prop or from a custom Hook without access to a state setter. It also enables responsive typing with a single state variable. Choose `useTransition` when you control the state setter and require the built-in `isPending` boolean flag. When an update already occurs inside a Transition, `useDeferredValue` returns the new value immediately without spawning a deferred render.
3. **"What does the user see while the deferred value lags behind, and when does it not defer?"**
   The user continues viewing previous results until the updated list completes, which we can visually indicate by checking `query !== deferredQuery`. Background renders run no Effects until committed to the DOM (Lesson 32). The Hook does not defer during initial mount because no prior value exists in memory. React 19 introduced an optional `initialValue` parameter for initial rendering. Combined with Suspense, a deferred value keeps existing content visible on screen instead of displaying a fallback spinner, which Lesson 69 covers.

```tree dir=right caption="Interview comparison: a Transition marks a state update, and a deferred value marks a value."
Keeping a search field fast over a slow list
- +`useTransition` [`startTransition` `isPending`] | Marks a **state update** | Needs **the set function**; gives **`isPending`**
- +`useDeferredValue` [`deferredQuery`] | Marks a **value** | Needs **only the value**; works on **a prop or a custom Hook value**
- !Debouncing [`setTimeout`] | **Waits a fixed time** | ~Then the render **still blocks** the keystroke
```
