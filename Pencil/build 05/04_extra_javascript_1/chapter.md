# Chapter: How JavaScript Makes Reactivity Possible

The spine: Svelte's `$state` looks like magic — change a variable and the page updates — but it is a stack of plain-JavaScript mechanisms. This chapter builds that stack from the ground up, one section per mechanism, so that by the end the student can see exactly how a reactive framework is "just JavaScript". The throughline question, repeated and answered in stages: **when I read a value, where does it come from — and what if reading it could run code?**

Each section is one self-contained md (and one figure) with the standard fields plus a `## Lecture` that carries the spoken narration AND the book body. Every section's lecture ends on a hook into the next; the frame files carry the global arc.

## Section list (the arc)

- **00-intro** — frame, lecture only. The promise: by the end you will understand `$state` with no magic left. The question that drives everything: how does changing one variable update exactly the right part of the screen?
- **01-prototype** — Own properties first, then inherited. Where an object's values live, and how a read *walks a chain* to find them. Hook: today a read *finds* a value; soon a read will *run* a function.
- **02-closure** — A function keeps its variables alive and private. State that survives the call and can't be touched from outside. Hook: private state is powerful, but it is trapped inside one function — what if many files need the same value?
- **03-module** — A module's state is created once and shared by every importer. One instance, reached only through exported functions. Hook: the value is shared now, but reads and writes are still plain — what if a *read itself* could run code?
- **04-getter** — A getter runs a function every time you read it. The first crack: a plain-looking read that secretly executes. Hook: a getter guards one property you named in advance — what catches a property you didn't name?
- **05-proxy** — A proxy intercepts every read and write through traps. Universal interception: run your code in the gap on *every* access. Hook: now we can run code on every read and write — what is the most useful thing to run there?
- **06-observer** — Track on read, trigger on write. The engine: on a read, record who is asking; on a write, re-run them. Hook: a value that records its readers and re-runs them — that is a reactive value; let's package it.
- **07-reactive-object** — Wrapping a plain object so reads track and writes trigger. Interception + tracking, bundled into a value you can hand around. Hook: this is, almost exactly, what a framework gives you — and what Svelte calls a rune.
- **08-state-dom** — Changing `$state` updates only the nodes that read it. The payoff: the DOM node that read the value is the dependency that re-runs. Hook: no magic left — every piece was plain JavaScript.
- **99-outro** — frame, lecture only. The whole machine, traced end to end in one breath: read → track, write → trigger, and only the readers re-run.

## Outputs (per chapter)
- The PNG/SVG figures per section (Pencil) — the visual template and the reference Gemini needs (`png-gemini/` is populated last, by hand).
- The book PDF (PrinceXML, later) — the figure design with `## Explanation`'s diagram replaced by the section's `## Lecture` prose.
- The audio script — the concatenation of `00-intro` → each section's `## Lecture` → `99-outro`.
