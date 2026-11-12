# Lecture 20: Controlled Inputs: Letting State Decide What Every Box Shows
> INTERVIEW QUESTION | ❱ CORE | How do you make an input, textarea, or select fully controlled by React state?

---

## The Collision Between Native Browser Memory and React State Reconciliation

### Autonomous DOM State vs. Declarative Component State

With normal elements like `<p>` or `<h1>`, changing the screen is simple: you put a state variable inside the tag, update the state, and the screen updates.

```jsx title="State inside a normal tag"
const [text, setText] = useState('John');

<p>~{text}~</p> {/* Shows John, and shows Mia right after setText('Mia') */}
```

Form inputs like `<input>`, `<textarea>`, and `<select>` are different because the browser gives them their own private memory. When a user types into a plain HTML input, the browser updates the text on its own. Your React component cannot see what is inside the input while the user types, and cannot change or clear the input simply by updating state.

```jsx title="A plain input keeps its own text"
const [text, setText] = useState('John');

~<input />~ {/* The browser keeps what the user types: text never sees it, and setText('') cannot clear it */}
```

To make an input work like the rest of React, where changing state changes the screen, we make it a controlled input in two steps:

1. **Lock the input to state with `value`:** Writing `value={text}` tells the input to ignore its own browser memory and display only what is inside the `text` state variable. Now, whenever your code changes `text`, for example by calling `setText('')` when the user clicks Clear or Send, the input updates on screen immediately.
2. **Let keystrokes update state with `onChange`:** Once `value` is locked to `text`, typing on the keyboard will not change the input unless `text` itself changes. Adding `onChange` takes every keystroke the user types and saves it into `text`, so the input and the rest of your component update together on every letter.

```jsx title="A controlled input: value and onChange"
const [text, setText] = useState('John');

<input
  ~value~={text} // Shows only what text holds
  ~onChange~={e => setText(e.target.value)} // Saves every keystroke into text
/>
```

When an input has both `value` and `onChange`, React state is in complete control: the screen always shows state, and typing simply updates state.

```tree dir=right caption="The two steps that make an input controlled: value locks the input to state, and onChange lets typing reach state."
Two steps make an input controlled
- +Step 1: Lock the input to state [`value={text}`] | The input **shows only what `text` holds** | Setting `text` to empty **clears the input at once**
- +Step 2: Let typing reach state [`onChange`] | Every keystroke is **saved into `text`** | The input and the rest of the component **update together**
```

### What Is at Stake: The Split-Brain Form and The Frozen Input Trap

What is at stake is subtle interface desynchronization and catastrophic input lockup.

The form enters a split-brain desynchronization: after clicking Send, the character counter resets to 0 / 200 while the text box stubbornly keeps the user's message, or the input completely locks up and rejects every keystroke with a red console error.

1. **With `onChange` alone and no `value` from state: the split-brain desynchronization.** Typing updates state and the live character counter. But when the user clicks **Send**, our code resets state to an empty string. The counter drops to `0 / 200`, while the uncontrolled text box ignores the render and continues displaying the old text, leaving the interface in a contradictory state where subsequent submissions dispatch empty payloads.
2. **With `value` from state and no `onChange`: the frozen input trap.** When the user presses a key, the browser momentarily accepts the character, but nothing updates the backing state variable. After every single keystroke, React detects that the state prop remains unchanged and synchronously overwrites the DOM node back to the previous snapshot, silently suppressing typing and logging a red read-only console error.

### Unified Architecture: The Multi-Field Contact Us Application

In this lesson, we build a multi-field **Contact Us** form that applies this two-way synchronization loop across every native control type. The application incorporates a Name box, a Topic selector, a Message text area with a live character count, an Email me a reply checkbox, and a Send button. When the checkbox is ticked, an Email input appears dynamically. Here is the initial appearance of the complete interface:

```page width=text caption="The finished Contact Us form, as it looks when the page opens."
heading: Contact Us
form:
  field: Name |
  select: Topic | Delivery
  textarea: Message |
line: 0 / 200
form:
  check: Email me a reply | off
  submit: Send
```

The application is organized into four files, keeping the entire form inside a single component named `ContactForm`:

```files title="contact-page: File Explorer" caption="How the files of our contact page sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` and mounts it inside `<StrictMode>` into `#root`
  App.jsx | parent | Exports `App` as default and renders `<ContactForm />`
  components/
    ContactForm.jsx | default export | Exports `ContactForm` as default and holds every box and its state
```

The root `App` component mounts the form directly into the tree:

```jsx title="src/App.jsx"
import ContactForm from './components/ContactForm.jsx';

export default function App() {
  return ~<ContactForm />~; // React calls ContactForm, which holds the whole form
}
```

We start with only the Message text area and its live counter. Each principle introduces one more architectural piece until the entire form is fully controlled.

### The Five Architectural Invariants of Controlled Form Controls

**PRINCIPLES:** Five invariants govern how React controls text inputs, text areas, dropdown menus, and checkboxes:
1. **Synthetic Event Capture with onChange:** Continuous event routing pipes every keystroke synchronously into state, driving live derived calculations like character counts.
2. **Bi-Directional Binding with value:** Seizing control of the native DOM node forces the input to mirror state on every render, allowing programmatic resets.
3. **The Mutability Contract:** Binding `value` without a synchronous `onChange` updater causes React to revert every keystroke and emit read-only console errors.
4. **Heterogeneous Control Semantics:** Distinct form controls require dedicated properties: `<select>` binds via container-level `value`, while checkboxes bind via boolean `checked` and `e.target.checked`.
5. **Lifecycle Type Immutability:** A controlled field must maintain a defined string from mount to unmount; passing `undefined` creates an uncontrolled input that illegally flips to controlled on the first keystroke.

Here is the architectural matrix of the five principles before we examine each one in detail:

| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |
| :--- | :--- | :--- | :--- |
| **Principle 1** | **`onChange` Sends Every Key into State** | A count or a greeting that never moves means the typed text never reached state. Interviewers also ask why React's `onChange` fires on every key. | Give the box `onChange`, and save the new text with the setter on every key. |
| **Principle 2** | **`value` Sends State Back into the Box** | A form that keeps its old text after Send, while the count says zero, is the most common form bug. | Give the box `value` from state, so the box always shows what state holds. |
| **Principle 3** | **`value` Without `onChange` Freezes the Box** | A box that refuses every letter looks broken, and the Console error explains why. | Every box with `value` also needs `onChange` that saves the new text right away. |
| **Principle 4** | **The Same Pair on a Menu and a Tick Box** | A tick box that will not untick, or a menu that ignores its starting choice, comes from the habits of plain HTML. | Put the chosen value on the menu itself. Give the tick box its tick from state, and read the tick back from the browser. |
| **Principle 5** | **A Controlled Box Starts with an Empty String** | A warning about a box changing from uncontrolled to controlled appears on the first key, and confuses many developers. | Start the state behind every box with an empty string, never with nothing. |

---

## 1. Principle 1: Synthetic Event Capture: Routing Keystrokes into State with onChange

### Unidirectional Data Flow: Capturing Keystrokes with Synthetic Events

React normalizes form input events into continuous synthetic updates: `onChange` fires on every single keystroke like native `input`, routing `e.target.value` synchronously into state to drive live derived UI calculations.

Start with a minimal page that contains only a Name box and an accompanying greeting line. When the page opens, the box is empty and the greeting displays only Hello:

```page width=text caption="A Name box and a greeting, when the page opens."
form:
  field: Name |
line: Hello,
```

To make the greeting follow what the user types, we attach an `onChange` prop to the input:

```jsx title="src/App.jsx"
import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('');

  return (
    <main>
      <label>
        Name
        <input ~onChange~={e => setName(e.target.value)} /> {/* React calls this arrow on every key */}
      </label>
      <p>Hello, {name}</p>
    </main>
  );
}
```

The user types J, and the greeting immediately says Hello, J. After four keystrokes, the interface updates smoothly:

```page width=text caption="The same page after the user types John: the greeting has followed every letter."
form:
  field: Name | John | good
line: Hello, John | good
```

React extracts typed characters using the event object passed to the handler callback.

Whenever `onChange` fires, React hands your function a synthetic event object, `e`. Inside that object, `e.target` references the native DOM input element that received the keystroke. The property `e.target.value` holds the full string inside that box right now, with the newly pressed letter already present:

1. **Pressing J:** The browser inserts J into the text box, React triggers `onChange`, and `e.target.value` evaluates to `'J'`.
2. **Pressing o:** The browser appends o to the text box, React triggers `onChange` again, and `e.target.value` evaluates to `'Jo'`.

Our handler passes that string directly to `setName`, updating the greeting on every letter. Think of a student who calls out each letter to the teacher while writing a word on paper. The teacher hears every letter as it is written, not only the finished word.

### Real-Time Derived State: Synchronizing Dynamic Counters with Keystrokes

Now we build the first section of our Contact Us form: a heading, a Message text area, and the character count below it:

```jsx title="src/components/ContactForm.jsx"
import { useState } from 'react';

export default function ContactForm() {
  const [message, setMessage] = useState('');

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  return (
    <section>
      <h1>Contact Us</h1>
      <form>
        <label>
          Message
          <textarea ~onChange={handleMessageChange}~ /> {/* React calls the handler on every key */}
        </label>
        <p>{message.length} / 200</p>
      </form>
    </section>
  );
}
```

Every string in JavaScript provides a `.length` property that measures its character count. When the page opens, `message` is empty, so the count renders at zero:

```page width=text caption="The first version of the Contact Us form, when the page opens."
heading: Contact Us
form:
  textarea: Message |
line: 0 / 200
```

The user types Where is my parcel?, and the count increments synchronously with every keypress:

```page width=text caption="The same form after the user types Where is my parcel? into the Message box."
heading: Contact Us
form:
  textarea: Message | Where is my parcel?
line: 19 / 200 | good
```

**Browser DOM input precedes React event dispatch: the browser inserts the keystroke into the text box first, so by the time React's `onChange` callback executes, `e.target.value` already reflects the newly typed character.**

1. The user strikes a physical key on the keyboard.
2. The browser inserts the character into the `<textarea>` DOM node buffer.
3. React fires the synthetic `onChange` event, calling `handleMessageChange`.
4. The handler reads `e.target.value`, which already holds the expanded string, and routes it to `setMessage`.

Because the browser places the character into the element before dispatching the event, `e.target.value` never lags behind the user's keystrokes. Keep this browser-first sequence in mind, because Principles 2 and 3 build directly on top of it.

### Event Normalization: React's Keystroke onChange vs. The Browser's Blur-Fired change Event

In plain JavaScript, the name `onChange` can be deceptive because native web standards and React use the word change for two distinct moments:

1. **The browser's native `change` event** stays quiet while the user types and fires only when the user clicks outside the box or blurs the input. It is designed to report once after the user finishes editing.
2. **React's synthetic `onChange` prop** fires on every single keystroke, normalizing the behavior to match the browser's native `input` event. React wired `onChange` to behave like `input` so your state stays continuously synchronized while typing.

Here are the two plain JavaScript listeners side by side:

```js title="page.js"
messageBox.addEventListener(~'change'~, e => console.log(e.target.value)); // Runs only when the user leaves the box
messageBox.addEventListener(~'input'~, e => console.log(e.target.value)); // Runs on every key
```

React also accepts `onInput`, which does the exact same job as `onChange`. As the React documentation notes, "For historical reasons, in React it is idiomatic to use `onChange` instead which works similarly."

### The Ephemeral Memory Trap: Storing Keystrokes in Plain Variables Bypasses Reconciliation

**The screen displays a desynchronized UI: the text box accepts keystrokes directly through browser DOM memory, but the character count remains frozen at 0 / 200 because assigning to a local variable triggers zero re-renders.**

When storing user input, a plain local variable and React state operate under fundamentally incompatible mechanics:

1. **A plain local variable** exists only during the function execution of the current render. Mutating it never requests a re-render from React, and the variable resets to its starting value on the next render pass anyway.
2. **React component state** persists outside the function across renders, and invoking its setter tells React to re-render the component tree with the new string.

Suppose a developer attempts to store `message` in a plain variable instead of state:

```jsx title="src/components/ContactForm.jsx" bad="2,5"
export default function ContactForm() {
  let message = '';

  function handleMessageChange(e) {
    ~message~ = e.target.value; // **WRONG:** changes a plain variable, so React never renders again
  }

  return (
    <section>
      <h1>Contact Us</h1>
      <form>
        <label>
          Message
          <textarea onChange={handleMessageChange} />
        </label>
        <p>{message.length} / 200</p>
      </form>
    </section>
  );
}
```

The user types Hi into the Message box. The text box shows Hi, but the counter remains frozen at zero:

```page width=text caption="The contact form with a plain variable, after the user types Hi."
heading: Contact Us
form:
  textarea: Message | Hi
line: 0 / 200 | bad
```

With a plain variable, the box and the counter split into two separate realities. The browser draws Hi inside the text area on its own as the user types, without involving React. The counter, however, is calculated by React, and because assigning to `message` never triggers a re-render, React never redraws the counter.

Switching `message` to state and calling `setMessage` in the handler restores synchronization:

```jsx title="src/components/ContactForm.jsx" good="4,7"
import { useState } from 'react';

export default function ContactForm() {
  const [message, setMessage] = useState('');

  function handleMessageChange(e) {
    ~setMessage~(e.target.value); // Saves the text and asks React to render again
  }
```

Now every keystroke updates state and re-renders the counter immediately.

### The Snapshot Disparity: Reading e.target.value vs. Stale State Closures

**State updates are asynchronous snapshots: calling `setMessage` schedules a future render, so referencing the current state variable inside `onChange` returns the stale value from the previous render rather than the freshly typed character.**

Inside `handleMessageChange`, two locations hold text, and they do not evaluate to the same string:

1. **`e.target.value`** reads the live DOM node in the browser right now, which already includes the character the user just typed.
2. **`message`** represents the immutable state snapshot from the render pass that created this handler (as seen in Lesson 15). Calling `setMessage` schedules the next render pass; it does not mutate `message` inside the currently executing function.

If a developer logs `message` directly inside `handleMessageChange`, the console prints the text from one keystroke behind:

```jsx title="src/components/ContactForm.jsx" startLine="6"
  function handleMessageChange(e) {
    console.log(~message~); // Shows the text from before this key
    setMessage(e.target.value);
  }
```

When the box contains Wher and the user types e, the input on screen already shows Where, `e.target.value` evaluates to Where, and the Console logs Wher. Whenever your handler logic requires the newest text, always read `e.target.value` rather than the state variable.

> [!PRINCIPLE]
> **Principle 1: Synthetic Event Capture: Routing Keystrokes into State with onChange**
>
> *When the page must react to what the user types, give the box `onChange` and save `e.target.value` with the setter.*
>
> The count must move while the user types, so the text must reach state on every key. React's `onChange` is not the browser's `change` event. It fires on every key, like the browser's `input` event. Because the browser puts the new letter into the box before React calls the handler, `e.target.value` already holds the whole text with the new letter. Meanwhile, the state variable still holds the previous render's text. A plain variable cannot do this job, because changing it never makes React render again.
>
> **DO THIS:**
> ```jsx
> const [message, setMessage] = useState('');
> <textarea ~onChange~={e => setMessage(e.target.value)} /> {/* Saves the whole text on every key */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> let message = '';
> <textarea onChange={e => { ~message~ = e.target.value; }} /> {/* **WRONG:** a plain variable never makes React render again */}
> ```

---

## 2. Principle 2: Bi-Directional Binding: Overriding Browser Memory with value

### State Mirroring vs. Initial Seeding: value Locks the DOM, defaultValue Disconnects

Binding `value` strips the native DOM element of autonomous memory: React overrides internal browser buffers after every render, transforming the text box into a passive visual mirror of component state.

React provides two distinct props for managing input text, each fulfilling a different lifecycle contract:

1. **`defaultValue` sets only the starting text** when the input first mounts. Once the element is drawn on screen, its connection to React state ends. The browser maintains its own internal buffer as the user types, and later updates to state never overwrite the text box again.
2. **`value` binds the input element to current state** on every single render. Paired with `onChange`, it creates a continuous two-way loop:
   - It displays the input initially using the defined state value.
   - It updates the display of the input whenever state changes programmatically.
   - It routes user edits back into state through `onChange`, ensuring the screen and state never diverge.

Now add a Clear button that invokes `setName('')` to the Name page from Principle 1. Look at what occurs when we test each prop, type John, and click Clear:

::: row caption="The same name page with two different props on the box, after the user types John and clicks Clear."
::: col title="defaultValue on the box" tag="box keeps John" tone=bad
```jsx title="src/App.jsx" startLine="10"
<input ~defaultValue=""~ onChange={e => setName(e.target.value)} /> {/* Sets only the starting text */}
```
```page size=mini
form:
  field: Name | John | bad
line: Hello,
form:
  button: Clear
```
The greeting says only Hello, but the box still shows John.
:::
::: col title="value on the box" tag="box empties" tone=good
```jsx title="src/App.jsx" startLine="10"
<input ~value={name}~ onChange={e => setName(e.target.value)} /> {/* Shows whatever name holds */}
```
```page size=mini
form:
  field: Name | | good
line: Hello,
form:
  button: Clear
```
The greeting says only Hello, and the box is empty.
:::
:::

1. **With `defaultValue`, the text box and component state live two separate lives.** They meet only once, when the page mounts, and then separate. The browser maintains John inside its internal DOM buffer, while React holds John in `name`. When the Clear button wipes `name`, React clears the greeting paragraph because that text reads directly from JSX. But the input node is no longer listening to React, so John remains visible in the box.
2. **With `value`, the text box has no separate life of its own.** It acts as a live mirror of `name`. The element cannot preserve autonomous state; it reflects whatever `name` holds at the present moment. The instant the Clear button wipes `name`, the mirror empties too, resetting the input and the greeting in lockstep.

### DOM Semantics Divergence: Why HTML's value Attribute Maps to React's defaultValue

In plain HTML, the name `defaultValue` does not exist. You write `<input value="John">`, where John serves strictly as the initial starting text. A user can type over it, while the attribute visible in the browser Elements panel continues to say John. Native browsers maintain two separate properties: the initial seed, which is what the `value` attribute configures, and the live text currently inside the element, accessible via the DOM property `input.value`. The browser even exposes the initial seed as `input.defaultValue`.

React keeps these same two concepts separate, but it renames them. What HTML calls the `value` attribute, React names **`defaultValue`**. React reserves the prop name **`value`** for the second concept: the live text that must appear in the box right now. The exact same markup, `<input value="John">`, carries two contrasting meanings. In an HTML file, it defines the starting seed. In JSX, it instructs React to force the DOM node to display John after every render.

This divergence explains the Clear button behavior. With `defaultValue`, our component configured only the initial mount-time seed. When clicking Clear caused `setName` to empty `name`, our code declared nothing about the live DOM property, so the browser preserved John. With `value={name}`, our component describes the live state of the box on every render. When `name` becomes empty, React actively resets the DOM node.

Think of a student's private notebook. On the first day of class, the teacher writes a prompt on page one. That is `defaultValue`. After that, the student writes freely, and the teacher cannot erase text from the front of the room. An input without `value` is called an **uncontrolled** input, because it governs its own content. An input backed by `value` from state and `onChange` to state is a **controlled** input. As the React documentation specifies, "React will force the input to always have the `value` you passed."

### The Synchronous Update Loop: Why Keystrokes Persist Despite State Enslavement

**Continuous typing succeeds because state re-renders synchronously confirm browser input: each keystroke fires `onChange`, state updates to the new string, and React renders the input with a `value` matching what the browser just displayed.**

1. The user presses a key, and the browser displays the character in the box.
2. React calls `onChange`, and `setName` saves the expanded string in state.
3. React renders the component again, passing that new string to `value={name}`.
4. React writes that matching string into the DOM node, confirming the character so it remains visible.

### The Zombie Content Bug: Clearing State Fails to Clear defaultValue Fields

**The application falls into an asynchronous state ghosting bug: clicking Send resets state and clears the character counter to 0 / 200, but the text box stubbornly retains the previous message on screen, causing subsequent submissions to dispatch empty payloads.**

Now we add a Send button to our Contact Us form. When the user submits the form, `handleSend` logs `message` and resets the state so the form can accept the next entry:

```jsx title="src/components/ContactForm.jsx" startLine="10"
  function handleSend(e) {
    e.preventDefault();
    console.log('Sent:', message);
    ~setMessage('')~; // Empties the state after sending
  }
```

If a developer places `defaultValue=""` on the Message text area instead of `value={message}`, the DOM element and component state desynchronize:

```jsx title="src/components/ContactForm.jsx" startLine="16" bad="7"
  return (
    <section>
      <h1>Contact Us</h1>
      <form onSubmit={handleSend}>
        <label>
          Message
          <textarea ~defaultValue=""~ onChange={handleMessageChange} /> {/* **WRONG:** starting text only, so Send cannot empty the box */}
        </label>
        <p>{message.length} / 200</p>
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
```

While the user types Where is my parcel?, `onChange` updates `message` and the counter reaches 19 / 200. The moment the user clicks Send, `setMessage` wipes `message` to an empty string. The counter belongs to React, so it drops to 0 / 200, while the uncontrolled Message text area ignores the render and keeps Where is my parcel? visible on screen:

```page width=text caption="The contact form with defaultValue, after the user types Where is my parcel? and clicks Send."
heading: Contact Us
form:
  textarea: Message | Where is my parcel? | bad
line: 0 / 200 | bad
form:
  submit: Send
log: Sent: Where is my parcel? | ContactForm.jsx:12
```

Now `message` in state is empty while the text area still displays the previous question. If the user clicks Send a second time without typing anything, the Console logs an empty message while Where is my parcel? remains visible in the box:

```page width=text caption="The same form after the user clicks Send a second time without typing anything."
heading: Contact Us
form:
  textarea: Message | Where is my parcel? | bad
line: 0 / 200 | bad
form:
  submit: Send
log: Sent: Where is my parcel? | ContactForm.jsx:12
log: Sent: | ContactForm.jsx:12
```

### Authoritative State Control: Enforcing a Single Source of Truth with value={message}

Replacing `defaultValue=""` with `value={message}` establishes state as the single authority over the DOM node:

```jsx title="src/components/ContactForm.jsx" startLine="20" good="3"
        <label>
          Message
          <textarea ~value={message}~ onChange={handleMessageChange} /> {/* The box always shows what message holds */}
        </label>
```

Now when the user types Where is my parcel? and clicks Send, the text area and the character counter clear together:

```page width=text caption="The contact form with value, after the user types Where is my parcel? and clicks Send."
heading: Contact Us
form:
  textarea: Message | | good
line: 0 / 200 | good
form:
  submit: Send
log: Sent: Where is my parcel? | ContactForm.jsx:12
```

Our interface renders the message in two places: inside the Message box and in the character count below it. Think of a train station with one master clock. Every platform screen mirrors that central clock, and when the master clock advances, every screen updates in unison. No station worker visits individual platforms to update screens by hand.

In our component, `message` acts as that master clock, while the text area and the counter function as display screens. Developers describe this architecture as a **single source of truth**: one state variable holds the authoritative data, and every UI element mirrors it. Notice that the Message box in Principle 1 had `onChange` and was still uncontrolled. `onChange` only reports keystrokes to state; only `value` locks the DOM node to state.

In plain HTML, developers write starting content between opening and closing text area tags. In React, placing children between `<textarea>` tags triggers a red Console error. A text area accepts `value` or `defaultValue`, matching the API of an input.

> [!PRINCIPLE]
> **Principle 2: Bi-Directional Binding: Overriding Browser Memory with value**
>
> *When our code must change what the box shows, such as emptying it after Send, give the box `value` from state.*
>
> A box without `value` keeps its own text. `defaultValue` only sets the starting text, so after Send the count says zero while the old message stays in the box. With `value={message}`, React writes the state into the box after every render. Then emptying `message` empties the box too, and state becomes the single source of truth.
>
> **DO THIS:**
> ```jsx
> <textarea ~value={message}~ onChange={e => setMessage(e.target.value)} /> {/* Setting message to an empty string now empties the box */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <textarea ~defaultValue=""~ onChange={e => setMessage(e.target.value)} /> {/* **WRONG:** starting text only, so the box keeps its text after Send */}
> ```

---

## 3. Principle 3: Mutability Contract: value Without onChange Freezes the DOM

### The Invariant Trio: Controlled Editable, Inadvertent Read-Only, and Intentional readOnly

A controlled `value` binding establishes a strict mutability contract: if the component does not synchronously update state in response to user input, React's reconciler forces the DOM node back to the previous snapshot, silently suppressing typing and logging a read-only console error.

When you pass `value` to an input, you designate React state as its sole source of truth. The element is no longer permitted to retain independent text; after every keystroke, React inspects `value` and forces the DOM node to match it. That creates three distinct configurations depending on what you combine with `value`:

1. **`value` paired with `onChange`** creates a mutable controlled input. Every keystroke updates state synchronously through the handler, prompting React to re-render the input with the updated text.
2. **`value` provided without `onChange`** freezes the input inadvertently. Because no handler updates state on keystroke, state remains unchanged. The browser momentarily accepts the character, but React immediately overwrites the input with the unchanged state and emits a red Console error.
3. **`value` paired with `readOnly`** freezes the input intentionally. The browser locks the field at the hardware input layer, preventing user typing entirely. React silences the Console error because you explicitly declared that the field is display-only.

Look at a Name box configured with `value={name}` holding John, and no `onChange`. When the page mounts, the box shows John, and the Console immediately flags the read-only error:

```page width=text caption="A Name box with value and no onChange, when the page opens."
form:
  field: Name | John
console: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
```

Here is the component that triggered that error:

```jsx title="src/App.jsx"
import { useState } from 'react';

export default function App() {
  const [name, setName] = useState('John');

  return (
    <label>
      Name
      <input ~value={name}~ /> {/* **WRONG:** value without onChange */}
    </label>
  );
}
```

When the user clicks at the end of the input and types ny, the box continues to display John:

```page width=text caption="The same page after the user types ny into the Name box."
form:
  field: Name | John | bad
console: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
```

**React enforces immutability via post-render DOM overwrite: the browser accepts the keystroke momentarily, but React detects that the state prop remains unchanged and synchronously reverts the DOM value back to the previous snapshot.**

1. The browser inserts n into the input element, briefly displaying Johnn.
2. Because the element lacks an `onChange` prop, no handler executes and `name` remains John.
3. React detects that the DOM element's live value diverges from `value={name}` and immediately rewrites John back into the box.

Remember the classroom whiteboard metaphor. A student calls out a letter, but the teacher is not listening, so the board never records the change. React's error message outlines the three available resolutions:

1. Add `onChange` if the controlled input should accept user typing.
2. Switch `value` to `defaultValue` if you intended only an initial starting value on an uncontrolled field.
3. Add `readOnly` if the field is intentionally immutable.

### The Accidental Lockdown: Omitting onChange on State-Backed Inputs

**The input renders completely unresponsive: the user types into the Name box, but React immediately reverts every keystroke and floods the developer console with read-only field warnings.**

Now we add a Name box above the message in our Contact Us form, giving it dedicated state:

```jsx title="src/components/ContactForm.jsx" startLine="4"
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
```

In the JSX markup, a developer assigns `value={name}` so Send can clear it, but forgets to attach `onChange`:

```jsx title="src/components/ContactForm.jsx" startLine="20" bad="4"
      <form onSubmit={handleSend}>
        <label>
          Name
          <input ~value={name}~ /> {/* **WRONG:** no onChange, so every letter is put back */}
        </label>
```

Because `name` remains fixed at an empty string without an `onChange` updater, React reverts every keystroke when the user attempts to type Anna. The Console prints the read-only diagnostic:

```page width=text caption="The contact form after the user types Anna into a Name box that has no onChange."
heading: Contact Us
form:
  field: Name | | bad
  textarea: Message |
line: 0 / 200
form:
  submit: Send
console: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
```

Adding `onChange` to the Name input completes the two-way loop:

```jsx title="src/components/ContactForm.jsx" startLine="21" good="3"
        <label>
          Name
          <input value={name} ~onChange={e => setName(e.target.value)}~ /> {/* Each letter now reaches state */}
        </label>
```

When the user submits the form, `handleSend` now logs and clears `name` alongside the message:

```jsx title="src/components/ContactForm.jsx" startLine="11"
  function handleSend(e) {
    e.preventDefault();
    console.log('Sent:', name, message);
    ~setName('')~; // The Name box empties together with the message
    setMessage('');
  }
```

Now typing Anna succeeds character by character, and the Console remains quiet:

```page width=text caption="The contact form after the fix, when the user types Anna into the Name box."
heading: Contact Us
form:
  field: Name | Anna | good
  textarea: Message |
line: 0 / 200
form:
  submit: Send
console: quiet
```

### Programmatic Input Filtering: Exploiting Reconciliation Reversion for Character Limits

Because a controlled field retains only what state accepts, you can repurpose this reconciliation overwrite mechanism to reject unwanted input programmatically. To restrict our Message text area to a maximum of 200 characters, we invoke `setMessage` only when the input string is 200 characters or shorter:

```jsx title="src/components/ContactForm.jsx" startLine="7"
  function handleMessageChange(e) {
    ~if (e.target.value.length <= 200)~ { // Saves the text only while it fits
      setMessage(e.target.value);
    }
  }
```

**Skipping state setters weaponizes React's DOM overwrite mechanism: by bailing out of `setMessage` when input length exceeds 200, React automatically forces the DOM node back to the 200-character state snapshot.**

1. The browser inserts the 201st character into the `<textarea>` DOM buffer.
2. React executes `handleMessageChange`, which evaluates `e.target.value.length === 201` and skips `setMessage`.
3. Because `message` remains fixed at 200 characters, React's reconciliation pass immediately rewrites the 200-character snapshot back into the DOM node, causing the extra character to disappear.

### Execution Synchronization: Immediate Event Consumption vs. Delayed Caret Jumps

React verifies the DOM node against `value` immediately upon completion of your `onChange` callback. Two programming habits break text entry even when an event handler is attached:

1. **Delaying state updates inside asynchronous timers** leaves state unchanged when the handler finishes. React immediately reconciles the input back to the older state snapshot before the timer callback ever runs.
2. **Transforming strings synchronously during `onChange`**, such as calling `toUpperCase`, causes React to overwrite the DOM buffer with a string different from what the browser just inserted. When a user types a lowercase character into the middle of an existing word, this unexpected DOM replacement resets the cursor selection range, causing the caret to jump abruptly to the end of the input field.

Look at what occurs when a developer wraps `setName` inside a `setTimeout` call:

```jsx title="A Name box whose handler saves the text later"
function handleNameChange(e) {
  ~setTimeout~(() => setName(e.target.value), 100); // **WRONG:** the state waits, but React puts the old text back right away
}

<input value={name} onChange={handleNameChange} />
```

**Asynchronous state updates cause immediate input reversion: delaying `setName` inside a timer causes the handler to exit without updating state, prompting React to revert the typed character before the timer callback ever fires.**

1. The user presses a key, and the browser displays the character in the box.
2. The `handleNameChange` callback starts a 100-millisecond timer and returns immediately without updating `name`.
3. React observes that `name` did not change during handler execution and immediately writes the prior text back into the DOM element.

Always keep input handlers direct: persist `e.target.value` synchronously, or bypass the setter when rejecting an input.

> [!PRINCIPLE]
> **Principle 3: Mutability Contract: value Without onChange Freezes the DOM**
>
> *Every box with `value` also needs `onChange` that saves the new text right away.*
>
> With `value`, React writes the state into the box after every key. If no handler saves the new letter, state never changes, so React puts the old text back, and the Console shows the read-only field error. The same happens when the handler waits inside a timer. Skipping the setter when the text is too long lets you use that same reset on purpose to enforce a character limit. A box that should stay frozen on purpose says so with `readOnly`.
>
> **DO THIS:**
> ```jsx
> <input value={name} ~onChange={e => setName(e.target.value)}~ /> {/* Each letter reaches state, so it stays */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <input ~value={name}~ /> {/* **WRONG:** no onChange, so React puts the old text back after every key */}
> ```

---

## 4. Principle 4: Heterogeneous Form Controls: Adapting Binding Semantics to Menus and Checkboxes

### Declarative Selection: Managing select via Container Value vs. Obsolete option.selected

Heterogeneous HTML form controls bind to distinct DOM properties: `<select>` menus bind declaratively via container-level `value` rather than child `option.selected`, while checkboxes represent binary states and bind via `checked` and `e.target.checked`.

In plain HTML, the initial active choice of a dropdown menu is configured statically by placing the `selected` attribute inside an individual `<option>`:

```jsx title="The plain HTML way"
<select>
  <option value="orange" ~selected~>Orange</option> {/* **WRONG:** static HTML attribute, not supported in React */}
  <option value="apple">Apple</option>
</select>
```

In React, `selected` is unsupported on `<option>` tags. Selection is managed declaratively on the parent `<select>` container using the `value` prop. If state variable `fruit` holds `'orange'`, the Orange option is displayed as selected:

```jsx title="The React way"
<select ~value={fruit}~ onChange={e => setFruit(e.target.value)}> {/* Matches the option whose value equals fruit */}
  <option value="orange">Orange</option>
  <option value="apple">Apple</option>
</select>
```

When the user selects an alternative item, `onChange` executes, and `e.target.value` delivers the value of the newly selected option to the setter.

### Boolean Control Semantics: Binding Checkboxes with checked and e.target.checked

A checkbox does not manage a text string. It models a binary boolean state, either ticked or unticked, `true` or `false`.

Because its state is a boolean, we control the element using `checked` instead of `value`. Inside the event callback, we read `e.target.checked`:

```jsx title="Controlling a tick box with boolean state"
<input
  type="checkbox"
  ~checked={agree}~ // Displays the tick from agree
  onChange={e => setAgree(~e.target.checked~)} // Reads the new true or false value
/>
```

When `agree` is `true`, the checkbox renders ticked. When `agree` is `false`, the box renders unticked. On every user click, `e.target.checked` delivers the updated boolean value.

Here is a minimal component pairing the Fruit menu and an Agree checkbox:

```page width=text caption="A fruit menu and an agree box, when the page opens."
form:
  select: Fruit | Orange
  check: I agree | off
```

Here is the implementation that manages both controls:

```jsx title="src/App.jsx"
import { useState } from 'react';

export default function App() {
  const [fruit, setFruit] = useState('orange');
  const [agree, setAgree] = useState(false);

  return (
    <form>
      <label>
        Fruit
        <select ~value={fruit}~ onChange={e => setFruit(e.target.value)}> {/* Controlled by the fruit string */}
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>
      <label>
        <input type="checkbox" ~checked={agree}~ onChange={e => setAgree(e.target.checked)} /> {/* Controlled by the agree boolean */}
        I agree
      </label>
    </form>
  );
}
```

When the user selects Banana and clicks I agree, both controls update their backing state and render the new choices:

```page width=text caption="The same page after the user picks Banana and ticks I agree."
form:
  select: Fruit | Banana | good
  check: I agree | on | good
```

For uncontrolled controls requiring only an initial mount-time selection, React provides `defaultValue` for `<select>` and `defaultChecked` for `<input type="checkbox">`.

### Dropdown Integration: Embedding the State-Driven Topic Selector

Now we integrate the Topic dropdown into our Contact Us form, initializing it to `'delivery'`:

```jsx title="src/components/ContactForm.jsx" startLine="4"
  const [name, setName] = useState('');
  const [topic, setTopic] = ~useState('delivery')~; // The menu starts on Delivery
  const [message, setMessage] = useState('');
```

We insert the `<select>` element between the Name input and the Message text area:

```jsx title="src/components/ContactForm.jsx"
        <label>
          Topic
          <select ~value={topic}~ onChange={e => setTopic(e.target.value)}> {/* Must match the value of one option */}
            <option value="delivery">Delivery</option>
            <option value="payment">Payment</option>
            <option value="other">Other</option>
          </select>
        </label>
```

When the user types Anna and selects Payment from the menu, `topic` updates to `'payment'` and the menu displays Payment:

```page width=text caption="The contact form after the user types Anna and picks Payment."
heading: Contact Us
form:
  field: Name | Anna
  select: Topic | Payment | good
  textarea: Message |
line: 0 / 200
form:
  submit: Send
```

### The Permanent Tick Trap: Reading e.target.value Binds the Checkbox to Constant "on"

**The checkbox falls into an irreversible toggle trap: clicking the box ticks it successfully, but clicking it a second time stubbornly refuses to untick the control because the browser reports a non-empty string that evaluates as truthy.**

Next, we add the Email me a reply checkbox, initializing it unticked with `false`:

```jsx title="src/components/ContactForm.jsx" startLine="7"
  const [wantsReply, setWantsReply] = useState(false);
```

If a developer inadvertently copies `e.target.value` from a text input handler into the checkbox handler, the checkbox locks into an active state after the first click:

```jsx title="src/components/ContactForm.jsx" bad="2"
        <label>
          <input type="checkbox" checked={wantsReply} onChange={e => setWantsReply(~e.target.value~)} /> {/* **WRONG:** reads a fixed string, not the tick */}
          Email me a reply
        </label>
```

Look at what occurs when the user clicks Email me a reply once to tick it, and then clicks it a second time attempting to untick it:

```page width=text caption="The contact form after the user ticks Email me a reply and then clicks it again to untick it."
heading: Contact Us
form:
  field: Name | Anna
  select: Topic | Payment
  textarea: Message |
line: 0 / 200
form:
  check: Email me a reply | on | bad
  submit: Send
```

**Native checkbox DOM elements default to a static string value: reading `e.target.value` yields `'on'`, which evaluates as truthy across all subsequent clicks and permanently traps `checked` in the active state.**

On an HTML checkbox without an explicit `value` attribute, `e.target.value` evaluates permanently to the string `'on'`. The first click passes `'on'` into `wantsReply`. Because `'on'` is a non-empty string, JavaScript evaluates it as truthy, rendering the box ticked. On the second click, the user clicks to untick the element, but `e.target.value` evaluates to `'on'` again. As a result, `wantsReply` remains `'on'`, and React immediately renders the tick mark back into the box.

Reading `e.target.checked` delivers the actual boolean truth value on every click:

```jsx title="src/components/ContactForm.jsx" good="2"
        <label>
          <input type="checkbox" checked={wantsReply} onChange={e => setWantsReply(~e.target.checked~)} /> {/* true or false, right after the click */}
          Email me a reply
        </label>
```

Now the checkbox ticks and unticks cleanly on every click, allowing `handleSend` to reset both controls to their starting baselines upon form submission:

```jsx title="src/components/ContactForm.jsx" startLine="15"
  function handleSend(e) {
    e.preventDefault();
    console.log('Sent:', name, topic, message, wantsReply);
    setName('');
    ~setTopic('delivery')~; // Back to the first option
    setMessage('');
    ~setWantsReply(false)~; // Back to unticked
  }
```

> [!PRINCIPLE]
> **Principle 4: Heterogeneous Form Controls: Adapting Binding Semantics to Menus and Checkboxes**
>
> *Control a menu with `value` on the `<select>` itself. Never put `selected` on an option. Control a tick box with `checked`, and read `e.target.checked` in its handler.*
>
> A menu reports the `value` of the picked option, so `value` on the select must match one option. Writing `selected` on an option is the plain HTML habit, and React does not support it. A tick box takes `checked` from state and reads `e.target.checked` in its handler. On a tick box, `e.target.value` is the fixed string `'on'`, which never changes with the tick.
>
> **DO THIS:**
> ```jsx
> <select ~value={topic}~ onChange={e => setTopic(e.target.value)}> {/* The choice lives on the select */}
> <input type="checkbox" checked={wantsReply} onChange={e => setWantsReply(~e.target.checked~)} /> {/* true or false, right after the click */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <option value="payment" ~selected~>Payment</option> {/* **WRONG:** not supported in React */}
> <input type="checkbox" checked={wantsReply} onChange={e => setWantsReply(~e.target.value~)} /> {/* **WRONG:** always 'on', so the box never unticks */}
> ```

---

## 5. Principle 5: Lifecycle Invariance: Preserving Defined Types from Mount to Unmount

### The Lifetime Immutability Contract: Initializing with Empty Strings vs. Undefined Traps

React form controls enforce strict lifetime type immutability: passing `value={undefined}` mounts an input as uncontrolled, and updating to a string on first keystroke illegally converts it to controlled mid-lifecycle, violating component invariants and emitting red console errors.

In React, an input must remain either uncontrolled or controlled throughout its entire lifecycle. It cannot mount as an uncontrolled DOM node and subsequently transition into a controlled input during a later render pass. Because of this architectural invariant, initializing `useState('')` with an empty string produces completely different behavior than initializing `useState()` with omitted arguments, even though both render as blank input fields initially:

1. **Initializing `useState('')` with an empty string** supplies a defined string prop on the initial render pass. React mounts the DOM element as controlled from inception, and subsequent keystrokes merely transition between defined string values.
2. **Invoking `useState()` with omitted arguments** initializes state to `undefined`. In JavaScript, absent function arguments evaluate to `undefined`. React interprets `value={undefined}` as equivalent to passing no `value` prop at all, creating the input element as uncontrolled at mount. When the user types a character, `onChange` updates state to a string, causing `value` to become defined. The input illegally mutates from uncontrolled to controlled mid-lifecycle, triggering a red Console diagnostic.

Think of a student's personal notebook that is suddenly declared a classroom whiteboard halfway through a lecture: nobody can determine who owns authority over the page.

Here is a City input whose state is initialized with no argument in `useState`. When the page mounts, the input is blank and the Console is quiet:

```page width=text caption="A City box whose state starts with nothing, when the page opens."
form:
  field: City |
console: quiet
```

Here is the implementation containing the empty `useState` invocation:

```jsx title="src/App.jsx"
import { useState } from 'react';

export default function App() {
  const [city, setCity] = ~useState()~; // **WRONG:** no starting value at all

  return (
    <label>
      City
      <input value={city} onChange={e => setCity(e.target.value)} />
    </label>
  );
}
```

The moment the user types the character a, `city` transitions from `undefined` to a string, and the Console emits the warning:

```page width=text caption="The same page after the user types a into the City box."
form:
  field: City | a
console: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components
```

**Omitting starting arguments initializes state to `undefined`, which React interprets as an uncontrolled input: passing `value={undefined}` treats the input as uncontrolled at mount, causing the first keystroke to illegally mutate the element into a controlled input and triggering a red console violation.**

1. When the component mounts, `city` evaluates to `undefined`, instructing React to construct the `<input>` DOM node as an uncontrolled element.
2. When the user types the character a, `onChange` executes and `setCity` persists the defined string `'a'` into state.
3. On the subsequent reconciliation pass, `value={city}` passes `'a'`, forcing the element to switch from uncontrolled to controlled mid-lifecycle and prompting React to issue the warning.

### The Uncontrolled-to-Controlled Warning: Deferred State Initialization Failures

**The console flags a severe architectural violation: the user types into the dynamically revealed Email box, and React instantly emits a red warning that an uncontrolled input has illegally mutated into a controlled input.**

Returning to our Contact Us form, when the user ticks Email me a reply, an Email input appears dynamically using the logical `&&` operator (as seen in Lesson 10):

```jsx title="src/components/ContactForm.jsx"
        {wantsReply && (
          <label>
            Email
            <input value={email} onChange={e => setEmail(e.target.value)} />
          </label>
        )}
```

Because the Email field is hidden until the user requests a reply, a developer might casually invoke `useState` without an initial argument:

```jsx title="src/components/ContactForm.jsx" startLine="8" bad="1"
  const [email, setEmail] = ~useState()~; // **WRONG:** undefined until the first key
```

The user ticks Email me a reply and types a into the newly revealed Email box. The input mounts with `value={undefined}` and flips to `'a'` on the first keypress, producing the Console violation:

```page width=text caption="The contact form after the user ticks Email me a reply and types a into the Email box."
heading: Contact Us
form:
  field: Name | Anna
  select: Topic | Payment
  textarea: Message |
line: 0 / 200
form:
  check: Email me a reply | on
  field: Email | a | bad
  submit: Send
console: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components
```

Initializing `email` with an empty string provides a defined string prop from the exact moment the Email input mounts:

```jsx title="src/components/ContactForm.jsx" startLine="8" good="1"
  const [email, setEmail] = ~useState('')~; // A real string from the first render
```

### Complete Form Teardown: Resetting State to Clean Defined Baselines

Now `handleSend` resets `email` alongside every other field in the form:

```jsx title="src/components/ContactForm.jsx" startLine="16"
  function handleSend(e) {
    e.preventDefault();
    console.log('Sent:', name, topic, message, wantsReply, email);
    setName('');
    setTopic('delivery');
    setMessage('');
    setWantsReply(false);
    ~setEmail('')~; // An empty string, never undefined
  }
```

Notice that `setEmail` resets state to an empty string, never `undefined` or `null`. Passing `undefined` or `null` during form clearance would violate the lifecycle contract in the opposite direction, mutating the element from controlled back to uncontrolled. A controlled text input must mount with an empty string and clear with an empty string.

> [!PRINCIPLE]
> **Principle 5: Lifecycle Invariance: Preserving Defined Types from Mount to Unmount**
>
> *The state behind `value` must hold a string from the first render, so start an empty box with an empty string in `useState`, never with nothing.*
>
> Calling `useState` with no argument gives `undefined`. Passing `undefined` to `value` is the same as giving the box no value at all, so the box starts uncontrolled. On the first key, state becomes a string, the box switches to controlled, and React warns because a box cannot switch over its life. An empty string makes the box controlled from the first render, and we clear it with an empty string too.
>
> **DO THIS:**
> ```jsx
> const [email, setEmail] = ~useState('')~; // Controlled from the first render
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const [email, setEmail] = ~useState()~; // **WRONG:** undefined first, a string later, so React warns
> ```

---

## Architectural Synthesis: The Complete Controlled Form Lifecycle

### The Unified ContactForm.jsx Architecture

Here is the finished form. Every control derives its visible state directly from component state, and every control dispatches user updates back into state:

```jsx title="src/components/ContactForm.jsx"
import { useState } from 'react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('delivery');
  const [message, setMessage] = useState('');
  const [wantsReply, setWantsReply] = useState(false);
  const [email, setEmail] = ~useState('')~; // 5. Starts with a string, never undefined

  function handleMessageChange(e) {
    if (e.target.value.length <= 200) {
      setMessage(e.target.value);
    }
  }

  function handleSend(e) {
    e.preventDefault();
    console.log('Sent:', name, topic, message, wantsReply, email);
    setName('');
    setTopic('delivery');
    setMessage('');
    setWantsReply(false);
    setEmail('');
  }

  return (
    <section>
      <h1>Contact Us</h1>
      <form onSubmit={handleSend}>
        <label>
          Name
          <input value={name} ~onChange={e => setName(e.target.value)}~ /> {/* 3. value always comes with onChange */}
        </label>
        <label>
          Topic
          <select ~value={topic}~ onChange={e => setTopic(e.target.value)}> {/* 4. The choice lives on the select */}
            <option value="delivery">Delivery</option>
            <option value="payment">Payment</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>
          Message
          <textarea ~value={message}~ onChange={handleMessageChange} /> {/* 2. State goes into the box */}
        </label>
        <p>{message.length} / 200</p>
        <label>
          <input type="checkbox" checked={wantsReply} onChange={e => setWantsReply(~e.target.checked~)} /> {/* 4. The tick, not the text */}
          Email me a reply
        </label>
        {wantsReply && (
          <label>
            Email
            <input value={email} ~onChange~={e => setEmail(e.target.value)} /> {/* 1. Every key goes into state */}
          </label>
        )}
        <button type="submit">Send</button>
      </form>
    </section>
  );
}
```

The user completes every field across the form:

```page width=text caption="The finished contact form after the user fills in every part, just before Send."
heading: Contact Us
form:
  field: Name | Anna
  select: Topic | Payment
  textarea: Message | Where is my parcel?
line: 19 / 200
form:
  check: Email me a reply | on
  field: Email | anna@example.com
  submit: Send
```

The user clicks Send. The Console outputs every field value, and the form resets cleanly to its initial state:

```page width=text caption="The finished contact form after the user clicks Send."
heading: Contact Us
form:
  field: Name | | good
  select: Topic | Delivery | good
  textarea: Message | | good
line: 0 / 200 | good
form:
  check: Email me a reply | off | good
  submit: Send
log: Sent: Anna payment Where is my parcel? true anna@example.com | ContactForm.jsx:18
```

### Execution Mechanics: Component Call Hierarchy and The Per-Keystroke Cycle

When the application mounts, React begins at `App` and traverses child tags. Because `App` renders only one child, React invokes `ContactForm` next:

```tree caption="The component tree of the contact page and the order in which React calls each component."
`main.jsx` mounts `App` inside `<StrictMode>`
- +`App` [1. Called first] | **Root component** | Returns `<ContactForm />`
  - +`ContactForm` [2. Called second] | Holds **five states**, one for each part of the form | Called again after **every key**, every pick, every tick, and every Send
```

Every controlled input executes the same cyclic lifecycle loop on every user keystroke:

```tree dir=right caption="The loop that one key runs in a controlled box, from the browser to state and back into the box."
One key in a controlled box
- +1. The browser | Shows the new letter in the box for a moment
- +2. `onChange` | React calls our handler with the event object
- +3. The setter [`setMessage`] | Saves the new text in **state**
- +4. React renders again | Writes the state into the box through **`value`** | The letter stays
```

### Comparative Paradigm Matrix: Browser DOM Habits vs. React Controlled Rules

| Aspect | The Plain JavaScript Habit | The React Rule |
| :--- | :--- | :--- |
| **Reporting each key** | Listen to the `change` event, which waits until the user leaves the box, or save the text in a plain variable | Use `onChange`, which fires on every key, and save `e.target.value` with the setter |
| **Emptying a box** | Reach into the box and clear its text by hand | Give the box `value` from state, then set the state to an empty string |
| **A box with a value** | Write the value and expect the user can still type | Always pair `value` with `onChange`, or use `defaultValue` or `readOnly` |
| **Menus and tick boxes** | Write `selected` on an option, and read `value` from a tick box | Put `value` on the select, and use `checked` with `e.target.checked` |
| **The starting value** | Leave a variable empty until it is needed | Start every controlled box with an empty string, never `undefined` |

---

## For the Interview

> **The Interview Question:** How do you make an input, textarea, or select fully controlled by React state?

### How to Answer Clearly in 30 Seconds

"A controlled field strips the DOM element of autonomous memory by binding `value` to state and capturing keystrokes via `onChange`. React's synthetic `onChange` event normalizes input handling to fire on every keystroke, matching the browser's native `input` event rather than the blur-bound `change` event. After every render, React reconciles the element and forces its DOM buffer to mirror state, establishing state as the single source of truth and enabling programmatic resets simply by updating state. Five invariants maintain this contract:
1. **`value` demands synchronous `onChange`.** Without a handler updating state immediately, React reverts the DOM buffer on every keystroke and emits read-only warnings.
2. **`defaultValue` is strictly uncontrolled.** It configures an initial seed at mount time, leaving subsequent buffer state under autonomous browser control.
3. **Dropdowns and checkboxes require dedicated properties.** A `<select>` binds via container-level `value`, never child `option.selected`. A checkbox binds via boolean `checked` and evaluates `e.target.checked`.
4. **Lifecycle type immutability is mandatory.** An input cannot transition between uncontrolled and controlled; it must initialize with a defined string, never `undefined`.
5. **Event consumption must be immediate.** Delaying updates inside timers or transforming characters mid-flight causes keystroke reversion and cursor selection jumps."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"What is the difference between a controlled and an uncontrolled input, and when would you use each?"**
   A controlled input binds its DOM buffer directly to React state through `value` or `checked`, forcing the element to mirror state across every reconciliation pass. An uncontrolled input operates without a state binding; it accepts an optional starting seed via `defaultValue` or `defaultChecked`, after which the browser manages internal buffer state autonomously. Controlled inputs are necessary when the interface requires real-time data on every keystroke, such as live character limits, dynamic formatting, or instantaneous form validation, or when component logic must alter the field programmatically, such as clearing fields upon submission. Uncontrolled inputs are preferable when building simple static forms where values are read only once upon submission using the native `FormData` API (as seen in Lesson 40), reducing re-render overhead.

2. **"Why does my input's caret jump, or why does typing feel slow?"**
   A caret jumps when the input handler modifies the string asynchronously or replaces it with an unexpected value before React reconciles. Common causes include running `setTimeout` inside `onChange`, mutating strings synchronously, such as calling `toUpperCase` mid-word, or defining child components inline inside parent render functions (as seen in Lesson 04), which unmounts and remounts the entire DOM node on every render. Caret instability also occurs when an input's `key` changes dynamically (as seen in Lesson 25). Typing feels slow when an input's state lives high in a large component tree: every keystroke triggers re-rendering across heavy descendant trees. Moving the input state down into an isolated child component, or deferring non-urgent re-renders using `useDeferredValue` (as seen in Lesson 68), ensures keystrokes remain instantaneous.

3. **"How do you control a select, a checkbox, and a field whose value comes from an API?"**
   A `<select>` binds via container-level `value` matching one `<option>` value string, never using `selected` on child options. A multi-select accepts an array of strings. A checkbox manages boolean state using `checked={boolean}` and extracts updates through `e.target.checked`, because native checkbox DOM elements default `e.target.value` to the static string `'on'`. When controlling an input populated by an asynchronous API, the incoming payload is often `null` or `undefined` prior to network resolution. To satisfy lifecycle type immutability, always initialize state with an empty string or provide a nullish coalescing fallback directly on the element prop: `value={apiValue ?? ''}`. This guarantees the input mounts with a defined string and never violates the uncontrolled-to-controlled contract.
