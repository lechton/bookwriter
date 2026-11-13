---
name: definitions
description: "How the prelecture writes the definitions of a react-11 lecture: the owner's notes as the model, definitions made for this lecture, reminders fitted to the chapter, names that read at first sight, and where each definition sits in the lecture."
---

# Writing the Definitions #2026_11_12_02_group_1

## Why definitions come first

The owner's words, 2026-11-12:

> "Now I understand we have elements we can name quanta of information. These are fundamentally of two types: definitions (every key concept, effectively, can be presented as a definition, and the definitions together are complete, in the sense that they connect all the dots), and principles, which are operational principles: do this and do not do that. So in theory we could reconstruct the process and focus on definitions and principles. If we start with concrete definitions and verify there are no errors, then models can build with definitions and principles better."

What this asks:
1. **Two kinds of pieces.** A lecture is built from definitions and principles. A definition says what a thing is and how React behaves. A principle says what to do and what not to do. Principles live in [prelecture/SKILL.md](../prelecture/SKILL.md).
2. **Complete.** Together, the definitions of a lecture connect all the dots the lecture needs.
3. **Checked first.** The definitions are written and checked before the lecture is written. The lecture is built on them.

## 1. Write by the owner's notes #2026_11_12_05_group_1

The owner's words, 2026-11-12:

> "In the prelecture, the model writes the definitions by respecting the instructions and examples as found in the notes."

> "In the same notes folder I have instructions on how to write definitions. Don't we need a skill to incorporate the instructions AND the demos for GOOD and BAD found in the same folder that I shared?"

What this asks:
1. **The skill carries the notes.** The owner's instructions and the owner's GOOD and BAD definitions are copied below, so the writer reads them here.
2. **The GOOD texts are the model.** Copy their shape and their moves, not their words.

### 1a. The owner's ground rule

The owner's words:

> It could take 1000s of rules only to explain the details of why these definitions are good. Pay attention to details. I would not say "a setter adds score + 1" as it creates visual challenge to reader, I would say a setter updates score `setScore(score + 1)` to visually show the setter, the reader has very short attention span. I carefully repeat things in each sentence, writing with proper logic and order like a surgeon. I do not say in JavaScript we do this, there we do that, there we do that... it would be boring. I say "In vanilla JavaScript, you just write `score = 3`, and the job is done." Clear. Crisp. Cutting through the message.

> **Ground Rule:** Never use abstract phrases like "passing score + 1" or "hands React a finished number". Always visually anchor the setter call `setScore(score + 1)` directly in the code, and walk through each call with surgical repetition:
>
> 1. **Show the twin setter explicitly.** Remind the reader that `score` is the state variable and `setScore` is its twin setter, born together in `const [score, setScore] = useState(0)`. EVERY. SINGLE. TIME.
> 2. **Show the verb REPLACE.** The setter call `setScore(score + 1)` is not an addition. It is a command to REPLACE the state with the calculated value.
> 3. **Trace the three calls visually, step by step.**
>    - First call: `setScore(score + 1)` reads snapshot `score = 0`, evaluates `0 + 1 = 1`, and commands React: "Replace the score with 1."
>    - Second call: `setScore(score + 1)` still reads snapshot `score = 0`, evaluates `0 + 1 = 1`, and commands React: "Replace the score with 1."
>    - Third call: `setScore(score + 1)` still reads snapshot `score = 0`, evaluates `0 + 1 = 1`, and commands React: "Replace the score with 1."
> 4. **State the visual outcome.** React receives the instruction "replace with 1" three times. Each call overwrites the one before it. The final result on the screen is 1, not 3.

**COUNTER-EXAMPLE** (marked FLAWED by the owner, "casual flatness"):

> Passing `score + 1` hands React a finished number. JavaScript calculates `score + 1` from the current snapshot before React sees anything.

**PROPER** (the owner's notes, "surgeon-like visual clarity"):

> If you update the score with `setScore(score + 1)`, then JavaScript will calculate `score + 1` from the current snapshot, telling React: "REPLACE the score with this number". Notice that word: REPLACE. `setScore(score + 1)` replaces the previous value with the new one. Each value update replaces the one before it, so only the last one counts! When you write `setScore(score + 1)` three times in the same click, React is told "replace with 1" three times. That is why the score ends up at 1.

### 1b. What the owner's definitions do

From the owner's guide on how to define, Sections 1 and 3 as written. The examples it names are the definitions in Section 1c.

The core difference is that the AI writes **compressed reference summaries** (assuming the reader already holds the mental model), while you write **guided pedagogical narratives** that build the mental model step-by-step in the reader's head.

Even though the AI copies your surface catchphrases (*"Here is the good news"*, *"Here is the catch"*, *"Moral of the story"*), it misses the structural and cognitive techniques that make your definitions work.

**1. The 7 Specific Differences Between the AI's Style and Yours**

* **Cold Opens vs. Pedagogical Bridges (An update queue, and A value update vs. an updater function):** The AI treats every definition like an isolated dictionary entry, jumping straight into the mechanics (*"When you call a state setter..."*). You open by anchoring the reader in what they *already know*, either recapping the previous lesson (*"OK, we have seen that when you click a button..."*) or contrasting with foundational knowledge (*"So, we have seen how in vanilla JavaScript..."*), and then pose a natural question that makes the new concept necessary (*"But in what order are their updates applied?"*).
* **Abstract Claims vs. Concrete Code Anchors (Batching):** The AI speaks in abstractions (*"calls several state setters"*, *"after each line"*, *"some variables"*, *"a pop-up alert"*). You immediately instantiate two concrete variables (`setScore(score + 3)` and `setName('John')`) and thread those exact examples through the rest of the explanation (`(e.g. the score)`, `(e.g. the name)`, `alert('Done')`).
* **Name-Dropping Jargon vs. Inline Refreshers (A value update vs. an updater function):** In A value update vs. an updater function, the AI casually drops *"from the current snapshot"* and moves on, assuming the student remembers what a snapshot is and why it matters. You stop and define prerequisite concepts right where they are needed: *"Remember the snapshot? It's the fact that state variables do not change within the same event handler until the component renders."*
* **Compression vs. "Zooming In" on the Crucial Word (A value update vs. an updater function):** When the AI writes *"tells React: 'replace the score with this number'"*, it treats the quote as self-explanatory and immediately moves to the next topic. You pause the camera, capitalize the keyword, and unpack the implication three ways so the student cannot miss it: *"Did you notice the detail? It says 'REPLACE': `setScore(score + 1)` will replace the previous value with the new one. Each value update replaces the one before it, so only the last one counts! The last update wins because the last update commands the actual replacement."*
* **Flat Conditionals vs. Socratic Walkthroughs (A value update vs. an updater function):** The AI explains edge cases with flat `if/then` statements (*"If you call `setScore(score + 1)` three times... the score ends up at 1"*). You turn edge cases into live experiments with call-and-response questions that force the student to predict the outcome and confront the misconception: *"Will the score be 3 in the end? NO, it will be 1. Why? Because..."*
* **Pre-emptive Disambiguation (A value update vs. an updater function):** You explicitly pause to warn the reader where their brain is likely to get tangled (*"So, do not confuse the setter (with a value update) with the updater function"*), and you give memorable names to relationships (*"its twin setter function"*).
* **Spoken Rhythm & Micro-Formatting:** The AI writes choppy, declarative sentences (*"Here is the good news: the application runs faster. The user never sees..."*). You write for the ear, using conversational connectors (*"OK, we have seen..."*, *"well..."*, *"cool... but"*, *"Now the tricky part:"*), strategic ALL-CAPS for vocal stress (*"EVERY. SINGLE. TIME."*, *"REPLACE"*, *"NO"*), and placing the lesson citation inside the final period (`(Lesson 16).`).

**3. Why the AI Failed Previously (And How to Prevent It)**

If you give an AI a word limit (e.g., *"keep definitions around 120–150 words"*) or show it a short definition like **Batching** alongside a complex comparative definition like **A value update vs. an updater function**, the AI will try to force the complex topic into the same short paragraph length as the simple one. To hit that length, it strips out your bridges, your *"Remember the snapshot?"* refreshers, and your *"Will it be 3? NO. Why?"* walkthroughs.

When prompting another AI, explicitly tell it:

* **Single-concept definitions** (like *Batching* or *An update queue*) should be **100–200 words**.
* **Comparative or multi-mechanic definitions** (like *A value update vs. an updater function*) should expand to **350–450 words** so every mental step is unpacked rather than compressed.

Read the word ranges as the room a definition needs to unpack every step, not as a length to hit.

### 1c. The owner's GOOD and BAD definitions

The names in them are the owner's.

**State and its setter**

**COUNTER-EXAMPLE** (the owner's BAD):

> **State and its setter.** This is how a component keeps values that must survive between renders: you define a state variable (such as count, score, or height) and its setter (such as setCount, setScore, or setHeight). React holds these values for your component between renders. But you never change them directly: each time, you call the matching setter to update them. Here is the catch. When you write setCount(count + 1), count does not increase instantly. Believe it or not, React first calls your component again, and only in that new render does count hold the new value (Lesson 12).

**PROPER** (the owner's GOOD):

> **State and its setter.** In vanilla JavaScript, you just write `score = 3`, and the job is done. Not in React. A value that must survive between renders, such as `count`, `score`, or `height`, lives in state, and state always comes as a pair: the state variable (`count`, `score`, `height`) and its twin setter (`setCount`, `setScore`, `setHeight`). You declare both of them together, in one line: `const [score, setScore] = useState(0)`. EVERY. SINGLE. TIME. React holds these values for your component between renders, and you never change them directly: no `score += 1` here. Each time, you call the matching setter, `setScore(score + 1)`. Here is the catch: when you write `setScore(score + 1)`, `score` does NOT increase instantly, not on that line, and not on any line after it in the same handler. Believe it or not, React first calls your component AGAIN, and only in that new render does `score` hold the new value (Lesson 12).

*Why this fails*: It starts cold, with no bridge from plain JavaScript, and it never shows the pair born together in `const [score, setScore] = useState(0)`.

**An event handler**

**COUNTER-EXAMPLE** (the owner's BAD):

> **An event handler.** When you click a button, something happens, and the code behind that something is the event handler. The click is the event, and onClick is where you attach the function that handles it. It looks like this: `<button onClick={handleThree}>+3</button>`. The event handler here is handleThree, and it runs once, when the user clicks that button. You click a button, and a handler function runs. Here is the catch: anything you ask React to do inside this function, such as setScore, waits until the handler has finished, and the result appears only when the component renders again (Lesson 11).

**PROPER** (the owner's GOOD):

> **An event handler.** When you click a button on the screen, something happens, and the code behind that something is called the event handler. Why that name? Well, the click itself is the event, and the function you write to deal with it is the handler: it handles the event! In React, you connect the two with `onClick`, which is where you attach the function that handles the click. It looks like this: `<button onClick={handleCount}>+1</button>`. Pay attention here: the event handler is `handleCount`, and it does NOT run automatically when the page loads. It waits quietly until the user actually clicks that button, and then it runs once for that click. EVERY. SINGLE. TIME. You click a button, the event handler is activated, and the code inside that handler function runs from top to bottom. Here is the catch: anything you ask React to do inside this function, such as updating the score with `setScore`, does NOT happen on the spot! React waits until the whole event handler has finished running from start to finish. Only after the handler is completely done does React render the component AGAIN, and only in that new render does the result finally appear on the screen (Lesson 11).

*Why this fails*: It never says why the function is called a handler, and it passes over the trap that the handler does NOT run when the page loads.

**A render**

**COUNTER-EXAMPLE** (the owner's BAD):

> **A render.** When React runs the code of the whole component to decide what to show on screen, that is called a render. In React, components render often. If you are not careful, functions inside them run again and again, without you realising it, because the component keeps rendering. You never call the render yourself: React does it on the first load of the page. Then React renders the component again after every state change, and whenever its parent renders. So when you change a state variable, such as count with setCount(count + 1), you are telling React: "the state has changed; render this component again so the screen shows the change." Here is the good news: React does not redraw the whole page. It compares the new result with the old one and changes only what is different. Here is the bad news: every line inside the component runs again on every render. A console.log there prints each time, and a counter you change there climbs each time, even when the user did nothing.

**PROPER** (marked GOOD by the owner, written by DeepSeek V4):

> **A render.** In vanilla JavaScript, a function runs only when you call it. Not in React. You never call a component function yourself: React calls it for you, runs its whole body from top to bottom, and works out what should appear on the screen. That call is a render. And believe it or not, React calls your component OFTEN. Why? Because React has one question to ask: "Given these props and this state, what should the screen look like right now?" The component answers by returning the JSX for that screen. React renders the component on the first load of the page, again after every state change, and again whenever its parent renders. So when `count` is 0 and you click +1, the event handler runs `setCount(count + 1)`. You are not changing the screen directly. You are telling React: "the count has changed; call this component again so the screen can show 1 instead of 0." Here is the good news: React does not redraw the whole page from scratch. It compares the new result with the previous result and updates only the parts that differ. Here is the bad news: every line in the component body runs again on every render, from the first line to the last. A `console.log('render')` in the body prints on every render: the first load, every state change, and every parent render. A counter you keep outside the component and add to in the body climbs on every render, even when the user clicks something unrelated, such as Dark mode (Lesson 13).

*Why this fails*: It starts cold, with no bridge from plain JavaScript, and it never says why React calls the component so often.

**Batching**

**COUNTER-EXAMPLE** (the owner's BAD):

> **Batching.** When an event handler calls several state setters, such as setScore(score + 3) and setLastPlay('Three-pointer'), React does not redraw the screen after the first line and then again after the second. It waits until the whole event handler has finished, groups all the updates together, and renders the component once. This grouping is called batching. Here is the good news: the app is faster, and the user never sees a half-updated screen where the score has changed but the play text has not. Here is the catch: if you pause the handler before its last line, for example with alert('Done'), the screen behind the pop-up stays on the old values until the handler finishes. And React never batches across two separate clicks: the first click always finishes its render before the second click runs (Lesson 16).

**PROPER** (the owner's GOOD):

> **Batching.** When an event handler calls several state setters, such as `setScore(score + 3)` and `setName('John')`, React does not redraw the screen after the first line and then again after the second. It waits until the whole event handler has finished, groups all the updates together, and renders the component once. This grouping is called batching. Here is the good news: the app is faster, and the user never sees a half-updated screen where some variables are updated (e.g. the score), while other variables are not yet updated (e.g. the name). Batching allows React to group together all the updates from all the setter calls inside the same event handler. So when you click a button, the event handler is activated, and all the state variables it sets get updated together in a batch. Here is the catch: if your code pauses the handler before its last line, for example with an `alert('Done')`, well... the screen behind the alert will show misleading, old values, since the batching has not been done yet: the handler has not finished yet. Moral of the story: we do not interrupt the handler! Also, React never batches across two separate clicks: the first click always finishes its render before the second click runs (Lesson 16).

*Why this fails*: It names the half-updated screen without pointing at the variables in it, and it stops at the catch without the moral: do not interrupt the handler.

**An update queue**

**COUNTER-EXAMPLE** (the owner's BAD):

> **An update queue.** When you call a state setter inside an event handler, React does not update the state on the spot. Instead, for each state variable, React keeps a waiting line of updates called the update queue. Every call such as setScore(score + 1) or setScore(s => s + 1) drops one more step at the back of that line. Here is the catch: React does not walk that queue while your handler is still running. Only after the handler finishes does React go through the queue from first to last, in the exact order you called the setters, to work out the final state for the next render (Lesson 16).

**PROPER** (the owner's GOOD):

> **An update queue.** OK, we have seen that when you click a button, an event handler is activated, and all the setters inside this handler are grouped together in a batch. But in what order are their updates applied? Well, they are added to a queue, an update queue. Every call such as `setScore(score + 1)` or `setScore(s => s + 1)` drops one more step at the back of that queue. Here is the catch: React does not walk that queue while your handler is still running. Only after the handler finishes does React go through the queue from first to last, in the exact order you called the setters, to work out the final state for the next render (Lesson 16).

*Why this fails*: It starts cold, so the reader does not see the question the queue answers: in what order are the batched updates applied?

**A value update vs. an updater function**

**COUNTER-EXAMPLE** (the owner's BAD):

> **A value update vs. an updater function.** You can pass two different things to a state setter. If you write setScore(score + 1), you pass a calculated value; JavaScript works out score + 1 right now from the current snapshot, and tells React: "replace the score with this number." If you write setScore(s => s + 1), you pass a function (s => s + 1), and that function is called an updater function. It tells React: "take whatever the score is by now (s), and add 1 to it." Here is the catch: if you call setScore(score + 1) three times in one click when score is 0, all three lines read the same snapshot 0 and tell React "replace with 1" three times, so the score ends up at 1. If you call setScore(s => s + 1) three times, each function builds on the one before it, and the score steps from 0 to 1, then 2, then 3. And if you mix both in one click, order matters: a value update placed after an updater function wipes out the updater's work and replaces the score with its own number (Lesson 16).

**PROPER** (the owner's own GOOD):

> **A value update vs. an updater function.** So, we have seen how in vanilla JavaScript you can just define things: you can just say `name = "John"` and `score = 3`. But for state in React, you need to declare the name of the variable (e.g. `name`, `score`), and always at the same time you need to declare its twin setter function (e.g. `setName`, `setScore`). You need to declare both of them. EVERY. SINGLE. TIME. But pay attention here: if you write `setScore(score + 1)`, you do a simple value update, which can be tricky. Remember the snapshot? It's the fact that state variables do not change within the same event handler until the component renders. You can update any state variable, cool... but the value updates do not add up. If you update `score` with `setScore(score + 1)`, then JavaScript will work out `score + 1` from the current snapshot, telling React: "REPLACE the score with this number". Did you notice the detail? It says "REPLACE": `setScore(score + 1)` will replace the previous value with the new one. Each value update replaces the one before it, so only the last one counts! The last update wins because the last update commands the actual replacement. But if you write `setScore(s => s + 1)`, you pass a function (`s => s + 1`), and that function is called an updater function. Updater functions will be queued as functions, so you can stack many of them. So, do not confuse the setter (with a value update) with the updater function. The updater function tells React: "take whatever the score is by now (`s`), and add 1 to it". It does not replace; it actually calculates on top of the result of the update before it. Here is the catch, caught in action: let's say `score` is 0, and you call a setter with a value update, `setScore(score + 1)`, but you call it three times in the same event handler, during the same click. You click the button, and the handler runs `setScore(score + 1)` three times. Will the score be 3 in the end? NO, it will be 1. Why? Because React was told "replace with 1" three times, so the score ends up at 1. This is the logic of the snapshot in practice. But here is the good news: if you use an updater function instead, and call `setScore(s => s + 1)` three times, you will get 3! Why? Each updater function builds on the one before it, and the score steps from 0 to 1, then 2, then 3. Now the tricky part: what if you mix both? What if you have a simple value update of the same variable, `setScore(score + 1)`, and also an updater function, `setScore(s => s + 1)`? Well, if you mix both in one click, order matters: a value update placed after an updater function wipes out the updater's work and replaces the score with its own number (Lesson 16).

*Why this fails*: It compresses the whole mechanism: it drops the reminder of the snapshot, it never stops on the word REPLACE, and it gives the result of the three calls instead of letting the reader predict it.

**A shallow copy**

**PROPER** (the owner's GOOD; it was written before Section 4 below, so today it would use `item` and `setItem` instead of `order` and `setOrder`):

> **A shallow copy.** OK, we have seen how object spread `{ ...order, quantity: 2 }` builds a brand-new object so React can render. But what happens when your state object holds another object nested inside it, such as `delivery: { address: 'Main St', time: 'Morning' }`? That brings us to a shallow copy. Pay attention here: object spread looks like it copies everything, but it only copies the top level! Think of the outer order box holding an address card that points to a second, inner delivery box in memory. When you write `const next = { ...order }`, JavaScript builds a new outer box, but for `delivery`, it only copies the pointer: both `order.delivery` and `next.delivery` point to the exact same inner box in memory. That is why it is called a shallow copy: it is not a deep copy! As long as you only read `delivery`, that is cool... but the moment you write `next.delivery.time = 'Evening'`, you have walked right into the shallow-copy trap. You mutated the shared inner box that `order` still points to! Here is the catch, caught in action: suppose the shopper selects evening delivery, so the handler runs `const next = { ...order }; next.delivery.time = 'Evening'; setOrder(next)`. React renders, and the screen shows Evening. It looks like it worked, right? Now the tricky part: what happens when the shopper clicks Start over? The reset handler runs `setOrder(initialOrder)`, expecting the delivery time to go back to Morning. Does it go back to Morning? NO, it stays on Evening! Why? Because `next.delivery.time = 'Evening'` mutated the original delivery box that `initialOrder` was pointing to in memory. No line in the reset handler wrote Evening, but the starting state was corrupted through that shared reference! Moral of the story: spread is shallow. When updating a nested object, you must copy every single level on the path from the changed field up to the root (Lesson 17).
## 2. Make the definitions for this lecture

The owner's words, 2026-11-12:

> "I want each lecture to bother writing definitions custom-made, to some extent, to the philosophy of the lecture at hand. Definitions need to be pertinent to the lecture."

What this asks:
1. **No pasting.** Each lecture writes its own definitions. A definition from an earlier lecture is a starting point, not a text to copy.
2. **Pertinent.** Each definition leads toward the key idea of this lecture, and uses this lecture's screen and names.

**PROPER** (the owner's GOOD definition of batching for Lecture 16): it ends on what Lecture 16 needs, "if your code pauses the handler before its last line, for example with an `alert('Done')`, well... the screen behind the alert will show misleading, old values, since the batching has not been done yet".

## 3. Fit the reminders to the chapter

The owner's words, 2026-11-12:

> "The leading-up definitions, as prerequisites, also need to be custom-made, inspired by previous iterations, but if possible written in a fashion that adapts, to the extent that is meaningful, to the level of each chapter."

What this asks:
1. **A reminder is a definition too.** An idea from an earlier lesson that this lecture needs gets a reminder definition, marked `[REVIEW]`. A new idea is marked `[NEW]`.
2. **Start from earlier versions.** Read how earlier lectures defined the idea, and start from the best version.
3. **Fit the level.** Write the reminder for the reader of this chapter, who knows every lesson before it, as far as that helps the reader.

## 4. Names that read at first sight

The owner's words, 2026-11-12:

> "I want an emphasis on variable names that are easy to read, e.g. `count`, `setCount`, `score`, `setScore`. Terms like `order` and `setOrder` are confusing: is order a verb? Is it a noun? Make it clearer, e.g. `item`, `setItem`. We need MAXIMUM clarity on variables, setters, and functions, as they will be part of the definitions, read with virtually no context."

What this asks:
1. **Read alone.** A definition is read with almost nothing around it. So every variable, setter, and function name in it must be clear at first sight.
2. **One reading only.** A name that can be read as a noun or as a verb fails. `order` and `setOrder` fail. `item` and `setItem` pass. So do `count`, `setCount`, `score`, and `setScore`.
3. **The same names everywhere.** The prelecture lists the names once, in its Names part, and the definitions, principles, and lecture use only those names.

**PROPER** (the owner's words): `count` and `setCount`, `score` and `setScore`, `item` and `setItem`.

**COUNTER-EXAMPLE** (the owner's words): `order` and `setOrder`, because "order" can be read as "to order".

## 5. Where each definition sits in the lecture

The owner's words, 2026-11-12:

> "Definitions can be at the top as reminders, but some of the reminders can be placed ad hoc in the text, when it is pertinent to remind something. It is not an absolute rule of being at the top; it is a general direction."

What this asks:
1. **Reminders at the top, as a general direction.** The `[REVIEW]` definitions usually sit at the top of the lecture, before the opening.
2. **A reminder in the text when it helps.** When the reader needs an earlier idea at one exact moment, its reminder may sit there instead.

Each new definition appears once, at the moment the screen needs it, either in a definition box or in the text, never in both. The prelecture's Order part says where each definition sits.

**COUNTER-EXAMPLE** (Lecture 16, `01-02-md-LECTURES/v1/archive/16-gemini3.8-v1-2026-11-12-0220.md`): batching is explained in the text, "React lets the entire event handler run to its last line...", and then again in a definition box right under it, "When an event handler calls several state setters, React does not redraw the screen after each line...".

*Why this fails*: The reader reads the same idea twice, one paragraph apart.

**COUNTER-EXAMPLE** (Lecture 16, `01-02-md-LECTURES/v1/archive/16-gemini3.8-v2-2026-11-12-0220.md`): the three `[NEW]` definitions, batching, the update queue, and a value update vs. an updater function, all sit at the top, before the reader sees the `+3` button show `Home: 1`.

*Why this fails*: The reader learns batching before meeting the problem it explains, so the definition has nothing to hold on to.

## 6. How a definition is written on the page

Write each definition as one paragraph in a definition box, as [figures/SKILL.md](../figures/SKILL.md) Section 7 shows. Start with the term in bold and a period, then `[REVIEW]` or `[NEW]`. End with the lesson that owns the idea, in parentheses before the final period: `(Lesson 12).`

Inside a definition, the owner's signposts are welcome: "Here is the catch:", "Here is the good news:", "Moral of the story:", "Now the tricky part:", "(e.g. the score)", a question answered in the very next words ("Will the score be 3 in the end? NO, it will be 1."), and capitals for real stress ("REPLACE", "NOT"). The rules of [lecture/SKILL.md](../lecture/SKILL.md) on questions, parentheses, and morals are for the rest of the text.

## 7. Before you finish

1. Did you read Section 1 in full, with every GOOD and BAD pair, before writing? #2026_11_12_05_group_2
2. Is every definition made for this lecture, and does it lead toward its key idea?
3. Is every reminder fitted to the reader of this chapter?
4. Is every name clear at first sight, with one reading only?
5. Does every claim match React's docs, quoted or marked `unconfirmed`?
6. Together, do the definitions connect every dot the principles need?
7. Does the Order part give each definition one place in the lecture?
