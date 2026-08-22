# Thinking — {#key} block (exp-002, workflow arm)

PHASE A — DIAGNOSE THE LEARNER
A1. STUMBLE. Candidates: (a) "keys are only for {#each} lists" — common, but about a different API; (b) "changing the key expression just re-renders the block with new data, like any other state change" — the most common and the most costly; (c) "key blocks are a performance trick" — vague, rare. Pick (b). Silent expectation: "a key change updates in place."
A2. WHY IT FEELS RIGHT. Every other change in Svelte patches the DOM in place and preserves component state; a `let` update never destroys anything. There is no reason to expect identity semantics from a template block.
A3. THE KEY. `{#key}` never updates — a key change is a demolition: the old instance and its local state are destroyed, a fresh instance is built. You reach for it when you WANT the reset (or you lose a user's typed draft when you did not).
A4. TYPE + SCENE. Violation. Stage the expected "update in place, state survives" next to the actual "teardown, state from zero".

PHASE B — CAST AND RENDER
B1. CAST. (i) Demolition crew: same address, old building razed, new one erected (social/machine). (ii) Hotel room changeover: guest checks out, room stripped to bare (social). (iii) Two lanes at a repair shop: patch job vs full rebuild (machine). Pick (i): demolition makes destruction unmistakable, and "same address" maps to same component position.
B2. MAP. key expression = the address/plot (`article.id: 7 → 8`); normal state change = a patch/renovation (draft survives); key change = wrecking ball (old instance struck through, draft destroyed); fresh instance = new building (state from zero). The wrong expectation appears as the struck-through "updated in place" lane.
B3. NAME. "The Wrecking Ball" — checked against docs/metaphor-registry.md: not present; genre violation, under-used in the Svelte deck. Good.
B4. RENDER. Two lanes sharing identical chrome so the only difference is the fate of the instance: lane 1 "id stays 7" ends in "draft survives"; lane 2 "id goes 7 → 8" passes through DEMOLISHED (struck-through gray box) to "state from zero".
B5. CHECK. Imaginary reader's question was "why did my comment draft vanish when I switched articles?" The diagram shows the draft dying in the demolition lane. Answers their question. Proceed.

TEXT. Q = the confused user's own words (the lost draft). Answer = verdict first (never updates, always rebuilds). Why it works = identity vs patch semantics.
