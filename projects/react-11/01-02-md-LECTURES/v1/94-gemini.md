# Lecture 94: How One Shared Button Becomes a Link Without Losing Its Types

*(How can one Button component become a button on one tag and a link on another, and still check every attribute?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | How do you build polymorphic components with the as prop in TypeScript?

---

## VS | One props type for both tags vs. `ComponentPropsWithoutRef<E>`: both render the same tags, only `E` refuses `disabled` on a link

> In standard HTML, a button triggers an in-page action, while an anchor navigates to a new destination. Web applications often require both elements to display identical visual styling. **A polymorphic component lets the caller choose the rendered tag with a single prop, conventionally named `as`**. When you type this tag using a generic parameter, TypeScript validates only the valid HTML attributes for that specific element. It rejects attributes like `disabled` on an anchor, which browsers quietly ignore at runtime.

Consider native HTML semantics first. An online shopping cart page typically places two primary controls side by side:
1. **Clear cart** empties the current shopping cart. Because this executes an in-page command, it must render as a `<button>`.
2. **Checkout** transfers the customer to the payment gateway. Because this represents navigation to a new location, it must render as an `<a>` element with an `href` attribute.

The official web platform standards strictly distinguish between these controls. You should only use an anchor element for navigation to a distinct URL, and use a button element for immediate client actions.

Design specifications often dictate that both interactive controls share identical visual prominence, such as a filled pill button. In an earlier lesson, we created a reusable `Button` component to centralize CSS class names across an application (Lesson 90). That basic component always returns a native button element. To render an anchor with identical button styling, our component must dynamically switch its underlying HTML tag.

A polymorphic component solves this architectural challenge through an extra prop, conventionally named `as`:

```tsx title="One shared Button, two tags"
<Button onClick={() => setCount(0)}>Clear cart</Button> {/* No as: React creates a <button>, and the click empties the cart */}
<Button ~as="a"~ href="/checkout">Checkout</Button> {/* as="a": React creates an <a>, and the click opens /checkout */}
```

A single React component produces two distinct DOM elements in the browser: an interactive button element for Clear cart, and a native anchor element for Checkout. The `as` prop controls the rendered tag. Both controls display the same visual design because the component attaches the shared CSS classes to whichever tag it creates.

### Dynamic Element Creation in Plain JavaScript

How can a single component generate different HTML tags? In native browser JavaScript, `document.createElement` accepts a string variable containing the tag name:

```js title="Plain JavaScript: the tag name is a string in a variable"
const tag = 'a';
const link = ~document.createElement(tag)~; // Creates an <a>, because tag holds 'a'
```

React operates on the identical foundational principle. Although modern code relies on JSX syntax, the compiler translates every JSX tag into a call to React element creation factory (Lesson 76). When the tag name is stored inside a variable, React instantiates the element matching that string.

At runtime, a polymorphic component executes this exact dynamic lookup. It extracts the desired tag string from the `as` prop and supplies that string to React during rendering.

> [!DEFINITION]
> **What is a polymorphic component?** [NEW] A polymorphic component is a reusable component whose rendered host element or component can be chosen by the caller at the call site.
> 1. The component accepts a prop such as `as`, which specifies the underlying HTML tag or React component to render.
> 2. The component reads this prop at runtime and mounts the requested element while applying shared design tokens, classes, and behaviors.
> 3. The name `as` is an established community convention rather than an internal React keyword, meaning React treats it as an ordinary prop (Lesson 94).

> [!DEFINITION]
> **What is a type parameter?** [REVIEW] A type parameter is a placeholder variable for a data type, declared inside angle brackets such as `<E>` or `<T>`.
> 1. It enables a component or function to operate flexibly across diverse data structures without sacrificing type safety.
> 2. Rather than hardcoding a single fixed type, TypeScript assigns the parameter dynamically based on the arguments or props supplied by the caller.
> 3. This mechanism allows the compiler to enforce strict property validation tailored to each distinct invocation (Lesson 93).

> [!DEFINITION]
> **What are rest props?** [REVIEW] Rest props collect all remaining, unextracted properties from a props object into a single container object using the JavaScript rest operator.
> 1. In a signature like `{ variant, ...rest }`, the component isolates its custom flags and groups all standard HTML attributes into `rest`.
> 2. Using JSX spread syntax like `{...rest}` forwards those collected attributes directly onto the rendered underlying element.
> 3. This ensures that standard attributes such as event handlers, accessibility tags, and links pass through to the DOM without requiring manual property mapping (Lesson 90).

### Validating Attributes Across Different Elements

Suppose the shopping cart is empty, and an engineer attempts to disable the Checkout action. They add a `disabled` attribute directly to the Checkout element:

```tsx title="The Checkout link with disabled"
<Button as="a" href="/checkout" ~disabled={count === 0}~>Checkout</Button> {/* One props type accepts this line, the other refuses it */}
```

Whether TypeScript permits this markup depends entirely on how the component types are constructed. Teams commonly implement this typing in one of two ways:
1. **A merged intersection props type.** The type unions or intersects the HTML attributes of `<button>` and `<a>`. Under this configuration, the compiler permits any attribute valid on either element.
2. **A polymorphic generic props type.** The props dynamically resolve to match only the element specified by `as`. Because native anchor elements lack a `disabled` property, the compiler flags the attribute immediately.

When using the polymorphic type, the TypeScript compiler highlights the invalid property with a type error:

```text title="The editor's message under the polymorphic props type"
Property 'disabled' does not exist on type ...
```

Both typing strategies produce identical DOM output in the running application because TypeScript erases all type definitions during compilation (Lesson 90). The crucial distinction lies in compile-time verification. Only the polymorphic type enforces that an anchor element cannot accept a button-specific disabled state.

```tree caption="Two props types for one shared Button: both render the same tags, but only one refuses disabled on the link."
Two ways to type one shared `Button`
- !One props type for both tags [`as?: 'a' | 'button'`] | Every tag accepts **the attributes of both tags** | `disabled` on the link **passes with no error**
- +A polymorphic props type [`as?: E`] | Each tag accepts **only the attributes of the tag `as` names** | `disabled` on the link is **refused before the code runs**
```

### The Silent Defect of Disabled Anchors

Merging props across multiple elements introduces severe silent runtime bugs. In an online store, this defect allows a customer to submit an order with zero items:
1. The engineering team defines a loose props type containing attributes for both buttons and links.
2. A developer attaches `disabled={count === 0}` to the Checkout anchor.
3. Because the loose type permits button attributes, TypeScript issues no warning.
4. The shopper clicks Clear cart, updating component state to zero items.
5. The shopper clicks Checkout. The browser processes navigation immediately, redirecting to payment with an empty cart.

This failure occurs because web browsers ignore the `disabled` attribute on anchor elements. The HTML specification dictates that if an element does not support the disabled property, the attribute has no runtime effect.

Only seven HTML elements support native disabling: button, fieldset, optgroup, option, select, textarea, and input. Standard anchor tags are completely absent from this specification list.

Consequently, the anchor element remains fully interactive and keyboard-focusable. Furthermore, CSS styling defined with the `:disabled` pseudo-class never applies to an anchor tag. The link remains visually active, accepts user clicks, and executes browser navigation despite the developer's intent.

### The Dual Responsibility of the as Prop

**The `as` prop governs two synchronized layers: the runtime DOM element React mounts, and the compile-time attributes TypeScript validates.** The runtime layer relies on standard JavaScript dynamic element instantiation. The compile-time layer uses a generic type parameter that TypeScript resolves from the value passed to `as`.

Building polymorphic components requires avoiding five common pitfalls:
1. **Treating `as` as a built-in React keyword.** React does not recognize `as` as a special property. Our component receives it as an ordinary prop and decides how to process it.
2. **Rendering the lowercase prop identifier directly as `<as>`.** JSX treats lowercase tags as literal HTML element strings, prompting React to create an unrecognized `<as>` DOM node.
3. **Merging attribute types into an unconstrained intersection.** Combining properties from multiple elements allows invalid combinations, such as `disabled` on an anchor or `href` on a button.
4. **Omitting the default generic fallback.** Failing to assign a default tag to the generic type parameter leaves unannotated buttons typed against unconstrained elements, removing attribute checks.
5. **Confusing the `as` prop with the TypeScript `as` operator.** The `as` prop is a runtime JavaScript variable, whereas the TypeScript `as` operator is a compile-time type assertion (Lesson 93).

Production design systems typically evaluate four distinct strategies to share styling between buttons and links:

```tree caption="Four ways to give a button and a link the same look, and when each one fits."
Four ways to make one look serve a button and a link
- +Two components [`Button` `LinkButton`] | Fits **one or two links** | Every change to the look is **made twice**
- !One props type for both tags [`as?: 'a' | 'button'`] | Fits **no case well** | `disabled` on a link and `href` on a button **both pass**
- +An `as` prop with a type parameter [`as?: E`] | Fits **several tags or a router Link** | Each tag gets **only its own attributes**
- +A union chosen by `href` [`href: string`] | Fits **exactly two forms** | A link when `href` is passed, **a button otherwise**
```

The official documentation codebase for React sometimes uses untyped declarations, such as typing a heading component prop with `as?: any`. While this sidesteps compiler setup, it forfeits all compile-time attribute verification.

The remainder of this lesson constructs the generic `as` pattern, followed by the discriminated union pattern, using an interactive checkout page.

## SECTION | A Cart Page With Clear Cart and Checkout

We demonstrate these techniques by building an e-commerce shopping cart interface. When mounted, the application displays an item counter, an outlined Clear cart button, and a filled Checkout link styled as a button:

```page caption="The cart page when it opens: two items, the Clear cart button, and the Checkout link."
line: Cart: 2 items
form:
  button: Clear cart
  button: Checkout
console: quiet
```

When the customer activates Clear cart, the counter updates to zero items. By the conclusion of this chapter, an empty cart transforms the Checkout link into a disabled button with identical primary styling:

```page caption="The finished page after the user clicks Clear cart: no items, and Checkout is a disabled button."
line: Cart: 0 items
form:
  button: Clear cart
  button: Checkout | | disabled
console: quiet
```

Our project uses the standard TypeScript configuration established earlier (Lesson 90). The application contains two primary source files:

```files title="cart-page: File Explorer" caption="Our project files: App.tsx is the cart page, and Button.tsx is the shared button."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.tsx | boundary | Imports `App` from `./App` and mounts it into `#root`
  index.css | styles | Draws `.primary` as a filled button and `.secondary` as an outlined button
  App.tsx | parent | Exports `App` as default, holds `count`, and imports `Button`
  Button.tsx | default export | Exports `Button` as default: one look, a `<button>` or an `<a>`
```

**PRINCIPLES:** The `as` prop determines the runtime HTML tag, while the generic parameter controls attribute checking. Three fundamental principles guide this architecture:
1. **Principle 1: An uppercase variable renders the tag named by `as`.** The component assigns `as` to a capitalized identifier and renders that identifier in JSX.
2. **Principle 2: `ComponentPropsWithoutRef<E>` binds attributes directly to the chosen element.** TypeScript derives the tag type from the chosen element, ensuring that links accept `href` and reject `disabled`.
3. **Principle 3: A discriminated union selects tags automatically using `href`.** When a component supports exactly two tag variations, the presence of `href` distinguishes links from buttons without requiring `as`.

---

## PRINCIPLE | `const Component = as ?? 'button'`: React creates the tag that `as` names

> [!PRINCIPLE]
> **Principle 1: The `as` Prop: `Component` with a Capital C Creates the Tag That `as` Names**
>
> *Read the tag name from a prop such as `as`, keep it in a variable that starts with a capital letter, and write that variable as the JSX tag.*
>
> React does not inspect the `as` property automatically. Our component intercepts this prop and reassigns it to an uppercase local identifier, such as `Component`. JSX compilers interpret capitalized identifiers as dynamic variable lookups, translating `<Component>` into a function call with the string value stored in the variable. If you write the lowercase identifier `<as>`, JSX interprets the tag as a literal HTML element name, emitting an unknown `<as>` tag into the DOM.
>
> **DO THIS:**
> ```jsx
> function Button({ as, ...rest }) {
>   const ~Component~ = as ?? 'button'; // Capital C: React creates the tag that as names
>   return <Component {...rest} />;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function Button({ as, ...rest }) {
>   return <~as~ {...rest} />; // **WRONG:** lowercase as is a tag name, so React creates an element named as
> }
> ```

Before inspecting type safety rules, examine the runtime execution model in plain JavaScript.

### Variable Identifiers in JSX Tags

Assigning an element name string to a capitalized variable allows JSX to render that tag dynamically:

```jsx title="A variable that holds 'a', written as a tag, and a plain <a>"
const Component = 'a';

<~Component~ href="/checkout">Checkout</Component> {/* Component holds 'a': React creates an <a> */}
<~a~ href="/checkout">Checkout</a> {/* The same <a> */}
```

Both JSX lines compile to identical element factory invocations with the anchor tag string (Lesson 76).

This behavior stems from the JSX language syntax specification:
- **An uppercase initial letter**, such as `Component`, instructs the compiler to resolve a JavaScript variable in local scope.
- **A lowercase initial letter**, such as `a`, instructs the compiler to treat the identifier as a literal HTML string.

When React receives a string identifier, it instructs the browser to instantiate the corresponding built-in DOM element.

### Extracting the Element Name from the as Prop

Next, receive that tag string dynamically through component props. The parent passes `as="a"`, and the component stores the value in a capitalized variable:

```jsx title="Button reads the tag name from as"
function Button({ ~as~, ...rest }) { // as is a prop like any other: Button reads it, React never does
  const ~Component~ = as ?? 'button'; // 'a' when the page writes as="a", 'button' when it writes no as
  return <Component {...rest} />;
}
```

The return statement does not hardcode an anchor tag or a button tag. The Checkout control mounts as an anchor element through three sequential runtime steps:
1. The caller specifies `as="a"` on the Checkout tag. React builds the props object where `as` contains `'a'`.
2. The component copies that value into `Component`. When Clear cart passes no `as` prop, the nullish coalescing operator defaults the tag to `'button'` (Lesson 33).
3. The JSX compiler converts `<Component {...rest} />` into an element factory call, mounting a native anchor tag.

Additional attributes forward automatically. The `href` attribute resides inside `rest`, and object spread syntax places it onto the rendered anchor element (Lesson 90).

Remember that `as` is a community convention rather than an engine feature. The official React documentation uses this exact pattern for heading components that accept `as="h1"`.

### Why the Tag Identifier Requires Uppercase Casing

It is tempting to bypass the intermediate variable and place the lowercase prop identifier directly in JSX:

```jsx title="The prop itself written as the tag"
function Button({ as, ...rest }) {
  return <~as~ {...rest} />; // **WRONG:** a lowercase name is a tag name, so React creates an element named as
}
```

Although `as` holds the string `'a'`, this code fails to render a link. The application renders plain unstyled text, and clicking Checkout fails to navigate:
1. In TypeScript files, the compiler rejects `<as>` because the element name does not exist in `JSX.IntrinsicElements`.
2. In untyped JavaScript files, compilation succeeds silently. JSX treats lowercase identifiers as literal tag names rather than variable references (Lesson 04).
3. React commands the browser to mount an element named `as`. Because browsers do not recognize this tag, they display inner text as unstyled inline text.
4. When the user clicks Checkout, navigation fails because custom unknown elements lack hyperlink behavior.
5. React logs a diagnostic warning to the browser console.

```page width=full caption="The cart page when Button writes <as> as the tag: both controls are plain text, and React warns in the Console."
line: Cart: 2 items
line: Clear cartCheckout | bad
console: The tag <as> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
```

Lowercase identifiers indicate literal tags, while uppercase identifiers indicate variable references. That rule requires naming the local variable `Component` with an uppercase initial letter.

### VS | The as Prop vs. TypeScript's as Assertion Operator

TypeScript contains an independent keyword named `as`, which has no relationship to component props:

```tsx title="The as prop, and TypeScript's as keyword"
<Button ~as="a"~ href="/checkout">Checkout</Button> {/* A prop: Button reads its value in the browser */}
const user = data ~as User~; // A type assertion: only the editor reads it, and it is removed before the code runs
```

These constructs share an identical keyword name but perform completely different roles:
- **The `as` prop** is a runtime JavaScript variable read by our component during element rendering.
- **The `as` keyword** is a compile-time type assertion instructing the compiler to assume a specific type (Lesson 93). It is completely erased before execution.

### Implementing Step 1 on the Cart Page

Our button component starts from the base implementation established in Lesson 90. It receives the `as` prop, falls back to a button default, and renders through the capitalized variable:

```tsx title="src/Button.tsx"
import type { ComponentPropsWithoutRef } from 'react';

type ButtonProps = {
  ~as?: 'a' | 'button'~; // The page names the tag, or writes nothing
  variant?: 'primary' | 'secondary';
} & ComponentPropsWithoutRef<'button'> & ComponentPropsWithoutRef<'a'>; // The attributes of both tags, on every tag

export default function Button({ as, variant = 'primary', ...rest }: ButtonProps) {
  const ~Component~ = as ?? 'button'; // No as on the tag: a <button>
  return <Component className={variant} {...rest} />;
}
```

Three elements in this type definition warrant close attention:
- **`import type`** imports type definitions exclusively. The compiler erases this statement entirely during the build step.
- **`ComponentPropsWithoutRef<'button'>`** extracts all standard HTML button attributes from React types, omitting the `ref` prop.
- **`&`** combines multiple types into an intersection type. The resulting props object must satisfy every conjoined type interface.

This initial type gives every button instance the attributes of both anchors and buttons. While flexible, this loose typing introduces safety hazards examined in Principle 2.

The shopping cart parent component tracks item quantities in state and renders both controls:

```tsx title="src/App.tsx"
import { useState } from 'react';
import Button from './Button';

export default function App() {
  const [count, setCount] = useState(2);

  return (
    <>
      <p>Cart: {count} items</p>
      <Button variant="secondary" onClick={() => setCount(0)}>Clear cart</Button>
      <Button ~as="a"~ href="/checkout">Checkout</Button> {/* React creates an <a> with the primary class */}
    </>
  );
}
```

On initial mount, the interface displays two items alongside the Clear cart and Checkout controls:

```page caption="The cart page of step 1 when it opens."
line: Cart: 2 items
form:
  button: Clear cart
  button: Checkout
console: quiet
```

Inspecting the DOM confirms that one component renders two distinct HTML tags:

```dom caption="The Elements panel: one Button creates a button for Clear cart and a link for Checkout."
<div id="root">
  <p>Cart: 2 items</p>
+ <button class="secondary">Clear cart</button> | note: Button with no as
+ <a class="primary" href="/checkout">Checkout</a> | note: Button with as="a"
</div>
```

When the user activates Clear cart, the counter updates to zero items. In this unrefined implementation, Checkout remains an active link that continues to open the checkout route:

```page caption="The same page after the user clicks Clear cart: Checkout is still a link."
line: Cart: 0 items
form:
  button: Clear cart
  button: Checkout
console: quiet
```

### Anti-Pattern: Faking Native Semantics with Mismatched Tags

Without polymorphic components, developers often attempt to achieve visual uniformity by attaching foreign behaviors to the wrong HTML tags:

```tsx title="Two fake controls"
<~button~ onClick={() => { window.location.href = '/checkout'; }}>Checkout</button> {/* **WRONG:** a button that acts as a link */}
<~a href="#"~ onClick={() => setCount(0)}>Clear cart</a> {/* **WRONG:** a link that acts as a button */}
```

Both workarounds compromise accessibility and browser utility:
1. **Buttons acting as links** lack destination URLs. Users cannot open links in background tabs, copy target addresses, or create bookmarks.
2. **Links acting as buttons** abuse anchor tags with empty hash fragments. Assistive tools announce navigation instead of an interactive command.

Using empty fragment links breaks browser history, scrolls the page to the top, and confuses screen reader users. The `as` prop preserves valid platform semantics while applying uniform design styles.

---

## PRINCIPLE | `ComponentPropsWithoutRef<E>`: each tag accepts only the attributes of the tag `as` names

> [!PRINCIPLE]
> **Principle 2: Polymorphic Props: `ComponentPropsWithoutRef<E>` Gives `as="a"` the Attributes of `<a>`**
>
> *Make the tag a type parameter, `E extends ElementType = 'button'`, type the prop as `as?: E`, and take the attributes from `ComponentPropsWithoutRef<E>`.*
>
> One props type for both tags accepts `disabled` on a link. The browser ignores it there, so the user checks out an empty cart. With `E`, TypeScript fills in the tag from `as` at each tag, so a link accepts `href` and refuses `disabled`. The default `= 'button'` gives a `Button` with no `as` the attributes of `<button>`. Without the default, such a `Button` accepts any prop.
>
> **DO THIS:**
> ```tsx
> type ButtonProps<E extends ElementType> = { as?: E } & ComponentPropsWithoutRef<E>;
>
> export default function Button<E extends ElementType ~= 'button'~>({ as, ...rest }: ButtonProps<E>) { // Each tag gets only its own attributes
>   const Component = as ?? 'button';
>   return <Component {...rest} />;
> }
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> type ButtonProps = { as?: 'a' | 'button' } & ~ComponentPropsWithoutRef<'button'> & ComponentPropsWithoutRef<'a'>~; // **WRONG:** every tag accepts both lists, so disabled passes on a link
> ```

When the cart empties, a developer writes `disabled={count === 0}` on the Checkout anchor. Under the loose intersection type, the compiler issues no error.

That loose type conflates the properties of both elements. A single component call renders exactly one element at runtime. The props interface must validate only the attributes supported by that chosen element.

### VS | Merged Attributes vs. Generic Element Discrimination

Compare the static intersection type against a generic polymorphic definition:

```tsx title="One props type for both tags"
type ButtonProps = { as?: 'a' | 'button' } & ComponentPropsWithoutRef<'button'> & ComponentPropsWithoutRef<'a'>; // Every tag accepts href and disabled
```

```tsx title="One props type per tag, filled in from as"
type ButtonProps<~E extends ElementType~> = { ~as?: E~ } & ComponentPropsWithoutRef<E>; // Each tag accepts only the attributes of the tag as names
```

The generic polymorphic definition introduces three technical mechanisms:
- **`E`** represents a generic type parameter resolved independently at each call site (Lesson 93).
- **`ElementType`** is React's built-in type for all valid tag strings and components. The constraint `E extends ElementType` ensures that callers supply valid renderable targets.
- **`ComponentPropsWithoutRef<E>`** dynamically retrieves the exact attribute catalog for element `E`, excluding `ref`.

When a caller supplies `as="a"`, TypeScript resolves the prop types in four distinct phases:
1. The developer writes `as="a"` on the component tag.
2. Because the tag prop is typed as `E`, TypeScript binds the parameter to the literal string `'a'` for that call site.
3. The helper `ComponentPropsWithoutRef<E>` evaluates directly to the attributes of native anchor elements.
4. The compiler accepts the `href` attribute and rejects the unsupported `disabled` attribute.

While both definitions generate identical JavaScript at runtime, the generic polymorphic type enforces compile-time attribute safety. It rejects `disabled` on links and rejects `href` on standard buttons.

```tree caption="How TypeScript gives Button as a the attributes of a link: as fills in E, and E picks the attributes."
How `<Button as="a">` gets the attributes of `<a>`
- +1. The page writes `as="a"` [`as?: E`] | TypeScript fills **`E` with `'a'`** for this tag only
- +2. `E` picks the attributes [`ComponentPropsWithoutRef<E>`] | The tag accepts **the attributes of `<a>`**
- +3. The editor reads the tag [`href` `disabled`] | `href` **passes** | `disabled` is **refused**
```

The `as` prop selects the runtime DOM element while simultaneously selecting the compile-time attribute interface.

### The Necessity of the Default Generic Argument

When a caller renders Clear cart without specifying `as`, no value exists to bind type parameter `E`. **Omitting a default type argument causes unannotated buttons to accept arbitrary invalid props:**

```tsx title="A type parameter with no default"
export default function Button<~E extends ElementType~>({ as, variant = 'primary', ...rest }: ButtonProps<E>) { // **WRONG:** no default for E
  const Component = as ?? 'button';
  return <Component className={variant} {...rest} />;
}
```

```tsx title="A Button with no as, under the type with no default"
<Button onClick={() => setCount(0)}>Clear cart</Button> {/* Passes */}
<Button href="/checkout" ~foo="bar"~>Checkout</Button> {/* Passes too: no error for href, and none for foo */}
```

This permissive failure occurs through a specific type resolution path:
1. The call site provides no `as` prop, leaving `E` unbound.
2. In the absence of a default type, TypeScript falls back to the broad constraint `ElementType`.
3. Because `ElementType` encompasses every possible component and element, TypeScript cannot establish an attribute whitelist, disabling validation.

To enforce strict validation, assign a default type argument by appending `= 'button'` to the generic parameter declaration:

```tsx title="A type parameter with the default 'button'"
export default function Button<E extends ElementType ~= 'button'~>({ as, variant = 'primary', ...rest }: ButtonProps<E>) { // No as on the tag: E is 'button'
  const Component = as ?? 'button';
  return <Component className={variant} {...rest} />;
}
```

With this default established, Clear cart validates properly, while invalid attributes like `href` or `foo` trigger immediate compiler errors:

```text title="The editor's message under the default 'button'"
Property 'href' does not exist on type ...
```

The compiler enforces native button attributes whenever the caller omits `as`.

### VS | Defaulting in Function Arguments vs. Defaulting in the Body

The official React documentation site provides a heading component that assigns defaults inside parameter destructuring using `as: Component = 'div'`. That pattern compiles only because the site types `as` with `any`. In strictly typed TypeScript, destructuring defaults fail:

```tsx title="The default tag in the parameter list"
export default function Button<E extends ElementType = 'button'>({ ~as: Component = 'button'~, variant = 'primary', ...rest }: ButtonProps<E>) { // **WRONG:** Type '"button"' is not assignable to type 'E'.
  return <Component className={variant} {...rest} />;
}
```

```tsx title="The default tag in the body"
const ~Component~ = as ?? 'button'; // Passes: the same tag in the browser
```

Both patterns produce identical runtime output, but parameter destructuring defaults fail compiler validation:
1. The type default `= 'button'` applies only when the caller omits `as` entirely.
2. The component implementation body must remain valid for every possible subtype of `E`, including `'a'`.
3. Assigning the string literal `'button'` to a parameter typed as generic `E` violates type soundness because the parameter might resolve to an anchor tag.

TypeScript reports this exact contradiction in its compiler diagnostic:

```text title="The second line of the editor's message"
'"button"' is assignable to the constraint of type 'E', but 'E' could be instantiated with a different subtype of constraint 'ElementType'.
```

Assigning the variable in the function body avoids this error. The variable `Component` holds whichever concrete value arrives at runtime.

### Event Types and Autocompletion Synchronize with the Tag

Event callbacks typed against the component automatically reflect the underlying element (Lesson 91). Inside an anchor click handler, `e.currentTarget` refers to an HTML anchor element containing an `href` property:

```tsx title="e.currentTarget on a link and on a button"
<Button as="a" href="/checkout" onClick={e => ~e.currentTarget.href~}>Checkout</Button> {/* Passes: currentTarget is the <a> */}
<Button onClick={e => ~e.currentTarget.href~}>Clear cart</Button> {/* **WRONG:** Property 'href' does not exist on type 'EventTarget & HTMLButtonElement'. */}
```

Typographical errors in the tag name are caught immediately with suggestions:

```tsx title="A misspelled tag in as"
<Button ~as="buton"~>Clear cart</Button> {/* **WRONG:** Type '"buton"' is not assignable to type 'ElementType | undefined'. Did you mean '"button"'? */}
```

Editor autocompletion adapts to the chosen tag. For anchor tags, the editor offers link-specific properties like `target` and `rel`.

### Implementing Step 2 on the Cart Page

Our button component file updates only its type declarations, leaving the runtime implementation unchanged:

```tsx title="src/Button.tsx"
import type { ComponentPropsWithoutRef, ElementType } from 'react';

type ButtonProps<E extends ElementType> = {
  ~as?: E~; // The page names the tag, and TypeScript fills in E from it
  variant?: 'primary' | 'secondary';
} & ComponentPropsWithoutRef<E>; // Only the attributes of the tag that as names

export default function Button<E extends ElementType ~= 'button'~>({ as, variant = 'primary', ...rest }: ButtonProps<E>) { // No as on the tag: the attributes of <button>
  const Component = as ?? 'button';
  return <Component className={variant} {...rest} />;
}
```

Because TypeScript now rejects `disabled` on anchor elements, the cart page conditionally renders a link when items exist, and a disabled button when the cart is empty:

```tsx title="src/App.tsx" startLine="11"
      {count > 0
        ? <Button as="a" href="/checkout">Checkout</Button>
        : <Button ~disabled~>Checkout</Button>} {/* The empty cart gets a real <button>, which supports disabled */}
```

When items are present, Checkout renders as an active link. When the customer clears the cart, Checkout switches to a genuine disabled button element:

```page caption="The page of step 2 after the user clicks Clear cart: Checkout is now a disabled button."
line: Cart: 0 items
form:
  button: Clear cart
  button: Checkout | | disabled
console: quiet
```

Inspecting the DOM confirms that an empty cart produces a native button element carrying the disabled attribute:

```dom caption="The Elements panel after the user clicks Clear cart: Checkout is a disabled button with the primary class."
<div id="root">
  <p>Cart: 0 items</p>
  <button class="secondary">Clear cart</button>
+ <button class="primary" disabled="">Checkout</button> | note: Button with no as and disabled
</div>
```

The browser natively suppresses click events and keyboard focus on the disabled button.

### How Naive Polymorphic Typing Typically Originates

Permissive intersection types often arise when teams quickly extend a standard button interface. An engineer adds `as` and `href` properties to native button attributes:

```tsx title="src/Button.tsx"
interface ButtonProps extends ~ComponentPropsWithoutRef<'button'>~ { // Only the attributes of <button>, plus two fields
  as?: 'a' | 'button';
  href?: string;
  variant?: 'primary' | 'secondary';
}
```

The compiler immediately rejects the component return statement because button event handlers collide with anchor event handlers:

```text title="One line of the editor's message"
Types of property 'onCopy' are incompatible.
```

To silence this diagnostic, developers frequently combine attributes using intersections or cast the tag using `any`. Silencing compiler errors in this manner strips away element-specific type checks. When another developer adds `disabled` to an anchor, the compiler remains silent, reintroducing runtime bugs.

---

## PRINCIPLE | `href: string` in a union: a link when `href` is passed, a button otherwise

> [!PRINCIPLE]
> **Principle 3: Union Props: `href` Alone Picks the `<a>` Form of the Union**
>
> *When a component has exactly two forms, type its props as a union of an `<a>` form with `href: string` and a `<button>` form with `href?: undefined`, and check `rest.href !== undefined` inside.*
>
> A plain `Button` that always renders `<button>` puts `href` on a button, and the user's click goes nowhere. With the union, a string `href` fits only the `<a>` form, so the page writes no `as`, and TypeScript checks every other attribute against that form. That is why `disabled` next to `href` is refused.
>
> **DO THIS:**
> ```tsx
> export default function Button({ variant = 'primary', ...rest }: ButtonProps) {
>   if (~rest.href !== undefined~) { // rest is the <a> form here
>     return <a className={variant} {...rest} />;
>   }
>   return <button className={variant} {...rest} />;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> export default function Button({ variant = 'primary', ...rest }) {
>   return <~button~ className={variant} {...rest} />; // **WRONG:** href lands on a button, and the click goes nowhere
> }
> ```

Technical interviewers frequently pose this exact requirement. You build a button that renders as a native button by default, but switches to an anchor when given an `href` prop. This pattern requires no `as` prop.

### VS | Explicit as Tag Selection vs. Implicit href Discrimination

Compare how callers invoke both implementations:

```tsx title="Two ways to ask for the Checkout link"
<Button ~as="a"~ href="/checkout">Checkout</Button> {/* Principle 2: as names the tag */}
<Button ~href="/checkout"~>Checkout</Button> {/* No as: href alone asks for the link */}
```

Under Principle 2, the second tag fails compilation because a button element cannot accept `href`. Under Principle 3, the presence of `href` automatically selects the anchor variant.

Both approaches render an anchor element with primary button styling. They differ in API design and architectural scope:
1. **With the `as` prop**, callers must specify the tag explicitly, but the component can render arbitrary HTML tags or router link components.
2. **With discriminated unions**, callers supply only the destination URL, but the component strictly supports exactly two element forms.

### Discriminated Union Props Definition

We construct the props interface as a union of two distinct object types (Lesson 92):

```tsx title="src/Button.tsx"
import type { ComponentPropsWithoutRef } from 'react';

type ButtonProps = { variant?: 'primary' | 'secondary' } & (
  | ({ ~href: string~ } & ComponentPropsWithoutRef<'a'>) // The <a> form: href is required
  | ({ ~href?: undefined~ } & ComponentPropsWithoutRef<'button'>) // The <button> form: no href allowed
);

export default function Button({ variant = 'primary', ...rest }: ButtonProps) {
  if (~rest.href !== undefined~) { // From here on, TypeScript treats rest as the <a> form
    return <a className={variant} {...rest} />;
  }
  return <button className={variant} {...rest} />;
}
```

Two technical design decisions structure this union:
- **`href?: undefined`** explicitly marks `href` as unavailable on the button variant. When a caller passes a string `href`, the compiler rules out the button variant. Adding this property to both union branches also permits inspecting `rest.href` without type errors.
- **`rest.href !== undefined`** functions as a type guard. Inside the conditional block, TypeScript narrows `rest` directly to anchor attributes, similar to narrowing reducer actions via action types (Lesson 92).

The component does not destructure `href` separately. It remains within `rest`, where the conditional check inspects its value.

When a caller writes `<Button href="/checkout">`, type resolution proceeds through three steps:
1. The caller supplies a string `href` property.
2. Because the button branch requires `href?: undefined`, the compiler disqualifies the button branch.
3. The compiler matches the anchor branch, validating all remaining attributes against native anchor properties.

### Enforcing Mutual Exclusion: Rejecting disabled Alongside href

Because the union interface contains a branch supporting `disabled`, one might wonder if combining that attribute with `href` passes compilation. The compiler strictly rejects this combination:

```tsx title="The Checkout link with disabled, under the union"
<Button href="/checkout" ~disabled={count === 0}~>Checkout</Button> {/* **WRONG:** href picks the <a> form, and the <a> form has no disabled */}
```

The presence of `href` binds the component invocation to the anchor branch, which contains no `disabled` attribute:

```text title="The last line of the editor's message"
Property 'disabled' does not exist on type 'IntrinsicAttributes & { variant?: "primary" | "secondary" | undefined; } & { href: string; } & ...
```

Event typing follows the matched branch. Callers can safely inspect `e.currentTarget.href` because TypeScript knows the event originated from an anchor element.

### What Goes Wrong Without Union Props: Placing href on a Native Button

Consider an untyped JavaScript button component that always returns `<button>`. If a developer passes an `href` prop, React forwards the attribute onto the button DOM node:

```dom caption="The Elements panel: the plain Button.jsx puts href on a button."
<div id="root">
  <p>Cart: 2 items</p>
  <button class="secondary">Clear cart</button>
! <button class="primary" href="/checkout">Checkout</button> | note: href on a button goes nowhere
</div>
```

The browser completely ignores `href` attributes on native buttons. Clicking the button produces no navigation.

A typed button component that renders only buttons at least catches this mistake at compile time (Lesson 90). The discriminated union pattern goes a step further: it dynamically transforms the component into an anchor element.

### Implementing Step 3 on the Cart Page

The discriminated union approach represents an alternative architecture to Principle 2. Using this union, the cart page drops `as="a"` and relies entirely on `href`:

```tsx title="src/App.tsx" startLine="11"
      {count > 0
        ? <Button ~href="/checkout"~>Checkout</Button> // href alone picks the <a> form
        : <Button disabled>Checkout</Button>} {/* No href: the <button> form, which supports disabled */}
```

The resulting behavior matches Principle 2:
- **When items exist in the cart**, Checkout renders as an anchor element with primary styling and the target address.
- **When the cart is empty**, Checkout renders as a native button element with primary styling and the `disabled` attribute.

Choose the discriminated union pattern when a component switches strictly between buttons and links. Choose the generic `as` pattern when a component must support multiple tags or custom router components.

```tree caption="Two ways to get a link from one Button: as names the tag, or href picks the form of a union."
Two ways to make `Button` a link
- +`as` with a type parameter [`<Button as="a" href="/checkout">`] | Every link **writes `as`** | `Button` can become **any tag or a component** such as a router Link
- +A union chosen by `href` [`<Button href="/checkout">`] | The page writes **only `href`** | `Button` has **exactly two forms**: a link or a button
```

---

## All 3 Principles Together

### The Complete Code

Here is the complete implementation of our polymorphic button using Principles 1 and 2:

```tsx title="src/Button.tsx"
import type { ComponentPropsWithoutRef, ElementType } from 'react';

type ButtonProps<E extends ElementType> = {
  ~as?: E~; // Principle 2: TypeScript fills in E from as at each tag
  variant?: 'primary' | 'secondary';
} & ComponentPropsWithoutRef<E>; // Principle 2: only the attributes of the tag that as names

export default function Button<E extends ElementType ~= 'button'~>({ as, variant = 'primary', ...rest }: ButtonProps<E>) { // Principle 2: no as means the attributes of <button>
  const ~Component~ = as ?? 'button'; // Principle 1: a capitalized variable holds the tag name
  return <Component className={variant} {...rest} />;
}
```

The parent application component manages item count state and supplies the appropriate button configuration:

```tsx title="src/App.tsx"
import { useState } from 'react';
import Button from './Button';

export default function App() {
  const [count, setCount] = useState(2);

  return (
    <>
      <p>Cart: {count} items</p>
      <Button variant="secondary" onClick={() => setCount(0)}>Clear cart</Button>
      {count > 0
        ? <Button ~as="a"~ href="/checkout">Checkout</Button> // A link while the cart has items
        : <Button ~disabled~>Checkout</Button>} {/* A disabled button once the cart is empty */}
    </>
  );
}
```

### Execution and Rendering Lifecycle

When the application mounts, React executes `App`. The component initializes `count` to 2 and renders two button instances. When the user clears the cart, state updates to 0, prompting React to re-render the tree with the disabled button:

```tree dir=right caption="The order of the calls: App, then Button for Clear cart, then Button for Checkout, and all three again after the click."
How React renders the cart page
- +1. `App` [`useState 2`] | `count` is **2** | Returns the line, **Clear cart**, and **the Checkout link**
- +2. `Button` for Clear cart [`variant="secondary"`] | No `as`, so `Component` is **`'button'`** | Creates **`<button class="secondary">`**
- +3. `Button` for Checkout [`as="a"`] | `Component` is **`'a'`** | Creates **`<a class="primary" href="/checkout">`**
- +4. The user clicks Clear cart [`setCount`] | `count` is **0**, and React calls **`App` and both `Button` tags again** | Checkout becomes **`<button class="primary" disabled>`**
```

```page caption="The finished cart page after the user clicks Clear cart."
line: Cart: 0 items
form:
  button: Clear cart
  button: Checkout | | disabled
console: quiet
```

| Aspect | The Common Mistake | The Polymorphic Rule |
| :--- | :--- | :--- |
| **The tag** | Write the prop itself as the tag, `<as>`, and get an element named `as` | Copy `as` into `Component` and write `<Component {...rest} />` |
| **The attributes** | One props type for both tags, so `disabled` passes on a link | `ComponentPropsWithoutRef<E>`, so each tag gets only its own attributes |
| **No `as` on the tag** | A type parameter with no default, so a plain `Button` accepts any prop | `E extends ElementType = 'button'`, so a plain `Button` takes the attributes of `<button>` |
| **The default tag** | A default in the parameter list, which the editor refuses | `as ?? 'button'` in the body |
| **Exactly two forms** | `href` on a plain `<button>`, which goes nowhere | A union chosen by `href`: a link when `href` is passed, a button otherwise |

Core architectural rule: **The `as` prop simultaneously governs the concrete DOM tag mounted at runtime and the exact attribute interface verified at compile time.**

---

## For the Interview

> **The Interview Question:** How do you build polymorphic components with the as prop in TypeScript?

### How to Answer Clearly in 30 Seconds

"A polymorphic component enables callers to specify the rendered HTML element or component through a single prop, typically named `as`. At runtime, the component assigns the prop to a capitalized identifier like `const Component = as ?? 'button'` and renders `<Component {...rest} />` so JSX compiles to a dynamic element creation call.

Type safety requires three coordinated declarations:
1. **Generic element parameterization:** Constrain the tag with `E extends ElementType = 'button'`, typing the prop as `as?: E`.
2. **Dynamic attribute resolution:** Intersect component props with `ComponentPropsWithoutRef<E>`, ensuring that anchor tags accept `href` and reject `disabled`.
3. **Default type fallback:** Assigning `= 'button'` ensures that unannotated instances retain full button attribute validation rather than falling back to broad unconstrained elements.

When switching strictly between buttons and links, you can also use a discriminated union driven by `href`, avoiding the `as` prop entirely."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"What happens when the component's own prop has the same name as an attribute of the tag?"**
   When custom props share names with underlying HTML attributes, an unconstrained intersection requires the property value to satisfy both definitions simultaneously. For example, if a component declares `title: ReactNode` while HTML attributes require `title: string`, passing JSX nodes triggers compiler errors. To resolve collisions, wrap attribute helpers in `Omit` to strip conflicting names before intersecting custom props:
   ```tsx
   type Props<E extends ElementType, P> = P & { as?: E } & ~Omit<ComponentPropsWithoutRef<E>, keyof P | 'as'>~; // The component's own props win every clash
   ```
   Our button uses `variant` and `as`, neither of which collides with native button or anchor attributes.
2. **"Can `as` hold a component, not only a tag name?"**
   Yes. React element factories accept both HTML tag strings and custom React component references. The constraint `ElementType` covers both cases. A frequent production example is integrating React Router navigation by passing `as={Link}`. If `Link` requires a `to` property, TypeScript automatically enforces that `<Button as={Link} to="/checkout">` supplies `to`, flagging the element if the required prop is missing.
3. **"Why `ComponentPropsWithoutRef` and not `ComponentPropsWithRef`?"**
   In React 19, `ref` is passed as a standard prop rather than requiring `forwardRef` wrappers (Lesson 85). However, directly typing polymorphic components with `ComponentPropsWithRef<E>` without stripping conflicting keys often breaks TypeScript generic inference. This causes the compiler to widen `E` prematurely, allowing invalid attributes like `disabled` on anchor tags. In library codebases, engineers either use `ComponentPropsWithoutRef<E>` or explicitly sanitize refs using `Omit<ComponentPropsWithRef<E>, 'as' | 'variant'>`.

```tree caption="Interview summary: as names the tag in the browser, and the type parameter E gives that tag only its own attributes."
A polymorphic `Button` in TypeScript
- +In the browser [`const Component = as ?? 'button'`] | A capitalized variable **holds the tag name** | React creates **the tag that `as` names**
- +For the type-checker [`as?: E` `ComponentPropsWithoutRef<E>`] | TypeScript **fills in `E` from `as`** | Each tag accepts **only its own attributes**
- +Exactly two forms [`href: string` `href?: undefined`] | A union **chosen by `href`** | A link when `href` is passed, **a button otherwise**
```
