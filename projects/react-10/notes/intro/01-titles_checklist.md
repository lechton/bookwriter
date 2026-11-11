# Checklist for Titles and Subtitles (v3)


The rules follow the order in which a writer builds a title. These are strong indications that you can overwrite if you consider pertinent to do so. 


## Step 1: Choose the kind of title

### 1. A non-technical title is the plain question the reader would ask

- [ ] When the section explains an idea in everyday words, such as an analogy, is the title the plain question the reader would ask at that point?

```text
GOOD: ### What does "fixed inside a render" mean in practice?
```

### 2. A technical title has two parts: the anchor, a colon, then the explanation

- [ ] Does the left side name the concept, and the right side say what happens?

```text
### [Concept A] `tokenA` vs. [Concept B] `tokenB`: [the repeated term] [a finite verb] [a simple outcome]
### [Concept] `token` in [Context]: [the repeated term or the actor] [a finite verb] [a simple outcome]

### [moral of the story] : concrete example  
### Why the list numbers climb: `Item` adds `1` to `let number` on every render

```

## Step 2: The anchor, left of the colon

### 3. Use only names that already exist

- [ ] Does every name in the title come from authoritative places: the code (`let number`, `setNumber`, `items.push`), React's docs (state variable, state setter, render, snapshot, pure, side effect, local mutation, event handler), or plain JavaScript (`const`, a function, an array) or known computer science terminology? NEVER invent your own terms like "outside variable vs local variable"
- [ ] Does a description stay a plain description? Capital letters turn a description into what looks like a term, such as "Outside Variable", and the reader then looks for a term that React and JavaScript do not have.
- [ ] Does the title say it the way the lesson explains it? 

```text
BAD (an invented name for a variable at the top of the file):
### Outside Variable `let number` Inside a Render: the component modifies `number` on every render and breaks the page

BAD (two invented names, "Prop Mutation" and "Local Copy"):
### Prop Mutation `items.push` vs. Local Copy `items.slice`: a prop mutation changes the parent's array, while a local copy leaves the parent's array untouched

BAD (an invented name for `<StrictMode>`):
### Development Check `<StrictMode>` on First Load: ...

GOOD 
### Mutate the original array items `items.push` vs. mutate a copy `items.slice()`: we always mutate a copy



### 4. Hook each code token with backticks, never with parentheses

- [ ] Does each code token sit in backticks right after the words that name it? Tokens such as `items.slice()` or `setTimeout()` carry their own parentheses, so parentheses around them confuse the reader.



### 5. Name the code concept, not the metaphor

- [ ] When the section uses an analogy (a book, a printed photo), does a technical title still name the code concept? A developer scans the sidebar for the code, such as `let number` or `setNumber`, never for "the book".

```text
BAD: ### The Book Analogy: Existing Data vs. Local Copies
BAD: ### How Writing in the Book Breaks a Real Page
BAD: ### How an Old Photo Breaks a Real Page

GOOD: ### Why the list numbers climb: `Item` adds `1` to `let number` on every render


### 6. The anchor only names what the section is about

- [ ] Can the reader take in the whole title at a glance? The anchor does not list tokens only to fill the formula, because the reader then meets the same tokens twice.

```text
BAD (the anchor lists both tokens, and the explanation repeats them):
### The Rule of Thumb for State Variable `number` and Local Variable `nextNumber`: the state variable `number` keeps its old value during the click, so save the new value in `nextNumber` first

GOOD:
### The Rule of Thumb: `setNumber` does not give you the new number, so calculate it yourself in `nextNumber`
```

## Step 3: The explanation, right of the colon

### 7. Repeat the exact term, and keep one name for each thing with lazer-focus of precision 

- [ ] Does the explanation repeat the exact term from the anchor, not a synonym or a pronoun?
- [ ] Does each thing keep the same name in every title of the chapter? `nextNumber` is the "Local Constant" in every title, never a "Local Variable" in one of them.

```text
BAD (a pronoun after the colon, finding imaginary terms Outside Mutation etc):
### Outside Mutation vs. Local Mutation: the first way alters old data and breaks the component

BAD (a synonym after the colon):
### State Setter `setNumber` vs. State Variable `number`: calling the updater leaves the local value unchanged

GOOD:
## State Setter `setNumber` vs. State Variable `number`: the state setter `setNumber` schedules the next render and leaves `number` at `12` in the current render


> Notice it says the "next" and the "current" in the proper positions in the title, the precision is lazer focus!

```

### 8. Use finite verbs, not chains of -ing words

- [ ] Does the explanation use a subject and a finite verb ("the handler reads", "the component modifies"), not -ing words that blur noun and verb?

```text
BAD: ### Why Changing Existing Data During Rendering Breaks Updating Components
BAD: ### Passing the item number as a prop
BAD: ### Prop Mutation `items.push` vs. Local Copy `items.slice`: mutating the `items` prop corrupts parent data, while a local copy keeps the component pure

GOOD: ### `setTimeout` Inside an Event Handler: the `setTimeout` will read the old `number` even after three seconds
```

### 9. Explain in simple words but keep the moral of the story as value judgement

- [ ] Does the explanation use the words a developer says at the keyboard, not academic terms or slang?

```text
BAD: ## The Collision Between Synchronous Execution and Scheduled Render Snapshots
BAD: ### JavaScript Object Reference Passing: Props Are Pointers, Not Clones
BAD: ### The zombie announcement: calling ticket 12 while ticket 13 sits on screen

BAD (it misses the moral of the story): ### `items.push` on a Prop Array: the child component changes the parent array `groceries` on every render


Here are four GOOD titles with a value judgement. Each one keeps the code facts from your title and adds a word or two that tells the reader this is a mistake.

1. "Bad practice":

```text
### `items.push` on a Prop Array: it is bad practice when the child component changes the parent array `groceries` on every render
```

2. "Instead of", which also names the right way:

```text
### `items.push` on a Prop Array: instead of a copy, the child component changes the parent array `groceries` on every render
```

3. "By mistake", plus the damage the reader sees:

```text
### `items.push` on a Prop Array: the child component changes the parent array `groceries` by mistake, and `'Shopping bags'` piles up on every render
```
4. The moral as an order:

```text
### `items.push` on a Prop Array: we never push into a prop, because the child component changes the parent array `groceries` on every render
```



### 11. Try to be specific when you present paths, sequence, logic, e.g. "after" and "before" can mean: placed, written,  rendered etc

- [ ] Does every "after", "before", "later", "then" etc explain with precision which order it means? On its own, "after `setNumber`" means nothing, it cannot tell whether it is the line placed after `setNumber` in the code, or the screen rendered after the click.
- [ ] Is the order spelled out: placed after or before (the lines in the code), written after (the order in which the developer writes the code), rendered after or before (a render of React)? Same for every other position in sequence, in logic, in path dependency, precision is key. If the moment is a click, a handler, or a render, the title can name that moment instead.

```text
BAD (right away after what?):
... the local constant `nextNumber` holds `13` right away ...

BAD (written after, or rendered after?):
### Why the loudspeaker calls the wrong customer: `number`, writen after `setNumber` in the code, is still `12`

Mention in the title EXACTLY the nuance of sequence, position, order etc,if  is it after or before a render, if it concerns a position in writen code, if it concerns running after during the execution of the code etc. 
```

### 12. When a section traces a bug, name the actor and the numbers on the screen

- [ ] Does the title say who acts (React, `<StrictMode>`, `handleNext`) and what the screen shows (`1, 2, 3` into `2, 4, 6`, or `13` and `12`)?

```text
BAD: ### The Initial Mount Double-Call: Odd Numbers Vanish into Even Outputs
BAD: ### How each render creates its own handler and how the substitution method traces it

BAD (on the First load is NOT specific!): ### `<StrictMode>` on the First Load: `<StrictMode>` calls `<Item />` twice and turns `1, 2, 3` into `2, 4, 6`


BAD (traces bug + TOO absorbed in the specific example, it should not be merely descriptive of the example but describe the phenomenon overall): ### `<StrictMode>` calls `Item` twice on the first load: `Item` adds `1` twice, so the list opens as `2, 4, 6` instead of `1, 2, 3`


GOOD (traces bug + explains general phenomenon, the example is an opportunity to see the operational principle): ### `<StrictMode>` calls every component twice: `Item` adds `1` twice so the list opens as `2, 4, 6` instead of `1, 2, 3`

```

## Step 4: The special titles

### 13. The Rule of Thumb title gives the moral of the story

- [ ] Does the title fix the exact belief that causes the bug, and tell the reader what to do? The reader who reads only this title should know what is at stake.

```text
BAD (an empty slot):
### The Rule of Thumb

BAD (the time word means nothing, and the trap is missing):
### Local Constant `nextNumber` vs. State Variable `number`: the local constant `nextNumber` holds `13` right away for `setNumber` and `setAnnouncement`

BAD (correct, but heavy):
### The Rule of Thumb for State Variable `number` and Local Variable `nextNumber`: the state variable `number` keeps its old value during the click, so save the new value in `nextNumber` first

BAD (it seems nice, but it lacks the reason, what is going on):
### The Rule of Thumb: `setNumber` does not give you the new number, so calculate it yourself in `nextNumber`

BAD (Lesson 14):
### The Rule of Thumb: a render only reads `props` and `state`, and every change goes in `onClick`

GOOD (it is very precise on what happens when)
### The Rule of Thumb: `setNumber` hands 13 to the next render, not to the current one, so calculate it yourself in `nextNumber`


```
