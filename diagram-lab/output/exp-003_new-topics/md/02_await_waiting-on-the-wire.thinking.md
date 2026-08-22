# Thinking — {#await} block (exp-003)

PHASE A — DIAGNOSE THE LEARNER
A1. STUMBLE. Candidates: (a) "I must hand-roll a loading boolean plus try/catch in script to show spinner and error states" — the most common, learners reach for script glue because that is where promises live in plain JS; (b) "the await block pauses the whole page" — vaguer; (c) "then/catch branches are optional extras" — rare. Pick (a), with the fog form: "where do the spinner and the error message even go while the fetch is in flight?"
A2. WHY IT FEELS RIGHT. In plain JavaScript, promise states are handled in script (.then/.catch), so it is reasonable to assume the UI for those states must also be driven from script. Nothing about a fetch suggests the template can own its lifecycle.
A3. THE KEY. The `{#await}` block owns the promise's whole life in markup: one pending branch, then exactly one of {:then} or {:catch} — no booleans, no script glue.
A4. TYPE + SCENE. Fog (no mental model of where the three states live). Grounding scene: three named stations the promise passes through, each with its UI resident.

PHASE B — CAST AND RENDER
B1. CAST. (i) Waiting on the wire: the newsroom waits for the story — pending desk with the clock, then the story lands, or the correction desk handles the failure (social, National Times native). (ii) Train with two terminal platforms (machine). (iii) Hospital triage: waiting room, then admitted or referred (social). Pick (i): pending/then/catch map one-to-one onto desks a reader can picture, and "correction desk" makes the error branch feel intentional rather than exceptional.
B2. MAP. the fetch in flight = waiting on the wire (pending desk, spinner lives here); resolved value = the story landed ({:then}, ArticleView); rejection = the correction desk ({:catch}, error message). Fog element made physical: the three states get three named stations.
B3. NAME. "Waiting on the Wire" — checked against docs/metaphor-registry.md: not present; genre fog, which the registry shows well covered but not in pipeline form. Good.
B4. RENDER. Vertical flow: station 1 PENDING (yellow, clock chip) down to a fork with two doors: THEN "story landed" (blue) and CATCH "correction desk" (pink). Numbered 1, 2a, 2b so the one-time resolution is visible: the wire arrives once and takes exactly one door.
B5. CHECK. Imaginary reader: "where does my spinner go?" Station 1 answers it directly. Proceed.

TEXT. Q = the misplaced-spinner fog. Answer = verdict first (the block owns the promise's life). Why it works = why script glue feels necessary but is not.
