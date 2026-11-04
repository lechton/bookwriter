import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(PROJECT_ROOT, 'md-lectures');
const OUT_DIR = path.join(PROJECT_ROOT, 'md-lectures-html');

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];

function toRoman(num) {
  return ROMAN[num - 1] || String(num);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderInline(text) {
  let out = escapeHtml(text);
  // Inline code `...`
  out = out.replace(/`([^`]+)`/g, '<code class="font-mono-code text-[0.88em] px-1.5 py-0.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-hairline)]">$1</code>');
  // Bold + italic ***...***
  out = out.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  // Bold **...**
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic *...*
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Links [label](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="classic-link">$1</a>');
  return out;
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Algorithmically parses a markdown lecture file into:
 * - title (H1)
 * - narrative sections (H2 numbered sections)
 * - foundational case blocks (H2 starting with ❒)
 */
function parseMarkdownLecture(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let documentTitle = 'UK Tort Law';
  const sections = [];
  const cases = [];

  let currentSection = null;
  let currentCase = null;
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // H1 Title
    if (trimmed.startsWith('# ')) {
      documentTitle = trimmed.slice(2).trim();
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      i++;
      continue;
    }

    // H2 Case header: ## ❒ Case Name (Year)
    if (trimmed.startsWith('## ❒')) {
      currentSection = null;
      const fullHeading = trimmed.replace(/^##\s*❒\s*/, '').trim();
      const yearMatch = fullHeading.match(/^(.*)\((\d{4})\)\s*$/);
      const caseName = yearMatch ? yearMatch[1].trim() : fullHeading;
      const year = yearMatch ? yearMatch[2] : '';
      currentCase = {
        index: cases.length + 1,
        id: 'case-' + slugify(fullHeading),
        fullHeading,
        caseName,
        year,
        facts: '',
        image: null,
        bullets: []
      };
      cases.push(currentCase);
      i++;
      continue;
    }

    // H2 Narrative Section: ## N. Title
    if (trimmed.startsWith('## ')) {
      currentCase = null;
      const rawHeading = trimmed.slice(3).trim();
      const numMatch = rawHeading.match(/^(\d+)\.\s+(.*)$/);
      const num = numMatch ? parseInt(numMatch[1], 10) : sections.length + 1;
      const cleanTitle = numMatch ? numMatch[2].trim() : rawHeading;
      const shortNavTitle = cleanTitle.includes(':') ? cleanTitle.split(':')[0].trim() : cleanTitle;
      currentSection = {
        num,
        roman: toRoman(num),
        id: `section-${num}`,
        rawHeading,
        cleanTitle,
        shortNavTitle,
        subs: [],
        blocks: []
      };
      sections.push(currentSection);
      i++;
      continue;
    }

    // Inside a Case Card
    if (currentCase) {
      if (trimmed.startsWith('>')) {
        const quoteLines = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
          i++;
        }
        currentCase.facts = quoteLines.join(' ');
        continue;
      }
      const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imgMatch) {
        currentCase.image = {
          alt: imgMatch[1].trim(),
          src: imgMatch[2].trim()
        };
        i++;
        continue;
      }
      if (trimmed.startsWith('- ')) {
        currentCase.bullets.push(trimmed.slice(2).trim());
        i++;
        continue;
      }
    }

    // Inside a Narrative Section
    if (currentSection) {
      // H3 Subtitle
      if (trimmed.startsWith('### ')) {
        const subText = trimmed.slice(4).trim();
        const subId = `${currentSection.id}-${currentSection.subs.length + 1}`;
        currentSection.subs.push({ id: subId, text: subText });
        currentSection.blocks.push({
          type: 'h3',
          id: subId,
          text: subText
        });
        i++;
        continue;
      }

      // Standalone Markdown Image: ![alt](src)
      const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imgMatch) {
        currentSection.blocks.push({
          type: 'image',
          alt: imgMatch[1].trim(),
          src: imgMatch[2].trim()
        });
        i++;
        continue;
      }

      // Blockquote (> ...)
      if (trimmed.startsWith('>')) {
        const quoteLines = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
          i++;
        }
        currentSection.blocks.push({
          type: 'blockquote',
          text: quoteLines.join(' ')
        });
        continue;
      }

      // Markdown Table (| ... |)
      if (trimmed.startsWith('|')) {
        const tableLines = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i].trim());
          i++;
        }
        const parseCells = (row) =>
          row
            .replace(/^\|/, '')
            .replace(/\|$/, '')
            .split(/(?<!\\)\|/)
            .map((c) => c.replace(/\\\|/g, '|').trim());

        const headers = tableLines.length > 0 ? parseCells(tableLines[0]) : [];
        const rows = tableLines
          .slice(2)
          .filter((r) => r.includes('|'))
          .map(parseCells);

        currentSection.blocks.push({
          type: 'table',
          headers,
          rows
        });
        continue;
      }

      // Unordered List (- ...)
      if (trimmed.startsWith('- ')) {
        const items = [];
        while (i < lines.length && lines[i].trim().startsWith('- ')) {
          items.push(lines[i].trim().slice(2).trim());
          i++;
        }
        currentSection.blocks.push({
          type: 'ul',
          items
        });
        continue;
      }

      // Ordered List (1. ...)
      if (/^\d+\.\s+/.test(trimmed)) {
        const items = [];
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          items.push(lines[i].trim().replace(/^\d+\.\s+/, '').trim());
          i++;
        }
        currentSection.blocks.push({
          type: 'ol',
          items
        });
        continue;
      }

      // Paragraph
      const paraLines = [];
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !lines[i].trim().startsWith('#') &&
        !lines[i].trim().startsWith('>') &&
        !lines[i].trim().startsWith('|') &&
        !lines[i].trim().startsWith('- ') &&
        !/^!\[([^\]]*)\]\(([^)]+)\)$/.test(lines[i].trim()) &&
        !/^\d+\.\s+/.test(lines[i].trim()) &&
        !/^---+$/.test(lines[i].trim())
      ) {
        paraLines.push(lines[i].trim());
        i++;
      }
      if (paraLines.length > 0) {
        currentSection.blocks.push({
          type: 'p',
          text: paraLines.join(' ')
        });
        continue;
      }
    }

    i++;
  }

  return { documentTitle, sections, cases };
}

function renderBlock(block) {
  switch (block.type) {
    case 'h3':
      return `<h3 id="${block.id}" class="leading-q scroll-mt-24">${renderInline(block.text)}</h3>`;

    case 'p':
      return `<p class="prose-p">${renderInline(block.text)}</p>`;

    case 'image':
      return `
                    <figure class="my-8 rounded-xl overflow-hidden border border-[var(--tyrian-border)] bg-[var(--bg-surface)] shadow-md">
                        <img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}" loading="lazy" class="w-full h-auto block" />
                        ${
                          block.alt
                            ? `<figcaption class="px-5 py-3.5 text-[0.86em] leading-snug text-[var(--text-secondary)] bg-[var(--bg-subtle)] border-t border-[var(--border-hairline)] font-ui">
                            <span class="font-bold uppercase tracking-wider text-[11px] text-[#66023c] dark:text-[#c83289] mr-2">Case Illustration •</span>${renderInline(block.alt)}
                        </figcaption>`
                            : ''
                        }
                    </figure>`;

    case 'blockquote': {
      // Check if it begins with **Label:**
      const labelMatch = block.text.match(/^\*\*([^*]+?):\*\*\s*(.*)$/);
      const badgeLabel = labelMatch ? labelMatch[1] : 'Editorial Note';
      const bodyText = labelMatch ? labelMatch[2] : block.text;
      return `
                    <blockquote class="aristotle-card">
                        <div class="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[var(--tyrian-border)]">
                            <span class="font-ui text-[11px] font-bold uppercase tracking-widest text-[#66023c] dark:text-[#c83289]">
                                ${escapeHtml(badgeLabel)} • Lex Stemma Pedagogy
                            </span>
                        </div>
                        <p class="mb-0 text-[var(--text-primary)]">
                            ${renderInline(bodyText)}
                        </p>
                    </blockquote>`;
    }

    case 'ul': {
      const itemsHtml = block.items
        .map(
          (item) => `
                        <li class="discipline-card">
                            ${renderInline(item)}
                        </li>`
        )
        .join('');
      const cols = block.items.length === 2 || block.items.length === 4 ? 'md:grid-cols-2' : 'md:grid-cols-1';
      return `
                    <ul class="grid grid-cols-1 ${cols} gap-4 my-6 list-none pl-0">${itemsHtml}
                    </ul>`;
    }

    case 'ol': {
      const itemsHtml = block.items
        .map(
          (item, idx) => `
                        <li class="discipline-card flex items-start gap-3.5">
                            <span class="font-ui text-xs font-bold px-2.5 py-1 rounded-full bg-[#66023c] text-white shrink-0 mt-1">${idx + 1}</span>
                            <div>${renderInline(item)}</div>
                        </li>`
        )
        .join('');
      const cols = block.items.length === 2 || block.items.length === 4 ? 'md:grid-cols-2' : 'md:grid-cols-1';
      return `
                    <ol class="grid grid-cols-1 ${cols} gap-4 my-6 list-none pl-0">${itemsHtml}
                    </ol>`;
    }

    case 'table': {
      const ths = block.headers
        .map(
          (h) =>
            `<th class="font-ui text-xs font-bold uppercase tracking-wider text-left py-3.5 px-4 bg-[var(--tyrian-tint-strong)] text-[#66023c] dark:text-[#c83289] border-b border-[var(--tyrian-border)]">${renderInline(h)}</th>`
        )
        .join('');
      const trs = block.rows
        .map((row) => {
          const tds = row
            .map(
              (cell) =>
                `<td class="py-3.5 px-4 align-top border-b border-[var(--border-hairline)] text-[0.92em] leading-relaxed">${renderInline(cell)}</td>`
            )
            .join('');
          return `<tr class="hover:bg-[var(--tyrian-tint)] transition-colors">${tds}</tr>`;
        })
        .join('');
      return `
                    <div class="my-8 overflow-x-auto rounded-xl border border-[var(--tyrian-border)] bg-[var(--bg-surface)] shadow-sm">
                        <table class="w-full border-collapse">
                            <thead>
                                <tr>${ths}</tr>
                            </thead>
                            <tbody>${trs}</tbody>
                        </table>
                    </div>`;
    }

    default:
      return '';
  }
}

function renderCaseCard(caseItem) {
  const factsClean = caseItem.facts.replace(/^\*\*Facts:\*\*\s*/i, '');
  let equationBullet = '';
  let decisionBullet = null;
  let liabilityBullet = null;
  const principleBullets = [];

  for (const b of caseItem.bullets) {
    if (b.startsWith('**Decision**:')) {
      decisionBullet = b.replace(/^\*\*Decision\*\*:\s*/, '').trim();
    } else if (b.startsWith('**Liability**:')) {
      liabilityBullet = b.replace(/^\*\*Liability\*\*:\s*/, '').trim();
    } else if (!equationBullet && b.includes(' + ') && b.includes(':')) {
      equationBullet = b;
    } else {
      principleBullets.push(b);
    }
  }

  const renderVerdictBox = (label, raw) => {
    if (!raw) return '';
    const isYes = raw.includes('✔️');
    const isMixed = raw.includes('✔️') && raw.includes('✖️');
    const badgeClass = isMixed
      ? 'bg-amber-600/15 text-amber-800 dark:text-amber-300 border border-amber-600/30'
      : isYes
        ? 'bg-emerald-700/15 text-emerald-800 dark:text-emerald-300 border border-emerald-700/30'
        : 'bg-[#66023c]/12 text-[#66023c] dark:text-[#c83289] border border-[#66023c]/30';
    return `
                            <div class="discipline-card !p-4">
                                <div class="flex items-center justify-between gap-2 mb-2">
                                    <span class="font-ui text-[11px] font-bold uppercase tracking-widest text-[var(--text-secondary)]">${escapeHtml(label)}</span>
                                    <span class="font-ui text-[11px] font-bold px-2 py-0.5 rounded ${badgeClass}">${isMixed ? 'QUALIFIED' : isYes ? 'AFFIRMATIVE' : 'NEGATIVE'}</span>
                                </div>
                                <p class="mb-0 text-[0.92em] leading-snug">${renderInline(raw)}</p>
                            </div>`;
  };

  const principlesHtml = principleBullets
    .map((p) => {
      const m = p.match(/^\*\*([^*]+)\*\*:\s*(.*)$/);
      if (m) {
        return `
                            <li class="py-2.5 border-b border-[var(--border-hairline)] last:border-b-0">
                                <span class="font-ui text-xs font-bold uppercase tracking-wider text-[#66023c] dark:text-[#c83289] mr-2">${escapeHtml(m[1])}:</span>
                                <span>${renderInline(m[2])}</span>
                            </li>`;
      }
      return `<li class="py-2.5 border-b border-[var(--border-hairline)] last:border-b-0">${renderInline(p)}</li>`;
    })
    .join('');

  const paddedNum = String(caseItem.index).padStart(2, '0');

  return `
                    <!-- Case Card ${paddedNum}: ${escapeHtml(caseItem.fullHeading)} -->
                    <article id="${caseItem.id}" class="qa-card scroll-mt-24">
                        <div class="qa-question flex flex-wrap items-baseline justify-between gap-3">
                            <div class="flex items-center gap-2.5 flex-wrap">
                                <span class="qa-badge qa-badge-q">Case ${paddedNum}</span>
                                <h3 class="text-xl sm:text-2xl font-bold m-0">
                                    ❒ ${escapeHtml(caseItem.caseName)} <span class="text-[#66023c] dark:text-[#c83289] font-normal">(${escapeHtml(caseItem.year)})</span>
                                </h3>
                            </div>
                            <a href="#${caseItem.id}" class="classic-link font-ui text-xs font-semibold no-print shrink-0" title="Direct link to ${escapeHtml(caseItem.fullHeading)}">#${paddedNum}</a>
                        </div>

                        <div class="qa-answer space-y-5">
                            ${
                              caseItem.image
                                ? `<!-- Case Illustration -->
                            <figure class="my-0 rounded-xl overflow-hidden border border-[var(--tyrian-border)] bg-[var(--bg-surface)] shadow-sm">
                                <img src="${escapeHtml(caseItem.image.src)}" alt="${escapeHtml(caseItem.image.alt)}" loading="lazy" class="w-full h-auto block" />
                                ${
                                  caseItem.image.alt
                                    ? `<figcaption class="px-4 py-2.5 text-[0.84em] leading-snug text-[var(--text-secondary)] bg-[var(--bg-subtle)] border-t border-[var(--border-hairline)] font-ui">
                                    <span class="font-bold uppercase tracking-wider text-[10px] text-[#66023c] dark:text-[#c83289] mr-1.5">Visual Digest •</span>${renderInline(caseItem.image.alt)}
                                </figcaption>`
                                    : ''
                                }
                            </figure>`
                                : ''
                            }
                            <!-- Facts Box -->
                            <div class="aristotle-card !my-0 !py-4 !px-5">
                                <div class="flex items-center justify-between gap-2 mb-1.5">
                                    <span class="font-ui text-[11px] font-bold uppercase tracking-widest text-[#66023c] dark:text-[#c83289]">
                                        Material Facts
                                    </span>
                                </div>
                                <p class="mb-0 text-[0.95em] leading-relaxed">
                                    ${renderInline(factsClean)}
                                </p>
                            </div>

                            <!-- Dialectic Conflict Equation -->
                            ${
                              equationBullet
                                ? `<div class="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-hairline)]">
                                <p class="mb-0 text-[0.95em] leading-relaxed">
                                    <span class="qa-badge qa-badge-a">Issue</span>
                                    ${renderInline(equationBullet)}
                                </p>
                            </div>`
                                : ''
                            }

                            <!-- Decision & Liability Grid -->
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                ${renderVerdictBox('Decision', decisionBullet)}
                                ${renderVerdictBox('Liability', liabilityBullet)}
                            </div>

                            <!-- Legal Principles & Ratio -->
                            <ul class="list-none pl-0 m-0 pt-1 text-[0.95em]">
                                ${principlesHtml}
                            </ul>
                        </div>
                    </article>`;
}

function buildHtmlDocument({ documentTitle, sections, cases }) {
  // Split main title at first colon if present for styling like LEX STEMMA: Subtitle
  const colonIdx = documentTitle.indexOf(':');
  const titleMain = colonIdx !== -1 ? documentTitle.slice(0, colonIdx).trim() : documentTitle;
  const titleSub = colonIdx !== -1 ? documentTitle.slice(colonIdx + 1).trim() : '';

  const navPillsHtml = sections
    .map(
      (sec) => `
                    <a href="#${sec.id}" class="section-pill">
                        <span class="numeral">${sec.roman}</span>
                        <span>${escapeHtml(sec.shortNavTitle)}</span>
                    </a>`
    )
    .join('');

  const caseJumpPillsHtml = cases
    .map(
      (c) => `
                    <a href="#${c.id}" class="font-ui text-xs font-semibold px-2.5 py-1 rounded-md border border-[var(--border-hairline)] bg-[var(--bg-surface)] hover:border-[#66023c] hover:text-[#66023c] transition-colors">
                        <span class="text-[#66023c] dark:text-[#c83289] font-bold mr-1">${String(c.index).padStart(2, '0')}</span>${escapeHtml(c.caseName)} (${escapeHtml(c.year)})
                    </a>`
    )
    .join('');

  const plainText = (s) =>
    s
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\*+|`/g, '')
      .trim();

  const tocHtml = sections
    .map((sec, idx) => {
      const isCasesSection = idx === sections.length - 1 && cases.length > 0;
      const subs = sec.subs.map((s) => ({ id: s.id, label: plainText(s.text), num: '' }));
      if (isCasesSection) {
        for (const c of cases) {
          subs.push({ id: c.id, label: `${c.caseName} (${c.year})`, num: String(c.index).padStart(2, '0') });
        }
      }
      const subsHtml = subs.length
        ? `
                            <div class="toc-sub-wrap">
                                <ol class="toc-sub">${subs
                                  .map(
                                    (s) => `
                                    <li><a href="#${s.id}" class="toc-sublink" data-toc-link="${s.id}" data-toc-section="${sec.id}" title="${escapeHtml(s.label)}">${s.num ? `<span class="toc-subnum">${s.num}</span>` : ''}<span class="toc-subtext">${escapeHtml(s.label)}</span></a></li>`
                                  )
                                  .join('')}
                                </ol>
                            </div>`
        : '';
      return `
                        <li class="toc-item" data-toc-item="${sec.id}">
                            <a href="#${sec.id}" class="toc-link" data-toc-link="${sec.id}" data-toc-section="${sec.id}" title="${escapeHtml(sec.cleanTitle)}">
                                <span class="toc-num">${sec.roman}</span>
                                <span class="toc-title">${escapeHtml(sec.shortNavTitle)}</span>
                            </a>${subsHtml}
                        </li>`;
    })
    .join('');

  const sectionsHtml = sections
    .map((sec, idx) => {
      const blocksHtml = sec.blocks.map(renderBlock).join('\n');
      const isCasesSection = idx === sections.length - 1 && cases.length > 0;
      const casesHtml = isCasesSection
        ? `
                    <!-- Quick Jump Index for the 20 Cases -->
                    <div class="no-print my-6 p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-hairline)]">
                        <div class="font-ui text-[11px] font-bold uppercase tracking-widest text-[#66023c] dark:text-[#c83289] mb-2.5">
                            Chronological Case Index (1765–2018)
                        </div>
                        <div class="flex flex-wrap gap-1.5">
                            ${caseJumpPillsHtml}
                        </div>
                    </div>
                    ${cases.map(renderCaseCard).join('\n')}`
        : '';

      const dividerHtml =
        idx < sections.length - 1
          ? `
                <!-- Byzantine Ornamental Divider -->
                <div class="imperial-divider" role="separator">
                    <span class="imperial-diamond"></span>
                </div>`
          : '';

      return `
                <!-- SECTION ${sec.roman} -->
                <section id="${sec.id}" class="scroll-mt-24">
                    <div class="flex items-baseline justify-between gap-4 mb-6">
                        <h2 class="text-2xl sm:text-3xl md:text-[2.1rem] font-bold">
                            <span class="text-[#66023c] dark:text-[#c83289] mr-2">${sec.roman}.</span>${escapeHtml(sec.cleanTitle)}
                        </h2>
                        <a href="#${sec.id}" class="classic-link font-ui text-xs font-semibold no-print shrink-0" title="Direct link to Section ${sec.roman}">§ ${sec.roman}</a>
                    </div>
${blocksHtml}
${casesHtml}
                </section>
${dividerHtml}`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(documentTitle)} — lex.uk.com</title>

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Google Fonts: Literata, Newsreader, Inter & IBM Plex Mono (River v2 Typography) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Literata:ital,opsz,wght@0,7..72,400..700;1,7..72,400..700&family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&display=swap" rel="stylesheet">

    <style>
        :root,
        [data-theme="light"] {
            --bg-canvas: #FAF8F5;
            --bg-surface: #FFFFFF;
            --bg-subtle: #F4EFEA;
            --bg-glass: rgba(250, 248, 245, 0.88);
            --text-primary: #1c1a17;
            --text-body: #2a2723;
            --text-secondary: #5A5258;
            --text-muted: #7A7077;
            --tyrian-purple: #66023c;
            --tyrian-hover: #4d012d;
            --tyrian-light: #82054e;
            --tyrian-tint: rgba(102, 2, 60, 0.045);
            --tyrian-tint-strong: rgba(102, 2, 60, 0.09);
            --tyrian-border: rgba(102, 2, 60, 0.16);
            --tyrian-border-strong: rgba(102, 2, 60, 0.32);
            --border-hairline: #E6E0D6;
            --link-blue: #002FA7;
            --link-blue-classic: #0033CC;
            --link-hover: #001858;
            --link-visited: #4B2E83;
            --card-shadow: 0 4px 20px -2px rgba(102, 2, 60, 0.06), 0 1px 3px -1px rgba(20, 19, 22, 0.04);
            --pill-shadow: 0 1px 2px rgba(20, 19, 22, 0.06);
            --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            --font-body: "Literata", "Iowan Old Style", "Charter", Georgia, serif;
            --font-serif: "Literata", "Newsreader", "Iowan Old Style", "Charter", "Palatino Linotype", "Book Antiqua", Georgia, serif;
            --font-mono: "IBM Plex Mono", "JetBrains Mono", "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
            --base-font-size: 18.5px;
        }

        [data-theme="dark"] {
            --bg-canvas: #110E12;
            --bg-surface: #1A151C;
            --bg-subtle: #231C26;
            --bg-glass: rgba(17, 14, 18, 0.88);
            --text-primary: #EFECE6;
            --text-body: #E5E0D8;
            --text-secondary: #B8AEB6;
            --text-muted: #8E828B;
            --tyrian-purple: #9e1b68;
            --tyrian-hover: #b8237a;
            --tyrian-light: #c83289;
            --tyrian-tint: rgba(158, 27, 104, 0.11);
            --tyrian-tint-strong: rgba(158, 27, 104, 0.2);
            --tyrian-border: rgba(158, 27, 104, 0.28);
            --tyrian-border-strong: rgba(158, 27, 104, 0.5);
            --border-hairline: #2D2430;
            --link-blue: #6B9EFF;
            --link-blue-classic: #7AA7FF;
            --link-hover: #9EC0FF;
            --link-visited: #B592FF;
            --card-shadow: 0 8px 28px -4px rgba(0, 0, 0, 0.45);
            --pill-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        body {
            background-color: var(--bg-canvas);
            color: var(--text-primary);
            font-family: var(--font-body);
            font-size: var(--base-font-size);
            line-height: 1.76;
            font-optical-sizing: auto;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
            transition: background-color 0.25s ease, color 0.25s ease, font-size 0.18s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .font-ui {
            font-family: var(--font-sans);
            letter-spacing: 0.01em;
        }

        .font-mono-code {
            font-family: var(--font-mono);
        }

        a.classic-link {
            color: var(--link-blue);
            text-decoration: underline;
            text-underline-offset: 4px;
            text-decoration-thickness: 1.5px;
            transition: color 0.15s ease, background-color 0.15s ease, text-decoration-color 0.15s ease;
            border-radius: 3px;
            padding: 0 2px;
            margin: 0 -2px;
        }

        a.classic-link:visited {
            color: var(--link-visited);
        }

        a.classic-link:hover {
            color: var(--link-hover);
            background-color: rgba(0, 47, 167, 0.08);
            text-decoration-thickness: 2px;
        }

        .sticky-header {
            background-color: var(--bg-glass);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border-bottom: 1px solid var(--border-hairline);
        }

        #progress-track {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background-color: var(--tyrian-tint-strong);
            z-index: 100;
            pointer-events: none;
        }

        #progress-bar {
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, #66023c 0%, #8e0a3f 55%, #b3122f 100%);
            box-shadow: 0 1px 6px rgba(102, 2, 60, 0.35);
            transform: scaleX(0);
            transform-origin: 0 50%;
            will-change: transform;
        }
        .btn-modern {
            font-family: var(--font-sans);
            font-size: 13px;
            font-weight: 600;
            line-height: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            padding: 0.5rem 0.9rem;
            border-radius: 9999px;
            border: 1px solid var(--tyrian-border);
            background-color: var(--bg-surface);
            color: var(--text-primary);
            box-shadow: var(--pill-shadow);
            transition: all 0.18s cubic-bezier(0.22, 1, 0.36, 1);
            cursor: pointer;
            user-select: none;
            text-decoration: none;
        }

        .btn-modern:hover {
            border-color: var(--tyrian-purple);
            background-color: var(--tyrian-tint);
            color: var(--tyrian-purple);
            transform: translateY(-1px);
        }

        .btn-modern:active {
            transform: translateY(0);
        }

        .btn-tyrian {
            background-color: #66023c;
            color: #FFFFFF;
            border-color: #66023c;
            box-shadow: 0 2px 8px rgba(102, 2, 60, 0.25);
        }

        .btn-tyrian:hover {
            background-color: #4d012d;
            border-color: #4d012d;
            color: #FFFFFF;
            box-shadow: 0 4px 12px rgba(102, 2, 60, 0.35);
        }

        .segmented-group {
            display: inline-flex;
            align-items: center;
            background-color: var(--bg-subtle);
            padding: 3px;
            border-radius: 9999px;
            border: 1px solid var(--border-hairline);
        }

        .segmented-btn {
            font-family: var(--font-sans);
            font-size: 12px;
            font-weight: 600;
            padding: 0.32rem 0.65rem;
            border-radius: 9999px;
            color: var(--text-secondary);
            background: transparent;
            border: none;
            cursor: pointer;
            transition: all 0.16s ease;
            line-height: 1;
        }

        .segmented-btn:hover {
            color: var(--text-primary);
        }

        .segmented-btn.active {
            background-color: #66023c;
            color: #FFFFFF;
            box-shadow: 0 1px 4px rgba(102, 2, 60, 0.35);
        }

        .section-pill {
            font-family: var(--font-sans);
            font-size: 13px;
            font-weight: 600;
            padding: 0.5rem 0.95rem;
            border-radius: 9999px;
            border: 1px solid var(--tyrian-border);
            background-color: var(--bg-surface);
            color: var(--text-secondary);
            transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            box-shadow: var(--pill-shadow);
        }

        .section-pill:hover {
            border-color: var(--tyrian-purple);
            color: var(--tyrian-purple);
            background-color: var(--tyrian-tint);
            transform: translateY(-1px);
        }

        .section-pill .numeral {
            font-family: var(--font-mono);
            color: var(--tyrian-purple);
            font-weight: 700;
            font-size: 11px;
            letter-spacing: 0.06em;
            padding: 2px 6px;
            border-radius: 999px;
            background-color: var(--tyrian-tint-strong);
        }

        .chapter-shell {
            max-width: 1320px;
            margin-left: auto;
            margin-right: auto;
        }

        .toc {
            display: none;
        }

        @media (min-width: 1024px) {
            .chapter-grid {
                display: grid;
                grid-template-columns: minmax(0, 1fr) minmax(0, 3fr);
                gap: 3.5rem;
            }

            .toc {
                display: block;
            }
        }

        .toc-inner {
            position: sticky;
            top: 6rem;
            max-height: calc(100vh - 7.5rem);
            overflow-y: auto;
            padding: 0.25rem 0.5rem 1.5rem 0;
            scrollbar-width: thin;
            scrollbar-color: var(--tyrian-border) transparent;
        }

        .toc-head {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 0.75rem;
            padding: 0 0.25rem 0.9rem 0.9rem;
            font-family: var(--font-sans);
        }

        .toc-label {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: var(--tyrian-purple);
        }

        .toc-percent {
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 600;
            color: var(--text-muted);
        }

        .toc-list,
        .toc-sub {
            list-style: none;
            margin: 0;
        }

        .toc-list {
            padding: 0;
            border-left: 1px solid var(--border-hairline);
        }

        .toc-link {
            display: flex;
            align-items: flex-start;
            gap: 0.65rem;
            margin-left: -1px;
            padding: 0.55rem 0.75rem 0.55rem 0.9rem;
            border-left: 2px solid transparent;
            border-radius: 0 8px 8px 0;
            font-family: var(--font-sans);
            font-size: 13.5px;
            font-weight: 600;
            line-height: 1.38;
            color: var(--text-secondary);
            text-decoration: none;
            transition: color 0.18s ease, background-color 0.18s ease, border-color 0.18s ease;
        }

        .toc-link:hover {
            color: var(--text-primary);
            background-color: var(--tyrian-tint);
        }

        .toc-num {
            flex-shrink: 0;
            min-width: 2.1rem;
            margin-top: 1px;
            padding: 2px 0;
            border-radius: 999px;
            text-align: center;
            font-family: var(--font-mono);
            font-size: 10.5px;
            font-weight: 700;
            letter-spacing: 0.04em;
            color: var(--tyrian-purple);
            background-color: var(--tyrian-tint-strong);
            transition: background-color 0.18s ease, color 0.18s ease;
        }

        .toc-item.active > .toc-link {
            color: var(--tyrian-purple);
            background-color: var(--tyrian-tint);
            border-left-color: #66023c;
        }

        .toc-item.active .toc-num {
            background-color: #66023c;
            color: #FFFFFF;
        }

        .toc-sub-wrap {
            display: grid;
            grid-template-rows: 0fr;
            transition: grid-template-rows 0.32s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .toc-item.active .toc-sub-wrap {
            grid-template-rows: 1fr;
        }

        .toc-sub {
            min-height: 0;
            overflow: hidden;
            padding: 0 0 0 2.75rem;
        }

        .toc-sub > li:first-child {
            margin-top: 0.3rem;
        }

        .toc-sub > li:last-child {
            margin-bottom: 0.6rem;
        }

        .toc-sublink {
            display: flex;
            align-items: flex-start;
            gap: 0.45rem;
            padding: 0.32rem 0.6rem 0.32rem 0.75rem;
            box-shadow: inset 1px 0 0 var(--border-hairline);
            font-family: var(--font-sans);
            font-size: 12.5px;
            line-height: 1.42;
            color: var(--text-muted);
            text-decoration: none;
            transition: color 0.18s ease, box-shadow 0.18s ease;
        }

        .toc-sublink:hover {
            color: var(--text-primary);
        }

        .toc-sublink.active {
            color: var(--tyrian-purple);
            font-weight: 600;
            box-shadow: inset 2px 0 0 #66023c;
        }

        .toc-subnum {
            flex-shrink: 0;
            font-family: var(--font-mono);
            font-size: 10.5px;
            font-weight: 700;
            padding-top: 1px;
            color: var(--tyrian-purple);
        }

        .toc-subtext {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        [data-theme="dark"] .toc-item.active > .toc-link,
        [data-theme="dark"] .toc-sublink.active,
        [data-theme="dark"] .toc-label,
        [data-theme="dark"] .toc-num,
        [data-theme="dark"] .toc-subnum {
            color: var(--tyrian-light);
        }

        [data-theme="dark"] .toc-item.active .toc-num {
            color: #FFFFFF;
            background-color: var(--tyrian-purple);
        }

        .toc-foot {
            margin: 1rem 0 0 0.9rem;
            font-family: var(--font-sans);
            font-size: 12px;
            font-weight: 600;
        }
        /* River v2 Typography & Spacing System */
        p,
        .prose-p {
            font-family: var(--font-body);
            font-size: var(--base-font-size);
            line-height: 1.7;
            margin: 0 0 18px;
            color: var(--text-body);
            font-optical-sizing: auto;
        }

        h1, h2, h3 {
            font-family: var(--font-serif);
            color: var(--text-primary);
            font-optical-sizing: auto;
        }

        h1 {
            font-size: 40px;
            line-height: 1.13;
            letter-spacing: -0.02em;
            font-weight: 600;
        }

        h2 {
            font-size: 30px;
            line-height: 1.22;
            letter-spacing: -0.016em;
            font-weight: 600;
        }

        h3.leading-q {
            font-family: var(--font-serif);
            font-size: 23px;
            line-height: 1.34;
            letter-spacing: -0.012em;
            color: var(--text-primary);
            font-weight: 600;
            margin: 46px 0 14px;
            padding-top: 12px;
            position: relative;
        }

        h3.leading-q::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 28px;
            height: 2.5px;
            background: var(--tyrian-purple);
            border-radius: 1px;
        }

        strong {
            color: var(--text-primary);
            font-weight: 650;
        }

        .aristotle-card {
            position: relative;
            background: linear-gradient(135deg, var(--tyrian-tint) 0%, var(--bg-surface) 100%);
            border: 1px solid var(--tyrian-border);
            border-left: 4px solid #66023c;
            border-radius: 12px;
            padding: 20px 24px;
            margin: 28px 0 36px;
            box-shadow: var(--card-shadow);
        }

        .discipline-card {
            background-color: var(--bg-surface);
            border: 1px solid var(--border-hairline);
            border-top: 3px solid #66023c;
            border-radius: 10px;
            padding: 1.25rem 1.4rem;
            box-shadow: var(--card-shadow);
            transition: transform 0.2s ease, border-color 0.2s ease;
            line-height: 1.7;
        }

        .discipline-card:hover {
            transform: translateY(-2px);
            border-color: var(--tyrian-border-strong);
        }

        .qa-card {
            background-color: var(--bg-surface);
            border: 1px solid var(--tyrian-border);
            border-radius: 12px;
            margin: 2.2rem 0;
            overflow: hidden;
            box-shadow: var(--card-shadow);
        }

        .qa-question {
            background-color: var(--tyrian-tint);
            border-bottom: 1px solid var(--tyrian-border);
            padding: 1.15rem 1.5rem;
        }

        .qa-answer {
            padding: 1.4rem 1.5rem;
        }

        .qa-badge {
            font-family: var(--font-mono);
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            padding: 0.22rem 0.6rem;
            border-radius: 6px;
            display: inline-block;
            margin-right: 0.5rem;
            vertical-align: middle;
        }

        .qa-badge-q {
            background-color: #66023c;
            color: #FFFFFF;
        }

        .qa-badge-a {
            background-color: rgba(0, 47, 167, 0.12);
            color: var(--link-blue);
            border: 1px solid rgba(0, 47, 167, 0.25);
        }

        .imperial-divider {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 3.5rem 0;
            gap: 1rem;
        }

        .imperial-divider::before,
        .imperial-divider::after {
            content: "";
            flex: 1;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--tyrian-border-strong), transparent);
        }

        .imperial-diamond {
            width: 8px;
            height: 8px;
            background-color: #66023c;
            transform: rotate(45deg);
            display: inline-block;
            box-shadow: 0 0 0 4px var(--tyrian-tint);
        }

        @media print {
            body {
                background-color: #FFFFFF !important;
                color: #000000 !important;
                font-size: 12pt !important;
            }
            .no-print {
                display: none !important;
            }
            .chapter-grid {
                display: block !important;
            }
            .qa-card, .aristotle-card, .discipline-card {
                box-shadow: none !important;
                break-inside: avoid;
            }
        }
    </style>
</head>
<body id="top" class="min-h-screen selection:bg-[#66023c]/15 selection:text-[#66023c]">

    <!-- Top Viewport Reading Progress Bar -->
    <div id="progress-track" class="no-print" role="progressbar" aria-label="Reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
        <div id="progress-bar"></div>
    </div>

    <!-- Sticky Glassmorphic Top Navbar -->
    <header class="sticky-header sticky top-0 z-50 px-5 sm:px-8 lg:px-10 pt-4 pb-3 transition-colors">
        <div class="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-3">

            <!-- Left Brand Lockup -->
            <div class="flex items-center gap-3">
                <a href="#top" class="inline-flex items-center gap-2.5 group focus:outline-none">
                    <span class="font-ui text-xs font-bold tracking-widest uppercase px-2.5 py-1.5 rounded-md bg-[#66023c] text-white shadow-sm group-hover:bg-[#4d012d] transition-colors">
                        LEX.UK.COM
                    </span>
                    <span class="hidden sm:inline-block font-semibold text-base tracking-tight text-[var(--text-primary)]">
                        UK TORT LAW • CHAPTER I
                    </span>
                </a>
            </div>

            <!-- Right Modern Developer Controls -->
            <div class="no-print flex items-center gap-2 sm:gap-2.5" aria-label="Reading & Display Controls">

                <!-- Segmented Typography Zoom Controls -->
                <div class="segmented-group" role="group" aria-label="Font size controls">
                    <button type="button" onclick="setZoom('small')" id="zoom-small" class="segmented-btn" title="Compact Literata Serif (16.5px)">
                        A−
                    </button>
                    <button type="button" onclick="setZoom('default')" id="zoom-default" class="segmented-btn active" title="Default River v2 Literata Serif (18.5px)">
                        100%
                    </button>
                    <button type="button" onclick="setZoom('large')" id="zoom-large" class="segmented-btn" title="Large Literata Serif (21px)">
                        A+
                    </button>
                </div>

                <!-- Modern Cite / Print Button -->
                <button type="button" onclick="toggleCiteBox()" class="btn-modern" title="Cite or Print Chapter">
                    <svg class="w-3.5 h-3.5 text-[#66023c]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
                    </svg>
                    <span class="hidden md:inline">Cite / Print</span>
                </button>

                <!-- Light / Dark Theme Toggle Button -->
                <button type="button" onclick="toggleTheme()" id="theme-toggle-btn" class="btn-modern !px-2.5" title="Toggle Light/Dark Mode" aria-label="Toggle Light or Dark Theme">
                    <svg id="icon-sun" class="w-4 h-4 hidden text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    <svg id="icon-moon" class="w-4 h-4 text-[#66023c]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                    </svg>
                </button>
            </div>
        </div>
    </header>

    <!-- Two-Column Reading Layout: Contents (1/4) and Chapter Text (3/4) -->
    <div class="px-5 sm:px-8 lg:px-10 pt-8 sm:pt-12 pb-20">
        <div class="chapter-shell chapter-grid">

            <!-- Left Contents Menu with Scroll Tracking -->
            <aside class="toc no-print" aria-label="Chapter contents">
                <div class="toc-inner" id="toc-scroll">
                    <div class="toc-head">
                        <span class="toc-label">Contents</span>
                        <span class="toc-percent" id="toc-percent">0%</span>
                    </div>
                    <ol class="toc-list">${tocHtml}
                    </ol>
                    <div class="toc-foot">
                        <a href="#top" class="classic-link">↑ Back to top</a>
                    </div>
                </div>
            </aside>

            <div class="chapter-body min-w-0">
            <!-- Collapsible Citation & Print Drawer -->
            <div id="cite-box" class="no-print hidden mb-8 p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--tyrian-border)] shadow-md">
                <div class="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[var(--border-hairline)]">
                    <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-[#66023c]"></span>
                        <strong class="font-ui text-xs tracking-wider uppercase text-[var(--text-secondary)]">
                            Academic Citation &amp; Print
                        </strong>
                    </div>
                    <button type="button" onclick="toggleCiteBox()" class="font-ui text-xs font-semibold text-[var(--text-secondary)] hover:text-[#66023c]">
                        Close ✕
                    </button>
                </div>
                <p class="mb-4 text-base font-mono-code bg-[var(--bg-subtle)] p-3 rounded-lg border border-[var(--border-hairline)] text-[var(--text-primary)]" id="citation-text">
                    ${escapeHtml(documentTitle)}. LEX STEMMA Jurisprudence Series • lex.uk.com
                </p>
                <div class="flex flex-wrap items-center gap-3">
                    <button type="button" onclick="copyCitation()" id="copy-cite-btn" class="btn-modern btn-tyrian">
                        Copy Reference
                    </button>
                    <button type="button" onclick="window.print()" class="btn-modern">
                        Print / Save PDF
                    </button>
                </div>
            </div>

            <!-- Monumental Editorial Masthead -->
            <div class="mb-10 pb-8 border-b-2 border-[#66023c]">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--tyrian-tint)] border border-[var(--tyrian-border)] mb-4">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#66023c]"></span>
                    <span class="font-ui text-[11px] font-bold tracking-widest uppercase text-[#66023c]">
                        UK Tort Law • 20 Foundational Cases (1765–2018) • lex.uk.com
                    </span>
                </div>

                <h1 class="text-4xl sm:text-5xl md:text-[3.15rem] font-bold tracking-tight leading-[1.14]">
                    ${escapeHtml(titleMain)}${titleSub ? `: <em class="font-normal italic text-[#66023c] dark:text-[#c83289]">${escapeHtml(titleSub)}</em>` : ''}
                </h1>

                <!-- Section Navigation Pills -->
                <nav aria-label="Chapter Sections" class="no-print lg:hidden mt-7 pt-6 border-t border-[var(--border-hairline)] flex flex-wrap items-center gap-2">
${navPillsHtml}
                </nav>
            </div>

            <!-- MAIN CHAPTER & CASEBOOK CONTENT -->
            <main>
${sectionsHtml}
            </main>

            <!-- Elegant Modern-Classical Footer -->
            <footer class="mt-20 pt-8 border-t-2 border-[#66023c] flex flex-wrap items-center justify-between gap-4 text-base text-[var(--text-secondary)]">
                <div class="flex items-center gap-3">
                    <span class="inline-block w-2.5 h-2.5 rounded-sm bg-[#66023c] rotate-45"></span>
                    <span>
                        <a href="#top" class="classic-link font-semibold">lex.uk.com</a> — <strong>LEX STEMMA</strong>: <em>${escapeHtml(documentTitle)}</em>
                    </span>
                </div>
                <div class="no-print flex items-center gap-3">
                    <a href="#top" class="btn-modern">
                        <span>↑ Return to Top</span>
                    </a>
                </div>
            </footer>

            </div>
        </div>
    </div>

    <!-- Interactive Script: Zoom, Light/Dark Theme, Reading Progress, Contents Tracking, & Clipboard Utilities -->
    <script>
        function setZoom(level) {
            const root = document.documentElement;
            const btnSmall = document.getElementById('zoom-small');
            const btnDefault = document.getElementById('zoom-default');
            const btnLarge = document.getElementById('zoom-large');

            btnSmall.classList.remove('active');
            btnDefault.classList.remove('active');
            btnLarge.classList.remove('active');

            if (level === 'small') {
                root.style.setProperty('--base-font-size', '16.5px');
                btnSmall.classList.add('active');
            } else if (level === 'large') {
                root.style.setProperty('--base-font-size', '21px');
                btnLarge.classList.add('active');
            } else {
                root.style.setProperty('--base-font-size', '18.5px');
                btnDefault.classList.add('active');
            }
            requestReadingUpdate();
        }

        function toggleTheme() {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme') || 'light';
            const next = current === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', next);

            const sunIcon = document.getElementById('icon-sun');
            const moonIcon = document.getElementById('icon-moon');

            if (next === 'dark') {
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            } else {
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            }
        }

        function toggleCiteBox() {
            const box = document.getElementById('cite-box');
            box.classList.toggle('hidden');
        }

        function copyTextToClipboard(text, btnElement, defaultLabel) {
            const tempInput = document.createElement('textarea');
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            try {
                document.execCommand('copy');
                btnElement.textContent = "Copied ✓";
                setTimeout(() => {
                    btnElement.textContent = defaultLabel;
                }, 2000);
            } catch (err) {
                btnElement.textContent = "Copy failed";
            }
            document.body.removeChild(tempInput);
        }

        function copyCitation() {
            const citation = document.getElementById('citation-text').textContent.trim();
            const btn = document.getElementById('copy-cite-btn');
            copyTextToClipboard(citation, btn, "Copy Reference");
        }

        const progressTrack = document.getElementById('progress-track');
        const progressBar = document.getElementById('progress-bar');
        const tocScroll = document.getElementById('toc-scroll');
        const tocPercent = document.getElementById('toc-percent');
        const tocItems = Array.from(document.querySelectorAll('[data-toc-item]'));
        const tocEntries = Array.from(document.querySelectorAll('[data-toc-link]'))
            .map((link) => ({ link, target: document.getElementById(link.dataset.tocLink), section: link.dataset.tocSection }))
            .filter((entry) => entry.target);
        const SPY_OFFSET = 120;
        let activeEntry = null;
        let revealTimer = null;
        let ticking = false;

        function revealInToc(link) {
            if (!tocScroll || tocScroll.offsetParent === null) return;
            const box = tocScroll.getBoundingClientRect();
            const rect = link.getBoundingClientRect();
            if (rect.top < box.top + 24 || rect.bottom > box.bottom - 24) {
                tocScroll.scrollTo({ top: tocScroll.scrollTop + (rect.top - box.top) - box.height / 3, behavior: 'smooth' });
            }
        }

        function updateReading() {
            ticking = false;
            const doc = document.documentElement;
            const scrollTop = window.scrollY || doc.scrollTop;
            const maxScroll = doc.scrollHeight - doc.clientHeight;
            const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
            const percent = Math.round(ratio * 100);
            progressBar.style.transform = 'scaleX(' + ratio + ')';
            progressTrack.setAttribute('aria-valuenow', String(percent));
            if (tocPercent) tocPercent.textContent = percent + '%';

            if (!tocEntries.length) return;
            let current = null;
            if (maxScroll > 0 && scrollTop >= maxScroll - 2) {
                current = tocEntries[tocEntries.length - 1];
            } else {
                for (const entry of tocEntries) {
                    if (entry.target.getBoundingClientRect().top - SPY_OFFSET <= 0) current = entry;
                    else break;
                }
            }
            if (!current) current = tocEntries[0];
            if (current === activeEntry) return;

            if (activeEntry) {
                activeEntry.link.classList.remove('active');
                activeEntry.link.removeAttribute('aria-current');
            }
            current.link.classList.add('active');
            current.link.setAttribute('aria-current', 'location');
            tocItems.forEach((item) => item.classList.toggle('active', item.dataset.tocItem === current.section));
            activeEntry = current;

            clearTimeout(revealTimer);
            revealTimer = setTimeout(() => revealInToc(current.link), 340);
        }

        function requestReadingUpdate() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(updateReading);
        }

        window.addEventListener('scroll', requestReadingUpdate, { passive: true });
        window.addEventListener('resize', requestReadingUpdate);
        window.addEventListener('load', requestReadingUpdate);
        updateReading();
    </script>
</body>
</html>
`;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const files = fs.readdirSync(SRC_DIR).filter((f) => f.endsWith('.md')).sort();

  for (const file of files) {
    const srcPath = path.join(SRC_DIR, file);
    const md = fs.readFileSync(srcPath, 'utf8');
    const parsed = parseMarkdownLecture(md);
    const html = buildHtmlDocument(parsed);
    const outName = file.replace(/\.md$/, '.html');
    const outPath = path.join(OUT_DIR, outName);
    fs.writeFileSync(outPath, html, 'utf8');
    console.log(
      `[tort-01 build] ${file} -> md-lectures-html/${outName} (${parsed.sections.length} sections, ${parsed.cases.length} cases, ${html.length} bytes)`
    );
  }
}

main();
