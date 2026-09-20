---
name: lecture-revision
description: Governs the revision and polishing of completed production lectures; transforms mechanical code narration, line-by-line syntax audits, and directive-heavy prose into effortless, B2 tired-reader friendly explanations using the 3-Beat Relay and Zero Syntax Smuggling, while preserving all figures, code comments, and architectural invariants.
---

# Lecture Revision

This skill governs how an existing, completed lecture (`md-lectures/{nn}.md`) and its accompanying figures are revised. It serves as a dedicated refining pass: taking prose that is technically complete and mechanically accurate, and transforming it into clear, effortless, human-friendly reading for a tired developer with a mild headache. #2026_09_20_14_group_1

Digests: skills/lecture-voice/SKILL.md (principles 27, 29, 30), skills/code-blocks/SKILL.md, skills/figures/SKILL.md

## Revision Workflow | 00 | The One-by-One Revision & Build Pipeline (MD ➔ PDF ➔ Verify ➔ Next) #2026_09_20_22_group_1

[ ] When revising a sequence of lectures, strictly execute in a single-lecture cycle:
    1. **Revise Markdown**: Author or edit `md-lectures-revised/{N}.md` for Lecture N.
    2. **Build Immediate PDF**: Compile immediately (`node src/build-lectures.mjs`) to produce `md-lectures-revised-pdf/{N}.pdf`.
    3. **Verify Gate & Layout**: Inspect the build output and PDF (zero Prince warnings, no mid-word hyphenations, no code overflow, 8-gate compliance).
    4. **Advance to Next**: Only after Lecture N's PDF is fully verified and clean, proceed to Lecture N+1.
[ ] Strictly ban batch-authoring all Markdown files before building PDFs: never author `01.md`, `02.md`, `03.md`, `04.md`, `05.md` in bulk and delay PDF generation until the end.
[ ] Why? Batching conceals layout defects, compounds bad patterns across files, and delays feedback. The single-lecture loop ensures each lecture is perfected before the next begins.

[ ] COUNTER-EXAMPLE: do not follow this delayed-batch workflow:

> Revise `01.md`, `02.md`, `03.md`, `04.md`, and `05.md` in one continuous authoring pass. After all 5 Markdown files are written, run `node src/build-lectures.mjs` to build all PDFs at once.

Notes: It fails because any recurring defect (such as the 23-word sentence or repetitive Socratic vignette) gets stamped into all 5 files before the first PDF is ever inspected, multiplying the cleanup cost.

[ ] PROPER EXAMPLE: make sure you follow the single-lecture cycle:

> 1. Revise `04.md`.
> 2. Run `node src/build-lectures.mjs` to build `04.pdf`.
> 3. Verify zero warnings, check sentence length, inspect page layout.
> 4. Once `04.pdf` passes 100%, proceed to revise `05.md` and repeat the loop.

Notes: Instant feedback. Every lecture is verified in print before the next one starts.

## Core Principles | 01 | The Division of Labor #2026_09_20_14_group_1

[ ] Treat code blocks, right-hand comments, and prose as three distinct instruments with zero redundant overlap:
[ ] Let the code block show the exact syntax and runnable structure.
[ ] Let the right-hand comments (`// **DATA FLOW:**`, `// **ACTION:**`, `// **CODE LOGIC:**`) handle line-level execution mechanics and prop roles.
[ ] Let the prose explain the mental model, the cause-and-effect relationship, and the architectural stakes; never re-read or narrate lines of code that the reader can already see in the window above.
[ ] Cut any paragraph whose only purpose is reciting what line 3, line 6, or line 9 contains.

## Core Principles | 02 | Zero Syntax Smuggling in Prose #2026_09_20_14_group_1

[ ] Restrict inline code backticks in running prose strictly to single identifiers, props, and function names (such as `headline`, `setHeadline`, `onUpdateHeadline`, or `onClick`).
[ ] Strictly ban embedding full multi-token statements, variable declarations, or JSX tags inside running sentences (such as `const [x, setX] = useState(...)`, `<HeadlineViewer headline={headline} onUpdateHeadline={setHeadline} />`, or `onClick={() => onUpdateHeadline('...')}`).
[ ] Protect typography and reading flow: long inline code spans cause awkward hyphenations, broken lines in print, and syntax collisions in the reader's working memory; keep all multi-token code inside code fences or scannable bullet points.

## Core Principles | 03 | Banning Eyeball Ping-Pong and Directive Clutter #2026_09_20_14_group_1

[ ] Strictly eliminate relentless imperative tour-guide directives that whip the reader's eyes back and forth across the page ("Notice the function parameters...", "Look at the button click handler on line 6...", "Where does X come from? Look back at Step 1...").
[ ] Replace line-number directives with natural cause-and-effect narrative: describe what the user does on screen, what the component does, and what changes in the system.
[ ] When an address is truly required, state the action first and the address second, so the reader processes the concept before checking the line.

## Core Principles | 03B | The One-Thought Sentence Standard (Banning Clause Chaining) #2026_09_20_21_group_1

[ ] Cap individual sentences at 20 words and ban clause chaining:
    - Express exactly one main idea per sentence.
    - Avoid chaining contrast clauses, participial phrases, and subordinate clauses into breathless run-ons (*"Instead of X, it does Y, adhering to Z while mapping to W"*).
    - When an explanation combines a contrast, a reason, and a consequence, break them into separate, active sentences of 7 to 15 words so each thought lands before the next begins.

[ ] COUNTER-EXAMPLE: do not chain multiple clauses into a single sentence:

> Instead of the reserved JavaScript keyword `class`, it assigns `className`, adhering strictly to JSX naming conventions while mapping directly to the DOM property.

Notes: 23 words across four chained clauses (a contrast, a main action, a participial phrase, and a subordinate clause). In print, this causes mid-word hyphenations ("el-ement", "con-ventions") and forces the tired reader to hold three distinct thoughts in memory before reaching a period.

[ ] PROPER EXAMPLE: make sure you break chained thoughts into single-idea sentences:

> Notice the attribute: it uses `className` instead of `class`. In JavaScript, `class` is a reserved keyword. React uses `className` to avoid that conflict and map directly to the browser's native DOM property.

Notes: Three short, active sentences (7, 7, and 15 words). The contrast lands first, the reason lands second, and the engine consequence lands third. Zero hyphenations, zero breathlessness, effortless to read.

## Core Principles | 04 | The "Why Not the Obvious Way?" Pattern (The Socratic Anticipation Law) #2026_09_20_17_group_1

[ ] Never explain unfamiliar or seemingly redundant syntax (such as Fragments, double curlies, or unquoted attributes) with passive, academic descriptions of layout geometry.
[ ] Voice the exact skeptical question the developer is silently asking at that moment:
    - *"Why not wrap them in a `<div>` instead?"*
    - *"Why not just put quotes around the variable?"*
    - *"Why can't the child just call `document.getElementById` directly?"*
[ ] Structure the explanation in the 4-Beat Socratic Arc:
    1. **Beat 1: The Choice** — State what the component returned or did (`Notice what ArticlePreview returns: a Fragment <>...</>`).
    2. **Beat 2: The Skeptic's Question** — Ask why the intuitive/familiar alternative wasn't used (*Why not wrap them in a `<div>` instead?*).
    3. **Beat 3: The Mechanical Reality** — State what the chosen syntax physically produces in the DOM without fluff (*With the Fragment, the two elements become direct siblings in the DOM, without adding an extra `<div>` that could break CSS rules*).
    4. **Beat 4: The "Imagine If" Disaster and Relief** — Put the developer in the broken scenario, then show the relief (*Imagine if the parent page used CSS Grid or Flexbox: an extra `<div>` would break your layout. Now both elements align directly to your layout tracks without an extra container breaking your styles*).
[ ] Never repeat the same idiosyncratic explanation, metaphor, or specific failure scenario across steps in the same lecture: #2026_09_20_19_group_1
    - Although it is pedagogically necessary to reinforce core concepts across multiple places, an idiosyncratic explanation (such as a specific "Imagine if" broken layout scenario) must never be repeated across steps.
    - Make sure each part of the text offers a unique angle and advances the reader's understanding rather than echoing an earlier explanation.
    - If Step 1 already explained why a syntax choice was made, Step 4 must not repeat that explanation or its failure scenario; Step 4 simply concludes the assembly and explores outward integration.

[ ] COUNTER-EXAMPLE: do not follow this passive, academic description:

> When mounted inside an outer CSS Grid or Flexbox container, these child elements participate directly in layout calculations without an intermediate wrapper div intercepting column or row rules.

Notes: Passive, robotic, and abstract. It sounds like a geometry textbook. It fails to voice the reader's natural question (*"Why not just use a div?"*) and forces them to mentally parse "participate directly in layout calculations."

[ ] PROPER EXAMPLE: make sure you follow this Socratic, conversational breakdown:

> Notice what the component `ArticlePreview` returns: a Fragment (`<>...</>`). Why not wrap them in a `<div>` element instead?
> 
> With the Fragment, the two elements we added (the `<h2>` heading and the `<p>` excerpt) become direct siblings in the DOM, without adding an extra `<div>` element that could break CSS rules. 
> 
> Imagine if the parent page used CSS Grid or Flexbox: an extra `<div>` element would break your layout. Now both elements align directly to your layout tracks without an extra container breaking your styles.

Notes: Conversational and alive. It enters the reader's mind, asks the exact question they were thinking, contrasts the DOM reality, paints the visceral CSS failure, and delivers the relief.

## Core Principles | 04B | The Pre-Example Mechanism Bridge (Auditing the Missing Introduction) #2026_09_20_24_group_1

[ ] During revision, audit the transition between high-level problem motivation and `### Let's Design a Practical Example...`. If the lecture jumps directly into code assembly without introducing the core React primitive, author and insert the missing conceptual section.
[ ] Ensure this section is **dedicated to this particular lecture's topic** (e.g., `### Components as Reusable Blueprints` for Lecture 1, `### The Component Tree as a Living Hierarchy` for Lecture 2, `### Fragments as Invisible Containers` for Lecture 4, `### The JSX Evaluation Window` for Lecture 5).
[ ] In 3 to 4 natural paragraphs, cover:
    - What limitation in plain HTML/JS does this specific feature solve?
    - What is the React mechanism, and how does it work under the hood?
    - What is the non-negotiable rule or syntax trap dedicated to this topic (such as Capitalization for components, single-root return for Fragments, or expression-only rules for curlies)?
    - Which files in our practical scenario will demonstrate it?

[ ] PROPER EXAMPLE: follow this natural, grounded bridge from Lecture 1:

> ### Components as Reusable Blueprints
> 
> In plain HTML, you structure documents using native tags like the `<header>`, `<article>`, and `<button>` elements. 
> 
> However, native HTML tags know nothing about your application logic or subscriber data. Traditionally, developers had to copy and paste HTML markup across separate templates. Then, they attached external JavaScript scripts to add interactive behavior. This separation split structure from logic, creating fragmented and fragile codebases.
> 
> To solve this fragmentation, React unifies markup, style, and logic into a single cohesive structure. This mechanism is called a **component**. A component is a self-contained, reusable JavaScript function. It accepts input data called **props** and returns markup describing a piece of the user interface.
> 
> In React, every component function name must start with a capital letter. **Capitalization** is a strict compiler requirement. It tells React that `<SiteHeader />` is your custom component, while `<header>` is a built-in browser DOM tag. Components can be **nested** inside one another. This allows you to assemble complex pages out of small, focused building blocks.
> 
> To see this in action on The National Times, we organize our site header into three distinct files:
> 1. The **parent component** `SiteHeader.jsx` acts as the orchestrating container.
> 2. The **child component** `ReaderGreeting.jsx` renders the personalized welcome message.
> 3. The **child component** `SubscriberInfo.jsx` displays the subscriber tier details.
> 
> Both child components receive the subscriber's name through the prop `readerName` passed directly from their parent.

Notes: Natural, grounded, and unstiff. It teaches the specific mechanism dedicated to Lecture 1 (components, capitalization, props, nesting) and smoothly sets up the three files before Stage A begins.

## Core Principles | 05 | The 3-Beat Relay Pattern (Upward Wire and Data Flow) #2026_09_20_14_group_1

[ ] Whenever explaining callbacks, props crossing component boundaries, or inverse data flow, replace dense multi-paragraph cross-references with a clean, scannable 3-beat relay.
[ ] Structure the relay in three explicit, ordered beats:
    1. **Beat 1: The Parent owns the truth** — Name the component where state is born and the exact setter that controls it.
    2. **Beat 2: The Parent shares the trigger** — Name the prop that carries the updater down to the child.
    3. **Beat 3: The Child pulls the cord** — Describe the user action in the child, the callback execution, and the immediate state update back in the parent.
[ ] Close the relay by naming the standard architectural term (**inverse data flow**) in bold, showing that data flows down through props and user actions flow up through callbacks.

[ ] COUNTER-EXAMPLE: do not follow this bad example (mechanical checklist overfitting, syntax smuggling, eyeball ping-pong, and triple redundancy):

> Notice the function parameters: we destructure `{ headline, onUpdateHeadline }` directly from props. That matches the contract we established in step 1. `HeadlineViewer` owns zero local state. It relies entirely on its parent to provide the active headline and the function to update it.
> 
> Look at the button click handler on line 6: `onClick={() => onUpdateHeadline('Mars Probe Sends First Signal')}`.
> 
> Where does `onUpdateHeadline` come from? Look back at Step 1 in `HeadlineDesk.jsx`. The parent declared `const [headline, setHeadline] = useState('Global Summit Concludes')`, and then rendered: `<HeadlineViewer headline={headline} onUpdateHeadline={setHeadline} />`.
> 
> Notice what happened: the parent handed its private updater function `setHeadline` to the child under the prop name `onUpdateHeadline`. `HeadlineViewer` does not own state, and it does not know how `headline` is stored. It only holds a telephone line called `onUpdateHeadline`.
> 
> When the editor clicks the button, the native browser `onClick` fires and calls `onUpdateHeadline('Mars Probe Sends First Signal')`. Because `onUpdateHeadline` points directly to `setHeadline`, that call immediately executes `setHeadline('Mars Probe Sends First Signal')` back in `HeadlineDesk`.
> 
> This is standard **inverse data flow**: data flows down through props (`headline`), and user actions flow up through callbacks (`onUpdateHeadline`).

Notes: It bombards the reader with commands (Notice, Look at, Where does it come from?, Look back, Notice what happened). It smuggles long JSX tags and state declarations directly into the middle of sentences. It forces the reader to mentally cross-reference three files across different pages while reading dense prose, and re-narrates lines that are already self-evident from the code fence and its comments.

[ ] PROPER EXAMPLE: make sure you follow this example (B2 tired-reader friendly, effortless to read, 3-beat relay, zero syntax smuggling):

> Notice what the component `HeadlineViewer` accepts in its props: the string prop `headline` and the callback function prop `onUpdateHeadline`.
> 
> This component owns zero state of its own. It cannot decide what headline to show, and it cannot change the headline directly. It is purely a presenter.
> 
> When the editor clicks the **Next Headline** button, how does the parent find out?
> 
> Trace the relay:
> 1. **The parent owns the truth**: Back in the component `HeadlineDesk`, the parent created the setter function `setHeadline`.
> 2. **The parent shares the trigger**: It passed the function `setHeadline` down to the child under the prop `onUpdateHeadline`.
> 3. **The child pulls the cord**: Clicking the button calls `onUpdateHeadline('Mars Probe Sends First Signal')`. That immediately executes the function `setHeadline` back in the parent component `HeadlineDesk`.
> 
> This is React's classic **inverse data flow**: data flows down through props (`headline`), and user actions flow up through callbacks (`onUpdateHeadline`).

Notes: Zero syntax smuggling: every inline code token is a clean, single identifier. Zero eyeball ping-pong: the reader reads down the page smoothly without being commanded to jump back and forth. The 3-Beat Relay turns a complex two-way circuit into an intuitive, memorable story while preserving 100% of the architectural depth, the component contracts, and the official community term.

## Core Principles | 06 | Concrete Specificity Without Vague Abstractions (The "Name Every Actor" Law) #2026_09_20_15_group_1

[ ] When eliminating line-number directives and syntax smuggling, NEVER replace concrete identifiers with vague umbrella abstractions (such as "in-scope variables", "the children", "the elements", or "the parameters").
[ ] Name every actor explicitly using single-token backticks: name the exact variable (`headline`), the exact prop (`author`), and the exact destination component (`AuthorBadge`, `PublishDate`).
[ ] Deconstruct multi-role syntax into numbered roles: if a syntax construct (like curly braces or brackets) performs multiple duties in a snippet (e.g., text interpolation vs prop passing), explicitly enumerate each role so the reader sees how the same symbol serves different architectural purposes.
[ ] Maintain tactile contrast: contrast what React is doing (evaluating live variables during render) against what the developer suffered through in plain JavaScript (string concatenation, manual DOM mutation, or innerHTML surgery).

[ ] COUNTER-EXAMPLE: do not fall into the abstract hand-waving trap:

> **Bad (Abstract Hand-Waving):**
> The curly braces evaluate in-scope variables and pass them as props to the children. The parent component does not concatenate strings or touch the DOM. It declares the values it wants in markup, and React evaluates each expression during the render pass.

Notes: Vague and evasive. Which variables? Which children? What is the heading doing versus the badges? Stripping line numbers without naming the actors turns sharp instruction into murky textbook jargon.

[ ] PROPER EXAMPLE: make sure you follow this concrete, grounded breakdown:

> **Good (Concrete, Grounded, and Effortless):**
> Notice how the component `StoryBanner` uses curly braces in two distinct ways:
> 
> 1. **Text interpolation:** It drops the variable `headline` directly between the `<h1>` heading tags to display the title on screen.
> 2. **Prop assignment:** It uses curly braces inside JSX attributes to hand live data downward: passing the object `author` to the component `<AuthorBadge />`, and the number `timestamp` to the component `<PublishDate />`.
> 
> In traditional JavaScript, you would concatenate strings or manually set element properties. Here, the parent component does zero string surgery and never touches the DOM. It simply declares the variables it needs, and React evaluates each expression during the render pass.
> 
> To recap this step: curly braces act as a bridge into JavaScript, allowing the parent to display dynamic text and pass rich data structures directly to child components.

Notes: Every single actor is explicitly named (`StoryBanner`, `headline`, `author`, `AuthorBadge`, `timestamp`, `PublishDate`) using clean, single-token identifiers. It eliminates all line directives, avoids PDF-fracturing multi-token syntax, and delivers a much deeper mental model than the original code recital.

## Core Principles | 06B | Explicit Entity Qualification (The "What Is What" Law) #2026_09_20_23_group_1

[ ] Never drop bare, unqualified identifiers into prose that force the reader to calculate what an entity is or where it came from.
[ ] Explicitly qualify every entity by its architectural role:
    1. **Component Definition**: When referring to a component as a function, file, or declaration, call it **"the component `ComponentName`"** (e.g., *the component `AuthorBadge`*).
    2. **Component Invocation**: When referring to a component being rendered or mounted in JSX, call it **"the component `<ComponentName />`"** (e.g., *the component `<AuthorBadge />`*).
    3. **HTML Elements**: Always qualify HTML tags with their element role (e.g., *the `<span>` element*, *the `<img>` tag*, *the `<p>` paragraph*). Never drop bare tag names like `span` or `img`.
    4. **Props and Variables**: Always state the container and property path (e.g., *the prop `author`*, *the property `author.name`*, *the variable `headline`*). Never drop bare property names like `name` without stating who owns them.
    5. **Compound Identifier Integrity**: Never split camelCase or compound identifiers with spaces (e.g., strictly ban `avatar Url`; always write `avatarUrl` or `author.avatarUrl`).
[ ] Trace the lineage: state where the data enters and where it lands, so the reader sees the direct bridge rather than having to reconstruct the circuit.

[ ] COUNTER-EXAMPLE: do not follow this unqualified, ambiguous shorthand:

> `AuthorBadge` unpacks `name` inside `span` for text display, and `avatar Url` inside `img` for the image source.

Notes: Vague, fragmented, and broken. Is `AuthorBadge` being defined or invoked? What is `name`? What is `span`? Why is `avatar Url` split with a space? The reader has to stop reading to reconstruct the code in their head.

[ ] HALF-WAY EXAMPLE: better, but still lacks role markers and explicit lineage:

> `AuthorBadge` takes `author` and renders `author.name` in a `span` and `author.avatarUrl` in an `img`.

Notes: Still treats `AuthorBadge` as a bare word and leaves `span` and `img` without explicit element roles.

[ ] PROPER EXAMPLE: make sure you follow this crystal-clear, verbally qualified standard:

> The component `AuthorBadge` receives the prop `author`. It unpacks the property `author.name` inside the `<span>` element for text display, and the property `author.avatarUrl` inside the `<img>` tag for the image source.

Notes: Effortless to read. Every entity is explicitly qualified: the component `AuthorBadge`, the prop `author`, the property `author.name`, the `<span>` element, the property `author.avatarUrl`, the `<img>` tag. Zero mental calculation required.

## Core Principles | 07 | Purpose-Driven Explanations (Banning Robotic Category Labels) #2026_09_20_16_group_1

[ ] When breaking down code steps or multi-role expressions into bullet points, explain the purpose in natural, human developer language.
[ ] Strictly ban compiler spec-sheet labels (such as "Function call evaluation", "Method chain in attributes", "Ternary operator branching", or "Object instantiation").
[ ] Strictly ban formulaic prefix stamps that sound like an enterprise compliance checklist, such as:
    - `**For human readers:**`
    - `**For layout and styling:**`
    - `**For component contracts:**`
    - `**For styling contracts:**`
    - `**For conditional visual theme:**`
[ ] Instead, use purpose-driven action labels that describe the concrete task, decision, or audience in plain English:
    - `**Choosing colors with conditional logic:**`
    - `**Applying inline CSS styles:**`
    - `**Formatting text for display:**`
    - `**Supplying accessible metadata:**`
[ ] Follow the breakdown with a tactile historical contrast: contrast React's declarative expression evaluation against what developers suffered through in plain JavaScript (helper scripts, manual string concatenation, manual DOM injection).
[ ] Enforce the Single Takeaway Rule: strictly ban following a general takeaway sentence with an almost identical "To recap this step:" sentence; if the preceding sentence already states the takeaway, eliminate the echo.

[ ] COUNTER-EXAMPLE: do not follow this robotic, formulaic pattern:

> To apply dynamic styling, `StoryBanner` computes a `bannerTheme` object:
> 
> 1. **For conditional visual theme:** It uses the ternary operator on `isUrgent` to select between an alert background and a neutral card background.
> 2. **For styling contracts:** It passes `bannerTheme` directly to the style prop, mapping camelCase properties like `backgroundColor` and `borderColor` to inline CSS declarations.

Notes: "For styling contracts" and "For conditional visual theme" sound like an enterprise spec sheet rather than an engineer explaining code.

[ ] PROPER EXAMPLE: make sure you follow this natural, human-friendly breakdown:

> Before returning its markup, the component `StoryBanner` creates a plain JavaScript object named `bannerTheme` to calculate the card's appearance:
> 
> 1. **Choosing colors with conditional logic:** It checks the prop `isUrgent` using a ternary operator. If the story is breaking news, it picks an alert red background and border; otherwise, it falls back to a neutral white and gray card.
> 2. **Applying inline CSS styles:** It hands the object `bannerTheme` directly to the `style` prop. React takes those camelCase property names (`backgroundColor` and `borderColor`) and automatically translates them into real browser CSS rules (`background-color` and `border-color`) on the `<article>` element.
> 
> In traditional JavaScript, changing an element's look based on data required manually toggling class names in the DOM or writing helper scripts that mutated `element.style` property by property. In React, you describe your styles as an ordinary JavaScript object, and React applies them to the element during render.

Notes: Natural developer language, zero jargon smuggling, and explains the tangible mechanism (converting camelCase JavaScript properties into browser CSS) without robotic prefix stamps.

## Core Principles | 08 | The Negative Counterfactual Without Platitudes #2026_09_20_14_group_1

[ ] When explaining architectural separation (such as why the child does not hold its own state or why the parent leaves widgets independent), state the physical disaster directly without academic buzzwords or empty praise.
[ ] Ground the disaster in tangible developer pain: lost updates, untracked mutations, parent containers forced to re-render on every keystroke, or child views trapped without access to data.
[ ] Close with two clean, symmetric refactoring superpowers:
    1. If tomorrow you change the UI element, you touch zero state management code.
    2. If you change where the data comes from, you touch zero display markup.

## Core Principles | 09 | Figure and Pipeline Synchronization Guardrails #2026_09_20_14_group_1

[ ] During revision, treat all ````html-figure src="..." caption="..."```` tags as frozen anchors: never delete, rename, or reorder figures without explicit directive.
[ ] Ensure that all props, state variables, and component names used in the revised prose remain 100% identical to the names in the code fences and figures.
[ ] Ensure zero Prince XML build warnings or errors: avoid character entities that break rendering, preserve one continuous line per paragraph (no hard-wrapping), and never use em-dashes.

## Revision Gates | 10 | The 8-Gate Readability Audit #2026_09_20_17_group_1

[ ] Verify the 8 gates on every revised lecture section before completing the revision pass:
    1. **The Smuggling Gate:** Are all inline code backticks limited to single identifiers? (No full JSX tags, no arrow functions, no variable declarations in prose).
    2. **The Ping-Pong Gate:** Have all repetitive commands (*"Look at line X"*, *"Notice the parameter"*, *"Look back at Step 1"*) been replaced by natural cause-and-effect narrative?
    3. **The Socratic Anticipation Gate:** Whenever introducing a syntax choice that has an obvious naive alternative (e.g. Fragments vs `<div>`, unquoted props vs quotes, `createRoot` vs inline mounting), does the prose explicitly voice the reader's question (*"Why not X instead?"*) before explaining the physical consequence, and does each step offer a unique angle without repeating idiosyncratic explanations?
    4. **The Relay Gate:** Are cross-component data flows and callbacks structured as a clean, scannable 3-beat sequence?
    5. **The Actor Gate:** Are all actors explicitly named by identifier and qualified by role ("the component `ComponentName`" vs "the component `<ComponentName />`", "the prop `propName`", "the `<span>` element") rather than hidden behind vague abstractions (*"in-scope variables"*, *"the children"*) or left as bare, unqualified tokens? #2026_09_20_23_group_1
    6. **The Functional-Role Gate:** Are list items and step breakdowns labeled by who or what consumes the data (human readers, search engines, layout engine) rather than abstract grammar categories (*"Function call evaluation"*, *"Method chain"*), and has the duplicate *"To recap this step:"* echo been eliminated?
    7. **The Counterfactual Gate:** Are architectural separations justified through concrete developer pain and closed with two clean, symmetric superpowers?
    8. **The Tired-Reader Gate:** Does the prose read smoothly with short, active sentences (averaging 12 to 18 words, hard-capped at 20 words) free of chained participial clauses (*"adhering to... while doing..."*)? #2026_09_20_21_group_1

