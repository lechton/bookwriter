# Lecture 90: How a Shared Button Tells the Type-Checker Which Props It Takes

*(How does TypeScript catch a misspelled prop before the user ever sees the page?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | How do you type React components, props, optional attributes, and children in TypeScript?

---

## VS | A Button Without a Type vs. a Button With a Type: the plain one accepts any prop name, while the typed one is checked in the editor

> A component receives its props as one plain object, and JavaScript accepts any attribute written on the tag. **In TypeScript, you give that props object a type that declares every accepted prop.** The editor checks every tag against that type immediately. A misspelled prop is underlined in red while you type, instead of reaching production as an empty button with a silent browser console.

Consider a plain JavaScript function such as `function greet(name)`. JavaScript lets callers pass any value into it. A caller can pass text like `greet('John')`, a number like `greet(42)`, or nothing at all. The editor never warns you during development. You discover the mistake only when the application runs and renders broken output.

TypeScript introduces static typing to JavaScript. You append a type annotation after each parameter to declare what values are permitted.

```tsx title="The same function, without a type and with a type"
function greet(name) { return 'Hello ' + name; } // Plain JavaScript: name can be anything
function greet(name~: string~) { return 'Hello ' + name; } // TypeScript: name must be a string
greet(~42~); // The editor underlines 42 at once: a number is not a string
```

A React component is also a JavaScript function. Its single parameter is the props object. You place the type annotation in the exact same position, directly after the props parameter.

```tsx title="The same Button, without a type and with a type"
function Button({ label }) { // Plain JavaScript: any prop name is accepted
  return <button>{label}</button>;
}

function Button({ label }~: { label: string }~) { // TypeScript: the props object must hold label, a string
  return <button>{label}</button>;
}
```

> [!DEFINITION]
> **What is TypeScript, and what is a type?** [NEW] TypeScript is JavaScript extended with static type definitions. A type is a compile-time contract that specifies what data a value can hold.
> 1. Primitive types define basic values: `string` requires text, and `number` requires a numeric value.
> 2. Object types define required properties: `{ label: string }` requires an object containing a `label` property holding text.
> 3. Types exist only during authoring and compilation: your build tool strips every type annotation before creating the browser bundle, so types never run in production (Lesson 90).

> [!DEFINITION]
> **What is the props object?** [REVIEW] React components receive all incoming data through a single argument called the props object.
> 1. React packages every JSX attribute into one object: `<Button label="Add to cart" />` results in `Button({ label: 'Add to cart' })`.
> 2. Object destructuring in the function signature extracts properties immediately: `function Button({ label })` creates a local `label` variable.
> 3. Any attribute omitted by the caller resolves to `undefined` within the component (Lesson 08).

### A misspelled prop, with and without a type

A product page imports the button, but the developer makes a typing error. The markup spells the attribute as `lable` instead of `label`:

```tsx title="A product page that misspells the prop name"
<main>
  <h1>Wireless headphones</h1>
  <p>$200</p>
  <Button ~lable~="Add to cart" /> {/* The developer meant label */}
</main>
```

In untyped JavaScript, nothing warns you about the spelling error. The application launches, and the browser displays a blank button containing no text:

```page width=text caption="The product page with the misspelled prop: the button is there, but it holds no text, and the Console is quiet."
heading: Wireless headphones
line: $200
form:
  button: 
console: quiet
```

Why does this happen? React passes an object with a single key named `lable` to the component. The component destructures `label`, which does not exist on that object. In JavaScript, accessing a missing property evaluates to `undefined`. React renders `undefined` as empty markup without throwing a runtime error (Lesson 10). Because no exception occurs, the browser console remains silent.

With a typed button, that defect never reaches the user. The moment a developer types `lable`, the editor highlights the attribute in red. The compiler states that the props contract for `Button` does not include a property with that name.

> [!DEFINITION]
> **What is the type-checker?** [NEW] The type-checker is TypeScript's static analysis engine that validates code against declared type contracts.
> 1. It compares values and properties during development: any mismatch between a tag attribute and the component type produces an immediate error.
> 2. It highlights mistakes directly in your editor: hovering over an underlined property displays the exact contract mismatch.
> 3. It operates purely at compile time: the type-checker never executes inside the browser and introduces zero runtime overhead (Lesson 90).

### The types never reach the browser

Many developers find this step surprising. In the browser, the untyped button and the typed button execute identical code. Modern build tools, such as Vite, strip away all type declarations before serving the bundle. The browser receives plain JavaScript in both cases.

Official React documentation notes that code sandboxes do not run the type-checker, so code runs even when type errors exist.

For the developer, however, the experience is completely different. The typed component stops the misspelled attribute before anyone opens the browser. Official React documentation explains that types deliver correctness checks and inline documentation directly inside code editors.

Modern React provides no runtime prop validation. Earlier React versions offered runtime checking through a package called `propTypes`. React 19 removed those checks, and official React documentation warns that `propTypes` declarations are now silently ignored. The TypeScript type-checker in the editor and build pipeline is your only validation boundary.

```tree caption="The same Button without a type and with a type: the browser runs the same code, but only the typed version is checked in the editor."
The same `Button`, with and without a type for its props
- !Without a type [`{ label }`] | The editor **accepts any prop name** | `lable` reaches the page: **an empty button** and **a quiet Console**
- +With a type [`{ label }: { label: string }`] | The type-checker **compares every tag** with the type | `lable` is **underlined in the editor** before the page opens
```

### The Rule of Thumb: describe the props object once

A component receives a single props object. Describe that object once with a type, and the editor validates every tag across your application before the page runs. In the browser, every type annotation is gone.

A props type catches four primary mistakes directly in the editor:
1. **Unlisted property names**, such as typing `lable` instead of `label`.
2. **Missing required properties**, when a consumer omits a mandatory prop.
3. **Disallowed property values**, such as an invalid string literal passed to a style prop.
4. **Unsupported native attributes**, such as passing `disabled` to a component that does not accept it.

Experienced engineers recognize three common pitfalls:
1. **Expecting runtime validation in the browser.** Types are stripped during compilation, and React 19 ignores `propTypes`.
2. **Typing children as a string or as `React.ReactElement`.** That restriction prevents callers from passing mixed text alongside formatting tags.
3. **Declaring native HTML button attributes by hand.** A manual list forces you to edit the component each time a consumer requires another standard attribute.

## SECTION | A Product Page with One Shared Button

Our example features a product page for wireless headphones in an online store. Beneath the product price sit two distinct action buttons:

```page width=text caption="The headphones product page we build: a heading, the price, and two buttons made by one shared Button component."
heading: Wireless headphones
line: $200
form:
  button: Add to cart
  button: Save for later
console: quiet
```

Both buttons originate from a single shared `Button` component. The `Add to cart` button has a filled background, while `Save for later` displays an outlined border. The storefront shares this button across many screens, including product listings, cart summaries, and checkout views. Because multiple views reuse the same component, an invalid prop name on a single page easily goes unnoticed.

Configuring a React project with TypeScript requires two foundational steps:
1. **Install `@types/react` and `@types/react-dom`.** These declaration packages provide TypeScript definitions for React APIs and elements.
2. **Configure `tsconfig.json` to process JSX.** Files that contain JSX markup use the `.tsx` extension, signaling that the compiler must parse JSX syntax.

```files title="product-page: File Explorer" caption="Our project files: App.tsx places two shared buttons, and Button.tsx holds the button and the type of its props."
index.html | entry | The HTML page with the empty root div where React mounts
tsconfig.json | settings | Tells TypeScript how to read the project, JSX included
src/
  main.tsx | boundary | Imports `App` from `./App` and mounts it into `#root`
  App.tsx | page | Exports `App` as default and places two `<Button>` tags
  components/
    Button.tsx | shared component | Exports `Button` as default with the type of its props
    Button.css | style | Gives `.primary` a filled look, `.secondary` an outline, and a turned-off button a dimmed look
```

The button begins as an untyped JavaScript component placed inside a `.tsx` file:

```tsx title="src/components/Button.tsx"
export default function Button(~{ label }~) { // No type yet: any prop name passes
  return <button>{label}</button>;
}
```

The product team requests four sequential capabilities. Catch misspelled props immediately. Add a visual variant style. Place the price in bold text inside the button. Disable the button when stock runs out. Four architectural principles address each requirement in turn.

**PRINCIPLES:** A props type defines the single object React provides to a component, and the editor evaluates every JSX tag against that definition. Four core principles follow:
1. **Principle 1: `ButtonProps` checks every tag.** Declare the type after the props parameter, either inline or through an `interface`. The editor flags unlisted props and missing mandatory attributes.
2. **Principle 2: `variant?` with a union of words.** The question mark makes a prop optional. A string union restricts input to exact permitted words. Declare default values in the parameter list because React 19 ignores `defaultProps`.
3. **Principle 3: `children: React.ReactNode`.** This type accepts strings, numbers, elements, and fragments. Typing children as `React.ReactElement` restricts input to JSX elements and rejects plain text.
4. **Principle 4: `extends React.ComponentPropsWithRef<'button'>`.** The component inherits all standard HTML button attributes, adds custom props, and forwards the remainder using JSX spread syntax.

---

## PRINCIPLE | `interface ButtonProps`: every `<Button>` tag is checked in the editor, before the page opens

> [!PRINCIPLE]
> **Principle 1: Props Type: The Type-Checker Compares Every Tag with `ButtonProps`**
>
> *Give the props object a type after the destructured parameter, inline or named with `interface`; the type-checker then reports a prop name the type does not list, and a listed prop that the page leaves out.*
>
> Without a type, a page can write `lable` instead of `label`, and the user gets a button with no text while the Console stays quiet. With `ButtonProps`, the editor underlines the mistake before the page opens. Only the editor and the type-checker read the type. The browser runs the same code as without it, and React 19 no longer checks props in the browser.
>
> **DO THIS:**
> ```tsx
> interface ButtonProps {
>   label: string;
> }
> function Button({ label }~: ButtonProps~) { // Every <Button> tag is compared with ButtonProps
>   return <button>{label}</button>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function Button(~{ label }~) { // **WRONG:** no type, so lable passes and the button shows no text
>   return <button>{label}</button>;
> }
> ```

### VS | An inline type vs. a named `interface`: both describe the same props object

Our initial example placed the type directly inside the parameter signature. Official React documentation calls this the simplest approach for adding component types. It also cautions that inline definitions become unreadable as props expand. Our button will soon support visual variants, formatted content, and native attributes. To maintain clean code, define the type separately and assign it a name above the component:

```tsx title="The props type written inline, and the same type named with interface"
function Button({ label }~: { label: string }~) { // 1. The type sits inside the parameter line
  return <button>{label}</button>;
}

~interface ButtonProps~ { // 2. The same type gets a name, with one line per prop
  label: string;
}

function Button({ label }~: ButtonProps~) { // The parameter now points to that name
  return <button>{label}</button>;
}
```

Both declarations achieve the exact same compiler result. Each describes an object that must contain a `label` property holding a string. Naming the interface extracts the contract from the parameter signature, keeping the function header concise as features grow.

TypeScript provides another keyword for naming object shapes, called `type`:

```tsx title="The same props type named with interface, and named with type"
~interface~ ButtonProps { label: string; } // 1. Named with interface
~type~ ButtonProps = { label: string }; // 2. Named with type: the same description
```

For describing component props, both keywords perform the exact same validation. Official React documentation confirms that component props can be described with either `type` or `interface`. Throughout this lesson, we use `interface` to follow common design system conventions.

> [!DEFINITION]
> **What is an object type?** [NEW] An object type specifies the exact properties an object must contain alongside the data type for each property.
> 1. An inline type defines structure directly: `{ label: string }` requires an object holding a text property named `label`.
> 2. An interface assigns that specification a reusable name: `interface ButtonProps { label: string; }`.
> 3. Interfaces support extension through inheritance, allowing your component to inherit native element attributes easily (Lesson 90).

```tree caption="Three ways to write the props type of Button: all three describe the same object with label as a string."
Three ways to describe the props of `Button`
- +Inline after the parameter [`{ label }: { label: string }`] | The simplest form | Gets **hard to read** with a few fields
- +Named with `interface` [`interface ButtonProps`] | One line per prop, **above the component** | The parameter writes **`: ButtonProps`**
- +Named with `type` [`type ButtonProps = { ... }`] | The same object type with another keyword | **Exact same check** for a props object
```

### The type-checker compares every `<Button>` tag with `ButtonProps`

Here is the button component declaring its named interface:

```tsx title="src/components/Button.tsx"
~interface ButtonProps~ { // 1. Describes the one props object React passes to Button
  label: string;
}

export default function Button({ label }~: ButtonProps~) { // 2. The colon says what the props must look like
  return <button>{label}</button>;
}
```

The product page imports the component and renders two buttons:

```tsx title="src/App.tsx"
import Button from './components/Button';

export default function App() {
  return (
    <main>
      <h1>Wireless headphones</h1>
      <p>$200</p>
      ~<Button label="Add to cart" />~ {/* Matches ButtonProps: label is a string */}
      <Button label="Save for later" />
    </main>
  );
}
```

React never inspects `ButtonProps` at runtime. The TypeScript compiler performs all validation in three distinct phases:
1. React executes `Button` with a single props object argument during rendering.
2. The colon after the parameter informs the type-checker that incoming props must satisfy `ButtonProps`.
3. The compiler scans every JSX file in the workspace and checks each `<Button>` tag against the interface.

A consuming page can introduce two common mistakes, and the editor flags both immediately:

```tsx title="src/App.tsx" bad="1,2"
<Button ~lable~="Add to cart" /> {/* **WRONG:** the editor underlines lable: ButtonProps has no prop with this name */}
~<Button />~ {/* **WRONG:** the editor says label is missing, because ButtonProps requires it */}
```

When the editor flags `lable`, it suggests the intended name `label`. In addition, hovering over `<Button>` in any consumer file displays the full `ButtonProps` interface. This provides instant inline documentation without forcing developers to navigate away from the page file.

### Surprise: a type error does not stop the page

What happens if a developer ignores the red squiggly line and saves the file? The development server still serves the application, displaying the empty button described earlier.

Why does the application run despite the compiler error? The local development server strips types rapidly to keep updates fast. It does not perform full type verification. The type-checker runs in two specific environments:
1. **Inside the code editor**, providing immediate visual feedback while you type.
2. **Inside the production build command**, which executes in your continuous integration pipeline. Modern project build scripts run the type-checker before bundling, and any unresolved type error aborts the build.

A typing defect might temporarily display on a local development machine, but it cannot pass through the build pipeline to production users.

```page width=text caption="The page after the developer saves the page file with the type error: the dev server still shows it, with an empty first button and a quiet Console."
heading: Wireless headphones
line: $200
form:
  button: 
  button: Save for later
console: quiet
```

```tree dir=right caption="Where the props type is read: in the editor and in the build command before the page runs, never in the browser."
Where `ButtonProps` is read
- +1. In the editor [`<Button lable="Add to cart" />`] | The type-checker **underlines `lable`** as the developer types | Hover shows **which props `Button` takes**
- +2. In the build command | The type-checker **runs before the build** | A type error **stops the build**
- !3. In the browser | The types **are deleted** before the code runs | **Nothing checks props** while the page runs
```

Always remember that types are evaluated during editing and automated builds, never inside the user's browser.

---

## PRINCIPLE | `variant?` with a union of words: a page may leave the style out, but cannot misspell it

> [!PRINCIPLE]
> **Principle 2: Optional Props: `?`, a Union of Words, and a Default Value**
>
> *Mark a prop that pages may leave out with `?`, list the words it may hold as a union of strings, and give it a default value in the parameter list; React 19 no longer reads `defaultProps` on function components.*
>
> A prop typed as `string` accepts every word, so `secondery` passes, and the user gets a button with no style. A union such as `'primary' | 'secondary'` accepts only the listed words, and the editor underlines every other value, `null` included. The default value in the parameter list covers the pages that leave the prop out. JavaScript uses it only when the prop is missing or `undefined`.
>
> **DO THIS:**
> ```tsx
> interface ButtonProps {
>   label: string;
>   ~variant?: 'primary' | 'secondary'~; // Only two words; pages may leave it out
> }
> function Button({ label, ~variant = 'primary'~ }: ButtonProps) { // Filled when the page writes no variant
>   return <button className={variant}>{label}</button>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> interface ButtonProps {
>   label: string;
>   ~variant: string~; // **WRONG:** secondery passes, and every page must write variant
> }
> ```

### A prop that pages may leave out

Our application design specifies two visual appearances. Most buttons, such as primary purchase actions, have a filled dark background. Secondary actions, like saving an item for later, render with an outlined border. To support this distinction, the component introduces a `variant` prop. The value `'primary'` indicates a filled button, and `'secondary'` indicates an outlined button.

Most pages should not need to pass `variant` explicitly. An omitted variant should render the primary style by default. Two concise notations accomplish this goal:

```tsx title="A prop that pages may leave out, with a default value"
interface ButtonProps {
  label: string;
  ~variant?~: string; // 1. The question mark: a page may leave variant out
}

function Button({ label, ~variant = 'primary'~ }: ButtonProps) { // 2. The default value: used when the page leaves it out
  return <button className={variant}>{label}</button>;
}
```

Appending a question mark to a property name marks it as optional. The compiler permits consumers to omit optional props. When a page omits the prop, standard JavaScript default parameter syntax supplies the fallback value (Lesson 09). For `<Button label="Add to cart" />`, React passes an object without a `variant` property. JavaScript assigns `'primary'` automatically, giving the button element the primary class name.

### VS | `variant?: string` vs. `variant?: 'primary' | 'secondary'`: any string passes, while only the two words pass

Now suppose a developer creates a secondary button but mistypes the variant name:

```tsx title="A page that misspells the style name"
<Button label="Save for later" ~variant="secondery"~ /> {/* The developer meant secondary */}
```

Compare two different type definitions for this optional prop:

```tsx title="The same optional variant, typed as any string and typed as two words"
~variant?: string;~ // 1. Any string: secondery passes the type-checker
~variant?: 'primary' | 'secondary';~ // 2. Only these two words: secondery is underlined in the editor
```

Both options look similar at a glance, but their error handling differs completely when a typo occurs:
- **With `variant?: string`**, the misspelled word `secondery` satisfies the broad string contract. The compiler raises no alarm, and React applies the unrecognized class name to the element. Because no CSS rule targets that name, the button renders unstyled.
- **With `variant?: 'primary' | 'secondary'`**, the contract permits only those two exact string values. The editor underlines the misspelled word immediately before code ever reaches a browser.

> [!DEFINITION]
> **What is a union type?** [NEW] A union type specifies a value that must match one of several declared literals or types, delimited by vertical bars.
> 1. String literal unions constrain inputs to exact words: `'primary' | 'secondary'` accepts only those two values.
> 2. Passing any unlisted string literal produces an immediate compile error.
> 3. Official React documentation applies unions to stateful properties, such as a status prop accepting `"idle" | "loading" | "success" | "error"` (Lesson 90).

```dom caption="What the Elements panel shows when a page writes secondery and variant is typed as string: no style in Button.css matches that class."
<main>
  <h1>Wireless headphones</h1>
  <p>$200</p>
  <button class="primary">Add to cart</button>
! <button class="secondery">Save for later</button> | note: no style matches secondery, so no outline
</main>
```

### VS | `defaultProps` vs. a default value in the parameter list: React 19 ignores the first, while JavaScript runs the second

Legacy React components established default values by attaching a `defaultProps` property to the component function:

```tsx title="A default value with defaultProps"
function Button({ label, variant }: ButtonProps) {
  return <button className={variant}>{label}</button>;
}

~Button.defaultProps~ = { variant: 'primary' }; // **WRONG:** React 19 ignores this on a function component
```

```tsx title="A default value in the parameter list"
function Button({ label, ~variant = 'primary'~ }: ButtonProps) { // The page leaves variant out, so variant is 'primary'
  return <button className={variant}>{label}</button>;
}
```

These two approaches appear equivalent, but React 19 treats them very differently. Official React upgrade guidance explicitly states that React 19 removed `defaultProps` from function components in favor of standard ES6 default parameters. Standard default parameters are the native JavaScript defaults placed in the parameter signature.

When using `defaultProps` on a function component in React 19, the prop remains `undefined`. The primary button receives no class name and renders without its filled background. The type-checker cannot catch this runtime defect because `variant?` explicitly marks the prop as optional. Class components continue to support `defaultProps` because class definitions lack parameter signatures for destructuring defaults.

### Surprise: the default value is not used for `null`

Default parameter assignment in JavaScript contains one subtle boundary condition. A default parameter triggers only when an argument is `undefined` or completely omitted. It never activates when a caller passes `null`:

```tsx title="A page that passes null for variant"
<Button label="Save for later" ~variant={null}~ /> {/* null is not missing: the default value is not used */}
```

When `null` is passed, the button renders completely unstyled. Trace the execution flow step by step:
1. React provides a props object containing the `variant` key holding `null`.
2. Native JavaScript evaluates default parameters only for missing or `undefined` values. Because `null` is an explicit value, JavaScript retains `null`.
3. In JSX, assigning `className={null}` produces an HTML element with no class attribute, leaving the element unstyled.

```dom caption="What the Elements panel shows when a page passes null for variant: the button has no class at all."
<main>
  <h1>Wireless headphones</h1>
  <p>$200</p>
  <button class="primary">Add to cart</button>
! <button>Save for later</button> | note: variant is null, so no class
</main>
```

A strict union type prevents this issue completely. Because null is not a member of the `'primary' | 'secondary'` union, the editor highlights `variant={null}` in red. This strict type enforcement operates by default in standard TypeScript project setups.

```tree caption="What variant holds inside Button for each way a page can write the tag."
What `variant` holds inside `Button`
- +No `variant` on the tag [`<Button label="Add to cart" />`] | The key is **missing** | The default value gives **`'primary'`**: a filled button
- +A listed word [`variant="secondary"`] | The page's word is used | **`'secondary'`**: a button with an outline
- !A misspelled word [`variant="secondery"`] | Passes with `string`; **underlined** with the union | A button with **no style**
- !`null` [`variant={null}`] | `null` is **not missing**, so no default | A button with **no class**; **underlined** with the union
```

Remember that the question mark permits omitting an attribute, while the literal union stops consumers from passing invalid values.

---

## PRINCIPLE | `children: React.ReactNode`: the button accepts plain text, tags, or both

> [!PRINCIPLE]
> **Principle 3: Children: `React.ReactNode` Accepts Everything Between the Tags**
>
> *When a component shows whatever the page places between its tags, type `children` as `React.ReactNode`, which accepts text, numbers, tags, and nothing at all; `React.ReactElement` accepts only JSX tags.*
>
> `children` is whatever the page writes between the opening and closing tags, and plain text is the most common case. `React.ReactElement` sounds right for JSX, but it refuses `Save for later`, and it refuses text next to a tag. `React.ReactNode` accepts both, so one shared button can hold plain words on one page and a bold price on another.
>
> **DO THIS:**
> ```tsx
> interface ButtonProps {
>   variant?: 'primary' | 'secondary';
>   ~children: React.ReactNode~; // Accepts Save for later and Add to cart with a bold price
> }
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> interface ButtonProps {
>   variant?: 'primary' | 'secondary';
>   ~children: React.ReactElement~; // **WRONG:** refuses the plain text Save for later
> }
> ```

### The price in bold inside the button

The product team introduces another enhancement. The `Add to cart` button must include the product price formatted in bold text. A plain text `label` prop cannot accept nested JSX formatting tags. The component must transition from a string attribute to the standard `children` prop.

> [!DEFINITION]
> **What is children?** [REVIEW] The `children` identifier is an ordinary React prop that receives whatever elements sit between a component's opening and closing tags.
> 1. React packages markup placed between tags into `props.children`: `<Button>Save for later</Button>`.
> 2. The child component renders `{children}` in its JSX layout wherever that nested content should appear.
> 3. The parent component owns and defines the passed markup, while the child component controls its layout placement (Lesson 09).

The page now renders these two buttons with their nested markup:

```tsx title="The two buttons the page needs, with their content between the tags"
<Button>~Add to cart <b>$200</b>~</Button> {/* Text and a bold tag together */}
<Button variant="secondary">~Save for later~</Button> {/* Plain text only */}
```

### VS | `children: React.ReactElement` vs. `children: React.ReactNode`: one accepts only a tag, while the other accepts everything

To support nested content, `ButtonProps` must declare a type for `children`. Consider three candidate types:

```tsx title="Three types for children, and what each one accepts"
children: ~string~; // 1. Accepts Save for later; refuses Add to cart with the bold tag
children: ~React.ReactElement~; // 2. Accepts one tag alone; refuses the text Save for later
children: ~React.ReactNode~; // 3. Accepts both buttons, and anything else a page places between the tags
```

The second candidate represents a frequent mistake. The name `React.ReactElement` sounds like the natural choice for JSX content. In practice, the two types behave very differently:
1. **With `children: string`**, the plain text in `Save for later` succeeds. Passing mixed content containing both text and a bold tag fails because the input is not a single string primitive.
2. **With `children: React.ReactElement`**, only an isolated JSX element succeeds. Passing the plain text `Save for later` fails because a primitive string is not an element object. Official React documentation clarifies that this type covers only JSX elements, excluding primitive strings and numbers.
3. **With `children: React.ReactNode`**, both buttons compile without errors. Official React documentation defines this type as the full union of all valid types that JSX can render as children.

> [!DEFINITION]
> **What is an element?** [REVIEW] A React element is a lightweight JavaScript object that describes a virtual DOM node.
> 1. Transpiling JSX creates an element object: `<b>$200</b>` becomes an object with `{ type: 'b', props: { children: '$200' } }`.
> 2. React reconciles element objects to create and update actual browser DOM nodes.
> 3. Primitive values like strings and numbers are valid render targets, but they are not element objects (Lesson 76).

> [!DEFINITION]
> **What is React.ReactNode?** [NEW] `React.ReactNode` is the comprehensive type for any value that React can render inside JSX markup.
> 1. It encompasses primitive types: strings, numbers, booleans, `null`, and `undefined`.
> 2. It encompasses structured types: individual React elements, React fragments, and arrays of nodes.
> 3. `React.ReactElement` is only a narrow subtype covering JSX element objects, which is why `React.ReactElement` rejects plain text strings (Lesson 90).

Plain text represents the most common content placed inside buttons. A props type that rejects plain text cannot serve as a reusable container contract.

```tree caption="Three types for children: only React.ReactNode accepts both the text and the text with a bold tag."
Which type fits `children` in `ButtonProps`
- !`children: string` [`Save for later`] | Accepts **plain text** only | **Refuses** `Add to cart` with the **bold price**
- !`children: React.ReactElement` [`<b>$200</b>`] | Accepts **one JSX tag** only | **Refuses** the plain text **`Save for later`**
- +`children: React.ReactNode` [`Save for later` `Add to cart <b>$200</b>`] | Accepts **everything** a page may place between the tags | **Both buttons pass**
```

### The button with `children`

The component replaces the previous `label` prop with `children`:

```tsx title="src/components/Button.tsx"
import './Button.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  ~children: React.ReactNode~; // Text, tags, or both: whatever the page places between the tags
}

export default function Button({ variant = 'primary', children }: ButtonProps) {
  return <button className={variant}>{~children~}</button>; // Places the page's content inside the button
}
```

Where does the `React` namespace originate? The types package for React installed in the project root declares global React types. It exposes standard definitions under the `React` namespace, allowing components to reference `React.ReactNode` directly.

The consumer page writes nested content between opening and closing component tags:

```tsx title="src/App.tsx" startLine="8"
      ~<Button>Add to cart <b>$200</b></Button>~ {/* Passes: React.ReactNode accepts text and a tag */}
      <Button variant="secondary">Save for later</Button>
```

```page width=text caption="The product page with children: Add to cart now shows the price, which is in bold on the real page."
heading: Wireless headphones
line: $200
form:
  button: Add to cart $200
  button: Save for later
console: quiet
```

```dom caption="What the Elements panel shows for the two buttons: the content from between the tags sits inside each button."
<main>
  <h1>Wireless headphones</h1>
  <p>$200</p>
+ <button class="primary">Add to cart <b>$200</b></button> | note: children: text and a bold tag
+ <button class="secondary">Save for later</button> | note: children: plain text
</main>
```

Supporting `children` protects the shared component from constant churn. Without `children`, each new design request adds another specialized prop for badges, icons, or prices. Using `children: React.ReactNode` keeps the component contract minimal while allowing consumers to compose whatever markup they require.

### What no type can say

Occasionally a design requires restricting children to a specific element tag, such as a custom list component that should accept only `<li>` items. TypeScript cannot enforce that constraint in JSX. Official React documentation confirms that TypeScript cannot restrict children to specific JSX element types. `React.ReactElement` describes any generic element, and static types cannot filter by tag name.

Always type `children` as `React.ReactNode` so that plain text and compound markup compile cleanly.

---

## PRINCIPLE | `extends React.ComponentPropsWithRef<'button'>`: the button accepts every attribute of a real `<button>`

> [!PRINCIPLE]
> **Principle 4: Wrapping a Tag: Extend the Props of `<button>` and Pass the Rest**
>
> *When a shared component wraps one built-in tag, extend the type of all that tag's props, `React.ComponentPropsWithRef<'button'>`, add only the component's own props, and pass the rest to the tag with spread.*
>
> A hand-written list accepts only what it names. The shared button refuses `disabled`, then `type`, then `onClick`, and it silently drops `aria-label`. So developers write plain buttons by hand next to it. Extending the props of `<button>` makes the shared button accept everything a real `<button>` accepts. The rest property collects every prop the component does not use, and `{...rest}` hands it to the tag, `children` and `ref` included.
>
> **DO THIS:**
> ```tsx
> interface ButtonProps ~extends React.ComponentPropsWithRef<'button'>~ { // Every attribute of <button>
>   variant?: 'primary' | 'secondary';
> }
> function Button({ variant = 'primary', ...rest }: ButtonProps) {
>   return <button className={variant} ~{...rest}~ />; // disabled, aria-label, and children reach the tag
> }
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> interface ButtonProps {
>   variant?: 'primary' | 'secondary';
>   children: React.ReactNode;
>   ~disabled?: boolean~; // **WRONG:** the next page needs type="submit", and the type-checker refuses it
> }
> ```

### The headphones are sold out

Inventory runs out for the wireless headphones, requiring the purchase button to be disabled. Standard HTML button elements support this state through the `disabled` attribute. The product page adds the attribute to our custom button:

```tsx title="src/App.tsx" startLine="8"
      <Button ~disabled~>Add to cart <b>$200</b></Button> {/* **WRONG:** the editor underlines disabled: ButtonProps does not list it */}
```

The editor immediately marks `disabled` as a compiler error. The `Button` component is a custom wrapper rather than a native HTML element. The compiler evaluates the tag against `ButtonProps`, which currently declares only the variant and children properties.

Furthermore, if a developer ignores the compiler error, the button remains active in the browser. The custom component does not forward `disabled` to the underlying DOM node, leaving the button clickable.

### VS | Listing `disabled` by hand vs. extending the props of `<button>`: both turn the button off, while only the second accepts the next attribute

One immediate fix is adding `disabled?: boolean` to `ButtonProps` and manually passing it down. Official React button examples demonstrate this manual technique:

```tsx title="Listing disabled by hand"
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  ~disabled?: boolean~; // 1. One line in the type for this one attribute
}

function Button({ variant = 'primary', children, disabled }: ButtonProps) {
  return <button className={variant} ~disabled={disabled}~>{children}</button>; // 2. One pass to the real tag
}
```

The second approach extends the type of all native button attributes and declares only our custom additions:

```tsx title="Taking every attribute of button"
interface ButtonProps ~extends React.ComponentPropsWithRef<'button'>~ { // 1. Every prop a <button> tag accepts
  variant?: 'primary' | 'secondary'; // 2. Plus our own prop
}

function Button({ variant = 'primary', ~...rest~ }: ButtonProps) { // 3. Every other prop lands in rest
  return <button className={variant} ~{...rest}~ />; // 4. All of them reach the real tag
}
```

Both solutions disable the button when stock runs out. However, their scalability and maintenance overhead differ completely:
- **Listing props manually** supports only the explicitly declared attributes. When a form requires `type="submit"`, the compiler flags an error. When an event listener requires `onClick` or a consumer passes a `ref`, the compiler rejects both. Every standard HTML attribute requires modifying the interface and forwarding the prop by hand.
- **Extending `React.ComponentPropsWithRef<'button'>`** inherits every native button attribute automatically. The component supports `disabled`, accessibility labels, button types, click handlers, and refs without requiring any ongoing interface updates.

Manual prop lists create an additional risk with hyphenated accessibility attributes. If accessibility auditors request `aria-label` on an icon-only button, the attribute might pass unchecked in loose configurations. Without prop forwarding, the component drops the attribute silently, breaking assistive screen readers in production.

A component wrapping a single native tag should inherit all props of that tag and declare only its own custom extensions.

```tree caption="Two ways to let the shared button take disabled: one line per attribute, or every attribute of button at once."
Two ways to let `Button` take `disabled`
- !List each attribute by hand [`disabled?: boolean`] | Accepts **`disabled`** and nothing more | Every new request needs **a new line and a new pass**
- +Extend the props of `<button>` [`extends React.ComponentPropsWithRef<'button'>`] | Accepts **every attribute** of `<button>` | `aria-label`, `type`, `onClick`, and `ref` **already pass**
```

### The three new pieces of the extended type

Extending native component props introduces three complementary techniques:

> [!DEFINITION]
> **What do extends and React.ComponentPropsWithRef mean?** [NEW] Extending a type inherits all its properties while allowing you to append custom component props.
> 1. The `extends` keyword copies all type declarations from the target interface into your new interface: `interface ButtonProps extends React.ComponentPropsWithRef<'button'>`.
> 2. `React.ComponentPropsWithRef` provides the full props type of any standard HTML element, including native attributes, event handlers, and refs.
> 3. The tag string in angle brackets is a generic type argument: `'button'` extracts `<button>` attributes, while `'input'` would extract `<input>` attributes (Lesson 90).

> [!DEFINITION]
> **What is the rest property?** [NEW] Rest syntax in JavaScript object destructuring gathers all unextracted properties into a single new object.
> 1. You isolate custom props while preserving everything else: `const { variant, ...rest } = props`.
> 2. The variable `variant` receives its matching value, while the new `rest` object contains every remaining key-value pair.
> 3. JavaScript requires rest syntax to sit as the final element in any destructuring pattern (Lesson 90).

Here is how props flow through the disabled button component:
1. React provides a single props object containing disabled and children props, while `variant` is omitted.
2. Destructuring extracts `variant` by name, assigning the default value `'primary'`.
3. Object rest syntax collects all remaining properties into `rest`, holding the disabled flag and the children.
4. The JSX spread expression `{...rest}` forwards all collected properties directly onto the native button tag (Lesson 09).

### Surprise: `children` and `ref` come along

Notice an important simplification in the extended interface. The type declaration contains no explicit line for children, and the component signature omits children from named destructuring. Yet consumers can pass nested bold elements, and the markup renders correctly inside the button. Two mechanics explain this behavior:
1. **The native button type already includes children.** `React.ComponentPropsWithRef<'button'>` declares children as part of standard button attributes.
2. **The component collects children inside `rest`.** Because children is not destructured by name, it lands inside `rest`. The JSX spread `{...rest}` forwards children to the native button tag, which renders nested content as expected.

Component refs operate identically. In React 19, a ref is a standard component prop on function components (Lesson 85). Because `ComponentPropsWithRef` includes a typed ref attribute, callers can pass refs directly. The spread `{...rest}` forwards them to the DOM node without wrapping the component in `forwardRef`.

Here is the updated component file:

```tsx title="src/components/Button.tsx"
import './Button.css';

interface ButtonProps ~extends React.ComponentPropsWithRef<'button'>~ { // Every prop of <button>, children and ref included
  variant?: 'primary' | 'secondary';
}

export default function Button({ variant = 'primary', ~...rest~ }: ButtonProps) { // disabled and children land in rest
  return <button className={variant} {...rest} />;
}
```

The disabled purchase button now compiles and functions without errors:

```tsx title="src/App.tsx" startLine="8"
      <Button ~disabled~>Add to cart <b>$200</b></Button> {/* Passes: disabled is a prop of <button> */}
      <Button variant="secondary">Save for later</Button>
```

The companion stylesheet defines a dimmed appearance for disabled buttons. Without explicit disabled styling, the dark background of the primary variant overrides standard browser disabled visuals.

```page width=text caption="The product page while the headphones are sold out: Add to cart is dimmed, and clicking it does nothing."
heading: Wireless headphones
line: $200
form:
  button: Add to cart $200 | | disabled
  button: Save for later
console: quiet
```

```dom caption="What the Elements panel shows for the sold-out button: disabled reached the real button through rest."
<main>
  <h1>Wireless headphones</h1>
  <p>$200</p>
+ <button class="primary" disabled>Add to cart <b>$200</b></button> | note: disabled and children came through rest
  <button class="secondary">Save for later</button>
</main>
```

A reusable component wrapping an HTML tag should always accept the full attribute surface of that underlying tag.

---

## All 4 Principles Together

### The complete code

The shared component file defines the button and exports its typed interface:

```tsx title="src/components/Button.tsx"
import './Button.css';

interface ButtonProps ~extends React.ComponentPropsWithRef<'button'>~ { // 4. Every prop of <button>, children and ref included
  ~variant?: 'primary' | 'secondary'~; // 2. Optional, and only two words
}

export default function Button({ ~variant = 'primary'~, ...rest }: ButtonProps) { // 1. Typed props; 2. the default value
  return <button className={variant} {...rest} />; // 3. children reach the tag through rest
}
```

The styling file defines visual appearances for variants and disabled states:

```css title="src/components/Button.css"
.primary {
  background: black;
  color: white;
}

.secondary {
  background: white;
  border: 1px solid black;
}

button:disabled {
  opacity: 0.5;
}
```

The consumer page mounts both buttons with customized properties and content:

```tsx title="src/App.tsx"
import Button from './components/Button';

export default function App() {
  return (
    <main>
      <h1>Wireless headphones</h1>
      <p>$200</p>
      <Button ~disabled~>Add to cart <b>$200</b></Button> {/* No variant: filled; disabled: sold out */}
      <Button ~variant="secondary"~>Save for later</Button> {/* An outline */}
    </main>
  );
}
```

```page width=text caption="The finished product page: Add to cart is turned off while the headphones are sold out, and Save for later has an outline."
heading: Wireless headphones
line: $200
form:
  button: Add to cart $200 | | disabled
  button: Save for later
console: quiet
```

### The order in which React calls the components

When rendering begins, React executes `App` first. `App` returns markup containing two button tags, causing React to invoke `Button` twice in sequence. Static type analysis finished earlier during compilation, so no type logic executes during rendering:

```tree caption="The order in which React calls the components of the product page; the types were checked before this, in the editor."
`App` [1. Called first] | Returns `<main>` with **two `<Button>` tags**
- +`Button` for `Add to cart` [2. Called second] | `variant` is missing, so it is **`'primary'`** | Returns a **filled button** that is **turned off**
- +`Button` for `Save for later` [3. Called third] | `variant` is **`'secondary'`** | Returns a **button with an outline**
```

| The request | Without a good type | With the type from this lesson |
| :--- | :--- | :--- |
| **A misspelled prop, such as `lable`** | The user sees an empty button, and the Console stays quiet | The editor underlines `lable` before the page opens |
| **A style that pages may leave out** | `variant: string` lets `secondery` through, and the button has no style | `variant?: 'primary' \| 'secondary'` with `variant = 'primary'` in the parameter list |
| **Text and a bold price inside the button** | `string` or `React.ReactElement` refuses one of the two buttons | `React.ReactNode` accepts both |
| **`disabled` when the item is sold out** | A hand-written list refuses each new attribute | `extends React.ComponentPropsWithRef<'button'>` with `{...rest}` on the tag |
| **Where props are checked** | Nowhere: React 19 ignores `propTypes` | In the editor and in the build command, never in the browser |

Remember the central lesson of component typing. A component receives a single props object: define it once with a type, and the editor verifies every tag before your application runs.

---

## For the Interview

> **The Interview Question:** How do you type React components, props, optional attributes, and children in TypeScript?

### How to Answer Clearly in 30 Seconds

"A React component receives a single props object, which I type after the parameter using a named `interface` or `type` in a `.tsx` file. The TypeScript compiler verifies every tag attribute against this contract during editing and compilation. In modern React, no validation runs inside the browser, and React 19 ignores `propTypes`. Three essential rules complete the pattern:
1. **Optional props**: Mark them with `?`, constrain discrete options using string literal unions like `'primary' | 'secondary'`, and declare fallback values using ES6 default parameters, because React 19 removed `defaultProps`.
2. **Children**: Type `children` as `React.ReactNode` to accept strings, numbers, elements, and fragments. Typing children as `React.ReactElement` rejects primitive strings.
3. **Wrapping native HTML elements**: When wrapping an element like `<button>`, extend `React.ComponentPropsWithRef<'button'>`, add custom props, and forward unextracted properties using object rest and JSX spread syntax. This automatically forwards `children`, event handlers, and refs."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"If you type your props, does React check them in the browser?"**
   No. All TypeScript types are erased during build transpilation, so the browser executes plain JavaScript identical to an untyped application. The type-checker operates solely inside the editor and during automated build scripts. While earlier React versions performed runtime validation via `propTypes`, React 19 removed runtime prop checking and silently ignores `propTypes`. If an untyped typo reaches production, the component receives `undefined` and renders empty output without logging a console error.
2. **"Should you write `const Button: React.FC<ButtonProps>`?"**
   Modern React conventions discourage using `React.FC`. In older versions of `@types/react`, `React.FC` automatically injected `children` into every component, even when the component did not support child elements. Although modern definitions removed that default, `React.FC` remains unnecessary and verbose. It complicates typing generic components and cannot be used with standard function declarations. Typing the parameter directly with `function Button({ variant = 'primary', ...rest }: ButtonProps)` is cleaner, supports standard default values, and matches official React documentation.
3. **"A page passes its own `className` to your shared button. What happens?"**
   It depends on attribute ordering on the JSX element (Lesson 09). In `<button className={variant} {...rest} />`, `rest` appears second, allowing a consumer's incoming `className` to overwrite the component's internal variant class. In `<button {...rest} className={variant} />`, `className={variant}` appears second, guaranteeing that internal variant styles override consumer classes. Component authors choose attribute order intentionally, or merge both values using template strings. Official React documentation advises using spread syntax with restraint, and wrapping a single native element is the exact scenario where prop spread is appropriate.

```tree dir=right caption="Interview summary: the four parts of a component that TypeScript describes, and the type for each."
What to type on a shared component
- +The props object [`interface ButtonProps`] | Written after the **destructured parameter** | Checked in the **editor**, never in the browser
- +Optional props [`variant?`] | `?` plus a **union of words** | The default value goes in the **parameter list**
- +Children [`children: React.ReactNode`] | Accepts **text, numbers, and tags** | `React.ReactElement` **refuses plain text**
- +Attributes of the wrapped tag [`extends React.ComponentPropsWithRef<'button'>`] | Every prop of `<button>` | `{...rest}` passes them on, **`children` and `ref` included**
```
