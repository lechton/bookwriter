# Lecture 34: When You Do Not Need an Effect

*(Where does code go when nothing outside React is involved?)*

> INTERVIEW QUESTION | ❱ CORE | When do you not need an Effect, and what replaces it?

---

## VS | Code in an Effect vs. Code in the Body or a Handler: only an Effect waits until the page is on the screen

> Pages often display values computed from existing state, such as a full name derived from a first and last name, or a subtotal with sales tax. **You should calculate derived values in a plain variable inside the component body, without declaring a third state variable or an Effect**. React executes the component body on every render pass, so the variable calculates again automatically after every state change.

How do we display a value computed from two state variables? User interfaces do this constantly, such as building a full name from two separate name inputs, or computing an order total from an items list. Developers often mistakenly create an extra `useState` variable for that calculated value, then add a `useEffect` hook to synchronize it whenever the source data updates. You need neither tool for this task. Calculate the result in a plain JavaScript variable directly inside the component body.

Does a plain variable update automatically when the user types? Yes, completely automatically. React executes the entire component function from top to bottom during every render pass. When the user types a character into an input field, the change event handler calls a state setter, prompting React to schedule a re-render. React then executes the component body again with the newly updated state. The calculation statement runs immediately, using the latest values to produce the new result. The component render pass itself serves as the automatic update.

Consider a checkout form with two input fields for a customer's first name and last name, accompanied by a live preview receipt underneath. As the user types into either field, the receipt immediately reflects the combined name. Joining two strings together never requires a third state variable or an Effect. Because both input fields and the receipt preview live within the same component, that component already holds both names in memory during every render pass.

**Why:** Storing derived data in a separate state variable updated by an Effect harms application performance. It forces React to paint the screen twice for every single keystroke. The browser first draws the screen with the old full name, and then draws it a second time once the Effect updates state. When you can compute a value directly from existing props or state, always calculate it in the component body.

### The Most Common Mistake After Lesson 32

After learning `useEffect` in Lesson 32, developers frequently treat every data synchronization challenge as a reason to write an Effect. This habit represents the most widespread architectural mistake among new React developers, so examining its mechanics clarifies why it occurs.

In standard JavaScript outside React, combining a first name and a last name requires no complex listeners. You evaluate the expression directly where you need the output:

```js title="Plain JavaScript: a full name from two names"
const firstName = 'Taylor';
const lastName = 'Swift';
const ~fullName = firstName + ' ' + lastName~; // Calculated on the spot: Taylor Swift
```

Nobody sets up a mutation observer or a watcher function to copy the combined name into a second storage location. You calculate the result at the exact point of consumption.

Similarly, when a user clicks a button in standard JavaScript, the logic responding to that click belongs directly inside the click event listener:

```js title="Plain JavaScript: the code for a click goes into the click listener"
button.addEventListener('click', () => {
  ~sendOrder(items)~; // Runs once for each click
});
```

React follows this exact separation of concerns. The component body calculates the user interface for the current render. The event handler handles user actions like button clicks and form submissions. An Effect occupies a distinct third category, serving a strictly limited synchronization role.

> [!DEFINITION]
> **What is an Effect?** [REVIEW] An Effect is side-effect code that React executes after rendering and committing changes to the screen.
> 1. You declare an Effect using the `useEffect` hook, passing a setup function and an optional dependency array.
> 2. React executes an Effect after it calls your component function and flushes the resulting changes into the browser DOM.
> 3. An Effect runs because the component was displayed to the user, not in direct response to a specific user interaction like a click.
> 4. In development, Strict Mode unmounts and remounts the component to verify cleanup logic, causing Effects without cleanups to run twice.
> An Effect synchronizes your component with an external system outside React, such as a network server, a browser timer, or an external widget (Lesson 32).

### One question decides it: why does this code need to run?

The official React documentation recommends a single diagnostic question for every block of code: ask yourself why this code needs to run. That question yields three possible answers, and each answer corresponds to a specific location:
1. **To display a value derived from state or props**, such as an order subtotal. Calculate it directly in the component body during render.
2. **Because the user performed an action**, such as clicking a checkout button. Place it inside the event handler attached to that interaction.
3. **Because the component is visible on the screen**, and must maintain synchronization with an external system outside React, such as an analytics server. That logic belongs in an Effect.

```tree caption="The docs' test for any code in a component: why does this code need to run?"
Why does this code need to run?
- +To show a value calculated from state or props [`const total`] | Example: **the total line** | Calculate it **in the body**, during rendering
- +Because the user did something [`onClick`] | Example: **the click on Place order** | Put it in **that click's handler**
- +Because the component is on the screen [`useEffect`] | Example: **a visit sent to a server** | Keep it in **an Effect**
```

The first two scenarios require no Effect whatsoever. As the official documentation states, when no external system is involved, you should not need an Effect.

### The Rule of Thumb: calculate in the body, react in the handler

**Can the value be calculated from existing state or props? Compute it as a variable in the component body. Did an explicit user action cause the code to run? Place it inside that event handler. Reserve Effects strictly for operations caused by the component appearing on the screen.**

Senior developers watch for three common misconceptions:
1. **"The cart total depends on the item list, so I must track the items with an Effect."** The application renders once with an outdated total, and then renders a second time to show the right number.
2. **"After the customer clicks submit, I should send the order when the confirmation banner renders."** The application submits the order twice in development, and risks submitting additional orders later without any user click.
3. **"Effects execute twice in development, so I must remove all Effects."** Some operations, like logging page views, belong in an Effect despite running twice in development.

The remainder of this lesson demonstrates each mistake using a concrete shopping cart component.

## SECTION | A Cart with Socks and a Hat

Our example application features a shopping cart containing two products, Socks priced at five dollars and a Hat priced at twenty dollars. Each item row includes a Remove button. Beneath the items list sit the calculated total price and a Place order button.

```page width=text caption="The cart when the page opens."
heading: Your cart
line: Socks $5 [Remove]
line: Hat $20 [Remove]
line: Total: $25
line: [Place order]
console: quiet
```

The user can perform two distinct actions on this cart page:
1. **Click Remove on the Hat item.** The Hat row disappears from the list, and the summary line updates to show Total: $5.
2. **Click Place order.** The checkout button transforms into a confirmation message reading Thank you! Your order is placed, and the application transmits the order payload to the server exactly once.

Here is how an inexperienced developer typically implements this page after learning `useEffect`. The component introduces two separate Effects, one to update the total and another to send the order. The parent component manages three distinct state variables:
1. `items`, holding the list of products in the cart.
2. `total`, storing a duplicate copy of the calculated total that the first Effect updates.
3. `isOrdered`, storing a boolean that turns true on click, swapping the checkout button for the confirmation message.

```jsx title="src/App.jsx"
import { useState, useEffect } from 'react';
import OrderPlaced from './components/OrderPlaced.jsx';

const initialItems = [
  { id: 1, name: 'Socks', price: 5 },
  { id: 2, name: 'Hat', price: 20 },
];

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(0);
  const [isOrdered, setIsOrdered] = useState(false);

  useEffect(() => {
    ~setTotal~(items.reduce((sum, item) => sum + item.price, 0)); // Copies the total into state after the render
  }, [items]);

  function handleRemove(id) {
    setItems(items.filter(item => item.id !== id));
  }

  return (
    <main>
      <h1>Your cart</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} ${item.price} <button onClick={() => handleRemove(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: $~{total}~</p> {/* Shows whatever total holds in state */}
      {isOrdered ? (
        ~<OrderPlaced items={items} />~ /* Appears after the click on Place order */
      ) : (
        <button onClick={() => setIsOrdered(true)}>Place order</button>
      )}
    </main>
  );
}
```

Notice one syntactic detail in the JSX markup: the dollar symbol in `${item.price}`. This is not a JavaScript template literal. Because the expression sits inside JSX rather than backticks, the dollar sign renders as literal text, while the following curly braces evaluate the numeric variable. The rendered row displays Socks $5.

The Remove button uses the standard `.filter` array method to produce a new array excluding the clicked item (Lesson 19).

The confirmation banner is extracted into its own child component. It contains the second Effect, which attempts to dispatch the order across the network:

```jsx title="src/components/OrderPlaced.jsx"
import { useEffect } from 'react';
import { sendOrder } from '../api.js';

export default function OrderPlaced({ items }) {
  useEffect(() => {
    ~sendOrder(items);~ // Sends the order when the thank-you line appears
  }, [items]);

  return <p>Thank you! Your order is placed.</p>;
}
```

The two utility functions in the API helper module simulate asynchronous server requests:
1. `sendOrder` represents an HTTP POST request that transmits the cart contents to the backend database.
2. `logVisit` represents an analytics beacon informing the server that a user opened the checkout screen. Principle 3 explores this function.

In our demonstration code, both functions write descriptive messages to the browser console so we can observe exactly when and how often each operation executes:

```js title="src/api.js"
export function sendOrder(items) {
  console.log('Sending order: ' + items.length + ' items');
}

export function logVisit(page) {
  console.log('Visit: ' + page);
}
```

The application entry point mounts the root component inside `<StrictMode>` to highlight lifecycle issues in development (Lesson 07). Here is the project directory structure:

```files title="cart-page: File Explorer" caption="How the cart project files sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Keeps `items` in state, shows the rows and the total, and renders `OrderPlaced` after the click
  api.js | helpers | Exports `sendOrder` and `logVisit`, which only print to the Console
  components/
    OrderPlaced.jsx | child | Shows the thank-you line, and at the start sends the order in an Effect
```

Both Effects execute, and on the surface the application appears to work. Once rendering settles, the screen shows Total: $25, and in production a single button click dispatches one order. However, each redundant Effect introduces hidden costs and architectural flaws, as our three guiding principles reveal.

**PRINCIPLES:** An Effect is designed specifically to synchronize your application with external systems outside React. Any value you can calculate during render needs no Effect, and code triggered by user actions belongs in event handlers. Three concrete principles guide clean component design:
1. **Principle 1: Calculate the Total in the Body.** Copying a calculated total into state through an Effect wastes an extra render pass, initially displaying outdated information.
2. **Principle 2: The Click's Handler Sends the Order.** Dispatching network requests from an Effect fires twice in development, and re-submits duplicate orders in production when cart items are removed.
3. **Principle 3: An Effect Logs the Visit.** Tracking page views is an operation caused by the component appearing on the screen. It correctly stays in an Effect, even though Strict Mode executes it twice in development.

---

## PRINCIPLE | `const total` in the body: the total matches the rows on every render

> [!PRINCIPLE]
> **Principle 1: Calculate the Total in the Body**
>
> *When a value can be calculated from existing props or state, compute it directly inside the component body during rendering. Do not store it in a separate state variable and synchronize it with an Effect.*
>
> The component body executes anew whenever `items` changes, so a total calculated there remains perfectly synchronized with the rows during that same render pass. An Effect runs only after React finishes rendering and commits changes to the DOM. When that Effect calls a state setter to update the total, React must restart rendering from the beginning. Every cart change therefore causes an initial render pass with an outdated total, followed by a second render pass to show the corrected value.
>
> **DO THIS:**
> ```jsx
> const [items, setItems] = useState(initialItems);
> const ~total~ = items.reduce((sum, item) => sum + item.price, 0); // Matches items on every render
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const [total, setTotal] = useState(0);
> useEffect(() => {
>   ~setTotal~(items.reduce((sum, item) => sum + item.price, 0)); // **WRONG:** one render with the old total, then a second render
> }, [items]);
> ```

### VS | `fullName` set by an Effect vs. `fullName` calculated in the body: same screen, one extra render

The official React documentation illustrates this anti-pattern using a full name derived from two separate name variables. Compare both implementations side by side:

```jsx title="fullName in state, set by an Effect"
const [firstName, setFirstName] = useState('Taylor');
const [lastName, setLastName] = useState('Swift');
const [fullName, setFullName] = useState('');

useEffect(() => {
  ~setFullName~(firstName + ' ' + lastName); // Runs after React has already rendered the empty fullName
}, [firstName, lastName]);
```

```jsx title="fullName calculated in the body"
const [firstName, setFirstName] = useState('Taylor');
const [lastName, setLastName] = useState('Swift');
const ~fullName~ = firstName + ' ' + lastName; // Taylor Swift, calculated on every render
```

Both approaches eventually display Taylor Swift once rendering settles. While the final visual output looks identical, the underlying rendering process differs substantially:
- **With `fullName` stored in state**, the first render pass displays an empty string. The Effect then executes, calls `setFullName`, and forces React to render a second time.
- **With `fullName` calculated in the body**, the expression evaluates immediately every time React calls the component function. The derived value always matches the state of the current render pass.

The documentation highlights this flaw directly. Storing derived state in an Effect forces React to render with a stale value before immediately re-rendering with the updated value.

> [!DEFINITION]
> **What is a stale value?** [NEW] A stale value is out-of-date data that no longer reflects the latest state or props from which it was derived.
> 1. During the initial render pass, `fullName` in state still holds an empty string, even though `firstName` and `lastName` already hold Taylor and Swift.
> 2. That empty string is stale because it lags behind the current source data.
> 3. A render pass is one complete cycle where React calls your component functions and applies the calculated DOM changes.
> When an Effect synchronizes derived state, the initial render pass commits and paints the stale value, and the subsequent Effect triggers a redundant second render pass to correct the display (Lesson 34).

### Why the Effect costs a whole render

An Effect always executes after the rendering phase completes. The documentation outlines the exact sequence: React first calls your component functions to determine what should appear on the screen. Next, React commits those changes to the browser DOM. Only after the DOM update does React execute your Effects.

The performance penalty occurs when an Effect calls a state setter: updating state inside an Effect restarts the entire rendering cycle from scratch.

```tree dir=right caption="Why a setter called in an Effect costs a second render: the Effect runs after the commit, so its update starts the whole process again."
One state update with a setter inside the Effect
- +1. Render [`App`] | React calls the component | The JSX holds **the stale value**
- +2. Commit | React puts **the stale value** into the DOM
- !3. Effect [`setFullName`] | The Effect **sets state** | React must **start again from step 1**
- +4. Render and commit again | The JSX holds **the new value** | The page is right **one render late**
```

This directly reinforces the core state architecture principle introduced earlier: any value that can be computed from existing state or props does not belong in state (Lesson 22). Copying derived calculations into state through an Effect does not circumvent that rule. It produces redundant state accompanied by an unneeded rendering cycle.

### The cart: the total set by an Effect renders twice

Our shopping cart suffers from this exact structural flaw. The `total` value is derived entirely from `items`, yet the code stores it in state and synchronizes it through an Effect:

```jsx title="src/App.jsx" startLine="10"
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(~0~); // The total before the Effect has run
  const [isOrdered, setIsOrdered] = useState(false);

  useEffect(() => {
    ~setTotal~(items.reduce((sum, item) => sum + item.price, 0)); // Runs after the render, then asks for another one
  }, [items]);
```

**Beware: on the initial page load, the cart renders twice, and the first render displays `Total: $0`.** Follow the execution steps carefully:
1. React executes `App`. The `total` state variable still holds its initial value of zero, so the returned JSX outputs Total: $0.
2. React commits Total: $0 to the DOM.
3. React executes the Effect, which calculates twenty-five dollars and invokes `setTotal` with 25.
4. Calling `setTotal` triggers a second render pass. React executes `App` again and commits Total: $25 to the DOM.

```page width=text caption="What the first render of the cart returns, before the Effect has set the total."
heading: Your cart
line: Socks $5 [Remove]
line: Hat $20 [Remove]
line: Total: $0 | bad
line: [Place order]
console: quiet
```

Does the user actually see Total: $0 flash on the screen? Sometimes. The official documentation explains this timing. When an Effect is not caused by an explicit click, React generally lets the browser paint the screen before running the Effect.

The browser paints pixels when its next display frame is ready. On high-speed devices, both render passes frequently finish before the browser paints the first frame, allowing the user to see the correct total immediately. However, if a browser paint frame occurs between the two render passes, the user sees a visible flicker of Total: $0.

**After clicking Remove, one render pass displays a single product row alongside the outdated total.** Watch what happens when the customer removes the Hat:
1. Clicking Remove invokes `setItems` with an array containing only Socks.
2. React re-renders `App`. The product list displays only Socks priced at five dollars, but the `total` state variable still holds twenty-five dollars. The JSX produces an inconsistent screen with one five-dollar item and Total: $25.
3. React commits that mismatched state to the DOM, and only then executes the Effect, which calls `setTotal` with 5.
4. Calling the state setter forces a second render pass, finally updating the screen to Total: $5.

Even if browser painting optimizes away the visual flicker during rapid interactions, the underlying architectural cost remains severe. Every cart mutation triggers an extra rendering pass, and the codebase carries an unnecessary state variable, an extra setter, and a redundant Effect hook.

### The fix: calculate the total in the body

To eliminate the bug, delete the `total` state variable and its accompanying Effect. Compute `total` as a local constant directly inside the body of the cart component:

```jsx title="src/App.jsx" startLine="9"
export default function App() {
  const [items, setItems] = useState(initialItems);
  const [isOrdered, setIsOrdered] = useState(false);
  const ~total~ = items.reduce((sum, item) => sum + item.price, 0); // 25 for Socks and Hat, 5 after Hat is removed
```

The `.reduce` array method iterates through the product array, adding each item price to an accumulator initialized at zero (Lesson 27). Within the callback function, `sum` represents the running subtotal, and `item` represents the current product object.

The JSX retains its original markup, `<p>Total: ${total}</p>`. The component imports no longer require `useEffect`, simplifying the file. Now every state transition requires only a single render pass:
- **On the initial page load**, the first render pass calculates the sum and immediately displays Total: $25.
- **After clicking Remove**, the single render pass that removes the Hat row simultaneously calculates and displays Total: $5.

```page width=text caption="The cart after the user clicks Remove on Hat: the row and the total change in the same render."
heading: Your cart
line: Socks $5 [Remove]
line: Total: $5 | good
line: [Place order]
console: quiet
```

The React documentation outlines three distinct advantages of calculating derived values in the component body:
1. **It is faster**, because it eliminates cascading state updates that trigger redundant rendering passes.
2. **It is simpler**, because it removes an unnecessary state variable, an extra state setter, and an Effect hook.
3. **It is less error-prone**, because derived calculations can never fall out of sync with the underlying source data.

```tree caption="The cart's total set by an Effect vs. calculated in the body: the same page once it settles, and NOT the same thing."
Two ways to show the cart's total
- !`total` in state, set by an Effect [`useState` `setTotal` `useEffect`] | First render shows **`Total: $0`** | Every change of `items` costs **a second render**
- +`total` calculated in the body [`const total`] | First render shows **`Total: $25`** | Every change of `items` costs **one render**, and the total always matches the rows
```

### The linter finds this Effect for you

The React core team provides a dedicated ESLint plugin, `eslint-plugin-react-hooks`. Its `set-state-in-effect` rule flags any state setter invoked synchronously inside an Effect, such as `setTotal` in our original example. The rule warns developers against synchronous state updates in Effects because they trigger cascading re-renders that degrade rendering performance.

Remember the golden rule of derived values: if a value can be computed from existing state or props, calculate it directly inside the component body.

---

## PRINCIPLE | `sendOrder` in the click's handler: one click sends exactly one order

> [!PRINCIPLE]
> **Principle 2: The Click's Handler Sends the Order**
>
> *When code executes in response to a specific user action, such as clicking Place order, place that code inside the corresponding event handler. Do not place action logic inside an Effect that runs when a component mounts or when state changes.*
>
> A user click occurs once, and its event handler executes exactly once per interaction. An Effect executes whenever its host component mounts or when any of its listed dependencies update, long after the user action concluded. Dispatching an order from an Effect causes duplicate submissions in development under Strict Mode, and triggers accidental repeat orders in production whenever cart items change.
>
> **DO THIS:**
> ```jsx
> function handlePlaceOrder() {
>   ~sendOrder(items);~ // Runs once for each click on Place order
>   setIsOrdered(true);
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function OrderPlaced({ items }) {
>   useEffect(() => {
>     ~sendOrder(items);~ // **WRONG:** runs on every mount and every change of items
>   }, [items]);
>   return <p>Thank you! Your order is placed.</p>;
> }
> ```

### VS | `sendOrder` in the click's handler vs. in an Effect: a click happens once, an Effect can run many times

Recall how standard JavaScript handles button actions: the logic triggered by a click belongs inside the click event listener. In React, that listener corresponds to the event handler function. Compare where the submission logic lives in both versions:

```jsx title="sendOrder in the click's handler"
function handlePlaceOrder() {
  ~sendOrder(items);~ // Runs once for each click by the user
  setIsOrdered(true);
}
```

```jsx title="sendOrder in an Effect of OrderPlaced"
useEffect(() => {
  ~sendOrder(items);~ // Runs every time OrderPlaced mounts, and every time items changes
}, [items]);
```

In a production build, the initial button click outputs a single console log reading `Sending order: 2 items` in both versions. While they might appear equivalent on first inspection, their execution semantics are entirely different:
- **The event handler** runs strictly once for each concrete click performed by the user.
- **The Effect** runs whenever the confirmation component mounts, and again whenever its `items` prop receives a new array reference.

Developers often write this flawed Effect because the confirmation message only mounts after the user clicks the button. However, the Effect possesses no awareness of user actions. It only knows that its host component is currently being rendered onto the screen.

The React documentation emphasizes this distinction with a crucial observation: by the time an Effect runs, it no longer knows what user action took place. The same principle applies to purchasing an item. You want to place an order because the user clicked a button, not simply because a component appeared on the screen.

### In development, one click sends the order twice

**Beware: because the order request is tied to the mounting of the confirmation component, a single click submits the order twice in development.** Observe the console output after clicking Place order once:

```page width=text caption="The cart after one click on Place order, with the order sent by an Effect: in development, the Console shows the order twice."
heading: Your cart
line: Socks $5 [Remove]
line: Hat $20 [Remove]
line: Total: $25
line: Thank you! Your order is placed.
log: Sending order: 2 items | api.js:2
log: Sending order: 2 items | api.js:2
```

Follow the exact sequence of events that produces two order requests:
1. The user clicks Place order, prompting the click handler to call `setIsOrdered(true)`.
2. React re-renders `App`, replacing the checkout button with `<OrderPlaced items={items} />`.
3. React mounts `OrderPlaced` and executes its Effect. The console outputs `Sending order: 2 items`.
4. In development, Strict Mode unmounts and remounts `OrderPlaced` to test its lifecycle robustness. Because the Effect provides no cleanup function, the setup code executes a second time, submitting a duplicate order request to the server.

The official documentation notes that this duplicate execution in development exposes a fundamental flaw in application architecture. The duplicate console log is not an artificial quirk of Strict Mode; it reveals that the network request was incorrectly attached to component visibility rather than user intent.

### In production, a Remove sends another order

In a production deployment, Strict Mode remounting is disabled, so the console shows only one log after the initial click. Does that make the implementation safe for production? Absolutely not.

The product list remains rendered on the page above the confirmation banner. If the customer clicks Remove on the Hat item after placing the order, the `items` state updates. Because the confirmation component lists `[items]` as a dependency, React detects the updated array. It re-runs the Effect and submits an unauthorized second order containing only one product. Nobody clicked Place order a second time. Here is the console output showing the extra order:

```page width=text caption="The cart after one click on Place order and then one click on Remove on Hat, with the order sent by an Effect: the Remove sends one more order."
heading: Your cart
line: Socks $5 [Remove]
line: Total: $5
line: Thank you! Your order is placed.
log: Sending order: 2 items | api.js:2
log: Sending order: 2 items | api.js:2
log: Sending order: 1 items | api.js:2
```

The React documentation summarizes the real-world consequence succinctly: you would never want your application to charge a customer twice for the same purchase.

### VS | An Effect that waits for `isOrdered` vs. the click's handler: one click works, a Remove still sends a second order

Some developers attempt to work around this problem by hoisting the Effect into the parent component, making it watch for `isOrdered` to become true:

```jsx title="sendOrder in an Effect of App that waits for isOrdered"
useEffect(() => {
  if (~isOrdered~) { // **WRONG:** the order now follows a state value, not the click
    sendOrder(items);
  }
}, [isOrdered, items]);
```

With this modification, a single click produces only one console log even in development. Because the parent component was already mounted when `isOrdered` changed to true, Strict Mode does not unmount or remount the parent.

However, the underlying defect remains unaddressed: the network request still follows a state transition rather than the user interaction. If the user clicks Remove after placing an order, `items` updates while `isOrdered` remains true. The Effect detects the dependency update and fires another order to the server without user permission.

The React documentation classifies this anti-pattern as event-specific logic placed inside an Effect. Logic that should execute only in response to a specific user interaction belongs exclusively in that interaction's event handler.

### The fix: move `sendOrder` into the click's handler

Create a dedicated event handler named `handlePlaceOrder`, invoke `sendOrder` directly inside it, and attach that handler to the button:

```jsx title="src/App.jsx" startLine="19"
  function handlePlaceOrder() {
    ~sendOrder(items);~ // 1. Sends the order, once for this click
    setIsOrdered(true); // 2. Then shows the thank-you line
  }
```

```jsx title="src/App.jsx" startLine="35"
      {isOrdered ? (
        ~<OrderPlaced />~ /* No props: the thank-you line only shows text now */
      ) : (
        <button ~onClick={handlePlaceOrder}~>Place order</button> /* The click runs handlePlaceOrder */
      )}
```

The parent component now imports `sendOrder` directly from the API module. Because the event handler accesses `items` from its own scope, the confirmation component requires no props. It loses its Effect entirely and simplifies into a pure presentation component:

```jsx title="src/components/OrderPlaced.jsx"
export default function OrderPlaced() {
  return ~<p>Thank you! Your order is placed.</p>~; // The page shows the same line as before
}
```

A single button click now dispatches exactly one order across both development and production environments. Removing an item later triggers no network traffic whatsoever:

```page width=text caption="The cart after one click on Place order, with the order sent by the click's handler: the Console shows the order once."
heading: Your cart
line: Socks $5 [Remove]
line: Hat $20 [Remove]
line: Total: $25
line: Thank you! Your order is placed. | good
log: Sending order: 2 items | api.js:2
```

### A ref that blocks the second run is not a fix

In Lesson 32, we observed a common workaround where developers use a mutable ref to track whether an Effect has already executed, blocking duplicate runs. In our shopping cart, applying that ref trick would hide the second console log in development and ignore subsequent item removals. The user interface would appear repaired.

However, suppressing the symptom with a ref does not fix the underlying design error. The network request remains conceptually coupled to component mounting rather than user intent. If the component ever unmounts and remounts elsewhere in the application, the ref resets and the order fires again. The only correct solution is to remove the Effect and trigger the action from the event handler.

```tree caption="Three places for sendOrder: an Effect of the thank-you line, an Effect that waits for isOrdered, and the click's handler."
Where `sendOrder` runs
- !In an Effect of `OrderPlaced` [`useEffect`] | Runs on **every mount** of the thank-you line and **every change of `items`** | **Twice** in development, and **again after a Remove**
- !In an Effect of `App` that waits for `isOrdered` [`isOrdered`] | Runs whenever **`isOrdered` is true and `items` changes** | A Remove after the order **sends a second order**
- +In the click's handler [`handlePlaceOrder`] | Runs **once for each click** by the user | **One order**, in development and in production
```

Remember the golden rule of user actions: if an operation occurs because the user clicked, submitted, or pressed a key, execute it directly inside the event handler.

---

## PRINCIPLE | `useEffect` for `logVisit`: the visit is logged every time the cart appears on the screen

> [!PRINCIPLE]
> **Principle 3: An Effect Logs the Visit**
>
> *When code must execute because a component became visible, and it communicates with an external system outside React like an analytics service, keep it inside an Effect. Executing twice in development is not a reason to remove it.*
>
> Logging a page view occurs because the cart component was displayed to the user, meaning no individual button click could possibly host the logic. In development, Strict Mode runs the Effect setup a second time to verify lifecycle safety, producing two console entries. That duplicate verification changes nothing the user sees, and production environments execute the Effect exactly once.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   ~logVisit('cart');~ // Runs because the cart is on the screen
> }, []);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const didLog = useRef(false);
> useEffect(() => {
>   if (~didLog.current~) return; // **WRONG:** blocks the second run instead of letting it run twice in development
>   didLog.current = true;
>   logVisit('cart');
> }, []);
> ```

Having removed two incorrect Effects, does that imply all Effects should be avoided? Not at all. Some operations belong squarely inside an Effect.

E-commerce applications routinely track how many customers view the checkout cart. Every time the cart component appears on the screen, the application sends an analytics beacon to a tracking server. In our code, `logVisit` represents that analytics request.

No individual button click triggers this visit beacon. The presence of the cart on the screen is the sole reason for the operation. The official React documentation makes the same point for forms: the fundamental reason to dispatch an analytics event is that the form was displayed.

Because the operation is caused by visual display rather than user interaction, it belongs in an Effect. Passing an empty dependency array ensures the Effect runs only after the initial component mount (Lesson 32):

```jsx title="src/App.jsx" startLine="10"
export default function App() {
  const [items, setItems] = useState(initialItems);
  const [isOrdered, setIsOrdered] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    ~logVisit('cart');~ // Runs because the cart is on the screen
  }, ~[]~); // Empty array: runs after the first mount only
```

The component file imports `useEffect` from React, and imports `logVisit` alongside the order helper from the API module.

### VS | The visit in an Effect vs. the order in an Effect: both print twice, only the order hurts the user

In development, the message `Visit: cart` prints twice when the page loads, mirroring the duplicate logs observed with the order Effect in Principle 2:

```page width=text caption="The cart on the first load in development: the visit Effect prints twice."
heading: Your cart
line: Socks $5 [Remove]
line: Hat $20 [Remove]
line: Total: $25
line: [Place order]
log: Visit: cart | api.js:6
log: Visit: cart | api.js:6
```

Strict Mode mounts the application a second time in development to test lifecycle consistency. Because the visit logger provides no cleanup function, the setup logic executes again and logs a second visit. In production, the console logs the visit exactly once.

Although both Effects execute twice in development, their real-world impact differs fundamentally:
- **The visit beacon** is caused by the component appearing on the screen. Logging an extra visit in a local developer console changes nothing visible to the user and charges no money.
- **The order request** is caused by a user action. Submitting an extra order charges the customer twice and ships duplicate merchandise.

The React documentation explicitly advises developers to keep analytics logging inside an Effect without alteration.

The rationale is straightforward: running an analytics call twice in development produces no user-visible behavior difference, and production builds will never produce duplicate logs.

Furthermore, duplicate logs in local development are irrelevant to real metrics. Analytics backends filter out development environments, preventing local test runs from skewing production statistics. There is no reason to block the second run with a ref hack, and no reason to extract the call from the Effect.

The documentation encapsulates the entire decision framework in two clear sentences: if logic is triggered by a specific user interaction, keep it in that interaction's event handler. If logic is caused by the user seeing the component on the screen, keep it in an Effect.

```tree caption="Two Effects that print twice in development: the visit stays in its Effect, and the order moves to the click's handler."
Two Effects that run twice in development
- +`logVisit` in an Effect [`logVisit`] | Runs because **the cart is on the screen** | An extra visit **changes nothing the user sees**: it stays
- !`sendOrder` in an Effect [`sendOrder`] | Runs, but it was caused by **a click** | An extra order **charges the user twice**: it moves to the handler
```

Remember: reserve Effects exclusively for operations caused by the component appearing on the screen.

---

## All 3 Principles Together

### The complete files

The application entry point mounts the root component inside `<StrictMode>`:

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  ~<StrictMode>~ {/* In development: mounts twice, so an Effect with no cleanup runs twice */}
    <App />
  </StrictMode>
);
```

The main cart component computes the total directly in its body, dispatches the order from the button click handler, and tracks the page view inside an Effect:

```jsx title="src/App.jsx"
import { useState, useEffect } from 'react';
import OrderPlaced from './components/OrderPlaced.jsx';
import { sendOrder, logVisit } from './api.js';

const initialItems = [
  { id: 1, name: 'Socks', price: 5 },
  { id: 2, name: 'Hat', price: 20 },
];

export default function App() {
  const [items, setItems] = useState(initialItems);
  const [isOrdered, setIsOrdered] = useState(false);
  const ~total~ = items.reduce((sum, item) => sum + item.price, 0); // Principle 1: calculated in the body

  useEffect(() => {
    ~logVisit('cart');~ // Principle 3: runs because the cart is on the screen
  }, []);

  function handleRemove(id) {
    setItems(items.filter(item => item.id !== id));
  }

  function handlePlaceOrder() {
    ~sendOrder(items);~ // Principle 2: runs once for each click on Place order
    setIsOrdered(true);
  }

  return (
    <main>
      <h1>Your cart</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} ${item.price} <button onClick={() => handleRemove(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p>Total: ${total}</p>
      {isOrdered ? (
        <OrderPlaced />
      ) : (
        <button onClick={handlePlaceOrder}>Place order</button>
      )}
    </main>
  );
}
```

The confirmation component renders the completion message cleanly without managing props or Effects:

```jsx title="src/components/OrderPlaced.jsx"
export default function OrderPlaced() {
  return <p>Thank you! Your order is placed.</p>;
}
```

The API utility module provides the simulated server request handlers:

```js title="src/api.js"
export function sendOrder(items) {
  console.log('Sending order: ' + items.length + ' items');
}

export function logVisit(page) {
  console.log('Visit: ' + page);
}
```

When a developer loads the cart in development and clicks Place order, the console displays two visit entries from Strict Mode, followed by exactly one order submission:

```page width=text caption="The finished cart in development after one click on Place order: two visit lines from Strict Mode, and one order."
heading: Your cart
line: Socks $5 [Remove]
line: Hat $20 [Remove]
line: Total: $25 | good
line: Thank you! Your order is placed. | good
log: Visit: cart | api.js:6
log: Visit: cart | api.js:6
log: Sending order: 2 items | api.js:2
```

### How React renders the cart and runs its one Effect

On the initial page load, React executes `App` once, renders the complete cart with the correct total into the DOM, and fires the single visit Effect. When the customer clicks Place order, the event handler sends the network request before React renders the confirmation message:

```tree dir=right caption="The order of events in the finished cart, from the first load to the thank-you line."
From the first load to the thank-you line
- +1. Render [`App`] | React calls `App`; **`total` is 25** | The JSX returns **`Total: $25`** at once
- +2. Commit | React puts the rows, the total, and the button **into the DOM**
- +3. Effect [`logVisit`] | React runs the setup | The Console prints **`Visit: cart`**, twice in development
- +4. Click [`handlePlaceOrder`] | The user clicks **Place order** | `sendOrder` prints **`Sending order: 2 items`** once, then `setIsOrdered` asks for a render
- +5. Render and commit [`OrderPlaced`] | React calls `App`, then `OrderPlaced` | The thank-you line **replaces the button**
```

### Where the code runs, and what the user gets

| Where the code runs | What the user gets | Why |
| :--- | :--- | :--- |
| **`total` in state, set by an Effect** | The right total, one render late: `Total: $0` on the first render | The Effect runs after the commit, and its setter starts another render |
| **`total` calculated in the body** | The right total in the same render as the rows | The body runs again on every change of `items` |
| **`sendOrder` in an Effect of `OrderPlaced`** | Two orders in development, and another order after a Remove | The Effect runs on every mount of the thank-you line and every change of `items` |
| **`sendOrder` in an Effect that waits for `isOrdered`** | A second order after a Remove that follows the order | The Effect runs whenever `items` changes while `isOrdered` is `true` |
| **`sendOrder` in `handlePlaceOrder`** | One order for each click | The handler runs once for each click by the user |
| **`logVisit` in an Effect** | Nothing different on the page; two visit lines in development only | The visit is caused by the cart being on the screen |

Here is the core summary of this lecture: **An Effect is an escape hatch for synchronizing with systems outside React. If a value can be calculated from props or state, compute it directly in the component body. If an action is caused by a user interaction, execute it inside that event handler.**

---

## For the Interview

> **The Interview Question:** When do you not need an Effect, and what replaces it?

### How to Answer Clearly in 30 Seconds

"Effects are an escape hatch designed to synchronize a component with systems outside React. When no external system is involved, you almost certainly do not need an Effect. I apply a simple diagnostic test by asking why the code needs to execute:
1. **To compute a value derived from props or state**, such as an order total: calculate it directly inside the component body during render. Storing derived values in state synchronized by an Effect wastes an entire render pass with stale data before triggering a second render.
2. **Because the user performed an action**, such as clicking Place order: place the code inside that user event handler. Effects execute after rendering completes and cannot discern which user action took place. Submitting requests from Effects causes duplicate submissions in development and accidental re-submissions when dependencies change.
3. **Because the component appeared on the screen**, such as logging page impressions: keep the logic inside an Effect. Executing twice under Strict Mode in development is expected behavior that causes no production harm.

To prevent accidental derived-state anti-patterns, the `set-state-in-effect` ESLint rule flags any state setters called synchronously within an Effect."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"What if the calculation is slow? Shouldn't it go in an Effect then?"**
   No. An expensive calculation should be cached using `useMemo`, never moved into an Effect. The official documentation recommends adding `useMemo` instead of `useEffect` to cache expensive computations. In practice, most computations are not slow unless you are transforming or filtering thousands of objects. Lesson 56 covers `useMemo` in detail, and the modern React Compiler covered in Lesson 63 automatically memoizes expensive calculations during compilation.
2. **"How do you reset a child's state when a prop changes, without an Effect?"**
   Pass a unique `key` prop to the child component (Lesson 25). For example, rendering `<Profile userId={userId} key={userId} />` instructs React to treat different user identifiers as distinct component instances, automatically resetting internal state to its initial values. Using an Effect to reset state variables when a prop changes forces an unnecessary render pass with stale state before re-rendering with new state. If you only need to reset part of the state, consider storing less state and calculating values during render instead.
3. **"Should a fetch move to an event handler too?"**
   Usually not. The React documentation explicitly advises against moving page-level data fetching into event handlers. The displayed data must remain synchronized with the current query parameters as long as the component is visible on the screen, regardless of how those parameters changed. Data fetching belongs in an Effect with an appropriate cleanup function to ignore stale responses from network race conditions (Lesson 33). The same diagnostic test applies: the data is required because the component is displayed on the screen.

```tree dir=right caption="Interview comparison: what replaces an Effect in each case, and what stays an Effect."
What replaces an Effect
- +A value calculated from props or state [`const total`] | **Calculate it in the body** | A slow one is cached with **`useMemo`**, not an Effect
- +Code caused by one interaction [`handlePlaceOrder`] | **Put it in the event handler** | It runs **once for each click**
- +A child's state that must start over [`key`] | **Give the child a different `key`** | React **starts its state over**
- +Code caused by the component being on the screen [`useEffect`] | **Keep the Effect** | A visit log or a fetch **stays**, and may run twice in development
```
