# Lecture 51: How a Delete Dialog Escapes Its Row with createPortal

*(How does a dialog that opens from one small inbox row show over the whole page?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do you render a modal that escapes its parent's overflow and stacking context?

---

## VS | Dialog inside the row vs. `createPortal`: the row's CSS cuts the dialog off, or the dialog lands in `<body>`

> In standard JavaScript, you choose the DOM insertion point for a new element, typically appending a dialog directly to `<body>` outside the layout. **In React, every element mounts inside the DOM container of its parent JSX, but `createPortal` lets a component direct its DOM output to `document.body` instead**. A dialog requires this separation because parent row CSS rules reach every nested DOM child, clipping overflowing boxes or trapping elements beneath subsequent rows.

In standard JavaScript, you create DOM elements manually and choose their insertion point in the document. You typically mount a modal dialog at the very end of `document.body`, outside every other layout container on the page:

```js title="Plain JavaScript: you choose where the dialog lands"
const dialog = document.createElement('div');
dialog.textContent = 'Delete this email?';
document.body.~appendChild~(dialog); // The dialog lands at the end of <body>, outside every row
```

In React, you declare JSX instead of appending DOM nodes by hand. React converts that JSX into real DOM elements and mounts each child directly inside its parent DOM container. When an email row component renders a dialog, React places the dialog inside the row container in the DOM. For standard layout elements, this nesting is desirable. For a modal dialog, this nesting introduces visual defects.

React provides `createPortal` to solve this placement problem. It instructs React to preserve component logic while mounting the resulting DOM elements directly into `document.body` instead of the row container:

```jsx title="React: createPortal chooses where the dialog's div lands"
{showDialog && ~createPortal~(<ConfirmDialog />, document.body)} {/* The dialog's div lands at the end of <body>, outside every row */}
```

### Why the dialog cannot stay inside the row

Consider a standard email inbox. Each email message occupies a single row. When an email subject exceeds the row width, the row truncates the text with an ellipsis:

```page width=text caption="An inbox with two emails. The long subject of the first email ends with three dots."
heading: Inbox
line: Get your next month f… [Delete]
line: Lunch at noon? [Delete]
console: quiet
```

Every row provides a Delete button. When the user clicks Delete, a confirmation dialog should appear over the entire page. It asks a confirmation question and displays two action buttons:

```page width=text caption="What the user expects after clicking Delete on the first email: a dialog over the page asks Delete this email?"
heading: Inbox
form: title=Delete this email?
  button: Cancel
  button: Delete
line: Get your next month f… [Delete]
line: Lunch at noon? [Delete]
console: quiet
```

The React documentation defines this interface as a **modal dialog**: an overlay that floats above the page and pauses user interaction until answered.

From a component architecture standpoint, the row component is the natural place to manage the dialog. The row holds the Delete button, manages the open state, and identifies which email to delete.

However, this creates an architectural conflict with CSS. The row displays three dots only because it hides any content that overflows its fixed boundary. The browser applies that clipping rule to every descendant element inside the row container. Without a portal, the dialog lives inside that clipped row. The row cuts off the dialog, leaving the action buttons hidden and unreachable.

### Two trees: the DOM tree and the React tree

Every element in your application belongs to two distinct trees simultaneously:
1. **The DOM tree** represents the physical hierarchy of HTML elements rendered in the browser. The browser applies layout, clipping, and CSS stacking contexts strictly along this tree.
2. **The React tree** represents the component hierarchy constructed from your JSX declarations (Lesson 06). React routes props, state updates, context data, and synthetic event bubbling strictly along this tree.

Without a portal, the two trees share the exact same shape. With `createPortal`, their structures diverge. In the DOM tree, the dialog mounts directly inside `document.body`. In the React tree, the dialog remains a nested child of the row component that rendered it.

```tree caption="With createPortal, the dialog leaves the row in the DOM tree but stays inside EmailRow in the React tree."
Where the dialog sits once `EmailRow` uses `createPortal`
- +In the DOM tree [`<body>`] | The dialog's `<div>` sits **directly inside `<body>`** | The row's CSS **can no longer cut it off**
- +In the React tree [`EmailRow`] | `ConfirmDialog` is **still a child of `EmailRow`** | It still reads the row's props and state, and **its clicks still reach the row**
```

At first glance, moving an element into a portal might look like moving the component entirely. That assumption is incorrect. Only the physical mounting location in the DOM changes. The component position in the React hierarchy remains untouched. The React documentation emphasizes this distinction: a portal only changes the physical placement of the DOM node. In every other way, the JSX rendered into a portal acts as a child node of the component that renders it.

**Why this distinction matters:** Each tree governs a different runtime behavior in our inbox:
1. **Without a portal**, the DOM tree governs styling. The row clips the dialog, preventing the user from reaching the action buttons.
2. **With a portal**, the React tree governs events. A click on Cancel bubbles up to the row handler, opening the email behind the dialog.

Keep the fundamental law of portals in mind: **CSS follows the physical DOM tree. React follows the component React tree. A portal alters only the DOM tree.**

### The Rule of Thumb: fix the dialog's place in the DOM, not its CSS

**When a dialog is clipped or covered, examine its DOM container rather than adjusting its CSS.** Render the modal through `createPortal` into `document.body`, and account for event bubbling up the React component tree.

Developers evaluate three approaches when displaying an overlay from a clipped container:
1. **Modify dialog CSS properties**, such as assigning a large `z-index` or switching to `position: fixed`. This fails whenever an ancestor element clips content or defines a stacking context.
2. **Render the dialog through `createPortal` into `document.body`.** React documentation recommends this solution for modal dialogs and tooltips that must float above the entire application.
3. **Use the native browser `<dialog>` element** and open it with the `showModal` method. The browser places the dialog in a dedicated top layer above the document.

Experienced engineers also watch for three classic mistakes:
1. **Increasing the `z-index` to `9999`** and expecting the element to break out of a clipped parent container. The parent boundary still clips it.
2. **Assuming a portal detaches the component**, causing the child to lose access to parent props and state. The component keeps full access.
3. **Assuming events inside the portal cannot reach the parent**, because browser developer tools show the element outside the parent container. Synthetic events still propagate upward.

The rest of this lesson demonstrates each scenario in a running application.

## SECTION | An Inbox with Two Emails

Our demonstration inbox contains minimal code: two email messages, a Delete button on each row, and a confirmation dialog. Clicking a row expands the message body under the subject line. That row click handler becomes central in Principle 4.

The `App` component stores the list of messages in state and renders an `EmailRow` for each item. When the user confirms deletion, `App` filters out that message from state (Lesson 19):

```jsx title="src/App.jsx"
import { useState } from 'react';
import EmailRow from './EmailRow.jsx';
import './styles.css';

export default function App() {
  const [emails, setEmails] = useState([
    { id: 1, subject: 'Get your next month for $0.99', body: 'Your offer ends Friday.' },
    { id: 2, subject: 'Lunch at noon?', body: 'See you at the cafe.' },
  ]);

  function handleDelete(id) {
    setEmails(emails.filter(email => email.id !== id));
  }

  return (
    <main>
      <h1>Inbox</h1>
      {emails.map(email => (
        <EmailRow
          key={email.id}
          subject={email.subject}
          body={email.body}
          ~onDelete~={() => handleDelete(email.id)} // The row calls this when the user confirms
        />
      ))}
    </main>
  );
}
```

The App file remains unchanged throughout this lesson. The remaining project files evolve systematically across each principle:

```files title="inbox: File Explorer" caption="How the inbox project files sit inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it into `#root`
  App.jsx | parent | Keeps `emails` in state and renders one `EmailRow` per email
  EmailRow.jsx | the row | The subject, the Delete button, the dialog, and from Principle 3 `createPortal`
  ConfirmDialog.jsx | the dialog | The question and two buttons, and from Principle 4 `stopPropagation` on its outer div
  styles.css | the styles | `.row`, which cuts long subjects, and `.dialog`
```

**PRINCIPLES:** A dialog declared inside a row mounts inside that row in the DOM, exposing it to row CSS rules. Four principles follow:
1. **Principle 1: `overflow: hidden` on the row cuts the dialog off.** The browser discards every portion of the dialog that extends outside the row container.
2. **Principle 2: `z-index: 9999` on the dialog does not free it.** The value operates solely within the row stacking context, and switching to `position: fixed` allows subsequent rows to cover it.
3. **Principle 3: `createPortal` mounts the dialog in `document.body`.** The JSX declaration stays in `EmailRow`, while the row CSS rules no longer reach the dialog DOM elements.
4. **Principle 4: A click inside the portal still reaches the row.** React synthetic events travel up the React tree, requiring `e.stopPropagation()` to isolate the dialog.

---

## PRINCIPLE | `overflow: hidden` on the row: the browser hides every part of the dialog that falls outside the row

> [!PRINCIPLE]
> **Principle 1: overflow: hidden: The Row Cuts Off the Delete Dialog**
>
> *When an element has `overflow: hidden`, the browser hides every part of its children that falls outside the element, a dialog written inside it included.*
>
> The browser cuts along the DOM tree. A dialog written next to the button that opens it lands inside that button's parent elements in the DOM. If the element it is placed against has `overflow: hidden`, as an inbox row needs for its three dots, the user sees only the part of the dialog that fits inside the row and cannot reach its buttons.
>
> **DO THIS:**
> ```jsx
> <div className="row">
>   {subject}
>   <button>Delete</button>
> </div>
> ~<ConfirmDialog />~ {/* Outside the row in the DOM: the row cannot cut it off */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <div className="row">
>   {subject}
>   <button>Delete</button>
>   ~<ConfirmDialog />~ {/* **WRONG:** inside the row's div, so the row's overflow: hidden cuts it off */}
> </div>
> ```

Here is the minimal reproduction. Two identical containers measure forty pixels in height, each containing two text elements that require more space than the container provides:

```jsx title="The same 40-pixel div without and with overflow: hidden"
<div style={{ height: 40 }}>
  <p>John</p>
  <p>Smith</p> {/* Without overflow: hidden, Smith shows below the div */}
</div>

<div style={{ height: 40, ~overflow: 'hidden'~ }}> {/* The browser hides everything below 40 pixels */}
  <p>John</p>
  <p>Smith</p>
</div>
```

The `overflow: hidden` declaration is a native browser CSS property. It instructs the browser rendering engine to discard any pixels that fall outside the container boundary. In the second container, the second paragraph remains in the DOM tree. The browser simply omits it during the paint stage.

A common developer trap is confusing JSX component hierarchy with CSS clipping boundaries. Declaring a dialog inside JSX guarantees that the component mounts and executes. However, the CSS applied to its DOM ancestor elements dictates whether those pixels ever appear on the screen.

### The dialog inside the row

Now we construct the email row. The `EmailRow` component maintains two state variables. The `isOpen` boolean tracks whether the message body is visible. The `showDialog` boolean tracks whether the confirmation modal is open:

```jsx title="src/EmailRow.jsx"
import { useState } from 'react';
import ConfirmDialog from './ConfirmDialog.jsx';

export default function EmailRow({ subject, body, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  function handleDeleteClick(e) {
    e.stopPropagation(); // The click on Delete does not open the email
    setShowDialog(true);
  }

  return (
    <div className="row" onClick={() => setIsOpen(true)}>
      <button className="delete" onClick={handleDeleteClick}>Delete</button>
      {subject}
      {isOpen && <p>{body}</p>}
      {~showDialog && <ConfirmDialog~ // The dialog's JSX sits inside the row's div
        onCancel={() => setShowDialog(false)}
        onDelete={onDelete}
      />}
    </div>
  );
}
```

The Delete button halts its own click event, preventing the row from opening when deleting an email (Lesson 11). Without calling `e.stopPropagation()`, clicking Delete would simultaneously open the message body.

The `ConfirmDialog` component presents the prompt and invokes callback functions provided by the row (Lesson 23):

```jsx title="src/ConfirmDialog.jsx"
export default function ConfirmDialog({ onCancel, onDelete }) {
  return (
    <div className="dialog">
      <p>Delete this email?</p>
      <button onClick={~onCancel~}>Cancel</button> {/* EmailRow sets showDialog back to false */}
      <button onClick={~onDelete~}>Delete</button> {/* App removes the email from its list */}
    </div>
  );
}
```

The stylesheet defines two key layout classes. The `.row` class handles truncation, while `.dialog` positions the overlay below the row header:

```css title="src/styles.css"
.row {
  ~position: relative;~ /* The dialog is placed against the row */
  z-index: 1;
  ~overflow: hidden;~ /* Needed for the three dots, and hides everything outside the row */
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 220px;
  padding: 12px;
  border-bottom: 1px solid #ddd;
  background: white;
}

.delete {
  float: right;
}

.dialog {
  ~position: absolute;~ /* Placed 30 pixels below the top of the row */
  top: 30px;
  left: 20px;
  z-index: 10;
  padding: 16px;
  border: 1px solid #999;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

Three properties on the `.row` class directly affect dialog rendering:
1. **`overflow: hidden` enables text truncation.** The `white-space: nowrap` property keeps the subject on a single line, and `text-overflow: ellipsis` appends three dots. The browser paints an ellipsis only when the container also hides overflowing content. Any list row designed to truncate long text inevitably includes the exact CSS rule that clips a nested dialog.
2. **`position: relative` turns the row into the containing block for absolute children.** The dialog `top: 30px` offset is measured from the top boundary of the row. Because the row serves as the containing block, the row clipping boundary applies directly to the dialog.
3. **`z-index: 1` establishes stacking context.** In this initial step, it produces no visible change. Principle 2 explores how it impacts dialog layering.

### What the user sees after a click on Delete

**Beware: the dialog renders in the DOM, but the user cannot interact with it.** When the user clicks Delete, the row clips almost the entire dialog container. Both the Cancel and Delete buttons remain completely hidden outside the row boundary:

```page width=text caption="The inbox after the user clicks Delete on the first email: the row cuts off almost all of the dialog."
heading: Inbox
line: Get your next month f… [Delete]
empty: only the top edge of the dialog shows, at the bottom of the first row
line: Lunch at noon? [Delete]
console: quiet
```

React executed the component successfully, but the browser stylesheet clipped its output. Here is the precise sequence of events:
1. The user clicks Delete on the first row. The click handler halts event bubbling to prevent opening the email and sets `showDialog` to `true`.
2. React mounts `ConfirmDialog` inside the row container in the DOM, matching the JSX hierarchy.
3. The dialog specifies `position: absolute` with `top: 30px`, placing its top edge thirty pixels below the row top. Because the row is approximately forty-five pixels tall, most of the dialog extends past the bottom row border.
4. The row enforces `overflow: hidden`, causing the browser to discard every pixel that falls outside the row container.
5. The user sees only a thin upper sliver of the dialog box.

The browser console remains empty because CSS clipping is standard layout behavior, not a JavaScript runtime exception. Inspecting the Elements panel reveals the structural cause: the dialog element resides inside the row container.

```dom caption="The Elements panel after the click: the dialog's div sits inside the first row's div."
<main>
  <h1>Inbox</h1>
  <div class="row">
    <button class="delete">Delete</button>
    Get your next month for $0.99
!   <div class="dialog"> | note: Inside the row, so the row's overflow: hidden cuts it off
      <p>Delete this email?</p>
      <button>Cancel</button>
      <button>Delete</button>
    </div>
  </div>
  <div class="row">
    <button class="delete">Delete</button>
    Lunch at noon?
  </div>
</main>
```

Only the first row renders a dialog because state is isolated within each `EmailRow` instance.

This scenario represents a frequent debugging challenge in production applications. A developer authors a modal inside the component containing the trigger button and local state. Earlier in development, an ancestor container received `overflow: hidden` to truncate text or round corner boundaries. When the user clicks the button, the dialog is clipped at the container edge. Inspecting the dialog styles reveals no obvious errors because the clipping rule originates from an ancestor element.

The React documentation highlights this exact scenario. Portals resolve clipping issues when the component opening the dialog sits inside a container with `overflow: hidden` or restrictive styles.

---

## PRINCIPLE | `z-index: 9999` on the dialog: the number counts only inside the row's stacking context

> [!PRINCIPLE]
> **Principle 2: Stacking Context: z-index: 9999 Leaves the Dialog Under the Next Row**
>
> *A `z-index` orders elements only inside their own stacking context and never undoes `overflow: hidden`, so no CSS on the dialog alone lifts it out of a row that cuts it off or groups it.*
>
> A row with `position: relative` and `z-index: 1` starts a stacking context. Every element inside it, the dialog included, is layered only against the row's other children. The next row has the same `z-index` and a later place in the DOM, so it covers the first row together with its dialog. Raising the dialog's number cannot change where its parent's group lands.
>
> **DO THIS:**
> ```jsx
> <>
>   <div className="row">{subject}</div> {/* z-index: 1 starts a stacking context */}
>   ~<div className="dialog">Delete this email?</div>~ {/* A sibling of the rows: its z-index: 10 beats their 1 */}
> </>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <div className="row"> {/* z-index: 1 starts a stacking context */}
>   {subject}
>   ~<div className="dialog">Delete this email?</div>~ {/* **WRONG:** z-index: 9999 counts only inside this row */}
> </div>
> ```

Here is the minimal reproduction. Two positioned containers sit sequentially in the DOM, each assigned `position: relative` and `z-index: 1`. Inside the first container sits an element with `z-index: 9999`:

```jsx title="A z-index of 9999 inside a div with z-index: 1"
<div style={{ position: 'relative', zIndex: 1 }}>
  <p style={{ position: 'absolute', top: 0, margin: 0, ~zIndex: 9999~ }}>John</p> {/* 9999 counts only inside the first div */}
</div>
<div style={{ position: 'relative', ~zIndex: 1~, background: 'white' }}>Smith</div> {/* Comes later with the same z-index: covers John */}
```

The rendered page displays only Smith. John occupies the identical screen coordinates directly beneath Smith, despite having an explicit z-index of `9999` while Smith sits at level `1`.

The `z-index` property is a browser CSS rule that specifies layering along the z-axis. When two positioned elements overlap, the browser paints the element with the higher value on top. However, the browser evaluates those values strictly within a shared stacking context.

> [!DEFINITION]
> **A stacking context.** [NEW] It is a group of elements that the browser layers as one unit: an element with a `position` such as `relative` and a `z-index` other than `auto` starts one, and every element inside it is layered only against the other elements inside it, never against the rest of the page (Lesson 51).

The browser rendering engine resolves layering in two distinct phases:
1. **First, it layers root stacking contexts against each other.** The first container sits at layer `1` alongside all its internal descendants. The second container also sits at layer `1` and appears later in the DOM tree. When two stacking contexts share the same integer level, the element appearing later in the DOM paints on top. Consequently, the second container covers the entire first container, including all child elements.
2. **Second, it layers elements inside each local context.** The value `9999` resolves order solely among siblings within the first container, where John is the only child.

Developers often assume that a higher numeric `z-index` always triumphs on the page. That assumption is false. The browser compares `z-index` values only within their immediate stacking context. The parent stacking level determines where the entire group sits relative to outside elements. Compare the two structural arrangements:
1. **An element with `z-index: 9999` in the root stacking context** is evaluated against every root element on the page, rendering on top of all standard content.
2. **An element with `z-index: 9999` inside a parent with `z-index: 1`** is evaluated solely against siblings inside that parent. The parent element remains anchored at stacking level `1`.

Although the numeric value is identical, DOM placement dictates the stacking context where that number is evaluated.

```tree caption="The same z-index: 9999 wins on its own, and loses inside a parent that starts a stacking context."
Where `z-index: 9999` is compared
- +On an element in no smaller group [`z-index: 9999`] | Compared with **every element of the page** | Drawn **on top of everything**
- !On an element inside a parent with `z-index: 1` [`9999` inside `1`] | Compared only with **the parent's other children** | A later element with `z-index: 1` **covers the whole group**
```

### Two changes to the dialog's CSS that do not free it

Returning to our inbox, the clipped dialog tempts developers to adjust dialog styling directly. First, the developer assigns `z-index: 9999` to the dialog class:

```css title="src/styles.css" startLine="17"
.dialog {
  position: absolute;
  top: 30px;
  left: 20px;
  ~z-index: 9999;~ /* **WRONG:** the row still cuts off the dialog */
  padding: 16px;
  border: 1px solid #999;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

This change produces no visible improvement. The `overflow: hidden` declaration on the parent row continues to clip any content extending past the row boundary. A `z-index` property manages overlapping paint order; it never overrides container clipping.

Next, the developer switches the dialog to `position: fixed`. Fixed positioning anchors an element relative to the browser viewport instead of the parent row:

```css title="src/styles.css" startLine="17"
.dialog {
  ~position: fixed;~ /* Placed against the viewport, so the row no longer cuts it off */
  ~top: 100px;~ /* Measured from the top of the window: the dialog now lands over the second row */
  left: 20px;
  z-index: 9999;
  padding: 16px;
  border: 1px solid #999;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

**Beware: the row no longer clips the dialog, but the second row now paints directly over it:**

```page width=text caption="The inbox with position: fixed and z-index: 9999 on the dialog: the second row is drawn across the middle of the dialog and hides its question."
heading: Inbox
line: Get your next month f… [Delete]
line: Lunch at noon? [Delete] | bad
empty: the second row hides the question Delete this email?, and only the bottom of the dialog shows below the row
form:
  button: Cancel
  button: Delete
console: quiet
```

A dialog assigned `z-index: 9999` renders underneath a row assigned `z-index: 1`. Here is the physical breakdown:
1. With `position: fixed`, the browser places the dialog one hundred pixels below the viewport top, overlapping the second row. Because the dialog containing block is now the viewport, row clipping rules no longer crop its edges.
2. The first row declares `position: relative` and `z-index: 1`, creating an independent stacking context. The browser creates this context automatically based on standard CSS rules.
3. In the DOM tree, the dialog remains a child of the first row. Its value of `9999` applies solely within the first row local stacking context.
4. The second row also declares `z-index: 1` and appears later in the DOM tree. The browser paints the second row on top of the first row and all its descendants.
5. Where the elements intersect, the second email subject conceals the dialog prompt. The confirmation text remains buried under the second row, while the action buttons remain visible below it.

Both attempted fixes modified dialog styles. The root cause lies in DOM hierarchy: the dialog remains nested inside the first row.

This illustrates why CSS workarounds consume valuable engineering time. Increasing `z-index` to extreme values produces no effect. Removing `overflow: hidden` from the row breaks text truncation across the entire inbox. The proper architectural solution is changing the DOM insertion point, which `createPortal` accomplishes. Because these CSS experiments failed, the stylesheet reverts to its initial state from Principle 1.

---

## PRINCIPLE | `createPortal(dialog, document.body)`: the JSX stays in `EmailRow`, the dialog's `<div>` lands in `<body>`

> [!PRINCIPLE]
> **Principle 3: createPortal: The Dialog's DOM Nodes Go to document.body**
>
> *`createPortal(children, domNode)` keeps the JSX inside the component and makes React put its DOM nodes inside `domNode`, such as `document.body`.*
>
> The dialog keeps its place in the React tree, next to the button and the state that open it. Only its DOM nodes move. Once the dialog's `<div>` sits directly inside `<body>`, no row's `overflow: hidden` cuts it off and no row's stacking context holds it, so the browser compares its own `z-index` with the rows'. The node passed as the second argument must already exist on the page.
>
> **DO THIS:**
> ```jsx
> import { createPortal } from 'react-dom';
>
> {showDialog && ~createPortal~(<ConfirmDialog />, document.body)} {/* The dialog's div lands in <body>, outside the row */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> {showDialog && ~createPortal~(<ConfirmDialog />, document.getElementById('modal-root'))} {/* **WRONG:** no such div in index.html, so React throws */}
> ```

Here is the minimal reproduction of a portal. A bordered container encloses two text lines. The first line renders through standard JSX, while the second line passes to `createPortal`:

```jsx title="One line inside the border, one line sent to document.body"
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>John</p> {/* Inside the border */}
      {~createPortal~(<p>Smith</p>, ~document.body~)} {/* Outside the border, directly inside <body> */}
    </div>
  );
}
```

On the screen, the name Smith renders completely outside the bordered container. The Elements panel explains the separation: React mounted the second paragraph directly inside `document.body`, following the application root element:

```dom caption="The Elements panel for MyComponent: the portal's p sits directly inside body, outside the bordered div."
<body>
  <div id="root">
    <div style="border: 2px solid black;">
      <p>John</p>
    </div>
  </div>
  <script type="module" src="/src/main.jsx"></script>
+ <p>Smith</p> | note: Rendered by the portal, directly inside body
</body>
```

> [!DEFINITION]
> **A portal.** [NEW] It is the part of a component's JSX that React puts somewhere else in the DOM, and in the words of React's docs, "Portals let your components render some of their children into a different place in the DOM. This lets a part of your component 'escape' from whatever containers it may be in" (Lesson 51).

The `createPortal` function is provided by React. You import it from `react-dom` rather than the core `react` package. It accepts two required arguments:
1. **`children`** defines the renderable content: any valid React node, such as JSX markup or a custom component. In our application, this is `<ConfirmDialog />`.
2. **`domNode`** specifies the target container: a real DOM node that already exists within the document. In our application, this is `document.body`.

The `document.body` property is a native browser global representing the `<body>` element of the document. It remains available throughout the lifetime of the application.

This provides a declarative React equivalent to native DOM insertion methods. Your JSX structure continues to define component hierarchy in the React tree. Meanwhile, `createPortal` redirects physical DOM rendering to an external container.

### VS | `<ConfirmDialog />` vs. `createPortal(<ConfirmDialog />, document.body)`: the same component, a different place in the DOM

Updating `EmailRow` requires modifying a single line. Compare standard inline rendering with portal rendering:

```jsx title="Rendering the dialog in place, and rendering it through createPortal"
{showDialog && ~<ConfirmDialog />~} {/* The dialog's div lands inside the row */}
{showDialog && ~createPortal~(<ConfirmDialog />, document.body)} {/* The dialog's div lands inside <body> */}
```

From the perspective of component execution, both expressions behave identically. Each renders the same `ConfirmDialog` component with identical props, and `showDialog` continues to control conditional rendering.

From the perspective of the DOM, their output differs completely. Without `createPortal`, the dialog DOM element mounts inside the row. With `createPortal`, the dialog DOM element mounts directly inside `document.body`, outside every application container. React documentation describes this behavior as teleporting the DOM output.

Here is the updated `EmailRow` component using `createPortal`:

```jsx title="src/EmailRow.jsx" good="2,19,24"
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ConfirmDialog from './ConfirmDialog.jsx';

export default function EmailRow({ subject, body, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  function handleDeleteClick(e) {
    e.stopPropagation();
    setShowDialog(true);
  }

  return (
    <div className="row" onClick={() => setIsOpen(true)}>
      <button className="delete" onClick={handleDeleteClick}>Delete</button>
      {subject}
      {isOpen && <p>{body}</p>}
      {showDialog && ~createPortal~( // The JSX stays here; its DOM nodes go to <body>
        <ConfirmDialog
          onCancel={() => setShowDialog(false)}
          onDelete={onDelete}
        />,
        ~document.body~ // The element that receives the dialog's div
      )}
    </div>
  );
}
```

The stylesheet reverts to the clean configuration from Principle 1, restoring `position: absolute` and `z-index: 10` on the dialog. Neither the root `App` component nor the `ConfirmDialog` component requires changes.

### What the user sees now

When the user clicks Delete on the first email, the entire confirmation dialog displays clearly over the page:

```page width=text caption="The inbox after the user clicks Delete, with the dialog rendered through createPortal: the whole dialog shows over the page."
heading: Inbox
form: title=Delete this email?
  button: Cancel | | good
  button: Delete | | good
line: Get your next month f… [Delete]
line: Lunch at noon? [Delete]
console: quiet
```

Here is how the browser and React coordinate this rendering:
1. The user clicks Delete on the first row, executing `setShowDialog(true)`.
2. React renders `EmailRow` and processes `createPortal`. It mounts the dialog DOM elements directly inside `document.body`, outside the application root container.
3. The row `overflow: hidden` rule no longer affects the dialog, because the dialog is no longer a DOM descendant of the row.
4. The row stacking context no longer restrains the dialog. Inside `document.body`, the browser compares the dialog z-index of `10` directly against the rows, painting the modal above both rows.
5. The user sees the complete dialog along with both action buttons.

Because the dialog now mounts in `document.body`, its coordinate offsets calculate relative to the page. The dialog floats near the page header above the first row. The React documentation confirms this behavior in its own examples: a component rendered into a portal remains completely unaffected by container clipping.

```dom caption="The Elements panel after the click: the dialog's div sits directly inside body, after the root div."
<body>
  <div id="root">
    <main>
      <h1>Inbox</h1>
      <div class="row">...</div>
      <div class="row">...</div>
    </main>
  </div>
  <script type="module" src="/src/main.jsx"></script>
+ <div class="dialog"> | note: Rendered by EmailRow through createPortal
    <p>Delete this email?</p>
    <button>Cancel</button>
    <button>Delete</button>
  </div>
</body>
```

The two top-level elements in the DOM tree serve distinct purposes. The container `<div id="root">` is where React initializes the application (Lesson 07). The dialog element represents the single part of the application mounted outside that root, directed there by `document.body`. React did not instantiate the `<body>` tag; the browser created it during initial document parsing.

Now the user clicks Cancel. The dialog invokes the `onCancel` callback, which updates `showDialog` to false. React unmounts the dialog element from `document.body`. The callback succeeds despite the physical DOM separation because the dialog remains a child of `EmailRow` in the React tree. However, clicking Cancel also triggers an unexpected side effect: the first email expands behind the dialog. Principle 4 explains why this occurs.

### `getElementById('modal-root')` returns `null`, and React throws

The React documentation warns that the target container passed to `createPortal` must already exist in the DOM. A common production bug occurs when developers copy tutorial patterns that reference an external container element without declaring it in HTML:

```jsx title="src/EmailRow.jsx" startLine="19"
{showDialog && createPortal(
  <ConfirmDialog onCancel={() => setShowDialog(false)} onDelete={onDelete} />,
  ~document.getElementById('modal-root')~ // **WRONG:** index.html has no such div, so this is null
)}
```

If the HTML template lacks an element with that ID, `document.getElementById` returns `null`. React cannot attach DOM nodes to `null`. When the user triggers the portal, `createPortal` throws an uncaught error. Without an error boundary to handle the exception, the application crashes and displays a blank white screen:

```devconsole width=full caption="The Console after the click on Delete, when the portal's DOM node is null."
x Uncaught Error: Target container is not a DOM element.
! An error occurred in the <EmailRow> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

Using `document.body` avoids this runtime exception because the browser guarantees `<body>` exists. Targeting a dedicated container such as `#modal-root` is equally valid, provided the element exists in the HTML document before rendering.

---

## PRINCIPLE | Events from `createPortal`: a click inside the dialog still reaches the row's `onClick`

> [!PRINCIPLE]
> **Principle 4: The React Tree: A Click on Cancel Still Opens the Email**
>
> *Events from a portal travel up the React tree, not the DOM tree, so a click inside the dialog runs the `onClick` of every component above it in React, the row included.*
>
> In the Elements panel, the dialog sits in `<body>`, far from the row. In React, it is still a child of `EmailRow`, so React sends a click on Cancel up to the row's `onClick`, and the email opens behind the closing dialog. Stop the click inside the portal with `e.stopPropagation()`, or render the portal from a component that has no unwanted `onClick` above it.
>
> **DO THIS:**
> ```jsx
> <div className="dialog" ~onClick={e => e.stopPropagation()}~> {/* Clicks inside the dialog stop here */}
>   <button onClick={onCancel}>Cancel</button>
> </div>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <div className="row" onClick={() => setIsOpen(true)}>
>   {createPortal(~<button onClick={onCancel}>Cancel</button>~, document.body)} {/* **WRONG:** the click also reaches the row, and the email opens */}
> </div>
> ```

Here is the minimal reproduction. A parent container with an `onClick` listener renders a portal containing a button:

```jsx title="A div with onClick that holds a portal"
<div ~onClick~={() => alert('Row')}> {/* Runs for a click on Cancel, too */}
  {createPortal(<button>Cancel</button>, document.body)} {/* Cancel sits in <body> in the DOM */}
</div>
```

When the user clicks Cancel, the alert box displays `Row`. In the DOM tree, the button does not reside inside the parent container. In the React tree, the button remains a child of that container.

The React documentation explicitly states: events from portals propagate according to the React tree rather than the DOM tree. Within the React tree, portal content remains nested inside the declaring component.

This behavior frequently surprises developers who inspect the DOM tree. Viewing the element outside the parent container in developer tools suggests that events are isolated. They are not. In the DOM tree, the parent of the dialog is `document.body`. In the React tree, the parent remains `EmailRow`, and React dispatches synthetic events along the React hierarchy.

Remember the core rule once more: **CSS follows the physical DOM tree. React follows the component React tree.** Props, state, context, and synthetic events all follow the React component tree.

### What happens when the user clicks Cancel

**Beware: a portal moves the dialog out of the row visually, but leaves it inside the row for React event handling.** Under the implementation from Principle 3, clicking Cancel closes the dialog while opening the email body:

```page width=text caption="The inbox after the user clicks Cancel in the dialog: the dialog is gone, and the first email has opened."
heading: Inbox
line: Get your next month f… [Delete]
line: Your offer ends Friday. | bad
line: Lunch at noon? [Delete]
console: quiet
```

Here is the sequence of events:
1. The user clicks Delete on the first row, opening the dialog as demonstrated in Principle 3.
2. The user clicks Cancel. React executes the Cancel click handler, invoking `onCancel` to update `showDialog` to false.
3. React bubbles the synthetic click event upward along the React component tree. The event travels from Cancel, through the dialog container, to the row container element.
4. The row click handler executes, invoking `setIsOpen(true)`.
5. React re-renders the row. The dialog unmounts, and the email body text appears beneath the subject line.

The user intended only to dismiss the modal, yet the message expanded unexpectedly. In native browser event dispatch, the click bubbles from the button, through the dialog, directly to `document.body`. It never encounters the row container. React itself routes the synthetic event up the React tree, where the row is the immediate parent of the dialog.

The Delete button inside the dialog bubbles its event in the exact same manner. However, because `App` removes that email from state during that render, the row unmounts before expansion can appear.

This scenario represents a classic pitfall in production applications. A developer moves an overlay into a portal to resolve clipping bugs. The parent component or a surrounding wrapper contains an `onClick` handler. Every interaction inside the portal inadvertently triggers parent click logic. The browser developer tools cannot explain this behavior because the DOM hierarchy shows the elements completely separated.

### VS | `e.stopPropagation()` inside the portal vs. the portal moved up to `App`: the same page, the dialog's code in a different place

The React documentation outlines two architectural solutions: developers can either halt event propagation inside the portal, or move the portal higher in the React tree. Both strategies prevent row click handlers from executing during dialog interactions:
1. **Halt propagation inside the portal container.** The outer dialog element calls `e.stopPropagation()` on any click event. The dialog declaration remains in `EmailRow`, keeping trigger logic and state neatly encapsulated.
2. **Lift the portal up the React tree.** A parent component without row click handlers, such as `App`, renders the modal. This approach requires lifting `showDialog` and the target email ID into `App` state (Lesson 24).

Both approaches deliver the desired user experience: Cancel dismisses the dialog while the email remains closed. The key difference is state ownership. Halting propagation requires adding a single event handler prop while keeping state local to the row. Lifting the portal moves dialog state, component markup, and prop passing up to the parent component.

```tree caption="Two fixes for a click inside the portal that reaches the row: stop it inside the portal, or move the portal up the React tree."
Two ways to keep a click on Cancel away from the row's `onClick`
- +Stop the click inside the portal [`stopPropagation`] | The dialog's outer `<div>` **stops every click inside it** | The dialog and `showDialog` **stay in `EmailRow`**
- +Move the portal up the React tree [`App`] | No row's `onClick` **sits above the dialog** | `showDialog` and the email's id **move up to `App`**
```

Because our dialog is small and belongs exclusively to an individual row, halting propagation inside the portal is the cleanest solution. The `ConfirmDialog` component adds an event handler to its root container:

```jsx title="src/ConfirmDialog.jsx" good="3"
export default function ConfirmDialog({ onCancel, onDelete }) {
  return (
    <div className="dialog" ~onClick={e => e.stopPropagation()}~> {/* Every click inside the dialog stops here */}
      <p>Delete this email?</p>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}
```

The `e` argument represents the React synthetic event object passed to event handlers (Lesson 11). When the user clicks Cancel, the button handler runs `onCancel` first. The event then reaches the dialog container, where `e.stopPropagation()` halts bubbling. The row click handler never fires.

::: row caption="A click on Cancel without and with stopPropagation on the dialog's outer div."
::: col title="Without stopPropagation in the dialog" tag="the email opens" tone=bad
```page size=mini
heading: Inbox
line: Get your next month f… [Delete]
line: Your offer ends Friday. | bad
line: Lunch at noon? [Delete]
```
The dialog is gone, and the first email has opened behind it.
:::
::: col title="With stopPropagation on the dialog's outer div" tag="the email stays closed" tone=good
```page size=mini
heading: Inbox
line: Get your next month f… [Delete] | good
line: Lunch at noon? [Delete]
```
The dialog is gone, and the first email stays closed.
:::
:::

This rule applies uniformly across all React data features. Even though its DOM nodes reside in `document.body`, the dialog retains access to props and state from `EmailRow`. It also reads context values supplied by any provider higher in the component tree (Lesson 28). The React documentation confirms that children inside a portal access context from the parent tree. A portal alters nothing in React except the physical DOM insertion point.

---

## All 4 Principles Together

### The complete inbox project

The `App` component maintains message state and removes items upon user confirmation:

```jsx title="src/App.jsx"
import { useState } from 'react';
import EmailRow from './EmailRow.jsx';
import './styles.css';

export default function ~App~() { // 1. Called first: renders one EmailRow per email
  const [emails, setEmails] = useState([
    { id: 1, subject: 'Get your next month for $0.99', body: 'Your offer ends Friday.' },
    { id: 2, subject: 'Lunch at noon?', body: 'See you at the cafe.' },
  ]);

  function handleDelete(id) {
    setEmails(emails.filter(email => email.id !== id));
  }

  return (
    <main>
      <h1>Inbox</h1>
      {emails.map(email => (
        <EmailRow
          key={email.id}
          subject={email.subject}
          body={email.body}
          onDelete={() => handleDelete(email.id)}
        />
      ))}
    </main>
  );
}
```

The `EmailRow` component renders the dialog alongside local state and triggers, routing its DOM elements to `document.body`:

```jsx title="src/EmailRow.jsx"
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ConfirmDialog from './ConfirmDialog.jsx';

export default function ~EmailRow~({ subject, body, onDelete }) { // 2. Called once per email
  const [isOpen, setIsOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  function handleDeleteClick(e) {
    e.stopPropagation();
    setShowDialog(true);
  }

  return (
    <div className="row" onClick={() => setIsOpen(true)}>
      <button className="delete" onClick={handleDeleteClick}>Delete</button>
      {subject}
      {isOpen && <p>{body}</p>}
      {showDialog && ~createPortal~( // Principle 3: the dialog's DOM nodes go to <body>
        <ConfirmDialog
          onCancel={() => setShowDialog(false)}
          onDelete={onDelete}
        />,
        document.body
      )}
    </div>
  );
}
```

The `ConfirmDialog` component halts click propagation at the dialog boundary:

```jsx title="src/ConfirmDialog.jsx"
export default function ~ConfirmDialog~({ onCancel, onDelete }) { // 3. Called by the row whose showDialog is true
  return (
    <div className="dialog" ~onClick={e => e.stopPropagation()}~> {/* Principle 4: clicks inside the dialog stop here */}
      <p>Delete this email?</p>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
}
```

The stylesheet reflects the initial configuration from Principle 1:

```css title="src/styles.css"
.row {
  position: relative;
  z-index: 1;
  ~overflow: hidden;~ /* Principle 1: still cuts long subjects, and no longer reaches the dialog */
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 220px;
  padding: 12px;
  border-bottom: 1px solid #ddd;
  background: white;
}

.delete {
  float: right;
}

.dialog {
  position: absolute;
  top: 30px;
  left: 20px;
  ~z-index: 10;~ /* Principle 2: inside <body>, compared with the rows' z-index: 1 */
  padding: 16px;
  border: 1px solid #999;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

When the user clicks Delete, the complete dialog appears clearly above the inbox. Clicking Cancel closes the dialog while leaving the message collapsed:

```page width=text caption="The finished inbox after the user clicks Delete and then Cancel: the dialog is gone, and the first email stays closed."
heading: Inbox
line: Get your next month f… [Delete] | good
line: Lunch at noon? [Delete]
console: quiet
```

### How React calls the components, and where their elements land

During initial render, React executes `App` and then renders each `EmailRow` instance. When the user clicks Delete on the first row, React executes `ConfirmDialog`. In the React component tree, the dialog remains a child of the first row. In the DOM tree, its container element mounts directly inside `document.body`:

```tree caption="The React tree of the inbox after a click on Delete, and where each component's DOM nodes land."
`App` [1. Called first] | Renders `<main>` inside **`<div id="root">`**
- +`EmailRow` for the first email [2. Called for each email] | Its row `<div>` lands **inside `<main>`** | Its `showDialog` is **`true`**
  - +`ConfirmDialog` [3. Called by the first row] | In the React tree, **a child of the first row** | In the DOM tree, its `<div>` lands **directly inside `<body>`**
- +`EmailRow` for the second email [2. Called for each email] | Its row `<div>` lands **inside `<main>`** | Its `showDialog` is **`false`**
```

| What the developer does | What the user sees | The rule behind it |
| :--- | :--- | :--- |
| **Writes the dialog inside the row** | Only a thin slice of the dialog. Cancel and Delete are out of reach. | The row's `overflow: hidden` cuts off the dialog placed against it |
| **Raises the dialog's `z-index` to `9999`** | No change. The dialog is still cut off. | A `z-index` never undoes `overflow: hidden` |
| **Switches the dialog to `position: fixed`** | The second row is drawn across the dialog | The first row's stacking context holds the dialog's `9999` |
| **Renders the dialog through `createPortal` into `document.body`** | The whole dialog shows over the page | The dialog's DOM nodes leave the row, and its place in React does not change |
| **Clicks Cancel in the portal** | The email opens behind the closing dialog | Events travel up the React tree, through the row's `onClick` |
| **Adds `e.stopPropagation()` to the dialog's outer `<div>`** | Cancel closes the dialog, and the email stays closed | The click stops inside the portal |

One last time, the sentence of this lesson: **CSS follows the DOM tree. React follows the React tree. A portal changes only the DOM tree.**

---

## For the Interview

> **The Interview Question:** How do you render a modal that escapes its parent's overflow and stacking context?

### How to Answer Clearly in 30 Seconds

"CSS follows the DOM tree. A modal declared inside an element with `overflow: hidden` is clipped. A modal placed inside an ancestor with an integer `z-index` is trapped inside that parent stacking context. Increasing `z-index` on the modal fixes neither issue. To solve this, render the modal using `createPortal` from `react-dom`, passing the JSX markup and `document.body`. React retains the component in the parent React tree while mounting its DOM elements directly inside `document.body`, escaping all clipping and stacking boundaries. Because a portal changes only physical DOM placement, two behaviors remain unchanged:
1. **Props, state, and context**: the modal continues reading them directly from the declaring component.
2. **Event bubbling**: synthetic events continue propagating upward along the React component tree. If a parent component listens for clicks, call `e.stopPropagation()` inside the modal container or lift the portal higher in the tree."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why doesn't `z-index: 9999` bring the modal to the front?"**
   For two primary reasons. First, `overflow: hidden` on an ancestor container clips any content extending outside that container, regardless of its `z-index`. Second, an ancestor with a positioned layout and an integer `z-index` creates an isolated stacking context. The modal `z-index` resolves only among sibling elements within that local context. A subsequent sibling of the parent container sharing the same stacking level paints over the entire group. Additional CSS properties create stacking contexts as well, including `opacity` less than `1` or CSS `transform`. Applying a `transform` or `filter` to a parent even causes `position: fixed` descendants to anchor to that parent, subjecting them to parent clipping boundaries once more. Resolving these defects requires changing the DOM insertion point rather than tweaking CSS numbers.
2. **"Does a component inside a portal lose its parent's props, state, or context?"**
   No. The React documentation states that JSX rendered into a portal acts as a child node of the component rendering it in every other way. A modal mounted in `document.body` continues to read props and state from its declaring parent, and accesses any context values supplied above that parent in the tree. Only the physical DOM mounting location changes. React requires that the target DOM container already exists when the portal renders. Passing `null`, such as from `document.getElementById` with a missing element, causes React to throw an uncaught error. Supplying a different container node on subsequent renders causes React to recreate the portal DOM subtree.
3. **"A click inside your portal runs a parent's `onClick`. Why, and how do you stop it?"**
   Because React dispatches synthetic events along the React component tree rather than the physical DOM tree. In the DOM, the modal element sits directly inside `document.body`. In the React component tree, the modal remains a nested child of the triggering component, so React bubbles synthetic events upward to parent event listeners. React documentation provides two solutions: halt event bubbling inside the portal using `e.stopPropagation()`, or lift the portal higher in the React component tree. Halting propagation keeps modal state local to the triggering component. Lifting the portal moves state ownership to a parent container without conflicting click handlers. In both architectures, accessible dialogs also require focus management, trapping focus within the modal and returning it upon dismissal according to WAI-ARIA standards.

```tree dir=right caption="Interview summary: what a portal moves and what it keeps."
What `createPortal` changes for a modal
- +Moves: the DOM place [`document.body`] | The modal's DOM nodes **leave every element that cuts them off** | `overflow: hidden` and a parent's stacking context **no longer reach it**
- +Keeps: the React place [`EmailRow`] | Props, state, and context **still come from the parent** | Clicks **still travel up to the parent's `onClick`**
```
