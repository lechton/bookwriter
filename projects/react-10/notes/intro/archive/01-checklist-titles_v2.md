## Guidelines for Titles and Subtitles

A reader must be able to strip out all body text, read only the `#`, `##`, and `###` headings in the table of contents, and still learn the entire core lesson of the chapter.

### The Master Title Formula


## NON TECHNICAL TITLES
If the title is not technical, you can be clear and precise, like this: 

`## What does "fixed inside a render" mean in practice?`


## TECHNICAL TITLES 

A common pattern for technical titles, start with `##` or `###` etc heading and then follow a two-part **Anchor : Explanation** structure separated by a colon:

```text
### [Concept A] `tokenA` vs. [Concept B] `tokenB`: [repeated term] [finite active verb] [simple outcome]
```
or, for a single-concept section:
```text
### [Concept] `token` in [Context]: [repeated term or actor] [finite active verb] [simple outcome]
```



If the title is technical then consider these rules: 

---

### 1. Hook Code Tokens Directly with Backticks, Never Parentheses
- [ ] Does every technical noun phrase hook its exact code identifier right next to it in backticks (such as ``Outside Variable `let number` `` or ``State Setter `setNumber` ``)?
- [ ] Are parentheses `()` completely avoided around tokens? Code tokens often contain their own parentheses (like `my_function()`, `items.slice()`, or `setTimeout()`), so wrapping tokens in parentheses creates visual clutter. Use clean backticks instead.
```markdown
BAD (no code tokens):
`### Outside Mutation vs. Local Mutation`

BAD (uses parentheses around tokens):
`### Outside Array Mutation (.push on a Prop) vs. Local Array Mutation (.slice First)`

GOOD (hooks tokens with clean backticks):
`### Outside Mutation `items.push` vs. Local Mutation `items.slice`: an outside mutation changes pre-existing data and breaks purity`

### 2. Repeat the Exact Technical Term After the Colon (Zero Synonym Drift)
- [ ] Does the explanation after the colon repeat the **exact technical term** from the first half of the title instead of switching to a synonym or a vague pronoun? If the left side contrasts `Outside Mutation` vs. `Local Mutation`, the right side must explicitly name `an outside mutation` or `a local mutation`.

BAD (uses vague pronouns or synonyms after the colon):
`### Outside Mutation `items.push` vs. Local Mutation `items.slice`: the first way alters old data and breaks the component`

BAD (switches terminology mid-title):
### State Setter `setNumber` vs. State Variable `number`: calling the updater leaves the local value unchanged

GOOD (repeats the exact term from the polarity):
### Outside Mutation `items.push` vs. Local Mutation `items.slice`: a local mutation changes only a fresh copy and keeps purity

GOOD (repeats the exact term from the polarity):
### State Setter `setNumber` vs. State Variable `number`: the state setter `setNumber` schedules the next render and leaves `number` at `12`





sos =====
Option 2 (Contrasts Prop Mutation vs. Making a Copy with items.slice):
`### Prop Mutation `items.push` vs. `Local Copy` items.slice: mutating the items `prop` corrupts parent data, while a local copy keeps the component pure`


???
`### Local Constant `nextNumber` vs. State Variable `number`: the local constant `nextNumber` holds `13` right away for `setNumber` and `setAnnouncement``

`### The Rule of Thumb for State Variable `number` and Local Variable `nextNumber`: the state variable `number` keeps its old value during the click, so save the new value in `nextNumber` first`




### 3. Use Finite Active Verbs, Never `-ing` Gerund Chains
- [ ] Does the title use plain subject + finite verb clauses (`the component modifies`, `the handler reads`, `the render snapshot locks`) instead of strings of `-ing` words (`changing`, `reading`, `expecting`, `passing`, `updating`)? Chained `-ing` words blur which word is a noun, which is an adjective, and which is a verb.
```markdown
BAD (chained -ing words blur nouns and verbs):
### Why Changing Existing Data During Rendering Breaks Updating Components

BAD (-ing gerund phrase with no finite clause):
### Passing the item number as a prop

BAD (-ing gerund phrase):
### Mistake: Expecting setTimeout to Read the Updated State Variable After Three Seconds

GOOD (clear noun anchor + finite active verb after the colon):
### Outside Variable `let number` Inside a Render: the component modifies `number` on every render and breaks the page

GOOD (clear noun anchor + finite active verb after the colon):
### Read-Only Prop `number` vs. Outside Variable `let number`: the `number` prop keeps `<Item number="{1}"/>` pure across renders

GOOD (clear noun anchor + finite active verb after the colon):
### Delayed Timer `setTimeout` Inside an Event Handler: the `setTimeout` callback reads the old `number` at `12` even after three seconds
```

### 4. Explain the Second Half in Simple Everyday Words (No Academic Jargon)
- [ ] Does the clause after the colon explain *what happens in the code* in simple words a developer speaks at the keyboard, avoiding university-thesis abstractions (`Idempotent Functional Evaluation`, `Heap Reference Invariance`, `Synchronous Execution Collision`)?
```markdown
BAD (academic bloat and noun-itis):
## The Collision Between Synchronous Execution and Scheduled Render Snapshots

BAD (pompous computer-science jargon):
### JavaScript Object Reference Passing: Props Are Pointers, Not Clones

BAD (cryptic slang):
### The zombie announcement: calling ticket 12 while ticket 13 sits on screen

GOOD (simple words + exact tokens):
## State Setter `setNumber` vs. State Variable `number`: the state setter `setNumber` schedules the next render and leaves `number` at `12`

GOOD (simple words + exact tokens):
### Outside Mutation `items.push` on a Prop Array: the child component modifies the parent array `groceries` on every render

GOOD (simple words + exact tokens):
### State Variable `number` After State Setter `setNumber`: the handler reads the old state variable `number` at `12` and calls the wrong customer
```

### 5. Name the Code Mechanism, Never the Metaphor Alone
- [ ] When a section uses a real-life analogy (a book, a printed photo, a kitchen ticket), does the heading name the **React code concept and token**, rather than hiding behind the metaphor? A developer scanning the sidebar for a bug searches for `outside variable`, `prop array`, or `render snapshot`—never `the book` or `an old photo`.
```markdown
BAD (hides the code behind the analogy):
### The Book Analogy: Existing Data vs. Local Copies

BAD (opaque metaphor):
### How Writing in the Book Breaks a Real Page

BAD (opaque metaphor):
### How an Old Photo Breaks a Real Page

GOOD (names the exact code mechanisms and tokens):
### Outside Mutation `items.push` vs. Local Mutation `items.slice`: an outside mutation changes pre-existing data and breaks purity

GOOD (names the exact code mechanisms and tokens):
### Outside Variable `let number` Inside a Render: the component modifies `number` on every render and breaks the page

GOOD (names the exact code mechanisms and tokens):
### Render Snapshot `number` Inside `onClick` and `setTimeout`: the render snapshot locks `number` at `12` for the entire render
```

### 6. Include the Exact Actor and Concrete Numbers on Screen
- [ ] When a section traces execution or a bug, does the heading name *who acts* (`React`, `<StrictMode>`, `handleNext`, `setTimeout`) and the *exact numbers on screen* (`1, 2, 3` to `2, 4, 6`, or `12` vs. `13`)?
```markdown
BAD (vague and passive):
### The Initial Mount Double-Call: Odd Numbers Vanish into Even Outputs

BAD (no concrete numbers or tokens):
### How each render creates its own handler and how the substitution method traces it

GOOD (names `<StrictMode>` and the exact numbers):
### Development Check `<StrictMode>` on First Load: `<StrictMode>` calls `<Item/>` twice and turns `1, 2, 3` into `2, 4, 6`

GOOD (names `setNumber(12 + 1)`, `13`, `12`, and `handleNext`):
### Current Render `number` vs. Next Render `number`: `setNumber(12 + 1)` passes `13` to the next render while `number` stays `12` in `handleNext`

GOOD (names `Render 1`, `Render 2`, `number`, and `handleNext`):
### Render 1 `handleNext` vs. Render 2 `handleNext`: each render seals its own `number` value inside its own `handleNext` closure
```

### 7. Turn Empty Structural Slots and Principle Headers into Complete Rules
- [ ] Never leave a heading as a bare structural label like `### The Rule of Thumb`. Always attach the tokens and state the rule after the colon.
- [ ] Make every `## N. Principle N:` heading a complete, self-contained rule using finite verbs and tokens.
```markdown
BAD (empty structural slot):
### The Rule of Thumb

BAD (jargon label spliced onto a principle):
## 3. Principle 3: Heap Reference Invariance: Never Mutate Incoming Objects or Props During Render

GOOD (Rule of Thumb with tokens + plain-words rule):
### The Rule of Thumb for `props`, `state`, and `onClick`: treat `props` and `state` as read-only and put side effects in `onClick`

GOOD (Rule of Thumb with polarity + plain-words rule):
### Local Constant `nextNumber` vs. State Variable `number`: the local constant `nextNumber` holds `13` right away for `setNumber` and `setAnnouncement`

GOOD (Principle heading with tokens + finite clause):
## 3. Principle 3: Outside Array `items.push` vs. Local Copy `items.slice`: a component never mutates a prop array during render
```

### 8. Keep a Clean Heading Hierarchy (Zero Stacked `##` Duplicates)
- [ ] Does the chapter flow cleanly from `# Chapter Title` -> italic hook question -> `> INTERVIEW QUESTION` -> **one** main `##` opening heading -> `###` subsections? Never stack two `##` headings back-to-back with no body text between them.
```markdown
BAD (stacked duplicate ## headings):
# Pure Components and Where Side Effects Belong
## The Reconciler's Contract: Why React Demands Pure Functions
*(Who decides when your component runs: you or React?)*
**Interview question:** ...
## Why React Components Must Be Pure

GOOD (single clean ## after the chapter header block):
# Lecture 14: Pure Components and Where Side Effects Belong
*(Who decides when your component runs: you or React?)*
> INTERVIEW QUESTION | ❱ CORE | What does it mean for a component to be pure, and what breaks across renders when it is not?

---

## Pure Component `<Item/>` vs. Impure Component: a pure component returns the same JSX for the same `props` and `state`
```

---

### Quick Reference Bank: Weak Titles vs. Master-Formula Titles

| Weak / Old Title | Master-Formula Title (Tokens + No `-ing` Chains + Repeated Term + Simple Words) |
| :--- | :--- |
| `## Why React Components Must Be Pure` | `## Pure Component `<Item />` vs. Impure Component: a pure component returns the same JSX for the same `props` and `state`` |
| `### The Book Analogy: Existing Data vs. Local Copies` | `### Outside Mutation `items.push` vs. Local Mutation `items.slice`: an outside mutation changes pre-existing data and breaks purity` |
| `### How Changing an Outside Variable During Render Breaks a Real Page` | `### Outside Variable `let number` Inside a Render: the component modifies `number` on every render and breaks the page` |
| `### The Rule of Thumb` (Ch 14) | `### The Rule of Thumb for `props`, `state`, and `onClick`: treat `props` and `state` as read-only and put side effects in `onClick`` |
| `### Passing the item number as a prop` | `### Read-Only Prop `number` vs. Outside Variable `let number`: the `number` prop keeps `<Item number={1} />` pure across renders` |
| `### What happens when a child component pushes into a prop array during render` | `### Outside Mutation `items.push` on a Prop Array: the child component modifies the parent array `groceries` on every render` |
| `### What happens when you count user actions in the component body instead of the click handler` | `### Component Body vs. Event Handler `handleToggle`: code in the component body counts renders instead of user clicks` |
| `## Why Setting State Does Not Change the Variable` | `## State Setter `setNumber` vs. State Variable `number`: the state setter `setNumber` schedules the next render and leaves `number` at `12`` |
| `### The Photo Analogy: The Photo From This Render vs. the Next Photo` | `### Render Snapshot `number` Inside `onClick` and `setTimeout`: the render snapshot locks `number` at `12` for the entire render` |
| `### Why Reading State Right After Setting It Calls the Wrong Customer` | `### State Variable `number` After State Setter `setNumber`: the handler reads the old state variable `number` at `12` and calls the wrong customer` |
| `### The Rule of Thumb` (Ch 15) | `### Local Constant `nextNumber` vs. State Variable `number`: the local constant `nextNumber` holds `13` right away for `setNumber` and `setAnnouncement`` |
| `### How React gives 13 to the next render while number stays 12 in this click` | `### Current Render `number` vs. Next Render `number`: `setNumber(12 + 1)` passes `13` to the next render while `number` stays `12` in `handleNext`` |
| `### How each render creates its own handler and how the substitution method traces it` | `### Render 1 `handleNext` vs. Render 2 `handleNext`: each render seals its own `number` value inside its own `handleNext` closure` |
| `### How the timer arrow function closes over its click's number across two quick clicks` | `### Delayed Timer `setTimeout` Across Two Clicks: each `setTimeout` callback keeps the `number` snapshot from the click that started it` |