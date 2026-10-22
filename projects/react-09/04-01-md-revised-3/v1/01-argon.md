# Lecture 1: What is React and the Declarative Model
> INTERVIEW QUESTION | ❱ CORE | What is React, and how does its declarative, component-based model differ from plain JavaScript DOM scripting?

A web page shows data, such as a shopping cart's item count (`count = 3`), in multiple places on the screen (`Items: 3` and `Buy 3 items`). In *imperative* plain JavaScript, our code finds each **DOM node** by hand (`document.getElementById`) and overwrites its text one command at a time; in *declarative* React, a **component** (`Cart`) returns **JSX** describing what each element shows for `{count}`, and React keeps the **DOM** in sync through three principles:

```tree caption="The three principles of React's declarative model, illustrated with Cart and count."
How React keeps the page in sync when data changes
- Components (like `Cart`) describe the page | `describe-from-data`
- Every place reads the update of the same variable (e.g. `{count}`) | `one-value-every-place`
- React updates only the DOM parts that changed (e.g. `2` to `3`) | `smallest-change`
```

::: row caption="Updating the cart to 3 items: manual DOM commands in plain JavaScript versus a declarative JSX description in React."
::: col tone=bad title="Imperative: plain JavaScript (`old-cart.js`)"
```js bad="1-2"
items.textContent = 'Items: 3'; // Updates #items
// Forgot buy.textContent: button stays on 2!
```
Our code must find and update every DOM node by hand (`getElementById`). Forget the button command, and the page shows `"Items: 3"` above `"Buy 2 items"` with no error.
:::
::: col tone=good title="Declarative: React component (`Cart.jsx`)"
```jsx good="1-2"
<p>Items: {count}</p> {/* Describes the line */}
<button>Buy {count} items</button> {/* Describes the button */}
```
With `count = 3`, our component declares what both elements show for `{count}`, and React builds and updates both DOM nodes inside `#root` automatically.
:::
:::

::: pagebreak

## 1. Components (like `Cart`) describe the page
*In plain JavaScript we find each element by its id and change its text. What do we write instead in React, and why does `index.html` stay empty?*

```tree size=mini here="Components (like `Cart`) describe the page"
How React keeps the page in sync when data changes
- Components (like `Cart`) describe the page
- Every place reads the update of the same variable (e.g. `{count}`)
- React updates only the DOM parts that changed (e.g. `2` to `3`)
```

> [!FACT]
> The browser draws the screen from the **DOM** (Document Object Model), a tree of objects in memory where each tag is a **DOM node**. In React, a **component** is a JavaScript function whose name starts with a capital letter (`function Cart()`) that returns **JSX** markup reading JavaScript values inside curly braces (`{count}`).

> [!PRINCIPLE]
> **Principle 1: (`describe-from-data`) Components (like `Cart`) describe the page**
>
> **Why it happens:** The data in your JavaScript code (`count`) and the DOM nodes on the browser screen are two separate things. In plain JavaScript (imperative programming), every time `count` changes, you have to hunt down each DOM node by its `id` and overwrite its text by hand. This can be a trap whenever the same piece of data appears in more than one place. If you update the item line to `3` and forget to write a second command for the Buy button, the button stays stuck on `"Buy 2 items"` right on your screen - with zero errors in the console! You see, a manual script only changes the exact DOM nodes you remember to name. In React (declarative programming), you never touch DOM nodes by hand. Instead, your component returns JSX describing what the screen should show for `{count}`, and React builds and updates every DOM node from that description.
>
> **The Rule:** Write a component that returns JSX describing what each element shows from data (`<p>Items: {count}</p>`), and let React build and update the DOM. Never use `document.getElementById` or `.textContent` to change React elements by hand.
>
> *We should do this:*
>
> ```jsx
> return <p>Items: {count}</p>; // React builds and updates the DOM node
> ```
>
> *We should not do this:*
>
> ```js
> document.getElementById('items').textContent = 'Items: 3'; // **PROBLEMATIC:** manual DOM edit
> ```

```tree dir=right caption="Who builds and changes the DOM when count becomes 3, and what each approach risks."
Who changes the DOM nodes?
- +React, from the JSX returned by Cart() | builds all DOM nodes inside #root and updates every place automatically
- !Our code, with getElementById() and textContent | updates only the nodes we remember to name; forgotten nodes stay stale
- !getElementById() inside a component on first run | returns null because React has not put the DOM nodes on the page yet
```

::: page tint=blue kicker="Bug Lab · Principle 1" title="Manual DOM Code Forgets an Element (e.g. #buy), While a Component (Cart) Updates Everything" tagline="An imperative script updates #items and forgets #buy, whereas React builds the whole cart inside an empty #root from Cart.jsx."

```hierarchy
App | holds: the shop page | here: renders `<Cart />` inside `#root`
  Cart | holds: `count = 3` | here: returns `<p>` and `<button>` from `{count}`
notes:
`App.jsx` (PARENT) imports `Cart` from `Cart.jsx` (`export default`); `npm run dev` sends saved edits to the browser.
`Cart.jsx` (CHILD) sets `const count = 3` and returns the JSX description for both `<p>` and `<button>`.
Point of failure: `old-cart.js` sets `el.textContent = 'Items: 3'` on `#items` and forgets `#buy`.
```

::: row
::: col tone=bad title="Imperative: `old-cart.js` (one command)"
```shop size=mini url=localhost:5173/old-cart.html
text: Items: 3
button: Buy 2 items | bad | old count
```

> [!THINK]
> The cart says "Items: 3", so why is the button still offering to "Buy 2 items"?!

```js title="old-cart.js" bad="2-3"
const el = document.getElementById('items');
el.textContent = 'Items: 3';
// **PROBLEMATIC:** updates #items, forgets #buy
```
:::
::: col tone=good title="Declarative: `Cart.jsx` (`count = 3`)"
```shop size=mini
text: Items: 3 | good
button: Buy 3 items | good
```

> [!THINK]
> `index.html` only has an empty `<div id="root">`, yet `Cart` describes both tags with `{count}` and React builds the DOM!

```jsx title="Cart.jsx" good="2-3" role=CHILD
const count = 3; // Saved in Cart.jsx
return <><p>Items: {count}</p>
  <button>Buy {count} items</button></>;
```
:::
:::

```chain
!`old-cart.js` updates `#items` -> forgets `#buy` -> Screen shows `3` and `2`
+Empty `<div id="root">` in `index.html` -> React runs `Cart()` -> Builds `<section>` with both `3`s
```

:::

## 2. Every place reads the update of the same variable (e.g. `{count}`)
*When the same count appears in the cart line and on the Buy button, why does typing `2` by hand into JSX break updates?*

```tree size=mini here="Every place reads the update of the same variable (e.g. `{count}`)"
How React keeps the page in sync when data changes
- Components (like `Cart`) describe the page
- Every place reads the update of the same variable (e.g. `{count}`)
- React updates only the DOM parts that changed (e.g. `2` to `3`)
```

> [!FACT]
> Inside JSX, characters typed directly between tags (`<button>Buy 2 items</button>`) are fixed text, whereas curly braces (`<button>Buy {count} items</button>`) read the JavaScript variable `count` on every render. Keeping a shared value in one variable that every element reads is called a **single source of truth**.

> [!PRINCIPLE]
> **Principle 2: (`one-value-every-place`) Every place reads the same variable (e.g. `{count}`)**
>
> **Why it happens:** Even inside React, an element on the screen is only connected to your variable in memory when you wrap that variable in curly braces `{ }`. This can be a trap when you copy HTML from an old page into JSX and leave a number or name typed in by hand. If you change `count` from `2` to `3`, the line `<p>Items: {count}</p>` updates to `3`, while `<button>Buy 2 items</button>` stays stuck on `"Buy 2 items"` right on your screen! You see, React did nothing wrong - a `2` typed outside `{ }` is just fixed text, so changing the variable `count` never touches it.
>
> **The Rule:** Keep each shared value in one variable (a **single source of truth**) and read it with `{count}` in every element that shows it. Never type a hardcoded copy of the value into your JSX markup.
>
> *We should do this:*
>
> ```jsx
> <button>Buy {count} items</button> // Reads {count} from the single source of truth
> ```
>
> *We should not do this:*
>
> ```jsx
> <button>Buy 2 items</button> // **PROBLEMATIC:** hardcoded 2 never updates when count changes
> ```

```tree dir=right caption="Every way to show a shared value across multiple JSX elements when count changes from 2 to 3."
How should multiple elements show the same value?
- +Read `{count}` in every element (single source of truth) | one change to `count` updates the line, the button, and any new badge at once
- !Type `2` by hand in `<button>Buy 2 items</button>` | fixed text: stays stuck on "Buy 2 items" when `count` becomes 3
```

::: page tint=blue kicker="Bug Lab · Principle 2" title="Hardcoded Text in JSX (e.g. 'Buy 2 items') Ignores Updates to the Variable (count = 3)" tagline="When migrating HTML into Cart.jsx, leaving 'Buy 2 items' as plain text instead of {count} splits the UI in two."

```hierarchy
App | holds: the shop page
  Cart | holds: `count = 3` | here: `<p>` reads `{count}`, `<button>` has `"2"` typed by hand
notes:
`App.jsx` (PARENT) renders `<Cart />`.
`Cart.jsx` (CHILD) holds `const count = 3` at the top of the function.
Point of failure: `<button>Buy 2 items</button>` was pasted with a literal `2` instead of `{count}`, so saving `count = 3` updates `<p>` to `3` while `<button>` stays on `2`.
```

::: row
::: col tone=bad title="Hardcoded copy: `Buy 2 items`"
```shop size=mini
text: Items: 3
button: Buy 2 items | bad | old count
```

> [!THINK]
> I am using React and I changed `count` to `3` in `Cart.jsx` - why does the button still say "Buy 2 items"?!

```jsx title="Cart.jsx" bad="3" role=CHILD
const count = 3; // Changed from 2, then saved
return <><p>Items: {count}</p>
  <button>Buy 2 items</button></>; // **PROBLEMATIC:** fixed 2
```
:::
::: col tone=good title="Single source of truth: `{count}`"
```shop size=mini
text: Items: 3 | good
button: Buy 3 items | good
```

> [!THINK]
> Wrapping `{count}` in curly braces in both places links both elements to the same single source of truth!

```jsx title="Cart.jsx" good="2-3" role=CHILD
const count = 3; // Changed from 2, then saved
return <><p>Items: {count}</p>
  <button>Buy {count} items</button></>; // Reads {count}
```
:::
:::

```chain
!`count = 3` -> `<p>Items: {count}</p>` reads `3`, `<button>Buy 2 items</button>` has fixed `2` -> Screen shows `3` and `2`
+`count = 3` -> Both `<p>` and `<button>` read `{count}` -> Every place on screen updates to `3` together
```

:::

## 3. React updates only the DOM parts that changed (e.g. `2` to `3`)
*If `Cart` returns a brand-new description of the whole cart on every update, why doesn't React wipe out what the shopper typed in the note box?*

```tree size=mini here="React updates only the DOM parts that changed (e.g. `2` to `3`)"
How React keeps the page in sync when data changes
- Components (like `Cart`) describe the page
- Every place reads the update of the same variable (e.g. `{count}`)
- React updates only the DOM parts that changed (e.g. `2` to `3`)
```

> [!FACT]
> When a shopper clicks into an `<input>` box and types, that real DOM node holds the typed text and the **focus** (the blinking cursor). In plain JavaScript, replacing a section with `section.innerHTML = ...` destroys every DOM node inside it and creates brand-new ones, wiping out the typed text and losing focus.

> [!PRINCIPLE]
> **Principle 3: (`smallest-change`) React updates only the DOM parts that changed (e.g. `2` to `3`)**
>
> **Why it happens:** The JSX description your component returns in JavaScript memory (often called the **virtual DOM**) and the real DOM nodes sitting on the browser screen are two separate things. When `count` changes, React calls your component again and gets a brand-new JSX description of the whole section. This can look like a trap - if you rebuilt the whole section in plain JavaScript with `innerHTML`, the browser would destroy the `<input>` box and wipe out whatever the user was typing right on the screen! You see, React never replaces the whole DOM tree. Instead, React compares the new JSX description against the previous one and updates only the text nodes that actually changed (`2` to `3`), leaving the existing `<input>` DOM node, its typed text, and its blinking cursor completely untouched.
>
> **The Rule:** Let your component return the full JSX description on every render so React can compare the old and new descriptions and make the smallest possible DOM change. Never rebuild UI containers with `innerHTML`.
>
> *We should do this:*
>
> ```jsx
> return <section><p>{count}</p><input /></section>; // Updates {count}; <input> stays untouched
> ```
>
> *We should not do this:*
>
> ```js
> cart.innerHTML = `<p>${count}</p><input />`; // **PROBLEMATIC:** destroys <input>, wipes typed text
> ```

```tree dir=right caption="What happens to each DOM node inside Cart when count changes from 2 to 3."
How is the cart updated when `count` changes from 2 to 3?
- +React compares old and new JSX descriptions (virtual DOM) | changes only `2 -> 3` in `<p>` and `<button>`; keeps the `<input>` DOM node, its note, and focus
- +When the new description equals the old description | React touches zero DOM nodes on the page
- !Rebuilding the container with `cart.innerHTML = ...` | destroys and recreates every DOM node: wipes out `"Please ring the bell"` and drops focus
```

::: page tint=blue kicker="Bug Lab · Principle 3" title="Why Updating a Variable (e.g. count = 3) Never Wipes the User's Typed <input> Note" tagline="The shopper types 'Please ring the bell' into <input>, we save count = 3, and React updates only the two numbers."

```hierarchy
App | holds: the shop page
  Cart | holds: `count` (`2 -> 3`) and `<input>` | here: returns a new JSX description on save
notes:
On the open page (`count = 2`), the shopper types `"Please ring the bell"` into `<input placeholder="Note to the shop" />`.
We change `count` to `3` in `Cart.jsx` and save; React calls `Cart()` again and compares the new description against the last one.
Point of failure: `innerHTML` destroys the `<input>` DOM node and wipes the note, whereas React changes only the two `"2"` to `"3"` text nodes.
```

::: row arrows
::: col tone=plain title="Before the save: `count = 2`"
```shop size=mini
text: Items: 2
typed: Please ring the bell
button: Buy 2 items
```

> [!THINK]
> I typed "Please ring the bell" in the note box. When `count` becomes 3, will my note get wiped out?

```jsx title="Cart.jsx (before save)" good="2-3" role=CHILD
const count = 2; // Before the save
return <><p>Items: {count}</p><input />
  <button>Buy {count} items</button></>;
```
:::
::: col tone=good title="After the save: `count = 3`"
```shop size=mini
text: Items: 3 | good
typed: Please ring the bell | good | still here
button: Buy 3 items | good
```

> [!THINK]
> Both 2s changed to 3, and "Please ring the bell" is still in the box with my blinking cursor!

```jsx title="Cart.jsx (after save)" good="2-3" role=CHILD
const count = 3; // Saved as 3
return <><p>Items: {count}</p><input />
  <button>Buy {count} items</button></>; // <input> untouched!
```
:::
:::

```chain
!`cart.innerHTML = ...` -> Destroys `<input>` DOM node -> Wipes `"Please ring the bell"` and focus
+React virtual DOM diff -> Updates `2` to `3` in `<p>` and `<button>` -> `<input>` note and cursor stay intact
```

:::

## Summary

| Principle | The Trap | The Fix |
| :--- | :--- | :--- |
| **Principle 1 (`describe-from-data`)** | Finding DOM nodes with `getElementById` and setting `.textContent` by hand: forget `#buy`, and it stays stuck on `2` with no error. | Return JSX from `Cart` describing what each element shows from `{count}`, and let React build and update `#root`. |
| **Principle 2 (`one-value-every-place`)** | Pasting a hardcoded copy like `<button>Buy 2 items</button>` into JSX: fixed text never changes when `count` becomes `3`. | Keep shared data in one variable (**single source of truth**) and read `{count}` in every element that displays it. |
| **Principle 3 (`smallest-change`)** | Rebuilding a section with `innerHTML` destroys the `<input>` DOM node, wiping out typed text and dropping focus. | Return the full JSX description; React compares old and new descriptions (**virtual DOM**) and updates only `2 -> 3`. |

**One description, one value, and the smallest change.**

**DO THIS:**
```jsx right
export default function Cart() {
  const count = 3;
  return <section><p>Items: {count}</p><input placeholder="Note" />
    <button>Buy {count} items</button></section>;
}
```

**DO NOT DO THIS:**
```jsx wrong
export default function Cart() {
  const count = 3;
  document.getElementById('items').textContent = 'Items: 3';
  return <section><p id="items">Items: {count}</p><input placeholder="Note" />
    <button id="buy">Buy 2 items</button></section>;
}
```

> **ANSWERING THE INTERVIEW QUESTION:** React is a JavaScript library for building user interfaces out of components (controlling a whole page or a single root on an existing page). In plain JavaScript DOM scripting, our code is *imperative*: we find each DOM node with `document.getElementById` and mutate its `.textContent` step by step, so forgetting even one node leaves stale data on the screen with zero errors. React is *declarative*: a component function returns JSX describing what the UI should show for the current data, and React builds and updates the real DOM nodes inside `<div id="root">` to match. We store each shared value in a single variable (a *single source of truth*) and read it with `{count}` everywhere it appears, because any value typed as literal text in JSX stays frozen. Finally, when data changes, React does not rebuild the DOM tree like `innerHTML` (which would destroy `<input>` nodes and wipe out typed text and focus); instead, React calls the component again, compares the new JSX description in memory (the *virtual DOM*) against the previous one, and applies only the minimal DOM operations needed (changing the two `"2"` text nodes to `"3"` while leaving the `<input>` DOM node untouched). The benefit is not that React is faster than raw DOM calls, since React still calls browser DOM methods under the hood, but that developers never write or forget manual DOM update steps.
