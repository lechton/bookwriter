# 99 | Outro: Synthesis (groundwork with no corresponding code snippet)

We have taken the magic apart, piece by piece, and found nothing but plain JavaScript underneath. The entire system of reactivity is just a read that something is watching.

We started with a closure, a function bundled with the variables it captured from where it was defined, giving us private state. We looked at a module, a file whose top-level code runs once and whose exports are shared, giving us shared state. We saw a plain data property, which stores a value and returns it as-is when read, turn into a getter, a property that runs a function on every read instead of returning a stored value. That was our first taste of interception, making an ordinary read or write secretly run code. 

To intercept every property, we reached for a proxy, an object that wraps a target and intercepts its operations through traps. A trap is simply a handler function a proxy runs for a specific operation, like get or set. We used those traps to build a signal, a value that records who reads it and re-runs them when it changes. We built an effect, a function whose reads subscribe it, so it re-runs when its signals change. The connection between them is a dependency, the recorded link from a signal to an effect that read it. 

Putting the proxy and the signal together gave us a reactive object, a proxy that tracks reads and triggers writes on every property. This creates fine-grained reactivity, where only the effects that read a value re-run when it changes. Svelte hands you this engine through a rune, a compiler symbol that marks reactive code. In the browser, this produces a fine-grained update, where only the DOM nodes that read a value re-run, never the whole component.

We have walked through every code snippet in this chapter, exactly in order, deferring none. There is no magic left. You now know exactly what is happening when you change a variable and the screen updates. The read is intercepted, the effect is triggered, and the page redraws. We will use this engine in everything we build next.
