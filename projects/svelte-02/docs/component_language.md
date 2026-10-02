# Component Relationship Language

This document standardizes the terminology and scenarios used across our front-end education curriculum. By defining a clear "Component Relationship Language," we can ensure that all examples, questions, and explanations share a common, unambiguous vocabulary.

## 1. The CSS Relationship Analogy

Borrowing terminology from CSS selectors is a brilliant way to describe how components relate to one another structurally. It gives us a shorthand to describe component trees:

| Notation | Name | Component Meaning | Example |
| :--- | :--- | :--- | :--- |
| `A > B` | **Direct Child** | Component `A` directly renders Component `B`. `A` is the immediate Parent. | `<Feed>` rendering a `<VideoCard>` |
| `A B` | **Descendant** | Component `B` is rendered somewhere inside `A`, possibly deeply nested. | `<MyTubeApp>` containing a `<VideoInfo>` |
| `A + B` | **Adjacent Sibling** | Components rendered side-by-side by the same parent, where `B` immediately follows `A`. | `<Sidebar>` next to `<Feed>` |
| `A ~ B` | **General Sibling** | Components sharing the same parent, but not necessarily adjacent. | `<Header>` and `<Layout>` |
| `[Slot]` | **Content Projection** | Component `A` accepts Component `B` as children (Slots/Snippets). | `<Layout> {children} </Layout>` |

*Usage:* When asking questions, we can now say "In a `Layout > Sidebar + Main` relationship..."

## 2. Component Communication Language

We need standard terms for how information flows between these structures:

*   **Top-to-Bottom (Props Down):** Information flowing from a Parent (`A`) to a Child (`B`) via properties. In Svelte 5, this means passing runes/state down as props.
*   **Bottom-to-Top (Events/Callbacks Up):** Information flowing from a Child (`B`) to a Parent (`A`). The child notifies the parent of an action (e.g., a button click).
*   **Parent to Grandchild (Prop Drilling):** Information flowing from `A` down to `C` by passing through an intermediate `B` component (`A > B > C`).
*   **Grandchild to Grandparent (Event Forwarding):** Information flowing from `C` up to `A` by passing through an intermediate `B` component (`C` notifies `B`, `B` notifies `A`).
*   **Two-Way Binding (`bind:`):** A synchronized relationship where both Parent and Child can read and write to the same piece of state.
*   **Contextual / Deep Flow (Context/Stores):** Information bypassing intermediate components (avoiding prop drilling) to go straight from an Ancestor to a deeply nested Descendant (`A B`), or shared globally.
*   **Sibling-to-Sibling State Lifting:** `A + B` needing to communicate by moving state up to their shared Parent.

## 3. Reference Architectures (Concrete Scenarios)

To give students concrete mental models, we use two standard reference apps: **MyTube** (Video Service) and **NationalTimes** (News Service). These cover all structural edge cases.

### Scenario A: MyTube (Video Service)
*Focuses on persistent layouts, interactive media, lists of complex items, and deep nesting.*

**Minimal Component Structure (with explicit buttons):**
*   `MyTubeApp` (Root)
    *   `Header` (Top bar)
        *   `MenuToggleButton` ⏎ (Opens/closes Sidebar)
        *   `SearchBar`
            *   `SearchInput` -> User input (Two-way binding)
            *   `SubmitSearchButton` ⏎
            *   `VoiceSearchButton` ⏎
        *   `UserMenu`
            *   `ProfileDropdownButton` ⏎
    *   `MainLayout`
        *   `Sidebar` (Left Panel)
            *   `NavLinks` 
                *   `HomeButton` ⏎
                *   `ShortsButton` ⏎
                *   `SubscriptionsButton` ⏎
        *   `Feed` (Right Panel / Main Content)
            *   `VideoCard` (Rendered multiple times via iteration)
                *   `Thumbnail` 
                    *   `PlayPreviewButton` ⏎
                *   `VideoDetails`
                    *   `ChannelAvatar`
                        *   `SubscribeButton` ⏎
                    *   `VideoMeta` (Title, Views, Timestamp)
                *   `ActionRow`
                    *   `LikeButton` ⏎
                    *   `DislikeButton` ⏎
                    *   `ShareButton` ⏎
                    *   `SaveToPlaylistButton` ⏎

**Example Scenarios:**
*   **Grandchild to Grandparent (Event Forwarding):** A user clicks the `LikeButton` deep inside `VideoCard > ActionRow > LikeButton`. The `LikeButton` needs to notify the `VideoCard` (Grandparent) to update its visual "liked" state.
*   **Sibling to Sibling (State Lifting / Context):** A user clicks a 'Subscribe' button inside the `ChannelAvatar`. How does this update the `Sidebar` (a `~` sibling to `Feed`) to show the new subscription, given they share `MyTubeApp` as a common ancestor?

### Scenario B: ElectroShop (E-Commerce Service)
*Focuses on complex interactive state, filtering, cart management, and deep cross-component updates.*

**Minimal Component Structure (with explicit buttons):**
*   `ElectroShopApp` (Root)
    *   `Header` (Top bar)
        *   `LogoHomeButton` ⏎
        *   `ProductSearchBar`
            *   `SearchInput` -> User input (Two-way binding)
            *   `ClearSearchTextButton` ⏎
            *   `SubmitSearchButton` ⏎
        *   `UserCartMenu`
            *   `ViewCartDropdownButton` ⏎
    *   `ShopLayout`
        *   `Sidebar` (Left Panel)
            *   `CategoryNav` 
                *   `CategoryLinkButton` ⏎ (Iterated)
            *   `FilterPanel` 
                *   `BrandCheckboxButton` ⏎ (Iterated)
                *   `ClearAllFiltersButton` ⏎
        *   `MainContent` (Right Panel)
            *   `StoreToolbar`
                *   `ActiveFilters`
                    *   `RemoveFilterChipButton` ⏎ (Iterated)
                *   `SortDropdown`
                    *   `SortOptionButton` ⏎ (Iterated)
            *   `ProductGrid`
                *   `ProductCard` (Iterated over data)
                    *   `ProductImage`
                        *   `QuickViewOverlayButton` ⏎
                    *   `ProductInfo`
                        *   `ProductTitle`
                        *   `PriceBlock`
                        *   `Rating`
                    *   `ProductActions`
                        *   `AddToCartButton` ⏎
                        *   `WishlistButton` ⏎
            *   `Pagination`
                *   `PreviousPageButton` ⏎
                *   `NextPageButton` ⏎
                *   `PageNumberButton` ⏎ (Iterated)

**Example Scenarios:**
*   **Deep State Lifting (Global Store / Context):** A user clicks the `AddToCartButton` deep inside the `ProductCard`. The `UserCartMenu` located far away in the `Header` (`Header ~ ShopLayout`) needs to instantly update its cart badge count.
*   **Parent to Grandchild (Prop Drilling):** The `ProductGrid` receives an active "Flash Sale" status. It must pass this status down into the `ProductCard` (Child) and finally into the `PriceBlock` (Grandchild) so prices appear in red.
*   **Sibling to Sibling (State Lifting via Parent):** A user selects a "Sony" checkbox in the `Sidebar > FilterPanel`. The `MainContent > StoreToolbar > ActiveFilters` component needs to show a "Sony (x)" chip. The state must be lifted to their shared parent `ShopLayout`.
