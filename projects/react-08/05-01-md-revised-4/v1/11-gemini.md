# Lecture 11: Rendering Lists and Keys
> INTERVIEW QUESTION | ❱ CORE | How do you render a list from an array, and why does React demand a key on every item?

::: pagebreak

# React Rendering Lists

## Two different ways to render one row per email

A mail app displays many emails. Each email appears as a row with the same parts: a selection tick box, the sender, and the subject line. On the page, each row is one DOM element with an interactive checkbox. Only the data differs from row to row. There are two different ways to turn email data into rows.

```tree caption="Two ways to get one row per email: write each tag by hand, or draw the rows from the array."
Two different ways to render one row per email
- Fixed: written by hand | one tag per email, typed into the JSX
- Dynamic: rendering a list from an **array** | one tag, repeated for every email in the array
```

> [!FACT] An array keeps its values in order and counts them from 0. In `emails`, an array of email objects, `emails[0]` is the first email, `emails[1]` the second, and `emails[2]` the third.

We compare the two ways inside a component's return. `EmailRow` draws one row from the email object it receives. With three emails in `emails`, both ways show the same three rows. Then a new email arrives at the top of the array, where a mail app puts new incoming mail.

::: row caption="A fourth email arrives at the top of the array. Compare the two inboxes."
::: col title="Fixed: written by hand" tone=bad
```mail size=mini
email: Sara Kim | Lunch on Friday? | | unread
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | unread
email: Anna Lee | Team meeting moved
line: Photos from the trip is missing | bad
```
```jsx
<form>
  <EmailRow email={~emails[0]~} /> {/* One tag typed per email: hardcoded count */}
  <EmailRow email={emails[1]} />
  <EmailRow email={emails[2]} />
</form>
```
With four emails in the array, the page still shows only the first three rows. The fourth email is missing from the inbox until a developer edits the component.
:::
::: col title="Dynamic: from the array" tone=good
```mail size=mini
email: Sara Kim | Lunch on Friday? | | unread good
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | unread
email: Anna Lee | Team meeting moved
email: Mom | Photos from the trip
```
```jsx
<form>
  {emails.map(~email => (~ /* One tag, repeated for every item in the array */
    <EmailRow email={email} />
  ))}
</form>
```
With four emails in the array, the page displays all four rows from a single tag. Principle 1 explains how `map()` turns data into elements.
:::
:::

Why does the difference matter? Written by hand, the component must know how many emails exist and in what order. Every new item requires editing code. Drawn dynamically from the array, a new email is simply one more object in the data. The component adapts instantly with zero code changes.

> [!FACT] Each JSX tag, such as `<EmailRow />`, creates a **React element**: an immutable description of what to render, not yet a DOM element on the page. React reads the array of elements and builds the real DOM nodes.

Transforming an array of data objects into an array of React elements is called **rendering a list**.

## Rendering a list: four steps in two pairs

Rendering a list takes four steps in two pairs. The first pair creates the rows from the array. The second pair keeps the rows stable when the list changes, so each row stays attached to its own email.

```tree caption="The four steps of rendering a list: first create the rows, then update them correctly when the list changes."
Dynamic: rendering a list from an array
- Create the rows | from the array to the page
  - Rows for every email | `map()`
  - Rows for only some emails | `filter()`, then `map()`
- Update the rows when the list changes | each row stays with its email
  - Key from the email's id | not from its position
  - Key on the tag `map()` returns | not inside the row
```

We take the steps in this order because each builds on the one before it. `map()` comes first because every later step transforms the array it gives back. `filter()` narrows the collection before `map()` runs. The key names the elements that `map()` creates, and placement ensures React reads that key on the outer element.

::: pagebreak

# Principles

## 1. Rows for every email: map()

*How? `map()` transforms each data object into a React element in a new array*

```tree size=mini here="Rows for every email"
Dynamic: rendering a list from an array
- Create the rows
  - Rows for every email
  - Rows for only some emails
- Update the rows when the list changes
  - Key from the email's id
  - Key on the tag `map()` returns
```

> [!FACT] An **arrow function** with parentheses or an expression directly after `=>` has a concise body: it gives back that expression. When curly braces `{ }` follow `=>`, the function has a block body: it gives back only what an explicit `return` names, and without `return` it gives back `undefined`.

> [!FACT] **`forEach()`** iterates over an array and always returns `undefined`. **`map()`** calls a function on each item and collects what the function returns into a new array. Inside JSX braces, statements like `for` loops cannot be written; JSX accepts only expressions that evaluate to a value.

> [!PRINCIPLE]
> **Principle 1: Rows for every email: `map()`**
>
> To show one element per item, we call `map()` on the array inside JSX braces.
>
> The arrow function can give back the element directly inside parentheses `( )`. Or it can open curly braces `{ }`, where it needs an explicit `return`.
>
> *We should do this:*
>
> ```jsx
> function EmailList() {
>   return (
>     <form>
>       {emails.map(~email => (~ // Parentheses: the row element is returned
>         <EmailRow email={email} />
>       ))}
>     </form>
>   );
> }
> ```
>
> *We should not do this:*
>
> ```jsx
> function EmailList() {
>   return (
>     <form>
>       {emails.map(~email => {~ // **PROBLEMATIC:** block body with no return
>         <EmailRow email={email} />;
>       })}
>     </form>
>   );
> }
> ```

### Example: curly braces after the arrow with no return

When curly braces follow the arrow without a `return` keyword, every call returns `undefined`. The component returns an array of `undefined` values, so no rows appear on the page. The browser shows no crash, leaving an empty space.

```hierarchy
EmailList | holds: `emails`, three objects, imported | here: draws one row per email
  EmailRow | gets: one `email`
notes:
`EmailList`, in `EmailList.jsx`, imports the array from `emails.js` and places one `EmailRow` per email.
`App` renders `<EmailList />` where the list belongs.
`EmailRow`, in `EmailRow.jsx`, draws a tick box, the sender, and the subject from the `email` it receives.
We want: three rows from one tag, and a fourth row automatically when a fourth email is added to `emails.js`.
```

We compare the two ways of writing `map()` inside `<form>`, using the three emails in `emails.js`. With curly braces and no `return`, the inbox stays empty. With parentheses, all three rows appear.

::: row caption="The same map() with three emails: curly braces after the arrow, then parentheses."
::: col title="Curly braces `{ }`, no `return`" tone=bad
```mail size=mini
empty: no rows
```
```devconsole
= No messages
```
```jsx
{emails.map(~email => {~ // **PROBLEMATIC:** braces without return yield undefined
  <EmailRow email={email} />;
})}
```
Each call returns `undefined`: the inbox shows zero rows, and the console reports no error.
:::
::: col title="Parentheses `( )`" tone=good
```mail size=mini
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | unread
email: Anna Lee | Team meeting moved
email: Mom | Photos from the trip
```
```devconsole
x Each child in a list should have a unique "key" prop.
```
```jsx
{emails.map(~email => (~ /* Parentheses: each element is returned into the array */
  <EmailRow email={email} />
))}
```
Three rows appear on the page. The console asks for a key prop, which Principle 3 addresses.
:::
:::

`forEach()` fails inside JSX for the same reason: it evaluates to `undefined`, leaving React nothing to place.

```chain caption="What each transformation evaluates to, and what React renders on the page."
!`emails.forEach(...)` -> `undefined` -> nothing to place: no rows
!`emails.map(email => { <EmailRow />; })` -> `[undefined, undefined, undefined]` -> no rows
+`emails.map(email => <EmailRow />)` -> `[<EmailRow>, <EmailRow>, <EmailRow>]` -> three rows
```

Here are the complete components behind this step:

```jsx title="EmailList.jsx" good="7-9" role=PARENT
import { emails } from '../emails.js';
import EmailRow from './EmailRow.jsx';

export default function EmailList() {
  return (
    <form>
      {emails.map(~email => (~ /* Parentheses return each element directly */
        <EmailRow email={email} />
      ))}
    </form>
  );
}
```

```jsx title="EmailRow.jsx" role=CHILD
export default function EmailRow({ email }) {
  return (
    <div className="row">
      <input type="checkbox" name="delete" ~value={email.id}~ /> {/* Tick box */}
      <span className="from">{email.from}</span>
      <span className="subject">{email.subject}</span>
    </div>
  );
}
```

React renders an array of elements in index order. If we store `const rows = emails.map(email => <EmailRow email={email} />);` and inspect it with `console.log(rows)`, Chrome logs an array of three React element objects.

```devconsole caption="The logged element array in Chrome's Console, with its first element opened."
v (3) [{…}, {…}, {…}]
  v 0: {type: ƒ EmailRow, key: null, props: {…}, …}
    type: ƒ EmailRow | Our component function
    key: null | No key provided yet
    > props: {email: {…}} | The email data object
  > 1: {type: ƒ EmailRow, key: null, props: {…}, …}
  > 2: {type: ƒ EmailRow, key: null, props: {…}, …}
```

Every element object holds `type: ƒ EmailRow` and the `email` object in its props. Its `key` is `null`, which triggered the console warning.

```tree dir=right caption="Every technique attempted inside JSX braces to turn an array into elements."
What gives back one element per item?
- +map(), concise arrow with ( ) | an array of elements: one row per item
- +map(), block arrow with return | the same array of elements
- !map(), block arrow without return | undefined for every item: blank page
- !forEach() | undefined: blank page
- !a for loop statement | invalid syntax inside JSX expressions
```

## 2. Rows for only some emails: filter(), then map()

*When? A folder shows only its own emails, and a folder can be empty*

```tree size=mini here="Rows for only some emails"
Dynamic: rendering a list from an array
- Create the rows
  - Rows for every email
  - Rows for only some emails
- Update the rows when the list changes
  - Key from the email's id
  - Key on the tag `map()` returns
```

> [!FACT] **`filter()`** calls a test function on each item and returns a new array holding only the items that returned `true`. When no items pass, it returns an empty array with `length === 0`. Neither `filter()` nor `map()` modifies the source array.

> [!FACT] In JavaScript, `a && b` evaluates to `a` when `a` is falsy (`0`, `false`, `null`, `""`). In JSX, React renders `false` and `null` as nothing, but it renders numeric `0` directly as text on the page. A boolean comparison like `length > 0` evaluates to true or false.

> [!PRINCIPLE]
> **Principle 2: Rows for only some emails: `filter()`, then `map()`**
>
> To show only matching items, call `filter()` before `map()`. It keeps only the items that pass a predicate.
>
> When no items match, the array length is `0`. Check `shown.length > 0` with a ternary to render a fallback message. A bare `shown.length &&` renders a literal `0` on the page.
>
> *We should do this:*
>
> ```jsx
> function EmailList({ folder }) {
>   const shown = emails.filter(email => email.folder === folder);
>   const rows = shown.map(email => <EmailRow email={email} />);
>   return (
>     <section>
>       <h2>{folder}</h2>
>       {~shown.length > 0~ ? rows : <p>No emails here.</p>} // Clean fallback
>     </section>
>   );
> }
> ```
>
> *We should not do this:*
>
> ```jsx
> function EmailList({ folder }) {
>   const shown = emails.filter(email => email.folder === folder);
>   const rows = shown.map(email => <EmailRow email={email} />);
>   return (
>     <section>
>       <h2>{folder}</h2>
>       {~shown.length~ && rows} // **PROBLEMATIC:** 0 renders on the page
>     </section>
>   );
> }
> ```

### Example: placing a bare length left of &&

When a folder is empty, `shown.length` is `0`. Writing `{shown.length && rows}` causes JavaScript to evaluate `0 && rows`, which short-circuits to numeric `0`. React prints that `0` directly under the heading.

```hierarchy layout=stack
App | holds: two folder sections, Inbox and Spam
  EmailList | gets: `folder="Inbox"` | holds: three emails, after `filter()` | here: chooses Inbox rows
    EmailRow | gets: one `email`
  EmailList | gets: `folder="Spam"` | holds: no email, after `filter()` | here: chooses a message
notes:
`App` renders `EmailList` twice, once for "Inbox" and once for "Spam", passing the folder name as a prop.
Each `EmailList` filters `emails` by matching `folder`, then maps the surviving items into `<EmailRow>` elements.
All three sample emails belong to Inbox; zero emails belong to Spam.
We want: the Inbox section shows three rows, while the Spam section shows a friendly message, never a raw 0.
```

We compare the two conditional patterns for an empty folder:

::: row caption="With three Inbox emails and zero Spam emails: compare the two Spam sections."
::: col title="A bare length left of `&&`" tone=bad
```mail size=mini
section: Inbox
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | unread
email: Anna Lee | Team meeting moved
email: Mom | Photos from the trip
section: Spam
raw: 0 | bad
```
```jsx
{~shown.length~ && rows} {/* **PROBLEMATIC:** 0 is falsy, but renders as text */}
```
For Spam, `shown.length` is `0`. The `&&` operator returns `0`, rendering a bare digit into the DOM.
:::
::: col title="`length > 0` with a ternary" tone=good
```mail size=mini
section: Inbox
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | unread
email: Anna Lee | Team meeting moved
email: Mom | Photos from the trip
section: Spam
line: No emails here. | good
```
```jsx
{~shown.length > 0~ ? rows : <p>No emails here.</p>} {/* True boolean */}
```
For Spam, `0 > 0` evaluates to `false`. The ternary renders the fallback message `<p>No emails here.</p>`.
:::
:::

Here is how each expression evaluates when the list is populated versus empty:

| folder | `filter()` returns | `shown.length` | `shown.length && rows` | the page shows |
| --- | --- | --- | --- | --- |
| Inbox | three emails | `3` | `rows` (element array) | three email rows |
| !Spam | `[]` (empty array) | `0` | `0` (number) | a bare digit 0 |

```tree dir=right caption="Three ways to handle an empty list state in JSX."
What does an empty folder show?
- !`{rows}` alone | blank empty space under the heading
- !`{shown.length && rows}` | a bare digit 0 rendered into the DOM
- +`shown.length > 0 ? rows : fallback` | the intended empty state message
```

`filter()` must run before `map()`, ensuring React only instantiates component elements for items that should actually display.

## 3. Key from the email's id, not its position

*Why? Without a key, React reconciles DOM elements by array index position*

```tree size=mini here="Key from the email's id"
Dynamic: rendering a list from an array
- Create the rows
  - Rows for every email
  - Rows for only some emails
- Update the rows when the list changes
  - Key from the email's id
  - Key on the tag `map()` returns
```

> [!FACT] Form controls like checkboxes hold their checked state directly inside browser DOM elements. When an uncontrolled input changes, that state lives in the DOM node, not in your JavaScript array.

> [!FACT] A **key** is a reserved React prop (`key={email.id}`). During re-rendering, React diffs the new element tree against the existing DOM nodes. With keys, React matches elements by identifier. Without keys, React matches elements strictly by array position (index 0 to index 0, index 1 to index 1).

> [!PRINCIPLE]
> **Principle 3: Key from the email's id, not its position**
>
> Always give each element a `key` taken from the item's own stable identifier. React uses the key to preserve DOM identity across re-renders.
>
> Never use the array index for dynamic lists where items can be inserted, deleted, or reordered. Never generate keys during rendering like `Math.random()`.
>
> *We should do this:*
>
> ```jsx
> function EmailList() {
>   return (
>     <form>
>       {emails.map(email => (
>         <EmailRow ~key={email.id}~ email={email} /> // Stable identity
>       ))}
>     </form>
>   );
> }
> ```
>
> *We should not do this:*
>
> ```jsx
> function EmailList() {
>   return (
>     <form>
>       {emails.map((email, index) => (
>         <EmailRow ~key={index}~ email={email} /> // **PROBLEMATIC:** index shifts
>       ))}
>     </form>
>   );
> }
> ```

::: page tint=blue kicker="Example" title="How to delete the wrong email"
Our inbox has data in two different places: the `emails` array in JavaScript memory, and the list of DOM elements on the screen.

```twolists
left: The `emails` array of objects, in JavaScript memory
{ id: 1, subject: '🔥 FLASH SALE: Extra 15% off' }
{ id: 2, subject: 'Team meeting moved' }
{ id: 3, subject: 'Photos from the trip' }
right: The list of DOM elements, rendered in the browser
🔥 FLASH SALE: Extra 15% off
Team meeting moved
Photos from the trip
note: Without keys, the two lists are paired strictly by index position.
```

::: comic layout=think
::: panel step=1 title="We tick “🔥 FLASH SALE: Extra 15% off”."
```mail table
toolbar: Delete selected
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | checked good pointer id:1
email: Anna Lee | Team meeting moved | | id:2
email: Mom | Photos from the trip | | id:3
```

> [!THINK] I want to delete this spam email. I check the box next to “🔥 FLASH SALE”.

Behind the scenes: the checkmark is stored inside the checkbox DOM element at position 0 on the screen.
:::
::: panel step=2 title="A new email arrives at the top of the array." tone=bad
```mail table
toolbar: Delete selected
email: Sara Kim | Lunch on Friday? | | checked unread bad id:4
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | id:1
email: Anna Lee | Team meeting moved | | id:2
email: Mom | Photos from the trip | | id:3
```

> [!THINK] A new email arrives from Sara: “Lunch on Friday?”. Why is Sara's email checked?

Behind the scenes: the array received a new object at index 0. Because elements had no stable keys, React kept DOM node 0 in place and merely updated its text. The checkmark remained inside DOM node 0.
:::
::: panel step=3 title="We click Delete selected." tone=bad
```mail table
toolbar: Delete selected | clicked
sent: sent to the server: `delete=4`, the id of “Lunch on Friday?”
email: Sara Kim | Lunch on Friday? | | checked unread id:4
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | id:1
email: Anna Lee | Team meeting moved | | id:2
email: Mom | Photos from the trip | | id:3
```

> [!THINK] I click Delete selected to remove the spam.

Behind the scenes: the checkbox in DOM node 0 now carries `value="4"`. The form sends `delete=4` to the server.
:::
::: panel step=4 title="After the delete." tone=bad
```mail table
toolbar: Delete selected
email: Sara Kim | Lunch on Friday? | | deleted id:4
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | bad id:1
email: Anna Lee | Team meeting moved | | id:2
email: Mom | Photos from the trip | | id:3
```

> [!THINK] Sara's lunch invitation was deleted, and the spam email is still in my inbox!

Behind the scenes: the DOM nodes failed to follow the data items. Positional reconciliation deleted the wrong record.
:::
:::

When items lack unique keys, React matches by array position. Inserting an item at index 0 shifts every subsequent item down, but leaves local DOM state attached to old index positions.
:::

```hierarchy
EmailList | holds: the `emails` array, each object with its own `id` | here: assigns keys
  EmailRow | gets: one `email` object | holds: one DOM element with checkbox
notes:
`EmailList` maps over `emails` and renders each `EmailRow`.
Each `EmailRow` mounts a DOM node with an uncontrolled checkbox input.
When `emails` changes, React must match existing DOM nodes to the new elements.
We want: the checkmark on the spam email stays on the spam email when a new item arrives at index 0.
```

> [!AHA] What is going on
> 1. **Data in memory and DOM elements on screen are separate lists.** The array lives in JavaScript heap memory; the checkboxes live in the browser's DOM tree.
> 2. **React builds DOM nodes from elements.** On initial render, React creates three DOM row nodes matching array indices 0, 1, and 2.
> 3. **The user interacts with DOM state.** Checking a box modifies the DOM element directly, outside React state.
> 4. **A new item arrives at index 0.** Sara's email becomes index 0; Flash Sale shifts to index 1.
> 5. **Positional reconciliation without keys.** React inspects index 0, sees DOM node 0 already exists, and updates its text from "Flash Sale" to "Lunch on Friday?".
> 6. **The checkmark is stranded.** DOM node 0 was never moved or recreated, so its checked property remains `true`.
> 7. **Keys establish identity.** With `key={email.id}`, React knows DOM node 1 belongs to id 1. When id 4 arrives, React inserts a brand new DOM node at index 0 and slides DOM node 1 down.
> 8. **The tick stays with the spam.** The checkmark travels with the email it was assigned to.

```chain caption="How React reconciles the checked DOM element when a new email arrives at index 0."
!positional matching (no key or index) -> DOM node 0 kept in place -> checkmark stays on Sara's email -> deletes wrong email
+identity matching (key={email.id}) -> DOM node 1 moved down with Flash Sale -> new DOM node inserted for Sara -> deletes right email
```

Here is how the four key choices behave under item insertion:

::: row caption="Comparing no key, index key, random key, and stable ID key."
::: col title="no key or `key={index}`" tone=bad
```mail size=mini
email: Sara Kim | Lunch on Friday? | | checked unread bad
email: ShopNow | 🔥 FLASH SALE: Extra 15% off
email: Anna Lee | Team meeting moved
```
```jsx
{~key={index}~} {/* **PROBLEMATIC:** index 0 now belongs to the new item */}
```
Both match by position: the tick stays on the first DOM node, shifting onto Sara's email.
:::
::: col title="`key={Math.random()}`" tone=bad
```mail size=mini
email: Sara Kim | Lunch on Friday? | | unread
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | bad | tick lost
email: Anna Lee | Team meeting moved
```
```jsx
{~key={Math.random()}~} {/* **PROBLEMATIC:** re-mounts on every render */}
```
Every render produces a new key. React destroys and recreates every DOM node, destroying input state.
:::
::: col title="`key={email.id}`" tone=good
```mail size=mini
email: Sara Kim | Lunch on Friday? | | unread
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | checked good
email: Anna Lee | Team meeting moved
```
```jsx
{~key={email.id}~} {/* Stable ID preserves DOM identity */}
```
React identifies each node by id. DOM node 1 slides down to position 1, preserving its checkmark.
:::
:::

```tree dir=right caption="The four key strategies and their runtime behavior."
Which key?
- +stable item id (key={email.id}) | DOM identity follows the data: inputs and focus preserved
- !array index (key={index}) | positional matching: inputs shift when items are added or deleted
- !random value (key={Math.random()}) | complete remount on every render: focus and inputs destroyed
- !no key attribute | defaults to positional matching with console warning
```

## 4. Key on the tag map() returns, not inside the row

*Why? React reads keys on the elements of the mapped array, not inside child JSX*

```tree size=mini here="Key on the tag `map()` returns"
Dynamic: rendering a list from an array
- Create the rows
  - Rows for every email
  - Rows for only some emails
- Update the rows when the list changes
  - Key from the email's id
  - Key on the tag `map()` returns
```

> [!PRINCIPLE]
> **Principle 4: Key on the tag `map()` returns, not inside the row**
>
> Always place `key` directly on the outermost JSX element returned inside the `map()` callback.
>
> A `key` placed inside the child component is invisible to the parent list diffing algorithm.
>
> *We should do this:*
>
> ```jsx
> function EmailList() {
>   return (
>     <form>
>       {emails.map(email => (
>         <EmailRow ~key={email.id}~ email={email} /> // On the element map returns
>       ))}
>     </form>
>   );
> }
> ```
>
> *We should not do this:*
>
> ```jsx
> function EmailList() {
>   return (
>     <form>
>       {emails.map(email => (
>         <EmailRow email={email} />
>       ))}
>     </form>
>   );
> }
> function EmailRow({ email }) {
>   return <div ~key={email.id}~>{email.subject}</div>; // **PROBLEMATIC:** buried
> }
> ```

### Example: placing the key inside the child component

When developers inspect DevTools, they see `<div className="row">` repeating. It is tempting to place `key={email.id}` directly on that `<div>` inside `EmailRow.jsx`.

```dom title="Elements panel: three repeating row elements inside form"
<form>
*  <div class="row">...</div>
*  <div class="row">...</div>
*  <div class="row">...</div>
</form>
```

```hierarchy
EmailList | holds: the `map()` returning `<EmailRow>` elements | here: where key belongs
  EmailRow | holds: its own inner `<div>` markup
notes:
`EmailList` calls `map()`, which returns an array of `<EmailRow>` React elements.
React reconciles that array in `EmailList`. It checks elements inside that array for keys.
`EmailRow` returns a `<div>` inside its own render. That `<div>` is not an element in the mapped array.
We want: the key placed where React reconciles the array, clearing the warning.
```

::: row caption="Key placement: inside the child component versus on the mapped tag."
::: col title="Key inside EmailRow" tone=bad
```devconsole
x Each child in a list should have a unique "key" prop. Check the render method of `EmailList`.
```
```jsx
<div ~key={email.id}~ className="row"> {/* **PROBLEMATIC:** buried in child */}
```
React reconciles the array in `EmailList`. It finds no key on `<EmailRow>`, so the warning persists.
:::
::: col title="Key on `<EmailRow>` in `map()`" tone=good
```devconsole
= No messages
```
```jsx
<EmailRow ~key={email.id}~ email={email} /> {/* Outermost mapped element */}
```
React reads `key` directly from the elements in the array. The console is completely clean.
:::
:::

### Keys with container tags, props access, and Fragments

When list items are wrapped inside an HTML container like an `<li>`, the key moves to the `<li>`:

```jsx title="EmailList.jsx" good="3"
<ul className="emails">
  {emails.map(email => (
    <li ~key={email.id}~> {/* Key moves to the outermost tag returned by map */}
      <EmailRow email={email} />
    </li>
  ))}
</ul>
```

React extracts `key` during element creation. Components cannot read `props.key`. Attempting to destructure `key` inside `EmailRow({ key, email })` returns `undefined` and logs a warning:

```devconsole caption="Chrome's Console when a component attempts to read props.key."
x EmailRow: `key` is not a prop. Trying to access it will result in `undefined` being returned.
```

If a child component needs the identifier, pass it explicitly under a different prop name like `id={email.id}`.

> [!FACT] Spreading an object containing a `key` property via `{...props}` into JSX is deprecated in React 19. It triggers: *"A props object containing a "key" prop is being spread into JSX"*. Always write `key` explicitly as its own JSX attribute: `<EmailRow key={email.id} {...props} />`.

> [!FACT] The short Fragment syntax `<> ... </>` cannot accept attributes. When returning multiple sibling tags from `map()`, import and use the explicit `<Fragment key={item.id}>`:

```jsx title="EmailList.jsx" good="2"
{emails.map(email => (
  <Fragment ~key={email.id}~> {/* Explicit Fragment accepts a key prop */}
    <h3>{email.subject}</h3>
    <p>{email.from}</p>
  </Fragment>
))}
```

```tree dir=right caption="Where to place the key across common JSX structures."
Where does the key go?
- +on the custom component | <EmailRow key={email.id} />
- +on the wrapper element | <li key={email.id}><EmailRow /></li>
- +on the explicit Fragment | <Fragment key={email.id}><h3>...</h3><p>...</p></Fragment>
- !inside the child component | React diffs the parent array: key is ignored
- !hidden in a props spread | deprecated: write key directly on the tag
```

## Putting the four together

Here is the complete, production-grade `EmailList` component applying all four disciplines: filtering by folder, mapping elements into `<li>` containers, guarding the empty state with a clean boolean ternary, and assigning stable keys from `email.id`.

**DO THIS:**

```jsx right
import { emails } from '../emails.js';
import EmailRow from './EmailRow.jsx';

export default function EmailList({ folder }) {
  const shown = emails.filter(email => email.folder === folder);
  const rows = shown.map(email => (
    <li key={email.id}>
      <EmailRow email={email} />
    </li>
  ));
  return (
    <section>
      <h2>{folder}</h2>
      {shown.length > 0 ? <ul>{rows}</ul> : <p>No emails here.</p>}
    </section>
  );
}
```

The counterexample below demonstrates the common failure patterns: using array indices as keys (leading to stranded input state when items are prepended) and placing a bare length left of `&&` (rendering a raw digit `0` when the list is empty).

**DO NOT DO THIS:**

```jsx wrong bad="7,14"
import { emails } from '../emails.js';
import EmailRow from './EmailRow.jsx';

export default function EmailList({ folder }) {
  const shown = emails.filter(email => email.folder === folder);
  const rows = shown.map((email, index) => (
    <li key={index}>
      <EmailRow email={email} />
    </li>
  ));
  return (
    <section>
      <h2>{folder}</h2>
      {shown.length && <ul>{rows}</ul>}
    </section>
  );
}
```

## For the interview

- **How do you render a list from an array in React?** Call `.map()` on the array inside JSX braces to transform each data object into a React element. React renders arrays of elements in order. To filter items, chain `.filter()` before `.map()`.
- **Why does React require a key on every list item?** Keys give elements stable identity across renders. When an array changes, React uses keys to match new elements with existing DOM nodes. Without keys, React matches by array index position, causing local DOM state (like input values or checkmarks) to attach to the wrong data when items are inserted, deleted, or sorted.
- **When is using `key={index}` acceptable?** Only when three conditions are met simultaneously: the list is completely static, items are never reordered, filtered, or inserted at the top/middle, and list items have no uncontrolled state or IDs of their own. For all dynamic data, index keys cause subtle state bugs.
- **Why is `key={Math.random()}` an anti-pattern?** Generating keys during render produces a brand new identifier on every single render. React cannot match new elements to old nodes, so it completely destroys and recreates every DOM node from scratch. This wipes input state, loses focus, and degrades performance.
- **Can a child component access its own `key` prop?** No. `key` is reserved by React for reconciliation and is stripped from `props`. Accessing `props.key` returns `undefined` and logs a warning. If the child needs the ID, pass it under another prop name like `id={item.id}`.
- **Where exactly must the key be placed?** Always on the outermost JSX tag returned directly inside the `.map()` callback. If each item is wrapped in an `<li>`, the key belongs on `<li key={item.id}>`, not on the inner component.
- **How do you key multiple sibling tags without extra DOM nodes?** Use the explicit `<Fragment key={item.id}>` syntax imported from `'react'`. The shorthand `<>` syntax does not accept attributes.
- **Why does `{items.length && <List />}` render a 0?** When an array is empty, `items.length` is numeric `0`. In JavaScript, `0 && <List />` evaluates to `0`. React renders numeric `0` directly as text into the DOM. Use a boolean comparison: `items.length > 0 ? <List /> : <EmptyState />`.

## Where you will meet this

- **Dynamic feeds and tables**: Message threads, order histories, and search results where items arrive asynchronously or update in place.
- **Interactive form rows**: To-do lists, shopping cart line items, and dynamic forms where users check boxes, adjust quantities, or delete rows.
- **Server-driven collections**: Database entities that carry immutable primary keys (`id`, `uuid`), which should directly serve as your React keys.
- **Build warnings**: Console errors explicitly reporting *"Each child in a list should have a unique 'key' prop"*, which name the exact component holding the unkeyed `.map()` call.

::: pagebreak

## Summary

```tree caption="The complete list rendering architecture."
Two different ways to render one row per email
- Fixed: written by hand | only for small, static layouts that never change
- Dynamic: rendering a list from an **array** | declarative transformation
  - Create the rows
    - Rows for every email | `map()` with concise arrow or explicit return
    - Rows for only some emails | `filter()` before `map()`, ternary for empty state
  - Update the rows when the list changes
    - Key from the email's id | stable identity across insertions and reordering
    - Key on the tag `map()` returns | placed on outer element, <li>, or <Fragment>
```

**Every item becomes an element through `map()`, filtered items narrow the array before mapping with a clean ternary for empty states, and every row is identified by its stable data ID on the outermost tag.**

::: pagebreak

## Example: an inbox in a mail app

A mail app displays email folders where users can select messages and delete them. Here is the complete application built with the code of Putting the four together, after a user has checked the spam message and a new message has arrived at the top.

```mail caption="The live mail application. Notice the checkmark remains locked to the spam message even after Sara's new email was inserted above it." folder=Inbox count=2
toolbar: Delete selected
section: Inbox
email: Sara Kim | Lunch on Friday? | | unread
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | checked unread good
email: Anna Lee | Team meeting moved
email: Mom | Photos from the trip
section: Spam
line: No emails here. | good
```

Every row displays identical visual structure while presenting distinct data. Each section shows only emails matching its folder. The Spam section is empty and renders its fallback message. The checkmark remains anchored to "FLASH SALE" because stable keys preserved DOM identity.

| element on page | underlying rule | implementation tool |
| --- | --- | --- |
| four rows with identical layout | one element per item in data | `map()` (Principle 1) |
| Inbox shows only Inbox emails | filter items before mapping | `filter()`, then `map()` (Principle 2) |
| Spam displays "No emails here." | empty arrays require fallback | `shown.length > 0 ? ... : ...` (Principle 2) |
| checkmark stays with spam email | DOM identity follows item ID | `key={email.id}` on `<li>` (Principles 3 & 4) |

## The components behind the page

Three components compose the application: `App.jsx`, `EmailList.jsx`, and `EmailRow.jsx`. The data lives in `src/emails.js`.

```hierarchy layout=stack caption="The component hierarchy of the mail application."
App | holds: the form, Delete button, and folder sections
  EmailList | gets: `folder="Inbox"` | holds: filtered emails | here: maps rows with keys
    EmailRow | gets: one `email` | renders: checkbox and email metadata
notes:
`emails.js` holds the array of raw email objects.
`App` renders the top-level form container and mounts `<EmailList folder="Inbox" />` and `<EmailList folder="Spam" />`.
`EmailList` filters the array for its assigned folder, then returns an unorder list of `<EmailRow>` components wrapped in keyed `<li>` tags.
`EmailRow` renders the DOM structure: the uncontrolled checkbox and text elements.
Because each `<li>` carries `key={email.id}`, React tracks DOM nodes by data ID, keeping checkmarks locked to their intended emails.
```
