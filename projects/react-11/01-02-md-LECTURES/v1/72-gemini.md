# Lecture 72: Catching a Rendering Error with an Error Boundary

*(How do you keep one broken comment from turning the whole page white?)*

> INTERVIEW QUESTION | ❱❱ MORE | How do you catch a rendering error before it unmounts the whole app?

---

## VS | `try` and `catch` vs. an Error Boundary: one catches the code that runs inside it, the other catches the components React renders inside it

> In standard JavaScript, wrapping statements in `try` and `catch` blocks lets execution continue past a runtime failure. **In React, an unhandled error thrown while rendering a component removes the entire application from the screen, and a `try` block around JSX cannot catch it**. An Error Boundary provides framework-level resilience: it intercepts rendering errors and displays a fallback interface in place of the crashed component, keeping the surrounding page intact.

Web applications routinely load data from external servers, where payload structures remain unpredictable. A comments payload might include an entry missing its author record because the user deleted their profile. Attempting to access the name property on that missing author immediately triggers a runtime TypeError. In traditional web scripts, a missing property might leave a single empty element. React takes a much stricter approach: it unmounts the entire component tree, leaving the user with a blank white screen.

This default behavior explains the need for Error Boundaries. An Error Boundary is a specialized React component that wraps around UI sections to intercept JavaScript errors thrown during rendering.

Consider a news article displaying a headline and reader comments. A single corrupted comment record should never destroy the entire article view. The headline and surrounding comments contain valid content. The broken comment section should display a polite fallback message while the rest of the page remains fully readable.

Optional chaining checks like optional property access can safeguard against specific known issues. That defensive check works well for known failure modes. However, developers cannot foresee every edge case across complex data pipelines. An Error Boundary protects the interface against unexpected runtime failures that slip past manual code checks.

### One Missing Field, One White Page

Here is the smallest code that breaks a page:

```jsx title="Comment.jsx"
function Comment({ comment }) {
  return <li>{~comment.author.name~}: {comment.text}</li>; // For a comment with no author, this line throws
}
```

When a comment lacks an author object, accessing its author property yields undefined. Attempting to read a property from undefined throws a TypeError. This runtime error stops JavaScript execution because the runtime cannot access properties on a non-existent object.

This evaluation occurs while React renders the comment component. Two foundational concepts and two new terms govern this behavior:

> [!DEFINITION]
> **Rendering.** [REVIEW] Rendering is the synchronous phase where React executes a component function to determine what elements to display on screen. The statements within the function body and the returned JSX run during this phase. Event handlers operate on a different lifecycle: they execute in response to user events, long after rendering finishes (Lesson 13).

> [!DEFINITION]
> **Unmount.** [REVIEW] Unmounting is the lifecycle step where React destroys component instances and cleans up their corresponding DOM nodes. Without defensive boundaries, a single rendering crash causes React to unmount the entire application tree from the root container (Lesson 32).

> [!DEFINITION]
> **Error Boundary.** [NEW] An Error Boundary is a specialized React component that wraps child trees to catch JavaScript errors thrown during rendering, lifecycle methods, and constructors. The React documentation defines it as a component that displays a fallback interface instead of the crashed tree. Without an Error Boundary, React removes the entire root UI upon encountering any rendering error (Lesson 72).

> [!DEFINITION]
> **Fallback.** [REVIEW] A fallback interface is an alternative UI rendered when primary content cannot display normally. In `<Suspense>`, a fallback placeholder displays while asynchronous dependencies resolve. In an Error Boundary, a fallback renders when a child component subtree encounters an unhandled runtime error (Lesson 69).

### Why `try` and `catch` Do Not Help

In regular JavaScript, enclosing a direct function call inside a `try` block intercepts runtime errors successfully:

```js title="Plain JavaScript: the function runs inside the try"
try {
  ~readName(comment)~; // readName runs right here, so its error lands in the catch
} catch (error) {
  console.log('Caught it');
}
```

Developers naturally attempt the same approach by wrapping returned JSX elements in a `try` block:

```jsx title="React: the tag inside the try only describes Comment"
try {
  return <ul>{comments.map(c => ~<Comment key={c.id} comment={c} />~)}</ul>; // Comment does not run here
} catch (error) {
  return <p>Comments are unavailable.</p>;
}
```

The syntax looks identical, but the execution model is completely different. Writing a JSX tag does not execute the underlying component function. A JSX tag evaluates to a lightweight descriptor object instructing React to render that component later (Lesson 4). React invokes the child component only after the parent function has completed and returned. By that point, the parent `try` block has already finished executing. Principle 2 examines this exact sequence in detail.

### The Error Bubbles Up to the Closest Boundary

When a child component encounters an error, that error propagates upward through the React tree. Just as browser events bubble up through DOM nodes, rendering errors bubble upward through ancestor components. The error travels from the crashed component to its parent, continuing upward until it encounters an Error Boundary. If no boundary exists along that ancestry path, the error reaches the root container, prompting React to unmount the entire page.

The official documentation emphasizes this propagation model: "Errors thrown in rendering methods or hooks bubble up through the component tree. Only Error Boundaries can catch these errors."

Keep this central rule in mind throughout the lesson: **an error thrown during rendering travels upward to the nearest Error Boundary above it. That boundary displays its fallback UI, while all components outside the boundary remain intact on screen.**

```tree caption="The same broken comment gives two different pages: with no Error Boundary, and with one around the comments."
The second comment arrives without its author
- !No Error Boundary above the comments | The error travels up to the top of the app | React **removes the whole page**: the user sees **white**
- +An Error Boundary around the comments | The error stops at the **closest boundary** | The boundary shows **its fallback**; the title **stays on the screen**
```

### The Rule of Thumb: when did the error happen?

**Determine the execution phase of the error. When an error occurs during rendering, only an Error Boundary can catch it. When an error occurs inside an event handler or timer, standard `try` and `catch` blocks catch it.**

Experienced developers watch for three classic mistakes:
1. **Placing `try` and `catch` around returned JSX.** Child components execute only after the parent returns, leaving the catch block completely bypassed.
2. **Authoring an Error Boundary as a function component.** React provides no Hook for catching descendant rendering errors, requiring a class component.
3. **Expecting an Error Boundary to catch event handler errors.** Event handlers execute outside the render phase, so the boundary never intercepts their errors.

The upcoming sections explore each failure mode using a news article application.

## SECTION | A News Article with Two Comments

Our application displays a news article with a headline, a comments section, and two reader comments. When all comments arrive with valid author data, the page renders cleanly:

```page url=news.example/city-park caption="The article page when both comments arrive with their author."
heading: City park opens on Saturday
section: Comments
line: John: Great news!
line: Mia: See you there.
```

The application runs as a modular project. The main app component holds the article structure and comments collection, rendering an individual comment component for each entry:

```files title="article-page: File Explorer" caption="How the files of our article page sit inside src/."
index.html | page | The HTML page with the empty root div where React mounts
src/
  main.jsx | entry | Imports `App` and renders it into `#root` with `createRoot`
  App.jsx | parent | Holds the title and the `comments` array, and renders one `Comment` for each comment
  Comment.jsx | child | Shows one comment as the author's name and the text
  ErrorBoundary.jsx | new in Principle 3 | The class component that shows a fallback when a child throws
  errorService.js | new in Principle 5 | Exports `logErrorToMyService`, which reports an error to the team
```

The parent component renders the article layout alongside the comments data from the server:

```jsx title="src/App.jsx"
import Comment from './Comment.jsx';

const comments = [
  { id: 1, author: { name: 'John' }, text: 'Great news!' },
  { id: 2, author: { name: 'Mia' }, text: 'See you there.' },
];

export default function App() {
  return (
    <main>
      <h1>City park opens on Saturday</h1>
      <h2>Comments</h2>
      <ul>
        {comments.map(comment => (
          ~<Comment key={comment.id} comment={comment} />~ // One Comment tag for each comment
        ))}
      </ul>
    </main>
  );
}
```

The comment component resides in its own module:

```jsx title="src/Comment.jsx"
export default function Comment({ comment }) {
  return <li>{~comment.author.name~}: {comment.text}</li>; // Reads the author's name during rendering
}
```

This markup works reliably as long as every comment includes author data. Now we introduce a data flaw. Each subsequent principle explores how the application behaves under failure:

**PRINCIPLES:** Rendering errors bubble upward to the nearest Error Boundary. Six architectural principles follow:
1. **Rendering errors without a boundary remove the whole page.** One crashed comment causes React to unmount the headline and valid comments alike.
2. **A `try` and `catch` block around JSX catches nothing.** React invokes child components after the parent function has already returned.
3. **The `getDerivedStateFromError` lifecycle method switches to the fallback.** An Error Boundary requires a class component because no Hook intercepts descendant errors.
4. **Boundary placement determines which UI survives.** Wrapping the comments list preserves the article, while wrapping each comment preserves sibling comments.
5. **The `componentDidCatch` lifecycle method reports errors to telemetry.** The fallback UI informs the user while this method sends error data to the team.
6. **Event handler errors bypass the boundary.** Handlers execute after rendering, so they require standard `try` and `catch` blocks.

---

## PRINCIPLE | `comment.author.name` during rendering: with no Error Boundary above it, React removes the whole page

> [!PRINCIPLE]
> **Principle 1: Rendering Errors: One Broken Component Removes the Whole Page**
>
> *When a component throws an error during rendering and no Error Boundary sits above it, React removes the whole UI of the root from the screen, not only the broken component.*
>
> A comment from a server can arrive without its author. When `Comment` reads `comment.author.name` for that comment, JavaScript throws a `TypeError` while React is rendering. Nothing above `Comment` catches it, so React removes everything `App` rendered, and the user sees a white page with no message.
>
> **DO THIS:**
> ```jsx
> <h1>City park opens on Saturday</h1>
> ~<ErrorBoundary fallback={<p>Comments are unavailable.</p>}>~ {/* A broken comment stops here; the title stays */}
>   <ul>{comments.map(c => <Comment key={c.id} comment={c} />)}</ul>
> </ErrorBoundary>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> <h1>City park opens on Saturday</h1>
> ~<ul>~{comments.map(c => <Comment key={c.id} comment={c} />)}</ul> {/* **WRONG:** no boundary above the comments, so one broken comment blanks the whole page */}
> ```

A user deletes their account, causing the server to return their comment without an author record:

```jsx title="src/App.jsx" startLine="3"
const comments = [
  { id: 1, author: { name: 'John' }, text: 'Great news!' },
  ~{ id: 2, text: 'See you there.' }~, // Sent by the server without its author
];
```

The comment component remains unchanged. During rendering of the second comment, JavaScript attempts to read the name property of undefined and throws an exception. When a visitor navigates to the page, the application fails to display:

```page url=news.example/city-park caption="What the user sees: the whole article page is white, not only the broken comment."
blank
```

The entire viewport goes blank. The broken comment is gone, but the headline and valid comment disappear as well. The user receives no feedback explaining why the content vanished.

The browser developer console records two distinct messages. The first entry reports an uncaught TypeError from the JavaScript runtime. The second entry shows a warning from React identifying the crashing component and recommending an Error Boundary:

```devconsole width=full caption="The Console after the user opens the article: the browser's TypeError and React's warning that suggests an Error Boundary."
x Uncaught TypeError: Cannot read properties of undefined (reading 'name')
! An error occurred in the <Comment> component. Consider adding an error boundary to your tree to customize error handling behavior. Visit https://react.dev/link/error-boundaries to learn more about error boundaries.
```

React did not merely hide the elements. It actively unmounted the entire DOM subtree. Inspecting the Elements panel reveals that the root container mounted by the entry call remains completely empty (Lesson 7):

```dom caption="The Elements panel after the error: the root div holds nothing."
<body>
! <div id="root"></div> | note: Empty: nothing from App is on the page
</body>
```

### Why the title disappears too

The headline contains zero defects, yet React unmounts it entirely. The error originates in an isolated child component, but with no boundary intercepting it, React abandons the entire tree. The render sequence illustrates why:
1. The user visits the article, and React invokes the app component. It returns the headline, heading, and two comment elements.
2. React executes the first comment component. It successfully returns the markup for John.
3. React executes the second comment component. Reading the author property triggers a TypeError.
4. The error bubbles upward in search of an Error Boundary, finding none in the component tree.
5. React unmounts the entire root hierarchy. The headline and valid comment vanish alongside the broken element.

```tree dir=right caption="How one error in the second Comment removes the whole article page when no Error Boundary sits above it."
One error while React renders the second comment
- +1. React calls `App` and the first `Comment` | Both return their markup **without an error**
- !2. React calls the second `Comment` [`comment.author.name`] | `comment.author` is **`undefined`** | Reading `.name` **throws a `TypeError`**
- !3. No Error Boundary above `Comment` | React **removes the whole UI** of the root | The user sees **a white page**
```

This failure mode frequently evades local testing. During development, mock data usually contains complete records, so components render without incident. In production environments, missing fields trigger uncaught errors that blank the screen for every visiting user.

---

## PRINCIPLE | `try` and `catch` around the JSX: the catch is already over when the child throws

> [!PRINCIPLE]
> **Principle 2: Bubbling: `try` and `catch` Cannot Catch a Child's Rendering Error**
>
> *A `try` and `catch` inside a parent component cannot catch an error thrown while React renders a child component, because the parent only returns the child's tag and React calls the child later.*
>
> The error bubbles up the component tree from the component that threw it, one parent at a time. Only an Error Boundary on that path can catch it. A `catch` block in the parent was already finished when the child threw.
>
> **DO THIS:**
> ```jsx
> ~<ErrorBoundary fallback={<p>Comments are unavailable.</p>}>~ {/* Catches the error that bubbles up from any Comment inside */}
>   <CommentList comments={comments} />
> </ErrorBoundary>
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function CommentList({ comments }) {
>   try {
>     return <ul>{comments.map(c => <Comment key={c.id} comment={c} />)}</ul>;
>   } ~catch~ { // **WRONG:** Comment runs after CommentList returns, so this catch never sees its error
>     return <p>Comments are unavailable.</p>;
>   }
> }
> ```

Confronted with a blank screen, developers often turn to standard error handling. They extract the comments list into a dedicated component and enclose the returned JSX in a `try` block. React documentation highlights this common antipattern under the heading explaining why `try` and `catch` cannot catch render errors:

```jsx title="src/CommentList.jsx" bad="10"
import Comment from './Comment.jsx';

export default function CommentList({ comments }) {
  try {
    return (
      <ul>
        {comments.map(comment => ~<Comment key={comment.id} comment={comment} />~)} {/* Only describes each Comment: Comment does not run here */}
      </ul>
    );
  } ~catch~ (error) { // **WRONG:** never runs: Comment throws after CommentList has returned
    return <p>Comments are unavailable.</p>;
  }
}
```

When a user loads the page, the screen still renders completely blank.

### Why the `catch` is already over when `Comment` throws

The catch block contains no syntax flaw. It simply completes its lifecycle before the child component throws an error. Returning JSX elements never invokes the child component directly (Lesson 4). React renders descendant components only after the parent function has completed execution (Lesson 13). The runtime order explains this separation:
1. React invokes the comment list component.
2. The `try` block executes the return statement, constructing a descriptor object representing the child elements without throwing.
3. The parent component finishes execution and returns. Its `try` block and corresponding `catch` block exit the call stack.
4. React proceeds to evaluate the child elements, executing each comment component. The second comment throws an unhandled TypeError.
5. With no active catch block on the call stack and no Error Boundary in the component tree, React unmounts the application.

```tree dir=right caption="Why the catch block in CommentList never sees the error that the second Comment throws."
`try` and `catch` in `CommentList` around `<Comment />`
- +1. React calls `CommentList` | The `try` block **only describes** the `<Comment>` tags | Nothing throws, and `CommentList` **returns**
- !2. React calls `Comment` next | The second `Comment` **throws** | The `catch` in `CommentList` is **already finished**
- !3. The error bubbles up | No boundary above it | The page goes **white**
```

Contrast this behavior with standard JavaScript functions. When calling a function directly inside a `try` block, that function runs immediately within the active scope, allowing the catch block to intercept failures. When returning JSX, no child code executes inside the `try` block. The tags merely describe the intended tree.

Standard `try` and `catch` blocks remain valid for synchronous operations evaluated within the component body itself. If an individual component encloses its own property access inside a `try` block, that catch block intercepts the failure. What a `try` block cannot intercept are runtime errors originating in descendant components.

Linting rules help catch this mistake early (Lesson 38). The official React ESLint plugin provides a dedicated rule that flags wrapping JSX in native error handling blocks, guiding developers toward Error Boundaries instead.

---

## PRINCIPLE | `getDerivedStateFromError`: React switches the boundary from its children to its fallback

> [!PRINCIPLE]
> **Principle 3: Class Boundary: `getDerivedStateFromError` Switches `render` to the Fallback**
>
> *An Error Boundary is a class component with `static getDerivedStateFromError`, which returns new state when a child throws during rendering, and a `render` method that returns the fallback when that state says so and the children otherwise.*
>
> No Hook tells a function component that a child threw, so the boundary must be a class. When a child throws, React calls `getDerivedStateFromError`, puts the state it returns into the boundary, and renders the boundary again. This time `render` returns the fallback.
>
> **DO THIS:**
> ```jsx
> class ErrorBoundary extends Component {
>   state = { hasError: false };
>   static ~getDerivedStateFromError~() { // React calls it when a child throws, and the fallback shows
>     return { hasError: true };
>   }
>   render() {
>     return this.state.hasError ? this.props.fallback : this.props.children;
>   }
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function ErrorBoundary({ children, fallback }) {
>   const [~hasError~] = useState(false); // **WRONG:** nothing sets it when a child throws, so the page still goes white
>   return hasError ? fallback : children;
> }
> ```

Most contemporary React components are written as functions. Before React introduced Hooks, developers authored components as JavaScript classes. In modern applications, class components are rarely needed, with one major exception: Error Boundaries. React notifies components of child rendering errors strictly through class lifecycle methods, and no Hook exists to replicate this behavior.

> [!DEFINITION]
> **Class component.** [NEW] A class component is a React component authored as a JavaScript class rather than a function. It extends `Component` from React, maintains local state in a `state` property, and returns UI markup from its `render` method. In modern React, class components primarily serve as Error Boundaries because function components cannot yet intercept descendant rendering errors (Lesson 72).

### The smallest Error Boundary

An Error Boundary alternates between two rendering modes: its wrapped child elements or a fallback view. A boolean state property controls this decision. Here is the minimal implementation recommended by the React documentation:

```jsx title="src/ErrorBoundary.jsx"
import { ~Component~ } from 'react'; // React provides the base class for class components

export default class ~ErrorBoundary extends Component~ { // A class component, not a function
  state = { ~hasError: false~ }; // The first state: no child has thrown yet

  static ~getDerivedStateFromError~(error) { // React calls this when a child throws during rendering
    return { hasError: true }; // The new state: show the fallback
  }

  render() {
    if (~this.state.hasError~) { // React calls render to ask what to show
      return this.props.fallback;
    }
    return ~this.props.children~; // No error: show what sits between the tags
  }
}
```

Components consume an Error Boundary just like any standard container. The fallback UI passes in as a prop, while wrapped components pass in through the children prop (Lesson 9):

```jsx title="Using ErrorBoundary around the comments"
<ErrorBoundary ~fallback={<p>Comments are unavailable.</p>}~> {/* What to show if a child throws */}
  <ul>{comments.map(comment => <Comment key={comment.id} comment={comment} />)}</ul>
</ErrorBoundary>
```

### The class words, one at a time

This implementation introduces five class-oriented features that modern functional code rarely touches:
1. **`class` and `extends Component`.** The class keyword defines an object blueprint in JavaScript. Extending the base component class from React registers it as a valid component.
2. **`state = { hasError: false }`.** This instance property declares initial state before any error occurs. React requires class state to be an object.
3. **`render`.** This required lifecycle method returns the element tree that appears on screen.
4. **`static`.** A static method attaches directly to the class constructor rather than component instances. React invokes this method on the constructor itself.
5. **`getDerivedStateFromError`.** React invokes this lifecycle method when any descendant component throws during rendering. The returned object updates state to trigger the fallback display.

The method receives the thrown value as an argument. While this value is typically an Error instance, JavaScript allows throwing any data type.

### VS | `this.state` vs. state in a function: the same thing, read through `this`

Reading state and props on a class instance follows the same conceptual model as reading values in functional components:

```jsx title="Reading state and props in a class and in a function component"
if (~this.state.hasError~) return ~this.props.fallback~; // In a class: read through this
if (~hasError~) return ~fallback~; // In a function: hasError from useState, fallback from the props
```

The underlying logic is identical. Class components access their internal state and incoming properties through the current instance reference. React documentation confirms that passed props and component state map to instance properties on the class.

### Why a function component cannot be a boundary

Attempting to build an Error Boundary using functional state primitives fails:

```jsx title="A function component that tries to be an Error Boundary"
function ErrorBoundary({ children, fallback }) {
  const [~hasError~, setHasError] = useState(false); // **WRONG:** no Hook tells this function that a child threw
  return hasError ? fallback : children;
}
```

The structure resembles a class implementation, but the execution hook is missing. React never invokes state setters when descendant components throw during rendering. Because React only dispatches errors to class lifecycle methods, this functional wrapper leaves the screen completely blank.

In production engineering, teams adopt one of two standard patterns:
1. **Maintain a single reusable class component.** Author one well-tested boundary class and reuse it across the application hierarchy. This pattern eliminates external package dependencies.
2. **Adopt the `react-error-boundary` library.** The React documentation explicitly recommends this package for production applications. It provides pre-built boundaries with declarative fallback props and reset capabilities.

Higher-level frameworks also provide integrated boundaries. For example, Next.js utilizes dedicated error files to wrap page segments automatically (Lesson 46). Building a custom boundary clarifies the mechanics underlying these framework solutions.

### What React does when the second comment throws

React coordinates a multi-stage render cycle when recovering from a child error:
1. React initiates the render pass for the boundary component. Because its error flag is false, it returns the children.
2. React renders the children, and the second comment throws a TypeError.
3. The error propagates to the boundary, prompting React to call the static error handler method with the error payload.
4. The handler returns an updated state object, which React merges into the boundary state.
5. React initiates a recovery render pass. The boundary evaluates its updated state and returns the fallback UI, preventing crashed elements from reaching the DOM.

```tree dir=right caption="How ErrorBoundary switches from its children to its fallback when a child throws during rendering."
`ErrorBoundary` when the second `Comment` throws
- +1. First render [`hasError: false`] | `render` returns **`this.props.children`** | React renders the comments, and **one throws**
- +2. React calls `getDerivedStateFromError` | It returns **`hasError: true`** | React puts it into **the boundary's state**
- +3. Second render [`hasError: true`] | `render` returns **`this.props.fallback`** | The user sees **Comments are unavailable.**
```

Logging statements inside render methods show repeated invocations during error handling. React re-executes rendering to mount the fallback UI cleanly. In development environments, Strict Mode also runs renders twice to verify component idempotence.

Crucially, the static error handler must remain a pure function (Lesson 14). It must compute and return next state without initiating side effects. External telemetry and logging belong in a separate lifecycle method discussed in Principle 5.

---

## PRINCIPLE | `<ErrorBoundary>` placement: it replaces only what sits inside it

> [!PRINCIPLE]
> **Principle 4: Placement: The Closest Boundary Decides What the User Keeps**
>
> *An Error Boundary replaces only what sits inside it; place it around the part of the page where a fallback message makes sense to the user, such as the comments list or each comment, not around every small piece.*
>
> The error bubbles up to the closest boundary above the broken component. That boundary replaces its own children with its fallback, and everything outside it stays. Around the whole app, the user loses the article. Around each comment, the user loses only the broken comment.
>
> **DO THIS:**
> ```jsx
> {comments.map(comment => (
>   <ErrorBoundary ~key={comment.id}~ fallback={<li>This comment could not be shown.</li>}> {/* Only the broken comment is replaced */}
>     <Comment comment={comment} />
>   </ErrorBoundary>
> ))}
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> createRoot(root).render(
>   ~<ErrorBoundary fallback={<p>Something went wrong.</p>}>~ {/* **WRONG:** the only boundary, so one broken comment still removes the whole article */}
>     <App />
>   </ErrorBoundary>
> );
> ```

A boundary isolates only its own descendant subtree. Unhandled errors bubble upward until hitting the nearest boundary, which swaps its children for the fallback UI while leaving surrounding components untouched. Placing the exact same boundary at different architectural levels yields three distinct user experiences.

### Around the whole app

A common initial instinct is wrapping the entire root application:

```jsx title="src/main.jsx, with the boundary around the whole app"
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  ~<ErrorBoundary fallback={<p>Something went wrong.</p>}>~ {/* Replaces everything App renders */}
    <App />
  </ErrorBoundary>
);
```

```page url=news.example/city-park caption="The page with one boundary around the whole app: the white page becomes one line, and the article is still gone."
line: Something went wrong. | bad
```

This root boundary prevents an empty white screen, but it discards the entire article layout. The visitor still cannot access the content.

### Around the comments list

Moving the boundary inward allows greater isolation. The parent component imports the boundary:

```jsx title="src/App.jsx" startLine="1"
import Comment from './Comment.jsx';
~import ErrorBoundary from './ErrorBoundary.jsx';~ // The class from Principle 3
```

The boundary now wraps the entire list element:

```jsx title="src/App.jsx, with the boundary around the comments list" startLine="12"
      <h1>City park opens on Saturday</h1>
      <h2>Comments</h2>
      ~<ErrorBoundary fallback={<p>Comments are unavailable.</p>}>~ {/* Replaces only the list */}
        <ul>
          {comments.map(comment => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </ul>
      </ErrorBoundary>
```

```page url=news.example/city-park caption="The page with a boundary around the comments list: the title and the heading stay, and John's comment is gone too."
heading: City park opens on Saturday
section: Comments
line: Comments are unavailable. | good
```

The article headline and structure now survive. However, the valid comment from John is lost because both comments reside inside the shared boundary.

### Around each comment

Refining placement further allows isolating individual list items:

```jsx title="src/App.jsx, with a boundary around each comment" startLine="14"
        <ul>
          {comments.map(comment => (
            <ErrorBoundary ~key={comment.id}~ fallback={<li>This comment could not be shown.</li>}> {/* The key moves to the outer tag */}
              <Comment comment={comment} />
            </ErrorBoundary>
          ))}
        </ul>
```

```page url=news.example/city-park caption="The page with a boundary around each comment: only the broken comment is replaced."
heading: City park opens on Saturday
section: Comments
line: John: Great news! | good
line: This comment could not be shown. | good
```

This granular layout requires two small adjustments:
1. **The key prop moves to the boundary wrapper.** When rendering lists using map, the key belongs on the outermost element returned by the callback (Lesson 18).
2. **The fallback renders as a list item.** Because the boundary sits directly inside an unordered list element, semantic HTML requires an item tag.

The boundary logic remains identical across all three examples, but the resulting user experience changes dramatically:

```tree caption="The same broken comment with the same ErrorBoundary in three places, and what the user keeps in each."
Where we place `<ErrorBoundary>`
- !Around the whole app [`<ErrorBoundary><App /></ErrorBoundary>`] | Replaces **everything** | The user sees **Something went wrong.** and **no article**
- +Around the comments list [`<ErrorBoundary><ul>...</ul></ErrorBoundary>`] | Replaces **only the list** | The user keeps **the title**, and loses **John's comment** too
- +Around each comment [`<ErrorBoundary key={comment.id}>`] | Replaces **only the broken comment** | The user keeps **the title and John's comment**
```

### How to choose the place

React documentation describes this architectural decision as determining boundary granularity. Strategic placement means positioning boundaries where a fallback message provides meaningful context. The official documentation offers a clear parallel for messaging applications. Placing a boundary around conversation lists or individual message bubbles makes sense, whereas wrapping every isolated avatar icon creates unnecessary fragmentation.

Our comments feature illustrates these exact options. Placing a boundary around an author name alone would create a confusing partial comment. Wrapping the full comment or the collection provides a cohesive fallback.

A root boundary still serves an important role as a final catch-all net. It ensures users see a styled apology instead of a blank screen, provided granular boundaries protect individual features first.

---

## PRINCIPLE | `componentDidCatch`: the team gets the error, the user gets the fallback

> [!PRINCIPLE]
> **Principle 5: Reporting: `componentDidCatch` Tells the Team, the Fallback Tells the User**
>
> *`componentDidCatch` is the optional method React calls after a child throws during rendering, so the boundary can send the error and `info.componentStack` to an error reporting service; showing the fallback stays the job of `getDerivedStateFromError`.*
>
> The fallback hides the error from the user, so without a report the team never learns which comment broke. `componentDidCatch` may do side effects, such as a call to a server. `getDerivedStateFromError` must stay pure and only return new state.
>
> **DO THIS:**
> ```jsx
> ~componentDidCatch~(error, info) { // Side effects belong here: the team receives the error and where it happened
>   logErrorToMyService(error, info.componentStack);
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> static getDerivedStateFromError(error) {
>   ~logErrorToMyService(error)~; // **WRONG:** a side effect in a method that must stay pure
>   return { hasError: true };
> }
> ```

The application now displays an elegant fallback message instead of a blank screen, ensuring visitors can read the article. While helpful for users, this fallback suppresses the error display, leaving developers unaware that data corruption occurred. React provides a secondary lifecycle method specifically to transmit telemetry:

```jsx title="Two methods that receive the same error"
static ~getDerivedStateFromError~(error) { // Changes what the user sees
  return { hasError: true };
}

~componentDidCatch~(error, info) { // Tells the team what broke
  logErrorToMyService(error, info.componentStack);
}
```

### VS | `getDerivedStateFromError` vs. `componentDidCatch`: one changes the screen, the other reports

Both methods receive the thrown error, but they serve distinct operational roles:
- **`getDerivedStateFromError`** runs as a static method, receives the error, and returns updated state. It must remain a pure function, and boundaries require it to render fallback UI.
- **`componentDidCatch`** runs as an instance method, receives the error alongside diagnostic info, and returns nothing. It can execute side effects like network requests, and it remains optional.

The official documentation clearly separates their duties: the static error handler must remain pure, while asynchronous side effects like analytics calls require the secondary catch lifecycle method.

### What the team receives

React calls the catch lifecycle method whenever a descendant component throws an unhandled error during rendering. Its primary role in production is transmitting crash reports to monitoring platforms.

An error monitoring service collects runtime telemetry from client browsers, surfacing stack traces to engineering teams. The placeholder logging call demonstrates where production tracking libraries integrate.

The secondary parameter provides a component stack string. The React documentation notes that this trace lists the component that crashed alongside ancestor components and file locations. In our application, it indicates that a comment component threw within the boundary inside the app container, identifying the root cause immediately.

In production builds, component identifiers undergo minification. Bundlers shorten names to brief character tokens, making source maps crucial for deciphering stack traces.

### Our boundary, with the report

The boundary class incorporates the reporting lifecycle method:

```jsx title="src/ErrorBoundary.jsx" good="11,12,13"
import { Component } from 'react';
import { logErrorToMyService } from './errorService.js';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  ~componentDidCatch~(error, info) { // React calls it after a child throws during rendering
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

Our demonstration service logs the error payload directly to the developer console. A production implementation dispatches these payloads to remote endpoints:

```js title="src/errorService.js"
export function logErrorToMyService(error, componentStack) {
  console.log('Reported:', ~error.message~); // A real app sends error and componentStack to its service here
}
```

The user continues to see the clean fallback message:

```page url=news.example/city-park caption="The page after the report is added: the user sees the same fallback as before."
heading: City park opens on Saturday
section: Comments
line: John: Great news! | good
line: This comment could not be shown. | good
```

The developer console documents the entire recovery process. React outputs an error entry identifying the crashing component and boundary, followed by our telemetry output:

```devconsole width=full caption="The Console: one error message from React with the error the boundary caught, and then our report from componentDidCatch."
x TypeError: Cannot read properties of undefined (reading 'name') The above error occurred in the <Comment> component. React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
+ Reported: Cannot read properties of undefined (reading 'name') | errorService.js:2
```

React 19 routes every error caught by an Error Boundary to the standard console error logger, guaranteeing developers maintain visibility during debugging.

### Two mistakes with the two methods

1. **Triggering state updates inside the catch method.** Legacy code sometimes called state setters inside this method. React deprecates this pattern in favor of the static error handler.
2. **Initiating side effects inside the static handler.** That method must remain pure. Network requests and telemetry belong exclusively inside the catch method.

### Reporting errors for the whole app

Applications can also register centralized error listeners at the root level. The root creation API accepts three reporting callbacks (Lesson 7):
1. **`onCaughtError`** executes when React intercepts an error inside an Error Boundary.
2. **`onUncaughtError`** executes when an unhandled error escapes without encountering any Error Boundary.
3. **`onRecoverableError`** executes when React successfully recovers from transient framework issues.

Each handler receives the error instance alongside diagnostic component stack metadata. While valuable for global telemetry, these callbacks do not render fallback UI. Only an Error Boundary can swap crashed elements for a fallback interface.

When applications omit these root callbacks, React 19 forwards unhandled errors to the standard browser error reporter. That mechanism generates the uncaught exception warnings observed in earlier principles.

---

## PRINCIPLE | `onClick`: an error in a click handler skips the boundary, so the handler needs its own `try` and `catch`

> [!PRINCIPLE]
> **Principle 6: Event Handlers: A Click Error Never Reaches the Boundary**
>
> *An Error Boundary catches only errors thrown while React renders its children; errors in event handlers, in asynchronous code such as `setTimeout`, in the boundary itself, and during server side rendering are not caught; an error thrown inside `startTransition` from `useTransition` is caught.*
>
> A click handler runs when the user clicks, not while React renders. So when it throws, React never calls `getDerivedStateFromError`, and the page stays as it was, with the error only in the Console. Inside a handler, `try` and `catch` work, because the handler's own code runs inside the `try`.
>
> **DO THIS:**
> ```jsx
> function handleReply() {
>   ~try~ { // The handler catches its own error and tells the user
>     setNotice('Replying to ' + comment.author.name);
>   } catch (error) {
>     setNotice('You cannot reply to this comment.');
>   }
> }
> ```
>
> **DO NOT DO THIS:**
> ```jsx
> function handleReply() {
>   setNotice('Replying to ' + ~comment.author.name~); // **WRONG:** throws after the click, and the boundary around Comment never sees it
> }
> ```

Consider adding a reply button to each comment. The same property read can happen during rendering or inside a click callback, even when both sit inside the same boundary:

```jsx title="The same broken read, while rendering and in a click handler"
<li>{~comment.author.name~}: {comment.text}</li> {/* Throws while React renders: the boundary shows its fallback */}
<button onClick={() => setNotice('Replying to ' + ~comment.author.name~)}>Reply</button> {/* Throws when the user clicks: the boundary does nothing */}
```

Both snippets throw identical runtime errors from code wrapped by the same boundary. Yet their outcomes differ completely. An Error Boundary catches errors thrown while React renders child elements. An event handler executes later when user input triggers an event (Lesson 11). Because React is not rendering when the click fires, the boundary never intercepts the error.

### The user clicks Reply, and nothing happens

To observe event handling independently, this version of the comment component avoids reading author data during render. It reads author information only when the user clicks the reply button:

```jsx title="src/Comment.jsx, with a Reply button"
import { useState } from 'react';

export default function Comment({ comment }) {
  const [notice, setNotice] = useState('');

  function handleReply() {
    setNotice('Replying to ' + ~comment.author.name~); // Throws only when the user clicks Reply on comment 2
  }

  return (
    <li>
      {comment.text} <button onClick={handleReply}>Reply</button>
      {notice && <p>{notice}</p>}
    </li>
  );
}
```

The page opens cleanly with both comments visible. The visitor then clicks the reply button on the second comment:

```page url=news.example/city-park caption="The page before the click: both comments show their text and a Reply button."
heading: City park opens on Saturday
section: Comments
line: Great news! [Reply]
line: See you there. [Reply]
```

```page url=news.example/city-park caption="The page after the user clicks Reply on the second comment: nothing changes, and no fallback appears."
heading: City park opens on Saturday
section: Comments
line: Great news! [Reply]
line: See you there. [Reply] | bad
```

```devconsole width=full caption="The Console after the click: the error appears only here."
x Uncaught TypeError: Cannot read properties of undefined (reading 'name')
```

The user clicks the action, yet the interface remains frozen. No fallback appears on screen. The underlying event cycle explains this behavior:
1. The user clicks the reply button on the second comment.
2. The browser event dispatches to the click handler, where evaluating the missing property throws an error.
3. Because no render phase is active, React never invokes the boundary static error handler.
4. The existing DOM nodes remain on screen without rendering a fallback.
5. The unhandled exception surfaces only within the developer console.

Developers unfamiliar with this distinction often assume the boundary is broken. The boundary works properly, but React purposefully excludes event handlers from boundary handling.

### The fix inside a handler: `try` and `catch`

Inside an event handler, function statements execute synchronously within the handler block. Standard error handling blocks work reliably here:

```jsx title="src/Comment.jsx, handleReply with try and catch" startLine="6"
  function handleReply() {
    ~try~ { // The handler's own code runs inside the try, so the catch can see its error
      setNotice('Replying to ' + comment.author.name);
    } catch (error) {
      setNotice('You cannot reply to this comment.');
    }
  }
```

```page url=news.example/city-park caption="The page after the user clicks Reply on the second comment, with try and catch in the handler."
heading: City park opens on Saturday
section: Comments
line: Great news! [Reply]
line: See you there. [Reply]
line: You cannot reply to this comment. | good
```

This confirms the operational rule of thumb: use Error Boundaries for the rendering phase, and standard error handling blocks inside event handlers.

### What an Error Boundary does not catch

The official documentation specifies four execution contexts where Error Boundaries do not catch errors:
1. **Event handlers**, such as button click or form submit listeners.
2. **Asynchronous callbacks**, including timers like `setTimeout` or animation frame callbacks that run on subsequent event loop ticks.
3. **Server side rendering**, which operates under separate server execution pipelines.
4. **Errors thrown within the boundary itself**, rather than inside its child elements. Those errors bubble to the next enclosing boundary higher up.

### One exception: `startTransition`

When an event handler schedules updates inside a transition (Lesson 67), thrown errors do route to Error Boundaries. The official documentation confirms that errors thrown inside a transition function bubble to the nearest boundary:

```jsx title="The same broken read inside startTransition"
const [isPending, startTransition] = useTransition();

function handleReply() {
  ~startTransition~(() => { // An error thrown in here goes to the closest Error Boundary
    setNotice('Replying to ' + comment.author.name);
  });
}
```

Because each comment has its own boundary wrapper, clicking the reply button now swaps that specific comment for its fallback. React documents that failing transition callbacks cause the nearest Error Boundary to render its fallback UI.

Form Actions follow this same routing mechanism (Lessons 41 and 42). Rejected promises unwrapped with the `use` function follow this path as well (Lesson 71).

```tree caption="Three errors thrown from code inside the same ErrorBoundary, and which of them the boundary catches."
The same `TypeError` inside `<ErrorBoundary>`
- +While React renders `Comment` [`<li>{comment.author.name}</li>`] | Thrown **during rendering** | The boundary shows **its fallback**
- !In a plain click handler [`onClick`] | Thrown **after the user clicks**, outside rendering | The boundary **does nothing**: use **`try` and `catch`**
- +Inside `startTransition` in a click handler [`startTransition`] | React **sends the error** to the closest boundary | The boundary shows **its fallback**
```

---

## All 6 Principles Together

### The complete files

Here is the complete article application. It maintains an Error Boundary around each comment and transmits diagnostic telemetry to the engineering team. Because the reply button was used solely to contrast execution phases, the comment component returns to its clean display form:

```jsx title="src/main.jsx"
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(~<App />~); // 1. React calls App first
```

```jsx title="src/App.jsx"
import Comment from './Comment.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';

const comments = [
  { id: 1, author: { name: 'John' }, text: 'Great news!' },
  { id: 2, text: 'See you there.' },
];

export default function App() {
  return (
    <main>
      <h1>City park opens on Saturday</h1>
      <h2>Comments</h2>
      <ul>
        {comments.map(comment => (
          ~<ErrorBoundary key={comment.id} fallback={<li>This comment could not be shown.</li>}>~ {/* 2. Principle 4: one boundary for each comment */}
            <Comment comment={comment} />
          </ErrorBoundary>
        ))}
      </ul>
    </main>
  );
}
```

```jsx title="src/Comment.jsx"
export default function Comment({ comment }) {
  return <li>{~comment.author.name~}: {comment.text}</li>; // 3. Principle 1: throws for comment 2, inside its own boundary
}
```

```jsx title="src/ErrorBoundary.jsx"
import { Component } from 'react';
import { logErrorToMyService } from './errorService.js';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static ~getDerivedStateFromError~(error) { // 4. Principle 3: the next render shows the fallback
    return { hasError: true };
  }

  ~componentDidCatch~(error, info) { // 5. Principle 5: the team receives the error
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

```js title="src/errorService.js"
export function logErrorToMyService(error, componentStack) {
  console.log('Reported:', ~error.message~); // A real app sends error and componentStack to its service here
}
```

```page url=news.example/city-park caption="The finished article page: the title and John's comment stay, and only the broken comment is replaced."
heading: City park opens on Saturday
section: Comments
line: John: Great news! | good
line: This comment could not be shown. | good
```

```devconsole width=full caption="The Console of the finished page: the error React caught, and our report."
x TypeError: Cannot read properties of undefined (reading 'name') The above error occurred in the <Comment> component. React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
+ Reported: Cannot read properties of undefined (reading 'name') | errorService.js:2
```

### The order in which React calls each piece

When a visitor opens the article, React begins rendering from the root component. Because each comment resides in an isolated boundary, the failure in the second comment halts at its enclosing boundary:

```tree caption="The order in which React calls the components of the finished page, and what the second boundary does when its Comment throws."
`App` [1. React calls `App`] | Returns the title, the heading, and **two `ErrorBoundary` tags**
- +First `ErrorBoundary` [2. `hasError` is `false`] | `render` returns **its children**
  - +`Comment` for John [3. Returns **John: Great news!**] | No error
- !Second `ErrorBoundary` [4. `hasError` is `false`] | `render` returns **its children**
  - !`Comment` for comment 2 [5. Throws a **`TypeError`**] | The error **bubbles up** to the second boundary
  - +`getDerivedStateFromError` [6. Returns **`hasError: true`**] | React renders the boundary **again**, and `render` returns **the fallback**
  - +`componentDidCatch` [7. Calls **`logErrorToMyService`**] | The team receives the error and **`componentStack`**
```

### Where the error is caught, and what the user sees

| Situation | What the user sees | The React rule |
| :--- | :--- | :--- |
| **No Error Boundary, and a comment throws during rendering** | A white page with no message | React removes the whole UI of the root |
| **`try` and `catch` around the returned JSX** | The same white page | The child runs after the parent returns, so the `catch` never runs |
| **A function component with `useState` as the boundary** | The same white page | Only a class with `static getDerivedStateFromError` can catch |
| **One boundary around the whole app** | One line, and no article | A boundary replaces everything inside it |
| **A boundary around each comment** | The article, John's comment, and one fallback line | Only the children of the closest boundary are replaced |
| **`componentDidCatch` in the boundary** | The same fallback; the team gets a report | Side effects go in `componentDidCatch`, never in `getDerivedStateFromError` |
| **An error in a plain click handler** | Nothing changes; the error is only in the Console | Boundaries catch errors during rendering only; use `try` and `catch` in the handler |

Remember the core principle of this lesson: **an error thrown during rendering travels upward to the nearest Error Boundary above it. That boundary displays its fallback UI, while all components outside the boundary remain intact on screen.**

---

## For the Interview

> **The Interview Question:** How do you catch a rendering error before it unmounts the whole app?

### How to Answer Clearly in 30 Seconds

"By default, an unhandled error during rendering causes React to unmount the entire application root, blanking the screen. Wrapping returned JSX in `try` and `catch` cannot catch the error because child components execute only after the parent returns. The error bubbles up the component tree until intercepted by an Error Boundary. An Error Boundary is a class component implementing `static getDerivedStateFromError`, which returns updated state directing `render` to display a fallback interface. Three core guidelines apply:
1. **Position boundaries strategically where fallback UI makes sense**, such as around comment lists or individual list items, rather than solely at the root.
2. **Implement `componentDidCatch`** to forward the error payload and component stack trace to telemetry services.
3. **Handle event handler and timer errors locally** using standard `try` and `catch` blocks, since boundaries catch errors only during rendering.

In production applications, teams typically adopt the `react-error-boundary` package instead of maintaining custom class implementations."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Why can't you write an Error Boundary as a function component?"**
   React provides no Hook alternative. React queries `getDerivedStateFromError` and `componentDidCatch` exclusively on class component instances. The React documentation notes that no direct functional equivalent exists yet. Teams maintain a reusable boundary class or adopt the `react-error-boundary` package. That library adds declarative features like `fallbackRender` and `resetKeys` to reset the boundary when dependencies change.
2. **"Does an Error Boundary catch an error thrown in a click handler?"**
   No. Boundaries catch errors thrown exclusively during the synchronous rendering of descendant components. Event handlers execute on subsequent event loop ticks, outside the render phase. Unhandled click errors log to the console while leaving existing UI untouched. Handlers require internal `try` and `catch` blocks. The key exception is `startTransition`: errors thrown within transition callbacks route directly to the nearest Error Boundary.
3. **"What is the difference between `getDerivedStateFromError` and `componentDidCatch`?"**
   Both methods receive the thrown error, but they fulfill separate roles. The static error handler method must remain pure, computing next state so the subsequent render displays the fallback interface. In contrast, `componentDidCatch` is an instance method designed for side effects, receiving the error alongside the component stack to dispatch telemetry. Initiating side effects inside the static handler breaks functional purity, while calling `setState` inside the catch method is deprecated.

```tree dir=right caption="Interview summary: what catches a rendering error, and what does not."
Catching an error thrown while React renders a child
- !`try` and `catch` around the returned JSX | The parent **has already returned** when the child throws | The page still goes **white**
- +An Error Boundary class [`getDerivedStateFromError`] | Catches the error that **bubbles up** from its children | Shows **its fallback**; the rest of the page **stays**
- +`componentDidCatch` in the same class | Receives the error and **`componentStack`** | Sends a **report** to the team
```
