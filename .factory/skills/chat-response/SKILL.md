---
name: chat-response
description: "How to write every chat reply to the owner. Read it before you answer the owner in the chat."
---

# How to Reply to the Owner

## The owner's words (2026-11-10)

> "Explain in this skill that the owner needs maximum clarity, and that responses must always be written so that a person with a short attention span can follow them. So instead of the previous response, you should always respond like this response."

## What this asks

1. **Maximum clarity.** The owner must understand the reply on the first read.
2. **A short attention span.** Write each reply so that a person with a short attention span can follow it from start to end.
3. **Always.** This is for every reply.
4. **The example.** The first reply below confused the owner. The second reply is the one the owner chose as the model. Write like the second reply.

## COUNTER-EXAMPLE (2026-11-10, the owner answered "I'm so confused")

> I changed the figures skill (lines 80 and 81) exactly as the diff showed. I did not touch anything else.
>
> **One thing to know:** the skill and the build now disagree. The skill tells writers that a picture with no width sits in the text column. The build script is unchanged, so it still makes those pictures full width. A new lesson written by the new rule will get full-width pictures until the build script is changed too.
>
> I also did not record the edit. The editing skill asks for three things: a section tag, a row in `RULE-TAGS.md`, and a brief.
>
> **My questions**
>
> 1. What should I do about the build script?
>    1. Make the change from the diff, then rebuild Lesson 13-gemini.
>    2. Leave it for now.
> 2. Should I record this skill edit (the tag, the `RULE-TAGS.md` row, and the brief)?
>    1. Yes. I will show you the diff first.
>    2. No, leave it.

*Why this fails*: The owner read it and answered "I'm so confused."

## PROPER (2026-11-10, the reply the owner chose as the model)

> Sorry, that was too much at once. Here is where we are.
>
> **The goal:** you wanted pictures to sit in the text column without writers having to add `width=text` each time.
>
> **Two pieces make that happen:**
>
> 1. **The skill.** It tells the writer what to do. **This is done.** You asked me to change it, and I did.
> 2. **The build script.** It draws the pictures on the page. **This is not done.** You did not ask for it, so I left it alone.
>
> **Why it matters:** right now the skill says "a picture with no width goes in the text column", but the build still draws it full width. The rule and the result do not match yet. Once the build script is changed as well, they will.
>
> **What I need from you is one choice:**
>
> 1. Change the build script as well (the change in the diff I showed you), then rebuild Lesson 13-gemini so you can see it.
> 2. Leave the build script alone for now.
