# Component Data Flow & Architecture (React Edition)

Before diving into how individual components relate, it is crucial to understand how data enters the application, where it lives, and how it flows downwards. This document outlines the standard data flow for the React reference applications (ElectroShop & MyTube). The A/B/C explanation structure below is the fixed multi-scale format every data-flow file in this project follows, with React's mechanics.

## 1. Routing and the Entry Point

The component tree does not exist in a vacuum; it is dictated by the router (a React framework's router in the client course, an RSC router in the server course).

* **Authentication Flow (`/login`):** If a user is not authenticated, the router stops them before they ever see the main app. They are served a dedicated `/login` route. At this stage, the massive `ElectroShopApp` or `MyTubeApp` structure does not even render.
* **The Main App (`/`):** Once authenticated, the user is redirected to the main route (`/`). Here, a layout component establishes the root composition: the `Header`, the `Sidebar`, and the main view area as children of the route's layout.
* **The mount:** For a pure client app, `main.jsx` calls `createRoot(document.getElementById('root')).render(<App />)`. For a server app, the router renders the route's Server Component tree on the server and `hydrateRoot` attaches interactivity in the browser.

## 2. Where Does Application Data Reside? (Initial Load)

Data for things like lists of products does not live inside the components that display it.

* **Server Components await data (server course):** The page's Server Component is an `async` function that awaits the database or a fetch directly. No `useEffect`, no loading flags in the data path: the tree renders with the data already resolved.
* **The framework loader (client course):** In a framework-driven client app, data for the `ProductGrid` is fetched before the route renders, then passed into the top-level route component as a prop.
* **Passing to the Root:** The result of the data call (for example, an array of products) is passed into the top-level component, which passes it down: `ElectroShopApp` ➔ `ShopLayout` ➔ `ProductGrid`, which iterates it to create `ProductCard` components, each keyed by `product.id`.

## 3. Where Does Global User Data Reside? (State Management)

Some data is needed everywhere: the logged-in user's profile, the global cart count. Passing it through every level is prop drilling, and React offers two sanctioned escapes.

* **Context (the default answer):** A `CartContext` is created with `createContext`. A Provider (a Client Component) is placed at or near the root, wrapping the tree. Any descendant — `UserCartMenu` in the Header, `AddToCartButton` deep in the Grid — reads it with `useContext`. The value passed to the Provider should be memoized (`useMemo`) when the provider re-renders often, so consumers do not re-render needlessly.
* **Reducer + Context (as the app grows):** When many components both read and update the shared state, the state and its update rules move into a `useReducer`, and the Provider exposes both state and `dispatch` through context (see Q26).
* **Module-level state (the trap to teach):** A plain object exported from a `.js` module is shared state, but it is NOT reactive: mutating it never re-renders anyone. For truly external stores (a map library, a URL state library), `useSyncExternalStore` is the sanctioned bridge. When a lecture uses a shared module (`state/cart.js`), it must show the reactivity mechanism explicitly, not hand-wave it.
* **Server data is not client state:** Values fetched on the server (the product list) flow down as props; copying them into `useState` on arrival is the classic derived-state anti-pattern (see Q71).

## 4. Local Functions (Mutations & Interactivity)

When a user interacts with the UI (clicks the `AddToCartButton` ⏎), code runs. Where does it live?

* **Inside the component:** For simple UI logic (toggling a dropdown open or closed), the handler is a plain function inside the component, closing over its own `useState`.
* **Server Functions (server course):** When the click must change server data, the handler IS a Server Function (`'use server'`) or calls one: it runs on the server with the database in scope, and its return value flows back to the client (through `useActionState` when a form drives it).
* **Client mutations:** In the client course, the component's `onClick` handler calls an async function that talks to the server, then updates local or context state with the result.
* **Abstracting the API:** To keep components clean, the actual HTTP calls live in a separate utility module (`state/api.js`), imported by the component or the Server Function.
* **The cycle:** `AddToCartButton` fires the mutation; on confirmation, the cart state updates (context, reducer, or fresh server data after an action); because `UserCartMenu` consumes the same state, it re-renders with the new badge number.

## 5. Question Authoring Guidelines: Describing Data Flow

When writing data-flow files for the 180 questions, explain the mechanics using clear, visual, multi-scale descriptions. Each file's explanation must cover:

### A) The Technical React Information
Always explicitly state the React mechanics pertinent to the question. If the question involves reactivity, specify *why* it re-renders (for example, "calling the setter returned by `useState` schedules a re-render of the component that owns it"). Don't just say "it updates"; explain the engine under the hood.

### B) Large Scale Data Flow Context
Contextualize the specific problem within the broader architecture using clear, linear hierarchy paths. Show the reader the big picture of where this interaction lives.

**Example Format:**
> `ElectroShopApp` (Root, provides CartContext) ➔ `ShopLayout` ➔ `ProductGrid` ➔ `ProductCard` (Receives product as prop)

### C) Nuanced Small Scale Data Flow
When zooming into a specific component, map out the micro-interactions with maximum nuance. We explain this using linear text boxes or arrows to illustrate the exact journey of a specific variable, especially where logic like `useMemo` or a reducer intercepts it.

**Example Format:**
> `ProductCard` (receives `product` and `isVIP` as props) ➔ **`useMemo(() => finalPrice(product, isVIP), [product, isVIP])`** (logic before the return, cached per input) ➔ `PriceBlock` (receives `finalPrice` and displays it)

By writing explanations at these distinct scales, the reader always knows *where* they are in the app, and *how* the specific React feature operates at a microscopic level.
