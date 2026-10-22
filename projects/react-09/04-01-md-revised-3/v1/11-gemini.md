# Lecture 11: Rendering Lists and Keys
> INTERVIEW QUESTION | ❱ CORE | How do you render a list from an array, and why does React demand a key on every item?

::: pagebreak

# React Rendering Lists

## Two different ways to render one row per email

A mail application displays dozens or hundreds of messages, and each one appears as a row with identical structure: a selection checkbox, a sender, and a subject line. In the browser DOM, each row is a real HTML element containing form inputs. Only the dynamic data changes from row to row.

In real applications, list data is dynamic and unpredictable:

* **APIs are unpredictable:** An endpoint might return three emails today and three hundred tomorrow.
* **No custom loop syntax:** Unlike frameworks with custom templating directives like `ngFor` or `v-for`, React relies on standard JavaScript `.map()`.
* **The engine reality:** Whether you write three tags by hand or map an array of five hundred, React receives the exact same thing: a list of elements to display. We compare hardcoded tags with dynamic mapping to see what physically breaks when a new email arrives from the server.

```tree caption="Two ways to get one row per email: write each tag by hand, or draw the rows from the array."
Two different ways to render one row per email
- Fixed: written by hand | one tag per email, typed into the JSX
- Dynamic: rendering a list from an **array** | one tag, repeated for every email in the array
```

> [!FACT] An array keeps its values in order and counts them from 0. In `emails`, an array of email objects, `emails[0]` is the first email, `emails[1]` the second, and `emails[2]` the third.

::: pagebreak

> **TAKEAWAY: Rendering a list: from static tags to dynamic collections**
>
> **The Mechanics:** Hardcoding `<EmailRow email={emails[0]} />` assumes you know ahead of time how many items you have. Real apps do not work like that. Data comes from an API, and a list might have three items today and three thousand tomorrow. Using `.map()` loops through your data array and automatically turns every object into a React component.
>
> **The Advice:** Never copy-paste component tags for list data. Map over your array instead. Whether the API returns zero items or a thousand, `.map()` handles it automatically without you touching the code again.

::: row flow=down caption="A fourth email arrives at the top of the array. The code on top, and under each, the inbox it gives."
::: col title="Fixed: written by hand" tone=bad
```mail size=mini
email: Sara Kim | Lunch on Friday? | | unread
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | unread
email: Anna Lee | Team meeting moved
line: Photos from the trip is missing | bad
```
```jsx
<form>
  <EmailRow email={emails[0]} /> {/* One tag per email */}
  <EmailRow email={emails[1]} />
  <EmailRow email={emails[2]} />
</form>
```
With four emails in the array, the page still shows only three rows. "Photos from the trip" drops off the screen entirely until a developer manually edits the JSX file to add a fourth tag.
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
  {emails.map(email => ( /* One tag for every email */
    <EmailRow email={email} />
  ))}
</form>
```
With four emails in the array, the page immediately displays four rows from a single declarative tag. Principle 1 explains how `map()` turns data into elements.
:::
:::

Why dynamic mapping is essential in production:

* **Static tags require manual code updates:** If data changes in the database, someone has to edit the JSX and deploy new code.
* **Dynamic mapping handles any volume automatically:** Whether the server returns zero items or three thousand, `.map()` renders the exact right count without touching the component.
* **Collections require filtering and sorting pipelines:** Mapping from data allows chaining operations like `.filter()` (Principle 2) and attaching stable keys (Principle 3). Static tags can do neither.

> [!FACT] Each JSX tag, such as `<EmailRow />`, creates a React element: an immutable JavaScript object in memory describing what should appear on screen. It is not a real DOM element. React consumes these element objects and synchronizes them with real browser DOM nodes.

Transforming data collections into UI elements is called **rendering a list**. An array of data objects becomes an array of React element descriptors, and React mounts them into the document in order. Every element in that collection also requires an explicit key, which preserves component identity and user input when items are added, removed, or reordered.

## Rendering a list: four steps in two pairs

Rendering a list follows four architectural steps divided into two logical pairs. The first pair creates the virtual elements from raw data. The second pair maintains element identity and state preservation during updates.

```tree caption="The four steps of rendering a list: first create the rows, then update them correctly when the list changes."
Dynamic: rendering a list from an array
- Create the rows | from the array to the page
  - Rows for every email | `map()`
  - Rows for only some emails | `filter()`, then `map()`
- Update the rows when the list changes | each row stays with its email
  - Key from the email's id | not from its position
  - Key on the tag `map()` returns | not inside the row
```

We review these steps in strict sequence because each step depends directly on the one before it. We master `map()` first, because every subsequent collection pattern operates on the element array it produces. We cover `filter()` next, because filtering runs immediately prior to mapping. Keys come third, because keys name the elements that `map()` produces. Finally, key placement answers where that identifier belongs once you understand what keys accomplish.

::: pagebreak

# Principles

## 1. Turn every array item into a component (e.g. `emails.map()`)

*How? `map()` gives back one element per email, in a new array*

```tree size=mini here="Rows for every email"
Dynamic: rendering a list from an array
- Create the rows
  - Rows for every email
  - Rows for only some emails
- Update the rows when the list changes
  - Key from the email's id
  - Key on the tag `map()` returns
```

> [!PRINCIPLE]
> **Principle 1: (`map-to-elements`) Turn every item into a component (e.g. `emails.map()`)**
>
> **Why it happens:** To turn an array into a list on the screen, we run `map()` inside `{ }`. But there is a trap with the brackets you put after the arrow `=>`. Parentheses `( )` return the element automatically, whereas curly braces `{ }` open a block of code that returns nothing unless you write the word `return`. If you use `{ }` and forget `return`, the page shows a blank list and the console shows zero errors. You see, a function without `return` gives back `undefined`, so `map()` hands React `[undefined, undefined, undefined]`, and React quietly renders nothing for `undefined`.
>
> **The Rule:** Use `map()` with parentheses `item => (<Row />)`, or write an explicit `return` whenever you open curly braces `item => { return <Row />; }`.
>
> *We should do this:*
>
> ```jsx
> function EmailList() {
>   return (
>     <form>
>       {emails.map(email => ( /* Parentheses: the row is given back */
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
>       {emails.map(email => { // **PROBLEMATIC:** curly braces open a body with no return
>         <EmailRow email={email} />; // Never given back: no row
>       })}
>     </form>
>   );
> }
> ```

> [!FACT] An **arrow function** is a concise way to write a function: the parameter, followed by `=>`, followed by the returned value. `email => email.subject` accepts an email object and returns its subject string.

> [!FACT] **`forEach()`** executes a callback for each item in an array and always returns `undefined`. **`map()`** executes a callback for each item and collects every returned value into a brand new array of identical length. In `email => ...`, the parameter holds the first email on the first invocation, the second on the second, and so on.

### Example for Principle 1: Let's open curly braces after the arrow (every call gives back undefined!)

### Component Hierarchy

```hierarchy
page: folders=none
box: EmailList | form
rows: EmailRow | div.row
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | unread
email: Anna Lee | Team meeting moved
email: Mom | Photos from the trip
end
tree:
EmailList | holds: the `emails` array, imported | here: draws one row per email
  EmailRow | gets: one `email`
notes:
The PARENT (`EmailList`) imports the `emails` array and maps each item to an `<EmailRow />` component.
The CHILD (`EmailRow`) receives one `email` object and renders a row with its checkbox, sender, and subject.

Point of failure: the arrow in `emails.map(email => {` opens curly braces with no `return`, so every call gives back `undefined` and the page shows no rows.
```

Let's build a minimal UI of a mail client using only two components, with data imported dynamically from a separate file:

* `emails.js`: our data file, exporting an array of email objects.
* `EmailList.jsx`: the parent component that imports the array and maps each item into a row.
* `EmailRow.jsx`: the child component that renders the row markup: the checkbox, sender, and subject.

First, here is the mock data in `emails.js`:

```js title="emails.js"
export const emails = [ // One object per email
  { id: 1, from: 'ShopNow', subject: '🔥 FLASH SALE: Extra 15% off', folder: 'Inbox' },
  { id: 2, from: 'Anna Lee', subject: 'Team meeting moved', folder: 'Inbox' },
  { id: 3, from: 'Mom', subject: 'Photos from the trip', folder: 'Inbox' },
];
```

Next, here are the two components. In `EmailList.jsx`, notice lines 7 to 9: we open curly braces after the arrow without writing `return`. Because standard `for` loops are statements and cannot sit inside JSX, we must use expressions like `.map()`:

```jsx title="EmailList.jsx" bad="7-9" role=PARENT
import { emails } from '../emails.js'; // The data, one folder up
import EmailRow from './EmailRow.jsx';

export default function EmailList() {
  return (
    <form>
      {emails.map(email => { // **PROBLEMATIC:** curly braces open a body with no return
        <EmailRow email={email} />;
      })}
    </form>
  );
}
```

```jsx title="EmailRow.jsx" role=CHILD
export default function EmailRow({ email }) {
  return (
    <div className="row">
      <input type="checkbox" name="delete" value={email.id} /> {/* A tick box per row */}
      <span className="from">{email.from}</span>
      <span className="subject">{email.subject}</span>
    </div>
  );
}
```

::: pagebreak

### Let's check the page

::: row flow=down caption="The same map() with the three emails in the array: curly braces after the arrow, then parentheses. The code on top, and under each, the page and the Console it gives."
::: col title="Curly braces `{ }`, no `return`" tone=bad
```mail size=mini
empty: no rows
```
```devconsole
= No messages
```
```jsx
{emails.map(email => { // **PROBLEMATIC:** braces: nothing is given back
  <EmailRow email={email} />;
})}
```
With three emails in the array, each function call returns `undefined`. React treats `undefined` children as empty markup, producing zero rows and zero runtime errors.
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
{emails.map(email => ( /* Parentheses: the row is given back */
  <EmailRow email={email} />
))}
```
With three emails in the array, the concise arrow returns each element directly, rendering all three rows. The console warns that keys are missing, which Principle 3 addresses.
:::
:::

### Why does every call give back `undefined`?

> [!FACT] When a curly brace follows `=>`, the arrow function has a **block body**: it returns only what an explicit `return` statement specifies. Without a `return`, it silently returns `undefined`. With parentheses or a bare expression after `=>`, it returns that expression directly.

The implicit return trap happens when switching brackets inside `.map()`:

* **The symptom:** The entire list vanishes from the screen, leaving a blank white area.
* **Zero warnings:** The console shows zero errors and zero warnings, making it look like data never arrived.
* **The mistake:** You wrapped the arrow body in curly braces `{ }` (for example, to add a `console.log`) but forgot the `return` keyword.
* **The evaluation:** In JavaScript, curly braces turn an automatic return into a function block. Without writing `return`, every single iteration quietly returns `undefined`.

The `.map()` method collects whatever your callback returns into a new array. The brackets following the arrow decide what that array contains:

* **Parentheses `( )`:** The arrow returns the React element directly: `[<EmailRow />, <EmailRow />, <EmailRow />]`.
* **Curly braces `{ }` without `return`:** The callback runs, but returns `undefined`: `[undefined, undefined, undefined]`.
* **`forEach()`:** Always returns `undefined` as a whole method, so it can never produce elements for JSX.

```chain caption="What each version gives back for the three emails, and so what the page shows."
!`emails.forEach(...)` -> `undefined` -> nothing to place: no rows
!`emails.map(email => { <EmailRow />; })` -> `[undefined, undefined, undefined]` -> no rows
+`emails.map(email => <EmailRow />)` -> `[<EmailRow>, <EmailRow>, <EmailRow>]` -> three rows
```

We use concise parentheses in `EmailList.jsx` so that the arrow returns each component element directly.

```jsx title="EmailList.jsx" good="7-9" role=PARENT
import { emails } from '../emails.js';
import EmailRow from './EmailRow.jsx';

export default function EmailList() {
  return (
    <form>
      {emails.map(email => ( /* Parentheses: the row is given back */
        <EmailRow email={email} />
      ))}
    </form>
  );
}
```

Writing `return <EmailRow email={email} />;` inside explicit curly braces works exactly the same way. When a fourth email arrives in `emails.js`, this exact same expression automatically evaluates to four elements.

### Let's check our console log

React mounts an array of element objects in sequential order. To inspect what `.map()` actually creates before React renders it, we capture the mapped result in a variable above the return statement and log it to the console.

```jsx
const rows = emails.map(email => <EmailRow email={email} />);
console.log(rows);
```

With three emails in our data, Chrome's Console logs an array containing three objects. Expanding the first item reveals its internal anatomy.

```devconsole caption="The logged array in Chrome's Console, with the three emails and its first element opened; React adds more properties, left out here."
v (3) [{…}, {…}, {…}]
  v 0: {type: ƒ EmailRow, key: null, props: {…}, …}
    type: ƒ EmailRow | Our component, the function React calls
    key: null | No key yet
    > props: {email: {…}} | The spam email
  > 1: {type: ƒ EmailRow, key: null, props: {…}, …}
  > 2: {type: ƒ EmailRow, key: null, props: {…}, …}
```

Notice what React actually created: plain JavaScript objects where `type` references our component function and `props` carries the email data. At this point, `key` is `null`. That missing property triggers React's console warning, which leads us to Principle 3.

### What turns an array into elements

```tree dir=right caption="Every way tried inside JSX braces to turn an array into elements, and what each gives back."
What gives back one element per item?
- +map(), element right after => | the array of elements: one row per item
- +map(), => { return ... } | the same array: the return gives back each element
- !map(), => { ... } without return | undefined for every item: no rows, no message
- !forEach() | undefined: no rows, no message
- !a for loop inside JSX braces | a statement: it cannot go there
```

## 2. Filter items first, and check `length > 0` (e.g. `shown.length > 0`)

*When? A folder shows only its own emails, and a folder can have none*

```tree size=mini here="Rows for only some emails"
Dynamic: rendering a list from an array
- Create the rows
  - Rows for every email
  - Rows for only some emails
- Update the rows when the list changes
  - Key from the email's id
  - Key on the tag `map()` returns
```

> [!PRINCIPLE]
> **Principle 2: (`filter-then-map`) Filter first, and check `length > 0` (e.g. `shown.length > 0`)**
>
> **Why it happens:** To show only matching items, run `filter()` first and then `map()` over the result. When no items match, the filtered array's `length` is `0`. This can be a trap. If you use conditional rendering `{ length && list }`, the left side cannot be `0` otherwise it will show zero on the screen - yes, the number `0` will appear on your screen! You see, JavaScript stops at `0` and hands that number to React. React happily prints a stray `0` on the screen, whereas it renders nothing for `false`.
>
> **The Rule:** For conditional rendering prefer `length > 0`, for example `{ length > 0 && list }` or `{ length > 0 ? list : <p>Empty</p> }`, so an empty list produces `false` instead of `0`.
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
>       {shown.length > 0 ? rows : <p>No emails here.</p>} {/* No emails: the message */}
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
>       {shown.length && rows} {/* **PROBLEMATIC:** a bare length shows 0 */}
>     </section>
>   );
> }
> ```

> [!FACT] **`filter()`** executes a test function for each item and returns a new array containing only the items that returned `true`. An array's **`length`** property reflects its item count; an empty array has a length of `0`.

### Example for Principle 2: Let's put a bare length left of && (React shows the 0!)

### Component Hierarchy

```hierarchy
page: folders=none
box: EmailList | section
section: Inbox
rows: EmailRow | div.row
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | unread
email: Anna Lee | Team meeting moved
email: Mom | Photos from the trip
end
tree:
EmailList | gets: `folder`, such as "Inbox" | holds: the `emails` array, imported | here: draws one row per email of the folder
  EmailRow | gets: one `email`
notes:
The PARENT (`EmailList`) imports the `emails` array, keeps the emails of its `folder` with `filter()`, and maps each one to an `<EmailRow />` component.
The CHILD (`EmailRow`) receives one `email` object and renders a row with its checkbox, sender, and subject.

Point of failure: the list of `<EmailRow email={email} />` rows has a length, but when the reader opens the Spam folder, which has no emails, its length is `0`, so `{shown.length && rows}` puts a `0` on the page instead of the message.
```

Now let's add folder filtering to our mail client. We work with the same three files:

* `emails.js`: our data file from before, where all three sample emails belong to `"Inbox"`, leaving `"Spam"` completely empty.
* `EmailList.jsx`: the parent component that accepts a `folder` prop, filters the emails with `.filter()`, and maps matching ones to rows.
* `EmailRow.jsx`: the row component from before that renders the email's details.

Here is `EmailList.jsx`. Notice line 10, where we attempt to conditionally render the rows using a bare `shown.length` directly to the left of `&&`:

```jsx title="EmailList.jsx" bad="10" role=PARENT
import { emails } from '../emails.js';
import EmailRow from './EmailRow.jsx';

export default function EmailList({ folder }) {
  const shown = emails.filter(email => email.folder === folder); // This folder's emails
  const rows = shown.map(email => <EmailRow email={email} />);
  return (
    <section>
      <h2>{folder}</h2>
      {shown.length && rows} {/* **PROBLEMATIC:** a bare length shows 0 */}
    </section>
  );
}
```

And here is `EmailRow.jsx`, unchanged from before:

```jsx title="EmailRow.jsx" role=CHILD
export default function EmailRow({ email }) {
  return (
    <div className="row">
      <input type="checkbox" name="delete" value={email.id} /> {/* A tick box per row */}
      <span className="from">{email.from}</span>
      <span className="subject">{email.subject}</span>
    </div>
  );
}
```

::: pagebreak

### Let's check the page

::: row flow=down caption="The reader opens the Spam folder, which has no email: the line under the heading, two ways. The code on top, and under each, the page it gives."
::: col title="A bare length left of `&&`" tone=bad
```mail size=mini
section: Spam
raw: 0 | bad
```
```jsx
{shown.length && rows}
```
With the Spam folder open, `shown.length` evaluates to `0`. The `&&` operator short-circuits and returns `0`, which React prints directly to the screen.
:::
::: col title="`length > 0`, then the ternary" tone=good
```mail size=mini
section: Spam
line: No emails here. | good
```
```jsx
{shown.length > 0 ? rows : <p>No emails here.</p>}
```
With the Spam folder open, `0 > 0` evaluates to `false`. The ternary operator selects its alternative branch and displays the clean fallback message.
:::
:::

### Why does a 0 appear?

> [!FACT] The logical AND expression `a && b` returns its left operand `a` whenever `a` is falsy (such as `0`, `false`, `null`, or `undefined`), and returns `b` otherwise. In JSX, React treats `false`, `null`, and `undefined` as empty markup, but it renders numeric values directly to the DOM as visible text. A boolean comparison like `length > 0` guarantees a strict `true` or `false`.

Using `&&` with `.length` creates a classic rendering trap:

* **The symptom:** You open an empty folder (like Spam), and a literal `"0"` prints right under the heading instead of an empty state.
* **The false assumption:** You expected `{shown.length && rows}` to hide the rows when `length` is `0`.
* **How JavaScript evaluates it:** The `&&` operator stops at the first falsy value and returns it directly. When the array is empty, `shown.length` evaluates to the number `0`.
* **How React handles numbers:** While React ignores `false`, `null`, and `undefined`, it treats numbers as valid visible text. React prints that `0` straight into the browser DOM.

The logical `&&` operator does not convert values to booleans; it returns one of its operands. React then renders whatever value it receives. Here is how the same `EmailList` evaluates under the bare length pattern, for each `folder` it receives:

| `folder` | `filter()` gives back | `shown.length` | `shown.length && rows` gives back | the page shows |
| --- | --- | --- | --- | --- |
| `"Inbox"` | three emails | `3` | `rows`, three rows | the three rows |
| !`"Spam"` | `[]` | `0` | `0` | a bare 0 |

To render empty collections cleanly without leaking a stray `0`:

* **Use strict comparisons:** Always write `{shown.length > 0 && rows}` so JavaScript evaluates a true boolean instead of the number `0`.
* **Prefer a ternary for empty states:** Write `{shown.length > 0 ? rows : <p>No emails here.</p>}` to provide a clear, helpful message when no items match.

### What an empty folder shows

```tree dir=right caption="Three lines under the heading, and what the Spam folder shows with each, when Spam has no email."
What does an empty folder show?
- !`{rows}` alone | an empty space under the heading
- !`{shown.length && rows}` | a bare 0 under the heading
- +a ternary on `length > 0` | the message: No emails here.
```

## 3. Link each row to a permanent item ID (e.g. `key={email.id}`)

*Why? Without a key, React matches the DOM elements on the page to the array by position*

```tree size=mini here="Key from the email's id"
Dynamic: rendering a list from an array
- Create the rows
  - Rows for every email
  - Rows for only some emails
- Update the rows when the list changes
  - Key from the email's id
  - Key on the tag `map()` returns
```

> [!PRINCIPLE]
> **Principle 3: (`keys-name-items`) Link each row to a permanent item ID (e.g. `key={item.id}`)**
>
> **Why it happens:** The array of items in our JavaScript code and the list of DOM elements on the screen are two separate things. When we add, delete, or reorder an item, the array in memory changes its order, but the DOM elements on the screen (along with whatever the user typed or ticked inside them) stay sitting in their old positions (`Row 1`, `Row 2`, `Row 3`). Without a link between the two, React just matches Row 1 on screen to item `0` in memory - so an old ticked checkbox stays on Row 1 even when a brand-new item moves into slot `0`! A `key` is the chain that links each DOM element on the screen to its specific object in memory, so they stay together no matter how the list moves.
>
> **The Rule:** Always pass a permanent ID from the item itself, like `key={item.id}`, so each DOM element stays chained to its own data. Never use `key={index}` (which just chains the row to position `0, 1, 2`) or `key={Math.random()}` (which breaks the chain on every render).
>
> *We should do this:*
>
> ```jsx
> function EmailList() {
>   return (
>     <form>
>       {emails.map(email => (
>         <EmailRow key={email.id} email={email} /> // The row follows its email
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
>         <EmailRow key={index} email={email} /> // **PROBLEMATIC:** the index is the position
>       ))}
>     </form>
>   );
> }
> ```

> [!FACT] Form inputs maintain their own internal state in the browser DOM. A checkbox remembers whether it is checked inside its real DOM element, outside of React's JavaScript variables. When a form submits, each checked box sends its `value`, so an input with `value={email.id}` transmits that email's unique ID.

> [!FACT] A **key** is a reserved attribute that React uses to track identity across re-renders: `key={email.id}`. The `map()` method also provides the current iteration index as an optional second parameter: `items.map((item, index) => ...)`, where `index` starts at 0.

### Example for Principle 3: How to delete the wrong email

### Component Hierarchy

```hierarchy
page: folders=none
box: EmailList | form
toolbar: Delete selected
rows: EmailRow | div.row
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | checked
email: Anna Lee | Team meeting moved
email: Mom | Photos from the trip
end
tree:
EmailList | holds: the `emails` array, imported | here: draws one row per email
  EmailRow | gets: one `email`
notes:
The PARENT (`EmailList`) imports the `emails` array and maps each item to an `<EmailRow />` component.
The CHILD (`EmailRow`) receives one `email` object and renders a row with its checkbox, sender, and subject.

Point of failure: `<EmailRow email={email} />` has no key. When a new email arrives at the top of the array, the tick stays in the first row, and Delete selected deletes the wrong email.
```

::: page tint=blue kicker="Example for Principle 3" title="The tick that stays in the first row"
Now let's add interactive checkboxes to our mail client so the user can select and delete messages. To see what happens when the list order changes, we look at the two separate realities at play:

* `emails.js`: our JavaScript data array, holding objects with senders, subjects, and unique IDs.
* The browser DOM: the physical HTML elements displaying those emails, holding real input state like checked checkboxes.

When the array changes order, browser DOM nodes do not move by themselves. Without stable keys, checking a box on one item can delete a completely different item when a new email arrives.

```twolists
left: The `emails` array of objects, in our code
{ id: 1, subject: '🔥 FLASH SALE: Extra 15% off' }
{ id: 2, subject: 'Team meeting moved' }
{ id: 3, subject: 'Photos from the trip' }
right: The list of DOM elements, on the page
🔥 FLASH SALE: Extra 15% off
Team meeting moved
Photos from the trip
note: Without a key, the two lists are connected only by their order: the first object goes with the first DOM element, the second with the second, and so on.
```

::: comic layout=think
::: panel step=1 title="We tick “🔥 FLASH SALE: Extra 15% off”."
```mail table
toolbar: Delete selected
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | checked good pointer id:1
email: Anna Lee | Team meeting moved | | id:2
email: Mom | Photos from the trip | | id:3
```

> [!THINK] OK, another spam mail. Let me tick “🔥 FLASH SALE: Extra 15% off”, so I can delete it.

Behind the scenes: the checkmark is stored in the checkbox of the first DOM element in the document, completely outside React's data array. Without a key, React associates this first DOM node with the first item in the array purely because both occupy position index 0.
:::
::: panel step=2 title="A new email arrives at the top of the emails array." tone=bad
```mail table
toolbar: Delete selected
email: Sara Kim | Lunch on Friday? | | checked unread bad id:4
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | id:1
email: Anna Lee | Team meeting moved | | id:2
email: Mom | Photos from the trip | | id:3
```

> [!THINK] Oh, a new email just came in: “Lunch on Friday?”.

> [!THINK] Wait... why is it ticked? I never ticked that one! And the spam mail has no tick any more.

Behind the scenes: every item in our data array shifted down by one index. But the physical DOM nodes remained right where they were. React re-rendered the first DOM node with the new item at index 0 ("Lunch on Friday?"), but preserved the checked input state already sitting inside that first DOM node!
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

> [!THINK] Delete.

Behind the scenes: the active checkmark resides in the first DOM element, and that first element currently displays "Lunch on Friday?" with ID 4. The form submits `delete=4`. We intended to wipe out spam, but the server receives a deletion request for our lunch invitation.
:::
::: panel step=4 title="After the delete." tone=bad
```mail table
toolbar: Delete selected
email: Sara Kim | Lunch on Friday? | | deleted id:4
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | bad id:1
email: Anna Lee | Team meeting moved | | id:2
email: Mom | Photos from the trip | | id:3
```

> [!THINK] Oh no. “Lunch on Friday?” is gone, and I never even read it.

> [!THINK] And the spam mail I wanted to delete is still here!

Behind the scenes: the data array shifted, but unkeyed DOM nodes were matched purely by index position. The user's input stayed pinned to the physical slot while the underlying data moved underneath it.
:::
:::

Without a key, React matches data objects to browser DOM elements purely by array index. When an array changes order, DOM nodes do not follow their data. A key derived from each item's unique persistent ID (`key={email.id}`) tells React which DOM node belongs to which data record, keeping them locked together wherever the item moves.
:::

### The code behind the inbox

Now let's examine the three files running this inbox:

* `emails.js`: our data array, where a new message from Sara Kim arrives at index `0`.
* `EmailList.jsx`: the parent component that renders the inbox form and maps over the emails without a `key`.
* `EmailRow.jsx`: the child component that renders each row with a native checkbox whose checked state lives directly in the browser DOM.

In `EmailList.jsx`, notice line 9: we map over the emails and return `<EmailRow />` without providing a `key` prop:

```jsx title="EmailList.jsx" bad="9" role=PARENT
import { emails } from '../emails.js';
import EmailRow from './EmailRow.jsx';

export default function EmailList() {
  return (
    <form action="/delete">
      <button>Delete selected</button>
      {emails.map(email => (
        <EmailRow email={email} /> // **PROBLEMATIC:** no key: matched by position
      ))}
    </form>
  );
}
```

In `EmailRow.jsx`, notice line 3: the native checkbox stores its checked state directly in the DOM element:

```jsx title="EmailRow.jsx" role=CHILD
export default function EmailRow({ email }) {
  return (
    <div className="row">
      <input type="checkbox" name="delete" value={email.id} /> {/* The tick lives in this DOM element */}
      <span className="from">{email.from}</span>
      <span className="subject">{email.subject}</span>
    </div>
  );
}
```

And here is `emails.js`. Notice line 2: when a new email arrives, it is prepended to the top of the array, pushing all existing items down by one index:

```js title="emails.js" good="2"
export const emails = [ // The new object arrives first
  { id: 4, from: 'Sara Kim', subject: 'Lunch on Friday?', folder: 'Inbox' },
  { id: 1, from: 'ShopNow', subject: '🔥 FLASH SALE: Extra 15% off', folder: 'Inbox' },
  { id: 2, from: 'Anna Lee', subject: 'Team meeting moved', folder: 'Inbox' },
  { id: 3, from: 'Mom', subject: 'Photos from the trip', folder: 'Inbox' },
];
```

### Why do we delete the wrong email?

> [!AHA] Why the wrong email is deleted
> 1. **Input state lives in the browser DOM:** The checkmark is stored directly inside the physical `<input type="checkbox">` element, completely outside your JavaScript data.
> 2. **The array shifts when a new email arrives:** "Lunch on Friday?" takes index `0`, pushing the spam email down to index `1`.
> 3. **React matches by index position:** Without keys, React assumes the DOM node at position `0` still belongs to whatever is at array index `0`.
> 4. **Text updates, but the DOM node is reused:** React updates the sender and subject on row `0` to display the new email, but reuses the existing DOM node and its checked box.
> 5. **Oops: the form submits `delete=4`:** Because the checkmark remained stuck on row `0`, submitting the form deletes the brand-new email with ID `4` instead of the spam email with ID `1`.
>
> **Keys attach each DOM node to an item's unique data ID instead of its row position, ensuring user input follows the actual data when the list changes.**

This explains why keys exist. Providing `key={email.id}` tells React to match DOM elements by their persistent database ID instead of their array position. We add the key to the tag returned inside `map()`.

```jsx title="EmailList.jsx" good="2"
{emails.map(email => (
  <EmailRow key={email.id} email={email} /> // Tied to its object by the id
))}
```

With stable keys, React matches DOM nodes to array items by ID. When a new item arrives at the top, React moves the existing DOM node downward to keep it paired with the flash sale email. The checkmark travels safely with its email, and a fresh unselected DOM node mounts at the top for the lunch invitation.

```chain caption="After a new object arrives at the top of the emails array: where the ticked DOM element goes, and what Delete selected sends."
!no key: matched by position -> the first DOM element, ticked, shows the first object, Lunch on Friday? -> the form sends 4: the wrong email
+`key={email.id}`: matched by id -> the ticked DOM element keeps 🔥 FLASH SALE: Extra 15% off, now second -> the form sends 1: the right email
```

### When it breaks

This failure mode requires two simultaneous conditions: the array changes order anywhere except the very end, and child DOM nodes carry transient state such as checkbox selections or input text. That is why simple read-only lists appear to function correctly even when keys are missing.

| | the array changes only at the end | the array changes at the top or in the middle, or is sorted |
| --- | --- | --- |
| the DOM element holds nothing of its own | fine | fine: nothing can stay behind |
| !the DOM element holds a tick or typed text | fine | the tick stays in its DOM element, and the objects of the array move past it |

::: pagebreak

### Let's compare the four keys

::: row caption="No key, and the index: the tick stays in the first DOM element, beside the new email."
::: col title="no key" tone=bad
```mail size=mini
email: Sara Kim | Lunch on Friday? | | checked unread bad
email: ShopNow | 🔥 FLASH SALE: Extra 15% off
email: Anna Lee | Team meeting moved
```
With no key, React matches by position. The checkmark remains stuck in the first DOM element, now attached to "Lunch on Friday?", and the console issues a warning. Form submission deletes item 4.
:::
::: col title="`key={index}`" tone=bad
```mail size=mini
email: Sara Kim | Lunch on Friday? | | checked unread bad
email: ShopNow | 🔥 FLASH SALE: Extra 15% off
email: Anna Lee | Team meeting moved
```
Using the array index silences the linter warning, but index is still position. Prepending an item shifts every index, leaving the selection stuck on the wrong email. Form submission deletes item 4.
:::
:::

::: pagebreak

::: row caption="A random key, and the email's id: the tick is lost, or it moves with the spam mail."
::: col title="`key={Math.random()}`" tone=bad
```mail size=mini
email: Sara Kim | Lunch on Friday? | | unread
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | bad | tick lost
email: Anna Lee | Team meeting moved
```
Generating random keys produces fresh numbers on every single render. React cannot reconcile existing nodes, unmounts the entire list, recreates all elements from scratch, and destroys user input.
:::
::: col title="`key={email.id}`" tone=good
```mail size=mini
email: Sara Kim | Lunch on Friday? | | unread
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | checked good
email: Anna Lee | Team meeting moved
```
With stable data IDs, React repositions the selected DOM node so it stays perfectly aligned with the flash sale email. Form submission deletes item 1 as intended.
:::
:::

### Which key to choose

```tree dir=right caption="The four keys, and what each does after a new object arrives at the top of the emails array."
Which key?
- +key from the email's id | follows the object: the tick moves with its email
- !key from the index | is the position: the tick stays in place when an item is added, removed, or moved above it
- !key from Math.random() | new on every render: every DOM element is rebuilt, the tick is lost
- !no key | matches by position: the tick stays in place, and the Console warns
```

The array index is safe only for static lists that never filter, sort, prepend, or delete items, such as fixed navigation tabs. Appending items strictly to the end of an array avoids position shifts. But deleting or inserting items anywhere else shifts every subsequent index, reproducing the exact same data corruption bug.

## 4. Put `key` on the outer tag `map()` returns (e.g. `<Row key={id} />`)

*Why? React reads the key only on the elements `map()` gives back*

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
> **Principle 4: (`key-on-mapped-element`) Put `key` on the outer tag `map()` returns (e.g. `<Row />`)**
>
> **Why it happens:** Because `key` is the chain that links each item in `map()` to its element on the screen, React looks for that chain right where `map()` creates the list. This creates two traps. First, if you hide `key={item.id}` inside the child component's `<div>`, `map()` only sees an unchained `<Row />` tag and warns you in the console. Second, `key` is a private label for React, not data for your component - React strips it off before creating `props`, so reading `props.key` inside the child always gives you `undefined`.
>
> **The Rule:** Put `key={item.id}` directly on the outermost tag returned by `map()` (use `<Fragment key={item.id}>` if one item returns two sibling tags), and pass a separate prop like `id={item.id}` when the child component needs to read the ID.
>
> *We should do this:*
>
> ```jsx
> function EmailList() {
>   return (
>     <form>
>       {emails.map(email => (
>         <EmailRow key={email.id} email={email} /> // On the tag map() returns
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
>         <EmailRow email={email} /> // No key on the tag map() returns
>       ))}
>     </form>
>   );
> }
> function EmailRow({ email }) {
>   return <div key={email.id}>{email.subject}</div>; // **PROBLEMATIC:** inside the child
> }
> ```

### Example for Principle 4: Let's move the key onto the `<div>` inside the row (React never reads it!)

### Component Hierarchy

```hierarchy
page: folders=none
box: EmailList | form
rows: EmailRow | div.row
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | unread
email: Anna Lee | Team meeting moved
email: Mom | Photos from the trip
end
tree:
EmailList | holds: the `emails` array, imported | here: draws one row per email
  EmailRow | gets: one `email`
notes:
The PARENT (`EmailList`) imports the `emails` array and maps each item to an `<EmailRow />` component.
The CHILD (`EmailRow`) receives one `email` object and renders a row with its checkbox, sender, and subject.

Point of failure: the key sits on the `<div>` inside `EmailRow`, not on the `<EmailRow />` tag that `map()` gives back. React never reads it, and the console warning stays.
```

Now let's examine where the `key` prop must be placed. We work with the same three files:

* `emails.js`: our data file exporting the array of email objects.
* `EmailList.jsx`: the parent component that maps over the emails, returning `<EmailRow />` tags.
* `EmailRow.jsx`: the child component that renders the row `<div>`, checkbox, and email details.

When inspecting the page in browser DevTools, the rendered HTML displays three repeating rows inside `<form>`:

```dom title="Elements panel: the inbox with three rows"
<form>
*  <div class="row">...</div>
*  <div class="row">...</div>
*  <div class="row">...</div>
</form>
```

Seeing `<div class="row">` repeating in the DOM might tempt you to put `key={email.id}` right on that `<div>` inside `EmailRow.jsx`.

Let's look at the code to see what happens. In `EmailList.jsx`, notice line 8: `.map()` returns `<EmailRow />` tags without a `key`:

```jsx title="EmailList.jsx" bad="8" role=PARENT
import { emails } from '../emails.js';
import EmailRow from './EmailRow.jsx';

export default function EmailList() {
  return (
    <form>
      {emails.map(email => (
        <EmailRow email={email} /> // No key on the tag map() returns
      ))}
    </form>
  );
}
```

And in `EmailRow.jsx`, notice line 3: the key is placed on the inner `<div>` instead:

```jsx title="EmailRow.jsx" bad="3" role=CHILD
export default function EmailRow({ email }) {
  return (
    <div key={email.id} className="row"> {/* **PROBLEMATIC:** a key inside the child */}
      <input type="checkbox" name="delete" value={email.id} />
      <span className="from">{email.from}</span>
      <span className="subject">{email.subject}</span>
    </div>
  );
}
```

::: pagebreak

### Let's check our console log

::: row flow=down caption="With the three emails on the page: the key inside the row, then the key on the tag map() gives back. The code on top, and under each, the Console it gives."
::: col title="Key on the `<div>` inside the row" tone=bad
```devconsole
x Each child in a list should have a unique "key" prop. Check the render method of `EmailList`.
```
```jsx
<div key={email.id} className="row">
```
With the key placed inside the child component, React cannot find it on the collection items, and the warning explicitly names `EmailList` as the offender.
:::
::: col title="Key on `<EmailRow>`, inside `map()`" tone=good
```devconsole
= No messages
```
```jsx
<EmailRow key={email.id} email={email} />
```
Placing the key on the tag returned by `map()` satisfies the reconciler, producing a completely clean console log.
:::
:::

### Why does React never read the key inside the row?

> [!FACT] React inspects `key` props only on the outer JSX elements returned directly inside an array or `.map()` loop. It does not look inside child components to find keys. A `key` placed inside a child component belongs to that component's internal markup, not the parent's collection.

Where to place the key is a question of reconciler scope:

* **The symptom:** The console warning persists (`Each child in a list should have a unique "key" prop`), and React matches rows by position as if no key exists.
* **The mistake:** Placing `key={email.id}` on the `<div className="row">` inside `EmailRow.jsx` instead of on `<EmailRow />` in `EmailList.jsx`.
* **Direct array items only:** In `EmailList.jsx`, `.map()` produces an array of `<EmailRow />` tags. That is the only place React checks for collection keys.
* **Children are isolated:** React does not execute child components or inspect their returned JSX to find a key for the parent's loop.
* **Moving wrappers:** If you wrap `<EmailRow />` inside an `<li>`, the `<li>` becomes the outermost item returned by `.map()`. The key must move to the wrapper: `<li key={email.id}>`.

```jsx title="EmailList.jsx" good="3"
<ul className="emails">
  {emails.map(email => (
    <li key={email.id}> {/* The tag map() returns: the key goes here */}
      <EmailRow email={email} />
    </li>
  ))}
</ul>
```

### Can the row read its own key?

React reserves `key` for its own internal tracking and strips it before passing props down. A child component attempting to read `props.key` receives `undefined` and triggers a console warning.

```devconsole caption="Chrome's Console, when EmailRow reads its key as a prop."
x EmailRow: `key` is not a prop. Trying to access it will result in `undefined` being returned.
```

If a child component needs the ID value for business logic, you must pass it explicitly under a distinct prop name, such as `<EmailRow key={email.id} id={email.id} />`.

### A key hidden inside a spread object

> [!FACT] A **prop spread** `{...props}` on a JSX tag forwards every property of an object as individual attributes.

A key can also be unintentionally obscured by spreading an object onto a tag. This occurs when developers assemble prop bundles ahead of time and include the key property inside the bundle.

```jsx title="EmailList.jsx" bad="2-3"
{emails.map(email => {
  const props = { key: email.id, email: email }; // **PROBLEMATIC:** the key inside the object
  return <EmailRow {...props} />;
})}
```

While earlier versions of React extracted keys from spreads, modern React warns: "A props object containing a "key" prop is being spread into JSX". The senior standard is explicit: write the `key` directly on the JSX tag, and spread only business props.

### A key on a Fragment

> [!FACT] The short fragment syntax `<>` and `</>` groups sibling tags without adding extra nodes to the DOM, but it cannot accept attributes. The formal `<Fragment>` component imported from `'react'` accepts a `key`.

When mapping data where each item requires multiple sibling elements without a wrapper container, wrap each iteration in `<Fragment key={...}>`.

```jsx title="EmailList.jsx" good="2"
{emails.map(email => (
  <Fragment key={email.id}> {/* Several tags per item: the key goes here */}
    <h3>{email.subject}</h3>
    <p>{email.from}</p>
  </Fragment>
))}
```

### Where the key goes

```tree dir=right caption="The places a key can be written, and what each gives."
Where does the key go?
- +key on the tag map() returns | <EmailRow key>, or <li key> when the row sits in an <li>
- +key on <Fragment key>, the long form | when each item is several tags; <> takes no key
- !key inside the child | the warning stays: the child's <div> is not an array item
- !key inside a spread object | React still reads it for now, but warns: write key on the tag
```

## Putting the four together

We assemble all four principles into a production-grade folder component. It filters emails by folder category, projects them into rows using `map()`, mounts each item inside an `<li>` container carrying the persistent key, and displays a clean fallback message when no emails match. The parent renders both folders inside a unified form.

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

Here is the same component showing the two classic defects: using `key={index}` which corrupts form state when data moves (line 7), and using bare `.length` conditional rendering which prints a stray `0` in empty folders (line 14).

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

- **How do you render a list from an array in React?** Store data in an array of objects and call `.map()` inside JSX. The callback returns a component element for each record. To render a subset, chain `.filter()` before `.map()`. When collections can be empty, guard with a ternary like `collection.length > 0 ? elements : <EmptyState />` instead of a bare `&&`.
- **Why does React require keys on list items?** JavaScript arrays and browser DOM nodes are separate entities. When data order changes, React uses keys to match existing DOM elements with their updated records. Stable keys prevent user input (like checkboxes and text fields) from staying stuck on the wrong row.
- **When is `key={index}` acceptable, and why is it dangerous?** Array indices are safe only when the list is strictly static: items are never sorted, filtered, added, or removed, and rows hold no local state like form inputs. In dynamic lists, index keys corrupt input state because indices shift whenever items are inserted or deleted.
- **Why is `key={Math.random()}` considered an anti-pattern?** Generating random keys during render assigns brand-new IDs on every render cycle. React cannot match existing elements, destroys and recreates every DOM node from scratch, drops user focus, and slows down the app.
- **Do keys need to be globally unique across the entire page?** No. Keys must be unique only among sibling elements within the same mapped array. Two completely separate lists can safely use the same underlying IDs.
- **Can a child component access its own `key` via props?** No. React reserves `key` for its own internal tracking and strips it before passing props down. Reading `props.key` returns `undefined` with a console warning. Pass the value as a separate prop like `id={item.id}` if the child needs it.
- **Where exactly must the key prop be placed?** Always on the outermost JSX tag returned directly inside the `.map()` callback. If rows are wrapped in `<li>` or `<Fragment>`, the key belongs on that wrapper tag, never on a child element inside.
- **Why does `{items.length && <List />}` render a 0 when empty?** JavaScript's `&&` operator short-circuits on falsy values and returns the number `0`. Because React treats numbers as printable text, it renders a literal `"0"` into the DOM. Always use `items.length > 0` with a ternary instead.

## Where you will meet this

- Every data-driven UI feature across the web: feeds, comments, search results, shopping carts, and tables.
- Server-side data fetching: API records always arrive with unique database IDs that serve as natural list keys. When generating client-side records, assign unique IDs at creation time using `crypto.randomUUID()`, never inside render functions.
- Interactive list items containing form inputs, checkboxes, accordions, or animations: omitting stable keys in these components causes immediate, visible UI glitches upon reordering.
- React reconciler diagnostics: console warnings identify the exact parent component whose mapping function is missing keys.

::: pagebreak

## Summary

```tree caption="The whole lecture as one tree."
Two different ways to render one row per email
- Fixed: written by hand | only for a few items that never change
- Dynamic: rendering a list from an **array** | one tag, repeated for every email
  - Create the rows
    - Rows for every email | `map()`, with ( ), or { } and a return
    - Rows for only some emails | `filter()` first; a message when none are left
  - Update the rows when the list changes
    - Key from the email's id | the index only if positions never change
    - Key on the tag `map()` returns | or on the `<li>` or `<Fragment>` around the row
```

**Every email becomes a row, only some when filtered, with a message when none are left, and each row keyed by its email's id on the tag map() returns.**

::: pagebreak

## Example: an inbox in a mail app

A complete mail application displays folder contents with selection checkboxes, sender labels, and subject lines. Users select messages to delete and submit the form. Here is the operational inbox after selecting spam and receiving an incoming email at the top.

```mail caption="The mail app with the code of Putting the four together. Outlined in green: the tick, still beside the spam mail after a new email arrived, and the message of the empty Spam folder. The top bar and the folders come from other components, left out here." folder=Inbox count=2
toolbar: Delete selected
section: Inbox
email: Sara Kim | Lunch on Friday? | | unread
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | checked unread good
email: Anna Lee | Team meeting moved
email: Mom | Photos from the trip
section: Spam
line: No emails here. | good
```

Every row maintains uniform visual structure while displaying unique record data. Each folder displays only its assigned messages. The Spam folder contains zero emails and cleanly renders its empty state message. The checkbox selection remains firmly locked to the spam message even after a new email arrived above it. Each visual behavior reflects a foundational React principle:

| on the page | the rule behind it | the tool |
| --- | --- | --- |
| four rows with the same three parts | one row for each email in the data | `map()` (Principle 1) |
| the Inbox section shows the Inbox emails | each section shows only the emails of its own folder | `filter()`, then `map()` (Principle 2) |
| Spam says "No emails here." | a folder with no emails shows a message | the ternary on `length > 0` (Principle 2) |
| the tick beside "🔥 FLASH SALE: Extra 15% off" | the DOM element with the tick stays matched to its object in the `emails` array when a new email arrives at the top of the array, so Delete selected deletes the spam mail | `key={email.id}` on the `<li>` (Principles 3 and 4) |

Hardcoded markup requires manual code edits for every data modification. Dynamic rendering projects data arrays directly into the document, updating the interface seamlessly with zero component changes.

## The components behind the page

Three specialized components collaborate to render this interface, each living in its own dedicated file: `App.jsx`, `EmailList.jsx`, and `EmailRow.jsx`. The data collection resides separately in `emails.js`. Application state flows strictly downward, from the data source to folder containers, and from containers to individual rows.

```hierarchy layout=stack caption="The components of this lecture, one file each, and what each holds or receives."
App | holds: the form, the Delete selected button, and two folder sections
  EmailList | gets: one `folder`, such as "Inbox" | holds: the `emails`, imported | here: chooses which rows to draw
    EmailRow | gets: one `email` | holds: the tick box
notes:
The PARENT (`App`) mounts the root form, the action button, and renders two folder sections: `<EmailList folder="Inbox" />` and `<EmailList folder="Spam" />`.
The CHILD (`EmailList`) filters the data collection by `folder` and maps the results into `<li>` elements keyed by `email.id`.
The GRANDCHILD (`EmailRow`) receives one `email` object and renders the row DOM elements containing the selection checkbox.
The data source (`emails.js`) stores the records in a flat array, keeping data independent from component presentation.
```
