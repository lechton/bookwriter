# Notes: UI Previews Must Show the Thing Itself

Working notes behind skills `v10.2` (written into `skills/v10.2/v1/code-and-figures/SKILL.md` Section 2.3, `opening-essence/SKILL.md` Move 1, `lecture-structure/SKILL.md` Section 5, and check B3 in `verification/SKILL.md`; see brief_2026_11_06_01). Recorded after the Lecture 20 opening, where the first browser preview drew three input boxes as six lines of plain text.

## The standard

A browser preview is evidence. The reader must recognize every control on sight, exactly as it looks in a real browser, with no prose needed to say what it is. If the preview needs the caption to explain that a line of text is really an input, the preview has failed.

## What each element must look like

- **Text input**: a bordered white box with its label above it. An empty input is still an empty box, never a missing line. Use `field: Label | value | good|bad` inside `form:`.
- **Textarea**: a taller bordered box. Use `textarea:`.
- **Dropdown**: a bordered box with a down arrow at the right. Use `select: Label | Shown option`. Never fake it with a typed `▾` inside a text field.
- **Checkbox**: a real square, filled with a tick when on. Use `check: Label | on|off`. Never fake it with `☑` or `☐` characters inside a text line.
- **Button**: a raised button. Use `button:` (or `submit:`) inside `form:`, or `row:` for a standalone button under the form.
- **Plain page text** (a thank-you line, a counter): plain text, never a box, so it cannot be mistaken for an input. Use `line:`.
- **Console**: a separate DevTools-style panel under the page with a `Console` tab. Errors appear as red rows with a cross. Logs appear as plain rows with the source file and line on the right (`log: Sending message from Anna Lee | ContactForm.jsx:19`). An empty console reads "No errors or warnings".
- **Good and bad marks**: a green border with a tick, or a red border with a cross, on the exact control that is right or wrong. The mark sits on the control, not on a separate line.

## What a preview must never do

- Show anything the real page would not show. Values that live only in state (for example "name in state: Johnny") belong in the prose or a `tree` figure, not inside the browser frame.
- Imply a control through text alone (a label followed by a value on the next line).
- Omit a console message that React really prints for the code shown. In Lecture 20, Box B (`value` with no `onChange`) prints the read-only warning at load time, so the first preview shows it.

## PROPER vs. COUNTER-EXAMPLE (Lecture 20 opening)

**PROPER**: the browser opens the chapter with three bordered input boxes labelled Box A, Box B and Box C, each holding John, and a Console panel showing the read-only error. The code follows. After typing, Box A and Box C carry a green tick with Johnny, and Box B carries a red cross with John.

**COUNTER-EXAMPLE**: the browser shows "Box A", "John", "Box B", "John", "Box C", "John" as six plain lines and a thin monospace strip at the bottom. Nothing tells the reader that any of it is an input or a console.

## Renderer support added for this

`src/build-river.mjs` `pageMock` now renders `select:`, `check:` and `button:` form rows, a Console panel with a tab and log source, and the three themes in `src/river-*-theme.css` style inputs, textareas, dropdowns, checkboxes, buttons and plain page text. Lectures other than 20 pick this up on their next rebuild.

## Browser width and position (decided per browser)

Each browser preview chooses its width from its content, with the fence attribute `width=text` or the default full width.

- **`width=text`**: the browser and its caption sit in the running-text column, at the same left edge and width as the paragraphs, so the preview reads as part of the sentence that introduces it. Use it for small single-column previews: one form, a few stacked controls, a single card, a short list, a console with short messages.
- **Full width (default)**: use it when the content is wide or the point is comparison or layout: `::: row` / `::: col` side-by-side browsers, card grids, shop and mail layouts with a sidebar, long console output that would wrap into many lines.
- **One width per sequence**: every state of the same page (page opens, after typing, after Clear) keeps the same width, so the controls stay in place and the reader compares only what changed.

**PROPER** (Lecture 20 opening): the three John browsers sit in the text column under "When the page opens, all three show the name John", and all three states keep that width.

**COUNTER-EXAMPLE**: the same three boxes in a full-width frame, two thirds empty, starting further left than the sentence that introduces them; or two side-by-side browsers squeezed into the text column.

Renderer: `width=text` works on `page`, `shop`, `mail`, `dom`, `console`, `devconsole`, and `overlay` fences; an unknown value stops the build. On screens under 720px it falls back to full width, as the text does.
## Related rule to add (post-chapter edits)

In edits after a chapter is finished, edit only the final file `01-02-md-LECTURES/v1/{NN}.md` and re-render with `node src/build-river.mjs NN`. Never edit the HTML directly, and never edit the pre-lecture or draft files. When a preview cannot be drawn clearly, fix the renderer (`src/`), not the generated HTML.
