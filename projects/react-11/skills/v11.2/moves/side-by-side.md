---
name: move-side-by-side
description: "The move for a difference between two ways of writing the same code."
---

# Side by Side #2026_11_07_11_group_2

## When to use it

Use it when the idea is the difference between two ways of writing the same thing, such as changing an object in state or passing a new one.

## How to do it

1. Say in one sentence what the two ways share, then the one difference.
2. Show the two ways. When each fits on one line, put both in one block, as Lecture 03 does. Otherwise give each its own block. A comment on the key line says what the page shows.
3. Explain each side in plain words, then draw both in a tree figure when it helps.
4. Give the verdict straight away, in one of these two voices:
   - **"Yes, it is the exact same thing!"** when the two look different but do the same.
   - **"It looks the same, but it is NOT the same thing!"** when the two look alike but behave differently. Then say why in one or two sentences.

Name each code block by its one difference. Never call them "Way 1" and "Way 2".

## A good and a bad example

**PROPER** (adapted from the Lecture 17 opening):

````markdown
Compare two ways to change the name when the user clicks the button.

```jsx title="Changing user.name inside the existing object"
function handleClick() {
  ~user.name = 'Alice';~
  ~setUser(user);~ // The same object goes back to React: the page stays on John
}
```

```jsx title="Passing a brand-new object to setUser"
function handleClick() {
  ~setUser({ name: 'Alice' });~ // A new object goes to React: the page shows Alice
}
```

It looks the same, but it is NOT the same thing! In both, the object holds Alice. But React draws the page again only when it gets a new object, so only the second way changes the page.
````

**PROPER** (Lecture 03):

````markdown
```jsx title="Passing a style object by name, and writing it in place"
<p ~style={boxStyle}~>Hello</p> {/* boxStyle holds { color: 'red' } */}
<p ~style={{ color: 'red' }}~>Hello</p> {/* The same object, written in place */}
```

Yes, it is the exact same thing! The outer curly braces step into JavaScript, and the inner ones are an ordinary object.
````

**COUNTER-EXAMPLE** (the Lecture 21 opening, 2026-11-07):

> Look at the click handler again. It does not hide the button, and it does not write Thanks! anywhere. It only puts the word `'sent'` into `status`. The component already holds both pictures of the page. While `status` is `'typing'`, the picture is a Send button. When it becomes `'sent'`, the picture is the line Thanks!. The click only changes which picture is true, and React draws that picture.

*Why this fails*: Seven sentences tell again what a one-line handler already shows, and there is no second way to compare it with.
