# Lesson 10 to 10b: the first rewrite from the rules

This log records how `05-01-md-revised-4/v1/10.md` was rewritten into `05-01-md-revised-4/v1/10b.md` by applying the rules collected during the 03b rewrite (`03b-rules-and-standards.md`, R01 to R32), with no step-by-step steering. It tests whether the rules are enough to produce a "b" lesson on their own. Every gap or judgment call is logged below, so the rules can be tightened before they join a skill.

Build from `projects/react-08`: `node src/build-revised-4.mjs 10b`. Output: `05-03-md-revised-4-pdf/v1/10b.pdf`, 29 pages. Lesson `10.md` stays untouched. Proof: `notes/10b-shots/10b-contact.png`.

## How each rule was applied

- R01, R03, R04 (theory first, title kinds, the example at the end): the title page, then a main title "React Conditional Rendering" with two theory sections, "Two different ways to keep a part off the page" and "Conditional rendering: four kinds of choice"; then "Principles" on a new page; the closing parts; the Summary on a new page; then, on a new page, "Example: article cards on a news site" and "The components behind the page". In 10, the news-site page, the IF/THEN table, the components panel, and `ArticleList.jsx` opened the lesson.
- R02 (clear comparisons, repeated labels): the opening tree names both sides with their difference in the label: "Hide it: the element stays in the DOM" and "Leave it out: conditional rendering". The Summary tree repeats both labels, and the map's root repeats "Leave it out: conditional rendering".
- R05, R09, R10, R13, R15, R21, R22, R23 (the look): carried by the `edition-b` class, which the build gives any lesson named with a letter. No CSS change was needed.
- R06 (at most five boxes under one box): the map keeps 10's shape, two branches, then one and three leaves. The final components panel has four children under `App`.
- R07 (a rule the lesson relies on gets its own principle): no hidden rule was found. The parent leaving a tag out stays inside Principle 2, where 10 put it, because it is the same `&&`.
- R08, R11, R14, R19, R27 (the example reuses the principle's code, one component per file, PARENT and CHILD, the same route, no "principle's own"): each section's example is built on its principle's own component, in its own file, with `App.jsx` as PARENT and the component as CHILD: `Profile` (1), `Inbox` (2), `ArticleCard` (3), `CommentCount` (4). In 10, every section used the news site's `ArticleCard`, and the principles used other components (`Profile`, `Inbox`, `Card`, `CountLabel`). The principle cards were brought closer to their examples: `Profile` returns a `<section>` with a name and a city, `Inbox` has an `<h2>Inbox</h2>`, Principle 3's card is `ArticleCard` with `article.title` and `article.summary`, Principle 4's is `CommentCount` with the lesson's real wordings ("No comments yet", "1 comment", "5 comments").
- R12, R24 (the page beside its code, the browser first): every comparison shows the page on top and the code under it. The theory comparison shows the Elements panel on top, since both pages look the same there.
- R16 (a Console looks like Chrome's): 10's code-style `console` block ("card runs", six lines) became a `devconsole`: "Profile runs null", one line, since this project leaves Strict Mode out, as 03b says. The parent case shows "No messages". The `TypeError` appears as a Chrome error row under the blank page, where 10 drew a red line inside the page.
- R17, R25 (subtitles): every section has "Example: let's ... (outcome!)", "Component Hierarchy", "Let's check ..." (the page, our console log, or "Let's compare the two versions"), then a "Why ...?" subtitle and a closing tree.
- R18 (an italic key question under each heading): 1 "Why? Reading a property of `null` throws, and the whole page goes blank"; 2 "Why? `&&` gives back one of its sides, and React shows a number"; 3 "Why? The markup both cases share is written once, so a change reaches both"; 4 "How? One case per branch, read from top to bottom".
- R20 (real photos): no `<img>` in the lesson's code, so no photo.
- R26, R28, R29, R30, R31 (plain normative prose, the point first, the mechanism, "we want" setups): every lead opens with "Here, ..." and the consequence, then the mechanism in one or two sentences, then a "We want ..." setup that ends on a colon before the code. Back-references name a principle ("Principle 2 explains how `&&` works"), never a section number.
- R32 (a heading names the cause, in the same words): each example title is checked against its lead and its "Why" subtitle:
  - 1: "(the page goes blank!)", lead "the whole page goes blank", subtitle "Why does `user.name` blank the whole page?"
  - 2: "(React shows the 0!)", lead "React shows whatever it gets back", subtitle "Why does a 0 appear?"
  - 3: "(the copies drift apart!)", subtitle "Why do two returns drift apart?"
  - 4: "(the code is hard to read!)", subtitle "Why is the if chain easier to read?"

## Judgment calls, waiting for the owner

- Section 3's case is new. In 10, the drift between two returns came from Principle 2's `> 0` fix reaching one copy, so section 3 depended on section 2's case. In 10b, the change is a new author line that reaches only the signed-in return, so section 3 stands on its own and the visitor's card shows "The author line missing".
- Section 4's example says the code works, so its outcome names readability, not a failure. Its check is "Let's compare the two versions", since both pages look the same.
- Section 1 keeps 10's three-way comparison (`user.name`, `user?.name`, `if (!user) return null`). The `?.` column shows an empty element with a dashed outline, now labelled `<section class="profile"> with empty tags`.
- The news site at the end gains a third column in its table, "the tool", which ties each IF/THEN rule to its principle. It shows the final card from "Putting the four together", so the rain card says "No comments yet", where 10's opening showed no comment line.
- "The components behind the page" lists the lesson's components (`Profile`, `Inbox`, `ArticleCard`, `CommentCount` under `App`), as 03b does, not the news site's `ArticleList`.
- `ArticleList.jsx` and its two article objects are gone. The news site keeps only its page and its table.
- The author line is now `By {article.author}`, so the code matches the page mock, which prints "By Mary Jones".
- The Strict Mode paragraph is gone. One sentence says the project leaves Strict Mode out, as 03b does.
- The opening tree's root, "Two different ways to keep a part off the page", follows 03b's "Two different ways to write markup".

## Build change

- `cardHTML` in `src/build-revised-4.mjs`: `ghost=<text>` names the empty element. A bare `ghost` keeps the old note, `<article class="card"> with empty tags`, so 03, 03b, 10, and 11 are unchanged.

## Layout

- The first build was 30 pages. Section 4's heading, map, and expression fact stood alone on a page, because the principle box could not follow. The expression fact moved down to "Why is the if chain easier to read?", where the text uses it. 29 pages.
- The three comment wordings first rendered side by side (`line:` rows run inline in a mini page). They are now one paragraph broken into lines (`card: lines=...`).
- Partly empty pages remain, as in 03b: page 9 (the end of section 1) and page 19 (the end of section 3), because each next section keeps its heading, map, facts, and principle together.
- One build warning: the code line `<p className="author">By {article.author}</p>` is 47 characters in a half-width column, one over the limit. It does not wrap.

## Rule gaps found

- No rule says what happens when the principles of the original lesson use different components from its examples. 10b chose to change both toward one small component per section (R08 read both ways).
- No rule says what an example's outcome is when the code works but is worse, as in section 4. R25's "(it fails!)" does not fit. 10b used the cause in R32's sense: "(the code is hard to read!)".
- No rule covers moving a fact to avoid a near-empty page. 10b moved the fact to the place where the text uses it, which also follows R31 (a fact sits where it is needed).
