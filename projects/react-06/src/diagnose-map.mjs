#!/usr/bin/env node
/* ============================================================
   diagnose-map.mjs: Principle Map Checker
   ------------------------------------------------------------
   Checks a principle map in 01-01-map-principles/ against the
   Output Contract of skills/<latest>/map-principles/SKILL.md.

   FAIL lines break the contract and set exit code 1:
   1. Header (title, tag, tier, question, bank version) against the live bank
   2. Sections present and in order
   3. Ledger dispositions, grouping, and the owner rule
   4. Principle numbering, handles, fields per Kind, and no box wording (Roles, Code Pair)
      of two code spans in every principle
   5. Terms rows (status, first lesson, refresher)
   6. Em-dashes and hard wraps
   7. Agreement with the other live maps: every map dates a term to the
      same first lesson, a Recall row names a map that lists the term
      under the same name, and a cited handle (Q04 `braces-window`)
      exists in its map
   8. handouts/{NN}.json is valid, and no message for the map is open

   NOTE lines are indications to read, not failures:
   - sentences over 20 words in the Authorized Scope and Senior Answer
   - unticked Completion Gate boxes and open issues
   - checks that wait for a map not yet written, open lecture messages,
     and messages this lesson has sent

   Usage:
     node src/diagnose-map.mjs 04
     node src/diagnose-map.mjs all
     node src/diagnose-map.mjs path/to/04.md   (a draft or archived map)
   ============================================================ */

import { readFileSync, existsSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { MAP_DIR, OWNER_RE, readBank, tableRows, sectionOf, readMapFacts, liveMapNumbers, readHandout, validateHandout, handoutNumbers, pad } from './map-lib.mjs';

const SECTIONS = ['Authorized Scope', 'Sources Read', 'Candidate Ledger', 'Terms', 'Principles', 'Senior Answer', 'Reported Conflicts', 'Open Issues', 'Completion Gate'];
const DISPOSITIONS = ['Principle', 'Merged', 'Supporting', 'Prerequisite', 'Preview', 'Deferred', 'Dropped'];
const DECISION_FIELDS = ['Handle', 'Kind', 'Placement', 'Mechanism', 'Tempting Belief', 'Defect', 'Importance', 'Required Lesson Proof'];
// The map gives facts; the lecture author writes the box and its code pair (principle-definition casebook, Case 11).
const RETIRED_FIELDS = ['Roles', 'Code Pair'];
const REVIEW_LABELS = ['Do', 'Prefer', 'Avoid', 'Do not', 'Condition'];
const HANDLE_RE = /^[a-z0-9]+(-[a-z0-9]+){1,3}$/;
const CITATION_RE = /\bQ(\d{2,3}) `([a-z0-9]+(?:-[a-z0-9]+){1,3})`/g;
const SENTENCE_CAP = 20;

function sentences(paragraph) {
	return paragraph.split(/(?<=[.!?]["*)]?)\s+(?=[A-Z`*"(])/).map((s) => s.trim()).filter(Boolean);
}

function diagnose(nn, bank, file = join(MAP_DIR, `${nn}.md`)) {
	const num = parseInt(nn, 10);
	const fails = [];
	const notes = [];
	if (!existsSync(file)) return { fails: [`map not found: 01-01-map-principles/${nn}.md`], notes };
	const text = readFileSync(file, 'utf8');
	const lines = text.split('\n');
	const row = bank.rows.get(num);
	if (!row) fails.push(`bank has no row ${num}`);

	// 1. Header
	if (!/^# Q\d{2} Principle Map: \S/.test(lines[0] || '')) fails.push('title is not "# Q{NN} Principle Map: {Lesson title}"');
	else if (!lines[0].startsWith(`# Q${nn} `)) fails.push(`title number is not Q${nn}`);
	const header = (label) => (lines.find((l) => l.startsWith(`- **${label}**:`)) || '').replace(`- **${label}**:`, '').trim();
	const tagLine = header('Topic Tag');
	const tagMatch = tagLine.match(/^`#([a-z0-9_]+)` \| `(.+)`$/);
	if (!tagMatch) fails.push('Topic Tag line is not "`#tag` | `tier`"');
	else if (row) {
		if (tagMatch[1] !== row.tag) fails.push(`Topic Tag #${tagMatch[1]} differs from bank row ${num} #${row.tag}`);
		if (tagMatch[2] !== row.tier) fails.push(`tier ${tagMatch[2]} differs from bank row ${num} ${row.tier}`);
	}
	const question = header('Interview Question').replace(/^\*|\*$/g, '');
	if (row && question !== row.question) fails.push(`Interview Question differs from bank row ${num}`);
	const bankRow = header('Bank Row');
	const versionMatch = bankRow.match(/row (\d+), Version (\d+)/);
	if (!versionMatch) fails.push('Bank Row line is not "`questions/questions.md` row {NN}, Version {V}"');
	else {
		if (parseInt(versionMatch[1], 10) !== num) fails.push(`Bank Row names row ${versionMatch[1]}`);
		if (bank.version && versionMatch[2] !== bank.version) fails.push(`Bank Row names Version ${versionMatch[2]}, live bank is Version ${bank.version}`);
	}
	if (!header('Source Map')) fails.push('Source Map line missing');
	if (!header('Map Revision')) fails.push('Map Revision line missing');

	// 2. Sections
	const found = lines.filter((l) => l.startsWith('## ')).map((l) => l.slice(3).trim());
	const missing = SECTIONS.filter((s) => !found.includes(s));
	if (missing.length) fails.push(`sections missing: ${missing.join(', ')}`);
	const order = found.filter((s) => SECTIONS.includes(s));
	if (!missing.length && order.join('|') !== SECTIONS.join('|')) fails.push(`sections out of order: ${order.join(', ')}`);
	const section = (name) => sectionOf(lines, name);
	const sources = section('Sources Read');
	for (const lead of ['Runtime check:', 'Archive check:', 'Handout:']) {
		if (!sources.some((l) => l.startsWith(`- ${lead}`))) fails.push(`Sources Read has no "${lead}" line`);
	}

	// 4. Principles (read before the ledger, which refers to their handles)
	const principleLines = section('Principles');
	const blocks = [];
	for (const l of principleLines) {
		const h = l.match(/^### Principle (\d+): (.+)$/);
		if (h) blocks.push({ n: parseInt(h[1], 10), title: h[2], fields: new Map() });
		else if (blocks.length) {
			const f = l.match(/^- \*\*(.+?)\*\*: ?(.*)$/);
			if (f) blocks[blocks.length - 1].fields.set(f[1], f[2]);
		}
	}
	if (!blocks.length) fails.push('no "### Principle N: title" headings');
	const handles = new Map();
	blocks.forEach((b, i) => {
		const id = `Principle ${b.n}`;
		if (b.n !== i + 1) fails.push(`${id} is out of sequence (expected ${i + 1})`);
		for (const f of DECISION_FIELDS) if (!b.fields.get(f)) fails.push(`${id} has no ${f}`);
		for (const f of RETIRED_FIELDS) if (b.fields.has(f)) fails.push(`${id} has a ${f} field; the map gives facts, and the lecture writes the box and its pair`);
		const handle = (b.fields.get('Handle') || '').replace(/`/g, '');
		if (handle) {
			if (!HANDLE_RE.test(handle)) fails.push(`${id} handle "${handle}" is not two to four lowercase words joined by hyphens`);
			if (handles.has(handle)) fails.push(`${id} repeats handle "${handle}"`);
			handles.set(handle, b.n);
		}
		const kind = b.fields.get('Kind');
		const review = [...b.fields.keys()].find((k) => k.startsWith('Review Point'));
		const hasPrediction = b.fields.has('Prediction');
		if (kind === 'Decision') {
			if (!review) fails.push(`${id} is a Decision without a Review Point`);
			else {
				const label = review === 'Review Point' ? b.fields.get(review).trim() : '';
				if (!REVIEW_LABELS.includes(label)) fails.push(`${id} Review Point must be exactly one label (${REVIEW_LABELS.join(', ')}), written "- **Review Point**: Do"`);
			}
			if (hasPrediction) fails.push(`${id} is a Decision with a Prediction`);
		} else if (kind === 'Model') {
			if (!hasPrediction) fails.push(`${id} is a Model without a Prediction`);
			if (review) fails.push(`${id} is a Model with a Review Point`);
		} else if (kind !== undefined) fails.push(`${id} Kind "${kind}" is not Decision or Model`);
	});

	// 3. Ledger
	const ownerCheck = (owner, where, test) => {
		const m = owner.match(OWNER_RE);
		if (!m) return fails.push(`${where}: owner "${owner}" is not "Q{NN} #tag"`);
		const n = parseInt(m[1], 10);
		const bankRowOwner = bank.rows.get(n);
		if (!bankRowOwner) return fails.push(`${where}: owner Q${n} is not a bank row`);
		if (bankRowOwner.tag !== m[2]) return fails.push(`${where}: owner Q${n} #${m[2]} differs from bank row ${n} #${bankRowOwner.tag}`);
		if (test && !test(n)) fails.push(`${where}: owner Q${n} #${m[2]} is on the wrong side of Q${num}`);
	};
	const ledger = tableRows(section('Candidate Ledger'));
	if (!ledger.length) fails.push('Candidate Ledger has no rows');
	let lastGroup = -1;
	const principleRows = new Map();
	ledger.forEach((cells, i) => {
		const where = `ledger row ${i + 1}`;
		if (cells.length !== 5) return fails.push(`${where} has ${cells.length} cells, expected 5`);
		const [, , disposition, rawOwner] = cells;
		const owner = rawOwner.trim();
		const group = DISPOSITIONS.indexOf(disposition);
		if (group === -1) return fails.push(`${where}: disposition "${disposition}" is not one of ${DISPOSITIONS.join(', ')}`);
		if (group < lastGroup) fails.push(`${where}: ${disposition} row sits after a ${DISPOSITIONS[lastGroup]} row`);
		lastGroup = Math.max(lastGroup, group);
		const handle = owner.replace(/`/g, '');
		if (disposition === 'Principle' || disposition === 'Merged') {
			if (!handles.has(handle)) fails.push(`${where}: ${disposition} owner "${owner}" is not a principle handle`);
			if (disposition === 'Principle') principleRows.set(handle, (principleRows.get(handle) || 0) + 1);
		} else if (disposition === 'Supporting') ownerCheck(owner, where, (n) => n === num);
		else if (disposition === 'Prerequisite') ownerCheck(owner, where, (n) => n < num);
		else if (disposition === 'Preview' || disposition === 'Deferred') ownerCheck(owner, where, (n) => n > num);
		else if (disposition === 'Dropped' && owner !== 'none') fails.push(`${where}: Dropped owner is "${owner}", expected "none"`);
	});
	for (const [handle, n] of handles) {
		const count = principleRows.get(handle) || 0;
		if (count !== 1) fails.push(`Principle ${n} (${handle}) has ${count} Principle rows in the ledger, expected 1`);
	}

	// 5. Terms
	const terms = tableRows(section('Terms'));
	if (!terms.length) fails.push('Terms has no rows');
	terms.forEach((cells, i) => {
		const where = `Terms row ${i + 1} (${cells[0]})`;
		if (cells.length !== 6) return fails.push(`${where} has ${cells.length} cells, expected 6`);
		const [, , status, first, refresher, neededIn] = cells;
		if (status === 'New') ownerCheck(first, where, (n) => n === num);
		else if (status === 'Recall') ownerCheck(first, where, (n) => n < num);
		else fails.push(`${where}: status "${status}" is not New or Recall`);
		if (!['yes', 'no'].includes(refresher)) fails.push(`${where}: refresher "${refresher}" is not yes or no`);
		const need = neededIn.replace(/`/g, '');
		if (need !== 'Supporting' && !handles.has(need)) fails.push(`${where}: first needed in "${neededIn}" is not a handle or Supporting`);
	});

	// 7. Agreement with the other live maps: one first lesson per term, and cited handles exist
	const others = liveMapNumbers().filter((k) => k !== num).map(readMapFacts).filter(Boolean);
	const firstOf = (t, k) => (t.status === 'New' ? k : t.first);
	terms.forEach((cells) => {
		if (cells.length !== 6) return;
		const [term, , status, first] = cells;
		const m = first.match(OWNER_RE);
		const mine = status === 'New' ? num : m ? parseInt(m[1], 10) : null;
		if (mine === null) return;
		for (const o of others) {
			const t = o.terms.find((x) => x.term === term);
			if (t && firstOf(t, o.n) !== mine) fails.push(`Terms "${term}": map ${pad(o.n)} dates it to Q${pad(firstOf(t, o.n))}, this map to Q${pad(mine)}`);
		}
		if (status === 'Recall') {
			const src = others.find((o) => o.n === mine);
			if (!src) notes.push(`Terms "${term}": map ${pad(mine)} does not exist yet, so the first appearance is unconfirmed`);
			else if (!src.terms.some((x) => x.term === term)) fails.push(`Terms "${term}": map ${pad(mine)} has no Terms row with this exact name`);
		}
	});
	const unconfirmed = new Set();
	lines.forEach((l, i) => {
		for (const [, q, handle] of l.matchAll(CITATION_RE)) {
			const k = parseInt(q, 10);
			if (k === num) {
				if (!handles.has(handle)) fails.push(`line ${i + 1} cites Q${q} \`${handle}\`, which is not a handle of this map`);
				continue;
			}
			const o = others.find((x) => x.n === k);
			if (!o) unconfirmed.add(`Q${q} \`${handle}\``);
			else if (!o.handles.has(handle)) fails.push(`line ${i + 1} cites Q${q} \`${handle}\`, which map ${q} does not have`);
		}
	});
	if (unconfirmed.size) notes.push(`cited handles in maps that do not exist yet: ${[...unconfirmed].join(', ')}`);

	// 8. Handout: messages addressed to this lesson
	const handoutProblems = validateHandout(num, bank);
	handoutProblems.forEach((p) => fails.push(p));
	if (!handoutProblems.length) {
		const inbox = readHandout(num).messages || [];
		for (const msg of inbox.filter((x) => x.status === 'open')) {
			const text = `${msg.id} from Q${pad(msg.from.q)} (${msg.kind}): ${msg.msg.slice(0, 80)}${msg.msg.length > 80 ? '...' : ''}`;
			if (msg.stage === 'map') fails.push(`handout message ${text} is open; close it with node src/handout.mjs close`);
			else notes.push(`handout message for the lecture is open: ${text}`);
		}
	}
	const sent = handoutNumbers().filter((k) => k !== num).flatMap((k) => {
		try {
			return (readHandout(k).messages || []).filter((x) => x.from && x.from.q === num);
		} catch {
			return [];
		}
	});
	if (sent.length) notes.push(`this lesson has sent ${sent.length} handout message(s): ${sent.map((x) => x.id).join(', ')}`);

	// Reported Conflicts and Open Issues
	for (const name of ['Reported Conflicts', 'Open Issues']) {
		const items = section(name).filter((l) => l.startsWith('- '));
		if (!items.length) fails.push(`${name} is empty; write "- None" when there is nothing to report`);
		else if (name === 'Open Issues' && !(items.length === 1 && /^- None\.?$/.test(items[0]))) notes.push(`${items.length} open issue(s) to carry into the lesson`);
	}

	// 6. Em-dashes and hard wraps
	lines.forEach((l, i) => {
		if (l.includes('\u2014')) fails.push(`line ${i + 1} has an em-dash`);
	});
	let inFence = false;
	lines.forEach((l, i) => {
		if (l.startsWith('```')) inFence = !inFence;
		if (inFence || !l.trim() || i === 0) return;
		const isBlock = /^(#|- |\* |\||>|\d+\. |```)/.test(l);
		const prev = lines[i - 1];
		if (!isBlock && prev.trim() && !prev.startsWith('#')) fails.push(`line ${i + 1} continues the line above (hard wrap)`);
	});

	// Indications: sentence length in the prose sections
	for (const name of ['Authorized Scope', 'Senior Answer']) {
		const prose = section(name).filter((l) => l.trim()).join(' ');
		const list = sentences(prose);
		if (!list.length) continue;
		const counts = list.map((s) => s.split(/\s+/).length);
		const avg = (counts.reduce((a, b) => a + b, 0) / counts.length).toFixed(1);
		const long = list.filter((s, j) => counts[j] > SENTENCE_CAP);
		notes.push(`${name}: ${list.length} sentences, average ${avg} words, ${long.length} over ${SENTENCE_CAP}`);
		long.forEach((s) => notes.push(`  long (${s.split(/\s+/).length} words): ${s.slice(0, 90)}${s.length > 90 ? '...' : ''}`));
	}
	const unticked = section('Completion Gate').filter((l) => l.startsWith('- [ ]')).length;
	if (unticked) notes.push(`Completion Gate: ${unticked} box(es) not ticked`);

	return { fails, notes };
}

const arg = process.argv[2];
if (!arg) {
	console.error('Usage: node src/diagnose-map.mjs <NN|all>');
	process.exit(2);
}
const bank = readBank();
const isPath = arg.endsWith('.md');
const targets = arg === 'all'
	? liveMapNumbers().map(pad)
	: [isPath ? basename(arg).replace(/\.md$/, '') : pad(parseInt(arg, 10))];
let failed = 0;
for (const nn of targets) {
	const { fails, notes } = isPath ? diagnose(nn, bank, resolve(arg)) : diagnose(nn, bank);
	console.log(`\nMap ${nn}: ${fails.length ? `${fails.length} FAIL` : 'PASS'}`);
	fails.forEach((f) => console.log(`  FAIL ${f}`));
	notes.forEach((n) => console.log(`  NOTE ${n}`));
	if (fails.length) failed++;
}
if (!targets.length) console.log('No maps found in 01-01-map-principles/.');
process.exit(failed ? 1 : 0);
