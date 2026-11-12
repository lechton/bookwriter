---
name: prelecture
description: "How Opus writes the prelecture 01-01-md-PRE-lectures/v1/{NN}.md for a react-11 lecture: the definitions, the names, the screen, the intro, the principles with their proof on the screen, the verdicts, the terms, and the order. The lecture is written from it."
---

# The Prelecture #2026_11_12_02_group_2

## 1. What the prelecture is for

The owner's words, 2026-11-12:

> "We have in this project two files: the prelecture and the lecture. In the prelecture, the model writes the definitions by respecting the instructions and examples as found in the notes. It also adds the elements that you judge need to be added, based on your previous analysis and previous experience."

What this asks:
1. **Two files per lesson.** The prelecture, `01-01-md-PRE-lectures/v1/{NN}.md`, and the lecture, `01-02-md-LECTURES/v1/{NN}.md`. The principle map and the first draft are no longer written.
2. **Definitions first.** The prelecture holds the definitions, written by [definitions/SKILL.md](../definitions/SKILL.md).
3. **The other pieces.** It also holds every other piece the lecture needs: the names, the screen, the intro, the principles, the verdicts, the terms, and the order.

The prelecture decides what is true, what the lesson covers, and in what order. The definitions are written in full, in the words the lecture will use. Every other part is short facts in lists. When a map held ready-made sentences for the rest of the lecture, the lecture copied them, and they came out dense and full of code names.

Before the lecture is written, the prelecture is checked against the React documentation, as [check/SKILL.md](../check/SKILL.md) Step A says, and the owner reads the prelecture.

## 2. Where the facts come from

1. Read row `{NN}` of `questions/questions.md` and the syllabus card `01-01-map/{NN}.md`.
2. Find the React documentation with `node ../../tools/resolve.mjs corpus`. Read every `learn/` and `reference/` page on the topic, including every Pitfall, Deep Dive, Recap, and Challenge.
3. Copy every Console message, Elements panel node, and Vite behavior exactly, with the page it comes from. When the documentation describes a behavior but does not give the exact message, write the behavior and mark the message `unconfirmed`. The lab run of the lecture, in [check/SKILL.md](../check/SKILL.md) Step D, puts the real message in. #2026_11_12_07_group_1
4. Read how earlier lectures in `01-02-md-LECTURES/v1/` and in its `archive/` folder defined each idea this lesson reminds, as [definitions/SKILL.md](../definitions/SKILL.md) Section 3 asks. In `archive/`, read the files stamped `2026-11-12-0220`: they are the lectures as they were just before the archive. #2026_11_12_06_group_3
5. Do not read anything from `projects/react-09`.

## 3. The screen

Each lesson chooses its own screen. The screen from the lesson before is only one option. Choose a screen that:
- needs this lesson's idea, so the reader sees why the idea exists;
- is where developers really use this idea at work, even in a niche case, as [One real screen, one idea](../lecture/SKILL.md) says;
- is made of things everyone knows from the web, such as a button, a title, a counter, a list of names, or a text box;
- has the fewest parts that make the point, and none fewer;
- is the same screen the lecture opens on and builds;
- uses actions everyone does without thinking: click, type, add, remove;
- needs little code from outside this lesson. Every helper word the example brings in is something the reader must get past before reaching the lesson.

If the reader must be told what a part of the screen is for, the screen is not simple enough. When a principle shows something breaking, the broken thing is big on the screen.

**PROPER** (Lecture 1): a shopping cart shows its count in two places, "Items: 2" and a "Buy 2 items" button. The shopper clicks "Add to cart", and both places must show 3. Plain JavaScript updates one line and forgets the button.

**COUNTER-EXAMPLE** (maps 07 to 10): every map reused the city news page from the lesson before, and no map asked which page would make its own idea easiest to see.

**COUNTER-EXAMPLE** (map 21): to show the plain JavaScript way, the example also needed a fake server built on a promise. That brought in `classList`, `disabled`, `async`, `await`, `try`, `catch`, and `finally` before the lesson's idea, which is state, could begin.

**COUNTER-EXAMPLE** (map 22 and its lecture, 2026-11-09): the team page has a search box, a count line, two buttons on every row, and a captain line, and the opening adds a second screen, a Slack channel with ten members. #2026_11_09_01_group_1

## 4. The principles

The owner's words, 2026-11-12: principles "are operational principles: do this and do not do that".

Give each `### Principle N: [Title]` a title written by [titles/SKILL.md](../titles/SKILL.md). Then write these fields as short facts: #2026_11_12_03_group_2

- **Rule**: what to do and what not to do, in one plain line, with its condition.
- **Real beginner mistake**: what developers really get wrong, as numbered events. Do not invent a mistake to make a comparison.
- **Wrong code and right code**: the smallest real code for each, with the names from the Names part.
- **Proof on the screen**: what the screen shows with the wrong code, the numbered steps that cause it, and what the screen shows with the right code. Example: `+3` shows `Home: 1`; three calls read `score` at `0` and each queues "replace with 1"; with `s => s + 1`, `+3` shows `Home: 3`.
- **Definitions it uses**: the definitions this principle stands on, by their bold term.
- **Side by side**: when two pieces of code look alike or look different, the one difference that names each, such as "with `defaultValue`" and "with `value`", the verdict, "the exact same thing" or "NOT the same thing", and the reason in one line. Write "none" when there is no such pair.
- **Where did that come from?**: every name or value that appears in one piece of code but was never written in the piece before it, such as `StoryCard` in an import, `children` in a component, or `e` in a handler. For each: who supplies it, and what JavaScript or React does, as steps.
- **Move**: the move from [lecture/SKILL.md](../lecture/SKILL.md) that fits the main idea, such as Side by side, and one line on why.
- **React does**: what appears on the screen, in the Console, and in the Elements panel, quoted or marked `unconfirmed`.
- **Interview depth**: what a senior interviewer asks next, one point per line.
- **Example step**: what the screen gains in this principle, and which files change.

When one principle explains how something is made and another explains how it is used, put the making first.

**PROPER** (format only, facts of Lecture 06):

```markdown
- **Real beginner mistake**:
  1. The list file creates the section name as a local variable and shows it above the card.
  2. The header file tries to show the same section name.
  3. The page goes blank, because a function cannot see a variable created inside another function.
  4. To stop the crash, a developer copies the variable into both files.
  5. Later, a teammate changes one copy and forgets the other.
```

**COUNTER-EXAMPLE** (the Lecture 06 map, which the rejected draft copied):

```markdown
1. Trying to read `category` inside `SiteHeader.jsx` when `const category = 'Local News'` was declared inside `ArticleList.jsx` (which crashes with `ReferenceError: category is not defined` because sibling functions have separate local scopes), OR ...
```

*Why this fails*: One line holds four events, six code names, and an aside.

## 5. The order of the prelecture

1. `# Q{NN} Prelecture: [Chapter Title]`, with the bank row, the topic tag, and the interview question.
2. `## Scope`: what this lesson covers, and what it leaves to other lessons, with the number of the lesson that owns each part.
3. `## Sources Read`.
4. `## Names`: every variable, setter, function, file, tag, string, and error message, as [definitions/SKILL.md](../definitions/SKILL.md) Section 4 asks. Each variable with its setter, such as `score` and `setScore`.
5. `## Terms`: every term the lesson uses, whether it is new or known, the lesson where it was first taught, and where it is found: the https://react.dev or MDN page, "computer science term" for a standard term such as state machine that the lesson really needs, or "everyday word". A term found in none of these is invented, and it does not go in the prelecture. The lecture may use as names only the terms on this list. #2026_11_08_01_group_2
6. `## The Screen`: the screen of Section 3, the reason it was chosen, and the other screens considered.
7. `## Intro`: the parts of the intro as short facts, in the order of the checklist in [intro/SKILL.md](../intro/SKILL.md): the short question under the title; the terms to remind; what the reader already knows and the one line where React breaks it; the mental model as a sentence in quotes; why React needs the rule; the rules from React's docs, quoted; the "Beware!" line; the everyday object and what each of its items stands for in the code; the scenario, with the wrong screen first, then the right code as a strange line and the right screen (see *The right code after the wrong code* in [intro/SKILL.md](../intro/SKILL.md)), then its steps, then how the bug hides; and the Rule of Thumb with its numbered actions. #2026_11_12_04_group_2 #2026_11_12_09_group_1 Then the Ways (when developers really choose between two to four ways for the same job, the ways and when each fits; otherwise "Ways: none").
8. `## Definitions`: first the `[REVIEW]` reminders, then the `[NEW]` definitions, each one written in full by [definitions/SKILL.md](../definitions/SKILL.md).
9. `## Principles`: one `### Principle N` per principle, with the fields of Section 4.
10. `## Order`: the sections of the lecture, top to bottom, as a numbered list. Under each section, name the definitions and principles it holds. Each definition and each principle appears once in the whole list. Reminders sit at the top as a general direction; name any reminder placed in the text, and why it sits there.
11. `## Interview Points`: the points a complete spoken answer must cover, one per line.
12. `## Open Issues`. #2026_11_12_07_group_1

## 6. Before you finish

1. Does every runtime claim come from the documentation, quoted or marked `unconfirmed`?
2. Does every definition pass Section 7 of [definitions/SKILL.md](../definitions/SKILL.md)?
3. Is every name in the Names part, and clear at first sight?
4. Does every principle have its rule, its real mistake, its wrong and right code, and its proof on the screen?
5. Does every principle name its move?
6. Is every story a numbered list of events, with code names on their own line?
7. Was the screen chosen for this lesson, with its reason?
8. Does the Order part give every definition and every principle one place?
9. Is every term in `## Terms` found in https://react.dev or MDN, a standard computer science term the lesson really needs, or an everyday word in its everyday sense, and does the prelecture itself use no other names? When a map called a visual state "one complete picture the user can see", the lecture used "picture" 94 times.
