## Guidelines for titles and subtitles

A reader should be able to strip out all body text, read only the `#`, `##`, and `###` headings in the table of contents, and still learn the core lesson of the chapter. Every title and subtitle must obey these seven rules:

**1. State the thesis, not the topic (Full-Sentence Claims vs. Noun Labels)**
- [ ] Does the heading state *what happens* or *why*, using an active verb, rather than just naming a category or a structural slot? A heading should give the takeaway away in the title itself.
  - **BAD (empty structural slot):** `### The Rule of Thumb`
  - **BAD (vague noun label):** `### Variable mutation vs. scheduled render dispatch`
  - **GOOD (states the exact rule):** `### The Rule of Thumb: Treat Existing Data as Read-Only During Render`
  - **GOOD (states the exact contrast):** `### Why calling setCount is NOT the same thing as reassigning count`

**2. Name the React mechanism, never just the metaphor (No Metaphor-Locked Titles)**
- [ ] If the section uses an everyday analogy (a book, a printed photo, a restaurant ticket), does the heading still name the real code concept? A developer scanning the sidebar for a bug searches for `outside variable`, `prop array`, or `state after setter`—never `the book` or `an old photo`.
  - **BAD (hides the code behind the analogy):** `### The Book Analogy: Existing Data vs. Local Copies`
  - **BAD (opaque metaphor):** `### How Writing in the Book Breaks a Real Page`
  - **BAD (opaque metaphor):** `### How an Old Photo Breaks a Real Page`
  - **GOOD (names the code concept first, analogy second):** `### Outside Mutation vs. Local Mutation: Why Changing Existing Data Breaks Purity (The Book Analogy)`
  - **GOOD (names the code mistake and the symptom):** `### How Changing an Outside Variable During Render Breaks a Real Page`
  - **GOOD (names the code mistake and the symptom):** `### Why Reading State Right After Setting It Calls the Wrong Customer`

**3. Use plain words and real code tokens, not academic jargon (No Noun-itis)**
- [ ] Does the heading use simple verbs and the actual code names (`<StrictMode>`, `setNumber`, `number`, `.push`, `.slice`, `setTimeout`) instead of heavy computer-science abstractions? If a heading sounds like a university thesis, rewrite it in the words a developer actually speaks at the keyboard.
  - **BAD (academic bloat):** `## The Collision Between Synchronous Execution and Scheduled Render Snapshots`
  - **BAD (pompous jargon):** `### Parent Re-Renders Cascade Through Child Evaluation Trees`
  - **BAD (pompous jargon):** `### JavaScript Object Reference Passing: Props Are Pointers, Not Clones`
  - **BAD (cryptic slang):** `### The zombie announcement: calling ticket 12 while ticket 13 sits on screen`
  - **GOOD (plain words + clear actor):** `## Why State Keeps Its Old Value Inside the Handler That Sets It`
  - **GOOD (concrete cause and effect):** `### Why Clicking the Theme Button Made the Item Numbers Climb`
  - **GOOD (exact code mechanic):** `### Why Pushing Into a Prop Array Changes the Parent's Array`
  - **GOOD (exact code mistake):** `### Mistake: Expecting setTimeout to Read the Updated State Variable After Three Seconds`

**4. Name the exact actor and the concrete visible outcome (Cause-and-Effect Specificity)**
- [ ] When a section walks through a bug or a trace, does the heading name *who acts* (React, `<StrictMode>`, your click handler) and *the exact numbers or behavior on screen*? Concrete numbers in a title (`1, 2, 3 into 2, 4, 6` or `13` vs `12`) anchor the reader's memory immediately.
  - **BAD (vague and abstract):** `### The Initial Mount Double-Call: Odd Numbers Vanish into Even Outputs`
  - **BAD (passive and abstract):** `### Execution Trace: Why First-Render Double Invocations Advance Shared State`
  - **GOOD (concrete actor + exact numbers):** `### How <StrictMode> Turns 1, 2, 3 Into 2, 4, 6 on the First Load`
  - **GOOD (concrete actor + exact numbers):** `### How React Gives 13 to the Next Render While number Stays 12 in This Click`

**5. Contrast look-alike traps explicitly in the heading ("X vs. Y" and "Why X Does Not Work")**
- [ ] When a section warns against a common false fix or compares two patterns that look identical to a beginner, does the heading name the exact trap and say immediately that it fails?
  - **BAD (hides the lesson):** `### Shared Heap References vs. Local Stack Allocations`
  - **BAD (hides the false fix):** `### The StrictMode Deception: Deleting the Harness Hides the Bug Until Re-Render`
  - **GOOD (contrasts the two actions clearly):** `### Outside Array Mutation (.push on a Prop) vs. Local Array Mutation (.slice First)`
  - **GOOD (calls out the beginner mistake directly):** `### Why Removing <StrictMode> Only Hides the Bug`
  - **GOOD (calls out the false workaround directly):** `### Why Changing const to let or Assigning to number Directly Does Not Work`
  - **GOOD (calls out the false workaround directly):** `### Mistake: Moving setAnnouncement Above setNumber Changes Nothing`

**6. Keep a clean, non-redundant heading hierarchy (Zero Stacked `##` Duplicates)**
- [ ] Does the chapter go cleanly from `# Chapter Title` -> italic hook question -> `> INTERVIEW QUESTION` -> **one** main `##` opening heading -> `###` sub-sections? Never stack two `##` headings back-to-back that repeat the same idea.
  - **BAD (stacked duplicate `##` headings with no body text between them):**
    ```markdown
    # Pure Components and Where Side Effects Belong
    ## The Reconciler's Contract: Why React Demands Pure Functions
    *(Who decides when your component runs: you or React?)*
    **Interview question:** ...
    ## Why React Components Must Be Pure
    ```
  - **GOOD (single clean `##` after the chapter header block):**
    ```markdown
    # Lecture 14: Pure Components and Where Side Effects Belong
    *(Who decides when your component runs: you or React?)*
    > INTERVIEW QUESTION | ❱ CORE | What does it mean for a component to be pure, and what breaks across renders when it is not?

    ---

    ## Why React Components Must Be Pure
    ```

**7. Make numbered Principle titles self-contained rules (Actionable Imperatives)**
- [ ] Does every `## N. Principle N:` heading state the complete rule in plain English so a reader skimming only the four Principle headings gets all four takeaways of the lecture?
  - **BAD (jargon label + colon splice):** `## 1. Principle 1: Idempotent Functional Evaluation: Same Inputs Must Always Produce Identical JSX`
  - **BAD (jargon label + colon splice):** `## 3. Principle 3: Heap Reference Invariance: Never Mutate Incoming Objects or Props During Render`
  - **BAD (jargon label + colon splice):** `## 4. Principle 4: Asynchronous Side Effect Isolation: Confining State and DOM Mutations to Event Handlers`
  - **GOOD (clear, direct rule):** `## 1. Principle 1: Pure Components Return the Same JSX for the Same Inputs`
  - **GOOD (clear, direct rule):** `## 2. Principle 2: <StrictMode> Calls Every Component Twice in Development`
  - **GOOD (clear, direct rule):** `## 3. Principle 3: Never Mutate an Outside Array During Render; Use Local Mutation Instead`
  - **GOOD (clear, direct rule):** `## 4. Principle 4: Put Side Effects in Event Handlers, Never in the Component Body`

=============== update =========
UPDATE IMPORTANT!

Instead of this
### Outside Mutation (items.push) vs. Local Mutation (items.slice): Why Changing Existing Data Breaks Purity

Try this: 

### Outside Mutation `items.push` vs. Local Mutation `items.slice`:  the local mutation changes existing data and breaks purity 


(a) We need to avoid a series of -ing, it is confusing what is noun and what verb, e.g. changing ongoing existing data reveals updating conforming ongoing  performance

(b) we need to repeat the technical term in the polarity not to use synonym in the title e.g. Local Mutation repeated

(c) the second part explains in simple words 

(d) we prefer to avoid parenthesis in titles because sometimes it creates confusion when the token has parenthesis e.g. (my_function()), we prefer simple backtick 



examples 

Those four structural rules—zero chained `-ing` gerunds, repeating the exact term from the contrast rather than introducing a synonym, explaining the mechanic in plain finite verbs after the colon, and attaching tokens with clean backticks instead of parentheses—make the headings dramatically easier to parse at a glance.

(One quick factual note on your example: in React's terminology, **outside mutation** `items.push` is the one that changes existing data and breaks purity, while **local mutation** `items.slice` is the safe one that changes only a fresh copy inside the render. Both versions are shown on the first item below so you can pick the polarity direction you prefer!)

**Chapter 14: Pure Components and Where Side Effects Belong**

* **Previous:** `## Why React Components Must Be Pure`
**New:** `## Pure Component ``vs. Impure Component: a pure component returns the same JSX for the same`props`and`state``


* **Previous:** `### Outside Mutation (items.push) vs. Local Mutation (items.slice): Why Changing Existing Data Breaks Purity`
**New (Highlighting the bad side):** `### Outside Mutation `items.push`vs. Local Mutation`items.slice`: an outside mutation changes pre-existing data and breaks purity`
**New (Highlighting the good side):** `### Outside Mutation `items.push`vs. Local Mutation`items.slice`: a local mutation changes only a fresh copy and keeps purity`


* **Previous:** `### How Changing an Outside Variable During Render Breaks a Real Page`
**New:** `### Outside Variable `let number`Inside a Render: the component modifies`number` on every render and breaks the page`

* **Previous:** `### The Rule of Thumb: Treat Existing Data as Read-Only During Render`
**New:** `### The Rule of Thumb for `props`, `state`, and `onClick`: treat `props`and`state`as read-only and put side effects in`onClick``
* **Previous (Body):** `### Passing the item number as a prop`
**New:** `### Read-Only Prop `number`vs. Outside Variable`let number`: the `number`prop keeps`` pure across renders`


* **Previous (Body):** `### What happens when a child component pushes into a prop array during render`
**New:** `### Outside Mutation `items.push`on a Prop Array: the child component modifies the parent array`groceries` on every render`


* **Previous (Body):** `### What happens when you count user actions in the component body instead of the click handler`
**New:** `### Component Body vs. Event Handler `handleToggle`: code in the component body counts renders instead of user clicks`



**Chapter 15: State as a Snapshot**

* **Previous:** `## Why Setting State Does Not Change the Variable in Your Running Code`
**New:** `## State Setter `setNumber`vs. State Variable`number`: the state setter `setNumber`schedules the next render and leaves`number`at`12``
* **Previous:** `### How a Render Snapshot Works: Why State Stays Fixed Inside Event Handlers and Timers`
**New:** `### Render Snapshot `number`Inside`onClick`and`setTimeout`: the render snapshot locks `number`at`12` for the entire render`
* **Previous:** `### Why Reading State Right After Setting It Calls the Wrong Customer`
**New:** `### State Variable `number`After State Setter`setNumber`: the handler reads the old state variable `number`at`12` and calls the wrong customer`
* **Previous:** `### The Rule of Thumb: Save the Next Value in a Local Variable First`
**New:** `### Local Constant `nextNumber`vs. State Variable`number`: the local constant `nextNumber`holds`13`right away for`setNumber`and`setAnnouncement``
* **Previous (Body):** `### How React gives 13 to the next render while number stays 12 in this click`
**New:** `### Current Render `number`vs. Next Render`number`: `setNumber(12 + 1)`passes`13`to the next render while`number`stays`12`in`handleNext``


* **Previous (Body):** `### How each render creates its own handler and how the substitution method traces it`
**New:** `### Render 1 `handleNext`vs. Render 2`handleNext`: each render seals its own `number`value inside its own`handleNext` closure`


* **Previous (Body):** `### How the timer arrow function closes over its click's number across two quick clicks`
**New:** `### Delayed Timer `setTimeout`Across Two Clicks: each`setTimeout`callback keeps the`number` snapshot from the click that started it`