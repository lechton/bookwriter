# 03 | How An App Is Built: Boxes Inside Boxes, And How They Talk

*Your visual and reference companion to the audio lecture of the same name. This booklet is heavy on diagrams, tables, and small illustrations rather than verbatim code, because the lecture is the map of a whole app, not a single feature. Read them together: when the voice says "look at the diagram in your booklet," it is here.*

## How To Read This Booklet

- ❒ — a major section. Its number (3.1, 3.2, ...) matches the audio lecture's section number exactly.
- ▶ Block N — a numbered block: a diagram, a table, or a small code illustration.
- `title="..."` on a code block — the file the code lives in.
- ◆ Source — where it comes from. Most blocks here are marked *illustrative* (reconstructed from the lecture's framing, since this is a synthesis lecture); the SvelteKit file layout, the `load` function, and the form action follow the SvelteKit docs.
- 🔑 — the key idea of a block. ➔ — what to notice. ⚠️ — a gotcha or a clarification.

**Sources for this booklet:** `/documentation 2026 June/sveltekit-docs/10-getting-started/30-project-structure.md`, `.../20-core-concepts/10-routing.md`, `.../20-load.md`, `.../30-form-actions.md`, `.../50-state-management.md`, and `/documentation 2026 June/svelte-docs/06-runtime/02-context.md`.

Two pillars to carry out of this lecture: **boxes inside boxes** (how an app is built) and **a database you can see** (what an app is for — move one object, or a list of objects).

---

## ❒ 3.1 The Keystone Hour, And The One Picture To Carry

The whole hour hangs on one image: an app is boxes inside boxes. A component is a box; nesting one inside another is writing a tag inside a tag.

### ▶ Block 1 — The one picture: boxes inside boxes

**◆ Illustrative**

```text
┌─ FrontPage ───────────────────────────────┐
│ ┌─ SectionFeed ─────────────────────────┐ │
│ │ ┌─ ArticleCard ─────────────────────┐ │ │
│ │ │  Headline   AuthorBadge   [👏]    │ │ │
│ │ └───────────────────────────────────┘ │ │
│ │ ┌─ ArticleCard ─────────────────────┐ │ │
│ │ │  Headline   AuthorBadge   [👏]    │ │ │
│ │ └───────────────────────────────────┘ │ │
│ └───────────────────────────────────────┘ │
└───────────────────────────────────────────┘
```

- 🔑 **A box inside a box, in code, is a tag inside a tag.** The whole page is one big box; inside it smaller boxes; inside those, smaller still, down to a single button.

---

## ❒ 3.2 Every Website Is A Database You Can See: One Object, Or A List Of Objects

Under the paint, a website is a database. A JavaScript object is a bundle of labeled values; everything that travels between parts of an app is either **one object** or **a list of objects**.

### ▶ Block 1 — The four views (every screen is one of these)

**◆ Illustrative**

| View | What it shows | On The National Times |
|---|---|---|
| Detail | one object | one article, full page |
| List | a filtered array | the front page; a section; a tag page |
| Edit | create / change one | the newsroom write form |
| Batch / live | many at once, or in place | editor dashboard; inline edit |

- ➔ **Two ideas, doubled.** Present one / present a list; edit one / edit a list. Every screen you ever build is one of these four.
- ⚠️ **One object, four costumes.** The same article is a card (list), a page (detail), a form (edit), a checkbox row (batch).

### ▶ Block 2 — A real front page is several filtered lists

**◆ Illustrative**

| Region on the page | What the API fetched |
|---|---|
| Top: breaking | latest articles, top 5 |
| Technology block | articles in section = Technology |
| Sports block | articles in section = Sports |

- 🔑 **Each region is its own filtered list of objects, its own little API call.** The page is four or five lists, arranged in the screen real estate.

---

## ❒ 3.3 The Real Shape Of An Article: Its Id, Its Slug, Its Tags, And How You Filter The Stream

The atom of the whole course. Get this object into your bones; every later lecture operates on it.

### ★ ▶ Block 1 — The article object (its real shape)

**◆ Illustrative** — the shape, in TypeScript

```ts title="lib/types.ts"
interface Article {
  id: number;          // unique, the database key
  slug: string;        // "ceasefire-talks-collapse" — the public, readable name
  title: string;       // "Ceasefire Talks Collapse As Fighting Resumes"
  section: string;     // "World" — the big bucket
  tags: string[];      // ["war", "ceasefire", "diplomacy"]
  authorId: number;    // 42 — a POINTER into the users table
  publishedAt: string; // a date
  body: string;
}
```

- 🔑 **Eight labels, one parcel, one story.** id, slug, title, section, tags, author, published, body.
- ➔ **`authorId` is a pointer, not the name.** It references row 42 in the users table — the relational link.

### ▶ Block 2 — The packed object the API actually returns

**◆ Illustrative** — the article *woven* with its author from another table

```ts title="one article, as JSON from the server"
{
  id: 1203,
  slug: "ceasefire-talks-collapse",
  title: "Ceasefire Talks Collapse As Fighting Resumes",
  section: "World",
  tags: ["war", "ceasefire", "diplomacy"],
  author: { id: 42, name: "Dana Reyes", articleCount: 42 },
  publishedAt: "2026-06-06T09:00:00Z",
  body: "..."
}
```

- 🔑 **Relational packing.** The server follows `authorId` into the users table and packs the real author in, plus a count of their other articles — fields from several tables, in one parcel.

### ▶ Block 3 — Stored as rows in tables (relational)

**◆ Illustrative**

| Table | One row is | Key columns |
|---|---|---|
| articles | one article | id, slug, title, section, authorId, body |
| users | one person | id, name, role |
| comments | one comment | id, articleId, authorId, body |

- ➔ **One row per object; columns are the labels.** `articles.authorId` points at `users.id`. Tags (many-per-article) live in their own join table.

### ▶ Block 4 — The id versus the slug

**◆ Illustrative**

| Aspect | id | slug |
|---|---|---|
| Looks like | `1203` | `ceasefire-talks-collapse` |
| Unique? | yes | yes |
| Readable? | no | yes |
| Role | private (database) | public (the URL) |

```text
nationaltimes.com/1203                       ← unique, but tells a human nothing
nationaltimes.com/ceasefire-talks-collapse   ← unique AND readable  (good for SEO)
```

- 🔑 **The slug is the title, lowercased, spaces → hyphens, punctuation stripped.** The link itself carries meaning.
- ⚠️ **Why bother:** search engines rank readable URLs (SEO), and humans click links they can read. If two slugs would collide, add a number or date.

### ▶ Block 5 — Tag versus section

**◆ Illustrative**

| Aspect | Section | Tag |
|---|---|---|
| How many | a handful, fixed | thousands, open |
| Per article | one | many |
| Example | World, Sports | war, election |

### ▶ Block 6 — Every label is a filter: where the lists come from

**◆ Illustrative**

| Page | Filter by | The list it gives |
|---|---|---|
| Front page | publishedAt | newest articles, top 5 |
| Tech section | section | articles where section = Technology |
| Tag page | tags | articles carrying "war" |
| Author page | authorId | articles where authorId = 42 |

- 🔑 **Same move every time:** take the stream of article objects, narrow it by one label. The fields are the handles you slice by.

### ▶ Block 7 — The unique id is also the list key

**◆ Illustrative**

```svelte
{#each articles as article (article.id)}
  <ArticleCard {article} />
{/each}
```

- ⚠️ **Why the `(article.id)`:** when a list changes, the framework needs a stable, unique field per item to tell them apart. Every framework asks this; the id answers it. Full story in the lists lecture (9).

---

## ❒ 3.4 The Tree Of Boxes, And The Family That Lives In It

The structure: a tree of components. Learn the tree once, navigate it with family words.

### ★ ▶ Block 1 — The front page tree (List view)

**◆ Illustrative**

```text title="Front page"
FrontPage                      (the big box)
└── SectionFeed                (loops the list with {#each})
    └── ArticleCard            (one article object)
        ├── Headline
        ├── Excerpt
        ├── AuthorBadge
        ├── PublishDate
        ├── TagList
        │   └── Tag
        └── ClapButton
```

### ▶ Block 2 — The article page tree (Detail view, the deep one)

**◆ Illustrative**

```text title="Article page"
ArticlePage
├── ArticleHeader
├── ArticleBody
├── TagList
│   └── Tag
└── CommentSection
    ├── CommentForm
    └── CommentList
        └── Comment
            ├── CommentAuthor
            ├── CommentBody
            └── CommentDate
```

- ➔ **The deep chain `CommentSection → CommentList → Comment → CommentBody` gives a great-great-grandchild.** That depth is why the family vocabulary matters.

### ▶ Block 3 — The family vocabulary

**◆ Illustrative**

| Relationship | Meaning | In the front-page tree |
|---|---|---|
| parent / child | one box directly inside another | FrontPage → SectionFeed |
| sibling | boxes sharing a parent | Headline and ClapButton |
| grandparent | the parent of the parent | FrontPage is grandparent of ArticleCard |
| grandchild | the child of the child | ArticleCard is grandchild of FrontPage |

### ▶ Block 4 — Creating a box: two moves

**◆ Illustrative**

```svelte title="ClapButton.svelte  (move 1: write the file)"
<script lang="ts">
  let { onClap } = $props();
</script>

<button onclick={onClap}>👏</button>
```

```svelte title="ArticleCard.svelte  (move 2: place its tag)"
<ClapButton onClap={clap} />
```

- 🔑 **Make a box = write its `.svelte` file. Use a box = write its tag in a parent.** Create the file, place the tag.

---

## ❒ 3.5 The First Way Boxes Talk: Data Flows Down, Through Props

Data flows DOWN. A parent hands a child a value by writing it on the child's tag.

### ▶ Block 1 — The parent writes the tag with the value

**◆ Illustrative**

```svelte title="SectionFeed.svelte (parent)"
{#each articles as article (article.id)}
  <ArticleCard {article} />
{/each}
```

### ▶ Block 2 — The child file catches it

**◆ Illustrative**

```svelte title="ArticleCard.svelte (child)"
<script lang="ts">
  let { article } = $props();   // catches the value
</script>

<h2>{article.title}</h2>
```

- 🔑 **Parent writes the tag with the value; child catches it.** This is what lets one card show a hundred different articles.
- ⚠️ **Prop drilling:** passing a value down through many levels that don't use it, just to reach a deep grandchild. Painful at depth — cured by context (3.7). Full props lecture: 7.

---

## ❒ 3.6 The Second Way Boxes Talk: Messages Flow Up, Through Events

Messages flow UP. The child never reaches up; it calls a function the parent handed down.

### ▶ Block 1 — Parent hands down a function; child calls it

**◆ Illustrative**

```svelte title="ArticleCard.svelte (parent owns the logic)"
<script lang="ts">
  let claps = $state(0);
</script>

<ClapButton onClap={() => claps++} />
```

```svelte title="ClapButton.svelte (child calls back up)"
<script lang="ts">
  let { onClap } = $props();
</script>

<button onclick={onClap}>👏</button>
```

- 🔑 **Down for data (props), up for messages (events).** The child calls the function it was given; the function runs in the parent. Full lecture: 8.

---

## ❒ 3.7 The Third Way Boxes Talk: Shared Things Flow Sideways, Through Context

Ambient things — the logged-in user, the theme — flow SIDEWAYS, reaching scattered boxes without drilling.

### ★ ▶ Block 1 — The three directions of talking

**◆ Illustrative**

| Direction | Tool | Example |
|---|---|---|
| down (parent → child) | props | FrontPage hands ArticleCard its article |
| up (child → parent) | events / callbacks | ClapButton tells ArticleCard |
| sideways (anywhere) | context / shared module | the logged-in user, everywhere |

### ▶ Block 2 — Context: set high, read deep

**◆ Source:** `06-runtime/02-context.md` (pattern)

```svelte title="+layout.svelte (high up: provides)"
<script lang="ts">
  import { setContext } from 'svelte';
  setContext('user', user);
</script>
```

```svelte title="CommentForm.svelte (deep grandchild: reads)"
<script lang="ts">
  import { getContext } from 'svelte';
  const user = getContext('user');
</script>
```

- 🔑 **The value skips every box in between.** No drilling. Full lecture: 19. The shared-module alternative (`session.svelte.ts`) is in 3.10.

---

## ❒ 3.8 What Keeps The Screen Alive: The Reactivity Toolbox, Previewed

The runes make the screen respond when data changes. The core trio, previewed.

### ▶ Block 1 — The reactivity trio

**◆ Illustrative**

| Rune | What it does | National Times example |
|---|---|---|
| `$state` | a reactive value | the clap count; menu open |
| `$derived` | a value computed from others | "5 min read"; "1.2k claps" |
| `$effect` | an action on change | the live ticker; autosave |

- ⚠️ **Without `$state`:** the count changes in memory but the screen lies. **Without `$derived`:** "5 min read" goes stale. **Without `$effect` cleanup:** the ticker's connection leaks memory.
- ➔ Full lectures: `$state` 4, `$derived` 5, `$effect` 6.

### ▶ Block 2 — Svelte has no hooks: the translation

**◆ Illustrative**

| In React you reach for... | In Svelte it is... |
|---|---|
| `useState` | `$state` |
| `useMemo` | `$derived` |
| `useEffect` | `$effect` |

- ⚠️ Make this swap once and stop hunting for hooks.

---

## ❒ 3.9 Why A Web App Is Not A Script: Reactivity, The Lifecycle, And The Asynchronous World

The biggest mental shift: a script runs once and ends; a web app stays alive, event-driven and asynchronous.

### ★ ▶ Block 1 — A plain script versus a web app

**◆ Illustrative**

| Aspect | A plain script | A web app |
|---|---|---|
| Runs | top to bottom, then ends | loads, then stays alive for hours |
| Driven by | the sequence you wrote | events (click, type, data arriving) |
| Waiting | freezes until each step finishes | fires now, finishes later, never freezes |

### ▶ Block 2 — The component lifecycle (why effects must clean up)

**◆ Illustrative**

| Moment | Tool | What you do |
|---|---|---|
| born (mounted) | `onMount` / `$effect` | open the ticker connection |
| changes | `$effect` re-runs | react to new state |
| dies (removed) | `onDestroy` / effect cleanup | close the connection — or it leaks |

- 🔑 **A reactive side-effect must start at birth and be cleaned up at death.** The `$effect` rune fuses reaction and lifecycle. Full lecture: 20.

---

## ❒ 3.10 Beyond The Boxes: The Code That Is Not A Component, And The Reusable Logic People Call Hooks

A real app is full of non-component code. Here is the whole typology.

### ▶ Block 1 — The typology of files (deploying with TypeScript)

**◆ Illustrative**

| File | What it is | Example |
|---|---|---|
| `.svelte` | a component (a box) | `ArticleCard.svelte` |
| `.svelte.ts` | a module that can use runes | `session.svelte.ts` |
| `.ts` | a plain module, no runes | `api.ts`, `types.ts` |
| `+page.svelte` | one page / route | the front page |
| `+page.server.ts` | server code: `load` + `actions` | fetch / write |

### ▶ Block 2 — Reusable reactive logic (Svelte's answer to custom hooks)

**◆ Illustrative**

```ts title="lib/pagination.svelte.ts"
export function createPagination(pageSize = 10) {
  let page = $state(1);
  return {
    get page() { return page; },
    next() { page++; },
    prev() { if (page > 1) page--; }
  };
}
```

- 🔑 **Reuse stateful logic = a function (or class) in a `.svelte.ts` file that uses runes.** Same instinct as a React custom hook, but with NONE of the rules of hooks — it is just a function.

### ▶ Block 3 — The word "hook" means three different things

**◆ Illustrative**

| "Hook" can mean... | In Svelte that is... |
|---|---|
| React custom hook (reusable logic) | a function in a `.svelte.ts` file |
| React `useState` / `useEffect` | the runes |
| SvelteKit `hooks.server.ts` | server middleware (auth checkpoint) |

### ▶ Block 4 — Wrapping a third-party library: an action

**◆ Illustrative**

```svelte title="in markup"
<div use:chart={data}></div>
```

```ts title="lib/chart.ts (the action)"
export function chart(node: HTMLElement, data) {
  const c = new Chart(node, data);          // set up at birth
  return { destroy: () => c.destroy() };    // clean up at death
}
```

- 🔑 **An action is the per-element lifecycle:** Svelte hands you the element, you set the library up, you return a cleanup. Full lecture: 14.

### ▶ Block 5 — Dynamic situations, and where each lives

**◆ Illustrative**

| Situation | Where the code lives |
|---|---|
| paginate a million articles | api module + load + pagination logic |
| search as you type | reusable debounce + api module |
| live breaking-news ticker | an `$effect` (opens + cleans up) |
| log in, guard the newsroom | Supabase + server hook + load |
| editor autosave | an `$effect` + a validation utility |
| infinite scroll | an action (intersection observer) |

---

## ❒ 3.11 Where Data Enters And Leaves: Reads, Writes, FastAPI, And Supabase

Reads in `load`, writes in form `actions`, on-demand in handlers — all through one api module. FastAPI serves content; Supabase serves identity.

### ★ ▶ Block 1 — Where exactly the API calls go

**◆ Illustrative**

| What | Where it goes | Example |
|---|---|---|
| page read | a `load` function | the front page's articles |
| write | a form `action` | publish an article |
| on-demand | an event handler | load more comments |

- ⚠️ **Not in the context** (that only shares values), and **not in a "hook"** (there are none) — reusable fetch logic is a `.svelte.ts` function.

### ▶ Block 2 — FastAPI endpoints are just "one object" or "a list"

**◆ Illustrative**

| Request | Returns |
|---|---|
| GET `/articles?sort=recent` | a list of objects |
| GET `/articles/{slug}` | one object |
| POST `/articles` | creates one |

### ▶ Block 3 — The api module: one front door to FastAPI

**◆ Illustrative**

```ts title="lib/api.ts"
const BASE = 'https://api.nationaltimes.com';

export async function getLatestArticles(): Promise<Article[]> {
  const res = await fetch(`${BASE}/articles?sort=recent&limit=5`);
  return res.json();          // a list of objects
}

export async function getArticle(slug: string): Promise<Article> {
  const res = await fetch(`${BASE}/articles/${slug}`);
  return res.json();          // one object
}
```

### ▶ Block 4 — Reads: the load function feeds the props

**◆ Source:** `20-core-concepts/20-load.md` (pattern)

```ts title="src/routes/+page.server.ts"
import { getLatestArticles } from '$lib/api';

export async function load() {
  return { articles: await getLatestArticles() };
}
```

```svelte title="src/routes/+page.svelte"
<script lang="ts">
  let { data } = $props();   // data.articles — then poured down through props
</script>
```

### ▶ Block 5 — Writes: a form action

**◆ Source:** `20-core-concepts/30-form-actions.md` (pattern)

```ts title="src/routes/write/+page.server.ts"
import { createArticle } from '$lib/api';

export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    await createArticle(form);
  }
};
```

### ▶ Block 6 — Supabase auth: the server hook (middleware)

**◆ Illustrative**

```ts title="src/hooks.server.ts"
export async function handle({ event, resolve }) {
  const { data } = await event.locals.supabase.auth.getUser();
  event.locals.user = data.user;   // who is logged in, on every request
  return resolve(event);
}
```

- ⚠️ **This is the only thing Svelte-world calls a "hook":** server middleware, the auth checkpoint. It feeds the `session.svelte.ts` that boxes read.

### ▶ Block 7 — The whole project, on disk

**◆ Source:** `10-getting-started/30-project-structure.md` (layout)

```text title="The National Times — src/"
src/
├── lib/
│   ├── components/        ArticleCard.svelte, ClapButton.svelte, CommentList.svelte
│   ├── api.ts             getLatestArticles(), getArticle(slug), createArticle()
│   ├── types.ts           Article, User, Comment
│   ├── supabase.ts        the Supabase client
│   └── session.svelte.ts  the logged-in user (reactive, shared)
├── routes/
│   ├── +layout.svelte     the masthead / shell
│   ├── +page.svelte       "/"               → front page (List)
│   ├── +page.server.ts    load() → latest articles
│   ├── section/[name]/    "/section/technology"  → a section (List)
│   ├── article/[slug]/    "/article/..."   → one Article (Detail)
│   └── write/             "/write"          → the Edit view
├── hooks.server.ts        runs on every request — checks the Supabase session
└── app.html
```

- 🔑 **Routes folders are the addresses.** `article/[slug]` is the detail view made literal; `[slug]` catches the slug from the URL.

---

## ❒ 3.12 The Whole Shape, In One Breath

*(No new block — the lecture gathers everything into one breath. The table below is the whole machine on one page.)*

### ▶ Block 1 — The whole app, on one page

**◆ Illustrative**

| Layer | What it is |
|---|---|
| Data | a database of tables; objects and lists |
| Structure | components, boxes inside boxes |
| Talking | props down, events up, context sideways |
| Aliveness | `$state`, `$derived`, `$effect` + the lifecycle |
| Plumbing | `load` (reads), `actions` (writes), one api module |
| Under it all | the compiler, wiring your descriptions |

---

## ❒ 3.13 The Reading Map: Every Tool, And Where It Lives

The capstone. Every tool previewed today, sent to the lecture that teaches it in full. After this, nothing is a surprise.

### ★ ▶ Block 1 — The reading map

**◆ Illustrative**

| In the example | Full lecture |
|---|---|
| the clap count | 4 — `$state` |
| "5 min read", "1.2k claps" | 5 — `$derived` |
| the live ticker, autosave | 6 — `$effect` |
| FrontPage hands ArticleCard its article | 7 — `$props` |
| the clap, the publish button | 8 — markup & events |
| the section feed loop, the list key | 9 — `{#each}` |
| the comment box, the title field | 13 — `bind:` |
| a chart / editor library | 14 — actions |
| the logged-in user, sideways | 19 — context |
| born / dies, cleanup | 20 — lifecycle |
| the article / user / comment types | 23 — TypeScript |
| load, actions, routing, FastAPI, Supabase | the SvelteKit arc |

---

## ❒ 3.14 Recap, And How To Carry This Lecture

*(No new block — this booklet IS the map. Keep it open. Every later lecture is a deep dive into one box of it.)*

- 🔑 **Two pillars:** boxes inside boxes (how it's built), and a database you can see (what it's for — one object, or a list).
- ➔ When a later lecture feels disorienting, come back to the reading map (3.13) and find where it sits.
