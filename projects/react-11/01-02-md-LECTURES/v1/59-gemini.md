# Lecture 59: Keeping Context Fast When Its Value Changes

*(Why does a message that uses only the user re-render when the theme changes?)*

> INTERVIEW QUESTION | ❱❱ MORE | How does context propagation cause re-renders, and how do you keep it fast?

---

## VS | One `AppContext` for Every Value vs. One Context per Value: React compares the whole value, never the part a component uses

> A context hands a single value to any component below it that calls `useContext`. That lets the theme and the signed-in user reach the whole page without props. **When the provider receives a different value, React re-renders every component reading that context, even if the part that changed is never used by it**. One theme click can re-render every message row. To prevent this, give each value its own context and keep object values stable with `useMemo`.

In React, some values are needed across the whole page, such as the active theme, the signed-in user, or the current language. Passing them through every component as props causes prop drilling, so we place them in a context instead (Lesson 28). A provider near the top holds the value, and any component below it reads that value with `useContext`. This lesson explains what happens when that value changes.

Keep one rule in mind for this entire lesson: **React compares the whole value of the provider, never just the part a component takes out**. When the provider receives a different value, every component reading that context executes again.

Take a chat app. Every message row reads the signed-in user, so it can show `You` next to your own messages. The same app has a `Toggle theme` button that switches the page between light and dark. A developer puts both values into one context, because one provider is less code. When the user clicks `Toggle theme`, which message rows re-render? All of them, even though no row uses the theme.

**Why this happens:** The provider's value is one object that holds the theme and the user. A theme click builds a new object with the new theme in it. React sees a different object, so it re-renders every component that reads the context, every message row included. The rows show the same text as before, so nothing changes on the screen. The cost is time. In a chat with hundreds of messages, React calls hundreds of components that have nothing new to show, and the page turns dark only after a delay.

### The Smallest Page That Shows It

Two reminders first, because this lesson stands on them.

> [!DEFINITION]
> **A context.** [REVIEW] Context lets a component pass data deep down the tree without prop drilling.
> 1. You create a context outside components: `const ThemeContext = createContext('light')`.
> 2. A parent component holds the state and wraps its children: `<ThemeContext value={theme}>`.
> 3. Any nested component reads that value directly: `const theme = useContext(ThemeContext)`.
>
> A context holds no state of its own. The parent component holds the data, context delivers it, and whenever that value changes, every component reading it updates automatically (Lesson 28).

> [!DEFINITION]
> **What does `Object.is` say about objects?** [REVIEW] `Object.is` is the check React uses to ask: "Is this the same value I already have?"
> For a string or a number, it compares the values. `Object.is('Taylor', 'Taylor')` is `true`.
> For an object, it never looks at the fields. It asks only: "Is this the very same object?" Two objects built on two renders are two different objects, even with the same fields inside. `Object.is({ a: 1 }, { a: 1 })` is `false`, exactly like `{ a: 1 } === { a: 1 }` in plain JavaScript (Lesson 56).

Here is the smallest page that shows the problem: one button, and one message by Taylor, the signed-in user.

```page width=text caption="The page when it opens: a Toggle theme button and one message written by the signed-in user."
line: [Toggle theme]
line: You: Hi!
```

`AppProviders` holds the theme and the user in state and passes both through `AppContext`. Look at `value={{ theme, currentUser }}`. The outer curly braces step into JavaScript, and the inner ones build one object that holds both values (Lesson 3). `Message` takes only `currentUser` out of the context:

```jsx title="App.jsx: one context holds the theme and the user" startLine="1"
import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

function AppProviders({ children }) {
  const [theme, setTheme] = useState('light');
  const [currentUser] = useState('Taylor');
  return (
    <>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      <AppContext ~value={{ theme, currentUser }}~> {/* One object holds both values */}
        {children}
      </AppContext>
    </>
  );
}

function Message({ author, text }) {
  const { ~currentUser~ } = useContext(AppContext); // Takes only the user out of the context
  console.log('Message rendered:', text);
  return <li>{author === currentUser ? 'You' : author}: {text}</li>;
}

export default function App() {
  return (
    <AppProviders>
      <ul>
        <Message author="Taylor" text="Hi!" />
      </ul>
    </AppProviders>
  );
}
```

The user clicks `Toggle theme`. Nothing on this small page uses the theme yet, so the screen stays the same. But the Console prints `Message rendered: Hi!` again:

```devconsole caption="The real Console after the user clicks Toggle theme once: Strict Mode prints the line twice."
+ Message rendered: Hi! | App.jsx:22
+ Message rendered: Hi! | App.jsx:22
```

Why twice? Like every page in this book, ours is mounted inside `<StrictMode>`. In development mode, StrictMode makes React call each component twice to expose accidental side effects. In production builds, each component executes only once (Lesson 47). To keep the Console easy to read, every other Console in this lesson shows one line per render.

### What `useContext` Really Hands Over

**`Message` never reads the theme, yet React re-rendered it anyway.** Here is what happens step by step:
1. Calling `useContext` does not deliver only the user property. It delivers the provider's entire value object containing both theme and user.
2. The destructuring syntax extracts one property, but only after React hands over the complete object.
3. When the button is clicked, `AppProviders` re-renders and constructs a new object literal holding the dark theme.
4. React compares the previous object with the new object using `Object.is`. Because their memory addresses differ, the check fails.
5. React immediately re-renders every component that subscribes to `AppContext`, which includes `Message`.

React's docs state it clearly: "React automatically re-renders all the children that use a particular context starting from the provider that receives a different `value`. The previous and the next values are compared with the `Object.is` comparison."

Now compare two ways to read the same context. The first takes only the user out of it. The second takes both values:

```jsx title="Taking one property out of AppContext, and taking both"
const { ~currentUser~ } = useContext(AppContext); // Re-renders when the theme changes
const { ~theme, currentUser~ } = useContext(AppContext); // Re-renders when the theme changes
```

For re-renders, **these two lines produce the exact same outcome.** Both read the same whole value, so both re-render on every click on `Toggle theme`.

This is where developers usually go wrong. Taking only `currentUser` out of the context looks like depending only on `currentUser`. **It may look selective, but it is not.** Two separate things happen:
1. **What the component takes out.** Only the properties it names, here `currentUser`.
2. **What React compares.** The whole value, the old object against the new one.

React's docs give this its name: `useContext` lets a component read and subscribe to context. To subscribe means that React notes the component as a reader of that context, and calls it again every time the provider gets a different value. The component subscribes to the whole value, not to the property it takes out.

```tree caption="What the component takes out of the context vs. what React compares when the provider renders again."
`Message` reads `AppContext`
- +What `Message` takes out [`const { currentUser }`] | Only **`currentUser`** | Used to show **`You`**
- !What React compares [`value={{ theme, currentUser }}`] | The **whole value** of the provider | A theme click makes a **new object**, so `Message` **re-renders**
```

### What It Costs on a Real Chat

On a real chat, the list holds hundreds of messages, and each row reads the signed-in user to show `You`. With the theme and the user in one context, every click on `Toggle theme` re-renders every row.

The user sees no wrong text. The rows return the same JSX, so React changes nothing on the screen (Lesson 54). The cost is time. React calls hundreds of components that have nothing new to show, and with many or slow rows, the page turns dark only after a delay. React's docs are honest about the size of this: "In smaller apps, this is not a problem." On a long chat, it is.

Developers usually go wrong in four places, and the principles of this lesson fix them one by one:
1. They think a component that takes one property out of a context re-renders only when that property changes.
2. They split the context in two, and every row still re-renders, because the new context's value is an object written inside the providing component.
3. They wrap that object in `useMemo`, while the providing component writes the rows' tags itself, so the rows re-render anyway as its children.
4. They wrap the rows in `memo` and expect it to stop the context.

### The Rule of Thumb: is the provider's value the same value?

**Ask one question about every click: does the provider get the same value as last time, by `Object.is`? If not, every component that reads that context re-renders.**

When a context change re-renders many components, you choose between four ways:
1. **Leave it, and measure first.** This fits a small app where the user feels no lag (Lesson 54).
2. **Separate contexts for values that change at different times.** This fits values that different components read, such as the theme and the current user. Principle 2 shows it.
3. **`useMemo` on an object value.** This fits a context that must carry a value and a function together, such as the user and the setter that changes it. Principles 3 and 4 show it.
4. **Split the component in two.** An outer component reads the context and passes the part it needs to an inner component wrapped in `memo`. This fits a component that needs only one part of a context that changes for other reasons. Principle 5 shows it.

## SECTION | A Chat Room with a Theme Button

We build on the chat room of Lessons 54 to 58. The message input field and the button to send are gone, because this lesson needs no new messages. What is new is a signed-in user, Taylor, and a top bar that shows her name. Alice is the other person in the chat:

```page width=text caption="The chat room when it opens: the Toggle theme button, the top bar, and three messages."
line: [Toggle theme]
line: Signed in as Taylor
line: You: Hi!
line: Alice: Lunch at 12?
line: You: Sure
```

In the first two principles, the user does one thing: clicks `Toggle theme`. From Principle 3 on, the top bar also gets a `Log out` button.

```files title="chat-room: File Explorer" caption="How the chat room files sit inside src/ and src/components/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` and mounts it inside `<StrictMode>`
  index.css | styles | The `.light` and `.dark` classes
  Contexts.js | contexts | Exports the contexts as named exports
  AppProviders.jsx | provider | Holds `theme` and `currentUser` and wraps `children` in the providers
  App.jsx | root | Writes `<TopBar />` and `<ChatRoom />` between the `AppProviders` tags
  components/
    TopBar.jsx | reads the theme and the user | Shows `Signed in as Taylor` in the theme's colors
    ChatRoom.jsx | reads no context | Maps the three messages to `<Message>` rows
    Message.jsx | reads the user | Shows `You` for Taylor's messages
```

Each component reads something different:
1. **`TopBar`** reads the theme for its colors, and the user for `Signed in as Taylor`.
2. **Each `Message`** reads only the user, to show `You` for Taylor's messages.
3. **`ChatRoom`** reads no context at all.

One detail matters for everything that follows. `App` passes the top bar and the chat room between the provider tags as children (Lesson 58). When `AppProviders` updates its state, React does not re-render those children because `App` did not execute again. The only path for a theme update to reach those components is through context subscriptions. That lets us watch what the context does on its own.

Each component prints one line when React calls it, such as `TopBar rendered` or `Message rendered: Hi!`. These lines tell us which components React re-renders after each click.

**PRINCIPLES:** React compares the whole value of the provider, never the part a component takes out. Five principles follow:
1. **Principle 1: A Context Change Re-renders Every Component That Reads It.** A theme click re-renders every message, while `ChatRoom` in the middle is skipped.
2. **Principle 2: Two Contexts Keep the Theme Away from the Messages.** With the theme and the user in separate contexts, a theme click re-renders only the components that read the theme.
3. **Principle 3: An Object Written in the Provider Is New on Every Render.** Putting the user and its setter into one object makes every message re-render on a theme click again.
4. **Principle 4: `useMemo` Keeps the Object the Same.** The provider then gets the same object until `currentUser` really changes.
5. **Principle 5: Split the Component in Two So `memo` Can Work.** An outer component reads the context and passes a prop to an inner component wrapped in `memo`.

---

## PRINCIPLE | useContext: every component that reads the context re-renders when its value changes

> [!PRINCIPLE]
> **Principle 1: Context Re-renders: Every Component That Reads the Context Re-renders When Its Value Changes**
>
> *When a provider gets a different value, compared with `Object.is`, React re-renders every component below it that reads that context, even when the part a component uses did not change.*
>
> A component that reads a context subscribes to the provider's whole value, not to the property it takes out. A theme click gives `AppContext` a new object, so every message re-renders, though the messages use only the user. A component in the middle that does not read the context, such as `ChatRoom`, is not re-rendered by it.
>
> **DO THIS:**
> ```jsx
> function ChatRoom() {
>   return <ul>{messages.map(m => <Message key={m.id} author={m.author} text={m.text} />)}</ul>;
> }
> function Message({ author, text }) {
>   const { currentUser } = ~useContext(AppContext)~; // Re-renders whenever AppContext gets a new value
>   return <li>{author === currentUser ? 'You' : author}: {text}</li>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function Message({ author, text }) {
>   const { ~currentUser~ } = useContext(AppContext); // **WRONG:** expecting a re-render only when currentUser changes; a theme change re-renders it too
>   return <li>{author === currentUser ? 'You' : author}: {text}</li>;
> }
> ```

### VS | A Component in the Middle vs. a Component That Reads the Context: the context passes through the first one

In the smallest page, the message sat right under the provider. A real page has components between the provider and the components that read it. Here are the two kinds side by side:

```jsx title="A component in the middle, and a component that reads the context"
function ~ChatRoom~() { // Reads no context
  return <ul><Message author="Taylor" text="Hi!" /></ul>;
}

function Message({ author, text }) {
  const { currentUser } = ~useContext(AppContext)~; // Reads AppContext
  return <li>{author === currentUser ? 'You' : author}: {text}</li>;
}
```

Here, the chat room component sits between the provider and `Message`, without calling `useContext`. React's docs call such components intermediate components. As the docs explain: "Context passes through any components in the middle." Consequently, a context update flows straight past intermediate components to reach consumers directly, without re-rendering `ChatRoom`.

### The Chat Room on One Context

Now we build the whole chat room on one `AppContext`. The context lives in its own file, as React's docs suggest, so every component can import it:

```js title="src/Contexts.js" startLine="1"
import { createContext } from 'react';

export const ~AppContext~ = createContext(null); // Named export, imported with curly braces
```

`AppProviders` holds both values and passes them in one object:

```jsx title="src/AppProviders.jsx" startLine="1"
import { useState } from 'react';
import { AppContext } from './Contexts.js';

export default function AppProviders({ children }) {
  const [theme, setTheme] = useState('light');
  const [currentUser] = useState('Taylor');
  console.log('AppProviders rendered');
  return (
    <>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      <AppContext ~value={{ theme, currentUser }}~> {/* A new object on every render of AppProviders */}
        {children}
      </AppContext>
    </>
  );
}
```

`App` writes the top bar and the chat between the `AppProviders` tags:

```jsx title="src/App.jsx" startLine="1"
import AppProviders from './AppProviders.jsx';
import TopBar from './components/TopBar.jsx';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  return (
    <AppProviders>
      ~<TopBar />~ {/* Written by App, passed to AppProviders as children */}
      <ChatRoom />
    </AppProviders>
  );
}
```

`TopBar` uses both values. `ChatRoom` reads no context. `Message` uses only the user:

```jsx title="src/components/TopBar.jsx" startLine="1"
import { useContext } from 'react';
import { AppContext } from '../Contexts.js';

export default function TopBar() {
  const { ~theme, currentUser~ } = useContext(AppContext); // Uses both values
  console.log('TopBar rendered');
  return <header className={theme}>Signed in as {currentUser}</header>;
}
```

```jsx title="src/components/ChatRoom.jsx" startLine="1"
import Message from './Message.jsx';

const messages = [
  { id: 1, author: 'Taylor', text: 'Hi!' },
  { id: 2, author: 'Alice', text: 'Lunch at 12?' },
  { id: 3, author: 'Taylor', text: 'Sure' },
];

export default function ~ChatRoom~() { // Reads no context
  console.log('ChatRoom rendered');
  return (
    <ul>
      {messages.map(m => <Message key={m.id} author={m.author} text={m.text} />)}
    </ul>
  );
}
```

```jsx title="src/components/Message.jsx" startLine="1"
import { useContext } from 'react';
import { AppContext } from '../Contexts.js';

export default function Message({ author, text }) {
  const { ~currentUser~ } = useContext(AppContext); // Uses only the user
  console.log('Message rendered:', text);
  return <li>{author === currentUser ? 'You' : author}: {text}</li>;
}
```

When the page opens, React calls every component once:

```devconsole caption="The Console when the page opens."
+ AppProviders rendered | AppProviders.jsx:7
+ TopBar rendered | TopBar.jsx:6
+ ChatRoom rendered | ChatRoom.jsx:10
+ Message rendered: Hi! | Message.jsx:6
+ Message rendered: Lunch at 12? | Message.jsx:6
+ Message rendered: Sure | Message.jsx:6
```

### What One Click on Toggle Theme Re-renders

**A single click re-renders the top bar and all three messages, while skipping `ChatRoom`.** The top bar requires the new theme class. The messages do not use the theme, yet they re-render anyway:

```page width=text caption="The chat room after the user clicks Toggle theme: the top bar turns dark, and the three messages show the same text."
line: [Toggle theme]
line: Signed in as Taylor | good
line: You: Hi!
line: Alice: Lunch at 12?
line: You: Sure
```

```devconsole caption="The Console after the user clicks Toggle theme once, with the theme and the user in one AppContext."
+ AppProviders rendered | AppProviders.jsx:7
+ TopBar rendered | TopBar.jsx:6
+ Message rendered: Hi! | Message.jsx:6
+ Message rendered: Lunch at 12? | Message.jsx:6
+ Message rendered: Sure | Message.jsx:6
```

Here is the exact sequence of events after the click:
1. The user clicks `Toggle theme`, calling the state updater in `AppProviders`.
2. React calls `AppProviders`, which evaluates `{ theme, currentUser }` into a brand new object with the dark theme.
3. React compares the previous context value with the new one using `Object.is`. Because they are distinct object instances, the check fails.
4. The `children` prop remains identical to the previous render because `App` did not execute. React skips calling `ChatRoom` as a child, omitting it from the console logs (Lesson 58).
5. React descends from the provider and re-renders every component reading `AppContext`: `TopBar` and all three messages.

The messages return exactly the JSX they returned before, so React changes no `<li>` element on the page. In the Elements panel, only the `<header>` element changed:

```dom caption="The Elements panel after one click on Toggle theme: only the header changed its class."
<button>Toggle theme</button>
+ <header class="dark">Signed in as Taylor</header> | note: The only node that changed: light became dark
<ul>
  <li>You: Hi!</li>
  <li>Alice: Lunch at 12?</li>
  <li>You: Sure</li>
</ul>
```

Look at where the re-render of `Message` came from. No prop of `Message` changed, and its parent component did not execute. React re-rendered `Message` straight from the provider. This is the third cause of a re-render: a change of a context the component reads (Lesson 54).

```tree caption="What one click on Toggle theme re-renders when the theme and the user share one AppContext."
A click on `Toggle theme` gives `AppContext` a new object
- +`TopBar` reads the context [`useContext`] | Uses the **theme** | Re-renders, and **the header turns dark**
- +`ChatRoom` reads no context | A **component in the middle** | **Skipped**: the context passes through it
- !Each `Message` reads the context [`const { currentUser }`] | Uses **only the user** | **Re-renders anyway**, with the same text
```

Teams often meet this by accident. They put every app-wide value into one context, because one provider is less code. Hundreds of rows read the context only to get the user. Each theme click gives the provider a new object, and every row re-renders. Then the team wraps the rows in `memo`, and nothing changes, as Principle 5 shows.

Remember: React compares the whole value, never the part a component takes out.

---

## PRINCIPLE | Two contexts: a theme click re-renders only the components that read the theme

> [!PRINCIPLE]
> **Principle 2: Separate Contexts: Values That Change at Different Times Go into Different Contexts**
>
> *Put values that change at different times, and that different components read, into separate contexts; a change of one context's value does not re-render the components that read only the other.*
>
> The theme changes on every click, and the user changes rarely. With one context, every theme click reaches every component that needs only the user. With `ThemeContext` and `UserContext`, the theme click re-renders only the components that read the theme.
>
> **DO THIS:**
> ```jsx
> <ThemeContext value={theme}>
>   <UserContext ~value={currentUser}~> {/* Still 'Taylor' after a theme click: messages are skipped */}
>     {children}
>   </UserContext>
> </ThemeContext>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <AppContext ~value={{ theme, currentUser }}~> {/* **WRONG:** every theme click re-renders every component that needs only the user */}
>   {children}
> </AppContext>
> ```

### VS | One Context for the Theme and the User vs. One Context for Each: React compares each context on its own

The theme changes on every click. The user changes rarely, only when someone logs in or out. So we give each value its own context. Both versions pass the same two values to the same components. The one difference is how many contexts carry them:

```jsx title="One AppContext for both values"
<AppContext ~value={{ theme, currentUser }}~> {/* A theme click gives the messages a new value */}
  {children}
</AppContext>
```

```jsx title="ThemeContext and UserContext, one for each value"
<ThemeContext ~value={theme}~> {/* A theme click changes this value */}
  <UserContext ~value={currentUser}~> {/* Still the string 'Taylor' after a theme click */}
    {children}
  </UserContext>
</ThemeContext>
```

With both versions, the page looks the same: the same top bar, the same three messages, and the same dark header after a click. **While the screens look alike, the internal mechanics differ completely.** React compares each context on its own, and a component re-renders only for the contexts it reads. After a theme click, `UserContext` still gets the string `'Taylor'`. For two equal strings, `Object.is` says: the same value (Lesson 56). So React has no reason to re-render a component that reads only `UserContext`.

React's docs show the same split in their multiple contexts example: "there are two independent contexts. `ThemeContext` provides the current theme, which is a string, while `CurrentUserContext` holds the object representing the current user." You already split a reducer's state and its `dispatch` into two contexts the same way (Lesson 29). What is new here is the reason: the two values change at different times.

### The Chat Room on Two Contexts

`Contexts.js` now exports two contexts. The theme gets `'light'` as its default value, and the user gets `null`:

```js title="src/Contexts.js" startLine="1"
import { createContext } from 'react';

export const ~ThemeContext~ = createContext('light'); // Changes on every click
export const ~UserContext~ = createContext(null); // Changes only on log in or log out
```

`AppProviders` puts one provider inside the other:

```jsx title="src/AppProviders.jsx" startLine="1"
import { useState } from 'react';
import { ThemeContext, UserContext } from './Contexts.js';

export default function AppProviders({ children }) {
  const [theme, setTheme] = useState('light');
  const [currentUser] = useState('Taylor');
  console.log('AppProviders rendered');
  return (
    <>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      <ThemeContext ~value={theme}~> {/* Gets 'dark' after the click */}
        <UserContext ~value={currentUser}~> {/* Still gets 'Taylor' after the click */}
          {children}
        </UserContext>
      </ThemeContext>
    </>
  );
}
```

`TopBar` reads both contexts. `Message` reads only `UserContext`:

```jsx title="src/components/TopBar.jsx" startLine="1"
import { useContext } from 'react';
import { ThemeContext, UserContext } from '../Contexts.js';

export default function TopBar() {
  const theme = ~useContext(ThemeContext)~; // Re-renders on a theme click
  const currentUser = useContext(UserContext);
  console.log('TopBar rendered');
  return <header className={theme}>Signed in as {currentUser}</header>;
}
```

```jsx title="src/components/Message.jsx" startLine="1"
import { useContext } from 'react';
import { UserContext } from '../Contexts.js';

export default function Message({ author, text }) {
  const currentUser = ~useContext(UserContext)~; // Reads only the user
  console.log('Message rendered:', text);
  return <li>{author === currentUser ? 'You' : author}: {text}</li>;
}
```

`ChatRoom` and `App` stay the same. The user clicks `Toggle theme`, the header turns dark, and no message prints a line:

::: row caption="The Console after one click on Toggle theme: one AppContext for both values vs. ThemeContext and UserContext."
::: col title="One AppContext for both values" tag="every message re-renders" tone=bad
```devconsole
+ AppProviders rendered | AppProviders.jsx:7
+ TopBar rendered | TopBar.jsx:6
+ Message rendered: Hi! | Message.jsx:6
+ Message rendered: Lunch at 12? | Message.jsx:6
+ Message rendered: Sure | Message.jsx:6
```
The messages read a context whose value is a new object after the click.
:::
::: col title="ThemeContext and UserContext" tag="no message re-renders" tone=good
```devconsole
+ AppProviders rendered | AppProviders.jsx:7
+ TopBar rendered | TopBar.jsx:7
```
The messages read only `UserContext`, which still holds `'Taylor'`.
:::
:::

Here is what React does after the click with two contexts:
1. React re-renders `AppProviders`.
2. The theme context receives the dark theme string instead of light. Because `Object.is` identifies a difference, React re-renders `TopBar`.
3. `UserContext` gets `'Taylor'` again. `Object.is` says it is the same value, so React does not re-render the messages for it.

```tree caption="With two contexts, a theme click re-renders only the components that read the theme."
A click on `Toggle theme` with two contexts
- +`ThemeContext` gets `'dark'` | A **different** value | React re-renders **`TopBar`**
- +`UserContext` gets `'Taylor'` again | The **same** string | React **skips every `Message`**
```

You may worry that more contexts mean more providers wrapped around the app. React's docs answer it: "it is expected that you'll have a 'pyramid' of contexts closer to the root of your app. There is nothing wrong with that." A provider component such as our `AppProviders` keeps that pyramid in one file, so `App` stays short.

---

## PRINCIPLE | `value={{ currentUser, setCurrentUser }}`: an object written in the provider is new on every render

> [!PRINCIPLE]
> **Principle 3: Object Values: An Object Written in the Provider Is New on Every Render**
>
> *A value written as `{ ... }` inside the providing component is a new object on every render of that component, so every component that reads that context re-renders whenever the providing component re-renders.*
>
> The object `{ currentUser, setCurrentUser }` holds the same user and the same setter after a theme click. It is still a new object, and `Object.is` compares objects by identity. So the messages re-render on every theme click, as if the theme and the user still shared one context.
>
> **DO THIS:**
> ```jsx
> <UserContext ~value={currentUser}~> {/* A string: the same value after a theme click */}
>   {children}
> </UserContext>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <UserContext ~value={{ currentUser, setCurrentUser }}~> {/* **WRONG:** a new object after every theme click re-renders every message */}
>   {children}
> </UserContext>
> ```

### VS | The String `currentUser` vs. an Object with the Setter: the string stays the same value, the object is new on every render

The top bar now needs a `Log out` button. That button must call `setCurrentUser`. But the top bar cannot get the setter as a prop. `App` writes the top bar tag, not `AppProviders`, so the provider has no tag to put the prop on. The setter must travel through the context, together with the user. React's docs do the same: "You combine `{ currentUser, setCurrentUser }` into a single object and pass it down through the context inside the `value={}`."

Here are the two values the user context can carry, side by side:

```jsx title="The user context carrying the string, and carrying an object"
<UserContext ~value={currentUser}~> {/* The string 'Taylor': the same value after a theme click */}
<UserContext ~value={{ currentUser, setCurrentUser }}~> {/* A new object on every render of AppProviders */}
```

The second line has the same double curly braces as the smallest page: one object, which now holds the user and the setter.

### The Log Out Button

`AppProviders` now keeps the setter and puts it into the user context:

```jsx title="src/AppProviders.jsx" startLine="4"
export default function AppProviders({ children }) {
  const [theme, setTheme] = useState('light');
  const [currentUser, ~setCurrentUser~] = useState('Taylor'); // Kept, so the top bar can log out
  console.log('AppProviders rendered');
  return (
    <>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      <ThemeContext value={theme}>
        <UserContext ~value={{ currentUser, setCurrentUser }}~> {/* An object holds the user and the setter */}
          {children}
        </UserContext>
      </ThemeContext>
    </>
  );
}
```

`TopBar` takes both values out of the context, showing Signed out once the user becomes `null`:

```jsx title="src/components/TopBar.jsx" startLine="1"
import { useContext } from 'react';
import { ThemeContext, UserContext } from '../Contexts.js';

export default function TopBar() {
  const theme = useContext(ThemeContext);
  const { currentUser, ~setCurrentUser~ } = useContext(UserContext); // Not a prop: it comes from the context
  console.log('TopBar rendered');
  return (
    <header className={theme}>
      {currentUser === null ? 'Signed out' : (
        <>
          Signed in as {currentUser}
          <button onClick={() => ~setCurrentUser(null)~}>Log out</button> {/* Logs the user out */}
        </>
      )}
    </header>
  );
}
```

`Message` now takes `currentUser` out of the object:

```jsx title="src/components/Message.jsx" startLine="4"
export default function Message({ author, text }) {
  const { ~currentUser~ } = useContext(UserContext); // Takes the user out of the object
  console.log('Message rendered:', text);
  return <li>{author === currentUser ? 'You' : author}: {text}</li>;
}
```

```page width=text caption="The chat room with the Log out button in the top bar."
line: [Toggle theme]
line: Signed in as Taylor [Log out]
line: You: Hi!
line: Alice: Lunch at 12?
line: You: Sure
```

### Why Toggle Theme Reaches the Messages Again

**Following this change, clicking `Toggle theme` re-renders all three messages again, even though `UserContext` does not contain the theme.** The user did not log out. The user only switched the theme, and the Console looks exactly as it did with one `AppContext`:

```devconsole caption="The Console after the user clicks Toggle theme once, with an object in UserContext."
+ AppProviders rendered | AppProviders.jsx:7
+ TopBar rendered | TopBar.jsx:7
+ Message rendered: Hi! | Message.jsx:6
+ Message rendered: Lunch at 12? | Message.jsx:6
+ Message rendered: Sure | Message.jsx:6
```

The messages came back because of the object, not because of the theme. Here is what React does after the click:
1. The user clicks `Toggle theme`, and React re-renders `AppProviders`.
2. Evaluating `{ currentUser, setCurrentUser }` creates a new object in memory, even though `currentUser` remains unchanged and the setter is the same function.
3. React compares the new object with the old one using `Object.is`. They are two different objects.
4. React re-renders every component that reads `UserContext`: `TopBar` and the three messages.

A developer new to this thinks: "The object holds the same user and the same setter, so it is the same value." **While the contents are identical, the object instances are not.** Same contents and same object are two separate things. You know this from plain JavaScript:

```js title="What Object.is says about the string and about the object"
Object.is(~'Taylor', 'Taylor'~); // true: the same string
Object.is(~{ currentUser: 'Taylor' }, { currentUser: 'Taylor' }~); // false: two objects with the same contents
```

React's docs describe the same case with their `MyApp` component and its `login` function. On every re-render, "this will be a *different* object pointing at a *different* function", so React re-renders every component that reads that context.

```tree caption="What a theme click does to the user context when it carries a string vs. an object written in AppProviders."
What the user context gets after a theme click
- +The string `currentUser` [`value={currentUser}`] | `'Taylor'` again | `Object.is` says **the same**, so React **skips the messages**
- !An object written in `AppProviders` [`value={{ currentUser, setCurrentUser }}`] | A **new object** with the same contents | `Object.is` says **different**, so React **re-renders every message**
```

So with this object, the two contexts protect the messages no better than the single `AppContext` of Principle 1. For the messages after a theme click, both versions produce the exact same outcome. This is the trap behind the interview question:
1. A developer splits the theme and the user into two contexts.
2. The user context needs a setter, so they write `value={{ currentUser, setCurrentUser }}`.
3. Every row re-renders on each theme click, as before the split.
4. The developer concludes that splitting does not work.

There is also a fix that needs no object. React's docs keep the value and the function that changes it in two separate contexts, `TasksContext` and `TasksDispatchContext` (Lesson 29). The next principle keeps the object and makes it stay the same object.

---

## PRINCIPLE | useMemo on the value: the provider gets the same object until the user changes

> [!PRINCIPLE]
> **Principle 4: useMemo on the Value: Keep an Object Value the Same Object Between Renders**
>
> *Wrap an object value in `useMemo` with the values it holds as dependencies, so the provider gets the same object until one of them changes; wrap a function you write inside it in `useCallback`.*
>
> `useMemo` here is not about a slow calculation. It returns the same object after a theme click, so `Object.is` finds no change and the messages are skipped. After `Log out`, `currentUser` changes, `useMemo` builds a new object, and the messages re-render to show the new user. It helps only when the providing component takes the rest of the page as `children`. React's docs call it what it is: "a performance optimization."
>
> **DO THIS:**
> ```jsx
> const userValue = ~useMemo~(() => ({ currentUser, setCurrentUser }), [currentUser]); // The same object until currentUser changes
> <UserContext value={userValue}>{children}</UserContext>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <UserContext ~value={{ currentUser, setCurrentUser }}~> {/* **WRONG:** a new object on every render of AppProviders */}
>   {children}
> </UserContext>
> ```

### VS | The Object Written in Place vs. the Object Kept by `useMemo`: one is new on every render, the other only when the user changes

We want to keep the setter in the context and stop the extra re-renders. For that, the provider must get the same object until `currentUser` changes, and `useMemo` does exactly that (Lesson 56). Both versions give the messages the same user. The one difference is whether `AppProviders` builds a new object on every render:

```jsx title="The object written in place, and the object kept by useMemo"
<UserContext ~value={{ currentUser, setCurrentUser }}~> {/* A new object on every render */}

const userValue = ~useMemo~(() => ({ currentUser, setCurrentUser }), [currentUser]); // The same object until currentUser changes
<UserContext value={userValue}>
```

A developer new to this may think: "`useMemo` is for slow calculations, and building an object with two properties is fast." The object is indeed fast to build, but speed is not the reason here. The purpose of `useMemo` here is reference preservation, ensuring the provider's `Object.is` check detects no change. React's docs say: "even if the parent component needs to re-render, the components calling `useContext` won't need to re-render unless `currentUser` has changed."

### The User Context's Value Kept with `useMemo`

`AppProviders` imports `useMemo`, builds the user value object, and passes it to the provider. Nothing else in the project changes:

```jsx title="src/AppProviders.jsx" startLine="1"
import { useMemo, useState } from 'react';
import { ThemeContext, UserContext } from './Contexts.js';

export default function AppProviders({ children }) {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState('Taylor');
  const userValue = ~useMemo~( // Returns the same object until currentUser changes
    () => ({ currentUser, setCurrentUser }),
    ~[currentUser]~ // The only value that can change
  );
  console.log('AppProviders rendered');
  return (
    <>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      <ThemeContext value={theme}>
        <UserContext ~value={userValue}~> {/* The same object after a theme click */}
          {children}
        </UserContext>
      </ThemeContext>
    </>
  );
}
```

Notice that `setCurrentUser` is omitted from the dependency array on purpose. A setter from `useState` is guaranteed by React to be the same function on every render, just as `dispatch` is (Lesson 29). React's docs say: "If the linter lets you omit a dependency without errors, it is safe to do." The React Hooks linter knows that setters from `useState` never change, so it accepts `[currentUser]`. Writing `[currentUser, setCurrentUser]` gives the same result.

### A Theme Click vs. a Click on Log Out

The user clicks `Toggle theme`. The header turns dark, and again no message prints a line:

::: row caption="The Console after one click on Toggle theme: the object written in place vs. the object kept by useMemo."
::: col title="The object written in place" tag="every message re-renders" tone=bad
```devconsole
+ AppProviders rendered | AppProviders.jsx:7
+ TopBar rendered | TopBar.jsx:7
+ Message rendered: Hi! | Message.jsx:6
+ Message rendered: Lunch at 12? | Message.jsx:6
+ Message rendered: Sure | Message.jsx:6
```
`UserContext` gets a new object after every click.
:::
::: col title="The object kept by useMemo" tag="no message re-renders" tone=good
```devconsole
+ AppProviders rendered | AppProviders.jsx:11
+ TopBar rendered | TopBar.jsx:7
```
`UserContext` gets the same object until `currentUser` changes.
:::
:::

Here is what React does after the theme click:
1. React re-renders `AppProviders`.
2. Here, `useMemo` compares `currentUser` with the last render, and finds the exact same string both times. So it returns the object it stored last time.
3. The `UserContext` provider gets the same object, so React does not re-render the messages for it.

Now the user clicks `Log out`. This time every message must re-render, because Taylor's messages must stop saying `You`:

```page width=text caption="The chat room after the user clicks Log out: the top bar says Signed out, and Taylor's messages show her name."
line: [Toggle theme]
line: Signed out | good
line: Taylor: Hi! | good
line: Alice: Lunch at 12?
line: Taylor: Sure | good
```

```devconsole caption="The Console after the user clicks Log out, with useMemo."
+ AppProviders rendered | AppProviders.jsx:11
+ TopBar rendered | TopBar.jsx:7
+ Message rendered: Hi! | Message.jsx:6
+ Message rendered: Lunch at 12? | Message.jsx:6
+ Message rendered: Sure | Message.jsx:6
```

Calling `setCurrentUser(null)` updates `currentUser`, the single dependency in the Hook. Then `useMemo` builds a new object for the provider, so React re-renders `TopBar` and every message. That is exactly what we want: a theme click skips the messages, and a real change of the user reaches them.

```tree caption="useMemo keeps the user context's value the same after a theme click and builds a new one after Log out."
`userValue` from `useMemo` with `[currentUser]`
- +A click on `Toggle theme` | `currentUser` is still **`'Taylor'`** | The **same object**, so React **skips the messages**
- +A click on `Log out` | `currentUser` changes to **`null`** | A **new object**, so React **re-renders the messages**, which now show **Taylor**
```

### VS | `useMemo` with `children` vs. `useMemo` in a Component That Writes the Tags Itself: only the first one saves the messages

**`useMemo` saves the messages only because `AppProviders` takes the page as `children`.** Move the state into `App`, which writes the child tags itself, and the same `useMemo` line saves nothing:

```jsx title="App.jsx: the state and useMemo in App, which writes every tag itself"
export default function App() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState('Taylor');
  const userValue = useMemo(() => ({ currentUser, setCurrentUser }), [currentUser]);
  return (
    <ThemeContext value={theme}>
      <UserContext value={userValue}>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Toggle theme</button>
        <TopBar />
        ~<ChatRoom />~ {/* **WRONG:** written by App, so every theme click re-renders it and every message */}
      </UserContext>
    </ThemeContext>
  );
}
```

```devconsole caption="The Console after the user clicks Toggle theme once, with the state and useMemo in App."
+ TopBar rendered | TopBar.jsx:7
+ ChatRoom rendered | ChatRoom.jsx:10
+ Message rendered: Hi! | Message.jsx:6
+ Message rendered: Lunch at 12? | Message.jsx:6
+ Message rendered: Sure | Message.jsx:6
```

**While both versions use `useMemo`, their rendering behavior is entirely different.** A state change in `App` re-renders `App` and every component written directly inside its return statement. React's docs say: "when a component's state changes, React will re-render that component and all of its children, unless you have applied some form of manual memoization." So `ChatRoom` and every message re-render as children, and the stable `userValue` makes no difference. The fixes of this lesson pay off only when intermediate components are skipped, through `children` (Lesson 58) or through `memo` (Lesson 55).

When the context carries a function that we write ourselves, that function needs the same care. React's docs write a custom login function, wrap it in `useCallback` (Lesson 57), and list it as a dependency of `useMemo`. Our context carries only `setCurrentUser`, which never changes, so it needs no `useCallback`. React Compiler can memoize such a value for you when the app is built, and Lesson 63 shows how.

---

## PRINCIPLE | memo with a context: split the component in two, so memo compares a prop

> [!PRINCIPLE]
> **Principle 5: Split in Two: An Outer Component Reads the Context, an Inner One Is Wrapped in memo**
>
> *`memo` cannot stop a component that reads a context from re-rendering when that context changes; to re-render only when a part of the context changes, split the component in two: the outer one reads the context and passes the part it needs as a prop to an inner one wrapped in `memo`.*
>
> After `Log out`, Alice's message has nothing new to show, yet it re-renders because it reads the user. `memo` compares only props. So `MessageRow` reads the context and passes `isMine` to a `Message` wrapped in `memo`. For Alice, `isMine` is `false` before and after the click, so `memo` skips her message.
>
> **DO THIS:**
> ```jsx
> function MessageRow({ author, text }) {
>   const { currentUser } = useContext(UserContext);
>   return <Message ~isMine={author === currentUser}~ author={author} text={text} />; // Message is wrapped in memo, so it compares isMine
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const Message = memo(function Message({ author, text }) {
>   const { currentUser } = ~useContext(UserContext)~; // **WRONG:** memo cannot skip a component that reads the context
>   return <li>{author === currentUser ? 'You' : author}: {text}</li>;
> });
> ```

### VS | `memo` on a Component That Reads the Context vs. `memo` on a Component That Gets a Prop: memo compares props only

Look again at the Console after `Log out` in Principle 4. It printed `Message rendered: Lunch at 12?`. But Alice's message shows `Alice: Lunch at 12?` before and after the click, so it had nothing new to show. It re-rendered only because it reads `currentUser`, and `currentUser` changed.

The first idea is to wrap `Message` in `memo` (Lesson 55). Here are two ways to do it, side by side:

```jsx title="memo on a Message that reads the context"
const Message = memo(function Message({ author, text }) {
  const { currentUser } = ~useContext(UserContext)~; // **WRONG:** memo cannot stop a context change
  return <li>{author === currentUser ? 'You' : author}: {text}</li>;
});
```

```jsx title="memo on a Message that gets isMine as a prop"
const Message = memo(function Message({ ~isMine~, author, text }) { // memo compares isMine, author, and text
  return <li>{isMine ? 'You' : author}: {text}</li>;
});
```

**These two versions look similar, but their behavior is completely different.** The `memo` wrapper compares props, and a context read inside the component is not a prop. React's docs state this clearly: "Memoization only has to do with props that are passed to the component from its parent." The docs add: "Even with `memo`, your component will re-render if its own state changes or if a context that it's using changes." So the version that reads the context re-renders on every change of `UserContext`, with or without `memo`. The version with `isMine` reads no context, re-rendering only when its incoming props change.

### `Message` Split in Two

Someone still has to read the context and work out `isMine`. React's docs give the way: "To make your component re-render only when a *part* of some context changes, split your component in two. Read what you need from the context in the outer component, and pass it down to a memoized child as a prop."

To split a component in two means to write two components where there was one:
1. **The outer component, `MessageRow`, reads the context.** It works out `isMine` and returns one `<Message>` tag.
2. **The inner component, `Message`, is wrapped in `memo`.** It gets `isMine` as a prop and reads no context.

```jsx title="src/components/Message.jsx" startLine="1"
import { memo, useContext } from 'react';
import { UserContext } from '../Contexts.js';

const Message = ~memo~(function Message({ isMine, author, text }) { // Inner: reads no context
  console.log('Message rendered:', text);
  return <li>{isMine ? 'You' : author}: {text}</li>;
});

export function ~MessageRow~({ author, text }) { // Outer: reads the context
  const { currentUser } = useContext(UserContext);
  return <Message ~isMine={author === currentUser}~ author={author} text={text} />; // isMine is true or false
}
```

`ChatRoom` now writes a `<MessageRow>` for each message. `MessageRow` is a named export, so `ChatRoom` imports it with curly braces (Lesson 5):

```jsx title="src/components/ChatRoom.jsx" startLine="1"
import { MessageRow } from './Message.jsx';

const messages = [
  { id: 1, author: 'Taylor', text: 'Hi!' },
  { id: 2, author: 'Alice', text: 'Lunch at 12?' },
  { id: 3, author: 'Taylor', text: 'Sure' },
];

export default function ChatRoom() {
  console.log('ChatRoom rendered');
  return (
    <ul>
      {messages.map(m => ~<MessageRow key={m.id} author={m.author} text={m.text} />~)} {/* The outer component, once per message */}
    </ul>
  );
}
```

### What Log Out Re-renders Now

**After `Log out`, only Taylor's two messages re-render. Alice's message is skipped.** The page is the same as in Principle 4: the top bar says `Signed out`, and Taylor's messages show her name. Only the Console tells the two versions apart:

::: row caption="The Console after the user clicks Log out: one Message that reads the context vs. MessageRow and a Message wrapped in memo."
::: col title="One Message that reads the context" tag="Alice's message re-renders" tone=bad
```devconsole
+ AppProviders rendered | AppProviders.jsx:11
+ TopBar rendered | TopBar.jsx:7
+ Message rendered: Hi! | Message.jsx:6
+ Message rendered: Lunch at 12? | Message.jsx:6
+ Message rendered: Sure | Message.jsx:6
```
Every message reads `UserContext`, so every message re-renders.
:::
::: col title="MessageRow and a Message wrapped in memo" tag="Alice's message is skipped" tone=good
```devconsole
+ AppProviders rendered | AppProviders.jsx:11
+ TopBar rendered | TopBar.jsx:7
+ Message rendered: Hi! | Message.jsx:5
+ Message rendered: Sure | Message.jsx:5
```
Only the messages whose `isMine` changed re-render.
:::
:::

Here is what React does after `Log out`:
1. Logging out re-renders `AppProviders`, and `useMemo` builds a new object with no user.
2. React re-renders the three `MessageRow` components, because they read `UserContext`.
3. For Taylor's two messages, the `isMine` prop changes from true to false. Because a prop changed, `memo` permits re-rendering, displaying her actual name.
4. For Alice's message, `isMine` remains false. The `memo` wrapper compares all props using `Object.is` and finds them identical, so React skips her message.

`MessageRow` itself still re-renders on every change of the user. That is cheap, because it only reads the context and returns one tag. The split pays off when the inner component is slow, which is the only case where `memo` pays off at all (Lesson 55). On our three short messages, none of this matters. React's docs say so plainly: "In smaller apps, this is not a problem." Measure before you split (Lesson 54).

```tree caption="After Log out, MessageRow reads the new user and memo decides which Message re-renders."
A click on `Log out` re-renders every `MessageRow`
- +`Hi!` and `Sure` | `isMine` changes from **`true`** to **`false`** | `memo` sees a change, so **`Message` re-renders** and shows **Taylor**
- +`Lunch at 12?` | `isMine` stays **`false`** | `memo` sees the **same props**, so React **skips `Message`**
```

React's docs warn about the first idea in their list of caveats: "Skipping re-renders with `memo` does not prevent the children receiving fresh context values." A developer who wraps a component that reads a context in `memo` sees no change, because the context reaches the component directly. Libraries that let a component read only one part of a store belong to Lesson 60. This lesson uses only React's own tools.

---

## All 5 Principles Together

### The Complete Project

Here is the complete chat room:
1. The theme and the user live in separate contexts.
2. The user context gets the same object until the user changes.
3. `AppProviders` takes the page as `children`.
4. `MessageRow` reads the context, so `memo` can skip the inner message component.

```jsx title="src/main.jsx" startLine="1"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```css title="src/index.css" startLine="1"
.light {
  background: white;
  color: black;
}

.dark {
  background: #222;
  color: white;
}
```

```js title="src/Contexts.js" startLine="1"
import { createContext } from 'react';

export const ~ThemeContext~ = createContext('light'); // Principle 2: the theme in its own context
export const ~UserContext~ = createContext(null); // Principle 2: the user in its own context
```

```jsx title="src/AppProviders.jsx" startLine="1"
import { useMemo, useState } from 'react';
import { ThemeContext, UserContext } from './Contexts.js';

export default function ~AppProviders~({ children }) { // 2. Called second, and again on every click
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState('Taylor');
  const userValue = ~useMemo~( // Principle 4: the same object until currentUser changes
    () => ({ currentUser, setCurrentUser }),
    [currentUser]
  );
  console.log('AppProviders rendered');
  return (
    <>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle theme
      </button>
      <ThemeContext value={theme}>
        <UserContext value={userValue}>
          {children}
        </UserContext>
      </ThemeContext>
    </>
  );
}
```

```jsx title="src/App.jsx" startLine="1"
import AppProviders from './AppProviders.jsx';
import TopBar from './components/TopBar.jsx';
import ChatRoom from './components/ChatRoom.jsx';

export default function ~App~() { // 1. Called first; holds no state, so it runs only when the page opens
  return (
    <AppProviders>
      <TopBar />
      <ChatRoom />
    </AppProviders>
  );
}
```

```jsx title="src/components/TopBar.jsx" startLine="1"
import { useContext } from 'react';
import { ThemeContext, UserContext } from '../Contexts.js';

export default function ~TopBar~() { // 3. Called third; reads both contexts
  const theme = useContext(ThemeContext);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  console.log('TopBar rendered');
  return (
    <header className={theme}>
      {currentUser === null ? 'Signed out' : (
        <>
          Signed in as {currentUser}
          <button onClick={() => setCurrentUser(null)}>Log out</button>
        </>
      )}
    </header>
  );
}
```

```jsx title="src/components/ChatRoom.jsx" startLine="1"
import { MessageRow } from './Message.jsx';

const messages = [
  { id: 1, author: 'Taylor', text: 'Hi!' },
  { id: 2, author: 'Alice', text: 'Lunch at 12?' },
  { id: 3, author: 'Taylor', text: 'Sure' },
];

export default function ~ChatRoom~() { // 4. Called fourth; reads no context, so only the page opening runs it
  console.log('ChatRoom rendered');
  return (
    <ul>
      {messages.map(m => <MessageRow key={m.id} author={m.author} text={m.text} />)}
    </ul>
  );
}
```

```jsx title="src/components/Message.jsx" startLine="1"
import { memo, useContext } from 'react';
import { UserContext } from '../Contexts.js';

const Message = ~memo~(function Message({ isMine, author, text }) { // 6. Called after its MessageRow; skipped when its props are the same
  console.log('Message rendered:', text);
  return <li>{isMine ? 'You' : author}: {text}</li>;
});

export function ~MessageRow~({ author, text }) { // 5. Called once per message; reads the user
  const { currentUser } = useContext(UserContext);
  return <Message isMine={author === currentUser} author={author} text={text} />;
}
```

### How React Calls the Components

When the page opens, React starts at `App` and follows the tags from top to bottom. Both `App` and `MessageRow` omit log statements, so they print nothing. Every other component prints one line:

```devconsole caption="The Console when the page opens, one line per call."
+ AppProviders rendered | AppProviders.jsx:11
+ TopBar rendered | TopBar.jsx:7
+ ChatRoom rendered | ChatRoom.jsx:10
+ Message rendered: Hi! | Message.jsx:5
+ Message rendered: Lunch at 12? | Message.jsx:5
+ Message rendered: Sure | Message.jsx:5
```

```tree caption="The component tree of the chat room, the order in which React calls each component when the page opens, and the contexts each one reads."
1. `App`, called first | Holds no state and prints nothing | **Writes** `<TopBar />` and `<ChatRoom />` between the `AppProviders` tags
- +2. `AppProviders`, called second | Holds `theme` and `currentUser` | Provides **`ThemeContext`** and **`UserContext`**
  - +3. `TopBar`, called third | Reads **both contexts** | Re-renders on **every click**
  - +4. `ChatRoom`, called fourth | Reads **no context** | A **component in the middle**, never re-rendered by a click
    - +5. `MessageRow`, once per message | Reads **`UserContext`** and prints nothing | Re-renders on **Log out**
      - +6. `Message`, wrapped in `memo` | Reads **no context** | Re-renders only when **`isMine`** changes
```

### What Each Click Re-renders

| What the user does | Which context gets a new value | What React re-renders | Why |
| :--- | :--- | :--- | :--- |
| **Clicks `Toggle theme` with one `AppContext`** | `AppContext` | `AppProviders`, `TopBar`, every `Message` | Every message reads a context whose value is a new object |
| **Clicks `Toggle theme` with two contexts and `value={currentUser}`** | `ThemeContext` | `AppProviders`, `TopBar` | `UserContext` still holds the string `'Taylor'` |
| **Clicks `Toggle theme` with an object written in `AppProviders`** | `ThemeContext` and `UserContext` | `AppProviders`, `TopBar`, every `Message` | `{ currentUser, setCurrentUser }` is a new object on every render |
| **Clicks `Toggle theme` with `useMemo`** | `ThemeContext` | `AppProviders`, `TopBar` | `useMemo` returns the same object while `currentUser` stays `'Taylor'` |
| **Clicks `Log out` with `MessageRow` and `memo`** | `UserContext` | `AppProviders`, `TopBar`, every `MessageRow`, the two messages by Taylor | `isMine` changes for Taylor's messages and stays `false` for Alice's |

Remember the one sentence of this lesson. **React compares the whole value of the provider, never just the part a component takes out**. Keep that value reference stable until the data your subscribers depend on actually changes.

---

## For the Interview

> **The Interview Question:** How does context propagation cause re-renders, and how do you keep it fast?

### How to Answer Clearly in 30 Seconds

"A component that calls `useContext` subscribes to the whole value of the closest provider above it. When that provider receives a new value under `Object.is`, React re-renders every component reading that context, even if the part it uses did not change. That is what propagation means: the change travels from the provider to all subscribers, passing through intermediate components without re-rendering them. To keep it fast, I first measure with a profiler, and then I apply four tools:
1. **Separate contexts**: values that change at different times, such as the theme and the current user, go into separate contexts.
2. **A stable value**: an object written in the provider is new on every render, so I wrap it in `useMemo`, and I wrap any function I write inside it in `useCallback`.
3. **`children` in the provider**: the provider takes the page as `children`, so its own state change does not re-render the whole page.
4. **Split in two**: when a component needs only part of a context, an outer component reads the context. It passes that part as a prop to an inner component wrapped in `memo`."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Does `memo` stop a component from re-rendering when a context it reads changes?"**
   No. `memo` compares only the props a component gets from its parent, and a context read inside the component is not a prop. React's docs say: "Even with `memo`, your component will re-render if its own state changes or if a context that it's using changes." To get the effect people expect, I split the component in two. The outer component reads the context, and the inner component, wrapped in `memo`, gets the part it needs as a prop.
2. **"I split my context in two, and every row still re-renders on a theme click. Why?"**
   Most often, the second context carries an object written inside the providing component, such as `value={{ currentUser, setCurrentUser }}`. Every render of the provider builds a new object, and `Object.is` compares objects by identity, so the rows re-render as they did before the split. Wrapping the object in `useMemo` with `[currentUser]` fixes it. Another fix is to keep the value and the function that changes it in two separate contexts, as React's docs do with `TasksContext` and `TasksDispatchContext`.
3. **"I wrapped the context value in `useMemo`, and nothing changed. What went wrong?"**
   The providing component probably writes the rest of the page in its own code. Then a state change in it re-renders every component it writes, as its children, whatever the context does. A stable value pays off only when intermediate components are skipped, either by passing them as `children` or by wrapping them in `memo`. And in a small app, none of this is a problem. React's docs say so, and `<Profiler>` shows whether it matters in your app (Lesson 54).

```tree caption="Interview summary: what a context change re-renders, and the four ways to keep it fast."
Keeping context fast when its value changes
- !One context for every value | A theme click gives **every component that reads it** a new value | **Every component** that reads it re-renders
- +Separate contexts | Values that change at different times **live apart** | A theme click re-renders **only the components that read the theme**
- +`useMemo` on an object value | The provider gets **the same object** | Readers re-render **only when the user changes**
- +Split in two with `memo` | The outer component reads the context and passes **a prop** | `memo` skips the inner component when **the prop is the same**
```
