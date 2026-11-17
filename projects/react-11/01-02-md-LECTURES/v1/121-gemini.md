# Lecture 121: How a Page Puts Its Own Title, Meta Tags, and Links into the Head

*(How does one blog post put its own title and description into the head of the page?)*

> INTERVIEW QUESTION | ❱ CORE | How do you set titles, meta tags, and links with React components?

---

## VS | `<title>` in `App` vs. `<title>` in `PostPage`: both land in the head, only `PostPage` knows the post

> The browser tab, search engine results, and social share previews all extract the page title and description from the document `<head>`. **In React 19, any component can render title, meta, and link tags next to its other JSX, and React automatically hoists them into the `<head>`**. The component that owns the page data defines its own metadata, and React includes those tags in the initial HTML sent by the server.

In traditional static websites, each page lives in a separate HTML file with its own `<head>` element. In a standard React application, a top-level root component renders the entire document shell for every route on the site. Because that root component serves every page, hardcoding a title there forces every route to share the same generic text. In React 19, you no longer have to define the title inside the document shell. The active page component renders `<title>` alongside its visible markup, and React hoists that tag into the head automatically.

Consider a blog post titled New Park Opens. A reader shares the URL in a messaging application. The chat client inspects the link and attempts to display a preview card with a title and summary. If the site hardcodes its title in the root shell, every preview card displays My Blog without a description. The browser tab also displays My Blog, making every article on the site appear identical before opening.

The article title exists only inside the post data, and only the post page component receives that data. How does that title reach the document head when the root component renders the outer HTML shell? In React 19, the post page component renders `<title>` directly, and React places that tag into the document head.

::: row caption="The preview of the shared link in a chat app: with the title written in App, and with the title written in PostPage."
::: col title="The title written in App" tag="the same for every post" tone=bad
```page size=mini
url: example.com/posts/new-park
card: title=My Blog | author=example.com | missing=No description | tone=bad
```
:::
::: col title="The title written in PostPage" tag="its own title" tone=good
```page size=mini
url: example.com/posts/new-park
card: title=New Park Opens | author=example.com | text=The park opens at noon. | tone=good
```
:::
:::

**Why:** A messaging client does not launch a full browser engine to inspect a shared link. It fetches the raw HTML from the server, reads the head, and executes zero client JavaScript. MDN confirms that while search engines frequently execute JavaScript, social media crawlers usually cannot. Therefore, updating the title after client scripts execute comes too late for preview scrapers. The title must reside in the initial HTML sent by the server, and React 19 places it there during server rendering.

### The Same Title, in Plain HTML and in React 19

In traditional HTML, each page file declares its title directly inside its own `<head>` element:

```html title="Plain HTML: each page file writes its own title in its head"
<head>
  <title>New Park Opens</title>
</head>
```

In React 19, the page component renders metadata tags alongside visible content, using its own props:

```jsx title="PostPage renders the title and the description of its own post"
function PostPage({ post }) {
  return (
    <article>
      ~<title>{post.title}</title>~ {/* React places it in the head */}
      ~<meta name="description" content={post.summary} />~ {/* React places it in the head too */}
      <h1>{post.title}</h1> {/* Stays inside the article, on the page */}
    </article>
  );
}
```

Notice the two tags that consume the post title. Both elements sit inside the article container. The heading remains on the page canvas inside the article. The `<title>` does not: React extracts it and hoists it into the document head, regardless of component depth (Lesson 83). React performs this hoisting in the browser and during server rendering. As a result, the title already exists inside the HTML that the server streams to clients.

> [!DEFINITION]
> **Hoisting.** [REVIEW] When React encounters a `<title>`, `<meta>`, or `<link>` element during component rendering, it extracts that element and injects it into the document `<head>`. Official React documentation terms this process hoisting. React leaves a `<title>` or `<meta>` in place only when it sits inside an `<svg>` element or carries an `itemProp` attribute for structured microdata (Lesson 83).

A title defined in the root document shell and a title defined in the page component both target the document head. The crucial distinction lies in data access. The root shell renders the outer frame of every route, so it only knows site-level defaults. In contrast, the post page component receives the individual post record, allowing it to provide the exact title and summary for that specific article.

```tree caption="A title written in App and a title written in PostPage both end up in the head; only PostPage knows which post is on the page."
Two places to write the title of a page
- !In `App`, inside its `<head>` [`<title>My Blog</title>`] | `App` does **not know which post** is on the page | Every post gets **the same title**
- +In `PostPage`, next to its heading [`<title>{post.title}</title>`] | `PostPage` **knows the post** it shows | React places it **in the head**, and each post gets **its own title**
```

### What People See Before They Open a Post

Messaging previews, search engine snippets, and browser tabs all read metadata directly from the document head. MDN explains that search engines use the description tag on result pages, while social platforms use metadata to display preview cards with an image and summary. When every post outputs the identical fallback title in the head, every shared card and search snippet looks identical. Readers cannot distinguish one article from another without clicking the link.

### Metadata, and Three Ways to Set It

> [!DEFINITION]
> **Metadata.** [NEW] Metadata represents information about a document rather than visible content rendered inside the body. The tab title, search engine snippet, social share card, and canonical address are all metadata. They live inside the `<head>` element as title, meta, and link tags, where automated crawlers and browser frames inspect them without painting them on the page canvas (Lesson 121).

Developers set page metadata using one of three general approaches:

```tree caption="The three ways to set the metadata of a page, and when each one fits."
Three ways to set a page's title, meta tags, and links
- +Render `<title>`, `<meta>`, and `<link>` in the page component | New in **React 19** | Works in the browser, with **server rendering**, and with **Server Components** | **This lesson**
- !Set `document.title` in an Effect | The way **before React 19** | Changes **only the tab**, and only **in the browser**
- +A metadata library, such as `react-helmet` | Or the metadata feature of a framework | Fits when every route must **replace a site-wide default**
```

The React 19 release announcement notes that native tag hoisting works consistently across client-rendered applications, streaming server rendering, and Server Components. A dedicated metadata library or framework routing system remains helpful when an application requires hierarchical fallbacks, where pages inherit site-level defaults unless overridden.

### The Rule of Thumb: the component that knows the data writes the title

**The component that receives the data renders the title, meta, and link tags. React hoists them into the document head, including in the initial HTML streamed by the server.**

A senior developer also watches for three widespread production mistakes:
1. **Setting the title in an Effect.** Assigning the document title inside an Effect updates the local browser tab. However, the initial HTML streamed by the server retains the generic fallback title, causing external scrapers to display broken previews.
2. **Rendering duplicate titles.** Adding a title in the page component without removing the fallback title from the root shell leaves two title tags in the head. Browsers and crawlers follow no standard rule when choosing between them.
3. **Splitting title children.** Placing dynamic variables and static text side by side inside `<title>` produces multiple JSX children. Because React requires `<title>` to receive a single text string, passing multiple children causes the title to evaluate to empty (Lesson 83).

The remainder of this lesson demonstrates each scenario on a concrete server-rendered blog post.

## SECTION | The New Park Opens Blog Post

We examine an individual blog post titled New Park Opens, rendered on the server with streaming HTML. The server configuration and client hydration setup build directly upon our earlier streaming architecture (Lesson 118). When a user navigates to the article, the page presents a primary heading and a brief summary line:

```page caption="What the reader sees when the post opens: the heading and one line."
url: example.com/posts/new-park
heading: New Park Opens
line: The park opens at noon.
```

The page is built from five files:

```files title="blog: File Explorer" caption="The five files of the blog post and the job of each one."
server.js | Node.js server | Streams `App` with `renderToPipeableStream`, as in Lesson 118
src/
  post.js | data | Exports `post` with its title and its summary
  PostPage.jsx | page | Renders the post: the heading and the summary line
  App.jsx | document | Renders `<html>`, the `<head>`, and `<PostPage />` inside `<body>`
  main.jsx | browser | Calls `hydrateRoot` on the whole document
```

The data module exports a single post object containing the article title and summary:

```jsx title="src/post.js"
export const post = {
  ~title: 'New Park Opens'~, // Shown in the heading, and needed in the head
  summary: 'The park opens at noon.',
};
```

Initially, the root document component renders the complete HTML skeleton with a static title for the entire blog:

```jsx title="src/App.jsx"
import PostPage from './PostPage.jsx';

export default function App({ post }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        ~<title>My Blog</title>~ {/* The same title for every post */}
      </head>
      <body>
        <PostPage post={post} />
      </body>
    </html>
  );
}
```

The post page component renders only the visible article heading and description body:

```jsx title="src/PostPage.jsx"
export default function PostPage({ post }) {
  return (
    <article>
      ~<h1>{post.title}</h1>~ {/* New Park Opens, on the page only */}
      <p>{post.summary}</p>
    </article>
  );
}
```

The text required for the document head already appears on screen inside the article heading. The core challenge of this lesson is delivering that exact post title into the document head without breaking server rendering or client hydration.

**PRINCIPLES:** The component that owns the data renders the metadata, and React hoists those elements into the document head. Three core principles govern this workflow:
1. **Hoisting metadata in the page component: React places title, meta, and link elements directly into the server HTML.** The page component renders these tags next to its heading using its own data props.
2. **Avoiding document title mutations in Effects: client Effects run after initial delivery, leaving the server HTML with the fallback title.** Effects execute exclusively inside the browser, missing social crawlers and search indexers.
3. **Preventing duplicate titles: React hoists every rendered title into the head, so only one component should declare it.** Web standards specify no fallback precedence when multiple title elements coexist.

---

## PRINCIPLE | `<title>` and `<meta>` in `PostPage`: React places them in the head of the HTML the server sends

> [!PRINCIPLE]
> **Principle 1: Hoisting: `PostPage` Puts Its Own `<title>` and `<meta>` into the Head**
>
> *Render `<title>`, `<meta>`, and `<link>` in the component that knows the data; React places them in the document head, in the browser and in the HTML the server sends.*
>
> `App` writes the head, but only `PostPage` knows the post. So `PostPage` renders the title, the description, the Open Graph tags, and the canonical link next to its heading, from its own `post`. React writes them into the head of the HTML the server sends, which is the HTML that chat apps and search engines read. React leaves a `<title>` or a `<meta>` where it is written only when it sits inside an `<svg>` or has an `itemProp` prop.
>
> **DO THIS:**
> ```jsx
> function PostPage({ post }) {
>   return (
>     <article>
>       ~<title>{post.title}</title>~ {/* React places it in the head */}
>       <h1>{post.title}</h1>
>     </article>
>   );
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function App() {
>   return (
>     <head>
>       ~<title>My Blog</title>~ {/* **WRONG:** every post gets the same title in the head */}
>     </head>
>   );
> }
> ```

We place the `<title>` and description meta tags inside the post page component, right above the heading. When reloading the page in a browser, the visual canvas remains unchanged, displaying only the heading and summary paragraph. Where did those two metadata tags go?

### What the Server Sends

To inspect the result, view the page source delivered by the network. The page source reveals the exact raw HTML transmitted by the server before any client scripts run (Lesson 102). This raw document is the exact payload inspected by external link scrapers. Although React outputs the markup in a dense stream, the formatted snippet below highlights the structural output:

```html title="The page source of the post, one tag per line" good="7,8"
<!DOCTYPE html>
<html>
<head>
<meta charSet="utf-8"/>
<link rel="preload" as="script" fetchPriority="low" href="/main.js"/>
<title>My Blog</title>
<title>New Park Opens</title>
<meta name="description" content="The park opens at noon."/>
</head>
<body>
<article><h1>New Park Opens</h1><p>The park opens at noon.</p></article>
<script src="/main.js" id="_R_" async=""></script>
</body>
</html>
```

**The title and meta description rendered by the page component now reside inside the document head. The rendered article element contains only the heading and paragraph.** The root document component declared nothing for them in its head. The server completed this placement through five sequential steps:
1. The server entry script invokes the root component with the post data prop.
2. The root component renders the document head followed by the body containing the post page.
3. The post page returns the title and description tags inside its article container.
4. React detects metadata elements located outside svg containers and lacking an itemProp attribute.
5. React hoists those tags into the document head before serializing the HTML stream.

The React 19 documentation states that React automatically hoists metadata elements to the document head. The crucial architectural takeaway is that the server renderer performs this hoisting immediately, long before client JavaScript initializes in the browser.

The original fallback title defined in the root document remains in the head, directly preceding the post title. Principle 3 explains the risks of dual titles and demonstrates how to eliminate the collision.

```tree dir=right caption="How the title written inside PostPage reaches the head of the HTML the server sends."
How `<title>{post.title}</title>` reaches the page source
- +1. Our code [`<title>` inside `<article>`] | `PostPage` returns the title **next to the heading**
- +2. React on the server [`<head>`] | React sees a **metadata tag** | Writes it **into the head** of the HTML
- +3. The page source | The article holds **only the heading and the line** | The head holds **`New Park Opens`**
```

### The Description, the Open Graph Tags, and the Canonical Link

A rich preview card requires more than a bare document title. Messaging and social platforms look for standard metadata tags that describe the resource. The page component renders each tag alongside its title:
1. **The description meta tag.** Standard description tags provide a concise summary of the page content. The name attribute identifies the metadata category, while the content attribute supplies the text. Search engines frequently display this summary beneath the clickable title in search results.
2. **Open Graph meta tags.** Social platforms rely on the Open Graph protocol to generate card previews. These tags use the property attribute rather than name, declaring fields such as the preview title and preview description to format shared links.
3. **The canonical link tag.** A canonical link element declares the authoritative URL for a web page. When content is accessible via multiple query strings or duplicate paths, search engines use this canonical address to consolidate search indexing.

The canonical link needs the address of the post, so the post object gains a `url`:

```jsx title="src/post.js"
export const post = {
  title: 'New Park Opens',
  summary: 'The park opens at noon.',
  ~url: 'https://example.com/posts/new-park'~, // The main address of the post
};
```

`PostPage` renders all five tags at the top of its `<article>`:

```jsx title="src/PostPage.jsx" good="4,5,6,7,8"
export default function PostPage({ post }) {
  return (
    <article>
      <title>{post.title}</title>
      <meta name="description" content={post.summary} />
      ~<meta property="og:title" content={post.title} />~ {/* Read by the chat app for the preview */}
      <meta property="og:description" content={post.summary} />
      ~<link rel="canonical" href={post.url} />~ {/* The main address of the post */}
      <h1>{post.title}</h1>
      <p>{post.summary}</p>
    </article>
  );
}
```

In the browser, the visual canvas remains focused on the post heading and summary. Behind the scenes, all five metadata tags appear inside the document head in the raw server HTML, preserving the declaration order defined in the component.

```tree caption="The three kinds of metadata PostPage renders, and who reads each one."
What `PostPage` renders into the head
- +`<title>` and the description [`<title>` `<meta name="description">`] | The **tab** and the **search result** read them | Hold **`New Park Opens`** and **`The park opens at noon.`**
- +The Open Graph tags [`<meta property="og:title">` `<meta property="og:description">`] | **Chat apps** and **social networks** read them | Build the **preview of a shared link**
- +The canonical link [`<link rel="canonical">`] | **Search engines** read it | Names **the main address** of the post
```

### Why a Canonical Link Does Not Wait Like a Stylesheet

You already encountered link elements hoisted to the head when loading stylesheets with a precedence attribute (Lesson 83). While stylesheet links and canonical links share the same HTML tag name, their runtime behavior differs fundamentally. A stylesheet link instructs React to suspend rendering while external CSS loads, deduplicating identical stylesheets across components. A canonical link references a URL without fetching external resources. React simply hoists it into the document head as static metadata without pausing rendering.

Remember: the component that holds the data declares the metadata, and React hoists those tags into the head.

---

## PRINCIPLE | `document.title` in an Effect: only the tab changes, and the HTML the server sends keeps `My Blog`

> [!PRINCIPLE]
> **Principle 2: Server HTML: `document.title` in an Effect Never Reaches the Page Source**
>
> *Render `<title>` in the JSX instead of setting `document.title` in an Effect, so the title is in the HTML the server sends.*
>
> Effects run only in the browser, after the page has arrived. The developer's tab shows the right title, but the HTML the server sends still holds the old one, and a chat app builds its preview from that HTML. The Effect also writes no description and no Open Graph tag. A `<title>` rendered in the JSX is in the head of the server HTML from the start.
>
> **DO THIS:**
> ```jsx
> function PostPage({ post }) {
>   return <article>~<title>{post.title}</title>~<h1>{post.title}</h1></article>; // In the head of the server HTML
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function PostPage({ post }) {
>   useEffect(() => {
>     ~document.title = post.title;~ // **WRONG:** the server HTML keeps the old title
>   }, [post.title]);
>   return <article><h1>{post.title}</h1></article>;
> }
> ```

In traditional browser JavaScript, developers update the document title by modifying a DOM property directly. Before React 19 hoisted tags automatically, applications commonly performed this assignment inside a client Effect. The React 19 documentation notes that developers previously had to insert metadata manually using client-side effects. Compare the legacy Effect technique with modern JSX rendering:

```jsx title="With document.title in an Effect"
useEffect(() => {
  ~document.title = post.title;~ // Runs in the browser, after the page has arrived
}, [post.title]);
```

```jsx title="With <title> in the returned JSX"
<title>~{post.title}~</title> {/* Rendered on the server too, into the head */}
```

Once hydration finishes in a desktop browser, both approaches display the article title in the browser tab. However, their underlying execution timing differs dramatically. React documentation emphasizes that Effects execute exclusively on the client and never run during server rendering. An Effect changes the tab title only after the browser downloads, parses, and executes client JavaScript. A rendered `<title>` element appears in the server HTML stream immediately.

### The Tab Says New Park Opens, and the Page Source Says My Blog

**Beware: using an Effect updates only the active browser tab, while the server HTML retains the generic fallback title. External link scrapers read only that initial server HTML.**

Here is `PostPage` with the Effect in place of the metadata tags:

```jsx title="src/PostPage.jsx" bad="5"
import { useEffect } from 'react';

export default function PostPage({ post }) {
  useEffect(() => {
    ~document.title = post.title;~ // **WRONG:** runs only in the browser, never on the server
  }, [post.title]);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.summary}</p>
    </article>
  );
}
```

Here is the precise sequence of events when using an Effect:
1. The developer navigates to the article URL. The browser tab displays the article title, giving the false impression that metadata works.
2. Inspecting the raw page source reveals that the document head still contains only the fallback title from the root component.
3. The root cause is execution timing: the server renderer ignores Effects while streaming markup.
4. The client browser receives the HTML, downloads the JavaScript bundle, and completes hydration.
5. React runs the Effect only after hydration finishes, updating the local DOM property.
6. When an external messaging app inspects the shared link, it fetches the initial server HTML and executes no scripts, displaying the generic fallback title.

```html title="The page source with the Effect: only the title of App" bad="6"
<!DOCTYPE html>
<html>
<head>
<meta charSet="utf-8"/>
<link rel="preload" as="script" fetchPriority="low" href="/main.js"/>
<title>My Blog</title>
</head>
<body>
<article><h1>New Park Opens</h1><p>The park opens at noon.</p></article>
<script src="/main.js" id="_R_" async=""></script>
</body>
</html>
```

Mutating the document title inside an Effect updates only window text. It produces no meta tags or Open Graph properties, leaving external preview cards empty.

The browser file is the one of Lesson 118, and the Effect can run only after it:

```jsx title="src/main.jsx"
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import { post } from './post.js';

~hydrateRoot(document, <App post={post} />)~; // React attaches in the browser; only now do Effects run
```

```tree dir=right caption="With an Effect, the title changes only in the browser, after the HTML that the chat app reads has already been sent."
When the title of the post is set, with an Effect
- !1. On the server [`server.js`] | React renders `App` and **skips the Effect** | The HTML holds **`My Blog`**
- !2. A chat app reads the link | It reads **only that HTML** | The preview says **`My Blog`**, with no description
- +3. In the browser [`hydrateRoot`] | React attaches, then **the Effect runs** | Only the **tab of this browser** reads **`New Park Opens`**
```

### Why the Line Cannot Move into the Component Body

Attempting to set the document title directly inside the component body introduces two severe bugs:
1. **It violates component purity.** Modifying global DOM properties during rendering causes side effects, breaking React's requirement that component functions remain pure (Lesson 14). Official lint rules explicitly flag modifying global browser properties during render as invalid.
2. **It crashes server rendering.** The global document object exists only in client browser environments. Evaluating document properties inside a server rendering environment throws an immediate ReferenceError.

Updating the document title inside an Effect remains acceptable in single-page applications without server rendering where social preview cards are unnecessary. For applications rendered on the server, declaring `<title>` in JSX is the proper approach because it populates the initial HTML stream.

Remember: Effects run only after client hydration, while web crawlers read the initial HTML stream from the server.

---

## PRINCIPLE | Two `<title>` tags: React places both in the head, so only one component renders the title

> [!PRINCIPLE]
> **Principle 3: One Title: Two `<title>` Tags Both Land in the Head**
>
> *Render the `<title>` from one component only; React places every rendered `<title>` in the head and picks none.*
>
> When `App` keeps a title for the whole site and the page component adds its own, React places both in the head, and no rule says which one browsers and search engines use. Remove the title from `App` and let the page component render the full title as one string. When many routes need a site-wide fallback, a metadata library or the framework can replace the generic title with the specific one.
>
> **DO THIS:**
> ```jsx
> function App({ post }) {
>   return <html>~<head><meta charSet="utf-8" /></head>~<body><PostPage post={post} /></body></html>; // PostPage owns the only title
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function App({ post }) {
>   return <html><head>~<title>My Blog</title>~</head><body><PostPage post={post} /></body></html>; // **WRONG:** a second title next to the post's
> }
> ```

Our application now emits two title tags simultaneously, with one originating from each component:

```jsx title="One title written by App, one by PostPage"
<head>
  ~<title>My Blog</title>~ {/* Written by App, for every page */}
</head>

<title>~{post.title}~</title> {/* Written by PostPage, for this post */}
```

**React does not choose between competing titles. It hoists every declared title element into the document head.** Developers frequently assume that child components override parent titles the way cascading CSS rules override earlier styles. React implements no override or deduplication logic for title tags.

### How the Head Ends Up with Two Titles

Here is how duplicate titles occur during document generation:
1. The root component defines a fallback title in its document head.
2. The page component declares a dedicated title for the active article.
3. React evaluates the root component and emits the fallback title tag.
4. React evaluates the page component, detects the article title, and hoists it into the head alongside the first tag.
5. The resulting HTML document contains two competing title tags, and the server emits no warning.

```html title="The start of the page source, with two titles" bad="6,7"
<!DOCTYPE html>
<html>
<head>
<meta charSet="utf-8"/>
<link rel="preload" as="script" fetchPriority="low" href="/main.js"/>
<title>My Blog</title>
<title>New Park Opens</title>
<meta name="description" content="The park opens at noon."/>
<meta property="og:title" content="New Park Opens"/>
<meta property="og:description" content="The park opens at noon."/>
<link rel="canonical" href="https://example.com/posts/new-park"/>
</head>
```

When duplicate titles reach the client, browser behavior becomes unpredictable. Official React documentation warns that when multiple components render title tags concurrently, React places all of them in the document head. This creates undefined behavior across browsers and search engines. In this context, undefined means that web clients follow no consistent priority rule. A browser tab might display the first tag, while a search engine or chat crawler selects the second.

React documentation enforces a clear constraint: render only one `<title>` element at any given time (Lesson 83). Leaving a fallback title in the root shell while child pages render their own violates this rule across every route.

### Two Ways to Keep One Title

Teams maintain a single title per page using one of two standard strategies:
1. **Remove the fallback title from the root document.** Each individual page component assumes responsibility for rendering its own title tag. This pattern works cleanly when every route maps to a dedicated page component.
2. **Adopt a metadata library or framework routing convention.** As noted in the React 19 announcement, dedicated metadata utilities can manage route hierarchies, allowing nested routes to override generic root defaults automatically.

Our blog takes the first way. `App` keeps only the character set in its head:

```jsx title="src/App.jsx" startLine="3"
export default function App({ post }) {
  return (
    <html>
      ~<head>~ {/* No title here: PostPage renders the only one */}
        <meta charSet="utf-8" />
      </head>
      <body>
        <PostPage post={post} />
      </body>
    </html>
  );
}
```

### The Full Title as One String

The name of the blog still belongs in the tab, after the title of the post. The first idea is to write both side by side:

```jsx title="Two pieces inside one title" bad="1"
<title>~{post.title} | My Blog~</title> {/* **WRONG:** two children, so the title comes out empty */}
```

JSX interprets this syntax as two separate child nodes: the dynamic variable followed by a static string. React requires the child of a hoisted title element to be a single string (Lesson 83). When passed multiple children, React cannot process the title, leaving the element blank. Using a JavaScript template literal combines the values into a single string primitive before React evaluates the tag:

```jsx title="src/PostPage.jsx" startLine="4"
      <title>~{`${post.title} | My Blog`}~</title> {/* One string: New Park Opens | My Blog */}
```

Now the head of the page source holds one title, the one of the post:

```html title="The start of the page source, with one title" good="6"
<!DOCTYPE html>
<html>
<head>
<meta charSet="utf-8"/>
<link rel="preload" as="script" fetchPriority="low" href="/main.js"/>
<title>New Park Opens | My Blog</title>
<meta name="description" content="The park opens at noon."/>
<meta property="og:title" content="New Park Opens"/>
<meta property="og:description" content="The park opens at noon."/>
<link rel="canonical" href="https://example.com/posts/new-park"/>
</head>
```

```tree caption="Leaving the title in App gives two titles in the head; removing it leaves one."
Where the title of the post page comes from
- !`<title>My Blog</title>` left in `App` | React places **both titles** in the head | Which one the tab and the preview show is **undefined**
- +`App` renders **no title** [`<head>` `<meta charSet>`] | `PostPage` renders **the only title**, built as **one string** | The head holds **one title**
```

Remember: render exactly one title per page, declared by the component that owns the page data.

---

## All 3 Principles Together

### The Complete Blog Post

The post object holds the data of the post:

```jsx title="src/post.js"
export const post = {
  title: 'New Park Opens',
  summary: 'The park opens at noon.',
  url: 'https://example.com/posts/new-park',
};
```

`PostPage` renders the metadata of its own post next to its heading:

```jsx title="src/PostPage.jsx"
export default function PostPage({ post }) {
  return (
    <article>
      <title>~{`${post.title} | My Blog`}~</title> {/* Principles 1 and 3: the only title, as one string */}
      <meta name="description" content={post.summary} />
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.summary} />
      ~<link rel="canonical" href={post.url} />~ {/* Principle 1: React places every tag in the head */}
      <h1>{post.title}</h1>
      <p>{post.summary}</p>
    </article>
  );
}
```

`App` renders the whole document, with no title of its own:

```jsx title="src/App.jsx"
import PostPage from './PostPage.jsx';

export default function App({ post }) {
  return (
    <html>
      ~<head>~ {/* Principle 3: no title here */}
        <meta charSet="utf-8" />
      </head>
      <body>
        <PostPage post={post} />
      </body>
    </html>
  );
}
```

The server file streams the page, as in Lesson 118. `app` is our server:

```jsx title="server.js"
import { renderToPipeableStream } from 'react-dom/server';
import App from './src/App.jsx';
import { post } from './src/post.js';

app.use('/', (request, response) => {
  const { pipe } = ~renderToPipeableStream~(<App post={post} />, { // Principle 2: the title is in this HTML
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

The browser file attaches React in the browser:

```jsx title="src/main.jsx"
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';
import { post } from './post.js';

hydrateRoot(~document~, <App post={post} />); // App renders <html>, so React hydrates the whole document
```

The browser continues to render the article heading and summary paragraph on screen. In the document head, the server stream delivers one title, the description, two Open Graph tags, and the canonical link, all declared by the post page.

### How the Metadata Reaches the Head, in Order

On the server, React calls `App` first, then `PostPage`. While it renders `PostPage`, it writes each metadata tag into the head, and leaves the heading and the line in the article:

```tree dir=right caption="The order in which React calls the components and places the metadata of the post in the head."
One reader opens the post
- +1. On the server, React calls `App` [`<html>` `<head>` `<body>`] | Renders the document | The head holds **only the character set** so far
- +2. React calls `PostPage` [`<title>` `<meta>` `<link>`] | Writes **every metadata tag into the head** | Leaves **the heading and the line** in the article
- +3. A chat app or a search engine reads the HTML | The head holds **the full title of the post** and its description | The preview shows **the post**, not the site name alone
- +4. In the browser, `main.jsx` runs [`hydrateRoot`] | React attaches to the document | The tab already reads **the title of the post**
```

| Aspect | The Mistake | The React Rule |
| :--- | :--- | :--- |
| **Where the tags are written** | Keep every tag of the head in `App`, which does not know the post | Render `<title>`, `<meta>`, and `<link>` in `PostPage`; React places them in the head |
| **When the title is set** | Set `document.title` in an Effect, which runs only in the browser | Render `<title>` in the JSX, so it is in the HTML the server sends |
| **How many titles** | Keep the title of the site in `App` next to the title of the post | Render the title from one component, as one string built with a template literal |

Remember the core lesson of this chapter. **The component that owns the data renders the title, meta, and link tags, and React hoists them into the document head in both server-rendered HTML and client navigation.**

---

## For the Interview

> **The Interview Question:** How do you set titles, meta tags, and links with React components?

### How to Answer Clearly in 30 Seconds

"In React 19, I render `<title>`, `<meta>`, and `<link>` directly inside the component that owns the relevant data, alongside its regular markup. React hoists these elements into the document head automatically, working consistently across client apps, streaming server rendering, and Server Components. This guarantees that titles and descriptions appear in the server-streamed HTML read by external crawlers. Three rules guide this pattern:
1. **Server HTML delivery.** Social media crawlers generally do not execute client scripts. Setting `document.title` in an Effect fails because Effects run only in the browser after hydration.
2. **Single title ownership.** React does not deduplicate titles. If both the root shell and page component render a `<title>`, both land in the head with undefined resolution. One component must own the title.
3. **Single text child.** Hoisted title elements accept only a single text string child. I use template literals to combine article titles and site names into one string."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Does React remove duplicate metadata tags for you?"**
   React promises deduplication only for stylesheets sharing the same `href` attribute. For `<title>`, official documentation states the opposite: React places every rendered title directly into the head. Because web standards define no resolution priority for multiple titles, applications must ensure that only one component renders `<title>` at a time.
2. **"Why not set `document.title` directly in the component body?"**
   Mutating the DOM during rendering violates component purity and causes concurrency bugs (Lesson 14). Furthermore, evaluating `document` on the server throws a ReferenceError because the document object exists only in browsers. Calling it inside an Effect is safe for client-only apps, but only JSX elements reach server-rendered HTML.
3. **"Why would you still use a metadata library with React 19?"**
   The React 19 announcement notes that metadata libraries provide advanced capabilities such as route-based inheritance and automatic fallbacks for deeply nested layouts. When an application needs child routes to inherit and override root layout defaults systematically, a dedicated metadata solution remains valuable. For components with direct data access, native tag hoisting provides complete functionality. Resource preloading with `preload` and `preinit` addresses separate performance concerns (Lesson 126).
