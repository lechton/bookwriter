# 06 · The Observer Pattern — Figure Content

> The exact content of each block in the figure (code, flow, summary), transcribed verbatim. The *what it says*, not the *how it looks*. Twin of `images/04_extra_javascript_1/06-observer-pattern.png`.

- **Concept (shot #6):** The observer pattern — track on read, trigger on write.
- **Source:** digest §5, *The Observer Pattern: Track On Read, Trigger On Write*; the masthead and comment byline reading the logged-in reader's name.
- **Why it earns a card:** the two motions (record, then notify) happen in sequence over time, coordinated by a hidden marker — a genuine runtime flow, not a definition.

---

## Block 1 — Code · "THE OBSERVER PATTERN"

```js
let running = null;                // who is computing now

function get(signal) {
  if (running) signal.deps.add(running);  // TRACK
  return signal.value;
}
function set(signal, next) {
  signal.value = next;
  signal.deps.forEach((run) => run());      // TRIGGER
}
```

- **Highlighted lines:** the `TRACK` line (`signal.deps.add(running)`) and the `TRIGGER` line (`signal.deps.forEach(...)`) — the two halves of the machine.
- **Boxed token:** `running` — the hidden marker holding whichever computation is executing right now.

## Block 2 — Execution Flow · "TRACK ON READ, TRIGGER ON WRITE"

- **Stage 1 — Mark who's running.** `running = drawMasthead`. Note: "Before running the masthead, the framework records whose turn it is."
- **Stage 2 — Track on read** *(intercepted GET).* `reader.name` (read by masthead) → `name.deps` `{ masthead }`. Note: "The intercepted get adds the current runner to the name's list."
- **Stage 3 — A write happens.** `reader.name = ""  // logout`. Note: "The reader logs out — the intercepted set fires."
- **Stage 4 — Trigger on write** *(intercepted SET).* `name.deps` `{ masthead }` → `rerun` `masthead()`. Note: "set walks the list and reruns each dependent — the greeting clears."

## Block 3 — Summary

The observer pattern: **a value keeps a list of everyone who depends on it and notifies them when it changes**. A hidden marker names the currently-running computation, so every intercepted read **records it (track)** and every intercepted write **reruns the recorded ones (trigger)** — the `subscribe` and `notify` you never had to write.

*(Bold marks the phrases highlighted in the figure; `code` marks the inline mono terms.)*
