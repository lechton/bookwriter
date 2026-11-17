# Lecture 112: How a Form With a Server Function Sends Before JavaScript Loads

*(Why does a form with a Server Function save the email even before JavaScript has loaded?)*

> INTERVIEW QUESTION | ❱ CORE | How do forms work with Server Function actions, and what is progressive enhancement?

---

## VS | A Button `onClick={handleClick}` vs. a Form `action={subscribe}`: both send the email, only the form works before JavaScript loads

> A standard HTML form submits its field values using native browser networking, without requiring client JavaScript. **When you assign a Server Function to `<form action>`, React preserves that native capability: the browser submits before scripts download, and React enhances the submission once hydrated**. That architecture ensures a reader on a slow connection can submit immediately, while a standalone button with a click handler drops interactions until scripts finish loading.

Consider standard web behavior prior to client-side frameworks. You declared a `<form>` element containing the destination endpoint in its `action` attribute. Each form control declared a `name` attribute. When the user clicked submit, the browser assembled every named input into an HTTP request, transmitted it to that endpoint, and rendered the server response. That entire cycle executed without running a single line of client JavaScript.

```html title="Plain HTML: the browser sends the form by itself"
<form ~action="/subscribe"~ method="post"> <!-- The browser sends every named field to this address -->
  <input name="email" />
  <button type="submit">Subscribe</button>
</form>
```

In traditional single-page React applications, developers adopted a different workflow. We stored input text in state, attached `onClick` to a button, and invoked the Server Function inside that handler (as seen in Lesson 110). That pattern requires the client JavaScript bundle. The click handler arrives with the bundle, and React attaches it only when hydrating the page.

React restores the resilience of native HTML forms. **Pass the Server Function directly to the form's `action` prop:**

```jsx title="React: the same form, with a Server Function in action"
<form ~action={subscribe}~> {/* Before JavaScript loads, the browser sends it; after, React sends it */}
  <input name="email" />
  <button type="submit">Subscribe</button>
</form>
```

You do not write a destination URL. Because a Server Function lives on the server, React formats the form so the browser can dispatch data there directly. When the user submits, `subscribe` receives the submitted data and retrieves the email using the field's `name` attribute.

Picture a newsletter form at the bottom of an article. A reader opens the link over a slow mobile connection. The server has sent the HTML, so the article and form appear on the screen. However, the client JavaScript bundle is still downloading. The reader enters an email and taps `Subscribe`. Will that email reach the server?

**Why:** The outcome depends on which mechanism handles the submission. With an `onClick` button, the tap is lost because the event handler has not arrived yet. The reader closes the tab believing they subscribed. With the form, the browser submits natively, and the server runs `subscribe`. When the bundle loads later, React enhances the form, eliminating full page reloads for future submissions.

This design strategy is known as **progressive enhancement**. The interface delivers an initial version that works using plain HTML for every user. When JavaScript executes, it upgrades the interaction. Here, one form works in both environments.

Keep this central principle in mind throughout this lesson:

**A form whose `action` is a Server Function works twice: before JavaScript loads, the browser sends it, and after hydration, React sends it.**

> [!DEFINITION]
> **Hydration.** [REVIEW] Hydration is the process where React attaches interactivity to server-rendered HTML.
> 1. The server renders components into plain HTML so visitors view text, layout, and forms immediately.
> 2. The client JavaScript bundle transfers and compiles in the background.
> 3. React scans the existing DOM nodes and attaches event listeners such as `onClick` and `onSubmit` (Lesson 104).

> [!DEFINITION]
> **Server Function.** [REVIEW] A Server Function is an asynchronous function that executes exclusively on the server runtime.
> 1. It is declared inside a module or closure marked with the `'use server'` directive.
> 2. The client application receives an opaque reference rather than the server source code.
> 3. Calling the reference triggers an HTTP request that executes the logic on the server (Lesson 110).

> [!DEFINITION]
> **FormData.** [REVIEW] `FormData` is a native web API object representing HTML form field key-value pairs.
> 1. The browser automatically populates it with all enabled form controls that declare a `name` attribute.
> 2. Call `formData.get('name')` to retrieve an entry value, returning the text content or `null` if the key is missing.
> 3. It decouples form inputs from React component state, enabling uncontrolled inputs (Lesson 40).

> [!DEFINITION]
> **A function in a form's action.** [REVIEW] React allows passing a JavaScript function directly to `<form action={...}>`.
> 1. Upon submission, React intercepts the event, constructs a `FormData` object, and supplies it as the first argument.
> 2. React wraps the execution in an asynchronous Transition, keeping the surrounding page responsive during processing.
> 3. When the action finishes successfully, React automatically resets uncontrolled form fields (Lesson 45).

> [!DEFINITION]
> **Progressive enhancement.** [REVIEW] Progressive enhancement is a web architecture strategy that ensures core features work with standard HTML.
> 1. The application delivers essential navigation and data submissions before any client script runs.
> 2. When client scripts finish loading, JavaScript enhances the interface with background updates and instant feedback.
> 3. Users on slow connections, restricted devices, or failed script loads retain full access to core operations (Lesson 45).

### Where Readers Usually Go Wrong

1. **They assume visible UI is immediately interactive.** Before client scripts execute, only native browser behaviors work (as seen in Lesson 104). Text fields accept keystrokes, but custom click handlers do not run.
2. **They assume every form action requires client JavaScript.** A client-side function passed to `action` requires the bundle to execute (as seen in Lesson 45). A Server Function lives on the server, so the browser can dispatch native HTTP requests directly to it.
3. **They omit the `name` attribute on form inputs.** Controlled inputs in state do not require names (as seen in Lesson 110). But native form submissions and `FormData` rely entirely on `name` attributes to capture field values.

### The One Question to Ask

**For every form, ask: what happens if the user submits before JavaScript loads?** If the workflow relies on an attached client event handler, the submission fails silently. If the form uses a Server Function in `action`, the browser submits natively, and the server executes the action.

## SECTION | The Newsletter Form Under a Blog Post

Here is the bottom of the blog post on the slow phone. The reader has typed the email, and the JavaScript bundle has not loaded yet:

```page caption="The bottom of the blog post on the phone, before the JavaScript bundle has loaded."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email | john@example.com
  submit: Subscribe
```

The page looks ready, but no JavaScript has run on the phone yet. We keep the four files of the newsletter section from Lesson 110, and two of them change:

```files title="blog: the newsletter form" caption="The four files of the newsletter form. actions.js and SubscribeBox.jsx change in this lesson."
src/
  db.js | stand-in | Plays the database: `db.subscribers.add(email)` saves one email
  actions.js | Server Functions | Starts with `'use server'`; `subscribe` now reads the email from the form data
  SubscribeBox.jsx | Server Component | Renders a `<form>` whose `action` is `subscribe`; it loses `'use client'` in Principle 2
  App.jsx | Server Component | Renders the post and `<SubscribeBox />`
```

The database module serves as a stand-in, allowing the example to run without an external database instance.

In this lesson, the form omits status messages and pending indicators. Both capabilities require client Hooks, which return in the next two lessons (Lessons 113 and 114).

**PRINCIPLES:** A form whose `action` is a Server Function works twice: the browser sends it before JavaScript loads, and React sends it after. Four principles follow:
1. **`onClick` and `onSubmit` before hydration: no handler of ours runs, so the email never reaches the server.** A lone button does nothing, and a form with `onSubmit` is sent with GET to an address nobody reads.
2. **`action={subscribe}`: the form calls the Server Function with its `FormData`.** So the Server Function reads the email with `formData.get` and the field's `name`.
3. **`action={subscribe}` before hydration: the browser posts the form itself.** It sends a POST with every named field, the server runs `subscribe`, and the page loads again.
4. **`action={subscribe}` after hydration: React sends the same form without a page load.** It calls `subscribe` inside a Transition, the page stays, and the field empties after success.

---

## PRINCIPLE | `onClick` and `onSubmit` before hydration: no handler of ours runs, so the email never reaches the server

> [!PRINCIPLE]
> **Principle 1: Before Hydration: No Handler of Ours Runs**
>
> *Before the JavaScript bundle loads, no event handler of ours runs, so a form that sends the email from `onClick` or from `onSubmit` never reaches the Server Function.*
>
> The server's HTML reaches the phone before the bundle. The reader can see the form, type in it, and tap the button, but hydration has not attached our handlers yet. A lone button with `onClick` does nothing. A form with `onSubmit` is sent by the browser's default, GET to the current address, and no code of ours reads that address. Either way, the email never reaches the database.
>
> **DO THIS:**
> ```jsx
> <form ~action={subscribe}~> {/* A real form whose action is the Server Function: the browser can send it before hydration */}
>   <input name="email" />
>   <button type="submit">Subscribe</button>
> </form>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <button ~onClick={handleClick}~>Subscribe</button> {/* **WRONG:** before hydration, handleClick is not attached, so the tap sends nothing */}
> ```

### The Button With a Click Handler, on the Slow Phone

Here is the newsletter section we built in Lesson 110, without its pending text and its answer line. The email lives in state, and the click handler calls the Server Function:

```jsx title="src/SubscribeBox.jsx, the version with a click handler"
'use client';

import { useState, useTransition } from 'react';
import { subscribe } from './actions';

export default function SubscribeBox() {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await ~subscribe(email)~; // Our handler calls the Server Function with the text in email
    });
  }

  return (
    <section>
      <h2>Get new posts by email</h2>
      <label>
        Your email
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </label>
      <button ~onClick={handleClick}~>Subscribe</button> {/* Hydration attaches handleClick to this button */}
    </section>
  );
}
```

On a high-speed development machine, the bundle downloads immediately, so every click succeeds. On a slow mobile network, the user taps `Subscribe` before the bundle arrives. **No request is dispatched to the server**. The screen remains completely unchanged:

```page caption="The phone right after the reader taps Subscribe on the version with a click handler, before the bundle has loaded. Nothing has changed."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email | john@example.com
  button: Subscribe | bad
```

**The button appears on the screen, but no click listener exists in the DOM yet, so the interaction is lost.** Here is the sequence of events:
1. The framework renders the component on the server and delivers raw HTML with the post (as seen in Lesson 102).
2. The phone renders the post, the email field, and the button. The script bundle is still downloading, so React has not hydrated the page.
3. The reader types an email into the input field. The native browser handles typing without needing JavaScript runtime support.
4. The reader taps `Subscribe`. Because hydration has not occurred, no click listener exists in the DOM (as seen in Lesson 104).
5. The button sits outside any form element, so the browser initiates no native navigation or submission.
6. When the bundle finishes downloading, React hydrates the DOM and attaches `handleClick`. The earlier tap has already vanished without feedback.

### A Second Surprise: `value={email}` Before Hydration

Look closely at step 3. The input element declares `value={email}`, and `email` defaults to an empty string. Yet the typed letters remain visible in the input box. Why? A controlled `value` prop enforces state synchronization only while React executes in the browser. Before hydration, React is not running to reset the input value, so the browser keeps the typed text in the DOM node (as seen in Lesson 20).

Hydration creates a desynchronization defect here. When React hydrates, the DOM input displays the typed text, but the component state variable `email` is still an empty string. If the reader taps the button after hydration without typing additional characters, no `onChange` event fires. As a result, `handleClick` invokes `subscribe` with an empty string.

### VS | A Button Outside a Form vs. a Form With `onSubmit`: both lose the email, in two different ways

A developer who understands forms moves the field inside a `<form>` with an `onSubmit` listener (as seen in Lesson 11). The handler calls `e.preventDefault()` and invokes `subscribe`:

```jsx title="The newsletter field inside a form with onSubmit"
function handleSubmit(e) {
  e.preventDefault();
  startTransition(async () => {
    await subscribe(email);
  });
}

<form ~onSubmit={handleSubmit}~> {/* Hydration attaches handleSubmit; before it, the browser's own submit runs */}
  <input name="email" value={email} onChange={e => setEmail(e.target.value)} />
  <button type="submit">Subscribe</button>
</form>
```

Both implementations call `subscribe` from inside an event handler, which makes them seem functionally equivalent. **They look similar, but their failure modes differ completely!** Before hydration, neither event handler executes, meaning neither one invokes `subscribe`. However, they fail in two distinct ways because the browser understands how to submit forms natively, but cannot submit a detached button:
- **An `onClick` listener on an isolated button:** the tap produces no action. The page remains unchanged.
- **An `onSubmit` listener on a form:** the browser falls back to its default submission behavior. The official React documentation explains: "By default, the browser sends the form data to the current URL and refreshes the page."

> [!DEFINITION]
> **HTTP method: GET and POST.** [NEW] HTTP methods specify how client requests transfer data to the server.
> 1. GET appends named input values directly to the URL query string following a question mark, visible in browser history.
> 2. POST places field values inside the HTTP request body, preserving clean URLs and supporting large payloads.
> 3. Standard HTML forms default to GET unless an explicit `method="post"` attribute is specified (Lesson 112).

That native fallback uses the GET method. When the user taps submit, the browser reloads the entire page. The address bar displays `?email=john%40example.com`, and the input field resets to empty. Inside a URL query string, the browser percent-encodes `@` as `%40`.

The server receives this GET request, renders the original article anew, and streams back fresh HTML. No server route inspects the query string for newsletter subscriptions, so `subscribe` never executes. The reader sees the page reload with an empty input and mistakenly assumes the signup succeeded.

::: row caption="Two versions tapped before the bundle loads: neither one calls subscribe."
::: col title="onClick on a button outside a form" tag="nothing happens" tone=bad
```page size=mini
section: Get new posts by email
form:
  field: Your email | john@example.com
  button: Subscribe | bad
```
The page does not change. No request leaves the phone.
:::
::: col title="onSubmit on a form" tag="GET to the current URL" tone=bad
```page size=mini
section: Get new posts by email
form:
  field: Your email
  submit: Subscribe | bad
```
The page loads again with `?email=john%40example.com` in the address. And `subscribe` never runs.
:::
:::

React documentation highlights the proper alternative: a form `action` can also be a Server Function, which `onSubmit` does not support. Principle 2 adopts this approach.

Remember: before hydration finishes, custom event listeners do not exist on the page. Any submission logic dependent on an event listener fails.

---

## PRINCIPLE | `action={subscribe}`: the form calls the Server Function with its `FormData`

> [!PRINCIPLE]
> **Principle 2: Form Data: The Form Calls the Server Function With Its FormData**
>
> *When a Server Function is passed to `<form action>`, React calls it with the form's `FormData` as the first argument, so the Server Function reads each field by its `name`.*
>
> With a click handler, our code called `subscribe` and chose its argument. Now the form is the caller. When the reader submits, React collects every field that has a `name` into one `FormData` and hands it to the Server Function. The email field needs a `name` instead of state, so the component can drop its Hooks and stay a Server Component.
>
> **DO THIS:**
> ```js
> export async function subscribe(formData) {
>   const email = ~formData.get('email')~; // Reads the field whose name is email
>   await db.subscribers.add(email);
> }
> ```
>
> **DO NOT DO THIS:**
> ```js
> export async function subscribe(~email~) { // **WRONG:** the form passes FormData, so email is not the text the reader typed
>   await db.subscribers.add(email);
> }
> ```

### The Smallest Form With a Server Function

You already understand how forms operate when `action` holds a local client function (as seen in Lesson 41). Now `action` references a Server Function. The markup contains one input with a `name` attribute and a submit button:

```jsx title="A form whose action is a Server Function"
<form ~action={subscribe}~> {/* The form calls subscribe when the user submits */}
  <input name="email" />
  <button type="submit">Subscribe</button>
</form>
```

On the backend, `subscribe` receives the form data and retrieves the email using the field's `name`:

```js title="src/actions.js"
'use server';

import { db } from './db';

export async function subscribe(~formData~) { // React passes the form's FormData here
  const email = ~formData.get('email')~; // The key is the name written on the field
  await db.subscribers.add(email);
}
```

When the user submits, React bundles every named field into a single `FormData` object and passes it to `subscribe`. The official React documentation states: "When calling a Server Function in a form, React will supply the form's FormData as the first argument to the Server Function." The retrieval key `'email'` matches the attribute `name="email"` declared on the input element (as seen in Lesson 40).

### VS | `subscribe(email)` From a Handler vs. `subscribe(formData)` From a Form: who calls the function decides what it receives

Here is the previous click handler invocation placed next to the form implementation:

```jsx title="Our handler calls subscribe with the email text"
<button onClick={() => ~subscribe(email)~}>Subscribe</button> {/* Our code is the caller, so our code chooses the argument */}
```

```jsx title="The form calls subscribe with FormData"
<form ~action={subscribe}~> {/* The form is the caller, so the argument is the form's FormData */}
  <input name="email" />
  <button type="submit">Subscribe</button>
</form>
```

These two examples invoke the same server function name. **Their invocation contracts are completely different!** With a click listener, your application code invokes `subscribe` directly, determining the exact arguments passed. With a form action, the form container itself invokes the function. A form action always receives a `FormData` instance containing all named controls.

What about passing a client function to `action` versus passing a Server Function? **The form mechanics are identical.** Both patterns pass a `FormData` object to `action` inside a Transition. Both automatically reset uncontrolled inputs upon completion (as seen in Lesson 45). The only distinction is where the function executes: in the browser or on the server.

```tree caption="Who calls subscribe decides what subscribe receives."
Two callers of `subscribe`
- !Our click handler [`onClick`] | **Our code** calls `subscribe` | It passes the **text** in `email`
- +The form [`action={subscribe}`] | **The form** calls `subscribe` on submit | It passes **one `FormData`** with every named field
```

### The Newsletter Form Drops Its State

The component simplifies dramatically. Because the field value travels inside `FormData` referenced by its `name`, local component state is no longer needed. We remove `useState` and `useTransition`. The input loses its `value` and `onChange` attributes. With all client Hooks and event listeners eliminated, the file drops the `'use client'` directive entirely, transforming into a pure Server Component (as seen in Lesson 106):

```jsx title="src/SubscribeBox.jsx"
import { subscribe } from './actions';

export default function ~SubscribeBox~() { // No directive: a Server Component
  return (
    <section>
      <h2>Get new posts by email</h2>
      <form ~action={subscribe}~> {/* The form calls subscribe with its FormData */}
        <label>
          Your email
          <input ~name="email"~ /> {/* The key of this field inside FormData */}
        </label>
        <button type="submit">Subscribe</button>
      </form>
    </section>
  );
}
```

The email field operates as an uncontrolled input (as seen in Lesson 20). The browser retains typed characters natively, and the form extracts the current value upon submission. Neither the database module nor the root application component requires modifications.

### The Mistake: Passing the Old `subscribe(email)` to the Form

A developer updates the form markup but leaves the original Server Function signature expecting a primitive string:

```js title="src/actions.js"
export async function subscribe(~email~) { // **WRONG:** the form passes FormData, so email holds a FormData object, not john@example.com
  await db.subscribers.add(email);
}
```

While the parameter is named `email`, the form runtime delivers a `FormData` instance into that argument slot. Passing that parameter to the database method stores an object reference instead of the expected string. The database never saves the actual email address, and no runtime error surfaces. To resolve this defect, name the parameter `formData` and extract values explicitly via `formData.get('email')`.

Remember: the invoking caller determines the argument payload. When a form triggers an action, the payload is always `FormData`.

---

## PRINCIPLE | `action={subscribe}` before hydration: the browser posts the form itself

> [!PRINCIPLE]
> **Principle 3: Progressive Enhancement: The Browser Posts the Form Before JavaScript Loads**
>
> *When a server-rendered form has a Server Function as its `action`, the reader can submit it before the bundle loads: the browser sends a POST with every named field, the server runs the Server Function, and the page loads again.*
>
> Sending a form is something the browser does with plain HTML. A Server Function lives on the server, so the browser can reach it with an ordinary POST, and no JavaScript on the phone is needed. React makes the request POST whatever `method` says, and the framework tells the server which function to run. Every field the Server Function reads must have a `name`, because the browser sends nothing else.
>
> **DO THIS:**
> ```jsx
> <form action={subscribe}>
>   <input ~name="email"~ /> {/* The browser sends email=john@example.com in the POST */}
>   <button type="submit">Subscribe</button>
> </form>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <form action={subscribe}>
>   <input ~placeholder="Email"~ /> {/* **WRONG:** no name, so the POST carries no email and formData.get returns null */}
>   <button type="submit">Subscribe</button>
> </form>
> ```

### The Same Tap on the Slow Phone, Now With the Form

**Assigning a Server Function to `action` enables full functionality before client scripts run: the native browser submits the form, and the backend executes `subscribe`.** This progressive enhancement requires no specialized client code. Using the refactored form from Principle 2, consider the exact behavior when a user submits prior to bundle hydration.

Here is the exact runtime sequence:
1. The framework evaluates the component on the server. Because `action` references a Server Function, React generates HTML form attributes that native browsers understand.
2. The phone renders the article and form markup. The client JavaScript bundle is still transferring over the network.
3. The reader inputs `john@example.com` and taps `Subscribe`.
4. Because the button is a submit control inside a `<form>`, the browser handles submission natively without needing JavaScript runtime execution.
5. The browser issues an HTTP **POST** request containing all named inputs. This payload includes the email field and a hidden field embedded by React referencing `subscribe`.
6. On the backend, the framework receives the POST payload, unpacks the form data, and executes `subscribe`, persisting the email.
7. The server renders the updated page response, and the browser displays the refreshed document with an empty input field. React documentation refers to this step as navigation, remaining by default at the current URL.

```page caption="The phone after the reader taps Subscribe on the form before the bundle loads. The page has loaded again, and the email is saved on the server."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email
  submit: Subscribe | good
```

Official React documentation highlights this exact capability: "By passing a Server Function to the form `action`, React can progressively enhance the form. This means that forms can be submitted before the JavaScript bundle is loaded." The documentation notes that this benefits visitors experiencing high network latency or running browsers with disabled scripts.

### VS | GET vs. POST: where the browser puts the email

In Principle 1, a form using `onSubmit` fell back to a GET request. The form in this principle submits using POST. Both methods transmit named inputs, but they package the data in completely different locations:
- **With GET**, standard web specifications dictate that form data is appended directly to the URL following a question mark separator. That produces the query string observed in Principle 1.
- **With POST**, form data is transmitted inside the HTTP request body. As a result, the URL in the browser address bar remains clean.

Our component markup does not declare `method="post"`. React automatically enforces the POST method for form actions. The official React documentation explains: "When a function is passed to action or formAction the HTTP method will be POST regardless of value of the method prop."

```tree caption="The two HTTP methods a form can use, and where each one puts the email."
Where the browser puts `email`
- !GET, the browser's default [`?email=`] | The fields go **into the address** after a `?` | The form with `onSubmit` in Principle 1
- +POST, chosen by React [`action={subscribe}`] | The fields go **into the request body** | This form, whatever `method` says
```

The server must also identify which Server Function should handle the incoming POST request. When rendering the form on the server, React injects a hidden input field containing an opaque reference to `subscribe`. The browser transmits this hidden field alongside user inputs, allowing the framework router to invoke the corresponding server logic (as seen in Lesson 107).

### VS | A Form With `onSubmit` vs. a Form With `action={subscribe}`: both pages load again, only one saves the email

Put the two form patterns side by side when tapped before the bundle loads:

::: row caption="Two forms tapped before the bundle loads: both pages load again with an empty field, but only one saves the email."
::: col title="onSubmit with preventDefault" tag="GET, nothing saved" tone=bad
```page size=mini
section: Get new posts by email
form:
  field: Your email
  submit: Subscribe | bad
```
The browser sends GET to the current address. No code of ours reads the address, so `subscribe` never runs.
:::
::: col title="action={subscribe}" tag="POST, email saved" tone=good
```page size=mini
section: Get new posts by email
form:
  field: Your email
  submit: Subscribe | good
```
The browser sends POST to the server. The framework runs `subscribe`, and `john@example.com` is saved.
:::
:::

In both scenarios, the browser reloads the page and presents an empty input box. **While their visual appearances match, their backend effects are completely different!** Only the form declaring `action={subscribe}` persists the submitted data. To the visitor, both actions appear identical. Only the database reflects the difference.

### The Mistake: an Email Field With No `name`

A developer migrates a controlled input by deleting its value and change handlers, but forgets to specify a `name` attribute:

```jsx title="src/SubscribeBox.jsx" startLine="10"
<input ~placeholder="Email"~ /> {/* **WRONG:** no name, so the form sends no email field */}
```

Standard browser form submission processes only controls that declare a `name` (as seen in Lesson 45). Before hydration, the native POST payload omits the field entirely. After hydration, React constructs `FormData` from the same DOM controls and likewise misses the value. In both environments, `formData.get('email')` returns `null`, causing the database to store invalid records. Adding `name="email"` resolves the issue.

Remember: prior to script execution, forms function as plain HTML, and plain HTML transmits only named controls.

---

## PRINCIPLE | `action={subscribe}` after hydration: React sends the same form without a page load

> [!PRINCIPLE]
> **Principle 4: Hydration: React Sends the Same Form Without a Page Load**
>
> *Once the page is hydrated, React sends the same form: it calls the Server Function with a network request inside a Transition, the page does not load again, and the field is reset after success.*
>
> Before hydration, the browser sends the form, and the whole page loads again. After hydration, React stops the browser's own submit, builds the `FormData`, and calls the Server Function with a network request. The same `subscribe` runs on the server both times. That is progressive enhancement: one form that works as plain HTML first, and becomes smoother when JavaScript runs.
>
> **DO THIS:**
> ```jsx
> <form ~action={subscribe}~> {/* React sends it after hydration; the browser sends it before */}
>   <input name="email" />
>   <button type="submit">Subscribe</button>
> </form>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <form ~onSubmit={handleSubmit}~> {/* **WRONG:** works on a fast laptop, but before hydration the browser sends GET and subscribe never runs */}
>   <input name="email" />
>   <button type="submit">Subscribe</button>
> </form>
> ```

### The Same Form, Tapped Before and After Hydration

Once the client bundle loads, React completes DOM hydration. When the user enters an email address and submits, the component markup remains identical to Principle 2. The difference lies in which layer executes the submission: the browser prior to hydration, and React following hydration.

Compare the two submission lifecycles:
- **On the server, the execution contract is identical!** Both paths transmit named form fields, and the server invokes `subscribe` with an equivalent `FormData` payload.
- **For the client user, the experience improves significantly!** Before hydration, the browser performs a full document reload. After hydration, the page remains stable in place, and React clears the input upon resolution.

```tree caption="The same form tapped before hydration and after hydration: the same Server Function runs, but the reader sees two different things."
One form, two taps on `Subscribe`
- +Before hydration | **The browser** sends a POST | `subscribe` runs | **The whole page loads again**
- +After hydration | **React** sends a network request inside a Transition | `subscribe` runs | **The page stays**; the field empties after success
```

**Following hydration, React intercepts native submission and manages transmission directly, preventing document reloads.** Here is the updated sequence:
1. The client script bundle finishes loading, and React hydrates the page markup (as seen in Lesson 104).
2. The user types `john@example.com` and clicks `Subscribe`.
3. React intercepts the submit event directly, bypassing native browser navigation. The official React documentation notes that with `action`, manual calls to `e.preventDefault()` are unnecessary.
4. React constructs a `FormData` object from the current input elements. Because `subscribe` is a Server Function, React dispatches an asynchronous network request to the backend endpoint (as seen in Lesson 110).
5. React executes this invocation inside a Transition. Official documentation states that Server Functions passed to `<form action>` execute automatically within a transition. Unlike manual click handlers, no explicit `startTransition` wrapper is required.
6. On the backend, the server executes `subscribe` to persist the record, matching Principle 3.
7. When the action completes without errors, React automatically clears uncontrolled input fields (as seen in Lesson 45).

```page caption="The page after the reader taps Subscribe once React has hydrated it. The page did not load again, and the field is empty."
heading: Park Opens Today
line: The city opened a new park on Main Street.
section: Get new posts by email
form:
  field: Your email
  submit: Subscribe | good
```

You do not build two separate form implementations. A single form and a single Server Function support both workflows. Hydration simply upgrades the transport layer.

### VS | `onSubmit` vs. `action={subscribe}` After Hydration: both save the email, only `action` does the extra work for you

Once hydration finishes, a form utilizing `onSubmit` functions properly as well. Its handler executes, invokes `e.preventDefault()`, and dispatches the Server Function. Both forms persist the email without triggering full page reloads. **However, their implementation requirements differ significantly!** Using `onSubmit` forces your code to manage three distinct operational responsibilities manually:
1. Preventing default browser navigation via `e.preventDefault()`.
2. Coordinating background execution state using `startTransition`.
3. Resetting input field values upon successful resolution. Without explicit clearing logic, the submitted text remains stranded inside the input box.

With `<form action={subscribe}>`, React coordinates all three responsibilities automatically. Furthermore, only the `action` variant operates before client scripts arrive.

```tree caption="After hydration, both forms save the email without a page load, but only action also works before hydration."
Two forms after hydration
- !`onSubmit` with `e.preventDefault` [`handleSubmit`] | Our code **stops the browser** and **starts the Transition** | Before hydration: **GET, nothing saved**
- +`action={subscribe}` | **React** stops the browser and starts the Transition | Before hydration: **POST, email saved**
```

### The Mistake: Testing Only on a Fast Laptop

On local development hardware, bundle transmission is instantaneous. Because every submission occurs after hydration, developers rarely observe the unhydrated execution path. Problems frequently arise when styling custom controls. A developer might mark the component with `'use client'` and replace the native submit button with a styled `<div>` carrying a click listener:

```jsx title="A styled div in place of the submit button"
<div className="button" ~onClick={sendForm}~>Subscribe</div> {/* **WRONG:** before hydration, a div has no handler and cannot submit the form */}
```

In local testing, the interface appears fully functional. But on a high-latency mobile connection, visitors tap the `<div>` prior to script hydration, producing zero network activity. To safeguard progressive enhancement, test your interface under real-world conditions. Disable JavaScript in browser developer settings or apply network throttling to verify that native submissions persist data correctly.

Remember: one unified form element, two distinct transport handlers. The browser dispatches submissions before hydration, while React coordinates requests afterward. The identical Server Function executes on the backend in both cases.

---

## All 4 Principles Together

### The Complete Code

The database module, unchanged from Lesson 110:

```js title="src/db.js"
const subscribers = [];

export const db = {
  subscribers: {
    async add(email) {
      subscribers.push(email);
    },
  },
};
```

The actions file holds the Server Function, which now reads the email from the form data:

```js title="src/actions.js"
~'use server'~; // Every export becomes a Server Function

import { db } from './db';

export async function subscribe(~formData~) { // Principle 2: the form passes its FormData
  const email = formData.get('email');
  await db.subscribers.add(email);
}
```

The newsletter component is now a Server Component that renders a real form:

```jsx title="src/SubscribeBox.jsx"
import { subscribe } from './actions';

export default function ~SubscribeBox~() { // No directive: a Server Component
  return (
    <section>
      <h2>Get new posts by email</h2>
      <form ~action={subscribe}~> {/* Principles 3 and 4: the browser sends it before hydration, React after */}
        <label>
          Your email
          <input ~name="email"~ /> {/* Principle 3: without a name, no email is sent */}
        </label>
        <button type="submit">Subscribe</button>
      </form>
    </section>
  );
}
```

The root component renders the post and the form without modifications:

```jsx title="src/App.jsx"
import SubscribeBox from './SubscribeBox';

export default function ~App~() { // No directive: a Server Component
  return (
    <main>
      <h1>Park Opens Today</h1>
      <p>The city opened a new park on Main Street.</p>
      <SubscribeBox />
    </main>
  );
}
```

### The Order in Which Things Run

```tree dir=right caption="The order in which the components and the Server Function run, for a tap before hydration and for a tap after it."
From the server HTML to the saved email
- +1. On the server [`App` `SubscribeBox`] | The framework renders both **Server Components** to HTML | The form carries a **reference** to `subscribe`
- +2a. Tap before hydration | **The browser** sends a POST with `email` | The framework runs **`subscribe`**; the **page loads again**
- +2b. Tap after hydration | **React** sends a network request inside a **Transition** | `subscribe` runs; the **page stays** and the field **empties**
```

### Summary

| Aspect | What a Developer Might Expect | What React Does |
| :--- | :--- | :--- |
| **Page before hydration** | The form appears rendered, so it must be interactive | Only native HTML functions; custom `onClick` and `onSubmit` listeners do not exist yet |
| **Form with `onSubmit`** | Invokes `subscribe` on every user submission | Before hydration, the browser performs a GET request to the current URL, and `subscribe` never runs |
| **Parameter to `subscribe`** | Receives a primitive string, matching click handlers | Receives a `FormData` instance containing all named controls, read with `formData.get('email')` |
| **HTTP method** | Defaults to GET per HTML specification | Enforces POST automatically because a function is passed to the `action` attribute |
| **Form input configuration** | Requires state management with `value` and `onChange` | Requires only a `name` attribute; component remains an efficient Server Component |
| **Submission before hydration** | Fails without JavaScript runtime support | Browser dispatches a native POST request, server runs `subscribe`, and page refreshes |
| **Submission after hydration** | Requires separate client-side form logic | Identical form: React dispatches an asynchronous request within a Transition without reloading |

Remember the central principle of this lesson. **A form whose `action` is a Server Function works twice: before JavaScript loads, the browser sends it, and after hydration, React sends it.**

---

## For the Interview

> **The Interview Question:** How do forms work with Server Function actions, and what is progressive enhancement?

### How to Answer Clearly in 30 Seconds

"We pass a Server Function, exported from a `'use server'` file, directly to `<form action>`. When a user submits, React passes a `FormData` instance as the first argument, allowing the backend to read field values by `name`. The form benefits from progressive enhancement, executing reliably in two phases:
1. **Before client scripts download**, the form relies on native HTML. The browser issues an HTTP POST request with all named controls, the server executes the Server Function, and the document refreshes with updated output.
2. **Following hydration**, React intercepts submissions, transmitting form data via an asynchronous network request inside a Transition. The page remains stable without reloading, and uncontrolled inputs reset upon success.

The identical Server Function processes the submission on the server in both phases. Standalone buttons with `onClick` or forms wired to `onSubmit` fail silently prior to hydration."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"What payload does the browser transmit prior to script execution?"**
   A native HTTP POST request dispatched directly to the server. React automatically sets the method to POST whenever a function is assigned to `action`, overriding any conflicting `method` attribute. The payload encapsulates every enabled control declaring a `name`. Inputs lacking a `name` attribute are omitted entirely. Metadata not entered by users, such as record identifiers, should be passed via hidden inputs or bound using `bind`. Because client scripts have not executed, those attributes must exist directly in the initial HTML:

   ```jsx title="The ID of the post in a hidden field"
   <input ~type="hidden"~ name="postId" value={postId} /> {/* The browser sends postId with the email, even before hydration */}
   ```

   Following the POST request, the browser renders the server response, remaining by default at the current URL.

2. **"Why avoid using `onSubmit` with `e.preventDefault()` to call the Server Function?"**
   Because event listeners are registered only after client hydration. If a user submits before scripts load, the browser executes its default action: dispatching a GET request to the current URL with query parameters. The Server Function never runs. Official React documentation notes that form `action` supports Server Functions, which `onSubmit` cannot handle. With `action`, React automatically suppresses reloads and coordinates Transitions after hydration, while preserving native HTML submission before scripts load.

3. **"Can the interface display server feedback or loading indicators before JavaScript loads?"**
   Not with a bare Server Function action alone. Returning server validation messages requires `useActionState` (Lesson 113), while pending state indicators require `useFormStatus` (Lesson 114). With `useActionState`, React can display server feedback even when submitted prior to hydration. It also queues and replays submissions initiated during hydration (Lesson 137). Its `permalink` argument designates the target URL when submitting without JavaScript. Because any client can dispatch an arbitrary HTTP POST request, Server Functions must always validate incoming `FormData` as untrusted input on the server (Lessons 130 and 162).

```tree dir=right caption="Interview comparison: one form, two senders, the same Server Function."
A form with `action={subscribe}`
- +Before hydration [The browser] | Sends a **POST** with every named field | The server runs `subscribe`; the **page loads again**
- +After hydration [React] | Sends a **network request** inside a Transition | The server runs `subscribe`; the **page stays** and the fields **reset**
```
