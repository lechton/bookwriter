---
name: audio-lecture
description: "Experimental (v0.3). Turn a written UK Tort Law chapter into a spoken audio lecture: a tutor talking to one student, each case named once in full and then by one short name, and a short revision after each block of cases."
---

# Tort Law Audio Lecture Skill

Status: experimental (v0.3). Every owner remark on tort audio lectures is logged in Section 4 and folded into the rules.

## 1. The Goal

A listener hears a warm law tutor talking to one student, not a textbook read aloud. The story of each case comes first, the question is asked aloud, and the rule comes out of the answer. The listener cannot look back at the page, so the text itself must carry memory: clear case names and regular short revisions.

## 1.1 What the Owner Has Already Decided #2026_11_05_01_group_1

Read these before writing. They come from the owner listening to the drafts, and they settle questions that should not be raised again.

- **Length is not the problem.** A long chapter is fine when every part holds the listener, who will stay as long as the text stays interesting. Split a long chapter into sections where that helps, and keep the content.
- **Repeating the short case name is wanted.** A listener hears a name and forgets it two sentences later, so the short name comes back again and again. When in doubt, repeat it more.
- **The real problem is that each section is boring.** The drafts are rich in information but told in a straight line, one fact after another.
- **The main cause: the background comes before the reason to care.** Open with what happened to a person and what is at stake. Bring in history, engineering, or legal background at the moment the listener needs it to follow the story.
- **Being tested: the best moments are wasted.** A twist, a shocking line, a close vote, or a winner nobody expected often passes in a single sentence. Build up to it instead.
- **One breath per sentence.** Each sentence carries one idea, or two ideas joined by and, but, because, or so, the way a person says it in one breath. Both extremes tire the ear. Too choppy, a run of fragments: "But it made no difference. Stop for a moment and decide. Who wins in Barnett?" Too long, clauses stacked inside each other: "A man walks into a hospital at eight o'clock in the morning, vomiting so badly that he can hardly stand, and the doctor on duty, who is upstairs, refuses to come down and sends word through the nurse that he should go home and call his own doctor." One breath each: "A man walks into a hospital at eight o'clock in the morning, vomiting so badly that he can hardly stand. The doctor on duty is upstairs, and he refuses to come down. Through the nurse, he sends a message telling the man to go home and call his own doctor." Keep a very short sentence for a turning point, such as "Five and a half hours later, the man is dead."
- **Plain B2 English, with every unusual word explained.** Write for a student who has never studied tort law and knows only the basics of law. Use everyday B2 vocabulary and plain phrasing, not idioms or unusual turns of phrase. When the facts of a case need an unusual word, such as a drip, a hayrick, or a fireplug, explain it in plain words the first time it appears. Do the same for every key term, legal term, court, and judicial role, such as negligence, duty of care, claimant, the High Court, a Lord Justice, or a jury, etc. Unusual and unexplained: "He admits the man to a bed and puts him on a drip." Plain and explained: "He keeps the man in hospital and puts him in a bed. He gives him fluids through a small tube in his arm, which is called a drip, to replace the water he has lost by vomiting."
- **Restate the question in the answer.** A listener does not remember a question asked a few sentences earlier, so every answer says the question again in full. Bare: "So the answer to the third question in Barnett is no." Restated: "So the answer to the third question in Barnett is no. No, the doctor's carelessness did not cause Barnett's death."
- **Announce a turn plainly.** When the story moves to a new problem, say so in plain words instead of a clever image. Too clever: "And that lesson leaves a door open." Plain: "But here a new problem appears."
- **The structure that works.** The owner approved the structure of [samples/sample-01-barnett-v4.md](samples/sample-01-barnett-v4.md): the twist told first as a puzzle, the reason to care before the background, the listener asked to judge before the court does, and the ending that returns to the opening puzzle.

## 2. The Rules

### 2.1 Speak, do not recite

Break long written sentences into spoken thoughts that grow one piece at a time. Explain a technical word inside the sentence, the way a tutor would say it, instead of in parentheses. Keep the stories, history, and reasoning of the source; change how they are said, not what is said. Use plain everyday English, commas and full stops for pauses, no em-dashes, and one line per paragraph.

PROPER:
```text
Underneath the mail coach sat a heavy iron rod called the axle. It joined the left wheel to the right wheel and carried the whole weight of the coach. And inside that axle there was a crack nobody could see.
```

COUNTER-EXAMPLE:
```text
The axle (the iron rod connecting the wheels, which bore the coach's weight) contained a latent defect.
```

### 2.2 Name a case once in full, then by one short name

The first time a case appears, say its full name and year once. After that, use one short name only, and repeat it often enough that the listener ties the story to that name. Do not switch between the full name, the short name, and phrases like "the claimant" or "that case".

PROPER:
```text
This came to court in Winterbottom v Wright, in 1842. Let's just call it Winterbottom. In Winterbottom, a coach driver was crippled when the axle snapped. But the court in Winterbottom shut the door on him, because he had no contract with the repairer.
```

COUNTER-EXAMPLE:
```text
In Winterbottom v Wright (1842) the claimant sued the defendant, but the Court of Exchequer in Winterbottom v Wright held that this decision turned on privity.
```

### 2.3 Revise after each block of cases

After a block of two or three related cases, and before the next block or section, add a short `> **Revision:**` blockquote. It replaces the written `> **Streetwise Exam Advice:**` boxes. It says what problem this part of the law solves, recalls each earlier case by short name and year with one plain sentence on what it decided, and ends with the open question that leads into the next case. Every sentence is short enough to follow by ear. Not every case gets a revision; only each block.

PROPER (the owner's model):
```markdown
> **Revision:** In this chapter we study how the law protects people from harm when there is no contract between them. This was not easy, because contract was king. We saw that in Winterbottom, from 1842. With no contract, there was no compensation. Things changed in two steps. First, in Heaven, from 1883, one judge said that foreseeable danger should create a duty. Then, in Donoghue, from 1932, a snail in a bottle broke the contract wall for good. But one question remains. What if the defendant did not hurt you directly, but let someone else do it? That is the question in Dorset Yacht, from 1970.
```

COUNTER-EXAMPLE:
```markdown
> **Revision:** Having established via Winterbottom v Wright (1842) that privity precluded recovery absent a contractual nexus, and having traced the doctrinal evolution through Heaven v Pender (1883) culminating in Donoghue v Stevenson (1932), we now turn to omissions in Home Office v Dorset Yacht Co Ltd (1970).
```

## 3. Keeping the Build Working

Keep the `#` title, the `##` and `###` headings, every image line, Section 8 (the Master Blueprint table), and Section 9 (the case cards) as they are. The build (`node src/build-lectures.mjs`) shows any blockquote that starts with a bold label as a card, so `> **Revision:**` needs no build change.

## 4. Owner Feedback Log

| # | Date | Owner's remark | What changed |
| --- | --- | --- | --- |
| 1 | 2026-11-04 | Create an experimental skillset to turn the tort chapter into an audio lecture, based on how VideoMax composes audio texts; log every remark here. | Created this skill. |
| 2 | 2026-11-04 | "Introduce the name of the case once e.g. Alex v Jones and then repeat in the text only one key name e.g. Alex. We need the repetition to appear for the reader to memorize the link of the case." | Rule 2.2. |
| 3 | 2026-11-04 | Before the next case or chapter, revise the previous cases and how they connect, in short easy sentences, once per block of a couple of cases, replacing the Streetwise advice. | Rule 2.3. |
| 4 | 2026-11-04 | "You made hyper-complex obsessive compulsive prompt that is unable to run ... nitpicking details e.g. on specific cases. It is all a mess." | Cut the skill and prompt down to general rules with one example pair each. Removed per-case name lists, backstory lists, and absolute paths. The prompt now works one section at a time and saves after each section, so a dropped connection loses little work. |
| 5 | 2026-11-05 | "The problem is something is missing. The overall length is NOT the problem." Each section is boring. "The background comes before the reason to care! this is key." On name repetition: "this is the good part ... the mind hears the name and forgets it two sentences in." Wasted best moments: "seems interesting". | Added Section 1.1 recording these as settled priorities. Rules in Section 2 unchanged for now. Wrote one case from scratch, [samples/sample-01-barnett.md](samples/sample-01-barnett.md), for the owner to review before the rules change. |
| 6 | 2026-11-05 | "I love the structure! But the constant stop in sentences is overwhelming. Example: But it made no difference. Stop for a moment and decide. Who wins in Barnett? this is too much short sentences." | Section 1.1 now records the approved structure and the flowing-sentence priority with the owner's example. Wrote [samples/sample-01-barnett-v2.md](samples/sample-01-barnett-v2.md). Rule 2.1 and spoken-demos.md still push toward very short sentences; to be fixed when Section 2 is revised. |
| 7 | 2026-11-05 | On the v2 opening sentence: "For the love of God, I asked you to not cut all sentences and you give me this monster of a sentence." | The flowing-sentence point in Section 1.1 became "One breath per sentence", with both extremes (the v1 fragments and the v2 long sentence) and the fixed version. Wrote [samples/sample-01-barnett-v3.md](samples/sample-01-barnett-v3.md). |
| 8 | 2026-11-05 | "Puts him on a drip??? Please we need a rule to avoid idiosyncratic sentences and remain into B2 vocabulary, all idiosyncratic words or sentences in the facts of the case need special explanation, similarly for all key terms, legal terms, courts of justice, justicial roles etc, imagine a student has not read anything in tort law in the past, knows only the basics in law." On "So the answer to the third question in Barnett is no": "you should continue reminding the question, the reader DOES NOT FREAKING REMEMBER PREVIOUS SENTENCES!" On "And that lesson leaves a door open": "this is cringy. You can say But here is a new issue emerging." | Added three points to Section 1.1: plain B2 English with every unusual word, legal term, court, and judicial role explained; restate the question in the answer; announce a turn plainly. Wrote [samples/sample-01-barnett-v4.md](samples/sample-01-barnett-v4.md). |
| 9 | 2026-11-05 | "cool, now please rewrite the whole lesson" | Chapter 1 Sections 1 to 7 rewritten in the style of [samples/sample-01-barnett-v4.md](samples/sample-01-barnett-v4.md), with Barnett pasted unchanged and Sections 8 and 9 kept as they were. The previous version is archived under stamp 2026-11-05-0052. A final pass varied the stock phrases that invite the listener to judge, because the same sentence repeated in every case brought back a fixed template. Rules in Section 2 still unchanged. |
