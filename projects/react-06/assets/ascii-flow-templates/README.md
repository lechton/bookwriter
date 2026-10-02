# React Architectural Informational Flow Catalog

A version-independent, print-ready catalog of ASCII informational flow models for React component architectures. This catalog formalizes how data, events, context, and state transitions move across component trees using pure monospace ASCII diagrams, designed for seamless compilation into textbooks and PDF lecture decks via Prince XML.

---

## Catalog Structure

```text
assets/ascii-flow-templates/
├── README.md                          # Architectural specification and usage guide
├── ascii-flow.css                     # Custom high-fidelity print stylesheet for Prince XML
├── build.mjs                          # Compilation pipeline (Markdown -> HTML -> PDF -> PNG)
├── demo.md                            # Master demo document embedding all 8 flow archetypes
├── demo.html                          # Compiled standalone HTML document
├── demo.pdf                           # Compiled 16-page vector PDF (2 pages per archetype)
├── screenshots/                       # High-resolution PNG page renders (pdftoppm -r 150)
│   ├── page-01.png ... page-16.png
└── templates/                         # Modular standalone HTML templates
    ├── 01-unidirectional-props-flow.html
    ├── 02-inverse-callback-emission.html
    ├── 03-context-ambient-broadcast.html
    ├── 04-lifting-state-triangular.html
    ├── 05-state-snapshot-lifecycle.html
    ├── 06-children-slot-composition.html
    ├── 07-react19-actions-transitions.html
    └── 08-external-store-subscription.html
```

---

## The 9 Canonical Informational Flow Archetypes

1. **Archetype 01: Unidirectional Props Flow (Parent to Child)**
   - *Curriculum Anchor*: Lecture 06 (`#props`)
   - *Phase 1*: Top-down prop passing and read-only input contract from root owner down to child cards.
   - *Phase 2*: Immutability invariant showing child attempts to mutate props triggering `ReadOnlyError` while pure render succeeds.

2. **Archetype 02: Inverse Callback Emission (Child to Parent)**
   - *Curriculum Anchor*: Lecture 15 (`#callback_props`)
   - *Phase 1*: Downward function reference inheritance (`onSelect={handleSelect}`).
   - *Phase 2*: Bottom-up action where user clicks child button, invoking inherited callback and updating parent state.

3. **Archetype 03: Context Ambient Broadcast (Provider to Deep Descendant)**
   - *Curriculum Anchor*: Lecture 30 (`#context`)
   - *Phase 1*: Ambient channel setup where `<ThemeContext.Provider>` wraps layout, bypassing intermediate chrome.
   - *Phase 2*: Direct consumer subscription via `useContext()`, updating child badges immediately without re-rendering layout wrappers.

4. **Archetype 04: Lifting State Up (Sibling to Sibling via Common Ancestor)**
   - *Curriculum Anchor*: Lecture 26 (`#lifting_state`)
   - *Phase 1*: State ownership placed in closest common ancestor, wiring callbacks to controller sibling and props to consumer sibling.
   - *Phase 2*: Triangular runtime loop where slider interaction fires callback upward to parent, and parent pushes fresh state down to article body.

5. **Archetype 05: State Snapshot & Re-render Cycle (Closure Invariants)**
   - *Curriculum Anchor*: Lecture 18 (`#state_snapshots`)
   - *Phase 1*: Render frame closure capturing state snapshot at frozen point in time ($t_0$).
   - *Phase 2*: Event execution queuing updates into Fiber workLoop, scheduling fresh render pass ($t_1$) with next snapshot.

6. **Archetype 06: Container Slot Composition with `children` (Inversion of Control)**
   - *Curriculum Anchor*: Lecture 07 (`#children`)
   - *Phase 1*: Inversion of control setup where consumer passes JSX into generic card frame slot without prop explosion.
   - *Phase 2*: Layout boundary encapsulation where container controls styling/chrome while child owns presentation logic.

7. **Archetype 07: React 19 Action & Async Transition Flow (`useActionState`)**
   - *Curriculum Anchor*: Lecture 40 (`#actions`)
   - *Phase 1*: Declarative action binding connecting native `<form action={formAction}>` to asynchronous action handler.
   - *Phase 2*: Concurrent transition lifecycle managing pending states, optimistic branch execution, and synchronous commit.

8. **Archetype 08: External Store Subscription Flow (`useSyncExternalStore`)**
   - *Curriculum Anchor*: Lecture 60 (`#external_stores`)
   - *Phase 1*: Synchronous snapshot reader registration preventing tearing during concurrent yields.
   - *Phase 2*: Subscription listener firing on external events (`online`/`offline`), validating consistency via `Object.is`.

9. **Archetype 09: Ambient Context Abstraction Box (Dashed Atmosphere Boundary)**
   - *Curriculum Anchor*: Lecture 30 (`#context_abstraction`)
   - *Phase 1*: Provider hydrates ambient dashed box (`────────►`); intermediate nodes pass through unaware; child consumers extract values directly from the ambient box (`◄────────`).
   - *Phase 2*: Child controller sends state mutations towards the ambient box (`────────►`); dashed box invalidates and emits fresh snapshots (`◄────────`) to subscribed children; intermediate components bail out completely.

---

## Architectural Experiments: Ambient Context Modeling Variations

The catalog includes an experimental research section (`templates/10-context-experiments.html`) comparing three alternative mental models for ambient abstractions:

- **Experiment A: Central Ambient Broker Hub**
  - Mutators dispatch updates towards a centralized ambient broker box; consumers subscribe directly from the broker. Intermediate tree structure is visually decoupled.
- **Experiment B: Ambient Atmosphere Enclosure**
  - An outer dashed perimeter (`┌┄┄...┄┄┐`, `┊`, `└┄┄...┄┄┘`) physically envelops the child subtree, visualizing how passive intermediate nodes inhabit the ambient atmosphere while consumers extract data directly.
- **Experiment C: Multi-Context Layering**
  - Two independent parallel ambient dashed boxes (`ThemeContext` and `AuthContext`) show selective subscription: Child 1 reads from Theme, Child 2 reads from Auth, and Child 3 joins both feeds via a symmetric T-junction (`┬`).

---

## The Five Visual Invariants of ASCII Informational Flow

1. **Fixed Monospace Pitch (77-Column Grid)**: All diagrams fit comfortably within standard Letter/A4 portrait page widths at 7.3pt JetBrains Mono. Primary containers occupy 46 columns, vertical trunks sit at column 25, and lateral branch boxes terminate at column 77.
2. **Strict Vertical Centering of Ingress Vectors**: Branching arrows (`─►`, `◄─`, `►`, `◄`) connect directly into the vertical center line (`│ ComponentName │`) of child/sibling boxes. The top border (`┌─┐`) sits on the row above the arrow, and the bottom border (`└─┘`) sits on the row below. This completely prevents the defect where child boxes visually hang too low.
3. **Dual-Phase Comparative Symmetry**: Each archetype pairs a static structural setup diagram (top-down inheritance) with a dynamic runtime execution diagram (bottom-up action or event resolution).
4. **Ambient Abstraction Delimitation (Dashed vs Solid Invariant)**: Dashed-dotted borders (`┌┄┄┄┄┐`, `┊`, `└┄┄┄┄┘`) are strictly reserved for non-physical ambient abstractions (Context pools, memory environments, and subscriber scopes). Solid-line borders (`┌────┐`, `│`, `└────┘`) are reserved for physical component instances.
5. **Vector-Sharp Print Fidelity**: Built with UTF-8 box-drawing characters (`┌`, `─`, `┐`, `│`, `└`, `┘`, `├`, `┬`, `▲`, `▼`, `◄`, `►`, `┌┄`, `┊`, `└┄`) and `<strong>` inline tags. Prince XML compiles them directly as scalable text glyphs without raster degradation.

---

## How to Compile and Verify

Run the build script from the catalog directory:

```bash
cd projects/react-06/assets/ascii-flow-templates
node build.mjs
```

The script performs the following automated steps:
1. Parses `demo.md` and inlines all modular HTML templates referenced via `<!-- template: ... -->`.
2. Generates standalone `demo.html` with linked `ascii-flow.css`.
3. Compiles `demo.pdf` using Prince XML (zero compiler warnings policy).
4. Generates high-resolution PNG page screenshots in `screenshots/page-*.png` via `pdftoppm -png -r 150`.
116: 3. Compiles `demo.pdf` using Prince XML (zero compiler warnings policy).
117: 4. Generates high-resolution PNG page screenshots in `screenshots/page-*.png` via `pdftoppm -png -r 150`.
