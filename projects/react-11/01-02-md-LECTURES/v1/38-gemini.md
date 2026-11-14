# Lecture 38: Calling Hooks Only at the Top Level of React Functions

*(Why does a form crash when one useState moves inside an if?)*

> INTERVIEW QUESTION | ❱ CORE | Why must hooks be called at the top level, and only from React functions?

---

## VS | `useState` at the top vs. `useState` inside `else`: both work while the user types, only the top one survives Send

> User interfaces often render elements conditionally, such as an alert banner or an account menu. You might feel tempted to place `useState` inside an `if` block. **You must call every Hook at the top level of the component, never inside an `if` statement or a loop**. React matches Hook state strictly by call order, and a condition changes that order between renders.

In React applications, components frequently render content based on runtime conditions. A store page might show a sale notification, or a header might display user details after sign in. In standard JavaScript, developers create temporary variables inside an `if` block when those values are needed only conditionally. In React, wrapping `useState` inside an `if` statement breaks component execution. Hooks cannot run conditionally. Every Hook call must execute unconditionally at the top level of your component function.

Consider an e-commerce page that displays a shopping cart only after a user logs in. If you place `useState` for the cart inside a conditional check, guest users see the page render without errors. Once the user clicks log in, that condition evaluates to true, and React executes the cart Hook for the first time. The entire page crashes immediately. Placing a condition around a Hook alters the total number of Hooks called from one render to the next.

**Why this fails:** React does not track state variables by their local names. Instead, React maintains an internal ordered list of state cells for each component. React matches each Hook call to its stored data by its position in that sequence. If a condition or early return skips a Hook on a later render, the call sequence desynchronizes from the stored list, causing React to crash.

### How JavaScript Finds a Variable

To understand why call order matters, compare how JavaScript resolves variables with how React resolves Hooks.

In standard JavaScript, the engine tracks variables by their lexical identifier. You can declare a variable inside an `if` block, and the JavaScript runtime resolves it by name within that scope:

```js title="A variable inside an if, in plain JavaScript"
if (isReady) {
  let ~message~ = ''; // JavaScript finds message by its name
}
```

A Hook works differently. Calling `useState` is a function call rather than a variable declaration. The function call sends React an initial value, but it passes no variable name:

```jsx title="Two useState calls, one after the other"
const [isSent, setIsSent] = ~useState(false)~; // React receives false, and no name
const [message, setMessage] = ~useState('')~; // React receives an empty string, and no name
```

Your code sees the variable names `isSent` and `message`. React sees neither identifier. Those names exist only in your local function scope. React receives only the initial boolean value, followed by an empty string.

How does React know which stored value belongs to which call? React relies on the exact invocation order. For every component instance, React maintains an internal array of state cells. During every render cycle, the first Hook call receives the first cell, and the second Hook call receives the second cell (Lesson 12).

The official React documentation describes this mechanism directly. Internally, React holds an array of state pairs for every component. This design relies on a stable call order on every render of the same component.

This design reveals the risk of conditional Hook execution. If you place the second `useState` call inside an `if` block, one render might run two Hook calls while the next render runs only one. The call count no longer matches the stored array, causing React to halt with a fatal error.

React summarizes this requirement in one rule: always use Hooks at the top level of your React function, before any early returns.

> [!DEFINITION]
> **What is an early return?** [REVIEW] An early return exits a function before reaching its final statement.
> 1. In standard JavaScript, `if (!user) return;` stops function execution immediately and skips all remaining lines.
> 2. In a React component, an early return typically renders a fallback or alternate view: `if (isSent) return <h1>Thank you!</h1>;`.
> 3. Any Hook placed below an early return statement is skipped whenever that branch executes.
>
> When an early return runs, React stops evaluating the component body on that line. If a Hook sits below that return, React misses that Hook call for that render cycle, desynchronizing the internal call order (Lesson 10).

> [!DEFINITION]
> **What is the top level?** [NEW] The top level refers to the direct root scope of a component function body that runs unconditionally on every render.
> 1. It sits outside all control flow statements, including `if` conditions, loops, and `switch` blocks.
> 2. It sits outside all nested functions, including event handlers, timeout callbacks, and closure utilities.
> 3. It sits strictly above any early `return` statement so execution always reaches it.
>
> Hooks operate like module imports at the top of a file. An `import` statement always runs unconditionally at module evaluation. A Hook must execute in that same unconditional manner on every render pass so React maintains a stable call sequence (Lesson 38).

> [!DEFINITION]
> **What are the Rules of Hooks?** [NEW] The Rules of Hooks are two mandatory conventions required by React to guarantee that state maps accurately to every Hook call across renders.
> 1. **Only call Hooks at the top level.** Never call Hooks inside conditions, loops, nested functions, or after early returns.
> 2. **Only call Hooks from React functions.** Call Hooks exclusively from React function components or custom Hooks, never from event handlers, class components, or regular functions.
>
> The official lint rule `rules-of-hooks`, part of `eslint-plugin-react-hooks`, inspects your component syntax and flags any violations before code runs (Lesson 38).

### Two places for the same `useState`

Compare placing the `useState` call for `message` in two locations:
1. **At the top of the component**, placed above any condition.
2. **Inside the conditional branch**, nested directly next to the form markup.

Both versions show an empty message field when the page opens. Both versions let the user type input. Although they look identical on initial render, their internal execution models differ completely.

Only the version with the Hook at the top level displays `Thank you!` after Send. The version with the Hook inside the branch crashes with the error described in the React documentation: Rendered fewer hooks than expected.

```tree caption="Two places for the useState of message: both work while the user types, and only one survives the click on Send."
Where the `useState` for `message` sits
- +At the top of the component, above the `if` | The field opens empty and **typing works** | After Send, the page shows **`Thank you!`**
- !Inside the form's branch, next to the form | The field opens empty and **typing works** | After Send, React stops with **Rendered fewer hooks than expected**
```

### What is at stake

When a user submits feedback, the page should display a confirmation screen. Instead, the entire page unmounts and leaves a blank screen, discarding the user's input.

The React documentation explains why the screen blanks: by default, if your application throws an error during rendering, React will remove its UI from the screen.

This defect hides easily during testing. The page opens without an error, and typing updates local state normally. A developer who only types in the field never encounters the crash. The first user who clicks Send triggers the failure.

### The Rule of Thumb: Hooks first, then the `if`

**Write every Hook at the top of the component, before the first `if` and the first `return`. The condition decides what the component shows, never whether a Hook runs.**

A senior developer avoids four classic mistakes:
1. **Assuming React identifies state by variable names.** React identifies state strictly by invocation order.
2. **Moving a Hook next to the code that uses it, inside a branch.** The render that skips the branch skips the Hook too.
3. **Silencing the linter when it marks that line.** Suppressing the warning allows a fatal bug to ship.
4. **Calling a Hook inside an event handler.** Invoking a Hook inside a click handler throws an immediate runtime exception.

The rest of the lesson shows each failure mode on a real feedback form.

## SECTION | A Feedback Form with a Send Button

Many applications conclude with a simple feedback interface containing a multiline `<textarea>` and a submit button. When the page opens, the field is empty, and its grey placeholder text says Message:

```page width=text caption="The feedback form when the page opens: an empty message field and a Send button."
form:
  textarea:  |
  submit: Send
console: quiet
```

The user performs two actions on this form and expects two results:
1. **The user types `Great app` in the message field.** The letters appear.
2. **The user clicks `Send`.** The form disappears, and the heading `Thank you!` takes its place.

```page width=text caption="The same page after the user clicks Send: the form is gone, and the thank-you heading takes its place."
heading: Thank you!
console: quiet
```

Now examine this interface from an architectural perspective. The component switches between two screens using conditional branching. The text typed by the user lives in `message`, and only the form view references it.

Where does the `useState` call for `message` belong? At the top level of the component, every time.

The project structure organizes this interface across four files:

```files title="feedback-form: File Explorer" caption="How the files of the feedback form sit inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Exports `App` as default and imports `FeedbackForm` from `./FeedbackForm.jsx`
  FeedbackForm.jsx | state | Holds `isSent` and `message`, and shows the form or the thank-you heading
```

The App component places the form on the page:

```jsx title="src/App.jsx"
import FeedbackForm from './FeedbackForm.jsx';

export default function App() {
  return ~<FeedbackForm />~; // React calls FeedbackForm to draw the form
}
```

Here is the working form. Both Hooks sit at the top level, and the early `return` comes after them:

```jsx title="src/FeedbackForm.jsx" good="4,5"
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = ~useState(false)~; // 1st Hook call, on every render
  const [message, setMessage] = ~useState('')~; // 2nd Hook call, on every render

  if (isSent) {
    return <h1>Thank you!</h1>; // The early return comes after both Hooks
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsSent(true);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button type="submit">Send</button>
    </form>
  );
}
```

Count the Hook calls on each render: exactly two, every time. On the first render, React stores the two initial values. On every later render, React returns what it stored, in the exact order of the calls:

| What the user did | 1st Hook call returns | 2nd Hook call returns | What the page shows |
| :--- | :--- | :--- | :--- |
| Opened the page | `isSent` is `false` | `message` is `''` | The empty message field and `Send` |
| Typed `Great app` | `isSent` is `false` | `message` is `'Great app'` | The message field with `Great app` |
| Clicked `Send` | `isSent` is `true` | `message` is `'Great app'` | `Thank you!` |

Now let us examine how breaking this call order causes runtime failures across five core principles:

**PRINCIPLES:** React tracks Hooks by invocation order rather than variable identifiers. This constraint establishes five core principles:
1. **Principle 1: React Matches Every Hook by Its Place in the Order.** React never inspects variable names like `isSent` or `message`. React matches calls sequentially, and this ordering applies to all React Hooks.
2. **Principle 2: A Hook in a Branch Crashes the Render That Skips It.** Placing a Hook inside a conditional branch causes the thank-you render to skip that Hook, crashing the component with a blank screen.
3. **Principle 3: Every Hook Goes Above the First Return.** Place every Hook at the component root so conditional statements control only what JSX is returned.
4. **Principle 4: The Condition Moves, Not the Hook.** Move conditional logic inside the Hook callback, into its initial argument, or into a dedicated child component.
5. **Principle 5: Hooks Run Only While React Renders.** Hooks must execute exclusively inside function components or custom Hooks during rendering, never inside event handlers or plain functions.

---

## PRINCIPLE | useState and every other Hook: React finds the stored value by the call's place, not by the variable's name

> [!PRINCIPLE]
> **Principle 1: Call Order: React Matches Every Hook by Its Place in the Order**
>
> *React tracks every Hook in a component, of any kind, by its place in the order of Hook calls, so every render must call the same Hooks in the same order.*
>
> React never receives the names isSent or message. It receives a first Hook call and a second Hook call, and it hands each one the data stored at that place. This works only while every render makes the same calls in the same order. That is why every Hook sits at the top level of the component.
>
> **DO THIS:**
> ```jsx
> function FeedbackForm() {
>   const [isSent, setIsSent] = ~useState(false)~; // 1st Hook on every render
>   const [message, setMessage] = ~useState('')~; // 2nd Hook on every render
>   if (isSent) {
>     return <h1>Thank you!</h1>;
>   }
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function FeedbackForm() {
>   const [isSent, setIsSent] = useState(false);
>   if (!isSent) {
>     const [message, setMessage] = ~useState('')~; // **WRONG:** the 2nd Hook runs only while isSent is false
>   }
> }
> ```

### Renaming a variable changes nothing for React

Suppose we rename `message` to `text`:

```jsx title="The same Hook call under two variable names"
const [~message~, setMessage] = useState(''); // The 2nd Hook call in FeedbackForm
const [~text~, setText] = useState(''); // Still the 2nd Hook call: React sees no difference
```

For React, this change produces the exact same result. Each line represents the second `useState` call in FeedbackForm. React matches the call to the second stored value in its list. The variable name exists solely in your local JavaScript scope.

### The order counts for every kind of Hook

This sequential indexing applies to all React Hooks, not just `useState`. React associates stored state and runtime metadata strictly by call index:
1. **`useEffect`**: React retrieves the dependencies from the prior render using the Effect call index.
2. **`useRef`**: React returns the identical ref container object based on its position in the call sequence.
3. **`useReducer`**: React locates the current state value and dispatch function by its index in the call list.

The `useContext` Hook is an instructive case. It maintains no local state cell because it reads directly from the nearest parent provider. React still tracks its position in the internal Hook sequence. Moving a `useContext` call conditionally triggers an error in the developer console.

As the official documentation states, each time your component renders, React expects the exact same hooks to be called in the exact same order.

When the order changes between renders, React returns data from one Hook to a different Hook call. The documentation notes that React loses track of which state corresponds to which hook call, leading to bugs like state mismatches.

Principle 2 shows the exact render where our form breaks this sequence.

---

## PRINCIPLE | useState inside else: the render that skips it crashes the whole page

> [!PRINCIPLE]
> **Principle 2: Hooks in Branches: A Hook in a Branch Crashes the Render That Skips It**
>
> *A Hook inside a condition, a loop, or below an early return runs on some renders and not on others, so the number of Hook calls changes and React stops with an error.*
>
> Where a value is used and where its Hook is called are two separate things. Only the form uses message, but the useState for message must also run on the thank-you render. When a render skips a Hook, React throws "Rendered fewer hooks than expected", and without an error boundary the whole page goes blank.
>
> **DO THIS:**
> ```jsx
> const [isSent, setIsSent] = useState(false);
> const [message, setMessage] = ~useState('')~; // Runs on the form render and on the thank-you render
> if (isSent) {
>   return <h1>Thank you!</h1>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const [isSent, setIsSent] = useState(false);
> if (isSent) {
>   return <h1>Thank you!</h1>;
> } else {
>   const [message, setMessage] = ~useState('')~; // **WRONG:** skipped after Send, so React stops and the page goes blank
> }
> ```

### The Hook moves next to the form that uses it

A developer might assume that because only the form reads the message text, moving `useState` into the `else` branch improves code locality.

The official React documentation features this exact form in an exercise titled Fix a crash. In that exercise, the state declaration for `message` sits inside the `else` branch:

```jsx title="src/FeedbackForm.jsx" bad="9"
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);

  if (isSent) {
    return <h1>Thank you!</h1>;
  } else {
    const [message, setMessage] = ~useState('')~; // **WRONG:** inside else, so it runs only while isSent is false
    return (
      <form onSubmit={e => {
        e.preventDefault();
        setIsSent(true);
      }}>
        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Send</button>
      </form>
    );
  }
}
```

The linter marks the highlighted line immediately. In the documentation exercise, the developer silenced the warning with an `eslint-disable-next-line` directive on the line above (Lesson 35). With the warning suppressed, the file compiles without visible errors.

### The user types, and nothing looks wrong

When the page opens, the message field is empty, and the console shows no errors. The user types `Great app`, and the letters appear:

```page width=text caption="The form with the Hook inside else, after the user types Great app: it looks exactly like the working form."
form:
  textarea:  | Great app
  submit: Send
console: quiet
```

Up to this point, every render of this version calls two Hooks. The first is `useState` for `isSent` at the top level. The second is `useState` for the message variable, inside the else branch. The crash triggers only when submission alters the execution path.

### Clicking Send blanks the page

With the Hook inside `else`, submitting the form removes the entire page from view. The thank-you render calls one Hook where the prior render called two, causing React to halt. Here is what happens, in order:
1. The page opens with `isSent` set to `false`. React calls the first `useState`, enters the else branch, and calls the second Hook. Total Hook count: two.
2. The user types `Great app`. Each keystroke calls `setMessage`, and each render repeats the same two Hook calls. Total Hook count: two.
3. The user clicks `Send`. The submit handler prevents browser navigation and updates `isSent` to `true`.
4. React calls FeedbackForm again to compute the updated view. The first Hook call returns `true`.
5. The `if` branch returns the thank-you heading immediately, so the Hook for `message` never runs. Total Hook count: one.
6. React expected two Hook calls and received only one. It aborts rendering and throws a runtime error.
7. Nothing above the form catches the error, so React removes the entire page from the screen.

A component that catches rendering errors and displays a fallback interface is called an **error boundary**. Our page has no error boundary.

```page width=text caption="The same page after the user clicks Send with the Hook inside else: nothing is left on the screen."
blank
console: Uncaught Error: Rendered fewer hooks than expected. This may be caused by an accidental early return statement.
  warn: An error occurred in the <FeedbackForm> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

The page now shows nothing at all. The user sees neither the form nor `Thank you!`, and the entered message is lost.

No line of our code throws this error directly. React throws it because the number of Hook calls changed between consecutive renders. React then prints a warning identifying the component and recommending an error boundary.

### The same crash in the other direction

Now suppose a Hook sits inside the `if` branch instead, running only after Send. In that case, the thank-you render calls more Hooks than the render before it. React halts execution with an error: Rendered more hooks than during the previous render (Lesson 12).

Just before that error, React logs a diagnostic warning: React has detected a change in the order of Hooks called by FeedbackForm. Under that warning, a table lists the Hook sequence from both renders.

Whether the count decreases or increases, the cause is identical: conditional logic decided whether a Hook ran.

### Every place where a Hook must not go

The React documentation lists every place where a Hook call is not supported:
1. Inside conditional expressions such as an `if` block, a ternary operator, or logical operators.
2. Inside a loop, such as `for` or `while`. The number of Hook calls would then fluctuate with item count.
3. After an early conditional `return` statement.
4. Inside an event handler function.
5. Inside a class component.
6. Inside a callback passed to Hooks like `useMemo` or `useEffect`.
7. Inside a `try` block, or its matching catch and finally blocks.

The documentation for the linter adds two more invalid contexts: inside an asynchronous function, and at the module root outside any component.

The lint rule that flags these mistakes is `rules-of-hooks`, from `eslint-plugin-react-hooks`. This rule is included in the standard `recommended` preset, so modern React projects enable it by default.

The linter marked our line inside `else`. The developer silenced it, and the bug shipped. The documentation hint for this exercise identifies where to look first: check if there are any comments disabling linter checks, because that is where bugs often hide.

---

## PRINCIPLE | useState above the first return: every render calls the same two Hooks

> [!PRINCIPLE]
> **Principle 3: Top Level: Call Every Hook Above the First Early Return**
>
> *Call every Hook at the top level of the component, above the first early return, and let the condition decide only what the component returns.*
>
> An early return stops the function, so every Hook written below it is skipped on that render. Move the Hook above the return, and every render calls the same Hooks. The component then creates every value on every render, and the if decides only which screen the user sees.
>
> **DO THIS:**
> ```jsx
> const [isSent, setIsSent] = useState(false);
> const [message, setMessage] = ~useState('')~; // Above the first return
> if (isSent) {
>   return <h1>Thank you!</h1>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const [isSent, setIsSent] = useState(false);
> if (isSent) {
>   return <h1>Thank you!</h1>;
> }
> const [message, setMessage] = ~useState('')~; // **WRONG:** below the first return, skipped after Send
> ```

### One line moves

Fixing the crash requires moving one line of code. Compare the `useState` call for `message` in its two positions:

```jsx title="useState for message inside else, below the if"
if (isSent) {
  return <h1>Thank you!</h1>;
} else {
  const [message, setMessage] = ~useState('')~; // **WRONG:** skipped on the thank-you render
}
```

```jsx title="useState for message above the if"
const [isSent, setIsSent] = useState(false);
const [message, setMessage] = ~useState('')~; // Runs on every render, before the first return
if (isSent) {
  return <h1>Thank you!</h1>;
}
```

While both snippets declare the same state, their runtime behavior differs fundamentally. With the Hook inside `else`, the thank-you render makes one Hook call. With the Hook above `if`, every render makes two Hook calls, keeping the call order stable.

The React documentation gives this exact fix for this exact form: Hooks can only be called at the top level of the component function. Here, the first `isSent` definition follows this rule, but the `message` definition is nested in a condition. Move it out of the condition to fix the issue.

The documentation adds: remember, Hooks must be called unconditionally and always in the same order.

### The `else` is no longer needed

Once both Hooks sit above the `if`, the `else` block around the form has no purpose left. The `if` branch already returns early. The lines below it run only when `isSent` evaluates to false. With or without `else`, the form behaves identically.

The React documentation suggests removing `else` to reduce nesting. It emphasizes that all calls to Hooks must happen before the first `return`.

### The thank-you screen still has a `message`

Developers sometimes wonder why the thank-you view needs `message` if it does not display it. Declaring state and rendering state are two separate responsibilities.

On the thank-you render, the second Hook call still executes, and React returns `'Great app'`. The thank-you screen simply ignores that variable when building its JSX.

### The fixed form

Here is the final FeedbackForm component. The `else` block is gone, and both Hooks sit at the top level:

```jsx title="src/FeedbackForm.jsx" good="4,5"
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = ~useState('')~; // Moved above the first return: two Hook calls on every render

  if (isSent) {
    return <h1>Thank you!</h1>;
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsSent(true);
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button type="submit">Send</button>
    </form>
  );
}
```

The user types `Great app` and clicks Send. This time the heading appears, and the console remains quiet:

```page width=text caption="The fixed form after the user clicks Send: both Hooks ran, and the thank-you heading appears."
heading: Thank you!
console: quiet
```

### The same mistake on a loading screen

Developers frequently encounter this issue when writing early returns for pending data, such as a loading placeholder. The React documentation highlights this case:

```jsx title="useState below a loading return"
if (!data) {
  return <Loading />;
}
const [processed, setProcessed] = ~useState(data)~; // **WRONG:** skipped while data is missing, then called once data arrives
```

While `data` is null, the component returns early and skips the Hook below it. When data arrives, the component continues execution and calls an extra Hook. If another Hook sits above the `if`, React halts with an error: Rendered more hooks than during the previous render.

When this `useState` call is the only Hook in the component, React does not throw an error immediately. The crash waits until someone adds another Hook above the condition.

The remedy is the same as in our feedback form: move the Hook above the early `return`.

---

## PRINCIPLE | if inside the Hook, not the Hook inside if: every render still calls the same Hooks

> [!PRINCIPLE]
> **Principle 4: Moving the Condition: The Hook Stays, the Condition Moves Inside It**
>
> *When a Hook seems to need a condition, keep the Hook at the top level and put the condition inside it, in its initial value, or in a new component that holds the Hook.*
>
> A condition may decide what a Hook does, never whether it runs. Inside an Effect, the if decides what the Effect does. In useState, a ternary picks the starting value. When state belongs to one branch only, a new component holds it, and the parent's if decides whether that component appears.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   ~if (isLoggedIn)~ { // The condition lives inside the Effect
>     fetchUserData();
>   }
> }, [isLoggedIn]);
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> ~if (isLoggedIn)~ { // **WRONG:** the condition decides whether useEffect is called at all
>   useEffect(() => {
>     fetchUserData();
>   }, []);
> }
> ```

Sometimes a component genuinely requires conditional logic alongside a Hook. An Effect might need to run only for signed-in users, or initial state might depend on user role.

The Hook still remains at the top level. **The condition moves instead.** The React documentation provides four ways to reposition conditional logic:
1. Place the condition inside the Effect callback.
2. Provide a conditional initial value to `useState`.
3. Extract a new component and move the state into it.
4. Read context with `use` instead of `useContext`.

### 1. The condition goes inside the Effect

Suppose you want to fetch account details only when a user is signed in. An intuitive mistake is wrapping `useEffect` in an `if` block:

```jsx title="useEffect inside if"
if (isLoggedIn) {
  ~useEffect~(() => { // **WRONG:** when the user signs in, the next render calls one more Hook
    fetchUserData();
  }, []);
}
```

The React documentation keeps the Effect at the top level and moves the `if` statement inside the callback:

```jsx title="if inside the Effect"
~useEffect~(() => { // Called on every render, so the number of Hook calls never changes
  if (isLoggedIn) {
    fetchUserData();
  }
}, ~[isLoggedIn]~); // The Effect runs again when isLoggedIn changes
```

These two implementations look similar, but their runtime behavior differs completely. In the first version, the `useEffect` call itself appears and disappears based on authentication status. In the second version, React executes one `useEffect` call on every render, and the condition decides only what the callback executes.

Because `isLoggedIn` is listed in the dependency array, the Effect re-runs whenever login status changes (Lesson 32).

### 2. The condition goes into the initial value

Suppose starting permissions depend on user account type. An anti-pattern is writing two `useState` calls across two branches:

```jsx title="Two useState calls in two branches"
if (userType === 'admin') {
  const [permissions, setPermissions] = ~useState(adminPerms)~; // **WRONG:** a Hook inside if
} else {
  const [permissions, setPermissions] = ~useState(userPerms)~; // **WRONG:** a Hook inside else
}
```

The React documentation replaces this branching with a single `useState` call and a **conditional initial value**. A ternary expression selects the initial value, while the Hook call remains at the top level:

```jsx title="One useState with a conditional initial value"
const [permissions, setPermissions] = useState(~userType === 'admin' ? adminPerms : userPerms~); // One Hook call: the condition picks only the starting value
```

Both versions aim to initialize `permissions` with the correct permissions array. In the branched version, each `useState` sits inside a condition, triggering linter errors. In the ternary version, one `useState` call executes unconditionally on every render pass.

Keep in mind that React evaluates an initial state argument only during the first render. The ternary expression evaluates once when the component initializes.

### 3. The state moves into a new component

Returning to our feedback form, only the input view references `message`. When state belongs exclusively to one conditional branch, the React documentation recommends a third approach: extract a new component and move the state into it.

The form markup moves into its own component, MessageForm, and `message` moves along with it:

```jsx title="src/MessageForm.jsx"
import { useState } from 'react';

export default function MessageForm({ onSend }) {
  const [message, setMessage] = ~useState('')~; // The top level of MessageForm: one Hook call on every render of MessageForm

  return (
    <form onSubmit={e => {
      e.preventDefault();
      ~onSend()~; // Tells FeedbackForm that the user clicked Send
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button type="submit">Send</button>
    </form>
  );
}
```

FeedbackForm retains only `isSent` and controls which screen to render. It passes a callback prop to MessageForm so the child can signal when submission completes (Lesson 23):

```jsx title="src/FeedbackForm.jsx"
import { useState } from 'react';
import MessageForm from './MessageForm.jsx';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false); // FeedbackForm's only Hook

  if (isSent) {
    return <h1>Thank you!</h1>;
  }

  return <MessageForm ~onSend={() => setIsSent(true)}~ />; // Calls setIsSent(true) when the user clicks Send
}
```

Now the condition determines whether MessageForm renders in the UI, not whether a Hook executes. Each component calls its Hook at its own top level, on every one of its own renders.

When the user submits feedback, the thank-you heading replaces MessageForm. React unmounts the child component and discards its internal state, including `message` (Lesson 25). The user experiences the same behavior as the refactored form from Principle 3.

Both designs are fully valid. The single-component approach from Principle 3 is shorter for simple forms. Extracting a child component is ideal when a conditional view requires multiple dedicated state variables.

### 4. Context goes through `use`

The final scenario involves reading context conditionally. The `useContext` API is a Hook, so it must remain at the top level. However, React provides the `use` API, which is permitted inside conditional blocks (Lesson 28):

```jsx title="useContext inside if, and use inside if"
if (isSent) {
  const theme = ~useContext(ThemeContext)~; // **WRONG:** useContext is a Hook inside if
}
if (isSent) {
  const theme = ~use(ThemeContext)~; // use may be called inside if
}
```

These two examples look similar, but their runtime behavior differs completely. Calling `useContext` inside an `if` block triggers a warning in the console: React has detected a change in the order of Hooks called by FeedbackForm. In contrast, calling `use` inside an `if` block runs cleanly.

The React documentation explains that while `useContext` must be called at the top level, the `use` API works inside conditions and loops. The documentation notes that despite its name, `use` is not a Hook.

Two limits apply to `use`. It cannot sit inside a `try` or `catch` block. It must also be called inside a component or a Hook.

---

## PRINCIPLE | useState in a component or a custom Hook only: an event handler runs outside any render

> [!PRINCIPLE]
> **Principle 5: React Functions Only: Call Hooks While React Renders a Component or a Custom Hook**
>
> *Call Hooks only while React renders a function component or a custom Hook, and never from an event handler, a regular JavaScript function, or a class component.*
>
> A Hook needs the component that React is rendering at that moment. An event handler runs later, when the user clicks, outside any render, so a Hook inside it throws. Keep every Hook at the top level of a component or a custom Hook, and let event handlers call only setters.
>
> **DO THIS:**
> ```jsx
> const [isSent, setIsSent] = useState(false);
> <form onSubmit={e => {
>   e.preventDefault();
>   ~setIsSent(true)~; // The handler calls only the setter
> }}>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <form onSubmit={e => {
>   e.preventDefault();
>   const [isSent, setIsSent] = ~useState(true)~; // **WRONG:** a Hook in an event handler throws when the user clicks Send
> }}>
> ```

### A component and a regular function look alike

The second Rule of Hooks defines which functions may call a Hook. Here are two JavaScript functions containing the same Hook call:

```jsx title="The same Hook call in a component and in a regular function"
function FeedbackForm() {
  const [isSent, setIsSent] = ~useState(false)~; // A function component: React calls it to render
}

function sendFeedback() {
  const [isSent, setIsSent] = ~useState(false)~; // **WRONG:** a regular function, not a component or a custom Hook
}
```

These functions look similar, but their execution environments differ completely. Only FeedbackForm represents a valid React function. The React documentation uses that term for two specific kinds of functions:
1. **A function component**, such as FeedbackForm, which React invokes to compute UI.
2. **A custom Hook**, a function whose name starts with `use` followed by a capital letter, such as `useOnlineStatus`. A custom Hook may call other Hooks, and a component invokes it at its own top level.

Every other function is a regular JavaScript function and must not call Hooks.

To understand why, consider what happens during rendering. When React calls FeedbackForm, React sets an internal dispatcher pointer to that component instance. React tracks Hook index zero, then index one.

A regular function runs whenever your code invokes it, completely outside React's render phase. During that execution, React is not rendering any component. A `useState` call has no active component to connect with and no state array to access.

The React documentation states this clearly: you can only call Hooks while React is rendering a function component.

### The Hook moves into the click

In our feedback form, a developer might attempt a shortcut by creating state dynamically upon submission. The developer places `useState` inside the submit handler instead of calling `setIsSent`:

```jsx title="src/FeedbackForm.jsx" startLine="11" bad="14"
  return (
    <form onSubmit={e => {
      e.preventDefault();
      const [isSent, setIsSent] = ~useState(true)~; // **WRONG:** a Hook inside an event handler, called when the user clicks Send
    }}>
```

The page opens without errors because the submit handler has not run yet. The error triggers only when the user clicks Send:
1. The page opens. The message field and Send button render because the submit handler has not executed.
2. The user types `Great app` and clicks `Send`.
3. The browser triggers the submit event and invokes the handler. No component is rendering at this moment.
4. The handler prevents browser reload and invokes `useState`. React immediately throws a runtime error.
5. Because the top-level state setter was never called, FeedbackForm does not re-render, and `Thank you!` never appears.

```page width=text caption="The form with a Hook inside onSubmit, after the user clicks Send: the form stays, and the thank-you heading never appears."
form:
  textarea:  | Great app | bad
  submit: Send
console: Uncaught Error: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons: 1. You might have mismatching versions of React and the renderer (such as React DOM) 2. You might be breaking the Rules of Hooks 3. You might have more than one copy of React in the same app See https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.
```

The variable declared inside the handler is local to that callback. It has no relationship with the state of FeedbackForm. The handler crashes before returning any value.

React's error message lists three possible causes. Our code triggers the second cause, breaking the Rules of Hooks. The other two causes involve build configurations: version mismatches between React and React DOM, or duplicate React packages in the bundle.

The solution is the pattern shown in Principle 3. Keep the Hook at the top level, and let the event handler call only the setter function with `true`.

### The `use` prefix shows where state may hide

This rule also establishes transparent architectural visibility across your codebase. The React documentation explains that by following this rule, you ensure that all stateful logic in a component is clearly visible from its source code.

Enforcing the `use` naming prefix makes stateful logic identifiable at a glance. React requires all custom Hook names to start with `use` followed by an uppercase character.

For example, reading a call to `getColor` inside your component guarantees that the function contains no React state because its name does not start with `use`.

The prefix represents a contract and belongs only on functions that call Hooks. Consider a function named `useSorted` that calls no Hook, compared to `getSorted` with the same body. The code executes identically.

The React documentation states: functions that do not call Hooks do not need to be Hooks. Name it `getSorted`, and you can call it anywhere, including inside `if` statements and loops.

---

## All 5 Principles Together

### The complete project

The entry file mounts App inside `<StrictMode>`:

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    ~<App />~ {/* 1. React calls App first */}
  </StrictMode>
);
```

The App component renders the form:

```jsx title="src/App.jsx"
import FeedbackForm from './FeedbackForm.jsx';

export default function App() {
  return ~<FeedbackForm />~; // 2. React calls FeedbackForm next
}
```

FeedbackForm calls both Hooks at its top level, and only then decides what to show:

```jsx title="src/FeedbackForm.jsx" good="4,5"
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = ~useState(false)~; // 3. Principles 1 and 3: the 1st Hook call, on every render
  const [message, setMessage] = ~useState('')~; // 4. Principles 2 and 3: the 2nd Hook call, above the first return

  if (~isSent~) { // 5. Principle 4: only now does the condition choose the screen
    return <h1>Thank you!</h1>;
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      ~setIsSent(true)~; // 6. Principle 5: the handler calls only the setter
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button type="submit">Send</button>
    </form>
  );
}
```

### The order React follows on every render

On every render, React follows the same execution path. It calls App, then FeedbackForm. Inside FeedbackForm, it encounters the two Hooks first, always in the same order, and only then reaches the `if` condition:

```tree dir=right caption="The order React follows on every render of the feedback form: the components, then the two Hooks, then the condition."
How React renders the feedback form
- +1. `App` [`<FeedbackForm />`] | React calls **`App`**, which returns the form's tag
- +2. `FeedbackForm` | React calls **`FeedbackForm`** on the first render and after every state change
- +3. 1st Hook [`isSent`] | **Always first**: React hands back the stored `isSent`
- +4. 2nd Hook [`message`] | **Always second**: React hands back the stored `message`
- +5. The `if` | Chooses **`Thank you!`** or **the form**; the number of Hook calls stays **two**
```

```page width=text caption="The finished page after the user types Great app and clicks Send."
heading: Thank you!
console: quiet
```

### Where the Hook call sits, and what the user sees

| Where the Hook call sits | What React sees | What the user sees |
| :--- | :--- | :--- |
| **At the top level, above the first `return`** | Two Hook calls on every render | `Thank you!` after Send |
| **Inside `else`, next to the form** | After Send, one Hook call where there were two | A blank page after Send |
| **Inside the `if` that runs after Send** | After Send, more Hook calls than the render before | A blank page after Send |
| **`useEffect` at the top, with the `if` inside the Effect** | One `useEffect` call on every render | The Effect does its work only when the condition is true |
| **At the top of a new component, `MessageForm`** | Each component makes the same calls on its own renders | `Thank you!` after Send |
| **Inside the submit handler** | A Hook call outside any render, when the user clicks Send | The form stays, and `Thank you!` never appears |

One last time, the guiding rule of this lesson: **React does not know your Hooks by their names. It knows them by their order. So every render must call the same Hooks, in the same order.**

---

## For the Interview

> **The Interview Question:** Why must hooks be called at the top level, and only from React functions?

### How to Answer Clearly in 30 Seconds

"React does not identify a Hook by its variable name, because no Hook call passes an identifier. Instead, React matches each call to its stored data by its position in the sequential order of Hook calls. Every render must call the exact same Hooks in the exact same order. Two fundamental rules protect that order:
1. **Only call Hooks at the top level**: never inside a condition, a loop, or a nested function, and never below an early `return`. If a feedback form calls `useState` for its message inside an `else` block, the thank-you render skips it. React throws Rendered fewer hooks than expected, and the page goes blank.
2. **Only call Hooks from React functions**: call them strictly inside function components or custom Hooks during rendering, never in event handlers or regular functions. React ties a Hook call to the component it is rendering at that moment, and the `use` prefix clarifies where stateful logic lives.

When logic is conditional, keep the Hook at the top level. Move the condition inside the callback, provide a conditional initial value, or extract a dedicated child component. The `rules-of-hooks` lint rule flags these mistakes, so I never silence it."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why does React use call order instead of names?"**
   Call order keeps Hook syntax concise. A call to `useState` requires no unique key or registration label. As the React documentation explains, Hooks rely on a stable call order on every render of the same component. This mechanism works reliably because top-level placement preserves call order, and linters catch accidental violations. The trade-off is the rule itself: a Hook cannot run conditionally between renders.
2. **"How do you run an Effect only when a condition is true?"**
   You invoke `useEffect` unconditionally on every render and place the `if` check inside the Effect callback. For example, the callback verifies `isLoggedIn` before fetching user records. You then add `isLoggedIn` to the dependency array so the Effect re-runs when authentication status changes. Wrapping `useEffect` itself in an `if` block changes the total Hook count when the user logs in.
3. **"Can anything like a Hook be called inside an `if`?"**
   Yes, the `use` API can be called inside conditions and loops, whereas `useContext` must remain at the top level. The React documentation notes that `use` is not a Hook despite its naming prefix. Two restrictions still apply: `use` cannot be called inside `try` and `catch` blocks, and it must execute within a component or Hook. Plain functions such as `getSorted` can also be called inside conditions because they are not Hooks.

```tree caption="Interview summary: where a Hook call may sit and where it may not."
Where a Hook call may sit
- +At the top level of a function component | **Before any early `return`**, outside every `if`, loop, and nested function | Same Hooks, **same order**, every render
- +At the top level of a custom Hook | A function named **`use` plus a capital letter** | Called by a component at **its own top level**
- !Inside a condition, a loop, or below an early `return` | The number of Hook calls **changes between renders** | React throws **Rendered fewer hooks than expected** or **Rendered more hooks than during the previous render**
- !Inside an event handler or a regular function | Runs **outside any render** | React throws **Invalid hook call**
```
