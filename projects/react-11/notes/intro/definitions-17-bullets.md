# Definitions for Lesson 17: Updating Objects in State (Bullet Version)

A hierarchy of definitions in bullet points, from the simplest prerequisite to the one-sentence summary of the whole chapter. This is the bullet version of `definitions-17.md`. It carries the same information, restructured with titles, subtitles, and one extensive explanation per bullet.

`☆` marks a prerequisite: a term from an earlier lesson or from plain JavaScript that Lesson 17 assumes you already hold. `★` marks a new concept: a term Lesson 17 teaches. Read the file from top to bottom. Each definition builds on the ones above it.

## Keywords

- **Prerequisites:** object, reference, `Object.is`, state and setter, render and snapshot, event handler, batching and update queue, updater function, object spread, computed property name.
- **New concepts:** state object, read-only state, mutation vs. replacement, spread inside a state update, shallow copy, copy every level on the path, computed property name inside a state update, one handler for many inputs, the whole chapter in one definition.

## How the definitions build

- **The prerequisite chain:** an object and a reference, then state and its setter, then a render and a snapshot, then an event handler, then batching and the update queue, then an updater function, then object spread, and finally a computed property name.
- **The new-concept chain:** a state object, then read-only state, then mutation versus replacement, then spread inside a state update, then a shallow copy, then copying every level on the path, then a computed property name inside a state update, then one handler for many inputs, and finally the whole chapter in one definition.

## ☆ Prerequisites

### ☆ 1. An object and a reference

- **The definition:** An object is a box in memory with named fields inside it, so when you write `const user = { name: 'John', age: 30 }`, JavaScript builds that box and the variable `user` holds a reference to the box, not a copy of its contents.
- **The contrast with a number:** A number is a value you hold directly, so `0` is `0` and you cannot open it and change its insides, while an object is a container whose fields you can change from the inside with a line such as `user.name = 'Alice'`.
- **The catch:** Two variables can hold a reference to the same box, so after `const sameUser = user` both variables point at one object and changing `sameUser.name` changes what `user.name` shows too, and two objects can also look identical and still be two separate boxes because `{ name: 'Alice' }` written twice creates two boxes with the same contents.
- **Why React cares:** React never opens the box to compare the fields inside it, and it only asks whether the box you handed it is the same box it already holds, so keep this box image in mind for the whole lesson.

### ☆ 2. State and its setter

- **The definition:** In React, state is the value a component keeps between renders, and it always arrives as a pair made of the state variable and its setter, so for the order card the pair is `order` and `setOrder`, declared together in one line as `const [order, setOrder] = useState(initialOrder)`. EVERY. SINGLE. TIME.
- **How you use the pair:** You read `order` during a render and you call `setOrder` when the order changes, and the setter does not merge or edit the old value; it replaces the old value with whatever you pass.
- **The rule that surprises people:** The replacement rule sounds obvious for a number because `setCount(5)` replaces `0` with `5`, but for an object it is easy to forget that `setOrder({ quantity: 2 })` does not keep the item, the gift wrap, the customer, or the delivery details, and every field you left out becomes `undefined`.
- **Why the rest of the lesson exists:** The setter's job is replacement and your job is to hand it a complete replacement, which is why the rest of Lesson 17 spends so much time on building a complete new object. (Lesson 12)

### ☆ 3. A render and a snapshot

- **The definition:** A render is one full call of your component function, and you never call the component yourself; React calls it, runs its body from the first line to the last, and works out what the screen should look like from the JSX it returns.
- **When React renders:** React renders on the first load of the page, again after every state change, and again whenever the parent renders, so the component body runs far more often than a beginner expects.
- **The snapshot:** Each render sees a snapshot of state whose values are fixed for that render, so inside one event handler `order.quantity` does not change under your feet even after you call `setOrder`, and the new value appears only in the next render when React calls the component again with the new snapshot.
- **The catch for objects:** The snapshot holds a reference to the state object rather than a deep copy of it, so mutating the object's fields changes the snapshot that earlier renders still point at, and React does not notice because the reference is the same even though the values behind it have changed; that is how a mutation can hide in memory and then appear on the screen during a later, unrelated render. (Lessons 13 and 15)

### ☆ 4. An event handler

- **The definition:** An event handler is the function you attach to a user action such as `onClick` or `onChange`, and you write it while React calls it when the user acts, running it from top to bottom.
- **The example:** In the order card, `handleAddOne` is the event handler for the `+1` button, and it does not run when the page loads; it waits until the shopper clicks and then runs once for that click.
- **The timing:** The screen does not update line by line while the handler runs, because React waits until the whole handler has finished and only then applies the queued state updates and renders the component again, which is why a long handler with an `alert` can leave the screen showing old values behind the pop-up while the handler is still running.
- **How to read the code:** Read every handler as one complete unit; all the lines run first, and the screen catches up at the end. (Lesson 11)

### ☆ 5. Batching and the update queue

- **The definition:** Batching is React's habit of grouping the state updates from one event handler into a single render, so if a handler calls two setters, React does not render after the first call and again after the second; it waits for the handler to finish, collects the updates, and renders once.
- **The queue:** For each state variable, React keeps a waiting line called the update queue, every setter call drops one more update at the back of the line, and after the handler finishes React walks that line from first to last in the exact order you called the setters to work out the next state.
- **Separate clicks:** Two separate clicks are never batched together, because the first click finishes its render before the second click runs.
- **The catch:** The queue is a line of updates and not a line of screen changes, so nothing reaches the screen until the handler is done and React walks the queue, which is why a mutation inside the handler can pile up silently while the card still shows the old quantity. (Lesson 16)

### ☆ 6. An updater function

- **The definition:** An updater function is the second way to call a state setter; instead of passing a value, you pass a function such as `setOrder(o => ({ ...o, quantity: o.quantity + 1 }))`, and React calls that function with the pending state, the value the state will have after the updates already in the queue, then uses whatever the function returns as the next state.
- **Why it exists:** It is how several updates to the same state stack up correctly in one click, because a plain value is calculated immediately from the snapshot, so three calls with `order.quantity + 1` all read the same old quantity, while an updater function waits its turn in the queue and builds on the result before it.
- **The catch:** The arrow function returns an object, so the object needs parentheses around it: `o => ({ ...o, quantity: o.quantity + 1 })` returns the new object, while `o => { ...o }` without the parentheses looks like the start of a function body, and JavaScript complains or returns nothing useful. (Lesson 16)

### ☆ 7. Object spread

- **The definition:** Object spread is the three dots that open an object and copy its fields into a new object, so `{ ...user, city: 'Paris' }` takes every field of `user`, copies it into a brand-new object, and then writes `city: 'Paris'` after the copy, leaving the old `user` object untouched because the new object is a separate box.
- **The order rule:** JavaScript reads an object literal from left to right, and when the same property name appears twice the one that comes last wins, so `{ ...user, city: 'Paris' }` ends with `city: 'Paris'` while `{ city: 'Paris', ...user }` ends with the old city from `user` because the spread comes last and copies the old value over the new one.
- **The catch:** Spread copies only the top level of properties, which is why it is called a shallow copy rather than a deep copy, and if `user` has a nested object such as `address`, the new object gets a reference to the same `address` box rather than a new copy of it. Keep that in mind for Principle 3. (Plain JavaScript)

### ☆ 8. A computed property name

- **The definition:** A computed property name is a property name calculated from a variable at runtime, and inside an object literal the square brackets tell JavaScript to evaluate the expression inside them and use the result as the property name.
- **The plain example:** If `const key = 'city'`, then `{ [key]: 'Paris' }` creates `{ city: 'Paris' }`, while `{ key: 'Paris' }` without the brackets creates a property literally named `key`, which is not what you wanted.
- **The React use:** An input tag can carry a `name` attribute, the browser reports it on the event object as `e.target.name`, and the typed text is `e.target.value`, so when you write `{ [e.target.name]: e.target.value }`, JavaScript reads the input's name such as `customer` or `note` and uses that string as the property name, letting one object literal update whichever field the shopper touched.
- **The catch:** The string inside the brackets must match the state field exactly, because a name of `customerName` creates a new property named `customerName` and leaves `order.customer` alone. (Plain JavaScript, plus the browser's event object)

## ★ New Concepts

### ★ 1. A state object

- **The definition:** A state object is one state variable that holds several related fields together, and in the order card `order` holds the item, the quantity, the gift wrap, the customer, the delivery address and time, and the courier note.
- **Why group the fields:** Keeping them together is natural because they describe one order and change together as the shopper edits the card, so you get one clean group instead of six separate state variables.
- **The trade:** The setter replaces the whole object, so every update has to carry the other fields forward, which means you must build a complete new object on every change.
- **The trap:** A state object is not automatically read-only, because JavaScript will let you write `order.quantity = 2` and React will not throw an error, so the next definitions explain why that line is a trap and what to do instead. (Lesson 17)

### ★ 2. Read-only state

- **The definition:** Treat every object in state as read-only: you read `order.quantity` and `order.customer` during a render, and when a field changes you do not write inside the old object, you build a brand-new object with the new value and pass that new object to `setOrder`.
- **The receipt image:** Think of a printed store receipt that you read line by line and never scribble over to change the total, because when the order changes the cashier prints a brand-new receipt.
- **The rule is React's, not JavaScript's:** JavaScript happily lets you mutate an object, and React does not enforce read-only with an error, so if you break the rule the screen may stay frozen with zero warnings in the Console and the change may jump onto the screen later during an unrelated update.
- **Why it matters:** Read-only state is the discipline that prevents that silent class of bug, and every principle in Lesson 17 is a practical way to follow it. (Lesson 17, Principle 1)

### ★ 3. Mutation vs. replacement (Principle 1)

- **The definition:** A mutation changes the inside of the existing box, while a replacement builds a new box and hands it to React, and that distinction is the whole reason React can tell whether the state changed at all.
- **The two code paths:** Mutation does `order.quantity = order.quantity + 1; setOrder(order);`, where the first line changes the field inside the existing object and the second line passes that exact same object back to React, while replacement does `setOrder({ ...order, quantity: order.quantity + 1 });`, where the spread builds a brand-new object and React receives a different box.
- **The comparison:** React compares the old state and the new value with `Object.is`, which asks whether both sides are the same box in memory and never looks inside the curly braces, so for the mutation `Object.is(order, order)` is true and React skips the render, while for the replacement `Object.is(oldOrder, newOrder)` is false and React renders.
- **The bug in action:** The shopper clicks `+1` twice, each click mutates `order.quantity` inside the same object and passes it back, the card still says `Quantity: 1` and the Console shows nothing, but the quantity in memory is already three; then the shopper clicks `Add gift wrap`, that handler builds a brand-new object and copies `order.quantity` which is now three, React sees a different box, renders, and the quantity jumps from one straight to three.
- **The lesson:** Nothing was lost and nothing was magically recovered, because the two mutations were sitting in memory the whole time hidden behind the same reference, and the fix is always the same: do not write inside the old object; build a new object with the changed field and pass that. (Lesson 17, Principle 1)

### ★ 4. Object spread inside a state update (Principle 2)

- **The definition:** The pattern is `setOrder({ ...order, quantity: order.quantity + 1 })`, read from left to right: first `...order` copies every existing field into a new object, then `quantity: order.quantity + 1` writes the changed field after the copy so it wins.
- **Why the spread is necessary:** The setter replaces the whole object rather than merging, so the spread is what keeps the item, the gift wrap, the customer, the delivery, and the note alive.
- **Mistake 1, leaving a field out:** If the gift wrap handler runs `setOrder({ item: order.item, quantity: order.quantity, giftWrap: true })` and forgets `customer`, the new state has no customer field, the card shows `For:` with nothing after it, and the Console is silent.
- **Mistake 2, putting the change before the spread:** `setOrder({ giftWrap: true, ...order })` writes the new value first and then copies the old `giftWrap: false` over it, so the card stays on `Gift wrap: No` even though the handler clearly says true.
- **The rule and the updater version:** The rule is short, spread first and change last, and when several updates to the same object are queued in one click you put the same spread inside an updater function as `setOrder(o => ({ ...o, quantity: o.quantity + 1 }))`, with parentheses around the object so the arrow returns it. (Lesson 17, Principle 2)

### ★ 5. A shallow copy (Principle 3)

- **The definition:** Object spread looks like it copies the whole object, but it copies only the top level, which is why it is called a shallow copy, and that single word explains the nested-object bug in the rest of this definition.
- **The box-and-key image:** Imagine the outer `order` box holds a key to another box called `delivery`, so when you write `const next = { ...order }`, JavaScript builds a new outer box and copies every field, but for the `delivery` field it copies the key and not the room, which means `next.delivery` and `order.delivery` now point at the very same inner box.
- **The trap:** The evening delivery handler does `const next = { ...order }; next.delivery.time = 'Evening'; setOrder(next);`, and because the top-level object is new React renders and the card shows Evening, so it looks like it worked, but the line changed the shared inner delivery box, and if `initialOrder.delivery` points at that same box then the starting order changed too.
- **The failure:** Later the shopper clicks `Start over`, which runs `setOrder(initialOrder)`, the quantity returns to one but the delivery line stays on Evening because the original delivery box no longer holds Morning; no line in `handleStartOver` wrote Evening, the mutation did through a shared reference, and that is the shallow-copy trap: the top object is new, but the nested object is still the old one. (Lesson 17, Principle 3)

### ★ 6. Copying every level on the path (Principle 3)

- **The definition:** The fix for a nested change is to copy every object on the path from the changed field up to the root, so for the delivery time that means two copies: `setOrder({ ...order, delivery: { ...order.delivery, time: 'Evening' } })`.
- **How it works:** Read it from the inside out: the inner `...order.delivery` builds a brand-new delivery box, copies the existing address into it, and sets `time: 'Evening'`, while the outer `...order` builds a brand-new order box, copies every top-level field, and points `delivery` at the new inner box, leaving the original delivery box inside `initialOrder` untouched so it keeps Morning.
- **The quiet detail:** The word `address` does not appear anywhere in that line because the inner spread carries it, and that is the point of spreading every level: you write only the field that changes, and every other field comes along automatically.
- **The test and the generalization:** After the fix the shopper can click `Deliver in the evening`, then `+1` twice, then `Start over`, and both the quantity and the morning delivery return; for a change three levels deep you spread three times, one for each object on the path, and if the nesting gets so deep that the spreads become hard to read, teams either flatten the state or use a helper library such as Immer. (Lesson 17, Principle 3)

### ★ 7. A computed property name inside a state update (Principle 4)

- **The definition:** The pattern is `setOrder({ ...order, [e.target.name]: e.target.value })`, where the spread copies every existing field and the square brackets evaluate `e.target.name`, the `name` attribute of the input that fired, then use that string as the property name while the value is the text the shopper typed.
- **How one handler serves many inputs:** When the customer box fires, `e.target.name` is `customer` and the object updates `customer`; when the note box fires, the same handler updates `note`, so you do not need a separate `handleNameChange` and `handleNoteChange`.
- **The two conditions:** Every input needs a `name` attribute that matches its field in the state object character for character, and the input should display the matching state value such as `value={order.customer}` so the box and the state stay in sync.
- **The trap when the names do not match:** Suppose the name box says `name="customerName"` while the state field is `order.customer`; on every keystroke the handler writes a new property called `customerName`, `order.customer` never changes, the input still displays `order.customer`, so React reverts the box to Anna Lee after every keystroke, the typed letters refuse to stay, the card never updates, and the Console shows zero warnings; the fix is not in the handler but in the input tag, so make the `name` match the state key. (Lesson 17, Principle 4)

### ★ 8. One handler for many inputs (Principle 4)

- **The definition:** A single `handleChange` replaces a pile of near-identical handlers, because without it a form grows one function per box, such as `handleNameChange` for `customer` and `handleNoteChange` for `note`.
- **The copy-paste bug:** The second function is easy to write and easy to get wrong, and the classic bug is a pasted handler that still updates `customer`, so typing in the note box overwrites the customer name while the note stays empty and the note box reverts on every keystroke.
- **How the shared handler works:** With one handler the input itself says which field changed through `setOrder({ ...order, [e.target.name]: e.target.value })`, and the handler does not need to know any field names because it reads the name from the event and updates that field.
- **The contract:** The pattern is safe only when every input's `name` matches a real state key and every input is controlled by the matching state value, so one shared handler is not magic; it is a contract between the input tags and the state object, and the contract holds as long as you keep the names exact. (Lesson 17, Principle 4)

### ★ 9. The whole chapter in one definition

- **The one-paragraph summary:** State can hold an object, so treat that object as read-only: read its fields and never write inside it; React compares the object you pass to the setter with the object it already holds using `Object.is`, which asks whether both sides are the same box in memory rather than whether their fields look alike; mutating the existing box and passing it back keeps the same reference, so React skips the render and the change hides in memory until an unrelated update reveals it; replacing the box with a brand-new object makes `Object.is` false, so React renders.
- **The rest of the chain:** Because the setter replaces the whole object rather than merging, spread the old object first and write the changed field last so no field is lost and the change wins from left to right; spread is shallow, so a nested object is still the same inner box, and you copy every level on the path from the change up to the root; for a form with many fields, give each input a `name` that matches its state key and use one handler with `[e.target.name]: e.target.value`.
- **The chapter in one sentence:** Treat state as read-only, replace the box, spread first and change last, copy every level on the path, and let the input's name choose the field. (Lesson 17)
