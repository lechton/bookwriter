# Lecture 84: Starting the Font, the Stylesheet, and the Servers Early with preload, preinit, preconnect, and prefetchDNS

*(How does a component tell the browser to start a file, or a server, before the page asks for it?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | How do preload, preinit, preconnect, and prefetchDNS speed up asset loading?

---

## VS | The Browser Finds the File by Itself vs. a Hint from `react-dom`: one starts late, the other starts now

> In standard HTML parsing, the browser discovers and requests an external asset only when the parser reaches the specific tag referencing it. Consequently, secondary assets such as fonts declared inside an external stylesheet start late. **React 19 lets your components instruct the browser early with four resource hint functions from react-dom: preload, preinit, preconnect, and prefetchDNS**. The final rendered page remains identical, but critical assets arrive significantly earlier because the browser begins network work ahead of time.

When loading an HTML document, the browser parses markup tokens sequentially from top to bottom. As the parser encounters external stylesheet links or image tags, it initiates corresponding network requests. The browser cannot request an external resource until it discovers the specific tag or style rule that references it.

In most static layouts, sequential discovery works adequately. However, modern applications frequently possess advance knowledge of assets before the browser parser can discover them. Two common architectural scenarios cause discovery bottlenecks:
1. **Secondary assets referenced inside other files.** Web fonts are declared inside stylesheets through font face rules. The browser discovers the font file only after downloading, parsing, and applying the external stylesheet.
2. **External servers queried during dynamic workflows.** Data requests initiated inside effects run only after React commits the DOM tree and paints it to the screen (Lesson 32). Until that post-paint moment, the browser network stack has no knowledge that the destination server exists.

Consider a weather page loading over a high-latency network connection. The page displays the city name using a custom web font, the current temperature, and a button to reveal a forecast panel. The component knows immediately upon executing that it requires the custom font and the weather API server. Without resource hints, the browser delays both network requests because it lacks advance warning. React 19 provides four dedicated functions to bridge this gap.

**Why:** Without resource hints, users experience perceptible interface delays. Text rendered in a fallback font abruptly shifts once the custom font arrives, producing a layout shift known as a flash of unstyled text. The temperature field remains vacant while awaiting delayed network round trips. Resource hints do not alter what appears on the screen. They simply notify the browser network stack to begin fetching assets and establishing connections earlier.

### The Four Calls in Four Lines

All four resource hint functions are named exports from `react-dom`, rather than the core `react` package:

```jsx title="The four calls that tell the browser about a resource early"
import { preload, preinit, preconnect, prefetchDNS } from 'react-dom';

~preload~('/fonts/brand.woff2', { as: 'font' }); // 1. Start downloading a file
~preinit~('/forecast.css', { as: 'style', precedence: 'default' }); // 2. Download a stylesheet and put it into use
~preconnect~('https://api.example.com'); // 3. Open a connection to a server
~prefetchDNS~('https://cdn.example.com'); // 4. Only look up the address of a server
```

Notice how each function advances network preparation to a distinct stage:
1. **`preload`** fetches an asset into the browser cache and stops there.
2. **`preinit`** fetches a stylesheet or script and immediately evaluates it in the document.
3. **`preconnect`** downloads no files. It completes the network handshake to open an active connection to an external origin.
4. **`prefetchDNS`** downloads no files and opens no sockets. It resolves the domain name of an external origin into an IP address.

> [!DEFINITION]
> **What is a resource?** [NEW] A resource is any external asset or destination endpoint that an application requests across the network, including stylesheets, fonts, scripts, images, and API servers.
> The React documentation uses this term across all four loading APIs.
> The functions `preload` and `preinit` manage specific files, whereas `preconnect` and `prefetchDNS` configure connections to destination servers (Lesson 84).

> [!DEFINITION]
> **What is a hint?** [NEW] A hint is an advisory instruction sent to the browser network stack to suggest early resource fetching or connection setup.
> The browser inspects the hint and decides when to schedule the operation based on network quality and hardware resources.
> Because hints are advisory, they never crash application rendering: if a browser chooses to ignore a hint, the application functions normally and fetches the asset later through standard discovery (Lesson 84).

### You could already write these hints in HTML

Modern browsers have long supported resource hints through standard link elements placed in the document head:

```html title="index.html"
<link ~rel="preload"~ as="font" href="/fonts/brand.woff2" crossorigin /> <!-- Start the font now -->
<link ~rel="preconnect"~ href="https://api.example.com" /> <!-- Open the connection now -->
<link ~rel="dns-prefetch"~ href="https://cdn.example.com" /> <!-- Look up the address now -->
```

React 19 resource hint functions emit these exact link elements into the document head for you. The primary architectural difference lies in execution timing and scope. A static link placed directly inside the main HTML file applies globally across every route and page load. In contrast, calling a hint function inside a component couples the hint directly to the component lifecycle, ensuring the browser requests the asset only when that component renders.

Developers choose among three strategies for early resource initialization:
1. **Declare static links manually in the root HTML document.** This approach suits global assets required on every initial page visit, such as primary brand stylesheets.
2. **Call hint functions directly inside the component that consumes the resource.** This ensures resource hints trigger dynamically based on conditional rendering and user workflows.
3. **Rely on automated framework optimization.** Full-stack frameworks often analyze component dependencies and automatically inject appropriate resource hints into the document head (Lesson 46).

### They are not an import

Do not confuse resource hint functions with standard JavaScript import statements. An import statement loads JavaScript module source code directly into the runtime evaluation scope. Resource hints do not expose code variables and return no values:
1. `preload` downloads an asset into the browser cache without inserting or applying it.
2. `preconnect` and `prefetchDNS` download no files whatsoever; they only prepare the network path to an external origin.
3. Only `preinit` inserts a stylesheet into the document or executes an external script.

All four functions return undefined and render nothing directly onto the screen.

### The Rule of Thumb: how far must the browser go before the page needs it?

**Evaluate every external dependency by asking: how far should the browser network stack proceed before the application actively consumes the resource? Select the function that advances network preparation to that exact stage.**

```tree caption="The four calls from react-dom and how far each one asks the browser to go before the page needs the resource."
Four hints a component can give the browser early
- +`preload` [`as`] | **Downloads** a file we know we will use | Puts nothing into use
- +`preinit` [`as` `precedence`] | **Downloads and puts into use** a stylesheet or a script | A script runs, a stylesheet applies
- +`preconnect` [`href`] | **Opens a connection** to another server | Downloads no file
- +`prefetchDNS` [`href`] | **Looks up only the address** of a server | Opens no connection and downloads no file
```

Experienced engineers watch for four common architectural pitfalls:
1. **Calling `preload` on a stylesheet that must style markup.** The stylesheet file downloads into the browser cache, but its rules never take effect because no element inserts it into the document.
2. **Preconnecting to the origin hosting the application.** The browser has already established an active connection to load the HTML document, making same-origin preconnections redundant.
3. **Preconnecting to numerous external domains indiscriminately.** Establishing unused socket connections and performing TLS handshakes wastes client memory, CPU cycles, and mobile battery life.
4. **Placing resource hints inside an Effect.** Effects run only after React commits the DOM tree and paints to the screen, which represents the latest possible moment to initiate an asset fetch.

The rest of the lesson demonstrates each technique on the weather application.

## SECTION | A Weather Page on a Slow Connection

Our demonstration application displays the current city, the local temperature, and a button:

```page width=text caption="The weather page once every file and the temperature have arrived."
heading: Paris
line: 18°
line: [Show forecast]
console: quiet
```

On a high-latency network connection, unoptimized pages exhibit noticeable rendering artifacts:
1. Paris initially displays in a fallback system font, then visibly shifts once the custom font arrives.
2. The temperature indicator remains empty while the browser resolves the API domain and completes network handshakes.
3. Clicking the forecast button renders an unstyled vertical list before the dedicated panel stylesheet loads.

The project structure separates concerns into distinct component files. The stylesheets and the custom font reside in the public folder. Vite serves that directory as static assets, making the brand stylesheet accessible at the root path:

```files title="weather-app: File Explorer" caption="The project files of the weather page, with the stylesheets and the font in public/."
index.html | entry | The HTML page with the head and the empty root div
public/
  brand.css | stylesheet | Names the font Brand and gives it to the h1
  forecast.css | stylesheet | Lays out the three forecast days in one row
  fonts/
    brand.woff2 | font file | The app's own font
src/
  main.jsx | boundary | Renders `<WeatherPage />` into `#root`
  WeatherPage.jsx | parent | Shows the city, the temperature, and the Show forecast button
  ForecastPanel.jsx | child | Shows the three days with a sun icon each
```

The main application loads from its hosting origin at `weather.example.com`. It communicates with two external endpoints:
1. **The weather API server** at `https://api.example.com`, which supplies real-time temperature data.
2. **The content delivery network** at `https://cdn.example.com`, which serves forecast weather icons.

Here is the brand stylesheet declaring the custom font. The font asset appears exclusively inside the font face rule:

```css title="public/brand.css"
@font-face {
  font-family: 'Brand';
  src: ~url('/fonts/brand.woff2')~; /* The only place the font file is named */
  font-display: swap;
}

h1 {
  font-family: 'Brand';
}
```

The rule `font-display: swap` instructs the browser to render text immediately using a fallback system font while downloading the custom font in the background. Once the font asset finishes downloading, the browser swaps in the custom typeface. This prevents invisible text delays, but causes a visual layout shift unless the font file begins downloading early.

> [!DEFINITION]
> **What is the Network panel?** [NEW] The Network panel is the browser developer tools tab that records every network request, displaying request timing, file sizes, and priority queues.
> When testing on local hardware, resources arrive instantly.
> Enabling network throttling simulates high-latency mobile connections, making sequential download waterfalls and rendering delays visible (Lesson 01).

Now we resolve each network delay, one API function at a time:

**PRINCIPLES:** Each principle eliminates a specific network delay in the weather application:
1. **`preload` starts the font early.** The font is named inside the stylesheet, so the browser finds it late. `preload` tells the browser to start it now.
2. **`preinit` applies a stylesheet, `preload` only downloads it.** For the forecast panel, the styles must apply, not only arrive.
3. **`preconnect` opens the connection to the weather server before the fetch.** The connection opens while React is still rendering.
4. **`prefetchDNS` only looks up the icon server's address.** The icons are needed only after a click, so a full connection may be wasted.
5. **A click handler starts the forecast stylesheet before the panel renders.** In the handler, the call runs earlier than in the panel.

---

## PRINCIPLE | `preload`: the font starts downloading next to the stylesheet, not after it

> [!PRINCIPLE]
> **Principle 1: preload: Start a File You Know You Will Use Before Anything Names It**
>
> *Call `preload(href, { as })` during render to tell the browser to start downloading a file now; `as` is required, and equivalent calls with the same `href` count as one.*
>
> The browser starts a file only when it finds the tag or the CSS rule that names it. So a font named inside a stylesheet starts only after that stylesheet is downloaded and read. `preload` tells the browser to start the font right away. It returns nothing and applies nothing. The font is still used only when the stylesheet asks for it, but by then it is already on its way.
>
> **DO THIS:**
> ```jsx
> function WeatherPage() {
>   ~preload('/fonts/brand.woff2', { as: 'font' })~; // The font starts next to brand.css, not after it
>   return <link rel="stylesheet" href="/brand.css" precedence="default" />;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function WeatherPage() {
>   ~preload('/brand.css', { as: 'style' })~; // **WRONG:** the font inside brand.css is still found late
>   return <link rel="stylesheet" href="/brand.css" precedence="default" />;
> }
> ```

Here is `preload` in its smallest form, one import and one line:

```jsx title="The smallest preload"
import { ~preload~ } from 'react-dom'; // A named import from react-dom, not from react

function WeatherPage() {
  ~preload('/fonts/brand.woff2', { as: 'font' })~; // Tells the browser to start downloading the font now
  return <h1>Paris</h1>;
}
```

The React documentation states that `preload` lets you eagerly fetch a resource that you expect to use. Eager fetching means initiating network activity before downstream elements explicitly demand the file. In our component, no DOM node has requested the font yet. The browser has not even finished parsing the stylesheet.

The function takes two parameters:
1. **The URL of the resource**, pointing here to the font file in the fonts directory.
2. **The options object with `as`**, a mandatory string specifying the resource type: font, style, script, image, or fetch.

Why does the browser require the `as` property? This maps directly to the standard `as` attribute on HTML preload links. The browser uses this classification to assign appropriate network queue priorities. It also validates Content Security Policy rules and matches cached responses with subsequent requests.

### VS | The preload link by hand vs. the `preload` call: the same link, written at a different moment

Compare a static HTML preload link with the dynamic component call:

```html title="index.html"
<link ~rel="preload" as="font"~ href="/fonts/brand.woff2" crossorigin /> <!-- In the head of every page that loads index.html -->
```

```jsx title="src/WeatherPage.jsx"
~preload('/fonts/brand.woff2', { as: 'font' })~; // React adds the same link when WeatherPage renders
```

Both declarations generate identical runtime outcomes. In both cases, the browser receives an early preload instruction in the document head.

Notice the `crossorigin` attribute on the static HTML link. According to the CSS Fonts specification, browsers always fetch web fonts using anonymous CORS mode. A font preload missing `crossorigin` fails to match the subsequent CSS font request, causing the browser to download the file a second time. React's `preload` function automatically attaches `crossorigin` to font links, preventing duplicate network downloads.

### Why the font starts late without preload

Without an early preload hint, the browser discovers the font only through a sequential waterfall:
1. The browser encounters the stylesheet link for the brand styles and begins downloading it.
2. Once the stylesheet arrives, the browser parses its rules and discovers the font URL in the font face block.
3. Only at this late moment does the browser begin downloading the font file.
4. Until the font arrives, fallback rules display the city heading in a default font before shifting abruptly.

Preloading the stylesheet alongside the font eliminates this sequential delay. The browser initiates both requests in parallel rather than waiting for stylesheet parsing to finish.

```tree dir=right caption="When the browser starts brand.woff2 without preload and with preload, on a slow network setting."
When the font download starts
- !Without `preload` | The browser downloads `brand.css` **first** | It reads the CSS rule and **only then** starts `brand.woff2` | Paris shows in a plain font, **then changes**
- +With `preload` [`as: 'font'`] | `WeatherPage` renders and **gives the hint at once** | The font downloads **next to** `brand.css`, not after it | Paris can show in the app's font **sooner**
```

### The weather page, step 1: the title, its stylesheet, and the font

`WeatherPage` renders the stylesheet link with `precedence` (Lesson 83) alongside the city heading. At the top of the component body, it invokes `preload` for the font asset referenced by that stylesheet:

```jsx title="src/WeatherPage.jsx"
import { preload } from 'react-dom';

export default function WeatherPage() {
  ~preload('/fonts/brand.woff2', { as: 'font' })~; // Starts the font before brand.css is read
  return (
    <main>
      <link rel="stylesheet" href="/brand.css" precedence="default" />
      <h1>Paris</h1>
    </main>
  );
}
```

The font family identifier comes from our application CSS, not from React. The `preload` call never references the family name. It specifies only the resource path.

Inspect the Elements panel after rendering. The document head contains the injected preload link for the font. It also contains a preload link for the stylesheet, which React injects automatically because the stylesheet link appears in JSX. What React cannot inspect automatically are the nested font URLs declared inside CSS rules:

```dom caption="What the Elements panel shows in the head after WeatherPage renders with the preload call."
<head>
  <link rel="stylesheet" href="/brand.css" data-precedence="default">
  <title>Weather</title>
  ...
+ <link rel="preload" href="/fonts/brand.woff2" as="font" crossorigin=""> | note: Added by the preload call
  <link rel="preload" as="style" href="/brand.css"> | note: Added by React for the stylesheet link
</head>
```

The `preload` function returns undefined and renders no DOM elements directly. Its observable traces are the link element in the document head and the corresponding network request. That font request now begins alongside the stylesheet rather than after it.

### Every render calls preload, and the head still holds one link

When user interaction triggers a state update, `WeatherPage` re-renders. The `preload` call executes again with the exact same path argument. React does not add a duplicate link.

Multiple equivalent calls to `preload` have the same effect as a single call. React treats two calls as equivalent when they share the same URL and identical options. Calling `preload` on every render is completely safe: only the first invocation injects the link into the document head.

### Preloading the stylesheet and forgetting its font

Developers often make an incomplete optimization:
1. A developer recognizes that resource preloading accelerates page rendering.
2. They preload the external stylesheet using the style resource type.
3. They neglect to preload the font file declared inside that stylesheet.
4. In our application, preloading the stylesheet adds no performance benefit because React already manages stylesheet loading.
5. The browser still discovers the font only after parsing stylesheet rules, leaving the text swap delay unresolved.

When preloading a stylesheet, always evaluate whether to preload nested fonts as well. The browser starts downloading an asset only when an explicit reference appears.

---

## PRINCIPLE | `preinit`: the stylesheet downloads and its styles apply, `preload` only downloads

> [!PRINCIPLE]
> **Principle 2: preinit: Download a Stylesheet or Script and Put It into Use**
>
> *Use `preinit(href, { as: 'style', precedence })` when a stylesheet must apply, and `preinit(href, { as: 'script' })` when a script must run; `preload` only downloads.*
>
> `preload` and `preinit` both start the download now. When the file arrives, `preload` stops there: the stylesheet is downloaded but not inserted, so its styles never apply. `preinit` also puts the file into use. A script runs as soon as it arrives, and a stylesheet is inserted into the document next to the other stylesheets of the same `precedence`.
>
> **DO THIS:**
> ```jsx
> function ForecastPanel() {
>   ~preinit('/forecast.css', { as: 'style', precedence: 'default' })~; // Downloaded and inserted: the days are styled
>   return <ul className="forecast">...</ul>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ForecastPanel() {
>   ~preload('/forecast.css', { as: 'style' })~; // **WRONG:** downloaded but never inserted, so the days show unstyled
>   return <ul className="forecast">...</ul>;
> }
> ```

### VS | `preload` vs. `preinit` for the same stylesheet: both download it, only one applies it

Compare the two functions applied to the forecast stylesheet:

```jsx title="The same stylesheet given to preload and to preinit"
~preload~('/forecast.css', { as: 'style' }); // Downloads forecast.css: the panel still shows without its styles
~preinit~('/forecast.css', { as: 'style', precedence: 'default' }); // Downloads forecast.css and inserts it: the styles apply
```

Both calls trigger an immediate download for the identical asset file. The Network panel confirms that the stylesheet arrives in both cases. However, their DOM effects differ entirely. Only `preinit` inserts the stylesheet into the document tree so its rules take effect.

The React documentation explains that `preinit` eagerly fetches and evaluates a stylesheet or external script. Evaluating a resource means activating it within the document. Scripts initialized with `preinit` execute immediately upon download completion. Stylesheets initialized with `preinit` are inserted directly into the document head, applying their style rules without delay.

Because `preinit` actively initializes resources, it accepts only two options for the `as` property: script and style.

> [!DEFINITION]
> **What is precedence?** [REVIEW] `precedence` is the prop you put on a stylesheet link so React decides where to insert it among the other stylesheets (Lesson 83).
> A stylesheet given to `preinit` needs it too. The React docs say it is "Required with stylesheets. Says where to insert the stylesheet relative to others."
> Stylesheets with the same `precedence` go together, whether they come from a link tag or from `preinit` (Lesson 83).

```tree caption="What preload and preinit do with forecast.css once the file has arrived."
Two calls that download `forecast.css`
- !`preload` [`as: 'style'`] | **Downloads** the file | Inserts **no stylesheet**, so the forecast days show **without styles**
- +`preinit` [`as: 'style'` `precedence: 'default'`] | **Downloads** the file | **Inserts** it into the document, so the styles **apply right away**
```

### The weather page, step 2: the Show forecast button and the panel

`WeatherPage` introduces a state variable and a button. When the state flag turns true, the component renders the forecast panel:

```jsx title="src/WeatherPage.jsx" startLine="1"
import { useState } from 'react';
import { preload } from 'react-dom';
import ForecastPanel from './ForecastPanel.jsx';

export default function WeatherPage() {
  const [showForecast, setShowForecast] = useState(false);
  preload('/fonts/brand.woff2', { as: 'font' });
  return (
    <main>
      <link rel="stylesheet" href="/brand.css" precedence="default" />
      <h1>Paris</h1>
      <button onClick={() => setShowForecast(true)}>Show forecast</button>
      ~{showForecast && <ForecastPanel />}~ {/* The panel renders only after the click */}
    </main>
  );
}
```

The forecast panel requires its own styling rules. Because no other component uses these styles, the panel calls `preinit` directly:

```jsx title="src/ForecastPanel.jsx"
import { preinit } from 'react-dom';

export default function ForecastPanel() {
  ~preinit('/forecast.css', { as: 'style', precedence: 'default' })~; // Downloads and inserts the panel's stylesheet
  return (
    <ul className="forecast">
      <li>Mon 20°</li>
      <li>Tue 19°</li>
      <li>Wed 17°</li>
    </ul>
  );
}
```

The panel stylesheet arranges the three forecast items into a horizontal row and removes list markers:

```css title="public/forecast.css"
.forecast {
  display: flex;
  gap: 16px;
  list-style: none;
}
```

### The panel with preload: the file arrives, and the styles never apply

When using `preload` instead of `preinit`, the stylesheet arrives in cache while the rendered elements remain unstyled. Consider what happens if a developer replaces `preinit` with `preload` and omits the stylesheet link:
1. The user clicks the button, prompting React to render the forecast panel.
2. The Network panel confirms that the forecast stylesheet downloaded successfully.
3. The three forecast days continue to display as an unstyled vertical bulleted list.
4. A few seconds later, the browser prints a diagnostic warning in the console.

```page width=full caption="A few seconds after the click: Chrome warns that the preloaded stylesheet is not used."
heading: Paris
line: [Show forecast]
line: • Mon 20° | bad
line: • Tue 19° | bad
line: • Wed 17° | bad
console: The resource forecast.css was preloaded using link preload but not used within a few seconds from the window's load event.
```

This console warning originates from the browser preload monitor rather than React. It alerts developers that network bandwidth was consumed by an asset that no DOM element ever referenced.

::: row caption="The forecast panel after the user clicks Show forecast, with preload and with preinit for forecast.css."
::: col title="With preload for forecast.css" tag="downloaded, never applied" tone=bad
```page size=mini
heading: Paris
line: [Show forecast]
line: • Mon 20° | bad
line: • Tue 19° | bad
line: • Wed 17° | bad
```
```dom
<head>
  <link rel="stylesheet" href="/brand.css" data-precedence="default">
  ...
! <link rel="preload" href="/forecast.css" as="style">
</head>
```
The file arrives, and no stylesheet uses it.
:::
::: col title="With preinit for forecast.css" tag="downloaded and applied" tone=good
```page size=mini
heading: Paris
line: [Show forecast]
line: Mon 20° Tue 19° Wed 17° | good
```
```dom
<head>
  <link rel="stylesheet" href="/brand.css" data-precedence="default">
+ <link rel="stylesheet" href="/forecast.css" data-precedence="default">
  ...
</head>
```
React inserts the stylesheet, and the days sit in one row.
:::
:::

Our JSX never declares the stylesheet link that `preinit` injects into the document head. React manages this insertion internally:
1. `ForecastPanel` calls `preinit` specifying the stylesheet path and precedence.
2. React emits the preload hint and inserts the stylesheet element into the document.
3. React positions the link alongside other stylesheets sharing the same precedence tier.

Developers have two viable patterns. You can call `preinit` with precedence, as demonstrated in the panel component. Alternatively, you can render an explicit stylesheet link with precedence in your JSX (Lesson 83). Calling `preload` alone will never apply styling rules to your elements.

---

## PRINCIPLE | `preconnect`: the connection to another server opens before the fetch

> [!PRINCIPLE]
> **Principle 3: preconnect: Open the Connection to Another Server Before the Request Exists**
>
> *Call `preconnect(href)` during render for another server you will request from, when you know the server but not the exact files; it brings nothing for the page's own server.*
>
> A request to a new server first needs a handshake: the browser finds the server and opens a connection. A fetch in an Effect starts only after the commit, so without the hint the handshake starts late too. `preconnect` lets the browser do the handshake while React is still rendering, so the fetch starts on a connection that is already open.
>
> **DO THIS:**
> ```jsx
> function WeatherPage() {
>   ~preconnect('https://api.example.com')~; // Another server: the connection can open before the fetch
>   useEffect(() => { fetch('https://api.example.com/weather?city=Paris'); }, []);
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function WeatherPage() {
>   ~preconnect('https://weather.example.com')~; // **WRONG:** the page's own server is already connected, so this gains nothing
>   useEffect(() => { fetch('https://api.example.com/weather?city=Paris'); }, []);
> }
> ```

### Before the fetch, the browser must connect

Before transmitting an HTTP request to an external server, the browser must complete several preparatory network steps. Establishing this communication channel requires domain name resolution, socket allocation, and cryptographic handshakes. On mobile or high-latency connections, this setup sequence introduces measurable delay before the first byte of data travels across the network.

> [!DEFINITION]
> **What is a handshake?** [NEW] A handshake is the greeting between the browser and a server before any file can travel. MDN names its three parts "DNS+TCP+TLS".
> DNS: the browser looks up the server's address from its name. TCP: the browser opens the line to the server. TLS: the browser and the server set up the encryption of `https`.
> The browser does all three once per server. After that, every request to that server uses the open connection (Lesson 84).

Here is `preconnect` in its minimal implementation. The component declares the target origin during render, while the data fetch executes later inside an effect:

```jsx title="The smallest preconnect"
function WeatherPage() {
  ~preconnect('https://api.example.com')~; // Runs during render: the browser may open the connection now
  useEffect(() => {
    fetch('https://api.example.com/weather?city=Paris'); // Runs after the commit: can use the connection already open
  }, []);
  return <h1>Paris</h1>;
}
```

The React documentation explains that `preconnect` eagerly connects to a server from which you expect to load resources. Crucially, you can provide this hint even before determining the exact resource paths needed. The function accepts a server origin rather than a file path, omitting URL path segments and query strings.

### Why the temperature waits, and how preconnect saves time

Many developers assume that the fetch call initiates the first network interaction with a server. In reality, connection establishment occurs beforehand. Here is the execution order on the initial page load:
1. React evaluates `WeatherPage` during the render phase.
2. The `preconnect` call executes, prompting the browser to begin the network handshake with the API server.
3. React commits the city heading, empty temperature placeholder, and forecast button to the DOM.
4. React runs the effect, which executes the fetch call (Lesson 32).
5. The fetch operation immediately reuses the pre-established socket connection, reducing response latency.

```tree dir=right caption="When the connection to the weather server opens without preconnect and with preconnect."
When the connection to `https://api.example.com` opens
- !Without `preconnect` | Render, then commit, then the Effect starts `fetch` | **Only then** does the browser find the server and open the connection | The temperature line **stays empty longer**
- +With `preconnect` [`https://api.example.com`] | The hint runs **during render** | The connection can open **while React commits** | `fetch` starts on an **open connection**
```

The rendered application displays the identical temperature whether `preconnect` is present or omitted. The optimization benefits network timing exclusively. The Network panel displays no independent download entry for `preconnect` because the call downloads no file bytes.

### The weather page, step 3: the temperature from the weather server

`WeatherPage` now manages a temperature state variable, registers an effect to fetch weather data, and issues a `preconnect` hint for the API server:

```jsx title="src/WeatherPage.jsx" startLine="1"
import { useState, useEffect } from 'react';
import { preload, preconnect } from 'react-dom';
import ForecastPanel from './ForecastPanel.jsx';

export default function WeatherPage() {
  const [temperature, setTemperature] = useState(null);
  const [showForecast, setShowForecast] = useState(false);
  preload('/fonts/brand.woff2', { as: 'font' });
  ~preconnect('https://api.example.com')~; // The connection can open before the Effect runs

  useEffect(() => {
    fetch('https://api.example.com/weather?city=Paris')
      .then(response => response.json())
      .then(data => setTemperature(data.temperature));
  }, []);

  return (
    <main>
      <link rel="stylesheet" href="/brand.css" precedence="default" />
      <h1>Paris</h1>
      {temperature !== null && <p>{temperature}°</p>}
      <button onClick={() => setShowForecast(true)}>Show forecast</button>
      {showForecast && <ForecastPanel />}
    </main>
  );
}
```

Inspect the document head in the Elements panel. The markup contains the injected preconnect link alongside our earlier asset hints:

```dom caption="What the Elements panel shows in the head after WeatherPage renders with the preconnect call."
<head>
  <link rel="stylesheet" href="/brand.css" data-precedence="default">
  <title>Weather</title>
  ...
  <link rel="preload" href="/fonts/brand.woff2" as="font" crossorigin="">
+ <link rel="preconnect" href="https://api.example.com"> | note: Added by the preconnect call
  <link rel="preload" as="style" href="/brand.css">
</head>
```

### preconnect to our own site gains nothing

Preconnection optimizes network requests directed to external origins only. The React documentation warns against a common misconception:
1. A developer discovers that `preconnect` speeds up network asset retrieval.
2. They add a preconnect hint for the application hosting origin.
3. Network performance remains completely unchanged. The browser is already connected to that host because it just downloaded the initial HTML document.

Connecting to the origin hosting the current document provides no benefit because an active socket connection already exists.

> [!DEFINITION]
> **What are same-origin and cross-origin?** [NEW] A request to the server the page came from is same-origin. A request to another server, such as `https://api.example.com`, is cross-origin. These are the MDN words.
> Only cross-origin requests gain from `preconnect`. That is also why our font gets `preload` and not `preconnect`: the font comes from our own site (Lesson 84).

Remember: `preconnect` establishes socket connections with external origins before downstream requests begin.

---

## PRINCIPLE | `prefetchDNS`: only the server's address is looked up, for a request that may never come

> [!PRINCIPLE]
> **Principle 4: prefetchDNS: Look Up a Server's Address When the Request May Never Come**
>
> *Use `prefetchDNS(href)` for a server you may not request from, or for many servers at once; keep `preconnect` for the few servers you will surely use.*
>
> Both calls take a server, not a file. `prefetchDNS` asks the browser only to look up the server's IP address, the first part of the handshake. `preconnect` also opens the connection, which saves more time but costs even when no request ever comes. For icons that appear only after a click, the lookup is enough.
>
> **DO THIS:**
> ```jsx
> function WeatherPage() {
>   preconnect('https://api.example.com');
>   ~prefetchDNS('https://cdn.example.com')~; // Icons only after a click: the cheap lookup is enough
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function WeatherPage() {
>   preconnect('https://api.example.com');
>   ~preconnect('https://cdn.example.com')~; // **WRONG:** a full connection for icons the user may never ask for
> }
> ```

### VS | `prefetchDNS` vs. `preconnect` for the same server: one finds the address, the other also connects

Compare both hint functions targeting the icon CDN server:

```jsx title="The icon server given to prefetchDNS and to preconnect"
~prefetchDNS~('https://cdn.example.com'); // The browser may look up the server's address, and stops there
~preconnect~('https://cdn.example.com'); // The browser may look up the address and also open the connection
```

While both functions target an origin rather than an asset file, their resource costs differ significantly. `prefetchDNS` executes only the preliminary DNS lookup. In contrast, `preconnect` resolves the domain name and completes the full TCP and TLS handshake.

> [!DEFINITION]
> **What is a DNS lookup?** [NEW] A DNS lookup is the search for the number behind a server's name. `cdn.example.com` is a name, and the browser cannot call a name. It needs the number, the server's IP address.
> It works like a phone book: you know the name, and you look up the number. MDN says the name "must be resolved to an IP address before the browser can issue the request".
> The React docs say `prefetchDNS` "provides the browser with a hint that it should look up the IP address of a given server" (Lesson 84).

```tree caption="How far the browser goes for the icon server with prefetchDNS and with preconnect."
Two hints about `https://cdn.example.com`
- +`prefetchDNS` [`https://cdn.example.com`] | **Looks up the IP address** only | Cheap: no connection waits **unused**
- +`preconnect` [`https://cdn.example.com`] | **Looks up the address and opens the connection** | Faster for the first icon, but **costs even if no icon is ever requested**
```

### Which one fits the icon server

Forecast icons load from the CDN origin only if the user chooses to click the forecast button. Many users view current weather without ever expanding the forecast. Opening a full socket connection risks wasting network and battery resources, making a lightweight DNS lookup the ideal preliminary step.

The React documentation distinguishes these two strategies clearly. Use `prefetchDNS` when future requests remain speculative. Use `preconnect` when future requests are guaranteed.

In our weather application:
- **The API server** always provides temperature data and receives `preconnect`.
- **The CDN icon server** receives requests conditionally and gets `prefetchDNS`.

### The weather page, step 4: icons from the icon server

The page component adds `prefetchDNS` to its imports from `react-dom`:

```jsx title="src/WeatherPage.jsx" startLine="2"
import { preload, preconnect, ~prefetchDNS~ } from 'react-dom'; // One more named import
```

The component invokes `prefetchDNS` for the CDN server alongside the existing hints:

```jsx title="src/WeatherPage.jsx" startLine="8"
  preload('/fonts/brand.woff2', { as: 'font' });
  preconnect('https://api.example.com');
  ~prefetchDNS('https://cdn.example.com')~; // The icon server's address is ready if the user clicks
```

`ForecastPanel` now renders an image icon for each forecast day. The data sits in an array and renders using a list mapping pattern (Lesson 18):

```jsx title="src/ForecastPanel.jsx"
import { preinit } from 'react-dom';

const days = [
  { name: 'Mon', temperature: 20 },
  { name: 'Tue', temperature: 19 },
  { name: 'Wed', temperature: 17 },
];

export default function ForecastPanel() {
  preinit('/forecast.css', { as: 'style', precedence: 'default' });
  return (
    <ul className="forecast">
      {days.map(day => (
        <li key={day.name}>
          ~<img src="https://cdn.example.com/icons/sun.png" alt="Sunny" />~ {/* The first request to the icon server */}
          {day.name} {day.temperature}°
        </li>
      ))}
    </ul>
  );
}
```

Pre-resolving the domain benefits users who expand the forecast:
1. `WeatherPage` renders and issues a DNS prefetch hint for the icon CDN.
2. If the user never clicks the button, the browser only performed a lightweight domain resolution.
3. When the user clicks the button, the panel mounts image elements whose domain address is already resolved in cache.

```page width=text caption="The forecast panel after the user clicks Show forecast, with one sun icon from the icon server in each day."
heading: Paris
line: 18°
line: [Show forecast]
line: ☀️ Mon 20° ☀️ Tue 19° ☀️ Wed 17° | good
console: quiet
```

```dom caption="What the Elements panel shows in the head after WeatherPage renders with the prefetchDNS call."
<head>
  <link rel="stylesheet" href="/brand.css" data-precedence="default">
  <title>Weather</title>
  ...
  <link rel="preload" href="/fonts/brand.woff2" as="font" crossorigin="">
  <link rel="preconnect" href="https://api.example.com">
+ <link rel="dns-prefetch" href="https://cdn.example.com"> | note: Added by the prefetchDNS call
  <link rel="preload" as="style" href="/brand.css">
</head>
```

Note an authoring detail: the HTML link attribute is named `dns-prefetch`. React names its export function `prefetchDNS`. Do not confuse the JavaScript function identifier with the HTML attribute string.

### preconnect to every server costs more than it saves

Web performance guidelines caution against indiscriminate preconnections:
1. A complex web application contacts third-party services for analytics, fonts, maps, and content delivery.
2. An overzealous developer adds `preconnect` hints for every external domain.
3. The browser consumes memory and battery maintaining idle socket connections that never transfer data.

Browsers impose limits on concurrent open sockets. Allocating sockets to low-priority origins starves critical application requests. Reserve `preconnect` for primary API endpoints and use `prefetchDNS` for secondary destinations.

---

## PRINCIPLE | A hint in the click handler: the download starts before the new state renders

> [!PRINCIPLE]
> **Principle 5: The Event Handler: Start a Resource Before the State Change That Needs It**
>
> *In the browser, the four calls work anywhere; call them in the event handler that leads to the new state, before the state change, to start the download earlier than during the new render.*
>
> A click already tells us what comes next. React calls the event handler first and renders the new state after it, so a hint in the handler starts the download before React renders the panel. A second, equivalent call in the panel changes nothing, so the panel can keep its own call for any other code that renders it.
>
> **DO THIS:**
> ```jsx
> function handleShowForecast() {
>   ~preinit('/forecast.css', { as: 'style', precedence: 'default' })~; // Starts during the click
>   setShowForecast(true);
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ForecastPanel() {
>   useEffect(() => {
>     ~preinit('/forecast.css', { as: 'style', precedence: 'default' })~; // **WRONG:** starts only after the panel is committed
>   }, []);
>   return <ul className="forecast">...</ul>;
> }
> ```

In browser environments, resource hint functions can run anywhere. They are standard utility functions, not React Hooks. You can invoke them during component rendering, inside effects, or directly within event handlers.

### VS | `preinit` in the panel vs. `preinit` in the click handler: the same call, started at a different moment

Compare invoking `preinit` inside the child component versus the parent click handler:

```jsx title="The same preinit call in ForecastPanel and in the Show forecast handler"
function ForecastPanel() {
  ~preinit('/forecast.css', { as: 'style', precedence: 'default' })~; // Runs when React renders the panel, after the click
}

function handleShowForecast() {
  ~preinit('/forecast.css', { as: 'style', precedence: 'default' })~; // Runs during the click, before React renders anything
  setShowForecast(true);
}
```

Both approaches ensure the stylesheet link enters the document head and styles the panel. The critical distinction lies in dispatch timing.

When a user clicks the button, React executes the bound event handler synchronously. State updates scheduled during the handler process afterward, triggering component re-rendering (Lesson 13). Placing the hint inside the event handler dispatches the network request immediately, allowing asset downloading to occur in parallel while React reconciles the new state.

The React documentation specifically recommends calling `preinit` inside event handlers before transitioning to states requiring external assets. This initiates asset acquisition earlier than waiting for the destination component to render.

```tree dir=right caption="When forecast.css starts downloading with preinit in ForecastPanel and with preinit in handleShowForecast."
After the user clicks `Show forecast`
- !`preinit` in `ForecastPanel` | React runs the handler, and `setShowForecast` asks for a render | React renders `WeatherPage`, then `ForecastPanel` | **Only now** does `forecast.css` start
- +`preinit` in `handleShowForecast` | React runs the handler, and `preinit` runs **first** | `forecast.css` starts **during the click** | The download is already going while React renders the panel
```

### The weather page, step 5: the click handler starts the panel's stylesheet

The page component adds `preinit` to its imports from `react-dom`:

```jsx title="src/WeatherPage.jsx" startLine="2"
import { preload, ~preinit~, preconnect, prefetchDNS } from 'react-dom'; // preinit joins the other three
```

The component introduces an event handler that triggers the stylesheet hint before updating component state:

```jsx title="src/WeatherPage.jsx" startLine="18"
  function handleShowForecast() {
    ~preinit('/forecast.css', { as: 'style', precedence: 'default' })~; // Starts the stylesheet during the click
    setShowForecast(true); // Then asks React to render the panel
  }
```

The button connects directly to that handler:

```jsx title="src/WeatherPage.jsx" startLine="28"
      <button ~onClick={handleShowForecast}~>Show forecast</button> {/* The click runs handleShowForecast */}
```

`ForecastPanel` retains its internal `preinit` call. This preserves component encapsulation: if another view renders the panel independently, the component still ensures its stylesheet loads.

### Two calls, one stylesheet in the head

When the user clicks the button, `preinit` executes twice across the interaction lifecycle:
1. The user clicks the button.
2. React executes the click handler, where `preinit` emits the hint for the forecast stylesheet.
3. The state updater schedules a component re-render.
4. React renders the page and then `ForecastPanel`, which executes `preinit` again with the identical stylesheet URL.
5. React detects the duplicate call and injects no secondary link into the document head.

Multiple calls to `preinit` with identical arguments evaluate as equivalent. React emits a single link element, preserving tidy document markup while starting downloads at the earliest possible instant.

### Moving the call into an Effect starts it last

Some developers mistakenly assume that resource hints violate render purity and move them into effects (Lesson 14). This results in delayed asset loading:
1. A developer places `preinit` inside an effect hook within the panel component.
2. The effect executes only after the panel component commits to the DOM and paints to the screen (Lesson 32).
3. The stylesheet download begins significantly later than during rendering, and much later than inside the click handler.

While calling hints inside effects is technically permitted, it represents the slowest loading strategy. Because React deduplicates equivalent calls, invoking hints during render or inside event handlers introduces zero risk of duplicate downloads.

```tree dir=right caption="The three places to call preinit for forecast.css, from the earliest start to the latest."
Where to call `preinit` for the panel's stylesheet
- +1. In the click handler [`handleShowForecast`] | Runs **during the click** | The **earliest** start
- +2. While rendering the panel [`ForecastPanel`] | Runs when React **renders** the panel | Starts after the state change
- !3. In an Effect of the panel [`useEffect`] | Runs **after the commit** | The **latest** start
```

Remember: user interactions reveal what UI appears next. Initiate asset acquisition inside event handlers.

---

## All 5 Principles Together

### The complete files

Here is the complete implementation of `WeatherPage`, demonstrating render-phase hints and early event handler acquisition:

```jsx title="src/WeatherPage.jsx"
import { useState, useEffect } from 'react';
import { preload, preinit, preconnect, prefetchDNS } from 'react-dom';
import ForecastPanel from './ForecastPanel.jsx';

export default function WeatherPage() {
  const [temperature, setTemperature] = useState(null);
  const [showForecast, setShowForecast] = useState(false);
  ~preload('/fonts/brand.woff2', { as: 'font' })~; // Principle 1: the font starts next to brand.css
  ~preconnect('https://api.example.com')~; // Principle 3: the weather server's connection can open before the fetch
  ~prefetchDNS('https://cdn.example.com')~; // Principle 4: the icon server's address is ready if the user clicks

  useEffect(() => {
    fetch('https://api.example.com/weather?city=Paris')
      .then(response => response.json())
      .then(data => setTemperature(data.temperature));
  }, []);

  function handleShowForecast() {
    ~preinit('/forecast.css', { as: 'style', precedence: 'default' })~; // Principle 5: the panel's stylesheet starts during the click
    setShowForecast(true);
  }

  return (
    <main>
      <link rel="stylesheet" href="/brand.css" precedence="default" />
      <h1>Paris</h1>
      {temperature !== null && <p>{temperature}°</p>}
      <button onClick={handleShowForecast}>Show forecast</button>
      {showForecast && <ForecastPanel />}
    </main>
  );
}
```

The self-contained `ForecastPanel` retains its own stylesheet initialization:

```jsx title="src/ForecastPanel.jsx"
import { preinit } from 'react-dom';

const days = [
  { name: 'Mon', temperature: 20 },
  { name: 'Tue', temperature: 19 },
  { name: 'Wed', temperature: 17 },
];

export default function ForecastPanel() {
  ~preinit('/forecast.css', { as: 'style', precedence: 'default' })~; // Principle 2: inserts the panel's stylesheet, and counts as one with the handler's call
  return (
    <ul className="forecast">
      {days.map(day => (
        <li key={day.name}>
          <img src="https://cdn.example.com/icons/sun.png" alt="Sunny" />
          {day.name} {day.temperature}°
        </li>
      ))}
    </ul>
  );
}
```

### How React calls the components and when each hint runs

On initial load, the root entry renders `WeatherPage`. Three resource hints execute during render evaluation, while data fetching runs post-commit. The panel stylesheet begins during button interaction:

```tree caption="The order in which React calls WeatherPage and ForecastPanel, and when each of the five hint calls runs."
`main.jsx` renders `<WeatherPage />`
- +1. `WeatherPage` renders [`preload` `preconnect` `prefetchDNS`] | Three hints run **during the first render** | The font, the weather server, and the icon address **start early**
  - +2. React commits, then the Effect runs [`fetch`] | The fetch starts **after the commit** | It can find the weather connection **already open**
- +3. The user clicks `Show forecast` [`handleShowForecast`] | `preinit` runs **before** `setShowForecast` | `forecast.css` starts **during the click**
  - +4. `ForecastPanel` renders [`preinit` again] | The equivalent call **counts as one** | One stylesheet in the head; the icons use the **known address**
```

```page width=text caption="The finished weather page after the temperature arrives and the user clicks Show forecast."
heading: Paris
line: 18°
line: [Show forecast]
line: ☀️ Mon 20° ☀️ Tue 19° ☀️ Wed 17° | good
console: quiet
```

### Each resource, and the call that starts it

| Resource | The habit that starts late | The call that starts it early |
| :--- | :--- | :--- |
| **A font named inside a stylesheet** | Wait for the stylesheet, so the browser finds the font only after reading it | `preload(href, { as: 'font' })` during render |
| **A stylesheet that must apply** | `preload` with `as: 'style'`, which downloads it and never inserts it | `preinit(href, { as: 'style', precedence })` |
| **Another server we will request from** | Let the fetch in the Effect open the connection after the commit | `preconnect(href)` during render, never for the page's own server |
| **A server we may never use** | `preconnect` for every outside server | `prefetchDNS(href)`, which only looks up the IP address |
| **A resource needed after a click** | Wait for the new render, or worse, call the hint in an Effect | The hint in the event handler, before the state change |

Remember the central lesson of this chapter. The browser downloads a file only when code actively references it. React 19 resource hint functions declare those references early, dispatching network operations directly from the components that require them.

---

## For the Interview

> **The Interview Question:** How do preload, preinit, preconnect, and prefetchDNS speed up asset loading?

### How to Answer Clearly in 30 Seconds

"The browser initiates network requests only when its parser encounters the markup tag or style rule referencing an asset. Consequently, secondary assets such as fonts declared inside stylesheets or endpoints queried inside component effects suffer delayed discovery. React 19 provides four resource hint functions in `react-dom` that instruct the browser to begin network work ahead of time:
1. **`preload(href, { as })`** eagerly downloads an asset into the browser cache. The `as` property is required to set network priorities.
2. **`preinit(href, { as })`** downloads and actively evaluates an asset: stylesheets are inserted into the document head and require `precedence`, while scripts execute immediately upon arrival.
3. **`preconnect(href)`** completes DNS resolution, TCP handshakes, and TLS negotiation with an external origin, establishing an open socket before queries are dispatched.
4. **`prefetchDNS(href)`** resolves an external domain name to an IP address without allocating sockets, providing low-overhead preparation for speculative destinations.

All four functions return undefined and deduplicate equivalent calls automatically. In browser environments, they can execute during rendering or inside event handlers, enabling assets to begin downloading before state transitions render."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Is it safe to call `preload` in the body of a component that renders many times?"**
   Yes. Multiple equivalent calls to `preload` have the same effect as a single call. React considers two calls equivalent when they specify identical URLs and options. When a component re-renders, the function executes again, but React emits only a single link element into the document head. The call returns undefined and introduces no duplicate network requests. This deduplication guarantee applies across `preinit`, `preconnect`, and `prefetchDNS`.
2. **"When do you choose `preconnect`, `prefetchDNS`, or `preload` with `as: 'fetch'` for a data server?"**
   Select the function matching what you know about the impending request. If you know the exact URL path and parameters, `preload` with `as: 'fetch'` downloads the actual response data eagerly, requiring the `crossOrigin` option. If you know the target origin but not the specific resource path, use `preconnect` to establish the TLS socket early. If the destination origin is speculative or if your application contacts many third-party domains, use `prefetchDNS` to avoid wasting socket pool allocations and battery life. None of these provides any advantage for the application hosting origin, where an active connection already exists.
3. **"Do these calls work the same way on the server, and do you always need to call them yourself?"**
   No to both. In browser runtimes, hint functions can execute during rendering, in event handlers, or inside effects. During Server-Side Rendering, hint functions operate only when invoked while rendering a component or inside an asynchronous context originating from render evaluation. During server rendering, React hoists emitted links into the streaming HTML document head, prioritizing assets critical for initial page loading. Additionally, modern full-stack frameworks analyze bundle graphs and inject resource hints automatically, reducing the need for manual invocations. For JavaScript modules, React also provides `preloadModule` and `preinitModule`.

```tree dir=right caption="Interview comparison: which of the four calls fits which resource on the weather page."
Picking the hint for each resource on the weather page
- +A file we will use [`preload` `as: 'font'`] | **Downloads** early | Applies nothing by itself
- +A stylesheet that must apply [`preinit` `precedence: 'default'`] | **Downloads and inserts** | Best called in the **click handler**
- +A server we will use [`preconnect` `https://api.example.com`] | **Opens the connection** early | No benefit for the **page's own server**
- +A server we may not use [`prefetchDNS` `https://cdn.example.com`] | **Looks up the address** only | Cheap enough for **many servers**
```
