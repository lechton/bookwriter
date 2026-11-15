# Lecture 62: Virtualized Lists: Rendering Only the Rows the User Can See

*(How do you show 10,000 orders without putting 10,000 rows on the page?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do you render a list of ten thousand items without rendering ten thousand rows?

---

## VS | Every Row `orders.map` vs. Only the Visible Rows `orders.slice`: both show the same twenty orders, only the second keeps the DOM small

> When a page lists 10,000 orders inside a scroll container, the user sees only twenty rows at a time. **A virtualized list renders only those twenty rows, plus a small buffer, and fills remaining space with empty height.** React creates a real DOM element for every element your component returns. CSS `overflow` only hides off-screen rows without removing them from memory or layout.

Consider how this works in plain JavaScript. To display 10,000 orders, you write a loop that creates one `<li>` element per item and appends it to a `<ul>`. The browser never skips creating elements simply because they sit below the viewport:

```js title="Plain JavaScript: a loop creates 10,000 li elements"
for (const order of orders) {
  const li = document.createElement('li');
  li.textContent = 'Order #' + order.id;
  list.~appendChild~(li); // One real element per order: 10,000 in total
}
```

In React, you do not write a manual loop or call `appendChild`. Instead, you call `map()` and return JSX, letting React create DOM elements behind the scenes. The workload on the browser remains identical. Every single `<li>` element returned from `map()` becomes a real, physical DOM node:

```jsx title="React: map returns 10,000 li elements, and React creates every one"
<ul>{~orders.map~(order => <li key={order.id}>Order #{order.id}</li>)}</ul> {/* The same 10,000 real elements */}
```

Keep one guiding rule in mind throughout this lesson. **The count of items in your data and the count of DOM nodes on the page are two independent numbers.** A virtualized list keeps the DOM count small, no matter how large the underlying dataset becomes.

Consider the Orders page in an administrative dashboard. The store holds 10,000 customer orders. They sit inside a scrollable `<div>` that is 600 pixels tall with a vertical scrollbar. Each order row occupies exactly 30 pixels of vertical height, so the container displays twenty rows at any given moment:

```page caption="The Orders page when it opens: a div 600 pixels tall shows the first twenty of 10,000 orders, with a scrollbar beside them."
heading: Orders
line: Order #1
line: Order #2
line: Order #3
line: Order #4
line: Order #5
line: Order #6
line: Order #7
line: Order #8
line: Order #9
line: Order #10
line: Order #11
line: Order #12
line: Order #13
line: Order #14
line: Order #15
line: Order #16
line: Order #17
line: Order #18
line: Order #19
line: Order #20
console: quiet
```

Consider what the browser actually requires here. Because the user only views twenty rows, the page only needs to render those twenty items, along with a small buffer. The remaining unrendered space can be represented with empty height matching the missing rows. This preserves the full scrollbar travel distance. As the user scrolls, the component swaps in the next twenty rows.

**Both approaches look identical on screen, but they are completely different underneath.** The user sees the same twenty rows and the same scrollbar in both implementations. Opening the browser Elements panel reveals the massive difference:

```tree caption="Two ways to show 10,000 orders in a div that shows twenty: the same screen, a very different number of DOM elements."
Two ways to show 10,000 orders in a div 600 pixels tall
- !Every order mapped [`orders.map`] | The div shows **twenty rows** with a scrollbar | The Elements panel holds **10,000 `<li>` elements**
- +Only the visible orders [`orders.slice`] | The div shows **the same twenty rows** with **the same scrollbar** | The Elements panel holds **about twenty `<li>` elements**
```

### Three New Words

> [!DEFINITION]
> **What is a scroll container?** [NEW] A scroll container is an element with bounded dimensions and independent scrolling, established by styles such as `<div style={{ height: 600, overflowY: 'auto' }}>`.
> 1. The container establishes a visible window with fixed dimensions on the screen.
> 2. When internal content exceeds those dimensions, `overflowY: 'auto'` directs the browser to attach a vertical scrollbar.
> 3. Content outside the visible box is clipped from view, but the browser still constructs, styles, and positions every off-screen DOM node.
>
> A scroll container confines scrolling to an individual element instead of the entire browser window. Off-screen elements remain fully present in DOM memory and layout trees (Lesson 62).

> [!DEFINITION]
> **What is a virtualized list?** [NEW] A virtualized list, also called list windowing, is an optimization technique that renders only the rows currently visible inside a scroll container.
> 1. The list tracks scroll position to compute which items currently intersect the visible viewport.
> 2. Only visible rows, along with a small buffer of neighboring rows, are rendered into real DOM elements.
> 3. Empty spacer padding or wrapper elements simulate the height of off-screen items so the scrollbar accurately reflects total dataset length.
>
> A virtualized list decouples data size from DOM size. While the data array holds thousands of items, the DOM only ever contains the few dozen elements visible to the user (Lesson 62).

> [!DEFINITION]
> **What is the event object?** [REVIEW] The event object, conventionally received as `e`, is an object passed to event handlers detailing a user interaction.
> 1. The browser creates an event record containing interaction metadata such as pointer coordinates or scroll offsets.
> 2. React wraps native browser events in a SyntheticEvent wrapper and delivers it to the registered handler.
> 3. The property `e.currentTarget` refers specifically to the DOM element to which the event handler is attached.
>
> In list virtualization, reading `e.currentTarget.scrollTop` provides the exact vertical scroll offset of the scroll container element (Lesson 11).

### What a Long List Costs

Each implementation imposes distinct architectural trade-offs:
1. **Rendering every row degrades performance and memory.** The browser must instantiate, style, and calculate layout geometry for all 10,000 rows before displaying the initial screen. Chrome Lighthouse explicitly warns that an oversized DOM tree prolongs style calculations, inflates memory consumption, and harms responsiveness.
2. **Rendering only visible rows discards unpreserved row state.** When an off-screen row leaves the rendered window, React unmounts it and removes its DOM node. If a user checks a box on an unmounted row, that selection is lost unless preserved in parent state.

Developers frequently fall into four common traps:
1. They assume `overflow: auto` makes off-screen rows computationally cheap, forgetting that CSS clipping still forces the browser to lay out every hidden element.
2. They assume React automatically detects screen boundaries and skips off-screen rows, whereas React creates a DOM node for every returned JSX element.
3. They slice the array to visible items without replacing missing row height, causing the scrollbar to vanish entirely.
4. They store user input inside local row component state, which gets destroyed the moment that row scrolls off screen.

### Three Ways to Show a Long List

When an application presents thousands of records, you have three primary architectural choices:
1. **Render every row.** This approach works well for short lists of a few hundred lightweight items. Always measure before optimizing: test production builds with CPU Throttling enabled on representative user hardware.
2. **Implement pagination or infinite scroll with a Load More trigger.** This design suits feeds where users primarily consume recent entries and rarely browse thousands of historical items. Each batch renders a manageable set of records.
3. **Render a virtualized list.** This strategy fits continuous lists where users freely scroll through thousands of items, such as order books, transaction ledgers, or chat histories. In production systems, developers rely on specialized windowing libraries such as `react-window`.

```tree caption="Three ways to show a long list, and the list each one fits."
Three ways to show thousands of items
- +Render every row | Fits **a few hundred simple rows** | **Measure first** with CPU Throttling and a production build
- +Pages or a `Load more` button | Fits a list where the user wants **the newest items** | Each page renders **a few dozen rows**
- +A virtualized list | Fits **one long list the user scrolls freely** | In production, **a library such as `react-window`** does it
```

In this lesson, we construct a virtualized list from foundational principles step by step, showing exactly how libraries like `react-window` operate under the hood.

### The Rule of Thumb: how many rows can the user see?

**Evaluate every long list by asking one question: how many rows can the user view simultaneously? Render only that visible count plus a small buffer, and represent the remaining rows as empty spacer height.**

## SECTION | The Orders Page: 10,000 Orders in One Scroll Container

Our application consists of three modular source files:
1. **`orders.js`** exports the static data collection containing 10,000 order records.
2. **`OrderList.jsx`** implements the scroll container displaying order rows. This component evolves across our six principles.
3. **`App.jsx`** serves as the root application component, rendering the page title and list container.

```files title="orders-page: File Explorer" caption="How the files of our Orders page sit inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it into `#root`
  App.jsx | parent | Exports `App` as default and imports `OrderList` from `./OrderList.jsx`
  OrderList.jsx | list | Exports `OrderList` as default: the scroll container with one row per order
  orders.js | data | Exports `orders`, an array of 10,000 orders from `{ id: 1 }` to `{ id: 10000 }`
```

The data module generates the 10,000 mock records using standard JavaScript array generation:

```js title="src/orders.js"
export const orders = ~Array.from~({ length: 10000 }, (_, i) => ({ id: i + 1 })); // 10,000 objects, from { id: 1 } to { id: 10000 }
```

The `Array.from()` utility initializes an array of 10,000 items and executes a mapping callback for each position. The callback receives two arguments:
1. The current slot value: because the generated slots are empty, this value is undefined. The parameter is named with an underscore to signal that the code never reads it.
2. The zero-based index: a number running from zero through 9999. Adding one ensures order identifiers begin at 1 instead of 0.

The initial implementation maps every order record directly to a list row:

```jsx title="src/OrderList.jsx"
import { orders } from './orders.js';

export default function OrderList() {
  return (
    <div style={{ height: 600, ~overflowY: 'auto'~ }}> {/* The scroll container: 600 pixels tall, with its own scrollbar */}
      <ul style={{ margin: 0 }}>
        {orders.map(order => (
          <li key={order.id} style={{ height: 30 }}>Order #{order.id}</li>
        ))}
      </ul>
    </div>
  );
}
```

The `margin: 0` style removes default browser list margins, placing the first order row flush against the top edge of the scroll container.

The root application component renders the header and the list:

```jsx title="src/App.jsx"
import ~OrderList~ from './OrderList.jsx'; // The default export of the list file

export default function App() {
  return (
    <main>
      <h1>Orders</h1>
      <OrderList />
    </main>
  );
}
```

When opened in a browser, the page renders the heading, displays orders 1 through 20, and presents a functional vertical scrollbar.

**PRINCIPLES:** Data volume and DOM element count must remain decoupled. A virtualized list manages DOM scale through six core principles:
1. **Principle 1: `orders.map` Puts 10,000 `<li>` Elements in the DOM.** Although the container displays twenty rows, mapping the entire array forces React to render 10,000 DOM nodes.
2. **Principle 2: `onScroll` Tells the List Which Order Is at the Top.** The scroll event handler syncs `scrollTop` into React state, allowing the component to compute the first visible index.
3. **Principle 3: `slice` Alone Removes the Scrollbar.** Rendering only twenty rows collapses content height to 600 pixels, eliminating overflow and disabling scrolling.
4. **Principle 4: Padding Above and Below Brings the Scrollbar Back.** Top and bottom spacer paddings simulate the height of off-screen items, restoring the 300,000-pixel scroll track.
5. **Principle 5: Five Extra Rows Fill the Edges.** An overscan buffer of five rows above and below prevents blank gaps during fractional scrolls or rapid pointer motion.
6. **Principle 6: A Tick Lives in the List, Not in the Row.** Because off-screen rows unmount during scrolling, item state such as checkbox selections must reside in the parent component.

---

## PRINCIPLE | `orders.map`: every order becomes a DOM element, even the ones nobody sees

> [!PRINCIPLE]
> **Principle 1: `orders.map` Puts 10,000 `<li>` Elements in the DOM**
>
> *A component that maps over every item returns one element per item, and React puts every one of them in the DOM, even when the scroll container shows only twenty.*
>
> When twenty rows are visible on screen, it is easy to assume only twenty DOM nodes exist. In reality, the browser creates all 10,000 elements. The layout engine styles, positions, and retains every row in memory before initial paint. The `overflow` property merely clips hidden rows, while optimization hooks like `memo` only affect subsequent renders. For small datasets, mapping every record is completely acceptable. For 10,000 items, measure performance first and virtualize rows.
>
> **DO THIS:**
> ```jsx
> {~latestOrders.map~(order => ( // The 20 newest orders: 20 li elements, nothing to optimize
>   <li key={order.id}>Order #{order.id}</li>
> ))}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <div style={{ height: 600, overflowY: 'auto' }}>
>   {~orders.map~(order => ( // **WRONG:** the div shows 20 rows, but all 10,000 li elements exist
>     <li key={order.id} style={{ height: 30 }}>Order #{order.id}</li>
>   ))}
> </div>
> ```

### Twenty Rows on the Screen, 10,000 in the Elements Panel

Inspecting the initial implementation in developer tools reveals the true DOM footprint:

```dom caption="What the Elements panel shows for the list that maps every order: 10,000 li elements, of which the scroll container shows twenty."
<div style="height: 600px; overflow-y: auto;">
  <ul style="margin: 0px;">
    <li style="height: 30px;">Order #1</li>
    <li style="height: 30px;">Order #2</li>
  * 9,997 more li elements, from Order #3 to Order #9999
!   <li style="height: 30px;">Order #10000</li> | note: The last of 10,000 li elements, far below the bottom edge of the scroll container
  </ul>
</div>
```

Here is the sequence of events during initial page load:
1. The `orders` array contains 10,000 objects, so `orders.map()` produces an array containing 10,000 React elements.
2. During the mount phase, React reconciles these elements and commands the browser to construct 10,000 physical DOM nodes. React does not evaluate whether nodes fall within visible screen bounds.
3. The browser engine computes cascading styles and calculates layout geometry for all 10,000 rows prior to painting. Ten thousand rows at 30 pixels create a total height of 300,000 pixels inside a 600-pixel container.
4. The container clips all content below row twenty. The remaining 9,980 elements remain active in the DOM tree, occupying memory and participating in document layout.

Off-screen nodes are never free. The browser retains every element in memory and recalibrates their styles during reflows. Lighthouse flags excessive DOM nodes because large trees degrade interaction responsiveness. Real production rows also include nested elements such as checkboxes, badges, and action buttons. A complex row quickly multiplies the total node count into hundreds of thousands.

### Mistake: Trust in `memo` to Speed Up the First Load

Here is how this performance bottleneck commonly reaches production:
1. A developer builds a prototype with ten mock records, and the page renders instantly.
2. As the dataset scales in production, the server responds with 10,000 records.
3. The page experiences a noticeable delay before appearing, and scrolling stutters on low-powered devices.
4. The developer wraps individual rows in `memo` or wraps the list in `useMemo`, expecting faster initial loading.

This optimization fails because `memo` and `useMemo` only skip work during subsequent updates. As React documentation emphasizes, `useMemo` cannot accelerate initial component mounting. Neither hook reduces the number of physical DOM nodes constructed on the page.

Development machines are frequently faster than user devices. Always benchmark using production builds while enabling CPU Throttling in browser developer tools.

Remember the guiding principle: data length and DOM node count are two separate concerns. Using `orders.map()` couples them together.

---

## PRINCIPLE | `onScroll` on the scroll container: the list learns which order is at the top

> [!PRINCIPLE]
> **Principle 2: `onScroll` Tells the List Which Order Is at the Top**
>
> *The scroll container's `onScroll` handler copies `e.currentTarget.scrollTop`, the number of pixels scrolled from the top, into state; during render, the first visible row is `Math.floor(scrollTop / 30)`.*
>
> The browser keeps the scroll position inside the DOM element of the scroll container. React learns it only when our `onScroll` handler copies it into state. The handler must sit on the element that really scrolls, the one with `overflowY: 'auto'`, because the browser fires the `scroll` event only on that element, and the event does not bubble to its parents. Once `scrollTop` is in state, the first visible row is simple arithmetic, calculated on every render.
>
> **DO THIS:**
> ```jsx
> <div style={{ height: 600, overflowY: 'auto' }} ~onScroll~={e => setScrollTop(e.currentTarget.scrollTop)}> {/* The element that scrolls: runs on every scroll */}
>   <ul style={{ margin: 0 }}>...</ul>
> </div>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <div style={{ height: 600, overflowY: 'auto' }}>
>   <ul style={{ margin: 0 }} ~onScroll~={e => setScrollTop(e.currentTarget.scrollTop)}>...</ul> {/* **WRONG:** the ul never scrolls, so the line stays on orders 1 to 20 */}
> </div>
> ```

### Pixels from the Browser, a Row Number for React

To mount only visible rows, the component must know which items intersect the viewport. The browser tracks scroll offset directly on the DOM element, but React components only re-render when state or props update.

In plain JavaScript, you attach a listener to read scroll offsets directly from the DOM node:

```js title="Plain JavaScript: read scrollTop from the element"
list.addEventListener('scroll', () => {
  console.log(list.~scrollTop~); // 0 at the top, 3000 after a hundred rows of 30 pixels
});
```

In React, the render cycle must access that offset. The handler therefore copies the offset into local state:

```jsx title="React: copy scrollTop into state on every scroll"
const [scrollTop, setScrollTop] = useState(0);
const first = ~Math.floor(scrollTop / 30)~; // Pixels scrolled divided by the row height: the first visible row

<p>Showing orders {first + 1} to {first + 20} of 10000</p>
<div style={{ height: 600, overflowY: 'auto' }} ~onScroll~={e => setScrollTop(e.currentTarget.scrollTop)}> {/* Copies the browser's number into state */}
  ...
</div>
```

> [!DEFINITION]
> **What is scrollTop?** [NEW] The `scrollTop` property is a native DOM attribute tracking vertical scroll position.
> 1. It measures the vertical pixel distance from the top edge of an element to its currently visible content.
> 2. When the scroll container rests at its topmost position, `scrollTop` evaluates to 0.
> 3. The browser updates this value automatically as the user scrolls, dispatching a native `scroll` event.
>
> A component reads `scrollTop` to determine how far the user has scrolled. In a virtualized list, dividing `scrollTop` by row height identifies the index of the first visible row (Lesson 62).

The `onScroll` prop attaches React synthetic event listeners for native browser scroll events. React documentation notes that scroll events fire when an element scrolls and do not bubble up the DOM hierarchy.

The calculation translates physical pixels into an array index. Because every row measures 30 pixels tall, `Math.floor(scrollTop / 30)` identifies the first visible item in the dataset. The `Math.floor()` function discards fractional remainders, so a scroll offset of 3015 pixels reliably yields index 100. Because array indices begin at zero while user-facing orders start at 1, the counter displays `first + 1`.

The `first` index is a derived variable computed during render. It does not require separate state because it derives deterministically from `scrollTop` (Lesson 22).

### A Scroll of a Hundred Rows

Consider what happens when the user scrolls down by 3000 pixels, the height of one hundred rows:
1. The browser moves internal content upward, firing `scroll` events on the container throughout the motion.
2. React invokes the `onScroll` handler on each event, updating `scrollTop` in component state.
3. Each state update triggers a re-render of `OrderList`.
4. When `scrollTop` reaches 3000, `first` evaluates to 3000 divided by 30, yielding 100. The label updates to display orders 101 through 120, placing `Order #101` at the top of the viewport.

```page caption="The Orders page after the owner scrolls down by 3000 pixels: the line now names orders 101 to 120."
heading: Orders
line: Showing orders 101 to 120 of 10000 | good
line: Order #101
line: Order #102
line: Order #103
line: Order #104
line: Order #105
line: Order #106
line: Order #107
line: Order #108
line: Order #109
line: Order #110
line: Order #111
line: Order #112
line: Order #113
line: Order #114
line: Order #115
line: Order #116
line: Order #117
line: Order #118
line: Order #119
line: Order #120
console: quiet
```

In this transitional step, the component still maps all 10,000 orders during each render. React reconciles the tree and updates only the text content of the summary line in the DOM (Lesson 13). However, because scrolling dispatches dozens of events per second, iterating over 10,000 elements repeatedly stresses the JavaScript thread. Rendering only the visible slice eliminates this overhead.

### Mistake: `onScroll` on the `<ul>` Instead of the `<div>`

Attaching the listener to the wrong element prevents scroll tracking:
1. A developer places the `onScroll` handler on the child `<ul>` element because that list directly encloses the rows.
2. The `<ul>` element never scrolls. It expands naturally to match the full height of its children. The scrolling boundary is the outer `<div>` with `overflowY: 'auto'`.
3. The browser dispatches the `scroll` event exclusively to the scrolling container element. Because scroll events do not bubble, the event never propagates down to child elements.
4. The handler on `<ul>` never fires, leaving the visible counter frozen on orders 1 to 20 while the user scrolls.

```jsx title="onScroll on the list that never scrolls"
<div style={{ height: 600, overflowY: 'auto' }}>
  <ul style={{ margin: 0 }} ~onScroll~={e => setScrollTop(e.currentTarget.scrollTop)}> {/* **WRONG:** the ul never scrolls, so this never runs */}
    ...
  </ul>
</div>
```

Similarly, placing the listener on an ancestor container fails. Attaching `onScroll` to a wrapper `<section>` element catches no events because scroll events do not bubble upward to parent containers. The handler must sit directly on the scrolling element itself.

### The Orders Page Reads the Scroll Position

In the updated list component, state stores the scroll offset while the component derives the first visible index. The position summary appears directly above the container. Every order currently remains mounted in the DOM:

```jsx title="src/OrderList.jsx"
import { useState } from 'react';
import { orders } from './orders.js';

export default function OrderList() {
  const [scrollTop, setScrollTop] = useState(0);
  const first = Math.floor(scrollTop / 30);

  return (
    <section>
      <p>Showing orders {first + 1} to {first + 20} of {orders.length}</p>
      <div style={{ height: 600, overflowY: 'auto' }} ~onScroll~={e => setScrollTop(e.currentTarget.scrollTop)}> {/* Runs while the owner scrolls */}
        <ul style={{ margin: 0 }}>
          {orders.map(order => (
            <li key={order.id} style={{ height: 30 }}>Order #{order.id}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

---

## PRINCIPLE | `slice` alone: twenty rows fill the scroll container exactly, so the scrollbar disappears

> [!PRINCIPLE]
> **Principle 3: `slice` Alone Removes the Scrollbar**
>
> *`orders.slice(first, first + 20)` puts only the visible orders on the page, but the content is then only 600 pixels tall, so the scroll container has nothing left to scroll.*
>
> The browser decides whether to show a scrollbar from the height of the content inside the scroll container. Twenty rows of 30 pixels fill a `<div>` of 600 pixels exactly, so the browser shows no scrollbar, the owner cannot scroll, and `scrollTop` never moves from `0`. A virtualized list has two jobs: render fewer rows, and keep the height of the whole list. `slice()` does only the first one.
>
> **DO THIS:**
> ```jsx
> <ul style={{ margin: 0, ~paddingTop: first * 30, paddingBottom: (orders.length - first - 20) * 30~ }}> {/* Twenty rows plus the height of the other 9,980 */}
>   {orders.slice(first, first + 20).map(order => <li key={order.id} style={{ height: 30 }}>Order #{order.id}</li>)}
> </ul>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <ul style={{ margin: 0 }}>
>   {~orders.slice(first, first + 20)~.map(order => <li key={order.id} style={{ height: 30 }}>Order #{order.id}</li>)} {/* **WRONG:** 600 pixels of content: no scrollbar */}
> </ul>
> ```

### Twenty Orders from `first`

Having calculated the index of the first visible row, the obvious next optimization is slicing the array to render only twenty items:

```jsx title="Slice the array to the twenty visible orders"
{~orders.slice(first, first + 20)~.map(order => ( // Twenty orders, from the first visible one
  <li key={order.id} style={{ height: 30 }}>Order #{order.id}</li>
))}
```

The call to `slice` returns a shallow copy of twenty records starting from the first visible index up to that index plus twenty (Lesson 19). The DOM now holds only twenty `<li>` elements instead of 10,000.

### The Scrollbar Is Gone

**A critical failure immediately occurs: the user opens the page and discovers the scrollbar has disappeared completely.**

```page caption="The Orders page with slice alone: twenty rows, no scrollbar, and the page is stuck on the first twenty orders."
heading: Orders
line: Showing orders 1 to 20 of 10000 | bad
line: Order #1
line: Order #2
line: Order #3
line: Order #4
line: Order #5
line: Order #6
line: Order #7
line: Order #8
line: Order #9
line: Order #10
line: Order #11
line: Order #12
line: Order #13
line: Order #14
line: Order #15
line: Order #16
line: Order #17
line: Order #18
line: Order #19
line: Order #20
empty: no scrollbar beside the orders
console: quiet
```

Our component never intentionally hides the scrollbar. The browser automatically displays scrollbars only when internal content overflows container bounds:
1. On initial mount, `scrollTop` is 0, so `first` is 0. Slicing with `slice(0, 20)` produces twenty records.
2. Twenty rows at 30 pixels total exactly 600 pixels, matching the height of the outer container.
3. Because the content fits inside the container without overflowing, the browser omits the scrollbar.
4. When the user attempts to scroll, nothing moves. No `scroll` events fire, and `scrollTop` remains locked at 0.
5. The view remains permanently stuck displaying the first twenty orders, and the counter never advances.

```dom caption="What the Elements panel shows with slice alone: twenty li elements, and nothing else inside the list."
<div style="height: 600px; overflow-y: auto;">
  <ul style="margin: 0px;">
    <li style="height: 30px;">Order #1</li>
  * 18 more li elements, from Order #2 to Order #19
    <li style="height: 30px;">Order #20</li>
  </ul>
</div>
```

The browser layout engine has no awareness of the original 10,000 array entries in JavaScript memory. It measures only the elements present in the DOM. Scrollable distance depends entirely on physical content dimensions, not data array length.

### Mistake: Fewer Rows Seen as the Whole Idea

This failure stems from a common incomplete mental model:
1. A developer reads that virtualization involves rendering only visible elements.
2. The developer adds `slice(first, first + 20)` directly into the JSX mapping.
3. The Elements panel confirms that only twenty DOM elements exist, which appears successful at first glance.
4. In practice, the interface breaks because the user cannot scroll past the twentieth item.

In our list component, this represents an incomplete step that the next principle resolves:

```jsx title="src/OrderList.jsx" startLine="12"
        <ul style={{ margin: 0 }}>
          {~orders.slice(first, first + 20)~.map(order => ( // **WRONG:** twenty rows make 600 pixels, so nothing can scroll
            <li key={order.id} style={{ height: 30 }}>Order #{order.id}</li>
          ))}
        </ul>
```

---

## PRINCIPLE | `paddingTop` and `paddingBottom`: empty space as tall as the absent rows brings the scrollbar back

> [!PRINCIPLE]
> **Principle 4: Padding Above and Below Brings the Scrollbar Back**
>
> *Give the `<ul>` a top padding as tall as the rows before the visible ones and a bottom padding as tall as the rows after them; the content is then 300,000 pixels tall again, while only twenty rows exist.*
>
> To scroll through 10,000 rows, the scroll container needs content as tall as 10,000 rows, not the rows themselves. The two paddings give that height, so the scrollbar matches the whole list, and the twenty real rows sit exactly where the full list would put them. The arithmetic holds only while every row is exactly the height the code uses.
>
> **DO THIS:**
> ```jsx
> <ul style={{ margin: 0, paddingTop: first * 30, paddingBottom: (orders.length - first - 20) * 30 }}>
>   {visible.map(order => <li key={order.id} style={{ ~height: 30~ }}>Order #{order.id}</li>)} {/* Every row is exactly the 30 pixels the padding counts */}
> </ul>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <ul style={{ margin: 0, paddingTop: first * 30, paddingBottom: (orders.length - first - 20) * 30 }}>
>   {visible.map(order => <li key={order.id} style={{ height: 30, ~padding: '5px 0'~ }}>Order #{order.id}</li>)} {/* **WRONG:** rows are 40 pixels, so the rows jump while the owner scrolls */}
> </ul>
> ```

### Empty Space Stands In for the Rows Left Out

The browser requires accurate content dimensions to generate a properly proportioned scrollbar track. We provide that geometry using CSS padding instead of heavy DOM nodes. Twenty rows render as physical elements, while the unrendered rows are represented by top and bottom padding on the `<ul>`:

```jsx title="Padding above and below the twenty visible rows"
const first = Math.floor(scrollTop / 30);
const visible = orders.slice(first, first + 20);

<ul style={{ margin: 0, ~paddingTop: first * 30~, ~paddingBottom: (orders.length - first - 20) * 30~ }}> {/* The height of the rows before and after the visible ones */}
  {visible.map(order => (
    <li key={order.id} style={{ height: 30 }}>Order #{order.id}</li>
  ))}
</ul>
```

The `paddingTop` and `paddingBottom` properties inject empty spacing within the element boundary. React converts numeric values into pixel units in inline styles, translating `paddingTop: 3000` into `padding-top: 3000px` in the DOM.

The two paddings represent the absent rows:
1. **Top padding** represents the rows preceding the visible window: `first` items multiplied by 30 pixels.
2. **Bottom padding** represents the rows succeeding the visible window: `orders.length - first - 20` items multiplied by 30 pixels.

The total content height dynamically equals top padding plus visible row height plus bottom padding. This sum consistently totals 300,000 pixels, representing the full 10,000-order dataset.

### VS | `slice` Only vs. `slice` with `paddingTop` and `paddingBottom`: the same twenty rows, only one can scroll

::: row caption="The Orders page when it opens, with slice alone and with slice and padding: the same twenty rows, but only one list can scroll."
::: col title="With slice only" tag="600 pixels of content: no scrollbar" tone=bad
```page size=mini
heading: Orders
line: Showing orders 1 to 20 of 10000 | bad
line: Order #1
line: Order #2
line: Order #3
line: Order #4
line: Order #5
line: Order #6
line: Order #7
line: Order #8
line: Order #9
line: Order #10
line: Order #11
line: Order #12
line: Order #13
line: Order #14
line: Order #15
line: Order #16
line: Order #17
line: Order #18
line: Order #19
line: Order #20
empty: no scrollbar beside the orders
```
```jsx title="src/OrderList.jsx" bad="1"
<ul style={{ margin: 0 }}>
```
The content is exactly twenty rows, so the owner cannot scroll.
:::
::: col title="With slice and padding" tag="300,000 pixels of content: the scrollbar is back" tone=good
```page size=mini
heading: Orders
line: Showing orders 1 to 20 of 10000 | good
line: Order #1
line: Order #2
line: Order #3
line: Order #4
line: Order #5
line: Order #6
line: Order #7
line: Order #8
line: Order #9
line: Order #10
line: Order #11
line: Order #12
line: Order #13
line: Order #14
line: Order #15
line: Order #16
line: Order #17
line: Order #18
line: Order #19
line: Order #20
```
```jsx title="src/OrderList.jsx" good="1"
<ul style={{ margin: 0, paddingTop: first * 30, paddingBottom: (orders.length - first - 20) * 30 }}>
```
The bottom padding adds the height of 9,980 orders, so the scrollbar is back, and the owner can scroll.
:::
:::

**While both screens display identical initial rows, only the padded list functions.** Padding restores total dataset geometry, generating a complete scroll track that allows the user to scroll smoothly through all 10,000 records.

### Three Scroll Positions

Across every scroll position, the twenty rendered rows align precisely where full rendering would have placed them:
1. **At the top:** `scrollTop` equals 0, making `first` equal 0. Top padding is 0 pixels, and bottom padding evaluates to 299,400 pixels.
2. **One hundred rows down:** `scrollTop` reaches 3000 pixels, so `first` evaluates to 100. Top padding expands to 3000 pixels, while bottom padding contracts to 296,400 pixels. The list mounts `Order #101` through `Order #120`.
3. **At the very bottom:** `scrollTop` reaches 299,400 pixels, derived from total height minus container height. The first visible index becomes 9980, mounting orders 9981 through 10000, with bottom padding at 0.

| Where the owner is | `scrollTop` | `first` | Top padding | Rows in the DOM | Bottom padding |
| :--- | :--- | :--- | :--- | :--- | :--- |
| At the top | `0` | `0` | `0` | `Order #1` to `Order #20` | `299400` |
| A hundred rows down | `3000` | `100` | `3000` | `Order #101` to `Order #120` | `296400` |
| At the very bottom | `299400` | `9980` | `299400` | `Order #9981` to `Order #10000` | `0` |

The Elements panel contains twenty `<li>` elements at every scroll stage. Their text and the surrounding padding values update dynamically as the user scrolls:

```dom caption="What the Elements panel shows after a scroll of 3000 pixels: two paddings that change, and twenty li elements."
<div style="height: 600px; overflow-y: auto;">
+ <ul style="margin: 0px; padding-top: 3000px; padding-bottom: 296400px;"> | note: The height of orders 1 to 100 above, and of orders 121 to 10000 below
    <li style="height: 30px;">Order #101</li>
  * 18 more li elements, from Order #102 to Order #119
    <li style="height: 30px;">Order #120</li>
  </ul>
</div>
```

This encapsulates the core virtualization technique. You derive total scroll height from dataset length, calculate the active index from scroll position, slice visible records, and fill off-screen height with empty padding. The scrollbar reflects the complete dataset, while the DOM only instantiates visible rows.

The DOM node count remains constant regardless of dataset size. Whether rendering 1,000 orders or 1,000,000 orders, the DOM retains only twenty `<li>` elements while bottom padding expands accordingly:

```tree caption="Every order mapped vs. twenty orders with padding: the same screen, a DOM of a very different size."
The same Orders page, two DOMs
- !Every order mapped, as in Principle 1 | **Twenty rows** on screen and a scrollbar for 10,000 orders | The DOM holds **10,000 `<li>` elements**
- +Twenty orders with padding | **The same rows** and **the same scrollbar** | The DOM holds **twenty `<li>` elements**, for 10,000 orders or for 1,000,000
```

### Mistake: Rows Taller Than the Arithmetic

The virtualization formula relies strictly on uniform, predictable row heights. Discrepancies break layout calculations:
1. The developer configures `height: 30` in row styles.
2. A global stylesheet introduces `padding: 5px 0` on `<li>` tags, raising actual rendered row height to 40 pixels while code calculations still assume 30 pixels.
3. As the user scrolls, each unmounted row causes `first` to increment, removing 40 physical pixels while adding only 30 pixels of top padding.
4. The remaining rows jump upward by 10 pixels on each boundary transition, producing jarring visual stuttering.

Every rendered row must adhere strictly to the dimensions used in positioning calculations. Dynamic or variable-height rows, such as variable-length chat bubbles, require post-mount measurement using `ResizeObserver` or `useLayoutEffect`, paired with dynamic offset caching. Production windowing libraries encapsulate this complexity.

### The Orders Page Keeps the Full Height

In our list component, `visible` stores the sliced array, and the `<ul>` receives dynamic padding:

```jsx title="src/OrderList.jsx" startLine="4"
export default function OrderList() {
  const [scrollTop, setScrollTop] = useState(0);
  const first = Math.floor(scrollTop / 30);
  const ~visible~ = orders.slice(first, first + 20); // The twenty orders the owner can see

  return (
    <section>
      <p>Showing orders {first + 1} to {first + 20} of {orders.length}</p>
      <div style={{ height: 600, overflowY: 'auto' }} onScroll={e => setScrollTop(e.currentTarget.scrollTop)}>
        <ul style={{ margin: 0, ~paddingTop: first * 30, paddingBottom: (orders.length - first - 20) * 30~ }}> {/* Always 300,000 pixels in total */}
          {visible.map(order => (
            <li key={order.id} style={{ height: 30 }}>Order #{order.id}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

---

## PRINCIPLE | `start` and `end` with five extra rows: the rows next to the visible part already exist

> [!PRINCIPLE]
> **Principle 5: Five Extra Rows Fill the Edges**
>
> *Render a few rows more than the scroll container shows, five above and five below, so the rows next to the visible ones already exist when the scroll stops between two rows or moves quickly.*
>
> A scroll that stops between two rows shows part of a twenty-first row, and a fast scroll moves the content before React renders the next rows. With exactly twenty rows, both show blank padding at the edge. Five extra rows on each side cover both cases, at the cost of about ten more DOM elements.
>
> **DO THIS:**
> ```jsx
> const start = Math.max(0, first - extraRows);
> const end = Math.min(orders.length, first + 20 + extraRows);
> const rows = ~orders.slice(start, end)~; // About thirty rows: the edges are always filled
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const rows = ~orders.slice(first, first + 20)~; // **WRONG:** between two rows, the bottom edge shows blank padding
> ```

### A Blank Strip at the Bottom Edge

**Rendering exactly twenty rows exposes visible rendering flaws where content appears missing.** This artifact arises under two conditions.

The first condition occurs whenever scrolling pauses between row boundaries:
1. The user scrolls down by 3015 pixels.
2. The index calculation `Math.floor(3015 / 30)` evaluates to 100. The component slices orders 101 through 120, beginning at vertical offset 3000.
3. The viewport now exposes the content window from offset 3015 to 3615 pixels. This view displays the lower half of `Order #101` at the top and requires space for a twenty-first row at the bottom.
4. Because the slice contains only twenty rows, rendered content terminates at 3600 pixels. `Order #121` is omitted from the slice, exposing a 15-pixel blank strip of bottom padding.

```page caption="The bottom of the scroll container at a scroll of 3015 pixels, with exactly twenty rows: a blank strip where Order #121 belongs."
line: Order #118
line: Order #119
line: Order #120
empty: blank strip where Order #121 belongs
```

The second condition occurs during rapid scrollbar dragging. The browser compositor repositions the scroll surface immediately on the graphics pipeline, whereas JavaScript event handlers and React rendering execute asynchronously on the main thread. If pointer motion outpaces rendering updates, users perceive blank spacer background until React mounts the incoming rows.

### Two Numbers for `slice`: `start` and `end`

The solution is rendering an overscan buffer: mounting a small number of buffer rows above and below the visible viewport:

```jsx title="Five extra rows above and five below the visible rows"
const extraRows = 5;
const start = ~Math.max(0, first - extraRows)~; // Five rows before the visible ones, but never before the first order
const end = ~Math.min(orders.length, first + 20 + extraRows)~; // Five rows after them, but never past the last order

<ul style={{ margin: 0, paddingTop: start * 30, paddingBottom: (orders.length - end) * 30 }}>
  {orders.slice(start, end).map(order => (
    <li key={order.id} style={{ height: 30 }}>Order #{order.id}</li>
  ))}
</ul>
```

The `start` and `end` indices establish slice boundaries for the buffered dataset. Both values calculate deterministically from `first`:
1. **`Math.max(0, ...)`** ensures the start index never drops below zero when the user views the beginning of the list.
2. **`Math.min(orders.length, ...)`** clamps the end index to total dataset length, preventing out-of-bounds indexing at the list bottom.

Padding calculations now reference `start` and `end`, maintaining a total height of 300,000 pixels. At the list start, the component mounts twenty-five rows: twenty visible items plus five trailing buffer rows. In mid-list positions, it mounts thirty rows: five leading buffer rows, twenty visible items, and five trailing buffer rows.

At scroll offset 3015, the slice covers orders 96 through 125, guaranteeing that row 121 is already rendered and visible. Moderate or swift scrolling displays real rows rather than blank background.

The React team highlights this technique on react.dev. They note that production virtualized lists pre-render buffer rows above and below the visible window to ensure smooth visual continuity.

### VS | Exactly Twenty Rows vs. Five Extra Rows on Each Side: the same screen at rest, different edges in motion

**While both configurations look identical at rest, their behavior during active scrolling differs completely.** When stationary on an exact row boundary, both display twenty items. However, the buffered version ensures adjacent rows already exist before the user scrolls:

```tree caption="Exactly twenty rows vs. five extra rows on each side: the same list at rest, different edges when the scroll moves."
Two ways to choose the rows to render
- !Exactly the visible rows [`first` to `first + 20`] | **Twenty rows**, the same as the screen shows at rest | Between two rows or in a fast scroll, the edge shows **blank padding**
- +Five extra rows on each side [`start` to `end`] | **About thirty rows**, twenty of them visible | The rows next to the visible ones **already exist** when the scroll moves
```

Increasing buffer size reduces scroll blanking, but adds DOM nodes and increases render workload. Five buffer rows represents an effective balance. Production libraries provide configuration options, such as overscan counts, to fine-tune this trade-off.

### Mistake: A Test with a Slow Scroll on a Fast Laptop

Edge-clipping defects easily slip past local developer testing:
1. The developer tests scrolling with deliberate mouse wheel movements on a powerful development computer.
2. React re-renders quickly enough that boundary clipping is never observed.
3. In production, users on lower-end devices scroll rapidly, causing white background gaps to flicker into view.

### The Orders Page Gets Its Extra Rows

In our list component, `start` and `end` now determine slice boundaries and padding values:

```jsx title="src/OrderList.jsx" startLine="4"
const extraRows = 5;

export default function OrderList() {
  const [scrollTop, setScrollTop] = useState(0);
  const first = Math.floor(scrollTop / 30);
  const ~start~ = Math.max(0, first - extraRows); // 0 at the top, first - 5 everywhere else
  const ~end~ = Math.min(orders.length, first + 20 + extraRows); // 10000 at the bottom, first + 25 everywhere else

  return (
    <section>
      <p>Showing orders {first + 1} to {first + 20} of {orders.length}</p>
      <div style={{ height: 600, overflowY: 'auto' }} onScroll={e => setScrollTop(e.currentTarget.scrollTop)}>
        <ul style={{ margin: 0, paddingTop: start * 30, paddingBottom: (orders.length - end) * 30 }}>
          {orders.slice(start, end).map(order => (
            <li key={order.id} style={{ height: 30 }}>Order #{order.id}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

---

## PRINCIPLE | `selectedIds` in the list: a tick survives when its row scrolls away

> [!PRINCIPLE]
> **Principle 6: A Tick Lives in the List, Not in the Row**
>
> *A row that leaves the visible part is removed from the DOM, and React destroys what it held; anything the user sets on a row, such as a tick, must live in the list's state, keyed by the order's ID.*
>
> In a virtualized list, the order stays in the data while its row comes and goes. A tick that the browser keeps inside the row's checkbox is destroyed with the row, and the new checkbox that appears on the way back is empty. A tick kept in `selectedIds`, in the state of `OrderList`, survives every scroll, because each new checkbox reads it from state.
>
> **DO THIS:**
> ```jsx
> <input type="checkbox" ~checked={selectedIds.includes(order.id)}~ onChange={() => toggle(order.id)} /> {/* The tick lives in OrderList: it survives the scroll */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~<input type="checkbox" />~ {/* **WRONG:** the tick lives in the DOM element, so it is gone after the row scrolls away */}
> ```

### A Checkbox the Browser Keeps

To allow batch actions such as printing shipping manifests, each row receives an interactive selection checkbox. An uncontrolled input represents the simplest implementation:

```jsx title="A checkbox that the browser keeps inside each row"
<li key={order.id} style={{ height: 30 }}>
  ~<input type="checkbox" />~ {/* No checked prop: the browser keeps the tick inside this DOM element */}
  Order #{order.id}
</li>
```

Without a `checked` prop, the browser maintains selection state internally inside the physical `<input>` DOM node (Lesson 20). This behaves predictably when rendering every row, because elements remain permanently attached to the document. In a virtualized list, however, rows mount and unmount dynamically as they enter and exit the active window.

### The Tick on `Order #3` Is Gone

**A critical bug emerges: the user selects `Order #3`, scrolls down, scrolls back, and finds the checkbox empty.**

1. The user checks `Order #3`. The browser updates the internal checked property on that specific `<input>` DOM element.
2. The user scrolls downward until `Order #101` reaches the top. With overscan applied, the start index becomes 95, excluding `Order #3` from the active slice.
3. React unmounts the `Order #3` row, removing its DOM nodes from the tree and discarding all internal element state.
4. The user scrolls back to the top of the list, returning `Order #3` into the active slice range.
5. React mounts a brand-new `<li>` element with a fresh `<input>` node, which initializes in its default unchecked state.

```page caption="The top of the Orders page after the owner ticks Order #3, scrolls down to Order #101, and scrolls back: the tick is gone."
heading: Orders
line: Showing orders 1 to 20 of 10000
form:
  check: Order #1
  check: Order #2
  check: Order #3 | off | bad
  check: Order #4
  check: Order #5
  check: Order #6
  check: Order #7
  check: Order #8
  check: Order #9
  check: Order #10
  check: Order #11
  check: Order #12
  check: Order #13
  check: Order #14
  check: Order #15
  check: Order #16
  check: Order #17
  check: Order #18
  check: Order #19
  check: Order #20
console: quiet
```

No application logic explicitly clears the checkbox. Rather, the re-mounted row is an entirely new DOM element. When React unmounts a component tree, all associated DOM state is destroyed (Lesson 25).

In a virtualized list, data records persist while row DOM elements transiently mount and unmount. Any state modifying an item must reside in persistent React data structures rather than ephemeral DOM elements.

### The Ticks Move Up into `OrderList`

The resolution is lifting selection state into the parent `OrderList` component, whose lifecycle spans the entire list duration:

```jsx title="The ticked orders kept in the state of OrderList"
const [selectedIds, setSelectedIds] = useState([]);

function toggle(id) {
  setSelectedIds(
    selectedIds.includes(id)
      ? selectedIds.filter(x => x !== id) // Already ticked: a new array without this ID
      : [...selectedIds, id] // Not ticked yet: a new array with this ID added
  );
}

<li key={order.id} style={{ height: 30 }}>
  <input type="checkbox" ~checked={selectedIds.includes(order.id)}~ onChange={() => toggle(order.id)} /> {/* Reads the tick from state, not from the DOM element */}
  Order #{order.id}
</li>
```

The `includes()` method determines whether the identifier exists in the selected array. When the user returns to the top and React constructs a new checkbox for Order #3, the checked attribute evaluates to true from state. Selection state is restored seamlessly:

```page caption="The same scroll down and back with the ticks kept in selectedIds: Order #3 is still ticked."
heading: Orders
line: Showing orders 1 to 20 of 10000
form:
  check: Order #1
  check: Order #2
  check: Order #3 | on | good
  check: Order #4
  check: Order #5
  check: Order #6
  check: Order #7
  check: Order #8
  check: Order #9
  check: Order #10
  check: Order #11
  check: Order #12
  check: Order #13
  check: Order #14
  check: Order #15
  check: Order #16
  check: Order #17
  check: Order #18
  check: Order #19
  check: Order #20
console: quiet
```

```tree caption="A tick kept by the browser inside the row vs. a tick kept in the state of OrderList, after the row leaves and comes back."
Where the tick on `Order #3` lives
- !Kept by the browser in the row [`<input type="checkbox" />`] | Lives **inside the DOM element** of the checkbox | The row leaves, React **removes the element**, and the tick is **gone**
- +Kept in `selectedIds` in `OrderList` [`checked` read from `selectedIds`] | Lives **in the state of the list** | The new checkbox **reads `true` from state**, so the tick is **back**
```

This architectural principle applies to any transient DOM condition, including input text, active focus, open dropdown menus, or in-flight CSS transitions. When a row unmounts, all DOM-only attributes disappear.

Key selection is equally vital: rows must be identified by persistent entity IDs using `key={order.id}`. If keyed by transient slice index, index 0 shifts to different records during scrolling, causing React to associate existing DOM nodes and inputs with unrelated orders (Lesson 61).

### Mistake: Ticks Tested Only Near the Top

This bug easily evades detection during shallow manual verification:
1. A developer adds checkboxes to a virtualized list and verifies functionality by toggling items on the first screen.
2. The selections persist because those initial items never scroll out of the visible buffer.
3. In production, an administrator selects items near the top, scrolls deep into the list to select additional records, and triggers a batch export.
4. The initial selections were silently destroyed when scrolled off screen, causing those orders to be excluded from the batch.

### The Orders Page Keeps Its Ticks

In our list component, `selectedIds` and the `toggle` handler are integrated into component state:

```jsx title="src/OrderList.jsx" startLine="6"
export default function OrderList() {
  const [scrollTop, setScrollTop] = useState(0);
  const [~selectedIds~, setSelectedIds] = useState([]); // Lives as long as the list, not as long as a row
  const first = Math.floor(scrollTop / 30);
  const start = Math.max(0, first - extraRows);
  const end = Math.min(orders.length, first + 20 + extraRows);

  function toggle(id) {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter(x => x !== id)
        : [...selectedIds, id]
    );
  }
```

Each row binds its controlled checkbox to `selectedIds`:

```jsx title="src/OrderList.jsx" startLine="27"
            <li key={order.id} style={{ height: 30 }}>
              <input type="checkbox" ~checked={selectedIds.includes(order.id)}~ onChange={() => toggle(order.id)} /> {/* The tick survives every scroll */}
              Order #{order.id}
            </li>
```

---

## All 6 Principles Together

### The Complete Files

The mock data module generates 10,000 order records:

```js title="src/orders.js"
export const orders = Array.from({ length: 10000 }, (_, i) => ({ id: i + 1 }));
```

The root application component renders the page title and list container:

```jsx title="src/App.jsx"
import OrderList from './OrderList.jsx';

export default function ~App~() { // 1. Called once, when the page opens
  return (
    <main>
      <h1>Orders</h1>
      <OrderList />
    </main>
  );
}
```

Here is the complete implementation of the virtualized list component. It tracks scroll position in state and renders the visible slice with buffer rows. Dynamic padding maintains full scroll dimensions, while parent state preserves user selections:

```jsx title="src/OrderList.jsx"
import { useState } from 'react';
import { orders } from './orders.js';

const extraRows = 5;

export default function OrderList() {
  const [scrollTop, setScrollTop] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]); // 6. The ticks live in the list, not in the rows
  const ~first~ = Math.floor(scrollTop / 30); // 2. The first visible order, from the scroll position
  const start = Math.max(0, first - extraRows);
  const end = Math.min(orders.length, first + 20 + extraRows);

  function toggle(id) {
    setSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter(x => x !== id)
        : [...selectedIds, id]
    );
  }

  return (
    <section>
      <p>Showing orders {first + 1} to {first + 20} of {orders.length}</p>
      <div style={{ height: 600, overflowY: 'auto' }} ~onScroll~={e => setScrollTop(e.currentTarget.scrollTop)}> {/* 2. On the element that scrolls */}
        <ul style={{ margin: 0, ~paddingTop: start * 30, paddingBottom: (orders.length - end) * 30~ }}> {/* 4. The height of the rows not on the page */}
          {~orders.slice(start, end)~.map(order => ( // 1, 3 and 5. About thirty rows instead of 10,000
            <li key={order.id} style={{ height: 30 }}>
              <input type="checkbox" checked={selectedIds.includes(order.id)} onChange={() => toggle(order.id)} />
              Order #{order.id}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

### How React Renders the Orders Page

When the application mounts, React executes App, which returns the heading and list elements, and then React invokes OrderList. Thereafter, updates remain isolated to OrderList:
1. Whenever the user scrolls, the scroll handler updates state, triggering a re-render of OrderList.
2. Whenever the user toggles a checkbox, the toggle function updates selected identifiers, triggering a re-render of OrderList.

In both scenarios, the parent `App` component does not re-render.

```tree caption="The order in which React calls the components of the Orders page, and what OrderList calculates and renders on every scroll and every tick."
`App` [`<h1>` `<OrderList />`] | 1. Called **once**, when the page opens
- +`OrderList` [`scrollTop` `selectedIds`] | 2. Called on the first render, and again after **every scroll** and **every tick**
  - +Calculated during render [`first` `start` `end`] | The visible rows and **five extra rows on each side**
  - +Rendered into the DOM [`<p>` `<div>` `<ul>`] | The line, the scroll container, and **about thirty `<li>` rows** between two paddings
```

Here is the finalized user interface after the administrator selects `Order #3` and `Order #5`:

```page caption="The finished Orders page after the owner ticks Order #3 and Order #5."
heading: Orders
line: Showing orders 1 to 20 of 10000
form:
  check: Order #1
  check: Order #2
  check: Order #3 | on
  check: Order #4
  check: Order #5 | on
  check: Order #6
  check: Order #7
  check: Order #8
  check: Order #9
  check: Order #10
  check: Order #11
  check: Order #12
  check: Order #13
  check: Order #14
  check: Order #15
  check: Order #16
  check: Order #17
  check: Order #18
  check: Order #19
  check: Order #20
console: quiet
```

### Each Habit, and the Rule That Replaces It

| Aspect | The habit that breaks the page | The rule of a virtualized list |
| :--- | :--- | :--- |
| **The rows** | `orders.map` over 10,000 orders, with trust in `overflow` to make the hidden rows cheap | Render only the visible rows with `slice()` |
| **The scroll position** | `onScroll` on the `<ul>`, which never scrolls | `onScroll` on the `<div>` with `overflowY: 'auto'`, which copies `e.currentTarget.scrollTop` into state |
| **The scrollbar** | `slice()` alone, which leaves 600 pixels of content and no scrollbar | A top and a bottom padding as tall as the rows not on the page |
| **The edges** | Exactly twenty rows, which leave blank strips between two rows and in a fast scroll | Five extra rows above and below the visible ones |
| **What a row holds** | A tick kept by the browser inside the row, destroyed with the row | Ticks kept in `selectedIds` in the list, keyed by `order.id` |

Keep the guiding rule of this lesson in mind. **The count of items in your dataset and the count of DOM elements on the screen are two independent numbers.** A virtualized list bounds the DOM to approximately thirty elements, whether managing 10,000 items or several million.

---

## For the Interview

> **The Interview Question:** How do you render a list of ten thousand items without rendering ten thousand rows?

### How to Answer Clearly in 30 Seconds

"Data count and DOM node count must remain decoupled. Mapping 10,000 items directly causes React to instantiate 10,000 physical DOM nodes, even if only twenty are visible. The CSS `overflow` property merely clips off-screen content, while an oversized DOM degrades style calculations, layout performance, and memory consumption. We resolve this by virtualizing the list:
1. **Read scroll offsets:** An `onScroll` listener on the scroll container syncs `scrollTop` into state, letting the component calculate the first visible index by dividing offset by row height.
2. **Mount only visible items:** We slice the array to render visible rows plus a small overscan buffer to eliminate visual tearing during fast scrolling.
3. **Simulate full scroll dimensions:** Top and bottom spacer paddings represent the height of unrendered rows, preserving accurate scrollbar proportions across the entire dataset.

This bounds DOM size to roughly thirty nodes regardless of whether the dataset contains ten thousand or one million records. In production, teams typically adopt proven windowing libraries such as `react-window`."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why not wrap the rows in `memo` or the list in `useMemo` instead?"**
   Neither optimization reduces DOM node count. The `memo` and `useMemo` hooks only skip re-rendering during subsequent update cycles. During initial mount, every component must execute and construct its DOM elements. React documentation explicitly confirms that `useMemo` cannot accelerate initial render times. Similarly, concurrent hooks like `useDeferredValue` and `useTransition` help maintain input responsiveness during heavy renders, but do not reduce render workload or DOM size. Only rendering fewer elements relieves browser memory and layout overhead.
2. **"What happens to state inside a row that scrolls out of view?"**
   The state is destroyed. When a row exits the active slice window, React unmounts the component and removes its DOM node. All transient DOM state, including uncontrolled checkbox selections, text input values, active focus, and open dropdowns, is completely discarded. When the item re-enters the viewport, React constructs a fresh component instance with initial state. Therefore, interactive row state must be lifted into parent component state keyed by item ID, such as `selectedIds`. Rows must also use stable entity keys such as `key={order.id}` rather than positional slice indices.
3. **"How do you jump to item 5,000, and what changes when the rows have different heights?"**
   To jump programmatically, you cannot invoke `scrollIntoView()` on row 5,000 because its DOM node does not exist until scrolled into view (Lesson 31). Instead, you imperatively assign `scrollTop` on the scroll container to `4999 * 30` using a ref, causing the component to render that slice immediately. When rows have dynamic heights, simple mathematical division breaks down. Each row must be measured after mounting and prior to paint using `useLayoutEffect` (Lesson 49) or `ResizeObserver`, with offsets recorded in an index cache. Unrendered items rely on estimated heights until rendered. Specialized windowing libraries automate this dynamic measurement.

```tree dir=right caption="Interview comparison: every item mapped, slice alone, and a virtualized list with padding and extra rows."
Ten thousand items in one scroll container
- !Every item mapped [`items.map`] | Twenty rows on screen | The DOM holds **10,000 elements**: slow to appear, heavy in memory
- !Slice alone [`slice` from `first` to `first + 20`] | Twenty rows fill the scroll container exactly | **No scrollbar**: the user is stuck on the first twenty
- +Virtualized list [`slice` from `start` to `end`, two paddings] | About thirty rows, five extra on each side | The scrollbar matches **all 10,000 items**; row data lives **in the parent's state**
```
