---
name: map
description: "How Opus writes the principle map 01-01-map-principles/v1/{NN}.md for a River lecture in react-10: the facts, the example page, and the move each principle uses. It holds facts, never lecture sentences."
---

# The Principle Map #2026_11_07_11_group_4

## 1. What the map is for

The map decides what is true and what the lesson covers. Argon writes every sentence of the lecture later, from this map. So the map gives facts in short lists. It never drafts sentences for the lecture. When a map held ready-made sentences, the lecture copied them, and they came out dense and full of code names.

Write the map in plain words, as [editing-skills/SKILL.md](../editing-skills/SKILL.md) asks. A map that is hard to read gives a lecture that is hard to read.

## 2. Where the facts come from

1. Read row `{NN}` of `questions/questions.md` and the syllabus card `01-01-map/{NN}.md`.
2. Find the React documentation with `node ../../tools/resolve.mjs corpus`. Read every `learn/` and `reference/` page on the topic, including every Pitfall, Deep Dive, Recap, and Challenge.
3. Copy every Console message, Elements panel node, and Vite behavior exactly, with the page it comes from. When the documentation describes a behavior but does not give the exact message, write the behavior and mark the message `unconfirmed`. The runtime check later runs the code and puts the real message into the lecture.
4. Do not read anything from `projects/react-09`.

## 3. The example page

Each lesson chooses its own example page. The page from the lesson before is only one option. Choose a page that:
- needs this lesson's idea, so the reader sees why the idea exists;
- is made of things everyone knows from the web, such as a button, a title, a counter, a list of names, or a text box;
- uses actions everyone does without thinking: click, type, add, remove;
- needs little code from outside this lesson. Every helper word the example brings in is something the reader must get past before reaching the lesson.

If the reader must be told what a part of the page is for, the page is not simple enough. When a principle shows something breaking, the broken thing is big on the page.

**PROPER** (Lecture 1): a shopping cart shows its count in two places, "Items: 2" and a "Buy 2 items" button. The shopper clicks "Add to cart", and both places must show 3. Plain JavaScript updates one line and forgets the button.

**COUNTER-EXAMPLE** (maps 07 to 10): every map reused the city news page from the lesson before, and no map asked which page would make its own idea easiest to see.

**COUNTER-EXAMPLE** (map 21): to show the plain JavaScript way, the example also needed a fake server built on a promise. That brought in `classList`, `disabled`, `async`, `await`, `try`, `catch`, and `finally` before the lesson's idea, which is state, could begin.

## 4. What each principle records

Give each `### Principle N: [Title]` a short title that names one thing the reader sees on the page, with one verb, such as `onChange Sends Every Key into State` or `value Without onChange Freezes the Box`. The full rule goes in the **Rule** field, not in the title. Then write these fields as short facts:

- **Rule**: the rule in one plain line, with its condition.
- **Move**: the move from [lecture/SKILL.md](../lecture/SKILL.md) that fits the main idea, such as Side by side, and one line on why.
- **Opening Essence**: the smallest code and everyday image that open this principle, and the confusion to say out loud (*"Yes, it is the exact same thing!"* or *"It may look the same, or work the same at first, but it is NOT the same thing!"*), as [Opening Essence](../opening-essence/SKILL.md) shows. When there is no real confusion: the key idea the reader must remember, what is at stake, and the place where readers usually go wrong.
- **Root Distinction**: the two things a junior developer sees as one, and the separation a senior developer keeps, one line each. Example: junior: "I wrote the card function, so the card should appear"; senior: declaring the function and placing its tag are two separate steps.
- **Simplest version**: the smallest code that shows the idea, with simple names such as `John` or `count`.
- **Words to teach**: the code words this principle is about. For each one: what it does, who provides it, and the moment on the page when the reader will need it. Then list, without explaining them, the words already taught, each with its lesson number, and any helper words. When the helper list is long, the example is too heavy. Go back to Section 3.
- **Side by side**: when two pieces of code look alike or look different, the one difference that names each, such as "with `defaultValue`" and "with `value`", the verdict, "the exact same thing" or "NOT the same thing", and the reason in one line. Write "none" when there is no such pair.
- **Surprises**: each result on the page that a learner would not expect, and the steps that cause it, as a numbered list. Write "none" when every result is what the code says.
- **Where did that come from?**: every name or value that appears in one piece of code but was never written in the piece before it, such as `StoryCard` in an import, `children` in a component, or `e` in a handler. For each: who supplies it, and what JavaScript or React does, as steps.
- **Real beginner mistake**: what developers really get wrong, as numbered events. Do not invent a mistake to make a comparison.
- **Interview depth**: what a senior interviewer asks next, one point per line.
- **React does**: what appears on the page, in the Console, and in the Elements panel, quoted or marked `unconfirmed`.
- **Example step**: what the example page gains in this principle, and which files change.
- **Code names**: every file, variable, tag, string, and error message, on one line.

When one principle explains how something is made and another explains how it is used, put the making first.

**PROPER** (format only, facts of Lecture 06):

```markdown
- **Real beginner mistake**:
  1. The list file creates the section name as a local variable and shows it above the card.
  2. The header file tries to show the same section name.
  3. The page goes blank, because a function cannot see a variable created inside another function.
  4. To stop the crash, a developer copies the variable into both files.
  5. Later, a teammate changes one copy and forgets the other.
- **Code names**: `ArticleList.jsx`, `SiteHeader.jsx`, `category`, `'City News'`, `Uncaught ReferenceError: category is not defined`
```

**COUNTER-EXAMPLE** (the Lecture 06 map, which the rejected draft copied):

```markdown
1. Trying to read `category` inside `SiteHeader.jsx` when `const category = 'Local News'` was declared inside `ArticleList.jsx` (which crashes with `ReferenceError: category is not defined` because sibling functions have separate local scopes), OR ...
```

*Why this fails*: One line holds four events, six code names, and an aside.

## 5. The order of the map

1. `# Q{NN} Principle Map (River Version v1): [Chapter Title]`, with the version, bank row, topic tag, and interview question.
2. `## Scope`: what this lesson covers, and what it leaves to other lessons, with the number of the lesson that owns each part.
3. `## Start of the Lecture`: the Opening Essence of the chapter (the confusion to say out loud, or the key idea and what is at stake for the user; when no short code shows the idea, the idea in plain words before any code), the Theme (the real page problem in one line), the Ways (when developers really choose between two to four ways for the same job, the ways and when each fits; otherwise "Ways: none"), the example page with the reason it was chosen and the other pages considered, and the older facts the reader needs, each with its lesson number. #2026_11_08_03_group_2
4. `## Sources Read`.
5. `## Terms`: every term the lesson uses, whether it is new or known, the lesson where it was first taught, and where it is found: the https://react.dev or MDN page, "computer science term" for a standard term such as state machine that the lesson really needs, or "everyday word". A term found in none of these is invented, and it does not go in the map. The lecture may use as names only the terms on this list. #2026_11_08_01_group_2
6. `## Principles`: one `### Principle N` per principle, with the fields of Section 4.
7. `## Interview Points`: the points a complete spoken answer must cover, one per line.
8. `## Open Issues`.

## 6. Before you finish

1. Does every runtime claim come from the documentation, quoted or marked `unconfirmed`?
2. Does every principle name its move?
3. Does every principle list the words it teaches, apart from known words and helper words?
4. Is every story a numbered list of events, with code names on their own line?
5. Was the example page chosen for this lesson, with its reason?
6. Is the map free of sentences meant for the lecture?
7. Is every term in `## Terms` found in https://react.dev or MDN, a standard computer science term the lesson really needs, or an everyday word in its everyday sense, and does the map itself use no other names? When the map called a visual state "one complete picture the user can see", the lecture used "picture" 94 times.
