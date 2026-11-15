---
name: chat-format
description: "How to format every chat reply to the owner in bookwriter and in any work on a bookwriter project, from any repo. Read it before answering, together with chat-response. Do not copy this format into lectures or other files."
---

# Chat Reply Format (Bookwriter)

The owner asked for this on 2026-11-15: reply with the alert-panel format. Keep every reply short, clear, and to the point, and put the key statements inside formatted alert elements that render as colored panels in the chat.

This skill is about the shape of the reply. The content rules (maximum clarity, short attention span) live in `chat-response/SKILL.md`; read both.

## The elements

Write the alerts as Markdown alert blocks directly in the chat message. The chat renders them as colored panels.

- `> [!TIP]` the good news or the main result, usually the first line of the reply
- `> [!IMPORTANT]` a key change or decision the owner must not miss
- `> [!NOTE]` timing, side facts, what happens next
- `> [!WARNING]` a problem that happened or something that went wrong
- `> [!CAUTION]` a risk ahead, something that could go wrong

Shape of a reply: open with one alert that carries the main outcome in bold, then a few short plain paragraphs or a short list with bold labels, then an alert with what happens next, and plain numbered options when the owner must choose. Only the owner-facing chat gets this format, never the book files.

## Example 1

> [!TIP]
> **Lesson 47 is done and pushed.** Both versions exist, `47.md` (Opus) and `47-gemini.md` (Gemini), and they are on GitHub.

> [!NOTE]
> Your file `first-sentences-02.md` has changes that are not committed. The run reads the file as it is now, but it does not commit it.

## Example 2

> [!WARNING]
> **Yes, it stopped after Lesson 48. That was a bug in my script, and I have fixed it. The run has started again from Lesson 49.**

**Lesson 48 is complete.** `48.md` (Opus) and `48-gemini.md` (Gemini) are both committed and on GitHub.

**Why it stopped:** the Gemini step wrote its file, committed it, and pushed it, but then reported itself as "stopped". My script treated that report as an error and quit.

> [!NOTE]
> **Lessons 49 to 70 are now running, and should take about 5.5 hours.** I will tell you when the run finishes or stops.
