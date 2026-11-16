# Lecture 69: How a Suspense Boundary Lets the Rest of the Page Paint First

*(How do the fast parts of a page appear at once while one slow part is still loading?)*

> INTERVIEW QUESTION | ❱❱ MORE | How does Suspense display fallbacks, and where should boundaries sit?

---

## VS | A Loading Text Inside the Component vs. a `<Suspense>` Fallback Above It: the component handles its own wait, or the parent decides which parts wait

> A home page often pairs fast content with a slow data widget, such as a weather line whose server requires three seconds to respond. **Wrap only the slow widget inside `<Suspense>`, and provide a fallback prop that React displays until that part is ready**. Everything outside the boundary appears at once, ensuring that one slow data source never blocks the entire page.

In Lesson 33, we saw how components manage loading states internally. A component initiates a fetch inside an Effect, stores the pending result in local state, and renders its own placeholder message while state remains empty:

```jsx title="A loading text inside the component"
function EffectWeather({ city }) {
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    fetchData('/weather/' + city).then(result => setWeather(result));
  }, [city]);
  return <p>{~weather ?? 'Loading...'~}</p>; // The component writes its own loading text
}
```

Every component that loads data this way must manage this lifecycle on its own. Each component controls only its own waiting state.

With `<Suspense>`, the child component reads data directly. The component never writes its own loading indicator. The responsibility for the fallback UI moves upward into the parent tree:

```jsx title="A fallback in the parent, above the component"
function Weather({ city }) {
  const weather = use(fetchData('/weather/' + city));
  return <p>{~weather~}</p>; // Only the weather: no loading text here
}

<Suspense ~fallback={<p>Loading weather...</p>}~> {/* The parent decides what stands in for Weather */}
  <Weather city="London" />
</Suspense>
```

Two functions appear here for the first time. The `use` function from React reads the value of a promise directly during render, as explained in Lesson 71. The helper function `fetchData` simulates an external weather server with an artificial delay.

Both approaches display a loading indicator until the weather data arrives. While the visual output looks similar, the architectural model is fundamentally different. The loading UI now lives above the components in the tree hierarchy. A single boundary can coordinate the waiting state for multiple components at once. Moving that boundary alters which parts of the page wait together, without modifying child component code.

### The Idea Behind It: `try...catch`

JavaScript developers already manage similar control flow with `try...catch` blocks. When an error is thrown deep inside a function call, execution unwinds upward through the call stack until reaching the nearest enclosing `catch` block. That catching block decides what the user sees:

```js title="Plain JavaScript: the closest catch handles the error"
try {
  ~showWeather()~; // Throws deep inside
} catch (error) {
  showMessage('Could not load weather'); // The closest catch above decides what the user sees
}
```

React applies the same principle to asynchronous component rendering. When `Weather` reads a pending promise, React halts rendering for that component. React then traverses upward to the nearest `<Suspense>` boundary, which renders its fallback prop in place of the suspended subtree:

```jsx title="React: the closest Suspense handles the wait"
<Suspense ~fallback={<p>Loading weather...</p>}~> {/* The closest Suspense above decides what the user sees */}
  <Weather city="London" />
</Suspense>
```

Keep one central rule in mind throughout this lesson. **When an unready component suspends, the closest boundary above displays its fallback. Everything inside that boundary waits together, while everything outside paints immediately.**

### The Words This Lesson Stands On

> [!DEFINITION]
> **A loading state in an Effect.** [REVIEW] A component initializes with empty state, such as `useState(null)`, and completes its initial commit. After the commit, an Effect initiates the asynchronous fetch. When data arrives, a state setter prompts React to render the component again with the loaded data. Until that update commits, the component must provide its own placeholder UI (Lesson 33).

> [!DEFINITION]
> **A promise: pending and resolved.** [NEW] A promise is a JavaScript object representing a value that will resolve asynchronously in the future. While the operation is underway, the promise remains in a pending state. Once the operation completes successfully, the promise transitions to resolved and holds the resulting data (Lesson 69).

### What Is at Stake

The official React documentation defines the core purpose in one sentence: `<Suspense>` lets you display a fallback until its children have finished loading.

At stake is user interface responsiveness. A slow data widget must never block the rest of the application. Wrapping an entire layout in one root boundary forces visitors to stare at a generic loading screen for three seconds, even when headlines are ready immediately. Wrapping only the weather line lets readers engage with content while secondary data loads.

Developers frequently make three common mistakes with Suspense:
1. **Placing a single boundary at the top of the app.** The slowest data request delays the entire interface.
2. **Placing a separate boundary around every single component.** The page pops into view through disjointed layout shifts. The official documentation explicitly warns against placing a boundary around every component.
3. **Wrapping an Effect-based fetch inside a boundary.** The boundary never activates, and the fallback never appears. The official documentation confirms that Suspense does not detect data fetched inside an Effect or event handler.

### The Rule of Thumb: which parts may wait together?

**Ask one architectural question about every asynchronous feature: which UI sections should wait together as a single visual unit? Place a boundary around exactly those related elements, leaving all ready content outside.**

### Three Ways to Show a Loading State

In production applications, engineering teams choose between three primary strategies:
1. **A loading text inside each component.** Using `useState` combined with `useEffect`, as shown in Lesson 33. This approach fits situations where data sources lack Suspense integration.
2. **A `<Suspense>` boundary paired with a Suspense-enabled data source.** This is the primary pattern of this lesson. It fits data loaded through `use` with cached promises, code splitting via `lazy` (Lesson 70), or an integrated framework like Next.js.
3. **Retaining existing UI on screen during updates.** Using concurrent Transitions or deferred values, as introduced in Lessons 66 through 68. This strategy prevents jarring loading screens during subsequent navigations. Principle 5 demonstrates this technique.

## SECTION | A City News Home Page

Our example project is the front page of a municipal news website. At the top sits the main heading. Beneath the heading are three headlines. Below the headlines sits a line displaying the weather forecast.

The title and the headlines are available immediately in memory. The weather forecast comes from a separate service that requires three seconds to respond. Here is the page immediately after loading:

```page caption="The home page right after the user opens it: the title and the headlines are there, and the weather is still loading."
heading: City News
line: Main Street park opens today
line: Bus fares drop on Monday
line: Library stays open late
line: Loading weather...
```

Three seconds later, the asynchronous weather data arrives:

```page caption="The same home page 3 seconds later: the weather line shows the weather."
heading: City News
line: Main Street park opens today
line: Bus fares drop on Monday
line: Library stays open late
line: London: 18 degrees, sunny | good
```

The user reads the headlines immediately while the weather loads in the background. Only the weather display waits.

React mounts `App` inside strict mode in the entry file. `App` renders `HomePage`, which coordinates the title, headlines, and the weather boundary:

```files title="city-news: File Explorer" caption="How the files of our city news home page sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | root | Mounts `App` into `#root` inside `<StrictMode>`
  App.jsx | parent | Imports `HomePage` and renders it
  data.js | helper | Exports `fetchData`, our fake server with a 3 second delay
  components/
    HomePage.jsx | parent | Renders the title, `<Headlines />`, and the weather inside `<Suspense>`
    Headlines.jsx | child | Renders the three headlines as a list
    Weather.jsx | child | Reads the weather with `use` and renders one line
```

### `data.js`: one promise per address

The helper file `data.js` simulates the slow remote endpoint. Lesson 71 explores its implementation in detail. Here, two operational rules matter:
1. Calling `fetchData` returns a standard promise. That promise resolves with weather data after three seconds.
2. For any given address, `fetchData` returns the exact same cached promise reference. It stores each promise inside a `Map`, returning the existing instance on subsequent calls.

```js title="src/data.js"
const ~cache~ = new Map(); // One promise per address. Normally, a framework does this for you

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return ~cache.get(url)~; // The same address always gets the same promise
}

const answers = {
  '/weather/London': ['London: 18 degrees, sunny', 3000],
};

async function getData(url) {
  const [value, delay] = answers[url];
  await new Promise(resolve => setTimeout(resolve, delay));
  return value;
}
```

Why is the second rule essential? React calls `Weather` multiple times during rendering. If every render received a new promise instance, each pass would restart a fresh three-second wait, preventing the weather from ever appearing. The official React documentation explains this requirement: caching logic typically resides inside a data-fetching framework.

### The three components

The `Weather` component reads the weather data in its opening line:

```jsx title="src/components/Weather.jsx"
import { use } from 'react';
import { fetchData } from '../data.js';

export default function Weather({ city }) {
  const weather = ~use(fetchData('/weather/' + city))~; // Weather suspends here while the promise is pending
  return <p>{weather}</p>;
}
```

The `Headlines` component reads static entries from a local array, making it ready immediately:

```jsx title="src/components/Headlines.jsx"
const ~headlines~ = ['Main Street park opens today', 'Bus fares drop on Monday', 'Library stays open late']; // A plain array: ready at once

export default function Headlines() {
  return (
    <ul>
      {headlines.map(title => (
        <li key={title}>{title}</li>
      ))}
    </ul>
  );
}
```

The `HomePage` component isolates only the weather component inside `<Suspense>`:

```jsx title="src/components/HomePage.jsx"
import { Suspense } from 'react';
import Headlines from './Headlines.jsx';
import Weather from './Weather.jsx';

export default function HomePage() {
  return (
    <main>
      <h1>City News</h1>
      <Headlines />
      <Suspense ~fallback={<p>Loading weather...</p>}~> {/* Stands in for Weather for 3 seconds */}
        <Weather city="London" />
      </Suspense>
    </main>
  );
}
```

These three files generate the two user views shown above. The following principles demonstrate how adjusting boundary placement and data flows alters what the user sees.

**PRINCIPLES:** When an unready component suspends, the closest boundary above displays its fallback. Everything inside that boundary waits together. Five core principles follow:
1. **Principle 1: The Closest `<Suspense>` Above Shows Its Fallback.** When `Weather` reads a pending promise, it suspends. The nearest enclosing boundary displays its fallback placeholder until the promise resolves. A boundary nested inside `Weather` cannot catch its own component.
2. **Principle 2: A Fetch in an Effect Never Suspends.** A component using an Effect renders immediately with initial state. Because it never suspends, the boundary fallback never activates, leaving a blank line on screen.
3. **Principle 3: One `<Suspense>` Is One Unit.** All elements inside a single boundary coordinate as a single unit. Wrapping an entire layout causes ready headlines to wait for slow weather.
4. **Principle 4: Nested `<Suspense>` Gives a Loading Sequence.** Nesting boundaries coordinates a progressive loading sequence across multiple visual stages. Use only as many boundaries as the intended user experience requires.
5. **Principle 5: `startTransition` Keeps the Old Content on the Screen.** When existing content re-suspends during an update, an urgent setter restores the fallback. Wrapping the update in `startTransition` preserves current content until new data arrives.

---

## PRINCIPLE | `<Suspense fallback>`: the closest boundary above a suspended component shows its fallback

> [!PRINCIPLE]
> **Principle 1: Suspense: The Closest Boundary Above Shows Its Fallback**
>
> *When a component suspends while it renders, the closest `<Suspense>` above it shows its `fallback`; when the data is ready, React shows the `children` with the data.*
>
> A component suspends when it attempts to read pending data during render, such as an unresolved promise unwrapped via `use`. React halts rendering for that component and displays nothing from its output. Instead, the nearest enclosing `<Suspense>` boundary renders its `fallback` prop, allowing the remainder of the page to paint. Because the component delegates loading UI, the boundary must reside in the parent tree, above the component reading the data.
>
> **DO THIS:**
> ```jsx
> <Suspense fallback={<p>Loading weather...</p>}>
>   ~<Weather city="London" />~ {/* Weather suspends, and this Suspense shows Loading weather... */}
> </Suspense>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function Weather({ city }) {
>   const weather = ~use(fetchData('/weather/' + city))~; // **WRONG:** suspends before the Suspense below is ever returned
>   return <Suspense fallback={<p>Loading weather...</p>}><p>{weather}</p></Suspense>;
> }
> ```

### `fallback` and `children`: two props, one on the screen at a time

```jsx title="One Suspense with its two props"
import { Suspense } from 'react';

<Suspense ~fallback={<p>Loading weather...</p>}~> {/* fallback: what the user sees while the weather is not ready */}
  ~<Weather city="London" />~ {/* children: what the user should see once the weather is ready */}
</Suspense>
```

The `<Suspense>` element is a built-in React component imported from `'react'`. It accepts two primary props:
- **`fallback`** is declared on the opening tag. It accepts any valid JSX element to display while child content loads (Lesson 08).
- **`children`** represents all elements nested between the opening and closing tags (Lesson 09).

No custom syntax is involved. What distinguishes Suspense is how React reconciles these props: React renders exactly one of them at any given time. React displays `children` when every nested element is ready, and renders `fallback` while any nested child remains suspended.

> [!DEFINITION]
> **A Suspense boundary.** [NEW] A `<Suspense>` component placed in your tree is called a Suspense boundary. It demarcates a distinct subtree of your application. Whenever any component inside that boundary suspends, React hides the entire subtree and displays the specified `fallback` element in its place (Lesson 69).

> [!DEFINITION]
> **To suspend.** [NEW] In React architecture, to suspend means to pause rendering a component because required asynchronous data is not yet available. When a component reads an unresolved promise during render, React pauses evaluation, discards incomplete UI from that component, and renders the nearest ancestor boundary's fallback. Once the promise settles, React retries rendering the component (Lesson 69).

Inspect `Weather` once more. The component never defines a loading indicator. It simply reads data. The boundary above decides what placeholder appears while the weather data is pending.

### What happens when the user opens the page

**The boundary displays its fallback while the promise remains pending, revealing `Weather` once the promise resolves.** Step by step:
1. React begins rendering `HomePage`, evaluating the title, the headlines, and the boundary wrapper.
2. React renders `Weather`. Calling the weather data helper returns an unresolved promise.
3. The `use` function discovers that the promise is pending, causing `Weather` to suspend. React halts rendering for this component.
4. React searches upward for the nearest ancestor boundary, locating the `<Suspense>` in `HomePage`.
5. React commits the render pass. The title, the headlines, and the fallback text paint together on screen.
6. After three seconds, the promise resolves. React retries rendering `Weather`. The data helper returns the cached, resolved promise, allowing `use` to return the weather string synchronously.
7. React replaces the fallback with the actual `Weather` component, displaying the resolved forecast line.

```tree dir=right caption="How one boundary shows its fallback while Weather suspends, and then shows Weather with its data."
What the weather line shows after the user opens the page
- +1. `Weather` suspends [`use`] | The promise for London is **still pending** | React shows **nothing from `Weather`**
- +2. The boundary shows its fallback [`fallback`] | The closest boundary above is **in `HomePage`** | The line reads **`Loading weather...`**
- +3. The promise resolves after 3 seconds | React **renders `Weather` again** | The line reads **`London: 18 degrees, sunny`**
```

Three critical behaviors occur without explicit imperative instructions in our code:
1. **The resolved value.** No state setter assigns the value. The `use` function extracts the resolved payload directly from the cached promise.
2. **The loading placeholder.** No conditional branch in `Weather` writes the loading message. React extracts that view directly from the `fallback` prop on the parent boundary.
3. **The second render pass.** No manual event triggers the update. React automatically retries the suspended subtree from scratch once the promise resolves.

### A `<Suspense>` inside the component never catches that component

A common beginner mistake attempts to place `<Suspense>` inside `Weather` itself, wrapping the returned paragraph:

**DO NOT DO THIS:**
```jsx title="src/components/Weather.jsx" bad="2"
export default function Weather({ city }) {
  const weather = ~use(fetchData('/weather/' + city))~; // **WRONG:** Weather suspends here, before the Suspense below is ever returned
  return (
    <Suspense fallback={<p>Loading weather...</p>}>
      <p>{weather}</p>
    </Suspense>
  );
}
```

That internal boundary will never display its fallback. The reason comes down to JavaScript execution order. The `use` call executes on the first line of `Weather`. Because the promise is pending, `Weather` suspends immediately, before reaching the `return` statement. The internal boundary is never returned and never mounted. Because it does not sit above `Weather`, React never encounters it.

Consider `try...catch` blocks once more. A `try` block declared inside a function body cannot catch an exception thrown before that block executes. In the same way, the boundary must exist above the component in the element tree before that component begins rendering.

When a component suspends without an internal boundary, React continues searching upward for the nearest ancestor boundary. If that outer boundary encompasses a broader section of the layout, a larger portion of the page is replaced by a fallback.

The solution is straightforward: place the boundary inside the parent component, above the element that triggers data loading.

**DO THIS:**
```jsx title="src/components/HomePage.jsx" good="1"
<Suspense ~fallback={<p>Loading weather...</p>}~> {/* In the parent, above the component that reads the data */}
  <Weather city="London" />
</Suspense>
```

Remember this architectural division: the child component reads data, while the parent boundary coordinates the waiting state.

---

## PRINCIPLE | A fetch in `useEffect`: the component never suspends, so the fallback never shows

> [!PRINCIPLE]
> **Principle 2: Effect Fetch: Only a Component That Suspends Activates the Boundary**
>
> *`<Suspense>` shows its fallback only when a child suspends while it renders; data fetched in an Effect or an event handler does not make the component suspend.*
>
> An Effect runs asynchronously after the commit phase, after the component has already completed its initial render pass with empty state. Because the component completed rendering without suspending, the enclosing boundary has nothing to wait for and displays the empty component immediately. To trigger a fallback, data must be read synchronously during render through a Suspense-compatible mechanism, such as `use` with a cached promise or an integrated framework.
>
> **DO THIS:**
> ```jsx
> function Weather({ city }) {
>   const weather = ~use(fetchData('/weather/' + city))~; // Suspends during render, so the fallback shows
>   return <p>{weather}</p>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function EffectWeather({ city }) {
>   const [weather, setWeather] = useState(null);
>   ~useEffect~(() => { fetchData('/weather/' + city).then(setWeather); }, [city]); // **WRONG:** Suspense cannot see this fetch, so the line stays empty
>   return <p>{weather}</p>;
> }
> ```

### The same boundary around an Effect fetch

Now place the Effect-based approach from Lesson 33 inside our Suspense boundary. In this variation, `EffectWeather` initiates its fetch inside `useEffect`. The component provides no internal fallback message because the developer expects `<Suspense>` to provide one:

```jsx title="An Effect fetch inside the same boundary"
<Suspense fallback={<p>Loading weather...</p>}>
  ~<EffectWeather city="London" />~ {/* Fetches in an Effect: the fallback never shows */}
</Suspense>
```

```jsx title="src/components/EffectWeather.jsx"
import { useState, useEffect } from 'react';
import { fetchData } from '../data.js';

export default function EffectWeather({ city }) {
  const [weather, setWeather] = useState(~null~); // The first render has no weather
  useEffect(() => {
    let ignore = false;
    fetchData('/weather/' + city).then(result => {
      if (!ignore) {
        setWeather(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [city]);
  return <p>{weather}</p>;
}
```

The initial three seconds of the page under each approach:

::: row caption="The first 3 seconds of the home page with use in render and with a fetch in an Effect, inside the same boundary."
::: col title="use in render" tag="the fallback shows" tone=good
```page size=mini
heading: City News
line: Main Street park opens today
line: Bus fares drop on Monday
line: Library stays open late
line: Loading weather... | good
```
`Weather` suspends, so the boundary shows `Loading weather...`.
:::
::: col title="A fetch in an Effect" tag="the line is empty" tone=bad
```page size=mini
heading: City News
line: Main Street park opens today
line: Bus fares drop on Monday
line: Library stays open late
empty: the weather line is empty
```
`EffectWeather` renders at once with no weather, so the line is empty.
:::
:::

Although both implementations read the same weather endpoint and sit within the exact same boundary, their initial render behavior differs completely. After three seconds, both components display the completed forecast. During the initial three seconds, however, only `Weather` activates the boundary. Visitors using the Effect version see a blank line with no indication that content is loading.

The official React documentation defines this constraint directly: Suspense does not detect when data is fetched inside an Effect or event handler. A boundary responds exclusively when a child component suspends during the render phase. Because Effects run after React commits changes to the screen (Lesson 32), rendering has already finished without interruption.

### What happens with the Effect fetch

**The boundary never renders its fallback because no component suspends.** Step by step:
1. React renders `EffectWeather`, where state initializes to `null`. The component successfully returns an empty `<p>` element.
2. Because `EffectWeather` never suspended, the boundary renders its children directly, committing the empty paragraph to the DOM.
3. React completes the browser commit. The weather line appears blank, and the fallback is bypassed entirely.
4. React runs the Effect after paint, initiating the asynchronous network request.
5. After three seconds, the promise callback invokes the state setter, scheduling a re-render.
6. React re-renders `EffectWeather` with the resolved string, painting the weather report to the DOM.

The blank line occurs because React renders `null` as empty output inside the paragraph (Lesson 10). The official documentation illustrates this scenario with an unintegrated list: Suspense cannot observe the fetch, so the fallback never shows and the interface remains blank until data arrives.

```tree caption="Which way of loading the weather lets the boundary show its fallback."
What the boundary sees while the weather loads
- +Reading with `use` during render [`use`] | The component **suspends** while the promise is pending | The boundary shows **`Loading weather...`**
- !Fetching in an Effect [`useEffect`] | The component **renders at once** with `null` and **never suspends** | The boundary has nothing to wait for, so the line stays **empty for 3 seconds**
```

### The developer who removes the loading text

This scenario arises frequently in production projects:
1. A developer maintains a data component built with `useEffect` and local state.
2. After learning about `<Suspense>`, the developer wraps the component in a boundary.
3. The developer removes the component's internal fallback string.
4. The page now opens with a blank line for three seconds during data loading.
5. The fallback never appears, leading the developer to believe Suspense is malfunctioning.

Suspense functions as intended. It simply requires a data-fetching layer that actively triggers component suspension. Compatible sources include `use` with cached promises, code splitting via `lazy`, or integrated frameworks like Next.js. Modern frameworks coordinate data loading directly with Suspense primitives, allowing developers to author boundaries while the framework handles promise suspension under the hood.

This limitation applies equally to event handlers. An event handler can initiate an asynchronous request, but a component suspends only when reading that promise during its render cycle. Lesson 71 examines how to connect user interactions to suspended data fetching.

For the rest of this lesson, the home page returns to `Weather`, which suspends during render. Always remember: without a suspended render, a boundary will never activate.

---

## PRINCIPLE | One `<Suspense>` around the whole page: every part inside waits for the slowest one

> [!PRINCIPLE]
> **Principle 3: One Unit: Everything Inside One Boundary Appears Together**
>
> *Everything inside one boundary waits for its slowest child and appears together; place the boundary around the slow part only, so the parts that are ready appear first.*
>
> Whenever any child within a boundary suspends, React replaces the entire subtree with the fallback, concealing components that were already prepared. Enclosing an entire page in a single root boundary allows one slow weather widget to obscure the title and all news articles. Placing the boundary exclusively around the slow widget leaves ready elements outside, allowing React to paint them immediately.
>
> **DO THIS:**
> ```jsx
> <Headlines />
> <Suspense fallback={<p>Loading weather...</p>}>
>   ~<Weather city="London" />~ {/* Only the weather line waits */}
> </Suspense>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <Suspense fallback={<p>Loading page...</p>}>
>   ~<Headlines />~ {/* **WRONG:** ready headlines wait 3 seconds for the weather */}
>   <Weather city="London" />
> </Suspense>
> ```

### The same boundary in two places

In the first configuration, a single boundary encloses the heading, the headlines, and the weather. In the second configuration, the boundary wraps only the weather widget:

```jsx title="One boundary around the whole page"
<Suspense ~fallback={<p>Loading page...</p>}~> {/* Wraps the title, the headlines, and the weather */}
  <h1>City News</h1>
  <Headlines />
  <Weather city="London" />
</Suspense>
```

```jsx title="One boundary around the weather only"
<h1>City News</h1>
<Headlines />
<Suspense ~fallback={<p>Loading weather...</p>}~> {/* Wraps only the weather */}
  <Weather city="London" />
</Suspense>
```

What the user sees during the initial three seconds:

::: row caption="The first 3 seconds of the home page with the boundary around the whole page and with the boundary around the weather only."
::: col title="Around the whole page" tag="nothing to read" tone=bad
```page size=mini
line: Loading page... | bad
```
The title and the headlines are ready, but the user sees only `Loading page...`.
:::
::: col title="Around the weather only" tag="headlines at once" tone=good
```page size=mini
heading: City News
line: Main Street park opens today
line: Bus fares drop on Monday
line: Library stays open late
line: Loading weather...
```
The title and the headlines appear at once. Only the weather line waits.
:::
:::

After three seconds elapsed, both page layouts look identical. During those initial three seconds, however, the root boundary conceals the entire interface behind a generic loading message, while the targeted boundary isolates only the pending weather line. This contrast addresses a classic interview question: why a single slow secondary widget should never freeze an entire landing page.

### Everything inside one boundary is one unit

The official React documentation establishes this fundamental rule: by default, the whole tree inside Suspense is treated as a single unit. A boundary never displays a partial selection of ready children while concealing others. When any child component inside suspends, React hides the entire branch behind the fallback. Once every child component finishes loading, React paints them all simultaneously. The documentation refers to this synchronized transition as popping in together.

**When a boundary encompasses the entire layout, ready content is held hostage by the slow component.** Step by step:
1. The user navigates to the page, where a single boundary encloses all three UI sections.
2. React renders the page header and `Headlines`, both of which are ready immediately.
3. React renders `Weather`, which encounters a pending promise and suspends.
4. React locates the nearest ancestor boundary, which is the root wrapper. React renders the fallback placeholder, hiding the heading and ready headlines.
5. After three seconds, the weather promise resolves. React reveals the entire subtree, popping in the heading, articles, and weather together.

The `Headlines` component never suspended and contained no loading state. Nonetheless, the parent boundary replaced it with the fallback. A boundary fallback substitutes for all nested children, regardless of whether individual children were ready to render.

Furthermore, a component does not need to be an immediate child of `<Suspense>` to activate it. As the official documentation explains, components that load data do not have to be direct children of the boundary. A weather widget nested three levels deep still causes the encompassing boundary to activate, mirroring how an uncaught error bubbles up call stacks to the nearest `catch`.

```tree caption="With one boundary around the whole page, the parts that are ready wait for the slowest part inside the same boundary."
Which parts wait when `Weather` suspends
- !Boundary around the whole page [`Loading page...`] | The title, the headlines, and the weather are **one unit** | The user sees **only `Loading page...`** for 3 seconds
- +Boundary around the weather only [`Loading weather...`] | The title and the headlines sit **outside the boundary** | React shows them **at once**; **only the weather line waits**
```

### The developer who wraps the whole app

This pattern occurs regularly in real-world codebases:
1. A developer places a single `<Suspense>` boundary at the root level of `App.jsx` to catch all loading states across the application.
2. The landing page includes one slow secondary component, such as a weather forecast.
3. Because the root boundary is the closest ancestor, the entire page renders a global loading spinner for three seconds.
4. The engineering team incorrectly assumes the network API is inherently too slow to support a responsive layout.

**DO NOT DO THIS:**
```jsx title="src/App.jsx"
export default function App() {
  return (
    <Suspense ~fallback={<p>Loading page...</p>}~> {/* **WRONG:** the whole home page waits 3 seconds for the weather */}
      <HomePage />
    </Suspense>
  );
}
```

The remedy is to position boundaries closer to the leaves of the component tree, wrapping only the delayed feature. Our `HomePage` already adopts this pattern. Repositioning a boundary modifies which UI elements wait without altering business logic. As the React documentation highlights, you can insert, move, or remove boundaries anywhere in the tree without affecting broader application behavior.

Always remember: child elements within a boundary wait together as a unit. Wrap only the components that actually experience delays.

---

## PRINCIPLE | Nested `<Suspense>`: the page appears in stages, one boundary at a time

> [!PRINCIPLE]
> **Principle 4: Nested Boundaries: Boundaries Follow the Loading Sequence**
>
> *When a component suspends, the closest boundary above it shows its fallback; an outer boundary with an inner boundary gives a loading sequence, one level at a time.*
>
> Each suspended component resolves against its closest ancestor boundary. An outer boundary displays its fallback until its immediate contents are ready, at which point an inner boundary assumes responsibility for slower child content. Boundaries do not accelerate network responses. They determine visual grouping, so developers should create only as many boundaries as the user experience requires.
>
> **DO THIS:**
> ```jsx
> <Suspense fallback={<p>Loading news...</p>}>
>   <Headlines />
>   ~<Suspense fallback={<p>Loading weather...</p>}>~ {/* Two stages: the news, then the weather */}
>     <Weather city="London" />
>   </Suspense>
> </Suspense>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~<Suspense fallback={<p>Loading...</p>}>~<h1>City News</h1></Suspense> {/* **WRONG:** one boundary per component, even around the title that never waits */}
> <Suspense fallback={<p>Loading...</p>}><Headlines /></Suspense>
> <Suspense fallback={<p>Loading...</p>}><Weather city="London" /></Suspense>
> ```

### A boundary inside another boundary

Suppose our news headlines now also load asynchronously from an API, requiring one second to respond. The weather endpoint continues to require three seconds. We can coordinate their progressive reveal by nesting an inner boundary inside an outer one:

```jsx title="A boundary for the news with a boundary for the weather inside it"
<h1>City News</h1>
<Suspense ~fallback={<p>Loading news...</p>}~> {/* Outer: stands in for the headlines and the weather */}
  <Headlines />
  <Suspense ~fallback={<p>Loading weather...</p>}~> {/* Inner: stands in for the weather only */}
    <Weather city="London" />
  </Suspense>
</Suspense>
```

Nesting `<Suspense>` components creates hierarchical boundaries. Each suspending component bubbles upward until it reaches its nearest ancestor boundary:
- **`Headlines`** resolves to the outer boundary.
- **`Weather`** resolves to the inner boundary.

This control flow mirrors nested `try...catch` blocks, where each error is caught by the closest enclosing handler.

The official documentation explains that nesting Suspense components creates an intentional loading sequence. A loading sequence defines the progressive order in which interface sections become visible. React refers to the transition where a boundary swaps its fallback for rendered content as a reveal.

### The page in three stages

**The layout unfolds across three distinct visual stages: first the title, then the headlines, and finally the weather.**

```page caption="Stage 1, right after the user opens the page: the title, and the news still loading."
heading: City News
line: Loading news...
```

```page caption="Stage 2, after 1 second: the headlines are there, and the weather is still loading."
heading: City News
line: Main Street park opens today
line: Bus fares drop on Monday
line: Library stays open late
line: Loading weather...
```

```page caption="Stage 3, after 3 seconds: the headlines and the weather are both there."
heading: City News
line: Main Street park opens today
line: Bus fares drop on Monday
line: Library stays open late
line: London: 18 degrees, sunny | good
```

React transitions between these three visual milestones systematically:
1. The user navigates to the page. The `<h1>` title sits outside all boundaries and paints to the screen immediately.
2. The `Headlines` component suspends. Its nearest ancestor is the outer boundary, which renders `Loading news...` in place of its entire subtree, covering both headlines and weather.
3. React commits Stage 1 to the screen: the page title and the news fallback appear together.
4. After one second, the headlines promise resolves. React re-renders the outer boundary. `Weather` remains suspended, but its nearest ancestor is now the inner boundary.
5. React reveals the outer content: headlines paint to the screen, while the inner boundary renders `Loading weather...`.
6. After three seconds, the weather promise resolves, and the inner boundary reveals the forecast line.

Notice Stage 1 carefully: the message `Loading news...` temporarily conceals the weather section as well. Because the inner boundary resides inside the outer boundary's subtree, the outer fallback replaces all nested elements until its own content resolves.

```tree dir=right caption="The loading sequence of the home page with a boundary for the news and a boundary for the weather inside it."
How the home page appears, one level at a time
- +Stage 1: at once | `City News` and **`Loading news...`** | The outer boundary stands in for the headlines **and** the weather
- +Stage 2: after 1 second | The **headlines** and **`Loading weather...`** | The outer boundary reveals its content; the inner boundary stands in for the weather
- +Stage 3: after 3 seconds | The headlines and **`London: 18 degrees, sunny`** | The inner boundary reveals the weather
```

React also incorporates an internal timing mechanism to prevent layout jitter. As the documentation details, React reveals suspended content at most once every 300 milliseconds. If multiple boundaries become ready within that narrow window, React reveals them simultaneously rather than staggering them across perceptible micro-updates. In our example, the two-second gap between stages comfortably exceeds 300 milliseconds, allowing each stage to reveal cleanly.

### The files for the news boundary

We update `data.js` to add an asynchronous endpoint for headlines with a one-second delay:

```js title="src/data.js" startLine="10"
const answers = {
  ~'/headlines'~: [['Main Street park opens today', 'Bus fares drop on Monday', 'Library stays open late'], 1000], // Ready after 1 second
  '/weather/London': ['London: 18 degrees, sunny', 3000],
};
```

The `Headlines` component now consumes data via `use`, suspending during render:

```jsx title="src/components/Headlines.jsx"
import { use } from 'react';
import { fetchData } from '../data.js';

export default function Headlines() {
  const headlines = ~use(fetchData('/headlines'))~; // Suspends for 1 second, then holds the three titles
  return (
    <ul>
      {headlines.map(title => (
        <li key={title}>{title}</li>
      ))}
    </ul>
  );
}
```

The parent `HomePage` nests the weather boundary within the outer news boundary:

```jsx title="src/components/HomePage.jsx" startLine="5"
export default function HomePage() {
  return (
    <main>
      <h1>City News</h1>
      <Suspense ~fallback={<p>Loading news...</p>}~> {/* Revealed after 1 second */}
        <Headlines />
        <Suspense ~fallback={<p>Loading weather...</p>}~> {/* Revealed after 3 seconds */}
          <Weather city="London" />
        </Suspense>
      </Suspense>
    </main>
  );
}
```

### How many boundaries is the right number

This addresses the architectural portion of the interview question: how granular should Suspense boundaries be? In practical terms, how many boundaries belong on a page, and what scope should each one encompass?

The official React documentation offers a direct answer: do not place a Suspense boundary around every component. Boundaries should never be more granular than the loading sequence intended for users.

Adding additional boundaries does not speed up data fetching. A boundary solely determines which UI elements reveal together. Choosing boundary granularity is therefore a design decision regarding visual presentation.

A common pitfall occurs when developers over-segment an application:
1. A developer observes that boundaries allow ready parts of an interface to paint early.
2. The developer wraps every individual component in its own `<Suspense>`, assigning each an identical generic placeholder.
3. Visitors encounter multiple identical spinners scattered across the screen, unable to discern which section corresponds to which task. On complex pages, elements jump erratically as individual requests settle.
4. The product design only called for two coherent stages: loading the main articles, followed by secondary widgets.

The documentation recommends consulting design wireframes, as UI designers typically specify intentional loading states and skeleton views.

Furthermore, fallback elements should remain lightweight placeholders. The official guidelines recommend compact indicators such as skeletons or spinner elements that preserve layout stability.

Always follow this guideline: provide one boundary for each intentional user experience stage, and no more.

---

## PRINCIPLE | `startTransition`: the weather already on the screen stays while the next city loads

> [!PRINCIPLE]
> **Principle 5: Transition: A Transition Avoids an Unwanted Fallback**
>
> *When content is already on the screen and an update makes it suspend again, the boundary shows its fallback again; inside `startTransition`, React keeps the content on the screen until the new data is ready.*
>
> A Suspense boundary activates whenever a nested child suspends, not just during initial mount. An urgent update, such as calling a state setter directly inside a click handler, causes the fallback to abruptly replace visible content. Wrapping that state update in `startTransition` instructs React to preserve existing UI on screen while the new data loads, while `useTransition` provides an `isPending` flag to signal ongoing background work.
>
> **DO THIS:**
> ```jsx
> <button onClick={() => ~startTransition(() => setCity('Paris'))~}>Paris</button> {/* London stays until Paris is ready */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <button onClick={() => ~setCity('Paris')~}>Paris</button> {/* **WRONG:** London disappears behind Loading weather... for 3 seconds */}
> ```

> [!DEFINITION]
> **A Transition.** [REVIEW] Wrapping a state setter inside `startTransition` marks the resulting update as non-urgent. Direct setter calls in event handlers are treated as urgent updates that render immediately. React renders Transitions in the background without modifying the active screen until the commit phase. The `useTransition` Hook provides both `startTransition` and a boolean `isPending` flag that remains true while the background render completes (Lessons 66 and 67).

### The same click with and without `startTransition`

We now add two city selection buttons, `London` and `Paris`, above the weather display. The parent component tracks the active city in state and passes it to `Weather` as a prop. Suppose the forecast currently displays London, and the user clicks `Paris`, which also requires three seconds to load.

Compare the two implementations:

```jsx title="The same click on Paris, with setCity and with startTransition"
<button onClick={() => ~setCity('Paris')~}>Paris</button> {/* Urgent: London's weather disappears behind the fallback */}
<button onClick={() => ~startTransition(() => setCity('Paris'))~}>Paris</button> {/* Non-urgent: London's weather stays until Paris is ready */}
```

What the user sees during the initial three seconds after clicking:

::: row caption="The 3 seconds after the user clicks Paris, with setCity and with startTransition."
::: col title="setCity alone" tag="London disappears" tone=bad
```page size=mini
heading: City News
line: Main Street park opens today
line: Bus fares drop on Monday
line: Library stays open late
line: [London] [Paris]
line: Loading weather... | bad
```
The weather the user was reading is gone. The line reads `Loading weather...` for 3 seconds.
:::
::: col title="setCity inside startTransition" tag="London stays" tone=good
```page size=mini
heading: City News
line: Main Street park opens today
line: Bus fares drop on Monday
line: Library stays open late
line: [London] [Paris]
line: London: 18 degrees, sunny | good
```
London's weather stays on the screen until Paris is ready.
:::
:::

After three seconds, both implementations render the Paris weather report. During those three seconds, however, direct state updates tear down the existing London forecast in favor of a loading placeholder. Wrapping the update in `startTransition` preserves the existing interface until the next dataset is ready to paint.

### Why the fallback comes back after the click

A Suspense boundary is not a one-time mount mechanism; it activates whenever any nested child suspends during a render. React documentation notes that if a rendered tree suspends again, its fallback reappears unless the update was caused by a Transition or a deferred value.

**A standard state update is urgent, forcing the boundary to show its fallback. A Transition update is non-urgent, allowing React to preserve existing UI.** Step by step:
1. The page displays the London forecast. The user clicks `Paris`, invoking `setCity('Paris')`.
2. React re-renders `Weather` with the new prop. The helper creates an unresolved promise for Paris, causing `Weather` to suspend.
3. Because the click handler ran an urgent update, React refuses to delay rendering. The boundary displays its fallback, hiding London's weather behind a loading message for three seconds.
4. When executed inside `startTransition`, the update is treated as non-urgent. Although `Weather` suspends, React retains the existing London forecast on screen while rendering the Paris tree in the background.
5. After three seconds, the Paris promise settles, and React commits the new forecast to the DOM.

This secondary fallback requires no dedicated logic; it is the default behavior of Suspense when child trees suspend during urgent updates.

The official documentation emphasizes this distinction: replacing visible UI with a fallback creates a jarring user experience. The documentation refers to already mounted interfaces as already revealed content, and describes the disruptive replacement as an unwanted fallback. During a Transition, React waits for data to resolve specifically to prevent unwanted fallbacks from appearing.

```tree caption="The same click on Paris as an urgent update and as a non-urgent update inside startTransition."
What the weather line shows while Paris loads
- !Urgent update [`setCity`] | `Weather` suspends, and the boundary **shows its fallback again** | London's weather **disappears** behind `Loading weather...`
- +Non-urgent update [`startTransition`] | `Weather` suspends, and React **keeps the already revealed content** | London's weather **stays on the screen** until Paris is ready
```

### `isPending`: show that Paris is on its way

Relying on `startTransition` alone can leave users uncertain whether their click registered, as the screen appears frozen during the three-second fetch. The React documentation cautions that without visual feedback, users cannot tell that navigation is underway.

The `useTransition` Hook resolves this ambiguity. It returns a boolean `isPending` state that allows us to apply a subtle visual indicator, such as dimming the current forecast while background data loads:

```jsx title="src/components/HomePage.jsx" startLine="5"
export default function HomePage() {
  const [city, setCity] = useState('London');
  const [~isPending~, startTransition] = useTransition(); // true while React waits for the new weather

  return (
    <main>
      <h1>City News</h1>
      <Suspense fallback={<p>Loading news...</p>}>
        <Headlines />
        <button onClick={() => startTransition(() => setCity('London'))}>London</button>
        <button onClick={() => ~startTransition(() => setCity('Paris'))~}>Paris</button> {/* London stays on screen while Paris loads */}
        <div style={{ ~opacity: isPending ? 0.7 : 1~ }}> {/* London fades while Paris loads */}
          <Suspense fallback={<p>Loading weather...</p>}>
            <Weather city={city} />
          </Suspense>
        </div>
      </Suspense>
    </main>
  );
}
```

We extend `data.js` to define the Paris endpoint with the same simulated delay:

```js title="src/data.js" startLine="10"
const answers = {
  '/headlines': [['Main Street park opens today', 'Bus fares drop on Monday', 'Library stays open late'], 1000],
  '/weather/London': ['London: 18 degrees, sunny', 3000],
  ~'/weather/Paris'~: ['Paris: 21 degrees, cloudy', 3000], // Ready 3 seconds after the first click on Paris
};
```

### Back to London: no wait at all

When the user subsequently clicks `London` again, the London forecast renders instantly without a fallback or opacity change. The data cache already holds the resolved promise for London. As the documentation notes, when `use` receives a resolved promise on re-render, it extracts the cached value synchronously without suspending. Because no suspension occurs, `isPending` remains true for only a fraction of a millisecond.

Transitions maintain focused scope. React does not delay rendering indefinitely for all asynchronous activity across the entire application; it pauses only long enough to prevent concealing already revealed content. Brand-new boundaries appearing on screen for the first time still render their fallback placeholders immediately.

### The developer who removes the weather boundary

This troubleshooting mistake occurs frequently:
1. A developer adds navigation buttons using standard, urgent state updates.
2. On every selection, the active forecast disappears, flashing a loading spinner for three seconds.
3. In an attempt to eliminate the flicker, the developer deletes the inner weather boundary entirely.
4. Now the outer news boundary becomes the nearest ancestor, causing the entire news section, including headlines and buttons, to disappear behind `Loading news...` on every tab change.
5. The proper architectural solution preserves the granular weather boundary and encapsulates the state transition inside `startTransition`, utilizing `isPending` to communicate background progress.

Remember this distinction: boundaries define initial loading units, while Transitions preserve existing views during subsequent updates.

---

## All 5 Principles Together

### The complete project

Every file of the finished city news application. `HomePage` positions the heading outside all boundaries, nests an outer boundary for headlines, configures an inner boundary for weather, and manages city selection transitions:

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
import HomePage from './components/HomePage.jsx';

export default function App() {
  return ~<HomePage />~; // Principle 3: no Suspense around the whole app
}
```

```js title="src/data.js"
const ~cache~ = new Map(); // One promise per address. Normally, a framework does this for you

export function fetchData(url) {
  if (!cache.has(url)) {
    cache.set(url, getData(url));
  }
  return cache.get(url);
}

const answers = {
  '/headlines': [['Main Street park opens today', 'Bus fares drop on Monday', 'Library stays open late'], 1000],
  '/weather/London': ['London: 18 degrees, sunny', 3000],
  '/weather/Paris': ['Paris: 21 degrees, cloudy', 3000],
};

async function getData(url) {
  const [value, delay] = answers[url];
  await new Promise(resolve => setTimeout(resolve, delay));
  return value;
}
```

```jsx title="src/components/HomePage.jsx"
import { Suspense, useState, useTransition } from 'react';
import Headlines from './Headlines.jsx';
import Weather from './Weather.jsx';

export default function HomePage() {
  const [city, setCity] = useState('London');
  const [isPending, startTransition] = useTransition();

  return (
    <main>
      <h1>City News</h1>
      <Suspense ~fallback={<p>Loading news...</p>}~> {/* Principle 4: outer boundary, revealed after 1 second */}
        <Headlines />
        <button onClick={() => startTransition(() => setCity('London'))}>London</button>
        <button onClick={() => ~startTransition(() => setCity('Paris'))~}>Paris</button> {/* Principle 5: keeps the weather on screen while the new city loads */}
        <div style={{ opacity: isPending ? 0.7 : 1 }}>
          <Suspense ~fallback={<p>Loading weather...</p>}~> {/* Principles 1 and 4: inner boundary, revealed after 3 seconds */}
            <Weather city={city} />
          </Suspense>
        </div>
      </Suspense>
    </main>
  );
}
```

```jsx title="src/components/Headlines.jsx"
import { use } from 'react';
import { fetchData } from '../data.js';

export default function Headlines() {
  const headlines = ~use(fetchData('/headlines'))~; // Principle 2: reads during render, so it suspends for 1 second
  return (
    <ul>
      {headlines.map(title => (
        <li key={title}>{title}</li>
      ))}
    </ul>
  );
}
```

```jsx title="src/components/Weather.jsx"
import { use } from 'react';
import { fetchData } from '../data.js';

export default function Weather({ city }) {
  const weather = ~use(fetchData('/weather/' + city))~; // Principle 2: suspends for 3 seconds for each new city
  return <p>{weather}</p>;
}
```

### The order in which React calls the components

When the user opens the page, React executes components from the top down. Each suspending component delegates its UI region to its closest ancestor boundary until data resolves:

```tree caption="The order in which React calls the components of the home page, and which boundary stands in for each one."
`App` [1. Called first] | Renders `<HomePage />`
- +`HomePage` [2. Called second] | Renders the title, the outer boundary, the buttons, and the inner boundary | `City News` appears **at once**
  - +`Headlines` [3. Suspends for 1 second] | Closest boundary: the **outer** one | The page shows **`Loading news...`** until the headlines are ready
  - +`Weather` [4. Suspends for 3 seconds] | Closest boundary: the **inner** one | Once the headlines appear, the line shows **`Loading weather...`** until the weather is ready
```

### The habit that breaks the page, and the rule

| Aspect | The Habit That Breaks the Page | The React Rule |
| :--- | :--- | :--- |
| **Where the fallback lives** | Declaring `<Suspense>` inside the suspending child component | Placing `<Suspense>` in the parent tree above the suspending component |
| **What activates it** | Relying on `useEffect` to trigger Suspense fallbacks | Reading data during render via `use` with cached promises, `lazy`, or a framework |
| **How much one boundary covers** | Enclosing the entire application in a single root boundary | Treating each boundary as an isolated visual unit around slow features |
| **How many boundaries** | Creating a separate boundary around every individual element | Designing nested boundaries that match intentional visual milestones |
| **After the content is shown** | Triggering urgent updates that cause unwanted fallback flashes | Wrapping updates in `startTransition` and using `isPending` for indicators |

Remember the central lesson: **When an unready component suspends, the nearest enclosing boundary renders its fallback. All components inside that boundary wait together, while everything outside renders immediately.**

---

## For the Interview

> **The Interview Question:** How does Suspense display fallbacks, and where should boundaries sit?

### How to Answer Clearly in 30 Seconds

"`<Suspense>` displays its fallback prop whenever any child component suspends during render, swapping in the resolved children once asynchronous data arrives. A component suspends when it unwraps an unsettled promise during render, such as through `use` with a cached promise, dynamic imports via `lazy`, or a Suspense-enabled framework. Fetching inside `useEffect` or event handlers never activates a boundary because those operations run outside the render cycle. When a component suspends, React bubbles up to the nearest ancestor boundary and renders its fallback, treating all nested children as a single visual unit. Boundaries should wrap slow or secondary components so fast, critical content can paint immediately. Nest boundaries to establish a progressive loading sequence matching user design expectations, rather than wrapping every component individually. Finally, when updating data for already visible UI, wrap state changes in `startTransition` to prevent unwanted fallbacks from flashing."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"I wrapped my component in `<Suspense>`, but the fallback never shows. Why?"**
   The component almost certainly initiates data fetching inside an Effect or event handler. The official React documentation notes that Suspense does not observe data fetched inside Effects. Because Effects execute after browser commit, the component completes rendering its initial state without interruption and never suspends. Suspense requires data to be read during render through a compatible source, such as `use` with a cached promise, `lazy`, or an integrated framework like Next.js. Furthermore, the underlying promise must be cached across renders. Instantiating a new promise on every render cycle causes the component to suspend perpetually, locking the UI in a continuous loading state.
2. **"How granular should Suspense boundaries be?"**
   Boundaries should never be more granular than the intended user loading sequence. Because all components inside a boundary coordinate as a single unit, a root-level boundary forces the entire layout to wait for the slowest data point. Conversely, wrapping every element in its own boundary produces an erratic layout that jumps with every settling request. React documentation advises against wrapping every component, suggesting developers align boundaries with designed skeleton states. Nested boundaries provide structured visual milestones. Additionally, React coalesces reveals occurring within a 300-millisecond window, preventing rapid layout shifts.
3. **"The user clicks a tab, and the content they were reading is replaced by a spinner. How do you stop that?"**
   A boundary displays its fallback whenever a child suspends during an urgent update. To prevent replacing already revealed content with an unwanted fallback, wrap the state setter inside `startTransition` or consume `useDeferredValue`. React maintains the existing interface on screen while rendering the new view in the background. Pair this with `isPending` from `useTransition` to provide visual feedback, such as dimming the current view. If the update loads distinct content, such as another user profile, place a unique key on the boundary to show the fallback intentionally (Lesson 25).

```tree caption="The three interview answers about Suspense: what activates it, where boundaries sit, and how to keep content on the screen."
Suspense in an interview
- +What activates a boundary [`use` `lazy`] | A component that **suspends during render** | An Effect fetch **never** shows the fallback
- +Where boundaries sit [`Suspense`] | Around the **slow parts**, nested to match the **loading sequence** | Not around **every component**
- +After content is shown [`startTransition` `isPending`] | A non-urgent update **keeps the already revealed content** | A `key` on the boundary shows the fallback **on purpose** for different content
```
