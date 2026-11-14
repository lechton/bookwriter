# Lecture 29: Combining a Reducer with Context for App-Wide State

*(How can a button deep in the page change a state that lives at the top?)*

> INTERVIEW QUESTION | ❱ CORE | How do you combine a reducer with context for app-wide state?

---

## VS | Props vs. Context for the Cart and `dispatch`: props pass through every component, context skips the middle

> Deep component trees often need data to travel all the way down, and updates to travel all the way back up. **You should combine `useReducer` with context.** Any component, however deep in the tree, can then read and change shared state without passing props down every level.

In React applications, distant parts of the interface frequently need to share the same information. Examples include a shopping cart, a user profile, or a list of notifications. When that data lives in a parent component at the top, you normally pass the values and update functions down as props. Passing props through intermediate components that never use them is called prop drilling. This makes your codebase tedious and fragile. **This is why we combine `useReducer` with context**. Together, **they let any deeply nested component read the state and dispatch updates directly**, without forcing intermediate components to pass props.

Consider an online store where the top header displays **Cart: 3 items**. Far down the page, every product row includes a **Delete** button. When the user clicks **Delete**, that specific product row disappears from the screen. At that exact moment, the top header updates to show **Cart: 2 items**. How can a **Delete** button buried deep inside a table row update the cart state at the top? We call `useReducer` in a top-level parent component. Then context delivers the cart state and its `dispatch` function down the tree. Both the top header and the deep **Delete** button access the exact same cart data, skipping every layout component in between.

**Why:** Because both the top header and the cart list need the cart, the cart state must live in a common ancestor component. With ordinary props, that top component must pass the cart array and every click handler down through every single child. Pure layout wrappers and styling sections are forced to forward props they never read. Worse, if one intermediate component forgets to forward the delete handler, clicking **Delete** fails and the item remains stuck on the screen. Forcing intermediate components to forward props they do not need makes your application fragile. Combining `useReducer` with context solves this defect by broadcasting both the state and the `dispatch` function directly to the components that need them.

Here is the central rule to keep in mind for this entire lesson:

**The state still lives in the component that calls `useReducer`. Context only delivers it: the cart in one context, and `dispatch` in another.**

### Two Pieces You Already Know

You already know both building blocks from earlier lessons. Here is a clear review of each tool.

> [!DEFINITION]
> **A reducer and dispatch.** [REVIEW] A reducer consolidates state update logic into a single pure function: `cartReducer(cart, action)`.
> 1. You declare the reducer and connect it: `const [cart, dispatch] = useReducer(cartReducer, initialCart)`.
> 2. You get two values back: `cart`, the current state, and `dispatch`, a function to send actions.
> 3. To update state, you dispatch an action: `dispatch({ type: 'deleted', id: 1 })`. React runs your reducer, saves the new state, and re-renders the component.
> 
> The `dispatch` function has a stable identity. React guarantees it never changes between renders, so you can pass it safely to any component (Lesson 27).

> [!DEFINITION]
> **A context.** [REVIEW] Context lets a component pass data deep down the tree without prop drilling.
> 1. You create a context outside components: `const ThemeContext = createContext('light')`.
> 2. A parent component holds the state and wraps its children: `<ThemeContext value={theme}>`.
> 3. Any nested component reads that value directly: `const theme = useContext(ThemeContext)`.
> 
> A context holds no state of its own. The parent component holds the data, context delivers it, and whenever that value changes, every component reading it updates automatically (Lesson 28).

### The whole idea in one code block

In plain JavaScript outside React, sharing one value across multiple files is straightforward. You put the cart in one module, export it, and import it wherever you need it:

```js title="Plain JavaScript: one shared variable"
import { cart, deleteItem } from './cart.js';
~deleteItem(1)~; // The array changes, but nothing tells the page to update
```

In React, an imported variable does not work. When a plain variable mutates in memory, React does not track it. No re-render triggers, so the screen remains unchanged. Data shown to the user must live in React state. And state always belongs to a component, the component that calls `useReducer`.

So the real question is: how does a button five components down reach the `dispatch` function of the top component? Context is how that button asks React: find the closest provider above me in the tree, and give me its value.

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

This structure uses the exact same mechanics from earlier lessons. There is no new syntax here. The `dispatch` function is a value like any other function. The parent component puts it inside a provider, and a nested component reads it with `useContext`.

React documentation summarizes this approach in three sentences: "Reducers let you consolidate a component's state update logic. Context lets you pass information deep down to other components. You can combine reducers and context together to manage state of a complex screen."

```tree caption="A reducer and a context each do one job. Together, a component far below can read the state and send actions."
A reducer and a context on the same page
- +The reducer [`useReducer` `cartReducer`] | Keeps **all the update logic** in one function | Gives **`cart`** and **`dispatch`** to the component that calls it
- +The context [`CartContext` `useContext`] | Carries a value **deep down the tree** | Any component below **asks for it** without props
- +Both together | `App` puts **`cart` and `dispatch`** into two providers | `Header` reads the cart, and a button far below **sends actions**
```

### Why two contexts, and not one

Both values come from the same `useReducer` call. The fundamental difference between them is how often they change:
1. **`cart` changes frequently.** Whenever an action updates the cart, `cart` becomes a brand-new array in memory.
2. **`dispatch` never changes.** React guarantees that the `dispatch` function maintains a stable identity across every re-render.

Therefore, each value gets its own context. A button component that only dispatches actions reads only `CartDispatchContext`. Because `dispatch` never changes, React does not need to re-render that button when the cart array changes. Principle 4 demonstrates this performance optimization in detail.

### What "app-wide state" really means

The interview question refers to app-wide state. That term describes state read and updated by many distant parts of the page, like a cart shared between header and product rows.

It is not a separate category of state, and it is not a global variable. React documentation puts the word in quotes because the state still lives inside a specific component, managed with `useReducer`.

Every senior developer recognizes four common misconceptions:
1. **Believing the state moved into the context.** It did not. The context stores nothing on its own. It only transports the values created by `useReducer`.
2. **Assuming app-wide means globally available.** Each consumer only reads from the closest matching provider above it in the tree. Outside every provider, it reads the default value, which is `null` on our page.
3. **Packaging both values into a single object.** Providing `{ cart, dispatch }` creates a new object reference on every render, which forces every consumer to re-render.
4. **Removing every single prop.** Context is designed for shared or broadcast data. Props that belong exclusively to one component, such as the single item displayed by a row, must remain props.

### Four ways to share one state with distant components

1. **Props (Lessons 23 and 24).** State sits in the nearest common parent, which passes it down. This fits when few components sit in the middle. React documentation notes that passing props through dozens of intermediate components can be frustrating.
2. **Passing JSX as `children` (Lesson 28).** Fewer components sit in the middle, so fewer props travel down the tree.
3. **A reducer with context (Lesson 29).** This fits when many distant components across different branches need to read or update the same state.
4. **`useState` with context (Lesson 28).** One context carries a state value and its setter function for simpler state models.

## SECTION | A Corner Shop with a Cart

Our page is the cart from Lesson 27, now placed on a small shop page. A header at the top shows the title and the item count. Under Your cart, each item has a row with three buttons. An Empty cart button sits at the bottom:

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

Here is what each click changes on the screen:
1. **Add one on Bread.** The row displays Bread: 3. The header still displays Cart: 3 items because it counts distinct product rows.
2. **Delete on Apple.** The Apple row is removed from the DOM, and the header updates to Cart: 2 items.
3. **Empty cart.** Every product row is removed, the text Your cart is empty appears, and the header displays Cart: 0 items.

The page contains six components. Two of them read the cart from distant positions: `Header` and `CartList`. Two others update it: `CartRow` and `EmptyCartButton`. Meanwhile, `CartPage` sits in the middle and uses none of the cart data:

```tree caption="The components of the shop page, and what each one does with the cart at the start of the lesson."
`App` [`useReducer`] | Holds **`cart`** and **four handlers**
- +`Header` | **Reads** `cart` to show the count
- !`CartPage` | Receives **five props** and **uses none of them**
  - +`CartList` | **Reads** `cart` and passes **three handlers** to each row
    - +`CartRow` | Shows `item` and **calls** three handlers
  - +`EmptyCartButton` | **Calls** `onEmpty`
```

The project keeps the reducer from Lesson 27, unchanged, and places each component in its own file:

```files title="corner-shop: File Explorer" caption="How the files of the shop page sit inside src and components at the start of the lesson."
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

At the start, `App` calls `useReducer` and defines four handlers. Each handler is a single line that sends an action:

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

`Header` displays the item count:

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

`CartPage` receives five props only to pass them along:

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

`CartList` reads the cart and forwards three handlers to every row:

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

At the bottom of the tree, `CartRow` and `EmptyCartButton` invoke the handlers:

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

The page functions, but `CartPage` and `CartList` carry handlers they never invoke, only to forward them down. This is the exact problem of prop drilling (Lessons 24 and 28).

This design is fragile. If `CartList` accidentally forgets to pass `onDelete` to a row, clicking Delete fails with an Uncaught TypeError in the Console, and the item remains on the screen.

The rest of this lesson eliminates prop drilling step by step. Across every change, the user interface remains completely identical.

**PRINCIPLES:** The state and `dispatch` remain in the component that calls `useReducer`. Two separate contexts deliver them to every component below. Five principles guide the implementation:
1. **Principle 1: Two Contexts, One for the State and One for dispatch.** Each is created using `createContext` with a default value of `null`, in a dedicated file.
2. **Principle 2: Two Providers in the Component That Calls useReducer.** The root component supplies `cart` to one provider and `dispatch` to the other.
3. **Principle 3: Each Component Reads Only What It Needs.** Reader components consume the cart, buttons consume `dispatch`, and `CartPage` drops all forwarded props.
4. **Principle 4: A Provider Component That Takes children.** A custom provider component encapsulates `useReducer` and both providers, allowing `App` to wrap the page cleanly.
5. **Principle 5: Two Custom Hooks Read the Two Contexts.** Custom hooks `useCart` and `useCartDispatch` return each value directly, eliminating context imports across the components.

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

The first step is to create the contexts. Because one `useReducer` call yields two values that change at different rates, we create two separate contexts in a dedicated file:

```jsx title="src/CartContext.jsx"
import { createContext } from 'react';

export const ~CartContext~ = createContext(null); // Will carry the current cart
export const ~CartDispatchContext~ = createContext(null); // Will carry the dispatch function
```

Each line calls standard `createContext`. Neither context has built-in knowledge of reducers. The name of each context clearly indicates what value it will transport.

React documentation establishes this exact pattern for a task list. One context provides the data list, while the second context provides the dispatch function that triggers actions.

Three key implementation details:
1. **The default value is `null`.** The actual values will be supplied by the component calling `useReducer`. A consumer receives `null` only when rendered outside a matching provider.
2. **The contexts live in their own file.** Any component file across the project can import them by name using curly braces (Lesson 05).
3. **The file uses the `.jsx` extension.** From Principle 4 onwards, this file will export JSX components.

```tree caption="The two contexts of the cart: what each one will carry, and where the value will come from."
Two contexts in the context file
- +`CartContext` [`createContext`] | Starts as **`null`** | Will carry **the current cart**, from `useReducer`
- +`CartDispatchContext` [`createContext`] | Starts as **`null`** | Will carry **`dispatch`**, from the same `useReducer`
```

### VS | Two contexts vs. one context with both values: the single object is new on every render

Developers often consider placing both values into a single context. Here are the two approaches side by side:

```jsx title="Two contexts, and one context that carries both values"
<CartContext ~value={cart}~> {/* Two contexts: the cart in one, dispatch in the other */}
  <CartDispatchContext value={dispatch}>...</CartDispatchContext>
</CartContext>

<ShopContext ~value={{ cart, dispatch }}~>...</ShopContext> {/* One context: a new object on every render */}
```

When the page loads, both approaches display identical markup. However, their runtime performance is fundamentally different.

Notice the double curly braces in the single context approach. The outer braces indicate a JavaScript expression. The inner braces construct a brand-new object literal on every single render.

React compares the previous and next context values using `Object.is`. In JavaScript, two distinct object references are never equal, even if their contents match. Consequently, React re-renders every component reading `ShopContext`, even buttons that only call `dispatch`.

With two contexts, `CartDispatchContext` consistently receives the same stable `dispatch` function reference. `Object.is` finds the reference unchanged, so button components skip unnecessary re-renders. Principle 4 verifies this behavior in the Console.

### Why null, and not an empty array

The choice of default value is deliberate. If you initialize the context with `null`, a component accidentally placed outside the provider fails immediately with a TypeError in the Console. If the default were an empty array `[]`, the header would silently display Cart: 0 items, hiding the missing provider bug.

Choosing `null` ensures that mistakes fail fast and loudly during development. React documentation recommends `null` for this exact reason.

### Our page after this step

Nothing on the rendered page changes yet. No component imports the new contexts yet, so all data continues to flow through props.

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

The second step is to provide both values. The root `App` component already manages the cart and its dispatch function, so it wraps its children in both providers. React documentation calls this step putting state and dispatch into context.

First, `App` imports the two contexts:

```jsx title="src/App.jsx" startLine="1"
import { useReducer } from 'react';
import cartReducer from './cartReducer.js';
import { ~CartContext, CartDispatchContext~ } from './CartContext.jsx'; // Named exports, so curly braces
import Header from './components/Header.jsx';
import CartPage from './components/CartPage.jsx';
```

Then its return wraps the child components inside both providers, keeping props intact for now:

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

React documentation follows this exact incremental transition: for now, you pass the information both via props and in context.

### A provider only makes a value available

Wrapping components in providers does not alter child behavior immediately. A provider simply makes a value accessible down the tree. Nothing changes in child components until they explicitly read that context with `useContext`.

The page continues to look and behave exactly the same. Providers render no extra DOM elements, so the Elements panel shows the exact same `<header>` and `<main>` tags.

Furthermore, `App` cannot read the context values it provides. React documentation states that `useContext` calls are unaffected by providers returned from the same component. `App` does not need context anyway because it already holds the cart array and the dispatch function directly.

### Either order works

Because one provider wraps inside the other, their nesting order does not matter:

```jsx title="The two orders of the providers"
<CartContext value={cart}><CartDispatchContext value={dispatch}>...</CartDispatchContext></CartContext> {/* CartContext outside */}
<CartDispatchContext value={dispatch}><CartContext value={cart}>...</CartContext></CartDispatchContext> {/* CartDispatchContext outside */}
```

Both arrangements are functionally identical. A consumer requests a specific context by name. React traverses up the tree to find the nearest matching provider, ignoring providers of unrelated contexts (Lesson 28).

### A provider without value

A common mistake at this stage is naming the prop after the data it carries:

```jsx title="src/App.jsx" startLine="34"
      <CartDispatchContext ~dispatch={dispatch}~> {/* **WRONG:** a provider reads only the prop named value */}
```

React documentation notes that omitting `value` on a provider is equivalent to passing `value={undefined}`. The application still functions initially because child components continue to read props. However, React logs a warning in the Console during startup:

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

The real bug surfaces in Principle 3 when child buttons read the context. Because a provider exists above them, the buttons receive `undefined` instead of the fallback `null`. When the user clicks Delete, calling dispatch throws a TypeError because undefined is not a function, and the row remains on screen.

The solution is simple: always name the prop `value`.

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

The third step is reading the contexts directly inside the components that consume the data.

### VS | A handler from the parent vs. dispatch from the context: the same click, a different path

Compare how a row deletes its item using props versus context:

```jsx title="A Delete button with onDelete from the parent, and with dispatch from the context"
function CartRow({ item, ~onDelete~ }) { // onDelete came down from App through every parent
  return <button onClick={() => onDelete(item.id)}>Delete</button>;
}

function CartRow({ item }) {
  const dispatch = ~useContext(CartDispatchContext)~; // dispatch comes from the closest provider above
  return <button onClick={() => dispatch({ type: 'deleted', id: item.id })}>Delete</button>;
}
```

From the user perspective, both approaches perform identically. The same click sends the same action to the reducer, and the item row disappears.

The difference lies in how data reaches the button:
1. **With `onDelete`**, the handler function travels down from `App` through multiple intermediate components. The top component configures the action.
2. **With `useContext`**, the row retrieves `dispatch` directly from the provider. The row constructs the action object itself, right where the user interaction occurs.

React documentation summarizes this transition: each component reads the context that it needs.

### The four components that read

`Header` reads the cart context to show the total count:

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

`CartList` reads the cart context too. It passes only `item` to each row:

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

`CartRow` reads `dispatch` and sends its three actions directly:

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

Developers sometimes assume that adopting context means eliminating every prop. That is a mistake. Context replaces only props that intermediate components forward on behalf of distant children.

The `item` prop on each row is different. Each row renders a unique item object from the array, and only `CartList` knows which item belongs to which row. Therefore, `item` remains a prop. React documentation maintains this exact distinction in its task list example, where each list item receives its specific task data through props.

### The middle loses its props

Now `CartPage` has zero props left to forward:

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

The user interface remains identical. `CartPage` simply stops receiving values it never used.

`App` drops its four event handler functions as well. Action objects are now constructed where user interactions happen, so `App` only calls `useReducer` and supplies the providers:

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

When the user clicks Delete on Apple, the header at the top updates from Cart: 3 items to Cart: 2 items. Notice that `CartRow` contains no reference to `Header`. Here is the exact runtime sequence:
1. The user clicks Delete, triggering the arrow function in `CartRow`.
2. `CartRow` invokes `dispatch` with the deleted action for Apple.
3. Because dispatch originated in App, React schedules a re-render for the root component and executes the reducer function.
4. The reducer computes a new array containing the remaining items, which `App` supplies to `<CartContext value={cart}>`.
5. React detects that CartContext has a new value, so it re-renders both consumers: the Header and the CartList.

```page width=text caption="The shop page after the user clicks Delete on the Apple row: the row leaves, and the header shows two items."
heading: Corner Shop
line: Cart: 2 items | good
section: Your cart
line: • Bread: 2 [Add one] [Remove one] [Delete]
line: • Milk: 1 [Add one] [Remove one] [Delete]
line: [Empty cart]
console: quiet
```

Remember the central sentence of this lesson: state still lives in `App`. This represents lifting state up (Lesson 24), using context instead of prop drilling.

### A context that was never imported

A common mistake at this stage is calling `useContext` while forgetting the import statement:

```jsx title="src/components/EmptyCartButton.jsx"
import { useContext } from 'react';

export default function EmptyCartButton() {
  const dispatch = useContext(~CartDispatchContext~); // **WRONG:** this file never imported CartDispatchContext
  return <button onClick={() => dispatch({ type: 'emptied' })}>Empty cart</button>;
}
```

The screen goes blank when the page loads. JavaScript finds no identifier with that name in the file, causing a runtime reference error:

```page width=text caption="The shop page when EmptyCartButton reads CartDispatchContext without importing it: the page is blank."
blank
console: Uncaught ReferenceError: CartDispatchContext is not defined
console: An error occurred in the <EmptyCartButton> component. Consider adding an error boundary to your tree to customize error handling behavior.
```

The solution is straightforward: import the context in every file that reads it.

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

The application works cleanly, but `App` still holds the `useReducer` call, initial data, and provider tags. React documentation refers to this code as wiring: the setup that creates the state and connects it to contexts. Step four consolidates all wiring into a single provider component.

> [!DEFINITION]
> **A provider component.** [NEW] A provider component is a custom component that encapsulates state management and exposes it through context. It is an ordinary React component, not an external library utility.
> 1. It manages internal state using `useReducer` or `useState`.
> 2. It wraps its output in context providers to distribute that state.
> 3. It accepts `{children}` as a prop so parent components can nest JSX inside it (Lesson 09).
> 
> A provider component isolates state logic in one file, keeping the rest of the component tree clean and focused (Lesson 29).

Here is the context file after this step. It imports `useReducer` and the reducer function, and moves the initial cart data out of `App`. Then it exports `CartProvider`:

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

`App` loses `useReducer`, initial cart data, and both context provider tags:

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

The rendered output remains identical. `CartProvider` introduces no extra DOM elements in the Elements panel. React documentation suggests thinking of it as a logical region of the screen that manages its own domain data.

### VS | Header inside CartProvider vs. Header outside it: outside, it reads null

Where `App` positions `Header` is critical:

```jsx title="Header inside CartProvider, and Header above it"
<CartProvider><Header /><CartPage /></CartProvider> {/* Header inside: it reads the cart */}
<><Header /><CartProvider><CartPage /></CartProvider></> {/* Header outside: it reads the default null */}
```

These two placements look similar in JSX, but their behavior is completely different. When `Header` sits outside `CartProvider`, no matching provider exists above it. Consequently, `useContext` returns the default value `null`. `Header` then attempts to read `cart.length`, crashing the page:

```page width=text caption="The shop page when Header sits above CartProvider: Header reads null, and the page is blank."
blank
console: Uncaught TypeError: Cannot read properties of null (reading 'length')
console: An error occurred in the <Header> component. Consider adding an error boundary to your tree to customize error handling behavior.
```

React documentation highlights this common issue: you may have forgotten to wrap your component with the context provider, or placed it in an unexpected tree position.

Here the choice of `null` from Principle 1 provides immediate feedback. The defect appears immediately, rather than producing a silent bug where the header displays Cart: 0 items. The fix is placing every component that reads the cart inside `<CartProvider>`.

### A button that only sends actions stops rendering again

Moving state management into `CartProvider` also optimizes which components re-render after user actions. To observe this in development, place a console log at the top of `EmptyCartButton`:

```jsx title="src/components/EmptyCartButton.jsx"
import { useContext } from 'react';
import { CartDispatchContext } from '../CartContext.jsx';

export default function EmptyCartButton() {
  ~console.log('EmptyCartButton renders')~; // Prints once for each render of EmptyCartButton
  const dispatch = useContext(CartDispatchContext);
  return <button onClick={() => dispatch({ type: 'emptied' })}>Empty cart</button>;
}
```

When the page loads, the user clicks Add one on Bread once. The page looks identical in both setups, so the Console reveals the difference. In development, Strict Mode executes component functions twice, printing two lines per render (Lesson 14):

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

Both implementations share identical code inside `EmptyCartButton`. What creates this difference in behavior?

**When providers were placed inside `App`:**
1. The cart state lived directly in `App`, so dispatching an action caused `App` to re-render.
2. When a parent re-renders, React executes its component body and re-renders every child component returned in its JSX (Lesson 13).
3. Therefore, React re-rendered every component on the page, including `EmptyCartButton`, regardless of whether it read the cart array.

**When `CartProvider` manages the state:**
1. State lives inside `CartProvider`, so state changes re-render only `CartProvider`. The root `App` component does not re-render.
2. Because `App` did not re-render, the JSX elements passed into `children` retain their exact object references from the previous render. React documentation notes that when a component updates its own state, children passed via JSX props do not re-render automatically.
3. CartContext receives a new array reference, so React re-renders its direct subscribers: the Header and the CartList.
4. `CartDispatchContext` receives the identical `dispatch` function reference. `Object.is` finds it unchanged, so React skips re-rendering its subscribers. `CartPage` reads no context and skipped re-rendering, so `EmptyCartButton` does not re-render either.

This completes the motivation for Principle 1. Two separate contexts and the `children` prop operate in tandem:
- **With a single context** packaging both values, the combined object is new on every render, forcing `EmptyCartButton` to re-render after every click.
- **Without the `children` pattern**, re-rendering the component hosting state would re-render the entire subtree regardless of context stability.

Lesson 59 explores performance measurement further. React documentation notes that an application can feature multiple context-reducer pairs, such as one pair for the cart and another for user authentication.

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

Currently, every consumer component imports `useContext` alongside the specific context object. The final refinement wraps each context lookup inside a dedicated custom hook function:

```jsx title="Two functions that read the two contexts"
export function ~useCart~() { // Returns the cart from the closest provider above
  return useContext(CartContext);
}

export function ~useCartDispatch~() { // Returns dispatch from the closest provider above
  return useContext(CartDispatchContext);
}
```

Components now invoke the custom hook directly:

```jsx title="Reading dispatch with useContext, and with useCartDispatch"
const dispatch = ~useContext(CartDispatchContext)~; // With useContext and the context
const dispatch = ~useCartDispatch()~; // With the function: the same dispatch
```

This syntax change alters zero runtime behavior. React documentation notes that this refactoring leaves functionality unchanged while creating space for future validation logic or context splitting.

> [!DEFINITION]
> **A custom Hook.** [NEW] A custom Hook is a JavaScript function whose name starts with `use` that calls other React Hooks.
> 1. It encapsulates reusable component logic without changing component hierarchy.
> 2. It must follow the Rules of Hooks: call it only at the top level of function components, never in event handlers or conditions.
> 3. Custom Hooks run in the execution context of the component that invokes them, searching up the tree from that component.
> 
> Creating `useCart` hides context implementation details, allowing components to express what data they need without knowing how context works (Lesson 29).

### Our page after this step

The context file adds `useContext` to its imports:

```jsx title="src/CartContext.jsx" startLine="1"
import { createContext, ~useContext~, useReducer } from 'react'; // useContext is now used inside this file
import cartReducer from './cartReducer.js';
```

The two context declarations drop their `export` keywords. External components no longer import contexts directly; they interact exclusively through `CartProvider` and the custom hooks:

```jsx title="src/CartContext.jsx" startLine="10"
~const CartContext~ = createContext(null); // No export: other files reach it through useCart
const CartDispatchContext = createContext(null);
```

The custom hooks sit at the bottom of the file:

```jsx title="src/CartContext.jsx" startLine="24"
export function useCart() {
  return useContext(CartContext);
}

export function useCartDispatch() {
  return useContext(CartDispatchContext);
}
```

The consumer components import the custom hooks instead. `Header` and `CartList` call the first hook:

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

The interactive buttons call `useCartDispatch`:

```jsx title="src/components/EmptyCartButton.jsx"
import { useCartDispatch } from '../CartContext.jsx';

export default function EmptyCartButton() {
  const dispatch = ~useCartDispatch()~; // The same dispatch as useContext with CartDispatchContext
  return <button onClick={() => dispatch({ type: 'emptied' })}>Empty cart</button>;
}
```

The application functions with identical behavior. All setup logic remains unified in one file. React documentation highlights the primary benefit: components remain focused on what they display rather than where data originates.

### Calling the custom Hook inside the click

A common mistake is calling the custom Hook inside an event handler callback:

```jsx title="src/components/EmptyCartButton.jsx"
export default function EmptyCartButton() {
  return <button onClick={() => ~useCartDispatch()~({ type: 'emptied' })}>Empty cart</button>; // **WRONG:** a Hook called inside a click handler
}
```

The page appears to load normally. However, when the user clicks Empty cart, React logs an invalid Hook call warning in the Console and execution halts.

Why does this happen? `useCartDispatch` invokes `useContext`, making it a React Hook. React Hooks may be called only at the top level of a component during render. Event handlers execute later in response to user interaction, long after rendering completes (Lesson 38).

The fix is straightforward: call `useCartDispatch` at the component's top level, and invoke the resulting `dispatch` function inside the click handler.

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

The reducer function remains unchanged from Lesson 27:

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

The context file encapsulates all wiring: the contexts, the provider component, and the custom hooks:

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

`App` wraps the interface in `CartProvider`:

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

`Header` reads the cart to display the count:

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

`CartPage` forwards zero props:

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

`CartList` reads the cart and supplies each row with its specific item:

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

The product row and EmptyCartButton read dispatch and send their actions directly:

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

When the user clicks Empty cart, all product rows clear and the header reflects zero items:

```page width=text caption="The finished shop page after the user clicks Empty cart: no rows, the empty line, and zero items in the header."
heading: Corner Shop
line: Cart: 0 items | good
section: Your cart
line: Your cart is empty. | good
line: [Empty cart]
console: quiet
```

### How React calls the components

When the page loads, React executes `App`, followed by `CartProvider`. React runs `useReducer` to obtain the initial cart state, then renders child components from top to bottom. After each click, React re-renders `CartProvider`, updating only components that subscribe to the changed context:

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
| **1. Two contexts** | `CartContext` and `CartDispatchContext`, created with `createContext(null)` | No visual change: no component consumes them yet |
| **2. Two providers** | `App` wraps child tree in both providers using the `value` prop | Identical layout. Omitting or misspelling `value` logs a warning |
| **3. Reading the contexts** | Readers access cart, buttons access `dispatch`, and `CartPage` drops props | Clicking Delete on Apple updates the header to Cart: 2 items |
| **4. The provider component** | `CartProvider` encapsulates `useReducer` and renders `{children}` | Identical layout. Action buttons skip re-renders when cart updates |
| **5. Custom Hooks** | `useCart` and `useCartDispatch` exported; contexts remain private | Identical layout. Components no longer import raw context objects |

One last time, the sentence of this lesson: **the state still lives in the component that calls `useReducer`. Context only delivers it: the cart in one context, and `dispatch` in another.**

---

## For the Interview

> **The Interview Question:** How do you combine a reducer with context for app-wide state?

### How to Answer Clearly in 30 Seconds

"A reducer consolidates complex state transitions into one function, while context distributes values deep down the tree without prop drilling. Combined, they allow any nested component to read shared state and dispatch actions directly. The implementation follows three clear steps:
1. **Create** two separate contexts with `createContext(null)`: one for the state and one for `dispatch`.
2. **Provide** both values from the component hosting `useReducer`, wrapping one provider inside the other.
3. **Consume** them where needed: components that display data subscribe to the state context, while interactive buttons read `dispatch` and send actions. Intermediate components drop all forwarded props.

The state continues to live inside the component calling `useReducer`. Context acts purely as the delivery pipeline. In production, we typically encapsulate this setup in a provider component that accepts `children`, and export custom hooks like `useCart` and `useCartDispatch`."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why two contexts, and not one context with `{ state, dispatch }`?"**
   Because state and `dispatch` update at entirely different frequencies. State updates after every action, whereas `dispatch` possesses a stable identity that never changes across re-renders. React compares context values using `Object.is`. Passing an inline object like `{ cart, dispatch }` generates a new reference on every render. That triggers re-renders across all consumers, even buttons that only need `dispatch`. Splitting into two contexts ensures that the dispatch context never changes. Components reading only `dispatch` skip re-rendering when state updates, provided the provider renders its children via the `children` prop. In Lesson 59, we explore memoizing object values with `useMemo`, but splitting contexts remains the cleanest architectural solution because `dispatch` needs no extra memoization.
2. **"Does 'app-wide state' mean one global variable? Where does the state actually live?"**
   No. The state lives inside the component calling `useReducer`, such as `CartProvider`. Context is simply a delivery mechanism, not a global storage container. Each consumer component reads from the nearest matching provider above it in the tree. Outside that provider tree, consumers receive the default value, which throws a clear `TypeError` if set to `null`. A React application can host multiple independent reducer-context pairs, each scoped to a specific feature or screen section.
3. **"When would you use a reducer with context instead of props?"**
   Choose a reducer with context when many distant components need to share state, and intermediate components only pass props down. When only two or three adjacent components share state, ordinary props remain simpler and more explicit. Passing JSX via `children` can also flatten component hierarchies without context. Context does not eliminate all props: component-specific data, such as a single item passed to a list row, belongs in props. Finally, note that wrapping a component in `React.memo` does not prevent it from re-rendering when a context it subscribes to receives a new value.

```tree caption="Interview summary: what each part of a reducer combined with context does."
A reducer combined with context
- +`useReducer` in `CartProvider` | **Holds the state** and gives **`cart`** and **`dispatch`** | The state **still lives here**
- +Two contexts, two providers [`CartContext` `CartDispatchContext`] | Deliver **`cart`** and **`dispatch`** separately | `dispatch` **never changes**, so its readers are not rendered again
- +Two custom Hooks [`useCart` `useCartDispatch`] | Read each context **at the top level** of a component | Components **never import the contexts**
```
