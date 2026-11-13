# Lecture 29: Combining a Reducer with Context for App-Wide State

*(How can a button deep in the page change a state that lives at the top?)*

> INTERVIEW QUESTION | ❱ CORE | How do you combine a reducer with context for app-wide state?

---

## VS | Props vs. Context for the Cart and `dispatch`: props pass through every component, context skips the middle

> **`useReducer` with context lets any component, however deep in the page, read and change the shared state without passing props.**

In React, different parts of a page often need to read and update the exact same data, like a shopping cart, a logged-in user profile, or a list of notifications. Normally, we store that shared state at the very top of the page and pass both the data and its update functions down through props, step by step, from parent to child. Passing props down this way, through layer after layer, is called prop drilling. You do not want to pass props by hand through layers of components that never even use them. **This is why we combine `useReducer` with Context**. Together, **they let any component deep in the page read the state and change it directly**, without the components in between passing props down.

Take an online shop where the header at the top says **Cart: 3 items**. Far below, inside the **Your Cart** section, every product row has a **Delete** button. When the user clicks **Delete** on an item, that row must disappear and, at that exact same moment, the top header must change to **Cart: 2 items**. Ask yourself: how does a **Delete** button buried deep inside a product row reach all the way back up to change the cart state at the top of the page? We call `useReducer` in the component at the top of the hierarchy, and Context carries the cart and its `dispatch` function down. So the top header and the deep **Delete** button work with the same cart, even with several layout components in between.

**Why:** Because both the header at the top and the list at the bottom need the cart, the cart state must live in the main component at the very top of the page. With ordinary props, that top component must hand the cart data and every click handler, such as `onAdd`, `onDelete`, and `onUpdate`, down through every single component along the way, even layout wrappers and sections that have nothing to do with the cart. Worse, if just one component in the middle forgets to pass the **Delete** handler down to the next child, clicking **Delete** crashes and the item is never deleted. It stays stuck on the page. See the problem? Forcing middleman components to carry props they do not use makes your code fragile and messy. Combining `useReducer` with Context solves this by letting the top component broadcast both the state and its `dispatch` function straight to the header and the **Delete** button, skipping every component in between.

Here is the one sentence to keep in mind for this whole lesson:

**The state still lives in the component that calls `useReducer`. Context only delivers it, the cart in one context and `dispatch` in another.**

You already know both pieces. Here they are again, quickly.

> [!DEFINITION]
> **A reducer and dispatch.** [REVIEW] A reducer is a plain function that takes the current state and an action, and returns the next state: `cartReducer(cart, action)`.
> You connect it to a component with `const [cart, dispatch] = useReducer(cartReducer, initialCart)`. You get two things back: `cart`, the current state, and `dispatch`, a function.
> When the user clicks, you never change the cart yourself. You call `dispatch({ type: 'deleted', id: 1 })`. React passes that action to your reducer and renders the component again with the new cart.
> So `dispatch` is just a function. You can pass it around like any other value (Lesson 27).

> [!DEFINITION]
> **A context.** [REVIEW] A context lets a component far below get a value without props. You create one with `createContext`, a provider supplies the value, and a component below asks for it with `useContext`.
> `<ThemeContext value={theme}>` wraps part of the page. Any component inside it calls `useContext(ThemeContext)` and gets `theme`, however deep it sits.
> A context stores nothing by itself. It only carries what its provider gives it (Lesson 28).

### The whole idea in one code block

In plain JavaScript, sharing one value with many places is easy. You put the cart in one file, export it, and import it wherever you need it:

```js title="Plain JavaScript: one shared variable"
import { cart, deleteItem } from './cart.js';
~deleteItem(1)~; // The array changes, but nothing tells the page to update
```

In React, that does not work. A plain variable can change, but React does not know, so the screen stays the same. The cart has to be state. And state lives inside one component, the one that calls `useReducer`.

So the real question is: how does a button five components down reach the `dispatch` of the component at the top? Context is how the button asks React: "Find the closest provider above me, and give me its value."

```jsx title="React: one reducer, two contexts"
function App() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  return (
    <CartContext ~value={cart}~> {/* Delivers the cart to every component inside */}
      <CartDispatchContext ~value={dispatch}~> {/* Delivers dispatch to every component inside */}
        <Page />
      </CartDispatchContext>
    </CartContext>
  );
}

function Header() {
  const cart = ~useContext(CartContext)~; // The cart that App holds
  return <p>Cart: {cart.length} items</p>;
}

function DeleteButton({ id }) {
  const dispatch = ~useContext(CartDispatchContext)~; // The dispatch that App got from useReducer
  return <button onClick={() => dispatch({ type: 'deleted', id: id })}>Delete</button>;
}
```

**Yes, it is the exact same thing as Lesson 28!** There is no new tool here. `dispatch` is a value like `theme`. The component that has it puts it in a provider, and a component below asks for it with `useContext`.

React's docs say it in three sentences: "Reducers let you consolidate a component's state update logic. Context lets you pass information deep down to other components. You can combine reducers and context together to manage state of a complex screen."

```tree caption="A reducer and a context each do one job. Together, a component far below can read the state and send actions."
A reducer and a context on the same page
- +The reducer [`useReducer` `cartReducer`] | Keeps **all the update logic** in one function | Gives **`cart`** and **`dispatch`** to the component that calls it
- +The context [`CartContext` `useContext`] | Carries a value **deep down the tree** | Any component below **asks for it** without props
- +Both together | `App` puts **`cart` and `dispatch`** into two providers | `Header` reads the cart, and a button far below **sends actions**
```

### Why two contexts, and not one

Both values come from the same `useReducer` call. The one difference is how often they change:
1. **`cart` changes.** After every action that changes the cart, `cart` is a new array.
2. **`dispatch` never changes.** It is the very same function on every render. React's docs say `dispatch` "has a stable identity".

So each value gets its own context. A component that only sends actions reads only `dispatch`, which never changes. So React does not need to render it again when the cart changes. Principle 4 shows this on the real page.

### What "app-wide state" really means

The interview question says app-wide state. That is state that many parts of the page read and change, such as a cart that the header counts and every row changes.

It is not a new kind of state, and it is not one global variable. React's docs put the word in quotes: the state still "lives" in the component at the top, managed with `useReducer`.

A senior developer also knows the four classic mistakes:
1. **Thinking the state moved into the context.** It did not. The context carries the cart from `useReducer`, and stores nothing itself.
2. **Thinking app-wide means global.** Each reader gets the value of the closest provider above it. A component outside every provider gets the default value, `null` on our page.
3. **Putting both values in one object.** Then every reader gets a new object on every render, and React renders all of them again.
4. **Removing every prop.** A prop that a component really needs, such as the one item each row shows, stays a prop.

### Four ways to share one state with distant components

1. **Props, as in Lessons 23 and 24.** The state sits in the closest common parent, which passes it down. This fits when few components sit in the middle. React's docs warn that with "tens or hundreds of components in the middle, passing down all state and functions can be quite frustrating!"
2. **Passing JSX as `children` (Lesson 28).** Fewer components sit in the middle, so fewer props travel.
3. **A reducer with context, this lesson.** This fits when many distant components read or change the same state. React's docs call it common "to use a reducer together with context to manage complex state and pass it down to distant components without too much hassle."
4. **`useState` with context.** One context carries an object that holds the state and its setter (Lesson 28).

## SECTION | A Corner Shop with a Cart

Our page is the cart of Lesson 27, now on a small shop page. A header at the top shows the title and the item count. Under Your cart, each item has a row with three buttons. An Empty cart button sits at the bottom:

```page width=text caption="The shop page when it opens: the header with the item count, three cart rows, and the Empty cart button."
heading: Corner Shop
line: Cart: 3 items
section: Your cart
line: • Apple: 1 [Add one] [Remove one] [Delete]
line: • Bread: 2 [Add one] [Remove one] [Delete]
line: • Milk: 1 [Add one] [Remove one] [Delete]
line: [Empty cart]
console: quiet
```

Here is what each click changes:
1. **Add one on Bread.** The row shows Bread: 3. The header still says Cart: 3 items, because it counts rows, and there are still three rows.
2. **Delete on Apple.** The Apple row leaves, and the header says Cart: 2 items.
3. **Empty cart.** Every row leaves, the line Your cart is empty. appears, and the header says Cart: 0 items.

The page has six components. Two of them, far apart, read the cart: `Header` and `CartList`. Two others change it: `CartRow` and `EmptyCartButton`. And `CartPage`, in the middle, uses nothing at all:

```tree caption="The components of the shop page, and what each one does with the cart at the start of the lesson."
`App` [`useReducer`] | Holds **`cart`** and **four handlers**
- +`Header` | **Reads** `cart` to show the count
- !`CartPage` | Receives **five props** and **uses none of them**
  - +`CartList` | **Reads** `cart` and passes **three handlers** to each row
    - +`CartRow` | Shows `item` and **calls** three handlers
  - +`EmptyCartButton` | **Calls** `onEmpty`
```

The project keeps the reducer of Lesson 27, unchanged, and puts each component in its own file:

```files title="corner-shop: File Explorer" caption="How the files of the shop page sit inside src/ and src/components/ at the start of the lesson."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | state | Calls `useReducer` and passes `cart` and four handlers down as props
  cartReducer.js | reducer | Exports `cartReducer` as default, unchanged from Lesson 27
  components/
    Header.jsx | reads | Exports `Header` as default
    CartPage.jsx | middle | Exports `CartPage` as default and imports `CartList` and `EmptyCartButton`
    CartList.jsx | reads | Exports `CartList` as default and imports `CartRow`
    CartRow.jsx | changes | Exports `CartRow` as default
    EmptyCartButton.jsx | changes | Exports `EmptyCartButton` as default
```

At the start, `App` calls `useReducer` and holds four handlers. Each handler is one line that sends an action, as in Lesson 27:

```jsx title="src/App.jsx"
import { useReducer } from 'react';
import cartReducer from './cartReducer.js';
import Header from './components/Header.jsx';
import CartPage from './components/CartPage.jsx';

const initialCart = [
  { id: 0, name: 'Apple', quantity: 1 },
  { id: 1, name: 'Bread', quantity: 2 },
  { id: 2, name: 'Milk', quantity: 1 },
];

export default function App() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);

  function handleIncrease(id) {
    dispatch({ type: 'increased', id: id });
  }

  function handleDecrease(id) {
    dispatch({ type: 'decreased', id: id });
  }

  function handleDelete(id) {
    dispatch({ type: 'deleted', id: id });
  }

  function handleEmpty() {
    dispatch({ type: 'emptied' });
  }

  return (
    <>
      <Header cart={cart} />
      <CartPage ~cart={cart} onIncrease={handleIncrease} onDecrease={handleDecrease} onDelete={handleDelete} onEmpty={handleEmpty}~ /> {/* Five props for a component that uses none of them */}
    </>
  );
}
```

`Header` shows the count:

```jsx title="src/components/Header.jsx"
export default function Header({ cart }) {
  return (
    <header>
      <h1>Corner Shop</h1>
      <p>Cart: {cart.length} items</p>
    </header>
  );
}
```

`CartPage` receives five props and only hands them on:

```jsx title="src/components/CartPage.jsx"
import CartList from './CartList.jsx';
import EmptyCartButton from './EmptyCartButton.jsx';

export default function CartPage({ ~cart, onIncrease, onDecrease, onDelete, onEmpty~ }) { // Receives five props, reads none of them
  return (
    <main>
      <h2>Your cart</h2>
      <CartList cart={cart} onIncrease={onIncrease} onDecrease={onDecrease} onDelete={onDelete} />
      <EmptyCartButton onEmpty={onEmpty} />
    </main>
  );
}
```

`CartList` reads the cart and hands three handlers on to every row:

```jsx title="src/components/CartList.jsx"
import CartRow from './CartRow.jsx';

export default function CartList({ cart, onIncrease, onDecrease, onDelete }) {
  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }
  return (
    <ul>
      {cart.map(item => (
        <CartRow key={item.id} item={item} ~onIncrease={onIncrease} onDecrease={onDecrease} onDelete={onDelete}~ /> // Passes on three handlers it never calls
      ))}
    </ul>
  );
}
```

At the bottom, `CartRow` and `EmptyCartButton` finally call the handlers:

```jsx title="src/components/CartRow.jsx"
export default function CartRow({ item, onIncrease, onDecrease, onDelete }) {
  return (
    <li>
      {item.name}: {item.quantity}
      <button onClick={() => onIncrease(item.id)}>Add one</button>
      <button onClick={() => onDecrease(item.id)}>Remove one</button>
      <button onClick={() => ~onDelete(item.id)~}>Delete</button> {/* The handler that came down from App */}
    </li>
  );
}
```

```jsx title="src/components/EmptyCartButton.jsx"
export default function EmptyCartButton({ onEmpty }) {
  return <button onClick={~onEmpty~}>Empty cart</button>; // The handler that came down from App through CartPage
}
```

The page works. But `CartPage` and `CartList` carry handlers they never call, only to pass them on. This is the prop drilling of Lessons 24 and 28.

And it is fragile. Suppose `CartList` forgets to pass `onDelete` to the rows. The user clicks Delete on Bread, and the row stays. The Console says that `onDelete` is not a function.

The rest of the lesson removes the drilling, one step at a time. At every step, the page the user sees stays the same.

**PRINCIPLES:** The state and `dispatch` stay in the component that calls `useReducer`. Two contexts deliver them to every component below. Five principles follow:
1. **Principle 1: Two Contexts, One for the State and One for dispatch.** Each is made by `createContext` with the default value `null`, in a file of its own.
2. **Principle 2: Two Providers in the Component That Calls useReducer.** `App` puts the cart in one provider and `dispatch` in the other. Nothing changes until a component below reads them.
3. **Principle 3: Each Component Reads Only What It Needs.** The readers get the cart, the buttons get `dispatch`, and `CartPage` loses all five props.
4. **Principle 4: A Provider Component That Takes children.** `CartProvider` holds the reducer and both providers, so `App` only places it around the page.
5. **Principle 5: Two Custom Hooks Read the Two Contexts.** `useCart` and `useCartDispatch` return each value, so the components never touch the contexts.

---

## PRINCIPLE | createContext: the cart and dispatch each get their own context

> [!PRINCIPLE]
> **Principle 1: Two Contexts, One for the State and One for dispatch**
>
> *Create two separate contexts with createContext and the default value null: one carries the state, the other carries dispatch.*
>
> One useReducer call gives two values, and they change at different rates. The cart is a new array after every action, and dispatch never changes. Give each value its own context, so a component reads only the one it needs. Packing both into one object makes a new object on every render, and every reader renders again.
>
> **DO THIS:**
> ```jsx
> export const CartContext = createContext(null);
> export const ~CartDispatchContext~ = createContext(null); // dispatch gets a context of its own
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <ShopContext ~value={{ cart, dispatch }}~> {/* **WRONG:** a new object on every render, so every reader renders again */}
>   <CartPage />
> </ShopContext>
> ```

The first step is to create the contexts. One `useReducer` call gives two values, so we create two contexts, in a new file:

```jsx title="src/CartContext.jsx"
import { createContext } from 'react';

export const ~CartContext~ = createContext(null); // Will carry the current cart
export const ~CartDispatchContext~ = createContext(null); // Will carry the dispatch function
```

**Yes, it is the exact same thing as Lesson 28!** Each line is an ordinary `createContext`. Nothing in it knows about reducers. The name of each context simply says what it will carry.

React's docs build the same pair for a to-do list. One context provides the list, and the other "provides the function that lets components dispatch actions."

Three details:
1. **The default value is `null`.** The real values will come from the component that calls `useReducer`, in the next principle. A component reads `null` only when no provider sits above it.
2. **The contexts sit in their own file.** Every component file can then import them by name, with curly braces (Lesson 05).
3. **The file name ends in `.jsx`.** From Principle 4 on, this file holds JSX too.

```tree caption="The two contexts of the cart: what each one will carry, and where the value will come from."
Two contexts in the context file
- +`CartContext` [`createContext`] | Starts as **`null`** | Will carry **the current cart**, from `useReducer`
- +`CartDispatchContext` [`createContext`] | Starts as **`null`** | Will carry **`dispatch`**, from the same `useReducer`
```

### VS | Two contexts vs. one context with both values: the single object is new on every render

A junior developer often makes one context for both values. Here are the two side by side:

```jsx title="Two contexts, and one context that carries both values"
<CartContext ~value={cart}~> {/* Two contexts: the cart in one, dispatch in the other */}
  <CartDispatchContext value={dispatch}>...</CartDispatchContext>
</CartContext>

<ShopContext ~value={{ cart, dispatch }}~>...</ShopContext> {/* One context: a new object on every render */}
```

When the page opens, both show the same page. **It may look the same, but it is NOT the same thing!**

Look at the double curly braces. The outer pair means "a JavaScript value here". The inner pair builds a brand-new object, every time the component renders.

React compares the old value and the new value of a context with `Object.is`. Two different objects are never equal. So React renders again every component that reads `ShopContext`, even one that only uses `dispatch`.

With two contexts, `CartDispatchContext` always carries the same function. `Object.is` finds it equal, and its readers can stay as they are. Principle 4 shows it in the Console.

### Why null, and not an empty array

The default value matters too. With `null`, a component placed outside the provider crashes loudly when it reads `cart.length`. With `[]`, the same header would quietly say Cart: 0 items, and the mistake would hide.

So `null` is a choice: a mistake should be loud. React's docs use `null` for this pattern.

### Our page after this step

Nothing on the page changes yet. No component imports the contexts, so everything still works through props, and the Console stays quiet.

---

## PRINCIPLE | Two providers with value: everything inside can reach the cart and dispatch

> [!PRINCIPLE]
> **Principle 2: Two Providers in the Component That Calls useReducer**
>
> *The component that calls useReducer puts the state in one provider and dispatch in the other, around everything it renders.*
>
> Only the component that calls useReducer has the cart and dispatch, so it is the one that provides them. The order of the two providers does not matter, because each reader looks only for its own context. A provider only makes a value available, so nothing changes until a component below reads it. The prop must be named value, or every reader gets undefined.
>
> **DO THIS:**
> ```jsx
> <CartContext value={cart}>
>   <CartDispatchContext ~value={dispatch}~> {/* Readers below get the dispatch from useReducer */}
>     <CartPage />
>   </CartDispatchContext>
> </CartContext>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <CartContext value={cart}>
>   <CartDispatchContext ~dispatch={dispatch}~> {/* **WRONG:** no value prop, so readers below get undefined */}
>     <CartPage />
>   </CartDispatchContext>
> </CartContext>
> ```

The second step is to provide the two values. `App` already has both values, so it wraps everything it renders in the two providers. React's docs call this step "Put state and dispatch into context".

First, `App` imports the two contexts:

```jsx title="src/App.jsx" startLine="1"
import { useReducer } from 'react';
import cartReducer from './cartReducer.js';
import { ~CartContext, CartDispatchContext~ } from './CartContext.jsx'; // Named exports, so curly braces
import Header from './components/Header.jsx';
import CartPage from './components/CartPage.jsx';
```

Then its return wraps the same two components in the two providers. It keeps every prop for now:

```jsx title="src/App.jsx" startLine="32"
  return (
    <CartContext ~value={cart}~> {/* Makes the cart available below */}
      <CartDispatchContext ~value={dispatch}~> {/* Makes dispatch available below */}
        <Header cart={cart} />
        <CartPage cart={cart} onIncrease={handleIncrease} onDecrease={handleDecrease} onDelete={handleDelete} onEmpty={handleEmpty} />
      </CartDispatchContext>
    </CartContext>
  );
}
```

React's docs take the same in-between step: "For now, you pass the information both via props and in context".

### A provider only makes a value available

A junior developer often expects the buttons to start using the context right away. They do not. A provider only makes a value available. Nothing changes until a component below asks for it with `useContext`.

So the page looks the same, and every click works the same. The providers add no element to the page either. The Elements panel shows the same `<header>` and `<main>` as before.

One more thing: `App` itself cannot read the contexts it provides. React's docs say a `useContext` call "is not affected by providers returned from the *same* component". `App` does not need to, because it already has both values.

### Either order works

One provider sits inside the other, so they can go in either order:

```jsx title="The two orders of the providers"
<CartContext value={cart}><CartDispatchContext value={dispatch}>...</CartDispatchContext></CartContext> {/* CartContext outside */}
<CartDispatchContext value={dispatch}><CartContext value={cart}>...</CartContext></CartDispatchContext> {/* CartDispatchContext outside */}
```

**Yes, it is the exact same thing!** A reader asks for one context by name. React finds the closest provider of that context above it, and skips providers of any other context (Lesson 28).

### A provider without value

A real mistake at this step is to name the prop after what it carries:

```jsx title="src/App.jsx" startLine="34"
      <CartDispatchContext ~dispatch={dispatch}~> {/* **WRONG:** a provider reads only the prop named value */}
```

React's docs say a provider without `value` is "like passing `value={undefined}`". The page still works for now, because every component still uses props. But React already prints a warning when the page opens:

```page width=text caption="The shop page when App provides dispatch with a prop named dispatch instead of value: the page works, and the Console shows a warning."
heading: Corner Shop
line: Cart: 3 items
section: Your cart
line: • Apple: 1 [Add one] [Remove one] [Delete]
line: • Bread: 2 [Add one] [Remove one] [Delete]
line: • Milk: 1 [Add one] [Remove one] [Delete]
line: [Empty cart]
console: The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?
```

The real damage comes in the next principle, once `CartRow` reads the context. A provider does sit above the row, so the row gets `undefined`, not the default `null`. The user clicks Delete, and the row stays. The Console says that `dispatch` is not a function.

The fix: name the prop `value`.

---

## PRINCIPLE | useContext: each component reads only what it needs, and the middle drops its props

> [!PRINCIPLE]
> **Principle 3: Each Component Reads Only What It Needs**
>
> *A component that shows the cart reads CartContext. A component that changes the cart reads CartDispatchContext and sends its own action. The components in the middle stop receiving props they never used.*
>
> With props, every component between App and the buttons carried handlers it never called, and one forgotten prop broke a button. With the two contexts, each component asks for what it uses, right where it uses it. One click deep in a row changes the header at the top, because both read the same cart from App. A prop that a component really needs, such as the item of one row, stays a prop.
>
> **DO THIS:**
> ```jsx
> function CartRow({ item }) {
>   const dispatch = ~useContext(CartDispatchContext)~; // Reads dispatch from the closest provider above
>   return <button onClick={() => dispatch({ type: 'deleted', id: item.id })}>Delete</button>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function CartPage({ ~onDelete~ }) { // **WRONG:** carries a handler it never calls, only to pass it down
>   return <CartList onDelete={onDelete} />;
> }
> ```

The third step is to read the contexts where the values are used.

### VS | A handler from the parent vs. dispatch from the context: the same click, a different path

Here are two ways for a row to delete its item:

```jsx title="A Delete button with onDelete from the parent, and with dispatch from the context"
function CartRow({ item, ~onDelete~ }) { // onDelete came down from App through every parent
  return <button onClick={() => onDelete(item.id)}>Delete</button>;
}

function CartRow({ item }) {
  const dispatch = ~useContext(CartDispatchContext)~; // dispatch comes from the closest provider above
  return <button onClick={() => dispatch({ type: 'deleted', id: item.id })}>Delete</button>;
}
```

For the user, **yes, it is the exact same thing!** The same click sends the same action to the same reducer, and the same row leaves the page.

The difference is the path:
1. **With `onDelete`**, the handler travelled down from `App`, through the two components in the middle. `App` built the action.
2. **With `useContext`**, the row gets `dispatch` straight from the provider. The row builds the action itself, right where the click happens.

React's docs sum up the step in one sentence: "Each component reads the context that it needs".

### The four components that read

`Header` reads the cart for its count:

```jsx title="src/components/Header.jsx"
import { useContext } from 'react';
import { CartContext } from '../CartContext.jsx';

export default function Header() {
  const cart = ~useContext(CartContext)~; // The cart that App provides, with no prop
  return (
    <header>
      <h1>Corner Shop</h1>
      <p>Cart: {cart.length} items</p>
    </header>
  );
}
```

`CartList` reads the cart too. It still gives each row its item, and nothing else:

```jsx title="src/components/CartList.jsx"
import { useContext } from 'react';
import { CartContext } from '../CartContext.jsx';
import CartRow from './CartRow.jsx';

export default function CartList() {
  const cart = useContext(CartContext);
  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }
  return (
    <ul>
      {cart.map(item => (
        <CartRow key={item.id} ~item={item}~ /> // The one prop the row really needs
      ))}
    </ul>
  );
}
```

`CartRow` reads `dispatch` and sends its own three actions:

```jsx title="src/components/CartRow.jsx"
import { useContext } from 'react';
import { CartDispatchContext } from '../CartContext.jsx';

export default function CartRow({ item }) {
  const dispatch = ~useContext(CartDispatchContext)~; // The dispatch that App got from useReducer
  return (
    <li>
      {item.name}: {item.quantity}
      <button onClick={() => dispatch({ type: 'increased', id: item.id })}>Add one</button>
      <button onClick={() => dispatch({ type: 'decreased', id: item.id })}>Remove one</button>
      <button onClick={() => dispatch({ type: 'deleted', id: item.id })}>Delete</button>
    </li>
  );
}
```

`EmptyCartButton` reads only `dispatch`:

```jsx title="src/components/EmptyCartButton.jsx"
import { useContext } from 'react';
import { CartDispatchContext } from '../CartContext.jsx';

export default function EmptyCartButton() {
  const dispatch = useContext(CartDispatchContext);
  return <button onClick={() => ~dispatch({ type: 'emptied' })~}>Empty cart</button>; // Sends its own action
}
```

### Context does not replace every prop

A junior developer often thinks context replaces props, so every prop goes. It does not. Context replaces only the props that the middle carried for someone else.

`item` is not one of them. Each row shows a different item, and only `CartList` knows which one. So `item` stays a prop. React's docs keep the same prop in their to-do list, where each row still gets its task as a prop.

### The middle loses its props

Now `CartPage` has nothing left to carry:

```jsx title="src/components/CartPage.jsx"
import CartList from './CartList.jsx';
import EmptyCartButton from './EmptyCartButton.jsx';

export default function ~CartPage~() { // No props at all
  return (
    <main>
      <h2>Your cart</h2>
      <CartList />
      <EmptyCartButton />
    </main>
  );
}
```

**Yes, it is the exact same page!** The same heading, the same list, the same button. `CartPage` simply stops holding values it never used.

`App` loses its four handlers too. The actions are now built where the user clicks, so `App` only calls `useReducer` and provides the two values:

```jsx title="src/App.jsx" startLine="13"
export default function App() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  return (
    <CartContext value={cart}>
      <CartDispatchContext value={dispatch}>
        ~<Header />~ {/* No props */}
        ~<CartPage />~ {/* No props */}
      </CartDispatchContext>
    </CartContext>
  );
}
```

```tree caption="Where each component gets what it uses, before and after it reads the contexts."
How the cart and its actions reach each component
- !With props | `App` passes `cart` and **four handlers** down | `CartPage` and `CartList` **carry handlers they never call**
- +With the two contexts | `Header` and `CartList` **read `CartContext`** | `CartRow` and `EmptyCartButton` **read `CartDispatchContext`**, and `CartPage` takes **no props**
```

### One click deep in a row changes the header at the top

The user clicks Delete on the Apple row. The header at the very top changes from Cart: 3 items to Cart: 2 items. No line of `CartRow` mentions the header. So how does it happen?
1. React calls the arrow function on the Delete button of the Apple row.
2. `CartRow` sends the deleted action for Apple to `dispatch`.
3. That function belongs to `App`, so React calls the reducer and renders `App` again.
4. `useReducer` returns a new array with two items, and `App` passes it to the cart provider.
5. `Header` and `CartList` both read that context, so both show the new array.

```page width=text caption="The shop page after the user clicks Delete on the Apple row: the row leaves, and the header shows two items."
heading: Corner Shop
line: Cart: 2 items | good
section: Your cart
line: • Bread: 2 [Add one] [Remove one] [Delete]
line: • Milk: 1 [Add one] [Remove one] [Delete]
line: [Empty cart]
console: quiet
```

Remember the sentence of this lesson: the state still lives in `App`. This is the lifting state up of Lesson 24, with context in place of the props.

### A context that was never imported

A real mistake at this step is to add the `useContext` line and forget the import:

```jsx title="src/components/EmptyCartButton.jsx"
import { useContext } from 'react';

export default function EmptyCartButton() {
  const dispatch = useContext(~CartDispatchContext~); // **WRONG:** this file never imported CartDispatchContext
  return <button onClick={() => dispatch({ type: 'emptied' })}>Empty cart</button>;
}
```

The page goes blank when it opens. JavaScript finds no variable with that name in this file, the same kind of error as a missing component name (Lesson 06):

```page width=text caption="The shop page when EmptyCartButton reads CartDispatchContext without importing it: the page is blank."
blank
console: Uncaught ReferenceError: CartDispatchContext is not defined
console: An error occurred in the <EmptyCartButton> component. Consider adding an error boundary to your tree to customize error handling behavior.
```

The fix: import the context in every file that reads it.

---

## PRINCIPLE | CartProvider with children: the reducer moves out of App, and buttons stop rendering again

> [!PRINCIPLE]
> **Principle 4: A Provider Component That Takes children**
>
> *CartProvider calls useReducer, provides both contexts, and renders the children it receives. App only places CartProvider around the parts of the page that need the cart.*
>
> All the wiring now lives in one component, next to the contexts. CartProvider is our own component, and children is the prop of Lesson 09. Every component that reads the cart must sit inside it, or it reads null. And because the children come from App, a click renders again only the components that read the cart, not a button that only sends actions.
>
> **DO THIS:**
> ```jsx
> export default function App() {
>   return (
>     ~<CartProvider>~ {/* Header and CartPage both sit inside the provider */}
>       <Header />
>       <CartPage />
>     </CartProvider>
>   );
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function App() {
>   return (
>     <>
>       ~<Header />~ {/* **WRONG:** outside CartProvider, so it reads null and the page goes blank */}
>       <CartProvider><CartPage /></CartProvider>
>     </>
>   );
> }
> ```

The page works, but `App` still holds the `useReducer` call, the starting cart, and both providers. React's docs call this code the "wiring": the code that creates the state and connects it to the two contexts. The fourth step moves all of it into one component.

> [!DEFINITION]
> **A provider component.** [NEW] A provider component is our own component that holds a state and provides it through context. It is NOT a special thing from React.
> `CartProvider` is a normal function, named in PascalCase. It calls `useReducer`, and returns the two providers with `{children}` inside them.
> `children` is the prop of Lesson 09. Whatever `App` writes between `<CartProvider>` and `</CartProvider>` arrives in `children`.
> React's docs list its three jobs: "1. It will manage the state with a reducer. 2. It will provide both contexts to components below. 3. It will take `children` as a prop so you can pass JSX to it."
> They also say "You don't have to do this". It only keeps the other components tidy (Lesson 29).

Here is the context file after this step. It imports `useReducer` and the reducer, and takes the starting cart from `App`. Then it exports `CartProvider`:

```jsx title="src/CartContext.jsx"
import { createContext, useReducer } from 'react';
import cartReducer from './cartReducer.js';

const initialCart = [
  { id: 0, name: 'Apple', quantity: 1 },
  { id: 1, name: 'Bread', quantity: 2 },
  { id: 2, name: 'Milk', quantity: 1 },
];

export const CartContext = createContext(null);
export const CartDispatchContext = createContext(null);

export function ~CartProvider~({ children }) { // The state of the cart now lives here
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  return (
    <CartContext value={cart}>
      <CartDispatchContext value={dispatch}>
        ~{children}~ {/* Whatever App writes between the CartProvider tags */}
      </CartDispatchContext>
    </CartContext>
  );
}
```

`App` loses `useReducer`, the starting cart, and both providers:

```jsx title="src/App.jsx"
import { CartProvider } from './CartContext.jsx';
import Header from './components/Header.jsx';
import CartPage from './components/CartPage.jsx';

export default function App() {
  return (
    ~<CartProvider>~ {/* Every component inside can read the cart and dispatch */}
      <Header />
      <CartPage />
    </CartProvider>
  );
}
```

```tree dir=right caption="How Header and CartPage, written inside CartProvider in App, end up inside both providers."
How the two components reach the providers
- +1. In `App` [`CartProvider`] | `Header` and `CartPage` are written **between the tags**
- +2. In the props [`children`] | React collects both into **`children`**
- +3. In `CartProvider` [`children`] | Both render **inside the two providers**, so they can read the cart and `dispatch`
```

The page looks and works the same. `CartProvider` adds no element to the Elements panel. React's docs suggest thinking of it as a part of the screen that knows how to deal with its data, here the cart.

### VS | Header inside CartProvider vs. Header outside it: outside, it reads null

Where `App` places `Header` matters:

```jsx title="Header inside CartProvider, and Header above it"
<CartProvider><Header /><CartPage /></CartProvider> {/* Header inside: it reads the cart */}
<><Header /><CartProvider><CartPage /></CartProvider></> {/* Header outside: it reads the default null */}
```

**It may look the same, but it is NOT the same thing!** When `Header` sits outside, no cart provider sits above it. So `useContext` returns the default value, `null`. `Header` then reads the length of `null`, and the page goes blank:

```page width=text caption="The shop page when Header sits above CartProvider: Header reads null, and the page is blank."
blank
console: Uncaught TypeError: Cannot read properties of null (reading 'length')
console: An error occurred in the <Header> component. Consider adding an error boundary to your tree to customize error handling behavior.
```

React's docs name the cause. "You may have forgotten to wrap your component with `<SomeContext>`, or you might have put it in a different part of the tree than you thought."

Here the `null` of Principle 1 pays off. The mistake shows at once, instead of a header that quietly says Cart: 0 items. The fix: place every component that reads the cart inside `<CartProvider>`.

### A button that only sends actions stops rendering again

Moving the reducer into `CartProvider` also changes which components React renders again after a click. To see it, put one log at the top of `EmptyCartButton`:

```jsx title="src/components/EmptyCartButton.jsx"
import { useContext } from 'react';
import { CartDispatchContext } from '../CartContext.jsx';

export default function EmptyCartButton() {
  ~console.log('EmptyCartButton renders')~; // Prints once for each render of EmptyCartButton
  const dispatch = useContext(CartDispatchContext);
  return <button onClick={() => dispatch({ type: 'emptied' })}>Empty cart</button>;
}
```

The page opens, and the user clicks Add one on Bread once. The page looks the same both ways, so only the Console shows the difference. In development, Strict Mode calls each component twice, so each render prints two lines (Lesson 14):

::: row caption="The Console after the page opens and the user clicks Add one on Bread once, with the providers inside App and with CartProvider."
::: col title="Providers inside App" tag="renders again after the click" tone=bad
```devconsole
+ EmptyCartButton renders | EmptyCartButton.jsx:5
+ EmptyCartButton renders | EmptyCartButton.jsx:5
+ EmptyCartButton renders | EmptyCartButton.jsx:5
+ EmptyCartButton renders | EmptyCartButton.jsx:5
```
Two lines when the page opens, and two more after the click.
:::
::: col title="CartProvider with children" tag="renders only when the page opens" tone=good
```devconsole
+ EmptyCartButton renders | EmptyCartButton.jsx:5
+ EmptyCartButton renders | EmptyCartButton.jsx:5
```
Two lines when the page opens, and none after the click.
:::
:::

The code inside `EmptyCartButton` is the same in both. So why the difference?

**With the providers inside `App`:**
1. The cart lives in `App`, so the click renders `App` again.
2. A render calls the component, then every component it returns, all the way down (Lesson 13). React's docs: "if the updated component returns some other component, React will render _that_ component next".
3. So React renders every component on the page again, `EmptyCartButton` included, whether it reads the cart or not.

**With `CartProvider`:**
1. The cart lives in `CartProvider`, so the click renders that component again. `App` does not render.
2. `App` did not render, so `children` holds the very same elements as before. React's docs on `memo`: when a component takes JSX as `children` and updates its own state, "React knows that its children don't need to re-render."
3. The cart context gets a new array, so React renders its readers again: `Header`, `CartList`, and the rows.
4. The dispatch context gets the same `dispatch` as before. `Object.is` finds it equal, so none of its readers render again. `CartPage` reads nothing, so it stays too, and so does `EmptyCartButton` inside it.

This is the full answer to Principle 1. Two contexts and `children` work together:
- **With one context** holding both values, the object is new on every render, and `EmptyCartButton` renders again after every click.
- **Without `children`**, every render of the component that holds the state renders everything below it anyway.

Lesson 59 measures this further. React's docs add one more point: "You can have many context-reducer pairs like this in your app." A shop could have one pair for the cart and another for the signed-in user.

---

## PRINCIPLE | useCart and useCartDispatch: components read the cart without touching the contexts

> [!PRINCIPLE]
> **Principle 5: Two Custom Hooks Read the Two Contexts**
>
> *The context file exports useCart and useCartDispatch, which return useContext of each context. Components call them at their top level instead of importing the contexts.*
>
> Each custom Hook is one line, and it changes nothing on the page. It moves the last piece of wiring into the context file, so a component only says what it needs: the cart, or dispatch. The contexts no longer need export. A custom Hook runs inside the component that calls it, so it finds the closest provider above that component, and like any Hook it must be called at the top level.
>
> **DO THIS:**
> ```jsx
> function EmptyCartButton() {
>   const dispatch = ~useCartDispatch()~; // Called at the top level of the component
>   return <button onClick={() => dispatch({ type: 'emptied' })}>Empty cart</button>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function EmptyCartButton() {
>   return <button onClick={() => ~useCartDispatch()~({ type: 'emptied' })}>Empty cart</button>; // **WRONG:** a Hook called inside the click handler
> }
> ```

Every reader still imports `useContext` and a context, and calls one with the other. The last step wraps each of those calls in a small function, inside the context file:

```jsx title="Two functions that read the two contexts"
export function ~useCart~() { // Returns the cart from the closest provider above
  return useContext(CartContext);
}

export function ~useCartDispatch~() { // Returns dispatch from the closest provider above
  return useContext(CartDispatchContext);
}
```

A component now calls the function instead:

```jsx title="Reading dispatch with useContext, and with useCartDispatch"
const dispatch = ~useContext(CartDispatchContext)~; // With useContext and the context
const dispatch = ~useCartDispatch()~; // With the function: the same dispatch
```

**Yes, it is the exact same thing!** React's docs: "This doesn't change the behavior in any way, but it lets you later split these contexts further or add some logic to these functions."

> [!DEFINITION]
> **A custom Hook.** [NEW] A custom Hook is our own function that calls a Hook of React, and whose name starts with `use`.
> `useCart` is NOT a new Hook from React. It is our function, one line long, that calls `useContext`.
> React's docs give the rule: "Your function is considered a custom Hook if its name starts with `use`. This lets you use other Hooks, like `useContext`, inside it."
> Something that can be tricky: `useCart` sits in the context file, but it runs inside the component that calls it. When `Header` calls `useCart`, React looks for the closest provider above `Header`.
> Here it is one line long. Lesson 39 covers custom Hooks in full (Lesson 29).

### Our page after this step

The context file adds `useContext` to its import:

```jsx title="src/CartContext.jsx" startLine="1"
import { createContext, ~useContext~, useReducer } from 'react'; // useContext is now used inside this file
import cartReducer from './cartReducer.js';
```

The two contexts lose `export`. No other file needs them now. Other files get in only through the provider component and the two custom Hooks, as in the last version of the docs' example:

```jsx title="src/CartContext.jsx" startLine="10"
~const CartContext~ = createContext(null); // No export: other files reach it through useCart
const CartDispatchContext = createContext(null);
```

And the two custom Hooks go at the bottom:

```jsx title="src/CartContext.jsx" startLine="24"
export function useCart() {
  return useContext(CartContext);
}

export function useCartDispatch() {
  return useContext(CartDispatchContext);
}
```

The four readers import the custom Hooks instead. `Header` and `CartList` call the first one:

```jsx title="src/components/Header.jsx"
import { useCart } from '../CartContext.jsx';

export default function Header() {
  const cart = ~useCart()~; // The same cart as useContext with CartContext
  return (
    <header>
      <h1>Corner Shop</h1>
      <p>Cart: {cart.length} items</p>
    </header>
  );
}
```

The two buttons call `useCartDispatch`:

```jsx title="src/components/EmptyCartButton.jsx"
import { useCartDispatch } from '../CartContext.jsx';

export default function EmptyCartButton() {
  const dispatch = ~useCartDispatch()~; // The same dispatch as useContext with CartDispatchContext
  return <button onClick={() => dispatch({ type: 'emptied' })}>Empty cart</button>;
}
```

The page behaves exactly as in Principle 4. All the wiring sits in one file. React's docs describe the gain: the components stay "focused on what they display rather than where they get the data".

### Calling the custom Hook inside the click

A real mistake is to call the custom Hook where `dispatch` is used, inside the click:

```jsx title="src/components/EmptyCartButton.jsx"
export default function EmptyCartButton() {
  return <button onClick={() => ~useCartDispatch()~({ type: 'emptied' })}>Empty cart</button>; // **WRONG:** a Hook called inside a click handler
}
```

The page opens normally. But when the user clicks Empty cart, React reports an invalid Hook call in the Console, and the cart stays as it was.

Why? `useCartDispatch` calls `useContext`, so it is a Hook. A Hook may be called only at the top level of a component, while React renders it. A click handler runs later, after the render (Lesson 38).

The fix: call `useCartDispatch` at the top of the component, and use `dispatch` inside the arrow function.

---

## All 5 Principles Together

### The complete files

`main.jsx` mounts `App` inside Strict Mode (Lesson 07):

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

The reducer is the one of Lesson 27, unchanged:

```jsx title="src/cartReducer.js"
export default function cartReducer(cart, action) {
  switch (action.type) {
    case 'increased': {
      return cart.map(item => item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item);
    }
    case 'decreased': {
      return cart.map(item => item.id === action.id ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0);
    }
    case 'deleted': {
      return cart.filter(item => item.id !== action.id);
    }
    case 'emptied': {
      return [];
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

The context file holds all the wiring: the two contexts, the provider component, and the two custom Hooks:

```jsx title="src/CartContext.jsx"
import { createContext, useContext, useReducer } from 'react';
import cartReducer from './cartReducer.js';

const initialCart = [
  { id: 0, name: 'Apple', quantity: 1 },
  { id: 1, name: 'Bread', quantity: 2 },
  { id: 2, name: 'Milk', quantity: 1 },
];

const ~CartContext~ = createContext(null); // Principle 1: one context for the cart
const ~CartDispatchContext~ = createContext(null); // Principle 1: one context for dispatch

export function ~CartProvider~({ children }) { // Principle 4: holds the reducer and renders children
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  return (
    <CartContext ~value={cart}~> {/* Principle 2: provides the cart */}
      <CartDispatchContext ~value={dispatch}~> {/* Principle 2: provides dispatch */}
        {children}
      </CartDispatchContext>
    </CartContext>
  );
}

export function ~useCart~() { // Principle 5: reads the cart
  return useContext(CartContext);
}

export function ~useCartDispatch~() { // Principle 5: reads dispatch
  return useContext(CartDispatchContext);
}
```

`App` places the provider around the page:

```jsx title="src/App.jsx"
import { CartProvider } from './CartContext.jsx';
import Header from './components/Header.jsx';
import CartPage from './components/CartPage.jsx';

export default function App() {
  return (
    ~<CartProvider>~ {/* Principle 4: every component inside can read the cart */}
      <Header />
      <CartPage />
    </CartProvider>
  );
}
```

`Header` reads the cart for its count:

```jsx title="src/components/Header.jsx"
import { useCart } from '../CartContext.jsx';

export default function Header() {
  const cart = useCart();
  return (
    <header>
      <h1>Corner Shop</h1>
      <p>Cart: {cart.length} items</p>
    </header>
  );
}
```

`CartPage` takes no props:

```jsx title="src/components/CartPage.jsx"
import CartList from './CartList.jsx';
import EmptyCartButton from './EmptyCartButton.jsx';

export default function ~CartPage~() { // Principle 3: no props to carry
  return (
    <main>
      <h2>Your cart</h2>
      <CartList />
      <EmptyCartButton />
    </main>
  );
}
```

`CartList` reads the cart and gives each row its item:

```jsx title="src/components/CartList.jsx"
import { useCart } from '../CartContext.jsx';
import CartRow from './CartRow.jsx';

export default function CartList() {
  const cart = useCart();
  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }
  return (
    <ul>
      {cart.map(item => (
        <CartRow key={item.id} ~item={item}~ /> // Principle 3: the one prop a row needs
      ))}
    </ul>
  );
}
```

The row and the Empty cart button read `dispatch` and send their own actions:

```jsx title="src/components/CartRow.jsx"
import { useCartDispatch } from '../CartContext.jsx';

export default function CartRow({ item }) {
  const dispatch = ~useCartDispatch()~; // Principle 5: reads dispatch
  return (
    <li>
      {item.name}: {item.quantity}
      <button onClick={() => dispatch({ type: 'increased', id: item.id })}>Add one</button>
      <button onClick={() => dispatch({ type: 'decreased', id: item.id })}>Remove one</button>
      <button onClick={() => dispatch({ type: 'deleted', id: item.id })}>Delete</button>
    </li>
  );
}
```

```jsx title="src/components/EmptyCartButton.jsx"
import { useCartDispatch } from '../CartContext.jsx';

export default function EmptyCartButton() {
  const dispatch = useCartDispatch();
  return <button onClick={() => dispatch({ type: 'emptied' })}>Empty cart</button>;
}
```

After the user clicks Empty cart, every row leaves, and the header shows the empty cart:

```page width=text caption="The finished shop page after the user clicks Empty cart: no rows, the empty line, and zero items in the header."
heading: Corner Shop
line: Cart: 0 items | good
section: Your cart
line: Your cart is empty. | good
line: [Empty cart]
console: quiet
```

### How React calls the components

When the page opens, React calls `App`, then `CartProvider`. It calls `useReducer` and gets the starting cart. Then it calls the components inside the providers, from top to bottom. After each click, React renders `CartProvider` again, and of the rest, only the components that read the cart:

```tree caption="The component tree of the finished shop page, the order in which React calls the components when the page opens, and what happens after a click."
`App` | **1. Called first**, only when the page opens | Places `CartProvider` around **`Header`** and **`CartPage`**
- +`CartProvider` | **2. Called next**, and again after every click | **Holds `cart`** through `useReducer` and provides **both contexts** around `children`
  - +`Header` | **3. Reads `useCart`** and shows the count | Renders again when the cart changes
  - +`CartPage` | **4. Reads nothing** | **Not rendered again** after a click
    - +`CartList` and each `CartRow` | **5. Read `useCart` and `useCartDispatch`** | Render again when the cart changes
    - +`EmptyCartButton` | **6. Reads `useCartDispatch`** and sends `emptied` | **Not rendered again**, because `dispatch` never changes
```

| Principle | What we write | What the page shows |
| :--- | :--- | :--- |
| **1. Two contexts** | `CartContext` and `CartDispatchContext`, made by `createContext` with `null` | Nothing new: no component reads them yet |
| **2. Two providers** | `App` wraps its components in both providers, with `value` | The same page. A prop not named `value` prints a warning |
| **3. Reading the contexts** | Readers get the cart, buttons get `dispatch`, and `CartPage` and `App` lose their props and handlers | Delete on Apple changes the header to Cart: 2 items |
| **4. The provider component** | `CartProvider` holds `useReducer` and both providers and renders `children` | The same page. `EmptyCartButton` no longer renders again after a click |
| **5. Custom Hooks** | `useCart` and `useCartDispatch` in the context file, and the contexts lose `export` | The same page. The components no longer import the contexts |

One last time, the sentence of this lesson: **the state still lives in the component that calls `useReducer`. Context only delivers it, the cart in one context and `dispatch` in another.**

---

## For the Interview

> **The Interview Question:** How do you combine a reducer with context for app-wide state?

### How to Answer Clearly in 30 Seconds

"A reducer keeps the update logic of a state in one function, and context passes a value deep into the tree without props. Combined, they let any component below read and change a state that lives at the top. React's docs give three steps:
1. **Create** two contexts with `createContext`, each with the default value `null`: one for the state and one for `dispatch`.
2. **Provide** both from the component that calls `useReducer`, one provider inside the other.
3. **Use** them: a component that shows the state reads the state context, and a component that changes it reads `dispatch` and sends its own action. The components in the middle stop passing props they never used.

The state still lives in the component that calls `useReducer`. Context only delivers it. Usually I move the reducer and both providers into a provider component that renders `children`, and I export two custom Hooks, such as `useCart` and `useCartDispatch`."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why two contexts, and not one context with `{ state, dispatch }`?"**
   Because the two values change at different rates. The state is new after every action, while `dispatch` "has a stable identity", as React's docs say. React compares the old and the new value of a context with `Object.is`. An object such as `{ cart, dispatch }` written in `value` is a new object on every render. So every reader renders again, even one that only sends actions. With two contexts, the context for `dispatch` never changes. A component that reads only `dispatch` is then not rendered again when the state changes, as long as the provider component renders its `children`. React's docs fix an object value another way, with `useMemo` and `useCallback` (Lesson 59). `dispatch` needs no `useCallback`, because it never changes.
2. **"Does 'app-wide state' mean one global variable? Where does the state actually live?"**
   No. The state lives in the component that calls `useReducer`, such as `CartProvider`. Each reader gets the value of the closest provider above it. A component outside the provider gets the default value, and with `null`, reading `cart.length` throws a `TypeError`. React's docs suggest checking the tree with React Developer Tools when a component does not see its provider's value. An app can have "many context-reducer pairs like this", one for each part of the screen. React's docs praise the pattern. They call it "a powerful way to scale your app and lift state up without too much work whenever you want to access the data deep in the tree."
3. **"When would you use a reducer with context instead of props?"**
   When many distant components read or change the same state, and the components between them only pass props on. With a few components in the middle, props are simpler, and React's docs agree that props work well in a small example. Passing JSX as `children` can also leave fewer components in the middle. Context does not remove every prop: a prop a component really needs, such as the item of one row, stays a prop. And `memo` does not stop a reader of a context from rendering again when the value changes. React's docs: "Skipping re-renders with `memo` does not prevent the children receiving fresh context values."

```tree caption="Interview summary: what each part of a reducer combined with context does."
A reducer combined with context
- +`useReducer` in `CartProvider` | **Holds the state** and gives **`cart`** and **`dispatch`** | The state **still lives here**
- +Two contexts, two providers [`CartContext` `CartDispatchContext`] | Deliver **`cart`** and **`dispatch`** separately | `dispatch` **never changes**, so its readers are not rendered again
- +Two custom Hooks [`useCart` `useCartDispatch`] | Read each context **at the top level** of a component | Components **never import the contexts**
```
