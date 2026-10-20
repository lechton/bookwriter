# Handouts

Each lesson has one inbox here, `{NN}.json`, named after the lesson that receives the messages. A map, pre-lecture, or lecture author sends a message to a later or an earlier lesson when the principle map's ledger cannot carry it: a promise the lecture makes, a name or example to reuse, a caution, a correction, or a move of ownership. The receiving author closes each message. The rules live in `skills/v6.5/map-principles/SKILL.md` Section 11B, `pre-lecture` Section 01B, and `lecture-structure` Section 06.

Never edit these files by hand. Use the command, which fills the topic tags from the live bank, numbers each message, and refuses a message that breaks the format:

- `node src/handout.mjs 24` shows the inbox of lesson 24, the ledger rows of other maps that name Q24 as owner, and the later maps that recall Q24.
- `node src/handout.mjs add --from 11 --to 24 --kind promise --stage lecture --source "02-01-md-revised-1/11.md, Keys" --msg "..." --affects 13,15` sends a message.
- `node src/handout.mjs close 11-24-01 --status done --resolution "..."` closes one, with `done` or `declined` and a reason.
- `node src/handout.mjs check` validates every file.

## Fields

| field | meaning |
|---|---|
| `id` | `{from}-{to}-{sequence}`, such as `11-24-01` |
| `from`, `to` | `{ "q": 24, "tag": "component_identity" }`, checked against the live bank, so a renumbered topic shows up as a mismatch |
| `kind` | `promise`, `reuse`, `caution`, `correction`, or `move` |
| `stage` | `map` when the map author must act, `lecture` when the pre-lecture and lecture authors must act; a `move` is always `map` |
| `source` | the file and the handle or section that sent it |
| `msg` | the message, in plain sentences |
| `affects` | the other lessons that depend on the change, such as later lessons that recall it |
| `status` | `open`, `done`, or `declined` |
| `resolution` | where the message was delivered, or why it was declined |

`node src/diagnose-map.mjs {NN}` fails while a `map` message to lesson {NN} is open.
