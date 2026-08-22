---
name: workspace-contacts
description: >-
    Search and view Google Contacts and corporate directory using the Janus Workspace CLI.
    Use when listing personal contacts, searching contacts by name, viewing
    contact details, or looking up people in the corporate directory.
    Don't use for Google Chat members or Calendar attendees.
---

# workspace-contacts

> [!WARNING]
>
> Contacts list/search auth works but People API may not be enabled in the SSO
> project. Directory search is blocked by CXF (directory.readonly scope not in
> policy).

> [!CAUTION]
>
> The `delete-contact` command permanently removes contacts. **Never** use
> destructive commands unless the user explicitly asks.

## CLI

The Contacts tool is available via the Janus Workspace CLI bundled with the app:

All Contacts commands are accessed via the `contacts` subcommand:

```bash
JWS contacts <command> [flags]
```

## Recipes

```bash
JWS contacts list --max 10
JWS contacts search "Alice"
JWS contacts get CONTACT_RESOURCE_NAME
JWS contacts directory "username"           # corporate directory lookup
```

## Commands

Command     | Description
----------- | -------------------
`list`      | List contacts
`search`    | Search contacts
`get`       | Get contact details
`directory` | Directory search

## Global Flags

-   `--json` — output as JSON
