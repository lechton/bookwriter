# 7 | Reactive Object: Wrap an Object So Reads Track and Writes Trigger

Our engine works perfectly, but we had to call a read function and a write function manually to trigger the tracking. If we want this to feel like magic, we have to make it look like a plain JavaScript object. Look at the code snippet you have in front of you, titled: Reactive Object: Wrap an Object So Reads Track and Writes Trigger.

Here, all the pieces we have built come together. We take a plain object with a claps property and pass it to a new function called reactive. This function wraps our object in a proxy. Inside that proxy, the get trap does the tracking. If an effect is currently running, the get trap records it. The set trap does the triggering. When a new value is written, the set trap saves it and then re-runs every recorded effect. We have built a reactive object. A reactive object is a proxy that tracks reads and triggers writes on every property. 

When you write code against this article object, you use normal dot syntax. You write article dot claps equals two. You never call a read function. You never call a subscribe method. The proxy intercepts the assignment, handles the bookkeeping in the background, and triggers the update. Furthermore, this system is highly precise. Only the specific effects that read the claps property will be recorded. When claps changes, only those specific effects will re-run. This is fine-grained reactivity. Fine-grained reactivity means only the effects that read a value re-run when it changes. 

Write a plain assignment, and exactly the right code re-runs itself. This engine is complete. The question is, how does a framework like Svelte put this engine into your hands?
