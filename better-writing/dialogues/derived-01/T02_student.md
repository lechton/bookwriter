# T02 — Student

I sat with the contradiction you handed me, and I want to push it all the way to a break before you say another word, because I think "pull" as you stated it does not close on its own.

Take pull literally. A derived recomputes only when read. It does nothing when its inputs change. So `n` goes from 3 to 4, and the derived just sits there. Later, somebody reads the derived, it reads `n`, gets 4, returns 8. The answer is correct when finally read. So far pull is fine.

Now the problem. For "recompute on read" to be smarter than just inlining `n * 2` everywhere, the derived must NOT recompute on every read. It must sometimes return a stored answer. Which means it must KNOW whether its inputs changed since it last computed. Which means something has to TELL it that `n` changed. And "telling it that n changed" is a push. A pure pull model has no push in it. So either the derived is dumb, recomputing every read, in which case it is not an architecture worth naming, or it is smart, in which case there is a push half hiding inside it. There is no third option I can find.

And there is a sharper version, using the rule you put back on the table at the start of 001. You said: the ONLY way a signal learns about a function is when that function calls `read()` while `flagged_function` points at it. For a derived to know that `n` is its input, the derived must, at some point, raise the flag on itself and call `n.read()`. But pull says the derived only acts when read, it does not go running around on its own. So when does the derived ever raise its own flag? And before it does, before the very first read, `n` does not even know the derived exists, so a write to `n` before the first read cannot possibly mark anything dirty.

Here is my hypothesis, and I want you to confirm or kill it. A derived is secretly a watcher that fires once on the first read: on that first read it raises its own flag, runs the function, subscribes to whatever it reads, caches the answer, and drops the flag. After that first read it switches into lazy mode: writes to its dependencies just mark it dirty, reads recompute only if dirty. So "pull" is only half the story. The first read is a push in disguise, the one moment the derived acts on its own to wire itself up. Then the "never swap" sentence from your slide is misleading as written, because a derived needs a push half too.

Either confirm that and show me the code, or show me where the push lives if I have it wrong.
