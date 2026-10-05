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
- [ ] **The Golden Rule of De-Prescription**: When fixing a problem or defect, did we first consider making subtle edits to existing rules to remove the prescriptions or conflicts creating the issue, rather than adding new rules?
- [ ] Did we avoid the reflexive AI attitude of proposing bans and authoritarian negative language ("never do this", "never do that")?
- [ ] Did we avoid the common fallacy of interpreting "do this" as "do not do the other"?
- [ ] **The Canonical Noun + Plain Human Verb Standard**: Did we ensure instructions require canonical industry terms (Declarative UI, Virtual DOM, Props) coupled with simple, active human verbs, while explicitly banning inflated corporate and academic rhetorical dressing ("authoritatively", "projection surface", "application truth")? #2026_09_26_12_group_1
- [ ] **The Calibrated Net & Nuanced Specialization Standard**: Did we consider the specific circumstances and context under which every rule is framed? Are we sensitive to whether a requirement is domain-specific rather than universal? Did we avoid casting a blanket maximum net that over-regulates unrelated contexts? Nuance matters: specialize with proper specialization to cover what needs to be covered: not more, not less. (For example, senior interviewers grade candidates on knowing exact industry vocabulary in specific conceptual cases like Slot Composition or Inversion of Control, where vague circumlocutions are unacceptable; but this must never become a blanket net forcing jargon into simple mechanical steps). #2026_09_27_01_group_1
- [ ] **The Short Operational Instruction Standard**: Are the instructions themselves written in proper pedagogy with multiple short, clear, and operational sentences? Did we eliminate monolithic, compound technical run-on sentences in prompts, keeping individual sentences direct (averaging 10-18 words) so models do not mimic dense, compound syntax in their output? #2026_09_27_01_group_1
- [ ] **The Five Principles of Principles**: Did our instruction authoring adhere to the five governing meta-rules: (1) Prune Before Banning (de-prescribe existing conflicts before inventing prohibitions), (2) Teach by Living Example (examples carry the doctrine; checkboxes only index the standard), (3) General Standards Over Micro-Regulations (insist on broad standards rather than word-counting micro-bans), (4) Name Things as the Reader Sees Them (code names first, who provides each thing, a human label only for a look-alike pair), (5) Name the Exact Platform Defect (state the exact runtime error rather than hand-waving filler slang)? #2026_10_04_03_group_1

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

## Teach by example #2026_09_20_04_group_1 revised by #2026_10_04_03_group_1
- [ ] Does every new rule or standard ship with living PROPER EXAMPLE and COUNTER-EXAMPLE pairs, drawn from real shipped text or production scenarios, so the examples actively carry the doctrine rather than serving as decorative afterthoughts?
- [ ] Do living examples let the shape follow the content (plain sentences as the normal shape, bullets only for a look-alike pair) rather than forcing identical mechanical templates across every scenario? #2026_10_04_11_group_1
- [ ] Does the counter-example vividly demonstrate the exact bureaucratic contortion, vague slang, or failure mode that the standard eliminates?
- [ ] Do principles name each thing as the reader sees it (the code name first, who provides it), reserving a human label such as *The Listener* for a look-alike pair like `currentTarget` and `target`, and naming the exact runtime defect prevented? #2026_10_04_11_group_1

## Proposing instruction changes ("iii" protocol) #2026_09_21_05_group_1
- [ ] When analyzing root causes or proposing instruction changes under the "iii" trigger, are proposed modifications presented directly broken down by section and as explicit diffs?
- [ ] Does the proposal clearly show what is being pruned or removed, what is being added or replaced, and the rule tag registry entry, so the user can inspect exact changes before approval?