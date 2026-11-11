## Why intro is superior: a checklist

Each question names something the ideal opening does that a weaker draft does not.

**The start**

- [ ] Does a short question under the title tell the reader what the chapter is about? *("Who decides when your component runs: you or React?")*
- [ ] Is every term the opening needs reminded first, one per numbered line, with its lesson in parentheses?
- [ ] Does the opening start from what the reader already knows, then say in one short line where React breaks it? *("In plain JavaScript, you call a function only when you want an action to happen. React components break this rule.")*

**The theory**

- [ ] Is the mental model given as a plain-words sentence in quotes showing what React asks your code, or what your code asks React? *("Given these props and this state, what should the screen look like right now?" / "The next time you call my component function, pass me `13` instead of `12`.")*
- [ ] Does the opening say why React needs the rule, not only what the rule is? *(React calls again so the reconciler can compare the old screen with the new one.)*
- [ ] Is each new technical word named at the moment the reader meets the thing it names? *("Changing anything outside the component is called a side effect.")*
- [ ] Do the core rules quote React's official docs, and put any hard word into plain actions right away? *(Explaining "asynchronous" as waiting three seconds inside a timer or waiting for a server reply.)*

**The analogy**

- [ ] Does the opening use an everyday object (a book, a printed photo) where the rule is obvious at a glance?
- [ ] Does the analogy map back to the code item by item, and say what breaks for each item? *(The outside counter "corrupts the next render", and the prop array "silently corrupts the parent's data too".)*
- [ ] Does every "this is fine" come with its reason? *(Local mutation is fine "because nobody outside that render ever sees the copy".)*

**The example on the page**

- [ ] Does a bold "Beware!" line give the moral before each scenario, not only once?
- [ ] Is the scenario grounded in what users do every day before the specific case? *("Users click things on the screen all the time: opening a menu, switching a tab, or toggling Dark Mode.")*
- [ ] Does the mistake happen in the exact place a developer writes that code? *(In Lesson 14, the counter changes during the render. In Lesson 15, `setNumber` is called inside an event handler.)*
- [ ] Does the setup name every variable or setter needed to produce the wrong screen? *(Naming `setAnnouncement` so the second line on screen stays at `12` while the first line updates to `13`.)*
- [ ] Does the wrong result on the page come first, and the step-by-step "what went wrong" after it?
- [ ] Does the closing paragraph say how the bug hides or tricks you on your computer, and what breaks for real users? *(Without `StrictMode` the bug hides until a real user clicks; or `console.log` prints the old value while the payment server gets the wrong total.)*

**The rule of thumb**

- [ ] Does the opening end with the senior developer's advice: one bold rule, then numbered actions?
- [ ] Does each action name the real confusion it prevents? *(`push` on a prop and `push` on a copy "seem to do the same job... They are NOT the same!")*
- [ ] Does each action say what goes wrong if you skip it? *(Turning `StrictMode` off "only hides the bug on your computer until a real click breaks the page for your users".)*

**The whole opening**

- [ ] Do named sections let a reader jump to any part and still follow the logic? *(The Book Analogy, How Writing in the Book Breaks a Real Page, The Rule of Thumb.)*
- [ ] Does each sentence say who acts, such as React, your handler, or the clerk?