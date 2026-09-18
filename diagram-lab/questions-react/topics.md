# Topic Vocabulary (controlled)

Every question carries exactly **one** primary Topic hashtag, drawn from this list. If a topic you need is not here, add it here first (with a one-line definition), then use it. No off-registry tags.

**Naming convention:** API name verbatim when one exists (`use_state` for the `useState` hook, `create_root` for `createRoot`), snake_case concept otherwise (`event_handling`, `rendering_lists`). Hooks keep their `use_` prefix so "all `useState` questions" is a single-column scan.

# React tags (Q1–Q100)

## Foundations and concepts

- `#what_is_react` — the big-picture idea: declarative UI, UI as a function of state, the component model.
- `#project_setup` — creating and running a React project; frameworks vs build tools vs CDN.
- `#component_anatomy` — function components, the export, the capital-letter rule, one component per file.
- `#jsx` — writing markup with JSX: single root, closing tags, camelCase attributes.
- `#jsx_expressions` — JavaScript inside JSX with curly braces: where `{}` works and where it does not.
- `#imports` — importing and exporting components; default vs named exports; splitting files.
- `#ui_tree` — understanding your UI as a tree: module tree, component tree, render tree.
- `#thinking_in_react` — the step-by-step design process from mock to component tree.

## Composition

- `#props` — passing data into components, reading props, props are read-only.
- `#children` — the `children` prop, spreading props, default values.
- `#conditional_rendering` — `&&`, ternary, `null`, early returns; branch selection.
- `#rendering_lists` — rendering arrays with `map`, and why React needs keys.
- `#keys` — key semantics: identity, position, remounting; choosing good keys.
- `#fragment` — `<Fragment>` and `<>...</>`: grouping without extra DOM nodes.
- `#purity` — pure components: same inputs, same JSX, no side effects during render.
- `#composability` — children patterns and render-time composition as an alternative to configuration.

## Interactivity

- `#event_handling` — responding to events: handler props, the event object, `preventDefault` and `stopPropagation`.
- `#use_state` — `useState`: state as a component's memory, snapshots, queueing, updater functions.
- `#state_snapshots` — state as a snapshot: why reading state after setting it shows the old value.
- `#state_updates` — queueing a series of updates, automatic batching, `setCount(c => c + 1)`.
- `#state_objects` — updating objects in state immutably (spread, nesting).
- `#state_arrays` — updating arrays in state immutably (add, remove, insert, sort recipes).
- `#reacting_to_input` — the state-machine pattern: input changes state, state changes the screen.
- `#controlled_inputs` — controlled inputs: `value` plus `onChange` on text, textarea, select, checkbox.
- `#state_structure` — choosing what belongs in state: minimal, non-redundant, non-contradictory.
- `#lifting_state` — sharing state between components by lifting it to the closest common parent.
- `#component_identity` — preserving and resetting state: position in the tree, key-based resets.
- `#derived_state` — deriving values during render instead of storing or syncing them with effects.
- `#use_reducer` — consolidating state logic into a reducer with `useReducer`.
- `#context` — `createContext`, `useContext`, providers: passing data deeply without prop drilling.
- `#reducer_context` — scaling up with reducer plus context for app-level state.

## Escape hatches

- `#use_ref` — referencing values with refs: a box that survives renders without re-rendering.
- `#dom_refs` — manipulating the DOM with refs: the `ref` attribute, focus, measuring, callback refs.
- `#refs_deep` — refs under the hood: `ref` as a prop (React 19), ref cleanup, attach timing.
- `#use_imperative_handle` — a child exposing an API to its parent through `useImperativeHandle`.
- `#use_effect` — synchronizing with external systems: `useEffect`, dependencies, cleanup.
- `#effect_lifecycle` — the lifecycle of reactive effects: setup/cleanup pairs across dependency changes.
- `#effect_dependencies` — removing unnecessary effect dependencies; when deps must grow.
- `#effect_events` — separating events from effects: non-reactive logic inside effects, `useEffectEvent`.
- `#no_effect` — you might not need an effect: derived values, chains, and event handlers.
- `#custom_hooks` — reusing logic with custom hooks: the `use` prefix, extraction, composition.

## Rendering mechanics

- `#render_commit` — the trigger, render, commit phases; what runs when.
- `#reconciliation` — how React diffs trees: element type, props, key, position.
- `#batching` — automatic batching of state updates across events, promises, and transitions.
- `#concurrent` — concurrent rendering: interruptible renders, transitions as a priority signal.
- `#strict_mode` — StrictMode: double rendering and double effects in development, and why.
- `#rules_of_hooks` — calling hooks at the top level, only from React functions; the call-order reason.
- `#rules_of_react` — the Rules of React as a system: purity, React calls your code, hooks rules.
- `#create_element` — `createElement` and the element object: what JSX compiles into.

## Performance

- `#use_memo` — `useMemo`: caching expensive calculations, cached dependencies.
- `#use_callback` — `useCallback`: caching function identities for memoized children.
- `#memo` — `React.memo`: skipping re-renders; when memo does not help.
- `#use_transition` — `useTransition` and `startTransition`: marking updates non-urgent.
- `#use_deferred_value` — `useDeferredValue`: deferring expensive re-renders.
- `#virtualization` — rendering large lists with windowing instead of every row.
- `#profiler` — the `Profiler` component and `onRender`: measuring render costs.
- `#dev_tools` — React Developer Tools and the performance tracks.

## Async UI and boundaries

- `#use_id` — `useId`: unique, stable IDs that survive server rendering and hydration.
- `#suspense` — `Suspense` and fallbacks: where boundaries live, when content is ready.
- `#lazy` — `lazy`: code-splitting components and loading them with Suspense.
- `#error_boundaries` — error boundaries: catching render errors, fallback UI, recovery.
- `#use` — the `use` API: reading a promise or context during render, conditionally.

## Forms and actions

- `#forms` — form strategy in React: controlled state vs uncontrolled refs.
- `#form_actions` — the `action` prop on forms and buttons; client actions.
- `#use_action_state` — `useActionState`: form state, returned values, pending flags.
- `#use_form_status` — `useFormStatus`: reading the parent form's pending state from nested fields.
- `#use_optimistic` — `useOptimistic`: showing the next value while an action runs.

## react-dom client surface

- `#create_root` — `createRoot` and `root.render`: how a React app mounts.
- `#create_portal` — `createPortal`: rendering into a different DOM subtree (modals).
- `#flush_sync` — `flushSync`: forcing React to flush updates synchronously.
- `#html_components` — React's HTML components (`<form>`, `<input>`, `<link>`, `<meta>`, `<script>`, `<style>`, `<title>`) and how they differ from raw HTML.
- `#activity` — `<Activity>`: hiding a subtree while preserving its state.
- `#view_transition` — `<ViewTransition>`: animating screen changes.
- `#use_sync_external_store` — subscribing to stores that live outside React.
- `#use_debug_value` — `useDebugValue`: labeling custom hooks in DevTools.
- `#use_layout_effect` — `useLayoutEffect`: measuring and mutating before the browser paints.
- `#use_insertion_effect` — `useInsertionEffect`: inserting styles before layout effects.

## Tooling and quality

- `#typescript` — TypeScript with React: typing props, events, hooks, generics.
- `#react_compiler` — the React Compiler: automatic memoization, adoption, gating.
- `#eslint_hooks` — `eslint-plugin-react-hooks`: exhaustive-deps and rules-of-hooks lints.
- `#act` — `act()`: driving components in tests so effects flush before assertions.
- `#owner_stacks` — `captureOwnerStack`: finding which component caused a render or error.

## Legacy / migration (separate track, not in CORE/MORE/ADVANCED)

- `#legacy_class` — class components: `this.state`, `this.setState`, bound methods.
- `#legacy_lifecycle` — `componentDidMount` / `componentDidUpdate` / `componentWillUnmount`, `UNSAFE_` lifecycles.
- `#legacy_memoization` — `PureComponent` and `shouldComponentUpdate`.
- `#legacy_refs` — `createRef`, callback refs, `forwardRef` history.
- `#legacy_elements` — `cloneElement`, `Children` utilities, `defaultProps`, string refs.

---

# React Server tags (Q101–Q180)

## Overview and models

- `#rsc_overview` — what React Server Components are and why they exist; server React vs browser React.
- `#ssr` — server-side rendering: what it solves, what it costs.
- `#rendering_models` — the spectrum: CSR, SSR, streaming SSR, static prerendering, resuming.
- `#hydration` — `hydrateRoot`: attaching interactivity to server-rendered HTML.
- `#hydration_errors` — hydration mismatches: causes, error messages, fixes.
- `#shared_components` — components that run on both the server and the client (no directive).

## The server/client boundary

- `#use_client` — the `'use client'` directive: where the client boundary sits, what it imports.
- `#use_server` — the `'use server'` directive: marking Server Functions.
- `#directives` — directives as bundler instructions; the module-graph mental model.
- `#server_components` — what Server Components can and cannot do (no state, no browser APIs).
- `#client_references` — what a Client Component looks like from the server: a reference, not code.
- `#serializable_props` — what may cross the boundary as props, and what never can.
- `#composition` — passing server-rendered children into Client Components (children as slots).
- `#context_server` — context across the server/client boundary.
- `#server_only` — keeping server-only code out of the client bundle (`server-only` packages, server exports).

## Data and functions on the server

- `#server_resources` — reading server-only data: async Server Components, `await`, direct database access.
- `#server_functions` — Server Functions: `'use server'` functions callable from the client.
- `#actions` — actions vs Server Functions: any function passed to `action`.
- `#form_actions` — forms with Server Function actions; progressive enhancement before hydration.
- `#action_results` — return values and errors from actions reaching the UI via `useActionState`.
- `#progressive_enhancement` — forms that work before JavaScript loads.
- `#data_fetching` — where data fetching belongs: Server Components vs Server Functions vs client effects.
- `#cache` — `cache()`: deduplicating work within one request.
- `#cache_signal` — `cacheSignal()`: knowing when caching is done for the request.
- `#security` — trust boundaries: validating input, secrets on the server, `experimental_taintObjectReference` and `experimental_taintUniqueValue`.

## Streaming and rendering

- `#suspense_streaming` — streaming SSR with Suspense: the shell, fallbacks, out-of-order flushes.
- `#streaming` — `renderToPipeableStream` / `renderToReadableStream` and their options.
- `#stream_lifecycle` — shell callbacks: `onShellReady`, `onShellError`, `onAllReady`.
- `#static_prerender` — static prerendering: `prerender`, `prerenderToNodeStream`.
- `#resume` — resuming: shipping server UI state to the client without component code; `resume`, `resumeToPipeableStream`, `resumeAndPrerender`.
- `#document_metadata` — `<title>`, `<meta>`, `<link>` as React components; hoisting and precedence.
- `#preloading` — `preload`, `preinit`, `preconnect`, `prefetchDNS`: warming resources early.
- `#server_errors` — error boundaries during SSR, `onRecoverableError`, shell errors vs content errors.
- `#bootstrap_scripts` — `bootstrapScripts`: which script hydrates the page, and when.

## Internals

- `#rsc_payload` — the payload stream: what actually ships instead of component code.
- `#serialization_protocol` — how the payload encodes client references, promises, and typed values.
- `#server_graph` — the two module graphs: server graph and client graph, and how they reference each other.
- `#bundler_integration` — what a bundler/router must provide for RSC; building an RSC app from scratch.

## Legacy / migration (separate track)

- `#legacy_render_to_string` — `renderToString`: its legacy status and remaining uses.
- `#legacy_static_markup` — `renderToStaticMarkup` vs `renderToString`.
- `#legacy_node_streams` — the Node-stream server APIs that `renderToPipeableStream` replaced.
- `#legacy_hydrate` — `ReactDOM.render`, `ReactDOM.hydrate`, and the migration to `createRoot` / `hydrateRoot`.
