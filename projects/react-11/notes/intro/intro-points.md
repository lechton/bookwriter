
=====
BAD

In React, a form field usually keeps its text in useState, and onChange updates it on every letter. You do not need that for every field. Put a field in state only when the screen changes as the user types, and read the rest at submit with FormData.

Say you build a signup form with First Name, Last Name, City, Email, and Password. While the user types a name, a city, or an email, nothing else on the page changes. Only the Password field shows a live red-or-green strength bar under it. All five fields sit in one form component, but only one of them changes the screen while the user types.

Why: If you create five useState variables for the five fields, React renders the whole form again on every letter typed into any of them. You only need useState for the Password field. The browser already keeps the text of the other four fields until you read it at submit with FormData.



===================
GOOD

In React, forms have many fields, and each field is often plugged into a state variable through `useState`. A form with 10 fields may have 10 variables and 10 separate `useState` calls for each separate update. You do not need to do this for every input. **We should plug in `useState` for only a few fields**, e.g., when the screen changes as the user types. This is why we have `FormData`. **The remaining fields can be read at submit with `FormData`**.

Take a signup form with five fields: First Name, Last Name, City, Email, and Password. Ask yourself: do I need to constantly update each and every field? Only the Password field needs to update a live red-or-green strength bar below it. When the password is weak, it needs to become red. But for the rest of the fields, there is no need to surveil their constant updates. All five inputs sit in the same form component, yet only one needs to change the screen while typing.

**Why:** Giving all five fields their own `useState` forces React to re-render the entire form on every letter typed. Here, you only need `useState` for the Password field. The browser already holds the text for the other four fields until you read them at submit with `FormData`.

===================
BAD: it stats by connecting abtractions "Right after learning `useEffect`, it is tempting to store a value ", with no concrete grounding to what the reader can familiarly recognize. 


**2. Good Example 2 (Lecture 34, no Effect for a calculated value)**

Right after learning `useEffect`, it is tempting to store a value that depends on other state in a third state variable and update it inside an Effect. You do not need `useEffect` to calculate a value from state or to handle a button click. Calculate values right inside the component body, and put click code inside `onClick`.

Take a checkout page with two fields: First Name and Last Name. As the user types, the page prints their full name on a receipt right below. Both inputs and the receipt line sit in the same component, so the component already has both names on every render.

**Why:** Using a third state variable and an Effect forces React to draw the screen twice on every letter typed: first with the old full name, and then again with the new one. When you can calculate a value straight from existing state, calculate it right in the component body.


===================

GOOD: starts with grounding that is concrete, short, direct, easy to read and undertand. You do NOT need to use the actual chapter example, use the most typical easy to understand examples BEFORE the chapter begings, basic grounding before any chapter example even starts. It explains what is a bad practice, not merely forbidden by React.  

In React, components often display a result built from existing state, like combining a first name and a last name, or adding tax to a price. People often create a third `useState` variable for that result and plug in `useEffect` to update it whenever the first two change. **You do not need `useEffect` to calculate a value from state or to handle a button click**. We can calculate the result in a plain variable right inside the component body, and put click code directly inside `onClick`.

Take a checkout page with two fields: First Name and Last Name. As the user types, the page prints their full name on a receipt right below. Ask yourself: do I need a third state variable and an Effect just to join two names together? Both inputs and the receipt line sit in the same component, so the component already has both names in hand on every render.

**Why:** Using a third `useState` and a `useEffect` is a bad practice, it forces React to draw the screen twice on every letter typed: first with the old full name, and then again after the Effect updates it with the new one. When you can calculate a value straight from existing state, calculate it right in the component body.


=====
BAD

In plain JavaScript, you often create a variable only inside an if, when you need it. Hooks cannot work that way. Every Hook call must sit at the top level of your component, never inside an if or a loop, because React tracks Hooks by their call order.

Say a store page needs a shopping cart only after the user logs in. It feels natural to write an if first and create the cart state only inside it. Then the user clicks Log in, the if turns true, and the whole page crashes. The if sits inside the store page component, so one click changes which Hooks that component calls.

Why: React does not remember your useState variables by the names you give them. It keeps a numbered list in the order your component calls them: first Hook, second Hook, third Hook. If an if or an early return skips a Hook on the next render, the list no longer matches your calls, and React crashes.



====

GOOD : notice the sentence is highlighted not in the beginning, but in the exact part where it comes as moral of the story, repeated for emphasis before the end. In other examples the key sentence is highlithed in the begining, there is no hard recipe, you chose how the example at case needs to present the information and then highlight the key message . 

In React, a page often has features that only appear under certain conditions—like a discount box on sale days, or a profile menu after signing in. In plain JavaScript, when you only need a variable sometimes, you create it inside an `if` block. It is tempting to do the same in React and wrap `useState` inside an `if` statement. Never do this! Hooks cannot work that way. **Never use a useState or any other Hook inside an `if` statment**. Every Hook call must sit at the very top level of your component, never tucked inside an `if` or a loop. 

Take a store page that needs a shopping cart only after the user logs in. Ask yourself: should I write `if (isLoggedIn)` first, and plug in the cart's `useState` only inside that block? If you do, the page loads fine for a guest, until the user clicks **Log in**. The `if` turns true, the cart's `useState` runs for the first time, and the whole page crashes. Because that `if` sits inside the store component, a single click changes how many Hooks the component calls from one render to the next.

**Why:** React does not remember your `useState` variables by the names you give them. Instead, it keeps an internal numbered list in the exact order your component calls them: first Hook, second Hook, third Hook. If an `if` statement or an early `return` skips or adds a Hook on the next render, the numbered list falls out of sync with your calls, and React crashes.


=========
BAD

A component remembers a value between renders with useState, and every change to that value renders the component again. useRef also keeps a value between renders, but without rendering again. Our code can save something now and still use it in a later click.

Say you have a product card where the user can switch shirt colors and then click Buy. You want to count how many times the user clicked around before buying, and send that number when they click Buy. The user never sees this number on the screen. It lives inside the product card component, and only the click handler of the Buy button reads it.

Why: A normal variable such as let clicks = 0 does not work. The moment the user switches the shirt color, React runs your component function again from the top, and clicks is back to 0. And useState is wasted work here, because every click would render the whole card again for a number nobody sees.

======

GOOD: notice the "why", it is excellent example of reasoning that is crisp, clear, resolves issues with simpolicity and directness, any junior developer can understand 

In React, **not all information needs to appear on screen**. A component often needs to track information behind the scenes that never appears on the screen, like a background timer, a previous input value, or an analytics counter. Normally, we plug values into `useState` so the component remembers them between renders, but every update to `useState` redraws the screen. You do not need that for hidden data. This is why we have `useRef`. It keeps a value between renders without re-rendering the component, so your code can save something now and read it in a later click.

Take a product card where the user can switch shirt colors and then click **Buy**. Suppose you want to count how many times the user clicked around before buying, and send that number when they finally click **Buy**. Ask yourself: does the user ever see this counter on the screen? No, only the shirt color changes visually. The counter lives quietly inside the product card component, and only the **Buy** button's click handler reads it at the end.

**Why:** A plain JavaScript variable like `let clicks = 0` does not work here, its memory is lost and it restarts with every new render. Which means, it restarts all the time, it sets back to zero all the time. We need the memory of the variable to persist different renders, but we do not want useState to push new render either. See the problem? To use another `useState` is wasted work, because every click would force React to re-render the entire product card for a number nobody sees. `useRef` remembers the count across renders without triggering a single redraw.


=====

BAD: 


In plain JavaScript, you grab an element with document.getElementById and call its methods, such as focus(). In React, you never create the elements yourself, so there is nothing to grab. A ref on a JSX tag asks React to give you the real browser element it created, so our code can focus it, scroll it, or measure it.

Say you build a comment form with a text field and a Reply button. When the user clicks Reply, the blinking cursor should jump straight into the text field, so the user can start typing right away. The button and the text field sit in the same comment form component, and the click handler of the button needs the real <input> element.

Why: In React, you only return JSX tags like <input />, and React builds the real browser elements behind the scenes. JSX has no prop that says "put the cursor here now". To move the cursor, you must call the browser's own focus() method on the real <input> element.



====
POOR quality (suboptimal):

In React, a page often needs to directly control an element on the screen, like placing the blinking cursor inside a search box, scrolling down to a new chat message, or playing a video. In plain JavaScript, you grab the element from the page with `document.getElementById` and call its built-in browser methods, such as `focus()`. In React, you do not hunt through the document to grab elements manually. This is why we plug `useRef` into a JSX tag. A `ref` asks React to hand you the real browser element it created, so your code can focus it, scroll it, or measure it on command.

Take a comment form with a text box and a **Reply** button. When the user clicks **Reply**, the blinking cursor should jump straight into the text box so they can start typing right away. Ask yourself: how does the **Reply** button reach over and put the cursor inside that text box? Both the button and the text box sit in the same comment form component, and the button's click handler needs a direct connection to the real `<input>` element on the screen.

**Why:** In React, writing `<input />` in your code does not give you a real browser element in your hands. It is only a blueprint, and React builds the actual HTML element behind the scenes. At the same time, JSX has no prop that says "put the blinking cursor here right now." See the problem? Only the real browser element has the built-in `focus()` method, and only React controls that element. Attaching `useRef` to `<input ref={inputRef} />` tells React to put the real browser element right inside your ref once it is on the screen, so your click handler can call `inputRef.current.focus()` directly.


====

OPTIMAL QUALITY (notice the subtle differences like "It is the equivalent of the old classic getElementById" in the end, like a professor or adviser passing the key concepts, connectiosn, reminders as pearls of wisdom, not allways in the end necessary, but where and when it better suits to add another short conclusion or reminder): 

In React, a page often needs to **directly control an element on the screen**, like placing the blinking cursor inside a search box, scrolling down to a new chat message, or playing a video. In plain JavaScript, you grab the element from the page with `document.getElementById` and call its built-in browser methods, such as `focus()`. In React, normally you do not hunt through the document to grab elements manually. This is when we can plug `useRef` into a JSX tag. A `ref` asks React to hand you the real browser element it created, so your code can focus it, scroll it, or measure it on command. It is the equivalent of the old classic getElementById. 

Take a comment form with a text box and a **Reply** button. When the user clicks **Reply**, the blinking cursor should jump straight into the text box so they can start typing right away. Ask yourself: how does the **Reply** button reach over and put the cursor inside that text box? Both the button and the text box sit in the same comment form component, and the button's click handler needs a direct connection to the real `<input>` element on the screen.

**Why:** In React, writing `<input />` in your code does not give you a real browser element in your hands. It is only a blueprint, and React builds the actual HTML element behind the scenes. At the same time, JSX has no prop that says "put the blinking cursor here right now." See the problem? Only the real browser element has the built-in `focus()` method, and only React controls that element. Attaching `useRef` to `<input ref={inputRef} />` tells React to put the real browser element right inside your ref once it is on the screen, so your click handler can call `inputRef.current.focus()` directly.


====

BAD


Until now, your code ran in two places: in the component body while React renders, and in an event handler when the user clicks. useEffect adds a third place. It runs code because a component appeared on the screen, and cleans that work up when the component leaves.

Say a page has a live chat window. The moment the chat window appears on the screen, it should connect to the chat server by itself, without any click. When the user closes it, it must disconnect, so it stops receiving messages in the background. The connection belongs to the chat window component: it starts when React puts that component on the screen and ends when React removes it.

Why: You cannot open the connection in the component body, because React runs the body on every render and would connect again each time. And you cannot put it in an onClick handler, because the user did not click anything. Showing the component on the screen is what starts the work.


====

POOR QUALITY : notice it says "The connection belongs to the chat window component itself", confusing in the end the useEffect with the window itself. 

In React, a component often needs to start a background task automatically the moment it appears on the screen, like connecting to a live chat server, starting a ticking timer, or listening for window scroll events. Until now, our code only had two places to run: inside an event handler like `onClick` when the user clicks something, or right inside the component body while React renders. Neither place works when a task must start simply because a component showed up on the page. **This is why we have `useEffect`**. It gives your code **a third place to run: right after React puts the component on the screen**, with a built-in way to clean that work up when the component leaves.

Take a live chat window on a customer support page. The moment the chat window appears on the screen, it needs to connect to the chat server all by itself, without waiting for the user to click a Connect button. Later, when the user closes the chat window, it must disconnect so it stops receiving messages in the background. Ask yourself: where do we put the code that opens and closes this server connection? The connection belongs to the chat window component itself: it must start the moment React puts that component on the screen, and end the moment React removes it.

**Why:** Putting the server connection right inside the component body does not work here, because React runs the component function from the top on every single render. Which means every time the user types a single letter into the chat box, the component re-renders and opens a brand-new connection to the server all over again. On the other hand, we cannot put the connection inside an `onClick` handler either, because the user never clicked a button to connect. See the problem? We need the code to run automatically without a click, but we cannot let it run on every render either. `useEffect` solves this by running your connection code once when the component appears on the screen, and disconnecting cleanly when the component disappears.


===

GOOD


In React, a component often needs to **start a background task automatically** the moment it appears on the screen, like connecting to a live chat server, starting a ticking timer, or listening for window scroll events. Until now, our code only had two places to run: 

- inside an event handler like `onClick` when the user clicks something, 
- or right inside the component body while React renders

Neither place works when a task must start simply because a component showed up on the page. This is why we have `useEffect`. It gives your code a third place to run: right after React puts the component on the screen, with a built-in way to clean that work up when the component leaves.

Take a live chat window on a customer support page. The moment the chat window appears on the screen, it needs to connect to the chat server all by itself, without waiting for the user to click a Connect button. Later, when the user closes the chat window, it must disconnect so it stops receiving messages in the background. Ask yourself: where do we put the code that opens and closes this server connection? The connection belongs to the chat window component itself, inside a `useEffect`: it must start automatically the moment React puts that component on the screen, and end the moment React removes it. 

**Why**: Putting the server connection right inside the component body does not work here, because React runs the component function from the top on every single render. The component body is not a "safe place" for background tasks because its code gets wiped and re-run on every render. Which means every time the user types a single letter into the chat box, the component re-renders and opens a brand-new connection to the server all over again. On the other hand, we cannot put the connection inside an onClick handler either, because the user never clicked a button to connect, the process needs to be automatic. See the problem? We need the code to run automatically without a click, but we cannot let it run on every render either. useEffect solves this by running your connection code once when the component appears on the screen, and disconnecting cleanly when the component disappears.


====


BAD: poor explanation, idiosyncratic examples, introduction without grounding to familiar example, it tries to use the example of the chatper instead of introducing with a general easy to grasp example etc 

useReducer together with context lets any component deep in the page read the state and change it, without the components in between passing props down.

Say a shop page has a header at the top that says Cart: 3 items. Far below, under Your cart, every row has a Delete button. The user clicks Delete on the Bread row, and at that same moment the header must change to Cart: 2 items.

Why: The cart lives in the component at the very top of the page. With props, that component must pass the cart and every click handler down through each component on the way, even the ones that never use them. If one component in the middle forgets to pass the Delete handler on, the click crashes and the Bread row stays on the page.


=====

GOOD

In React, different parts of a page often need to read and update the exact same data, like a shopping cart, a logged-in user profile, or a list of notifications. Normally, we store that shared state at the very top of the page and pass both the data and its update functions down through props, step by step, from parent to child. You do not want to pass props by hand through layers of components that never even use them. **This is why we combine `useReducer` with Context**. Together, **they let any component deep in the page read the state and change it directly**, without the components in between passing props down.

Take an online shop where the header at the top says **Cart: 3 items**. Far below, inside the **Your Cart** section, every product row has a **Delete** button. When the user clicks **Delete** on the iterm you want to delete, the component that must disappear and, at that exact same moment, the top header must change to **Cart: 2 items**. Ask yourself: how does a **Delete** button buried deep inside a table row reach all the way back up to change the cart state at the top of the page? We can combine  `useReducer` (in the bottom part of the component hierarchy) with Context (in the upper part), so that the top header and the deep **Delete** button work with the same cart, separated by several layout components in between.

**Why:** Because both the header at the top and the list at the bottom need the cart, the cart state must live in the main component at the very top of the page. With ordinary props, that top component must hand the cart data and every click handler (`onAdd`, `onDelete`, `onUpdate`) down through every single component along the way, even layout wrappers and sections that have nothing to do with the cart. Worse, if just one component in the middle forgets to pass the **Delete** handler down to the next child, clicking **Delete** crashes and the item is never deleted, it stays stuck on the page. See the problem? Forcing middleman components to carry props they do not use makes your code fragile and messy. Combining `useReducer` with Context solves this by letting the top component broadcast both the state and its update actions straight to the header and the **Delete** button, skipping every component in between.