# Skill: How To Write The Q&A Digest (The Problem-Driven Review Companion)

This skill is the THIRD artifact in the course, alongside `write_lecture.md` and `write_outline_v02.md`.

- The **lecture** narrates. It teaches by ear, code-free, an hour long.
- The **booklet** carries the code. It is the lecture's eye-twin, every snippet the voice points to.
- The **Q&A digest** poses problems and solves them. It teaches by interrogation: a sharp, concrete problem, then the answer in theory, a map of the components, and the full files. It is built to be REVIEWED, fast, again and again.

Where the lecture is a river you float down once, the digest is a deck of cards you flip through forever. You read the problem, try to solve it in your head, then check yourself against the theory, the map, and the files below. That self-test loop is the whole point. Design every entry so it works that way: problem on top, answer below.

This skill DIGESTS the Svelte documentation into problem-answer pairs. It does not narrate the docs and it does not reproduce every snippet. It curates the problems a developer actually hits, answers each one cleanly, and then, because curiosity cements a topic, piles creative edge cases on top.

The guiding spirit comes from two discussion documents in `/documentation 2026 June/claude-discussions` (`SvelteKit Reframed as Problems.md` and the `50 SvelteKit concepts` export). Read them. They are the template for the voice and the shape: features are answers, so lead with the question; show the real, short files; and where it helps, name in one line what plain JavaScript forced you to do by hand, because the pain is what makes the fix stick.

---

ROLE AND GOAL

You are given a topic (named in the table of contents, with its documentation sources listed under it), usually the finished lecture and booklet for that topic, and the discussion documents above. You return the digest: one markdown file, a numbered run of problem-framed Q&A entries, grouped by sub-theme. Every answer gives the theory, a map of the components involved, and then the actual files in full, all anchored in our running world, The National Times.

The reader already met this topic in the lecture. The digest is not first contact; it is the place they come back to in order to revise, to find the one pattern they half-remember, to quiz themselves the night before they build. So it is sharp, concrete, and scannable. Problems they recognize. Maps they can picture. Files they can lift straight into their own code.

Four things make a good digest, and this skill is built around them: PROBLEMS (every entry is a real question, never a definition), A MAP (every entry shows how the pieces relate), FULL SHORT FILES (real, complete, minimal, named), and REVIEWABILITY (the format lets you self-test, and the creative edge cases make you want to).

---

THE UNIT: ONE Q&A ENTRY

Everything in this skill serves the entry. One entry is one problem and its full solution. Its anatomy, in order, is fixed:

1. THE PROBLEM. A precise, technical question (see QUESTIONS ARE TECHNICAL AND PRECISE). It names the mechanism and uses concrete, code-level terms, and it stands completely alone: a reader who covers everything below can still read the question and attempt the answer. This is the flashcard front.

2. THE SHORT ANSWER. The direct response, first. A bold Yes or No for a yes/no question (or the single key move for a how question), then one or two sentences of resolution in plain technical terms. This is what the reader checks themselves against the instant they uncover the answer, before any teaching. See LEAD WITH A DIRECT ANSWER.

3. THE THEORY. The one part you do NOT compress. This is where the teaching happens, so it builds the idea up from the ground the reader already stands on, naming and explaining every term as it arrives. See THE THEORY TEACHES FROM THE GROUND UP. A reader who finishes it understands the idea; they do not merely recognize that an idea was named.

4. THE COMPONENT MAP. A small ASCII diagram of the files involved and how they relate. Every entry has one (see THE COMPONENT MAP). It is the picture the reader holds while they read the files: who owns what, what flows down, what flows up.

5. THE FILES. The actual code that solves the problem, every file shown IN FULL, short and minimal, each wearing its `title="..."`. When the answer spans components, show the real, separate files, parent and child. No fragments, no snippets standing in for components. This is the part the reader lifts into their own project.

6. THE MOVE. One line. The single habit to carry away, the sentence that makes the whole entry snap back into memory months later. (The discussion docs call this "the move"; keep the name.)

7. OPTIONAL EXTRAS. A `⚠️ Gotcha` when a trap rides along. A `🧪 Going further` when a creative edge case is worth chasing. Use them when they earn their place.

8. THE QUICK-FIRE REVIEW. A small table of clear question-and-answer pairs that drill the same card, placed last, just above the source. The reader covers the answer column and tests themselves. See THE QUICK-FIRE REVIEW.

That shape never varies. Problem, short answer, theory, map, files, move, quick-fire review. The reader learns the rhythm once and then flies through the deck.

---

QUESTIONS ARE TECHNICAL AND PRECISE (NOT VAGUE, NOT BARE DEFINITIONS)

The question is the flashcard front, and it has two failure modes to avoid. One is the bare definition ("What is `$state`?"), an exam question that teaches nothing. The other, just as bad, is the vague scenario: "A reader taps the clap button and the number won't move, how do I fix it?" reads like a story and buries the actual mechanism. The reader came to drill a precise piece of machinery, so name that machinery.

A good question is technical, specific, and clear. It names the concept up front and probes one exact mechanism, in concrete, code-level terms — `obj.tags[0]`, `array.push(...)`, `$state.raw`, `this`, `.value` — not hand-wavy description. Three shapes work well:

- THE YES/NO CONJECTURE. State a precise hypothesis and ask whether it holds. "Deep reactivity: if I make an `article` object reactive with `$state`, is a nested field like `article.tags[0]` reactive too, and does `article.tags.push(...)` update the screen?" The reader can guess, then check against a one-word answer.
- THE SHARP HOW. A direct question about the mechanism. "Reactive class fields: I want a `Draft` class bundling data with methods — how do its fields become reactive?" This is the model of a good technical question.
- THE SHARP WHY. A precise cause question, usually for a trap. "Why does `let { title } = article` stop tracking later changes to `article.title`?"

Anchor in The National Times by using its real objects in the example — the `article`, its `tags`, the clap count, the logged-in reader — but put them in the question as concrete code, not as a narrated scene. Lead the question with the concept name where it sharpens it ("Deep reactivity:", "Method binding:", "Sharing across files:"), so the reader knows exactly which gear they're inspecting. But precise is not the same as syntax-trivia: every question must still state a real goal the reader has — see LEAD WITH THE GOAL.

Keep the title (the question itself) tight: one question, the concept label plus the one concrete failure-or-goal, and a real code token (`add`, `liked`, `tasks[0].done`). Cut any parenthetical aside that justifies a choice — the "why a `Set`" detail belongs in the Theory, not the title. And the index line is the header verbatim, so the two never drift.

---

LEAD WITH A DIRECT ANSWER (THE SHORT ANSWER)

The reader asked a precise question; answer it immediately, before you teach. The Short answer block sits right after the question and opens with the direct verdict — a bold **Yes.** or **No.** for a yes/no question, or the single key move for a how question — then resolves it in one or two sentences of plain technical terms. It is the line the reader uncovers and checks themselves against in two seconds. Earlier drafts buried the verdict inside a long explanation, so the reader never saw the plain "Yes" they were waiting for; this block fixes that.

- For a yes/no conjecture: "**Yes.** `$state` proxies an object *deeply*, so every nested field, and even `array.push(...)`, is tracked, all the way down."
- For a how question: "Mark each field with `$state` yourself — on the field, or on its first assignment in the constructor — because class instances aren't proxied automatically."

Then, and only then, the Theory builds the full explanation from the ground up. The Short answer resolves; the Theory teaches. Never skip the Short answer, and never let it swell into the Theory's job — it is the verdict, kept tight.

---

LEAD WITH THE GOAL; DEMOTE TRAPS AND INTERNALS

A precise question is not the same as a syntax-trivia question, and confusing the two is the fastest way to write a card nobody understands. "Can I `export let count = $state(0)` and reassign it?" is precise, technical — and useless, because no reader ever wanted to do that. It quizzes a code form instead of serving a need. The fix is to make every question start from a GOAL the reader actually has — "I want one value, the logged-in reader, that many components share; where do I put it?" — and let the mechanism, and any forbidden form, come out in the answer.

Three rules keep an entry grounded:

- LEAD WITH THE GOAL. The question states what the reader is trying to achieve, in their terms. If you cannot say why someone would want this, you have the wrong question. Precision lives in stating the goal and the mechanism exactly, not in quizzing syntax.
- ANSWER THE WORKING PATH FIRST; DEMOTE THE TRAP. Open the answer on how you DO the thing, then add the forbidden form as a `⚠️ Gotcha`. Never structure a card as "here is a thing you can't do" when the reader never asked to do it. A trap is a footnote to a solution, not a front door.
- DEMOTE INTERNALS THAT DON'T SERVE THE GOAL. Compiler output, emitted get/set, "signal" plumbing, type-of leaks — show them only if they make the answer clearer. Usually they don't; they pile jargon onto a rule the reader will happily just follow. Move them to a `🧪 Going further` for the curious, or cut them. The reader needs the move, not the proof.

The cautionary tale, from this very topic. An early draft of the "share state across files" card led with the forbidden `export let count = $state(0)` pattern, an abstract `count`, and a dump of the compiler's emitted code and a `typeof === 'object'` leak. The reader's verdict was flat: "I have no idea what we are talking about, at all." Rewritten to lead with the goal (share the logged-in reader), the solution first (a `.svelte.ts` module exporting an object), the trap demoted to a gotcha, and the compiler internals dropped to a going-further, it became one of the clearest cards in the set. Same facts, opposite outcome. When a card confuses, check first whether it forgot to lead with the goal.

---

USE REAL, PROFESSIONAL SCENARIOS — AND SEARCH FOR THEM

Leading with the goal only works if the goal is REAL. A toy scenario teaches nothing, and a toy scenario that misrepresents when a tool is for is worse than nothing — show `$state.raw` on a single article and the reader walks away believing that is what it is for, which is exactly backwards. Write for a professional, or for the ambitious novice who wants the real craft the fast way. Every entry must answer not only HOW a feature works but WHY, WHERE, and WHEN you reach for it, on a scenario a working developer would actually meet.

Three rules:

- THE SCENARIO MUST BE ONE THE FEATURE IS GENUINELY FOR. `$state.raw` is for thousands of items or a value you only ever swap, not one object. A reactive `Set` is for membership-driven UI — liked IDs, selected rows — not a three-item toy. If you cannot name a real situation where a professional reaches for this tool, you do not yet understand it well enough to write the card. Go find out.
- GO BEYOND THE NATIONAL TIMES WHEN THE REAL CASE LIVES ELSEWHERE. The news site is the default world and most features fit it. But some features only bite at a scale or in a shape a news article never shows — performance tools, big data structures, live feeds. For those, reach for another instantly recognisable professional domain: an X-style social feed, a YouTube-style video platform, a large analytics dashboard, a mapping app, a collaborative editor. Fidelity to the real use case beats loyalty to one example world. A correct scenario in the right domain beats a forced one in the news site every time.
- SEARCH ONLINE FOR THE REAL USE CASES, ESPECIALLY THE ADVANCED ONES. When a feature's practical use is non-obvious, advanced, or uncommon — the performance variants, the niche runes, the edge tools — do not guess, and do not settle for the docs' minimal demo. Search the web for how practitioners actually use it: blog posts, the Svelte tutorial's own framing, GitHub discussions, real apps. Take the genuine pattern you find and adapt it to a recognisable situation (an X feed, a YouTube channel) WITHOUT changing the underlying case it fits. You are translating a real pattern into a familiar setting, never inventing a pretend use to dress up a pretty example. Cite what you found on the Source line.

The test for any entry: would a senior engineer reading it nod and say "yes, that is when I would use this"? If instead they would wince at a baby example, the card has failed, however correct its code.

---

ELEGANT SIMPLICITY (THE SIMPLEST FAITHFUL EXAMPLE)

A real scenario is necessary but not sufficient: the code that demonstrates it must be the SIMPLEST faithful version, never a clever one. Cleverness in an example is a bug. If the reader has to trace where a parameter comes from, or unpick a function that returns a function, the example has failed to teach, however correct it is.

Three rules:

- MATCH THE EXAMPLE'S COMPLEXITY TO THE CONCEPT. A scale feature earns a scale scenario (`$state.raw` on a feed of thousands). But a fundamental — pass-by-value, destructuring, the word `this` — deserves the most trivial possible illustration. Do not dress a simple idea in a complicated costume.
- CUT GRATUITOUS INDIRECTION. No function that returns a function, no getter of a getter, no helper whose only job is to obscure, when one plain component shows the idea directly. Prefer one named function and one piece of state over two layers of closures.
- LET THE EXAMPLE REVEAL THE ESSENTIAL LINK. The best example does more than work — it makes the connection between the problem and its solution obvious. A frozen `let message = greet(name)` sitting next to a live `{greet(name)}` shows pass-by-value AND why `$derived` exists, in one glance. Reach for the example that teaches the underlying idea, not just the API.

The cautionary tale, from Q10 (passing state into a function). The first draft followed the docs literally and was incomprehensible. The convoluted version:

```js
function liveLabel(getClaps) {
	return () => formatClaps(getClaps());   // a function returning a function
}
let total = liveLabel(() => claps);          // and a mystery parameter
```

A reader's verdict: "the example is so convoluted, I'm lost — where is `getClaps` coming from?" Rebuilt as the simplest faithful version — one component, one named function, the bug and the fix side by side:

```svelte
<script>
	let name = $state('Ada');
	function greet(who) { return `Hello, ${who}`; }
	let message = greet(name);   // runs once → frozen at "Hello, Ada"
</script>

<button onclick={() => name = 'Grace'}>rename</button>
<p>{message}</p>        <!-- stays "Hello, Ada" — computed once -->
<p>{greet(name)}</p>    <!-- "Hello, Grace" — re-runs on every change -->
```

Same fundamental, opposite outcome. The simple version even teaches more: it shows pass-by-value *and* why a stored computation needs `$derived`, in one glance. When an example confuses, ask whether it is the simplest faithful version, or merely a clever one.

---

THE THEORY TEACHES FROM THE GROUND UP (NEVER ASSUME THE BASICS)

The reader is a capable developer who has forgotten the fundamentals. Years ago they knew React; they dabbled in Vue; both have gone fuzzy. So the THEORY block cannot lean on a word like "proxy", "class instance", or "pass-by-value" as if it were obvious. It must build the idea from ground the reader already stands on, naming and explaining every term as it arrives. This is the same pedagogy as the lecture skill: name it, then explain it; build each concept on the one before. The theory is the one part of the entry you do NOT cut to the bone. Cryptic brevity here is the cardinal sin of this format.

Write each theory as a short arc, four beats:

1. START FROM THE FAMILIAR. Open by recalling, in plain words, the basic idea this problem sits on, even when it feels too basic to bother. Before destructuring a reactive object, remind them: a reactive variable is one Svelte watches so the screen follows it; this one happens to hold an object; an object is just a bundle of labelled values.
2. NAME THE NEW TERM, THEN EXPLAIN IT ON THE SPOT. Never drop jargon bare. Say it, then translate it immediately, in everyday language. "A proxy, which is just a watchful wrapper Svelte puts around the object so it notices every read and write." "An instance, the actual object you get when you stamp one out from the class with `new`."
3. EXPLAIN THE MECHANISM. Say why it works, or why it breaks, in cause-and-effect plain English. Not "destructuring severs the link" but "the moment you destructure, JavaScript copies the value out into a fresh variable, and that copy has no wire back to the original, so when the original changes the copy cannot hear it."
4. LAND ON THE ANSWER. Close on what all of this means for the problem in front of them.

Anticipate the reader's questions and answer them in line, the way a patient teacher does: name a thing, feel the silent "wait, what is that?", and answer it before moving on. It is fine, and often right, for a theory to run a full paragraph, or two short ones, when the idea needs the room. Motivate choices too: do not just say "use a class," say why you would reach for one. What is never acceptable is a clipped sentence that assumes the very term it leans on.

The transformation, from cryptic to lucid. This is the bar for every theory.

CRYPTIC (assumes everything, teaches nothing): "Class instances are not auto-proxied, so you opt in field by field with `$state`."

LUCID (builds from the ground up): "Sometimes, instead of a loose object, you reach for a class. A class is a blueprint for making objects: you describe the shape once, the fields it holds and the actions it can do, then stamp out as many objects from it as you like. Each one you create with `new` is called an instance. The appeal is that a class keeps a thing's data and the functions that act on it together in one tidy package, which suits a draft article that knows how to reset or publish itself. Here is the wrinkle. When you hand `$state` a plain object, Svelte automatically wraps it in a watchful layer called a proxy so it becomes reactive. It deliberately does not do that to a class instance, because a class is a fussier thing, with methods and maybe private fields, and wrapping the whole instance could quietly break them. So Svelte leaves classes alone and asks you to switch on reactivity one field at a time."

Same facts. One teaches; the other only nods at the lesson. Write every theory to the lucid bar. Keep the problem, the map, the files, and the move tight, and let the theory breathe.

---

THE COMPONENT MAP (EVERY ENTRY GETS ONE)

This is the element that makes relationships visible, and it appears in every entry. Before the files, you draw a small ASCII map of the pieces and how they connect. The reader pictures the structure first, then reads the files knowing where each one sits. It is the "boxes inside boxes" idea of the architecture lecture, shrunk to a diagram you can take in at a glance.

Use ONE consistent grammar, with filled glyphs that print cleanly:

- `◼` a COMPONENT — a `.svelte` file, a visible box on the page.
- `▸` a MODULE — a `.svelte.ts` / `.ts` file: a class or shared functions, no markup.
- `●` a POINT INSIDE a component — a notable line or behaviour, not a separate file.
- INDENTATION with `└` / `├` — "lives inside" (a child component), or, when it is not plain nesting, a labelled relationship (`uses`, `imported by`).
- `➔` — the role: what the node owns or does.
- `↓ props` / `↑ events` — communication between a parent and a child component.

Two rules keep it honest. First, only a `.svelte` file is a box (`◼`); a module is a `▸`, never a child component — so when a component imports a module, label the line `uses ▸ ...` or `imported by ◼ ...`, never nest it as if it were a child. Second, do not invent a root that is not in the files (no generic "App"): anchor on the real top node — the parent component, or the module that owns the shared state.

The map scales to the entry. A handful of shapes:

ONE COMPONENT — a single box and what it owns:

```
◼ ArticleCard.svelte ➔ owns article ($state)
```

A COMPONENT WITH POINTS INSIDE IT — notable lines, not sub-components:

```
◼ Greeting.svelte ➔ owns name ($state)
  ● let message = greet(name) ➔ ran once → frozen
  ● {greet(name)} in markup   ➔ re-runs → fresh
```

A COMPONENT THAT USES A MODULE — the relationship is "uses", not parent/child:

```
◼ NewsroomEditor.svelte ➔ new Draft(...) — reads draft.text
  └ uses ▸ draft.svelte.ts ➔ class Draft — each field marked $state
```

A MODULE SHARED BY SEVERAL COMPONENTS — the module owns the state; components import it:

```
▸ session.svelte.ts ➔ owns session ($state) — the logged-in reader
  ├ imported by ◼ Masthead.svelte    ➔ reads session.reader
  └ imported by ◼ CommentForm.svelte ➔ reads session.reader
```

A PARENT AND A CHILD COMPONENT — true nesting, with the communication noted:

```
◼ ArticleCard.svelte ➔ owns claps ($state)
  └ ◼ ClapButton.svelte ➔ gets onclap (callback)
       ↓ props: onclap   ↑ event: child calls onclap → claps++ in the parent
```

For a SvelteKit data-flow or route map, the same spirit applies — files and the flow between them — for example `cookie → hooks.server.ts → +layout.server.ts load → data → +layout.svelte`, or a small `src/routes/` tree.

Keep the map small, monospaced, and honest: a sketch, not a UML diagram, readable in two seconds. Drop dotted leaders; let `➔` carry the annotation even when the columns no longer line up perfectly.

---

SHOW REAL FILES, IN FULL. NO SNIPPETS.

Two hard rules govern the code, and they come straight from the instruction behind this skill.

FIRST: FULL FILES, NAMED, SHORT. Every file in an answer is shown complete, not as a fragment. A complete file the reader can drop into a project and run. Keep each one minimal, trimmed to exactly what the problem needs and nothing more, so "complete" never means "long." Every file wears its name in the fence as `title="..."` (`ArticleCard.svelte`, `session.svelte.ts`, `ClapButton.svelte`), which renders as a tab on the block. The reader must always know which file they are looking at and be able to copy the whole thing.

SECOND: NO SNIPPETS. Do not use Svelte snippets (`{#snippet}` / `{@render}`) in the answers, and never use a snippet to stand in for a component. Component relationships are shown as REAL, SEPARATE `.svelte` files, one fence each, with a map above them. This is the correct model anyway: a `.svelte` file is exactly one component, there is no syntax for two components in one file, and genuine parent-child communication (own `<script>`, own state, props down, callbacks up) lives across separate files. Show it that way, every time. The only place snippets may appear is an entry whose problem is literally about snippets themselves; even then, keep them out of the component-communication entries.

So when a problem involves more than one component, the answer is: a map, then two or three short complete files. Never one file pretending to hold several components. Never a fragment that assumes code you did not show.

---

ANCHOR EVERY PROBLEM IN THE NATIONAL TIMES

The running world is the one the whole course is built on: The National Times, the news organisation at nationaltimes.com, established in the architecture lecture. Use it as the template for every problem. Reach for its concrete furniture:

- The clap count and the clap button on an article card.
- The article object: id, slug, title, section, tags, author, published, body.
- The comment form and comment list, deep in the article page.
- The section navigation (World, Politics, Sports, Culture).
- A draft article in the newsroom, with its checklist.
- The logged-in reader, held in `session.svelte.ts`.

Use the family vocabulary the course runs on: parent and child, sibling, grandparent and grandchild. "The clap button is a child of the article card" is how you locate a component, every time, and it is exactly what the component map draws. When a problem genuinely needs a bare example from the docs (a plain counter, a generic list), frame it as the skeleton of a National Times thing: "this counter is the clap count, stripped to its bones." But National Times is the default, not a cage: when a feature's real use case only appears at a scale or in a domain a news article cannot show (a live feed, thousands of items, a mapping app), step out to another recognisable professional world — see USE REAL, PROFESSIONAL SCENARIOS.

The docs' code stays faithful (see FIDELITY); reconstructed National Times files (a parent/child pair the docs imply but do not spell out) are written minimally, correctly, in idiomatic Svelte 5, and marked reconstructed. The scenario wears the National Times colors; the code is real Svelte.

---

THE CREATIVE EDGE-CASE MANDATE

A digest that only answers the obvious problems is a checklist. What makes this format teach is the layer ON TOP of the core: the edge cases, the curiosities, the "wait, can you even do that?" questions. Pile them on, generously, even when they are tangential, even when no one strictly needs them. A surprising question is a hook that drags the whole concept into long-term memory.

So after you have covered the core problems of a topic, add a tier of creative ones. Be inventive. Push the tool to its corners. For a topic like state or components you might ask:

- "Can I define two components in one `.svelte` file?" (No. One file is one component; show the relationship as separate files.)
- "What happens if I wrap a `Map` in `$state`? Why doesn't it react?"
- "Can a component render itself? How would the comment thread show replies to replies?" (`<svelte:self>` or a self-import.)
- "Can the article card pass a whole chunk of markup down into a child, not just data? What is `children`?"
- "What's the largest article object I can put in `$state` before I should reach for `$state.raw`?"
- "Derived or effect for the '5 min read' label, and how do I even decide?" (The discussion docs' deciding question: are you producing a value, or making something happen?)

Mark these clearly with `🧪 Going further` so the reader knows they are the dessert, not the meal, and can skip them on a fast review and feast on them on a slow one. The core entries are the spine; the edge cases are why the reader keeps coming back. Make at least a few of them genuinely delightful.

---

LEAN ON THE PROBLEM DISCUSSIONS

The discussion documents are not just tone; they are a quarry of ready problems and canonical answers. When a topic overlaps them, reuse their framing and their examples:

- PROPS AND EVENTS: the button-inside-a-counter, here the clap button inside the article card. Parent owns the state, hands the child a callback prop, child calls it. Props down, callbacks up.
- CROSS-PAGE STATE: the logged-in user has TWO distinct answers, and the entry should split them exactly as the discussion does. A `.svelte.ts` `$state` singleton survives client-side navigation but dies on a hard refresh; persistence across refreshes is a different problem the server owns (cookie → hooks → locals → server load → data). Two layers, two maps.
- DERIVED VS EFFECT: the deciding question. Producing a value is `$derived`; making something happen in the world is `$effect`. If an effect only sets state from other state, it wanted to be a derived.
- EFFECT TIMING: post (after the DOM updates, the default) versus pre (before it). You only care when the effect touches the DOM. Measuring final layout needs post; capturing the old DOM before it changes needs pre.
- THE VUE AND REACT BRIDGES: the reader knew both, faintly. Where a one-line comparison sharpens an answer (`$derived` is Vue's `computed`; a `.svelte.ts` composable is Vue's composable, not a React hook, because the body runs once, not every render), include it, labeled. Never drop a framework name without the one line that explains it.

These are starting points, not limits. The discussions cover SvelteKit's thirteen problems; your digest covers one topic in depth, with more problems and more edge cases than they had room for.

---

SOURCE FIDELITY (THE CODE MUST BE TRUE)

Same hard rule as the booklet. Code is exact; a wrong character is a wrong lesson.

- REPRODUCE DOC CODE VERBATIM when you use it. Do not paraphrase, rename, or "tidy." Strip only the docs' tooling directives (`// @filename`, `// ---cut---`, `// @errors`, the `+++...+++` highlight markers), and turn a `/// file:` comment into the fence's `title="..."`.
- RECONSTRUCTED FILES ARE MINIMAL AND CORRECT. When you build a National Times parent/child pair the docs only imply, write the smallest complete, idiomatic Svelte 5 files that solve the problem, and MARK them reconstructed on the Source line. Never invent API or syntax; if unsure of a form, read the source again.
- CITE EVERY ENTRY. Name the source on a `◆ Source` line, so any answer is traceable: a docs file, "reconstructed from the docs' props/events pattern," or "for comparison" for a Vue/React block.
- FILENAMES ON EVERY FENCE. Every code block carries `title="..."`, from the docs' own filename or a sensible decided one. The only skip is a one-line continuation fragment, which this format rarely uses because files are shown whole.

---

COVERAGE: A CURATED DIGEST, NOT NO-CODE-LEFT-BEHIND

This is the sharpest difference from the booklet. The booklet's prime directive is completeness: every snippet in the docs appears. The digest's directive is the opposite discipline: SELECTION. You are digesting, which means choosing.

Cover, in order of priority:

1. THE CORE PROBLEMS. The handful of things every developer must do with this topic.
2. THE CLASSIC TRAPS. The ways it breaks. These make the most reviewable why-did-this-break entries.
3. THE CREATIVE EDGE CASES. The `🧪 Going further` tier, as generous and inventive as you like.

You do NOT mechanically convert every doc snippet into an entry. If two snippets teach the same problem, one entry holds them. Completeness of PROBLEMS, not of snippets. When you cut something the docs show, it is because no real problem hangs on it, not to save space.

---

VOICE: HIGH-VOLTAGE AND DIRECT, TUNED FOR REVIEW

The house style holds: short sentences, plain words, active voice, concrete contrasts, no hedging, jargon explained on the spot. Read the VOICE section of `write_outline_v02.md`; the bar is identical. The digest tunes it for revision:

- THE PROBLEM is tight and vivid, a real situation in one or two sentences. No preamble.
- THE THEORY teaches, so it is the one place to spend words. Build from the basics, define every term on the spot, stay in plain English (see THE THEORY TEACHES FROM THE GROUND UP). Punch still applies sentence by sentence, but never amputate the explanation to look terse.
- THE MOVE is a single memorable line, the kind you could put on a sticky note.

Punch over flow. The reader is scanning, self-testing, moving fast. Write so the eye catches the answer in two seconds, and keep every entry short and to the point.

---

FORMAT: MARKDOWN THAT RENDERS

Same absolute rule as the booklet: PUT A BLANK LINE BETWEEN EVERY BLOCK-LEVEL ELEMENT. A header, a paragraph, a code fence, a bold-labeled line, a list item, each is separated from the next by a blank line, or rendered markdown collapses into a run-on.

The anatomy of a SECTION (a sub-theme grouping several entries):

1. The section header: `## {Sub-theme title}`. Groups related problems.
2. Optionally one short high-voltage line under it, naming what this cluster is about.
3. Then the entries.

The anatomy of an ENTRY:

1. The entry header: `## Q{N} — {the technical question}` — an H2, so each question is its own top-level section. Number entries sequentially across the whole file (Q1, Q2, Q3...), so a reader can say "Q14" and land. The question lives in the header itself, so the deck is scannable by eye.
2. `**⚡ Short answer.**` then the direct verdict (a bold **Yes.** / **No.**, or the key move) plus one or two technical sentences.
3. `**🧠 Theory.**` then the theory prose, built from the ground up.
4. `**🗺 Component map.**` then a fenced ``` block holding the ASCII map.
5. `**📄 The files.**` then one fenced code block per file, each with `title="..."`, in full, blank line between them.
6. `**🔑 The move.**` then the one-line takeaway.
7. Optional `**⚠️ Gotcha.**` and/or `**🧪 Going further.**` lines, each its own block.
8. `**🔁 Quick-fire review.**` then a two-column markdown table (`| Question | Answer |`), 3–5 rows of clear, complete pairs (see THE QUICK-FIRE REVIEW).
9. A source line LAST, at the very foot of the entry: ``**◆ Source:** `02-runes/02-$state.md` `` (or "reconstructed...", or "for comparison"). It is provenance, not teaching — it sits at the bottom of the card, never at the top where it would be noise before the answer.

Hard don'ts: never run labels together without blank lines; never give the source its own header; never let a code fence touch the paragraph above or below it.

---

THE QUICK-FIRE REVIEW (DRILL THE SAME CARD, IN CLEAR PAIRS)

Every entry ends, just above the source line, with a small quick-fire review: a two-column table of question-and-answer pairs that drill the very concept the card just taught. The top-of-file index lets the reader test which topics they know; this table lets them drill the specifics of one. It is active recall — the reader covers the right column with a thumb, reads the question, answers from memory, then reveals.

The rules:

- A TWO-COLUMN TABLE, `| Question | Answer |`, 3 to 5 rows. Tall and narrow, as the table guidance demands. Always include the core fact and the trap; add scope or use-case rows for richer cards.
- CLEAR, COMPLETE STATEMENTS — NEVER CRYPTIC FRAGMENTS. This is the same anti-cryptic bar as the Theory. A stranger reading a single row, with nothing else on the page, must understand both the question and the answer. Roughly one clear sentence per cell, two when a "why" needs it. Concise, but never clipped.
- DRILL THE SAME CONCEPT, ADD NOTHING NEW. The pairs atomize what the card already taught into recall-sized pieces; they never introduce material the entry did not cover. Pattern each table the same way: the core fact or verdict first, then the why, then the fix, then a use-case or boundary.
- KEEP CELLS TABLE-SAFE. Code in backticks is fine; never put a raw `|` inside a cell, and keep each cell to a sentence or two so the table still scans.

The transformation, cryptic to clear, is the whole point:

CRYPTIC (assumes the mechanism, half a thought): "Why won't `$state` proxy a `Set`? — Not a plain object."

CLEAR (stands on its own): "Why does `$state` make objects and arrays reactive, but not a `Set`? — Because `$state` works by wrapping a value in a proxy that watches its fields, and a `Set` stores its items where the proxy can't reach, so changes go unnoticed."

The worked example below carries a quick-fire review table; pattern yours on it.

---

THE QUESTION INDEX (PUT IT AT THE TOP)

Right after the legend and sources, print a QUESTION INDEX: a plain numbered list of every problem in the file, in order, grouped by sub-theme. This is the single most valuable review tool in the digest, because it lets the reader read the problems ALONE, with every answer out of sight, and self-test the whole topic in one pass. It is also the table of contents. Keep each line to the bare question. The reader scans the index, picks the ones they cannot solve, and jumps to those entries.

---

STRUCTURE OF THE OUTPUT FILE

Produce one markdown file per topic, in the `output/svelte/qa` folder, named as the lecture's twin plus a `_qa` suffix: lecture `04_state.md` gets digest `04_state_qa.md`. Always end the filename with `_qa.md`, so the three artifacts (lecture, outline, qa) are never confused. The file contains, in order:

1. A TITLE line: the lecture's exact title, in the form `# NN | Title`, so the three artifacts are triplets sharing one number.
2. A ONE-LINE NOTE, in voice, telling the reader this is the problem-and-answer review companion: read the problem, try to solve it, then check the map and the files.
3. THE LEGEND of symbols.
4. A SOURCES line listing the documentation files this digest draws from, plus the discussion docs where they informed it.
5. THE QUESTION INDEX: every problem, numbered, grouped by sub-theme.
6. THE SECTIONS: optional `##` sub-theme dividers, each followed by its `## Q{N}` entries (both are H2; the index carries the grouping).

Use real markdown with real fenced code blocks and correct language tags throughout.

---

THE SYMBOL AND LABEL SYSTEM (PRINT THE LEGEND AT THE TOP)

- ❓ / `## Q{N}` — a technical question entry (its own H2 section). The number makes it jumpable.
- ◆ Source — the documentation file the code came from (or "reconstructed" / "for comparison").
- ⚡ Short answer — the direct verdict (Yes/No or the key move) plus a one-line technical resolution, before any teaching.
- 🧠 Theory — the full explanation, built from the basics up.
- 🗺 Component map — the ASCII sketch of the files and how they relate.
- 📄 The files — the actual code, one fence per file, each in full with `title="..."`.
- 🔑 The move — the one-line habit to carry away.
- ⚠️ Gotcha — a trap or surprise riding along with the answer.
- 🧪 Going further — a creative edge case or curiosity, the dessert tier.
- 🔁 Quick-fire review — a small table of clear question-and-answer pairs that drill the same card; the reader covers the answer column to self-test.
- title="..." — the filename, inside the code fence, rendered as a tab.

Framework comparison code carries a plain bold label on the line above it: REACT (for comparison), VUE (for comparison).

---

THE WORKED SHAPE (THE EXACT TARGET FOR EVERY ENTRY)

````
## When components need to talk

## Q7 — Events up: the clap button is a child of the article card, but `claps` lives in the card. How does the child trigger `claps++` in the parent?

**⚡ Short answer.** The parent hands the child a function as a prop (`onclap={() => claps++}`), and the child calls it. Data flows down through props; messages flow up by calling a callback the parent owns.

**🧠 Theory.** Two components, each in its own file. The card is the parent, the box that holds the data; the button is its child, a box that sits inside the card. They need to talk, and Svelte gives them two channels. The first is a prop, a value the parent writes onto the child's tag, flowing down. The second is how the child answers back: as one of those props, the parent passes down a function for the child to call. That function is a callback. The child calls it on click, and because the function was written up in the parent, calling it runs the parent's code, here `claps++`. So the child never reaches up to touch the card; it just pulls the string it was handed. (In plain JavaScript you would wire DOM nodes and event-name strings together by hand and re-render yourself; the callback prop replaces all of that.)

**🗺 Component map.**

```
◼ ArticleCard.svelte ➔ owns claps ($state)
  └ ◼ ClapButton.svelte ➔ gets onclap (callback)
       ↓ props: onclap   ↑ event: child calls onclap → claps++ in the parent
```

**📄 The files.**

```svelte title="ArticleCard.svelte"
<script>
	import ClapButton from './ClapButton.svelte';
	let claps = $state(0);
</script>

<article>
	<h2>Ceasefire Talks Collapse</h2>
	<ClapButton onclap={() => claps++} />
	<p>{claps} claps</p>
</article>
```

```svelte title="ClapButton.svelte"
<script>
	let { onclap } = $props();
</script>

<button onclick={onclap}>clap</button>
```

**🔑 The move.** Props down, callbacks up. The child calls a function it was handed; it never reaches up to touch the parent.

**🧪 Going further.** Could both live in one `.svelte` file? No, one file is one component, so you show the relationship as two files and a map. (Snippets reuse markup; they are not separate components with their own state.)

**🔁 Quick-fire review.**

| Question | Answer |
|---|---|
| Where does the `claps` state live, and where does the button live? | `claps` lives in the parent `ArticleCard`; the button is a separate child component, `ClapButton`. |
| How does the child trigger a change in the parent? | The parent passes a function down as a prop (`onclap`), and the child calls it; calling it runs the parent's code. |
| Does the child ever reach up into the parent? | No — it only calls the function it was handed. Data flows down through props, messages up through callbacks. |

**◆ Source:** reconstructed from the docs' props/events pattern
````

That entry has everything: a precise technical question, a Short answer that resolves it before any teaching, a Theory that builds the idea from the ground up, a map you read in two seconds, two real files each shown in full and named, a move you remember, and an edge case that answers the very question a curious reader asks next.

---

FINAL VERIFICATION CHECKLIST (DO NOT SHIP THE DIGEST UNTIL ALL PASS)

1. QUESTIONS PRECISE AND GOAL-FIRST, ANSWERS DIRECT: every question states a real goal the reader has (not a bare syntax pattern), technical and precise — a yes/no conjecture, a sharp how, or a sharp why, in concrete code-level terms. Every entry leads with a `⚡ Short answer` (a bold Yes/No or the key move). The answer opens on the working path; any trap is demoted to a `⚠️ Gotcha` and any compiler internals to a `🧪 Going further`, never the front door.
2. ANCHORED IN A REAL, PROFESSIONAL SCENARIO: every entry shows why/where/when through a use case the feature is genuinely for — no toy examples. The National Times is the default world, with the family vocabulary for components; but step out to an X-style feed, a YouTube-style platform, a large dashboard, etc., when the real case lives there. For advanced or non-obvious features, the realistic case was found by searching, not guessed.
3. STANDS ALONE: each problem is solvable with the theory, map, and files shown; cover them and you can still self-test from the question.
4. THEORY TEACHES FROM THE BASICS: it builds from what a non-expert knows, names and immediately explains every term (no bare "proxy", "class instance", "pass-by-value"), explains the mechanism in cause-and-effect plain English, then lands on the answer. Never cryptic; never assumes the term it leans on. A paragraph is fine when the idea needs it.
5. A MAP EVERY TIME: every entry has a `🗺 Component map`, scaled to the entry (one box, a tree, or a data-flow / route map), small and readable.
6. FULL SHORT FILES: every file is shown complete and minimal, never a fragment, each wearing its `title="..."`.
7. NO SNIPPETS: component relationships are shown as separate real `.svelte` files, never snippets; snippets appear only in an entry explicitly about snippets.
8. FILES REAL AND FAITHFUL: doc code verbatim, reconstructed files minimal and marked, idiomatic Svelte 5, nothing invented.
9. THE MOVE PRESENT: every entry ends on one memorable line.
10. EDGE CASES ON TOP: a `🧪 Going further` tier exists, creative, generous, clearly marked as extra.
11. CURATED, NOT EXHAUSTIVE: coverage is of the problems worth reviewing, core plus traps plus curiosities, not a dump of every doc snippet.
12. CITATION AT THE FOOT: every entry's `◆ Source` line sits at the very end of the entry (provenance, never a header-noise opener), citing the docs file or marked reconstructed / for comparison.
13. FORMAT RENDERS: blank line between every block element; entries are `## Q{N}` headers; labels bold; code fences breathe; no run-ons.
14. VOICE: high-voltage and direct throughout, tuned tight for review, every entry short and to the point.
15. QUESTION INDEX AT TOP: every problem listed, numbered, grouped, so the reader can self-test the whole topic in one pass.
16. NAMING AND STRUCTURE: the file is `output/svelte/qa/NN_topic_qa.md`, twinning the lecture's number and title; legend, sources, and index at the top.
17. QUICK-FIRE REVIEW ON EVERY ENTRY: a `🔁 Quick-fire review` table (two columns, 3–5 rows) sits just above each source line; every cell is a clear, complete, self-contained statement — never a cryptic fragment — drilling the card's own concept.
18. TITLES TIGHT AND TWINNED: each question is one tight question (concept label + concrete failure-or-goal + a real code token, no parenthetical asides), and the index line is the header verbatim.
19. ELEGANT SIMPLICITY: each example is the simplest faithful demonstration — complexity matched to the concept, no gratuitous indirection (no function returning a function, no getter of a getter), chosen to reveal the link between the problem and its solution.

If any check fails, the digest is not done. Problems first. A map every time. Full short files, no snippets. Reviewable, faithful, creative.
