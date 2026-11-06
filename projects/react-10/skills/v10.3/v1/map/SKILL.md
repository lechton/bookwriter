---
name: map-v1
description: "How Opus writes the principle map 01-01-map-principles/v1/{NN}.md for a River lecture in React 10: a fact sheet of what is true, what the lesson covers, and what the writer must explain. It holds facts, never lecture sentences."
---

# The Principle Map

## 1. What the map is for #2026_11_06_02_group_1

The map decides what is true and what the lesson covers. Argon writes every sentence the reader reads, later, from this map. So the map gives facts in short lists. It never drafts sentences for the lecture. When a map held ready-made sentences, the lecture copied them, and they came out dense and full of code names.

Write the map itself in plain words, as [writing/SKILL.md](../writing/SKILL.md) Section 1 asks. A map that is hard to read gives a lecture that is hard to read.

## 2. Where the facts come from #2026_11_06_02_group_1

1. Read row `{NN}` of `questions/questions.md` and the syllabus card `01-01-map/{NN}.md`.
2. Find the React documentation with `node ../../tools/resolve.mjs corpus`. Read every `learn/` and `reference/` page on the topic, including every Pitfall, Deep Dive, Recap, and Challenge.
3. Copy every Console message, Elements panel node, and Vite behavior exactly, with the page it comes from. When the documentation describes a behavior but does not give the exact message, write the behavior and mark the message `unconfirmed`. The runtime check later runs the code and puts the real message into the lecture.
4. Do not read anything from `projects/react-09`.

## 3. The example page #2026_11_06_02_group_1

Each lesson chooses its own example page. The page from the lesson before is only one option. Choose a page that:
- needs this lesson's idea, so the reader sees why the idea exists;
- is made of things everyone knows from the web, such as a button, a title, a counter, a list of names, or a text box;
- uses actions everyone does without thinking: click, type, add, remove.

If the reader must be told what a part of the page is for, the page is not simple enough. When a principle shows something breaking, the broken thing is big on the page.

**PROPER** (Lecture 1, summarized from summary-edition Section 03B): a shopping cart shows its count in two places, "Items: 2" and a "Buy 2 items" button. The shopper clicks "Add to cart", and both places must show 3. Plain JavaScript updates one line and forgets the button.

**COUNTER-EXAMPLE** (maps 07 to 10): every map reused the city news page from the lesson before, and no map asked which page would make its own idea easiest to see.

## 4. What each principle records #2026_11_06_02_group_3 #2026_11_06_02_group_4

For each `### Principle N`, write these fields as short facts:

- **Rule**: the rule in one plain line, with its condition.
- **Simplest version**: the smallest code that shows the idea, with simple names such as `John` or `count`, and the everyday picture for the idea's name.
- **New code words**: every word the reader sees for the first time in this principle, such as `value`, `onChange`, or `e.target.value`. For each one: what it is, what it does, and who provides it, the browser, React, JavaScript, or our code.
- **What happens, in order**: the steps that cause each result the reader will see, as a numbered list. Example: 1. The user presses a key. 2. The browser shows the letter. 3. React calls `onChange`. 4. `setName` saves the new text. 5. React draws the box again with the new `value`.
- **Look-alikes**: two pieces of code a learner will confuse, whether they are the same or not, and the step where they differ.
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

## 5. The order of the map #2026_11_06_02_group_1

1. `# Q{NN} Principle Map (River Version v1): [Chapter Title]`, with the version, bank row, topic tag, and interview question.
2. `## Scope`: what this lesson covers, and what it leaves to other lessons, with the number of the lesson that owns each part.
3. `## Start of the Lecture`: the simplest version of the chapter's idea, the real page problem, the example page with the reason it was chosen and the other pages considered, and the older facts the reader needs, each with its lesson number.
4. `## Sources Read`.
5. `## Terms`: every term the lesson uses, whether it is new or known, and the lesson where it was first taught.
6. `## Principles`: one `### Principle N` per principle, with the fields of Section 4.
7. `## Interview Points`: the points a complete spoken answer must cover, one per line.
8. `## Open Issues`.

## 6. Before you finish #2026_11_06_02_group_1

1. Does every runtime claim come from the documentation, quoted or marked `unconfirmed`?
2. Does every principle list its new code words and the steps behind each result?
3. Is every story a numbered list of events, with code names on their own line?
4. Was the example page chosen for this lesson, with its reason?
5. Is the map free of sentences meant for the lecture?
