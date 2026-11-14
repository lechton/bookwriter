# Lecture 43: How a Button Deep in a Form Reads the Form's Pending State

*(How does a Post button know that its form is sending a comment right now?)*

> INTERVIEW QUESTION | ❱❱ MORE | How does a field nested deep in a form read the form's pending state?

---

## VS | The owner of the form `isPending` vs. a button inside the form `useFormStatus`: the owner gets the flag from its own Hook, the button asks the form above it

> A submit button nested inside a form needs to know when submission is underway so it can display loading text and disable duplicate clicks. Passing pending flags down through intermediate components creates unnecessary prop drilling. **You should call `useFormStatus` directly inside the nested button component instead**. React DOM inspects the component tree, locates the nearest parent form element, and supplies its active submission status without requiring props.

In React applications, submit buttons are frequently encapsulated into reusable design components, such as a dedicated post, save, or payment button. Normally, deeply nested components receive data through props passed down from parent to child. While the component managing the form receives a pending flag from the action state Hook, the nested button does not call that Hook directly. **The `useFormStatus` Hook allows any component rendered inside a form to read its active submission state directly without props.**

Consider a photo comment form that renders a separate post button component. When a user submits a comment, the button should disable itself and display loading feedback until the server responds, preventing accidental duplicate posts. How does this isolated button component detect that its surrounding form is submitting? Instead of receiving props from its parent, the button calls `useFormStatus`, prompting React to inspect ancestor components until it finds the enclosing form.

**Why this matters:** Only the component that declares the form action possesses the initial pending flag. Reaching a deeply nested button through props requires threading that boolean through every intermediate layout component in between. Although the button renders physically inside the form on screen, component boundaries isolate it from the form state. The `useFormStatus` Hook bridges this gap by querying the enclosing form directly.

### How the Button Finds Its Form

Consider how DOM elements locate ancestor forms in standard JavaScript. A native button element can locate its parent form using the `closest` method. The browser traverses upward from the button through parent elements until it encounters a `<form>`. Your script then attaches a submit listener and disables the button manually:

```js title="Plain JavaScript: the button walks up to its form"
const form = ~button.closest('form')~; // Walks up from the button to the first <form> above it
form.addEventListener('submit', () => {
  button.disabled = true; // You turn it off, and later you must remember to turn it on again
});
```

The `useFormStatus` Hook executes a similar upward traversal inside the React component hierarchy. When your child component calls the Hook, React climbs upward through parent components until it locates the closest enclosing form. It then subscribes that component to the submission lifecycle of that form. React updates the status automatically, removing the need for manual event listeners or boolean state setters.

```jsx title="React: the button asks its form"
import { useFormStatus } from 'react-dom';

function PostButton() {
  const { ~pending~ } = useFormStatus(); // true while the closest <form> above is submitting
  return <button type="submit" disabled={pending}>Post</button>;
}
```

> [!DEFINITION]
> **What is isPending?** [REVIEW] The `isPending` flag is the third value returned by `useActionState`, tracking whether an asynchronous form action is actively executing.
> 1. React sets `isPending` to `true` the moment the user triggers submission.
> 2. It remains `true` while the asynchronous action promise executes.
> 3. React switches it back to `false` automatically after the action completes and updated state renders to the screen.
>
> Crucially, `isPending` belongs exclusively to the component that invokes `useActionState`. Deeply nested child components cannot access it unless parents pass it down through props (Lesson 42).

> [!DEFINITION]
> **What is useFormStatus?** [NEW] The `useFormStatus` Hook provides submission status for the nearest ancestor `<form>` element in the React component hierarchy.
> 1. It is exported from `'react-dom'` rather than `'react'` because HTML form elements are specific to web environments.
> 2. It accepts zero arguments and always inspects the closest parent `<form>` rendered above the calling component.
> 3. It returns a status object containing four properties: `pending`, `data`, `method`, and `action`.
>
> The `pending` property is a boolean that is `true` while the parent form action is actively executing, and `false` at all other times. React DOM manages this status internally, re-rendering subscriber components whenever submission state transitions occur (Lesson 43).

You already know one way for a deeply nested component to read state without prop drilling: React Context (Lesson 28). The `useFormStatus` Hook operates on the exact same principle. The only difference is who creates the provider:
- **With context**, your application code declares the provider component, and children consume the nearest provider above them.
- **With `useFormStatus`**, your application declares no custom provider. The `<form>` element acts as the provider, and children read the nearest form above them.

The official React documentation summarizes this model in one sentence: "`useFormStatus` reads the status of the parent `<form>` as if the form was a Context provider."

```tree caption="Context vs. useFormStatus: both let a deep component read a value from above, only the provider differs."
Two ways a deep component reads a value with no prop
- +Context [`useContext`] | **Our code** writes the provider | The component reads the **closest provider above it**
- +`useFormStatus` [`const { pending } = useFormStatus`] | **The `<form>` tag** plays the provider | The component reads the **closest form above it**
```

### The Rule of Thumb: which component needs the flag?

**The component that renders the form reads `isPending` from action state. Nested child components call `useFormStatus` to read `pending` directly.**

What is at stake? A submit button that fails to detect an active submission remains clickable. Users seeing no visual feedback often click again, posting duplicate data or dispatching repeated server requests.

Developers choose between three primary strategies to inform submit buttons about form submissions:
1. **Pass `isPending` down as a prop.** The form component receives this flag from action state and hands it to immediate children. This approach works well for buttons located directly beneath the form owner.
2. **Create a custom context.** Your application creates a context provider and distributes the flag manually (Lesson 28). This fits asynchronous operations that originate outside HTML form submissions.
3. **Call `useFormStatus` inside the button.** The button queries the nearest ancestor form automatically. This represents the cleanest solution for reusable design components at arbitrary nesting depths.

The official React blog explains why this Hook exists: "To make the common case easier, we've added a new hook `useFormStatus`." This lesson examines this third strategy.

```tree caption="Three ways to give a submit button the pending state of its form, and when each one fits."
Three ways to tell the button that the form is submitting
- +1. A prop from the owner [`isPending={isPending}`] | The owner **hands `isPending` down** | Fits a button **one level below** the owner
- +2. A context made by hand [`<PendingContext value={isPending}>`] | **Our code** writes the provider | Fits a status that is **not a form submission**
- +3. `useFormStatus` in the button [`const { pending } = useFormStatus`] | The button **asks the form above it** | Fits a button **at any depth** inside a form
```

A senior developer avoids four classic mistakes:
1. **Importing from `'react'`.** The Hook lives in `'react-dom'`, so importing from `'react'` causes an undefined export crash.
2. **Calling the Hook next to the `<form>` tag.** Calling it inside the component that renders the form tag leaves `pending` permanently `false` without raising errors.
3. **Threading a pending prop through intermediate layers.** Every component in between must forward the prop correctly. A single missing prop leaves the button stuck in its default state.
4. **Calling `data.get` without a null check.** Before submission starts, `data` is `null`, causing an unhandled type error that blanks the screen.

The following sections examine each pitfall within a complete photo comment component.

## SECTION | The Comments under a Photo

Our example interface displays user comments beneath a shared photo. One initial comment is already visible: `Great shot!`. Below the comment list sits an input field prompting `Add a comment...` alongside a Post button.

When the user enters `Nice photo!` and clicks Post, two visual phases unfold in sequence:
1. **During network execution**, the button disables itself and displays `Posting...`, blocking subsequent clicks while the request is in flight.
2. **When the server responds**, the new comment appears in the feed, uncontrolled input fields reset to empty, and the button restores its default label.

::: row caption="The comments when the page opens, during the one-second wait, and after the answer comes back."
::: col title="When the page opens" tag="pending is false"
```page size=mini
card: lines=Great shot! | input=Add a comment...
line: [Post]
```
:::
::: col title="During the wait" tag="pending is true" tone=good
```page size=mini
card: lines=Great shot! | typed=Nice photo!
line: [Posting...] | good
```
:::
::: col title="After the answer" tag="pending is false again" tone=good
```page size=mini
card: lines=Great shot!; Nice photo! | input=Add a comment...
line: [Post]
```
:::
:::

Every comment interface requires this interaction pattern. From an architectural perspective, the post button is a dedicated component named `PostButton`. It renders inside `CommentFooter`, which sits inside the main form. No application code passes props to inform the button about the pending request. Instead, the button queries the form directly.

This interface builds on three core concepts established in earlier lessons:
1. Form actions execute an asynchronous handler on submit. Upon successful completion without unhandled errors, React automatically resets uncontrolled fields (Lesson 41).
2. The `useActionState` Hook preserves submitted list data, supplies the form action wrapper, and returns an execution flag (Lesson 42).
3. Form data entries are retrieved by field name using `formData.get('comment')` (Lesson 40).

Here is the file structure for the application:

```files title="photo-comments: File Explorer" caption="How the files of our photo comments page sit inside src/."
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it into `#root`
  App.jsx | parent | Renders `<CommentSection />`
  CommentSection.jsx | form owner | Keeps the list with `useActionState` and renders the `<form>`
  CommentFooter.jsx | middle | The row under the field that holds `<PostButton />`
  PostButton.jsx | child | The Post button that calls `useFormStatus`
  api.js | helper | `saveComment` waits one second and returns the new comment
```

The api helper file simulates an asynchronous remote server. It introduces a one-second delay to make network latency visible on screen:

```js title="src/api.js"
let nextId = 1;

export async function saveComment(text) {
  await new Promise(resolve => setTimeout(resolve, ~1000~)); // Waits one second, like a slow server
  return { id: nextId++, text };
}
```

The CommentSection component owns both the comment list and the form element. It remains consistent across all principles, except where a section demonstrates a broken implementation:

```jsx title="src/CommentSection.jsx"
import { useActionState } from 'react';
import { saveComment } from './api.js';
import CommentFooter from './CommentFooter.jsx';

async function addComment(previousComments, formData) {
  const comment = await saveComment(formData.get('comment'));
  return [...previousComments, comment];
}

export default function CommentSection() {
  const [comments, postAction] = useActionState(addComment, [{ id: 0, text: 'Great shot!' }]);
  return (
    <section>
      <ul>
        {comments.map(comment => <li key={comment.id}>{comment.text}</li>)}
      </ul>
      ~<form action={postAction}>~ {/* Every component inside this form can ask it for its status */}
        <input name="comment" placeholder="Add a comment..." />
        <CommentFooter />
      </form>
    </section>
  );
}
```

The parent form renders `CommentFooter`, which subsequently renders `PostButton`. This structure establishes `CommentFooter` as an intermediate layout component between the form element and the button.

Four core principles govern how `useFormStatus` interacts with form trees:
1. **Principle 1: useFormStatus Gives the Post Button pending.** The button imports the Hook from `'react-dom'` and reads active submission status without props.
2. **Principle 2: pending Stays false Next to the form Tag.** In the component declaring the form tag, the Hook cannot see the form below it, leaving `pending` permanently `false`.
3. **Principle 3: The Components in the Middle Pass No pending Prop.** The button reads parent form state across arbitrary component boundaries, eliminating prop drilling.
4. **Principle 4: data Holds the Comment Being Posted, or null.** The Hook exposes submitted form data during execution, returning `null` when no submission is active.

---

## PRINCIPLE | `useFormStatus` from `'react-dom'`: the Post button reads `pending` from its form, with no prop

> [!PRINCIPLE]
> **Principle 1: useFormStatus Gives the Post Button pending**
>
> *Call `useFormStatus` from `'react-dom'` in a component rendered inside a `<form>`, and read `pending`, which is `true` while that form is submitting.*
>
> A submit button needs to detect when its parent form is submitting so it can disable user interaction and display loading progress. No props need to bridge this distance. By invoking `useFormStatus`, the component asks React DOM to inspect ancestor elements for an enclosing `<form>`. The returned `pending` boolean reflects whether that form action is actively executing. The Hook resides in `'react-dom'` because HTML forms are specific to web browsers.
>
> **DO THIS:**
> ```jsx
> import { useFormStatus } from 'react-dom';
>
> function PostButton() {
>   const { ~pending~ } = useFormStatus(); // true while the form above is submitting
>   return <button type="submit" disabled={pending}>{pending ? 'Posting...' : 'Post'}</button>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> import { ~useFormStatus~ } from 'react'; // **WRONG:** 'react' has no useFormStatus, so the page breaks
>
> function PostButton() {
>   const { pending } = useFormStatus();
>   return <button type="submit" disabled={pending}>{pending ? 'Posting...' : 'Post'}</button>;
> }
> ```

The fundamental pattern requires minimal setup. A dedicated child component calls `useFormStatus`, and the parent form renders it:

```jsx title="A button that asks its form"
import { useFormStatus } from 'react-dom';

function Submit() {
  const { ~pending~ } = useFormStatus(); // true while the form above is submitting
  return <button type="submit" disabled={pending}>Submit</button>;
}

<form action={action}>
  ~<Submit />~ {/* Submit is rendered inside the form, so this form is above it */}
</form>
```

The parent form passes zero props to the child component. The nested button reads the submission state of the surrounding form directly.

### The Post button on our page

Applying this pattern to our comment interface, `PostButton` invokes `useFormStatus` to access the pending flag:

```jsx title="src/PostButton.jsx"
import { useFormStatus } from 'react-dom';

export default function PostButton() {
  const { ~pending~ } = useFormStatus(); // Comes from the form above, not from a prop
  return (
    <button type="submit" ~disabled={pending}~> {/* The user cannot click while the comment is on its way */}
      {pending ? 'Posting...' : 'Post'}
    </button>
  );
}
```

The intermediate `CommentFooter` component renders the button without managing status props:

```jsx title="src/CommentFooter.jsx"
import PostButton from './PostButton.jsx';

export default function CommentFooter() {
  return (
    <div>
      ~<PostButton />~ {/* No pending prop: the button asks the form itself */}
    </div>
  );
}
```

And the root `App` component mounts the comment section:

```jsx title="src/App.jsx"
import CommentSection from './CommentSection.jsx';

export default function App() {
  return <CommentSection />;
}
```

### Who sets pending? React DOM does

**Our component code never writes to `pending`, and no props are passed to `PostButton`. Nevertheless, the button displays loading text and disables clicks for the full second.**

React DOM orchestrates the underlying state transition through browser form integration (Lesson 7). The submission lifecycle unfolds in four distinct steps:
1. The user clicks Post. Because the button specifies `type="submit"`, the browser triggers form submission (Lesson 11).
2. React DOM initiates the bound form action. Because the form is now actively submitting, the Hook inside PostButton returns `pending` as `true`. React re-renders the button, which displays loading text and applies the disabled attribute.
3. The asynchronous action function pauses for one second while awaiting the server mock, then returns the updated array containing the new comment.
4. Once the action resolves, the submission cycle completes. React DOM resets `pending` to `false`, the button restores its default label, and React clears the uncontrolled input field (Lesson 41).

```page caption="Our comment page during the one-second wait: the button reads Posting... and cannot be clicked."
card: lines=Great shot! | typed=Nice photo!
line: [Posting...] | good
console: quiet
```

Inspecting the browser Elements panel during submission reveals the native disabled attribute applied by the conditional prop:

```dom caption="The Elements panel during the one-second wait: the button inside the row of CommentFooter carries the disabled attribute."
<div>
+ <button type="submit" disabled>Posting...</button> | note: disabled while pending is true
</div>
```

```tree dir=right caption="Where the value of pending comes from: React DOM fills it from the form, and the button only reads it."
How `pending` reaches `PostButton`
- +1. The user clicks Post [`type="submit"`] | The click **submits the form**
- +2. React DOM marks the form as submitting | The form above `PostButton` is **pending**
- +3. `PostButton` asks the form [`useFormStatus`] | `pending` is **`true`**: the button reads **Posting...** and turns off
- +4. The action finishes | `pending` is **`false`**: the button reads **Post** again
```

### Mistake: the import from 'react'

Most core React Hooks originate from the `'react'` package, such as `useActionState`. Consequently, developers often make the mistake of importing `useFormStatus` from the same location:

```jsx title="The two import lines a developer might write"
import { ~useFormStatus~ } from 'react'; // **WRONG:** 'react' has no useFormStatus, so the page breaks with an error
import { ~useFormStatus~ } from 'react-dom'; // The right package: React DOM provides this Hook
```

Why does this Hook live in `'react-dom'`? HTML form tags exist specifically within web browser environments. The official documentation categorizes `useFormStatus` under React DOM Form Hooks, which function exclusively in web browsers. Native application frameworks such as React Native do not provide browser form primitives and cannot use these DOM-specific hooks.

---

## PRINCIPLE | `useFormStatus` next to the `<form>` tag: `pending` stays `false` on every submit

> [!PRINCIPLE]
> **Principle 2: pending Stays false Next to the form Tag**
>
> *Call `useFormStatus` in a component rendered inside the `<form>`. In the component that renders the `<form>` tag, `pending` is never `true`.*
>
> The Hook searches strictly upward through ancestor components in the tree. A `<form>` element declared in a component's own return statement exists as a child in its element tree, not as an ancestor. Because React looks only above the calling component, it never detects the form rendered below it, leaving `pending` permanently `false`. React emits no console warnings to flag this mismatch. On screen, the button never disables, allowing users to submit duplicate entries during network delays.
>
> **DO THIS:**
> ```jsx
> function PostButton() {
>   const { ~pending~ } = useFormStatus(); // PostButton sits inside the form, so pending works
>   return <button type="submit" disabled={pending}>Post</button>;
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function CommentSection() {
>   const { ~pending~ } = useFormStatus(); // **WRONG:** this component renders the form, so pending stays false
>   return <form action={postAction}><button type="submit" disabled={pending}>Post</button></form>;
> }
> ```

### VS | `useFormStatus` in `Form` vs. in `Submit`: the same line, only the component inside the form sees `pending`

Consider two components derived from the React documentation. Both call `useFormStatus` using identical syntax:

```jsx title="The same Hook line, next to the form tag and inside the form"
function Form() {
  const { ~pending~ } = useFormStatus(); // **WRONG:** this component renders the form, so pending is never true
  return <form action={submit}></form>;
}

function Submit() {
  const { ~pending~ } = useFormStatus(); // Submit is rendered inside the form, so pending is true while it submits
  return <button disabled={pending}>Submit</button>;
}
```

Although the Hook invocations look identical, their positions in the component hierarchy produce opposite results. React initiates its upward search from the calling component fiber, not from individual JSX tags:
- In `Form`, the form element is returned by the component itself. It sits below `Form` in the hierarchy. Searching upward from Form never encounters this form element, so `pending` remains `false`.
- In `Submit`, the form element is an ancestor because the form renders `<Submit />` as a child. Searching upward from Submit successfully finds the enclosing form, so `pending` evaluates to `true` during submission.

The official React documentation states this invariant directly: "The `useFormStatus` Hook must be called from a component that is rendered inside a `<form>`." It clarifies that the Hook "will only return status information for a parent `<form>`. It will not return status information for any `<form>` rendered in that same component or children components."

```tree caption="useFormStatus next to the form tag vs. inside the form: the same line of code, two different results."
Where the component that calls `useFormStatus` sits
- !Next to the `<form>` tag [`function Form`] | The form is in the component's **own return**, below it | `pending` is **always `false`**
- +Inside the `<form>` [`function Submit`] | The form is **above** the component | `pending` is **`true`** while the form submits
```

### Mistake: the Hook in CommentSection

When developers first encounter `useFormStatus`, they often place it directly in the component managing the form. In this anti-pattern, `CommentSection` calls the Hook while rendering the form and button inline without subcomponents:

```jsx title="src/CommentSection.jsx, with useFormStatus next to the form tag"
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { saveComment } from './api.js';

async function addComment(previousComments, formData) {
  const comment = await saveComment(formData.get('comment'));
  return [...previousComments, comment];
}

export default function CommentSection() {
  const [comments, postAction] = useActionState(addComment, [{ id: 0, text: 'Great shot!' }]);
  const { ~pending~ } = useFormStatus(); // **WRONG:** CommentSection renders the form, so pending stays false
  return (
    <section>
      <ul>
        {comments.map(comment => <li key={comment.id}>{comment.text}</li>)}
      </ul>
      <form action={postAction}>
        <input name="comment" placeholder="Add a comment..." />
        <button type="submit" disabled={pending}>
          {pending ? 'Posting...' : 'Post'}
        </button>
      </form>
    </section>
  );
}
```

**This misplacement prevents the button from updating, allowing duplicate submissions during pending requests.** The resulting defect unfolds as follows:
1. The user types `Nice photo!` and clicks Post.
2. The button label remains unchanged, and the button stays interactive throughout the entire network delay.
3. Receiving no visual feedback that submission started, the user clicks Post a second time. The input field still retains its text because React clears uncontrolled inputs only after an action finishes successfully (Lesson 41).
4. The second click dispatches a duplicate action with the same text, causing two identical comments to appear in the list.

```page caption="The broken page during the one-second wait: the button still reads Post and can be clicked again."
card: lines=Great shot! | typed=Nice photo!
line: [Post] | bad
console: quiet
```

```page caption="The broken page after the user clicked Post twice: the same comment is posted two times."
card: lines=Great shot!; Nice photo!; Nice photo! | input=Add a comment... | bad=lines
line: [Post]
console: quiet
```

The browser console provides no clues. React emits no runtime errors or warnings when `useFormStatus` finds no parent form. The documentation notes only that `pending` remains permanently false. In the developer tools Elements panel, the button never receives the disabled attribute.

Faced with this silent failure, developers often abandon the Hook and implement manual state using `useState`. This workaround is unnecessary. The documentation provides the architectural fix: move the Hook into a child component rendered inside the `<form>`. In our application, encapsulating the button inside `PostButton` resolves the issue completely, as demonstrated in Principle 1.

### The owner of the form already has its own flag

If `CommentSection` itself needs to react to submission progress, it does not need `useFormStatus`. It already receives `isPending` directly from `useActionState` (Lesson 42). Each tier of the component tree uses its appropriate tool:
- **The form owner**, such as CommentSection, inspects `isPending` returned by `useActionState`.
- **Nested children inside the form**, such as PostButton, call `useFormStatus` to read `pending`.

This mirrors the rule of React Context: a component cannot consume a context provider that it renders within its own return statement (Lesson 28).

---

## PRINCIPLE | `useFormStatus` in the button: the components in the middle pass no `pending` prop

> [!PRINCIPLE]
> **Principle 3: The Components in the Middle Pass No pending Prop**
>
> *Let the component that needs the status of the form call `useFormStatus` itself, so the components between the form and that component pass no `pending` prop.*
>
> Passing a pending flag through props forces every intermediate layout component to receive and forward a value it never uses. A single omitted prop disconnects the button, leaving it permanently interactive. When the button calls `useFormStatus` directly, it queries the parent form across any depth of intermediate components, delivering identical user feedback without polluting intermediary props.
>
> **DO THIS:**
> ```jsx
> function CommentFooter() {
>   return <div>~<PostButton />~</div>; // No pending prop: PostButton calls useFormStatus
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function CommentFooter({ pending }) {
>   return <div>~<CommentActions />~</div>; // **WRONG:** pending is dropped here, so the button never turns off
> }
> ```

### VS | A `pending` prop vs. `useFormStatus` in the button: the same button, only `CommentFooter` changes

Compare how `CommentFooter` is authored under both architectures. First, using prop drilling:

```jsx title="CommentFooter with a pending prop"
function CommentFooter({ ~pending~ }) { // Receives pending only to hand it on
  return <PostButton pending={pending} />;
}
```

Second, using `useFormStatus` inside the button:

```jsx title="CommentFooter with useFormStatus in the button"
function CommentFooter() { // Mentions no pending at all
  return ~<PostButton />~; // PostButton asks the form itself
}
```

Both implementations produce identical behavior in the user interface. The difference lies in the intermediate layer. Under prop drilling, `CommentFooter` accepts `pending` solely to pass it onward. With `useFormStatus`, `CommentFooter` remains completely decoupled from submission state.

### The whole page with a pending prop

Here is how our comment application was structured before `useFormStatus`. The CommentSection component retrieves `isPending` from `useActionState` and forwards it down:

```jsx title="src/CommentSection.jsx, with a pending prop" startLine="10"
export default function CommentSection() {
  const [comments, postAction, ~isPending~] = useActionState(addComment, [{ id: 0, text: 'Great shot!' }]); // true while addComment runs
  return (
    <section>
      <ul>
        {comments.map(comment => <li key={comment.id}>{comment.text}</li>)}
      </ul>
      <form action={postAction}>
        <input name="comment" placeholder="Add a comment..." />
        ~<CommentFooter pending={isPending} />~ {/* 1. The owner hands the flag down */}
      </form>
    </section>
  );
}
```

The intermediate `CommentFooter` component receives the prop and forwards it:

```jsx title="src/CommentFooter.jsx, with a pending prop"
import PostButton from './PostButton.jsx';

export default function CommentFooter({ pending }) {
  return (
    <div>
      ~<PostButton pending={pending} />~ {/* 2. The middle component only passes it through */}
    </div>
  );
}
```

And `PostButton` accepts the prop to control button state:

```jsx title="src/PostButton.jsx, with a pending prop"
export default function PostButton({ ~pending~ }) { // 3. The button finally uses it
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Posting...' : 'Post'}
    </button>
  );
}
```

From the user perspective, both architectures behave identically. The button displays loading text for one second and restores its default label when the server responds. Both flags turn true across the exact same timeframe: `isPending` tracks the action promise, while `pending` reflects active submission.

```tree caption="A pending prop and useFormStatus give the same button, only the component in the middle changes."
Two ways the Post button gets the pending state of the form
- +With a `pending` prop [`<CommentFooter pending={isPending} />`] | `CommentFooter` **receives `pending` and only hands it on** | The button reads **Posting...** during the wait
- +With `useFormStatus` [`<CommentFooter />`] | `CommentFooter` **mentions no `pending`** | **Exact same button**: it reads **Posting...** during the wait
```

Passing props through intermediate layers that do not consume them is known as prop drilling (Lesson 28). The React documentation highlights the maintenance burden: "passing props can become verbose and inconvenient when you need to pass some prop deeply through the tree". Here, `CommentFooter` carries the pending boolean solely to satisfy its child.

### Mistake: one more component in the middle

**The structural fragility of prop drilling emerges when component layouts evolve. Every newly introduced intermediate component must forward the flag, and a single missed prop leaves the button stuck.**

Suppose a developer wraps the submit button in a new layout container named `CommentActions` to accommodate an emoji picker later. Under prop drilling, `CommentActions` must explicitly accept and forward the pending prop. If the developer forgets this step:

```jsx title="src/CommentFooter.jsx, with a pending prop and one more component in the middle"
import PostButton from './PostButton.jsx';

export default function CommentFooter({ pending }) {
  return (
    <div>
      ~<CommentActions />~ {/* **WRONG:** pending is not handed on, so PostButton reads Post forever */}
    </div>
  );
}

function CommentActions({ pending }) {
  return <PostButton pending={pending} />;
}
```

Because the forwarding chain is broken, `PostButton` receives an undefined prop. The button never disables during submission, exposing the application to duplicate requests as seen in Principle 2.

When `PostButton` calls `useFormStatus` directly, restructuring layout components requires no plumbing updates. The button remains inside the ancestor form, now nested an extra level deeper, and continues querying that form successfully:

```jsx title="src/CommentFooter.jsx, with useFormStatus in the button and one more component in the middle"
import PostButton from './PostButton.jsx';

export default function CommentFooter() {
  return (
    <div>
      <CommentActions />
    </div>
  );
}

function CommentActions() {
  return ~<PostButton />~; // Still inside the form, so useFormStatus still finds it
}
```

The React documentation requires only that the component is "rendered inside a `<form>`". It imposes no restrictions on how many intermediate layout components sit between them.

### Why the button is its own component

In production engineering, development teams create standardized submit buttons reused across comment sections, authentication dialogs, and settings panels. The official React blog explains this design system use case: "It is common to write design components that need access to form information without drilling props down."

One important architectural boundary: `useFormStatus` only reports form submission lifecycle state. Sharing general application state across deeply nested components still relies on props or React Context (Lesson 28).

---

## PRINCIPLE | `data` from `useFormStatus`: the form data being submitted, or `null` when nothing is submitted

> [!PRINCIPLE]
> **Principle 4: data Holds the Comment Being Posted, or null**
>
> *Read `data` from `useFormStatus` to show what the parent form is submitting, and check that `data` is not `null` before you call `data.get`.*
>
> While form submission is in progress, the `data` property contains the `FormData` instance being transmitted, allowing child components to render previews of submitted text. When no submission is active, `data` is `null`. Invoking `data.get` on initial render without checking for `null` throws an uncaught TypeError that crashes the component and blanks the interface.
>
> **DO THIS:**
> ```jsx
> const { data } = useFormStatus();
> return <div>{~data &&~ <p>Posting "{data.get('comment')}"...</p>}</div>; // The line shows only during a submission
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const { data } = useFormStatus();
> return <div><p>Posting "{~data.get('comment')~}"...</p></div>; // **WRONG:** data is null before the first submit, so this throws
> ```

The status object contains a second key property named `data`. Components nested inside the form access it alongside the pending flag:

```jsx title="Reading data from useFormStatus"
const { ~data~ } = useFormStatus(); // The form data being submitted, or null

{~data &&~ <p>Posting "{data.get('comment')}"...</p>} {/* Shows the line only during a submission */}
```

The React documentation defines this property: "An object implementing the `FormData interface` that contains the data the parent `<form>` is submitting. If there is no active submission or no parent `<form>`, it will be `null`."

### VS | `formData.get` in the action vs. `data.get` in a component: the same text, read in two places

The `data` property contains a standard browser FormData instance, identical to the `formData` argument received by action functions (Lesson 40). You extract submitted values using the `get` method and the field name:
- In `addComment`, `formData.get('comment')` allows the asynchronous action to read the submitted value on the server or data layer.
- In a child component, `data.get('comment')` allows the user interface to display that same value while network transmission is underway.

Both locations inspect data from the same submission event, yielding identical text. The distinction is operational context: one executes inside the action handler, while the other runs inside a component rendering on screen.

### A line under the field while the comment is on its way

We can now utilize `data` in our comment interface. Because `CommentFooter` also renders inside the form, it can invoke `useFormStatus` to display a submission preview above the button:

```jsx title="src/CommentFooter.jsx"
import { useFormStatus } from 'react-dom';
import PostButton from './PostButton.jsx';

export default function CommentFooter() {
  const { ~data~ } = useFormStatus(); // CommentFooter is inside the form too
  return (
    <div>
      {~data &&~ <p>Posting "{data.get('comment')}"...</p>} {/* Only while the form submits */}
      <PostButton />
    </div>
  );
}
```

The remaining files, including `PostButton`, `CommentSection`, and the mock API, require no modifications. The resulting lifecycle proceeds as follows:
1. Prior to the initial submission, `data` is `null`, so the preview element does not render.
2. The user types `Nice photo!` and clicks Post.
3. While the action resolves, the preview line displays the submitted comment and the button indicates active loading.
4. When the action finishes, `data` returns to `null`, removing the preview line from view.

```page caption="The finished page before any submit: no line under the field."
card: lines=Great shot! | input=Add a comment...
line: [Post]
console: quiet
```

```page caption="The finished page during the wait: a line shows the comment being posted, and the button reads Posting..."
card: lines=Great shot! | typed=Nice photo!
line: Posting "Nice photo!"... | good
line: [Posting...] | good
console: quiet
```

```page caption="The finished page after the wait: the line is gone, and Nice photo! is in the list."
card: lines=Great shot!; Nice photo! | input=Add a comment...
line: [Post]
console: quiet
```

This preview line reflects only what is currently being transmitted. It does not insert the comment into persistent state prematurely. Rendering speculative updates in lists before server confirmation is the dedicated role of `useOptimistic`, introduced in Lesson 44.

### Mistake: data.get before the first submit

Observing that `data` functions during active submissions, a developer might remove the guard and invoke `data.get` directly:

```jsx title="src/CommentFooter.jsx, reading data with no check"
export default function CommentFooter() {
  const { data } = useFormStatus();
  return (
    <div>
      <p>Posting "{~data.get('comment')~}"...</p> {/* **WRONG:** data is null on the first render, so this throws */}
      <PostButton />
    </div>
  );
}
```

The component crashes immediately on initial mount before user interaction begins. When the page first renders, no submission is active, meaning `data` is `null`. Attempting to access property `get` on a `null` value triggers an unhandled exception. React unmounts the failing component tree, leaving the browser viewport blank:

```page width=full caption="The page with data.get and no check: the first render throws, and nothing is left on the page."
blank
console: Uncaught TypeError: Cannot read properties of null (reading 'get')
  warn: An error occurred in the <CommentFooter> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

The solution is the null check established in our finished implementation: guard the element with `data &&` before accessing its fields. The React documentation demonstrates an equivalent pattern using a ternary operator that renders fallback text when `data` is `null`.

---

## All 4 Principles Together

### The complete project

Here are the five source files comprising the complete photo comment application. The form is declared in `CommentSection`. Both `CommentFooter` and `PostButton` render inside it, reading their respective status values without prop drilling:

```js title="src/api.js"
let nextId = 1;

export async function saveComment(text) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { id: nextId++, text };
}
```

```jsx title="src/App.jsx"
import CommentSection from './CommentSection.jsx';

export default function App() {
  return <CommentSection />;
}
```

```jsx title="src/CommentSection.jsx"
import { useActionState } from 'react';
import { saveComment } from './api.js';
import CommentFooter from './CommentFooter.jsx';

async function addComment(previousComments, formData) {
  const comment = await saveComment(formData.get('comment'));
  return [...previousComments, comment];
}

export default function CommentSection() {
  const [comments, postAction] = useActionState(addComment, [{ id: 0, text: 'Great shot!' }]);
  return (
    <section>
      <ul>
        {comments.map(comment => <li key={comment.id}>{comment.text}</li>)}
      </ul>
      ~<form action={postAction}>~ {/* Principle 2: the form is above CommentFooter and PostButton */}
        <input name="comment" placeholder="Add a comment..." />
        <CommentFooter />
      </form>
    </section>
  );
}
```

```jsx title="src/CommentFooter.jsx"
import { useFormStatus } from 'react-dom';
import PostButton from './PostButton.jsx';

export default function CommentFooter() {
  const { ~data~ } = useFormStatus(); // Principle 4: the text being posted, or null
  return (
    <div>
      {data && <p>Posting "{data.get('comment')}"...</p>}
      ~<PostButton />~ {/* Principle 3: no pending prop */}
    </div>
  );
}
```

```jsx title="src/PostButton.jsx"
import { ~useFormStatus~ } from 'react-dom'; // Principle 1: from react-dom, not react

export default function PostButton() {
  const { ~pending~ } = useFormStatus(); // Principle 2: called inside the form, so pending works
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Posting...' : 'Post'}
    </button>
  );
}
```

### How React calls the components, in order

During initial page load, React evaluates components top-down according to the tree structure below. When form submission begins and ends, React re-renders `CommentFooter` and `PostButton`, allowing both components to receive the updated form status:

```tree caption="The component tree of the comment page, the order in which React calls each component, and where each one reads the status of the form."
`App` [1. Called first] | Renders `<CommentSection />`
- +`CommentSection` [2. Called second] | **Owns the list and renders the `<form>`** | Does not call `useFormStatus`: the form is in its own return
  - +`CommentFooter` [3. Called third, inside the form] | Calls `useFormStatus` and reads **`data`** | Shows **Posting "Nice photo!"...** during the wait
    - +`PostButton` [4. Called fourth, inside the form] | Calls `useFormStatus` and reads **`pending`** | Reads **Posting...** and turns off during the wait
```

| Mistake | What the user sees | The fix |
| :--- | :--- | :--- |
| **The import from `'react'`** | The page breaks with an error | Import `useFormStatus` from `'react-dom'` |
| **The Hook next to the `<form>` tag** | The button stays on Post, and the comment is posted twice | Call the Hook in a component inside the `<form>` |
| **A `pending` prop through the middle** | One forgotten prop, and the button never turns off | Let the button ask the form, and pass nothing through the middle |
| **`data.get` with no check** | The first render throws, and the page is blank | Show the line only when `data` is not `null` |

One last time, the defining rule of this lesson: **`useFormStatus` queries the closest ancestor `<form>` element above the calling component. The form must enclose the component in the tree, never reside in the component's own return statement.**

---

## For the Interview

> **The Interview Question:** How does a field nested deep in a form read the form's pending state?

### How to Answer Clearly in 30 Seconds

"A nested field or button calls `useFormStatus`, a React DOM Hook exported from `'react-dom'`. It accepts zero arguments and reads the active status of the closest parent form: `pending`, `data`, `method`, and `action`. The `pending` boolean is `true` while that form is actively submitting, allowing buttons to disable themselves and render loading indicators. Three architectural rules ensure correct behavior:
1. **Render inside the form**: The Hook inspects ancestor components above it. In the component that renders the `<form>` tag itself, `pending` remains permanently `false` without raising errors.
2. **Eliminate prop drilling**: Intermediate components between the form and the button pass no props. The React architecture models this behavior as if the parent form element acts as a Context provider.
3. **Validate submitted data**: The `data` property contains the active `FormData` instance during submission, and returns `null` when no submission is running."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"I called `useFormStatus` in my form component, and `pending` is always `false`. Why?"**
   Because the Hook searches strictly upward for an ancestor `<form>` element. A form returned by the component itself resides below it in the component hierarchy, making it invisible to the Hook. When no ancestor form exists, `useFormStatus` defaults `pending` to `false`, and sets `data`, `method`, and `action` to `null`. The fix is to extract the button into a child component rendered inside the form tags. If the form owner itself requires submission status, it should read `isPending` directly from `useActionState`.
2. **"What is the difference between `isPending` from `useActionState` and `pending` from `useFormStatus`?"**
   They report the exact same submission lifecycle to two different locations in the component tree. `isPending` is returned directly to the component invoking `useActionState`, which typically manages the form. The `pending` boolean is available to any child component rendered inside the `<form>`, at arbitrary nesting depth, without passing props. In a typical architecture, the form owner relies on `isPending`, while reusable nested buttons read `pending`.
3. **"Why does `useFormStatus` come from `'react-dom'`, and what do `method` and `action` hold?"**
   The Hook belongs to React DOM because HTML `<form>` tags are specific to web browsers. During active submission, `method` reflects the HTTP method string, defaulting to `'get'` if unspecified. Assigning `method="post"` alongside a form action function causes a React console warning because React handles request submission automatically. The `action` property references the function passed to the parent form `action` prop. It evaluates to `null` if no parent form exists, if the action is a URL string, or if no action prop is provided.

```tree caption="Interview comparison: which component reads the pending state of the form, and with which tool."
Who reads the pending state of one form
- +The owner of the form [`CommentSection`] | Calls `useActionState` | Reads **`isPending`**
- +A component inside the form [`PostButton` `CommentFooter`] | Calls `useFormStatus` | Reads **`pending`** and **`data`**, with no prop
- !The owner of the form calling `useFormStatus` | The form is **in its own return**, not above it | `pending` is **always `false`**
```
