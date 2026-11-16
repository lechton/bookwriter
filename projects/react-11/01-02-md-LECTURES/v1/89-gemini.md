# Lecture 89: Letting the Page Decide What Shared Tabs Show

*(How can one shared Tabs component look different on every page without a new prop for every request?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | How do Render Props, Compound Components, and Slot patterns structure flexible UI?

---

## VS | One New Prop per Request vs. Markup Written by the Page: both show the count, only the second leaves `Tabs` unchanged

> A shared component is written once and used across many pages, yet every page requires small visual variations. **Instead of adding dedicated props to the shared component for each request, let the page write the markup and let the component position it**. That separation keeps the shared file stable, ensuring that a change on one page never breaks another.

Passing arguments to functions is fundamental to JavaScript. A call like `greet('John')` passes a string, while `setCount(12)` passes a number. In React, JSX elements are standard JavaScript values rather than special template syntax (Lesson 76). Because JSX is an ordinary value, a prop can carry markup just as easily as primitive data. A component can accept a number like `count={12}`, or it can accept an element like `countLabel={<b>12</b>}`. The entire architecture of flexible user interface patterns rests on this single principle.

Now consider a typical design problem. On an online store, a product screen for wireless headphones displays two tabs beneath the main image: Description and Reviews. The development team creates a single reusable component named `Tabs` to serve all items across the store, including footwear, books, and electronics.

Soon, specific feature requests arrive for the headphones view, delivered in three distinct stages:
1. The Reviews tab must display a review count badge showing 12.
2. The currently active tab label must render in bold text so users immediately identify the active selection.
3. A promotional return policy banner reading "Free returns for 30 days." must appear between the tab buttons and the active tab text.

When developers first face these requirements, their immediate impulse is to add new props to `Tabs`. They add review count props, then a boolean prop for the active tab, and finally another prop for the policy banner. Within weeks, the shared component becomes bloated with logic tied to specific pages. Every page using the component inherits these props, even when only one page requires them.

This habit damages maintainability. Modifying a shared file for the sake of one consumer risks introducing regressions across unrelated pages. Furthermore, reading `<Tabs showCount={true} />` in code obscures the rendered output, forcing engineers to inspect the internal implementation of `Tabs` just to discover what elements appear on screen.

A resilient architecture solves this by asking one question: who writes the markup? The guiding principle is always the same. The consuming page authors the markup, and `Tabs` only controls its layout. You can implement this division through three established JavaScript and HTML patterns:
1. **Pass finished JSX elements through a prop.** The parent constructs the markup directly, similar to passing any object argument to a function.
2. **Pass a function that returns JSX.** This mirrors the native `map` method. Just as `names.map(name => <li>{name}</li>)` lets an array drive iteration while your callback dictates element structure, `Tabs` manages tab state while the page's function determines styling.
3. **Decompose the feature into cooperating components.** This follows the native HTML `<select>` and `<option>` model. The developer places individual elements in any desired layout, and the parent container coordinates their shared state automatically.

> [!DEFINITION]
> **What is children?** [REVIEW] The `children` identifier is an ordinary React prop that receives whatever elements sit between a component's opening and closing tags.
> 1. A parent renders a child with nested elements: `<Card><p>Hello</p></Card>`.
> 2. React packages those nested elements into `props.children` and passes them to `Card`.
> 3. The child component places `{children}` in its JSX wherever those elements should appear.
>
> The `children` prop carries elements created and owned by the parent component. Because JSX is a standard JavaScript value, any custom prop can carry markup just like `children`, allowing a component to receive content in multiple separate places (Lesson 09).

### Two ways to ask `Tabs` for the review count

Here is the structural difference in two lines:

```jsx title="Telling Tabs what to draw, and handing Tabs what to draw"
<Tabs ~showCount={true} count={12}~ /> {/* Tabs must already hold the markup for the count */}
<Tabs ~countLabel={<b>12</b>}~ /> {/* The page wrote the markup; Tabs only places it */}
```

Both approaches pass props to `Tabs`, but they assign architectural responsibility differently. The fundamental distinction lies in which component owns the markup:
- **With dedicated count props**, `Tabs` must contain the internal JSX that formats and renders the count badge. Every new display variation requires editing the shared component.
- **With `countLabel`**, the consuming page authors the JSX directly. `Tabs` merely accepts that pre-built element and inserts it into the layout.

Passing a React element into a prop uses the exact same mechanism as passing a primitive number. Both are standard JavaScript values passed across component boundaries.

```tree caption="Two ways to ask a shared Tabs component for the review count: describe it with props, or hand over the markup."
Two ways to ask `Tabs` for the review count
- !Describe it with props [`showCount={true}` `count={12}`] | `Tabs` holds the **markup for the count** | Every new request **changes the shared file**
- +Hand over the markup [`countLabel={<b>12</b>}`] | The page **writes the markup** | `Tabs` only decides **where it goes**
```

### The Rule of Thumb: who knows the markup, and when?

**The consuming page writes the markup, and `Tabs` only places it. If the page knows the full markup before `Tabs` renders, pass static JSX. If the markup depends on internal state that only `Tabs` knows, such as the active tab, pass a function. If the page must control the arrangement of individual elements, export cooperating components.**

Experienced engineers guard against three classic misconceptions:
1. **Believing only `children` can carry JSX.** Any prop can carry markup because JSX evaluates to a JavaScript object.
2. **Believing a render prop is a special framework mechanism.** It is merely an ordinary prop holding a function that returns an element.
3. **Reaching for `Children.map` and `cloneElement`** to inject props into nested tags. The official React documentation warns that these legacy helpers create fragile code, as explored in Lesson 100.

In production applications, four primary strategies let a page customize what a shared component displays. This lesson explores the first three:

```tree caption="Four ways to let a page decide what a shared component shows, and when each one fits."
Four ways to let the page decide what `Tabs` shows
- +1. JSX in a prop [`children` `header` `tabs`] | The page **writes the whole markup** before `Tabs` runs | Fits **visual wrappers** such as panels and grids, and lists of tabs
- +2. A render prop [`renderTab`] | `Tabs` **calls the page's function** and passes what only `Tabs` knows | Fits when the markup **depends on the open tab**
- +3. Several components exported together [`Tabs` `Tab` `TabPanel`] | The page **places each part itself**; the parts share state through **context** | Fits when the page decides **the order** of the parts
- +4. A custom Hook | Shares **only the logic**; the page writes **all the markup** | Fits when **no markup** should be shared, as Lesson 39 shows
```

## SECTION | The Headphones Page with Two Tabs

When the page loads, it displays two tab buttons and renders the text of the Description tab underneath:

```page width=text caption="The headphones page when it opens: two tabs, and the text of the Description tab under them."
heading: Wireless Headphones
line: [Description] [Reviews]
line: Light and loud.
```

When the user selects Reviews, the content area beneath the tab buttons updates:

```page width=text caption="The same page after the user clicks Reviews: the text under the tabs changes."
heading: Wireless Headphones
line: [Description] [Reviews]
line: John: Great sound. | good
```

The example application contains two core files: the shared `Tabs` component and the consuming product page. Throughout this chapter, the term "the page" refers to `ProductPage`, which imports and configures `Tabs`.

```files title="product-page: File Explorer" caption="The two files of our example: the shared Tabs component and the product page that uses it."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `ProductPage` and mounts it into `#root`
  Tabs.jsx | shared component | The tabs used by every product page of the store
  ProductPage.jsx | page | The headphones page; imports from `./Tabs.jsx`
```

Our initial implementation of `Tabs` mirrors the canonical structure shown in the official React documentation. The consuming page passes an array of tab descriptor objects through the `tabs` prop. Each object defines an identifier string, a button header label, and a `content` element for the tab body:

```jsx title="src/ProductPage.jsx"
import Tabs from './Tabs.jsx';

const tabs = [
  { id: 'description', header: 'Description', content: <p>Light and loud.</p> },
  { id: 'reviews', header: 'Reviews', ~content: <p>John: Great sound.</p>~ }, // content already holds JSX
];

export default function ProductPage() {
  return (
    <main>
      <h1>Wireless Headphones</h1>
      <Tabs tabs={tabs} />
    </main>
  );
}
```

The `Tabs` component stores the active tab identifier in state, defaulting to the first item. It renders a button for each tab and outputs the active tab content below the navigation row:

```jsx title="src/Tabs.jsx"
import { useState } from 'react';

export default function Tabs({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId); // The tab whose id matches selectedId

  return (
    <div>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => setSelectedId(tab.id)}>
          ~{tab.header}~ {/* The page wrote this header */}
        </button>
      ))}
      ~{selectedTab.content}~ {/* The page wrote this content */}
    </div>
  );
}
```

Examine the `content` property closely. It already holds a full paragraph of JSX authored by the page. The `Tabs` component never inspects the inner markup of that element. It simply provides the container where React renders that element. That separation of concerns forms the core architectural lesson.

Now the product team presents three distinct feature requests. Three structural principles address each request in turn on this headphones view:

**PRINCIPLES:** The consuming page authors the markup, and `Tabs` only controls its layout. Three principles follow:
1. **Principle 1: A prop holding JSX displays the review count badge.** Any prop, not merely `children`, can receive JSX elements. The page authors the Reviews label alongside a bold count badge, and `Tabs` places that markup inside the button without requiring a dedicated count prop.
2. **Principle 2: A render prop allows the page to style the active tab.** Only `Tabs` holds the state indicating which tab is currently selected. The page passes a callback function, and `Tabs` invokes it for each tab with an active boolean flag. The page controls visual styling, while `Tabs` controls execution timing.
3. **Principle 3: Sub-components read shared state through context.** To position the return policy text between the tab buttons and the body panel, the page needs access to the underlying building blocks. The parent `Tabs` holds active state and shares it via context, enabling sub-components to synchronize wherever they are rendered.

---

## PRINCIPLE | JSX in `header` or `children`: the page writes the markup, and `Tabs` only places it

> [!PRINCIPLE]
> **Principle 1: JSX in Props: The Page Writes the Markup, the Component Places It**
>
> *When a page knows the markup before the shared component runs, it passes that markup as JSX, in `children` or in any named prop, and the component places it.*
>
> A shared component that grows a prop for every request, such as `showCount` and `count`, holds markup that belongs to one page, and every other page carries it. Any prop can hold JSX, not only `children`, because JSX is a value. The page writes the markup, and the component only decides where it goes. This is React's equivalent of slots.
>
> **DO THIS:**
> ```jsx
> const tabs = [
>   { id: 'description', header: 'Description', content: <p>Light and loud.</p> },
>   { id: 'reviews', ~header: <>Reviews <b>12</b></>, content: <p>John: Great sound.</p> }, // The page writes the count
> ];
> <Tabs tabs={tabs} />
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <Tabs tabs={tabs} ~showCount={true} count={12}~ /> // **WRONG:** Tabs must hold markup for one page's count
> ```

### VS | `children` between the tags vs. `header` on the opening tag: both are props that hold JSX

The JSX written between opening and closing component tags arrives automatically as `children` (Lesson 09). Now consider a `Card` component that accepts markup through two distinct props: a named `header` and the default children:

```jsx title="A Card that places two pieces of JSX from the page"
function Card({ header, children }) {
  return (
    <div>
      ~{header}~ {/* The JSX from the header prop goes here */}
      ~{children}~ {/* The JSX between the Card tags goes here */}
    </div>
  );
}

<Card ~header={<b>John</b>}~> {/* header is written on the opening tag, with a name */}
  <p>Hello</p>
</Card>
```

Both `header` and `children` receive React elements. Their only operational difference is syntax placement:
- The `header` element is passed as an explicit attribute on the opening tag.
- The `children` element is placed between the opening and closing tags without an explicit prop name.

Within `Card`, both arrive as properties on the incoming props object. The component inserts each element into its rendered output without inspecting what the parent authored. The official React documentation notes that a component accepting `children` provides an open slot that its parent can populate with arbitrary markup. This pattern is ideal for visual wrappers like layout cards, dialog panels, and content grids.

> [!DEFINITION]
> **What is a slot?** [NEW] A slot is an insertion point inside a component that a parent fills with custom markup.
> 1. In standard Web Components, developers place `<slot name="...">` elements as placeholders inside a template.
> 2. React does not have a dedicated slot API because JSX elements are regular JavaScript objects.
> 3. Any named prop such as `header`, `left`, or `children` acts as a slot where the parent passes pre-built elements.
>
> Passing JSX into named props allows a single component to receive markup for multiple independent zones. The parent controls the content of each slot, while the child controls placement and styling (Lesson 89).

Here is the pattern in practice, demonstrating a `Layout` component with two distinct slots:

```jsx title="React's equivalent of two slots: two props that hold JSX"
<Layout ~left={<Sidebar />}~ ~right={<Content />}~ /> {/* Two props, both filled by the page */}
```

```tree caption="Every prop that holds JSX is one place the parent fills, whether it has a name or sits between the tags."
Where the page puts JSX for `Card`
- +On the opening tag, with a name [`header={<b>John</b>}`] | Arrives as **`props.header`** | `Card` places it **where it writes `{header}`**
- +Between the tags, with no name [`<p>Hello</p>`] | Arrives as **`props.children`** | `Card` places it **where it writes `{children}`**
- +Several named props [`left={<Sidebar />}` `right={<Content />}`] | React's equivalent of **slots** | One component, **several places to fill**
```

### Mistake: adding `showCount` and `count` to the shared `Tabs`

Returning to our headphones page, the business asks to display review counts alongside the Reviews label. A common anti-pattern is modifying `Tabs` directly to handle this badge logic:

```jsx title="src/Tabs.jsx" startLine="3"
export default function Tabs({ tabs, ~showCount~, count }) { // **WRONG:** a new prop for one page's request
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);

  return (
    <div>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => setSelectedId(tab.id)}>
          {tab.header}
          {showCount && ~tab.id === 'reviews'~ && <b> {count}</b>} {/* **WRONG:** Tabs now knows the word reviews */}
        </button>
      ))}
      {selectedTab.content}
    </div>
  );
}
```

The consuming page then passes these two specialized props:

```jsx title="src/ProductPage.jsx" startLine="12"
      <Tabs tabs={tabs} ~showCount={true} count={12}~ /> {/* Two props that describe the count */}
```

The button now displays `Reviews 12`, satisfying the visual requirement. However, the shared `Tabs` component now contains domain logic hardcoded specifically for reviews.

If the footwear department later requests a size badge on its navigation tabs, a developer might add `showBadge` and `badgeText`. Soon, the shared component accumulates dozens of specialized flags, making maintenance difficult and inflating the bundle for every consumer.

### The fix: `header` holds JSX, and `Tabs` drops `showCount` and `count`

Because `content` already receives JSX, the `header` property can receive elements as well. The consuming page composes the label and the badge itself using a fragment:

```jsx title="src/ProductPage.jsx" startLine="3"
const tabs = [
  { id: 'description', header: 'Description', content: <p>Light and loud.</p> },
  { id: 'reviews', ~header: <>Reviews <b>12</b></>, content: <p>John: Great sound.</p> }, // The page writes the count
];
```

The `Tabs` component reverts to its original, lightweight implementation without extra count props. It renders `{tab.header}` directly inside the button, remaining completely unaware that one header contains formatted bold markup.

::: row caption="With showCount, the shared Tabs holds the markup for the count; with JSX in header, the page holds it."
::: col title="showCount and count on Tabs" tag="Tabs knows the word reviews" tone=bad
```jsx title="src/ProductPage.jsx" startLine="12"
      <Tabs tabs={tabs} ~showCount={true} count={12}~ /> {/* **WRONG:** Tabs must hold the count's markup */}
```
`Tabs` contains the code for the count, and it changes for every new request.
:::
::: col title="JSX in header" tag="Tabs places what it gets" tone=good
```jsx title="src/ProductPage.jsx" startLine="5"
  { id: 'reviews', ~header: <>Reviews <b>12</b></>, content: <p>John: Great sound.</p> }, // The page holds the count's markup
```
`Tabs` places the header in the button without knowing what is inside.
:::
:::

While both approaches present identical UI to the user, their software boundaries are completely different:
- **With `showCount`**, the shared file owns the formatting, forcing every consumer of `Tabs` to import and carry review logic.
- **With JSX in `header`**, the headphones page owns the formatting, keeping `Tabs` clean and universally reusable across the entire catalog.

Inspecting the DOM confirms that the bold tag authored by the page nests cleanly inside the button created by `Tabs`:

```dom caption="The Elements panel after the fix: the b tag written by the page sits inside the button that Tabs made."
<main>
  <h1>Wireless Headphones</h1>
  <div>
    <button>Description</button>
+   <button>Reviews <b>12</b></button> | note: The page wrote the bold 12
    <p>Light and loud.</p>
  </div>
</main>
```

### Why an array of tabs, and not `children`?

Passing an array of objects to `tabs` represents structured configuration containing React elements. This pattern works well when a component needs coordinated metadata alongside markup, such as an `id` string for state tracking paired with a `header` element for display.

Because the tab list is a standard JavaScript array, the component can reliably invoke methods like `map` and `find` over its items. Attempting similar inspections on `children` is strongly discouraged. React treats `children` as an opaque data structure whose internal shape should not be directly inspected or manipulated.

The core principle remains consistent: the consuming page authors the markup, and `Tabs` determines its placement in the layout.

---

## PRINCIPLE | `renderTab`: `Tabs` calls the page's function and tells it which tab is open

> [!PRINCIPLE]
> **Principle 2: Render Props: The Component Calls the Page's Function During Its Render**
>
> *When the markup needs information that only the shared component has, such as which tab is open, the page passes a function that returns JSX; the component calls it during its render and passes that information as arguments.*
>
> JSX written by the page is made before the shared component runs, so it cannot know which tab is open. A render prop is a regular prop that happens to be a function. `Tabs` calls it for each tab with `true` or `false`, and the page's function returns the look for that tab. The page decides the look, and `Tabs` decides when to ask.
>
> **DO THIS:**
> ```jsx
> <button key={tab.id} onClick={() => setSelectedId(tab.id)}>
>   {~renderTab(tab, tab.id === selectedId)~} {/* Tabs asks the page how this tab should look */}
> </button>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> { id: 'description', ~header: <b>Description</b>~ }, // **WRONG:** made before Tabs runs, so it stays bold when Reviews is open
> ```

### The request: the open tab should be bold

The product team requests that the currently active tab label appear in bold text. Because the page already defines `header`, a developer might attempt to hardcode bold styling directly into the descriptor object:

```jsx title="src/ProductPage.jsx" startLine="3"
const tabs = [
  { id: 'description', ~header: <b>Description</b>~, content: <p>Light and loud.</p> }, // **WRONG:** stays bold when Reviews is open
  { id: 'reviews', header: <>Reviews <b>12</b></>, content: <p>John: Great sound.</p> },
];
```

This implementation fails immediately. The Description label remains bold even after the user clicks Reviews. The reason is timing. The page creates these JSX objects statically before `Tabs` executes. Because active tab state lives inside `Tabs`, the page cannot know at initialization time which tab will be selected on subsequent renders.

Falling back to adding a `boldSelected` boolean prop to `Tabs` reintroduces the original problem. If another team wants an active tab underlined or highlighted with an accent color, `Tabs` would need yet another configuration prop.

What the page truly requires is dynamic collaboration. During rendering, `Tabs` must notify the page whether a tab is active, and the page returns the corresponding markup. In JavaScript, this exchange is performed with a function.

### VS | A function prop called in a click vs. a function prop called during render: both are regular props

Passing functions as props is standard practice in React. In the shopping cart from Lesson 23, the parent component passed `onRemove`, and the row called it when the user clicked a button. A **render prop** is also an ordinary function passed as a prop. Here is the pattern in its simplest form:

```jsx title="A List that asks the page how each row should look"
function List({ items, renderItem }) {
  return items.map((item, index) => ~renderItem(item, index === 0)~); // List calls the page's function for each row
}

<List
  items={['John', 'Mia']}
  ~renderItem~={(name, isFirst) => ( // The page decides how a row looks
    <p key={name}>{isFirst ? <b>{name}</b> : name}</p>
  )}
/>
```

The rendered page shows two rows: John rendered in bold, followed by Mia in normal text. This architecture mirrors the behavior of `array.map`:
- The `List` component coordinates iteration and knows which row occupies index zero, passing that status into `renderItem`.
- The consuming page defines the visual presentation, returning custom JSX for each item based on that boolean flag.

Both `renderItem` and `onRemove` are functions supplied by a parent and invoked by a child. Their fundamental distinction lies in execution timing and return values:
- An event handler like `onRemove` runs asynchronously after a user interaction. It communicates that an action occurred and returns no UI markup.
- A render prop like `renderItem` executes synchronously while the child renders. It returns JSX elements that the child mounts directly onto the page.

> [!DEFINITION]
> **What is a render prop?** [NEW] A render prop is a component prop that accepts a function returning React elements.
> 1. The parent defines a function that describes how to render UI based on incoming parameters: `(tab, isSelected) => ...`.
> 2. The child component executes this function during rendering, passing its internal state as arguments.
> 3. The child places the returned JSX elements directly into its rendered tree.
>
> A render prop is not a special React framework feature or syntax. It is an ordinary JavaScript function prop that allows a child component to share its private runtime state with a parent without giving up ownership of that state (Lesson 89).

```tree caption="A render prop is a regular function prop; the difference from onRemove is when the child calls it and what it gives back."
Two function props from the parent
- +`onRemove` from Lesson 23 [`onRemove`] | The child calls it **in a click handler** | Tells the parent **something happened**; gives back **nothing to show**
- +A render prop [`renderItem`] | The child calls it **while it renders** | Gives back **JSX** that the child places on the page
```

### VS | `header` holding JSX vs. `renderTab` returning JSX: only the function can know which tab is open

Consider how both strategies deliver markup to the `Tabs` component:

```jsx title="Handing Tabs finished JSX, and handing Tabs a function it calls"
{ id: 'description', ~header: <b>Description</b>~ }, // Made once by the page: bold on every render
<Tabs tabs={tabs} ~renderTab~={(tab, isSelected) => (isSelected ? <b>{tab.header}</b> : tab.header)} /> // Called by Tabs: bold only while open
```

While both patterns provide markup authored by the page, their execution lifecycles diverge significantly:
- Static JSX in `header` is instantiated once during page evaluation. Its markup cannot adapt dynamically when internal tab state changes.
- The `renderTab` prop provides a callback. The `Tabs` component invokes it on every render pass, supplying the current selection status as an argument.

The consuming page retains complete control over visual design, while `Tabs` controls execution timing and state delivery.

### `Tabs` calls `renderTab` for each tab

The `Tabs` component accepts `renderTab` as a prop and calls it inside each button element:

```jsx title="src/Tabs.jsx" startLine="3"
export default function Tabs({ tabs, ~renderTab~ }) { // A function from the page that returns JSX
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);

  return (
    <div>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => setSelectedId(tab.id)}>
          {~renderTab(tab, tab.id === selectedId)~} {/* Tabs asks the page how this tab should look */}
        </button>
      ))}
      {selectedTab.content}
    </div>
  );
}
```

The page preserves the original tab descriptors and supplies the custom styling callback:

```jsx title="src/ProductPage.jsx" startLine="8"
export default function ProductPage() {
  return (
    <main>
      <h1>Wireless Headphones</h1>
      <Tabs
        tabs={tabs}
        ~renderTab~={(tab, isSelected) => (isSelected ? <b>{tab.header}</b> : tab.header)} // The open tab is bold
      />
    </main>
  );
}
```

The parameters `tab` and `isSelected` receive their concrete runtime values during the render cycle:
1. The consuming page declares an arrow function accepting `tab` and `isSelected`.
2. Inside `Tabs`, the map method iterates through the tabs array. For each item, it invokes `renderTab` with the tab object and a boolean indicating whether the item is active.
3. The function evaluates the boolean condition, returning either a bold element or plain text.
4. The `Tabs` component embeds the returned element directly into the button output.

Notice that the key attribute remains on the `<button>` rendered by `Tabs`. Because `Tabs` executes the mapping loop, React requires the reconciliation key on the top-level element produced within the iterator.

When the application mounts, the Description label renders bold. When the user selects Reviews, the bold styling transfers seamlessly to the Reviews label:

::: row caption="The buttons in the Elements panel before and after the user clicks Reviews: the b tag moves to the open tab."
::: col title="When the page opens" tag="Description is open" tone=good
```dom
<div>
+ <button><b>Description</b></button>
  <button>Reviews <b>12</b></button>
  <p>Light and loud.</p>
</div>
```
:::
::: col title="After the user clicks Reviews" tag="Reviews is open" tone=good
```dom
<div>
  <button>Description</button>
+ <button><b>Reviews <b>12</b></b></button>
  <p>John: Great sound.</p>
</div>
```
:::
:::

The `Tabs` component remains completely free of presentation-specific logic. Another page can provide a different callback that underlines active tabs or displays an indicator dot, all without modifying the shared component.

### Mistake: writing `{renderTab}` without calling it

Because a render prop is a JavaScript function, it produces output only when explicitly invoked. If a developer accidentally places the function identifier directly into JSX:

```jsx title="src/Tabs.jsx" startLine="10"
        <button key={tab.id} onClick={() => setSelectedId(tab.id)}>
          ~{renderTab}~ {/* **WRONG:** places the function itself, not the JSX it returns */}
        </button>
```

The button elements render empty, and React logs a runtime error to the console. React can render strings, numbers, or elements, but it cannot render a raw function object:

```devconsole width=full
x Functions are not valid as a React child. This may happen if you return renderTab instead of <renderTab /> from render. Or maybe you meant to call this function rather than return it.
  <button>{renderTab}</button>
```

The error message highlights the necessary correction. The developer must invoke the function, passing the tab and selection condition: `renderTab(tab, tab.id === selectedId)`.

---

## PRINCIPLE | `Tab` and `TabPanel` with `useContext`: every part reads the open tab, wherever the page puts it

> [!PRINCIPLE]
> **Principle 3: Several Components Exported Together: The Parent Provides, Every Part Reads**
>
> *When the page must also decide the order and place of the parts, export them together; the parent part keeps the state and provides it through context, and every part reads it with `useContext`, wherever the page puts it.*
>
> With an array of tabs, the shared component writes the order of the markup, so any new element in between needs one more prop. With the parts, the page writes the order. `Tabs` never looks at its children: each `Tab` and `TabPanel` finds the closest `Tabs` above it, even inside the page's own components. A part placed outside `Tabs` gets the default value `null` and blanks the page, so a `useTabs` Hook should throw an error that names the fix.
>
> **DO THIS:**
> ```jsx
> <Tabs defaultId="description">
>   <Tab id="description">Description</Tab>
>   ~<p>Free returns for 30 days.</p>~ {/* The page decides where each part goes */}
>   <TabPanel id="description"><p>Light and loud.</p></TabPanel>
> </Tabs>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <Tabs defaultId="description"><Tab id="description">Description</Tab></Tabs>
> ~<Tab id="shipping">Shipping</Tab>~ {/* **WRONG:** no Tabs above it, so useContext returns null */}
> ```

### The request: a line between the tabs and the text

The product team introduces a third requirement: an informational message reading "Free returns for 30 days." must appear between the tab buttons and the active tab body.

Using the array approach from Principles 1 and 2, `Tabs` dictates the rigid structural hierarchy of the DOM: buttons first, followed immediately by panel content. The consuming page cannot inject intermediate elements into that layout. Satisfying this request with the existing design would require adding yet another prop, such as `middleContent`.

This scenario demands structural flexibility. The consuming page needs to control where each individual element appears. This flexibility mirrors native HTML select and option elements, where you author option elements in whatever structure you choose while the select wrapper manages selection. We achieve this in React by decomposing the feature into three cooperating components: the container `Tabs`, along with individual `Tab` buttons and panel elements.

```jsx title="The page places every part of the tabs itself"
<Tabs defaultId="description">
  <Tab id="description">Description</Tab>
  <Tab id="reviews">Reviews <b>12</b></Tab>
  ~<p>Free returns for 30 days.</p>~ {/* The page puts the line exactly where it wants */}
  <TabPanel id="description"><p>Light and loud.</p></TabPanel>
  <TabPanel id="reviews"><p>John: Great sound.</p></TabPanel>
</Tabs>
```

Here, `defaultId` specifies which tab is selected upon initial mount. The component needs this explicit property because it no longer receives an array from which it can automatically pick the first item.

Notice an important structural detail: the page never passes `selectedId` to individual `Tab` elements. The sub-components coordinate their active state implicitly through React context (Lesson 28):
1. The parent `Tabs` accepts nested children and manages `selectedId` in component state.
2. The `Tabs` component wraps its children within a context provider.
3. Both child components consume that state directly using `useContext`.

> [!DEFINITION]
> **What are compound components?** [NEW] Compound components are a set of related components designed to work together, sharing implicit state through React context.
> 1. An outer container component holds state and wraps its children in a context provider: `<Tabs defaultId="description">`.
> 2. Child sub-components consume that context directly using `useContext`: `<Tab id="reviews">` and `<TabPanel id="reviews">`.
> 3. The consuming page arranges the sub-components in whatever order and layout structure it needs.
>
> Compound components let a parent manage logic and synchronization while granting the consumer full control over markup structure and element placement. The official React documentation describes this pattern as exposing multiple coordinated components (Lesson 89).

### VS | An array of tabs vs. the parts exported together: only the parts let the page write the order

The rendered interface matches Principle 2 while accommodating the new return policy banner, but the underlying component architecture is fundamentally different:
- **With the array pattern**, `Tabs` hardcodes the rendering order of all internal DOM nodes.
- **With compound components**, the consuming page controls the layout. The parent `Tabs` component produces no visible markup of its own, serving purely as a state provider.

```tree caption="With the array, Tabs writes the order of the markup; with the parts, the page writes it and Tabs only provides the open tab."
Who writes the order of the tabs
- !An array of tabs [`tabs` `renderTab`] | `Tabs` writes **buttons first, then content** | A line between them **needs one more prop**
- +Parts exported together [`Tabs` `Tab` `TabPanel`] | The page writes **every part in its own order** | `Tabs` only **provides the open tab** through context
```

### The full `Tabs.jsx` with three exports

Here is the complete implementation of the modular tab system. The rigid array configuration, render props, and array lookup methods are gone:

```jsx title="src/Tabs.jsx"
import { createContext, useContext, useState } from 'react';

const TabsContext = createContext(null);

export function Tabs({ defaultId, children }) {
  const [selectedId, setSelectedId] = useState(defaultId);
  return (
    <TabsContext ~value={{ selectedId, setSelectedId }}~> {/* Provides the open tab to every part inside */}
      {children}
    </TabsContext>
  );
}

export function Tab({ id, children }) {
  const { selectedId, setSelectedId } = ~useContext(TabsContext)~; // Reads both from the closest Tabs above
  return (
    <button onClick={() => setSelectedId(id)}>
      {id === selectedId ? <b>{children}</b> : children}
    </button>
  );
}

export function TabPanel({ id, children }) {
  const { selectedId } = ~useContext(TabsContext)~; // Reads the same selectedId
  return id === selectedId ? children : null;
}
```

The active identifier and state updater reach each child component without prop drilling:
1. The `Tabs` component initializes state using `defaultId`, storing the active tab identifier.
2. It packages these values into a single context object passed to `TabsContext.Provider`.
3. Each nested `Tab` invokes `useContext` to retrieve this shared state object from the nearest ancestor provider.
4. The `Tab` component reads the active identifier and updater directly from the context value.

Inside `Tab`, the `children` prop represents whatever markup the consumer authored between the tags, such as a formatted label.

In this implementation, active tab bolding is encapsulated inside the shared `Tab` component. If a specific page requires custom active styling, `Tab` can also accept a render prop. Flexible design patterns can be composed together.

The `TabsContext` object is kept private to the module, ensuring external code interacts solely through the exported components.

The product page imports all three components by name (Lesson 05) and composes them into the desired layout:

```jsx title="src/ProductPage.jsx"
import { ~Tabs, Tab, TabPanel~ } from './Tabs.jsx'; // Three named exports from one file

export default function ProductPage() {
  return (
    <main>
      <h1>Wireless Headphones</h1>
      <Tabs defaultId="description">
        <Tab id="description">Description</Tab>
        <Tab id="reviews">Reviews <b>12</b></Tab>
        ~<p>Free returns for 30 days.</p>~ {/* The page puts the line between the tabs and the text */}
        <TabPanel id="description"><p>Light and loud.</p></TabPanel>
        <TabPanel id="reviews"><p>John: Great sound.</p></TabPanel>
      </Tabs>
    </main>
  );
}
```

```page width=text caption="The headphones page with the parts: the returns line now sits between the tabs and the text."
heading: Wireless Headphones
line: [Description] [Reviews 12]
line: Free returns for 30 days. | good
line: Light and loud.
```

The parent `Tabs` component and its context provider render no container DOM nodes. The browser Elements inspector displays only the elements produced by the sub-components and the consumer:

```dom caption="The Elements panel: Tabs and its provider add no element; the closed TabPanel returns null and adds nothing."
<main>
  <h1>Wireless Headphones</h1>
+ <button><b>Description</b></button> | note: The open tab
  <button>Reviews <b>12</b></button>
+ <p>Free returns for 30 days.</p> | note: Placed by the page
  <p>Light and loud.</p>
</main>
```

### Surprise: a `Tab` inside the page's own component still works

Suppose the engineering team extracts the navigation buttons into an intermediate component named `ProductTabs`:

```jsx title="src/ProductPage.jsx"
import { Tabs, Tab, TabPanel } from './Tabs.jsx';

function ~ProductTabs~() { // The page's own component around the two Tab tags
  return (
    <>
      <Tab id="description">Description</Tab>
      <Tab id="reviews">Reviews <b>12</b></Tab>
    </>
  );
}

export default function ProductPage() {
  return (
    <main>
      <h1>Wireless Headphones</h1>
      <Tabs defaultId="description">
        ~<ProductTabs />~ {/* Tabs sees one child here, not two Tab tags */}
        <p>Free returns for 30 days.</p>
        <TabPanel id="description"><p>Light and loud.</p></TabPanel>
        <TabPanel id="reviews"><p>John: Great sound.</p></TabPanel>
      </Tabs>
    </main>
  );
}
```

Both tab buttons continue to function without issue. This capability often surprises engineers who assume `Tabs` must directly traverse its immediate children to pass props. In reality, `Tabs` never inspects its children tree:
1. The `Tabs` component renders `<ProductTabs />` as an opaque child element without inspecting its contents.
2. React renders `ProductTabs`, which outputs the two `Tab` elements.
3. Each `Tab` calls `useContext`, which walks up the component hierarchy until discovering the nearest provider above it.
4. Both buttons receive `selectedId` and `setSelectedId`, operating with full synchronization.

The official React documentation demonstrates this exact scenario and notes that context-based coordination functions reliably across arbitrary levels of component extraction. In contrast, legacy patterns relying on `Children.map` and `cloneElement` break under refactoring because shallow cloning cannot see through intermediate wrapper components.

The architectural contrast is evident:
- **Element cloning** inspects immediate children and injects props implicitly, obscuring data flow and breaking when components are extracted.
- **Context consumption** lets child components request shared state explicitly regardless of nesting depth.

### Surprise: a `Tab` outside `Tabs` blanks the whole page

Consider what occurs if a developer mistakenly places a tab outside the `<Tabs>` wrapper:

```jsx title="src/ProductPage.jsx" startLine="7"
      <Tabs defaultId="description">
        <Tab id="description">Description</Tab>
        <Tab id="reviews">Reviews <b>12</b></Tab>
        <p>Free returns for 30 days.</p>
        <TabPanel id="description"><p>Light and loud.</p></TabPanel>
        <TabPanel id="reviews"><p>John: Great sound.</p></TabPanel>
      </Tabs>
      ~<Tab id="shipping">Shipping</Tab>~ {/* **WRONG:** outside Tabs, so there is no provider above it */}
```

The entire application crashes to a blank screen. The heading, navigation buttons, and tab panels all disappear from the page. The breakdown occurs in distinct stages:
1. The isolated `Shipping` tab calls `useContext(TabsContext)`, finding no matching provider above it.
2. React returns the context default value, which was initialized to `null`.
3. The component attempts to destructure properties from `null`, causing the JavaScript engine to throw a runtime `TypeError`.
4. When an unhandled error occurs during rendering, React unmounts the entire component tree unless an Error Boundary catches it (Lesson 72).

```page width=full caption="The page after a Tab is placed outside Tabs: React removes the whole page."
empty: nothing on the page
console: Uncaught TypeError: Cannot destructure property 'selectedId' of 'useContext(...)' as it is null.
  warn: An error occurred in the <Tab> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

The browser console reports a generic error about reading properties of `null`. It provides no explanation that a missing `<Tabs>` parent caused the crash, forcing developers to dig through call stacks to diagnose the issue.

### The fix: a `useTabs` Hook that throws a clear error

The recommended solution for context initialized to `null` is encapsulating context access inside a custom Hook (Lesson 39). We define `useTabs`, which validates that the context value exists before returning it:

```jsx title="src/Tabs.jsx" startLine="14"
function useTabs() {
  const value = useContext(TabsContext);
  if (~value === null~) { // No Tabs above this part
    throw new Error('Tab and TabPanel must be used inside Tabs');
  }
  return value;
}

export function Tab({ id, children }) {
  const { selectedId, setSelectedId } = ~useTabs()~; // Reads the context, or throws a clear message
  return (
    <button onClick={() => setSelectedId(id)}>
      {id === selectedId ? <b>{children}</b> : children}
    </button>
  );
}

export function TabPanel({ id, children }) {
  const { selectedId } = ~useTabs()~; // The same check for every panel
  return id === selectedId ? children : null;
}
```

If an isolated `Tab` is rendered outside `<Tabs>`, the application still unmounts because an error is thrown during rendering. However, the console now provides an unambiguous, actionable explanation:

```page width=full caption="The same mistake with useTabs: the page is still blank, but the Console says what is missing."
empty: nothing on the page
console: Uncaught Error: Tab and TabPanel must be used inside Tabs
  warn: An error occurred in the <Tab> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

The developer reads the precise diagnostic message, moves the misplaced tab inside `<Tabs>`, and the interface immediately restores.

---

## All 3 Principles Together

### The complete code

Here is the finished headphones page architecture. The consuming page authors all visual markup and controls element positioning. The shared module provides state coordination, context validation, and cooperating sub-components:

```jsx title="src/Tabs.jsx"
import { createContext, useContext, useState } from 'react';

const TabsContext = createContext(null);

export function ~Tabs~({ defaultId, children }) { // 2. Keeps the open tab and provides it
  const [selectedId, setSelectedId] = useState(defaultId);
  return (
    <TabsContext value={{ selectedId, setSelectedId }}>
      {children}
    </TabsContext>
  );
}

function useTabs() {
  const value = useContext(TabsContext);
  if (value === null) {
    throw new Error('Tab and TabPanel must be used inside Tabs');
  }
  return value;
}

export function ~Tab~({ id, children }) { // 3. Called once for each Tab tag
  const { selectedId, setSelectedId } = useTabs();
  return (
    <button onClick={() => setSelectedId(id)}>
      {id === selectedId ? <b>{children}</b> : children}
    </button>
  );
}

export function ~TabPanel~({ id, children }) { // 4. Called once for each TabPanel tag
  const { selectedId } = useTabs();
  return id === selectedId ? children : null;
}
```

```jsx title="src/ProductPage.jsx"
import { Tabs, Tab, TabPanel } from './Tabs.jsx';

export default function ~ProductPage~() { // 1. Called first when the page loads
  return (
    <main>
      <h1>Wireless Headphones</h1>
      <Tabs defaultId="description">
        <Tab id="description">Description</Tab>
        <Tab id="reviews">Reviews <b>12</b></Tab>
        <p>Free returns for 30 days.</p>
        <TabPanel id="description"><p>Light and loud.</p></TabPanel>
        <TabPanel id="reviews"><p>John: Great sound.</p></TabPanel>
      </Tabs>
    </main>
  );
}
```

In production applications, tabs also include accessibility roles like tablist, tab, and tabpanel alongside `aria-selected` to support assistive technology (Lesson 89). They are omitted here to keep the architectural mechanics clear.

### The order in which React calls the components

When the application mounts, React invokes `ProductPage` first. React then executes `Tabs`, which initializes internal state and returns the context provider wrapping its children. Next, React evaluates each child component in document sequence:

```tree caption="The order in which React calls the components of the headphones page, and what each one returns."
1. `ProductPage` is called first | Returns the heading and **`<Tabs>`** with its parts
- +2. `Tabs` | Keeps **`selectedId`** in state | Returns the **provider** around its children and adds **no element**
  - +3. `Tab` for Description | The open tab | Returns a **bold** button
  - +4. `Tab` for Reviews | A closed tab | Returns a **plain** button
  - +5. `TabPanel` for Description | The open tab | Returns **`<p>Light and loud.</p>`**
  - !6. `TabPanel` for Reviews | A closed tab | Returns **`null`**, so nothing appears
```

When a user clicks Reviews, that `Tab` invokes `setSelectedId('reviews')`. React re-renders `Tabs` with the updated state value. Every sub-component consuming `useTabs` reads the new selection, causing bold styling and visible panel content to transition to Reviews.

| The store's request | The tool | Who writes the markup | Who decides when or where |
| :--- | :--- | :--- | :--- |
| **Show the count `12` on the Reviews tab** | JSX in a prop: `header` holds `<>Reviews <b>12</b></>` | The page | `Tabs` places it in the button |
| **Make the open tab bold** | A render prop: `renderTab` returns the look for each tab | The page | `Tabs` calls it with `isSelected` on each render |
| **Put the returns line between the tabs and the text** | Several components exported together: `Tabs`, `Tab`, `TabPanel` | The page | The page writes the order; the parts read the open tab from context |

Remember the central thesis of this lesson: the consuming page authors the markup, and the shared component only coordinates placement. This holds whether passing JSX in props, dynamic callbacks, or cooperating compound components.

---

## For the Interview

> **The Interview Question:** How do Render Props, Compound Components, and Slot patterns structure flexible UI?

### How to Answer Clearly in 30 Seconds

"All three patterns eliminate bloated components configured with endless boolean props. They let the consuming page author markup while the shared component coordinates logic.
1. **Slots**: in React, slots are simply props that accept JSX elements, such as `children` or named props like `header` and `footer`. Use slots when the consumer knows the full markup before the component renders.
2. **Render props**: a render prop is an ordinary prop that receives a function returning JSX. The component invokes this function during rendering to pass internal runtime state, such as selection flags, down to the consumer.
3. **Compound components**: a set of related components, such as `Tabs`, `Tab`, and `TabPanel`, that share implicit state through React context. Use this pattern when the consuming page must control the order and layout structure of individual sub-elements."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Does React have slots, like web components?"**
   Not as a separate language feature. In standard Web Components, a slot is a template placeholder that developers populate with external markup. React achieves the exact same capability because JSX elements are first-class JavaScript values. You can pass elements through any prop name, such as `<Layout left={<Sidebar />} right={<Content />} />`. The `children` prop is simply the automatic prop populated by elements placed between component tags. Passing JSX via props is also the primary strategy recommended by React documentation to prevent prop drilling before reaching for context.
2. **"Why use a render prop or context instead of `Children.map` and `cloneElement`?"**
   The official React documentation discourages `Children.map` and `cloneElement` as fragile and uncommon. Element cloning injects hidden props into elements, making data flow difficult to trace during debugging. Render props make data flow explicit because parameters appear directly in the function signature. Furthermore, context penetrates arbitrary component wrappers cleanly, whereas `Children.map` only inspects shallow top-level children and breaks when consumers extract helper components.
3. **"What happens if someone uses a compound component part outside its parent?"**
   The sub-component calls `useContext`, finds no matching ancestor provider, and receives the context fallback value, typically `null`. Attempting to destructure properties from `null` throws a runtime `TypeError` during rendering. Unless caught by an Error Boundary, React removes the entire component tree from the screen. To prevent cryptic errors, encapsulate context access in a custom Hook like `useTabs`. The Hook validates the context value and throws a descriptive exception when sub-components are used outside their parent container.

```tree caption="The three tools side by side: what the page passes and when each one fits."
Three ways the page decides what a shared component shows
- +Slots: JSX in a prop [`children` `header` `left` `right`] | The page passes **finished markup** | Fits when the page **knows the markup up front**
- +Render prop [`renderTab`] | The page passes **a function that returns markup** | Fits when the markup **needs what only the component knows**
- +Compound components [`Tabs` `Tab` `TabPanel`] | The page gets **the parts** and places them | Fits when the page **decides the order**; the parts share state through **context**
```
