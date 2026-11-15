# Lecture 61: How React Matches List Rows by Key

*(Why does the edit field jump to another task after the user deletes a row?)*

> INTERVIEW QUESTION | ❱❱ MORE | What makes a good key across re-renders, and how do unstable or duplicate keys corrupt reconciliation?

---

## VS | The Index `key={index}` vs. the Task's ID `key={task.id}`: both show the same rows, only the ID keeps each row's state with its task

> When rendering a dynamic list in React, you call `map()` on an array and return a JSX element with a `key` prop for each item. **On the next render, React matches each element by its key, preserving local component state such as an open edit field**. Keying rows by a stable data ID keeps state with the right item. An index or random number assigns state to the wrong row or discards it.

Recall the `key` prop introduced in Lesson 18. Without a key, the Console displays a warning. Adding a key silences the warning, so many developers look no further. A key exists for a much more important reason than pleasing the linter. It gives each list item a durable identity across re-renders.

In imperative JavaScript, you manipulate the DOM directly. To delete a list item, your script finds the specific `<li>` element and removes it, so the code explicitly chooses which node leaves the screen:

```js title="Plain JavaScript: you remove the element yourself"
document.getElementById('task-1').~remove()~; // You pick the exact li element that goes away
```

In React, you never manipulate DOM nodes directly. You declare JSX, and React manages DOM creation and removal. To remove an item, you update the array in state:

```jsx title="React: you change the array, and React removes the element"
~setTasks(tasks.filter(task => task.id !== 1))~; // You only say which task is gone from the data
```

When the user deletes an item, React receives two lists of elements: the previous list and the newly returned list. React must determine how the items in the new list correspond to the items in the old list. It has no built-in knowledge of which button was clicked. Instead, React reconciles the two lists by matching their keys:
1. **A matching key:** When React finds a key present in both lists, it preserves that component instance, passes it the new props, and keeps its internal state.
2. **A missing key:** When a key from the old list is absent from the new list, React unmounts that component instance and destroys its state and DOM node.
3. **A new key:** When a key appears for the first time, React mounts a fresh component instance with initial state.

Keep one fundamental rule in mind for the entire lesson: **a row's state follows its key, not its text.**

Consider a standard to-do list application. The screen displays three tasks: Buy milk, Call Mom, and Pay rent. Each row includes an **Edit** button and a **Delete** button. Clicking **Edit** opens an inline text input pre-filled with the title of that task.

```page caption="The to-do list when the page opens: three tasks, each with an Edit button and a Delete button."
heading: Tasks
line: Buy milk [Edit] [Delete]
line: Call Mom [Edit] [Delete]
line: Pay rent [Edit] [Delete]
console: quiet
```

The user clicks **Edit** on Call Mom, opening the text input for that row. Next, the user clicks **Delete** on Buy milk, the first row. The user expects Buy milk to disappear, while the open input remains on Call Mom. Whether that happens depends entirely on how the rows are keyed.

::: row caption="The same Delete click on Buy milk, with the rows keyed by the task's ID and with the rows keyed by their index."
::: col title="Keyed by the task's ID" tag="the edit field stays on Call Mom" tone=good
```page size=mini
heading: Tasks
form:
  field:  | Call Mom | good
  button: Save
  button: Delete
line: Pay rent [Edit] [Delete]
console: quiet
```
:::
::: col title="Keyed by the index" tag="the edit field jumps to Pay rent" tone=bad
```page size=mini
heading: Tasks
line: Call Mom [Edit] [Delete] | bad
form:
  field:  | Pay rent | bad
  button: Save
  button: Delete
console: quiet
```
:::
:::

**Why this happens:** Each row component manages an internal boolean state variable tracking whether its edit field is open. When keyed by `task.id`, Call Mom holds key 2 both before and after the deletion. React identifies key 2 across renders, retains the existing component instance, and preserves its open edit state.

When keyed by array index, keys represent positional slots: 0, 1, and 2. When the first item is deleted, Call Mom shifts up to index 0, and Pay rent shifts up to index 1. Because the active edit input was associated with key 1, React preserves that open state on key 1, which now displays Pay rent. The user finds an active edit field on a task they never selected, with no warning in the Console.

Here are the two keys behind the two pages:

```jsx title="Keying each row by its index, and keying each row by the task's ID"
{tasks.map((task, index) => <TaskRow ~key={index}~ task={task} />)} {/* Names a position: 0, 1, 2 */}
{tasks.map(task => <TaskRow ~key={task.id}~ task={task} />)} {/* Names a task: Call Mom is always 2 */}
```

**While both approaches render identical output on the initial load, their behavior during updates is fundamentally different:**
- **The index represents a positional slot in an array.** Key 1 means the second row, regardless of which task occupies that slot. When the first task is deleted, key 1 shifts to Pay rent.
- **The ID represents the data entity itself.** Key 2 permanently identifies Call Mom, before and after any list mutation.

```tree caption="Two keys that show the same three rows on the first render, and name two different things."
Two names React can use to find a row on the next render
- !The index [`key={index}`] | Names a **position** in the list: `0`, `1`, `2` | After a Delete at the top, the position `1` belongs to **another task**
- +The task's ID [`key={task.id}`] | Names a **task**: `Call Mom` is always `2` | After a Delete at the top, `2` still belongs to **`Call Mom`**
```

### Two Reminders and One New Word

> [!DEFINITION]
> **What is a key?** [REVIEW] A key is a special string or number attribute passed to list elements to give each item a stable identity.
> 1. You pass a unique key to each JSX element returned inside `map()`: `<li key={task.id}>{task.title}</li>`.
> 2. React uses the key to match items in the new list with items in the previous list.
> 3. React preserves the component instance, its internal state, and its DOM node for every key that returns.
>
> A key must be unique among sibling items in the same list. Without a key, React prints a Console warning and defaults to array indices, causing state to attach to positions rather than items (Lesson 18).

> [!DEFINITION]
> **Where does React keep a component's state?** [REVIEW] React does not store state inside DOM nodes or within component functions; it retains state in internal tree nodes tied to position.
> 1. React matches components across renders based on their location in the component hierarchy.
> 2. When a component remains at the same position with the same identity, React preserves its state.
> 3. Inside a dynamic list, the `key` prop supplies that identity.
>
> A key acts as a virtual position within the parent. In any list, the key dictates which component state pairs with which row (Lesson 25).

> [!DEFINITION]
> **What is reconciliation?** [NEW] Reconciliation is the process React uses to compare a new element tree with the previous tree to determine which DOM changes to apply.
> 1. When an element type changes, React unmounts the old subtree and mounts a fresh one.
> 2. For sibling list items sharing the same component type, React matches items by their `key`.
> 3. A matching key tells React to preserve the existing component instance, update its props, and reuse its DOM node.
>
> The key establishes the durable identity of each row. Through reconciliation, React ensures component state and DOM focus remain stable during list updates (Lesson 61).

### Three Ways to Get a Key

There are three places a key can come from (Lesson 18):

```tree caption="Three ways to get a key for each row of a list, and the list each one fits."
Where the key of each row comes from
- +1. The ID that comes with the data [`key={task.id}`] | Fits **any list loaded from a database** | react.dev: "you can use the database keys/IDs, which are unique by nature"
- +2. An ID made once when the item is created [`crypto.randomUUID`] | Fits **items the user creates on the page** | Made **once**, then stored in the item
- !3. The index [`key={index}`] | Fits **only a list that never changes order** | No item is ever inserted, deleted, or sorted
```

Using an array index as a key requires three strict conditions. The list must never reorder, items must never be added or removed, and rows must maintain no local state. The official documentation cites lines of a static poem as an example. A dynamic to-do list is the exact opposite, because users frequently add, delete, and reorder tasks.

### What the User Pays for a Bad Key

An unstable or inaccurate key never corrupts the plain text passed through props. Because props update on every render, the rendered text reflects the latest data. What breaks is everything tied to component identity: local state, DOM focus, active form inputs, and animations. Users experience three distinct bugs:
1. **With an array index as key, active state shifts onto an unrelated task.** A user deletes the first task and discovers an open edit field on the task below it.
2. **With a key generated by `Math.random()`, the edit field collapses after typing a single letter.** React recreates the DOM on every keystroke, causing the input to lose focus.
3. **With duplicate keys, deleted tasks can remain stuck on the screen.** React cannot match items unambiguously, corrupting reconciliation and leaving phantom DOM nodes behind.

Developers commonly fall into four misconceptions:
1. They assume an event handler directly removes a row from the screen. In reality, the handler only updates state, and React reconciles keys to determine which DOM nodes to delete.
2. They assume any value silencing the Console warning is safe. React documentation specifically warns that passing `key={i}` silences the warning while retaining every index-related bug.
3. They assume uniqueness alone makes a good key. A key must be unique among siblings, but it must also remain stable across renders and stay bound to the same data entity.
4. They assume bugs in lists will manifest as incorrect text. Prop values render accurately; the corruption occurs in local state, DOM focus, and uncontrolled inputs.

### The Rule of Thumb: what does the key name?

**Ask one question about every key: what does it name? A dependable key names the specific data entity, stays identical on every render, and is unique among siblings. Only a durable ID satisfies all three rules.**

## SECTION | A To-Do List with an Edit Button on Each Row

Our example application is the to-do list introduced earlier. Each row component encapsulates its own boolean state variable, `isEditing`. Only the individual row needs to track whether its edit form is active. This local state is precisely what an unstable or positional key transfers to the wrong task or discards entirely.

The page has two components:
1. **`TaskList`** holds the `tasks` array in state, and shows one `TaskRow` for each task. It also owns the two functions that change the array: one renames a task, and one deletes it.
2. **`TaskRow`** shows one task. While `isEditing` is false, the row shows the title, **Edit**, and **Delete**. While it is true, the row shows the edit field, **Save**, and **Delete**.

```files title="todo-list: File Explorer" caption="How the files of our to-do list sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it into `#root`
  App.jsx | parent | Exports `App` as default and renders `<TaskList />`
  components/
    TaskList.jsx | list | Holds `tasks` in state and renders one `<TaskRow>` per task with its `key`
    TaskRow.jsx | row | Keeps `isEditing` in state and shows the title or the edit field
```

`TaskList` initializes an array of three tasks and passes each task's ID as the key prop to `TaskRow`:

```jsx title="src/components/TaskList.jsx"
import { useState } from 'react';
import TaskRow from './TaskRow.jsx';

const initialTasks = [
  { id: 1, title: 'Buy milk' },
  { id: 2, title: 'Call Mom' },
  { id: 3, title: 'Pay rent' },
];

export default function TaskList() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleRename(id, newTitle) {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, title: newTitle } : task
    ));
  }

  function handleDelete(id) {
    setTasks(tasks.filter(task => task.id !== id));
  }

  return (
    <>
      <h1>Tasks</h1>
      <ul>
        {tasks.map(task => (
          <TaskRow
            ~key={task.id}~ // Names the task: Call Mom is always 2
            task={task}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </>
  );
}
```

The handler functions create updated arrays using `map()` and `filter()` (Lesson 19). The child `TaskRow` invokes them via callback props (Lesson 23).

Each row manages its own `isEditing` state:

```jsx title="src/components/TaskRow.jsx"
import { useState } from 'react';

export default function TaskRow({ task, onRename, onDelete }) {
  const [~isEditing~, setIsEditing] = useState(false); // Each row keeps its own copy

  return (
    <li>
      {isEditing ? (
        <>
          <input
            value={task.title}
            onChange={e => onRename(task.id, e.target.value)}
          />
          <button onClick={() => setIsEditing(false)}>Save</button>
        </>
      ) : (
        <>
          {task.title}
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </li>
  );
}
```

The edit input is a controlled component (Lesson 20). It displays the current task title, and every keystroke invokes `onRename` with the latest text. Each character typed updates `tasks` in `TaskList`, triggering a re-render of the entire list. Principle 3 explores how this re-render exposes unstable keys.

The root component renders the task list:

```jsx title="src/App.jsx"
import TaskList from './components/TaskList.jsx';

export default function App() {
  return <TaskList />;
}
```

**PRINCIPLES:** A row's state follows its key, not its text. A dependable key must name the item, remain constant across renders, and be unique among siblings. Four foundational principles follow:
1. **Principle 1: React Keeps the Row Whose Key Comes Back.** Deleting a task only updates state data. React retains any component instance whose key persists, preserving its internal state so the edit input remains with Call Mom.
2. **Principle 2: The Index Names a Position, Not a Task.** After deleting the top item, every index shifts to the following task. Local state stays bound to the index position, causing the open edit input to appear on Pay rent.
3. **Principle 3: A Key Must Be the Same on Every Render.** A key generated at runtime never matches between renders, forcing React to tear down and recreate every row. Typing a single letter closes the active edit input.
4. **Principle 4: A Key Must Be Unique Among Siblings.** When two tasks share a title, they share a key. The Console flags the duplicate key, and deleting an item can leave phantom rows on the screen.

---

## PRINCIPLE | `key={task.id}`: the row whose key comes back keeps its state

> [!PRINCIPLE]
> **Principle 1: React Keeps the Row Whose Key Comes Back**
>
> *On every render of a list, React preserves the component instance whose key matches a previous key, keeping its state and DOM nodes, while creating new components for new keys and destroying components whose keys disappear.*
>
> Clicking Delete does not directly remove a DOM element. It updates the array in state. React reconciles the keys of the new list against the keys of the old list. Every row whose key returns retains its component state, ensuring the open edit input stays with Call Mom.
>
> **DO THIS:**
> ```jsx
> {tasks.map(task => (
>   <TaskRow ~key={task.id}~ task={task} onDelete={handleDelete} /> // After a Delete, Call Mom keeps key 2 and its open edit field
> ))}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> {tasks.map(task => (
>   ~<TaskRow~ task={task} onDelete={handleDelete} /> // **WRONG:** no key: the Console reports it, React uses the index, and the open edit field moves after a Delete
> ))}
> ```

### The Click Changes the Array, the Key Picks the Row

Here is the smallest list that demonstrates this rule. It shows the same `<ul>` across two renders, before and after the user deletes Buy milk:

```jsx title="The same list before the Delete"
<ul>
  <li ~key={1}~>Buy milk</li> {/* Key 1 */}
  <li key={2}>Call Mom</li>
  <li key={3}>Pay rent</li>
</ul>
```

```jsx title="The same list after the Delete"
<ul>
  <li ~key={2}~>Call Mom</li> {/* Key 2 again: React keeps this row */}
  <li ~key={3}~>Pay rent</li> {/* Key 3 again: React keeps this row */}
</ul>
```

React compares the two sets of keys. Keys 2 and 3 match existing keys from the previous render. Key 1 is missing from the new list, so React unmounts only the row with key 1.

Developers often imagine event handling and DOM removal as a single operation: clicking Delete on Buy milk removes that row. In React, these are two separate steps:
1. The click handler produces a new array omitting Buy milk and updates state.
2. React renders the new list and destroys only the component whose key is absent.

### What React Does with Each Key

The official React documentation summarizes list reconciliation in four sentences: "React takes each list item's key and searches the previous list's items for a matching key. If the current list has a key that didn't exist before, React creates a component. If the current list is missing a key that existed in the previous list, React destroys the previous component. If two keys match, the corresponding component is moved."

```tree dir=right caption="The three things React does with each key when a list renders again."
React compares the new keys with the old keys
- +The key is found again | React **keeps** that component | Its state and its DOM nodes stay; it gets the **new props**
- +The key is new | React **creates** a component | Its state starts from the **initial value**
- !The key is missing | React **destroys** the old component | Its state and its DOM nodes are **gone**
```

In this context, moved means React preserves the existing component instance even when its relative order or index changes. Here, Call Mom moves from index 1 to index 0, yet React preserves its state because its key remains 2.

The documentation explains the exact purpose of keys: "Keys tell React about the identity of each component, which allows React to maintain state between re-renders." The row with key 2 before the deletion is identical to the row with key 2 after it. This reinforces the core rule from Lesson 25: React attaches component state to a position in the tree, and in a list, the key defines that position.

### Edit on Call Mom, Then Delete on Buy milk

The user clicks **Edit** on Call Mom, then clicks **Delete** on Buy milk. The user interface behaves as expected:

```page caption="The to-do list keyed by task.id, after the user clicks Edit on Call Mom and then Delete on Buy milk."
heading: Tasks
form:
  field:  | Call Mom | good
  button: Save
  button: Delete
line: Pay rent [Edit] [Delete]
console: quiet
```

No custom application code is needed to keep the edit field open. It stays open because React preserved the component instance for key 2 alongside its internal state:
1. When the task row for key 2 first rendered, it initialized `isEditing` to false via `useState(false)`.
2. Clicking **Edit** updated that local state to true.
3. After the deletion, React locates key 2 in the newly returned list. It retains the existing `TaskRow` instance and passes the updated props to it.
4. The component evaluates `isEditing` as true and continues rendering the input pre-filled with Call Mom.

Inspecting the Elements panel confirms this behavior. React removes only the first `<li>` from the DOM. The `<li>` and `<input>` for Call Mom are the identical DOM nodes from before the click. React mutates only the specific DOM nodes that actually changed (Lesson 13).

```dom caption="The Elements panel after the Delete: React removed the li of Buy milk and kept the li of Call Mom with its input."
<ul>
+ <li> | note: Key 2 came back: the same li and the same input as before the Delete
    <input>
    <button>Save</button>
    <button>Delete</button>
  </li>
+ <li>Pay rent ...</li> | note: Key 3 came back: the same li as before
</ul>
```

Remember: component state follows key identity. Because key 2 returned, the active edit input returned with it.

---

## PRINCIPLE | `key={index}`: the state stays at the position while the tasks move up

> [!PRINCIPLE]
> **Principle 2: The Index Names a Position, Not a Task**
>
> *Key each row by a stable ID that identifies the item; when using array indices as keys, inserting, deleting, or sorting items reassigns indices to different items, causing component state to stick to positions while data moves.*
>
> React preserves the component instance whose key returns. When using index keys, deleting an item from the top causes index 0 to point to the second item. Text updates because props reflect the new array order. Internal state, DOM focus, and uncontrolled inputs remain bound to the position, landing on the wrong task.
>
> **DO THIS:**
> ```jsx
> {tasks.map(task => (
>   <TaskRow ~key={task.id}~ task={task} onDelete={handleDelete} /> // The open edit field stays with Call Mom
> ))}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> {tasks.map((task, index) => (
>   <TaskRow ~key={index}~ task={task} onDelete={handleDelete} /> // **WRONG:** after a Delete at the top, the open edit field moves to Pay rent
> ))}
> ```

### The Keys Before and After the Delete

Consider the keys across both lists during the same deletion of Buy milk. First, examine the rows keyed by task ID:

| Key | Before the Delete | After the Delete |
| :--- | :--- | :--- |
| `1` | Buy milk | missing |
| `2` | Call Mom | Call Mom |
| `3` | Pay rent | Pay rent |

Next, examine the same deletion with rows keyed by array index:

| Key | Before the Delete | After the Delete |
| :--- | :--- | :--- |
| `0` | Buy milk | Call Mom |
| `1` | Call Mom | Pay rent |
| `2` | Pay rent | missing |

When using an ID, the key missing from the new list corresponds exactly to the deleted item. When using array indices, every remaining item shifts forward by one slot, reassigning each index to the next item. The key that goes missing is simply the last index.

Developers often assume that because an array index is unique within a single render, it is a valid key. Uniqueness within one render is insufficient. A key must identify the data item across renders, rather than its temporary index.

### The Mistake in `TaskList`

Consider what happens when a developer assigns array indices as keys, using the second parameter passed to `map()` (Lesson 18):

```jsx title="src/components/TaskList.jsx" startLine="26" bad="29"
      <ul>
        {tasks.map((task, index) => (
          <TaskRow
            ~key={index}~ // **WRONG:** names the position 0, 1, 2, not the task
            task={task}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        ))}
      </ul>
```

### Why the Edit Field Jumps to Pay rent

**While row text updates from new props, component state remains attached to the key, and index keys remain locked to positions.** The open edit input stays with the second row, which now displays Pay rent. Here is the step-by-step sequence:
1. The initial list renders Buy milk at key 0, Call Mom at key 1, and Pay rent at key 2.
2. The user clicks **Edit** on Call Mom. The component instance at key 1 sets its internal `isEditing` state to true.
3. The user clicks **Delete** on Buy milk. The event handler updates `tasks` to an array containing Call Mom and Pay rent.
4. `TaskList` re-renders. During `map()`, Call Mom receives key 0 and Pay rent receives key 1.
5. React reconciles key 0 with previous key 0. That instance had `isEditing: false`, so it renders Call Mom as plain text.
6. React reconciles key 1 with previous key 1. That instance had `isEditing: true`, and now receives Pay rent as its task prop. The open edit input displays Pay rent.
7. Key 2 is absent from the new list, so React unmounts the component that previously displayed Pay rent.

```page caption="The to-do list keyed by index, after the user clicks Edit on Call Mom and then Delete on Buy milk."
heading: Tasks
line: Call Mom [Edit] [Delete] | bad
form:
  field:  | Pay rent | bad
  button: Save
  button: Delete
console: quiet
```

The user sees Call Mom closed, and Pay rent inside an active edit box. The text inside the input displays Pay rent because props update correctly. If the user clicks **Save**, Pay rent keeps that text. However, the user is now editing an item they never selected, with no warning indicated anywhere on screen.

Inspecting the Elements panel reveals that React removed the final `<li>` element rather than the first one:

```dom caption="The Elements panel after the Delete with key={index}: the first two li nodes stay with new text, and the last li is gone."
<ul>
+ <li>Call Mom ...</li> | note: Key 0 came back: the li of Buy milk, now with the text Call Mom
! <li> | note: Key 1 came back: the li of Call Mom, still open, now with the text Pay rent
    <input>
    <button>Save</button>
    <button>Delete</button>
  </li>
</ul>
```

### Why Nobody Notices Until the User Deletes

This defect frequently reaches production because development workflows rarely expose it immediately:
1. A developer uses `key={index}` to silence the missing key warning in the Console.
2. The Console goes quiet. React documentation explicitly warns against this shortcut: "Explicitly passing `key={i}` silences the error but has the same problems as array indices and is not recommended in most cases."
3. So long as items are not reordered, inserted, or removed, the list appears completely functional.
4. A user begins editing an item and subsequently deletes an item positioned above it.
5. The edit field abruptly shifts to the item below the intended target.

Sorting a list alphabetically triggers the exact same corruption, because sorting reassigns array indices to different items. Omitting the `key` prop entirely leads to the same outcome, as React defaults to using array indices when keys are missing.

Rendered text is never corrupted by this bug because props always pass the latest data. The defect strikes everything retained by the component instance. It corrupts internal state, active DOM focus, and the checked state of an uncontrolled checkbox (Lesson 18).

### The Fix

The solution requires a single adjustment: keying rows by their stable task ID.

```jsx title="src/components/TaskList.jsx" startLine="26" good="29"
      <ul>
        {tasks.map(task => (
          <TaskRow
            ~key={task.id}~ // Names the task: the edit field stays on Call Mom
            task={task}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        ))}
      </ul>
```

Remember: component state follows key identity. When keys identify data items, state travels with the data.

---

## PRINCIPLE | `key={Math.random()}`: a new key on every render destroys every row

> [!PRINCIPLE]
> **Principle 3: A Key Must Be the Same on Every Render**
>
> *Never generate keys dynamically during render; calling `Math.random()` inside `map()` creates new keys on every render, causing React to destroy and recreate every row.*
>
> React preserves a component instance only when its key matches a key from the previous render. A randomly generated key never matches, so every render destroys component state and DOM nodes for all rows. When typing into a controlled input triggers a state update in the list, this unmount occurs after every keystroke: the input collapses, and focus is lost. Generate unique IDs once upon item creation, and persist them within the data object.
>
> **DO THIS:**
> ```jsx
> function handleAdd(title) {
>   setTasks([...tasks, { ~id: crypto.randomUUID()~, title }]); // The ID is made once, when the user adds the task
> }
> {tasks.map(task => <TaskRow key={task.id} task={task} />)}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> {tasks.map(task => (
>   <TaskRow ~key={Math.random()}~ task={task} /> // **WRONG:** a new key on every render closes the edit field after one letter
> ))}
> ```

### A Key That Is New on Every Render

Now suppose each key is a random number produced during render inside `map()`. Every time the list re-renders, every row receives a key that never existed previously:

| Task | Key on one render | Key on the next render |
| :--- | :--- | :--- |
| Buy milk | `0.42` | `0.58` |
| Call Mom | `0.77` | `0.91` |
| Pay rent | `0.13` | `0.06` |

React reconciles rows by matching keys, and a random number generated during render never matches. On every re-render of the list, React unmounts all existing rows, wiping their local state and DOM nodes, and mounts new components from scratch. Any local user interaction is lost immediately.

Developers sometimes rationalize that `Math.random()` produces unique keys, satisfying React's uniqueness requirement. Uniqueness alone is insufficient. Keys must remain stable across consecutive renders.

### VS | A Render with the Same Key vs. a Render with a New Key: the same key keeps the row, a new key replaces it

Visually, an updated row and a newly created row appear identical. In both cases, React invokes `TaskRow` and paints the resulting markup. **While both render identical text, their underlying lifecycle is completely different:**
- **With a stable key,** React preserves the existing component instance. Its `isEditing` state retains its value, and the `<input>` remains the same DOM node with its active focus intact.
- **With an unstable key,** React unmounts the existing component and mounts a fresh one. Its `isEditing` resets to its initial false value, and the previous `<input>` is removed from the DOM, dropping focus.

```tree caption="A render with the same key keeps the row; a render with a new key destroys it and creates a new one."
What happens to a row when the list renders again
- +The same key [`key={task.id}`] | React **keeps** the row | `isEditing` keeps its value; the `<input>` keeps **the focus**
- !A new key every time [a random number made during render] | React **destroys** the row and **creates** a new one | `isEditing` is **`false` again**; the `<input>` is **gone**
```

### The Mistake in `TaskList`

Suppose incoming task objects lack unique identifiers. Seeing the missing key warning, a developer generates random keys inside render:

```jsx title="src/components/TaskList.jsx" startLine="26" bad="29"
      <ul>
        {tasks.map(task => (
          <TaskRow
            ~key={Math.random()}~ // **WRONG:** a new key on every render of the list
            task={task}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        ))}
      </ul>
```

The Console warning disappears. The initial list renders properly, and deleting items appears to function.

### Why the Edit Field Closes After One Letter

**Typing a single character triggers a parent state update, re-rendering the list with fresh keys that destroy the active row.** Consider what occurs when a user attempts to rename Call Mom to Call Moms.

The user clicks **Edit** on Call Mom, opening the text input. The random keys cause no issue yet because only `TaskRow` updated state. React re-renders only that specific child component. As the official documentation states: "React will call the function component whose state update triggered the render." `TaskList` does not re-render, so `map()` generates no new keys.

```page caption="The to-do list keyed by Math.random, after the user clicks Edit on Call Mom: the edit field opens."
heading: Tasks
line: Buy milk [Edit] [Delete]
form:
  field:  | Call Mom
  button: Save
  button: Delete
line: Pay rent [Edit] [Delete]
console: quiet
```

Next, the user focuses the input and types the letter s:
1. The change event fires, calling `onRename` with the updated title Call Moms, which updates the tasks array in `TaskList`.
2. The task list re-renders, and `map()` evaluates `Math.random()` to generate brand new keys for every item.
3. React searches for the newly generated keys among the previous keys and finds zero matches.
4. React unmounts all three existing rows, destroying their local state and removing their DOM elements, including the active `<input>`.
5. React mounts three fresh rows from scratch, each initializing its internal `isEditing` state to false.

```page caption="The same list after the user types the letter s: the task is renamed, and the edit field is gone."
heading: Tasks
line: Buy milk [Edit] [Delete]
line: Call Moms [Edit] [Delete] | bad
line: Pay rent [Edit] [Delete]
console: quiet
```

The screen displays Call Moms as plain text beside an **Edit** button. The input vanishes after a single keystroke, and subsequent keypresses are ignored. To continue typing, the user must click **Edit** again and re-focus the input.

Two symptoms occur without any explicit application code causing them:
1. **The collapsed edit input.** No handler toggles `isEditing` to false. Each freshly mounted component initializes state via `useState(false)`, as unmounting destroys internal state (Lesson 25).
2. **The dropped focus.** No code blurs the element. The `<input>` element holding active focus was removed from the DOM during reconciliation (Lesson 31).

### Why the Bug Is Hard to Find

Developers often search in the wrong place. Because the input collapses during typing, they suspect `onChange` or `value` props in the controlled component. The official documentation for form inputs highlights this exact troubleshooting case. First: "it's possible that the input gets removed and re-added from the DOM on every keystroke." Second: "This can happen if you're accidentally resetting state on every re-render, for example if the input or one of its parents always receives a different `key` attribute."

Typing is not the only trigger. Any state update in `TaskList` recreates every row: deleting a task, renaming an item, or a re-render of a parent component (Lesson 54). React documentation warns that unstable keys "will cause keys to never match up between renders, leading to all your components and DOM being recreated every time." The guide adds: "Not only is this slow, but it will also lose any user input inside the list items."

### VS | A Random Key Made on Every Render vs. a Random ID Made Once: only the ID made once stays the same

The solution does not forbid random identifiers. It generates them once when the data item is created:

```jsx title="A random key made during render, and a random ID made once when the task is created"
<TaskRow ~key={Math.random()}~ task={task} /> // Runs on every render: a new key each time
const newTask = { ~id: crypto.randomUUID()~, title: 'Buy bread' }; // Runs once, when the user adds the task
```

**While both approaches generate random values, their execution timing makes all the difference:**
- **Calling `Math.random()` inside `map()`** runs during every render pass, creating brand new keys every time.
- **Calling `crypto.randomUUID()`** runs once when creating the item, storing the value permanently on the object. Every render pass reads that same persistent ID.

The official rule is explicit: "**Keys must not change** or that defeats their purpose! Don't generate them while rendering."

Using `useId` is not a valid alternative either (Lesson 52). The API reference states: "`useId` **should not be used to generate keys** in a list. Keys should be generated from your data."

Remember: component state follows key identity. Changing keys on every render wipes component state on every render.

---

## PRINCIPLE | `key={task.title}`: two rows with the same title share one key

> [!PRINCIPLE]
> **Principle 4: A Key Must Be Unique Among Siblings**
>
> *Key each row by a value that no sibling item can duplicate and that remains immutable; item titles frequently repeat and change, causing multiple rows to share a single key.*
>
> React reconciles rows by key identity. When two rows share a key, React cannot differentiate between them: the Console prints a duplicate key error, and deleting one item can leave phantom rows in the DOM. Deriving keys from mutable titles also causes keys to change during renaming, collapsing the edit input. Stable identifiers are both unique and immutable.
>
> **DO THIS:**
> ```jsx
> {tasks.map(task => (
>   <TaskRow ~key={task.id}~ task={task} onDelete={handleDelete} /> // Two Buy milk tasks get keys 1 and 4
> ))}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> {tasks.map(task => (
>   <TaskRow ~key={task.title}~ task={task} onDelete={handleDelete} /> // **WRONG:** two Buy milk tasks share one key, and a deleted one can stay on the page
> ))}
> ```

### Four Tasks, Two Named Buy milk

Users frequently add identical task titles on different days. In this scenario, the list contains four tasks, and two share the title Buy milk:

```jsx title="Four tasks keyed by their title"
const initialTasks = [
  { id: 1, title: 'Buy milk' },
  { id: 2, title: 'Call Mom' },
  { id: 3, title: 'Pay rent' },
  { id: 4, title: 'Buy milk' },
];

{tasks.map(task => (
  <TaskRow ~key={task.title}~ task={task} onRename={handleRename} onDelete={handleDelete} /> // **WRONG:** two rows get the key Buy milk
))}
```

React matches list items by key. When two rows share the title Buy milk, a single key maps to two distinct component instances. React cannot determine which instance corresponds to which data item on subsequent renders.

Developers sometimes assume that because a title originates from the data, it serves as a suitable key. Titles are neither reliably unique nor immutable. Users frequently enter duplicate task names, and renaming a task alters its title. Only a dedicated identifier guarantees uniqueness and stability.

### What the Console Reports

On the initial render, four rows appear, and the Console logs an error for the duplicate keys:

```page width=full caption="The to-do list keyed by task.title on the first render: four rows, and an error in the Console for the two Buy milk rows."
heading: Tasks
line: Buy milk [Edit] [Delete]
line: Call Mom [Edit] [Delete]
line: Pay rent [Edit] [Delete]
line: Buy milk [Edit] [Delete]
console: Encountered two children with the same key, `Buy milk`. Keys should be unique so that components maintain their identity across updates.
```

The warning notes that components sharing identical keys may be duplicated or omitted, and highlights that this behavior is unsupported. The official rule states: "**Keys must be unique among siblings.**" Siblings are elements within the same rendered array. Separate lists on the same page can safely reuse identical key values.

### Delete on the First Buy milk

**Deleting one duplicate task can cause deleted elements to persist on the screen.** Here is the step-by-step breakdown:
1. The data array contains four items: Buy milk with ID 1, Call Mom with ID 2, Pay rent with ID 3, and Buy milk with ID 4. Keys are derived from titles.
2. The user clicks **Delete** on the first Buy milk. State updates to an array containing Call Mom, Pay rent, and the second Buy milk.
3. React searches for the new keys among the previous keys. The key Buy milk matches two previous rows, and React associates only one with the incoming element.
4. The remaining old Buy milk row fails to match any key transition cleanly, and React fails to remove its DOM element.

```page width=full caption="The to-do list keyed by task.title, after the user deletes the first Buy milk: the data holds three tasks, and the page still shows four rows."
heading: Tasks
line: Buy milk [Edit] [Delete] | bad
line: Call Mom [Edit] [Delete]
line: Pay rent [Edit] [Delete]
line: Buy milk [Edit] [Delete]
console: Encountered two children with the same key, `Buy milk`. Keys should be unique so that components maintain their identity across updates.
```

The data array holds three tasks, yet the screen still displays four rows. The Console error persists from the initial render. No application code rendered this phantom row; it is an orphaned DOM node that React failed to remove because key reconciliation broke down. Because React explicitly defines duplicate keys as unsupported behavior, resulting UI state is unpredictable.

### A Title Also Changes When the User Renames the Task

Even when all titles are initially unique and the Console remains quiet, using titles as keys introduces bugs. When a user clicks **Edit** on Call Mom and types an s, the title becomes Call Moms. The key changes from Call Mom to Call Moms. React cannot find the previous key, so it unmounts the row and creates a fresh instance. The edit input collapses after one character, exactly as in Principle 3.

### The Fix

The solution is to key elements using dedicated identifiers. When raw data lacks IDs, assign unique identifiers using a counter or `crypto.randomUUID()` when the item is created, and store that identifier on the object. The corrected list manages four tasks, including two with identical titles, keyed reliably by ID:

```jsx title="src/components/TaskList.jsx" startLine="4"
const initialTasks = [
  { id: 1, title: 'Buy milk' },
  { id: 2, title: 'Call Mom' },
  { id: 3, title: 'Pay rent' },
  { ~id: 4~, title: 'Buy milk' }, // Same title, different ID
];
```

```jsx title="src/components/TaskList.jsx" startLine="28" good="30"
        {tasks.map(task => (
          <TaskRow
            ~key={task.id}~ // 1, 2, 3, 4: unique and the same on every render
            task={task}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        ))}
```

The Console remains silent. Deleting the first Buy milk cleanly removes the row with key 1, while the second Buy milk remains on screen with key 4.

Remember: component state follows key identity. Multiple rows cannot share a single identity.

---

## All 4 Principles Together

### The Complete Files

Here is the complete implementation. `TaskList` keys each row with the task's unique ID. This key identifies the specific task, remains constant across renders, and is unique within the list:

```jsx title="src/App.jsx"
import TaskList from './components/TaskList.jsx';

export default function ~App~() { // 1. Called first when the page loads
  return <TaskList />;
}
```

```jsx title="src/components/TaskList.jsx"
import { useState } from 'react';
import TaskRow from './TaskRow.jsx';

const initialTasks = [
  { id: 1, title: 'Buy milk' },
  { id: 2, title: 'Call Mom' },
  { id: 3, title: 'Pay rent' },
  { id: 4, title: 'Buy milk' },
];

export default function ~TaskList~() { // 2. Called second, and again after every Delete and every letter typed
  const [tasks, setTasks] = useState(initialTasks);

  function handleRename(id, newTitle) {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, title: newTitle } : task
    ));
  }

  function handleDelete(id) {
    setTasks(tasks.filter(task => task.id !== id));
  }

  return (
    <>
      <h1>Tasks</h1>
      <ul>
        {tasks.map(task => (
          <TaskRow
            ~key={task.id}~ // Principles 1 to 4: names the task, the same on every render, unique in the list
            task={task}
            onRename={handleRename}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </>
  );
}
```

```jsx title="src/components/TaskRow.jsx"
import { useState } from 'react';

export default function ~TaskRow~({ task, onRename, onDelete }) { // 3. Called once per task, in the order of tasks
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li>
      {isEditing ? (
        <>
          <input
            value={task.title}
            onChange={e => onRename(task.id, e.target.value)}
          />
          <button onClick={() => setIsEditing(false)}>Save</button>
        </>
      ) : (
        <>
          {task.title}
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </li>
  );
}
```

### How React Renders and Updates the List

On initial render, React executes `App`, then `TaskList`, followed by a row component for each task. After every deletion or character typed in an edit field, `TaskList` re-renders. React matches each `TaskRow` instance to its previous state using the task ID:

```tree caption="The order in which React calls the components of the to-do list, and the key of each row."
`App` [1. Renders `<TaskList />`] | **Root component**
- +`TaskList` [2. Holds `tasks` in state] | Renders one `TaskRow` per task, **keyed by `task.id`**
  - +`TaskRow` with key `1` [3. `Buy milk`] | Keeps its own `isEditing`
  - +`TaskRow` with key `2` [4. `Call Mom`] | Keeps its own `isEditing`
  - +`TaskRow` with key `3` [5. `Pay rent`] | Keeps its own `isEditing`
  - +`TaskRow` with key `4` [6. `Buy milk`] | Keeps its own `isEditing`
```

Here is the resulting interface after editing Call Mom and deleting the first Buy milk:

```page caption="The finished to-do list after the user clicks Edit on Call Mom and Delete on the first Buy milk: the edit field stays on Call Mom, and three rows are left."
heading: Tasks
form:
  field:  | Call Mom | good
  button: Save
  button: Delete
line: Pay rent [Edit] [Delete]
line: Buy milk [Edit] [Delete]
console: quiet
```

### Each Key, and What the User Sees

| Key | What it names | After a Delete at the top | While the user types in an edit field | Console |
| :--- | :--- | :--- | :--- | :--- |
| **`key={task.id}`** | The task | The edit field stays on Call Mom | The edit field stays open | Quiet |
| **`key={index}`** | The position in the list | The edit field jumps to Pay rent | The edit field stays open | Quiet |
| **`key={Math.random()}`** | Nothing: a new key on every render | Every row is destroyed and created again | The edit field closes after one letter | Quiet |
| **`key={task.title}`** | A title that can repeat and change | A deleted Buy milk can stay on the page | The edit field closes after one letter | An error for two children with the same key |

Remember the core rule of this lesson: **a row's state follows its key, not its text**. Always give every list row a key that names the data item: a unique, immutable identifier.

---

## For the Interview

> **The Interview Question:** What makes a good key across re-renders, and how do unstable or duplicate keys corrupt reconciliation?

### How to Answer Clearly in 30 Seconds

When rendering a list, React matches elements in the new render with elements in the previous render using their `key` props. This process is list reconciliation. When a key matches, React preserves that component instance, its internal state, and its DOM node, passing down updated props. When a key is new, React mounts a fresh component. When a key is missing, React destroys the previous component. Because component state attaches to this identity, a good key must meet four criteria:
1. **It identifies the data entity, not a position.** Using array indices causes keys to shift whenever items are inserted, deleted, or sorted. Local state, focus, and uncontrolled inputs remain stuck at the original index position.
2. **It remains stable across renders.** Calling `Math.random()` inside `map()` produces new keys on every render. React unmounts and recreates every row, which degrades performance and wipes active form inputs and focus.
3. **It is unique among siblings.** When sibling items share a key, React cannot distinguish between them. This triggers Console errors and causes reconciliation to orphan deleted DOM nodes.
4. **It originates from the data.** Use database primary keys, or generate unique identifiers once using a counter or `crypto.randomUUID()` when the item is created.

### Three Classic Follow-Up Questions Interviewers Ask

1. **"The Console is quiet with `key={index}`. Why is it still a problem, and when is it fine?"**
   The Console only checks that each item has a key and that keys are unique within that render; array indices satisfy both checks. React documentation warns: "Explicitly passing `key={i}` silences the error but has the same problems as array indices." The docs illustrate this with a sorted contact list: when expanding Alice's details and reversing the sort order, Taylor's details expand instead. Using `key={contact.id}` fixes this by providing a named identity independent of order. Indices are acceptable only when three conditions hold: the list never reorders, items are never inserted or removed, and rows hold no local state. Moving `isEditing` into `TaskList` hides the symptom for that input, but active DOM focus and uncontrolled inputs still suffer position drift.
2. **"Why does `key={Math.random()}` lose the focus, and is `useId` a better choice?"**
   Because randomly generated keys never match previous keys, React unmounts every existing row on every render pass. The active `<input>` element is removed from the DOM, immediately dropping focus. `useId` is not an appropriate substitute: the documentation explicitly states that `useId` should not be used to generate keys in a list, as keys must originate from data. Generate stable IDs upon item creation and persist them on the data records.
3. **"Do keys matter outside a list?"**
   Yes. Passing a `key` to a standalone component controls its identity in the component tree. React documentation explains that specifying a key instructs React to use the key as part of the component position. In an interface like `<Chat key={recipientId} />`, changing recipients provides a new key. React destroys the previous chat instance and mounts a fresh one with reset state (Lesson 25).

```tree dir=right caption="Interview summary: what each kind of key names, and what the user sees after a change to the list."
What makes a good key
- +The ID from the data [`key={task.id}`] | Names **the item**, the same on every render, unique | State **stays with the item**
- !The index [`key={index}`] | Names **a position** | State **moves to another item** after a Delete, insert, or sort
- !A random number made during render | Names **nothing** for longer than one render | Every row is **destroyed and created again**
- !A title [`key={task.title}`] | Can **repeat** and can **change** | Two rows share a key; a deleted row **can stay on the page**
```
