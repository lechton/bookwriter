## 0 — The Render Vocabulary: scene parts, not boxes
@tags Vocabulary, Index, Design System

**Use.** This gallery is the drawable half of the design workflow: after CAST names the metaphor, assemble the scene from these components instead of inventing CSS. Every component is print-safe, deterministic in Chrome and Prince, and 130mm-safe. The gallery screenshots in `html/_shots/` are the visual menu — look before you build.

**The parts.**

- `.env-dots` `.env-hatch` `.env-blueprint` — environments: the background joins the metaphor
- `.console` — a developer terminal, print-safe light version
- `.paper` — a printed page; `.paper.old` is yesterday's edition
- `.bldg` — an instance/building; pair with `.ghost` when demolished
- `.tray` — a queue or inbox holding `.tray-item`s
- `.stamp` — a rotated verdict tag (`.red` `.grn` `.blu`)
- `.badge` — a numbered circle for sequenced steps
- `.watermark` — a giant faded glyph behind content
- `.ghost` `.strike` — dead, destroyed, absent things
- `.wire` `.wire-tag` — connectors with inline labels; `.head` `.down` `.dashed`
- `.zone` `.zone-label` — a named dashed region
- `.lane` `.lane-label` — comparison rows with color-coded semantics

> **The rule.** Compose from this vocabulary first; reach for custom inline CSS only for gaps, and any gap used twice gets promoted into `metaphors.css`.
