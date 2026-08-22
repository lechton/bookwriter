<!-- ========================================== -->
<!-- PART: 00-intro.md -->
<!-- ========================================== -->

# 0 | Introduction: No Magic, Just JavaScript

When you write a modern web component and change a single variable, the right piece of the page updates by itself. It feels like magic. You never told the screen to refresh, yet it did, and only the part that depended on that variable changed. This entire chapter stands on the promise of that reactivity, and our goal is to take that magic completely apart. By the end of this hour, you will be able to build the automatic updates of a modern framework entirely from scratch, using nothing but plain JavaScript.

You will have a companion for this journey. Please keep the code snippets for this chapter open in front of you. I will not read code aloud, because syntax is for the eye, but I will tell you exactly which code snippet we are referencing at each step so you are never lost.

Let us establish the world we will inhabit today. Picture the digital newsroom of the National Times. We have a publishing application that manages articles, reader sessions, and clap counters. Every problem we solve today will happen inside this one newsroom. We will watch, one small step at a time, as a plain read turns into a function call, a function call turns into a way to record who is watching, and that record turns into a way to know exactly which corner of the page to redraw.

And it all begins with a single question, the question that drives this entire chapter. When you read a value, where does it come from, and what if reading it could quietly run some code of your own?


<!-- ========================================== -->
<!-- PART: 01-prototype.md -->
<!-- ========================================== -->

# 1 | Prototype: Own Properties First, Then Inherited from the Prototype

In our introduction, we asked a central question: what if simply reading a value could secretly run your own code in the background? To understand how a framework like Svelte actually does this, we have to start at the absolute floor of JavaScript. We need to look at how a plain object finds and returns a value when you ask for it. Look at the code snippet you have in front of you, titled Prototype Own Properties First, Then Inherited from the Prototype. There you will see a short class declaration, an instance creation, and three print statements.

Let us inhabit the digital workspace of the National Times. Picture a system that represents news stories. We have a blueprint for creating these stories, a class called Article. When a reporter creates a new story from this blueprint, we get an object instance. Let us call this specific story piece.

Our new story, piece, is created empty. It starts with no properties of its own. But we can add a headline directly onto it. We assign the text, Markets rally, to the headline property of our piece object. This is a property stored directly on the object itself. We call this an own property. An own property is a value stored directly on the object itself. Because the headline is an own property of the piece object, reading it is direct and fast. The own property is the first thing JavaScript looks for, and when it is present, the lookup ends.

Now let us perform our first read. We print the headline property of our piece object. JavaScript looks at our piece object, finds the headline stored directly on it, and immediately returns the text, Markets rally.

Now let us try a second read. We call the publish function on our piece object. But our piece object does not have its own publish property. We never assigned it. In a simpler language, this would fail. But JavaScript does not give up. It looks at the hidden link on our piece object, which points to a backup object. We call this backup object a prototype. A prototype is the hidden link from an object to its backup source of properties. When we defined the Article class, JavaScript put the publish function on this prototype object, which is shared by every single article instance we create. This prototype contains the publish function. Because our object is linked to this prototype, it can access the prototype's properties. The prototype acts as a single shared store for all article instances.

Since piece has no own property named publish, JavaScript walks to the prototype and finds it there. We say the property is an inherited property. An inherited property is a property used from a prototype because the object has no own copy. This inherited function is shared across every article we write, saving memory.

Finally, let us try a third read. We read the author property on our piece object. The piece object has no own property named author. JavaScript walks the hidden link to the prototype object, but the prototype does not have an author property either. What if the prototype itself does not have the property we want? JavaScript does not stop at the first prototype. If the backup object does not have the value, JavaScript follows that prototype's own hidden link to another prototype, and then another. We call this series of linked backup objects the prototype chain. The prototype chain is the series of linked prototype objects that JavaScript walks to resolve properties. This chain is the highway of lookup. It keeps walking from prototype to prototype until it finds the property or reaches the end of the chain, which is null. Because the author property is nowhere on the object and nowhere on its prototype chain, the read returns the value undefined.

Right now, reading a property is a passive search. When we read a property on an object, the lookup walks the prototype chain to find a stored value. Today, a read finds a value. Soon, we want a read to secretly run a function. But before we can intercept a read, we must understand how functions can keep their own data alive and private, long after they have finished running. That brings us to our next question: how can we keep a private counter alive without using a class at all?


<!-- ========================================== -->
<!-- PART: 02-closure.md -->
<!-- ========================================== -->

# 2 | Closure: A Function Keeps Its Variables Alive and Private

In our previous step, we saw how a plain object finds its properties, either directly or by searching its prototype chain. Right now, reading a property just finds a passive piece of data. Soon, we are going to need a read to secretly trigger some code. But before we can build that automatic trigger, we have to solve a simpler problem first. We need a way to keep our data alive and private, hidden away from the rest of the application. Look at the code snippet you have in front of you, titled Closure A Function Keeps Its Variables Alive and Private.

Let us return to our newsroom at The National Times. We want to add an applause button to our articles, and we need to track the number of claps. If we just create a normal variable, anyone can read it or overwrite it. We want to keep that clap count strictly private, safe from any outside interference.

Normally, when a function finishes running, any local variables you defined inside it vanish. The memory is immediately cleared. But JavaScript has a powerful exception. We can create a factory function called create clap button. Inside it, we declare a local variable named claps and set it to zero. Then, instead of returning a simple number, our factory function returns an object containing two methods. One method increments the count, and the other reads the total.

Because these two returned methods still reference the local claps variable, JavaScript cannot throw that variable away when the factory finishes. The variable stays alive in memory. We call this a closure. A closure is a function bundled with the variables it captured from where it was defined. The two methods close over the claps variable, keeping it alive long after the factory function has returned.

This gives us exactly what we wanted for our newsroom. The claps variable is alive, because the methods still hold it, and it is entirely private. Nothing outside the factory can ever read or write that variable directly. The only way you can change the count is to call the clap method. The only way you can read it is to call the total method. This private state is powerful, but it comes with a strict limitation. The data is trapped inside one function instance. What if you are building a large application, and fifty different files all need to share the exact same value?


<!-- ========================================== -->
<!-- PART: 03-module.md -->
<!-- ========================================== -->

# 3 | Module: A Module's State Is Created Once and Shared by Every Importer

In our previous step, we learned how a closure keeps a piece of data alive and private in memory. A closure is a function bundled with the variables it captured when it was created. This keeps our data safe, but it comes with a strict limitation: that private data is trapped inside one specific function instance. What if fifty different files across your application all need to share the exact same value? In our newsroom, we need to know who is reading our articles and clicking the clap buttons. We need a concept of a signed-in reader, and that reader's name must be accessible from the masthead, the comment form, and the article itself. Look at the code snippet you have in front of you, titled Module A Module's State Is Created Once and Shared by Every Importer.

We solve this sharing problem by putting our state in a module. A module is simply a file whose top-level code runs exactly once and whose exports are shared with anyone who asks for them. In our snippet, we have a file called session. Inside it, we declare a variable called current user and set it to John. Notice that we do not export this variable. Because it is not exported, it remains completely private. No other file can see it or touch it directly.

Instead, we export two functions: login, which changes the current user, and current, which reads it back. When your application starts, the very first file that imports these functions causes the session module to run. The current user variable is created once. After that, every other file that imports from the session module gets connected to that exact same variable. The module acts as a single shared store for the entire application.

If the application calls the login function and changes the name to Ada Lovelace, that single private variable is updated. The next time any file calls the current function, it will receive Ada Lovelace. The value is shared everywhere, perfectly in sync, because there is only ever one copy in memory. Our value is now shared safely across the entire application, but reading and writing it still requires typing out plain function calls. You still have to type login to set a value, and current to read it. How do we make those function calls look and act like normal property access? That brings us to the getter.


<!-- ========================================== -->
<!-- PART: 04-getter.md -->
<!-- ========================================== -->

# 4 | Getter: A Getter Runs a Function Every Time You Read It

In our previous step, we learned how a module can safely share a single piece of private data across an entire application. But to read or change that shared data, we still had to type out explicit function calls, like login or current. What if reading a value could secretly run code in the background, without forcing you to type parentheses? In our newsroom, an article has an author. When we display the article on the page, we want to format that author into a proper byline, adding the word By before their name. Look at the code snippet you have in front of you, titled Getter A Getter Runs a Function Every Time You Read It.

We start by placing an author property directly on our article object, storing the name Ada Lovelace. This is a plain data property. When we read it, JavaScript simply hands back the stored string. No code runs. But right below it, we define a second property called byline, using the special JavaScript keyword get.

This keyword makes byline a getter. A getter is a property that runs a function on every read instead of simply returning a stored value. When you read the byline property in your code, you do not type parentheses. To the outside world, it looks exactly like reading a plain piece of data. But behind the scenes, reading it triggers our function. The function takes the word By, joins it with the current author's name, and returns the fresh string: By Ada Lovelace.

If an editor changes the article's author to Grace Hopper, the plain author property is updated. The next time your code reads the byline property, the getter secretly runs its code again, picking up the new author and returning By Grace Hopper. This trick is called interception. Interception is making an ordinary property read or write secretly run code in the background. The getter intercepts the read of the byline property and runs our formatting code in the gap. But a getter comes with a very strict limitation. You have to write a separate getter function for every single property you want to intercept. If an object has fifty properties, you have to write fifty getters. How do we intercept a read on a property without having to define it in advance?


<!-- ========================================== -->
<!-- PART: 05-proxy.md -->
<!-- ========================================== -->

# 5 | Proxy: A Proxy Intercepts Every Read and Write Through Traps

In our previous step, we learned how a getter can secretly run code when you read a specific property. But we saw that a getter comes with a very strict limitation. You have to write a separate getter function for every single property you want to intercept. If you want to intercept fifty properties, you have to write fifty getters. And if your application adds a brand new property later, your getter will never see it. How do we secretly intercept reading or writing a property without having to define it in advance? In our newsroom, we want to audit our article objects. We want to automatically log a message to the console every single time any property is read or written, even for properties we invent later. Look at the code snippet you have in front of you, titled Proxy A Proxy Intercepts Every Read and Write Through Traps.

JavaScript gives us a tool to wrap an entire object, intercepting absolutely everything that happens to it. We take our original article object, which we call the target, and we hand it to a new Proxy. A Proxy is an invisible wrapper around an object that lets us secretly intercept standard operations. Our Proxy sits entirely in front of the target article. Any code trying to read or write the article must go through the Proxy first.

We give our Proxy two specific secret interceptors to run when an operation happens. JavaScript calls these interceptors traps. A trap is a handler function a Proxy runs for a specific operation, like getting or setting a value. We define a get trap to run whenever any property is read, and a set trap to run whenever any property is written. Inside our get trap, we print the word read followed by the name of the property, and then we return the real value from the target article. Inside our set trap, we print the word write, save the new value onto the target article, and finish.

Now, when you read the headline property through our Proxy, the get trap fires first. It prints our log message, then hands back the headline. If you decide to add a brand new property to the article, setting a claps count to five, the set trap fires. Even though the claps property never existed before, the Proxy intercepts the write, logs it, and stores the number. We can now run code on every read and every write, catching properties we never named in advance. What is the most useful thing we could possibly run inside that gap?


<!-- ========================================== -->
<!-- PART: 06-observer.md -->
<!-- ========================================== -->

# 6 | Observer: Track on Read, Trigger on Write

In our previous step, we learned how a Proxy can secretly intercept every single time a property is read or written. We can now execute any code we want in that invisible gap. What is the most useful thing we could possibly run there? If a piece of your code reads a value specifically to print it to the screen, we want that exact piece of code to run again the moment the value changes. Look at the code snippet you have in front of you, titled Observer Track on Read, Trigger on Write.

We begin with a single empty slot. A global variable named active effect. This slot asks one specific question: which function is currently reading data right now? Then we build our tracking functions. We create a function called signal that holds our clap count and an empty list of dependents. A signal is a value that secretly records who reads it, and then re-runs them when it changes. Our signal has two halves. When some code reads it, the signal checks that global slot. If a function is parked there, the signal records that function in its private list. This is called tracking. Later, when a new clap count is written, the signal loops through its list of dependents and re-runs every function it recorded. This is called triggering.

To make this entire process go, we create a helper function called effect. An effect is a function whose reads subscribe it to changes, so it automatically re-runs when its signals update. When we pass our printing code into the effect function, it parks that code in the global slot and runs it once. Because it runs, it reads the clap count. Because it reads the clap count while parked in the slot, the signal records it. A dependency is formed. A dependency is the recorded link from a signal to an effect that read it.

The effect has now subscribed itself automatically, simply by doing its normal work. When your application writes a new number to the clap count, the signal triggers. It loops through its dependents and re-runs our printing code automatically. The value notices its readers and re-runs them. But as we will soon see, this manual approach asks too much of the developer. Right now, to make this work, you have to manually call a special read function every single time you look at a variable, and a special write function every single time you change it. How do we make this automatic tracking look and act like standard JavaScript property access?


<!-- ========================================== -->
<!-- PART: 07-reactive-object.md -->
<!-- ========================================== -->

# 7 | The Reactive Object: Making Normal Code Trigger Automatic Updates

In our previous step, we learned how to record a side effect and re-run it automatically whenever our data changes. A side effect is simply any code that interacts with the outside world, like a function that updates the screen when a score increases. We figured out how to make that happen, but our current method asks too much of the developer. Right now, if you want the screen to update, you cannot just read or write a property normally. You have to manually call a special read function every single time you look at a variable, and you have to call a special write function every single time you change it. That is exhausting to type, and it leaves your code looking completely unnatural. We want this to feel like magic. We want you to be able to write standard JavaScript, like article dot claps equals two, and have the screen update all by itself. To make that happen, we have to hide those manual read and write functions. We need a way to secretly intercept your code in the background whenever you touch a property. We can do exactly that using a native JavaScript feature called a Proxy. A Proxy is an invisible wrapper around an object that lets us secretly intercept standard operations, like reading or writing a property. Look at the code snippet you have in front of you, titled Reactive Object Wrap an Object So Reads Track and Writes Trigger.

Here, all the pieces we have built come together to solve our typing problem. Imagine our familiar article object at The National Times, starting with a property for claps set to zero. We take that plain article object and pass it to a new function called reactive. This function wraps our article object inside a Proxy. Inside that Proxy, we define two secret interceptors, which JavaScript calls traps. The get trap intercepts any attempt to read a property. The set trap intercepts any attempt to write a new value to a property.

Now, watch how this invisible wrapper works in the background. If a side effect is currently running to print the claps to the screen, that code has to read the claps property. Our new get trap secretly intercepts that read operation. It sees the active side effect and records it, exactly like our manual read function did, but it does it entirely behind your back. Later, when a reader clicks the clap button, your application simply writes a new value to the claps property. Our new set trap secretly intercepts that write operation. It saves the new value, and then it re-runs every recorded side effect, exactly like our manual write function did. We have successfully built a reactive object. A reactive object is simply a Proxy that tracks reads and triggers writes on every property transparently.

When you write code against this new article object, you use normal dot syntax. You write article dot claps equals two. You never call a read function. You never call a subscribe method. The Proxy intercepts your standard JavaScript assignment, handles all the tracking in the background, and triggers the screen update. Furthermore, this system is highly precise. Because the get trap only records the specific side effects that read the claps property, only those specific side effects will re-run when the claps change. This precision is called fine-grained reactivity. Fine-grained reactivity means only the side effects that read a value re-run when that value changes.

Write a plain assignment, and exactly the right code re-runs itself. This automatic tracking system is now complete. The question is, how does a framework like Svelte put this exact mechanism into your hands?


<!-- ========================================== -->
<!-- PART: 08-state-dom.md -->
<!-- ========================================== -->

# 8 | State to DOM: Changing $state Updates Only the Nodes That Read It

In our previous step, we combined a Proxy and our signal tracker to create a reactive object. We successfully hid all the complex tracking and triggering mechanics behind standard property access. You can simply assign a value with a normal equals sign, and the code updates automatically. But how does a real framework like Svelte put this exact power into your hands, without making you write all that complex plumbing yourself? Look at the final code snippet you have in front of you, titled State to DOM Changing state Updates Only the Nodes That Read It.

Here we see a real Svelte component. Inside the script tag, we declare a variable called claps and assign it the result of calling state with a zero. That state call is a rune. A rune is a compiler symbol that tells Svelte to mark a specific piece of code as reactive. Under the hood, Svelte is doing exactly what we just did by hand. That state rune gives us back a reactive object, complete with an invisible Proxy, a get trap for tracking who reads it, and a set trap for triggering updates when it changes.

Down in the markup, we have a button that increments the claps variable when clicked. Inside that button is a small piece of text that reads the claps variable to display the total to the screen. Because that text reads the variable, Svelte automatically turns that text into an effect. The text subscribes itself to the reactive object. When a reader clicks the button, you write a new number to the variable. The Proxy intercepts that write, triggers the update, and re-runs exactly the effect that was listening.

The text on the screen updates. Nothing else on the page re-renders. This is a fine-grained update. A fine-grained update means only the specific HTML elements that read a value are updated, never the entire component. We have reached the end of the chain. You read a value, the read was intercepted by a Proxy, the Proxy recorded the text as a dependency, and when you wrote a new value, only that text updated.


<!-- ========================================== -->
<!-- PART: 99-outro.md -->
<!-- ========================================== -->

# 99 | Outro: Synthesis (groundwork with no corresponding code snippet)

We have taken the magic apart, piece by piece, and found nothing but plain JavaScript underneath. The entire mechanism of reactivity is simply a property read that something else is secretly watching.

We started with a closure, a function bundled with the variables it captured from where it was defined, giving us private state. We looked at a module, a file whose top-level code runs once and whose exports are shared, giving us shared state. We saw a plain data property, which stores a value and returns it directly when read, turn into a getter, a property that runs a function on every read instead of returning a stored value. That was our first taste of interception, making an ordinary read or write secretly run code.

To intercept every property without naming them first, we reached for a Proxy, an invisible wrapper around an object that lets us secretly intercept standard operations. A trap is simply a handler function a Proxy runs for a specific operation, like getting or setting a value. We used those traps to build a signal, a value that secretly records who reads it, and then re-runs them when it changes. We built an effect, a function whose reads subscribe it to changes, so it automatically re-runs when its signals update. The connection between them is a dependency, the recorded link from a signal to an effect that read it.

Putting the Proxy and the signal together gave us a reactive object, a Proxy that tracks reads and triggers writes on every property. This creates fine-grained reactivity, where only the effects that actually read a value re-run when it changes. Svelte hands you this power through a rune, a compiler symbol that tells Svelte to mark a specific piece of code as reactive. In the browser, this produces a fine-grained update, where only the specific HTML elements that read a value are updated, never the entire component.

We have walked through every step in this chapter, exactly in order, skipping nothing. There is no magic left. You now know exactly what is happening when you change a variable and the screen updates. The read is intercepted, the effect is triggered, and the page redraws. We will use this exact tracking pattern in everything we build next.

