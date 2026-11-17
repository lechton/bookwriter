# Lecture 105: Why the Greeting Flips from Good morning to Good evening

*(Why does a page from the server change its text, and print a red error, when the JavaScript arrives?)*

> INTERVIEW QUESTION | ❱ CORE | What causes hydration mismatches, and how do you fix them?

---

## VS | The Server's Clock `renderToString` vs. the Phone's Clock `hydrateRoot`: one line of code gives two answers, and React reports an error

> On a server-rendered page, your components run in two environments. First, the server runs them to generate the initial HTML. Later, the browser runs them again during `hydrateRoot` to attach event listeners to that HTML. **A hydration mismatch occurs when the browser's first render produces different output from the server's HTML, such as `Good evening` where the server sent `Good morning`**. React does not quietly adjust the text. In development, it logs a hydration error, discards the mismatched DOM subtree, and regenerates those elements directly in the browser.

In traditional client-side JavaScript, reading the time is straightforward. When your code calls `new Date().getHours()`, it reads the system clock of the computer running the script. On a standard client-only page, that computer is the device of the user. One script runs on one machine with one system clock.

```js title="Plain JavaScript: one script, one computer, one clock"
const hour = ~new Date().getHours()~; // The clock of the user's computer: 18 at 6 PM in Los Angeles
document.querySelector('p').textContent = hour < 12 ? 'Good morning' : 'Good evening';
```

When you add server-side rendering, that exact same line executes inside a React component across two different machines (Lesson 104). First, the server executes the component to generate the initial HTML. Later, the phone of the user executes the same component during `hydrateRoot`. Two separate computers mean two independent clocks, and those clocks frequently reside in different time zones.

```jsx title="React with a server: one line, two computers"
const hour = ~new Date().getHours()~; // Server in UTC at 2 AM: 2. John's phone in Los Angeles at 6 PM: 18

<p>{hour < 12 ? 'Good morning' : 'Good evening'}, John</p>
```

The server generates HTML containing `Good morning, John`. Meanwhile, the phone calculates `Good evening, John` during its first client render. When React reconciles the browser render against the existing server HTML, it detects the conflicting text and logs a hydration error in the developer console.

Keep one core rule in mind throughout this lesson:

**The first render in the browser must match the server HTML exactly. Any value known only to the browser must wait until hydration finishes.**

> [!DEFINITION]
> **Hydration.** [REVIEW] Server rendering delivers complete HTML so the user sees visible content immediately. However, static HTML cannot execute interactive event handlers. When the client JavaScript bundle arrives, `hydrateRoot` executes your components in the browser to rebuild the virtual DOM. React inspects the existing DOM nodes sent by the server, verifies that they match the client render, and attaches your event listeners to those nodes. React can reuse the server elements only when the initial client render produces the identical HTML structure (Lesson 104).

> [!DEFINITION]
> **Hydration mismatch.** [NEW] A hydration mismatch occurs when the initial client render generates DOM output that differs from the server-rendered HTML. The difference can be mismatched text content, different HTML tags, or conflicting element attributes. The official React documentation refers to this failure as a hydration error, stating clearly that developers must treat mismatches as bugs. The root cause is almost always a value that differs between the server and the browser, such as the system clock, the viewport dimensions, or values stored in `localStorage` (Lesson 105).

### What John Sees at 6 PM

Consider an online storefront that greets shoppers by name and time of day at the top of the home page. A shopper named John lives in Los Angeles. John loads the storefront on a smartphone at 6 PM local time. Here is the exact sequence that unfolds on the screen:
1. The page appears instantly because the server sends pre-rendered HTML (Lesson 102). The heading text reads `Good morning, John`.
2. Once the client JavaScript bundle finishes downloading, the greeting suddenly jumps to `Good evening, John`.
3. In the developer console, React logs a red hydration failure error.

```page width=full caption="The shop home page as the server sends it: at 6 PM in Los Angeles, John's phone shows Good morning, John."
line: Good morning, John | bad
console: quiet
```

```page width=full caption="The same page after the JavaScript arrives: the greeting has changed, and the Console shows a red error."
line: Good evening, John
console: Uncaught Error: Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client.
```

Here is why the two computers produce conflicting text:
- **On the server**, `renderToString` executes the App component to generate the initial HTML document. Cloud servers commonly run on Coordinated Universal Time, known as UTC. At this moment in UTC it is 2 AM, so the hour variable evaluates to 2, and the server emits `Good morning, John`.
- **On John's phone**, `hydrateRoot` executes the App component a second time inside the browser. The clock on the phone follows Pacific Time in Los Angeles, where the current time is 6 PM. Consequently, the hour variable evaluates to 18, and the initial browser render produces `Good evening, John`.

```tree caption="The same line of App runs on two computers: the server's clock writes the HTML, and the phone's clock writes the first browser render."
One line that reads the hour, run on two computers
- !On the server, in UTC [`renderToString`] | `hour` is **2** at 2 AM | The HTML says **`Good morning, John`**
- !On John's phone, in Los Angeles [`hydrateRoot`] | `hour` is **18** at 6 PM | The first browser render says **`Good evening, John`**
```

**The code appears to read a single value, but it actually reads two completely different clocks.** The expression `new Date().getHours()` is written only once in source code. However, because that code executes in two distinct runtime environments, it queries two separate hardware clocks and returns two conflicting numbers.

A common misconception makes this bug hard to recognize at first. When the text flips on the screen, a developer often assumes the client simply corrected an outdated server guess.

**That sudden visual flip is not a harmless update.** React requires the initial client render to yield the exact same markup as the server so it can preserve the existing DOM nodes (Lesson 104). When the client output diverges from the server HTML, React cannot reuse those elements. It logs an error, destroys that section of the server DOM tree, and recreates the elements from scratch in the browser.

### What a Mismatch Costs

Hydration mismatches degrade the user experience in three concrete ways:
1. **Visible content suddenly flickers and shifts.** Server-side rendering exists so users can read content right away. As the React documentation explains, unexpectedly altering that content when JavaScript loads destroys the seamless initial experience.
2. **React destroys the server DOM and recreates it from scratch.** The error message explicitly confirms that React will regenerate the tree on the client. Without a Suspense boundary wrapping the affected component, that regeneration discards the entire page DOM (Lesson 104). The React team notes that this creates noticeable performance lag and can attach event handlers to incorrect DOM nodes.
3. **Mismatched attributes can remain permanently broken.** In production builds, React optimizes for hydration speed rather than exhaustive verification. The official documentation warns that React offers no guarantee that conflicting attributes will be repaired during a mismatch.

### The Rule of Thumb: would the server and the phone give the same answer?

**Ask one straightforward question about every value read during render: will the server and the client compute the exact same value? If both environments produce the same result, render it directly. If the results differ, that value cannot be part of the initial render.**

In production applications, web pages frequently need to display client-specific data, such as local time, viewport dimensions, or persisted user preferences. React provides four established architectural techniques to handle client data safely without triggering hydration errors:

```tree caption="Four ways to show a value that only the browser knows, without a hydration mismatch."
Four ways to show a value the server cannot know
- +1. Two-pass render [`useState` `useEffect`] | For a value that must appear **as text**, such as the greeting | Costs a **second render** and a **visible change**
- +2. CSS [`@media`] | For a difference in **layout only**, such as a `Menu` button on phones | **No second render** and **no change** after hydration
- +3. A store with a server value [`getServerSnapshot`] | For a browser value with a **fixed answer on the server** | Taught in **Lesson 53**
- !4. Silence one element [`suppressHydrationWarning`] | For **one text or attribute** that cannot match, such as a timestamp | The page **keeps the server's text**
```

This lesson demonstrates the two-pass render, CSS media queries, and the suppression attribute on our storefront page. External stores with server snapshots represent the third pattern, which was explored in depth in Lesson 53.

Experienced engineers recognize four common anti-patterns that cause hydration bugs in production:
1. **Adding a `typeof window` guard to silence server crashes.** While this guard stops reference errors on the server, the official React documentation explicitly cites it as a prime cause of hydration mismatches.
2. **Reading volatile data during the render phase.** Accessing clocks, random numbers, or browser storage works in client-only applications. However, Lesson 14 demonstrated that reading external volatile values violates component purity.
3. **Placing `suppressHydrationWarning` on mismatched elements.** Hiding the error message creates a false sense of security. The React documentation warns that React will not patch mismatched text, leaving the stale server text visible to users.
4. **Dismissing hydration errors as harmless development noise.** Hydration failures indicate broken reconciliation state. As the React documentation insists, developers must treat every hydration error as an active bug that requires remediation.

The following sections inspect each problem and its proper resolution on our online storefront.

## SECTION | The Shop Home Page

We continue developing the storefront application introduced in Lessons 102 through 104. The store renders its home page on the server so visitors see products immediately. A home page commonly incorporates three familiar features: time greetings, responsive menus, and components nested in text. Each of these three conventions introduces a classic hydration pitfall.

The header of our storefront contains three main elements:
1. **The user greeting**, displaying `Good evening, John`, examined in Principles 1, 4, and 5.
2. **The navigation bar**, showing a Menu button on mobile screens and text links on wide viewports, examined in Principle 2.
3. **The product showcase**, displaying `Blue Sneakers $49`, where the numerical price renders via a dedicated child component, examined in Principle 3.

```page width=full caption="The top of the shop home page on a wide screen, as the finished lesson renders it after hydration."
line: Good evening, John
line: Shoes Bags
line: Blue Sneakers $49
```

The page uses five files:

```files title="shop-home: File Explorer" caption="The files of the shop home page: the server sends the HTML and the CSS link, App.jsx describes the page, and main.jsx hydrates it."
server.js | server | Calls `renderToString(<App />)` and sends the HTML inside `<div id="root">`, as in Lesson 102
styles.css | styles | Shows the `Menu` button on phones and the links on wide screens, from Principle 2
src/
  App.jsx | component | Exports `App`: the greeting, the navigation, and the product line
  Price.jsx | component | Exports `Price`, the price `$49`, from Principle 3
  main.jsx | entry | Imports `App` and calls `hydrateRoot` on `#root`, as in Lesson 104
```

The browser entry file retains the single hydration call established in Lesson 104:

```jsx title="src/main.jsx"
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

~hydrateRoot~(document.getElementById('root'), <App />); // Runs App in the browser and expects the server's output
```

Once again, keep the central rule of this lesson in focus: **the browser's first render must give exactly the server's HTML. A value that only the browser knows waits until after hydration.**

**PRINCIPLES:** Every hydration mismatch follows the same underlying pattern: the server and client run the same component functions but produce divergent markup. While the symptoms look similar, each root cause requires a distinct solution. Five principles guide our architecture:
1. **Principle 1: Calling `new Date()` during render produces conflicting greetings.** The system clock yields different values on the server and client, prompting React to report a hydration mismatch.
2. **Principle 2: Branching on `typeof window` renders desktop links on the server and mobile buttons on the client.** The conditional check avoids server crashes but introduces a DOM divergence. Responsive CSS resolves layout variants while preserving identical HTML output.
3. **Principle 3: Nesting a `<div>` inside a `<p>` causes the browser HTML parser to restructure elements before React hydrates.** Invalid tag nesting produces DOM mutations that conflict with React's virtual tree.
4. **Principle 4: A client Effect safely updates the greeting to `Good evening` immediately after hydration.** The initial client render mirrors the server text, and an Effect applies local time in a second pass.
5. **Principle 5: The `suppressHydrationWarning` attribute hides console warnings but leaves `Good morning` on screen.** The escape hatch silences developer warnings without repairing the mismatched text.

---

## PRINCIPLE | `new Date()` during render: the server and the phone write two different greetings

> [!PRINCIPLE]
> **Principle 1: Same First Render: A Value Read During Render Must Give the Same Answer on Both Computers**
>
> *The initial client render must match the server HTML byte for byte. Reading values during render that vary across environments, such as the system clock, triggers a hydration error and forces React to regenerate that portion of the DOM.*
>
> The server and the browser execute the same App component, but they execute at different times and in different geographical locations. Any render calculation that depends on execution time or machine locale will return conflicting values, such as the current hour, random numbers, or localized dates. The user observes an abrupt visual shift, and React discards the server markup to regenerate the subtree on the client.
>
> **DO THIS:**
> ```jsx
> <p>~Hello~, John</p> {/* No clock in the render: the server and the phone write the same text */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const hour = ~new Date().getHours()~; // **WRONG:** the server in UTC gets 2, the phone in Los Angeles gets 18
> <p>{hour < 12 ? 'Good morning' : 'Good evening'}, John</p>
> ```

### The Greeting in Its Smallest Form

**When a component calculates JSX using values that differ across computers, the initial browser render diverges from the server HTML.** The following App component demonstrates this flaw in its simplest form:

```jsx title="src/App.jsx"
export default function App() {
  const hour = ~new Date().getHours()~; // Server in UTC at 2 AM: 2. John's phone in Los Angeles at 6 PM: 18
  return (
    <main>
      <p>{hour < 12 ? 'Good morning' : 'Good evening'}, John</p>
    </main>
  );
}
```

The `getHours()` method reads the system clock in the local time zone of whatever computer executes the code. The component contains no information about which machine runs it. As a result, the server calculates one hour while the user smartphone calculates another.

### What React Does with Two Greetings

**React reconciles the initial client virtual DOM against the existing server HTML, encounters conflicting text, logs an error, and rebuilds the element.** This single verification step explains both visible anomalies: the abrupt greeting change on John's screen and the red console error. Here is the complete chronological sequence:
1. The server executes the App component at 2 AM UTC and returns HTML containing `<p>Good morning, John</p>`.
2. John's smartphone renders the server HTML immediately, displaying `Good morning, John` while downloading the client scripts.
3. Once the JavaScript bundle loads, `hydrateRoot` executes the App component on John's device at 6 PM Pacific Time.
4. The initial browser render evaluates the hour to 18, generating `Good evening, John`.
5. React inspects the existing DOM text and detects a discrepancy between the server markup and the client tree.
6. React outputs a detailed hydration failure warning in the browser console.
7. React discards the server-rendered DOM node and recreates the element directly on the client. The official documentation refers to this recovery process as regenerating the tree on the client. The paragraph on the screen now displays `Good evening, John`.

```devconsole width=full caption="The Console on John's phone after hydrateRoot, when the server wrote Good morning and the browser rendered Good evening."
x Uncaught Error: Hydration failed because the server rendered text didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:
  - A server/client branch `if (typeof window !== 'undefined')`.
  - Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
  - Date formatting in a user's locale which doesn't match the server.
  - External changing data without sending a snapshot of it along with the HTML.
  - Invalid HTML tag nesting.
  It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.
  https://react.dev/link/hydration-mismatch
  <App>
    <main>
      <p>
+ +       Good evening
-       Good morning
        ...
```

The phrase "A SSR-ed Client Component" refers to a client component that the server rendered during initial page generation. We can break down the diagnostic message into two key sections:
1. **The catalog of common causes.** This checklist reflects known hydration hazards documented by the React team. Our dynamic greeting matches the second item: volatile input that varies between calls and environments.
2. **The structural element diff.** React prints a visual diff tracking down through the component hierarchy to the offending element, which in this case is the paragraph tag. The plus symbol indicates what the browser attempted to render, while the minus symbol reveals what the server originally delivered. This diff pinpoints the exact element requiring remediation.

In earlier versions of React, a mismatch generated multiple disjointed console warnings. React 19 consolidates these diagnostics into a single unified error with an inline visual diff.

### The Clock Is Only One Example

Reading the system clock represents the most frequent cause of hydration errors, but any non-deterministic calculation will trigger the exact same failure. The error message highlights several common culprits:
- **Timestamps and pseudorandom generators like `Date.now()` and `Math.random()`.** Because the server and browser evaluate these functions at distinct points in time, they inevitably generate conflicting values.
- **Date strings formatted according to regional locales.** A locale determines regional date conventions. For example, a server configured for US formatting outputs month first, whereas a browser configured for European locales outputs day first.
- **Dynamic external data such as live stock counts.** If the server reads a database value during rendering but does not serialize that snapshot into the HTML, a subsequent client fetch will produce a divergent initial render.

Each of these practices violates the foundational purity invariant introduced in Lesson 14: a React component must always return identical JSX given identical inputs. In client-only applications, subtle impurity often goes unnoticed. In server-rendered applications, impurity is immediately exposed as a hydration mismatch.

### Why the Bug Never Shows on the Laptop

**The dynamic greeting functions without error on a local workstation but breaks immediately when deployed to production.** This bug frequently evades local testing through a simple coincidence:
1. A developer implements the greeting using the current hour and verifies the feature on a local workstation.
2. Because the development machine hosts both the Node.js server and the local browser, both rendering passes read the exact same system clock. The markup matches and the console remains clean.
3. The application is deployed to production cloud servers running on UTC.
4. Any customer accessing the website from another time zone experiences an abrupt visual flicker and triggers client hydration errors.

```tree dir=right caption="Why the greeting works on the developer's laptop and breaks for a shopper in Los Angeles."
Where the two clocks come from
- +On the developer's laptop | The server and the browser read **one clock** | Both renders say **`Good evening, John`**: no error
- !On the live site | The server reads **UTC**; the phone reads **Los Angeles** | **`Good morning`** then **`Good evening`**: a hydration error
```

---

## PRINCIPLE | `typeof window` in render: the crash is gone, but the server sends the links and the phone renders `Menu`

> [!PRINCIPLE]
> **Principle 2: Browser-Only Values: `typeof window` Makes the Server and the Browser Render Different Things**
>
> *Never introduce rendering branches based on `typeof window` or browser globals like `window.innerWidth`, `window.matchMedia`, or `localStorage`. When presenting layout variations across devices, render both structural elements in the markup and toggle their visibility with CSS media queries.*
>
> The Node.js server environment has no window object and no physical display, so querying browser globals naturally produces different results on the server and client. Wrapping the access in an existence check prevents runtime crashes but inevitably causes a hydration mismatch. Responsive CSS solves layout requirements cleanly: both environments output identical HTML markup, and the browser styling engine toggles element visibility based on viewport dimensions.
>
> **DO THIS:**
> ```jsx
> <button ~className="menu"~>Menu</button> {/* Rendered on both sides: a media query hides it on wide screens */}
> <nav className="links">...</nav>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const isPhone = ~typeof window !== 'undefined'~ && window.innerWidth < 600; // **WRONG:** the server gets false, the phone gets true
> ```

### The Server Has No `window`

**The `window` global is an environment object provided exclusively by web browsers.** It exposes properties representing the active browser tab, such as the viewport width via `window.innerWidth` and client storage via `localStorage`. Because the server runs as a headless process without a graphical screen, the global window object simply does not exist. React documentation terms these browser-specific interfaces browser-only APIs.

Consider the navigation bar in our storefront. On small mobile screens, the header should display a single Menu button. On wide desktop screens, it should display direct links for Shoes and Bags. A developer might attempt to choose between them by evaluating screen width:

```jsx title="The navigation in App.jsx"
const isPhone = ~window.innerWidth~ < 600; // **WRONG:** on the server, window does not exist and the render stops

{isPhone ? (
  <button>Menu</button>
) : (
  <nav>
    <a href="/shoes">Shoes</a> <a href="/bags">Bags</a>
  </nav>
)}
```

When `renderToString` executes on the server, JavaScript encounters the undeclared window identifier. The server process halts with an unhandled ReferenceError. The server fails to transmit the HTML document, leaving the user with an empty screen.

### The Check That Moves the Bug

A common attempt to solve the server crash wraps the window access in an existence check:

```jsx title="The first line of the navigation, with the check"
const isPhone = ~typeof window !== 'undefined'~ && window.innerWidth < 600; // Server: false. Phone: true
```

In JavaScript, querying an undeclared identifier using the `typeof` operator returns the string `'undefined'` instead of throwing a reference error. On the server, this condition evaluates to false, causing the logical AND operator to short-circuit before accessing inner width. The server crash disappears.

**While this check prevents a crash, it introduces a severe hydration mismatch.** Although the component now runs on the server without throwing, it forces the server and browser to render completely different DOM trees:
- **On the server**, the variable isPhone evaluates to false, so the generated HTML contains the navigation links for Shoes and Bags.
- **On John's mobile device**, the variable isPhone evaluates to true, so the initial client render generates the Menu button.

Notice the resulting behavior on John's phone:

```page width=full caption="The navigation on John's phone, as the server sends it: the server could not see the screen, so it sent the links."
line: Shoes Bags
console: quiet
```

```page width=full caption="The same navigation after hydrateRoot: the links turn into a Menu button, and the Console shows a hydration error."
line: [Menu]
console: Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client.
```

In this scenario, the error diagnostic specifically names mismatched HTML rather than mismatched text. The underlying tags conflict directly: the server delivered a nav element, but the client generated a button element.

The mismatch occurs conditionally depending on the physical screen size:
1. On a desktop computer, the server renders the links, and the client browser also selects the links. The markup trees match and no error is reported.
2. On a mobile device, the server delivers the desktop links, but the mobile browser renders the Menu button. React flags a hydration mismatch and destroys the server elements.
3. Consequently, engineers testing exclusively on desktop browsers never observe the defect during local development.

The official React documentation explicitly warns against this pattern, advising against rendering branches that rely on `typeof window`. The documentation similarly warns against calling browser APIs such as matchMedia or reading from `localStorage` during render. Because a server cannot inspect client storage, reading stored preferences directly during render inevitably causes hydration mismatches.

### VS | A Branch in the Render `typeof window` vs. a CSS Rule `@media`: only CSS gives every screen the same HTML

**Because mobile menus and desktop links differ solely in visual presentation, responsive CSS can control their display cleanly.** The React documentation advises conditionally displaying different UI elements with CSS instead of branching render logic. Rather than choosing between elements inside JavaScript, the App component renders both elements side by side, attaching semantic class names:

```jsx title="The navigation in App.jsx, with both parts"
<button ~className="menu"~>Menu</button> {/* Shown only on phones by the CSS below */}
<nav ~className="links"~> {/* Shown only on wide screens by the CSS below */}
  <a href="/shoes">Shoes</a> <a href="/bags">Bags</a>
</nav>
```

A CSS stylesheet then manages element visibility. A media query applies style rules conditionally based on device characteristics, such as screen width:

```css title="styles.css"
.menu {
  display: none;
}

@media (max-width: 599px) {
  .menu {
    display: inline;
  }
  .links {
    display: none;
  }
}
```

On wide desktop viewports, only the default rule applies: the Menu button is hidden via display none, while the navigation links remain visible. On viewports narrower than 600 pixels, the media query activates. It makes the Menu button visible and hides the navigation links.

**While both techniques look similar visually, their architectural behavior is fundamentally different:**
- **With JavaScript branching**, the server and mobile client emit divergent HTML trees, producing hydration mismatches on every mobile device.
- **With responsive CSS**, the server and mobile client emit the identical HTML structure containing both elements. The browser layout engine then applies visibility rules. Because the markup matches, hydration completes without error.

This approach provides a substantial user experience advantage. Because CSS rules apply before JavaScript downloads and executes, the phone displays the correct mobile layout immediately upon receiving the initial HTML.

```tree caption="The same navigation chosen during render with typeof window, or rendered whole and hidden by CSS."
Two ways to show `Menu` on phones and links on wide screens
- !Choose during render [`typeof window` `innerWidth`] | The server renders **the links**; the phone renders **`Menu`** | A **hydration error** on every phone
- +Render both, hide with CSS [`className` `@media`] | The server and the phone render **the same HTML** | **No error**, and the phone shows `Menu` **before the JavaScript arrives**
```

To enable this behavior, the server template must serve the external stylesheet alongside the HTML payload:

```jsx title="server.js"
response.send(`
  <link rel="stylesheet" href="/styles.css">
  <div id="root">${html}</div>
  <script type="module" src="/bundle.js"></script>
`); // The CSS arrives with the HTML, so the right part shows at once
```

When a client value represents textual content rather than layout presentation, CSS cannot solve the discrepancy. Principle 4 addresses text values that exist only on the client.

### Why the Bug Ships

**Developers inadvertently introduce hydration bugs while attempting to patch server crashes.** The regression follows a predictable path:
1. A component reads inner width to toggle between mobile and desktop navigation. In a client-only architecture, the code works without incident.
2. The team introduces server-side rendering, and the server process crashes upon encountering the missing window global (Lesson 102).
3. A developer adds a `typeof window` guard to bypass the crash.
4. On mobile devices, the server links flicker and transform into a button, and the browser console logs a hydration error.

---

## PRINCIPLE | `<div>` inside `<p>`: the browser moves the `<div>` out before React compares

> [!PRINCIPLE]
> **Principle 3: Valid HTML: The Browser Must Keep the Server HTML as React Wrote It**
>
> *Always adhere to HTML nesting standards and avoid injecting extraneous whitespace around the server HTML in the mounting root. When markup violates HTML specifications, such as placing a `<div>` inside a `<p>`, the browser parser mutates the DOM before React hydrates.*
>
> During hydration, React reconciles its virtual DOM against the live DOM constructed by the browser HTML parser. If markup violates HTML grammar rules, the browser corrects the structure before client scripts run. Although the visual layout might appear normal, the resulting DOM hierarchy diverges from React's virtual tree, causing an unavoidable hydration error.
>
> **DO THIS:**
> ```jsx
> <p>Blue Sneakers ~<span>$49</span>~</p> {/* A span may sit inside a p: the browser keeps it */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <p>Blue Sneakers ~<div>$49</div>~</p> {/* **WRONG:** the browser moves the div out of the p */}
> ```

### A Price Inside a Line of Text

**React does not reconcile client components against the raw server HTML string. Instead, it compares virtual elements against the live DOM nodes constructed by the browser HTML parser.** Under normal circumstances, the parser output matches the server string exactly. With invalid HTML nesting, however, the parser alters the structure.

In our storefront showcase, each product entry displays a name alongside a numerical price. The price value renders through a small child component:

```jsx title="src/Price.jsx"
export default function Price() {
  return ~<div>$49</div>~; // **WRONG:** a div, which App places inside a p
}
```

```jsx title="src/App.jsx" startLine="6"
<p>Blue Sneakers ~<Price />~</p> {/* The p now holds a div */}
```

Notice that this implementation contains no system clocks, no window references, and no random numbers. Nevertheless, the component triggers a hydration failure.

### What the Browser Does with the Server HTML

**The HTML specification forbids block-level `<div>` elements inside paragraph `<p>` tags, prompting the browser parser to reorganize the DOM before React executes.** The React console classifies this violation as invalid HTML tag nesting. Here is what transpires in the browser step by step:
1. The server serializes the component tree into an HTML string containing `<p>Blue Sneakers <div>$49</div></p>`.
2. The browser HTML parser processes the incoming markup stream. According to HTML specification rules, encountering a block element implicitly terminates an open paragraph. The parser automatically closes the `<p>` immediately before the `<div>`.
3. The parser appends the `<div>` as a sibling following the closed paragraph. When it subsequently encounters the trailing `</p>` tag, which no longer has an open parent, it synthesizes a new, empty paragraph element.
4. Next, `hydrateRoot` executes the App component in the browser. React's virtual DOM still expects a paragraph containing a child division.
5. React inspects the live DOM, finds three reconstructed sibling elements instead of one nested element, and logs a hydration failure.

```dom caption="The DOM the browser builds from the server HTML: the div was moved out of the p, and an empty p was added."
<main>
! <p>Blue Sneakers </p>
! <div>$49</div>
! <p></p>
</main>
```

```devconsole width=full caption="The Console on the phone during hydration, when Price returns a div inside the p."
x In HTML, <div> cannot be a descendant of <p>.
  This will cause a hydration error.
x <p> cannot contain a nested <div>.
  See this log for the ancestor stack trace.
x Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client.
```

**Although the text looks normal on screen, the underlying DOM structure is completely broken.** Both structures render the product label and price visually. However, the DOM hierarchy fabricated by the browser parser does not match the virtual tree React generated. React compares its render pass directly against that mutated DOM.

### Why It Worked Without a Server

In client-only applications, React constructs DOM nodes directly using document methods (Lesson 07). Because the browser HTML parser never processes raw HTML text, the child division remains nestled inside the paragraph, and the UI functions without complaint. Only developmental nesting warnings appear in the console, foreshadowing the problem: "This will cause a hydration error."

When you introduce server rendering, that warning becomes reality. The solution is writing semantically valid HTML: the Price component must return an inline `<span>`, which HTML specifications explicitly permit inside paragraphs.

```jsx title="A div inside the p, and a span inside the p"
<p>Blue Sneakers <div>$49</div></p> {/* The browser moves the div out: hydration error */}
<p>Blue Sneakers <span>$49</span></p> {/* Valid HTML: the browser keeps it as React wrote it */}
```

### Extra Whitespace Inside the Root

**A similar structural mismatch occurs when server templates inject formatting whitespace inside the root container.** The React documentation warns against superfluous whitespace characters, such as newlines or indentation tabs, surrounding server-generated markup inside the mounting container. Examine two different ways to interpolate server HTML within the root element:

```jsx title="server.js, with the HTML right after the opening tag"
<div id="root">~${html}~</div> {/* The root holds only what React wrote */}
```

```jsx title="server.js, with the HTML on its own line"
~<div id="root">~ {/* **WRONG:** a newline and spaces follow the tag inside the root, and React never rendered them */}
  ${html}
</div>
```

The correct pattern places the template interpolation immediately adjacent to the opening root tag without line breaks or spaces. The server implementation in Lesson 102 already adheres to this practice.

Browser extensions can also introduce unexpected DOM mutations prior to hydration. React 19 automatically ignores extra elements that extensions inject into the document head or body, as well as sibling elements appended directly inside the root container. However, if an extension injects arbitrary DOM nodes into internal application elements, such as our main container, React will still register a hydration mismatch.

### Why the Bug Ships

**Independent developers writing individually sound components can inadvertently combine them into invalid HTML.** This problem commonly emerges across team boundaries:
1. One engineer develops the Price component, returning a standard `<div>` container.
2. Another engineer incorporates `<Price />` inside a product description paragraph.
3. In client-side testing, React builds the elements in memory, so the page renders without visual flaws.
4. In production with server rendering enabled, the browser parser reorganizes the invalid nesting, and hydration logs a mismatch.

---

## PRINCIPLE | `useEffect` with `isClient`: the first render matches the server, and the phone's hour comes right after

> [!PRINCIPLE]
> **Principle 4: Two Passes: Show the Browser's Value After Hydration**
>
> *When client-specific data must be displayed as dynamic text, initialize a state variable such as `isClient` to `false`, toggle it to `true` inside an Effect, and display the client value only on the second render.*
>
> React never executes component Effects on the server. Consequently, the server render and the initial client render both read `false`, producing identical markup that allows React to preserve the server DOM. Immediately following hydration, the Effect triggers a state update, causing React to render the client-specific value in a second pass. This technique requires an additional render cycle and causes visible layout shifts, so developers should employ it only when CSS cannot solve the requirement.
>
> **DO THIS:**
> ```jsx
> const [isClient, setIsClient] = useState(false);
> useEffect(() => { setIsClient(true); }, []);
> <p>{~isClient ? greeting : 'Hello'~}, John</p> {/* Hello on both sides first, then Good evening after hydration */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <p>{~greeting~}, John</p> {/* **WRONG:** greeting comes from the clock during render, so the server and the phone disagree */}
> ```

### The Server's Text First, the Phone's Text Right After

**When a client-only value must be displayed as text, render a consistent server fallback first, then update to the client value after hydration completes.** The React documentation defines this architectural pattern as two-pass rendering. The minimal implementation uses a dedicated boolean state flag:

```jsx title="The two-pass render from the React docs"
const [isClient, setIsClient] = ~useState(false)~; // false on the server and in the browser's first render

useEffect(() => {
  ~setIsClient(true)~; // Runs only in the browser, after hydration
}, []);

<p>{isClient ? 'Is Client' : 'Is Server'}</p>
```

This pattern succeeds by leveraging two core React runtime behaviors:
1. Component Effects execute strictly after initial rendering and run exclusively inside the browser (Lesson 32). The React documentation confirms that Effects never run on the server.
2. Invoking a state setter function triggers a subsequent component re-render (Lesson 12).

The state identifier isClient is our own variable name, matching the conventions in the React documentation for client hydration. In other sections of the documentation, the React team refers to this exact mechanism using state names like didMount. Both names describe the identical pattern.

### The Greeting in Two Passes

In our storefront implementation, the server and the initial browser render both produce the neutral greeting `Hello, John`. Because this baseline greeting does not depend on local time, both environments agree on the markup. The post-hydration Effect then transitions to the local greeting:

```jsx title="src/App.jsx"
import { useState, useEffect } from 'react';

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : 'Good evening';

  return (
    <main>
      <p>{~isClient ? greeting : 'Hello'~}, John</p> {/* Server and first browser render: Hello. After the Effect: Good evening */}
    </main>
  );
}
```

Notice what John experiences on his phone at 6 PM:

```page width=full caption="On John's phone, from the server and during hydration: both renders say Hello, John."
line: Hello, John
console: quiet
```

```page width=full caption="The same phone right after hydration: the Effect has run, and the greeting reads Good evening, John with no error."
line: Good evening, John | good
console: quiet
```

**The initial client render now produces the exact same markup as the server.** Because the state variable evaluates to false in both environments, React successfully preserves the server DOM. Only after hydration does the local clock value reach the screen. Here is the operational sequence:
1. The server renders the App component with the state flag initialized to false. It transmits `Hello, John`. Component Effects never run in the server environment.
2. John's smartphone displays `Hello, John` immediately while the browser downloads client scripts.
3. During hydration, the component renders again with the state flag still false. The client output matches the server markup, enabling React to attach event listeners without destroying the DOM.
4. Immediately after hydration, the Effect executes and calls the state setter with true.
5. React performs a synchronous second render pass, updating the heading text to `Good evening, John`. The React documentation notes that this secondary render occurs synchronously right after hydration.

```tree dir=right caption="The two passes of the greeting: the first render matches the server, and the Effect brings the browser's value after hydration."
The greeting in two passes
- +Server [`isClient` is `false`] | Sends **`Hello, John`** | The Effect **never runs** here
- +First browser render [`isClient` is `false`] | Gives **`Hello, John`** again | **Matches** the server: React keeps the paragraph
- +After the Effect [`setIsClient`] | Sets `isClient` to **true** and renders `App` again | The line becomes **`Good evening, John`**, with **no error**
```

### What Two Passes Cost

**While two-pass rendering resolves the hydration error, the user still experiences an abrupt text shift after page load.** This approach incurs two distinct penalties:
1. **A mandatory second render cycle.** The React documentation explains that two-pass rendering slows down hydration because affected components must render twice.
2. **A visible content pop.** The documentation notes that altering the user interface immediately after hydration can feel disorienting to users.

This trade-off explains why the responsive navigation in Principle 2 relies on CSS rather than two-pass rendering. With CSS, the mobile layout displays immediately without triggering a second render or content shift.

### Why the Bug Ships

**Developers sometimes overuse two-pass rendering for every browser-dependent feature.** This overuse creates serious performance issues:
1. Greetings, navigation menus, and stored preferences all defer rendering behind a client state flag.
2. Once JavaScript loads, multiple sections of the page shift and re-render simultaneously.
3. On mobile devices with sluggish network connections, the fallback state lingers on screen for multiple seconds before jumping.

The official React documentation warns engineers to use this pattern sparingly. Users on slow devices experience noticeable delay before the final UI stabilizes. Applications where every visual element jumps after page load feel unpolished and broken.

---

## PRINCIPLE | `suppressHydrationWarning`: the red error disappears, but the server's `Good morning` stays

> [!PRINCIPLE]
> **Principle 5: Escape Hatch: `suppressHydrationWarning` Silences One Element and Keeps the Server's Text**
>
> *Apply `suppressHydrationWarning={true}` only to isolated elements with unavoidable discrepancies where preserving the server value is acceptable, such as server timestamps. It operates only one level deep, disables console warnings, and leaves server text unpatched in the DOM.*
>
> This property serves as a narrow escape hatch for situations where text or attributes cannot match across environments and retaining the server output causes no harm. It suppresses the warning without resolving the underlying difference. For dynamic text that must accurately reflect client state, implement the two-pass render demonstrated in Principle 4.
>
> **DO THIS:**
> ```jsx
> <h1 ~suppressHydrationWarning={true}~>Current Date: {new Date().toLocaleDateString()}</h1> {/* A timestamp: the server's date is fine to keep */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <p ~suppressHydrationWarning={true}~>{greeting}, John</p> {/* **WRONG:** the Console is clean, but John reads Good morning at 6 PM */}
> ```

### The Prop That Silences One Element

**The `suppressHydrationWarning` attribute stops React from reporting mismatches on a specific DOM element, but it does not update the element text.** It is a boolean attribute supported by React DOM on all built-in host elements. The React documentation illustrates its use on a dynamic date heading:

```jsx title="The suppressHydrationWarning example from the React docs"
<h1 ~suppressHydrationWarning={true}~> {/* No hydration error for the text of this h1 */}
  Current Date: {new Date().toLocaleDateString()}
</h1>
```

The documentation permits this attribute only when an element attribute or text content unavoidably differs between the server and the client. The primary intended use case is an absolute timestamp. The React team also outlines two critical constraints:
- **The attribute functions only one level deep.** It inspects only the immediate text and attributes of the target tag. It does not cascade down to nested children, meaning a mismatch inside an inner `<span>` will still trigger a hydration error.
- **It serves strictly as an escape hatch.** In React design terminology, an escape hatch provides a targeted bypass for rare edge cases. It is not an architectural solution for ordinary application state.

### VS | The Two-Pass Render `isClient` vs. the Prop `suppressHydrationWarning`: the first fixes the greeting, the second only hides the error

**Both approaches eliminate the red console error, but only two-pass rendering displays the correct greeting to the user.** Compare applying the suppression attribute against the two-pass architecture from Principle 4:

```jsx title="The greeting with the two-pass render"
<p>{~isClient ? greeting : 'Hello'~}, John</p> {/* Hello first, then Good evening after hydration: no error */}
```

```jsx title="The greeting with suppressHydrationWarning"
<p ~suppressHydrationWarning={true}~>{greeting}, John</p> {/* No error, and the page keeps the server's Good morning */}
```

**While both techniques eliminate the console warning, their operational results diverge completely:**
1. The server delivers HTML containing `Good morning, John`.
2. The initial browser render calculates `Good evening, John`.
3. React detects the suppression prop and cancels the warning. The console remains completely silent.
4. Crucially, React makes no attempt to update the live DOM node. As the documentation emphasizes, React will not attempt to patch mismatched text content.
5. At 6 PM in Los Angeles, John continues reading `Good morning, John`.

```page width=full caption="John's phone after hydration with suppressHydrationWarning: the Console is clean, and the wrong greeting stays."
line: Good morning, John | bad
console: quiet
```

Two-pass rendering updates the DOM to display the accurate local greeting. The suppression prop simply silences the console warning while preserving the incorrect server text on screen. The former resolves the defect, while the latter merely obscures it.

```tree caption="The two-pass render and suppressHydrationWarning both remove the error, but only one shows the right greeting."
Two ways to remove the hydration error on the greeting
- +Two-pass render [`isClient` `useEffect`] | The first render **matches** the server | The line becomes **`Good evening, John`**
- !`suppressHydrationWarning` [`suppressHydrationWarning={true}`] | React **does not warn** and **does not patch** | The line stays **`Good morning, John`**
```

Consequently, the suppression attribute is appropriate only when retaining the server value is harmless. A "last updated" timestamp that is a few seconds old remains perfectly acceptable to readers. A greeting that welcomes an evening shopper with "Good morning" is an obvious product bug.

### Why the Bug Ships

**Developers sometimes silence console warnings without verifying that the rendered output actually updates.** The anti-pattern unfolds in stages:
1. An engineer encounters a hydration error on the dynamic greeting.
2. Searching online leads to the `suppressHydrationWarning` property.
3. The engineer applies the attribute, observes a clean console, and assumes the problem is solved.
4. Shoppers in different time zones continue seeing incorrect greetings throughout the day.
5. Later, an engineer places the attribute on a parent container to silence mismatches inside nested children, discovering that the single-level prop fails to suppress child warnings.

---

## All 5 Principles Together

### The Complete Shop Home Page

Here is the top of the home page with every fix in place. The greeting uses two passes, the navigation uses CSS, and the price is a `<span>`.

```jsx title="src/App.jsx"
import { useState, useEffect } from 'react';
import Price from './Price.jsx';

export default function ~App~() { // 1. Called first by hydrateRoot, with isClient false
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    ~setIsClient(true)~; // 3. After hydration: App renders again with the phone's hour
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : 'Good evening';

  return (
    <main>
      <p>{isClient ? greeting : 'Hello'}, John</p>
      <button className="menu">Menu</button>
      <nav className="links">
        <a href="/shoes">Shoes</a> <a href="/bags">Bags</a>
      </nav>
      <p>Blue Sneakers <Price /></p>
    </main>
  );
}
```

```jsx title="src/Price.jsx"
export default function ~Price~() { // 2. Called second, inside App
  return <span>$49</span>;
}
```

```css title="styles.css"
.menu {
  display: none;
}

@media (max-width: 599px) {
  .menu {
    display: inline;
  }
  .links {
    display: none;
  }
}
```

```jsx title="server.js"
import { renderToString } from 'react-dom/server';
import App from './src/App.jsx';

app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(`
    <link rel="stylesheet" href="/styles.css">
    <div id="root">${html}</div>
    <script type="module" src="/bundle.js"></script>
  `); // Nothing around the HTML inside the root
});
```

```jsx title="src/main.jsx"
import { hydrateRoot } from 'react-dom/client';
import App from './App.jsx';

~hydrateRoot~(document.getElementById('root'), <App />); // The first render must give the server's output
```

### How React Walks the Page During Hydration

When the client bundle loads, React executes the App component, followed by the Price component. It reconciles every virtual element against the live DOM constructed by the browser. Because all markup aligns with the server HTML, React preserves the existing DOM nodes. Only after hydration finishes does the Effect run to apply client state:

```tree caption="The order in which React calls the components of the shop home page during hydrateRoot, and why each element matches the server."
`App` [1. Called first by `hydrateRoot`] | `isClient` is **false**, as on the server
- +The greeting `<p>` | Gives **`Hello, John`** | **Matches** the server
- +`<button>` and `<nav>` | Both rendered on **both sides** | CSS hides one: **matches**
- +`Price` [2. Called second] | Returns a **`<span>`** inside the `<p>` | Valid nesting: **matches**
- +The Effect [3. After hydration] | Sets **`isClient`** to **true** | The greeting becomes **`Good evening, John`**
```

### What Readers Expect, and What Really Happens

| Cause | What readers expect | What really happens | The fix |
| :--- | :--- | :--- | :--- |
| **The clock in render** | The browser corrects the server's greeting | The first render differs; React reports an error and rebuilds that part | Two-pass render with `isClient` set in an Effect |
| **`typeof window` in render** | The check makes the code safe on the server | The server renders the links, and the phone renders `Menu` | Render both parts and hide one with CSS |
| **A `<div>` inside a `<p>`** | The page looks right, so the HTML matches | The browser moves the `<div>` before React reads the page | Valid nesting, such as a `<span>`; nothing around the HTML of the root |
| **The two-pass render** | Read the browser's value as early as possible | The first render repeats the server; the browser's value comes after hydration | Use it sparingly: it costs a second render and a visible change |
| **`suppressHydrationWarning`** | The error is gone, so the page is fixed | React does not warn and keeps the server's text | Only for one unavoidable text or attribute, such as a timestamp |

Keep the foundational principle of this lesson in mind: **The first render in the browser must match the server HTML exactly. Any value known only to the browser must wait until hydration finishes.**

---

## For the Interview

> **The Interview Question:** What causes hydration mismatches, and how do you fix them?

### How to Answer Clearly in 30 Seconds

"A hydration mismatch happens when the initial render in the browser produces output that differs from the HTML sent by the server. React requires the two trees to be identical so that it can reuse the server DOM nodes. When they differ, React logs a development error with a component diff and regenerates that entire DOM subtree on the client. As a result, the user sees visible content shifts, and element attributes can remain incorrect.

The root causes fall into three major categories:
1. **Values that vary by execution time or environment location**, read during render: timestamps, `Date.now()`, `Math.random()`, locale strings, or dynamic data without a serialized server snapshot.
2. **Browser-only APIs and conditional checks** in render: branching on `typeof window`, `window.matchMedia`, or `localStorage`.
3. **Markup restructured by the browser HTML parser**: invalid nesting such as a `<div>` inside a `<p>`, extraneous whitespace inside the mounting root, or client browser extensions.

The fixes align directly with each root cause. Responsive CSS handles layout variations without JavaScript branching. A two-pass render with a post-hydration Effect handles client-only text. Semantic HTML resolves parser restructuring. Finally, `suppressHydrationWarning` serves as a narrow escape hatch strictly for isolated timestamps."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"What is allowed to differ between the server render and the first browser render?"**
   **Nothing.** The official React documentation states that `hydrateRoot()` expects rendered content to be identical with server-rendered content. The single narrow exception is text or attributes on an element explicitly marked with `suppressHydrationWarning`, and even in that case React preserves the server version. After hydration completes, any part of the page may update through normal state changes, which is why two-pass rendering works.
2. **"Why not just add `suppressHydrationWarning` everywhere?"**
   Because it silences the diagnostic warning without fixing the bug. React does not patch the text content, meaning users continue reading stale server text. Furthermore, it functions only one level deep, and the React documentation cautions that it is an escape hatch not intended for general use. It is acceptable for a timestamp where the server time is close enough, but unacceptable for content like a greeting that must be accurate.
3. **"How do you show a value from the browser, such as `localStorage` or the online status, on a server-rendered page?"**
   The approach depends on whether the value affects layout, text, or shared state. Layout differences should be resolved in CSS. Client-only text should wait for an Effect using two-pass rendering. Values managed in a shared store should use `useSyncExternalStore` with `getServerSnapshot`, ensuring both the server and initial client render receive the same deterministic snapshot (Lesson 53). Coordinated identifiers that must match across server and client should be generated with `useId` rather than a manual counter (Lesson 52).

```tree caption="Interview summary: what a hydration mismatch is, what causes it, and how each cause is fixed."
Hydration mismatches
- !What it is | The first browser render **differs** from the server HTML | React logs an **error with a diff** and **regenerates** that part
- !What causes it | **Time, random, locale**; **`typeof window`** and browser-only APIs | **Invalid nesting**, whitespace in the root, browser extensions
- +How to fix it | **CSS** for layout; **two-pass render** for browser-only text | **Valid HTML**; `suppressHydrationWarning` only for **one timestamp**
```
