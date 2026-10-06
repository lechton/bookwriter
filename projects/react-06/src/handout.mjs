#!/usr/bin/env node
/* ============================================================
   handout.mjs: Messages Between Lessons
   ------------------------------------------------------------
   Each lesson has one inbox, handouts/{NN}.json. Any map,
   pre-lecture, or lecture author can send a message to a later
   or an earlier lesson; the receiving author closes it.

   Usage:
     node src/handout.mjs 24
         The inbox of lesson 24: its messages, the ledger rows of
         other maps that name Q24 as owner, and the maps that
         recall Q24 as a prerequisite.
     node src/handout.mjs add --from 11 --to 24 --kind promise \
         --stage lecture --source "02-01-md-revised/11.md, Keys" \
         --msg "..." [--affects 13,15]
     node src/handout.mjs close 11-24-01 --status done \
         --resolution "Lecture 24, section on keys, delivers it."
     node src/handout.mjs check
         Validates every handout file.

   Kinds: promise, reuse, caution, correction, move.
   Stages: map (the map author closes it) or lecture (the
   pre-lecture and lecture authors close it). A move changes
   ownership, so it is always a map message.
   ============================================================ */

import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { HANDOUT_DIR, KINDS, STAGES, OWNER_RE, pad, readBank, readHandout, handoutPath, handoutNumbers, validateHandout, liveMapNumbers, readMapFacts } from './map-lib.mjs';

const bank = readBank();
const [cmd, ...rest] = process.argv.slice(2);

function flags(args) {
	const out = { _: [] };
	for (let i = 0; i < args.length; i++) {
		if (args[i].startsWith('--')) out[args[i].slice(2)] = args[++i];
		else out._.push(args[i]);
	}
	return out;
}

function lesson(q) {
	const n = parseInt(q, 10);
	const row = bank.rows.get(n);
	if (!row) die(`Q${q} is not a row of the live bank`);
	return { q: n, tag: row.tag };
}

function die(message) {
	console.error(message);
	process.exit(1);
}

// Writes the file, validates it, and puts the previous content back when the result is invalid.
function save(n, data) {
	if (!existsSync(HANDOUT_DIR)) mkdirSync(HANDOUT_DIR, { recursive: true });
	const file = handoutPath(n);
	const before = existsSync(file) ? readFileSync(file, 'utf8') : null;
	writeFileSync(file, JSON.stringify({ lesson: data.lesson, messages: data.messages }, null, 2) + '\n');
	const problems = validateHandout(n, bank);
	if (problems.length) {
		if (before === null) unlinkSync(file);
		else writeFileSync(file, before);
		die(`not saved; the message has problems:\n  ${problems.join('\n  ')}`);
	}
}

const show = (m) => `  ${m.id}  ${m.kind}, for the ${m.stage}, from Q${pad(m.from.q)} #${m.from.tag}\n    source: ${m.source}\n    ${m.msg}${m.affects.length ? `\n    affects: ${m.affects.map((a) => `Q${pad(a.q)} #${a.tag}`).join(', ')}` : ''}${m.resolution ? `\n    ${m.status}: ${m.resolution}` : ''}`;

if (cmd === 'add') {
	const f = flags(rest);
	for (const k of ['from', 'to', 'kind', 'stage', 'source', 'msg']) if (!f[k]) die(`add needs --${k}`);
	if (!KINDS.includes(f.kind)) die(`--kind must be one of ${KINDS.join(', ')}`);
	if (!STAGES.includes(f.stage)) die(`--stage must be one of ${STAGES.join(', ')}`);
	const from = lesson(f.from);
	const to = lesson(f.to);
	const affects = f.affects ? f.affects.split(',').map((x) => lesson(x.trim())) : [];
	const data = readHandout(to.q);
	const messages = data.messages || [];
	const prefix = `${pad(from.q)}-${pad(to.q)}-`;
	const seq = messages.filter((m) => m.id.startsWith(prefix)).length + 1;
	const message = { id: prefix + pad(seq), from, to, kind: f.kind, stage: f.stage, source: f.source, msg: f.msg, affects, status: 'open', resolution: '' };
	save(to.q, { lesson: to, messages: [...messages, message] });
	console.log(`added to handouts/${pad(to.q)}.json:\n${show(message)}`);
} else if (cmd === 'close') {
	const f = flags(rest);
	const id = f._[0];
	if (!id || !f.status || !f.resolution) die('close needs an id, --status done|declined, and --resolution');
	if (!['done', 'declined'].includes(f.status)) die('--status must be done or declined');
	const to = parseInt(id.split('-')[1], 10);
	const data = readHandout(to);
	const message = (data.messages || []).find((m) => m.id === id);
	if (!message) die(`no message ${id} in handouts/${pad(to)}.json`);
	message.status = f.status;
	message.resolution = f.resolution;
	save(to, data);
	console.log(`closed in handouts/${pad(to)}.json:\n${show(message)}`);
} else if (cmd === 'check') {
	let bad = 0;
	for (const n of handoutNumbers()) {
		const problems = validateHandout(n, bank);
		if (problems.length) bad++;
		console.log(`handouts/${pad(n)}.json: ${problems.length ? `${problems.length} problem(s)` : 'valid'}`);
		problems.forEach((p) => console.log(`  ${p}`));
	}
	if (!handoutNumbers().length) console.log('No handout files yet.');
	process.exit(bad ? 1 : 0);
} else if (cmd && /^\d+$/.test(cmd)) {
	const me = lesson(cmd);
	console.log(`Inbox of Q${pad(me.q)} #${me.tag}\n`);
	const problems = validateHandout(me.q, bank);
	if (problems.length) die(problems.join('\n'));
	const messages = readHandout(me.q).messages || [];
	const open = messages.filter((m) => m.status === 'open');
	console.log(`Open messages (${open.length}):`);
	open.forEach((m) => console.log(show(m)));
	const closed = messages.length - open.length;
	if (closed) console.log(`\nClosed messages: ${closed} (see handouts/${pad(me.q)}.json)`);
	const owned = [];
	const recalls = [];
	for (const k of liveMapNumbers().filter((x) => x !== me.q)) {
		const facts = readMapFacts(k);
		for (const [candidate, , disposition, owner] of facts.ledger) {
			const m = owner.match(OWNER_RE);
			if (!m || parseInt(m[1], 10) !== me.q) continue;
			if (disposition === 'Preview' || disposition === 'Deferred') owned.push(`  map ${pad(k)} ${disposition}: ${candidate}`);
			if (disposition === 'Prerequisite') recalls.push(`  map ${pad(k)}: ${candidate}`);
		}
	}
	console.log(`\nLedger rows in other maps that name Q${pad(me.q)} as owner (${owned.length}):`);
	owned.forEach((l) => console.log(l));
	console.log(`\nLater maps that recall Q${pad(me.q)} as a prerequisite (${recalls.length}); a change here affects them:`);
	recalls.forEach((l) => console.log(l));
} else {
	die('Usage: node src/handout.mjs <NN> | add ... | close <id> ... | check');
}
