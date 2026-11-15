## State, Refs & Context

**29. Deep State Sharing (`useReducer` + Context)**
Deep component trees often need data to travel all the way down—and updates to travel all the way back up. **You should combine `useReducer` with context.** Then any component, no matter how deep in the hierarchy, can read and change that shared top-level state without passing props down every level.

**30. Silent Values (`useRef` for Data)**
Some values—like a timer ID or a background click counter—never show up on the screen, but still need to survive between renders. **You should keep that value in a ref.** React keeps the ref across renders, and changing it does not make React draw the screen again.

**31. Real Browser Elements (`useRef` for the DOM)**
Sometimes your code needs to work with a real element on the page—to put the cursor in an input field, scroll to a message, or measure a box. **You should attach a ref to that JSX tag.** React puts the real browser element it created into the ref, so your code can focus it, scroll to it, or measure it.

**34. Calculated Values (Plain Variables)**
Pages often show a value built from existing state, like a full name from a first and last name, or a price with tax. **You should calculate it in a plain variable in the component body, with no third state variable and no Effect.** React runs the component body on every render, so the value is calculated again after every change.

---

## Effects & Cleanup

**32. Self-Starting Tasks (`useEffect` + Cleanup)**
Some tasks must start by themselves when a component appears—like connecting to a server or starting a timer—and stop when it leaves. **You should put that task in `useEffect`, together with a cleanup function.** React starts the task after the component appears on the screen, and runs the cleanup when the component leaves.

**33. Outrunning Slow Responses (Fetch Cleanup)**
When an Effect fetches data from a server, the user often moves on before the answer arrives—opening another profile, typing another search word, or switching tabs. **You should write a cleanup function.** This marks the old request as ignored, so a late answer from an old click cannot replace the newer one on the screen.

**35. Switching Data on the Same Page (Dependency Arrays)**
A page often stays open while the data it shows changes—the user picks another chat room, another city on a map, or a different size on a product page. **You should list every value the Effect reads in its dependency array, and write a cleanup that undoes the setup.** React then stops the Effect for the old value and starts it again for the new one.

**36. Reading Fresh Values Without Restarting (`useEffectEvent`)**
Sometimes an Effect must read the latest prop or state—like the current theme or a sound on/off switch—without starting all over again when that value changes. **You should read that value inside a function created with `useEffectEvent`.** That function always gets the latest props and state, and the Effect does not run again when they change.

**37. Stopping Endless Re-runs (Objects Inside Effects)**
React runs the component body on every render, so an object written there is brand-new each time—forcing any Effect that depends on it to run again after every single render. **You should write the object inside the Effect, not in the component body.** Then the object is no longer a dependency, and the Effect runs again only when a real value changes.

---

## Hooks Rules & Sharing Logic

**38. Conditional UI (Top-Level Hooks Only)**
When parts of a page appear only sometimes—like a sale banner or a menu after signing in—it is tempting to tuck `useState` inside an `if`. **You should write every Hook call at the top level of the component, never inside an `if` or a loop.** React finds the state of each Hook by the exact order of the calls, and an `if` can change that order.

**39. Same Logic, Separate Data (Custom Hooks)**
Two components often need the same logic—like tracking whether the user is online—while each one keeps its own data. **You should move that logic into a custom Hook.** Both components then share the same code, and each one keeps its own independent state.

---

## Forms, Actions & Instant Feedback

**40. Fast Multi-Field Forms (`FormData` over `useState`)**
A form can have many fields, and if every single one has its own `useState`, React renders the whole form again on every letter typed. **You should keep state only for the fields that change the screen while the user types.** `FormData` reads the rest of the fields at submit.

**41. Effortless Submissions (The Form `action`)**
Handling a form with the classic `onSubmit` makes you write extra code to stop the page reload, read every input, and empty the fields afterward. **You should pass your function to <form action={...}> instead.** React then hands the field values to your function, runs it without reloading the page, and resets the form when it finishes.

**42. Tracking Results and Loading (`useActionState`)**
After a form is sent, the page often needs to show that the action is still running, and then display whatever it returned—like an error message. **You should pass the action to `useActionState`.** React keeps what the action returns as state, and gives you `isPending`, which is `true` while the action is still running.

**43. Smart Submit Buttons (`useFormStatus`)**
A Submit button inside a form needs to know when the form is being sent so it can show `"Sending..."` and block a second click. **You should use `useFormStatus` inside the button's component, instead of passing props.** React gives that component the status of the parent form directly.

**44. Instant UI Updates (`useOptimistic`)**
When the user clicks Like or sends a message, waiting on the server makes the page feel slow. **You should use `useOptimistic` for the expected result.** React shows it on the screen right away, and replaces it with the real result when the server answers.

**45. Saving User Input on Server Refusal (Returning Form Fields)**
When a form sends its fields to an action function, the server can still refuse them—a username is already taken, a code is wrong, or a date is fully booked. **You should write the action function so that it returns what the user typed, together with the error message.** Because the action function ended without crashing, React resets the form even after a refusal—so without that return value, the user has to type everything all over again.