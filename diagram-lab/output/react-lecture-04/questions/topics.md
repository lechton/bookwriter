# Topic Vocabulary (controlled)

Every question carries exactly **one** primary Topic hashtag, drawn from this list. If a topic you need is not here, add it here first (with a one-line definition), then use it. No off-registry tags.

**Naming convention:** API name verbatim when one exists (`use_state` for the `useState` hook, `create_root` for `createRoot`), snake_case concept otherwise (`event_handling`, `rendering_lists`). Hooks keep their `use_` prefix so "all `useState` questions" is a single-column scan.

---

# React Tags (Q1–Q100)

## Foundations and Describing the UI
- `#what_is_react` — Declarative UI model, UI as a projection of state, and component-based structure.
- `#project_setup` — Creating and running a project; build tools (Vite) versus full-stack frameworks (Next.js).
- `#component_anatomy` — Function components, return markup, the uppercase naming rule, and modular exports.
- `#jsx` — Writing markup with JSX: single root, tag closing, camelCase attributes, and `<>...</>` Fragments.
- `#jsx_expressions` — Using JavaScript expressions inside JSX with curly braces `{}`.
- `#create_root` — `createRoot` and `root.render`: mounting the root React component into the DOM shell.
- `#imports` — Splitting components across files; default versus named exports and imports.
- `#props` — Passing data into components, reading props, and the immutable read-only contract.
- `#children` — The `children` prop, JSX slot composition, prop spreading, and default values.
- `#conditional_rendering` — Branching UI with `if`/`else`, ternary operators `? :`, and logical AND `&&`.

## Collections and Architecture
- `#rendering_lists` — Rendering arrays with `map()`, and why React requires unique, stable keys.
- `#ui_tree` — Component tree, render tree, and module dependency graph.
- `#purity` — Component purity: pure render functions, zero side effects during calculation.

## Interactivity and The Render Cycle
- `#event_handling` — Responding to user events: handler props, SyntheticEvent, and callback references.
- `#callback_props` — Passing callback functions as props: inverse data flow and child-to-parent notifications.
- `#use_state` — `useState`: persistent component memory versus reset local variables.
- `#render_and_commit` — The 3-phase engine rhythm: Trigger, Render (invoking components), and Commit (DOM writing).
- `#state_snapshots` — State as a snapshot: why state appears frozen during the current render.
- `#state_updates` — Queueing state updates, automatic batching, and updater functions (`c => c + 1`).
- `#strict_mode` — StrictMode: double-rendering and double effect invocation in development to expose side effects.

## State Structure and Composition
- `#state_objects` — Updating objects in state immutably using the spread operator (`...`).
- `#state_arrays` — Updating arrays in state immutably (adding, removing, transforming, sorting).
- `#controlled_inputs` — Controlled inputs: synchronizing `value` and `onChange` with state.
- `#reacting_to_input` — Visual states and state machine transitions versus imperative DOM mutation.
- `#state_structure` — Choosing state structure: minimal, non-redundant, non-duplicate, and derived state.
- `#lifting_state` — Sharing state between sibling components by lifting it to their closest common ancestor.
- `#component_identity` — Preserving versus resetting state: tree position and key-driven identity.
- `#thinking_in_react` — The canonical 5-step methodology from static design mock to interactive application.

## Scaling State: Reducers and Context
- `#use_reducer` — Consolidating multi-branch state transitions into pure reducer functions and actions.
- `#context` — Passing data deeply without prop drilling using `createContext` and the `use()` API.
- `#reducer_context` — Combining `useReducer` and Context for modular, app-wide state management.
- `#context_optimization` — Context value identity, re-render blast radius, and split provider patterns.

## Escape Hatches: Refs, Effects and Data Fetching
- `#use_ref` — Referencing values with refs: a mutable container that survives renders without re-rendering.
- `#dom_refs` — Accessing real DOM nodes via refs: focusing, measuring, and scrolling.
- `#use_effect` — Synchronizing with external systems: setup functions, cleanup functions, and dependencies.
- `#data_fetching_client` — Client-side data fetching with `useEffect` and `fetch`: loading, error, and abort controller.
- `#no_effect` — When NOT to use an Effect: replacing effects with derived state, calculators, and event handlers.
- `#effect_lifecycle` — Lifecycle of reactive effects: setup and teardown cycles as dependencies change.
- `#custom_hooks` — Extracting and reusing stateful logic into custom `use...` functions.

## Modern React 19 Forms and Actions
- `#forms` — Form management: controlled state versus uncontrolled native `FormData`.
- `#form_actions` — The React 19 `<form action={fn}>` prop and client-side actions.
- `#use_action_state` — Managing form action submissions, returned payloads, and pending flags with `useActionState`.
- `#use_form_status` — Reading parent form status and pending state from deeply nested buttons and fields.
- `#use_optimistic` — Providing immediate optimistic UI updates during async actions and rolling back on failure.
- `#progressive_enhancement` — Supporting form submissions before JavaScript loads or when offline.

## Advanced Hooks and APIs
- `#rules_of_hooks` — Calling hooks only at the top level of React functions; call-order tracking in fiber.
- `#effect_dependencies` — Auditing, stabilizing, and removing unnecessary effect dependencies.
- `#effect_events` — Separating non-reactive event logic from reactive synchronization with `useEffectEvent`.
- `#use_layout_effect` — Synchronous post-mutation, pre-paint execution to prevent layout shifts.
- `#use_insertion_effect` — Early-stage style tag injection for CSS-in-JS libraries before layout calculations.
- `#use_imperative_handle` — Exposing custom, constrained imperative APIs to parent components through refs.
- `#create_portal` — Rendering children into an external DOM subtree to escape clipping and stacking contexts.
- `#use_id` — Generating stable, unique IDs that match across client and server without hydration mismatches.
- `#use_sync_external_store` — Subscribing safely to non-React external stores without tearing during concurrency.
- `#use_debug_value` — Labeling custom hook internals and inspecting values in React DevTools.

## Performance Optimization and Memoization
- `#re-render_mechanics` — Why components re-render, and when re-rendering is cheap versus problematic.
- `#memo` — `React.memo`: skipping child re-renders via shallow prop comparison.
- `#use_memo` — Caching expensive calculation results across renders with `useMemo`.
- `#use_callback` — Caching callback function references across renders to preserve child memoization.
- `#composition_over_memo` — Architectural component composition (lifting content, children slots) instead of memoization.
- `#keys_and_reconciliation` — How keys guide DOM reuse and reconciliation, and the index-as-key antipattern.
- `#virtualization` — Windowing large lists with virtualization libraries to render only visible DOM nodes.
- `#react_compiler` — Automatic memoization, build-time transforms, and compliance with the Rules of React.
- `#profiler_component` — Measuring render duration and commit costs with the `<Profiler>` component.
- `#flush_sync` — Forcing immediate synchronous DOM updates with `flushSync`.

## Concurrency, Transitions and Suspense
- `#concurrent_rendering` — Non-blocking, interruptible rendering in React's concurrent scheduler.
- `#use_transition` — Marking state updates as non-blocking transitions to preserve UI responsiveness.
- `#use_deferred_value` — Deferring expensive subtrees while keeping input states immediately responsive.
- `#suspense` — Boundary coordination, fallback UI, and thrown promises during rendering.
- `#lazy` — Code-splitting components and lazy-loading bundles with `React.lazy()` and Suspense.
- `#use_promise` — Reading promises directly in render with the `use()` API, Suspense, and Error Boundaries.
- `#error_boundaries` — Catching JavaScript errors in subtrees and rendering graceful fallback UI.
- `#activity_component` — Visually hiding subtrees while preserving their state and DOM with `<Activity mode="hidden">`.
- `#view_transitions` — Coordinating smooth document and element animations with `<ViewTransition>`.
- `#batching_internals` — Engine coordination of automatic batching across microtasks, timers, and events.

## Deep Engine Mechanics
- `#create_element_deep` — JSX compilation output, element objects, `$$typeof`, type, and key.
- `#reconciliation_internals` — The reconciliation algorithm: type comparison, key matching, and DOM diffing.
- `#fiber_architecture` — Fiber nodes, child/sibling/return pointers, and the double-buffered workLoop.
- `#synthetic_events` — Event delegation at the root container and the SyntheticEvent wrapper system.
- `#derived_state_patterns` — Anti-patterns in mirroring props to state and legitimate state adjustment during render.
- `#owner_stacks` — Component Owner Stacks for tracing the origin of errors and warnings in React 19.
- `#rules_of_react` — The formal Rules of React: Purity, React calls code, and Top-level hooks.
- `#html_components` — React's built-in HTML wrappers and how they normalize browser quirks.
- `#asset_preloading_client` — Preloading images, stylesheets, and scripts in the browser head.
- `#ref_as_prop` — Native `ref` prop support in React 19 function components without `forwardRef`.
- `#ref_cleanups` — Returning cleanup callbacks from ref functions in React 19 to handle DOM unmounts.
- `#act_in_testing` — Wrapping updates in `act()` to flush state queues and effects during unit testing.
- `#component_composition_patterns` — Render props, compound components, and polymorphic slot patterns.

## TypeScript and Tooling
- `#typescript_props` — Typing component props, optional properties, and children with TypeScript.
- `#typescript_events` — Typing event handlers, synthetic events, and HTML element targets.
- `#typescript_hooks` — Strict generic typing with `useState`, `useReducer`, and `useRef`.
- `#typescript_generics` — Authoring generic components that preserve type relationships across rows.
- `#typescript_polymorphism` — Implementing polymorphic `as` props with type safety.
- `#eslint_and_tooling` — ESLint rules (`eslint-plugin-react-hooks`, React Compiler) enforcing correctness.
- `#dev_tools_mastery` — Profiling render passes, inspecting fiber state, and finding memory leaks in DevTools.

## Legacy / Migration
- `#legacy_class` — ES6 class components: `this.state`, `this.setState`, and method binding.
- `#legacy_lifecycles` — `componentDidMount`, `componentDidUpdate`, `componentWillUnmount`, and `UNSAFE_` lifecycles.
- `#legacy_memoization` — `PureComponent` and `shouldComponentUpdate` shallow comparison.
- `#legacy_refs` — Historical ref patterns: `createRef`, callback refs, and `forwardRef`.
- `#legacy_patterns` — Obsolete patterns: `cloneElement`, `Children` helpers, and `defaultProps`.

---

# React Server Tags (Q101–Q180)

## Overview and Core Server Foundations
- `#rsc_overview` — What React Server Components are and why they exist; zero-bundle-size server rendering.
- `#ssr` — Server-side rendering: fast initial content paint versus time-to-interactive.
- `#rendering_models` — The rendering spectrum: CSR, SSR, streaming SSR, static prerender, and resuming.
- `#hydration` — `hydrateRoot`: attaching client interactivity to server-rendered HTML.
- `#hydration_errors` — Hydration mismatches: causes, browser console warnings, and remediation.
- `#shared_components` — Components without directives running in both server and client environments.

## The Server/Client Boundary
- `#use_client` — The `'use client'` directive: establishing client entrypoints and bundling boundaries.
- `#use_server` — The `'use server'` directive: declaring callable Server Functions.
- `#directives` — Directives as bundler instructions and module graph separators.
- `#server_components` — Server Component capabilities: direct DB access, async rendering, zero client JS.
- `#client_references` — What Client Components represent to the server: serializable references, not code.
- `#serializable_props` — Types and values that can safely cross the server/client boundary.
- `#composition` — Passing server-rendered children into Client Components as slots.
- `#context_server` — Context boundaries: why providers must be client components.
- `#server_only` — Preventing server secrets from leaking into client bundles with `server-only`.

## Server Data and Functions
- `#server_resources` — Direct data fetching in async Server Components without effects or loading state.
- `#server_functions` — Server Functions as RPC endpoints called from client events and forms.
- `#actions` — The distinction between general form actions and server functions.
- `#form_actions` — Progressive enhancement with form actions running on the server.
- `#action_results` — Passing validation errors and returned data back to the UI via `useActionState`.
- `#progressive_enhancement` — Forms submitting and executing without client JavaScript.
- `#data_fetching` — Deciding data fetching architecture: Server Components vs Server Functions vs Client.
- `#cache` — Per-request function memoization with React's `cache()` API.
- `#cache_signal` — `cacheSignal()`: determining when request-level caching is complete.
- `#security` — Trust boundaries: input validation, secret hygiene, and the taint APIs.

## Streaming and Server Rendering
- `#suspense_streaming` — Streaming HTML with Suspense: fast shell, out-of-order chunk flushes.
- `#streaming` — `renderToPipeableStream` and `renderToReadableStream` runtime options.
- `#stream_lifecycle` — Shell readiness callbacks: `onShellReady`, `onShellError`, and `onAllReady`.
- `#static_prerender` — Static prerendering with `prerender` and `prerenderToNodeStream`.
- `#resume` — Resuming: shipping server UI state without component code.
- `#document_metadata` — Native `<title>`, `<meta>`, and `<link>` components with automatic head hoisting.
- `#preloading` — Early resource discovery: `preload`, `preinit`, `preconnect`, and `prefetchDNS`.
- `#server_errors` — Error boundaries during SSR, recoverable errors, and shell crash handling.
- `#bootstrap_scripts` — Configuring bootstrap scripts for client hydration.

## Internals and Architecture
- `#rsc_payload` — The RSC payload format: stream rows, module references, and lazy chunks.
- `#serialization_protocol` — Wire serialization of promises, typed arrays, Maps, and Sets.
- `#server_graph` — Interleaving the server module graph and the client bundle graph.
- `#bundler_integration` — The contract between React Server and bundler/router runtimes.

## Legacy Server APIs
- `#legacy_render_to_string` — `renderToString`: synchronous legacy string rendering and fallback uses.
- `#legacy_static_markup` — `renderToStaticMarkup` for non-interactive email and static HTML output.
- `#legacy_node_streams` — Historical Node stream APIs replaced by `renderToPipeableStream`.
- `#legacy_hydrate` — Legacy `ReactDOM.render` and `ReactDOM.hydrate` migration to `hydrateRoot`.
