# Method of Writing: What to Consider Before a Title or a First Sentence #2026_11_14_02_group_1

This file does not give a recipe. It describes what a writer considers before writing a title, a leading sentence, or the first lines of a section. Read it before you write the titles and the opening of a lecture. The considerations come from one long discussion with the owner on 2026-11-14, about one sentence of Lecture 45. The owner found that the same problems appear in almost every first sentence the AI writes, so they are written here as a method.

## The owner's words, 2026-11-14

Grouped by demand, with only grammar fixed.

**The question the reader is left with**

> "Who throws? The summary confuses things. Why?"

> "AI seems to have serious clarity problems and condenses ideas. I am not sure how to force clarity."

**Who does what**

> "The way you write it is confusing. When 'you write' means write()? No. But 'return' means an actual return(). You violate the language by constantly playing word games. When you write a function, the function returns, not you. You click. You press Enter. You read things on screen. You write functions. But you do not return. The function returns. OK? The same problem appears in your writing constantly: word games of fluidity, who does what, the human actor, the code actor, and the React actor constantly mixed in a slop."

**Significance**

> "Flat slop, no moral of the story, no significance, no surprise, in fact no alert if something is bad practice, expected or unexpected."

**The topic first**

> "This is the first sentence the reader reads. Literally the first sentence. It goes like this: You open the fridge and you see 'apple taken'. Question: why do we talk about a fridge and apples? Why do we talk about 'Username taken'? What is going on? Why does a function talk about user names? There is not even a topic of discussion of forms set out yet."

**The developer's mind**

> "Assume the theory of mind of the developer who needs to think about code, write about code, and remember code. Why is this important to the developer? Start with that."

**The angles**

> "Remove 'Beware!' in these iterations, keep one, and then add bullet points with the different angles, the expectation, the bad practice named, etc., just one sentence in each bullet."

> "It seems a universal pattern."

**What this file is for**

> "The objective is to teach the AI the considerations of writing, not necessarily an explicit skill of what to do, but to consider these methodological concerns."

## 1. The reader arrives cold

A title or a leading sentence is read before the lesson. The reader has not seen the example, the code, or the words the lesson will explain. Everything the writer knows from writing the lesson is still unknown to the reader.

This is the main reason the AI condenses. The writer has the whole lesson in mind, so a short phrase such as "every action that does not throw" feels complete. To the writer, it points to three paragraphs already written. To the reader, it points to nothing. The reader stops and asks: who throws, and what is an action that does not throw?

So before keeping a first sentence, consider it as the cold reader meets it. That reader knows the earlier lessons and everyday life, and nothing more. Ask what that reader can picture, word by word. A word the lesson explains only later is a word the reader cannot picture yet.

**COUNTER-EXAMPLE** (Lecture 45, the leading sentence before 2026-11-14):

> **React empties the form after every action that does not throw, so the action must return what the user typed to keep it on the screen.**

*Why this fails*: "throw" is explained only in Principle 2, and "action" has no owner, so the owner's first question was "Who throws?".

## 2. Who does what: each verb keeps its actor

A lecture about code has at least five actors, and each one has its own verbs:

| Actor | Its verbs |
| --- | --- |
| The user | types, clicks, presses Enter, reads the screen |
| The developer ("you") | writes the function, writes the form, tests the page |
| The function | runs, returns, throws, ends without an error |
| React | renders, resets, compares, stores the state |
| The browser or the server | sends the form, answers, refuses |

The words of code are verbs too: return, throw, render, set, call, reset. Each belongs to one actor. A function returns. A person does not return anything. When the text says "return what the user typed" to the reader, it gives a code verb to a person, and the reader must translate the sentence before understanding it. The owner calls this a word game: the sentence sounds fluid, but it mixes the human actor, the code actor, and the React actor.

The mix also hides cause and effect. "A refusal from the server would otherwise empty every field" sounds natural, but a refusal empties nothing. React empties the fields. When the actor is wrong, the reader learns the wrong cause.

Consider every verb in a title or a first sentence, and name its actor:

- The developer writes code, and the code acts: "write the action function so that it returns what the user typed".
- The user acts on the screen: "the user clicks Log in", "the user reads Username taken".
- React acts on what the code gives it: "React resets the form", "React stores the returned value as state".
- An object acts only when it truly does the thing: `form.reset()` empties the fields, but a form submitted through `onSubmit` does not reset itself. React resets it.

**COUNTER-EXAMPLE** (rejected in the chat, 2026-11-14):

> When you write a form action, return what the user typed together with the error message. React resets the form after every action that ends without an error, so a refusal from the server would otherwise empty every field.

*Why this fails*: The reader is told to "return", which only a function does, and the refusal is made the actor that empties the fields.

**PROPER** (the same idea with each verb on its actor):

> Therefore, you need to write the action function so that it always returns what the user typed, together with the error message.

## 3. The topic before the scene

The first sentence of a lecture sets the subject. A scene placed before the subject is a puzzle with no frame. The owner's picture: "You open the fridge and you see 'apple taken'. Why do we talk about a fridge and apples?" A sentence that opens with "The user types a username, and the server answers Username taken" does the same: the reader does not yet know that the lesson is about React forms.

So the first words name the world of the lesson: "In a React form", "In a React component", "When a form sends its fields to an action function". The example, with its names and its screen, comes after, in the paragraphs. This matches the grounding rule of [intro-points.md](intro-points.md) point 5: basic ideas are set in a frame anyone recognizes before the chapter's own example begins.

**COUNTER-EXAMPLE** (rejected in the chat, 2026-11-14):

> The user types a username, and the server answers "Username taken". The action function returns that message and ends without an error, so React counts it as a success and resets the form.

*Why this fails*: The reader meets a username and a server before learning that the subject is a React form.

## 4. Significance: why the sentence matters

A sentence can be correct, clear, and still flat. It lists what happens and gives the reader no reason to care. The owner's test is a list of what a flat sentence lacks: a moral of the story, a significance, a surprise, an alert that something is a bad practice, and a sign of whether the result is expected or unexpected.

Consider what the sentence asks the reader to feel or decide:

- Is the behavior expected or unexpected? If it is unexpected, say so, with a word that carries the surprise, such as "still" or "even": "a refusal from the server still empties every field".
- Is a common way of writing it a bad practice? Name it as one.
- What does the reader do differently after reading it? Say it as advice, announced to the reader, as [intro-points.md](intro-points.md) *How to give advice* describes: "Therefore, you need to...".

**COUNTER-EXAMPLE** (rejected in the chat, 2026-11-14):

> If the action function returns only the error message, the user reads "Username taken" above an empty form and must type everything again. React resets the form every time the action function ends without an error. So write the action function so that it returns what the user typed, together with the message.

*Why this fails*: Every fact is there, but nothing says that this is a surprise or a bad practice, and the topic is never set.

## 5. The developer's mind

The reader is a developer. The developer has to think about the code, write it, explain it to a colleague, and remember it next week. A first sentence is useful to the developer when it touches one of those moments. Consider, before writing:

1. **What the developer expects.** "If the server says no, the form stays filled."
2. **What the developer writes because of that belief.** An action function that returns only the message.
3. **What the developer misses.** For React, a function that returns a message has succeeded.
4. **Why it matters to the developer.** The users lose what they typed, and the developer does not see it, because the tests use a name that is free.
5. **What the developer must remember.** The action function returns what the user typed, together with the message.

The first sentence starts from one of these, not from the internals of React. The internals come as the reason.

## 6. The angles of one idea

One idea can be seen from several sides. Listing them, one sentence each, shows the writer what the idea really contains, and which side the first sentence should stand on. The owner found the pattern universal: it fits Lecture 45, Lecture 35, and Lecture 38 alike.

The angles:

- **The expectation**: what the developer believes before the lesson.
- **The surprise**: what React does instead.
- **The reason**: what React checks, compares, or keeps that explains it.
- **The bad practice**: the way of writing it that most developers choose, named as a bad practice.
- **The cost to the user**: what the user sees or loses on the screen.
- **Why the bug hides**: why the developer does not notice it on their own computer.
- **The fix**: what the developer writes instead, and what the code then does.

Not every idea has all seven, and the writer chooses which ones the text needs. One sentence per angle keeps each side clear, and it shows at once when two angles have been squeezed into one sentence.

**PROPER** (Lecture 45, agreed in the chat, 2026-11-14):

> **In a React form, a refusal from the server still empties every field, because React resets the form whenever the action function ends without an error. Therefore, you need to write the action function so that it always returns what the user typed, together with the error message.**
>
> - **The expectation:** You would expect the fields to stay filled when the server refuses the data.
> - **The surprise:** React empties the form anyway, even though the account was not created.
> - **The reason:** React does not read the server's answer, it only checks that the action function ended without an error.
> - **Success for React:** An action function that returns an error message ends without an error, so for React it has succeeded.
> - **The bad practice:** An action function that returns only the error message is a bad practice, because it lets React empty every field.
> - **The cost to the user:** The user reads "Username taken" above an empty form and must type everything again.
> - **Why the bug hides:** You test the form with a username that is free, so you never see the empty fields yourself.
> - **The fix:** A good action function returns what the user typed together with the error message, so the fields can show it again after the reset.

**PROPER** (Lecture 35, proposed in the chat, 2026-11-14):

> **In a React component, an Effect does not run once for the whole time the component is on the screen: React stops it and starts it again every time a value in its dependency array changes. Therefore, you need to write every Effect as one start and one matching stop, so that React can repeat the pair for each new value.**
>
> - **The expectation:** You would expect an Effect to start when the component appears and to stop when the component leaves, like the component itself.
> - **The surprise:** When the user picks another chat room, React disconnects from the old room and connects to the new one, while the chat box never leaves the screen.
> - **The reason:** After each render, React compares every value in the dependency array with its previous value, and a changed value makes React run the cleanup and then the setup again.
> - **Two lifecycles:** The component mounts once and unmounts once, but its Effect can start and stop many times in between.
> - **The bad practice:** An Effect that reads `roomId` but has an empty dependency array is a bad practice, because React never starts it again for the new room.
> - **The cost to the user:** The user picks the travel room, the title says travel, and the messages still come from the general room.
> - **Why the bug hides:** You test the page by opening one room, so the first connection works and the missing reconnect never shows.
> - **The fix:** A good Effect lists every value its setup reads, and its cleanup stops exactly what its setup started.

**PROPER** (Lecture 38, proposed in the chat, 2026-11-14):

> **In a React component, the place where you write a Hook call matters, because React finds the state of each Hook by the order of the calls, not by name. Therefore, you need to write every Hook call at the top level of the component, before any `if`, loop or early `return`.**
>
> - **The expectation:** You would expect to create a piece of state inside an `if` only when you need it, as you create a variable in plain JavaScript.
> - **The surprise:** The store page loads fine for a guest, and it crashes the moment the user clicks Log in.
> - **The reason:** React keeps a numbered list of the Hooks your component called on the last render, and on the next render it matches each call to that list by its position.
> - **What breaks the list:** When the `if` turns true, the component calls one more Hook than before, so every later Hook gets the wrong place in the list.
> - **The bad practice:** A `useState` call inside an `if` is a bad practice, because one click can change how many Hooks the component calls.
> - **The cost to the user:** The user clicks Log in, and instead of a cart, the whole page disappears behind an error.
> - **Why the bug hides:** The page works on the first load, and if the linter is off, nothing warns you until a user changes the condition.
> - **The fix:** A good component calls `useState` at the top level on every render, and the `if` decides only what the JSX shows.

## 7. Condensed ideas

A condensed sentence carries a condition, a cause, and a fix in one breath, joined by "so", "after every", "to keep it". It looks efficient. It costs the reader the work of unpacking it.

Consider unpacking each condensed phrase in writing: what does "an action that does not throw" mean in full? "The action function ends without an error." Write the full form when it is not much longer. When a sentence holds a cause and a fix, give each its own sentence. Two clear sentences are better than one packed sentence. Short is a result of clarity, not a goal.

## 8. Titles

A title is the shortest first sentence of all. Everything above applies to it, with more force, because a title has no room to recover from a wrong word. The list of good titles, and the rule of no -ing word, live in [titles/SKILL.md](../titles/SKILL.md). This section adds what to consider while choosing among them.

**The reader meets the title before the section.** A title uses only words the reader can already picture. A word the section explains, such as "throw" in Lecture 45, waits for the section.

**The verb of a title has its actor.** Many titles have a code part, a colon, and a plain-words part. The plain-words part is a sentence with a subject: who does what. "the browser resets now, React resets when the action ends" names two actors and two moments. "a form submitted through onSubmit resets when the action ends" makes the form the actor, but React resets it.

**Each side of a "vs." gets its own actor and verb.** The reader compares two things, so each side needs one verb that says what it does, in the same order as the "vs.".

**The title carries the significance.** A title that names the surprise ("still", "even", "only") tells the reader why the section exists. A title that only names the mechanism tells the reader what is inside, but not why it matters.

**The title names the topic before the scene.** The lecture title and the first section title set the world: forms, Effects, Hooks. The names of the example, such as "Username taken" or "the travel room", come inside the section, or in a symptom title after the topic is set.

The titles of Lecture 45, considered one by one:

| Title | What to consider |
| --- | --- |
| `## VS` A Refusal for the User vs. a Success for React: React resets the form after every action that does not throw | The left half is strong: one event seen by two actors, and the surprise is built in. The right half uses "throw" before it is explained and gives "action" no owner. Consider: "React resets the form whenever the action function ends without an error". |
| `action={save}`: React resets every uncontrolled field after save returns | Each verb has its actor: `save` returns, React resets. It works. |
| `return error`: the refusal line appears, and React still resets the form | "still" carries the surprise. It works. |
| `### VS` `return error` vs. `throw new Error(error)`: only a returned value becomes state | "becomes state" has no actor. Consider: "React stores only a returned value as state". |
| `requestFormReset(form)`: a form submitted through onSubmit resets when the action ends | The form is made the actor. Consider: "React resets a form submitted through onSubmit when the action ends". |
| `### VS` `form.reset()` vs. `requestFormReset(form)`: the browser resets now, React resets when the action ends | Two actors, two moments, same order as the "vs.". It works. |
| ### The fix: ask for the reset inside the Transition | "ask" is given to the reader, but the code asks. Consider: "The fix: the handler calls `requestFormReset` inside the Transition". |
| `name` and `type="submit"`: the browser can send the form before JavaScript loads | The browser is the actor, and the moment is named. It works. |
| `### VS` `action="/signup"` vs. `action={formAction}`: the browser understands a URL, only React can call a function | Each side has its actor and its verb. It works. |

## 9. Questions to consider before keeping a title or a first sentence

- Can a reader who knows only the earlier lessons picture every word?
- Does every verb have its actor: the user, you, the function, React, the browser, or the server?
- Is any code verb, such as return, throw, or render, given to a person?
- Do the first words name the topic, before any scene or name from the example?
- Does it say whether the result is expected or unexpected, and is a bad practice named as one?
- Which angle does it stand on: the expectation, the surprise, the reason, the bad practice, the cost to the user, why the bug hides, or the fix?
- Does it touch a moment of the developer: thinking about the code, writing it, or remembering it?
- Is a condition, a cause, and a fix squeezed into one sentence that two sentences would say better?
