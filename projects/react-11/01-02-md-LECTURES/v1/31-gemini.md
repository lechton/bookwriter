# Lecture 31: Reaching a DOM Node with a Ref

*(How do you get hold of the real `<input>` element that React created, to put the cursor in it?)*

> INTERVIEW QUESTION | ❱ CORE | How do you reach a DOM node from React to focus it, scroll it, or measure it?

---

## VS | Plain JavaScript `getElementById` vs. React `ref`: you grab the element yourself, or React hands it to you

> Sometimes your code needs to work with a real element on the page: to put the cursor in an input field, scroll to a message, or measure a box. **You should attach a ref to that JSX tag.** React puts the real browser element it created into the ref, so your code can focus it, scroll to it, or measure it.

In React, a user interface often needs to directly control a real browser element on the screen. Common examples include placing the blinking cursor inside an input field, scrolling a message log, or controlling video playback. In plain JavaScript, you locate elements manually with `document.getElementById` and call native browser methods on them. In React, you avoid searching the document manually. Instead, you declare a ref using `useRef` and attach it to a JSX tag with the `ref` attribute. Attaching a ref instructs React to hand you the real browser DOM element it created. Your code can then focus, scroll, or measure that element on command. A ref replaces manual DOM queries by having React deliver the element directly to your component.

Consider a comment form with a text field and a **Reply** button. When the user clicks **Reply**, the cursor should immediately jump into the text field so typing can begin. Both the button and the text field live in the same component. The click handler on the button needs a direct connection to the real input element on the screen.

**Why:** Writing `<input />` in JSX does not provide a direct reference to a browser element. JSX is merely a blueprint, and React constructs the underlying HTML element during the commit phase. Furthermore, JSX provides no declarative prop to shift keyboard focus at a specific instant. Only the real browser element provides the native `focus()` method. Passing a ref to the tag instructs React to assign the created browser element to `inputRef.current`. Once the element appears on the screen, your click handler calls `inputRef.current.focus()` directly.

### Back to `getElementById`

In plain JavaScript, you search the page for the element and then invoke its browser methods:

```js title="Plain JavaScript: grab the element, then focus it"
const input = ~document.getElementById('name')~; // You search the page and grab the <input> element
input.focus(); // The browser puts the cursor in it
```

In React, your application code never creates DOM elements manually. React creates them behind the scenes from your JSX descriptions.

Most of the time, you do not need direct element handles. You describe the interface in JSX, and React automatically updates the text, classes, and visible elements.

However, some browser operations have no declarative JSX representation. JSX provides no prop to shift keyboard focus at a specific moment. It provides no prop to scroll a container to a target image, and it cannot measure an element's rendered pixel dimensions. For these imperative browser interactions, you must access the real DOM element.

The official React documentation states: "There is no built-in way to do those things in React, so you will need a *ref* to the DOM node."

In React, you request the element directly from the framework:

```jsx title="React: ask React for the element, then focus it"
const inputRef = ~useRef(null)~; // 1. In the component: creates the object { current: null }
<input ~ref={inputRef}~ /> {/* 2. In the JSX: when you create this <input>, put it into inputRef.current */}
~inputRef.current.focus()~; // 3. In a click handler: the same focus as in plain JavaScript
```

Line 1 declares the ref container introduced in Lesson 30. Line 3 invokes the native browser `focus()` method. Only line 2 introduces new syntax: the `ref` attribute.

> [!DEFINITION]
> **What is a DOM node?** [NEW] A DOM node is the real object the browser creates in memory to represent an HTML tag on the page. For `<input />` in JSX, the browser creates an `HTMLInputElement` object.
> 1. It is the live element inspected in the browser Elements developer tools, and the exact object returned by `document.getElementById` (Lesson 01).
> 2. It exposes native browser properties and methods, such as `focus()`, `scrollIntoView()`, `offsetWidth`, and `getBoundingClientRect()`.
> 3. The official documentation uses "DOM node" and "DOM element" interchangeably.
> 
> A DOM node represents live browser layout and state outside React's JavaScript memory (Lesson 31).

> [!DEFINITION]
> **What is a ref?** [REVIEW] `useRef(null)` returns a plain JavaScript object with one property: `{ current: null }`. React returns the exact same object reference on every render, and mutating `current` never triggers a re-render.
> 1. In Lesson 30, application code assigned values to `current`, such as storing an interval ID inside an event handler.
> 2. In this lesson, React assigns the DOM element to `current`. When you attach `ref={inputRef}` to a JSX tag, React sets `inputRef.current` to that element during the commit phase.
> 3. When the element is removed from the screen, React resets `inputRef.current` back to `null`.
> 
> It is the exact same ref container. As the official documentation notes: "Refs are a generic concept, but most often you'll use them to hold DOM elements" (Lesson 30).

The key distinction lies in which part of the program writes to `current`:

```jsx title="Who writes current: our code in Lesson 30, React in this lesson"
intervalRef.current = ~setInterval(tick, 1000)~; // Lesson 30: our Start handler writes the interval ID
<input ~ref={inputRef}~ /> {/* This lesson: React writes the <input> element */}
```

### The smallest example: a button that focuses an input

Here is the first example from the official documentation: an input field alongside a button that moves focus into it:

```jsx title="Form.jsx"
import { useRef } from 'react';

export default function Form() {
  const inputRef = ~useRef(null)~; // { current: null } until React creates the <input>

  function handleClick() {
    ~inputRef.current.focus()~; // current holds the real <input>, so the browser's focus works
  }

  return (
    <>
      <input ~ref={inputRef}~ /> {/* Asks React to put this <input> into inputRef.current */}
      <button onClick={handleClick}>Focus the input</button>
    </>
  );
}
```

When the page loads, the input field is empty and lacks keyboard focus:

```page width=text caption="The docs' example when the page opens: an empty input field and the Focus the input button."
form:
  field:  | 
  button: Focus the input
console: quiet
```

When the user clicks the button, the cursor appears inside the input field, and the browser draws its active focus outline:

```page width=text caption="After the click on Focus the input, the cursor is in the input field."
form:
  field:  |  | good
  button: Focus the input
console: quiet
```

The `ref` attribute tells React to assign the created browser DOM node to `inputRef.current`. When the user clicks the button, the click handler accesses `inputRef.current` and calls `focus()`, prompting the browser to activate the input field.

### The Rule of Thumb: can the JSX say it?

**Ask one decisive question about every interaction: can declarative JSX describe it? If yes, store the data in state and render it in JSX. If not, as with focusing, scrolling, or measuring, attach a ref and access it inside an event handler.**

The official React documentation notes that direct DOM access is an escape hatch: "React automatically updates the DOM to match your render output, so your components won't often need to manipulate it." When imperative access is necessary, "Usually, you will access refs from event handlers."

Lesson 30 described a ref as an escape hatch. Accessing DOM nodes serves the same purpose: stepping outside React to manage focus, adjust scroll positions, or invoke browser APIs that React does not expose directly.

```tree caption="Which tool fits which job when a component needs something on the page."
What the component needs on the page
- +Something the JSX can say [`value={text}` `{show && <p />}`] | Text, a class, a line shown or hidden | **State and JSX**, no ref
- +Focus, scroll, or measure after a click [`inputRef.current.focus`] | The browser keeps these, **not the JSX** | **A ref**, read in the **event handler**
- +Focus an input the moment it appears [`autoFocus`] | There is **no event** to run code in | **`autoFocus`**, or an Effect in Lesson 32
- !Find the element by its id [`document.getElementById`] | Searches **the whole page** | Finds **the wrong input** when a component appears twice
```

A senior developer understands the three classic pitfalls when working with DOM nodes:
1. **Calling document.getElementById in a component.** Global ID searches query the entire page, which breaks isolation when a component is rendered multiple times.
2. **Reading inputRef.current during rendering.** On the initial render, React has not constructed the DOM node yet, leaving `current` set to `null`.
3. **Mutating DOM nodes managed by React.** Manually removing or inserting elements behind React's back desynchronizes the DOM, causing React to crash on the next render.

The rest of this lesson examines each pitfall using a practical guest list application.

## SECTION | A Guest List for Lunch

Our application manages a guest list. You type a name, click Add, and the name joins the list. Then you type the next name, and the next.

```page width=text caption="The guest list when the page opens: a heading, an empty input field, an Add button, and no guests yet."
section: Lunch guests
form:
  field:  | 
  button: Add
console: quiet
```

Here is the intended user workflow:
1. The user types John and clicks Add. John joins the list, and the input field clears.
2. The user immediately types Mary without reaching for the mouse, expecting keystrokes to register in the input field.

Here is the initial component implementation. It uses a controlled input from Lesson 20, an ID counter from Lesson 19, and key attributes from Lesson 18:

```jsx title="src/components/GuestList.jsx"
import { useState } from 'react';

let nextId = 0;

export default function GuestList() {
  const [text, setText] = useState('');
  const [guests, setGuests] = useState([]);

  function handleAdd() {
    setGuests([...guests, { id: nextId++, name: text }]);
    ~setText('')~; // Empties the input field, and nothing puts the cursor back in it
  }

  return (
    <section>
      <h2>Lunch guests</h2>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {guests.map(guest => <li key={guest.id}>{guest.name}</li>)}
      </ul>
    </section>
  );
}
```

The user types John and clicks Add. John joins the list. Then the user types Mary, but no characters appear in the input field:

```page width=text caption="After the click on Add, the user types Mary, and no letter reaches the input field."
section: Lunch guests
form:
  field:  |  | bad
  button: Add
line: John
console: quiet
```

Clicking the Add button caused the input field to lose focus. The cursor is gone, forcing the user to manually click the input field before typing each new guest name.

The App component renders one list for now:

```jsx title="src/App.jsx"
import GuestList from './components/GuestList.jsx';

export default function App() {
  return (
    <main>
      ~<GuestList />~ {/* One list for now; Principle 3 adds a second one */}
    </main>
  );
}
```

The entry file mounts the root component inside StrictMode, as introduced in Lesson 07. Here is the project structure:

```files title="guest-list: File Explorer" caption="How the guest list project files sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and renders `<GuestList />`
  components/
    GuestList.jsx | state and ref | Keeps the text and the guests in state and, from Principle 1, the input field in a ref
```

Each upcoming principle modifies this application to demonstrate how React manages DOM nodes:

**PRINCIPLES:** A ref allows your code to request: "When React creates this element, hand it to me." Five principles govern this interaction:
1. **Principle 1: The ref Attribute Fills ref.current.** React populates `inputRef.current` during the commit phase. Without the `ref` attribute, the ref remains `null`.
2. **Principle 2: Focus, Scroll, and Measure in a Handler.** In an event handler, `inputRef.current` references the live DOM element, allowing you to invoke native browser methods.
3. **Principle 3: One Ref per Copy, Not One Id per Page.** Global `document.getElementById` returns the first match on the entire page, causing focus to jump to the wrong component instance.
4. **Principle 4: Never Read the Ref During Rendering.** During the initial render, `ref.current` is `null`, and attempting to call methods on it crashes the application.
5. **Principle 5: Never Change What React Drew.** Mutating or removing DOM nodes managed by React breaks DOM reconciliation, crashing the subsequent render.

| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |
| :--- | :--- | :--- | :--- |
| **Principle 1** | **The ref Attribute Fills ref.current** | Interviewers ask how a ref gets the element; without the `ref` attribute it stays `null`, and the click throws a `TypeError`. | Create the ref with `useRef(null)`, and pass it to a built-in tag as `ref={inputRef}`; React fills `current` after it creates the element. |
| **Principle 2** | **Focus, Scroll, and Measure in a Handler** | Focus, scroll position, and sizes have no JSX form, so changing state alone never moves the cursor. | In an event handler, call the browser's own methods on `ref.current`: `focus`, `scrollIntoView`, `offsetWidth`, or `getBoundingClientRect`. |
| **Principle 3** | **One Ref per Copy, Not One Id per Page** | It works with one copy of the component and breaks as soon as the component appears twice, with no warning in the Console. | Reach an element through a ref, which belongs to one copy of the component, never through an id searched on the whole page. |
| **Principle 4** | **Never Read the Ref During Rendering** | A call on `ref.current` in the body of the component blanks the page, and skipping the call with `?.` still gives no focus. | Read DOM refs in event handlers, or in an Effect when there is no event, never during rendering. |
| **Principle 5** | **Never Change What React Drew** | Removing an element React manages looks fine for one click, then the next state change crashes the page. | Use DOM refs for non-destructive actions such as focusing, scrolling, and measuring; change what React draws through state. |

---

## PRINCIPLE | `ref={inputRef}`: React puts the element into `inputRef.current` right after it creates it

> [!PRINCIPLE]
> **Principle 1: The ref Attribute: React Puts the Element into ref.current**
>
> *Create a ref with `useRef(null)`, and attach `ref={inputRef}` to a built-in JSX tag; during the commit phase, React assigns the created DOM element to `inputRef.current`, and sets it back to `null` on unmount.*
>
> Calling `useRef(null)` allocates only the empty container object `{ current: null }`. Attaching the `ref` attribute to the JSX tag instructs React to connect the physical DOM element to that container. Your application code never writes to `current` directly here. If you omit the `ref` attribute, `current` remains `null`, causing any subsequent method call to throw a `TypeError`.
>
> **DO THIS:**
> ```jsx
> const inputRef = useRef(null);
> return <input ~ref={inputRef}~ />; // React puts this <input> into inputRef.current
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const inputRef = useRef(null);
> return ~<input />~; // **WRONG:** no ref attribute, so inputRef.current stays null forever
> ```

Your code never writes to `inputRef.current`. At what point does React populate it?

React executes in two distinct phases (Lesson 13): the render phase and the commit phase. The DOM element can exist only after React completes the commit phase:
1. **The initial render phase.** React executes `GuestList`, evaluating `<input ref={inputRef} />`. Because the browser DOM has not been modified yet, `inputRef.current` remains `null`.
2. **The commit phase.** React creates the real HTMLInputElement and inserts it into the document tree.
3. **Ref assignment.** Immediately following the commit, React sets `inputRef.current` to that live DOM element.
4. **Cleanup on unmount.** When the component unmounts or the tag is removed, React resets `inputRef.current` to `null`.

The official React documentation summarizes this timing: "After React creates the DOM node and puts it on the screen, React will set the `current` property of your ref object to that DOM node."

```tree dir=right caption="How the input element reaches inputRef.current without a line of our code writing it."
How React fills `inputRef.current`
- +1. The first render [`<input ref={inputRef} />`] | The JSX names the ref | `current` is still **`null`**
- +2. The commit | React **creates the `<input>` element** | and adds it to the page
- +3. Right after | React sets **`inputRef.current` to that element** | Your handler can now call `focus`
- +4. The input is removed | React sets **`current` back to `null`**
```

To inspect what React places inside the ref, log `inputRef.current` inside the click handler:

```jsx title="Logging inputRef.current in the click handler"
function handleClick() {
  ~console.log(inputRef.current)~; // Logs the <input> element itself
  inputRef.current.focus();
}
```

```page width=text caption="After the click, the Console shows the input element that React put into inputRef.current."
form:
  field:  |  | good
  button: Focus the input
log: <input>
```

The logged value is the real browser input element, identical to the object returned by `document.getElementById`.

React treats `ref` as a reserved keyword attribute, similar to `key`. React consumes the `ref` attribute internally during rendering and excludes it from the rendered HTML. When inspecting the element in browser developer tools, the input element appears as a standard tag without any ref attribute:

```dom caption="The Elements panel: the input carries no ref attribute, because React reads ref and keeps it out of the DOM."
<div id="root">
+ <input> | note: No ref attribute in the DOM
  <button>Focus the input</button>
</div>
```

### The ref attribute works on built-in tags

The React documentation refers to standard browser tags like `<input>` and `<div>` as built-in components.

Attaching `ref` to a built-in tag connects the ref directly to that DOM element. The documentation notes: "Your ref will be filled with the DOM element for this node."

Attaching `ref` to a custom component like `<GuestList ref={listRef} />` behaves differently. By default, custom components do not expose refs to their internal DOM nodes unless explicitly forwarded, as covered in Lesson 85.

### `useRef` without the attribute leaves `current` at `null`

Declaring a ref and attaching it to a tag are two separate steps. The DOM element connects to the ref only when both steps are present:

```jsx title="Without the ref attribute on the tag, and with it"
<input /> {/* Without the attribute: inputRef.current stays null forever */}
<input ~ref={inputRef}~ /> {/* With the attribute: React puts this <input> into inputRef.current */}
```

Both tags render an identical input field on the screen. However, omitting the `ref` attribute means React never connects the created DOM node to `inputRef.current`.

If a developer forgets the `ref` attribute but still calls `focus()` in the click handler, the click fails to focus and throws an error:

```page width=text caption="Without ref={inputRef} on the tag, the click leaves the input field without the cursor and throws an error."
form:
  field:  |  | bad
  button: Focus the input
console: Uncaught TypeError: Cannot read properties of null (reading 'focus')
```

Because the ref was initialized with null, `inputRef.current` remains null. Calling focus on null triggers an unhandled `TypeError`. Adding the missing `ref` attribute resolves the failure.

### The guest list gets its ref

Returning to our guest list application, the component imports `useRef`, declares `inputRef`, and attaches it to the input tag:

```jsx title="src/components/GuestList.jsx" startLine="1"
import { useState, ~useRef~ } from 'react'; // useRef joins useState

let nextId = 0;

export default function GuestList() {
  const [text, setText] = useState('');
  const [guests, setGuests] = useState([]);
  const inputRef = ~useRef(null)~; // null until the commit, then the <input> element
```

```jsx title="src/components/GuestList.jsx" startLine="18"
      <input ~ref={inputRef}~ value={text} onChange={e => setText(e.target.value)} /> {/* React puts this <input> into inputRef.current */}
```

After the initial commit completes, `inputRef.current` holds the live input element. The interface behaves as before because no function has called `focus()` yet. Principle 2 introduces that call.

---

## PRINCIPLE | `ref.current` in an event handler: focus, scroll, and measure with the browser's own methods

> [!PRINCIPLE]
> **Principle 2: Browser APIs: Call focus, scrollIntoView, or offsetWidth on ref.current in a Handler**
>
> *In an event handler, `ref.current` points to the real DOM element, allowing you to invoke native browser methods: `focus` to move the cursor, `scrollIntoView` to scroll to an element, and `offsetWidth` or `getBoundingClientRect` to measure dimensions.*
>
> Keyboard focus, scroll coordinates, and rendered pixel geometry belong to the browser engine, not to declarative JSX. Updating React state changes what React renders, but state updates cannot imperatively move the cursor. Clicking Add transfers focus away from the input, and only calling `focus()` brings the cursor back.
>
> **DO THIS:**
> ```jsx
> function handleAdd() {
>   setText('');
>   ~inputRef.current.focus()~; // The cursor goes back into the input field
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleAdd() {
>   ~setText('')~; // **WRONG:** empties the input field, but the cursor stays outside it
> }
> ```

The interview question specifies three tasks: focus, scroll, and measure. With a ref, all three operations follow an identical pattern. You read the DOM element from `current` and invoke a native browser method or property:

```jsx title="Three jobs, one shape: the element in current, then the browser's own method"
inputRef.current.~focus()~; // Focus: puts the cursor in the input field
imageRef.current.~scrollIntoView()~; // Scroll: scrolls until the picture is visible
setWidth(chartRef.current.~offsetWidth~); // Measure: reads the element's width in pixels
```

These calls invoke the exact same native browser methods used in plain JavaScript. React simply supplies the element reference via `current`. As the documentation states: "You can then access this DOM node from your event handlers and use the built-in browser APIs defined on it."

Many developers assume every screen update requires state. State governs declarative output: text strings, conditional elements, and CSS class names. In contrast, imperative browser behaviors like keyboard focus, scroll offset, and layout measurements must be commanded directly through the DOM node.

### What focus means

Focus directs keyboard input to a specific interactive element. The focused element receives all keystroke events by default, and browsers typically display a visual outline around it.

MDN documents the `focus()` method as setting focus on the specified element if it can receive focus. MDN notes that the outline provides a visible indication of the focused element.

### Why the cursor leaves the input field

No line in our component explicitly removed focus. Why does the cursor disappear after clicking Add?
1. While the user types John, the input element holds active focus.
2. When the user clicks the Add button, the browser transfers focus to that button element.
3. The `handleAdd` function runs, updating the guest list and clearing the text field. No code commands focus to return to the input.
4. When the user types Mary, keystrokes are ignored because no input element holds focus.

Browsers vary in how they highlight buttons after a click, but all browsers remove focus from the input field.

### The fix: one line at the end of `handleAdd`

```jsx title="src/components/GuestList.jsx" startLine="10" good="13"
  function handleAdd() {
    setGuests([...guests, { id: nextId++, name: text }]);
    setText('');
    ~inputRef.current.focus()~; // Puts the cursor back in the input field after every click on Add
  }
```

The user types John and clicks Add. John joins the list, the input field clears, and the cursor immediately returns to the input field:

```page width=text caption="After the click on Add, John is in the list and the cursor is back in the empty input field."
section: Lunch guests
form:
  field:  |  | good
  button: Add
line: John
console: quiet
```

The user immediately types Mary and clicks Add again. Both guests appear in the list without intermediate mouse clicks:

```page width=text caption="The user typed Mary without clicking the input field first, and clicked Add again."
section: Lunch guests
form:
  field:  |  | good
  button: Add
line: John
line: Mary
console: quiet
```

Notice the execution timing in `handleAdd`. Calling `setText('')` schedules a re-render for the next tick (Lesson 15), but it does not run synchronously. Calling `inputRef.current.focus()` on the immediate next line executes synchronously in the browser. Because the input element was already mounted to the DOM during the initial commit, `inputRef.current` references the live browser element. The browser shifts focus immediately. Moments later, React processes the scheduled state update and clears the input's displayed value.

### Scrolling to an element

The official documentation illustrates scrolling with an image carousel: a horizontal row of pictures that scrolls sideways. Each image attaches a ref, and a button scrolls to the target image:

```jsx title="Scrolling to the first picture, from the docs' carousel"
const firstCatRef = useRef(null);

function handleScrollToFirstCat() {
  firstCatRef.current.~scrollIntoView~({ behavior: 'smooth', block: 'nearest', inline: 'center' }); // Scrolls until this picture is in view
}

<img ~ref={firstCatRef}~ src="https://placecats.com/neo/300/200" alt="Neo" /> {/* React puts this <img> into firstCatRef.current */}
```

MDN defines `scrollIntoView()` as scrolling the element's ancestor containers until the element is visible to the user.

Invoking the method without arguments scrolls immediately. Passing options allows your code to request smooth animation and control alignment within the viewport.

### Measuring an element

A dynamic chart component often needs to measure the width of its rendering area. Layout geometry is determined by the browser engine, so you read it from the DOM element:

```jsx title="Measuring an element after a click"
const chartRef = useRef(null);
const [width, setWidth] = useState(0);

function handleMeasure() {
  ~setWidth(chartRef.current.offsetWidth)~; // Reads the width the browser laid out
}

return (
  <>
    <div ~ref={chartRef}~>Chart area</div> {/* React puts this <div> into chartRef.current */}
    <button onClick={handleMeasure}>Measure</button>
    <p>Width: {width}</p>
  </>
);
```

MDN specifies that `offsetWidth` returns the layout width of an element as an integer, including borders, padding, and vertical scrollbars.

Application code never writes to `offsetWidth`. The browser calculates layout dimensions automatically during rendering. The measured width is placed into state because the interface displays it, following the rule from Lesson 30 that visible data belongs in state.

The browser also provides `getBoundingClientRect()`. Both properties include padding and border dimensions. The difference lies in the returned data:
- `offsetWidth` returns a single rounded integer.
- `getBoundingClientRect()` returns an object containing floating-point dimensions and coordinates relative to the browser viewport.

### Changing state is not enough

A challenge in the official documentation illustrates this distinction with a video player component. The component stores `isPlaying` in state, and clicking a button toggles between Play and Pause.

When the user clicks Play, the button label updates to Pause, but video playback does not begin. The documentation notes: "toggling state is not enough."

Toggling state changes the button label because React renders the button. However, video playback is controlled by the browser `<video>` element. The `<video>` tag does not support a declarative `isPlaying` attribute. The solution is attaching a ref to the video element and invoking its native `.play()` or `.pause()` method directly inside the click handler.

---

## PRINCIPLE | A ref, not `getElementById`: each copy of the component reaches its own input

> [!PRINCIPLE]
> **Principle 3: One Ref per Copy: getElementById Searches the Whole Page**
>
> *`document.getElementById` searches the global document and returns the first element matching that ID, causing multi-instance components to target the wrong instance; a ref is scoped to a specific component instance, ensuring each list controls its own input.*
>
> When a component is rendered only once, an HTML ID and a ref target the same DOM element. When the component is reused, hardcoded IDs produce duplicate IDs in the DOM, and `getElementById` always returns the first instance. Each component instance creates its own isolated ref, which React populates with that specific instance's DOM node.
>
> **DO THIS:**
> ```jsx
> const inputRef = useRef(null);
> ~inputRef.current.focus()~; // The input of this copy of GuestList
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> document.~getElementById('guest-input')~.focus(); // **WRONG:** the first input on the page, even from the Dinner list
> ```

Plain JavaScript queries elements by assigning an ID and searching the document tree, as seen in Lesson 01. Consider both approaches:

```jsx title="Reaching the input field by its id, and through a ref"
<input ~id="guest-input"~ /> {/* With the id: one name for the whole page */}
document.~getElementById('guest-input')~.focus(); // Searches the whole page for that name

<input ~ref={inputRef}~ /> {/* With the ref: React puts this <input> into this copy's ref */}
~inputRef.current~.focus(); // Reads the ref of this copy of GuestList
```

When a component appears only once, both approaches locate the exact same input element. The architectural flaw appears as soon as the component is rendered multiple times.

### Two lists: Lunch and Dinner

Our application now manages two meal lists. The App component renders two guest lists and assigns each a `title` prop:

```jsx title="src/App.jsx"
import GuestList from './components/GuestList.jsx';

export default function App() {
  return (
    <main>
      ~<GuestList title="Lunch" />~ {/* The first copy of GuestList */}
      ~<GuestList title="Dinner" />~ {/* The second copy: its own state and its own ref */}
    </main>
  );
}
```

The guest list component reads `title` and displays it in the section heading:

```jsx title="src/components/GuestList.jsx" startLine="5"
export default function GuestList({ ~title~ }) { // Lunch or Dinner, from the tag in App
```

```jsx title="src/components/GuestList.jsx" startLine="18"
      ~<h2>{title} guests</h2>~ {/* Lunch guests or Dinner guests */}
```

```page width=text caption="The page with two guest lists, Lunch and Dinner, when it opens."
section: Lunch guests
form:
  field:  | 
  button: Add
section: Dinner guests
form:
  field:  | 
  button: Add
console: quiet
```

### The user adds a dinner guest, and the cursor jumps to the Lunch list

Now suppose the component attempts to reach the input field using a hardcoded ID:

```jsx title="src/components/GuestList.jsx" startLine="10" bad="13"
  function handleAdd() {
    setGuests([...guests, { id: nextId++, name: text }]);
    setText('');
    document.~getElementById('guest-input')~.focus(); // **WRONG:** searches the whole page
  }
```

```jsx title="src/components/GuestList.jsx" startLine="19" bad="19"
      <input ~id="guest-input"~ value={text} onChange={e => setText(e.target.value)} /> {/* **WRONG:** every copy writes the same id */}
```

The user types Ana in the Dinner list and clicks Add. Ana joins the Dinner list. Then the user types the next guest, Ben:

```page width=text caption="After the click on Add in the Dinner list, the user types Ben, and the name lands in the input field of the Lunch list."
section: Lunch guests
form:
  field:  | Ben | bad
  button: Add
section: Dinner guests
form:
  field:  | 
  button: Add
line: Ana
console: quiet
```

Ben unexpectedly appears inside the Lunch list, even though the user was interacting with the Dinner list. Here is the chain of events:
1. Both instances of `GuestList` render identical JSX, creating two input elements with the identical ID `guest-input`.
2. Clicking Add in the Dinner list executes the Dinner component's click handler. Ana is added to Dinner because each instance maintains isolated state (Lesson 12).
3. The method `document.getElementById` searches the global document from top to bottom and returns the first matching element: the input inside Lunch.
4. The call to `focus()` places the cursor into the Lunch input field, directing subsequent typing into the wrong list.

MDN documents this behavior: "If two or more elements in a document have the same ID, this method returns the first element found." React prints no warning for duplicate IDs, allowing this defect to pass unnoticed in console logs. The browser Elements tree reveals duplicate IDs on the page:

```dom caption="The Elements panel with two lists: two inputs with the same id, and getElementById always finds the first one."
<main>
  <section>
    <h2>Lunch guests</h2>
!   <input id="guest-input" value="Ben"> | note: The first input with this id, found every time
    <button>Add</button>
    <ul></ul>
  </section>
  <section>
    <h2>Dinner guests</h2>
!   <input id="guest-input" value=""> | note: The same id again, never found
    <button>Add</button>
    <ul>
      <li>Ana</li>
    </ul>
  </section>
</main>
```

### Each copy fills its own ref

Switching back to refs eliminates the issue completely. Each instance of `GuestList` invokes `useRef` independently, obtaining its own ref container (Lesson 30). React assigns each instance's input DOM node to that instance's ref.

When the user clicks Add in the Dinner list, the Dinner click handler accesses the Dinner instance's `inputRef`, returning focus to the Dinner input field:

```page width=text caption="With the ref, the click on Add in the Dinner list puts the cursor back in the input field of the Dinner list."
section: Lunch guests
form:
  field:  | 
  button: Add
section: Dinner guests
form:
  field:  |  | good
  button: Add
line: Ana
console: quiet
```

An input field still requires an ID when associating an accessible `<label>` using `htmlFor`. For accessible labeling, the documentation recommends `useId` to generate unique, clash-free IDs across instances (Lesson 52). For programmatic element access in code, refs remain the correct solution.

---

## PRINCIPLE | `inputRef.current` during rendering: it is still `null` on the first render

> [!PRINCIPLE]
> **Principle 4: Commit: inputRef.current Is null During the First Render**
>
> *React populates refs during the commit phase, meaning `ref.current` is `null` during the initial render, and reflects outdated DOM nodes during update renders; read DOM refs inside event handlers or Effects, never in the component render body.*
>
> A component executes its render body to calculate JSX blueprints before React touches the real DOM. Calling `inputRef.current.focus()` directly inside the component body encounters `null`, throwing an unhandled `TypeError` that causes React to unmount the entire page. Suppressing the error with optional chaining avoids the crash, but fails to focus the input on load.
>
> **DO THIS:**
> ```jsx
> function handleAdd() {
>   ~inputRef.current.focus()~; // After the click: the input field is on the page
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const inputRef = useRef(null);
> ~inputRef.current.focus()~; // **WRONG:** during rendering, current is null and the page goes blank
> ```

Calling `focus()` succeeds inside `handleAdd`. Moving that exact statement into the component function body causes the page to crash:

```jsx title="The same call to focus in the body of the component, and in the handler"
export default function GuestList({ title }) {
  const inputRef = useRef(null);
  ~inputRef.current.focus()~; // In the body: runs while React renders GuestList

  function handleAdd() {
    ~inputRef.current.focus()~; // In the handler: runs when the user clicks Add
  }
}
```

The handler executes when the user clicks, long after the commit phase has completed. The statement in the component body runs during rendering, before React has constructed the DOM node.

Remember what "during rendering" means (Lesson 30): it is the execution of the component function itself to compute JSX output. An event handler is declared inside the component, but its logic executes later during a browser event.

### The user opens the page, and it is blank

A developer might try to place the cursor inside the input field immediately on page load by calling `focus()` at the top level of the component:

```jsx title="src/components/GuestList.jsx" startLine="5" bad="9"
export default function GuestList({ title }) {
  const [text, setText] = useState('');
  const [guests, setGuests] = useState([]);
  const inputRef = useRef(null);
  ~inputRef.current.focus()~; // **WRONG:** runs during rendering, while current is still null
```

When the user visits the page, the screen renders completely blank, and the browser Console reports an unhandled exception:

```page width=text caption="With the call to focus in the body of GuestList, the page is blank when it opens."
blank
console: Uncaught TypeError: Cannot read properties of null (reading 'focus')
  warn: An error occurred in the <GuestList> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

Here is the exact sequence of events:
1. React invokes `GuestList` during the initial render pass.
2. The hook `useRef` returns the ref object initialized to `{ current: null }`.
3. The component body evaluates `inputRef.current.focus()` while the ref is still null.
4. JavaScript throws an unhandled `TypeError` before the component can return its JSX blueprint.
5. React unmounts the component tree. The official documentation states: "if your application throws an error during rendering, React will remove its UI from the screen."

The browser Elements tree shows an empty root container with all content removed:

```dom caption="The Elements panel after the error: the root div is empty."
! <div id="root"></div> | note: React removed everything inside it
```

The documentation explains why the component body is too early: "During the first render, the DOM nodes have not yet been created, so `ref.current` will be `null`. And during the rendering of updates, the DOM nodes haven't been updated yet. So it's too early to read them."

### What `inputRef.current` holds during each render

Logging the ref inside the component body illustrates what each render pass encounters:

```jsx title="src/components/GuestList.jsx" startLine="8"
  const inputRef = useRef(null);
  ~console.log(inputRef.current)~; // During rendering: what the ref holds before this commit
```

When the page loads, the Console logs `null` four times: two guest list instances, each invoked twice in development under StrictMode (Lesson 14). All four render invocations occur before the commit phase.

When the user adds John to Lunch, the Lunch instance re-renders twice and logs the input element. That element represents the DOM state from the previous commit, before the current update has completed.

```page width=text caption="The Console with a log in the body: null on the first render, the input element after the click on Add in the Lunch list."
section: Lunch guests
form:
  field:  |  | good
  button: Add
line: John
section: Dinner guests
form:
  field:  | 
  button: Add
log: null | GuestList.jsx:9
log: null | GuestList.jsx:9
log: null | GuestList.jsx:9
log: null | GuestList.jsx:9
log: <input value=""> | GuestList.jsx:9
log: <input value=""> | GuestList.jsx:9
```

The documentation outlines the commit phase lifecycle: "Before updating the DOM, React sets the affected `ref.current` values to `null`. After updating the DOM, React immediately sets them to the corresponding DOM nodes."

This reinforces the core rule from Lesson 30: do not read or write `ref.current` during rendering. During the render pass, the DOM element is either non-existent or about to change.

### Skipping the call does not focus the input

Attempting to prevent the crash using optional chaining avoids the runtime error, but fails to achieve the desired behavior:

```jsx title="src/components/GuestList.jsx" startLine="8" bad="9"
  const inputRef = useRef(null);
  inputRef.current~?.~focus(); // **WRONG:** no crash, but the first render still finds null, so nothing gets focus
```

The page renders without crashing, but the cursor does not appear in the input field. Because `inputRef.current` evaluates to `null` during the initial render, optional chaining silently skips the call at the exact moment focus was intended.

Focusing an input field upon mounting should be implemented using one of two standard approaches. The simplest solution is the declarative `autoFocus` prop:

```jsx title="Focusing the input field when it appears on the page"
<input ref={inputRef} ~autoFocus~ value={text} onChange={e => setText(e.target.value)} /> {/* React focuses the input on mount */}
```

The alternative approach uses an Effect, introduced in Lesson 32. The documentation notes: "If you want to do something with a ref, but there is no particular event to do it in, you might need an Effect." Because our application needs focus after user clicks, keeping the call inside `handleAdd` remains the correct pattern.

---

## PRINCIPLE | `ref.current`: focus, scroll, and measure, but never change what React drew

> [!PRINCIPLE]
> **Principle 5: Non-Destructive Actions: Never Change an Element That React Manages**
>
> *Use DOM refs exclusively for non-destructive operations like focusing, scrolling, and measuring; never manually modify, append, or remove DOM nodes managed by React, as direct mutations corrupt React's internal tree.*
>
> Calling `remove()` on a ref appears to remove an element just like a state update, for a single click. However, React remains unaware of the manual DOM removal. On the next state update, React attempts to reconcile the missing element and crashes. Manage UI content through declarative state, and reserve refs for interactions JSX cannot express.
>
> **DO THIS:**
> ```jsx
> <button onClick={() => ~setShow(!show)~}>Toggle with setState</button> {/* React removes the line itself */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <button onClick={() => ~ref.current.remove()~}>Remove from the DOM</button> {/* **WRONG:** React still counts the line as on the page */}
> ```

A ref grants direct access to the live DOM node, allowing code to invoke any native method, including methods that mutate or remove the element. The official documentation illustrates the danger of manual DOM mutations using a component with two buttons:

```jsx title="The docs' example: hiding a line through state, and removing it through a ref"
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button onClick={() => { ~setShow(!show)~; }}>Toggle with setState</button> {/* Changes state: React removes or adds the line */}
      <button onClick={() => { ~ref.current.remove()~; }}>Remove from the DOM</button> {/* Removes the line behind React's back */}
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
}
```

```page width=text caption="The docs' example when the page opens: two buttons and the line Hello world."
line: [Toggle with setState] [Remove from the DOM]
line: Hello world
console: quiet
```

The browser method `remove()` detaches an element from the document. Both buttons make the paragraph disappear, but only `setShow` notifies React of the change.

### The toggle that worked now crashes the page

The user clicks Toggle with setState several times, and the paragraph hides and appears without issue. Then:
1. With the paragraph visible, the user clicks Remove from the DOM. Native `remove()` detaches the paragraph from the browser tree.
2. React receives no notification of this mutation. The state variable `show` remains `true`, and React assumes the paragraph is still present.
3. The user clicks Toggle with setState. The state updates to `false`, and React attempts to remove its paragraph node from the DOM.
4. Because the node has already been removed from its parent, the browser engine throws an exception, crashing the component:

```page width=text caption="After Remove from the DOM, the next click on Toggle with setState crashes the page."
blank
console: Uncaught NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
  warn: An error occurred in the <p> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

The documentation explains the failure: "This is because you've changed the DOM, and React doesn't know how to continue managing it correctly."

React reconciles DOM nodes based on its internal virtual representation (Lesson 13). Manually modifying elements behind React's back desynchronizes the real DOM from React's internal model, causing subsequent reconciliation operations to fail.

### Read, focus, scroll, measure: these change nothing

The documentation terms elements constructed by React from JSX as "DOM nodes managed by React". The official rule states: "Avoid changing DOM nodes managed by React."

Modifying managed nodes includes altering their text, inserting child elements, or removing nodes directly. The documentation warns that manual changes lead to visual inconsistencies or runtime crashes.

Reading DOM properties, moving focus, adjusting scroll position, or querying layout measurements alters nothing that React manages. The documentation designates these safe operations as non-destructive: "If you stick to non-destructive actions like focusing and scrolling, you shouldn't encounter any problems."

Our guest list application strictly follows this standard. The ref is used only to invoke `focus()`, while all list modifications are handled declaratively through `setGuests`.

The documentation notes one safe exception: "You can safely modify parts of the DOM that React has *no reason* to update." For example, if a `<div>` is always empty in JSX, React never updates its child list. Mounting a third-party non-React plugin inside that empty container is safe.

---

## All 5 Principles Together

### The complete files

The entry file mounts the root component inside StrictMode:

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

The App component renders two independent guest list instances:

```jsx title="src/App.jsx"
import GuestList from './components/GuestList.jsx';

export default function App() {
  return (
    <main>
      ~<GuestList title="Lunch" />~ {/* Principle 3: its own guests and its own inputRef */}
      ~<GuestList title="Dinner" />~ {/* Principle 3: its own guests and its own inputRef */}
    </main>
  );
}
```

The guest list component manages input text and guest records in state, and holds the input DOM element in a ref:

```jsx title="src/components/GuestList.jsx"
import { useState, useRef } from 'react';

let nextId = 0;

export default function GuestList({ title }) {
  const [text, setText] = useState('');
  const [guests, setGuests] = useState([]);
  const inputRef = ~useRef(null)~; // Principles 1 and 4: null until the commit, then this copy's <input>

  function handleAdd() {
    setGuests([...guests, { id: nextId++, name: text }]); // Principle 5: the list changes through state
    setText('');
    ~inputRef.current.focus()~; // Principles 2 and 4: in the handler, the input field is on the page
  }

  return (
    <section>
      <h2>{title} guests</h2>
      <input ~ref={inputRef}~ value={text} onChange={e => setText(e.target.value)} /> {/* Principles 1 and 3: React puts this copy's <input> into inputRef.current */}
      <button onClick={handleAdd}>Add</button>
      <ul>
        {guests.map(guest => <li key={guest.id}>{guest.name}</li>)}
      </ul>
    </section>
  );
}
```

The user adds guests to both lists seamlessly, without needing manual clicks to refocus between entries:

```page width=text caption="The finished page: each click on Add puts the cursor back in the input field of its own list."
section: Lunch guests
form:
  field:  | 
  button: Add
line: John
line: Mary
section: Dinner guests
form:
  field:  |  | good
  button: Add
line: Ana
line: Ben
console: quiet
```

### How React calls the components and fills the refs

When the application loads, React invokes the root component and then both guest list instances in JSX order. Each instance initializes its own `inputRef`, which remains `null` during rendering. During the commit phase, React creates both input DOM elements and assigns each to the ref of its respective instance:

```tree caption="The order in which React calls the components, and the input element that React puts into each copy's inputRef in the commit."
`App` [1. Called first] | **Root component** | Renders `<GuestList title="Lunch" />` and `<GuestList title="Dinner" />`
- +`GuestList` with `title` Lunch [2. Called second] | Its own **`inputRef`**, `null` during the render | After the commit: **the input of the Lunch list**
- +`GuestList` with `title` Dinner [3. Called third] | Its own **`inputRef`**, `null` during the render | After the commit: **the input of the Dinner list**
```

### How the code reaches the input field, and what the user sees

| How the code reaches the input field | What the user sees | Why |
| :--- | :--- | :--- |
| **No ref at all** | The cursor leaves the input field each time the user clicks Add | Focus belongs to the browser, and no state or JSX moves it |
| **`useRef` without the `ref` attribute** | The click throws a `TypeError`, and the cursor stays out | React never fills `current`, so it stays `null` |
| **`document.getElementById` with two lists** | Add in the Dinner list puts the cursor in the Lunch list | The search covers the whole page and returns the first input with that id |
| **The call to `focus` in the body** | The page is blank when it opens | During the first render, React has not created the input, so `current` is `null` |
| **`remove` on `ref.current`** | The next toggle crashes the page | React still counts the removed element as on the page |
| **`ref={inputRef}` and `focus` in `handleAdd`** | The cursor goes back into the input field of its own list | React fills each copy's ref in the commit, and the handler runs after it |

A ref allows your code to request: "When React creates this element, hand it to me." React assigns the DOM node to `inputRef.current` during the commit phase, providing direct access to native browser APIs inside event handlers.

---

## For the Interview

> **The Interview Question:** How do you reach a DOM node from React to focus it, scroll it, or measure it?

### How to Answer Clearly in 30 Seconds

"We reach a DOM node using a ref created with `useRef(null)` and attached to a built-in JSX tag via the `ref` attribute. React constructs user interfaces declaratively from JSX, but imperative browser interactions like moving focus, scrolling containers, or reading layout dimensions have no declarative JSX equivalent. During the commit phase, React assigns the created DOM element to `inputRef.current`. When the element unmounts, React sets `current` back to `null`. We then call native browser methods on `ref.current` inside event handlers. Three core rules ensure stability:
1. **Use a ref instead of document.getElementById**: global queries break component encapsulation and fail when multiple instances render, whereas refs are scoped to each instance.
2. **Never read DOM refs during rendering**: during render, `ref.current` is either `null` or outdated, so DOM refs must only be read in event handlers or Effects.
3. **Limit refs to non-destructive actions**: calling methods like `focus()` or `scrollIntoView()` is safe, but manually modifying or removing React-managed DOM nodes desynchronizes React's tree and crashes subsequent updates."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"How do you focus an edit field the moment it appears, for example after clicking an Edit button?"**
   Calling `focus()` immediately inside the click handler fails because the edit input has not been rendered or committed to the DOM yet. The state setter only schedules a future render, leaving `ref.current` at `null`. The simplest declarative approach is the `autoFocus` prop on `<input autoFocus />`, which prompts React to focus the element upon mounting. Alternatively, `useEffect` can focus the element after the commit phase completes (Lesson 32). If focus must occur synchronously within the click handler before the browser repaints, `flushSync` can force React to flush pending updates to the DOM immediately (Lesson 65).
2. **"Can you pass a ref to your own custom component, such as `<MyInput ref={inputRef} />`?"**
   By default, custom components do not expose refs to their internal DOM nodes. Passing `ref` to a custom component requires that component to forward the ref to an underlying built-in tag (Lesson 85). Alternatively, `useImperativeHandle` allows a child component to expose a restricted, customized interface, such as exposing only a `focus()` method, rather than exposing its entire DOM node (Lesson 50). This safeguards encapsulation and prevents parent components from performing unsafe DOM mutations.
3. **"How do you scroll to a newly added item in a dynamic list, and why does scrolling often lag behind by one item?"**
   Calling `useRef` inside a loop or `.map()` violates the Rules of Hooks, which require Hooks to be called at the top level of a component (Lesson 38). To track dynamic list elements, developers use a ref callback, storing node references in a JavaScript `Map` inside a single ref (Lessons 86 and 99). Scrolling lags behind by one item if `scrollIntoView()` is invoked in the click handler immediately after calling `setItems()`, because state updates do not update the DOM synchronously. Wrapping the state update in `flushSync` forces React to commit the new item to the DOM synchronously before the scroll method executes (Lesson 65).

```tree dir=right caption="Interview comparison: reaching the input by its id vs. through a ref."
`document.getElementById` vs. a ref in an interview
- !By its id [`document.getElementById`] | Searches **the whole page** | With two copies, returns **the first input** every time
- +Through a ref [`ref={inputRef}` `inputRef.current`] | React fills it **in the commit**, **one per copy** | Each copy reaches **its own input**, in the event handler
```
