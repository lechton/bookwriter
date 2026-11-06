/* editor.mjs: the code editor of revision 4.
   A compact port of the full lecture's code blocks (src/build-lectures.mjs): the same tokenizer and colours,
   zebra rows with line numbers, a balloon under every commented line, and a dotted underline under the
   ~token~ the balloon explains. Every position is counted in characters of code and handed to the CSS as a
   plain number, which multiplies it by --ch (the width of one code character in that context), so the balloon
   still points at its token when a column or the principle box sets the code smaller. */

const SHOULDER = 2;        // characters from a right-anchored balloon's end to its tail
const BUBBLE_RATIO = 0.82; // one character of balloon text (italic Georgia) is about this many code characters wide
const BUBBLE_PAD = 4;      // balloon padding and border, in code characters

const HOOK_RE = /^use[A-Z][A-Za-z0-9]*$/;
const KEYWORDS = new Set([
	'let', 'const', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do',
	'new', 'class', 'extends', 'super', 'this', 'await', 'async', 'import', 'export',
	'from', 'default', 'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof',
	'in', 'of', 'true', 'false', 'null', 'undefined', 'break', 'continue', 'switch',
	'case', 'delete', 'void', 'yield', 'static', 'get', 'set',
]);

const escCode = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => escCode(s).replace(/"/g, '&quot;');

// The full lecture's tokenizer: strings, comments, numbers, hooks, keywords, function calls.
export function tokenizeLine(line) {
	let out = '';
	let i = 0;
	const n = line.length;
	const isIdentStart = (c) => /[A-Za-z_$]/.test(c);
	const isIdent = (c) => /[A-Za-z0-9_$]/.test(c);
	while (i < n) {
		const c = line[i];
		if (c === '"' || c === "'" || c === '`') {
			let j = i + 1;
			while (j < n && line[j] !== c) { if (line[j] === '\\') j++; j++; }
			out += `<span class="str">${escCode(line.slice(i, Math.min(j + 1, n)))}</span>`;
			i = j + 1;
			continue;
		}
		if (c === '/' && i + 1 < n && (line[i + 1] === '/' || line[i + 1] === '*')) {
			if (line[i + 1] === '/') { out += `<span class="cmt">${escCode(line.slice(i))}</span>`; break; }
			let j = i + 2;
			while (j + 1 < n && !(line[j] === '*' && line[j + 1] === '/')) j++;
			out += `<span class="cmt">${escCode(line.slice(i, Math.min(j + 2, n)))}</span>`;
			i = Math.min(j + 2, n);
			continue;
		}
		if (/\d/.test(c) && (i === 0 || !isIdent(line[i - 1]))) {
			const m = line.slice(i).match(/^\d+(\.\d+)?/);
			if (m) { out += `<span class="nl">${escCode(m[0])}</span>`; i += m[0].length; continue; }
		}
		if (isIdentStart(c)) {
			let j = i + 1;
			while (j < n && isIdent(line[j])) j++;
			const word = line.slice(i, j);
			const isAttr = line[j] === '=' && line[j + 1] !== '=' && line[j + 1] !== '>'; // class="title", for="email": a name, not a keyword
			if (HOOK_RE.test(word)) out += `<span class="hook">${escCode(word)}</span>`;
			else if (KEYWORDS.has(word) && !isAttr) out += `<span class="kw">${escCode(word)}</span>`;
			else {
				let k = j;
				while (k < n && (line[k] === ' ' || line[k] === '\t')) k++;
				out += line[k] === '(' ? `<span class="fn">${escCode(word)}</span>` : escCode(word);
			}
			i = j;
			continue;
		}
		out += escCode(c);
		i++;
	}
	return out;
}

// The code part of a line, with its ~token~ underlined, and where that token sits (in characters).
function withTarget(code) {
	const m = code.match(/^(.*?)~(.+?)~(.*)$/);
	if (!m) return { html: tokenizeLine(code), col: null, offset: null };
	const [, before, target, after] = m;
	const indent = before.match(/^\s*/)[0].length;
	const col = before.length + target.length / 2;   // the token's middle, from the start of the line
	const offset = col - indent;                      // the token's middle, from the line's indent
	const isAttr = /^[A-Za-z_$][\w$]*$/.test(target) && /^=[^=>]/.test(after); // an underlined attribute name, such as ~class~="title"
	const html = tokenizeLine(before) + `<span class="target-token">${isAttr ? escCode(target) : tokenizeLine(target)}</span>` + tokenizeLine(after);
	return { html, col, offset };
}

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
   tone (do / dont: a card inside the principle box, which colours the underline only),
   role (the component's place in the tree, such as PARENT or CHILD, shown at the right of the bar; needs a title).
   A one-line snippet with no title and no comment is a single white line with no number. */
export function editorBlock(body, attrs = {}) {
	const good = lineSet(attrs.good);
	const bad = lineSet(attrs.bad);
	const start = Number(attrs.startLine || 1);
	const lines = body.map((raw) => raw.replace(/\t/g, '  '));
	const parsed = [];
	let pending = [];
	lines.forEach((raw, idx) => {
		const { code, comment } = splitLine(raw);
		if (!code.trim() && comment) { pending.push(comment); return; } // a comment-only line joins the next line's bubble
		const indent = (code.match(/^\s*/) || [''])[0].length;
		const t = withTarget(code);
		parsed.push({ place: idx + 1, html: t.html, col: t.col, offset: t.offset, indent, comments: code.trim() ? [...pending.splice(0), ...(comment ? [comment] : [])] : (comment ? [comment] : []) });
	});
	if (pending.length && parsed.length) parsed[parsed.length - 1].comments.push(...pending);
	const width = Math.max(...lines.map((l) => splitLine(l).code.replace(/~/g, '').trimEnd().length), 30); // the block's width, in characters
	const bare = parsed.length === 1 && !attrs.title && !parsed[0].comments.length;

	const rows = parsed.map((p, k) => {
		const num = start + k;
		const tint = bad.has(p.place) ? ' row-bad' : good.has(p.place) ? ' row-good' : '';
		const zebra = bare ? 'odd' : (num % 2 === 0 ? 'even' : 'odd');
		let out = `<div class="row ${zebra}${tint}">${bare ? '' : `<span class="num">${num}</span>`}<span class="src">${p.html || ' '}</span>`;
		if (p.comments.length) {
			const plain = p.comments.join(' ').replace(/\*\*/g, '');
			const bubble = Math.min(plain.length, 64) * BUBBLE_RATIO + BUBBLE_PAD;
			const r = (x) => Math.round(x * 10) / 10;
			let style;
			let cls = 'bubble';
			if (p.offset !== null && p.comments.length === 1 && p.col > width * 0.5 && p.col + SHOULDER >= bubble) {
				// the token sits on the right and the balloon fits to its left: the balloon ends just past the token
				cls += ' bubble-right';
				style = `--end: ${r(p.col + SHOULDER)}; --tl: ${SHOULDER};`;
			} else if (p.offset !== null) {
				// as in the full lecture: the balloon starts at the line's indent, and its tail reaches along to the token
				style = `--in: ${p.indent}; --tl: ${r(p.offset)};`;
			} else {
				style = `--in: ${p.indent}; --tl: 2;`;
			}
			const text = p.comments.map(renderComment).join('<br>');
			out += `<div class="row-break"></div>${bare ? '' : '<span class="num"></span>'}<div class="${cls}" style="${style}"><span class="text">${text}</span></div>`;
		}
		return out + '</div>';
	}).join('');

	// a card in the principle box's do column looks like DO THIS, and one in its do-not column like DO NOT DO THIS
	const right = attrs.right || attrs.tone === 'do';
	const wrong = attrs.wrong || attrs.tone === 'dont';
	const kind = right ? ' ed-right' : wrong ? ' ed-wrong' : '';
	const bar = attrs.title ? `<div class="bar"><span class="dots"><i></i><i></i><i></i></span><span class="tab">${escAttr(attrs.title)}</span>${attrs.role ? `<span class="role">${escAttr(attrs.role)}</span>` : ''}</div>` : '';
	const icon = right ? ICON_RIGHT : wrong ? ICON_WRONG : '';
	const side = icon ? `<div class="ed-indicator">${icon}</div>` : '';
	return `<div class="ed${kind}${bare ? ' ed-bare' : ''}">${side}<div class="ed-main">${bar}<div class="code">${rows}</div></div></div>`;
}
