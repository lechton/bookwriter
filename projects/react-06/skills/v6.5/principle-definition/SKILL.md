---
name: principle-definition
description: Guides the writing of every `> [!PRINCIPLE]` callout (title, definition, glosses, and the code pair) through eight thinking steps with living examples, plus the exemplar bank of finished boxes.
---

# Principle Definition

This skill governs everything inside the principle box: the title, the definition, the marginal glosses, and the code pair (`*We should do this:*` / `*We should not do this:*`) that closes every box. Load it whenever a principle is drafted, in the Phase 1 blueprint or the Phase 2 lecture. The explanation below the box stays with principled-theory; the comment rules for code lines stay with code-blocks and code-comment-audit. #2026_10_04_09_group_1 revised by #2026_10_04_11_group_1 and #2026_10_06_03_group_1

Notes: The steps guide the thinking; the shape of the box follows from the answers. The blueprint writes the answers for every principle as a `[principle-steps]` element right before its box (see pre-lecture), so the reasoning can be read and checked before Phase 2. The lecture carries only the finished box. The principle boxes of Lectures 1 to 13 are the shipped standard: plain sentences, side notes, and a code pair in every box. #2026_10_04_10_group_1 revised by #2026_10_04_11_group_1 and #2026_10_06_03_group_1

## The Eight Steps | 01 | Thinking a Principle Through #2026_10_04_10_group_1

- [ ] **Step 1: Find the decision.** What will the reader do differently in their code after reading this principle? Write it for yourself in one plain line. The map entry is information (which decision, in what order), never wording to reuse. #2026_10_04_10_group_1
    * Good (Lecture 6, Principle 5): *"When `null` or `0` can arrive, use `??`, because a default value will not catch them."*
- [ ] **Step 2: Decide the shape.** Write the definition as plain sentences that move in three beats: the thing we work with, what the browser or React does with it, and what we write (and what breaks if we don't). This is the shape of almost every box in Lectures 1 to 13. Use bullets only when the reader must tell two real things apart in the same code: two look-alike references (`e.currentTarget`, `e.target`), two owners of one value (`value`, `defaultValue`), or two places in one file (the component body and an event handler). The paired exception boxes in the bank show that shape. #2026_10_04_07_group_1 revised by #2026_10_04_09_group_1, #2026_10_04_10_group_1, and #2026_10_04_11_group_1
    * Prose (Lecture 4, Principle 5): the rogue zero box in the bank below, one rule followed by its code pair.
    * Prose (Lecture 5, Principle 4): *"Place shared data in the closest common ancestor and pass it down each branch."* One rule, nothing to tell apart.
    * Bullets: the reader confuses `e.currentTarget` with `e.target` (the listener box in the bank below).
    * Bad: bullets with vague labels (*"The Render Calculation"*, *"The User Reaction"*) or side details such as the StrictMode double render, so the rule gets lost.
    * Bad: bullets in every box of a lecture, each with a label that repeats the code name in heavier words (*"`e.stopPropagation()` (Local Containment)"*).
- [ ] **Step 3: Name each thing as the reader sees it.** Use its name in the code first (`count > 0`, `e.target`, `<article>`). Add a human label such as *The Listener* only when it makes the idea clearer than the code name alone. #2026_10_04_03_group_1 revised by #2026_10_04_10_group_1 and #2026_10_04_11_group_1
    * Good: `count > 0` and `count` need no extra label.
    * Good: *The Listener* and *The Trigger* help, because `currentTarget` and `target` look alike.
    * Bad: *"`e.preventDefault()` (The Default Action Cancel)"* repeats the code name in heavier words.
    * Say who provides each thing: the browser, React, or our code. A fixed name such as `onClick` is a name React provides; never call it "React's prop", which mixes it up with the props one component passes to another. #2026_10_04_11_group_1
    * Good: *"`onClick` (provided by React): a fixed name that tells React to run a function when this element is clicked. `handleSave` (written by us): our own function, named as we like, holding what should happen on the click."*
    * Bad: `onClickCapture` and `handleSave` side by side in one list, as if both were functions we wrote.
- [ ] **Step 4: Show what breaks.** Picture the reader running the wrong code. What do they actually see on the screen, in the console, or in the build? Write that, in plain words, and check that it is true in React 19 (a warning is not a crash; a development-only behavior such as the StrictMode double render is not a production bug). #2026_10_04_03_group_1 revised by #2026_10_04_09_group_1, #2026_10_04_10_group_1, and #2026_10_04_11_group_1
    * Good (Lecture 1, Principle 2): *"different parts of the screen show conflicting information for the same user."*
    * Bad (Lecture 5, Principle 4): *"avoiding broken variable references between siblings."* The reader cannot picture it.
    * Bad: *"sending duplicate requests to your server"* for a request in the component body. The double call comes from StrictMode, which runs only in development.
    * The example never shows, as good practice, a pattern an earlier lecture warns against. Bad: reading an id back with `e.currentTarget.dataset.id`; Lecture 1 (Principle 4) keeps data in JavaScript, not in HTML attributes, and Lecture 13 passes the id directly with `() => openArticle(article.id)`. Good: a preview window that closes only when `e.target === e.currentTarget`, meaning the click landed on the dark background itself. #2026_10_04_11_group_1
- [ ] **Step 5: Check the technical words.** The map's `## Terms` table shows which words are new in this lesson. For each technical word, decide one of three: already taught (leave it); new and needed (use it in the definition itself and give it a side note with the same words); new but not needed (swap it for a plain word). Every side-note phrase appears word for word in the definition. #2026_10_04_10_group_1 revised by #2026_10_06_01_group_2
    * Good (Lecture 1, Principle 2): *"state drift"* appears in the definition and in the side note.
    * Good (Lecture 6, Principle 5): *"deliberate values"* appears in the definition and in the side note.
    * Bad (Lecture 4, Principle 5): the side note says *"rogue zero"* but the definition says *"orphaned `0`"*, so the reader meets two names for one thing.
    * Bad (Lecture 11, Principle 5): the side note explains *"random key churn"*, a phrase the definition never uses.
- [ ] **Step 6: Write the title.** State the action in plain words, using the canonical terms interviewers expect (`props`, `key`, `children`) and everyday verbs (`pass`, `read`, `show`, `close`). The map's title is a working title. #2026_09_26_12_group_1 revised by #2026_10_04_10_group_1
    * Good (Lecture 6, Principle 5): *"Handle Null and Zero Explicitly Because Defaults Only Catch Undefined"*.
    * Bad (Lecture 2, Principle 1): *"Enforce PascalCase Capitalization to Emit Function Identifiers"*. *"Emit function identifiers"* means nothing to a beginner.
- [ ] **Step 7: Read it as a beginner.** Can it be understood in one read? Remove jargon, academic dressing (*"lives authoritatively"*), and anything the lessons have not taught yet. If it reads like the map entry with synonyms swapped, start again from Step 1. #2026_10_04_10_group_1 revised by #2026_10_04_11_group_1
    * Bad (Lecture 4, Principle 5): *"renders primitive numbers as living DOM text nodes"*. Plainer: *"React shows numbers on the screen but hides `true` and `false`."*
    * Speak as "we": *"we pass"*, *"we write"*. Verbs say what actually happens (React runs, calls, fills in, shows), never intention (*"React chose"*, *"React wants"*). #2026_10_04_11_group_1
- [ ] **Step 8: Compare with the bank.** Does the box feel like the finished examples below (same clarity, same weight, same shape) without copying their wording into a lesson that teaches a different decision? #2026_10_04_10_group_1 revised by #2026_10_04_11_group_1

## Callout Syntax | 02 | Header, Definition, Glosses, and Code Pair #2026_09_25_03_group_1 revised by #2026_10_04_09_group_1 and #2026_10_04_11_group_1

- [ ] Does the header use bold continuous numbering: `> **Principle N: Active Descriptive Title**`?
- [ ] When Step 2 chose bullets, are they consecutive `> - ` lines, one continuous line each, with one blank `>` line before the list and one after it? The build renders them as a list inside the definition card. #2026_10_04_09_group_1
- [ ] Are marginal glosses written as `> >> phrase : explanation`, one per line after the definition?
- [ ] Does every principle close its box with a code pair after the glosses: `*We should do this:*` / `*We should not do this:*` when the wrong code breaks, or `*It is best practice to do this:*` / `*Instead of doing this:*` when both versions run? Each code line sits in its own backticks inside the box, with its comment at the end of the line. A `Kind: Decision` pair comes from the map's Review Point; a `Kind: Model` pair comes from the map's Code Pair: the code the model predicts correctly, against the code the Tempting Belief writes. #2026_10_04_11_group_1 revised by #2026_10_06_03_group_1
- [ ] Is every line free of em-dashes and hard wraps?

## Golden Exemplar Bank | 03 | Finished Boxes #2026_09_26_13_group_1 revised by #2026_10_04_09_group_1, #2026_10_04_10_group_1, and #2026_10_04_11_group_1

Each exemplar is a finished box. When the lesson teaches the same decision, the exemplar is the target; when it teaches a different decision, take its clarity, not its words. The standard shape comes first and covers almost every principle; the paired exception follows. #2026_10_04_11_group_1

### The Standard Shape: Plain Sentences and a Code Pair #2026_10_04_11_group_1

- [ ] PROPER EXAMPLE: Two parser modes (Lecture 4, Principle 1): #2026_09_26_13_group_1 revised by #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Step Out of Static Markup Using Curly Braces as an Evaluation Window**
> Wrapping identifiers in curly braces opens an evaluation window: the JSX parser switches from static text into JavaScript expression evaluation. The runtime reads the live variable from memory and injects its value directly into the rendered tree.
>
> >> evaluation window : curly braces that switch the parser from static markup to JavaScript code
>
> *We should do this:*
> `<h2>{headline}</h2> // Evaluates variable in JavaScript memory`
>
> *We should not do this:*
> `<h2>headline</h2> // Renders word as static text string`

Notes: Two sentences, one side note, one code pair. The pair shows the two modes, so the definition needs no bullets.

- [ ] PROPER EXAMPLE: Expressions, not statements (Lecture 4, Principle 2): #2026_09_26_13_group_1 revised by #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Pass Only Value-Producing Expressions Inside Curly Braces**
> Curly braces accept exclusively JavaScript expressions that resolve to a discrete value. Imperative control-flow statements like `if`, `for`, and `while` do not produce values and are syntax errors inside JSX argument lists.
>
> >> expression : code that calculates a result we can pass as a function argument
>
> *We should do this:*
> `<span className="badge">`
> `  {isUrgent ? 'URGENT' : 'STANDARD'} // Ternary produces one value`
> `</span>`
>
> *We should not do this:*
> `<span className="badge">`
> `  {if (isUrgent) { 'URGENT' }} // Statement produces no value`
> `</span>`

Notes: The wrong card shows the real mistake a beginner types, and its comment names what fails.

- [ ] PROPER EXAMPLE: Values that render nothing (Lecture 4, Principle 4): #2026_09_26_09_group_1 revised by #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Booleans, Null, and Undefined Render Nothing to Enable Inline Conditionals**
> React treats booleans (`true`, `false`), `null`, and `undefined` as empty render slots that emit zero DOM nodes. This design makes inline conditional rendering clean and concise, whereas numbers and strings always render visible text.
>
> >> empty render slot : a value that renders and puts nothing on the page
>
> *It is best practice to do this:*
> `{isUrgent && (`
> `  <span className="badge">LIVE</span> // Shows nothing when false`
> `)}`
>
> *Instead of doing this:*
> `{isUrgent ? (`
> `  <span className="badge">LIVE</span> // Adds a ternary for no gain`
> `) : null}`

Notes: Both versions run, so the pair uses the best-practice labels.

- [ ] PROPER EXAMPLE: The rogue zero (Lecture 4, Principle 5): #2026_09_26_09_group_1 revised by #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Guard Numeric Conditionals with Explicit Booleans to Prevent a Rogue Zero**
> React hides booleans and nullish values but always shows numbers as visible text. When we check a counter or an array length with logical AND (`&&`), we put an explicit boolean guard such as `count > 0` in front of it, so an empty inbox never shows a rogue zero.
>
> >> rogue zero : a 0 that shows on the screen by mistake when a count of zero reaches &&
> >> explicit boolean guard : a check such as count > 0 that turns a number into true or false
>
> *We should do this:*
> `{unreadCount > 0 && (`
> `  <Badge count={unreadCount} /> // Guard turns zero into false`
> `)}`
>
> *We should not do this:*
> `{unreadCount && (`
> `  <Badge count={unreadCount} /> // Zero prints a visible 0`
> `)}`

Notes: The two kinds of value on the left of `&&` live in the code pair, not in bullets. Both glossed phrases appear word for word in the definition (Step 5).

- [ ] PROPER EXAMPLE: Reference, not call (Lecture 13, Principle 1): #2026_10_04_09_group_1 revised by #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Pass the Handler, Never Call It**
> Give `onClick` a function reference such as `handlePublish`, so React can call it when the user clicks. When the handler needs arguments, pass a new function that makes the call: `onClick={() => openArticle(article.id)}`. Writing `handlePublish()` inside the braces is a premature invocation: the function runs during render, and `onClick` receives its return value instead of a function.
>
> >> function reference : the function itself, passed uncalled so React can run it later
> >> premature invocation : running a function during render by adding parentheses inside JSX braces
>
> *We should do this:*
> `<button onClick={handlePublish}> // Passes the function uncalled`
> `  Publish`
> `</button>`
>
> *We should not do this:*
> `<button onClick={handlePublish()}> // Runs it during render`
> `  Publish`
> `</button>`

Notes: `onClick` is a name React provides; `handlePublish` is our function. The definition carries the common variation (arguments) and the physical defect.

- [ ] PROPER EXAMPLE: Data in memory, not in markup (Lecture 1, Principle 4): #2026_09_26_13_group_1 revised by #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Store Data in JavaScript Variables, Not in HTML Attributes**
> Keep our data in JavaScript variables, numbers, and objects, not in HTML elements. React uses the DOM only to display results, so our code never reads HTML attributes like `data-tier` to figure out what is happening in the app.
>
> >> HTML attributes : the name and value pairs written on a tag, such as data-tier="PRO"
>
> *It is best practice to do this:*
> `const user = { name: 'Clara', tier: 'PRO' };`
> `return <Badge tier={user.tier} />; // Reads data from memory`
>
> *Instead of doing this:*
> `const badge = document.getElementById('badge');`
> `const tier = badge.getAttribute('data-tier'); // Reads the HTML`

Notes: Canonical nouns (data, DOM, HTML attributes) with plain verbs (keep, use, display, read). Every later example must respect this law (Step 4).

- [ ] PROPER EXAMPLE: One owner, many readers (single source of truth): #2026_09_26_13_group_1 revised by #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Pass Data Downward from a Single Source of Truth to Prevent State Drift**
> Data flows in only one direction in React, passing from parent components down to children through **props**. This rule is called **unidirectional data flow**. Because all related widgets receive their data from a **single source of truth**, they always update together. This prevents **state drift**, where different parts of the screen show conflicting information for the same user.
>
> >> unidirectional data flow : passing data strictly downward from parent to child components via props
> >> state drift : two parts of the screen showing contradictory values for the same thing
>
> *It is best practice to do this:*
> `function Header({ user }) { // One parent hands out the data`
> `  return (`
> `    <header>`
> `      <Greeting name={user.name} />`
> `      <Badge name={user.name} />`
> `    </header>`
> `  );`
> `}`
>
> *Instead of doing this:*
> `function syncUser(user) { // Each widget updated separately`
> `  setNav(user.name);`
> `  setBadge(user.name);`
> `}`

Notes: Four calm sentences; each new term is bolded where it occurs and appears word for word in its side note.

- [ ] PROPER EXAMPLE: Describe the screen, do not mutate it (pure return contract): #2026_09_26_15_group_1 revised by #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Return Declarative UI Descriptors Instead of Mutating the DOM Directly**
> A React component returns a UI descriptor, a description of what the screen should look like, instead of modifying the DOM by hand. Our component function should be a pure calculation that returns JSX or `null`. If a component changes the real page during render, it bypasses React's tracking and creates duplicate elements or broken UI.
>
> >> UI descriptor : a lightweight object describing what markup should appear on screen
> >> pure calculation : a function that returns the same result for the same input and changes nothing outside itself
>
> *It is best practice to do this:*
> `function NewsSnippet({ text }) { // Returns a description`
> `  return (`
> `    <p className="summary">{text}</p>`
> `  );`
> `}`
>
> *Instead of doing this:*
> `function NewsSnippet({ text }) { // Changes the page itself`
> `  document.body.append(text);`
> `  return null;`
> `}`

Notes: What to do (return a descriptor), the contract (a pure calculation), and the failure (duplicate elements). The render and commit phases and the StrictMode double call stay in the explanation below.

- [ ] PROPER EXAMPLE: The end state, not the steps (declarative UI): #2026_09_26_13_group_1 revised by #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Write Declarative UI Descriptions Instead of Scripting Imperative DOM Transitions**
> In React, we use **declarative UI** to describe what the screen should look like for every state. We never write **imperative DOM scripts** that add or remove CSS classes step by step (`classList.add`, `classList.remove`). If a script fails halfway through those steps, the element gets stuck in a broken **intermediate state**. React prevents this by swapping to the complete target design in one clean step.
>
> >> declarative UI : describing what the screen should look like instead of scripting each DOM change
> >> intermediate state : a broken half-way condition where old and new styles collide
>
> *It is best practice to do this:*
> `function Status({ isPro }) { // Declares the end state`
> `  return (`
> `    <span className={isPro ? 'pro' : 'standard'}>`
> `      Status`
> `    </span>`
> `  );`
> `}`
>
> *Instead of doing this:*
> `function setStatus(isPro) { // Toggles classes step by step`
> `  const el = document.getElementById('status');`
> `  if (isPro) el.classList.add('pro');`
> `  else el.classList.remove('pro');`
> `}`

Notes: Explains why the bug happens (a script failing halfway) in simple, human terms.

- [ ] PROPER EXAMPLE: Patch the changed node (virtual DOM reconciliation): #2026_09_26_13_group_1 revised by #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Use Virtual DOM Reconciliation to Surgically Patch the DOM Without Destroying Focus**
> When data changes, React updates only the specific text or element that changed instead of wiping the whole container with `innerHTML`. It achieves this precision through **virtual DOM reconciliation**. Before touching the real browser, React builds a fresh tree of objects in memory and checks it against the previous tree. It finds the exact difference and updates only that node in the browser, keeping living elements and the **active text cursor** alive.
>
> >> virtual DOM reconciliation : comparing two lightweight object trees in memory to find differences before touching the page
> >> active text cursor : the blinking insertion point inside an input field, which a full rewrite resets
>
> *It is best practice to do this:*
> `return ( // React patches only the changed text`
> `  <span>Welcome, {readerName}</span>`
> `);`
>
> *Instead of doing this:*
> `header.innerHTML = // Wipes and rebuilds the container`
> `  '<span>' + readerName + '</span>';`

Notes: The physical contrast comes first (patch one node vs wipe with `innerHTML`), then the canonical mechanism, then the memory-to-DOM sequence, without participial chains.

- [ ] PROPER EXAMPLE: Components turn data into markup (UI = f(data)): #2026_09_26_13_group_1 revised by #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Build Components as Functions That Turn Data into Markup (UI = f(data))**
> React builds user interfaces using **component functions** that turn data directly into markup: `UI = f(data)`. When data changes, React runs the function again with new values, so we never have to search the page with `document.getElementById` or update nodes by hand.
>
> >> component functions : functions that receive data and return markup descriptors
>
> *It is best practice to do this:*
> `function Header({ user }) { // Markup comes from the data`
> `  return (`
> `    <h1>Welcome, {user.name}</h1>`
> `  );`
> `}`
>
> *Instead of doing this:*
> `function updateHeader(user) { // Searches and edits the page`
> `  const el = document.getElementById('name');`
> `  el.textContent = user.name;`
> `}`

Notes: Contrasts a function that projects data against manual searching of the page.

- [ ] PROPER EXAMPLE: Tags, not function calls (component elements): #2026_09_26_06_group_1 revised by #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Render Components Using JSX Tags, Not Direct Function Calls**
> When mounting a component, we write it as a **JSX tag** like `<ArticleCard />` so React registers the component in its tree. Calling a component as a raw JavaScript function like `{ArticleCard()}` runs the code immediately but bypasses React's lifecycle and hook tracking.
>
> >> JSX tag : syntax that tells React to manage a component's lifecycle and place in the render tree
>
> *It is best practice to do this:*
> `function NewsFeed() {`
> `  return (`
> `    <main>`
> `      <ArticleCard /> // React manages this component`
> `    </main>`
> `  );`
> `}`
>
> *Instead of doing this:*
> `function NewsFeed() {`
> `  return (`
> `    <main>`
> `      {ArticleCard()} // Runs as a plain function call`
> `    </main>`
> `  );`
> `}`

Notes: A deep runtime rule rather than a syntax typo: the direct call compiles and runs, but React cannot manage the component's hooks.

- [ ] PROPER EXAMPLE: Nested elements arrive as children (map text translated): #2026_09_27_04_group_1 revised by #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Pass Elements as Children Props**
> When we place elements between a component's tags, React passes them to that component as a prop named `children`. React packages nested markup into the exact same props object as regular attributes. This allows a container to display dynamic content without hardcoding what that content must be.
>
> *We should do this:*
> `function Card({ children }) { return <div className="card">{children}</div>; } // Nested heading appears`
>
> *We should not do this:*
> `function Card() { return <div className="card" />; } // Nested heading never appears`

Notes: The map said *"Whatever JSX you nest between a component's tags arrives in props under the key children"*; the box keeps the information and says it with active everyday verbs (*place*, *passes*). `Kind: Model`: the pair sets the belief's code (a container that ignores what it wraps) against the model's. #2026_10_06_03_group_1

- [ ] PROPER EXAMPLE: A single rule in plain prose: #2026_10_04_09_group_1 revised by #2026_10_04_10_group_1 and #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Always Close Every Tag Explicitly**
> Every JSX tag needs an ending: a matching closing tag such as `</p>`, or a self-closing slash such as `<img />`. An `<img>` left open is valid HTML but stops the JSX build with an unterminated tag error.
>
> *We should do this:*
> `<img src={coverUrl} /> // Slash closes the tag`
>
> *We should not do this:*
> `<img src={coverUrl}> // Open tag stops the JSX build`

Notes: One action, one defect, nothing to tell apart, so Step 2 gives plain sentences, and the pair shows the one-character difference.

### The Paired Exception: Bullets for Two Things the Reader Mixes Up #2026_10_04_11_group_1

Use these only when the code holds two real things the reader confuses (Step 2). Every other principle follows the standard shape above. Its code pair follows the closing sentence, as in the standard boxes. #2026_10_04_11_group_1 revised by #2026_10_06_03_group_1

- [ ] PROPER EXAMPLE: Paired properties (`e.currentTarget` vs `e.target`): #2026_10_04_02_group_1 revised by #2026_10_04_09_group_1 and #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Use `e.currentTarget` for the Listening Container, Not `e.target`**
> When an event fires, the React event object gives us two different element references:
>
> - **`e.currentTarget` (The Listener):** the element that holds the running handler, such as our `<article>` card or `<button>`.
> - **`e.target` (The Trigger):** the innermost element the user physically clicked, such as a nested `<span>` or `<svg>` icon.
>
> >> e.currentTarget : the element to which the running event handler is attached
> >> e.target : the deepest element where the user interaction physically started

Notes: Two references that look alike, so two bullets; the labels help because the code names are easy to confuse.

- [ ] PROPER EXAMPLE: Two places in the file (component body vs event handler): #2026_10_04_05_group_1 revised by #2026_10_04_09_group_1, #2026_10_04_10_group_1, and #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Put Side Effects in Event Handlers, Never in the Component Body**
> Keep the component body for calculating UI, and trigger side effects (such as network requests, analytics logging, and `localStorage` writes) inside event handlers:
>
> - **The Component Body (Runs on Every Render):** React calls our component function whenever it renders, and twice per render in development under `StrictMode`.
> - **Event Handlers (Run on Interaction):** functions passed to `onClick` or `onSubmit` run only when a user physically clicks, types, or submits.
>
> A request placed in the component body fires every time the screen redraws, so the server receives calls before the reader has clicked anything.
>
> >> side effects : work that changes something outside the component, such as a request, a stored value, or a log entry

Notes: Two functions in one file that run at different times, so bullets fit. The labels say when each one runs, and the defect is true in production; the StrictMode double call is named only as development behavior.

- [ ] PROPER EXAMPLE: Two owners of an input (`value` vs `defaultValue`): #2026_10_04_03_group_1 revised by #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Use `value` for Controlled State and `defaultValue` for Uncontrolled Inputs**
> When managing form inputs in React, we decide whether React or the browser owns the text:
>
> - **`value` with `onChange` (The Controlled Input):** React state holds the text, and every keystroke updates state before the field shows it.
> - **`defaultValue` (The Uncontrolled Input):** the browser keeps the keystrokes itself, and React only seeds the first string.
>
> If we pass `value` without `onChange`, React locks the field and ignores every keystroke the user types.
>
> >> controlled input : a form element whose text is driven by React state
> >> uncontrolled input : a form element whose text is kept by the browser

Notes: Two owners, two bullets, and an exact defect (*"locks the field and ignores every keystroke"*).

- [ ] PROPER EXAMPLE: Mental model with roles, card-free (`Kind: Model`): #2026_10_04_01_group_1 revised by #2026_10_04_09_group_1 and #2026_10_04_11_group_1

> [!PRINCIPLE]
> **Principle N: Treat State Variables as Render Snapshots Rather Than Live Memory Storage**
> A state variable and its setter play different roles in the same render:
>
> - **The state variable (The Snapshot):** a fixed value captured for this render; every handler and timer created during this render reads this value.
> - **The setter call (The Request):** asks React to render again with a new value; it never changes the variable our running code already holds.
>
> Calling `setCount(count + 1)` three times in one click still reads the same render snapshot each time, so the counter moves by one, not three.
>
> >> render snapshot : the fixed copy of state a single render works with
>
> *We should do this:*
> `setCount(count + 1); // One click, one request, reads this render's value`
>
> *We should not do this:*
> `setCount(count + 1); setCount(count + 1); // Both read the same snapshot, so the count moves by one`

Notes: A `Kind: Model` pair sets the belief's code against the model's; the full prediction is still proved in titled code blocks below the box. Here the labels help, because both roles live in one line of code. #2026_10_06_03_group_1

## Failing Drafts | 04 | What Goes Wrong and Why #2026_10_04_09_group_1

These patterns are described in prose on purpose: a failing draft printed as a callout becomes a template to imitate. #2026_10_04_09_group_1

- [ ] COUNTER-EXAMPLE: Every box turned into bullets (Lecture 14, October 4 run). All six principles opened with a line, two labelled bullets, and a "causes" sentence. Labels such as *"(Local Containment)"* and *"(Browser Action Cancel)"* repeated the code names in heavier words, and Principles 5 and 6 (`Kind: Decision`) carried no code pair. Notes: Compare Lecture 13, whose three boxes are plain sentences followed by the code pair; only a real look-alike pair earns bullets (Step 2). #2026_10_04_11_group_1
- [ ] COUNTER-EXAMPLE: The muddled pair (a Lecture 14 draft). The opening sentence piled up three examples and the phrase *"calculating markup"*; the body bullet carried the StrictMode double render, a development detail that is not the point; the labels *"The Render Calculation"* and *"The User Reaction"* were abstract; the closing sentence joined two claims, one of them false in production (*"sending duplicate requests to your server"*); and the term drifted from *"side effects"* to *"outside actions"*. Notes: The bullets were not the fault; what was in them was. Compare the side effects box in the paired exception above: the same two places, plain labels that say when each runs, and a claim that is true in production. #2026_10_04_10_group_1 revised by #2026_10_04_11_group_1
- [ ] COUNTER-EXAMPLE: The compressed run-on. Two references are folded into one sentence (*"The event object provides currentTarget for the element owning the handler and target for the innermost node the user physically touched"*), with no bullets, no backticks, and no visible tags. The reader cannot see which property tracks which element. Notes: This is a real pair, so Step 2 gives one bullet per reference. #2026_10_04_02_group_1 revised by #2026_10_04_09_group_1 and #2026_10_04_10_group_1
- [ ] COUNTER-EXAMPLE: The map paraphrase. The definition keeps the map's sentence and swaps synonyms: the map's *"React stores a handler during render but calls it only when the event happens"* becomes *"React stores event handlers during rendering but executes them only when a user interacts"*. It reads like a specification. Notes: Go back to Step 1 and write from the decision. #2026_10_04_05_group_1 revised by #2026_10_04_09_group_1 and #2026_10_04_10_group_1
- [ ] COUNTER-EXAMPLE: Filler instead of a defect. The closing clause says *"preventing broken lookups"*, *"for better flexibility"*, or *"avoiding input handling glitches"*. Notes: Step 4: name what returns undefined, what reloads, what prints, or what stops the build. #2026_10_04_03_group_1 revised by #2026_10_04_09_group_1 and #2026_10_04_10_group_1
- [ ] COUNTER-EXAMPLE: The bureaucrat. *"Application state lives authoritatively in JavaScript memory; the browser DOM is strictly a write-only projection surface."* Notes: Plain verbs carry the same law: keep our data in JavaScript variables, and use the DOM only to display it. #2026_09_26_12_group_1 revised by #2026_10_04_09_group_1
- [ ] COUNTER-EXAMPLE: The spec dump. The box carries the whole derivation: compiler output such as `_jsx(ArticleCard)`, function pointers, and painting steps. Notes: The box states the rule and the defect; the machine trace belongs in the explanation below it. #2026_09_26_15_group_1 revised by #2026_10_04_09_group_1
- [ ] COUNTER-EXAMPLE: The buzzword train. *"A directed hierarchy of nested components, establishing top-level roots, intermediate branch containers, and terminal UI controls."* Notes: Name the actual components (`App`, `EditorialFeed`, `ArticleCard`) and what each one does. #2026_09_26_03_group_1 revised by #2026_10_04_09_group_1
- [ ] COUNTER-EXAMPLE: Bold-parentheses stuffing. Sentences end in trailing tags such as `(**single common parent**)`. Notes: Bold the term where it occurs and let the side note define it. #2026_09_26_06_group_1 revised by #2026_10_04_10_group_1
- [ ] COUNTER-EXAMPLE: The authoritarian command. *"You must recognize that updating a parent component re-evaluates all child descendants on that branch."* Notes: State what happens and what we write; never order the reader to recognize something. #2026_09_26_03_group_1 revised by #2026_10_04_11_group_1
