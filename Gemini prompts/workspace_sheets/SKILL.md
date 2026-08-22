---
name: workspace-sheets
description: >-
    Read, write, format, and manage Google Sheets spreadsheets. Use when reading cell
    values, writing data, formatting cells, creating spreadsheets, managing
    sheets/tabs, sorting, merging, inserting/deleting rows and columns, adding charts,
    find-and-replace, importing CSV, creating pivot tables, or exporting.
    Also use when the user shares a sheets.google.com or
    docs.google.com/spreadsheets URL.
    Don't use for Calendar, Gmail, Google Docs, Slides, or Drive file management.
---

# workspace-sheets

> [!IMPORTANT]
>
> You **MUST** render the document after every mutation (create, edit, insert,
> format, delete content, etc.) with the `render_workspace_item` tool to
> visually confirm your changes. Do not skip this step — text-only output from
> write commands does not show formatting, layout, or visual issues.

> [!CAUTION]
>
> The `delete-sheet`, `delete-rows`, and `clear` commands permanently remove
> data. **Never** use destructive commands unless the user explicitly asks.

## CLI

The Sheets tool is available via the Janus Workspace CLI bundled with the app:

All Sheets commands are accessed via the `sheets` subcommand:

```bash
JWS sheets <command> [flags]
```

## Recipes

**Read data:**

```bash
JWS sheets read SPREADSHEET_ID "Sheet1!A1:D10"
JWS sheets read SPREADSHEET_ID "Sheet1!A1:D10" --json
JWS sheets read-all SPREADSHEET_ID
JWS sheets get SPREADSHEET_ID               # get spreadsheet metadata
JWS sheets info SPREADSHEET_ID              # get spreadsheet info
JWS sheets list-sheets SPREADSHEET_ID       # list all sheets/tabs
JWS sheets named-ranges SPREADSHEET_ID
```

**Write data:**

```bash
JWS sheets write SPREADSHEET_ID "Sheet1!A1" --values '[["Name","Score"],["Alice","95"]]'
JWS sheets append SPREADSHEET_ID "Sheet1!A1" --values '[["Bob","87"]]'
JWS sheets clear SPREADSHEET_ID "Sheet1!A1:D10"
JWS sheets import-csv SPREADSHEET_ID /path/to/data.csv
JWS sheets find-replace SPREADSHEET_ID --find "old" --replace "new"
JWS sheets notes SPREADSHEET_ID "Sheet1!A1" "This is a note"
```

**Manage spreadsheets:**

```bash
JWS sheets create --title "New Spreadsheet"
JWS sheets copy-spreadsheet SPREADSHEET_ID "Copy Title"
JWS sheets add-sheet SPREADSHEET_ID --title "New Tab"
JWS sheets delete-sheet SPREADSHEET_ID --sheet-id 0
JWS sheets rename-sheet SPREADSHEET_ID --sheet-id 0 --title "Renamed"
JWS sheets copy-sheet SPREADSHEET_ID --sheet-id 0 --dest OTHER_SPREADSHEET_ID
JWS sheets create-from-template TEMPLATE_ID --title "New" --replacements "{{NAME}}=Alice"
```

**Formatting:**

```bash
JWS sheets format SPREADSHEET_ID --sheet-id 0 --start-row 0 --end-row 1 --start-col 0 --end-col 5 --bold --align CENTER --bg-color #00FF00
JWS sheets set-col-width SPREADSHEET_ID --sheet-id 0 --start-col 0 --end-col 1 --pixels 200
JWS sheets autosize SPREADSHEET_ID --sheet-id 0 --start-col 0 --end-col 5
JWS sheets merge SPREADSHEET_ID --sheet-id 0 --start-row 0 --end-row 1 --start-col 0 --end-col 3
JWS sheets unmerge SPREADSHEET_ID --sheet-id 0 --start-row 0 --end-row 1 --start-col 0 --end-col 3
JWS sheets freeze SPREADSHEET_ID --sheet-id 0 --rows 1 --cols 1
JWS sheets borders SPREADSHEET_ID --sheet-id 0 --style SOLID --color "#000000"
JWS sheets conditional-format SPREADSHEET_ID --sheet-id 0 --start-row 0 --end-row 100 --start-col 0 --end-col 1 --condition NUMBER_GREATER --value "90" --color "#00FF00"
```

**Rows, columns, and data operations:**

```bash
JWS sheets sort SPREADSHEET_ID --sheet-id 0 --col 0              # --asc is default, omit for descending
JWS sheets insert-rows SPREADSHEET_ID --sheet-id 0 --start 5 --count 5
JWS sheets delete-rows SPREADSHEET_ID --sheet-id 0 --start 5 --end 10
JWS sheets insert-cols SPREADSHEET_ID --sheet-id 0 --start 2 --end 4
JWS sheets delete-cols SPREADSHEET_ID --sheet-id 0 --start 2 --end 4
JWS sheets copy-paste SPREADSHEET_ID --sheet-id 0 --start-row 0 --end-row 5 --start-col 0 --end-col 2 --dest-row 0 --dest-col 3
JWS sheets auto-fill SPREADSHEET_ID --sheet-id 0 --start-row 0 --end-row 10 --start-col 0 --end-col 1 --source-end-row 3
JWS sheets formula-fill SPREADSHEET_ID --source "Sheet1!C1" --dest "Sheet1!C1:C10"
JWS sheets data-validation SPREADSHEET_ID "Sheet1!B1:B10" --values "Yes,No,Maybe"
JWS sheets protect SPREADSHEET_ID "Sheet1!A1:D1" --sheet-id 0
```

**Charts, pivots, and export:**

```bash
JWS sheets add-chart SPREADSHEET_ID --sheet-id 0 --chart-type BAR --start-row 0 --end-row 10 --start-col 0 --end-col 2 --title "Sales"
JWS sheets export-chart SPREADSHEET_ID --chart-id 1 --output /tmp/chart.png
JWS sheets filter-view SPREADSHEET_ID --sheet-id 0 --range "Sheet1!A1:D10"
JWS sheets pivot SPREADSHEET_ID --source "Sheet1!A1:D100" --sheet-id 0
JWS sheets export SPREADSHEET_ID /tmp/export.csv --format csv
JWS sheets export SPREADSHEET_ID /tmp/page1.png --format png --page 1
JWS sheets add-table SPREADSHEET_ID "MyTable" "Sheet1!A1:D10"
JWS sheets update-table SPREADSHEET_ID "MyTable" "Sheet1!A1:D20"
JWS sheets delete-table SPREADSHEET_ID "MyTable"
JWS sheets batch SPREADSHEET_ID requests.json
```

## Sharing

Google Sheets are Google Drive files. To share a spreadsheet or manage its
permissions, use `JWS drive share` and `JWS drive permissions` from the
**workspace-drive** skill:

```bash
JWS drive share SPREADSHEET_ID --email user@google.com --role writer
JWS drive permissions SPREADSHEET_ID
```

## Commands

Command                | Description
---------------------- | --------------------------------------------------
`read`                 | Read range
`read-all`             | Read all sheets
`write`                | Write to range
`append`               | Append rows
`clear`                | Clear range
`get`                  | Spreadsheet metadata
`info`                 | Spreadsheet info
`create`               | Create spreadsheet
`copy-spreadsheet`     | Copy entire spreadsheet
`list-sheets`          | List sheets
`add-sheet`            | Add sheet
`delete-sheet`         | Delete sheet
`rename-sheet`         | Rename sheet
`copy-sheet`           | Copy sheet to another spreadsheet
`format`               | Format range
`set-col-width`        | Set column width
`autosize`             | Auto-resize columns
`merge`                | Merge cells
`unmerge`              | Unmerge cells
`sort`                 | Sort range
`freeze`               | Freeze rows/cols
`borders`              | Set cell borders
`conditional-format`   | Add conditional formatting
`insert-rows`          | Insert rows
`delete-rows`          | Delete rows
`insert-cols`          | Insert columns
`delete-cols`          | Delete columns
`copy-paste`           | Copy-paste range
`auto-fill`            | Auto-fill range
`formula-fill`         | Fill formula across range
`find-replace`         | Find and replace
`notes`                | Get/set cell notes
`named-ranges`         | List named ranges
`import-csv`           | Import CSV file
`data-validation`      | Add data validation
`protect`              | Protect range
`add-chart`            | Add a chart
`export-chart`         | Export chart as image
`filter-view`          | Create filter view
`pivot`                | Create pivot table
`export`               | Export spreadsheet (csv, xlsx, pdf, ods, tsv, png)
`create-from-template` | Create from template
`add-table`            | Add a structured table
`update-table`         | Update structured table range
`delete-table`         | Delete a structured table
`batch`                | Execute raw batchUpdate

## Tips

-   The `format` command uses `--sheet-id`, `--start-row/--end-row`,
    `--start-col/--end-col` (not A1 range notation)
-   The `notes` command takes range and note text as positional arguments (not
    --set flag)
-   Avoid spaces in sheet names when used in range notation; if unavoidable,
    wrap in single quotes: `"'My Sheet'!A1:B5"`
-   Chart types: `BAR`, `LINE`, `AREA` work reliably; `PIE` is listed but not
    supported by the API
-   Use `--json` on read commands to get machine-parseable output
-   Use `--value-render-option FORMULA` on the `read` command to retrieve the
    underlying cell formulas instead of the evaluated values.
-   `export` supports `csv`, `xlsx`, `pdf`, `ods`, `tsv`, and `png` formats
-   To include a comma inside a cell value when not using JSON arrays, escape it
    with a backslash: `\,`
-   **Recommended workflow:** Use `export SPREADSHEET_ID page.png --format png
    --page N` to export a specific page as an image, review it visually, then
    iterate on edits

## Global Flags

-   `--json` — output as JSON (works with all read commands)
