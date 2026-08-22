# T01 — Student THOUGHTS (reading the professor's T01 turn)

OK, one sentence from the last lesson. "Reading a signal is the moment the signal learns about you, writing a signal is the moment everyone who learned about it gets called." Yes, I remember this, we built it, read subscribes write notifies. "A single shared flag says who is currently running." Right, flagged_function, the global variable. Fine, I am with him, this is recap.

"The topic today is the derived rune, the value that computes itself from other values, like a spreadsheet cell with a formula." OK. Spreadsheet cell with a formula. So like, A3 = A1 + A2. I do not type the number into A3, the formula makes it from A1 and A2. That is `$derived`, I have seen it in the Svelte docs. `let doubled = $derived(count * 2)`. Fine, I have a working picture.

"The derived rune and the watch rune are not the same thing, even though they look like they do the same job." Hold on. What is the watch rune. He just dropped "watch rune" like I should know it. I think he means `$effect`, the thing that runs and re-runs when state changes, basically `useEffect` from React. I am going to assume that. If he means something else I will be annoyed, because he did not define it. Mild flag.

But here is the thing that actually makes me push back. "Not the same thing, even though they look like they do the same job." From where I am sitting, they DO do the same job. In React I would write the doubler two ways. Either `const doubled = useMemo(() => count * 2, [count])`, which is the derived flavor, or `useEffect(() => setDoubled(count * 2), [count])` with a separate state for doubled, which is the watch flavor. Both give me a `doubled` that tracks `count * 2`. I have literally written both in real code. The useMemo version is just the cleaner one. They are not different *things*, they are different *spellings* of "recompute when count changes."

He says they are not the same. I do not see it. The spreadsheet analogy even supports me: a spreadsheet cell with a formula updates when its inputs change. A watch that updates a variable when its inputs change does the same thing. Where is the difference.

He is asking me to push back, he literally ended with "tell me why a derived and a watch cannot possibly be the same." He wants the counterexample. My counterexample is the doubler. I will throw the React-shaped doubler at him, both spellings, same result, and ask him where the difference is. If he cannot find one, the claim is empty.

One thing I notice about the slide: it is literally just the rule restated in comments. No code architecture, no diagram. He is being deliberately sparse. That is fine, it is a recap slide. I am not going to read anything into it.

Also: "the derived rune is built on top of it." Built on top of read-subscribes-write-notifies. OK. So the derived is not a separate mechanism, it is the same signal machinery arranged differently. That is a useful frame. I will hold it. Maybe that is the seed of the answer, that the derived uses the same flag-and-list machinery but arranges it differently than the watch does. But I cannot see HOW yet, so I am not going to pretend to. I will ask.
