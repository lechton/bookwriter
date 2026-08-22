# Table Of Contents: Svelte 5 Lecture Series

Each entry is one lecture, about one hour of spoken script in the style of `output/lecture_on_state.md`. The source files listed under each title are the documentation files whose material that lecture is responsible for covering. Where a reference module (under `98-reference/`) is the runtime counterpart of a template feature, it is folded into the lecture for that feature so the listener gets concept and API together. Legacy material under `99-legacy/` is reserved for the legacy and migration lectures and is not taught as current Svelte 5.

A word on how this series is sized. The benchmark lecture, the one already written on the state rune, expands a single 1,500-word documentation page into a 10,000-word hour, roughly a sevenfold expansion, because the method demands that we feel the pain first, compare against React and Vue on every point, open the machinery, name the traps, and recap relentlessly. That ratio is the unit of design here. A topic earns a standalone hour only when it has the conceptual surface to expand that far. Several documentation pages do not: a one-paragraph orientation page, a pair of tiny specialist runes, a handful of trivial declarative elements. Those are grouped with a neighbor under a single spine, never as a loose grab bag. A few of the reference modules in this snapshot are empty stubs that carry no teaching weight on their own (motion, the reactive built-ins); the lectures that cover them are anchored by real template material and completed from outside research, exactly as the course brief instructs.

The series moves from mental model, to reactivity, to template syntax, to the presentational layer of motion and styling and special elements, to runtime APIs, and finally to professional practice and migration. Numbering is the lecture series' own and does not follow the documentation folder numbering.

---

## Part One: Foundations And Mental Model

### 1. The Compiler Mindset: What Svelte Is, And How To Run It
- /documentation 2026 June/svelte-docs/01-introduction/01-overview.md
- /documentation 2026 June/svelte-docs/01-introduction/02-getting-started.md

The opening lecture of the whole course. It plants the single biggest idea: Svelte is not a runtime library like React or Vue, it is a compiler that reads your code at build time and rewrites it into plain JavaScript. The lecture leads with the pain that runtime frameworks pay for, shipping a virtual DOM, a scheduler, a reactivity tracker to every visitor's browser, then shows how a compile time approach removes that tax. It also walks the listener through how to actually start a Svelte project today, the SvelteKit scaffolding, the standalone Vite plugin, the playground, so they finish the hour with a running app on disk and a clear sense of what is about to happen in every later lecture. The documentation here is short, but the idea is the spine of the entire series and deserves a full, motivated hour, which is why it stands alone.

### 2. The .svelte File And The Runes That Live In It
- /documentation 2026 June/svelte-docs/01-introduction/03-svelte-files.md
- /documentation 2026 June/svelte-docs/01-introduction/04-svelte-js-files.md
- /documentation 2026 June/svelte-docs/02-runes/01-what-are-runes.md

A tour of the dot svelte file as a single self contained unit, the script zone, the markup zone, the style zone, the rules about ordering, the optional module level script, and the way the compiler treats each zone. The lecture contrasts this with React's "component is a function" model and Vue's single file component, calling out where Svelte resembles Vue's structure but differs in semantics. It then introduces the newer dot svelte dot js and dot svelte dot ts files, reactive modules that can hold runes outside of a component. And that is the exact seam where the orientation on runes belongs: a rune is only legal inside these specific files, so explaining what a rune actually is, a compiler instruction that looks like a function but is never imported, never called at runtime, only ever a marker the compiler reads, completes the picture of the file rather than starting a separate hour for it. The lecture closes by waving at the whole rune family from across the room, the way the state lecture already does, so Part Two lands cleanly. The contrast with React hooks and their rules, and with Vue's composition API, is set up here and paid off rune by rune afterward. (This folds the former standalone "what are runes" orientation, which is a single 150-word preview page, into the file anatomy lecture where it has a natural home.)

### 3. How An App Is Built: Boxes Inside Boxes, And How They Talk
- /documentation 2026 June/sveltekit-docs/10-getting-started/30-project-structure.md
- /documentation 2026 June/sveltekit-docs/20-core-concepts/10-routing.md
- /documentation 2026 June/sveltekit-docs/20-core-concepts/20-load.md
- /documentation 2026 June/sveltekit-docs/20-core-concepts/30-form-actions.md
- /documentation 2026 June/sveltekit-docs/20-core-concepts/50-state-management.md
- /documentation 2026 June/svelte-docs/06-runtime/02-context.md

The keystone lecture of the whole course, and its longest, running about two hours. It hands the listener the entire map before any single tool is taught in depth, so that every later lecture lands as a click into a slot already cut for it. It builds one running world that the rest of the series returns to: a multi-user news platform called The National Times, with articles, a video section, sections, authors, tags, and comments. It trains the reader to SEE an application as boxes inside boxes, a component being a box, and in code a box being a tag inside a tag. It establishes the family vocabulary the whole course leans on, parent, child, sibling, grandparent, grandchild, and then previews the entire communication toolbox at a high level, each tool named, explained in one plain sentence, anchored in the news platform, and motivated by what specifically breaks without it: a local reactive variable (state), a value computed from others (derived), a side effect when state changes (effect), data handed down to a child (props, and props drilling), a child sending a message up to a parent (events and callbacks), and state shared sideways across the tree without drilling (context and shared modules). It then lays out what files a real SvelteKit project actually contains, the dot svelte components, the dot svelte dot js reactive modules, the plain dot js helpers, and the plus page route files, and where data enters and leaves: reads in load functions, writes in form actions, the shared API client in the lib folder. It closes with a reading map that sends every previewed tool to the later lecture that teaches it in full. This lecture stands on the file anatomy of lecture two and clears the runway for all of Part Two and beyond. After it, nothing in the course is a surprise.

---

## Part Two: Reactivity, The Runes Family

### 4. State Is Just A Variable: $state
- /documentation 2026 June/svelte-docs/02-runes/02-$state.md

The deep dive on the rune the listener will type more than any other. This lecture is the demo already produced as `output/lecture_on_state.md` and serves as the style template for every other lecture. It covers the philosophy that state in Svelte is a plain variable, the underlying signal machinery the compiler generates, deep reactivity through proxies, the difference between dot state and dot raw state, the dot snapshot helper for serialization, state inside classes, and the comparison with React's useState ceremony and Vue's dot value tax.

### 5. Computed Values Without Cache Bugs: $derived
- /documentation 2026 June/svelte-docs/02-runes/03-$derived.md

A lecture on the rune for values computed from other reactive values, the Svelte answer to React's useMemo and Vue's computed. The lecture motivates the rune by showing how naive recomputation in plain code creates either stale values or wasteful work, then explains how derived gives you a value that is fresh, automatically tracked, and only recomputes when its real dependencies change. It covers simple inline derivations, the dot by form for multi line expressions, derivations that read other derivations, and the rules about when a derivation may or may not write back into other state. Lighter on the page than state or effect, but conceptually rich enough, the staleness problem, the push versus pull question, overriding a derived value for optimistic UI, to stand on its own as a full hour.

### 6. Reactive Side Effects: $effect
- /documentation 2026 June/svelte-docs/02-runes/04-$effect.md

The lecture on side effects, the place where reactive values meet the world outside of pure computation, such as DOM mutations, subscriptions to third party libraries, timers, logging, and analytics. It explains why effects must be a last resort rather than a first instinct, the difference between dot effect and dot effect dot pre and dot effect dot root, how dependencies are auto tracked, when teardown functions run, and the rules about effects that try to write to the very state they read. The explicit contrast with React's useEffect dependency array ceremony and Vue's watch and watchEffect is built into every section.

### 7. Component Inputs And Two-Way Contracts: $props And $bindable
- /documentation 2026 June/svelte-docs/02-runes/05-$props.md
- /documentation 2026 June/svelte-docs/02-runes/06-$bindable.md

A lecture on how a component receives data from its parent and, when needed, hands data back. It walks the listener through the destructuring style declaration of props, default values, rest props, type annotations, the question of mutating props and why you usually should not, and the rules around reactivity of props at the boundary. Then it introduces dot bindable as the explicit opt in that lets a parent two way bind to a prop, building the bridge from this lecture into the later lecture on the bind colon directive. The contrast with React props, read only, callback functions, and Vue defineProps plus defineEmits is woven through.

---

## Part Three: Template Syntax

### 8. Markup, Attributes, Expressions, And Events
- /documentation 2026 June/svelte-docs/03-template-syntax/01-basic-markup.md
- /documentation 2026 June/svelte-docs/98-reference/21-svelte-events.md

The first deep lecture on the markup zone. It covers HTML inside a Svelte component, the curly brace expression syntax, attribute shorthand, spread attributes, boolean attributes, component invocation versus element invocation, the capital first letter rule, and the way event handlers are written in Svelte 5 as plain property style attributes, onclick rather than the old on colon click. The lecture explains the new event delegation behavior, how to attach modifiers manually now that the old pipe modifiers are gone, and the helpers exported from the events module for advanced cases. The contrast with React's JSX, synthetic events, and Vue's v on directive is built in throughout.

### 9. Conditionals And Loops: {#if}, {#each}, And {#key}
- /documentation 2026 June/svelte-docs/03-template-syntax/02-if.md
- /documentation 2026 June/svelte-docs/03-template-syntax/03-each.md
- /documentation 2026 June/svelte-docs/03-template-syntax/04-key.md

The control flow lecture. It walks the listener through the hash if hash else if hash else family, the hash each form including index, the all important keyed each block and why the key parameter prevents the classic list reordering bugs every framework eventually faces, the destructured each form, and the hash key block which forces a full teardown and remount when its expression changes. The keyed reconciliation discussion alone, set against React's array dot map plus key prop and Vue's v for, gives this hour its conceptual depth.

### 10. Async Content In Templates: {#await} And Await Expressions
- /documentation 2026 June/svelte-docs/03-template-syntax/05-await.md
- /documentation 2026 June/svelte-docs/03-template-syntax/19-await-expressions.md

A lecture on rendering promises and on the newer await expressions feature that lets you write await directly inside the script and markup zones. It covers the classic hash await pending then catch block, then explains how Svelte 5's await expressions integrate with reactive boundaries, suspending the surrounding region until the value is ready, and how this differs from React Suspense and Vue's Suspense component. The lecture is careful to point out the experimental edges and the boundary inside which await expressions must live, and it forward references the special elements lecture, where the boundary element's pending state completes this story.

### 11. Composable Markup With Snippets: {#snippet} And {@render}
- /documentation 2026 June/svelte-docs/03-template-syntax/06-snippet.md
- /documentation 2026 June/svelte-docs/03-template-syntax/07-@render.md

The Svelte 5 replacement for slots, and one of the richest topics in the language. The lecture explains snippets as reusable, parameterizable chunks of markup that you define with hash snippet and call with at render, why this design is more powerful than the old slot system, how snippets are passed as props to child components, how they replace the previous default slot, named slot, and slot props patterns in one unified mechanism, and how they compare to React's children, render props, and Vue's scoped slots. It also covers the typing of snippets, the implicit children prop, and the rules of where a snippet may be declared.

### 12. Escape Hatches And Debugging: {@html}, {@const}, {@debug}, Declaration Tags, And $inspect
- /documentation 2026 June/svelte-docs/03-template-syntax/08-@html.md
- /documentation 2026 June/svelte-docs/03-template-syntax/10-@const.md
- /documentation 2026 June/svelte-docs/03-template-syntax/11-@debug.md
- /documentation 2026 June/svelte-docs/03-template-syntax/11-declaration-tags.md
- /documentation 2026 June/svelte-docs/02-runes/07-$inspect.md

A lecture that gathers the small escape hatches and the debugging tools under one spine: special markup you reach for occasionally and should recognize on sight. It covers at html for inserting raw HTML strings and the security responsibility that comes with it, with a real comparison to React's dangerouslySetInnerHTML and Vue's v html, at const for binding a local value inside the markup zone, at debug for stopping execution in dev tools when watched values change, and the declaration style tags that affect compilation. It then folds in the inspect rune, the development time tool that logs every change to a piece of reactive state, including the dot with form for custom loggers, and why it is removed entirely in production builds. The inspect rune lives here, rather than as its own tiny lecture in Part Two, because it is the natural sibling of the at debug tag: both are watch and log tools, and teaching them together avoids redundancy while giving each escape hatch room without padding any single one to an artificial hour.

### 13. Two-Way Binding With bind:
- /documentation 2026 June/svelte-docs/03-template-syntax/12-bind.md

A dedicated lecture on the bind colon directive because the topic is large and easy to get wrong. It covers binding to form elements, input value, checkbox checked, radio, select, file inputs, textarea, binding to element properties like clientWidth and contentRect, binding to the element itself with bind colon this, binding to component props in combination with dot bindable, the rules about read only versus read write bindings, and the way Svelte makes two way data flow explicit at the call site rather than implicit at the definition site. The contrast with React's controlled inputs, value plus onChange, and Vue's v model is woven through.

### 14. Actions And Attachments: use: And {@attach}
- /documentation 2026 June/svelte-docs/03-template-syntax/13-use.md
- /documentation 2026 June/svelte-docs/03-template-syntax/09-@attach.md
- /documentation 2026 June/svelte-docs/98-reference/21-svelte-action.md
- /documentation 2026 June/svelte-docs/98-reference/21-svelte-attachments.md

A lecture on the two related mechanisms for attaching behavior to a real DOM element. It teaches use colon actions first, functions that run on mount with the element as their argument, with optional update and destroy hooks, then introduces the newer at attach syntax that lets you attach an arbitrary effect to an element inline. It explains when to reach for each, how they typically wrap third party DOM libraries, charts, tooltips, drag handles, and why they are Svelte's analogue to React's useRef plus useEffect or Vue's mounted plus ref. The lecture also covers the recommended action type and the attachment helpers exported from the svelte attachments module.

---

## Part Four: Motion, Styling, And Special Elements

### 15. Motion And Animation: transition:, in:, out:, animate:, Tween, And Spring
- /documentation 2026 June/svelte-docs/03-template-syntax/14-transition.md
- /documentation 2026 June/svelte-docs/03-template-syntax/15-in-and-out.md
- /documentation 2026 June/svelte-docs/03-template-syntax/16-animate.md
- /documentation 2026 June/svelte-docs/98-reference/21-svelte-transition.md
- /documentation 2026 June/svelte-docs/98-reference/21-svelte-animate.md
- /documentation 2026 June/svelte-docs/98-reference/21-svelte-easing.md
- /documentation 2026 June/svelte-docs/98-reference/21-svelte-motion.md

The full lecture on things in motion, under one spine: whole elements moving in, out, and around, and single values gliding smoothly from one number to another. The first two thirds teach transition colon as the in plus out shorthand, in colon and out colon for asymmetric entrances and exits, animate colon for items moving within a keyed each block, the FLIP technique, and the built in transitions, animations, and easing functions, fade, fly, slide, scale, blur, crossfade, flip, and the easing curves, plus custom transitions written from scratch. The final third turns to the motion module, which is conceptually the mirror image: transitions move whole elements, motion moves a single value over time. It introduces Tween for deterministic, eased interpolation and Spring for physics based motion, both exposing a reactive current value you drop straight into markup, animating a counter, an SVG attribute, a chart axis, a color. The motion module is only a stub in this documentation snapshot, so that final third is anchored by the real transition material and completed from outside research. Throughout, the lecture explains how Svelte's motion system removes the manual JavaScript animation work that sends React and Vue users reaching for libraries like Framer Motion and react spring.

### 16. Styling In Svelte: Scoped CSS And The style: And class: Directives
- /documentation 2026 June/svelte-docs/03-template-syntax/17-style.md
- /documentation 2026 June/svelte-docs/03-template-syntax/18-class.md
- /documentation 2026 June/svelte-docs/04-styling/01-scoped-styles.md
- /documentation 2026 June/svelte-docs/04-styling/02-global-styles.md
- /documentation 2026 June/svelte-docs/04-styling/03-custom-properties.md
- /documentation 2026 June/svelte-docs/04-styling/04-nested-style-elements.md

One unified hour on how you style a component, which the listener will find refreshingly direct after a career of CSS modules, BEM, Tailwind, styled components, and Vue's scoped styles. The static half: how Svelte automatically scopes styles per component without any extra tooling, how to escape that scoping with the colon global selector and the global style block, how to thread theming through CSS custom properties from a parent into a child, and how multiple style elements may now be nested inside a component. The dynamic half: the style colon and class colon directives that drive a single style property or a single class name from a reactive expression, the shorthand forms, the precedence rules, how they interact with regular style and class attributes, and the new object form for class colon and its relationship to utilities like clsx. The contrast with React's className plus inline style objects and Vue's v bind class plus v bind style is woven through. (This merges the former Part Four styling lecture with the style and class directives lecture, since from the learner's chair "how do I style this" is one question, not two.)

### 17. The Special Elements Family: Boundaries, Compiler Options, And Reaching Outside Your Component
- /documentation 2026 June/svelte-docs/05-special-elements/01-svelte-boundary.md
- /documentation 2026 June/svelte-docs/05-special-elements/07-svelte-options.md
- /documentation 2026 June/svelte-docs/05-special-elements/02-svelte-window.md
- /documentation 2026 June/svelte-docs/05-special-elements/03-svelte-document.md
- /documentation 2026 June/svelte-docs/05-special-elements/04-svelte-body.md
- /documentation 2026 June/svelte-docs/05-special-elements/05-svelte-head.md
- /documentation 2026 June/svelte-docs/05-special-elements/06-svelte-element.md

One hour on the whole family of special elements, capabilities that normal components and ordinary markup cannot express. The rich centerpiece is the boundary element, Svelte's answer to React's error boundaries: it catches errors thrown by descendant components and renders a fallback in their place, and its pending support completes the async story begun in the await lecture. Around it sit the lighter members, taught more briskly because each is small on its own: the options element, the per file knob for compiler behavior, custom element mode, runes mode, accessor generation; and the window, document, body, and head elements that declaratively attach event listeners and bindings to nodes outside the component's own template, plus the svelte element form that chooses a tag name dynamically at render time. The lecture explains why the declarative form is cleaner than reaching for addEventListener inside an effect, and draws the comparison with React's portal plus useEffect approach and Vue's teleport. (This merges the former two special elements lectures; the declarative members were too slight to sustain their own hour, while boundary gives this one its weight.)

---

## Part Five: Runtime APIs Beyond The Runes

### 18. Reactivity Beyond The Runes: Stores And The Reactive Built-Ins
- /documentation 2026 June/svelte-docs/06-runtime/01-stores.md
- /documentation 2026 June/svelte-docs/98-reference/21-svelte-store.md
- /documentation 2026 June/svelte-docs/98-reference/21-svelte-reactivity.md
- /documentation 2026 June/svelte-docs/98-reference/21-svelte-reactivity-window.md

One hour on the reactive primitives that are not the core runes, under a single spine. First, stores: writable, readable, and derived, the original Svelte reactivity API that predates the runes. The lecture explains how stores still work in Svelte 5, when they remain the right choice, especially for integrating with libraries that expect a subscribe protocol, and how the dollar sign prefix auto subscription inside a component connects a store to the runes world, with an explicit comparison to Redux, Zustand, and Vue's Pinia. Then, the reactive built-ins: because dot state proxies do not make Map, Set, Date, and URL reactive in the right way, since those are exotic objects, Svelte ships SvelteMap, SvelteSet, SvelteDate, and SvelteURL with the same APIs and proper fine grained reactivity wired in, plus the window family, innerWidth, scrollY, devicePixelRatio, matchMedia, that exposes browser environment values as reactive read only refs. Both halves answer the same question, what do you reach for when the plain runes are not enough, which is why they share an hour. The reactivity modules are stubs in this snapshot, so the built-ins half leans on outside research. The lecture closes with practical advice on choosing between a dot state in a dot svelte dot js file, a writable store, and a SvelteMap for shared and specialized state.

### 19. Sharing Without Wires: The Context API
- /documentation 2026 June/svelte-docs/06-runtime/02-context.md

A lecture on setContext and getContext, the mechanism that lets a parent component publish a value that any descendant may read without having to thread it through props at every level. The lecture explains why prop drilling becomes painful in deep component trees, how context solves it, the safe key patterns, symbols rather than strings, and how to combine context with state and class instances to build small dependency injection patterns. The comparison with React's createContext plus useContext and Vue's provide plus inject is woven through.

### 20. Lifecycle, Imperative Mounting, And Hydration
- /documentation 2026 June/svelte-docs/06-runtime/03-lifecycle-hooks.md
- /documentation 2026 June/svelte-docs/06-runtime/04-imperative-component-api.md
- /documentation 2026 June/svelte-docs/06-runtime/05-hydratable.md
- /documentation 2026 June/svelte-docs/98-reference/21-svelte-server.md

A lecture on the remaining runtime helpers. It covers onMount and onDestroy and tick, the last few classic lifecycle hooks that survived the runes transition, the imperative mount and hydrate and unmount APIs that let you boot a Svelte component into a real DOM node from outside Svelte, useful for embedding a Svelte widget into a non Svelte page, and the hydratable contract that connects server rendered HTML to client side reactivity. The contrast with React's useEffect for mount, ReactDOM.createRoot, and hydrateRoot is woven through.

---

## Part Six: Practices, Tooling, And Migration

### 21. Writing Svelte Like A Pro: Best Practices
- /documentation 2026 June/svelte-docs/07-misc/01-best-practices.md

A practical lecture on accessibility, performance, code organization, and the small habits that distinguish idiomatic Svelte 5 code from code that merely compiles. It covers the accessibility warnings the compiler emits and why, the patterns for keeping components small, the rules for state location, lift only what must be lifted, when to reach for context versus props, and the common anti patterns that creep in when developers carry React or Vue muscle memory into Svelte.

### 22. Testing Svelte: Unit, Component, And End To End
- /documentation 2026 June/svelte-docs/07-misc/02-testing.md

A lecture on the testing story. It explains the recommended setup with Vitest for unit and component tests, the Svelte Testing Library style of testing components from the outside, the rules for testing reactive state and effects, the way to mock runes friendly modules, and the role of Playwright for true end to end browser tests. The comparison with React Testing Library and Vue Test Utils is woven through, since the listener probably has muscle memory from one of them.

### 23. TypeScript In Svelte: Generics, Props, And Type Safety
- /documentation 2026 June/svelte-docs/07-misc/03-typescript.md

A lecture on the type system experience. It covers the lang ts attribute, the typing of props through type annotations on the dot props destructure, generic components, typed snippets, the typing of stores and context, the way the compiler narrows reactive values, and the tooling story, svelte check, the language server, editor integration. The lecture is careful to address the gotchas where a runes value looks like a plain value at the use site but needs a special generic at the declaration site.

### 24. Web Components: Shipping Svelte As Custom Elements
- /documentation 2026 June/svelte-docs/07-misc/04-custom-elements.md
- /documentation 2026 June/svelte-docs/07-misc/05-browser-support.md
- /documentation 2026 June/svelte-docs/02-runes/08-$host.md

A lecture on compiling a Svelte component as a native custom element so that it can be dropped into any page, any framework, or no framework at all. It explains the custom element option, the way props and events cross the custom element boundary, the slotting story, the browser support matrix, and the trade offs against shipping a normal Svelte component. This is also the natural and only real home for the host rune, the tiny rune that gives a component access to its host element so it can dispatch real DOM events to the outside world, which matters solely when authoring a custom element, which is why it is taught here rather than as orphaned filler back in Part Two. The contrast with React's lack of first class custom element output and Vue's defineCustomElement is woven through.

### 25. The Legacy Idioms: Reading Pre-Svelte-5 Code
- /documentation 2026 June/svelte-docs/99-legacy/00-legacy-overview.md
- /documentation 2026 June/svelte-docs/99-legacy/01-legacy-let.md
- /documentation 2026 June/svelte-docs/99-legacy/02-legacy-reactive-assignments.md
- /documentation 2026 June/svelte-docs/99-legacy/03-legacy-export-let.md
- /documentation 2026 June/svelte-docs/99-legacy/04-legacy-$$props-and-$$restProps.md
- /documentation 2026 June/svelte-docs/99-legacy/10-legacy-on.md
- /documentation 2026 June/svelte-docs/99-legacy/20-legacy-slots.md
- /documentation 2026 June/svelte-docs/99-legacy/21-legacy-$$slots.md
- /documentation 2026 June/svelte-docs/99-legacy/22-legacy-svelte-fragment.md
- /documentation 2026 June/svelte-docs/99-legacy/30-legacy-svelte-component.md
- /documentation 2026 June/svelte-docs/99-legacy/31-legacy-svelte-self.md
- /documentation 2026 June/svelte-docs/99-legacy/40-legacy-component-api.md
- /documentation 2026 June/svelte-docs/98-reference/21-svelte-legacy.md

The first of two closing lectures, and the one that equips the listener to read any pre Svelte 5 code they encounter in old tutorials, old StackOverflow answers, old company codebases. It walks through every legacy idiom and shows the modern equivalent the listener already knows: the plain let for state, the dollar label reactive assignment, export let for props, the dollar dollar props and dollar dollar restProps escape hatches, the on colon click event syntax, the slot system with named and scoped slots, the dollar dollar slots object, svelte fragment, the old svelte component and svelte self elements, and the imperative four point component class with dollar set and dollar destroy. Because the listener now knows modern Svelte 5 cold, each idiom is taught fast as a before and after, old shape on the left, the rune or snippet that replaced it on the right. (This is one half of the former single migration lecture, which crammed roughly twelve thousand words of source into one entry; reading old code and converting old code are two different jobs and now get two hours.)

### 26. Migrating From Svelte 4 To 5, And The FAQ
- /documentation 2026 June/svelte-docs/07-misc/06-v4-migration-guide.md
- /documentation 2026 June/svelte-docs/07-misc/07-v5-migration-guide.md
- /documentation 2026 June/svelte-docs/07-misc/99-faq.md

The final lecture. Where the legacy idioms lecture taught the listener to read old code, this one teaches them to convert it and to ship forward. It covers the official migration paths from Svelte 4 to Svelte 5, the automated migration script and what it does and does not handle, the breaking changes and gotchas the official guide flags, and the answers to the most common questions in the FAQ. Because the audience has already learned the entire Svelte 5 side of every change across the preceding twenty four lectures, this hour is taught as a systematic mapping and a gotcha tour rather than fresh teaching, which is what keeps a very large body of source material to a single focused hour. The listener finishes the course able to ship new code in modern Svelte 5 and also to maintain and upgrade any legacy code base they inherit.
