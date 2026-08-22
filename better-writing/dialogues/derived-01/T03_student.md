# T03 — Student

Let me say the lifecycle back, then I will tell you about the save-and-restore lines.

First read of total. dirty is true (it starts true, you said, so the first read computes), so read calls recompute. recompute saves previous, which is null here because nobody is running, sets flagged_function to run, calls my function. My function calls price.read(). The flag is up, so price adds run to its own subscribers, then returns 3. My function returns 300. recompute stores 300 in cached, restores flagged_function to null, sets dirty to false. read returns 300.

Now price.write(9). price updates its value, then loops its subscribers. subscribers is [run] now, because the first read put it there. price calls run. run checks dirty, it is false, so it sets dirty to true, loops its own subscribers (empty, nothing depends on total yet), and returns. No recompute happened. dirty is just true.

Later, read total again. dirty is true, so recompute runs. flagged_function = run, my function runs, reads price (gets 9, re-subscribes run, already there, Set dedups), returns 900, cached = 900, dirty false. Return 900.

That is the loop. Push marks dirty without computing, pull computes only if dirty, and a clean read returns the cache for free.

One thing you did not flag explicitly that I want to confirm, because it surprised me in the code. makeDerived has its own subscribers list, the same shape as a signal. That means a derived is not only a consumer of dependencies, it is also a producer. Other things can depend on a derived the same way they depend on a signal: by reading it while flagged. That is what the first line of read does, `if (flagged_function) subscribers.add(flagged_function)`, and it is why run loops subscribers when it marks dirty. So a derived sits in the middle of a chain. Upstream, it subscribes to its inputs through recompute. Downstream, other things subscribe to it through its read. Is that right? Because if it is, then the save-and-restore question almost answers itself.

Here is my hypothesis on the save-and-restore. If recompute is called while some other flagged function is still on the stack, say a watcher is running and it reads a derived, then recompute must not clobber that watcher's flag and must not null it at the end either, or the watcher's later reads would not subscribe. So instead of `flagged_function = null` like watchEffect does, recompute does `flagged_function = previous`, restoring whoever was running before. The case that forces this is when a recompute happens inside another recompute, which I think is the derived-of-derived case: if c depends on b, reading c recomputes c, which reads b, and if b is dirty that read recomputes b, nested inside c's recompute. Each nested recompute has to save and restore so it does not wipe the flag of the recompute above it. That is my guess.

Confirm the subscribers-as-producer point, and either confirm the save-and-restore hypothesis or show me the actual breaking case, because I would rather see it run than trust my guess.
