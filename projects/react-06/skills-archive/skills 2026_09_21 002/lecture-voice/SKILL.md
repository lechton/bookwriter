---
name: lecture-voice
description: Governs the voice, stance, narrative flow, and technical-description standard of a production lecture; use when writing or revising lecture prose.
---

# Lecture Voice

This skill governs how a production lecture speaks: the stance the author writes from, the reader the prose serves, the way concepts get defined, the standard for technical descriptions, the shape of sentences, the numbered opening beats, the callouts, and the vocabulary. It applies to every sentence of lecture prose, from the first opening beat to the last line of the summary. Structural rules such as section skeletons, tables, and code-block architecture live elsewhere, so see the lecture-structure skill for those.

Digests: skills/old-instructions/instructions.md (stance, empathy, lexical audit, lecture format, opening ladder, callouts)

## Stance | 01 | Developer-at-the-Keyboard

[ ] Write from the perspective of the developer sitting at the keyboard, feeling instructed and guided personally, step by step, so the reader recognizes their own screen and their own files in every paragraph.
[ ] Avoid the engine-voice trap: writing from the perspective of the React internal engine, treating technical terms as disembodied Platonic forms communicating in the abstract, or reciting internal compiler specifications, because the reader cannot point at any of it in their own code.
[ ] Treat technical terms as tools, not Platonic ideals: prefer explaining a feature through what physically appears in the reader's code over naming an internal API (like `startTransition`) that never shows up there.
[ ] Avoid corporate brochure bureaucrat-speak (like "React fundamentally alters its submission runtime across four core guarantees"), because it announces a product instead of teaching a person.
[ ] Open the first section of the lecture by immediately expanding the Opening Ladder's real-world application problem (e.g. subscriber data appearing in ten independent widgets across The National Times). Ground the reader in the tangible engineering pain before introducing framework or browser mechanics. Avoid generic CS 101 textbook preamble (such as "In plain web development, a webpage is an HTML document loaded into browser memory..."). #2026_09_20_27_group_1
[ ] Ground paradigm shifts in vivid, intuitive physical metaphors alongside concrete code (such as comparing imperative scripting to a passenger giving turn-by-turn driving directions where a single missed turn gets you lost, versus declarative programming where you provide the destination address and the engine navigates). A strong metaphor gives the reader an instant mental model that anchors the code. #2026_09_20_27_group_1

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> When a Promise settles, the Transition wraps the Execution Boundary inside the Priority Lane.

Notes: It speaks from inside the engine, in invented capitalized abstractions, and not one word of it appears in the reader's editor. The tired reader has nothing to point at and nothing to type.

[ ] PROPER EXAMPLE: make sure you follow this example, prose written from the keyboard:

> You write `useActionState` once, at the top of your component. From that line down, the loading flag, the error message, and the form data all live in one place, and you delete the three `useState` hooks you used to juggle.

Notes: Every clause is something the developer types, deletes, or sees on screen. The term is a tool the reader picks up, not a form they contemplate.

## Stance | 02 | Empathy without narration

[ ] Before writing a section, answer three planning questions in your head: what is changing for the developer, what will surprise them or look weird, and what words might confuse them.
[ ] Remind the reader how the problem used to be solved before showing what the new feature makes easier, so the change has a before to stand against.
[ ] Address the strange parts directly in the prose before the reader gets confused, for example noting the missing `e.preventDefault()` and explaining why it is gone, so surprise is discharged the moment it appears.
[ ] Keep the three planning questions strictly internal thinking tools: avoid printing labels like "1. Novelty:", "2. Weirdness:", or "Cognitive Inference" into the lecture text, and speak naturally and directly about the reader's code, their screen, and what happens when they click or type.

## Reader | 03 | Write for a tired reader: short sentences, simple words

[ ] Write for a person reading plain upper-intermediate English (CEFR B2), at the end of the day, tired, with a mild headache, giving the page one chance.
[ ] Verbally qualify every entity with its architectural role ("the component `ComponentName`" vs "the component `<ComponentName />`", "the prop `propName`", "the `<span>` element", "the property `author.name`"); never drop bare, unqualified tokens that force the reader to calculate what is what, and strictly ban splitting compound identifiers with spaces (`avatar Url`). #2026_09_20_23_group_1
[ ] Keep paragraphs cohesive and focused (typically 2 to 4 sentences), grouping related thoughts together rather than chopping them into disjointed fragments. #2026_09_20_27_group_1
[ ] Bold key terms on their first introduction, but only when they represent real, standard React or web platform concepts, so the tired eye can find the load-bearing words again later.
[ ] Serve zero content degradation: the tired reader still expects thorough, complete, interview-winning technical depth, so simplify the language, never the substance.

## Reader | 04 | The universal everyday paradigm

[ ] Draw scenarios, components, props, and routes from everyday universal situations known to every developer worldwide (breaking news, store products, weather widgets, user profiles), so no reader needs domain knowledge to enter the scene.
[ ] Avoid domain-specific political, voting, administrative, or archaic words (tallies, precincts, ballots, booths, caucus), because they force the reader to translate before they can picture.
[ ] Prefer the most common English words, the vocabulary of plain upper-intermediate English; treat a rarer word as a defect to replace with an everyday one.

## Definitions | 05 | The three-part explanation (what you write, what manual work it removes, what the browser does)

[ ] Anchor every runtime concept in the three-part explanation: what you write, what manual work it removes, and what the browser does.
[ ] State the concrete keystrokes typed into the file, so the concept has a physical home the reader can open.
[ ] Name the manual boilerplate the reader gets to delete, explicitly contrasting with painful patterns like manual `useState` keystroke tracking, `e.preventDefault()`, and `try / finally` loading flags, so the value is felt as relief.
[ ] Describe the physical browser behavior (the UI stays clickable during network requests, inputs reset automatically, buttons read submission state without prop drilling), so the payoff is visible rather than promised.

## Definitions | 06 | Avoid compressed academic definitions

[ ] Avoid defining React concepts with compressed academic dictionary syntax (like "Generating dynamic HTML on a server per incoming request"), because the reader memorizes words and points at nothing.
[ ] Define through concrete physical runtime behavior instead: what runs, what moves across the network, and what the user sees on screen.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> Server-side rendering: generating dynamic HTML on a server per incoming request.

Notes: It connects words to words. Nothing runs, nothing moves, and the reader cannot point at a file, a request, or a pixel.

[ ] PROPER EXAMPLE: make sure you follow this example, a definition through runtime behavior:

> With server-side rendering, your component runs on the server. It returns HTML. The server sends that HTML to the browser, and the reader sees your article text before any JavaScript has loaded.

Notes: Three short sentences, each one a physical event: code runs, HTML travels, the reader sees text. The term now has a body.

## Definitions | 07 | The experience standard

[ ] Define a new concept through experience first: what the reader can see, open, or has already done; a definition through other words may follow as a short summary, and it never leads.
[ ] Start from the closest known action: find the nearest thing the reader has already done in this course, and teach the new concept as that action plus one change.
[ ] When the concept is visible in code, let the definition be its shape: your files so far contained A, this file also contains B, one extra thing placed there; without it the problem you just watched, with it what changes.
[ ] When the new part is the topic, make it the headline: say plainly in the first section that your file grows a new part today, and let the story and the example demonstrate the part rather than replace it.
[ ] After every definition run the check: can the reader point at a file, a folder, a line of code, or a thing on the screen and say what it does; if it only connects words to words, rewrite it.

[ ] PROPER EXAMPLE: make sure you follow this example, a definition through experience:

> In your files you have functions whose names start with a capital letter and whose return is JSX. Open one: it receives props, it returns markup, the app renders it. Those functions are React components.

Notes: The reader opens a file they already own, points at a function they already wrote, and the term names the thing under their finger.

## Definitions | 08 | The one thing

[ ] Find the one thing before writing anything: the single concrete change that carries the whole concept, one line written differently, one prop added, one file created, one call made.
[ ] Aim for the smallest complete form of the concept: the thing the reader could rebuild from memory when every other sentence is gone.
[ ] Show the one thing early and alone, clean, with nothing competing beside it, then let mechanism, contrast, and story explain what stands around it.
[ ] Give every concept a concrete form, even the invisible ones: a hook call is a thing in a file, a directive is a line at the top of a file, an external module is a thing in a folder, so the abstract is explained from the concrete, never instead of it.
[ ] Run the test on the one thing: say it as one visible change; if you need a paragraph, keep cutting until one line is left.

## Definitions | 09 | The question the reader is already asking

[ ] Move from concrete to abstract through the reader's own question: they already know the old way from earlier lessons, and the moment they see the one thing, that knowledge fires "Why this? We already have a way to do this."
[ ] Ask that question out loud, in the reader's words, at the exact moment the reader thinks it, then answer it.
[ ] Treat every step toward the abstract as the answer to a live question; an abstraction that answers no live question teaches nothing, so cut it or find the question it should answer.

## Definitions | 10 | The default and the law #2026_09_20_03_group_1

[ ] Define every load-bearing concept with two sentences beyond its wiring and its runtime cost: the default sentence and the law sentence, because wiring answers how the thing is built, the runtime loop answers what it costs, and only these two sentences answer who was in charge before and what is forbidden now.
[ ] Introduce load-bearing concepts organically through narrative context, problem contrast, and natural cause-and-effect flow. Avoid formulaic self-interrogations (such as repeatedly inserting "What is imperative programming?" or "What is a component?" into body paragraphs). Let the narrative headline the concept naturally. When a rhetorical question is used, reserve it for genuine reader skepticism ("Why this?") rather than mechanical definition headers. #2026_09_20_03_group_1 revised by #2026_09_20_27_group_1
[ ] Name both sides of the ownership contrast in the same breath, each defined by who controls it, using the standard community terms for both sides (the **controlled input**, controlled by React, and the **uncontrolled input**, controlled by the browser); when a plain-English alias must come first because the standard term presupposes the concept being taught, bridge to the standard term at its first later appearance, so the alias is a ladder and never a substitute.
[ ] Write the default sentence first: what the world does with zero of your code, grounded in the developer's concrete workflow or application reality rather than abstract platform preambles. For anything that exists in the web platform (an input, a form, an event, a navigation), the default is the native element governing itself with no JavaScript involved. For a React-only concept, the default is its nearest plain-world counterpart: the ordinary variable that forgets, the manual DOM rewrite, the copy-pasted template. #2026_09_20_03_group_1 revised by #2026_09_20_27_group_1
[ ] Narrate the default and the takeover as the reader's own habitual acts, never as detached facts about the world: when you type a letter, when you define an ordinary variable, and then the same habit performed differently (when you define the variable through `useState`, you write `<input value={state} onChange={...} />`), so the reader stands in their own habit and watches it diverge (see Stance 01, Developer-at-the-Keyboard).
[ ] State the default sentence in plain prose before the React version of the concept, so the React pattern reads as a departure from the plain world rather than as technique number one; never park the baseline inside a later section as a surprise.
[ ] Close the definition with the law sentence: one quotable invariant that names who dictates and what is now impossible, carrying an only, cannot, never, or always. The law sentence is the identity of the concept; a reader who forgets the wiring and the cost still owns the concept if they keep the law.
[ ] Give the law a plain-prose home: when an allegory card (WILD or KEY) carries the default or the law, the same sentences must also exist in the section body in plain words, because the card is the hook and never the home of a definition.
[ ] Run the cover test on every definition paragraph: cover the wiring and the runtime loop, and check that the reader can still say who was in charge before the concept and what is forbidden after it; if neither survives the cover, rewrite the paragraph.

[ ] PROPER EXAMPLE: make sure you follow this example, a platform concept defined by its default and its law:

> What is a **controlled input**? React draws the line between two kinds of input: the **controlled input**, controlled by React, and the **uncontrolled input**, controlled by the browser. In normal HTML, an input controls itself: when you type a letter, the browser's native engine directly stores that letter and paints it on screen, and no JavaScript needs to be involved. Leave the input in that state and React calls it an **uncontrolled input**. In a controlled input, you take that power away from the browser: you write `<input value={state} onChange={...} />`. The input is now locked: it can only display whatever the state variable holds, and React dictates every single character shown on screen.

Notes: the question makes the term the headline before any machinery appears, the contrast names both sides by who controls them using the standard terms, the default sentence narrates the reader's typing habit in the plain web world with zero code, the takeover is one line of code, and the law sentence closes (locked, only what state holds, React dictates every character). The wiring details and the per-keystroke re-render cost can follow; the concept's identity no longer depends on them.

[ ] PROPER EXAMPLE: make sure you follow this example, the same two sentences on a React-only concept:

> What is `useState`? When you define an ordinary variable inside your component, the variable forgets everything the moment the function finishes running: type a letter, and the next render rebuilds the variable from scratch. Instead, when you define the variable through `useState`, the hook gives the component a private memory that survives every render. The setter it returns is the only door to that memory: reading the variable gives you the value for the current render, and only calling the setter asks React for the next one. In web development, a variable that automatically drives the screen when it changes is often called a reactive variable, and that reactivity is where React got its name; React's own documentation simply calls it state.

Notes: the definition never states a fact about the world; it opens on the reader's own habit (when you define an ordinary variable), then performs the same habit differently (when you define the variable through useState), a ladder any junior developer can trace. The law names the only door and the snapshot rule, so the concept is owned before any wiring example appears. The reactive-variable line lands after the law as dual-canon color: the industry term, the official React term (state), and the reason React carries its name.

[ ] HALF WAY EXAMPLE: do not follow this example, a partial fix that looks improved and is still not allowed:

> In a controlled input, you bind the input's `value` attribute to a React state variable and attach an `onChange` listener to update that state on every keystroke. Type h-e-l-l-o into that field one letter at a time, and every single keypress dispatches an event, updates state, wakes the React fiber reconciler, executes the component function again, recomputes the virtual DOM, and pushes the updated string back into the DOM node.

Notes: the wiring is accurate and the runtime loop is vivid, but the paragraph never opens with the term as the headline, never says who governed the input before React arrived, and never states the lock; the reader learns how the pattern is built and what it costs, and still cannot say what makes it controlled.

[ ] COUNTER-EXAMPLE: do not follow this bad example, a compressed dictionary line with no world and no law:

> Controlled input: an input element whose value is bound to component state.

Notes: it connects words to words; nothing runs, nobody governs, nothing is forbidden, and the tired reader memorizes a sentence they cannot use.

## Technical Explanations | 11 | Every technical description ends in a consequence

[ ] When you explain a technical thing (a file, a command, a config), never stop at what it contains or what it is; always end with what it changes for the developer or for the user.
[ ] Cut or complete every sentence that only names and describes: a sentence that only names and describes is an inventory entry, and an inventory entry never ships.
[ ] Treat the consequence as the meaning, not decoration: it completes the three-part explanation, because the third part (what happens physically) is the reason the other two exist.

[ ] COUNTER-EXAMPLE: do not follow this bad example, an accurate description with zero meaning:

> package.json: The project manifest holding two separate dependency lists. The dependencies list contains react and react-dom, which the browser needs to execute the application. The devDependencies list contains vite and @vitejs/plugin-react, which the computer needs to compile and serve the project locally. The file also defines runnable scripts such as npm run dev and...

Notes: accurate, and useless. It says what each list contains, and it never says what the split changes. The reader cannot do anything new after reading it, and cannot understand anything new. It is an X-ray: true, and empty.

## Technical Explanations | 12 | Parallel items get lettered anchors in the fixed four-part shape

[ ] When one paragraph explains two or more parallel things, give each one a lettered anchor: (a), (b), (c); never chain them into long clauses.
[ ] Build each anchor in the fixed four-part shape, always in this order:
[ ] the kind-name: the everyday name of the thing, with the exact technical term in brackets
[ ] the short reminder: one clause that reminds the reader what this kind is, never longer than one clause
[ ] the contents: what is actually inside it
[ ] the consequence: what this changes for the developer or the user, closing the anchor
[ ] Close every anchor on its consequence, so no anchor ends as an inventory entry with letters.
[ ] Keep lettered anchors distinct from banned meta-labels: (a) and (b) as visible anchors for parallel items are reader-facing prose and required, while planning labels like "Part (a): Novelty" stay invisible per the empathy law.

[ ] HALF WAY EXAMPLE: a partial fix that is still not allowed, anchors without meaning:

> package.json: The project manifest holding two separate dependency lists: (a) the dependencies list contains react and react-dom, which the browser needs to execute the application. (b) The devDependencies list contains vite and @vitejs/plugin-react, which the computer needs to compile and serve the project locally...

Notes: better than the X-ray, and still not allowed. The anchors hold the two lists apart, which is good. But there is no kind-name, no reminder, and no consequence. It is still an inventory, only with letters.

[ ] PROPER EXAMPLE: make sure you follow this example, the full four-part standard:

> `package.json` is the project manifest, and it holds two separate lists. (a) The runtime dependencies (`dependencies`) are the packages the application needs while it runs: `react` and `react-dom`. The browser loads these when a reader opens the page, so these are the only packages your readers ever download. (b) The development dependencies (`devDependencies`) are the packages your computer needs while you build and serve the project: `vite` and `@vitejs/plugin-react`. They run on your machine, and they never ship to the browser. The split is the point: the build tools stay on your machine, so what the browser loads stays small. The manifest also defines runnable scripts: `npm run dev` starts the development server, and `npm run build` produces the production files.

Notes: each anchor runs kind-name, reminder, contents, consequence. Anchor (a) names the kind (runtime dependencies), reminds what it is (packages the application needs while it runs), lists the contents (react and react-dom), and closes on the consequence (these are the only packages your readers ever download). The paragraph then states the meaning of the whole split: the browser loads less.

## Sentences | 13 | The sentence standard: 20-word cap and one idea per sentence

[ ] Cap individual sentences at 20 words and ban clause chaining. When an explanation combines a contrast, a reason, and a consequence, break them into separate, active sentences of 7 to 15 words so each thought lands before the next begins. #2026_09_20_21_group_1
[ ] Limit each sentence to one technical mechanism or action, so the reader processes one idea before the next one arrives.
[ ] Prefer direct Subject-Verb-Object structures, because the tired reader parses them on the first pass.
[ ] Use clean vertical bullets or sequential short sentences for multi-feature lists, so no list hides three unexplained systems in one line.

[ ] COUNTER-EXAMPLE: do not chain multiple clauses into a single sentence:

> Instead of the reserved JavaScript keyword `class`, it assigns `className`, adhering strictly to JSX naming conventions while mapping directly to the DOM property.

Notes: 23 words across four chained clauses (a contrast, a main action, a participial phrase, and a subordinate clause). In print, this causes mid-word hyphenations ("el-ement", "con-ventions") and forces the tired reader to hold three distinct thoughts in memory before reaching a period.

[ ] PROPER EXAMPLE: make sure you break chained thoughts into single-idea sentences:

> Notice the attribute: it uses `className` instead of `class`. In JavaScript, `class` is a reserved keyword. React uses `className` to avoid that conflict and map directly to the browser's native DOM property.

Notes: Three short, active sentences (7, 7, and 15 words). The contrast lands first, the reason lands second, and the engine consequence lands third. Zero hyphenations, zero breathlessness, effortless to read.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> When a user submits the form, React intercepts the native submit event automatically, gathers all contained inputs that declare a name attribute into a native browser FormData instance, and passes that dictionary directly to the action function.

Notes: Four conceptual stages compressed into one breathless comma-spliced sentence. The reader loses the thread at the second clause and never reaches the action function.

[ ] PROPER EXAMPLE: make sure you follow this example, the same mechanism in lucid steps:

> A form may consist of one or more input fields receiving data from the user, assigning the content of each input text in an attribute named `name`. When a user submits the form, React intercepts the native submit event automatically. The named fields from the various inputs all get collected into a native browser `FormData` dictionary. This dictionary then gets passed directly to the action function.

Notes: One idea per sentence: the physical basics first, the trigger second, the data collection third, the handoff fourth. Each sentence reads like clear water.

## Sentences | 14 | Practical developer reality

[ ] Write from the practical developer's lived experience, addressing natural developer questions (such as why an API behaves a certain way, when the engine updates, or what failure is prevented) and grounding the explanation in concrete browser and keyboard reality. #2026_09_20_30_group_1
[ ] Avoid grandiose decrees about universal physical laws (like "Developers never author `e.preventDefault()`"), because you are describing lived experience, not legislating the universe.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> Developers never author `e.preventDefault()`. React prevents full-page document reloads natively while preserving standard keyboard interactions like pressing Enter to submit.

Notes: It reads as an arrogant universe law, and it skips the human question that would make it stick.

[ ] PROPER EXAMPLE: make sure you follow this example, the same fact with its why:

> Developers never need to write `e.preventDefault()` anymore. Why? React now prevents full-page document reloads automatically when handling form actions. At the same time, standard keyboard interactions are preserved: the user, for example, can press Enter to submit without any problem.

Notes: The fact is grounded in a question the reader would actually ask, and the answer names the physical browser behavior. The spoken Why? earns its place by following a claim the reader genuinely doubts; where several claims cluster, let all but one answer themselves as plain Because-clauses. #2026_09_20_12_group_1

## Sentences | 15 | Avoid self-narration

[ ] Avoid announcing to the reader what you are doing (like "To answer this question immediately..." or "In this section we will..."), because self-narration wastes the reader's one chance on the narrator instead of the content.
[ ] State facts, mechanisms, and physical consequences directly, and let the section structure do the orienting.

## Opening | 16 | The interview-question line

[ ] Place the `> INTERVIEW QUESTION | ...` line as line 2 of the lecture file, immediately after the `# Lecture {n}: ...` heading with no blank line between them, followed by one blank line before the body.
[ ] Use the exact pattern: a markdown blockquote, the literal token `INTERVIEW QUESTION`, a space, a vertical bar, a space, the curriculum typology (`❱ CORE`, `❱❱ MORE`, or `❱❱❱ ADVANCED`, each optionally followed by ` (Server)` for Q101 to Q180), a vertical bar, a space, then the question text.
[ ] Include the line in every lecture, because if it is missing the build renders the lecture without the callout and the visual anchor is silently gone.

[ ] PROPER EXAMPLE: make sure you follow this example, the exact callout pattern:

> `> INTERVIEW QUESTION | ❱ CORE | Why do ordinary variables forget their values between renders, and how does useState remember?`

Notes: Verbatim shape: the `>` prefix, the literal token, the bar, the typology tag, the bar, the question. To change the question, edit this single line; the build reads only from it.

## Opening | 17 | The numbered opening beats

[ ] Open the body with exactly 7 numbered beats: (1) Scene, (2) Setup, (3) the surprising action, (4) Question, (5) Danger, (6) Mystery, (7) Promise.
[ ] Write each beat as one continuous markdown line, one idea per line, with no sentence over 20 words, aiming for absolute clarity rather than cryptic telegraphic riddles.
[ ] Use numbers, not bullets, because the beats are an ordered escalation and a number promises a next one; that forward pull is the whole point.
[ ] Keep the opening beats' scene in the same world as the question bank's hook column and the lecture body, with no context switching; the course's running world is The National Times newsroom.
[ ] Write only the numbered beats yourself: the lead sentence ("Imagine this scenario:") and the wrapper are the build's job, so never hand-write the lead or wrap the beats in a div.
[ ] Present the numbered opening beats bare, directly under the Interview Question box, with no "Intro" heading or extra chrome, and let the first `### ` section arrive immediately after the last beat.

[ ] PROPER EXAMPLE: make sure you follow this example, opening beats where every noun has one identity:

> `1. You built a news website called The National Times, and real readers are using it right now.`
> `2. A journalist types a new headline into the page and saves it.`
> `3. Your code has one job: print the headline to the console every time it changes.`
> `4. Why does the code print only once?`
> `5. Readers keep seeing the wrong headline.`
> `6. Something in your code read the headline once, then stopped looking.`
> `7. Today, the print will follow every change.`

Notes: One actor, one screen, one line of code, one observable mystery, and a promise that does not explain. A tired reader cannot misread a single beat.

[ ] COUNTER-EXAMPLE: do not follow this bad example, opening beats where every noun has two readings:

> `1. The newsroom desk is live.`
> `2. An editor rewrites the breaking headline.`
> `3. You log the headline at the top of the script.`
> `4. Why only one print?`

Notes: "Desk" could be furniture, a team, or a component. "Live" could mean on air, deployed, or running. "Editor" could be the site visitor or VS Code. "Log" could be a verb, a file, or firewood. Every beat carries a double reading, and the tired reader takes the wrong one.

## Opening | 18 | Opening-beat clarity for the tired reader

[ ] Fix the reader in your mind before writing one beat: an upper-intermediate reader, at the end of the day, with a mild headache, giving the page one chance; the beats are the reader's first contact with the topic, so they must be the clearest sentences in the entire lecture.
[ ] Apply the identity test: every noun in every beat is exactly one of four things and only one, a person, something visible on the screen, something in the code, or a machine event; a noun that can be read as two of these fails the beat.
[ ] Replace overloaded words with the concrete observable thing: "editor" (write "the journalist" or "your code editor, the program"), "live" (write "the site is open in the reader's browser right now"), "script" (name it in full or cut it), "log" (write "print it to the console").
[ ] Treat mechanism vocabulary in disguise as naming: words like "state", "props", "hook", "render", "mount", "hydrate", "trigger", "store", "re-render", "reconcile", "commit", and "memoize" are the mechanism by another door, so write the visible behavior instead ("the page keeps showing the old headline").
[ ] Prefer everyday verbs over their technical twins: "change" over "mutate", "show" over "render", "save" over "persist", "old" over "stale", "follow" over "propagate".
[ ] Keep every person named with an unambiguous human word ("a journalist types a new headline"), every program with its full name, every screen thing with its place, and every code thing with its shape.
[ ] Make each beat readable alone and out of order, with no pronoun that has two possible owners.

## Opening | 19 | The opening beats hold the mechanism back

[ ] Keep the mechanism term out of the opening beats: no hook names, no API doing the reveal, no "the answer is", because the beats pose and the body answers, and the term is earned where the lecture body builds it.
[ ] End the beats on the mystery or the promise, never on the answer; the closing beat may promise what today brings in plain words, and it may not answer the question the beats posed.
[ ] Avoid narrative bloat before the problem begins: one actor taking one action beats a login, a navigation, and a settings page before the story starts.

[ ] COUNTER-EXAMPLE: do not follow this bad example, a promise beat that spends the tension early:

> `7. Today you learn how React's declarative component model eliminates manual DOM queries and keeps your entire user interface synchronized automatically.`

Notes: It names the mechanism ("declarative component model") and explains the answer one beat early, so the body has nothing left to reveal and the ladder has no mystery left to pull the reader forward.

## Opening | 20 | Opening-beat logic before the break

[ ] State the logic of every value the opening beats turn into a problem before it breaks: the reader must be told what the number computes, from what inputs, and why anyone cares, because they cannot fear the loss of a number whose meaning was never given.
[ ] Use the two-beat pattern for value logic: the introducing beat carries the explanatory sentence with the business rule ("The paper pays by the word"), and the very next beat repeats that rule attached to the on-screen value ("That total counts the words of every story, because the paper pays by the word").
[ ] Show the change before the stale screen: the event that should have moved the number gets its own beat ahead of the break, so the "why" beat points at a cause the reader just watched.
[ ] Unpack technical shorthand into operations the reader can picture: not "a loop over every story, plus a safety check for broken records" but "visit every story, add its words, skip any story with no word count".
[ ] Restate taught terms in the beat where they appear ("a derived value, a number computed from other data"), and earn every "does not fit" wall as a chain: the kind of value, what makes this one harder, and only then the wall.

## Callouts | 21 | Alert callout types

[ ] Use GitHub-style alert callouts, opening with `> [!TYPE]` on its own line and the body on the following `>` lines, rendered as a styled box with an eyebrow label.
[ ] Use the five supported types exactly: `[!TIP]` for interview-strategy guidance (the default, eyebrow "Interview Tip"), `[!NOTE]` for neutral asides, `[!KEY]` for insider allegories and key takeaways, `[!WARNING]` for real pitfalls, `[!CAUTION]` for destructive or breaking actions, and `[!WILD]` for the real-world friction card.
[ ] Prefer `[!TIP]` as the on-brand default for framing advice, since every lecture is interview prep; reach for NOTE, WARNING, or CAUTION when the content genuinely fits one of those tones.
[ ] Reserve `[!KEY]` for the kind of sentence that earns its own box: allegories that map the unfamiliar onto the familiar, the exact mechanism a senior engineer would point to, or the one sentence that makes the rest of the lecture click into place; avoid spending it on routine "remember to..." notes.

[ ] PROPER EXAMPLE: make sure you follow this example, the signature TIP shape:

> ```markdown
> > [!TIP]
> > **To impress the interviewer:** Most candidates will say "React re-renders the component when state changes." If you want to show deep understanding, explain the snapshot model: the setter does not change the variable in the running code, it asks React to render again with a new value.
> ```

Notes: The marker line, then a body that opens with a bold lead-in naming what kind of tip it is. The advice frames how to answer, and the mechanism stays in the lecture prose.

## Callouts | 22 | Callout authoring rules

[ ] Let each callout carry a single, self-contained tip; if there are three tips, write three callouts, so no box crams a bulleted list into one frame.
[ ] Keep the body to a short paragraph of full markdown (bold, italic, inline code all work), and place code examples in an adjacent code block rather than inside the callout.
[ ] Lead the body with a bold lead-in (`**To impress the interviewer:**` or `**Common mistake:**`) so the reader knows what kind of tip it is before reaching the explanation; the KEY allegory is the exception, since its single bare sentence is the takeaway.
[ ] Place callouts inline at the moment the tip matters, right after the section that establishes the concept, rather than banking them at the end where they lose their context.
[ ] Avoid substituting a callout for the lecture's actual content: the callout carries framing advice about how to talk about the concept, while the mechanism itself belongs in the prose and code blocks, so a lecture full of callouts and thin on explanation has failed its job.

## Callouts | 23 | The IN THE WILD friction card

[ ] Use `[!WILD]` (rendered as the signature "⚡ IN THE WILD" real-world friction card) to isolate the student's single most common counter-intuitive confusion point and discharge it with an immediate aha moment.
[ ] Open the WILD body with a short, catchy, bold leading question of 6 to 9 words with zero syntax clutter, so the card hooks before it teaches.
[ ] Maintain tactile conversational familiarity ("Can you imagine...", "Remember the blinking cursor...?") and take the reader by the hand with intentional repetition, so the confusion is walked through rather than corrected.
[ ] Bold every clarified key term inside the WILD body (`**imperative**`, `**declarative**`, `**physical DOM**`, `**virtual DOM**`), and keep technical trivia and method names out of the body, so the card cuts with razor-sharp points instead of drowning in API names.
[ ] Keep to exactly one WILD card per major technical section, so each card stays an event instead of wallpaper.

[ ] COUNTER-EXAMPLE: do not follow this bad example, a WILD card that teaches instead of discharging friction:

> [!WILD]
> **When do you actually need a full-stack framework?** Imagine The National Times publishing breaking investigative reports. Millions of readers search for headlines on Google, and search engine web crawlers index the articles. If your application relies entirely on **client-side rendering**, the crawler receives an empty HTML shell and must execute heavy JavaScript bundles before seeing any words. This delay damages search rankings. Now consider the newsroom's internal editorial desk, where staff journalists review story drafts. Search engines never visit this page, and no public indexing exists. Forcing this internal tool into a complex **full-stack framework** adds server deployment costs, container management, and operational friction for zero business benefit. This contrast is why you must understand the architecture: choose **server-side rendering** through a framework when public discoverability matters, and choose a focused **build tool** when building client dashboards and interactive tools.

Notes: It answers a curriculum question, not a friction point. There is no aha. The reader never feels a wall and then relief. It bolds four terms and lists operational trivia, so it drowns instead of cutting. Three sentences break the 20-word cap. The 32-word closing is a clause-chained summary, not a friction discharge.

[ ] PROPER EXAMPLE: make sure you follow this example, a WILD card that isolates one friction and discharges it with an aha:

> [!WILD]
> **When does submitting a form wipe your screen?** In the early web, a form submit was a navigation command. It requested a new HTML page from the server and wiped the browser's memory clean. When single-page applications arrived, developers added `e.preventDefault()` inside every submit listener to halt that navigation. Forgetting that single line caused a **full-page reload**. All client state in memory vanished instantly. Developers never need to write `e.preventDefault()` anymore. Why? React now prevents the **full-page reload** automatically when handling form actions.

Notes: The opening question is 7 words and names a visceral friction. The reader feels the pain before the relief arrives. The "Why?" voices the reader's own question at the exact moment they think it. Two bold terms, both the same concept repeated. Zero trivia. Every sentence is under 20 words. The card stops at the aha and does not drift into action functions or uncontrolled inputs.

[ ] PROPER EXAMPLE: make sure you follow this example, a WILD card that uses a physical metaphor to discharge the friction:

> [!WILD]
> **Why does useFormStatus require a child component?** Imagine a reader standing in a hallway, trying to read a status badge mounted on the inside of a room. From the hallway, they cannot see it. They must step inside the room and look up at the board. That is how **useFormStatus** works. It is an **internal sensor** that only reads the form from inside. If you call it in the component that creates the form, it finds no form above itself. Pending stays permanently false. You must call it from a child nested inside the form.

Notes: The opening question is 7 words and names a genuine confusion point. The physical metaphor gives the reader an instant mental model. The aha lands through the metaphor: you cannot see the board from the hallway, so the component cannot see the form from outside. Two bold terms: the hook and the metaphor. Every sentence is under 20 words. The card stops at the lesson and does not drift into wiring details.

## Callouts | 24 | Repeat and emphasize the important statements

[ ] State an important allegory or insider takeaway twice, in two registers: first as the punchy `[!KEY]` callout (the compressed form a reader can quote), then again, expanded, in the prose immediately following (the unpacked form that explains why the allegory holds).
[ ] Pair the two registers deliberately: the compressed line earns the box and a reader can carry it away in one read; the paragraph earns understanding by walking the analogy through so the reader sees the mapping.
[ ] Avoid the half-treatments: putting the callout in without the unpacking, or unpacking an idea in prose without giving its load-bearing line a `[!KEY]` callout to live in.

[ ] PROPER EXAMPLE: make sure you follow this example, the same truth in both registers:

> ```markdown
> > [!KEY]
> > The render is a photograph, not a film.
>
> When your component function runs, it does not stream changes to the screen as it goes. It computes one complete picture of the UI for the current state, hands it to React, and finishes. That is why reading a state variable after setting it shows the old value: the variable in the running photo belongs to the photo, not to the next one.
> ```

Notes: The callout and the paragraph say the same thing on purpose. The box is the hook the student repeats before the interview; the paragraph is the proof.

## Vocabulary | 25 | The new-terms check

[ ] Run the new-terms check before finishing any lecture: scan the text for lexical terms a newbie would not know (reconciliation, hydration, bundler, tree, transpile, hook), and replace each superficial use with a specific organic intervention.
[ ] Build each intervention as the 5-step progression: the context, the naive alternatives, the architectural need, the naming of the term, and the summary built on the context just established.
[ ] Make the context a truly practical problem the developer actually faces in modern workflows, not a theoretical one; find the real-world, high-stakes scenario where the newbie physically hits a wall without the feature.
[ ] Pose the strongest naive alternative first: ask what tool from an earlier lecture the reader would plausibly reach for (like passing a value as a prop), and answer why it fails here, before any weaker strawman, so the scenario reads as necessary rather than contrived.
[ ] Frame the architectural need explicitly as a decision or mechanical requirement, and only then name the term as the name for that mechanism ("This mechanism is called reconciliation"), followed by a summary of what it does using the context just built.

[ ] PROPER EXAMPLE: make sure you follow this example, the 5-step intervention compressed:

> You have 2,000 stories in memory but the screen shows 20. Rebuilding all 2,000 matching objects every time one story changes is slow. React needs a way to reuse what it already built and touch only what changed. The mechanism that decides what to reuse is called **reconciliation**. It compares the new element tree with the old one and reuses DOM nodes wherever type and key match.

Notes: Context, alternative pain, architectural need, the naming, the summary. The term arrives as the answer to a wall the reader just hit, so it sticks.

## Vocabulary | 26 | First-use definition and foundational primitives #2026_09_20_25_group_1 revised by #2026_09_20_26_group_1

[ ] Explain key terms on their first introduction in plain English, avoiding bare, unbaptized buzzwords.
[ ] Use only standard React and web platform vocabulary as established in official specifications and react.dev, so the reader's glossary matches what interviewers say.
[ ] Avoid inventing new technical vocabulary that does not exist, and avoid reifying descriptive situations into fake proper nouns or pseudo-academic buzzwords; describe the plain reality in clear English instead.
[ ] Prefer natural React vocabulary (passing props, receiving props, child inputs) over corporate legalistic jargon (contract, establishing a contract, fulfilling a contract). #2026_09_20_26_group_1
[ ] When a foundational primitive (such as `component`, `props`, `JSX`, `{}` evaluation window, or `state`) debuts in the curriculum, unpack it through its four educational dimensions:
    1. **Everyday Meaning & Etymology**: State what the word stands for and what plain JavaScript thing it represents (e.g. `props` is short for properties, and represents a single JavaScript object passed into the function).
    2. **Syntactic Mechanics & Punctuation**: Decode every symbol explicitly (e.g. why `({ readerName })` uses object destructuring instead of `props.readerName`; why curly braces `{readerName}` act as an evaluation window stepping out of static HTML into live JavaScript execution).
    3. **The Two Halves of Passing**: When syntax binds data across components (such as `propName={value}`), decode both halves (the left side names the prop expected by the child, the right side supplies the parent's live variable).
    4. **Platform vs Framework Distinction**: Clearly distinguish native browser DOM elements from React constructs (e.g. lowercase `<header>` instructs the browser to create a DOM element, while capitalized `<SiteHeader />` tells React to invoke a custom JavaScript function in memory).

[ ] PROPER EXAMPLE: make sure you follow this example, introducing `props` and JSX evaluation on their first appearance (from Lecture 1):

> The component function `ReaderGreeting` receives its input data through a single parameter called **props** (short for properties). Rather than writing `props.readerName` throughout the function body, the signature uses JavaScript **object destructuring** directly inside the parentheses: `({ readerName })`. This unpacks the `readerName` property straight into a local variable.
>
> Inside the markup, the curly braces around `{readerName}` establish an **evaluation window** that steps out of static HTML structure and into live JavaScript execution. When React evaluates this component, it reads the current value of `readerName` and projects it straight into the text content of the span, eliminating manual string concatenation and DOM lookups.

Notes: The etymology is clear, the JavaScript reality (object argument) is stated, the punctuation (`({})` and `{}`) is decoded, and the browser consequence is named. The student is educated, not merely audited.

[ ] COUNTER-EXAMPLE: do not follow this bad example, dropping a primitive cold into an architectural checklist:

> Look at line 6: `<ReaderGreeting readerName={readerName} />`. We have not coded `ReaderGreeting` yet. But right here in the parent, we establish its contract. The parent owns the reader name and passes it downward as an explicit prop. We will build that child next in step 2.

Notes: It calls `readerName` an "explicit prop" without ever explaining what a prop is, why there are curly braces, or how a child receives it. It substitutes architectural jargon ("establishes its contract") for basic teaching.

## Guided Build | 27 | The calm professor narration #2026_09_20_04_group_2 revised by #2026_09_20_25_group_1 and #2026_09_20_26_group_1

[ ] Narrate each assembly step as direct instruction on how to write the code, addressed to the developer at the keyboard, so the reader could close the lecture and write the component themselves without re-reading anything.
[ ] Connect the code to the runtime engine and developer intent naturally: point to specific attributes, function parameters, or return expressions when explaining subtle mechanics, avoiding repetitive screen-reading formulas (such as opening every paragraph with "Look at line X:" or ending every step with "To recap this step:").
[ ] Ensure every step leaves the reader with one clear architectural takeaway, focusing on what was built, what manual work was avoided, and how data moves.
[ ] Charge every warning with the physical consequence, not the abstract rule, so the reader sees the breakage before they memorize the law.
[ ] Offer inline alternatives exactly as a calm professor would (Mind you, the easiest way...), acknowledging the simpler path before justifying why this scene needs more, so the reader hears a trade-off instead of a verdict.
[ ] Ask a rhetorical question only where the reader genuinely has one, and answer it in the same breath.
[ ] Never open a step with a mechanical template question that announces curiosity instead of creating it.

[ ] PROPER EXAMPLE: make sure you follow this example, a notice-move with an address, child props, and a forward link, from Lecture 40 Step 1: #2026_09_20_26_group_1

> Now look at line 6: `<LiveSearchInput query={query} onChange={setQuery} />`. We have not coded the child component `LiveSearchInput` yet. But right here in the parent, we decide what data it needs: the parent owns the search text in the variable `query`, and passes the callback function `setQuery` to the prop `onChange` so the child component can report keypresses. We will build the component `LiveSearchInput` next in Step 2.

Notes: Direct instruction with a line address, the child props explained in plain words, and the forward link to step 2. The reader is being taught, not entertained.

[ ] PROPER EXAMPLE: make sure you follow this example, a charged warning with its physical consequence, from Lecture 40 Step 2:

> If you ever bind `value` without an `onChange` handler, React locks the field into a read-only input and the user cannot type a single letter. When you take control from the browser, you must always provide both.

Notes: The reader sees the locked field before they memorize the pairing rule. The closing law sentence arrives after the breakage, not instead of it.

[ ] HALF WAY EXAMPLE: do not follow this example, a step opening that announces instead of teaches:

> Next, we create LiveSearchInput.jsx. This component handles the search functionality using the props we defined earlier.

Notes: True, and calm enough, but it has no line address, no consequence, and no instruction. It describes what the section will do instead of teaching the reader to do it.

[ ] COUNTER-EXAMPLE: do not follow this bad example, the mechanical template opener:

> Are you curious how we build this? Let us dive into the code and see the magic happen.

Notes: The question announces curiosity instead of creating it, and the flourish replaces instruction. No address, no consequence, nothing quotable.

## Guided Build | 28 | Scene, engine, punchline #2026_09_20_04_group_3

[ ] Decompose every two-system comparison into three moves in order: the physical scene (what the user does, in plain actions), what the engine does or does not do for each action, and a single-condition punchline that names the deciding difference.
[ ] Write the scene as short separate sentences, one action per sentence, so the reader can play the scene in their head while reading.
[ ] State the engine's behavior as a flat fact of what runs and what stays idle (React does not execute a single line of code), never as a capacity, a speed rating, or a metaphor.
[ ] Land the punchline as one sentence carrying a single condition, so the deciding rule is quotable in an interview.
[ ] Apply the same cadence to the numbered opening beats: the scene beats describe what the developer built and did, the divergence beat names the mechanical difference between the two systems, and the closing promise names exactly what the reader will learn.
[ ] Never compress the decomposition into one sentence whose subordinate clause makes the reader hold two systems and two engines in mind at once.

[ ] PROPER EXAMPLE: make sure you follow this example, the full decomposition, from Lecture 40 Step 3:

> Think about how a reader uses this correction form.
> They type their name. Then they write a few sentences of feedback.
> While they are typing, React does not need to know a single letter.
> We only need that text once: the moment they click submit:

Notes: Scene, scene, engine, punchline. Four sentences, each carrying exactly one system, and the closing colon points straight into the code fence that cashes the promise.

[ ] COUNTER-EXAMPLE: do not follow this bad example, the compressed subordinate clause:

> While the search bar has to react to every keypress, the correction form only needs its data on submit, making it the better choice for this workflow.

Notes: One sentence holding two systems, two engines, and a verdict. The reader must parse the clause before they can picture either scene, and nothing in it is quotable.

## Guided Build | 29 | The Upward Wire Law (Anti-Hand-Waving Callback Tracing) #2026_09_20_06_group_1

[ ] Whenever prose deconstructs a child component invoking a callback prop (`onSelect`, `onChange`, `onSubmit`, `onSave`), strictly ban dismissive hand-waving phrasing such as "it simply invokes [callback]", "it just calls [prop]", or "the callback updates the parent", because hand-waving conceals the exact mechanical linkage the student is trying to learn.
[ ] Mandate the 5-point Upward Wire circuit in the accompanying prose:
    1. **The Question**: Ask the reader's question out loud ("Where does `onSelect` come from?").
    2. **The Parent Origin**: Point explicitly back to Step 1 where the parent declared the state setter or handler (`const [roomId, setRoomId] = useState('general')`) and bound it in JSX (`onSelect={setRoomId}`).
    3. **The Telephone Line**: Explain that the child owns no state and does not know what the value is used for; it only holds a telephone line.
    4. **The Physical Execution**: Trace the exact call that runs in the parent's memory when the user clicks or types (`onSelect(room)` physically executes `setRoomId('politics')` in the parent).
    5. **The Community Category**: Name the architectural mechanism as standard **inverse data flow** (data flows down through props, user actions flow up through callbacks).

[ ] PROPER EXAMPLE: make sure you follow this example, the canonical Upward Wire deconstruction from Lecture 38:

> Look at the button click handler on line 6: `onClick={() => onSelect(room)}`.
> 
> Where does `onSelect` come from? Look back at Step 1 in `ChatWorkspace.jsx`. The parent declared `const [roomId, setRoomId] = useState('general')`, and then rendered:
> `<ChannelSelector activeRoom={roomId} onSelect={setRoomId} />`.
> 
> Notice what happened: the parent handed its private updater function `setRoomId` to the child under the prop `onSelect`. The component `ChannelSelector` does not own state, and it does not know what `roomId` is used for. It only holds a telephone line called `onSelect`.
> 
> When the reporter clicks a button, the native browser `onClick` fires and calls `onSelect(room)`. Because `onSelect` points directly to `setRoomId`, that call immediately executes `setRoomId('politics')` back in the parent component `ChatWorkspace`.
> 
> This is standard **inverse data flow**: data flows down through props (`activeRoom`), and user actions flow up through callbacks (`onSelect`).

Notes: The question asks what the reader is already thinking, the origin points back to Step 1's JSX binding, the telephone line metaphor clarifies state ownership, the physical function call in parent memory is named, and the community concept (inverse data flow) names the pattern.

[ ] COUNTER-EXAMPLE: do not follow this bad example, dismissive hand-waving with an untraced prop:

> Look at the button click handler on line 6: `onClick={() => onSelect(room)}`. When a reporter clicks a channel button, this handler does not connect to websockets, fetch messages, or touch DOM nodes. It simply invokes onSelect with the chosen room name. The parent updates roomId, and React handles the rest.

Notes: It uses the forbidden hand-wave "simply invokes", never explains where `onSelect` came from, confuses the custom callback with native browser events, and treats the parent state update as telepathy.

### 30. The Negative Counterfactual Law (Anti-Platitude Architectural Separation)
Rule tag: `#2026_09_20_07_group_1`

Whenever explaining why two responsibilities are separated across components (e.g., UI controls vs. side-effects, parent layout vs. child subscriptions, controlled inputs vs. uncontrolled forms), you are **strictly forbidden** from using empty architectural praise or unearned textbook platitudes.

Phrases like *"the cleanest architecture keeps X separate from Y"*, *"Component X is a pure presenter"*, or *"this promotes clean separation of concerns"* are non-explanations. They tell the student what to admire, but fail to show them what breaks.

Every architectural boundary must be justified using **The 4-Part Negative Counterfactual Circuit**:

1. **The Provocation Question**: Ask directly what happens if the responsibilities are merged into a single component:
   *`"What would happen if [Component A] handled [Responsibility B] directly?"`*
2. **The Concrete Disaster**: Describe the tangible runtime, state, or maintenance breakdown that immediately occurs:
   *Show how memory gets trapped, child views lose access, re-renders churn unrelated DOM trees, or testing becomes impossible.*
3. **The Physical Invariant**: Define the architectural boundary not by abstract philosophy, but by what is physically absent in code:
   *State explicitly: `"zero useState and zero useEffect"` or `"zero network awareness"`.*
4. **The Decoupling Proof**: Prove the architectural benefit through two concrete, symmetric refactoring scenarios:
   *`"1. If tomorrow you replace [UI element A] with [alternative UI], you touch zero lines of [backend/network code]."`*
   *`"2. If you swap [backend/network service B] for [alternative service], you touch zero lines of [UI code]."`*

---

#### ✕ FORBIDDEN VAGUE PLATITUDE (DO NOT DO THIS)
> "Mind you, the cleanest architecture keeps interactive controls separate from side-effect boundaries. ChannelSelector is a pure presenter: it renders three buttons, highlights the active one, and forwards clicks upward."

*Why this fails:*
- It uses unbaptized buzzwords (*"side-effect boundaries"*, *"pure presenter"*).
- It offers unearned praise (*"the cleanest architecture"*).
- It never explains *why* putting the socket in the buttons would be a disaster.

---

#### ✓ MANDATORY CRYSTALLINE COUNTERFACTUAL (DO THIS)
> What would happen if `ChannelSelector` opened the websocket connection itself?
>
> If you put the `useEffect` or socket connection inside `ChannelSelector`, the navigation buttons would be trapped managing network sockets, reconnection timers, and message buffers. Worse, the chat message area in `ChatRoom` would have no way to access that socket without messy prop-drilling or global state hacks. You would have buttons and network protocols tangled in a single file.
>
> By separating them, `ChannelSelector` owns zero `useState` and zero `useEffect`. It is a pure presenter: given the same `activeRoom` string and `onSelect` callback, it will always render the exact same three buttons.
>
> This separation gives you two concrete superpowers:
> 1. If tomorrow you replace the button pills with a dropdown `<select>` menu, you touch zero lines of websocket code.
> 2. If you swap the websocket protocol in `ChatRoom` for a mock test service, you touch zero lines of button code.

## Guided Build | 31 | Explicit Architectural Relations #2026_09_20_13_group_1

[ ] Make relations between entities explicit rather than cryptic whenever code connects two files, components, or props: state the exact count and names of all components involved, explain why the syntax differs (such as named exports requiring curly braces), and clarify why one part is imported while another remains internal, avoiding shorthand that merely names a technical category. #2026_09_20_13_group_1

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> Notice line 2: `import { ArticleList } from './ArticleComponents.jsx'`. Here we use curly braces because `ArticleList` is a named export from a shared module.

Notes: It leaves an unexplained mismatch between a plural file name and a singular import, never mentions `ArticleCard`, and treats curly braces as an arbitrary syntax rule rather than a consequence of multiple components sharing one file.

[ ] PROPER EXAMPLE: make sure you follow this example:

> Notice line 2: `import { ArticleList } from './ArticleComponents.jsx'`. The file name is `ArticleComponents.jsx` in the plural because it encodes two components, not one (`ArticleList` and `ArticleCard`). Because multiple components share this file, they cannot use a single default export and must be declared as named exports, which is why this import requires curly braces: `{ ArticleList }`. The parent imports only `ArticleList` as the feed container; `ArticleCard` is composed internally inside that file and does not need to be imported here.

Notes: It states the count and names upfront, explains that curly braces exist because multiple components share the file, and clarifies why only `ArticleList` is imported by the parent.

