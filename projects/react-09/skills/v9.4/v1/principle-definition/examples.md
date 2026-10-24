# Principle Casebook #2026_10_06_05_group_1

Every box marked "Approved by the owner" was read and accepted by the owner of this series. Every failed version is quoted as it was written, with the reason it failed. Nothing else belongs in this file: a box enters only after the owner approves it.

All seven cases come from one lesson, so their names (`count`, `setCount`, `Counter`) and topic repeat. Take the moves, never the topic, the names, or the length. Your lesson has its own reader and its own questions.

The rules these cases enforce are listed in `SKILL.md` beside this file.

Approved titles are shown in sentence case, the title rule in `SKILL.md` Section 01. Failed drafts keep the case they were written in. #2026_10_07_01_group_1

## Case 1: Show How the Screen Gets Its Value (assignment does not update the screen) #2026_10_06_05_group_1

**Context.** Lecture 14 (`useState`). The reader knows plain JavaScript, JSX, props, and event handlers (Lecture 13). The reader has just watched a counter variable grow in the console while the button keeps showing 0.

**Failed: the October 6 run**

> **Principle 1: Assigning a Local Variable Does Not Ask React to Render**
> React updates what is on the screen only when it renders a component again. Assigning a new value to a local variable changes memory that React does not watch. Because an assignment alone never requests a render, the screen remains stuck on the old value.

**Failed: the first rewrite**

> **Principle 1: Changing a Variable Does Not Change the Screen**
> We add one to a variable in a click handler and expect the screen to show the new number. It does not. The variable changes, but the screen keeps the old number. React never looks at our variables. It changes the screen only when it runs the component again, and a plain assignment does not ask it to.

**Failed: the second rewrite**

> **Principle 1: The Button Keeps the Number It Got When the Component Ran**
> When React runs `StoryCard`, the line `<button>Like ({likes})</button>` puts the number `likes` holds at that moment, 0, into the button's text. The button now says `Like (0)`. A click changes `likes` to 1, but nothing puts the new number into the button. The button changes only when React runs `StoryCard` again, so that line runs again with the new number. Changing a variable does not make React do that.

**Why the failed versions fail.**

- The October 6 run says "render" three times. The reader cannot picture it.
- The first rewrite only claims ("React never looks at our variables", "a plain assignment does not ask it to"). It treats React as a person. It never says why running the component changes the screen. The owner: "I don't get it."
- The second rewrite finds the mechanism but tells it with the lesson's story: `StoryCard`, `likes`, `Like (0)`. A principle is a rule for every component. The owner had already asked for general names.

**Approved by the owner:**

> [!PRINCIPLE]
> **Principle N: The screen keeps the value it got when the component ran**
> When React runs a component, the `{count}` in its JSX puts the current value of `count` on the screen, for example 0. A click handler then changes `count` to 1, but nothing puts the new value on the screen. The screen changes only when React runs the component again, because only then is `{count}` read again. Changing a variable does not make React run the component. Calling a setter does, as Principle 3 shows.
>
> *We should do this:*
> `const [count, setCount] = useState(0);`
> `setCount(count + 1); // React runs the component again`
>
> *We should not do this:*
> `let count = 0;`
> `count = count + 1; // the screen still shows 0`

**Why it works.**

- It shows the mechanism step by step: the component runs, `{count}` puts the value on the screen, the click changes the variable, nothing puts the new value on the screen.
- "Runs again" gets a visible job: only then is `{count}` read again.
- General names only. The lesson's card appears in the paragraph under the box.
- It names the way out and where it is taught ("as Principle 3 shows"). The owner chose to keep this pointer, even though "setter" is taught later.

## Case 2: Say the Basic Fact First (local variables start over) #2026_10_06_05_group_1

**Context.** Lecture 14 (`useState`). The reader knows plain JavaScript, JSX, props, and event handlers (Lecture 13). The reader has just learned that changing a variable does not change the screen. They have never thought about how often React runs a component.

**Failed: the October 6 run**

> **Principle 2: Each Render Calls the Function Again and Resets Local Variables**
> A React component is a function that React calls from the top every time it renders. Every local variable declared inside the component body is created fresh during that call and vanishes when the function returns. When a component re-renders, its local variables reset back to their initial values.

**Failed: first draft**

> **Principle 2: Running the Component Again Starts Its Variables Over**
> Suppose a plain variable has reached 3, and then a setter makes React run the component again, even a setter for some other value. Running the component means calling its function again from the first line. So `let count = 0` runs again, and `count` is 0 once more. The 3 belonged to the previous call, and that call is over. A plain variable inside a component lasts for one run only.

**Failed: second draft**

> **Principle 2: Each Run of a Component Starts Its Variables Over**
> We change a plain variable, and later a setter makes React run the component again. We expect the variable to keep its new value. It does not. React runs a component by calling its function from the first line. So `let count = 0` runs again, and `count` is 0 again. A plain variable inside a component lasts only until the function returns.

**Why the failed versions fail.**

- The October 6 run talks about renders and "re-renders". The reader cannot picture them.
- Both drafts hide the basic fact the principle stands on (React runs a component many times, every time the screen must change) inside a side clause, as if the reader knew it.
- Both lean on "setter", which the next principle teaches.
- The first draft stacks conditions ("suppose... and then... even a setter for some other value"). The owner: "awful".
- The second draft opens with a riddle: "later" than what? Why would a setter run the component? The owner: "What kind of cryptomeaning is this?"

**Approved by the owner:**

> [!PRINCIPLE]
> **Principle N: Each run of a component starts its variables over**
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

**Why it works.**

- The first sentence states the basic fact plainly, with no new word.
- The second ties it to plain JavaScript: running a component is calling its function from the first line.
- Only then the consequence, on a line the reader can see (`let count = 0` runs again), and last the rule.

## Case 3: State the Need, Then the Tool (the state pair) #2026_10_06_05_group_1

**Context.** Lecture 14 (`useState`). The reader knows plain JavaScript, JSX, props, and event handlers (Lecture 13). The reader now knows two problems with plain variables: changing one does not change the screen, and each run starts it over.

**Failed: the October 6 run**

> **Principle 3: Store Durable Values in State and Update Them Exclusively with Setters**
> To keep data that survives across renders and updates the screen, store it in a state variable using the `useState` Hook. React returns a pair: the current value to read during this render, and a setter function to request the next value. We update state exclusively by calling the setter; reassigning the state variable directly throws a TypeError: Assignment to constant variable.
>
> >> state variable : a value React retains across renders for a component
> >> Hook : a special function starting with use that lets components tap into React features
> >> setter function : a function returned by useState that stores the next state and requests a render

**Why the failed versions fail.**

- "Durable values", "survives across renders", "during this render": three abstractions in two sentences.
- Three side notes define words the box only names. The reader gets a glossary instead of an idea.
- The code pair used the lesson's `likes` and `setLikes`, so it could not be read alone.

**Approved by the owner:**

> [!PRINCIPLE]
> **Principle N: `useState` gives a value that lasts and a function that changes it**
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

**Why it works.**

- It first reminds the reader of the need, in their terms: keep the value between runs, and make React run the component again when it changes.
- It says plainly that a plain variable does neither. Then `useState` appears as the answer.
- Bullets, because one line of code gives two things with different jobs. Each bullet says what its thing does.

## Case 4: Answer the Question the Reader Is About to Ask (state outside the function, matched by order) #2026_10_06_05_group_1

**Context.** Lecture 14 (`useState`). The reader knows plain JavaScript, JSX, props, and event handlers (Lecture 13). The reader knows that each run calls the function from the first line, and has just met `useState(0)`.

**Failed: the October 6 run**

> **Principle 4: React Keeps State Outside the Function and Matches It by Call Order**
> React stores state data outside the component function in an internal memory list. On the initial render, React saves each starting value in order. On subsequent renders, React ignores the argument and returns the stored value matching that call's position in the sequence. Calling Hooks conditionally disrupts this call order and corrupts state alignment.
>
> >> call order : the fixed sequence in which a component invokes its Hooks on every render
> >> internal memory list : React's private storage outside the component function that holds state pairs

**Why the failed versions fail.**

- It starts with the mechanism ("an internal memory list") before the reader has a reason to want it.
- "Corrupts state alignment" names no effect the reader can see.
- Its two side notes are invented terms.

**Approved by the owner:**

> [!PRINCIPLE]
> **Principle N: React keeps state outside the component and matches it by order**
> Each run calls the component's function from its first line, so `useState(0)` runs again on every run. We might expect it to set `count` back to 0, as `let count = 0` does. It does not. React keeps the value itself, outside our function. On the first run, `useState(0)` stores 0. On every later run, React ignores the 0 and returns the stored value.
>
> A component can call `useState` several times, once for each value. React never sees our names `count` or `isOn`. It matches each call to its stored value only by order: first call, second call. So the calls must come in the same order on every run, which means never inside an `if`.
>
> *We should do this:*
> `const [count, setCount] = useState(0); // first call`
> `const [isOn, setIsOn] = useState(false); // always the second call`
>
> *We should not do this:*
> `const [count, setCount] = useState(0);`
> `if (count > 0) {`
> `  const [isOn, setIsOn] = useState(false); // React throws an error`
> `}`

**Why it works.**

- It starts from what the reader just learned (the function runs from the first line) and draws the obvious expectation: `useState(0)` should set `count` back to 0.
- It breaks the expectation in two words ("It does not.") and then gives the mechanism.
- The second idea (order) answers the next question: how does React know which stored value belongs to which call?

## Case 5: Picture the Copies on the Screen (each copy keeps its own state) #2026_10_06_05_group_1

**Context.** Lecture 14 (`useState`). The reader knows plain JavaScript, JSX, props, and event handlers (Lecture 13). The reader knows that React keeps the value outside the function.

**Failed: the October 6 run**

> **Principle 5: Each Rendered Component Instance Maintains Its Own Isolated State**
> State belongs to each rendered component instance, not to the component function in your file. When you render two `<StoryCard />` elements on the same page, React creates two completely independent memory slots in the tree. Clicking Like on the first card updates only that card's count to 2 likes while the second card remains at 0 likes. The parent component can neither read nor modify these private values.
>
> >> component instance : a single mounted copy of a component element in the UI tree
> >> private state : memory isolated inside one rendered instance that outside components cannot touch

**Why the failed versions fail.**

- It opens with the abstract rule ("state belongs to each rendered component instance") before the reader pictures two copies.
- "Memory slots in the tree" and "private state" are machinery words.
- It uses the lesson's `StoryCard` and Like counts in the box.

**Approved by the owner:**

> [!PRINCIPLE]
> **Principle N: Each copy of a component on the screen keeps its own state**
> One component function can appear on the screen many times. A parent that returns `<Counter />` twice shows two counters. Both copies run the same function, with the same `useState(0)` line, so we might expect them to share one count. They do not. React keeps a separate set of stored values for each copy on the screen, called a component instance. A click on the first counter changes only the first count, and React runs only that copy again.
>
> >> component instance : one copy of a component on the screen, with its own stored values
>
> *We should do this:*
> `function Counter() {`
> `  const [count, setCount] = useState(0); // one count per copy`
> `  const add = () => setCount(count + 1);`
> `  return <button onClick={add}>{count}</button>;`
> `}`
>
> *We should not do this:*
> `let count = 0; // one variable shared by every copy`
> `function Counter() {`
> `  const add = () => { count = count + 1; }; // screen stays at 0`
> `  return <button onClick={add}>{count}</button>;`
> `}`

**Why it works.**

- It first shows the picture: one function, two copies on the screen.
- It states the natural expectation (one `useState(0)` line, so maybe one shared count) and breaks it.
- It names the term once ("called a component instance") and ends with what the reader sees after a click.

## Case 6: Remind the JavaScript Before the React (an expensive starting value) #2026_10_06_05_group_1

**Context.** Lecture 14 (`useState`). The reader knows plain JavaScript, JSX, props, and event handlers (Lecture 13). The reader knows that React uses the starting value only on the first run.

**Failed: the October 6 run**

> **Principle 6: Pass an Initializer Function When Initial State Is Expensive to Compute**
> React uses the initial state argument on the first render only and ignores it on all later renders. However, calling a function in the argument like `useState(createInitialLikes())` runs on every single render cycle. When computing the start value is expensive, pass an initializer function by reference (`useState(createInitialLikes)`), so React invokes it once during setup and skips the work on subsequent renders.
>
> >> initializer function : a function passed without parentheses that React calls once to create the initial state
> >> initial state argument : the value or function passed to useState to seed a state variable

**Why the failed versions fail.**

- "Initial state argument", "render cycle", "by reference", "during setup": four phrases the reader must decode.
- It never reminds the reader of the JavaScript difference that the whole principle depends on.

**Approved by the owner:**

> [!PRINCIPLE]
> **Principle N: Pass an expensive starting value as a function**
> React uses the starting value of `useState` only on the first run and ignores it after that. In JavaScript, `f()` calls a function at once and passes its result, while `f` passes the function itself. Each run of the component executes the whole `useState` line. So `useState(createItems())` calls `createItems` on every run, and React throws each later result away. When `createItems` does slow work, that work is wasted on every run. `useState(createItems)` passes the function itself, an initializer function, and React calls it only on the first run. A cheap starting value such as `0` needs no function.
>
> >> initializer function : a function passed to useState that React calls once to make the starting value
>
> *It is best practice to do this:*
> `const [items, setItems] = useState(createItems); // first run only`
>
> *Instead of doing this:*
> `const [items, setItems] = useState(createItems()); // every run`

**Why it works.**

- It states the React fact first (the starting value counts once), then reminds the JavaScript fact: `f()` calls at once and passes the result, `f` passes the function itself.
- The consequence follows from those two facts, on code the reader can see.
- It ends with the honest limit: a cheap value such as `0` needs no function.

## Case 7: Ask the Reader's Own Question (a setter called while the component runs) #2026_10_06_05_group_1

**Context.** Lecture 14 (`useState`). The reader knows plain JavaScript, JSX, props, and event handlers (Lecture 13). Lecture 13 taught that an event prop receives a function.

**Failed: the October 6 run**

> **Principle 7: Call Setters Exclusively Inside Event Handlers and Never During Render**
> Call a setter function only inside an event handler, never unconditionally in the component body or directly inside JSX evaluation braces. Calling `onClick={setLikes(likes + 1)}` invokes the setter immediately during render, which schedules another render, invoking the setter again in an infinite loop. React halts this cycle by throwing the fatal runtime error: Too many re-renders. React limits the number of renders to prevent an infinite loop.
>
> >> unconditional render call : executing a state setter directly while React is calculating JSX
> >> infinite render loop : a crash where a render triggers a state update that immediately triggers another render

**Failed: the demo rewrite, written to a four-beat formula**

> **Principle 7: Call a Setter When the Reader Clicks, Not While React Runs the Component**
> In HTML, `onclick="..."` stores code that runs later, on the click. So `onClick={setCount(count + 1)}` looks like it stores an update for later. But to build the button, React runs the component function, and code inside JSX braces runs right then. So the setter runs before anyone clicks. It asks React to run the component again, and that run calls the setter again.

**Why the failed versions fail.**

- The October 6 run says "during render" and invents two terms for its side notes.
- The demo rewrite followed a fixed formula and stopped the reader at "later": later than what? It explained how React builds the button before the reader knew anything goes wrong.

**Approved by the owner:**

> [!PRINCIPLE]
> **Principle N: Call a setter only when the user clicks**
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

**Why it works.**

- Written by the owner. It asks the reader's own question ("When does that function run?") and answers with two moments the reader can picture: the component appearing, and the click.
- The loop is a chain of plain events. The fix comes last, as one line of code.
- The question form fits here because the whole principle is one question. Other principles need no question.
