---
name: workspace-slides
description: >-
    Create and manage Google Slides presentations. Use when creating
    presentations, adding or editing slides, inserting text or images,
    managing layouts, or exporting slides. Don't use for Calendar, Gmail,
    or Sheets.
---

# workspace-slides

> [!IMPORTANT]
>
> You **MUST** render the document after every mutation (create, edit, insert,
> format, delete content, etc.) with the `render_workspace_item` tool to
> visually confirm your changes. Do not skip this step — text-only output from
> write commands does not show formatting, layout, or visual issues.

> [!CAUTION]
>
> The `delete-slide` command permanently removes slides from a presentation.
> **Never** use destructive commands unless the user explicitly asks.

## CLI

The Slides tool is available via the Janus Workspace CLI bundled with the app:

All Slides commands are accessed via the `slides` subcommand:

```bash
JWS slides <command> [flags]
```

## Recipes

**Read and inspect:**

```bash
JWS slides read PRESENTATION_ID
JWS slides read-all PRESENTATION_ID         # all slides as text
JWS slides info PRESENTATION_ID
JWS slides list-slides PRESENTATION_ID
JWS slides list-elements PRESENTATION_ID SLIDE_ID
JWS slides get-page PRESENTATION_ID SLIDE_ID
JWS slides get-notes PRESENTATION_ID SLIDE_ID
JWS slides extract-images PRESENTATION_ID
```

**Create and organize:**

```bash
JWS slides create --title "My Presentation"
JWS slides copy PRESENTATION_ID "Copy Title"
JWS slides add-slide PRESENTATION_ID
JWS slides duplicate PRESENTATION_ID SLIDE_ID
JWS slides delete-slide PRESENTATION_ID SLIDE_ID
JWS slides reorder-slide PRESENTATION_ID SLIDE_ID --position 0
```

**Add content:**

```bash
JWS slides add-textbox PRESENTATION_ID --slide SLIDE_ID --text "Hello" --x 100 --y 100 --width 300 --height 50
JWS slides add-text PRESENTATION_ID "More text" --textbox ELEMENT_ID
JWS slides update-text PRESENTATION_ID --element ELEMENT_ID --text "New text"
JWS slides add-image PRESENTATION_ID --slide SLIDE_ID --url "https://..." --x 100 --y 200 --width 200 --height 150
JWS slides insert-image-from-file PRESENTATION_ID --slide SLIDE_ID --file /path/to/image.png
JWS slides add-table PRESENTATION_ID --slide SLIDE_ID --rows 3 --cols 4
JWS slides set-table-cell PRESENTATION_ID --table TABLE_ID --row 0 --col 0 --text "Header"
JWS slides delete-element PRESENTATION_ID ELEMENT_ID
JWS slides move-element PRESENTATION_ID ELEMENT_ID --x 200 --y 150
JWS slides resize-element PRESENTATION_ID ELEMENT_ID --width 400 --height 300
JWS slides update-shape PRESENTATION_ID --element ELEMENT_ID --text "New text" --background-color "#FF0000" --bold
```

**Styling and export:**

```bash
JWS slides set-background PRESENTATION_ID --slide SLIDE_ID --color "#4285F4"
JWS slides set-notes PRESENTATION_ID --slide SLIDE_ID --text "Speaker notes here"
JWS slides export PRESENTATION_ID /tmp/pres.pdf --format pdf
JWS slides export-thumbnail PRESENTATION_ID /tmp/slide.png
JWS slides batch PRESENTATION_ID requests.json
```

## Sharing

Google Slides presentations are Google Drive files. To share a presentation or
manage its permissions, use `JWS drive share` and `JWS drive permissions` from
the **workspace-drive** skill:

```bash
JWS drive share PRESENTATION_ID --email user@google.com --role writer
JWS drive permissions PRESENTATION_ID
```

## Commands

Command                  | Description
------------------------ | --------------------------------
`read`                   | Read slide content
`read-all`               | Read all slides as text
`info`                   | Presentation info
`create`                 | Create presentation
`copy`                   | Copy presentation
`list-slides`            | List slides
`add-slide`              | Add slide
`duplicate`              | Duplicate slide
`delete-slide`           | Delete slide
`reorder-slide`          | Reorder slide
`add-textbox`            | Add text box
`add-text`               | Add text to element
`update-text`            | Update text
`delete-element`         | Delete element
`add-image`              | Add image by URL
`insert-image-from-file` | Insert local image
`add-table`              | Add table
`set-table-cell`         | Set table cell text
`set-background`         | Set background color
`set-notes`              | Set speaker notes
`get-notes`              | Get speaker notes
`move-element`           | Move element
`resize-element`         | Resize element
`update-shape`           | Update shape properties and text
`export`                 | Export to PDF/PPTX
`export-thumbnail`       | Export slide as image
`share`                  | Share presentation
`list-elements`          | List elements on slide
`get-page`               | Get page details
`extract-images`         | Extract all images
`batch`                  | Execute raw batchUpdate

## Tips

-   `set-table-cell` and `set-notes` safely handle empty content (no need to
    pre-populate)
-   Use `list-elements PRES_ID SLIDE_INDEX` to discover element IDs for tables,
    textboxes, etc. The SLIDE_INDEX is 0-based (0=first slide, 1=second, etc.)
-   Product icons:
    `https://www.gstatic.com/images/branding/product/2x/hh_{product}_96dp.png`
    (e.g., `hh_docs`, `hh_sheets`, `hh_slides`, `hh_drive`, `hh_gmail`,
    `hh_chat`)
-   The `batch` command reads a JSON file of operations for efficient bulk
    updates. Use `--file -` to pipe from stdin.
-   **Recommended workflow:** Use `export-thumbnail PRES_ID output.png --slide
    SLIDE_ID` to export a slide as an image, review it visually, then iterate.
    This is the best way to verify layout, colors, and readability before
    sharing. Note: `--slide` takes a slide **object ID** (e.g. `p`,
    `slide_xxx`), not a 0-based index. Use `batch --json` or `list-slides
    --json` to get slide IDs.

### Placeholder IDs (Single-Batch Workflows)

Use `"id"` on `add-slide` and `add-table` to create placeholder IDs that
subsequent ops can reference **within the same batch**:

```json
[
  {"op":"add-slide","layout":"BLANK","id":"SLIDE_1"},
  {"op":"set-background","slide":"SLIDE_1","color":"#1E2761"},
  {"op":"add-table","slide":"SLIDE_1","rows":3,"cols":3,"id":"TABLE_1"},
  {"op":"set-table-cell","table":"TABLE_1","row":0,"col":0,"text":"Header"}
]
```

This eliminates the need for multi-pass workflows. The CLI resolves placeholders
to API-generated IDs at runtime.

`set-notes` for newly-created slides is automatically deferred to a second API
call (the CLI handles this transparently).

### Batch `--json` Response

Use `batch PRES_ID -f file.json --json` to get created IDs. The `resolved_ids`
map is needed for any follow-up commands (e.g. `export-thumbnail`,
`insert-image-from-file`) that target created slides:

```json
{"operations":12,"api_requests":30,"created_slides":["slide_xxx"],"created_tables":["table_xxx"],"resolved_ids":{"SLIDE_1":"slide_xxx","TABLE_1":"table_xxx"}}
```

### Card Design Tips (from Testing)

-   **Use header + body combo** — two textboxes (bold 20pt header + 13-14pt
    body) instead of one tall card. This avoids empty space and gives visual
    hierarchy.
-   **Accent dividers**: thin rectangles (3-4px height) between card sections
    add polish.
-   **Bottom taglines**: centered muted text below cards fills vertical
    whitespace.
-   **Stat call-outs**: rounded rectangles with big numbers (36pt+) make
    overview slides more visual.

## Batch Operations Reference

The batch command supports **21 operations**:

| Op                 | Key Fields                 | Description                |
| ------------------ | -------------------------- | -------------------------- |
| `set-background`   | `slide`, `color`           | Slide background color     |
| `add-textbox`      | `slide`, `text`, `x`, `y`, | Create textbox with text   |
:                    : `width`, `height`,         : and styling                :
:                    : `font_size`, `bold`,       :                            :
:                    : `italic`, `underline`,     :                            :
:                    : `color`,                   :                            :
:                    : `background_color`,        :                            :
:                    : `font_family`,             :                            :
:                    : `alignment`,               :                            :
:                    : `line_spacing`, `link`     :                            :
| `add-image`        | `slide`, `url`, `x`, `y`,  | Insert image from URL      |
:                    : `width`, `height`          :                            :
| `add-slide`        | `layout`, `id`             | Add slide (default:        |
:                    :                            : BLANK). `id` creates a     :
:                    :                            : placeholder for use by     :
:                    :                            : later ops                  :
| `add-table`        | `slide`, `rows`, `cols`,   | Create table. `id` creates |
:                    : `id`                       : a placeholder for          :
:                    :                            : `set-table-cell`           :
| `set-table-cell`   | `table`, `row`, `col`,     | Set + style table cell     |
:                    : `text`, `color`, `bold`,   :                            :
:                    : `font_size`,               :                            :
:                    : `font_family`,             :                            :
:                    : `underline`,               :                            :
:                    : `background_color`         :                            :
| `style-text`       | `element`, `color`,        | Restyle existing text      |
:                    : `bold`, `italic`,          :                            :
:                    : `underline`, `font_size`,  :                            :
:                    : `font_family`, `link`,     :                            :
:                    : `start`, `end`             :                            :
| `style-table-cell` | `table`, `row`, `col`,     | Restyle table cell         |
:                    : `color`, `bold`,           :                            :
:                    : `font_size`,               :                            :
:                    : `font_family`, `underline` :                            :
| `set-notes`        | `slide`, `text`            | Set speaker notes          |
| `delete-element`   | `element`                  | Delete element by ID       |
| `move-element`     | `element`, `x`, `y`        | Move element               |
| `resize-element`   | `element`, `width`,        | Resize element             |
:                    : `height`, `x`, `y`         :                            :
| `update-text`      | `element`, `text`          | Replace text in element    |
| `update-alt-text`  | `element`, `description`,  | Replace alt text in        |
:                    : `title`                    : element                    :
| `add-shape`        | `slide`, `shape_type`,     | Create shape (RECTANGLE,   |
:                    : `x`, `y`, `width`,         : ELLIPSE, etc.)             :
:                    : `height`,                  :                            :
:                    : `background_color`         :                            :
| `style-shape`      | `element`,                 | Change shape fill color    |
:                    : `background_color`         :                            :
| `duplicate-slide`  | `slide`, `id`, `elements`  | Duplicate a slide          |
| `reorder-slide`    | `slide`, `position`        | Move slide to position     |
| `replace-all-text` | `contains`, `replace_text` | Find-and-replace across    |
:                    :                            : deck                       :
| `create-bullets`   | `element`                  | Add bullet points          |
| `update-shape`     | `element`, `text`,         | Update shape properties    |
:                    : `background_color`,        : and text                   :
:                    : `color`, `font_size`,      :                            :
:                    : `bold`                     :                            :

### Key Features

-   **`background_color`**: Sets shape fill on textboxes and shapes (card
    layouts, visual accents)
-   **`font_family`**: Set font (e.g., "Roboto", "Montserrat", "Oswald")
-   **`link`**: Add hyperlinks to text
-   **`line_spacing`**: Set line height (percentage, e.g., 150 = 1.5× spacing)
-   **`start`/`end`**: Style a range of text (not just all text) in `style-text`

## Slide Creation Recipe

1.  **Outline**: Decide N slides, types (title, content, stat, table, closing),
    and palette
2.  **Palette**: Pick from `references/styling.md` (Midnight Executive, Ocean
    Breeze, Cherry Bold, etc.)
3.  **Generate batch JSON**: All ops in one file, using the sandwich pattern
    (dark → light → dark)
4.  **Execute**: `create` then `batch PRES_ID -f batch.json`
5.  **Review**: `export-thumbnail` each slide, review PNG
6.  **Fix**: Second batch or individual commands
7.  **Notes**: Include `set-notes` in batch for every slide
8.  **Share**: Use `JWS drive share PRES_ID --email ...`

### Complete Batch JSON Example

This creates a polished 5-slide deck. Save as `batch.json` and run: `JWS slides
create --title "Demo"` then `JWS slides batch PRES_ID -f batch.json`

```json
[
  {"op":"set-background","slide":"p","color":"#1E2761"},
  {"op":"add-textbox","slide":"p","text":"Project Alpha","x":60,"y":120,"width":600,"height":80,"font_size":48,"bold":true,"color":"#FFFFFF","font_family":"Roboto","alignment":"center"},
  {"op":"add-textbox","slide":"p","text":"Q4 2024 Review & Roadmap","x":60,"y":210,"width":600,"height":30,"font_size":20,"color":"#CADCFC","font_family":"Roboto","alignment":"center"},
  {"op":"add-shape","slide":"p","shape_type":"RECTANGLE","x":260,"y":340,"width":200,"height":4,"background_color":"#CADCFC"},
  {"op":"set-notes","slide":"p","text":"Welcome slide. Introduce the team and agenda."},

  {"op":"add-slide","layout":"BLANK","id":"SLIDE_1"},
  {"op":"set-background","slide":"SLIDE_1","color":"#F2F2F2"},
  {"op":"add-textbox","slide":"SLIDE_1","text":"Key Results","x":30,"y":15,"width":660,"height":45,"font_size":36,"bold":true,"color":"#1E2761","font_family":"Roboto"},
  {"op":"add-textbox","slide":"SLIDE_1","text":"• 50% faster releases\n• 3x API throughput\n• 99.9% uptime SLA","x":30,"y":75,"width":310,"height":260,"font_size":14,"color":"#333333","font_family":"Roboto","line_spacing":160},
  {"op":"set-notes","slide":"SLIDE_1","text":"Key results from Q4."},

  {"op":"add-slide","layout":"BLANK","id":"SLIDE_2"},
  {"op":"set-background","slide":"SLIDE_2","color":"#1E2761"},
  {"op":"add-textbox","slide":"SLIDE_2","text":"Architecture","x":30,"y":15,"width":660,"height":45,"font_size":36,"bold":true,"color":"#FFFFFF","font_family":"Roboto","alignment":"center"},
  {"op":"add-textbox","slide":"SLIDE_2","text":"Frontend","x":30,"y":80,"width":200,"height":35,"font_size":20,"bold":true,"color":"#FFFFFF","font_family":"Roboto","background_color":"#2D3A8C","alignment":"center"},
  {"op":"add-textbox","slide":"SLIDE_2","text":"React + TypeScript","x":30,"y":120,"width":200,"height":80,"font_size":13,"color":"#CADCFC","font_family":"Roboto","background_color":"#232E73"},
  {"op":"add-textbox","slide":"SLIDE_2","text":"API Layer","x":250,"y":80,"width":200,"height":35,"font_size":20,"bold":true,"color":"#FFFFFF","font_family":"Roboto","background_color":"#2D3A8C","alignment":"center"},
  {"op":"add-textbox","slide":"SLIDE_2","text":"Go + gRPC","x":250,"y":120,"width":200,"height":80,"font_size":13,"color":"#CADCFC","font_family":"Roboto","background_color":"#232E73"},
  {"op":"add-textbox","slide":"SLIDE_2","text":"Storage","x":470,"y":80,"width":200,"height":35,"font_size":20,"bold":true,"color":"#FFFFFF","font_family":"Roboto","background_color":"#2D3A8C","alignment":"center"},
  {"op":"add-textbox","slide":"SLIDE_2","text":"Spanner + Bigtable","x":470,"y":120,"width":200,"height":80,"font_size":13,"color":"#CADCFC","font_family":"Roboto","background_color":"#232E73"},

  {"op":"add-slide","layout":"BLANK","id":"SLIDE_3"},
  {"op":"set-background","slide":"SLIDE_3","color":"#065A82"},
  {"op":"add-textbox","slide":"SLIDE_3","text":"87%","x":60,"y":80,"width":600,"height":120,"font_size":72,"bold":true,"color":"#FFFFFF","font_family":"Roboto","alignment":"center"},
  {"op":"add-textbox","slide":"SLIDE_3","text":"of agent tasks complete in under 30 seconds","x":60,"y":210,"width":600,"height":40,"font_size":18,"color":"#B8D8E8","font_family":"Roboto","alignment":"center"},

  {"op":"add-slide","layout":"BLANK","id":"SLIDE_4"},
  {"op":"set-background","slide":"SLIDE_4","color":"#990011"},
  {"op":"add-textbox","slide":"SLIDE_4","text":"Thank You","x":60,"y":120,"width":600,"height":80,"font_size":48,"bold":true,"color":"#FFFFFF","font_family":"Montserrat","alignment":"center"},
  {"op":"add-textbox","slide":"SLIDE_4","text":"Questions? → alpha@google.com","x":60,"y":225,"width":600,"height":30,"font_size":16,"color":"#FCF6F5","font_family":"Montserrat","alignment":"center"}
]
```

> **Note:** `SLIDE_1`..`SLIDE_4` are resolved by the CLI at runtime via the
> `"id"` field on `add-slide`. The first slide (`p`) is created by `create` and
> always has ID `p`. Use `batch --json` to see the resolved IDs.

## Global Flags

-   `--json` — output as JSON (works with all read commands)

## Reporting Issues

Report bugs or improvements for this skill at
[Agent Skill: gslides](http://b/hotlists/8077113). See the `skill_issue` skill
for instructions on filing and triaging skill bugs.
