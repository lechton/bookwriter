---
name: rename-files
description: >-
  Rename files and subfolders in a directory using informative, human-readable
  names. Use when the user asks to rename, clean up filenames, or apply a naming
  convention to items in a directory.
---

# rename-files

## Workflow

### Step 1: List all items in the target directory

Call the `list_dir` tool on the target directory to see every file and
subdirectory. Ignore hidden items (starting with `.`). Note the **file size** of
each item — this determines whether content can be read in Phase 2.

### Step 2: Phase 1 — Metadata-First Match (Fast Path)

For each file and subdirectory, attempt to build an informative name **without
reading file contents**:

1.  **Parse the existing filename** using pattern matching to extract structured
    clues:

    *   Version numbers (e.g., `v1.54`, `2.0.1`)
    *   Project or product tags (e.g., `Gemini`, `Chrome`)
    *   Timestamps or dates (e.g., `20260511`, `2026-05-11`)
    *   Hashes or UUIDs (strip these — they add no human value)

2.  **For generic items** whose names carry no useful clues (e.g.,
    `download.pdf`, `IMG_4521.jpg`, `Untitled.txt`, `New Folder`), retrieve the
    item's system modification time via `run_command`:

    ```bash
    stat -f '%Sm' -t '%Y-%m-%d_%H-%M-%S' filename
    ```

    Use the formatted mtime as a distinguishing suffix.

3.  **Build a preliminary new name** from the extracted attributes. Keep the
    original file extension. Examples:

    Original                         | Renamed
    -------------------------------- | ----------------------------------
    `GoogleChrome-131.0.6778.86.dmg` | `Google Chrome v131.0.6778.86.dmg`
    `gemini_app_1.54.0.dmg`          | `Gemini Installer v1.54.0.dmg`
    `project_alpha_v2_FINAL/`        | `Project Alpha v2/`

    Items like `IMG_4521.jpg`, `download (3).pdf`, and `New Folder/` remain
    generic after this phase — they proceed to Phase 2.

### Step 3: Phase 2 — Selective Content Match (Slow Path)

For items that **still have generic names** after Phase 1, peek at their content
to extract an informative name.

**Size guard:** Check the file size noted in Step 1.

*   **≤ 100 MB:** Safe to read content via `view_file`.
*   **> 100 MB:** Do NOT read content. Fall back to the mtime-based name from
    Phase 1 (e.g., `Large_Archive_2026-05-11.zip`).

**Files — by format:**

*   **HTML/HTM:** Search for the `<title>` tag or the first `<h1>` header.
*   **JSON/JSONL logs:** Search for active window titles, application names,
    session keys, or descriptive fields (e.g., `"title"`, `"name"`,
    `"description"`, `"activeWindow"`).
*   **CSV:** Read the first line (column headers) to infer the dataset subject.
*   **TXT/MD:** Use the first non-empty line as a title.
*   **XML:** Search for a root element name or `<title>` tag.
*   **PDF:** Use `view_file` — it extracts text via PDFKit. Use the document
    title or first heading line.

**Subdirectories:**

Call `list_dir` on the folder to see its children. Infer a name from the
contents (e.g., a folder full of `.csv` budget files → `Budget Reports/`).

**Sanitize** the extracted text before using it as a name component:

*   Keep spaces (do not replace with underscores).
*   Remove special characters (`/ \ : * ? " < > |`).
*   Truncate to 50 characters maximum.

**Examples after Phase 2:**

Original           | Content signal                 | Renamed
------------------ | ------------------------------ | --------------------------
`download (3).pdf` | PDF title: "2025 Tax Return"   | `Tax Return 2025.pdf`
`data.csv`         | Headers: date, amount, vendor  | `Expense Transactions.csv`
`IMG_4521.jpg`     | No text content (image)        | `Photo 2026-05-11.jpg`
`New Folder/`      | Children: budget_q1–q4.xlsx    | `Budget Reports/`
`Untitled.html`    | `<title>Meeting Notes</title>` | `Meeting Notes.html`

### Step 4: Execute renames

Use a **single** `run_command` call to rename all items in one batch. Set `Cwd`
to the target directory. Chain with `&&` so the operation stops on the first
error. Rename subdirectories **after** files to avoid breaking relative paths.

```bash
mv -n 'original_name_1.ext' 'New Name 1.ext' && \
mv -n 'original_name_2.ext' 'New Name 2.ext' && \
mv -n 'original_name_3.ext' 'New Name 3.ext'
```

**Rules:**

-   Preserve the original file extension — never change it.
-   If two items would end up with the same new name, append a meaningful
    suffix.
-   Do NOT ask the user for confirmation — just rename everything.
-   Do NOT rename items that already have clear, informative names.
-   Rename subdirectories **after** all files to avoid breaking paths mid-batch.
