---
name: workspace-calendar
description: >-
    View, create, and manage Google Calendar events. Use when listing events,
    checking today's schedule, creating/updating/deleting events, RSVPing,
    checking free/busy, finding conflicts, creating focus time, quick-adding
    events from text, or importing ICS files. Also use when the user shares
    a calendar.google.com URL. Don't use for Google Chat, Gmail, or Tasks.
---

# workspace-calendar

## CLI

The calendar tool is available via the Janus Workspace CLI bundled with the app.

All calendar commands are accessed via the `calendar` subcommand:

```bash
JWS calendar <command> [flags]
```

## Recipes

**View events:**

> [!TIP]
>
> When getting events for a full day (`today` or `--date`), if an executive has
> many meetings, consider using `--max 50` so that late afternoon events aren't
> omitted. Also, use `--json` to ensure long meeting names aren't visually
> truncated in the terminal table output.

```bash
JWS calendar events --max 5
JWS calendar events --date 2024-03-15 --max 50 --json
JWS calendar events --start 2024-03-01T09:00:00Z --end 2024-03-01T17:00:00Z
JWS calendar today --max 50 --json
JWS calendar today --timezone America/Los_Angeles --json
JWS calendar search "standup" --max 10
JWS calendar get EVENT_ID
JWS calendar recurring "Standup" --start 2024-03-01T09:00:00Z --end 2024-03-01T09:30:00Z --rrule "FREQ=WEEKLY;BYDAY=MO,WE,FR"
JWS calendar instances EVENT_ID                  # instances of recurring event
JWS calendar conflicts --days 7                  # find schedule conflicts
```

**Create and modify:**

```bash
JWS calendar create --summary "Team Sync" --start 2025-01-15T10:00:00Z --end 2025-01-15T11:00:00Z --attendee a@g.com --attendee b@g.com
JWS calendar create --summary "Private 1:1" --start 2025-01-15T14:00:00Z --end 2025-01-15T15:00:00Z --visibility private
JWS calendar create --summary "Design Review" --start 2025-01-15T10:00:00Z --end 2025-01-15T11:00:00Z --gvc
JWS calendar quick-add "Lunch at noon tomorrow"
JWS calendar focus-time "Deep Work" --duration 2h
JWS calendar focus-time "Fellowship Proposal" --start 2026-04-22T17:00:00+01:00 --end 2026-04-22T17:25:00+01:00
JWS calendar update EVENT_ID --summary "New Title" --start 2025-01-15T14:00:00Z
JWS calendar update EVENT_ID --description "Flight details and confirmation code"
JWS calendar update EVENT_ID --attendee alice@google.com --attendee bob@google.com
JWS calendar update EVENT_ID --remove-attendee bob@google.com
JWS calendar update EVENT_ID --visibility public
JWS calendar delete EVENT_ID
JWS calendar rsvp EVENT_ID --status accepted     # accepted|declined|tentative
JWS calendar move EVENT_ID --to OTHER_CAL_ID
JWS calendar import-ics /path/to/event.ics --cal primary
```

**Calendar info:**

```bash
JWS calendar calendars                           # list all calendars
JWS calendar colors                              # available colors
JWS calendar acl --cal primary                   # access control list
JWS calendar freebusy --email user@google.com    # check availability
JWS calendar next-free --duration 30m --after 2025-01-15T09:00:00Z
JWS calendar working-hours
```

## Commands

Command         | Description
--------------- | ------------------------
`events`        | List upcoming events
`today`         | Show today's events
`search`        | Search events
`get`           | Get event details
`create`        | Create event
`quick-add`     | Quick-add from text
`focus-time`    | Create focus time event
`update`        | Update event
`delete`        | Delete event
`rsvp`          | RSVP to event
`move`          | Move event to calendar
`import-ics`    | Import ICS file
`instances`     | List recurring instances
`recurring`     | Create recurring event
`conflicts`     | Find conflicting events
`calendars`     | List calendars
`colors`        | List calendar colors
`acl`           | List calendar ACL
`freebusy`      | Check availability
`next-free`     | Find next free slot
`working-hours` | Show working hours

## Global Flags

-   `--json` — output as JSON (works with all read commands)
-   `--timezone` — override timezone (e.g., `America/Los_Angeles`). If not
    specified, the skill auto-detects your timezone from your Google Calendar
    settings.

## Create / Update / Focus-Time Flags

Flag                | Description
------------------- | ----------------------------------------------------
`--summary`         | Event title
`--description`     | Event description (multi-line supported)
`--location`        | Event location
`--start`           | Start time (RFC3339)
`--end`             | End time (RFC3339)
`--duration`        | Duration (e.g. 30m, 1h, 2h) (default `1h`)
`--attendee`        | Attendee email (repeat for multiple)
`--remove-attendee` | Remove attendee (`update` only, repeat for multiple)
`--visibility`      | `default`, `public`, `private`, or `confidential`
`--gvc`             | Add Google Meet video conference
`--modify`          | Allow guests to modify the event
`--send-updates`    | `all`, `externalOnly`, or `none` (default `none`)
`--cal`             | Calendar ID (default `primary`)
