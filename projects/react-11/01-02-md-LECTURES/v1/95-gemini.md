# Lecture 95: What the React Lints Catch, and Why a Silenced Lint Still Ships the Bug

*(What does a React lint warn you about, and what happens when someone turns it off?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | What do the React Hooks and Compiler lint rules catch, and why should they never be disabled?

---

## VS | Changing the code vs. a suppression comment: both clear the warning, only the change removes the bug

> Your code editor can highlight syntax mistakes before you load the application in a browser. **The React lint rules flag every line that violates a core invariant of React, and each diagnostic warning predicts a defect users will encounter in production**. A suppression comment merely hides the warning message without correcting the code defect, while permanently blinding the linter to any future modifications on that line.

Start with standard JavaScript. When you declare a variable that is never referenced, static analysis detects the dead identifier:

```js title="Plain JavaScript: a variable nobody reads"
let ~total~ = 0; // ESLint underlines total: it is declared and never read
```

The tool responsible for this static analysis is ESLint. It parses your source files into syntax trees without executing them, validating every construct against a configured ruleset. This specific check is called `no-unused-vars`. In the React documentation, each individual rule verification is referred to as a lint.

Developers frequently discover an inline escape hatch. You can instruct ESLint to ignore a rule violation on a specific line using an inline comment:

```js title="Plain JavaScript: the same line with a suppression comment"
let total = 0; // eslint-disable-line no-unused-vars
```

The editor underline vanishes immediately. Look closely at the resulting program: the underlying code remains unchanged. The variable is still allocated in scope and still remains unread. The suppression comment fixed nothing. It only instructed ESLint to withhold its diagnostic warning.

React packages its custom static analysis rules inside `eslint-plugin-react-hooks`. These checks operate like standard JavaScript lints, but their runtime impact is vastly higher. An unused variable is benign dead code that rarely breaks an application. In contrast, violating a React invariant produces severe production bugs. A silenced React lint causes severe defects. It can trap a chat in the wrong room, recalculate timestamps on every keystroke, or crash the browser tab in an infinite loop.

> [!DEFINITION]
> **What is ESLint, and what is a lint?** [REVIEW] ESLint is a static analysis tool that inspects your source code in the editor and terminal without executing the application.
> 1. It parses JavaScript and JSX into syntax trees to verify code against a configured set of rules.
> 2. Each rule check is called a lint, designed to identify syntax errors, anti-patterns, or architectural defects.
> 3. Because these checks run as you type and during continuous integration, they catch bugs before any user loads the software (Lesson 82).

> [!DEFINITION]
> **What is a suppression comment?** [REVIEW] A suppression comment is an inline directive such as `// eslint-disable-line` that instructs the linter to bypass a specific check on that line.
> 1. Developers write these directives inline or on the preceding line using `eslint-disable-next-line`.
> 2. The directive modifies zero executable runtime code, meaning the underlying architectural defect remains active in the file.
> 3. Suppressing a check creates an unmonitored blind spot that conceals future errors introduced by later code changes (Lesson 36).

### The Same Comment in a Chat, a Month Later

Consider a real-time messaging application. When first deployed, the application features only a single channel named general alongside a welcome heading. An Effect manages the client connection to the chat server for that room.

During initial development, the linter instructed the engineer to include `roomId` inside the dependency array of the Effect. Because the application had only one room at launch, the engineer assumed the lint warning was unnecessary and added an inline suppression comment to keep an empty array.

A month later, a teammate implements a dropdown menu allowing users to choose different rooms. When a user selects travel, the page heading updates immediately. The underlying socket connection, however, remains trapped in the general channel:

```page width=text caption="The chat a month after it shipped: the user picked travel, the heading says travel, and the Console shows only connections to general."
form:
  select: Choose the chat room: | travel
heading: Welcome to the travel room!
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
```

The browser console reveals the actual lifecycle of the chat connection. The first three log entries occur during initial page mount in development, where Strict Mode mounts, unmounts, and remounts the component (Lesson 47). When the user selects travel, the console logs nothing new. The socket never disconnects from general, and never establishes a connection to travel.

The user interface now misrepresents application state. The heading announces one room, but the active network connection belongs to another. In a production messaging client, incoming and outgoing messages would continue flowing through general.

The teammate wrote completely valid React code, and the editor displayed zero warnings. The runtime bug stemmed entirely from the suppression comment committed a month earlier. Because that directive still covered the dependency line, the linter remained silenced and failed to warn the team that `roomId` now changes dynamically.

**Remember the central lesson of static analysis: each React lint warning identifies a concrete runtime defect. A suppression comment silences the warning without fixing the bug, and it keeps the linter blind to every subsequent modification on that line.**

### Five Lints, Five Bugs on the Page

Disabling a React lint rule leaves a corresponding defect in the application, producing bugs that users experience directly:
1. When disabling exhaustive dependencies, the heading displays the new room while the socket remains connected to the initial channel. Principle 2 explores this breakdown.
2. When bypassing rules of hooks, conditionally calling a Hook triggers a fatal runtime crash where React unmounts the tree with a hook count mismatch error (Lesson 38).
3. When ignoring set-state-in-render, calling a setter in the body triggers an infinite loop and crashes the browser with a re-render limit error (Lesson 80).
4. When disabling purity checks, reading non-deterministic functions during render produces unstable timestamps that change on incidental keystrokes, or freeze under the React Compiler (Lesson 63).
5. When suppressing ref checks, reading a mutable ref during render causes stale UI output because mutating ref current does not trigger a re-render (Lesson 30).

### The Rule of Thumb: to silence a lint, change the code

**When a React lint marks a line, the only legitimate solution is to refactor the code until the check passes. Never disable the lint rule.**

The React documentation emphasizes this principle across its guides. Regarding suppressions generally, the documentation states: "We recommend **never suppressing the linter**." Regarding Effect dependencies, it instructs: "To change the dependency list, change the code."

Resolving a lint diagnostic requires four methodical steps:
1. **Read the diagnostic report.** The message specifies the exact identifier or statement that violates React rules, such as `roomId`.
2. **Identify the runtime defect.** Trace how the violation breaks component behavior, such as a socket staying in the wrong room, an erratic timestamp, or an infinite render loop.
3. **Refactor the implementation.** Adjust the code to uphold the invariant by declaring dependencies, dispatching updates in event handlers, or reading external values in state initializers.
4. **Remove all suppression directives.** Keeping the line clean ensures the linter remains active to guide future engineers who edit that code.

In professional software development, teams generally adopt one of four approaches when encountering a lint report. Only the first approach is valid for every scenario:
1. **Refactor the code until the lint passes.** This is the correct response for every diagnostic warning.
2. **Keep the warning visible and resolve it later.** This approach applies to compiler-powered diagnostics in legacy codebases. The React documentation notes that the compiler skips optimizing components with violations, meaning teams do not need to resolve every warning immediately.
3. **Temporarily opt out a component using `"use no memo"`.** This fits an existing component that misbehaves when the compiler is introduced (Lesson 63). The documentation advises: "You should fix the underlying issue and remove the directive once resolved."
4. **Suppress the lint with an inline comment.** This is never an appropriate choice.

```tree caption="Four ways to answer a React lint report, and which ones fit."
Four ways to answer a React lint report
- +Change the code | Fits **every report** | The lint passes because **the bug is gone**
- +Leave the report visible | Fits a **compiler-powered report** in existing code | The team **still sees the line** it has to fix
- +Opt out with `"use no memo"` | Fits a component that **breaks under the compiler** | A **temporary** step, removed once the code is fixed
- !Suppress the lint | Fits **nothing** | The message is gone, **the bug stays**, and later edits get **no warning**
```

Experienced engineers recognize five common misconceptions regarding React static analysis:
1. **Treating React lints as cosmetic stylistic rules.** Unlike preferences for spacing or quotation marks, React lints enforce strict runtime invariants and prevent severe application crashes.
2. **Assuming a suppression directive only affects current code.** The comment remains permanently attached to the line, blinding the linter to subsequent breaking edits made by other contributors.
3. **Misinterpreting an empty dependency array as a run-once command.** Suppressing the linter to simulate a component mount lifecycle causes Effects to capture stale props and state (Lesson 35).
4. **Believing compiler lints only function with the React Compiler enabled.** The compiler-powered lint rules inspect render logic and detect violations even in projects where the compiler is not installed.
5. **Assuming compiler warnings require immediate code removal or rule deactivation.** The React Compiler automatically skips optimizing components with detected violations, allowing teams to address warnings incrementally without disabling the rule.

The remainder of this lesson constructs the chat room from scratch, activates the linter, demonstrates common failure patterns, and applies canonical solutions.

## SECTION | A Chat Room with a Room Picker

Our demonstration application is the chat room featured throughout the React documentation (Lessons 32 to 37). Professional engineers encounter `exhaustive-deps` most frequently on this exact pattern: an Effect maintaining an active server connection for whichever channel the user selects.

The socket connection is simulated. Following the pattern in the official documentation, the helper logs a message to the console when connecting, and another message when disconnecting:

```js title="src/chat.js"
export function createConnection(serverUrl, roomId) {
  return {
    ~connect~() { // For general, prints ✅ Connecting to "general" room at https://localhost:1234...
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    ~disconnect~() { // For general, prints ❌ Disconnected from "general" room at https://localhost:1234
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    },
  };
}
```

On day 1, the root component renders a single chat room:

```jsx title="src/App.jsx, day 1"
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  return <ChatRoom ~roomId="general"~ />; // The chat has one room on the day it ships
}
```

The project develops incrementally across our principles. Principle 1 establishes the ESLint configuration. Principle 2 writes the Effect in the chat room component, and then introduces the dropdown room picker. Principle 3 adds a message input and a connection timestamp. Here is the resulting file structure:

```files title="chat-room: File Explorer" caption="How the chat room project files sit in the project folder, in src/, and in src/components/."
eslint.config.js | lint config | Added in Principle 1: tells ESLint to read `.js` and `.jsx` files, and turns on the `recommended` preset of `eslint-plugin-react-hooks`
index.html | entry | The HTML page with the empty root div where React mounts
src/
  main.jsx | boundary | Imports `App` from `./App.jsx` and mounts it inside `<StrictMode>`
  chat.js | external helper | Exports `createConnection(serverUrl, roomId)` with `connect()` and `disconnect()`
  App.jsx | parent | Renders `ChatRoom`; on day 30, keeps `roomId` in state with a room picker
  components/
    ChatRoom.jsx | Effect | Connects to the chat server for `roomId` and shows the heading, the time it opened, and the Message field; holds the helper `formatTime`
```

**PRINCIPLES:** React lint rules inspect source code before execution to identify runtime defects. A single preset activates all essential checks, each guarding a distinct React invariant. Four principles govern this static analysis:
1. **Principle 1: One line in the config turns on every React lint.** The `recommended` preset turns on the Hook lints and the render lints, with or without the React Compiler.
2. **Principle 2: A suppression comment keeps the lint off for good.** When a later change makes `roomId` change, nobody is told, and the Effect keeps the old room.
3. **Principle 3: `purity`, `refs`, and `set-state-in-render` check render code.** A clock read, a ref read, and a setter call during render each show a different bug.
4. **Principle 4: A compiler-powered report can wait, but the rule stays on.** Turning the rule off hides today's report and every later one.

---

## PRINCIPLE | `reactHooks.configs.flat.recommended`: one line turns on every React lint, with or without the compiler

> [!PRINCIPLE]
> **Principle 1: One Preset: `recommended` Turns On the Hook Lints and the Render Lints**
>
> *Add `reactHooks.configs.flat.recommended` to `eslint.config.js`, after an entry that tells ESLint to read `.jsx` files; it turns on the fundamental lints and the compiler-powered lints from the one package `eslint-plugin-react-hooks`, with or without the React Compiler.*
>
> Without this preset, ESLint reads the files and says nothing about Hooks, dependency arrays, or render code, so all five bugs of this lesson can reach the user. With it, the editor marks each broken line while the developer types it. The compiler-powered lints take their checks from the compiler, but they never need the compiler to be installed.
>
> **DO THIS:**
> ```js
> import reactHooks from 'eslint-plugin-react-hooks';
> import { defineConfig } from 'eslint/config';
>
> export default defineConfig([
>   { files: ['**/*.{js,jsx}'], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
>   ~reactHooks.configs.flat.recommended~, // Every React lint, from one package
> ]);
> ```
>
> **DO NOT DO THIS:**
> ```js
> import reactHooks from 'eslint-plugin-react-hooks';
> import reactCompiler from ~'eslint-plugin-react-compiler'~; // **WRONG:** the old second package; its lints now ship in eslint-plugin-react-hooks
> ```

Before the linter can inspect your code, the project must enable React linting. If the repository lacks ESLint, the team installs two standard dependencies: `eslint` and `eslint-plugin-react-hooks`. Then the team adds a concise configuration file at the repository root:

```js title="eslint.config.js"
import ~reactHooks~ from 'eslint-plugin-react-hooks'; // The one package that holds every React lint
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ~files~: ['**/*.{js,jsx}'], // ESLint reads every .js and .jsx file
    languageOptions: { parserOptions: { ecmaFeatures: { ~jsx: true~ } } }, // ESLint can read JSX tags
  },
  ~reactHooks.configs.flat.recommended~, // Turns on the Hook lints and the render lints together
]);
```

The `defineConfig` helper is exported directly by ESLint. It accepts an array of configuration objects, configured here with two entries.

The initial object declares target file patterns and activates JSX parsing. Both properties are mandatory:
1. **Without the `files` pattern**, ESLint skips all project JSX files and produces zero diagnostics.
2. **Without `jsx: true`**, the parser encounters the first JSX angle bracket and throws a parsing error.

The second entry loads the recommended preset. The keyword flat indicates adherence to modern ESLint flat configuration standards.

With this configuration active, the code editor underlines invariant violations as you write, well before the code executes in a browser.

> [!DEFINITION]
> **What is a preset?** [NEW] A preset is a bundled collection of lint rules and configurations exported by a plugin to configure static analysis in a single declaration.
> 1. It spares engineering teams from declaring, configuring, and updating dozens of individual rules by hand.
> 2. In modern ESLint flat configuration, importing and providing the preset object applies the recommended rules immediately.
> 3. The recommended preset of `eslint-plugin-react-hooks` enables all classic Hook checks alongside compiler-powered render rules across the application (Lesson 95).

### Two kinds of lints in one preset

The recommended preset bundles two complementary categories of static analysis rules. Both flag violations of core React principles, and both surface identical visual warnings in your code editor. The distinction lies in which phase of component execution they evaluate:
- **The fundamental lints, `rules-of-hooks` and `exhaustive-deps`,** inspect where Hooks are invoked and verify that dependency arrays list every reactive value. The React documentation designates them as the guardians of fundamental Hook patterns. These rules have protected React codebases for years (Lessons 35 and 38).
- **The compiler-powered lints, including `purity`, `refs`, `set-state-in-render`, and `immutability`,** inspect the logic executed during component rendering, such as reading a clock or calling a state updater. These checks originate from the validation passes of the React Compiler. They are bundled directly inside the standard Hooks plugin package.

```tree caption="The two kinds of lints in the recommended preset of eslint-plugin-react-hooks."
The `recommended` preset of `eslint-plugin-react-hooks`
- +The fundamental lints [`rules-of-hooks` `exhaustive-deps`] | Read **where Hooks are called** | Read **what goes in a dependency array**
- +The compiler-powered lints [`purity` `refs` `set-state-in-render` `immutability`] | Read **all the code that runs during render** | Come from **the React Compiler's checks**, shipped in the same package
```

> [!DEFINITION]
> **What is the React Compiler?** [REVIEW] The React Compiler is an optimizing build tool that automatically memoizes components and Hooks to eliminate redundant re-rendering.
> 1. Before transforming component code, it runs static analysis passes to ensure the implementation strictly adheres to React invariants.
> 2. If a component violates pure rendering rules, the compiler safely skips optimizing that component to avoid producing incorrect runtime behavior.
> 3. Adding the `"use no memo"` directive at the top of a component explicitly instructs the compiler to bypass optimization for that specific function (Lesson 63).

### The compiler-powered lints work without the compiler

**The compiler-powered lint rules catch invariant violations even in applications that never install the React Compiler.** The name frequently confuses developers, so consider this standard development scenario:
1. An engineering team installs `eslint-plugin-react-hooks` and enables the recommended configuration preset.
2. The team does not install or configure the React Compiler package.
3. An engineer evaluates a dynamic clock call directly inside component JSX, and the purity rule immediately flags the line.

The lint rules adopt the validation logic developed for the compiler, but they execute as independent static analysis passes. The React Compiler release documentation confirms this design: "The linter does not require the compiler to be installed, so there's no risk in upgrading eslint-plugin-react-hooks." Every React project benefits from these checks regardless of compiler adoption.

When running ESLint through the command line, the diagnostic for an impure render call displays the rule identifier:

```text title="ESLint in the terminal"
error  Error: Cannot call impure function during render ...  react-hooks/purity
```

The browser page and developer console remain completely unaffected. Static analysis operates entirely inside your editor language server and continuous integration pipeline, never during browser runtime.

### Where `react-hooks/` in front of each rule comes from

Every diagnostic message displays a compound rule identifier. ESLint constructs this identifier in two consistent steps:
1. The package name is `eslint-plugin-react-hooks`, which ESLint abbreviates by convention to the plugin prefix `react-hooks`.
2. ESLint appends the specific rule name after a forward slash, producing identifiers such as the purity rule.

The identifier `reactHooks` in your configuration file is distinct. It represents only the local variable name assigned to the imported module in the import statement, which you can name arbitrarily.

### A team that keeps two packages

Some repositories retain legacy configurations with redundant dependencies. Compiler lint rules initially debuted in a dedicated package named `eslint-plugin-react-compiler`. Teams frequently encounter this migration state:
1. In early adoption phases, the team configured compiler checks using the standalone compiler plugin.
2. Later, a developer upgrades `eslint-plugin-react-hooks` while leaving the old plugin declared in configuration files.
3. Official guidance confirms the standalone package is obsolete: "If you have already installed `eslint-plugin-react-compiler`, you can now remove it and use `eslint-plugin-react-hooks@latest`."

Modern setups require only the single unified plugin package shown in our configuration.

In technical interviews, explain where these static checks run and how presets package them. The React documentation highlights that the plugin catches invariant violations at build time, and editor integration surfaces diagnostics as you write. The compiler-powered rules are included in both the `recommended` and `recommended-latest` presets of the primary Hooks plugin.

---

## PRINCIPLE | `eslint-disable-line`: the lint stays off for that line, for every later change

> [!PRINCIPLE]
> **Principle 2: No Suppression: An Old Suppression Hides the New Room Picker**
>
> *Never suppress `exhaustive-deps`; a suppression comment keeps the lint off for that line for every later change, so the Effect keeps an old value after someone else's correct edit.*
>
> On the day it is written, a suppression often looks harmless, because the value it hides does not change yet. But the comment has no date and no condition. When a teammate later makes `roomId` change, the editor stays quiet, the heading follows the new room, and the connection stays in the old one. Delete the comment, read the lint, and change the code until the lint passes.
>
> **DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   return () => connection.disconnect();
> }, ~[roomId]~); // Picking travel disconnects general and connects travel
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> useEffect(() => {
>   const connection = createConnection(serverUrl, roomId);
>   connection.connect();
>   return () => connection.disconnect();
> }, ~[]~); // **WRONG:** eslint-disable-line react-hooks/exhaustive-deps: after the room picker arrives, the chat stays in general
> ```

> [!DEFINITION]
> **What is a dependency array?** [REVIEW] The dependency array is the second argument passed to `useEffect`, declaring all reactive values read by the Effect function.
> 1. A reactive value includes any prop, state variable, or value calculated inside the component body that can change between renders.
> 2. After each render, React evaluates whether any value in the array changed using `Object.is` shallow equality comparison.
> 3. If any dependency changed, React executes the cleanup function of the previous Effect and runs the Effect again with current values (Lesson 35).

### Two dependency lists that behave the same on day 1

On day 1, the chat application serves only a single channel, meaning `roomId` is consistently `'general'`. The author intends for the socket to establish once on mount, and considers two possible dependency configurations:

```jsx title="The two dependency lists of the chat's Effect, on day 1"
}, ~[]~); // eslint-disable-line react-hooks/exhaustive-deps -- on day 1, connects to general once
}, ~[roomId]~); // On day 1, also connects to general once, because roomId never changes
```

**It may look the same, or work the same at first, but it is NOT the same thing!** On day 1, both implementations produce an identical user interface and identical console output.

The static analysis rule, however, evaluates code semantics rather than runtime values. The Effect closure reads `roomId`, and because `roomId` arrives as a component prop, it is intrinsically a reactive value that may change across renders (Lesson 35). The behavioral divergence emerges the moment a teammate introduces dynamic room switching.

```tree caption="The two dependency lists of the chat's Effect: the same on day 1, different on day 30."
The chat's Effect on day 1 and on day 30
- !With `[]` and the suppression comment [`eslint-disable-line`] | Day 1: connects to **`general`** once | Day 30: stays on **`general`** after the user picks `travel`
- +With `[roomId]` | Day 1: connects to **`general`** once | Day 30: disconnects from `general` and **connects to `travel`**
```

### Day 1: the suppression

Here is the implementation of `ChatRoom` on launch day. When the author originally specified an empty dependency array `[]`, ESLint surfaced a missing dependency warning:

```text title="ESLint in the terminal, day 1"
11:6  warning  React Hook useEffect has a missing dependency: 'roomId'. Either include it or remove the dependency array  react-hooks/exhaustive-deps
```

In a hurry to complete the task, the developer silenced the linter by appending an inline suppression directive (Lesson 36):

```jsx title="src/components/ChatRoom.jsx, day 1"
import { useEffect } from 'react';
import { createConnection } from '../chat.js';

const serverUrl = 'https://localhost:1234';

export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, ~[]~); // **WRONG:** eslint-disable-line react-hooks/exhaustive-deps stops the lint from asking for roomId, today and every later day
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

During initial testing the page functions as expected, and the console records the initial socket connection to general:

```page width=text caption="The chat on day 1, in development: one room, and Strict Mode's connect, disconnect, connect on the first load."
heading: Welcome to the general room!
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
```

### Day 30: a correct change, and the chat stays in general

A month later, another engineer adds a dropdown room selector to `App`. The selected room is stored in state, and `App` passes the dynamic string down to `ChatRoom`. The engineer never inspects the `ChatRoom` file because the task only requires modifying the parent:

```jsx title="src/App.jsx, day 30"
import { useState } from 'react';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select value={roomId} ~onChange={e => setRoomId(e.target.value)}~> {/* The user's pick goes into roomId */}
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <ChatRoom ~roomId={roomId}~ /> {/* roomId is no longer always general */}
    </>
  );
}
```

**Beware! The bug manifests a month after the suppression was committed, triggered by valid code in a file nobody touched that day.** Here is the sequence of events on day 30:
1. The teammate saves the parent component. The editor displays zero warnings because the suppression comment remains active inside the child component.
2. The user selects travel from the dropdown, and the heading text updates to announce the travel room.
3. The console displays zero new socket activity. The active chat connection remains open to general.
4. The engineer who introduced the suppression is rarely the person tasked with diagnosing the resulting bug.

```page width=text caption="The chat on day 30 after the user picks travel: the heading says travel, and the Console shows no new line."
form:
  select: Choose the chat room: | travel | bad
heading: Welcome to the travel room!
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
```

### Why the heading moves and the connection does not

The heading and the socket connection both reference `roomId`, yet they present conflicting states. This divergence stems from when each construct executes. The heading is evaluated during component rendering, meaning React reconstructs the JSX elements on every render pass. The socket connection is managed inside an Effect, meaning React synchronizes it only when dependencies change.

Here is what React does after the user selects travel:
1. React re-renders `ChatRoom` with the new prop, updating the JSX heading to travel.
2. React compares the current dependency array `[]` with the previous array `[]`. Because both arrays are empty, React detects zero changes and skips running the Effect (Lesson 35).
3. The socket connection established during the initial render with general remains permanently active.

Why did the editor fail to warn the team on day 30? The suppression directive sits directly on the dependency array line. The teammate's pull request never touched that line, so the suppression remained in full effect. ESLint cannot infer business intent across files; it simply honors the directive to ignore the missing dependency.

The React documentation highlights this exact risk: "You will no longer get such reminders for any future edits to that Effect if you disable the linter. This leads to bugs."

### The fix is in the file nobody changed

A week later, customers report that the chat displays messages from the wrong channel. An engineer reviews `App`, where the dropdown was added, and finds nothing wrong. The defect resides entirely in `ChatRoom`, and resolving it requires three steps:
1. Remove the suppression directive. As the React documentation states: "you should always start by removing the linter suppression."
2. Inspect the diagnostic message. The linter flags `roomId` as a missing dependency.
3. Declare `[roomId]` in the dependency array.

```jsx title="src/components/ChatRoom.jsx, the fix" startLine="7"
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, ~[roomId]~); // No suppression: picking travel disconnects general and connects travel
```

Now, when a user selects travel, the console logs the expected synchronization. The cleanup function disconnects from general, and the Effect connects to travel:

```page width=text caption="The chat on day 30 with roomId in the array: after the user picks travel, the chat leaves general and connects to travel."
form:
  select: Choose the chat room: | travel | good
heading: Welcome to the travel room!
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "travel" room at https://localhost:1234...
```

The React documentation provides two key recommendations for teams. When troubleshooting: "when you're looking for bugs in Effects, start by searching for linter suppressions." And for workflow standards: "We recommend treating the dependency lint error as a compilation error. If you don't suppress it, you will never see bugs like this."

In interviews, expect questions regarding why teams suppress this rule. Developers often silence the linter when an object dependency triggers unnecessary reconnects on every render. The linter warning is correct in those cases as well, and the solution is to refactor the code, such as moving non-reactive options inside the Effect (Lesson 37). The documentation reminds us: "The linter only knows when the dependencies are *wrong*. It doesn't know *the best* way to solve each case."

---

## PRINCIPLE | `purity`, `refs`, and `set-state-in-render`: the editor marks impure render code before the page runs

> [!PRINCIPLE]
> **Principle 3: Pure Render: `purity`, `refs`, and `set-state-in-render` Flag Render Code Before It Runs**
>
> *Keep render pure: read a changing value such as the clock once with an initializer function, keep what the page shows in state instead of in a ref, and call setters in event handlers instead of in the component body.*
>
> The three newer lints check the code that runs while React renders the component. A clock read in the JSX shows a new time on every render. A ref read in the JSX shows the number of the last render. A setter called in the body asks for another render forever. Each line looks harmless on the first load, and the lint marks it before any user meets the bug.
>
> **DO THIS:**
> ```jsx
> const [openedAt] = useState(~() => formatTime(Date.now())~); // React keeps the time of the first render
> return <p>Opened at {openedAt}</p>;
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> return <p>Opened at {formatTime(~Date.now()~)}</p>; // **WRONG:** the time moves each time the user types
> ```

### Three lines that look like ordinary JavaScript

Here are three lines of code that appear unproblematic at a glance. Modern React lint rules flag all three:

```jsx title="Three lines in a component body that the newer lints mark"
<p>Opened at {formatTime(~Date.now()~)}</p> {/* **WRONG:** purity: reads the clock again on every render */}
<p>{~sentRef.current~} sent</p> {/* **WRONG:** refs: reads a ref during render */}
~setUnread(0);~ // **WRONG:** set-state-in-render: asks for another render during this one
```

These patterns might seem like distinct mistakes, but they represent three variations of one fundamental error. Remember what happens during rendering: React invokes your component function, executing logic from the top declaration to the return statement. React performs this execution during initial mount, and repeats it whenever component state updates, such as on every keystroke in a form input. Every statement placed in the function body runs on every render pass.

> [!DEFINITION]
> **What is a pure render?** [REVIEW] A render is pure when identical props and state consistently yield identical JSX output, mirroring a pure mathematical function.
> 1. Determinism: Rendering must never read values that fluctuate independently outside React state, such as system clocks or random numbers.
> 2. Zero side effects: The render pass must not mutate existing objects, update external variables, or trigger state updates while executing.
> 3. Idempotence: React reserves the right to invoke component rendering multiple times without altering observable application state (Lesson 14).

Each of the three lines violates pure rendering invariants, producing distinct runtime defects:
1. Evaluating `Date.now()` during render reads the system clock, causing displayed timestamps to change whenever the user types.
2. Reading `sentRef.current` in JSX evaluates a mutable container, causing displayed counts to show outdated values.
3. Invoking `setUnread(0)` unconditionally in the body schedules continuous renders, causing the browser to lock up.

Engineers are often misled because code appears functional during initial manual testing. A defect that produces no visible error on initial mount seems benign. The React documentation cautions against this false confidence with refs: "your component might still work."

### The three lints, and what each one reports

All three checks are enabled automatically by the recommended configuration preset:
- **`purity`** flags calls during render to non-deterministic functions, such as reading `Date.now()` or generating random values with `Math.random()`. It recognizes these functions by name. In current plugin releases, it does not flag `new Date()` or `crypto.randomUUID()`, even though both also return fresh values on every call. Our example reads the system clock using `Date.now()` to demonstrate this diagnostic.
- **`refs`** flags reading or writing `ref.current` during the render phase. It inspects variables initialized with `useRef`, objects passed to JSX ref attributes, and identifiers ending with the Ref suffix.
- **`set-state-in-render`** flags calling a state updater function during render without an enclosing condition. The React documentation warns that this pattern triggers an infinite loop that crashes the application.

### `purity`: the time that moves when the user types

Now our chat component gains a message field and an indicator displaying when the user joined the room. `Date.now()` returns the current timestamp in milliseconds. A formatting helper converts that timestamp into human-readable text. An engineer renders the formatted timestamp directly inside the JSX:

```jsx title="src/components/ChatRoom.jsx, with the Message field"
import { useState, useEffect } from 'react';
import { createConnection } from '../chat.js';

const serverUrl = 'https://localhost:1234';
const ~formatTime~ = (ms) => new Date(ms).toLocaleTimeString(); // Turns a number from Date.now() into text such as 10:42:07 AM

export default function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <p>Opened at {formatTime(~Date.now()~)}</p> {/* **WRONG:** purity: a new time on every render */}
      <label>
        Message:{' '}
        <input value={message} ~onChange={e => setMessage(e.target.value)}~ /> {/* Each keystroke renders ChatRoom again */}
      </label>
    </>
  );
}
```

The user opens the chat interface at 10:42:07 AM:

```page width=text caption="The chat when the user opens it: the Opened at line shows the time of the first render."
form:
  select: Choose the chat room: | general
heading: Welcome to the general room!
line: Opened at 10:42:07 AM
form:
  field: Message:
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
```

Twenty seconds later, the user types a character in the input field. The displayed timestamp changes unexpectedly:

```page width=text caption="The same chat after the user types h, twenty seconds later: the Opened at line now shows the time of the keystroke."
form:
  select: Choose the chat room: | general
heading: Welcome to the general room!
line: Opened at 10:42:27 AM | bad
form:
  field: Message: | h
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
```

The timestamp shifts on every keystroke, yet remains static when the user pauses typing. Here is the mechanical cause:
1. The user types a character, triggering the input change handler to call `setMessage`.
2. React schedules and executes a re-render of `ChatRoom` from the top of the function.
3. `Date.now()` executes again, returning the timestamp of the current keystroke render rather than the initial mount.

Under the React Compiler, this identical code can produce the inverse bug. The compiler may memoize the rendered output and freeze the timestamp permanently (Lesson 63). Thus, the exact same code exhibits contradictory behaviors depending on build tooling. User experience then hinges on build configuration rather than component logic.

The standard solution reads the clock once using an initializer function. By passing a function to `useState`, React executes the initialization logic strictly on initial mount and preserves the calculated value across subsequent renders. Line 9 demonstrates this pattern:

```jsx title="src/components/ChatRoom.jsx, the fix, the new line 9" startLine="8"
  const [message, setMessage] = useState('');
  const [openedAt] = useState(~() => formatTime(Date.now())~); // React calls this only on the first render
```

The JSX paragraph on line 18 now references this state variable:

```jsx title="src/components/ChatRoom.jsx, the fix, line 18" startLine="18"
      <p>Opened at {~openedAt~}</p> {/* The same time on every render */}
```

**It may look the same, but it is NOT the same thing!** On initial render, both approaches display the initial timestamp. The divergence occurs on every subsequent render pass. Reading `Date.now()` in JSX recalculates the clock continuously. Initializing state with a function ensures React captures the timestamp once and preserves it.

When the user types subsequent characters, the paragraph maintains the stable opening time, and the purity rule passes with zero warnings.

### `refs`: the count that stays on an old number

Now consider a button designed to track the total number of sent messages. Contrast storing this count in a mutable ref versus storing it in React state:

```jsx title="With the count in a ref"
const sentRef = useRef(0);
<button onClick={() => { sentRef.current = sentRef.current + 1; }}>Send</button>
<p>{~sentRef.current~} sent</p> {/* **WRONG:** a click changes the ref and renders nothing: the line stays on 0 sent */}
```

```jsx title="With the count in state"
const [sent, setSent] = useState(0);
<button onClick={() => setSent(sent + 1)}>Send</button>
<p>{~sent~} sent</p> {/* Each click renders again: 1 sent, 2 sent */}
```

**It may look the same, but it is NOT the same thing!** To a developer unfamiliar with React internals, both approaches appear to increment a counter on every click. A ref, however, is an ordinary JavaScript object, and mutating its current property does not notify React or trigger a re-render. The UI referencing `sentRef.current` remains stuck displaying the count from the last render pass. In contrast, calling `setSent` schedules a re-render that displays the incremented number. Any value rendered in JSX must reside in state (Lesson 30).

### `set-state-in-render`: the page that never loads

Suppose an engineer wants to display an unread message counter that resets to zero when viewing the room. They invoke the state updater directly in the body of `App`, reasoning that the component body runs whenever the room displays:

```jsx title="With setUnread in the body of App"
const [unread, setUnread] = useState(3);
~setUnread(0);~ // **WRONG:** every render asks for another render, so the page never loads
```

The application fails to mount. React halts execution, and the console reports an unhandled exception (Lesson 80):

```devconsole caption="The Console when the page tries to load with setUnread in the body of App."
x Uncaught Error: Too many re-renders. React limits the number of renders to prevent an infinite loop.
```

Here is the recursive render loop. The component body runs and schedules a new render pass. That subsequent pass runs the body again, immediately dispatching another update.

The correct approach calls the state updater inside the event handler that represents the user action, as recommended in the React documentation:

```jsx title="With setUnread in the handler of the room picker"
<select value={roomId} onChange={e => { setRoomId(e.target.value); ~setUnread(0);~ }}> {/* Runs once, each time the user picks a room */}
```

**It may look the same, but it is NOT the same thing!** Both implementations intend to clear unread counts. Placed inside the component body, the updater runs during render and schedules another render indefinitely. Placed inside an event handler, the updater runs exactly once when the user chooses a room.

Suppressing this warning with a comment solves nothing. Suppressing `set-state-in-render` silences the editor, but the infinite render loop still crashes the browser at runtime. The suppression merely shifts the failure from the developer's editor into the user's browser.

```tree caption="The three newer lints: three forms of one mistake, render must be pure, each with its own bug on the page."
Render must be pure
- !`purity` [`Date.now` in the JSX] | Reads **the clock** during render | The time **moves each time the user types**
- !`refs` [`sentRef.current` in the JSX] | Reads **a ref** during render | The count **stays on an old number**
- !`set-state-in-render` [`setUnread` in the body] | Changes **state** during render | The page **never loads**
```

In technical interviews, highlight related rules within this family:
1. **`set-state-in-effect`** flags calling a state updater immediately inside an Effect body, which forces an extra render cycle (Lesson 80).
2. **`immutability`** flags direct mutations of props or state objects, such as modifying properties in place (Lesson 82).
3. **Purity rules** also prevent server hydration mismatches, where server-rendered markup diverges from client-rendered trees.
4. **Ref checks** protect future architecture, as upcoming React concurrency features depend strictly on pure render phases.

---

## PRINCIPLE | A compiler-powered report: the fix can wait, but the rule stays on

> [!PRINCIPLE]
> **Principle 4: Keep the Rule On: A Compiler Lint Report Can Wait, but the Rule Stays On**
>
> *A compiler-powered report in existing code may wait until the team fixes it; the rule itself stays on, so the team keeps seeing that line and every new break.*
>
> React's docs allow a team to fix compiler-powered reports at its own pace, because the compiler skips the components it sees breaking a rule. That permission is about fixing, never about turning the rule off. A rule turned off hides today's report and every later one, while the compiler can still compile a component whose break it cannot see.
>
> **DO THIS:**
> ```js
> export default defineConfig([
>   { files: ['**/*.{js,jsx}'], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
>   ~reactHooks.configs.flat.recommended~, // Every rule stays on; old reports wait in the editor until fixed
> ]);
> ```
>
> **DO NOT DO THIS:**
> ```js
> export default defineConfig([
>   { files: ['**/*.{js,jsx}'], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
>   reactHooks.configs.flat.recommended,
>   { rules: { ~'react-hooks/purity': 'off'~ } }, // **WRONG:** a clean editor, and every impure render line ships unseen
> ]);
> ```

### Three answers that leave the line as it is today

Return to the chat application prior to fixing the impure timestamp. The engineering team adopts the React Compiler for the project. The editor flags the timestamp with a purity diagnostic alongside other warnings across legacy components. The team can choose between three paths that leave the line unmodified today.

The first approach keeps the diagnostic visible in the editor:

```jsx title="With the report left visible"
<p>Opened at {formatTime(~Date.now()~)}</p> {/* The editor keeps the mark until the team fixes the line */}
```

The second approach temporarily opts the component out of compiler optimization (Lesson 63):

```jsx title="With use no memo in ChatRoom"
export default function ChatRoom({ roomId }) {
  ~"use no memo";~ // The compiler skips ChatRoom until the team removes this line
```

The third approach suppresses the lint rule for that specific line:

```jsx title="With the lint turned off"
<p>Opened at {formatTime(~Date.now()~)}</p> {/* **WRONG:** eslint-disable-line react-hooks/purity: the mark is gone, the bug stays */}
```

All three options leave the component code unmodified today, but they produce drastically different outcomes for tooling and visibility:
1. **Keeping the report visible** allows the compiler to make its own optimization decisions while keeping the required fix visible to the engineering team.
2. **Adding `"use no memo"`** explicitly instructs the compiler to bypass optimizing this component. Official documentation describes this directive as a temporary escape hatch to be removed once resolved.
3. **Disabling the lint rule** conceals the diagnostic on that line, blinding the editor to any future errors introduced there.

Engineers frequently conflate the first and third strategies. **It may look the same, or work the same at first, but it is NOT the same thing!** Today, both keep the code and browser output identical. Only leaving the report visible ensures the team remains aware of the required fix.

Interviewers look for an understanding of urgency between rule categories. The React documentation recommends treating `exhaustive-deps` diagnostics as compilation errors. For compiler-powered warnings in pre-existing code, the documentation permits teams to address them at their own pace.

```tree caption="Three answers to a compiler-powered report: all leave the line as it is today, and only one keeps the report in front of the team."
Three answers to the `purity` report on the `Opened at` line
- +Leave the report visible | The compiler **makes its own choice** | The team **still sees the line**, and every new break
- +Opt out with `"use no memo"` | The compiler **skips `ChatRoom`** | **Temporary**: removed once the line is fixed
- !Turn the lint off [`eslint-disable-line`] | The editor **shows nothing** | The bug **stays**, and **no later break** is reported either
```

### Why a report can wait

A compiler diagnostic can wait because the compiler analyzes the same invariants before compiling. The React documentation explains that when the compiler identifies a violation, it automatically skips optimizing that component while keeping the rest of the application optimized. The compiler installation guide confirms: "When the ESLint rule reports an error, it means the compiler will skip optimizing that specific component or hook. This is safe."

A skipped component executes using standard unmemoized React semantics, exactly as it operated before compiler adoption. Teams can resolve diagnostics incrementally, allowing the compiler to optimize components one by one.

### A report is not always a skip

**Beware! Static analysis can detect invariant violations that the compiler optimization pass overlooks.** Consider this real-world failure pattern (Lesson 63):
1. The purity lint flags reading the system clock directly inside a timestamp component.
2. In compiler version 1.0.0, the compiler still optimizes the component because its internal impure function check is disabled by default.
3. The compiled component caches its output, causing the elapsed time label to freeze permanently.

A lint warning does not guarantee that the compiler will successfully bypass the component. When the lint rule remains active, the team sees the diagnostic and can resolve the issue. If the lint rule is silenced, the team misses both the diagnostic and the frozen UI until customers report the bug. The React debugging guide specifically identifies this risk: "the compiler mistakenly compiled a component it should have skipped."

### Turning the rules off to clean the editor

Teams adopting the compiler in legacy repositories often make this critical mistake:
1. The editor displays numerous compiler-related warnings across existing files.
2. To achieve a clean editor interface, an engineer disables the rule in the ESLint configuration.
3. The purity diagnostic disappears from the timestamp line, along with diagnostics for all subsequent code written across the project.
4. Under compiler optimization, dynamic timestamps evaluated during render freeze unpredictably (Lesson 63).
5. When troubleshooting bugs, official guidance advises checking with ESLint, but the diagnostic check has been deactivated.

```js title="eslint.config.js, with purity turned off"
export default defineConfig([
  { files: ['**/*.{js,jsx}'], languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  reactHooks.configs.flat.recommended,
  { rules: { ~'react-hooks/purity': 'off'~ } }, // **WRONG:** hides this report and every later one in the whole project
]);
```

An inline suppression comment disables a lint rule on a single line. Modifying the ESLint configuration file disables the rule across every file in the entire repository.

In technical interviews, state the two core principles from the React debugging guide. First, the compiler is designed to skip problematic code rather than halt builds, meaning diagnostics never block deployment. Second, runtime defects under the compiler stem from invariant violations that the compiler failed to detect, making static analysis essential for surfacing issues. Contrast this with `"use no memo"`, which serves as a temporary opt-out to be removed after refactoring, whereas disabling a rule creates a permanent blind spot.

---

## All 4 Principles Together

### The complete project

Here is the complete implementation of the chat application. The ESLint configuration enables all React lint rules. `App` manages the dynamic room selector. `ChatRoom` declares `roomId` in its dependency array without suppressions, and captures the initial timestamp using state initialization.

```js title="eslint.config.js"
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
  },
  ~reactHooks.configs.flat.recommended~, // Principles 1 and 4: every React lint, from one package, with every rule on
]);
```

```jsx title="src/main.jsx"
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  ~<StrictMode>~ {/* Connects, disconnects, and connects again on the first load in development */}
    <App />
  </StrictMode>
);
```

```js title="src/chat.js"
export function createConnection(serverUrl, roomId) {
  return {
    ~connect~() { // Prints the ✅ Connecting line for this room
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    ~disconnect~() { // Prints the ❌ Disconnected line for this room
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    },
  };
}
```

```jsx title="src/App.jsx"
import { useState } from 'react';
import ChatRoom from './components/ChatRoom.jsx';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select value={roomId} ~onChange={e => setRoomId(e.target.value)}~> {/* Principle 2: the teammate's room picker of day 30 */}
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```jsx title="src/components/ChatRoom.jsx"
import { useState, useEffect } from 'react';
import { createConnection } from '../chat.js';

const serverUrl = 'https://localhost:1234';
const formatTime = (ms) => new Date(ms).toLocaleTimeString();

export default function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  const [openedAt] = useState(~() => formatTime(Date.now())~); // Principle 3: React keeps the time of the first render
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, ~[roomId]~); // Principle 2: no suppression, a new room disconnects the old one and connects the new one
  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <p>Opened at {openedAt}</p>
      <label>
        Message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}
```

The user opens the chat at 10:42:07 AM, types a character, and selects travel. The visual interface and network console now remain in complete synchronization:

```page width=text caption="The finished chat after the user types h and picks travel: the heading, the connection, and the opening time all tell the truth."
form:
  select: Choose the chat room: | travel | good
heading: Welcome to the travel room!
line: Opened at 10:42:07 AM | good
form:
  field: Message: | h
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "general" room at https://localhost:1234...
log: ❌ Disconnected from "general" room at https://localhost:1234
log: ✅ Connecting to "travel" room at https://localhost:1234...
```

### When the linter reads the code, and when React runs it

Static analysis evaluates the codebase before any code runs in a browser. React then mounts the component hierarchy, re-synchronizing the Effect strictly when `roomId` changes:

```tree dir=right caption="The linter reads the code in the editor first; then React renders App and ChatRoom, and runs the Effect when roomId changes."
From the editor to the page
- +1. In the editor [`eslint-plugin-react-hooks`] | The linter **reads every file** without running it | No report left, **no suppression** in the project
- +2. The first load [`App` `ChatRoom`] | React renders `App`, then `ChatRoom` | `openedAt` **gets the time of the first render**; the Effect **connects to `general`**
- +3. The user types `h` [`setMessage`] | React renders `ChatRoom` again | `openedAt` **keeps its time**; the Effect **does not run**
- +4. The user picks `travel` [`setRoomId`] | React renders `App`, then `ChatRoom` | The cleanup **disconnects `general`**; the Effect **connects to `travel`**
```

### Each lint, and what the user sees when it is off

| Lint | What it reads | What the user sees when it is off | The fix |
| :--- | :--- | :--- | :--- |
| **`exhaustive-deps`** | The values an Effect reads, and its dependency array | The heading says `travel`, and the chat stays in `general` | Remove the suppression and list `roomId` |
| **`rules-of-hooks`** | Where each Hook is called | The page goes blank with "Rendered fewer hooks than expected" | Call every Hook at the top level |
| **`purity`** | Calls during render that return a new value each time | The time moves when the user types, or freezes with the compiler | Read the clock once with an initializer function |
| **`refs`** | `ref.current` read or written during render | A count stays on an old number | Keep what the page shows in state |
| **`set-state-in-render`** | A setter called during render with no condition | The page never loads, with "Too many re-renders" | Call the setter in the event handler |
| **Any compiler-powered lint** | A report in code that already exists | Nothing today; every later break ships unseen if the rule is off | Leave the report visible and fix it at the team's own pace |

Remember the foundational principle of this lesson. **Each React lint identifies a runtime defect that users will experience in production. A suppression comment removes the warning message without fixing the bug, so to silence a lint, always refactor the code.**

---

## For the Interview

> **The Interview Question:** What do the React Hooks and Compiler lint rules catch, and why should they never be disabled?

### How to Answer Clearly in 30 Seconds

"All official React lint rules are consolidated into one package, `eslint-plugin-react-hooks`, and its `recommended` preset enables them all. These checks function whether or not the application uses the React Compiler. Two rule families protect against two distinct failure modes:
1. **The fundamental Hook lints** inspect Hook call sites and dependency arrays. The rules of Hooks ensure Hooks execute in identical order across renders, while exhaustive dependencies ensures Effect closures synchronize with every reactive value they capture.
2. **The compiler-powered lints** validate logic executed during component rendering. The purity check flags non-deterministic calls like reading the system clock. The refs check flags reading or writing mutable refs during render. The set-state-in-render check stops infinite render loops. Together, they enforce that component rendering remains pure and deterministic.

These rules must never be disabled because a suppression comment merely silences the warning while shipping the defect to users. Furthermore, inline directives permanently blind the linter to subsequent modifications on that line. A chat Effect with suppressed dependencies connects once on launch day, but stays trapped in a stale room when a teammate adds a room selector a month later. Compiler diagnostics in existing code can be addressed incrementally, but the rules must remain active."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Our team silences the `exhaustive-deps` warning to ship faster. What classes of bugs does that invite?"**
   Suppressing exhaustive dependencies invites three critical bug categories. First, stale closure bugs in current code, where an Effect captures outdated props or state like an unupdated muted setting (Lesson 36). Second, regression bugs on future edits. When another engineer introduces dynamic state like a room selector, the Effect stays bound to initial values because the suppression blinds the linter. Third, misdirected debugging: the resulting defect surfaces in unchanged components, wasting engineering hours searching the wrong files. The React documentation recommends treating dependency lint warnings as compilation errors, and searching for suppression comments first when troubleshooting misbehaving Effects. To change the dependencies, always refactor the code.
2. **"What do the newer lints, `purity`, `set-state-in-render`, and `refs`, guard against?"**
   They protect the core invariant that component rendering must be pure and deterministic. The purity rule flags non-deterministic calls like reading the system clock or generating random numbers during render. Without the compiler, timestamps fluctuate on incidental keystrokes; with the compiler, they freeze unpredictably. The refs rule prevents reading or mutating `ref.current` during render: mutating a ref does not trigger a re-render, leaving the UI showing stale counts. The set-state-in-render rule catches unconditional state updaters in the component body that trigger infinite render loops. Each fix moves work out of the render phase. Use state initializer functions for clocks, React state for rendered values, and event handlers for state updaters.
3. **"The React docs say compiler reports can be fixed at our own pace. Why not just turn those rules off until we are ready?"**
   Addressing reports at your own pace refers to resolving code violations, never deactivating static analysis rules. While the rule remains active, the engineering team retains visibility into existing issues and prevents new violations from being committed. The React Compiler automatically skips optimizing components with detected violations, ensuring existing components continue functioning safely as written. If you disable the rule, the editor appears clean, but engineers continue introducing violations unseen. Meanwhile, the compiler may attempt to optimize an unflagged component with subtle violations, causing dynamic UI elements to freeze (Lesson 63). If a specific component breaks under compiler optimization, the `"use no memo"` directive provides a temporary opt-out until the code is refactored.

```tree dir=right caption="Interview comparison: a React lint left on versus a React lint turned off."
A React lint left on vs. turned off
- +Left on [`recommended`] | Marks the line **before any user meets the bug** | Warns **every later editor** of that line
- !Turned off [`eslint-disable-line` `'off'`] | Removes **the message, not the bug** | Hides **every later change** on that line, written by anyone
```
