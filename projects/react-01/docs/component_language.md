# Component Relationship Language (React Edition)

This document standardizes the terminology and scenarios used across the React education curriculum (`react-lecture-01`). By defining a clear "Component Relationship Language," we ensure that all examples, questions, and explanations share a common, unambiguous vocabulary. It is the React sibling of the Svelte edition used by `svelte-lecture-02`; the reference architectures (MyTube, ElectroShop) are the same apps, rebuilt as React component trees.

## 1. The CSS Relationship Analogy

Borrowing terminology from CSS selectors gives a shorthand to describe component trees:

| Notation | Name | Component Meaning | Example |
| :--- | :--- | :--- | :--- |
| `A > B` | **Direct Child** | Component `A` directly renders Component `B` in its JSX. `A` is the immediate Parent. | `<ProductGrid>` rendering `<ProductCard>` |
| `A B` | **Descendant** | Component `B` is rendered somewhere inside `A`, possibly deeply nested. | `<ElectroShopApp>` containing a `<PriceBlock>` |
| `A + B` | **Adjacent Sibling** | Components rendered side-by-side by the same parent, where `B` immediately follows `A`. | `<Sidebar>` next to `<ProductGrid>` |
| `A ~ B` | **General Sibling** | Components sharing the same parent, but not necessarily adjacent. | `<Header>` and `<ShopLayout>` |
| `[children]` | **Content Projection** | Component `A` receives Component `B` through the `children` prop. | `<ShopLayout>{children}</ShopLayout>` |

*Usage:* When asking questions, we can say "In a `ShopLayout > Sidebar + ProductGrid` relationship..."

## 2. Component Communication Language

Standard terms for how information flows between these structures in React:

* **Top-to-Bottom (Props Down):** Information flowing from a Parent (`A`) to a Child (`B`) via props. In React this is the primary data direction; props are read-only to the receiver.
* **Bottom-to-Top (Callbacks Up):** Information flowing from a Child (`B`) to a Parent (`A`). The parent passes a function prop (for example `onAddToCart`); the child calls it. This is React's replacement for child-to-parent events.
* **Parent to Grandchild (Prop Drilling):** Information flowing from `A` down to `C` by passing through an intermediate `B` (`A > B > C`) where `B` never uses the prop itself.
* **Grandchild to Grandparent (Callback Forwarding):** Information flowing from `C` up to `A` by threading a callback through `B` (`C` calls it, `B` passed it down).
* **Two-Way Data (Controlled Components):** A synchronized relationship where the Parent owns the value and the Child reports changes: the parent passes `value` and `onChange` together. There is no bind directive; the pair of props is the contract.
* **Contextual / Deep Flow (Context):** Information bypassing intermediate components to go straight from an Ancestor to a deeply nested Descendant (`A B`) via `createContext` + `useContext`.
* **Sibling-to-Sibling State Lifting:** `A + B` needing to communicate by moving state up to their shared Parent (the closest common ancestor).
* **Server-to-Client (Boundary Crossing):** In the server course, data fetched by a Server Component flowing into a Client Component as serializable props, or server-rendered JSX flowing in as `children`.

## 3. Reference Architectures (Concrete Scenarios)

Two standard reference apps cover all structural edge cases: **ElectroShop** (E-Commerce) and **MyTube** (Video Service). The data-flow pipeline (`md-data-flow/`) always uses ElectroShop; lecture worlds use the National Times newsroom.

### Scenario A: ElectroShop (E-Commerce Service)

*Focuses on complex interactive state, filtering, cart management, and deep cross-component updates.*

**Minimal Component Structure (with explicit buttons):**

* `ElectroShopApp` (Root)
  * `Header` (Top bar)
    * `LogoHomeButton` ⏎
    * `ProductSearchBar`
      * `SearchInput` (controlled: `value` + `onChange`)
      * `ClearSearchTextButton` ⏎
      * `SubmitSearchButton` ⏎
    * `UserCartMenu`
      * `ViewCartDropdownButton` ⏎
  * `ShopLayout`
    * `Sidebar` (Left Panel)
      * `CategoryNav`
        * `CategoryLinkButton` ⏎ (iterated with `key={category.id}`)
      * `FilterPanel`
        * `BrandCheckboxButton` ⏎ (iterated)
        * `ClearAllFiltersButton` ⏎
    * `MainContent` (Right Panel)
      * `StoreToolbar`
        * `ActiveFilters`
          * `RemoveFilterChipButton` ⏎ (iterated)
        * `SortDropdown`
      * `ProductGrid`
        * `ProductCard` (iterated over data with `key={product.id}`)
          * `ProductImage`
            * `QuickViewOverlayButton` ⏎
          * `ProductInfo`
            * `ProductTitle`
            * `PriceBlock`
            * `Rating`
          * `ProductActions`
            * `AddToCartButton` ⏎
            * `WishlistButton` ⏎
      * `Pagination`
        * `PreviousPageButton` ⏎
        * `NextPageButton` ⏎
        * `PageNumberButton` ⏎ (iterated)

**Example Scenarios:**

* **Deep State Lifting (Context):** A user clicks the `AddToCartButton` deep inside `ProductCard`. The `UserCartMenu` far away in the `Header` (`Header ~ ShopLayout`) must instantly update its cart badge count. The cart count lives in a Context provided at `ElectroShopApp` and consumed by both ends.
* **Parent to Grandchild (Prop Drilling):** `ProductGrid` receives an active "Flash Sale" status and must pass it into `ProductCard` and finally `PriceBlock` so prices render in red.
* **Sibling to Sibling (State Lifting via Parent):** A user selects the "Sony" checkbox in `Sidebar > FilterPanel`. `MainContent > StoreToolbar > ActiveFilters` must show a "Sony" chip. The filter state is lifted to their shared parent `ShopLayout`.

### Scenario B: MyTube (Video Service)

*Focuses on persistent layouts, interactive media, lists of complex items, and deep nesting.*

**Minimal Component Structure:**

* `MyTubeApp` (Root)
  * `Header` (Top bar)
    * `MenuToggleButton` ⏎ (opens/closes Sidebar)
    * `SearchBar`
      * `SearchInput` (controlled)
      * `SubmitSearchButton` ⏎
      * `VoiceSearchButton` ⏎
    * `UserMenu`
      * `ProfileDropdownButton` ⏎
  * `MainLayout`
    * `Sidebar` (Left Panel)
      * `NavLinks`
        * `HomeButton` ⏎, `ShortsButton` ⏎, `SubscriptionsButton` ⏎
    * `Feed` (Main Content)
      * `VideoCard` (iterated with `key={video.id}`)
        * `Thumbnail`
          * `PlayPreviewButton` ⏎
        * `VideoDetails`
          * `ChannelAvatar`
            * `SubscribeButton` ⏎
          * `VideoMeta`
        * `ActionRow`
          * `LikeButton` ⏎, `DislikeButton` ⏎, `ShareButton` ⏎, `SaveToPlaylistButton` ⏎

**Example Scenarios:**

* **Grandchild to Grandparent (Callback Forwarding):** A user clicks the `LikeButton` deep inside `VideoCard > ActionRow > LikeButton`. The like must update state owned by `VideoCard` via a callback threaded down through `ActionRow`.
* **Sibling to Sibling (Context):** A Subscribe click inside `ChannelAvatar` must update the `Sidebar` (`Sidebar ~ Feed`), given both share `MyTubeApp` as their common ancestor.

## 4. The Server/Client Layer (React Server course, Q101+)

For server-course data-flow files, the ElectroShop tree gains one dimension: which components render on the server and which ship to the browser.

* The page shell (`ElectroShopApp`, `ShopLayout`, `ProductGrid`) renders on the server as Server Components: they `await` product data directly and pass it down as plain, serializable props.
* Interactive leaves (`AddToCartButton`, `SearchInput`, `FilterPanel`) are Client Components, marked `'use client'`: they own `useState`, handlers, and context.
* `UserCartMenu`'s badge reads cart state from a client Context whose Provider is a Client Component placed high in the tree; the server passes the initial cart count into that Provider as a prop.
* Mutations cross back through Server Functions: `addToCart` runs on the server (`'use server'`), and the client updates when the fresh server data returns.

When writing data-flow files for the server course, mark the boundary explicitly in the B/C paths, for example: `ProductGrid` (Server Component) ➔ **`ProductCard`** (Client Component, `'use client'`).
