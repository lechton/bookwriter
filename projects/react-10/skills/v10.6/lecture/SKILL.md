---
name: lecture
description: "How to write a River lecture in react-10: the first draft and the final lecture. Read it first. It sends you to the move that fits each idea."
---

# Writing a River Lecture #2026_11_07_11_group_1

## Who you write for

Write for a reader who is tired and in a hurry. The reader knows what the earlier lessons taught and what this lecture has said so far. Nothing else.

- Do not teach an earlier lesson again. If Lesson 12 taught `useState`, use it without explaining it.
- Do not tell the code again in a paragraph. The reader can read the code.
- Start each new idea from something the reader already knows.

## Pick a move for each idea

A move is a way of explaining that worked in an approved lecture. Each move has its own file with a good and a bad example. The start of the lecture and of each principle follows [Opening Essence](../opening-essence/SKILL.md). Inside it, and everywhere else, pick the move that fits the idea:

| When the idea is | Use this move |
| --- | --- |
| A new idea, before any project file | [Smallest code first](../moves/smallest-code-first.md) |
| A difference between two ways of writing code | [Side by side](../moves/side-by-side.md) |
| A new word, such as declarative or spread | [Everyday image](../moves/everyday-image.md) |
| Something on the page the reader would not expect | [Steps for a surprise](../moves/steps-for-a-surprise.md) |
| Two things on one tag, where the order matters | [Both orders first](../moves/both-orders-first.md) |

## How to write each sentence

1. **Say the whole event.** Name who acts and what they do. Write "after every keystroke by the user", not "after every key".
2. **Give the answer first.** When the passage is about state, setters, props, and handlers, say the answer at once. A short "Why? Well," may follow the answer. Never put the question before the answer, because the reader is already holding several pieces in mind. A question may open a big idea, such as why React is called declarative.
3. **Say what it means for the user.** Turn the mechanism into something the user sees: "It refuses to update based on what you type."
4. **Say what is missing.** When something does not happen, say what is not there: "There is no mechanism in place to update it."
5. **Let code comments carry the results.** A comment such as "the page stays on John" says what a line does on the page. The sentence next to the block says what the step is for. It does not say the result again.
6. **Name each version by its one difference, every time.** Write "With `defaultValue`", not "box B", "Way 1", or "the left column".
7. **Use plain words.** No parentheses in prose, no em dashes, and never break a paragraph across lines.

**PROPER** (the owner's own rewrite, 2026-11-07):

> When the user types a letter in the box, React removes the letter. Why? Well, the box already shows `message`, and nothing changes this `message`. After every keystroke by the user, React keeps putting the old text back. It refuses to update based on what you type. There is no mechanism in place to update it.

**COUNTER-EXAMPLE** (proposed on 2026-11-07, rejected by the owner):

> React removes the letters. The box shows `message`, and nothing changes `message`, so after every key React puts the old text back.

*Why this fails*: "After every key" does not say who presses it. The reader gets a code trace, not what the user sees.

**COUNTER-EXAMPLE** (Lecture 20, the message box):

> No line of our code removes the letters. So who removes them? React does. Here is what happens on every key, in order:

*Why this fails*: The question comes before the answer, so the reader must wait while holding `message`, the box, and the key in mind.

## Only the words of React and the web #2026_11_08_01_group_1

Use only the words that React and the web use, as https://react.dev and MDN use them, standard computer science terms such as "state machine" when the lesson really needs them, and everyday words in their everyday sense. Never invent a name for a thing, a habit, a mistake, or a situation: a name made up by the writer is jargon, even when it sounds plain. Describe the plain reality in plain words instead. When React, the web, or computer science already has a name, use it, say what it means in plain words, and keep the same word everywhere after that.

An everyday word is fine in its everyday sense. When it starts to stand for something in the code, it has become invented jargon.

**PROPER** (react-03, Standard React Vocabulary Gate):

> Developers often fall into the habit of controlling every input.

**COUNTER-EXAMPLE** (react-03): the same situation named "the controlled form illusion".

**PROPER** (react-03):

> Typing triggers a render on every keypress, which gets slow.

**COUNTER-EXAMPLE** (react-03): the same situation named "keystroke tracking fatigue".

**COUNTER-EXAMPLE** (react-09 pre-lecture skill):

> React relies on UI snappers: self-contained building pockets that snap your page together.

*Why this fails*: "UI snappers" takes the place of "components", a word that appears in every documentation page and interview.

**COUNTER-EXAMPLE** (Lecture 21, 2026-11-08):

> A form has a small set of named pictures. A click or a timer only changes which name is current.

*Why this fails*: "Picture" is in neither react.dev nor MDN. React's docs say "visual state", and the code says `status` with its values `'typing'`, `'error'`, `'submitting'`, and `'success'`. The lecture used "picture" 94 times, and the reader had to translate it every time.
## The parts of a lecture

**The start**
1. The title and the interview question:
   ```markdown
   # Lecture {NN}: [Chapter Title]
   > INTERVIEW QUESTION | ❱ CORE | [Exact question text from questions/questions.md]
   ```
2. The Opening Essence of the chapter, as [Opening Essence](../opening-essence/SKILL.md) shows: the key idea the reader must remember, what is at stake, and the place where readers usually go wrong. A comparison belongs there only when the reader really confuses two things.
3. The real page problem: a page that needs this idea, and why.
4. The example page for this lesson. When it uses several files, show them in a `files` panel.
5. `**PRINCIPLES:**` with a numbered list in plain words, then a table with the columns `| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |`.

**The principles.** Each one is `## N. Principle N: [Title]`. It starts with the smallest code, then the example page grows by one step, and it ends with a principle card, as [figures/SKILL.md](../figures/SKILL.md) Section 6 shows. The title names one thing the reader sees on the page, with one verb, such as `value Without onChange Freezes the Box`.

**The end**
1. `## Putting All [N] Principles Together`: the complete code once, a figure of the order in which React calls the components, and a summary table.
2. `## For the Interview`: `### How to Answer Clearly in 30 Seconds`, then `### Three Classic Follow-Up Questions Interviewers Ask`.

## Before you finish

Read the whole lecture as the tired reader, and ask:
1. Is anything said twice, once in the code and again in a sentence?
2. Does any passage make the reader wait for the answer?
3. Is every new word of this lesson explained at the moment the reader needs it?
4. Does every browser preview show exactly what its code renders?

## Lectures to read for their sound

- [Lecture 17](../../../01-02-md-LECTURES/v1/17.md), the opening.
- [Lecture 05](../../../01-02-md-LECTURES/v1/05.md), the section *How to rename a component when importing it*.
- [Lecture 04](../../../01-02-md-LECTURES/v1/04.md), the whole lecture.

## Corrections after a lecture is built

Make every later correction in `01-02-md-LECTURES/v1/{NN}.md` only. Then rebuild with `node src/build-river.mjs {NN}` from `projects/react-10`.
