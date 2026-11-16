# Lecture 66: How React Keeps a Tab Click Fast While a Slow Tab Renders

*(Why does one slow tab stop every button on the page from answering?)*

> INTERVIEW QUESTION | ❱❱ MORE | What is concurrent rendering, and how does React keep the interface responsive during heavy computation?

---

## VS | A Normal Update vs. an Update Inside `startTransition`: the normal update freezes the page, the Transition lets the next click in

> The browser executes JavaScript, processes user interactions, and paints pixels on a single main thread. When a state update triggers a heavy render, the main thread freezes, ignoring every user event until the render finishes. **Wrapping a state update in `startTransition` marks it as a Transition: React renders it concurrently in interruptible slices, keeping the browser responsive to subsequent clicks**. The slow tab takes just as long to compute, but the browser handles new user input immediately, and the screen only ever displays a completed render.

In plain JavaScript, running an intensive loop inside a click listener stops the entire page for as long as that loop executes:

```js title="Plain JavaScript: a click handler that keeps the browser busy for one second"
slowButton.addEventListener('click', () => {
  const start = performance.now();
  ~while~ (performance.now() - start < 1000) {} // Does nothing for one second, and everything else waits
});
```

Click that button, and then click any other element on the page. The interface ignores your actions for a full second. The second click is not lost; the browser stores it in an event queue and dispatches it only after the loop finishes.

Why does the page freeze? The browser relies on a single main thread to execute JavaScript, process user interactions, calculate layout geometry, and paint visual frames. Because JavaScript execution shares this single thread with the event loop and rendering engine, running a synchronous loop monopolizes the thread. While that loop runs, the browser cannot dispatch queued events or update the display.

In React, you would rarely place an intentional loop inside an event handler. Yet rendering components is synchronous JavaScript execution on that exact same main thread. Rendering means React invokes your component functions sequentially to generate virtual DOM nodes.

Consider a profile page with a Posts tab that renders 500 items, where each item requires heavy computation. Clicking Posts forces React to call 500 slow component functions back to back. That batch of component calls ties up the main thread just like a heavy loop, freezing the page until all 500 components finish.

React provides a built-in mechanism to designate an update as non-urgent: `startTransition`. You wrap the state setter inside its callback:

```jsx title="The same click, as a normal update and as a Transition"
setTab('posts'); // A normal update: React renders the 500 posts in one pass, and the page waits
~startTransition~(() => { // A Transition: React may pause this render and let the next click in
  setTab('posts');
});
```

Both approaches store `'posts'` inside `tab`. Both display the identical 500 posts after the exact same total computation time. The distinction appears when the user clicks another control while those posts are still rendering in memory. With a standard update, that second click sits frozen in the event queue until all 500 posts finish. With `startTransition`, React yields control back to the browser, allowing the browser to process the user's click immediately.

Keep one core truth in mind throughout this lesson. **A normal update renders to completion without interruption. In contrast, a Transition can be paused or abandoned to let urgent user input run first, and the screen only ever displays a completed render.**

The official React documentation summarizes this capability directly: a key property of Concurrent React is that rendering is interruptible. Interruptible means that urgent browser events can preempt an active render pass before it finishes.

### The Words This Lesson Stands On

> [!DEFINITION]
> **Rendering and committing.** [REVIEW] React updates the user interface through two distinct phases.
> 1. Rendering is React invoking your component functions in memory to compute the new virtual JSX tree based on updated state or props. Any `console.log` inside a component body executes during this phase. This phase touches no real DOM nodes.
> 2. Committing is React applying calculated mutations to the actual browser DOM. Only this phase changes what the user sees on screen.
> In concurrent React, these phases are completely separated: React can pause, resume, or discard an in-memory render pass without ever touching the DOM (Lesson 13).

> [!DEFINITION]
> **The main thread.** [NEW] A thread represents a single execution path where instructions execute sequentially. Browsers execute all JavaScript on a single thread called the main thread. This same thread handles user clicks, dispatches keyboard events, calculates layout geometry, and paints visual pixels. MDN notes: "The main thread is where a browser processes user events and paints." Because React renders on this exact thread, running heavy component trees blocks all user interactions unless React cooperatively yields the thread back to the browser (Lesson 66).

> [!DEFINITION]
> **startTransition and a Transition.** [NEW] `startTransition` is a standalone function exported by the `react` package. It accepts a synchronous callback and executes it immediately with no arguments. Any state setter invoked while that callback runs is marked as a Transition: React's term for a non-urgent UI update that transitions between views, such as switching navigation tabs or filtering search results. `startTransition` returns `undefined`. The React documentation explains: "State updates marked as Transitions will be non-blocking" (Lesson 66).

> [!DEFINITION]
> **Concurrent rendering.** [NEW] In computer science, operations are concurrent when multiple execution paths make progress over overlapping time periods. The React documentation notes that concurrent rendering lets React prepare multiple versions of the UI at the same time. One version is the current DOM tree visible to the user, while another is a pending virtual tree being computed in memory. React can start rendering in the background, pause to let user interactions pass, resume, or discard the draft entirely. Concurrent rendering does not use background threads or Web Workers; it operates entirely on the single main thread by time-slicing work (Lesson 66).

Concurrent rendering transforms how React schedules computation on the single main thread. Instead of locking the browser until a heavy component finishes, React breaks rendering into discrete units of work. If an urgent user interaction arrives, React sets the unfinished background work aside to process the click immediately. If a newer state update makes the background work obsolete, React discards it entirely. Only completely finished, current UI trees ever commit to the DOM.

```tree caption="React's restaurant: in a concurrent render, the one kitchen can set a dish aside or throw it away, and only a finished dish reaches the table."
One kitchen, two kinds of rendering
- !Synchronous rendering | The kitchen finishes the slow dish **before taking any other order** | Every guest **waits** for the slow dish
- +Concurrent rendering | The kitchen can **set the slow dish aside** for an urgent order, or **throw it away** | Only a **finished dish** reaches the table
```

### What Is at Stake

A single computationally expensive view must never paralyze the rest of the application. Under default synchronous rendering, every button, link, and input on the page stops responding while a slow component tree renders. The React documentation states this clearly: with synchronous rendering, once an update starts rendering, nothing can interrupt it until the user can see the result on screen.

Users have no way of knowing that React is busy computing in the background. When a button ignores their click, users assume the site is broken or unresponsive and click repeatedly out of frustration.

This defect often slips past automated tests and local developer checks. A developer who clicks a tab on a high-end desktop machine and waits for the items to load sees the view update cleanly. The freeze only manifests when a user clicks another control while the initial render is in flight, especially on lower-powered mobile devices.

### The Rule of Thumb: must the page answer clicks while this renders?

**Ask one guiding question about every heavy update: must the interface remain responsive to clicks while this renders? If yes, place the heavy state setter inside `startTransition`, while keeping the immediate feedback for what the user touched outside it.**

Senior engineers recognize three classic misconceptions regarding concurrent features:
1. **Assuming React 19 renders every update concurrently by default.** It does not. The React documentation confirms that Concurrent React is opt-in and is only enabled when you use a concurrent feature. Standard state updates remain strictly synchronous until you explicitly opt in.
2. **Assuming a Transition makes slow rendering faster.** It does not reduce CPU time or speed up component execution. The 500 posts require the exact same total rendering duration. A Transition merely allows higher-priority tasks to jump ahead in line.
3. **Assuming concurrency implies multithreading.** It does not use secondary threads or Web Workers. JavaScript remains single-threaded, and React achieves concurrency by cooperatively yielding the main thread between work units.

### Five Ways to Handle a Slow Update

`startTransition` is one strategy among five options for managing slow updates. An experienced engineer evaluates the root cause before selecting a solution:
1. **Leave the update unchanged.** If a component renders fast enough in production scenarios, avoid unnecessary abstraction. As the React documentation advises, avoid premature optimization.
2. **Make the render cheaper.** Reduce unnecessary calculations, skip re-renders using `memo` (Lesson 55), or virtualize long lists to mount only visible DOM rows (Lesson 62). This strategy targets the computational source directly.
3. **Mark the update as a Transition.** Wrap the state setter with `startTransition` in this lesson or `useTransition` in Lesson 67. This pattern applies when your component owns the state setter and the UI genuinely needs to update. The documentation notes that Transitions keep user interface updates responsive even on slow devices.
4. **Defer a derived value with `useDeferredValue`.** Covered in Lesson 68, this approach is ideal when you receive a slow-rendering value through component props and do not control the originating state setter.
5. **Debounce or throttle.** Debouncing waits for user activity to pause before executing, while throttling limits execution to a set frequency interval. While useful for rate-limiting network requests, debouncing does not resolve heavy UI renders; it merely postpones the moment when synchronous rendering freezes the thread.

In our example, switching navigation tabs genuinely requires updating the display, and our component owns the state setter. Wrapping that setter in `startTransition` is the correct architecture. The following sections demonstrate this in a live profile application.

## SECTION | A Profile Page with a Slow Posts Tab

Our example models the profile navigation page featured in the official React documentation. Three navigation buttons line the top: About, Posts, and Contact. The About and Contact panels display simple text strings almost instantaneously. In contrast, the Posts tab renders a collection of 500 post items designed to be computationally slow.

```page width=text caption="The profile page when it opens: three tab buttons and the About line."
line: [About] [Posts] [Contact]
line: Welcome to my profile!
console: quiet
```

The project keeps four files inside the source folder:

```files title="profile-page: File Explorer" caption="How the files of our profile page sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `App` with `createRoot` inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and renders `<ProfileTabs />`
  components/
    ProfileTabs.jsx | state | Holds the chosen tab and renders the three buttons and the panel
    PostsTab.jsx | slow child | Exports `PostsTab`, which renders 500 slow posts
```

The entry file mounts the app with `createRoot`, inside Strict Mode (Lesson 07). The complete file is at the end of the lesson. `App` only renders the tabs:

```jsx title="src/App.jsx"
import ProfileTabs from './components/ProfileTabs.jsx';

export default function App() {
  return <ProfileTabs />;
}
```

`PostsTab` is the slow tab from React's docs. It builds 500 posts in a loop, and it never changes in this lesson:

```jsx title="src/components/PostsTab.jsx"
export default function PostsTab() {
  ~console.log~('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />'); // Prints each time React calls PostsTab

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return <ul className="items">{items}</ul>;
}

function SlowPost({ index }) {
  let startTime = performance.now();
  ~while~ (performance.now() - startTime < 1) {} // Waits 1 millisecond to stand for slow code

  return <li className="item">Post #{index + 1}</li>;
}
```

Three elements in this file warrant examination:
1. **`SlowPost`** is a helper component defined beneath `PostsTab` within the same file. The parent component constructs an array of 500 elements, assigning each a unique `key` prop (Lesson 18).
2. **`index`** represents the iteration counter, passed into every `SlowPost` as a prop. The template expression computes a one-based label so index zero becomes `Post #1`.
3. **`performance.now()`** is a standard browser performance API. It returns a high-resolution timestamp measured in milliseconds since the page loaded. The `while` loop spins synchronously until one millisecond elapses, simulating computationally expensive component work.

Consequently, rendering the Posts tab forces the main thread to spin for one millisecond 500 times, consuming roughly 500 milliseconds of raw CPU time. In development, Strict Mode intentionally invokes component render functions twice to verify purity (Lesson 47), extending the total delay to nearly one second.

Production feeds or complex data visualizations run slowly due to nested layout recalculations or SVG rendering. This artificial loop provides a reproducible simulation of heavy computational work.

We will build the `ProfileTabs` component and systematically refine it across four core architectural principles:

**PRINCIPLES:** A normal update renders synchronously to completion without interruption, while a Transition renders concurrently and can be interrupted by urgent input. Four principles govern this behavior:
1. **Principle 1: Synchronous Rendering Freezes the Entire Page.** A standard update executes in an uninterruptible pass on the main thread, ignoring all user clicks until rendering finishes.
2. **Principle 2: startTransition Keeps the Main Thread Responsive.** Concurrent execution is enabled per update. Wrapping a setter inside `startTransition` marks it as a Transition, allowing the browser to process clicks during the render.
3. **Principle 3: Partial Renders Never Mutate the Screen.** React computes Transitions in memory and touches the DOM only upon completion. Pausing or discarding an in-progress render leaves the existing UI untouched.
4. **Principle 4: Urgent Input Preempts Background Transitions.** React prioritizes immediate interaction feedback over background work. A single click can dispatch an urgent update for the tab button and a Transition for the slow panel.

---

## PRINCIPLE | A normal `setTab`: the whole page waits until the slow tab is rendered

> [!PRINCIPLE]
> **Principle 1: Synchronous Rendering: A Normal Click on Posts Freezes the Whole Page**
>
> *An update not marked with a concurrent feature renders in one uninterrupted, synchronous pass; while it runs, the browser handles no click and paints nothing until React has committed the result.*
>
> React renders components on the browser's single main thread, which also handles user clicks, executes scripts, and paints the screen. Invoking `setTab('posts')` directly triggers an uninterruptible synchronous render of all 500 slow components. The entire application freezes rather than just the active panel, forcing subsequent user interactions to wait until the posts finish rendering and committing. For fast views that render instantly, a normal synchronous setter remains the correct choice.
>
> **DO THIS:**
> ```jsx
> <button onClick={() => ~setTab('about')~}>About</button> // The About line renders in a moment, so a normal update is fine
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <button onClick={() => ~setTab('posts')~}>Posts</button> // **WRONG:** 500 slow posts render in one pass, and every click on the page waits
> ```

### The Tabs as Normal Updates

Each button invokes `setTab` with its respective tab identifier, while the container renders the view matching the current value of `tab`. This mirrors standard state-driven navigation:

```jsx title="src/components/ProfileTabs.jsx"
import { useState } from 'react';
import PostsTab from './PostsTab.jsx';

export default function ProfileTabs() {
  const [tab, setTab] = useState('about');

  return (
    <section>
      <button onClick={() => setTab('about')}>About</button>
      <button onClick={() => ~setTab('posts')~}>Posts</button> {/* A normal update: renders the 500 posts in one pass */}
      <button onClick={() => setTab('contact')}>Contact</button>
      <hr />
      {tab === 'about' && <p>Welcome to my profile!</p>}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <p>Contact me at admin@mysite.com</p>}
    </section>
  );
}
```

Upon initial mounting, `tab` initializes to `'about'`, displaying the introductory message.

### What Happens After Posts, Then Contact

**Clicking Posts during a normal update does not isolate the freeze to the Posts container; it locks the entire browser tab and renders the Contact button unresponsive.** Here is the precise sequence of events when a user clicks Posts and immediately clicks Contact:
1. The screen displays the About view.
2. The user clicks Posts, invoking `setTab('posts')` to request a re-render from React (Lesson 13).
3. React begins evaluating the tree synchronously, calling the tabs component, then `PostsTab`, and finally all 500 slow post components in sequence. The Console records the diagnostic log from the slow tab.
4. While React is actively executing those 500 component functions, the user clicks Contact. The page exhibits no response. The browser cannot run the click listener and holds the event in its queue.
5. React completes the entire render pass and commits the changes to the DOM, mounting 500 post elements on the screen.
6. Only after the main thread is released can the browser process the queued Contact click. React then executes a second render for the Contact view, replacing the 500 posts with the contact details.

If the user clicks Posts and simply waits, the posts stay. The Console shows the log line twice, because Strict Mode calls `PostsTab` twice in development:

```page width=text caption="The profile page after the user clicks Posts and waits: the top of the list of 500 posts, and the log line printed twice by Strict Mode."
line: [About] [Posts] [Contact]
line: Post #1
line: Post #2
line: Post #3
line: Post #4
log: [ARTIFICIALLY SLOW] Rendering 500 <SlowPost /> | PostsTab.jsx:2
log: [ARTIFICIALLY SLOW] Rendering 500 <SlowPost /> | PostsTab.jsx:2
```

The user's second click was preserved rather than discarded, but the browser could not process it while synchronous execution occupied the thread. For nearly one full second in development, the interface appeared completely frozen, giving the user the impression that their click was lost. In production environments without Strict Mode, this freeze lasts approximately 500 milliseconds.

### Why the Whole Page Freezes: one main thread

MDN describes the main thread as the environment where a browser processes user events and paints. By default, the browser uses this single thread to run all page JavaScript, compute layout, handle reflows, and perform garbage collection.

Because React executes on this shared thread, running 500 slow components monopolizes the thread entirely. While that render executes, the browser is unable to perform critical tasks:
- It cannot trigger the event listener attached to the Contact button.
- It cannot compute layout changes or paint frames anywhere on the page.

React terms this default behavior **synchronous rendering**, executing an update in a single uninterrupted transaction. This work is **blocking** because it prevents the browser from responding to user actions until the entire render completes. As MDN observes, long-running functions block the main thread, leading to an unresponsive page and a degraded user experience.

```tree dir=right caption="A normal click on Posts: React renders the posts on the main thread, and the Contact click waits until the render is committed."
One normal update on the main thread
- +1. The user clicks Posts [`setTab`] | React starts **one render** of the Posts tab
- !2. React calls 500 `SlowPost` components | The main thread is **busy** | The Contact click **waits**, and **nothing is painted**
- +3. React commits the posts | The 500 posts **go into the DOM**
- +4. The browser handles the Contact click | The Contact line **replaces the posts**
```

Developers often assume that slowness in one component leaves adjacent controls unaffected. But the browser has no separate execution thread for neighboring buttons. The active panel, navigation controls, and display updates all contend for the exact same main thread.

### The Real Mistake: Looking for a Bug in the Other Button

This responsiveness bug frequently escapes detection during local development on high-end hardware. Here is how the issue manifests in production:
1. A developer implements a view that renders an extensive data table or complex chart.
2. The view renders smoothly on a powerful workstation, leading the developer to ship the feature.
3. On mobile devices with lower single-core CPU speeds, users tap the tab and then attempt to navigate elsewhere, finding the screen momentarily unresponsive.
4. The developer suspects a bug inside the destination tab's click handler.
5. The click handler contains no errors. The main thread was simply occupied executing the slow render, and synchronous rendering cannot be interrupted.

Remember this foundational rule: a normal update executes to completion in a single uninterrupted pass, and every subsequent action waits behind it.

---

## PRINCIPLE | `startTransition`: the browser keeps answering clicks while the slow tab renders

> [!PRINCIPLE]
> **Principle 2: Opt-In Concurrency: startTransition Keeps the Page Answering Clicks**
>
> *Concurrent rendering is turned on update by update; a state update made inside `startTransition` from `react` is a Transition, and the browser can handle clicks while React renders it.*
>
> React executes standard updates synchronously by default, even in React 19. Only updates explicitly marked with a concurrent API render concurrently. The `startTransition` utility executes its callback immediately and registers any state changes triggered within it as Transitions. During a Transition render, React periodically yields control, allowing the browser to process clicks and paint updates. A subsequent Transition queues behind an active one, meaning a click on Contact still waits for the posts until an urgent update is introduced in Principle 4. The posts require the same computation time, but the page avoids freezing.
>
> **DO THIS:**
> ```jsx
> function selectTab(nextTab) {
>   ~startTransition~(() => { // A Transition: the browser still handles clicks while the posts render
>     setTab(nextTab);
>   });
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function selectTab(nextTab) {
>   ~setTab(nextTab)~; // **WRONG:** a normal update, so the slow tab still freezes the page in React 19
> }
> ```

### VS | `setTab` Called Directly vs. Inside `startTransition`: the same posts, only one page keeps answering

To centralize tab navigation, we create a unified handler named `selectTab`, allowing each button to pass its desired tab name. Contrast the two approaches:

```jsx title="With setTab called directly: a normal update"
function selectTab(nextTab) {
  ~setTab(nextTab);~ // Renders the new tab in one pass that nothing can interrupt
}
```

```jsx title="With startTransition: a Transition"
function selectTab(nextTab) {
  ~startTransition~(() => { // Marks setTab as a Transition: the browser still handles clicks during its render
    setTab(nextTab);
  });
}
```

While both implementations store the identical tab value in state, their runtime characteristics differ significantly. If the user clicks Posts and allows the view to load, both versions display the 500 posts after the exact same elapsed time. But if the user clicks Contact while that render is underway, only `startTransition` allows the browser to process the click immediately and continue painting frames.

Observe what remains unchanged: the posts do not render any faster. Marking an update with `startTransition` makes the render pass interruptible; it does not accelerate component execution.

### What startTransition Turns On

React introduced concurrent rendering in React 18, but the engine does not apply concurrent execution globally. Concurrency activates only for updates flagged by a **concurrent feature**: a specific API that enables non-blocking scheduling for selected work. React provides four primary concurrent features. Two are `startTransition` and `useTransition`. The other two are `useDeferredValue` and Suspense.

The React documentation emphasizes this design: there is no global concurrent mode, only individual concurrent features.

```tree caption="Concurrent rendering is turned on update by update: only an update marked with a concurrent feature can be interrupted."
Which updates React renders concurrently
- !A normal update [`setTab`] | Rendered **synchronously** in one pass | **Nothing can interrupt** it
- +An update inside `startTransition` [`startTransition` `setTab`] | Marked as a **Transition** | Rendered **concurrently**, and **the browser handles clicks** during it
```

Concurrent features additionally depend on the modern root initialized with `createRoot` (Lesson 07). As official guides state, modern concurrent capabilities require `createRoot` to function. Our entry module already implements this setup.

### startTransition on the Profile Page

We import `startTransition`, implement `selectTab`, and connect each button with its respective tab name:

```jsx title="src/components/ProfileTabs.jsx" startLine="1"
import { ~startTransition~, useState } from 'react'; // startTransition comes from react
import PostsTab from './PostsTab.jsx';

export default function ProfileTabs() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    ~startTransition~(() => { // React calls this function at once and marks setTab as a Transition
      setTab(nextTab);
    });
  }

  return (
    <section>
      <button onClick={() => selectTab('about')}>About</button>
      <button onClick={() => selectTab('posts')}>Posts</button>
      <button onClick={() => selectTab('contact')}>Contact</button>
      <hr />
      {tab === 'about' && <p>Welcome to my profile!</p>}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <p>Contact me at admin@mysite.com</p>}
    </section>
  );
}
```

The `nextTab` parameter receives the target tab string from the invoking button, such as `'contact'`. The posts component implementation remains untouched.

### What Happens After Posts, Then Contact

**The browser now processes the Contact click without delay, but the Contact view still waits for the posts to finish.** Here is how React executes this interaction:
1. The user clicks Posts. React runs the callback immediately, registering `setTab('posts')` as a background Transition.
2. React begins rendering the posts tree in memory. The screen continues displaying the About view, providing no visual indication that background work has begun.
3. The user clicks Contact while the posts are rendering. Because React yields the thread periodically, the browser handles the event right away. The handler executes, submitting `setTab('contact')` as another Transition.
4. React does not discard the in-progress Posts render for a second Transition. By default, one Transition does not preempt another Transition; only an urgent update interrupts it, as demonstrated in Principle 4. React completes all 500 posts and commits them to the DOM.
5. React immediately evaluates the subsequent state change for `'contact'`, replacing the posts list with the Contact panel. The posts remain in the DOM for only a brief moment before being unmounted.

```page width=text caption="The profile page after the user clicks Posts and then Contact during the render: once the posts finish rendering, the Contact line replaces them."
line: [About] [Posts] [Contact]
line: Contact me at admin@mysite.com | good
log: [ARTIFICIALLY SLOW] Rendering 500 <SlowPost /> | PostsTab.jsx:2
log: [ARTIFICIALLY SLOW] Rendering 500 <SlowPost /> | PostsTab.jsx:2
```

The user still waits roughly one second in development for the Contact view to settle, just as with synchronous rendering. However, the browser main thread remains unblocked: it accepts inputs and renders animations while React computes the posts. In contrast, synchronous rendering froze all browser activity for that entire duration.

The Console logs the render message from the posts component twice due to Strict Mode's development verification pass.

### The Page Gives No Sign Yet

One usability limitation persists. When a user clicks Posts and waits, the interface provides no immediate visual feedback. The About text stays on screen, and the button does not indicate that an action was registered. As the documentation points out, `startTransition` alone provides no mechanism to track whether a Transition is currently pending. Principle 4 resolves this by managing a second state variable, while Lesson 67 introduces the `useTransition` Hook and its built-in `isPending` flag.

### What startTransition Marks, and What It Does Not

`startTransition` applies exclusively to state updates dispatched synchronously during its callback execution. Two important constraints arise:
1. **Asynchronous updates are excluded.** State setters called inside timeouts or promise handlers are not treated as Transitions unless separately wrapped. As the documentation notes, performing state updates inside asynchronous timers like `setTimeout` does not mark them as Transitions.
2. **Controlled text inputs must remain synchronous.** The text value of an input field should never be managed via a Transition. Users expect immediate visual feedback on every keystroke. Coordinating fast text inputs alongside slow lists is covered in Lessons 67 and 68.

In production applications, developers rarely call `startTransition` manually for page navigation. Leading client-side routers and application frameworks wrap route transitions inside `startTransition` automatically.

### The Real Mistake: Upgrading to React 19 and Changing Nothing

1. A developer upgrades a project to React 19, noting that React supports concurrent rendering.
2. The developer expects computationally heavy tabs to stop freezing the interface automatically without altering existing code.
3. The interface continues to freeze because default state updates remain synchronous.
4. Official documentation clarifies why: concurrent rendering is strictly opt-in and activates only when invoking a concurrent feature.
5. The solution requires wrapping the heavy state setter inside `startTransition`.

React made concurrency an explicit choice by design. Official documentation describes concurrent rendering as technically a breaking change because interruptible rendering alters component lifecycle timing. React activates concurrency exclusively where application code explicitly requests it.

Remember this contrast: standard updates execute synchronously to completion without interruption, whereas state updates wrapped in `startTransition` render concurrently.

---

## PRINCIPLE | A Transition render: the screen never shows half of the posts

> [!PRINCIPLE]
> **Principle 3: Consistent UI: The Half-Rendered Posts Never Reach the Screen**
>
> *React renders a Transition in memory and changes the DOM only at the end, once the whole tree is ready; a render that is paused or abandoned leaves the page exactly as it was.*
>
> Rendering involves React evaluating component functions in memory; committing involves React applying mutations to the real browser DOM. During concurrent execution, React yields the main thread to the browser between chunks of work, withholding all DOM mutations until the entire component tree finishes rendering. If an urgent update preempts the current work, React discards the in-progress tree entirely, leaving the existing DOM unchanged until a new render completes. Because React can discard and re-render components at will, render functions must remain strictly pure.
>
> **DO THIS:**
> ```jsx
> function SlowPost({ index }) {
>   ~return~ <li className="item">Post #{index + 1}</li>; // Pure: the same JSX whether React keeps this render or throws it away
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> let renderCount = 0;
> function SlowPost({ index }) {
>   ~renderCount++~; // **WRONG:** also counts renders that React throws away, so it no longer matches the screen
>   return <li className="item">Post #{index + 1}</li>;
> }
> ```

### VS | Rendering vs. Committing: the Console prints at once, the page changes only at the end

Review the interaction from Principle 2 when the user clicks Posts and waits. The Console prints the diagnostic log from `PostsTab` immediately following the click, proving that React has already started executing the component. Yet the browser displays the About text for nearly a second before all 500 posts appear simultaneously.

Beginners often conflate rendering a component with updating the screen. They are distinct phases executed at separate times (Lesson 13):
- **Rendering** is React executing component functions in memory to construct virtual DOM nodes. Console statements placed inside component bodies run during this phase (Lesson 54).
- **Committing** is React mutating real browser DOM nodes. Only this phase changes the visible elements on the screen.

In concurrent rendering, React frequently performs the render phase in memory without ever committing the result.

```tree dir=right caption="Rendering happens in memory; only the commit changes the DOM, and an abandoned render never reaches the commit."
Two steps between a click and the screen
- +1. Render | React **calls our components** in memory | The `console.log` in `PostsTab` **prints here**
- +2. Commit | React **changes the DOM** | The user **sees the result**
- !An abandoned render | Step 1 runs, **step 2 never does** | The page stays **exactly as it was**
```

By decoupling rendering from committing, React ensures that an incomplete render never leaks onto the page. React evaluates the entire component tree in memory before touching a single DOM node. If a newer interaction supersedes that render, React discards the draft tree, ensuring that only finished, up-to-date UI trees ever reach the screen.

### What the Elements Panel Shows While the Posts Render

The React documentation guarantees that the UI appears consistent even if a render is interrupted. To achieve this consistency, React defers all DOM mutations until the entire component tree has been evaluated. Two terms deserve clarification:
- **Consistent** means the user interface always reflects a coherent, complete state, never a fragmented mixture of past and future views.
- **DOM mutations** refer to native document tree modifications performed during the commit phase, such as appending, updating, or removing HTML elements.

During concurrent rendering, React periodically **yields** to the browser. It pauses its internal execution to relinquish the main thread, enabling the browser to process incoming events or repaint the screen. As the documentation states, React yields control to the browser during concurrent rendering.

**The real DOM updates in a single atomic step, switching directly from the About line to the complete list of 500 posts.** Here is the execution progression when a user clicks Posts and waits:
1. The user clicks Posts, prompting React to begin a background Transition render for `PostsTab`.
2. The Console records the diagnostic log as React starts evaluating component functions in memory.
3. React pauses periodically to yield control to the browser. Any paint operation performed during these pauses shows the original About view because no DOM nodes have been altered.
4. React finishes evaluating all 500 `SlowPost` components in memory.
5. React executes the commit phase. The DOM transitions in a single update from the About text to the complete list.

Consequently, the browser Elements inspector never contains an incomplete list. Prior to the click, it holds the About paragraph:

```dom caption="The Elements panel before the click: the section holds the three buttons, the line, and the About paragraph."
<section>
  <button>About</button>
  <button>Posts</button>
  <button>Contact</button>
  <hr>
+ <p>Welcome to my profile!</p> | note: The About line stays while the posts render in memory
</section>
```

After React commits the Posts tab, the same spot holds the whole list, added in one change:

```dom caption="The Elements panel after the Posts tab is committed: the About paragraph is replaced by the whole list of 500 posts, added in one DOM change."
<section>
  <button>About</button>
  <button>Posts</button>
  <button>Contact</button>
  <hr>
+ <ul class="items"> | note: One DOM change, straight from About to all 500 posts
    <li class="item">Post #1</li>
    <li class="item">Post #2</li>
    <li class="item">Post #3</li>
* and 497 more li elements, up to Post #500
  </ul>
</section>
```

### Pause, Abandon, Throw Out

The React documentation outlines three operational states for concurrent render passes:
1. **Pause and continue.** React can start rendering an update in memory, pause to yield control, and resume later. The posts view pauses whenever React yields to the browser.
2. **Abandon.** React can abandon an in-progress render entirely when an incoming interaction supersedes the active work, as shown in Principle 4.
3. **Discarding stale work.** An in-progress render invalidated by a newer state change represents stale work, which React discards from memory.

### Why the Rule Matters More in a Concurrent Render

Developers sometimes worry that pausing midway through rendering 500 components leaves a partially built list visible on screen. In practice, that never happens.

Under synchronous rendering, intermediate painting is impossible because JavaScript execution monopolizes the main thread until the entire tree finishes. Under concurrent rendering, however, React intentionally yields the thread, giving the browser opportunities to paint.

If React mutated the DOM incrementally during rendering, the user would witness an awkward hybrid state, such as 150 posts rendered underneath the old About line. By retaining all mutations in memory until the entire tree finishes, React ensures that the DOM updates in a single atomic commit.

### The Real Mistake: Code in the Component Body That Changes Something Outside It

Decoupling rendering from committing imposes a strict architectural requirement on application code: components must be pure functions. Because rendering is interruptible, React may invoke a component function for a render pass that is later discarded.
1. A developer introduces side effects directly within a component render body, such as mutating a module-scoped counter or sending analytics events.
2. Under synchronous rendering, every render pass committed to the DOM, creating the false illusion that render execution mapped one-to-one with visible screen updates.
3. During a Transition, React may render a component in memory, abort the work, and re-render later with updated state.
4. As a result, the external mutation runs for intermediate passes that never reached the screen, corrupting tracking counters and external state.
5. Official documentation cautions that because concurrent rendering is interruptible, components behave differently when concurrency is enabled.

The remedy follows the foundational purity law established in Lesson 14: keep component render functions free of side effects, confining external mutations to event handlers or Effects. Strict Mode accelerates discovery of these bugs in development by intentionally rendering components twice (Lesson 47). As documentation notes, `<StrictMode>` helps surface concurrency-related defects early in development.

Remember this principle: Transitions are interruptible, and the browser displays only fully completed renders.

---

## PRINCIPLE | `setSelected` outside `startTransition`: the clicked tab answers before the slow posts

> [!PRINCIPLE]
> **Principle 4: Priorities: The Clicked Tab Turns Bold Before the Slow Posts**
>
> *Keep the update for what the user touched outside `startTransition`; React renders and commits urgent updates first, and an urgent update interrupts a Transition that is under way.*
>
> Keep the state update for the immediate control the user touched outside `startTransition`. React renders and commits urgent updates ahead of background work, and an urgent update immediately interrupts an in-progress Transition. Assigning priority levels allows a single interaction to produce two coordinated state changes: an urgent update providing immediate feedback, such as highlighting the clicked tab, and a Transition managing the computationally heavy panel. Because React yields control during Transition rendering, subsequent user interactions execute without latency and abort obsolete background work.
>
> **DO THIS:**
> ```jsx
> function selectTab(nextTab) {
>   ~setSelected(nextTab);~ // Urgent: the clicked tab turns bold at once
>   startTransition(() => {
>     setTab(nextTab);
>   });
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function selectTab(nextTab) {
>   startTransition(() => {
>     ~setSelected(nextTab);~ // **WRONG:** the bold tab now waits for the 500 slow posts
>     setTab(nextTab);
>   });
> }
> ```

### VS | `setSelected` vs. `setTab` Inside `startTransition`: the same tab name, two priorities

Principle 2 resolved main thread blocking, but left a significant user experience deficiency. When clicking Posts, the screen provides no feedback until the 500 posts finish, and clicking Contact still waits behind the initial render. Production interfaces require instantaneous acknowledgement: the active tab button should highlight immediately upon interaction, with the heavy content container loading when ready.

Achieving this responsive behavior requires generating two updates from a single user action. As the React documentation explains, a single user input should result in both an urgent update and a non-urgent one. The `selectTab` function updates two independent pieces of state:

```jsx title="Two updates from one click"
function selectTab(nextTab) {
  ~setSelected(nextTab);~ // An urgent update: the clicked tab turns bold at once
  startTransition(() => {
    ~setTab(nextTab);~ // A Transition: the panel follows when its render is finished
  });
}
```

While both setters run within the same event handler and receive the same target value, their priority profiles differ fundamentally:
- **`setSelected(nextTab)`** registers as an urgent update, which React renders and commits to the DOM immediately.
- **`setTab(nextTab)` wrapped in `startTransition`** registers as a non-urgent Transition, which React computes in the background and commits only when finished, allowing urgent work to preempt it.

> [!DEFINITION]
> **An urgent update.** [NEW] An urgent update is a standard synchronous state update dispatched outside `startTransition`, such as calling `setSelected('posts')` within a click handler. The React documentation notes: "Urgent updates reflect direct interaction, like typing, clicking, pressing, and so on." React assigns priority levels to all scheduled tasks, ensuring urgent updates execute ahead of background work. When an urgent update arrives while a Transition is rendering, React interrupts the background work, processes the urgent update, and restarts or discards the Transition accordingly (Lesson 66).

```tree caption="One click makes two updates: an urgent one for the tab the user touched, and a Transition for the slow panel."
One click on Posts, two updates
- +Urgent update [`setSelected`] | React renders and commits it **at once** | The Posts tab **turns bold** right after the click
- +Transition [`startTransition` `setTab`] | React renders it **after the urgent update** | The posts **replace the About line** when the render is finished
```

### Two State Variables on the Profile Page

We introduce a second state variable named `selected`. It stores the tab the user selected most recently, while `tab` controls which content container renders. The values diverge temporarily while a background Transition is in flight:

```jsx title="src/components/ProfileTabs.jsx" startLine="4"
export default function ProfileTabs() {
  const [selected, setSelected] = ~useState('about')~; // The tab the user clicked last
  const [tab, setTab] = useState('about'); // The tab the panel shows

  function selectTab(nextTab) {
    ~setSelected(nextTab);~ // Urgent: the clicked tab turns bold at once
    startTransition(() => {
      ~setTab(nextTab);~ // Transition: the panel follows
    });
  }
```

Each navigation item evaluates `selected` against its identifier. The active tab renders wrapped in a `<b>` bold element to indicate selection, matching the pattern in the React documentation. Inactive tabs remain interactive button elements. Each item selects its presentation using a ternary operator (Lesson 10):

```jsx title="src/components/ProfileTabs.jsx" startLine="17"
      {selected === 'about' ? <b>About</b> : <button onClick={() => selectTab('about')}>About</button>}
      {~selected === 'posts'~ ? <b>Posts</b> : <button onClick={() => selectTab('posts')}>Posts</button>} {/* Bold text while selected holds 'posts', a button otherwise */}
      {selected === 'contact' ? <b>Contact</b> : <button onClick={() => selectTab('contact')}>Contact</button>}
```

The posts tab component implementation remains unchanged.

### What the User Sees After Posts, Then Contact

Upon initial load, the About tab renders as bold text while Posts and Contact render as clickable buttons:

```page width=text caption="The profile page when it opens: the About tab is bold text, and Posts and Contact are buttons."
line: About [Posts] [Contact]
line: Welcome to my profile!
console: quiet
```

**The navigation tab clicked by the user responds immediately, while slow container rendering runs non-blockingly in the background.** Here is the runtime flow when a user clicks Posts and immediately clicks Contact:
1. The page displays the introductory About text with the About tab styled in bold.
2. The user clicks Posts. React receives two scheduled updates: `selected` as an urgent update and `tab` as a background Transition.
3. React renders and commits the urgent update right away. The Posts tab displays in bold, providing instant tactile feedback while the panel continues showing the About text.
4. React initiates the background Transition render for the 500 posts, yielding control periodically to the browser as established in Principle 3.
5. The user clicks Contact during that background render. Invoking `setSelected('contact')` submits a new urgent update, immediately interrupting and aborting the in-progress Posts render.
6. React renders and commits the latest state for `'contact'`, switching the bold styling to Contact and mounting the contact text. None of the 500 posts ever mount to the DOM.

Right after the Posts click, the page shows the new bold tab over the old panel:

```page width=text caption="Right after the Posts click: the Posts tab is bold, and the panel still shows the About line while the posts render in memory."
line: [About] Posts [Contact]
line: Welcome to my profile!
log: [ARTIFICIALLY SLOW] Rendering 500 <SlowPost /> | PostsTab.jsx:2
log: [ARTIFICIALLY SLOW] Rendering 500 <SlowPost /> | PostsTab.jsx:2
```

After the Contact click, the Contact tab is bold, and the panel skips straight to the Contact line:

```page width=text caption="After the Contact click: the Contact tab is bold, and the panel shows the Contact line without ever showing a post."
line: [About] [Posts] Contact
line: Contact me at admin@mysite.com | good
log: [ARTIFICIALLY SLOW] Rendering 500 <SlowPost /> | PostsTab.jsx:2
log: [ARTIFICIALLY SLOW] Rendering 500 <SlowPost /> | PostsTab.jsx:2
```

Notice that the Console still displays the diagnostic log from the aborted Posts render. React began executing `PostsTab` in memory, but abandoned the work before reaching the commit phase. This demonstrates Principle 3 directly: computation occurred in memory without ever altering the DOM.

While beginners assume React processes updates strictly in dispatch order, React actually schedules execution based on task priority. The documentation confirms this rule: updates wrapped in `startTransition` are treated as non-urgent and are interrupted whenever higher-priority interactions such as clicks or keystrokes occur.

### Where the Priorities Show: the Scheduler track

Application code never specifies numeric priority levels directly. Instead, React assigns priorities internally, which become visible within browser DevTools via the Scheduler timeline of React's Performance tracks (Lesson 64). These diagnostic timelines are available in development and profiling builds. As documentation describes, the Scheduler is React's internal subsystem for orchestrating tasks by priority. The timeline exposes four priority categories:
1. **Blocking**: Synchronous updates initiated by direct user interactions, such as our `setSelected` call.
2. **Transition**: Non-blocking background rendering typically initiated through `startTransition`, such as our 500 posts render.
3. **Suspense**: Work associated with Suspense boundaries, including displaying fallback placeholders and revealing loaded content (Lesson 69).
4. **Idle**: Lowest-priority background maintenance executed only when no higher-priority tasks await.

```tree caption="The four subtracks of the Scheduler track, from the most urgent priority to the lowest."
The Scheduler track in the Performance panel
- +Blocking | **Synchronous updates**, often from user interactions | Our **`setSelected`** on each click
- +Transition | **Non-blocking work** in the background | Our **render of the 500 posts**
- +Suspense | Work for **Suspense boundaries** | Fallbacks and revealed content
- +Idle | The **lowest priority** work | Done when **nothing else** is waiting
```

### The Real Mistake: Wrapping the Whole Handler in startTransition

1. A developer discovers that `startTransition` prevents interface freezing during expensive renders.
2. The developer places all state updates inside `startTransition`, wrapping both the selected tab and the panel setter.
3. The interface no longer provides immediate visual feedback. The bold styling lags until the heavy posts finish rendering.
4. Assuming the initial click was ignored, the user clicks repeatedly in frustration.
5. Official documentation explains this psychological friction: direct interactions like typing, clicking, or pressing require immediate visual confirmation to match physical intuition, otherwise the interface feels broken.

The correct pattern isolates the updates: keep the setter driving direct interaction feedback outside `startTransition`, and wrap only the computationally heavy panel update inside it.

Remember this distinction: user interaction feedback is urgent and executes first, while heavy background rendering belongs inside `startTransition`.

---

## All 4 Principles Together

### The Complete Profile Page

Here is the complete project. The entry file mounts the app with `createRoot`, inside Strict Mode:

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

`App` renders the tabs:

```jsx title="src/App.jsx"
import ProfileTabs from './components/ProfileTabs.jsx';

export default function App() {
  return <ProfileTabs />;
}
```

`ProfileTabs` makes an urgent update for the bold tab and a Transition for the panel:

```jsx title="src/components/ProfileTabs.jsx"
import { ~startTransition~, useState } from 'react'; // Principle 2: the concurrent feature this lesson uses
import PostsTab from './PostsTab.jsx';

export default function ProfileTabs() {
  const [selected, setSelected] = useState('about');
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    ~setSelected(nextTab);~ // Principle 4: urgent, rendered and committed first
    ~startTransition~(() => { // Principles 2 and 3: interruptible, committed only when finished
      setTab(nextTab);
    });
  }

  return (
    <section>
      {selected === 'about' ? <b>About</b> : <button onClick={() => selectTab('about')}>About</button>}
      {selected === 'posts' ? <b>Posts</b> : <button onClick={() => selectTab('posts')}>Posts</button>}
      {selected === 'contact' ? <b>Contact</b> : <button onClick={() => selectTab('contact')}>Contact</button>}
      <hr />
      {tab === 'about' && <p>Welcome to my profile!</p>}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <p>Contact me at admin@mysite.com</p>}
    </section>
  );
}
```

`PostsTab` is unchanged from the start of the lesson:

```jsx title="src/components/PostsTab.jsx"
export default function PostsTab() {
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return <ul className="items">{items}</ul>;
}

function SlowPost({ index }) {
  let startTime = performance.now();
  ~while~ (performance.now() - startTime < 1) {} // Principle 1: waits 1 millisecond to stand for slow code

  return <li className="item">Post #{index + 1}</li>;
}
```

### What Happens When the User Clicks Posts, Then Contact

When the application mounts, React evaluates `App`, then `ProfileTabs`, rendering the About line. When a user clicks Posts and immediately clicks Contact during background execution, React processes the workload in the following priority order:

```tree dir=right caption="The order of React's work when the user clicks Posts and then Contact on the finished profile page."
Two clicks on the profile page
- +1. Click on Posts [`setSelected` `setTab`] | One **urgent** update and one **Transition**
- +2. Urgent render and commit [`ProfileTabs`] | The Posts tab **turns bold**; the About line stays
- +3. Transition render [`PostsTab` `SlowPost`] | React calls the posts **in memory** and **yields** to the browser
- +4. Click on Contact [`setSelected`] | A new **urgent** update **interrupts** the Posts render
- +5. Final commit [`ProfileTabs`] | The Contact tab is bold, the **Contact line** shows, and **no post** ever reached the DOM
```

```page width=text caption="The finished profile page after the user clicks Posts and then Contact: the Contact tab is bold, the Contact line shows, and the Console shows the log of the abandoned Posts render."
line: [About] [Posts] Contact
line: Contact me at admin@mysite.com | good
log: [ARTIFICIALLY SLOW] Rendering 500 <SlowPost /> | PostsTab.jsx:2
log: [ARTIFICIALLY SLOW] Rendering 500 <SlowPost /> | PostsTab.jsx:2
```

| Aspect | The Common Habit | The React Rule |
| :--- | :--- | :--- |
| **A slow update** | Call the set function directly and expect only the slow tab to be slow, so the whole page freezes | A normal update renders synchronously on the one main thread, and nothing can interrupt it |
| **Concurrency** | Expect React 19 to render every update concurrently, and change nothing | Concurrency is opt-in: put the slow update inside `startTransition` to make it an interruptible Transition |
| **The screen during a render** | Expect half of the posts to show when React stops in the middle | React changes the DOM only at the end; an abandoned render leaves the page as it was, so components must stay pure |
| **What goes first** | Wrap the whole handler in `startTransition`, so the clicked tab waits for the slow panel | Keep the update for what the user touched outside `startTransition`; urgent updates go first and interrupt a Transition |

Remember the core truth of this lesson. **A normal update renders to completion without interruption. A Transition can be paused or abandoned to let urgent input run first, and the screen only ever displays a completed render.**

---

## For the Interview

> **The Interview Question:** What is concurrent rendering, and how does React keep the interface responsive during heavy computation?

### How to Answer Clearly in 30 Seconds

"Concurrent rendering allows React to evaluate component updates in an interruptible manner, enabling the engine to pause, resume, or discard in-progress background rendering. By default, React executes updates synchronously on the browser's single main thread, freezing user input and visual repaints until the entire tree finishes committing. Concurrency is opt-in per update via concurrent features like `startTransition`. Three architectural mechanisms maintain responsiveness:
1. **Cooperative yielding.** React yields control back to the browser between rendering units, allowing the browser to dispatch incoming click events and paint frames.
2. **Atomic commits.** React decouples rendering from committing, mutating the DOM only when the entire tree is complete so partial or aborted renders never leak onto the screen.
3. **Priority scheduling.** Urgent updates from direct user interactions take precedence over background Transitions, immediately aborting stale render passes.

Concurrent rendering does not reduce computational overhead or make slow components faster; it prioritizes urgent user feedback ahead of heavy background rendering."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Does a Transition make the slow render faster, and how is it different from debouncing?"**
   It does not accelerate rendering. The 500 posts consume the identical amount of CPU time. The React documentation notes that marking an update as a Transition does not make re-rendering faster; it informs React that rendering the list can be deprioritized.

   Debouncing enforces an arbitrary timer delay before executing an update, meaning the thread still freezes once that timer elapses. As documentation observes, debouncing and throttling merely postpone the moment when rendering blocks user input. Transitions introduce zero artificial delay: fast devices render immediately, while slower devices render in the background without freezing user input. If another click arrives in the meantime, React aborts the obsolete Transition instantly.
2. **"How do priority lanes work?"**
   Lanes represent internal 32-bit bitmasks used by React's Scheduler to track task priority sets, batching boundaries, and expiration deadlines. Public APIs abstract these details away, though DevTools surfaces them across four timeline tiers: Blocking, Transition, Suspense, and Idle.

   User input actions like typing and clicking map to high-priority blocking lanes that preempt lower-priority transition lanes. Because the JavaScript runtime adheres to run-to-completion semantics for individual function execution, React yields between distinct component fiber evaluations rather than cutting a single JavaScript function in half.
3. **"Why does concurrent rendering require components to be pure?"**
   Because interruptible rendering means React may execute component functions in memory multiple times, pause them, or discard them without committing. If a component mutates an external variable during rendering, that side effect executes for discarded render passes that never reach the DOM. Pure components ensure that speculative rendering produces no observable external side effects. Strict Mode verifies this purity by invoking render functions twice in development.

```tree caption="Interview summary: a normal update blocks the page, a Transition can be interrupted, and an urgent update goes first."
How React keeps the page responsive
- !A normal update [`setTab`] | Rendered **synchronously** on the one main thread | A slow render **freezes the whole page**
- +A Transition [`startTransition`] | Rendered **concurrently**; React **yields** to the browser | **Interruptible**, and committed **only when finished**
- +An urgent update [`setSelected`] | Rendered and committed **first** | Shows the user **at once** that the click was received
```
