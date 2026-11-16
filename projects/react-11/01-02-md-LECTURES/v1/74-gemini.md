# Lecture 74: Animating from the Article List to the Article with ViewTransition

*(How can the small image the user tapped grow into the large image of the article?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do you animate between two screens with ViewTransition?

---

## VS | A plain setter vs. a setter inside `startTransition`: one cuts to the new screen, the other animates it

> When a user selects an article in a polished news app, the list thumbnail expands smoothly into the hero image at the top of the article page. **In React, `<ViewTransition>` declares which parts of the interface participate in an animation, while `startTransition` identifies the state update that triggers it**. When you update state with a plain setter, React swaps the elements immediately, causing layouts to jump abruptly.

Master-detail interfaces are standard in web applications, including news feeds, product catalogs, and photo galleries. In conventional React applications, clicking an item invokes a state setter that immediately replaces the master list with the detail view. The thumbnail instantly vanishes from the list and reappears in a different position at a larger scale. This sudden visual cut forces the user to reorient themselves on the new screen. React provides `<ViewTransition>` to solve this problem by coordinating UI state changes with the browser animation engine, providing continuous visual context during navigation.

Consider a news reader displaying two stories: New Park Opens and Library Opens Late. Each row presents a compact thumbnail alongside an article title. When the user selects New Park Opens, the application navigates to an article view featuring an expansive hero image. An ideal user interface provides visual continuity between these two states. The small thumbnail should glide upward and scale fluidly to become the full-size header image of the article.

React normally applies state updates to the DOM in a single synchronous commit. The browser possesses native capabilities to animate layout changes across page transitions, but it requires advance preparation before the DOM mutates. Because React controls component rendering and DOM updates, only React knows the exact moment preceding a DOM swap. Consequently, orchestrating a view transition requires two distinct instructions: wrapping the animatable UI boundaries with `<ViewTransition>`, and marking the state update that initiates the transition with `startTransition`.

### The List Cuts to the Article

Here is the list screen of the news app. Each row is a button with a small image and a title:

```page width=full caption="The list screen of the news app, with a small image in each row."
heading: News
line: [🌳 New Park Opens]
line: [📚 Library Opens Late]
```

The user taps New Park Opens. The list is gone at once, and the article page is there, with a large park image at the top:

```page width=full caption="The article page, right after the user taps New Park Opens in the list."
line: [Back]
line: 🌳
heading: New Park Opens
line: The park on Main Street opens at noon.
```

Nothing traveled across the screen during the transition. The small park thumbnail vanished instantly, and a separate large image appeared in a different position. The interface suffered a hard cut. Two core concepts explain how to coordinate this animation:

> [!DEFINITION]
> **A Transition.** [REVIEW] A Transition is a state update marked as non-urgent by wrapping its state setter inside `startTransition`: `startTransition(() => setArticle(park))`. While urgent updates re-render the screen immediately, a Transition allows React's concurrent scheduler to prepare the next UI state in memory before committing changes to the DOM. React leverages this preparation window to coordinate DOM mutations with browser view transitions (Lesson 66).

> [!DEFINITION]
> **ViewTransition.** [NEW] `<ViewTransition>` is a built-in React component that defines an animated visual boundary in your component tree. Imported directly from `react`, it assigns temporary CSS transition identifiers to underlying DOM elements during navigation updates. On its own, `<ViewTransition>` remains passive and initiates no animations. It activates only when an asynchronous trigger, such as a Transition or Suspense reveal, alters the component tree inside it (Lesson 74).

### `<ViewTransition>` in Two Lines

Here are the two pieces, side by side:

```jsx title="What may animate, and when it animates"
~<ViewTransition>~ {/* What: the screens inside may animate */}
  {article ? <ArticlePage /> : <Home />}
</ViewTransition>

~startTransition~(() => setArticle(park)); // When: this change of screen animates
```

Here, the `park` variable holds the selected article object. Combining these two elements enables the list to fade out gracefully while the article page fades in. Principle 3 builds on this foundation by making the park image physically translate and scale across views.

**Keep this fundamental rule in mind throughout the entire lesson: `<ViewTransition>` declares what may animate, while a Transition decides when that animation occurs.**

The React documentation describes this architecture in identical terms. The `<ViewTransition>` component declaratively specifies the visual regions eligible for animation. Meanwhile, concurrent triggers including `startTransition`, `useDeferredValue`, and Suspense determine the exact moments when those animations run.

```tree caption="The two pieces of every View Transition in React: what may animate, and when it animates."
Two pieces make a change of screen animate
- +What may animate [`<ViewTransition>`] | Wraps the **parts of the page** that may animate | On its own, it **never starts** an animation
- +When it animates [`startTransition` `<Suspense>` `useDeferredValue`] | Marks **this change** as one that animates | Without it, the screen **cuts at once**
```

### The Browser Does the Animation, React Picks the Moment

In vanilla JavaScript applications, developers manipulate DOM elements directly. Modern web browsers provide native support for screen transitions through `document.startViewTransition`.

```js title="Plain JavaScript: the browser's View Transition API, from MDN"
document.~startViewTransition~(() => { // The browser animates from the page before this function to the page after it
  updateColor();
});
```

To use this browser API, you provide a callback function that mutates the DOM. The browser immediately captures a static raster snapshot of the existing layout. It then executes your DOM update callback, captures a second snapshot of the modified DOM, and constructs an active pseudo-element overlay to cross-fade between the snapshots.

In React applications, developers do not manipulate DOM elements directly. React manages all DOM reconciliation and layout updates internally based on JSX declarations. Because DOM mutations happen asynchronously inside React's commit phase, only React knows the precise moment to coordinate with the browser. React therefore invokes `startViewTransition` on your behalf at the correct point in the rendering lifecycle. Your role is strictly to declare which components participate and trigger the state update.

The official React documentation emphasizes this separation: React automatically calls `startViewTransition` behind the scenes, so you should never invoke it manually in component code.

### The Rule of Thumb: does the user move from one screen to another?

**Evaluate every animation requirement by asking a simple question: is the user navigating between distinct views or layouts? If yes, employ `<ViewTransition>` alongside a Transition. If an isolated element simply responds to a user interaction, use a standard CSS animation or keyframe.**

Web applications typically implement animations through three distinct mechanisms:
1. **Directly calling `document.startViewTransition` in vanilla JavaScript.** This approach suits static web documents without framework runtime coordination.
2. **Wrapping component boundaries in `<ViewTransition>` and updating state within a Transition.** React coordinates with browser rendering pipelines automatically. This pattern is the focus of this lesson.
3. **Applying CSS transitions or keyframe animations to individual elements.** This pattern suits isolated micro-interactions, such as a pulsating like button or an interactive toggle switch.

The React design team notes that View Transitions do not replace all application animations. They specifically facilitate major structural shifts: screen navigation, expanding master-detail views, modal presentations, and list reordering.

Experienced engineers avoid three common integration mistakes:
1. **Wrapping components in `<ViewTransition>` while executing plain state updates.** State changes cut immediately without triggering animations, leaving the browser console silent.
2. **Manually invoking `document.startViewTransition` within React event handlers.** Manual browser calls disrupt React's concurrent scheduling, causing visual collisions and aborted transitions.
3. **Assigning static, identical `name` values across repeated list items.** Duplicate transition names violate browser specifications, causing React to log runtime console errors.

Production compatibility note: In React 19.3.1, both `<ViewTransition>` and `addTransitionType` are stable named exports from the React package. In earlier releases, these APIs required React Canary or Experimental builds. Always verify your project's React version before adopting these exports.

## SECTION | A News App with a List and an Article Page

Our example application is a news reader. One state variable in the App component, `article`, determines which view renders. When `article` is `null`, the application displays the article list. When it holds an article object, the application displays the dedicated article view.

```files title="news-app: File Explorer" caption="The files of our news app inside src/ and public/."
public/
  park.jpg | image | The park picture
  library.jpg | image | The library picture
src/
  App.jsx | parent | Holds `article` and wraps both screens in `<ViewTransition>`; imports `Home` and `ArticlePage`
  Home.jsx | default export | The list screen: one row per article, with a small image and a title
  ArticlePage.jsx | default export | The article screen: the `Back` button, the large image, the title, and the text
  ArticleImage.jsx | default export | New in Principle 3: the image inside a named `<ViewTransition>`
  ArticleText.jsx | default export | New in Principle 6: reads the article text with `use`
  articles.js | helper | Exports `articles`, the two articles
  data.js | helper | New in Principle 6: exports `fetchText`
  App.css | styles | The two image sizes, and from Principle 4 the animation classes
```

The application stores its article data in a small module. Each record provides an `id`, a title, an image URL, and body text:

```js title="src/articles.js"
export const articles = [
  { id: 1, title: 'New Park Opens', image: '/park.jpg', text: 'The park on Main Street opens at noon.' },
  { id: 2, title: 'Library Opens Late', image: '/library.jpg', text: 'The library stays open until nine tonight.' },
];
```

The Home component renders a list containing one row per article (Lesson 18). Each row functions as an interactive button. When activated by the user, the button invokes an `onOpen` callback supplied by the App parent component (Lesson 23):

```jsx title="src/Home.jsx"
export default function Home({ articles, onOpen }) {
  return (
    <section>
      <h1>News</h1>
      <ul>
        {articles.map(article => (
          <li key={article.id}>
            <button onClick={() => ~onOpen(article)~}> {/* The row asks App to open this article */}
              <img className="small" src={article.image} alt="" />
              {article.title}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

The ArticlePage component renders the navigation header, full-size banner image, headline, and article body:

```jsx title="src/ArticlePage.jsx"
export default function ArticlePage({ article, onBack }) {
  return (
    <article>
      <button onClick={~onBack~}>Back</button> {/* Asks App to show the list again */}
      <img className="large" src={article.image} alt="" />
      <h1>{article.title}</h1>
      <p>{article.text}</p>
    </article>
  );
}
```

Two utility classes manage the image dimensions across both views:

```css title="src/App.css"
.small {
  width: 48px;
}

.large {
  width: 100%;
}
```

The parent App component appears in Principle 1. Subsequent principles modify these files incrementally to demonstrate each capability:

**PRINCIPLES:** `<ViewTransition>` marks what may animate, and a Transition says when. React prepares the page, and the browser runs the animation. Six principles follow:
1. **A plain setter cuts, and `startTransition` cross-fades.** Only a Transition, a `<Suspense>` reveal, or a deferred value makes a `<ViewTransition>` animate.
2. **React calls the browser for us.** React writes `view-transition-name` and calls `startViewTransition`, and the browser fades the old screen into the new one.
3. **A shared `name` grows the small image into the large one.** The same name on both images makes them one image. Each name may be on the page only once at a time.
4. **A View Transition Class styles the animation.** Our CSS styles a class we name on the prop, and turns it down for users who asked for less motion.
5. **`addTransitionType` lets going back slide the other way.** Naming why the Transition happened lets each direction pick its own class.
6. **The loading line cross-fades into the article text.** A `<Suspense>` reveal is a trigger too, and the shared image must stay outside the boundary.

---

## PRINCIPLE | `startTransition` around the setter: the change of screen animates, a plain setter cuts

> [!PRINCIPLE]
> **Principle 1: A Plain setArticle Cuts, startTransition Cross-Fades: Only a Trigger Starts the Animation**
>
> *A `<ViewTransition>` animates only when the change inside it comes from a Transition, a `<Suspense>` reveal, or `useDeferredValue`; a plain setter changes the screen at once.*
>
> Wrapping the screens in `<ViewTransition>` only says what may animate. If the click handler calls the setter directly, React updates the screen at once, as it always has. There is no error, because nothing is wrong in React's eyes. Put the setter inside `startTransition`, and the same tap cross-fades the two screens.
>
> **DO THIS:**
> ```jsx
> function handleOpen(next) {
>   ~startTransition(() => setArticle(next))~; // A Transition: the list fades into the article page
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleOpen(next) {
>   ~setArticle(next)~; // **WRONG:** a plain setter is not a trigger, so the screen cuts with no error
> }
> ```

### Two buttons under the same `<ViewTransition>`

Consider the minimal scenario managing a single boolean state variable named `open`. Compare two buttons configured to display the article:

```jsx title="A plain setter vs. a setter inside startTransition, under the same ViewTransition"
import { ViewTransition, startTransition, useState } from 'react';

const [open, setOpen] = useState(false);

<ViewTransition>
  {open ? <ArticlePage /> : <Home />}
</ViewTransition>

<button onClick={() => ~setOpen(true)~}>Open</button> {/* A plain setter: the screen cuts */}
<button onClick={() => ~startTransition(() => setOpen(true))~}>Open</button> {/* A Transition: the two screens cross-fade */}
```

You import `ViewTransition` from `react` alongside standard hooks and utilities.

Both buttons display the article view, and both operate within the identical `<ViewTransition>` boundary. You might assume both buttons would automatically animate. However, their internal execution paths differ fundamentally. The plain state setter causes React to replace the list view immediately. In contrast, wrapping the setter in `startTransition` enables the list to fade out gracefully while the article view fades in.

The React documentation confirms this behavior: standard state updates execute immediately and do not activate `<ViewTransition>`.

React refers to the mechanism that initiates an animation as a **trigger**. A `<ViewTransition>` boundary recognizes three specific triggers:
1. **A Transition**, such as a state setter wrapped in `startTransition` or an Action.
2. **A deferred value** generated by `useDeferredValue` (Lesson 68).
3. **A `<Suspense>` boundary revealing content** after resolving a pending resource (Lesson 69).

The official specification states that only updates wrapped in a Transition, Suspense boundary, or deferred value activate a View Transition. A standard state setter invoked directly in an event handler satisfies none of these criteria.

### What a cross-fade is

The default animation performed by the browser is a **cross-fade**. During a cross-fade, the outgoing view diminishes in opacity while the incoming view increases in opacity concurrently, completing when only the new view remains visible. The React documentation notes that `<ViewTransition>` defaults to a smooth cross-fade animation.

Our application code includes zero custom animation declarations. The cross-fade is the browser's built-in default view transition behavior, executed entirely by the browser engine.

```tree caption="The same ViewTransition with a plain setter and with a setter inside startTransition."
Two ways to open the article under one `<ViewTransition>`
- !A plain setter [`setOpen`] | Not a trigger: React **updates the screen at once** | The list **cuts** to the article page
- +A setter inside `startTransition` [`startTransition`] | A Transition is a **trigger**: the `<ViewTransition>` takes part | The list **fades out** while the article page **fades in**
```

### The first `App` cuts, with no error

Here is the initial implementation of the App component. It wraps both views in `<ViewTransition>`, but its event handlers invoke the state setter directly:

```jsx title="src/App.jsx" bad="11,15"
import { ViewTransition, useState } from 'react';
import Home from './Home.jsx';
import ArticlePage from './ArticlePage.jsx';
import { articles } from './articles.js';
import './App.css';

export default function App() {
  const [article, setArticle] = useState(null);

  function handleOpen(next) {
    ~setArticle(next)~; // **WRONG:** a plain setter is not a trigger, so the screen cuts
  }

  function handleBack() {
    ~setArticle(null)~; // **WRONG:** going back cuts too
  }

  return (
    <ViewTransition>
      {article ? (
        <ArticlePage article={article} onBack={handleBack} />
      ) : (
        <Home articles={articles} onOpen={handleOpen} />
      )}
    </ViewTransition>
  );
}
```

When the user selects New Park Opens, the layout cuts abruptly, identical to the behavior before adding `<ViewTransition>`. Here is the sequence of events:
1. The user selects the row, prompting the Home component to invoke `onOpen`. This executes `handleOpen`, which calls `setArticle` with the selected item.
2. Because no Transition is active, React classifies this update as urgent.
3. React renders the ArticlePage component and updates the DOM immediately, following standard synchronous rendering behavior.
4. The `<ViewTransition>` boundary remains passive because no recognized trigger initiated the update.

The browser console displays zero warnings. Nothing alerts the developer to why the anticipated animation failed to run:

```page width=full caption="The article page right after the tap, with the plain setter: the same cut, and an empty Console."
line: [Back]
line: 🌳
heading: New Park Opens
line: The park on Main Street opens at noon.
console: quiet
```

### Putting the change of screen inside `startTransition`

Resolving the issue requires wrapping each state setter inside `startTransition`. Marking the update as a Transition provides the necessary concurrent trigger:

```jsx title="src/App.jsx" startLine="1" good="1,11,12,13,17,18,19"
import { ViewTransition, startTransition, useState } from 'react';
import Home from './Home.jsx';
import ArticlePage from './ArticlePage.jsx';
import { articles } from './articles.js';
import './App.css';

export default function App() {
  const [article, setArticle] = useState(null);

  function handleOpen(next) {
    ~startTransition~(() => { // The change of screen is now a Transition
      setArticle(next);
    });
  }

  function handleBack() {
    ~startTransition~(() => { // Going back is a Transition too
      setArticle(null);
    });
  }

  return (
    <ViewTransition>
      {article ? (
        <ArticlePage article={article} onBack={handleBack} />
      ) : (
        <Home articles={articles} onOpen={handleOpen} />
      )}
    </ViewTransition>
  );
}
```

Now, when the user selects New Park Opens, the list fades out smoothly while the article view fades in. When the user selects Back, the article view fades out as the list view fades in. The initial and final visual layouts remain unchanged. Only the transitional animation between them is altered.

### How developers meet this bug

Developers frequently discover `<ViewTransition>` in documentation and wrap their application root in it. However, if their event handlers or custom routers invoke plain state setters, the application cuts abruptly and the console stays quiet. Developers often conclude prematurely that the user's browser lacks View Transition support.

The issue resides in the event handler rather than the browser engine. The React documentation highlights the opposite scenario: when a routing library already wraps page changes in `startTransition`, adding a single `<ViewTransition>` boundary activates the default cross-fade animation automatically.

Always remember: `<ViewTransition>` declares what may animate, while `startTransition` dictates when that animation runs.

---

## PRINCIPLE | `startViewTransition`: React calls the browser at the moment it changes the page, so we never call it

> [!PRINCIPLE]
> **Principle 2: The Browser Captures the Old Screen Before React Changes It: React Calls startViewTransition for Us**
>
> *On every Transition that activates a `<ViewTransition>`, React writes `view-transition-name` on its nearest DOM node and calls the browser's `startViewTransition`; the browser takes a still image of the old screen, React changes the DOM, and the browser fades the old snapshot into the live new one.*
>
> The animation belongs to the browser, and the timing belongs to React. React knows the exact moment it changes the page, so React makes the browser call at that moment and removes the names afterwards. A call from our own code cannot know that moment. Its function ends before React changes the page, and when React starts its own view transition, React interrupts ours.
>
> **DO THIS:**
> ```jsx
> function handleOpen(next) {
>   ~startTransition(() => setArticle(next))~; // React calls startViewTransition when it changes the page
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleOpen(next) {
>   document.~startViewTransition~(() => setArticle(next)); // **WRONG:** the function ends before React changes the page
> }
> ```

### Our own call to the browser vs. letting React make it

Modern browsers provide the **View Transition API** to facilitate animated transitions between different visual states. The primary entry point for this browser feature is `document.startViewTransition`.

In React applications, developers should never invoke that browser method directly. Consider the two approaches:

```jsx title="Our own call to the browser vs. letting React make it"
document.~startViewTransition~(() => setArticle(park)); // Our code calls the browser: the ViewTransition never takes part
~startTransition~(() => setArticle(park)); // Under a ViewTransition, React calls startViewTransition itself
```

While both approaches appear similar at first glance, their execution models inside React are completely different. React calls `startViewTransition` at the exact instant it commits DOM changes. An external call from application code cannot synchronize with React's internal commit timing.

The official documentation gives explicit guidance: React automatically invokes `startViewTransition` behind the scenes, so you should never call it manually. In fact, if an external script initiates a View Transition, React will interrupt it.

### What happens during one tap

In summary: the browser captures a static snapshot of the list view. React swaps the list DOM elements for the article DOM elements. Then the browser animates a cross-fade from the snapshot to the live new page.

> [!DEFINITION]
> **Snapshot.** [NEW] A snapshot is a visual capture of a DOM boundary generated by the browser for a view transition. The outgoing snapshot is a static raster image that rejects user input during the animation. The incoming snapshot represents the interactive, live DOM structure. During the transition, the browser animates between these two visual states (Lesson 74).

Here is the complete sequence of events during a single navigation:
1. The user selects New Park Opens, prompting `handleOpen` to initiate a Transition.
2. React begins concurrent rendering of the ArticlePage component in memory without modifying the visible DOM.
3. React writes a temporary `view-transition-name` property into the inline style of the nearest child DOM node inside the `<ViewTransition>` boundary. In this scenario, it targets the `<section>` element of the list.
4. React invokes the browser's `document.startViewTransition` API.
5. The browser captures the outgoing snapshot: an inert raster screenshot of the current list view.
6. Inside the callback provided to the browser, React executes its DOM commit. The `<section>` element unmounts, and the `<article>` element mounts in its place.
7. The new `<article>` node receives the matching `view-transition-name`. React waits for external fonts, resolves layout effects via `useLayoutEffect` (Lesson 49), and connects DOM refs.
8. The browser captures the incoming snapshot representing the live article view.
9. The browser executes the cross-fade animation, transitioning opacity between the outgoing and incoming snapshots.
10. Once the animation finishes, React cleans up the temporary `view-transition-name` inline style and runs passive `useEffect` hooks (Lesson 32).

Why does React defer passive Effects until the animation concludes? The documentation explains that delaying `useEffect` execution prevents non-critical background logic from competing with animation rendering on the main thread.

The `view-transition-name` property is a CSS property that registers an element as a distinct snapshot participant. Our application code never writes this property manually. React applies it dynamically and removes it as soon as the animation completes.

When a `<ViewTransition>` boundary specifies no `name` prop, React generates a unique internal identifier. Principle 3 explores assigning our own explicit names to connect specific elements across views.

```tree dir=right caption="Who does what during one tap: React prepares the page, and the browser takes the snapshots and runs the animation."
One tap on `New Park Opens`
- +1. React prepares [`view-transition-name`] | Renders `ArticlePage` | Names the list's `<section>` and calls **`startViewTransition`**
- +2. The browser takes the list | Takes the **old snapshot**: a **still image** the user cannot click
- +3. React changes the DOM | Swaps the `<section>` for the `<article>` | Runs `useLayoutEffect` and refs
- +4. The browser animates | Takes the **new snapshot**, which is **live** | Fades the old one **out** and the new one **in**
- +5. React cleans up | Removes the names | Runs **`useEffect` last**
```

### The pseudo-elements the browser draws

During a transition, the browser constructs a temporary tree of **pseudo-elements** over the viewport. Pseudo-elements represent stylable interface structures that do not exist as concrete tags in your source HTML.

Two specific pseudo-elements control snapshot rendering:
- **`::view-transition-old()`** renders the outgoing snapshot.
- **`::view-transition-new()`** renders the incoming snapshot.

Principle 4 explains how to style these pseudo-elements using CSS classes.

### Calling `document.startViewTransition` inside a React app

A developer experienced with vanilla JavaScript might attempt to invoke the browser View Transition API manually inside a React click handler:

```jsx title="src/App.jsx" startLine="10"
function handleOpen(next) {
  document.~startViewTransition~(() => { // **WRONG:** our own view transition competes with React's
    setArticle(next);
  });
}
```

While the DOM eventually updates, React's `<ViewTransition>` component never coordinates with this manual call. Here is why:
1. Calling `setArticle` inside the callback merely schedules an asynchronous React render.
2. The browser transition callback finishes synchronously before React reconciles or commits any DOM updates.
3. React assigns no transition names and initiates no internal transition orchestration.
4. The browser captures identical before-and-after snapshots of the list view. The article page simply pops into view a moment later when React finishes rendering.

Shared element transitions cannot function through manual browser calls of this kind.

Wrapping the state setter inside `startTransition` within that manual browser call also fails. React will initiate its own view transition shortly thereafter, aborting the manual transition immediately. The documentation warns that if another process runs a view transition, React interrupts it.

The React team recommends migrating all legacy transition triggers to the built-in React mechanism: wrapping updates in `startTransition` within a `<ViewTransition>` boundary.

---

## PRINCIPLE | `name` on `<ViewTransition>`: the same name on both screens makes one image move and grow

> [!PRINCIPLE]
> **Principle 3: A Shared name Grows the Small Image into the Large One: One Name Leaves and the Same Name Arrives**
>
> *When a Transition removes a `<ViewTransition>` with a `name` and adds another `<ViewTransition>` with the same `name`, React animates from the removed one to the added one; only one `<ViewTransition>` with a given `name` may be mounted at a time.*
>
> The small image and the large image are two different elements on two different screens. The user should see one image travel, not two images fade. The same `name` on both tells React they are one, and the browser moves and grows the snapshot. Build the name from the item's `id`, so each row has its own name.
>
> **DO THIS:**
> ```jsx
> <ViewTransition ~name={`article-${article.id}`}~> {/* One name per article: article-1 pairs only with article-1 */}
>   <img className={size} src={article.image} alt="" />
> </ViewTransition>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <ViewTransition ~name="article-image"~> {/* **WRONG:** every row mounts the same name, and React logs two errors */}
>   <img className={size} src={article.image} alt="" />
> </ViewTransition>
> ```

### The cross-fade still loses the user's place

The cross-fade established in Principle 1 improves upon an abrupt cut, but visual continuity remains incomplete. The small park thumbnail fades out with the list, while the large park image fades in with the article view. To the browser engine, they represent two completely unrelated images.

To transform this into a seamless spatial animation, assign the identical `name` prop to both elements:

```jsx title="The same name on the small image and on the large image"
<ViewTransition ~name="park-image"~><img className="small" src="/park.jpg" alt="" /></ViewTransition> {/* In the list row */}
<ViewTransition ~name="park-image"~><img className="large" src="/park.jpg" alt="" /></ViewTransition> {/* On the article page */}
```

The `name` prop on `<ViewTransition>` configures shared element transitions across different component trees.

When the user selects an article, the active Transition unmounts the first `<ViewTransition name="park-image">` and mounts the second one. React detects that an outgoing transition name matches an incoming transition name. It pairs them together as a single continuous visual element.

> [!DEFINITION]
> **Shared element transition.** [NEW] A shared element transition animates a single visual element shared across two different views, such as an article thumbnail expanding into a hero banner. You configure one by assigning matching `name` props to two `<ViewTransition>` boundaries. The browser captures the outgoing element snapshot and smoothly translates, scales, and transforms it into the geometry of the incoming element (Lesson 74).

The React documentation notes that `<ViewTransition>` creates a snapshot image that can be moved, scaled, and cross-faded between views.

Compare how navigation behaves with and without a shared `name`:
- **Without `name`**, React assigns a unique internal identifier to each boundary to prevent unwanted collisions. Because the names never match, the small thumbnail fades out in place while the large image fades in elsewhere.
- **With matching `name` props**, React establishes a shared pair. The thumbnail glides from its row to the top of the article view and scales up smoothly, while the surrounding layout cross-fades.

A single prop configuration fundamentally transforms the visual experience.

```tree caption="The same tap without a name and with the same name on both images."
The park image during the tap
- !Without `name` | React gives **each image its own name** | The small image **fades out**; the large one **fades in** somewhere else
- +With the same `name` on both images [`name`] | One name **leaves**, the same name **arrives** | The park image **moves and grows** from the row to the top of the page
```

### One `ArticleImage` for both screens

Both the list view and the article view require an image wrapped in a named `<ViewTransition>`. We encapsulate this logic in a shared component. The transition name is derived dynamically from the article's unique `id`. The park article receives `article-1`, while the library article receives `article-2`:

```jsx title="src/ArticleImage.jsx"
import { ViewTransition } from 'react';

export default function ArticleImage({ article, size }) {
  return (
    <ViewTransition ~name={`article-${article.id}`}~> {/* article-1 for the park, article-2 for the library */}
      <img className={size} src={article.image} alt="" />
    </ViewTransition>
  );
}
```

The `id` property matches the identifier used by the list component for row keys. Both views now replace their raw `<img>` tags with `<ArticleImage />`:

```jsx title="src/Home.jsx" startLine="10"
<button onClick={() => onOpen(article)}>
  ~<ArticleImage article={article} size="small" />~ {/* The small image, named article-1 or article-2 */}
  {article.title}
</button>
```

```jsx title="src/ArticlePage.jsx" startLine="6"
<button onClick={onBack}>Back</button>
~<ArticleImage article={article} size="large" />~ {/* The large image, with the same name as its row */}
<h1>{article.title}</h1>
```

Both component files import the new shared image component:

```jsx title="The new import in Home.jsx and in ArticlePage.jsx"
import ~ArticleImage~ from './ArticleImage.jsx'; // The same component on both screens
```

Now, when the user selects New Park Opens, the thumbnail glides upward and expands smoothly until it occupies the top of the article view. The surrounding headings and text cross-fade around it. When the user selects Back, the hero image contracts smoothly back into its original list row.

```tree dir=right caption="What the user sees during one tap when both park images share the name article-1."
The park image from the list to the article
- +In the list | The **small** park image sits in the first row
- +During the animation | The browser **moves and grows** one snapshot | The rest of the screen **cross-fades**
- +On the article page | The **large** park image sits at the top | `Back` makes it **shrink back** into its row
```

Our source code specifies no explicit pixel coordinates or animation keyframes. The browser calculates the starting and ending bounding boxes automatically, animating position and scale between them.

### One fixed name for every row

Consider two approaches for naming the transition inside the ArticleImage component:

```jsx title="One fixed name vs. a name built from the id"
<ViewTransition ~name="article-image"~> {/* Every row gets the same name: article-image */}
<ViewTransition ~name={`article-${article.id}`}~> {/* Each row gets its own name: article-1, article-2 */}
```

While both options look straightforward, their runtime behaviors are fundamentally different. The ArticleImage component renders once for every item in the list. Using a static string causes multiple mounted components to claim the identical transition name simultaneously.

The browser specification enforces a strict rule: only one element with a given transition name may be mounted in the document at any single time. Violating this rule causes the view transition to fail.

This defect is easy to overlook when testing with a single item. If the list contains multiple entries, React immediately logs console errors in development:

```page width=full caption="The list screen with one fixed name in ArticleImage: two rows, two errors in the Console."
heading: News
line: [🌳 New Park Opens]
line: [📚 Library Opens Late]
console: There are two <ViewTransition name="article-image"> components with the same name mounted at the same time. This is not supported and will cause View Transitions to error. Try to use a more unique name e.g. by using a namespace prefix and adding the id of an item to the name.
console: The existing <ViewTransition name="article-image"> duplicate has this stack trace.
```

Each warning includes a component stack trace identifying where duplicate names were mounted. The fix is the pattern suggested by the error message itself: append the item's unique identifier to the name. Our ArticleImage component implements this pattern.

Always remember: a shared transition connects one unmounting element with one mounting element sharing the same name, and names must remain unique across simultaneously mounted elements.

---

## PRINCIPLE | A View Transition Class on `default`: our CSS styles the animation, and turns it down for reduced motion

> [!PRINCIPLE]
> **Principle 4: A View Transition Class Slows the Cross-Fade: The Prop Names the Class, and CSS Styles It**
>
> *To change how a `<ViewTransition>` animates, give `enter`, `exit`, `update`, `share`, or `default` a class name, style it with `::view-transition-old` and `::view-transition-new`, and turn it down inside `@media (prefers-reduced-motion)`.*
>
> The browser's cross-fade is only the starting point. A class name on the right prop gives our CSS a stable handle, because React makes the names and writes them only during the animation. `"none"` turns an animation off, and `"auto"` keeps the browser's own. React plays every animation, even for users who asked for less motion, so the media query is our job.
>
> **DO THIS:**
> ```jsx
> <ViewTransition ~default="slow-fade"~> {/* App.css styles .slow-fade on the old and new snapshots */}
>   {article ? <ArticlePage /> : <Home />}
> </ViewTransition>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <ViewTransition ~name="screens"~> {/* **WRONG:** a name added only so CSS can select it; name is for shared element transitions */}
>   {article ? <ArticlePage /> : <Home />}
> </ViewTransition>
> ```

### The smallest View Transition Class

Suppose the default browser cross-fade feels too abrupt, and you want to extend the transition duration to 500 milliseconds. Customizing this requires two changes: adding a prop to `<ViewTransition>`, and writing two corresponding CSS rules.

```jsx title="A class name on the default prop"
<ViewTransition ~default="slow-fade"~> {/* React adds the class slow-fade when this ViewTransition animates */}
```

```css title="Two CSS rules for the class slow-fade"
::view-transition-old(.slow-fade) {
  animation-duration: 500ms;
}
::view-transition-new(.slow-fade) {
  animation-duration: 500ms;
}
```

The component prop defines the class name, and standard CSS selectors target that class. You choose the class name.

> [!DEFINITION]
> **View Transition Class.** [NEW] A View Transition Class is a CSS class name assigned to a `<ViewTransition>` prop, such as `default="slow-fade"`. React attaches this class to the corresponding transition pseudo-elements when the boundary activates. Your stylesheet targets the outgoing snapshot using `::view-transition-old(.slow-fade)` and the incoming snapshot using `::view-transition-new(.slow-fade)` (Lesson 74).

### Five props, one for each kind of animation

The `default` prop is one of five properties that accept a View Transition Class. Each property maps to a distinct phase of the transition lifecycle:
1. **`enter`**: applies when the Transition mounts a new `<ViewTransition>` boundary.
2. **`exit`**: applies when the Transition unmounts an existing `<ViewTransition>` boundary.
3. **`update`**: applies when React modifies DOM elements inside an existing `<ViewTransition>` boundary.
4. **`share`**: applies to shared element transitions connecting paired names.
5. **`default`**: serves as the fallback class for any transition kind without an explicit prop.

Our screen swap represents an `update`. The root `<ViewTransition>` remains mounted, while its child contents switch from the list view to the article view.

Each of these props accepts three possible values:
- **`"auto"`** preserves the browser's default animation behavior. Omitting the prop produces identical results.
- **`"none"`** disables that specific category of animation entirely.
- **Any string value** assigns a custom View Transition Class, such as `"slow-fade"`.

In our news application, the root `<ViewTransition>` receives the new prop configuration:

```jsx title="src/App.jsx" startLine="23"
<ViewTransition ~default="slow-fade"~> {/* The change of screen now fades in half a second */}
  {article ? (
    <ArticlePage article={article} onBack={handleBack} />
  ) : (
    <Home articles={articles} onOpen={handleOpen} />
  )}
</ViewTransition>
```

Our stylesheet includes the two `.slow-fade` rules directly below the image dimension styles.

The shared park image configured in Principle 3 maintains its own animation path. Its boundary in the ArticleImage component defines no class name, so its movement continues using the browser's default timing.

### VS | A selector on a name vs. a selector on a class: only the class is ours

Early tutorials frequently styled view transitions by targeting element transition names directly in CSS:

```css title="A selector on a name vs. a selector on a class"
::view-transition-old(article-1) {
  animation-duration: 500ms;
}
::view-transition-old(.slow-fade) {
  animation-duration: 500ms;
}
```

While both selectors appear to target the transition, their architectural implications differ significantly. React manages transition names dynamically. Without an explicit `name` prop, React generates random internal names that cannot be targeted reliably in static stylesheets.

A View Transition Class provides a stable, declarative interface for CSS styling. The React documentation recommends classes over names for styling, noting that the `name` prop should be reserved exclusively for shared element transitions.

### Users who asked for less motion

Many users enable operating system accessibility settings to reduce screen motion, preventing discomfort caused by intense animations. Modern browsers expose this preference to stylesheets through the `prefers-reduced-motion` media query.

React does not automatically suppress View Transitions when this setting is detected. The official documentation advises that developers should always provide a `@media (prefers-reduced-motion)` query to disable or simplify animations according to user preference.

Whenever you define custom View Transition Classes, you must accompany them with reduced motion overrides. We append this accessibility rule to the stylesheet:

```css title="src/App.css" startLine="16"
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(.slow-fade),
  ::view-transition-new(.slow-fade) {
    animation: none;
  }
}
```

For users requesting reduced motion, the views swap instantly without animation. All other users experience the smooth 500 millisecond fade.

Note that the shared park image from Principle 3 still animates unless explicitly silenced. Because its boundary specifies no class, this rule does not match it. Adding `::view-transition-group(*)` to the media query disables shared element movement as well.

### Turning one part off with `"none"`

Wrapping the application root in `<ViewTransition>` carries architectural trade-offs. Any subsequent state Transition modifying elements inside the article page would trigger an unwanted full-screen cross-fade. The React team cautions that high-level boundaries can produce unexpected visual churn.

You can prevent unwanted animations by wrapping localized content in an inner boundary configured with `update="none"`. Updates within that inner boundary bypass animation entirely. Consider wrapping article text to keep it stable:

```jsx title="An inner ViewTransition that keeps the text still"
<ViewTransition ~update="none"~> {/* A Transition that changes only this text no longer fades the whole screen */}
  <p>{article.text}</p>
</ViewTransition>
```

Our current application does not require this override yet, as no state transitions modify the text in isolation.

---

## PRINCIPLE | `addTransitionType`: opening and going back each pick their own slide

> [!PRINCIPLE]
> **Principle 5: addTransitionType Slides Back the Other Way: The Type Picks the Class**
>
> *Call `addTransitionType` inside `startTransition` to name the cause of the Transition, and give the prop an object with one class for each type, so opening and going back can slide in opposite directions.*
>
> Opening an article and going back are the same kind of update to the same `<ViewTransition>`. Only the cause differs, and the cause is something only our code knows. `addTransitionType` hands that cause to React, and React picks the class whose key matches it.
>
> **DO THIS:**
> ```jsx
> startTransition(() => {
>   ~addTransitionType('nav-back')~; // The nav-back key picks slide-back
>   setArticle(null);
> });
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <ViewTransition ~default="slide"~> {/* **WRONG:** Back slides the list in from the same side, like a new screen */}
>   {article ? <ArticlePage /> : <Home />}
> </ViewTransition>
> ```

### Opening and going back slide the same way

Many applications employ directional slide animations instead of cross-fades. Opening an article slides the incoming content in from the right. Returning to the list slides the previous view in from the left, reinforcing the user's spatial orientation.

Suppose our `<ViewTransition>` boundary defines a single slide class via `default="slide"`. Selecting an article slides the article view in from the right. Selecting Back also slides the list view in from the right. To the user, navigating back appears identical to drilling deeper into a new screen.

Both operations represent an `update` to the identical boundary. A single static class cannot distinguish between forward and backward navigation. The underlying distinction is semantic intent: opening an article versus returning to the list.

### Naming why the Transition happened

React provides `addTransitionType` to communicate navigation intent. The function allows developers to annotate a transition with a specific semantic cause. You invoke it synchronously within `startTransition` with an arbitrary string identifier. It returns no value.

Consider two navigation handlers configured with transition types:

```jsx title="The same Transition with two different types"
startTransition(() => { ~addTransitionType('nav-forward')~; go(url); }); // Named as moving forward
startTransition(() => { ~addTransitionType('nav-back')~; go(url); }); // Named as moving back
```

In this example, `go` represents a router function that updates the active route.

> [!DEFINITION]
> **Transition Type.** [NEW] A Transition Type is a string passed to `addTransitionType` inside `startTransition` to label why an update occurred. The `<ViewTransition>` props can then accept an object mapping type names to specific CSS classes. React selects and applies the class that matches the active transition type (Lesson 74).

```jsx title="One class for each Transition Type"
<ViewTransition ~default={{ 'nav-forward': 'slide-forward', 'nav-back': 'slide-back' }}~> {/* The type picks the class */}
```

Each key in the object represents a transition type, and each value specifies the class to apply.

Compare the two configurations:
- **With a single string `default="slide"`**, forward and backward transitions use the identical animation.
- **With an object mapping types to classes**, each navigation direction activates its own dedicated CSS class.

While both approaches function identically during initial navigation, the difference becomes evident when navigating backward. With an object map, React inspects the active transition type and applies the corresponding directional class.

```tree caption="One slide class for both directions vs. one class for each Transition Type."
How the `Back` button slides the list in
- !One class for both [`default="slide"`] | Opening and `Back` get the **same slide** | Going back **looks like going forward**
- +One class per Transition Type [`addTransitionType`] | `nav-forward` picks `slide-forward`; `nav-back` picks `slide-back` | `Back` slides the list in **from the other side**
```

### The two handlers in our app

We import `addTransitionType` and annotate each navigation transition with its semantic cause:

```jsx title="src/App.jsx" startLine="1" good="12,19,25"
import { ViewTransition, startTransition, addTransitionType, useState } from 'react';
import Home from './Home.jsx';
import ArticlePage from './ArticlePage.jsx';
import { articles } from './articles.js';
import './App.css';

export default function App() {
  const [article, setArticle] = useState(null);

  function handleOpen(next) {
    startTransition(() => {
      ~addTransitionType('nav-forward')~; // The user opened an article
      setArticle(next);
    });
  }

  function handleBack() {
    startTransition(() => {
      ~addTransitionType('nav-back')~; // The user went back to the list
      setArticle(null);
    });
  }

  return (
    <ViewTransition ~default={{ 'nav-forward': 'slide-forward', 'nav-back': 'slide-back' }}~> {/* Replaces slow-fade */}
      {article ? (
        <ArticlePage article={article} onBack={handleBack} />
      ) : (
        <Home articles={articles} onOpen={handleOpen} />
      )}
    </ViewTransition>
  );
}
```

The identifiers `'nav-forward'` and `'nav-back'` are application-defined strings. React does not infer their meaning. It matches them strictly against the keys defined in your prop object.

Our stylesheet replaces the simple fade with keyframe animations. Each rule moves the outgoing snapshot out on one side while sliding the incoming snapshot in from the opposite side:

```css title="src/App.css" startLine="9"
::view-transition-old(.slide-forward) {
  animation: slide-out-left 300ms ease-out;
}
::view-transition-new(.slide-forward) {
  animation: slide-in-right 300ms ease-out;
}
::view-transition-old(.slide-back) {
  animation: slide-out-right 300ms ease-out;
}
::view-transition-new(.slide-back) {
  animation: slide-in-left 300ms ease-out;
}

@keyframes slide-in-right { from { transform: translateX(100%); } }
@keyframes slide-out-left { to { transform: translateX(-100%); } }
@keyframes slide-in-left { from { transform: translateX(-100%); } }
@keyframes slide-out-right { to { transform: translateX(100%); } }

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(.slide-forward),
  ::view-transition-new(.slide-forward),
  ::view-transition-old(.slide-back),
  ::view-transition-new(.slide-back) {
    animation: none;
  }
}
```

Now, when the user selects New Park Opens, the list slides out to the left as the article view slides in from the right. When the user selects Back, the article view slides out to the right as the list slides in from the left.

The shared park image continues to glide and expand smoothly between views because its boundary defines its own transition name independently of the slide classes.

---

## PRINCIPLE | `<ViewTransition>` around `<Suspense>`: the loading line cross-fades into the text, and the shared image stays outside

> [!PRINCIPLE]
> **Principle 6: The Loading Line Cross-Fades into the Article Text: Where the Boundary Sits Decides the Animation**
>
> *A `<ViewTransition>` around a `<Suspense>` boundary cross-fades the fallback into the content as one update; a `<ViewTransition>` inside each animates them as an exit and an enter; a boundary that holds the shared image stops the shared element transition.*
>
> The reveal of a `<Suspense>` boundary is a trigger of its own, so the loading line can fade into the text after the change of screen is over. The place of the boundary matters. When the named image sits inside a new boundary, it arrives only after the fallback, too late to pair with the image that left. Keep everything that must travel outside the boundary.
>
> **DO THIS:**
> ```jsx
> <ArticleImage article={article} size="large" />
> ~<ViewTransition>~ {/* Only the text waits: the image still grows from the list */}
>   <Suspense fallback={<p>Loading article...</p>}><ArticleText article={article} /></Suspense>
> </ViewTransition>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~<Suspense fallback={<p>Loading article...</p>}>~ {/* **WRONG:** the named image arrives after the fallback, so no pair forms */}
>   <ArticlePage article={article} onBack={handleBack} />
> </Suspense>
> ```

### The article text now loads from the server

In production applications, master lists typically load only summaries and thumbnails. Full article text is fetched asynchronously from the server upon request. The ArticlePage component should display a temporary loading indicator below the hero image while fetching content.

> [!DEFINITION]
> **Suspense and use.** [REVIEW] The `use` API reads the resolved value of a Promise directly inside component render logic. While the Promise remains pending, the component suspends, prompting React to display the `fallback` UI of the nearest parent `<Suspense>` boundary. When the Promise resolves, React renders the loaded component in place of the fallback. This transition is known as a Suspense reveal (Lesson 71).

The article text is moved into an asynchronous data helper. The `fetchText` function caches Promises by article identifier, simulating a one second network latency:

```js title="src/data.js"
const texts = {
  1: 'The park on Main Street opens at noon.',
  2: 'The library stays open until nine tonight.',
};

const cache = new Map();

export function fetchText(id) {
  if (!cache.has(id)) {
    cache.set(id, new Promise(resolve => {
      setTimeout(() => resolve(texts[id]), 1000);
    }));
  }
  return ~cache.get(id)~; // The same Promise every time for the same article
}
```

A dedicated component reads the article text using `use`:

```jsx title="src/ArticleText.jsx"
import { use } from 'react';
import { fetchText } from './data.js';

export default function ArticleText({ article }) {
  const text = ~use(fetchText(article.id))~; // Suspends until the text arrives
  return <p>{text}</p>;
}
```

The ArticlePage component wraps the text component in `<Suspense>`, placing a `<ViewTransition>` boundary around it:

```jsx title="src/ArticlePage.jsx" good="11,15"
import { ViewTransition, Suspense } from 'react';
import ArticleImage from './ArticleImage.jsx';
import ArticleText from './ArticleText.jsx';

export default function ArticlePage({ article, onBack }) {
  return (
    <article>
      <button onClick={onBack}>Back</button>
      <ArticleImage article={article} size="large" />
      <h1>{article.title}</h1>
      ~<ViewTransition>~ {/* Cross-fades the loading line into the text */}
        <Suspense fallback={<p>Loading article...</p>}>
          <ArticleText article={article} />
        </Suspense>
      </ViewTransition>
    </article>
  );
}
```

When the user selects New Park Opens, the article view slides in immediately and the hero image expands into place, displaying the loading message beneath the headline:

```page width=full caption="The article page right after the tap, while the article text is still loading."
line: [Back]
line: 🌳
heading: New Park Opens
line: Loading article...
```

One second later, the loading indicator fades out smoothly as the full article text fades in:

```page width=full caption="The same page after the text arrives and cross-fades in."
line: [Back]
line: 🌳
heading: New Park Opens
line: The park on Main Street opens at noon. | good
```

This sequence illustrates the third trigger: a `<Suspense>` boundary revealing content. When a pending boundary finishes loading, React automatically triggers the surrounding `<ViewTransition>` to animate the reveal.

### The type of the tap does not reach the reveal

The React documentation notes that Transition Types reset after every DOM commit. When the user navigates, the initial transition commit applies the `'nav-forward'` type to display the fallback. However, the subsequent reveal occurs in a separate asynchronous commit where the type is reset.

Because the reveal commit carries no transition type, directional slide classes do not apply to it. The loading message cross-fades into the text using the default browser animation.

React also synchronizes asset loading before initiating view transitions. The framework pauses for up to 500 milliseconds for new web fonts to load, and ensures wrapped images finish loading before capturing snapshots. This coordination ensures incoming views do not render partially during animations.

### VS | Around the boundary vs. inside the fallback and the content: one update, or an exit and an enter

Developers can position `<ViewTransition>` boundaries relative to `<Suspense>` in two ways. Both approaches manage the same loading indicator and body text, differing only in boundary placement.

```jsx title="ViewTransition around the Suspense boundary"
~<ViewTransition>~ {/* One ViewTransition holds the loading line first and the text after */}
  <Suspense fallback={<p>Loading article...</p>}>
    <ArticleText article={article} />
  </Suspense>
</ViewTransition>
```

```jsx title="ViewTransition inside the fallback and inside the content"
<Suspense fallback={<ViewTransition><p>Loading article...</p></ViewTransition>}>
  ~<ViewTransition>~ {/* A second ViewTransition, with its own name, holds only the text */}
    <ArticleText article={article} />
  </ViewTransition>
</Suspense>
```

While both patterns animate the swap between fallback and content, their underlying execution models differ:
- **With a single `<ViewTransition>` wrapping `<Suspense>`**, React treats the swap as an in-place update. Both states share the identical transition identifier, resulting in a default cross-fade.
- **With separate `<ViewTransition>` boundaries inside fallback and content**, React handles them as two distinct boundaries. The fallback triggers an `exit` animation while the content triggers an `enter` animation.

The second pattern is advantageous when you need independent directional animations, such as sliding the loading indicator downward while sliding the article text upward.

### One `<Suspense>` around the whole article page

**Architectural hazard: wrapping the entire article view inside `<Suspense>` breaks the shared element transition for the image.**

A developer might intuitively wrap the entire slow component tree in a single `<Suspense>` boundary:

```jsx title="src/App.jsx" startLine="26"
{article ? (
  ~<Suspense fallback={<p>Loading article...</p>}>~ {/* **WRONG:** the large named image now waits behind the fallback */}
    <ArticlePage article={article} onBack={handleBack} />
  </Suspense>
) : (
  <Home articles={articles} onOpen={handleOpen} />
)}
```

Here is why this placement destroys the shared element transition:
1. The navigation transition unmounts the list view, removing the small thumbnail named `article-1`.
2. Because the article text is pending, the parent Suspense boundary displays its fallback UI immediately.
3. The ArticlePage component, including the large image named `article-1`, is deferred and does not mount during this commit.
4. The outgoing name `article-1` left the DOM, but no matching incoming name `article-1` arrived in the same commit. No shared pair can form.
5. When the article text resolves later, the hero image and body text appear abruptly without animation.

The documentation explains this limitation directly: if an unmounting element is followed by a Suspense fallback before the new named element mounts, no shared element transition can occur.

The browser console reports no error. The shared animation simply fails to run. The solution is to preserve `<ArticleImage>` outside the Suspense boundary, isolating `<Suspense>` strictly around the asynchronous text component.

Always remember: elements participating in shared transitions must remain outside deferred Suspense boundaries.

---

## All 6 Principles Together

### The complete files

Here is the finished App component. Both navigation handlers initiate Transitions with semantic types, and a single `<ViewTransition>` boundary coordinates the views:

```jsx title="src/App.jsx"
import { ViewTransition, startTransition, addTransitionType, useState } from 'react';
import Home from './Home.jsx';
import ArticlePage from './ArticlePage.jsx';
import { articles } from './articles.js';
import './App.css';

export default function App() {
  const [article, setArticle] = useState(null);

  function handleOpen(next) {
    ~startTransition~(() => { // Principles 1 and 2: a Transition, so React calls the browser
      addTransitionType('nav-forward');
      setArticle(next);
    });
  }

  function handleBack() {
    startTransition(() => {
      ~addTransitionType('nav-back')~; // Principle 5: going back slides the other way
      setArticle(null);
    });
  }

  return (
    <ViewTransition ~default={{ 'nav-forward': 'slide-forward', 'nav-back': 'slide-back' }}~> {/* Principles 4 and 5: one class per type */}
      {article ? (
        <ArticlePage article={article} onBack={handleBack} />
      ) : (
        <Home articles={articles} onOpen={handleOpen} />
      )}
    </ViewTransition>
  );
}
```

The list screen:

```jsx title="src/Home.jsx"
import ArticleImage from './ArticleImage.jsx';

export default function Home({ articles, onOpen }) {
  return (
    <section>
      <h1>News</h1>
      <ul>
        {articles.map(article => (
          <li key={article.id}>
            <button onClick={() => onOpen(article)}>
              ~<ArticleImage article={article} size="small" />~ {/* Principle 3: the small side of the pair */}
              {article.title}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

The article screen:

```jsx title="src/ArticlePage.jsx"
import { ViewTransition, Suspense } from 'react';
import ArticleImage from './ArticleImage.jsx';
import ArticleText from './ArticleText.jsx';

export default function ArticlePage({ article, onBack }) {
  return (
    <article>
      <button onClick={onBack}>Back</button>
      ~<ArticleImage article={article} size="large" />~ {/* Principle 6: outside the Suspense boundary */}
      <h1>{article.title}</h1>
      <ViewTransition>
        <Suspense fallback={<p>Loading article...</p>}>
          <ArticleText article={article} />
        </Suspense>
      </ViewTransition>
    </article>
  );
}
```

The shared image, and the article text:

```jsx title="src/ArticleImage.jsx"
import { ViewTransition } from 'react';

export default function ArticleImage({ article, size }) {
  return (
    <ViewTransition ~name={`article-${article.id}`}~> {/* Principle 3: one name per article */}
      <img className={size} src={article.image} alt="" />
    </ViewTransition>
  );
}
```

```jsx title="src/ArticleText.jsx"
import { use } from 'react';
import { fetchText } from './data.js';

export default function ArticleText({ article }) {
  const text = ~use(fetchText(article.id))~; // Principle 6: suspends, then the reveal cross-fades
  return <p>{text}</p>;
}
```

The articles no longer carry their text:

```js title="src/articles.js"
export const articles = [
  { id: 1, title: 'New Park Opens', image: '/park.jpg' },
  { id: 2, title: 'Library Opens Late', image: '/library.jpg' },
];
```

The stylesheet manages layout dimensions, directional keyframes, and reduced motion overrides:

```css title="src/App.css"
.small {
  width: 48px;
}

.large {
  width: 100%;
}

::view-transition-old(.slide-forward) {
  animation: slide-out-left 300ms ease-out;
}
::view-transition-new(.slide-forward) {
  animation: slide-in-right 300ms ease-out;
}
::view-transition-old(.slide-back) {
  animation: slide-out-right 300ms ease-out;
}
::view-transition-new(.slide-back) {
  animation: slide-in-left 300ms ease-out;
}

@keyframes slide-in-right { from { transform: translateX(100%); } }
@keyframes slide-out-left { to { transform: translateX(-100%); } }
@keyframes slide-in-left { from { transform: translateX(-100%); } }
@keyframes slide-out-right { to { transform: translateX(100%); } }

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(.slide-forward),
  ::view-transition-new(.slide-forward),
  ::view-transition-old(.slide-back),
  ::view-transition-new(.slide-back) {
    animation: none;
  }
}
```

The data helper remains identical to Principle 6.

### How React renders the news app

When the page loads, `article` evaluates to `null`. React renders the App component followed by the Home component. The Home component renders an ArticleImage instance for each row. When the user selects a row, React renders ArticlePage and its hero ArticleImage immediately, while ArticleText suspends behind its boundary:

```tree caption="The order in which React renders the news app, on page load and after the user taps New Park Opens."
`App` [1. Rendered first] | Holds `article`, which starts as `null`
- +`<ViewTransition>` around both screens [`default`] | Animates the change of screen as an **update** with **slide-forward** or **slide-back**
  - +`Home` [2. On page load] | The list screen
    - +`ArticleImage` [3. Once per row] | Small images named **article-1** and **article-2**
  - +`ArticlePage` [4. After the tap] | The article screen
    - +`ArticleImage` [5. Rendered next] | Large image named **article-1**: pairs with the row that left
    - +`<ViewTransition>` with `<Suspense>` [6. `ArticleText` waits] | Shows **Loading article...**, then **cross-fades** to the text
```

What the user sees after one tap on New Park Opens:

```page width=full caption="The finished article page after the slide, the growing park image, and the cross-fade of the text."
line: [Back]
line: 🌳
heading: New Park Opens
line: The park on Main Street opens at noon. | good
```

| Aspect | Without the rule | With the rule |
| :--- | :--- | :--- |
| **The trigger** | A plain setter: the screen cuts, with no error | A setter inside `startTransition`: the screens animate |
| **Who animates** | Our own `document.startViewTransition`: the `<ViewTransition>` never takes part | React calls `startViewTransition`, and the browser runs the animation |
| **The image** | No `name`, or one fixed `name` for every row and two Console errors | The same `name` from the `id` on both images: the image moves and grows |
| **The style** | CSS on generated names, and full motion for every user | A View Transition Class on the prop, and `prefers-reduced-motion` |
| **The direction** | One slide class, so going back looks like going forward | `addTransitionType` and one class per type |
| **The loading text** | One `<Suspense>` around the whole page: the image no longer travels | `<ViewTransition>` around a `<Suspense>` that holds only the text |

Remember the central thesis of this lesson: `<ViewTransition>` declares what may animate, while `startTransition` dictates when. React synchronizes with the browser at the precise commit moment, and the browser executes the visual transition.

---

## For the Interview

> **The Interview Question:** How do you animate between two screens with ViewTransition?

### How to Answer Clearly in 30 Seconds

"I wrap the dynamic UI boundary in `<ViewTransition>`, imported from `react`, and execute the navigation state update within `startTransition`. The `<ViewTransition>` component declares what may animate, while a concurrent trigger dictates when the animation runs. React supports three triggers:
1. **A Transition**, initiated by `startTransition` or a router navigating within a Transition.
2. **A `<Suspense>` reveal**, occurring when a pending fallback resolves to final content.
3. **A deferred value update** via `useDeferredValue`.

Standard state setters bypass animation coordination, causing the screen to cut immediately. Under the hood, React applies temporary `view-transition-name` properties to participating DOM elements and calls the browser's native `document.startViewTransition` API during the DOM commit phase. We never invoke the browser method directly. By default, the browser executes a smooth cross-fade between snapshots.

To create shared element transitions, such as expanding a list thumbnail into a detail hero image, I assign matching `name` props derived from entity identifiers to both elements. I customize animations using View Transition Classes, always providing `@media (prefers-reduced-motion)` overrides to respect user accessibility preferences."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"I wrapped my app in `<ViewTransition>`, and nothing animates. Why?"**
   Because the state update was executed as an urgent update rather than a Transition. The React documentation clarifies that standard state setters update immediately and do not activate `<ViewTransition>`. Animations require an explicit concurrent trigger: a Transition, a Suspense reveal, or a deferred value. The solution is wrapping the state update or router navigation in `startTransition`. Another subtle pitfall involves browser back button events: React skips view transitions during popstate events unless managed by a modern router utilizing the Navigation API.
2. **"How do you make a thumbnail in a list grow into the large image on the detail page?"**
   I wrap both elements in `<ViewTransition>` boundaries configured with identical `name` props derived from unique entity IDs. When a Transition unmounts the list thumbnail and mounts the detail image, React links them as a shared pair, and the browser interpolates their position and scale. Three hazards break this behavior:
   1. **Duplicate mounted names.** If multiple elements share the same transition name simultaneously, React logs console warnings and the transition fails.
   2. **Elements outside the viewport.** If either the mounting or unmounting element sits outside the visible viewport, the browser cannot pair them.
   3. **Deferred mounting behind Suspense.** If the incoming element is delayed behind a Suspense fallback, the transition window closes before it mounts, aborting the shared animation.
3. **"How do you make going back animate differently from going forward?"**
   Inside `startTransition`, I invoke `addTransitionType` with a descriptive string like `'nav-back'` or `'nav-forward'`. On the `<ViewTransition>` boundary, I provide an object to props like `default`, mapping each transition type to a dedicated CSS class. React applies the matching class during the commit. Because transition types reset after each commit, subsequent Suspense reveals do not inherit navigation types. For complex animations requiring programmatic control, `<ViewTransition>` also provides JavaScript callbacks including `onEnter`, `onExit`, `onUpdate`, and `onShare` powered by the Web Animations API.

```tree dir=right caption="Interview comparison: a plain setter, the browser API called by hand, and ViewTransition with a Transition."
Three ways to change the screen in a React app
- !A plain setter | Not a trigger | The screen **cuts**, with **no error**
- !`document.startViewTransition` by hand | Runs **outside React's timing** | The `<ViewTransition>` **never takes part**
- +`<ViewTransition>` with `startTransition` | React calls **`startViewTransition`** at the right moment | The browser **cross-fades**, and a shared `name` makes the image **move and grow**
```
