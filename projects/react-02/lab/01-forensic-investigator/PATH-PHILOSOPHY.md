# Path 01: The Forensic Investigator (Crime Scene & Iceberg Method)

## Philosophy
Open at the scene of an engineering crime: a production bug or a failed interview white-board problem that looks deceptively simple, but exposes a deep systemic flaw in naive thinking.

## The 5-Stage Forensic Invariants
1. **The Production Crime Scene (The Hook):** A real-world production post-mortem from the newsroom of *The National Times*. A visible, high-stakes failure in the UI under realistic stress that cost reader trust or revenue.
2. **The Deceptive Surface:** Show the innocent, naive code that caused it. Every junior understands it; every senior recognizes they have written it.
3. **The Crack in the Iceberg:** Show why the intuitive, naive patch (patching the symptom rather than addressing the systemic root cause) triggers cascading edge-case failures, synchronization bugs, or state corruption.
4. **The Architectural Invariant:** Introduce the core declarative principle, mathematical contract (such as $UI = f(State)$, pure render idempotency, or unidirectional flow), or architectural boundary that eliminates the failure mode permanently.
5. **The Engine Dissection:** Walk through React's internal mechanics (Fiber reconciliation diffing, work loop scheduling, compiler transforms, commit phase mutations, or DOM synchronization) that guarantee the invariant.
