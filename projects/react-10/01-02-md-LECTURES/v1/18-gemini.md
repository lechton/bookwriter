# Lecture 18: Rendering Lists with Keys

> INTERVIEW QUESTION | ❱ CORE | How do you render a list from an array, and why does React demand a stable key on every item?

---

## The Collision Between Positional Arrays and Identity-Based Reconciliation

### Declarative List Transformation: Array Mapping vs. Static JSX

In plain JSX, rendering three list items requires writing out each tag by hand:

```jsx title="Three list items written by hand"
<ul>
  ~<li>Anna</li>~ // 1st item written by hand
  ~<li>Ben</li>~ // 2nd item written by hand
  ~<li>Cara</li>~ // 3rd item written by hand
</ul>
```

In production applications, data does not live hardcoded in markup; it arrives as an array of items. To render an array, we call JavaScript's `.map` method inside JSX curly braces:

```jsx title="The same three list items built from an array with .map"
const names = ['Anna', 'Ben', 'Cara'];

<ul>
  {~names.map(name => <li>{name}</li>)~} // Transforms ['Anna', 'Ben', 'Cara'] into three <li> elements
</ul>
```

Writing three `<li>` tags by hand and transforming an array with `.map` produce the exact same DOM structure on the page. JavaScript's `.map` takes each item, runs the callback, and hands React a new array of three `<li>` elements.

The word **map** means a direct transformation, like a rubber stamp pressed once on every box in a row. One box goes in, and one stamped card comes out with the exact same order and length. Calling `names.map` takes each name from the array one by one, stamps an `<li>` tag around it, and hands the resulting array of elements to the `<ul>` tag.

When each item has a unique ID, we attach a `key` attribute to each element:

```jsx title="Giving each list item a stable key from the data"
const people = [
  { id: 1, name: 'Anna' },
  { id: 2, name: 'Ben' },
  { id: 3, name: 'Cara' }
];

<ul>
  {people.map(person => (
    <li ~key={person.id}~>{person.name}</li> // key identifies this item across renders
  ))}
</ul>
```

A `key` acts as an identity tag across renders. In everyday life, imagine desktop files without names, known only as file 1, file 2, and file 3. Dropping a new file at the top shifts every position number: file 1 becomes file 2, and file 2 becomes file 3. A file name stays attached to its contents wherever the file moves. In React, a `key` provides that permanent name for every row in a list.

Two look-alike traps trip developers up immediately:
1. First, `key` sits beside normal attributes on a tag, but React strips it from `props`. A meeting organizer places name tags on tables to seat guests; the guests do not read their own tags out loud. React consumes `key` to track elements across renders and strips it before creating `props`, so child components cannot read `props.key`.
2. Second, lists keyed by position and lists keyed by data ID look identical on first load, but behave completely differently on update. Compare what happens when Zoe arrives at the top of an array:

```jsx title="Way 1: Naming each item by its array position before and after Zoe arrives at the top"
const before = ['Anna', 'Ben', 'Cara'];
const rowsBefore = [~<li key={0}>Anna</li>~, <li key={1}>Ben</li>, <li key={2}>Cara</li>]; // Before Zoe: Anna has key 0

const after = ['Zoe', 'Anna', 'Ben', 'Cara'];
const rowsAfter = [~<li key={0}>Zoe</li>~, ~<li key={1}>Anna</li>~, <li key={2}>Ben</li>, <li key={3}>Cara</li>]; // After Zoe: Zoe takes key 0, and Anna shifts to key 1!
```

Now compare that with naming each person by the unique ID stored inside their own data object before and after Zoe arrives at the top:

```jsx title="Way 2: Naming each item by its own data id before and after Zoe arrives at the top"
const rowsByIdBefore = [~<li key={1}>Anna</li>~, <li key={2}>Ben</li>, <li key={3}>Cara</li>]; // Before Zoe: Anna has key 1

const rowsByIdAfter = [~<li key={4}>Zoe</li>~, ~<li key={1}>Anna</li>~, <li key={2}>Ben</li>, <li key={3}>Cara</li>]; // After Zoe: Zoe gets key 4, and Anna keeps key 1!
```

Look at Anna in both snippets. In Way 1, when Zoe takes position 0 at the top, Anna loses 0 and gets renamed to 1. In Way 2, Zoe arrives with key 4, and Anna keeps key 1. When a row on the screen holds a ticked checkbox or typed text, Way 2 keeps that tick with Anna. Way 1 leaves the tick sitting at position 0 on Zoe!

```tree caption="How .map turns an array into list tags and why a data id key stays with its item when a new item arrives at the top."
Rendering a list with `.map` and `key`
- +`names.map` vs. hand-written `<li>` tags | Stamps each array item into an `<li>` tag in order | Produces the **exact same three `<li>` elements** inside `<ul>`
- +`key={person.id}` on a list item | Acts as React's own name tag across renders | React **strips `key`** before building `props`, so `key` is **not a prop**
- !Way 1: Keyed by position `0, 1, 2` | `'Zoe'` takes `key={0}` at the top and shifts `'Anna'` to `key={1}` | A tick at `key={0}` **stays at the top on `'Zoe'`**
- +Way 2: Keyed by data `id` `1, 2, 3` | `'Zoe'` gets `key={4}` at the top and `'Anna'` keeps `key={1}` | A tick on `'Anna'` **moves down with `'Anna'`**
```

### What Is at Stake: The Stolen Tick Glitch on the Webmail Inbox

What is at stake is subtle, destructive state corruption: user interactions and inputs detaching from their data and attaching to unrelated items.

Picture our webmail Inbox page. Each email row has a checkbox on the left, the sender's name in bold, and the subject line.

The inbox displays catastrophic state corruption: ticking an email to mark it for deletion and receiving a new message at the top causes the tick to transfer to the new unread message, while the original email is silently unticked.

**Positional keys transfer existing DOM state: prepending an item shifts array indices, causing React to reuse index 0's checked DOM node for the new message.**
1. The user opens the inbox and sees three emails: Dentist at the top, Mom in the middle, and Bank at the bottom.
2. The user ticks the checkbox next to Dentist to mark it for deletion.
3. Before deleting, a new email from Shop arrives at the top of the inbox.
4. When keyed by array index, key 0 stays at the top. React reuses key 0's checked DOM node for Shop. The unread Shop email is now checked, while Dentist becomes unchecked. Clicking delete destroys the unread package notification instead of the dentist reminder.

In our target `Inbox` page, we key every row by its own `email.id` instead. That way, the new Shop email arrives unticked at the top while Dentist keeps its tick on the second row:

```page caption="What the user sees in our target Inbox page after ticking Dentist and clicking Check mail to receive a new Shop email at the top."
heading: Inbox
row: Check mail
line: [ ] Shop: Your parcel has shipped | good
line: [x] Dentist: Your appointment is on Friday | good
line: [ ] Mom: Are you coming for Sunday dinner?
line: [ ] Bank: Your monthly statement is ready
```

```tree dir=right caption="An inbox keyed by index and an inbox keyed by email.id look identical on first load, then split apart when a new email arrives at the top."
What happens after the reader ticks `Dentist` and a new `Shop` email arrives at the top
- +Keyed by `email.id` [`101`, `102`, `103`] | `Dentist` keeps key `101` when `Shop` arrives with key `104` | `Shop` at the top is **unticked**, and `Dentist` on row 2 **keeps its tick mark**
- !Keyed by `index` [`0`, `1`, `2`] | `Shop` takes over key `0` at the top, pushing `Dentist` to key `1` | React keeps the ticked input at key `0`: **`Shop` steals the tick mark from `Dentist`!**
```

### Architectural Patterns: Four Ways to Produce a List in React

In React codebases, developers use four patterns for turning an array of data into elements on the screen:
1. **Calling `.map` directly inside JSX curly braces**: writing the `.map` call right inside curly braces in the list tag. This is the most common form when the row markup is short.
2. **Storing the mapped array in a variable before `return`**: building the array with `.map` above `return` and placing that variable inside the list tag. Both forms render the exact same list, and a variable keeps `return` clean when surrounding markup grows long.
3. **Filtering the array with `.filter` and then mapping**: calling `.filter` on the data array first to keep only matching items, such as chemists. Then calling `.map` on that filtered array to turn the matching items into JSX rows.
4. **Pushing elements into a local array inside a loop**: creating an empty array inside the component and calling `.push` inside a loop. Teams use this when one data item must insert two separate sibling elements with their own keys without a wrapper fragment.

In our inbox project, we will build and compare the first two forms directly and also see how `Fragment` handles multiple sibling elements per item.

### Project Architecture: The Webmail Inbox Application

Our webmail inbox project uses five files across the project root, the source folder, and the components folder:

```files title="webmail-inbox: File Explorer" caption="How our five project files sit in index.html, src/, and src/components/."
index.html | entry | The HTML page with the empty `#root` div where React mounts the app
src/
  main.jsx | boundary | Imports `StrictMode` and `App`, and mounts `<App />` into `#root`
  App.jsx | parent | Renders `<main className="page">` with `<Inbox />` inside it
  components/
    Inbox.jsx | parent | Holds the `emails` list, the `Check mail` button, and maps each email to `<EmailRow />`
    EmailRow.jsx | child | Receives `{ id, from, subject }` as props and returns one `<li>` with a checkbox and label
```

### The Four Invariants of Rendering Lists with Keys

**PRINCIPLES:** React turns an array of data into rows on the screen and matches each row across renders by its `key`. Four foundational architectural invariants govern this process:
1. **Principle 1: Turn an Array of Data into JSX Rows with `.map` and Always Return Each Row**: Calling `.map` on a data array builds a new array of JSX elements without changing the original data. Your callback must return the JSX element on every step, or the list will render empty on the screen.
2. **Principle 2: Put a Unique `key` on the Outermost Element Directly Inside `.map`**: Every item in the array returned by `.map` needs a unique key among its siblings in that list. When you move a row into a child component, keep `key` on the child component tag directly inside `.map`.
3. **Principle 3: `key` Is Not a Prop, So Pass `id` as a Separate Prop When the Child Needs It**: React uses `key` for its own list tracking and removes it before creating the `props` object for the child component. When a child component also needs that identifier, pass it a second time under a normal prop name such as `id`.
4. **Principle 4: Use a Stable ID from the Data Instead of the Array Index or `Math.random`**: React uses keys to match each row from the previous render to the next render. Always use a stable identifier that belongs to the data item itself, rather than an array position or a random number created during render.

Here is the complete map of all four principles before we walk through each one:

| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |
| :--- | :--- | :--- | :--- |
| **Principle 1** | **`.map` Returns an Array of JSX Elements** | Opening curly braces after the arrow in `.map` and forgetting `return` hands React an empty value for every item, leaving the list blank with zero Console warnings. | Use `.map` to transform data into JSX elements, and always return the JSX from the callback using either a short arrow body or an explicit `return` statement. |
| **Principle 2** | **Put `key` on the Top Element Directly Inside `.map`** | Moving a list row into a child component file and leaving `key` on the inner tag instead of the component tag inside `.map` triggers a crash or a missing-key warning. | Give every sibling in a list a unique `key` placed directly on the outermost element or `<Fragment>` returned by the `.map` callback. |
| **Principle 3** | **`key` Is Stripped by React; Pass `id` as a Separate Prop** | Trying to read `key` from a child component's props gives `undefined`, breaking any HTML attributes or handlers inside the row that rely on that identifier. | Never read `key` from props inside a component; pass `key` for React and pass a separate prop such as `id` for the child component. |
| **Principle 4** | **Stable Data IDs vs. `index` and `Math.random`** | Keying by array index leaves a ticked checkbox on the wrong row when a new item arrives at the top, and keying by `Math.random` wipes every row's state on every render. | Key list items by a stable ID from the data or generated once when the item is created, never by array index on reorderable lists or by `Math.random` in render. |

---

## 1. Principle 1: Array Transformation: .map Produces Sibling Elements and Demands Explicit Return

### Pure Array Transformation vs. The Block Body Return Pitfall

Compare two ways of rendering the same three names inside an unordered list. First, here are the three list items written out by hand:

```jsx title="Way A: Writing three <li> tags by hand"
<ul>
  <li>Anna</li>
  <li>Ben</li>
  <li>Cara</li>
</ul>
```

Second, here is the same list built from a JavaScript array:

```jsx title="Way B: Building the array of <li> tags with .map"
const names = ['Anna', 'Ben', 'Cara'];

<ul>
  {~names.map(name => <li>{name}</li>)~} // Produces [<li>Anna</li>, <li>Ben</li>, <li>Cara</li>]
</ul>
```

When React renders Way A and Way B, yes, it is the exact same thing on the page. Calling `names.map` does not change the original `names` array at all. Instead, `.map` walks through the three names in order and runs your arrow function once for each item. It builds a brand-new array of three `<li>` tags that React places inside `<ul>`.

Now compare two `.map` callbacks that differ by only two curly braces:

```jsx title="Short arrow body vs. curly-brace block body without return"
const works = names.map(~name => <li>{name}</li>~); // 1. No curly braces after =>: returns each <li> automatically
const blank = names.map(~name => { <li>{name}</li> }~); // 2. **WRONG:** curly braces with no return keyword return undefined!
```

Look at those two lines. They may look almost the same, but they are not the same thing:
1. On line 1, there are no curly braces right after the arrow. JavaScript automatically returns the `<li>` element from every step of `.map`.
2. On line 2, curly braces open a statement block right after the arrow. Inside a curly-brace block, JavaScript returns nothing unless you write `return`. Without that return statement, the callback yields `undefined` three times, producing an array of three `undefined` values.

```tree caption="Why a short arrow body and a curly-brace block body without return behave completely differently inside .map."
What `names.map` returns to `<ul>`
- +`name => <li>{name}</li>` [short arrow body] | Returns one `<li>` element on each step | Hands `[<li>Anna</li>, <li>Ben</li>, <li>Cara</li>]` to `<ul>`
- +`name => { return <li>{name}</li>; }` [block body with `return`] | Explicitly returns the `<li>` element on each step | Hands the **exact same three `<li>` elements** to `<ul>`
- !`name => { <li>{name}</li> }` [block body with **no `return`**] | Evaluates `<li>` and throws it away | Hands `[undefined, undefined, undefined]` to `<ul>`, rendering **an empty list with 0 Console warnings!**
```

### The Silent Empty List Trap: Missing Return Yields Undefined

Let us set up our webmail inbox project and observe this trap in practice. First, our startup file mounts the application into the page root:

```jsx title="src/main.jsx" startLine="1"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    ~<App />~ // Mounts App inside #root
  </StrictMode>
);
```

Then our main application file places the inbox component inside the page wrapper:

```jsx title="src/App.jsx" startLine="1"
import Inbox from './components/Inbox.jsx';

export default function App() {
  return (
    <main className="page">
      ~<Inbox />~ // Renders the Inbox component on the page
    </main>
  );
}
```

Now look at our inbox file. We store the three messages in an array at the top of the file. To leave room for several lines inside the list, a developer opens curly braces after the arrow and omits the return statement:

```jsx title="src/components/Inbox.jsx" startLine="1"
const emails = [
  { id: 101, from: 'Dentist', subject: 'Your appointment is on Friday' },
  { id: 102, from: 'Mom', subject: 'Are you coming for Sunday dinner?' },
  { id: 103, from: 'Bank', subject: 'Your monthly statement is ready' }
];

export default function Inbox() {
  return (
    <section className="inbox">
      <h1>Inbox</h1>
      <ul className="list">
        {emails.map(email => ~{~ // **WRONG:** opens a { ... } block body with no return statement!
          <li className="row">
            <input type="checkbox" />
            <b>{email.from}</b>: {email.subject}
          </li>;
        })}
      </ul>
    </section>
  );
}
```

The screen renders a broken blank interface: the heading appears but the entire list disappears into an empty DOM node, with zero errors or warnings in the browser console.

Save the file and open the browser. Look at what appears on the screen:
1. The `Inbox` heading renders at the top of the page.
2. The `<ul>` list below the heading is completely empty, and not a single email row appears.
3. The browser's Console panel shows zero errors and zero warnings.

### Callback Parameter Injection and The Undefined Render Bailout

Let us examine the two runtime mechanisms governing this arrow function.

First, JavaScript populates the parameter name automatically on every iteration.

**JavaScript's `.map` executes the callback once per item and supplies the current element as the first argument, populating your chosen parameter name on each iteration.**
1. On call 1, `.map` passes the Dentist email object into the `email` parameter.
2. On call 2, `.map` passes the Mom email object into the `email` parameter.
3. On call 3, `.map` passes the Bank email object into the `email` parameter.

Second, omitting `return` triggers an empty list without console warnings.

**Block bodies without `return` evaluate statements and discard their output: returning `undefined` hands React empty slots that render nothing in the DOM without triggering console warnings.**
1. On each of the three calls, JavaScript stepped inside the curly braces, created the `<li>` element, and reached the closing brace without `return`.
2. In JavaScript, any function with a curly-brace block body that finishes without `return` yields `undefined`.
3. As a result, `emails.map` returned an array of three `undefined` values inside the unordered list tag.
4. In React, `undefined`, `null`, and booleans inside JSX curly braces are valid values that render nothing at all. React quietly rendered an empty `<ul>` list in the DOM with zero children and zero Console warnings.

Notice that the exact same blank list happens if a developer calls `emails.forEach` instead of `emails.map`. In plain JavaScript, `.forEach` runs a callback for each item and always returns `undefined`. By contrast, `.map` collects each returned JSX element into a brand-new array for React to display.

### Returning JSX Nodes: Automatic Arrow Return vs. Variable Hoisting

We can fix `emails.map` in two equivalent ways. We can keep the curly-brace block and add `return` before the `<li>` tag. Or we can use a short arrow body without curly braces after the arrow so the function returns the row automatically. When surrounding markup grows long, you can also store the mapped array in a `rows` variable above the return statement and render `rows` inside the list.

Let us update our inbox file so the callback returns the list item on each step:

```jsx title="src/components/Inbox.jsx" startLine="7"
export default function Inbox() {
  return (
    <section className="inbox">
      <h1>Inbox</h1>
      <ul className="list">
        {emails.map(email => ~(~ // Short arrow body returns the <li> element on each step!
          <li className="row">
            <input type="checkbox" />
            <b>{email.from}</b>: {email.subject}
          </li>
        ))}
      </ul>
    </section>
  );
}
```

Save the file and look at the browser now:
1. All three email rows for Dentist, Mom, and Bank appear on the screen with their checkboxes.
2. At the exact same moment, a red warning appears in the browser's Console panel asking for a unique `"key"` prop on each child in the list.

Compare the broken block body without `return` and the working `.map` return side by side:

::: row caption="Forgetting return inside a curly-brace .map block vs. returning the <li> element from .map."
::: col title="Block Body Without return" tag="returns [undefined, undefined, undefined]" tone=bad
```page size=mini
heading: Inbox
empty: empty list
console: quiet
```
```jsx title="src/components/Inbox.jsx" bad="2,7"
<ul className="list">
  {emails.map(email => {
    <li className="row">
      <input type="checkbox" />
      <b>{email.from}</b>: {email.subject}
    </li>;
  })}
</ul>
```
```dom
<section class="inbox">
  <h1>Inbox</h1>
! <ul class="list"></ul> | note: 0 <li> nodes in the DOM
</section>
```
Without `return` inside the curly braces, `.map` hands React three empty values and leaves the list blank with zero Console messages.
:::
::: col title="Returning <li> from .map" tag="renders all 3 email rows" tone=good
```page size=mini
heading: Inbox
line: [ ] Dentist: Your appointment is on Friday | good
line: [ ] Mom: Are you coming for Sunday dinner? | good
line: [ ] Bank: Your monthly statement is ready | good
console: Each child in a list should have a unique "key" prop.
```
```jsx title="src/components/Inbox.jsx" good="2,7"
<ul className="list">
  {emails.map(email => (
    <li className="row">
      <input type="checkbox" />
      <b>{email.from}</b>: {email.subject}
    </li>
  ))}
</ul>
```
```dom
<section class="inbox">
  <h1>Inbox</h1>
  <ul class="list">
+   <li class="row"><input type="checkbox"><b>Dentist</b>: Your appointment is on Friday</li>
+   <li class="row"><input type="checkbox"><b>Mom</b>: Are you coming for Sunday dinner?</li>
+   <li class="row"><input type="checkbox"><b>Bank</b>: Your monthly statement is ready</li>
  </ul>
</section>
```
Returning the `<li>` from `.map` renders all three rows on the page and reveals React's next requirement in the Console: a unique key on each child.
:::
:::

> [!PRINCIPLE]
> **Principle 1: Array Transformation: .map Produces Sibling Elements and Demands Explicit Return**
>
> *Use `.map` to transform an array of data items into a new array of JSX elements, and make sure your callback returns the JSX element on every step.*
>
> This is a quiet trap. When you open curly braces right after the arrow in `.map` and forget the word `return`, nothing appears on the screen and the Console stays completely silent. Inside a curly-brace block, JavaScript returns `undefined` unless you write `return`. So `.map` hands React an array of `undefined` values, which is a valid empty value that renders nothing at all. Always use a short arrow body or write an explicit `return` so `.map` hands back your JSX rows.
>
> **DO THIS:**
> ```jsx
> <ul className="list">
>   {emails.map(email => ~(~ // Short arrow body returns the <li> element for each email
>     <li key={email.id} className="row">
>       <b>{email.from}</b>: {email.subject}
>     </li>
>   ))}
> </ul>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <ul className="list">
>   {emails.map(email => ~{~ // **WRONG:** { ... } block body without return yields undefined!
>     <li key={email.id} className="row">
>       <b>{email.from}</b>: {email.subject}
>     </li>;
>   })}
> </ul>
> ```

---

## 2. Principle 2: Contextual Scope: The Key Belongs on the Direct Child of .map

### Array Sibling Key Placement: Container Array vs. Child Component Root

At the end of Principle 1, the Console warned us that each child in a list should have a unique `"key"` prop.

When a list renders its item tags directly inside the map call, placing the key on each list item tag is straightforward:

```jsx title="When <li> sits directly inside .map, key goes on <li>"
<ul>
  {people.map(person => (
    <li ~key={person.id}~>{person.name}</li> // <li> is the element directly inside .map
  ))}
</ul>
```

Moving that list item into its own child component introduces a common scoping trap. Compare two places where developers try to put the key:

```jsx title="Place A: Putting key on <li key={id}> inside the Person child component"
function Person({ id, name }) {
  return <li ~key={id}~>{name}</li>; // **WRONG:** Person is not calling .map here!
}

function PeopleList() {
  return (
    <ul>
      {people.map(person => (
        ~<Person id={person.id} name={person.name} />~ // **WRONG:** <Person /> inside .map has no key!
      ))}
    </ul>
  );
}
```

Now compare Place A with putting the key directly on the child component tag inside the map call:

```jsx title="Place B: Putting key on <Person key={person.id} /> directly inside .map"
function Person({ name }) {
  return <li>{name}</li>; // Clean <li> inside the child component
}

function PeopleList() {
  return (
    <ul>
      {people.map(person => (
        <Person ~key={person.id}~ name={person.name} /> // **RIGHT:** key sits on the element directly inside .map!
      ))}
    </ul>
  );
}
```

Both snippets render the exact same `<li>` tags in the browser DOM. It may look like the same key on the same row, but it is not the same thing:
1. In Place A, `people.map` returns an array of three `<Person />` elements without keys. React checks the elements returned by `.map`, sees no `key` on them, and still fires the missing-key Console warning.
2. In Place B, `people.map` returns an array of three `<Person />` elements that each carry a unique key. Every element in the array has its own key among its siblings, and the Console is completely clean.

When a single array item must render multiple sibling elements without adding an extra DOM node, use `<Fragment key={...}>` from React because the shorthand `<>...</>` syntax cannot accept attributes:

```jsx title="Returning multiple sibling elements per item with <Fragment key={person.id}>"
import { ~Fragment~ } from 'react'; // 1. Import the explicit Fragment component from 'react'

function BioList({ people }) {
  return (
    <article>
      {people.map(person => (
        <~Fragment key={person.id}~> // 2. Fragment carries the key and adds zero extra nodes to the DOM
          <h2>{person.name}</h2>
          <p>{person.bio}</p>
        </Fragment>
      ))}
    </article>
  );
}
```

Keys must be unique among siblings in the same array, not globally across the entire page. It is completely fine to use the same keys 101, 102, and 103 in two separate lists on different parts of the screen.

```tree caption="Where the key belongs when rendering <li> directly, when extracting a child component, and when returning two sibling tags."
Where `key` must sit inside `.map`
- +`p => <li key={p.id}>...</li>` [`<li>` directly in `.map`] | `<li>` is the array element returned by `.map` | Put `key={p.id}` on **`<li>`**
- +`p => <Person key={p.id} />` [extracted child component] | `<Person />` is the array element returned by `.map` | Put `key={p.id}` on **`<Person />`**, never on the `<li>` inside `Person`
- +`p => <Fragment key={p.id}>...</Fragment>` [two sibling tags per item] | `<>...</>` cannot take attributes | Import `Fragment` and put `key={p.id}` on **`<Fragment>`**
```

### Component Extraction: Preserving Array Sibling Keys Across Files

Let us apply this in our inbox project. First, while the list item is still inside our inbox file, adding the email ID as a key on the list item tag clears the Console warning immediately:

```jsx title="src/components/Inbox.jsx" startLine="11"
      <ul className="list">
        {emails.map(email => (
          <li ~key={email.id}~ className="row"> // <li> is directly inside .map, so key={email.id} clears the warning
            <input type="checkbox" />
            <b>{email.from}</b>: {email.subject}
          </li>
        ))}
      </ul>
```

Next, our team decides to extract the `<li>` row into its own reusable component in the row file. Watch the two mistakes that happen one after another when a developer extracts a list item component and puts `key` in the wrong file.

### The Scope Leak Trap: Out-of-Scope Identifier ReferenceError

First, the developer moves the list item into the new row file and unpacks the sender and subject in the header. At the same time, they leave the key on the inner list item tag:

```jsx title="src/components/EmailRow.jsx" startLine="1"
export default function EmailRow({ from, subject }) {
  return (
    <li ~key={email.id}~ className="row"> // **WRONG:** email does not exist inside EmailRow.jsx!
      <input type="checkbox" />
      <b>{from}</b>: {subject}
    </li>
  );
}
```

Then, in the inbox file, the developer renders the row component inside the map call without a key:

```jsx title="src/components/Inbox.jsx" startLine="11"
      <ul className="list">
        {emails.map(email => (
          ~<EmailRow from={email.from} subject={email.subject} />~ // Renders EmailRow for each item in emails
        ))}
      </ul>
```

The application crashes with a fatal runtime exception: leaving the key inside the extracted component causes an uncaught ReferenceError that turns the entire page completely blank.

When you save both files and reload the browser, the entire page goes blank. The Console reports an uncaught reference error saying that `email` is not defined, and React adds that the error happened inside the row component. Above that error, the Console also shows the missing-key message, because the row tags inside the map call still have no key. The parameter `email` exists only inside the arrow function in `Inbox.jsx`. The `EmailRow` component is a separate function in a separate file that receives only the sender and subject props.

### The Hidden Key Warning: Unkeyed Outer Sibling Elements

To stop the crash, the developer removes the broken key attribute from the list item inside the row file:

```jsx title="src/components/EmailRow.jsx" startLine="1"
export default function EmailRow({ from, subject }) {
  return (
    ~<li className="row">~ // Crash is gone, and EmailRow returns a clean <li>
      <input type="checkbox" />
      <b>{from}</b>: {subject}
    </li>
  );
}
```

The screen renders but the engine logs a defect: removing the broken key restores the rows, but React flags a missing key warning in the console because the outer component tags lack keys.

Now the crash disappears and all three emails appear on the page again. The Console warns that each child in a list should have a unique `"key"` prop inside the render method of `Inbox`. Even if the developer passes `id` to the child component and puts `key` on the inner list item, that same warning fires.

### Reconciliation Invariant: React Matches Sibling Elements in the Immediate Array

React inspects keys on the immediate elements of the returned array: keys placed on inner root nodes inside child components are invisible to the parent array reconciler.
1. Inside `Inbox.jsx`, `emails.map` runs three times and returns an array of three row component elements to the unordered list.
2. That array of three `<EmailRow />` elements is the list whose items can be reordered, inserted, or deleted when `emails` changes.
3. Inside the row file, the `<li>` tag is the single root element returned by `EmailRow`, with zero siblings inside that component.
4. React checks for `key` on the row elements sitting inside the array returned by `.map`, never on the list item one level deeper.

That establishes the golden rule of thumb from the official React documentation: the element directly inside the `.map` call always needs the key.

### Correct Key Placement: Direct Assignment on Extracted Component Tags

To fix the warning, we keep the list item inside the row file clean and put the key directly on the row component tag inside the inbox file:

```jsx title="src/components/Inbox.jsx" startLine="1"
import EmailRow from './EmailRow.jsx';

const emails = [
  { id: 101, from: 'Dentist', subject: 'Your appointment is on Friday' },
  { id: 102, from: 'Mom', subject: 'Are you coming for Sunday dinner?' },
  { id: 103, from: 'Bank', subject: 'Your monthly statement is ready' }
];

export default function Inbox() {
  return (
    <section className="inbox">
      <h1>Inbox</h1>
      <ul className="list">
        {emails.map(email => (
          <EmailRow
            ~key={email.id}~ // Placed directly on <EmailRow /> inside .map!
            from={email.from}
            subject={email.subject}
          />
        ))}
      </ul>
    </section>
  );
}
```

When an object's property names match the child component's prop names, you will also see codebases spread the `email` object onto the row tag. Even when spreading those fields, you must still write the `key` attribute explicitly on `EmailRow`. The email object has an `id` field but no `key` field, so the spread passes no key, and the missing-key message stays in the Console. And when a spread object does hold a `key` field, React prints a separate error asking you to write the key directly on the tag.

When you save the inbox file and check the browser:
1. All three rows render cleanly on the screen.
2. React stores the keys 101, 102, and 103 on the three row component nodes, and the Console panel shows zero warnings.
3. If you open the browser's Elements panel to inspect the HTML DOM, the `<li>` element has no key attribute in the DOM. React keeps `key` inside its own component tree in memory and never writes `key` into the browser's HTML tags.

::: row caption="Putting key={email.id} on <li> inside EmailRow.jsx vs. putting key={email.id} on <EmailRow /> directly inside .map in Inbox.jsx."
::: col title="key Placed Inside EmailRow.jsx" tag="blank page + ReferenceError" tone=bad
```page size=mini
blank
```
```devconsole
x Each child in a list should have a unique "key" prop.
x Uncaught ReferenceError: email is not defined
```
```jsx title="src/components/EmailRow.jsx" bad="3"
export default function EmailRow({ from, subject }) {
  return (
    <li key={email.id} className="row">
      <input type="checkbox" />
      <b>{from}</b>: {subject}
    </li>
  );
}
```
The `email` parameter only exists inside the `.map` callback in the inbox file, and putting the key inside the row file leaves the row elements without keys.
:::
::: col title="key Placed on <EmailRow /> in .map" tag="3 rows rendered, 0 Console warnings" tone=good
```page size=mini
heading: Inbox
line: [ ] Dentist: Your appointment is on Friday | good
line: [ ] Mom: Are you coming for Sunday dinner? | good
line: [ ] Bank: Your monthly statement is ready | good
console: quiet
```
```jsx title="src/components/Inbox.jsx" good="3"
{emails.map(email => (
  <EmailRow
    key={email.id}
    from={email.from}
    subject={email.subject}
  />
))}
```
```dom
<ul class="list">
+ <li class="row"><input type="checkbox"><b>Dentist</b>: Your appointment is on Friday</li> | note: No key="101" attribute in the DOM
+ <li class="row"><input type="checkbox"><b>Mom</b>: Are you coming for Sunday dinner?</li>
+ <li class="row"><input type="checkbox"><b>Bank</b>: Your monthly statement is ready</li>
</ul>
```
Placing `key` directly on `EmailRow` inside the map call gives every sibling element in the array its own unique key.
:::
:::

> [!PRINCIPLE]
> **Principle 2: Contextual Scope: The Key Belongs on the Direct Child of .map**
>
> *Give every item in a list a `key` that uniquely identifies it among its siblings, and always place that key on the outermost element returned directly by `.map`.*
>
> When you move a list row into its own child component file, it is easy to leave `key` behind on the inner `<li>` tag. Yet React checks for keys on the elements of the array returned by `.map`, not inside the child component one level deeper. If the element sitting right inside `.map` has no `key`, React still warns you in the Console. Always put the key directly on the component tag or `Fragment` inside `.map`.
>
> **DO THIS:**
> ```jsx
> {emails.map(email => (
>   <EmailRow
>     ~key={email.id}~ // Placed on the element directly inside .map
>     from={email.from}
>     subject={email.subject}
>   />
> ))}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> {emails.map(email => (
>   ~<EmailRow from={email.from} subject={email.subject} />~ // **WRONG:** missing key on the element inside .map!
> ))}
> ```

---

## 3. Principle 3: Prop Isolation: React Strips key and Demands an Explicit Prop for Child Access

### Engine Metadata vs. Component Props: Why React Strips key

On `<EmailRow />`, `key` uses the exact same attribute syntax as normal props like `from`, leading many developers to assume the child component can read the key from its props.

Compare what a child component actually receives in its props when we pass only a key versus when we pass both a key and an ID prop. First, look at passing only the key:

```jsx title="Option A: Passing only key={1} and trying to read props.key"
const rowA = <Person ~key={1}~ name="Anna" />; // React keeps key={1} and strips it from props

function Person(props) {
  console.log(~props.name~); // Prints 'Anna'
  console.log(~props.key~); // **WRONG:** prints undefined and logs a React Console error!
  return <li>{props.name}</li>;
}
```

Now compare that with passing both the key for React and a separate ID prop for the child component:

```jsx title="Option B: Passing key={1} for React and id={1} for the Person component"
const rowB = <Person ~key={1} id={1}~ name="Anna" />; // key={1} is for React, and id={1} is a prop for Person

function Person(props) {
  console.log(~props.name~); // Prints 'Anna'
  console.log(~props.id~); // Prints 1!
  return <li id={'person-' + props.id}>{props.name}</li>;
}
```

Look at those two attributes on the `Person` tag. Both `key` and `id` sit side by side with the exact same number 1, so they look like two props, but they are not the same thing:
1. First, `key` is reserved for React. Just like the meeting organizer's name tag on the table, React reads `key` to track this row instance across renders. Then React strips `key` off before building the `props` object.
2. Second, `id` is a normal prop for your component. React places that attribute inside the `props` object and passes it into the component function.

React isolates `key` so that components never depend on how a parent happened to organize a list above them. Keeping `key` purely for React and `id` purely for component logic separates list reconciliation from component data.

```tree caption="How React splits the attributes on <EmailRow key={101} id={101} from='Dentist' subject='...' /> between itself and props."
Attributes written on `<EmailRow key={email.id} id={email.id} from={email.from} subject={email.subject} />`
- !`key={101}` [special React hint] | Kept by **React** to match this row between renders and **stripped before `props` is created** | Reading `props.key` inside `EmailRow` returns **`undefined`** and logs a Console error!
- +`id={101}`, `from="Dentist"`, `subject="..."` [normal component props] | Placed inside the **`props` object** passed to `EmailRow` | Unpacking `{ id, from, subject }` in `EmailRow` receives **`id = 101`** cleanly!
```

### The Collapsed ID Trap: Reading Stripped Key Yields mail-undefined

Let us observe what happens in our inbox when a developer forgets that React strips `key`.

Right now, ticking an email requires clicking the tiny square checkbox on the left. We want to make the entire sender and subject text clickable with a `<label>` so that clicking anywhere on Mom's line ticks Mom's checkbox. In HTML and JSX, a label element with `htmlFor` connects to the input element that has the matching ID string, such as `"mail-102"`.

The inbox file already writes the key on each row tag. Seeing that attribute, a developer tries to unpack `key` from props in the row file to build the input ID:

```jsx title="src/components/EmailRow.jsx" startLine="1"
export default function EmailRow({ ~key~, from, subject }) { // **WRONG:** tries to read key as a prop!
  const inputId = ~'mail-' + key~; // Evaluates 'mail-' + undefined -> 'mail-undefined' on every row!
  return (
    <li className="row">
      <input type="checkbox" id={inputId} />
      <label htmlFor={inputId}>
        <b>{from}</b>: {subject}
      </label>
    </li>
  );
}
```

The UI targets the wrong row: clicking Mom's label fails to tick Mom and instead silently ticks Dentist at the top of the inbox, accompanied by a console warning that key is not a prop.

Save the row file, open the browser, and click the text **Mom: Are you coming for Sunday dinner?** on the second row:
1. When the page loads, React prints a red error in the Console saying `key` is not a prop and accessing it returns `undefined`.
2. When you click the label text for Mom on the second row, Mom's checkbox does not get ticked.
3. Instead, clicking Mom's text ticks the Dentist checkbox at the very top of the inbox.

### DOM Desynchronization: Duplicate Identifiers Route Clicks to the First Match

Reading stripped keys causes identifier collapse: every row receives `id="mail-undefined"`, forcing browser label clicks to find and toggle only the first matching element on the page.
1. In the inbox file, our list passed keys 101, 102, and 103 to the three row component tags.
2. React kept those three numbers as internal keys and stripped `key` off before building `props`, so the row component received only `from` and `subject`.
3. Inside the row component, unpacking `key` from the props object gave `undefined` on all three rows.
4. Joining the mail prefix with `undefined` produced the exact same string `'mail-undefined'` on all three rows.
5. In the browser DOM, Row 1 for Dentist, Row 2 for Mom, and Row 3 for Bank all received `'mail-undefined'` on both their input `id` and their label `for` attribute.
6. When you clicked Mom's label on Row 2, the browser searched the document from the top for the first input whose `id` was `'mail-undefined'`. That first input is the Dentist checkbox on Row 1, so clicking Mom or Bank always toggles Dentist.

### Dual Prop Assignment: Passing Separate Identifiers for React and Component Logic

To give both React and `EmailRow` the email's ID, we pass it twice on the row tag in the inbox file:

```jsx title="src/components/Inbox.jsx" startLine="11"
      <ul className="list">
        {emails.map(email => (
          <EmailRow
            ~key={email.id}~ // 1. For React: tracks this EmailRow among its siblings
            ~id={email.id}~ // 2. For EmailRow: arrives inside props as id!
            from={email.from}
            subject={email.subject}
          />
        ))}
      </ul>
```

Then in the row file, we unpack `id` instead of `key` and build the matching ID for the checkbox and its label:

```jsx title="src/components/EmailRow.jsx" startLine="1"
export default function EmailRow({ ~id~, from, subject }) { // Reads id from props: 101, 102, 103
  const inputId = ~'mail-' + id~; // Builds 'mail-101', 'mail-102', and 'mail-103'
  return (
    <li className="row">
      <input type="checkbox" id={inputId} />
      <label htmlFor={inputId}>
        <b>{from}</b>: {subject}
      </label>
    </li>
  );
}
```

Save both files and reload the browser. Now:
1. The Console panel has zero errors and zero warnings.
2. In the browser DOM, the three rows have distinct IDs from `'mail-101'` through `'mail-103'`.
3. Clicking the label text **Mom: Are you coming for Sunday dinner?** ticks Mom's checkbox on the second row.

::: row caption="Reading { key } inside EmailRow.jsx vs. passing id={email.id} alongside key={email.id} and reading { id }."
::: col title="Reading { key } in EmailRow" tag="id='mail-undefined' ticks row 1!" tone=bad
```page size=mini
heading: Inbox
line: [x] Dentist: Your appointment is on Friday | bad
line: [ ] Mom: Are you coming for Sunday dinner? | bad
line: [ ] Bank: Your monthly statement is ready
console: EmailRow: `key` is not a prop. Trying to access it will result in `undefined` being returned.
```
```jsx title="src/components/EmailRow.jsx" bad="1,2"
export default function EmailRow({ key, from, subject }) {
  const inputId = 'mail-' + key;
  return (
    <li className="row">
      <input type="checkbox" id={inputId} />
      <label htmlFor={inputId}><b>{from}</b>: {subject}</label>
    </li>
  );
}
```
```dom
<ul class="list">
! <li class="row"><input id="mail-undefined" type="checkbox"><label for="mail-undefined"><b>Dentist</b>...</label></li>
! <li class="row"><input id="mail-undefined" type="checkbox"><label for="mail-undefined"><b>Mom</b>...</label></li>
</ul>
```
Reading `key` gives `undefined` inside the row component, so every row gets the same input ID and clicking Mom ticks Dentist!
:::
::: col title="Passing id={email.id} and Reading { id }" tag="clicking Mom ticks Mom" tone=good
```page size=mini
heading: Inbox
line: [ ] Dentist: Your appointment is on Friday
line: [x] Mom: Are you coming for Sunday dinner? | good
line: [ ] Bank: Your monthly statement is ready
console: quiet
```
```jsx title="src/components/EmailRow.jsx" good="1,2"
export default function EmailRow({ id, from, subject }) {
  const inputId = 'mail-' + id;
  return (
    <li className="row">
      <input type="checkbox" id={inputId} />
      <label htmlFor={inputId}><b>{from}</b>: {subject}</label>
    </li>
  );
}
```
```dom
<ul class="list">
+ <li class="row"><input id="mail-101" type="checkbox"><label for="mail-101"><b>Dentist</b>...</label></li>
+ <li class="row"><input id="mail-102" type="checkbox"><label for="mail-102"><b>Mom</b>...</label></li>
</ul>
```
Now `key` stays with React while `id` reaches the row component, giving each checkbox and label its own distinct ID.
:::
:::

> [!PRINCIPLE]
> **Principle 3: Prop Isolation: React Strips key and Demands an Explicit Prop for Child Access**
>
> *Never try to read `props.key` inside a child component; pass the identifier a second time as a separate prop such as `id`.*
>
> This catches many developers off guard. Even though `key` sits right beside normal props on the tag, React keeps that key for itself and strips it off before creating `props`. If your child component tries to unpack `key` from its props, it gets `undefined` and triggers a red Console error. Whenever your row component also needs that identifier, pass it a second time under a normal prop name like `id`.
>
> **DO THIS:**
> ```jsx
> export default function EmailRow({ ~id~, from, subject }) { // Reads id passed alongside key={email.id}
>   const inputId = ~'mail-' + id~; // 'mail-101', 'mail-102', 'mail-103'
>   return (
>     <li className="row">
>       <input type="checkbox" id={inputId} />
>       <label htmlFor={inputId}><b>{from}</b>: {subject}</label>
>     </li>
>   );
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function EmailRow({ ~key~, from, subject }) { // **WRONG:** key is stripped by React and is undefined!
>   const inputId = ~'mail-' + key~; // **WRONG:** 'mail-undefined' on every row!
>   return (
>     <li className="row">
>       <input type="checkbox" id={inputId} />
>       <label htmlFor={inputId}><b>{from}</b>: {subject}</label>
>     </li>
>   );
> }
> ```

---

## 4. Principle 4: Key Stability: Positional Indices Corrupt State, Random Keys Rebuild the DOM

### Identity vs. Position: Comparing Positional Indices, Unstable Randoms, and Data IDs

React reconciles list items by matching keys across renders to reuse existing DOM nodes: using array index binds identity to position, transferring DOM state to prepended items, while generating keys with `Math.random` forces React to tear down and recreate every DOM node on every frame.

Let us examine the two ways of naming three people before and after Zoe arrives at the top of the list. First, look at what happens to each person's key when we use the second parameter of `.map`, the array index:

```jsx title="Way A: Using the array index as the key before and after Zoe is added at the top"
const render1ByIndex = [~<li key={0}>Anna</li>~, <li key={1}>Ben</li>, <li key={2}>Cara</li>]; // Render 1: key={0} is Anna

const render2ByIndex = [~<li key={0}>Zoe</li>~, ~<li key={1}>Anna</li>~, <li key={2}>Ben</li>, <li key={3}>Cara</li>]; // Render 2: key={0} is now Zoe, and Anna moved to key={1}!
```

Second, look at what happens to each person's key when we use the `id` property stored on each person's object:

```jsx title="Way B: Using person.id from the data before and after Zoe is added at the top"
const render1ById = [~<li key={1}>Anna</li>~, <li key={2}>Ben</li>, <li key={3}>Cara</li>]; // Render 1: key={1} is Anna

const render2ById = [~<li key={4}>Zoe</li>~, ~<li key={1}>Anna</li>~, <li key={2}>Ben</li>, <li key={3}>Cara</li>]; // Render 2: Zoe gets key={4}, and key={1} is still Anna!
```

On Render 1, Way A and Way B display the exact same three rows, and neither one prints a Console warning. When `key` is omitted altogether, React falls back to using the array index under the hood and warns in the Console. Passing `index` as the `key` explicitly only silences the Console warning while keeping that exact same index behavior. Keying by `index` and keying by `person.id` are not the same thing:

**Positional keys reassign existing DOM nodes on insert: index keys tie DOM elements to array slot numbers rather than data items, transferring checked state and focus to newly prepended items.**
1. In Way A with `index` as the key, Anna was at key 0 on Render 1, and Zoe is at key 0 on Render 2. React matches elements from one render to the next by their `key`. React thinks key 0 is still the same first row and simply changes its text from Anna to Zoe. Any ticked checkbox or typed input at key 0 stays at the top attached to Zoe.
2. In Way B with `person.id` as the key, Anna has key 1 on Render 1 and still has key 1 on Render 2. React sees that key 1 moved down one slot and keeps that DOM node and its ticked checkbox with Anna. Then React creates a fresh unticked row at the top for Zoe at key 4.

Compare calling an ID generator once when the data item is created versus calling an ID generator inside `.map` during render:

```jsx title="Creating an ID once with the data vs. calling Math.random inside .map during render"
const newPerson = { ~id: crypto.randomUUID()~, name: 'Zoe' }; // RIGHT: generated once when the new item object is created!

const badRows = people.map(person => <Person ~key={Math.random()}~ name={person.name} />); // **WRONG:** generated inside .map on every single render!
```

Both lines call a function that produces a unique value, but they are not the same thing. An `id` stored inside `newPerson` is created once and stays identical across every future render. By contrast, calling `Math.random` or a UUID helper inside `.map` produces a brand-new key on every render. React never finds a matching key from the previous render, so it destroys and recreates every DOM node in the list on every re-render.

```tree caption="How React matches rows across renders under key={index}, key={Math.random}, and key={email.id}."
What React does when `Shop` arrives at the top after the reader ticked `Dentist`
- !`key={index}` [`0`, `1`, `2` -> `0`, `1`, `2`, `3`] | Key `0` belonged to `Dentist`, and now key `0` belongs to `Shop` | React reuses key `0`'s ticked `<input>` for `Shop`: **`Shop` steals the tick mark!**
- !`key` from `Math.random` [brand-new random keys on every render] | Zero keys from the previous render match the new keys | React **destroys all old `<li>` and `<input>` DOM nodes** and mounts fresh unticked ones: **the tick is wiped out!**
- +`key={email.id}` [`101`, `102`, `103` -> `104`, `101`, `102`, `103`] | Key `101` stays with `Dentist`, and `104` is a new key for `Shop` | React inserts a fresh unticked row for `104` and **keeps key `101`'s ticked `<input>` with `Dentist`!**
```

### The Stolen State Trap: Index Keys Reassign DOM Nodes to Shifted Items

Let us make our inbox interactive by storing `emails` in state with `useState` (as seen in Lesson 12). We also add a `Check mail` button that prepends a new email from `Shop` at the top of the list.

First, watch what happens when a developer uses the item's position number `index` from `.map` as the key on the row component:

```jsx title="src/components/Inbox.jsx" startLine="1"
import { useState } from 'react';
import EmailRow from './EmailRow.jsx';

const initialEmails = [
  { id: 101, from: 'Dentist', subject: 'Your appointment is on Friday' },
  { id: 102, from: 'Mom', subject: 'Are you coming for Sunday dinner?' },
  { id: 103, from: 'Bank', subject: 'Your monthly statement is ready' }
];

let nextId = 104;

export default function Inbox() {
  const [emails, setEmails] = useState(initialEmails);

  function handleCheckMail() {
    const newEmail = {
      id: nextId++,
      from: 'Shop',
      subject: 'Your parcel has shipped'
    };
    ~setEmails([newEmail, ...emails])~; // Places the new Shop email at index 0 at the top of the list!
  }

  return (
    <section className="inbox">
      <h1>Inbox</h1>
      <button onClick={handleCheckMail}>Check mail</button>
      <ul className="list">
        {emails.map((email, ~index~) => ( // Receives the array position index 0, 1, 2 as the 2nd parameter
          <EmailRow
            ~key={index}~ // **WRONG:** uses the array position 0, 1, 2 as the key!
            id={email.id}
            from={email.from}
            subject={email.subject}
          />
        ))}
      </ul>
    </section>
  );
}
```

The interface reassigns user selection to an unread message: clicking Check mail causes the new Shop email at the top to steal the tick mark from Dentist, leaving Dentist unticked on the second row with zero console warnings.

**Positional keys transfer existing DOM state: prepending an item shifts array indices, causing React to reuse index 0's checked DOM node for the new message.**
1. When the page loads, Dentist is at index 0, Mom is at index 1, and Bank is at index 2. The Console panel is completely silent with zero warnings.
2. You tick the checkbox next to **Dentist: Your appointment is on Friday**. Because the checkbox has no `checked` prop, the browser stores the ticked state inside that first input DOM node belonging to key 0.
3. Now you click **Check mail**. The handler creates the Shop email and puts it at the front of the state array. Now Shop sits at index 0, while Dentist shifts to index 1, Mom to index 2, and Bank to index 3.
4. Look at the screen after clicking **Check mail**: **Shop at the top of the list is now ticked, and Dentist on the second row is unticked!**

### Reconciliation Breakdown: Positional Key Reuse Preserves DOM Checkbox State

React identifies nodes solely by key: finding matching keys preserves existing DOM nodes and inputs, updating only mismatched props.
1. Before clicking Check mail, the first row had key 0 for Dentist with a ticked input, while Mom had key 1 and Bank had key 2.
2. After clicking Check mail, the first row has key 0 for Shop, and Dentist shifts down to key 1.
3. React matches old elements to new elements solely by their `key`. React looks at the new Shop element at key 0 and sees an existing row for that key from the last render. React keeps that exact same `<li>` and `<input>` DOM node in place and updates its text props from Dentist to Shop.
4. Because React reused the first `<input>` DOM node for key 0, the browser's ticked state stayed inside that first input, which now displays Shop. Meanwhile, Dentist moved to key 1, which reused Mom's old unticked input node, and Bank mounted at key 3 as a new unticked node.

### The DOM Teardown Trap: Unstable Keys Destroy Component Instances and State

To avoid reusing shifted position numbers, developers sometimes generate a random key during rendering:

```jsx title="src/components/Inbox.jsx" startLine="27"
      <ul className="list">
        {emails.map(email => (
          <EmailRow
            ~key={Math.random()}~ // **WRONG:** generates a brand-new random number on every render!
            id={email.id}
            from={email.from}
            subject={email.subject}
          />
        ))}
      </ul>
```

The interface completely wipes all user interactions: clicking Check mail renders the new message but silently unchecks every checkbox on the entire page.

**Unstable keys trigger full DOM teardown: generating keys during render produces zero matches between renders, forcing complete unmounting and state annihilation.**
1. Tick the checkbox next to **Dentist: Your appointment is on Friday**.
2. Click **Check mail**.
3. Shop appears at the top of the list, and every single checkbox in the inbox is now unticked. Your tick on Dentist vanished completely.

Calling `Math.random` runs during render. On initial render, the three rows received three random keys. When you clicked Check mail, `Inbox` re-rendered and `Math.random` generated four completely different numbers. Finding zero matching keys from the previous render, React unmounted and destroyed all three old `<li>` and `<input>` DOM nodes and constructed four brand-new unticked inputs from scratch. Calling `Math.random` in `key` rebuilds the DOM on every render and destroys all local input focus, checkbox selections, and component state.

### True Reconciliation: Stable Data Identifiers Preserve State Across List Mutations

Stable data identifiers ensure persistent node mapping: matching keys by unique data ID moves existing DOM nodes with their state and mounts only truly new items.

Keys must originate from stable sources:
1. When data comes from a database or API, use the unique database ID already stored on each object, such as `email.id`.
2. When a new item is created locally in the browser, generate its ID once when the object is created inside the event handler. Use an incrementing counter like `nextId++` or `crypto.randomUUID`, and store that ID on the new item object.

Now let us switch the row tag in our inbox file to use the stable ID stored on each email object:

```jsx title="src/components/Inbox.jsx" startLine="27"
      <ul className="list">
        {emails.map(email => (
          <EmailRow
            ~key={email.id}~ // Stable ID from the email object: 101, 102, 103, and 104 for Shop
            id={email.id}
            from={email.from}
            subject={email.subject}
          />
        ))}
      </ul>
```

Now run the exact same test in the browser:

**Stable data identifiers ensure persistent node mapping: matching keys by unique data ID moves existing DOM nodes with their state and mounts only truly new items.**
1. On initial load, Dentist has key 101, Mom has key 102, and Bank has key 103.
2. Tick the checkbox next to **Dentist: Your appointment is on Friday**, which has key 101.
3. Click **Check mail**. The handler creates the Shop email with ID 104 and updates the array.
4. React compares the three old keys with the four new keys. React sees that 101, 102, and 103 are the exact same rows as before, and 104 is one new row at the top.
5. React inserts one fresh unticked `<li>` at the top for Shop at key 104. And it keeps Dentist's existing `<li>` and ticked `<input>` DOM node attached to **Dentist** on the second row.

Using the array `index` as a key is permissible only when all three constraints are met simultaneously:
1. The list is static and its items are never reordered, inserted at the top or middle, filtered, or deleted.
2. The items have no stable ID in the data.
3. The list rows hold no local component state from `useState` (as seen in Lesson 12) and no uncontrolled browser state such as checkboxes or text inputs.

::: row caption="Ticking Dentist and clicking Check mail when the list uses key={index} vs. when the list uses key={email.id}."
::: col title="Unstable Position Key: key={index}" tag="Shop steals Dentist's tick at index 0!" tone=bad
```page size=mini
heading: Inbox
row: Check mail
line: [x] Shop: Your parcel has shipped | bad
line: [ ] Dentist: Your appointment is on Friday | bad
line: [ ] Mom: Are you coming for Sunday dinner?
line: [ ] Bank: Your monthly statement is ready
console: quiet
```
```jsx title="src/components/Inbox.jsx" bad="1,3"
{emails.map((email, index) => (
  <EmailRow
    key={index}
    id={email.id}
    from={email.from}
    subject={email.subject}
  />
))}
```
```dom
<ul class="list">
! <li class="row"><input id="mail-104" type="checkbox"><label for="mail-104"><b>Shop</b>...</label></li> | note: Reused key="0" DOM node, still checked!
! <li class="row"><input id="mail-101" type="checkbox"><label for="mail-101"><b>Dentist</b>...</label></li> | note: Reused key="1" DOM node, unchecked!
</ul>
```
Because Shop took over index 0, React reused the first row's ticked `<input>` DOM node for Shop and left Dentist unticked on row 2.
:::
::: col title="Stable Data Key: key={email.id}" tag="Dentist keeps its tick on row 2!" tone=good
```page size=mini
heading: Inbox
row: Check mail
line: [ ] Shop: Your parcel has shipped | good
line: [x] Dentist: Your appointment is on Friday | good
line: [ ] Mom: Are you coming for Sunday dinner?
line: [ ] Bank: Your monthly statement is ready
console: quiet
```
```jsx title="src/components/Inbox.jsx" good="1,3"
{emails.map(email => (
  <EmailRow
    key={email.id}
    id={email.id}
    from={email.from}
    subject={email.subject}
  />
))}
```
```dom
<ul class="list">
+ <li class="row"><input id="mail-104" type="checkbox"><label for="mail-104"><b>Shop</b>...</label></li> | note: Fresh unticked DOM node for key="104"
+ <li class="row"><input id="mail-101" type="checkbox"><label for="mail-101"><b>Dentist</b>...</label></li> | note: Kept key="101" DOM node, still checked!
</ul>
```
Because Dentist kept key 101, React moved Dentist's ticked `<input>` node down to row 2 and inserted a fresh unticked input at the top.
:::
:::

> [!PRINCIPLE]
> **Principle 4: Key Stability: Positional Indices Corrupt State, Random Keys Rebuild the DOM**
>
> *Always key list items by a stable ID stored on the data item, never by the array `index` on reorderable lists or by `Math.random`.*
>
> Keying a list by `index` is a classic trap because it silences the Console warning while tying each row's identity to its position. When a new item arrives at the top of the list, it takes over position 0. React thinks the first row is still the same item and leaves the old first row's ticked checkbox sitting on the new item. And if you call `Math.random` in `key`, every render creates brand-new keys and destroys every row's state. Always use a stable ID that belongs to the data item itself.
>
> **DO THIS:**
> ```jsx
> {emails.map(email => (
>   <EmailRow
>     ~key={email.id}~ // Stable ID stored on the email object: 101, 102, 103, 104
>     id={email.id}
>     from={email.from}
>     subject={email.subject}
>   />
> ))}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> {emails.map((email, index) => (
>   <EmailRow
>     ~key={index}~ // **WRONG:** shifts to a different email when a row is added at the top!
>     id={email.id}
>     from={email.from}
>     subject={email.subject}
>   />
> ))}
> ```

---

## Architectural Synthesis: The Complete Keyed List Lifecycle

### The Unified Webmail Inbox Project Files

Here are the complete, working files for our webmail inbox with all four principles in place.

First, our row file receives the email ID, sender, and subject as normal props and returns a single list item with a linked checkbox and label:

```jsx title="src/components/EmailRow.jsx" startLine="1"
export default function EmailRow({ ~id, from, subject~ }) { // Principle 3: receives id as a normal prop rather than props.key
  const inputId = ~'mail-' + id~; // Builds a unique 'mail-101', 'mail-102', etc. for each row's checkbox and label
  return (
    <li className="row">
      <input type="checkbox" id={inputId} />
      <label htmlFor={inputId}>
        <b>{from}</b>: {subject}
      </label>
    </li>
  );
}
```

Second, our inbox file creates new emails with a stable ID and maps each email to a row component carrying both a key and an ID prop:

```jsx title="src/components/Inbox.jsx" startLine="1"
import { useState } from 'react';
import EmailRow from './EmailRow.jsx';

const initialEmails = [
  { id: 101, from: 'Dentist', subject: 'Your appointment is on Friday' },
  { id: 102, from: 'Mom', subject: 'Are you coming for Sunday dinner?' },
  { id: 103, from: 'Bank', subject: 'Your monthly statement is ready' }
];

let nextId = 104;

export default function Inbox() {
  const [emails, setEmails] = useState(initialEmails);

  function handleCheckMail() {
    const newEmail = {
      ~id: nextId++~, // Principle 4: assigns a stable ID once when the new email object is created
      from: 'Shop',
      subject: 'Your parcel has shipped'
    };
    setEmails([newEmail, ...emails]);
  }

  return (
    <section className="inbox">
      <h1>Inbox</h1>
      <button onClick={handleCheckMail}>Check mail</button>
      <ul className="list">
        {emails.map(email => ~(~ // Principle 1: returns one <EmailRow /> element for each item in emails
          <EmailRow
            ~key={email.id}~ // Principle 2 & 4: stable key placed directly on the element inside .map
            ~id={email.id}~ // Principle 3: passed again as id so EmailRow can read it from props
            from={email.from}
            subject={email.subject}
          />
        ))}
      </ul>
    </section>
  );
}
```

Third, our main application file renders the inbox component inside the page wrapper:

```jsx title="src/App.jsx" startLine="1"
import Inbox from './components/Inbox.jsx';

export default function App() {
  return (
    <main className="page">
      ~<Inbox />~ // Renders the complete Inbox component
    </main>
  );
}
```

### End-to-End Execution Flow: Reconciliation Under List Insertion

Here is the finished `Inbox` page in the browser after the reader ticks the Dentist email and clicks `Check mail` to receive Shop:

```page caption="The finished Inbox page after clicking Dentist's label to tick it and clicking Check mail: Shop arrives unticked at the top while Dentist keeps its tick on row 2."
heading: Inbox
row: Check mail
line: [ ] Shop: Your parcel has shipped | good
line: [x] Dentist: Your appointment is on Friday | good
line: [ ] Mom: Are you coming for Sunday dinner? | good
line: [ ] Bank: Your monthly statement is ready | good
console: quiet
```

And here is how all four principles connect inside the component tree from `App` down to the four `EmailRow` instances:

```tree caption="How React renders App, Inbox, and the four keyed EmailRow instances after Shop arrives at the top of the list."
`App`
- `Inbox` [holds `emails` state with 4 objects] | Maps `emails` to 4 `<EmailRow />` elements inside `<ul className="list">`
  - +`EmailRow` `key="104"` [props: `id={104}`, `from="Shop"`] | New key at the top | Mounts a fresh unticked `<input id="mail-104">`
  - +`EmailRow` `key="101"` [props: `id={101}`, `from="Dentist"`] | Matched from previous render by `key="101"` | Keeps its existing **ticked `<input id="mail-101">`** DOM node!
  - +`EmailRow` `key="102"` [props: `id={102}`, `from="Mom"`] | Matched from previous render by `key="102"` | Keeps its existing unticked `<input id="mail-102">` DOM node
  - +`EmailRow` `key="103"` [props: `id={103}`, `from="Bank"`] | Matched from previous render by `key="103"` | Keeps its existing unticked `<input id="mail-103">` DOM node
```

Compare the four plain JavaScript habits that break React lists with the four React rules we proved in this lesson:

| Aspect | The Plain JavaScript Habit | The React Rule |
| :--- | :--- | :--- |
| **Turning an array into rows** | Writing `email => { <li>...</li> }` inside `.map` with curly braces and no `return`, or calling `emails.forEach`, which hands React `undefined`. | Call `emails.map` and return the JSX element on every step using either a short arrow body or `{ return <li ... />; }`. |
| **Where to place `key`** | Extracting `<li>` into `EmailRow.jsx` and leaving `key` on the `<li>` inside the child component instead of on `<EmailRow />`. | Put `key={email.id}` directly on the outermost element or `<Fragment key={email.id}>` returned by `.map`. |
| **Reading the key inside the child** | Unpacking `{ key }` from `props` inside `EmailRow`, which yields `undefined` because React strips `key` from `props`. | Pass `key={email.id}` for React and pass `id={email.id}` as a separate prop whenever the child component needs the ID. |
| **Choosing what value to use as `key`** | Using `key={index}` on a list that can insert, delete, or reorder items, or calling `Math.random` inside `key={...}` in `.map`. | Use a stable ID stored on each data object, `key={email.id}`, that stays with that item across renders. |

---

## For the Interview

> **The Interview Question:** How do you render a list from an array, and why does React demand a stable key on every item?

### How to Answer Clearly in 30 Seconds

"We transform the data array into a new array of JSX elements with `.map` inside curly braces, making sure the callback returns the JSX on every step. Every element in that array needs a `key` that uniquely identifies the item among its siblings so React can match items across renders:
1. **Where `key` sits**: we always place `key` on the outermost element returned directly by `.map`, such as `<EmailRow key={email.id} />` or `<Fragment key={email.id}>`.
2. **`key` is not a prop**: React strips `key` before building `props`, so `props.key` is always `undefined`. When the child component also needs that ID, we pass it again as a normal prop such as `id={email.id}`.
3. **Why `key` must be stable**: Using the array `index` ties identity to position, so adding an item at the top leaves old DOM state on the new item. Calling `Math.random` during render creates new keys on every render and remounts every row from scratch. Instead, we use a stable ID from the data or create one once when the item is created."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why is `key={index}` an anti-pattern when list items can change order, and when is it acceptable?"**
   When you omit `key`, React uses the array `index` by default and logs a warning. Writing `key={index}` only silences the warning while keeping the same position-based matching. Suppose a user ticks a checkbox or types into an input on row `0`, and a new item is inserted at the top of the array. The new item now gets `key={0}`, which existed on the previous render. React reuses the old first row's DOM node and component state for the new item, leaving the tick or typed text on the wrong item. Using `key={index}` is acceptable only when the list is static, items never change order or get filtered, and rows hold no local or DOM state.
2. **"Can a child component read `props.key`, and where must `key` be placed when you extract a list item component?"**
   No. A child component cannot read `props.key`. React consumes `key` for its own list tracking and strips it out before creating the `props` object, so `props.key` is `undefined` and logs a Console error. When you extract a list item into a child component like `EmailRow`, `key={email.id}` must sit directly on `<EmailRow key={email.id} />` inside `.map`. Never hide it on the `<li>` inside `EmailRow.jsx`. When `EmailRow` also needs that identifier for an HTML `id` or handler, pass it a second time under a normal prop name like `id={email.id}`.
3. **"What happens if you call `Math.random` in `key` or need to return multiple sibling elements per list item?"**
   Calling `Math.random` or `crypto.randomUUID` inside `key={...}` in `.map` generates a brand-new key for every row on every render. None of the new keys match the previous render's keys, so React unmounts and destroys every DOM node and child component instance in the list. That wipes out all input focus, ticked checkboxes, and child state on every render. Instead, generate the ID once when the data object is created and store it on `item.id`. And when one data item returns two or more sibling elements without a wrapper `<div>`, import `Fragment` from `'react'` and write `<Fragment key={item.id}>...</Fragment>`.

```tree dir=right caption="How the four principles of rendering lists with keys fit together."
Rendering Lists with Keys
- +Principle 1 [`.map` returns JSX elements] | `.map` builds a new array of JSX elements without mutating data | Always return the JSX element from `.map` using a short arrow body or `{ return <li />; }`
- +Principle 2 [`key` sits directly inside `.map`] | Names each item among its siblings in the array | Put `key={item.id}` on `<EmailRow key={item.id} />` or `<Fragment key={item.id}>` inside `.map`
- +Principle 3 [`key` is not a prop] | React strips `key` before building `props`, so `props.key` is `undefined` | Pass `key={item.id}` for React and `id={item.id}` as a separate prop for the child
- +Principle 4 [Stable key from data] | `key={index}` shifts identity on insert or reorder; `Math.random` remounts every row | Use a stable `item.id` from the database or generated once when the item is created
```
