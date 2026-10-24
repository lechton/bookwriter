---
name: pre-lecture-v2
description: "River Version (v2) pre-lecture for `01-01-md-PRE-lectures/v2/{NN}.md`. Argon writes it from the principle map before the lecture. It stages every section beat by beat, in the sentences the reader will actually read, and it meets every content benchmark before a single lecture page is written."
---

# River Version (`v2`) Pre-Lecture (`01-01-md-PRE-lectures/v2/{NN}.md`)

## 1. Why the River pipeline has a pre-lecture #2026_10_24_01_group_1

A River lecture is made in three steps:

| Step | File | Written by | Its job |
| --- | --- | --- | --- |
| 1. Principle map | `01-01-map-principles/v2/{NN}.md` | Opus | The facts: scope, verified runtime behavior, root distinctions, real bugs, interview points, bridges, code names. |
| 2. Pre-lecture | `01-01-md-PRE-lectures/v2/{NN}.md` | Argon | The staging: what the reader meets, in what order, with which code block, and with which sentence before it. |
| 3. Lecture | `01-02-md-LECTURES/v2/{NN}.md` | Argon | The finished pages, with their own reading checks and any change that makes them read better. |

Lectures 01 to 06 were written straight from the map, and every first draft came out convoluted. The causes were almost never single words. They were staging faults: a developer story told above two stacked code blocks, a renamed import nobody explained, an effect taught before its cause, a fake riddle. Each of these faults is visible in a short list of beats long before it is buried in 800 lines of lecture. So the pre-lecture is where the content gets right, and the lecture is free to concentrate on reading well.

## 2. How to write the pre-lecture #2026_10_24_01_group_1

1. Read the reference sections in Section 5, then the principle map for this lecture.
2. Copy the lecture's headings: the opening `## Why We ...` section with its `###` subsections, then each `## N. Principle N: ...` with its `###` steps.
3. Under each heading, write numbered beats. A beat is the sentence or the few sentences the reader will read, followed by a `Shows:` line for what the reader sees next.
4. Write one principle at a time. When a principle is done, read its beats from top to bottom as a learner meeting the idea for the first time, and check them against Section 4 before you start the next principle.
5. When every principle passes, write the Content Gate report at the end of the file, as Section 6 shows.

The sentences in a beat are the real sentences, not notes about them. If a sentence could not be pasted into the lecture unchanged, rewrite it until it could. The map is written by a different model in a fact-sheet style, so never copy its wording into a beat: take its facts and say them in your own River voice.

## 3. The beat format #2026_10_24_01_group_1

A beat holds the reader's sentences, then one `Shows:` line. Write code blocks in full whenever the lesson depends on their exact lines, such as a bug, its fix, or both files of a handshake. The lecture can use them as they are. Describe a figure or a browser preview in one line: what it compares and the words on its labels.

### PROPER (Lecture 04, Principle 1, staged as beats)

The sentences below are the approved sentences of Lecture 04. Only the layout is new.

````markdown
### Writing the component function and using its tag are two separate steps

1. Putting a component on the screen takes **two separate steps**: first you declare the function, and then you use its tag inside `App`.
   - **In daily coding**: If you write the card function, **but forget to place its tag inside `App`**, you see nothing on the screen. Declaring the function and using its tag are two separate steps.
   - **In an interview**: When an interviewer asks what a component is and how it runs, do not stop at *"It is a function that returns JSX."* State both steps: you write the function, and you place its tag in `App` so **React calls your function**. That call by React is what **rendering** means.
2. First, we write the function for the card:
   - Shows: code, `App.jsx`, lines 1 to 10. The card function with one `console.log` line. The function name is highlighted, and its comment says it is declared in memory but never used below.
3. Below the card, `App` returns only the page heading and never names the card:
   - Shows: code, `App.jsx`, lines 11 to 17. `App` returns a main wrapper with one heading.
4. **When you only write the function and forget to place its tag, the function never runs!** Writing the function only saves it in memory: no card appears on the screen, and nothing prints in the Console panel.
   - Shows: `tree dir=right`. Step 1 alone gives 0 cards and 0 Console messages; Step 1 plus Step 2 makes React call the card once per tag.
````

### COUNTER-EXAMPLE (Planning notes instead of the reader's sentences)

````markdown
### Declaring vs. invoking

- Beat: show that declaring `ArticleCard` in `App.jsx` without `<ArticleCard />` renders nothing; mention `console.log`, the Elements panel, and rendering.
- Beat: riddle opener. You write `function ArticleCard()`, save, and look at the browser. Why didn't your function run?
````

*Why this fails*: The first beat is a note about a sentence, so the real sentence is left for the lecture to invent under pressure, and it inherits the note's code names. The second beat plans a fake riddle instead of stating what went wrong.

## 4. The content benchmarks the pre-lecture must meet #2026_10_24_01_group_3

Each benchmark below is a standard, an approved example from an earlier River lecture, and a counter-example taken from a rejected first draft. The examples carry the standard: read them for their rhythm, not only for their rule.

### 4.1 Each principle starts at its root

Every principle opens with a `###` heading that separates two things a junior developer sees as one, and that a senior developer keeps apart. The opening sentences then say why the difference matters in daily coding and in an interview.

| Heading level | PROPER, from approved lectures | COUNTER-EXAMPLE |
| --- | --- | --- |
| `##` principle titles | `## 2. Principle 2: Start Component Names with a Capital Letter in PascalCase`<br>`## 3. Principle 3: Match Imports to Exports: No Braces for Default, Curly Braces for Named`<br>`## 4. Principle 4: Import Paths: Every Relative Path Starts from the Importing File's Folder` | `## Principle 2: Capitalization Rules`<br>`## Principle 3: Imports and Exports`<br>`## Principle 4: Relative Paths` |
| `###` root openings | `### Writing the component function and using its tag are two separate steps`<br>`### In React, a capital first letter is a compiler rule, not a style habit`<br>`### A function inside another function is made again on every call`<br>`### Old HTML script tags share one global space, but each module file keeps its names private`<br>`### A file can have only one default export, so a file with multiple components exports them by name` | `### How ArticleCard renders inside App.jsx`<br>`### Using curly braces in JSX`<br>`### Default and named exports in ES modules` |
| `###` step headings | `### A small first letter turns your component into an empty HTML tag`<br>`### What happens when you import a named export without curly braces`<br>`### Wrapping named imports in curly braces fixes the mismatch`<br>`### Can the importing file give an imported component a different tag name?` | `### Named import syntax error`<br>`### Default vs. named aliasing` |

**PROPER** (Lecture 04, Principle 2):

> ### In React, a capital first letter is a compiler rule, not a style habit
>
> In plain JavaScript, choosing `myName` or `MyName` is only a matter of style for human readers; JavaScript runs both the same way. In React JSX, however, **the first letter of a tag is a strict compiler rule**:

**COUNTER-EXAMPLE** (rejected opening):

> ### How `ArticleCard` renders inside `App.jsx`
>
> Here is our `ArticleCard` function with a `console.log` inside it so we can check when it runs.

*Why this fails*: It starts in the middle of the code, so the reader never learns which two ideas the principle separates.

### 4.2 Real bugs and real interview questions

The beginner mistake is one that developers really make while coding and debugging. A nuance that only an interviewer asks about stays in the interview part, and it is never dressed up as the main bug.

**PROPER** (Lecture 04, Principle 1):

> - **In daily coding**: If you write the card function, **but forget to place its tag inside `App`**, you see nothing on the screen. Declaring the function and using its tag are two separate steps.
> - **In an interview**: When an interviewer asks what a component is and how it runs, do not stop at *"It is a function that returns JSX."* State both steps: you write the function, and you place its tag in `App` so **React calls your function**. That call by React is what **rendering** means.

**COUNTER-EXAMPLE** (rejected Lecture 04 draft, which opened the principle with an edge case):

> If `ArticleCard` is just a JavaScript function that returns JSX, why can't I write `{ArticleCard()}` inside `<main>` and call it myself?

*Why this fails*: Almost nobody writes this in daily work. Opening on it treats an interview nuance as the common bug, and the real bug, a forgotten tag, gets pushed aside.

### 4.3 Each section opens with the everyday situation

A section starts with a situation the reader recognizes and the reason it matters, in plain words. The code comes after the reader knows why it is coming.

**PROPER** (Lecture 04, opening):

> Look at any real website: an online shop shows twenty product cards, and a news site shows twenty article cards. If you build that whole page inside one giant function, you end up copying and pasting the same card markup twenty times. Tomorrow, when you want to change the card's design, you have to hunt through hundreds of lines and edit all twenty copies by hand.

**COUNTER-EXAMPLE** (rejected Lecture 04 opening):

> Let's start by pulling one `<article>` out of `App` and putting it into its own function called `ArticleCard`. We add a `console.log('ArticleCard runs')` inside it so we can see every time the function actually runs:

*Why this fails*: It starts at the keyboard with three code names, before the reader knows what problem the function solves.

### 4.4 Walk through the code on stage, one sentence before each block

Tell the story while the reader watches it happen. Each step of the story gets its own short sentence, and that sentence sits right above the code block it introduces. Two code blocks never follow each other without a sentence between them. The story is never summed up in one paragraph above a pile of blocks.

**PROPER** (Lecture 04, Principle 4, staged as beats):

````markdown
1. Now we want to add a comment box under each article card. Only the card uses this comment box. In plain JavaScript, you sometimes put a small helper function inside the function that uses it. So you might try to write the comment box **inside** the card.
2. Look at what happens when the comment box is defined inside the card:
   - Shows: code, `App.jsx`, lines 1 to 5. The comment box function is nested inside the card function and highlighted as wrong.
3. Below it, the card returns the heading, the text, and the comment box tag:
   - Shows: code, `App.jsx`, lines 6 to 13.
4. When you **define one component inside another component**, everything looks fine on the first load. That makes this bug very easy to miss! The problem appears as soon as the outer component updates:
   1. The user clicks into the comment box and types a comment.
   2. Now the card updates and runs again.
   3. The moment the card runs again, **everything the user typed is wiped out, and the blinking cursor disappears!**
````

**COUNTER-EXAMPLE** (rejected Lecture 06 draft):

> When developers realize the header file cannot read `category` from the list file, they often copy `const category` into both files. Later, a teammate updates `SiteHeader.jsx` to `'City News'`, and forgets that the list file still holds the old section title:
>
> *(two code blocks follow, one right after the other)*

*Why this fails*: Three events happen off stage in one paragraph: the copy, the update, the forgotten file. Then two blocks arrive together, and the reader has to match each event to its code alone. Staged on beats, each event becomes its own sentence above its own block.

### 4.5 Narrate in plain words, and name code only when the reader must learn the name

When a sentence tells what we do or what goes wrong, it speaks of the parts the reader can picture: the card, the card file, the main file, the heading, the variable, the tag. The exact names, files, and strings live in the code block and its comments. A code name belongs in a sentence when the reader must learn that very name, such as a new term, a property they will see in the Console, or a helper the build adds.

**PROPER** (Lecture 05, Principle 3, narrating):

> Our card file has **only one** default export:
>
> When our main file imports from the card file **without curly braces**, it can invent a brand-new local name on the spot:

**PROPER** (Lecture 02, naming what the reader must learn):

> Before the browser received `App.jsx`, the build rewrote every tag into a JavaScript function call. In the rewritten file that the browser receives, every angle-bracket tag is gone. In its place is a call to a helper function from React named `_jsxDEV`:

**COUNTER-EXAMPLE** (rejected Lecture 03 draft):

> Suppose a developer stores `title` and `author` in two constants at the top of `ArticleCard`. Then the developer writes `title` inside `<h2>` and `src="{avatarUrl}"` on the `<img>` tag:

**COUNTER-EXAMPLE** (still in Lecture 06, Principle 3):

> What if a developer avoids the crash by typing `const category` inside **both** files?
>
> First, the developer defines `category` as `'City News'` inside the header file:

*Why these fail*: The sentences recite the code that sits right below them, so the reader reads every name twice and still does not know what the step is for.

### 4.6 One step per block, and both sides of a two-file handshake

Each code block shows one step or one mistake. When an idea connects two files or two components, show both: what the first file defines or exports, and how the second file imports it and uses its tag.

**PROPER** (Lecture 05, Principle 3, staged as beats):

````markdown
1. Our card file has **only one** default export:
   - Shows: code, `src/components/ArticleCard.jsx`, lines 1 to 3. The words `export default` are highlighted; the comment says this is the only default export in the file.
2. When our main file imports from the card file **without curly braces**, it can invent a brand-new local name on the spot:
   - Shows: code, `src/App.jsx`, lines 1 to 10. The import names `StoryCard`, and the page renders the `StoryCard` tag; both are highlighted with comments.
````

**COUNTER-EXAMPLE** (rejected Lecture 05 draft):

````markdown
Because `ArticleCard.jsx` has **only one** default export, the importing file can give a default import **any local name it wants**:

```jsx title="src/App.jsx" startLine="1"
import ~StoryCard~ from './components/ArticleCard.jsx'; // Valid: renames the default import to StoryCard
```
````

*Why this fails*: The reader sees one line of the second file and has to remember the first file, and never sees the new name used as a tag.

### 4.7 Say every bridge out loud

Sometimes the second piece of code uses a name, a parameter, or a value that the first piece never wrote. The reader's eye checks the first piece and asks where it came from. The beats say so openly, name who invents or supplies the thing, and walk through what JavaScript or React does, step by step.

**PROPER** (Lecture 05, Principle 3):

> Look closely at those two files. The word `StoryCard` does not exist anywhere inside our card file! Inside the card file, the function is still named `ArticleCard`. Why doesn't JavaScript complain that `StoryCard` is missing?
>
> Because the import line has **no curly braces**, JavaScript does **not** search the card file for a function named `StoryCard`. Instead, leaving out the curly braces tells JavaScript to do two simple steps:
> 1. Go to the card file and grab whatever single function is marked `export default`, which is `ArticleCard`.
> 2. Give that function the brand-new local nickname `StoryCard` inside our main file so we can render it as `<StoryCard />`.

**COUNTER-EXAMPLE** (invented, in the shape of the rejected Lecture 05 draft):

> When our main file imports the card without curly braces, it can use any name it likes:
>
> *(the code block with `import StoryCard` follows)*
>
> The card appears on the page.

*Why this fails*: The reader looks at the card file, finds no `StoryCard`, and the text moves on as if nothing were strange.

### 4.8 Cause before effect

When one principle explains how something is made and another explains how it is used, the making comes first. Inside a principle, a result comes after the step that causes it.

**PROPER** (Lecture 05 principle order):

> ## 2. Principle 2: Default vs. Named Exports: One Default for the Main Component, Named Exports for Multiple Components
>
> ## 3. Principle 3: Match Imports to Exports: No Braces for Default, Curly Braces for Named

**COUNTER-EXAMPLE** (rejected Lecture 05 order): Principle 2 taught curly braces and renaming on the import line, and only Principle 3 explained why a file has one default export and many named ones. Principle 2 had to export a lone component by name for no visible reason.

### 4.9 A believable example, and code that matches its browser preview

The example looks like a real page to both a junior and a senior developer, it is small enough to read in a little browser window, and each part enters only in the principle that needs it. Every browser preview shows exactly what the code next to it renders: every heading, line, card, and badge, nothing more and nothing less.

**PROPER** (Lecture 04, opening): the page repeats the card only where repetition is the lesson.

> Write the tag twice, and two cards appear on the page. Write it ten times, and ten cards appear:

**COUNTER-EXAMPLE** (rejected Lecture 06 draft): every preview in the lecture showed two identical article cards one under the other, and the first preview left out the badges and the footer that its code rendered.

### 4.10 Say it before you draw it

Every idea inside a `tree` diagram, a table, or a browser preview has already been said in the sentences above it. A figure shows what the reader just read; it never introduces a panel, a term, or an object the text has not met.

**PROPER** (Lecture 02):

> Look at how simple that rewrite is:
> - The tag's name became the first argument, such as `"article"` or `"h2"`.
> - The tag's attributes and inner content became the properties of an object in the second argument.

*(The `tree dir=right` that follows uses only the build, the call, the Console object, and the Elements panel, all named in the text above it.)*

**COUNTER-EXAMPLE** (the Lecture 02 counter-example kept in the River skills): a `tree dir=right` whose second box names the `Network panel Response` and whose third box prints a full object literal, neither of which the text had mentioned.

### 4.11 Every sentence carries its worth

Each sentence tells the reader something they need: what happens, why, or what to look at and why it matters. State a problem plainly when it appears; never hold it back for suspense. Every result names its condition, such as *when the curly braces are left out*.

**PROPER** (Lecture 04, Principle 1):

> **Where did the parentheses go?** Look at the last line above. With parentheses, our code calls the function right now. Without parentheses, we hand the function itself to the browser.

**COUNTER-EXAMPLE** (rejected Lecture 04 draft):

> On the last line, `addEventListener` receives `sayHello` without parentheses. Our code does not call `sayHello()` there.

*Why this fails*: It describes the line and stops. The reader learns nothing that the code did not already show.

### 4.12 The principle card states the rule in human words

The card's explanation starts from the root of the problem and talks to the reader. The `**DO THIS:**` and `**DO NOT DO THIS:**` blocks carry the syntax.

**PROPER** (the owner's own rewrite of a Lecture 11 principle, the model for the card's voice):

> This can be a trap. If you use conditional rendering `{ length && list }`, the left side cannot be 0 otherwise it will show zero in the screen - yes the number zero will appear in your screen. You see, JavaScript stops at 0, and instead of returning false, it gives 0 to React, and React happily renders it in the screen, because for React 0 is a valid number to show!

**COUNTER-EXAMPLE** (the Lecture 11 draft it replaced):

> **The Mechanics:** Before `.map()`, we often keep only matching items with `const shown = emails.filter(...)`. If we then write `{shown.length && rows}` and `shown.length` is `0`, JavaScript's `&&` stops at `0` and hands `0` to React. Because `0` is a valid number, React prints `"0"` on the page!

## 5. Read these before writing #2026_10_24_01_group_5

Read them for their sound: short sentences, one sentence before each block, plain words for the parts, and code names only where the reader must learn them.

- [Lecture 04](../../../../01-02-md-LECTURES/v2/04.md), the whole lecture: the reference chapter of the River Version.
- [Lecture 05](../../../../01-02-md-LECTURES/v2/05.md), the section *Can the importing file give an imported component a different tag name?*: a two-file handshake with its bridge said out loud.
- [Lecture 02](../../../../01-02-md-LECTURES/v2/02.md), the section *How the build turns every tag into a function call*: a build step explained simply before its figure.

Lecture 01 is not a reference: it was written before the River voice settled, and its principle list recites code. Lecture 06 is not a reference either: its Principle 3 still narrates code names in the sentences before its blocks, as Section 4.5 shows. Never read Original Version (`v1`) files while authoring the River Version.

## 6. The Content Gate report at the end of the pre-lecture #2026_10_24_01_group_3

Close the file with a `## Content Gates` section. Most lines quote the pre-lecture itself, because quoting is what shows a fault: a summary of your own work always says it passed.

````markdown
## Content Gates

- 4.1 Root: the `###` root heading of every principle, one per line.
- 4.2 Real bug and interview point: one line per principle.
- 4.3 Openings: the first sentence of every `##` and `###` section.
- 4.4 and 4.5 Lead-in ledger: every sentence that sits directly above a code block, copied here in order, one per line. Any sentence that recites code the block shows is rewritten above, then copied again.
- 4.4 Stacked blocks: the places where two code blocks follow each other with no sentence between them. The expected answer is "none".
- 4.6 Handshakes: every two-file or parent-child idea, with the beats that show each side.
- 4.7 Bridges: every name or value the second piece uses that the first piece never wrote, with the beat that says it out loud.
- 4.8 Order: the principle titles in order, and the reason the order runs from cause to effect.
- 4.9 Previews: every browser preview, with the code it mirrors.
- 4.10 Figures: every figure, with the beat that first says each of its ideas.
- 4.11 and 4.12: confirmed after reading every beat as a learner.
````

## 7. What the lecture does with the pre-lecture #2026_10_24_01_group_1

The lecture is written from the pre-lecture, one principle at a time. It may reorder beats, add a sentence or a block, cut one, or reword anything that reads better another way. When it changes the staging, it checks the changed part against Section 4 again, and its verification report names each change and the benchmarks it rechecked. The pre-lecture stays as it was approved by its own Content Gates; it is the record of the plan, not a copy of the lecture.
