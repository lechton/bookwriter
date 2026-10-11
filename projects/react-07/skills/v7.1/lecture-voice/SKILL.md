---
name: lecture-voice
description: Governs the voice, stance, narrative flow, and technical-description standard of a production lecture; use when writing or revising lecture prose.
---

# Lecture Voice

This skill governs how a production lecture speaks: the author's stance, the reader the prose serves, the way concepts are defined, the standard for technical descriptions, the rhythm of sentences, the opening lines, callouts, and vocabulary. It applies to every sentence of lecture prose, from the first opening line to the last line of the summary. Structural rules such as section skeletons, tables, and code-block mechanics live in `lecture-structure` and `code-blocks`.

Digests: `skills/old-instructions/instructions.md` (stance, empathy, lexical audit, lecture format, opening ladder, callouts) and `skills/old-instructions/AUTHOR-BRIEF.md`.

## Stance | 01 | The Developer-at-the-Keyboard Stance

- [ ] Is the lecture written from the perspective of the developer sitting at the keyboard, guiding the reader through concrete files, editor tabs, and terminal commands?
- [ ] Does the text avoid the disembodied engine voice, focusing on what physically appears in the developer's code and browser rather than internal reconciler mechanics?
- [ ] Does the prose avoid corporate brochure-speak (such as advertising product guarantees)?
- [ ] Are internal engine APIs avoided unless they physically appear in the reader's code or are necessary to explain observable behavior?
- [ ] Does the lecture respect the Reader Horizon principle, anchoring contrasts strictly to physical realities the student already knows (plain static files, browser window, local machines versus backend servers)? #2026_09_21_06_group_1

- [ ] Does the opening paragraph of Section 1 establish a concise, universal 2-to-3 sentence engineering anchor stating the universal web reality, the architectural friction, and the React mechanism, avoiding theatrical newsroom melodrama, canned retrospective formulas ("Think back to..."), or premature code syntax dumps? #2026_09_25_10_group_1
- [ ] Does each lecture establish an organic opening hook tailored to its specific engineering role (such as dynamic data projection, interactive state transitions, or foundational markup baselines), allowing voice and framing to vary naturally across sequential lessons? #2026_09_25_08_group_1 revised by #2026_09_25_10_group_1
- [ ] When stepping to the editor in paragraph 2, does the prose speak directly from the developer at the keyboard (`"you assign the user's role to a variable"`, `"you query the browser using document.getElementById"`), avoiding the disembodied observer voice (`"a script must locate"`, `"the script checks"`)? #2026_09_25_04_group_1 revised by #2026_09_25_10_group_1
- [ ] Are interface elements grounded with tangible HTML tags, IDs, and selectors rather than vague generalizations (`"every matching HTML tag"`)? #2026_09_25_04_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Speaking from inside engine abstractions:

> When a Promise settles, the Transition wraps the Execution Boundary inside the Priority Lane.

Notes: Speaks from inside the engine using invented abstractions; none of it appears in the reader's editor.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Disembodied textbook opening with premature abstractions and missing anchors:

> In standard browser scripting, we manipulate interface nodes with imperative queries. To update a user's name on The National Times, a script must locate every matching HTML tag. The script checks that each node exists. Then, it manually overwrites the element text content. The browser document is treated as an external mutable database. It must be queried node by node whenever anything changes.

Notes: Cold and academic. Suffers from premature abstraction (taxonomic jargon before code), disembodied observer voice ("a script must locate/check" instead of developer at the keyboard), and missing tangible anchors (vague "matching HTML tag" rather than real markup). #2026_09_25_04_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Premature Rain of Details (Machine-Gun Syntax Dumping):

> You assign Hellen Jones's breaking news title to a local variable: `const headline = 'Transit Strike Paralyzes Downtown'`. To display that title in the article header, you write `<h2>headline</h2>`. When the browser refreshes, the screen does not show the transit report, it renders the literal seven letters "headline". The variable exists in JavaScript memory, but static JSX treats the tag contents as plain character text.

Notes: Disorienting and frantic. Throws a rain of micro-details at the reader in sentence one, dumping variable syntax, string literals, and markup debugging steps before establishing where the reader is or what high-level problem we are solving. A normal introduction provides a calm conceptual umbrella first. #2026_09_25_10_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Theatrical Domain Fan-Fiction and Newsroom Melodrama:

> In The National Times newsroom, articles and live dispatches arrive around the clock. When Hellen Jones files a breaking investigation into municipal transit, her headline, byline, and published timestamp exist as active variables in application memory. But for a reader arriving at the website, data residing in JavaScript memory remains invisible until it is projected into the visual structure of HTML elements. As the engineer authoring the article header component, your task is to weave those live JavaScript variables directly into the tags on screen without resorting to fragile string concatenation or manual DOM searching.

Notes: Pretentious and overwrought. Wastes reader energy manufacturing atmospheric newsroom melodrama for an engineering reality that is universal to every website on earth. The National Times belongs in code identifiers and component files, never in decorative prose novelizations. #2026_09_25_10_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Canned Retrospective Platitudes:

> Think back to how you render data in traditional browser scripts. In plain JavaScript, you declare a variable holding an article headline:

Notes: Formulaic and robotic. AI models default to recycling nostalgic icebreakers ("Think back to...", "Remember the days when...", "In traditional web development...") across sequential lectures. Authors must eliminate conversational warmup formulas. #2026_09_25_10_group_1

- [ ] PROPER EXAMPLE: The 3-Sentence Universal Engineering Anchor and Paragraph 2 Keyboard Step:

> Every web interface exists to display dynamic data (such as a user's name, an article headline, or the current time). In static HTML, all content is hardcoded as plain text, while in modern applications that data lives inside JavaScript variables. To connect the two, React introduces curly braces `{}`: an inline evaluation window that lets you project live JavaScript expressions directly into your markup.
> 
> To see this in action on The National Times, you open your editor to build the article header component: `ArticleHeader.jsx`. You assign the journalist's title to a variable: `const headline = 'Transit Strike Paralyzes Downtown'`. If you attempt to display that title using standard markup like `<h2>headline</h2>`, the browser renders the literal word "headline" instead of the article title.

Notes: Perfect two-stage opening rhythm: (1) Sentence 1: Universal Web Reality (every website displays dynamic data from JavaScript variables). (2) Sentence 2: The Architectural Gap (static markup is hardcoded; manual synchronization is fragile). (3) Sentence 3: The React Mechanism (curly braces `{}` open an inline evaluation window). (4) Paragraph 2: Stepping to the keyboard. Only now do you introduce The National Times component (`ArticleHeader.jsx`), the variable (`headline`), and the physical friction on screen. Zero melodrama, zero canned platitudes, zero premature detail rain. #2026_09_25_10_group_1

- [ ] PROPER EXAMPLE: Written from the developer at the keyboard:

> You write `useActionState` once, at the top of your component. From that line down, the loading flag, the error message, and the form data all live in one place, and you delete the three `useState` hooks you used to juggle.

Notes: Every clause is something the developer types, deletes, or sees on screen.

## Stance | 02 | Empathetic Anticipation and Probabilistic Pitfall Framing #2026_09_21_12_group_1 revised by #2026_09_27_05_group_1

- [ ] Does the author anticipate what is changing for the developer, what will look counter-intuitive, and what terms might confuse?
- [ ] **The Probabilistic Pitfall Framing Standard (Anti-Absolute-Error Projection)**: Does the prose present cognitive traps, naive attempts, and developer mistakes as *possible, understandable scenarios* rather than absolute dogmatic assertions about what a beginner "will do" or "assumes"? Are pitfalls introduced with empathetic, probabilistic phrasing (*"a junior developer may fall into this trap"*, *"it is possible that a student of React may encounter this friction"*, *"we sometimes see developers make this assumption because of X"*), always articulating the intuitive reason behind the impulse (*"they may think this because of that"*) rather than patronizing the reader with dogmatic generalities (*"beginners always assume"*, *"they view an application as"*...)? #2026_09_27_05_group_1
- [ ] Is the architectural baseline established through direct code comparison or concrete DOM mechanics, without conversational warm-ups or retrospective platitudes? #2026_09_25_10_group_1
- [ ] Is surprising syntax addressed directly in prose before the reader experiences confusion (for example, pointing out the absence of `e.preventDefault()`)?
- [ ] Are technical crossroads seized as opportunities to teach fundamental mechanics following the [pedagogical-crossroads](../pedagogical-crossroads/SKILL.md) skill? #2026_09_21_12_group_1
- [ ] Are planning meta-labels (such as "1. Novelty:", "2. Weirdness:", or "Cognitive Inference") kept out of the lecture text?

- [ ] PROPER EXAMPLE: Introducing a pitfall as an understandable, possible scenario:

> When structuring multi-section interfaces, it is possible that a student of React may fall into the flat-file trap. They may think that because two components sit side by side on the screen, their local variables can be shared directly across function lines. We sometimes see junior developers attempt this horizontal reach because traditional template scripts often scanned global markup.

Notes: Respectful and empathetic. Introduces the trap as a possible scenario, validates why someone might think that way ("they may think this because of that"), and avoids claiming all beginners make that mistake. #2026_09_27_05_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Dogmatic, absolute error projection:

> When developers first start building multi-section layouts, they view an application as a flat collection of files and pasted HTML snippets. They assume that because two sections sit next to each other on the screen, they can freely share variables.

Notes: Patronizing and dogmatic. Universally projects an intellectual error onto every beginner as an inevitable character flaw rather than framing it as a possible, understandable scenario. #2026_09_27_05_group_1

## Stance | 03 | Universal Everyday Engineering Problems #2026_09_20_27_group_1 revised by #2026_10_07_05_group_1 and #2026_10_11_05_group_1

- [ ] In code examples and component implementations, is the engineering problem grounded in universal, everyday web UI widgets that any basic computer user immediately recognizes (such as an item counter, a shopping cart, a message box, a like button, a ticket order, or a search input) rather than generic foo/bar placeholders or contrived industry jargon? #2026_10_07_05_group_1 revised by #2026_10_11_05_group_1
- [ ] Are the pieces inside those widgets the plain parts of a page that need no explaining: a title, a name, a date, a time, a colour, a counter, a photo? A niche UI element (a badge, a pill, a chip, a toast) makes the reader first picture what it looks like before the lesson can start. #2026_10_11_05_group_1
- [ ] Does the prose avoid forced corporate or newsroom lore (no fictional publishing house, editorial desk, promotion booth, or newsroom workflow)? #2026_10_07_05_group_1
- [ ] Are variable, component, and state names chosen from plain, universal vocabulary (such as `count`, `tickets`, `likes`, `message`, `items`, `title`, `active`) rather than specialized or idiosyncratic jargon (such as `byline`, `wire`, `masthead`, `freePasses`, `promotionDesk`)? #2026_10_07_05_group_1
- [ ] If an engineer name is used for empathy, does it appear simply as a developer writing code, with zero workplace drama or fictional backstory? #2026_10_07_05_group_1
- [ ] Are applications and scenarios staged one by one with dedicated sentences, avoiding compound "X or Y" scenario cramming? #2026_09_21_06_group_1

- [ ] PROPER EXAMPLE: Universal everyday UI widget with plain names:

> ```jsx
> export default function TicketOrder() {
>   const [tickets, setTickets] = useState(0);
>   function addThree() {
>     setTickets(t => t + 1);
>     setTickets(t => t + 1);
>     setTickets(t => t + 1);
>   }
>   return <button onClick={addThree}>Tickets: {tickets}</button>;
> }
> ```

Notes: Clear, universal, everyday concept. Any human understands adding three tickets to an order. Zero newsroom jargon. #2026_10_07_05_group_1

- [ ] COUNTER-EXAMPLE: Contrived domain hybrid and idiosyncratic jargon:

> Clara builds a free pass promotion desk for readers at The National Times, using a `FreePasses` component connected to an editorial dispatch container.

Notes: Cryptic, contrived fiction. "Free pass promotion desk" and "editorial dispatch" are bizarre jargon that alienates both beginners and experienced developers. #2026_10_07_05_group_1

- [ ] COUNTER-EXAMPLE: A niche element as the lesson's problem (Lecture 7, first version):

> A story without a badge gets an empty `<span class="badge">`, and once the badge has a background color, the reader sees an empty pill.

Notes: The reader must first picture a badge, then a pill, before the defect lands. The same defect with a plain part of the page needs no picture: "A story without an author still shows the word 'By' with nothing after it." #2026_10_11_05_group_1

## Stance | 04 | The Reader's Code Is the Picture #2026_09_20_27_group_1 revised by #2026_10_10_01_group_7

- [ ] Is a mechanism explained with the lesson's own code, values, and screen: the line that runs, the number it computes, what the screen shows? A story from outside programming (a waiter, a kitchen, a photograph) makes the reader translate it back into code, and its details rarely match the mechanism. #2026_10_10_01_group_7
- [ ] When a sequence is hard to hold in the head, is it drawn as an ASCII diagram with the lesson's real values (`lecture-structure` Section 07) instead of told as a story? #2026_10_10_01_group_7

- [ ] PROPER EXAMPLE: "With `count` at 0, `setCount(count + 1)` three times queues the same step three times: replace with 1. The screen shows 1." #2026_10_10_01_group_7

- [ ] COUNTER-EXAMPLE: "Calling `setCount(count + 1)` three times asks the waiter for dish number one three times. The kitchen cooks that single dish once." Notes: The reader must map waiter, dish, and kitchen back onto setter, value, and render, and "cooks once" says nothing about three queued steps that each give 1. #2026_10_10_01_group_7

## Language & Readability | 05 | The Reader-Centered Standard (CEFR B2 & Active Voice)

- [ ] Is the text written in plain upper-intermediate English (CEFR B2) using common words and direct Subject-Verb-Object structures?
- [ ] Are rare or esoteric terms replaced with everyday vocabulary?
- [ ] Is language simplified without degrading technical depth or accuracy?
- [ ] **The Anti-Pompous-Dressing Standard (Canonical Nouns + Plain Human Verbs)**: Does the text strictly ban inflated, pseudo-intellectual corporate and academic phrasing used to artificially dress up technical concepts? Are canonical technical nouns (`props`, `state`, `declarative UI`, `virtual DOM`) coupled directly with simple, everyday human verbs (`store`, `pass`, `display`, `check`, `read`), avoiding empty rhetorical padding: #2026_09_26_12_group_1
    * ✕ `"lives authoritatively in memory"` ➔ `stored in JavaScript variables`
    * ✕ `"strictly a write-only projection surface"` ➔ `used only to display output`
    * ✕ `"determine application truth"` ➔ `figure out what the data is`
    * ✕ `"drive business logic"` ➔ `run your application code`
    * ✕ `"governing operational paradigm"` ➔ `core design rule`

## Language & Readability | 06 | Sentence Length and Single-Action Focus #2026_09_20_21_group_1 revised by #2026_09_21_04_group_1 and #2026_10_10_01_group_7

- [ ] Can a tired reader follow each sentence on the first read? Most sentences carry one event or one fact and land between 7 and 15 words; a longer sentence is fine when it reads in one breath, and a sentence that makes the reader hold two clauses at once is split. The length report of `diagnose-lecture` points at sentences to reread; it does not decide. #2026_09_20_21_group_1 revised by #2026_10_10_01_group_7
- [ ] Does the text avoid clause chaining and participial stacking?
- [ ] Is each sentence restricted to a single technical mechanism or physical event?
- [ ] Are short sentences kept calm and unhurried rather than compressed into dense fragments?
- [ ] Are steps that follow one another told as short sentences in order, with bullets only where the reader must tell two look-alike things apart? #2026_10_10_01_group_7

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Chaining multiple clauses into a single breathless sentence:

> Instead of the reserved JavaScript keyword `class`, it assigns `className`, adhering strictly to JSX naming conventions while mapping directly to the DOM property.

Notes: 23 words across four chained clauses. Forces the reader to hold three distinct thoughts in memory.

- [ ] PROPER EXAMPLE: Chained thoughts broken into single-idea sentences:

> Notice the attribute: it uses `className` instead of `class`. In JavaScript, `class` is a reserved keyword. React uses `className` to avoid that conflict and map directly to the browser's native DOM property.

Notes: Three short, active sentences (7, 7, and 15 words). Contrast lands first, reason second, engine consequence third.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Compressing four conceptual stages into one sentence:

> When a user submits the form, React intercepts the native submit event automatically, gathers all contained inputs that declare a name attribute into a native browser FormData instance, and passes that dictionary directly to the action function.

Notes: Four conceptual stages compressed into one breathless comma-spliced sentence.

- [ ] PROPER EXAMPLE: Lucid progression across short sentences:

> A form may consist of one or more input fields receiving data from the user, assigning the content of each input text in an attribute named `name`. When a user submits the form, React intercepts the native submit event automatically. The named fields from the various inputs all get collected into a native browser `FormData` dictionary. This dictionary then gets passed directly to the action function.

Notes: One idea per sentence: physical basics first, trigger second, data collection third, handoff fourth.

## Language & Readability | 07 | Explicit Entity Qualification (The "What Is What" Rule) #2026_09_20_23_group_1 revised by #2026_10_10_01_group_7

- [ ] Is every code entity introduced with its role the first time a paragraph names it ("the component `ReaderGreeting`", "the prop `readerName`", "the `<span>` element", "the property `author.name`"), and is its plain name enough after that? #2026_09_20_23_group_1 revised by #2026_10_10_01_group_7
- [ ] When "it", "this", or "that" could point to two things, is the noun repeated instead? Two objects, two values, or a variable and its setter in one paragraph need their names each time; one thing alone can be "it". #2026_10_10_01_group_7
- [ ] Do component references distinguish syntax roles (e.g. "the component `ComponentName`" for function/module, and "the component `<ComponentName />`" for JSX usage)?
- [ ] Are bare unqualified tokens, split identifiers, and "presenter" jargon avoided? #2026_09_21_10_group_1

- [ ] PROPER EXAMPLE: "The spread copies `profile` into a new object. The new object has a new address, so React sees a change. The old object stays as it was." (Two objects; each is named every time.) #2026_10_10_01_group_7

- [ ] COUNTER-EXAMPLE: "The spread copies `profile` into a new object. It has a new address, so React sees it. It stays as it was." Notes: The first "it" is the new object, the second "it" is the change, and the third is the old object; the reader cannot tell. #2026_10_10_01_group_7

## Language & Readability | 08 | Paragraph Cohesion and Key Term Highlighting #2026_09_20_27_group_1

- [ ] Do paragraphs remain cohesive and focused (typically 2 to 4 sentences grouping related thoughts together)?
- [ ] Are key terms bolded upon first introduction when they represent real, standard React or web platform concepts?
- [ ] Does key-term highlighting support scannability without cluttering the page with excessive bolding?

## Explaining Concepts | 09 | The Three-Part Anchor (Write, Delete, Browser Consequence)

- [ ] Does every feature explanation anchor in three tangible facts: (1) what you physically write in the file, (2) what manual boilerplate is eliminated, and (3) what the browser physically executes?
- [ ] Are concrete keystrokes typed into the file stated so the concept has a physical home?
- [ ] Is the eliminated manual boilerplate named so the relief is felt concretely?
- [ ] Is the physical browser behavior described clearly?

## Explaining Concepts | 10 | Behavior-First Definitions Over Dictionary Jargon #2026_09_21_04_group_1 revised by #2026_10_11_05_group_2

- [ ] Does the text define concepts through runtime behavior rather than compressed academic dictionary definitions?
- [ ] In bullet points and lists, are colon-appositive noun fragments avoided in favor of complete sentences naming physical files and actions?
- [ ] Are new concepts introduced starting from the closest known action from earlier in the course?

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Abstract dictionary definitions:

> Server-side rendering: generating dynamic HTML on a server per incoming request.

Notes: Connects words to words; nothing runs, moves, or touches a pixel.

- [ ] PROPER EXAMPLE: Definition grounded in runtime behavior:

> With server-side rendering, your component runs on the server. It returns HTML. The server sends that HTML to the browser, and the reader sees your article text before any JavaScript has loaded.

- [ ] Is a new mechanism spelled out on the reader's own code: what moves, from where, to where, and what the reader can picture? A one-line summary in the engine's terms is correct but cryptic to someone meeting the idea for the first time. #2026_10_11_05_group_2

- [ ] COUNTER-EXAMPLE: Correct, but cryptic on first meeting:

> React puts that `<h2>` into the props object of `CardContainer`, under the key `children`.

Notes: "Props object" and "under the key" describe the engine. The reader is not told that the whole content between the tags moves, or where it ends up. #2026_10_11_05_group_2

- [ ] PROPER EXAMPLE: The same mechanism spelled out:

> Look at what sits between `<CardContainer>` and `</CardContainer>`: the whole line `<h2>Transit Accord</h2>`. React does not throw it away. It takes everything written between the opening tag and the closing tag and hands it to `CardContainer` as a prop. That prop is always called `children`; you do not choose the name. You can picture it like this: `<CardContainer>` the children are here `</CardContainer>`.

Notes: The reader sees which code moves, who moves it, where it arrives, and what it is called, and gets a picture to keep. The compiled `_jsx` call can follow as confirmation. #2026_10_11_05_group_2

Notes: Three short sentences, each one a physical event: code runs, HTML travels, the reader sees text.

## Explaining Concepts | 11 | The Native Default and Framework Behavior #2026_09_20_03_group_1 revised by #2026_09_20_27_group_1

- [ ] When defining load-bearing concepts, is the relationship to the plain web platform structured around the Native Default (what the browser does with zero JS) and the Framework Behavior (how React governs the data)?
- [ ] Are concepts introduced organically through problem contrast rather than formulaic question headers?
- [ ] Does the definition close with a clear statement naming who dictates and what is guaranteed?

- [ ] PROPER EXAMPLE: Platform concept defined by default and invariant:

> What is a **controlled input**? React draws the line between two kinds of input: the **controlled input**, controlled by React, and the **uncontrolled input**, controlled by the browser. In normal HTML, an input controls itself: when you type a letter, the browser's native engine directly stores that letter and paints it on screen, and no JavaScript needs to be involved. Leave the input in that state and React calls it an **uncontrolled input**. In a controlled input, you take that power away from the browser: you write `<input value={state} onChange={...} />`. The input is now locked: it can only display whatever the state variable holds, and React dictates every single character shown on screen.

Notes: Names both sides by who controls them, default sentence explains browser behavior, takeover is one line of code, and closing sentence articulates what is locked.

- [ ] PROPER EXAMPLE: React-only concept defined with memory and setters:

> What is `useState`? When you define an ordinary variable inside your component, the variable forgets everything the moment the function finishes running: type a letter, and the next render rebuilds the variable from scratch. Instead, when you define the variable through `useState`, the hook gives the component a private memory that survives every render. The setter it returns is the only door to that memory: reading the variable gives you the value for the current render, and only calling the setter asks React for the next one. In web development, a variable that automatically drives the screen when it changes is often called a reactive variable, and that reactivity is where React got its name; React's own documentation simply calls it state.

Notes: Opens on reader habit, introduces hook as memory, states setter invariant, and links to documentation.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Compressed dictionary line without context:

> Controlled input: an input element whose value is bound to component state.

Notes: Connects words to words without stating baseline control or invariants.

## Explaining Concepts | 12 | Descriptions Must End in Consequences

- [ ] When explaining a technical entity (configuration file, manifest, architectural decision), does the explanation conclude with what it changes for the developer or end user?
- [ ] Are pure inventory listings completed with operational outcomes?
- [ ] Are tautological justifications avoided by grounding trade-offs in tangible operational criteria? #2026_09_21_06_group_1

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Accurate description with zero operational consequence:

> package.json: The project manifest holding two separate dependency lists. The dependencies list contains react and react-dom, which the browser needs to execute the application. The devDependencies list contains vite and @vitejs/plugin-react, which the computer needs to compile and serve the project locally. The file also defines runnable scripts such as npm run dev and...

Notes: Lists contents without explaining why the separation matters to the user or build output.

- [ ] PROPER EXAMPLE: Concluding on the operational consequence:

> `package.json` is the project manifest, and it holds two separate lists. (a) The runtime dependencies (`dependencies`) are the packages the application needs while it runs: `react` and `react-dom`. The browser loads these when a reader opens the page, so these are the only packages your readers ever download. (b) The development dependencies (`devDependencies`) are the packages your computer needs while you build and serve the project: `vite` and `@vitejs/plugin-react`. They run on your machine, and they never ship to the browser. The split is the point: the build tools stay on your machine, so what the browser loads stays small. The manifest also defines runnable scripts: `npm run dev` starts the development server, and `npm run build` produces the production files.

Notes: Explains why the split matters: build tools stay on the machine, minimizing the bundle downloaded by the user.

## Explaining Concepts | 13 | Multi-Part Comparisons & Parallel Anchors #2026_09_21_04_group_1

- [ ] When explaining two or more parallel concepts, does each item receive a clear lettered anchor (`(a)`, `(b)`) or numbered item (`1.`, `2.`)?
- [ ] Does each item follow a calm sequence: kind-name, tactile definition in complete sentences, contents/mechanics, and consequence?
- [ ] Are reader-facing anchors kept clean, avoiding internal planning tags?

## Lecture Openings | 14 | The Line-2 Interview Question Callout

- [ ] Is the `> INTERVIEW QUESTION | ...` callout placed on line 2 immediately after the title header with no blank line between them?
- [ ] Is the callout followed by exactly one blank line before the opening lines? #2026_10_11_04_group_2
- [ ] Does the callout use exact pattern spacing and recognized typology tagging (`❱ CORE`, `❱❱ MORE`, `❱❱❱ ADVANCED`)?

- [ ] PROPER EXAMPLE: Exact callout pattern:

> `> INTERVIEW QUESTION | ❱ CORE | Why do ordinary variables forget their values between renders, and how does useState remember?`

Notes: Anchored directly on line 2 with exact spacing and typology tagging.

## Lecture Openings | 15 | The Opening Problem #2026_10_11_04_group_2

The opening is the problem the reader recognizes, told in two or three numbered lines. The introduction right after it does the teaching, so the opening only sets up the problem. #2026_10_11_04_group_2

- [ ] Does the lecture body open with 2 or 3 numbered lines, bare under the callout, each one continuous line under 20 words? #2026_10_11_04_group_2
    1. What the reader is building, in the everyday app (Section 03). #2026_10_10_01_group_7
    2. What goes wrong, or what the reader cannot do yet.
    3. Optional: the question, asked plainly.

- [ ] PROPER EXAMPLE: Lecture 14. #2026_10_11_04_group_2

> `1. You built a like button that adds one to a counter.`
> `2. You click it, and the console shows the new number, but the button still shows 0.`
> `3. Why does the screen not change when the variable does?`

Notes: One thing being built, one failure the reader can see, one question. No new term appears; the introduction names state right after. Take the shape, never the lines: each lesson's opening comes from its own problem.

- [ ] COUNTER-EXAMPLE: Lecture 7, written to the old seven beats. #2026_10_11_04_group_2

> `4. Why does every minor design update require editing, complicating, and risking the shared card component?`
> `5. Unused prop tags leave empty placeholder elements on screen, while conflicting layout flags tangle into unmaintainable conditional code.`
> `6. The card component tried to predict every layout permutation instead of letting callers nest custom elements inside an open slot.`
> `7. Today we master container composition with the children prop, forward remaining attributes with rest syntax, and secure overridable defaults.`

Notes: Seven long lines before anything is taught: a danger line, a mystery line, and a promise that lists three mechanisms the reader has not learned.

## Lecture Openings | 16 | Opening-Line Clarity (The Identity Rule)

- [ ] Does every noun in every opening line refer strictly to a human person, visible screen item, code element, or machine event? #2026_10_11_04_group_2
- [ ] Are ambiguous or overloaded words avoided?
- [ ] Do the opening lines use only terms from earlier lessons (props in Lecture 7, for example), leaving every new term to the introduction? #2026_10_11_04_group_2
- [ ] Are everyday verbs preferred over technical terms ("change" over "mutate", "show" over "render")?

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Opening lines with ambiguous words:

> `1. The newsroom desk is live.`
> `2. An editor rewrites the breaking headline.`
> `3. You log the headline at the top of the script.`
> `4. Why only one print?`

Notes: "Desk" could be furniture or a component; "live" could mean deployed or streaming; "editor" could be a human or software; "log" could be a file or verb.

## Callout System | 18 | Callout Types and Strategic Use

- [ ] Are alert callouts formatted using GitHub-style syntax (`> [!TYPE]`) followed by blockquoted lines?
- [ ] Are callouts used according to their specific purpose (`[!TIP]` for interview strategy, `[!NOTE]` for neutral context, `[!KEY]` for core mental models, `[!WARNING]` for pitfalls, `[!CAUTION]` for breaking changes, `[!WILD]` for friction cards, `[!CONVENTION]` for naming conventions)?
- [ ] Is `[!TIP]` the default for actionable interview framing?

- [ ] PROPER EXAMPLE: Signature TIP shape:

> ```markdown
> > [!TIP]
> > **To impress the interviewer:** Most candidates will say "React re-renders the component when state changes." If you want to show deep understanding, explain the snapshot model: the setter does not change the variable in the running code, it asks React to render again with a new value.
> ```

Notes: Opens with `> [!TIP]`, leads with bold label, and frames how to discuss the concept effectively in an interview.

## Callout System | 19 | Authoring Inline Callouts

- [ ] Is each callout focused on a single self-contained point rather than multi-item bulleted lists?
- [ ] Are full component implementations kept in adjacent editor windows outside the callout?
- [ ] Are code snippets separated onto dedicated display lines inside callouts with clear lead-in phrasing? #2026_09_22_10_group_1
- [ ] Are structured JSX or AST transformations formatted across multiple indented lines so the hierarchy is evident? #2026_09_22_10_group_1
- [ ] Do inset code cards inside callouts maintain a uniform 1px perimeter without bold left accent stripes? #2026_09_22_10_group_1
- [ ] Are callouts placed inline immediately after the section that establishes the relevant concept?

- [ ] PROPER EXAMPLE: Code snippets on dedicated lines with clean lead-ins:

> ```markdown
> > [!WILD]
> > **How does JSX compile nested children under the hood?**
> >
> > When nesting elements in JSX:
> > `<ArticleBox>
> >   <Headline title="Breaking" />
> > </ArticleBox>`
> >
> > The JSX compiler converts the inner tag directly into a prop named `children`:
> > `_jsx(ArticleBox, {
> >   children: _jsx(Headline, {
> >     title: "Breaking"
> >   })
> > })`
> >
> > If you pass multiple sibling elements, `props.children` becomes an array of React elements. The `children` prop is not magic; it is simply a standard JavaScript object property populated automatically by the JSX parser whenever tags enclose content.
> ```

Notes: Separates JSX input and compiled output onto dedicated indented lines with concise lead-in phrasing. #2026_09_22_10_group_1

## Callout System | 20 | The "In the Wild" Friction Card ([!WILD])

- [ ] Is `[!WILD]` used to isolate and resolve a single counter-intuitive friction point with an immediate aha?
- [ ] Does the full lesson (problem, broken code, rule, working code) precede the `[!WILD]` card? #2026_09_21_03_group_1 revised by #2026_09_21_08_group_1 and #2026_09_21_09_group_1
- [ ] Is the opening question (6 to 9 words) grounded in earlier text, targeting a trap the reader already saw resolved? #2026_09_21_08_group_1 revised by #2026_09_21_09_group_1
- [ ] Is the Curriculum Dependency Invariant observed inside callouts, avoiding premature concepts? #2026_09_21_03_group_1
- [ ] Are scenario premises staged one by one with concrete human scale, avoiding compound "X or Y" cramming? #2026_09_21_06_group_1
- [ ] Are trade-offs resolved through concrete operational criteria rather than circular tautologies? #2026_09_21_06_group_1
- [ ] Is each appearance limited to at most one `[!WILD]` card per major technical section?

- [ ] PROPER EXAMPLE: WILD card discharging friction with an immediate aha:

> [!WILD]
> **When does submitting a form wipe your screen?** In the early web, a form submit was a navigation command. It requested a new HTML page from the server and wiped the browser's memory clean. When single-page applications arrived, developers added `e.preventDefault()` inside every submit listener to halt that navigation. Forgetting that single line caused a **full-page reload**. All client state in memory vanished instantly. Developers never need to write `e.preventDefault()` anymore. Why? React now prevents the **full-page reload** automatically when handling form actions.

Notes: Opening question is 7 words; every sentence is under 20 words; the aha lands through browser history.

- [ ] PROPER EXAMPLE: WILD card told with the code itself: #2026_10_10_01_group_7

> [!WILD]
> **Why does useFormStatus require a child component?** `useFormStatus` reads the `<form>` that sits above the component calling it. If you call it in the component that returns the `<form>`, there is no form above that component, only below. So `pending` stays `false`, even while the form submits. Move the call into a child component rendered inside the `<form>`, and `pending` turns `true` during the submit.

Notes: Opening question is 7 words; the card names where the form sits and what `pending` shows, so no picture needs translating. An earlier version told it as a reader in a hallway who cannot see a badge inside a room. #2026_10_10_01_group_7

## Callout System | 21 | Dual-Register Key Takeaways

- [ ] Are essential mental models presented in two distinct registers (quotable summary in `[!KEY]`, step-by-step unpacking in subsequent prose)?
- [ ] Do the two registers complement each other cleanly?

- [ ] PROPER EXAMPLE: Presenting a principle in both registers:

> ```markdown
> > [!KEY]
> > A state variable holds one value for the whole render.
>
> When your component function runs, `count` is a constant of that call. The setter stores the next value in React and asks for a new render; it cannot change the constant the running code already holds. That is why a log right after `setCount(5)` still prints the old value, and the next render's log prints 5.
> ```

Notes: Callout provides the quotable rule in plain words; the paragraph proves why it holds with the code and the console. #2026_10_10_01_group_7

## Vocabulary & Baptisms | 22 | New Terms Are Named Together With Their Code #2026_10_11_04_group_1

- [ ] Is every new term introduced to the standard of `lecture-structure` Section 12: named together with the shortest code that shows it, with who does what said plainly, and confirmed by a second tiny example? #2026_10_11_04_group_1
- [ ] Does a large mechanism first show the problem it solves, in the reader's own code, while a small term (a prop name, a syntax form) is simply named and shown? #2026_10_11_04_group_1
- [ ] PROPER EXAMPLE: `lecture-structure/intro-examples.md`, Example 1: **imperative** arrives with the two `querySelector` lines, **declarative** with `<p>{count}</p>`, and a page title confirms the difference. #2026_10_11_04_group_1

## Vocabulary & Baptisms | 23 | Decoding Foundational Primitives #2026_09_20_25_group_1 revised by #2026_10_11_04_group_1

- [ ] When introducing foundational React primitives (`component`, `props`, `JSX`, curly braces, `state`), does the text decode them in plain words: #2026_10_11_04_group_1
    1. **Every symbol**: what the curly braces, the destructuring, or the tag means.
    2. **Both sides of passing**: who writes the value and who receives it.
    3. **Browser or React**: which parts are native DOM elements and which are our components.

- [ ] PROPER EXAMPLE: Lecture 6, passing one prop. #2026_10_11_04_group_1

> The parent writes `<Greeting name="Ann" />`. React collects the attribute into an object, `{ name: "Ann" }`, and passes it to `Greeting` as its first argument. The child writes `function Greeting({ name })`: the braces unpack the `name` key from that object into a variable. Inside the markup, `<p>Hello, {name}</p>` shows "Hello, Ann".

Notes: Each symbol is decoded where it appears, the parent's side and the child's side are both shown, and every sentence says who acts: the parent writes, React collects and passes, the child unpacks.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Dropping a primitive without baptism:

> Look at line 6: `<ReaderGreeting readerName={readerName} />`. We have not coded `ReaderGreeting` yet. But right here in the parent, we establish its contract. The parent owns the reader name and passes it downward as an explicit prop. We will build that child next in step 2.

Notes: Calls `readerName` an "explicit prop" without explaining what a prop is or how the child receives it.

## Vocabulary & Baptisms | 24 | Standard React Vocabulary vs Corporate Jargon #2026_09_20_26_group_1

- [ ] Does the text use standard React and web platform terminology as established in official documentation?
- [ ] Does the prose avoid pseudo-academic buzzwords or reifying routine patterns into fake proper nouns?
- [ ] Is natural React phrasing ("passing props", "receiving props") preferred over legalistic corporate jargon ("establishing a contract")?

## Vocabulary & Baptisms | 25 | The Two-Tier Convention Protocol: Prune First, Decode Second ([!CONVENTION]) #2026_09_21_27_group_1

- [ ] Does the prose avoid idiosyncratic newspaper jargon ("byline", "lede", "dateline", "ticker", "slug") in favor of everyday B2 vocabulary ("article", "journalist", "headline", "news alert", "news feed")? #2026_09_22_04_group_1
- [ ] Is the Two-Tier Convention Protocol followed:
    * **Tier 1 (First Priority: Prune & Replace)**: Replace domain conventions with self-evident everyday English terms across text and figures (e.g. "byline" ➔ "journalist profile", "masthead" ➔ "site header"). #2026_09_22_04_group_1
    * **Tier 2 (Fallback: Inescapable Industry Standard)**: Retain the convention only if it is a universal frontend standard developers must recognize in interviews and libraries ("slug", "accordion", "toast", "drawer").
- [ ] When an inescapable convention is retained, is it decoded using an explicit `> [!CONVENTION]` callout covering Physical Origin, Web Engineering Reality, and Operational Justification?

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Dropping domain jargon without explanation:

> Declares masthead container and single source of reader data truth.

Notes: Uses "masthead" without context, leaving junior developers confused.

- [ ] HALF WAY EXAMPLE: Partial approach to avoid: Explaining a term that could be rewritten:

> > [!CONVENTION]
> > What is a masthead? A masthead is the top section of a newspaper...

Notes: "Masthead" is easily replaced with "site header" across text and figures, avoiding an extra callout box.

- [ ] PROPER EXAMPLE (Tier 1 Pruning): Replacing replaceable jargon with plain English:

> Declares the site header container and single source of reader data truth.

## Vocabulary & Baptisms | 26 | The Kindergarten Noun Standard (Basic Variables & Zero Subculture Jargon) #2026_09_27_07_group_1

- [ ] Are all component props, variables, function parameters, and attribute identifiers named using basic, everyday human nouns that an ordinary person outside of tech understands without explanation (`name`, `title`, `job`, `author`, `date`, `count`, `label`, `text`, `color`)?
- [ ] Are specialized subculture terms from design systems, corporate software architectures, or niche publishing permanently avoided in lesson code, comments, and prose?
- [ ] **The Banned Subculture Jargon List**: Are the following idiosyncratic terms strictly excluded from props, variables, and explanations:
    * **Banned Design-System / Corporate Jargon**: `tone`, `variant`, `intent`, `elevation`, `surface`, `payload`, `orchestrator`, `manifest`, `telemetry`.
    * **Banned Publishing Jargon**: `masthead` (use `site header`, `top bar`, or `title banner`), `lede` (use `intro`), `slug` (use `path` or `url` unless specifically teaching routing slugs).
- [ ] **The 8-Year-Old Reality Test**: If a normal human being outside of tech would not immediately know what the noun means in daily life without a technical explanation, is it rejected in favor of an elementary equivalent (`color` instead of `tone`, `kind` or `type` instead of `variant`, `site header` instead of `masthead`)?

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Importing specialized design-system or enterprise jargon into basic React examples:

> `<CardContainer tone="urgent" surface="raised">`
> `  <h2>Dispatch</h2>`
> `</CardContainer>`

Notes: "Tone" and "surface" are specialized design-system abstractions that confuse students learning fundamental React prop mechanics.

- [ ] PROPER EXAMPLE: Grounding props in basic, universally understood everyday words:

> `<CardContainer color="red" title="Breaking News">`
> `  <h2>Dispatch</h2>`
> `</CardContainer>`

Notes: Uses elementary words ("color", "title") that require zero design-system translation.

## Guided Build | 27 | Meaningful Pedagogical Commentary for Assembly Steps #2026_09_20_04_group_2 revised by #2026_09_20_25_group_1, #2026_09_20_26_group_1, #2026_09_20_30_group_1, and #2026_09_25_03_group_1

- [ ] Does each assembly step provide meaningful architectural commentary explaining the lessons from the code and clear cause-and-effect paths, strictly avoiding mechanical line-by-line recitation or screen-reading formulas? #2026_09_25_03_group_1
- [ ] Does the prose connect code structure directly to developer intent, runtime engine behavior, and design invariants?
- [ ] Is the physical runtime consequence explained before formalizing any architectural rule?
- [ ] Are alternative approaches or naive initial impulses contrasted against the resilient pattern being implemented?

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Mechanical, line-by-line recitation without architectural lessons:

> In line 1, we import React. In line 3, we declare the component function `SiteHeader`. In line 4, we receive the prop `readerName`. In line 6, we render `<LiveSearchInput />`.

Notes: Mechanically translates code syntax into English words line-by-line without explaining architectural intent, data flow, or engineering trade-offs.

- [ ] PROPER EXAMPLE: Meaningful pedagogical commentary explaining architectural intent:

> In the parent component `SiteHeader`, we establish the single source of truth for the reader's session. Even though the child component `LiveSearchInput` has not been written yet, the parent defines its contract upfront: it passes the active search text downward and supplies `setQuery` through the `onChange` callback prop. This keeps state management centralized in the parent while leaving the child completely decoupled and reusable.

Notes: Explains architectural intent (centralized state, contract definition upfront, decoupled child) and data flow rather than mechanically reciting line numbers.

- [ ] PROPER EXAMPLE: Operational causality charged with physical consequences:

> If you bind `value` without an `onChange` handler, React locks the field into a read-only input and the user cannot type a single letter. When taking control of state from the browser, supplying both props ensures user keystrokes remain synchronized with component state.

Notes: The reader sees the locked field and understands the physical synchronization mechanism before the rule is stated.

## Guided Build | 28 | Three-Step Architectural Comparisons (Scene, Engine, Punchline) #2026_09_20_04_group_3

- [ ] When comparing two architectural approaches, is the comparison structured across three clear moves:
    1. **Physical Scene**: What the user or developer physically does, in short clear sentences.
    2. **Engine Behavior**: What the engine executes or leaves idle during each action.
    3. **Punchline**: A single-condition deciding sentence that gives a clear rule of thumb.
- [ ] Does the text avoid compressing two systems into a single convoluted sentence?

- [ ] PROPER EXAMPLE: Decomposing a comparison cleanly:

> Think about how a reader uses this correction form.
> They type their name. Then they write a few sentences of feedback.
> While they are typing, React does not need to know a single letter.
> We only need that text once: the moment they click submit:

Notes: Scene, scene, engine, punchline. Four short sentences, each carrying one concept.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Compressing comparison into a single sentence:

> While the search bar has to react to every keypress, the correction form only needs its data on submit, making it the better choice for this workflow.

Notes: One sentence holding two systems, two engines, and a verdict.

## Guided Build | 29 | The Upward Wire Circuit (Callback Tracing) #2026_09_20_06_group_1

- [ ] When explaining child components triggering callback props (`onChange`, `onSelect`, `onSubmit`), does the text avoid dismissive hand-waving phrases?
- [ ] Does the prose trace the complete 5-point data circuit:
    1. **The Question**: Direct question ("Where does `onSelect` come from?").
    2. **The Parent Origin**: Pointing back to Step 1 where handler or setter was bound.
    3. **The Communication Channel**: Explaining that child holds a communication line without local state.
    4. **The Physical Execution**: Tracing the call that runs in parent memory on interaction.
    5. **The Community Category**: Naming standard **inverse data flow** (data flows down, actions flow up).

- [ ] PROPER EXAMPLE: Canonical Upward Wire deconstruction:

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

Notes: Asks reader's question, traces back to parent JSX binding, clarifies state ownership, traces parent execution, and names inverse data flow.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Dismissive hand-waving with an untraced prop:

> Look at the button click handler on line 6: `onClick={() => onSelect(room)}`. When a reporter clicks a channel button, this handler does not connect to websockets, fetch messages, or touch DOM nodes. It simply invokes onSelect with the chosen room name. The parent updates roomId, and React handles the rest.

Notes: Uses "simply invokes", leaves `onSelect` untraced, and describes parent updates as telepathy.

## Guided Build | 30 | The Negative Counterfactual Circuit (Architectural Separation) #2026_09_20_07_group_1

- [ ] When explaining why two responsibilities are separated across components, does the text avoid empty architectural praise or textbook platitudes?
- [ ] Is every architectural boundary justified using the 4-part counterfactual circuit:
    1. **The Provocation Question**: What happens if responsibilities are merged into a single component?
    2. **The Concrete Disaster**: What tangible runtime, state, or maintenance breakdown occurs?
    3. **The Physical Invariant**: What is physically absent in code (`zero useState and zero useEffect`)?
    4. **The Decoupling Proof**: Two symmetric refactoring scenarios proving the benefit.

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Vague architectural praise:

> Mind you, the cleanest architecture keeps interactive controls separate from side-effect boundaries. ChannelSelector is a pure presenter: it renders three buttons, highlights the active one, and forwards clicks upward.

Notes: Uses unbaptized buzzwords, offers unearned praise, and never explains what breaks if merged.

- [ ] PROPER EXAMPLE: Counterfactual justification:

> What would happen if `ChannelSelector` opened the websocket connection itself?
> 
> If you put the `useEffect` or socket connection inside `ChannelSelector`, the navigation buttons would be trapped managing network sockets, reconnection timers, and message buffers. Worse, the chat message area in `ChatRoom` would have no way to access that socket without messy prop-drilling or global state hacks. You would have buttons and network protocols tangled in a single file.
> 
> By separating them, `ChannelSelector` owns zero `useState` and zero `useEffect`. It is a pure presenter: given the same `activeRoom` string and `onSelect` callback, it will always render the exact same three buttons.
> 
> This separation gives you two concrete superpowers:
> 1. If tomorrow you replace the button pills with a dropdown `<select>` menu, you touch zero lines of websocket code.
> 2. If you swap the websocket protocol in `ChatRoom` for a mock test service, you touch zero lines of button code.

Notes: Opens with provocation question, describes disaster, states code invariants (zero useState/useEffect), and proves decoupling with symmetric scenarios.

## Guided Build | 31 | Explicit Component & File Relationships #2026_09_20_13_group_1

- [ ] Are relations between entities made explicit rather than cryptic whenever code connects two files, components, or props?
- [ ] Does the text state the exact count and names of all components involved?
- [ ] Does it explain why syntax differs (such as named exports requiring curly braces when multiple components share a file)?
- [ ] Does it clarify why one component is imported while another remains internal?

- [ ] COUNTER-EXAMPLE: Pattern to avoid: Cryptic shorthand:

> We write `import { ArticleList } from './ArticleComponents.jsx'`. Here we use curly braces because `ArticleList` is a named export from a shared module.

Notes: Leaves an unexplained mismatch between a plural file name and a singular import, never mentions `ArticleCard`, and treats curly braces as an arbitrary rule.

- [ ] PROPER EXAMPLE: Explaining the full architectural relationship:

> In `App.jsx`, we write `import { ArticleList } from './ArticleComponents.jsx'`. The file name is `ArticleComponents.jsx` in the plural because it encodes two components, not one (`ArticleList` and `ArticleCard`). Because multiple components share this file, they cannot use a single default export and must be declared as named exports, which is why this import requires curly braces: `{ ArticleList }`. The parent imports only `ArticleList` as the feed container; `ArticleCard` is composed internally inside that file and does not need to be imported here.

Notes: States count and names upfront, explains why curly braces exist for shared files, and clarifies parent import boundaries.
