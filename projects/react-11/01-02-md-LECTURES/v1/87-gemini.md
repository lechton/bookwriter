# Lecture 87: How a Test Clicks Follow the Way a User Does

*(How do you check in code that a button still works after every change?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | How do you test React components the way a reader uses them?

---

## VS | Calling the Reducer vs. Clicking the Button: both tests pass today, only the click test notices a broken button

> You already know how to test a button by hand: you open the page, click `Follow`, and check whether the label turns into `Following`. **An automated component test repeats those physical steps in code: mounting the component on an in-memory page, clicking the button, and reading the text on the screen**. By testing what the user actually sees rather than the internal state or reducer, the test fails only when the button genuinely breaks for a real person.

In a real application, code changes constantly. A teammate updates a stylesheet, restructures component state, or applies an urgent bug fix. After every edit, someone must verify that critical buttons still work. Nobody wants to click through every screen by hand after every code change. To solve this, developers write an automated **test**: a script that runs code and asserts that it produces the intended result.

Consider the simplest possible function. A utility named `add` sums two numbers, so `add(2, 3)` must return 5. Here is the test:

```js title="The smallest test"
expect(~add(2, 3)~).toBe(5); // Passes when add returns 5, fails when it returns anything else
```

> [!DEFINITION]
> **What is a test?** [NEW] A test is an automated program that executes code and verifies the outcome against expected values.
> An assertion like `expect(add(2, 3)).toBe(5)` reads like an English sentence: you pass the actual output to `expect` and the target value to `toBe`.
> When the received value matches the target, the test **passes**. When they differ, the test **fails**, and the test runner prints both values side by side in the terminal.
> Running automated tests after every code change catches regressions early, long before flawed code reaches real users (Lesson 87).

### The Follow button on a profile card

Consider a profile card on a social network. When the page first loads, the card displays the user name John and an interactive button labeled `Follow`:

```page width=text caption="John's profile card when the page opens: the button reads Follow."
heading: John
line: [Follow]
```

When someone clicks `Follow`, the button text changes to `Following`:

```page width=text caption="The same card after the user clicks Follow: the button reads Following."
heading: John
line: [Following] | good
```

That single interaction represents the entire feature: one click changes the button label from `Follow` to `Following`. Our goal is to verify this exact interaction through an automated test.

### Back to plain JavaScript: grab, click, read

Think about how you test a button in plain JavaScript inside the browser Console. You select the element, trigger a click programmatically, and read its text content:

```js title="Plain JavaScript in the Console"
const button = ~document.querySelector('button')~; // Grab the button
button.click(); // Click it from code, as if the user did
console.log(button.textContent); // Read the word on it, and look at it with your own eyes
```

A React component test performs those exact three steps. Only the tooling names change:

```jsx title="A component test of the Follow button"
render(<FollowCard />); // 1. Put the card on a page
const button = ~screen.getByRole('button', { name: 'Follow' })~; // 2. Grab the button that reads Follow
~fireEvent.click(button)~; // 3. Click it
expect(button.textContent).toBe('Following'); // 4. Check the word in code, instead of reading it by eye
```

Line by line:
1. **`render`** mounts the component. In the browser Console, the document already exists. Because a test executes in a terminal environment without an open browser window, `render` mounts the component into an in-memory document.
2. **`getByRole`** queries the element from the user perspective. Instead of matching internal CSS classes, it locates an accessible button labeled `Follow`.
3. **`fireEvent.click`** triggers the interaction. It dispatches a real click event directly to the button element.
4. **`expect`** verifies the final output. If the text content does not equal `Following`, the assertion throws an error and fails the test.

These four lines form the complete component click test. The rest of this lesson examines each line in detail.

### VS | The Reducer Test vs. the Click Test: one runs a function inside our code, the other does what the user does

The profile card manages its state with a reducer:

> [!DEFINITION]
> **What is a reducer?** [REVIEW] A reducer is a plain function that takes the current value and an action, and returns the next value.
> Our card's reducer is `followReducer`. While the user does not follow John, the value is `false`. `followReducer(false, { type: 'follow' })` returns `true`.
> The component never changes the value itself. A click calls `dispatch` with an action, and React hands that action to the reducer (Lesson 27).

This design introduces an alternative way to test the feature. You could skip the button entirely and invoke the reducer function directly:

```jsx title="The reducer test"
expect(~followReducer(false, { type: 'follow' })~).toBe(true); // Passes: the reducer returns true
```

When the card works correctly, both the reducer test and the component click test pass. Seeing two green checkmarks can lead developers to assume that both tests provide identical guarantees.

They appear similar on the surface, but they test entirely different things. The reducer test checks a single isolated helper function. The click test replicates what a human user experiences: finding the button by its visible label, clicking it, and reading the resulting text.

Now imagine a teammate accidentally alters the button so that clicking it dispatches the wrong action. The reducer function itself remains bug-free, so the reducer test continues to pass. But when a real user clicks `Follow`, nothing changes on screen, causing the click test to fail. **Only the click test catches what the user actually experiences.**

```tree caption="Two tests for the same Follow button: one calls the reducer, one clicks the button the way the user does."
Two tests for the same Follow button
- !The reducer test [`followReducer` `toBe`] | Runs **one function** inside our code | Still passes when the **button sends the wrong action**
- +The click test [`render` `getByRole` `fireEvent.click`] | Finds, clicks, and reads the button **as the user does** | Fails exactly when **the user sees no change**
```

### The Rule of Thumb: does the user see it?

**Test what the user does, and check what the user sees. Never check the state, the reducer, or a class name, because no user ever sees them.**

Testing internal details leads to a test suite that produces wrong answers in both directions:
1. A teammate accidentally dispatches the wrong action in `onClick`. A visitor clicks `Follow`, and the label stubbornly remains `Follow`.
2. The reducer test passes, allowing a severe visual defect to reach production.
3. Later, the team simplifies the component by replacing `useReducer` with `useState`. The button functions identically on screen. Yet the reducer test fails immediately because `followReducer` was deleted.

The reducer test passes when the button is broken, and fails when the button is completely healthy.

Senior developers actively avoid three widespread testing mistakes:
1. **Testing only isolated internal logic**, such as a reducer, while blindly assuming the interactive button triggers it correctly.
2. **Selecting elements through CSS classes**, such as `follow-btn`, which remain invisible to real users and assistive software.
3. **Assuming that asserting on internal state is more precise.** State is merely a mechanism to produce output. Real users only interact with rendered text and DOM controls.

### Three kinds of tests you will meet at work

1. **A component test with React Testing Library.** It renders the component in an in-memory DOM, triggers user events, and reads the screen. This is the click test built throughout this lesson. The official React documentation recommends this library because it tests components in a realistic environment. MDN refers to these as **unit tests** for React components.
2. **An isolated reducer test.** The official React documentation notes that asserting on initial states and actions in isolation can be helpful for complex update algorithms with dozens of branches. It complements component tests but never replaces them. Because our card uses only two simple actions, an isolated reducer test is redundant.
3. **An end-to-end test in a real browser.** It boots the complete application in a browser automation harness and simulates complex user journeys across multiple pages. The React documentation describes this as continuous end-to-end testing. This lesson focuses on component tests.

## SECTION | A Profile Card with a Follow Button

This entire lesson revolves around testing a single profile card. The project is created with Vite (Lesson 07). In addition to React and Vite, the setup installs three testing packages: `vitest`, `jsdom`, and React Testing Library. Principle 1 details what each tool does. The test file lives directly alongside the component it tests:

```files title="profile-card: File Explorer" caption="The files of the profile card project, with the test file next to the card it tests."
index.html | entry | The HTML page with the empty root div where React mounts
package.json | scripts | Holds the `"test": "vitest"` script that runs every test file
vite.config.js | config | Names `jsdom` as the test environment
src/
  main.jsx | boundary | Mounts `<App />` into `#root`, unchanged from the Vite template
  App.jsx | parent | Renders `<FollowCard />`
  FollowCard.jsx | default export | Exports `FollowCard` as default and `followReducer` by name
  FollowCard.test.jsx | test | Imports `FollowCard` and checks what the user sees
```

The card begins by managing its state with `useReducer`. The class `follow-btn` provides its visual presentation:

```jsx title="src/FollowCard.jsx"
import { useReducer } from 'react';

export function ~followReducer~(following, action) { // Exported by name, so a test file can import it
  switch (action.type) {
    case 'follow':
      return true;
    case 'unfollow':
      return false;
    default:
      return following;
  }
}

export default function FollowCard() {
  const [following, dispatch] = useReducer(followReducer, false);
  return (
    <section>
      <h2>John</h2>
      <button className="follow-btn" onClick={() => dispatch({ type: ~following ? 'unfollow' : 'follow'~ })}> {/* The first click sends follow */}
        {following ? 'Following' : 'Follow'}
      </button>
    </section>
  );
}
```

Now we will test this component and intentionally break it. Each principle introduces one line of the click test, showing why it is necessary and what fails without it:

**PRINCIPLES:** A resilient component test follows the path of a real user: mounting the page, finding the button, clicking it, and asserting on the updated text. Five principles follow:
1. **Principle 1: `render` mounts the component into an in-memory document.** Tests execute inside Node without an active browser tab. jsdom supplies a simulated `document`, and `render` mounts the component onto it.
2. **Principle 2: `getByRole` locates an authentic interactive control by its accessible name.** CSS classes remain invisible to users, and class selectors will still match elements that are no longer accessible buttons.
3. **Principle 3: `fireEvent.click` dispatches the click, and the next line verifies the updated label.** The test checks what appears on screen, never internal state variables.
4. **Principle 4: An isolated reducer test inspects the function, never the button.** When the button dispatches an invalid action, the reducer test continues to pass.
5. **Principle 5: Component tests survive internal refactors.** When replacing `useReducer` with `useState`, the click test passes without modification, whereas reducer tests fail despite working software.

---

## PRINCIPLE | `render`: the component appears on a page in memory, and no browser opens

> [!PRINCIPLE]
> **Principle 1: The Test Page: `render` Puts the Component on a Page in Memory**
>
> *Put the component on the page of the test with `render` from React Testing Library, then check one thing the user would see.*
>
> A test runs in the terminal, in Node, and no browser opens. jsdom gives the test a `document` that lives only in memory, and `render` puts one component on it. Nothing else of the app runs, so a test without `render` looks at an empty page and finds no button.
>
> **DO THIS:**
> ```jsx
> it('shows Follow at first', () => {
>   ~render(<FollowCard />)~; // The card is now on the page of the test
>   expect(screen.getByRole('button').textContent).toBe('Follow');
> });
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> it('shows Follow at first', () => {
>   expect(~screen.getByRole('button')~.textContent).toBe('Follow'); // **WRONG:** no render, so the page is empty and no button is found
> });
> ```

### The shortest test that passes

Here is the most concise test for our profile card. It asserts on the initial visual state of the component: verifying that the button initially displays `Follow`.

```jsx title="src/FollowCard.test.jsx"
import { expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import FollowCard from './FollowCard';

~it~('shows Follow at first', () => { // One test: its name, then its code
  ~render(<FollowCard />)~; // Puts the card on the page of the test
  expect(screen.getByRole('button').textContent).toBe('Follow'); // The one button reads Follow
});
```

These utilities come from two distinct testing libraries:
1. **`it`, `expect`, and `toBe` come from Vitest.** The `it` function defines a test case with a descriptive title and an execution block. `expect` combined with `toBe` creates the assertion.
2. **`render` and `screen` come from React Testing Library.** The `render` utility mounts JSX into the document. The `screen` object provides query methods to locate rendered elements.

> [!DEFINITION]
> **What is a testing framework?** [NEW] A testing framework is the tool that finds your test files and runs them. Vitest is one.
> MDN says that "the testing framework Vitest is built on top of Vite", so it reads the same config as our Vite app. Jest is the other testing framework that MDN names.
> Vitest finds a test file by its ending, `.test.jsx`. The file sits next to `FollowCard.jsx`, as in MDN's example (Lesson 87).

### Running the test: the terminal answers, no browser opens

The project configuration defines a dedicated npm script to trigger test runs:

```json title="package.json"
{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  }
}
```

When you execute `npm run test` in your terminal, no browser window appears. Instead, the test runner outputs its report directly to stdout:

```text title="Terminal: npm run test"
 ✓ src/FollowCard.test.jsx (1 test) 22ms
   ✓ shows Follow at first 22ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  06:48:22
   Duration  440ms

 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

1. The first checkmark lists the test suite file and counts its tests. The second checkmark confirms that the specific test passed.
2. The summary aggregates passed suites and tests, reporting start time and overall duration.
3. Vitest remains active in watch mode. It monitors files and re-runs relevant suites whenever you save a change. Press `q` to exit.

### Where the page comes from: jsdom

The test imports the exact same `FollowCard` component used in the production application. But the environment where it mounts is completely different.

In production, a web browser paints layout onto a physical display for human eyes. During a test, no pixels are drawn. The DOM tree exists purely in system memory, allowing the test script to inspect it.

Why is an in-memory document necessary? In the browser Console, the global `document` is provided automatically. But Vitest executes test scripts inside Node, a runtime that has no `window` or `document` objects.

To bridge this gap, the Vite configuration declares **jsdom** as the testing environment:

```js title="vite.config.js"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: { ~environment: 'jsdom'~ }, // Gives every test a page document inside Node
});
```

> [!DEFINITION]
> **What is jsdom?** [NEW] jsdom is a package that builds a fake browser page inside Node: a `document` with a `body`, elements, and events, but no screen.
> Your test can grab elements, click them, and read their text, exactly as in the browser Console.
> Vitest reads `environment: 'jsdom'` from the Vite config by itself, and gives every test that `document` before the test runs. The example projects on react.dev name jsdom too, in their test script `react-scripts test --env=jsdom` (Lesson 87).

When you run `npm run test`, the execution sequence unfolds across four distinct stages:
1. Vitest discovers the test file and launches it inside Node.
2. The jsdom package initializes a global virtual `document` object.
3. Calling `render` mounts `<FollowCard />` into that virtual document, creating the heading and the button element.
4. The query `screen.getByRole('button')` searches the virtual document, allowing the test to assert on `textContent` directly.

No other application code runs during this test. The entry file and parent wrappers are never evaluated. The virtual document contains only the isolated component tree passed to `render`.

```tree dir=right caption="Where the card lives during a test: Vitest runs the file in Node, jsdom gives it a page, and render puts the card on that page."
How `FollowCard` reaches the page of the test
- +1. Vitest [`npm run test`] | Finds `FollowCard.test.jsx` | Runs it in **Node**, with **no browser**
- +2. jsdom [`environment: 'jsdom'`] | Gives the test a **page `document`** | The page lives **only in memory**
- +3. React Testing Library [`render`] | Puts **`FollowCard`** on that page | The test can now **find and click** it
```

### Why `render`, and not a `<div>` we build ourselves

Without helper libraries, manual test setups must construct the DOM container by hand. You would have to create a wrapper element, append it to `document.body`, and initialize a React root.

The React documentation highlights a subtle pitfall in manual setups: event dispatching requires the container element to be explicitly attached to the document. Omitting that step causes simulated events to fail silently.

React Testing Library automates this container management. Calling `render` attaches the container to `document.body` and schedules cleanup after every test, preventing leaked DOM elements from polluting subsequent runs.

A common beginner mistake is omitting `render` altogether. Because tests do not launch the full application, an unrendered test inspects an empty document. Every element query fails immediately because the DOM contains nothing to query.

---

## PRINCIPLE | `getByRole('button', { name: 'Follow' })`: the test finds only a real button with the word Follow

> [!PRINCIPLE]
> **Principle 2: Role and Name: Find Elements the Way a User Does**
>
> *Find an element with `getByRole` and its accessible name, such as `screen.getByRole('button', { name: 'Follow' })`, never by a class name.*
>
> A user meets a button and the word on it. A class name is invisible to every user, so a test that grabs the element by its class keeps passing after the element stops being a real button. `getByRole` looks for the role and the name that a screen reader announces. It fails when the control is a `<div>`, or when a button has no name: the same two problems that a keyboard user or a screen reader user meets.
>
> **DO THIS:**
> ```jsx
> const button = ~screen.getByRole('button', { name: 'Follow' })~; // Fails if the element is not a real button named Follow
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const button = ~document.querySelector('.follow-btn')~; // **WRONG:** still finds the element after it becomes a div that no keyboard user can press
> ```

### Two ways to grab the same button

Before a test can click a button, it must locate that button in the document. Consider two different approaches:

```jsx title="Grabbing the button by its class, and by its role and name"
document.querySelector(~'.follow-btn'~); // 1. By the class name in our JSX
screen.getByRole(~'button', { name: 'Follow' }~); // 2. By what the user meets: a button with the word Follow
```

The first line uses standard DOM querying to match a CSS class selector. That class name is an internal implementation detail, visible only to engineers inspecting source code.

The second line searches for what a human actually encounters: an element with the semantic role of `button` and the accessible text name `Follow`.

On a properly written component, both queries return the same button node. But the querying strategy itself acts as an implicit assertion. Using `getByRole` validates that the element is an accessible button bearing the text `Follow`, whereas a class selector verifies neither.

### Role and accessible name: what a screen reader says out loud

Both concepts originate from accessibility specifications highlighted by MDN:
1. **An accessible role communicates what an element is.** An HTML `<button>` implicitly possesses the `button` role without requiring explicit attributes. A plain `<div>` possesses no interactive role.
2. **An accessible name provides the label for the element.** Assistive technologies announce this name to users. Because our button contains the text string `Follow`, its accessible name is `Follow`.

Browsers construct an **accessibility tree** from DOM nodes, assigning each item an accessible role and name. Screen readers vocalize these exact properties when users navigate (Lesson 52). Because `getByRole` inspects that exact tree, your test queries the interface exactly as assistive tools do.

```tree caption="Two ways to grab the Follow button: by the class only the developer sees, or by the role and name the user meets."
Two ways to grab the Follow button
- !By class name [`querySelector` `'.follow-btn'`] | Looks for a **class in our JSX** | No user ever **sees a class**
- +By role and name [`getByRole` `'button'` `name: 'Follow'`] | Looks for **a button with the word Follow** | The same two things a **screen reader announces**
```

### The restyle that keeps the class and loses the button

Relying on class selectors creates fragile tests that pass even when accessibility breaks. Here is a common real-world defect:

Suppose a teammate restyles the component and replaces the semantic `<button>` tag with a `<div>`. The class name and click handler remain in place:

```jsx title="src/FollowCard.jsx" startLine="19"
      <~div~ className="follow-btn" onClick={() => dispatch({ type: following ? 'unfollow' : 'follow' })}> {/* **WRONG:** styled like a button, but it is not one */}
        {following ? 'Following' : 'Follow'}
      </div>
```

Because the stylesheet targets `.follow-btn`, the visual styling looks unchanged on screen. But the browser DOM reveals a critical defect:

::: row caption="The same card with a real button and with a div: the page looks the same, and the Elements panel shows what changed."
::: col title="A button with the class follow-btn" tag="a real button" tone=good
```page size=mini
heading: John
line: [Follow] | good
```
```dom title="Elements panel"
<section>
  <h2>John</h2>
+ <button class="follow-btn">Follow</button>
</section>
```
:::
::: col title="A div with the class follow-btn" tag="looks like a button" tone=bad
```page size=mini
heading: John
line: [Follow] | bad
```
```dom title="Elements panel"
<section>
  <h2>John</h2>
! <div class="follow-btn">Follow</div>
</section>
```
:::
:::

When using a `<div>`, the class-based test passes while the role-based test catches the failure:
1. Sighted mouse users can still click the element, triggering the visual transition to `Following`.
2. A test using `querySelector` matches the class, triggers a click, and passes successfully.
3. Keyboard users cannot navigate to the element using Tab or activate it using Enter. As MDN documents, interactive controls must be focusable and respond to keyboard triggers, behaviors that a generic `<div>` completely lacks.
4. Screen readers fail to announce the element as an interactive button because generic containers possess no button role.
5. The query `screen.getByRole` searches for an accessible button named `Follow`, finds none, and throws a clear error:

```text title="Terminal: the test with getByRole on the card with a div"
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name "Follow"
```

### An icon button with no name

The `getByRole` query also catches buttons that lack accessible text. Consider an icon button displaying a visual plus sign without text labels:

```jsx title="An icon button with no text"
~<button>~ {/* **WRONG:** no text, so the button has no accessible name */}
  <img src="/plus.svg" alt="" />
</button>
```

A test querying for a button named `Follow` fails immediately on this element. As MDN emphasizes, all interactive buttons require an accessible name so assistive tools can inform users of their purpose.

Adding an `aria-label` attribute resolves this issue for icon buttons lacking visible text (Lesson 83):

```jsx title="An icon button with aria-label"
<button ~aria-label="Follow"~> {/* The accessible name is now Follow */}
  <img src="/plus.svg" alt="" />
</button>
```

With that attribute added, both the automated test and screen readers receive the accessible name `Follow`. Writing tests against accessible roles ensures that your testing suite champions accessibility by design.

---

## PRINCIPLE | `fireEvent.click`: a real click event, and the very next line already reads `Following`

> [!PRINCIPLE]
> **Principle 3: Arrange, Act, Assert: Click, Then Read the Screen**
>
> *Act as the user does with `fireEvent.click(button)`, then assert on what the user now sees, such as `button.textContent`.*
>
> `fireEvent.click` sends a real click event to the button, so our `onClick` runs as it does for a user. The helpers of React Testing Library are wrapped with `act()`, so the page is already updated on the next line. The test checks the word on the button. The state is only one way the code gets there, and the user never sees it.
>
> **DO THIS:**
> ```jsx
> fireEvent.click(button);
> expect(~button.textContent~).toBe('Following'); // Checks the word the user sees
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> const card = ~ReactTestRenderer.create(<FollowCard />)~; // **WRONG:** deprecated in React 19, and it reads React's insides instead of the page
> ```

### Arrange, act, assert

The test in Principle 1 examined the card before user interaction. Now we automate the click:

```jsx title="src/FollowCard.test.jsx"
import { expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FollowCard from './FollowCard';

it('shows Following after a click on Follow', () => {
  render(<FollowCard />); // Arrange: the card is on the page
  const button = screen.getByRole('button', { name: 'Follow' }); // Arrange: the button that reads Follow
  ~fireEvent.click(button)~; // Act: the click of the user
  expect(~button.textContent~).toBe('Following'); // Assert: the word the user now sees
});
```

This single test replaces the static check from Principle 1 because it verifies initial conditions as part of its setup. If the button did not initially read `Follow`, the query `getByRole` would fail before the click ever runs.

The utility `fireEvent.click` dispatches an authentic DOM click event to the target element. As the React documentation explains, `fireEvent` does not merely invoke the component handler directly. It dispatches a genuine DOM event that bubbles naturally through the container.

This sequence implements the classic **Arrange, Act, Assert** testing pattern:
1. **Arrange**: `render` mounts the component into the virtual document, and `getByRole` locates the button.
2. **Act**: `fireEvent.click` dispatches the user interaction.
3. **Assert**: `expect` verifies the resulting DOM state by asserting on `textContent`.

```tree dir=right caption="The three parts of the click test: arrange the page, act as the user, assert what the user sees."
The click test in three parts
- +Arrange [`render` `getByRole`] | Puts the card on the page | Grabs the **button named Follow**
- +Act [`fireEvent.click`] | Sends **a real click event** to the button | Our `onClick` runs
- +Assert [`expect` `toBe`] | Reads **`button.textContent`** | Passes only when the user would see **Following**
```

### Why the next line already reads Following

Notice that the assertion reads the updated string `Following` on the very line after the click, without needing manual delays. The entire update lifecycle completes synchronously inside `fireEvent.click`:
1. `fireEvent.click` dispatches a DOM click event directly to the button element.
2. React invokes the component click handler, which calls `dispatch` with the follow action. The reducer calculates the next state as `true`.
3. React Testing Library executes event helpers inside `act()`. This wrapper forces React to flush state updates and virtual DOM re-renders synchronously before `fireEvent.click` returns (Lesson 88).
4. During re-rendering, React evaluates the conditional ternary and preserves the existing button node while updating its child text to `Following` (Lesson 77).
5. The variable `button` still references that same DOM node, allowing the next line to inspect its updated text immediately.

Because step 4 changes the accessible name to `Following`, a subsequent query for a button named `Follow` would fail. Storing the matched node in the `button` variable allows the test to observe its text transition directly.

### Check the word, not the state

The test asserts on the visible text `Following`. It avoids checking whether internal state equals `true`.

Developers new to component testing often seek ways to inspect internal state variables. But the official React documentation intentionally provides no mechanism for tests to read component state.

Legacy inspection utilities like `react-test-renderer` are deprecated in React 19. The React team explains that inspecting internal component fibers encourages coupling tests to implementation details rather than real user environments.

Most importantly, users never interact with state variables. A user reads the word `Following` on the button. Verifying that rendered label directly tests what actually matters.

---

## PRINCIPLE | `followReducer` in a test: it checks the reducer, never the button

> [!PRINCIPLE]
> **Principle 4: Implementation Details: A Reducer Test Misses a Broken Button**
>
> *Test the component through the page with a click; a test that calls the reducer checks only the reducer.*
>
> The reducer and its actions are implementation details: the user never sees them. A test that calls `followReducer` passes even when the button sends the wrong action, because it never goes through `onClick`. The click test goes through the button, the action, and the reducer, so it fails exactly when the user clicks `Follow` and nothing happens.
>
> **DO THIS:**
> ```jsx
> render(<FollowCard />);
> const button = screen.getByRole('button', { name: 'Follow' });
> ~fireEvent.click(button)~; // Goes through onClick, the action, and the reducer
> expect(button.textContent).toBe('Following');
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> expect(~followReducer(false, { type: 'follow' })~).toBe(true); // **WRONG:** as the only test, it passes while the button sends unfollow
> ```

### Both tests in one file

We can place both testing strategies side by side in our test suite:

```jsx title="src/FollowCard.test.jsx"
import { expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FollowCard, { ~followReducer~ } from './FollowCard'; // The default export and the named export

it('returns true for the follow action', () => {
  expect(~followReducer(false, { type: 'follow' })~).toBe(true); // Calls the reducer directly
});

it('shows Following after a click on Follow', () => {
  render(<FollowCard />);
  const button = screen.getByRole('button', { name: 'Follow' });
  ~fireEvent.click(button)~; // Goes through the onClick of the button
  expect(button.textContent).toBe('Following');
});
```

To test `followReducer` directly, the component file must export it alongside the default component export (Lesson 05). The component itself does not need this export; it exists solely to expose private internals to the test.

When the component is written correctly, both tests pass with flying colors.

### The wrong action in onClick

Testing reducers in isolation introduces false confidence. If the button dispatches the wrong action, the reducer test continues to pass while the UI breaks.

Suppose a teammate updates the button but mistakenly hardcodes an unfollow action into the click handler:

```jsx title="src/FollowCard.jsx" startLine="19"
      <button className="follow-btn" onClick={() => dispatch({ type: ~'unfollow'~ })}> {/* **WRONG:** every click sends unfollow */}
```

When a user clicks `Follow`, the button stays unchanged:

```page width=text caption="The card with the wrong action, after the user clicks Follow: the button still reads Follow."
heading: John
line: [Follow] | bad
```

Notice how each test responds to this bug:
1. The reducer test passes. It invokes `followReducer` directly with a follow action and receives `true`. It has no knowledge of what the button handler actually dispatches.
2. The click test clicks the physical button. The button dispatches `unfollow`, leaving state as `false`.
3. The click test expects `Following` but finds `Follow`, failing with a clear error report:

```text title="Terminal: npm run test on the card with the wrong action"
 ❯ src/FollowCard.test.jsx (2 tests | 1 failed) 24ms
   ✓ returns true for the follow action 1ms
   × shows Following after a click on Follow 23ms

 FAIL  src/FollowCard.test.jsx > shows Following after a click on Follow
AssertionError: expected 'Follow' to be 'Following' // Object.is equality

Expected: "Following"
Received: "Follow"

 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
```

When the card worked, both tests passed, creating the illusion of equal protection. Under a real defect, their value diverges.

The reducer test only confirms that a standalone function computes values correctly. It cannot verify that handlers dispatch the right actions or that JSX displays the result. Only the click test validates the complete interaction.

```tree caption="On the card with the wrong action, the reducer test still passes and the click test fails."
The two tests on the card with the wrong action
- !The reducer test [`followReducer` `type: 'follow'`] | Calls the reducer with **the right action itself** | **Passes**: the button is never touched
- +The click test [`fireEvent.click`] | Clicks the button, which **sends unfollow** | **Fails**: the button still reads **Follow**
```

### Implementation details

> [!DEFINITION]
> **What is an implementation detail?** [NEW] An implementation detail is a part of your code that decides how the component works inside, and that the user never sees.
> On our card, the reducer and its actions are implementation details. The user sees only the button and its word.
> react.dev uses the phrase to explain why `react-test-renderer` is deprecated: it "promotes testing implementation details" (Lesson 87).

A test targeted at implementation details proves that an internal part works in isolation. It cannot guarantee that those parts integrate properly to serve the user.

This explains how critical defects slip into production:
1. A team reads that reducers are pure functions that can be tested in isolation.
2. The team relies exclusively on reducer tests and writes no component click tests.
3. A developer introduces a typo in the button click handler.
4. Every test suite in CI passes green, and the defect deploys to production.
5. Real users discover that clicking `Follow` does nothing.

The official React documentation notes that while isolated reducer tests can be useful for intricate branching logic, testing components in realistic environments is generally best. Reducer tests complement click tests; they never substitute for them.

---

## PRINCIPLE | The click test: it still passes after `useReducer` becomes `useState`

> [!PRINCIPLE]
> **Principle 5: Refactors: A Test of the Screen Survives a Change of Code**
>
> *Write tests that fail only when the user would see something different, so a refactor that keeps the screen the same keeps every test passing.*
>
> Changing `useReducer` to `useState` is a refactor: the card shows `Follow`, then `Following`, as before. The click test reads only the page, so it passes unchanged. A test tied to `followReducer` fails, though nothing is broken. Rewriting that test to match the new code makes the tests follow the code instead of the user.
>
> **DO THIS:**
> ```jsx
> fireEvent.click(button);
> expect(~button.textContent~).toBe('Following'); // Passes with useReducer and with useState
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> import { ~followReducer~ } from './FollowCard'; // **WRONG:** ties the test to one way of keeping state; it fails after the refactor to useState
> ```

### The same card with `useReducer` and with `useState`

Later in development, a team member realizes that managing a simple boolean with a reducer is unnecessary overhead. They refactor the card to use `useState` (Lesson 12).

> [!DEFINITION]
> **What is a refactor?** [NEW] A refactor is a change to how the code is written that does not change what it does.
> The user sees the same page before and after. Only the code inside is different.
> react.dev says that "refactoring state is a part of the process" (Lesson 87).

Only two lines of code change: the state initialization and the button click handler. Notice the state declaration before and after:

```jsx title="The line that keeps following: with useReducer and with useState"
const [following, dispatch] = ~useReducer(followReducer, false)~; // Before: the click sends an action to followReducer
const [following, setFollowing] = ~useState(false)~; // After: the click sets the next value itself
```

Here is the complete component following the refactor:

```jsx title="src/FollowCard.jsx"
import { useState } from 'react';

export default function FollowCard() {
  const [following, setFollowing] = ~useState(false)~; // followReducer is gone
  return (
    <section>
      <h2>John</h2>
      <button className="follow-btn" onClick={() => ~setFollowing(!following)~}> {/* Flips false to true, and true to false */}
        {following ? 'Following' : 'Follow'}
      </button>
    </section>
  );
}
```

From the perspective of a user, the experience is identical. The React documentation affirms that `useState` and `useReducer` are interchangeable state representations. The button displays `Follow`, and clicking it flips the label to `Following`.

From the perspective of the test suite, however, the results differ sharply:
1. **The click test passes without changing a single line of test code.** It observes only the rendered DOM, and the DOM behavior remains identical.
2. **The reducer test crashes.** It attempts to import `followReducer`, which no longer exists in the file.

```tree caption="After the refactor from useReducer to useState, the user sees the same card, the click test passes, and the reducer test fails."
The card after `useReducer` becomes `useState`
- +The user [`Follow` `Following`] | Sees **the same card** | The click works **as before**
- +The click test [`getByRole` `fireEvent.click`] | Reads **only the page** | **Passes** with no line changed
- !The reducer test [`followReducer`] | Reads **a name inside our file** | **Fails**, though **nothing is broken**
```

### The rewrite that hides the next bug

When an internal refactor breaks tests, teams suffer more than temporary annoyance. It encourages bad testing habits that hide future regressions:
1. Tests are tightly coupled to private implementation details like reducers or state variables.
2. A developer performs a safe refactor to simplify internal code.
3. The application works perfectly in manual testing, but the test suite fails.
4. Developers adjust the tests to mirror the new implementation, training themselves to rewrite tests whenever code changes.
5. Over time, tests stop asserting on user requirements, allowing genuine bugs to pass unnoticed.

**A good component test fails only when the user would see something different.** When user-facing behavior remains stable, tests should pass without edits. Whether you split components, rename variables, or swap Hooks, click tests continue to safeguard user requirements.

---

## All 5 Principles Together

### The complete project

The complete testable project requires two configuration files, the component, and its test suite. The project script in `package.json` launches Vitest:

```json title="package.json"
{
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "vitest"
  }
}
```

The Vite configuration configures jsdom as the testing environment:

```js title="vite.config.js"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: { ~environment: 'jsdom'~ }, // Principle 1: jsdom gives every test a page document
});
```

The component implementation using `useState`:

```jsx title="src/FollowCard.jsx"
import { useState } from 'react';

export default function ~FollowCard~() { // React calls FollowCard once for render, and again after the click
  const [following, setFollowing] = useState(false);
  return (
    <section>
      <h2>John</h2>
      <button className="follow-btn" onClick={() => setFollowing(!following)}>
        {following ? 'Following' : 'Follow'}
      </button>
    </section>
  );
}
```

The component test that passes across both versions of the card:

```jsx title="src/FollowCard.test.jsx"
import { expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FollowCard from './FollowCard';

it('shows Following after a click on Follow', () => {
  ~render(<FollowCard />)~; // Principle 1: puts the card on the page of the test
  const button = ~screen.getByRole('button', { name: 'Follow' })~; // Principle 2: grabs a real button named Follow
  ~fireEvent.click(button)~; // Principle 3: a real click; the page updates before the next line
  expect(~button.textContent~).toBe('Following'); // Principles 4 and 5: checks the word the user sees
});
```

### What happens in one test run, in order

When you execute `npm run test`, Vitest runs the file and React executes `<FollowCard />` twice: once for the initial render, and again after the click.

```tree dir=right caption="The order of one test run: from npm run test to the word Following on the button."
One run of `npm run test`
- +1. Vitest [`npm run test`] | Finds `FollowCard.test.jsx` | Runs it in **Node**
- +2. jsdom [`environment: 'jsdom'`] | Gives the test **a page `document`**
- +3. `render` [`FollowCard`] | React **calls `FollowCard` the first time** | The button reads **Follow**
- +4. `getByRole` [`'button'` `name: 'Follow'`] | Finds **a real button** named **Follow**
- +5. `fireEvent.click` [`setFollowing`] | `onClick` runs | React **calls `FollowCard` again** and updates the text
- +6. `expect` [`button.textContent`] | Reads **Following** | The test **passes**
```

| Aspect | A Test Tied to the Code | A Test of What the User Sees |
| :--- | :--- | :--- |
| **Where it looks** | Expects the app to be open, and looks at an empty page when nothing was rendered | Runs in Node; jsdom gives it a page, and `render` puts the card on it |
| **How it grabs the button** | By a class such as `follow-btn`, which keeps passing after the button becomes a `<div>` | By role and name with `getByRole('button', { name: 'Follow' })` |
| **What it checks** | The state or the reducer, which the user never sees | The word on the button after `fireEvent.click`, `Following` |
| **The broken button** | Passes while the button sends `unfollow` | Fails, because the button still reads `Follow` |
| **The refactor to `useState`** | Fails, because `followReducer` is gone | Passes, because the page did not change |

Remember the core lesson of this chapter. **A component test does what the user does and checks what the user sees, failing only when something breaks for the user.**

---

## For the Interview

> **The Interview Question:** How do you test React components the way a reader uses them?

### How to Answer Clearly in 30 Seconds

"A component test does what the user does and checks what the user sees. It runs in Node through a testing framework like Vitest or Jest. jsdom supplies an in-memory document, and `render` from React Testing Library mounts the component onto that page. The test then executes three steps:
1. **Arrange**: render the component and query the element through its accessible role and name, such as `getByRole('button', { name: 'Follow' })`.
2. **Act**: dispatch user events with `fireEvent.click`. Because testing helpers wrap events in `act()`, React flushes state updates and re-renders synchronously before the next line runs.
3. **Assert**: verify what the user sees on screen, such as checking that `button.textContent` equals `Following`.

I avoid asserting on private state, reducers, or CSS classes. Those are implementation details. Testing them causes suites to fail during safe refactors while missing real user-facing bugs."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why not test the reducer or state directly? Isn't that more exact?"**
   No. An isolated reducer test proves that a function returns a value, but nothing more. If the button handler dispatches the wrong action or forgets to attach `onClick`, the reducer test still passes while the UI is broken. Testing state tests implementation mechanics rather than user outcomes. The official React documentation notes that reducer tests are helpful for complex algorithms, but emphasizes that testing components in realistic environments is best. Reducer tests complement component tests; they never replace them.
2. **"Why find elements by accessible role and name instead of CSS class selectors?"**
   Users never see CSS class names. If a teammate turns a `<button>` into a `<div>` with the same class, a class query passes even though keyboard and screen reader support are destroyed. Querying with `getByRole` targets the accessibility tree that assistive technology relies on. If an element lacks a semantic role or accessible label, the test fails, ensuring accessibility is validated automatically.
3. **"What happened to React's legacy test utilities in React 19, and what do you use instead?"**
   React removed nearly all legacy helpers from `react-dom/test-utils` except `act`, which moved to the core `react` package. The React team explained that older utilities encouraged tests to depend on low-level implementation details. Modern testing relies on `@testing-library/react` for `render` and `fireEvent`. Furthermore, `react-test-renderer` was deprecated because introspecting internal fiber structures couples tests to framework internals.

```tree dir=right caption="Interview comparison: a test that reads the insides of a component vs. a test that follows the user."
Two kinds of component tests in an interview
- !Reads the insides [`followReducer` `state` `.follow-btn`] | Checks **implementation details** | **Fails on refactors**, **passes on real bugs**
- +Follows the user [`render` `getByRole` `fireEvent.click`] | Checks **what the user sees** | Fails **only when the user would see a change**
```
