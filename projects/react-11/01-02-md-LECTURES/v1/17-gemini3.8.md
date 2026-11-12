# Lecture 17: Why React Sees a New Object but Not a Changed Field

*(When you change a field inside the object in state, why does the screen stay the same?)*

> INTERVIEW QUESTION | ❱ CORE | How do you update an object in state without mutating it?

---

## VS | Mutation `item.quantity = 2` vs. a New Object for `setItem`: the mutation keeps the same object, the new object brings a render

First, let's set the two building blocks this lesson stands on:

> [!DEFINITION]
> **State and its setter.** [REVIEW] In plain JavaScript, you just write `quantity = 2`, and the job is done. Not in React. A value that must survive between renders lives in state, and state always comes as a pair: the state variable and its twin setter, declared together in one line. Until now, the state variable held a number, such as `score` in `const [score, setScore] = useState(0)`. But state can hold any JavaScript value, including an object that groups several values together: `const [item, setItem] = useState({ quantity: 1, giftWrap: false })`. Here `item` is the state variable, and `setItem` is its twin setter. The object inside holds two fields: `item.quantity` (e.g. 1 mug) and `item.giftWrap` (e.g. no gift wrap). React holds this object for your component between renders, and each time you want a change, you call the matching setter, `setItem(...)`. Here is the catch: whatever you pass to `setItem`, `item` does not change on that line, and not on any line after it in the same handler. React first calls your component again, and only in that new render does `item` hold the new object (Lesson 12).

> [!DEFINITION]
> **A setter call with the same value.** [REVIEW] OK, we have seen that a setter call asks React to render the component again. Yet there is a condition. React first compares the value you pass with the value it already holds, using a JavaScript check called `Object.is`. Suppose `score` is 2, and a click handler calls `setScore(2)`. `Object.is(2, 2)` is true: it is the same value. So React skips re-rendering the component and its children, and the screen stays exactly as it was. React does no useless work, and for a number this is exactly what you want, since the screen already shows 2. Now keep this check in mind, because in this lesson it decides everything: React never asks "did something change inside?". It only asks "is this the same value?" (Lesson 13).

Imagine a shopping cart with one item in it: a coffee mug. The card on the screen shows the mug, its quantity, whether it comes gift wrapped, and two buttons, `+1` and `Add gift wrap`. The quantity and the gift wrap live together in one object in state, `item`, which starts with a quantity of 1 and no gift wrap:

```page width=text caption="The cart item on the first load."
heading: Coffee mug
line: Quantity: 1
line: Gift wrap: No
line: [+1] [Add gift wrap]
console: quiet
```

In plain JavaScript, updating a property directly changes the field, and every line after it reads the new value. The job is done.

React state breaks this habit.

In React, the screen does not change, because React never looks inside the object.

```jsx title="Changing a field inside the object in state"
const [item, setItem] = useState({ quantity: 1, giftWrap: false });

~item.quantity = 2;~ // The object now holds 2, but the card still says Quantity: 1
```

> [!DEFINITION]
> **A mutation.** [NEW] So far, every state variable held a number, a string, or a boolean. You cannot change the number 0 from the inside: `setScore(5)` replaces 0 with 5, and the number 0 itself is still 0. An object is different. An object is a container, and JavaScript lets you change what is inside it: `item.quantity = 2`. This is called a mutation: the object stays the very same object, but its contents change. Shorthands such as `item.quantity++` and `item.quantity += 1` are mutations too. Here is the catch: JavaScript does not stop you, and neither does React. `item.quantity = 2` runs on the object React holds in state with zero errors and zero warnings. But no setter was told, so React has no idea that anything changed, and the screen stays as it was. React's docs compare it to "trying to change the order after you've already eaten the meal." The rule is simple: objects in state can technically be mutated, but you treat every object you put in state as read-only, just like a number. You read it. You never write into it. You replace it (Lesson 17).

So how do you change a field? You leave the old object alone. You build a new object, and you hand it to the setter. React's docs describe what a new object tells React. Adapted to our card, your code says: *"Replace `item` with this new object, and render this component again."*

Why does React follow this rule? Two reasons explain it:

1. **The check is fast.** Asking whether two references point to the same object takes one step, however many fields the object holds. In the docs' words, "If `prevObj === obj`, you can be sure that nothing could have changed inside of it."
2. **Old objects stay correct.** When nobody writes into an old object, every earlier render keeps a correct snapshot, and a reset to the starting values keeps working. The docs list "letting the user reset a form to earlier values" among the features that get easier when no code mutates state.

From this design, the documentation gives the rule in two parts:

1. **Objects in state are read-only.** In the docs' words, "Treat any JavaScript object that you put into state as read-only." In plain actions: you read `item.quantity` to build a new object, and you never write `item.quantity = ...`.
2. **The same object brings no render.** In the docs' words, "React will ignore your update if the next state is equal to the previous state, as determined by an `Object.is` comparison. This usually happens when you change an object or an array in state directly."

**Beware! Changing a field inside the object in state does not change the screen, and no error tells you.**

### VS | A Parcel Label vs. What Is Inside the Parcel

Think of a parcel at a shop counter. This is an image, and it maps onto the code piece by piece. The clerk scans the barcode on the parcel and never opens the box. A parcel whose barcode the scanner already knows is a parcel already checked in.

In a component, the parcel maps onto the code like this:

1. **The barcode label is the object reference in memory.** It is the identity `Object.is` checks.
2. **The contents inside the box are the fields**, such as `quantity: 1`.
3. **The scanner is `setItem`.** It compares the incoming reference with the reference it holds, using `Object.is`.
4. **Opening the box and adding two mugs is `item.quantity = 3`.** The scanner reads the same label, so the shop screen still says 1 mug. The screen and the box now disagree, and they stay that way until another update re-renders the component.
5. **A new box with a new barcode is a new object.** The scanner sees a fresh parcel reference and records it, so React renders.

Filling a new box before you hand it to the clerk is completely safe, because nobody has scanned it yet. That is local mutation (Lesson 14), and Principle 3 comes back to it.

### The user clicks +1 twice, and the card still says Quantity: 1

**Beware! A mutated object hides its change until some other click renders the component, and then the change jumps onto the screen.**

Shoppers change a cart item all the time: one more mug, gift wrap, a later delivery. Each change is a click, and each click runs a handler that updates the object in state.

Let's see what a mutation does to a real cart. The card shows a coffee mug, and `item` starts with one mug and no gift wrap. The mistake sits inside the click handler of the plus one button. The two handlers of the card do this:

1. `handleAddOne` increments the quantity directly on `item`, and then passes it back to the setter.
2. `handleGiftWrap` calls `setItem` with a new object that copies the quantity and turns the gift wrap on.

```jsx title="src/components/CartItem.jsx" startLine="6"
function handleAddOne() {
  ~item.quantity = item.quantity + 1;~ // **WRONG:** writes into the object React holds
  ~setItem(item);~ // **WRONG:** hands React the same object back
}

function handleGiftWrap() {
  ~setItem({ quantity: item.quantity, giftWrap: true });~ // A new object
}
```

On the first load, the card says `Quantity: 1`. Then the shopper clicks `+1` twice:

```page width=text caption="After two clicks on +1: the card still says Quantity: 1."
heading: Coffee mug
line: Quantity: 1 | bad
line: Gift wrap: No
line: [+1] [Add gift wrap]
console: quiet
```

**The page now displays the wrong quantity.** The shopper asked for 3 mugs, and the card still says 1. Then the shopper clicks `Add gift wrap`:

```page width=text caption="After one more click, on Add gift wrap: the quantity jumps from 1 straight to 3."
heading: Coffee mug
line: Quantity: 3 | bad
line: Gift wrap: Yes | good
line: [+1] [Add gift wrap]
console: quiet
```

**Now the quantity jumps from 1 straight to 3, on a click that never touches the quantity.**

So what should `handleAddOne` have done? Here is the line that works:

**DO THIS:**

```jsx title="The line that works in handleAddOne" good="1"
setItem({ quantity: item.quantity + 1, giftWrap: item.giftWrap });
```

Before any explanation, what do you notice? It looks strange. The line never touches `item`. It writes a whole new object, field by field. Even `giftWrap`, which we never wanted to change, is copied out in full. React seems to demand more precision than plain JavaScript.

And yet it works. Click `+1` twice, and the card says `Quantity: 3`:

```page width=text caption="After two clicks on +1 with a new object: the card says Quantity: 3."
heading: Coffee mug
line: Quantity: 3 | good
line: Gift wrap: No
line: [+1] [Add gift wrap]
console: quiet
```

One new idea explains why:

> [!DEFINITION]
> **The same object vs. a new object.** [NEW] So, we have seen two things. First, `item` holds an object, born with its twin setter in `const [item, setItem] = useState({ quantity: 1, giftWrap: false })`. Second, React checks the value you pass to `setItem` with `Object.is`, and skips the render when it gets the same value. Now pay attention here, because this is where objects trick everyone. For two objects, `Object.is` does not open the curly braces to compare fields. It asks one question only: "Is this the very same object in memory?" Let's catch it in action. The handler of the `+1` button writes `item.quantity = item.quantity + 1`, and then calls `setItem(item)`. The first line mutates the object: inside it, the quantity is now 2. The second line hands that object to React. Will the card show `Quantity: 2`? NO, it stays on `Quantity: 1`! Why? Because React compares the object it holds with the object you passed, and they are the SAME object. `Object.is(item, item)` is true, so React skips the render. Did you notice the detail? The quantity really changed, but the object did not: it is the same object with new contents, and React never reads the contents. Now compare: `setItem({ quantity: item.quantity + 1, giftWrap: item.giftWrap })`. Those curly braces build a NEW object in memory. `Object.is` compares the old object with the new one, the answer is false, and React does what you wanted: it replaces `item` with the new object and renders `Quantity: 2`. So, do not confuse a changed object with a new object: both hold `quantity: 2`, but only the new object reaches the screen. Now the tricky part: the mutation does not go away. It waits. Click `+1` twice: the card still says `Quantity: 1`, while the object in memory already holds 3. Then click `Add gift wrap`, whose handler builds a new object and copies `item.quantity` into it. That new object holds 3, React renders it, and the quantity jumps from 1 straight to 3, at the very moment the gift wrap line turns to `Yes`! The rule is simple: never edit the object React holds. To change a field, hand the setter a new object (Lesson 17).

Here is what went wrong, click by click. From the first click on, the object in memory and the card on the screen tell two different stories:

| Click | What the handler does | `item.quantity` in memory | `Object.is` | The card shows |
| :--- | :--- | :--- | :--- | :--- |
| **First `+1`** | Writes into `item`, then calls `setItem(item)` | 2 | true: React skips the render | `Quantity: 1` |
| **Second `+1`** | The same two lines again | 3 | true: React skips the render | `Quantity: 1` |
| **`Add gift wrap`** | Builds a new object that copies `item.quantity` | 3 | false: React renders | `Quantity: 3` and `Gift wrap: Yes` |

**This bug hides well.** The Console stays empty. Logging `item.quantity` inside the click handler prints 2, then 3. So the developer assumes state updated normally, and blames the screen. For real users, the cost is serious. If a checkout button sent `item` to the server, the server would receive 3 mugs while the card on screen still showed 1.

### The Rule of Thumb: hand `setItem` a new object, and copy every level you change

**Treat every object in state as read-only: to change a field, hand the setter a new object.** React's docs say it directly: "Instead of mutating them, you should always replace them."

At the end of the day, a senior developer follows three rules:

1. **Need to change a field? Build a new object.** Direct mutation and passing `item` back seems to achieve the same result as passing a fresh object, because both hold `quantity: 2`. But they are not the same! Mutating hands React the identical reference, so React skips the render entirely. Ignore this rule, and the screen stays frozen with zero errors.
2. **Building the new object? Copy old fields first, and write the change last.** The setter replaces the whole object and never merges. Leave a field out, and it disappears from the screen. Object spread `...item` (as seen on JSX tags in Lesson 9) copies the existing fields for you. Place the spread after the update, and the old value overwrites your change.
3. **Changing a nested field? Copy every level on the path.** Spreading `item` copies only the top level. An inner object, such as `item.delivery`, remains shared across references. Ignore this rule, and clicking `Start over` fails to restore `Morning` because the update modified the shared starting object as well. Principle 3 shows how.

## SECTION | The Coffee Mug in the Cart

Our project is one item in an online shop cart: a coffee mug. It uses four files. The entry file mounts `App`, which renders `<CartItem />` to hold the state and handlers:

```files title="cart-item: File Explorer" caption="How the files of our cart item sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `App` inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and imports `CartItem` from `./components/CartItem.jsx`
  components/
    CartItem.jsx | state | Exports `CartItem` as default and holds `item`, `setItem`, and every handler
```

On the first load, the card shows the mug, two lines, and two buttons. Each principle adds one part to this same card:

```page width=text caption="The cart item on the first load."
heading: Coffee mug
line: Quantity: 1
line: Gift wrap: No
line: [+1] [Add gift wrap]
console: quiet
```

**PRINCIPLES:** React never looks inside the object in state. It only asks whether the setter got a new object. Four practical principles follow from that:

1. **Principle 1: Always Replace the Object, Never Edit It in Place.** A mutated object is still the same object, so `setItem(item)` changes nothing on the screen. Hand the setter a new object.
2. **Principle 2: Always Spread First, Update Last.** The setter replaces the whole object and never merges. Copy the old fields with `...item` first, and write the changed field after it.
3. **Principle 3: Spread Is Shallow, So Copy Every Level.** One spread copies only the outer object, and the inner `delivery` object stays shared. Copy every object on the path to a nested change.
4. **Principle 4: Write One Handler for Multiple Inputs.** Give each text box a `name` equal to its field, and let one handler write the field named by `e.target.name`.

| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |
| :--- | :--- | :--- | :--- |
| **Principle 1** | **Always Replace the Object, Never Edit It in Place** | Two clicks on `+1` leave `Quantity: 1` with an empty Console, and then an unrelated click makes the quantity jump to 3. | Treat every object in state as read-only, and hand the setter a new object. |
| **Principle 2** | **Always Spread First, Update Last** | A field left out of the new object vanishes from the screen, and a spread written last puts the old value back. | Write `{ ...item, giftWrap: true }`: the spread first, the change last. |
| **Principle 3** | **Spread Is Shallow, So Copy Every Level** | A write into `nextItem.delivery` also changes `initialItem`, so `Start over` cannot bring back Morning. | Copy every level on the path: `{ ...item, delivery: { ...item.delivery, time: 'Evening' } }`. |
| **Principle 4** | **Write One Handler for Multiple Inputs** | A copy-pasted handler writes the message into `recipient`, and a `name` that matches no field adds a stray field, with no warning. | Give each box a `name` equal to its field, and write `setItem({ ...item, [e.target.name]: e.target.value })`. |

---

## PRINCIPLE | I Clicked +1 Twice, So Why Does the Card Still Say Quantity: 1?

> [!PRINCIPLE]
> **Principle 1: Always Replace the Object, Never Edit It in Place: Treat State Objects as Read-Only**
>
> *Do not just edit a field in state. You cannot simply write `item.quantity = 2`: this doesn't work. You need to create a brand-new object and pass it to `setItem`. What if you pass a modified `item` back into `setItem`? React will treat it as unchanged and skip the render.*
>
> When you click `+1`, you expect the count to increase by one immediately. Yet when you mutate the object, nothing happens on screen. First, `setItem` compares the object you pass in with the object it already holds. How? It uses `Object.is` and asks a simple question: *Is this the SAME object, or is it a NEW object?* It does not care if you changed the value of `item.quantity`, or if you changed any other field. It cares about only one question: whether the object reference points to a DIFFERENT object or the SAME object. If you give it the same object with a mutated value, guess what: `setItem` does not care. Whether you increased or decreased `item.quantity`, it does not care; it only cares whether `item` is the same object or a new one. `Object.is` never looks inside an object to check its fields. The solution is simple: give `setItem` a brand-new object. React sees a distinct object, replaces `item`, and renders the card at once.
>
> **DO THIS:**
> ```jsx
> function handleAddOne() {
>   ~setItem({ quantity: item.quantity + 1, giftWrap: item.giftWrap });~ // A brand-new object: React sees a new reference and shows Quantity: 2
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleAddOne() {
>   ~item.quantity = item.quantity + 1;~ // **WRONG:** Mutates the same object in memory, so React skips the render
>   setItem(item);
> }
> ```

Before opening the card file, compare two setter calls. Suppose `score` is 2:

```jsx title="A new number vs. a mutated object"
setScore(~5~); // A new number: Object.is(2, 5) is false, so React renders
item.quantity = 2;
setItem(~item~); // The same object: Object.is(item, item) is true, so React skips the render
```

It looks the same, but it is NOT the same thing! In the developer's mind, both calls hand the setter "the new value". But a new number is always a different value, while a mutated object is still the same object.

Now here is the card from the intro, in its files. `App` only renders the card:

```jsx title="src/App.jsx"
import ~CartItem~ from './components/CartItem.jsx'; // The card component from the components folder

export default function App() {
  return <CartItem />;
}
```

`CartItem` holds `item`, the two handlers, and the card. The two marked lines are the mistake:

```jsx title="src/components/CartItem.jsx"
import { useState } from 'react';

export default function CartItem() {
  const [item, setItem] = useState({ quantity: 1, giftWrap: false });

  function handleAddOne() {
    ~item.quantity = item.quantity + 1;~ // **WRONG:** mutates the object React holds
    ~setItem(item);~ // **WRONG:** the same object, so React skips the render
  }

  function handleGiftWrap() {
    setItem({ quantity: item.quantity, giftWrap: true });
  }

  return (
    <section>
      <h1>Coffee mug</h1>
      <p>Quantity: {item.quantity}</p>
      <p>Gift wrap: {item.giftWrap ? 'Yes' : 'No'}</p>
      <button onClick={handleAddOne}>+1</button>
      <button onClick={handleGiftWrap}>Add gift wrap</button>
    </section>
  );
}
```

The state variable inside `handleAddOne` comes from the `useState` call at the top of the component. Each render creates fresh handlers, and each handler closes over the `item` snapshot of that render. So `item.quantity = ...` writes straight into the object React holds in state.

The fix is one line. The handler builds a new object, with every field written by hand:

```jsx title="src/components/CartItem.jsx" startLine="6"
function handleAddOne() {
  ~setItem({ quantity: item.quantity + 1, giftWrap: item.giftWrap });~ // A new object: React renders the new quantity
}
```

Save the file, reload the page, and click `+1` twice again:

::: row caption="Two clicks on +1 when handleAddOne mutates item vs. when handleAddOne passes a new object."
::: col title="item.quantity = ... in handleAddOne" tag="same object: no render" tone=bad
```page size=mini
heading: Coffee mug
line: Quantity: 1 | bad
line: Gift wrap: No
line: [+1] [Add gift wrap]
console: quiet
```
The object in memory holds 3, but `Object.is` saw the same object twice, and React skipped both renders.
:::
::: col title="A new object in handleAddOne" tag="new object: 2, then 3" tone=good
```page size=mini
heading: Coffee mug
line: Quantity: 3 | good
line: Gift wrap: No
line: [+1] [Add gift wrap]
console: quiet
```
Each click hands the setter a new object, so the card shows 2, then 3, and the gift wrap stays on No.
:::
:::

---

## PRINCIPLE | I Added Gift Wrap, So Where Did the Quantity Go?

> [!PRINCIPLE]
> **Principle 2: Always Spread First, Update Last: The Setter Replaces, It Never Merges**
>
> *When you only want to change one field, you cannot just pass `{ giftWrap: true }` to `setItem`: that wipes out every other field on the object. You must copy the existing fields first with `...item`, and write your changed field AFTER it. What if you put `...item` at the end? The old value from `...item` will overwrite your new change.*
>
> When you click to add gift wrap, you only want to flip `giftWrap` to `true` and leave `quantity` untouched. Yet if you simply pass `{ giftWrap: true }` to `setItem`, the quantity disappears from the screen. Why? Because `setItem` never merges your update with the old object. It throws the old object away and replaces it with the exact object you pass in. Any field you leave out is gone for good. To keep your other fields alive, you must copy them into the new object using `...item`. And here, order is everything. Inside a new object, JavaScript writes fields from left to right. If the same field name appears twice, guess what: the *last* one wins. Put `...item` first, and JavaScript copies in all the old fields, `quantity: 1` and `giftWrap: false`. Write `giftWrap: true` after it, and your new value overwrites the old `false`. Flip that order and put `...item` last, and `...item` immediately steps over your change and writes the old `false` right back.
>
> **DO THIS:**
> ```jsx
> function handleGiftWrap() {
>   setItem({ ~...item, giftWrap: true~ }); // Old fields first, changed field last: Quantity: 1, Gift wrap: Yes
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleGiftWrap() {
>   setItem(~{ giftWrap: true }~); // **WRONG:** No quantity in the new object, so the quantity line goes empty
>
>   setItem({ ~giftWrap: true, ...item~ }); // **WRONG:** The spread comes last and overwrites true with the old false
> }
> ```

The fixed `handleAddOne` writes every field by hand. With two fields, that is fine. With ten fields, it gets long, so a developer looks for a shorter way. A developer who expects the setter to merge the new field into the old object writes only the field that changes:

```jsx title="src/components/CartItem.jsx" startLine="10"
function handleGiftWrap() {
  ~setItem({ giftWrap: true });~ // **WRONG:** a new object with one field, and no quantity
}
```

The shopper clicks `Add gift wrap` once:

```page width=text caption="After one click on Add gift wrap: the gift wrap is on, and the quantity line is empty."
heading: Coffee mug
line: Quantity: | bad
line: Gift wrap: Yes | good
line: [+1] [Add gift wrap]
console: quiet
```

**The page now displays an empty quantity**, and the Console stays quiet. The fix is a new tool, built on the three dots you already know:

> [!DEFINITION]
> **Object spread.** [NEW] OK, we have seen that the setter needs a new object. But writing every field by hand, `{ quantity: item.quantity, giftWrap: true }`, gets long when the object has five or ten fields. Remember the three dots on a JSX tag? `<ArticleCard {...article} />` opens the `article` object and copies all of its properties onto the tag (Lesson 9). Inside the curly braces of an object, the same three dots do the same job: `{ ...item, giftWrap: true }` builds a NEW object, copies every field of `item` into it, and then writes `giftWrap: true`. That is object spread. But why copy the old fields at all? Because a setter REPLACES the state with the exact object you pass. Notice that word: REPLACE, not merge. `setItem({ giftWrap: true })` does not add gift wrap to the old object. It replaces the whole object with one that holds only `giftWrap`. And the quantity? Gone! The card shows `Quantity:` with nothing after it. Here is the catch: order matters. JavaScript builds the object from left to right, and when the same field appears twice, the last one wins. In `{ ...item, giftWrap: true }`, the spread copies `giftWrap: false` first, and then `giftWrap: true` overwrites it: the gift wrap is on. In `{ giftWrap: true, ...item }`, `giftWrap: true` comes first, and then the spread copies the old `false` over it: the gift wrap stays off, with no error. The rule is simple: spread first, the changed field last (Lesson 17).

So `...item` and `giftWrap: true` can sit in the same object. Then there are two ways to order them:

```jsx title="The two ways to order ...item and giftWrap: true in one object"
setItem({ ~...item, giftWrap: true~ }); // The change comes last: the card shows Gift wrap: Yes
setItem({ ~giftWrap: true, ...item~ }); // The spread comes last: the card shows Gift wrap: No
```

Did you notice the detail? With the spread last, React does NOT skip the render. The object is new, so React renders. It renders the old `false`, because the spread wrote it last.

And what about the long version with every field by hand? Compare the two:

```jsx title="Every field by hand vs. object spread"
setItem({ ~quantity: item.quantity~, giftWrap: true }); // Every field written by hand
setItem({ ~...item~, giftWrap: true }); // The spread copies quantity for you
```

Yes, it is the exact same thing! Both build a new object with the old quantity and the new gift wrap. The spread just keeps working when the object grows. So both handlers of the card now use it:

```jsx title="src/components/CartItem.jsx" startLine="6"
function handleAddOne() {
  ~setItem({ ...item, quantity: item.quantity + 1 });~ // Copies giftWrap, then writes the new quantity
}

function handleGiftWrap() {
  ~setItem({ ...item, giftWrap: true });~ // Copies quantity, then turns the gift wrap on
}
```

The shopper clicks `Add gift wrap` again, and the quantity stays:

```page width=text caption="After one click on Add gift wrap with the spread: Quantity: 1 and Gift wrap: Yes."
heading: Coffee mug
line: Quantity: 1 | good
line: Gift wrap: Yes | good
line: [+1] [Add gift wrap]
console: quiet
```

---

## PRINCIPLE | I Clicked Start Over, So Why Does the Delivery Still Say Evening?

> [!PRINCIPLE]
> **Principle 3: Spread Is Shallow, So Copy Every Level: Never Mutate a Nested Object**
>
> *To change a nested field like `item.delivery.time`, you cannot just spread the outer object with `{ ...item }` and then write `nextItem.delivery.time = 'Evening'`. One spread only copies the top level. You must copy EVERY object on the path to your change: `{ ...item, delivery: { ...item.delivery, time: 'Evening' } }`. What if you only spread the outer object and edit `delivery` directly? You silently corrupt the inner `delivery` object that your old state, and even `initialItem`, still shares.*
>
> When you switch the delivery slot to `'Evening'`, you might think writing `const nextItem = { ...item }` makes it safe to edit `nextItem.delivery.time = 'Evening'`. After all, `nextItem` is a brand-new object, right? Only on the surface. Why? Because the `...` spread is *shallow*: it only goes one level deep. It creates a NEW outer object, but the inner `delivery` field still points to the EXACT SAME `delivery` object in memory. That single inner object is shared by `nextItem`, by `item`, and even by your starting `initialItem`. If you write `nextItem.delivery.time = 'Evening'`, guess what: you are mutating that shared inner object directly. Later, when you click *Start over* to reset the card back to `initialItem`, the reset is broken: `initialItem` already says `'Evening'` because you overwrote its shared `delivery` object. The solution is simple: spread every level on the path to the change. Spread `...item` to build a new outer object, and spread `...item.delivery` inside it to build a brand-new `delivery` object, leaving the old one safely on `'Morning'`.
>
> **DO THIS:**
> ```jsx
> function handleEvening() {
>   setItem({ ...item, ~delivery: { ...item.delivery, time: 'Evening' }~ }); // A new outer object AND a new inner delivery object
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleEvening() {
>   const nextItem = { ...item };
>   ~nextItem.delivery.time = 'Evening';~ // **WRONG:** Mutates the inner delivery object that item and initialItem still share
>   setItem(nextItem);
> }
> ```

The card grows by one part. A shopper picks a delivery time, and a `Start over` button brings the card back to how it began. The delivery has two values that belong together, so it is an object inside `item`. To let `Start over` reset the card, the starting object moves above the component, as `initialItem`:

```jsx title="src/components/CartItem.jsx" startLine="3"
const ~initialItem~ = { // The starting object, outside the component, so Start over can reuse it
  quantity: 1,
  giftWrap: false,
  ~delivery~: { address: '12 Main Street', time: 'Morning' }, // An object inside the object
};
```

The card gains the line `Delivery: 12 Main Street, Morning` and two buttons, Deliver in the evening and Start over.

**Beware! One spread copies only the outer object. A write into the inner object through the copy also changes the starting object, so `Start over` cannot undo it.**

The developer already knows the rule: copy before you change. And the developer remembers one more idea:

> [!DEFINITION]
> **Local mutation.** [REVIEW] OK, we have seen that changing an object that already lives in state is a mutation, and React never sees it. So is every `=` on an object forbidden? NO. Remember local mutation? Changing a brand-new object or array that you just created, inside the same function, is completely fine, because no other code points at it yet. So inside a click handler, `const nextItem = { ...item }` builds a fresh object, and `nextItem.quantity = 2` changes only that fresh copy. Then `setItem(nextItem)` hands React a new object, `Object.is` is false, and React renders. That is the exact same thing as writing `setItem({ ...item, quantity: 2 })`. Here is the catch: "brand-new" must be true for every object you change. `nextItem` is new. But is everything INSIDE `nextItem` new as well? Keep that question in mind (Lesson 14).

Trusting local mutation, the developer writes the evening handler like this:

```jsx title="src/components/CartItem.jsx"
const [item, setItem] = useState(initialItem);

function handleEvening() {
  const nextItem = { ...item };
  ~nextItem.delivery.time = 'Evening';~ // **WRONG:** nextItem is new, but nextItem.delivery is not
  setItem(nextItem);
}

function handleStartOver() {
  ~setItem(initialItem);~ // Hands React the starting object again
}
```

The shopper clicks `Deliver in the evening`:

```page width=text caption="After one click on Deliver in the evening: the delivery says Evening."
heading: Coffee mug
line: Quantity: 1
line: Gift wrap: No
line: Delivery: 12 Main Street, Evening | good
line: [+1] [Add gift wrap] [Deliver in the evening] [Start over]
console: quiet
```

It looks like it worked. Then the shopper clicks `+1` twice, and the card says `Quantity: 3`. Then the shopper clicks `Start over`:

```page width=text caption="After Start over: the quantity is back to 1, but the delivery still says Evening."
heading: Coffee mug
line: Quantity: 1 | good
line: Gift wrap: No
line: Delivery: 12 Main Street, Evening | bad
line: [+1] [Add gift wrap] [Deliver in the evening] [Start over]
console: quiet
```

**The page now displays the wrong delivery.** `Start over` brought the quantity back to 1, but the delivery still says `Evening`. One new idea explains where it came from:

> [!DEFINITION]
> **A shallow copy.** [NEW] OK, we have seen how object spread `{ ...item, quantity: 2 }` builds a brand-new object so React can render. But what happens when the object in state holds another object inside it, such as `delivery: { address: '12 Main Street', time: 'Morning' }`? That brings us to a shallow copy. Pay attention here: object spread looks like it copies everything, but it only copies the top level! React's docs say that when the code runs, there is no such thing as a nested object: there are two different objects, and the outer one only points at the inner one. Think of the outer `item` box holding a card with the address of a second box, the `delivery` box, somewhere else in memory. When you write `const nextItem = { ...item }`, JavaScript builds a new outer box, but for `delivery` it copies only the card: `item.delivery` and `nextItem.delivery` point at the exact same inner box. That is why it is called a shallow copy, and not a deep copy! As long as you only read `delivery`, that is completely safe, but the moment you write `nextItem.delivery.time = 'Evening'`, you mutate the shared inner box that `item` still points at. Here is the catch, caught in action: the shopper clicks `Deliver in the evening`, and the handler runs `const nextItem = { ...item }`, then `nextItem.delivery.time = 'Evening'`, then `setItem(nextItem)`. `nextItem` is a new outer box, so React renders, and the card shows `Evening`. It looks like it worked, right? Now the tricky part: the shopper clicks `Start over`, whose handler runs `setItem(initialItem)` to bring back `Morning`. Does the card go back to `Morning`? NO, it stays on `Evening`! Why? Because `initialItem.delivery` points at that same inner box too, and `nextItem.delivery.time = 'Evening'` wrote into it. No line of the reset handler wrote `Evening`, but the starting object was changed through the shared inner box. The rule is simple: spread is shallow. To change a nested field, copy every object on the path from the changed field up to the top: `setItem({ ...item, delivery: { ...item.delivery, time: 'Evening' } })` (Lesson 17).

Here is who points at that one inner object. On the first render, React returns the starting object directly, so `item` and `initialItem` reference the exact same container:

```tree caption="After one spread, initialItem, item, and nextItem all point at one delivery object, so a write through nextItem reaches initialItem too."
One `delivery` object, three ways to reach it
- !`initialItem.delivery` | Points at **the inner delivery object** | `Start over` hands React this object, and it now says **Evening**
- !`item.delivery` | On the first render, `item` **is** `initialItem` | Points at **the same inner object**
- !`nextItem.delivery` | `{ ...item }` made it **point at the same inner object** | `nextItem.delivery.time = 'Evening'` writes into **the shared object**
```

Now the question from local mutation has its answer. Is everything inside `nextItem` new as well? NO. Compare two writes on the same fresh copy:

```jsx title="A write into the fresh copy vs. a write into a shared inner object"
const nextItem = { ...item };
~nextItem.quantity = 2;~ // Fine: quantity lives in the new outer object
~nextItem.delivery.time = 'Evening';~ // **WRONG:** delivery is the old inner object, shared with item and initialItem
```

It looks the same, but it is NOT the same thing! Both lines start with `nextItem`. The first writes into the object this handler just created, so it is local mutation. The second walks through `nextItem` into an object this handler never created.

The fix copies both levels, the outer object and the delivery object:

```jsx title="src/components/CartItem.jsx"
function handleEvening() {
  setItem({ ...item, ~delivery: { ...item.delivery, time: 'Evening' }~ }); // A new delivery object: the old one stays on Morning
}
```

**Where did `address` come from?** No line of the fix writes it. The inner spread `...item.delivery` copies it into the new inner object. The shopper clicks through the sequence again: evening delivery, two quantity increments, and then the reset button:

```page width=text caption="After the same clicks with the two-level copy: Start over brings back Quantity: 1 and Morning."
heading: Coffee mug
line: Quantity: 1 | good
line: Gift wrap: No
line: Delivery: 12 Main Street, Morning | good
line: [+1] [Add gift wrap] [Deliver in the evening] [Start over]
console: quiet
```

---

## Four Ways to Build the New Object

Every principle so far ends the same way: the setter gets a new object. Developers build that new object in four ways, and each one fits a different case. The first three are code you write yourself:

```jsx title="Three ways to write the new object for setItem"
setItem({ ~quantity: item.quantity + 1, giftWrap: item.giftWrap~ }); // 1. Every field by hand
setItem({ ~...item~, quantity: item.quantity + 1 }); // 2. Object spread
setItem(~prevItem => ({ ...prevItem, quantity: prevItem.quantity + 1 })~); // 3. Spread inside an updater function
```

Here is when each approach fits best:

1. **Every field by hand.** This fits a small object with one or two fields, or data constructed directly from a mouse event like coordinates `x` and `y`.
2. **Object spread.** This is the standard choice for everyday updates when an object has several fields. Creating a local copy with spread and modifying it locally before passing it to the setter achieves the exact same result.
3. **Spread inside an updater function.** This fits when a single user action queues multiple updates to the same object before React renders. The updater function receives the pending state, named `prevItem`, and builds upon it (Lesson 16). Calling the updater function three times in one handler advances the quantity from 1 to 4 while preserving other fields. In contrast, calling plain spread three times leaves the quantity at 2 because all three calls read the same snapshot.
4. **Immer.** This is an optional library designed for deeply nested state. It lets you write direct assignments like `draft.delivery.time = 'Evening'` while generating immutable copies automatically under the hood. Another architectural alternative for deeply nested data is flattening the state structure (Lesson 22).

**Beware of missing parentheses in the updater function.** Immediately after the arrow `=>`, JavaScript interprets an opening curly brace as the start of a function body rather than an object literal. Without wrapping parentheses, an arrow function returning an object spread fails to parse. Vite immediately displays an error overlay with `[PARSE_ERROR] Unexpected token` pointing at the three dots, and the page stays blank. Wrapping the object in parentheses `({ ... })` tells the JavaScript parser to treat the curly braces as an object expression.

---

## PRINCIPLE | I Typed Hi in Message, So Why Does the Card Say To: Hi?

> [!PRINCIPLE]
> **Principle 4: Write One Handler for Multiple Inputs: Let `[e.target.name]` Pick the Field to Update**
>
> *When your `item` state object holds text for several `<input>` boxes, such as `item.recipient` and `item.message`, do not write a separate `onChange` function for every single input. Instead, use ONE shared `handleChange` function for all of them. How does one function know which field to update? Give each `<input>` a `name` attribute that matches its field in state, `name="recipient"` and `name="message"`, and wrap `e.target.name` in square brackets inside the setter: `setItem({ ...item, [e.target.name]: e.target.value })`. What if you misspell the attribute on the tag, like `name="msg"` instead of `name="message"`? React will not warn you: it will silently create a useless `item.msg` field in state while `item.message` on your screen stays blank.*
>
> Imagine your card has two text boxes: a `To` box, which updates `item.recipient`, and a `Message` box, which updates `item.message`. How do you wire them up? The naive approach is to write `handleRecipientChange` for the first box, copy-paste it to create `handleMessageChange` for the second box, and change the field name inside. Look closely at those two functions, though: they are 99% identical. The only difference between them is a single word: `recipient` versus `message`. If you copy-paste the first function and forget to change `recipient` to `message`, guess what happens: when the shopper types `"Hi"` into the `Message` box, that handler writes `"Hi"` straight into `item.recipient` on the `To:` line, with zero warnings in the Console. The solution is simple: replace all those copy-pasted functions with **one single `handleChange` function**, in two steps. First, **label each `<input>` tag with a `name` attribute** that matches its exact property name in your state object: `<input name="recipient" />` and `<input name="message" />`. Second, **use square brackets `[e.target.name]` as the property key** inside `setItem({ ...item, [e.target.name]: e.target.value })`. Why the square brackets? Without brackets, JavaScript literally creates a field named `field`. With square brackets, JavaScript reads the string inside `e.target.name` first and uses *that* as the field name. Type into `<input name="message" />`, and `[e.target.name]` becomes `message`. Type into `<input name="recipient" />`, and the exact same line becomes `recipient`. Just make sure your `name="..."` spelling matches your state object letter for letter, or JavaScript will quietly invent a stray field that nothing on your card reads.
>
> **DO THIS:**
> ```jsx
> function handleChange(e) {
>   setItem({ ...item, ~[e.target.name]~: e.target.value }); // One shared handler: [e.target.name] becomes "recipient" or "message" automatically
> }
>
> <label>To <input ~name="recipient"~ onChange={handleChange} /></label> {/* Each input tells handleChange which state field it owns via name="..." */}
> <label>Message <input name="message" onChange={handleChange} /></label>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleRecipientChange(e) {
>   setItem({ ...item, recipient: e.target.value });
> }
>
> function handleMessageChange(e) {
>   setItem({ ...item, ~recipient~: e.target.value }); // **WRONG:** Copy-pasted from above and forgot to change "recipient" to "message"!
> }
>
> <label>To <input onChange={handleRecipientChange} /></label>
> <label>Message <input onChange={handleMessageChange} /></label>
> ```

The card grows one last time. A shopper who sends the mug as a gift writes a short gift card: who it is for, and a message. To support gift orders, `initialItem` adds two empty string fields for recipient and message. The card gains text lines for recipient and message, while two input boxes let the shopper type them. Because these input boxes have no `value` prop, each box manages its own text locally (Lesson 13). Only the card text lines display state values.

Each box needs a handler that copies what the user types into `item`. Before the first box, one reminder:

> [!DEFINITION]
> **The event object.** [REVIEW] OK, we have seen that when the user clicks a button, React calls your event handler. React also hands that handler one argument, the event object, which we name `e`. You never pass `e` yourself: React does, as the first argument, in `function handleChange(e)`. And `e.target` is the element where the event started (Lesson 11). Until now, that element was a clicked button. Now it is a text box. When the user types in `<input name="message" onChange={handleChange} />`, React calls `handleChange` on EVERY keystroke, and `e.target` is that very box. So `e.target.value` holds the text in the box right now (e.g. `Hi`), and `e.target.name` holds the `name` attribute written on the tag (e.g. `message`). Here is the catch: `e.target.name` is NOT a field of `item`. It is only the string you wrote in `name="..."` on the tag, nothing more (Lesson 11).

**Beware! A copy-pasted handler can write into the wrong field, and nothing warns you.**

The developer writes a handler for the `To` box. Then the developer copies it for the `Message` box, renames it, and leaves one word unchanged:

```jsx title="src/components/CartItem.jsx"
function handleRecipientChange(e) {
  setItem({ ...item, recipient: e.target.value });
}

function handleMessageChange(e) {
  setItem({ ...item, ~recipient~: e.target.value }); // **WRONG:** copied from above, and still writes recipient
}

<label>To <input onChange={handleRecipientChange} /></label>
<label>Message <input ~onChange={handleMessageChange}~ /></label> {/* Every keystroke here calls handleMessageChange */}
```

The shopper types `Hi` in the `Message` box:

```page width=text caption="After typing Hi in the Message box: the card shows the message on the To line."
heading: Coffee mug
line: Quantity: 1
line: Gift wrap: No
line: Delivery: 12 Main Street, Morning
line: To: Hi | bad
line: Message: | bad
form:
  field: To |
  field: Message | Hi
line: [+1] [Add gift wrap] [Deliver in the evening] [Start over]
console: quiet
```

**The page now displays the message on the wrong line.** The card says `To: Hi`, and `Message:` stays empty. The input boxes and the card disagree: the message box displays the typed text, but the recipient line above it receives the letters. Here is what happens on every keystroke:

1. Each keystroke in the message box calls `handleMessageChange`.
2. That handler takes `e.target.value` and writes it into the recipient field.
3. The card reads `item.recipient` on its first line, so the greeting appears under the recipient heading.
4. The message input retains what the user typed in the browser DOM, even though `item.message` in React state remains empty.

Two handlers that differ by one word invite this slip. JavaScript has a way to write the field name once, taken from a variable:

> [!DEFINITION]
> **A computed property name.** [NEW] So, we have seen how object spread writes one changed field after the copy: `{ ...item, message: 'Hi' }`. There, the field name `message` is written right in the code. But what if the field name sits in a variable, and you only know it when the code runs? Suppose `const field = 'message'`. Then `{ [field]: 'Hi' }`, with square brackets, tells JavaScript: "read the variable `field` first, and use its value as the field name". The result is `{ message: 'Hi' }`. That is a computed property name. Now pay attention here: `{ field: 'Hi' }`, without the brackets, is NOT the same thing! Without brackets, JavaScript reads no variable at all. It uses the word `field` itself as the name, and builds `{ field: 'Hi' }`. Here is the good news: put the brackets around `e.target.name`, and one handler can update every box: `setItem({ ...item, [e.target.name]: e.target.value })`. The user types in the box with `name="message"`, and `item.message` changes. The user types in the box with `name="recipient"`, and `item.recipient` changes. Here is the catch: the `name` on the tag must match the field in state, letter for letter. Write `name="msg"`, and the handler adds a new field, `msg`, that nothing on the card reads, so `Message:` stays empty, with no error (Lesson 17).

So the card needs only one handler. Each box gets a `name` equal to its field:

```jsx title="src/components/CartItem.jsx"
function handleChange(e) {
  setItem({ ...item, ~[e.target.name]~: e.target.value }); // The name attribute of the box picks the field
}

<label>To <input ~name="recipient"~ onChange={handleChange} /></label> {/* Typing here changes item.recipient */}
<label>Message <input ~name="message"~ onChange={handleChange} /></label> {/* Typing here changes item.message */}
```

The shopper enters a recipient name in the first box and a greeting in the second:

```page width=text caption="After typing Mia in To and Hi in Message with one shared handler: each line shows its own text."
heading: Coffee mug
line: Quantity: 1
line: Gift wrap: No
line: Delivery: 12 Main Street, Morning
line: To: Mia | good
line: Message: Hi | good
form:
  field: To | Mia
  field: Message | Hi
line: [+1] [Add gift wrap] [Deliver in the evening] [Start over]
console: quiet
```

Two handlers written right and one `handleChange` give the exact same screen. The difference is in the code: with one handler, there is no second copy where a word can be left behind.

One slip is still possible: a `name` that matches no field. Suppose the developer shortens the name on the `Message` box:

```jsx title="src/components/CartItem.jsx"
<label>Message <input ~name="msg"~ onChange={handleChange} /></label> {/* **WRONG:** item has no msg field */}
```

Typing `Hi` in that box leaves `Message:` empty. Inspecting the state object in the console reveals the problem: state now holds an extra field named `msg` containing the typed characters. React issues no warning because JavaScript objects allow arbitrary properties.

---

## All 4 Principles Together

### The complete files

The entry file mounts `App` inside `<StrictMode>`:

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    ~<App />~ {/* React calls App first */}
  </StrictMode>
);
```

`App` renders the card:

```jsx title="src/App.jsx"
import CartItem from './components/CartItem.jsx';

export default function App() {
  return ~<CartItem />~; // React calls CartItem second
}
```

`CartItem` holds `item` and every handler. Each handler hands `setItem` a new object:

```jsx title="src/components/CartItem.jsx"
import { useState } from 'react';

const ~initialItem~ = { // Principle 3: the starting object, never written into
  quantity: 1,
  giftWrap: false,
  delivery: { address: '12 Main Street', time: 'Morning' },
  recipient: '',
  message: '',
};

export default function CartItem() {
  const [item, setItem] = useState(initialItem);

  function handleAddOne() {
    setItem({ ~...item~, quantity: item.quantity + 1 }); // Principles 1 and 2: a new object, the spread first
  }

  function handleGiftWrap() {
    setItem({ ...item, ~giftWrap: true~ }); // Principle 2: the change last
  }

  function handleEvening() {
    setItem({ ...item, ~delivery: { ...item.delivery, time: 'Evening' }~ }); // Principle 3: a new delivery object
  }

  function handleStartOver() {
    setItem(initialItem);
  }

  function handleChange(e) {
    setItem({ ...item, ~[e.target.name]~: e.target.value }); // Principle 4: the box's name picks the field
  }

  return (
    <section>
      <h1>Coffee mug</h1>
      <p>Quantity: {item.quantity}</p>
      <p>Gift wrap: {item.giftWrap ? 'Yes' : 'No'}</p>
      <p>Delivery: {item.delivery.address}, {item.delivery.time}</p>
      <p>To: {item.recipient}</p>
      <p>Message: {item.message}</p>
      <label>To <input name="recipient" onChange={handleChange} /></label>
      <label>Message <input name="message" onChange={handleChange} /></label>
      <button onClick={handleAddOne}>+1</button>
      <button onClick={handleGiftWrap}>Add gift wrap</button>
      <button onClick={handleEvening}>Deliver in the evening</button>
      <button onClick={handleStartOver}>Start over</button>
    </section>
  );
}
```

### How React calls the components, and what one click calls again

On the first load, React starts at `App` and follows the tags down. On subsequent updates, passing a new object to the setter causes React to re-render only `CartItem`, because that is where state lives:

```tree caption="The order in which React calls App and CartItem on the first load, and what a click with a new object calls again."
`main.jsx` mounts `App` inside `<StrictMode>`
- +1. `App` | React calls it **first** | Returns `<CartItem />`
  - +2. `CartItem` | React calls it **second** | `useState` gives `item` and `setItem`, and the card appears
- +A click that hands `setItem` a new object | `Object.is` is **false** | React calls **only `CartItem`** again, because `item` lives there
- !A click that hands `setItem` the same object | `Object.is` is **true** | React **skips the render**, and the card stays as it was
```

The shopper enters text into both boxes and then clicks the reset button:

```page width=text caption="After Start over: the card is back to its starting values, while the two text boxes keep their own text."
heading: Coffee mug
line: Quantity: 1 | good
line: Gift wrap: No | good
line: Delivery: 12 Main Street, Morning | good
line: To: | good
line: Message: | good
form:
  field: To | Mia
  field: Message | Hi
line: [+1] [Add gift wrap] [Deliver in the evening] [Start over]
console: quiet
```

The card is back to its starting values, but the two text boxes still show the typed text. This is not the mutation bug again. The boxes keep their own text, and no box reads state. Making a box show what state holds, with `value`, is the topic of Lesson 20 (Lesson 20).

| Principle | The Plain JavaScript Habit | The React Rule |
| :--- | :--- | :--- |
| **Always Replace the Object, Never Edit It in Place** | Write `item.quantity = 2` and pass `item` back to the setter, which leaves the screen on the old number | Hand the setter a new object, so `Object.is` is false and React renders |
| **Always Spread First, Update Last** | Pass only the changed field, or put the spread after it, expecting the setter to merge | Write `{ ...item, giftWrap: true }`, because the setter replaces and the last field wins |
| **Spread Is Shallow, So Copy Every Level** | Spread once and write into `nextItem.delivery`, which also changes `initialItem` | Copy every level on the path: `{ ...item, delivery: { ...item.delivery, time: 'Evening' } }` |
| **Write One Handler for Multiple Inputs** | Copy-paste one handler per box, and leave a field name behind | Give each box a `name` equal to its field, and write `[e.target.name]` in one handler |

---

## For the Interview

> **The Interview Question:** How do you update an object in state without mutating it?

### How to Answer Clearly in 30 Seconds

"React decides whether to render by comparing the value I pass to the setter with the value it holds, using `Object.is`. For objects, that check only asks whether both are the same object in memory, never whether a field changed. So I treat every object in state as read-only, and three rules follow:
1. **A new object:** writing `item.quantity = 2` and calling `setItem(item)` hands React the same object, so React skips the render. I pass a new object instead.
2. **Spread first, change last:** the setter replaces the object and never merges, so I copy the old fields with `{ ...item, quantity: 2 }`, with the change written after the spread.
3. **Every level on the path:** spread is shallow, so for a nested field I copy each level, as in `{ ...item, delivery: { ...item.delivery, time: 'Evening' } }`. Otherwise I write into an inner object that the old state and the starting object still share."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why does a mutated change show up later, on a click that never touched that field?"**
   Because the object in memory really changed. React skipped the render, not the change. The next render for any reason, such as the new object from `Add gift wrap`, reads the mutated field and puts it on the screen. That is why the bug looks random. React's docs add one detail about the skip: "in some cases React may still need to call your component before skipping the children, it shouldn't affect your code."
2. **"Why doesn't React compare the fields instead?"**
   Speed and simplicity. `Object.is` on two objects is one check, no matter how many fields or levels the object has. If nobody mutates, the docs say, "If `prevObj === obj`, you can be sure that nothing could have changed inside of it." React also does not wrap your objects in hidden Proxies to watch for writes, so plain objects stay plain. And because old objects are never changed, every earlier snapshot stays correct, which makes undo and reset easy.
3. **"Can one `handleChange` with `[e.target.name]` update every kind of field?"**
   Not every kind. For text boxes and a `<select>`, yes, because `e.target.value` holds the text or the chosen option. A checkbox needs `e.target.checked` instead. And the handler updates top-level fields only: a nested field such as `delivery.time` still needs the two-level copy of Principle 3. For state nested many levels deep, the usual answers are to flatten the state (Lesson 22), or to use Immer.
