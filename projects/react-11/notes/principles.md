Principle 1

**Title:** Always Replace the Object, Never Edit It in Place: Treat State Objects as Read-Only

**Summary:** Do not just edit a field in state. You cannot simply write `item.quantity = 2`—this doesn't work. You need to create a brand-new object and pass it to `setItem`. What if you pass a modified `item` back into `setItem`? React will treat it as unchanged and skip the render.

**Description:** When you click `+1`, you expect the count to increase by one immediately. Yet when you mutate the object, nothing happens on screen. First, `setItem` compares the object you pass in with the object it already holds. How? It uses `Object.is` and asks a simple question: *Is this the SAME object, or is it a NEW object?* It does not care if you changed the value of `item.quantity`, or if you changed any other field. It cares about only one question: whether the object reference points to a DIFFERENT object or the SAME object. If you give it the same object with a mutated value, guess what—`setItem` does not care. Whether you increased or decreased `item.quantity`, it does not care; it only cares whether `item` is the same object or a new one. `Object.is` never looks inside an object to check its fields. The solution is simple: give `setItem` a brand-new object. React sees a distinct object, replaces `item`, and renders the card at once.

✓ DO THIS
function handleAddOne() {
  // A brand-new object: React sees a new reference and shows Quantity: 2
  setItem({ quantity: item.quantity + 1, giftWrap: item.giftWrap }); 
}

✗ DO NOT DO THIS
function handleAddOne() {
  // WRONG: Mutates the same object in memory, so React skips the render
  item.quantity = item.quantity + 1; 
  setItem(item);
}

-------------

**Principle 2**

**Title:** Always Spread First, Update Last: The Setter Replaces, It Never Merges

**Summary:** When you only want to change one field, you cannot just pass `{ giftWrap: true }` to `setItem`—that wipes out every other field on the object. You must copy the existing fields first with `...item`, and write your changed field *after* it. What if you put `...item` at the end? The old value from `...item` will overwrite your new change.

**Description:** When you click to add gift wrap, you only want to flip `giftWrap` to `true` and leave `quantity` untouched. Yet if you simply pass `{ giftWrap: true }` to `setItem`, the quantity disappears from the screen. Why? Because `setItem` never merges your update with the old object. It throws the old object away and replaces it with the exact object you pass in. Any field you leave out is gone for good. To keep your other fields alive, you must copy them into the new object using `...item`. And here, order is everything. Inside a new object, JavaScript writes fields from left to right. If the same field name appears twice, guess what—the *last* one wins. Put `...item` first, and JavaScript copies in all the old fields (`quantity: 1, giftWrap: false`). Write `giftWrap: true` after it, and your new value overwrites the old `false`. Flip that order and put `...item` last, and `...item` immediately steps over your change and writes the old `false` right back.

**✓ DO THIS**

```javascript
function handleGiftWrap() {
  // Old fields first, changed field last: Quantity: 1, Gift wrap: Yes
  setItem({ ...item, giftWrap: true }); 
}

```

**✗ DO NOT DO THIS**

```javascript
function handleGiftWrap() {
  // WRONG: No quantity in the new object, so the quantity line goes empty
  setItem({ giftWrap: true }); 

  // WRONG: The spread comes last and overwrites true with the old false
  setItem({ giftWrap: true, ...item }); 
}

```

---

**Principle 3**

**Title:** Spread Is Shallow, So Copy Every Level: Never Mutate a Nested Object

**Summary:** To change a nested field like `item.delivery.time`, you cannot just spread the outer object with `{ ...item }` and then write `nextItem.delivery.time = 'Evening'`. One spread only copies the top level. You must copy *every* object on the path to your change: `{ ...item, delivery: { ...item.delivery, time: 'Evening' } }`. What if you only spread the outer object and edit `delivery` directly? You silently corrupt the inner `delivery` object that your old state—and even `initialItem`—still shares.

**Description:** When you switch the delivery slot to `'Evening'`, you might think writing `const nextItem = { ...item }` makes it safe to edit `nextItem.delivery.time = 'Evening'`. After all, `nextItem` is a brand-new object, right? Only on the surface. Why? Because the `...` spread is *shallow*—it only goes one level deep. It creates a NEW outer object, but the inner `delivery` field still points to the EXACT SAME `delivery` object in memory. That single inner object is shared by `nextItem`, by `item`, and even by your starting `initialItem`. If you write `nextItem.delivery.time = 'Evening'`, guess what—you are mutating that shared inner object directly. Later, when you click *Start over* to reset the card back to `initialItem`, the reset is broken: `initialItem` already says `'Evening'` because you overwrote its shared `delivery` object. The solution is simple: spread every level on the path to the change. Spread `...item` to build a new outer object, and spread `...item.delivery` inside it to build a brand-new `delivery` object, leaving the old one safely on `'Morning'`.

**✓ DO THIS**

```javascript
function handleEvening() {
  // A new outer object AND a new inner delivery object
  setItem({ ...item, delivery: { ...item.delivery, time: 'Evening' } }); 
}

```

**✗ DO NOT DO THIS**

```javascript
function handleEvening() {
  const nextItem = { ...item };
  // WRONG: Mutates the inner delivery object that item and initialItem still share
  nextItem.delivery.time = 'Evening'; 
  setItem(nextItem);
}

```


---------

**Principle 4**

**Title:** Write One Handler for Multiple Inputs: Let `[e.target.name]` Pick the Field to Update

**Summary:** When your `item` state object holds text for several `<input>` boxes—such as `item.recipient` and `item.message`—do not write a separate `onChange` function for every single input. Instead, use **one** shared `handleChange` function for all of them. How does one function know which field to update? Give each `<input>` a `name` attribute that matches its field in state (`name="recipient"`, `name="message"`), and wrap `e.target.name` in square brackets inside the setter: `setItem({ ...item, [e.target.name]: e.target.value })`. What if you misspell the attribute on the tag, like `name="msg"` instead of `name="message"`? React will not warn you—it will silently create a useless `item.msg` field in state while `item.message` on your screen stays blank.

**Description:** Imagine your card has two text boxes: a `To` box (which updates `item.recipient`) and a `Message` box (which updates `item.message`). How do you wire them up? The naive approach is to write `handleRecipientChange` for the first box, copy-paste it to create `handleMessageChange` for the second box, and change the field name inside. Look closely at those two functions, though: they are 99% identical. The only difference between them is a single word—`recipient` versus `message`. If you copy-paste the first function and forget to change `recipient` to `message`, guess what happens: when the shopper types `"Hi"` into the `Message` box, that handler writes `"Hi"` straight into `item.recipient` on the `To:` line, with zero warnings in the Console.

The solution is simple: replace all those copy-pasted functions with **one single `handleChange` function** in two steps:

1. **Label each `<input>` tag with a `name` attribute** that matches its exact property name in your state object: `<input name="recipient" />` and `<input name="message" />`.


2. **Use square brackets `[e.target.name]` as the property key** inside `setItem({ ...item, [e.target.name]: e.target.value })`. Why the square brackets? Without brackets, JavaScript literally creates a field named `field`. With square brackets, JavaScript reads the string inside `e.target.name` first and uses *that* as the field name. Type into `<input name="message" />`, and `[e.target.name]` becomes `message`. Type into `<input name="recipient" />`, and the exact same line becomes `recipient`. Just make sure your `name="..."` spelling matches your state object letter for letter, or JavaScript will quietly invent a stray field that nothing on your card reads.



**✓ DO THIS**

```jsx
function handleChange(e) {
  // One shared handler: [e.target.name] becomes "recipient" or "message" automatically
  setItem({ ...item, [e.target.name]: e.target.value }); 
}

// Each input tells handleChange which state field it owns via name="..."
<label>To <input name="recipient" onChange={handleChange} /></label>
<label>Message <input name="message" onChange={handleChange} /></label>

```

**✗ DO NOT DO THIS**

```jsx
function handleRecipientChange(e) {
  setItem({ ...item, recipient: e.target.value });
}

function handleMessageChange(e) {
  // WRONG: Copy-pasted from above and forgot to change "recipient" to "message"!
  setItem({ ...item, recipient: e.target.value }); 
}

<label>To <input onChange={handleRecipientChange} /></label>
<label>Message <input onChange={handleMessageChange} /></label>

```