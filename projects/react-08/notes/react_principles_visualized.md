# Visualizing React Principles: Component Memory (Lecture 14)

Here is a complete collection of minimal, visual summaries for all seven core principles from Lecture 14 on `useState` and component memory. Each principle includes the definition, a visual diagram, and the correct vs. incorrect code patterns.

***

### 1. The screen keeps the value it got when the component ran
**Definition:** When React runs a component, the `{count}` in its JSX puts the current value on the screen. Changing a plain variable does not make React run the component again. The screen changes only when React runs the component again. Calling a setter triggers this.

**Visual Summary:**
```text
[Render: count is 0] ───► [Screen shows 0]
                                 │
[count = 1] ─── (no trigger) ────┘ (Screen stays 0)
```

**Code Pattern:**
✅ **DO THIS:**
```jsx
const [count, setCount] = useState(0);
setCount(count + 1); // React runs the component again
```
❌ **DO NOT DO THIS:**
```jsx
let count = 0;
count = count + 1; // The screen still shows 0
```

***

### 2. Each run of a component starts its variables over
**Definition:** React runs a component more than once: every time the screen must change. Each time, it calls the component's function again from its first line. A plain variable inside a component never lasts from one run to the next.

**Visual Summary:**
```text
[Run 1] ───► [let count = 0] ───► [count = 1] (Erased)
 
[Run 2] ───► [let count = 0] ───► [count = 0]
```

**Code Pattern:**
✅ **DO THIS:**
```jsx
function Counter() {
  const [count, setCount] = useState(0); // keeps its value
  return <p>{count}</p>;
}
```
❌ **DO NOT DO THIS:**
```jsx
function Counter() {
  let count = 0; // back to 0 on every run
  return <p>{count}</p>;
}
```

***

### 3. useState gives a value that lasts and a function that changes it
**Definition:** A value on the screen must keep its value from one run to the next, and changing it must make React run the component again. `useState` gives both: a state variable (the current value) and a setter (which stores the next value and triggers a new run).

**Visual Summary:**
```text
                ┌──► [count]    (keeps saved value)
[useState(0)] ──┤
                └──► [setCount] (updates & triggers new run)
```

**Code Pattern:**
✅ **DO THIS:**
```jsx
const [count, setCount] = useState(0);
setCount(count + 1); // the screen shows 1
```
❌ **DO NOT DO THIS:**
```jsx
const [count, setCount] = useState(0);
count = count + 1; // TypeError, the screen stays at 0
```

***

### 4. React keeps state outside the component and matches it by order
**Definition:** React keeps the state value itself, outside our function. It matches each `useState` call to its stored value only by order (first call, second call). The calls must come in the same order on every run, meaning never inside an `if`.

**Visual Summary:**
```text
[Component Runs]
       │
       ├──► 1st [useState] ───► [React Memory: Slot 1]
       │
       └──► 2nd [useState] ───► [React Memory: Slot 2]
```

**Code Pattern:**
✅ **DO THIS:**
```jsx
const [count, setCount] = useState(0); // first call
const [isOn, setIsOn] = useState(false); // always the second call
```
❌ **DO NOT DO THIS:**
```jsx
const [count, setCount] = useState(0);
if (count > 0) {
  const [isOn, setIsOn] = useState(false); // React throws an error
}
```

***

### 5. Each copy of a component on the screen keeps its own state
**Definition:** One component function can appear on the screen many times. React keeps a separate set of stored values for each copy on the screen, called a component instance.

**Visual Summary:**
```text
[<StoryCard /> Instance A] ───► [Memory A: likes = 2]

[<StoryCard /> Instance B] ───► [Memory B: likes = 0]
```

**Code Pattern:**
✅ **DO THIS:**
```jsx
function Counter() {
  const [count, setCount] = useState(0); // one count per copy
  const add = () => setCount(count + 1);
  return <button onClick={add}>{count}</button>;
}
```
❌ **DO NOT DO THIS:**
```jsx
let count = 0; // one variable shared by every copy
function Counter() {
  const add = () => { count = count + 1; }; // screen stays at 0
  return <button onClick={add}>{count}</button>;
}
```

***

### 6. Pass an expensive starting value as a function
**Definition:** React uses the starting value of `useState` only on the first run. `useState(createItems())` calls the function on *every* run, wasting effort. `useState(createItems)` passes the function itself, and React calls it only on the first run.

**Visual Summary:**
```text
[useState(calc())] ───► [calc() runs every time] ───► (Wasted effort)

[useState(calc)]   ───► [calc() runs once]       ───► (Efficient)
```

**Code Pattern:**
✅ **DO THIS:**
```jsx
const [items, setItems] = useState(createItems); // first run only
```
❌ **DO NOT DO THIS:**
```jsx
const [items, setItems] = useState(createItems()); // every run
```

***

### 7. Call a setter only when the user clicks
**Definition:** `onClick={setCount(1)}` runs the setter immediately when the component appears on the screen, causing an infinite loop of renders. `onClick={() => setCount(1)}` passes a function so the setter runs only when the user clicks.

**Visual Summary:**
```text
onClick={setCount(1)}       ───► [Runs immediately] ───► [Infinite Loop Error]

onClick={() => setCount(1)} ───► [Waits for click]  ───► [Safe Update]
```

**Code Pattern:**
✅ **DO THIS:**
```jsx
<button onClick={() => setCount(count + 1)}>Add</button> // runs on click
```
❌ **DO NOT DO THIS:**
```jsx
<button onClick={setCount(count + 1)}>Add</button> // runs at once
```