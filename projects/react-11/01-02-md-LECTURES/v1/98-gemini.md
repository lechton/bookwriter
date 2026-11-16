# Lecture 98: PureComponent, shouldComponentUpdate, and What Replaced Them

*(How did a class component skip a render it did not need, and what does a function component use for the same job today?)*

> INTERVIEW QUESTION | LEGACY | How did PureComponent and shouldComponentUpdate prevent re-renders, and what replaced them?

---

## VS | `shouldComponentUpdate` vs. `PureComponent`: you write the comparison, or React writes it for you

> When a parent component renders, React re-renders every child component inside it by default. That includes child components whose props have not changed. **Before React introduced Hooks, a class component could skip an unnecessary render in two ways. You could write a method named `shouldComponentUpdate`, or extend `PureComponent` and let React compare every prop.** Both approaches test whether each incoming prop matches its previous value. Modern function components rely on `memo` for that same optimization.

Start with a core rule of JavaScript: strict equality with the `===` operator.

```js title="Plain JavaScript: the same value, or the very same array"
~'Today' === 'Today'~; // true: two strings with the same letters are equal
~['Buy milk'] === ['Buy milk']~; // false: two arrays, created separately
const tasks = ['Buy milk'];
~tasks === tasks~; // true: the very same array, compared with itself
```

Hold on to these three lines. In JavaScript, primitive strings compare by value. Two strings with identical characters evaluate to equal. In contrast, arrays, objects, and functions compare by reference in memory. Two distinct arrays with identical items are never equal under strict equality. An array is strictly equal only to itself. Every optimization in this lesson depends on this fundamental rule of JavaScript.

Now consider React. When component state changes, React calls that component again (Lesson 54). React then re-renders every child component nested inside it. In most interfaces, this default rendering cycle is fast and harmless.

Now picture a task list with a text input field on top. Every keystroke typed by the user updates the state of the parent component. That update forces the list below to re-render, even though its items never changed. When a list contains hundreds of tasks, these repeated renders make typing feel sluggish.

The list needs to instruct React: inspect my props before rendering. If every prop matches the previous render, skip my render step completely.

### Two Ways to Say "Skip Me"

Before Hooks, a class component communicated this instruction in two ways:

```jsx title="Two class components that tell React to skip a render"
class TaskList extends Component {
  ~shouldComponentUpdate~(nextProps) { // You write the comparison yourself: false means skip
    return nextProps.tasks !== this.props.tasks;
  }
}

class TaskList extends ~PureComponent~ { // React writes the comparison, for every prop
}
```

1. **Write a method named `shouldComponentUpdate`.** React invokes this method before each scheduled render. Returning `false` instructs React to skip the render step.
2. **Extend `PureComponent` instead of `Component`.** You write no custom method. React compares every prop and state field automatically, skipping when none have changed.

> [!DEFINITION]
> **What does it mean to skip a render?** [NEW] To skip a render means that React does not call the component's `render` method this time.
> The component's last output stays on the screen exactly as it was. Nothing on the page flickers or changes.
> A skip saves work only when nothing the component shows has changed. A skip at the wrong moment leaves old data on the screen (Lesson 98).

```tree caption="Two ways a class component told React to skip a render when nothing it shows has changed."
Two ways a class component skipped a render
- +Write `shouldComponentUpdate` | React **asks the component** before each render | The method returns **`false`** and React **skips `render`**
- +Extend `PureComponent` | React **compares every prop and state field** for us | When all of them are the same, React **skips `render`**
```

### What Is at Stake

Skipping a render at the wrong moment hides real data from the user.

Suppose the list extends `PureComponent`, and the Add button handler mutates state directly with `push`. The user enters a task and clicks Add. The input field clears, but the new task never appears in the list:

```page width=text caption="With push and PureComponent, the user clicks Add: the input field empties, and the list still shows only two tasks."
heading: My tasks
form:
  field: New task
  button: Add
line: Buy milk [Remove]
line: Call John [Remove]
```

Why does this happen? Recall `tasks === tasks`. The `push` method mutates the existing array in place without creating a new reference. When React compares the incoming array against the previous render, both variables point to the identical address in memory. React treats the data as unchanged and skips the component. The user added an item, but the interface never updates.

The word pure in `PureComponent` carries its standard React meaning (Lesson 14). A pure component returns identical output whenever its props, state, and context remain unchanged. By extending `PureComponent`, a class promises that its output follows this rule. React can therefore reuse the previous rendered result safely instead of calling `render` again.

Here is where developers often misunderstand the optimization. When the page first mounts, a standard `Component` and a `PureComponent` render the exact same markup. **They appear identical on initial load, but their update behavior is fundamentally different.** Developers often assume extending `PureComponent` makes any component faster. In reality, a `PureComponent` re-renders only when a parent passes a different prop reference or updates local state.

### Four Ways to Skip a Render That You Meet at Work

You encounter four different skipping techniques in production codebases across legacy and modern architectures:
1. **A custom `shouldComponentUpdate` method**, used in class components to evaluate specific props. Official React documentation recommends `PureComponent` instead.
2. **Extending `PureComponent`**, used in class components to compare every prop and state field automatically.
3. **The `memo` wrapper**, used for function components. It pairs with `useCallback` and `useMemo` to keep props identical across renders (Lesson 55, Lesson 56, and Lesson 57).
4. **React Compiler**, which injects memoization checks automatically across components at build time (Lesson 63).

```tree dir=right caption="Four ways to skip a render, from the oldest class code to the newest function code."
Four ways to skip a render
- +Hand-written method [`shouldComponentUpdate`] | Class code | We **write the comparison** ourselves
- +Built-in comparison [`PureComponent`] | Class code | React **compares every prop and state field**
- +Wrapped function [`memo`] | Function components | React **compares every prop**; `useCallback` and `useMemo` keep props the same
- +Automatic [React Compiler] | Function components | The compiler **adds the skip** for us
```

React documentation categorizes `PureComponent` as a legacy API. React still exports the class for backward compatibility, but modern applications avoid it. This lesson teaches you how to read existing class code and migrate it into modern function components.

### The Rule of Thumb: is every prop the very same value as last time?

**Evaluate one question for every incoming prop: does it hold the identical reference or primitive value from the previous render? Strings and numbers with matching values evaluate to equal. Arrays, objects, and functions are equal only when they share the exact same memory address. When every prop satisfies this check, React skips the render.**

This single principle clarifies two common production pitfalls:
1. **Values created during render.** An inline arrow function or newly constructed object gets a fresh memory reference on every pass. The equality check always fails, preventing any skipped render.
2. **Direct state mutation with `push`.** Mutating an array keeps its original reference intact. The equality check always succeeds, causing React to skip the render and drop visible updates.

## SECTION | A To-Do List in Two Files

Our example application is a to-do list. The top of the page features a text input field labeled New task, paired with an Add button. Below the form sits the task list, where each row provides a Remove button. When the application mounts, the list displays two initial items:

```page width=text caption="The to-do list when the page opens: an empty New task field, an Add button, and two tasks."
heading: My tasks
form:
  field: New task
  button: Add
line: Buy milk [Remove]
line: Call John [Remove]
```

The user types a new item into the input field and clicks Add.

Typing `Pay rent` requires eight separate keystrokes. Each individual keystroke updates the text value stored in parent state, triggering a re-render of the parent component. Because the parent renders eight times, the child list re-renders eight times as well. The list continues showing the same two initial tasks throughout this sequence. Because the visible tasks never changed, those eight child renders represent wasted computation.

The application divides responsibilities between two components in separate files:

```files title="todo-list: File Explorer" caption="The two components of the to-do list inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `TodoApp` from `./TodoApp.jsx` and mounts it into `#root`
  TodoApp.jsx | parent | Exports `TodoApp` as default, holds `tasks` and `text` in state, and imports `TaskList`
  TaskList.jsx | child | Exports `TaskList` as default and renders one row per task
```

The parent component is `TodoApp`, implemented as a class (Lesson 96). It stores the task array and current input text in state. Event handlers are declared as arrow function class fields. JavaScript binds each class field once when creating the component instance:

```jsx title="src/TodoApp.jsx"
import { Component } from 'react';
import TaskList from './TaskList.jsx';

export default class TodoApp extends Component {
  state = { tasks: ['Buy milk', 'Call John'], text: '' };

  handleChange = (e) => {
    ~this.setState({ text: e.target.value })~; // Every keystroke renders TodoApp again
  };

  handleAdd = () => {
    this.setState({ tasks: [...this.state.tasks, this.state.text], text: '' });
  };

  removeTask = (task) => {
    this.setState({ tasks: this.state.tasks.filter(t => t !== task) });
  };

  render() {
    return (
      <section>
        <h1>My tasks</h1>
        <label>New task <input value={this.state.text} onChange={this.handleChange} /></label>
        <button onClick={this.handleAdd}>Add</button>
        <TaskList ~tasks={this.state.tasks}~ ~onRemove={this.removeTask}~ /> {/* The two props the list receives */}
      </section>
    );
  }
}
```

The child component is `TaskList`. It begins as a standard `Component`. A console logging statement tracks every execution of its `render` method:

```jsx title="src/TaskList.jsx"
import { Component } from 'react';

export default class TaskList extends Component {
  render() {
    ~console.log('TaskList rendered')~; // Prints once for every render of the list
    return (
      <ul>
        {this.props.tasks.map(task => (
          <li key={task}>
            {task} <button onClick={() => this.props.onRemove(task)}>Remove</button>
          </li>
        ))}
      </ul>
    );
  }
}
```

The user types `Pay` into the field. The on-screen list displays no visual changes. However, the console logs four render passes: one during initial mount, and three subsequent logs for each typed character:

```page width=text caption="After the user types Pay, the list looks the same, and the Console shows TaskList rendered four times."
heading: My tasks
form:
  field: New task | Pay
  button: Add
line: Buy milk [Remove]
line: Call John [Remove]
log: TaskList rendered | TaskList.jsx:5
log: TaskList rendered | TaskList.jsx:5
log: TaskList rendered | TaskList.jsx:5
log: TaskList rendered | TaskList.jsx:5
```

Here is an important detail for testing in your browser. Every preview in this lesson reflects production behavior with one log per render. In development mode, Strict Mode intentionally invokes `render` twice to surface unexpected side effects (Lesson 47). Your local console displays double logs unless React DevTools dims the secondary pass.

Now we will optimize the list to skip redundant renders, and examine the ways developers accidentally break that optimization:

**PRINCIPLES:** A class component could skip a render in two ways: implement a custom comparison in `shouldComponentUpdate`, or extend `PureComponent` to let React compare props shallowly. Both techniques check whether each prop reference remains identical, and modern `memo` applies this same standard. Six core principles govern this behavior:
1. **Principle 1: `shouldComponentUpdate` Returns `false` to Skip the List.** React calls this lifecycle method before rendering. Returning `false` bypasses `render`. Any prop omitted from the comparison leaves stale data on screen.
2. **Principle 2: `PureComponent` Compares Every Prop for You.** Extending `PureComponent` shallowly compares every prop and state field automatically, avoiding the manual maintenance of lifecycle methods.
3. **Principle 3: An Arrow Written in `render` Is a New Function Every Time.** Recreating function instances during render allocates new references on each pass, preventing shallow equality optimizations from skipping.
4. **Principle 4: `push` Keeps the Same Array, So the New Task Is Missing.** Direct array mutation preserves the original memory reference. Shallow comparison sees no change and skips rendering, hiding the new item.
5. **Principle 5: `memo` Takes Over From `PureComponent`.** The modern `memo` wrapper compares incoming props for function components. Its custom comparison function returns `true` to skip, inverting the convention of `shouldComponentUpdate`.
6. **Principle 6: `useCallback` Keeps `removeTask` the Same After the Migration.** Function components re-declare local functions on every render pass. Wrapping handlers in `useCallback` provides the stable reference required for `memo` to skip.

---

## PRINCIPLE | `shouldComponentUpdate`: return `false`, and React skips `render`

> [!PRINCIPLE]
> **Principle 1: `shouldComponentUpdate` Returns `false` to Skip the List**
>
> *When a class component defines `shouldComponentUpdate`, React calls it before each render caused by new props or new state; `false` skips `render`, and `true`, the default, renders.*
>
> The parent renders on every keystroke, so the list renders too, with the same tasks. `shouldComponentUpdate` lets the list compare its old props with the new ones and answer `false` when nothing it shows has changed. The method covers only the props it names, so a prop it forgets stays frozen on the screen.
>
> **DO THIS:**
> ```jsx
> shouldComponentUpdate(nextProps) {
>   return ~nextProps.tasks !== this.props.tasks~; // The list shows only tasks: the same array, so skip
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> shouldComponentUpdate(nextProps) {
>   return ~nextProps.tasks !== this.props.tasks~; // **WRONG:** render also shows title, which is never compared
> }
> render() {
>   return <h2>{this.props.title}</h2>;
> }
> ```

A class component can define a lifecycle method named `shouldComponentUpdate`. React invokes this method before executing a scheduled render triggered by incoming props or state updates. React reads the returned boolean value:
- **`true` means continue rendering.** This is the default behavior. A component lacking this method always renders when prompted.
- **`false` means skip rendering.** React bypasses the `render` call, and the component retains its existing DOM elements unchanged.

```tree caption="What React does with each answer of shouldComponentUpdate."
The answer of `shouldComponentUpdate`
- +Returns `true` | The default when the method is missing | React **calls `render`** again
- +Returns `false` | The method says **nothing I show has changed** | React **skips `render`**; the screen keeps the last output
```

### Where `nextProps` Comes From

React provides incoming values through explicit lifecycle arguments in three distinct steps:
1. The parent component re-renders and evaluates new prop values for `TaskList`.
2. Before updating the DOM, React passes those upcoming props as `nextProps` into `shouldComponentUpdate`.
3. Inside the method, `this.props` still references the existing props from the previous render. This timing allows direct comparison between previous and incoming values.

React delivers `nextState` through the same mechanism as the second argument (Lesson 97). Because our task list holds no internal state, it inspects only `nextProps`.

### The List Skips Every Keystroke

We add `shouldComponentUpdate` to our list component. It evaluates only `tasks`, which is the array displayed by the markup:

```jsx title="src/TaskList.jsx"
import { Component } from 'react';

export default class TaskList extends Component {
  ~shouldComponentUpdate~(nextProps) { // React asks this before every render of TaskList
    return ~nextProps.tasks !== this.props.tasks~; // The same array while the user types: returns false
  }

  render() {
    console.log('TaskList rendered');
    return (
      <ul>
        {this.props.tasks.map(task => (
          <li key={task}>
            {task} <button onClick={() => this.props.onRemove(task)}>Remove</button>
          </li>
        ))}
      </ul>
    );
  }
}
```

The user opens the page and types `Pay` into the input field. The visual interface remains stable. This time, the console logs only once for the initial mount:

```page width=text caption="With shouldComponentUpdate, the user types Pay, and the Console still shows TaskList rendered only once."
heading: My tasks
form:
  field: New task | Pay
  button: Add
line: Buy milk [Remove]
line: Call John [Remove]
log: TaskList rendered | TaskList.jsx:9
```

Here is the exact runtime sequence React executes on each keystroke:
1. The user types `P` into the input field.
2. The `handleChange` handler updates parent state with `this.setState`, scheduling a parent render.
3. React executes `shouldComponentUpdate` on `TaskList`.
4. The `tasks` array points to the identical array in memory.
5. The method evaluates to `false`. React skips executing `render` on `TaskList`, leaving existing DOM nodes untouched.

React never invokes `shouldComponentUpdate` during the initial mount phase. The component always renders its initial output to the screen.

When the user clicks Add, `handleAdd` constructs a new array containing the new item. The comparison detects a new memory reference and returns `true`. React renders the list, displaying three items.

### The Method Answers Only for What It Compares

A hand-written lifecycle check covers only the specific properties named in its code. Suppose another developer adds a `title` prop to display a section heading above the rows. That developer leaves `shouldComponentUpdate` untouched:

```jsx title="A comparison that never looks at the new title prop" bad="2,6"
shouldComponentUpdate(nextProps) {
  return ~nextProps.tasks !== this.props.tasks~; // **WRONG:** never looks at title, so a new title is skipped
}

render() {
  return <h2>{this.props.title}</h2>; // Stays on Today after the parent passes This week
}
```

The parent component updates the heading from `Today` to `This week`. Because the comparison only checks `tasks`, it finds the same array reference and returns `false`. The heading on screen remains frozen on `Today`, with zero console errors to signal the defect.

This fragile behavior explains why React documentation recommends `PureComponent`. Extending `PureComponent` prevents accidental omissions by automatically comparing every prop, including properties introduced in future updates.

### Five More Facts Interviewers Ask About

1. **React bypasses the method on initial mount and during forced updates.** Calling `this.forceUpdate` forces a render pass regardless of what the lifecycle method would return.
2. **Returning `false` does not suppress internal child state updates.** If an embedded child component updates its own local state, that child re-renders independently.
3. **The return value functions as an advisory hint.** React documentation states that React may treat the return value as a hint, meaning React can still re-render when internal scheduling requires it.
4. **Comparisons must remain fast and shallow.** Performing deep recursive object traversals or running `JSON.stringify` inside this method degrades performance, risking multi-second interface freezes.
5. **The method serves exclusively as a performance optimization.** If application logic depends on `shouldComponentUpdate` to prevent side effects or data corruption, the underlying architecture must be fixed first.

---

## PRINCIPLE | `PureComponent`: React compares every prop and every state field for you

> [!PRINCIPLE]
> **Principle 2: `PureComponent` Compares Every Prop for You**
>
> *Extending `PureComponent` instead of `Component` is the same as a `shouldComponentUpdate` that shallowly compares every prop and every state field; the component still renders when a context it reads changes.*
>
> A hand-written comparison has to name every prop, and it breaks when someone adds a prop later. `PureComponent` compares every prop and every state field for us, each one on its own: a string by value, an array or a function by reference. A list that extends it skips every keystroke in the field above it.
>
> **DO THIS:**
> ```jsx
> class TaskList extends ~PureComponent~ { // React compares tasks, onRemove, and any prop added later
>   render() {
>     return <ul>{this.props.tasks.map(task => <li key={task}>{task}</li>)}</ul>;
>   }
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> class TaskList extends Component {
>   shouldComponentUpdate(nextProps) {
>     return ~nextProps.tasks !== this.props.tasks~; // **WRONG:** compares one prop by hand and misses onRemove and title
>   }
> }
> ```

### VS | A Hand-Written Comparison vs. `extends PureComponent`: the same check, written by you or by React

Our list component receives two props: `tasks` and `onRemove`. To verify both properties manually, the lifecycle method must evaluate both explicitly:

```jsx title="Comparing every prop by hand in shouldComponentUpdate"
class TaskList extends Component {
  shouldComponentUpdate(nextProps) {
    return ~nextProps.tasks !== this.props.tasks || nextProps.onRemove !== this.props.onRemove~; // Renders when any prop is different
  }
}
```

Extending `PureComponent` automates this entire comparison. The class requires no custom method at all:

```jsx title="Letting PureComponent compare every prop"
import { PureComponent } from 'react';

class TaskList extends ~PureComponent~ { // No method: React compares every prop and every state field
}
```

These two implementations produce the exact same runtime check. React documentation notes that extending `PureComponent` is equivalent to defining `shouldComponentUpdate` with a shallow comparison of all props and state.

Because our list holds no state, both versions compare the exact same two props. The key distinction is maintainability. With `PureComponent`, React manages the checks, ensuring full coverage for any future props added by your team.

Under the hood, `PureComponent` is a subclass of `Component`. Your component retains every capability of standard class components, including `this.props` and `this.setState`.

> [!DEFINITION]
> **What is a shallow comparison?** [NEW] A shallow comparison checks each prop on its own against its old value, with the same check that `memo` uses, `Object.is` (Lesson 55). It never looks inside a value.
> A string or a number compares by value: `'Today'` and `'Today'` are the same.
> An object, an array, or a function compares by reference: two arrays with the same tasks inside count as different, unless they are the very same array. It is the `===` from the start of this lesson (Lesson 98).

```tree caption="What the shallow comparison of PureComponent looks at for each kind of prop."
How `PureComponent` compares one prop
- +A string or a number | Compared **by value** | `'Today'` and `'Today'` count as **the same**
- !An object, an array, or a function | Compared **by reference**, never by what is inside | Two arrays with the same tasks count as **different**, unless they are **the very same array**
```

This distinction leads to a crucial interview answer. When asked what `PureComponent` checks, the senior answer is not whether list data changed. It verifies whether each prop holds the identical primitive value or memory reference as the previous render. It never inspects array contents.

### VS | `extends Component` vs. `extends PureComponent`: both look the same, only one skips the keystrokes

We update our list component to extend `PureComponent`, removing the manual lifecycle method:

```jsx title="src/TaskList.jsx"
import { PureComponent } from 'react';

export default class TaskList extends ~PureComponent~ { // React compares tasks and onRemove before each render
  render() {
    console.log('TaskList rendered');
    return (
      <ul>
        {this.props.tasks.map(task => (
          <li key={task}>
            {task} <button onClick={() => this.props.onRemove(task)}>Remove</button>
          </li>
        ))}
      </ul>
    );
  }
}
```

The parent component remains unchanged. When the application mounts, both versions display the identical interface. After the user types `Pay`, both views look identical. Only console output reveals the performance difference:

::: row caption="After the user types Pay, both lists look the same, but only the list with extends Component renders after every keystroke."
::: col title="extends Component" tag="renders after every keystroke" tone=bad
```page size=mini
heading: My tasks
form:
  field: New task | Pay
  button: Add
line: Buy milk [Remove]
line: Call John [Remove]
log: TaskList rendered | TaskList.jsx:5
log: TaskList rendered | TaskList.jsx:5
log: TaskList rendered | TaskList.jsx:5
log: TaskList rendered | TaskList.jsx:5
```
With `extends Component`, the list renders once when the page opens and once after each of the three keystrokes.
:::
::: col title="extends PureComponent" tag="skips the keystrokes" tone=good
```page size=mini
heading: My tasks
form:
  field: New task | Pay
  button: Add
line: Buy milk [Remove]
line: Call John [Remove]
log: TaskList rendered | TaskList.jsx:5
```
With `extends PureComponent`, all incoming props match the previous render, so React skips the list after all three keystrokes.
:::
:::

### A Context Still Renders a `PureComponent`

A developer might extend `PureComponent` on a component that consumes React context, such as a color theme (Lesson 28). When the theme updates while props remain unchanged, the component still re-renders. This often leads developers to suspect a defect in `PureComponent`.

The behavior is completely intentional. React documentation clarifies that a component still re-renders whenever a consumed context changes. The shallow comparison covers only props and local state, whereas context acts as an independent communication channel.

---

## PRINCIPLE | An arrow written in `render`: a new function every time, so `PureComponent` never skips

> [!PRINCIPLE]
> **Principle 3: An Arrow Written in `render` Is a New Function Every Time**
>
> *An arrow function, an object, or an array written inside the parent's `render` is a new reference on every render, so `PureComponent` sees a changed prop every time and never skips.*
>
> `PureComponent` compares a function by reference, not by what it does. An arrow written in `render` is created again on every render of the parent, so the list renders after every keystroke, as if it were a plain `Component`. A class field such as `removeTask` is created once and reaches the list unchanged.
>
> **DO THIS:**
> ```jsx
> <TaskList tasks={this.state.tasks} ~onRemove={this.removeTask}~ /> {/* Created once with the instance: the list skips */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <TaskList tasks={this.state.tasks} ~onRemove={(task) => this.removeTask(task)}~ /> {/* **WRONG:** a new function on every render, so the list never skips */}
> ```

### VS | `onRemove={this.removeTask}` vs. an Arrow Written in `render`: the same function, or a new one each time

The parent component can pass the callback handler in two contrasting ways:

```jsx title="Passing the class field vs. passing an arrow written in render"
<TaskList tasks={this.state.tasks} ~onRemove={this.removeTask}~ /> {/* The same function on every render */}
<TaskList tasks={this.state.tasks} ~onRemove={(task) => this.removeTask(task)}~ /> {/* A new function on every render */}
```

Both declarations invoke the identical `removeTask` method when the user triggers a removal. **Although their functionality appears identical, their memory characteristics are completely different.**
- **With `onRemove={this.removeTask}`, the child receives a stable function reference.** Because `removeTask` is declared as a class field, JavaScript allocates it once during instance instantiation (Lesson 96). Subsequent renders read that identical memory reference.
- **With an arrow written in `render`, JavaScript allocates a new function object on every pass.** Even though the underlying logic never changes, the function occupies a brand-new memory address on every render.

Recall the comparison `['Buy milk'] === ['Buy milk']`. Two separate function instances with identical instructions evaluate to false under strict equality. `PureComponent` evaluates reference equality, not executable logic.

### The `PureComponent` List Renders on Every Keystroke

Passing an inline function to a `PureComponent` completely disables render skipping. Suppose the parent passes an inline arrow:

```jsx title="src/TodoApp.jsx" startLine="19" bad="7"
  render() {
    return (
      <section>
        <h1>My tasks</h1>
        <label>New task <input value={this.state.text} onChange={this.handleChange} /></label>
        <button onClick={this.handleAdd}>Add</button>
        <TaskList tasks={this.state.tasks} ~onRemove={(task) => this.removeTask(task)}~ /> {/* **WRONG:** a new onRemove after every keystroke */}
      </section>
    );
  }
```

Here is the execution sequence when the user types a character:
1. The user types `P` into the input field.
2. The parent component re-renders, creating a fresh arrow function instance in `render`.
3. `PureComponent` compares the incoming `onRemove` prop against the previous reference, detecting a mismatch.
4. `TaskList` re-renders immediately, even though its underlying data remained identical.

```page width=text caption="With an arrow written in the parent's render, the PureComponent list still renders after each of the three keystrokes in Pay."
heading: My tasks
form:
  field: New task | Pay
  button: Add
line: Buy milk [Remove]
line: Call John [Remove]
log: TaskList rendered | TaskList.jsx:5
log: TaskList rendered | TaskList.jsx:5
log: TaskList rendered | TaskList.jsx:5
log: TaskList rendered | TaskList.jsx:5
```

Developers observing this output often conclude that `PureComponent` failed to operate. In reality, it operated accurately by detecting a changed reference. React documentation highlights this trap with `memo`: memoization becomes useless when passed props change on every pass, such as objects or functions created during render. A single unstable prop breaks the skip for the entire component.

### Where `task` Comes From

In the expression `(task) => this.removeTask(task)`, the child component provides `task` in three steps:
1. The user clicks Remove next to the item `Call John`.
2. The button click handler in `TaskList` invokes `this.props.onRemove(task)` with that task value.
3. The arrow function receives `Call John` and forwards it to `this.removeTask`.

### The Same Rule for an Array or an Object

Arrays and objects declared inside `render` encounter the exact same reference instability:

```jsx title="Passing the array in state vs. a copy made in render"
<TaskList ~tasks={this.state.tasks}~ onRemove={this.removeTask} /> {/* The same array until the tasks change */}
<TaskList ~tasks={[...this.state.tasks]}~ onRemove={this.removeTask} /> {/* A new array on every render */}
```

Both declarations provide identical items to the child list. However, spreading into a new array literal creates a distinct memory reference during each render. `PureComponent` sees a changed `tasks` prop after every keystroke and re-renders.

Notice that the inline arrow on the Remove button inside `TaskList` represents a different case. A standard `<button>` is not a `PureComponent`, so allocating an arrow there causes no skipped render to break. The pitfall occurs strictly when passing new references into components that optimize via shallow equality.

In class components, the standard solution was to pass methods bound once during construction, or declared as arrow class fields. Data structures were stored in state rather than constructed inline in `render`. We revert our code to `onRemove={this.removeTask}`.

---

## PRINCIPLE | `push` on the array in state: the very same array, so `PureComponent` hides the new task

> [!PRINCIPLE]
> **Principle 4: `push` Keeps the Same Array, So the New Task Is Missing**
>
> *When a handler changes the array in state with `push` and passes the same array to `this.setState`, `PureComponent` finds the same reference and skips, so the new task does not appear when the user clicks Add; a new array fixes it.*
>
> `PureComponent` compares the array by reference. An old array with a new item inside is still the same array, so React skips the list, and the user does not see the task they added. The task appears later, at the next change that builds a new array. A new array, such as one built with three dots, shows the change at once.
>
> **DO THIS:**
> ```jsx
> handleAdd = () => {
>   this.setState({ tasks: ~[...this.state.tasks, this.state.text]~, text: '' }); // A new array: the list renders
> };
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> handleAdd = () => {
>   ~this.state.tasks.push(this.state.text)~; // **WRONG:** the same array, so PureComponent skips and the task is missing
>   this.setState({ tasks: this.state.tasks, text: '' });
> };
> ```

### VS | `push` vs. a New Array: the same array with one more item, or a different array

The event handler can append user input to the list array in two ways:

```jsx title="Adding a task with push vs. with a new array"
~this.state.tasks.push(this.state.text)~; // Puts the task inside the array that state already holds
this.setState({ tasks: this.state.tasks, text: '' });

this.setState({ tasks: ~[...this.state.tasks, this.state.text]~, text: '' }); // Hands over a brand-new array
```

Both implementations leave the array containing the new task. Developers often view them as equivalent ways of updating data. **Although the resulting contents match, their memory behavior is fundamentally opposite.**
- **The `push` method mutates the existing array in place.** The reference remains unchanged, meaning `tasks === tasks` evaluates to true.
- **The spread operator constructs a brand-new array.** The new array occupies a fresh memory address, producing a different reference.

Because `PureComponent` tests memory references rather than contents, this distinction determines whether the UI updates.

Mutating state directly with `push` violates core React principles (Lesson 17). Under a regular `Component`, the child re-renders regardless, masking the mutation bug. Under `PureComponent`, that hidden bug surfaces directly on screen.

### The User Clicks Add, and the Task Is Missing

Direct mutation causes user actions to silently fail. Suppose the parent handler uses `push`, while the list extends `PureComponent`:

```jsx title="src/TodoApp.jsx" startLine="11" bad="2,3"
  handleAdd = () => {
    ~this.state.tasks.push(this.state.text)~; // **WRONG:** changes the array that state already holds
    this.setState({ ~tasks: this.state.tasks~, text: '' }); // **WRONG:** tasks is the same array as before
  };
```

Here is the exact runtime sequence when the user enters `Pay rent` and clicks Add:
1. The `handleAdd` method pushes the string into the existing array referenced by `this.state.tasks`.
2. The `this.setState` method updates text to an empty string, passing back the mutated array reference.
3. The parent component re-renders because it extends standard `Component`, clearing the input field.
4. `PureComponent` evaluates incoming props. The `tasks` array shares the identical reference, and the callback remains unchanged.
5. React skips rendering `TaskList`. The UI continues displaying only two tasks, even though the array contains three.

```page width=text caption="With push, after the user clicks Add, the field is empty and the list still shows two tasks."
heading: My tasks
form:
  field: New task
  button: Add
line: Buy milk [Remove]
line: Call John [Remove]
log: TaskList rendered | TaskList.jsx:5
```

The screen displays outdated data. The console emits no errors, leaving developers with zero diagnostic clues.

A confusing side effect occurs when the user subsequently removes an item, such as `Call John`:
1. The `removeTask` handler uses `filter` to generate a new array containing the remaining items.
2. `PureComponent` detects a fresh array reference, prompting React to render the list.
3. The newly added task suddenly appears at the exact moment an older task is removed.

```page width=text caption="The user clicks Remove next to Call John: Call John disappears, and Pay rent suddenly appears."
heading: My tasks
form:
  field: New task
  button: Add
line: Buy milk [Remove]
line: Pay rent [Remove]
log: TaskList rendered | TaskList.jsx:5
log: TaskList rendered | TaskList.jsx:5
```

### How This Bug Reaches a Real Team

This defect frequently remains undetected in real projects for extended periods:
1. A legacy class handler mutates state via `this.state.tasks.push` and invokes `this.setState`.
2. Under `Component`, the child re-renders on every parent update, masking the mutation bug.
3. Later, an engineer converts the child to `PureComponent` to optimize input typing speed.
4. Adding new items fails immediately, misleading the team into assuming `PureComponent` is defective.

The underlying bug was the array mutation. React documentation explains why immutability enables optimization: React performance strategies rely on skipping work when props or state remain unchanged. Avoiding direct mutation makes change detection instantaneous.

### The Fix: a New Array

Pass a new array instance constructed with the spread operator (Lesson 19):

```jsx title="src/TodoApp.jsx" startLine="11" good="2"
  handleAdd = () => {
    this.setState({ tasks: ~[...this.state.tasks, this.state.text]~, text: '' }); // A new array: the list shows Pay rent
  };
```

The `tasks` prop now receives a fresh array reference. `PureComponent` detects the modification, and the list updates immediately when Add is clicked.

Keep in mind that shallow copies duplicate only the outer array structure (Lesson 19). Inner objects retain their original references. If array elements were objects, mutating an individual object in place would still bypass shallow comparison in child components rendering that item.

---

## PRINCIPLE | `memo`: it takes over from `PureComponent`, and compares props only

> [!PRINCIPLE]
> **Principle 5: `memo` Takes Over From `PureComponent`**
>
> *When a `PureComponent` class becomes a function, wrap the function in `memo`; `memo` compares props only, because a function component already skips a render when its state is set to the same value.*
>
> For props, `memo` does exactly what `PureComponent` did: it compares each prop with its old value and skips when all are the same. It does not compare state, because a function component already skips when its `set` function receives the same value. Its custom comparison returns `true` to skip, the opposite of `shouldComponentUpdate`.
>
> **DO THIS:**
> ```jsx
> const TaskList = ~memo~(function TaskList({ tasks, onRemove }) { // The skip carries over from PureComponent
>   return <ul>{tasks.map(task => <li key={task}>{task}</li>)}</ul>;
> });
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ~TaskList~({ tasks, onRemove }) { // **WRONG:** PureComponent dropped without memo, so the list renders after every keystroke
>   return <ul>{tasks.map(task => <li key={task}>{task}</li>)}</ul>;
> }
> ```

### VS | `extends PureComponent` vs. `memo`: the same check for props

In modern React, the list is written as a function component. To preserve render skipping, wrap the function in `memo` (Lesson 55):

```jsx title="The class with PureComponent and the function with memo"
class TaskList extends ~PureComponent~ { // Compares every prop and every state field
  render() {
    return <ul>{this.props.tasks.map(task => <li key={task}>{task}</li>)}</ul>;
  }
}

const TaskList = ~memo~(function TaskList({ tasks, onRemove }) { // Compares every prop
  return <ul>{tasks.map(task => <li key={task}>{task}</li>)}</ul>;
});
```

For incoming props, both approaches perform the exact same shallow equality check. Both evaluate each prop against its previous value, skipping when all references match. React migration guidelines specify wrapping converted class components in `memo`. Official documentation notes that optimizing classes with `shouldComponentUpdate` corresponds directly to optimizing function components with `memo`.

Props arrive as a single object passed to the function component (Lesson 8). Destructuring `{ tasks, onRemove }` replaces reading properties from `this.props`.

The `memo` helper is imported from `react` and operates in three clear steps:
1. The `memo` higher-order component accepts your function component.
2. It returns a memoized wrapper without modifying the original implementation.
3. The exported identifier now references this optimized component.

### For State, `memo` and `PureComponent` Are NOT the Same Thing

Unlike `PureComponent`, the `memo` wrapper evaluates only incoming props. React documentation states that `memo` never compares old and new state. In function components, calling a state setter with an unchanged value already bails out by default, even without `memo`.

Function components manage local state optimization internally. When a setter receives an unchanged primitive or reference, React halts rendering automatically. The `memo` wrapper is required solely to evaluate props passed down from parents.

### VS | `shouldComponentUpdate` vs. `arePropsEqual`: they look alike and answer opposite questions

The `memo` wrapper accepts an optional second argument: a custom comparison function known as `arePropsEqual` (Lesson 55). While it resembles `shouldComponentUpdate`, it answers the exact inverse question:

```jsx title="The same two props compared in shouldComponentUpdate and in arePropsEqual"
~shouldComponentUpdate~(nextProps) { // Returns true to render again
  return nextProps.tasks !== this.props.tasks || nextProps.onRemove !== this.props.onRemove;
}

function ~arePropsEqual~(oldProps, newProps) { // Returns true to skip
  return oldProps.tasks === newProps.tasks && oldProps.onRemove === newProps.onRemove;
}
```

Although they look similar, their return values represent opposite boolean outcomes:
- **`shouldComponentUpdate` asks whether the component should update.** Returning `false` skips the render.
- **`arePropsEqual` asks whether incoming props match previous props.** Returning `true` skips the render.

Copying the logic of `shouldComponentUpdate` directly into `arePropsEqual` without inverting operators causes inverted rendering behavior. The component updates when it should skip, and skips when it should update, completely breaking the interface.

Custom comparison functions must verify every prop, including callback handlers. React documentation warns that omitting a function prop causes components to invoke stale handlers from earlier renders, capturing outdated state and props.

```tree caption="shouldComponentUpdate and the custom comparison of memo answer opposite questions."
Two methods that look alike and answer opposite questions
- +`shouldComponentUpdate` | Asks **should I render again?** | Returns **`false` to skip**
- +`arePropsEqual` in `memo` | Asks **are the old and new props equal?** | Returns **`true` to skip**
```

### The List as a `memo` Component

Here is the child component migrated to modern function syntax:

```jsx title="src/TaskList.jsx"
import { memo } from 'react';

const TaskList = ~memo~(function TaskList({ tasks, onRemove }) { // React compares tasks and onRemove before each render
  console.log('TaskList rendered');
  return (
    <ul>
      {tasks.map(task => (
        <li key={task}>
          {task} <button onClick={() => onRemove(task)}>Remove</button>
        </li>
      ))}
    </ul>
  );
});

export default TaskList;
```

A frequent migration error is dropping `PureComponent` while omitting `memo`. Without memoization, the list re-renders on every keystroke, introducing input lag. The `memo` wrapper preserves the skipped rendering behavior established in the legacy class.

Like previous class optimizations, `memo` serves strictly as a performance enhancement. React documentation cautions that if an application breaks without `memo`, the underlying state management requires correction. When React Compiler is active, manual `memo` calls are rarely necessary because the compiler applies equivalent memoization automatically (Lesson 63).

Converting the parent component to a function with `useState` introduces a subtle prop instability. The next principle demonstrates why.

---

## PRINCIPLE | `useCallback`: `removeTask` stays the same function, so `memo` can skip again

> [!PRINCIPLE]
> **Principle 6: `useCallback` Keeps `removeTask` the Same After the Migration**
>
> *A function written inside a function component is created again on every render, unlike a class field arrow, so passing it to a `memo` component breaks the skip; `useCallback` keeps the same function, and `useMemo` keeps the same object or array.*
>
> A class instance lives across renders, so its class field `removeTask` stayed the same function. A function component runs again on every render, so a plain `removeTask` inside it is new every time, and `memo` sees a changed `onRemove` after every keystroke. `useCallback` gives back the same function, and an updater function lets it work with no dependencies.
>
> **DO THIS:**
> ```jsx
> const removeTask = ~useCallback~((task) => { // The same function on every render: memo skips
>   setTasks(tasks => tasks.filter(t => t !== task));
> }, []);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ~removeTask~(task) { // **WRONG:** a new function on every render, so the memo list renders after every keystroke
>   setTasks(tasks.filter(t => t !== task));
> }
> ```

### VS | The Class Field `removeTask` vs. `function removeTask` Inside `TodoApp`: created once, or created on every render

Converting `TodoApp` directly to a function component transforms the class field into an inline function declaration:

```jsx title="removeTask in the class and removeTask in the function component"
class TodoApp extends Component {
  ~removeTask~ = (task) => { // Created once, when React creates the instance
    this.setState({ tasks: this.state.tasks.filter(t => t !== task) });
  };
}

function TodoApp() {
  function ~removeTask~(task) { // Created again every time TodoApp renders
    setTasks(tasks.filter(t => t !== task));
  }
}
```

Both declarations perform the same task deletion. **While their runtime logic matches, their lifecycle lifetimes differ completely.**
- **In a class component, the instance persists across render passes.** Its arrow class field is instantiated once during construction, preserving a stable function reference across every render.
- **In a function component, the entire body executes on each render pass.** Every function declared inside the component body is allocated as a brand-new function instance in memory.

### The `memo` List Renders on Every Keystroke

Migrating to function components without caching callbacks breaks memoization completely. Here is the migrated parent component:

```jsx title="src/TodoApp.jsx" bad="13,14,15"
import { useState } from 'react';
import TaskList from './TaskList.jsx';

export default function TodoApp() {
  const [tasks, setTasks] = useState(['Buy milk', 'Call John']);
  const [text, setText] = useState('');

  function handleAdd() {
    setTasks([...tasks, text]);
    setText('');
  }

  function ~removeTask~(task) { // **WRONG:** a new function on every render of TodoApp
    setTasks(tasks.filter(t => t !== task));
  }

  return (
    <section>
      <h1>My tasks</h1>
      <label>New task <input value={text} onChange={e => setText(e.target.value)} /></label>
      <button onClick={handleAdd}>Add</button>
      <TaskList tasks={tasks} ~onRemove={removeTask}~ /> {/* memo sees a different onRemove every time */}
    </section>
  );
}
```

Here is what occurs when the user types a character into the input field:
1. The user types `P` into the input.
2. Calling `setText` triggers a re-render of the parent, allocating a fresh instance of `removeTask`.
3. The `memo` wrapper compares the incoming `onRemove` prop against the previous reference, detecting a new function.
4. `TaskList` re-renders after every single keystroke, exactly like Principle 3, even though the JSX contains no inline arrow.

```page width=text caption="After the migration, the user types Pay, and the memo list still renders after each of the three keystrokes."
heading: My tasks
form:
  field: New task | Pay
  button: Add
line: Buy milk [Remove]
line: Call John [Remove]
log: TaskList rendered | TaskList.jsx:4
log: TaskList rendered | TaskList.jsx:4
log: TaskList rendered | TaskList.jsx:4
log: TaskList rendered | TaskList.jsx:4
```

The legacy class code avoided this issue automatically because class fields persist on the instance. Function components require deliberate caching. React documentation advises that when passing functions to memoized components, you must either declare them outside the component or cache them with `useCallback`.

### The Fix: `useCallback` Keeps the Same `removeTask`

Wrap `removeTask` in `useCallback` (Lesson 57), importing the hook from React:

```jsx title="src/TodoApp.jsx" startLine="13" good="1,2,3"
  const removeTask = ~useCallback~((task) => { // The same function on every render
    setTasks(tasks => tasks.filter(t => t !== task));
  }, ~[]~); // No dependencies: the function never needs to change
```

Notice the parameter `tasks` inside the updater function `setTasks(tasks => ...)`. This parameter does not read the component state variable. It represents the pending state value provided directly by React at execution time (Lesson 16):
1. React invokes the updater callback with current pending state.
2. The `filter` method produces a new array excluding the targeted task.
3. Because the updater retrieves state directly from React, `removeTask` references zero external reactive variables. Its dependency array remains empty, guaranteeing a permanently stable function reference across every render.

With `useCallback`, `TaskList` receives the identical callback reference on every render. To `memo`, this provides the exact same stability as the legacy class field. Both incoming props remain strictly equal, skipping the list during typing. The console logs `TaskList rendered` once on mount, and again only when the task array changes.

The `handleAdd` function requires no `useCallback` wrapper. It is passed to a standard `<button>`, which never checks props for render skipping.

### `useMemo` Does the Same for an Object or an Array

The same pitfall threatens array or object transformations computed during rendering. Suppose the list requires displaying tasks in sorted alphabetical order:

```jsx title="A sorted array built on every render vs. kept with useMemo" bad="1" good="2"
const sortedTasks = ~[...tasks].sort()~; // **WRONG:** a new array on every render, so memo never skips
const sortedTasks = ~useMemo~(() => [...tasks].sort(), [tasks]); // The same array until tasks changes
```

The `useMemo` hook performs the caching role of `useCallback` for non-function values (Lesson 56). It preserves the identical sorted array reference until `tasks` changes. React documentation notes that function components provide granular caching with `useMemo`. While `shouldComponentUpdate` evaluates the whole component at once, `useMemo` can isolate and cache individual expensive computations.

Here is how each legacy class optimization maps to modern function patterns:

| In the class | In the function component | What it keeps the same |
| :--- | :--- | :--- |
| `extends PureComponent` | `memo` around the function | Skips when every prop is the same |
| A class field arrow, or a method bound once in the constructor | `useCallback` | The same function on every render |
| An object or array kept in state or on the instance | `useMemo` | The same object or array until its dependencies change |

React Compiler automates these optimizations by analyzing code structure and memoizing values and functions automatically, eliminating the need for manual `useMemo` and `useCallback` declarations (Lesson 63).

---

## All 6 Principles Together

### The Complete Files

Here is the complete to-do application following migration. The list component is wrapped in `memo`. The parent generates a new array reference only when items are added or removed, while `useCallback` maintains callback stability:

```jsx title="src/TodoApp.jsx"
import { useState, useCallback } from 'react';
import TaskList from './TaskList.jsx';

export default function TodoApp() {
  const [tasks, setTasks] = useState(['Buy milk', 'Call John']);
  const [text, setText] = useState('');

  function handleAdd() {
    setTasks(~[...tasks, text]~); // Principle 4: a new array, so memo sees the change
    setText('');
  }

  const removeTask = ~useCallback~((task) => { // Principle 6: the same function on every render
    setTasks(tasks => tasks.filter(t => t !== task));
  }, []);

  return (
    <section>
      <h1>My tasks</h1>
      <label>New task <input value={text} onChange={e => setText(e.target.value)} /></label>
      <button onClick={handleAdd}>Add</button>
      <TaskList tasks={tasks} ~onRemove={removeTask}~ /> {/* Principle 3: no arrow written here */}
    </section>
  );
}
```

```jsx title="src/TaskList.jsx"
import { memo } from 'react';

const TaskList = ~memo~(function TaskList({ tasks, onRemove }) { // Principles 1, 2 and 5: skips when tasks and onRemove are the same
  console.log('TaskList rendered');
  return (
    <ul>
      {tasks.map(task => (
        <li key={task}>
          {task} <button onClick={() => onRemove(task)}>Remove</button>
        </li>
      ))}
    </ul>
  );
});

export default TaskList;
```

The user types `Pay rent` and clicks Add. The Console shows two lines: one from the first render, and one after Add. The eight keystrokes print nothing:

```page width=text caption="The finished to-do list after the user types Pay rent and clicks Add: three tasks, and two renders of the list."
heading: My tasks
form:
  field: New task
  button: Add
line: Buy milk [Remove]
line: Call John [Remove]
line: Pay rent [Remove] | good
log: TaskList rendered | TaskList.jsx:4
log: TaskList rendered | TaskList.jsx:4
```

### How React Decides Whether to Render the List

During each parent render pass, React reaches the `<TaskList />` element and evaluates incoming props against previous props before deciding whether to invoke the component:

```tree dir=right caption="What React does at the TaskList tag on every render of TodoApp, after a keystroke and after Add."
React renders `TodoApp`, then reaches `<TaskList />`
- +1. `TodoApp` renders | A keystroke changes `text`, or Add changes `tasks` | Returns the field, the Add button, and `<TaskList />`
- +2. `memo` compares the props | `tasks` and `onRemove` against the old ones | **Same** after a keystroke; **different `tasks`** after Add
- +3. `TaskList` renders or is skipped | After a keystroke: **skipped**, the rows stay | After Add: **renders**, the new task appears
```

| Principle | Class code | Function code today | What breaks the skip |
| :--- | :--- | :--- | :--- |
| **1. `shouldComponentUpdate`** | Compare props by hand; return `false` to skip | No method: `memo` compares every prop for us | A prop the comparison forgets stays frozen on the screen |
| **2. `PureComponent`** | `extends PureComponent` compares every prop and state field | `memo` compares every prop | A context the component reads still renders it |
| **3. New every render** | An arrow, object, or array written in `render` | A function, object, or array written in the component body | The comparison finds a different reference every time |
| **4. `push`** | `push` into the array in state | `push` into the array in state | The same reference hides the new item |
| **5. `memo`** | `PureComponent` compares state too; `shouldComponentUpdate` returns `false` to skip | `memo` ignores state; `arePropsEqual` returns `true` to skip | Dropping `memo` during the migration, or copying the comparison without flipping it |
| **6. `useCallback`** | A class field arrow, created once | `useCallback` for functions, `useMemo` for objects and arrays | A plain function written inside the component |

Remember the primary rule of this lesson. **Before rendering an optimized component, React asks one question about each incoming prop: does it match the exact reference or primitive value from the previous render? A newly constructed function or array always answers no, while an array mutated with `push` always answers yes.**

---

## For the Interview

> **The Interview Question:** How did PureComponent and shouldComponentUpdate prevent re-renders, and what replaced them?

### How to Answer Clearly in 30 Seconds

"When a parent re-renders, React re-renders its child components by default. In legacy class components, children could opt out of redundant renders in two ways:
1. **`shouldComponentUpdate`** is a lifecycle method invoked before rendering. Returning `false` instructs React to skip calling `render`.
2. **`PureComponent`** is a base class that implements a shallow equality comparison across all props and state fields automatically.

Shallow equality compares primitives by value and reference types by memory address. This optimization fails under two classic scenarios:
1. **Unstable references during render:** Defining inline arrow functions, objects, or arrays in the parent's `render` method creates fresh references on every pass, bypassing the skip.
2. **Direct mutation:** Mutating an array with `push` retains the same memory address, causing the component to skip when it should display new data.

In modern React, the `memo` higher-order component replaces `PureComponent` for function components. It compares props only, while hooks like `useCallback` and `useMemo` preserve reference stability across renders. React Compiler can also apply these optimizations automatically."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Is `memo` exactly the same as `PureComponent`?"**
   For props, yes: both perform shallow equality comparisons against previous values and skip rendering when all props match. For state, no. `PureComponent` shallowly compares state fields, whereas `memo` ignores local state because function components already bail out automatically when state setters receive unchanged values. Additionally, a custom comparison in `memo` answers the inverse question of `shouldComponentUpdate`: `arePropsEqual` returns `true` to skip rendering, while `shouldComponentUpdate` returns `false` to skip.

2. **"The user adds a task, the input field empties, but the list never displays the new item. The list extends `PureComponent`. Why?"**
   The event handler mutated the state array directly using `push` before passing it to `this.setState`. `PureComponent` compares incoming props by reference. Because `push` mutates the array in place, previous and next props point to the identical memory address. `PureComponent` concludes no data changed and skips rendering. The fix is immutability: pass a newly allocated array using the spread operator, such as `[...this.state.tasks, this.state.text]`.

3. **"We migrated a `PureComponent` list to a function component wrapped in `memo`, but it still re-renders on every keystroke. Why?"**
   A prop passed from the parent is receiving a new memory reference on every render pass. In class components, methods declared as class field arrows are instantiated once on the instance. In function components, functions declared in the component body are recreated on every execution. To restore memoization, wrap callback props in `useCallback` and complex object or array props in `useMemo`. Keep in mind that memoization is an optimization hint: React may still render if internal scheduling requires it.
