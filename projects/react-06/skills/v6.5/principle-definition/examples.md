# Principle Casebook #2026_10_06_04_group_1

This file collects principle boxes that failed and versions that work, each with an analysis. Read the cases before writing a principle, and come back to them while revising. They are not templates. Each case solved a different reader's problem in a different order, and your principle has its own reader and its own order. Take the moves that fit, and leave the words, names, length, and layout behind.

Every failing version is quoted as it shipped or as it was drafted, with its source, so you can see the real mistake. Every better version is a finished box in the build's syntax.

## What the Better Versions Have in Common

These are observations from the cases below, not steps to follow in order.

- They start where the reader already stands: code the reader would write, or a result the reader would expect.
- They remind the reader of the basics first. The behavior the new fact depends on (what the code normally does, what the reader expects) comes in its own plain sentence before anything new, never in a side clause. See Case 3B.
- They answer the questions the reader would ask, in the order the reader would ask them. "When does this run?" gets an answer the reader can picture ("when the button appears", "when the user clicks"), never a mechanism name.
- They describe what the reader would see: the text on the screen, the line in the console, the error.
- They hold one idea. The mechanism, the history, and the edge cases go in the paragraph under the box, if anywhere.
- They use general names (`count`, `setCount`, a component, the screen), never the lesson's story (its component, its variables, its characters). A principle is a rule for every component; the lesson's own example belongs in the paragraph under the box. See Case 3, version C.
- Their code pair makes sense on its own, without the lesson's story.

## Case 1: When Does the Function Run? (a setter called during render)

**Context.** Lecture 14. The reader has just learned `useState` and the setter. Lecture 13 taught that an event prop receives a function. The reader does not yet have a feel for when a component's code runs.

**Failing version A** (Lecture 14, October 6 run):

> **Principle 7: Call Setters Exclusively Inside Event Handlers and Never During Render**
> Call a setter function only inside an event handler, never unconditionally in the component body or directly inside JSX evaluation braces. Calling `onClick={setLikes(likes + 1)}` invokes the setter immediately during render, which schedules another render, invoking the setter again in an infinite loop. React halts this cycle by throwing the fatal runtime error: Too many re-renders.
> Side notes: "unconditional render call", "infinite render loop".

**Failing version B** (the demo rewrite, written to a four-beat formula):

> **Principle 7: Call a Setter When the Reader Clicks, Not While React Runs the Component**
> In HTML, `onclick="..."` stores code that runs later, on the click. So `onClick={setCount(count + 1)}` looks like it stores an update for later. But to build the button, React runs the component function, and code inside JSX braces runs right then. So the setter runs before anyone clicks. It asks React to run the component again, and that run calls the setter again.

**What the reader goes through.** In A, the title already uses "render", a word the reader cannot picture, and the box then invents two more terms for the side notes. In B, the reader stops at "later": later than what? The box explains how React builds the button before the reader knows that anything goes wrong, so the explanation has nothing to attach to. B followed its formula exactly (expectation, React's choice, reason, cost), which is why the formula was dropped.

**A better version** (written by the owner):

> [!PRINCIPLE]
> **Principle N: Call a Setter Only When the User Clicks**
> We give a button a function to run on click with `onClick={...}`.
> When does that function run? We expect it to run when the user clicks.
> But `onClick={setCount(count + 1)}` runs the setter already when the component appears on the screen, not when the user clicks.
> The setter makes React draw the component again. Drawing it again runs the setter again, and so on, until React stops with an error.
> Instead, write `onClick={() => setCount(count + 1)}`. Now the setter runs only when the user clicks.
>
> *We should do this:*
> `<button onClick={() => setCount(count + 1)}>Add</button> // runs on click`
>
> *We should not do this:*
> `<button onClick={setCount(count + 1)}>Add</button> // runs at once`

**Why it works.** It asks the reader's own question ("When does that function run?") and answers it with two moments the reader can picture: the component appearing, and the click. The loop is told as a chain of plain events. The fix comes last, as one line of code. Each sentence carries one step.

**Take to other topics.** When a principle is about timing, name the two moments and say which one the code hits.

**Do not copy.** The question form is right here because the whole principle is one question. A principle about where a value lives asks a different question, or none.

## Case 2: Something Stranger Than a Variable (the state pair)

**Context.** Lecture 14. The reader writes plain JavaScript variables every day and has just watched `let likes = 0` fail to update the screen.

**Failing version** (Lecture 14, October 6 run):

> **Principle 3: Store Durable Values in State and Update Them Exclusively with Setters**
> To keep data that survives across renders and updates the screen, store it in a state variable using the `useState` Hook. React returns a pair: the current value to read during this render, and a setter function to request the next value. We update state exclusively by calling the setter; reassigning the state variable directly throws a TypeError: Assignment to constant variable.
> Side notes: "state variable", "Hook", "setter function".
> Code pair: one line each, `onClick={() => setLikes(likes + 1)}` against `onClick={() => { likes = likes + 1; }}`.

**What the reader goes through.** "Durable values", "survives across renders", "during this render": three abstractions in the first two sentences. The side notes define words the box only names, so the reader gets a glossary instead of an idea. The one-line code pair uses `likes` and `setLikes` from a story the box never tells, so the pair cannot be read alone.

**A better version** (approved by the owner):

> [!PRINCIPLE]
> **Principle N: `useState` Gives a Value That Lasts and a Function That Changes It**
> A value on the screen needs two things. It must keep its value from one run of the component to the next. And changing it must make React run the component again, so the screen shows the new value. A plain variable does neither. `useState` gives both, in one line: `const [count, setCount] = useState(0)`.
>
> - `count` is the state variable, the current value: 0 on the first run. We read it, and we never assign to it.
> - `setCount` is the setter. `setCount(1)` stores 1 and makes React run the component again. In that run, `count` is 1.
>
> >> state variable : a value that keeps its value from one run of the component to the next
>
> *We should do this:*
> `const [count, setCount] = useState(0);`
> `setCount(count + 1); // the screen shows 1`
>
> *We should not do this:*
> `const [count, setCount] = useState(0);`
> `count = count + 1; // TypeError, the screen stays at 0`

**Why it works.** It first reminds the reader what the two earlier principles showed, as the need a value on the screen has: keep its value between runs, and make React run the component again when it changes. It says plainly that a plain variable does neither. Only then does `useState` appear, as the answer to that need. The bullets are there because one line of code produces two things with different jobs, and each bullet says what its thing does on the screen.

**Take to other topics.** When a new tool appears, state the need first, in the reader's terms, and introduce the tool as what meets it.

**Do not copy.** Bullets belong only where one piece of code holds two things the reader must tell apart.

## Case 3: The Number Changes, the Screen Does Not (assignment) #2026_10_06_04_group_1

**Context.** Lecture 14, the first principle. The reader has seen the console count up while the button stays at `Like (0)`. This box failed three times in one day, in three different ways, which makes it the most useful case in this file.

**Failing version A** (Lecture 14, October 6 run, jargon):

> **Principle 1: Assigning a Local Variable Does Not Ask React to Render**
> React updates what is on the screen only when it renders a component again. Assigning a new value to a local variable changes memory that React does not watch. Because an assignment alone never requests a render, the screen remains stuck on the old value.

**Failing version B** (the pilot rewrite, a claim with no mechanism):

> **Principle 1: Changing a Variable Does Not Change the Screen**
> We add one to a variable in a click handler and expect the screen to show the new number. It does not. The variable changes, but the screen keeps the old number. React never looks at our variables. It changes the screen only when it runs the component again, and a plain assignment does not ask it to.

**Failing version C** (the first fix of B, locked in the lesson's story):

> **Principle 1: The Button Keeps the Number It Got When the Component Ran**
> When React runs `StoryCard`, the line `<button>Like ({likes})</button>` puts the number `likes` holds at that moment, 0, into the button's text. The button now says `Like (0)`. A click changes `likes` to 1, but nothing puts the new number into the button. The button changes only when React runs `StoryCard` again, so that line runs again with the new number. Changing a variable does not make React do that.

**What the reader goes through.**

- A says "render" three times, and its title describes React's internals instead of the screen the reader is looking at.
- B reads smoothly and explains nothing. The owner's verdict: "I don't get it." "React never looks at our variables" and "a plain assignment does not ask it to" treat React as a person who looks and is asked, and the reader cannot picture either. The box jumps from "the variable changes" to "React runs the component again" without saying why running the component has anything to do with the screen. That missing link is the whole principle.
- C finds the link (the JSX line copies the value onto the screen when the component runs) but ties it to `StoryCard`, `likes`, and `Like (0)`. A principle is a rule the reader takes to every component. Told in the lesson's names, it reads as a fact about one card in one story, and the reader must translate it before it is useful. The owner had already asked for general names in the box; C ignored that request.

**A better version** (approved by the owner):

> [!PRINCIPLE]
> **Principle N: The Screen Keeps the Value It Got When the Component Ran**
> When React runs a component, the `{count}` in its JSX puts the current value of `count` on the screen, for example 0. A click handler then changes `count` to 1, but nothing puts the new value on the screen. The screen changes only when React runs the component again, because only then is `{count}` read again. Changing a variable does not make React run the component. Calling a setter does, as Principle 3 shows.
>
> *We should do this:*
> `const [count, setCount] = useState(0);`
> `setCount(count + 1); // React runs the component again`
>
> *We should not do this:*
> `let count = 0;`
> `count = count + 1; // the screen still shows 0`

**Why it works.** It tells what physically happens, in the order it happens: the JSX reads the value when the component runs, the screen gets that value, the click changes the variable, the screen stays. "Runs again" now has a visible job, because it is the only way `{count}` is read again. The names are general (`count`, a component, the screen), so the rule fits any component. The paragraph under the box then shows the same thing on the lesson's own card: `Like ({likes})` stays at `Like (0)` while the console counts up.

**Take to other topics.** When a box says that something does not happen, show the step that would make it happen. "React does not watch" is a claim; "`{count}` is read only when the component runs" is a mechanism the reader can check.

**Do not copy.** Never put the lesson's story in the box: no component, variable, or label from the lesson's example (`StoryCard`, `likes`, `Like (0)`, Leo). General names in the box, the story's names in the paragraph under it. This rule is the one most easily lost, because the lesson's example is what the author has just been working with.

## Case 3B: Say the Basic Fact Before the New One (local variables start over) #2026_10_06_04_group_1

**Context.** Lecture 14, the second principle. The reader has just learned that changing a variable does not change the screen. They know plain JavaScript functions. They do not yet know the setter (Principle 3), and they have never thought about how often React runs a component.

**Failing version A** (first draft):

> **Principle 2: Running the Component Again Starts Its Variables Over**
> Suppose a plain variable has reached 3, and then a setter makes React run the component again, even a setter for some other value. Running the component means calling its function again from the first line. So `let count = 0` runs again, and `count` is 0 once more. The 3 belonged to the previous call, and that call is over. A plain variable inside a component lasts for one run only.

**Failing version B** (second draft):

> **Principle 2: Each Run of a Component Starts Its Variables Over**
> We change a plain variable, and later a setter makes React run the component again. We expect the variable to keep its new value. It does not. React runs a component by calling its function from the first line. So `let count = 0` runs again, and `count` is 0 again. A plain variable inside a component lasts only until the function returns.

**What the reader goes through.**

- Both versions hide the basic fact the whole principle stands on: React runs a component many times, every time the screen must change. Neither says it. Both slip it into a side clause ("and then a setter makes React run the component again"), as if the reader already knew it.
- Both lean on the setter, which the reader meets only in the next principle. The reader stops at "a setter" and cannot go on.
- A stacks conditions before the reader has the main fact: "suppose... has reached 3", "and then...", "even a setter for some other value". The edge case ("some other value") comes before the rule. "The 3 belonged to the previous call, and that call is over" is true, but it asks the reader to picture calls as things that end, without telling them why that matters.
- B is shorter, but its first sentence is still a riddle. The owner's verdict: "What kind of cryptomeaning is this?" "Later" than what? Why would a setter run the component? The reader is asked to accept a new behavior before being reminded of the old one.

**A better version** (approved by the owner):

> [!PRINCIPLE]
> **Principle N: Each Run of a Component Starts Its Variables Over**
> React runs a component more than once: every time the screen must change. Each time, it calls the component's function again from its first line. So `let count = 0` runs again, and `count` is back to 0, whatever it held before. A plain variable inside a component never lasts from one run to the next.
>
> *We should do this:*
> `function Counter() {`
> `  const [count, setCount] = useState(0); // keeps its value`
> `  return <p>{count}</p>;`
> `}`
>
> *We should not do this:*
> `function Counter() {`
> `  let count = 0; // back to 0 on every run`
> `  return <p>{count}</p>;`
> `}`

**Why it works.** The first sentence states the foundation as a plain fact, with no condition and no new term: React runs a component more than once, every time the screen must change. The second sentence ties it to what the reader already knows from JavaScript: running the component is calling its function from the first line. Only then comes the consequence, on a line of code the reader can see (`let count = 0` runs again). The last sentence states the rule. Each sentence rests on the one before it.

**Take to other topics.** Before a box says what is new, it reminds the reader, in the plainest words, of the basic behavior the new fact depends on: what the code normally does and what the reader expects. A fact the principle stands on goes in its own short sentence, first, never in a side clause. A term from a later principle never appears in an earlier one.

## Case 4: Show What the Screen Shows (curly braces)

**Context.** Lecture 4. The reader knows HTML and has written a few JSX tags.

**Failing version** (Lecture 4, Principle 1, shipped):

> **Principle 1: Step Out of Static Markup Using Curly Braces as an Evaluation Window**
> Wrapping identifiers in curly braces switches the JSX parser from static text into JavaScript expression evaluation. The runtime reads the live variable from memory and injects its value directly into the rendered tree.
> Side note: "evaluation window".

**What the reader goes through.** "Evaluation window" is a term invented for the box, then defined in a side note, so the reader learns a word no other text uses. "The JSX parser", "the runtime", "memory", and "the rendered tree" describe machinery, while the reader only wants to know what appears on the page.

**A better version:**

> [!PRINCIPLE]
> **Principle N: Curly Braces Show the Value of a Variable**
> Text inside JSX tags appears on the screen exactly as written, so `<h2>headline</h2>` shows the word headline. To show what a variable holds, we wrap its name in curly braces: `<h2>{headline}</h2>` shows the headline itself, such as Rail Line Opens.
>
> *We should do this:*
> `<h2>{headline}</h2> // shows Rail Line Opens`
>
> *We should not do this:*
> `<h2>headline</h2> // shows the word headline`

**Why it works.** Two sentences, each ending in what the screen shows. The comments in the code pair repeat that contrast in five words each. The parser can be explained under the box, for readers who want it.

**Take to other topics.** When a principle is about syntax, the clearest proof is the screen output of the right and the wrong version.

## Case 5: What the Code Seems to Say, What It Does (the rogue zero)

**Context.** Lecture 4. The reader knows `&&` from JavaScript and has just learned that React shows nothing for `false`.

**Failing version** (Lecture 4, Principle 5, shipped):

> **Principle 5: Guard Numeric Conditionals with Explicit Booleans to Prevent Rogue Zero Output**
> React suppresses booleans and nullish values but always renders primitive numbers as living DOM text nodes. When evaluating numeric counters or array lengths with logical AND (`&&`), developers must convert the count to an explicit boolean to prevent rendering an orphaned `0` in the browser.
> Side notes: "rogue zero", "explicit boolean guard".

**What the reader goes through.** The title has seven heavy words before the reader learns what goes wrong. "Living DOM text nodes" and "nullish" are jargon; "rogue zero" in the side note and "orphaned `0`" in the text are two names for one thing. "Developers must" lectures the reader instead of showing the surprise.

**A better version:**

> [!PRINCIPLE]
> **Principle N: A Count of Zero Shows Up as 0 Next to `&&`**
> `{count && <Badge />}` reads like "show the badge when there is a count". When `count` is 0, the page shows a 0 instead of nothing. The reason is `&&` itself: when its left side is 0, it gives back that 0, and React shows numbers. With `{count > 0 && <Badge />}`, the left side is `false`, and React shows nothing for `false`.
>
> *We should do this:*
> `{count > 0 && <Badge count={count} />} // nothing when count is 0`
>
> *We should not do this:*
> `{count && <Badge count={count} />} // shows 0 when count is 0`

**Why it works.** It reads the code the way the reader reads it, then shows the surprise, then gives one cause in the reader's own JavaScript. The fix is the same line with two more characters.

**Take to other topics.** When code means something different from what it looks like, quote the code, say what it looks like it means, and then say what it does.

## Case 6: Who Decides When the Code Runs (purity)

**Context.** Lecture 12. The reader writes components but has never wondered how often they run.

**Failing version** (Lecture 12, Principle 1, shipped):

> **Principle 1: Treat a Component as a Formula React May Run Any Number of Times**
> A pure component returns the same JSX for the same props and changes nothing outside itself. React decides when and how often to call your component function: twice per render under StrictMode in development, again whenever its inputs change, and in no guaranteed order between siblings.
> Side notes: "pure component", "StrictMode double-rendering". No code pair.

**What the reader goes through.** The box defines purity before it gives a reason to care. The list of when React runs the function mixes a development detail, an update rule, and sibling order in one sentence. Nothing in the box shows what breaks, and there is no code to look at.

**A better version:**

> [!PRINCIPLE]
> **Principle N: React Decides When Our Component Runs**
> We write the component function, but React decides when to run it: when the page loads, again whenever something changes, and twice in a row in development. So the function must give the same JSX for the same props and change nothing outside itself. If it adds one to a counter declared outside, the counter grows every time React runs the function, not every time the reader does something.
>
> *It is best practice to do this:*
> `function Banner({ visits }) {`
> `  return <p>Visit {visits}</p>; // same props, same text`
> `}`
>
> *Instead of doing this:*
> `let visits = 0;`
> `function Banner() {`
> `  visits = visits + 1; // grows each time React runs it`
> `  return <p>Visit {visits}</p>;`
> `}`

**Why it works.** The surprise comes first (we do not decide when our code runs), the rule follows from it, and the last sentence shows a failure the reader can picture: a counter that counts the wrong thing.

**Take to other topics.** A rule that sounds abstract ("pure") becomes clear when the box first gives the fact that makes the rule necessary.

## Case 7: Give the Function, Do Not Call It (passing a handler)

**Context.** Lecture 13. The reader knows functions and parentheses, and has just met `onClick`.

**Failing version** (Lecture 13, Principle 1, shipped):

> **Principle 1: Pass the Handler, Never Call It**
> Give an event prop a function value (onClick={handlePublish}) so React can call it when the user clicks, and when the handler needs arguments, pass a new function that makes the call (onClick={() => openArticle(article.id)}), because anything written inside JSX curly braces runs immediately during render.
> Side notes: "function reference", "premature invocation".

**What the reader goes through.** The whole idea is one sentence of fifty words with two pieces of code in parentheses and a reason at the very end. The title is good; the box loses the reader in the first line. "Premature invocation" is a term made up for the side note.

**A better version:**

> [!PRINCIPLE]
> **Principle N: Give the Button the Function, Do Not Call It**
> `onClick={handleSave}` gives the button our function. React keeps it and runs it when the user clicks. `onClick={handleSave()}` runs the function at once, when the button appears, and gives the button whatever the function returned. When the handler needs an argument, we wrap the call in a new function: `onClick={() => openArticle(id)}`. The button keeps the wrapper, and the call happens on the click.
>
> *We should do this:*
> `<button onClick={handleSave}>Save</button> // runs on click`
>
> *We should not do this:*
> `<button onClick={handleSave()}>Save</button> // runs at once`

**Why it works.** One short sentence per fact, each with its own code. The two moments (the button appears, the user clicks) are the same moments as in Case 1, because the two principles answer the same question.

**Take to other topics.** Two principles that answer the same reader question can share a shape. Case 1 is the later lesson, where the same mistake now crashes.

## Case 8: Follow the Data in Order (a callback prop)

**Context.** Lecture 13. The reader has passed data down as props and has just learned `onClick` on a `<button>`.

**Failing version** (Lecture 13, Principle 2, shipped):

> **Principle 2: Hand Behavior to a Child Through an on Prop and Wire It to a Real Element**
> When the parent decides what a click means, pass a function through a prop named for the app action (<ArticleCard onSelect={handleSelect} />) and, inside the child, pass that prop to a built-in element's event prop (<button onClick={() => onSelect(id)}>), because only built-in elements turn browser events into handler calls; a custom component ignores props it does not use.
> Side notes: "callback prop", "DOM element boundary".

**What the reader goes through.** Again one long sentence with two code pieces in parentheses. The title says "wire it to a real element", which only makes sense once you know the failure. "DOM element boundary" is an invented term.

**A better version:**

> [!PRINCIPLE]
> **Principle N: The Parent Passes a Function, the Child Gives It to a Button**
> Often the parent decides what a click means, while the child draws the button. So the parent passes a function down as a prop, named after what happens in the app: `<ArticleCard onSelect={handleSelect} />`. The child then gives that prop to its own button: `<button onClick={onSelect}>`. If the child skips this, clicking does nothing. A prop on our own component is only a prop; React connects clicks only to built-in elements such as `<button>`.
>
> *We should do this:*
> `function ArticleCard({ onSelect }) {`
> `  return <button onClick={onSelect}>Read</button>; // click calls it`
> `}`
>
> *We should not do this:*
> `function ArticleCard({ onSelect }) {`
> `  return <div>Read</div>; // onSelect is never used`
> `}`

**Why it works.** The box follows the function as it travels: the parent, the prop, the child, the button. The failure is a thing the reader sees (nothing happens) and its cause is one sentence.

**Take to other topics.** When a principle involves two places in the code, tell them in the order the data or the click moves through them. A sequence like this needs no bullets.

## Case 9: Two Names That Look Alike (`e.currentTarget` and `e.target`)

**Context.** An events lesson. The reader has used the event object once or twice.

**A version that works** (from the earlier exemplar bank, with a code pair added):

> [!PRINCIPLE]
> **Principle N: Use `e.currentTarget` for the Element That Listens**
> When an event fires, the event object gives us two element references:
>
> - **`e.currentTarget` (The Listener):** the element that holds the running handler, such as our `<article>` card.
> - **`e.target` (The Trigger):** the innermost element the user actually clicked, such as a `<span>` inside the card.
>
> A preview window that should close only when the user clicks its dark background checks `e.target === e.currentTarget`.
>
> *We should do this:*
> `if (e.target === e.currentTarget) onClose(); // background only`
>
> *We should not do this:*
> `onClose(); // also closes on a click inside the window`

**Why it works.** This is the case where bullets earn their place: two names that look alike, read in the same line of code. The labels help, because the code names alone are easy to swap.

**Do not copy.** Labels in parentheses are right only when the code names confuse. "`e.stopPropagation()` (Local Containment)" repeats a clear name in heavier words.

## Case 10: Words the Reader Cannot Picture (a jargon sweep)

**Context.** Every lesson. These phrases appeared in boxes and explanations; each one was precise to the author and empty to the reader.

| What the box said | What the reader can picture |
| --- | --- |
| a value that survives across renders | a value that keeps its number when React updates the card |
| runs during render | runs when the component appears on the screen |
| each render resets local variables | each time React runs the component, `let count = 0` runs again |
| an evaluation window | curly braces, which show the value of a variable |
| empty render slots that emit zero DOM nodes | React shows nothing for `true`, `false`, `null`, and `undefined` |
| renders primitive numbers as living DOM text nodes | React shows numbers as text |
| premature invocation | the function runs at once |
| a new execution context | each run starts with fresh variables |
| durable memory outside the function | React keeps the value for us |

**Why it matters.** The left column is not wrong; it is unreadable for someone who does not already know the answer. Words like render are worth teaching because the docs and interviews use them. Name such a word once where the lesson explains it, and elsewhere say what happens.

## Case 11: A Code Pair That Stands Alone

**Context.** Every box ends with a code pair, and readers look at it first.

**Failing versions:**

- One context-free line with the lesson's names and a long comment: `onClick={() => setLikes(likes + 1)} // Calls setter to store next count and render`. The reader has not met `likes` in the box and cannot tell what the line belongs to.
- No pair at all, because an earlier rule said that principles about how React works carry no pair. Readers lost the one part of the box they could check with their eyes.
- The same code printed again under the box, a few lines later, as the "proof".

**What works.** A few lines that make sense with nothing around them, using plain general names (`count`, `setCount`, `Counter`) so the box reads like a rule and not like a page from the story. The comment says what the reader would see ("the screen keeps showing 0", "runs at once"), in a few words. The story's own names (`likes`, `StoryCard`) appear in the paragraph and the code blocks under the box, where the lesson's example lives. Compare the pairs in Cases 2, 6, and 8.

**Labels.** `*We should do this:*` / `*We should not do this:*` when the wrong code breaks; `*It is best practice to do this:*` / `*Instead of doing this:*` when both run and one is better, as in Case 6.

## Case 12: The Paragraph Under the Box

**Context.** The box gives the rule in general names. The paragraph under it shows the rule on the lesson's own example, with the outputs the map verified.

**Failing version** (Lecture 14, October 6 run, under the setter box):

> In Lecture 13, we learned that expressions inside JSX curly braces evaluate immediately during the render phase. If you write `onClick={setLikes(likes + 1)}`, JavaScript executes `setLikes` while React is building the element tree. The setter updates state and immediately queues another render. React re-runs the component, hits the JSX braces, and executes `setLikes` again. Without a stopping condition, this creates an infinite render loop.

The same lecture ended five paragraphs with "... belongs to Lecture N".

**A better version** (Lecture 14, the demo, revised by the owner's feedback):

> Leo writes `onClick={setLikes(likes + 1)}` on the Like button. The card is about to appear, and `setLikes(1)` runs right away, before any click. React draws the card again, and `setLikes(1)` runs again. This repeats until React stops with "Too many re-renders. React limits the number of renders to prevent an infinite loop." The card never appears.
>
> With `onClick={() => setLikes(likes + 1)}`, the button gets the arrow function and keeps it. The setter inside runs only when the user clicks. Passing a named handler, `onClick={handleLike}`, works the same way. This is the rule from Lecture 13: give the button a function, do not call it.

**Why it works.** It replays the box on the lesson's card, with the real value (`setLikes(1)`) and the exact error text, in the order things happen. It does not repeat the box's words. The earlier lesson is named where it helps, in a normal sentence.

**Take to other topics.** Under the box, use the story's names, quote only outputs that were verified, and refer to another lesson in an ordinary sentence ("Lecture 16 explains why"), varied as speech varies.
