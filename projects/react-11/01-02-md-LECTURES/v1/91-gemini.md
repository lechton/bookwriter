# Lecture 91: How a Search Field Handler Gets the Type of Its Event

*(Why does TypeScript know what `e` is inside `onChange`, and forget it the moment you move the handler out?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | How do you type event handlers and SyntheticEvents in TypeScript?

---

## VS | An Inline Handler vs. a Separate Handler: TypeScript knows the type of `e` inside the tag, and our code must write it everywhere else

> When a user types into an input field, React invokes your event handler and passes an event object named `e`. **In TypeScript, that parameter requires an explicit type contract.** An inline handler receives its type automatically through contextual inference from JSX. A standalone function requires you to write the type explicitly, such as `React.ChangeEvent<HTMLInputElement>`. Omitting types or resorting to `any` allows spelling mistakes to reach production as silent runtime bugs.

In plain JavaScript, event listeners receive an event object directly from the browser:

```js title="Plain JavaScript: the browser passes the event object"
input.addEventListener('input', function (~e~) { // e is the event object, and JavaScript never asks what it is
  console.log(e.currentTarget.value);
});
```

JavaScript performs no static type validation on the event parameter. You can read properties from `e.currentTarget.value` without compiler checks. If you misspell a property, the application discovers the mistake only when the code executes in a browser.

TypeScript requires type annotations for function parameters. As demonstrated in Lesson 90, every function argument requires a declared shape. An event handler is a function, and `e` is its parameter. Consequently, the compiler expects a type contract for `e`.

An inline handler produces an unexpected convenience. When defined directly on a JSX attribute, the parameter requires no type annotation:

```tsx title="The same handler body, inline and moved out"
const [query, setQuery] = useState('');

<input value={query} onChange={~e~ => setQuery(e.currentTarget.value)} /> {/* 1. Inline: no error, TypeScript already knows what e is */}

function handleChange(~e~) { // 2. Moved out: **WRONG:** the editor underlines e, because e has no type
  setQuery(e.currentTarget.value);
}
```

Both functions contain identical logic. In the production bundle, the build tool removes all type annotations, so both run identically in the browser (Lesson 90). The difference lies entirely in how TypeScript determines types during authoring:
- **The inline handler** sits directly inside the `onChange` attribute. TypeScript inspects the prop definition on the input element and knows the exact event type.
- **`handleChange`** exists as an independent function. Because no surrounding context specifies which element calls it, the editor flags `e` as an untyped parameter.

> [!DEFINITION]
> **The React event object.** [REVIEW] React wraps native browser DOM events in a cross-browser wrapper called `SyntheticEvent`. When an interaction occurs, React instantiates this wrapper and passes it to your handler as `e`.
> 1. React owns and dispatches the event object automatically. You never construct or pass it manually.
> 2. `e.currentTarget` identifies the element to which the handler is attached.
> 3. `e.target` identifies the element where the interaction originally began before bubbling.
> 4. The underlying browser event remains accessible through `e.nativeEvent` (Lesson 11).

```tree caption="The same handler body in two places: the browser runs both the same way, but only the inline one has a type for e."
The same handler body in two places
- +Inline inside `onChange` [`onChange={e => setQuery}`] | TypeScript reads the type of `onChange` | `e` is a **`React.ChangeEvent`** on the input, and nobody wrote it
- !Moved out into `handleChange` [`function handleChange`] | Nothing around the function says what `e` is | The editor **underlines `e`** until our code writes its type
```

The location of the handler determines where `e` gets its type. Inline handlers receive types from React prop definitions. Separate functions require manual type annotations, declaring the event wrapper followed by the target element in angle brackets.

### What goes wrong with `e: any`

Developers often silence the editor warning on `e` by adding `any`.

> [!DEFINITION]
> **What is `any`?** [NEW] `any` is an escape hatch in TypeScript that disables static type checking on a value.
> 1. The compiler accepts any property access, method invocation, or assignment without verification.
> 2. Applying `e: any` removes the red underline from the parameter, but also disables all safety guarantees.
> 3. Misspelled properties pass the compiler silently and evaluate to `undefined` during execution (Lesson 91).

The following code illustrates how a spelling mistake escapes into production:

```tsx title="handleChange silenced with e: any"
function handleChange(~e: any~) { // The underline on e is gone, and so is every check on e
  setQuery(e.currentTarget.~vlaue~); // **WRONG:** value is misspelled, so setQuery receives undefined
}
```

1. A developer adds `e: any` to remove the editor warning quickly.
2. Later, another developer edits the function and misspells `value` as `vlaue`. Because `e` is typed as `any`, the compiler raises no warning.
3. The user types `shoes` into the search box. On each keystroke, the state setter receives undefined because the input element has no property named `vlaue`.

The interface under the input expects to display `Results for: shoes`. Instead, it displays only `Results for:`. The input field itself continues to display the typed letters because an input whose `value` becomes `undefined` turns into an uncontrolled element (Lesson 20). React also prints a warning in the browser console:

```page width=full caption="The search field after the user types shoes, with vlaue misspelled behind e: any: the field keeps the letters, and the results line stays empty."
form:
  field: Search the store | shoes
line: Results for: | bad
console: A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components
```

With an accurate type on `e`, the compiler highlights `vlaue` immediately in the editor. An `HTMLInputElement` provides no property by that name. The mistake is resolved before code reaches the repository.

### The Rule of Thumb: inline, write nothing; moved out, write the event and the element

Inline handlers receive automatic types from TypeScript. In a separate function, declare the type yourself by writing the event wrapper followed by the element in angle brackets. Avoid silencing `e` with `any`.

Senior engineers recognize three frequent typing mistakes:
1. **`e: any`.** The editor warning disappears, but all type safety is eliminated, allowing typos to reach users.
2. **`e: Event`, using the native DOM event type.** React passes a synthetic event wrapper rather than a native DOM event, so assigning this function to `onChange` triggers a compiler error.
3. **`React.ChangeEvent` without an element type argument.** Omitting the type in angle brackets defaults the element to a generic `Element` interface, which does not provide a `value` property.

## SECTION | A Search Field at the Top of an Online Store

Most online stores feature a search bar in their header navigation. When a customer types `shoes`, a summary line below the input displays `Results for: shoes`:

```page width=text caption="The search field we build: the user types shoes, and the results line repeats it."
form:
  field: Search the store | shoes | good
line: Results for: shoes | good
console: quiet
```

Store interfaces frequently allow users to press Escape to dismiss a search. Pressing Escape clears the input, resets the results line, and removes focus from the field.

Handling the Escape key requires multi-statement logic. Combining key detection and focus management inside a single JSX attribute produces cluttered markup. Developers extract that logic into a dedicated function. When a handler leaves the tag, our code must declare which event and element it processes.

You can provide a type for `e` using three distinct techniques:
1. **Declare the handler inline to leverage contextual inference.** This pattern suits concise, single-line updates.
2. **Declare an extracted function and type its parameter:** `function handleChange(e: React.ChangeEvent<HTMLInputElement>)`. This represents the primary pattern documented in official React guides.
3. **Declare an extracted function and type the function variable** using `React.ChangeEventHandler<HTMLInputElement>`. Official React guides recommend this pattern when working with `useCallback` or matching specific styling conventions.

```tree caption="Three ways to give e a type: let TypeScript work it out inline, type the parameter, or type the whole function."
Three ways to give `e` a type
- +1. Inline on the tag [`onChange={e => setQuery}`] | TypeScript **works out the type** from `onChange` | Fits a **one-line** handler
- +2. Type the parameter [`e: React.ChangeEvent<HTMLInputElement>`] | Our code writes the **type of the event object** | Fits a handler of **several lines**
- +3. Type the whole function [`React.ChangeEventHandler<HTMLInputElement>`] | Our code writes the **type of the function** | `e` is worked out from it, **as inline**
```

We demonstrate these techniques in a focused React TypeScript project, following the foundation from Lesson 90:

```files title="store-search: File Explorer" caption="Our project files: App.tsx places the search field, and SearchBar.tsx holds the field, its state, and its handlers."
index.html | entry | The HTML page with the empty root div where React mounts
tsconfig.json | settings | Tells TypeScript how to read the project
src/
  main.tsx | boundary | Imports `App` from `./App` and mounts it into `#root`
  App.tsx | parent | Exports `App` as default and imports `SearchBar`
  components/
    SearchBar.tsx | state | Holds `query` in state, the search field, the results line, and the handlers
```

**PRINCIPLES:** React delivers synthetic event objects to your functions. TypeScript determines the event type either from JSX context or explicit code annotations. Five architectural principles govern typing event handlers:
1. **Principle 1: `onChange={e => ...}` contextually types inline handlers.** Your code writes no manual annotations. Hovering over `e` reveals the inferred type.
2. **Principle 2: `e: React.ChangeEvent<HTMLInputElement>` types separate handlers.** Because no JSX context surrounds the function, you declare the event wrapper and target element manually.
3. **Principle 3: `React.ChangeEventHandler<HTMLInputElement>` types the entire function.** The parameter `e` inherits the exact same type contract as Principle 2.
4. **Principle 4: `React.KeyboardEvent<HTMLInputElement>` handles key interactions.** The event category determines available properties, and only keyboard events supply `e.key`.
5. **Principle 5: `e.currentTarget` guarantees access to the listening element.** The compiler types `e.currentTarget` accurately, while `e.target` remains loosely typed.

---

## PRINCIPLE | `onChange={e => ...}`: the inline handler gets the type of `e` without one written word

> [!PRINCIPLE]
> **Principle 1: Inline Handlers: `onChange` Hands the Inline Handler Its Type**
>
> *When a handler is written inline inside `onChange={...}`, TypeScript infers the type of `e` from `onChange`; write no type, and hover over `e` to see it.*
>
> React's types already describe `onChange` on an `<input>` as a function that receives a `React.ChangeEvent` for that input. TypeScript hands that type to the function written there, so the editor checks every property our code reads from `e`. Writing `e: any` inline throws that type away, and a typo such as `vlaue` reaches the user as an empty results line.
>
> **DO THIS:**
> ```tsx
> <input value={query} onChange={~e~ => setQuery(e.currentTarget.value)} /> {/* e is inferred as React.ChangeEvent<HTMLInputElement, HTMLInputElement> */}
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> <input value={query} onChange={(~e: any~) => setQuery(e.currentTarget.vlaue)} /> {/* **WRONG:** any removes the type, so the typo vlaue is never caught */}
> ```

Consider an inline handler declared on an input element. Hovering over `e` in your code editor displays an inferred type:

```tsx title="The handler written inline inside onChange"
<input value={query} onChange={~e~ => setQuery(e.currentTarget.value)} /> {/* Hover over e: the editor shows React.ChangeEvent<HTMLInputElement, HTMLInputElement> */}
```

You wrote no type annotations for this parameter. The compiler deduced the type directly from the `onChange` prop.

> [!DEFINITION]
> **What does inferring a type mean?** [NEW] Type inference is TypeScript's ability to deduce a data type automatically from surrounding code context.
> 1. In basic variable assignment, `const name = 'John'` causes TypeScript to infer `string` without an explicit annotation.
> 2. When an arrow function is assigned to a JSX attribute, TypeScript performs contextual typing.
> 3. The compiler inspects the prop signature in the React declaration files and contextually types `e` to match that callback (Lesson 91).

### The two names in the type

The inferred type consists of two core components:
- **`React.ChangeEvent`** represents the synthetic event interface for form modifications. It originates from the React declaration package.
- **`HTMLInputElement`** represents the browser interface for native input elements. TypeScript accesses this definition through the standard browser library.

When inspecting the hover tooltip, `HTMLInputElement` may appear twice. The second parameter historically marked the element where the event originated. For input fields, both positions represent the same element because inputs contain no child elements. Modern React type declarations require only the first element parameter, so writing `React.ChangeEvent<HTMLInputElement>` provides complete verification.

### The type comes from the editor, the value comes from the browser

The type and runtime value of `e` originate from separate sources at different stages:

TypeScript determines the type during compilation through three steps:
1. React type declarations define every attribute on `<input>`. They define `onChange` as a callback accepting `React.ChangeEvent`.
2. The compiler detects your arrow function passed directly to `onChange`.
3. The compiler contextually assigns the change event type to the first parameter, `e`.

The runtime value arrives when users interact with the page. Each time a user types a character, React generates a synthetic event and delivers it to the callback (Lesson 11).

```tree dir=right caption="The type of e comes from the types of React before the code runs; the value of e comes from React when the user types."
Two sources for `e` in the inline handler
- +The type of `e`, in the editor [`onChange={e => setQuery}`] | `@types/react` describes `onChange` | TypeScript gives `e` the type **`React.ChangeEvent<HTMLInputElement, HTMLInputElement>`**
- +The value of `e`, in the browser | The user **types a letter** in the field | React calls the handler and passes the **React event object**
```

Because `e` carries a verified type contract, the editor checks every property access. If a developer misspells `value`, the compiler catches the defect immediately:

```tsx title="A typo in the inline handler"
<input value={query} onChange={e => setQuery(e.currentTarget.~vlaue~)} /> {/* **WRONG:** the editor underlines vlaue: an HTMLInputElement has no property with that name */}
```

### Our search field with the inline handler

Here is our initial `SearchBar` component. It stores the input string in `query` and renders the value in the summary line:

```tsx title="src/components/SearchBar.tsx"
import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <label>
        Search the store
        <input value={query} onChange={~e => setQuery(e.currentTarget.value)~} /> {/* Inline: e gets its type from onChange */}
      </label>
      <p>Results for: {query}</p>
    </div>
  );
}
```

The `App` component renders the search component onto the screen:

```tsx title="src/App.tsx"
import SearchBar from './components/SearchBar';

export default function App() {
  return ~<SearchBar />~; // React calls SearchBar and puts the search field on the page
}
```

When a user types `shoes`, both the input field and the text line reflect the value:

```page width=full caption="The search field after the user types shoes: the field and the results line both show shoes."
form:
  field: Search the store | shoes | good
line: Results for: shoes | good
console: quiet
```

### The habit that throws the inferred type away

Developers accustomed to JavaScript sometimes annotate inline handler parameters with `: any`. Adding `any` inline discards valuable compiler guarantees. TypeScript had already inferred an accurate type, and `any` strips away all property verification:

```tsx title="e: any written on the inline handler"
<input value={query} onChange={(~e: any~) => setQuery(e.currentTarget.vlaue)} /> {/* **WRONG:** any replaces the inferred type, so the typo vlaue passes and the results line stays empty */}
```

Leave inline parameters unannotated. TypeScript contextually types `e` without intervention.

---

## PRINCIPLE | `e: React.ChangeEvent<HTMLInputElement>`: a separate handler is checked exactly like the inline one

> [!PRINCIPLE]
> **Principle 2: Separate Handlers: Write `React.ChangeEvent<HTMLInputElement>` on `e`**
>
> *When the handler is moved into its own function, write the type of its parameter: the event type, then the element type in angle brackets.*
>
> Inline, the type of `e` came from the tag. A function on its own lines has no tag around it, so in strict mode the editor underlines `e` until our code writes its type. `any` removes the underline and every check with it. The browser's `Event` names the wrong object, because React passes its own event object. `React.ChangeEvent<HTMLInputElement>` gives `e` the same checks as the inline handler.
>
> **DO THIS:**
> ```tsx
> function handleChange(~e: React.ChangeEvent<HTMLInputElement>~) { // The same checks as the inline handler
>   setQuery(e.currentTarget.value);
> }
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> function handleChange(~e: any~) { // **WRONG:** no check on e, so the typo vlaue empties the results line
>   setQuery(e.currentTarget.vlaue);
> }
> ```

Moving the callback logic from the JSX attribute into an extracted function leaves its type behind. The type was not declared in the function body:

```tsx title="handleChange with no type on e"
function handleChange(~e~) { // **WRONG:** the editor underlines e: it has no type
  setQuery(e.currentTarget.value);
}

<input value={query} onChange={handleChange} />
```

Official React documentation emphasizes this rule: when extracting a function to pass as an event handler, you must set the event type explicitly.

Why does omitting a parameter type trigger an error? The project runs with strict compiler flags enabled.

> [!DEFINITION]
> **What is strict mode in TypeScript?** [NEW] Strict mode is a compiler configuration that activates rigorous type checking rules.
> 1. Setting `"strict": true` in `tsconfig.json` enables checks such as `noImplicitAny`.
> 2. Under `noImplicitAny`, the compiler flags any parameter whose type cannot be inferred from context.
> 3. TypeScript strict mode operates during compilation and is completely distinct from React's runtime `<StrictMode>` component (Lesson 12, Lesson 91).

### Writing the type by hand

To satisfy strict mode, your code writes an explicit type annotation after `e`. This annotation mirrors the inferred type from the inline handler:

```tsx title="handleChange with e typed by hand"
function handleChange(~e: React.ChangeEvent<HTMLInputElement>~) { // The event type, then the element type in angle brackets
  setQuery(e.currentTarget.value);
}

<input value={query} ~onChange={handleChange}~ /> {/* TypeScript checks that handleChange fits what onChange expects */}
```

The type annotation answers two fundamental requirements:
1. **Which event category?** `ChangeEvent`, because the callback executes when form input values update.
2. **Which DOM element?** `HTMLInputElement`, enclosed in angle brackets, because the handler attaches to an `<input>`.

Consider how these different function signatures compare:
- **No type versus `e: any`:** Both leave properties unverified. Using `any` merely hides the compiler warning without providing safety.
- **`e: React.ChangeEvent<HTMLInputElement>` versus an inline handler:** Both provide identical compile-time protection. Inline handlers infer the type, while extracted functions declare it explicitly.

```tree caption="Three ways to write handleChange: no type and any leave e unchecked, while React.ChangeEvent with the element type checks e as inline."
How `handleChange` can type `e`
- !No type [`function handleChange`] | The editor **underlines `e`** in strict mode | `e` is **not checked**
- !Written as `any` [`e: any`] | The underline **goes away** | `e` is **still not checked**, so `vlaue` passes
- +Written as the event and the element [`e: React.ChangeEvent<HTMLInputElement>`] | The **same checks** as inline | Every property of `e` **is checked**
```

### VS | The browser's `Event` vs. `React.ChangeEvent`: the first names an object React never passes

When faced with an untyped parameter error, developers sometimes reach for the native DOM `Event` interface:

```tsx title="handleChange typed with the browser's Event"
function handleChange(~e: Event~) { // **WRONG:** React does not pass the browser's Event to the handler
  setQuery(e.currentTarget.value);
}

<input value={query} ~onChange={handleChange}~ /> {/* **WRONG:** the editor refuses handleChange here, because onChange passes a React event object */}
```

The compiler rejects assigning this function to `onChange`. React delivers its synthetic event wrapper rather than a raw DOM event. Synthetic events share standard event properties, but they represent distinct TypeScript interfaces. If your application specifically requires the underlying browser event, access it through `e.nativeEvent`.

Inside the function body, the compiler also underlines `e.currentTarget.value`. The browser's general `Event` interface does not assume the target is an input element.

Silencing the error with `any` creates a deceptive fix. Spelling errors like `vlaue` pass through the compiler, and users receive an empty search results line.

### Leaving out the element

Another frequent error involves providing the event interface while omitting the generic element argument:

```tsx title="React.ChangeEvent with no element type"
function handleChange(e: React.ChangeEvent) {
  setQuery(e.currentTarget.~value~); // **WRONG:** the editor underlines value: a plain Element has no value
}
```

Without an element in angle brackets, `React.ChangeEvent` defaults to a generic `Element` interface. A generic `Element` could represent a division, paragraph, or heading, none of which possess a `value` property. Specifying `HTMLInputElement` informs the compiler that the target represents a form input.

### Our search field with `handleChange`

```tsx title="src/components/SearchBar.tsx" startLine="3"
export default function SearchBar() {
  const [query, setQuery] = useState('');

  function ~handleChange~(e: React.ChangeEvent<HTMLInputElement>) { // Moved out of the tag, so our code writes the type of e
    setQuery(e.currentTarget.value);
  }

  return (
    <div>
      <label>
        Search the store
        <input value={query} onChange={handleChange} />
      </label>
      <p>Results for: {query}</p>
    </div>
  );
}
```

The rendered application behaves identically. Typing `shoes` updates the results line as observed in Principle 1. When extracting handlers, remember to declare both the event interface and the element argument.

---

## PRINCIPLE | `React.ChangeEventHandler<HTMLInputElement>`: type the whole function, and `e` gets the exact same type

> [!PRINCIPLE]
> **Principle 3: Handler Types: `React.ChangeEventHandler` Types the Whole Function**
>
> *Type either the parameter with `React.ChangeEvent<HTMLInputElement>`, or the whole function with `React.ChangeEventHandler<HTMLInputElement>`; both give `e` the exact same type.*
>
> `ChangeEvent` is the type of the event object, and `ChangeEventHandler` is the type of a function that receives it. With the function type, TypeScript infers `e` from it, as it does inline. The function type is also the type of a handler prop. Writing the function type on the parameter types `e` as a function, and the editor underlines `e.currentTarget`.
>
> **DO THIS:**
> ```tsx
> const handleChange: ~React.ChangeEventHandler<HTMLInputElement>~ = (e) => { // The type of the function: e is inferred from it
>   setQuery(e.currentTarget.value);
> };
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> function handleChange(~e: React.ChangeEventHandler<HTMLInputElement>~) { // **WRONG:** a function type on the event, so e.currentTarget is an error
>   setQuery(e.currentTarget.value);
> }
> ```

TypeScript provides an alternate technique for typing extracted handlers. Instead of annotating the parameter, you can type the entire function variable:

```tsx title="The type on the parameter, and the type on the whole function"
function handleChange(~e: React.ChangeEvent<HTMLInputElement>~) { // 1. The type of the event object, on the parameter
  setQuery(e.currentTarget.value);
}

const handleChange: ~React.ChangeEventHandler<HTMLInputElement>~ = (e) => { // 2. The type of the whole function: e is inferred from it
  setQuery(e.currentTarget.value);
};
```

Both declarations enforce identical validation rules. In both versions, `e` carries the `React.ChangeEvent<HTMLInputElement>` contract:
- **Annotating the parameter** explicitly types the event object passed into the function.
- **Annotating the variable** types the function signature itself. The type declaration states that the variable holds a callback accepting `React.ChangeEvent<HTMLInputElement>`. TypeScript contextually infers `e`, just as it does for inline handlers.

Official React documentation demonstrates parameter annotations in primary examples, and highlights function types in examples featuring `useCallback`. React type declarations provide dedicated handler types for each interaction category, such as `React.KeyboardEventHandler` for keyboard listeners.

### VS | `ChangeEvent` vs. `ChangeEventHandler`: the first is the event object, the second is the function that receives it

While their names appear almost identical, their structural roles are completely different:
- **`React.ChangeEvent<HTMLInputElement>`** represents the **event object** passed to the callback. This annotation belongs on the parameter `e`.
- **`React.ChangeEventHandler<HTMLInputElement>`** represents the **function signature** that receives that event object. This annotation belongs on the function variable.

```tree caption="ChangeEvent is the type of the event object; ChangeEventHandler is the type of the function that receives it."
Two type names that differ by one word
- +`React.ChangeEvent<HTMLInputElement>` [`e: React.ChangeEvent`] | The type of the **event object** | Goes **after `e`**
- +`React.ChangeEventHandler<HTMLInputElement>` [`const handleChange: React.ChangeEventHandler`] | The type of the **whole function** | Goes **after the function name**
```

Confusing these identifiers leads to placing the function type directly on the parameter:

```tsx title="The function type written on the parameter"
function handleChange(~e: React.ChangeEventHandler<HTMLInputElement>~) { // **WRONG:** e is now typed as a function, not as an event
  setQuery(e.currentTarget.value);
}
```

The editor flags `currentTarget` with an error because a function signature possesses no DOM event properties.

### Where the function type is useful

Function types serve specific architectural purposes where parameter types cannot be applied. When building reusable UI components, event handlers are often received as props from parent components. In component prop interfaces, you declare callback attributes using function types: `onChange?: React.ChangeEventHandler<HTMLInputElement>` (Lesson 90). Function types also clarify memoized handlers wrapped in `useCallback` under strict type environments (Lesson 57).

Our search implementation continues using parameter annotations for the remainder of this lesson. Production behavior remains unchanged because types are removed during compilation.

---

## PRINCIPLE | `React.KeyboardEvent<HTMLInputElement>`: a key handler gets `e.key`, the name of the key the user pressed

> [!PRINCIPLE]
> **Principle 4: Event Types: Each Event Brings Its Own Type**
>
> *Pick the event type from the event the handler listens to: `React.KeyboardEvent<HTMLInputElement>` for `onKeyDown`, `React.ChangeEvent<HTMLInputElement>` for `onChange`.*
>
> The element goes in the angle brackets, and the event decides the type in front of them. A keyboard event has `key`, and a change event does not. Reusing the change event type for a key handler makes `e.key` an error and makes `onKeyDown` refuse the handler. Hover over the prop to see its event type, and use `React.SyntheticEvent` for an event with no type of its own.
>
> **DO THIS:**
> ```tsx
> function handleKeyDown(~e: React.KeyboardEvent<HTMLInputElement>~) { // A key press on the field: e.key exists
>   if (e.key === 'Escape') setQuery('');
> }
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> function handleKeyDown(~e: React.ChangeEvent<HTMLInputElement>~) { // **WRONG:** a change event has no key, and onKeyDown refuses this handler
>   if (e.key === 'Escape') setQuery('');
> }
> ```

We now enhance the search field so pressing Escape resets the search query. React invokes the `onKeyDown` listener whenever a user presses a physical key inside the field. The callback evaluates the pressed key, requiring an extracted function and an appropriate event type:

```tsx title="handleKeyDown empties the field when the user presses Escape"
function handleKeyDown(~e: React.KeyboardEvent<HTMLInputElement>~) { // A key press on an input
  if (~e.key~ === 'Escape') { // The name of the key the user pressed
    setQuery('');
  }
}

<input value={query} onChange={handleChange} onKeyDown={handleKeyDown} />
```

This interaction introduces two key concepts:
- **`React.KeyboardEvent<HTMLInputElement>`** represents the synthetic event wrapper for keyboard interactions on input elements.
- **`e.key`** holds a string representing the physical key pressed, such as Escape or Enter. The browser identifies the key, and React normalizes that identifier on the event object.

### VS | `onChange` vs. `onKeyDown` on the same `<input>`: the element stays, and the event type changes

Both listeners attach to the identical `<input>` element, so their generic element parameter remains unchanged. However, their event categories differ fundamentally:
- **On `onChange`**, the user modifies the input text, generating a `React.ChangeEvent<HTMLInputElement>`. Form change events contain no `key` property.
- **On `onKeyDown`**, the user presses a key, generating a `React.KeyboardEvent<HTMLInputElement>`. Keyboard events supply the `e.key` property.

```tree caption="The same input with two handlers: the element type stays the same, and the event type follows the event."
Two handlers on the same `<input>`
- +`onChange` [`handleChange`] | The text of the field **changes** | `e` is a **`React.ChangeEvent<HTMLInputElement>`**, with **no `key`**
- +`onKeyDown` [`handleKeyDown`] | The user **presses a key** in the field | `e` is a **`React.KeyboardEvent<HTMLInputElement>`**, with **`e.key`**
```

### Copying the first line of `handleChange`

Developers creating a keyboard listener often copy the signature of an existing change handler:

```tsx title="handleKeyDown typed as a change event"
function handleKeyDown(e: React.ChangeEvent<HTMLInputElement>) {
  if (e.~key~ === 'Escape') { // **WRONG:** the editor underlines key: a change event has no key
    setQuery('');
  }
}

<input value={query} onChange={handleChange} ~onKeyDown={handleKeyDown}~ /> {/* **WRONG:** the editor refuses it: onKeyDown passes a keyboard event */}
```

Reusing the wrong event signature generates two compiler errors:
1. Inside the function body, the editor highlights `key` because `ChangeEvent` provides no keyboard properties.
2. On the JSX element, the editor rejects `onKeyDown={handleKeyDown}` because `onKeyDown` passes keyboard events, not change events.

Developers sometimes attempt to force the property using `(e as any).key`.

> [!DEFINITION]
> **What does `as` do?** [NEW] The `as` keyword performs a type assertion, instructing TypeScript to treat an expression as an asserted type.
> 1. Type assertions perform no runtime data conversion or validation.
> 2. Writing `e as any` disables compiler safety checks for that expression.
> 3. If a property name is misspelled while using assertions, TypeScript permits the error silently (Lesson 91).

To determine the correct type, hover over the event attribute on the JSX element in your editor. The tooltip displays the expected event interface. If an interaction lacks a specialized interface, official React documentation recommends using the foundational interface `React.SyntheticEvent`.

### Our search field with Escape

```tsx title="src/components/SearchBar.tsx" startLine="3"
export default function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.currentTarget.value);
  }

  function ~handleKeyDown~(e: React.KeyboardEvent<HTMLInputElement>) { // A key press: its own event type, with e.key
    if (e.key === 'Escape') {
      setQuery('');
    }
  }

  return (
    <div>
      <label>
        Search the store
        <input value={query} onChange={handleChange} onKeyDown={handleKeyDown} />
      </label>
      <p>Results for: {query}</p>
    </div>
  );
}
```

When a user types `shoes` and presses Escape, the input clears and the results line resets:

```page width=full caption="The search field after the user types shoes and then presses Escape: the field and the results line are both empty."
form:
  field: Search the store |  | good
line: Results for: | good
console: quiet
```

Specify the DOM element in angle brackets, and select the event interface based on the interaction.

---

## PRINCIPLE | `e.currentTarget`: always the element with the handler, and typed as that element

> [!PRINCIPLE]
> **Principle 5: `currentTarget`: `e.currentTarget` Knows the Element, `e.target` Does Not**
>
> *To use the element the handler sits on, read `e.currentTarget`; its type is the element in the angle brackets, while `e.target` is typed as a plain `EventTarget` for most events.*
>
> `e.currentTarget` is always the element with the handler, so `@types/react` types it as that element. `e.target` is where the event started, which may be a child, so it is typed loosely. The change event is an exception kept until React 20, which is why `e.target.value` type-checks on `onChange`. Forcing `e.target` with `as` silences the editor, and the code reads the icon instead of the button when the user clicks the icon.
>
> **DO THIS:**
> ```tsx
> function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
>   if (e.key === 'Escape') ~e.currentTarget.blur()~; // currentTarget is typed as the input
> }
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
>   if (e.key === 'Escape') e.target.~blur~(); // **WRONG:** target is a plain EventTarget, which has no blur
> }
> ```

When Escape clears the field, the blinking text cursor often remains inside the input. To improve user experience, the input should release focus when the search is cancelled. Browsers provide the standard `blur()` method on DOM elements to release active focus.

Event callbacks provide two distinct properties to reference DOM elements (Lesson 11):
- **`e.target`** references the element where the interaction originally originated.
- **`e.currentTarget`** references the element to which the event listener is attached.

In a plain input field, both properties reference the same `<input>` node because inputs contain no nested child tags:

```tsx title="Taking the cursor out of the field with e.currentTarget, and with e.target"
function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === 'Escape') {
    setQuery('');
    ~e.currentTarget.blur()~; // 1. No error: currentTarget is typed as the input
    e.target.~blur~(); // 2. **WRONG:** the editor underlines blur: target is typed as a plain EventTarget
  }
}
```

While both properties reach the same DOM element at runtime, TypeScript treats their compile-time types differently. Only `e.currentTarget.blur()` passes type verification.

### Why the types differ when the element is the same

TypeScript type declarations describe general DOM behavior across all possible component structures:
1. A developer writes `e.target.blur()` after previously seeing `e.target.value` succeed in change listeners (Lesson 20).
2. The editor highlights `blur` with a compiler error. In keyboard events, TypeScript types `e.target` as a generic `EventTarget`. The general `EventTarget` interface defines neither a blur method nor a value property.
3. The compiler types `e.target` generically because interactions can originate on deeply nested child elements and bubble up to parent listeners. Because the compiler cannot predict which child originated the interaction, it assigns the broadest common interface.
4. `e.currentTarget` always references the exact element where the listener is registered. Because that element matches the type argument in angle brackets, TypeScript types `e.currentTarget` as an `HTMLInputElement`.
5. Updating the invocation to `e.currentTarget.blur()` eliminates the compiler warning. When users press Escape, the input clears and releases focus cleanly.

```tree caption="In a keyboard event, e.currentTarget is typed as the element in the angle brackets, while e.target is typed as a plain EventTarget."
Two ways to reach the field in `handleKeyDown`
- +`e.currentTarget` [`e.currentTarget.blur`] | Always the element **the handler sits on** | Typed as **`HTMLInputElement`**, so `blur` **type-checks**
- !`e.target` [`e.target.blur`] | The element **where the event started**, which may be a child | Typed as a plain **`EventTarget`**, so `blur` is **underlined**
```

### Surprise: `e.target.value` still type-checks on `onChange`

When working inside `handleChange`, developers often observe that `e.target.value` compiles without errors.

In change events, React type declarations provide a legacy exception that types `target` identically to `currentTarget`. Internal comments in the React declaration package note that this behavior was preserved for backward compatibility and is scheduled for removal in future versions.

Using `e.target.value` worked in Lesson 20 and remains supported today. However, official React TypeScript documentation recommends reading `e.currentTarget.value` because it provides consistency across all event types.

### Forcing the type of `e.target` with `as`

When compiler warnings appear on `e.target`, developers sometimes attempt to bypass the check using type assertions with `as`. This approach introduces subtle runtime defects in composite components.

Consider an online store displaying recent search tags as buttons. Each button contains an SVG icon and descriptive text:

```tsx title="A recent search button that forces the type of e.target"
function handleRecentClick(e: React.MouseEvent<HTMLButtonElement>) {
  setQuery((~e.target as HTMLButtonElement~).value); // **WRONG:** when the user clicks the clock icon, target is the icon, and value is undefined
}

<button value="boots" onClick={handleRecentClick}><ClockIcon /> boots</button>
```

Type assertions silence compiler errors without verifying runtime data:
1. If a customer clicks the clock icon inside the button, the event originates on the `<svg>` or `<path>` element.
2. Consequently, `e.target` references the SVG graphic rather than the button element.
3. Because SVG graphics have no `value` attribute, the state updater receives undefined.
4. The search input remains empty, and React logs a console warning regarding controlled inputs becoming uncontrolled.

Using `e.currentTarget` guarantees access to the button element regardless of where the customer clicks:

```tsx title="The recent search button reading e.currentTarget"
function handleRecentClick(e: React.MouseEvent<HTMLButtonElement>) {
  setQuery(~e.currentTarget.value~); // The button itself, even when the user clicks the icon: the field shows boots
}
```

### Our search field, finished

The `handleKeyDown` function now releases input focus after resetting the query:

```tsx title="src/components/SearchBar.tsx" startLine="10"
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setQuery('');
      ~e.currentTarget.blur()~; // The input itself: the cursor leaves it
    }
  }
```

Typing `shoes` and pressing Escape clears the search field, removes the summary text, and releases the cursor from the input. To interact safely with the element hosting the handler, always reference `e.currentTarget`.

---

## All 5 Principles Together

### The complete code

Both event handlers exist as standalone functions, declaring explicit event interfaces and element type parameters, and accessing the input through `e.currentTarget`:

```tsx title="src/components/SearchBar.tsx"
import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(~e: React.ChangeEvent<HTMLInputElement>~) { // Principles 2 and 5: a change on the input
    setQuery(e.currentTarget.value);
  }

  function handleKeyDown(~e: React.KeyboardEvent<HTMLInputElement>~) { // Principle 4: a key press on the input
    if (e.key === 'Escape') {
      setQuery('');
      ~e.currentTarget.blur()~; // Principle 5: the input itself, typed as an HTMLInputElement
    }
  }

  return (
    <div>
      <label>
        Search the store
        <input value={query} onChange={handleChange} onKeyDown={handleKeyDown} />
      </label>
      <p>Results for: {query}</p>
    </div>
  );
}
```

```tsx title="src/App.tsx"
import SearchBar from './components/SearchBar';

export default function App() {
  return <SearchBar />;
}
```

### The order in which React calls the components and the handlers

During initial mounting, React executes `App` and then renders `SearchBar`. Subsequent function executions depend on user interactions. When a user strikes a key, React invokes `handleKeyDown` first. If that keystroke modifies the input text, React then invokes `handleChange`. Because the Escape key modifies no text, it triggers only `handleKeyDown`:

```tree caption="The order of the calls: React calls App, then SearchBar, and then a handler with its own event type for each thing the user does in the field."
`App` [1. React calls it when the page loads] | Returns `<SearchBar />`
- +`SearchBar` [2. React calls it next] | Holds `query` and renders the field and the results line
  - +`handleKeyDown` [3. When the user presses a key] | Receives a **`React.KeyboardEvent<HTMLInputElement>`** | On Escape, empties `query` and takes the cursor out
  - +`handleChange` [4. When that key changes the text] | Receives a **`React.ChangeEvent<HTMLInputElement>`** | Saves the text of the field into `query`
```

| Where the handler is written | How `e` gets its type | What our code writes |
| :--- | :--- | :--- |
| **Inline, inside `onChange={...}`** | TypeScript infers it from `onChange` | Nothing |
| **In its own function, typing the parameter** | Our code writes the event type and the element type | `e: React.ChangeEvent<HTMLInputElement>` |
| **In its own function, typing the whole function** | TypeScript infers `e` from the function type | `React.ChangeEventHandler<HTMLInputElement>` |
| **A key handler on the same field** | The event decides the type, the element stays | `e: React.KeyboardEvent<HTMLInputElement>` |
| **Reaching the element from any handler** | `e.currentTarget` is typed as the element | `e.currentTarget.blur()`, `e.currentTarget.value` |

Remember the central thesis of this lesson: the declaration site determines how `e` receives its type. Inline handlers infer types automatically from JSX, while standalone functions require explicit event and element declarations.

---

## For the Interview

> **The Interview Question:** How do you type event handlers and SyntheticEvents in TypeScript?

### How to Answer Clearly in 30 Seconds

"React passes each handler a synthetic event wrapper, and React type declarations assign specialized types to each interaction category. How parameter `e` receives its type depends on where the handler is declared:
1. **Inline handlers** infer the type of `e` contextually from the JSX attribute, requiring no manual type annotations.
2. **Extracted functions** require explicit typing, either on the parameter using `React.ChangeEvent<HTMLInputElement>` or across the function variable using `React.ChangeEventHandler<HTMLInputElement>`.
3. **To access the listening element**, always reference `e.currentTarget`, which is typed to match the element specified in angle brackets. For most events, `e.target` is typed generically as `EventTarget` because interactions can bubble from child elements.

Never use `e: any` because it disables compiler validation, and avoid native DOM `Event` types because React passes synthetic event wrappers."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why can't you type a React handler with the browser's `Event`?"**
   React passes a synthetic event wrapper rather than a native DOM event. While synthetic events mirror standard properties, their TypeScript interfaces are distinct. Assigning a function typed with the native DOM `Event` to a React prop triggers a type mismatch error. If direct access to the underlying DOM event is required, it can be accessed through `e.nativeEvent`.
2. **"Why does `e.target.value` type-check in a change handler, but `e.target.blur()` fails in a key handler?"**
   React types `e.currentTarget` as the specific DOM element declared in the type argument. In contrast, `e.target` is typed as a generic `EventTarget` because events bubble from nested children. Change events represent a legacy exception where `target` was typed as the element for backward compatibility. Using `e.currentTarget` is correct and consistent across all event categories.
3. **"How do you type a form's `onSubmit` handler?"**
   Hover over the `onSubmit` prop in your editor to inspect the expected type, then specify the form element in angle brackets. In modern React type declarations, `onSubmit` accepts `React.SubmitEventHandler<HTMLFormElement>`, which receives `React.SubmitEvent<HTMLFormElement>`. Earlier declarations used `React.FormEvent<HTMLFormElement>`, which recent declaration packages mark as deprecated. For custom interactions without specialized interfaces, use the base interface `React.SyntheticEvent`.

```tree caption="Interview summary: where the type of e comes from, and the two quick fixes that break the checks."
How a handler gets the type of `e`
- +Inline on the tag [`onChange={e => setQuery}`] | TypeScript **infers** `e` from the prop | Hover over `e` to see the type
- +Separate function [`e: React.ChangeEvent<HTMLInputElement>`] | Our code writes the **event** and the **element** | Or the whole function: **`React.ChangeEventHandler<HTMLInputElement>`**
- !Quick fixes [`e: any` `e: Event`] | ~Do **NOT** use them | `any` **removes every check**; `Event` names the **wrong event object**
```
