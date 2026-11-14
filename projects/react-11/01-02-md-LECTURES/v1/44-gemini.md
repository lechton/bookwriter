# Lecture 44: How a Like Shows Before the Server Confirms

*(How does the heart turn red before the server has saved the like?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do you show the value the reader expects before the server confirms?

---

## VS | The Real State `liked` vs. the Optimistic State `optimisticLiked`: both draw the heart, only the optimistic one turns red before the server answers

> Waiting on server confirmation makes web applications feel sluggish and unresponsive. **You should use `useOptimistic` to display the anticipated result immediately**. React renders the predicted state right away, replacing it with server truth when the background action completes.

In React web applications, many everyday interactions communicate with a remote server, such as liking a photo post, completing a task, or sending a chat message. Normally, components wait for server responses before updating state, keeping the screen frozen in its previous state. Users expect immediate visual confirmation when they tap a button. **The `useOptimistic` Hook presents the anticipated outcome immediately while the network request is still in flight. When the server response arrives, React automatically replaces the temporary preview with canonical server state, rolling back seamlessly if the request fails.**

Consider a photo post featuring a white heart button. When a user clicks the heart, saving that preference over a mobile network might require a full second. What should the heart show during that in-flight delay? It should turn red immediately to confirm the user's intent, even though the canonical database record has not updated yet.

**Why this matters:** If your component waits for the server response before updating, the button stays white for an entire second. Users often think the click failed and tap repeatedly. If you set permanent state before the server confirms, you must manually write complex rollback logic to revert the screen whenever a request fails. **Therefore, you need a transient state value that lives strictly during the background save**. The `useOptimistic` Hook provides this transient value. It holds the predicted state while the action runs and restores canonical state once the action settles.

### A Like on Instagram

Now let's explore why modern interfaces rely on this pattern.

Open a photo post in a social feed. Underneath the photo sit its title and an outline heart button:

```page caption="A photo post before the click: the title and a white heart button."
line: Sunset at the beach
form:
  submit: 🤍 Like
console: quiet
```

The user taps the heart, and the icon turns red immediately:

```page caption="The same post right after the click, while the server is still saving the like."
line: Sunset at the beach
form:
  submit: ❤️ Liked | | good
console: quiet
```

Behind the scenes, the browser transmits the mutation to the server, which requires roughly one full second to persist the record. The user never perceives that delay. From the user's perspective, the post is liked instantly.

Now inspect that exact interaction from an engineering standpoint. The server has not confirmed the operation, so your client code cannot guarantee that the write will succeed. Yet the button displays a red heart. The interface renders the outcome it hopes to achieve.

In legacy imperative JavaScript, developers accomplished this behavior by mutating the DOM element before sending the fetch request, then manually restoring the previous label on network failure:

```js title="page.js"
async function handleClick() {
  ~likeButton.textContent = '❤️ Liked'~; // 1. Change the button first, before the server answers
  const saved = await saveLike(true); // 2. Then wait one second for the server
  if (!saved) likeButton.textContent = '🤍 Like'; // 3. Change it back by hand if the save failed
}
```

In React, your code never manipulates DOM nodes directly. The interface is a declarative projection of state (Lesson 12). During that network pause, your component requires a state value representing the liked state, even while the server request remains in flight.

Why is managing this intermediate delay critical?
1. If the button waits for the network response, the heart remains white for a full second. Users assume the interaction failed and tap repeatedly, triggering duplicate network requests.
2. If you mutate standard state with `useState` before the server responds, a network drop leaves an unconfirmed like on screen. Your application must maintain fragile manual cleanup code to restore the previous state.

React provides a dedicated solution with `useOptimistic`. Before exploring its mechanics, consider two foundational tools from prior lessons:

> [!DEFINITION]
> **An Action.** [REVIEW] An Action is an asynchronous transition function triggered by form submissions or manual transitions.
> 1. You pass an Action to a form element through the `action` attribute: `<form action={submitAction}>`.
> 2. React wraps the execution of `submitAction` in a Transition, tracking its execution lifecycle from start to finish.
> 3. While the promise runs, React marks the Action as pending, enabling coordinated pending states and optimistic updates across child components (Lesson 41).

> [!DEFINITION]
> **useActionState.** [REVIEW] The `useActionState` Hook manages canonical state updated by an asynchronous Action.
> 1. Calling `useActionState(updateLike, false)` supplies the current state, an action dispatcher function, and a pending boolean flag.
> 2. Dispatching the action passes the previous state and the incoming payload to your asynchronous reducer function.
> 3. The canonical state updates only when the asynchronous action promise resolves, reflecting the confirmed server reality (Lesson 42).

Now examine the new tool:

```jsx title="The real state and the optimistic state of one heart button"
const [liked, likeAction] = useActionState(updateLike, false); // The real state: changes when the save ends
const [optimisticLiked, setOptimisticLiked] = ~useOptimistic(liked)~; // The optimistic state: equals liked until an Action sets it
```

> [!DEFINITION]
> **useOptimistic and the optimistic state.** [NEW] The `useOptimistic` Hook introduces a transient state value linked to an active Action Transition.
> 1. It is exported directly from `'react'`, alongside standard Hooks like `useState`.
> 2. It accepts the canonical base state, such as `liked`, and returns a tuple containing the optimistic value and a setter function.
> 3. When no Action is active, the optimistic state strictly mirrors the canonical base state passed into the Hook.
> 4. When your code invokes the setter inside an active Action, React renders the optimistic value immediately and preserves it until the Action completes.
>
> The term optimistic reflects the assumption that the network operation will succeed. The official React documentation explains that this state presents users with immediate feedback while an asynchronous Action executes, then reverts seamlessly once the background operation concludes (Lesson 44).

Therefore, the heart button relies on two distinct values:
- **The canonical state, `liked`,** represents data confirmed by the server. It updates only after the network request resolves.
- **The optimistic state, `optimisticLiked`,** represents the temporary visual preview. It displays the anticipated value while the server request is in flight.

Both values reside in React component memory, and the button can render from either source. Their behavior differs only during network transmission. Before the user taps and after the server responds, both values match. They diverge only during the in-flight server delay.

```tree caption="The real state and the optimistic state of one heart button: the same value, except during the wait."
Two values behind one heart button
- +The real state [`liked`] | Changes **only when the server answers** | Before the click and after the save, it decides what the heart shows
- +The optimistic state [`optimisticLiked`] | Holds the **hoped-for answer** while the save runs | During the wait, the heart shows **this value**
```

The official React documentation captures the core design in one sentence: "Optimistic state only renders while an Action is in progress, otherwise `value` is rendered." In this model, `value` refers to the canonical state passed into the Hook. Every architectural principle in this lesson follows directly from that contract.

### Three ways to show the result of a click

Software teams typically choose between three strategies when handling asynchronous mutations:
1. **Wait for server confirmation before rendering.** The component relies on `useActionState` alone (Lesson 42). It communicates progress by displaying a loading indicator via `isPending` or `useFormStatus` (Lesson 43). This strategy fits operations where outcomes cannot be presumed, such as financial checkouts or account registrations.
2. **Mutate standard state eagerly, then revert manually on failure.** The component uses `useState` to update the screen immediately, catching errors to reset state. As the official React documentation observes, manually managing pending states, sequential requests, and rollbacks introduces substantial boilerplate and subtle bugs.
3. **Render predicted results using `useOptimistic`.** This strategy fits common operations that succeed almost universally, such as toggling likes, following users, or posting chat messages. React presents the predicted value throughout the request, automatically falling back to canonical server state once the action finishes.

```tree caption="Three ways to show the result of a click that the server must save."
Three ways to show the result of a click
- +1. Wait for the server [`useActionState`] | Shows a **saving sign** during the wait | Fits when the result **cannot be guessed**, such as a payment
- !2. Show it first with `useState` | Your code **sets it back by hand** on every failure | Forget one failure, and the page **keeps a value the server never saved**
- +3. Show it first with `useOptimistic` | React shows the **hoped-for value** during the save | When the save ends, React shows the **real state** again by itself
```

This lesson focuses on mastering the third strategy.

### The Rule of Thumb: can the server say no?

**Before adding optimistic updates, ask a single question: will the operation succeed under normal conditions? If yes, provide instant feedback with `useOptimistic`. If the server could reject the input, wait for confirmation.**

Experienced engineers also safeguard against two common pitfalls:
1. **Invoking the setter inside a plain `onClick` handler.** The icon flashes briefly, snaps back to its initial state, and React logs a warning in the browser console.
2. **Attempting to reset optimistic state manually.** Developers must never write manual cleanup routines for optimistic state. React terminates transient updates automatically when the surrounding Action settles.

The remainder of this lesson explores each rule through a complete photo post component.

## SECTION | A Photo Post with One Heart Button

Our example application features a photo post with a title and a toggleable heart button. Later, Principle 5 adds a like counter displaying `12 likes`. Here is the project directory structure:

```files title="photo-post: File Explorer" caption="How the files of our photo post sit inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  App.jsx | parent | Renders the post: the title and `<LikeButton />`
  LikeButton.jsx | state | Keeps the like with `useActionState` and `useOptimistic`, and renders the heart button
  api.js | helper | Exports `saveLike`, a fake save that waits one second
```

The parent component renders the article container, the post title, and the heart button, which lives in its own file:

```jsx title="src/App.jsx"
import ~LikeButton~ from './LikeButton.jsx'; // The heart button and all its state live in this file

export default function App() {
  return (
    <article>
      <p>Sunset at the beach</p>
      <LikeButton />
    </article>
  );
}
```

The helper module models remote server persistence. It is provided as project scaffolding rather than lesson focus. It injects an artificial one-second delay so that you can observe in-flight transitions on screen:

```js title="src/api.js"
export async function saveLike(liked) {
  await new Promise(resolve => setTimeout(resolve, ~1000~)); // Waits one second, like a slow server
  return ~true~; // The server saved the like; Principle 4 changes this to false
}
```

**PRINCIPLES:** The `useOptimistic` Hook renders anticipated outcomes while background actions run, reverting to canonical state once they settle. Five core principles govern its use:
1. **Principle 1: The Button Reads the Optimistic State.** The form action sets the predicted value before dispatching the network request. A button reading canonical state remains stalled until the server responds.
2. **Principle 2: The Set Function Belongs in the Form's Action.** Calling the setter in an unmanaged event handler causes the preview to flash and revert, generating a console warning.
3. **Principle 3: Pass the Real State to useOptimistic.** When an Action finishes, optimistic state resets to whatever base value you provided. Passing a static literal resets confirmed state to false.
4. **Principle 4: A Failed Save Rolls Back by Itself.** When a server request fails, canonical state remains untouched, so the interface reverts automatically without manual rollback logic.
5. **Principle 5: One Reducer for Every Value the Click Changes.** When an interaction affects multiple related values, manage them through a single reducer so visual elements never fall out of sync.

---

## PRINCIPLE | useOptimistic: the button that reads the optimistic state turns red at once

> [!PRINCIPLE]
> **Principle 1: useOptimistic: The Button Reads the Optimistic State**
>
> *Call `useOptimistic(liked)`, call its set function first inside the form's action, and let the button read the optimistic state, so the heart turns red while the save is still running.*
>
> The server needs about one second to save the like. A button that reads the real state waits for that second, and the user thinks the click did not work. `useOptimistic` gives the component a second value for the wait. The form's action puts the hoped-for value into it at once, and the button shows that value until the save ends.
>
> **DO THIS:**
> ```jsx
> const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked);
>
> <button type="submit">{~optimisticLiked~ ? '❤️ Liked' : '🤍 Like'}</button> {/* Red as soon as the form's action calls the set function */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked);
>
> <button type="submit">{~liked~ ? '❤️ Liked' : '🤍 Like'}</button> {/* **WRONG:** the Hook runs, but the heart stays white until the server answers */}
> ```

Here is the essential implementation in its minimal form:

```jsx title="useOptimistic in its smallest code"
const [liked, likeAction] = useActionState(updateLike, false); // The real state
const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked); // The optimistic state

async function submitAction() {
  ~setOptimisticLiked(true)~; // 1. The heart turns red at once
  return likeAction(true); // 2. Then the save starts, and takes one second
}

<form action={submitAction}>
  <button type="submit">{~optimisticLiked~ ? '❤️ Liked' : '🤍 Like'}</button> {/* The button reads the optimistic state */}
</form>
```

Read the execution flow inside `submitAction` as two distinct steps:
1. **Render the anticipated outcome immediately.** Invoking `setOptimisticLiked(true)` instructs React to present `true` as the active optimistic value.
2. **Initiate canonical server persistence.** Calling `likeAction(true)` transmits the next state to the reducer. React then executes `updateLike` in the background.

The `submitAction` function is authored in your application code. Passing it to `<form action={submitAction}>` ensures React executes it inside a Transition, classifying it as an official Action (Lesson 41).

Prior to user interaction, no Action Transition is active. Under this initial condition, `optimisticLiked` mirrors the canonical `liked` state, and both evaluate to false. The official documentation refers to the argument passed to `useOptimistic` as `value`, defining it as the value returned when there are no pending Actions.

### VS | The button reads `liked` vs. the button reads `optimisticLiked`: only the second one is red during the save

```jsx title="The heart button that reads liked, and the heart button that reads optimisticLiked"
<button type="submit">{~liked~ ? '❤️ Liked' : '🤍 Like'}</button> {/* White for one second after the click, then red */}
<button type="submit">{~optimisticLiked~ ? '❤️ Liked' : '🤍 Like'}</button> {/* Red at once */}
```

These two implementations look similar in syntax, but their runtime behavior differs fundamentally. Before the click, both values evaluate to `false`, causing both buttons to render an outline heart. During the one-second network delay, their values diverge:
- **`liked` remains `false`**, because the remote server has not yet acknowledged the mutation.
- **`optimisticLiked` already evaluates to true**, because the form action passed true to the setter.

::: row caption="During the one-second save, the button that reads liked still shows the white heart; the button that reads optimisticLiked already shows the red one."
::: col title="The button reads liked" tag="white for one second" tone=bad
```page size=mini
line: Sunset at the beach
form:
  submit: 🤍 Like | | bad
```
:::
::: col title="The button reads optimisticLiked" tag="red at once" tone=good
```page size=mini
line: Sunset at the beach
form:
  submit: ❤️ Liked | | good
```
:::
:::

Developers frequently introduce this bug during refactoring. They declare `useOptimistic` and invoke the setter inside the form action, but leave the button JSX bound to `liked`. As a result, the button stays white for an entire second, rendering the Hook ineffective. The remedy requires changing one variable name: bind the JSX directly to `optimisticLiked`.

### What React does during that one second

**The heart turns red before the network request begins, remaining red throughout the save.** Here is the precise sequence of operations executed by React:
1. The user clicks the white heart. React invokes `submitAction` within an automatic Transition context because it serves as the form's action handler.
2. The optimistic setter executes first. React schedules an immediate render pass with `true`, displaying `❤️ Liked` on screen.
3. The action dispatcher begins executing the save operation. The `updateLike` function begins its asynchronous pause while awaiting the server.
4. Throughout this in-flight delay, canonical state remains `false`. React continues rendering the optimistic override `true`, keeping the icon red.

The official documentation describes this exact rendering schedule: "When `setOptimistic('b')` is called, React immediately renders with `'b'`." Furthermore: "If you await in the Action, React continues showing `'b'`."

### The heart button of our page

Here is the complete implementation of the LikeButton component. The `updateLike` reducer awaits network persistence and returns the confirmed boolean value, which becomes the new canonical state `liked`. Its initial parameter represents the previous state value. While this initial version does not inspect it yet, Principle 4 relies on it for rollbacks.

```jsx title="src/LikeButton.jsx"
import { useActionState, ~useOptimistic~ } from 'react'; // useOptimistic comes from react, like useState
import { saveLike } from './api.js';

async function updateLike(wasLiked, nextLiked) {
  await saveLike(nextLiked);
  return nextLiked;
}

export default function LikeButton() {
  const [liked, likeAction] = useActionState(updateLike, false);
  const [optimisticLiked, setOptimisticLiked] = ~useOptimistic(liked)~; // Equals liked whenever no Action is pending

  async function submitAction() {
    const nextLiked = ~!optimisticLiked~; // A click on the red heart sends false and unlikes the post
    setOptimisticLiked(nextLiked);
    return likeAction(nextLiked);
  }

  return (
    <form action={submitAction}>
      <button type="submit">{optimisticLiked ? '❤️ Liked' : '🤍 Like'}</button>
    </form>
  );
}
```

Notice that `nextLiked` inverts `optimisticLiked`, matching the visual state currently displayed to the user. Consequently, the same button handles both liking and unliking the post. Clicking an outline heart sends `true`, while clicking a red heart sends `false`. This structure exemplifies the standard pattern recommended by React: set the anticipated value first, then initiate background persistence.

```tree dir=right caption="What the heart shows before the click, during the one-second save, and after the save."
One click by the user on the white heart
- +Before the click | `liked` is **false**; `optimisticLiked` equals it | The heart is **white**
- +During the save | `liked` is still **false**; `optimisticLiked` is **true** | The heart is **red at once**
- +After the save | `liked` is **true**; `optimisticLiked` equals it again | The heart **stays red**
```

Always remember: the `useOptimistic` Hook provides the anticipated value during network latency, but only when your component JSX binds to that optimistic state.

---

## PRINCIPLE | The set function in the form's action: the red heart lasts for the whole save

> [!PRINCIPLE]
> **Principle 2: Inside an Action: Call the Set Function in the Form's Action**
>
> *Call the set function of `useOptimistic` inside an Action, such as the function passed to the form's `action`, never in a plain `onClick` handler.*
>
> The optimistic state lasts only as long as an Action. The form's `action` is an Action prop: React calls your function inside a Transition, and that Transition holds the red heart until the save ends. A plain `onClick` handler has no Transition around it. The red heart shows for a moment, the white heart comes back, and React logs an error in the Console.
>
> **DO THIS:**
> ```jsx
> async function submitAction() {
>   ~setOptimisticLiked(true)~; // Inside the form's action: the red heart stays until the save ends
>   return likeAction(true);
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <button type="submit" ~onClick~={() => setOptimisticLiked(true)}>🤍 Like</button> {/* **WRONG:** outside any Action, the heart flashes and React logs an error */}
> ```

Because you want the button icon to change on click, placing the setter inside `onClick` might seem intuitive. Consider the setter invocation in both locations:

```jsx title="setOptimisticLiked in onClick, and in the form's action"
<button type="submit" ~onClick~={() => setOptimisticLiked(true)}>🤍 Like</button> {/* A plain event handler, outside any Action */}

async function ~submitAction~() { // The form's action: React calls it inside a Transition
  setOptimisticLiked(true);
  return likeAction(true);
}
```

Both functions execute when the user activates the button. Their single critical difference lies in how React invokes them:
- **The form action** executes inside an automatic Transition context, making it an official Action.
- **The `onClick` handler** executes as an unmanaged discrete event, completely outside any Transition boundary.

Optimistic state requires an active Action Transition to sustain its lifecycle. Inside a plain event handler, no Transition exists to hold the predicted value, causing the visual update to vanish almost immediately.

### What the user sees with the set function in `onClick`

Here is an incorrect implementation of the LikeButton component. The click handler invokes the optimistic setter, while the form action merely initiates the network request:

```jsx title="src/LikeButton.jsx" startLine="13"
  async function submitAction() {
    return likeAction(!liked);
  }

  return (
    <form action={submitAction}>
      <button
        type="submit"
        ~onClick~={() => setOptimisticLiked(!optimisticLiked)} // **WRONG:** runs outside any Action, so the red heart does not last
      >
        {optimisticLiked ? '❤️ Liked' : '🤍 Like'}
      </button>
    </form>
  );
```

**The red heart appears for a split second, reverts immediately to white, and only turns red permanently after the save completes.** Here is what occurs when the user clicks the button:
1. The click listener fires first as a discrete event. The optimistic setter triggers an immediate render, displaying `❤️ Liked` momentarily while logging a warning to the console.
2. React reverts the button to an outline heart almost immediately. Because no Transition anchors the optimistic update, the Hook falls back to `liked`, which remains `false`.
3. The form action executes and initiates the remote save. After one second, canonical state updates to `true`, and the icon finally turns red permanently.

The official documentation explains why this immediate reversion occurs. "When you call the setter outside an Action, the optimistic state will briefly appear and then immediately revert back to the original value." The documentation notes that this happens because no Transition exists to hold the optimistic state while the Action runs.

```page width=full caption="The post during the one-second save, with the set function in onClick: the white heart is back, and the Console shows the error from React."
line: Sunset at the beach
form:
  submit: 🤍 Like | | bad
console: An optimistic state update occurred outside a transition or action. To fix, move the update to an action, or wrap with startTransition.
```

The console diagnostic identifies the exact remedy: move the update into an action. In our application, that Action is `submitAction`. Moving the setter invocation back into `submitAction` restores the proper behavior: the icon turns red immediately and remains red throughout the save.

### Why the form's action needs no `startTransition`

The console diagnostic mentions an alternative solution, `startTransition`, which later lessons cover in depth. Our form component does not require manual transitions.

React classifies attributes like `<form action={...}>` as Action props. Whenever an event triggers an Action prop, React automatically wraps its callback execution inside `startTransition`. In the words of the React documentation: "When using Action props, you can call the set function without `startTransition`." This design ensures that form action handlers naturally maintain optimistic state.

Consequently, optimistic setters belong directly inside the function passed to the form action. By React naming convention, such functions end with the suffix Action, as in `submitAction`.

```tree caption="The same set function call in onClick and in the form's action: only the form's action is inside an Action."
Where `setOptimisticLiked` runs on the click
- !In `onClick` [`onClick`] | A **plain event handler**, outside any Action | The red heart **flashes**, the white heart comes back, and the Console logs an **error**
- +In the form's action [`submitAction`] | React calls it **inside a Transition** | The red heart **stays** for the whole save
```

Remember: optimistic state persists strictly while an Action is in flight. Because the duration of the save corresponds to the execution of the Action, the optimistic setter must reside inside that Action.

---

## PRINCIPLE | `useOptimistic(liked)`: after the save, the heart shows what the server saved

> [!PRINCIPLE]
> **Principle 3: The Real State: Pass liked, and Let React End the Optimistic State**
>
> *Pass the real state to `useOptimistic`, and never clear the optimistic state by hand: when the Action ends, the optimistic state equals that value again.*
>
> The optimistic state is temporary. No line of your code turns it off. React ends it when the Action ends, in the same render that shows the saved value. So what the user sees after the save is the value you passed to `useOptimistic`. A fixed `false` turns the heart white again after a like the server saved.
>
> **DO THIS:**
> ```jsx
> const [optimisticLiked, setOptimisticLiked] = useOptimistic(~liked~); // After the save, the heart shows what the server saved
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const [optimisticLiked, setOptimisticLiked] = useOptimistic(~false~); // **WRONG:** after a saved like, the heart turns white again
> ```

Review the LikeButton component from Principle 1. The `submitAction` function invokes the optimistic setter once at the start. No line of code clears or resets that value once the network request finishes. Yet after the save resolves, the heart remains red. Why does this happen?

The icon stays red because of the base state argument passed to `useOptimistic`, not because of the setter. The React documentation emphasizes that optimistic state is inherently temporary. When the active Action Transition settles, the optimistic state automatically resets to mirror the canonical value passed into the Hook. In our component, that argument is `liked`.

**The optimistic state concludes automatically when the Action settles, leaving canonical state in control of the screen.** Here is what occurs once the heart turns red:
1. After one second, the `updateLike` reducer returns `true`. The `useActionState` Hook commits this value as the new canonical state `liked`.
2. The Action Transition reaches completion.
3. React performs a single render commit where `liked` evaluates to `true`. The optimistic state evaluates to `true` as well, now derived from canonical state.
4. The button remains red. No intermediate visual flicker occurs between the transient preview and the confirmed server state.

Notice that React requires zero extra render cycles to tear down optimistic state. The transient preview and the canonical update reconcile in the exact same render frame when the Transition settles.

### VS | Passing `liked` vs. passing `false`: only the real state keeps a saved like red

Because the heart starts in an unliked state, passing a fixed boolean literal `false` might look harmless. Compare both declarations:

```jsx title="Passing the real state, and passing a fixed false"
const [optimisticLiked, setOptimisticLiked] = useOptimistic(~liked~); // After the save, it equals liked, which is true: the heart stays red
const [optimisticLiked, setOptimisticLiked] = useOptimistic(~false~); // After the save, it equals false again: the heart turns white
```

While both declarations compile without error, their post-save behavior differs completely. During the Action, both render the value dispatched to the setter, turning the icon red immediately. Once the save completes, only the first declaration remains red. As the React documentation states: "The `value` argument to `useOptimistic` determines what displays after the Action finishes."

::: row caption="One second after a like that the server saved: useOptimistic with liked keeps the red heart; useOptimistic with false turns it white again."
::: col title="useOptimistic with liked" tag="stays red" tone=good
```page size=mini
line: Sunset at the beach
form:
  submit: ❤️ Liked | | good
```
:::
::: col title="useOptimistic with false" tag="white again" tone=bad
```page size=mini
line: Sunset at the beach
form:
  submit: 🤍 Like | | bad
```
:::
:::

Here is how this bug manifests in production:
1. A developer writes `useOptimistic(false)` under the assumption that the initial state is always unliked.
2. The user taps the button, and the icon turns red immediately.
3. The server successfully persists the like mutation.
4. When the action finishes one second later, the optimistic override expires and resets to the hardcoded `false` value, turning the heart white.
5. The user assumes the interaction failed and taps the button again. Because optimistic state is now `false`, the click dispatches `true` a second time, submitting a redundant save request.

The correct approach always passes the dynamic canonical state: `useOptimistic(liked)`. Following every completed save, the interface accurately displays the state confirmed by the server.

Remember: when an asynchronous save completes, React falls back to the base value provided to the Hook. Therefore, that base argument must always represent the live canonical state.

---

## PRINCIPLE | Return `wasLiked` on failure: the heart turns white again with no undo code

> [!PRINCIPLE]
> **Principle 4: Roll Back: A Failed Save Leaves the Real State Unchanged**
>
> *When the save fails, return the previous state from the reducer action; when the Action ends, the page shows what it showed before the click, with no undo code.*
>
> A hand-made version with `useState` stores the red heart for real, so your code must turn it back on every failure, and a forgotten failure keeps a like that the server never saved. With `useOptimistic`, the red heart lasts only as long as the Action. On failure, `liked` stays as it was, and React shows it again when the Action ends.
>
> **DO THIS:**
> ```js
> async function updateLike(wasLiked, nextLiked) {
>   const saved = await saveLike(nextLiked);
>   return saved ? nextLiked : ~wasLiked~; // On failure, the heart goes back to what it was before the click
> }
> ```
>
> **DO NOT DO THIS:**
> ```js
> async function updateLike(wasLiked, nextLiked) {
>   await saveLike(nextLiked);
>   return ~nextLiked~; // **WRONG:** ignores the failure, so the heart stays red although the server saved nothing
> }
> ```

Up to this point, our mock server has always completed saves successfully. In real production systems, network requests occasionally fail. To observe failure handling, modify one line in the mock API helper. The mock function now returns `false`, indicating that the server could not persist the like:

```js title="src/api.js" bad="3"
export async function saveLike(liked) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return ~false~; // The server could not save the like
}
```

The `updateLike` reducer from Principle 1 ignored this return value. It unconditionally returned `nextLiked`, evaluating to `true`. Consequently, `liked` flipped to `true` despite the server rejection, leaving an erroneous red heart on screen after failure.

To fix this, the reducer must verify the server response. Upon failure, it returns `wasLiked`, representing the previous state passed by `useActionState` as its first argument (Lesson 42):

```js title="src/LikeButton.jsx" startLine="4"
async function updateLike(wasLiked, nextLiked) {
  const saved = await saveLike(nextLiked);
  return saved ? nextLiked : ~wasLiked~; // On failure, liked stays what it was before the click
}
```

In this architecture, expected rejections are returned as state rather than thrown as exceptions. This aligns with how known domain errors are modeled in `useActionState` (Lesson 42). Thrown exceptions bubble up to the nearest Error Boundary, which later lessons explore.

### What the user sees when the save fails

**When a save fails, the heart reverts to white automatically. No line of code needs to issue an explicit undo command.** Here is the step-by-step sequence following a user click:
1. The heart turns red immediately, matching the optimistic update in Principle 1.
2. After one second, the mock API function returns `false`.
3. The `updateLike` reducer returns `wasLiked`, which evaluates to false. As a result, canonical state remains false.
4. The Action Transition settles, prompting React to dismiss the optimistic override and render canonical state.
5. The button displays `🤍 Like` once again.

```page caption="The post during the one-second save that will fail: the heart is red."
line: Sunset at the beach
form:
  submit: ❤️ Liked
console: quiet
```

```page caption="The same post after the save fails: the heart is white again, as it was before the click."
line: Sunset at the beach
form:
  submit: 🤍 Like | | good
console: quiet
```

This transition mirrors the reconciliation described in Principle 3: the optimistic preview expires, and canonical state takes over. After a successful save, canonical state represents the new like. After a failure, canonical state preserves the original value. The React documentation terms this an automatic rollback.

### VS | The hand-made way `useState` vs. `useOptimistic`: both roll back, only one needs your undo code

Recall the imperative JavaScript pattern introduced at the beginning of the lesson. Prior to `useOptimistic`, developers implemented similar behavior in React using standard `useState`:

```jsx title="Showing the like first with useState, and setting it back by hand"
const [liked, setLiked] = useState(false);

async function handleLike() {
  setLiked(true);
  const saved = await saveLike(true);
  if (!saved) ~setLiked(false)~; // Your code turns the heart white again on failure
}
```

With `useOptimistic`, the form action setter presents the preview as usual. On failure, the reducer simply preserves the previous state:

```js title="Keeping the previous state on failure, with useOptimistic"
async function updateLike(wasLiked, nextLiked) {
  const saved = await saveLike(nextLiked);
  return saved ? nextLiked : ~wasLiked~; // Nothing to undo: liked simply stays as it was
}
```

When written flawlessly, both implementations produce identical visual results: the heart turns red immediately, then reverts to white upon failure. Their critical difference lies in operational responsibility. With `useState`, your application code must explicitly execute rollback logic. With `useOptimistic`, React orchestrates rollback automatically.

Manual rollback logic frequently breaks down in production edge cases:
1. A developer sets state eagerly with `setLiked(true)` and dispatches the network request.
2. The developer writes `setLiked(false)` to handle explicit server rejection responses.
3. The developer overlooks unhandled transport exceptions, such as sudden network disconnects. When `saveLike` throws, the rollback line never executes.
4. The heart remains frozen in a red state on the user's screen.
5. When the user later reloads the page, the server reports an unliked state, causing the heart to revert unexpectedly.

Under `useOptimistic`, the predicted state is never stored as canonical state. Because it exists only for the duration of the Action Transition, there is no permanent state to clean up.

```tree caption="Who turns the heart white again after a failed save: your code with useState, or React with useOptimistic."
Turning the heart white again after a failed save
- !Show it first with `useState` [`setLiked`] | Your code **sets it back by hand** | Forget one failure, and the heart **stays red** although the server saved nothing
- +Show it first with `useOptimistic` [`wasLiked`] | `liked` **does not change** on failure | When the Action ends, the heart shows **what it showed before the click**
```

For the remainder of this lesson, the mock API helper in `api.js` returns success once again, while `updateLike` retains its failure check.

---

## PRINCIPLE | A reducer in useOptimistic: the heart and the count change together

> [!PRINCIPLE]
> **Principle 5: One Reducer: Every Value the Click Changes Comes from the Optimistic State**
>
> *When one click changes several values on the page, pass a reducer as the second argument of `useOptimistic`, and read every one of those values from the optimistic state.*
>
> The heart and the count answer the same question: did the user like this post? If the heart reads the optimistic state and the count reads the real state, the page gives two different answers for one second. A reducer computes the heart and the count from one call to the set function, so both change in the same render.
>
> **DO THIS:**
> ```jsx
> <button type="submit">{optimisticPost.liked ? '❤️ Liked' : '🤍 Like'}</button>
> <p>{~optimisticPost.likes~} likes</p> {/* 13 likes at the same moment as the red heart */}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <button type="submit">{optimisticPost.liked ? '❤️ Liked' : '🤍 Like'}</button>
> <p>{~post.likes~} likes</p> {/* **WRONG:** 12 likes next to a red heart for one second */}
> ```

Real social feeds display a like counter beneath the button, such as `12 likes`. A single user tap now modifies two distinct visual properties simultaneously: the heart icon state and the total like count. To support this, our canonical state consolidates both fields into a single post object with `liked` and `likes` properties:

```jsx title="The post as one object in the real state"
const [post, likeAction] = useActionState(updateLike, ~{ liked: false, likes: 12 }~); // The heart and the count, in one object
```

To coordinate multi-field optimistic updates, `useOptimistic` accepts an optional second argument: a pure reducer function. As the official React documentation specifies: "The reducer function that specifies how the optimistic state gets updated. It must be pure, should take the current state and reducer action arguments, and should return the next optimistic state."

```jsx title="useOptimistic with a reducer"
const [optimisticPost, setOptimisticPost] = useOptimistic(
  post,
  ~(current, liked) => ({ liked, likes: current.likes + (liked ? 1 : -1) })~ // The current state and the new like in, the next state out
);
```

This optimistic reducer returns a fresh post object. Its `liked` property reflects the intended target state, while its `likes` count increments on like and decrements on unlike.

You have already encountered this functional pattern: a function taking current state and an incoming action to produce the next state (Lesson 27). Like all React reducers, it must remain pure without side effects (Lesson 14). Its distinctive quality is that its output displays strictly while the Action Transition runs.

Its two parameters originate from distinct sources:
- **`current` is provided by React.** It represents the active state, beginning as `post` when the Action starts.
- **`liked` is provided by your application code.** It represents the payload passed when calling `setOptimisticPost`. The documentation notes: "If you provided a `reducer` to `useOptimistic`, this value will be passed as the second argument to your reducer."

### VS | The count from `post` vs. the count from `optimisticPost`: only the second one agrees with the red heart

The heart button already binds to `optimisticPost.liked`. The like counter can bind either to canonical state or optimistic state:

```jsx title="The count line that reads post, and the count line that reads optimisticPost"
<p>{~post.likes~} likes</p> {/* 12 likes for one second, then 13 likes */}
<p>{~optimisticPost.likes~} likes</p> {/* 13 likes at once */}
```

Binding the counter to `post` introduces an obvious visual inconsistency. Before the tap, both elements reflect `12 likes`. During the one-second network delay, the heart turns red immediately. If the counter reads from `post`, it stays at 12 likes until the server responds. The user then sees an inconsistent interface where an active like does not increment the count.

::: row caption="During the one-second save: the count from post disagrees with the red heart; the count from optimisticPost agrees with it."
::: col title="The count reads post" tag="12 likes next to a red heart" tone=bad
```page size=mini
line: Sunset at the beach
form:
  submit: ❤️ Liked
line: 12 likes | bad
```
:::
::: col title="The count reads optimisticPost" tag="13 likes next to a red heart" tone=good
```page size=mini
line: Sunset at the beach
form:
  submit: ❤️ Liked
line: 13 likes | good
```
:::
:::

The official documentation establishes the architectural rule: "When an optimistic update affects multiple related values, use a reducer to update them together." Every visual property influenced by the interaction must derive from the same optimistic state record.

### What one click does to both values

**A single dispatch to the optimistic setter updates both the icon and the counter in the exact same render pass.** Here is what happens when the user clicks the outline heart:
1. Invoking `setOptimisticPost(true)` passes `true` as the payload to the optimistic reducer.
2. The reducer calculates and returns a new post object with `liked: true` and `likes: 13`.
3. React renders this updated state atomically, switching the heart to red and updating the counter to `13 likes` together.
4. Once the server confirms the mutation, canonical state matches the optimistic preview, producing zero visual disruption.

### The final heart button

Here is the complete implementation of the LikeButton component. The reducer is extracted into a named helper function, `applyLike`, allowing the `updateLike` action reducer to reuse the exact same calculation. The initial argument to `updateLike` is renamed `previousPost` because canonical state now models the complete post object:

```jsx title="src/LikeButton.jsx"
import { useActionState, useOptimistic } from 'react';
import { saveLike } from './api.js';

function ~applyLike~(current, liked) { // The reducer: one place that computes the heart and the count
  return { liked, likes: current.likes + (liked ? 1 : -1) };
}

async function updateLike(previousPost, nextLiked) {
  const saved = await saveLike(nextLiked);
  return saved ? ~applyLike(previousPost, nextLiked)~ : previousPost; // The saved post uses the same reducer
}

export default function LikeButton() {
  const [post, likeAction] = useActionState(updateLike, { liked: false, likes: 12 });
  const [optimisticPost, setOptimisticPost] = ~useOptimistic(post, applyLike)~; // The second argument is the reducer

  async function submitAction() {
    const nextLiked = !optimisticPost.liked;
    setOptimisticPost(nextLiked);
    return likeAction(nextLiked);
  }

  return (
    <form action={submitAction}>
      <button type="submit">{optimisticPost.liked ? '❤️ Liked' : '🤍 Like'}</button>
      <p>{~optimisticPost.likes~} likes</p> {/* Reads the optimistic state, like the heart */}
    </form>
  );
}
```

Because both the transient preview and the confirmed state derive from `applyLike`, their calculations remain perfectly aligned. In production systems, the server response often returns updated aggregate metrics, whereas our mock helper simply confirms success.

```page caption="The final page before the user clicks the heart."
line: Sunset at the beach
form:
  submit: 🤍 Like
line: 12 likes
console: quiet
```

```page caption="The final page during the save and after it: the heart and the count change together."
line: Sunset at the beach
form:
  submit: ❤️ Liked | | good
line: 13 likes | good
console: quiet
```

---

## All 5 Principles Together

### The complete files

The application entry point mounts the parent component inside StrictMode (Lesson 7):

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

The parent component renders the article container and mounts the heart button:

```jsx title="src/App.jsx"
import LikeButton from './LikeButton.jsx';

export default function App() {
  return (
    <article>
      <p>Sunset at the beach</p>
      <LikeButton />
    </article>
  );
}
```

The LikeButton component coordinates canonical persistence through `useActionState` and transient visual updates through `useOptimistic`:

```jsx title="src/LikeButton.jsx"
import { useActionState, useOptimistic } from 'react';
import { saveLike } from './api.js';

function ~applyLike~(current, liked) { // Principle 5: one reducer for the heart and the count
  return { liked, likes: current.likes + (liked ? 1 : -1) };
}

async function updateLike(previousPost, nextLiked) {
  const saved = await saveLike(nextLiked);
  return saved ? applyLike(previousPost, nextLiked) : ~previousPost~; // Principle 4: a failure leaves the real state unchanged
}

export default function LikeButton() {
  const [post, likeAction] = useActionState(updateLike, { liked: false, likes: 12 });
  const [optimisticPost, setOptimisticPost] = useOptimistic(~post~, applyLike); // Principle 3: the real state decides what stays

  async function ~submitAction~() { // Principle 2: the form's action is an Action
    const nextLiked = !optimisticPost.liked;
    setOptimisticPost(nextLiked);
    return likeAction(nextLiked);
  }

  return (
    <form action={submitAction}>
      <button type="submit">{~optimisticPost.liked~ ? '❤️ Liked' : '🤍 Like'}</button> {/* Principle 1: the button reads the optimistic state */}
      <p>{optimisticPost.likes} likes</p>
    </form>
  );
}
```

The API helper simulates asynchronous network persistence:

```js title="src/api.js"
export async function saveLike(liked) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
}
```

### How React calls the components, and what one click does

During initial mount, React renders `App`, which mounts `LikeButton`. When the user triggers submission, React invokes `submitAction`, which applies optimistic updates immediately before dispatching the background network request:

```tree caption="The order in which React calls the components when the page loads, and the functions that run after one click by the user."
`App` [1. Called first] | Renders `<article>` with the title and `<LikeButton />`
- +`LikeButton` [2. Called second] | Keeps `post` with `useActionState` and `optimisticPost` with `useOptimistic` | Renders the heart button and the count
  - +`submitAction` [3. Runs when the user clicks] | Calls `setOptimisticPost` first: **red heart and 13 likes at once** | Then calls `likeAction`
  - +`updateLike` [4. Runs during the save] | Waits **one second** for `saveLike` | Returns the saved post, or the **previous post** on failure
```

### The mistake, and what the user sees

| Principle | The mistake | What the user sees | The fix |
| :--- | :--- | :--- | :--- |
| **1. The button reads the optimistic state** | The button still reads `liked` | The heart stays white for one second | Render `optimisticLiked` |
| **2. Inside an Action** | The set function sits in `onClick` | The heart flashes, and the Console logs an error | Call the set function in the form's action |
| **3. The real state decides what stays** | `useOptimistic(false)` | The heart turns white after a saved like | Pass the real state, `liked` |
| **4. Roll back** | A hand-made `useState` forgets a failure | The heart stays red although nothing was saved | Return the previous state on failure |
| **5. One reducer** | The count reads `post` | `12 likes` next to a red heart | Read every changed value from the optimistic state |

To summarize the core model: **`useOptimistic` displays anticipated results during background actions. When the action settles, React automatically reconciles the interface with canonical server truth.**

---

## For the Interview

> **The Interview Question:** How do you show the value the reader expects before the server confirms?

### How to Answer Clearly in 30 Seconds

"I use the `useOptimistic` Hook. It accepts the canonical state managed by `useActionState` and returns a tuple containing the optimistic state and an optimistic setter function. Inside the form's action handler, I invoke the optimistic setter immediately with the anticipated value, updating the UI synchronously before dispatching the server request. Three core principles ensure correctness:
1. **Always invoke the setter within an active Action Transition**, such as a form action. Invoking it inside unmanaged event handlers causes the preview to flash and revert immediately.
2. **Never clear optimistic state manually.** React dismisses transient optimistic overrides automatically when the surrounding Action completes.
3. **Derive final presentation from canonical state.** If the server persists the update, canonical state reflects the new value. If the network request fails, canonical state remains unchanged, prompting React to roll back the interface automatically."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"When should you avoid optimistic updates?"**
   Optimistic updates should be avoided when operations carry significant failure probabilities or destructive side effects. Actions like liking a post, following an account, or sending a chat message succeed almost universally, making immediate visual feedback appropriate. In contrast, financial checkouts, ticket purchases, or account registrations can fail due to card declines, seat conflicts, or validation errors. Optimistically confirming those operations would mislead users. For such flows, keep the UI in a pending state using `isPending` or `useFormStatus` until the server confirms the transaction.
2. **"What happens if an Action throws an unhandled exception rather than returning a failure state?"**
   When an Action throws, its surrounding Transition still reaches completion. React terminates the optimistic override and reconciles the view against whatever canonical state was active when the Transition began. However, unhandled exceptions inside `useActionState` propagate to the closest Error Boundary, aborting any queued Actions. For this reason, anticipated domain failures, such as server validation rejections, should be caught and returned as state values, allowing reducers to return the previous state cleanly.
3. **"Why should you pass a reducer function to `useOptimistic` instead of passing next values directly?"**
   A reducer is necessary when a single user interaction modifies multiple interdependent state values simultaneously, such as toggling an icon and updating an aggregate counter. The reducer guarantees that both values update atomically in the same render pass. The React documentation notes an additional benefit: reducers are essential when base state might change while an Action is in flight. If the underlying base state updates during background execution, React re-runs the optimistic reducer against the latest base state, whereas static values passed to the setter remain rigid.

```tree caption="Interview comparison: three tools that show the user something while a save runs, and what each one shows."
What the page shows while a save runs
- +`isPending` from `useActionState` | Says that **an Action is running** | Fits a **saving sign** on a button
- +`pending` from `useFormStatus` | Says that **the form is submitting** | Fits a sign **inside the form's own components**
- +`useOptimistic` | Shows **the result itself**, before the server confirms | Fits a **like, a follow, or a chat message**
```
