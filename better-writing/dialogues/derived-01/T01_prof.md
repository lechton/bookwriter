# T01 — Professor

Before we go one step further, let me put back on the table the one rule from the last lesson that everything today is built upon, because if that rule is not solid in your head, nothing below will hold. A signal is a closure holding one value and its own private list. The only moment a dependency can be discovered is the moment of reading, while the flag is up. The only moment that dependency gets acted on is the moment of writing. Read subscribes. Write notifies. `flagged_function` is the one shared variable that says who is currently running, and `watchEffect` is the function that raises that flag, runs your function once, and lowers it. That is the whole architecture we built, and it is the architecture the derived rune is built on top of.

Now, let's talk about the derived values, what is the architecture that is built upon. The derived rune, and the watch rune represent different things. They may seem the same, but are not.

I am going to leave that claim hanging on purpose. I am not going to show you the difference yet. I want you to push back first, the way you did when I told you read subscribes and write notifies, because the place you push back from is exactly the place I need to reach into.
