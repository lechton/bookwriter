/* ============================================================
   map-lib.mjs: Shared Readers for Maps, the Bank, and Handouts
   ------------------------------------------------------------
   Used by diagnose-map.mjs and handout.mjs.
   ============================================================ */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
export const MAP_DIR = join(ROOT, '01-01-map-principles');
export const HANDOUT_DIR = join(ROOT, 'handouts');
const BANK_PATH = join(ROOT, 'questions', 'questions.md');

export const KINDS = ['promise', 'reuse', 'caution', 'correction', 'move'];
export const STAGES = ['map', 'lecture'];
export const STATUSES = ['open', 'done', 'declined'];

export const pad = (n) => String(n).padStart(2, '0');

export function readBank() {
	if (!existsSync(BANK_PATH)) throw new Error(`bank not found: ${BANK_PATH}`);
	const text = readFileSync(BANK_PATH, 'utf8');
	const version = (text.match(/^> \*\*Version (\d+)\*\*/m) || [])[1] || null;
	const rows = new Map();
	for (const line of text.split('\n')) {
		const m = line.match(/^\|\s*(\d+)\s*\|\s*([^|]+?)\s*\|\s*`#([a-z0-9_-]+)`\s*\|\s*([^|]+?)\s*\|/);
		if (m) rows.set(parseInt(m[1], 10), { tier: m[2], tag: m[3], question: m[4] });
	}
	return { version, rows };
}

// Splits a table row on pipes that sit outside backtick code spans.
export function splitRow(line) {
	const cells = [];
	let cell = '';
	let inCode = false;
	const body = line.trim().replace(/^\|/, '').replace(/\|$/, '');
	for (const ch of body) {
		if (ch === '`') inCode = !inCode;
		if (ch === '|' && !inCode) {
			cells.push(cell.trim());
			cell = '';
		} else cell += ch;
	}
	cells.push(cell.trim());
	return cells;
}

export function tableRows(lines) {
	return lines.filter((l) => l.startsWith('|')).slice(2).map(splitRow);
}

export function sectionOf(lines, name) {
	const start = lines.findIndex((l) => l.trim() === `## ${name}`);
	if (start === -1) return [];
	const rest = lines.slice(start + 1);
	const end = rest.findIndex((l) => l.startsWith('## '));
	return end === -1 ? rest : rest.slice(0, end);
}

export const OWNER_RE = /^Q(\d{1,3}) `?#([a-z0-9_-]+)`?$/;

// The handles and Terms rows of one live map, or null when the map does not exist.
export function readMapFacts(n) {
	const file = join(MAP_DIR, `${pad(n)}.md`);
	if (!existsSync(file)) return null;
	const lines = readFileSync(file, 'utf8').split('\n');
	const handles = new Set();
	for (const l of sectionOf(lines, 'Principles')) {
		const m = l.match(/^- \*\*Handle\*\*: `?([a-z0-9-]+)`?\s*$/);
		if (m) handles.add(m[1]);
	}
	const terms = tableRows(sectionOf(lines, 'Terms'))
		.filter((c) => c.length === 6)
		.map(([term, kind, status, first]) => {
			const m = first.match(OWNER_RE);
			return { term, kind, status, first: m ? parseInt(m[1], 10) : null };
		});
	const ledger = tableRows(sectionOf(lines, 'Candidate Ledger')).filter((c) => c.length === 5);
	return { n, lines, handles, terms, ledger };
}

export function liveMapNumbers() {
	if (!existsSync(MAP_DIR)) return [];
	return readdirSync(MAP_DIR).filter((f) => /^\d{2,3}\.md$/.test(f)).map((f) => parseInt(f, 10)).sort((a, b) => a - b);
}

export const handoutPath = (n) => join(HANDOUT_DIR, `${pad(n)}.json`);

export function readHandout(n) {
	const file = handoutPath(n);
	if (!existsSync(file)) return { lesson: null, messages: [], exists: false };
	const data = JSON.parse(readFileSync(file, 'utf8'));
	return { ...data, exists: true };
}

export function handoutNumbers() {
	if (!existsSync(HANDOUT_DIR)) return [];
	return readdirSync(HANDOUT_DIR).filter((f) => /^\d{2,3}\.json$/.test(f)).map((f) => parseInt(f, 10)).sort((a, b) => a - b);
}

// Returns a list of problems with one handout file; an empty list means it is valid.
export function validateHandout(n, bank) {
	const problems = [];
	let data;
	try {
		data = readHandout(n);
	} catch (e) {
		return [`handouts/${pad(n)}.json is not valid JSON: ${e.message}`];
	}
	if (!data.exists) return problems;
	const where = `handouts/${pad(n)}.json`;
	const lessonOk = (ref, label) => {
		if (!ref || typeof ref.q !== 'number' || typeof ref.tag !== 'string') return problems.push(`${label} is not { "q": number, "tag": string }`);
		const r = bank.rows.get(ref.q);
		if (!r) problems.push(`${label} Q${ref.q} is not a bank row`);
		else if (r.tag !== ref.tag) problems.push(`${label} Q${ref.q} #${ref.tag} differs from bank row ${ref.q} #${r.tag}`);
	};
	lessonOk(data.lesson, `${where} lesson`);
	if (data.lesson && data.lesson.q !== n) problems.push(`${where} lesson is Q${data.lesson.q}, expected Q${n}`);
	if (!Array.isArray(data.messages)) return [...problems, `${where} has no "messages" array`];
	const ids = new Set();
	data.messages.forEach((m, i) => {
		const label = `${where} message ${m.id || i + 1}`;
		if (!m.id) problems.push(`${label} has no id`);
		else if (ids.has(m.id)) problems.push(`${label} repeats its id`);
		ids.add(m.id);
		lessonOk(m.from, `${label} from`);
		lessonOk(m.to, `${label} to`);
		if (m.to && m.to.q !== n) problems.push(`${label} is addressed to Q${m.to.q} but sits in Q${n}'s handout`);
		if (!KINDS.includes(m.kind)) problems.push(`${label} kind "${m.kind}" is not one of ${KINDS.join(', ')}`);
		if (!STAGES.includes(m.stage)) problems.push(`${label} stage "${m.stage}" is not one of ${STAGES.join(', ')}`);
		if (!STATUSES.includes(m.status)) problems.push(`${label} status "${m.status}" is not one of ${STATUSES.join(', ')}`);
		for (const f of ['source', 'msg']) if (!m[f] || typeof m[f] !== 'string') problems.push(`${label} has no ${f}`);
		if (!Array.isArray(m.affects)) problems.push(`${label} has no "affects" array`);
		else m.affects.forEach((a) => lessonOk(a, `${label} affects`));
		if (m.status !== 'open' && !m.resolution) problems.push(`${label} is ${m.status} without a resolution`);
		if (m.kind === 'move' && m.stage !== 'map') problems.push(`${label} is a move, which changes ownership, so its stage must be "map"`);
		if (m.to && m.from && m.to.q === m.from.q) problems.push(`${label} is sent from Q${m.from.q} to itself`);
	});
	return problems;
}
