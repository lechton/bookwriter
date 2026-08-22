---
name: workspace-meet
description: >-
    Manage Google Meet spaces and conferences. Use when creating meeting
    links, managing Meet spaces, or checking conference details.
    Don't use for Calendar events (use workspace-calendar instead),
    Gmail, or Drive.
---

# workspace-meet

## CLI

The Meet tool is available via the Janus Workspace CLI bundled with the app:

All Meet commands are accessed via the `meet` subcommand:

```bash
JWS meet <command> [flags]
```

## Recipes

**Manage spaces:**

```bash
JWS meet create                             # create a new meeting space
JWS meet get SPACE_ID                       # get space details
JWS meet get SPACE_ID --json                # JSON output
JWS meet list                               # list active spaces
JWS meet end SPACE_ID                       # end active conference
```

**Conference Records:**

```bash
JWS meet list-conferences
JWS meet list-conferences --max 5
JWS meet list-conferences \
  --filter 'space.name = "spaces/abc"'
JWS meet get-conference conferenceRecords/abc
```

**Participants:**

```bash
JWS meet list-participants CONFERENCE_ID
JWS meet list-participants CONFERENCE_ID --max 10
JWS meet get-participant \
  conferenceRecords/abc/participants/xyz
```

**Recordings & Transcripts:**

```bash
JWS meet list-recordings CONFERENCE_ID
JWS meet get-recording \
  conferenceRecords/abc/recordings/xyz

JWS meet list-transcripts CONFERENCE_ID
JWS meet get-transcript \
  conferenceRecords/abc/transcripts/xyz
JWS meet list-transcript-entries TRANSCRIPT
JWS meet get-transcript-entry TRANSCRIPT/entries/xyz
```

**Transcribe Audio Files:**

Transcribe an audio file using the Gemini API. Requires `GEMINI_API_KEY`.

```bash
JWS meet transcribe recording.ogg
JWS meet transcribe recording.wav --json
JWS meet transcribe recording.ogg --prompt "Summarize this meeting"
JWS meet transcribe recording.ogg --model gemini-2.5-flash
```

Supported formats: WAV, OGG, MP3, FLAC, M4A, WebM.

**WebRTC Listen (Media API):**

Join a meeting via WebRTC and capture audio:

```bash
JWS meet listen SPACE_ID -d 30s -o audio.ogg
```

With real-time transcription (prints transcript to stdout):

```bash
JWS meet listen SPACE_ID --transcribe -d 0 --chunk 10s
JWS meet listen SPACE_ID --transcribe -d 2m | tee transcript.txt
```

Requires adding partner users (or group) to the experiments by joining
`g/rtc-ultron-fishfood`.

### Summarize Takeaways & Action Items

To summarize a meeting's takeaways and action items, follow these steps to
gather context and generate a friendly summary. This process relies on
orchestrating existing commands rather than a dedicated CLI command.

1.  **Gather Context**: Use `JWS calendar get --event_id EVENT_ID` to retrieve
    the event description, attachments, and Meet conference details.
2.  **Read Notes**: If there are attached Google Docs, use `JWS docs read
    DOCUMENT_ID` to read their content.
3.  **Read Transcripts**: Use `JWS meet list-transcripts CONFERENCE_ID` and `JWS
    meet list-transcript-entries TRANSCRIPT_NAME` to retrieve the meeting
    transcript.
4.  **Summarize**: Synthesize the information gathered above and generate a
    summary.

**Tone & Style Guidelines:** - Maintain a **clear, concise, and friendly
tone**. - Extract key **Takeaways** and list specific **Action Items** with
assigned owners where possible. - Use bolding for emphasis and clear section
headers, suitable for Google Chat.

**Example Prompt:** "Please summarize the following meeting context into
Takeaways and Action Items. Maintain a clear, concise, and friendly tone.
Context: [Insert gathered context here]"

## Flags

Flag            | Description
:-------------- | :---------------------------------------------------
`--json`        | Output as JSON (works with all read commands)
`--max N`       | Max results for list commands
`--filter EXPR` | API filter expression
`--access-type` | OPEN, TRUSTED, or RESTRICTED
`--transcribe`  | Enable real-time transcription (listen)
`--chunk`       | Audio chunk duration for transcription (default 10s)
`--prompt`      | Custom prompt for transcription
`--model`       | Gemini model for transcription

## API Reference

Uses the [Google Meet REST API v2][api] and [Gemini API][gemini].

[api]: https://developers.google.com/meet/api/reference/rest
[gemini]: https://ai.google.dev/gemini-api

Required OAuth scopes:

-   `meetings.space.created` — Create and manage spaces
-   `meetings.space.readonly` — Read conference history

Environment variables:

-   `GEMINI_API_KEY` — API key for Gemini transcription
