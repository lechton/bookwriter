---
name: intro
description: "How the intro of a lecture is written, from the short question under the title to the Rule of Thumb: the owner's checklist and the owner's intros for Lessons 14, 15, and 16. Read it before writing the Intro part of the prelecture or the start of a lecture."
---

# The Intro #2026_11_12_04_group_1

## What the intro is

The owner's words, 2026-11-12:

> "I've written some very clear and lucid opening sections here, which inspired the 16 example we have studied together."

What this asks:
1. **The owner's intros are the model.** The intros for Lessons 14, 15, and 16 are the examples to follow. Read all three before you write an intro: [14.md](14.md), [15.md](15.md), [16.md](16.md).
2. **The intro is the start of the lecture.** It runs from the short question under the title to the Rule of Thumb. The example page and the principles come after it.
3. **Copy the shape, not the words.** Each intro follows the checklist below. A new lesson keeps the order and the moves, with its own screen, its own names, and its own image.

## The owner's checklist

Copied unchanged:

> Each question names something the ideal opening does that a weaker draft does not.
>
> **The start**
>
> - [ ] Does a short question under the title tell the reader what the chapter is about? *("Who decides when your component runs: you or React?")*
> - [ ] Is every term the opening needs reminded first, one per numbered line, with its lesson in parentheses?
> - [ ] Does the opening start from what the reader already knows, then say in one short line where React breaks it? *("In plain JavaScript, you call a function only when you want an action to happen. React components break this rule.")*
>
> **The theory**
>
> - [ ] Is the mental model given as a plain-words sentence in quotes showing what React asks your code, or what your code asks React? *("Given these props and this state, what should the screen look like right now?" / "The next time you call my component function, pass me `13` instead of `12`.")*
> - [ ] Does the opening say why React needs the rule, not only what the rule is? *(React calls again so the reconciler can compare the old screen with the new one.)*
> - [ ] Is each new technical word named at the moment the reader meets the thing it names? *("Changing anything outside the component is called a side effect.")*
> - [ ] Do the core rules quote React's official docs, and put any hard word into plain actions right away? *(Explaining "asynchronous" as waiting three seconds inside a timer or waiting for a server reply.)*
>
> **The analogy**
>
> - [ ] Does the opening use an everyday object (a book, a printed photo) where the rule is obvious at a glance?
> - [ ] Does the analogy map back to the code item by item, and say what breaks for each item? *(The outside counter "corrupts the next render", and the prop array "silently corrupts the parent's data too".)*
> - [ ] Does every "this is fine" come with its reason? *(Local mutation is fine "because nobody outside that render ever sees the copy".)*
>
> **The example on the page**
>
> - [ ] Does a bold "Beware!" line give the moral before each scenario, not only once?
> - [ ] Is the scenario grounded in what users do every day before the specific case? *("Users click things on the screen all the time: opening a menu, switching a tab, or toggling Dark Mode.")*
> - [ ] Does the mistake happen in the exact place a developer writes that code? *(In Lesson 14, the counter changes during the render. In Lesson 15, `setNumber` is called inside an event handler.)*
> - [ ] Does the setup name every variable or setter needed to produce the wrong screen? *(Naming `setAnnouncement` so the second line on screen stays at `12` while the first line updates to `13`.)*
> - [ ] Does the wrong result on the page come first, and the step-by-step "what went wrong" after it?
> - [ ] Does the closing paragraph say how the bug hides or tricks you on your computer, and what breaks for real users? *(Without `StrictMode` the bug hides until a real user clicks; or `console.log` prints the old value while the payment server gets the wrong total.)*
>
> **The rule of thumb**
>
> - [ ] Does the opening end with the senior developer's advice: one bold rule, then numbered actions?
> - [ ] Does each action name the real confusion it prevents? *(`push` on a prop and `push` on a copy "seem to do the same job... They are NOT the same!")*
> - [ ] Does each action say what goes wrong if you skip it? *(Turning `StrictMode` off "only hides the bug on your computer until a real click breaks the page for your users".)*
>
> **The whole opening**
>
> - [ ] Do named sections let a reader jump to any part and still follow the logic? *(The Book Analogy, How Writing in the Book Breaks a Real Page, The Rule of Thumb.)*
> - [ ] Does each sentence say who acts, such as React, your handler, or the clerk?

## The right code after the wrong code #2026_11_12_09_group_1

The owner's words, 2026-11-12, about the scenario of the Lesson 17 intro:

> "After reading this code [the wrong `handleAddOne`], and then after reading the rest of the text and cramming through the end of the section, I have no idea what is the proper code that should have been written. It is an endless description that feels to the reader like: Oh... you pressed 3 but you have 1! Now listen to A, listen to B, listen to C... D... E..... An endless stream without resolution of what happened. Each step explains what is wrong, and it is confusing because everything feels wrong."

> "Present the proper solution initially, where it fits, as a strange solution. When a reader sees something strange, it is a good way to just describe it, like looking at an alien, from earth's perspective. Look at the proper response, what can you see? Before going to the detailed explanation, what do you notice? (This can be presented in a single line, alone!) See the pattern?"

> "Make it shorter, what you write is too long."

What this asks:

1. **The reader sees the right code.** After the wrong code and the wrong screen, the scenario shows the code that should have been written, and the screen it gives. The reader does not finish the scenario with only wrong things in mind.
2. **Where it fits, as a strange line.** Show the right code alone, in a single line when it fits in one. Before any explanation, describe only what the eye sees, as if looking at something alien: what looks strange, and what is written out in full. The explanation comes after.
3. **Short.** A few sentences.

**COUNTER-EXAMPLE** (Lesson 17, Gemini 3.8, 2026-11-12, before the fix): the wrong `handleAddOne`, the card after two clicks, the card after `Add gift wrap`, a long definition box, a table of the clicks, how the bug hides, and the Rule of Thumb. The right code appears only as a fragment in the middle of the definition box.

*Why this fails*: the owner reached the end of the section with "no idea what is the proper code that should have been written".

**PROPER** (Lesson 17, 2026-11-12, approved with "ppp"). It fits right after the two wrong screens, before the definition box that explains them:

````markdown
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
````

## Four things that differ from the three intros

1. **The reminders.** The terms the intro reminds are the `[REVIEW]` definitions of the prelecture, written by [definitions/SKILL.md](../definitions/SKILL.md). In the three intros, written before that skill, they are short numbered lines.
2. **The new words.** Each new word is named once, at the moment the reader meets the thing it names, as the checklist asks and as [definitions/SKILL.md](../definitions/SKILL.md) Section 5 says.
3. **The titles.** Write every title of the intro by [titles/SKILL.md](../titles/SKILL.md). Two titles in [16.md](16.md) use an -ing word: "passing `score + 1` replaces the state" and "Calling `setScore(score + 1)` Three Times in One Click". Do not copy them.
4. **Brackets.** The short question under the title keeps its brackets, and the build allows them. Everywhere else, follow rule 7 of [lecture/SKILL.md](../lecture/SKILL.md): brackets only point to an earlier lesson. The other brackets in the three intros, such as "(the **reconciler**)" or "(`12`)", are not copied.
