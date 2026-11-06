// Parser for <chapter>-audio.md: optional front matter, then one entry per block marker.
//   <!-- block p-001 code-001 | src: "first words of p-001" -->
//   spoken text with <breath> and <pause> tags
//   <!-- part -->

const MARKER = /<!--\s*(?:block\s+([^|]+?)\s*\|\s*src:\s*"([^"]*)"|(part))\s*-->/g;

export const ALLOWED_TAGS = new Set(['pause', 'long-pause', 'breath', 'sigh', 'chuckle', 'chuckles', 'exhales']);

/**
 * Entries carry the audio part they belong to: a `<!-- part -->` line starts the next part, and each
 * part is spoken in its own TTS request (one request returns at most about ten minutes of speech).
 */
export function parseAudioMd(source) {
  const meta = {};
  let body = source;
  const fm = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (fm) {
    for (const line of fm[1].split('\n')) {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (m) meta[m[1]] = m[2].trim();
    }
    body = source.slice(fm[0].length);
  }
  const marks = [...body.matchAll(MARKER)];
  const entries = [];
  let part = 1;
  marks.forEach((m, i) => {
    if (m[3]) {
      if (entries.length && entries.at(-1).part === part) part++;
      return;
    }
    const end = i + 1 < marks.length ? marks[i + 1].index : body.length;
    entries.push({
      ids: m[1].split(/\s+/).filter(Boolean),
      src: m[2],
      part,
      spoken: body.slice(m.index + m[0].length, end).trim(),
    });
  });
  return { meta, entries };
}

/** The tags used in a spoken text that the voice does not accept. */
export function unknownTags(spoken) {
  return [...spoken.matchAll(/<([^>]+)>/g)].map((m) => m[1]).filter((t) => !ALLOWED_TAGS.has(t));
}

/** What the forced alignment hears: the spoken text without tags. */
export const plainSpoken = (spoken) => spoken.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
