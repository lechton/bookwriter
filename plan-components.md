# plan-components.md — The Unifying Example And The "What Is A Website" Spine

Status: DISCUSSION DRAFT. Nothing in the lecture prompt, the lectures, or the booklets has been changed. This document is the proposal we discuss before any edit. It answers two questions you raised:

1. What examples should run through the whole course so the abstract runes and features land as real, practical, component-managing problems?
2. How do we give the reader a grounded understanding of how a website is actually built, the way Django teaches it, but for Svelte and SvelteKit?

At the end is a list of decisions for you to make.

---

## 1. The core insight, validated and named

Your instinct is exactly right, and it is the strongest organizing idea available to us. Let me state it sharply so we can build on it.

**A website is a stream of objects.** In Python that stream is a list of dictionaries (your "lidict"); in JavaScript it is an array of plain objects. Every content site is, underneath, one of these arrays:

| Site | The object | The stream (array) |
|---|---|---|
| Blog | an article | the articles |
| YouTube | a video | the videos |
| Social feed | a post | the posts (the feed) |
| Notes app | a note | the notes |

Comments are not an exception, they are the same pattern nested one level down: a comment is an object, and the comments under one article are just another stream, filtered to that article and usually sorted by recency.

This is the whole game. If the reader internalizes "a website is an array of objects, and everything else is a way of viewing or editing that array," they have the mental model that every later lecture quietly serves. This is, almost word for word, the clarity Django gives through its models and generic views. We can give the same clarity for SvelteKit, and we should make it the spine of the course. Our concrete running world (Section 3) is a multi-user news platform, which is simply several of these streams at once — articles, videos, and comments — under one roof.

---

## 2. The four views (your taxonomy, sharpened)

You identified three views and then correctly sensed a missing fourth. Here is the complete set. Every screen on every content site is one of these four.

| View | What the user sees | Django generic view | On The National Times (the news platform) |
|---|---|---|---|
| **Detail** | one object | `DetailView` | one article; one video |
| **List** | a filtered array of objects | `ListView` | the front page; a section; an author's articles; a tag's articles |
| **Edit (single)** | create or update one object | `CreateView` / `UpdateView` | write / edit an article in the newsroom |
| **Batch / live edit** | act on many objects at once, or edit in place | (no clean Django parallel) | an editor's dashboard: bulk-publish, bulk-tag; live inline title edit |

The fourth view is the one that only really exists in rich client frameworks, and it is the one you correctly flagged. It splits into two flavors:

- **Batch operations**: select several objects (checkboxes) and delete or edit them together.
- **Live / inline editing**: the object is always editable in place, no separate edit screen, like a notes app whose bullets are permanently writable. This is where `contenteditable` and always-on inputs live.

These four views are the skeleton of the course. The list view is where `{#each}` lives. The detail view is where one object's `$state`, `$derived`, and bindings live. The edit views are where `bind:`, form inputs, and writes-to-the-server live. The batch/live view is where selection state, derived selections, and autosave effects live. Naming the four up front lets every lecture say "this is the tool for this part of this view."

A key honest point for the reader: **the same object appears in all four views.** An article is a card in the list, a full page in the detail view, a form in the edit view, and a checkbox-row in batch mode. One object, four costumes. That realization is what turns a pile of features into one coherent craft.

---

## 3. The running example: The National Times, a multi-user news platform

Brand: **The National Times**, at `nationaltimes.com`. Naming principle: our own original fictional brand, used consistently, never a real or famous-fictional outlet (so no Twitter, and no Daily Planet, which is Superman's paper).

A news organisation is the strongest running world we have, because it is a superset of your whole cast. Under one roof it holds the blog (articles), the video service (a video section), the social texture (comments and reactions), many sections, many authors, and tags. One example, and every domain you named becomes a room inside it.

The data model (the streams of objects, with relationships). This is the multi-user shape you asked for, and it is exactly the relational model Django teaches:

- **User**, and not one kind: a journalist (writes articles), an editor (publishes and edits), a reader (comments, subscribes). One platform, many users, in distinct roles.
- **Section**: a category, like Politics, Sports, Tech, Culture, Opinion. Each section holds many articles.
- **Article**: the central object. It belongs to a section, is written by an author (a User), carries several tags, and gathers many comments.
- **Tag**: a label, many per article, and one tag spans many articles (a many-to-many relationship: "Election 2026" tags dozens of pieces).
- **Comment**: belongs to one article, written by one User; the comments under an article are a nested stream sorted by recency.
- **Video**: a media object in the video section, the same shape as an article (title, author, views, comments).

So the platform is not one stream, it is several related streams: articles, videos, and comments, tied together by users, sections, and tags. That richness is the point. It lets every lecture draw from a real, relational world, and it lets us say "an article HAS an author, HAS many tags, HAS many comments" — objects holding objects.

The component tree (boxes inside boxes). The front page, a List view of recent articles:

```
FrontPage                 (List view: the latest across sections)
└── SectionFeed           (one section's stream, rendered with {#each})
    └── ArticleCard       (one article in card form)
        ├── Headline
        ├── Excerpt
        ├── AuthorBadge       (the author, a User object)
        ├── PublishDate       ("3h ago", "5 min read" — computed/derived)
        ├── TagList           (many tags)
        │   └── Tag
        └── ClapButton        (a reaction count + toggle: local state, server write)
```

And the article page, a Detail view, where the deep nesting lives:

```
ArticlePage               (Detail view: one article)
├── ArticleHeader         (headline, author, date, section)
├── ArticleBody
├── TagList → Tag
└── CommentSection
    ├── CommentForm       (the edit/create surface: a bound textarea)
    └── CommentList       (a nested stream)
        └── Comment       (one object)
            ├── CommentAuthor   (a User)
            ├── CommentBody
            └── CommentDate
```

That `CommentSection → CommentList → Comment → CommentBody` chain gives us a great-grandchild, and `TagList → Tag` gives us siblings — plenty of depth for the family vocabulary (parent, child, sibling, grandparent, grandchild). The newsroom editor is its own tree, `ArticleEditor → (TitleInput, BodyEditor, SectionPicker, TagPicker, PublishButton)`, which is where the Edit view, `bind:`, and form inputs live.

What this one world lets us teach, lecture by lecture:

- **Data flows down as props.** `FrontPage` hands each `ArticleCard` its article. (props.)
- **Messages flow up as callbacks.** `ClapButton` tells `ArticleCard` it was clicked, which tells the feed. (events / callback props.)
- **Shared state flows sideways.** The logged-in user, the current section, the theme — read all over the tree, drilled through no props. (context, or a shared `.svelte.js` module.)
- **Local state**: is this article's share-menu open. (`$state`.)
- **Computed display**: "5 min read" from the body length, "1.2k claps", a "Breaking" badge if the article is fresh. (`$derived`.)
- **Side effects**: a live breaking-news ticker; autosaving a draft in the editor. (`$effect`.)
- **Scale**: a million articles in the archive — pagination, filter by section, by author, by tag, search. (`{#each}` keys, `$derived` filtering, SvelteKit `load`.)

One world, every tool. That is the payoff of choosing the news platform.

---

## 4. What a SvelteKit project is made of (answering "ending with what?")

This is the part the reader most needs demystified, and it is where the course currently has a gap (we have taught the `.svelte` file in isolation, but not the project around it). The file types:

| File | What it is | In our example |
|---|---|---|
| `.svelte` | a component (script, markup, style) | `ArticleCard.svelte`, `ClapButton.svelte` |
| `.svelte.js` / `.svelte.ts` | a plain module that is **allowed to use runes** — reactive shared logic/state | `session.svelte.js` (the logged-in user), `feed.svelte.js` |
| `.js` / `.ts` | an ordinary module, no runes — pure helpers, types, the API client | `api.js`, `format-date.js` |
| `+page.svelte` | the component for one route (a page) | the front-page list, the single-article page |
| `+page.server.js` | server-only code for that page: `load` (read data) and form `actions` (write data) | fetch the front page; publish a new article |
| `+page.js` | universal `load` (runs on server and client) | |
| `+layout.svelte` | shared shell around child pages (nav bar, etc.) | the app frame |
| `+server.js` | a raw HTTP endpoint (if you build your own JSON API) | |

And the folders (from the real SvelteKit project structure):

```
src/
├── lib/                      # importable as $lib
│   ├── components/           #   ArticleCard.svelte, ClapButton.svelte, CommentList.svelte ...
│   ├── api.js                #   getArticles(), getArticle(slug), createArticle(), ... (client-safe)
│   ├── session.svelte.js     #   shared reactive state (the current user)
│   └── server/               #   server-ONLY code (secrets, direct DB/FastAPI calls)
│       └── db.js
├── routes/
│   ├── +layout.svelte        #   the shell
│   ├── +page.svelte          #   "/"  → the front page (List view)
│   ├── +page.server.js       #        → load() returns the latest articles
│   ├── write/
│   │   ├── +page.svelte      #   "/write" → the Edit (create) view
│   │   └── +page.server.js   #           → actions = { default: createArticle }
│   └── article/
│       └── [slug]/
│           ├── +page.svelte  #   "/article/the-headline" → one Article (Detail view)
│           └── +page.server.js #            → load() returns that one article + its comments
└── app.html
```

That `[id]` folder is the whole "view of one object" idea made literal: the URL carries the id, the `load` fetches that one object, the page renders it. This is the SvelteKit answer to Django's URLconf + DetailView, and it is genuinely intuitive once seen.

---

## 5. Where the API call goes (answering the FastAPI question)

You asked exactly the right concrete questions: for a video service, where does the call for all videos go, for the latest videos only, for editing a video, for adding a video? Here is the clean rule, and it maps perfectly onto the four views.

**Reads (the List and Detail views) go in `load`.** A route's `load` function (in `+page.server.js` or `+page.js`) fetches the data the page needs, and the page receives it as a prop. So:

- all videos / latest videos → the `load` of the relevant list route calls `getVideos()` / `getLatestVideos()`.
- one video → the `load` of `video/[id]/+page.server.js` calls `getVideo(id)`.

**Writes (the Edit views) go in form `actions`** (in `+page.server.js`), or in **remote functions** (SvelteKit's newer type-safe server calls). So:

- add a video → `actions = { default: addVideo }` on the upload route.
- edit a video → `actions = { update: editVideo }` on the edit route.

**The actual API client is one shared module**, `$lib/api.js`, holding `getVideos()`, `getLatestVideos()`, `getVideo(id)`, `addVideo()`, `editVideo()`. The `load` functions and actions call into it; the components do not call it directly. Server-only secrets and direct FastAPI/DB access live in `$lib/server/`, which SvelteKit forbids from reaching the browser.

The one-sentence version for the reader: **components receive data through props from a `load`, and send changes back through forms to an `action`; the raw API calls live in one `$lib` module, never scattered across components.** That single sentence prevents the most common beginner mistake (firing fetches from inside random components) and it is the kind of structural clarity Django gives for free.

A scoping flag (decision below): `load`, form `actions`, routing, and remote functions are **SvelteKit** topics, and the current 25-lecture plan is almost entirely **Svelte core**. The architecture lecture can sketch all of this and point forward, but to fully deliver "where the API call goes" we likely need a small SvelteKit arc (routing, load, form actions) added to the course. We should decide how far down the SvelteKit road we go.

---

## 6. The Super Lecture: Components, Communication, And The Whole Map

This replaces and absorbs the earlier short "how a website is built" idea. You want something bigger: one large foundational lecture, roughly double length (about two hours), placed before the state lecture, after which nothing in the course is a surprise. Every later lecture becomes a click into this one. I agree, and I think it is the single most important lecture in the course. It is the master map.

Working title: **"How An App Is Built: Boxes Inside Boxes, And How They Talk."**

Placement: a new lecture after the `.svelte` file lecture (current Lecture 2) and before `$state`. So it becomes **Lecture 3**, and `$state` moves to 4, `$derived` to 5, and so on (a one-step renumber; see decisions).

Length: about two hours, roughly double a normal lecture. It is allowed to be the giant of the course. If it is too long to sit as one comfortable file, we split it at its natural midpoint into Part 1 (the shape of an app) and Part 2 (the communication toolbox); but it is conceived as one arc.

The four jobs it must do:

1. **Plant the boxes-inside-boxes picture.** A website is boxes nested in boxes. A component is a box. In code, a box is a tag inside another tag. The reader should leave able to SEE any app as nested boxes. (How we honor this under the no-code, text-to-speech rule: the lecture PAINTS the nested boxes in words, and the booklet carries the actual drawn diagram — see the new prompt rules in Section 9.)

2. **Establish the running world and the family vocabulary.** The news platform tree (Section 3), named once and reused forever, with parent / child / sibling / grandparent (the parent of the parent) / grandchild (the child of the child) used constantly and repeated every time a component is named. This habit starts here and runs through every later lecture.

3. **Preview the whole communication toolbox.** Each tool: NAMED, explained in one plain sentence, shown in structure at a high level, anchored in the example, and motivated by what specifically breaks without it. No deep teaching — just "here is the bolt, here is what it does, here is the screw it tightens." Every later lecture then deepens exactly one bolt.

4. **Show the file structure and the philosophy.** Where each kind of code lives, and why the whole thing is shaped this way.

The toolbox preview is the heart, and it follows a fixed five-beat shape for every tool: NAME it, EXPLAIN it in one sentence, SHOW the structure at a high level, ANCHOR it in the example, say WHAT BREAKS without it. The texture, using your props example:

> Want to hand a value down to a child component? That is called passing props. Here is the whole idea in one breath. In the parent component's markup you write the child's tag with the value attached, like an ArticleCard tag with author set to the word Alex. Then, in the file named ArticleCard dot svelte, the ArticleCard component is written to receive a value called author, already filled in as Alex. The parent decides the value and writes it on the tag; the child file is built to catch it. That is props. We give it a full hour later. For now just hold the shape: parent writes the tag with the value, child file catches it.

The same five-beat shape covers each tool: a local reactive variable (state), a shared global value (state in a `.svelte.js` module, or context), a computed value (derived, and what goes stale on the feed without it), a side effect (effect, and the memory leak from a subscription you forget to clean up), reaching a deep grandchild without drilling (context), and a child telling a parent something happened (callback props / events).

One terminology fix the lecture clears up early: coming from React you reach for "hooks." Svelte has no hooks. Its equivalents are the runes (for reactivity) and a couple of lifecycle functions. The super lecture maps "the hook you would reach for in React" to "the rune you reach for in Svelte," once, so the reader stops hunting for hooks that are not there.

The cross-reference map in Section 7 is this lecture's capstone: the table that sends every previewed tool to the later lecture that teaches it in full. That table is what makes the rest of the course feel like clicking, not climbing. The full, approval-ready section outline is in **Section 11**.

---

## 7. The cross-reference map (the hub)

This is the table the architecture lecture ends on, and the thing that unifies the course. Each row is a concrete moment in the running example, tied to the lecture that teaches it. (Lecture numbers follow the current 25-lecture TOC; SvelteKit rows marked because they may need new lectures.)

| In the example | The problem | Lecture |
|---|---|---|
| The clap count on an Article | reactive local state | 3 — `$state` |
| "5 min read", "1.2k claps", "Breaking" badge | values computed from state | 4 — `$derived` |
| Autosave a draft; the live breaking-news ticker | side effects on change | 5 — `$effect` |
| `FrontPage` hands data to each `ArticleCard` | inputs to a component | 6 — `$props` / `$bindable` |
| The publish button click; the clap button | events and handlers | 7 — markup & events |
| Render a section's articles; render comments | lists and keys | 8 — `{#each}` / `{#key}` |
| "Loading more articles..." | async in the UI | 9 — `{#await}` |
| A reusable ArticleCard layout passed into a wrapper | composable markup | 10 — snippets |
| The comment textarea; the editor's title input, two-way bound | form inputs, binding | 12 — `bind:` |
| Drag-to-reorder sections; tooltip on the clap button | DOM behavior | 13 — actions / `{@attach}` |
| An article sliding in/out of the list | motion | 14 — transitions |
| Per-ArticleCard scoped styles; a "breaking" class toggle | styling, `class:` | 15 — styling |
| An Article that fails to render | catch errors in place | 16 — `<svelte:boundary>` |
| The logged-in user across the whole tree | shared state / DI | 17, 18 — stores/builtins, context |
| Mount an article-embed widget into a non-Svelte page | imperative API | 19 — lifecycle/mount |
| Fetch the front page / one article / publish a new one | data in and out | **SvelteKit: load, form actions (new arc?)** |
| One article at `/article/[slug]` | routing, detail view | **SvelteKit: routing (new arc?)** |

The map does two jobs at once: it tells the architecture lecture what to point forward to, and it gives every later lecture a back-reference to the shared world.

---

## 8. The smaller topics, placed

- **HTML form inputs** (input, textarea, checkbox, radio, select): these belong to the `bind:` lecture (12), which is exactly about binding to form elements. The architecture lecture should foreshadow them (the edit views need inputs) but not teach them. So: not a separate lecture, a section of the binding lecture, foreshadowed early.
- **`contenteditable` / live inline editing** (the notes-app feel): also the binding lecture, as the advanced edge after the standard inputs.
- **Scale (millions of articles)**: this is where pagination, filtering, and lazy loading appear. It motivates `{#each}` keys (8), `$derived` filtering (4), and SvelteKit `load` with pagination. Use it as a recurring "now make it a million" beat, the same way the existing lectures use "now scale it" to expose a bad idea.
- **Comments**: not a topic of their own, the worked example of "a stream nested inside an object," reinforcing lists (8) and snippets (10).

---

## 9. New rules for the lecture prompt (proposal only)

If we agree, here is what gets added to `skills/write_lecture.md`. The existing rules (lead with the pain, framework comparison, TTS-safety, section numbering, one-hour length) stay unchanged; these layer a concrete world and a few teaching habits on top.

1. **Anchor every concept in the shared running world.** Open each lecture by pointing back at a concrete component from the super lecture, and frame the topic as the problem it solves there, or the bug it creates there. Never teach a feature in the abstract when an Article, a ClapButton, or a Comment can carry it.

2. **The cast of examples, fixed and reused.** The multi-user news platform (Section 3) is the primary world; its articles, its video section, and its comments are facets of one platform, and "now imagine a million articles" is the standing scale beat; the notes app appears only for live, in-place editing. Do not invent a fresh unrelated example per lecture.

3. **Always remind the component family.** Every time a component is named, restate its place in the tree, briefly, in repetition, so the listener's short-term memory holds the shape. For example: "the clap button, which is a child of the ArticleCard, and the ArticleCard sits inside the SectionFeed, so the SectionFeed is the grandparent of the clap button." Use the vocabulary consistently: parent, child, sibling, parent of the parent (grandparent), child of the child (grandchild). This repetition is a feature, not filler — it is how a listener keeps a tree in their head with no picture in front of them.

4. **Name it, then explain it, every time.** Never drop a term and move on. The instant you name a mechanism (props, props drilling, context, a store, an effect), follow it with one plain sentence saying what it actually is and does. Jargon without an immediate plain-words gloss is forbidden.

5. **Motivate with a specific failure in the running world.** When you introduce a feature, say exactly what breaks without it, in the example, concretely: the clap count frozen at the old number after the reader taps (no derived); the live breaking-news ticker that holds a dead connection open and leaks memory (an effect with no cleanup); the logged-in user threaded painfully through five components that did not need it (props instead of context). A named, concrete failure beats an abstract benefit.

6. **Think in boxes; paint the picture in words.** Lean on the boxes-inside-boxes image: a component is a box, a tag inside a tag, a box inside a box. Because the script is read aloud and carries no code, the lecture PAINTS the nested boxes in words ("picture the whole page as one big box; inside it, a stack of smaller boxes, one per article; inside each article box, a row of tiny boxes, the buttons"). The matching BOOKLET carries the actual drawn diagram of the same tree, which a visual engine can render or the reader can sketch. Word-picture in the audio, real picture in the booklet.

And, separately from the prompt: we add the super lecture as the new Lecture 3, renumber `$state` and everything after it by one step, and then lightly re-anchor the existing Lectures 1, state, and derived to the shared world (you specifically want the state lecture edited to use the component examples). None of this is done yet.

---

## 10. Decisions for you (let's discuss)

1. **Build the super lecture now?** This is the main ask. The approval-ready outline is in Section 11. Say go, and I write it as the new Lecture 3 (about two hours), in the established style plus the new rules in Section 9.
2. **Primary example — DECIDED.** The running world is **The National Times** (`nationaltimes.com`), a multi-user news platform, defined in Section 3. It subsumes the blog (articles), the video service (a video section), and the social texture (comments, reactions) under one roof, and it carries the full create / edit / delete the feed lacked. The notes app stays as a spot example for live, in-place editing only. Naming principle, locked: our own original fictional brand, used consistently, never a real or famous-fictional outlet (no Twitter, no Daily Planet).
3. **How much SvelteKit?** The "where does the API call go" promise needs SvelteKit (routing, `load`, form actions). In the super lecture I cover it at the map level and point forward. Do we then (a) add a small SvelteKit arc later, or (b) keep the course Svelte-core and leave SvelteKit data-flow as background?
4. **Length and shape.** One ~2h file, or split at the midpoint into Part 1 (the shape of an app) and Part 2 (the communication toolbox)? I lean toward writing it as one arc and splitting only if it gets unwieldy.
5. **Renumber now.** Inserting the super lecture as Lecture 3 shifts `$state` to 4, `$derived` to 5, and their booklets and `N.M` section numbers with them. I can do that mechanically (the same verified pass we used for section numbers). Approve the renumber, or hold it?
6. **Re-anchor the existing lectures.** After the super lecture exists, do we weave the running world back into Lectures 1, state, and derived now (you want the state lecture edited to use the component examples), or only apply it going forward?
7. **The four-view names.** Keep Detail / List / Edit / Batch-and-Live as the official vocabulary, or rename?

Say go on Section 11 and settle 2 through 5, and I build the super lecture.

---

## 11. Super Lecture — approval-ready outline

Working title: **"How An App Is Built: Boxes Inside Boxes, And How They Talk."** New Lecture 3. About two hours. These sections become `## 3.1`, `## 3.2`, ... once built.

1. **Orientation, and the one picture: boxes inside boxes.** Where we are; today is the master map; after it, nothing is a surprise. Plant the image — a website is boxes nested in boxes, a component is a box, in code a tag inside a tag. Painted in words; the booklet shows the drawing.
2. **What a website actually is: a stream of objects.** The array of objects (posts, articles, videos). The four views: detail (one), list (a filtered array), edit (one), batch / live (many at once, or in place). The Django parallel, on the feed, the blog, the video site.
3. **The component tree, and the family vocabulary.** The news platform tree named in full: FrontPage, SectionFeed, ArticleCard, Headline, AuthorBadge, PublishDate, TagList and Tag, ClapButton, then the article page with CommentSection, CommentList, Comment. Parent, child, sibling, grandparent, grandchild introduced and drilled. The reminder habit begins here.
4. **Talking, part one — data flows DOWN (props and props drilling).** Name, explain, structure, anchor, what-breaks. The parent writes the child's tag with a value; the child file catches it. Drilling a value through grandparents to a deep grandchild, and why that hurts.
5. **Talking, part two — messages flow UP (events and callbacks).** A child telling a parent it happened: the ClapButton tells the ArticleCard, the ArticleCard tells the feed. Callback props, in one breath.
6. **Talking, part three — shared state flows SIDEWAYS.** A global / shared value in a `.svelte.js` module (the logged-in user), and context for reaching a deep grandchild without drilling. When to lift state, when to share it.
7. **The reactivity toolbox, previewed.** State (a reactive variable — the menu-open flag), derived (a computed value — the like-count text and "2h ago", and what goes stale without it), effect (do something on change — the live feed subscription and its memory leak). The hooks-to-runes clarification lives here.
8. **The files of a real app (within SvelteKit).** `.svelte`, `.svelte.js` / `.ts`, `.js` / `.ts`, and the `+` route files; the `$lib` and `routes` folders; where components, shared state, the API client, and pages each live. The boxes-inside-boxes of files, not only components.
9. **Where data enters and leaves.** Reads through `load`, writes through form `actions`, the one `$lib/api.js`. The four views mapped to four data shapes (all videos, latest videos, one video, add / edit a video). High level, pointing forward.
10. **The philosophy, in one breath.** The compiler wires it; components are boxes; data down, events up, shared sideways; four views; you describe what a thing is, not how to keep it in sync.
11. **The reading map.** The capstone table from Section 7 — every tool just previewed, sent to the lecture that teaches it in full. "Now nothing in this course is a surprise."
12. **Recap, and how to use this lecture.** It is the map; keep it open; every later lecture is a click into one box of it.

On your go: I write this in the established lecture style (TTS-safe, numbered `## 3.x`, plus the new family-reminder and name-then-explain rules), then build its booklet twin with the box diagrams, then renumber state and derived.
