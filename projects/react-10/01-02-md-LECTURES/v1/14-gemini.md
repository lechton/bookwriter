# Lecture 14: Pure Components and Where Side Effects Belong
> INTERVIEW QUESTION | ❱ CORE | What does it mean for a component to be pure, and what breaks across renders when it is not?

---

## The Reconciler's Contract: Why React Demands Pure Functions

### Deterministic Formulas vs. Stateful Memory Leaks

When you write a React component, you write a JavaScript function whose sole job is to return JSX markup describing what should appear on the screen.

React calls your component functions repeatedly throughout the life of a web page: on initial startup, whenever parent state updates, and whenever props change. Because your component function executes again and again, React requires every component to behave as a **pure function**.

In computer science, a pure function satisfies two strict rules:
1. **Zero Side Effects**: It minds its own business. It never mutates any variable, array, or object that existed before the function was called.
2. **Referential Idempotency**: Same inputs always produce the exact same output. Calling the function multiple times with identical arguments returns the identical result every time.

Compare two tiny JavaScript functions that both take a number and return a number:

```js title="A pure function vs. an impure function with external mutation"
function double(number) {
  return ~2 * number~; // 1. Pure: uses only its input parameter and mutates nothing outside
}

console.log(double(3)); // First call with 3 -> returns 6
console.log(double(3)); // Second call with 3 -> still returns 6!

let ~total = 0~; // Impure: shared module variable allocated outside the call stack

function addToTotal(number) {
  ~total = total + number~; // 2. Mutates a variable that existed before this call!
  return total;
}

console.log(addToTotal(3)); // First call with 3 -> returns 3
console.log(addToTotal(3)); // Second call with 3 -> returns 6!
```

**At first glance, `double` and `addToTotal` both accept a number and return a number. They look like the same kind of function, but they are NOT the same thing!**

When you call `double` with three, you get six every single time, whether you call it once, twice, or a thousand times. When you call `addToTotal` with three, the first call returns three and the second call returns six. The second answer changed because `addToTotal` modified `total`, an outside variable that existed before the function ran. Its output depends not only on its input, but on how many times it was previously called. It leaks a side effect into external memory.

React assumes that every component you write is strictly like `double`:

```jsx title="A pure React component: deterministic mapping from props to JSX"
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>; // Pure: given the same name prop, always returns identical JSX
}
```

Given the same `name` prop, `Greeting` must return the exact same heading element every single time. If `Greeting` altered an outside counter or mutated an incoming array while calculating its JSX, its output would drift across render passes, corrupting the user interface.

Look at the three foundational terms that govern this entire chapter:
1. **Purity**: The component minds its own business and leaves outside values untouched. Given identical inputs, it always returns the exact same JSX.
2. **Side effect**: Any observable interaction outside the function return value. Examples include modifying an outside variable, mutating an incoming array, or mutating the browser DOM directly.
3. **Mutation**: Modifying an existing variable, array, or object in place in memory instead of leaving it alone or allocating a fresh copy.

```tree caption="Pure functions behave as deterministic formulas; impure functions leak state into outside memory."
Pure functions vs. impure functions with external mutation
- +Pure [`double` and `Greeting`] | **Zero side effects** | **Same inputs, same output**: calling it with `3` or `name="John"` returns the **exact same result** every time
- !Impure [`addToTotal`] | **Mutates outside memory** | **Same inputs, different output**: calling it twice with `3` returns **`3` first and `6` second**
```

### Render Phase vs. Event Handlers vs. Post-Commit Effects

If components must remain strictly pure during render, where do real applications update state, count user clicks, or send analytics pings? Inside a React component file, code executes across **three distinct runtime phases**:

```jsx title="The three execution phases inside a component file"
function MyPage() {
  const label = ~'Dark mode'~; // 1. Component Body: Render Phase runs during render and must stay pure

  function handleToggle() {
    ~console.log('User clicked')~; // 2. Event Handler: Event Phase runs on click and side effects belong here
  }

  return <button onClick={handleToggle}>{label}</button>;
}
```

Each phase executes under a completely different runtime contract:
1. **The Render Phase: Component Body**: Lines written directly at the top level of the component execute synchronously every time React evaluates the component to produce JSX. This code must remain completely pure. It calculates JSX element descriptions from props and state, touches zero outside variables, and mutates zero incoming objects.
2. **The Event Phase: Event Handlers**: Functions like `handleToggle` execute asynchronously on the browser event loop only when the user interacts with the page, such as clicking a button. Event handlers never run during render, which means **event handlers do not need to be pure**. This is the primary home for user-driven side effects.
3. **The Post-Commit Phase: `useEffect`**: Functions passed to `useEffect` execute after React commits DOM mutations to the browser screen. Keep Effects as a last resort when a side effect must synchronize with an external system without a direct user interaction (as taught in Lesson 32).

```tree caption="The three execution phases of a React component and where side effects belong."
The three execution phases of a component
- +1. Component Body [Render Phase] | Evaluated synchronously to calculate JSX | +**DO** keep **100% pure**: zero external mutations
- +2. Event Handlers [Event Phase] | Executed asynchronously on user interaction | +**DO** place **side effects** here: update state, log clicks, dispatch mutations
- +3. useEffect [Post-Commit Phase] | Executed after React commits DOM changes | Use as a **last resort** for external system synchronization
```

### The Re-Render Trap: How Unrelated State Updates Expose Impure Code

To see how an impure component breaks an application, we build a shopping list page with three grocery items and a theme toggle button. The list displays Milk, Bread, and Eggs next to a Dark mode button.

The theme button flips a boolean state variable, `dark`, inside the parent `App` component. It changes nothing about the grocery items.

Clicking the theme toggle triggers a state re-render in `App`. As React re-evaluates `App` to produce the dark-mode layout, it re-evaluates all three child `<Item />` components with the exact same props they received on initial load.

When an item component is impure, such as incrementing an outside counter variable during render, the bug is completely invisible on initial load:
- On initial page load without development double-rendering, both the pure and impure components display the items 1. Milk, 2. Bread, and 3. Eggs.
- **It may look the same, and it may seem to work the same at first, but it is NOT the same thing!**
- The moment the shopper clicks Dark mode, the parent re-renders. The pure component re-evaluates its props and stably displays 1. Milk, 2. Bread, and 3. Eggs.
- The impure component re-runs its body and advances the outside counter, suddenly jumping the display to **4. Milk, 5. Bread, and 6. Eggs**!

```tree dir=right caption="An impure component and a pure component look identical on first load, then diverge on the first re-render."
What happens when the shopper clicks Dark mode
- +Pure Item component [reads number from props] | Initial load shows `1. Milk`, `2. Bread`, `3. Eggs` | Clicking Dark mode re-renders with same props and **preserves `1. Milk`, `2. Bread`, `3. Eggs`**
- !Impure Item component [mutates outside number variable] | Initial load looks fine: `1. Milk`, `2. Bread`, `3. Eggs` | Clicking Dark mode advances outside memory and **jumps to `4. Milk`, `5. Bread`, `6. Eggs`!**
```

### Project Architecture: The Shopping List Directory

Before Principle 1, recall two foundational prerequisites from earlier lessons:
- Props and state are read-only inputs (as seen in Lesson 08). Calling a state setter triggers a re-render of that component and every child it returns (as taught in Lesson 13).
- Declaring a `let` variable at the top of a file outside all functions allocates it once in module scope. Every function in that file reads and mutates that same shared memory.

Our shopping list project uses five small files across the project root, the source folder, and the components folder:

```files title="shopping-list: File Explorer" caption="How our five project files sit in index.html, src/, and src/components/."
index.html | entry | The HTML page with the empty `#root` div where React mounts the app
src/
  main.jsx | boundary | Imports `StrictMode` and `App`, and mounts `<App />` into `#root`
  App.jsx | parent | Holds the `dark` theme state and renders three `<Item />` tags, `<ListSummary />`, and the theme button
  components/
    Item.jsx | child | Receives `{ number, name }` as props and returns one numbered `<li>` grocery item
    ListSummary.jsx | child | Receives `{ items }` as a prop, copies it with `.slice`, adds `'Shopping bags'`, and returns the summary paragraph
```

### The Four Invariants of Pure Component Rendering

**PRINCIPLES:** React may call your component functions at any time and any number of times. Because of that, every component must act like a pure formula during render, which establishes four foundational invariants:
1. **Principle 1: Idempotent Functional Evaluation: Same Inputs Must Always Produce Identical JSX**: A component must use only its inputs and never change a variable that existed before it ran. If a component increments a module-level variable during render, its numbers climb on every re-render even when its own props never change.
2. **Principle 2: Intentional Double-Invocation: <StrictMode> Exposes Render Impurities on Mount**: Wrapping your app in `<StrictMode>` makes React call each component function twice in development. A pure component produces identical markup, while an impure component immediately exposes its bug on first load instead of hiding until a user re-render.
3. **Principle 3: Heap Reference Invariance: Never Mutate Incoming Objects or Props During Render**: Mutating an array or object received via props alters parent component memory and compounds duplicates across renders. Allocating a local clone with `.slice` isolates mutations to the current render scope, making local mutation completely safe.
4. **Principle 4: Asynchronous Side Effect Isolation: Confining State and DOM Mutations to Event Handlers**: Code written directly in the component body runs synchronously during render, whereas code inside an event handler executes asynchronously on user interaction. Side effects such as updating counters, logging user actions, or dispatching state updates belong strictly in event handlers.

Here is the complete map of all four principles before we examine each one:

| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |
| :--- | :--- | :--- | :--- |
| **Principle 1** | **Idempotent Functional Evaluation: Never Change Outside Variables in Render** | Mutating a module-level counter during render looks right on first load, then displays climbing, corrupt numbers on every state re-render. | Pass changing data in through read-only props or state, and never modify variables created outside the component during render. |
| **Principle 2** | **Intentional Double-Invocation in Development** | Developers see doubled numbers in development and delete `<StrictMode>`, which only hides an impurity that still breaks in production on re-render. | Keep `<StrictMode>` enabled in the startup file so development double-rendering catches impure components on initial mount. |
| **Principle 3** | **Heap Reference Invariance: Outside vs. Local Array Mutation** | Calling `.push` on a prop array during render permanently corrupts parent memory, while interviews test when array mutation is allowed. | Never mutate a prop or outside array during render; clone it first with `.slice` or allocate a new local array inside the same render. |
| **Principle 4** | **Asynchronous Side Effect Isolation in Event Handlers** | Placing side effects in the component body counts renders instead of user clicks and executes twice under `<StrictMode>`. | Place side effects inside event handlers like `onClick`, which run only on user actions and never during render. |

---

## 1. Principle 1: Idempotent Functional Evaluation: Same Inputs Must Always Produce Identical JSX

### Props-Driven Determinism vs. Module-Scoped Mutation

Before we touch our shopping list files, compare two small components that both display a numbered item on the screen.

First, look at a component that receives both the item number and the item name through its props:

```jsx title="Option A: A pure component that reads number from props"
function ~PureItem~({ number, name }) { // 1. Uses only its props and changes nothing outside
  return <li>{number}. {name}</li>;
}
```

Now compare that with a component that keeps a counter variable outside the function and adds one to it every time the component runs:

```jsx title="Option B: An impure component that changes an outside variable during render"
let number = 0;

function ImpureItem({ name }) {
  ~number = number + 1~; // **WRONG:** mutates an outside variable while rendering!
  return <li>{number}. {name}</li>;
}
```

Look at the architectural trade-offs between these two implementations:
- **Choice A: Pure Props Dispatch with `PureItem`.** The component receives its position and label through read-only props. Output depends strictly on arguments. Identical inputs return identical JSX every time, remaining completely stable across parent re-renders.
- **Choice B: Module-Scoped Mutation with `ImpureItem`.** The component modifies shared variable `number` in module scope outside its call stack. Output depends on how many times the function was called. On initial load without Strict Mode, it displays 1. Milk, 2. Bread, and 3. Eggs.

**When you render three items on the page for the first time without `<StrictMode>`, both components show 1. Milk, 2. Bread, and 3. Eggs with zero Console errors. It may look the same, and it may seem to work the same at first, but it is NOT the same thing!**

On the first render, `number` advances from 0 to 1, 2, and 3. On the next render, `number` is already 3, so calling the same three tags returns 4. Milk, 5. Bread, and 6. Eggs.

```tree caption="Why a pure component and an impure component look identical on first load, then split apart on re-render."
How PureItem and ImpureItem behave across renders
- +PureItem [reads `{ number, name }` from `props`] | Leaves everything outside the component **untouched** | Returns **`1. Milk`, `2. Bread`, `3. Eggs`** on first load **and on every re-render**
- !ImpureItem [runs `number = number + 1` on an outside `let`] | Looks right on first load, **but is NOT the same thing!** | Every re-render adds to the old `number`, jumping to **`4, 5, 6`** and then **`7, 8, 9`!**
```

### The Compounding Render Bug: Module Counters Climbing on Parent Updates

Let us watch this defect happen in our shopping list project. First, our startup file mounts the main component on the page without any extra wrapper:

```jsx title="src/main.jsx" startLine="1"
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
~root.render(<App />)~; // Mounts App once on startup
```

Next, in the item file, a developer creates a counter variable at the top of the file and adds one to it inside the component:

```jsx title="src/components/Item.jsx" startLine="1"
~let number = 0~; // 1. Created once outside Item when Item.jsx loads

export default function Item({ name }) {
  ~number = number + 1~; // **WRONG:** changes the outside number variable during render!
  return <li>{number}. {name}</li>;
}
```

Then, in the main file, we keep a state variable for the page theme and render three item tags above a theme button:

```jsx title="src/App.jsx" startLine="1"
import { useState } from 'react';
import Item from './components/Item.jsx';

export default function App() {
  const [dark, setDark] = ~useState(false)~; // 1. Keeps the light or dark theme state

  function handleToggle() {
    ~setDark(!dark)~; // 2. Flips dark state and triggers a re-render of App
  }

  return (
    <main className={dark ? 'page dark' : 'page'}>
      <h1>My Shopping List</h1>
      <ul>
        ~<Item name="Milk" />~ {/* 3. Three Item tags with only the name prop */}
        <Item name="Bread" />
        <Item name="Eggs" />
      </ul>
      <button className="theme-btn" onClick={handleToggle}>
        {dark ? 'Light mode' : 'Dark mode'}
      </button>
    </main>
  );
}
```

The page now displays corrupt, climbing item numbers on every theme toggle. Clicking Dark mode flips the background theme, but also causes the grocery items to jump from 1, 2, 3 to 4, 5, 6 and 7, 8, 9:
1. **On the first load**: The page displays the three items numbered 1, 2, and 3 above the Dark mode button.
2. **After clicking Dark mode once**: The background switches to dark, the button label switches to Light mode, and the three items suddenly change to **4. Milk**, **5. Bread**, and **6. Eggs**.
3. **After clicking Light mode a second time**: The list jumps again to **7. Milk**, **8. Bread**, and **9. Eggs**, with zero warnings or errors in the Console.

### Parent Re-Renders Cascade Through Child Evaluation Trees

Updating parent state re-executes all returned child components. If a child mutates module-level variables during render, its output changes on every render pass even when its props remain identical.

Follow what JavaScript and React do in order:
1. When the item file loads for the first time, JavaScript creates `number` with the value `0` once at the module level.
2. On the first render, React calls `App`, and then calls `Item` three times for the three groceries. Each call adds 1 to that shared `number`, so `number` becomes 1, then 2, then 3.
3. When the shopper clicks the theme button, `setDark` updates the state in `App`. Updating state in a parent component makes React call `App` again and then call every child component that `App` returns (as taught in Lesson 13).
4. React calls `Item` three more times with the exact same `name` props. Because `number` sits in module scope outside `Item`, it was never reset to zero. It still holds 3 from the first render, so the three new calls push `number` to 4, 5, and 6.

```tree dir=right caption="How the outside number variable in Item.jsx keeps climbing every time App re-renders."
What happens to `let number = 0` across renders
- +1. File loads once [`src/components/Item.jsx`] | JavaScript creates **`number` = `0`** at the top of the file
- +2. First render [3 `<Item />` tags run] | `Item` adds `1` three times | Page shows **`1. Milk`, `2. Bread`, `3. Eggs`** and `number` stays at **`3`**
- !3. Click Dark mode [`setDark` re-renders `App` and its children] | `Item` runs 3 more times starting from **`3`** | Page jumps to **`4. Milk`, `5. Bread`, `6. Eggs`** and `number` stays at **`6`!**
```

### Pure Props Dispatch: Passing Item Position via Read-Only Props

To make `Item` pure, remove the outside counter from the item file and pass each item position deterministically through its props.

First, in the item file, read both the number and the name from the component props and return the list item without changing anything outside:

```jsx title="src/components/Item.jsx" startLine="1"
export default function Item({ ~number, name~ }) { // 1. Reads number and name from props; changes nothing outside
  return <li>~{number}~. {name}</li>; // 2. Always returns the exact same JSX for the same props
}
```

Second, in the main file, pass each item position as an explicit prop on its tag:

```jsx title="src/App.jsx" startLine="10"
  return (
    <main className={dark ? 'page dark' : 'page'}>
      <h1>My Shopping List</h1>
      <ul>
        ~<Item number={1} name="Milk" />~ {/* 1. Passes number=1 and name="Milk" via props */}
        ~<Item number={2} name="Bread" />~ {/* 2. Passes number=2 and name="Bread" via props */}
        ~<Item number={3} name="Eggs" />~ {/* 3. Passes number=3 and name="Eggs" via props */}
      </ul>
      <button className="theme-btn" onClick={handleToggle}>
        {dark ? 'Light mode' : 'Dark mode'}
      </button>
    </main>
  );
```

Each item tag in the main file passes its own `number` attribute, and React places that value into `props.number`. When the shopper clicks Dark mode and React calls `Item` again, the first item still receives 1 and Milk from its props. It returns the exact same list item every single time:

::: row caption="Clicking Dark mode with an impure Item component vs. a pure Item component that receives number as a prop."
::: col title="Impure Item After 1st Click" tag="numbers climb to 4, 5, 6" tone=bad
```page size=mini
heading: My Shopping List
line: 4. Milk | bad
line: 5. Bread | bad
line: 6. Eggs | bad
line: Light mode
```
```jsx title="src/components/Item.jsx" bad="1,3"
let number = 0;
export default function Item({ name }) {
  number = number + 1;
  return <li>{number}. {name}</li>;
}
```
Each re-render adds to the outside `number`, so clicking Dark mode changes the item numbers.
:::
::: col title="Pure Item After 1st Click" tag="numbers stay 1, 2, 3" tone=good
```page size=mini
heading: My Shopping List
line: 1. Milk | good
line: 2. Bread | good
line: 3. Eggs | good
line: Light mode
```
```jsx title="src/components/Item.jsx" good="1,2"
export default function Item({ number, name }) {
  return <li>{number}. {name}</li>;
}
```
Each item reads `number` and `name` from its own props and returns the same JSX on every render.
:::
:::

Compare what the shopper sees on screen across the first load and two clicks of the theme button:

| Moment | Impure `Item` Mutating Outside `number` | Pure `Item` Reading `number` Prop |
| :--- | :--- | :--- |
| **First load** | `1. Milk`, `2. Bread`, `3. Eggs` | `1. Milk`, `2. Bread`, `3. Eggs` |
| **After 1st click on `Dark mode`** | `4. Milk`, `5. Bread`, `6. Eggs` | `1. Milk`, `2. Bread`, `3. Eggs` |
| **After 2nd click on `Light mode`** | `7. Milk`, `8. Bread`, `9. Eggs` | `1. Milk`, `2. Bread`, `3. Eggs` |

Two foundational interview invariants follow directly from Principle 1:
1. **Component Isolation**: Never pass data between components through a shared module variable. React does not promise the order in which components render. One component must never write to an outside variable expecting another component to read it. Components always share data through props, state, or context, and all three inputs are strictly read-only during render.
2. **Mathematical Idempotency**: Given identical inputs, a component must return identical JSX. Calling non-deterministic functions like `Math.random` or `new Date` inside the component body makes a component impure. Two renders with the exact same props produce different output.

> [!PRINCIPLE]
> **Principle 1: Pure Components: Same Inputs Return the Same JSX and Leave Outside Variables Alone**
>
> *Keep every component pure during render: read only its props and state, return the same JSX, and never change an outside variable.*
>
> This is an easy trap when a page first loads. If your component adds to a variable sitting outside the function, the first render looks completely fine on the screen. The trouble starts as soon as any parent updates its state and React calls your component again. That outside variable kept its old value from the first render. So the numbers on the screen climb higher on every click even though the items themselves never changed! Pass each item's number in as a prop so the component always returns the exact same result for the same inputs.
>
> **DO THIS:**
> ```jsx title="src/components/Item.jsx"
> export default function Item({ ~number, name~ }) { // Pure: reads number and name from props
>   return <li>{number}. {name}</li>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx title="src/components/Item.jsx"
> let number = 0;
> export default function Item({ name }) {
>   ~number = number + 1~; // **WRONG:** mutates outside variable during render; climbs on every re-render!
>   return <li>{number}. {name}</li>;
> }
> ```

---

## 2. Principle 2: Intentional Double-Invocation: <StrictMode> Exposes Render Impurities on Mount

### The Double-Render Probe: Exposing State Leaks Before Production

To verify whether a function is pure, React calls the function twice in a row with identical inputs and checks whether the second output changes:

```js title="Calling a function twice to test whether it is pure"
console.log(double(3)); // 1st call -> 6
console.log(~double(3)~); // 2nd call -> still 6! Pure!

console.log(addToTotal(3)); // 1st call -> 3
console.log(~addToTotal(3)~); // 2nd call -> changes to 6! Impure!
```

That is the entire architecture behind React's **`<StrictMode>`**:

```jsx title="Wrapping <App /> in <StrictMode> inside src/main.jsx"
import { ~StrictMode~ } from 'react'; // 1. Imported as a named export from react

root.render(
  ~<StrictMode>~ {/* 2. Calls every component inside it TWICE in development */}
    <App />
  </StrictMode>
);
```

In React, `<StrictMode>` is an intentional development-only diagnostic harness that deliberately double-invokes component functions, `useState` initializers, and reducers:
1. Pure components produce the exact same JSX on both calls, leaving the rendered screen completely stable.
2. Impure components that mutate external state advance their outside variables on the second call, immediately exposing bugs on initial mount before user interaction.

In development, `<StrictMode>` surfaces hidden impurities immediately. In production builds created by `npm run build`, `<StrictMode>` double-rendering is stripped out entirely, resulting in zero extra function calls and zero runtime overhead.

```tree caption="What happens when <StrictMode> calls a component twice in development."
How <StrictMode> tests your components in development
- +Pure component [`Item` reading `{ number, name }`] | 1st call returns `1. Milk`; 2nd call returns `1. Milk` | **Looks the exact same** with or without `<StrictMode>`
- !Impure component [`Item` changing outside `number`] | 1st call makes `number` `1`; 2nd call makes `number` `2` | Shows **`2. Milk`, `4. Bread`, `6. Eggs` on the very first load** so you spot the bug immediately!
```

### The Initial Mount Double-Call: Odd Numbers Vanish into Even Outputs

When you create a new React project with Vite, the startup file wraps the main component in `<StrictMode>` by default:

```jsx title="src/main.jsx" startLine="1"
import { ~StrictMode~ } from 'react'; // 1. Import StrictMode from react
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  ~<StrictMode>~ {/* 2. Wraps <App /> so React double-calls components in development */}
    <App />
  </StrictMode>
);
```

Inside the item file, suppose the developer still keeps the counter variable at the top of the file:

```jsx title="src/components/Item.jsx" startLine="1"
let number = 0;

export default function Item({ name }) {
  ~number = number + 1~; // **WRONG:** runs twice per item in StrictMode!
  return <li>{number}. {name}</li>;
}
```

In development under `<StrictMode>`, the list numbers immediately double on first load: the page renders 2. Milk, 4. Bread, 6. Eggs before any user interaction occurs.

If the shopper clicks Dark mode once, the numbers jump straight to **8. Milk**, **10. Bread**, and **12. Eggs**!

### Execution Trace: Why First-Render Double Invocations Advance Shared State

In development, `<StrictMode>` invokes every component function twice per render pass and renders only the second result, instantly exposing side-effecting variable mutations as doubled outputs on mount.

Follow what JavaScript and React do in order during the initial mount:
1. For the first item tag, React calls `Item` once, which changes `number` from 0 to 1. React immediately calls `Item` a second time, which changes `number` to 2 and puts **2. Milk** on the page.
2. For the second item tag, React calls `Item` once, changing `number` to 3. Then it calls `Item` a second time, changing `number` to 4, and puts **4. Bread** on the page.
3. For the third item tag, React calls `Item` once, changing `number` to 5. Then it calls `Item` a second time, changing `number` to 6, and puts **6. Eggs** on the page.
4. When the shopper clicks Dark mode, React renders the list again and calls each of the three items twice more, pushing `number` to 8, 10, and 12.

```tree dir=right caption="How <StrictMode> calls each <Item /> twice on the first load in development."
First load of impure Item inside <StrictMode>
- +1. `<Item name="Milk" />` [called twice] | Call 1 sets `number` to `1`; Call 2 sets `number` to **`2`** | Page shows **`2. Milk`**
- +2. `<Item name="Bread" />` [called twice] | Call 1 sets `number` to `3`; Call 2 sets `number` to **`4`** | Page shows **`4. Bread`**
- +3. `<Item name="Eggs" />` [called twice] | Call 1 sets `number` to `5`; Call 2 sets `number` to **`6`** | Page shows **`6. Eggs`**
```

### The StrictMode Deception: Deleting the Harness Hides the Bug Until Re-Render

When beginners see 2. Milk, 4. Bread, and 6. Eggs on their screen, they often delete `<StrictMode>` from the startup file so the page shows 1, 2, and 3.

Compare the two choices available when `<StrictMode>` exposes doubled numbers:
- **Choice A: Removing Strict Mode.** Calling `root.render` without `<StrictMode>` silences the diagnostic harness. The first load shows 1, 2, 3, masking the symptom on mount while leaving catastrophic bugs active on the first user re-render.
- **Choice B: Fixing the Underlying Impurity.** Passing item data through read-only props restores pure functional evaluation, guaranteeing identical output across development double-calls and production single-calls.

Deleting `<StrictMode>` is a dangerous anti-pattern. Removing `<StrictMode>` does not fix the item component. It only turns off the alarm bell so the bug hides on initial mount and breaks as soon as a real user clicks Dark mode.

### Idempotent Verification: Pure Components Produce Identical Trees Across Invocations

Now we keep `<StrictMode>` in the startup file and use our pure item component that reads its number and name from props:

```jsx title="src/components/Item.jsx" startLine="1"
export default function Item({ ~number, name~ }) { // Pure: calling this twice with number=1 returns "1. Milk" both times!
  return <li>{number}. {name}</li>;
}
```

In development, `<StrictMode>` still calls `Item` twice for each grocery item. Because `Item` is pure, both calls for the first item receive 1 and Milk and return the exact same list item. The user sees 1. Milk, 2. Bread, and 3. Eggs on the first load and after every click.

And if you inspect the browser Elements panel, you will see that `<StrictMode>` adds zero HTML elements to the DOM:

::: row caption="Impure Item vs. pure Item on the first load in development with <StrictMode> enabled."
::: col title="Impure Item in <StrictMode>" tag="first load shows 2, 4, 6" tone=bad
```page size=mini
heading: My Shopping List
line: 2. Milk | bad
line: 4. Bread | bad
line: 6. Eggs | bad
line: Dark mode
```
```dom
<div id="root">
  <main class="page">
    <h1>My Shopping List</h1>
    <ul>
!     <li>2. Milk</li>
!     <li>4. Bread</li>
!     <li>6. Eggs</li>
    </ul>
    <button class="theme-btn">Dark mode</button>
  </main>
</div>
```
`<StrictMode>` calls `Item` twice per tag on startup, exposing the outside variable mutation immediately.
:::
::: col title="Pure Item in <StrictMode>" tag="first load shows 1, 2, 3" tone=good
```page size=mini
heading: My Shopping List
line: 1. Milk | good
line: 2. Bread | good
line: 3. Eggs | good
line: Dark mode
```
```dom
<div id="root">
+ <main class="page"> | note: Zero <StrictMode> nodes in the DOM
    <h1>My Shopping List</h1>
    <ul>
+     <li>1. Milk</li>
+     <li>2. Bread</li>
+     <li>3. Eggs</li>
    </ul>
    <button class="theme-btn">Dark mode</button>
  </main>
</div>
```
Calling the pure `Item` twice with the same props returns the exact same `<li>` both times.
:::
:::

Here is how the impure `Item` and the pure `Item` compare across development and production:

| Setup | On First Load | After 1st Click on `Dark mode` |
| :--- | :--- | :--- |
| **Impure `Item` without `<StrictMode>`** | `1. Milk`, `2. Bread`, `3. Eggs` | `4. Milk`, `5. Bread`, `6. Eggs` |
| **Impure `Item` with `<StrictMode>` in `npm run dev`** | `2. Milk`, `4. Bread`, `6. Eggs` | `8. Milk`, `10. Bread`, `12. Eggs` |
| **Impure `Item` with `<StrictMode>` in `npm run build`** | `1. Milk`, `2. Bread`, `3. Eggs` | `4. Milk`, `5. Bread`, `6. Eggs` |
| **Pure `Item` with `<StrictMode>` in dev and prod** | `1. Milk`, `2. Bread`, `3. Eggs` | `1. Milk`, `2. Bread`, `3. Eggs` |

Keep three architectural invariants about `<StrictMode>` in mind for technical interviews:
1. **Scope of Double Invocation**: In development, `<StrictMode>` double-invokes component function bodies, `useState` initializer functions, and reducer functions. It never calls event handlers twice.
2. **Zero Cost in Production**: In production builds created by `npm run build`, `<StrictMode>` is completely inactive. Leaving it in your startup file introduces zero runtime overhead.
3. **Subtree Boundary Scoping**: You can wrap the entire application in `<StrictMode>`, or wrap only one branch of a large application tree while migrating older code. Inside a branch wrapped by `<StrictMode>`, there is no way for a child component to opt out.

> [!PRINCIPLE]
> **Principle 2: `<StrictMode>`: Double Rendering in Development Catches Impure Components on Load**
>
> *Keep `<StrictMode>` around `<App />` in the startup file; when a component looks wrong, fix the impure code instead of removing the wrapper.*
>
> When developers see doubled numbers on the screen in development, their first instinct is often to delete `<StrictMode>` from the startup file. Do not fall into that trap! In development, `<StrictMode>` calls every component function twice on purpose to check whether the second call changes the answer. If the screen looks wrong when a component runs twice, that component is changing something outside itself during render. Removing `<StrictMode>` only hides the bug until a real user triggers a re-render.
>
> **DO THIS:**
> ```jsx title="src/main.jsx"
> root.render(
>   ~<StrictMode>~ {/* Keeps double-render purity checks active in development */}
>     <App />
>   </StrictMode>
> );
> ```
>
> **DO NOT DO THIS:**
> ```jsx title="src/main.jsx"
> ~root.render(<App />)~; // **WRONG:** deleting StrictMode hides render bugs until a user clicks!
> ```

---

## 3. Principle 3: Heap Reference Invariance: Never Mutate Incoming Objects or Props During Render

### Shared Heap References vs. Local Stack Allocations

In JavaScript, objects and arrays are passed by reference pointer, not cloned by value. Calling mutating methods like `.push` on an incoming prop array alters the exact heap memory shared by outside callers.

Compare two ways to add a reminder item to a grocery list:

```js title="Way 1: Pushing into an array that existed BEFORE the function ran"
const groceries = ['Milk', 'Bread', 'Eggs'];

function addBagsOutside() {
  ~groceries.push('Shopping bags')~; // **WRONG:** mutates the outside groceries array in place!
  return groceries.join(', ');
}
```

Now compare that with a function that creates a fresh local array with `.slice` inside the function and pushes into that local copy:

```js title="Way 2: Pushing into a fresh array created INSIDE the function"
const groceries = ['Milk', 'Bread', 'Eggs'];

function addBagsLocal(items) {
  const ~list = items.slice()~; // 1. Creates a brand-new array copy inside this call
  ~list.push('Shopping bags')~; // 2. Local mutation: changes only the brand-new copy!
  return list.join(', ');
}
```

**Look at `groceries.push` in Way 1 and `list.push` in Way 2. Both lines call `.push`, and on the very first call both functions return the exact same text. It may look the same, and it may work the same on the first call, but it is NOT the same thing!**

Look at the architectural trade-offs between shared heap mutation and local allocation:
- **Choice A: Shared Heap Reference Mutation with `groceries.push`.** Mutates an array that existed before the function executed. Every render modifies shared heap memory, compounding duplicate entries across re-renders.
- **Choice B: Local Stack Allocation with `items.slice`.** Allocates a fresh array on the heap whose reference is scoped strictly to the current call frame. Calling `push` on this local clone is called **local mutation**. React allows local mutation completely because no code outside that single render can ever observe the new array.

Two foundational nuances clear up common confusion in technical interviews:
1. **Why Way 1 breaks on the second call while Way 2 stays clean**: In Way 1, `groceries` existed before `addBagsOutside` ran. Every call appends another item to the exact same array in heap memory. In Way 2, `items.slice` allocates a separate heap array for `list`. Pushing into `list` modifies only that local copy. When rendering finishes, the local array is garbage-collected, and the original `groceries` array remains untouched.
2. **Is calling `.push` during render always forbidden in React?** No! What React forbids is mutating an array or object that already existed before the render started, such as a prop or a module-level array. Creating a brand-new array inside the component and calling `.push` on it during that same render is called **local mutation**. React allows local mutation completely because no code outside that single render can ever see the new array.

```tree caption="Mutating an array that came from outside the render vs. mutating a brand-new array created inside the same render."
Two kinds of array mutation during render
- !Outside mutation [`items.push` on a prop or outside array] | Mutates the **shared heap array** that existed **before** the render | Every render adds another `'Shopping bags'` to the same array!
- +Local mutation [`list.push` on `items.slice` or `[]` made in this render] | Mutates a **fresh array allocation** created **inside** this render | Original array stays **3 items long**, and every render outputs `'Shopping bags'` **once**
```

### The Prop Mutation Cascade: Child Pushes Altering Parent Heap Memory

Let us see how outside array mutation breaks our shopping list page. We want to add a summary component below the list that joins the grocery items into one sentence and adds `'Shopping bags'` as a reminder at the end.

First, in the main file, we place a three-item grocery array at the top and pass it to the summary component:

```jsx title="src/App.jsx" startLine="1"
import { useState } from 'react';
import Item from './components/Item.jsx';
import ListSummary from './components/ListSummary.jsx';

~const groceries = ['Milk', 'Bread', 'Eggs']~; // 1. Array of 3 items created outside App

export default function App() {
  const [dark, setDark] = useState(false);

  function handleToggle() {
    setDark(!dark);
  }

  return (
    <main className={dark ? 'page dark' : 'page'}>
      <h1>My Shopping List</h1>
      <ul>
        <Item number={1} name="Milk" />
        <Item number={2} name="Bread" />
        <Item number={3} name="Eggs" />
      </ul>
      ~<ListSummary items={groceries} />~ {/* 2. Passes groceries into ListSummary as the items prop */}
      <button className="theme-btn" onClick={handleToggle}>
        {dark ? 'Light mode' : 'Dark mode'}
      </button>
    </main>
  );
}
```

Next, in the summary file, a developer pushes the reminder item directly into the incoming prop array:

```jsx title="src/components/ListSummary.jsx" startLine="1"
export default function ListSummary({ items }) {
  ~items.push('Shopping bags')~; // **WRONG:** mutates the items prop array that came from App!
  return <p className="summary">You need: {items.join(', ')}</p>;
}
```

The summary line corrupts immediately on mount. Under `<StrictMode>`, the page opens displaying duplicate reminder tags for Shopping bags, and every subsequent theme switch appends two more copies:
1. **On the very first load**: The summary line already ends with **`Shopping bags`** repeated **twice**.
2. **After clicking Dark mode once**: The summary line grows to **four** copies of `Shopping bags` at the end.
3. **After clicking Light mode a second time**: The summary line grows to **six** copies of `Shopping bags`, with zero Console warnings.

### JavaScript Object Reference Passing: Props Are Pointers, Not Clones

Props are passed by reference rather than copied; calling mutating array methods on prop objects alters parent component memory and permanently compounds across re-renders.

Both `groceries` in the main file and `items` in the summary file point to the exact same array in heap memory:
1. When the main file loads, JavaScript allocates one three-item array in memory and names it `groceries`.
2. When `App` renders the summary tag, React passes that reference pointer into the child component as `props.items`.
3. On the first Strict Mode call in development, `items.push` adds a fourth item directly into that shared array, setting the array length to 4.
4. On the second development call during that initial load, `ListSummary` receives the same array reference. It pushes a fifth item and increases array length to 5, displaying Shopping bags twice on screen.
5. In production without double calls, the first load pushes array length to 4. The first click on Dark mode pushes it to 5, repeating Shopping bags for real shoppers.

```tree dir=right caption="Because props.items points to the same array as groceries, items.push mutates groceries in place."
How items.push inside ListSummary corrupts groceries in App
- +1. App.jsx loads [`const groceries = ['Milk', 'Bread', 'Eggs']`] | Creates **one array** in memory with **length `3`**
- !2. 1st call to ListSummary [`items.push` on shared array] | `items` points to `groceries`; mutates it to **length `4`**
- !3. 2nd <StrictMode> call [`items.push` on same array] | Mutates `groceries` to **length `5`** | Page shows **`Shopping bags, Shopping bags`** on first load!
```

### Local Array Clones: Isolating Mutations to Ephemeral Render Scope

Cloning incoming arrays via `.slice` allocates a fresh heap object for the current render pass, allowing safe local mutation without leaking side effects into parent state.

In the summary file, copy the incoming prop array first with `.slice` and push the reminder item into that local copy:

```jsx title="src/components/ListSummary.jsx" startLine="1"
export default function ListSummary({ items }) {
  const ~list = items.slice()~; // 1. Makes a brand-new copy of items inside this render
  ~list.push('Shopping bags')~; // 2. Local mutation: adds 'Shopping bags' only to the new copy
  return <p className="summary">You need: {~list.join(', ')~}</p>; // 3. Joins the 4-item local copy
}
```

Follow what happens in memory on each render pass:
1. Each time React calls `ListSummary`, calling `items.slice` allocates a brand-new three-item array in memory.
2. Calling `list.push` adds Shopping bags only to that local copy, leaving the original `groceries` array untouched at three items.
3. Calling `list.join` formats the four-item local copy into a single comma-separated text string.
4. On the second Strict Mode call and on every theme click, `items.slice` copies the untouched three-item array again, displaying Shopping bags once every single time.

::: row caption="Mutating the items prop array directly vs. copying it into a local list array with .slice before calling .push."
::: col title="Outside Mutation: items.push" tag="repeats Shopping bags" tone=bad
```page size=mini
heading: My Shopping List
line: 1. Milk
line: 2. Bread
line: 3. Eggs
line: You need: Milk, Bread, Eggs, Shopping bags, Shopping bags | bad
line: Dark mode
```
```jsx title="src/components/ListSummary.jsx" bad="2"
export default function ListSummary({ items }) {
  items.push('Shopping bags');
  return <p className="summary">You need: {items.join(', ')}</p>;
}
```
`items` is the parent's `groceries` array, so every render pushes another copy of the reminder into it.
:::
::: col title="Local Mutation: items.slice then list.push" tag="Shopping bags appears once" tone=good
```page size=mini
heading: My Shopping List
line: 1. Milk
line: 2. Bread
line: 3. Eggs
line: You need: Milk, Bread, Eggs, Shopping bags | good
line: Dark mode
```
```jsx title="src/components/ListSummary.jsx" good="2,3"
export default function ListSummary({ items }) {
  const list = items.slice();
  list.push('Shopping bags');
  return <p className="summary">You need: {list.join(', ')}</p>;
}
```
`items.slice` creates a fresh array inside this render, leaving `groceries` at 3 items.
:::
:::

> [!PRINCIPLE]
> **Principle 3: Outside vs. Local Mutation: Never Mutate an Array That Existed Before the Render**
>
> *Never call `.push` on an array that came from outside the component; copy the array first with `.slice` or create a new local array.*
>
> Passing an array through `props` does not hand your component a copy. It hands your component the exact same array in memory that the parent holds. If you call `.push` on that prop, you write directly onto the parent's shared array. Then every re-render and every `<StrictMode>` check adds another duplicate item to the end. If you first make a fresh copy with `.slice`, calling `.push` on that new copy is called local mutation. Local mutation is completely safe because nothing outside this single render can ever see the new array.
>
> **DO THIS:**
> ```jsx title="src/components/ListSummary.jsx"
> export default function ListSummary({ items }) {
>   const ~list = items.slice()~; // 1. Copy the prop array into a new local array first
>   ~list.push('Shopping bags')~; // 2. Safe local mutation on the new copy
>   return <p className="summary">You need: {list.join(', ')}</p>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx title="src/components/ListSummary.jsx"
> export default function ListSummary({ items }) {
>   ~items.push('Shopping bags')~; // **WRONG:** mutates the parent's array in place on every render!
>   return <p className="summary">You need: {items.join(', ')}</p>;
> }
> ```

---

## 4. Principle 4: Asynchronous Side Effect Isolation: Confining State and DOM Mutations to Event Handlers

### Synchronous Render Calculation vs. Asynchronous Event Dispatch

React evaluates the component body synchronously during the Render Phase to compute JSX descriptions. Event handlers execute asynchronously on the browser event loop in response to user actions during the Event Phase.

Look at two places inside `App` where you might try to increment a counter and log it to the Console.

First, look at those two lines placed directly at the top level of the component body, above `return`:

```jsx title="Place A: Side effect written directly in the component body"
let switches = 0;

function App() {
  ~switches = switches + 1~; // **WRONG:** sits in the component body -> runs on EVERY render!
  ~console.log('Theme switches counted:', switches)~; // Logs twice on load in StrictMode before any click!

  return <button>Dark mode</button>;
}
```

Now compare that with putting the exact same two lines inside a click handler function:

```jsx title="Place B: Side effect written inside the handleToggle event handler"
let switches = 0;

function App() {
  function handleToggle() {
    ~switches = switches + 1~; // Sits inside handleToggle -> runs ONLY when the user clicks!
    ~console.log('Theme switches counted:', switches)~; // Logs 0 times on load, and once per click!
  }

  return <button ~onClick={handleToggle}~>Dark mode</button>; // Hands handleToggle to React for clicks
}
```

Compare the architectural trade-offs between component body code and event handlers:
- **Choice A: Side Effects in Component Body: Render Phase.** Evaluated synchronously on every render and double-called by `<StrictMode>`. It counts component renders rather than user interactions, polluting the Console and triggering uncontrolled mutations.
- **Choice B: Side Effects in Event Handlers: Event Phase.** Evaluated asynchronously on the browser event loop only when user events fire. It runs exactly once per user action and is completely immune to `<StrictMode>` double-render probes.

**Because both snippets sit inside the curly braces of `App`, it looks as if both run whenever `App` renders, but they are NOT the same thing!**

Here is the exact boundary that separates them:
- **Lines at the top level of the component body**, as in Place A, run **during render**, every single time React calls `App`. That includes initial mount, development `<StrictMode>` checks, and every state re-render.
- **Lines inside an event handler function**, as in Place B, do **not** run during render. During render, JavaScript only instantiates the `handleToggle` function definition and passes it to `onClick={handleToggle}`. React calls `handleToggle` **only when the shopper clicks the button**. Because event handlers do not run during render, **event handlers do not need to be pure**, and **`<StrictMode>` never calls event handlers twice**!

```tree caption="How to tell whether code inside a component runs during render or only when the user acts."
Two places inside function App
- !Top-level component body [lines outside any inner function] | Runs **during render** on startup, in `<StrictMode>`, and on every re-render | ~Do **NOT** put side effects here: counts **renders**, not user clicks!
- +Inside an event handler [`function handleToggle` passed to `onClick`] | Defined during render, **but runs ONLY when the user clicks** | +**DO** put side effects here: `<StrictMode>` calls it **once per click**
```

### The Phantom Counter Bug: Counting Component Renders Instead of User Clicks

Suppose our product team asks us to count how many times shoppers switch the page theme between light and dark. Each time they switch, we want to print `Theme switches counted:` with the current number in the Console.

First, a developer creates a counter variable at the top of the main file and increments it directly inside the component body:

```jsx title="src/App.jsx" startLine="1"
import { useState } from 'react';
import Item from './components/Item.jsx';
import ListSummary from './components/ListSummary.jsx';

const groceries = ['Milk', 'Bread', 'Eggs'];
~let switches = 0~; // 1. Counter outside App

export default function App() {
  const [dark, setDark] = useState(false);

  ~switches = switches + 1~; // **WRONG:** top-level body runs on every render, not on click!
  ~console.log('Theme switches counted:', switches)~; // **WRONG:** logs during render!

  function handleToggle() {
    setDark(!dark);
  }
```

Below `handleToggle`, `App` returns the shopping list markup:

```jsx title="src/App.jsx" startLine="18"
  return (
    <main className={dark ? 'page dark' : 'page'}>
      <h1>My Shopping List</h1>
      <ul>
        <Item number={1} name="Milk" />
        <Item number={2} name="Bread" />
        <Item number={3} name="Eggs" />
      </ul>
      <ListSummary items={groceries} />
      <button className="theme-btn" onClick={handleToggle}>
        {dark ? 'Light mode' : 'Dark mode'}
      </button>
    </main>
  );
}
```

The developer console records phantom user actions before any interaction occurs: loading the page logs counts 1 and 2, and every theme switch logs two extra increments:
1. **On the first load, before anyone clicks the button**: The Console already logs counts `1` and `2`!
2. **After the 1st click on Dark mode**: The Console logs counts `3` and `4`.
3. **After the 2nd click on Light mode**: The Console reaches counts `5` and `6` for just two clicks!

Even in production builds where `<StrictMode>` does not double-call `App`, loading the page still logs a count of 1 when the shopper has clicked zero times. Two clicks then log 3, because code in the component body counts **renders of `App`**, not **clicks on the button**!

### Event Handler Encapsulation: Executing Side Effects on User Action Only

To count real theme switches, move the counter increment and the log out of the component body into the click handler:

```jsx title="src/App.jsx" startLine="1"
import { useState } from 'react';
import Item from './components/Item.jsx';
import ListSummary from './components/ListSummary.jsx';

const groceries = ['Milk', 'Bread', 'Eggs'];
let switches = 0;

export default function App() {
  const [dark, setDark] = useState(false);

  function handleToggle() {
    ~switches = switches + 1~; // 1. Runs ONLY when the shopper clicks the button
    ~console.log('Theme switches counted:', switches)~; // 2. Logs 1 on the 1st click and 2 on the 2nd click
    setDark(!dark);
  }
```

### Event Phase Immunity: Handlers Fire Only on Browser Event Loop Dispatches

React renders components by executing their bodies to produce JSX. It invokes event handlers only when browser events fire. Because handlers never run during render, Strict Mode never double-invokes them.

Follow what JavaScript and React do in order:
1. **On initial load**: `<StrictMode>` calls `App` twice. Each call creates the `handleToggle` function and returns the JSX, without ever running the lines inside `handleToggle`. The Console stays completely empty on load!
2. **On the 1st click of Dark mode**: The browser event loop dispatches the click event, and React calls `handleToggle` **once**. That call changes `switches` from 0 to 1, logs 1 to the Console, and calls `setDark` to trigger a re-render.
3. **During the re-render**: `<StrictMode>` calls `App` twice again to compute the dark-mode JSX. Again, `handleToggle` is only defined, not called, so `switches` stays at 1.
4. **On the 2nd click of Light mode**: React calls `handleToggle` once more, `switches` becomes 2, and the Console logs 2!

::: row caption="Console output after loading the page and clicking the theme button twice in development with <StrictMode>."
::: col title="Side Effect in App Body" tag="logs 1 to 6 for 2 clicks" tone=bad
```devconsole
+ Theme switches counted: 1 | App.jsx:12
+ Theme switches counted: 2 | App.jsx:12
+ Theme switches counted: 3 | App.jsx:12
+ Theme switches counted: 4 | App.jsx:12
+ Theme switches counted: 5 | App.jsx:12
+ Theme switches counted: 6 | App.jsx:12
```
```jsx title="src/App.jsx" bad="4,5"
export default function App() {
  const [dark, setDark] = useState(false);

  switches = switches + 1;
  console.log('Theme switches counted:', switches);
```
Code in the component body runs twice on load and twice on every re-render.
:::
::: col title="Side Effect in handleToggle" tag="logs 1 and 2 for 2 clicks" tone=good
```devconsole
+ Theme switches counted: 1 | App.jsx:13
+ Theme switches counted: 2 | App.jsx:13
```
```jsx title="src/App.jsx" good="4,5"
export default function App() {
  const [dark, setDark] = useState(false);

  function handleToggle() {
    switches = switches + 1;
    console.log('Theme switches counted:', switches);
    setDark(!dark);
  }
```
Code inside `handleToggle` runs 0 times on load and once per user click.
:::
:::

### Architectural Rationale: Server Rendering, Render Memoization, and Concurrent Interruptibility

Directly mutating the DOM inside the component body, such as setting `document.title` or changing `document.body.className`, is also a side effect during render. Whenever a change can be expressed as JSX, return it in your JSX instead. That is why our main component sets `className` on the `<main>` tag in JSX so React updates the class during the commit step. Some side effects cannot be expressed in JSX and do not come from a user event. For those, React provides **`useEffect`**, which runs after the render commits to the screen (as taught in Lesson 32).

Pure rendering unlocks three powerful architectural optimizations across your application:
1. **Server-Side Rendering**: React can run the exact same component on a server across thousands of concurrent incoming HTTP requests without one request mutating variables seen by another request.
2. **Render Memoization**: When a component's inputs have not changed, React can safely skip calling it again with `memo`. A pure component is guaranteed to return the exact same JSX for identical inputs.
3. **Concurrent Interruptibility**: React can pause, discard, or restart render computations mid-stream when higher-priority user input arrives, abandoning half-finished calculations with zero persistent side effects left behind.

```tree caption="Why React requires every component function to stay pure during render."
Three reasons React insists on pure rendering
- +1. Server rendering | The same component can run for **many requests** without leaking outside variables between users
- +2. Skipping renders [`memo`] | When inputs stay the same, React can **skip calling the component** because its output cannot change
- +3. Restarting renders | React can **stop a render mid-way** when new data arrives and start over with **zero side effects** left behind
```

> [!PRINCIPLE]
> **Principle 4: Where Side Effects Belong: Put Side Effects in Event Handlers, Never in the Component Body**
>
> *Keep the component body strictly for pure JSX calculations; place side effects like counting clicks or logging into event handlers like `onClick`, with `useEffect` last.*
>
> Because an event handler function is written inside your component, it is easy to assume it runs whenever the component renders. It does not! Any line written directly at the top level of the component body runs on every render, including initial load and `<StrictMode>` double checks. A counter placed in the component body counts renders instead of user clicks. Lines inside an event handler like `handleToggle` run only when the user actually clicks the button. Event handlers do not need to be pure, and `<StrictMode>` never calls them twice.
>
> **DO THIS:**
> ```jsx title="src/App.jsx"
> function handleToggle() {
>   ~switches = switches + 1~; // Runs only when the button is clicked, never during render
>   console.log('Theme switches counted:', switches);
>   setDark(!dark);
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx title="src/App.jsx"
> export default function App() {
>   ~switches = switches + 1~; // **WRONG:** sits in the component body and runs on every render!
>   console.log('Theme switches counted:', switches);
>   return <main>...</main>;
> }
> ```

---

## Putting All Four Principles Together

### The Complete Pure Component Pipeline

Here are all four source files of our shopping list project working together with every principle in place.

First, our startup file wraps the main component in `<StrictMode>` so React checks every component for purity in development:

```jsx title="src/main.jsx"
import { ~StrictMode~ } from 'react'; // Principle 2: Calls every component twice in development
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  ~<StrictMode>~ {/* Keeps double-render purity checks active in development */}
    <App />
  </StrictMode>
);
```

Second, our item file exports a pure component that reads the item position and name from its props and changes nothing outside itself:

```jsx title="src/components/Item.jsx"
export default function Item({ ~number, name~ }) { // Principle 1: Pure component -> same props always return the same JSX
  return <li>~{number}~. {name}</li>; // No outside counter mutated during render
}
```

Third, our summary file copies the incoming prop array with `.slice` before calling `.push`, keeping the array mutation local to this render:

```jsx title="src/components/ListSummary.jsx"
export default function ListSummary({ items }) {
  const ~list = items.slice()~; // Principle 3: Copies the prop array into a fresh local array
  ~list.push('Shopping bags')~; // Local mutation on the copy leaves the parent's groceries array untouched
  return <p className="summary">You need: {list.join(', ')}</p>;
}
```

Fourth, our main file keeps its component body pure and places the counter side effect inside the `handleToggle` event handler:

```jsx title="src/App.jsx"
import { useState } from 'react';
import Item from './components/Item.jsx';
import ListSummary from './components/ListSummary.jsx';

const groceries = ['Milk', 'Bread', 'Eggs'];
let switches = 0;

export default function App() {
  const [dark, setDark] = useState(false);

  function handleToggle() {
    ~switches = switches + 1~; // Principle 4: Side effect lives inside the click handler, not in render
    ~console.log('Theme switches counted:', switches)~; // Logs once per click
    setDark(!dark);
  }

  return (
    <main className={dark ? 'page dark' : 'page'}>
      <h1>My Shopping List</h1>
      <ul>
        ~<Item number={1} name="Milk" />~ {/* Principle 1: Passes each item number via props */}
        <Item number={2} name="Bread" />
        <Item number={3} name="Eggs" />
      </ul>
      ~<ListSummary items={groceries} />~ {/* Principle 3: groceries stays 3 items long across every render */}
      <button className="theme-btn" onClick={handleToggle}>
        {dark ? 'Light mode' : 'Dark mode'}
      </button>
    </main>
  );
}
```

### End-to-End Execution Flow: Component Evaluation and Event Dispatch

When the page loads and the shopper clicks Dark mode once, the list numbers stay 1, 2, and 3. The summary line shows `Shopping bags` once, and the Console logs one theme switch:

```page caption="The finished My Shopping List page after clicking Dark mode once: numbers stay 1, 2, 3, Shopping bags appears once, and the Console logs 1 theme switch."
heading: My Shopping List
line: 1. Milk | good
line: 2. Bread | good
line: 3. Eggs | good
line: You need: Milk, Bread, Eggs, Shopping bags | good
line: Light mode
console: Theme switches counted: 1 | good
```

```tree caption="How React renders App, the three Item tags, and ListSummary while keeping side effects inside handleToggle."
`App` [pure render body] | Reads `dark` state and returns `<main>` without running `handleToggle`
- +`Item` #1 [`number={1}` `name="Milk"`] | Pure component | Returns `<li>1. Milk</li>` on every render
- +`Item` #2 [`number={2}` `name="Bread"`] | Pure component | Returns `<li>2. Bread</li>` on every render
- +`Item` #3 [`number={3}` `name="Eggs"`] | Pure component | Returns `<li>3. Eggs</li>` on every render
- +`ListSummary` [`items={groceries}`] | Copies `items` with `.slice` then calls `list.push` | Returns `You need: Milk, Bread, Eggs, Shopping bags` while `groceries` stays length `3`
- +`handleToggle` [on `<button onClick={handleToggle}>`] | Runs **only when clicked**, never during render | Increments `switches`, logs once per click, and calls `setDark`
```

| Aspect | The Impure Habit | The React Rule |
| :--- | :--- | :--- |
| **Numbering or configuring items** | Increment an outside `let number = 0` variable inside the component body during render | Pass `number` in as a prop so the same inputs always return the same JSX |
| **When `<StrictMode>` shows doubled output** | Delete `<StrictMode>` from the startup file so the first load looks right | Keep `<StrictMode>` enabled and fix the outside mutation that its double render exposed |
| **Adding an item to an array for display** | Call `items.push` directly on the incoming prop array during render | Copy the array first with `items.slice` or create a brand-new local array inside the same render |
| **Counting clicks or running side effects** | Put the counter or `console.log` at the top level of the component body | Put side effects inside an event handler like `handleToggle`, which never runs during render |

---

## For the Interview

> **The Interview Question:** What does it mean for a component to be pure, and what breaks across renders when it is not?

### How to Answer Clearly in 30 Seconds

"In React, a component is pure when it follows the two rules of a pure function:
1. **It minds its own business**: it does not mutate any variable, array, or object that existed before React called it.
2. **Same inputs, same output**: given the same `props` and `state` inputs, it always returns the exact same JSX.

When a component breaks purity during render, such as incrementing an outside `let` variable or calling `.push` on a prop array, the first load may look fine. However, its output changes on every re-render even when its props never changed. Item numbers climb on every state update, and pushed array items repeat over and over.

To catch these bugs early, `<StrictMode>` calls every component function twice in development. A pure component is unaffected, while an impure component shows its bug on the first load. Changing a brand-new array or object created inside the same render is called **local mutation**, and it is completely fine because nothing outside the render sees it. Finally, **side effects** belong in **event handlers** like `onClick`, which run only when the user acts and never during render, or in `useEffect` as a last resort. React insists on pure rendering so it can safely render components on the server, skip unchanged renders with `memo`, and stop or restart renders at any time."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why does my component run twice in development, and should I remove `<StrictMode>` to stop it?"**
   **No, never remove `<StrictMode>` to fix a bug.** In development, `<StrictMode>` intentionally calls every component function twice on each render to test whether it is pure. If calling your component a second time changes what appears on the screen, your component is mutating something that existed before the render. Removing `<StrictMode>` or building for production with `npm run build` makes the component run once on load. That only hides the bug until the next state update triggers a re-render.
2. **"If React forbids mutating arrays during render, why is it okay to call `.push` on an array created inside the component?"**
   Purity only requires that a component not change anything that existed before the render started. A prop array or a module-level array existed before the render and is shared across renders, so calling `.push` on it changes the input for future renders. An array created inside the component during the current render, such as `items.slice` or an empty array literal, is brand-new on every call. React calls changing that new array **local mutation**, and it is safe because no code outside that render can observe it.
3. **"How can you tell whether code inside a component runs during render, and why don't event handlers need to be pure?"**
   Any code written at the top level of the component function body runs during render, every time React calls the component. Code written inside an event handler like `handleToggle` is only defined during render; React runs it only when the user triggers the event. Because event handlers do not run during render, they do not need to be pure and `<StrictMode>` does not call them twice. That makes event handlers the primary place for side effects.

```tree dir=right caption="Interview comparison: code in the component body vs. code inside an event handler."
Component body vs. Event handler in an interview
- +Component body [runs during render] | Must be **pure** and **idempotent** | Called **twice** by `<StrictMode>` in development; allows **local mutation** only
- +Event handler [runs on user action] | Does **not** run during render and **need not be pure** | Called **once per event**; the right place for **side effects**
```
