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