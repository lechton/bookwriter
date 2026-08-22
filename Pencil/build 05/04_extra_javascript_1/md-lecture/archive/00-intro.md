# 0 | Introduction: No Magic, Just JavaScript

When you write a modern web component and change a single variable, the right piece of the page updates by itself. It feels like magic. You never told the screen to refresh, yet it did, and only the part that depended on that variable changed. This entire chapter stands on the promise of that reactivity, and our goal is to take that magic completely apart. By the end of this hour, you will be able to build the reactivity engine of a modern framework entirely from scratch, using nothing but plain JavaScript.

You will have a companion for this journey. Please keep the code snippets for this chapter open in front of you. I will not read code aloud, because syntax is for the eye, but I will tell you exactly which code snippet we are referencing at each step so you are never lost.

Let us establish the world we will inhabit today. Picture the digital newsroom of the National Times. We have a publishing system that manages articles, reader sessions, and clap counters. Every problem we solve today will happen inside this one newsroom. We will watch, one small step at a time, as a plain read turns into a function call, a function call turns into a tracking engine, and that tracking engine turns into a system that knows exactly which corner of the page to redraw.

And it all begins with a single question, the question that drives this entire chapter. When you read a value, where does it come from, and what if reading it could quietly run some code of your own?
