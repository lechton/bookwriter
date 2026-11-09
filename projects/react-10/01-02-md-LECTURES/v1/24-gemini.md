# Lecture 24: How Two Sibling Components Share One Changing Value
> INTERVIEW QUESTION | ❱ CORE | How do two sibling components share one changing value?

---

## The Wall Between Siblings: Why Local State Cannot Flow Sideways

### Two clocks drift apart; one clock in the hall governs the house

Picture a name badge maker on an event registration desk. At the top sits an input box where a guest types their first name. Directly below it sits a large printed badge displaying: Hello, my name is John.

The input box and the preview badge are split into two separate components: `<NameBox />` and `<BadgePreview />`. Both sit inside the same parent `<App />`. That makes them **sibling components**.

When the guest types John into the box, how does the badge know what was typed?

In plain JavaScript, developers often attempt to reach across the screen: querying the input element, writing to a global variable, or firing custom DOM events. In React, **components cannot communicate horizontally**. A sibling component cannot look sideways across the UI tree, read another sibling's local variables, or trigger another sibling's render.

To share a changing value between siblings, you face a fundamental choice between two architectures:
- **Choice A: A state variable inside each sibling.** Each sibling runs its own `useState` hook. Like two clocks in separate bedrooms, they start at the same time on Monday morning. But by Friday, one is fast, one is slow, and neither agrees with the other. On screen, the box holds John while the badge remains completely blank.
- **Choice B: One state variable in their closest common parent.** State is lifted out of the children and declared once in the parent above both. The parent passes the value down to both siblings as a prop, and passes a callback function down to the sibling that modifies it. Because both siblings read from the exact same state cell, they update in lockstep and can never disagree.

```tree caption="Where the useState line for the shared value sits: duplicate local states versus one shared state in their closest common parent."
Where the `useState` line for the shared name sits
- !Inside each sibling [`useState` in NameBox and BadgePreview] | Like **a clock in every room** | Two independent memory cells **drift out of sync** on the first keystroke
- +In the common parent above both [`useState` in App] | Like **one clock in the hall** | A **single source of truth** renders both siblings with the exact same value
```

The two ways may look the same, or work the same at first, **but they are NOT the same thing!** With a `useState` line inside each sibling, the page looks right when it opens: both copies of the name are empty, so the box and the badge agree. Then the user types the first letter, and only the copy inside the box changes. From then on, the two copies disagree, like two clocks drifting apart.

So here is the key idea of this lesson: a sibling cannot reach into another sibling. A value that two siblings need lives in the closest component above both of them. That parent passes the value down to both siblings as a prop, and it passes a function down to the sibling that changes the value.

### What is at stake: a split-brain user interface

What is at stake is a split-brain user interface where parts of the same screen contradict each other. The user types `John` into the box, and the large badge below it stays blank, or it keeps showing a name from before.

When developers encounter two components that need the same data, they commonly make two fatal mistakes:
1. **They attempt horizontal data sharing.** They read undeclared variables across files, crashing the application with an unhandled `ReferenceError`, or mutate plain `window` globals, which changes browser memory but completely fails to trigger a React render.
2. **They duplicate state across siblings.** They declare `useState('')` in both components, hoping to keep them synchronized. The moment the user types a single character, the component with the active listener re-renders while the other sibling remains permanently frozen on its initial state.

To build reliable interfaces, you must master the three-step discipline React calls **lifting state up**:
1. **Remove** local state from the child components.
2. **Lift** the state variable to their closest common parent in the UI tree.
3. **Pass** the state down as a value prop to all siblings that display it, and pass an event handler down as a callback prop to the sibling that updates it.

### Four ways to share one changing value

When two components need the same changing value, developers choose among four ways:
1. **Move the state up into the closest common parent**, the first component above both siblings, and pass the value and a callback prop down. React's docs call this lifting state up. It is the usual way, and the way this lesson teaches.
2. **Put the state in a component above the closest common parent, or in a new component written only to hold it**, when the closest common parent is not a sensible owner. React's docs give both options on their *Thinking in React* page.
3. **Put the value in context**, when the common parent is far above the components that need it and every layer between them would pass along a prop it never uses (as seen in Lessons 28 and 29).
4. **Keep a copy in each sibling and copy one into the other with an Effect.** This is not a good way, and it is named here only so you recognize it. React's docs say: "Whenever you try to keep two different state variables synchronized, try lifting state up instead!" (as seen in Lesson 34).

### A name badge maker where the box and the badge live in different components

To see this on a real page, we build a name badge maker. It shows a heading, a box labelled `First name`, and below it a badge that reads `Hello, my name is` with the typed name in large letters. From Principle 4 on, it also has a `Start over` button. Here is the finished page after the user types `John`:

```page width=text caption="The finished name badge maker after the user types John into the First name box."
heading: Make a Name Badge
form:
  field: First name | John
line: Hello, my name is
section: John
line: [Start over]
console: quiet
```

The box lives in one component, `NameBox`, and the badge lives in another, `BadgePreview`. `App` places both of them, so they are siblings. The badge cannot see what the user types into the box. This lesson is about how the badge still shows the name.

### How our project files are organized

The page uses only tools from earlier lessons: `useState`, a controlled input with a label (as seen in Lesson 20), and a callback prop (as seen in Lesson 23). The entry file mounts `App` inside `<StrictMode>`. `App` renders the heading and places the two siblings, and each sibling has its own file in `src/components/`:

```files title="name-badge: File Explorer" caption="How the files of our name badge maker sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default, imports `NameBox` and `BadgePreview`, and from Principle 3 on holds `firstName` in state
  components/
    NameBox.jsx | default export | Shows the First name box
    BadgePreview.jsx | default export | Shows the badge with Hello, my name is and the name
```

### Four Principles of Lifting State Up

**PRINCIPLES:** Two siblings cannot read each other's state, but they can both read a value from their parent. Four practical principles follow from that:
1. **Principle 1: Isolated State: Siblings Share No Memory or Variables**: State is private to the component that declares it. A second `useState` in the other sibling makes a second, separate state, and the two stop matching after the user's first keystroke.
2. **Principle 2: Lifting State Up: The Closest Common Parent Owns the Shared Value**: Remove the state from the child, find the closest common parent of every component that shows the value, and let that parent pass the value down to each of them as a prop.
3. **Principle 3: Inverse Data Flow: The Parent Passes Down State as Value and Setters as Callbacks**: The parent declares the state and passes a function down to the sibling that changes it. One keystroke by the user renders the parent again, and both siblings get the same new name in the same render pass.
4. **Principle 4: Controlled Components: A Component Driven by Props Can Be Reset from Above**: A component driven by props is controlled by its parent, so the parent can clear it from anywhere. Copying the prop into the child's own state breaks that.

Here is the complete map of those four principles before we walk through each one:

| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |
| :--- | :--- | :--- | :--- |
| **Principle 1** | **Isolated State: Siblings Share No Memory or Variables** | Reading the box's state in the badge blanks the whole page with a `ReferenceError`, and giving the badge its own `useState` leaves it empty while the box shows `John`. | State is private to the component that declares it. A sibling sees only its own variables and the props written on its tag. |
| **Principle 2** | **Lifting State Up: The Closest Common Parent Owns the Shared Value** | Interviewers ask where shared state should live. The tree decides it, not the component where the user types. | Remove the state from the child and declare it in the closest common parent, which passes the value down as a prop. |
| **Principle 3** | **Inverse Data Flow: The Parent Passes Down State as Value and Setters as Callbacks** | Passing the value down without a function leaves the box frozen with the read-only field error. Interviewers also ask how both siblings stay equal. | The parent passes the value to every sibling that shows it and a callback prop to the sibling that changes it. One change renders both siblings with the same value. |
| **Principle 4** | **Controlled Components: A Component Driven by Props Can Be Reset from Above** | Copying the lifted prop into the child's state works while the user types, then leaves the old name in the box after a reset. Interviewers ask what controlled and uncontrolled components are. | A component driven by props is controlled by its parent. The child uses the prop directly and never copies it into its own state. |

---

## 1. Principle 1: Isolated State: Siblings Share No Memory or Variables

### Visual Proximity on Screen Does Not Grant Memory Access

Here is the smallest page with two siblings. `Parent` places two children: `Counter`, a button that counts its clicks, and `Display`, a line that should show the same number:

```jsx title="src/Parent.jsx"
import { useState } from 'react';

export default function Parent() {
  return (
    <>
      ~<Counter />~ {/* Counter and Display are siblings: Parent places both */}
      <Display />
    </>
  );
}

function Counter() {
  const [count, setCount] = ~useState(0)~; // count is created here, inside Counter
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
}

function Display() {
  return <p>Count: ~{count}~</p>; // **WRONG:** Display has no name count
}
```

When the page opens, the screen crashes completely to a blank white page. `Display` sits right next to `Counter` on the page, but visual adjacency in JSX does not bridge JavaScript function boundaries. A child cannot reach the state of its parent (as seen in Lesson 23), and siblings are no different: a name created inside one function cannot be seen inside another function (as seen in Lesson 06). JavaScript throws an unhandled `ReferenceError` while React renders `Display`, and an error during rendering makes React unmount the entire page.

So the developer gives `Display` its own state, with the same line that `Counter` has:

```jsx title="src/Parent.jsx" startLine="17"
function Display() {
  const [count, setCount] = ~useState(0)~; // **WRONG:** a second count, separate from the count in Counter
  return <p>Count: {count}</p>;
}
```

When the page opens, both siblings show `0`:

```page width=text caption="The two siblings when the page opens, each with its own count: both show 0."
line: [Clicked 0 times]
line: Count: 0
console: quiet
```

Then the user clicks the button three times:

```page width=text caption="The same page after the user clicks the button three times: the button says 3, and the line still says 0."
line: [Clicked 3 times] | good
line: Count: 0 | bad
console: quiet
```

Two identical `useState` calls in separate components allocate two isolated memory cells in React's component tree. The two `useState` lines look the same, and when the page opens they work the same, **but they are NOT the same thing!** Each call to `useState` gives its own component its own private state (as seen in Lesson 12). Every click by the user changes the `count` inside `Counter`, and React renders `Counter` again. Nothing changes the `count` inside `Display`, so the line keeps showing `0`.

```tree caption="Two count variables with the same name in two sibling components: only the one in Counter changes."
Two `count` variables with the same name
- +`count` in `Counter` [`useState` in `Counter`] | Changed by **every click** | The button says **3**
- !`count` in `Display` [`useState` in `Display`] | A **second, separate** state | Nothing changes it, so the line stays on **0**
```

Being siblings gives `Counter` and `Display` zero shared scope. Each one sees only its own variables and the props that `Parent` writes on its tag. Here, `Parent` writes no props at all.

### The badge maker with firstName inside NameBox

Now we start our badge maker. The box file keeps the typed name in its own state, with a controlled input (as seen in Lesson 20):

```jsx title="src/components/NameBox.jsx"
import { useState } from 'react';

export default function NameBox() {
  const [firstName, setFirstName] = ~useState('')~; // firstName is created here, inside NameBox
  return (
    <label>
      First name
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </label>
  );
}
```

The badge file shows the greeting and, below it, the name:

```jsx title="src/components/BadgePreview.jsx"
export default function BadgePreview() {
  return (
    <>
      <p>Hello, my name is</p>
      <h2>~{firstName}~</h2> {/* **WRONG:** BadgePreview.jsx has no firstName */}
    </>
  );
}
```

Our main file shows the heading and places the two siblings:

```jsx title="src/App.jsx"
import NameBox from './components/NameBox.jsx';
import BadgePreview from './components/BadgePreview.jsx';

export default function App() {
  return (
    <>
      <h1>Make a Name Badge</h1>
      ~<NameBox />~ {/* NameBox and BadgePreview are siblings: App places both */}
      <BadgePreview />
    </>
  );
}
```

When the page opens, nothing appears, not even the heading or the box:

```page width=text caption="The badge maker when it opens, with BadgePreview reading a firstName it never declared: the page is blank."
blank
console: Uncaught ReferenceError: firstName is not defined
  warn: An error occurred in the <BadgePreview> component.
```

The application tears down the entire user interface. The badge has the same problem as `Display`: `firstName` exists only inside the lexical scope of `NameBox`. React renders `App`, then `NameBox`, then `BadgePreview`. When `BadgePreview` asks for `firstName`, JavaScript throws a `ReferenceError`, and React removes everything it rendered, the heading and the box included. The second line in the Console names `BadgePreview` as the component where the crash occurred.

### Two Calls to useState Create Two Independent Memories

Next, the developer gives the badge its own `firstName`, as `Display` got its own `count`:

```jsx title="src/components/BadgePreview.jsx"
import { useState } from 'react';

export default function BadgePreview() {
  const [firstName, setFirstName] = ~useState('')~; // **WRONG:** a second firstName, separate from the one in NameBox
  return (
    <>
      <p>Hello, my name is</p>
      <h2>{firstName}</h2>
    </>
  );
}
```

The error is gone. When the page opens, the box is empty and the badge has no name yet:

```page width=text caption="The badge maker when it opens, with a second useState inside BadgePreview: the box and the badge are both empty."
heading: Make a Name Badge
form:
  field: First name |
line: Hello, my name is
empty: no name under Hello, my name is
console: quiet
```

Now the user types `John` into the box. The box shows `John`, and the badge still shows no name:

```page width=text caption="The same page after the user types John: the box shows John, and the badge stays empty."
heading: Make a Name Badge
form:
  field: First name | John | good
line: Hello, my name is
empty: no name under Hello, my name is
console: quiet
```

**The interface splits into two conflicting realities: typing re-renders only `NameBox`; `BadgePreview` never invokes a setter and remains permanently trapped in its initial blank state.** The badge stays empty because the box changes only its own copy of the name. Here is what happens after the user types the first letter:
1. The user types `J` into the box.
2. React calls the box's `onChange`, and `NameBox` calls its own `setFirstName` with `'J'`.
3. React renders `NameBox` again, and the box shows `J`.
4. Nothing called the setter inside `BadgePreview`, so React does not render `BadgePreview` again, and its `firstName` is still an empty string.
5. The same happens for the letters `o`, `h`, and `n`. The box shows `John`, and the badge stays empty.

The two components use the same variable name, `firstName`, but the name is all they share. Each `useState` line made its own isolated state.

### The Window Global Illusion: Mutating Variables Bypasses React's Reconciler

Then the developer tries to skip state for the badge. Every page in the browser has one global object, `window`, and any script on the page can write a property on it and read it back later. So the box also writes the typed name on `window`:

```jsx title="src/components/NameBox.jsx"
import { useState } from 'react';

export default function NameBox() {
  const [firstName, setFirstName] = useState('');
  return (
    <label>
      First name
      <input
        value={firstName}
        onChange={e => {
          setFirstName(e.target.value);
          ~window.sharedName = e.target.value;~ // Writes the typed name on window
        }}
      />
    </label>
  );
}
```

And the badge reads the name from `window`:

```jsx title="src/components/BadgePreview.jsx"
export default function BadgePreview() {
  return (
    <>
      <p>Hello, my name is</p>
      <h2>~{window.sharedName}~</h2> {/* **WRONG:** React does not watch window.sharedName */}
    </>
  );
}
```

There is no error this time, and the box works. But after the user types `John`, the page looks exactly as it did with the second `useState`:

```page width=text caption="The badge maker after the user types John, with the badge reading window.sharedName: the badge stays empty."
heading: Make a Name Badge
form:
  field: First name | John | good
line: Hello, my name is
empty: no name under Hello, my name is
console: quiet
```

**Mutating a `window` global updates browser memory, but React's reconciler completely ignores plain variable mutations. Without a state setter call or new incoming props, `BadgePreview` never re-renders.** `window.sharedName` now holds `John`, yet the badge never displays it on the screen. Here is what happens:
1. The user types `J`. The handler calls `setFirstName` and writes `'J'` on `window`.
2. React renders `NameBox` again, because its state changed.
3. Nothing changed the state or the props of `BadgePreview`, so React does not render it again.
4. A property on `window` is a plain variable, not state. React's docs say: "Changes to local variables won't trigger renders." Writing on `window` asks React for nothing.
5. The badge keeps what `BadgePreview` returned when the page opened: an `<h2>` with no name in it.

```tree caption="Three ways the badge tries to get the name from its sibling, and what the user sees each time."
Three ways `BadgePreview` tries to get the name from `NameBox`
- !Read a `firstName` it never declared [`{firstName}`] | `firstName` exists **only inside `NameBox`** | The page goes **blank** with a **ReferenceError**
- !Declare its own `firstName` [`useState` in `BadgePreview`] | A **second, separate** state that nothing changes | The badge stays **empty** while the box shows **John**
- !Read `window.sharedName` [`{window.sharedName}`] | React **does not watch** a plain variable | The badge stays **empty**, with **no error**
```

> [!PRINCIPLE]
> **Principle 1: Isolated State: Siblings Share No Memory or Variables**
>
> *State is private to the component that declares it, so a sibling cannot read it, and a second `useState` in the sibling makes a second, separate state.*
>
> The box and the badge sit next to each other on the page, yet `BadgePreview` sees only its own variables and the props written on its tag. Reading `firstName` there throws a `ReferenceError` and blanks the page. Giving the badge its own `useState` leaves it empty while the box shows `John`, because the box changes only its own copy. A value written on `window` fails too, because changing it does not make React render the badge again.
>
> **DO THIS:**
> ```jsx
> export default function BadgePreview(~{ firstName }~) { // Reads the name from a prop on its own tag
>   return <h2>{firstName}</h2>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function BadgePreview() {
>   const [firstName, setFirstName] = ~useState('')~; // **WRONG:** a second firstName that the box never changes
>   return <h2>{firstName}</h2>;
> }
> ```

---

## 2. Principle 2: Lifting State Up: The Closest Common Parent Owns the Shared Value

### From Private Child Memory to Read-Only Parent Props

The fix starts by moving one line. React's docs do it in three steps, and the first two need no state at all:
1. Remove the state from the child components.
2. Pass hardcoded data from the common parent. **Hardcoded** means written straight into the code as a fixed value, such as `count={3}`.
3. Add state to the common parent, and pass it down together with the event handlers. Principle 3 does this step.

Here are the first two steps on the smallest page. `Counter` and `Display` lose their `useState` lines and read `count` from their props. `Parent` writes the same number on both tags:

```jsx title="src/Parent.jsx"
export default function Parent() {
  return (
    <>
      <Counter ~count={3}~ /> {/* Step 2: the parent writes 3 on the first tag */}
      <Display ~count={3}~ /> {/* Step 2: the same 3 on the second tag */}
    </>
  );
}

function Counter(~{ count }~) { // Step 1: no useState, count comes from the tag
  return <button>Clicked {count} times</button>;
}

function Display(~{ count }~) { // Step 1: no useState, count comes from the tag
  return <p>Count: {count}</p>;
}
```

```page width=text caption="The two siblings with count written by the parent on both tags: both show 3."
line: [Clicked 3 times] | good
line: Count: 3 | good
console: quiet
```

Both siblings show `3`. **Yes, it is the exact same value in both!** The `count` inside `Counter` and the `count` inside `Display` come from one single place: the code of `Parent`. React's docs use a hardcoded value at this diagnostic step to check that the props reach both children before any dynamic state logic is introduced.

### Why React's docs call it lifting state up

This move has a canonical name in React's docs: **lifting state up**. In the UI tree, a parent sits above its children. So when state leaves a child and moves into the parent, it moves up the component tree. React's docs say: "This is known as lifting state up, and it's one of the most common things you will do writing React code."

State belongs in the **closest common parent**: the first ancestor component above every component that renders from the value. React's docs identify this location in three steps on their *Thinking in React* page:
1. Find every component that renders something based on that state.
2. Find their closest common parent component, the first component above all of them in the tree.
3. Decide where the state should live: often you can put the state directly into their common parent, or in another component above it.

On our page, two components render something based on the name: `NameBox` shows it in the box, and `BadgePreview` shows it on the badge. The first component above both in the UI tree is `App`, so the state belongs in `App`:

```tree caption="Where firstName lives before and after lifting state up into App, the closest common parent of the box and the badge."
Where `firstName` lives
- !Before: inside `NameBox` [`useState` in `NameBox`] | Only `NameBox` can **see and change** it | `BadgePreview` **cannot reach it**
- +After: inside `App` [`useState` in `App`] | `App` is the **closest common parent** of `NameBox` and `BadgePreview` | `App` passes `firstName` **down to both** as a prop
```

Junior developers often assume state belongs inside `NameBox` because the user types there. But user interaction does not decide where state lives; component tree topology decides it.

### Hardcoding Props Freezes the Child into a Read-Only Component

Now we take the first two steps on our badge maker. The box file loses its `useState` line and reads `firstName` from its props:

```jsx title="src/components/NameBox.jsx"
export default function NameBox(~{ firstName }~) { // Step 1: no useState, firstName comes from the tag
  return (
    <label>
      First name
      <input value={firstName} />
    </label>
  );
}
```

The badge file loses its own state too:

```jsx title="src/components/BadgePreview.jsx"
export default function BadgePreview(~{ firstName }~) { // Step 1: no useState, firstName comes from the tag
  return (
    <>
      <p>Hello, my name is</p>
      <h2>{firstName}</h2>
    </>
  );
}
```

And `App` writes the same hardcoded name on both tags:

```jsx title="src/App.jsx" startLine="4"
export default function App() {
  return (
    <>
      <h1>Make a Name Badge</h1>
      <NameBox ~firstName="John"~ /> {/* Step 2: App writes John on the box's tag */}
      <BadgePreview ~firstName="John"~ /> {/* Step 2: the same John on the badge's tag */}
    </>
  );
}
```

For the first time, the box and the badge agree on screen:

```page width=text caption="The badge maker with firstName written as John on both tags: the box and the badge both show John."
heading: Make a Name Badge
form:
  field: First name | John | good
line: Hello, my name is
section: John
console: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
```

**The input box is completely locked. Every keystroke is immediately rejected.** The Console displays the read-only field warning (as seen in Lesson 20), and the user cannot edit the text. When the user types `ny` at the end of the name, React puts `John` back after every keystroke. Why? Well, the box's `value` now comes directly from the hardcoded `firstName` prop, and `NameBox` has no setter or handler to change it. React's docs explain this exact diagnostic behavior: "React ignores your input. This is intentional." Locking `value` to a prop without an updater turns an interactive form control into an immutable display element.

`NameBox` with its own `useState` and `NameBox` with the `firstName` prop look alike: both show `firstName` in the box. **They are NOT the same thing!** With its own `useState`, `NameBox` owns the name and changes it internally. With the prop, `NameBox` only displays what `App` wrote on its tag. React's docs say that a child in this position "now has no control" over the value: "it's now up to the parent component!"

> [!PRINCIPLE]
> **Principle 2: Lifting State Up: The Closest Common Parent Owns the Shared Value**
>
> *Remove the state from the child, find the closest common parent of every component that shows the value, and let that parent pass the value down to each of them as a prop.*
>
> Two siblings agree only when they read the same value from the same place. `NameBox` and `BadgePreview` both render based on the name, and `App` is the first component above both, so the name belongs in `App`. The box where the user types does not decide where the name lives. Once the box reads `firstName` from a prop, only `App` can change it, so the box stays frozen until `App` also passes a function down.
>
> **DO THIS:**
> ```jsx
> <NameBox ~firstName="John"~ /> {/* The same value, written once by the same parent */}
> <BadgePreview firstName="John" />
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function NameBox() {
>   const [firstName, setFirstName] = ~useState('')~; // **WRONG:** the name stays inside the box, out of the badge's reach
>   return <input value={firstName} onChange={e => setFirstName(e.target.value)} />;
> }
> ```

---

## 3. Principle 3: Inverse Data Flow: The Parent Passes Down State as Value and Setters as Callbacks

### Up to the Parent and Down to the Siblings in a Single Render Pass

The third step of React's docs adds state to the common parent and passes it down together with an updater function. Here it is on the smallest page:

```jsx title="src/Parent.jsx"
import { useState } from 'react';

export default function Parent() {
  const [count, setCount] = ~useState(0)~; // Step 3: the state now lives in Parent
  return (
    <>
      <Counter count={count} ~onAdd={() => setCount(count + 1)}~ /> {/* Step 3: a function goes down to the child that changes count */}
      <Display count={count} />
    </>
  );
}

function Counter({ count, onAdd }) {
  return <button ~onClick={onAdd}~>Clicked {count} times</button>; // Calls the function from Parent
}

function Display({ count }) {
  return <p>Count: {count}</p>;
}
```

When the page opens, both siblings show `0`:

```page width=text caption="The two siblings when the page opens, with count held in Parent: both show 0."
line: [Clicked 0 times]
line: Count: 0
console: quiet
```

After the user clicks the button three times, both siblings show `3`:

```page width=text caption="The same page after the user clicks the button three times: both siblings show 3."
line: [Clicked 3 times] | good
line: Count: 3 | good
console: quiet
```

It may look as if `Counter` sends the number sideways to `Display`, **but it is NOT the same thing!** `Counter` never mentions `Display` and has no access to it. It only invokes the callback function that `Parent` passed down. `Parent` changes its own `count` state, React re-renders `Parent`, and that single parent render pass gives both children the identical new `count` value.

```tree dir=right caption="How one click in Counter reaches both siblings: through the parent, never sideways."
How one click reaches both siblings
- +1. `Counter` calls `onAdd` [`onAdd`] | The user **clicks the button**
- +2. `Parent` changes `count` [`setCount`] | Its **own setter**, next to its state
- +3. React renders `Parent` again | And with it **both children**
- +4. Both read the new `count` [`count`] | From the props on their tags, **in the same render**
```

### One Keystroke Triggers One Single Synchronized Render of Both Siblings

Now we take the third step on our badge maker. `App` declares `firstName`, passes it down to both siblings, and passes its setter function to the box:

```jsx title="src/App.jsx"
import { useState } from 'react';
import NameBox from './components/NameBox.jsx';
import BadgePreview from './components/BadgePreview.jsx';

export default function App() {
  const [firstName, setFirstName] = ~useState('')~; // App owns firstName
  return (
    <>
      <h1>Make a Name Badge</h1>
      <NameBox
        firstName={firstName}
        ~onFirstNameChange={setFirstName}~ // The function that changes firstName goes down to the box
      />
      <BadgePreview ~firstName={firstName}~ /> {/* The same firstName goes down to the badge */}
    </>
  );
}
```

The box unpacks the new prop and calls it with the text the user typed:

```jsx title="src/components/NameBox.jsx"
export default function NameBox({ firstName, onFirstNameChange }) {
  return (
    <label>
      First name
      <input
        value={firstName}
        ~onChange={e => onFirstNameChange(e.target.value)}~ // Sends the new text up to App
      />
    </label>
  );
}
```

`BadgePreview` does not change. It already reads `firstName` from its props.

The user types `J` into the box, and the badge in the other component shows `J` too:

```page width=text caption="The badge maker after the user types J: the box and the badge both show J."
heading: Make a Name Badge
form:
  field: First name | J | good
line: Hello, my name is
section: J
console: quiet
```

**One keystroke triggers inverse data flow: `NameBox` invokes `App`'s setter, `App` re-renders, and the new value cascades down to both siblings simultaneously in a single render pass.** No line of `NameBox` mentions the badge, yet the badge updates instantly because the typed character traveled up to `App` and came back down to both siblings. Here is what happens after the user's keystroke:
1. The user types `J` into the box.
2. React calls the box's `onChange` with the browser event object, and `NameBox` calls `onFirstNameChange` with `'J'`.
3. `onFirstNameChange` is `setFirstName` from `App`, so `App` asks React to render again with `firstName` set to `'J'`.
4. React renders `App` again, and with it renders both `NameBox` and `BadgePreview` (as seen in Lesson 13).
5. `NameBox` receives `'J'` in its `firstName` prop, and the box shows `J`.
6. `BadgePreview` receives the exact same `'J'` in the exact same render pass, and the badge shows `J`.

Even the letter inside the box comes back from `App`. If `App` did not update `firstName`, the box would put the old text back, as it did in Principle 2. And because both siblings read the same variable in the same render pass, there is zero intermediate moment where the box shows the new name while the badge shows the old one. After the user finishes typing, both display `John`:

```page width=text caption="The badge maker after the user types John: the box and the badge both show John."
heading: Make a Name Badge
form:
  field: First name | John | good
line: Hello, my name is
section: John
console: quiet
```

### One owner for each piece of state

`App` is now the single authority for this value. React's docs call this a **single source of truth**: for each piece of mutable state, one specific component holds it. It does not mean that all the state of an entire application lives in one giant root component. In the docs' words: "for each piece of state, there is a specific component that holds that piece of information." On our page, `App` holds `firstName`, and both siblings read it from their props.

`App` passes its setter itself. It could also write a handler function that calls the setter:

```jsx title="Passing the setter itself, and passing a handler that calls the setter"
<NameBox ~onFirstNameChange={setFirstName}~ /> {/* App passes its setter itself */}
<NameBox ~onFirstNameChange={handleFirstNameChange}~ /> {/* handleFirstNameChange calls setFirstName with the same text */}
```

**Yes, it is the exact same thing on this page!** The box sends exactly the next text string, so passing the setter directly is completely sufficient. React's docs pass a setter directly on their *Thinking in React* page. Writing a dedicated handler function is necessary when the parent must validate, transform, or perform extra work with the value before saving it.

### Omitting the Callback Prop Leaves the Controlled Input Immovably Frozen

One classic mistake occurs when developers lift state halfway, and React's docs specifically warn about it on their *Thinking in React* page. A developer lifts `firstName` into `App` and passes it down to both siblings, but forgets to pass an updater callback down to the box. The box has only `value={firstName}`. The page behaves exactly as in Principle 2: the input is completely frozen, React ignores the user's typing, and the Console prints the read-only field warning (as seen in Lesson 20). Because `App` owns the state cell, only `App` can call `setFirstName`. To allow a child to modify parent state, the parent must explicitly pass a callback function down to that child.

> [!PRINCIPLE]
> **Principle 3: Inverse Data Flow: The Parent Passes Down State as Value and Setters as Callbacks**
>
> *Declare the state in the common parent, pass the value down to every sibling that shows it, and pass a function down to the sibling that changes it.*
>
> The box never sends the name to the badge. When the user types, the box calls the function it received, `App` changes its own `firstName`, and React renders `App` again with both siblings. Both read the same new name in the same render, so they can never disagree. Without the function, the box is frozen, because only the owner of the state can call its setter.
>
> **DO THIS:**
> ```jsx
> <NameBox firstName={firstName} ~onFirstNameChange={setFirstName}~ /> {/* The box can ask App to change the name */}
> <BadgePreview firstName={firstName} />
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <NameBox ~firstName={firstName}~ /> {/* **WRONG:** no function comes down, so the box ignores the user's typing */}
> <BadgePreview firstName={firstName} />
> ```

---

## 4. Principle 4: Controlled Components: A Component Driven by Props Can Be Reset from Above

### Who Drives the Value: Local Child State vs. Parent Props

Compare the controlled input of Lesson 20, which displays `text` from the state of the component wrapping it, with our `NameBox` tag in `App`:

```jsx title="A controlled input, and a controlled NameBox"
<input ~value={text} onChange={e => setText(e.target.value)}~ /> {/* Lesson 20: a value and a function come down to the input */}
<NameBox ~firstName={firstName} onFirstNameChange={setFirstName}~ /> {/* This lesson: a value and a function come down to NameBox */}
```

**Yes, it is the exact same thing, one level up!** Just as a native `<input>` receives `value` and `onChange` from its parent component (as seen in Lesson 20), `NameBox` now receives `firstName` and `onFirstNameChange` from `App`. Because `App` provides both the data and the updater, `App` completely controls what `NameBox` shows. React's docs use the exact same term for both: **controlled**.
- A **controlled component** is driven entirely by its props. React's docs: "a component is 'controlled' when the important information in it is driven by props rather than its own local state. This lets the parent component fully specify its behavior."
- An **uncontrolled component** is driven by its own internal state, so its parent cannot coordinate or reset what it shows.

`NameBox` in Principle 1 also contained a controlled `<input>` element inside it. It may look as if that made `NameBox` controlled too, **but it is NOT the same thing!** That native `<input>` was controlled internally by the private state of `NameBox`. From the perspective of `App`, `NameBox` was uncontrolled: `App` had zero props to read or change its contents. The term controlled asks one defining architectural question: who drives the information? For the native `<input>`, the answer is `NameBox`. For `NameBox` itself, the answer is now `App`.

```tree caption="Who drives what NameBox shows: its own state in Principle 1, and App from Principle 3 on."
Who drives what `NameBox` shows
- !`NameBox` in Principle 1 [`useState` in `NameBox`] | The `<input>` inside is controlled **by `NameBox`** | `NameBox` is **uncontrolled**: `App` cannot change it
- +`NameBox` from Principle 3 on [`firstName` `onFirstNameChange`] | The name comes **from `App`** | `NameBox` is **controlled** by `App`
```

### External Coordination: The Parent Resets Both Siblings at Once

Because `App` drives the state, `App` can coordinate changes from anywhere across the user interface, even from an external button outside `NameBox`. We add a `Start over` button directly inside `App` under the badge:

```jsx title="src/App.jsx" startLine="9"
      <h1>Make a Name Badge</h1>
      <NameBox
        firstName={firstName}
        onFirstNameChange={setFirstName}
      />
      <BadgePreview firstName={firstName} />
      <button ~onClick={() => setFirstName('')}~>Start over</button> {/* App empties its own firstName */}
```

The user types `John` into the box:

```page width=text caption="The badge maker with the Start over button, after the user types John."
heading: Make a Name Badge
form:
  field: First name | John
line: Hello, my name is
section: John
line: [Start over]
console: quiet
```

Then the user clicks `Start over`, and the box and the badge are both empty again:

```page width=text caption="The same page after the user clicks Start over: the box and the badge are both empty."
heading: Make a Name Badge
form:
  field: First name | | good
line: Hello, my name is
empty: no name under Hello, my name is
line: [Start over]
console: quiet
```

Both siblings read the same empty string from `App`'s state. The button requires no callback prop, because `setFirstName` lives right next to the button inside `App`.

When deciding whether a custom component should be controlled or uncontrolled, developers weigh an architectural trade-off:
- **Choice A: Uncontrolled Component.** The component manages its own `useState`.
  - *Advantage:* Minimal setup; parent components require zero prop configuration.
  - *Trade-off:* Inflexible; cannot be reset, synchronized, or coordinated by external parent controls.
- **Choice B: Controlled Component.** The component receives its value and updater as props from above.
  - *Advantage:* Maximally flexible; parents can coordinate multiple siblings, enforce validation, and reset values from outside.
  - *Trade-off:* Higher configuration overhead; the parent must wire both value props and callback handlers.

### The Stale Mirror Bug: useState(prop) Ignores Parent Resets

There is one classic trap that breaks external resets: copying the prop into local state, known as the prop-mirroring anti-pattern (as seen in Lesson 22). A developer lifts `firstName` into `App`, but mistakenly retains a state line inside `NameBox` and initializes it from the prop:

```jsx title="src/components/NameBox.jsx"
import { useState } from 'react';

export default function NameBox({ firstName, onFirstNameChange }) {
  const [text, setText] = ~useState(firstName)~; // **WRONG:** reads firstName only on the first render
  return (
    <label>
      First name
      <input
        value={text}
        onChange={e => {
          setText(e.target.value);
          onFirstNameChange(e.target.value);
        }}
      />
    </label>
  );
}
```

While the user types into the box, this component appears to work identically to the pure props-driven version. Both setters execute on every keystroke, keeping `text` in `NameBox` and `firstName` in `App` synchronized. **It may look the same, or work the same at first, but it is NOT the same thing!** The hidden defect strikes the moment `App` resets the value on its own. After the user types `John` and clicks `Start over`, the badge clears to empty, but the input box remains stuck on `John`:

```page width=text caption="The badge maker with firstName copied into state inside NameBox, after the user types John and clicks Start over."
heading: Make a Name Badge
form:
  field: First name | John | bad
line: Hello, my name is
empty: no name under Hello, my name is
line: [Start over]
console: quiet
```

**The reset operation fails silently: `useState(prop)` evaluates its initial argument only during the initial component mount. When `App` resets `firstName` to an empty string, `NameBox` completely ignores the incoming prop update and retains its stale local state.** Here is what happens:
1. The user types `John`. `text` in `NameBox` and `firstName` in `App` both become `'John'`.
2. The user clicks `Start over`, and `App` sets `firstName` to an empty string.
3. React renders `App`, `NameBox`, and `BadgePreview` again.
4. `BadgePreview` receives the empty string, and the badge displays empty.
5. `NameBox` receives the empty string prop too, but `useState` evaluates its argument only on mount (as seen in Lesson 22).
6. `text` stays `'John'`, leaving the input box frozen on `John` above an empty badge.

The box and the badge desynchronize again, re-introducing the exact split-brain defect that lifting state was designed to prevent. The cure is simple: use the prop directly. In `NameBox`, pass `value={firstName}` directly to the `<input>`, as established in Principle 3.

> [!PRINCIPLE]
> **Principle 4: Controlled Components: A Component Driven by Props Can Be Reset from Above**
>
> *A component driven by props is controlled by its parent, so the parent can change it from anywhere; the child uses the prop directly and never copies it into its own state.*
>
> Once `NameBox` shows `firstName` from `App`, `App` decides what the box shows, so a `Start over` button in `App` empties the box and the badge at once. A box that copies the prop into its own state works while the user types, but `useState` reads the prop only on the first render. After `Start over`, the badge is empty and the box still shows the old name.
>
> **DO THIS:**
> ```jsx
> export default function NameBox({ firstName, onFirstNameChange }) {
>   return <input ~value={firstName}~ onChange={e => onFirstNameChange(e.target.value)} />; // The box always shows App's firstName
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function NameBox({ firstName, onFirstNameChange }) {
>   const [text, setText] = ~useState(firstName)~; // **WRONG:** keeps the old name after App resets firstName
>   return <input value={text} onChange={e => { setText(e.target.value); onFirstNameChange(e.target.value); }} />;
> }
> ```

---

## Putting All Four Principles Together

### The complete name badge maker

Here is our complete name badge maker. `App` owns `firstName`, passes it to both siblings, and passes its setter to the box. `NameBox` and `BadgePreview` keep no state of their own:

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  ~<StrictMode>~ {/* Mounts App inside StrictMode */}
    <App />
  </StrictMode>
);
```

```jsx title="src/App.jsx"
import { useState } from 'react';
import NameBox from './components/NameBox.jsx';
import BadgePreview from './components/BadgePreview.jsx';

export default function ~App~() { // 1. Called first when the page loads
  const [firstName, setFirstName] = ~useState('')~; // Principle 2: the name lives in the closest common parent
  return (
    <>
      <h1>Make a Name Badge</h1>
      <NameBox
        firstName={firstName}
        ~onFirstNameChange={setFirstName}~ // Principle 3: the box can ask App to change the name
      />
      <BadgePreview ~firstName={firstName}~ /> {/* Principle 3: the badge reads the same name */}
      <button ~onClick={() => setFirstName('')}~>Start over</button> {/* Principle 4: App resets the name for both */}
    </>
  );
}
```

```jsx title="src/components/NameBox.jsx"
export default function ~NameBox~({ firstName, onFirstNameChange }) { // 2. Called second, from App
  return (
    <label>
      First name
      <input
        ~value={firstName}~ // Principle 4: the prop used directly, never copied into state
        onChange={e => onFirstNameChange(e.target.value)}
      />
    </label>
  );
}
```

```jsx title="src/components/BadgePreview.jsx"
export default function ~BadgePreview~({ firstName }) { // 3. Called third, from App
  return (
    <>
      <p>Hello, my name is</p>
      <h2>~{firstName}~</h2> {/* Principle 1: the name comes from a prop, not from the sibling */}
    </>
  );
}
```

After the user types `John`, the box and the badge agree, and the Console is quiet:

```page width=text caption="The finished name badge maker after the user types John."
heading: Make a Name Badge
form:
  field: First name | John | good
line: Hello, my name is
section: John
line: [Start over]
console: quiet
```

### How React calls the components in order

When the page opens, and again after every keystroke by the user and every click on `Start over`, React starts at `App` and follows the tags from top to bottom. It calls `NameBox` first, because its tag comes first, and then `BadgePreview`. The name runs down to both children in this tree, and the call to `onFirstNameChange` runs back up from `NameBox` to `App`:

```tree caption="The component tree of the name badge maker and the order in which React calls each component."
`App` [1. Called first] | **Owns `firstName`** | The **closest common parent** of the box and the badge
- +`NameBox` [2. Called second] | Receives **`firstName`** and **`onFirstNameChange`** | Controlled by `App`
- +`BadgePreview` [3. Called third] | Receives **`firstName`** | Shows the same name in the same render
```

| Aspect | The Habit That Breaks the Page | The React Rule |
| :--- | :--- | :--- |
| **Reading the sibling's name** | The badge reads `firstName` from the box, which throws a `ReferenceError`, or reads `window.sharedName`, which React never watches | The badge reads `firstName` from a prop on its own tag |
| **A second copy** | The badge declares its own `useState`, which stays empty while the box shows `John` | One `useState` line, in the closest common parent |
| **Where the state lives** | In the component where the user types | In `App`, the first component above every component that shows the name |
| **Changing the name** | `App` passes only the value, and the box ignores the user's typing | `App` also passes `onFirstNameChange`, and one keystroke renders both siblings with the same name |
| **Resetting the name** | The box copies the prop into its own state and keeps the old name after `Start over` | The box uses the prop directly, so `App` controls it |

---

## For the Interview

> **The Interview Question:** How do two sibling components share one changing value?

### How to Answer Clearly in 30 Seconds

"Two siblings cannot read each other's state, because state is private to the component that declares it, and each sibling sees only the props written on its own tag. So we lift the state up: we remove it from the children, find their closest common parent, and declare the state there. The parent passes the value down as a prop to every sibling that shows it, and passes a callback prop, such as `onFirstNameChange={setFirstName}`, to the sibling that changes it. Three details matter:
1. **One change, one render**: the child calls the parent's function, the parent sets its state, and React renders the parent and both siblings again, so both get the identical value in the same render pass.
2. **Single source of truth**: each piece of state has one owner. A second `useState` in the other sibling is a second copy that stops matching after the first change.
3. **Controlled components**: a child driven by props is controlled by its parent, so the parent can reset it. The child uses the prop directly and does not copy it into its own state."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why not keep a copy of the value in each sibling and keep the copies equal with an Effect?"**
   **Because the copies disagree first and agree later.** With an Effect, the first sibling changes its state, and React renders. Only after that render does the Effect set the second copy, which costs a second render. Between the two renders, the screen can show two different values. React's docs say: "Whenever you try to keep two different state variables synchronized, try lifting state up instead!" When the parent changes its state during the event, the docs note that there is only one render pass (as seen in Lessons 32 and 34).
2. **"Does the state keep its shape when you lift it?"**
   **Not always.** React's docs show an `Accordion` with two `Panel` components, where only one panel may be open at a time. When each `Panel` keeps its own `isActive` boolean, pressing Show on one panel does not close the other, so both can be open. Lifting the state into `Accordion` replaces two booleans with one number, `activeIndex`, which says which panel is open. Each `Panel` receives `isActive` as a prop and an `onShow` function. In the docs' words: "Lifting state up often changes the nature of what you're storing as state."
3. **"Does a single source of truth mean all the state lives at the top of the app?"**
   **No.** Each piece of state lives in the closest common parent of the components that need it, and no higher. The docs say: "It doesn't mean that all state lives in one place." It is also normal to move state down or back up while you work out where each piece belongs. When the closest common parent sits far above, and every layer between passes a prop it never uses, the docs call it prop drilling, and context is the next tool (as seen in Lesson 28). And two components that call the same custom hook do not share state, because each call gets its own (as seen in Lesson 39).

```tree dir=right caption="Interview summary: how two sibling components share one changing value through their closest common parent."
How two siblings share one changing value
- +Find the closest common parent [`App`] | The first component **above both** siblings
- +Declare the state there [`useState` in `App`] | **One owner**, one source of truth
- +Pass the value down to both [`firstName`] | Each sibling reads it **from its own tag**
- +Pass a function to the one that changes it [`onFirstNameChange`] | One change renders **both siblings** with the same value
```
