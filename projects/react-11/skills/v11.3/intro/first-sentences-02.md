## Frameworks & Build Tools #2026_11_15_004_group_1

**46. The File the Server Sends (Framework vs. Vite)**
When you open a web page, the server sends one HTML file, and then the browser runs the JavaScript inside it. **With Vite alone, that file holds one empty element, and the page appears only after the JavaScript runs.** A full-stack framework such as Next.js can put the content into the file itself, so a chat app or a slow phone sees it at once.

**47. What StrictMode Runs Twice in Development**
When you start a new React project, a wrapper called `<StrictMode>` surrounds your application in the entry file. **In development, it runs some of your code twice on purpose, making a doubled tile or an extra connection look like a React bug.** Instead of removing the wrapper, you should fix what it reveals with pure renders and cleanups, because those exact flaws will otherwise reach your users in production.

**48. What React Escapes and Where Its Protection Ends**
React protects your app by passing every string in curly braces to the browser as plain text, so a hostile tag never runs. **When you use `dangerouslySetInnerHTML` to show formatted text, that protection ends, and the browser will execute any code the HTML carries.** To display content safely, you should pass HTML written by other people through a sanitizer like DOMPurify first, which keeps the formatting but removes the hidden attacks.

**49. Measuring Before the Paint with useLayoutEffect**
When a component needs to measure a DOM element to adjust its position—like a tooltip checking if it fits above a button—a standard `useEffect` runs only after the screen has already painted. **If you measure and adjust inside `useEffect`, the browser may paint the initial guess first, causing the user to see the element visibly jump to its final spot.** To prevent this flicker, you should use `useLayoutEffect`, which synchronously measures the layout and applies state updates before the browser paints the screen.

**50. How a Child Hands Its Parent Only focus with useImperativeHandle**
Passing a ref to a custom component ordinarily grants the parent unrestricted access to the underlying DOM node, allowing it to alter styles or remove the element entirely. **To prevent the parent from manipulating the element in unpredictable ways, the child component must conceal its real DOM node and selectively expose a constrained set of methods.** You should use `useImperativeHandle` to return a customized object containing only necessary actions, like `focus()`, ensuring the parent interacts exactly as intended without breaking encapsulation.

**51. How a Delete Dialog Escapes Its Row with createPortal**
Modals and dialogs embedded deep within a component tree are often visually clipped by parent containers with `overflow: hidden` or trapped underneath neighboring list rows by local `z-index` stacking contexts. **Because CSS strictly follows the DOM tree, no amount of absolute positioning or high `z-index` values on the dialog itself can free it from the physical constraints of its parent wrappers.** You should use `createPortal` to teleport the dialog's DOM nodes directly into `document.body`, keeping its state and event propagation perfectly intact within the React tree while rendering visually over the entire page.

**52. How Two Password Boxes Get Their Own ids with useId**
Form inputs and their associated labels require unique IDs to pair them for screen readers and focus events, but a hardcoded string will conflict with itself if the component is used multiple times on the same page. **Generating these IDs with `Math.random()` works in the browser but fails during server-side rendering, because the server and client will inevitably generate mismatched numbers and trigger a hydration error.** You should call `useId` to guarantee a unique, stable string derived from the component's tree position, keeping every instance independent and your server hydration perfectly synced.

**53. How a Component Subscribes to a Store Outside React**
When your interface relies on data outside of React—such as the browser's network status or a third-party state library—React has no automatic way of knowing when that external data changes. **If you manually synchronize this data using an Effect and state, an offline user might see an incorrect initial guess, or a paused concurrent render might cause different components to display conflicting data.** You should use `useSyncExternalStore` to pass a subscription and a read function, ensuring the first render is immediately accurate and the entire screen stays perfectly synchronized without tearing.

**54. Why a Re-render Is Usually Fast and Harmless**
React calls a component function again whenever its state changes, its parent re-renders, or a context it reads updates, which often floods the console with diagnostic logs during interactions like typing. **These repetitive function calls rarely impact performance, because React strictly compares the new rendering result with the old and alters only the exact DOM nodes that actually differ.** You should measure performance with the Profiler before aggressively optimizing, as re-rendering children is usually fast and entirely harmless unless the user experiences a perceptible lag.

**55. When memo Skips a Re-render, and When It Cannot**
By default, React re-renders every nested component when a parent updates, even if the child receives the exact same props as the previous render. **If you wrap the child in `memo`, React will skip calling the component entirely as long as a shallow `Object.is` comparison confirms every prop remains unchanged.** You should use `memo` only when a component is noticeably slow and frequently receives the same props, remembering that a context change, its own state change, or a newly created object prop will bypass this optimization anyway.

**56. What useMemo Caches, and When It Is Wasted Work**
React executes the entire component body on every render, meaning an expensive data filter or calculation will run repeatedly even when its inputs haven't changed. **If you pass a freshly calculated array or object to a memoized child component, the child will re-render anyway because the new calculation creates a different object identity that breaks the `memo` comparison.** You should wrap the expensive calculation or child prop in `useMemo` with a dependency array, ensuring React caches the result and reuses the exact same reference until a dependency changes.

**57. What useCallback Caches, and When You Actually Need It**
Functions declared inside a component body are recreated as brand-new closures every time the component renders, receiving a new identity in memory. **When you pass one of these inline functions to a memoized child component, the new function identity forces the child to re-render despite the `memo` wrapper.** You should wrap the function in `useCallback` to cache its definition between renders, allowing the child to receive the exact same function reference and successfully skip unnecessary updates.

**58. How Passing JSX as children Replaces memo, useMemo, and useCallback**
Keeping fast-changing state like a theme or text input at the top of an application normally forces the entire component tree to re-render whenever the state updates. **Instead of battling these re-renders with heavy memoization Hooks and complex dependency arrays, you can place the slow component as `children` inside a state-owning wrapper.** Because the parent above writes the actual JSX tag, the wrapper simply places the exact same element object it received, allowing React to effortlessly skip the heavy children without a single `memo` or `useCallback`.
