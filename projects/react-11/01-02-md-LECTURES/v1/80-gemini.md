# Lecture 80: How a Contact Form Keeps Up When the Contact Changes

*(Why does a form keep showing the old contact after the user picks another one?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | How do you derive values during render, and when is adjusting state during render legal?

---

## VS | `const name = contact.name` vs. `useState(contact.name)`: both start with Taylor, only the `const` follows the new contact

> When a user selects a different contact, the parent passes the new contact data down as a prop. **React reads the initial value given to `useState` on the first render only, so a state copy stays frozen on the initial contact**. To keep the interface accurate, calculate values directly during render when possible, and reset the form state with a key when switching items.

Remember `useState('John')` from Lesson 12. The string `'John'` serves as the starting value. React reads this argument once when the component first appears on the screen. From then on, React manages the value in component memory, and only the setter function can update it. When using a fixed string like `'John'`, this behavior is ideal.

Problems arise when the initial state value comes from a prop. Consider two ways to read a name from a `contact` prop:

```jsx title="Two ways to get name from the contact prop"
const name = ~contact.name~; // 1. Plain JavaScript: our code reads the prop again on every render
const [name, setName] = ~useState(contact.name)~; // 2. React reads the prop on the first render only
```

When the page loads with Taylor as the active contact, both lines produce the same initial value. The screen displays Taylor in both cases.

**It may look the same, or work the same at first, but it is NOT the same thing!**
1. **With the `const` declaration**, your code relies on plain JavaScript. This line executes every time the component renders. When the parent component passes Alice, `name` evaluates to Alice on the very next render.
2. **With `useState`**, React reads the argument during the initial mount only. On later renders, React ignores that argument completely. When the parent passes Alice, React ignores Alice and returns the saved value Taylor.

```tree caption="A const reads the prop on every render, useState keeps the value of the first render."
Two ways to get `name` from the `contact` prop
- +Read during render [`const name = contact.name`] | Our code reads the prop **on every render** | After the parent passes Alice, `name` is **`'Alice'`**
- !A copy in state [`useState`] | React reads the prop **on the first render only** | After the parent passes Alice, `name` is **still `'Taylor'`**
```

The `const` variable updates whenever the prop changes. A value that your code computes during render from props or state is called a **derived** value. Initializing a state variable with a prop is called **mirroring props in state**.

**Why:** Picture a contacts application with two buttons, Taylor and Alice, and an editor form beneath them. If the form mirrors the contact name in state, clicking Alice leaves the form displaying Taylor. If the user clicks Save, Taylor overwrites Alice in the contact list without any console errors.

### The Words of This Lesson

Here are the words this lesson builds on. Three are reminders, and one is new:

> [!DEFINITION]
> **The starting value of useState.** [REVIEW] `useState('John')` provides the initial state value; React uses it on the first mount, stores it in memory, and only updates it when you call the setter (Lesson 12).

> [!DEFINITION]
> **State at a place in the tree.** [REVIEW] React preserves component state as long as the component renders at the same position in the tree; changing the `key` at that position causes React to unmount the old component, discard its state, and mount a new one (Lesson 25).

> [!DEFINITION]
> **A derived value.** [REVIEW] A derived value is a value calculated during render from data the component already possesses, such as combining a first and last name; it requires no state because the component recalculates it on every render pass (Lesson 22).

> [!DEFINITION]
> **Mirroring props in state.** [NEW] Mirroring props in state occurs when you initialize state with a prop value, like `useState(contact.name)`; because React ignores that prop on later renders, the state variable stays frozen with the initial value (Lesson 80).

### Where Readers Usually Go Wrong

Developers often assume that `useState(contact.name)` creates state that tracks the prop. React treats that argument strictly as the initial value for the first render. Once the component mounts, React ignores the prop and reads exclusively from stored state.

### Three Ways to Make the Form Follow the Contact

The React documentation provides three techniques to keep a form aligned with the selected contact. Each technique fits a specific situation:
1. **Derive it during render.** Read `contact.name` directly without state. This works for any value the user cannot edit, such as a static heading.
2. **Reset the form with a `key`.** Add `key={contact.id}` to the form tag. Every contact receives a fresh form instance with clean initial state. This works best when the entire form state belongs to one contact.
3. **Adjust state during render.** Keep the previous contact ID in state, and call setters during render when that ID changes. This handles rare cases where part of the state must reset while other values persist.

Many developers attempt a fourth approach: using an Effect to copy the prop into state (Lesson 34). This lesson examines that pattern alongside the recommended techniques to demonstrate why it harms performance.

```tree caption="The three ways the React docs give to make a form follow the selected contact, and the Effect they advise against."
Making the form follow the selected contact
- +1. Derive during render [`const title = contact.name`] | No state at all | Fits values the user **does not edit**, such as the heading
- +2. Reset with a `key` [`key={contact.id}`] | A new contact means **a new form with new state** | Fits a form whose **whole state** belongs to one contact
- +3. Adjust during render [`prevId`] | Set state during render **inside an if** | Fits the rare case where **only part** of the state must start over
- !An Effect that copies the prop [`useEffect`] | Fixes the field **one render late** | The form **renders twice** for each switch
```

### The Rule of Thumb: calculate it, or reset it with a `key`

**Ask one question about every value that comes from a prop: can your code calculate it directly? If yes, compute it during render without state. If the user types into the field, keep it in state and use a `key` to reset it for each contact.**

## SECTION | The Contact Editor

Our project is a contacts application. Two buttons sit at the top, labeled Taylor and Alice. Beneath them, an editor form displays a heading, a name input, and a Save button. When the page first loads, Taylor is selected:

```page width=text caption="The contact editor when the page opens: Taylor is selected, and the form edits Taylor."
line: [Taylor] [Alice]
heading: Editing Taylor
form:
  field: Name | Taylor
  button: Save
```

Now suppose the form mirrors `contact.name` in state for both the heading and the input. When the user clicks Alice, **the form still shows Taylor**. The heading displays Taylor, the input field retains Taylor, and the console shows no warnings:

```page width=text caption="After the user clicks Alice: the heading and the Name field still show Taylor."
line: [Taylor] [Alice]
heading: Editing Taylor
form:
  field: Name | Taylor | bad
  button: Save
console: quiet
```

The user clicks Save. The record for Alice now stores the name Taylor. Both buttons now read Taylor, and Alice disappears from the contact list:

```page width=text caption="After the user clicks Save: Alice's contact was saved with Taylor's name, so both buttons read Taylor."
line: [Taylor] [Taylor]
heading: Editing Taylor
form:
  field: Name | Taylor | bad
  button: Save
```

This illustrates the real danger of mirroring props in state. The form continues showing the old contact, and the next save operation overwrites the new contact with old data.

We work across four files. The HTML template and the main entry file remain standard Vite files. The entry file wraps the App component in Strict Mode, which matters when examining console output in Principles 3 and 5:

```files title="contact-editor: File Explorer" caption="Our project files: App holds the contacts and the selected ID, and EditContact edits one contact."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `App` into `#root` inside `StrictMode`
  App.jsx | parent | Holds `contacts` and `selectedId`, renders the two buttons and `EditContact`
  EditContact.jsx | default export | The heading, the Name field, and the Save button for one contact
```

The App component keeps two items in state: the list of contacts, and the ID of the selected contact. On every render, it finds the selected contact in the array and passes that object to the form. When the user clicks Save, the form calls `handleSave` with the updated contact:

```jsx title="src/App.jsx"
import { useState } from 'react';
import EditContact from './EditContact.jsx';

const initialContacts = [
  { id: 0, name: 'Taylor' },
  { id: 1, name: 'Alice' },
];

export default function App() {
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedId, setSelectedId] = useState(0);
  const contact = ~contacts.find(c => c.id === selectedId)~; // Taylor first, Alice after the user clicks Alice

  function handleSave(updatedContact) {
    setContacts(contacts.map(c => (c.id === updatedContact.id ? updatedContact : c)));
  }

  return (
    <main>
      {contacts.map(c => (
        <button key={c.id} onClick={() => setSelectedId(c.id)}>{c.name}</button>
      ))}
      <EditContact ~contact={contact}~ onSave={handleSave} /> {/* The same place in the tree for every contact */}
    </main>
  );
}
```

The `handleSave` function replaces the matching contact and preserves the remaining entries. The App component remains unchanged until Principle 4, which adds a key to the form tag. All other changes take place inside the EditContact component.

**PRINCIPLES:** React reads the value inside `useState` on the first render only, so copying a prop into state causes the copy to stop following the prop. Five principles follow:
1. **Principle 1: A copy in state keeps the first value.** Calling `useState(contact.name)` stores Taylor. When the user clicks Alice, React ignores the new prop.
2. **Principle 2: Derive what you can calculate.** The heading reads `contact.name` during render without state, so it displays Alice immediately after the click.
3. **Principle 3: An Effect fixes the copy one render late.** The Effect runs only after React has already rendered and committed the form with the old name.
4. **Principle 4: A `key` gives each contact a new form.** React treats Alice's form as a distinct component, so its state initializes from Alice on mount.
5. **Principle 5: A setter during render is legal inside an if.** The form remembers the previous ID and updates its state during render when the ID changes.

---

## PRINCIPLE | `useState(contact.name)`: the copy keeps the value of the first render

> [!PRINCIPLE]
> **Principle 1: Mirroring Props in State: The Copy Keeps the First Value**
>
> *When a component copies a prop into state with `useState(prop)`, the state holds the prop's value from the first render only; when the parent passes a new value, the state variable does not change.*
>
> React uses the value inside `useState` only when the component first appears. On every later render, React returns the value it stored. So a heading built from a copied prop keeps showing the first contact after the user picks another one. If you really want to ignore later values, say so in the prop's name: `initialName` or `defaultName`.
>
> **DO THIS:**
> ```jsx
> function EditName({ initialName }) {
>   const [name, setName] = useState(~initialName~); // The prop name says only the first value counts
>   return <input value={name} onChange={e => setName(e.target.value)} />;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function EditContact({ contact }) {
>   const [title, setTitle] = useState(~contact.name~); // **WRONG:** keeps 'Taylor' after the parent passes Alice
>   return <h2>Editing {title}</h2>;
> }
> ```

Start with the smallest case, a heading component that copies its name prop into state:

```jsx title="A heading that copies its prop into state"
function Heading({ name }) {
  const [title, setTitle] = useState(~name~); // React uses name on the first render only
  return <h2>{title}</h2>;
}
```

The parent component first renders the heading with Taylor. On a subsequent render, the parent passes Alice at the exact same location in the tree:

```jsx title="The parent passes Taylor first, then Alice at the same place"
<Heading name="Taylor" /> {/* First render: the heading shows Taylor */}
<Heading ~name="Alice"~ /> {/* Later render at the same place: the heading still shows Taylor */}
```

Because nothing in the application calls `setTitle`, the title state variable retains its initial value permanently.

### The first version of the form

Our initial form component contains only the heading, and it repeats this mistake:

```jsx title="src/EditContact.jsx"
import { useState } from 'react';

export default function EditContact({ contact }) {
  const [title, setTitle] = useState(~contact.name~); // **WRONG:** stores 'Taylor' on the first render, and keeps it
  return <h2>Editing {title}</h2>;
}
```

When the page loads, the heading displays Taylor correctly. The user clicks Alice. **The heading still says `Editing Taylor`.** The console reports no errors and no warnings:

```page width=text caption="The first version after the user clicks Alice: the heading still shows Taylor."
line: [Taylor] [Alice]
heading: Editing Taylor
console: quiet
```

### Why the heading stays on Taylor

The EditContact component does execute again with Alice as the contact. The prop is completely accurate. It is `useState` that ignores the new value. Here is the step by step sequence:
1. The page loads. The App component passes Taylor, and EditContact executes its initial render.
2. Evaluating `useState(contact.name)` stores Taylor in component memory, and the heading displays Taylor.
3. The user clicks Alice. The App component updates the selected ID to 1 and re-renders.
4. The App component renders EditContact at the identical position in the tree, so React preserves the state of EditContact (Lesson 25).
5. The EditContact function runs again, and the contact prop now provides Alice.
6. React ignores the incoming name argument and returns the value Taylor saved during step 2.

```tree dir=right caption="After the click on Alice, the prop changes, but useState returns the value it stored on the first render."
What `EditContact` sees after the click on Alice
- +1. The prop [`contact.name`] | `App` passes **`'Alice'`**
- !2. The state [`title`] | `useState` **ignores** its argument after the first render | Returns the stored **`'Taylor'`**
- !3. The page [`Editing Taylor`] | The heading shows the **old contact**
```

Notice that two values on this screen come from two distinct locations:
- **The contact prop inside EditContact** originates in the App component, which locates the record during render and passes it down.
- **The name Taylor in the heading after the click** originates in React state memory, which captured the value during the first render and returns it on every render thereafter.

### When a copy in state is what you want

Sometimes ignoring future prop updates is intentional. The React documentation states that you should not put props into state unless you specifically want to prevent updates. When that behavior is desired, name the prop clearly so that any developer reading the code understands the intent. The conventional approach is to prefix the prop name with `initial` or `default`:

```jsx title="A prop name that says later values are ignored"
function EditName({ ~initialName~ }) { // The name tells the caller: only the first value counts
  const [name, setName] = useState(initialName);
  return <input value={name} onChange={e => setName(e.target.value)} />;
}
```

Our heading simply displays the contact name, so it has no reason to ignore updates. The official guide gives a clear rule: data passed from a parent component through props is not state.

---

## PRINCIPLE | `contact.name` read during render: the heading follows every new contact

> [!PRINCIPLE]
> **Principle 2: Derive During Render: Calculate What You Can, Store Only What You Cannot**
>
> *When a value can be calculated from the current props or state, calculate it in the component body during render; it is then right on every render and cannot get out of sync.*
>
> Only data that changes over time and cannot be calculated belongs in state. The heading comes from the `contact` prop, so the component reads it during render. The Name field holds text the user types before saving, so it is state, and it needs a way to start over for each contact.
>
> **DO THIS:**
> ```jsx
> function EditContact({ contact }) {
>   return <h2>Editing {~contact.name~}</h2>; // Read on every render: shows Alice after the click
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function EditContact({ contact }) {
>   const [title, setTitle] = useState(~contact.name~); // **WRONG:** a second copy that stays on Taylor
>   return <h2>Editing {title}</h2>;
> }
> ```

Here is the heading component written without any state:

```jsx title="A heading that reads its prop during render"
function Heading({ name }) {
  return <h2>Editing {~name~}</h2>; // Reads the prop on every render: shows Alice right after the parent passes Alice
}
```

If you prefer a shorter variable name, assign the prop to a local constant first. That changes nothing about how the code executes:

```jsx title="Reading the prop in the JSX, and through a const"
<h2>Editing {~contact.name~}</h2> {/* Reads the prop in the JSX */}
const title = ~contact.name~; // Reads the same prop into a const, then the JSX shows {title}
```

**Yes, it is the exact same thing!** Both variations read `contact.name` during every render cycle. As the React documentation explains, you can assign a prop to a constant whenever you want a shorter name. A `const` variable is standard JavaScript execution, while `useState` allocates persistent React memory.

### The fix: the heading reads the prop

We delete the redundant title state variable and read the prop directly:

```jsx title="src/EditContact.jsx"
export default function EditContact({ contact }) {
  return <h2>Editing {~contact.name~}</h2>; // Calculated on every render from the prop
}
```

When the user clicks Alice, the heading updates immediately. When the user clicks Taylor again, the heading returns to Taylor:

```page width=text caption="The heading reads contact.name during render: after the user clicks Alice, it shows Alice."
line: [Taylor] [Alice]
heading: Editing Alice
```

This pattern illustrates what interviewers mean by **deriving a value during render**. React documentation variously calls this calculating during render or calculating during rendering. Both descriptions mean the same thing: compute the value directly in the component body using a constant, or read the prop directly within the JSX.

```tree caption="A value calculated during render vs. a copy of the prop in state."
Where the heading gets its name
- +Derived during render [`{contact.name}`] | Our code reads the prop **on every render** | The heading **always** shows the selected contact
- !Copied into state [`useState`] | React keeps **the first value** | The heading **stays on Taylor**, and nothing ever calls the setter
```

Calculating values during render delivers three distinct benefits: your code is faster, simpler, and less error-prone. You eliminate an unnecessary state variable and remove a redundant copy that could fall out of sync.

If a particular calculation is computationally expensive, cache it using `useMemo` instead of storing the result in state (Lesson 56). As the official documentation notes, unless you are creating or looping over thousands of complex objects, standard calculations are rarely expensive.

The App component follows this exact pattern. It stores `selectedId` in state and derives the active contact during render using the array `find` method (Lesson 22). It avoids storing the full contact object in state, which would create a duplicate copy that risks becoming stale after edits.

### The Name field is a draft, so it is state

Now the form requires a name input field and a Save button. An editable text field differs fundamentally from a static heading. The user types text into the field before saving, and that draft text exists nowhere else in the system. Because no incoming prop holds that draft, it must live in state. The field initializes with the current contact name:

```jsx title="src/EditContact.jsx"
import { useState } from 'react';

export default function EditContact({ contact, onSave }) {
  const [name, setName] = useState(~contact.name~); // The draft starts from the contact's name

  return (
    <section>
      <h2>Editing {contact.name}</h2>
      <label>
        Name <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <button onClick={() => ~onSave({ ...contact, name })~}>Save</button> {/* Sends the contact with the typed name */}
    </section>
  );
}
```

### The Name field still shows Taylor

Although the heading now updates properly, the input field exhibits the original bug. Because its state initializes via `useState(contact.name)`, it retains the name Taylor. The user clicks Alice:

```page width=text caption="After the user clicks Alice: the heading shows Alice, but the Name field still holds Taylor."
line: [Taylor] [Alice]
heading: Editing Alice
form:
  field: Name | Taylor | bad
  button: Save
```

The user interface now displays contradictory information: the heading says Alice, while the input field still says Taylor. If the user clicks Save, the form submits Alice's ID paired with the name Taylor. Both selection buttons then display Taylor:

```page width=text caption="After the user clicks Save: Alice's contact was saved with the name Taylor."
line: [Taylor] [Taylor]
heading: Editing Taylor
form:
  field: Name | Taylor | bad
  button: Save
```

The draft text must reside in state, but that state must reset whenever the user selects a different contact. The next three principles present three distinct ways to perform this reset.

---

## PRINCIPLE | `useEffect` that copies the prop: the form renders once with the old name, then again

> [!PRINCIPLE]
> **Principle 3: Copying in an Effect: The Copy Arrives One Render Late**
>
> *When an Effect calls `setName(contact.name)` after `contact` changes, the component and its children first render and commit with the stale name, then React runs the Effect and renders everything again.*
>
> Effects run after the commit. By the time the Effect runs, React has already rendered the whole form with Taylor's name and put it in the DOM. The Effect then starts a second render. Each new piece of state needs its own setter call in the Effect, and a forgotten one leaves that field on the old contact.
>
> **DO THIS:**
> ```jsx
> <EditContact ~key={contact.id}~ contact={contact} /> // A new contact gets a new form in one render
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   ~setName(contact.name)~; // **WRONG:** runs after a render with Taylor's name, then renders again
> }, [contact]);
> ```

The first solution many developers attempt is an Effect. The rationale seems straightforward: whenever the contact changes, update the state variable with the new name:

```jsx title="Copying the prop into state with an Effect"
const [name, setName] = useState(contact.name);
useEffect(() => {
  ~setName(contact.name)~; // Runs after React has already shown the form with the old name
}, [contact]);
```

While the field eventually displays Alice, remember when Effects execute: only after React finishes rendering and committing the component to the DOM (Lesson 34). As a result, the form first renders displaying the stale name Taylor. Only after that initial render is committed does the Effect run and trigger a second render pass.

### Make the extra render visible

We add the Effect to EditContact, along with a console log that outputs the current name during every render:

```jsx title="src/EditContact.jsx"
import { useEffect, useState } from 'react';

export default function EditContact({ contact, onSave }) {
  const [name, setName] = useState(contact.name);
  console.log('render', name);

  useEffect(() => {
    ~setName(contact.name)~; // **WRONG:** fixes the field one render late
  }, [contact]);

  return (
    <section>
      <h2>Editing {contact.name}</h2>
      <label>
        Name <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <button onClick={() => onSave({ ...contact, name })}>Save</button>
    </section>
  );
}
```

We clear the console and click Alice. The input field displays Alice, but the console reveals that the form rendered with the name Taylor first:

```page width=text caption="With the Effect, after the user clicks Alice: the field holds Alice, and the Console shows a render with Taylor first."
line: [Taylor] [Alice]
heading: Editing Alice
form:
  field: Name | Alice | good
  button: Save
log: render Taylor | EditContact.jsx:5
log: render Taylor | EditContact.jsx:5
log: render Alice | EditContact.jsx:5
log: render Alice | EditContact.jsx:5
```

Each log message appears twice because Strict Mode renders components twice during development (Lesson 47). Reading the entries in sequence confirms that React rendered Taylor before rendering Alice.

### Why the form renders with Taylor first

**The render pass immediately following the button click still uses the name Taylor. The Effect runs only after React has committed that render to the screen.** Here is the runtime sequence:
1. The App component renders with the contact object for Alice.
2. EditContact renders. Because state still holds Taylor, the console logs Taylor.
3. React commits this render pass to the DOM: the heading says Editing Alice, while the input field still holds Taylor.
4. React detects that the contact prop changed and executes the Effect, which calls `setName('Alice')`.
5. EditContact renders a second time with the name Alice, logging Alice to the console, and React commits the update to the DOM.

No user interaction triggered the second render. The state setter inside the Effect forced it to happen.

Can the user see Taylor for a brief moment? Under certain conditions, yes. Although React usually flushes Effects quickly, the official documentation warns that the browser may repaint the screen before processing state updates inside an Effect. During that single frame, the input field can display Taylor under the heading Editing Alice.

Even if the user never notices that visual flicker, the performance cost remains real. The form and all nested children execute a complete render pass using stale data, and then React repeats that entire workload. The official documentation notes that the component and its child tree render with the stale value before rendering all over again.

```tree caption="After the click on Alice: the Effect needs two renders, and the key of Principle 4 needs one."
Renders after the click on Alice
- !With the Effect [`useEffect` + `setName`] | Render 1 uses **`'Taylor'`** and is committed | The Effect starts **render 2** with **`'Alice'`**
- +With a `key`, Principle 4 [`key={contact.id}`] | **One render** | `useState` reads **`'Alice'`** for the first time
```

### The mistake: a second field that the Effect forgets

An Effect requires you to synchronize every dependent state variable manually. Suppose the form later adds an email field with its own state initialized from `contact.email`. If a developer forgets to call `setEmail(contact.email)` inside the Effect, clicking Alice updates the name field while leaving the email field populated with Taylor's address.

The React documentation specifically warns against this fragility, noting that you would need to duplicate manual synchronization inside every stateful component within the form. The lint rule against setting state inside an Effect flags this practice directly, identifying derived prop synchronization as an anti-pattern (Lesson 34).

---

## PRINCIPLE | `key={contact.id}`: every contact gets a new form with new state

> [!PRINCIPLE]
> **Principle 4: Reset with a Key: A New ID Means a New Form**
>
> *When the whole state of a component belongs to one item, give the component a `key` from that item; when the `key` changes, React treats it as a different component, builds new state from the new props, and re-creates its DOM.*
>
> The form never has to notice that the contact changed. A new form runs `useState(contact.name)` for the first time, so the field starts from the selected contact in one render. Unsaved text in the old form is thrown away with it. This is the docs' first choice when state must start over for a new item.
>
> **DO THIS:**
> ```jsx
> <EditContact ~key={contact.id}~ contact={contact} onSave={handleSave} /> // Alice gets a new form
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <EditContact ~contact={contact}~ onSave={handleSave} /> // **WRONG:** Alice gets Taylor's form, with Taylor in the field
> ```

Remember using the `key` attribute on list items in Lesson 18. A `key` tells React which item is which, and it works on any component, not just lists. Compare the form tag with and without a key:

```jsx title="The form's tag without a key and with key={contact.id}"
<EditContact contact={contact} /> {/* After the click on Alice, the field keeps Taylor */}
<EditContact ~key={contact.id}~ contact={contact} /> {/* After the click on Alice, the field holds Alice */}
```

**It may look the same, or work the same at first, but it is NOT the same thing!** When the page first loads, both tags display Taylor in the input field. After clicking Alice, only the version equipped with a `key` displays Alice.

Why does this happen? Taylor's form instance carries the key 0, while Alice's form carries the key 1. To React, these represent two completely separate components (Lesson 25). The React documentation explains that changing a key tells React to treat two components as separate entities that must not share any state. On our page, those entities are Taylor's form and Alice's form.

The form component itself never needs to inspect whether the contact prop changed. React unmounts the old instance and mounts a fresh one. This new instance runs `useState(contact.name)` for the first time, reading Alice cleanly on its very first render. The core behavior from Principle 1, where React reads initial state only once, now works in our favor.

### The `key` in the contact editor

We remove the Effect and the console log from EditContact, returning to the clean code from Principle 2. In the App component, we add a single key attribute to the form tag:

```jsx title="src/App.jsx" startLine="23"
      <EditContact ~key={contact.id}~ contact={contact} onSave={handleSave} /> {/* A new id means a new form */}
```

EditContact does not receive `key` as an accessible prop. React uses the key internally for reconciliation and strips it from component props (Lesson 18). That is why the contact object is still passed separately.

### The `key` throws away unsaved text

This test reveals how keys manage component lifecycle and state. Suppose the user types into the input field, shortening Taylor to Tay, without clicking Save. The user then clicks Alice:

::: row caption="After the user types Tay over Taylor and clicks Alice: without a key the field keeps the old text, with key={contact.id} it holds Alice."
::: col title="Without key" tag="the field keeps the old text" tone=bad
```page size=mini
line: [Taylor] [Alice]
heading: Editing Alice
form:
  field: Name | Tay | bad
  button: Save
```
:::
::: col title="With key={contact.id}" tag="a new field for Alice" tone=good
```page size=mini
line: [Taylor] [Alice]
heading: Editing Alice
form:
  field: Name | Alice | good
  button: Save
```
:::
:::

Without a key, the existing form preserves its local state, leaving the uncommitted draft Tay displayed under the heading for Alice. With `key={contact.id}`, the input updates cleanly to Alice.

Now the user clicks Taylor again. With the key in place, the input displays the saved name Taylor rather than the unsaved draft Tay:

```page width=text caption="With key={contact.id}, after the user clicks Taylor again: the field holds the saved name, and the unsaved Tay is gone."
line: [Taylor] [Alice]
heading: Editing Taylor
form:
  field: Name | Taylor
  button: Save
```

**Resetting with a key discards unsaved text, which often surprises developers.** Here is the underlying mechanism:
1. The user enters Tay into the input field. That draft text lives in the state of the form instance associated with key 0.
2. The user selects Alice. At that same position in the tree, the App component renders the form with key 1.
3. React encounters a different key at that position. It unmounts the old form instance, deletes its state, and constructs a fresh component instance.
4. The new form instance executes `useState(contact.name)` for the first time, initializing with Alice.
5. When the user selects Taylor again, React unmounts Alice's form and constructs a new instance for Taylor with key 0.
6. That fresh instance initializes from the incoming contact prop, which still holds the saved string Taylor. The unsaved draft Tay vanished when React unmounted the earlier instance in step 3.

React also creates brand new DOM elements rather than reusing existing ones when keys change. The text input rendered after the click is a newly created DOM element.

```tree dir=right caption="What React does when the key of EditContact changes from 0 to 1."
The user clicks Alice
- !Old form, key 0 [`<EditContact key={0} />`] | React **removes** it | Its state, including the unsaved **`Tay`**, is gone
- +New form, key 1 [`<EditContact key={1} />`] | React **builds** it with new state and new DOM | `useState` reads **`'Alice'`** for the first time
```

### The mistake: expecting the `key` to keep a draft for each contact

Developers sometimes add `key={contact.id}` expecting each contact to preserve its own uncommitted drafts. That expectation is incorrect: whenever the user switches contacts, React destroys the previous form instance and its state. An application that needs to preserve draft inputs across multiple items requires a different architecture. The React documentation recommends two approaches:
1. Lift draft state up into a parent component, which the documentation calls the most common solution (Lesson 24).
2. Render every form simultaneously and toggle their visibility using CSS.

### How the docs hide the `key` inside the component

Consumers of a form component should not have to remember to provide a key prop. To make component usage foolproof, the React documentation recommends splitting the component into two. The outer component accepts props normally, and passes the ID as the key to an inner implementation component. The documentation refers to the key as an internal implementation detail of this pattern.

In an official documentation exercise, an outer EditContact component forwards its props to an inner EditForm component, assigning the key from the saved contact record:

```jsx title="The docs' EditContact solution: the outer component passes the key"
<EditForm {...props} ~key={props.savedContact.id}~ /> {/* The inner form starts over for each saved contact */}
```

---

## PRINCIPLE | `setName` during render inside an `if`: legal for the component's own state, once per change

> [!PRINCIPLE]
> **Principle 5: Adjust State During Render: Only Inside a Condition, Only Your Own State**
>
> *When only part of a component's state must change after a prop changes, keep the previous prop value in state and, during render, inside a condition that compares it with the new prop, call that component's own setters; React throws away that render's JSX and renders the component again at once, before its children.*
>
> The condition stops the loop, because the same block sets `prevId` and makes the condition false on the next pass. React retries before any child renders and before the DOM changes, so nothing on the page sees the stale value. A set call with no condition loops until React throws `Too many re-renders`.
>
> **DO THIS:**
> ```jsx
> const [prevId, setPrevId] = useState(contact.id);
> if (~contact.id !== prevId~) { // Runs once per new contact, then the condition is false
>   setPrevId(contact.id);
>   setName(contact.name);
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const [name, setName] = useState(contact.name);
> ~setName(contact.name)~; // **WRONG:** every render sets state again: Too many re-renders
> ```

Until now, you invoked state setters inside event handlers: the user clicks a button, and the handler calls a setter. Calling a setter while a component renders sounds like an infinite loop, and in most cases it is. However, React supports one specific pattern where setting state during render is legal.

### The smallest case: a label that compares with the last render

Sometimes a component must respond to how a prop changed over time, rather than just its current value. The React documentation demonstrates this with a label that indicates whether a counter increased or decreased. To make that comparison, the component must remember the count from the previous render:

```jsx title="The docs' CountLabel: a set call during render, inside a condition"
function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (~prevCount !== count~) { // True only on the render where count changed
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

Both setters run directly inside the component body during render, without event handlers or Effects. The `prevCount` variable holds the previous prop value. Our code saves it, and React preserves it across renders until `setPrevCount` updates it.

> [!DEFINITION]
> **Adjusting state during render.** [NEW] Adjusting state during render means calling a component's own setter inside its body, while it renders, inside a conditional guard that compares previous and current prop values; React immediately restarts rendering that component before children render or DOM updates occur (Lesson 80).

### A set call during render: alone vs. inside an `if`

Calling a setter directly inside the component body is almost always a bug. Compare an isolated setter call with a setter placed inside an `if` statement:

```jsx title="A set call alone during render, and inside a condition"
setName(contact.name); // Alone: every render sets state, and every set starts another render
if (~contact.id !== prevId~) { setPrevId(contact.id); setName(contact.name); } // Inside a condition: runs once per new contact
```

**It may look the same, or work the same at first, but it is NOT the same thing!**
1. **With an unconditional setter**, every render calls the setter function. Every setter call during render forces React to render the component again immediately. This creates an **infinite loop** that never terminates on its own. React detects this loop and throws an error.
2. **With the setter inside a condition**, the execution block also calls `setPrevId(contact.id)`. On the immediate retry pass, `prevId` matches `contact.id`, the condition evaluates to false, and no setters execute.

The React documentation establishes two mandatory rules. The setter must sit inside a condition comparing values, and you must update the tracked state variable within that same block. Without updating the tracked value, the component re-renders in a loop until it crashes.

Developers call this conditional check a **guard**, because it restricts setter execution strictly to moments when the relevant prop changes.

### The guarded reset in the contact editor

Because our application has no form state that needs to survive switching contacts, resetting with a key remains our preferred solution. For comparison, here is how a guarded setter can reset the name field without unmounting the component. First, revert the tag in the App component to the version without a key:

```jsx title="src/App.jsx" startLine="23"
      <EditContact contact={contact} onSave={handleSave} /> {/* No key: the same form stays for every contact */}
```

Next, update EditContact to store the previous contact ID in state:

```jsx title="src/EditContact.jsx"
import { useState } from 'react';

export default function EditContact({ contact, onSave }) {
  const [name, setName] = useState(contact.name);
  const [prevId, setPrevId] = useState(contact.id);
  if (~contact.id !== prevId~) { // True only on the first render after the user picks another contact
    setPrevId(contact.id);
    setName(contact.name);
  }
  console.log('render', name);

  return (
    <section>
      <h2>Editing {contact.name}</h2>
      <label>
        Name <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <button onClick={() => onSave({ ...contact, name })}>Save</button>
    </section>
  );
}
```

We clear the console and click Alice. The input field displays Alice. The console outputs one log for Taylor, followed by Alice:

```page width=text caption="With the guarded set during render, after the user clicks Alice: the field holds Alice."
line: [Taylor] [Alice]
heading: Editing Alice
form:
  field: Name | Alice | good
  button: Save
log: render Taylor | EditContact.jsx:10
log: render Alice | EditContact.jsx:10
log: render Alice | EditContact.jsx:10
```

The message `render Alice` appears twice because Strict Mode invokes component functions an extra time in development (Lesson 47).

### Why `render Taylor` shows up, and costs nothing on the page

**React discards the render containing Taylor before rendering child components or updating the browser DOM.** Here is the runtime sequence when switching to Alice:
1. EditContact begins rendering with Alice while `prevId` remains 0.
2. The guard condition evaluates to true, so `setPrevId(1)` and `setName('Alice')` execute.
3. The rest of the component function continues executing, logging Taylor because the current pass still sees old local variables.
4. React discards the returned JSX from that pass and immediately re-runs EditContact before rendering any child components or modifying the DOM.
5. During this second pass, `prevId` is 1, so the guard evaluates to false. State now provides Alice, and the console logs Alice.
6. React renders child components and commits the update to the DOM, displaying Alice.

No user event triggered the second pass. The state setter invoked during render scheduled an immediate retry before child rendering began.

Compare this behavior with the Effect in Principle 3. An Effect commits stale data to the DOM before triggering a second render. With a guarded setter during render, child components never receive the stale value, and the DOM never reflects outdated information.

When the guard block appears below all Hook calls, you can insert an early return statement immediately after calling the setters. This exits the component early and allows React to restart the render pass even sooner.

### VS | The guarded set vs. the `key`: both put Alice in the field, only the `key` builds a new form

Both the guarded setter and the `key` attribute successfully place Alice into the input field. **They look the same on the page, but they are NOT the same thing!**
1. **With `key={contact.id}`**, React constructs a brand new form instance. Every state variable resets to its initial value, and React generates fresh DOM elements.
2. **With a guarded setter**, React preserves the existing component instance and its DOM nodes. Only the state variables explicitly updated in the guard block reset, while all other state remains untouched.

This distinction defines when to use a guarded setter: when part of the state must reset while other state variables must persist. Because all state in our contact form belongs exclusively to the selected contact, resetting with a key is the cleaner design.

The React documentation notes that adjusting state during render is difficult to follow and generally best avoided, though it remains far better than updating state inside an Effect. In many cases, the need for this pattern vanishes when you store primitive identifiers in state rather than duplicating entire objects.

```tree caption="Three ways to put Alice in the Name field after the click, and what each one costs."
Resetting the Name field after the click on Alice
- !Effect [`useEffect` + `setName`] | The children render and commit with **Taylor**, then render again | Every state variable needs **its own line**
- +Guarded set during render [`contact.id !== prevId`] | React throws away the first pass **before the children** | Resets **only the state it names**
- +Key [`key={contact.id}`] | React builds **a new form** | Resets **all of the form's state** and **its DOM**
```

### The mistake: a set call with no condition

If a developer attempts to update state during render without a guard condition, the application crashes:

```jsx title="src/EditContact.jsx" startLine="3"
export default function EditContact({ contact, onSave }) {
  const [name, setName] = useState(contact.name);
  ~setName(contact.name)~; // **WRONG:** every render sets state, and every set starts another render
```

The browser window turns blank, and the console reports a fatal runtime error:

```devconsole width=full
x Uncaught Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.
! An error occurred in the <EditContact> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

The solution is to wrap the setter in a guard using `prevId`, or reset the component using a key. React lint rules catch this error during development by checking for unconditional state updates during render.

### Two more limits

Setting state during render comes with two strict architectural constraints:
1. **Only update the active component's own state.** A component rendering may update only its own state variables. Updating a parent or sibling component during render causes a React error, preventing slow cascading render retries across the tree.
2. **Never perform side effects.** Modifying the DOM directly, initiating network requests, or configuring timers must remain inside event handlers or Effects to keep rendering pure (Lesson 14).

---

## All 5 Principles Together

### The complete files

The HTML file and the entry file remain standard Vite templates. Here are the two components we authored. The heading is derived during render, the input draft resides in local state, and the key attribute recreates the form whenever the contact changes:

```jsx title="src/App.jsx"
import { useState } from 'react';
import EditContact from './EditContact.jsx';

const initialContacts = [
  { id: 0, name: 'Taylor' },
  { id: 1, name: 'Alice' },
];

export default function App() {
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedId, setSelectedId] = useState(0);
  const contact = ~contacts.find(c => c.id === selectedId)~; // Principle 2: derived during render from the ID

  function handleSave(updatedContact) {
    setContacts(contacts.map(c => (c.id === updatedContact.id ? updatedContact : c)));
  }

  return (
    <main>
      {contacts.map(c => (
        <button key={c.id} onClick={() => setSelectedId(c.id)}>{c.name}</button>
      ))}
      <EditContact ~key={contact.id}~ contact={contact} onSave={handleSave} /> {/* Principle 4: a new contact gets a new form */}
    </main>
  );
}
```

```jsx title="src/EditContact.jsx"
import { useState } from 'react';

export default function EditContact({ contact, onSave }) {
  const [name, setName] = useState(~contact.name~); // Principle 1: used once per form, and the key gives each contact its own form

  return (
    <section>
      <h2>Editing {~contact.name~}</h2> {/* Principle 2: read on every render */}
      <label>
        Name <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <button onClick={() => onSave({ ...contact, name })}>Save</button>
    </section>
  );
}
```

The user clicks Alice, and the entire form synchronizes immediately:

```page width=text caption="The finished contact editor after the user clicks Alice: the heading and the Name field both show Alice."
line: [Taylor] [Alice]
heading: Editing Alice
form:
  field: Name | Alice | good
  button: Save
```

### The order in which React calls the components

When the user clicks Alice, React renders the App component first. App renders the two selection buttons and then proceeds to the form. Because the key changed, React mounts a fresh EditContact component rather than updating the previous instance:

```tree caption="The component tree after the click on Alice, in the order React calls each part."
`App` [1. Renders with `selectedId` set to `1`] | Finds Alice's contact during render
- +Two buttons [2. `Taylor` and `Alice`] | Built from `contacts` with `map`
- +`EditContact` with key 1 [3. A new form] | The old form with key 0 and its state are **removed** | `useState` reads **`'Alice'`** for the first time
```

### What each way shows after the click on Alice

| Principle | What the developer writes | What the user sees after the click on Alice |
| :--- | :--- | :--- |
| **1. A copy in state** | `useState(contact.name)` for the heading | `Editing Taylor`, and Save writes Taylor's name into Alice's contact |
| **2. Derive during render** | `{contact.name}` in the heading | `Editing Alice` at once |
| **3. An Effect** | `setName(contact.name)` in an Effect | Alice in the field, after a render with Taylor's name that the browser may paint for one frame |
| **4. A `key`** | `key={contact.id}` on the form | Alice in the field in one render; unsaved text is gone |
| **5. A guarded set during render** | `if (contact.id !== prevId)` with both setters | Alice in the field; only `name` and `prevId` start over |

Remember the essential principle: **React reads initial state arguments on the first render only, so calculate derived values directly during render and reset editable forms with a key.**

---

## For the Interview

> **The Interview Question:** How do you derive values during render, and when is adjusting state during render legal?

### How to Answer Clearly in 30 Seconds

"React evaluates the argument passed to `useState` on the initial render only and ignores it on subsequent renders. If you copy a prop into state, the state variable becomes stale when the parent passes new props. React offers two main solutions, plus one specialized pattern:
1. **Derive during render:** If a value can be computed from existing props or state, calculate it directly in the component body as a constant. It stays accurate on every render and cannot fall out of sync.
2. **Reset state with a key:** If state represents an editable draft belonging to a specific record, attach `key={item.id}` to the component. Changing the key causes React to destroy the old instance and mount a fresh component with clean initial state.
3. **Adjust state during render:** In rare scenarios where only part of the state must reset, store the previous prop value in state. Inside a conditional guard during render, update your own state setters alongside the tracked prop. React discards that render pass and restarts immediately before evaluating child components.

I avoid synchronizing props to state inside an Effect because it causes a redundant render pass and risks flashing outdated content to the user."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Is it ever right to copy a prop into state?"**
Yes, when you intentionally want to ignore subsequent prop updates. The React documentation notes that props should only be copied into state when you specifically want to prevent updates. In those cases, prefix the prop name with `initial` or `default`, such as `initialName`, to signal that only the first value is read. An editable draft in a form is a standard example: it initializes from a saved prop, and a key resets it when switching records.
2. **"Why not just sync the state with `useEffect`?"**
Effects execute only after React finishes rendering and commits DOM updates to the screen. When a new prop arrives, the component first renders with stale state, updates the DOM, and may even be painted by the browser. The Effect then triggers a second render pass to update state, forcing the component and all nested children to render twice. In addition, you must manually synchronize every dependent state field, creating maintenance hazards. React lint rules explicitly flag setting state inside Effects as an anti-pattern.
3. **"Why does React allow a set call during render, and why only for the component's own state?"**
React permits a component to update its own state during render because it can immediately restart that render pass. This restart finishes before evaluating child components or touching the DOM. This guarantees that children never render stale data. React restricts this to the component's own state. Updating a parent or sibling during render would cause chaotic cascading re-renders across the tree. Without a conditional guard, even a local state update triggers an infinite loop that React aborts with a `Too many re-renders` error.
