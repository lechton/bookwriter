# React Architectural Informational Flow Catalog
> Canonical ASCII Modeling of Data, Events, Context, and State Transitions for React Production Lectures

This catalog formalizes the universal models of **informational flow** in React component architecture. Each archetype maps a concrete engineering problem, its architectural invariant, and a pair of mathematically aligned ASCII diagrams: **Phase 1 (The Structural Setup / Top-Down Inheritance)** and **Phase 2 (The Runtime Execution / Bottom-Up Action)**.

---

## The Four Visual Invariants of ASCII Informational Flow

1. **Fixed Monospace Pitch (The 77-Column Grid)**: All diagrams are calibrated for standard Letter/A4 portrait pages. Main branch containers occupy 46 columns, vertical stems sit at column 25, and lateral branch boxes terminate at column 77.
2. **Vertical Centering of Ingress Vectors**: Branching arrows (`─►` and `◄─`) connect directly into the vertical center line (`│ ComponentName │`) of child boxes. The top border (`┌─┐`) sits on the preceding row, ensuring boxes never dangle low.
3. **Dual-Phase Comparative Symmetry**: Every model contrasts the static declaration/render pass (downward prop and callback wiring) with the dynamic runtime event pass (upward callback emission, state mutation, or reconciler collection).
4. **Vector-Sharp Print Fidelity**: Formatted in pure UTF-8 box-drawing glyphs (`┌`, `─`, `┐`, `│`, `└`, `┘`, `├`, `┬`, `▲`, `▼`, `◄`, `►`) and JetBrains Mono monospace font. Compiles into pure vector outlines in Prince XML with zero raster blurriness.

---

## Archetype 01: Unidirectional Props Flow (Parent to Child)
* **Curriculum Role**: Foundation for Lecture 06 (`#props`).
* **The Engineering Friction**: Beginners attempt to mutate props directly inside child components, causing state drift or runtime exceptions.
* **The Architectural Truth**: Props flow strictly downward from parent to child. The incoming props object is frozen by React; components must treat props as read-only inputs.

```jsx title="Parent-Child Props Contract"
// App.jsx (Owner) passes frozen data down
function App() {
  const [edition] = useState("Morning");
  return <EditorialFeed edition={edition} />;
}

// EditorialFeed.jsx (Child) reads props as immutable
function EditorialFeed({ edition }) {
  // props.edition = "Evening"; // [X] TYPE ERROR: props are read-only!
  return <h2>{edition} Edition</h2>;
}
```

<!-- template: templates/01-unidirectional-props-flow.html -->

---

## Archetype 02: Inverse Callback Emission (Child to Parent)
* **Curriculum Role**: Foundation for Lecture 15 (`#callback_props`).
* **The Engineering Friction**: A child button needs to trigger an action in a parent screen, but data only flows down. Beginners attempt horizontal DOM queries or window globals.
* **The Architectural Truth**: Inverse data flow is achieved by passing state-mutating functions downward as callback props. When a user interacts with the child, the child executes the inherited function, emitting data upward along the vertical hierarchy.

```jsx title="Callback Invocation Pattern"
// NewsroomPage.jsx (Parent) defines state and mutation method
function NewsroomPage() {
  const [category, setCategory] = useState("All");
  return <FilterBar onSelectCategory={setCategory} />;
}

// CategoryButton.jsx (Child) executes callback on click
function CategoryButton({ label, onSelectCategory }) {
  return <button onClick={() => onSelectCategory(label)}>{label}</button>;
}
```

<!-- template: templates/02-inverse-callback-emission.html -->

---

## Archetype 03: Context Ambient Broadcast (Provider to Deep Descendant)
* **Curriculum Role**: Foundation for Lecture 30 (`#context`).
* **The Engineering Friction**: Deep UI widgets require global preferences (like theme, auth, or currency). Passing props through ten intermediate layout components creates rigid, unmaintainable "prop drilling."
* **The Architectural Truth**: The Context API establishes an ambient broadcast channel. The `<Context.Provider>` broadcasts to the entire subtree; intermediate layout containers remain completely decoupled; deep consumers read directly via `useContext()`.

```jsx title="Context Ambient Teleportation"
// App.jsx wraps subtree in Provider
const ThemeContext = createContext("midnight");
function App() {
  return (
    <ThemeContext.Provider value="midnight">
      <NewsLayout /> {/* Zero theme props passed */}
    </ThemeContext.Provider>
  );
}

// ThemeBadge.jsx consumes context directly
function ThemeBadge() {
  const theme = useContext(ThemeContext);
  return <span className={theme}>{theme}</span>;
}
```

<!-- template: templates/03-context-ambient-broadcast.html -->

---

## Archetype 04: Lifting State Up (Sibling to Sibling via Common Ancestor)
* **Curriculum Role**: Foundation for Lecture 26 (`#lifting_state`).
* **The Engineering Friction**: Sibling A (`FontScaleSlider`) needs to resize text in Sibling B (`ArticleBody`). Neither component can access the other's private scope; developers resort to fragile window hacks.
* **The Architectural Truth**: Sibling components coordinate by lifting their shared state up to their closest common ancestor. The parent passes data down to the consumer as a prop, and passes a change handler down to the controller as a callback, creating a triangular coordination loop.

```jsx title="Triangular Coordination Loop"
function ArticleWorkspace() {
  const [fontSize, setFontSize] = useState(18); // Lifted to common parent
  return (
    <>
      <FontSlider onFontSizeChange={setFontSize} /> {/* Controller */}
      <ArticleBody fontSize={fontSize} />           {/* Consumer */}
    </>
  );
}
```

<!-- template: templates/04-lifting-state-triangular.html -->

---

## Archetype 05: State Snapshot & Re-render Cycle (Closure Invariants)
* **Curriculum Role**: Foundation for Lecture 18 (`#state_snapshots`).
* **The Engineering Friction**: An event handler calls `setLikes(likes + 1)` and immediately logs `likes`, seeing the old number. Developers assume the setter is delayed or buggy.
* **The Architectural Truth**: State is an immutable snapshot captured by JavaScript closures for a specific render pass. Calling a setter does not mutate the running frame; it queues an update in React's internal Fiber workLoop and schedules a brand-new render with a fresh snapshot.

```jsx title="Snapshot Mental Model"
function StoryCard() {
  const [likes, setLikes] = useState(0);
  function handleLike() {
    setLikes(likes + 1);
    console.log(likes); // Always prints 0! Frozen in current closure.
  }
  return <button onClick={handleLike}>Likes: {likes}</button>;
}
```

<!-- template: templates/05-state-snapshot-lifecycle.html -->

---

## Archetype 06: Container Slot Composition with `children` (Inversion of Control)
* **Curriculum Role**: Foundation for Lecture 07 (`#children`).
* **The Engineering Friction**: Building multi-purpose card or modal containers by adding twenty boolean props creates brittle, unmaintainable configuration APIs.
* **The Architectural Truth**: The `children` prop captures arbitrary JSX passed between opening and closing tags. The caller dictates inner presentation while the container dictates layout geometry and visual chrome, achieving complete inversion of control.

```jsx title="Slot Inversion of Control"
function CardContainer({ children }) {
  return <div className="card-shell">{children}</div>; // Opaque slot
}

function App() {
  return (
    <CardContainer>
      <ArticleDetail headline="Transit Deal Approved" />
    </CardContainer>
  );
}
```

<!-- template: templates/06-children-slot-composition.html -->

---

## Archetype 07: React 19 Action & Async Transition Flow (`useActionState`)
* **Curriculum Role**: Foundation for Lecture 40 (`#actions`).
* **The Engineering Friction**: Managing form submissions with manual `isLoading`, `error`, and `data` states creates impossible intermediate states and UI tearing during slow network calls.
* **The Architectural Truth**: React 19 Actions automatically wrap state mutations in concurrent Transitions. `useActionState` manages pending flags, optimistic updates, and resolved data commits across asynchronous boundaries with zero layout tearing.

```jsx title="React 19 Action Pipeline"
function SubscriptionForm() {
  const [state, formAction, isPending] = useActionState(updateEmail, { ok: false });
  return (
    <form action={formAction}>
      <input name="email" disabled={isPending} />
      <button type="submit">{isPending ? "Subscribing..." : "Join"}</button>
    </form>
  );
}
```

<!-- template: templates/07-react19-actions-transitions.html -->

---

## Archetype 08: External Store Subscription Flow (`useSyncExternalStore`)
* **Curriculum Role**: Foundation for Lecture 60 (`#external_stores`).
* **The Engineering Friction**: Subscribing to mutable stores outside React (browser APIs, WebSockets, or global state stores) during concurrent rendering causes UI tearing when values change mid-render.
* **The Architectural Truth**: `useSyncExternalStore` registers synchronous read callbacks against external stores. If an external store mutates during a concurrent yield, React detects the mismatch via `Object.is` and restarts the render synchronously, completely eliminating visual tearing.

```jsx title="Synchronous External Store Subscription"
function useOnlineStatus() {
  return useSyncExternalStore(
    callback => {
      window.addEventListener("online", callback);
      window.addEventListener("offline", callback);
      return () => {
        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
      };
    },
    () => navigator.onLine // Synchronous snapshot reader
  );
}
```

<!-- template: templates/08-external-store-subscription.html -->

---

## Archetype 09: Ambient Context Abstraction Box (Dashed Atmosphere Boundary)
* **Curriculum Role**: Advanced complement to Lecture 30 (`#context_abstraction`).
* **The Engineering Friction**: Developers think of Context as an invisible background global variable, losing track of which components inject data towards the boundary and which components extract values from it.
* **The Architectural Truth**: React Context is an ambient abstraction represented as a floating dashed-dotted boundary. The Provider seeds state *towards* the ambient box, mutators dispatch actions *towards* the ambient box, while consumer components subscribe directly *from* the ambient box via `useContext()`. Intermediate layout branches pass through completely decoupled.

```jsx title="Ambient Context Broker Pattern"
// 1. Provider seeds ambient abstraction
function App() {
  const [theme, setTheme] = useState("midnight");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <NewsLayout /> {/* Zero theme props passed */}
    </ThemeContext.Provider>
  );
}

// 2. Child Mutator dispatches towards ambient box
function ThemeToggle() {
  const { setTheme } = useContext(ThemeContext);
  return <button onClick={() => setTheme("dawn")}>Switch to Dawn</button>;
}

// 3. Child Subscriber reads from ambient box
function ThemeBadge() {
  const { theme } = useContext(ThemeContext);
  return <span className={theme}>{theme}</span>;
}
```

<!-- template: templates/09-ambient-context-abstraction-box.html -->

---

## Architectural Experiments: Ambient Context Modeling Variations
* **Purpose**: Research and comparative verification of alternative ASCII geometry for ambient abstractions.
* **The Visual Invariant**: Dashed-dotted borders (`┌┄┄┄┄┐`, `┊`, `└┄┄┄┄┘`) demarcate non-physical, ambient React boundaries (Context pools, memory environments, and subscriber scopes) distinctly from solid-line physical component containers (`┌────┐`, `│`, `└────┘`).

<!-- template: templates/10-context-experiments.html -->
