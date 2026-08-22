---
name: workspace-docs
description: >-
    Read, create, edit, and manage Google Docs using a Go CLI. Use when
    reading document content, creating docs, inserting/appending text,
    find-and-replace, formatting, adding comments, importing markdown,
    synchronizing local markdown with remote docs (3-way merge),
    extracting tables/links, managing revisions, or exporting to PDF.
    Also use when the user shares a docs.google.com URL.
    Don't use for Google Sheets, Slides, or Drive file management.
---

<!-- disableFinding(SKILLS_BODY_LENGTH) -->

# workspace-docs

> [!CAUTION]
>
> The `delete` command permanently removes content from a document and cannot be
> undone. **Never** use destructive commands unless the user explicitly asks.
>
> The `delete-doc` command permanently deletes the entire document. **You MUST
> NEVER use the `delete-doc` command under any circumstances unless the user
> explicitly and unambiguously instructs you to delete the document.**

## Quick Start

The Docs tool is available via the Janus Workspace CLI bundled with the app:

All Docs commands are accessed via the `docs` subcommand:

```bash
JWS docs <command> [flags]
```

> [!IMPORTANT]
>
> **For generating complete, styled documents, always use the `batch` command
> with a JSON file** — not `import-md`. The batch workflow gives you full
> control over fonts, colors, tables, callout boxes, code blocks, and rich-text
> paragraphs. `import-md` (and plain text `write` commands) only produce plain,
> unstyled text with no colors, no table formatting, and no visual polish.
>
> **Avoid using `write` for styled content**: The `write` command writes raw
> plain text and does not render markdown symbols into native Google Docs
> elements. For formatted content, always use `batch`!
>
> **Default Writing/Pasting Behavior:** When asked to write or paste content
> into a Google Doc, you MUST by default use the `batch` command and convert the
> content into the correct JSON format to ensure native Google Docs styling.
> Only use simple commands like `write` or `append` with raw markdown text if
> the user explicitly specifies to do so.
>
> **You must read [`references/styling.md`](references/styling.md)** before
> generating any document. It contains color palettes, font pairings, layout
> templates, anti-patterns to avoid, and a quality checklist.
>
> **Key principles:** Use `line_spacing: 115` (not higher). Keep pages dense and
> informative — minimize blank-line spacers. Use structural variety surgically
> (a few callouts/quotes per doc, not every section reshaped into sub-headings).

## Recipes

**Read and inspect:**

```bash
JWS docs read DOC_ID
JWS docs read DOC_ID --tab TAB_ID              # read a specific tab
JWS docs info DOC_ID
JWS docs word-count DOC_ID                      # supports --tab
JWS docs toc DOC_ID                             # supports --tab
JWS docs list-tabs DOC_ID
JWS docs footnotes DOC_ID
JWS docs style DOC_ID                           # document style info
JWS docs suggestions DOC_ID                     # list pending suggestions
JWS docs extract-tables DOC_ID                  # supports --tab
JWS docs extract-links DOC_ID                   # supports --tab
JWS docs list-images DOC_ID
```

**Create and edit:**

```bash
JWS docs create --title "My Document"
JWS docs create --title "Paged Doc" --pageless=false
JWS docs copy DOC_ID "Copy Title"
JWS docs append DOC_ID "Text to append"
JWS docs insert DOC_ID "Text to insert" --index 1
JWS docs replace DOC_ID "old" "new"
JWS docs heading DOC_ID "Section Title" --level 2  # levels 1-6, TITLE, SUBTITLE
JWS docs delete DOC_ID 10 20 --confirm
JWS docs format-text DOC_ID --bold --start 1 --end 5
JWS docs format-text DOC_ID --text "Glimpse" --url "http://go/glimpse"   # hyperlink existing text
JWS docs bullets DOC_ID --start 10 --end 20 --preset BULLET_DISC_CIRCLE_SQUARE
JWS docs insert-table DOC_ID --rows 3 --cols 4
JWS docs insert-page-break DOC_ID --index 50
JWS docs insert-image DOC_ID "https://example.com/photo.png" --after "Section Title"
JWS docs insert-image-from-file DOC_ID /tmp/image.png --after "Section Title"
JWS docs insert-image-from-file DOC_ID /tmp/chart.png --tab TAB_ID --after "Results"
JWS docs import-md /path/to/file.md                            # creates new doc from markdown
JWS docs import-md /path/to/file.md --update DOC_ID                  # updates existing doc from markdown
JWS docs create-from-template TEMPLATE_ID "New" --var "NAME=Alice" --var "DATE=2025-01-15"
JWS docs pageless DOC_ID                                       # make a document pageless
JWS docs delete-doc DOC_ID                                     # delete a document permanently
```

**Comments:**

```bash
JWS docs add-comment DOC_ID "Comment text"
JWS docs add-comment DOC_ID "Needs rewording" --quote "specific text in doc"
JWS docs list-comments DOC_ID
JWS docs reply-comment DOC_ID COMMENT_ID "Reply text"
JWS docs resolve-comment DOC_ID COMMENT_ID ["optional reply"]
```

**Revisions and export:**

```bash
JWS docs list-revisions DOC_ID
JWS docs diff-revisions DOC_ID 1 2
JWS docs export DOC_ID --format pdf --output /tmp/doc.pdf
```

**Tab management:**

```bash
JWS docs list-tabs DOC_ID
JWS docs create-tab DOC_ID --title "Research Notes"
JWS docs create-tab DOC_ID --title "Second Tab" --index 1
JWS docs create-tab DOC_ID --title "Sub-tab" --parent PARENT_TAB_ID
JWS docs read-tab DOC_ID TAB_ID
JWS docs rename-tab DOC_ID TAB_ID "New Title"
JWS docs move-tab DOC_ID TAB_ID --parent NEW_PARENT_TAB_ID
JWS docs move-tab DOC_ID TAB_ID --root
JWS docs delete-tab DOC_ID TAB_ID --confirm
```

**Sharing and batch:**

```bash
JWS docs batch DOC_ID -f requests.json                                    # raw batchUpdate from JSON
JWS docs batch DOC_ID -f requests.json --tab TAB_ID                       # batch into a specific tab
JWS docs batch DOC_ID -f ops.json --after "## Design"                     # insert after a heading
JWS docs batch DOC_ID -f ops.json --after "## A" --before "## B"          # replace section between headings
JWS docs batch DOC_ID -f ops.json --replace-all                           # clear doc + rewrite from scratch
```

> [!TIP]
>
> **Sharing:** Google Docs are Google Drive files. To share a document or manage
> its permissions, use `JWS drive share` and `JWS drive permissions` from the
> **workspace-drive** skill.

**Update existing documents:**

```bash
JWS docs structure DOC_ID                      # show numbered headings/tables/paragraphs
JWS docs structure DOC_ID -v                    # verbose: show doc indexes, lists, full text
JWS docs structure DOC_ID --json               # JSON with start/end indices
JWS docs sed DOC_ID 's/old text/new text/g'    # sed-style find and replace
JWS docs sed DOC_ID -e 's/foo/bar/' -e 's/baz/qux/'  # multi-expression (batched)
JWS docs sed DOC_ID -f edits.sed               # read expressions from file (# comments)
JWS docs sed DOC_ID 's/draft/final/i'          # case-insensitive per-expression
JWS docs sed DOC_ID 's/TBD/Done/' -i           # global case-insensitive flag
JWS docs sed DOC_ID '3s/old/new/'              # addressed: replace in paragraph 3 only
JWS docs sed DOC_ID '2,5s/old/new/'            # addressed: replace in paragraphs 2-5
JWS docs sed DOC_ID '3d'                       # delete paragraph 3
JWS docs sed DOC_ID '2,5d'                     # delete paragraphs 2-5
JWS docs sed DOC_ID '3a\New text after'        # append text after paragraph 3
JWS docs sed DOC_ID '3i\New text before'       # insert text before paragraph 3
JWS docs sed DOC_ID 's/^/Prepend this/'        # prepend text to document start
JWS docs sed DOC_ID 's/$/Append this/'         # append text to document end
JWS docs sed DOC_ID 's/^$//'                   # clear document content
JWS docs sed DOC_ID 'y/abc/xyz/'               # transliterate: a→x, b→y, c→z
JWS docs sed DOC_ID 's/|1|old/new/'            # replace in table 1 only
JWS docs sed DOC_ID 's/|1.2.1|old/new/'        # replace in table 1, row 2, col 1
JWS docs sed DOC_ID 's/|1.2.1|/New content/'        # overwrite entire cell content
JWS docs sed DOC_ID 's/old/new/' --first             # replace only first occurrence
JWS docs sed DOC_ID 's/old/new/' --dry-run            # preview without applying
JWS docs sed DOC_ID 's/old/new/' --tab TAB_ID         # target specific tab
JWS docs sed DOC_ID 's/[0-9]+/NUM/' --regex           # regex pattern matching (RE2)
JWS docs sed DOC_ID 's/key term//' --bold             # bold all occurrences (1 API call)
JWS docs write DOC_ID -f content.md            # append text from file
JWS docs write DOC_ID -f content.md --clear    # overwrite doc from file
JWS docs clear DOC_ID --confirm                # clear all document content
JWS docs update-table DOC_ID --headers "Name,Status" --data-file data.json
JWS docs style-table DOC_ID --table 1 --bg-color "#f4cccc"                  # color all cells
JWS docs style-table DOC_ID --table 2 --row 0 --row-span 1 --bg-color "#fef7e0"  # color header row only
JWS docs style-table DOC_ID --table 1 --row 1 --row-span 3 --bg-color "#d9ead3"  # color rows 1-3
```

### Efficiency: Automatic Batching

Multi-expression sed operations are automatically batched to minimize API calls.
Three types of operations are deferred and flushed once at the end:

Operation                          | Deferred? | API Calls
---------------------------------- | --------- | ---------------
`s/old/new/` (replace)             | ✅         | 1 total for all
`s/\|T.R.C\|old/new/` (table cell) | ✅         | 1 total for all
`s/pattern// --bold`               | ✅         | 1 total for all

**Result**: 20 expressions → 3 API calls (1 Get + 1 table batch + 1 replace
batch), instead of 20+ individual calls.

```bash
cat > updates.sed << 'EOF'
s/|3.2.3|TBD/Alice/
s/|3.3.3|TBD/Bob/
s/|5.2.4|Notes/Updated notes/
s/old text/new text/
s/another/replaced/
EOF
JWS docs sed DOC_ID -f updates.sed
# Output:
# Batched 3 table cell operations in 1 API call.
# Replaced 5 occurrences of "old text".
# Replaced 2 occurrences of "another".
# Batched 2 replace operations in 1 API call.

JWS docs sed DOC_ID -e 's/Mar 12//' -e 's/Mar 17//' --bold
# Output:
# Collected 10 bold operations for "Mar 12".
# Collected 2 bold operations for "Mar 17".
# Batched 12 bold operations in 1 API call.
```

> [!TIP]
>
> Bold (`--bold`) now scans text inside table cells too, not just top-level
> paragraphs. Combine `--bold --regex` for pattern-based styling.

## Commands

This section lists the most essential commands. For the full list of commands,
see [commands.md].

Command       | Description
------------- | --------------------------------------------------------
`read`        | Read document content (supports `--tab`)
`create`      | Create document
`append`      | Append text (supports `--tab`)
`write`       | Write/overwrite document from file (`--file`, `--clear`)
`sync`        | Synchronize a local markdown file with a Google Doc
`batch`       | Execute batch operations
`list-tabs`   | List document tabs
`add-comment` | Add comment (`--quote` to anchor to text)
`structure`   | Show document structure with numbered elements

### Working with Tabs

Many Google Docs have multiple tabs. The `--tab TAB_ID` flag lets you target a
specific tab for both reading and writing. Use `list-tabs` first to discover tab
IDs:

```bash
JWS docs list-tabs DOC_ID
# Tab ID          Title        Index  Nesting
# t.dprlqxjpel7u  Overview     0      0
# t.iqg1w3dc9q0   Design Doc   1      0
# t.j30h49q6knfa  Appendix     0      1

JWS docs read DOC_ID --tab t.dprlqxjpel7u
JWS docs toc DOC_ID --tab t.iqg1w3dc9q0
JWS docs word-count DOC_ID --tab t.j30h49q6knfa
JWS docs extract-tables DOC_ID --tab t.iqg1w3dc9q0
JWS docs extract-links DOC_ID --tab t.dprlqxjpel7u
JWS docs batch DOC_ID -f ops.json --tab t.iqg1w3dc9q0 --index 1  # batch at index
JWS docs create-tab DOC_ID --title "New Section" --index 0       # create at index 0
JWS docs create-tab DOC_ID --title "Nested Tab" --parent PARENT_TAB_ID
JWS docs move-tab DOC_ID TAB_ID --parent NEW_PARENT_TAB_ID
```

Commands that support `--tab`: `read`, `append`, `insert`, `heading`, `batch`,
`export`, `extract-tables`, `extract-links`, `toc`, `word-count`, `structure`,
`sed`, `insert-image-from-file`, `pull`. Without `--tab`, commands operate on
the document's default (first) tab.

### Preserving Metadata (Comments, Anchors, and Suggestions)

> [!IMPORTANT]
>
> **Preserve comment anchors when editing docs.** Full-document replacement
> destroys indices and orphans existing comments. **Read
> [`references/metadata_retention.md`](references/metadata_retention.md)** for
> best practices on granular updates and formatting restoration once a document
> has stakeholder feedback.

### Updating Existing Documents

The update commands let you modify existing documents without rebuilding from
scratch. The recommended workflow:

1.  **Inspect** — use `structure` to see numbered paragraphs and headings
2.  **Edit** — use `sed` for text changes, `batch` for styled content
3.  **Verify** — use `read` or `export` to check results

**Common workflows:**

```bash
JWS docs structure DOC_ID
JWS docs sed DOC_ID 's/Draft/Final/g'

JWS docs batch DOC_ID -f new_status.json --after "## Status" --before "## Design"

JWS docs update-table DOC_ID --headers "Metric,Target,Current" --data-file metrics.json

JWS docs batch DOC_ID -f full_doc.json --replace-all
```

> [!TIP]
>
> Use `structure --json` to get exact character indices for each element. The
> `batch` command handles the delete+insert dance automatically — you only need
> to specify heading text with `--after` and `--before`.

> [!IMPORTANT]
>
> **Structural edits (adding/removing paragraphs):** Use sed `Na\text` (append
> after paragraph N) or `Ni\text` (insert before paragraph N) to add new
> paragraphs — not `s/old/old\nnew/` which creates literal `\n` text. Use
> `structure` first to find the right paragraph numbers. These commands work
> with TABLE paragraphs too (the CLI automatically adjusts the insertion index
> for tables).

> [!IMPORTANT]
>
> **`structure` vs `read --json` — choosing the right tool:** `structure` (and
> `structure -v`) gives a quick numbered overview of paragraphs, headings, and
> tables — use it for orientation and finding paragraph numbers. For **precise
> information** (bullet/list properties, inline object IDs, exact formatting,
> paragraph style details), use `read DOC_ID --json` and parse the JSON output.
> The raw JSON contains everything the API returns: bullet configs, named
> styles, indent levels, inline images with object IDs, etc.

> [!TIP]
>
> **Filling empty table cells:** Use `s/|T.R.C|/new text/` to write into empty
> cells (e.g. after `add-row`). The CLI inserts text at the cell start position
> even when the cell contains only a newline.

## Supported Formatting

When using `import-md` or `create-from-template`:

*   **Supported**: headings, bold, italic, code, links, lists
*   **Not supported**: tables, images, blockquotes, fenced code blocks

Markdown      | Result
------------- | -------------
`# Heading`   | Heading 1
`## Heading`  | Heading 2
`**bold**`    | Bold text
`*italic*`    | Italic text
`` `code` ``  | Monospace
`[text](url)` | Hyperlink
`- item`      | Bullet list
`1. item`     | Numbered list

## Tips

-   Use `format-text --url` to turn existing text (or text found via `--text`)
    into a hyperlink. This is the preferred way to add links to existing content
    without having to delete and re-insert it.
-   `import-md` creates a **new** document from a markdown file (use `--title`
    to set the title)
-   Documents created via `create` and `import-md` are **pageless by default**
    (use `--pageless=false` to create paged documents)
-   The `add-comment` command adds a document-level comment; use `--quote
    "text"` to anchor the comment to the first occurrence of that text
-   Use `toc` to verify a doc's heading structure
-   Use `word-count` to check document size
-   `export` supports `pdf`, `txt`, `docx`, and `png` formats
-   **Multi-tab detection:** When reading a document with multiple tabs without
    specifying a `--tab`, the tool prints lines prefixed with `[gdocs]` listing
    the available tabs before showing the content of the first tab. These lines
    are not part of the actual document. They are shown to you so you'll be
    aware if there is more to the document.
-   **PNG export of pageless docs:** Pageless docs still produce multiple pages
    when exported as PNG. Use `--page N` to export each page: `export DOC_ID
    --format png --output p1.png --page 1`, then `--page 2`, etc. Keep
    incrementing until the command errors (meaning no more pages). **You must
    export ALL pages to review the full document.**
-   **Recommended workflow:** Export all pages as PNG, review them visually,
    then iterate on edits

## Diagrams in Google Docs

See [diagrams.md] for guidelines on generating and inserting diagrams into
Google Docs.

## Markdown → Google Doc

Use `import-md` to convert any markdown file into a native Google Doc with
proper formatting (headings, bold, italic, links, lists, tables):

```bash
JWS docs import-md /path/to/report.md --title "Weekly Report"
```

To update an existing document instead of creating a new one, use the `--update`
flag:

```bash
JWS docs import-md /path/to/report.md --update DOC_ID
```

This is the simplest way to turn a local `.md` file into a shareable Google Doc.
The doc is created in your Drive root and the URL is printed on success. Combine
with `share` to distribute:

```bash
DOC_ID=$(JWS docs import-md /tmp/notes.md --title "Notes" --json | jq -r .documentId)
JWS docs share $DOC_ID --email team@google.com --role writer
```

### Handling Conflicts during Sync

When using `sync` to synchronize a local markdown file with a Google Doc,
conflicts may occur if both the local file and the remote doc have changed since
the last sync.

By default, `sync` will fail with an error listing the conflicts.

To handle conflicts programmatically (e.g., in an agent), use the
`--json-conflicts` flag:

```bash
JWS docs sync DOC_ID local_file.md --json-conflicts
```

If conflicts are found, the command will fail and output a JSON string prefixed
with `CONFLICT_JSON:` containing details of the conflicts (base, local, and
remote content). Agents should parse this JSON and ask the user for resolution.

## Global Flags

-   `--json` — output as JSON (works with all read commands)

## Batch Operations

See [batch_operations.md] for detailed reference on batch operations, styling
fields, table-specific fields, and a complete example.

## Document Creation Recipe

1.  **Outline**: Decide sections, content types (text, tables, lists, images),
    and style
2.  **Palette**: Pick font + colors (e.g., Google Sans + `#1a73e8` blue
    headings)
3.  **Generate batch JSON**: Start with `set-default-style` (Google Sans, 11pt,
    `#202124`, `line_spacing:115`). All ops in one file — headings, text, lists,
    tables. Keep pages dense: minimize blank `append` spacers, use `space_above`
    on headings (16–24pt) for section gaps. Add 2–3 callouts or goal labels for
    structural variety, but don't fragment every section into sub-headings.
    Combine metadata (Author • CL • Date) on one line.
4.  **Create doc**: `DOC_ID=$(JWS docs create --title "Report" --json | jq -r
    .documentId)`
5.  **Execute batch**: `JWS docs batch $DOC_ID -f batch.json`
6.  **Export for review**: Export all pages as PNG by iterating `--page 1`,
    `--page 2`, etc.: `JWS docs export $DOC_ID --format png --output p1.png
    --page 1` (repeat until the command errors, meaning no more pages)
7.  **Review ALL pages visually** (view every PNG). Check that pages feel dense
    and informative, not airy. Fix via second batch if needed
8.  **Share**: `JWS docs share $DOC_ID --email team@email.com --role writer`

### Complete Batch JSON Example

See [batch_operations.md] for a full example.

<!-- disableFinding(LINE_OVER_80) -->

[diagrams.md]: references/diagrams.md
[batch_operations.md]: references/batch_operations.md
[commands.md]: references/commands.md
