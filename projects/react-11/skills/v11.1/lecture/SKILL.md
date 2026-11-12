---
name: lecture
description: "How to write a River lecture in react-11 from its prelecture. Read it first. It sends you to the move that fits each idea."
---

# Writing a River Lecture #2026_11_07_11_group_1

## Who you write for

Write for a reader who is tired and in a hurry. The reader knows what the earlier lessons taught and what this lecture has said so far. Nothing else.

Write the lecture from its prelecture, `01-01-md-PRE-lectures/v1/{NN}.md`, as [prelecture/SKILL.md](../prelecture/SKILL.md) describes. Use its definitions as written, its names, its screen, and its order. #2026_11_12_02_group_3

- Do not teach an earlier lesson again in the text. When the reader needs an earlier idea, use the reminder definition the prelecture wrote for this lecture, as [definitions/SKILL.md](../definitions/SKILL.md) Section 5 says. #2026_11_12_02_group_3
- Do not tell the code again in a paragraph. The reader can read the code.
- Start each new idea from something the reader already knows.
- Write every paragraph by the checklist in [Clarity](../clarity/SKILL.md).

## Pick a move for each idea

A move is a way of explaining that worked in an approved lecture. Each move has its own file with a good and a bad example. The start of the lecture follows [intro/SKILL.md](../intro/SKILL.md). #2026_11_12_04_group_2 Inside it, and everywhere else, pick the move that fits the idea:

| When the idea is | Use this move |
| --- | --- |
| A new idea, before any project file | [Smallest code first](../moves/smallest-code-first.md) |
| A difference between two ways of writing code | [Side by side](../moves/side-by-side.md) |
| A new word, such as declarative or spread | [Everyday image](../moves/everyday-image.md) |
| Something on the page the reader would not expect | [Steps for a surprise](../moves/steps-for-a-surprise.md) |
| Two things on one tag, where the order matters | [Both orders first](../moves/both-orders-first.md) |

## How to write each sentence

1. **Say the whole event.** Name who acts and what they do. Write "after every keystroke by the user", not "after every key".
2. **Give the answer first.** When the passage is about state, setters, props, and handlers, say the answer at once. A short "Why? Well," may follow the answer. Never put the question before the answer, because the reader is already holding several pieces in mind. A question may open a big idea, such as why React is called declarative. A question answered in the very next words is fine, as in the owner's definitions: "Will the score be 3 in the end? NO, it will be 1." #2026_11_12_02_group_3
3. **Say what it means for the user.** Turn the mechanism into something the user sees: "It refuses to update based on what you type."
4. **Say what is missing.** When something does not happen, say what is not there: "There is no mechanism in place to update it."
5. **Let code comments carry the results.** A comment such as "the page stays on John" says what a line does on the page. The sentence next to the block says what the step is for. It does not say the result again.
6. **Name each version by its one difference, every time.** Write "With `defaultValue`", not "box B", "Way 1", or "the left column".
7. **Use plain words.** No parentheses in prose, except to point to an earlier lesson, such as "(as seen in Lesson 32)". Inside a definition box, the owner's "(e.g. the score)" is fine too, as [definitions/SKILL.md](../definitions/SKILL.md) Section 6 shows. No em dashes, and never break a paragraph across lines. #2026_11_12_02_group_3

**PROPER** (the owner's own rewrite, 2026-11-07):

> When the user types a letter in the box, React removes the letter. Why? Well, the box already shows `message`, and nothing changes this `message`. After every keystroke by the user, React keeps putting the old text back. It refuses to update based on what you type. There is no mechanism in place to update it.

**COUNTER-EXAMPLE** (proposed on 2026-11-07, rejected by the owner):

> React removes the letters. The box shows `message`, and nothing changes `message`, so after every key React puts the old text back.

*Why this fails*: "After every key" does not say who presses it. The reader gets a code trace, not what the user sees.

**COUNTER-EXAMPLE** (Lecture 20, the message box):

> No line of our code removes the letters. So who removes them? React does. Here is what happens on every key, in order:

*Why this fails*: The question comes before the answer, so the reader must wait while holding `message`, the box, and the key in mind.

## One real screen, one idea #2026_11_09_01_group_1

The lecture is practical advice to developers who will use React at work. So choose the screen where developers really meet this question, in its simplest form. This holds for niche questions too: show the niche case developers really meet, made as small as possible. A toy that only shows the mechanism misleads, even when it works. A parachute course does not teach jumping from a chair, because nobody who uses a parachute jumps from a chair.

Ask: would a developer reach for this tool on this screen at work? If not, find the screen where they would.

Build every example, in the opening and in every principle, on one screen everyone knows: a shopping cart, a like button, a chat, an inbox. Give it the fewest parts that make the point, and none fewer. The reader should get the example at first sight.

1. **Keep one screen.** The lecture opens on the screen it builds. Do not open on one screen and then build another.
2. **Use the shortest real content.** A name box holds `John`, not "This is my article about the new park". Give names or titles only when the idea needs them.
3. **Show it on the screen, not in a sentence.** Several names or emails go in a list inside the browser preview. To show a change of order, show the list before and the list after.
4. **When a title is needed, make it one a user would open.** A demo email reads "Get your next month for $0.99", not "Test email 1".
5. **Say only what a user would say about the screen.** Short sentences, one fact each. No jargon and no new labels.

**PROPER** (the owner's words, 2026-11-09): a name box holds `John`, not "This is my article about the new park".

**PROPER** (the owner's words, 2026-11-09): a demo email titled "Get your next month for $0.99".

**PROPER** (the owner's words, 2026-11-09, for reaching a DOM node with a ref):

> When you open a chat app, it immediately scrolls to the latest message. Because JSX only describes what appears on the screen, not actions like scrolling, you cannot express this behavior in markup alone. Instead, as the React documentation recommends, you attach a ref to the final message and call the browser's native `scrollIntoView()` method directly on that DOM element.

**PROPER** (the owner's words, 2026-11-09, for keeping a value between renders with `useRef`):

> When you use a stopwatch app, tapping "Start" initiates a background timer, and tapping "Stop" must cancel that exact timer later. Because every tick of the clock updates state and re-renders the component, storing the timer's interval ID in a regular variable would wipe it out on the very next render. Instead, you store the interval ID in a ref, allowing it to persist across every render so the "Stop" button can always find and clear the active timer.

**COUNTER-EXAMPLE** (the Lecture 22 opening, 2026-11-09):

> Picture the Members screen of a Slack channel with 10 members. At the top sits a Search members box and a counter line that reads `Showing 10 of 10 members`, below that sits one row per member with a Make admin button and a Remove button, and at the bottom sits a line that reads `Admin: Mia`. Type the letter `a` into the Search members box, and then click Remove on Mia's row: …

*Why this fails*: The reader must hold ten members, a search box, a counter, two buttons per row, and an admin line, then four changes from one click, before the idea starts; and the lecture then builds a different screen, a team page.

**COUNTER-EXAMPLE** (the Lecture 20 opening, 2026-11-09):

> Picture a customer-support Contact Us screen on an online store such as Amazon. It has a Message box, a character counter under it that reads `0 / 200`, and a Send button. Type the 19-character question `Where is my parcel?` into the Message box, and then click Send. …

*Why this fails*: A simple idea, state decides what the box shows, arrives after a store, a counter that ticks letter by letter, a 19-character question, three React pieces, and a whiteboard; and the lecture then builds a bigger form with a name box, a menu, and a tick box.

**COUNTER-EXAMPLE** (the Lecture 32 opening, 2026-11-09):

> Think of a counter on a page that counts the seconds by itself. When the counter appears, it shows zero and goes up by one every second. When the user hides it, it stops.

*Why this fails*: Nobody builds a counter that counts by itself; developers write an Effect to stay connected to something outside React, such as a chat server while the chat is on the screen, which is the case React's docs use.

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

### A key image for a hard idea #2026_11_09_06_group_1

The owner's words, 2026-11-09:

> You are allowed to introduce a key metaphor IF there is inherent complexity that the reader would benefit from visualisation, e.g. it's very complex to explain late fetches coming first in the user interface, a zombie is not dropped casually, it addresses a key theme. But it is openly recognised as such, not smuggled in.

An image passes only when both are true:
1. **Inherent complexity.** The idea is a key theme of the lesson, and hard to see without the image.
2. **Openly recognised.** The first time the image appears, the text says it is an image and what it stands for.

**PROPER** (the owner's rewrite of Lecture 33, 2026-11-09):

> When the user moves from Bob to Taylor, Bob's in-flight request becomes a **zombie request**: work that is still running, but whose answer is no longer wanted.

**COUNTER-EXAMPLE** (Lecture 33, rejected by the owner, 2026-11-09):

> On the user's glass, both approaches look identical: Taylor's profile appears without being clobbered by Bob.

*Why this fails*: "The user's glass" is dropped casually on an idea that is not hard, and it adds a puzzle of its own.

The Lecture 21 "picture" above fails the second test: the text never said "picture" was an image, so the owner read it as a technical word on the screen.
## The parts of a lecture

The owner's words, 2026-11-12: "This is better: `## SECTION | The Basketball Scoreboard`, `## PRINCIPLE | React Runs the Whole Handler First | principle`, `## VS | A Plain Value vs. an Updater Function: the plain value replaces`."

What this asks: a tag at the start of a title tells the build which effect to draw, and the tag does not appear on the page. The `| principle` at the end of the second line is not needed; the tag at the start is enough. #2026_11_12_08_group_2

- `## SECTION | [Title]`: a new part of the lecture. The build draws a torn blue band with "Part 2: [Title]", "Part 3: [Title]", and so on.
- `## PRINCIPLE | [Title]`: a principle. The build draws the red PRINCIPLE badge and counts the principles itself, so the title has no number.
- `## VS | [A] vs. [B]: [explanation]`, or the same with `###`: two ways side by side. The build draws the A vs B board.

**The start**
1. The title, the short question under it, and the interview question: #2026_11_12_04_group_2
   ```markdown
   # Lecture {NN}: [Chapter Title]
   *([A short question that tells the reader what the chapter is about?])*
   > INTERVIEW QUESTION | ❱ CORE | [Exact question text from questions/questions.md]
   ```
2. The intro, as [intro/SKILL.md](../intro/SKILL.md) shows, from its first `##` title to the Rule of Thumb. It opens with the `[REVIEW]` reminder definitions from the prelecture, in definition boxes. The top is the general direction: a reminder may sit in the text instead, where the prelecture's Order part places it. #2026_11_12_02_group_3 #2026_11_12_04_group_2
3. The example page for this lesson, under the title `## SECTION | [Name of the example page]`. When it uses several files, show them in a `files` panel.
4. `**PRINCIPLES:**` with a numbered list in plain words, then a table with the columns `| # | Principle | Why It Matters in Debugging and Interviews | The React Rule |`.

**The new definitions.** Each `[NEW]` definition appears once, where the prelecture's Order part places it: at the moment the screen needs it, in a definition box or in the text, never in both. #2026_11_12_02_group_3

**The principles.** Each one is `## PRINCIPLE | [Title]`. It starts with the smallest code, then the example page grows by one step, and it ends with a principle card, as [figures/SKILL.md](../figures/SKILL.md) Section 6 shows. Write this title, and every title in the lecture, by [titles/SKILL.md](../titles/SKILL.md). #2026_11_12_03_group_2

**The end**
1. `## All [N] Principles Together`: the complete code once, a figure of the order in which React calls the components, and a summary table.
2. `## For the Interview`: `### How to Answer Clearly in 30 Seconds`, then `### Three Classic Follow-Up Questions Interviewers Ask`.

## Before you finish

Read the whole lecture as the tired reader, and ask:
1. Is anything said twice, once in the code and again in a sentence, or once in a definition box and again in the text?
2. Does any passage make the reader wait for the answer?
3. Is every new word of this lesson explained at the moment the reader needs it?
4. Does every browser preview show exactly what its code renders?
5. Does every paragraph pass the checklist in [Clarity](../clarity/SKILL.md)?
6. Does every definition and every principle sit where the prelecture's Order part places it, once? #2026_11_12_02_group_3

## Lectures to read for their sound

- [Lecture 17](../../../01-02-md-LECTURES/v1/archive/17-2026-11-12-0220.md), the opening.
- [Lecture 05](../../../01-02-md-LECTURES/v1/archive/05-2026-11-12-0220.md), the section *How to rename a component when importing it*.
- [Lecture 04](../../../01-02-md-LECTURES/v1/archive/04-2026-11-12-0220.md), the whole lecture. #2026_11_12_06_group_1

## Corrections after a lecture is built

Make every later correction in `01-02-md-LECTURES/v1/{NN}.md` only. Then rebuild with `node src/build-river.mjs {NN}` from `projects/react-11`.
