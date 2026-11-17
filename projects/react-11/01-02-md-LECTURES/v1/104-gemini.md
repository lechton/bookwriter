# Lecture 104: What hydrateRoot Does with the Server HTML

*(How does a finished page from the server start answering clicks?)*

> INTERVIEW QUESTION | ❱ CORE | What is hydration, and how does hydrateRoot attach interactivity?

---

## VS | Building the Page Again `createRoot` vs. Keeping the Page `hydrateRoot`: the first throws the server HTML away, the second keeps it and adds the handlers

> When the server delivers finished HTML markup, visitors see the heading and the Add to cart button immediately. However, clicking that button produces no response because static HTML cannot transmit JavaScript functions across the network. **The `hydrateRoot` method runs your components in the browser, reuses every server element, and binds your event handlers directly to those nodes**. React avoids recreating the page from scratch. As a result, the layout never flickers, and text typed into form fields remains safe.

Consider how you add an event listener in plain JavaScript. The button element already exists in the HTML document. Your script locates that existing element and attaches a listener function to it:

```js title="Plain JavaScript: the HTML gives the button, the script gives the handler"
const button = document.querySelector('button');
~button.addEventListener('click', addToCart)~; // The button was already on the page; only the handler is new
```

The HTML document supplied the DOM node. Your script provided the interactive behavior. You never destroyed the original button to replace it with a new element.

Hydration applies this exact principle across your entire React application. In Lesson 102, the server produced finished HTML for the product page. The visitor sees the complete interface right away, but the buttons remain silent. Once the client bundle finishes downloading, a single line in the client entry file initializes React:

```jsx title="src/main.jsx"
~hydrateRoot~(document.getElementById('root'), <App />); // Keeps the server's elements and attaches the handlers
```

React executes the root component in the browser to discover your tree structure. It matches the resulting virtual elements against the existing DOM nodes and attaches event listeners to them. No DOM nodes are removed, and no new DOM nodes are created.

Keep this central summary in mind throughout this lesson:

**The server provides the DOM elements, the JavaScript bundle provides the event handlers, and `hydrateRoot` joins them without rebuilding the page.**

> [!DEFINITION]
> **Hydration.** [NEW] Hydration is the process where React transforms static server-rendered HTML into an interactive web application. The server response delivers all layout elements and visible text, but lacks event listeners because HTML cannot transmit executable functions. During hydration, React executes your components on the client, matches them against the existing DOM tree, and binds event listeners directly to those nodes. The React documentation explains that hydration turns the initial HTML snapshot from the server into a fully interactive application that runs in the browser (Lesson 104).

### What the User Sees on a Slow Phone

Imagine an online store visited on a mobile phone with a congested mobile connection. The page displays four sections: an input field at the top, a product title, an Add to cart button, and a cart total. The server sends this layout as pre-rendered HTML, so the user sees the complete screen before client scripts finish loading:

```page width=text caption="The product page as the server sends it: everything is on the screen before the JavaScript arrives."
form:
  field: | Search products
heading: Blue Sneakers
line: [Add to cart]
line: Cart: 0
```

While the JavaScript bundle is still in transit across the network, the user interacts with the page. Here is the exact sequence of events:
1. The user taps the Add to cart button. Nothing happens, and the cart count remains zero because no event listener is attached yet.
2. The user taps the search input and types the word socks.
3. The browser finishes downloading the scripts, and the client entry file calls `hydrateRoot`.
4. The page remains perfectly stable, and the search field still holds socks. Now that event listeners are active, tapping Add to cart updates the cart total to one.

```page width=text caption="The same page after hydrateRoot and one more tap on Add to cart: socks is still in the search field, and the line shows Cart: 1."
form:
  field: | socks | good
heading: Blue Sneakers
line: [Add to cart]
line: Cart: 1 | good
```

**The `hydrateRoot` call never rebuilt the page.** The visual structure was already present in the browser DOM. React executed the root component on the client, recognized the existing nodes, and attached the click listener to the existing button.

Now contrast this behavior with `createRoot`, the initialization function introduced in Lesson 07:

> [!DEFINITION]
> **createRoot.** [REVIEW] `createRoot` accepts a DOM container and creates a client-side React root. Calling the `render` method on that root instructs React to construct every DOM node from your JSX and insert them into the container. When an HTML document arrives with an empty root container, this call is how the interface renders on screen (Lesson 07).

```jsx title="Two ways the entry file can start React on the same server HTML"
~createRoot~(document.getElementById('root')).render(<App />); // Deletes the server's elements and creates new ones: the search field is empty again
~hydrateRoot~(document.getElementById('root'), <App />); // Keeps the server's elements and attaches the handlers: socks stays
```

Both approaches execute your component functions inside the browser. In both scenarios, the product heading renders and the button becomes clickable. **The final interface might look identical, but the internal browser operations are radically different**. Using `createRoot` causes React to discard the existing DOM nodes and create fresh ones, wiping out user input. In contrast, `hydrateRoot` preserves the existing DOM nodes, keeping the typed text intact inside the search input.

**Why:** The user experience depends entirely on how the client entry script processes the server HTML:
1. **With `hydrateRoot`**, any user interactions that occurred before scripts loaded remain intact. This includes typed form text, active input focus, and page scroll position.
2. **With `createRoot`**, React recreates the DOM from scratch. The official documentation warns that this approach is slower, resets focus and scroll positions, and discards user input.
3. **When the initial client render disagrees with server markup**, React flags a mismatch. The documentation warns that mismatches degrade performance or attach event listeners to incorrect elements.
4. **Until hydration completes**, interactive buttons remain unresponsive. Without streaming boundaries, React hydrates the entire tree at once, meaning slow lower sections postpone interactivity for top buttons (Lessons 69 and 73).

### The Rule of Thumb: does the root already hold HTML?

**Ask one question about the root DOM node when your application boots: does it already contain server-rendered HTML markup? If it does, invoke `hydrateRoot`. If the container is completely empty, invoke `createRoot`.**

The React documentation establishes clear boundaries for both methods. Server-rendered applications must use `hydrateRoot` rather than `createRoot`. Conversely, if your application is purely client-rendered with no initial markup, the documentation notes that `hydrateRoot` is unsupported and you must call `createRoot` instead.

A senior engineer recognizes the five common misconceptions surrounding hydration:
1. **Assuming hydration rebuilds the entire DOM.** It does not. React reuses the existing DOM nodes produced by the server.
2. **Assuming React skips running components on the client.** It does not. React must execute every component function to discover the required event listeners.
3. **Retaining `createRoot` after introducing server-side rendering.** Leaving `createRoot` in place destroys the server markup and rebuilds the interface from scratch.
4. **Expecting client rendering to patch server mistakes silently.** React expects the initial client render to match the server output perfectly, treating mismatches as bugs.
5. **Expecting buttons to respond the moment they appear on screen.** Buttons only respond after the client JavaScript downloads, executes, and completes hydration.

The following sections demonstrate each of these concepts using our product page.

## SECTION | The Blue Sneakers Product Page

We continue developing the product page introduced in Lesson 102. An online shop renders this page on the server so that content appears immediately when someone opens a link. Its purchase button must become interactive as soon as client scripts finish downloading. That scenario is where engineers encounter hydration in real applications.

The implementation relies on three coordinated files:

```files title="product-page: File Explorer" caption="The three files of the product page: the server sends the HTML, App.jsx describes the page, main.jsx hydrates it."
server.js | server | Calls `renderToString(<App />)` and sends the HTML inside `<div id="root">`, unchanged from Lesson 102
src/
  App.jsx | component | Exports `App`: the search field, the title, `Add to cart`, and the `Cart` line
  main.jsx | entry | Imports `App` and calls `hydrateRoot` on `#root`
```

> [!DEFINITION]
> **renderToString.** [REVIEW] `renderToString` is a server-side method from React DOM. It executes your components on the server, evaluates their JSX, and converts the result into a static HTML string. The server injects that markup into the root element of the page response. This allows the browser to display content immediately, even though event handlers cannot be included in that HTML (Lesson 102).

Both the server runtime and the client browser execute this shared component:

```jsx title="src/App.jsx"
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <main>
      <input placeholder="Search products" />
      <h1>Blue Sneakers</h1>
      <button onClick={() => setCount(count + 1)}>Add to cart</button>
      <p>Cart: {count}</p>
    </main>
  );
}
```

The browser entry file contains the hydration call established in Lesson 102:

```jsx title="src/main.jsx"
import { ~hydrateRoot~ } from 'react-dom/client'; // The browser side of a page the server already rendered
import App from './App.jsx';

hydrateRoot(document.getElementById('root'), <App />);
```

Each portion of the interface illustrates a specific aspect of hydration in this lesson:
1. **The product heading** represents static content that hydration preserves exactly as transmitted by the server.
2. **The button and cart count** demonstrate how hydration binds event handlers to make components interactive.
3. **The search input field** proves that `hydrateRoot` protects user input while `createRoot` discards it.

Keep this central rule in mind. **The server provides the DOM elements, the JavaScript bundle provides the event handlers, and `hydrateRoot` joins them without rebuilding the page.**

**PRINCIPLES:** To an outside observer, hydration looks like an instantaneous switch where a static page becomes live. Under the hood, React executes several distinct steps. Five core principles govern this mechanism:
1. **Principle 1: hydrateRoot Runs App Again but Keeps Every Element the Server Sent.** Component functions execute in the browser, yet React creates no new DOM elements.
2. **Principle 2: onClick Reaches the Add to cart Button the Server Sent.** The server HTML provides the button element, and hydration binds the client click handler to it.
3. **Principle 3: hydrateRoot Keeps What the User Typed.** Calling `createRoot` on server HTML wipes the container, whereas `hydrateRoot` preserves form values.
4. **Principle 4: The First Browser Render Must Give the Server's Cart: 0.** React can only reuse existing DOM nodes when the client initial render matches server output.
5. **Principle 5: Without a Boundary, Add to cart Waits Until the Whole Page Is Hydrated.** Monolithic hydration processes the entire tree at once, forcing top elements to wait for bottom content.

---

## PRINCIPLE | `hydrateRoot`: `App` runs again in the browser, but React creates no new elements

> [!PRINCIPLE]
> **Principle 1: Reuse: hydrateRoot Runs App Again but Keeps Every Element the Server Sent**
>
> *During `hydrateRoot`, React calls our components in the browser and reuses every DOM node the server sent; it does not create the page again.*
>
> The server already built the page from `App`. In the browser, React calls `App` once more to learn what each element should be, compares the result with the HTML in the root, and keeps the elements it finds there. The component code runs twice, once on the server and once in the browser. The page is built once.
>
> **DO THIS:**
> ```jsx
> import { hydrateRoot } from 'react-dom/client';
> ~hydrateRoot~(document.getElementById('root'), <App />); // Calls App and keeps the server's <h1>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> import { createRoot } from 'react-dom/client';
> ~createRoot~(document.getElementById('root')).render(<App />); // **WRONG:** calls App and replaces the server's <h1> with a new one
> ```

Strip the product page down to one heading. The server sends this HTML inside the root:

```html title="The server HTML inside index.html"
<div id="root"><h1>John</h1></div>
```

In the browser, `App` returns the same heading and prints one line to the Console:

```jsx title="src/App.jsx"
export default function App() {
  ~console.log('App runs');~ // Prints each time React calls App in the browser
  return <h1>John</h1>;
}
```

```jsx title="src/main.jsx"
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

~hydrateRoot~(document.getElementById('root'), <App />); // Calls App, then keeps the <h1> already in the root
```

**The Console shows that the component ran, yet nothing on the page changes.** The heading text remains completely undisturbed.

```page width=text caption="The page after hydrateRoot: John never moved, and the Console shows that App ran in the browser."
heading: John
console:
  log: App runs | App.jsx:2
```

This behavior often surprises developers. When using `createRoot`, calling a component is what paints DOM elements onto the screen. Here, the component executed, yet React added no new DOM elements. Here is the exact breakdown of what occurred:
1. The server transmits the root container holding the heading markup, and the browser displays the text immediately.
2. The browser downloads the client bundle and invokes `hydrateRoot`.
3. React executes the component function, logging the message to the console.
4. React inspects the returned virtual element and compares it with the existing heading DOM node inside the container.
5. Because the virtual element matches the existing markup, React retains the server node without creating a new element.

The React documentation emphasizes this exact step. React hydrates the existing DOM nodes from your HTML instead of destroying and recreating them. A **DOM node** is the standard browser object representing a page element, identical to what `document.getElementById` returns in plain JavaScript. To **reuse DOM nodes** means the objects on your screen after hydration are the exact same instances created from server HTML.

When running under strict mode in development, the console may show the log message twice. Strict Mode deliberately calls component functions twice to help detect unexpected side effects. Despite the double invocation, React only performs hydration once (Lesson 14).

### One App, Two Runs

Because hydration executes component functions on the client, developers sometimes mistake it for a full second render of the page. **It is not.** One operation occurs twice, while another operation occurs only once:
- **Component functions execute twice**: once on the server to generate HTML strings, and once on the client during `hydrateRoot`.
- **The DOM is built once**: the browser constructs nodes from server HTML. On the client, React reuses those nodes instead of building new ones.

**Why must component functions run on the client at all?** The server produced only serialized HTML text. It could not serialize JavaScript closures, state hooks, or event listeners. React must execute the component code in the browser JavaScript engine to reconstruct the component tree, initialize state hooks, and extract event handler functions.

The React documentation notes that components render on the server to produce initial HTML, and render again on the client to attach event handlers. What each environment does with the component output is fundamentally different:
- **On the server**, `renderToString` converts the rendered JSX into a string of HTML text for fast initial display.
- **On the client**, `hydrateRoot` reconciles the JSX against existing DOM nodes, attaching listeners without creating elements.

```tree caption="The same App runs on the server and in the browser, but each run does something different with its result."
One `App`, two runs
- +On the server [`renderToString`] | Calls `App` | Turns the result **into HTML** that the browser shows first
- +In the browser [`hydrateRoot`] | Calls `App` **again** | Matches the result **against the HTML already there** and creates **no new elements**
```

In our product page, React inspects the server markup and identifies each expected node: the search input, heading, button, and counter. React retains all of them. From that moment onward, React assumes full management of the container DOM. Every subsequent update, such as increasing the cart count, modifies those existing nodes.

### Why This Mistake Is Common

When developers discover that component code runs again in the browser, they often draw an incorrect conclusion:
1. They assume the browser discards the server HTML and repaints the entire screen.
2. Under this false assumption, server rendering appears useless because client work seems duplicated.
3. In reality, the existing DOM elements remain untouched. This preservation is why user input remains safe in form fields, as demonstrated in Principle 3.

---

## PRINCIPLE | `onClick`: hydration attaches the handler to the button the server sent

> [!PRINCIPLE]
> **Principle 2: Attach: onClick Reaches the Add to cart Button the Server Sent**
>
> *During hydration, React attaches each `onClick` in our JSX to the matching element that came from the server; after that, a click updates that same element through state.*
>
> The server HTML holds the button but not our function, because HTML cannot carry JavaScript. Until hydration ends, a tap on the button does nothing. During `hydrateRoot`, React runs `App`, finds `onClick` on the button, and attaches it to the button already on the page. From then on, every change goes through `setCount`, as on any React page.
>
> **DO THIS:**
> ```jsx
> <button ~onClick={() => setCount(count + 1)}~>Add to cart</button> {/* Hydration attaches it; the tap changes Cart: 0 to Cart: 1 */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const root = hydrateRoot(document.getElementById('root'), <App />);
> ~root.render(<App />)~; // **WRONG:** a hydrated page changes through state, not through another root.render
> ```

Here is a minimal button containing an inline click handler, written inside our React component:

```jsx title="The button in App.jsx"
const [count, setCount] = useState(0);

<button ~onClick={() => setCount(count + 1)}~>Cart: {count}</button> {/* The function lives in our JavaScript */}
```

Here is the corresponding HTML markup generated by the server:

```html title="The server HTML for the same button"
<button>Cart: <!-- -->0</button>
```

**The code looks similar, but the capabilities are completely different.** The button inside JSX carries an `onClick` callback function. The button tag in server HTML contains no click listener at all. HTML is a textual transport format that cannot serialize active JavaScript closures. The React documentation refers to this server output as initial non-interactive markup.

The empty comment between the label and the number is placed by the server renderer. React uses these markers to separate static string literals from dynamic expressions, making text reconciliation straightforward during hydration (Lesson 102).

The button element and its event listener arrive in the browser at different times. **The button element arrives first with the HTML. Its event handler arrives later with the JavaScript bundle. Hydration is the exact moment they unite.**

```tree caption="The button reaches the browser with the HTML, and its handler reaches it with the JavaScript; hydration joins the two."
How the `Add to cart` button becomes clickable
- !The button in the server HTML [`<button>`] | Arrives **first**, with the page | Has **no handler**: a tap does nothing
- +The handler in `App.jsx` [`onClick`] | Arrives **later**, with the JavaScript | Lives in **our function**, not in the HTML
- +Hydration | React runs `App` and finds `onClick` on the button | **Attaches** our function to the button **already on the page**
```

This process mirrors the plain JavaScript pattern shown earlier. React locates the existing DOM element and attaches the callback defined in your JSX. The DOM element remains the same object throughout. Only the attached event listener is newly added.

### The First Tap and the Second Tap

Consider a visitor who taps the Add to cart button twice: once before JavaScript loads, and once after hydration completes. Here is what happens in chronological order:
1. The user taps the button before JavaScript finishes loading. The cart count remains zero because no event listener has been registered on the element.
2. The client JavaScript bundle arrives and executes `hydrateRoot`.
3. React evaluates the component JSX, finds the click listener, and binds it to the existing button element.
4. The user taps the button a second time. The state setter executes, React re-renders the component, and the paragraph updates to show Cart: 1.

Notice that the initial tap is completely lost. When the user clicked earlier, the browser had no registered event listener on that button, so the browser took no action.

```page width=text caption="The product page after hydration and one tap on Add to cart: the first tap, made before the JavaScript arrived, was not counted."
form:
  field: | Search products
heading: Blue Sneakers
line: [Add to cart]
line: Cart: 1 | good
```

Where does the initial value of zero come from on the client? It originates from the client call to `useState(0)`. The server does not serialize or transmit its internal state variables. When the component runs in the browser during hydration, `useState(0)` initializes state to zero, matching the server output. Principle 4 explores why this agreement is essential.

### Why This Mistake Is Common

A developer seeking to update the interface after hydration might attempt calling `root.render`, mimicking the client patterns from Lesson 07:

```jsx title="src/main.jsx"
const root = hydrateRoot(document.getElementById('root'), <App />);

~root.render(<App />)~; // **WRONG:** React already manages the page; changes go through state
```

The React documentation warns directly against this approach. You should not call `hydrateRoot` repeatedly or use `root.render` to push subsequent updates. From this point forward, React manages the DOM automatically. To trigger UI updates, components must call standard state setters.

---

## PRINCIPLE | `hydrateRoot` on server HTML: the text the user typed stays in the `<input>` field

> [!PRINCIPLE]
> **Principle 3: hydrateRoot vs. createRoot: hydrateRoot Keeps What the User Typed**
>
> *When the root holds server HTML, the entry file must call `hydrateRoot`; `createRoot` deletes every server element and creates new ones, which loses what the user typed and where the focus was.*
>
> The server HTML is on the screen before the JavaScript, so the user may already be typing in it. `createRoot` clears the root and builds the page again from our JSX, so the search field is a new, empty `<input>`. `hydrateRoot` keeps the elements the server sent and only attaches the handlers, so what the user did stays on the page. When the root is empty, the rule turns around: use `createRoot`.
>
> **DO THIS:**
> ```jsx
> ~hydrateRoot~(document.getElementById('root'), <App />); // The root holds server HTML: socks stays in the search field
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~createRoot~(document.getElementById('root')).render(<App />); // **WRONG:** the root holds server HTML: the field is replaced and socks is lost
> ```

Isolate the interface down to the search input field. The server transmits this root container:

```html title="The server HTML inside index.html"
<div id="root"><input placeholder="Search products"></div>
```

The root component returns a matching input element:

```jsx title="src/App.jsx"
export default function App() {
  return <input placeholder="Search products" />;
}
```

Before client scripts load, a visitor focuses the search field and types socks. The client entry script then runs. Compare what happens under the two possible initialization calls:

### VS | Deleting the Elements `createRoot` vs. Keeping the Elements `hydrateRoot`: only the second keeps socks

::: row caption="The same server HTML after createRoot and after hydrateRoot: only hydrateRoot keeps socks."
::: col title="createRoot on server HTML" tag="socks is gone" tone=bad
```page size=mini
form:
  field: | Search products | bad
```
```jsx title="src/main.jsx" bad="1"
~createRoot~(document.getElementById('root')).render(<App />); // **WRONG:** deletes the field the user typed in
```
The field is empty again, and it no longer has the focus.
:::
::: col title="hydrateRoot on server HTML" tag="socks stays" tone=good
```page size=mini
form:
  field: | socks | good
```
```jsx title="src/main.jsx" good="1"
~hydrateRoot~(document.getElementById('root'), <App />); // Keeps the field the user typed in
```
The field still holds `socks`.
:::
:::

Both entry calls mount the component tree, and on a fast machine the visual results appear similar. However, the root container is not blank when the script runs. The visitor is already interacting with the live elements inside it.

**When you call `createRoot`, React clears the container and destroys the input element that contains the user input.** Here is the step-by-step breakdown:
1. The server markup renders on screen. The visitor clicks the input field and enters socks.
2. The client bundle finishes loading, and `root.render` empties the container entirely.
3. React builds a new input DOM node based on your JSX. Because the JSX specifies no initial text, the field displays the blank placeholder.
4. The typed text disappears. Furthermore, the active input focus was bound to the destroyed node, so subsequent keystrokes land nowhere.

In terms of underlying DOM operations, calling `createRoot` on server markup behaves like this destructive assignment:

```js title="Plain JavaScript: what createRoot does to the server HTML"
~root.innerHTML = ''~; // Every element inside the root is gone, with whatever the user typed in it
```

React then constructs the entire DOM tree anew from your JSX. The React documentation explicitly cautions against this pattern: calling `createRoot` and `render` destroys all existing HTML and recreates DOM nodes from scratch. This causes slower performance, clears input focus, resets scroll positions, and loses user data.

That official warning identifies three critical pieces of user state:
1. **Focus** represents the active element currently receiving keyboard input.
2. **Scroll position** marks how far down the document the visitor has navigated.
3. **User input** includes text values, selections, and form choices entered by the visitor.

With `hydrateRoot`, React preserves the existing DOM node in place. As a consequence, both the typed text and the active keyboard focus survive intact.

```tree caption="On server HTML, createRoot replaces every element and hydrateRoot keeps them."
Starting React on a root that already holds server HTML
- !`createRoot` [`root.render`] | **Deletes** every element the server sent | Creates **new ones**: the search field is **empty**, and the focus is **gone**
- +`hydrateRoot` | **Keeps** every element the server sent | Attaches the handlers: **`socks` and the focus stay**
```

### Why This Bug Ships

This critical defect often passes QA unnoticed because it only manifests under real-world network latency:
1. An engineering team adds server-side rendering to an application that originally used `createRoot`.
2. Nobody updates the client entry file to use `hydrateRoot`.
3. In local development or over high-speed connections, scripts download instantly before visitors can interact, hiding the issue.
4. On slower mobile networks, visitors start typing before scripts arrive, only to watch their input vanish when React boots.

The React documentation summarizes the rule directly: server-rendered applications must use `hydrateRoot` rather than `createRoot`.

The reverse scenario is equally invalid. If a page arrives with an empty root container, there are no existing DOM nodes to hydrate. In that scenario, calling `hydrateRoot` is unsupported, and you must use `createRoot` instead. Modern application frameworks typically automate this choice based on your rendering configuration.

---

## PRINCIPLE | `useState(0)`: the browser's first render gives the same `Cart: 0` as the server

> [!PRINCIPLE]
> **Principle 4: Same Output: The First Browser Render Must Give the Server's Cart: 0**
>
> *Hydration reuses the server's elements only if the first render in the browser gives the same output as the server; when they differ, React reports a mismatch and builds that part again in the browser.*
>
> The server and the browser run the same `App`, so with the same first values they give the same page, and React keeps the server's elements. When the browser's first render shows something the server could not know, such as a count saved in `localStorage`, the two differ. React does not quietly paint over the server's text. It reports a hydration error and rebuilds that part of the page.
>
> **DO THIS:**
> ```jsx
> const [count, setCount] = ~useState(0)~; // Server and browser both start at 0: Cart: 0 matches
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const [count, setCount] = useState(
>   typeof window === 'undefined' ? 0 : ~Number(localStorage.getItem('cart'))~ // **WRONG:** the server gives Cart: 0, the browser gives Cart: 3
> );
> ```

Recall how React reconciles server markup during hydration. It compares the virtual element tree returned by the client component with the existing DOM nodes inside the container. React can only preserve server DOM nodes when the two representations match. **React can only reuse server DOM elements when the initial client render produces the exact same output as the server.**

Examine where the cart value originates during each rendering phase:

```jsx title="The Cart line in App.jsx"
const [count, setCount] = ~useState(0)~; // On the server and in the browser's first render, count is 0

<p>Cart: {count}</p> {/* Server: Cart: 0. Browser, first render: Cart: 0 */}
```

On the server, `useState(0)` evaluates to zero, producing HTML that displays Cart: 0. In the browser during initial hydration, `useState(0)` evaluates to zero as well. Because both environments yield identical output, React successfully adopts the server DOM nodes without modification.

The React documentation establishes this requirement explicitly: the component tree passed to `hydrateRoot` must produce the same output as it did on the server.

React enforces this requirement strictly for the benefit of user experience. The documentation notes that visitors spend time viewing the server-generated HTML snapshot before client JavaScript finishes loading. Server rendering creates the perception of fast loading. Suddenly swapping out content upon hydration breaks that perception and disrupts user trust.

```tree caption="React keeps the server's elements only when the browser's first render gives the same output as the server."
Server output vs. the browser's first render
- +Same output [`Cart: 0` and `Cart: 0`] | React **keeps** the server's `<p>` and its text | The user sees **no change**
- !Different output [`Cart: 0` and `Cart: 3`] | React reports a **hydration error** | React **builds that part again** in the browser
```

### Why a Reload Brings Back Cart: 0

**The cart count resets whenever the user reloads the page, and the hydration matching rule explains why.** Here is the sequence of events:
1. Following hydration, the visitor clicks Add to cart three times, updating the screen to Cart: 3.
2. The visitor reloads the browser tab.
3. The server renders fresh HTML starting from `useState(0)`, sending Cart: 0. Following hydration, the display remains at Cart: 0.

Component state resides in browser memory, which the server cannot access during subsequent HTTP requests. On every incoming request, the server executes `useState(0)` from scratch. The initial client render also begins from zero, satisfying the matching rule. Persisting cart values across page reloads requires storage mechanisms accessible to the server, such as session cookies (Lesson 103).

### Why This Mistake Is Common

A developer might attempt to persist cart values across reloads by reading browser local storage during component initialization. Because the server runtime lacks browser storage APIs, the developer checks for the global window object:

```jsx title="The Cart line in App.jsx"
const [count, setCount] = useState(
  typeof window === 'undefined' ? 0 : ~Number(localStorage.getItem('cart'))~ // **WRONG:** the server writes Cart: 0, the browser's first render gives Cart: 3
);
```

The developer assumes React will seamlessly overwrite the server value of zero with three on the client. While the final screen eventually shows three, the update is far from seamless:
1. The server outputs Cart: 0 because the global window object is undefined on the server.
2. The initial client render produces Cart: 3 by accessing local storage.
3. Because the outputs conflict, React cannot reuse the server DOM nodes.
4. In development, the console issues an explicit hydration error explaining that server-rendered text failed to match client output, causing React to regenerate the tree on the client.
5. React discards the server subtree and rebuilds it on the client. Without an error boundary, this forces a re-render of the entire tree, wiping out active form inputs.

The React documentation advises treating hydration mismatches as bugs that must be corrected. Discrepancies involving DOM attributes are even more problematic, as React does not guarantee that mismatched attributes will be patched. Handling client-only state properly is examined in Lesson 105.

---

## PRINCIPLE | `hydrateRoot` without a boundary: the whole page hydrates at once, so `Add to cart` waits for the slowest part

> [!PRINCIPLE]
> **Principle 5: Cost: Without a Boundary, Add to cart Waits Until the Whole Page Is Hydrated**
>
> *Hydration costs one download of the app's JavaScript and one run of every component in the browser; without a Suspense or Activity boundary, React hydrates the whole page at once, so a slow part delays every button.*
>
> The server HTML makes the page appear early, but no button answers until hydration ends. React runs every component during hydration, including the ones the user never taps. Without a boundary, it does all of them as one piece of work, so the button at the top waits for the reviews at the bottom. A `<Suspense>` or `<Activity>` boundary lets React hydrate the page in chunks. The button and its `count` go into their own component, such as `AddToCart`, so a tap does not render `App` again and does not wait for the boundary either.
>
> **DO THIS:**
> ```jsx
> <AddToCart />
> ~<Suspense>~<Reviews /></Suspense> {/* A boundary: React hydrates Reviews in its own chunk, and a tap in AddToCart answers before Reviews is done */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <button onClick={() => setCount(count + 1)}>Add to cart</button>
> ~<Reviews />~ {/* **WRONG:** no boundary around a slow part: Add to cart waits until Reviews is hydrated */}
> ```

Remember Principle 1: hydration executes every component function inside the browser. While the server generated the initial HTML markup, it did not execute this client-side reconciliation work. As a result, the visual interface appears ready before it can actually accept user interaction.

Now suppose our product page includes customer reviews below the purchase controls. These reviews render through a dedicated component:

```jsx title="src/App.jsx" startLine="3"
function Reviews() {
  return (
    <ul>
      <li>Great fit</li>
      <li>Runs small</li>
      <li>Very comfy</li>
    </ul>
  );
}
```

The main application component renders these reviews directly beneath the purchase button without an enclosing boundary:

```jsx title="src/App.jsx" startLine="13"
export default function App() {
  const [count, setCount] = useState(0);
  return (
    <main>
      <input placeholder="Search products" />
      <h1>Blue Sneakers</h1>
      <button onClick={() => setCount(count + 1)}>Add to cart</button>
      <p>Cart: {count}</p>
      ~<Reviews />~ {/* No boundary: hydrated together with the button above it */}
    </main>
  );
}
```

The server response displays the complete document at once, including the customer reviews:

```page width=text caption="The product page with its reviews, as the server sends it."
form:
  field: | Search products
heading: Blue Sneakers
line: [Add to cart]
line: Cart: 0
line: Great fit
line: Runs small
line: Very comfy
```

### Why a Button at the Top Waits for the Reviews at the Bottom

**Although the purchase button sits near the top of the viewport, it cannot process clicks until the lower reviews finish hydrating.** Here is the exact reason:
1. The server HTML renders the heading, button, and reviews immediately.
2. The client JavaScript finishes downloading, and `hydrateRoot` begins processing.
3. React executes the root component, attaches listeners to the button, and proceeds immediately through child reviews as one synchronous task.
4. If a visitor taps the purchase button while React is busy hydrating reviews, the click yields no response.
5. Interactive events cannot execute until the entire component tree completes hydration.

In this small example with three reviews, the hydration delay is negligible. In production environments with hundreds of reviews, recommendation carousels, and complex components, React must process every element before earlier buttons become functional. The React documentation notes that when React hydrates an entire page in a single pass, slow components can make user controls feel completely unresponsive.

Hydration therefore imposes two distinct performance costs:
1. **The browser downloads scripts and executes every component function again**, including non-interactive elements. Server rendering accelerated initial visual display, but did not eliminate this client computational cost (Lesson 102).
2. **Without boundaries, React hydrates the entire document synchronously**, allowing the slowest component to delay interactivity across the entire page.

### A Boundary Splits Hydration into Chunks

The solution is wrapping secondary content in a `<Suspense>` boundary. The React documentation explains that by breaking up your component tree into discrete units, Suspense allows React to hydrate your server-rendered HTML in chunks. This enables primary features to achieve interactivity as rapidly as possible. This mechanism is known as **Selective Hydration** (Lesson 151).

However, introducing a boundary alone is not sufficient in this specific setup. The cart state variable lives in the top-level component, and the boundary sits directly inside that same component. When a visitor taps the button, the state updater requests a full re-render of the parent component, which waits for the enclosed boundary. Consequently, the counter remains unchanged until all reviews hydrate.

The complete architecture extracts the button and counter into an isolated component named `AddToCart`. When the user clicks the button, only that isolated component re-renders, displaying the updated total immediately while reviews continue hydrating in the background:

```jsx title="src/App.jsx" startLine="13"
function AddToCart() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>Add to cart</button>
      <p>Cart: {count}</p>
    </>
  );
}

export default function App() {
  return (
    <main>
      <input placeholder="Search products" />
      <h1>Blue Sneakers</h1>
      ~<AddToCart />~ {/* A tap renders only AddToCart: Cart: 1 appears before Reviews is hydrated */}
      ~<Suspense>~<Reviews /></Suspense> {/* A boundary: React hydrates Reviews in its own chunk */}
    </main>
  );
}
```

```tree caption="Without a boundary, the button waits for the whole page; with a boundary around Reviews and the cart in its own component, the tap answers before Reviews is done."
How the page around `Add to cart` is hydrated
- !No boundary [`<Reviews />`] | React hydrates the **whole page at once** | A tap on `Add to cart` waits for **`Reviews` too**
- +A boundary around `Reviews` [`<Suspense>` `<Activity>`] | React hydrates the page **in chunks** | With the cart in **`AddToCart`**, `Cart: 1` appears **before `Reviews` is done**
```

### Why This Bug Ships

Teams frequently overlook this bottleneck because they evaluate the wrong performance metrics:
1. An engineering team implements server-side rendering, observing that the page displays almost instantly.
2. They focus exclusively on visual metrics like first contentful paint.
3. Visitors on resource-constrained mobile devices attempt to interact with visible buttons, experiencing frozen controls while background hydration runs.

The interface appears complete before it can process user interaction. The React documentation observes that server HTML creates an illusion of instant loading, while hydration represents the necessary work required behind that initial presentation.

---

## All 5 Principles Together

### The Complete Product Page

Here is the complete client implementation of the product page. The server configuration remains identical to Lesson 102, calling `renderToString(<App />)` and embedding the markup into the root element.

```jsx title="src/App.jsx"
import { useState, Suspense } from 'react';

function Reviews() {
  return (
    <ul>
      <li>Great fit</li>
      <li>Runs small</li>
      <li>Very comfy</li>
    </ul>
  );
}

function AddToCart() {
  const [count, setCount] = ~useState(0)~; // Principle 4: the browser starts at 0, like the server
  return (
    <>
      <button ~onClick={() => setCount(count + 1)}~>Add to cart</button> {/* Principle 2: attached to the server's button */}
      <p>Cart: {count}</p>
    </>
  );
}

export default function ~App~() { // Principle 1: called again in the browser, during hydrateRoot
  return (
    <main>
      <input placeholder="Search products" /> {/* Principle 3: the same element, so socks stays */}
      <h1>Blue Sneakers</h1>
      <AddToCart />
      ~<Suspense>~<Reviews /></Suspense> {/* Principle 5: hydrated in its own chunk */}
    </main>
  );
}
```

```jsx title="src/main.jsx"
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

~hydrateRoot~(document.getElementById('root'), <App />); // The root holds server HTML: keep it and attach the handlers
```

### How React Walks the Page During Hydration

When the client JavaScript bundle initializes, `hydrateRoot` begins at the root component and traverses elements from top to bottom. For each node, React matches the virtual element against existing server markup and retains the DOM element. When reaching interactive elements, React attaches the corresponding event listeners:

```tree caption="The order in which React calls the components of the product page during hydrateRoot, and what it does with each server element."
`App` [1. Called first by `hydrateRoot`] | Runs **in the browser** and keeps the server's `<main>`
- +`<input>` | Keeps the **server's field** | `socks` **stays**
- +`<h1>` | Keeps **`Blue Sneakers`** as sent
- +`AddToCart` [2. Called second] | Keeps the **server's button** and **attaches `onClick`** | `count` starts at **0**, so `Cart: 0` **matches**
- +`Reviews` [3. Inside `<Suspense>`] | Keeps the **three reviews** | Hydrated **in its own chunk**, so the button **does not wait**
```

### What Readers Expect, and What Hydration Does

| Aspect | What readers expect | What hydration does |
| :--- | :--- | :--- |
| **The page** | Component code runs again, so the DOM is rebuilt | React reuses server DOM nodes without creating new elements |
| **The button** | Because the button is visible, it works immediately | Event listeners arrive with scripts; hydration binds them to existing nodes |
| **The root call** | `createRoot` and `hydrateRoot` perform the same role | On server HTML, `createRoot` destroys nodes; `hydrateRoot` preserves them |
| **The first render** | The client automatically fixes server mistakes | Initial client render must match server markup; discrepancies are errors |
| **The cost** | Because the server built HTML, the client has little work | The browser must run every component; without boundaries, hydration is monolithic |

Remember the core rule of this lesson. **The server provides the DOM elements, the JavaScript bundle provides the event handlers, and `hydrateRoot` joins them without rebuilding the page.**

---

## For the Interview

> **The Interview Question:** What is hydration, and how does hydrateRoot attach interactivity?

### How to Answer Clearly in 30 Seconds

"Hydration is how React transforms static, server-rendered HTML into an interactive application. The server delivers the initial markup snapshot, but static HTML cannot transmit JavaScript functions. When client scripts execute, `hydrateRoot` performs three essential operations:
1. **It executes component functions in the browser**, reconstructing the virtual element tree to discover event listeners.
2. **It reuses existing DOM nodes sent by the server** rather than creating new elements, preserving active input focus and form text.
3. **It binds event handlers directly to those existing nodes**, transitioning the document into React state management.

Hydration is therefore not a duplicate render of the DOM: component code runs twice, but the DOM is constructed once. Hydration requires that the initial client render matches the server output. Without boundaries, it hydrates the entire page at once, meaning slow components postpone interactivity for visible controls."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Is hydration considered a second render?"**
   **Yes for component logic, but no for the DOM.** Every component function executes again in the browser so React can inspect event handlers. However, React avoids creating new DOM nodes, choosing instead to adopt existing server elements.
2. **"What happens if you invoke `createRoot` on server HTML, or `hydrateRoot` on an empty container?"**
   Both choices represent bugs. Calling `createRoot` on server HTML wipes the container, resetting input focus, scroll position, and user-entered text. Calling `hydrateRoot` on an empty container is explicitly unsupported by React. In short: use `hydrateRoot` when server markup is present, and use `createRoot` when the root container is empty.
3. **"Why might a server-rendered page feel unresponsive to initial clicks?"**
   Because visual display occurs before hydration finishes. The browser must still download the client bundle and execute component functions. Without boundaries, hydration is monolithic, meaning complex lower sections delay event listeners on upper buttons. Wrapping secondary content in `<Suspense>` enables Selective Hydration, allowing primary buttons to become interactive immediately.

```tree caption="Interview summary: what hydrateRoot does, what it needs, and what it costs."
Hydration with `hydrateRoot`
- +What it does | Runs every component **in the browser** | **Reuses** the server's DOM nodes and **attaches** the handlers
- +What it needs | The browser's first render gives **the same output** as the server | A difference is a **bug** that rebuilds that part
- !What it costs | Every component **runs again** in the browser | Without boundaries, the **whole page** hydrates at once
```
