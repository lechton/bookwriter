---
name: map-principles
description: Author or audit React 06 principle maps in 01-01-map-principles/{nn}.md. Use when turning a syllabus card, the react.dev pages for its topic, and senior engineering knowledge into the numbered principles a lesson must teach, when routing a decision to the lesson that owns it, or when checking a map's coverage, ownership, importance, atomicity, or review language.
---

# Map Principles

Turn one syllabus card into the approved principle contract for its lesson. The work runs in two passes. Discovery searches wide (the syllabus card, the official react.dev pages for the topic, and senior engineering knowledge) without looking at any principle map. Selection decides: it routes each candidate to the lesson that owns it, keeps the important and independent decisions, and numbers them last. The finished map tells pre-lecture and lecture authors which principles to teach, what to explain as support, what to recall from earlier lessons, what to preview for later lessons, and what to leave out. #2026_09_26_21_group_1

## Artifact Authority | 01 | Sources, Owners, and the Approved Map #2026_09_26_19_group_1 revised by #2026_09_26_20_group_1 and #2026_09_26_21_group_1

- [ ] Is `01-01-map/{nn}.md` treated as the authority for the lesson's topic, interview question, code experiment, and scope boundary?
- [ ] Is the whole syllabus in `01-01-map/` treated as the authority for ownership, so each decision belongs to the lesson whose card makes it a main subject rather than to the first lesson that mentions it?
- [ ] Is the local react.dev corpus (`documentation official/React 19 Sept 2026/react.dev/src/content/`) treated as the authority for React facts, so it prevails when a syllabus card or general knowledge disagrees with it?
- [ ] Once approved, is `01-01-map-principles/{nn}.md` treated as the authority for the lesson's numbered principles, their order, their required proofs, and every disposition in its candidate ledger?
- [ ] When a lecture, a pre-lecture, or an earlier principle map conflicts with syllabus ownership or with the approved map, is the conflict reported for correction rather than used to expand or shrink the principle set?

## Discovery | 02 | Source-Open, Map-Blind Candidate Search #2026_09_26_21_group_1

- [ ] Is Discovery completed before any file in `01-01-map-principles/` is opened (prefer a fresh agent or session; during an audit, keep the current map closed until Discovery ends), so no existing title, order, or total shapes the search?
- [ ] Does Discovery read the syllabus card and every react.dev Learn and Reference page that teaches its topic, found by searching the corpus for the card's API names and mechanism terms, and list those pages in `Sources Read`?
- [ ] On each page, are the `<Recap>`, `<Pitfall>`, `<DeepDive>`, `<Note>`, and `<Challenges>` blocks read, together with the `#### Caveats` and `## Troubleshooting` sections of the relevant Reference pages?
- [ ] Are the Rules of React pages in `reference/rules/` read when the topic touches rendering, purity, or hooks, and is the React 19 upgrade guide (`blog/2024/04/25/react-19-upgrade-guide.md`) read when the topic touches an API that React 19 removed or changed?
- [ ] Does Discovery add candidates from senior engineering knowledge (what reviewers flag in pull requests, what interviewers probe, what juniors commonly ship broken, what behaves differently on a laptop and in CI, etc.), with the source marked `general`?
- [ ] Does every `general` candidate state a concrete code case with an observable compiler, runtime, console, or screen result, and agree with react.dev?
- [ ] Is every claim in the syllabus card checked against react.dev, with removed or changed APIs recorded as conflicts rather than carried forward?
- [ ] Is each candidate recorded as one plain decision or mental model with its source, including candidates that probably belong to other lessons, so Selection can route them?
- [ ] Are candidates left unnumbered, ungrouped, and uncounted, so merging, ownership, and numbering happen only in Selection?

- [ ] PROPER EXAMPLE: For a conditional-rendering card, Discovery records the card's branch forms, every `<Recap>` bullet of `learn/conditional-rendering.md`, its `<Pitfall>` "Don't put numbers on the left side of `&&`", and its section on assigning JSX to a variable, then adds `general` candidates such as "a nested ternary chain hides which output belongs to which condition" and "a node hidden with CSS stays in the DOM, while an omitted node does not", each with its source.

- [ ] HALF WAY EXAMPLE: Discovery reads the react.dev prose but skips the `<Pitfall>` blocks, so the most common production bug on the page never enters the ledger and no later test can recover it.

- [ ] COUNTER-EXAMPLE: Discovery opens the earlier principle maps first, copies their headings, and searches the card for enough material to fill a similar list.

Notes: Discovery is deliberately wide. Selection narrows it. A candidate that was found and rejected is visible evidence in the ledger; a candidate that was never found is an invisible gap.

## Selection | 03 | Ownership Through the Syllabus #2026_09_26_21_group_1

- [ ] Is each candidate routed to the lesson whose syllabus card makes it a main subject, meaning the card's Topic Tag, Core Truth, Mechanism, or Code Experiment is about that decision, even when an earlier card mentions it in passing?
- [ ] Are the Topic Tag, Core Truth, Mechanism, and Scope Boundary lines of every card in `01-01-map/` searched for each route, rather than only the neighboring cards?
- [ ] When no card makes a candidate a main subject, is it owned by the earliest lesson whose Code Experiment cannot be written correctly without it, with the ledger noting that the syllabus leaves it unassigned?
- [ ] Is a candidate owned by an earlier lesson recorded as `Prerequisite` with its owner, so the lesson recalls it instead of numbering it again?
- [ ] Is a candidate owned by a later lesson recorded as `Preview` when this lesson's code touches it and a one-sentence mention naming the owner prevents confusion, and as `Deferred` when the lesson can leave it out entirely?
- [ ] When the syllabus routes a decision to this lesson but an earlier principle map already numbers it, is the conflict reported for correction in that earlier map?

- [ ] PROPER EXAMPLE: react.dev places the numeric-zero `&&` Pitfall on its conditional-rendering page. The lesson whose card makes conditional rendering its main subject owns it as a principle, while an earlier lesson that teaches which values JSX prints records it as `Preview` with that owner and states only that numbers render as text.

- [ ] HALF WAY EXAMPLE: The author routes by main subject but lets the earlier lesson keep its full principle "because it was taught first", so the owner lesson repeats it and the two lectures disagree on where the decision lives.

- [ ] COUNTER-EXAMPLE: The first lesson whose card mentions purity in its scope boundary takes the full purity principle, leaving the lesson whose Topic Tag is purity with a thin map that can only recall its own subject.

Notes: First mention is not ownership. A passing mention earns a preview; the main subject earns the principle.

## Selection | 04 | Importance, Kind, Atomicity, and Proof #2026_09_26_21_group_1

- [ ] Does each owned candidate pass at least one importance question: would a senior reviewer flag its absence in a pull request, would an interviewer expect it in a complete answer to this lesson's question, or would a developer without it ship a visible bug or carry a mental model that breaks a later lesson?
- [ ] Is an owned candidate that fails every importance question recorded as `Supporting` when the theory needs it or as `Dropped` when it is trivia, instead of becoming a principle?
- [ ] Are setup facts, API names, definitions, and restatements of the interview question kept as `Supporting` unless getting them wrong is a realistic failure the lesson prevents?
- [ ] Is a principle marked `Decision` when it tells a developer what to check, choose, preserve, or avoid in code, and `Model` when it is a mental model that later decisions rest on, so mental models are not forced into review-action wording?
- [ ] Does every `Model` principle carry a `Prediction`: a behavior the reader can predict with the model and check in the console, DevTools, or on screen?
- [ ] Are candidates split when code can pass one while failing the other and each failure needs a different correction?
- [ ] Are candidates merged, with the merge recorded in the ledger, when they share the same decision, condition, mechanism, failure, and correction, including a mistake and its remedy?
- [ ] Can each principle's Required Lesson Proof be produced inside the Authorized Scope, and is the proof redesigned or the candidate rerouted when it would need a later concept (such as a re-render in a static-data lesson)?
- [ ] Is every compiler message, console warning, or error text quoted in a proof taken from the local react.dev corpus (including the React 19 upgrade guide) rather than recalled from an older toolchain, and is a result react.dev does not quote described by its behavior instead of as exact text, so the map rests on the documentation alone? #2026_09_26_21_group_1 revised by #2026_09_27_11_group_1
- [ ] Are the principles ordered so each can be explained using only prerequisites and the principles before it, and numbered only after every candidate has a disposition?

- [ ] PROPER EXAMPLE: `learn/your-first-component.md` carries a `<Pitfall>` against defining a component inside another component. A senior reviewer flags it and it causes real bugs, so it becomes a principle in the lesson that owns component definition even though that lesson's card never names it, and the ledger notes the syllabus gap.

- [ ] PROPER EXAMPLE: "React calls your components; your code only describes the UI" becomes a `Model` principle with the Prediction "a component that is never used in JSX never runs, so a `console.log` in its body stays silent", which the lesson proves in the console.

- [ ] HALF WAY EXAMPLE: The author runs the importance test but counts "the card mentions it" as a pass, so a scaffolding detail that no reviewer would flag becomes a principle beside real decisions.

- [ ] COUNTER-EXAMPLE: The author merges every candidate that shares a keyword and drops everything the card does not name, so an official Pitfall disappears and the list shrinks to whatever felt tidy.

Notes: Importance decides membership, atomicity decides boundaries, and ownership decides the lesson. The number of principles is whatever survives these tests; it has no target, range, or typical value, and other lessons' totals are not evidence.

## Review Language | 05 | Evidence-Based Do, Avoid, Prefer, and Do Not #2026_09_26_19_group_1 revised by #2026_09_26_21_group_1

- [ ] Does each `Decision` principle's review point use the weakest accurate label for the evidence: `Do` for a required action, `Prefer` for a sound default, `Avoid` for a contextual risk, `Do not` for an authentic invalid or harmful action, and `Condition` when the correct choice depends on circumstances?
- [ ] Is `Do not` reserved for a scoped compiler failure, runtime failure, data corruption, broken contract, or reliably harmful result rather than used as the automatic opposite of positive advice?
- [ ] When two alternatives are valid, does the review point state the deciding condition instead of inventing a prohibition?
- [ ] Does negative guidance add distinct review value rather than merely reverse the wording of the rule?
- [ ] Is a positive/negative pair included only when the lesson has an honest two-sided contrast?

- [ ] PROPER EXAMPLE: An unclosed JSX tag earns `Do not` because the parser rejects it; `&&` versus a ternary earns `Condition` because both are valid for different branch shapes.

- [ ] COUNTER-EXAMPLE: "Do not use a ternary that returns null" turns one valid conditional style into a false prohibition merely to complete a pair.

## Output Contract | 06 | Principle Map Format #2026_09_26_19_group_1 revised by #2026_09_26_20_group_1 and #2026_09_26_21_group_1

- [ ] Does every principle-map file use this order and keep each paragraph, bullet, and table row on one continuous line?

```markdown
# Q{NN}: {Lesson title} — Operational Principle Map
- **Source Map**: `01-01-map/{NN}.md`
- **Topic Tag**: `{tag}` | `{tier}`
- **Interview Question**: *{verbatim question}*

## Authorized Scope
{One concise paragraph derived from the syllabus card.}

## Sources Read
- `learn/{page}.md`: {blocks read, such as Recap, Pitfall, Deep Dive, Challenges}
- `reference/{path}.md`: {sections read, such as Caveats, Troubleshooting}
- Syllabus cards used for ownership: {the Q numbers whose cards decided a route}
- General engineering knowledge: {the review, interview, and failure angles considered}

## Candidate Ledger
| candidate | source | disposition | owner | reason |
|---|---|---|---|---|
| {one plain decision or mental model} | {card field, react.dev block, or general} | {Principle, Merged, Supporting, Prerequisite, Preview, Deferred, or Dropped} | {Q{NN}, the candidate it merged into, or —} | {one line} |

## Principles

### Principle {N}: {Active title}
- **Kind**: {Decision | Model}
- **Rule**: {Developer action or mental model, mechanism, and protected outcome.}
- **Importance**: {The review finding, interview expectation, shipped bug, or broken later lesson it prevents.}
- **Review Point — {Do | Prefer | Avoid | Do not | Condition}**: {Decision kind only: the direct code-review decision.}
- **Prediction**: {Model kind only: the behavior the reader can predict and check.}
- **Required Lesson Proof**: {Concrete code, compiler, runtime, console, or screen evidence producible inside the Authorized Scope.}
- **Sources**: {The ledger candidates this principle carries and where they came from.}

## Senior Answer
{One paragraph answering the interview question using only this map's principles and prerequisites.}

## Completion Gate
- [ ] Every Recap, Pitfall, Caveat, and Troubleshooting item on the pages in Sources Read has a ledger row.
- [ ] Every ledger row has one disposition, and every Prerequisite, Preview, and Deferred row names its owner lesson.
- [ ] The ledger names candidates by their decision rather than by principle number and keeps rejected candidates with their reasons.
- [ ] Every principle is owned by this lesson through the syllabus and records the importance question it passed.
- [ ] Every Required Lesson Proof can be produced inside the Authorized Scope.
- [ ] The Senior Answer uses only principles and prerequisites and would satisfy a senior interviewer.
- [ ] Ownership conflicts with earlier principle maps are reported.
```

- [ ] Does the header preserve the syllabus card's title, topic tag, tier, interview question, and path exactly?
- [ ] Does a `Decision` principle carry a Review Point without a Prediction, and a `Model` principle carry a Prediction without a Review Point?
- [ ] Are ledger rows grouped by disposition, so authors can scan principles, merges, supporting explanations, previews, prerequisites, deferrals, and drops without reading the whole table?

Notes: The candidate ledger replaces the former `Deferred Scope`, `Prerequisites Reused, Not Reintroduced`, and `Coverage and Disposition Ledger` sections, so every non-principle decision lives in one place with its owner and reason. Maps that still carry those former sections are provisional and are best rebuilt with this workflow before a pre-lecture relies on them.

## Verification | 07 | Coverage, Ownership, Importance, and Handoff #2026_09_26_19_group_1 revised by #2026_09_26_20_group_1 and #2026_09_26_21_group_1

- [ ] Does every `Principle` row in the ledger match exactly one numbered principle, and every numbered principle match exactly one `Principle` row?
- [ ] Does a spot check of one page in `Sources Read` find every one of its Recap, Pitfall, and Caveat items in the ledger?
- [ ] During an audit, does a fresh Discovery pass with the current map closed find any candidate the ledger lacks, and is Selection rerun for each one found?
- [ ] Does every `Principle` row survive the ownership check against the whole syllabus, and does every `Prerequisite`, `Preview`, and `Deferred` row point to the owner lesson that the Section 03 routing rules select?
- [ ] Does every `Do not` point have a real scoped failure, and does every preference remain framed as a preference?
- [ ] Can a pre-lecture author tell, for every ledger row, whether to teach it as a principle, explain it as support, recall it, preview it, or leave it out?
- [ ] Does the completion gate pass before the map is handed to `pre-lecture`, `lecture-structure`, or `principled-theory`?
