# Lecture 77: How React Decides Which DOM Nodes to Keep

*(After a click renders the page again, why does the text the user typed sometimes stay, and sometimes disappear?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | When React re-renders, how does the reconciliation algorithm decide which DOM nodes to update?

---

## VS | The same type and key vs. a different type or key: React keeps the real element, or throws it away and builds a new one

> In plain JavaScript, modifying an element directly preserves its identity and internal text. **During reconciliation, React diffs each element against the previous tree at the same position and checks both type and key**. Matching both properties preserves the live DOM node and its user input. Mismatching either property destroys that DOM node and constructs a fresh element.

Remember how traditional JavaScript modifies a web page. You select an existing element directly: `document.getElementById('message').className = 'dark'`. The DOM node retains its identity in browser memory. Only its class attribute changes, while any text the user typed inside the field remains intact.

In React, application code never touches the browser DOM directly. Your component returns JSX, producing a new tree of plain JavaScript descriptor objects on every render (Lesson 76). React must then translate that new descriptor tree into browser DOM updates. It has two possible strategies:
1. **Rebuild the entire DOM tree from scratch.** Recreating every DOM node on every render would destroy performance. Furthermore, every `<input>` field would lose active focus and typed text on every state change.
2. **Preserve existing DOM nodes whenever possible.** React reuses matching nodes and mutates only the specific attributes that changed. This preservation strategy is the foundation of React reconciliation.

After each render, React compares the newly returned tree against the previous tree. It walks through both trees position by position. At each position, it asks two decisive questions: **is the type identical, and is the key identical?** When both answers are yes, React preserves the existing DOM node. When either answer is no, React destroys that DOM node and mounts a new one.

Why this matters: These two questions determine whether user input survives a re-render. Getting either wrong introduces silent bugs that generate zero warnings in the console:
1. **An unexpected tag change erases user input.** Suppose a developer wraps an input in a `<div>` for daytime styling and a `<section>` for night styling. When the user toggles themes, the outer tag changes, so React unmounts the wrapper and destroys the typed message.
2. **A missing key leaks state into the wrong context.** Suppose a user writes an unsent draft to John and then clicks Mia. Without an explicit key, React reuses the same input node. John's message remains in the input field, allowing an accidental click to send the draft to Mia. The official React documentation warns directly against this hazard. It cautions: "You don't want to let the user send a message they already typed to a wrong person due to an accidental click."

### Two Questions at Every Place in the Tree

Consider the simplest illustrative example. A multiline `<textarea>` element sits inside a container `<div>`. Toggling theme mode modifies only the class attribute on the outer container:

```jsx title="The JSX before the click, and the JSX after the click"
<div ~className="light"~><textarea /></div> // Before: a textarea inside a div
<div ~className="dark"~><textarea /></div> // After: still a textarea inside a div
```

React traverses both element trees starting from the root:
1. **At the root position**, the previous tree returned a `<div>` and the new tree returns a `<div>`. Both elements share the same type with no key specified. React keeps the existing container node in the DOM, updating only its class name from light to dark.
2. **At the first child position**, the previous tree contained a `<textarea>` and the new tree contains a `<textarea>`. The type matches and neither element defines a key. React keeps the existing input node, leaving any text inside it intact.

```tree caption="The two questions React asks at each place of the tree, and what it does with the real element."
At each place, React asks: is the type the same, and is the key the same? [`type` `key`]
- +Both answers yes [`<div>` then `<div>`] | React **keeps the real element** | It changes **only what differs**, such as one `class`
- !Either answer no [`<section>` after `<div>`] | React **throws away the element and everything inside it** | It **builds new elements** from scratch
```

> [!DEFINITION]
> **A DOM node.** [REVIEW] A DOM node is a live browser element managed in the document object model, such as an object returned by `document.getElementById`.
> 1. React elements act as lightweight JavaScript blueprints returned by components.
> 2. React creates or updates actual DOM nodes exclusively during the commit phase (Lesson 13).
> 3. Browser DOM nodes retain their own internal state, including input focus, scroll position, and unmanaged input values.
>
> Reusing an existing DOM node preserves that transient browser state, while destroying and recreating the node wipes it completely.

> [!DEFINITION]
> **Type and key.** [REVIEW] Every React element descriptor object carries an identifying `type` and `key` property (Lesson 76).
> 1. For HTML tags like `<div>`, the `type` is a string matching the tag name, such as `'div'`. For custom components, it is a reference to the component function itself.
> 2. The `key` is an optional unique identifier string. If no key prop is written on the tag, React defaults `key` to `null`.
> 3. During reconciliation, React matches elements across renders by comparing both `type` and `key` at the same position in the tree.
>
> Two elements match if and only if their `type` is identical and their `key` is identical.

> [!DEFINITION]
> **Reconciliation.** [NEW] Reconciliation is the diffing process React uses to calculate the minimal set of DOM changes between renders (Lesson 77).
> 1. A component re-render produces a fresh tree of React elements in memory.
> 2. React compares each element in the new tree with the element at the corresponding position in the previous tree.
> 3. For matching elements, React retains the existing DOM node and schedules property updates. For mismatched elements, React destroys the old DOM node and constructs a new one.
>
> Reconciliation avoids expensive DOM reconstruction by reusing matching nodes, ensuring optimal performance and predictable UI state.

### Where Readers Usually Go Wrong

Developers typically stumble over three core misconceptions:
1. **Assuming React compares new JSX directly against the browser DOM.** React does not inspect the live document tree during reconciliation. Instead, it compares two lightweight JavaScript object trees in memory: the new element tree against the previous element tree. Reading live DOM nodes is slow, whereas comparing plain JavaScript objects is virtually instantaneous. React updates the live DOM only during the final commit.
2. **Assuming visually identical markup means identical element types.** A `<section className="dark">` and a `<div className="dark">` styled with identical CSS look identical on screen. To React, however, `'section'` and `'div'` are fundamentally different types. Switching between them forces React to unmount the old node and destroy any unmanaged text inside.
3. **Assuming conditional branches create separate DOM slots.** React never inspects conditional logic in your source code. As the React documentation explains: "React doesn't know where you place the conditions in your function. All it 'sees' is the tree you return." If two different branches place an element at the same position, React treats them as the same slot.

### The Rule of Thumb: same type, same key, same DOM node

**Evaluate every position in your JSX with a single check: after an update, does this element share the same type and the same key as before? If yes, React keeps the DOM node along with any typed text. If no, React builds a fresh, empty DOM node.**

Consequently, when you want to preserve user input across renders, keep the same tag at that tree position. When you want a clean, reset field, assign it a different key.

## SECTION | A Chat Page with Three Buttons

Our example application is a compact chat interface. It presents three action buttons labeled John, Mia, and Night mode, with a message compose field below them:

```page width=text caption="The chat page when it opens: three buttons and an empty message field for John."
line: [John] [Mia] [Night mode]
card: input=Message John
console: quiet
```

The project has four files:

```files title="chat-page: File Explorer" caption="The four files of the chat page project."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` and mounts it into `#root` inside `<StrictMode>`
  App.jsx | component | Exports `App`: the three buttons, the wrapper, and the message field
  App.css | styles | The `.light` and `.dark` colors of the wrapper
```

One deliberate architectural choice makes this page an ideal diagnostic test. The `<textarea>` element is uncontrolled, meaning it defines no `value` prop bound to React state. The browser stores whatever the user types directly within the live DOM node itself (Lesson 40). Because of this setup, the typed text provides an immediate indicator of React's reconciliation choices:
1. **The typed text survives an update:** React preserved the existing DOM node in place.
2. **The typed text disappears:** React unmounted the old DOM node and constructed a fresh one.

We refer to unsubmitted text typed into the field as the draft. In each upcoming scenario, the user types the draft message See you at 6 for John. The previews highlight the buttons and text field.

Four foundational principles govern how React decides whether to preserve or replace a DOM node during reconciliation:
1. **Principle 1: Position: React Pairs Elements by Tree Position, Not Logic Branches.** Two conditional branches returning an input at the same tree position map to the same DOM node, preserving draft text.
2. **Principle 2: Type: A Different Type Destroys the Entire Subtree.** Swapping a container element for another tag unmounts the wrapper and all nested children, discarding draft text.
3. **Principle 3: Reuse: Matching Type and Key Preserve the DOM Node.** Keeping the same element tag while updating its class attribute reuses the DOM node, keeping the draft intact.
4. **Principle 4: Key: A Changing Key Forces Node Re-creation.** Providing a distinct key for each recipient forces React to mount a clean, empty compose field.

---

## PRINCIPLE | `if` branches: React never sees them, it pairs the elements by position

> [!PRINCIPLE]
> **Principle 1: Position: React Pairs the New Tree with the Previous One**
>
> *On every re-render, React pairs each element of the new tree with the element at the same position in the previous tree, by order inside each parent; the `if` that built the tree plays no part.*
>
> Two `if` branches look like two different fields, but React never sees the branches. It sees only the tree the component returns. When both branches put a `<textarea>` at the same position, React keeps the old DOM node and the draft in it. That is right for a theme, and wrong when each branch is meant for another person.
>
> **DO THIS:**
> ```jsx
> if (dark) {
>   return <div className="dark"><textarea /></div>;
> }
> return <div className="light">~<textarea />~</div>; // The same position in both branches: the draft stays after Night mode
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> if (contact === 'Mia') {
>   return ~<textarea placeholder="Message Mia" />~; // **WRONG:** not a fresh field: John's draft stays in it
> }
> return <textarea placeholder="Message John" />;
> ```

### VS | Two `return` lines vs. one `return`: the exact same tree

Here is the minimal logic required to toggle themes. The theme button flips a boolean flag named `dark`, causing the component to execute one of two return paths:

```jsx title="Two return lines, one for each theme"
if (dark) {
  return <div ~className="dark"~><textarea /></div>; // Night: a textarea inside a div
}
return <div ~className="light"~><textarea /></div>; // Day: a textarea inside a div
```

Now compare those separate returns with a single return statement containing a conditional attribute:

```jsx title="One return with a className that changes"
return <div ~className={dark ? 'dark' : 'light'}~><textarea /></div>; // A textarea inside a div, in both themes
```

Two separate return statements might appear to produce two independent form fields. In reality, both versions return an identical element hierarchy: a container element holding a nested text field. React inspects only the resulting object tree, remaining completely oblivious to the conditional logic that generated it. If the user types a greeting and toggles the theme, the text field retains the draft in both implementations.

### What React does after the click

Here is the precise sequence of operations:
1. The user types a message. The browser stores that text directly inside the live `<textarea>` DOM node.
2. The user clicks the theme button. The state updater toggles `dark` to true, prompting React to queue a re-render (Lesson 13).
3. The component re-executes and evaluates the active branch. It returns a new element tree consisting of a container and a text field.
4. React diffs the new tree against the previous tree. At the root, both trees feature a `<div>`. At the first child slot, both trees feature a `<textarea>`.
5. Because both element slots match in type and default key, React reuses both DOM nodes. It mutates only the class attribute on the outer container, switching it from light to dark.

```tree caption="The previous tree and the new tree after the click on Night mode, compared position by position."
Two trees React puts side by side after the click on `Night mode`
- +The previous render [`<div className="light">` `<textarea />`] | At the top: a **`<div>`** | Its first child: a **`<textarea>`**
- +The new render [`<div className="dark">` `<textarea />`] | At the top: a **`<div>`**, the same type | Its first child: a **`<textarea>`**, the same type
```

How does React pair old elements with new elements? It matches them by **tree position**, meaning their exact structural location within the element hierarchy. Within every parent node, React scans children in sequential order, matching the first child to the first child, and the second child to the second child.

The official documentation conceptualizes tree position as a structural address. It notes: "To React, these two counters have the same 'address': the first child of the first child of the root. This is how React matches them up between the previous and next renders, regardless of how you structure your logic."

Observe what React actually compares. It does not compare the new tree against the browser DOM, nor does it analyze your source code. It compares two trees of JavaScript objects in memory. React modifies the live browser DOM only during the subsequent commit phase (Lesson 13).

### The same `<textarea>` for John and Mia

This behavior frequently surprises developers building production forms. Consider a developer writing separate conditional branches for two different recipients. Each branch returns a `<textarea>` configured with a unique placeholder text. The developer assumes selecting a different recipient renders a fresh, empty text field. It does not. Because both branches place a text field at the exact same tree position, React reuses the existing DOM node. Consequently, the unsent message composed for the first recipient remains in the input field. The official documentation illustrates this exact issue when toggling between two counter components: "You might expect the state to reset when you tick checkbox, but it doesn't!" Principle 4 details the correct remedy.

### The chat page with two `if` branches

Here is the initial implementation of our chat interface. The root component tracks theme state, renders a toggle button, and branches conditionally:

```jsx title="src/App.jsx"
import { useState } from 'react';
import './App.css';

export default function App() {
  const [dark, setDark] = useState(false);

  if (~dark~) { // Night: the same button, a div, and a textarea
    return (
      <>
        <button onClick={() => setDark(!dark)}>Night mode</button>
        <div className="dark">
          <textarea placeholder="Message John" />
        </div>
      </>
    );
  }

  return (
    <>
      <button onClick={() => setDark(!dark)}>Night mode</button>
      <div className="light">
        <textarea placeholder="Message John" />
      </div>
    </>
  );
}
```

```css title="src/App.css"
.light { background: white; color: black; padding: 12px; }
.dark { background: black; color: white; padding: 12px; }
textarea { background: inherit; color: inherit; }
```

The user types `See you at 6` and clicks `Night mode`. The page turns dark, and the draft stays:

```page width=text caption="The chat page with two if branches, after the user types See you at 6 and clicks Night mode: the draft stays."
line: [Night mode]
card: typed=See you at 6 | good=typed
console: quiet
```

The Elements panel shows the same two DOM nodes as before the click:

```dom caption="The Elements panel after the click on Night mode: the same div and the same textarea, with a new class on the div."
<button>Night mode</button>
+ <div class="dark"> | note: The same div: only its class changed from light to dark
  + <textarea placeholder="Message John"></textarea> | note: The same textarea: React did not touch it
</div>
```

The browser developer tools confirm that the DOM nodes were preserved across the theme switch. React never evaluates conditional statements in your code. It inspects only the resulting element tree and matches nodes by position.

---

## PRINCIPLE | `<section>` in place of `<div>`: a different type throws away the DOM node and everything inside it

> [!PRINCIPLE]
> **Principle 2: Type: A Different Type Throws Away the Whole Subtree**
>
> *When the element at a position has a different type than on the previous render, React removes the old DOM node and every node inside it, loses their state, and creates new nodes from scratch.*
>
> A `<section>` and a `<div>` with the same class look the same on the screen. To React, they are the types `'section'` and `'div'`. When the type at a position changes, React does not look inside: it throws away the old wrapper with everything in it. The `<textarea>` inside is built again, empty, and the user loses what they typed.
>
> **DO THIS:**
> ```jsx
> <div className={dark ? 'dark' : 'light'}>
>   ~<textarea />~ {/* The wrapper stays a div: the draft stays */}
> </div>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> {dark
>   ? ~<section className="dark">~<textarea /></section> // **WRONG:** the type changes from div to section and wipes the draft
>   : <div className="light"><textarea /></div>}
> ```

### VS | `<section className="dark">` vs. `<div className="dark">`: the same on the screen, two different types for React

The daytime wrapper remains a `<div className="light">`. Consider two ways to author the nighttime container. Both enclose the identical `<textarea>` and apply the same dark styling class. Their sole difference lies in the HTML tag chosen:

```jsx title="The night wrapper written as a section, and as a div"
<section className="dark"><textarea /></section> {/* After Night mode: the field is empty */}
<div className="dark"><textarea /></div> {/* After Night mode: the draft stays */}
```

Visually, both snippets render an identical dark box containing the same input field. To React, however, they represent two completely different structures. A lowercase JSX tag compiles into an element whose `type` is the tag name string (Lesson 76). The section element carries type `'section'`, whereas the division element carries type `'div'`. During reconciliation, React compares the old element type against the new element type at that position. Because `'section'` does not match `'div'`, the types conflict.

### What React does after the click

Here is the resulting execution flow:
1. The user types a message in the input field nested within the daytime container.
2. The user toggles theme mode, updating state to enable dark styles.
3. The newly generated element tree places a `<section>` at the exact position previously occupied by a `<div>`.
4. Because the element types differ, React unmounts the old container and deletes its entire child hierarchy from the DOM. The unsubmitted text stored inside the text area is destroyed alongside its DOM node.
5. React constructs a brand new `<section>` DOM node and a fresh, empty `<textarea>` node.
6. The browser renders the dark theme, but the user discovers an empty message box.

Notice a subtle trap: the `<textarea>` markup was completely identical in both trees. Why did the text field lose its draft when only its parent changed? React diffs element trees hierarchically from parent to child. When it detects a mismatched type at the container level, it immediately tears down that container along with all nested children. No existing child DOM nodes remain to be preserved.

The React documentation refers to an element and its descendants as a **subtree**. It explains: "when you render a different component in the same position, it resets the state of its entire subtree." Tearing down a parent node automatically discards its entire subtree.

```tree caption="What React does at the wrapper's position when the type changes from div to section."
The wrapper's position after the click on `Night mode`
- +The previous render [`<div className="light">`] | Type **`'div'`** | Holds the `<textarea>` with **`See you at 6`**
- !The new render [`<section className="dark">`] | Type **`'section'`**, a different type | React **removes the div and its whole subtree**, then creates a new section and an **empty `<textarea>`**
```

### The same rule for components

Custom components adhere to this exact same type-matching rule. For a component element like `<Feed />`, the type property holds a reference to the function itself. If a tree position renders `<Feed />` on one pass and `<Profile />` on the next, React unmounts the feed hierarchy and builds the profile from scratch. As the React documentation states: "when you move from rendering `<Feed>` to the `<Profile>` page, React won't attempt to re-use them."

This pattern causes widespread bugs in web applications. Developers frequently alternate container elements across conditions, such as wrapping identical forms inside different semantic tags. The moment condition state toggles, React destroys the wrapper, erasing all form input and nested component state. The documentation highlights this trap with an example counter: "The counter state gets reset when you click the checkbox." Because the parent tag was swapped, React destroyed the entire subtree, wiping the counter component along with its state.

### The chat page with a `<section>` for night

Here is the chat page with this mistake:

```jsx title="src/App.jsx" bad="10"
import { useState } from 'react';
import './App.css';

export default function App() {
  const [dark, setDark] = useState(false);
  return (
    <>
      <button onClick={() => setDark(!dark)}>Night mode</button>
      {dark ? (
        ~<section className="dark">~ {/* **WRONG:** a new type at this position wipes the field inside */}
          <textarea placeholder="Message John" />
        </section>
      ) : (
        <div className="light">
          <textarea placeholder="Message John" />
        </div>
      )}
    </>
  );
}
```

The user types `See you at 6` and clicks `Night mode`. The page turns dark, and the field is empty again:

```page width=text caption="The chat page with a section for night, after the user types See you at 6 and clicks Night mode: the draft is gone."
line: [Night mode]
card: input=Message John | bad=input
console: quiet
```

The Console stays quiet, so nothing tells the developer that the draft was lost. The Elements panel shows two new DOM nodes:

```dom caption="The Elements panel after the click on Night mode: a new section and a new, empty textarea in place of the old div."
<button>Night mode</button>
! <section class="dark"> | note: A new node: the old div was removed
  ! <textarea placeholder="Message John"></textarea> | note: A new, empty textarea: the draft is gone
</section>
```

Because swapping element types is standard reconciliation behavior, the developer console outputs no warning when this occurs. Inspecting the browser developer tools reveals that React mounted brand new DOM nodes. Remember the core rule: changing the element type at any position tears down that DOM node and its entire subtree.

---

## PRINCIPLE | `className` on the same `<div>`: React keeps the DOM node and changes only the `class`

> [!PRINCIPLE]
> **Principle 3: Reuse: The Same Type and Key Keep the DOM Node**
>
> *When the element at a position has the same type and the same key as on the previous render, React keeps the DOM node and changes only the attributes and text that differ; whatever the browser holds in that node stays.*
>
> A re-render makes new React elements, not new DOM nodes. When the wrapper stays a `<div>` and only its `className` changes, React keeps the `<div>` and the `<textarea>` inside it. It changes one attribute, and the user keeps the message they were typing.
>
> **DO THIS:**
> ```jsx
> <div ~className={dark ? 'dark' : 'light'}~> {/* Same type: React changes only the class */}
>   <textarea />
> </div>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> {dark
>   ? ~<section className="dark">~<textarea /></section> // **WRONG:** a new type at the same position rebuilds the field
>   : <div className="light"><textarea /></div>}
> ```

### One `<div>` whose `className` changes

The direct solution to the bug in Principle 2 is straightforward: preserve the identical tag across renders and toggle only its attributes.

```jsx title="One div whose className changes"
<div ~className={dark ? 'dark' : 'light'}~> {/* Night or day: always a div */}
  <textarea />
</div>
```

When the user types a draft and toggles the theme, dark styles apply while the draft text remains visible. At the wrapper position, React observes a `<div>` before the update and a `<div>` afterward. Because only the class attribute changed, React reuses the existing DOM node rather than allocating a new one.

A common misunderstanding is assuming that a component re-render automatically reconstructs the browser DOM. It does not. Re-rendering a component simply evaluates its function to create fresh element descriptor objects in memory (Lesson 54). React then diffs those objects against the prior tree. It reuses every DOM node whose type and key match, patching only modified attributes. As the documentation emphasizes: "React only changes the DOM nodes if there's a difference between renders."

### VS | A `<section>` for night vs. one `<div>`: the same dark colors, only one keeps the draft

Here is the version with a `<section>` for night from Principle 2, next to the fix:

::: row caption="A section for night wipes the draft; one div with a changing className keeps it."
::: col title="A section for night, a div for day" tag="the type changes" tone=bad
```page size=mini
line: [Night mode]
card: input=Message John | bad=input
console: quiet
```
```jsx title="src/App.jsx" bad="2"
{dark
  ? <section className="dark"><textarea /></section>
  : <div className="light"><textarea /></div>}
```
After `Night mode`, the field is empty.
:::
::: col title="One div with a changing className" tag="the type stays div" tone=good
```page size=mini
line: [Night mode]
card: typed=See you at 6 | good=typed
console: quiet
```
```jsx title="src/App.jsx" good="1"
<div className={dark ? 'dark' : 'light'}>
  <textarea />
</div>
```
After `Night mode`, the draft stays.
:::
:::

Both implementations produce identical dark styling on screen, but only one preserves the draft:
1. **Alternating between container tags** changes the element type from `'div'` to `'section'`. React destroys the wrapper and unmounts the text area within it.
2. **Maintaining a single container tag** keeps the element type as `'div'`. React reuses the existing DOM node and updates only its class attribute.

Two distinct outcomes result from preserving that single DOM node:
1. **The draft survives.** The browser preserves input text inside the existing DOM node. Because React never unmounted the text area, user text remains intact.
2. **The appearance updates.** React mutates the class attribute on the preserved container node. The stylesheet then applies the new background and text colors automatically.

The React documentation describes an identical scenario involving an active clock component positioned beside an input field. Because the input element occupies the exact same tree position across each tick, React leaves the input untouched. User text remains intact while the surrounding clock updates continuously.

### The chat page with one `<div>`

We replace the two branches with one `<div>`:

```jsx title="src/App.jsx" good="9"
import { useState } from 'react';
import './App.css';

export default function App() {
  const [dark, setDark] = useState(false);
  return (
    <>
      <button onClick={() => setDark(!dark)}>Night mode</button>
      <div ~className={dark ? 'dark' : 'light'}~> {/* The same div in both themes */}
        <textarea placeholder="Message John" />
      </div>
    </>
  );
}
```

After the user types and clicks `Night mode`, the Elements panel shows the same DOM nodes, with one attribute changed:

```dom caption="The Elements panel after the click on Night mode: the same div with class dark, and the same textarea."
<button>Night mode</button>
+ <div class="dark"> | note: The same div: React changed only its class attribute
  + <textarea placeholder="Message John"></textarea> | note: The same textarea, still holding the draft
</div>
```

Preserving the existing DOM node is the correct behavior for toggling themes, because the user is still composing a message for John. When switching recipients, however, preserving the draft is a serious defect. Resetting DOM state on demand is the job of the `key` prop.

---

## PRINCIPLE | `key={contact}`: a new key at the same position builds a new, empty `<textarea>`

> [!PRINCIPLE]
> **Principle 4: Key: A Different Key Builds a New DOM Node**
>
> *A `key` becomes part of the position; when the type at a position is the same but the key is different, React re-creates the DOM node and resets its state, as it does for a new type.*
>
> Without a key, the `<textarea>` for John and the `<textarea>` for Mia have the same type and the same key, `null`, at the same position. React keeps the DOM node, changes only the placeholder, and John's draft stays in Mia's field. With `key={contact}`, the key changes from `'John'` to `'Mia'`, so React builds a new, empty field for Mia.
>
> **DO THIS:**
> ```jsx
> <textarea ~key={contact}~ placeholder={'Message ' + contact} /> {/* A new key for Mia: a new, empty field */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~<textarea placeholder={'Message ' + contact} />~ {/* **WRONG:** the same field for every contact, so John's draft goes to Mia */}
> ```

### VS | No `key` vs. `key={contact}`: the same field for everyone, or a new field for each contact

We now expand the chat interface to support two recipients. The active recipient is stored in state, controlled by two contact buttons. Consider the message field written with and without a key:

```jsx title="The message field with no key, and with key={contact}"
<textarea placeholder={'Message ' + contact} /> {/* No key: John's draft stays when the user clicks Mia */}
<textarea ~key={contact}~ placeholder={'Message ' + contact} /> {/* key={contact}: Mia gets an empty field */}
```

Suppose the user writes a message to John and then clicks Mia:
1. **Without an explicit key**, the field continues to display the message composed for John. React actually updated the placeholder attribute to reflect Mia, but placeholders are hidden whenever a field contains text. To the user, switching contacts appears to fail silently, leaving John's text in Mia's compose box.
2. **With an explicit key**, the field resets completely, displaying an empty input box with the new placeholder.

Upon initial load, both versions look identical on screen. The crucial divergence occurs when switching contacts. With an explicit key, React treats the input field for John and the input field for Mia as two distinct entities.

### Why John's draft lands in Mia's field

Without a key, the unsent message leaks into Mia's compose area because React reuses the existing DOM node. Here is the exact sequence of events:
1. The user types a message intended for John.
2. The user selects Mia, updating recipient state.
3. The newly generated tree places a `<textarea>` at the identical tree position. Neither element specifies an explicit key, so React evaluates `key` as `null` on both (Lesson 76).
4. Because the type and key match, React preserves the existing DOM node. It updates only the placeholder attribute.
5. The user is now looking at John's draft text inside a compose box addressed to Mia.

This scenario mirrors the conditional branch problem explored in Principle 1. The React documentation notes this exact pitfall in a messaging interface: "the input state is preserved because the `<Chat>` is rendered at the same position in the tree."

### A key becomes part of the position

Assigning a key solves this problem completely. As the React documentation explains: "Specifying a `key` tells React to use the `key` itself as part of the position, instead of their order within the parent." React pairs elements using both tree position and key:
1. Prior to clicking Mia, the text field element carries the key `'John'`.
2. After selecting Mia, the element at that same position carries the key `'Mia'`.
3. Although the tag type matches, the keys differ. React reacts exactly as it does for a type mismatch: it unmounts the previous text area and creates a fresh, empty one.

The React documentation calls this process **re-creating** the DOM node: constructing a fresh node rather than reusing an existing one. In their words: "React will also re-create the DOM elements instead of reusing them." In our chat interface: "Now switching the recipient always clears the text field."

```tree caption="What React does with the message field when the user clicks Mia, with no key and with key={contact}."
The message field after the click on `Mia`
- !With no `key` [`<textarea placeholder={'Message ' + contact} />`] | Key **`null`** before and after the click | React **keeps the DOM node** and changes only the placeholder: **John's draft stays**
- +With `key={contact}` [`<textarea key={contact} />`] | Key **`'John'`** before, **`'Mia'`** after | React **re-creates the DOM node**: Mia gets an **empty field**
```

Here is the Elements panel after the click on `Mia`, with no key and with the key:

::: row caption="The Elements panel after the click on Mia: no key keeps the same textarea; key={contact} puts a new one in its place."
::: col title="With no key" tag="the same node" tone=bad
```dom
<div class="light">
  ! <textarea placeholder="Message Mia"></textarea> | note: The same textarea: only the placeholder changed
</div>
```
:::
::: col title="With key={contact}" tag="a new node" tone=good
```dom
<div class="light">
  + <textarea placeholder="Message Mia"></textarea> | note: A new textarea, created for Mia
</div>
```
:::
:::

In browser developer tools, the markup looks similar because keys are not HTML attributes and never appear on DOM nodes. React reserves keys internally solely for reconciliation comparisons (Lesson 18).

Keep in mind one crucial detail: if the user switches back to John, the key changes again, prompting React to create yet another fresh DOM node. John's original draft does not magically reappear, because the previous DOM node was discarded. If an application requires preserving draft messages per recipient across switches, those drafts must be stored in parent component state (Lesson 25).

### The chat page with `key={contact}`

`App` now keeps the contact in state, and the message field gets `key={contact}`:

```jsx title="src/App.jsx" good="14"
import { useState } from 'react';
import './App.css';

export default function App() {
  const [dark, setDark] = useState(false);
  const [contact, setContact] = useState('John');
  return (
    <>
      <button onClick={() => setContact('John')}>John</button>
      <button onClick={() => setContact('Mia')}>Mia</button>
      <button onClick={() => setDark(!dark)}>Night mode</button>
      <div className={dark ? 'dark' : 'light'}>
        <textarea
          ~key={contact}~ // A new key for each contact: a new, empty field
          placeholder={'Message ' + contact}
        />
      </div>
    </>
  );
}
```

The user types `See you at 6` to John:

```page width=text caption="The chat page while the user writes to John."
line: [John] [Mia] [Night mode]
card: typed=See you at 6 | good=typed
console: quiet
```

Then the user clicks `Mia`, and Mia gets an empty field:

```page width=text caption="The chat page after the click on Mia: an empty field that says Message Mia."
line: [John] [Mia] [Night mode]
card: input=Message Mia | good=input
console: quiet
```

Remember: when you need a form element to reset its internal state cleanly for a new identity, assign it a unique key.

---

## All 4 Principles Together

### The complete files

The wrapper element remains a `<div>` across both themes, ensuring theme toggles preserve unsubmitted drafts. The text area specifies `key={contact}`, ensuring each recipient receives a fresh compose field:

```jsx title="src/App.jsx"
import { useState } from 'react';
import './App.css';

export default function App() {
  const [dark, setDark] = useState(false);
  const [contact, setContact] = useState('John');
  return (
    <>
      <button onClick={() => setContact('John')}>John</button>
      <button onClick={() => setContact('Mia')}>Mia</button>
      <button onClick={() => setDark(!dark)}>Night mode</button>
      <div ~className={dark ? 'dark' : 'light'}~> {/* Principles 2 and 3: the same type in both themes, so the draft stays */}
        <textarea
          ~key={contact}~ // Principle 4: a new key for each contact, so a new, empty field
          placeholder={'Message ' + contact}
        />
      </div>
    </>
  );
}
```

```css title="src/App.css"
.light { background: white; color: black; padding: 12px; }
.dark { background: black; color: white; padding: 12px; }
textarea { background: inherit; color: inherit; }
```

### How React checks each position

Following every state update, React diffs the new element tree against the previous tree position by position, executing the exact same checks in order:

```tree dir=right caption="The order in which React decides what to do with the DOM node at each position after a re-render."
How React decides at each position
- +1. Pair by position | React pairs each new element with the old element at the **same position**, by **order inside the parent**
- +2. Check the type | A **different type**: React removes the old node and **its whole subtree**, and creates new ones
- +3. Check the key | The same type but a **different key**: React **re-creates the node**, as for a new type
- +4. Keep the node | **Same type and same key**: React **reuses the DOM node** and changes **only what differs**
```

Here is the finished chat page across three actions. First, the user types to John:

```page width=text size=mini caption="The finished chat page after the user types See you at 6 to John."
line: [John] [Mia] [Night mode]
card: typed=See you at 6 | good=typed
console: quiet
```

Then the user clicks `Night mode`. The page turns dark, and the draft stays:

```page width=text size=mini caption="The finished chat page after the click on Night mode: the draft stays."
line: [John] [Mia] [Night mode]
card: typed=See you at 6 | good=typed
console: quiet
```

Then the user clicks `Mia`, and the field is empty:

```page width=text size=mini caption="The finished chat page after the click on Mia: an empty field for Mia."
line: [John] [Mia] [Night mode]
card: input=Message Mia | good=input
console: quiet
```

### What the user does, and what React does

| What the user does | What changes in the new tree | What React does | What the user sees |
| :--- | :--- | :--- | :--- |
| **Clicks `Night mode`, with two `if` branches** | Nothing at the field's position: still a `<textarea>` inside a `<div>` | Keeps both DOM nodes and changes the `class` of the `<div>` | The draft stays |
| **Clicks `Night mode`, with a `<section>` for night** | The wrapper's type changes from `'div'` to `'section'` | Removes the wrapper and its whole subtree, and creates new nodes | The draft is gone |
| **Clicks `Night mode`, with one `<div>`** | Only the `className` of the `<div>` | Keeps both DOM nodes and changes one attribute | The draft stays |
| **Clicks `Mia`, with no `key`** | Only the `placeholder` of the `<textarea>` | Keeps the `<textarea>` and changes its placeholder | John's draft stays in Mia's field |
| **Clicks `Mia`, with `key={contact}`** | The key of the `<textarea>` changes from `'John'` to `'Mia'` | Re-creates the `<textarea>` | Mia gets an empty field |

Remember the core lesson of reconciliation. **React compares elements position by position across renders. Matching types and keys preserves the existing DOM node, while differing types or keys create a fresh node.**

---

## For the Interview

> **The Interview Question:** When React re-renders, how does the reconciliation algorithm decide which DOM nodes to update?

### How to Answer Clearly in 30 Seconds

"During a re-render, React compares the newly returned element tree against the previous tree in memory rather than reading the live DOM. This diffing algorithm is called reconciliation. React matches elements by tree position based on child order within each parent container. At each position, it evaluates two properties:
1. **The type**: When the element type changes, React destroys the old DOM node along with its entire subtree and state, constructing fresh nodes.
2. **The key**: When the type matches but the key differs, React treats the element as a distinct entity, unmounting the old node and building a new one.

When both type and key match, React reuses the existing DOM node, patching only changed attributes or text. In practice, I maintain consistent tags to preserve user input, and provide explicit keys when an element must reset for a new identity."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Does React compare the new render with the real DOM, node by node?"**
   **No.** React compares two in-memory trees of JavaScript element descriptors: the newly returned tree against the previous render's tree. At each position, React checks only the element type and key, skipping branches whose inputs have not changed. Reading or writing the real DOM is expensive, whereas diffing lightweight JavaScript objects in memory is extremely fast. React touches the live browser DOM only during the commit phase, modifying strictly what changed. The internal data structures React uses to traverse and manage this work are called Fibers (Lesson 78).
2. **"Why does a component defined inside another component lose what the user typed on every render?"**
   Because its component type changes on every single render. Each time the outer parent component re-renders, JavaScript evaluates the inner function declaration, creating a brand new function reference in memory. The React documentation notes: "a *different* `MyTextField` function is created for every render of `MyComponent`." When React reconciles that position, it sees a new function reference as the element `type`. Because the type changed, React tears down the previous DOM nodes and resets their state completely (Lesson 04). The remedy is to always declare components at the top level of the module.
3. **"What happens if you write `key={Math.random()}`?"**
   React generates a completely new key on every render, ensuring the key never matches the previous value. Consequently, React destroys and recreates the DOM nodes on every update, causing input fields to lose typed text and focus. The official documentation warns: "This will cause keys to never match up between renders, leading to all your components and DOM being recreated every time." A key must remain stable and predictable for a given item, such as an entity ID. Keys must be unique among immediate siblings: "They only specify the position *within the parent*." In dynamic lists, stable keys enable React to track reordered, inserted, or deleted items efficiently (Lesson 61).

```tree caption="Interview summary: what the type and the key decide at each position on a re-render."
What decides whether React keeps a DOM node
- +Same type and same key [`<div className="dark">` after `<div className="light">`] | React **reuses the node** | Only the **changed attributes** are updated; typed text **stays**
- !Different type [`<section>` after `<div>`] | React **destroys the node and its subtree** | New nodes are created; typed text is **gone**
- !Same type, different key [`key="Mia"` after `key="John"`] | React **re-creates the node** | A new, **empty** field; its state is **reset**
```
