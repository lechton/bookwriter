# Prompt standards

These are the guiding standards a prompt needs to adhere to. Use your judgment to apply them correctly and when appropriate.

## Clarity and scope
- [ ] Could a colleague with no context execute the prompt without doubt? (the no-context colleague check)
- [ ] Are the objective and the success criteria explicit?
- [ ] Is it written without ambiguity? Models tend to be overly literal and overapply what is written.
- [ ] Is it written without contradictions? Models tend to resolve contradictions in unexpected ways.
- [ ] Instructions in the right order, numbered when order matters?
- [ ] Does it use literal language instead of metaphorical?
- [ ] Is the language used consistently within the prompt and with the environment around it?

## Language
- [ ] Have we preferred setting standards instead of giving prescriptive instructions?
- [ ] Positive instructions ("do X") instead of negative ("don't do Y") where possible?
- [ ] Flexible instructions ("avoid", "prefer", "instructions"...) instead of authoritarian orders ("never", "always", "law"...) where appropriate?
- [ ] No unnecessary aggressive language ("CRITICAL/you MUST") that causes overtrigger?
- [ ] Do we use encouraging language instead of discouraging?
- [ ] Is the colleague encouraged to be bold, use his autonomy and judgment within the areas of his tasks?
- [ ] No artificial limits that would constrain the autonomy of our colleague and drown his own judgment?
- [ ] Do enumerations terminate in etc. if they are not complete?
- [ ] Do non-obvious instructions have motivation/why?

## Structure
- [ ] Components separated in XML (instruction, context, data, examples)?
- [ ] Consistent, descriptive tags?
- [ ] In long-context: long data at the top, query at the end?
- [ ] Dynamic variables in `{{double_brackets}}`?
- [ ] Usage of markdown checklists for steps and verification checklists, preferably written as questions?
- [ ] Tables written with the minimum required markdown characters (no alignment padding)?

## Output
- [ ] Explicit output contract (format, schema, length, no-preamble)?
- [ ] Says what to do in the output, not just what to avoid?
- [ ] Prompt style matches the desired output style?

## Coding/agentic (when applicable)
- [ ] Anti-overengineering, anti-hardcode, and anti-hallucination present?
- [ ] Autonomy/safety balance for irreversible actions?

If any critical item fails → fix it before delivering. The changelog should reflect the decisions.

## Rule tags #2026_09_20_04_group_1
- [ ] Does every new rule or section carry a batch tag at its end, in the form #YYYY_MM_DD_NN_group_M (creation date, a two-digit batch number incrementing per edit batch within the day, and a group number incrementing per working title within the batch), so one grep finds either the whole campaign (the batch part) or the whole feature across files (the group part)?
- [ ] Is the tag placed at the end of the section header for a new section, and at the end of the checkbox for a rule added inside an existing section?
- [ ] Do all edits belonging to the same working title, across however many skill files, share the same group number, so a coherent change that spans skills stays retrievable with one grep?
- [ ] Does a revision of a rule keep the tag of the group that created it, while a materially new rule gets a fresh tag, so the tag always names the origin?
- [ ] Are tags never reused, even when a batch is reverted?

## The registry #2026_09_20_04_group_1
- [ ] Does every group get one row in skills/RULE-TAGS.md (tag, working title, files touched, one-line intent), written with the edits, so the working title lives in the registry and the rule text stays uncluttered?
- [ ] Does a feature that continues in a later session get new tags in the new batch, with the registry line noting the continuation (continues #YYYY_MM_DD_NN_group_M), so multi-day features thread through the registry instead of mangling old tags?

## The brief folder #2026_09_20_04_group_1
- [ ] Does every batch of instruction edits ship a brief at brief/brief_YYYY_MM_DD_NN.md (NN matching the batch number), written with the edits and never afterwards from memory?
- [ ] Does the brief explain, per group: the rules added, the philosophy behind them (why the batch exists, which defect or lecture triggered it), the group tag, the files touched, and how to trace or revert the batch?
- [ ] Is the batch considered incomplete until its brief exists and its registry rows are filled?

## Teach by example #2026_09_20_04_group_1
- [ ] Does every new rule ship with at least one PROPER example, drawn verbatim from real shipped lecture text wherever it exists, so the example carries the doctrine and the checkbox carries the index?