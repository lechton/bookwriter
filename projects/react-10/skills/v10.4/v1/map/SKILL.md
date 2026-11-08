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

## 3. The example page #2026_11_06_02_group_1 #2026_11_06_03_group_1

Each lesson chooses its own example page. The page from the lesson before is only one option. Choose a page that:
- needs this lesson's idea, so the reader sees why the idea exists;
- is made of things everyone knows from the web, such as a button, a title, a counter, a list of names, or a text box;
- uses actions everyone does without thinking: click, type, add, remove;
- needs little code from outside this lesson. Every helper word the example brings in is something the reader must get past before reaching the lesson.

If the reader must be told what a part of the page is for, the page is not simple enough. When a principle shows something breaking, the broken thing is big on the page.

**PROPER** (Lecture 1, summarized from summary-edition Section 03B): a shopping cart shows its count in two places, "Items: 2" and a "Buy 2 items" button. The shopper clicks "Add to cart", and both places must show 3. Plain JavaScript updates one line and forgets the button.

**COUNTER-EXAMPLE** (maps 07 to 10): every map reused the city news page from the lesson before, and no map asked which page would make its own idea easiest to see.

**COUNTER-EXAMPLE** (map 21): to show the plain JavaScript way, the example also needed a fake server built on a promise. That brought in `classList`, `disabled`, `async`, `await`, `try`, `catch`, and `finally` before the lesson's idea, which is state, could begin.

## 4. What each principle records #2026_11_06_02_group_3 #2026_11_06_02_group_4 #2026_11_06_03_group_1 #2026_11_06_03_group_2 #2026_11_07_06_group_1

Give each `### Principle N: [Title]` heading a short, concrete title of a few plain words that names one physical action or fact on the page, such as `onChange Sends Every Key into State` or `value Without onChange Freezes the Box`, as [writing/SKILL.md](../writing/SKILL.md) Section 8 shows. Never pack the full conditional rule or a second clause into the heading; the `- **Rule**:` field below holds the full rule. Then write these fields as short facts:

- **Rule**: the rule in one plain line, with its condition.
- **Simplest version**: the smallest code that shows the idea, with simple names such as `John` or `count`, and the everyday picture for the idea's name.
- **Words to teach**: the code words this principle is about. For each one: what it does, who provides it, and the moment on the page when the reader will need it. Then list, without explaining them, the words already taught, each with its lesson number, and any helper words. When the helper list is long, the example is too heavy. Go back to Section 3.
- **Surprises and their steps**: each result a learner would not predict, the facts the learner needs before the question, the question the learner would ask, and the steps that answer it, as numbered lists. Name each version by its one difference. Example: facts, 1. The box has `value="John"` and no `onChange`. 2. The user types n. 3. The box still shows John. Question, "Why does the box with no `onChange` refuse the letter?" Steps, 1. The user presses a key. 2. The browser shows the letter. 3. No `onChange` runs, so state stays John. 4. React puts John back. #2026_11_07_01_group_1
- **Angle**: one fact about this principle that a learner would not expect, and that explains a result on the page. Look where React's names or behavior differ from HTML, the browser, or plain JavaScript, or where one fact explains two results. Give the source. Example: in HTML, the `value` attribute is the starting text, and the browser calls it `input.defaultValue`. React renames it `defaultValue` and uses `value` for the text in the box right now. This explains why the Clear button empties the box with `value` and not the box with `defaultValue`. Sources: MDN `HTMLInputElement.defaultValue`, React `<input>` reference. When no such fact exists, write "none". Never invent one, and never turn a platitude into an Angle. #2026_11_07_02_group_1
- **Look-alikes**: two pieces of code a learner will confuse, the one difference that names each, such as "with `defaultValue`" and "with `value`", what each one means or is used for up front, whether they produce the same result or not, and the logical reason they differ. #2026_11_07_01_group_2 #2026_11_07_05_group_2
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

## 6. Before you finish #2026_11_06_02_group_1 #2026_11_06_03_group_4

1. Does every runtime claim come from the documentation, quoted or marked `unconfirmed`?
2. Does every principle list the words it teaches, separate from known and helper words, and for each surprise the facts, the question, and the steps? #2026_11_07_01_group_1
3. Is every story a numbered list of events, with code names on their own line?
4. Was the example page chosen for this lesson, with its reason?
5. Is the map free of sentences meant for the lecture?
6. Does every principle have an Angle with its source, or "none"? #2026_11_07_02_group_1
