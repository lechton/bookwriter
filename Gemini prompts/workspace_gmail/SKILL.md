---
name: workspace-gmail
description: >-
    Read, search, send, and manage Gmail messages, drafts, labels, and filters
    using the Janus Workspace CLI. Use when reading emails, searching inbox,
    sending messages, managing drafts, forwarding, setting vacation responder,
    creating filters, managing labels, downloading attachments, or configuring
    auto-forwarding. Also use when the user shares a mail.google.com URL.
    Don't use for Google Chat messages or Calendar invites.
    IMPORTANT: This skill can send emails as you. The agent MUST get explicit
    user authorization before sending any email.
---

# workspace-gmail

> [!CAUTION]
>
> This skill can send emails **as you**. The agent MUST get explicit user
> authorization before sending any email. Always confirm the recipient, subject,
> and body with the user first.

> [!CAUTION]
>
> The `batch-delete` and `trash` commands permanently delete or trash emails.
> **Never** use these unless the user explicitly asks to delete/trash messages.

> [!IMPORTANT]
>
> **Unattended mode (`AGY_UNATTENDED`)**: When the environment variable
> `AGY_UNATTENDED` is set (to any non-empty value), all outbound commands
> (`send`, `send-self`, `reply`, `forward`, `send-with-attachment`,
> `send-draft`) are **hard-blocked** at the CLI level and will return an error.
> This prevents autonomous agents from sending emails without human oversight.
> Use `create-draft` to prepare emails for the human operator to review and send
> manually.

## CLI

The Gmail tool is available via the Janus Workspace CLI bundled with the app:

All Gmail commands are accessed via the `gmail` subcommand:

```bash
JWS gmail <command> [flags]
```

## Recipes

**Search and read:**

```bash
JWS gmail search "is:unread from:boss" --max 5
JWS gmail read "is:starred" --max 3
JWS gmail get MESSAGE_ID
JWS gmail threads "subject:review" --max 5
JWS gmail get-thread THREAD_ID
```

**Send and reply:**

```bash
JWS gmail send --to "user@google.com" --subject "Hello" --body "Hi!"
JWS gmail send --to "a@g.com" --cc "b@g.com" --bcc "c@g.com" \
  --subject "plain text email" --body "just text"
JWS gmail send --to "a@g.com" --cc "b@g.com" --bcc "c@g.com" \
  --subject "html email" --html --body "html_content"
JWS gmail send --to "user@google.com" --subject "Markdown email" --md --body "# Title\nContent"
JWS gmail send-self --subject "Reminder" --body "Buy groceries"
JWS gmail send-self --subject "Log" --html --body "<h1>Success</h1>"
JWS gmail send-self --subject "Markdown Log" --md --body "# Success"
JWS gmail send --to "user@google.com" --subject "Update" --body "..." \
  --from "Team Alias <team@google.com>"
JWS gmail send-with-attachment --to "user@google.com" \
  --subject "Report" --body "See attached" --file /tmp/report.pdf
JWS gmail reply --message MESSAGE_ID --body "Thanks!"
JWS gmail reply --message MESSAGE_ID --body "Thanks!" --all
JWS gmail forward MESSAGE_ID "other@google.com"
```

**Drafts:**

```bash
JWS gmail create-draft --to "user@google.com" \
  --subject "Draft" --body "..."
# Add html flag to create a html email draft instead of raw text
JWS gmail create-draft --to "user@google.com" \
  --subject "html email" --html --body "<p>html_content</p>"
# Add md flag to create a draft from markdown
JWS gmail create-draft --to "user@google.com" \
  --subject "markdown email" --md --body "# markdown content"
JWS gmail drafts --max 10
JWS gmail get-draft DRAFT_ID
JWS gmail update-draft DRAFT_ID --body "Updated body"
JWS gmail send-draft DRAFT_ID
JWS gmail delete-draft DRAFT_ID

# Create a threaded reply draft (auto-populates from original message)
JWS gmail create-draft --message MESSAGE_ID --body "Drafting a reply"

# Create a reply-all draft
JWS gmail create-draft --message MESSAGE_ID --all --body "Reply all draft"
```

**Labels and organization:**

```bash
JWS gmail labels
JWS gmail get-label LABEL_ID
JWS gmail create-label "MyLabel"
JWS gmail create-label "Parent/Child"       # Automatically creates Parent if missing
JWS gmail create-label "ColoredLabel" --bg-color red --text-color white
JWS gmail update-label LABEL_ID --bg-color "#f691b3" --text-color "#000000"
JWS gmail update-label LABEL_ID --name "New Name"
JWS gmail add-label MESSAGE_ID LABEL_ID
JWS gmail remove-label MESSAGE_ID LABEL_ID
JWS gmail delete-label LABEL_ID
JWS gmail mark-read MESSAGE_ID
JWS gmail mark-unread MESSAGE_ID
JWS gmail archive MESSAGE_ID
JWS gmail archive MESSAGE_ID1 MESSAGE_ID2   # archive multiple messages
JWS gmail archive --thread THREAD_ID        # archive all messages in a thread
JWS gmail trash MESSAGE_ID
JWS gmail thread-modify THREAD_ID --add STARRED --remove UNREAD
```

**Batch operations:**

```bash
JWS gmail batch-modify "MSG_ID1,MSG_ID2" --add-labels "LABEL1,LABEL2"
JWS gmail batch-modify "MSG_ID1,MSG_ID2" --remove-labels "LABEL1"
JWS gmail batch-delete "MSG_ID1,MSG_ID2" --confirm
```

**Filters and settings:**

```bash
JWS gmail list-filters
JWS gmail filter-create --from "news@example.com" --add-labels "LABEL_1,LABEL_2"
JWS gmail filter-update FILTER_ID --from "new_news@example.com"
JWS gmail filter-delete FILTER_ID
JWS gmail filter-search FILTER_ID
JWS gmail filter-search --from "news@example.com"
JWS gmail filter-apply FILTER_ID --dry-run
JWS gmail filter-apply --from "news@example.com" --add-labels "LABEL_1"
JWS gmail get-vacation
JWS gmail enable-vacation --subject "OOO" --body "I'm away until Monday"
JWS gmail disable-vacation
JWS gmail forwarding-addresses
JWS gmail get-autoforward
JWS gmail enable-autoforward --email "backup@google.com"
JWS gmail disable-autoforward
JWS gmail sendas
JWS gmail delegates
JWS gmail delegates --add "delegate@google.com"
JWS gmail delegates --remove "delegate@google.com"
JWS gmail history 12345
JWS gmail download-attachment MESSAGE_ID ATTACHMENT_ID /tmp/output.pdf
```

## Commands

Command                | Description
---------------------- | -------------------------------------------------------
`search`               | Search messages
`get`                  | Get full message
`read`                 | Search + read full messages
`threads`              | Search threads
`get-thread`           | Get full thread
`send`                 | Send email (supports `--from` for send-as aliases)
`send-self`            | Send an email to yourself
`reply`                | Reply to message
`forward`              | Forward a message
`send-with-attachment` | Send with file attachment
`create-draft`         | Create draft or threaded reply draft (with `--message`)
`send-draft`           | Send a draft
`get-draft`            | Get draft details
`update-draft`         | Update a draft
`delete-draft`         | Delete a draft
`labels`               | List labels
`get-label`            | Get label details
`drafts`               | List drafts
`trash`                | Trash a message
`mark-read`            | Mark as read
`mark-unread`          | Mark as unread
`download-attachment`  | Download attachment
`archive`              | Archive a message
`add-label`            | Add label to message
`remove-label`         | Remove label
`create-label`         | Create a label (supports nested labels and colors)
`update-label`         | Update a label (name or color)
`delete-label`         | Delete a label
`thread-modify`        | Modify thread labels
`batch-modify`         | Batch modify messages
`batch-delete`         | Batch delete messages
`history`              | List mailbox history
`list-filters`         | List filters
`filter-create`        | Create a filter
`filter-update`        | Update a filter (simulated via delete and recreate)
`filter-delete`        | Delete a filter
`filter-search`        | Search messages matching a filter's criteria
`filter-apply`         | Apply a filter's actions to existing conversations
`get-vacation`         | Get vacation responder status
`enable-vacation`      | Enable vacation responder
`disable-vacation`     | Disable vacation responder
`forwarding-addresses` | List forwarding addresses
`get-autoforward`      | Get auto-forwarding settings
`enable-autoforward`   | Enable auto-forwarding
`disable-autoforward`  | Disable auto-forwarding
`sendas`               | List send-as aliases
`delegates`            | List/add/remove delegates

## Gmail Search Syntax

Standard Gmail search operators work with `search`, `read`, `threads`,
`batch-modify`, and `batch-delete`:

-   `is:unread`, `is:starred`, `is:important`
-   `from:user@example.com`, `to:user@example.com`
-   `subject:keyword`
-   `after:2024/01/01`, `before:2024/12/31`
-   `has:attachment`
-   `label:LABEL_NAME`
-   `newer_than:1d`, `older_than:1w`

## Global Flags

-   `--json` — output as JSON (works with all read commands)
