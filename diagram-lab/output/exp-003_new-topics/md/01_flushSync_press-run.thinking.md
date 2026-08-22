# Thinking — flushSync (exp-003)

PHASE A — DIAGNOSE THE LEARNER
A1. STUMBLE. Candidates: (a) "after `claps = 5`, the next line that reads the DOM sees 5" — the most common, and the source of real bugs in tests and measurements; (b) "flushSync is a performance tool" — vague, rare; (c) "$effect runs before the DOM updates" — a neighbor confusion, belongs to its own card. Pick (a). Silent expectation: "assignment updates the page synchronously."
A2. WHY IT FEELS RIGHT. JavaScript statements run in order; every learner has watched a `let` change take effect on the very next line. The DOM is just another place the value lives — why would it lag?
A3. THE KEY. Svelte does not patch the DOM per assignment; it queues the change and applies queued updates together after your code yields. Reading the DOM immediately reads the previous frame. `flushSync()` forces the queue to apply before the next line runs.
A4. TYPE + SCENE. Violation (expected: write then read fresh; actual: write queued, read stale). Stage the queue visibly: the write sitting unprinted while the read walks away with old news.

PHASE B — CAST AND RENDER
B1. CAST. (i) Printing press schedule: writes queue at the press room, the paper prints on a fixed run, flushSync is a special edition printed on the spot (machine, National Times native). (ii) Airport departures board: updates posted in batches (social). (iii) Elevator batching: rides wait for the scheduled trip vs an express ride (machine). Pick (i): the world already owns it, "read old news" is literal, and the special-edition move is memorable.
B2. MAP. state write = a story filed to the press room (`claps = 5`); batching = the press queue holding stories until the scheduled run; DOM = the printed paper (still shows 4 while 5 sits in the queue); flushSync = SPECIAL EDITION pill, prints immediately. The wrong expectation appears as the stale headline "shows 4 for now".
B3. NAME. "The Press Run" — checked against docs/metaphor-registry.md: not present; genre violation. Good.
B4. RENDER. Two lanes, identical write box on the left: lane 1 routes through a dashed PRESS QUEUE with a "prints on schedule" pill into a grayed DOM box "shows 4 for now"; lane 2 jumps straight through a SPECIAL EDITION pill into a blue DOM box "shows 5 at once". Caption: same write, different timing.
B5. CHECK. Imaginary reader: "why does my read see the old value?" Lane 1 shows the write stranded in the queue at read time. Answers it. Proceed.

TEXT. Q = the confused reader's stale read. Answer = verdict first (updates are batched). Why it works = why batching exists and why the expectation feels right.
