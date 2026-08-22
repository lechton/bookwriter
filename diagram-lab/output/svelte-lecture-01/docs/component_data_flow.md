# Component Data Flow & Architecture

Before diving into how individual components relate, it's crucial to understand how data enters the application, where it lives, and how it flows downwards. This document outlines the standard data flow for our reference applications (MyTube & ElectroShop).

## 1. Routing and the Entry Point

The component tree does not exist in a vacuum; it is dictated by the router (typically SvelteKit).

*   **Authentication Flow (`/login`):** If a user is not authenticated, the router stops them before they ever see the main app. They are served a dedicated `/login` route. At this stage, the massive `ElectroShopApp` or `MyTubeApp` structure does not even render.
*   **The Main App (`/`):** Once authenticated, the user is redirected to the main route (`/`). Here, a layout wrapper (e.g., `+layout.svelte`) establishes the root components like the `Header`, `Sidebar`, and the main view area.

## 2. Where Does Application Data Reside? (Initial Load)

Data retrieval for things like lists of products or videos primarily happens *outside* the UI components, right before they are rendered.

*   **Load Functions (The API Call):** In a standard Svelte application, data for the `ProductGrid` or `Feed` is fetched on the server (or client) during the route load phase (e.g., inside a `+page.ts` or `+page.server.ts` file).
*   **Passing to the Root:** The result of these API calls (e.g., an array of products from the database) is passed into the top-level route component as a `data` prop.
*   **Top-Down Flow:** The Root component (`ElectroShopApp`) takes this static or reactive data and passes it down to the `MainLayout`, which passes it to the `ProductGrid`, which iterates over it to create individual `ProductCard` components.

## 3. Where Does Global User Data Reside? (State Management)

Some data needs to be accessed everywhere, like the logged-in User's profile or the global Cart count. It is highly inefficient to pass this data down through every single component (prop-drilling).

*   **Module-Level State (Svelte 5):** We place this data in an external TypeScript/JavaScript file (e.g., `state/userState.ts` or `state/cartStore.ts`). 
*   **The `$state` Rune:** By defining `export const user = $state({ name: 'Alice', cartCount: 2 })` inside an external module, any component (like `UserCartMenu` in the Header, or `AddToCartButton` deep in the Grid) can import this file and read or write to the exact same reactive variable.
*   **Context API:** Alternatively, global state can be provided at the `ElectroShopApp` root using Svelte's `setContext`, allowing any deeply nested descendant to fetch it using `getContext`.

## 4. Local JS/TS Functions (Mutations & Interactivity)

When a user interacts with the UI (e.g., clicks the `AddToCartButton` ⏎), we need to run code. Where does this code live?

*   **Inside the Component (`<script>` block):** For simple UI logic (like toggling the `ViewCartDropdownButton` ⏎ open or closed), the JavaScript function lives directly inside the component's `<script>` tag.
*   **API Calls / Mutations:** When the `AddToCartButton` ⏎ is clicked, the component's `onclick` handler fires an asynchronous local function (e.g., `async function handleAddToCart()`).
*   **Abstracting the API:** To keep components clean, the actual HTTP `fetch()` request to the server is usually abstracted into a separate TS/JS utility file (e.g., `api/cart.ts`). 
*   **The Cycle:** The local component function calls `api.addToCart(productId)`. Once the server confirms the addition, the local function updates the global `$state` to reflect the new cart count. Because the `UserCartMenu` component in the Header is listening to that same `$state`, it automatically re-renders with the new number.

## 5. Question Authoring Guidelines: Describing Data Flow

When writing the 200 questions, it is critical that we explain the mechanics of the framework using clear, visual, and multi-scale data flow descriptions. Each question's explanation must cover the following:

### A) The Technical Svelte Information
Always explicitly state the Svelte mechanics pertinent to the question at hand. If the question involves reactivity, specify *why* it reacts (e.g., "The `$state` rune creates a reactive proxy..."). Don't just say "it updates"; explain the engine under the hood.

### B) Large Scale Data Flow Context
Contextualize the specific problem within the broader architecture using clear, linear hierarchy paths. Show the reader the big picture of where this interaction lives.

**Example Format:**
> `ElectroShopApp` (Root) ➔ `ShopLayout` ➔ `ProductGrid` ➔ `ProductCard` (Receives data)

### C) Nuanced Small Scale Data Flow
When zooming into a specific component, map out the micro-interactions with maximum nuance. We explain this using linear text boxes or arrows to illustrate the exact journey of a specific variable, especially when logic like `$derived.by` intercepts it.

**Example Format:**
> `ThisComponent` (holds global $state) ➔ `OtherComponent` (receives state as `props.name`) ➔ `$derived.by()` (conducts filtering/logic *before* the return) ➔ `ChildComponent` (receives the mutated result and displays it)

By writing explanations in these distinct scales, the reader always knows *where* they are in the app, and *how* the specific Svelte feature operates at a microscopic level.
