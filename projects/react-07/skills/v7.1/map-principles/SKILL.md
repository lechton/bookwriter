---
name: map-principles
description: Build or audit React 06 principle maps in 01-01-map-principles/{nn}.md. Use when a question-bank row and its syllabus card must become the numbered principles a lesson teaches, when a decision must be routed to the lesson that owns it, or when a map's coverage, ownership, importance, terms, proofs, or wording is questioned.
---

# Map Principles

A principle map turns one bank row and its syllabus card into the contract for one lesson. It says which principles the lesson teaches, in what order, and how each one is proven. It also says what the lesson only supports, recalls, previews, or leaves out. #2026_09_26_21_group_1 revised by #2026_10_06_01_group_7

Every principle starts from a question a beginner actually has at this point of the course, and answers it in the order things happen. The docs check the facts and supply the mistakes readers really make; a doc heading is not a principle. #2026_10_06_09_group_1

The work runs in two passes. Discovery searches wide and looks at no principle map. Selection decides: it routes each idea to the lesson that owns it, keeps the important ones, and numbers them last. An Archive Check then compares the result with any older map of the same topic. #2026_09_26_21_group_1 revised by #2026_10_06_01_group_7 and #2026_10_06_01_group_8

The map feeds three readers: the pre-lecture author, the lecture author, and `node src/diagnose-map.mjs`. Write it so all three can use it without guessing. #2026_10_06_01_group_5

What one lesson needs another lesson to do travels as a message in `handouts/`, not in the map's prose (Section 11B). #2026_10_06_02_group_4

## Sources and Authority | 01 | Which File Decides What #2026_09_26_19_group_1 revised by #2026_10_05_07_group_1 and #2026_10_06_01_group_7

- [ ] Is row {nn} of `questions/questions.md`, the live bank, the authority for the lesson's number, topic tag, tier, and question? The files in `questions/archive/` and `questions/drafts/` are history and proposals. #2026_09_26_19_group_1 revised by #2026_10_05_07_group_1
- [ ] Is `01-01-map/{nn}.md`, the syllabus card, the authority for the lesson's code experiment and scope boundary? #2026_09_26_19_group_1
- [ ] Before Discovery, do the bank row and the card carry the same number, tag, and question? When they differ, does the work stop with a report of both values? #2026_10_05_07_group_1
- [ ] Is the whole set of cards in `01-01-map/` the authority for ownership? An idea belongs to the lesson whose card makes it a main subject, not to the first lesson that mentions it. #2026_09_26_21_group_1
- [ ] Is the local react.dev corpus the authority for React facts? Resolve it with `node tools/resolve.mjs corpus`; the pages live under `React 19 Sept 2026/react.dev/src/content/`. When a card or general knowledge disagrees with it, the corpus wins and the disagreement goes to Reported Conflicts. #2026_09_26_21_group_1 revised by #2026_10_06_01_group_3
- [ ] Once approved, is the map the authority for the lesson's principles, their order, their proofs, and every ledger disposition? This holds while its header matches bank row {nn}. A header that differs means the map was written for another bank version, so rebuild it before a pre-lecture or lecture uses it. #2026_09_26_19_group_1 revised by #2026_10_05_07_group_1
- [ ] When a lecture, a pre-lecture, or another map conflicts with the cards or the approved map, is the conflict reported instead of used to grow or shrink the principle set? #2026_09_26_19_group_1

- [ ] PROPER EXAMPLE: Before writing map 15, the author reads bank row 15 (`#render_and_commit`) and card 15, finds the same tag and question in both, and starts Discovery. Later, asked to produce Lecture 15 from an older map, the author sees `#callback_props` in its header, stops, and reports: "row 15 is `#render_and_commit`, map 15 is `#callback_props`, so map 15 needs a rebuild." #2026_10_05_07_group_1

- [ ] COUNTER-EXAMPLE: Lecture 14 was produced while row 14 was `#use_state` and map 14 was still an events map from bank Version 1. The agent opened map 16 instead, because it was about useState, and reported nothing. The stale maps stayed in place until a later audit. #2026_10_05_07_group_1

Notes: A new bank version can move a topic to a new number. Comparing the tag and the question, not the file number, catches a file left behind. #2026_10_05_07_group_1

## Discovery | 02 | Search Wide Without Looking at Any Map #2026_09_26_21_group_1 revised by #2026_10_06_01_group_7

- [ ] Is Discovery finished before any principle map is opened, including the archived ones in `01-01-map-principles/v_old_*/`? A fresh agent or session is best. An existing title, order, or total would otherwise shape the search. #2026_09_26_21_group_1 revised by #2026_10_06_01_group_8
- [ ] Does Discovery begin with the reader, before any doc is open? Write down the questions a beginner has at this point: what the card's code experiment makes them wonder, what the earlier lessons left open, and what they will try first out of habit from plain JavaScript, HTML, or another framework. Each question goes into the ledger in the reader's words. #2026_10_06_09_group_1
- [ ] Does Discovery then read the card and every react.dev Learn and Reference page that teaches its topic, to answer and check those questions? Find the pages by searching the corpus for the card's API names and mechanism words, and list them in `Sources Read`. #2026_10_06_09_group_1
- [ ] On each page, are the `<Recap>`, `<Pitfall>`, `<DeepDive>`, `<Note>`, and `<Challenges>` blocks read, and the `#### Caveats` and `## Troubleshooting` sections of Reference pages?
- [ ] Are the Rules of React pages in `reference/rules/` read when the topic touches rendering, purity, or Hooks? Is the React 19 upgrade guide (`blog/2024/04/25/react-19-upgrade-guide.md`) read when the topic touches an API that React 19 removed or changed?
- [ ] Does Discovery add ideas from senior engineering knowledge, marked `general`? Think of what reviewers flag, what interviewers probe, what juniors ship broken, what behaves differently on a laptop and in CI, etc.
- [ ] Does every `general` idea state a concrete code case with a visible result, and agree with react.dev?
- [ ] Is every claim on the card checked against react.dev? A removed or changed API is a conflict, not a fact to carry forward.
- [ ] Is each idea recorded as one plain decision or mental model, with its source, even when it probably belongs to another lesson?
- [ ] Are ideas left unnumbered, ungrouped, and uncounted? Merging, ownership, and numbering happen in Selection.

- [ ] PROPER EXAMPLE: For a conditional-rendering card, Discovery records the branch forms on the card, every `<Recap>` bullet of `learn/conditional-rendering.md`, and its `<Pitfall>` "Don't put numbers on the left side of `&&`". It adds `general` ideas such as "a nested ternary chain hides which output belongs to which condition", each with its source.

- [ ] HALF WAY EXAMPLE: Discovery reads the react.dev prose but skips the `<Pitfall>` blocks. The most common production bug on the page never enters the ledger, and no later step can recover it.

- [ ] COUNTER-EXAMPLE: Discovery opens the earlier principle maps first, copies their headings, and searches the card for enough material to fill a similar list.

- [ ] COUNTER-EXAMPLE: The first map 15 took its principles from the steps of `learn/render-and-commit.md`: "rendering is React calling our components", "the commit changes only what differs". Those are the page's headings, not anything a beginner asks. The lecture's boxes turned into chains of definitions, and the owner read them as "this is this, that is that". #2026_10_06_09_group_1

Notes: Discovery is wide on purpose, and Selection narrows it. A rejected idea stays visible in the ledger. An idea never found is an invisible gap.

## Selection | 03 | Ownership Through the Syllabus #2026_09_26_21_group_1 revised by #2026_10_05_09_group_1, #2026_10_06_01_group_7, and #2026_10_11_06_group_2

- [ ] Is each idea routed to the lesson whose card makes it a main subject? A main subject appears in the card's Topic Tag, Core Truth, Mechanism, or Code Experiment.
- [ ] Is every card in `01-01-map/` searched for each route, not only the neighbouring cards? Read the Topic Tag, Core Truth, Mechanism, and Scope Boundary lines.
- [ ] Are those key lines read in one pass with `rg -N --sort path '^\* \*\*(Topic Tag|Core Truth|The Mechanism|Scope Boundary)\*\*' 01-01-map/[0-9]*.md`, run in the project folder? It prints four lines per card in bank order, so a route to a distant lesson is as easy to find as one to a neighbour. #2026_10_06_02_group_2
- [ ] When no card makes an idea a main subject, is it owned by the earliest lesson whose Code Experiment needs it? Does the ledger note that the syllabus leaves it unassigned?
- [ ] Is an idea owned by an earlier lesson recorded as `Prerequisite`, so the lesson recalls it instead of numbering it again?
- [ ] When an earlier lesson owns a decision but this lesson's API is the first to make breaking it visible or worse, is the new failure kept here? Record the decision as `Prerequisite`, and the new failure as a candidate of its own that faces the importance test: `Principle` when it passes, `Supporting` otherwise. #2026_10_06_03_group_2
- [ ] Is an idea owned by a later lesson recorded as `Preview` when this lesson's code touches it, and as `Deferred` when the lesson can leave it out?
- [ ] When the bank question names an idea an earlier lesson owns, is it answered as an application inside one of this lesson's principles instead of a principle of its own? The bank question says what the lecture covers, not how many questions it asks. Bank row 7 asks how "default values work"; Lecture 6 owns defaults, so Lecture 7 shows `className = ''` inside the answer about joining classes. #2026_10_11_06_group_2
- [ ] Does every owner name its lesson by number and topic tag from the live bank, as in `Q17 #state_updates`? A later bank version that moves the topic then leaves a visible mismatch. #2026_10_05_09_group_1
- [ ] When the cards route an idea to this lesson but another map already numbers it, is the conflict listed in Reported Conflicts? #2026_10_06_01_group_3

- [ ] PROPER EXAMPLE: react.dev puts the numeric-zero `&&` Pitfall on its conditional-rendering page. The lesson whose card makes conditional rendering its main subject owns it as a principle. An earlier lesson that teaches which values JSX prints records it as `Preview` with that owner, and states only that numbers print as text.

- [ ] HALF WAY EXAMPLE: The author routes by main subject but lets the earlier lesson keep its full principle "because it was taught first". The owner lesson repeats it, and the two lectures disagree on where the decision lives.

- [ ] COUNTER-EXAMPLE: Maps 01 to 13 once named owners by number alone ("state (Q16)"). Bank Version 2 moved state to Q14, nothing in the maps showed it, and every preview pointed at the wrong lesson until an audit. #2026_10_05_09_group_1

- [ ] PROPER EXAMPLE: Q13 owns passing a handler instead of calling it. In Q13 a called handler only runs too early. With a setter, the same mistake throws "Too many re-renders", and setters first exist in Q14. Map 14 recalls the Q13 decision and keeps the crash as a candidate of its own. #2026_10_06_03_group_2

- [ ] COUNTER-EXAMPLE: The first v6.5 map 14 filed the crash only as a Q13 `Prerequisite`. Lecture 14 dropped it, and the most common useState crash appeared in no lesson of the series. #2026_10_06_03_group_2

Notes: First mention is not ownership. A passing mention earns a preview; the main subject earns the principle.

## Selection | 04 | Importance, Kind, and Atomicity #2026_09_26_21_group_1 revised by #2026_10_06_01_group_7 and #2026_10_11_06_group_1

- [ ] Does each owned idea pass at least one importance question? Would a senior reviewer flag its absence? Would an interviewer expect it in a complete answer? Would a developer without it ship a visible bug, or carry a model that breaks a later lesson?
- [ ] Is an owned idea that fails every importance question recorded as `Supporting` when the theory needs it, or `Dropped` when it is trivia?
- [ ] Are setup facts, API names, definitions, and restatements of the question kept as `Supporting`? They become principles only when a beginner would ask about them or get them wrong. #2026_10_06_09_group_1
- [ ] Is a principle marked `Decision` when it tells a developer what to check, choose, keep, or avoid in code? Is it marked `Model` when it is a mental model that later decisions rest on?
- [ ] Does every `Model` principle carry a `Prediction`: a behavior the reader can predict with the model and check in the console, DevTools, or on screen?
- [ ] Are two ideas split only when the reader meets them in different situations and would ask two different questions? #2026_10_11_06_group_1
- [ ] Are two ideas merged, with a `Merged` row, when they share the same decision, cause, failure, and fix? A mistake and its remedy are one idea. A problem that appears inside the fix is part of the same idea too: the answer shows the first fix, what it still gets wrong, and the final code. #2026_10_11_06_group_1
- [ ] Are the principles ordered so each one can be explained with the prerequisites and the principles before it? Are they numbered only after every idea has a disposition?

- [ ] PROPER EXAMPLE: `learn/your-first-component.md` carries a `<Pitfall>` against defining a component inside another component. Reviewers flag it and it causes real bugs, so it becomes a principle in the lesson that owns component definition. The ledger notes that the card never names it.

- [ ] PROPER EXAMPLE: "React calls your components; your code only describes the UI" becomes a `Model` principle. Its Prediction: "a component that is never used in JSX never runs, so a `console.log` in its body stays silent".

- [ ] HALF WAY EXAMPLE: The author runs the importance test but counts "the card mentions it" as a pass. A setup detail that no reviewer would flag becomes a principle beside real decisions.

- [ ] COUNTER-EXAMPLE: The author merges every idea that shares a keyword and drops everything the card does not name. An official Pitfall disappears, and the list shrinks to whatever felt tidy.

- [ ] COUNTER-EXAMPLE: Map 07 split `spread-order-wins` and `default-fills-slot`. Question 4 ended on the fix `className={'card ' + className}`, which the author knew prints `class="card undefined"` when the caller passes no class, so that Question 5 could fix it with `className = ''`. The reader never asks a second question here: it is one answer that ends one step later. #2026_10_11_06_group_1

Notes: Importance decides membership, atomicity decides boundaries, and ownership decides the lesson. The number of principles is whatever survives these tests. It has no target or typical value, and other lessons' totals are not evidence.

## Selection | 05 | The Reader's Question, What They Expect, and What React Does #2026_10_06_09_group_1 (replaces Tempting Belief and Defect, #2026_10_06_01_group_1) revised by #2026_10_11_06_group_1

- [ ] Does every principle start from a `Reader Question`: what a beginner at this point of the course would actually ask, in their own words? "I call `setCount(1)`. How does the 1 get onto the screen?" is a reader's question. "What is the render phase?" is a doc heading. #2026_10_06_09_group_1
- [ ] Does `Reader Expects` give the beginner's own answer and the habit it comes from: plain JavaScript, HTML, another framework, an earlier lesson, etc.? The guess may be right. When it is right, the principle explains how it comes true, and nothing is invented to make it fail. #2026_10_06_09_group_1
- [ ] Does `React Does` say what really happens, in the order it happens, ending in something the reader can see: the screen, the console, DevTools, or the build output? #2026_10_06_09_group_1
- [ ] Is `Real Mistake` filled only with code readers really write at this point, and with what the screen, console, or build then shows, reproduced in React 19? When readers make no such mistake, does it say `none`? Code written only so that it fails is not a real mistake. #2026_10_06_09_group_1
- [ ] Does the box follow from `Real Mistake`? When it is filled, the lecture shows the mistake as the box's second card. When it is `none`, the box shows one card: the code that does the job. #2026_10_06_09_group_1
- [ ] When a `Model` principle has a filled `Real Mistake`, does it name `Fix In`? It is normally `this principle`: the cycle shows the mistake and the fix, in as many steps as the fix really takes (map 15, `setter-to-screen`: the handler calls the setter instead of writing to the page). It names a later `Decision` principle only when that principle answers a new question the reader asks in a new situation (map 17 below). #2026_10_11_06_group_1 The lecture teaches each principle as one question cycle (question, answer, prescriptive box). The model's cycle shows the mistake, explains it, and shows the fix, so its box can end with the fix as the right card and the mistake as the wrong one. Without `Fix In`, the model's box either asks for code the reader has not seen yet or swallows the next principle. #2026_10_10_01_group_1
- [ ] Does the `Decision` principle named by a `Fix In` add a case the model's cycle does not show: its own `Real Mistake`, its boundary (`Condition`), or both? When it adds nothing, the two are one idea, so merge them under the importance and atomicity rules of Section 04. #2026_10_10_01_group_1

- [ ] PROPER EXAMPLE: Map 17. `queue-in-order` is a Model whose Real Mistake is three `setPasses(passes + 1)` calls; it carries `Fix In: updater-from-previous`. Lecture cycle 2 shows the three calls, explains the queue, and shows `p => p + 1` as the fix, after the runway has taught the updater form. `updater-from-previous` then adds what cycle 2 did not show: the request counter that ends at `-1` after an `await`, and the boundary that a plain value is fine for one update per click. #2026_10_10_01_group_1

- [ ] HALF WAY EXAMPLE: The 17-e lecture, written without `Fix In`. It merged the queue model and the updater fix into one box, which made the box readable. But the boundary of the Decision ("a plain value is fine for one update per click", Review Point `Condition`) fell out, and the summary told the reader to always pass an updater. #2026_10_10_01_group_1

- [ ] COUNTER-EXAMPLE: The first Lecture 17 draft. Question 2 showed the failure (`tickets + 1` three times), and the fix (`t => t + 1`) waited for Question 3. Principle 2's right card asked the reader to use syntax they had never seen. #2026_10_10_01_group_1

- [ ] PROPER EXAMPLE: Map 15, Principle 1, written from the reader. Reader Question: "I call `setCount(1)`. How does the 1 get onto the screen?" Reader Expects: the setter writes 1 onto the page, as `element.textContent = 1` does in plain JavaScript. React Does: stores 1; calls the component again; the component returns `<p>1</p>`; React compares it with the page and changes the 0 to 1. Real Mistake: the plain JavaScript habit of changing the page by hand, `document.querySelector('p').textContent = count + 1` in the handler with no setter. Every click shows 1, never 2, because `count` stays 0 (React 19.3.0). #2026_10_06_09_group_1

- [ ] PROPER EXAMPLE: A principle about double curlies. Reader Expects: `{{ }}` is special JSX syntax, a habit from Handlebars, Mustache, and Vue, which print values with double braces. Real Mistake: `style="color: pink"`, written as a string, throws an error that says `style` expects a mapping from properties to values. #2026_10_06_01_group_1 revised by #2026_10_06_09_group_1

- [ ] HALF WAY EXAMPLE: The author fills `Reader Question` with "What happens in the commit phase?". The field is there, but it holds a heading. The box that follows defines a word instead of answering a beginner. #2026_10_06_09_group_1

- [ ] COUNTER-EXAMPLE: The first map 15, Principle 1. The old rules asked every principle for a wrong belief and a visible defect. The reader's real guess, that a setter updates the screen, comes true. So the map invented code nobody writes: a component that reads its own number from the page while it runs and finds the old one. The lecture box built on it passed every script. The owner rejected four rewrites of it as absurd, because none answered a question a reader has. #2026_10_06_09_group_1

Notes: The pre-lecture and the lecture respect the reader's reasoning before they correct it, and say so when the reasoning is right. They can only do that when the map names it. #2026_10_06_01_group_1 revised by #2026_10_06_09_group_1

Notes: The map gives facts, not the box. It holds no roles and no code: the lecture author writes the box and its cards from these facts and the proofs, under `principle-definition` and its casebook (each card must stand alone, with its declaration as well as the change). #2026_10_06_04_group_4 revised by #2026_10_06_09_group_1

## Selection | 05B | The Theme and Its Options #2026_10_12_01_group_2

The lecture opens with a general question every developer meets, shows the real ways to answer it, and says which one the lesson teaches (`lecture-structure` Section 12). The map decides these, so the lecture author follows them instead of inventing options while writing. #2026_10_12_01_group_2

- [ ] Does `## Theme and Options` state the theme as one plain question a developer meets on a real page, of which this lesson's topic is one answer? #2026_10_12_01_group_2
- [ ] Does it list each real option: its name, the shortest code that shows it, the lesson that teaches it (`Q{NN} #tag`, this lesson, or a later one), and the situation where it fits? A real option is one an earlier lesson taught or one React offers. A later lesson's option is listed with its owner, and the lecture names it in one sentence. #2026_10_12_01_group_2
- [ ] Is the option this lesson teaches marked, and do its principles show it at work: its forms and the mistakes readers really make with it? #2026_10_12_01_group_2
- [ ] When React offers no rival way, are the options the habit without React and what React does instead? Is no option invented to make the list longer? #2026_10_12_01_group_2

- [ ] PROPER EXAMPLE: Map 07. Theme: how does one card component show different content each time? Option 1, a prop (`<ContentCard name="Paul" />`, Q06 `#props`): fits when the card decides the content's shape, such as a price tag with a name and a price. Option 2, `children` (`<ContentCard><p>My name is Paul</p></ContentCard>`, this lesson): fits when the caller decides the content. Both together: a `title` prop with the body as children. #2026_10_12_01_group_2

- [ ] COUNTER-EXAMPLE: A third option, "copy the card's markup for every story", added so the list has three. Nobody who knows components (Q02) writes it, and the lecture would spend a paragraph on a choice no reader faces. #2026_10_12_01_group_2

Notes: The theme is not a principle. It frames the lesson; the principles answer the questions the chosen option raises. `node src/diagnose-map.mjs` does not check this section, so the Sense Test reads it (Section 13). #2026_10_12_01_group_2

## Selection | 06 | Proofs and Verified Behavior #2026_09_26_21_group_1 revised by #2026_09_27_11_group_1 and #2026_10_06_01_group_4

- [ ] Can each Required Lesson Proof be produced inside the Authorized Scope? When it needs a later concept, such as a re-render in a static-data lesson, redesign the proof or reroute the idea.
- [ ] Do the proofs use the components and variables of the card's Code Experiment? The lesson then builds one example instead of several. Each proof adds to or changes that example; no two proofs print the same code. When a proof needs another component, does it say why, and use an everyday name that passes the naming rules of `lecture-voice`? #2026_10_06_01_group_4 revised by #2026_10_06_03_group_4
- [ ] Is every behavior the map states reproduced in React 19 before the map relies on it? A small Node sandbox with `react`, `react-dom`, `jsdom`, `esbuild`, and `@babel/parser` is enough. Sources Read records the versions used. #2026_10_06_01_group_4
- [ ] Is a quoted compiler, console, or error message either found in the corpus or reproduced in the sandbox? Any other result is described by its behavior. A claim that is not yet verified goes to Open Issues. #2026_09_27_11_group_1 revised by #2026_10_06_01_group_3

- [ ] PROPER EXAMPLE: A useState map proves its model principles on the card's `StoryCard`. The render log and the two side-by-side counts run in one component, so the lesson builds it once. #2026_10_06_01_group_4

- [ ] COUNTER-EXAMPLE: The archived map 14 proves Principle 1 on `ArticleCard`, Principles 2 and 3 on `StoryCard`, and Principle 4 on a todo list from react.dev. The lesson builds three components for four principles. #2026_10_06_01_group_4

- [ ] COUNTER-EXAMPLE: The archived map 10 quotes a `NaN` warning text that is in no corpus page and was not reproduced. The doubt lived only in a handoff note, where a lecture author never looks. #2026_10_06_01_group_3

## Terms | 07 | First Appearances Across the Series #2026_10_06_01_group_2

- [ ] Does `## Terms` list each technical word and JavaScript form that the principles and proofs use? Examples: a React API, a browser API, the ternary, destructuring, a template literal, an arrow function, etc. #2026_10_06_01_group_2
- [ ] Is each term marked `New` or `Recall`? `New` means no earlier lesson in bank order uses it. `Recall` names the earliest lesson that does. Decide by searching the earlier cards and maps. A wrong mark makes two lectures explain the same term, or neither. #2026_10_06_01_group_2
- [ ] Does each `New` JavaScript form carry `yes` under refresher, so the lecture explains it in a sentence or two? #2026_10_06_01_group_2
- [ ] Does each `New` React or browser term name the principle that first needs it? #2026_10_06_01_group_2
- [ ] Do the Terms rows also hold the ideas and code forms a box will use, not only API names: `object reference`, `arrow function returning an object (p => ({ ... }))`, `updater function`, etc.? The pre-lecture builds the lecture's Runway from these rows, so an idea missing here reaches a box unexplained. Map 18 lists `object reference` as `New`, and Lecture 18 could teach memory addresses before its first question because of it. #2026_10_10_01_group_2
- [ ] Does a term that an earlier map already lists keep that map's name, character for character? Copy the name from the earliest map that lists it. `node src/diagnose-map.mjs` matches terms across maps by exact name, so a reworded name hides the earlier row and leaves two first appearances. #2026_10_06_02_group_1

- [ ] PROPER EXAMPLE: Map 04 marks the ternary `New` with refresher `yes`. Its third principle writes `readTime > 10 ? 'Long read' : 'Quick read'`, six lessons before Q10 teaches branching. Lecture 04 explains the operator in one sentence. Lecture 10 recalls it from Q04. #2026_10_06_01_group_2

- [ ] COUNTER-EXAMPLE: The archived map 14 lists array destructuring as `Supporting`, and no archived map records where object destructuring first appears. The Lecture 14 author must read thirteen lectures to learn whether the reader has met it. #2026_10_06_01_group_2

- [ ] COUNTER-EXAMPLE: Map 04 lists "local variable (`const`, `let`)". The first draft of map 14 recalled the same idea as "local variable (`let`, `const`)". A search for map 04's name missed the row, and the cross-map check could not see that both rows meant one term. #2026_10_06_02_group_1

Notes: Only the maps see the whole syllabus at once. Settling first appearances here saves every lecture author from rediscovering them. #2026_10_06_01_group_2

## Review Language | 08 | Do, Prefer, Avoid, Do Not, and Condition #2026_09_26_19_group_1 revised by #2026_09_26_21_group_1

- [ ] Does each `Decision` principle's review point use the weakest label the evidence supports? `Do` is a required action. `Prefer` is a sound default. `Avoid` is a risk in some contexts. `Do not` is an action that is invalid or reliably harmful. `Condition` means the right choice depends on circumstances.
- [ ] Is `Do not` kept for a real scoped failure: a compiler error, a runtime error, corrupted data, a broken contract, or a reliably harmful result?
- [ ] When two choices are both valid, is the label `Condition`, with the deciding condition named in Placement, instead of an invented ban? #2026_10_06_04_group_4
- [ ] Does negative guidance add something the positive rule does not already say?

- [ ] PROPER EXAMPLE: An unclosed JSX tag earns `Do not`, because the parser rejects it. `&&` against a ternary earns `Condition`, because both are valid for different branch shapes.

- [ ] COUNTER-EXAMPLE: "Do not use a ternary that returns null" turns one valid style into a false ban, only to complete a pair.

## Writing the Map | 09 | Clear Prose and Clean Data #2026_10_06_01_group_6

- [ ] Are the Authorized Scope and the Senior Answer written to `lecture-voice` Sections 05 and 06? That means common words, one idea per sentence, and short sentences. Authors copy the shape of what they read, so a dense map tends to produce a dense lecture. #2026_10_06_01_group_6
- [ ] Does the Authorized Scope say what the lesson teaches and what it builds on? The list of what later lessons own already lives in the ledger's Preview and Deferred rows, so the scope leaves it out. #2026_10_06_01_group_6
- [ ] Could a candidate say the Senior Answer aloud in an interview? The interviewer hears it once, so each sentence carries one point. #2026_10_06_01_group_6
- [ ] Is `Reader Question` written as the reader would say it? Are Reader Expects, React Does, Placement, and Real Mistake written as short data fragments rather than finished sentences? The lecture author writes the box from them; a ready sentence here tends to be pasted with synonyms swapped. #2026_10_04_09_group_1 revised by #2026_10_06_01_group_1, #2026_10_06_04_group_4, and #2026_10_06_09_group_1
- [ ] Are ledger rows grouped by disposition, in this order: Principle, Merged, Supporting, Prerequisite, Preview, Deferred, Dropped?
- [ ] Is each paragraph, bullet, and table row one continuous line, with no em-dashes anywhere in the file? #2026_10_06_01_group_5

- [ ] PROPER EXAMPLE: A curly-braces scope written to the standard: "Lesson 04 teaches curly braces in JSX, inside one component that uses only local variables. Curly braces open a window to JavaScript in two places: between tags, and right after an attribute's `=`. Everything outside them is literal text. The code inside runs while React renders the component. Its result takes the place of the braces." #2026_10_06_01_group_6

- [ ] COUNTER-EXAMPLE: The archived map 04's scope is 230 words in two sentences. The first sentence chains seven claims with colons and semicolons. The second lists nine later lessons, which the ledger already records. #2026_10_06_01_group_6

- [ ] PROPER EXAMPLE: The archived map 14's Senior Answer opens: "A local variable lives only for one call of the component function. React may call that function many times, and each time the variable starts over." Each sentence makes one point a listener can follow. #2026_10_06_01_group_6

## Principle Handles | 10 | Short Names That Survive Renumbering #2026_10_06_01_group_9

- [ ] Does every principle carry a `Handle`: two to four lowercase words joined by hyphens, such as `braces-window`? #2026_10_06_01_group_9
- [ ] Does the ledger use the handle as the owner of the principle's own `Principle` row and of every `Merged` row folded into it? #2026_10_06_01_group_9
- [ ] Do other maps and briefs cite a principle as `Q04 braces-window` rather than by its number alone? Numbers change when principles are reordered; handles do not. #2026_10_06_01_group_9

- [ ] PROPER EXAMPLE: A `Merged` row for "`// note` in content shows on screen" has the owner `braces-window`. The row stays correct when that principle moves from first to second place. #2026_10_06_01_group_9

- [ ] COUNTER-EXAMPLE: The archived map 04 repeats the full 35-word text of its first principle as the owner of three `Merged` rows. Maps 06, 10, and 13 cited "Q04 Principle 3", and each citation broke when map 04 was renumbered. #2026_10_06_01_group_9

## Archive Check | 11 | Compare With the Older Map After Selection #2026_10_06_01_group_8

- [ ] After Selection, are the archived maps of the same topic opened? Find them by searching `01-01-map-principles/v_old_*/` for the topic tag, not the file number. #2026_10_06_01_group_8
- [ ] Does every idea in an archived map that the new ledger lacks get a ledger row with a disposition and a reason? #2026_10_06_01_group_8
- [ ] Is a behavior from an archived map reproduced again before the new map states it? The archive is a list of leads, not of verified facts. #2026_10_06_01_group_8
- [ ] Does `Sources Read` name each archived map compared and how many ledger rows it added? #2026_10_06_01_group_8

- [ ] PROPER EXAMPLE: The new map 04 is selected without opening any old map. The Archive Check then finds `disabled="false"` in `v_old_06/04.md`. The author reproduces it in the sandbox, adds it as a `Merged` row, and records "Archive check: v_old_06/04.md, 1 row added". #2026_10_06_01_group_8

- [ ] COUNTER-EXAMPLE: The author opens the archived map before Discovery, "to save time". The new map comes out with the same headings, the same order, and the same blind spots. #2026_10_06_01_group_8

Notes: The archive holds evidence that took real work to collect. Reading it after Selection keeps that evidence without letting it shape the search. #2026_10_06_01_group_8

## Handouts | 11B | Messages Between Lessons #2026_10_06_02_group_4

- [ ] Before Selection, is the lesson's inbox read with `node src/handout.mjs {nn}`? It shows the messages sent to this lesson, the ledger rows of other maps that name it as owner, and the later maps that recall its terms. #2026_10_06_02_group_4
- [ ] Is every open message with stage `map` closed before the map is handed on? Close it with `node src/handout.mjs close {id} --status done --resolution "..."` and say where it landed, or with `declined` and the reason. `node src/diagnose-map.mjs {nn}` fails while one stays open. #2026_10_06_02_group_4
- [ ] Is a message sent only for what the ledger cannot carry? The kinds are `promise` (this lesson says another will show something), `reuse` (a name, example, or log another lesson should build on), `caution` (a trap the other author would not see from its own card), `correction` (an error found in another lesson), and `move` (ownership should change). An ordinary `Preview` or `Deferred` row needs no message. #2026_10_06_02_group_4
- [ ] Is a message to an earlier lesson treated as a request? The earlier map or lecture changes only through its normal revision, and the message lists in `--affects` the later lessons that recall the changed part. #2026_10_06_02_group_4
- [ ] Is a `move` sent with stage `map`, and does the receiving author change the cards before the maps? Ownership comes from the cards (Section 03), so a map that takes an idea the cards still route elsewhere is a conflict. #2026_10_06_02_group_4
- [ ] Is every message written with `node src/handout.mjs add`, never by hand? The command fills the topic tags from the live bank, numbers the message, and rejects a broken one. `handouts/README.md` lists the fields. #2026_10_06_02_group_4
- [ ] Does `Sources Read` record the inbox: the messages closed and the messages sent, by id? #2026_10_06_02_group_4

- [ ] PROPER EXAMPLE: Map 14 proves call order on `StoryCard` with two `useState` calls and a render log. Q37 `#rules_of_hooks` will break that order, and its card cannot know the example exists. Map 14 sends `14-37-01`, kind `reuse`, stage `map`, with Q38 under `affects`. The map 37 author finds it in the inbox, breaks the order on the same `StoryCard`, and closes the message with the handle of the principle whose proof uses it. #2026_10_06_02_group_4

- [ ] COUNTER-EXAMPLE: Lecture 05 says rendering runs before the DOM commit "(see Lecture 12 and Lecture 17)". The promise lives only in that lecture's prose, by number. Bank Version 3 moved render and commit to Q15, and Q17 is now `#state_updates`. No file told the Lecture 15 author that Lecture 05 counts on it, and nothing flagged the broken pointer. #2026_10_06_02_group_4

Notes: The ledger records what this lesson decides about an idea. A handout records what another lesson must do about it. Keeping the two apart lets each author read one inbox instead of every other file. #2026_10_06_02_group_4

## Output Contract | 12 | The Map File #2026_09_26_19_group_1 revised by #2026_10_05_09_group_1 and #2026_10_06_01_group_7

- [ ] Does every map use this template, in this order?

```markdown
# Q{NN} Principle Map: {Lesson title}
- **Source Map**: `01-01-map/{NN}.md`
- **Bank Row**: `questions/questions.md` row {NN}, Version {V}
- **Topic Tag**: `{tag}` | `{tier}`
- **Interview Question**: *{verbatim question}*
- **Map Revision**: {tag of the brief that last built or corrected this map}

## Authorized Scope
{What the lesson teaches and what it builds on, in short plain sentences drawn from the card.}

## Theme and Options
- **Theme**: {the general question a developer meets on a real page, in plain words}
- **Option**: {name}: `{shortest code}` | {Q{NN} #tag, or this lesson} | {when it fits} (one line per real option)
- **This lesson teaches**: {the option name}

## Sources Read
- `learn/{page}.md`: {blocks read}
- `reference/{path}.md`: {sections read}
- Runtime check: {versions and setup used to reproduce behaviors}
- Syllabus cards used for ownership: {Q numbers}
- General engineering knowledge: {review, interview, and failure angles considered}
- Archive check: {archived maps compared, and how many rows each added}
- Handout: {messages read and closed from `handouts/{NN}.json`, and messages sent, by id}

## Candidate Ledger
| candidate | source | disposition | owner | reason |
|---|---|---|---|---|
| {a reader's question, or one plain decision, model, or observed behavior} | {reader, card field, react.dev block, or general} | {Principle, Merged, Supporting, Prerequisite, Preview, Deferred, or Dropped} | {see the owner rule below} | {one line} |

## Terms
| term | kind | status | first lesson | refresher | first needed in |
|---|---|---|---|---|---|
| {`useState`, ternary, `e.target`} | {React, browser, JavaScript, or general} | {New or Recall} | {Q{NN} `#tag`} | {yes or no} | {a principle handle, or Supporting} |

## Principles

### Principle {N}: {Active title}
- **Handle**: `{two-to-four-words}`
- **Kind**: {Decision or Model}
- **Reader Question**: {what a beginner at this point actually asks, in their words}
- **Reader Expects**: {their own answer, right or wrong, and the habit it comes from}
- **React Does**: {what really happens, in order, ending in what the reader can see, verified in React 19}
- **Placement**: {where the right code goes, and where it does not}
- **Real Mistake**: {code readers really write here and what it shows, verified in React 19; or `none`}
- **Fix In**: {Model with a filled Real Mistake only: normally `this principle`; the handle of a later Decision principle only when it answers a new question in a new situation}
- **Importance**: {the review finding, interview expectation, shipped bug, or broken later lesson it prevents}
- **Review Point**: {Decision only: Do, Prefer, Avoid, Do not, or Condition}
- **Prediction**: {Model only: the behavior the reader can predict and check}
- **Required Lesson Proof**: {code and visible evidence, on the card's example, inside the scope}

## Senior Answer
{A spoken answer to the interview question, in short sentences, using only this map's principles and prerequisites.}

## Reported Conflicts
- {One line per disagreement with a card, the corpus, or another map: what disagreed, where, and where it was fixed or reported. `None` when empty.}

## Open Issues
- {One line per unverified claim or uncorrected error: what it is, where it sits, and what would close it. `None` when empty.}

## Completion Gate
- [ ] Every principle passed the Sense Test (Section 13) before the scripts ran.
- [ ] The header's tag, tier, and question equal bank row {NN} and card {NN}.
- [ ] `node src/diagnose-map.mjs {NN}` reports no failure.
- [ ] Every Recap, Pitfall, Caveat, and Troubleshooting item on the pages in Sources Read has a ledger row.
- [ ] Every principle is owned through the cards and records the importance question it passed.
- [ ] Every behavior the map states was reproduced in React 19 or found in the corpus.
- [ ] Every Required Lesson Proof runs on the card's example inside the scope, or says why it cannot.
- [ ] Every Terms row was marked after a search of the earlier cards and maps.
- [ ] The Archive Check is done, and every idea it found has a ledger row.
- [ ] Every `map` message in the inbox is closed, and every message another lesson needs from this map was sent.
- [ ] Reported Conflicts and Open Issues are complete.
- [ ] A candidate could say the Senior Answer aloud, and it would satisfy a senior interviewer.
```

- [ ] Does the owner column follow one rule per disposition? `Principle` and `Merged` rows name a principle handle. `Supporting` rows name this lesson (`Q{NN} #tag`). `Prerequisite` rows name an earlier lesson, and `Preview` and `Deferred` rows a later one, each as `Q{NN} #tag`. `Dropped` rows hold `none`. #2026_10_06_01_group_9
- [ ] Does a `Decision` principle carry a Review Point and no Prediction, and a `Model` principle a Prediction and no Review Point? #2026_10_06_03_group_1 revised by #2026_10_06_04_group_4
- [ ] Does a `Do not` Review Point come with a filled `Real Mistake`? A ban needs the code it bans. #2026_10_06_09_group_1
- [ ] Does every `Model` principle with a filled `Real Mistake` carry `Fix In`, naming a later `Decision` handle of this map or `this principle`, and does no other principle carry it? #2026_10_10_01_group_1
- [ ] Does the header keep the card's title, and do its tag, tier, and question equal bank row {NN} exactly, with the bank version named in `Bank Row`? #2026_10_05_07_group_1

Notes: Maps in the `v_old_*` folders use older formats; read them only during the Archive Check. #2026_10_06_01_group_8

## Sense Test | 13 | Before Any Script #2026_10_06_09_group_1

The scripts check form: fields, owners, terms, and links. A principle that makes no sense passes all of them. So the sense test comes first, and a principle that fails it goes back to Section 05 or leaves the list. #2026_10_06_09_group_1

- [ ] Read each principle's Reader Question, Reader Expects, React Does, and Real Mistake alone, with the docs closed. Would a beginner who has only the earlier lessons ask this question? Does React Does answer it, step by step, in the order things happen? #2026_10_06_09_group_1
- [ ] When Real Mistake is filled, would a reader really write that code, out of a habit they really have? #2026_10_06_09_group_1
- [ ] Taken in order, do the principles answer the interview question the way the Senior Answer does? #2026_10_06_09_group_1
- [ ] Read `## Theme and Options` alone. Would a developer recognise the theme from a real page? Is every option one the reader knows or React offers, and is each shown with a situation where it fits? #2026_10_12_01_group_2
- [ ] When a model's `Fix In` names a later principle, read the two as two questions a reader asks one after the other. Does the first end with a fix the reader can write, and does the second add a case the first did not show? #2026_10_10_01_group_1

- [ ] PROPER EXAMPLE: Map 15, Principle 1, as written in Section 05. A beginner does ask how the 1 gets onto the screen. React Does answers it in three steps. Changing the page by hand is what plain JavaScript taught them. #2026_10_06_09_group_1

- [ ] COUNTER-EXAMPLE: The first map 15 passed `diagnose-map`. Lecture 15 passed every invariant of `diagnose-lecture` and was reported as done. Its first box explained why a component that reads its own number from the page gets the old one. No beginner asks that, and the owner's first question was whether it made any sense. #2026_10_06_09_group_1

## Verification | 14 | Before the Map Is Handed On #2026_09_26_19_group_1 revised by #2026_10_05_09_group_1, #2026_10_06_01_group_5, and #2026_10_06_09_group_1

- [ ] Has every principle passed the Sense Test (Section 13)? #2026_10_06_09_group_1
- [ ] Does `node src/diagnose-map.mjs {nn}` report no failure? It checks the header against the bank, the sections and their order, the owner rule, the handles, the principle fields (including `Fix In`, #2026_10_10_01_group_1), the Terms rows, em-dashes, and hard wraps. It also compares the map with the other live maps: every map must date a term to the same first lesson, a `Recall` term must exist under the same name in the map it names, and a cited `Q{NN} \`handle\`` must exist. Last, it validates the inbox and fails while a `map` message is open. It lists long sentences in the scope and the Senior Answer, and checks that wait for a map not yet written, as indications to read, not as failures. #2026_10_06_01_group_5 revised by #2026_10_06_02_group_3, #2026_10_06_03_group_1, and #2026_10_06_04_group_4
- [ ] Does a spot check of one page in Sources Read find each of its Recap, Pitfall, and Caveat items in the ledger?
- [ ] During an audit, does a fresh Discovery pass, with the current map closed, find any idea the ledger lacks? Is Selection rerun for each one found?
- [ ] Does every `Do not` point have a real scoped failure, and does every preference stay framed as a preference?
- [ ] Can a pre-lecture author tell, for every ledger row, whether to teach it, explain it as support, recall it, preview it, or leave it out?
- [ ] Does the Completion Gate pass before the map goes to `pre-lecture`, `lecture-structure`, or `principled-theory`?
