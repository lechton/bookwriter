# Lecture 17: Updating Objects in State
> INTERVIEW QUESTION | ❱ CORE | How do you update an object in state without mutating it?

---

## The Collision Between In-Place Mutation and Identity-Based Reconciliation

### In-Place Mutation vs. Fresh Object Replacement

When state holds a primitive value like the number `0`, updating it is straightforward: calling `setX(5)` replaces the number. In JavaScript, primitive numbers, strings, and booleans are physically immutable: you cannot change the number `0` from the inside. Calling `setX` simply replaces the old number with `5`:

```jsx title="Replacing a number in state"
const [x, setX] = useState(0);

function handleClick() {
  ~setX(5);~ // Replaces 0 with 5: the number 0 itself never changed
}
```

JavaScript objects are completely different. An object is a mutable container in memory whose properties can be modified in place.

Look at what happens when a click handler attempts to update a user's name by mutating the existing object, compared with passing a brand-new object to the setter.

First, look at modifying `user.name` inside the existing object and passing that same object back to the setter:

```jsx title="In-place mutation on existing object"
const [user, setUser] = useState({ name: 'John' });

function handleMutate() {
  ~user.name = 'Alice';~ // 1. Changes the name property inside the existing user object
  ~setUser(user);~ // 2. Hands that exact same user object back to React: page stays on "John"!
}
```

Now compare that with building a brand-new object and passing the new object to the setter:

```jsx title="Passing a brand-new object reference"
const [user, setUser] = useState({ name: 'John' });

function handleReplace() {
  ~setUser({ name: 'Alice' });~ // Creates a brand-new object and hands it to React: page shows "Alice"!
}
```

In the first approach, clicking the button leaves the screen frozen on **`John`** with zero console errors. In the second approach, clicking the button immediately updates the screen to **`Alice`**!

Here is why developers get trapped by this difference:
1. First, changing `user.name` and passing `user` to the setter looks like passing an updated object, and both hold `'Alice'`, but they are not the same thing. In-place mutation hands React the exact same object reference it already holds in state. Fresh replacement hands React a brand-new object reference in memory.
2. Second, calling the setter executes with zero errors in the Console, creating a false impression of success. The mutation succeeded in JavaScript memory, but React skipped the render because the object reference never changed.
3. Third, when an object has several fields, spreading the old object with `...user` and typing every unchanged field by hand into a new object are the exact same thing. Both build a brand-new object reference that preserves existing fields while updating the target field.

Three core terms define how React handles objects in memory:
1. **Mutation**: modifying a property inside an existing object reference in place. The internal properties change, but the memory address stays identical.
2. **Identity check**: React compares old state and new state using `Object.is` (as seen in Lesson 13). For objects, `Object.is` checks only the memory address on the outside rather than reading the properties inside. Handing React the same object reference causes it to skip reconciliation, while handing React a new object reference triggers a re-render.
3. **Read-only**: treating state as immutable records, like printed store receipts that you never scribble over. When an order changes, the cashier prints a fresh receipt. In React, you read from the state object and replace it with a fresh object whenever any field changes.

```tree caption="What happens when you mutate the existing state object vs. when you pass a brand-new object to the setter."
Two ways to update `user` in state
- !In-place mutation: mutate `user.name` and pass `user` | Changes the field inside the **same object** | `Object.is` sees the **same object** and **skips the render**
- +Fresh replacement: pass a brand-new object `{ name: 'Alice' }` | Creates a **new object** with the updated field | `Object.is` sees a **different object** and **re-renders the page**
```

### What Is at Stake: The Delayed Mutation Glitch on the Order Card

What is at stake is subtle, silent UI desynchronization: state updates that fail to appear when clicked, but suddenly explode onto the screen during an unrelated interaction.

To see how this plays out on a real website, we will build the `Your Order` card of an online shop. An order for one item naturally groups several fields: the item name, quantity, gift wrap, customer name, delivery details, and courier note. Keeping those related fields together in one `order` state object is clean and natural.

When the page first loads, the order card shows one coffee mug with gift wrap turned off. Below those lines sit a `+1` button to add another mug and an `Add gift wrap` button.

The page displays broken behavior: clicking `+1` leaves the screen frozen at `Quantity: 1` with zero console errors, until an unrelated click suddenly triggers a delayed jump to `Quantity: 3`.

**In-place mutations remain invisible because React skips rendering when handed the existing object, but the mutated memory persists and leaks onto the screen during the next unrelated re-render.**
1. The shopper clicks `+1` once to buy two mugs. The card remains frozen on `Quantity: 1`.
2. Assuming the click failed to register, the shopper clicks `+1` a second time. The card still says `Quantity: 1`, and the console reports zero errors.
3. Next, the shopper clicks `Add gift wrap`.
4. The instant the gift wrap checkbox turns to `Yes`, the quantity suddenly jumps from one straight to `3`!

```tree caption="What the shopper expects when clicking +1 twice vs. what happens when +1 mutates the existing order object."
Clicking `+1` twice and then clicking `Add gift wrap`
- +What the shopper expects | First `+1` shows **`Quantity: 2`**, second `+1` shows **`Quantity: 3`** | Clicking `Add gift wrap` changes only **`Gift wrap: Yes`**
- !What happens when `+1` mutates `order` | Both `+1` clicks leave the screen stuck on **`Quantity: 1`** | Clicking `Add gift wrap` re-renders and **jumps straight to `Quantity: 3`!**
```

### Architectural Patterns: Four Ways to Produce a New State Object

Whenever you update an object in state, your goal is always to hand the setter a brand-new object reference. Depending on the shape of your object and how your handler runs, there are four ways to build that new object:

```jsx title="Four ways to build a new object for a state setter"
function OrderWays() {
  const [order, setOrder] = useState({ item: 'Coffee mug', quantity: 1, giftWrap: false });

  function handleByHand() {
    ~setOrder({ item: order.item, quantity: order.quantity + 1, giftWrap: order.giftWrap });~ // 1. Every field written by hand
  }

  function handleSpread() {
    ~setOrder({ ...order, quantity: order.quantity + 1 });~ // 2. Object spread ... copies all fields, then updates quantity
  }

  function handleQueued() {
    ~setOrder(o => ({ ...o, quantity: o.quantity + 1 }));~ // 3. Spread inside an updater when queueing multiple updates
  }
}
```

Here is when each of the four patterns fits in production code:
1. **Writing every field by hand**: fits when the object has only one or two fields, or when every field is built fresh on the spot from external inputs.
2. **Spreading the old object with `...` and overriding the changed field**: the standard everyday tool for state objects with multiple fields. When a field sits inside a nested object, you spread once at each level on the path to the change.
3. **Spreading inside an updater function**: fits when a single event queues multiple updates to the same state object before the next render (as seen in Lesson 16). In JavaScript, curly braces right after an arrow `=>` normally define a function block. Wrapping the object in parentheses, `({ ...o, quantity: o.quantity + 1 })`, tells JavaScript to return the object literal directly.
4. **Using the Immer helper library**: an optional library for deeply nested state structures that builds immutable copies from draft mutations. Another standard alternative for deep state is flattening the data structure into separate state variables.

```tree caption="The four ways to produce a new state object in React and when each way fits."
Four ways to give `setOrder` a new object
- +1. Write every field by hand | Best when the object has **only 1 or 2 fields** or is built fresh | Every field is typed out explicitly
- +2. Object spread `{ ...order, field: value }` | Best for **most state objects** in daily coding | Copies top-level fields automatically; spread **once per level** if nested
- +3. Spread inside an updater function | Best when **several updates to `order`** are queued in one event | Wrap the object in **parentheses** after `=>`
- +4. Immer helper library | Optional tool for **deeply nested state** | Records draft changes and builds the nested copies for you
```

### Project Architecture: The Online Shop Order Card

Our shop project uses four files. In the entry file, React mounts `App` inside `<StrictMode>`. Then our main file renders the `OrderCard` component from the `components` folder:

```files title="order-card: File Explorer" caption="How the files of our online shop order card sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and imports `OrderCard` from `./components/OrderCard.jsx`
  components/
    OrderCard.jsx | state | Holds the `order` state object and renders the `Your Order` card
```

### The Four Invariants of Object State Updates

**PRINCIPLES:** React never inspects internal object properties during reconciliation. Instead, React checks whether the object passed to the setter has a different reference identity from the current state. Four architectural invariants follow directly from that mechanism:
1. **Principle 1: Mutating Keeps the Same Object Reference, While Replacing Triggers a Render**: Modifying a property on an existing state object preserves its memory address, causing React's `Object.is` check to skip rendering. To trigger a render, allocate a fresh object reference and pass it to the setter.
2. **Principle 2: Object Spread Copies Existing Fields, and Trailing Overrides Determine State**: A state setter replaces the existing state object rather than merging properties. Spreading `...order` first duplicates all top-level keys, and writing the updated field after the spread ensures the trailing property wins.
3. **Principle 3: Spread Is Shallow: Nested Objects Require Copies at Every Level**: In JavaScript, nested objects are independent memory allocations linked by pointers. Spreading only the top-level object leaves nested pointers shared, so modifying nested state requires creating a fresh object at every level along the path.
4. **Principle 4: Computed Property Names: Synchronizing Multiple Inputs With a Single Handler**: Binding each input tag to a matching `name` attribute allows one shared change handler to evaluate `[e.target.name]` dynamically, synchronizing multiple fields without duplicated code.

Here is the complete map of those four principles before we walk through each one:

| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |
| :--- | :--- | :--- | :--- |
| **Principle 1** | **Reference Identity vs. Mutation** | Mutating a state object and passing it to the setter leaves the screen frozen with zero Console errors, until an unrelated state update suddenly reveals the change. | Treat every object in state as read-only; create a new object with the updated value and pass that new object to the setter. |
| **Principle 2** | **Object Spread and Evaluation Order** | Omitting a field from a new state object erases that field on screen, and placing the spread after the changed field overwrites the new value with the old one. | Spread the existing object first and write the updated property after the spread so the new value wins. |
| **Principle 3** | **Shallow Copies vs. Nested Pointers** | Spreading only the top object and mutating a nested field silently corrupts earlier snapshots and shared starting objects such as a reset state. | Because spread copies only one level deep, create a new copy of every nested object along the path to the changed field. |
| **Principle 4** | **Dynamic Form Key Synchronization** | Writing separate handlers by copy and paste updates the wrong field, and an input whose name does not match state refuses to accept typing. | Give each input a `name` attribute matching its state field, and read that name in brackets so one handler updates whichever field changed. |

---

## 1. Principle 1: Mutating Keeps the Same Object Reference, While Replacing Triggers a Render

### Primitive Value Replacement vs. Object Reference Mutability

React detects state changes through reference identity rather than deep object inspection: mutating an existing object preserves its memory address, causing React to skip rendering, while allocating a fresh object forces a re-render.

When state holds a primitive value like the number `0`, you cannot reach inside the number and mutate it. The only way to update the state is to pass a completely different number, such as `5`, to the setter.

JavaScript objects are mutable reference containers. Compare two ways a developer might attempt to change a user's name in state:

```jsx title="In-place mutation vs. fresh object replacement"
const [user, setUser] = useState({ name: 'John' });

function handleMutate() {
  ~user.name = 'Alice';~ // Way A: mutates the existing user object in place
  ~setUser(user);~ // Passes that SAME object back to setUser: screen stays on "John"!
}

function handleReplace() {
  ~setUser({ name: 'Alice' });~ // Way B: passes a BRAND-NEW object to setUser: screen shows "Alice"!
}
```

Here are three subtle confusions that make in-place mutation such a frequent defect:
1. First, Way A and Way B look like identical updates because both assign `'Alice'` to `name`, but they are not the same thing. Way A modifies the interior of the existing object while preserving its memory address. Way B allocates a brand-new object in memory and hands that new address to React.
2. Second, passing a new primitive number like `5` always updates the screen, which tempts developers to assume passing `user` will behave the same way, but it is not the same thing. A new number is always a different value, whereas a mutated object reference points to the identical object in memory.
3. Third, `setUser(user)` executes with zero errors in the Console, creating the false illusion that the update succeeded, but it never reaches the screen.

To see why React ignores Way A, look at how JavaScript's `Object.is` compares two objects (as seen in Lesson 13):

```js title="Plain JavaScript: how Object.is compares a mutated object vs. a new object"
const user = { name: 'John' };

user.name = 'Alice';
console.log(~Object.is(user, user)~); // 1. true: still the exact same object in memory!

const nextUser = { name: 'Alice' };
console.log(~Object.is(user, nextUser)~); // 2. false: two separate objects in memory!
```

For two objects, `Object.is` never looks inside the curly braces to compare properties. It only checks whether both arguments point to the identical address in memory. When you mutate a property inside `user` and compare the object with itself, `Object.is` returns `true`. When you compare `user` with a newly allocated object, `Object.is` returns `false`.

```tree caption="How Object.is compares a mutated object against itself vs. against a brand-new object."
What `Object.is` checks when you call `setUser`
- !Way A: Mutate `user.name` and pass `user` | Both old state and new value point at **the exact same box** | `Object.is` returns **`true`**, so React **skips the render**
- +Way B: Pass a new object `{ name: 'Alice' }` | Old state and new value are **two separate boxes** in memory | `Object.is` returns **`false`**, so React **renders the component**
```

### The In-Place Mutation Trap: The Silent Render Bailout

Now let us build our online shop order card and watch this bailout happen in our project.

First, our main application file imports the order card component and renders its tag:

```jsx title="src/App.jsx" startLine="1"
import ~OrderCard~ from './components/OrderCard.jsx'; // 1. Import OrderCard from the components folder

export default function App() {
  return <OrderCard />;
}
```

Inside the order card file, we store the order in state with its starting item, quantity, and gift wrap setting. Below that, the plus-one handler mutates the existing object and hands it back to the setter, while the gift wrap handler builds a brand-new object:

```jsx title="src/components/OrderCard.jsx" startLine="1"
import { useState } from 'react';

export default function OrderCard() {
  const [order, setOrder] = useState({
    item: 'Coffee mug',
    quantity: 1,
    giftWrap: false,
  });

  function handleAddOne() {
    ~order.quantity = order.quantity + 1;~ // **WRONG:** mutates the existing order object in place!
    ~setOrder(order);~ // **WRONG:** passes the exact same order object back, so React skips the render!
  }

  function handleGiftWrap() {
    ~setOrder({ item: order.item, quantity: order.quantity, giftWrap: true });~ // Creates a new object
  }
```

Below the two handlers, the component returns the card heading, the three order lines, the `+1` button, and the `Add gift wrap` button:

```jsx title="src/components/OrderCard.jsx" startLine="19"
  return (
    <section className="card">
      <h1>Your Order</h1>
      <p>Item: {order.item}</p>
      <p>Quantity: {order.quantity}</p>
      <p>Gift wrap: {order.giftWrap ? 'Yes' : 'No'}</p>
      <button onClick={handleAddOne}>+1</button>
      <button onClick={handleGiftWrap}>Add gift wrap</button>
    </section>
  );
}
```

The screen fails to update: the quantity line stays stuck at `Quantity: 1` despite multiple user clicks, while the browser console remains completely silent.

**React's setter checks object identity via Object.is: passing the mutated object back is a no-op that skips rendering until an unrelated update renders the accumulated change.**
1. When the page loads, the card displays one coffee mug and `Gift wrap: No`.
2. The shopper clicks `+1`. The card on the screen still says `Quantity: 1`.
3. The shopper clicks `+1` a second time. The card still says `Quantity: 1`, and the Console panel shows zero warnings or errors.
4. Now the shopper clicks `Add gift wrap`.
5. The gift wrap line changes to `Gift wrap: Yes`, and at that exact moment the quantity jumps straight to `Quantity: 3`!

### The Delayed Render Explosion: How Unrelated Updates Flush Hidden Mutations

React's setter compares object references using `Object.is`. When `handleAddOne` runs, it mutates the existing object and hands that exact reference to `setOrder`.

**Mutating a property changes internal state but preserves object identity: Object.is returns true, causing React to immediately abort reconciliation.**
1. The first line of `handleAddOne` reaches inside the existing `order` object and raises its quantity from one to two.
2. The second line passes `order` to `setOrder`, which points to that exact same object reference in memory.
3. React compares the object reference with current state using `Object.is`. Because both sides are the very same reference, `Object.is` returns `true`.
4. React aborts reconciliation and skips rendering the card. Even if React calls the component function once during internal scheduling, it never commits DOM updates. After two clicks on `+1`, the screen still shows `Quantity: 1` while `order.quantity` in memory is already three.

Shorthand operators like `order.quantity++` and `order.quantity += 1` mutate the existing reference in the exact same way. If you mutate `order.quantity` without calling `setOrder` at all, React receives no notification that state changed. The official React documentation compares that to trying to change your meal order after you have already eaten the meal.

**Fresh object allocation triggers reconciliation: creating a new object causes Object.is to return false, re-rendering the component and exposing all prior in-place mutations at once.**
1. After the two earlier clicks on `+1`, `order.quantity` inside the existing object in memory is already `3`.
2. Clicking `Add gift wrap` invokes `handleGiftWrap`, which creates a brand-new object literal and copies `order.quantity`, placing the number three into the new object.
3. When `setOrder` receives that newly allocated object, `Object.is` compares the old reference with the new reference and returns `false`.
4. React renders the card with the new object, flushing both `Quantity: 3` and `Gift wrap: Yes` onto the screen simultaneously. This delayed flushing illustrates why mutation is treacherous: an unrelated state update can suddenly expose hidden bugs that were dormant in memory.

```tree dir=right caption="How two mutating clicks on +1 stay hidden inside the same object until Add gift wrap passes a brand-new object."
Why `Quantity` stayed at `1` and then jumped to `3`
- !1. First and second clicks on `+1` [`order.quantity` becomes `2`, then `3`] | Mutates the **same `order` object** and passes it to `setOrder` | `Object.is` is **`true`**: screen stays on **`Quantity: 1`**
- +2. Click on `Add gift wrap` [builds a **brand-new object**] | Copies `order.quantity`, which is already **`3`**, and sets `giftWrap: true` | `Object.is` is **`false`**: React renders **`Quantity: 3`** and **`Gift wrap: Yes`** together!
```

### Reference Replacement: Enforcing Component Re-Renders with Fresh Objects

Although JavaScript objects are mutable by design, you must treat state objects as immutable values in React, just like numbers, booleans, and strings. Instead of mutating an existing object, always allocate a fresh replacement.

Passing a brand-new object reference to `setOrder` accomplishes two things:
1. It replaces the state record with the new object.
2. It notifies React that `Object.is` evaluated to `false`, scheduling a re-render.

We fix the plus-one handler by allocating and passing a brand-new object literal on every click:

```jsx title="src/components/OrderCard.jsx" startLine="10"
  function handleAddOne() {
    ~setOrder({ item: order.item, quantity: order.quantity + 1, giftWrap: order.giftWrap });~ // Passes a brand-new object: React replaces order and re-renders!
  }
```

Saving the file and reloading the page restores normal rendering. Every click on `+1` hands `setOrder` a new object reference, incrementing the quantity immediately on screen:

::: row caption="Clicking +1 twice when handleAddOne mutates the existing object vs. when handleAddOne passes a brand-new object."
::: col title="Mutating order in handleAddOne" tag="same object: screen stays on 1" tone=bad
```page size=mini
heading: Your Order
line: Item: Coffee mug
line: Quantity: 1 | bad
line: Gift wrap: No
row: +1; Add gift wrap
console: quiet
```
After two clicks on `+1`, the quantity in memory is three, yet `Object.is` saw the same object and skipped both renders.
:::
::: col title="Passing a New Object in handleAddOne" tag="new object: renders 2, then 3" tone=good
```page size=mini
heading: Your Order
line: Item: Coffee mug
line: Quantity: 3 | good
line: Gift wrap: No
row: +1; Add gift wrap
console: quiet
```
Each click on the plus-one button hands `setOrder` a brand-new object, so `Object.is` returns false and React renders the new quantity.
:::
:::

> [!PRINCIPLE]
> **Principle 1: Same Object vs. New Object: Treat State Objects as Read-Only and Always Replace Them**
>
> *Never mutate a property on an existing state object; always create a brand-new object with the updated property and pass that new object to the state setter.*
>
> When you call a state setter, React checks whether state changed by comparing the old value and the new value with `Object.is`. For objects, `Object.is` never looks inside the curly braces. It only checks whether both sides are the exact same object in memory. If you change a property inside the existing state object and hand that same object back to the setter, `Object.is` returns `true` and React skips the render. Your change sits hidden in memory until some other state update triggers a render and makes it jump onto the screen all at once. Passing a brand-new object makes `Object.is` return `false`, so React replaces the state and re-renders right away.
>
> **DO THIS:**
> ```jsx
> function handleAddOne() {
>   ~setOrder({ item: order.item, quantity: order.quantity + 1, giftWrap: order.giftWrap });~ // New object: Object.is is false, so React re-renders
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleAddOne() {
>   ~order.quantity = order.quantity + 1;~ // **WRONG:** mutates the existing state object in place!
>   ~setOrder(order);~ // **WRONG:** passes the same object back, so Object.is is true and React skips the render!
> }
> ```

---

## 2. Principle 2: Object Spread Copies Existing Fields, and Trailing Overrides Determine State

### Automatic Field Duplication: Object Spread vs. Manual Property Copying

State setters in React replace the state object completely rather than merging properties: to update one field without losing the rest, spread `...order` first to duplicate existing properties, then write the updated field after the spread so the trailing value wins.

Typing each unchanged property by hand works for small objects with three properties. When an object holds five, eight, or ten properties, manual duplication clutters code and invites omissions.

Suppose we have a `user` object with three properties. We want to construct a new object where only the city changes. Compare copying unchanged properties by hand with using JavaScript's object spread syntax `...` (as seen in Lesson 09):

```js title="Copying unchanged fields by hand vs. using object spread ...user"
const user = { name: 'John', age: 30, city: 'Rome' };

const nextByHand = ~{ name: user.name, age: user.age, city: 'Paris' }~; // Way A: copying name and age by hand
const nextBySpread = ~{ ...user, city: 'Paris' }~; // Way B: exact same new object using ...user!
```

Here is what takes place in those two assignments:
1. First, Way A and Way B produce the exact same resulting object. Both create a new object holding the preserved name and age alongside the updated city `'Paris'`.
2. Second, the three dots inside `{ ...user }` operate like spread attributes on a JSX tag (as seen in Lesson 09). Think of `user` as a closed container. The three dots open the container and spread all its enumerable properties into the new object literal.
3. Third, `{ ...user }` duplicates existing values into a fresh memory allocation. Because it sits inside fresh curly braces, JavaScript allocates a new object in memory. When `Object.is` compares the old object with the spread copy, it returns `false`, signaling React to re-render.

```tree caption="Copying every unchanged property by hand vs. spreading the existing object with ...user."
Two ways to build a new object with one changed field
- +Way A: Copy each old field by hand [`{ name: user.name, age: user.age, city: 'Paris' }`] | You type **every unchanged field** yourself | Produces a **new object** with `city: 'Paris'`
- +Way B: Spread with three dots [`{ ...user, city: 'Paris' }`] | `...user` **copies all fields** into the new object automatically | **Exact same result** without typing every unchanged field
```

### Non-Commutative Object Evaluation: Why Trailing Properties Win

Inside an object literal, the spread `...user` and an explicit property like `city: 'Paris'` can share the same curly braces.

When combining a spread and a specific property, there are two possible orders:
1. **Order 1**: `...user` comes before `city: 'Paris'`. The spread is first on the left, and `city: 'Paris'` is second on the right.
2. **Order 2**: `city: 'Paris'` comes before `...user`. The property `city: 'Paris'` is first on the left, and `...user` is second on the right.

```js title="The two ways to order ...user and city: 'Paris' inside an object literal"
const user = { name: 'John', age: 30, city: 'Rome' };

const order1 = ~{ ...user, city: 'Paris' }~; // Order 1: ...user is first, city: 'Paris' is last -> city is 'Paris'!
const order2 = ~{ city: 'Paris', ...user }~; // Order 2: city: 'Paris' is first, ...user is last -> city is overwritten back to 'Rome'!
```

Order 1 and Order 2 contain the exact same code tokens, but they are not the same thing.

**Object literal keys evaluate sequentially from left to right: any property declared after the spread unconditionally overwrites the copied property from the original object.**
1. In Order 1, `...user` runs first on the left and copies all three existing properties, including `'Rome'`. Then `city: 'Paris'` runs second on the right and replaces the copied value with `'Paris'`.
2. In Order 2, `city: 'Paris'` runs first on the left and sets the city to `'Paris'`. Then `...user` runs second on the right and copies the old properties over it, overwriting the city back to `'Rome'`.

```tree caption="When ...user and an updated property share an object literal, JavaScript reads from left to right and the last one wins."
Two ways to order `...user` and `city: 'Paris'`
- +Order 1: `...user` before `city: 'Paris'` [`{ ...user, city: 'Paris' }`] | `...user` runs **first**; `city: 'Paris'` runs **last** | **`'Paris'` wins** because the change comes after the spread
- !Order 2: `city: 'Paris'` before `...user` [`{ city: 'Paris', ...user }`] | `city: 'Paris'` runs **first**; `...user` runs **last** | `...user` comes last and **overwrites `city` back to `'Rome'`!**
```

### The Truncated State Trap: How Partial Objects Silently Delete State

A `useState` setter replaces the state object with the exact object passed to it: it never merges new properties into old state automatically. If any existing field is omitted from the new object literal, that field is permanently lost from state on the next render.

Suppose we add a customer field to the starting order, while the two button handlers still copy only the original three fields by hand:

```jsx title="src/components/OrderCard.jsx" startLine="3"
export default function OrderCard() {
  const [order, setOrder] = useState({
    item: 'Coffee mug',
    quantity: 1,
    giftWrap: false,
    ~customer: 'Anna Lee',~ // 1. New customer field added to the starting state
  });

  function handleAddOne() {
    setOrder({ item: order.item, quantity: order.quantity + 1, giftWrap: order.giftWrap });
  }

  function handleGiftWrap() {
    ~setOrder({ item: order.item, quantity: order.quantity, giftWrap: true });~ // **WRONG:** forgets to copy order.customer!
  }
```

In the card's markup, we add a line showing who the order is for:

```jsx title="src/components/OrderCard.jsx" startLine="19"
  return (
    <section className="card">
      <h1>Your Order</h1>
      <p>Item: {order.item}</p>
      <p>Quantity: {order.quantity}</p>
      <p>Gift wrap: {order.giftWrap ? 'Yes' : 'No'}</p>
      ~<p>For: {order.customer}</p>~ {/* 2. Displays "For: Anna Lee" on first load */}
      <button onClick={handleAddOne}>+1</button>
      <button onClick={handleGiftWrap}>Add gift wrap</button>
    </section>
  );
}
```

The page displays broken data: clicking `Add gift wrap` checks the gift wrap option, but completely wipes out the customer's name, leaving `For:` completely blank with zero console warnings. Because the gift wrap handler replaced the state object without copying the customer field, `order.customer` became `undefined`.

### Preserving State Integrity: Automatic Top-Level Spread Duplication

Instead of copying each unchanged field by hand, we rewrite both button handlers with `...order` first and the changed field after it:

```jsx title="src/components/OrderCard.jsx" startLine="11"
  function handleAddOne() {
    ~setOrder({ ...order, quantity: order.quantity + 1 });~ // 1. Spreads all fields of order, then updates quantity
  }

  function handleGiftWrap() {
    ~setOrder({ ...order, giftWrap: true });~ // 2. Spreads all fields of order, then updates giftWrap to true
  }
```

Notice `handleGiftWrap` now contains no explicit references to `item`, `quantity`, or `customer`.

**Object spread creates an explicit shallow copy: all existing enumerable keys are copied into the new allocation before individual overrides are applied.**
1. JavaScript allocates an empty object literal `{ }`.
2. The spread `...order` copies all four existing properties from `order` into that new allocation from left to right.
3. Next, `giftWrap: true`, declared after the spread, overrides the copied `false` value with `true`.
4. Finally, `setOrder` receives this brand-new object reference, `Object.is` returns `false`, and React renders the card with `Gift wrap: Yes` while preserving `For: Anna Lee`.

### The Overwritten Override Trap: Trailing Spread Erases New State

Placing the updated field before `...order` causes trailing spread erasure:

```jsx title="src/components/OrderCard.jsx" startLine="15"
  function handleGiftWrap() {
    ~setOrder({ giftWrap: true, ...order });~ // **WRONG:** ...order comes last and overwrites giftWrap back to false!
  }
```

The button fails to update the screen: clicking `Add gift wrap` leaves the card stuck on `Gift wrap: No` because the trailing spread immediately overwrites the fresh `true` value.

**Trailing spreads nullify prior property definitions: the spread copies the current snapshot value of `false` over the newly assigned value of `true`.**
1. First, `giftWrap: true` is assigned into the newly allocated object.
2. Second, `...order` copies every property from the current snapshot, including `giftWrap: false`, directly over the newly assigned value.
3. Because the resulting object is a fresh allocation in memory, React renders the card, but the screen continues to show `Gift wrap: No`.

Moving `giftWrap: true` after `...order` restores the proper override precedence:

::: row caption="What happens when clicking Add gift wrap if customer is omitted or ...order is placed last vs. when ...order comes first."
::: col title="Hand-Copy Missing customer" tag="For: loses Anna Lee" tone=bad
```page size=mini
heading: Your Order
line: Item: Coffee mug
line: Quantity: 1
line: Gift wrap: Yes | good
line: For: | bad
row: +1; Add gift wrap
console: quiet
```
Replacing the order without copying the customer field makes `order.customer` `undefined`.
:::
::: col title="Spread First: { ...order, giftWrap: true }" tag="all fields kept, change wins" tone=good
```page size=mini
heading: Your Order
line: Item: Coffee mug
line: Quantity: 1
line: Gift wrap: Yes | good
line: For: Anna Lee | good
row: +1; Add gift wrap
console: quiet
```
`...order` copies every field first, and `giftWrap: true` written after it replaces the old false value.
:::
:::

### Functional Updaters: Returning Object Literals from Arrow Callbacks

When a single user event queues multiple state updates to the same object before the next render, pass an updater function to the setter (as seen in Lesson 16) and spread the pending state argument inside it:

```jsx title="Spreading the previous state object inside an updater function"
function handleAddOneQueued() {
  ~setOrder(o => ({ ...o, quantity: o.quantity + 1 }));~ // Parentheses around { ...o, ... } return the new object from =>
}
```

Notice the parentheses wrapped around the object literal after the arrow `=>`. In JavaScript, curly braces directly following an arrow `=>` normally define a function block rather than an object literal. Wrapping the curly braces in parentheses, `({ ...o, quantity: o.quantity + 1 })`, instructs JavaScript to return that object literal directly.

> [!PRINCIPLE]
> **Principle 2: Object Spread: Spread the Existing Object First, Then Write the Changed Property After It**
>
> *Spread `...order` first to copy all existing fields into a new object, and always write the updated field after `...order`.*
>
> A `useState` setter never merges the object you pass with the old state object. It replaces the old state object completely. If you build a new object by hand and forget a property, that property becomes `undefined` on the next render. Using object spread `...order` copies every top-level property of `order` into the new object automatically. Because JavaScript reads object properties from left to right and the last one wins, you must put `...order` first and write the changed property after it. If you place the changed field before `...order` so the spread comes last, `...order` overwrites your change with the old value.
>
> **DO THIS:**
> ```jsx
> function handleGiftWrap() {
>   ~setOrder({ ...order, giftWrap: true });~ // 1. ...order copies all fields first; 2. giftWrap: true wins last
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleGiftWrap() {
>   ~setOrder({ giftWrap: true, ...order });~ // **WRONG:** ...order comes last and overwrites giftWrap back to false!
> }
> ```

---

## 3. Principle 3: Spread Is Shallow: Nested Objects Require Copies at Every Level

### Pointer References in Memory: Why JavaScript Objects Are Never Truly Nested

In JavaScript, nested objects do not exist as physically embedded memory structures; they are independent objects referenced by pointers. Because spread `...` copies only the top-level pointer, mutating a nested field on a shallow copy corrupts all shared references, including initial constants and previous render snapshots.

In source code, we frequently place an object literal inside another object:

```js title="An object written inside another object in code"
const user = {
  name: 'John',
  ~address: { city: 'Rome' }~, // Written inside user's curly braces in code
};
```

Two primary misconceptions arise when developers apply object spread to nested objects:
1. First, writing an `address` object inside `user` appears to place one physical container inside another, but it is not one compound object. In JavaScript memory, `user` and `address` are two completely independent allocations. The `user.address` property merely stores a memory pointer pointing to the separate `address` object.
2. Second, object spread `{ ...user }` is strictly a shallow copy: it copies only the first layer of key-value pairs. Think of photocopying the top index card of a binder. If that card says the address file is stored in locker 3, the photocopy still directs you to locker 3. Both cards point to the identical address file in memory.

Look at what `Object.is` reports when we make a shallow copy with `{ ...user }` and then change the city on that copy:

```js title="Plain JavaScript: what { ...user } copies vs. what it still shares"
const user = { name: 'John', address: { city: 'Rome' } };
const copy = { ...user };

console.log(~Object.is(copy, user)~); // 1. false: copy is a brand-new top-level object
console.log(~Object.is(copy.address, user.address)~); // 2. true: both point at the EXACT SAME address object!

~copy.address.city = 'Paris';~ // **WRONG:** mutates the shared address object, so user.address.city is now 'Paris' too!
```

Although `copy` is a brand-new top-level allocation, `copy.address` and `user.address` hold the identical memory pointer. Mutating `copy.address.city = 'Paris'` modifies the original `user.address.city` simultaneously.

Modifying a brand-new object created entirely inside your current function is a local mutation (as seen in Lesson 14), which is safe because no other component or snapshot shares that pointer. However, modifying `copy.address.city` looks like a local mutation, but it is not the same thing. While `copy` is local, `copy.address` points to existing shared state.

To update `city` without mutating the shared inner allocation, apply `...` twice: once for the inner object and once for the outer object:

```js title="Two ways to copy every object on the path to city"
const nextAddress = ~{ ...user.address, city: 'Paris' }~; // Way 1, step 1: new inner address object
const nextUser1 = ~{ ...user, address: nextAddress }~; // Way 1, step 2: new outer user object pointing at nextAddress

const nextUser2 = ~{ ...user, address: { ...user.address, city: 'Paris' } }~; // Way 2: exact same thing in one step!
```

Way 1 and Way 2 are the exact same thing. Both allocate a fresh inner address object and a fresh outer user object, leaving `user.address.city` untouched at `'Rome'`:

```tree caption="Why a shallow copy { ...user } still shares the inner address object, while spreading both levels creates two fresh objects."
Updating `address.city` inside `user`
- !Shallow copy only [`const copy = { ...user }; copy.address.city = 'Paris'`] | `copy` is new, **but `copy.address` is the SAME inner object** | Mutates `user.address.city` and **corrupts earlier snapshots!**
- +Copy every level on the path [`{ ...user, address: { ...user.address, city: 'Paris' } }`] | Inner `...user.address` makes a **new `address` object**; outer `...user` makes a **new `user` object** | `user.address.city` stays **`'Rome'`** untouched
```

### The Shared Pointer Mutation: Corrupting Snapshots and Initial State

Let us see how shallow copying breaks our online shop order card when handling reset functionality.

Suppose we extract our starting order into a constant above the component to power a `Start over` button, adding a nested `delivery` object:

```jsx title="src/components/OrderCard.jsx" startLine="1"
import { useState } from 'react';

const ~initialOrder~ = { // 1. Starting order saved above OrderCard so Start over can reset to it
  item: 'Coffee mug',
  quantity: 1,
  giftWrap: false,
  customer: 'Anna Lee',
  ~delivery: { address: '12 Main Street', time: 'Morning' }~, // 2. Inner delivery object
};
```

Inside the component, we initialize state with `initialOrder`. Remembering to copy the top-level order object, the developer shallow-copies `order` into `next`, mutates `next.delivery.time` directly, and passes `next` to the setter. Below that, the reset handler passes `initialOrder` back to `setOrder`:

```jsx title="src/components/OrderCard.jsx" startLine="11"
export default function OrderCard() {
  const [order, setOrder] = useState(initialOrder);

  function handleAddOne() {
    setOrder({ ...order, quantity: order.quantity + 1 });
  }

  function handleGiftWrap() {
    setOrder({ ...order, giftWrap: true });
  }

  function handleEvening() {
    const next = ~{ ...order }~; // Shallow copy: next.delivery still points at the SAME delivery object!
    ~next.delivery.time = 'Evening';~ // **WRONG:** mutates the shared delivery object inside initialOrder too!
    setOrder(next);
  }

  function handleStartOver() {
    ~setOrder(initialOrder);~ // Resets state back to initialOrder
  }
```

In the card's markup, we display the delivery line and attach handlers for evening delivery and resetting:

```jsx title="src/components/OrderCard.jsx" startLine="32"
  return (
    <section className="card">
      <h1>Your Order</h1>
      <p>Item: {order.item}</p>
      <p>Quantity: {order.quantity}</p>
      <p>Gift wrap: {order.giftWrap ? 'Yes' : 'No'}</p>
      <p>For: {order.customer}</p>
      ~<p>Delivery: {order.delivery.address}, {order.delivery.time}</p>~ {/* Displays address and time */}
      <button onClick={handleAddOne}>+1</button>
      <button onClick={handleGiftWrap}>Add gift wrap</button>
      <button onClick={handleEvening}>Deliver in the evening</button>
      <button onClick={handleStartOver}>Start over</button>
    </section>
  );
}
```

The reset button corrupts the display: clicking `Start over` restores the quantity to 1 but leaves the delivery time permanently stuck on `Evening` instead of restoring `Morning`.

**Shallow copying leaves nested object references shared: mutating a nested property on a shallow copy silently mutates the shared constant, permanently destroying the baseline reset state.**
1. On initial load, the card renders `Quantity: 1` and morning delivery at 12 Main Street.
2. The shopper clicks the evening delivery button. The screen updates to show `Evening`.
3. Next, the shopper clicks `+1` twice, raising the displayed quantity to `3`.
4. The shopper decides to reset the order and clicks `Start over`.
5. The quantity successfully resets to one, but the delivery line remains stuck on `Evening` instead of returning to `Morning`.

### The Reference Leak: How Mutating next.delivery Destroys initialOrder

No statement in our codebase ever executed `initialOrder.delivery.time = 'Evening'`. The mutation occurred because `initialOrder.delivery` and `next.delivery` shared the identical memory pointer.

**Mutating through a shared reference corrupts all aliases: because initialOrder and next share the same inner delivery pointer, mutating next.delivery rewrites the initial baseline in memory.**
1. On initial render, `useState` initializes state from `initialOrder`, so both the state variable and the module constant share the identical memory structure.
2. When the shopper clicks the evening button, `{ ...order }` creates a fresh top-level `next` object, but its `delivery` property copies only the pointer to the existing inner delivery allocation.
3. The statement `next.delivery.time = 'Evening'` mutates that shared inner allocation in place. Because `initialOrder.delivery` references that identical allocation, the baseline constant silently mutates to `'Evening'`.
4. When `Start over` runs, it passes `initialOrder` back to `setOrder`. React re-renders `initialOrder`, whose quantity is one but whose delivery time has been permanently overwritten with `'Evening'`.

We resolve the leak by spreading every level along the path to the delivery time:

```jsx title="src/components/OrderCard.jsx" startLine="22"
  function handleEvening() {
    ~setOrder({ ...order, delivery: { ...order.delivery, time: 'Evening' } });~ // Copies both order and order.delivery!
  }
```

Notice `handleEvening` contains no explicit reference to `address`.

**Multi-level copying isolates nested state: spreading every level on the path creates brand-new containers at both levels, leaving the shared baseline completely untouched.**
1. First, the inner spread `...order.delivery` allocates a fresh delivery object, copies the street address, and assigns `time: 'Evening'`.
2. Next, the outer spread `...order` allocates a fresh order object, copies all top-level properties, and points `delivery` at the new inner object.
3. Because the new delivery object occupies a separate memory address, `initialOrder.delivery` remains completely untouched at `'Morning'`.

::: row caption="What Start over shows after clicking Deliver in the evening and +1 twice: shallow copy + mutation vs. two-level spread."
::: col title="Shallow Copy + Mutating next.delivery" tag="Start over stays stuck on Evening" tone=bad
```page size=mini
heading: Your Order
line: Item: Coffee mug
line: Quantity: 1 | good
line: Gift wrap: No
line: For: Anna Lee
line: Delivery: 12 Main Street, Evening | bad
row: +1; Add gift wrap; Deliver in the evening; Start over
console: quiet
```
Both `next.delivery` and `initialOrder.delivery` shared the same inner object, so mutating the evening time corrupted the starting order.
:::
::: col title="Two-Level Spread: ...order and ...order.delivery" tag="Start over restores Morning" tone=good
```page size=mini
heading: Your Order
line: Item: Coffee mug
line: Quantity: 1 | good
line: Gift wrap: No
line: For: Anna Lee
line: Delivery: 12 Main Street, Morning | good
row: +1; Add gift wrap; Deliver in the evening; Start over
console: quiet
```
Spreading both `...order` and `...order.delivery` leaves the starting delivery time untouched at morning.
:::
:::

### Architectural Repercussions: Why Direct Mutation Destroys React Invariants

Beyond breaking reset buttons like `Start over`, the official React documentation highlights five architectural reasons why mutating state objects breaks application guarantees:
1. **Debugging**: when you replace state objects instead of mutating them, earlier `console.log` statements preserve the exact data from when they executed rather than reflecting subsequent mutations.
2. **Optimizations**: React components and memoization checks can skip unnecessary re-renders when props have not changed (as seen in Lesson 13). Checking `prevProps.order === nextProps.order` is instantaneous when reference identity guarantees that unchanged pointers signify unchanged contents.
3. **Render snapshots and concurrency**: React's rendering model requires each render to maintain an immutable snapshot of state (as seen in Lesson 15). Mutating an object corrupts the state of past render snapshots and concurrent features.
4. **Time-travel and history features**: keeping prior state objects immutable in memory makes Undo, Redo, and audit trails straightforward to implement.
5. **No hidden Proxies required**: because developers replace objects explicitly, React avoids wrapping every state property in magical runtime observation proxies.

When state structures become deeply nested across three or four levels, spreading every level manually can become verbose. Teams manage deep nesting through two standard strategies: flattening the state structure into normalized collections, or integrating the optional library Immer to generate nested copies from draft mutations.

> [!PRINCIPLE]
> **Principle 3: Nested Objects: Spread Copies One Level, So Copy Every Object on the Path**
>
> *Because object spread `...` is shallow, update a nested property by creating a new copy of every object on the path from the change up to the root.*
>
> In JavaScript, an object written inside another object is actually a separate object in memory that the outer object points to. Spreading only the outer object with `{ ...order }` creates a new top-level object whose delivery property still points at `initialOrder.delivery`. If you mutate `next.delivery.time`, you corrupt that shared inner object inside earlier render snapshots and inside `initialOrder`, breaking the reset button. Instead, spread both levels with `...order` and `...order.delivery` so both the inner delivery object and the outer order object are brand-new copies.
>
> **DO THIS:**
> ```jsx
> function handleEvening() {
>   ~setOrder({ ...order, delivery: { ...order.delivery, time: 'Evening' } });~ // New delivery object inside a new order object
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleEvening() {
>   const next = { ...order };
>   ~next.delivery.time = 'Evening';~ // **WRONG:** next.delivery is still the shared inner object, corrupting initialOrder!
>   setOrder(next);
> }
> ```

---

## 4. Principle 4: Computed Property Names: Synchronizing Multiple Inputs With a Single Handler

### Dynamic Property Evaluation: Bracket Notation in Object Literals

Computed property names evaluate expressions dynamically inside object literals: reading `[e.target.name]` allows a single change handler to update multiple state fields by extracting the input's name attribute directly from DOM event metadata.

Suppose a variable named `key` holds the string `'city'`. Compare three object declarations in plain JavaScript:

```js title="Plain JavaScript: a normal property name vs. a computed property name [key] vs. a literal key"
const key = 'city';

const obj1 = ~{ city: 'Paris' }~; // 1. Property name written directly as city -> { city: 'Paris' }
const obj2 = ~{ [key]: 'Paris' }~; // 2. Square brackets read the variable key ('city') -> { city: 'Paris' }!
const obj3 = ~{ key: 'Paris' }~; // 3. No square brackets: uses the literal word 'key' -> { key: 'Paris' }!
```

Two nuances clarify how JavaScript parses square brackets inside object literals:
1. First, when `key` holds `'city'`, writing `{ [key]: 'Paris' }` with square brackets and writing `{ city: 'Paris' }` are the exact same thing. Both produce an object whose key is `city` with the value `'Paris'`.
2. Second, `{ [key]: 'Paris' }` and `{ key: 'Paris' }` look nearly identical, but they are not the same thing. Without square brackets, JavaScript interprets `key` as the literal property identifier, creating `{ key: 'Paris' }`. With square brackets, JavaScript evaluates the expression inside the brackets and assigns `'Paris'` to that computed string.

Think of an order form where each input box displays a preprinted label such as `"customer"` or `"note"`. Rather than hiring one clerk who only processes customer names and a second clerk who only processes notes, a single clerk inspects the label on whichever box the customer edited and updates that matching entry.

```tree caption="How JavaScript reads a direct property name, a computed property name inside [ ], and an unbracketed variable name."
Three ways to name a property when `const key = 'city'`
- +Direct property name [`{ city: 'Paris' }`] | You know the exact field name **`city`** ahead of time | Creates **`{ city: 'Paris' }`**
- +Computed property name [`{ [key]: 'Paris' }`] | Square brackets `[ ]` **look up the value of `key`** first | **Exact same result**: creates **`{ city: 'Paris' }`**
- !Forgot the square brackets [`{ key: 'Paris' }`] | ~Do **NOT** leave out `[ ]` when the name is in a variable | Creates a property literally named **`key`**: **`{ key: 'Paris' }`**!
```

### DOM Metadata Mapping: Extracting Form Names via e.target.name

Now suppose our order card includes two text inputs: one for the customer name and one for the courier note.

In React, an input tag displays state with `value` and reports typing through `onChange` (as seen in Lesson 11). When an input is bound to `order.customer` and its handler fails to update `order.customer`, React reverts the input field back to the snapshot value after every keystroke.

Each HTML `<input>` tag can declare a standard `name` attribute matching its state property. The browser exposes that attribute on the event object as `e.target.name`, directly alongside the typed characters in `e.target.value`. Compare writing separate dedicated handlers with sharing one unified handler:

```jsx title="Two separate handlers vs. one shared handler using [e.target.name]"
function handleCustomerChange(e) {
  ~setOrder({ ...order, customer: e.target.value });~ // Separate handler for customer only
}

function handleNoteChange(e) {
  ~setOrder({ ...order, note: e.target.value });~ // Separate handler for note only
}

function handleChange(e) {
  ~setOrder({ ...order, [e.target.name]: e.target.value });~ // Exact same result for BOTH inputs with one handler!
}
```

Wiring two separate handlers and wiring one shared `handleChange` with `[e.target.name]` produce the exact same outcome on screen.

### The Copy-Paste Desynchronization: Overwriting the Wrong Field

Maintaining duplicate change handlers invites copy-paste errors where an input accidentally updates the wrong state property.

Suppose we add an empty courier note field to our starting order. A developer creates a handler for the customer input, duplicates it for the note input, and forgets to update the target property:

```jsx title="src/components/OrderCard.jsx" startLine="31"
  function handleNameChange(e) {
    setOrder({ ...order, customer: e.target.value });
  }

  function handleNoteChange(e) {
    ~setOrder({ ...order, customer: e.target.value });~ // **WRONG:** copy-pasted from handleNameChange and still updates customer!
  }
```

In the card's markup, we render the courier note line and attach the labeled inputs:

```jsx title="src/components/OrderCard.jsx" startLine="46"
      <p>Delivery: {order.delivery.address}, {order.delivery.time}</p>
      <p>Note: {order.note}</p>
      <label>
        Name
        <input value={order.customer} onChange={handleNameChange} />
      </label>
      <label>
        Note for the courier
        ~<input value={order.note} onChange={handleNoteChange} />~ {/* Calls the copy-pasted handleNoteChange */}
      </label>
```

Typing vandalizes the wrong field: typing into the courier note box leaves the note empty while overwriting the customer's name with each keystroke.

**Copy-pasted handlers cause cross-field pollution: updating order.customer from the note input causes the note field to immediately revert to empty while clobbering the customer's name.**
1. On the first keystroke in the courier note box, the note handler runs and writes the typed character into `order.customer` instead of `order.note`.
2. The customer display line and the name input lose `'Anna Lee'` and display only that single typed character.
3. Meanwhile, `order.note` remains an empty string. Because the note input has `value={order.note}`, React immediately reverts the note input back to empty on every frame.
4. Each subsequent character typed into the note box replaces the customer name again. After the shopper types the word `Leave`, the customer display line shows only `e`, the final letter typed.

### The Unified Change Handler: Dynamic Key Assignment

We replace both separate handlers with one unified handler that evaluates `[e.target.name]`:

```jsx title="src/components/OrderCard.jsx" startLine="31"
  function handleChange(e) {
    ~setOrder({ ...order, [e.target.name]: e.target.value });~ // 1. Reads the field name from e.target.name
  }
```

On the input tags, we add matching `name` attributes and wire both inputs to that single handler:

```jsx title="src/components/OrderCard.jsx" startLine="44"
      <label>
        Name
        ~<input name="customer" value={order.customer} onChange={handleChange} />~ {/* 2. e.target.name is "customer" */}
      </label>
      <label>
        Note for the courier
        ~<input name="note" value={order.note} onChange={handleChange} />~ {/* 3. e.target.name is "note" */}
      </label>
```

Notice `handleChange` contains no hardcoded references to either `customer` or `note`.

**Dynamic bracket evaluation routes DOM metadata to state keys: e.target.name supplies the target property dynamically, eliminating hardcoded field names.**
1. The shopper types into the courier note input box.
2. React dispatches `handleChange`, supplying the synthetic event object `e`.
3. Inside the handler, `e.target.name` evaluates to `'note'`, while `e.target.value` provides the current input text.
4. After `...order` copies all top-level properties, JavaScript computes `[e.target.name]` and assigns the new string to `order.note`.

This single-level computed assignment updates top-level state properties. Updating a nested field like `delivery.time` continues to require the two-level spread from Principle 3.

### The Mismatched Key Trap: Silent Input Reversion

Because `[e.target.name]` relies on the input's `name` attribute to identify the target state property, the input's `name` attribute must match the state key character for character.

Watch what happens when a teammate alters the `name` attribute on the customer input so it no longer matches `order.customer`:

```jsx title="src/components/OrderCard.jsx" startLine="44"
      <label>
        Name
        ~<input name="customerName" value={order.customer} onChange={handleChange} />~ {/* **WRONG:** "customerName" does not match order.customer! */}
      </label>
```

The input box rejects user typing: every keystroke typed into the Name box is immediately reverted by React, leaving 'Anna Lee' frozen on screen with zero console errors.

**Mismatched input names write orphan properties into state: the handler creates customerName while the input continues displaying order.customer, forcing React to revert the input to the old text on every frame.**
1. On each keystroke, `handleChange` reads `e.target.name` and writes a newly created orphan property named `customerName` into state.
2. Meanwhile, the actual `order.customer` property remains untouched at `'Anna Lee'`.
3. Because the `<input>` specifies `value={order.customer}`, React reconciles the DOM against the unchanged `'Anna Lee'`, wiping out the typed keystroke immediately.

Restoring the input attribute to `name="customer"` synchronizes the DOM key with state:

::: row caption="Typing into the order inputs when an input's name attribute is mismatched vs. when both name attributes match order's fields."
::: col title="Mismatched name='customerName'" tag="Name input reverts every keystroke" tone=bad
```page size=mini
heading: Your Order
line: Item: Coffee mug
line: Quantity: 1
line: Gift wrap: No
line: For: Anna Lee | bad
line: Delivery: 12 Main Street, Morning
line: Note: Leave at the door
form:
  field: Name | Anna Lee | bad
  field: Note for the courier | Leave at the door | good
row: +1; Add gift wrap; Deliver in the evening; Start over
console: quiet
```
Using `[e.target.name]` writes an unused property, while the input still displays `order.customer` and reverts to the old name.
:::
::: col title="Matched name='customer' and name='note'" tag="one handleChange updates both" tone=good
```page size=mini
heading: Your Order
line: Item: Coffee mug
line: Quantity: 1
line: Gift wrap: No
line: For: Anna Lee | good
line: Delivery: 12 Main Street, Morning
line: Note: Leave at the door | good
form:
  field: Name | Anna Lee | good
  field: Note for the courier | Leave at the door | good
row: +1; Add gift wrap; Deliver in the evening; Start over
console: quiet
```
Each input's `name` attribute matches its top-level key on the state object, so one `handleChange` updates whichever field the shopper edits.
:::
:::

```tree dir=right caption="How typing in an input with name='note' flows through e.target.name into [e.target.name] to update order.note."
How one `handleChange` updates the right field on `order`
- +1. Input tag in JSX [`<input name="note" value={order.note} onChange={handleChange} />`] | Carries **`name="note"`** matching the state key `note`
- +2. Event object `e` [`e.target.name` is `'note'` and `e.target.value` is `'Leave at the door'`] | Browser reports which input fired and what text is inside it
- +3. Computed property in `setOrder` [`{ ...order, [e.target.name]: e.target.value }`] | Evaluates `[e.target.name]` as **`note`** and sets **`note: 'Leave at the door'`**
```

> [!PRINCIPLE]
> **Principle 4: Computed Property Names: Use `[e.target.name]` So One Handler Updates Multiple Inputs**
>
> *Give each input tag a `name` attribute matching its top-level state property, and update state in one handler with `[e.target.name]: e.target.value`.*
>
> Writing separate change handlers for every text box invites copy-paste bugs where a handler updates the wrong property. Inside an object literal, wrapping an expression in square brackets `[e.target.name]` creates a computed property name: JavaScript evaluates `e.target.name` first and uses that string as the property key. If you forget the square brackets, JavaScript creates a property literally named `key`. And if an input's `name` attribute does not match the state property in `value`, the handler writes to an unused property. React then reverts the input box on every keystroke.
>
> **DO THIS:**
> ```jsx
> function handleChange(e) {
>   ~setOrder({ ...order, [e.target.name]: e.target.value });~ // 1. Square brackets use e.target.name as the property key
> }
> ~<input name="note" value={order.note} onChange={handleChange} />~ {/* 2. name="note" matches order.note */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleChange(e) {
>   setOrder({ ...order, [e.target.name]: e.target.value });
> }
> ~<input name="courierNote" value={order.note} onChange={handleChange} />~ {/* **WRONG:** name="courierNote" does not match order.note, so typing is reverted! */}
> ```

---

## Architectural Synthesis: The Complete Object State Lifecycle

### The Unified Project Files

Here is our main application file that imports and renders the order card:

```jsx title="src/App.jsx"
import ~OrderCard~ from './components/OrderCard.jsx'; // Renders the online shop order card

export default function App() {
  return <OrderCard />;
}
```

And here is the complete order card file combining all four principles. Every update passes a brand-new object to `setOrder`, and top-level updates spread `...order` first. The nested delivery update spreads both levels so `initialOrder` stays untouched, and one `handleChange` updates both text inputs:

```jsx title="src/components/OrderCard.jsx"
import { useState } from 'react';

const initialOrder = {
  item: 'Coffee mug',
  quantity: 1,
  giftWrap: false,
  customer: 'Anna Lee',
  delivery: { address: '12 Main Street', time: 'Morning' },
  note: '',
};

export default function OrderCard() {
  const [order, setOrder] = useState(initialOrder);

  function handleAddOne() {
    ~setOrder({ ...order, quantity: order.quantity + 1 });~ // 1. Principle 1 & 2: new object with ...order first and updated quantity last
  }

  function handleGiftWrap() {
    setOrder({ ...order, giftWrap: true });
  }

  function handleEvening() {
    ~setOrder({ ...order, delivery: { ...order.delivery, time: 'Evening' } });~ // 2. Principle 3: copies both order and order.delivery
  }

  function handleStartOver() {
    setOrder(initialOrder);
  }

  function handleChange(e) {
    ~setOrder({ ...order, [e.target.name]: e.target.value });~ // 3. Principle 4: computed property name updates customer or note
  }

  return (
    <section className="card">
      <h1>Your Order</h1>
      <p>Item: {order.item}</p>
      <p>Quantity: {order.quantity}</p>
      <p>Gift wrap: {order.giftWrap ? 'Yes' : 'No'}</p>
      <p>For: {order.customer}</p>
      <p>Delivery: {order.delivery.address}, {order.delivery.time}</p>
      <p>Note: {order.note}</p>
      <label>
        Name
        <input name="customer" value={order.customer} onChange={handleChange} />
      </label>
      <label>
        Note for the courier
        <input name="note" value={order.note} onChange={handleChange} />
      </label>
      <button onClick={handleAddOne}>+1</button>
      <button onClick={handleGiftWrap}>Add gift wrap</button>
      <button onClick={handleEvening}>Deliver in the evening</button>
      <button onClick={handleStartOver}>Start over</button>
    </section>
  );
}
```

### End-to-End Execution Flow: From User Interaction to Synchronized Commit

When the shopper clicks `+1` twice, adds gift wrap, picks evening delivery, and types a courier note, every handler hands `setOrder` a brand-new object. React updates the card cleanly on every single interaction:

```page caption="The finished Your Order card after the shopper adds two mugs, adds gift wrap, selects evening delivery, and types a courier note."
heading: Your Order
line: Item: Coffee mug
line: Quantity: 3 | good
line: Gift wrap: Yes | good
line: For: Anna Lee | good
line: Delivery: 12 Main Street, Evening | good
line: Note: Leave at the door | good
form:
  field: Name | Anna Lee | good
  field: Note for the courier | Leave at the door | good
row: +1; Add gift wrap; Deliver in the evening; Start over
console: quiet
```

```tree caption="How App renders OrderCard and how each handler in OrderCard creates a brand-new state object for React."
`App` [Mounts inside `<StrictMode>`] | Renders `<OrderCard />`
- +`OrderCard` [Holds `order` and `setOrder` from `useState`] | Treats `order` as **read-only** on every render
  - +`handleAddOne` and `handleGiftWrap` [`{ ...order, quantity: order.quantity + 1 }`] | Spreads `...order` **first**, then writes the changed top-level field **last**
  - +`handleEvening` [`{ ...order, delivery: { ...order.delivery, time: 'Evening' } }`] | Copies **both levels** so `initialOrder.delivery` stays `'Morning'` for `Start over`
  - +`handleChange` [`{ ...order, [e.target.name]: e.target.value }`] | Uses **`[e.target.name]`** so one handler updates `customer` and `note`
```

| Aspect | The Plain JavaScript Habit | The React Rule |
| :--- | :--- | :--- |
| **Changing a property** | Mutate `order.quantity = 2` in place and pass `order` back, which `Object.is` ignores as the same object | Treat state objects as read-only and pass a brand-new object to `setOrder` so React re-renders |
| **Keeping other fields** | Pass only `{ giftWrap: true }` or put `...order` after the change, which loses fields or overwrites the change | Spread `{ ...order, giftWrap: true }` with `...order` first and the updated field last |
| **Updating a nested field** | Spread only the top object `{ ...order }` and mutate `next.delivery.time`, which corrupts shared inner objects | Spread every level on the path, `{ ...order, delivery: { ...order.delivery, time: 'Evening' } }` |
| **Handling several inputs** | Copy-paste separate handlers for each field or mismatch the input `name` attribute | Give each input a matching `name` attribute and use `{ ...order, [e.target.name]: e.target.value }` |

---

## For the Interview

> **The Interview Question:** How do you update an object in state without mutating it?

### How to Answer Clearly in 30 Seconds

"We treat every object in React state as read-only. React never inspects the interior of an object to check whether properties changed; instead, the state setter compares the incoming value against the current state using `Object.is`. If we mutate `user.name = 'Alice'` in place on the existing object and pass `user` back to the setter, `Object.is` sees the exact same object reference. React then skips reconciliation, leaving the change dormant in memory until some unrelated state update triggers a re-render.

To update an object properly, we allocate a brand-new object and pass it to the setter:
1. **Top-level properties with spread**: we pass `{ ...order, quantity: order.quantity + 1 }` to `setOrder`. Because setters replace rather than merge, `...order` comes first to duplicate existing fields, and the updated property comes after the spread so the trailing value wins.
2. **Nested objects**: spread is shallow and copies only top-level pointers, leaving inner objects shared. We allocate a fresh copy at every level along the path to the change, like `{ ...order, delivery: { ...order.delivery, time: 'Evening' } }`, which keeps earlier render snapshots and reset constants intact.
3. **Multiple form inputs**: we assign each input a `name` attribute matching its state property and share one handler with a computed property name, `{ ...order, [e.target.name]: e.target.value }`."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why doesn't React re-render when I mutate `order.quantity = 2` and pass `order` to `setOrder`, and why does that change show up on a later render?"**
   When you call a `useState` setter, React compares the incoming reference against current state using `Object.is`. For objects, `Object.is` checks reference equality in memory rather than comparing internal properties. Mutating `order.quantity = 2` modifies the existing object while preserving its memory reference, so `Object.is` returns `true` and React bails out of rendering. However, the underlying memory was modified. When an unrelated state update later triggers reconciliation, React reads the mutated property from memory and renders the accumulated change all at once.
2. **"Is `{ ...order }` a deep copy, and what goes wrong if you spread `order` into `next`, mutate `next.delivery.time = 'Evening'`, and pass `next` to `setOrder`?"**
   **No.** Object spread `{ ...order }` is strictly a shallow copy that duplicates only top-level properties. In JavaScript, a nested object like `order.delivery` is an independent object in memory linked by a pointer. Executing `const next = { ...order }` creates a new top-level object, which triggers a render when passed to `setOrder`. However, `next.delivery` continues to reference the identical inner delivery object shared by past render snapshots and any module-level reset constant. Mutating `next.delivery.time = 'Evening'` mutates that shared allocation, corrupting historical snapshots and breaking reset buttons. You must create a fresh copy at every level along the path.
3. **"How can one `onChange` handler update multiple text inputs on a form object, and when is mutating an object actually safe in React?"**
   Give each input a `name` attribute matching its key in state, and use a computed property name inside the setter: `{ ...order, [e.target.name]: e.target.value }`. The square brackets dynamically evaluate `e.target.name` from the event target, overriding that specific key after the spread. Mutating an object in React is safe only when the object is a fresh local allocation created entirely inside the current function execution (as seen in Lesson 14). Because no other component or earlier render snapshot references that fresh object, modifying it locally before passing it to a setter causes no side effects.

```tree dir=right caption="Interview comparison: mutating an existing state object vs. shallow-copying a nested object vs. copying every level on the path."
Updating objects in React state in an interview
- !Mutate existing state object [`order.quantity = 2` and pass `order` to `setOrder`] | Same object reference in memory | `Object.is` is **`true`**: React **skips the render**, and the change leaks out on a later render
- !Shallow copy + nested mutation [`const next = { ...order }; next.delivery.time = 'Evening'`] | Top object is new, **inner `delivery` object is shared** | Renders now, **but corrupts earlier snapshots and `initialOrder`**
- +Copy every level on the path [`{ ...order, delivery: { ...order.delivery, time: 'Evening' } }`] | Every modified level gets a **brand-new object** | React renders cleanly and **keeps all past snapshots intact**
```
