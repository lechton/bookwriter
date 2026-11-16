# Lecture 92: How a Chat Screen Tells TypeScript What Each Hook Holds

*(Why does `useState(null)` refuse the user that arrives later, and what do you write instead?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | How do you type useState, useReducer, and useRef with strict TypeScript generics?

---

## VS | `useState(false)` vs. `useState(null)`: `false` is a real value, `null` is only a placeholder

> In plain JavaScript, a variable initialized to `null` can freely hold an object later without errors. **In TypeScript, every hook infers its type contract directly from its initial value.** Because `useState(null)` infers the type `null`, the setter rejects any subsequent user object. Write the explicit union in angle brackets, `useState<User | null>(null)`, to permit both states. Silencing the compiler with `any` disables type verification and permits runtime crashes.

In Lesson 91, we saw how TypeScript infers types from assigned values. When you write `const name = 'John'`, TypeScript automatically determines that the variable is a string without an explicit annotation.

React hooks use the exact same type inference mechanism. Built-in hooks like `useState` and `useRef` infer their state types from their initial argument. For primitive values like booleans or strings, automatic inference works seamlessly. The challenge begins when the initial argument is merely an empty placeholder for data that loads later.

Here are two state variables declared inside a chat screen component:

```tsx title="Two start values, and no type written on either"
const [isSending, setIsSending] = useState(~false~); // Starts as false, and will later be true
const [user, setUser] = useState(~null~); // Starts as null, and will later hold the person we write to
```

Later, each setter receives an updated value:

```tsx title="One setter call under each"
setIsSending(~true~); // Accepted
setUser(~{ id: 1, name: 'Taylor' }~); // **WRONG:** the editor refuses it: this state can only ever hold null
```

Both declarations follow a familiar pattern: provide an initial default value and update it later. Both declarations rely on TypeScript to infer state types from initial arguments. As official documentation notes, calling `useState(false)` assigns the `boolean` type to the state.

Although these declarations appear similar, their behavior on update is completely different:
- **`false` is a concrete boolean value.** When you call `setIsSending(true)`, the argument matches the inferred `boolean` type, so TypeScript accepts the update.
- **`null` is a primitive placeholder.** When you pass `null` without a type argument, TypeScript infers the state type strictly as `null`. TypeScript cannot predict that an asynchronous request will later return a user object. Because the state type is restricted to `null`, passing a user object causes a compiler error.

The solution is to specify what the placeholder represents. Declare the type in angle brackets directly after `useState`:

```tsx title="The type in angle brackets says what null stands for"
type User = { id: number; name: string };

const [user, setUser] = useState~<User | null>~(null); // A User, or null until the User arrives
setUser({ id: 1, name: 'Taylor' }); // Accepted
```

> [!DEFINITION]
> **What is a type argument?** [REVIEW] A type argument is an explicit type written inside angle brackets after a function name, such as `useState<User | null>`.
> 1. It explicitly defines the type contract for a generic function rather than relying on inference.
> 2. `User | null` forms a union type, meaning the state can hold either a valid `User` object or `null`.
> 3. This allows the state to start as `null` and safely receive a populated object when data arrives (Lesson 90).

```tree caption="Two start values with no type: false leaves room for true, while null leaves room only for null."
Two start values, no type written
- +A real value [`useState false`] | TypeScript reads **`boolean`** | `setIsSending` with `true` **fits**
- !A placeholder [`useState null`] | TypeScript reads **`null`** and nothing else | The user object **does not fit**
- +A placeholder with a type argument [`useState<User or null>`] | Our code says **what `null` stands for** | The user object **fits**
```

**Remember this fundamental rule: every hook takes its type contract from its initial value.** When the initial value is already a concrete value like `false` or an empty string, omit the type argument. When the initial value is a placeholder like `null`, declare the real type as an explicit union in angle brackets. TypeScript will then require your rendering logic to verify `null` before accessing properties on the value.

In technical interviews, these angle brackets are frequently referred to as **generics**. In official documentation, the type placed inside them is called a **type argument**. In this chapter, we supply type arguments to built-in hooks that already accept them. Creating your own generic components will be covered in Lesson 93.

### What goes wrong with `any`: a blank chat screen

When the editor rejects `setUser`, developers under time pressure often reach for an escape hatch. **Silencing compiler warnings with `any` disables all type validation, exposing your application to runtime crashes.**

> [!DEFINITION]
> **What is `any`?** [REVIEW] `any` is an escape hatch in TypeScript that disables static type checking on a value.
> 1. It instructs the compiler to accept all property accesses and function calls without verification.
> 2. Declaring `useState<any>(null)` eliminates editor warnings, but eliminates all safety guarantees with them.
> 3. Errors that could be caught during development reach users as runtime crashes (Lesson 91).

The following sequence illustrates how this failure reaches users:
1. A developer writes `useState<any>(null)` to silence the compiler error quickly.
2. The editor immediately disables type checking on the user state variable.
3. The component renders `user.name` directly in its header markup.
4. A user visits the chat before the server responds, leaving the state as `null`.
5. Reading properties from `null` during rendering throws a TypeError stating that it cannot read properties of null.
6. Without an Error Boundary to catch the render exception, React unmounts the entire component tree (Lesson 72).

The user sees a blank screen instead of a loading indicator. When typed as `User | null`, TypeScript highlights the property access with an editor warning immediately. The developer is forced to handle the loading state, preventing the bug from ever leaving the editor.

### The Rule of Thumb: a real start value needs nothing, a placeholder needs a type argument

**Evaluate the initial value of your hook. If it is already a concrete value, write nothing. If it is an empty placeholder like `null` or an empty array, provide the real type in angle brackets and handle `null` before reading properties.**

Senior engineers anticipate five classic TypeScript hook errors:
1. **Relying on `useState(null)` without a type argument**, and then reaching for `any` when the setter rejects incoming data.
2. **Declaring `useState<User>(null)`.** This promises that state is always a user, so the compiler immediately rejects `null` as an invalid initial value.
3. **Using a loose action type for reducers.** Typing actions with a generic string type allows misspelled action names to bypass the compiler and fail silently at runtime.
4. **Applying outdated ref workarounds.** Older articles claim that a ref initialized with `null` produces a read-only container. In React 19, ref objects are always mutable.
5. **Using the non-null assertion operator, `inputRef.current!.focus()`.** The exclamation mark silences editor warnings, but the ref is genuinely `null` during the initial render and after unmounting.

## SECTION | A Chat Screen With an Undo Button

Open a chat in any messaging application. For a moment, the screen displays `Loading...` while the client fetches the recipient record. Then the header appears, displaying `Chat with Taylor` above a message field and a `Send` button.

```page width=text caption="The chat screen while the person's details load."
line: Loading...
console: quiet
```

The user types `Hi` and clicks `Send`. Many communication applications wait a few seconds before dispatching, allowing users to reverse an accidental submission. Our chat implementation provides the same behavior:
1. The submission button displays `Sending...` in a disabled state, and an `Undo` button appears.
2. If the user takes no action, the message sends automatically after three seconds, the field clears, and the button resets to `Send`.
3. If the user clicks `Undo` during the delay, the message is not sent, the draft remains in the input, and focus returns to the field.

```page width=text caption="After the details arrive, with Hi typed and Send clicked: the message waits three seconds, and Undo can stop it."
heading: Chat with Taylor
form:
  field: Message | Hi
  button: Sending...
  button: Undo
console: quiet
```

Each interactive feature on this screen relies on a specific hook, and several begin with empty placeholder values:
1. **The recipient data** begins as `null` while the network request is pending, typed as `useState<User | null>(null)`.
2. **The message text and submission status** live in a reducer with explicit action types, matching the Messenger pattern in official React documentation (Lesson 27).
3. **The timer identifier** must persist across renders so another handler can cancel it, stored in a ref initialized to `null` (Lesson 30).
4. **The input element** requires a ref so `Undo` can refocus the field, remaining `null` until React mounts the element (Lesson 31).

When declaring `useState`, you have three ways to define state types:
1. **Rely on type inference from the initial value.** This suits concrete values like booleans, empty strings, numbers, or fully populated objects.
2. **Declare a union of string literals.** For example, `useState<Status>('idle')` restricts state to a fixed set of valid status strings (Lesson 21).
3. **Declare a union that includes null.** For example, `useState<User | null>(null)` accommodates asynchronous data that arrives after the initial render.

```tree caption="Three ways to give useState its type, and the start value each one fits."
Three ways to give `useState` its type
- +1. Read from the start value [`useState false`] | Fits a start value that is **already the real kind** | Our code writes **nothing**
- +2. A union of strings [`useState<Status>`] | Fits a **fixed set of visual states** | The setter accepts **only the listed words**
- +3. A union with `null` [`useState<User or null>`] | Fits a value that **arrives later** | Our code must **check for `null`** before reading it
```

We build this chat interface inside a standard TypeScript application, structured according to the configuration established in Lesson 90:

```files title="chat-screen: File Explorer" caption="Our project files: App.tsx places the chat, and Chat.tsx holds the user, the reducer, the timer ref, and the input ref."
index.html | entry | The HTML page with the empty root div where React mounts
tsconfig.json | settings | Tells TypeScript how to read the project
src/
  main.tsx | boundary | Imports `App` from `./App` and mounts it into `#root`
  App.tsx | parent | Exports `App` as default and imports `Chat`
  components/
    Chat.tsx | state | Holds the user, the reducer for the message, the timer ref, and the input ref
```

**PRINCIPLES:** Every hook takes its type from its initial value, unless your code specifies an explicit type argument. Six principles guide our implementation as the chat component develops:
1. **Principle 1: `useState('')` infers a string type.** Concrete initial values require no explicit type argument, and the setter permits only matching values.
2. **Principle 2: `useState<User | null>(null)` models asynchronous data.** Without an explicit generic type argument, the state can hold only `null`.
3. **Principle 3: `if (user === null)` narrows the type safely.** The early return displays a loading indicator and guarantees that subsequent code can safely access properties.
4. **Principle 4: a discriminated union validates every action.** Explicitly typing reducer states and actions ensures that `dispatch` rejects invalid action types or missing payload fields.
5. **Principle 5: `useRef<number | null>(null)` tracks mutable timer identifiers.** Checking the ref value for `null` satisfies strict compiler checks before calling `clearTimeout`.
6. **Principle 6: `useRef<HTMLInputElement>(null)` references DOM elements.** React populates the DOM node during the commit phase, requiring optional chaining when calling methods like focus.

---

## PRINCIPLE | `useState('')`: TypeScript reads the type from the start value, so write nothing

> [!PRINCIPLE]
> **Principle 1: Inferred Types: `useState('')` Reads `string` From the Start Value**
>
> *When the start value already has the type the state will always hold, such as `''` or `false`, write no type argument; the setter then accepts only that type.*
>
> A `useState` with no type is still checked. TypeScript reads the type from the start value, and the setter's type follows, so `setMessage(null)` is refused on a state that started as `''`. A type argument is needed only when the start value is a placeholder that does not say what will come, such as `null` or an empty array.
>
> **DO THIS:**
> ```tsx
> const [message, setMessage] = useState(~''~); // Read as string
> const [messages, setMessages] = useState~<string[]>~([]); // An empty array needs its type written
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> const [messages, setMessages] = useState(~[]~); // **WRONG:** read as never[], so every item is refused
> ```

Here are two ways to declare the sending state:

```tsx title="With no type argument, and with a type argument"
const [isSending, setIsSending] = useState(~false~); // TypeScript reads boolean from false
const [isSending, setIsSending] = useState~<boolean>~(false); // Our code writes boolean by hand
```

Both declarations produce the exact same type contract. In both declarations, the state variable is a boolean, and the setter accepts only a boolean argument. As React documentation points out, providing a type argument here is unnecessary because TypeScript already infers the type accurately. The same rule applies to text: initializing with an empty string produces a state variable typed as `string`.

Some developers mistakenly assume that declaring state without an explicit generic leaves the state unchecked. In reality, TypeScript enforces full static checking based on the inferred type.

> [!DEFINITION]
> **What does inferring a type mean?** [REVIEW] Type inference is the mechanism by which TypeScript automatically deduces a type from an assigned value without manual annotations.
> 1. When declaring `const name = 'John'`, TypeScript assigns the type `string`.
> 2. When calling `useState('')`, TypeScript assigns the type `string` to both the state value and its setter.
> 3. Inference keeps code concise while maintaining full compile-time safety (Lesson 91).

### The setter accepts only the type of the start value

Here is the initial version of our chat component. It stores the draft text in `message`, and clicking `Send` clears the field:

```tsx title="src/components/Chat.tsx"
import { useState } from 'react';

export default function Chat() {
  const [message, setMessage] = useState(~''~); // TypeScript reads string from ''

  return (
    <div>
      <label>
        Message
        <input value={message} onChange={e => setMessage(e.currentTarget.value)} />
      </label>
      <button onClick={() => setMessage('')}>Send</button>
    </div>
  );
}
```

The parent application component renders the chat on screen:

```tsx title="src/App.tsx"
import Chat from './components/Chat';

export default function App() {
  return ~<Chat />~; // React calls Chat and puts the field and the button on the page
}
```

The user enters `Hi` and clicks `Send`:

```page width=text caption="The chat after the user types Hi in the message field."
form:
  field: Message | Hi | good
  button: Send
console: quiet
```

```page width=text caption="The same chat after the user clicks Send: the message field is empty again."
form:
  field: Message |
  button: Send
console: quiet
```

Suppose a developer attempts to reset the field by passing `null` instead of an empty string:

```tsx title="Clearing a string state with null"
<button onClick={() => setMessage(~null~)}>Send</button> {/* **WRONG:** the editor refuses null: the setter accepts only a string */}
```

The compiler rejects the call:

```text title="The editor's message"
Argument of type 'null' is not assignable to parameter of type 'SetStateAction<string>'.
```

Even though no manual type annotation was written, TypeScript enforces strict boundaries:
1. React typings declare `useState` as a generic hook parameterized by state type.
2. Because the initial value is an empty string, TypeScript resolves the state type as `string`.
3. The setter parameter is typed as `SetStateAction<string>`. This type accepts either a string value or an updater function returning a string (Lesson 16).

Because `null` is neither a string nor an updater function, the compiler blocks the assignment and directs the developer to use an empty string.

### An empty array is a placeholder too

Suppose the chat also maintains a list of sent messages. A developer might rely on inference again:

```tsx title="A list that starts empty, with no type"
const [messages, setMessages] = useState(~[]~); // An empty array: TypeScript cannot tell what it will hold
setMessages([...messages, 'Hi']); // **WRONG:** the editor refuses 'Hi'
```

The compiler rejects `'Hi'`:

```text title="The editor's message"
Type 'string' is not assignable to type 'never'.
```

An empty array literal does not indicate what elements it will eventually contain. Under strict mode, TypeScript infers its type as `never[]`, representing an array that can never hold values. The remedy is identical to handling `null`: declare the intended element type in angle brackets.

```tsx title="A list that starts empty, with a type argument"
const [messages, setMessages] = useState~<string[]>~([]); // An array of strings, empty for now
setMessages([...messages, 'Hi']); // Accepted
```

```tree caption="When the start value is real, TypeScript reads the type; when it is a placeholder, our code writes it."
What TypeScript reads from the start value
- +A real value [`useState empty string`] | Reads **`string`** | Write **no type argument**
- +The same, written by hand [`useState<string>`] | **The exact same `string`** | The type argument **adds nothing**
- !An empty array [`useState empty array`] | Reads **`never[]`** | Write **`string[]`** in the angle brackets
```

A concrete start value requires no annotation. An empty placeholder requires an explicit type argument.

---

## PRINCIPLE | `useState<User | null>(null)`: the state holds `null` now and the user later

> [!PRINCIPLE]
> **Principle 2: Union With `null`: `useState<User | null>(null)` for a Value That Arrives Later**
>
> *When the state starts as `null` and the real value arrives later, write the type argument with a union, `useState<User | null>(null)`; with no type argument, the state can only ever be `null`.*
>
> TypeScript cannot guess what `null` stands for, so it makes `null` the whole type, and the setter refuses the fetched user with a message about a function. `useState<User>(null)` is refused too, because the first render has no user yet. Silencing the error with `any` removes every check on the state.
>
> **DO THIS:**
> ```tsx
> const [user, setUser] = useState~<User | null>~(null); // Room for null now and for the User later
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> const [user, setUser] = useState~<any>~(null); // **WRONG:** any removes every check on user
> ```

The chat interface requires recipient data fetched asynchronously after mounting, so the state must begin empty:

```tsx title="With no type argument, and with a union that includes null"
const [user, setUser] = useState(~null~); // The state can only ever be null
const [user, setUser] = useState~<User | null>~(null); // A User, or null until the User arrives
```

Both declarations initialize state with `null` and execute identically during the initial render. Only the generic union declaration permits updating state with user data when the network request resolves.

### The refused setter and its strange message

Here is the chat component with an asynchronous fetch inside an Effect, written with untyped state:

```tsx title="src/components/Chat.tsx"
type User = { id: number; name: string };

export default function Chat() {
  const [user, setUser] = useState(~null~); // **WRONG:** TypeScript reads the type null
  const [message, setMessage] = useState('');

  useEffect(() => {
    let ignore = false;
    fetch('/api/users/1')
      .then(response => response.json())
      .then((data: User) => {
        if (!ignore) {
          ~setUser(data)~; // **WRONG:** the editor refuses a User here
        }
      });
    return () => {
      ignore = true;
    };
  }, []);
```

The editor flags `setUser`. When the payload is written inline, the compiler error appears especially puzzling:

```text title="The editor's message"
Object literal may only specify known properties, and 'id' does not exist in type '(prevState: null) => null'.
```

Although the code passes an object literal, the compiler message references a function signature:
1. Because the initial value is `null`, TypeScript fixes the state type as `null`.
2. A React state setter accepts either a direct value or an updater function. For this state, the parameter must be `null` or an updater function returning `null`.
3. The passed object is not `null`, so TypeScript evaluates the alternative union branch, the updater function.
4. Because an object literal does not match a function signature, the compiler reports that the object does not satisfy `(prevState: null) => null`.

This error occurs entirely at compile time. JavaScript itself would execute the assignment in a browser without complaint, because type annotations are stripped during build (Lesson 90).

### `useState<User>(null)` says the user is always there

Developers sometimes attempt to resolve the issue by declaring only `User` in angle brackets:

```tsx title="A type that says the user is always there"
const [user, setUser] = useState~<User>~(null); // **WRONG:** null is not a User, so the editor refuses the start value
```

The compiler rejects the initial argument:

```text title="The editor's message"
Argument of type 'null' is not assignable to parameter of type 'User | (() => User)'.
```

This check is strict null checking at work (Lesson 91). Declaring the type as `User` asserts that a user object exists during every render. The initial render immediately violates that guarantee.

Only a union type accurately models both states, before and after network resolution:

```tsx title="src/components/Chat.tsx"
export default function Chat() {
  const [user, setUser] = useState~<User | null>~(null); // A User, or null until the server answers
```

With this union declaration, `setUser(data)` is accepted without error.

### `(data: User)` is a promise about the server, not a check

Notice the parameter annotation in the network callback. Calling `response.json()` produces a value typed as `any`, because TypeScript cannot verify external network payloads. Writing `(data: User)` expresses what your application expects the server to return. No runtime check is performed. If the server returns `{ fullName: 'Taylor' }`, TypeScript raises no warning, and the UI displays an empty name.

```tree caption="Three ways to type a state that starts empty: only a union with null accepts both moments, before and after the answer."
Three ways to type the `user` state
- !No type argument [`useState null`] | The state is **only `null`** | The setter **refuses the user**
- !Only `User` [`useState<User>`] | Promises a user **on every render** | The editor **refuses the start value `null`**
- +`User` or `null` [`useState<User or null>`] | Matches **before and after** the answer | The setter **accepts the user**
```

A placeholder `null` requires an explicit union declaration, `useState<User | null>(null)`.

---

## PRINCIPLE | `if (user === null)`: the check shows `Loading...` and makes `user.name` safe

> [!PRINCIPLE]
> **Principle 3: Narrowing: `user === null` Shows `Loading...` and Unlocks `user.name`**
>
> *A state typed `User | null` must be checked for `null` before `user.name` is read; below the check, TypeScript knows that `user` is a `User`.*
>
> The `null` in the type is a real moment: the first render, before the server answers. A check that returns early when `user` is `null` removes `null` from the type for every line below it, and it is also the line that shows `Loading...`. The shortcuts `user!.name` and `any` remove the warning, and the first render still throws.
>
> **DO THIS:**
> ```tsx
> if (~user === null~) {
>   return <p>Loading...</p>; // The first render shows the loading line
> }
> return <h1>Chat with {user.name}</h1>;
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> return <h1>Chat with {~user!~.name}</h1>; // **WRONG:** the editor is silenced, and the first render throws
> ```

When a user opens the chat, recipient details are not yet loaded. If a developer attempts to render the name directly:

```tsx title="The title read with no check"
const [user, setUser] = useState<User | null>(null);

<h1>Chat with {~user~.name}</h1> {/* **WRONG:** the editor underlines user: it is possibly null */}
```

The editor warns that the variable is possibly `null`.

This warning reflects physical runtime reality. React mounts and renders the component before executing the Effect that triggers data fetching (Lessons 32 and 33). During the initial render, reading properties from `null` throws an unhandled exception.

### The check for `null` is also the loading line

The developer introduces a guard condition before rendering the header:

```tsx title="A check for null before the title"
if (~user === null~) {
  return <p>Loading...</p>; // While user is null, the page shows only this line
}

return <h1>Chat with {~user~.name}</h1>; // No underline: below the check, user is a User
```

The compiler warning disappears without additional annotations because TypeScript performs control flow analysis:
1. Above the guard condition, the state holds `User | null`.
2. The conditional branch returns early when the variable equals `null` (Lesson 10).
3. Consequently, subsequent lines execute only when the variable holds a valid user object.

Hovering over the variable below the early return shows that its type is refined to `User`.

> [!DEFINITION]
> **What is narrowing?** [NEW] Type narrowing is the process by which TypeScript refines an untyped or union type into a more specific type through control flow analysis.
> 1. Before an early return guard, the variable is typed as `User | null`.
> 2. Inside the early return, the value is confirmed to be `null`.
> 3. After the guard, TypeScript automatically removes `null` from the union without requiring type assertions (Lesson 92).

The presence of `null` in the union type is not an arbitrary compiler rule. It represents a real state in the component lifecycle: the initial render before data arrives. The guard statement that satisfies the compiler is the exact check that renders `Loading...` for the user.

Here is the completed component with the early return guard:

```tsx title="src/components/Chat.tsx"
  if (~user === null~) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Chat with {user.name}</h1>
      <label>
        Message
        <input value={message} onChange={e => setMessage(e.currentTarget.value)} />
      </label>
      <button onClick={() => setMessage('')}>Send</button>
    </div>
  );
}
```

When the user enters the screen, the loading indicator displays first, followed by the populated chat view:

```page width=text caption="The first render: user is null, so the chat shows only the loading line."
line: Loading...
console: quiet
```

```page width=text caption="After the server answers: user is a User, so the chat shows the title, the message field, and the button."
heading: Chat with Taylor
form:
  field: Message |
  button: Send
console: quiet
```

### VS | The check vs. `user?.name`: both remove the underline, only the check shows a loading line

Some developers use optional chaining instead of an early return guard.

> [!DEFINITION]
> **What is optional chaining?** [NEW] Optional chaining is the `?.` operator in JavaScript that short-circuits property access.
> 1. If the operand before `?.` evaluates to `null` or `undefined`, the expression returns `undefined` instead of throwing an error.
> 2. Writing `user?.name` safely evaluates to `undefined` while data is loading.
> 3. It prevents runtime crashes but does not narrow the underlying union type (Lesson 92).

The compiler accepts `user?.name`, removing the editor warning. However, the user experience during loading differs substantially:
- **With an early return guard**, the interface shows `Loading...` until data arrives, followed by the complete chat view.
- **With optional chaining**, React renders empty text for `undefined`. The header displays `Chat with ` with a missing name beside an active input field.

An early return guard ensures a coherent user interface while asynchronous data loads.

### The `!` and `any` shortcuts remove the warning, not the crash

Two shortcuts eliminate compiler warnings without performing runtime checks, both reintroducing runtime crashes:
1. **`user!.name`**: the exclamation mark asserts that the variable is never `null`. During the initial render, `user` is still `null`, causing the property access to throw.
2. **`useState<any>(null)`**: this disables type checking completely, causing the exact same runtime crash.

In both cases, evaluating the expression throws a TypeError at runtime, and without an Error Boundary the application unmounts (Lesson 72).

```tree caption="Three ways to read user.name: only the check for null gives the user a loading line instead of a crash."
Reading `user.name` while `user` may be `null`
- +A check for `null` [`if user === null`] | The page shows **`Loading...`** first | Below the check, `user` is **a `User`**
- !Optional chaining [`user?.name`] | No crash, but the title reads **`Chat with`** and nothing after it | The user sees **half a screen** while loading
- !The `!` or `any` shortcut [`user!.name`] | The editor **stops warning** | The first render **throws**, and the page goes **blank**
```

The union type includes `null` because the component genuinely experiences a render without data. Check for `null` and render a loading indicator.

---

## PRINCIPLE | A union of actions: `dispatch` refuses a wrong action name or a missing field

> [!PRINCIPLE]
> **Principle 4: Discriminated Unions: A Union of Actions Checks Every `dispatch`**
>
> *Type the reducer's state, its initial state, and its arguments and return value, and write the actions as a union of objects, one for each `type`, each with only its own fields.*
>
> With one loose action type, any string passes as `type`, so a misspelled action reaches the browser and matches no `case`. With a union, the `type` field tells TypeScript which action it is, so `dispatch` refuses a wrong name or a missing field, and each `case` sees only the fields of its own action. `useReducer` then reads its types from the reducer and the initial state.
>
> **DO THIS:**
> ```tsx
> type ChatAction =
>   | ~{ type: 'edited_message'; message: string }~ // Each action lists its own fields
>   | { type: 'sent_message' };
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> type ChatAction = ~{ type: string; payload?: any }~; // **WRONG:** a misspelled type passes the editor
> ```

As the chat interface incorporates a delay, an undo button, and submission state, managing updates with multiple `useState` hooks becomes complex. Complex state logic is consolidated inside a reducer.

> [!DEFINITION]
> **What is a reducer?** [REVIEW] A reducer is a function that calculates the next state given the current state and an action object.
> 1. An action is an object with a `type` describing what occurred, such as `{ type: 'sent_message' }`.
> 2. Event handlers trigger state transitions by invoking `dispatch` with an action object.
> 3. React invokes the reducer with current state and the dispatched action to compute new state (Lesson 27).

Here are two approaches to typing reducer actions:

```tsx title="One loose action type, and a union of action types"
type ChatAction = ~{ type: string; payload?: any }~; // Any name, any data

type ChatAction =
  | ~{ type: 'edited_message'; message: string }~ // Must carry the new text
  | ~{ type: 'sent_message' }~; // Carries nothing else
```

Both approaches compile and execute identically in production when actions are valid. The crucial difference appears when a developer makes an error:
- **With a loose action type**, dispatching an object with a misspelled type or invalid payload passes compiler checks without warning.
- **With a discriminated union**, invalid action names or missing fields are immediately flagged during compilation.

> [!DEFINITION]
> **What is a discriminated union?** [NEW] A discriminated union is a union of object types that each contain a common property holding a distinct string literal.
> 1. In `ChatAction`, the shared discriminator property is `type`.
> 2. When code evaluates `action.type`, TypeScript narrows the action to that specific object variant.
> 3. Properties belonging to that variant become accessible, while invalid properties are rejected (Lesson 92).

### The four places to type a reducer

React best practices establish four distinct typing locations for a reducer:

```tsx title="src/components/Chat.tsx"
type ChatState = { message: string }; // 1. The state

type ChatAction = // 2. The actions, one object for each type
  | { type: 'edited_message'; message: string }
  | { type: 'sent_message' };

const initialState: ~ChatState~ = { message: '' }; // 3. The initial state

function chatReducer(state: ~ChatState~, action: ~ChatAction~): ~ChatState~ { // 4. The arguments and the return value
  switch (action.type) {
    case 'edited_message':
      return { ...state, message: ~action.message~ }; // Here, action is the object with message
    case 'sent_message':
      return { ...state, message: '' };
    default:
      throw new Error('Unknown action');
  }
}
```

Inside the component, `useReducer` replaces the primitive message state. No explicit type argument is required on the hook invocation:

```tsx title="src/components/Chat.tsx"
  const [state, dispatch] = ~useReducer(chatReducer, initialState)~; // state is a ChatState, dispatch accepts only a ChatAction
```

TypeScript automatically infers state and dispatch types from `chatReducer` and `initialState`. Official documentation recommends typing the initial state and reducer function directly rather than passing type arguments to `useReducer`.

The input field and submission button dispatch strongly typed actions:

```tsx title="src/components/Chat.tsx"
        <input
          value={state.message}
          onChange={e => dispatch(~{ type: 'edited_message', message: e.currentTarget.value }~)}
        />
      </label>
      <button onClick={() => dispatch(~{ type: 'sent_message' }~)}>Send</button>
```

The runtime behavior matches previous versions, but static type verification now protects every state transition.

### Three mistakes the union catches

Discriminated unions prevent three common developer errors:

```tsx title="Two wrong dispatch calls"
dispatch(~{ type: 'edited_message' }~); // **WRONG:** the text is missing
dispatch({ type: ~'edited_mesage'~, message: 'Hi' }); // **WRONG:** a letter is missing from the name
```

```tsx title="A field read in the wrong case"
case 'sent_message':
  return { ...state, message: ~action.message~ }; // **WRONG:** this action has no message
```

1. **A missing payload property.** The compiler flags `edited_message` because its contract requires a `message` property.
2. **A misspelled action name.** The compiler rejects `'edited_mesage'` because it does not match any literal in the union.
3. **A field read in the wrong branch.** Inside the handler for sent messages, accessing message on the action is rejected because that action defines no message payload. Evaluating the action type inside a switch statement narrows the action to that specific variant.

With a loose type definition, the compiler detects none of these issues. If a misspelled action name is dispatched inside an input change listener:
1. The user types a character into the field.
2. React invokes the reducer during component rendering.
3. The action type matches no branch, causing the reducer to execute default and throw an error.
4. Without an Error Boundary, React unmounts the component tree, and the interface crashes on the first keystroke (Lesson 72).

```tree caption="A loose action type and a union of action types run the same reducer, but only the union lets the editor check every dispatch."
Two ways to type the actions of `chatReducer`
- !One loose object [`type: string, payload: any`] | Accepts **any name** and **any data** | A misspelled `type` **reaches the browser** and matches no `case`
- +A union of objects [`edited_message or sent_message`] | Each `type` has **only its own fields** | The editor **refuses** a wrong name, a missing field, or a field in the wrong `case`
```

Explicitly type the reducer function and initial state, allowing `useReducer` to infer remaining contracts automatically.

---

## PRINCIPLE | `useRef<number | null>(null)`: the ref keeps the timer ID that `Undo` stops

> [!PRINCIPLE]
> **Principle 5: Value Refs: `useRef<number | null>(null)` Keeps the Timer ID for Undo**
>
> *A ref that your code fills later starts as `null`, so write the type argument with a union, `useRef<number | null>(null)`; in React 19 its `current` can always be assigned, and it must be checked for `null` before it is passed on.*
>
> A `useRef(null)` with no type reads the type `null` from its start value, so it refuses the timer ID. With the union, the assignment is accepted, but `clearTimeout` still refuses a value that may be `null`, so a check for `null` comes first. The ref keeps the same ID across renders, so `Undo` stops the exact timer that `Send` started.
>
> **DO THIS:**
> ```tsx
> const timeoutRef = useRef~<number | null>~(null); // Room for the timer ID
> if (~timeoutRef.current !== null~) {
>   clearTimeout(timeoutRef.current); // Below the check, current is a number
> }
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> const timeoutRef = useRef(~null~); // **WRONG:** current can hold only null
> timeoutRef.current = setTimeout(() => dispatch({ type: 'sent_message' }), 3000); // **WRONG:** the editor refuses the timer ID
> ```

When the user clicks `Send`, the application begins a three-second countdown before sending. One interaction starts the timer, and a subsequent interaction, `Undo`, must cancel that specific timeout. The timer identifier is therefore stored in a ref.

> [!DEFINITION]
> **What is a ref?** [REVIEW] A ref is a persistent container object containing a single mutable property named `current`.
> 1. Initializing with `useRef(null)` creates `{ current: null }`.
> 2. You read and mutate `current` directly without invoking a setter function.
> 3. Modifying `current` does not trigger a component re-render (Lesson 30).

Before any interaction occurs, no timer exists. The ref starts with an empty placeholder, `null`. Refs infer their types from their initial arguments, just like state:

```tsx title="With no type argument, and with a union that includes null"
const timeoutRef = useRef(~null~); // current can only ever hold null
const timeoutRef = useRef~<number | null>~(null); // current holds a timer ID, or null before the first timer
```

Both declarations initialize `current` with `null`. Only the generic declaration permits assigning a timer identifier later. In browser environments, `setTimeout` returns a numeric identifier.

### The reducer gets two more actions

First, the reducer is updated to support the delayed send workflow. The state receives an `isSending` flag, and the union gains two new action types:

```tsx title="src/components/Chat.tsx"
type ChatState = { message: string; ~isSending: boolean~ };

type ChatAction =
  | { type: 'edited_message'; message: string }
  | ~{ type: 'started_sending' }~ // The user clicked Send, and the wait begins
  | ~{ type: 'undone' }~ // The user clicked Undo during the wait
  | { type: 'sent_message' }; // Three seconds passed, and the message is sent

const initialState: ChatState = { message: '', isSending: false };
```

Each new action is handled in its own `case` branch:

```tsx title="src/components/Chat.tsx"
    case 'started_sending':
      return { ...state, ~isSending: true~ }; // The button reads Sending...
    case 'undone':
      return { ...state, ~isSending: false~ }; // The text stays in the field
    case 'sent_message':
      return { ~message: ''~, isSending: false }; // The field empties
```

### Two refusals, one after the other

Next, we implement the click handlers. If a developer declares an untyped ref based on plain JavaScript examples:

```tsx title="src/components/Chat.tsx"
  const timeoutRef = useRef(null);

  function handleSend() {
    dispatch({ type: 'started_sending' });
    ~timeoutRef.current~ = setTimeout(() => { // **WRONG:** the editor refuses a number here
      dispatch({ type: 'sent_message' });
    }, 3000);
  }
```

Two successive lines trigger compiler errors:
1. The compiler rejects the numeric assignment because the untyped ref inferred its type strictly as `null`.
2. After changing the declaration to `useRef<number | null>(null)`, the assignment succeeds.
3. In `handleUndo`, calling `clearTimeout(timeoutRef.current)` triggers a second compiler rejection.

Here are the two compiler errors:

```text title="The editor's two messages"
Type 'number' is not assignable to type 'null'.
Argument of type 'number | null' is not assignable to parameter of type 'number | undefined'.
```

Standard browser typings define `clearTimeout` to accept a number or undefined, but reject `null`. In native browser environments, passing an invalid identifier to `clearTimeout` performs no operation without throwing. TypeScript DOM declarations are simply more restrictive than browser behavior.

The solution is a runtime null check:

```tsx title="src/components/Chat.tsx"
  const timeoutRef = useRef~<number | null>~(null); // A timer ID, or null before the first timer

  function handleSend() {
    dispatch({ type: 'started_sending' });
    timeoutRef.current = setTimeout(() => { // Accepted: current may hold a number
      dispatch({ type: 'sent_message' });
    }, 3000);
  }

  function handleUndo() {
    if (~timeoutRef.current !== null~) { // Below the check, current is a number
      clearTimeout(timeoutRef.current);
    }
    dispatch({ type: 'undone' });
  }
```

The submission button reflects `state.isSending`, and the `Undo` button renders conditionally during countdown:

```tsx title="src/components/Chat.tsx"
      <button disabled={state.isSending} onClick={handleSend}>
        {state.isSending ? 'Sending...' : 'Send'}
      </button>
      {~state.isSending &&~ <button onClick={handleUndo}>Undo</button>} {/* Undo appears only during the wait */}
```

During the countdown, the interface shows the active timer state:

```page width=text caption="During the three-second wait: the Send button reads Sending... and is disabled, and Undo appears."
heading: Chat with Taylor
form:
  field: Message | Hi
  button: Sending...
  button: Undo
console: quiet
```

If the user takes no action, the message sends when the timer fires. If the user clicks `Undo`, the timer clears and the draft remains:

```page width=text caption="After the user clicks Undo during the wait: the message is not sent, and Hi stays in the field."
heading: Chat with Taylor
form:
  field: Message | Hi | good
  button: Send
console: quiet
```

### In React 19, `current` can always be assigned

Earlier articles frequently warned that initializing a ref with `null` created an immutable ref container, requiring complicated workarounds. That limitation existed only in older typings. The React 19 Upgrade Guide confirms that all ref objects are now mutable. Every invocation of `useRef` returns a unified `RefObject` type. Hovering over the timer ref displays `RefObject<number | null>`.

React 19 typings also provide a convenient shorthand. When the initial value is `null`, TypeScript automatically includes `null` in the resulting type argument. Consequently, `useRef<number>(null)` produces the exact same type contract as writing `useRef<number | null>(null)` explicitly.

### The trap of Node's types

In full-stack projects that load Node.js definitions alongside DOM typings, `setTimeout` returns a timer object rather than a numeric identifier. The editor then rejects assigning the timer object to a number ref. Two approaches ensure portability:
1. **Use `window.setTimeout`**, explicitly invoking the browser DOM API to guarantee a numeric return value.
2. **Type the ref with `ReturnType<typeof setTimeout>`**, adapting automatically to whichever runtime environment is active.

```tree caption="Three ways to type the timer ref: only a type that includes number accepts the timer ID."
Three ways to type `timeoutRef`
- !No type argument [`useRef null`] | `current` holds **only `null`** | The timer ID is **refused**
- +`number` or `null`, written in full [`useRef<number or null>`] | `current` holds **a timer ID or `null`** | **Check for `null`** before `clearTimeout`
- +Only `number`, with `null` as the start [`useRef<number>`] | React 19 **adds `null`** for us | **The exact same type** as `number` or `null` written in full
```

Refs require the same consideration as state variables. Provide a type argument for empty placeholders, and verify values before passing them to APIs.

---

## PRINCIPLE | `useRef<HTMLInputElement>(null)`: React fills `current` with the `<input>` element, and empties it again

> [!PRINCIPLE]
> **Principle 6: DOM Refs: `useRef<HTMLInputElement>(null)` Waits for React to Fill It**
>
> *Type a ref for an element with the element type, `useRef<HTMLInputElement>(null)`; its `current` is the element or `null`, so read it with `?.` or a check for `null`.*
>
> A ref for an element has the same `RefObject` type as a ref for a timer ID. The difference is that React writes its `current`: it puts the element there during the commit, and puts `null` back when the element leaves the page. The `!` shortcut silences the editor, and the line throws the first time the element is not there.
>
> **DO THIS:**
> ```tsx
> const inputRef = useRef~<HTMLInputElement>~(null);
> inputRef.current~?.~focus(); // Skipped when the input is not on the page
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> inputRef.current~!~.focus(); // **WRONG:** throws when the input is not on the page
> ```

When cancelling a pending message with `Undo`, returning keyboard focus to the input creates a smooth user experience.

In vanilla JavaScript, developers locate DOM nodes using methods like `document.getElementById` and call `focus()` directly. In React, you describe interface structures declaratively with JSX rather than constructing DOM nodes manually. A DOM ref bridges this gap, instructing React to populate `ref.current` with the underlying browser DOM node upon mounting (Lesson 31).

```tsx title="Plain TypeScript vs. React: the same input, the same focus"
const input = document.getElementById('message'); // Plain: the type is HTMLElement | null
input?.focus();

const inputRef = useRef<HTMLInputElement>(null); // React: React fills current with the <input>
<input ~ref={inputRef}~ /> {/* Tells React which element to put into inputRef.current */}
inputRef.current?.focus();
```

In plain TypeScript, `document.getElementById` returns `HTMLElement | null` because the queried element might not exist in the DOM. A React DOM ref incorporates `null` for the exact same reason.

> [!DEFINITION]
> **What is `HTMLInputElement`?** [REVIEW] `HTMLInputElement` is the standard DOM interface representing an HTML input element.
> 1. It exposes input-specific properties like `value`, `disabled`, and `checked`.
> 2. It provides DOM manipulation methods such as `focus()`, `blur()`, and `select()`.
> 3. TypeScript provides these definitions automatically through the standard DOM library (Lesson 91).

### VS | The timer ref vs. the `<input>` ref: the same type, a different writer

Here are the two ref declarations side by side:

```tsx title="A ref for a timer ID, and a ref for the input"
const timeoutRef = useRef~<number | null>~(null); // Our code writes current: the timer ID
const inputRef = useRef~<HTMLInputElement>~(null); // React writes current: the <input> element
```

Both declarations produce the exact same `RefObject` structure where the current property holds either a value or `null`. Hovering over the input ref displays `RefObject<HTMLInputElement | null>` because React 19 typings automatically include `null`.

The fundamental difference lies in who writes to the ref:
- **The timer ref** is updated directly by your application code inside event handlers.
- **The input ref** is populated by React during the commit phase after the DOM node is mounted, and reset to `null` when the element unmounts.

Omitting the type argument causes the same failure seen earlier. Declaring `useRef` without a type argument restricts the ref to `null`, causing the compiler to reject any invocation of focus.

```tree caption="The timer ref and the input ref have the same type shape; the one difference is who writes current."
Two refs in `Chat`
- +The timer ref [`useRef<number or null>`] | **Our code** writes `current` in `handleSend` | `null` **before the first click on Send**
- +The input ref [`useRef<HTMLInputElement>`] | **React** writes `current` during the commit | `null` **before the input is on the page**, and **after it leaves**
```

### "Possibly null", though the input is on the screen

The developer attaches the ref to the JSX input and calls the focus method in `handleUndo`:

```tsx title="focus called with no check"
<input ref={inputRef} />

inputRef.current.focus(); // **WRONG:** the editor underlines inputRef.current: it is possibly null
```

The editor reports that the current property is possibly `null`.

Even though the element appears on screen when the user clicks Undo, the compiler warning is accurate. During the initial render before DOM nodes exist, `current` is genuinely `null`. React also resets `current` to `null` whenever the element unmounts. The type contract retains `null` to represent those lifecycle states.

The recommended solution is optional chaining. When the ref holds `null`, invoking `focus()` is safely skipped without throwing an exception:

```tsx title="src/components/Chat.tsx"
  function handleUndo() {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    dispatch({ type: 'undone' });
    ~inputRef.current?.focus()~; // Calls focus only when the input is on the page
  }
```

In this context, skipping the call is appropriate: if no input exists in the DOM, there is nothing to focus. When the user cancels sending, the message remains in the field, and focus returns to the input.

### VS | `?.` vs. `!`: the first skips the call, the second throws

Developers often silence compiler warnings with the non-null assertion operator: `inputRef.current!.focus()`. These two approaches behave very differently:
- **With optional chaining**, method execution is skipped if the ref holds `null`, preventing errors.
- **With non-null assertion**, you instruct the compiler to assume the element is always present, which causes a runtime exception if the element unmounts.

Using non-null assertions introduces hidden defects when component structures change over time:
1. A developer adds `inputRef.current!.focus()` inside the undo handler.
2. Later, another developer conditionally hides the input during transmission: `{state.isSending ? null : <input ref={inputRef} />}`.
3. When the user clicks Send, the input unmounts and React sets `current` back to `null`.
4. Clicking Undo evaluates `focus()` on `null`, causing an unhandled TypeError that crashes the handler.

Using `?.` safely skips the focus call when the input is absent, allowing remaining handler logic to execute normally.

```tree caption="Three ways to write the input ref and its focus call: only optional chaining on a typed ref keeps working when the input is not on the page."
Calling `focus` on `inputRef.current`
- +Optional chaining [`inputRef.current?.focus`] | Calls `focus` **only when the input is there** | **Nothing breaks** when `current` is `null`
- !The `!` shortcut [`inputRef.current!.focus`] | The editor **stops warning** | **Throws** when the input is not on the page
- !No type argument [`useRef null`] | `current` holds **only `null`** | The editor **refuses `focus`** on it
```

React manages DOM ref values across component lifecycle events. Provide the element type argument and read `current` safely with optional chaining.

---

## All 6 Principles Together

### The complete code

The draft message and reducer derive types through inference. All placeholder values declare explicit type arguments:

```tsx title="src/components/Chat.tsx"
import { useEffect, useReducer, useRef, useState } from 'react';

type User = { id: number; name: string };

type ChatState = { message: string; isSending: boolean };

type ChatAction =
  | ~{ type: 'edited_message'; message: string }~ // Principle 4: one object for each type
  | { type: 'started_sending' }
  | { type: 'undone' }
  | { type: 'sent_message' };

const initialState: ChatState = { message: '', isSending: false };

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'edited_message':
      return { ...state, message: action.message };
    case 'started_sending':
      return { ...state, isSending: true };
    case 'undone':
      return { ...state, isSending: false };
    case 'sent_message':
      return { message: '', isSending: false };
    default:
      throw new Error('Unknown action');
  }
}

export default function Chat() {
  const [user, setUser] = useState~<User | null>~(null); // Principle 2: null until the server answers
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const inputRef = useRef~<HTMLInputElement>~(null); // Principle 6: React fills it with the input
  const timeoutRef = useRef~<number | null>~(null); // Principle 5: our code fills it with the timer ID

  useEffect(() => {
    let ignore = false;
    fetch('/api/users/1')
      .then(response => response.json())
      .then((data: User) => {
        if (!ignore) {
          setUser(data);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  function handleSend() {
    dispatch({ type: 'started_sending' });
    timeoutRef.current = setTimeout(() => {
      dispatch({ type: 'sent_message' });
    }, 3000);
  }

  function handleUndo() {
    if (~timeoutRef.current !== null~) { // Principle 5: clearTimeout refuses null
      clearTimeout(timeoutRef.current);
    }
    dispatch({ type: 'undone' });
    ~inputRef.current?.focus()~; // Principle 6: skipped when the input is not on the page
  }

  if (~user === null~) { // Principle 3: the first render shows the loading line
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Chat with {user.name}</h1>
      <label>
        Message
        <input
          ref={inputRef}
          value={state.message}
          onChange={e => dispatch({ type: 'edited_message', message: e.currentTarget.value })}
        />
      </label>
      <button disabled={state.isSending} onClick={handleSend}>
        {state.isSending ? 'Sending...' : 'Send'}
      </button>
      {state.isSending && <button onClick={handleUndo}>Undo</button>}
    </div>
  );
}
```

```tsx title="src/App.tsx"
import Chat from './components/Chat';

export default function App() {
  return <Chat />;
}
```

### The order in which React calls the components and the handlers

On initial load, React renders `App` and `Chat`, which returns the loading message. After commit, the Effect initiates the data fetch. When the server responds, calling `setUser` triggers a re-render where `Chat` returns the complete form. During that commit phase, React populates `inputRef.current` with the rendered `<input>` element. Subsequent user clicks invoke the corresponding handlers:

```tree caption="The order of the calls: App, then Chat with the loading line, then the Effect, then Chat with the full screen, and then the handlers."
`App` [1. React calls it when the page loads] | Returns `<Chat />`
- +`Chat`, first render [2. `user` is `null`] | Returns **`Loading...`** | `inputRef.current` is **`null`**
  - +The Effect [3. After the commit] | Fetches the user | Calls **`setUser`** when the server answers
- +`Chat`, next render [4. `user` is a `User`] | Returns the **title, the message field, and Send** | React puts the input into **`inputRef.current`**
  - +`handleSend` [5. The user clicks Send] | Stores the timer ID in **`timeoutRef.current`** | The button reads **`Sending...`**
  - +`handleUndo` [6. The user clicks Undo] | Clears the timer and **focuses the input** | `Hi` **stays in the field**
```

| What the hook holds | Its start value | What your code writes | Before reading it |
| :--- | :--- | :--- | :--- |
| **The text of the message, `message`** | `''`, a real value | Nothing: TypeScript reads `string` | Nothing |
| **The person, `user`** | `null`, a placeholder | `useState<User \| null>(null)` | A check for `null`, which shows `Loading...` |
| **The message and the sending state** | `initialState`, typed `ChatState` | A union of actions, and types on the reducer | Nothing: each `case` sees its own fields |
| **The timer ID, `timeoutRef`** | `null`, a placeholder | `useRef<number \| null>(null)` | A check for `null` before `clearTimeout` |
| **The `<input>` element, `inputRef`** | `null`, until React fills it | `useRef<HTMLInputElement>(null)` | `?.` or a check for `null` |

Every hook derives its type contract from its initial value. Concrete values require no annotation, while placeholders require explicit generic types and runtime checks.

---

## For the Interview

> **The Interview Question:** How do you type useState, useReducer, and useRef with strict TypeScript generics?

### How to Answer Clearly in 30 Seconds

"Each hook infers its type contract directly from its initial value. When the initial value is a concrete value like an empty string or boolean, I omit annotations and rely on inference. When the initial value is a placeholder, I supply explicit generic type arguments:
1. **`useState`**: For asynchronous data, I declare `useState<User | null>(null)`. An early return guard checking for `null` displays a loading indicator and narrows the type to `User` before reading properties. I avoid `useState<User>(null)`, which fails compilation, and `any`, which eliminates type safety.
2. **`useReducer`**: I type the state interface, initial state, and reducer parameters, defining actions as a discriminated union. This enables compile-time verification for action names and payload fields while narrowing types inside switch cases.
3. **`useRef`**: For mutable identifiers like timers, I declare `useRef<number | null>(null)` and guard against `null` before calling `clearTimeout`. For DOM references, I declare `useRef<HTMLInputElement>(null)` and access methods with optional chaining. In React 19, all ref objects are mutable instances of `RefObject`."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Can you pass type arguments to `useReducer` instead of typing the reducer?"**
   Yes, but official React guidance recommends typing the initial state and reducer parameters instead. In modern React 19 typings, `useReducer` accepts two generic arguments representing state and action tuple types: `useReducer<ChatState, [ChatAction]>`. Typing the reducer and initial state directly is more ergonomic and avoids verbose tuple syntax.
2. **"Why do older articles say a ref made with `null` has a read-only `current`?"**
   Older versions of React typings distinguished between mutable refs and read-only DOM refs using two separate types, `MutableRefObject` and `RefObject`. Initializing a ref with `null` without including `null` in the type argument produced a read-only ref. React 19 unified all refs under a single mutable `RefObject` interface, deprecating `MutableRefObject` and ensuring `current` is always assignable.
3. **"How do you make TypeScript report an action that the reducer forgot to handle?"**
   In the default branch of the reducer switch statement, assign the unhandled action to a variable typed as `never`: `const unhandled: never = action;`. Then reference that variable when throwing: `throw new Error('Unknown action: ' + unhandled);`. When every union variant is handled, control flow analysis ensures no remaining action types reach default, so `action` is narrowed to `never`. If a developer adds a new action to the union without adding a corresponding case branch, TypeScript raises a compile-time error identifying the missing action.

```tree caption="Interview summary: real start values need no type, placeholders need a type argument, and each placeholder must be handled where it is read."
How the three hooks get their types
- +A real start value [`useState empty string`] | TypeScript **infers** the type | Write **nothing**
- +A placeholder for later [`useState<User or null>`] | Write the **type argument** with `null` | **Check for `null`** before reading
- +A reducer [`chatReducer, initialState`] | Type the state and a **union of actions** | `useReducer` **infers** the rest
- +A ref [`useRef<HTMLInputElement>`] | One **`RefObject`** type in React 19 | Read `current` with **`?.`** or a check
```
