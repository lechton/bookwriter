# Metaphor Registry — Used Concepts Across All Decks

**Purpose:** freshness and genre control for the design workflow (`docs/design-workflow.md`). Before naming a new diagram, check this list: the concept name must be new, and a deck should mix genres (violation, fog, choice, process). Register every shipped metaphor here.
**Legend — Genre:** violation (expectation staged and crossed out) · fog (invisible made physical) · choice (asymmetric comparison) · process (staged sequence) · — (no real metaphor, genre-less)

| Concept name | Topic | Deck | Genre | Origin |
|---|---|---|---|---|
| (plain stack) | $state | svelte-demo 01 | — | local |
| (plain stack) | $derived | svelte-demo 02 | — | local |
| (plain stack) | $effect | svelte-demo 03 | — | local |
| Data Flow Diagram | props | svelte-demo 04 | process | online transcription |
| Old Way vs Universal State | prop drilling | svelte-demo 05 | choice | online transcription |
| The Switch | events (on:click → onclick) | svelte-demo 06 | choice | online transcription |
| Blueprint Factory | #snippet | svelte-demo 07 | fog (machine) | online transcription |
| Two-Way Street | $bindable | svelte-demo 08 | violation (flow) | online transcription |
| Developer Console | $inspect | svelte-demo 09 | fog (grounding) | online transcription |
| Lifecycle Pipeline | effect cleanup | svelte-demo 10 | process | online transcription |
| Blueprint and Instances | class reactivity | svelte-demo 11 | fog (grounding) | online transcription |
| Triggers vs Ignored lanes | untrack | svelte-demo 12 | violation | online transcription |
| Timeline | $effect.pre | svelte-demo 13 | process | online transcription |
| Hub fan-out | dynamic components | svelte-demo 14 | fog (grounding) | online transcription |
| Safe Zone | error boundaries | svelte-demo 15 | fog (container) | online transcription |
| Deep vs Shallow (VS) | $state.raw | svelte-demo 16 | choice | online transcription |
| Auto vs Manual Cleanup | $effect.root | svelte-demo 17 | choice | online transcription |
| Capacity Compare | $derived vs $derived.by | svelte-demo 18 | choice | online transcription |
| The Lookup Walks Up | prototype chain | javascript-demo 01 | violation (chain) | local |
| One Hidden Variable | closure | javascript-demo 02 | fog (container) | local |
| — | module pattern | javascript-demo 03 | — | local |
| Two Reads, Two Outcomes | getter | javascript-demo 04 | violation | local |
| The Checkpoint | proxy traps | javascript-demo 05 | fog (social) | local |
| The Engine, Two Moves | observer | javascript-demo 06 | fog (machine) | local |
| One Surface, Two Faces | reactive object | javascript-demo 07 | — | local |
| — | state to DOM | javascript-demo 08 | — | local |
| Lexical Environment | closure | javascript-demo-02 01 | fog (container) | online transcription |
| Dead Wire vs Live Wire | $state | exp-001_state 01 | violation | workflow (ZCode) |
| The Live Feed | $state | exp-001_state 02 | fog (social) | workflow (ZCode) |
| The Wrecking Ball | {#key} blocks | exp-002_key 02 | violation | workflow (ZCode) |
| The Press Run | flushSync, update batching | exp-003_new-topics 01 | violation | workflow (ZCode) |
| Waiting on the Wire | {#await} | exp-003_new-topics 02 | fog (social) | workflow (ZCode) |

**Observations:** choice and process genres are well covered; violation is the strongest under-used genre for the Svelte deck (closures, cleanup, key blocks all qualify); svelte-demo 01–03 still carry no metaphor at all and are the top re-authoring candidates (brief 001, recommendation 5). Update 2026-07-19: exp-005 redrew the five workflow cards (rows exp-001 through exp-003 above) using the `metaphors.css` render vocabulary — same concept names, upgraded execution; the originals stay frozen in their folders for before/after comparison.
