**Phase 1: The Native Submit Event**

A user clicks the submit button, which is nested deep inside multiple layout wrappers (for example: a `<Form>` containing a `<Card>`, containing a `<Row>`, containing the `<Button>`). 

When an event travels upward through multiple nested elements, it is called "bubbling." A native browser submit event it bubbles upward until it reaches the parent `<form>` element. 

Important: This happens automatically via the browser, without needing any manual React props to pass the click upward. No need to pass any prompt from parent to child. 

**Phase 2: The Form as a Context Provider**

React intercepts this event at the form boundary. The event bubbles up until it meets the `<form>`, where it is intercepted to begin executing the asynchronous server action (the background function that processes the data).   

The standard `<form>` tag automatically acts as a built-in Context Provider. This means it can now impose data flow in the opposite direction: from the parent form down to the nested child elements. It broadcasts a state variable named `pending` downward to all components enclosed inside of it. The form becomes a Context Provider automatically, without requiring you to add a custom `<Context.Provider>` wrapper.   

**Phase 3: The Button Consumes the Context**

The nested submit button executes the `useFormStatus()` hook, which directly reads this built-in form Context.   

Because the hook subscribes directly to the parent form, the `pending` state bypasses the intermediate layout wrappers completely.   

This eliminates "prop drilling" (the traditional React requirement of manually passing a loading boolean down through every single layer of your component tree).   

**Phase 4: Isolated Component Updates**

Because only the submit button subscribed to `useFormStatus()`, only the button re-renders (updates its screen visuals) to disable itself and show transmission progress.   

The parent form and all intermediate layout containers do not re-render, saving performance.   

When the server action finishes, React resets the context to `pending: false`, and the button updates one last time to unlock.