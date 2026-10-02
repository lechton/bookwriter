---
name: lecture-voice
description: Governs the voice, stance, narrative flow, and technical-description standard of a production lecture; use when writing or revising lecture prose.
---

# Lecture Voice

This skill governs how a production lecture speaks: the author's stance, the reader the prose serves, the way concepts are defined, the standard for technical descriptions, the rhythm of sentences, the opening beats, callouts, and vocabulary. It applies to every sentence of lecture prose, from the first opening beat to the last line of the summary. Structural rules such as section skeletons, tables, and code-block mechanics live in `lecture-structure` and `code-blocks`.

Digests: `skills/old-instructions/instructions.md` (stance, empathy, lexical audit, lecture format, opening ladder, callouts) and `skills/old-instructions/AUTHOR-BRIEF.md`.

## Stance | 01 | The Developer-at-the-Keyboard Stance

[ ] Write from the perspective of the developer sitting at the keyboard. The reader should feel personally guided through concrete files, editor tabs, and terminal commands, recognizing their own screen in every paragraph.
[ ] Avoid the disembodied engine voice. Do not write from the perspective of React's internal reconciler, and do not treat technical concepts as abstract Platonic ideals. Speak in terms of what physically appears in the developer's code and what happens in their browser.
[ ] Avoid corporate brochure-speak (such as "React fundamentally alters its submission runtime across four core guarantees"). It advertises a product instead of teaching an engineer.
[ ] Avoid naming internal engine APIs (such as `startTransition` or internal fiber lanes) unless they physically appear in the reader's code or are strictly required to explain an observable behavior.
[ ] Enforce the Reader Horizon Law: never attempt to explain or contrast an early tool choice by invoking alien downstream concepts outside the student's current horizon (such as mentioning "database connections inside your view layer" when teaching basic project setup). Never solve an explanation challenge by creating a more complex mystery. Anchor contrasts strictly to physical realities the student already knows: plain static files, the browser window, and local machines versus continuous backend web servers. #2026_09_21_06_group_1

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> When a Promise settles, the Transition wraps the Execution Boundary inside the Priority Lane.

Notes: It speaks from inside the engine using invented abstractions; not one word of it appears in the reader's editor.

[ ] PROPER EXAMPLE: make sure you follow this example, written from the keyboard:

> You write `useActionState` once, at the top of your component. From that line down, the loading flag, the error message, and the form data all live in one place, and you delete the three `useState` hooks you used to juggle.

Notes: Every clause is something the developer types, deletes, or sees on screen.

## Stance | 02 | Empathetic Anticipation Without Meta-Labels #2026_09_21_12_group_1

[ ] Before writing a section, answer three planning questions internally: What is changing for the developer? What will look strange or counter-intuitive? What terms might confuse them?
[ ] Remind the reader how the problem was solved previously before introducing the new pattern. The change then has a clear baseline to stand against.
[ ] Address surprising syntax directly in prose before the reader gets confused (for example, pointing out the absence of `e.preventDefault()` and explaining why it is no longer needed).
[ ] Grasp opportunities at technical crossroads: whenever introducing a syntax pattern, parameter convention, or language fork (such as parameter destructuring vs `props.property`), never dismiss the alternative in handwaving abstract prose. Follow the [pedagogical-crossroads](../pedagogical-crossroads/SKILL.md) skill: present both options in separate integrated code snippets so junior developers learn the mechanical truth and seniors are grounded in the decision. #2026_09_21_12_group_1
[ ] Keep planning questions strictly internal. Never print meta-labels like "1. Novelty:", "2. Weirdness:", or "Cognitive Inference" into the lecture text. Speak naturally about the reader's code, screen, and actions.

## Stance | 03 | Application-First Engineering Problems #2026_09_20_27_group_1

[ ] Open technical discussions by grounding the reader in a concrete engineering problem drawn from the running course world (The National Times newsroom).
[ ] Establish the tangible developer pain before introducing framework mechanics or browser APIs.
[ ] Avoid generic CS 101 textbook preambles (such as "In plain web development, a webpage is an HTML document loaded into browser memory...").
[ ] Use everyday universal scenarios (newsroom dashboards, article feeds, subscriber profiles) rather than obscure, administrative, or archaic domains (such as voting precincts, tallies, or caucuses).
[ ] Stage all applications, use cases, and scenarios one by one, whether introduced as hypothetical situations or analytical evaluations; never compound them. Ban compound scenario jamming (such as "Imagine you are building X or an offline Y", or "When evaluating an X or an analytical Y"). When introducing an alternative use case, scale, or environment, give each its own dedicated sentence with concrete human scale and unhurried transitional framing (for example: "Imagine if you are building an interactive widget for many users. Alternatively, what if you build a dashboard that must work offline?"). #2026_09_21_06_group_1

## Stance | 04 | Physical Metaphors for Paradigm Shifts #2026_09_20_27_group_1

[ ] Anchor fundamental paradigm shifts in vivid, intuitive physical metaphors paired immediately with runnable code.
[ ] Use relatable real-world models to build instant mental clarity (for example, comparing imperative scripting to a passenger giving turn-by-turn driving directions where one missed turn gets you lost, versus declarative programming where you provide the destination address and the navigation system handles the route).
[ ] Use the metaphor as an initial mental bridge, then immediately ground it in concrete code and browser mechanics.

## Language & Readability | 05 | The Tired-Reader Standard (CEFR B2 & Active Voice)

[ ] Write for a developer reading plain upper-intermediate English (CEFR B2). They are reading at the end of a long workday with a mild headache, giving the page one chance.
[ ] Prefer the most common English words. Treat rare or esoteric vocabulary as a defect and replace it with everyday terms.
[ ] Use direct Subject-Verb-Object structures so sentences parse effortlessly on the first pass.
[ ] Enforce zero content degradation: simplify the language and syntax, never the technical depth or accuracy. The reader expects thorough, interview-winning substance.

## Language & Readability | 06 | Sentence Length and Single-Action Focus #2026_09_20_21_group_1 revised by #2026_09_21_04_group_1

[ ] Cap individual sentences at 20 words. Aim for 7 to 15 words per sentence.
[ ] Ban clause chaining and participial stacking (such as chaining multiple clauses with commas, participles, and relative pronouns).
[ ] Restrict each sentence to a single technical mechanism or physical event so thoughts land cleanly one by one.
[ ] Keep short sentences calm and unhurried: do NOT compress multiple ideas into a single dense fragment or colon-appositive to fit under 20 words. Use plain, active verbs and let each thought breathe in its own sentence.
[ ] Use clean vertical bullets or sequential short sentences when listing multiple features or steps.

[ ] COUNTER-EXAMPLE: do not chain multiple clauses into a single breathless sentence:

> Instead of the reserved JavaScript keyword `class`, it assigns `className`, adhering strictly to JSX naming conventions while mapping directly to the DOM property.

Notes: 23 words across four chained clauses. It forces the reader to hold three distinct thoughts in memory before reaching a period.

[ ] PROPER EXAMPLE: make sure you break chained thoughts into single-idea sentences:

> Notice the attribute: it uses `className` instead of `class`. In JavaScript, `class` is a reserved keyword. React uses `className` to avoid that conflict and map directly to the browser's native DOM property.

Notes: Three short, active sentences (7, 7, and 15 words). The contrast lands first, the reason lands second, and the engine consequence lands third.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> When a user submits the form, React intercepts the native submit event automatically, gathers all contained inputs that declare a name attribute into a native browser FormData instance, and passes that dictionary directly to the action function.

Notes: Four conceptual stages compressed into one breathless comma-spliced sentence.

[ ] PROPER EXAMPLE: make sure you follow this example, the same mechanism in lucid steps:

> A form may consist of one or more input fields receiving data from the user, assigning the content of each input text in an attribute named `name`. When a user submits the form, React intercepts the native submit event automatically. The named fields from the various inputs all get collected into a native browser `FormData` dictionary. This dictionary then gets passed directly to the action function.

Notes: One idea per sentence: physical basics first, trigger second, data collection third, handoff fourth.

## Language & Readability | 07 | Explicit Entity Qualification (The "What Is What" Rule) #2026_09_20_23_group_1

[ ] Verbally qualify every code entity with its architectural role on every reference: "the component `ReaderGreeting`", "the prop `readerName`", "the `<span>` element", "the property `author.name`".
[ ] Distinguish component references by their syntax role: use "the component `ComponentName`" when referring to the function or module, and "the component `<ComponentName />`" when referring to its JSX usage.
[ ] Never drop bare, unqualified tokens that force the reader to calculate what kind of entity is being discussed.
[ ] Avoid splitting compound code identifiers with spaces (for example, never write `avatar Url` when referring to `avatarUrl`).
[ ] Ban "presenter" jargon: never invent fake roles like "header presenter", "byline presenter", or "pure presenter". React components are simply components. Call them by their standard names: "component", "parent component", "child component", or by their file name. #2026_09_21_10_group_1

## Language & Readability | 08 | Paragraph Cohesion and Key Term Highlighting #2026_09_20_27_group_1

[ ] Keep paragraphs cohesive and focused, typically 2 to 4 sentences grouping related thoughts together. Avoid fracturing text into disjointed one-sentence fragments.
[ ] Bold key terms on their first introduction in the lecture, and only when they represent real, standard React or web platform concepts.
[ ] Highlighting key terms allows the reader to easily relocate load-bearing concepts during review without cluttering the page with excessive bolding.

## Explaining Concepts | 09 | The Three-Part Anchor (Write, Delete, Browser Consequence)

[ ] Anchor every feature explanation in three tangible facts: (1) what you physically write in the code file, (2) what manual boilerplate you get to delete, and (3) what the browser physically does.
[ ] State the concrete keystrokes typed into the file so the concept has a physical home the reader can point to.
[ ] Name the manual boilerplate the reader gets to delete (such as manual `useState` keystroke tracking, `e.preventDefault()`, or `try / finally` loading flags) so the value is felt as concrete relief.
[ ] Describe the physical browser behavior (for example, the UI remains clickable during background requests, inputs reset automatically, or buttons display submission status without prop drilling).

## Explaining Concepts | 10 | Behavior-First Definitions Over Dictionary Jargon #2026_09_21_04_group_1

[ ] Avoid compressed academic dictionary definitions (such as "Generating dynamic HTML on a server per incoming request") that connect words to words without showing runtime mechanics.
[ ] Define concepts through concrete runtime behavior: state what runs, what moves across the network, and what the user sees on screen.
[ ] Apply behavior-first definitions to bullet points and numbered lists: ban colon-appositive noun fragments (such as "1. Tool: a lightweight server..."). State what the tool does using complete, tactile sentences that name physical files (such as `.jsx` and `.js`), developer actions, and browser results.
[ ] Teach new concepts by starting from the closest known action: identify what the reader already built earlier in the course, and introduce the new concept as that familiar pattern plus one incremental change.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> Server-side rendering: generating dynamic HTML on a server per incoming request.

Notes: It connects words to words; nothing runs, nothing moves, and the reader cannot point at a file, a request, or a pixel.

[ ] PROPER EXAMPLE: make sure you follow this example, a definition through runtime behavior:

> With server-side rendering, your component runs on the server. It returns HTML. The server sends that HTML to the browser, and the reader sees your article text before any JavaScript has loaded.

Notes: Three short sentences, each one a physical event: code runs, HTML travels, the reader sees text.

## Explaining Concepts | 11 | The Native Default and the Framework Invariant #2026_09_20_03_group_1 revised by #2026_09_20_27_group_1

[ ] When pertinent, but not always, you are encouraged to consider defining load-bearing concepts through their relationship to the plain web platform, structured around two core realities:
    1. **The Native Default**: Explain what the browser does naturally with zero JavaScript (for example, an uncontrolled `<input>` manages its own internal typing and buffer natively).
    2. **The Framework Invariant**: Explain what happens when React takes over, stating clearly who controls the data and what invariant now holds (for example, a controlled input is locked to state; React dictates every character displayed).
[ ] Introduce load-bearing concepts organically through problem contrast and narrative context rather than formulaic self-interrogations (avoid mechanical question headers like "What is imperative programming?").
[ ] Make sure you retain categorical clarity and theoretical grasp of the topic iat hand e.g. remind the reader the key categories, the core ideas, the senior developer needs to select or decide. For example, when pertinent you can name both sides of the ownership contrast using standard community terms (for example, controlled vs. uncontrolled).
[ ] Close the definition with the invariant sentence: one quotable statement naming who dictates and what is guaranteed or restricted (using precise words like `only`, `cannot`, `never`, or `always`). 

[ ] PROPER EXAMPLE: make sure you follow this example, a platform concept defined by its default and its invariant:

> What is a **controlled input**? React draws the line between two kinds of input: the **controlled input**, controlled by React, and the **uncontrolled input**, controlled by the browser. In normal HTML, an input controls itself: when you type a letter, the browser's native engine directly stores that letter and paints it on screen, and no JavaScript needs to be involved. Leave the input in that state and React calls it an **uncontrolled input**. In a controlled input, you take that power away from the browser: you write `<input value={state} onChange={...} />`. The input is now locked: it can only display whatever the state variable holds, and React dictates every single character shown on screen.

Notes: The contrast names both sides by who controls them, the default sentence explains browser behavior with zero code, the takeover is one line of code, and the invariant sentence closes on what is locked and guaranteed.

[ ] PROPER EXAMPLE: make sure you follow this example, the same structure on a React-only concept:

> What is `useState`? When you define an ordinary variable inside your component, the variable forgets everything the moment the function finishes running: type a letter, and the next render rebuilds the variable from scratch. Instead, when you define the variable through `useState`, the hook gives the component a private memory that survives every render. The setter it returns is the only door to that memory: reading the variable gives you the value for the current render, and only calling the setter asks React for the next one. In web development, a variable that automatically drives the screen when it changes is often called a reactive variable, and that reactivity is where React got its name; React's own documentation simply calls it state.

Notes: Opens on the reader's habit (ordinary variable forgets), introduces the hook as memory, states the invariant (setter is the only door), and connects to official documentation terminology.

[ ] COUNTER-EXAMPLE: do not follow this bad example, a compressed dictionary line with no baseline and no invariant:

> Controlled input: an input element whose value is bound to component state.

Notes: It connects words to words without stating who governed the input previously, how control was taken, or what invariant now applies.

## Explaining Concepts | 12 | Descriptions Must End in Consequences

[ ] When explaining a technical entity (a configuration file, a manifest, or an architecture decision), never stop at an inventory of its contents. Always conclude with what it changes for the developer or the end user.
[ ] Cut or complete any sentence that only names and describes without stating the operational outcome. A pure inventory entry leaves the reader unable to apply the knowledge.
[ ] Treat the consequence as the core meaning of the explanation, fulfilling the third part of the three-part anchor.
[ ] Ban tautological justifications. Never explain why a tool or category is chosen by merely restating its definition (such as "use a client build tool when your application only needs to run in the browser"). A tautology offers zero decision criteria. Always ground architectural trade-offs in tangible, external operational realities: what requirement is absent (e.g. search engines never need to index private tools behind a login), and what real operational burden is eliminated (e.g. no 24/7 cloud server bills, no crash monitoring, and zero backend maintenance). #2026_09_21_06_group_1

[ ] COUNTER-EXAMPLE: do not follow this bad example, an accurate description with zero operational consequence:

> package.json: The project manifest holding two separate dependency lists. The dependencies list contains react and react-dom, which the browser needs to execute the application. The devDependencies list contains vite and @vitejs/plugin-react, which the computer needs to compile and serve the project locally. The file also defines runnable scripts such as npm run dev and...

Notes: Accurate, but useless as guidance. It lists what each entry contains, but never explains why the separation matters to the user or build output.

[ ] PROPER EXAMPLE: make sure you follow this example, concluding on the consequence:

> `package.json` is the project manifest, and it holds two separate lists. (a) The runtime dependencies (`dependencies`) are the packages the application needs while it runs: `react` and `react-dom`. The browser loads these when a reader opens the page, so these are the only packages your readers ever download. (b) The development dependencies (`devDependencies`) are the packages your computer needs while you build and serve the project: `vite` and `@vitejs/plugin-react`. They run on your machine, and they never ship to the browser. The split is the point: the build tools stay on your machine, so what the browser loads stays small. The manifest also defines runnable scripts: `npm run dev` starts the development server, and `npm run build` produces the production files.

Notes: Concludes by explaining why the split matters: build tools stay on the machine, minimizing the bundle downloaded by the user.

## Explaining Concepts | 13 | Multi-Part Comparisons & Parallel Anchors #2026_09_21_04_group_1

[ ] When explaining two or more parallel concepts or configuration items in a single passage, give each item a clear lettered anchor (`(a)`, `(b)`, `(c)`) or numbered item (`1.`, `2.`).
[ ] Structure each item in a calm, unhurried sequence using complete, self-contained sentences:
    1. **Kind-name**: The everyday name of the item, followed by the exact technical identifier or concrete example in parentheses or bold.
    2. **Tactile definition**: Complete, calm sentences stating what the tool or concept physically does on the developer's machine, naming real files (such as `.jsx` or `.js`) and runtime environments. Ban colon-appositive fragments (such as ": a lightweight server").
    3. **Contents & mechanics**: What actually lives inside or constitutes the item.
    4. **Consequence**: What this item changes for the developer or user.
[ ] Keep visible anchors distinct from banned internal planning labels. Numbered or lettered items are clean, reader-facing prose; planning tags (such as "Part A: Novelty") must never appear.

## Lecture Openings | 14 | The Line-2 Interview Question Callout

[ ] Place the `> INTERVIEW QUESTION | ...` callout on line 2 of every lecture file, immediately after the `# Lecture {n}: [Title]` header with no blank line between them.
[ ] Follow the callout with exactly one blank line before the opening beats.
[ ] Format the callout using the exact pattern: a blockquote marker (`>`), the literal token `INTERVIEW QUESTION`, a space, a vertical bar (`|`), a space, the curriculum typology tag, a space, a vertical bar (`|`), a space, and the interview question text.
[ ] Use one of the three standard typology tags: `❱ CORE`, `❱❱ MORE`, or `❱❱❱ ADVANCED` (optionally followed by ` (Server)` for server-focused lectures).

[ ] PROPER EXAMPLE: make sure you follow this example, the exact callout pattern:

> `> INTERVIEW QUESTION | ❱ CORE | Why do ordinary variables forget their values between renders, and how does useState remember?`

Notes: The callout is anchored directly on line 2 with exact spacing and typology tagging.

## Lecture Openings | 15 | The Seven Numbered Opening Beats

[ ] Open every lecture body with exactly 7 numbered beats that establish narrative momentum:
    1. **Scene**: The real-world setting in The National Times newsroom.
    2. **Setup**: The concrete action taken by a journalist or user.
    3. **Surprising Action**: What the application code attempts to do.
    4. **Question**: The central failure, confusion, or unexpected behavior.
    5. **Danger**: The tangible impact on readers or the business if unaddressed.
    6. **Mystery**: The architectural reason why the code fell short.
    7. **Promise**: What today's lecture will unlock in plain language.
[ ] Write each beat as one continuous markdown line under 20 words.
[ ] Use numbers (`1.` to `7.`), not bullet points, to create an escalating narrative progression.
[ ] Present the beats bare directly under the Interview Question callout without manual "Intro" headings or wrapper paragraphs (the build system provides surrounding chrome).

[ ] PROPER EXAMPLE: make sure you follow this example, opening beats where every noun has one clear identity:

> `1. You built a news website called The National Times, and real readers are using it right now.`
> `2. A journalist types a new headline into the page and saves it.`
> `3. Your code has one job: print the headline to the console every time it changes.`
> `4. Why does the code print only once?`
> `5. Readers keep seeing the wrong headline.`
> `6. Something in your code read the headline once, then stopped looking.`
> `7. Today, the print will follow every change.`

Notes: One actor, one screen, one line of code, one observable mystery, and a promise that motivates without spoiling the mechanism.

## Lecture Openings | 16 | Opening-Beat Clarity (The Identity Rule)

[ ] Write the opening beats with absolute clarity; they are the reader's first contact with the topic.
[ ] Enforce the Identity Rule: every noun in every beat must refer strictly to one of four things: (1) a human person, (2) an item visible on screen, (3) an element in code, or (4) a machine event.
[ ] Avoid ambiguous or overloaded words: replace "editor" with "the journalist" (or "the code editor"), replace "live" with "open in the reader's browser right now", and replace "log" with "print to the console".
[ ] Keep mechanism jargon out of the opening beats: avoid words like `state`, `props`, `hook`, `render`, `mount`, `hydrate`, or `reconcile`. Describe visible behavior instead (for example, write "the page keeps showing the old headline" instead of "state is stale").
[ ] Prefer everyday verbs over technical terms: use "change" over "mutate", "show" over "render", "save" over "persist", and "old" over "stale".

[ ] COUNTER-EXAMPLE: do not follow this bad example, opening beats with ambiguous words:

> `1. The newsroom desk is live.`
> `2. An editor rewrites the breaking headline.`
> `3. You log the headline at the top of the script.`
> `4. Why only one print?`

Notes: "Desk" could be furniture or a component; "live" could mean deployed or streaming; "editor" could be a human or VS Code; "log" could be a file or a verb.

## Lecture Openings | 17 | Holding Back the Mechanism

[ ] Keep the technical API or solution name out of the opening beats. Pose the puzzle in the beats and let the lecture body build the solution.
[ ] Never reveal hook names, framework components, or library functions in beat 7 (for example, avoid "Today you learn how React's declarative component model eliminates manual DOM queries").
[ ] End beat 7 on the promise of the capability unlocked in plain English, leaving the discovery of the mechanism to the lecture body.
[ ] Avoid narrative bloat before the problem begins: open directly with an actor taking an action rather than multi-step administrative background.

[ ] COUNTER-EXAMPLE: do not follow this bad example, spoiling the mechanism in the opening beats:

> `7. Today you learn how React's declarative component model eliminates manual DOM queries and keeps your entire user interface synchronized automatically.`

Notes: It reveals the mechanism prematurely, leaving no mystery or discovery for the lecture body to build.

## Callout System | 18 | Callout Types and Strategic Use

[ ] Format alert callouts using GitHub-style syntax opening with `> [!TYPE]` on its own line, followed by blockquoted lines (`>`).
[ ] Use the supported callout types according to their specific purpose:
    - `[!TIP]`: Interview-strategy guidance and framing advice (the default callout type for lectures).
    - `[!NOTE]`: Neutral contextual asides and browser background notes.
    - `[!KEY]`: Core mental models, high-leverage invariants, and memorable allegories.
    - `[!WARNING]`: Common developer pitfalls and silent runtime bugs.
    - `[!CAUTION]`: Breaking changes or destructive patterns.
    - `[!WILD]`: The "In the Wild" real-world friction card.
    - `[!CONVENTION]`: Explaining inescapable UI and domain naming conventions.
[ ] Default to `[!TIP]` for actionable interview framing; reserve `[!KEY]` for singular, high-leverage takeaways.

[ ] PROPER EXAMPLE: make sure you follow this example, the signature TIP shape:

> ```markdown
> > [!TIP]
> > **To impress the interviewer:** Most candidates will say "React re-renders the component when state changes." If you want to show deep understanding, explain the snapshot model: the setter does not change the variable in the running code, it asks React to render again with a new value.
> ```

Notes: Opens with `> [!TIP]`, leads with a bold category label, and frames how to discuss the concept effectively in an interview.

## Callout System | 19 | Authoring Inline Callouts

[ ] Keep each callout focused on a single self-contained point. Avoid packing multi-item bulleted lists into a single alert box.
[ ] Lead the body with a bold category label (such as `**To impress the interviewer:**` or `**Common mistake:**`).
[ ] Keep code examples in adjacent code windows outside the callout; avoid embedding code fences inside alert boxes.
[ ] Place callouts inline immediately after the section that establishes the relevant concept, rather than clustering them at the end of the lecture.
[ ] Callouts provide framing and perspective; they do not replace comprehensive technical explanations in the main prose.

## Callout System | 20 | The "In the Wild" Friction Card ([!WILD])

[ ] Use `[!WILD]` (rendered as the signature "⚡ IN THE WILD" friction card) to isolate and resolve a single counter-intuitive friction point or common student confusion with an immediate "aha" realization.
[ ] Teach the full lesson before adding a friction card: never drop a `[!WILD]` card into the middle of an unfinished explanation. Explain the problem, show the broken code, teach the rule, and show the working code first. Only place the `[!WILD]` card after the reader understands both the mistake and how to fix it. #2026_09_21_03_group_1 revised by #2026_09_21_08_group_1 and #2026_09_21_09_group_1
[ ] Ground the question in earlier text: the opening question (6 to 9 words) must target a trap the reader already saw resolved. Never use the card to introduce new rules, naming habits, or compiler terms that the main text has not yet explained. #2026_09_21_08_group_1 revised by #2026_09_21_09_group_1
[ ] Obey the Curriculum Dependency Invariant inside callouts: never smuggle advanced concepts, hooks, or backend architectures into alert cards before their formal curriculum question. #2026_09_21_03_group_1
[ ] Open with a concise, bold leading question of 6 to 9 words naming the exact friction point (for example, `**When does submitting a form wipe your screen?**`).
[ ] Maintain a tactile, conversational tone with short sentences (under 20 words each).
[ ] Stage scenario premises with calm, unhurried breathing room. Introduce all use cases—whether hypothetical or analytical—one by one, establishing who uses the tool and at what scale. When presenting alternative use cases, give each alternative its own sentence with distinct transitional framing (such as "Alternatively, what if you build..."), banning compound "X or Y" scenario cramming. #2026_09_21_06_group_1
[ ] Discharge trade-offs using concrete operational criteria (such as private tools behind a login, search engine indexing needs, and cloud server hosting costs) rather than circular tautologies. #2026_09_21_06_group_1
[ ] Bold newly clarified key terms inside the body to highlight the resolved concept.
[ ] Limit to at most one `[!WILD]` card per major technical section so each appearance remains an engaging event.

[ ] PROPER EXAMPLE: make sure you follow this example, a WILD card discharging friction with an immediate aha:

> [!WILD]
> **When does submitting a form wipe your screen?** In the early web, a form submit was a navigation command. It requested a new HTML page from the server and wiped the browser's memory clean. When single-page applications arrived, developers added `e.preventDefault()` inside every submit listener to halt that navigation. Forgetting that single line caused a **full-page reload**. All client state in memory vanished instantly. Developers never need to write `e.preventDefault()` anymore. Why? React now prevents the **full-page reload** automatically when handling form actions.

Notes: The opening question is 7 words and names a visceral pain point; every sentence is under 20 words; the aha lands cleanly through browser history.

[ ] PROPER EXAMPLE: make sure you follow this example, a WILD card using a physical metaphor:

> [!WILD]
> **Why does useFormStatus require a child component?** Imagine a reader standing in a hallway, trying to read a status badge mounted on the inside of a room. From the hallway, they cannot see it. They must step inside the room and look up at the board. That is how **useFormStatus** works. It is an **internal sensor** that only reads the form from inside. If you call it in the component that creates the form, it finds no form above itself. Pending stays permanently false. You must call it from a child nested inside the form.

Notes: The opening question is 7 words; the physical metaphor gives the reader an immediate mental model; every sentence is under 20 words.

## Callout System | 21 | Dual-Register Key Takeaways

[ ] Present essential mental models in two distinct, coordinated registers:
    1. A punchy, quotable summary inside a `[!KEY]` callout (the memorable invariant a candidate can quote in an interview).
    2. A thorough, step-by-step technical unpacking in the prose paragraph immediately following the box.
[ ] Ensure the two registers complement each other: the callout provides the sticky mental hook, and the prose delivers the engineering justification.

[ ] PROPER EXAMPLE: make sure you follow this example, presenting a truth in both registers:

> ```markdown
> > [!KEY]
> > The render is a photograph, not a film.
>
> When your component function runs, it does not stream changes to the screen as it goes. It computes one complete picture of the UI for the current state, hands it to React, and finishes. That is why reading a state variable after setting it shows the old value: the variable in the running photo belongs to the photo, not to the next one.
> ```

Notes: The callout provides the quotable hook; the paragraph immediately proves why the principle holds.

## Vocabulary & Baptisms | 22 | Five-Step Organic Progression for Introducing New Terms

[ ] Never drop new technical jargon into the prose or callout boxes without prior baptism. #2026_09_21_03_group_1
[ ] Introduce new lexical terms through a structured 5-step progression:
    1. **Context**: A concrete, high-stakes application scenario where the developer encounters a limitation.
    2. **Naive Attempt**: The most plausible solution the developer would initially reach for, and why it falls short.
    3. **Architectural Need**: The mechanical requirement that must be fulfilled to solve the problem efficiently.
    4. **Naming the Term**: Introducing the official industry term as the name for that mechanism.
    5. **Summary**: A concise summary of how the mechanism operates in the context just established.

[ ] PROPER EXAMPLE: make sure you follow this example, the 5-step progression in action:

> You have 2,000 stories in memory but the screen shows 20. Rebuilding all 2,000 matching objects every time one story changes is slow. React needs a way to reuse what it already built and touch only what changed. The mechanism that decides what to reuse is called **reconciliation**. It compares the new element tree with the old one and reuses DOM nodes wherever type and key match.

Notes: Follows the full sequence: context (2,000 stories), naive pain (slow rebuilding), architectural need (reuse existing objects), naming the term (reconciliation), and operational summary.

## Vocabulary & Baptisms | 23 | Four Educational Dimensions for Foundational Primitives #2026_09_20_25_group_1

[ ] When introducing foundational React primitives (`component`, `props`, `JSX`, the `{}` evaluation window, and `state`), explain them across four distinct dimensions:
    1. **Everyday Meaning & Etymology**: State what the word stands for and what plain JavaScript construct it represents (for example, `props` is short for properties and represents a single JavaScript object passed into the function).
    2. **Syntactic Mechanics & Punctuation**: Decode every symbol explicitly (for example, why `({ readerName })` uses object destructuring instead of `props.readerName`; why curly braces `{readerName}` act as an evaluation window stepping out of static HTML into live JavaScript execution).
    3. **The Two Halves of Passing**: When syntax binds data across components (such as `propName={value}`), decode both halves (the left side names the prop expected by the child; the right side supplies the parent's live variable).
    4. **Platform vs Framework Distinction**: Clearly distinguish native browser DOM elements from React constructs (for example, lowercase `<header>` instructs the browser to create a DOM element, while capitalized `<SiteHeader />` tells React to invoke a custom JavaScript function in memory).

[ ] PROPER EXAMPLE: make sure you follow this example, introducing `props` and JSX evaluation on their first appearance:

> The component function `ReaderGreeting` receives its input data through a single parameter called **props** (short for properties). Rather than writing `props.readerName` throughout the function body, the signature uses JavaScript **object destructuring** directly inside the parentheses: `({ readerName })`. This unpacks the `readerName` property straight into a local variable.
>
> Inside the markup, the curly braces around `{readerName}` establish an **evaluation window** that steps out of static HTML structure and into live JavaScript execution. When React evaluates this component, it reads the current value of `readerName` and projects it straight into the text content of the span, eliminating manual string concatenation and DOM lookups.

Notes: Covers etymology, JavaScript object reality, punctuation decoding, and browser outcome.

[ ] COUNTER-EXAMPLE: do not follow this bad example, dropping a primitive without baptism:

> Look at line 6: `<ReaderGreeting readerName={readerName} />`. We have not coded `ReaderGreeting` yet. But right here in the parent, we establish its contract. The parent owns the reader name and passes it downward as an explicit prop. We will build that child next in step 2.

Notes: It calls `readerName` an "explicit prop" without explaining what a prop is, why curly braces are present, or how the child receives it.

## Vocabulary & Baptisms | 24 | Standard React Vocabulary vs Corporate Jargon #2026_09_20_26_group_1

[ ] Use standard React and web platform terminology as established in official specifications and react.dev.
[ ] Avoid inventing pseudo-academic buzzwords or reifying routine patterns into fake proper nouns.
[ ] Prefer natural React phrasing (such as "passing props", "receiving props", "child inputs") over legalistic corporate jargon (avoid phrases like "contract", "establishing a contract", or "fulfilling a contract").

## Vocabulary & Baptisms | 25 | The Two-Tier Convention Protocol: Prune First, Decode Second ([!CONVENTION]) #2026_09_21_27_group_1

[ ] Audit all domain metaphors, editorial vocabulary, and UI naming conventions across prose, code snippets, and figure cards (such as "masthead", "byline", "slug", "hero section", "accordion", "toast", "drawer", or "pill").
[ ] Follow the Two-Tier Convention Protocol:
    * **Tier 1 (First Priority: Prune & Replace in Text and Figures)**: Always consider replacing the convention with a self-evident everyday English term throughout the entire lecture and its accompanying HTML figures (e.g. replacing "masthead" with "site header", "ticker" with "live news bar", or "lede" with "article summary"). When replacing the word eliminates confusion without losing technical accuracy, purge the jargon from prose, code, and figure containers entirely.
    * **Tier 2 (Fallback: The Inescapable Industry Standard)**: Only retain the convention if replacing it is unwise because the term is an inescapable, universal frontend standard that developers must recognize in job requirements, UI component libraries, and technical interviews (such as "slug", "accordion", "toast", "drawer", or "breadcrumb").
[ ] When an inescapable convention must be retained, decode it immediately using an explicit `> [!CONVENTION]` callout structured across three concrete facts:
    1. **Physical Origin**: Where the metaphor comes from in the physical world (e.g. print publishing, carpentry, theater staging).
    2. **Web Engineering Reality**: What physical UI widget, component, or data format it represents on screen.
    3. **Operational Justification**: Why production teams standardize on this term instead of generic labels (e.g. why an expandable panel is called an "accordion").

[ ] COUNTER-EXAMPLE: do not casually drop domain jargon without replacing or explaining it:

> Declares masthead container and single source of reader data truth.

Notes: Uses "masthead" without context, leaving a junior developer wondering whether it is an HTML tag, a React API, or arbitrary slang.

[ ] HALF WAY EXAMPLE: do not drop an explanatory callout for a word that could simply be rewritten:

> > [!CONVENTION]
> > What is a masthead? A masthead is the top section of a newspaper...

Notes: Better than nothing, but creates unnecessary reading tax. "Masthead" is easily replaced with "site header" across both the lecture and the figure, which solves the problem cleanly without requiring a callout box.

[ ] PROPER EXAMPLE (Tier 1 - Pruning): replace replaceable jargon with plain English across text and figures:

> Declares the site header container and single source of reader data truth.

## Guided Build | 26 | Calm Direct Instruction for Assembly Steps #2026_09_20_04_group_2 revised by #2026_09_20_25_group_1, #2026_09_20_26_group_1, and #2026_09_20_30_group_1

[ ] Narrate each assembly step as direct, calm instruction guiding the developer at the keyboard.
[ ] Point to specific line numbers, attributes, or function parameters when explaining mechanics, but avoid repetitive screen-reading formulas (do not open every paragraph with "Look at line X" or end every step with "To recap this step").
[ ] Connect code to developer intent and engine behavior naturally.
[ ] Explain the physical consequence before stating the rule (show what breaks or locks before asking the student to memorize a rule).
[ ] Acknowledge simpler alternative approaches before explaining why the current architecture is required (for example, "Mind you, the easiest way...").

[ ] PROPER EXAMPLE: make sure you follow this example, direct instruction with child props and forward link:

> Now look at line 6: `<LiveSearchInput query={query} onChange={setQuery} />`. We have not coded the child component `LiveSearchInput` yet. But right here in the parent, we decide what data it needs: the parent owns the search text in the variable `query`, and passes the callback function `setQuery` to the prop `onChange` so the child component can report keypresses. We will build the component `LiveSearchInput` next in Step 2.

Notes: Direct instruction with a line address, child props explained in plain words, and a forward link to Step 2.

[ ] PROPER EXAMPLE: make sure you follow this example, a warning charged with its physical consequence:

> If you ever bind `value` without an `onChange` handler, React locks the field into a read-only input and the user cannot type a single letter. When you take control from the browser, you must always provide both.

Notes: The reader sees the locked field before they memorize the pairing rule.

## Guided Build | 27 | Three-Step Architectural Comparisons (Scene, Engine, Punchline) #2026_09_20_04_group_3

[ ] When comparing two architectural approaches or systems, structure the comparison in three clear moves:
    1. **Physical Scene**: What the user or developer physically does, in short, clear sentences.
    2. **Engine Behavior**: What the engine executes or leaves idle during each action, stated as plain facts.
    3. **Punchline**: A single-condition deciding sentence that gives the reader a clear, quotable rule of thumb.
[ ] Avoid compressing two systems into a single convoluted sentence with multiple subordinate clauses.

[ ] PROPER EXAMPLE: make sure you follow this example, decomposing a comparison cleanly:

> Think about how a reader uses this correction form.
> They type their name. Then they write a few sentences of feedback.
> While they are typing, React does not need to know a single letter.
> We only need that text once: the moment they click submit:

Notes: Scene, scene, engine, punchline. Four short sentences, each carrying one concept.

[ ] COUNTER-EXAMPLE: do not follow this bad example, compressing the comparison into a single sentence:

> While the search bar has to react to every keypress, the correction form only needs its data on submit, making it the better choice for this workflow.

Notes: One sentence holding two systems, two engines, and a verdict.

## Guided Build | 28 | The Upward Wire Circuit (Anti-Hand-Waving Callback Tracing) #2026_09_20_06_group_1

[ ] When explaining child components that trigger callback props (`onChange`, `onSelect`, `onSubmit`, `onSave`), strictly avoid dismissive hand-waving phrases like "it simply calls the callback", "it just invokes the prop", or "the callback updates the parent".
[ ] Trace the complete 5-point data circuit:
    1. **The Question**: Voice the reader's question directly ("Where does `onSelect` come from?").
    2. **The Parent Origin**: Point back to Step 1 where the parent declared the state setter or handler and bound it in JSX.
    3. **The Communication Channel**: Explain that the child owns no state and does not know what the value is used for; it only holds a communication line.
    4. **The Physical Execution**: Trace the exact call that runs in the parent's memory when the user clicks or types.
    5. **The Community Category**: Name the architectural pattern as standard **inverse data flow** (data flows down through props, user actions flow up through callbacks).

[ ] PROPER EXAMPLE: make sure you follow this example, the canonical Upward Wire deconstruction:

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

Notes: Asks the reader's question, traces back to parent JSX binding, clarifies state ownership, traces parent execution, and names inverse data flow.

[ ] COUNTER-EXAMPLE: do not follow this bad example, dismissive hand-waving with an untraced prop:

> Look at the button click handler on line 6: `onClick={() => onSelect(room)}`. When a reporter clicks a channel button, this handler does not connect to websockets, fetch messages, or touch DOM nodes. It simply invokes onSelect with the chosen room name. The parent updates roomId, and React handles the rest.

Notes: Uses "simply invokes", leaves `onSelect` untraced, and describes parent updates as magical telepathy.

## Guided Build | 29 | The Negative Counterfactual Circuit (Anti-Platitude Architectural Separation) #2026_09_20_07_group_1

[ ] When explaining why two responsibilities are separated across components, strictly avoid empty architectural praise or textbook platitudes (such as "the cleanest architecture keeps X separate from Y", "Component X is a pure presenter", or "this promotes clean separation of concerns").
[ ] Justify every architectural boundary using the 4-part counterfactual circuit:
    1. **The Provocation Question**: Ask directly what happens if the responsibilities are merged into a single component (`"What would happen if [Component A] handled [Responsibility B] directly?"`).
    2. **The Concrete Disaster**: Describe the tangible runtime, state, or maintenance breakdown that immediately occurs (show how memory gets trapped, child views lose access, re-renders churn unrelated DOM trees, or testing becomes impossible).
    3. **The Physical Invariant**: Define the architectural boundary by what is physically absent in code (explicitly state: `"zero useState and zero useEffect"` or `"zero network awareness"`).
    4. **The Decoupling Proof**: Prove the architectural benefit through two concrete, symmetric refactoring scenarios:
       * "1. If tomorrow you replace [UI element A] with [alternative UI], you touch zero lines of [backend/network code]."
       * "2. If you swap [backend/network service B] for [alternative service], you touch zero lines of [UI code]."

[ ] COUNTER-EXAMPLE: do not follow this bad example, vague architectural praise:

> Mind you, the cleanest architecture keeps interactive controls separate from side-effect boundaries. ChannelSelector is a pure presenter: it renders three buttons, highlights the active one, and forwards clicks upward.

Notes: Uses unbaptized buzzwords, offers unearned praise, and never explains what breaks if merged.

[ ] PROPER EXAMPLE: make sure you follow this example, crystalline counterfactual justification:

> What would happen if `ChannelSelector` opened the websocket connection itself?
> 
> If you put the `useEffect` or socket connection inside `ChannelSelector`, the navigation buttons would be trapped managing network sockets, reconnection timers, and message buffers. Worse, the chat message area in `ChatRoom` would have no way to access that socket without messy prop-drilling or global state hacks. You would have buttons and network protocols tangled in a single file.
> 
> By separating them, `ChannelSelector` owns zero `useState` and zero `useEffect`. It is a pure presenter: given the same `activeRoom` string and `onSelect` callback, it will always render the exact same three buttons.
> 
> This separation gives you two concrete superpowers:
> 1. If tomorrow you replace the button pills with a dropdown `<select>` menu, you touch zero lines of websocket code.
> 2. If you swap the websocket protocol in `ChatRoom` for a mock test service, you touch zero lines of button code.

Notes: Opens with provocation question, describes the disaster, states the physical code invariants (zero useState/useEffect), and proves decoupling with two symmetric refactoring scenarios.

## Guided Build | 30 | Explicit Component & File Relationships #2026_09_20_13_group_1

[ ] Make relations between entities explicit rather than cryptic whenever code connects two files, components, or props.
[ ] State the exact count and names of all components involved.
[ ] Explain why the syntax differs (such as named exports requiring curly braces because multiple components share a file).
[ ] Clarify why one component is imported while another remains internal to the module. Avoid shorthand that merely names a technical category without explaining the structure.

[ ] COUNTER-EXAMPLE: do not follow this bad example:

> Notice line 2: `import { ArticleList } from './ArticleComponents.jsx'`. Here we use curly braces because `ArticleList` is a named export from a shared module.

Notes: Leaves an unexplained mismatch between a plural file name and a singular import, never mentions `ArticleCard`, and treats curly braces as an arbitrary syntax rule.

[ ] PROPER EXAMPLE: make sure you follow this example, explaining the full architectural relationship:

> Notice line 2: `import { ArticleList } from './ArticleComponents.jsx'`. The file name is `ArticleComponents.jsx` in the plural because it encodes two components, not one (`ArticleList` and `ArticleCard`). Because multiple components share this file, they cannot use a single default export and must be declared as named exports, which is why this import requires curly braces: `{ ArticleList }`. The parent imports only `ArticleList` as the feed container; `ArticleCard` is composed internally inside that file and does not need to be imported here.

Notes: States count and names upfront, explains that curly braces exist because multiple components share the file, and clarifies why only `ArticleList` is imported by the parent.
