# T02 — Student THOUGHTS (reading the professor's T02 turn)

OK he ran my doubler. n is 3, nDoubled starts at 6, the watcher writes n*2 into nDoubled, the second watcher logs it. n.write(4) fires the first watcher, which writes 8, which fires the second watcher, which logs 8. Output 6, 8. Yes. That is exactly my pattern. Good, he is not dodging.

"So I concede the number. What I do not concede is the word 'same.'" OK so the fight is not about the output. Fine.

"Your doubler is two tools bolted together: a watcher to do the math, and a spare signal to be the answer. The derived is the single tool that fuses them." Hmm. OK. That reframes what I did. I did not think of it as "two tools," I thought of it as "the normal way you do a derived when you do not have a derived rune." But he is saying the spare signal plus the watcher IS two tools, and the derived collapses them into one. I can grant that. It is a packaging difference. But packaging is not "completely different machinery." So far this is shaping, not a real distinction.

Then the push/pull thing. Let me go slow.

"A watch is push: the moment n changes, the watcher fires, like a shout." OK. Push = fires immediately on change. Defined inline. The shout metaphor is fine, I get it, the value yells "I changed" and the subscriber has to deal with it right now. That IS how useEffect works, the effect runs when the dependency changes. Fine.

"A derived is pull: when n changes, nothing happens yet, the change is just remembered, like a sticky note left on the desk, and the math only happens later when somebody actually asks for the answer." Wait. Nothing happens when n changes? So if I have `let doubled = $derived(count * 2)`, and I change count, and NOBODY reads doubled, then... doubled does not recompute? And even if somebody does read it, it only recomputes AT the moment of reading? That is weird. That is not how I assumed it worked. I assumed $derived was just useMemo, and useMemo runs when its deps change. He is saying no, it runs when you READ it. That is a real difference from useMemo, actually. Huh. OK, pull = compute on read. Got it. Sticky note metaphor works.

"Push shouts, pull waits." Clean pair. I can repeat that.

"Now take pull seriously and you will find the hole yourself. If pull means 'do nothing when the input changes,' then a purely lazy box never finds out its input changed at all."

...wait. Yeah. OK. Let me think about this.

If a derived does NOTHING when n changes, then how does it know it needs to recompute when I finally read it? Two options as far as I can see.

Option one: every single read recomputes from scratch. Read doubled, it reads count, multiplies, returns. Every read. But that is just inlining `count * 2`, it is not caching anything, so why call it a special mechanism. He made it sound like there is real machinery here. So probably not option one.

Option two: the derived caches the last answer, and only recomputes if something TOLD it the input changed. But "being told the input changed" is... a push. That is literally the shout. He just said a derived is pull, not push. So where does the "told it changed" come from?

And there is a worse version. Go back to the rule from T01. The ONLY way a signal learns about a function is when that function calls read() while the flag is up. So for a derived to know that count is its input, the derived has to, at some point, raise the flag on itself and call count.read(). But pull says the derived only acts when read. It does not go raising flags on its own. So when does it raise the flag?

And before it ever raises the flag, count does not even know the derived exists. So if I write to count before the first read of the derived, count has nobody to notify.

So my objection: pull, as stated, is broken. Either it is dumb (recompute every read) or it needs a hidden push (be told when count changes) and a hidden first-read flag-raise (to subscribe in the first place). I think the answer is going to be that the FIRST read is special, that is where the derived raises its own flag, runs the function, subscribes to count, caches the answer, and then after that it plays lazy. But he did not say that, and I am not going to pretend I am sure. I am guessing.

Actually wait, let me check I am not strawmanning him. Re-read: "when n changes, nothing happens yet, the change is just remembered." "Remembered" is doing work in that sentence. Remembered BY WHOM. If nothing happens on change, there is no "remembering" happening either. Unless "remembered" means a flag gets set somewhere, which is... an action, which is a push. So even his own sentence has a hidden push in the word "remembered." I think he knows this and he is handing it to me. The contradiction is the point.

He literally ended with "sit with that. It is exactly where I want you." So he wants me to come back with the contradiction. Good. I will.

One thing I am NOT going to do: I am not going to confidently state the first-read hypothesis as if I derived it. I am 60% on it. I will offer it as a guess and ask him to confirm or kill it, because if I am wrong I want to know now, not after I have built on it.

Also the slide: minimal, just my doubler and its output. Fine. He is not front-loading architecture. Good.
