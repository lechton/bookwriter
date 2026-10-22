# Lecture 11: Rendering Lists and Keys
> INTERVIEW QUESTION | ❱ CORE | How do you render a list from an array, and why does React demand a key on every item?

Data in a real app arrives as a JavaScript array of objects, such as inbox emails or store products. To turn that array into UI and keep each row's state attached to its own item when the list changes, we make four decisions in two pairs:

```tree caption="The four decisions of rendering a list: first turn array items into components, then keep each DOM row linked to its item."
Dynamic: rendering a list of components from an array (e.g. `emails`)
- Turn array items into components | from the array in memory to the page
  - Map each item to a tag (e.g. `map()`) | `emails.map()`
  - Filter first, check `length > 0` (not `0`) | `filter()`, then `map()`
- Keep each DOM row linked to its item | when the list changes
  - Link each row to an ID (e.g. `key={id}`) | not its position
  - Put `key` on `map()`'s tag (e.g. `<Row />`) | not inside the child
```

::: row caption="Fixed tags in JSX versus rendering dynamically from the emails array."
::: col tone=bad title="Fixed: written by hand in JSX"
```mail size=mini
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | unread
email: Anna Lee | Team meeting moved
line: 4th email added to data is missing | bad
```
```jsx bad="2-4"
<form>
  <EmailRow email={emails[0]} /> {/* Hardcoded */}
  <EmailRow email={emails[1]} />
  <EmailRow email={emails[2]} />
</form>
```
Hardcoding one tag per item freezes the row count: when a 4th email arrives in `emails`, the page still shows only 3 rows.
:::
::: col tone=good title="Dynamic: emails.map() + key={email.id}"
```mail size=mini
email: Sara Kim | Lunch on Friday? | | unread good
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | unread
email: Anna Lee | Team meeting moved
```
```jsx good="2-4"
<form>
  {emails.map(e => ( /* Scales to any count */
    <EmailRow key={e.id} email={e} />
  ))}
</form>
```
One `map()` call turns 0, 3, or 1,000 objects in `emails` into rows automatically, with `key={e.id}` tying each row to its email.
:::
:::

::: pagebreak

## 1. Turn every array item into a component (e.g. `emails.map()`)
*Why can we write `emails.map(...)` inside JSX curly braces `{}`, when a `for` loop crashes and `forEach()` renders nothing?*

```tree size=mini here="Map each item to a tag (e.g. `map()`)"
Dynamic: rendering a list of components from an array (e.g. `emails`)
- Turn array items into components
  - Map each item to a tag (e.g. `map()`)
  - Filter first, check `length > 0` (not `0`)
- Keep each DOM row linked to its item
  - Link each row to an ID (e.g. `key={id}`)
  - Put `key` on `map()`'s tag (e.g. `<Row />`)
```

> [!FACT]
> JSX curly braces `{}` accept only a JavaScript expression that evaluates to a value. When that value is an array of React elements, React renders each element in order; when an entry is `undefined`, `null`, or `false`, React renders nothing for it.

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
> {list.map(item => <Row key={item.id} item={item} />)} // ( ) returns each <Row /> automatically
> ```
>
> *We should not do this:*
>
> ```jsx
> {list.map(item => { <Row key={item.id} item={item} />; })} // **PROBLEMATIC:** { } without return gives undefined
> ```

```tree dir=right caption="Every way tried inside JSX { } to turn an array into elements, and what each gives back."
What gives back one element per item?
- +map(e => <EmailRow />) or => { return ... } | returns the array of elements: one row per item
- !map(e => { <EmailRow />; }) without return | returns undefined per item: blank inbox, zero errors
- !forEach() | always returns undefined: blank inbox, zero errors
- !for loop inside JSX { } | syntax error: a for loop is a statement, not an expression
```

::: page tint=blue kicker="Bug Lab · Principle 1" title="Why Curly Braces { } Without return in map() Render a Blank List (Zero Errors)" tagline="Inside EmailList, curly braces { } without return inside map() fill the array with undefined."

```hierarchy
EmailList | holds: `emails` (3 objects, imported) | here: draws one row per email
  EmailRow | gets: one `email`
notes:
The PARENT (`EmailList`) imports `emails` (3 objects) and maps each object to an `<EmailRow />` element.
The CHILD (`EmailRow`) receives one `email` prop and renders its checkbox, sender, and subject.
Point of failure: `emails.map(email => {` opens curly braces with no `return`, so every turn returns `undefined` and the inbox renders empty with no console error.
```

::: row
::: col tone=bad title="Curly braces `{ }`, no `return`"
```mail size=mini
empty: no rows rendered
```

> [!THINK]
> No red error in the Console, so why is the Inbox completely blank?

```jsx title="EmailList.jsx" bad="1-3" role=PARENT
{emails.map(email => { // **PROBLEMATIC:** no return
  <EmailRow email={email} />;
})}
```
:::
::: col tone=good title="Parentheses `( )` after `=>`"
```mail size=mini
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | unread good
email: Anna Lee | Team meeting moved | | good
email: Mom | Photos from the trip | | good
```

> [!THINK]
> Parentheses `( )` after `=>` return the `<EmailRow />` from every turn of `map()`!

```jsx title="EmailList.jsx" good="1-3" role=PARENT
{emails.map(email => ( /* Returns each <EmailRow /> */
  <EmailRow email={email} />
))}
```
:::
:::

```devconsole caption="Logging the array returned by emails.map(email => <EmailRow email={email} />) in Chrome's Console."
v (3) [{…}, {…}, {…}]
  v 0: {type: ƒ EmailRow, key: null, props: {…}, …}
    type: ƒ EmailRow | Our component function that React calls
    key: null | No key yet (Principle 3 fixes this)
    > props: {email: {…}} | Passed to EmailRow as its props object
  > 1: {type: ƒ EmailRow, key: null, props: {…}, …}
```

:::

## 2. Filter items first, and check `length > 0` (e.g. `shown.length > 0`)
*How do we show only matching items, and why does `{shown.length && rows}` print a stray `0` when the folder is empty?*

```tree size=mini here="Filter first, check `length > 0` (not `0`)"
Dynamic: rendering a list of components from an array (e.g. `emails`)
- Turn array items into components
  - Map each item to a tag (e.g. `map()`)
  - Filter first, check `length > 0` (not `0`)
- Keep each DOM row linked to its item
  - Link each row to an ID (e.g. `key={id}`)
  - Put `key` on `map()`'s tag (e.g. `<Row />`)
```

> [!FACT]
> Two JavaScript rules meet here. First, `array.filter(fn)` tests each item and returns a brand-new array containing only the items where `fn(item)` returned `true`. Second, `0 && anything` short-circuits and returns the number `0`, and React renders numbers like `0` directly onto the page as text.

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
> {shown.length > 0 ? list : <p>Empty</p>} // 0 > 0 is false, never the number 0
> ```
>
> *We should not do this:*
>
> ```jsx
> {shown.length && list} // **PROBLEMATIC:** when length is 0, prints 0 on screen
> ```

```tree dir=right caption="Every way to guard an empty array (shown.length === 0) inside JSX { }, and what React renders."
When shown is empty (shown.length is 0)
- +shown.length > 0 ? rows : <p>No emails here.</p> | 0 > 0 is false: renders "No emails here."
- +shown.length > 0 && rows | 0 > 0 is false: renders nothing at all
- !shown.length && rows | 0 && rows evaluates to the number 0: prints a stray "0" on screen
```

::: page tint=blue kicker="Bug Lab · Principle 2" title="Why { length && list } Prints a Stray 0 on the Screen (e.g. shown.length && rows)" tagline="When filter() returns 0 items, shown.length && rows stops at 0 and React prints 0 in the folder."

```hierarchy
EmailList | gets: `folder="Spam"` | holds: `emails` | here: filters `shown`, then maps
  EmailRow | gets: one `email`
notes:
The PARENT (`EmailList`) filters `emails` down to `shown` where `email.folder === folder`.
When `folder` is `"Spam"`, `shown` is `[]` and `shown.length` is `0`.
Point of failure: `{shown.length && rows}` evaluates `0 && []`, which returns the number `0`, so React prints `"0"` inside the empty Spam section.
```

::: row
::: col tone=bad title="Bare `shown.length && rows`"
```mail size=mini
section: Spam
raw: 0 | bad
```

> [!THINK]
> All spam was deleted! Where did that lone `0` in the Spam folder come from?

```jsx title="EmailList.jsx" bad="4" role=PARENT
const shown = emails.filter(
  e => e.folder === folder
);
return <div>{shown.length && rows}</div>;
// **PROBLEMATIC:** 0 && [] returns 0!
```
:::
::: col tone=good title="Boolean `shown.length > 0 ? ... : ...`"
```mail size=mini
section: Spam
line: No emails here. | good
```

> [!THINK]
> `0 > 0` is `false` (not `0`), so the ternary cleanly renders `"No emails here."`!

```jsx title="EmailList.jsx" good="4-6" role=PARENT
const shown = emails.filter(
  e => e.folder === folder
);
return shown.length > 0
  ? rows
  : <p>No emails here.</p>;
// 0 > 0 is false: renders <p>
```
:::
:::

```chain
!`shown = []` -> `shown.length` is `0` -> `0 && rows` evaluates to `0` -> React prints a stray `0` in Spam
+`shown = []` -> `shown.length > 0` is `false` -> `false ? rows : <p>No emails here.</p>` -> Prints "No emails here."
```

:::

## 3. Link each row to a permanent item ID (e.g. `key={email.id}`)
*Why does React need a `key` on each list item, and how can a missing or `index` key delete the wrong email on screen?*

```tree size=mini here="Link each row to an ID (e.g. `key={id}`)"
Dynamic: rendering a list of components from an array (e.g. `emails`)
- Turn array items into components
  - Map each item to a tag (e.g. `map()`)
  - Filter first, check `length > 0` (not `0`)
- Keep each DOM row linked to its item
  - Link each row to an ID (e.g. `key={id}`)
  - Put `key` on `map()`'s tag (e.g. `<Row />`)
```

> [!FACT]
> When our list renders, two separate lists exist at runtime: our `emails` array of objects in JavaScript memory, and the list of real DOM elements (`<div class="row">`) in the browser, where each row's checkbox `<input>` stores its own checked state. Without a `key`, React matches the two lists strictly by position (`Row 1`, `Row 2`, `Row 3`).

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
> {list.map(item => <Row key={item.id} item={item} />)} // Chains the DOM row to this item's id
> ```
>
> *We should not do this:*
>
> ```jsx
> {list.map((item, index) => <Row key={index} item={item} />)} // **PROBLEMATIC:** chains the row to slot 0, 1, 2
> ```

```tree dir=right caption="Every source tried for key when a new email arrives at the top of the list."
Where can the key come from?
- +email.id, from the data | stays with its email: the ticked box moves with its email
- !no key at all | matched by position (0, 1, 2): tick stays on Row 1
- !index, from map((e, index) => ...) | same position number (0, 1, 2): same bug as no key
- !Math.random(), new each render | never matches: destroys and rebuilds every DOM row
```

::: page tint=blue kicker="Bug Lab · Principle 3" title="How a Missing Key Leaves a Ticked Checkbox on Row 1 and Deletes the Wrong Item" tagline="We tick the spam mail, a new email arrives at the top, we click Delete selected, and 'Lunch on Friday?' vanishes."

```hierarchy
EmailList | holds: the `emails` array | here: maps without `key`
  EmailRow | gets: one `email` | holds: checkbox DOM state
notes:
The PARENT (`EmailList`) renders `<EmailRow email={email} />` with **no `key`**, so React matches rows by position (`Row 1`, `Row 2`, `Row 3`).
The CHILD (`EmailRow`) renders `<input type="checkbox" name="delete" value={email.id} />`, whose checkmark lives in that row's DOM node.
Point of failure: when `"Lunch on Friday?"` (`id: 4`) arrives at index `0`, Row 1 keeps its checkmark while its text and `value={email.id}` update to `id: 4`.
```

```twolists
left: The `emails` array of objects, in our code
{ id: 1, subject: '🔥 FLASH SALE: Extra 15% off' }
{ id: 2, subject: 'Team meeting moved' }
{ id: 3, subject: 'Photos from the trip' }
right: The list of DOM elements, on the page
🔥 FLASH SALE: Extra 15% off
Team meeting moved
Photos from the trip
note: Without a key, the two lists are connected only by position: Row 1 always gets index 0, Row 2 gets index 1, and Row 3 gets index 2.
```

::: comic layout=think

::: panel step=1 title="We tick '🔥 FLASH SALE: Extra 15% off' in Row 1."
```mail table
toolbar: Delete selected
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | checked good pointer id:1
email: Anna Lee | Team meeting moved | | id:2
email: Mom | Photos from the trip | | id:3
```

> [!THINK]
> Another spam mail! Let me tick "🔥 FLASH SALE: Extra 15% off" so I can delete it.

Behind the scenes: the checkmark lives on the checkbox of **Row 1** in the DOM. Without a `key`, React ties **Row 1** to index `0` of `emails`, not to `id: 1`.
:::

::: panel step=2 tone=bad title="A new email ('Lunch on Friday?') arrives at the top of emails."
```mail table
toolbar: Delete selected
email: Sara Kim | Lunch on Friday? | | checked unread bad id:4
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | id:1
email: Anna Lee | Team meeting moved | | id:2
email: Mom | Photos from the trip | | id:3
```

> [!THINK]
> Oh, a new email just came in: "Lunch on Friday?". Wait... why is "Lunch on Friday?" ticked, and why did the spam lose its tick?!

Behind the scenes: every item in `emails` shifted down by one index, so index `0` is now `"Lunch on Friday?"` (`id: 4`). React updated **Row 1** with index `0` (`id: 4`) but kept **Row 1**'s ticked checkbox in place!
:::

::: panel step=3 tone=bad title="We click Delete selected, and 'Lunch on Friday?' is deleted!"
```mail table
toolbar: Delete selected | clicked
sent: sent to the server: `delete=4`, the id of "Lunch on Friday?"
email: Sara Kim | Lunch on Friday? | | deleted id:4
email: ShopNow | 🔥 FLASH SALE: Extra 15% off | | bad id:1
email: Anna Lee | Team meeting moved | | id:2
email: Mom | Photos from the trip | | id:3
```

> [!THINK]
> Oh no! "Lunch on Friday?" is gone, and the spam mail is still here!

Behind the scenes: **Row 1** was ticked and now held `value="4"`, so submitting the form deleted `"Lunch on Friday?"` (`id: 4`) while the spam (`id: 1`) survived in **Row 2**.
:::

:::

> [!AHA] Why `key={email.id}` fixes it (and why `index` and `Math.random()` fail)
> 1. **No key or `key={index}`**: Row 1 is always `"0"`. When `"Lunch on Friday?"` (`id: 4`) lands at index `0`, it inherits Row 1's ticked checkbox and gets deleted.
> 2. **`key={Math.random()}`**: Every render invents new keys, so React destroys every `<EmailRow>` DOM node and wipes out every ticked checkbox.
> 3. **Oops + Fix (`key={email.id}`)**: Stamping each `<EmailRow key={email.id} />` with `"1"`, `"2"`, `"3"`, `"4"` tells React that `"1"` moved to Row 2, so its ticked checkbox moves with `"🔥 FLASH SALE"`.
>
> **A `key` names which data item a component instance and DOM row belong to across re-renders.**

:::

## 4. Put `key` on the outer tag `map()` returns (e.g. `<Row key={id} />`)
*Where exactly does the `key` attribute go, why is `props.key` always `undefined`, and how do we key a multi-tag item?*

```tree size=mini here="Put `key` on `map()`'s tag (e.g. `<Row />`)"
Dynamic: rendering a list of components from an array (e.g. `emails`)
- Turn array items into components
  - Map each item to a tag (e.g. `map()`)
  - Filter first, check `length > 0` (not `0`)
- Keep each DOM row linked to its item
  - Link each row to an ID (e.g. `key={id}`)
  - Put `key` on `map()`'s tag (e.g. `<Row />`)
```

> [!FACT]
> React checks `key` on the direct elements inside the array returned by `map()`, then strips `key` so it never appears inside the child's `props` object. When one mapped item returns multiple sibling tags without a wrapper DOM node, `<Fragment key={email.id}>` accepts a `key`, whereas `<>...</>` shorthand accepts no attributes.

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
> {list.map(item => <Row key={item.id} id={item.id} item={item} />)} // Key on map() tag + id prop for child
> ```
>
> *We should not do this:*
>
> ```jsx
> {list.map(item => <Row item={item} />)} // **PROBLEMATIC:** key inside Row is unseen by map(), and props.key is undefined
> ```

```tree dir=right caption="All four placement rules for key inside map()."
Where does key go, and how does a child read the id?
- +<EmailRow key={email.id} /> inside map() | right on the element map() returns: React matches each row
- +<Fragment key={email.id}><dt /><dd /></Fragment> | groups sibling tags per item with no extra DOM wrapper
- +<EmailRow key={email.id} id={email.id} /> | key for React, plus id={email.id} as a normal prop
- !<div key={email.id}> inside EmailRow, or { key } | too deep for map(), and props.key is always undefined
```

::: page tint=blue kicker="Bug Lab · Principle 4" title="Three Key Placement Traps: Putting key Inside the Child, Reading props.key, and Unkeyed <>" tagline="Putting key inside EmailRow, reading key from props, or grouping sibling tags without <Fragment key={...}>."

```hierarchy
EmailList | holds: `emails` | here: calls `emails.map()` (key belongs here!)
  EmailRow | gets: `email`, `id` (never `key`)
notes:
The PARENT (`EmailList`) calls `emails.map()`, so `key={email.id}` must sit on the `<EmailRow />` tag inside `EmailList.jsx`.
The CHILD (`EmailRow`) never receives `key` in `props`; if it needs the ID, `EmailList` passes `id={email.id}` separately.
Point of failure: moving `key={email.id}` onto `<div className="row">` inside `EmailRow.jsx` and reading `{ email, key }` fires two console errors and renders `data-id={undefined}`.
```

::: row
::: col tone=bad title="Trap: `key` inside `EmailRow` + reading `{ key }`"
```devconsole
x Each child in a list should have a unique "key" prop.
x EmailRow: `key` is not a prop. Trying to access it returns `undefined`.
```

> [!THINK]
> I wrote `key={email.id}` on the `<div>` inside `EmailRow` AND read `{ key }` from props. Why did both fail?

```jsx title="EmailList.jsx + EmailRow.jsx" bad="1,3" role=PARENT
{emails.map(e => <EmailRow email={e} />)}
// **PROBLEMATIC:** missing key in map(), and key is not a prop!
function EmailRow({ email, key }) {
  return <div key={email.id} data-id={key} />;
}
```
:::
::: col tone=good title="Fix: `key` on `map()` tag + `id` or `<Fragment>`"
```dom title="Elements panel"
<form>
+  <div class="row" data-id="1">🔥 FLASH SALE</div>
+  <dt>ShopNow</dt><dd>🔥 FLASH SALE</dd>
</form>
```

> [!THINK]
> Put `key` on the outer tag `map()` returns, pass `id={e.id}` for the child, and use `<Fragment key={e.id}>` for sibling tags!

```jsx title="EmailList.jsx" good="1-3,4-6" role=PARENT
{emails.map(e => (
  <EmailRow key={e.id} id={e.id} email={e} />
))}
{/* Key on outer tag + id prop; or keyed Fragment: */}
{emails.map(e => (
  <Fragment key={e.id}><dt /><dd /></Fragment>
))}
```
:::
:::

```chain
!`<EmailRow />` (no key in `map()`) -> React warns "missing key" -> `EmailRow({ key })` -> `key` is `undefined`
+`<EmailRow key={e.id} id={e.id} />` -> React reconciles by `key` -> `EmailRow({ id })` -> `id` is `1, 2, 3`
```

:::

## Summary

| Principle | The Trap | The Fix |
| :--- | :--- | :--- |
| **Principle 1 (`map-to-elements`)** | `for` loop (syntax error), `forEach()` (`undefined`), or `map(e => { <Row />; })` without `return` (blank list). | Return an element from `map()`: `emails.map(e => <EmailRow key={e.id} email={e} />)`. |
| **Principle 2 (`filter-then-map`)** | `{shown.length && rows}` evaluates to `0` when `shown` is empty and prints `"0"` on screen. | Filter first, then check `shown.length > 0 ? rows : <Empty />`. |
| **Principle 3 (`keys-name-items`)** | Missing `key` or `key={index}` pins state to row position; `key={Math.random()}` remounts every row each render. | Use a stable ID from the data: `key={email.id}`. |
| **Principle 4 (`key-on-mapped-element`)** | Putting `key` inside the child, reading `props.key` (`undefined`), or putting `key` on `<>`. | Put `key` on the tag `map()` returns, pass `id={e.id}`, and use `<Fragment key={e.id}>`. |

**Map data to elements, check `length > 0` first, and put a stable `key={item.id}` on the tag `map()` returns.**

**DO THIS:**
```jsx right
import { Fragment } from 'react';
export default function EmailList({ emails, folder }) {
  const shown = emails.filter(e => e.folder === folder);
  const rows = shown.map(e => <Fragment key={e.id}><EmailRow id={e.id} email={e} /></Fragment>);
  return <section>{shown.length > 0 ? rows : <p>No emails here.</p>}</section>;
}
```

**DO NOT DO THIS:**
```jsx wrong
export default function EmailList({ emails, folder }) {
  const shown = emails.filter(e => e.folder === folder);
  const rows = shown.map((e, i) => { <EmailRow key={i} email={e} />; });
  return <section>{shown.length && rows}</section>;
}
```

> **ANSWERING THE INTERVIEW QUESTION:** We render lists in JSX with `array.map()`, returning one JSX element per item (after filtering with `array.filter()` and checking `shown.length > 0` so an empty list never renders `0` via `shown.length && ...`). Every element returned directly by `map()` needs a `key` set to a stable, unique ID from the data (`key={item.id}`, or `<Fragment key={item.id}>` for multi-tag items). React uses `key` during reconciliation to match each element to its component instance and DOM node across re-renders: without a stable key (or with `key={index}`), inserting, deleting, or reordering items leaves local state and inputs stuck at the old row position, while `key={Math.random()}` destroys and remounts every row on every render. Finally, React strips `key` before creating `props`, so if the child component needs the ID we pass it as an explicit prop like `id={item.id}`.
