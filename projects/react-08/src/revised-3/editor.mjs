/* editor.mjs: the code editor of revision 3.
   The layout of revision 4's editor (src/revised-4/editor.mjs): a file tab when the block has a title, line numbers,
   the green and red editors of DO THIS and DO NOT DO THIS, and a balloon under every commented line. Revision 3 marks
   no ~token~, so the balloon starts at the line's indent and has no tail, and no token is underlined. The words of
   each line are coloured by the highlighter the build passes in, so each theme colours them through its t-* variables. */

const BUBBLE_INDENT_MAX = 24; // a deeply indented line still leaves its balloon room for its words, in characters

// Split one line into its code and its trailing comment (// or {/* */} or /* */, or <!-- --> in HTML).
function splitLine(raw) {
	const html = raw.match(/^(.*?)\s*<!--\s*(.*?)\s*-->\s*$/);
	if (html) return { code: html[1].trim() ? html[1] : '', comment: html[2] || null };
	const block = raw.match(/^(.*?)\s*(?:\{\/\*|\/\*)\s*(.*?)\s*(?:\*\/\}|\*\/)\s*$/);
	if (block && block[1].trim() !== '' && block[2].trim()) return { code: block[1], comment: block[2].trim() };
	const full = raw.match(/^\s*(?:\{\/\*|\/\*)\s*(.*?)\s*(?:\*\/\}|\*\/)\s*$/);
	if (full) return { code: '', comment: full[1].trim() };
	const idx = raw.search(/\/\/(\s|$)/);
	if (idx >= 0 && raw[idx - 1] !== ':') {
		const code = raw.slice(0, idx);
		const comment = raw.slice(idx + 2).trim();
		return { code: code.trim() ? code : '', comment: comment || null };
	}
	return { code: raw, comment: null };
}

const escCode = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Bold in a comment becomes a chip: WRONG in red, PROBLEMATIC in amber, anything else neutral.
function renderComment(text) {
	const t = text.charAt(0).toUpperCase() + text.slice(1);
	return escCode(t).replace(/\*\*([^*]+?):?\*\*:?/g, (_, w) => {
		const kind = /^WRONG$/i.test(w) ? ' chip-wrong' : /^PROBLEMATIC$/i.test(w) ? ' chip-problem' : '';
		return `<b class="chip${kind}">${w}</b>`;
	});
}

function lineSet(spec) {
	const set = new Set();
	for (const part of String(spec || '').split(',').filter(Boolean)) {
		const [a, b] = part.split('-').map(Number);
		for (let k = a; k <= (b || a); k++) set.add(k);
	}
	return set;
}

const ICON_RIGHT = '<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd"/></svg>';
const ICON_WRONG = '<svg viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd"/></svg>';

/* One code block as an editor.
   attrs: title (file tab), startLine, good / bad (line places to tint), right / wrong (DO THIS / DO NOT DO THIS frame),
   tone (do / dont: a card inside the principle box), role (the component's place in the tree, such as PARENT or CHILD,
   shown at the right of the bar; needs a title). highlight(code, state) colours one line; state carries an open tag
   from one line to the next. A one-line snippet with no title and no comment is a single line with no number. */
export function editorBlock(body, attrs = {}, highlight) {
	const good = lineSet(attrs.good);
	const bad = lineSet(attrs.bad);
	const start = Number(attrs.startLine || 1);
	const state = { inTag: false };
	const parsed = [];
	let pending = [];
	body.map((raw) => raw.replace(/\t/g, '  ')).forEach((raw, idx) => {
		const { code, comment } = splitLine(raw);
		if (!code.trim() && comment) { pending.push(comment); return; } // a comment-only line joins the next line's balloon
		const indent = (code.match(/^\s*/) || [''])[0].length;
		parsed.push({ place: idx + 1, html: highlight(code, state), indent, comments: [...pending.splice(0), ...(comment ? [comment] : [])] });
	});
	if (pending.length && parsed.length) parsed[parsed.length - 1].comments.push(...pending);
	const bare = parsed.length === 1 && !attrs.title && !parsed[0].comments.length;

	const rows = parsed.map((p, k) => {
		const num = start + k;
		const tint = bad.has(p.place) ? ' row-bad' : good.has(p.place) ? ' row-good' : '';
		const zebra = bare ? 'odd' : (num % 2 === 0 ? 'even' : 'odd');
		let out = `<div class="row ${zebra}${tint}">${bare ? '' : `<span class="num">${num}</span>`}<span class="src">${p.html || ' '}</span>`;
		if (p.comments.length) {
			const text = p.comments.map(renderComment).join('<br>');
			out += `<div class="row-break"></div>${bare ? '' : '<span class="num"></span>'}<div class="bubble" style="--in: ${Math.min(p.indent, BUBBLE_INDENT_MAX)};"><span class="text">${text}</span></div>`;
		}
		return out + '</div>';
	}).join('');

	// a card in the principle box's do column looks like DO THIS, and one in its do-not column like DO NOT DO THIS
	const right = attrs.right || attrs.tone === 'do';
	const wrong = attrs.wrong || attrs.tone === 'dont';
	const kind = right ? ' ed-right' : wrong ? ' ed-wrong' : '';
	const bar = attrs.title ? `<div class="bar"><span class="dots"><i></i><i></i><i></i></span><span class="tab">${escCode(attrs.title)}</span>${attrs.role ? `<span class="role">${escCode(attrs.role)}</span>` : ''}</div>` : '';
	const icon = right ? ICON_RIGHT : wrong ? ICON_WRONG : '';
	const side = icon ? `<div class="ed-indicator">${icon}</div>` : '';
	return `<div class="ed${kind}${bare ? ' ed-bare' : ''}${attrs.tone ? ` ed-card` : ''}">${side}<div class="ed-main">${bar}<div class="code">${rows}</div></div></div>`;
}
