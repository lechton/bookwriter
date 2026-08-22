# 8 | State to DOM: Changing $state Updates Only the Nodes That Read It

We have built our engine. The question is, how does a framework like Svelte put this engine into your hands? Look at the final code snippet you have in front of you, titled: State to DOM: Changing $state Updates Only the Nodes That Read It.

Here we see a real Svelte component. Inside the script tag, we declare a variable called claps and assign it the result of calling state with a zero. That state call is a rune. A rune is a compiler symbol that marks reactive code. Under the hood, Svelte is doing exactly what we just did by hand. That state rune returns a reactive object, complete with a proxy, a get trap for tracking, and a set trap for triggering. 

Down in the markup, we have a button that increments the claps variable when clicked. Inside the button is a small text node that reads the claps variable to display the total. Because that text node reads the variable, Svelte automatically turns that text node into an effect. The text node subscribes to the reactive object. When you click the button, you write to the variable. The proxy intercepts the write, triggers the update, and re-runs exactly the effect that was listening.

The text node on the screen updates. Nothing else on the page re-renders. This is a fine-grained update. A fine-grained update means only the DOM nodes that read a value re-run, never the whole component. We have reached the end of the chain. You read a value, the read was intercepted by a proxy, the proxy recorded the text node as a dependency, and when you wrote a new value, the text node updated.
