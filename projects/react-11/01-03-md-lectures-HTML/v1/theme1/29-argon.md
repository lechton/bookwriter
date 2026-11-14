# Lecture 29: Combining a Reducer with Context for App-Wide State

*(How can components far below read and change one reducer's state without passing props down?)*

> INTERVIEW QUESTION | ❱ CORE | How do you combine a reducer with context for app-wide state?

---

## VS | Passing `cart` and Handlers as Props vs. Putting `cart` and `dispatch` in Two Contexts: props travel through every parent, context delivers them straight to the components that use them

**Combining `useReducer` with context lets components far down the page both read and update state at the top, without passing props through every component in between.**

Say you build a shop page with a cart counter in the header at the top, and a list of cart rows with Add one, Remove one, and Delete buttons at the bottom. Clicking Delete on the Bread row must remove that row and drop the header count from 3 items to 2 items.

**Why:** If you keep the cart in `App` with `useReducer` and pass `cart` and four handler functions down as props, every layout component in the middle has to accept five props it never uses just to hand them down. And if you learned context in Lesson 28, you know how to pass the `cart` array down so components can read it, but a component deep in the list still has no way to change the cart unless `dispatch` can reach it too.

Here is the one sentence to keep in mind for this whole lesson:

**The state still lives in the component that calls `useReducer`. Two contexts only deliver `cart` and `dispatch` to the components below.**

In Lesson 27, `useReducer` gave one component two things: the state `cart`, and the `dispatch` function that sends action objects to `cartReducer`.

```jsx title="Lesson 27: useReducer gives two values"
const [cart, dispatch] = ~useReducer(cartReducer, initialCart)~; // cart is the array, dispatch sends actions
```

In Lesson 28, a context provider let a parent component supply a value to every component inside it, and `useContext` let any component below ask for that value directly.

```jsx title="Lesson 28: a provider supplies a value, useContext reads it"
<ThemeContext ~value={theme}~>...</ThemeContext> {/* Supplies theme to every component inside */}
const theme = ~useContext(ThemeContext)~; // Any component inside asks for theme
```

Now put both in the same component. `dispatch` is a value just like `cart` or `theme`. It is a function, and in JavaScript you can pass a function anywhere you pass an array or a string. So the component that calls `useReducer` puts `cart` into one context provider and `dispatch` into another:

```jsx title="Combining a reducer with two contexts"
function App() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  return (
    <CartContext ~value={cart}~> {/* Supplies the cart array to every component inside */}
      <CartDispatchContext ~value={dispatch}~> {/* Supplies the dispatch function to every component inside */}
        <Header />
        <CartPage />
      </CartDispatchContext>
    </CartContext>
  );
}

function Header() {
  const cart = ~useContext(CartContext)~; // Asks React for the cart array
  return <p>Cart: {cart.length} items</p>;
}

function DeleteButton({ id }) {
  const dispatch = ~useContext(CartDispatchContext)~; // Asks React for the dispatch function
  return <button onClick={() => dispatch({ type: 'deleted', id: id })}>Delete</button>;
}
```

> [!DEFINITION]
> **What is app-wide state with a reducer and context?** [NEW] App-wide state is state that many distant components on the page read and update, such as a shopping cart that the header counts and every cart row changes. Combining a reducer with context is not a new React Hook. You call `useReducer` in a component at the top to get the state and `dispatch`, and you pass those two values down through two contexts (`CartContext` and `CartDispatchContext`). The context does not store the state. The state still lives in the component that calls `useReducer`, and the two contexts only deliver `cart` and `dispatch` to the components below (Lesson 29).

The React docs say it in three sentences: "Reducers let you consolidate a component's state update logic. Context lets you pass information deep down to other components. You can combine reducers and context together to manage state of a complex screen."

```tree caption="A reducer and two contexts each do one job; together, any component below can read the cart and send actions."
A reducer and two contexts on the same page
- +The reducer [`useReducer` `cartReducer`] | Keeps **all update logic** in one function | Gives **`cart`** and **`dispatch`** to the top component
- +The two contexts [`CartContext` `CartDispatchContext`] | Carry **`cart`** and **`dispatch`** down the tree | Any component below **asks for what it needs** with `useContext`
- +Both together | The state **still lives** where `useReducer` is called | `Header` reads `cart`, and buttons far below call **`dispatch`**
```

### Why two contexts instead of one?

Both `cart` and `dispatch` come from the same `useReducer` call. Why not put both in one context?

Because they change at different rates:
1. **`cart` changes** every time an action updates the cart. `cartReducer` returns a brand-new array.
2. **`dispatch` never changes.** React gives you the exact same `dispatch` function on every render. The React docs say that `dispatch` "has a stable identity", which means `Object.is(oldDispatch, newDispatch)` is always `true`.

If you give each value its own context, a component that only needs `dispatch`, such as `EmptyCartButton`, reads `CartDispatchContext`, whose value never changes. Principle 4 shows how this saves extra re-renders.

### When to use a reducer with context

Developers have four ways to share state across components:
1. **Props (Lessons 23 and 24).** Keep state in the closest common parent and pass props down. Best when only one or two components sit in the middle.
2. **Passing JSX as `children` (Lesson 28).** Let the parent render the components directly so fewer components sit in the middle.
3. **`useState` with context (Lesson 28).** Great when the state updates are simple, such as flipping a theme between `'light'` and `'dark'`.
4. **`useReducer` with two contexts.** Best when distant components both read the state and trigger several different updates: adding, removing, deleting, and emptying.

### The Rule of Thumb: keep state in the reducer, deliver `cart` and `dispatch` with two contexts

**Create one context for the state and one for `dispatch`, provide both from the component that calls `useReducer`, and let each component below read only the context it needs.**

A senior developer also watches out for four classic mistakes:
1. **Putting `{ cart, dispatch }` in one context.** That creates a new object on every render, so every reader re-renders on every click.
2. **Forgetting `value=` on a provider, or forgetting to import the context.** Writing `<CartDispatchContext dispatch={dispatch}>` passes `undefined` to every reader.
3. **Removing every prop in the app.** Context replaces prop drilling, not local props. Each `CartRow` still needs its own `item` prop from `CartList`.
4. **Placing a reader outside the provider, or calling a custom Hook inside `onClick`.** A component outside `<CartProvider>` reads the default `null` and crashes.

## SECTION | A Corner Shop with a Cart

Our page is the shopping cart from Lesson 27, placed inside a complete shop page.

At the top sits `Header` with the shop title and `Cart: 3 items`. Below it sits `CartPage`, which holds `CartList` with three rows and `EmptyCartButton`:

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

Here is what happens when the user clicks:
1. Click `Add one` on Bread: the row updates to `Bread: 3`. The header stays `Cart: 3 items` because there are still three rows in the array.
2. Click `Delete` on Apple: the Apple row disappears, and the header updates to `Cart: 2 items`.
3. Click `Empty cart`: all rows disappear, `Your cart is empty.` appears, and the header updates to `Cart: 0 items`.

The project has six components and keeps `cartReducer.js` from Lesson 27 unchanged:

```files title="corner-shop: File Explorer" caption="The files of the shop page at the start of the lesson, before adding context."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | state | Calls `useReducer` and passes `cart` and four handlers down as props
  cartReducer.js | reducer | Exports `cartReducer` as default, unchanged from Lesson 27
  components/
    Header.jsx | reads | Reads `cart` to display the number of items
    CartPage.jsx | middle | Receives five props from `App` and uses none of them itself
    CartList.jsx | reads | Reads `cart` to render rows and passes three handlers down
    CartRow.jsx | changes | Displays one `item` and calls the three row handlers
    EmptyCartButton.jsx | changes | Calls `onEmpty` when clicked
```

Look at what each component does with the cart before we add context:

```tree caption="The six components at the start of the lesson: CartPage in the middle receives five props and uses none of them."
`App` [Calls `useReducer`] | Holds **`cart`** and **four handler functions**
- +`Header` | **Reads** `cart` to show `Cart: 3 items`
- !`CartPage` | Receives **five props** and **uses none of them**
  - +`CartList` | **Reads** `cart` and passes **three handlers** on to each row
    - +`CartRow` | Shows `item` and **calls** the three row handlers
  - +`EmptyCartButton` | **Calls** `onEmpty`
```

At the start, `App` calls `useReducer`, defines four wrapper handlers, and passes five props into `CartPage`:

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
      <CartPage ~cart={cart} onIncrease={handleIncrease} onDecrease={handleDecrease} onDelete={handleDelete} onEmpty={handleEmpty}~ /> {/* Five props passed into a component that uses none of them */}
    </>
  );
}
```

And `CartPage` has to accept all five props just to forward four of them to `CartList` and one to `EmptyCartButton`:

```jsx title="src/components/CartPage.jsx"
import CartList from './CartList.jsx';
import EmptyCartButton from './EmptyCartButton.jsx';

export default function CartPage({ ~cart, onIncrease, onDecrease, onDelete, onEmpty~ }) { // Forwards five props without using any of them
  return (
    <main>
      <h2>Your cart</h2>
      <CartList cart={cart} onIncrease={onIncrease} onDecrease={onDecrease} onDelete={onDelete} />
      <EmptyCartButton onEmpty={onEmpty} />
    </main>
  );
}
```

If `CartPage` forgets to forward `onDelete`, clicking `Delete` on a row crashes with `Uncaught TypeError: onDelete is not a function`. Now let's replace this prop drilling step by step.

**PRINCIPLES:** The state and `dispatch` stay in the component that calls `useReducer`, and two contexts deliver them to every component below. Five principles follow:
1. **Principle 1: `createContext(null)`: create one context for the state and one for `dispatch`.** Putting both in one object forces every reader to re-render on every action.
2. **Principle 2: `<CartContext value={cart}>` and `<CartDispatchContext value={dispatch}>`: provide both from the component that calls `useReducer`.** Both providers use the `value` prop and wrap the tree in either order.
3. **Principle 3: `useContext`: each component reads the context it needs, and middle components drop unused props.** Components that change the cart call `dispatch` directly, while each `CartRow` keeps its own `item` prop.
4. **Principle 4: `CartProvider` with `{children}`: move the reducer and both providers into one component.** Every reader must sit inside `<CartProvider>`, and components that only read `dispatch` stop re-rendering when the cart changes.
5. **Principle 5: `useCart()` and `useCartDispatch()`: wrap the two `useContext` calls in custom Hooks.** Components call `useCart()` or `useCartDispatch()` at the top level instead of importing the contexts.

---

## PRINCIPLE | `createContext(null)`: create one context for the state and one for `dispatch`

> [!PRINCIPLE]
> **Principle 1: Two Contexts: One for the State, One for `dispatch`**
>
> *Create two separate contexts with `createContext(null)` in their own file: `CartContext` to carry the state array, and `CartDispatchContext` to carry the `dispatch` function.*
>
> `useReducer` returns two values that change at different rates: `cart` is a brand-new array after every update, while `dispatch` is the exact same function for the whole life of the component. Giving each value its own context lets components subscribe only to what they use. If you pack both into a single object like `value={{ cart, dispatch }}`, JavaScript creates a new object on every render, and React re-renders every reader even when it only uses `dispatch`.
>
> **DO THIS:**
> ```jsx
> export const CartContext = createContext(null);
> export const ~CartDispatchContext~ = createContext(null); // Separate context for dispatch
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <ShopContext ~value={{ cart, dispatch }}~> {/* **WRONG:** builds a brand-new object on every render, so every reader re-renders */}
>   <CartPage />
> </ShopContext>
> ```

Step 1 is to create a new file, `src/CartContext.jsx`, and export two contexts:

```jsx title="src/CartContext.jsx"
import { createContext } from 'react';

export const ~CartContext~ = createContext(null); // Will carry the cart array
export const ~CartDispatchContext~ = createContext(null); // Will carry the dispatch function
```

Nothing in `createContext` is special to reducers. These are two ordinary contexts from Lesson 28. We export them by name so any component file can import the one it needs.

### Why pass `null` as the default value?

The value inside `createContext(null)` is the fallback value a component gets only when you forget to wrap it in a provider.

Why use `null` instead of an empty array `[]`?
- **With `[]`**, if you accidentally put `<Header />` outside the provider, `cart.length` is `0`. The header quietly says `Cart: 0 items` while the cart below has 3 items, and you get no error telling you why.
- **With `null`**, `cart.length` immediately throws a `TypeError`. You see the mistake right away. The React docs use `null` for both contexts for this exact reason.

### Two contexts vs. one `{ cart, dispatch }` object

It is tempting to create a single `ShopContext` and pass both values in one object. Look at the difference:

```jsx title="Two separate contexts vs. one combined object"
<CartContext ~value={cart}~> {/* Two contexts: CartDispatchContext keeps the exact same function */}
  <CartDispatchContext value={dispatch}>...</CartDispatchContext>
</CartContext>

<ShopContext ~value={{ cart, dispatch }}~>...</ShopContext> {/* **WRONG:** {{ ... }} creates a brand-new object on every render */}
```

Remember how React checks whether a context changed (Lesson 28): it compares the old `value` and the new `value` with `Object.is`.
- With `value={{ cart, dispatch }}`, the inner curly braces `{ cart, dispatch }` build a brand-new object every time `App` renders. `Object.is(oldObj, newObj)` is always `false`, so every component that reads `ShopContext` is forced to re-render, even a button that only calls `dispatch`.
- With two contexts, `CartDispatchContext` receives `dispatch` by itself. Because `dispatch` never changes between renders, `Object.is(oldDispatch, newDispatch)` is `true`.

---

## PRINCIPLE | `<CartContext value={cart}>`: provide both from the component that calls `useReducer`

> [!PRINCIPLE]
> **Principle 2: Two Providers in the Component That Calls `useReducer`**
>
> *In the component that calls `useReducer`, wrap the returned JSX in both `<CartContext value={cart}>` and `<CartDispatchContext value={dispatch}>`.*
>
> Only the component that calls `useReducer` has `cart` and `dispatch`, so it is the one that puts them into the two providers. You can nest the two providers in either order, because each `useContext` call looks only for its own context. Always name the prop `value`: naming it `cart={cart}` or `dispatch={dispatch}` leaves `value` as `undefined`, prints a Console warning, and breaks the first button click.
>
> **DO THIS:**
> ```jsx
> <CartContext value={cart}>
>   <CartDispatchContext ~value={dispatch}~> {/* Prop is named value, so readers below receive dispatch */}
>     <Header />
>     <CartPage />
>   </CartDispatchContext>
> </CartContext>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <CartContext value={cart}>
>   <CartDispatchContext ~dispatch={dispatch}~> {/* **WRONG:** prop is not named value, so readers receive undefined */}
>     <Header />
>     <CartPage />
>   </CartDispatchContext>
> </CartContext>
> ```

Step 2 is to open `src/App.jsx`, import both contexts, and wrap the JSX in both providers. For a moment, we can keep the existing props in place while we put the providers around them:

```jsx title="src/App.jsx"
import { useReducer } from 'react';
import cartReducer from './cartReducer.js';
import { ~CartContext, CartDispatchContext~ } from './CartContext.jsx'; // Import both contexts
import Header from './components/Header.jsx';
import CartPage from './components/CartPage.jsx';
```

Inside `App`, wrap `<Header />` and `<CartPage />` in the two providers:

```jsx title="src/App.jsx" startLine="32"
  return (
    <CartContext ~value={cart}~> {/* Makes cart available to every component inside */}
      <CartDispatchContext ~value={dispatch}~> {/* Makes dispatch available to every component inside */}
        <Header cart={cart} />
        <CartPage cart={cart} onIncrease={handleIncrease} onDecrease={handleDecrease} onDelete={handleDelete} onEmpty={handleEmpty} />
      </CartDispatchContext>
    </CartContext>
  );
}
```

### Does the order of the two providers matter?

No. You can put `CartContext` on the outside or `CartDispatchContext` on the outside:

```jsx title="Both provider orders work identically"
<CartContext value={cart}><CartDispatchContext value={dispatch}>...</CartDispatchContext></CartContext> {/* Order 1 */}
<CartDispatchContext value={dispatch}><CartContext value={cart}>...</CartContext></CartDispatchContext> {/* Order 2 */}
```

When a component calls `useContext(CartDispatchContext)`, React walks up the tree looking only for `<CartDispatchContext>`. It ignores `<CartContext>` completely.

One rule from Lesson 28 still applies: `App` itself cannot call `useContext(CartContext)` to read the provider it returns. A component can only read providers sitting **above** it in the tree. `App` does not need to, because `App` already has `cart` and `dispatch` directly from `useReducer`.

### The mistake: naming the prop `dispatch={dispatch}` instead of `value={dispatch}`

When you write two providers in a row, it is easy to name the prop after the variable by mistake:

```jsx title="src/App.jsx" startLine="34" bad="1"
      <CartDispatchContext ~dispatch={dispatch}~> {/* **WRONG:** a context provider only reads the prop named value */}
```

A context provider only looks at the prop named `value`. Passing `dispatch={dispatch}` is the same as passing `value={undefined}`. React prints a warning in the Console right away:

```page width=text caption="When CartDispatchContext is given dispatch={dispatch} instead of value={dispatch}, React warns in the Console."
heading: Corner Shop
line: Cart: 3 items
section: Your cart
line: • Apple: 1 [Add one] [Remove one] [Delete]
line: • Bread: 2 [Add one] [Remove one] [Delete]
line: • Milk: 1 [Add one] [Remove one] [Delete]
line: [Empty cart]
console: The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?
```

And as soon as a button below reads `CartDispatchContext`, it gets `undefined` instead of the `dispatch` function, and clicking it crashes with `TypeError: dispatch is not a function`. Always write `value={cart}` and `value={dispatch}`.

---

## PRINCIPLE | `useContext`: each component reads the context it needs, and middle components drop unused props

> [!PRINCIPLE]
> **Principle 3: Each Component Reads Only What It Needs**
>
> *Call `useContext(CartContext)` in components that display the cart, call `useContext(CartDispatchContext)` in components that dispatch actions, and delete the pass-through props from the components in the middle.*
>
> Once `cart` and `dispatch` are in context, `CartRow` and `EmptyCartButton` do not need handler functions passed down from `App`. They read `dispatch` from `CartDispatchContext` and dispatch their action objects right inside their own `onClick`. Middle components like `CartPage` drop all five pass-through props. Only props that tell a component which item is its own, like `item` on `<CartRow item={item} />`, stay as props.
>
> **DO THIS:**
> ```jsx
> function CartRow({ item }) {
>   const dispatch = ~useContext(CartDispatchContext)~; // Reads dispatch directly from context
>   return <button onClick={() => dispatch({ type: 'deleted', id: item.id })}>Delete</button>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function CartPage({ ~onDelete~ }) { // **WRONG:** CartPage never calls onDelete, it only passes it down
>   return <CartList onDelete={onDelete} />;
> }
> ```

Step 3 is where the payoff happens. Every component that needs `cart` or `dispatch` asks for it with `useContext`, and we delete all the pass-through props.

First, look at how `CartRow` changes. Before, it received `onIncrease`, `onDecrease`, and `onDelete` as props. Now it reads `dispatch` from `CartDispatchContext` and dispatches the action object itself:

```jsx title="src/components/CartRow.jsx"
import { useContext } from 'react';
import { CartDispatchContext } from '../CartContext.jsx';

export default function CartRow({ item }) {
  const dispatch = ~useContext(CartDispatchContext)~; // Gets the dispatch function from App's provider
  return (
    <li>
      {item.name}: {item.quantity}
      <button onClick={() => dispatch({ type: 'increased', id: item.id })}>Add one</button>
      <button onClick={() => dispatch({ type: 'decreased', id: item.id })}>Remove one</button>
      <button onClick={() => ~dispatch({ type: 'deleted', id: item.id })~}>Delete</button> {/* Sends the action directly */}
    </li>
  );
}
```

`EmptyCartButton` does the same thing:

```jsx title="src/components/EmptyCartButton.jsx"
import { useContext } from 'react';
import { CartDispatchContext } from '../CartContext.jsx';

export default function EmptyCartButton() {
  const dispatch = useContext(CartDispatchContext);
  return <button onClick={() => ~dispatch({ type: 'emptied' })~}>Empty cart</button>; // Sends the emptied action directly
}
```

Next, the two components that display the cart read `CartContext`. Here is `Header`:

```jsx title="src/components/Header.jsx"
import { useContext } from 'react';
import { CartContext } from '../CartContext.jsx';

export default function Header() {
  const cart = ~useContext(CartContext)~; // Reads the cart array directly, no prop needed
  return (
    <header>
      <h1>Corner Shop</h1>
      <p>Cart: {cart.length} items</p>
    </header>
  );
}
```

And here is `CartList`:

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
        <CartRow key={item.id} ~item={item}~ /> // Keeps item={item} so each row knows which product to show
      ))}
    </ul>
  );
}
```

### Why does `CartRow` still take `item={item}` as a prop?

A junior developer often asks: "Now that we have context, why not remove every prop in the app?"

Because `CartContext` holds the whole list of three items. If `CartRow` read `CartContext`, how would the first `<CartRow />` know it should show Apple and the second `<CartRow />` know it should show Bread? Only `CartList`'s `.map()` loop knows which item belongs to which row. So `item={item}` is not prop drilling. It is a normal prop that `CartList` gives to its direct child.

### Look at `CartPage` and `App` now

Because the children below read the contexts directly, `CartPage` drops all five of its props:

```jsx title="src/components/CartPage.jsx"
import CartList from './CartList.jsx';
import EmptyCartButton from './EmptyCartButton.jsx';

export default function ~CartPage~() { // Zero props!
  return (
    <main>
      <h2>Your cart</h2>
      <CartList />
      <EmptyCartButton />
    </main>
  );
}
```

And in `App.jsx`, we delete all four `handleIncrease`, `handleDecrease`, `handleDelete`, and `handleEmpty` functions:

```jsx title="src/App.jsx" startLine="13"
export default function App() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  return (
    <CartContext value={cart}>
      <CartDispatchContext value={dispatch}>
        ~<Header />~ {/* Zero props */}
        ~<CartPage />~ {/* Zero props */}
      </CartDispatchContext>
    </CartContext>
  );
}
```

### How one click deep in a row updates the header at the top

When the user clicks `Delete` on Apple inside `CartRow`, how does `Header` at the top change to `Cart: 2 items`?
1. The click runs `dispatch({ type: 'deleted', id: 0 })` inside `CartRow`.
2. That `dispatch` function belongs to `useReducer` in `App`, so React calls `cartReducer(cart, { type: 'deleted', id: 0 })` and re-renders `App`.
3. `App` passes the new 2-item `cart` array into `<CartContext value={cart}>`.
4. Both `Header` and `CartList` read `CartContext`, so React re-renders both with the new array.

```page width=text caption="After clicking Delete on Apple: the Apple row is gone, and Header at the top shows Cart: 2 items."
heading: Corner Shop
line: Cart: 2 items | good
section: Your cart
line: • Bread: 2 [Add one] [Remove one] [Delete]
line: • Milk: 1 [Add one] [Remove one] [Delete]
line: [Empty cart]
console: quiet
```

Remember our key sentence: **the state still lives in the component that calls `useReducer`.** Context just carried `dispatch` down to `CartRow` and carried the new `cart` down to `Header`.

### The mistake: calling `useContext(CartDispatchContext)` without importing `CartDispatchContext`

When moving `dispatch` into several files, it is easy to import `useContext` from `'react'` and forget to import `CartDispatchContext` from `'../CartContext.jsx'`:

```jsx title="src/components/EmptyCartButton.jsx" bad="4"
import { useContext } from 'react';

export default function EmptyCartButton() {
  const dispatch = useContext(~CartDispatchContext~); // **WRONG:** CartDispatchContext is not imported in this file
  return <button onClick={() => dispatch({ type: 'emptied' })}>Empty cart</button>;
}
```

The page goes blank immediately with a `ReferenceError`:

```page width=text caption="When EmptyCartButton uses CartDispatchContext without importing it: the page is blank."
blank
console: Uncaught ReferenceError: CartDispatchContext is not defined
console: An error occurred in the <EmptyCartButton> component. Consider adding an error boundary to your tree to customize error handling behavior.
```

Principle 5 will make these imports even simpler.

---

## PRINCIPLE | `CartProvider` with `{children}`: move the reducer and both providers into one component

> [!PRINCIPLE]
> **Principle 4: A Provider Component That Takes `children`**
>
> *Move `useReducer`, `initialCart`, and both context providers into a custom `CartProvider` component that accepts `{ children }` and renders `{children}` inside the providers.*
>
> Moving the reducer and providers into `CartProvider` cleans up `App` so `App` only renders `<CartProvider><Header /><CartPage /></CartProvider>`. Every component that reads the cart must sit inside `<CartProvider>`, or it will read the fallback `null` and crash. Because `Header` and `CartPage` are passed from `App` as `children`, updating the cart inside `CartProvider` re-renders only the components that read `CartContext`, while components that only read `CartDispatchContext` do not re-render at all.
>
> **DO THIS:**
> ```jsx
> export default function App() {
>   return (
>     ~<CartProvider>~ {/* Both Header and CartPage sit inside CartProvider */}
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
>       ~<Header />~ {/* **WRONG:** outside CartProvider, so Header reads null and crashes on cart.length */}
>       <CartProvider><CartPage /></CartProvider>
>     </>
>   );
> }
> ```

Right now, `App.jsx` still sets up `initialCart`, calls `useReducer`, and renders the two context providers. In a real app, `App` might also set up themes, user login, and routing.

Step 4 moves all the cart setup into `src/CartContext.jsx` inside a component we write ourselves, named `CartProvider`:

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

export function ~CartProvider~({ children }) { // Our own component: holds the reducer and wraps children in both providers
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  return (
    <CartContext value={cart}>
      <CartDispatchContext value={dispatch}>
        ~{children}~ {/* Renders whatever JSX you place between <CartProvider> and </CartProvider> */}
      </CartDispatchContext>
    </CartContext>
  );
}
```

> [!DEFINITION]
> **What is a provider component?** [NEW] A provider component like `CartProvider` is not a built-in React feature. It is a normal React component that you write yourself to keep `App` clean. It does three jobs in one place: it calls `useReducer` to hold the state, it renders `<CartContext value={cart}>` and `<CartDispatchContext value={dispatch}>`, and it takes `{ children }` as a prop (Lesson 09) so you can wrap `<CartProvider>...</CartProvider>` around any JSX in `App` (Lesson 29).

Look at how clean `src/App.jsx` becomes:

```jsx title="src/App.jsx"
import { CartProvider } from './CartContext.jsx';
import Header from './components/Header.jsx';
import CartPage from './components/CartPage.jsx';

export default function App() {
  return (
    ~<CartProvider>~ {/* Everything inside gets access to cart and dispatch */}
      <Header />
      <CartPage />
    </CartProvider>
  );
}
```

The state now lives in `CartProvider` instead of `App`.

```tree dir=right caption="How <CartProvider><Header /><CartPage /></CartProvider> works."
How `CartProvider` wraps the page
- +1. In `App` [`<CartProvider>...</CartProvider>`] | You write `<Header />` and `<CartPage />` **between the tags**
- +2. In `CartProvider` [`{ children }`] | React passes both components in the **`children` prop**
- +3. Inside the providers [`{children}`] | Both render **inside `CartContext` and `CartDispatchContext`**
```

### The mistake: placing `<Header />` outside `<CartProvider>`

Suppose a developer wraps `<CartPage />` in `<CartProvider>`, and leaves `<Header />` right above it:

```jsx title="src/App.jsx" bad="3"
  return (
    <>
      ~<Header />~ {/* **WRONG:** sits outside CartProvider, so no CartContext provider is above it */}
      <CartProvider>
        <CartPage />
      </CartProvider>
    </>
  );
```

When `Header` calls `useContext(CartContext)`, there is no `CartContext` provider above `Header`. So `useContext` returns the default value from Principle 1: `null`. Then `Header` runs `cart.length` on `null`, and the whole page crashes:

```page width=text caption="When Header sits outside CartProvider: cart is null, and reading cart.length crashes the page."
blank
console: Uncaught TypeError: Cannot read properties of null (reading 'length')
console: An error occurred in the <Header> component. Consider adding an error boundary to your tree to customize error handling behavior.
```

Every component that reads `CartContext` or `CartDispatchContext` must sit **inside** `<CartProvider>`.

### Bonus payoff: `EmptyCartButton` stops re-rendering when the cart changes

Moving `useReducer` into `CartProvider` with `{children}` also unlocks the performance payoff from Principle 1.

Say we put `console.log('EmptyCartButton renders')` inside `EmptyCartButton` and click `Add one` on Bread once. Compare what happens when `useReducer` was directly in `App` versus when it is in `CartProvider` with `{children}`. In development, `<StrictMode>` doubles every render log (Lesson 14):

::: row caption="Console output after opening the page and clicking Add one on Bread once."
::: col title="Providers directly in App" tag="re-renders on every click" tone=bad
```devconsole
+ EmptyCartButton renders | EmptyCartButton.jsx:5
+ EmptyCartButton renders | EmptyCartButton.jsx:5
+ EmptyCartButton renders | EmptyCartButton.jsx:5
+ EmptyCartButton renders | EmptyCartButton.jsx:5
```
2 logs on initial load, plus 2 more logs after clicking `Add one`.
:::
::: col title="CartProvider with children" tag="never re-renders on click" tone=good
```devconsole
+ EmptyCartButton renders | EmptyCartButton.jsx:5
+ EmptyCartButton renders | EmptyCartButton.jsx:5
```
2 logs on initial load, and 0 logs after clicking `Add one`.
:::
:::

Why did `EmptyCartButton` stop re-rendering?
1. When `useReducer` was inside `App`, every cart update re-rendered `App`, and re-rendering `App` re-rendered every component `App` returned: `Header`, `CartPage`, `CartList`, `CartRow`, and `EmptyCartButton`.
2. When `useReducer` is inside `CartProvider`, clicking `Add one` re-renders `CartProvider`, **not `App`**.
3. Because `App` did not re-render, the `children` prop passed to `CartProvider` holds the exact same `<Header />` and `<CartPage />` JSX elements as before. React skips re-rendering unchanged `children` unless a context they read changed.
4. `Header` and `CartList` read `CartContext`, which changed, so React re-renders them. `CartPage` reads no context, and `EmptyCartButton` reads only `CartDispatchContext`, where `dispatch` never changes, so neither one re-renders!

---

## PRINCIPLE | `useCart()` and `useCartDispatch()`: wrap the two `useContext` calls in custom Hooks

> [!PRINCIPLE]
> **Principle 5: Two Custom Hooks Read the Two Contexts**
>
> *Export two helper functions from `CartContext.jsx`, `useCart` and `useCartDispatch`, that return `useContext(CartContext)` and `useContext(CartDispatchContext)`. Components call them at their top level.*
>
> A function whose name starts with `use` and that calls a React Hook inside is a custom Hook. Wrapping `useContext(CartContext)` inside `useCart` means components only import one function instead of importing both `useContext` and `CartContext`. Because `useCart` and `useCartDispatch` are Hooks, you must call them at the top level of your component, never inside an `onClick` handler.
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
>   return <button onClick={() => ~useCartDispatch()~({ type: 'emptied' })}>Empty cart</button>; // **WRONG:** never call a Hook inside onClick
> }
> ```

Right now, every component that reads the cart or `dispatch` has to write two imports at the top of its file:

```jsx title="Two imports in every component"
import { useContext } from 'react';
import { CartDispatchContext } from '../CartContext.jsx';
const dispatch = useContext(CartDispatchContext);
```

Step 5 makes that cleaner. Inside `src/CartContext.jsx`, we write two small functions that call `useContext` for us:

```jsx title="src/CartContext.jsx" startLine="24"
export function ~useCart~() { // Custom Hook that returns the cart array
  return useContext(CartContext);
}

export function ~useCartDispatch~() { // Custom Hook that returns the dispatch function
  return useContext(CartDispatchContext);
}
```

> [!DEFINITION]
> **What is a custom Hook?** [NEW] A custom Hook is a JavaScript function that you write yourself whose name starts with `use` (such as `useCart` or `useCartDispatch`) and that calls one or more React Hooks inside (such as `useContext`). It is not a built-in Hook from React. Starting the name with `use` tells React and your code editor that this function calls Hooks inside, so it follows the same rules as `useState` and `useContext`: call it at the top level of a component, never inside `if`, loops, or event handlers (Lesson 29).

Now `CartContext` and `CartDispatchContext` do not even need `export` in front of them, because every component file uses `useCart()` and `useCartDispatch()` instead:

```jsx title="src/components/Header.jsx"
import { useCart } from '../CartContext.jsx';

export default function Header() {
  const cart = ~useCart()~; // One import, one call
  return (
    <header>
      <h1>Corner Shop</h1>
      <p>Cart: {cart.length} items</p>
    </header>
  );
}
```

```jsx title="src/components/EmptyCartButton.jsx"
import { useCartDispatch } from '../CartContext.jsx';

export default function EmptyCartButton() {
  const dispatch = ~useCartDispatch()~; // One import, one call
  return <button onClick={() => dispatch({ type: 'emptied' })}>Empty cart</button>;
}
```

One detail that can seem tricky: `useCart()` is written inside `CartContext.jsx`, so how does it find the provider above `Header`? Because JavaScript runs `useCart()` while React is rendering `Header`. React always looks for the closest provider above the component that is currently rendering, no matter which file the helper function lives in.

### The mistake: calling `useCartDispatch()` inside `onClick`

Because `useCartDispatch()` looks like a regular helper function, a developer sometimes calls it right inside the `onClick` arrow function instead of at the top of the component:

```jsx title="src/components/EmptyCartButton.jsx" bad="2"
export default function EmptyCartButton() {
  return <button onClick={() => ~useCartDispatch()~({ type: 'emptied' })}>Empty cart</button>; // **WRONG:** Hook called inside an event handler
}
```

When the user clicks `Empty cart`, the cart does not empty and React logs an invalid Hook call error in the Console. Why? Because `useCartDispatch()` calls `useContext(...)` inside, and React Hooks only work while React is rendering a component, never later inside a click handler. Always call `const dispatch = useCartDispatch()` at the top of the component, and call `dispatch(...)` inside `onClick`.

---

## All 5 Principles Together

### The complete project files

Here is the finished project. All the reducer and context wiring lives in `src/CartContext.jsx` and `src/cartReducer.js`, while the components only focus on what they show on the screen.

```files title="corner-shop: Final File Explorer" caption="The finished project: CartContext.jsx holds the two contexts, CartProvider, useCart, and useCartDispatch."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | root | Wraps `<Header />` and `<CartPage />` in `<CartProvider>`
  CartContext.jsx | context + reducer | Exports `CartProvider`, `useCart`, and `useCartDispatch`
  cartReducer.js | reducer | Exports `cartReducer` as default, unchanged from Lesson 27
  components/
    Header.jsx | reads | Calls `useCart()` to display the item count
    CartPage.jsx | middle | Renders `<CartList />` and `<EmptyCartButton />` with zero props
    CartList.jsx | reads | Calls `useCart()` and renders one `<CartRow item={item} />` per item
    CartRow.jsx | changes | Calls `useCartDispatch()` and dispatches row actions
    EmptyCartButton.jsx | changes | Calls `useCartDispatch()` and dispatches `'emptied'`
```

`src/main.jsx` and `src/cartReducer.js` are unchanged from the start:

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

`src/CartContext.jsx` holds the two contexts, `CartProvider`, and the two custom Hooks:

```jsx title="src/CartContext.jsx"
import { createContext, useContext, useReducer } from 'react';
import cartReducer from './cartReducer.js';

const initialCart = [
  { id: 0, name: 'Apple', quantity: 1 },
  { id: 1, name: 'Bread', quantity: 2 },
  { id: 2, name: 'Milk', quantity: 1 },
];

const ~CartContext~ = createContext(null); // Principle 1: context for the cart array
const ~CartDispatchContext~ = createContext(null); // Principle 1: separate context for dispatch

export function ~CartProvider~({ children }) { // Principle 4: holds the reducer and wraps children
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  return (
    <CartContext ~value={cart}~> {/* Principle 2: provides cart */}
      <CartDispatchContext value={dispatch}>
        {children}
      </CartDispatchContext>
    </CartContext>
  );
}

export function ~useCart~() { // Principle 5: custom Hook to read the cart
  return useContext(CartContext);
}

export function useCartDispatch() {
  return useContext(CartDispatchContext);
}
```

And here are `App.jsx` and the five components in `src/components/`:

```jsx title="src/App.jsx"
import { CartProvider } from './CartContext.jsx';
import Header from './components/Header.jsx';
import CartPage from './components/CartPage.jsx';

export default function App() {
  return (
    ~<CartProvider>~ {/* Principle 4: wraps every component that needs the cart */}
      <Header />
      <CartPage />
    </CartProvider>
  );
}
```

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

```jsx title="src/components/CartPage.jsx"
import CartList from './CartList.jsx';
import EmptyCartButton from './EmptyCartButton.jsx';

export default function ~CartPage~() { // Principle 3: zero pass-through props
  return (
    <main>
      <h2>Your cart</h2>
      <CartList />
      <EmptyCartButton />
    </main>
  );
}
```

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
        <CartRow key={item.id} ~item={item}~ /> // Principle 3: keeps the local item prop each row needs
      ))}
    </ul>
  );
}
```

```jsx title="src/components/CartRow.jsx"
import { useCartDispatch } from '../CartContext.jsx';

export default function CartRow({ item }) {
  const dispatch = ~useCartDispatch()~; // Principle 5: reads dispatch at the top level
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

When the user clicks `Empty cart`, all rows clear and the header updates to `0 items`:

```page width=text caption="The finished shop page after clicking Empty cart: zero items in the header and the empty message below."
heading: Corner Shop
line: Cart: 0 items | good
section: Your cart
line: Your cart is empty. | good
line: [Empty cart]
console: quiet
```

### How React calls the components, and what re-renders on a click

```tree caption="The finished component tree, the render order on first load, and what re-renders when the cart changes."
`App` | **1. Renders once** when the page opens | Places `<CartProvider>` around **`Header`** and **`CartPage`**
- +`CartProvider` | **2. Calls `useReducer`** and re-renders on every action | Provides **`CartContext`** and **`CartDispatchContext`** around `children`
  - +`Header` | **3. Calls `useCart`** | Re-renders when `cart` changes
  - +`CartPage` | **4. Reads no context** | **Skipped** when `cart` changes
    - +`CartList` and `CartRow` | **5. Call `useCart` and `useCartDispatch`** | Re-render when `cart` changes
    - +`EmptyCartButton` | **6. Calls `useCartDispatch` only** | **Skipped** when `cart` changes because `dispatch` never changes
```

| Principle | What We Write | What Happens on the Page |
| :--- | :--- | :--- |
| **1. Two contexts** | `CartContext` and `CartDispatchContext` created with `null` | Separate channels for changing `cart` and stable `dispatch` |
| **2. Two providers** | `<CartContext value={cart}>` and `<CartDispatchContext value={dispatch}>` | Both values are available to any component inside |
| **3. Read only what you need** | `useContext` in readers and buttons; zero props on `CartPage`; `item` prop kept on `CartRow` | Clicking a button deep in a row updates the header at the top |
| **4. Provider component** | `CartProvider` holds `useReducer` and wraps `{children}` | `App` stays clean, and `EmptyCartButton` skips re-renders when `cart` changes |
| **5. Custom Hooks** | `useCart` and `useCartDispatch` exported from `CartContext.jsx` | Components call one Hook at the top level without importing the contexts |

One last time, the sentence of this lesson: **The state still lives in the component that calls `useReducer`. Two contexts only deliver `cart` and `dispatch` to the components below.**

---

## For the Interview

> **The Interview Question:** How do you combine a reducer with context for app-wide state?

### How to Answer Clearly in 30 Seconds

"`useReducer` keeps complex state update logic in one reducer function, and context lets distant components read values without prop drilling. To combine them, I follow the React docs' pattern in `CartContext.jsx`:
1. **Create two contexts** with `createContext(null)`: `CartContext` for the state and `CartDispatchContext` for `dispatch`.
2. **Write a provider component**, `CartProvider`, that calls `useReducer`, wraps `{children}` in both context providers, and passes `value={cart}` and `value={dispatch}`.
3. **Export two custom Hooks**, `useCart` and `useCartDispatch`, so any component inside `<CartProvider>` can read the state or dispatch actions directly without passing props through middle components.

The state still lives inside `CartProvider` where `useReducer` is called. Context only delivers the state and `dispatch` down the tree."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why create two separate contexts instead of putting `{ state, dispatch }` in one context?"**
   Because `state` and `dispatch` change at different rates. The state is a new array or object after every update, whereas `dispatch` has a stable identity and never changes between renders. If you pass `value={{ cart, dispatch }}` into a single provider, you create a brand-new object on every render. React compares context values with `Object.is`, sees a new object, and re-renders every component that reads the context, including components that only dispatch actions. With two contexts and a `CartProvider` that renders `{children}`, components that only call `useCartDispatch()` do not re-render when the state changes.
2. **"Does combining a reducer with context make the state a single global variable for the whole app?"**
   No. The state still lives in the component that calls `useReducer`, such as `CartProvider`. Each component that calls `useCart()` reads the closest `CartProvider` above it in the component tree. If a component sits outside `<CartProvider>`, it receives the fallback value `null`. And you can have multiple reducer-context pairs in the same app, such as one for the cart and one for the logged-in user, or even render two separate `<CartProvider>` trees that each hold their own independent state.
3. **"Once you set up `CartContext` and `CartDispatchContext`, do you stop using props completely?"**
   No. Context only replaces pass-through props that middle components like `CartPage` forwarded without using. Components still use normal props for local data that differs per instance. For example, `CartList` loops over `cart` and renders `<CartRow key={item.id} item={item} />`. Each `CartRow` needs the `item` prop to know which product it represents, while it gets `dispatch` from `useCartDispatch()`.

```tree caption="Interview summary: the three building blocks in CartContext.jsx."
Combining a reducer with context in `CartContext.jsx`
- +Two contexts [`CartContext` `CartDispatchContext`] | Created with `createContext` and `null` | Separate changing **`cart`** from stable **`dispatch`**
- +One provider component [`CartProvider`] | Calls `useReducer` and wraps **`{children}`** in both providers | The state **lives here**, and `dispatch`-only readers skip re-renders
- +Two custom Hooks [`useCart` `useCartDispatch`] | Wrap `useContext` for each context | Components call them **at the top level** with one import
```
