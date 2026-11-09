---
name: examples
description: "Full passages from react-10 lectures, each a PROPER example beside a COUNTER-EXAMPLE, with the reasons the counter-example fails and what is at stake. Read the entry closest to your lesson before writing an opening or a principle."
---

# Examples and Counter-Examples #2026_11_09_02_group_1

## Why this file exists

Short rules stopped helping. Each new rule fixed one passage and pushed the next lecture somewhere else, and the writer kept obeying the words of the rules instead of seeing what a good passage does. The writer copies what it reads. So this file holds whole passages, with their code blocks and figures, exactly as the reader sees them.

Every entry has the same parts:
1. **The question** of the lesson, from the question bank.
2. **The topic and the essence.** The topic is what the interview question names. The essence is the one fact underneath it that the reader can grasp at once. They are often not the same thing.
3. **PROPER**: a passage the owner approved or wrote, in full.
4. **COUNTER-EXAMPLE**: a passage the owner rejected, in full.
5. **Why the counter-example fails**: the reasons, explained, so the writer understands the failure instead of memorizing a ban.
6. **What is at stake**: what the reader gains or loses.

Read the entry closest to your lesson. Copy its shape and its order, not its words. A PROPER passage is added only when the owner has written or approved it.

---

## Entry 1: Controlled Inputs (Lecture 20 Opening)

### The question

> How do you make an input, textarea, or select fully controlled by React state?

### The topic and the essence

The topic is the controlled input: an input with `value` and `onChange`. That is what the interview asks about, and what the principles of the lesson teach.

The essence is much simpler, and it comes first. With a `<p>`, React state shows up on the screen by itself. An input is different: the browser gives it its own memory, so state can neither see what the user types nor clear it. That is one fact, said in two sentences, and every reader who has used state in a `<p>` can check it against what they already know.

Once the reader holds that fact, the controlled input is no longer a pattern to memorize. It is the obvious fix. `value` takes the box away from the browser's memory and gives it to state. That makes typing stop, so `onChange` is needed to bring the keystrokes back into state. Each step solves the problem the step before leaves.

### PROPER (the owner's opening, 2026-11-09)

````markdown
## Why an Input Is Different from Every Other Tag

### Browser memory vs. React state

With normal elements like `<p>` or `<h1>`, changing the screen is simple: you put a state variable inside the tag, update the state, and the screen updates.

```jsx title="State inside a normal tag"
const [text, setText] = useState('John');

<p>~{text}~</p> {/* Shows John, and shows Mia right after setText('Mia') */}
```

Form inputs (`<input>`, `<textarea>`, `<select>`) are different because the browser gives them their own private memory. When a user types into a plain HTML input, the browser updates the text on its own. Your React component cannot see what is inside the input while the user types, and cannot change or clear the input simply by updating state.

```jsx title="A plain input keeps its own text"
const [text, setText] = useState('John');

~<input />~ {/* The browser keeps what the user types: text never sees it, and setText('') cannot clear it */}
```

To make an input work like the rest of React, where changing state changes the screen, we make it a controlled input in two steps:

1. **Lock the input to state with `value`:** Writing `value={text}` tells the input to ignore its own browser memory and display only what is inside the `text` state variable. Now, whenever your code changes `text`, for example by calling `setText("")` when the user clicks Clear or Send, the input updates on screen immediately.
2. **Let keystrokes update state with `onChange`:** Once `value` is locked to `text`, typing on the keyboard won't change the input unless `text` itself changes. Adding `onChange` takes every keystroke the user types and saves it into `text`, so the input and the rest of your component update together on every letter.

```jsx title="A controlled input: value and onChange"
const [text, setText] = useState('John');

<input
  ~value~={text} // Shows only what text holds
  ~onChange~={e => setText(e.target.value)} // Saves every keystroke into text
/>
```

When an input has both `value` and `onChange`, React state is in complete control: the screen always shows state, and typing simply updates state.

```tree dir=right caption="The two steps that make an input controlled: value locks the input to state, and onChange lets typing reach state."
Two steps make an input controlled
- +Step 1: Lock the input to state [`value={text}`] | The input **shows only what `text` holds** | Setting `text` to empty **clears the input at once**
- +Step 2: Let typing reach state [`onChange`] | Every keystroke is **saved into `text`** | The input and the rest of the component **update together**
```
````

### COUNTER-EXAMPLE (the Lecture 20 opening, 2026-11-09, rejected by the owner)

````markdown
## Why a Form Needs Its Text in State

### A box that keeps its own text vs. a box controlled by React state

When you fill out a **Contact Us** form on a website, the page does more than just let you type inside a box. Under the **Message** box, a character count updates with every letter you type. When you click **Send**, every box on the form clears back to empty at once.

In plain HTML, a text box keeps its own text inside the browser. The rest of your component cannot read that text while the user types, and cannot clear the box without reaching directly into the page element.

In React, **state** decides what the box shows. Instead of letting the box keep its own text, we link the box to a state variable in a two-way loop with two props:
1. **`onChange` sends every change from the box into state:** whenever the user types a letter, `onChange` updates the state variable. Because the text lives in state, the character count under the box updates on every keystroke.
2. **`value` sends state back into the box:** writing `value` on the box makes it show whatever the state variable holds on every render. When the user clicks **Send**, we reset the state variable to an empty string, and both the box and the count clear together.

A form field wired to state with both props is called a **controlled** box, because React state controls what it shows on every render. Think of a classroom whiteboard: students call out answers through `onChange`, only state writes on the board, and through `value` the board shows only what state holds.

```tree caption="An uncontrolled box keeps its own text inside the browser; a controlled box links the box and React state in both directions with onChange and value."
Two ways a form box holds its text
- !An uncontrolled box in the browser | The browser **keeps the typed text inside the box** | Resetting state **leaves the old text on screen**
- +1. From the box into state [`onChange`] | Updates the **state variable** on every keystroke by the user | The character count **updates on every letter**
- +2. From state back into the box [`value`] | Forces the box to **show what state holds** on every render | Emptying state on Send **clears the box and the count together**
```
````

### Why the counter-example fails

1. **It opens on the topic instead of the essence.** The title and the first lines are about controlled boxes, a two-way loop, and two props. The one fact that makes all of it necessary, that an input has its own memory in the browser, appears only as a side sentence in the second paragraph. The reader is handed the solution before feeling the problem.

2. **It starts from a form tour instead of from what the reader already knows.** The reader must first picture a Contact Us form, a Message box, a character count, and a Send button that clears every box. None of these is the idea. The reader already knows the one thing that makes the idea clear: state inside a `<p>` updates the screen by itself. The PROPER opening starts there, so the difference of the input stands out at once.

3. **The steps come in an order where the second one has no reason.** It gives `onChange` first and `value` second. Read in that order, `onChange` looks like a way to feed a counter, and `value` looks like an extra for clearing the form. The reader cannot see why both are needed. In the PROPER order, `value` comes first and locks the box, which makes typing stop, which is exactly why `onChange` must come next. The order itself is the explanation.

4. **It names a mechanism instead of stating facts.** "A two-way loop" is a label the reader must decode. The PROPER opening says the plain facts: the input shows only what `text` holds, and every keystroke is saved into `text`. The reader can check each fact against the code.

5. **The image adds a third scene for a word that needs none.** After the form and the loop, a classroom whiteboard arrives to explain *controlled*. But the word already says what it means: React state controls what the box shows. The PROPER opening says that in one plain sentence, "React state is in complete control", and needs no picture.

6. **It shows no code while the idea forms.** The only visual is a summary figure at the end. The reader never sees a `<p>` with state, a plain `<input />`, or the two props on one tag. The PROPER opening shows each of these right after the sentence that describes it, so every claim has its code next to it, and the figure at the end only collects what the reader has already seen.

### What is at stake

The reader who learns the essence can debug both broken boxes without being told about them. A box with `value` and no `onChange` refuses every letter, because the box is locked to state and nothing changes state. A box with `onChange` and no `value` cannot be cleared, because the browser still owns its text. Both bugs follow from the one fact about browser memory. A reader who memorized "use `value` and `onChange` together" knows the recipe but cannot explain either bug, and cannot answer the interview follow-up "why is it called controlled?".

The lesson gains too. Every principle after the opening, the text area, the menu, the tick box, and the Send button that clears the form, is the same fix applied to another input. With the essence in place, each principle is short. Without it, each principle has to explain the loop again.

### What carries over

The interview question names the topic, but the opening starts from the essence: the one fact underneath, compared with something the reader already uses. Then the steps follow in the order where each solves the problem the one before leaves, each with its code beside it, and one figure collects them at the end.
