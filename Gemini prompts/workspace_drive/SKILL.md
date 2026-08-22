---
name: workspace-drive
description: >-
    List, search, upload, download, update, and manage Google Drive files and
    folders using the Janus Workspace CLI. Use when listing files, searching
    Drive, downloading or uploading files, updating file content in-place,
    creating folders, creating shortcuts, moving/copying/renaming files, sharing, managing
    permissions, viewing revisions, exporting Google files, or getting file URLs.
    Don't use for editing Docs/Sheets/Slides content (use those specific skills).
    Also use when the user shares a drive.google.com URL.
---

# workspace-drive

> [!CAUTION]
>
> The `empty-trash` and `delete` commands permanently remove files and cannot be
> undone. **Never** use destructive commands unless the user explicitly asks.
>
> [!IMPORTANT]
>
> You **MUST** render the document after every mutation (create, edit, insert,
> format, delete content, etc.) with the `render_workspace_item` tool to
> visually confirm your changes. Do not skip this step — text-only output from
> write commands does not show formatting, layout, or visual issues.

> [!CAUTION]
>
> The `empty-trash` command permanently deletes **all** trashed files and cannot
> be undone. Only run it with explicit user approval.

> [!IMPORTANT]
>
> **Efficiency Guidelines**:
>
> -   Answer general or conceptual questions about Drive commands (e.g., "Is
>     empty-trash reversible?") directly using the details in this `SKILL.md`
>     file.
>
> -   Do **NOT** call tools (e.g., `code_search`, `view_file`, `list_dir`) to
>     inspect source code or documentation unless the prompt specifically asks
>     to inspect file content or implementation details.
>
> -   **Ignore Workspace Context**: Ignore workspace-specific context (e.g.,
>     CitC workspace name, pending changes, CL numbers in path) when answering.
>     Focus solely on the prompt.

## CLI

The Drive tool is available via the Janus Workspace CLI bundled with the app:

All Drive commands are accessed via the `drive` subcommand:

```bash
JWS drive <command> [flags]
```

## Recipes

**Browse and search:**

```bash
JWS drive ls                                # list root
JWS drive ls FOLDER_ID --max 50
JWS drive ls --trashed                      # list trashed items
JWS drive search --name-contains "quarterly report"
JWS drive search --parent-id FOLDER_ID --modified-after 2024-01-01T00:00:00Z --type spreadsheet
JWS drive search --name-contains "quarterly report" --include-trashed # search trashed items
JWS drive recent --max 10
JWS drive starred
JWS drive info FILE_ID
JWS drive url FILE_ID                       # print web URL
JWS drive tree FOLDER_ID                    # recursive folder tree
```

**Exact Name Matching for Native Files:** Omit file extensions when searching
for native Google Workspace files (Docs, Sheets, Slides) via exact match.
Execute `JWS drive search --name-exact "Q3 Budget"` instead of appending
artificial extensions like `"Q3 Budget.gsheet"`. Include extensions only when
searching exact names of binary uploads (e.g., `report.pdf`).

**File operations:**

```bash
JWS drive download FILE_ID --out /tmp/file.pdf
JWS drive upload /tmp/file.txt --parent FOLDER_ID
JWS drive update FILE_ID /tmp/updated.ipynb  # replace content, keep ID/link/permissions
JWS drive mkdir "New Folder" --parent FOLDER_ID
JWS drive create-shortcut FILE_ID FOLDER_ID  # shortcut inherits original file name
JWS drive cp FILE_ID "Copy of File"
JWS drive mv FILE_ID NEW_PARENT_ID
JWS drive rename FILE_ID "New Name"
JWS drive export FILE_ID /tmp/doc.pdf --format pdf   # export Google files
JWS drive trash FILE_ID
JWS drive untrash FILE_ID
JWS drive empty-trash --confirm
```

**Sharing and permissions:**

```bash
JWS drive share FILE_ID --email user@google.com --role writer
JWS drive share FILE_ID --email user@google.com --role reader --notify=false
JWS drive permissions FILE_ID
JWS drive remove-permission FILE_ID PERMISSION_ID
JWS drive audit-permissions FOLDER_ID
```

**Other:**

```bash
JWS drive quota
JWS drive revisions FILE_ID
JWS drive shared-drives
JWS drive comments FILE_ID
JWS drive comments FILE_ID --add "Nice work!"
JWS drive comments FILE_ID --add "Done" --reply_to COMMENT_ID
JWS drive batch -f ops.json
```

## Commands

| Command             | Description                                       |
| ------------------- | ------------------------------------------------- |
| `ls`                | List files (supports `--trashed`)                 |
| `search`            | Search files (supports `--trashed`)               |
| `info`              | Get file info                                     |
| `url`               | Print web URL                                     |
| `download`          | Download file                                     |
| `upload`            | Upload file                                       |
| `update`            | Update file content in-place (preserves ID, link, |
:                     : permissions)                                      :
| `mkdir`             | Create folder                                     |
| `create-shortcut`   | Create a shortcut to a file in a folder           |
| `cp`                | Copy file                                         |
| `mv`                | Move file                                         |
| `rename`            | Rename file                                       |
| `export`            | Export Google file                                |
| `trash`             | Trash file                                        |
| `untrash`           | Restore file                                      |
| `empty-trash`       | Empty trash                                       |
| `share`             | Share file (`--notify=false` to suppress email)   |
| `permissions`       | List permissions                                  |
| `remove-permission` | Remove permission                                 |
| `audit-permissions` | Recursive permission audit                        |
| `recent`            | Recent files                                      |
| `starred`           | Starred files                                     |
| `quota`             | Show quota                                        |
| `revisions`         | List file revisions                               |
| `shared-drives`     | List shared drives                                |
| `tree`              | Display folder tree                               |
| `comments`          | List/add/reply to comments                        |
| `batch`             | Execute batch ops                                 |

## Global Flags

-   `--json` — output as JSON (works with all read commands)
