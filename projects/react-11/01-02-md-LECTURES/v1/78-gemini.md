# Lecture 78: How React Walks the Tree One Fiber at a Time

*(How does React stop in the middle of a slow render, and why does the user never see half of it?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | What is a Fiber node, and how does the dual-buffering workLoop manage rendering?

---

## VS | A recursive walk vs. React's work loop: both render every component, only the loop can stop between two

> When a user interaction triggers a re-render, React re-evaluates components to construct the next screen. If rendering 500 complex items takes noticeable time, traditional synchronous rendering freezes the entire page. **Under the hood, React tracks every component and tag as an internal Fiber node, traversing them in an iterative work loop**. This loop processes one node per step. React can pause between nodes to let the browser process user input, while discarding incomplete work so the user never observes a broken UI.

Remember how the browser manages an active web page. Every HTML element on screen corresponds to an in-memory JavaScript object called a DOM node. Each DOM node maintains direct references to its adjacent neighbors. The first element inside the document body sits at its first child pointer. The subsequent element sits at its next sibling pointer. The browser engine navigates and lays out the document by traversing these pointers.

React structures your component hierarchy using that exact pointer pattern. In modern React, a component is a function, and function executions are stateless. Once a function returns, its execution context and local variables vanish from memory. To preserve state and component identity across renders, React allocates a persistent internal JavaScript object for every mounted component and every host DOM tag. That object is the **Fiber node**. It lives on the heap across re-renders, and your component state resides directly inside it.

During the render phase, React traverses these Fiber nodes using an iterative `while` loop, processing one Fiber node per step. Between iterations, the loop can pause and yield the main thread back to the browser event loop. This allows the browser to respond immediately to user clicks or keystrokes. Furthermore, React constructs the upcoming UI changes inside a separate, off-screen tree of Fiber nodes. The browser DOM updates and the user sees the new screen only when every node in that secondary tree has completed evaluation.

Why this architecture matters: This design determines whether a web application stays responsive during heavy rendering workloads:
1. **A synchronous cascade of recursive function calls blocks the main thread.** When a large component tree renders recursively, the browser engine cannot process clicks, handle keyboard input, or paint layout frames until the final component returns. As MDN warns: "long-running JavaScript functions can block the thread, leading to an unresponsive page and a bad user experience."
2. **An iterative work loop over Fiber nodes preserves browser responsiveness.** Processing one Fiber node at a time allows React to yield control to pending browser events. Paired with a secondary off-screen tree, React can discard incomplete background work, ensuring users never see a partially rendered list.

### The Four Pieces of Fiber

The official React documentation explains that rendering is conceptually recursive: React invokes a parent component, then invokes returned child components, descending through the hierarchy (Lesson 13). A recursive traversal relies on a function calling itself once for each child.

A recursive walk and React's work loop visit the exact same components in the exact same order: parents before children, and sibling children in JSX sequence. The fundamental difference lies in where the engine maintains its traversal position:
- **A recursive walk** stores execution position on the JavaScript engine's internal call stack. Nothing can interrupt execution until the final nested function call returns.
- **React's work loop** stores execution position in a single pointer variable referencing the next Fiber node. The loop can stop after any individual Fiber node, allowing React to resume traversal later from that pointer.

React implements this architecture using four foundational pieces:
1. **One persistent object for each component and each tag.** React allocates a Fiber node for every component, such as `ProfileTabs`, and for every host tag, such as a `<button>`. Each object survives across renders and stores component state.
2. **Three pointer links on each object.** Each Fiber node points to its first child, its next sibling, and its parent. The tree stores no dynamic arrays of children.
3. **An iterative loop that visits one Fiber node per turn.** Traversal progress is tracked by a single pointer variable. React can pause after any node and yield the main thread to the browser.
4. **A secondary off-screen tree beside the active screen.** React constructs pending Fiber nodes in a separate tree, switching pointers only when evaluation finishes. An abandoned tree is discarded without ever touching the live screen.

```tree dir=right caption="The four pieces of Fiber that let React stop in the middle of a render and never show half of it."
How React renders a page
- +1. One Fiber node per component and per tag [`ProfileTabs` `PostsTab` `SlowPost`] | An object that **lasts across renders** | It **holds the state**
- +2. Three links on each Fiber node [`child` `sibling` `return`] | First child, next sibling, and parent | **No array of children**
- +3. One loop, one Fiber node per turn [`workInProgress`] | The place in the walk is **one variable** | React can **stop after any Fiber node**
- +4. A second tree beside the screen's tree [`current` `workInProgress`] | React switches trees **only when the new one is finished** | A half-built tree **never reaches the screen**
```

Why is this architecture named Fiber? In computer science, a thread is a system execution sequence managed preemptively by the operating system (Lesson 66). A fiber, by contrast, is a lightweight unit of cooperative multitasking: it pauses and resumes only at explicitly chosen yield points. React Fiber adopts this name because rendering yields control cooperatively, pausing cleanly between individual Fiber nodes rather than interrupting execution mid-function.

> [!DEFINITION]
> **React element.** [REVIEW] A React element is an immutable, lightweight descriptor object representing a desired piece of the user interface (Lesson 76).
> 1. JSX tags compile directly into element descriptors containing a `type`, `props`, and an optional `key`.
> 2. Components instantiate fresh React elements on every render call, and React freezes these objects in development to prevent mutation.
> 3. An element holds no persistent state, no instance memory, and no direct reference to a browser DOM node.
>
> Elements serve as disposable blueprints that tell React what the DOM should look like, whereas Fiber nodes manage the persistent runtime state.

> [!DEFINITION]
> **Urgent update and Transition.** [REVIEW] React categorizes state updates into two distinct priority levels to preserve user interface responsiveness (Lesson 66).
> 1. An urgent update (such as a direct state setter in a typing or clicking handler) renders synchronously without interruption, reflecting immediate user interactions.
> 2. A Transition (wrapped inside `startTransition`) marks non-urgent background rendering that can be paused or abandoned when more urgent input arrives.
> 3. Concurrent rendering allows React to interleave urgent browser interactions while low-priority Transitions compute in the background.
>
> Urgent updates ensure instantaneous feedback for discrete user input, while Transitions prevent expensive UI updates from freezing the page.

> [!DEFINITION]
> **Call stack.** [NEW] The call stack is the browser runtime data structure that tracks function execution and nested call hierarchy in JavaScript (Lesson 78).
> 1. When function `a` invokes function `b`, the JavaScript engine pushes a stack frame for `b` onto the top of the call stack.
> 2. When `b` returns, its stack frame is popped, and execution resumes in `a` exactly where it left off.
> 3. JavaScript executes synchronously and run-to-completion on the main thread; an active call stack cannot be paused, yielded, or inspected from the outside.
>
> MDN explains that the call stack records the execution location across nested function calls; if a recursive render runs too long, it completely locks the main thread until every frame returns.

> [!DEFINITION]
> **Fiber node.** [NEW] A Fiber node is a persistent, mutable JavaScript object that represents a unit of work and persistent runtime state in React's component tree (Lesson 78).
> 1. React allocates one Fiber node for every mounted component instance and every host DOM tag on the page.
> 2. Each Fiber node persists across re-renders, storing the component's current props (`memoizedProps`), Hook state linked lists (`memoizedState`), and real DOM node references (`stateNode`).
> 3. Fiber nodes connect to each other through three explicit pointer references: `child`, `sibling`, and `return`.
>
> While React elements are created anew and discarded on every render, Fiber nodes survive across renders to maintain component state, reconcile updates, and drive DOM mutations.

### Where Readers Usually Go Wrong

Developers frequently encounter confusion around four central concepts:
1. **Confusing React elements with Fiber nodes.** A React element is an ephemeral, immutable descriptor object returned by JSX and frozen by React. A Fiber node is a long-lived internal record that React retains across re-renders to store state, props, and DOM references.
2. **Assuming React reallocates its internal node tree on every render.** React maintains two parallel trees, recycling existing Fiber nodes across renders by updating their properties rather than repeatedly allocating new objects.
3. **Assuming an interrupted render always resumes from where it paused.** When React pauses simply to yield execution time to the browser, it resumes from the saved node. However, if a higher-priority update arrives in the interim, the official React documentation explains that React "will restart the rendering work", completely abandoning the stale work.
4. **Assuming Fiber nodes are exposed for application code to manipulate.** Fiber nodes are private runtime primitives. The React documentation emphasizes that React relies on "sophisticated techniques in its internal implementation", and clarifies that "you won't see those concepts anywhere in our public APIs."

### The Rule of Thumb: React stops only between two Fiber nodes, and shows only a finished tree

**React yields control only between distinct Fiber nodes, never inside an actively running component function. Furthermore, React may discard an in-progress render without ever displaying it to the user.** To keep heavy rendering interruptible, decompose intensive computations across many small, discrete components. Additionally, keep side effects that must run exactly once per visible screen out of the component body, placing them inside an Effect.

## SECTION | The Profile Page with 500 Slow Posts

Our example application is the user profile page from Lesson 66. It presents three navigation tabs labeled About, Posts, and Contact, with a content panel positioned below them. When the page first loads, the About tab displays as bold text, while the remaining two tabs render as clickable buttons:

```page width=text caption="The profile page when it opens: the About tab is bold text, and Posts and Contact are buttons."
line: About [Posts] [Contact]
line: Welcome to my profile!
console: quiet
```

The project contains four files. This lesson introduces no new visual features, focusing entirely on how React coordinates work under the surface:

```files title="profile-page: File Explorer" caption="How the files of our profile page sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Mounts `App` with `createRoot` inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and renders `<ProfileTabs />`
  components/
    ProfileTabs.jsx | state | Holds the selected tab and the tab the panel shows
    PostsTab.jsx | slow child | Exports `PostsTab`, which renders 500 slow posts
```

The `ProfileTabs` component manages two independent state values. A single user click triggers updates to both values through two distinct priority channels:

```jsx title="src/components/ProfileTabs.jsx"
import { startTransition, useState } from 'react';
import PostsTab from './PostsTab.jsx';

export default function ProfileTabs() {
  const [selected, setSelected] = ~useState('about')~; // The tab the user clicked last
  const [tab, setTab] = ~useState('about')~; // The tab the panel shows

  function selectTab(nextTab) {
    ~setSelected(nextTab)~; // Urgent: the clicked tab turns bold at once
    startTransition(() => {
      ~setTab(nextTab)~; // Transition: the panel follows when it is ready
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

The Posts tab renders a list of 500 posts, where each individual post requires one millisecond of artificial computation. Consider the following test sequence. The user clicks Posts, immediately reconsiders, and clicks Contact before a single post has rendered. The user observes this exact sequence:
1. The Contact tab button turns bold immediately.
2. The content panel displays the Contact message.
3. Not a single post ever appears on the screen.

```page width=text caption="The profile page after the user clicks Posts and then, during the render, Contact: the Contact tab is bold, and no post ever appeared."
line: [About] [Posts] Contact
line: Contact me at admin@mysite.com | good
log: [ARTIFICIALLY SLOW] Rendering 500 <SlowPost /> | PostsTab.jsx:2
log: [ARTIFICIALLY SLOW] Rendering 500 <SlowPost /> | PostsTab.jsx:2
```

Lesson 66 demonstrated that concurrent React handles this interaction smoothly. This lesson explains the underlying mechanics. When the user clicked Contact, React was midway through evaluating 500 post components. This raises three essential architectural questions:
1. Where does React preserve the partially constructed list while yielding control?
2. How does React interrupt execution midway through a render pass?
3. Why does the incomplete list of posts never reach the visible DOM?

Under every render pass, React maintains one Fiber node for each component and host tag. It links these nodes into a tree, walks them in an iterative loop, and builds updates in a secondary off-screen tree. Four core principles explain this behavior:
1. **Principle 1: The Fiber Node Holds the State.** After clicking Contact, the state setter retrieves the updated value because React reads directly from the persistent Fiber node of `ProfileTabs`.
2. **Principle 2: Three Links Connect Every Fiber Node.** The section element maintains no dynamic children array; it points to the first tab, and each tab references its next sibling.
3. **Principle 3: The Work Loop Can Stop After Any Fiber Node.** React pauses between individual post items, enabling the browser to execute the Contact click handler immediately.
4. **Principle 4: The Second Tree Hides Unfinished Work.** The abandoned Posts tree is discarded in memory, while the About content remains visible until Contact finishes rendering.

---

## PRINCIPLE | The Fiber node: React keeps one object per component, and the state lives in it

> [!PRINCIPLE]
> **Principle 1: Fiber Node: The Fiber Node Holds the State of `ProfileTabs`**
>
> *For each component and each tag on the page, React keeps one Fiber node across renders; it holds the type, the key, the props, the state, and for a tag the DOM node.*
>
> A component function runs again from its first line on every render, and the elements it returns are new each time. So neither the function nor its elements can remember anything. The Fiber node does: React keeps it at the component's position in the tree, stores the state of its Hooks in it, and updates it from each new element. That is why `useState('about')` hands back `'contact'` after the click.
>
> **DO THIS:**
> ```jsx
> function ProfileTabs() {
>   const [tab, setTab] = ~useState('about')~; // React stores tab in the Fiber node of ProfileTabs, so it survives every render
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ProfileTabs() {
>   ~let tab = 'about'~; // **WRONG:** a plain variable starts again at 'about' each time React calls ProfileTabs
> }
> ```

Here is the smallest code demonstrating this principle. The parent component writes one JSX tag, while the child declares state:

```jsx title="One tag and one piece of state"
<ProfileTabs /> {/* Written in App */}

const [tab, setTab] = useState('about'); // Written in ProfileTabs
```

Consider a fundamental question about component execution. `ProfileTabs` is a plain JavaScript function. Each time React calls it, the function executes from its first statement, encountering the initial state declaration again. After the user clicks Contact, where does the updated value come from? It cannot originate from the function execution context, which evaporates upon returning. Instead, the value is retrieved from a persistent object React maintains on the heap for the component: its Fiber node.

### VS | The element vs. the Fiber node: a description made new on every render, and the object React keeps

The JSX tag for `ProfileTabs` compiles into a React element: a lightweight descriptor object carrying a type, props, and a key (Lesson 76). In parallel, React maintains an internal Fiber node for that component instance. Here are simplified representations of both structures:

```js title="The element of <ProfileTabs />, simplified"
{ ~type: ProfileTabs~, key: null, props: {} } // A description: made new each time App renders, frozen, no state
```

```js title="The Fiber node of ProfileTabs, simplified"
{
  ~type: ProfileTabs~, // The same type as the element
  key: null,
  memoizedProps: {}, // The props of the last render
  ~memoizedState~: { memoizedState: 'about', next: { memoizedState: 'about', next: null } }, // The state of both Hooks, selected and tab, one after the other
  stateNode: null, // No DOM node: ProfileTabs is a component, not a tag
}
```

The property names reflect React's actual internal implementation. Memoization refers to caching computed values for subsequent reuse:
- **`memoizedProps`** stores the props evaluated during the most recent committed render pass.
- **`memoizedState`** stores component state. The two Hooks in `ProfileTabs` form a singly-linked list. The first Hook record holds the selected tab, while its next pointer references the record storing the panel tab.
- **`stateNode`** references the live browser DOM node for host elements like `<button>`. For custom components, it remains `null` because function components do not produce individual DOM nodes directly.

Both objects reference the same component function and a `null` key. Despite visual similarities, they serve fundamentally different roles in React's architecture:
- **The element** is a lightweight blueprint. The official documentation defines it as "a lightweight description of a piece of the user interface". Components produce fresh element trees on every render, and React freezes these descriptors in development.
- **The Fiber node** is the persistent runtime instance. React instantiates it when the component first mounts at its tree position, retaining it as long as the component remains at that address (Lesson 25). On each render pass, React diffs incoming elements against the Fiber node, mutating the node to reflect updates.

```tree caption="The element of ProfileTabs and the Fiber node of ProfileTabs carry the same type, but only the Fiber node lasts and holds the state."
Two objects for one `ProfileTabs`
- !The element [`type: ProfileTabs` `props`] | A **description**, made new on every render | **Frozen**, and holds **no state**
- +The Fiber node [`type: ProfileTabs` `memoizedState`] | The object React **keeps across renders** | Holds the **state**, and for a tag the **DOM node**
```

### Where `'contact'` comes from after the click

**After the user clicks Contact, the tab state resolves to contact, even though the source code still specifies the initial state about.** React reads the active value directly from the Fiber node rather than the component definition. Here is the exact runtime sequence:
1. The user clicks Contact. The click handlers invoke state setters, enqueuing state updates on the Fiber node of `ProfileTabs` (Lesson 25).
2. React queues a re-render and executes `ProfileTabs`. The function runs from its first statement, evaluating the state Hook with its initial argument.
3. React ignores the default initial argument. It locates the Fiber node for `ProfileTabs`, reads the updated value from its state list, and returns contact.
4. `ProfileTabs` returns brand-new element descriptors: a new section container, updated tab buttons, and a paragraph for the Contact line. The previous element descriptors are discarded.
5. React reconciles these new elements against the child Fiber nodes beneath `ProfileTabs`, updating the tree accordingly.

The official documentation notes that state "is actually held inside React", emphasizing that React attaches state to where each component "sits in the render tree". The Fiber node is that physical anchor. It represents the structural identity of `ProfileTabs` in the component hierarchy.

You can inspect this internal state directly without altering application code. Open React Developer Tools, navigate to the Components tab, and highlight `ProfileTabs` (Lesson 64). Under the Hooks section, the inspector displays both state values. Both show about upon page load. After clicking Contact, both update to display contact.

### How many Fiber nodes the profile page has

React allocates a Fiber node for every component instance and every host tag across the document, not just `ProfileTabs`. While the Posts tab is rendered, the page maintains individual Fiber nodes for each of these items:
1. `App`, `ProfileTabs`, the container section, all three navigation tabs, and the horizontal rule divider.
2. The `PostsTab` component and its container list element.
3. All 500 `SlowPost` components, along with their 500 host list item tags.
4. Text leaf nodes, including the text strings rendered inside each list item.

This represents well over a thousand active Fiber nodes for a single small page. The V8 engine blog noted when examining React's internal `FiberNode` class: "Many real-world React apps don't just have two, but rather tens of thousands of these `FiberNode`s."

Remember the fundamental distinction: component functions return and exit, element descriptors are created and discarded, while Fiber nodes persist to preserve state.

---

## PRINCIPLE | `child`, `sibling`, and `return`: three links connect every Fiber node, with no array of children

> [!PRINCIPLE]
> **Principle 2: Linked Tree: `child`, `sibling`, and `return` Connect the Three Tabs**
>
> *Each Fiber node points to its first child with `child`, to its next sibling with `sibling`, and to its parent with `return`; the children of a Fiber node form a chain, not an array.*
>
> The DOM links its nodes the same way, with `firstChild`, `nextSibling`, and `parentNode`. With these three links, React can go from any Fiber node to any other one: down to the first child, across to the next sibling, and back up to the parent. That is all React needs to walk the whole tree with one loop, as Principle 3 shows. These links belong to React. Our code reaches the tree only through props, state, and refs.
>
> **DO THIS:**
> ```jsx
> <button onClick={() => ~selectTab('contact')~}>Contact</button> {/* Our code talks to React through state; React keeps the links */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const key = Object.keys(button).find((name) => name.startsWith('__reactFiber$'));
> const section = ~button[key].return~; // **WRONG:** an internal link that can change in any React version
> ```

Here is the smallest code snippet of this principle: the three tabs declared inside the section container when the page opens:

```jsx title="The three tabs inside the section"
<section>
  <b>About</b>
  <button>Posts</button>
  <button>Contact</button>
</section>
```

### VS | The DOM's links vs. the Fiber node's links: the same shape, shorter names

This linked structure mirrors traditional browser DOM navigation (Lesson 01). Every DOM node exposes three standard traversal properties defined by MDN:
- **`firstChild`** returns the node's first child element in the tree hierarchy, or `null` if the element has no children.
- **`nextSibling`** returns the adjacent element under the same parent container, or `null` for the final child.
- **`parentNode`** returns the direct parent container of the specified element in the document tree.

A Fiber node implements this exact structural pattern using concise pointer names:
- **`child`** points exclusively to the first immediate child node.
- **`sibling`** points to the adjacent Fiber node under the same parent, evaluating to `null` for the final sibling.
- **`return`** points directly to the parent Fiber node.

Here is an explicit comparison of sibling traversal for the About tab across both models. In this snippet, `aboutNode` represents the browser DOM element, while `aboutFiber` represents its corresponding Fiber node:

```js title="The DOM's links and the Fiber node's links for the About tab"
aboutNode.~nextSibling~; // The DOM: the Posts button
aboutFiber.~sibling~; // Fiber: the Fiber node of the Posts button
```

Both data structures share the exact same structural topology. Each node links to its first child, its next sibling, and its parent container. The only structural difference is that the Fiber tree also incorporates non-DOM nodes for React components like `ProfileTabs` and `PostsTab`, which do not correspond directly to browser elements.

### The links of the profile page

**The Fiber node for the section container does not store a JavaScript array of its children. Instead, it points exclusively to the About tab.** To access the Contact tab, React navigates from About along sibling pointers through Posts. Here are the explicit pointer connections established upon initial render:
1. The `child` pointer of `ProfileTabs` references the section container.
2. The `child` pointer of the section references the About tab.
3. The `sibling` pointer of About references Posts, whose `sibling` pointer references Contact.
4. The `sibling` pointer of Contact references the horizontal rule, which points to the About paragraph.
5. The `sibling` pointer of the About paragraph evaluates to `null` because it is the terminal child.
6. The `return` pointer of each tab, the horizontal divider, and the paragraph points back to the section container.

When the page first renders, the conditional checks for the Posts and Contact panels evaluate to false. Because false values render nothing to the DOM, React allocates no Fiber nodes for inactive branches.

A chain connected by sequential pointers is a **linked list**. Each record holds a pointer to its successor rather than storing elements in a contiguous array. Navigating to the fifth element requires following pointers through the first four nodes. In our application, the 500 post components beneath the list container form a continuous chain of 500 `sibling` pointers.

When the user selects the Posts tab, `PostsTab` replaces the placeholder paragraph, expanding the Fiber tree by more than one thousand nodes:

```tree caption="The Fiber nodes of the profile page while the Posts tab shows, and the three links between them."
`ProfileTabs` | Its `child` is the section | **No array of children**
- +`<section>` | Its `child` is the About tab | Its `return` is `ProfileTabs`
  - +About tab | Its `sibling` is the Posts tab | Its `return` is the section
  - +Posts tab | Its `sibling` is the Contact tab | Its `return` is the section
  - +Contact tab | Its `sibling` is the `<hr>` | Its `return` is the section
  - +`<hr>` | Its `sibling` is `PostsTab` | Its `return` is the section
  - +`PostsTab` | Its `child` is the `<ul>` | Its `sibling` is `null`: the **last child**
    - +`<ul>` | Its `child` is `SlowPost` 1 | Its children form **one chain of 500 `sibling` links**
```

### A real Fiber node in the Console

While React's public documentation does not document internal Fiber nodes, the browser console can inspect them directly. React attaches an internal pointer from each managed DOM node to its corresponding Fiber node. This link resides in an internal property prefixed with `__reactFiber$`, followed by a unique runtime identifier. This property is an unexported implementation detail that may change across React releases; application code must never depend on it. We inspect it here solely for educational analysis.

Open the application in Chrome, inspect the Contact button in the Elements panel, and switch to the Console. The `$0` variable references the currently selected element:

```devconsole caption="The Console shows the internal property that links the Contact button to its Fiber node, and the four links of that Fiber node, right after the page opens."
Object.keys($0)
> (2) ['__reactFiber$k3x9q2m7dw1', '__reactProps$k3x9q2m7dw1']
const fiber = $0[Object.keys($0)[0]]
= undefined
fiber
> FiberNode {tag: 5, key: null, elementType: 'button', type: 'button', stateNode: button, …}
[fiber.return.type, fiber.child, fiber.sibling.type, fiber.alternate]
> (4) ['section', null, 'hr', null]
```

The inspected values verify the pointer chain outlined above:
1. **The `return` pointer** references the parent section container.
2. **The `sibling` pointer** references the adjacent horizontal rule.
3. **The `child` pointer** is `null`. The text string Contact is the sole child of the button, and React writes that text directly into the button node.
4. **The `stateNode` property** references the underlying HTMLButtonElement DOM instance.
5. **The `alternate` pointer** remains `null`. Principle 4 details how this property is populated during subsequent updates.

Remember the structural principle: no dynamic child arrays, only three pointer links. Descend via child pointers, advance through siblings, and ascend back to the parent.

---

## PRINCIPLE | The work loop: React visits one Fiber node per turn, so it can stop between any two

> [!PRINCIPLE]
> **Principle 3: Work Loop: The Loop Can Stop After Any `SlowPost`**
>
> *React walks the Fiber nodes in a loop, one per turn: it begins work on the way down and completes it on the way up; in a concurrent render it can stop between two Fiber nodes and continue later, or restart when a more urgent update arrives.*
>
> A recursive walk keeps its place on the call stack and cannot stop until the last call returns. React keeps its place in one variable, `workInProgress`. So after any Fiber node, React can give the main thread back to the browser, let it run a click handler or paint, and pick up again. React cannot stop inside one component, so slow work stays interruptible only when it is spread over many components.
>
> **DO THIS:**
> ```jsx
> for (let i = 0; i < 500; i++) {
>   items.push(~<SlowPost key={i} index={i} />~); // 500 short Fiber nodes: React can stop between any two
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function PostsTab() {
>   let startTime = performance.now();
>   ~while (performance.now() - startTime < 500) {}~ // **WRONG:** one Fiber node that runs half a second; React cannot stop inside it
> }
> ```

### VS | A function that calls itself vs. a `while` loop: the same order, only the loop can stop

Consider two alternative algorithms for traversing every node in a component tree. Both examples are conceptual models, using simplified function names for illustration. First, consider traditional recursive traversal:

```js title="A sketch of a recursive walk"
function visit(node) {
  work(node); // Calls the component of this node
  for (const child of node.children) {
    ~visit(child)~; // Waits here until the whole subtree of child is done
  }
}
```

Now consider React's iterative work loop. It maintains its current traversal position in a single pointer variable:

```js title="A sketch of React's loop"
let next = rootFiber; // The place in the walk: one variable
while (next !== null && ~!timeToStop()~) { // Can stop between any two Fiber nodes
  next = doOneFiber(next); // Visits one Fiber node and returns the next one
}
```

Both implementations visit `ProfileTabs`, the container section, the three tabs, `PostsTab`, the list, and all 500 posts in the exact same sequence. Despite visiting identical nodes, their execution characteristics are fundamentally different:
- **In recursive traversal**, the recursive invocation remains locked on the call stack until the entire subtree resolves. A function executing on JavaScript's main thread cannot be interrupted from the outside. As MDN specifies, executing code "cannot be preempted and will run entirely before any other code runs". Consequently, the traversal cannot pause until every frame returns.
- **In the iterative work loop**, each loop cycle evaluates exactly one Fiber node and returns. When available frame time elapses, the loop terminates cleanly, while the pointer variable continues pointing to the next pending node. React can yield to the browser and resume processing later from that saved pointer.

```tree caption="A recursive walk and React's loop visit the same components in the same order; only the loop can stop in the middle."
Two ways to walk the same tree
- !A recursive walk [`visit` calls `visit`] | Keeps its place **on the call stack** | Cannot stop until **the last call returns**
- +React's loop [`while` over `child` `sibling` `return`] | Keeps its place **in one variable** | Can stop **after any Fiber node** and continue later
```

### One turn of the loop: down, across, and back up

The three pointer links of Principle 2 dictate how React selects the next Fiber node. React divides the processing of each node into two distinct phases, named `beginWork` and `completeWork` in the React source code:
- **`beginWork`** executes during the downward descent. React calls the component function, retrieves new elements, and reconciles them against existing child Fiber nodes using the type and key rules from Lesson 77.
- **`completeWork`** executes during the upward ascent when a Fiber node and all its nested children have finished evaluating. For host DOM tags, React prepares the corresponding DOM element and attaches child nodes.

```js title="A sketch of one turn of the loop: which Fiber node comes next"
function doOneFiber(fiber) {
  beginWork(fiber); // On the way down: call the component, compare with the old Fiber nodes
  if (fiber.child !== null) {
    return ~fiber.child~; // Go down to the first child
  }
  let done = fiber;
  while (done !== null) {
    completeWork(done); // On the way up: this Fiber node and everything under it are finished
    if (done.sibling !== null) {
      return ~done.sibling~; // Go across to the next sibling
    }
    done = ~done.return~; // Go back up to the parent
  }
  return null; // Back above the root: the walk is finished
}
```

This traversal sequence clarifies why the parent pointer is named `return`. It indicates where execution returns once a Fiber node and its entire subtree are complete, mirroring the behavior of a function return statement on the call stack.

The actual identifiers in React's source codebase correspond to these roles:
- **`workInProgress`** represents the pointer variable tracking the active node.
- **`performUnitOfWork`** represents a single iteration of the work loop.
- **`workLoopConcurrentByScheduler`** represents the main concurrent loop in React 19.

These terms are standard concepts in technical architecture interviews. You will never need to reference them in application source code.

Here is the traversal sequence React follows when rendering the Posts tab:

```tree dir=right caption="The order in which React's loop visits the Fiber nodes of the profile page while it renders the Posts tab."
The walk of the Posts render
- +1. `ProfileTabs` | **Begin**: React calls `ProfileTabs` | Go down by `child` to the section
- +2. The section | **Begin** it | Go down by `child` to the About tab
- +3. The three tabs and the `<hr>` | **Begin** and **complete** each one | Go across by `sibling`
- +4. `PostsTab` | **Begin**: React calls `PostsTab`, which prints its log line | Go down to the `<ul>`, then to `SlowPost` 1
- +5. `SlowPost` 1 to 500 | **Begin** each one, which waits 1 millisecond, and **complete** its `<li>` | Go across by `sibling`: React **can stop between any two**
- +6. Back up by `return` | **Complete** the `<ul>`, `PostsTab`, the section, `ProfileTabs` | The tree is **finished**
```

### What the loop does when the user clicks Contact

Here is the implementation of `PostsTab` from Lesson 66. Each post component introduces a deliberate one-millisecond delay to simulate intensive computation:

```jsx title="src/components/PostsTab.jsx"
export default function PostsTab() {
  console.log('[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />');

  let items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost ~key={i}~ index={i} />); // 500 sibling Fiber nodes under the ul
  }
  return <ul className="items">{items}</ul>;
}

function SlowPost({ index }) {
  let startTime = performance.now();
  while (performance.now() - startTime < 1) {} // Waits 1 millisecond to stand for slow code

  return <li className="item">Post #{index + 1}</li>;
}
```

**The work loop yields between individual posts, allowing the browser to process the Contact click immediately, after which React restarts rendering with the updated state.** Here is the chronological execution flow:
1. The user clicks Posts. Because the state update is wrapped in `startTransition`, React designates this work as a concurrent render (Lesson 66).
2. React starts the work loop at `ProfileTabs`, which returns the navigation tabs and the `PostsTab` element.
3. React descends to `PostsTab`. The component logs its diagnostic message and returns 500 `SlowPost` element descriptors.
4. When evaluating the list container, React allocates all 500 `SlowPost` Fiber nodes linked by sibling pointers, without invoking the post component functions yet.
5. React evaluates `SlowPost` 1 and its list item, advances via sibling to `SlowPost` 2, and continues sequentially. Each post takes one millisecond.
6. After several iterations, React reaches its frame deadline, pauses between two Fiber nodes, and yields the main thread to the browser. The pointer variable continues referencing the next pending post.
7. The user clicks Contact. Because the main thread is idle, the browser dispatches the click handler immediately.
8. The tab button state update is urgent, so React does not resume the paused background render. It processes the urgent update immediately.
9. React restarts the transition render from the root with the tab set to contact.

The official React documentation refers to step 6 as yielding: "React yields to the browser during concurrent rendering". For step 9, the documentation illustrates this with a chart: "React will restart the rendering work on the chart component after handling the input state update."

Had the user not clicked Contact, React would have resumed the work loop after yielding, evaluating remaining posts until all 500 were complete. The documentation notes that React "may start rendering an update, pause in the middle, then continue later."

React autonomously manages yielding intervals based on browser frame budgets. The documentation summarizes this responsibility: React "can let the browser do some work between component calls so that re-rendering a large component tree doesn't block the main thread."

You can observe this behavior directly using the browser Performance panel in development and profiling environments (Lesson 64):
- **In the main thread flame chart**, rendering appears as a sequence of brief execution slices. You will find internal functions like `workLoopConcurrentByScheduler` and `performUnitOfWork`.
- **On React's Components track**, the documentation notes that the Blocked marker indicates "when rendering is blocked due to yielding to work outside React".

### React cannot stop inside one component

The work loop can yield only between individual Fiber nodes. It cannot pause midway through a component execution because a running JavaScript function executes to completion. Because each post takes only one millisecond, React receives 500 distinct opportunities to yield. If all slow computations were concentrated inside a single monolithic component, React would receive zero opportunities to yield:

```jsx title="One component that does all the slow work in one call"
function PostsTab() {
  let startTime = performance.now();
  ~while (performance.now() - startTime < 500) {}~ // Half a second inside one Fiber node: the loop cannot stop here
  return <ul className="items">...</ul>;
}
```

Wrapping this monolithic component in `startTransition` provides no benefit. Clicking Posts freezes the user interface for half a second because the work loop cannot regain control until `PostsTab` returns. Concurrent yielding is effective only when computationally heavy rendering is distributed across multiple discrete Fiber nodes.

This principle also explains why debouncing fails to solve sluggish rendering. Debouncing postpones state updates until user input pauses, but does not alter render execution once initiated (Lesson 66). As the React documentation explains, debouncing can "merely postpone the moment when rendering blocks the keystroke". Once a synchronous render begins, it locks the thread until completion. By contrast, concurrent rendering yields between Fiber nodes, keeping input responsive (Lesson 68).

Remember the rule of thumb: React stops only between two Fiber nodes, never inside an executing component.

---

## PRINCIPLE | `current` and `workInProgress`: React builds the next screen in a second tree, so a half-built tree never shows

> [!PRINCIPLE]
> **Principle 4: Double Buffering: The Half-Built Posts Tree Is Thrown Away While About Stays on the Screen**
>
> *React keeps two trees of Fiber nodes, the current tree that matches the screen and the work-in-progress tree that the loop builds; at the commit it changes the DOM and makes the finished tree the current one.*
>
> The loop writes only into the work-in-progress tree, so stopping in the middle never leaves the screen half old and half new. When a more urgent update arrives, React throws the unfinished tree away, and the screen goes straight from the old view to the new one. Each Fiber node links to its pair in the other tree with `alternate`, so React reuses the objects instead of creating them again on every render.
>
> **DO THIS:**
> ```jsx
> function PostsTab() {
>   ~useEffect~(() => { sendLog('posts opened'); }, []); // Runs only after a commit, so only when the posts reach the screen
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function PostsTab() {
>   ~sendLog('posts opened')~; // **WRONG:** also runs for a Posts tree that React throws away before the user sees it
> }
> ```

Look at the screen state while the posts are actively computing. The Posts tab is bold, the panel still displays the About greeting, and React is actively assembling post items in memory:

```page width=text caption="During the Posts render: the Posts tab is bold, and the panel still shows the About line while React builds the posts."
line: [About] Posts [Contact]
line: Welcome to my profile!
log: [ARTIFICIALLY SLOW] Rendering 500 <SlowPost /> | PostsTab.jsx:2
log: [ARTIFICIALLY SLOW] Rendering 500 <SlowPost /> | PostsTab.jsx:2
```

While the posts are rendering, React maintains two distinct Fiber trees in memory. Right before the user clicks Contact, these two trees exist simultaneously:
1. **The tree representing the active screen**: `ProfileTabs` with tab state set to about, the container section, three navigation tabs, and the paragraph containing the About greeting.
2. **The tree under active construction**: `ProfileTabs` with tab state set to posts, the container section, three navigation tabs, `PostsTab`, the list element, and Fiber nodes for 500 posts. Because React has evaluated only the initial posts, this tree remains incomplete.

### VS | One tree that changes as React walks vs. a second tree: only the second tree survives a stop

React could theoretically have used a single mutable tree, modifying nodes in place as the loop traversed. In an uninterrupted render, both strategies produce identical final DOM results. However, their fault tolerance under concurrent execution is completely different:
- **With a single mutable tree**, pausing midway leaves the application's sole tree in an inconsistent state, half old and half new. When an urgent update arrives, React must commit immediate changes. Committing an in-place tree would render a fragmented interface with partial posts, permanently corrupting the previous screen.
- **With a secondary off-screen tree**, the work loop modifies only the isolated draft tree. The tree matching the live browser DOM remains untouched and fully consistent until the new tree evaluates completely.

React designates these two trees with specific terminology:
- **The current tree** comprises the Fiber nodes matching the live, visible document.
- **The work-in-progress tree** comprises the Fiber nodes being assembled by the work loop for the upcoming screen. The active pointer variable of Principle 3 always references a node in this tree.

> [!DEFINITION]
> **Double buffering.** [NEW] Double buffering is a graphics rendering technique where an application draws the next frame onto an off-screen buffer while displaying the current frame from an active buffer (Lesson 78).
> 1. In computer graphics, rendering directly to the visible screen causes visual flickering and tearing as incomplete frames are displayed.
> 2. With double buffering, updates are prepared entirely on a private hidden buffer; once complete, the hardware swaps the active and hidden buffers in a single atomic pointer flip.
> 3. React applies this principle to the DOM: the `current` Fiber tree matches the visible screen, while the work loop constructs changes within a private `workInProgress` Fiber tree.
>
> React mutates the browser DOM and swaps its `current` pointer to the new tree only during the synchronous commit phase, guaranteeing that users never see partial, torn, or half-rendered UI.

```tree caption="React keeps two trees of Fiber nodes: the current tree matches the screen, and the work-in-progress tree is the one the loop builds."
Two trees of Fiber nodes [`current` `workInProgress`]
- +The current tree [`tab: 'about'`] | Matches **what is on the screen** | Does **not change** during the render
- +The work-in-progress tree [`tab: 'posts'`] | The loop **writes only here** | Becomes the current tree **only when it is finished**
```

### What happens to the half-built Posts tree

**React discards the partially constructed Posts tree, transitioning the user interface directly from the About screen to the Contact view.** Here is the exact step-by-step sequence:
1. The user clicks Posts. React renders and commits the urgent state update immediately, making the Posts tab bold.
2. React starts the concurrent transition render, assembling a work-in-progress tree derived from the current tree's Fiber nodes.
3. The work loop adds `PostsTab`, the list container, and the 500 post Fiber nodes exclusively into the work-in-progress buffer, evaluating initial posts.
4. The browser screen continues displaying the About greeting, because neither the live current tree nor the DOM has changed.
5. The user clicks Contact. The urgent state update arrives, prompting React to discard the incomplete Posts tree.
6. React evaluates and commits the urgent update. The Contact tab turns bold, while the About message remains visible.
7. React re-runs the transition render with tab state set to contact, completes the tree, and commits the result.
8. The user sees the Contact address immediately, without a single post ever appearing on screen.

For step 5, the React documentation clarifies that React "will throw out the stale rendering work that wasn't finished".

React mutates the live browser DOM exclusively during the commit phase. Throughout the entire interrupted Posts render pass, the Elements inspector never contains an unordered list or list items:

```dom caption="The Elements panel during the Posts render: the About paragraph stays, and no ul is ever added."
<section>
  <button>About</button>
  <b>Posts</b>
  <button>Contact</button>
  <hr>
  + <p>Welcome to my profile!</p> | note: The current tree still has the About line
</section>
```

The official React documentation defines this guarantee: "React guarantees that the UI will appear consistent even if a render is interrupted. To do this, it waits to perform DOM mutations until the end, once the entire tree has been evaluated." Maintaining a secondary off-screen tree is how React enforces this invariant.

### The switch at the commit, and the `alternate` link

During the commit phase, React mutates the browser DOM and reassigns its root pointer to point to the newly completed tree. The root container maintains a reference named `current`, which React swaps to reference the completed tree. The former current tree now becomes the buffer available for the next render pass.

Consequently, each component instance is represented by a pair of Fiber nodes, one in each tree buffer. Each Fiber node references its corresponding counterpart in the opposite tree via a property named `alternate`. In the console inspection from Principle 2, the `alternate` property of the Contact button was `null` because the application had rendered only once. Following the first update, it points to the button's paired Fiber node in the alternate tree.

On subsequent render passes, React initializes each work-in-progress Fiber node from its alternate partner, provided the component type and key match (Lesson 77). Here is what occurs when clicking Posts:
- **The section container, divider rule, and Contact button** preserve their types. React avoids allocating fresh objects, instead recycling the existing nodes and updating their properties.
- **The About and Posts tabs** require fresh Fiber nodes because each toggles between bold text and button elements.

```tree dir=right caption="How the two trees of Fiber nodes trade places at each commit."
Two trees that trade places
- +1. Render starts | React builds the work-in-progress tree **from the `alternate` of each current Fiber node**
- +2. The loop walks | React writes **only into the work-in-progress tree** | The screen **stays as it was**
- +3. Commit | React **changes the DOM** and moves the root's **`current` link** to the finished tree
- +4. Next render | The old current tree becomes **the one React fills next** | Objects are **reused**, not created again
```

### The real mistake: work in the component body for a tree the user never sees

Because React can discard an in-progress tree at any point, component functions may be invoked for screens that never appear to the user. In our application, React executed `PostsTab` during the initial Posts render before discarding the entire tree. Executing side effects directly in the render body creates serious production bugs:
1. Suppose a developer attempts to track user engagement by logging tab views. Inside the body of `PostsTab`, the developer calls an analytics function to record a view on the server.
2. The user clicks Posts and immediately clicks Contact, as tested above.
3. React executes `PostsTab`, dispatching the analytics request to the server. In development mode with Strict Mode enabled, it dispatches twice.
4. React discards the unfinished Posts tree, and the user never sees the posts screen. Nevertheless, backend metrics incorrectly record that the user viewed the posts.

The React documentation cautions that "rendering logic can be run multiple times", which is why component render functions must remain strictly pure (Lesson 14). The remedy is to move side effects into an Effect. React runs Effects exclusively after a successful commit, guaranteeing that discarded trees never execute side effects.

Remember the rule of thumb: the work loop writes into the second tree, and only a finished tree reaches the screen.

---

## All 4 Principles Together

### The complete files

Here is the complete application codebase, matching the implementation from Lesson 66. The main entry file mounts `App` into the document root wrapped in `StrictMode`:

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

The parent `App` component renders the navigation container:

```jsx title="src/App.jsx"
import ProfileTabs from './components/ProfileTabs.jsx';

export default function App() {
  return <ProfileTabs />;
}
```

The `ProfileTabs` component manages both urgent tab selection and background transition state within its Fiber node:

```jsx title="src/components/ProfileTabs.jsx"
import { startTransition, useState } from 'react';
import PostsTab from './PostsTab.jsx';

export default function ProfileTabs() {
  const [selected, setSelected] = ~useState('about')~; // Principle 1: stored in the Fiber node of ProfileTabs
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    ~setSelected(nextTab)~; // Principle 4: urgent, throws away a Transition tree that is not finished
    ~startTransition~(() => { // Principle 3: a concurrent render, the loop can stop between Fiber nodes
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
      {tab === 'posts' && ~<PostsTab />~} {/* Principle 2: the last child of the section, linked by sibling */}
      {tab === 'contact' && <p>Contact me at admin@mysite.com</p>}
    </section>
  );
}
```

The `PostsTab` component instantiates 500 lightweight child components, one per post:

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
  ~while~ (performance.now() - startTime < 1) {} // Principle 3: 1 millisecond per Fiber node, React can stop after each one

  return <li className="item">Post #{index + 1}</li>;
}
```

### How React walks the tree when the user clicks Posts, then Contact

When the application first loads, React traverses the tree once from `App` down to the About content, committing it to the DOM. When the user clicks Posts and then clicks Contact during rendering, React executes this exact sequence:

```tree dir=right caption="The order of React's work inside Fiber when the user clicks Posts and then Contact."
Two clicks, seen from inside Fiber
- +1. Click on Posts | The urgent update is **rendered and committed**: the Posts tab turns bold
- +2. Transition render | React builds a **work-in-progress tree** from the `alternate` Fiber nodes
- +3. The loop walks | Down by `child`, across by `sibling`, up by `return`, **one Fiber node per turn**
- +4. React yields | It stops **between two `SlowPost` Fiber nodes** and gives the browser the main thread
- +5. Click on Contact | An **urgent update**: React **throws away** the half-built Posts tree
- +6. Two commits | The Contact tab turns bold, then the **Contact line** shows | **No post** ever reached the DOM
```

```page width=text caption="The finished profile page after the user clicks Posts and then Contact: the Contact line shows, and the Console shows the log of the thrown-away Posts render."
line: [About] [Posts] Contact
line: Contact me at admin@mysite.com | good
log: [ARTIFICIALLY SLOW] Rendering 500 <SlowPost /> | PostsTab.jsx:2
log: [ARTIFICIALLY SLOW] Rendering 500 <SlowPost /> | PostsTab.jsx:2
```

### What developers believe, and what React does

| Aspect | The Common Belief | The React Rule |
| :--- | :--- | :--- |
| **Where state lives** | The element of `<ProfileTabs />` is what React keeps for the component | Elements are new and frozen on every render; the Fiber node lasts and holds the state |
| **How the tree is linked** | A parent holds an array of its children | Each Fiber node links to its first `child`, its next `sibling`, and its parent with `return` |
| **How React walks it** | Rendering is one run of nested calls that cannot stop | One loop visits one Fiber node per turn and can stop between any two in a concurrent render |
| **What the screen shows** | React changes the tree on the screen as it walks | React builds a work-in-progress tree beside the current one and switches them at the commit |

Remember the foundational takeaway of this lesson. React allocates a persistent Fiber node for every component and host tag. It processes nodes in an iterative loop and builds updates in a secondary off-screen tree, pausing safely without exposing partial renders.

---

## For the Interview

> **The Interview Question:** What is a Fiber node, and how does the dual-buffering workLoop manage rendering?

### How to Answer Clearly in 30 Seconds

"A Fiber node is a persistent in-memory JavaScript object that React maintains for each component instance and host tag across renders. It stores the component type, key, current props, Hook state lists, and DOM references. While React elements are temporary blueprints recreated on every render, Fiber nodes survive across renders to maintain state. Fiber nodes form a singly-linked tree connected by child, sibling, and return pointers. React manages rendering using three coordinated mechanisms:
1. **Linked tree structure:** Each Fiber node links to its first child, adjacent sibling, and parent container, eliminating array allocations.
2. **Iterative work loop:** React traverses Fiber nodes in a while loop, performing beginWork on the descent and completeWork on the ascent. Because traversal position is tracked in a single pointer variable, React can pause between any two nodes during concurrent rendering, yield to the browser, and resume later.
3. **Double buffering:** The work loop constructs updates in a secondary work-in-progress tree while the current tree reflects the visible screen. During the commit phase, React mutates the DOM and swaps its root pointer. If an urgent update arrives midway, React discards the unfinished tree, ensuring users never see incomplete UI."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Does Fiber protect React from a call stack overflow on a deep tree?"**
   **Only during the render phase.** Recursive tree traversal pushes a new call stack frame for every level of hierarchy. MDN warns that exceeding stack limits causes a stack overflow error, reported in Chrome as `RangeError: Maximum call stack size exceeded`. React's render loop runs as a flat iterative `while` loop, advancing pointers across `child`, `sibling`, and `return` without adding call stack frames for tree depth. However, the commit phase remains recursive in React 19 as it traverses mutations and layout effects. An excessively deep component hierarchy can still throw a call stack size error during the commit phase. React's documentation explains the purpose: React "can let the browser do some work between component calls so that re-rendering a large component tree doesn't block the main thread."
2. **"Can a Transition make one very slow component interruptible?"**
   **No.** React can yield only at Fiber node boundaries between iterations of `performUnitOfWork`. If a single component function executes a heavy synchronous loop for half a second, it executes to completion because JavaScript functions cannot be interrupted mid-execution. Concurrency provides interruptibility only when heavy workloads are decomposed into many small Fiber nodes, such as 500 individual post components.
3. **"Does React create new Fiber nodes on every render?"**
   **No.** React links paired Fiber nodes across its dual trees using the `alternate` property. During reconciliation, React recycles the alternate Fiber node using `createWorkInProgress` whenever the element type and key match (Lesson 77). The two trees alternate roles at each commit. Because React may discard an in-progress tree during concurrent execution, components must remain pure, and side effects must always reside inside `useEffect`.

```tree caption="Interview summary: what a Fiber node is, how the work loop walks it, and why there are two trees."
Fiber in three parts
- +The Fiber node [`type` `key` `memoizedState` `stateNode`] | One per component and per tag | **Lasts across renders** and holds the state
- +The work loop [`child` `sibling` `return` `workInProgress`] | One Fiber node per turn | Can **stop between two** and continue or restart
- +Double buffering [`current` `alternate`] | The loop builds a **work-in-progress tree** | It becomes current **at the commit**; thrown-away work **never shows**
```
