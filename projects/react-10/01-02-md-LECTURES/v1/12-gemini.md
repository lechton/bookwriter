# Lecture 12: Component Memory with useState
> INTERVIEW QUESTION | ❱ CORE | Why do ordinary variables forget their values between renders, and how does useState remember?

---

## The Stateless Function Dilemma: Why Components Need External Fiber Memory

### Ephemeral Local Variables vs. Persistent React State

In JavaScript, functions forget everything once they finish running. When a function executes, JavaScript creates temporary variables in local memory, returns a value, and clears that memory immediately. When you call the function again, it starts over from scratch.

A React component is just a JavaScript function. When a user clicks a button, types into a box, or opens a menu, that component must remember what changed and update the screen.

Look at what happens when you build a counter with an ordinary local variable versus React `useState` Hook:

```jsx title="Option 1: A plain local let variable inside a component"
function Counter() {
  ~let count = 0;~ // 1. Allocated fresh on every single render

  function handleClick() {
    ~count = count + 1;~ // 2. Modifies local stack memory, but never notifies React!
  }

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

Now compare that with the React state Hook:

```jsx title="Option 2: Component memory with useState"
import { ~useState~ } from 'react'; // 1. Import useState from React

function Counter() {
  const ~[count, setCount]~ = useState(0); // 2. React stores count externally on the component Fiber node

  function handleClick() {
    ~setCount(count + 1);~ // 3. Dispatches next value to React and schedules a re-render!
  }

  return <button onClick={handleClick}>Count: {count}</button>;
}
```

**These two versions look different in the code, and they behave differently on the very first click: Option 1 stays frozen at `Count: 0`, while Option 2 climbs to `Count: 1`. Yet developers coming from plain JavaScript often assume a local `let` variable and an increment statement should update the button.**

In Option 1, clicking the button leaves the screen completely frozen on `Count: 0`. A plain local `let` variable fails to update the screen for two physical reasons:
1. **Mutating local variables never notifies React**: Writing `count = count + 1` changes a local number in silence. Even if you log `count` to the Console and watch it climb on every click, React does not listen to plain variables and gets no signal that data changed, so it never re-renders the component.
2. **Re-rendering destroys and recreates local variables**: Even if the component re-renders when its parent updates, React runs `Counter` from line 1 again. The line `let count = 0` runs all over again, immediately wiping out your click.

In Option 2, calling `useState` tells React to store the value in memory outside the component function. When the function finishes running, React keeps the count safe. Calling `setCount` updates that stored value and tells React to re-render immediately.

Look at the three core terms of React component memory:
1. **State**: Memory that React stores outside your function so values survive between renders.
2. **Hook**: A special function whose name starts with `use`, such as `useState`, that connects your component to React memory and lifecycle systems.
3. **The two returned items**: Calling `useState` returns an array with two items. Item 0 is the current state value, and item 1 is the setter function that updates the value and triggers a re-render.

```tree caption="Why a plain local let variable leaves the screen frozen while useState remembers values across renders."
Two ways to store data inside a component
- !Plain local variable [`let count = 0`] | Stack frame destroyed when function returns | Mutating variable **never notifies React**, so the UI stays frozen
- +React state Hook [`[count, setCount]`] | Stored externally on React **Fiber node** | Calling `setCount` **saves the next value** and **triggers a re-render**
```

### Array Destructuring: Unpacking Tuple Positions into Arbitrary Names

The square brackets around `[count, setCount]` are standard JavaScript array destructuring syntax.

Calling `useState` returns an array with two items: item 0 is the value, and item 1 is the setter function. You could read those two items one by one using array index numbers:

```jsx title="Reading the two array items by index 0 and 1"
const ~pair~ = useState(0); // 1. Returns a two-item array: [0, function]
const ~count = pair[0]~; // 2. First item at index 0 is the current value
const ~setCount = pair[1]~; // 3. Second item at index 1 is the setter function
```

Instead of writing three lines, JavaScript lets you unpack both items by position in a single line using square brackets:

```jsx title="The shortcut: unpacking both array items with [count, setCount]"
const ~[count, setCount]~ = useState(0); // Exact same thing as reading pair[0] and pair[1]!
```

**These two ways of unpacking the returned array look different in the code, one taking three lines with `[0]` and `[1]` and the other taking one line with `[count, setCount]`, yet both do the exact same job.** Unpacking an array with square brackets on the left side of `=` is standard JavaScript array destructuring. Because arrays store items by position rather than property names, you can choose any local variable names that fit your component, following the `[something, setSomething]` convention.

```tree caption="Reading pair[0] and pair[1] by index is the exact same thing as array destructuring with [count, setCount]."
Two ways to unpack the two-item array returned by `useState`
- +1. Read by index one by one [`pair[0]` and `pair[1]`] | Reads item `0` into `count` and item `1` into `setCount` | Takes **three lines** of code
- +2. Unpack with array destructuring [`[count, setCount]`] | Unpacks item `0` and item `1` **in one line** | **Exact same result**; you can choose any names you like
```

### The Interactive Story Card: Independent Counters and Toggles on Screen

Now look at where component memory matters on a real page. Suppose our reading app displays a news card with a Like button and a Show summary button.

Each interaction on that card needs memory that survives between renders and updates the screen:
1. When a reader clicks Like, the card must add one to its like count and show the new number on screen right away.
2. When a reader clicks Show summary, the card must change the button text to Hide summary and display the summary paragraph below the buttons.
3. When two story cards sit side by side on the page, clicking a button on the first card must update only that first card, leaving the second card count and summary untouched.

As our story card grows through this lesson, we configure `useState` in three ways:
1. **Pass a simple starting value directly**: When your starting value is a plain number or boolean like `0` or `false`, pass it directly to the Hook.
2. **Pass an initializer function without parentheses**: When calculating the starting value requires calling a setup function, pass that function reference without parentheses so React runs it only once on mount.
3. **Call `useState` multiple times at the top level**: When one component tracks two independent pieces of data, call `useState` once for each piece at the very top of your component function.

```tree caption="The three ways we set up useState as our story card grows across this chapter."
Three ways to set up state with `useState`
- +Simple starting value [`0` or `false`] | Best when the starting value is **already a simple value** | React uses it on the **first render** and ignores it on re-renders
- +Initializer function [Passed by name without parentheses] | Best when computing the starting value **calls a function** | React calls the function **only once** on the first render
- +Multiple `useState` calls [Two or more Hooks at the top] | Best when a component tracks **independent pieces of memory** | Called in the **exact same top-level order** on every render
```

### Prerequisites and File Architecture

This lesson builds on three concepts from earlier lessons:
1. **Object destructuring vs. array destructuring**: Curly braces `{ title }` match fixed property names on an object, whereas square brackets `[count, setCount]` unpack array items by position (as seen in Lesson 08).
2. **Conditional rendering**: Inside JSX, the ternary operator `? :` switches button labels between Hide and Show, and logical `&&` renders the summary paragraph only when its condition is true (as seen in Lesson 10).
3. **Passing a function reference vs. calling a function**: Writing `onClick={handleClick}` without parentheses passes the function itself so it runs on user interaction, which is the exact same JavaScript rule governing initializer functions passed to `useState` (as seen in Lesson 11).

Our project uses four files on disk. The main application file renders the page heading and story cards, while the card file holds the card state, buttons, and markup:

```files title="story-reader: File Explorer" caption="How our four project files are organized on disk, and what each file exports or imports."
index.html | entry | The HTML page with the root div where React mounts the app
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it into `#root`
  App.jsx | parent | Exports `App` as default and imports `StoryCard` from `./components/StoryCard.jsx`
  components/
    StoryCard.jsx | state | Imports `useState` from `react` and exports `StoryCard` as default
```

### The Four Invariants of Component State

**PRINCIPLES:** A component function runs from top to bottom every time it renders. Any ordinary local variable inside that function is created fresh when the function starts and forgotten when the function finishes. To give a component memory that lasts across renders and updates the screen, React provides the `useState` Hook, governed by four foundational invariants:
1. **Principle 1: Ephemeral Stack Execution: Local Variables Vanish and Never Notify Reconcilers**: Storing changing screen data in a local `let` variable fails because local assignments never schedule a render, and subsequent renders reset local memory back to `0`. Use `useState` so React stores the value in its own memory and re-renders when you call its setter function.
2. **Principle 2: Lazy State Initialization: Pass an Initializer Reference to Defer Setup**: React uses initial state only on mount. If computing that starting value requires calling a setup function, pass the function reference without parentheses so JavaScript does not run expensive setup on every re-render.
3. **Principle 3: Call Order Invariance: React Matches State Slots by Sequential Execution Order**: React identifies multiple `useState` calls by their sequential call order rather than by variable names. Because of that, every Hook must sit unconditionally at the top level of your component, never inside `if` blocks, loops, or after an early return.
4. **Principle 4: Tree-Position Isolation: State Belongs to Rendered Instances, Not Functions**: State belongs to individual rendered component instances in the UI tree, not to the component function definition or file scope. Rendering two cards gives each card its own independent memory, and parent components cannot directly read or change a child card state.

Here is the complete overview of all four principles before we walk through each one:

| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |
| :--- | :--- | :--- | :--- |
| **Principle 1** | **Ephemeral Stack Execution** | Updating a local `let` variable logs incrementing values in the Console while the screen stays frozen on the initial value. | Store changing UI data with `useState` and update it with its setter function so React records the value and schedules a re-render. |
| **Principle 2** | **Lazy State Initialization** | Calling a setup function with parentheses inside `useState` executes that setup on every single render, even though React discards its return value after mount. | Pass the setup function reference without parentheses to `useState` so React invokes it only once during the initial mount. |
| **Principle 3** | **Call Order Invariance** | Placing a `useState` call inside an `if` block or below an early `return` shifts React internal slot index and crashes the application on re-render. | Call every Hook unconditionally at the very top level of the component function so the call order stays identical on every render. |
| **Principle 4** | **Tree-Position Isolation** | Developers often worry that two card tags will share one counter, or they place a `let` variable at module scope and accidentally link all card instances together. | Keep `useState` inside the component function; each rendered card on screen gets its own isolated state array attached to its position in the tree. |

---

## 1. Principle 1: Ephemeral Stack Execution: Local Variables Vanish and Never Notify Reconcilers

### The Two-Fold Failure Mode of Local Variables

When you declare an ordinary variable inside a component function using `let count = 0`, that variable lives only in the temporary memory of that single function call.

A plain local variable fails to update a component for two physical reasons:
1. **Changing a local variable never tells React to re-render**: Writing `likes = likes + 1` changes a number in local memory. Because React does not listen to plain JavaScript variables, React receives no notification and never schedules a re-render.
2. **Every re-render recreates local variables from scratch**: When React re-renders the component, JavaScript runs the function again from line 1. The line `let likes = 0` runs all over again, resetting the variable to zero and erasing your click.

```tree caption="The two separate reasons an ordinary local let variable fails to update a React component."
Why `let likes = 0` inside a component never updates the screen
- !1. Mutating `likes` never triggers a re-render [`likes = likes + 1`] | Changes the local number in memory, **but never notifies React** | React **never calls the component again**, so the screen stays frozen
- !2. Re-rendering resets `likes` from scratch [`let likes = 0` at line 1] | Every render calls your component function **again from the top** | Runs `let likes = 0` **all over again**, wiping out any earlier change
```

### Positional Destructuring and Constant Render Snapshots

When we replace a local variable with `useState`, we unpack the state and its setter function:

Notice why we unpack `props` with curly braces like `{ title }` while unpacking `useState` with square brackets like `[likes, setLikes]`. Objects store values under fixed property names, so curly braces match the exact name of each property (as seen in Lesson 08). Arrays store values by sequential position, so square brackets unpack item 0 and item 1 under any local names you choose:

```js title="Object destructuring with { } vs. array destructuring with [ ]"
const props = { ~title~: 'New Park Opens Today' }; // 1. An object: values are stored under fixed property names
const ~{ title }~ = props; // Curly braces { } match the exact property name "title"

const statePair = ~useState(0)~; // 2. An array: returns [0, function] at position 0 and position 1
const ~[likes, setLikes]~ = statePair; // Square brackets [ ] unpack position 0 and position 1 under any names you choose!
```

Also notice why we declare `likes` with `const` even though the count changes over time.

You never reassign `likes` with `=` yourself. During a single render of your component function, `likes` is a constant snapshot representing the state for that specific render. When you call `setLikes`, React runs the component function again in a brand-new render. In that new render, React creates a fresh `const likes` holding the updated value:

```tree caption="Why props use curly braces { } while useState uses square brackets [ ] and const."
How `[likes, setLikes]` works in JavaScript
- +Square brackets `[ ]` [Array destructuring] | `useState` returns a **two-item array** by position `0` and `1` | Lets you give item `0` and item `1` **any names you want**
- +Declared with `const` [Never reassigned with `=`] | You **never** reassign `likes` with `=` | Each re-render runs the function anew with a **fresh `const likes`** holding the new value
```

### The Silent Failure: Console Logs Advance While the UI Remains Frozen

Now let us start building our reader page and see the local variable defect in action. First, our main file imports the story card and places one card on the page with its title and summary props:

```jsx title="src/App.jsx" startLine="1"
import StoryCard from './components/StoryCard.jsx';

export default function App() {
  return (
    <main>
      <h1>Top Stories</h1>
      ~<StoryCard~ // Renders one story card with its title and summary props
        title="New Park Opens Today"
        summary="The park on Main Street opens at noon."
      />
    </main>
  );
}
```

Inside the card file, suppose a developer stores the like count in a local `let` variable at the top of the function. Inside the click handler, the developer increments that variable and logs the value to the Console:

```jsx title="src/components/StoryCard.jsx" startLine="1"
export default function StoryCard({ title }) {
  ~let likes = 0;~ // **WRONG:** plain local variable forgets its value and never triggers a re-render!

  function handleLike() {
    ~likes = likes + 1;~ // **WRONG:** mutates local variable in silence without telling React!
    console.log('Local likes:', likes);
  }

  return (
    <article className="card">
      <h3>{title}</h3>
      <p className="likes-text">Likes: {likes}</p>
      <button className="like-btn" onClick={handleLike}>
        Like
      </button>
    </article>
  );
}
```

**The user interface is completely frozen. Even though the Console logs incrementing numbers on every click, the screen stays stuck on `Likes: 0`.**

**Mutating a local variable changes local memory in silence without asking React to re-render, leaving the UI frozen.** Here is what happens in order when the user clicks the button:
1. When the page first loads, React calls `StoryCard`, initializes `likes` to zero, and renders `Likes: 0` on the card.
2. The user clicks Like a first time, and then a second time.
3. In the Console, two lines appear: `Local likes: 1` and `Local likes: 2`. That confirms the click handler ran on each click.
4. On the screen, the card remains stuck on `Likes: 0`. Because changing a local variable never notifies React, no re-render happens.

### Reconciler Dispatch: How setLikes Triggers a Fresh Render Pass

To make the card remember its likes and redraw the screen on every click, import React `useState` Hook at the top of the file and allocate state for the like count:

```jsx title="src/components/StoryCard.jsx" startLine="1"
import { ~useState~ } from 'react'; // 1. Import the useState Hook from React

export default function StoryCard({ title }) {
  const ~[likes, setLikes]~ = useState(0); // 2. Unpacks the current likes count and the setLikes setter
```

Inside the click handler, call `setLikes` with the next count so React records the new number and redraws the card:

```jsx title="src/components/StoryCard.jsx" startLine="6"
  function handleLike() {
    ~setLikes(likes + 1);~ // 3. Save the next number in React and request a re-render!
  }

  return (
    <article className="card">
      <h3>{title}</h3>
      <p className="likes-text">Likes: ~{likes}~</p> {/* 4. Displays the latest likes count from React state */}
      <button className="like-btn" onClick={handleLike}>
        Like
      </button>
    </article>
  );
}
```

React handles both memory and re-renders through `useState` and `setLikes`.

**Calling a setter stores the updated value in React memory and schedules a new render, during which `useState` returns the updated value.** Here is how React handles the render cycle step by step:
1. **On the first render**, `StoryCard` calls `useState` with a starting value of `0`. React stores `0` in memory outside `StoryCard` and returns `[0, setLikes]`. The card renders `Likes: 0`.
2. **When the user clicks the button**, `handleLike` passes `1` to `setLikes`.
3. **Inside React**, `setLikes` saves `1` into that memory cell and asks React to re-render `StoryCard`.
4. **On the second render**, React calls `StoryCard` again. This time, `useState` ignores the starting `0`, reads the stored `1` from React memory, and returns `[1, setLikes]`. React calculates the new output and updates the screen to `Likes: 1`.

```tree dir=right caption="What happens step by step from the first render through clicking Like with useState."
How `useState` remembers `likes` across renders
- +1. First render [`useState` with `0`] | React stores `0` in its external memory slot and returns `[0, setLikes]` | Screen shows **`Likes: 0`**
- +2. User clicks `Like` [`setLikes` with `0 + 1`] | `setLikes` saves **`1`** into React memory slot | Tells React to **re-render `StoryCard`**
- +3. Second render [`StoryCard` runs again] | `useState` ignores `0` and returns **`[1, setLikes]`** from React memory | Screen updates to **`Likes: 1`**
```

Use plain local variables only for temporary calculations that do not need to survive across renders or change what is on screen. Whenever a value must persist across renders and update the screen, store it in `useState`:

::: row caption="Clicking Like twice with a local let variable vs. clicking Like twice with useState and setLikes."
::: col title="With Local let likes = 0" tag="screen frozen at Likes: 0" tone=bad
```page size=mini
heading: Top Stories
card: title=New Park Opens Today | text=Likes: 0 | foot=Like | bad=text
```
```devconsole
+ Local likes: 1 | StoryCard.jsx:6
+ Local likes: 2 | StoryCard.jsx:6
```
`handleLike` adds `1` in memory, but React never re-renders the card.
:::
::: col title="With useState and setLikes" tag="screen updates to Likes: 2" tone=good
```page size=mini
heading: Top Stories
card: title=New Park Opens Today | text=Likes: 2 | foot=Like | good=text
```
```devconsole
= No messages
```
Each click calls `setLikes`, which stores the new number in React and re-renders the card.
:::
:::

> [!PRINCIPLE]
> **Principle 1: Component Memory: Store Changing UI Data in `useState`, Never in a Local `let` Variable**
>
> *Store any changing value that updates the screen inside `useState`, and call its setter function to save the next value and trigger a re-render.*
>
> When you want a number on screen to climb on every click, a plain local variable inside your component is a trap. You can add one to that variable in your click handler and watch the new number print in the Console, yet the screen stays frozen on zero. Changing a local variable never tells React to redraw the page, and every re-render resets that variable back to zero. Calling `useState` stores the value in React memory outside your function, and calling the setter updates the stored value and schedules a re-render.
>
> **DO THIS:**
> ```jsx
> import { useState } from 'react';
>
> export default function StoryCard({ title }) {
>   const ~[likes, setLikes] = useState(0)~; // Stored in React memory across renders
>   return <button onClick={() => ~setLikes(likes + 1)~}>{title}: {likes}</button>; // Saves next value and re-renders
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function StoryCard({ title }) {
>   ~let likes = 0;~ // **WRONG:** resets to 0 on every render and never triggers a re-render!
>   return <button onClick={() => { ~likes = likes + 1;~ }}>{title}: {likes}</button>; // **WRONG:** screen stays frozen at 0!
> }
> ```

---

## 2. Principle 2: Lazy State Initialization: Pass an Initializer Reference to Defer Setup

### Eager Argument Evaluation vs. Deferred Initializer Execution

Suppose our starting like count is not zero. Instead, a helper function named `loadSavedLikes` calculates the number and returns `10`.

Look at the two ways you can pass `loadSavedLikes` to `useState`:

```jsx title="Two ways to write loadSavedLikes inside useState"
function loadSavedLikes() {
  console.log('Reading saved likes...');
  return 10;
}

const [likes, setLikes] = ~useState(loadSavedLikes())~; // 1. WITH parentheses: calls loadSavedLikes on EVERY render!
const [likes, setLikes] = ~useState(loadSavedLikes)~;   // 2. WITHOUT parentheses: hands the function to React to call ONCE!
```

**Here the confusion is real, both in the code and on the screen. The two lines differ by only a pair of parentheses after `loadSavedLikes`, and on the screen both cards start at `Likes: 10` and climb on every click. They look like they do the same job, but they are NOT the same!**

The difference is when the function runs and who calls it. React uses your initial state value only during the very first render. On every later render, React already holds the active state in its own memory and ignores the starting argument. You have two choices:
1. **Choice A: Call the function directly with parentheses.** Calling `loadSavedLikes` inside `useState` tells JavaScript to run that function right now on every render, before `useState` even starts, and pass the returned `10` into `useState`.
   - *Trade-off:* Passing a plain value like `0` or `false` is free. Calling a setup function with parentheses runs that function on every single click, printing `Reading saved likes...` in the Console again and again while React throws the returned `10` away.
2. **Choice B: Pass the function by name without parentheses.** Passing `loadSavedLikes` without parentheses hands the function itself to React as an initializer. React calls it only once, during the initial render, and never calls it again on re-renders.
   - *Trade-off:* It skips the setup work on every re-render, as long as your setup function takes zero arguments and returns the starting value.

```tree caption="Calling loadSavedLikes with parentheses inside useState vs. passing the initializer function without parentheses."
Two ways to pass a function-computed starting value to `useState`
- !With parentheses [`loadSavedLikes` called inside `useState`] | JavaScript calls `loadSavedLikes` **before `useState` runs on every render** | Wastes work on **every re-render** even though React throws the result away
- +Without parentheses [`loadSavedLikes` passed by name] | Hands the **initializer function** to React | React calls `loadSavedLikes` **only once** on the first render
```

### Immediate Call Expressions vs. Passed Function References

This follows the exact same JavaScript rule that governs event handlers (as seen in Lesson 11). Adding parentheses to a function name runs it right now. Leaving the parentheses off passes the function itself so something else can call it later:

```js title="Plain JavaScript: calling a function right now vs. passing the function itself"
function loadSavedLikes() {
  return 10;
}

const result = ~loadSavedLikes()~; // 1. With parentheses: runs loadSavedLikes RIGHT NOW and stores the number 10
const fn = ~loadSavedLikes~;       // 2. Without parentheses: does NOT run it yet; stores the function itself
```

When you pass an initializer function to `useState` without parentheses, keep three rules in mind:
1. It must take zero arguments.
2. It must be pure and return the starting value.
3. Use it only when calculating the starting value takes real work, like reading storage or parsing data. If your starting value is a plain number or boolean like `0` or `false`, pass it directly.

### The Redundant Execution Trap: Setup Logic Fires on Every Single Render

Look at what happens when a developer defines `loadSavedLikes` and calls it with parentheses inside `useState`:

```jsx title="src/components/StoryCard.jsx" startLine="1"
import { useState } from 'react';

function ~loadSavedLikes~() { // Helper that logs when it runs and returns the starting count 10
  console.log('Reading saved likes...');
  return 10;
}
```

Inside the card component, the developer invokes that helper with parentheses inside the Hook:

```jsx title="src/components/StoryCard.jsx" startLine="8"
export default function StoryCard({ title }) {
  const [likes, setLikes] = useState(~loadSavedLikes()~); // **WRONG:** parentheses call loadSavedLikes on EVERY re-render!

  function handleLike() {
    setLikes(likes + 1);
  }

  return (
    <article className="card">
      <h3>{title}</h3>
      <p className="likes-text">Likes: {likes}</p>
      <button className="like-btn" onClick={handleLike}>
        Like
      </button>
    </article>
  );
}
```

**The user interface updates normally, but your application burns CPU on every frame by re-running expensive initialization logic in secret.**

**Calling a function inside an argument list runs that function on every render, repeating setup work while React throws the return value away.** Here is what happens in the Console as the user clicks Like twice:
1. **On the first render**, JavaScript runs `loadSavedLikes` and prints `Reading saved likes...` to the Console. It passes `10` into `useState`, and the card renders `Likes: 10`.
2. **On the first click**, `setLikes` updates the state to `11` and tells React to re-render `StoryCard`. When `StoryCard` runs again, JavaScript calls `loadSavedLikes` a second time and logs the same message again. React ignores the returned `10` because React already holds `11` in memory.
3. **On the second click**, `StoryCard` re-renders for `12`, and JavaScript calls `loadSavedLikes` a third time. The numbers on screen advance from `10` to `11` to `12`, so the user notices nothing. The wasted work stays hidden until you check the Console.

### The Initializer Pattern: Handing Execution Control to React

To stop this wasted work, remove the parentheses and pass the function by name:

```jsx title="src/components/StoryCard.jsx" startLine="8"
export default function StoryCard({ title }) {
  const [likes, setLikes] = useState(~loadSavedLikes~); // Passes the initializer function reference so React calls it ONCE!
```

**Passing a function reference gives execution control to React: React calls the initializer once on mount and skips it on every later render.** Here is how React handles the function:
1. **On the initial render**, `StoryCard` passes `loadSavedLikes` to `useState`. React sees that you passed a function, runs it once, saves the returned `10` in memory, and returns `[10, setLikes]`. The Console prints `Reading saved likes...` exactly once.
2. **On the second render after a click**, `StoryCard` passes `loadSavedLikes` to `useState` again. Because React already holds `11` in memory, React skips `loadSavedLikes` completely. The Console stays quiet.

```tree dir=right caption="Why passing loadSavedLikes without parentheses runs it only on the first render."
Why passing `loadSavedLikes` without parentheses runs it once
- +1. First render [`loadSavedLikes` passed by name] | React sees a function, calls `loadSavedLikes`, and saves **`10`** | Console logs **`Reading saved likes...` once**
- +2. Second render [Clicked `Like`, count is `11`] | React already holds **`11`** in memory and **skips `loadSavedLikes`** | **Zero extra Console logs**; no wasted work
```

::: row caption="Calling loadSavedLikes with parentheses inside useState vs. passing loadSavedLikes without parentheses."
::: col title="Called with Parentheses" tag="runs on every click" tone=bad
```page size=mini
heading: Top Stories
card: title=New Park Opens Today | text=Likes: 12 | foot=Like
```
```devconsole
+ Reading saved likes... | StoryCard.jsx:4
+ Reading saved likes... | StoryCard.jsx:4
+ Reading saved likes... | StoryCard.jsx:4
```
JavaScript calls `loadSavedLikes` on every render even though React discards the result.
:::
::: col title="Passed Without Parentheses" tag="runs only once" tone=good
```page size=mini
heading: Top Stories
card: title=New Park Opens Today | text=Likes: 12 | foot=Like
```
```devconsole
+ Reading saved likes... | StoryCard.jsx:4
```
React invokes `loadSavedLikes` once on mount and skips it on every subsequent render.
:::
:::

> [!PRINCIPLE]
> **Principle 2: Lazy Initialization: Pass an Initializer Function Reference to Avoid Wasted Setup Work**
>
> *When computing initial state requires running a setup function, pass the function reference without parentheses so React calls it only once on mount.*
>
> React uses your initial state value only during the first render. When you call a setup function with parentheses inside `useState`, JavaScript runs that function on every single render before `useState` even starts, and React throws the result away. Passing the setup function by name without parentheses hands the function to React as an initializer. React runs it once on mount and skips it on every re-render.
>
> **DO THIS:**
> ```jsx
> function loadSavedLikes() {
>   return Number(localStorage.getItem('likes') ?? 10);
> }
> export default function StoryCard({ title }) {
>   const [likes, setLikes] = ~useState(loadSavedLikes)~; // React calls loadSavedLikes only on initial mount
>   return <p>Likes: {likes}</p>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function loadSavedLikes() {
>   return Number(localStorage.getItem('likes') ?? 10);
> }
> export default function StoryCard({ title }) {
>   const [likes, setLikes] = ~useState(loadSavedLikes())~; // **WRONG:** reads localStorage again on every click, and React throws the result away!
>   return <p>Likes: {likes}</p>;
> }
> ```

---

## 3. Principle 3: Call Order Invariance: React Matches State Slots by Sequential Execution Order

### The Name Illusion: React Uses Index Pointers, Not Variable Identifiers

Now suppose our card component needs two independent pieces of state: a number `likes` for the like count, and a boolean `showSummary` to show or hide the summary text.

To manage both pieces of data, call `useState` twice at the top of your component:

```jsx title="Calling useState twice at the top of a component"
const [likes, setLikes] = ~useState(10)~;                // 1. First useState call -> Slot 0 holds 10
const [showSummary, setShowSummary] = ~useState(false)~; // 2. Second useState call -> Slot 1 holds false
```

**Looking at those two lines, an inexperienced developer naturally assumes React knows the first state is named `likes` and the second is named `showSummary`. In reality, React never sees your variable names at all.**

In JavaScript, the `useState` call on the right side of `=` finishes and returns its two-item array before the left side unpacks it into your variable names. Neither call passes a variable name into `useState`; the first passes only `10`, and the second passes only `false`.

React tells multiple `useState` calls apart using an internal array of memory slots and a counter:
1. When React starts rendering your component, it resets an internal counter to `0`.
2. The first `useState` call that runs reads Slot 0, retrieves `10`, and advances the counter to `1`.
3. The second `useState` call that runs reads Slot 1, retrieves `false`, and advances the counter to `2`.

As long as every Hook runs unconditionally at the top of your component, every render executes Hook 1 and Hook 2 in the exact same order. Slot 0 always matches `likes`, and Slot 1 always matches `showSummary`. If you skip or add a Hook inside a condition, the slot order shifts and React crashes with an error:

```tree caption="React cannot see your variable names; it matches each useState call to its memory slot by its top-to-bottom call order."
How React tells multiple `useState` calls apart inside one component
- +1st `useState` call at the top [`likes`] | Always opens **Slot 0** in React internal array | Returns **`[10, setLikes]`** on every render
- +2nd `useState` call right below it [`showSummary`] | Always opens **Slot 1** in React internal array | Returns **`[false, setShowSummary]`** on every render
- !A `useState` call inside `if` or after `return` [Skipped on some renders] | Changes how many Hooks run from one render to the next | **Crashes React** because the slot order no longer matches!
```

### The Fiber Hook Array: Index Pointers and Unconditional Call Order

Inside its engine, React keeps an array of state slots and a counter that resets to `0` at the start of every render:

```js title="Mental model: how React tracks useState slots by call order"
let componentHooks = [ ~[10, setLikes]~, ~[false, setShowSummary]~ ]; // Slot 0 and Slot 1 stored by React
let ~currentHookIndex = 0~; // Resets to 0 at the start of every render, then steps 0 -> 1 as each useState runs!
```

Because React relies on this counter stepping through slots in the exact same sequence on every render, every Hook must obey three strict rules:
1. **Call every Hook unconditionally at the very top of your component function.**
2. **Never call `useState` inside an `if` block, a loop, or a nested function.**
3. **Never place a Hook below an early `return`.** Always place your early return statements below all Hook declarations.

### The Early Return Crash: Skipping Hooks Throws Reconciler Mismatch Errors

Suppose a developer declares the first state variable and then adds an early return above the second state variable:

```jsx title="src/components/StoryCard.jsx" startLine="8"
export default function StoryCard({ title, summary }) {
  const [likes, setLikes] = useState(loadSavedLikes); // 1. Slot 0: runs on every render

  if (likes > 10) {
    ~return <p>Popular story!</p>;~ // **WRONG:** early return sits ABOVE the second useState call!
  }

  const [showSummary, setShowSummary] = ~useState(false)~; // **WRONG:** Slot 1 runs on Render 1, but is skipped when likes > 10!
```

On the first render, `likes` is `10`. The check `likes > 10` evaluates to false, so both Hook calls run in order for Slot 0 and Slot 1, and the page displays without errors.

**The screen instantly crashes to a blank white page with an unrecoverable runtime error.**

**Skipping a Hook changes how many Hooks run from one render to the next, throwing the slot counter out of alignment and crashing React.** Here is the exact crash sequence when the user clicks Like:
1. Calling `setLikes` updates the count from `10` to `11` and tells React to re-render.
2. On this second render, the first `useState` call runs for Slot 0.
3. Because `likes` is now `11`, the check `likes > 10` is true, and `StoryCard` returns early.
4. The second `useState` call never runs. React expected two Hook calls just like on the first render. It detects only one and crashes immediately:

```devconsole
x Uncaught Error: Rendered fewer hooks than expected. This may be caused by an accidental early return statement.
```

### The Conditional Hook Crash: Adding Hooks on Re-render Crashes React

The opposite mistake triggers the exact same failure. Suppose a developer puts the second Hook inside an `if` block so it runs only when likes exceed ten:

```jsx title="src/components/StoryCard.jsx" startLine="8"
export default function StoryCard({ title, summary }) {
  const [likes, setLikes] = useState(loadSavedLikes);

  if (likes > 10) {
    const [showSummary, setShowSummary] = ~useState(false)~; // **WRONG:** Hook inside an if block only runs when likes > 10!
  }
```

**The user interface crashes immediately upon interaction. Running an extra Hook shifts the slot counter and breaks React call-order contract.**

**Adding a Hook inside a condition causes the second render to run more Hooks than the first, crashing React instantly.** On the first render, `likes` is `10`, so only one Hook runs. When the user clicks Like, `likes` becomes `11` and triggers a re-render. This time, the `if` block runs and calls a second Hook that never ran before. React detects an unexpected call and throws an error:

```devconsole
x React has detected a change in the order of Hooks called by StoryCard.
x Uncaught Error: Rendered more hooks than during the previous render.
```

### Top-Level Unconditional Execution Guarantees Slot Alignment

To keep your memory slots aligned on every render, call both `useState` Hooks unconditionally at the very top of your function:

```jsx title="src/components/StoryCard.jsx" startLine="8"
export default function StoryCard({ title, summary }) {
  const [likes, setLikes] = ~useState(loadSavedLikes)~;     // 1. Slot 0: always runs 1st at the top of StoryCard
  const [showSummary, setShowSummary] = ~useState(false)~; // 2. Slot 1: always runs 2nd at the top of StoryCard

  function handleLike() {
    setLikes(likes + 1);
  }

  function handleToggleSummary() {
    ~setShowSummary(!showSummary);~ // 3. Flips Slot 1 between false and true
  }
```

Below the handlers, your JSX renders the like button, the toggle button, and the conditional summary paragraph:

```jsx title="src/components/StoryCard.jsx" startLine="20"
  return (
    <article className="card">
      <h3>{title}</h3>
      <p className="likes-text">Likes: {likes}</p>
      <button className="like-btn" onClick={handleLike}>
        Like
      </button>
      <button className="toggle-btn" onClick={handleToggleSummary}>
        ~{showSummary ? 'Hide' : 'Show'} summary~ {/* 4. Switches button text when showSummary changes */}
      </button>
      ~{showSummary && <p className="summary-text">{summary}</p>}~ {/* 5. Renders summary paragraph only when showSummary is true */}
    </article>
  );
}
```

Now Slot 0 for `likes` and Slot 1 for `showSummary` run in the exact same order on every render. When the user clicks the toggle button, `setShowSummary` flips Slot 1 from `false` to `true` while Slot 0 stays at `10`. The button text switches to `Hide summary`, and the summary paragraph appears below:

::: row caption="Placing a second useState call after an early return vs. calling both useState Hooks unconditionally at the top of StoryCard."
::: col title="Hook Below Early return" tag="crashes on re-render" tone=bad
```page size=mini
blank
```
```devconsole
x Uncaught Error: Rendered fewer hooks than expected. This may be caused by an accidental early return statement.
```
When the count reaches eleven, the early `return` skips the second `useState` call and crashes React.
:::
::: col title="Both Hooks at the Top Level" tag="both states work independently" tone=good
```page size=mini
heading: Top Stories
card: title=New Park Opens Today | text=Likes: 10 | lines=Like · Hide summary; The park on Main Street opens at noon. | good=lines
```
```devconsole
+ Reading saved likes... | StoryCard.jsx:4
```
Slot 0 for `likes` and Slot 1 for `showSummary` run in the exact same order on every render.
:::
:::

> [!PRINCIPLE]
> **Principle 3: Top-Level Hooks: Call Every `useState` Unconditionally at the Top of the Component**
>
> *Give a component as many `useState` variables as it needs, and always call every Hook unconditionally at the very top level of the component function.*
>
> When you declare multiple `useState` calls, React does not track them by variable name. React counts the calls sequentially: the first call accesses Slot 0, and the second call accesses Slot 1. If you place `useState` inside an `if` block, a loop, or after an early return, the Hook count and order shift between renders. The memory slots misalign, and React crashes with an unrecoverable error. Always call every Hook unconditionally at the top of your component.
>
> **DO THIS:**
> ```jsx
> export default function StoryCard({ title, summary }) {
>   const [likes, setLikes] = ~useState(loadSavedLikes)~;     // 1. Slot 0: always runs 1st
>   const [showSummary, setShowSummary] = ~useState(false)~; // 2. Slot 1: always runs 2nd
>   return <article><h3>{title}</h3>{showSummary && <p>{summary}</p>}</article>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function StoryCard({ title, summary }) {
>   const [likes, setLikes] = useState(loadSavedLikes);
>   if (!summary) {
>     return <article><h3>{title}</h3></article>;
>   }
>   const [showSummary, setShowSummary] = ~useState(false)~; // **WRONG:** skipped while the summary is still loading, so the Hook order changes when it arrives and React throws an error!
>   return <article><h3>{title}</h3>{showSummary && <p>{summary}</p>}</article>;
> }
> ```

---

## 4. Principle 4: Tree-Position Isolation: State Belongs to Rendered Instances, Not Functions

### Function Blueprint vs. Distinct Tree Node Memory

Now render a second `<StoryCard />` tag inside `App` directly below the first card:

```jsx title="Rendering two <StoryCard /> tags inside App"
export default function App() {
  return (
    <main>
      <h1>Top Stories</h1>
      ~<StoryCard~ // 1. First rendered StoryCard instance on screen
        title="New Park Opens Today"
        summary="The park on Main Street opens at noon."
      />
      ~<StoryCard~ // 2. Second rendered StoryCard instance on screen
        title="Library Extends Hours"
        summary="The central library stays open until 9 PM."
      />
    </main>
  );
}
```

**The two `<StoryCard />` tags in `App` have different titles, so they look like two separate cards on the screen. The confusion lives in the code of `StoryCard.jsx`. Because you declared `likes` and `showSummary` only once inside one `StoryCard` function, an inexperienced developer can wonder whether both cards read and write that single `likes` variable. They do NOT!**

The physical difference is who owns the state. A component function is only a recipe. React attaches state to each rendered card at its place in the UI tree, not to the `StoryCard` function in your file:
1. Each `<StoryCard />` tag on the screen gets its own two-slot memory array at its position in the tree.
2. Clicking Like on the first card calls the first card's `setLikes`, updates only the first card's slot, and re-renders only that first card.
3. The second card keeps its own separate slot and stays at `Likes: 10`.

Unlike props, which `App` passes down into each card, state stays completely private to the component that declares it. The parent component cannot see or edit either card state.

```tree caption="Each rendered <StoryCard /> tag on screen gets its own isolated, private state slots in React memory."
Two `<StoryCard />` tags rendered inside `App`
- +First `<StoryCard />` [`"New Park Opens Today"`] | Owns its own **`[Slot 0, Slot 1]`** state array in memory | Clicking `Like` here updates **only this first card**
- +Second `<StoryCard />` [`"Library Extends Hours"`] | Owns a **completely separate `[Slot 0, Slot 1]`** state array | Stays untouched at **`Likes: 10`** and **`Show summary`**
```

### The Shared Module Variable Anti-Pattern: Corrupting State Across Instances

When developers notice that local variables reset on every render, they sometimes try a shortcut: they move the variable outside the component function into the file itself:

```jsx title="src/components/StoryCard.jsx" startLine="1"
~let sharedLikes = 10;~ // **WRONG:** one module-level variable is shared across EVERY <StoryCard /> on the page!

export default function StoryCard({ title }) {
  return <article><h3>{title}</h3><p>Likes: {sharedLikes}</p></article>;
}
```

**Interacting with one component silently corrupts or couples every other component instance across the screen.**

JavaScript runs a module file only once when it imports it, so there is only one `sharedLikes` variable for the whole application. Every `<StoryCard />` on the page reads and writes that exact same variable. Clicking one card changes the count for every other card on the screen.

When you declare state inside `StoryCard` with `useState`, you never have to duplicate component code to make separate cards. Each `<StoryCard />` tag you put on screen receives its own private memory automatically.

### Independent Fiber Nodes: Updating One Card Leaves Siblings Untouched

Here is our updated `App` file rendering two story cards side by side:

```jsx title="src/App.jsx" startLine="1"
import StoryCard from './components/StoryCard.jsx';

export default function App() {
  return (
    <main>
      <h1>Top Stories</h1>
      ~<StoryCard~ // 1st card instance: gets its own [likes, showSummary] state in memory
        title="New Park Opens Today"
        summary="The park on Main Street opens at noon."
      />
      ~<StoryCard~ // 2nd card instance: gets its own separate [likes, showSummary] state in memory
        title="Library Extends Hours"
        summary="The central library stays open until 9 PM."
      />
    </main>
  );
}
```

Neither the card file nor the parent file passes an ID into `useState`.

**React binds state to each component position in the tree: calling a setter re-renders only that specific card, leaving sibling cards untouched.** Here is how React tracks both cards:
1. When `App` renders the container, React identifies two `<StoryCard />` tags at position 1 and position 2.
2. React attaches a private two-slot state array to the first card, and an entirely separate two-slot array to the second card.
3. The user clicks Like twice and clicks Show summary once on the first card.
4. Those clicks call `setLikes` and `setShowSummary` belonging only to that first card.
5. React re-renders only the first card with `[12, true]`, while the second card stays at `[10, false]` with its summary hidden.

::: row caption="Two <StoryCard /> instances on the same page: interacting with the first card never affects the second card."
::: col title="1. On Initial Page Load" tag="both cards start at [10, false]" tone=plain
```page size=mini
heading: Top Stories
card: title=New Park Opens Today | text=Likes: 10 | lines=Like · Show summary
card: title=Library Extends Hours | text=Likes: 10 | lines=Like · Show summary
```
Both `<StoryCard />` instances initialize their own two-slot state arrays to `[10, false]`.
:::
::: col title="2. After Clicking Card 1 Only" tag="Card 1 is [12, true]; Card 2 stays [10, false]" tone=good
```page size=mini
heading: Top Stories
card: title=New Park Opens Today | text=Likes: 12 | lines=Like · Hide summary; The park on Main Street opens at noon. | good=text,lines
card: title=Library Extends Hours | text=Likes: 10 | lines=Like · Show summary
```
Card 1 updates to `Likes: 12` and shows its summary, while Card 2 stays at `Likes: 10` with its summary hidden.
:::
:::

Chrome's Elements panel confirms that only the first card DOM nodes were altered:

```dom caption="What Chrome Elements panel shows after clicking Like twice and Show summary on the first StoryCard only."
<main>
  <h1>Top Stories</h1>
+ <article class="card"> | note: 1st <StoryCard /> instance: likes = 12, showSummary = true
    <h3>New Park Opens Today</h3>
+   <p class="likes-text">Likes: 12</p>
    <button class="like-btn">Like</button>
+   <button class="toggle-btn">Hide summary</button>
+   <p class="summary-text">The park on Main Street opens at noon.</p>
  </article>
  <article class="card"> | note: 2nd <StoryCard /> instance: still likes = 10, showSummary = false
    <h3>Library Extends Hours</h3>
    <p class="likes-text">Likes: 10</p>
    <button class="like-btn">Like</button>
    <button class="toggle-btn">Show summary</button>
  </article>
</main>
```

When you need two sibling components to share state and stay in sync, they cannot talk to each other directly. Instead, lift state up into their closest shared parent (as taught in Lesson 24).

> [!PRINCIPLE]
> **Principle 4: Instance Isolation: State Is Isolated and Private to Each Rendered Component Tag**
>
> *State is attached to each rendered component instance on the screen, not to the function definition. Rendering `<StoryCard />` twice gives each card its own separate memory.*
>
> Because you write the `StoryCard` function only once in its file, it is easy to assume every `<StoryCard />` on the page shares the same state variables. React does not attach state to the function definition in the file. React attaches a separate state array to each component instance at its specific position in the render tree. Clicking a button on the first card updates only that first card. Never declare changing data at module scope outside the component, or every instance will overwrite the same shared variable.
>
> **DO THIS:**
> ```jsx
> export default function App() {
>   return (
>     <main>
>       ~<StoryCard title="New Park Opens Today" summary="Opens at noon." />~ {/* Own isolated state */}
>       ~<StoryCard title="Library Extends Hours" summary="Open until 9 PM." />~ {/* Own isolated state */}
>     </main>
>   );
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~let sharedLikes = 10;~ // **WRONG:** module-level variable is shared across all StoryCard instances!
> export default function StoryCard({ title }) {
>   return <article><h3>{title}</h3><p>Likes: {sharedLikes}</p></article>;
> }
> ```

---

## Complete Architectural Synthesis

### Production Implementation: The 4-File Application

Here are all four files of our story reader project working together. First, the HTML entry page provides the root container where React mounts your application:

```html title="index.html" startLine="1"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Top Stories</title>
  </head>
  <body>
    ~<div id="root"></div>~ <!-- Root container where React mounts App -->
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

Second, the entry script creates the React root and renders the top-level `App` component:

```jsx title="src/main.jsx" startLine="1"
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
~root.render(<App />);~ // Mounts the App component tree into #root
```

Third, the story card component defines the lazy initializer and declares both state variables unconditionally at the top of the function:

```jsx title="src/components/StoryCard.jsx" startLine="1"
import { ~useState~ } from 'react'; // Principle 1: Import the useState Hook from React

function ~loadSavedLikes~() { // Principle 2: Initializer function called once per card instance on mount
  console.log('Reading saved likes...');
  return 10;
}

export default function StoryCard({ title, summary }) {
  const [likes, setLikes] = ~useState(loadSavedLikes)~;     // Principle 2 & 3: Slot 0 initialized via function reference
  const [showSummary, setShowSummary] = ~useState(false)~; // Principle 3: Slot 1 declared unconditionally at top level

  function handleLike() {
    setLikes(likes + 1);
  }

  function handleToggleSummary() {
    setShowSummary(!showSummary);
  }

  return (
    <article className="card">
      <h3>{title}</h3>
      <p className="likes-text">Likes: {likes}</p>
      <button className="like-btn" onClick={handleLike}>
        Like
      </button>
      <button className="toggle-btn" onClick={handleToggleSummary}>
        {showSummary ? 'Hide' : 'Show'} summary
      </button>
      {showSummary && <p className="summary-text">{summary}</p>}
    </article>
  );
}
```

Fourth, the main application file renders two independent story card instances side by side:

```jsx title="src/App.jsx" startLine="1"
import StoryCard from './components/StoryCard.jsx';

export default function App() {
  return (
    <main>
      <h1>Top Stories</h1>
      ~<StoryCard~ // Principle 4: 1st card instance with its own private [likes, showSummary] state
        title="New Park Opens Today"
        summary="The park on Main Street opens at noon."
      />
      ~<StoryCard~ // Principle 4: 2nd card instance with its own private [likes, showSummary] state
        title="Library Extends Hours"
        summary="The central library stays open until 9 PM."
      />
    </main>
  );
}
```

### End-to-End Render Lifecycle and Instance Isolation

When the app starts, React calls `loadSavedLikes` once for each card instance. When the user clicks Like twice and toggles the summary on the first card, only that specific card re-renders with state `[12, true]`:

```page caption="The finished application in the browser after clicking Like twice and Show summary on the first StoryCard."
heading: Top Stories
card: title=New Park Opens Today | text=Likes: 12 | lines=Like · Hide summary; The park on Main Street opens at noon. | good=text,lines
card: title=Library Extends Hours | text=Likes: 10 | lines=Like · Show summary
```

```tree caption="The rendered component tree in App and the isolated state arrays React stores for each StoryCard instance."
`App` [Root component in `App.jsx`] | Renders `<main>` with two `<StoryCard />` children | Cannot read or change either card private state
- +1st `StoryCard` [`"New Park Opens Today"`] | **Slot 0**: `likes` is **`12`** | **Slot 1**: `showSummary` is **`true`** | Renders `Likes: 12`, `Hide summary`, and the summary paragraph
- +2nd `StoryCard` [`"Library Extends Hours"`] | **Slot 0**: `likes` is **`10`** | **Slot 1**: `showSummary` is **`false`** | Renders `Likes: 10` and `Show summary` with the summary hidden
```

| Aspect | The Plain JavaScript Habit | The React Rule |
| :--- | :--- | :--- |
| **Where changing data lives** | Store a local `let` variable inside the function and reassign it with `=`, which never re-renders and resets on the next call | Unpack `[likes, setLikes]` from `useState` and call `setLikes` so React remembers the value and re-renders |
| **Unpacking `useState`** | Confuse curly braces `{ }` for objects with square brackets `[ ]` for arrays | Use square-bracket array destructuring `[likes, setLikes]` to unpack item `0` and item `1` by position |
| **Function-computed initial state** | Call `loadSavedLikes` with parentheses inside `useState`, which runs `loadSavedLikes` on every single re-render | Pass the initializer function `loadSavedLikes` without parentheses so React calls it only once on the first render |
| **Multiple `useState` calls** | Assume React reads variable names, and place `useState` inside an `if` block or after an early `return` | Call every Hook unconditionally at the top level of the component so React `[Slot 0, Slot 1]` call order never changes |
| **Multiple component instances** | Put `let sharedLikes` at the top of the file outside the function, linking all cards together | Keep `useState` inside the component; each rendered `<StoryCard />` tag on screen gets its own isolated, private state |

---

## Architectural Mastery for Senior Interviews

> **The Interview Question:** Why do ordinary variables forget their values between renders, and how does useState remember?

### The 30-Second Senior Invariant Summary

Ordinary local variables inside a component function fail across renders for two reasons. First, reassigning a local variable with `=` changes local memory in silence and never tells React to re-render. Second, when React re-renders the component, it runs the function again from line 1 and recreates all local variables from scratch.

`useState` solves both problems by storing state cells outside the component function inside React own memory. Calling `useState` returns a two-item array: the current state value, and a setter function that saves the next value and tells React to re-render.

Three rules govern component state in production:
1. **Lazy initialization**: React uses initial state only on mount. When initial state comes from a function, pass the function reference without parentheses so it runs once instead of on every frame.
2. **Call order invariance**: React matches multiple `useState` calls to memory slots by their top-to-bottom call order, not by variable names. Always call Hooks unconditionally at the top level of your component.
3. **Tree-position isolation**: React attaches state to each component tag at its place in the UI tree. Rendering multiple copies of a component gives each copy completely private, independent memory.

### Deep-Dive Architectural Follow-Ups

1. **"If `likes` changes across renders, why do we declare `[likes, setLikes]` with `const` instead of `let`, and with square brackets instead of curly braces?"**
   We use `const` because we never reassign `likes` with `=` inside the component. On each re-render, React calls the function again, creating a fresh `const likes` variable for that render. We use square brackets `[likes, setLikes]` because `useState` returns a two-item array unpacked by position `0` and `1`. By contrast, props is an object unpacked by property name using curly braces `{ title, summary }` (as seen in Lesson 08).
2. **"What is the runtime difference between calling `loadSavedLikes` with parentheses inside `useState` versus passing `loadSavedLikes` without parentheses?"**
   In JavaScript, calling a function inside an argument list runs that function immediately before the outer function even starts. If you call `loadSavedLikes` with parentheses inside `useState`, JavaScript runs `loadSavedLikes` on every single render, and React throws the return value away on every render after the first. When you pass `loadSavedLikes` without parentheses, you pass an initializer function. React runs it once on mount and skips it on every re-render.
3. **"Since you do not pass variable names into `useState`, how does React know which state value belongs to `likes` and which belongs to `showSummary`?"**
   React matches Hooks to internal memory slots strictly by their call order. Each rendered component keeps an internal list of state cells and a counter that resets to `0` at the start of each render. The first Hook call accesses Slot 0, the second accesses Slot 1, and so on. If you put a Hook inside an `if` block or after an early return, the number of Hook calls changes between renders. The slot counter misaligns, and React throws a fatal error such as `Rendered fewer hooks than expected`.

```tree dir=right caption="Interview comparison: a plain local variable vs. React state with useState."
Local variable `let likes = 0` vs. `useState` in an interview
- !Plain local variable [`let likes = 0`] | Reassigning `likes` with `=` **never triggers a re-render** | Re-running the component function **recreates `likes` at `0` from scratch**
- +React `useState` Hook [`[likes, setLikes]`] | Stored by React **per component instance** and matched by **top-level call order** | Calling `setLikes` **updates the stored slot** and **triggers a re-render**
```
