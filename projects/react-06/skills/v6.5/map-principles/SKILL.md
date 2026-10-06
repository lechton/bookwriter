---
name: map-principles
description: Build or audit React 06 principle maps in 01-01-map-principles/{nn}.md. Use when a question-bank row and its syllabus card must become the numbered principles a lesson teaches, when a decision must be routed to the lesson that owns it, or when a map's coverage, ownership, importance, terms, proofs, or wording is questioned.
---

# Map Principles

A principle map turns one bank row and its syllabus card into the contract for one lesson. It says which principles the lesson teaches, in what order, and how each one is proven. It also says what the lesson only supports, recalls, previews, or leaves out. #2026_09_26_21_group_1 revised by #2026_10_06_01_group_7

The work runs in two passes. Discovery searches wide and looks at no principle map. Selection decides: it routes each idea to the lesson that owns it, keeps the important ones, and numbers them last. An Archive Check then compares the result with any older map of the same topic. #2026_09_26_21_group_1 revised by #2026_10_06_01_group_7 and #2026_10_06_01_group_8

The map feeds three readers: the pre-lecture author, the lecture author, and `node src/diagnose-map.mjs`. Write it so all three can use it without guessing. #2026_10_06_01_group_5

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
- [ ] Does Discovery read the card and every react.dev Learn and Reference page that teaches its topic? Find the pages by searching the corpus for the card's API names and mechanism words, and list them in `Sources Read`.
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

Notes: Discovery is wide on purpose, and Selection narrows it. A rejected idea stays visible in the ledger. An idea never found is an invisible gap.

## Selection | 03 | Ownership Through the Syllabus #2026_09_26_21_group_1 revised by #2026_10_05_09_group_1 and #2026_10_06_01_group_7

- [ ] Is each idea routed to the lesson whose card makes it a main subject? A main subject appears in the card's Topic Tag, Core Truth, Mechanism, or Code Experiment.
- [ ] Is every card in `01-01-map/` searched for each route, not only the neighbouring cards? Read the Topic Tag, Core Truth, Mechanism, and Scope Boundary lines.
- [ ] When no card makes an idea a main subject, is it owned by the earliest lesson whose Code Experiment needs it? Does the ledger note that the syllabus leaves it unassigned?
- [ ] Is an idea owned by an earlier lesson recorded as `Prerequisite`, so the lesson recalls it instead of numbering it again?
- [ ] Is an idea owned by a later lesson recorded as `Preview` when this lesson's code touches it, and as `Deferred` when the lesson can leave it out?
- [ ] Does every owner name its lesson by number and topic tag from the live bank, as in `Q17 #state_updates`? A later bank version that moves the topic then leaves a visible mismatch. #2026_10_05_09_group_1
- [ ] When the cards route an idea to this lesson but another map already numbers it, is the conflict listed in Reported Conflicts? #2026_10_06_01_group_3

- [ ] PROPER EXAMPLE: react.dev puts the numeric-zero `&&` Pitfall on its conditional-rendering page. The lesson whose card makes conditional rendering its main subject owns it as a principle. An earlier lesson that teaches which values JSX prints records it as `Preview` with that owner, and states only that numbers print as text.

- [ ] HALF WAY EXAMPLE: The author routes by main subject but lets the earlier lesson keep its full principle "because it was taught first". The owner lesson repeats it, and the two lectures disagree on where the decision lives.

- [ ] COUNTER-EXAMPLE: Maps 01 to 13 once named owners by number alone ("state (Q16)"). Bank Version 2 moved state to Q14, nothing in the maps showed it, and every preview pointed at the wrong lesson until an audit. #2026_10_05_09_group_1

Notes: First mention is not ownership. A passing mention earns a preview; the main subject earns the principle.

## Selection | 04 | Importance, Kind, and Atomicity #2026_09_26_21_group_1 revised by #2026_10_06_01_group_7

- [ ] Does each owned idea pass at least one importance question? Would a senior reviewer flag its absence? Would an interviewer expect it in a complete answer? Would a developer without it ship a visible bug, or carry a model that breaks a later lesson?
- [ ] Is an owned idea that fails every importance question recorded as `Supporting` when the theory needs it, or `Dropped` when it is trivia?
- [ ] Are setup facts, API names, definitions, and restatements of the question kept as `Supporting`? They become principles only when getting them wrong is a realistic failure.
- [ ] Is a principle marked `Decision` when it tells a developer what to check, choose, keep, or avoid in code? Is it marked `Model` when it is a mental model that later decisions rest on?
- [ ] Does every `Model` principle carry a `Prediction`: a behavior the reader can predict with the model and check in the console, DevTools, or on screen?
- [ ] Are two ideas split when code can pass one and fail the other, and each failure needs a different fix?
- [ ] Are two ideas merged, with a `Merged` row, when they share the same decision, cause, failure, and fix? A mistake and its remedy are one idea.
- [ ] Are the principles ordered so each one can be explained with the prerequisites and the principles before it? Are they numbered only after every idea has a disposition?

- [ ] PROPER EXAMPLE: `learn/your-first-component.md` carries a `<Pitfall>` against defining a component inside another component. Reviewers flag it and it causes real bugs, so it becomes a principle in the lesson that owns component definition. The ledger notes that the card never names it.

- [ ] PROPER EXAMPLE: "React calls your components; your code only describes the UI" becomes a `Model` principle. Its Prediction: "a component that is never used in JSX never runs, so a `console.log` in its body stays silent".

- [ ] HALF WAY EXAMPLE: The author runs the importance test but counts "the card mentions it" as a pass. A setup detail that no reviewer would flag becomes a principle beside real decisions.

- [ ] COUNTER-EXAMPLE: The author merges every idea that shares a keyword and drops everything the card does not name. An official Pitfall disappears, and the list shrinks to whatever felt tidy.

Notes: Importance decides membership, atomicity decides boundaries, and ownership decides the lesson. The number of principles is whatever survives these tests. It has no target or typical value, and other lessons' totals are not evidence.

## Selection | 05 | Tempting Belief and Defect #2026_10_06_01_group_1

- [ ] Does every principle state its `Tempting Belief`? The belief is the wrong idea a capable developer brings to this code. It comes from an earlier habit: HTML attributes, another template language, plain JavaScript, an older React version, etc. The lesson uses it to explain why the wrong idea felt right. #2026_10_06_01_group_1
- [ ] Does `Defect` hold only what someone can see: the screen, the console, DevTools, or the build output? The wrong idea itself belongs in `Tempting Belief`. #2026_10_06_01_group_1
- [ ] For a `Model` principle, is the Defect the first visible surprise the belief produces? #2026_10_06_01_group_1

- [ ] PROPER EXAMPLE: A principle about double curlies. Tempting Belief: `{{ }}` is special JSX syntax, a habit from Handlebars, Mustache, and Vue, which print values with double braces. Defect: `style="color: pink"`, written as a string, throws an error that says `style` expects a mapping from properties to values. #2026_10_06_01_group_1

- [ ] COUNTER-EXAMPLE: The archived map 14, Principle 3. Its Defect reads: "A reader who pictures state as belonging to the function expects a click on one card to change both counts." This is a belief, and nobody can see it. The habit behind it, one variable outside the function shared by every call, is never named. So the lesson cannot explain why the idea felt right. #2026_10_06_01_group_1

Notes: The pre-lecture and the lecture are asked to respect the reader's reasoning before they correct it. They can only do that when the map names the reasoning. #2026_10_06_01_group_1

## Selection | 06 | Proofs and Verified Behavior #2026_09_26_21_group_1 revised by #2026_09_27_11_group_1 and #2026_10_06_01_group_4

- [ ] Can each Required Lesson Proof be produced inside the Authorized Scope? When it needs a later concept, such as a re-render in a static-data lesson, redesign the proof or reroute the idea.
- [ ] Do the proofs use the components and variables of the card's Code Experiment? The lesson then builds one example instead of several. When a proof needs another component, does it say why, and use an everyday name that passes the naming rules of `lecture-voice`? #2026_10_06_01_group_4
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

- [ ] PROPER EXAMPLE: Map 04 marks the ternary `New` with refresher `yes`. Its third principle writes `readTime > 10 ? 'Long read' : 'Quick read'`, six lessons before Q10 teaches branching. Lecture 04 explains the operator in one sentence. Lecture 10 recalls it from Q04. #2026_10_06_01_group_2

- [ ] COUNTER-EXAMPLE: The archived map 14 lists array destructuring as `Supporting`, and no archived map records where object destructuring first appears. The Lecture 14 author must read thirteen lectures to learn whether the reader has met it. #2026_10_06_01_group_2

Notes: Only the maps see the whole syllabus at once. Settling first appearances here saves every lecture author from rediscovering them. #2026_10_06_01_group_2

## Review Language | 08 | Do, Prefer, Avoid, Do Not, and Condition #2026_09_26_19_group_1 revised by #2026_09_26_21_group_1

- [ ] Does each `Decision` principle's review point use the weakest label the evidence supports? `Do` is a required action. `Prefer` is a sound default. `Avoid` is a risk in some contexts. `Do not` is an action that is invalid or reliably harmful. `Condition` means the right choice depends on circumstances.
- [ ] Is `Do not` kept for a real scoped failure: a compiler error, a runtime error, corrupted data, a broken contract, or a reliably harmful result?
- [ ] When two choices are both valid, does the review point name the deciding condition instead of inventing a ban?
- [ ] Does negative guidance add something the positive rule does not already say?

- [ ] PROPER EXAMPLE: An unclosed JSX tag earns `Do not`, because the parser rejects it. `&&` against a ternary earns `Condition`, because both are valid for different branch shapes.

- [ ] COUNTER-EXAMPLE: "Do not use a ternary that returns null" turns one valid style into a false ban, only to complete a pair.

## Writing the Map | 09 | Clear Prose and Clean Data #2026_10_06_01_group_6

- [ ] Are the Authorized Scope and the Senior Answer written to `lecture-voice` Sections 05 and 06? That means common words, one idea per sentence, and short sentences. Authors copy the shape of what they read, so a dense map tends to produce a dense lecture. #2026_10_06_01_group_6
- [ ] Does the Authorized Scope say what the lesson teaches and what it builds on? The list of what later lessons own already lives in the ledger's Preview and Deferred rows, so the scope leaves it out. #2026_10_06_01_group_6
- [ ] Could a candidate say the Senior Answer aloud in an interview? The interviewer hears it once, so each sentence carries one point. #2026_10_06_01_group_6
- [ ] Are Roles, Placement, Mechanism, Tempting Belief, and Defect written as short data fragments rather than finished sentences? The lecture author writes the definition from them; a ready sentence here tends to be pasted with synonyms swapped. #2026_10_04_09_group_1 revised by #2026_10_06_01_group_1
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

## Sources Read
- `learn/{page}.md`: {blocks read}
- `reference/{path}.md`: {sections read}
- Runtime check: {versions and setup used to reproduce behaviors}
- Syllabus cards used for ownership: {Q numbers}
- General engineering knowledge: {review, interview, and failure angles considered}
- Archive check: {archived maps compared, and how many rows each added}

## Candidate Ledger
| candidate | source | disposition | owner | reason |
|---|---|---|---|---|
| {one plain decision, model, or observed behavior} | {card field, react.dev block, or general} | {Principle, Merged, Supporting, Prerequisite, Preview, Deferred, or Dropped} | {see the owner rule below} | {one line} |

## Terms
| term | kind | status | first lesson | refresher | first needed in |
|---|---|---|---|---|---|
| {`useState`, ternary, `e.target`} | {React, browser, JavaScript, or general} | {New or Recall} | {Q{NN} `#tag`} | {yes or no} | {a principle handle, or Supporting} |

## Principles

### Principle {N}: {Active title}
- **Handle**: `{two-to-four-words}`
- **Kind**: {Decision or Model}
- **Roles**: {the things the reader must tell apart, as `name: what it does` fragments separated by semicolons}
- **Placement**: {where the right code goes, and where it does not}
- **Mechanism**: {the platform behavior that makes the rule true}
- **Tempting Belief**: {the wrong idea, and the habit it comes from}
- **Defect**: {what the screen, console, DevTools, or build shows, verified in React 19}
- **Importance**: {the review finding, interview expectation, shipped bug, or broken later lesson it prevents}
- **Review Point (Do | Prefer | Avoid | Do not | Condition)**: {Decision only: the code-review decision}
- **Prediction**: {Model only: the behavior the reader can predict and check}
- **Required Lesson Proof**: {code and visible evidence, on the card's example, inside the scope}

## Senior Answer
{A spoken answer to the interview question, in short sentences, using only this map's principles and prerequisites.}

## Reported Conflicts
- {One line per disagreement with a card, the corpus, or another map: what disagreed, where, and where it was fixed or reported. `None` when empty.}

## Open Issues
- {One line per unverified claim or uncorrected error: what it is, where it sits, and what would close it. `None` when empty.}

## Completion Gate
- [ ] The header's tag, tier, and question equal bank row {NN} and card {NN}.
- [ ] `node src/diagnose-map.mjs {NN}` reports no failure.
- [ ] Every Recap, Pitfall, Caveat, and Troubleshooting item on the pages in Sources Read has a ledger row.
- [ ] Every principle is owned through the cards and records the importance question it passed.
- [ ] Every behavior the map states was reproduced in React 19 or found in the corpus.
- [ ] Every Required Lesson Proof runs on the card's example inside the scope, or says why it cannot.
- [ ] Every Terms row was marked after a search of the earlier cards and maps.
- [ ] The Archive Check is done, and every idea it found has a ledger row.
- [ ] Reported Conflicts and Open Issues are complete.
- [ ] A candidate could say the Senior Answer aloud, and it would satisfy a senior interviewer.
```

- [ ] Does the owner column follow one rule per disposition? `Principle` and `Merged` rows name a principle handle. `Supporting` rows name this lesson (`Q{NN} #tag`). `Prerequisite` rows name an earlier lesson, and `Preview` and `Deferred` rows a later one, each as `Q{NN} #tag`. `Dropped` rows hold `none`. #2026_10_06_01_group_9
- [ ] Does a `Decision` principle carry a Review Point and no Prediction, and a `Model` principle a Prediction and no Review Point?
- [ ] Does the header keep the card's title, and do its tag, tier, and question equal bank row {NN} exactly, with the bank version named in `Bank Row`? #2026_10_05_07_group_1

Notes: Maps in the `v_old_*` folders use older formats; read them only during the Archive Check. #2026_10_06_01_group_8

## Verification | 13 | Before the Map Is Handed On #2026_09_26_19_group_1 revised by #2026_10_05_09_group_1 and #2026_10_06_01_group_5

- [ ] Does `node src/diagnose-map.mjs {nn}` report no failure? It checks the header against the bank, the sections and their order, the owner rule, the handles, the principle fields, the Terms rows, em-dashes, and hard wraps. It also lists long sentences in the scope and the Senior Answer as indications to read, not as failures. #2026_10_06_01_group_5
- [ ] Does a spot check of one page in Sources Read find each of its Recap, Pitfall, and Caveat items in the ledger?
- [ ] During an audit, does a fresh Discovery pass, with the current map closed, find any idea the ledger lacks? Is Selection rerun for each one found?
- [ ] Does every `Do not` point have a real scoped failure, and does every preference stay framed as a preference?
- [ ] Can a pre-lecture author tell, for every ledger row, whether to teach it, explain it as support, recall it, preview it, or leave it out?
- [ ] Does the Completion Gate pass before the map goes to `pre-lecture`, `lecture-structure`, or `principled-theory`?
