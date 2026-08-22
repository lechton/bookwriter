---
name: organize-files
description: >-
  Organize files in a folder by moving them into semantically categorized subfolders.
  Use when the user asks to organize, sort, clean up, tidy, or categorize files in a folder.
---

# organize-files

## Workflow

### Step 1: List all files in the target directory

Call the `list_dir` tool on the target directory to see every file.

### Step 2: Assign every file to a semantic category

Assign **every** visible (non-hidden) file to exactly **one** category. Use your
understanding of what the file is **about**, not just its file extension.

**Good categorization examples:**

-   `rental_agreement.pdf` → **Housing** (not "PDFs")
-   `recipe_collection.txt` → **Cooking** (not "Text Files")
-   `marathon_training_plan.xlsx` → **Fitness** (not "Spreadsheets")
-   `wedding_guest_list.csv` → **Wedding** (not "Spreadsheets")
-   `passport_scan.jpg` → **Travel** (not "Images")
-   `logo_v2_final.png` → **Design** (not "Images")
-   `tax_return_2025.pdf` → **Finance** (not "PDFs")
-   `pay_stubs_q1.csv` → **Finance** (not "Spreadsheets")

**Rules:**

-   Every file must appear in exactly one category.
-   Do NOT skip any files.
-   Do NOT ask the user for confirmation — just organize everything.
-   Ignore hidden files (starting with `.`).
-   Leave existing subdirectories in place — only move files.

### Step 3: Move files into their categories

Use a single `run_command` call to create all category subdirectories and move
every file in one batch. Chain the commands with `&&` so the operation stops on
the first error. Set `Cwd` to the target directory.

Example:

```bash
mkdir -p Housing Cooking Fitness Wedding Travel Design Finance && \
mv rental_agreement.pdf Housing/ && \
mv recipe_collection.txt Cooking/ && \
mv marathon_training_plan.xlsx Fitness/ && \
mv wedding_guest_list.csv Wedding/ && \
mv passport_scan.jpg Travel/ && \
mv logo_v2_final.png Design/ && \
mv tax_return_2025.pdf pay_stubs_q1.csv Finance/
```

**Rules:**

-   Use a **single** `run_command` call — do NOT make one call per file or per
    category.
-   Always `mkdir -p` all category directories first before any `mv`.
-   Quote filenames that contain spaces or special characters.
-   Group all files destined for the same category into a single `mv` command
    (e.g., `mv tax_return_2025.pdf pay_stubs_q1.csv Finance/`) rather than one
    `mv` per file.
