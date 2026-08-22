# 04 | The State Drill: Fifteen Problems That Make Reactivity Stick

## 4.1 Where We Are, And How This Drill Works

Welcome back. This is a different kind of hour, and I want you to feel the difference before we start.

In lecture four, the main one, I told you the story of state. We met the state rune, we watched a plain variable come alive, we went deep into proxies and traps and variants, all of it as one flowing story you floated down once. This hour is not that. This hour is a drill. We are going to take the very same ground and turn it into fifteen problems, and we are going to work them, one after another, until the answers live in your hands and not just in your notes.

So let me put you on the map, because the map has not changed. We still stand on lecture three, the keystone hour, with its boxes inside boxes and its three directions of talking. We still live inside The National Times, the news organisation at nationaltimes dot com, with its clap counts and its articles and its logged-in reader. And we still build on lecture four, the state story you have already heard. This drill does not replace that lecture. It hammers it home.

Now, how the drill works, because the method is the whole point. For each of the fifteen problems I will do the same five things, in the same order. First, I pose the problem, a real one, the kind that stops you at your desk. Second, and this is the part that matters most, I invite you to answer it yourself. I will say, pause if you like, and I mean it. Stop the recording, and answer in your own head, out loud if you are alone, before I say a word. That little act of reaching for the answer before you hear it is what turns listening into learning. Do not skip it. Third, I reveal the verdict, the short, plain answer, a clear yes or no where the question allows one. Fourth, I explain it from the ground up, the why beneath the answer. And fifth, I give you the move, the one line to carry away. Pose, pause, answer, explain, move. Fifteen times. That rhythm is the lecture.

And one practical thing, the same deal we always make. Have your companion open beside you, and by companion I mean your Q and A digest, the printed deck of these fifteen problems. When I point you to code, the code is there, under the matching question. When I point you to a component map, that little diagram of the files and how they relate, it is there too, drawn for your eyes. I will not read code aloud, because code read by a machine voice is noise. Eyes on the digest, ears on me. That is the deal.

Fifteen problems. Let us start working.

## 4.2 Making A Value React To Change

Here is the first problem, the one everything stands on.

You have a plain variable, a number, let us call it the clap count. In ordinary JavaScript you change that number, you add one to it, and you look at the screen. Nothing moves. The number on the card is still the old number. So the question is simple and it is the question the whole framework exists to answer. How do you make a variable reactive, so that changing it actually moves the screen?

Pause the recording, and answer it in your own head.

Here is the answer. You declare it with the state rune. That is the whole fix.

And here is why it works, because you should never just take the fix, you should own it. In plain JavaScript a variable lives in memory, and the page has no idea it exists. Change the number, and the page sees nothing, so you would have to reach into the page yourself and rewrite the text by hand, every single time it changes. The state rune ends that chore. When you wrap the starting value in the state rune, the dollar sign followed by the word state, you mark that variable as reactive, which is just a plain way of saying that Svelte now watches it. Change it, and every spot on the screen that shows it redraws itself, automatically. And look at the code for this one in your companion, under question one. You change the clap count like any normal number, claps plus plus, and you show it in the markup with a pair of curly braces. No setter to call, no dot value to remember. Just a variable.

The move to carry away. Declare it with the state rune, then change it exactly like a plain variable. Nothing else.

## 4.3 When Your State Is An Object Or A List

Now we go one layer up, because real state is rarely a single number. Two problems here, back to back.

Problem two. Picture a draft article in the newsroom with a little production checklist, a list of tasks, each task an object with a done flag and a bit of text. You put that whole list in state. Now, here is the question. If you reach into the list and flip one task's done flag, deep inside, does the screen update? And if you push a brand new task onto the end of the list, does that update too?

Pause, and answer. Yes or no, for both.

The answer is yes, to both. Reach in and flip the flag, or push a new item, and the right slice of the screen updates.

Why? Because when you hand the state rune an object or an array, you do not just get a watched box around the outside. You get what we call a deeply reactive proxy. A proxy is a watchful layer that sits in front of your object and notices every read and every write to its fields, and the word deeply means Svelte does this all the way down, wrapping every object and every array nested inside, layer after layer. So when you reach in and change one task's done flag, the proxy sees exactly that, and updates only the piece of screen tied to it. And when you push, the proxy notices the push too, and wraps the new task as it lands. Look at the component map in your companion for this one. It is a single box, the checklist component, and it owns the tasks as a deep proxy. Here is the contrast worth holding, for anyone who remembers React. Over there, pushing onto state is a classic mistake that leaves the screen frozen. Here, push just works, because the proxy is watching.

The move. Mutate your nested state the plain, obvious way, reach in and assign, push, splice. The proxy has your back.

Problem three, and this one is a trap, the single most common way people break their own reactivity. You have that article in state, an object with a title and more. And to save yourself some typing, you destructure it, you write the shorthand, let, curly brace title, equals article, to pull the title out into its own little variable. Then later you change the article's title. And the headline on screen does not update. What broke?

Pause. Tell yourself what went wrong.

The answer is that destructuring gave you a dead copy, not a live link. The moment you destructure, JavaScript reads the value out and copies it, once, right then, into your new variable. That copy is a plain, loose string with no wire back to the proxy. So when you change the article's title later, the proxy faithfully updates everything still reading through it, but your copied title was never connected to the proxy in the first place, so it cannot hear the change. It is frozen at the value it had the instant you destructured. And this is not some Svelte quirk to memorise. It is simply how copying works in plain JavaScript, and a Vue veteran has been bitten by the very same thing.

The move. Do not destructure what has to stay reactive. Reach in fresh every time, read the article's title directly, and the link holds.

## 4.4 Modeling Your Data As A Class

Two problems on classes, because the moment your data gets serious, you reach for one.

Problem four. You want a Draft class, a proper blueprint that bundles a draft's data together with the methods that act on it, reset, publish, and so on. The question. When you make a Draft, do its fields become reactive automatically, the way a plain object's do? And if not, how do you switch reactivity on?

Pause, and answer.

The answer is no, not automatically. You mark each reactive field yourself.

Here is the reasoning, built from the ground. A class is a blueprint for making objects. You describe the shape once, the fields and the methods, and then you stamp out as many objects from it as you like with the word new, and each one you create is called an instance. Now, when you hand the state rune a plain object, Svelte wraps it in that watchful proxy automatically. But it deliberately does not do that to a class instance, and the reason is care, not laziness. A class is a fussier thing than a plain object, with methods and sometimes private fields and its own internal machinery, and clamping a proxy around the whole instance could quietly break that machinery. So Svelte leaves classes alone and asks you to opt in, one field at a time. Look at the code in your companion. You put the state rune directly on the field, done equals state of false, or you put it on the field's first assignment inside the constructor, this dot text equals state of the incoming text. The constructor, remember, is the setup function that runs once, automatically, the instant you create the instance. Either spot makes that one field reactive.

The move. In a class, mark each reactive field yourself, on the field or in the constructor.

Problem five, and it travels with the last one as a pair. You have a discard button in the newsroom, and you wire it straight at the method, you tell it, on click, call draft dot reset. You click it. Nothing happens, or the wrong thing happens. Why?

Pause. This one is pure JavaScript, not reactivity. What is going on?

The answer is that passing the method bare detaches it from the draft, and the word this gets hijacked. Here is the mechanism. Inside a method, the word this means the object the method was called on, and the cruel detail is that this is decided by how the function is called, not where it was written. When you hand draft dot reset over bare to the button, you have torn the function loose from the draft. So when the click fires and the browser calls that loose function as the button's own handler, this is now the button, not the draft. The method runs, dutifully, but it clears fields on the wrong object, and your draft never resets. Two fixes, both in your companion. The first, wrap it in a tiny inline arrow function, so you are calling reset through the draft and this points where it should. The second, define reset on the class as an arrow function field, because an arrow function does not get its own this, it borrows it once from where it was born, the instance, and never lets go.

The move. Either call it through an inline arrow, or define the method as an arrow-function field.

## 4.5 The Reactive Built-Ins And The Variants

Four problems here, the corners of state. Move briskly with me.

Problem six. On a social feed you are tracking which posts the reader has liked, and you reach for a Set, because a Set holds unique values and answers the question is this one liked instantly. You put it in state, you add an id, and the heart does not light up. How do you make a Set reactive, and the same for a Map, a Date, a U R L?

Pause, and answer.

No, a plain Set will not react. You import the reactive twin from the svelte slash reactivity package.

And the why is short and clean. The state rune makes plain objects and arrays reactive by wrapping them in a proxy. But a Set, a Map, a Date, a U R L, these are not plain objects. Each keeps its contents in its own internal machinery that a proxy cannot see through. So Svelte ships reactive versions of all four, Svelte Set, Svelte Map, Svelte Date, Svelte U R L, in the svelte slash reactivity package. They behave exactly like the originals, same methods, but they are wired into reactivity, so adding and removing now drives the screen. Swap your plain Set for a Svelte Set, and you are done. The code is in your companion.

The move. Reaching for a Set, Map, Date, or U R L and getting no reaction? Import its reactive twin from svelte slash reactivity.

Problem seven. Now picture an infinite feed, an endless timeline that grows to thousands of post objects, and you only ever replace the whole list or append to it, you never edit one post in place. Deep-proxying thousands of objects, just so they render, is wasted work. How do you opt out of the deep reactivity?

Pause.

The answer is state dot raw. It holds the value without deep-proxying it, so thousands of posts cost nothing to wrap. But there is one firm rule, and it is the trade. Raw state cannot be mutated, it can only be reassigned. Mutate means reach inside and change a part, and raw ignores that completely, push does nothing. Reassign means throw the whole value away and point the variable at a brand new one, and that, raw tracks. And here is the lovely part, it fits an infinite feed like a glove, because the idiomatic way to grow a feed is already to build a new array, spread the old posts and the next page into a fresh array and assign it, which is a reassignment. The per-post things that do change, like which posts are liked, live outside the raw array, in a Svelte Set of ids, the one from the last problem. One honest caution, which the Svelte team itself presses. Do not reach for raw by reflex, for performance, without measuring. Proxies are fast enough for the vast majority of state. Profile first, and reach for raw when you genuinely have thousands of items or a value you only ever swap.

The move. State dot raw for big things you only replace or append. Reassign a whole new value, never mutate inside it. And profile before you reach for it.

Problem eight. Your state is a proxy, which is exactly what you want inside Svelte. But now you want to hand an article to something outside Svelte, the browser's structured clone function, or a charting library. And it throws, or chokes, on the proxy. How do you get a plain object out?

Pause.

The answer is state dot snapshot. Wrap your reactive value in it, and you get back a plain, ordinary, static copy of the data, with all the proxy machinery stripped away, a frozen photograph that any outside tool will happily accept. The reason it is needed is just that those outside tools were never built to understand Svelte's proxy.

The move. Outside tool confused by the proxy? Wrap it in state dot snapshot to get a plain copy.

Problem nine. Normally Svelte is clever about when it repaints, batching changes and coordinating them, and once in a while a change waiting behind something slow, behind an await, lags a beat. But sometimes you want an instant reaction to a click. The section navigation across the top of the paper, World, Politics, Sports, you want the link the reader just tapped to light up immediately, while the next page is still loading. How do you force that instant update?

Pause.

The answer is state dot eager. Wrap the value in it, and the change shows on screen the moment it happens, skipping the usual coordination. It is a specialist tool, so use it sparingly, only ever to give feedback in response to a user action, and let Svelte time everything else.

The move. State dot eager for instant visual feedback on a user action, and nowhere else.

## 4.6 Passing State Into A Function

One problem here, and it teaches something fundamental about JavaScript itself.

Problem ten. You have some component state, a name, and you call a function with it, greet of name. Now, the question. Does that function get a live link to your name, so it sees later changes, or does it just get the value of name as it stands right now?

Pause, and answer.

The answer is that it gets just a copy, frozen at the moment of the call. JavaScript is what we call a pass-by-value language. When you call a function and hand it an argument, the function receives a copy of the value at that instant, not a living link back to your variable. So if the name changes afterwards, the copy the function captured does not change with it.

And here is the part that makes this practical rather than scary, so listen closely. The frozen-copy bug only bites you when you store the result. If you write a line that says, let message equal greet of name, that message is computed once and frozen, and renaming will never touch it. But, and this is the reassuring part, when you call greet of name directly in your markup, Svelte re-runs the markup whenever the name changes, so it re-reads the current name and calls greet again, and the greeting stays fresh all on its own. So inside a single component you rarely meet this at all. The proper tool for a value computed from state, by the way, is the derived rune, which is lecture five. And the one case where you do need to hand the live value into a function, when the function lives across a boundary, a reusable helper, a module, a class, and will read it again later, you do not pass the value, you pass a tiny getter, an arrow function that returns the name, and the function calls it to read the latest each time. Look at the companion to see the frozen line and the fresh line side by side.

The move. Do not store the result. Call it inline, or make it a derived. And to keep it live across a boundary, pass a getter.

## 4.7 Sharing State Across Files

Two problems, the sideways direction from lecture three, made real.

Problem eleven. You have one value that many components, scattered all over the app, all need to share, the logged-in reader. Where do you put it?

Pause, and answer.

You put it in a module whose name ends in dot svelte dot t s, and you export an object holding the value. Here is the build-up. Most state lives inside one component. But the logged-in reader belongs to no single component, the masthead greeting needs it, the comment form deep in an article needs it, a dozen boxes in different branches need the same one. Threading it through props to every corner would be madness, so you lift it out of the components into a module, an ordinary file you import from. There is one catch. The runes only work where Svelte compiles them, so to use the state rune in a standalone file you give the file the special ending, dot svelte dot t s, which tells the compiler to treat it like component code. Then comes the one rule, and it matters. Export an object, and change its properties, set session dot reader to the new person. Do not export a bare variable and then reassign it, because a reassigned export quietly loses its reactivity once another file imports it. Mutating a property on a shared object sidesteps that entirely, because every file is holding the very same object.

The move. Share app-wide state from a dot svelte dot t s module, by exporting an object you mutate, never a bare variable you reassign.

Problem twelve, the stricter cousin. You want every change to the logged-in reader to go through one controlled place, so no component can just poke the object directly. How?

Pause.

The answer is, keep the value private inside the module, do not export it, and export functions instead. The reason you would want this is a guard rail. The open object from the last problem works, but anyone can write to it. Often you want the opposite, a single doorway, so every change runs through one function where you could validate it, or log it, or call the server. So you keep the reader as a private variable, declared with the state rune but not exported, and you export a getter to read it and actions, log in and log out, to change it. Because the variable never leaves the file, every read and write stays inside the one place the compiler fully controls, which also sidesteps the reassignment trap for free. And it stays reactive, because when a component calls the getter in its markup, it reads the state inside, so it re-runs when the reader changes.

The move. To guard or hide shared state, keep it private in the module and expose it only through functions.

## 4.8 Three Problems To Grow On

Three last problems, the curious corners. Quick and sharp.

Problem thirteen. Can you put two components, say the article card and the clap button, into one dot svelte file?

Pause.

No. A dot svelte file is exactly one component, there is no syntax for two. To show two components and how they talk, you write two files, and a map. And two things that look like loopholes are not. Snippets let you reuse a chunk of markup inside one component, but a snippet is not a separate component, it has no script or state of its own. And the self element only lets a component render itself again, for recursion, like a comment showing its replies. Neither one gives you a second real component in one file, because that thing simply does not exist.

The move. One file, one component. Relationships are always multiple files, plus a map.

Problem fourteen, a question of which tool. The label that says five minute read, computed from the length of the article body. Is that a job for the state rune? For an effect?

Pause, and answer.

Neither holds it. A value computed from other values is a job for the derived rune, which is lecture five. Here is the deciding question, and learning to ask it is most of the craft. The state rune is for a value you hold and change over time, the clap count, a menu's open or shut flag. But the five minute read is not held anywhere, it is computed from the body. So it is derived, which recalculates itself whenever its ingredients change. Never the state rune, and never an effect, because an effect is for doing something out in the world, not for producing a value. And if you computed that label by hand into a state variable, it would go stale the moment the body changed, which is precisely the bug the derived rune exists to kill.

The move. Hold a value, the state rune. Compute a value, the derived rune. Touch the world, an effect.

Problem fifteen, the bridge back to what you knew. Coming from React and Vue, is the state rune just useState or ref under a new name?

Pause.

Almost, with the ceremony stripped out. The state rune is Vue's ref without the dot value, because the compiler reaches into the box for you, so you just use the variable. And it is React's useState without the setter and without the never-mutate rule, because you simply change the variable. The deeper difference shows up later, when you move reactive logic into a dot svelte dot t s file. That factory runs once, and the reactivity lives inside the value, whereas a React hook re-runs top to bottom on every single render.

The move. The state rune equals ref minus the dot value, equals useState minus the setter. Just a variable, and the compiler does the wiring.

## 4.9 The Whole Drill, Start To Finish

That is fifteen. Let us gather them in one breath, because hearing the shape whole is what turns the drill into instinct.

We made a plain variable react, with the state rune. We went deep, and found that objects and lists become deeply reactive proxies, so reaching in and pushing just work. We met the destructuring trap, the dead copy with no live link, and the cure, reach in fresh. We brought state into classes, marking each field by hand, and we defused the hijacked this, with an inline arrow or an arrow field. We toured the built-ins, the reactive twins from svelte slash reactivity, and the variants, raw for big things you only swap, snapshot for the outside world, eager for instant feedback. We passed state into a function, and learned that pass-by-value freezes a stored copy while the markup stays fresh on its own, with a getter for crossing a boundary. We shared state across files, an object you mutate or functions you expose, never a reassigned export. And we grew on three, one file is one component, a computed value is derived and not state, and the state rune is ref and useState with the ceremony removed.

One thread ran through every one of the fifteen, the same thread as the whole course. The state rune is just a variable, because Svelte is a compiler that does, quietly and ahead of time, all the wiring that other frameworks make you do by hand.

Now, two things to do before you go. First, in your companion, every one of these fifteen ends with a quick-fire table, a handful of one-line questions and answers. Cover the answers, and run them, the same way we just drilled, until you do not have to think. Second, the next rune stands directly on this one. In lecture five we meet the derived rune, the computed value that stays correct on its own, the very tool problem fourteen pointed at. You are ready for it now, because you did not just hear these answers. You worked for them. I will see you in lecture five.
