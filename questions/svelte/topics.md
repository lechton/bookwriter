# Topic Vocabulary (controlled)

Every question carries exactly **one** primary Topic hashtag, drawn from this list. If a topic you need is not here, add it here first (with a one-line definition), then use it. No off-registry tags.

**Naming convention:** API name verbatim when one exists (`#mount`, `#state`), snake_case concept otherwise (`#event_handling`, `#scoped_css`). Never the `$` or `{#` prefix in the tag.

## Runes (reactive primitives)

- `#state` — `$state`, declaring reactive local variables and the foundation of reactivity.
- `#derived` — `$derived` / `$derived.by`, computing values that track other reactive values.
- `#effect` — `$effect` and its variants (`$effect.pre`, `$effect.tracking`), running side effects in response to reactivity.
- `#props` — `$props`, declaring and destructuring component inputs.
- `#bindable` — `$bindable`, opting a prop into two-way binding.
- `#inspect` — `$inspect`, the debugging rune.

## Template syntax (logic blocks and directives)

- `#basic_markup` — text expressions `{...}`, attributes, comments, and the foundational markup rules.
- `#if_block` — `{#if}` / `{:else if}` / `{:else}`, conditional rendering.
- `#each_block` — `{#each}`, list rendering and keys.
- `#await_block` — `{#await}`, coordinating pending/fulfilled/rejected promise states.
- `#key_block` — `{#key}`, re-creating DOM when an expression changes.
- `#snippet` — `{#snippet}`, reusable markup fragments; the Svelte 5 replacement for slots.
- `#html` — `{@html}`, rendering raw unescaped HTML.
- `#const` — `{@const}`, declaring template-local constants.
- `#class_directive` — `class:` directive and the object/array forms of the `class` attribute.
- `#style_directive` — `style:` directive for inline styles and CSS custom properties on elements.

## Event handling and binding

- `#event_handling` — `onclick` and friends, attaching user-event handlers.
- `#binding` — `bind:value`, `bind:group`, and the two-way binding directives on form elements.
- `#this_binding` — `bind:this`, getting a direct reference to a DOM node or child instance.

## Component composition

- `#component_anatomy` — the `<script>` / markup / `<style>` structure of a `.svelte` file.
- `#child_components` — importing and rendering one component inside another.
- `#callbacks` — callback props, the Svelte 5 replacement for `createEventDispatcher`.

## Styling

- `#scoped_css` — component-scoped styles and how Svelte isolates them.
- `#global_css` — intentionally applying global styles from inside a scoped block.

## Runtime and mounting

- `#mount` — the `mount` function, getting a compiled component onto the page.
- `#unmount` — the `unmount` function, destroying a mounted component and cleaning up.
- `#hydrate` — the `hydrate` function, attaching interactivity to server-rendered HTML.
- `#hydratable` — the `hydratable()` API for SSR-safe async data, avoiding double-fetch during hydration.
- `#render` — the server-side `render` function that produces HTML for hydration.
- `#tick` — the `tick` function, manually flushing the render cycle.
- `#lifecycle` — `onMount`, `onDestroy`, and the Svelte 5 lifecycle story (creation + destruction only).
- `#untrack` — the `untrack` function for reading reactive values without creating a dependency.

## State sharing and structure

- `#stores` — `writable` / `readable` / `derived` stores and the `$store` auto-subscription.
- `#context` — `setContext` / `getContext`, scoped dependency injection across the tree.
- `#runes_in_js` — using runes in plain `.js` / `.ts` modules, outside `.svelte` files.

## Tooling and project

- `#project_setup` — scaffolding a Svelte project with Vite or SvelteKit.
- `#typescript` — `lang="ts"` and TypeScript integration in components.
- `#compiler` — what the Svelte compiler does, its flags and output.
- `#testing` — unit testing components with Vitest and Svelte Testing Library.
- `#debugging` — `$inspect`, `@debug`, and reactive-value inspection during development.

## Enhancements

- `#transitions` — `transition:`, `in:`, `out:` and the `svelte/transition` module.
- `#action` — `use:` actions and `{@attach}` attachments; reusable DOM-node behaviors.
- `#animate` — `animate:flip` and the `svelte/animate` module.

## Custom elements and styling extras

- `#custom_elements` — compiling Svelte components to Web Components (`customElement` option, shadow DOM).
- `#custom_properties` — passing CSS custom properties (variables) into child components.

## Foundations and concepts

- `#what_is_svelte` — the big-picture idea: compiler, surgical updates, no virtual DOM.
- `#signals` — the signal mechanism underlying Svelte 5 reactivity.
- `#batching` — microtask batching of multiple state changes into one DOM update.
- `#fine_grained` — fine-grained dependency tracking versus component-level invalidation.
- `#migration` — migrating from Svelte 3/4 to Svelte 5; the `sv migrate` tool and breaking changes.

## Special elements (the `<svelte:*>` family)

- `#svelte_window` — `<svelte:window>`, binding to window events and properties.
- `#svelte_document` — `<svelte:document>`, document-level events and bindings.
- `#svelte_body` — `<svelte:body>`, body-level events.
- `#svelte_head` — `<svelte:head>`, injecting into `document.head`.
- `#svelte_element` — `<svelte:element>`, rendering a dynamically-determined tag.
- `#svelte_boundary` — `<svelte:boundary>`, error and pending-state isolation.
- `#svelte_options` — `<svelte:options>`, per-component compiler options.

## Legacy / migration (separate track, not in CORE/MORE/ADVANCED)

- `#legacy_reactivity` — Svelte 3/4 `$:` reactive statements and assignment semantics.
- `#legacy_props` — Svelte 3/4 `export let` and `$$props` / `$$restProps`.
- `#legacy_slots` — Svelte 3/4 named and scoped slots.
- `#legacy_events` — Svelte 3/4 `createEventDispatcher` and event forwarding.
- `#legacy_lifecycle` — Svelte 3/4 `onMount`, `onDestroy`, `beforeUpdate`, `afterUpdate`.
- `#legacy_component` — Svelte 3/4 class-based components, `<svelte:component>`, `<svelte:self>`.
- `#legacy_store` — Svelte 3/4 stores and their role before runes-in-modules.

---

# SvelteKit tags (Q101–Q210)

## Overview and project

- `#kit_overview` — what SvelteKit is and how it relates to Svelte; the app framework vs the component compiler.
- `#project_setup` — scaffolding a SvelteKit project with `npx sv create`; the dev server.
- `#project_structure` — the SvelteKit directory layout (`src/routes`, `src/lib`, `src/app.html`, `svelte.config.js`, `vite.config.js`).
- `#lib` — the `$lib` alias to `src/lib`, and `$lib/server` for server-only code.
- `#config` — `svelte.config.js` and the `kit.*` namespace (adapter, alias, paths, prerender, csp, csrf, version, etc.).
- `#app_html` — `src/app.html`, the document shell template and its `%sveltekit.*%` placeholders.
- `#web_standards` — the standard Web APIs SvelteKit builds on (fetch, Request, Response, Headers, FormData, URL, URLSearchParams, crypto).

## Routing

- `#routing` — the file-based router, `+page.svelte`, dynamic params `[slug]`, layouts, advanced routing (rest/optional params, matchers, layout groups, breaking out with `@`).
- `#link_options` — the `data-sveltekit-*` attributes (preload-data, preload-code, reload, replacestate, keepfocus, noscroll).
- `#navigation` — `goto`, `invalidate`, `invalidateAll`, `preloadData`, `preloadCode`, `pushState`, `replaceState`, `beforeNavigate`, `afterNavigate`, `onNavigate`.

## Data loading and forms

- `#load` — `load` functions (`+page.js` / `+page.server.js` / `+layout.js` / `+layout.server.js`), universal vs server, inputs (`params`, `url`, `fetch`, `depends`, `parent`), invalidation, streaming, waterfalls.
- `#form_actions` — `actions` in `+page.server.js`, default vs named actions, `form` prop, validation errors, `fail()`.
- `#forms` — progressive enhancement, `use:enhance`, `applyAction`, `deserialize`, GET vs POST forms, file uploads.

## Page options and rendering

- `#page_options` — `ssr`, `csr`, `prerender`, `trailingSlash`, `entries`, `config` page options.
- `#rendering` — SSR, CSR, hydration, SSG, SPA, MPA, hybrid rendering, partial prerendering / ISR, version skew.
- `#errors` — expected vs unexpected errors, `error()` / `redirect()` helpers, `+error.svelte`, the static `error.html` fallback, `App.Error`.
- `#head` — `<svelte:head>` for per-page title and meta tags; interaction with SSR and streaming.

## Server, env, and security

- `#env` — `$env/static/private`, `$env/dynamic/private`, `$env/static/public`, `$env/dynamic/public`.
- `#server_only` — `$lib/server`, `.server.js` files, `$app/server`, and how SvelteKit prevents server code leaking to the client.
- `#fetch` — the special `fetch` inside `load` / hooks / endpoints, internal invocation, credentialed SSR fetch, `handleFetch`, response capture and inlining.
- `#cookies` — the `cookies` API (`get`/`set`/`delete`/`serialize`), `setHeaders`, subdomain and proxy gotchas.
- `#api_routes` — `+server.js` endpoints, HTTP verb handlers, `RequestEvent`, streaming, content negotiation, CORS, HEAD/OPTIONS.
- `#auth` — authentication patterns: cookies + `locals.user` + hooks, session vs token, protected routes.

## Hooks and lifecycle

- `#hooks` — `hooks.server.js` / `hooks.client.js` / `hooks.js`; `handle`, `handleError`, `handleFetch`, `handleValidationError`, `init`, `reroute`, `transport`; `event.locals`; `sequence`.

## State and special features

- `#app_state` — `$app/state` (modern) and the deprecated `$app/stores`; `page`, `navigating`, `updated`; `page.url`/`params`/`data`/`status`/`error`/`form`/`state`.
- `#state_management` — server statelessness, cross-user leak avoidance, URL as state store, component lifetime across navigation.
- `#snapshots` — the `snapshot` export with `capture` / `restore` for ephemeral DOM state across navigation.
- `#service_workers` — `src/service-worker.js`, the `$service-worker` module, caching strategies, offline support.

## Build, deploy, packaging

- `#build` — `vite build`, the two-stage build, build output, `vite preview`, precompress, bundle analysis.
- `#adapters` — the adapter concept, official adapters (node, static, vercel, netlify, cloudflare), platform options, writing custom adapters.
- `#packaging` — `@sveltejs/package` / `svelte-package`, library mode, `exports` field, types, tree-shaking.
- `#integrations` — `sv add` add-ons (tailwind, vitest, playwright, mdsvex, drizzle, better-auth), preprocessors.
- `#remote_functions` — experimental type-safe remote functions (`query`, `form`, `command`, `prerender`).

## Quality concerns

- `#performance` — SvelteKit's built-in optimizations, waterfalls, image/font/code optimization, Core Web Vitals.
- `#images` — image optimization, `@sveltejs/enhanced-img`, CDN strategies, `srcset`/`sizes`.
- `#a11y` — route announcements, focus management, `lang`, SvelteKit's accessibility defaults.
- `#seo` — SSR for indexing, sitemaps, canonical URLs, structured data, meta tags.
- `#observability` — OpenTelemetry tracing, `instrumentation.server.ts`, Server-Timing.
- `#testing` — unit/component/integration/E2E testing of SvelteKit code (load, actions, endpoints).
- `#debugging` — breakpoint debugging client and server code, devtools, source maps.
