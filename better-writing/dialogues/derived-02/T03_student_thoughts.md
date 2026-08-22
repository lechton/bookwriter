# T03 — Student THOUGHTS (reading the professor's T03 turn)

"Your hypothesis is right." OK. Good. He confirmed it before adding anything. That is the second time he has done that confirm-first thing. I appreciate it, it means I can trust the new stuff he piles on top.

"The first read is the special moment. On the first read, the derived raises its own flag, runs your function, and because the flag is up while your function calls price.read(), price adds the derived to its list." Yes. That is what I said. The first read is where it subscribes. Confirmed. Good.

"After that, the derived plays lazy." OK.

Then the fridge thing. Let me go slow because three words landed at once.

"sticky note on it that says 'milk might be off, check before you use it.'" OK. Sticky note = dirty flag. It does not check, it just says check. Fine. Dirty means "might be stale, recompute before returning." Got it.

But wait. Dirty. The word itself. He used the word dirty. I have heard "dirty" exactly once in my career and it was "dirty checking," which I think Angular 1 did, and I never actually understood what it meant. I think it was something like "compare every watched value to its last value, every digest cycle." That always sounded expensive and weird. Is THIS dirty the same dirty? He... did not address that. He defined it as "a one-bit flag that says might be stale," which is way simpler than what I thought dirty checking was. So either it is a different dirty, or my understanding of dirty checking was wrong, or he is oversimplifying. I do not know which. The definition he gave is clear enough to use, so I will use it, but the word itself is sitting on top of a pile of vague Angular baggage and I am not sure they are the same thing. I might ask. Or I might not, because I do not want to derail. Let me hold the question and see if it matters.

"yesterday's meal sitting there... yesterday's meal is the cached answer." Cache. I know cache from HTTP. The browser keeps a copy so it does not re-fetch. Same idea here: keep the last computed answer so you do not recompute. Fine, no friction. Cache = the stored last result.

"the act of cooking a fresh meal is recompute: running your function again." Recompute = run the function again. Trivial, fine.

So the three words: dirty (sticky note), cached (yesterday's meal), recompute (cooking). One picture. OK, that landed. The fridge picture actually helps, I will keep it.

Then the lifecycle: "when price changes, the derived does not recompute, it just flips the sticky note to dirty. When somebody reads the derived, it checks the note. If dirty, recompute, store fresh answer, flip note to clean. If not dirty, hand back yesterday's meal." OK. That closes the loop from T02. Writes flip the note, reads cook if the note says dirty. So pull is real, but the "remembered" part is just a boolean. That was the hidden push: a write DOES do something, it sets the dirty flag. So it is not "nothing happens on write," it is "the only thing that happens on write is a boolean flip." That is a much weaker push than I was imagining. Fine. The contradiction is resolved. Writes do one tiny thing (flip a bit), reads do the heavy thing (recompute if the bit is flipped). OK.

Now the proof. recomputeCount. Before any read: 0. Two writes (9, then 12): still 0. One read: jumps to 1, returns 1200. Second read: stays at 1, same 1200. OK. That is deniable. The writes did not recompute (count stayed 0). The first read recomputed (count to 1). The second read did not recompute (count stayed at 1, same 1200). So the cache is real, the laziness is real, the dirty flag is real. I believe it, because the numbers are right there. Concrete proofs always land for me, this is no exception. Good.

One thing I notice that he did NOT explain. In the lifecycle he said "price adds the derived to its list." So the derived ends up in price's subscribers list. Fine. But he did not say anything about whether OTHER things can depend on the derived. Like, can a second derived read this derived? Or can a watcher read this derived? In the makeSignal world, a signal has a subscribers list and other things subscribe to it. Does a derived have its own subscribers list too, so other things can subscribe to IT? He did not say. It would make sense, structurally, if it did, because otherwise how would a chain of deriveds work. But he did not address it. I am going to file that as a question for later. I do not want to ask it now because I am still absorbing the dirty/cached thing and I do not want to pile on.

So where am I. I believe the mechanism conceptually: first read subscribes, writes flip a dirty bit, reads recompute-if-dirty and cache. The proof backs it. What I do NOT have is the actual code. He has described it in prose, with the fridge picture, but I have not seen makeDerived. And I am the kind of person who does not really trust a mechanism until I have seen the code. So I want the code. But I am also a little nervous about the code, because from the T01 rule I know this thing has to raise its own flag and lower it, and from the slide I can see it has cached and dirty, and there are probably multiple functions inside makeDerived, and multi-function closures are where I lose the thread. So I am going to ask for the code, but I am going to tell him upfront that I expect to get lost in the structure, so he should go slow and not dump all three inner functions at me at once.

Also: I still have the "is this the same dirty as Angular dirty checking" question in my pocket. I will ask it alongside the code request, because it is a quick yes/no and it is bugging me.

That is my turn. Ask for the code, warn him I will get lost in multi-function closures, and ask the dirty/Angular question.
