# Lecture 115: How a Server Page Hands Finished Slides to a Client Carousel

*(How does a Client Component show a slide that only the server can make?)*

> INTERVIEW QUESTION | ❱ CORE | How do you pass server-rendered children into a Client Component?

---

## VS | Importing the Slide in the Client File vs. Passing It as JSX in a Prop: only the prop keeps the slide on the server

> An interactive reviews carousel requires a click handler that executes only in the browser, alongside review slides that query private databases on the server. **A Client Component never imports a Server Component, but it can render one through composition when an enclosing Server Component passes the element as a prop**. The Client Component receives only the finished rendered output, ensuring that server data queries and secret credentials remain safely on the server.

Consider how an interactive carousel works in traditional web architecture without client frameworks. The backend server queries customer reviews from the database and writes three slide elements into the initial HTML document. In the browser, a lightweight script cycles visibility between those existing elements whenever the user clicks a button. The client script never connects to the database. It merely swaps between finished slides that the server already produced:

```js title="Plain JavaScript: the server already wrote the three slides into the HTML"
const slides = ~document.querySelectorAll('.slide')~; // The three slides the server printed into the page
let index = 0;
nextButton.addEventListener('click', () => {
  slides[index].hidden = true;
  index = (index + 1) % slides.length;
  ~slides[index].hidden = false~; // Shows the next slide: no trip to the database
});
```

React divides duties across the network boundary using components in the exact same pattern. The review slide is an asynchronous Server Component that queries the database directly on the server. The carousel container is an interactive Client Component that tracks the active slide index in local state. A parent page component, also executing on the server, composes the tree by passing the slide element into the carousel:

```jsx title="App.jsx, a Server Component" startLine="1"
import Carousel from './Carousel';
import ReviewSlide from './ReviewSlide';

export default function App() {
  return (
    <Carousel>
      ~<ReviewSlide id={1} />~ {/* App writes the tag, so ReviewSlide runs on the server */}
    </Carousel>
  );
}
```

```jsx title="Carousel.jsx, a Client Component" startLine="1"
'use client';

export default function Carousel({ ~children~ }) { // Holds what ReviewSlide returned, not ReviewSlide itself
  return <section>{children}</section>;
}
```

This composition uses familiar JSX element syntax. Placing `ReviewSlide` between the tags of the carousel passes the element directly into `children`. This follows standard component nesting, identical to passing a badge element into an article card container (Lesson 09).

Because the slide sits inside a Client Component in JSX, you might assume that `ReviewSlide` executes in the browser. **It may look the same, but it is NOT the same thing!** `ReviewSlide` executes entirely on the server. You saw this principle in Lesson 106 with static article text nested inside an expandable client container. In this architecture, the nested element is a full component querying a database. Three concrete rules explain why it runs on the server:
1. **The client carousel file never imports the slide file.** The server page imports `ReviewSlide` and instantiates the JSX tag. Only files imported by a file marked with `'use client'` become part of the client bundle (Lesson 106).
2. **React executes the server component before the client component renders.** React evaluates `ReviewSlide` on the server before the carousel ever runs in the browser. React documentation confirms that the server component is fully executed before the client wrapper begins rendering.
3. **The carousel receives only rendered output.** What arrives in `children` is the finished element tree holding the review data. The underlying component function never leaves the server, because client components receive only the rendered output of server components passed through props.

```tree caption="Where ReviewSlide sits on the screen vs. which file imports it: the import decides where it runs."
Where does `ReviewSlide` run?
- +On the screen [`<Carousel><ReviewSlide id={1} /></Carousel>`] | `ReviewSlide` sits **inside** `Carousel` | It **looks like** browser code, but this does not decide where it runs
- +In the imports [`import ReviewSlide` in `App.jsx`] | `App`, a Server Component, **imports it and writes its tag** | `ReviewSlide` **runs on the server**, and `Carousel` gets **only its output**
```

Here is the one sentence to keep in mind for this whole lesson:

**Where a component runs depends on which file imports it, not on where its tag sits on the screen. The Server Component writes the slide's tag, and the Client Component receives the finished slide.**

> [!DEFINITION]
> **Server Component and Client Component.** [REVIEW] Server and Client Components split rendering responsibilities between the backend environment and the browser.
> 1. A file with no directive defines Server Components: they run exclusively on the server, can be declared `async` to query databases, and send only rendered UI output to the browser.
> 2. A file beginning with `'use client'` defines Client Components: their source code is bundled and shipped to the browser, allowing them to manage local state and attach event handlers.
> 3. Server Components cannot use interactive React Hooks, and Client Components cannot be declared as `async` functions (Lesson 108).
>
> A Server Component executes during the server render phase and sends serialized HTML elements to the client. A Client Component mounts inside the browser DOM and re-renders whenever its internal state or received props change.

> [!DEFINITION]
> **The `'use client'` line follows the imports.** [REVIEW] The boundary separating server and client execution follows the module dependency graph rather than JSX layout nesting.
> 1. Placing `'use client'` at the top of a file designates that module as client-side code.
> 2. Every module imported by that client file, including all transitive dependencies down the import chain, is automatically packaged into the browser bundle.
> 3. A file with no directive remains server code when imported by a Server Component, but turns into client code if imported by a Client Component (Lesson 106).
>
> The import statement dictates where a component executes. Nesting a server component inside the JSX tags of a client component keeps it on the server, provided the client file never imports it directly.

> [!DEFINITION]
> **JSX in a prop.** [REVIEW] React components accept rendered elements through props, enabling flexible component composition.
> 1. Passing JSX elements between the opening and closing tags of a component assigns them to the implicit `children` prop: `<ArticleCard><LiveBadge /></ArticleCard>`.
> 2. You can also pass JSX elements through explicit named props: `header={<LiveBadge />}` or `slides={[<Slide />]}`.
> 3. The parent component creates and evaluates the element, while the child component merely decides where to position that output in its rendered markup (Lesson 09).
>
> The receiving component does not alter the passed elements. It renders them as-is, allowing layout containers to wrap content without knowing the internal implementation of the wrapped components.

> [!DEFINITION]
> **What can travel from the server to the browser.** [REVIEW] Passing data across the server-client boundary requires values to be serializable by React's wire protocol.
> 1. When a Server Component renders a Client Component, React serializes the passed props into a stream on the server and deserializes them in the browser.
> 2. Primitive values, arrays, plain objects, and rendered JSX elements cross this boundary cleanly.
> 3. Standard JavaScript functions cannot cross the network boundary because functions represent executable code rather than serializable data (Lesson 107).
>
> The server evaluates any component tags passed as props into finished element descriptions before transmission. The browser receives the evaluated UI tree, never the original server function.

### Where Readers Usually Go Wrong

Developers working with Server Components typically run into three common architectural mistakes, each directly visible in the store interface:
1. **They import the slide component directly into the client carousel file.** Because the carousel displays the slides, developers assume the carousel must import them. Once client hydration runs, the carousel vanishes from the screen, and the developer console logs an uncaught runtime error.
2. **They attempt to index children directly with `children[index]`.** When testing with multiple reviews, `children` resolves to an array. With a single review, `children` contains a solitary element rather than an array. Accessing position zero returns `undefined`, leaving the carousel completely empty.
3. **They pass a `renderSlide` callback function from the server.** Render props work seamlessly in single-process browser components (Lesson 89). Across the network boundary, React cannot serialize raw functions, causing page rendering to fail on the server.

### Three Ways to Show Server Data in a Client Component

When a Client Component needs to render content derived from server data, you choose between three architectural approaches:
1. **Pass finished JSX elements through props.** Use `children` when inserting a single content slot. Pass a named array prop, such as `slides`, when the client component needs to index, count, or cycle through items. This approach suits complex slides containing server-only logic, database queries, or private secrets. This lesson focuses on this pattern.
2. **Pass raw data objects and construct JSX inside the Client Component (Lesson 107).** The server passes serialized data objects containing fields such as author names and review text. This fits simple presentation elements without server-only dependencies. Every data field sent crosses the network and joins client memory.
3. **Import a neutral component file without directives directly into the client file (Lesson 106).** The imported component is transformed into client-side code during compilation. This pattern is suitable only for lightweight presentation components that require no `await` expressions, database queries, or server-only packages.

React documentation highlights the performance cost of oversized bundles: large bundle sizes take longer to download, parse, and execute, delaying how quickly the user interface becomes interactive. For our database-backed review slide, the third approach fails entirely, as demonstrated in Principle 3.

## SECTION | The Reviews Carousel on a Product Page

Consider a product detail page in an online store, such as a catalog entry for running shoes. Below the product gallery, customer feedback appears inside an interactive review carousel. The carousel displays a single review at a time, a progress label showing the active position, and a Next button:

```page caption="The reviews carousel when the user opens the product page."
url: shop.example.com/running-shoes
line: Fits perfectly.
line: Anna
line: 1 of 3
line: [Next]
console: quiet
```

The product catalog contains three customer reviews:
1. `Anna`: `Fits perfectly.`
2. `Ben`: `Runs a bit small.`
3. `Mia`: `Great for running.`

The application structure consists of four files:

```files title="shop: the reviews carousel" caption="The four files of the reviews carousel: the database stand-in, two Server Components, and one Client Component."
src/
  db.js | stand-in | Simulates a database store and exports `db.reviews.get(id)`
  ReviewSlide.jsx | Server Component | An `async` function that awaits one review and returns its text and author
  Carousel.jsx | Client Component | Starts with `'use client'`; keeps `index` in state and shows one slide with a `Next` button
  App.jsx | Server Component | Imports `ReviewSlide` and `Carousel`, and passes three slides to `Carousel`
```

Only the carousel component file begins with `'use client'`. The remaining three files execute entirely within the server runtime. In a production system, the page component fetches review identifiers dynamically from a product record in the database. In our example, `App` supplies explicit identifiers to keep the sample concise and focused.

**PRINCIPLES:** A Client Component displays server-rendered content safely by receiving pre-rendered JSX elements through props. Four core architectural principles govern this pattern:
1. **`slides` as an array prop: the server renders every slide, and the carousel only picks one.** `Carousel` manages the visible index in client state and cycles through finished element trees.
2. **`children[index]`: with one review, the carousel shows nothing.** The `children` prop carries server elements identically to named props, but its structural shape changes based on element count.
3. **`import ReviewSlide` in a `'use client'` file: the slide becomes browser code, and the carousel disappears.** An async component cannot execute on the client runtime.
4. **`renderSlide` as a prop: a function cannot travel from the server to the browser.** Server Components must transmit evaluated element trees rather than factory functions.

---

## PRINCIPLE | `slides` as an array prop: the server renders every slide, and the carousel only picks one

> [!PRINCIPLE]
> **Principle 1: An Array of Finished Slides: The Server Renders Them, the Carousel Picks One**
>
> *When a Client Component must show content made from server data, the Server Component above it writes that content as JSX and passes it in a prop; when the Client Component picks among several pieces, the prop is an array.*
>
> The carousel requires click handling, which operates exclusively in the browser, while individual slides require database queries, which run only on the server. The server executes its work first by evaluating every slide into finished markup. The carousel then performs its client task: tracking the active slide index in state and cycling between pre-rendered slides. The slide component code and database queries never enter the browser bundle.
>
> **DO THIS:**
> ```jsx
> export default function App() {
>   return <Carousel ~slides~={[<ReviewSlide key={1} id={1} />, <ReviewSlide key={2} id={2} />]} />; // The server renders both slides
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function App() {
>   return <Carousel ~reviews={reviews}~ />; // **WRONG:** Carousel.jsx must now build each slide, so the slide's code ships to every shopper
> }
> ```

### VS | One Piece of JSX in a Prop vs. Three Pieces in an Array: the same idea, a longer list

A carousel presents a single active slide while displaying the total count of available slides. Consequently, `Carousel` requires its slides as an indexed list that it can count and select by numeric position. `App` supplies this list through an explicit named prop formatted as a standard JavaScript array:

```jsx title="One piece of JSX in a named prop, and three pieces in an array"
<ArticleCard ~header={<LiveBadge />}~ /> {/* Lesson 09: one piece of JSX in a named prop */}
<Carousel ~slides={[<ReviewSlide key={1} id={1} />, <ReviewSlide key={2} id={2} />, <ReviewSlide key={3} id={3} />]}~ /> {/* Three pieces of JSX in one array */}
```

**Yes, it is the exact same thing!** Both patterns pass JSX elements into named props. The array merely holds three elements instead of one. It is a standard JavaScript array, and React documentation explicitly confirms that you can pass an array directly as a prop. Just like items rendered in a dynamic list, each element in the array must receive a unique `key` prop so React can maintain item identity (Lesson 18).

This array travels across the network boundary cleanly because every value stored inside it is serializable. React permits passing iterables containing serializable values as well as React component elements across the boundary. The JSX element tags evaluate to those serializable element objects on the server before transmission.

Why pass an explicit array prop instead of using `children` as in the introductory example? Because `children` does not guarantee an array data structure. Principle 2 demonstrates the exact failure that occurs when relying on `children`.

### The Whole Page

The database module simulates a database store, returning a review record for each requested identifier:

```js title="src/db.js" startLine="1"
const reviews = [
  { id: 1, author: 'Anna', text: 'Fits perfectly.' },
  { id: 2, author: 'Ben', text: 'Runs a bit small.' },
  { id: 3, author: 'Mia', text: 'Great for running.' },
];

const db = {
  reviews: {
    async get(id) {
      return reviews.find(review => review.id === id); // Plays a real database: answers with one review
    },
  },
};

export default db;
```

`ReviewSlide` is an asynchronous Server Component that awaits the review record from the database and returns structured markup:

```jsx title="src/ReviewSlide.jsx" startLine="1"
import db from './db';

export default ~async~ function ReviewSlide({ id }) { // No directive: a Server Component
  const review = ~await~ db.reviews.get(id); // Reads the database on the server
  return (
    <div>
      <p>{review.text}</p>
      <p>{review.author}</p>
    </div>
  );
}
```

`Carousel` is the sole Client Component. It tracks the active slide index in local component state and renders the currently selected slide:

```jsx title="src/Carousel.jsx" startLine="1"
'use client';

import { useState } from 'react';

export default function Carousel({ ~slides~ }) { // The array App wrote on the tag
  const [index, setIndex] = useState(0);
  const next = () => setIndex((index + 1) % slides.length); // After the last slide, back to 0
  return (
    <section>
      {~slides[index]~} {/* One finished slide out of three */}
      <p>{index + 1} of {slides.length}</p>
      <button onClick={next}>Next</button>
    </section>
  );
}
```

`App` imports both components, instantiates the three slide tags, and passes the resulting array to `Carousel`:

```jsx title="src/App.jsx" startLine="1"
import Carousel from './Carousel';
import ReviewSlide from './ReviewSlide';

export default function App() {
  return (
    <Carousel ~slides~={[ // Three slides, rendered on the server before Carousel starts
      <ReviewSlide key={1} id={1} />,
      <ReviewSlide key={2} id={2} />,
      <ReviewSlide key={3} id={3} />,
    ]} />
  );
}
```

Each slide element assigns its review identifier to the `key` prop. React validates keys inside element arrays on the server just as it does in the browser. Omitting the keys leaves carousel navigation functional, but React logs a server warning to the browser console: each child in a list should have a unique key prop.

```page caption="The reviews carousel when the user opens the product page."
url: shop.example.com/running-shoes
line: Fits perfectly.
line: Anna
line: 1 of 3
line: [Next]
console: quiet
```

### Three Tags, and One Review on the Screen

**`App` instantiates three `<ReviewSlide>` tags, yet the screen displays only a single review. Even so, the server evaluates all three components before sending HTML to the browser, pre-rendering even the slides that are initially hidden.** Here is the exact execution timeline when the browser requests the page:
1. On the server, React renders `App` and encounters the three slide elements assigned to the `slides` prop.
2. React executes all three `ReviewSlide` components. Each component queries its review from the database and produces a rendered `<div>` tree.
3. Once the server finishes evaluating the slides, React initializes `Carousel`. Its `slides` prop contains three evaluated element trees.
4. The browser loads the page and hydrates `Carousel`, displaying `slides[0]` with Anna's review and the progress label 1 of 3.

When the user clicks Next, the state updater advances `index` to 1, causing `Carousel` to re-render in the browser. The carousel immediately swaps the displayed view to `slides[1]`, revealing Ben's review. No network request takes place and the database is not queried again. `Carousel` simply selects a pre-rendered element that it already holds in client memory, mirroring the behavior of the traditional JavaScript carousel:

```page caption="After the user clicks Next once: Ben's review, already rendered on the server, takes Anna's place."
url: shop.example.com/running-shoes
line: Runs a bit small.
line: Ben
line: 2 of 3
line: [Next]
console: quiet
```

Clicking Next a third time wraps `index` back to 0, returning the view to Anna's review with the label 1 of 3.

### Where slides, id, and the Review Text Come From

1. **`slides` in `Carousel`** is the array passed to the carousel element by `App`. React assigns it to `props.slides` through standard prop transmission (Lesson 08).
2. **`id` in `ReviewSlide`** is the numerical identifier supplied on each slide element by `App` during server rendering.
3. **The review text inside `slides[index]`** originates from the backend database. `ReviewSlide` queried the record on the server and returned a rendered `<div>`. That pre-rendered element tree is what reaches the browser inside the array.

`Carousel` holds the evaluated UI output of each slide rather than the `ReviewSlide` component definition itself (Lesson 101). As React documentation confirms, only the rendered output travels to the client.

### What Reaches the Browser

Because `Carousel` receives only serialized element output, the underlying slide source code never downloads to the client. React documentation emphasizes this separation: only client modules are bundled and evaluated by the browser. In our application, this boundary keeps files partitioned:
- The carousel component file is bundled and downloaded by the client browser.
- The slide component file and the database module remain exclusively on the server.

Passing raw review objects via a `reviews` prop seems tempting, but it carries hidden costs. A developer passes the raw data and writes the slide markup inside the client carousel file. While this works, it forces the slide's rendering logic and imported formatting libraries into the client bundle. Furthermore, every property on every review object crosses the network and stays in client memory (Lesson 107). While acceptable for tiny records, this overhead expands rapidly as slide markup and data structures grow.

```tree caption="Passing finished slides vs. passing plain review data: what each sends to the browser."
Two ways to give `Carousel` its reviews
- +Finished slides [`slides={[<ReviewSlide key={1} id={1} />, ...]}`] | The server **renders every slide** | The browser gets **only the output**; `ReviewSlide.jsx` and `db.js` **stay on the server**
- !Plain data [`reviews={reviews}`] | `Carousel.jsx` **writes the slide's JSX itself** | The slide's code **joins the bundle**, and **every field** of every review reaches the browser
```

Remember: the server makes the slides, and the carousel only picks one.

---

## PRINCIPLE | `children[index]`: with one review, the carousel shows nothing

> [!PRINCIPLE]
> **Principle 2: Opaque children: children[index] Empties the Carousel When There Is One Review**
>
> *`children` carries server output into a Client Component exactly as a named prop does, but its shape is not fixed; when the Client Component picks or counts pieces, pass an array prop.*
>
> `children` is whatever the parent writes between the tags: one element, several, or none. With three slides it happens to be an array, so `children[index]` seems to work. With one slide it is the slide itself, so `children[0]` is `undefined`, and the carousel goes empty with no error. An array prop stays an array in every case.
>
> **DO THIS:**
> ```jsx
> <Carousel ~slides={[<ReviewSlide key={1} id={1} />]}~ /> {/* An array of one: slides[0] is the review */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function Carousel({ children }) {
>   return <section>{~children[index]~}</section>; // **WRONG:** with one slide, children is not an array, so nothing shows
> }
> ```

### VS | `children` vs. `slides`: the same trip from the server, a different shape

Consider standard DOM query methods like `querySelectorAll` in browser JavaScript. They always return an iterable collection, even if matching only a single element. In contrast, React does not wrap a single child in an array. When a parent passes three tags between component boundaries, `children` is an array of three elements. When the parent passes a single tag, `children` is that solitary element directly.

Here is the carousel built on `children`. `App` writes the slides between the tags:

```jsx title="App.jsx with children: the slides between the tags"
<Carousel>
  <ReviewSlide id={1} />
  <ReviewSlide id={2} />
  <ReviewSlide id={3} />
</Carousel>
```

```jsx title="Carousel.jsx with children" startLine="5"
export default function Carousel({ ~children~ }) { // The slides App wrote between the tags
  const [index, setIndex] = useState(0);
  const next = () => setIndex((index + 1) % children.length);
  return (
    <section>
      {~children[index]~} {/* Picks one slide out of children */}
      <p>{index + 1} of {children.length}</p>
      <button onClick={next}>Next</button>
    </section>
  );
}
```

With three reviews, this carousel renders identically to the array-based version in Principle 1: Anna's review, the counter label 1 of 3, and the Next button.

Regarding transmission from the server, **yes, it is the exact same thing!** Both approaches pass JSX elements created by `App`. Both arrive at `Carousel` as pre-rendered server output.

### One Review, and the Carousel With children Goes Empty

Now consider a catalog product with only one customer review. `App` writes a single `<ReviewSlide>` tag in both versions, and the two implementations behave very differently:

::: row caption="The same product with one review: the carousel with children shows nothing; the carousel with slides shows the review."
::: col title="With children[index]" tag="one review: empty" tone=bad
```page size=mini
url: shop.example.com/trail-socks
line: 1 of | bad
line: [Next]
console: quiet
```
```jsx title="App.jsx" bad="2"
<Carousel>
  <ReviewSlide id={1} />
</Carousel>
```
No review, and the line reads `1 of`.
:::
::: col title="With slides[index]" tag="one review: shown" tone=good
```page size=mini
url: shop.example.com/trail-socks
line: Fits perfectly. | good
line: Anna
line: 1 of 1
line: [Next]
console: quiet
```
```jsx title="App.jsx" good="1"
<Carousel slides={[<ReviewSlide key={1} id={1} />]} />
```
The review shows, and the line reads `1 of 1`.
:::
:::

**The carousel using `children` displays no review and logs no console error.** Here is the exact failure sequence:
1. When a parent places a single element between component tags, `children` contains that element directly rather than an array of one item.
2. The expression `children[0]` attempts to read index `0` on a React element object. Because objects lack array indices, the property access returns `undefined`, and React renders nothing.
3. The expression `children.length` also evaluates to `undefined` because plain objects lack a length property. Consequently, the counter label displays 1 of with a missing count.
4. Reading missing properties on JavaScript objects does not throw an exception, so the browser console remains completely quiet.

`slides` remains an array in every situation because `App` explicitly created an array literal. With one review, `slides` is an array of length 1, and `slides[0]` evaluates successfully to the review element.

Examining the underlying data structure, **it may look the same, but it is NOT the same thing!** `slides` is an array because our code explicitly constructed an array. `children` becomes an array only when multiple tags happen to be present.

### Two Words From React's Docs: Hole and Opaque

React documentation uses two precise metaphors to describe `children`, and both clarify why the single-review bug occurs:
- **A hole.** React explains that a component with a `children` prop has an open slot that parent components fill with arbitrary JSX. A container component positions `children` in one location as a unified block, as our introductory wrapper did. It is not designed to unpack `children` into individual items.
- **Opaque.** In everyday language, an opaque surface cannot be seen through. React documentation treats `children` as an opaque data structure whose internal shape you must not rely on. Even if `children` happens to be an array in some renders, you should never assume it is an array or any specific data type.

```tree caption="children vs. an array prop: the same trip from the server, a different shape in the browser."
`children` vs. `slides` in a carousel
- +The trip from the server [`children` `slides`] | Both hold **JSX written by `App`** | Both reach `Carousel` **as server output**
- !`children[index]` [`<Carousel><ReviewSlide id={1} /></Carousel>`] | With one tag, `children` is **one element, not an array** | **No review**, the line reads **`1 of`**, and **no error**
- +`slides[index]` [`slides={[<ReviewSlide key={1} id={1} />]}`] | **Always an array**, because `App` made it one | The review shows with **`1 of 1`**
```

This bug frequently escapes detection during local testing. A developer tests the carousel using a mock product with three reviews, and navigation works flawlessly. Once deployed to production, a product with a single review displays an empty carousel. The robust remedy is the pattern documented in React examples: pass items as an explicit array in a named prop.

React provides utility helpers such as `Children.toArray` to normalize children into an array (Lesson 100). However, React documentation cautions that using `Children` utilities is uncommon and often produces fragile code.

Remember: `children` is a hole you place, `slides` is a list you can count.

---

## PRINCIPLE | `import ReviewSlide` in a `'use client'` file: the slide becomes browser code, and the carousel disappears

> [!PRINCIPLE]
> **Principle 3: The Boundary Follows Imports: Importing ReviewSlide Into Carousel.jsx Empties the Page**
>
> *A Client Component never imports a server component to render it; everything a `'use client'` file imports becomes client code, and an async component cannot run in the browser.*
>
> Where a component runs depends on which file imports it, not on where its tag sits on the screen. Imported by `App`, `ReviewSlide` runs on the server and reads the database. Imported by the carousel file, it becomes client code, together with `db.js`, and React stops at the first async slide.
>
> **DO THIS:**
> ```jsx
> import ReviewSlide from './ReviewSlide';
> export default function App() {
>   return <Carousel ~slides~={[<ReviewSlide key={1} id={1} />, <ReviewSlide key={2} id={2} />]} />; // App imports the slide and writes its tag
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> 'use client';
> ~import ReviewSlide from './ReviewSlide';~ // **WRONG:** ReviewSlide and db.js become client code, and the async slide fails
> ```

### Moving the Import Into the Carousel

A developer often tries to make `Carousel` self-contained. It seems cleaner for `App` to pass only raw identifiers while `Carousel` handles importing and rendering its own slides:

```jsx title="src/Carousel.jsx" startLine="1" bad="4"
'use client';

import { useState } from 'react';
~import ReviewSlide from './ReviewSlide';~ // **WRONG:** a 'use client' file imports a server component

export default function Carousel({ ids }) {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((index + 1) % ids.length);
  return (
    <section>
      ~<ReviewSlide id={ids[index]} />~ {/* Now Carousel renders the slide itself */}
      <p>{index + 1} of {ids.length}</p>
      <button onClick={next}>Next</button>
    </section>
  );
}
```

```jsx title="src/App.jsx" startLine="1"
import Carousel from './Carousel';

export default function App() {
  return <Carousel ~ids={[1, 2, 3]}~ />; // Only the ids travel now
}
```

On the screen, component hierarchy appears unchanged: `ReviewSlide` still sits visually inside `Carousel`. **It may look the same, but it is NOT the same thing!** In Principle 1, the server page imported `ReviewSlide`. Now the client carousel imports it, and that single import statement shifts `ReviewSlide` into the client bundle.

Treat an import statement as an instruction to package a dependency into the current environment. Inside a server module with no directive, an import resolves on the server. Inside a file marked with `'use client'`, an import packages the module into the JavaScript bundle downloaded by the browser.

### Why the Carousel Disappears

**The carousel completely vanishes from the rendered page, and the developer console logs an uncaught runtime error naming `ReviewSlide`.** Here is why the failure occurs, step by step:
1. Because the carousel file starts with `'use client'`, the imported slide component and the database module become client-side dependencies. React documentation confirms that adding `'use client'` at the top of a file marks that module and all its transitive dependencies as client code.
2. `ReviewSlide` is declared as an `async` function component, and asynchronous components cannot run in the browser runtime (Lesson 108). React documentation states plainly that async components are not supported on the client.
3. Initial server-rendered HTML displays the carousel layout because the server can resolve async components while streaming markup.
4. When the browser evaluates client JavaScript during hydration, React hits the async client component, halts execution with an uncaught error, and removes the carousel subtree.

```page caption="The product page once its JavaScript runs, after the import moves into Carousel.jsx: no review, no line, no Next button."
url: shop.example.com/running-shoes
empty: no carousel on the page
```

```devconsole width=full caption="The Console when Carousel.jsx imports the async ReviewSlide."
x <ReviewSlide> is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.
x Uncaught Error: An unknown Component is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding `'use client'` to a module that was originally written for the server.
! An error occurred in the <ReviewSlide> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

This misconfiguration introduces a severe security risk. The database module is bundled for client delivery. While our mock database contains three reviews, a real database module contains database clients and private connection credentials that must never reach the browser. Enforcing build boundaries to prevent sensitive server code from leaking is covered in Lesson 122.

The console error frequently misleads developers into adopting harmful workarounds. Developers sometimes remove the `async` keyword and attempt to query databases from the browser, or add `'use client'` to the slide component file. Neither change provides browser access to server databases. The correct architectural remedy is to keep the import inside the server page and pass finished elements via `slides`, as shown in Principle 1.

```tree caption="ReviewSlide imported in App.jsx vs. ReviewSlide imported in Carousel.jsx: the same place on the screen, two different places where it runs."
Who imports `ReviewSlide`?
- +`App.jsx`, a Server Component [`slides={[<ReviewSlide key={1} id={1} />, ...]}`] | `ReviewSlide` **runs on the server** and reads `db.js` | `Carousel` gets **finished slides**
- !`Carousel.jsx`, a Client Component [`import ReviewSlide` under `'use client'`] | `ReviewSlide` and `db.js` **become client code** | An **async Client Component** error, and **no carousel**
```

Remember: the import decides where a component runs, not the place of its tag.

---

## PRINCIPLE | `renderSlide` as a prop: a function cannot travel from the server to the browser

> [!PRINCIPLE]
> **Principle 4: Serializable Props: A renderSlide Function Cannot Reach the Carousel**
>
> *Across the server and client boundary, pass the rendered slides, not a function that would render them; a plain function cannot make the trip.*
>
> A render prop is a function call inside one program. When the parent runs on the server and the child runs in the browser, the function would have to travel over the network. React can send data, such as finished JSX, strings, numbers, arrays, and plain objects, but not a plain function. So the server renders every slide ahead, and the carousel picks one.
>
> **DO THIS:**
> ```jsx
> <Carousel ~slides={[<ReviewSlide key={1} id={1} />, <ReviewSlide key={2} id={2} />]}~ /> {/* Finished slides travel as data */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <Carousel ids={[1, 2]} ~renderSlide={(id) => <ReviewSlide id={id} />}~ /> {/* **WRONG:** a function cannot travel, so the page does not render */}
> ```

### VS | A Render Prop in the Browser vs. a Render Prop From the Server: the same code, two machines

Pre-rendering all three slides in advance might initially feel inefficient. A developer familiar with traditional client-side render props (Lesson 89) might prefer to render only the currently visible slide on demand. React documentation describes this exact pattern for client components: instead of producing elements for every item upfront, pass a callback that returns elements when needed. A developer might attempt to write:

```jsx title="src/App.jsx" startLine="4" bad="7"
export default function App() {
  return (
    <Carousel
      ids={[1, 2, 3]}
      ~renderSlide={(id) => <ReviewSlide id={id} />}~ // **WRONG:** a function cannot leave the server
    />
  );
}
```

In this setup, `Carousel` would invoke `renderSlide` with the active identifier to fetch each slide on demand. In single-process client code, this pattern works reliably (Lesson 89). **It may look the same, but it is NOT the same thing!**

In single-process applications, both components share the same browser memory, making the prop a simple function invocation. Across the server boundary, `App` executes on a backend server while `Carousel` runs in a remote browser. Passing the callback requires transmitting executable code across the network, which violates serialization constraints.

### Why the Page Does Not Render

**The page fails to render entirely. React halts during server rendering and throws a fatal serialization error:**

```text title="The error React throws when App passes renderSlide to Carousel"
Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.
  <... ids={[...]} renderSlide={function renderSlide}>
                                ^^^^^^^^^^^^^^^^^^^^^^
```

You can observe this fundamental boundary constraint in standard JavaScript. Serializing an object using `JSON.stringify` preserves primitive values and structures, but silently omits function properties:

```js title="Plain JavaScript: data survives JSON.stringify, a function does not"
JSON.stringify({ text: 'Fits perfectly.' }); // '{"text":"Fits perfectly."}'
JSON.stringify({ ~renderSlide: (id) => id~ }); // '{}': the function is dropped
```

React's wire format is more capable than standard JSON, but it enforces the same boundary rule. Functions represent executable logic rather than static data. React can serialize finished element trees on the server and reconstitute them in client memory (Lesson 107). But React cannot serialize arbitrary closures across the wire, throwing an explicit error when encountered. React documentation explicitly excludes functions that are not client exports or Server Functions.

The error message mentions marking functions with `'use server'`, but that directive does not solve carousel slide rendering. A function marked with `'use server'` becomes a remote Server Function. Calling that function triggers an asynchronous network request back to the server (Lesson 110). Using a Server Function to render slides would force every click of the Next button to wait for network round trips, introducing latency to basic navigation.

```tree caption="Finished slides vs. a renderSlide function passed from a Server Component to a Client Component."
What `App` passes to `Carousel`
- +Finished slides [`slides={[<ReviewSlide key={1} id={1} />, ...]}`] | **Data**: the output of each slide | React **writes it down** on the server and **rebuilds it** in the browser
- !A render prop [`renderSlide`] | **Code**: a function that would render a slide | React **cannot send it**, and **the page does not render**
```

The correct architecture is Principle 1: evaluate every slide component inside `App` and pass the finished elements through `slides`. The server reads review records once, and every click of Next swaps pre-rendered elements locally in browser memory without delay.

Remember: across the boundary, send what a function returns, never the function.

---

## All 4 Principles Together

### The Complete Code

Here is the complete reviews carousel: the simulated database store, the asynchronous slide component, the interactive client carousel, and the server page connecting them.

```files title="shop: the finished reviews carousel" caption="The finished reviews carousel: one Client Component, and everything that reads the database on the server."
src/
  db.js | stand-in | Gives `db.reviews.get(id)`, one review for each id
  ReviewSlide.jsx | Server Component | Awaits one review and returns its text and author
  Carousel.jsx | Client Component | The only file in the bundle; shows `slides[index]`, the line, and `Next`
  App.jsx | Server Component | Imports `ReviewSlide` and passes three finished slides in `slides`
```

```js title="src/db.js" startLine="1"
const reviews = [
  { id: 1, author: 'Anna', text: 'Fits perfectly.' },
  { id: 2, author: 'Ben', text: 'Runs a bit small.' },
  { id: 3, author: 'Mia', text: 'Great for running.' },
];

const db = {
  reviews: {
    async get(id) {
      return reviews.find(review => review.id === id); // Plays a real database: answers with one review
    },
  },
};

export default db;
```

```jsx title="src/ReviewSlide.jsx" startLine="1"
import db from './db';

export default ~async~ function ReviewSlide({ id }) { // Principle 3: async, so it must stay on the server
  const review = await db.reviews.get(id);
  return (
    <div>
      <p>{review.text}</p>
      <p>{review.author}</p>
    </div>
  );
}
```

```jsx title="src/Carousel.jsx" startLine="1"
'use client';

import { useState } from 'react';

export default function Carousel({ ~slides~ }) { // Principle 2: an array prop, not children; Principle 3: no slide import
  const [index, setIndex] = useState(0);
  const next = () => setIndex((index + 1) % slides.length);
  return (
    <section>
      {slides[index]}
      <p>{index + 1} of {slides.length}</p>
      <button onClick={next}>Next</button>
    </section>
  );
}
```

```jsx title="src/App.jsx" startLine="1"
import Carousel from './Carousel';
import ReviewSlide from './ReviewSlide';

export default function App() {
  return (
    <Carousel ~slides~={[ // Principles 1 and 4: finished slides, not a function
      <ReviewSlide key={1} id={1} />,
      <ReviewSlide key={2} id={2} />,
      <ReviewSlide key={3} id={3} />,
    ]} />
  );
}
```

```page caption="The finished reviews carousel when the user opens the product page."
url: shop.example.com/running-shoes
line: Fits perfectly.
line: Anna
line: 1 of 3
line: [Next]
console: quiet
```

### The Order in Which React Renders the Carousel

When a user navigates to the page, React executes `App` on the server, evaluates all slide components concurrently, and then prepares `Carousel`. In the browser, user interaction with the Next button executes purely within `Carousel`:

```tree dir=right caption="The order in which React renders the reviews carousel: the slides on the server first, then the carousel in the browser."
The order in which React renders the carousel
- +1. `App` on the server [`slides={[...]}`] | React finds **three `<ReviewSlide>` tags** | Nothing reaches the browser yet
- +2. Each `ReviewSlide` on the server [`await`] | Each slide **reads its review** and returns a `<div>` | `slides` now holds **three finished slides**
- +3. `Carousel` in the browser [`slides[index]`] | Shows **slide 0** and **`1 of 3`** | Each `Next` **swaps to a slide it already holds**
```

### Summary

| Principle | What the code does | What the user sees |
| :--- | :--- | :--- |
| **1. Finished slides in `slides`** | `App` writes three `<ReviewSlide>` tags in an array prop | One review at a time, and `Next` swaps them with no wait |
| **2. An array prop, not `children`** | `Carousel` reads `slides[index]` and `slides.length` | A product with one review still shows it, with `1 of 1` |
| **3. No slide import in `Carousel.jsx`** | Only `App.jsx` imports `ReviewSlide` | The carousel appears, and the slide's code stays off the shopper's browser |
| **4. Data, not a function** | `App` passes rendered slides, never `renderSlide` | The page renders, with no error from the server |

Remember the core rule of this lesson: **Where a component runs depends on which file imports it, not on where its tag sits on the screen. The Server Component writes the slide's tag, and the Client Component receives the finished slide.**

---

## For the Interview

> **The Interview Question:** How do you pass server-rendered children into a Client Component?

### How to Answer Clearly in 30 Seconds

"A Client Component cannot directly import a Server Component, but it can display one through component composition. A parent Server Component imports the server component, instantiates its JSX tag, and passes the evaluated element into the Client Component through a prop. That prop can be `children` for a single layout slot, or a named array prop such as `slides` when managing multiple items.
1. **Where it runs:** The nested server component executes exclusively on the server before the client component renders. The runtime boundary follows import statements rather than visual JSX nesting.
2. **What travels:** The Client Component receives serialized element output rather than the component function. Server queries, private credentials, and backend dependencies stay completely out of the client bundle.
3. **The pitfalls:** Importing a server component into a `'use client'` file forces it into the client bundle, causing async components to throw runtime errors. Indexing `children` directly fails when only one child exists, making an explicit array prop necessary. Finally, passing render callback functions fails because functions cannot be serialized across the network boundary."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Do the slides render again when the user clicks `Next`?"**
   **No.** Clicking Next increments the `index` state in `Carousel`, causing the carousel to display a pre-rendered element that already exists in client memory. React documentation notes that Server Components do not persist in client memory and cannot hold state. In client-side React, updating a parent wrapper never re-renders unchanged `children` passed from above (Lesson 58). To fetch updated server content, applications invoke Server Functions or trigger framework-level router revalidation.
2. **"Isn't rendering every slide ahead a waste?"**
   **Usually not.** The backend server queries all review records in a single database batch, while the browser receives lightweight markup without slide implementation code. Client navigation remains instantaneous without loading spinners. For large or slow datasets, applications pass promises from the server and resolve them progressively inside Client Components with the `use` Hook (Lesson 71).
3. **"When do you use `children`, and when a named prop?"**
   Use `children` when providing a single content slot that a container renders in place without inspecting its internal structure, as seen in expandable panels and layout cards. Use a named prop when providing secondary slots, such as header or footer elements (Lesson 09). Use an explicit array prop whenever a component needs to count items or access elements by numerical index, as in carousels and tab lists. Context providers also use `children` to wrap application subtrees (Lesson 116).

```tree dir=right caption="Interview summary: how a Server Component passes server-rendered content into a Client Component."
Server content inside a Client Component
- +Who writes the tag [`<Carousel slides={[<ReviewSlide key={1} id={1} />]} />`] | The **Server Component** that renders the Client Component | The server component **runs on the server first**
- +What the Client Component gets [`slides[index]`] | The **rendered output**, not the component | The slide's code **stays out of the bundle**
- !What breaks it [`import ReviewSlide` `children[index]` `renderSlide`] | A **slide import** in the client file, an **indexed `children`**, a **function prop** | An **async Client Component** error, an **empty carousel**, a page that **does not render**
```
