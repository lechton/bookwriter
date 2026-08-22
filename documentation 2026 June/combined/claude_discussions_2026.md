# Claude Discussions — Svelte/SvelteKit (2026 June)

> Combined documentation generated 2026-06-11. Each section below is one source file, marked by its path.



---

<!-- SOURCE: claude-discussions/Claude_export_50 SvelteKit concepts in 50 minutes_8a1b163a-dd37-4d46-ab57-ea0f6179ca57.md -->

# FILE: `claude-discussions/Claude_export_50 SvelteKit concepts in 50 minutes_8a1b163a-dd37-4d46-ab57-ea0f6179ca57.md`

# SvelteKit, Reframed as Problems

### The 50 features are answers. Here are the questions.

> A folder of plain `.js` files can build a webpage. It cannot build an *application*. The moment your page acquires state, many components, many URLs, a server, and a memory that outlives a single click, you start hand-writing the bookkeeping that a framework would do for you. You become the framework, badly.
>
> Every section below is one wall you hit with plain files. Each follows the same shape: **the goal**, **what you'd do in plain JS**, **where that breaks**, **a concrete pain point**, and **the fix**. The fixes are the 50 concepts, grouped under the problem they solve.

**Step zero (so you can follow along):** `npx sv create app`, pick TypeScript, `npm i`, `npm run dev`. That is the only ceremony. Now the problems.

---

## Problem 1 — My screen does not update when my data changes

*Covers: the compiler model, `.svelte` files, scoped styles, `$state`, `$derived`, deep reactivity.*

**The goal.** A variable changes; the part of the screen showing it updates. Nothing else.

**The plain-JS instinct.** Hold a value, find the DOM node, write to it on every change:

```js
let count = 0;
const out = document.querySelector('#count');
document.querySelector('#btn').addEventListener('click', () => {
  count++;
  out.textContent = count;        // you, updating the DOM, by hand
});
```

**Where it breaks.** The variable and the pixels are two separate things you must keep in lockstep manually. Show `count` in a second place and you must remember to update both. Need a *derived* value like `doubled`? You recompute and rewrite it yourself, everywhere, on every change. Miss one spot and it silently goes stale. In a real app this manual sync becomes the bulk of your code and the bulk of your bugs. Plain JS gives you variables and a DOM, but no connection between them.

**Pain point.** A counter shows `count` in a heading *and* in the page title *and* shows `count * 2` next to it. One click now means three manual DOM writes you must never forget.

**The fix.** Svelte is a compiler, so it can *wire the variable to the DOM at build time*. You declare intent with a rune and stop touching the DOM:

```svelte
<script>
  let count = $state(0);            // a reactive variable
  let doubled = $derived(count * 2); // recomputes itself, stays in sync, cached
</script>

<button onclick={() => count++}>{count}</button>
<p>{count} doubled is {doubled}</p>
```

`$state` is the answer to "I need a variable whose changes the UI listens to." `$derived` is the answer to "I have a value computed from other values and I refuse to keep it in sync by hand." Both update every place they appear, automatically. And `$state` is *deep*: `todos.push(x)` or `todos[0].done = true` are tracked too, so you mutate plain objects and arrays and the screen still follows. (Bonus: a component's `<style>` block is auto-scoped to that component, so you also stop inventing class-name conventions to avoid CSS collisions.)

**The move.** Declare state once, derive everything you can, never write to the DOM yourself.

---

## Problem 2 — I need to *do* something when data changes, not just show it

*Covers: `$effect`, `$effect.pre`, post-vs-pre timing, and the discipline of when not to use them.*

**The goal.** When state changes, reach *out of the app* and affect the world: save to `localStorage`, set `document.title`, draw to a canvas, open a socket.

**The plain-JS instinct.** Call the side effect everywhere you change the data:

```js
function setCart(next) {
  cart = next;
  localStorage.setItem('cart', JSON.stringify(cart));   // repeated at every mutation site
}
```

**Where it breaks.** The side effect is now scattered across every place that touches the data. Add a new mutation path and forget the `localStorage` line, and persistence silently breaks. You want the effect attached to *the data*, not copy-pasted at every call site.

**Pain point.** Three different buttons modify the cart. Persistence must happen after any of them. With plain JS you wire the save into all three and pray you never add a fourth without remembering.

**The fix.** `$effect` runs after the DOM updates and re-runs whenever the state it reads changes. Attach the effect to the data once:

```svelte
<script>
  let cart = $state([]);
  $effect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));   // runs on ANY change to cart
  });
</script>
```

Return a function for cleanup (unsubscribe, `clearInterval`, `chart.destroy()`); it runs on teardown and before each re-run. **The discipline:** if an effect's only job is to set `$state` from other `$state`, you wanted `$derived` (Problem 1). Effects are for the *world*, not for syncing values inside the app.

**On pre vs post (why anyone mentions it).** An effect runs either *after* the DOM updates (`$effect`, the default) or *before* it (`$effect.pre`). You only care when the effect touches the DOM. Reading an element's final size needs *after*. Capturing the old DOM before it changes (the classic "was the chat scrolled to the bottom before this message arrived?") needs *before*. If your effect touches no DOM, ignore timing entirely.

**The move.** Effects sync with the outside world. Derive first; effect last; pick `pre` only when you must read or act before paint.

---

## Problem 3 — I want the same stateful logic in many components without copy-paste

*Covers: `.svelte.ts` composables and reactive classes.*

**The goal.** Write a piece of reactive logic once (a counter, a form controller, a debounced search) and reuse it across components.

**The plain-JS instinct.** Put it in a module and export a function:

```js
// counter.js
export function createCounter() {
  let count = 0;
  return { count, increment() { count++; } };
}
```

**Where it breaks.** That `count` is a plain variable. When `increment` changes it, nothing tells any component to update, and the value you returned was a one-time snapshot anyway. Plain JS modules can share *code*, but not *reactivity*. You'd have to invent your own subscribe/notify system, which is the moment you are rebuilding a framework.

**Pain point.** Two components both want a counter. You extract `createCounter()`, drop it in both, click the button, and nothing on screen moves, because the module has no way to announce the change.

**The fix.** Because runes are compiler primitives, not component magic, they work in any file named `*.svelte.ts`. Reactivity now lives in a plain, testable, reusable function:

```ts
// counter.svelte.ts
export function createCounter(initial = 0) {
  let count = $state(initial);
  return {
    get count() { return count; },   // getter keeps the live binding
    increment() { count++; }
  };
}
```

```svelte
<script>
  import { createCounter } from './counter.svelte.ts';
  const c = createCounter();
</script>
<button onclick={c.increment}>{c.count}</button>
```

This is the same pattern Vue calls a composable. When it grows past a couple of fields, use a **reactive class** (`class Counter { count = $state(0) }`) so field access stays live without the getter boilerplate. Your architecture moves out of `.svelte` files and into clean modules.

**The move.** Reactive logic belongs in `.svelte.ts` functions or classes, not trapped inside components.

---

## Problem 4 — A child component and its parent need to talk

*Covers: `$props` (data down), events-as-callback-props / `onclick` (events up), `$bindable` (two-way).* **This is your button-to-counter example.**

**The goal.** A `<Button>` lives inside a `<Counter>`. The `count` state lives in `Counter`. The button is clicked. The click must reach `Counter`'s increment logic.

**The plain-JS instinct.** Use DOM events, matched by string name:

```js
// child button
btn.addEventListener('click', () => {
  btn.dispatchEvent(new CustomEvent('increment', { bubbles: true }));
});

// parent
counterEl.addEventListener('increment', () => {
  count++;
  out.textContent = count;   // and re-render, by hand
});
```

**Where it breaks.** Plain JS has no concept of "*this* button instance belongs to *this* counter instance." You are matching DOM nodes and event-name strings, attaching and detaching listeners yourself, with no typed contract and no automatic cleanup. And after the event fires you still have to re-render manually (Problem 1 again). Nest this three components deep and it collapses.

**Pain point.** Exactly the one above: the button is in one file, the count is in another, and there is no clean, instance-scoped channel between them.

**The fix.** Data flows *down* as props; events flow *up* as callbacks the parent owns. An "event" is just a function the parent hands the child:

```svelte
<!-- Counter.svelte -->
<script>
  let count = $state(0);
</script>

<p>{count}</p>
<IncrementButton onIncrement={() => count++} />
```

```svelte
<!-- IncrementButton.svelte -->
<script>
  let { onIncrement } = $props();   // receive the channel
</script>

<button onclick={onIncrement}>+1</button>
```

The parent passes a function, the child calls it. Scoped to the instance, typed, no listener management, and the screen updates because `count` is `$state`. When a child genuinely needs to *write back* (a custom input, a slider), the parent opts into two-way binding with `$bindable`, which is the explicit, rare exception. `$props` is the answer to "how do I get data into a component." Callback props are the answer to "how does a child notify its parent."

**The move.** Props down, callbacks up. Two-way only when you declare it bindable.

---

## Problem 5 — I need to render branches, lists, and async states from data

*Covers: `{#if}`, `{#each}` with keys, `{#await}`, snippets (`{@render}`) and the `children` prop.*

**The goal.** Show different markup conditionally, render a list from an array, and handle "loading / loaded / error" for async data.

**The plain-JS instinct.** Build DOM from data by hand:

```js
list.innerHTML = todos.map(t => `<li>${t.text}</li>`).join('');   // rebuild on every change
```

**Where it breaks.** Two ways. First, `innerHTML =` rebuilds the entire list every time, so any focus, input value, scroll position, or animation inside a row is destroyed. Second, you are reinventing reconciliation: deciding what to add, remove, and reorder. The async case is worse, you hand-manage loading flags and error flags as extra state.

**Pain point.** A todo list where each row has an `<input>`. You reorder the list, the whole thing rebuilds via `innerHTML`, and the input the user was typing in loses focus and content.

**The fix.** Declarative blocks, and a **key** that tells Svelte which item is which so it moves nodes instead of rebuilding them:

```svelte
{#if user.loggedIn}
  <p>Welcome, {user.name}</p>
{:else}
  <a href="/login">Log in</a>
{/if}

{#each todos as todo (todo.id)}   <!-- the (todo.id) key prevents the focus bug -->
  <li>{todo.text}</li>
{:else}
  <li>Nothing to do.</li>
{/each}

{#await fetchUser()}
  <Spinner />
{:then u}
  <p>{u.name}</p>
{:catch e}
  <p>{e.message}</p>
{/await}
```

When you have *markup* (not a whole component) to reuse, **snippets** are parameterized fragments: `{#snippet row(item)}...{/snippet}` defined once, `{@render row(item)}` invoked many times. And the content a parent nests inside your component arrives as a `children` snippet you render with `{@render children()}`. (This replaces the old slot system entirely.)

**The move.** Describe the UI as a function of data with blocks; always key your lists; reuse markup with snippets.

---

## Problem 6 — I need to bind inputs and attach behavior and motion to elements

*Covers: `bind:`, `class:` / `style:`, actions (`use:`), transitions.*

**The goal.** Keep a form field in sync with a variable, toggle classes, add behaviors like click-outside, and animate elements in and out.

**The plain-JS instinct.** Wire each by hand:

```js
input.addEventListener('input', e => { email = e.target.value; });
input.value = email;                                   // and the reverse, manually
el.classList.toggle('active', isActive);               // re-run yourself on every change
document.addEventListener('click', onOutside);         // remember to removeEventListener later
```

**Where it breaks.** Every one of these is a small piece of imperative bookkeeping you write, re-run on change, and tear down yourself. Forget the `removeEventListener` and you leak. Forget to re-run the `classList.toggle` and the class goes stale. Animation means hand-rolling `requestAnimationFrame`. None of it is hard individually; all of it together is noise that buries your actual logic.

**Pain point.** A dropdown that should close when you click outside. In plain JS you attach a document listener on open, must remember to remove it on close and on unmount, and must not double-attach. Easy to get subtly wrong.

**The fix.** Declarative directives that bind and clean up for you:

```svelte
<input bind:value={email} />                  <!-- two-way, no event wiring -->
<div class:active={isActive} style:color={c}> <!-- class/style follow state -->
<div use:clickOutside={() => open = false}>   <!-- reusable DOM behavior, auto-cleaned -->

{#if visible}
  <div transition:fade>fades in and out</div> <!-- motion, one directive -->
{/if}
```

`bind:` is the answer to "stop hand-wiring inputs." `use:` actions package imperative DOM logic (with automatic `destroy` cleanup) so it is reusable and leak-free. Transitions give production motion without an animation library.

**The move.** Bind inputs, drive classes/styles from state, push imperative DOM logic into actions, animate with built-in transitions.

---

## Problem 7 — My app has many pages at different URLs, sharing chrome

*Covers: filesystem routing, dynamic / rest / optional params, layouts, layout groups, route matchers, error pages, navigation and preloading, `$app/state`.*

**The goal.** Multiple pages on real URLs, with shared nav and footer, parameterized routes, graceful errors, and fast navigation.

**The plain-JS instinct.** A router: parse `location.pathname`, match it against patterns, swap the page, update history, and re-attach the shared header to each view.

**Where it breaks.** You now own a router. You maintain a route table by hand, write matching logic, manage history and scroll, duplicate the shared chrome onto every page or invent your own layout system, and handle 404s yourself. This is a large, bug-prone subsystem, and it has been written thousands of times.

**Pain point.** You add a `/blog/[slug]` page and a `/dashboard` page that share a nav bar but need different layouts. With a hand-rolled router you are now writing pattern matching and a layout-nesting mechanism from scratch.

**The fix.** The filesystem *is* the router. Folders are URLs, brackets are params, and special files give you layouts and errors:

```
src/routes/
  +layout.svelte                ← shared chrome wrapping everything
  +page.svelte                  →  /
  blog/[slug]/+page.svelte      →  /blog/anything   (params.slug)
  docs/[...path]/+page.svelte   →  /docs/a/b/c       (rest param, great for 404s)
  (app)/                        ← a layout GROUP: different shell, invisible to the URL
    +layout.svelte
    dashboard/+page.svelte      →  /dashboard
  +error.svelte                 ← rendered when a load throws or a route 404s
```

Make a folder, get a route. `[slug]` / `[...rest]` / `[[optional]]` cover every URL shape. `+layout.svelte` wraps its subtree (rendering the page at `{@render children()}`) and nests automatically; `(group)` folders apply different layouts without changing URLs; matchers (`[id=integer]`) validate params before your code runs. Navigation is a plain `<a href>` (intercepted for client-side transitions) or `goto()`, and links **preload on hover/tap** so pages feel instant. Inside any component, `$app/state` exposes the live `page` (url, params, status) and `navigating`.

**The move.** Express your URL structure as folders and special files; let the framework own routing, layouts, and errors.

---

## Problem 8 — Each page needs data, fetched before it renders, some of it secret

*Covers: universal `load` (`+page.js`), server `load` (`+page.server.js`), the `LoadEvent`, parallel loading, streaming, layout-load inheritance, invalidation.*

**The goal.** A page arrives with its data already present (no spinner-on-mount), where database queries and secret keys never reach the browser.

**The plain-JS instinct.** Fetch inside the component after it mounts:

```js
let posts = [];
onMount(async () => { posts = await (await fetch('/api/posts')).json(); });
```

**Where it breaks.** Three problems. First, the page renders empty, then pops in the data, so the user sees a flash and search engines see nothing. Second, anything secret (a database URL, a private API key) cannot live in code that ships to the browser, so you cannot query the database directly here. Third, you hand-manage loading and error state. The "fetch on mount" pattern is the thing you are trying to escape.

**Pain point.** A dashboard must query the database with a private credential and render server-side for the first paint. Client-side `onMount` fetching can do neither: the credential would leak, and the first paint would be blank.

**The fix.** A `load` function runs *before* the component, and you choose where it runs:

```js
// +page.js  → universal: runs on server (for SSR) then in the browser. Public data only.
export async function load({ fetch }) {
  return { posts: await (await fetch('/api/posts')).json() };
}
```

```js
// +page.server.js  → server-only, always. Safe for databases and secrets.
import { db } from '$lib/server/db';
export async function load({ locals }) {
  if (!locals.user) throw redirect(303, '/login');
  return { projects: await db.project.findMany({ where: { ownerId: locals.user.id } }) };
}
```

```svelte
<script>
  let { data } = $props();   // the load's return value, already populated
</script>
{#each data.posts as p}<a href="/blog/{p.slug}">{p.title}</a>{/each}
```

The decision rule: **touches a database or secret? `+page.server.js`. Only public APIs or pure transforms? `+page.js`.** The `LoadEvent` hands you `params`, `url`, `parent()`, and a special `fetch` (it forwards cookies during SSR and can call your own endpoints without a network round trip). Start independent fetches in **parallel** with `Promise.all` to avoid waterfalls. **Stream** slow data by returning an un-awaited promise and resolving it in the view with `{#await}`. Load shared data once in `+layout.server.js` and every child page inherits it. When a mutation makes data stale, `invalidate()` re-runs the relevant `load`.

**The move.** Fetch in `load`, not on mount; server-load anything secret; parallelize and stream; invalidate to refresh.

---

## Problem 9 — Users need to change data, not just read it

*Covers: form actions, named actions, `use:enhance`, validation with `fail`, `redirect` / `error`.*

**The goal.** Submit a form, run server logic, validate input, show errors, redirect on success, and have it work even before JavaScript loads.

**The plain-JS instinct.** Intercept submit, fetch a JSON API, handle the response:

```js
form.addEventListener('submit', async e => {
  e.preventDefault();
  const res = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });
  // parse result, show errors, maybe redirect, all by hand
});
```

**Where it breaks.** You write and maintain a separate API endpoint, serialize and parse JSON on both sides, duplicate type definitions, and hand-route errors back into the UI. Worse, if JavaScript fails to load or is still loading, your form is dead, because everything depends on the `fetch`. You have rebuilt form handling from parts.

**Pain point.** A login form that must validate credentials on the server, repopulate the email on failure, show an error, and redirect to the dashboard on success, and ideally still submit if JS has not booted yet.

**The fix.** A page exports server-side `actions`; an ordinary HTML form posts to them. No API route, no JSON, no `fetch`:

```js
// +page.server.js
import { fail, redirect } from '@sveltejs/kit';
export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email');
    if (!email) return fail(400, { email, error: 'Email required' });   // back to the page as `form`
    cookies.set('session', makeToken(), { path: '/' });
    throw redirect(303, '/dashboard');
  }
};
```

```svelte
<script>
  import { enhance } from '$app/forms';
  let { form } = $props();          // fail()/return data lands here
</script>

<form method="POST" use:enhance>    <!-- one word upgrades to smooth client submit -->
  <input name="email" value={form?.email ?? ''} />
  {#if form?.error}<span>{form.error}</span>{/if}
  <button>Log in</button>
</form>
```

This is the elegant part of the design. Without `use:enhance` the form is a real HTML form that works with zero JavaScript. Add `use:enhance` and you get a smooth single-page submission plus automatic re-loading of page data, for one word. Use **named actions** (`action="?/login"`) when a page has several; `fail` for "your input was wrong, try again," `redirect`/`error` for "moving you" or "something broke." Pair with `sveltekit-superforms` + `zod` once forms get real.

**The move.** Mutations are form actions; build the no-JS version first, enhance second.

---

## Problem 10 — I need raw server endpoints and per-request middleware

*Covers: `+server.js` endpoints, `hooks.server.js` (`handle`, `locals`), `handleFetch` / `handleError` / `sequence`.*

**The goal.** Expose a JSON API (for a mobile client or a webhook), and run logic on *every* request (auth, logging, headers) in one place.

**The plain-JS instinct.** Stand up a separate Node/Express server, define routes, and add middleware there, alongside your frontend's own build.

**Where it breaks.** You now run and deploy two things, duplicate types and validation between them, and keep CORS and shared logic in sync across a boundary. Cross-cutting concerns like "attach the current user to the request" have nowhere shared to live in a pile of static files.

**Pain point.** Every page and endpoint needs to know who the user is. Without a request pipeline you re-parse the session cookie at the top of every single `load` and handler, duplicated everywhere.

**The fix.** Endpoints are files, and `hooks.server.js` is your one request pipeline:

```js
// src/routes/api/posts/+server.js  → a real HTTP endpoint
import { json } from '@sveltejs/kit';
export async function GET()          { return json(await db.post.findMany()); }
export async function POST({ request }) { return json(await db.post.create({ data: await request.json() }), { status: 201 }); }
```

```js
// src/hooks.server.js  → runs on EVERY request
export async function handle({ event, resolve }) {
  const token = event.cookies.get('session');
  event.locals.user = token ? await getUser(token) : null;   // resolve once, here
  return resolve(event);
}
```

`+server.js` exports `GET`/`POST`/etc. as standard `Request` in, `Response` out. The crucial mechanism in `handle` is **`event.locals`**: a per-request object you populate once and read in every `load`, action, and endpoint. That is how the user is resolved a single time at the door. Compose multiple hooks with `sequence`; shape crash logging with `handleError`; rewrite outbound fetches with `handleFetch`.

**The move.** Endpoints are files; cross-cutting logic goes in `handle`; share per-request data through `locals`.

---

## Problem 11 — I need memory that survives across pages: the logged-in user

*Covers: `.svelte.ts` shared state (in-memory), cookies and sessions, `hooks` → `locals` → server `load` → `data`, env vars, the `$lib/server` boundary.* **This is your "global variable across pages" question, and it has two distinct answers.**

**The goal.** Know who is logged in, everywhere, including after the user navigates, refreshes, or comes back tomorrow.

**The plain-JS instinct.** A global variable: `window.currentUser = user`, or a module-level `let user`.

**Where it breaks.** Two separate failures, and untangling them is the whole lesson.

First, a plain module-level variable is *not reactive*: components reading it will not update when it changes (Problem 1 and 3 again). Second, and more fundamentally, **JavaScript memory is per page load.** A hard refresh, a new tab, or returning later wipes every variable you held. So a global variable cannot, by itself, be a logged-in user that persists.

**Pain point.** You store the user in a module variable. It works while you click around, then the user hits refresh and they are "logged out," because the variable is gone.

**The fix is two layers, and you need to see them as different.**

**Layer A, in-memory shared state for one session.** A `.svelte.ts` module with a `$state` singleton. Every component imports the same instance and stays reactive:

```ts
// auth.svelte.ts
let user = $state(null);
export const auth = {
  get user() { return user; },
  set(u) { user = u; },
  clear() { user = null; }
};
```

Because SvelteKit navigations are *client-side* (no full reload), this single module instance **survives as you move between pages**. That alone answers "shared global reactive state across components and across page navigations." But it still dies on a hard refresh, because it lives in memory.

**Layer B, persistence across refreshes, which is what "logged in" actually requires.** Memory cannot do this; only the server can. The loop:

```js
// 1. A login action sets an httpOnly session cookie (Problem 9)
cookies.set('session', token, { path: '/', httpOnly: true, secure: true, sameSite: 'lax' });

// 2. hooks.server.js reads that cookie on EVERY request and fills locals (Problem 10)
event.locals.user = token ? await getUser(token) : null;

// 3. +layout.server.js load exposes it to every page
export async function load({ locals }) { return { user: locals.user }; }
```

```svelte
<!-- any page or layout -->
<script>
  let { data } = $props();
</script>
{#if data.user}Hi, {data.user.name}{/if}
```

Now the identity is stored in a cookie the browser sends on every request, validated on the server, and re-attached to `locals` after any refresh or new tab. Plain JS on the client cannot do this safely: it has no server-trusted, cross-request store, and `localStorage` is client-only and unsafe for sessions. The cookie + server-load loop is the only correct answer. (Secrets that power all this go in `$env/static/private`, which the build *refuses* to ship to the browser; `$lib/server/*` is the same hard guarantee for code.)

**The move.** Use a `.svelte.ts` singleton for reactive state shared this session; use a cookie + `hooks` + server `load` for identity that must outlive a refresh. They solve different halves of "global."

---

## Problem 12 — I must choose how each page renders, and deploy anywhere

*Covers: page options (`ssr` / `csr` / `prerender`), adapters.*

**The goal.** Render a marketing page as static HTML, a private dashboard as a client app, and ship the whole thing to whatever host you end up on, without rewriting code.

**The plain-JS instinct.** Pick one strategy globally (an SPA, or a static site, or a Node server) and hard-code your build and deploy around it.

**Where it breaks.** One strategy is wrong for at least some of your pages: an SPA tanks SEO on your landing page; a fully static site cannot do per-request dashboards. And committing your build to one host means a migration is a rewrite of build and deploy plumbing.

**Pain point.** Your blog should be static and instant; your dashboard must render per-user on the server. A single global rendering mode cannot satisfy both.

**The fix.** Rendering is a per-page option, and an adapter retargets the same app to any host:

```js
// in a +page.js / +page.server.js
export const prerender = true;   // build to static HTML (blogs, docs, marketing)
export const ssr = false;        // pure client app (private, interactive, SEO irrelevant)
export const csr = false;        // ship zero JS (purely static content)
```

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';  // or -node, -static, -vercel, -cloudflare
export default { kit: { adapter: adapter() } };
```

You mix rendering modes page by page. You swap `adapter-auto` for `adapter-node` (your own VPS or container), `adapter-static` (CDN), or a platform adapter, and **your application code does not change**, only the build target.

**The move.** Match each page to its rendering mode; let an adapter handle the host.

---

## Problem 13 — I want to delete the API boilerplate entirely

*Covers: remote functions (`query` / `form` / `command` / `prerender`), experimental.*

**The goal.** Call server logic from a component as if it were a local function, with end-to-end types, no hand-written endpoint, no JSON plumbing.

**The plain-JS instinct.** The status quo from Problems 8 to 10: write a `+server.js` endpoint, `fetch` it, parse JSON, and keep client and server types manually in sync.

**Where it breaks.** That boilerplate is real and repetitive: a route to maintain, request bodies to parse and validate by hand, and two type definitions that drift apart. It works, but it is ceremony.

**Pain point.** Adding one new "like a post" mutation means a new endpoint, a new fetch wrapper, manual validation, and duplicated types, for a one-line database update.

**The fix (experimental, behind a flag in recent SvelteKit 2.x).** Write server logic in a `.remote.ts` file and import it straight into a component. The compiler turns it into an endpoint plus a typed fetch wrapper for you:

```ts
// posts.remote.ts
import { query, form } from '$app/server';
import * as db from '$lib/server/db';

export const getPosts = query(async () => db.post.findMany());        // reactive, cached, typed
export const addPost  = form(async (data) => {                        // progressively enhanced
  await db.post.create({ data: { title: data.get('title') } });
  return { success: true };
});
```

```svelte
<script>
  import { getPosts, addPost } from './posts.remote.ts';
  const posts = getPosts();
</script>
{#each await posts as p}<li>{p.title}</li>{/each}
<form {...addPost}><input name="title" /><button>Add</button></form>
```

Four flavors: `query` (typed reactive reads, with `query.batch` for N+1 and `query.live` for realtime), `form` (enhanced mutations spread onto a `<form>`), `command` (mutations outside a form), `prerender` (build-time data). It is the fusion of everything above: colocation, type safety, progressive enhancement, server-only secrets, with the endpoint and type-syncing deleted. Treat it as experimental, but understand it, because this is where the framework is heading.

**The move.** When you tire of writing endpoints, colocate server logic in `.remote.ts` and call it like a function.

---

## The arc, in one breath

You start by making a single value show on screen (1), then act on changes (2), then package that logic (3), then let components talk (4). You render branches and lists from data (5), bind inputs and motion (6). You scale to many URLs (7), feed each page data before it paints (8), let users change that data (9), and add raw endpoints and a request pipeline (10). You give the app a memory that survives refreshes (11), choose how each page renders and ship it (12), and finally delete the API ceremony (13).

Plain `.js` files can do any one of these for a toy. The instant you need *all* of them at once, you are either hand-writing a framework or using one. The 50 features are simply the framework's answers, and now you know the question each one answers.# 50 SvelteKit concepts in 50 minutes

**Model:** claude-opus-4-8

### User

What would be the 50 SvelteKit concepts to learn in 50 minutes ? 

Create full lecture with examples. Make sure you write like a charismatic professor with proper leading questions, clear thinking and lucid presentation on building concepts one over the previous.

Powerful high voltage lecture with proper titles and subtitles. Go straight to the app creating points. For someone needing to build a sveltekit app ASAP.

---

### Assistant

I've got the current picture (Svelte 5 runes are the standard, SvelteKit 2.x, snippets replaced slots, and remote functions have landed as the experimental flagship). Writing the full lecture now.

Done. 50 concepts, seven movements, each building on the last, written to be read front to back.

The spine of it: **Movement 0** sets the compiler mental model, then it's the component layer (runes, `.svelte.ts` composables), the template language (snippets, not slots; `onclick`, not `on:click`), routing, then the three load-bearing app concepts: **`load` functions** (universal vs server, parallel loading, streaming), **form actions** (`use:enhance`, progressive enhancement), and **hooks/`locals`** for auth. It ends on adapters and remote functions (the experimental `.remote.ts` future), plus a 30-second build recipe at the bottom that's the actual order you work in.

Everything is current to Svelte 5 / SvelteKit 2.x. If you want, I can spin this into a runnable starter repo (routes, a server `load`, a form action with `use:enhance`, and the auth hook all wired) so you've got a skeleton to build vuejobs on top of.

---

### User

Derived vs effect

Maps exactly on vue

Computed vs watch ?

---

### Assistant

Half of it is exact. Half of it slips, and the slip is the part worth knowing.

| Svelte | Vue | Fidelity |
|---|---|---|
| `$derived` | `computed` | Essentially exact |
| `$effect` | `watchEffect` | Close, with caveats |
| (none built in) | `watch(src, (new, old) => …)` | No direct rune |

**`$derived` ↔ `computed` is the tight one.** Both are pull-based, lazy, cached, auto-tracked, and meant to be pure. Read it, get a memoized value; it recomputes only when a dependency actually changed. `$derived(expr)` for expressions, `$derived.by(() => …)` for blocks. The one real divergence: in Svelte 5 you can reassign a `$derived` as a temporary optimistic override (it re-derives on the next dependency change), whereas a plain Vue `computed` is read-only unless you write the `get`/`set` form.

Now the part your analogy gets slightly wrong:

**The precise twin of `$effect` is `watchEffect`, not `watch`.** `watchEffect` and `$effect` both run automatically, auto-track whatever they read, re-run on change, and clean up via a returned function. That is the clean 1:1. `watch(source, cb)` is a different animal: explicit sources, gives you previous and next values, lazy by default. Runes have no "old value" mechanism, so `watch` is the loosest mapping. You reconstruct it by holding your own previous value, or a `$derived` source read inside an `$effect`.

**Default flush timing is inverted, and this bites on a port.** Vue's `watch`/`watchEffect` default to `flush: 'pre'` (before the DOM updates). Svelte's `$effect` runs *after* the DOM updates, i.e. Vue's `flush: 'post'`. The pre-render equivalent is `$effect.pre`. So a Vue watcher you expected to fire before paint should become `$effect.pre`, not `$effect`.

**The cultural posture differs even where the mechanics match, and this matters more than syntax.** In Vue, `watch` is a normal everyday tool. In Svelte 5, `$effect` is explicitly a last resort. The rule: if your effect sets `$state` from other `$state`, you wanted `$derived`. A Vue dev who reaches for `$effect` the way they reach for `watch` writes un-idiomatic, loop-prone Svelte. Derive aggressively; reserve `$effect` for touching the outside world (DOM, canvas, subscriptions, third-party libs, logging).

Corrected mnemonic: `$derived` = `computed`, `$effect` = `watchEffect`, and `watch` with old/new values and flush control is something you build yourself.

---

### User

Can you explain in clear easy to grasp examples each logical piece required to grasp what is at stake and the different solutions? I need maximum pedagogical clarity with examples of when it matters, why even talk about post pre etc

---

### Assistant

The whole thing collapses into one question you ask at the point of writing code. Everything else (pull vs push, pre vs post, old value) is just consequences of that question. Let me build it piece by piece, each with the moment it actually bites.

## Piece 1: The deciding question — are you producing a value, or making something happen?

This is the entire fork. Before reaching for any primitive, ask: does this code *return a value* that other code reads, or does it *cause an effect on the world* (DOM, network, storage, a chart library)?

```js
// Producing a value → derived / computed
let total = $derived(price * quantity);

// Making something happen → effect / watcher
$effect(() => { localStorage.setItem('cart', JSON.stringify(items)); });
```

`total` exists to be read. The `localStorage` write exists to *do* something; it returns nothing useful. If you can finish the sentence "this computes the value of X," it is a derived. If you finish "this makes Y happen when things change," it is an effect. Vue is identical: `computed` returns, `watch`/`watchEffect` act.

## Piece 2: Why the split exists at all — pull vs push (the cost model)

This is *why* you should prefer derived heavily. A derived is **pull-based**: lazy and cached. It does not run when its inputs change. It runs when something *reads* it, and only if an input actually changed since last read. An effect is **push-based**: eager. It runs every time a dependency changes, whether anyone is looking or not.

```js
let bigList = $state([/* 10,000 items */]);

let sorted = $derived.by(() => {
  console.log('sorting!');          // logs ONLY when sorted is read and bigList changed
  return [...bigList].sort(expensiveCompare);
});
```

If `sorted` is rendered inside a collapsed panel nobody has opened, the sort never runs. Open the panel, it runs once, then caches. This is why you can have dozens of deriveds cheaply: most stay dormant. An effect doing the same sort would run on every `bigList` change regardless. So the cost model itself pushes you toward "derive by default, effect only when forced." Same in Vue: `computed` is lazy+cached, `watchEffect` is eager.

## Piece 3: The trap — syncing state with an effect

Here is the mistake a Vue developer makes on day one of Svelte, because `watch` is an everyday tool in Vue and the reflex carries over.

```js
// THE TRAP
let first = $state('Ada');
let last = $state('Lovelace');
let full = $state('');

$effect(() => { full = `${first} ${last}`; });   // "watch first+last, set full"
```

Three things break, and they are worth feeling concretely:

1. **First render is wrong.** `full` starts as `''`. The component renders with an empty name. The effect runs *after* that render, sets `full`, triggering a *second* render. The user can see a flash of the empty value.
2. **Wasted work.** You paid for two render cycles to display one value.
3. **Loop risk.** The moment anything reads `full` and writes back to `first` or `last`, you have an infinite cycle.

The fix is to stop *syncing* and start *deriving*:

```js
let full = $derived(`${first} ${last}`);   // correct, single pass, always consistent
```

The rule that kills the trap: **if an effect's only job is to set state from other state, you wanted a derived.** This is the single most important porting habit from Vue to Svelte.

## Piece 4: When an effect is genuinely correct

Effects are not bad. They are the *only* tool for one job: reaching out of the reactive system into the world. The world means the DOM, the network, timers, subscriptions, and third-party libraries that do not know your state exists.

```js
$effect(() => {
  const chart = new Chart(canvas, { data: chartData });   // hand state to a lib
  return () => chart.destroy();                            // cleanup on teardown / before re-run
});
```

The returned function is cleanup. It runs when the component unmounts and before the effect re-runs. This is identical to `watchEffect`'s `onCleanup` and to the cleanup returned from Vue's effect scope. Focus an input, set `document.title`, open a websocket, start an interval: all legitimately effects, because none of them are "a value," they are all "something happening to the world."

## Piece 5: Auto-track vs explicit source — the watchEffect/watch fork

Now the reason Vue has *two* effect-like APIs and Svelte has one. Both `$effect` and `watchEffect` **auto-track**: they react to everything they read. Vue's `watch(source, cb)` is **explicit**: you name the trigger, and the callback can read other things without those becoming triggers.

```js
// Vue: watchEffect fires when EITHER count or name changes (both are read)
watchEffect(() => { console.log(count.value, name.value); });

// Vue: watch fires only when count changes, even though the cb reads name
watch(count, () => { console.log(count.value, name.value); });
```

Why does that distinction matter? Because sometimes you want to *react to* A while only *reading* B. With auto-tracking, reading B accidentally subscribes you to B. Svelte has no `watch`, so you opt B out manually with `untrack`:

```js
import { untrack } from 'svelte';

$effect(() => {
  count;                                   // tracked: this is the trigger
  untrack(() => { console.log(name); });   // read but NOT a trigger
});
```

So Svelte's `$effect` + `untrack` reconstructs by hand what Vue gives you declaratively with `watch`'s explicit source. The mechanism is the same; Svelte just makes you spell out the exclusion.

## Piece 6: The old value — why `watch` hands you `(new, old)`

Auto-tracking effects know *that* something changed, not *what it was before*. `watch` gives you both values, and there are real cases where you cannot proceed without the previous one:

- Direction: did the count go *up* or *down*?
- Transitions: only act when auth went from logged-out to logged-in (not on every auth change).
- Animation: tween *from* the old value *to* the new.
- Diffing: find which item was added to a list.

```js
// Vue: trivial
watch(count, (next, prev) => {
  if (next > prev) fireConfetti();
});
```

Runes have no old-value channel, so you store it yourself. `prev` is a plain variable (not `$state`), so reading and writing it triggers nothing and cannot loop:

```js
let count = $state(0);
let prev = count;

$effect(() => {
  const next = count;                 // tracked
  if (next > prev) fireConfetti();
  prev = next;                        // plain assignment, no reactivity
});
```

This is the loosest mapping in your table precisely because the previous value is a first-class idea in Vue and a do-it-yourself one in Svelte.

## Piece 7: Timing — pre vs post, and why anyone talks about it

You asked why this even comes up. Here is the why. Between "state changed" and "the user sees it," there is a precise sequence:

**state changes → framework updates the DOM → browser paints**

An effect can run on *either side* of the DOM-update step. If your effect never touches the DOM, you never care which side, and you can ignore this whole piece. The instant your effect *reads layout* or *needs to act before the user sees the change*, the side becomes load-bearing. Two concrete needs pull in opposite directions.

**You need POST (run after the DOM updates) when you must read the final DOM.** Measuring an element only works once it reflects the new state.

```svelte
<script>
  let tooltip;
  let width = $state(0);

  $effect(() => {                    // Svelte default = post = after DOM update
    width = tooltip.offsetWidth;     // measured with final content; correct
  });
</script>
```

Run this *before* the DOM updated and you measure stale or nonexistent layout. Vue's equivalent is `watch(src, cb, { flush: 'post' })`.

**You need PRE (run before the DOM updates) when you must capture the old DOM, or act before the user sees a flash.** The canonical case is autoscrolling a chat log. To decide "keep the user pinned to the bottom," you have to check whether they were *already* at the bottom *before* the new message is inserted, because inserting it changes `scrollHeight`.

```svelte
<script>
  import { tick } from 'svelte';
  let messages = $state([]);
  let viewport;

  $effect.pre(() => {                                   // runs BEFORE the DOM updates
    messages.length;                                    // track, so this runs on new messages
    if (!viewport) return;

    const atBottom =
      viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 2;

    if (atBottom) {
      tick().then(() => {                               // wait for the DOM to update
        viewport.scrollTop = viewport.scrollHeight;     // THEN pin to new bottom
      });
    }
  });
</script>
```

If you ran this as a plain (post) effect, the message would already be in the DOM and `scrollHeight` already changed, so you could no longer tell whether the user *had been* at the bottom. The old-DOM read is only possible on the pre side.

**The porting gotcha that silently bites you:** the defaults are flipped. Vue's `watch`/`watchEffect` default to `flush: 'pre'`. Svelte's `$effect` defaults to post. So a Vue watcher you relied on firing *before* paint must become `$effect.pre` in Svelte, not `$effect`. Move it over unchanged and it runs one step later than it used to, which produces exactly the flicker or stale-measurement bug that is miserable to track down.

## The whole thing as a decision flow

1. Does this *return a value* others read? → `$derived` (`computed`). Stop here for anything expressible from existing state. This covers most cases.
2. Does it *make something happen in the world*? → `$effect` (`watchEffect`).
3. Inside that effect, do you need to react to some inputs but only read others? → `untrack` the read-only ones (Vue: use `watch` with an explicit source).
4. Do you need the previous value? → store it in a plain variable (Vue: `watch`'s second arg).
5. Does the effect touch the DOM? → does it *read* final layout (post, Svelte default) or *capture old DOM / prevent a flash* (pre, `$effect.pre`)? If it touches no DOM, ignore timing entirely.

The mnemonic from before holds, now with the *why* attached: `$derived` = `computed` because both are lazy values; `$effect` = `watchEffect` because both auto-track side effects; and `watch` with old/new plus flush control is something you assemble from `$effect`, a stored previous, `untrack`, and `$effect.pre`.

---

### User

12. .svelte.ts — reactivity outside components (the unlock)

This reminds React hooks ? Does it have a name in Svelte ? 

Show a similar example in React and vue

---

### Assistant

It rhymes with React hooks, but mechanically it is Vue's composables almost exactly. The hooks resemblance is only skin deep ("reusable stateful logic packaged in a function"), and the underlying model is the opposite of hooks. You already know why, you just have to map it.

**On the name:** Svelte deliberately does not brand this with a big ceremony, which is part of the philosophy (it is "just functions and classes"). There is no single blessed term the way Vue has "composables." In practice:
- The community borrows **"composables"** from Vue.
- The class-based form is called a **"reactive class."**
- The descriptive idea people reach for is that runes are **portable / universal**: the same `$state` and `$derived` work identically inside and outside a component.

So your instinct is right that it should have a name, and the honest answer is that the most accurate name is the Vue one.

## Same counter, three frameworks

**Svelte (`counter.svelte.ts`)**
```ts
export function createCounter(initial = 0) {
  let count = $state(initial);
  let doubled = $derived(count * 2);
  return {
    get count() { return count; },     // getter keeps the live binding
    get doubled() { return doubled; },
    increment() { count++; },
    reset() { count = initial; }
  };
}
```
```svelte
<script>
  import { createCounter } from './counter.svelte.ts';
  const counter = createCounter();
</script>
<button onclick={counter.increment}>{counter.count} → {counter.doubled}</button>
```

**Vue (`useCounter.ts`)**
```ts
import { ref, computed } from 'vue';

export function useCounter(initial = 0) {
  const count = ref(initial);
  const doubled = computed(() => count.value * 2);
  const increment = () => count.value++;
  const reset = () => { count.value = initial; };
  return { count, doubled, increment, reset };
}
```
```vue
<script setup>
import { useCounter } from './useCounter';
const { count, doubled, increment } = useCounter();  // refs survive destructuring
</script>
<template>
  <button @click="increment">{{ count }} → {{ doubled }}</button>
</template>
```

**React (`useCounter.ts`)**
```ts
import { useState, useCallback } from 'react';

export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const doubled = count * 2;                          // recomputed every render
  const increment = useCallback(() => setCount(c => c + 1), []);
  const reset = useCallback(() => setCount(initial), [initial]);
  return { count, doubled, increment, reset };
}
```
```tsx
function CounterButton() {
  const { count, doubled, increment } = useCounter();
  return <button onClick={increment}>{count} → {doubled}</button>;
}
```

The three look almost identical. The differences are entirely in *what happens when you call them*, and that is the whole point.

## Why it is Vue's model, not React's

| | Svelte `.svelte.ts` | Vue composable | React hook |
|---|---|---|---|
| **When the function body runs** | Once, at call time | Once, at call time | **Every render** |
| **What `count` is** | A live reactive reference | A live reactive `ref` | A fresh **snapshot** per render |
| **Where state lives** | In the reactive value itself | In the `ref` itself | In React's fiber, keyed by **call order** |
| **Call-site rules** | None. Call anywhere | None (convention: in setup) | **Rules of Hooks**: top level only, no conditionals/loops, components only, stable order |
| **Stale-closure / dep-array tax** | No | No | Yes (`useCallback`, `useMemo`, deps) |
| **Share one state app-wide** | Export a module-level instance | Export a module-level singleton | Needs Context or an external store |

The load-bearing row is the first one. A React hook **re-executes top to bottom on every render**; the state only persists because React tracks it by the order your hooks were called, which is why the Rules of Hooks exist and why you fight stale closures and dependency arrays. Svelte and Vue run the function **once** and put the reactivity *inside the returned references*, so there is no render loop, no call-order magic, no rules, and you can call them conditionally or outside a component.

This is also why global state is trivial in Svelte and Vue and awkward in React. Move the state out of the function and export it once:

```ts
// Svelte: shared.svelte.ts          // Vue: shared.ts
let count = $state(0);                const count = ref(0);
export const counter = {             export const counter = {
  get count() { return count; },       count,
  increment() { count++; }             increment: () => count.value++
};                                   };
```
Import that anywhere and every component reads and writes the same reactive value. In React, two components calling `useCounter()` get two independent states, so sharing forces you into Context or Zustand/Redux.

## One gotcha worth pairing in your head

Svelte and Vue both have a "do not drop the live reference" rule; React does not need one because every value is a per-render snapshot by design.

- **Svelte:** returning a raw `$state` *primitive* hands back its value at that instant, losing reactivity. Fix it with a getter (above), or use a **reactive class**, where field access stays live and the getter boilerplate disappears:
  ```ts
  // counter.svelte.ts
  export class Counter {
    count = $state(0);
    doubled = $derived(this.count * 2);
    increment = () => { this.count++; };
  }
  // const c = new Counter();  →  c.count, c.doubled stay reactive
  ```
- **Vue:** destructuring a `reactive()` object loses reactivity, but a `ref` survives destructuring because it is a box (use `toRefs` for reactive objects).
- **React:** nothing live to lose, so no such rule, but that same fact is why you pay the dependency-array tax instead.

Takeaway: read it as "Vue composables with runes instead of refs." The class form is the closest thing Svelte has to a named, idiomatic version of the pattern, and it is the one to reach for once a composable grows past a couple of fields.

---

### User

The 50 concepts present them in comparison to simple JS files. Repeat & a comment why simple JS is not enough to do the job. Also add a simple clear example of pain point: e.g. a button embedded inside  a parent component of a counter needs to be able to transmit the "click event" to its parent, where the counter code resides. 

What problem $state resolves? A reactive variable. Why we need one? 

How we keep global variables and menory accross many components, let's say the current user logged in, when we change pages.

I need you to reframe the whole article not on 50 solutions but the titles of key problems we need to solve (you can  group the solutions in common problems)

---

### Assistant

This reframe is the right instinct. Features are answers; nobody remembers answers to questions they never felt. So I rebuilt the whole thing as the **13 problems** a plain-JS app runs into, and grouped the 50 solutions under them. Every section follows the same shape: the goal, what you'd naively do with plain `.js` files, exactly where that wall hits, a minimal pain point, then the fix. Your two explicit questions (`$state` and the logged-in user across pages) are answered inside Problems 1 and 11, and your button-to-parent example is the spine of Problem 4.

Done. The whole thing now reads as 13 problems, each with the same repeating beat: goal → what you'd do in plain JS → where that wall hits → a minimal pain point → the fix that groups the relevant features.

Three things worth pointing you to directly:

**Your button-to-counter example is Problem 4**, shown both ways: the plain-JS `CustomEvent`-by-string-name version (and why instance-scoped wiring is the thing it can't express), then the Svelte answer where the parent hands the child a callback prop and the child just calls it.

**`$state` is answered in Problem 1** as "the variable and the pixels are two separate things you otherwise keep in sync by hand." The reason you need a reactive variable is precisely that plain JS gives you a variable *and* a DOM but no connection between them.

**Your global-user question is Problem 11, and I split it into two layers on purpose**, because that's where the confusion usually lives:
- A `.svelte.ts` `$state` singleton gives you reactive shared state that *survives client-side navigation* (since SvelteKit doesn't full-reload between pages), but dies on a hard refresh because JS memory is per page load.
- Persisting the logged-in user across refreshes is a different problem that only the server can solve: cookie → `hooks` → `locals` → server `load` → `data`. That's the actual "logged in when I change pages" answer.

If it'd help, I can collapse the two SvelteKit artifacts into one (problem-first as the spine, the original 50-concept reference as an appendix), or build the runnable auth skeleton that implements Problem 11 end to end.

---




---

<!-- SOURCE: claude-discussions/SvelteKit Reframed as Problems.md -->

# FILE: `claude-discussions/SvelteKit Reframed as Problems.md`

# SvelteKit, Reframed as Problems

### The 50 features are answers. Here are the questions.

> A folder of plain `.js` files can build a webpage. It cannot build an *application*. The moment your page acquires state, many components, many URLs, a server, and a memory that outlives a single click, you start hand-writing the bookkeeping that a framework would do for you. You become the framework, badly.
>
> Every section below is one wall you hit with plain files. Each follows the same shape: **the goal**, **what you'd do in plain JS**, **where that breaks**, **a concrete pain point**, and **the fix**. The fixes are the 50 concepts, grouped under the problem they solve.

**Step zero (so you can follow along):** `npx sv create app`, pick TypeScript, `npm i`, `npm run dev`. That is the only ceremony. Now the problems.

---

## Problem 1 — My screen does not update when my data changes

*Covers: the compiler model, `.svelte` files, scoped styles, `$state`, `$derived`, deep reactivity.*

**The goal.** A variable changes; the part of the screen showing it updates. Nothing else.

**The plain-JS instinct.** Hold a value, find the DOM node, write to it on every change:

```js
let count = 0;
const out = document.querySelector('#count');
document.querySelector('#btn').addEventListener('click', () => {
  count++;
  out.textContent = count;        // you, updating the DOM, by hand
});
```

**Where it breaks.** The variable and the pixels are two separate things you must keep in lockstep manually. Show `count` in a second place and you must remember to update both. Need a *derived* value like `doubled`? You recompute and rewrite it yourself, everywhere, on every change. Miss one spot and it silently goes stale. In a real app this manual sync becomes the bulk of your code and the bulk of your bugs. Plain JS gives you variables and a DOM, but no connection between them.

**Pain point.** A counter shows `count` in a heading *and* in the page title *and* shows `count * 2` next to it. One click now means three manual DOM writes you must never forget.

**The fix.** Svelte is a compiler, so it can *wire the variable to the DOM at build time*. You declare intent with a rune and stop touching the DOM:

```svelte
<script>
  let count = $state(0);            // a reactive variable
  let doubled = $derived(count * 2); // recomputes itself, stays in sync, cached
</script>

<button onclick={() => count++}>{count}</button>
<p>{count} doubled is {doubled}</p>
```

`$state` is the answer to "I need a variable whose changes the UI listens to." `$derived` is the answer to "I have a value computed from other values and I refuse to keep it in sync by hand." Both update every place they appear, automatically. And `$state` is *deep*: `todos.push(x)` or `todos[0].done = true` are tracked too, so you mutate plain objects and arrays and the screen still follows. (Bonus: a component's `<style>` block is auto-scoped to that component, so you also stop inventing class-name conventions to avoid CSS collisions.)

**The move.** Declare state once, derive everything you can, never write to the DOM yourself.

---

## Problem 2 — I need to *do* something when data changes, not just show it

*Covers: `$effect`, `$effect.pre`, post-vs-pre timing, and the discipline of when not to use them.*

**The goal.** When state changes, reach *out of the app* and affect the world: save to `localStorage`, set `document.title`, draw to a canvas, open a socket.

**The plain-JS instinct.** Call the side effect everywhere you change the data:

```js
function setCart(next) {
  cart = next;
  localStorage.setItem('cart', JSON.stringify(cart));   // repeated at every mutation site
}
```

**Where it breaks.** The side effect is now scattered across every place that touches the data. Add a new mutation path and forget the `localStorage` line, and persistence silently breaks. You want the effect attached to *the data*, not copy-pasted at every call site.

**Pain point.** Three different buttons modify the cart. Persistence must happen after any of them. With plain JS you wire the save into all three and pray you never add a fourth without remembering.

**The fix.** `$effect` runs after the DOM updates and re-runs whenever the state it reads changes. Attach the effect to the data once:

```svelte
<script>
  let cart = $state([]);
  $effect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));   // runs on ANY change to cart
  });
</script>
```

Return a function for cleanup (unsubscribe, `clearInterval`, `chart.destroy()`); it runs on teardown and before each re-run. **The discipline:** if an effect's only job is to set `$state` from other `$state`, you wanted `$derived` (Problem 1). Effects are for the *world*, not for syncing values inside the app.

**On pre vs post (why anyone mentions it).** An effect runs either *after* the DOM updates (`$effect`, the default) or *before* it (`$effect.pre`). You only care when the effect touches the DOM. Reading an element's final size needs *after*. Capturing the old DOM before it changes (the classic "was the chat scrolled to the bottom before this message arrived?") needs *before*. If your effect touches no DOM, ignore timing entirely.

**The move.** Effects sync with the outside world. Derive first; effect last; pick `pre` only when you must read or act before paint.

---

## Problem 3 — I want the same stateful logic in many components without copy-paste

*Covers: `.svelte.ts` composables and reactive classes.*

**The goal.** Write a piece of reactive logic once (a counter, a form controller, a debounced search) and reuse it across components.

**The plain-JS instinct.** Put it in a module and export a function:

```js
// counter.js
export function createCounter() {
  let count = 0;
  return { count, increment() { count++; } };
}
```

**Where it breaks.** That `count` is a plain variable. When `increment` changes it, nothing tells any component to update, and the value you returned was a one-time snapshot anyway. Plain JS modules can share *code*, but not *reactivity*. You'd have to invent your own subscribe/notify system, which is the moment you are rebuilding a framework.

**Pain point.** Two components both want a counter. You extract `createCounter()`, drop it in both, click the button, and nothing on screen moves, because the module has no way to announce the change.

**The fix.** Because runes are compiler primitives, not component magic, they work in any file named `*.svelte.ts`. Reactivity now lives in a plain, testable, reusable function:

```ts
// counter.svelte.ts
export function createCounter(initial = 0) {
  let count = $state(initial);
  return {
    get count() { return count; },   // getter keeps the live binding
    increment() { count++; }
  };
}
```

```svelte
<script>
  import { createCounter } from './counter.svelte.ts';
  const c = createCounter();
</script>
<button onclick={c.increment}>{c.count}</button>
```

This is the same pattern Vue calls a composable. When it grows past a couple of fields, use a **reactive class** (`class Counter { count = $state(0) }`) so field access stays live without the getter boilerplate. Your architecture moves out of `.svelte` files and into clean modules.

**The move.** Reactive logic belongs in `.svelte.ts` functions or classes, not trapped inside components.

---

## Problem 4 — A child component and its parent need to talk

*Covers: `$props` (data down), events-as-callback-props / `onclick` (events up), `$bindable` (two-way).* **This is your button-to-counter example.**

**The goal.** A `<Button>` lives inside a `<Counter>`. The `count` state lives in `Counter`. The button is clicked. The click must reach `Counter`'s increment logic.

**The plain-JS instinct.** Use DOM events, matched by string name:

```js
// child button
btn.addEventListener('click', () => {
  btn.dispatchEvent(new CustomEvent('increment', { bubbles: true }));
});

// parent
counterEl.addEventListener('increment', () => {
  count++;
  out.textContent = count;   // and re-render, by hand
});
```

**Where it breaks.** Plain JS has no concept of "*this* button instance belongs to *this* counter instance." You are matching DOM nodes and event-name strings, attaching and detaching listeners yourself, with no typed contract and no automatic cleanup. And after the event fires you still have to re-render manually (Problem 1 again). Nest this three components deep and it collapses.

**Pain point.** Exactly the one above: the button is in one file, the count is in another, and there is no clean, instance-scoped channel between them.

**The fix.** Data flows *down* as props; events flow *up* as callbacks the parent owns. An "event" is just a function the parent hands the child:

```svelte
<!-- Counter.svelte -->
<script>
  let count = $state(0);
</script>

<p>{count}</p>
<IncrementButton onIncrement={() => count++} />
```

```svelte
<!-- IncrementButton.svelte -->
<script>
  let { onIncrement } = $props();   // receive the channel
</script>

<button onclick={onIncrement}>+1</button>
```

The parent passes a function, the child calls it. Scoped to the instance, typed, no listener management, and the screen updates because `count` is `$state`. When a child genuinely needs to *write back* (a custom input, a slider), the parent opts into two-way binding with `$bindable`, which is the explicit, rare exception. `$props` is the answer to "how do I get data into a component." Callback props are the answer to "how does a child notify its parent."

**The move.** Props down, callbacks up. Two-way only when you declare it bindable.

---

## Problem 5 — I need to render branches, lists, and async states from data

*Covers: `{#if}`, `{#each}` with keys, `{#await}`, snippets (`{@render}`) and the `children` prop.*

**The goal.** Show different markup conditionally, render a list from an array, and handle "loading / loaded / error" for async data.

**The plain-JS instinct.** Build DOM from data by hand:

```js
list.innerHTML = todos.map(t => `<li>${t.text}</li>`).join('');   // rebuild on every change
```

**Where it breaks.** Two ways. First, `innerHTML =` rebuilds the entire list every time, so any focus, input value, scroll position, or animation inside a row is destroyed. Second, you are reinventing reconciliation: deciding what to add, remove, and reorder. The async case is worse, you hand-manage loading flags and error flags as extra state.

**Pain point.** A todo list where each row has an `<input>`. You reorder the list, the whole thing rebuilds via `innerHTML`, and the input the user was typing in loses focus and content.

**The fix.** Declarative blocks, and a **key** that tells Svelte which item is which so it moves nodes instead of rebuilding them:

```svelte
{#if user.loggedIn}
  <p>Welcome, {user.name}</p>
{:else}
  <a href="/login">Log in</a>
{/if}

{#each todos as todo (todo.id)}   <!-- the (todo.id) key prevents the focus bug -->
  <li>{todo.text}</li>
{:else}
  <li>Nothing to do.</li>
{/each}

{#await fetchUser()}
  <Spinner />
{:then u}
  <p>{u.name}</p>
{:catch e}
  <p>{e.message}</p>
{/await}
```

When you have *markup* (not a whole component) to reuse, **snippets** are parameterized fragments: `{#snippet row(item)}...{/snippet}` defined once, `{@render row(item)}` invoked many times. And the content a parent nests inside your component arrives as a `children` snippet you render with `{@render children()}`. (This replaces the old slot system entirely.)

**The move.** Describe the UI as a function of data with blocks; always key your lists; reuse markup with snippets.

---

## Problem 6 — I need to bind inputs and attach behavior and motion to elements

*Covers: `bind:`, `class:` / `style:`, actions (`use:`), transitions.*

**The goal.** Keep a form field in sync with a variable, toggle classes, add behaviors like click-outside, and animate elements in and out.

**The plain-JS instinct.** Wire each by hand:

```js
input.addEventListener('input', e => { email = e.target.value; });
input.value = email;                                   // and the reverse, manually
el.classList.toggle('active', isActive);               // re-run yourself on every change
document.addEventListener('click', onOutside);         // remember to removeEventListener later
```

**Where it breaks.** Every one of these is a small piece of imperative bookkeeping you write, re-run on change, and tear down yourself. Forget the `removeEventListener` and you leak. Forget to re-run the `classList.toggle` and the class goes stale. Animation means hand-rolling `requestAnimationFrame`. None of it is hard individually; all of it together is noise that buries your actual logic.

**Pain point.** A dropdown that should close when you click outside. In plain JS you attach a document listener on open, must remember to remove it on close and on unmount, and must not double-attach. Easy to get subtly wrong.

**The fix.** Declarative directives that bind and clean up for you:

```svelte
<input bind:value={email} />                  <!-- two-way, no event wiring -->
<div class:active={isActive} style:color={c}> <!-- class/style follow state -->
<div use:clickOutside={() => open = false}>   <!-- reusable DOM behavior, auto-cleaned -->

{#if visible}
  <div transition:fade>fades in and out</div> <!-- motion, one directive -->
{/if}
```

`bind:` is the answer to "stop hand-wiring inputs." `use:` actions package imperative DOM logic (with automatic `destroy` cleanup) so it is reusable and leak-free. Transitions give production motion without an animation library.

**The move.** Bind inputs, drive classes/styles from state, push imperative DOM logic into actions, animate with built-in transitions.

---

## Problem 7 — My app has many pages at different URLs, sharing chrome

*Covers: filesystem routing, dynamic / rest / optional params, layouts, layout groups, route matchers, error pages, navigation and preloading, `$app/state`.*

**The goal.** Multiple pages on real URLs, with shared nav and footer, parameterized routes, graceful errors, and fast navigation.

**The plain-JS instinct.** A router: parse `location.pathname`, match it against patterns, swap the page, update history, and re-attach the shared header to each view.

**Where it breaks.** You now own a router. You maintain a route table by hand, write matching logic, manage history and scroll, duplicate the shared chrome onto every page or invent your own layout system, and handle 404s yourself. This is a large, bug-prone subsystem, and it has been written thousands of times.

**Pain point.** You add a `/blog/[slug]` page and a `/dashboard` page that share a nav bar but need different layouts. With a hand-rolled router you are now writing pattern matching and a layout-nesting mechanism from scratch.

**The fix.** The filesystem *is* the router. Folders are URLs, brackets are params, and special files give you layouts and errors:

```
src/routes/
  +layout.svelte                ← shared chrome wrapping everything
  +page.svelte                  →  /
  blog/[slug]/+page.svelte      →  /blog/anything   (params.slug)
  docs/[...path]/+page.svelte   →  /docs/a/b/c       (rest param, great for 404s)
  (app)/                        ← a layout GROUP: different shell, invisible to the URL
    +layout.svelte
    dashboard/+page.svelte      →  /dashboard
  +error.svelte                 ← rendered when a load throws or a route 404s
```

Make a folder, get a route. `[slug]` / `[...rest]` / `[[optional]]` cover every URL shape. `+layout.svelte` wraps its subtree (rendering the page at `{@render children()}`) and nests automatically; `(group)` folders apply different layouts without changing URLs; matchers (`[id=integer]`) validate params before your code runs. Navigation is a plain `<a href>` (intercepted for client-side transitions) or `goto()`, and links **preload on hover/tap** so pages feel instant. Inside any component, `$app/state` exposes the live `page` (url, params, status) and `navigating`.

**The move.** Express your URL structure as folders and special files; let the framework own routing, layouts, and errors.

---

## Problem 8 — Each page needs data, fetched before it renders, some of it secret

*Covers: universal `load` (`+page.js`), server `load` (`+page.server.js`), the `LoadEvent`, parallel loading, streaming, layout-load inheritance, invalidation.*

**The goal.** A page arrives with its data already present (no spinner-on-mount), where database queries and secret keys never reach the browser.

**The plain-JS instinct.** Fetch inside the component after it mounts:

```js
let posts = [];
onMount(async () => { posts = await (await fetch('/api/posts')).json(); });
```

**Where it breaks.** Three problems. First, the page renders empty, then pops in the data, so the user sees a flash and search engines see nothing. Second, anything secret (a database URL, a private API key) cannot live in code that ships to the browser, so you cannot query the database directly here. Third, you hand-manage loading and error state. The "fetch on mount" pattern is the thing you are trying to escape.

**Pain point.** A dashboard must query the database with a private credential and render server-side for the first paint. Client-side `onMount` fetching can do neither: the credential would leak, and the first paint would be blank.

**The fix.** A `load` function runs *before* the component, and you choose where it runs:

```js
// +page.js  → universal: runs on server (for SSR) then in the browser. Public data only.
export async function load({ fetch }) {
  return { posts: await (await fetch('/api/posts')).json() };
}
```

```js
// +page.server.js  → server-only, always. Safe for databases and secrets.
import { db } from '$lib/server/db';
export async function load({ locals }) {
  if (!locals.user) throw redirect(303, '/login');
  return { projects: await db.project.findMany({ where: { ownerId: locals.user.id } }) };
}
```

```svelte
<script>
  let { data } = $props();   // the load's return value, already populated
</script>
{#each data.posts as p}<a href="/blog/{p.slug}">{p.title}</a>{/each}
```

The decision rule: **touches a database or secret? `+page.server.js`. Only public APIs or pure transforms? `+page.js`.** The `LoadEvent` hands you `params`, `url`, `parent()`, and a special `fetch` (it forwards cookies during SSR and can call your own endpoints without a network round trip). Start independent fetches in **parallel** with `Promise.all` to avoid waterfalls. **Stream** slow data by returning an un-awaited promise and resolving it in the view with `{#await}`. Load shared data once in `+layout.server.js` and every child page inherits it. When a mutation makes data stale, `invalidate()` re-runs the relevant `load`.

**The move.** Fetch in `load`, not on mount; server-load anything secret; parallelize and stream; invalidate to refresh.

---

## Problem 9 — Users need to change data, not just read it

*Covers: form actions, named actions, `use:enhance`, validation with `fail`, `redirect` / `error`.*

**The goal.** Submit a form, run server logic, validate input, show errors, redirect on success, and have it work even before JavaScript loads.

**The plain-JS instinct.** Intercept submit, fetch a JSON API, handle the response:

```js
form.addEventListener('submit', async e => {
  e.preventDefault();
  const res = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) });
  // parse result, show errors, maybe redirect, all by hand
});
```

**Where it breaks.** You write and maintain a separate API endpoint, serialize and parse JSON on both sides, duplicate type definitions, and hand-route errors back into the UI. Worse, if JavaScript fails to load or is still loading, your form is dead, because everything depends on the `fetch`. You have rebuilt form handling from parts.

**Pain point.** A login form that must validate credentials on the server, repopulate the email on failure, show an error, and redirect to the dashboard on success, and ideally still submit if JS has not booted yet.

**The fix.** A page exports server-side `actions`; an ordinary HTML form posts to them. No API route, no JSON, no `fetch`:

```js
// +page.server.js
import { fail, redirect } from '@sveltejs/kit';
export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email');
    if (!email) return fail(400, { email, error: 'Email required' });   // back to the page as `form`
    cookies.set('session', makeToken(), { path: '/' });
    throw redirect(303, '/dashboard');
  }
};
```

```svelte
<script>
  import { enhance } from '$app/forms';
  let { form } = $props();          // fail()/return data lands here
</script>

<form method="POST" use:enhance>    <!-- one word upgrades to smooth client submit -->
  <input name="email" value={form?.email ?? ''} />
  {#if form?.error}<span>{form.error}</span>{/if}
  <button>Log in</button>
</form>
```

This is the elegant part of the design. Without `use:enhance` the form is a real HTML form that works with zero JavaScript. Add `use:enhance` and you get a smooth single-page submission plus automatic re-loading of page data, for one word. Use **named actions** (`action="?/login"`) when a page has several; `fail` for "your input was wrong, try again," `redirect`/`error` for "moving you" or "something broke." Pair with `sveltekit-superforms` + `zod` once forms get real.

**The move.** Mutations are form actions; build the no-JS version first, enhance second.

---

## Problem 10 — I need raw server endpoints and per-request middleware

*Covers: `+server.js` endpoints, `hooks.server.js` (`handle`, `locals`), `handleFetch` / `handleError` / `sequence`.*

**The goal.** Expose a JSON API (for a mobile client or a webhook), and run logic on *every* request (auth, logging, headers) in one place.

**The plain-JS instinct.** Stand up a separate Node/Express server, define routes, and add middleware there, alongside your frontend's own build.

**Where it breaks.** You now run and deploy two things, duplicate types and validation between them, and keep CORS and shared logic in sync across a boundary. Cross-cutting concerns like "attach the current user to the request" have nowhere shared to live in a pile of static files.

**Pain point.** Every page and endpoint needs to know who the user is. Without a request pipeline you re-parse the session cookie at the top of every single `load` and handler, duplicated everywhere.

**The fix.** Endpoints are files, and `hooks.server.js` is your one request pipeline:

```js
// src/routes/api/posts/+server.js  → a real HTTP endpoint
import { json } from '@sveltejs/kit';
export async function GET()          { return json(await db.post.findMany()); }
export async function POST({ request }) { return json(await db.post.create({ data: await request.json() }), { status: 201 }); }
```

```js
// src/hooks.server.js  → runs on EVERY request
export async function handle({ event, resolve }) {
  const token = event.cookies.get('session');
  event.locals.user = token ? await getUser(token) : null;   // resolve once, here
  return resolve(event);
}
```

`+server.js` exports `GET`/`POST`/etc. as standard `Request` in, `Response` out. The crucial mechanism in `handle` is **`event.locals`**: a per-request object you populate once and read in every `load`, action, and endpoint. That is how the user is resolved a single time at the door. Compose multiple hooks with `sequence`; shape crash logging with `handleError`; rewrite outbound fetches with `handleFetch`.

**The move.** Endpoints are files; cross-cutting logic goes in `handle`; share per-request data through `locals`.

---

## Problem 11 — I need memory that survives across pages: the logged-in user

*Covers: `.svelte.ts` shared state (in-memory), cookies and sessions, `hooks` → `locals` → server `load` → `data`, env vars, the `$lib/server` boundary.* **This is your "global variable across pages" question, and it has two distinct answers.**

**The goal.** Know who is logged in, everywhere, including after the user navigates, refreshes, or comes back tomorrow.

**The plain-JS instinct.** A global variable: `window.currentUser = user`, or a module-level `let user`.

**Where it breaks.** Two separate failures, and untangling them is the whole lesson.

First, a plain module-level variable is *not reactive*: components reading it will not update when it changes (Problem 1 and 3 again). Second, and more fundamentally, **JavaScript memory is per page load.** A hard refresh, a new tab, or returning later wipes every variable you held. So a global variable cannot, by itself, be a logged-in user that persists.

**Pain point.** You store the user in a module variable. It works while you click around, then the user hits refresh and they are "logged out," because the variable is gone.

**The fix is two layers, and you need to see them as different.**

**Layer A, in-memory shared state for one session.** A `.svelte.ts` module with a `$state` singleton. Every component imports the same instance and stays reactive:

```ts
// auth.svelte.ts
let user = $state(null);
export const auth = {
  get user() { return user; },
  set(u) { user = u; },
  clear() { user = null; }
};
```

Because SvelteKit navigations are *client-side* (no full reload), this single module instance **survives as you move between pages**. That alone answers "shared global reactive state across components and across page navigations." But it still dies on a hard refresh, because it lives in memory.

**Layer B, persistence across refreshes, which is what "logged in" actually requires.** Memory cannot do this; only the server can. The loop:

```js
// 1. A login action sets an httpOnly session cookie (Problem 9)
cookies.set('session', token, { path: '/', httpOnly: true, secure: true, sameSite: 'lax' });

// 2. hooks.server.js reads that cookie on EVERY request and fills locals (Problem 10)
event.locals.user = token ? await getUser(token) : null;

// 3. +layout.server.js load exposes it to every page
export async function load({ locals }) { return { user: locals.user }; }
```

```svelte
<!-- any page or layout -->
<script>
  let { data } = $props();
</script>
{#if data.user}Hi, {data.user.name}{/if}
```

Now the identity is stored in a cookie the browser sends on every request, validated on the server, and re-attached to `locals` after any refresh or new tab. Plain JS on the client cannot do this safely: it has no server-trusted, cross-request store, and `localStorage` is client-only and unsafe for sessions. The cookie + server-load loop is the only correct answer. (Secrets that power all this go in `$env/static/private`, which the build *refuses* to ship to the browser; `$lib/server/*` is the same hard guarantee for code.)

**The move.** Use a `.svelte.ts` singleton for reactive state shared this session; use a cookie + `hooks` + server `load` for identity that must outlive a refresh. They solve different halves of "global."

---

## Problem 12 — I must choose how each page renders, and deploy anywhere

*Covers: page options (`ssr` / `csr` / `prerender`), adapters.*

**The goal.** Render a marketing page as static HTML, a private dashboard as a client app, and ship the whole thing to whatever host you end up on, without rewriting code.

**The plain-JS instinct.** Pick one strategy globally (an SPA, or a static site, or a Node server) and hard-code your build and deploy around it.

**Where it breaks.** One strategy is wrong for at least some of your pages: an SPA tanks SEO on your landing page; a fully static site cannot do per-request dashboards. And committing your build to one host means a migration is a rewrite of build and deploy plumbing.

**Pain point.** Your blog should be static and instant; your dashboard must render per-user on the server. A single global rendering mode cannot satisfy both.

**The fix.** Rendering is a per-page option, and an adapter retargets the same app to any host:

```js
// in a +page.js / +page.server.js
export const prerender = true;   // build to static HTML (blogs, docs, marketing)
export const ssr = false;        // pure client app (private, interactive, SEO irrelevant)
export const csr = false;        // ship zero JS (purely static content)
```

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-auto';  // or -node, -static, -vercel, -cloudflare
export default { kit: { adapter: adapter() } };
```

You mix rendering modes page by page. You swap `adapter-auto` for `adapter-node` (your own VPS or container), `adapter-static` (CDN), or a platform adapter, and **your application code does not change**, only the build target.

**The move.** Match each page to its rendering mode; let an adapter handle the host.

---

## Problem 13 — I want to delete the API boilerplate entirely

*Covers: remote functions (`query` / `form` / `command` / `prerender`), experimental.*

**The goal.** Call server logic from a component as if it were a local function, with end-to-end types, no hand-written endpoint, no JSON plumbing.

**The plain-JS instinct.** The status quo from Problems 8 to 10: write a `+server.js` endpoint, `fetch` it, parse JSON, and keep client and server types manually in sync.

**Where it breaks.** That boilerplate is real and repetitive: a route to maintain, request bodies to parse and validate by hand, and two type definitions that drift apart. It works, but it is ceremony.

**Pain point.** Adding one new "like a post" mutation means a new endpoint, a new fetch wrapper, manual validation, and duplicated types, for a one-line database update.

**The fix (experimental, behind a flag in recent SvelteKit 2.x).** Write server logic in a `.remote.ts` file and import it straight into a component. The compiler turns it into an endpoint plus a typed fetch wrapper for you:

```ts
// posts.remote.ts
import { query, form } from '$app/server';
import * as db from '$lib/server/db';

export const getPosts = query(async () => db.post.findMany());        // reactive, cached, typed
export const addPost  = form(async (data) => {                        // progressively enhanced
  await db.post.create({ data: { title: data.get('title') } });
  return { success: true };
});
```

```svelte
<script>
  import { getPosts, addPost } from './posts.remote.ts';
  const posts = getPosts();
</script>
{#each await posts as p}<li>{p.title}</li>{/each}
<form {...addPost}><input name="title" /><button>Add</button></form>
```

Four flavors: `query` (typed reactive reads, with `query.batch` for N+1 and `query.live` for realtime), `form` (enhanced mutations spread onto a `<form>`), `command` (mutations outside a form), `prerender` (build-time data). It is the fusion of everything above: colocation, type safety, progressive enhancement, server-only secrets, with the endpoint and type-syncing deleted. Treat it as experimental, but understand it, because this is where the framework is heading.

**The move.** When you tire of writing endpoints, colocate server logic in `.remote.ts` and call it like a function.

---

## The arc, in one breath

You start by making a single value show on screen (1), then act on changes (2), then package that logic (3), then let components talk (4). You render branches and lists from data (5), bind inputs and motion (6). You scale to many URLs (7), feed each page data before it paints (8), let users change that data (9), and add raw endpoints and a request pipeline (10). You give the app a memory that survives refreshes (11), choose how each page renders and ship it (12), and finally delete the API ceremony (13).

Plain `.js` files can do any one of these for a toy. The instant you need *all* of them at once, you are either hand-writing a framework or using one. The 50 features are simply the framework's answers, and now you know the question each one answers.
