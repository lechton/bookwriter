/* ============================================================
   latex-to-mathml.mjs — Lightweight LaTeX to MathML compiler
   ------------------------------------------------------------
   Converts LaTeX mathematical expressions ($$...$$ and $...$)
   into W3C standard MathML natively rendered by PrinceXML.
   ============================================================ */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function parseGroup(str, pos) {
	while (pos < str.length && str[pos] === ' ') pos++;
	if (pos >= str.length) return { content: '', end: pos };
	if (str[pos] !== '{') {
		if (str[pos] === '\\') {
			const m = str.slice(pos).match(/^\\[a-zA-Z]+/);
			if (m) return { content: m[0], end: pos + m[0].length };
		}
		return { content: str[pos], end: pos + 1 };
	}
	let depth = 1;
	let i = pos + 1;
	const start = i;
	while (i < str.length && depth > 0) {
		if (str[i] === '{' && str[i - 1] !== '\\') depth++;
		else if (str[i] === '}' && str[i - 1] !== '\\') depth--;
		i++;
	}
	return { content: str.slice(start, i - 1), end: i };
}

function tokenize(raw) {
	// Normalize escaped entities or accidental escape characters
	let str = raw
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/\x09ext\{/g, '\\text{')
		.replace(/\x0crac\{/g, '\\frac{')
		.replace(/\x09imes/g, '\\times')
		.replace(/\x07pprox/g, '\\approx');

	let i = 0;
	const tokens = [];
	while (i < str.length) {
		if (/\s/.test(str[i])) {
			i++;
			continue;
		}

		// Text macro: \text{...} or \mathrm{...}
		if (str.startsWith('\\text', i) || str.startsWith('\\mathrm', i)) {
			const tagLen = str.startsWith('\\mathrm', i) ? 7 : 5;
			const grp = parseGroup(str, i + tagLen);
			tokens.push({ type: 'text', val: grp.content });
			i = grp.end;
			continue;
		}

		// Fraction macro: \frac{num}{den}
		if (str.startsWith('\\frac', i)) {
			let pos = i + 5;
			const num = parseGroup(str, pos);
			const den = parseGroup(str, num.end);
			tokens.push({ type: 'frac', num: num.content, den: den.content });
			i = den.end;
			continue;
		}

		// Matrix: \begin{bmatrix} ... \end{bmatrix} or \begin{pmatrix}
		if (str.startsWith('\\begin{bmatrix}', i) || str.startsWith('\\begin{pmatrix}', i)) {
			const isParen = str.startsWith('\\begin{pmatrix}', i);
			const endTag = isParen ? '\\end{pmatrix}' : '\\end{bmatrix}';
			const startLen = isParen ? 15 : 15;
			let endIdx = str.indexOf(endTag, i);
			if (endIdx === -1) endIdx = str.length;
			const inner = str.slice(i + startLen, endIdx);
			tokens.push({ type: 'matrix', inner, delim: isParen ? 'paren' : 'bracket' });
			i = endIdx + endTag.length;
			continue;
		}

		// Escaped symbols & common mathematical operators
		if (str.startsWith('\\%', i)) { tokens.push({ type: 'op', val: '%' }); i += 2; continue; }
		if (str.startsWith('\\times', i)) { tokens.push({ type: 'op', val: '×' }); i += 6; continue; }
		if (str.startsWith('\\cdot', i)) { tokens.push({ type: 'op', val: '·' }); i += 5; continue; }
		if (str.startsWith('\\approx', i)) { tokens.push({ type: 'op', val: '≈' }); i += 7; continue; }
		if (str.startsWith('\\div', i)) { tokens.push({ type: 'op', val: '÷' }); i += 4; continue; }
		if (str.startsWith('\\pm', i)) { tokens.push({ type: 'op', val: '±' }); i += 3; continue; }
		if (str.startsWith('\\leq', i)) { tokens.push({ type: 'op', val: '≤' }); i += 4; continue; }
		if (str.startsWith('\\le', i)) { tokens.push({ type: 'op', val: '≤' }); i += 3; continue; }
		if (str.startsWith('\\geq', i)) { tokens.push({ type: 'op', val: '≥' }); i += 4; continue; }
		if (str.startsWith('\\ge', i)) { tokens.push({ type: 'op', val: '≥' }); i += 3; continue; }
		if (str.startsWith('\\neq', i)) { tokens.push({ type: 'op', val: '≠' }); i += 4; continue; }
		if (str.startsWith('\\rightarrow', i)) { tokens.push({ type: 'op', val: '→' }); i += 11; continue; }
		if (str.startsWith('\\to', i)) { tokens.push({ type: 'op', val: '→' }); i += 3; continue; }
		if (str.startsWith('\\max', i)) { tokens.push({ type: 'op', val: 'max' }); i += 4; continue; }
		if (str.startsWith('\\min', i)) { tokens.push({ type: 'op', val: 'min' }); i += 4; continue; }
		if (str.startsWith('\\clamp', i)) { tokens.push({ type: 'op', val: 'clamp' }); i += 6; continue; }
		if (str.startsWith('\\sin', i)) { tokens.push({ type: 'op', val: 'sin' }); i += 4; continue; }
		if (str.startsWith('\\cos', i)) { tokens.push({ type: 'op', val: 'cos' }); i += 4; continue; }
		if (str.startsWith('\\log', i)) { tokens.push({ type: 'op', val: 'log' }); i += 4; continue; }
		if (str.startsWith('\\ln', i)) { tokens.push({ type: 'op', val: 'ln' }); i += 3; continue; }
		if (str.startsWith('\\left(', i)) { tokens.push({ type: 'op', val: '(' }); i += 6; continue; }
		if (str.startsWith('\\right)', i)) { tokens.push({ type: 'op', val: ')' }); i += 7; continue; }
		if (str.startsWith('\\left[', i)) { tokens.push({ type: 'op', val: '[' }); i += 6; continue; }
		if (str.startsWith('\\right]', i)) { tokens.push({ type: 'op', val: ']' }); i += 7; continue; }
		if (str.startsWith('\\,', i) || str.startsWith('\\;', i)) { tokens.push({ type: 'space' }); i += 2; continue; }
		if (str.startsWith('\\quad', i)) { tokens.push({ type: 'space', width: '1em' }); i += 5; continue; }

		// Subscript & Superscript
		if (str[i] === '_') {
			const grp = parseGroup(str, i + 1);
			tokens.push({ type: 'sub', val: grp.content });
			i = grp.end;
			continue;
		}
		if (str[i] === '^') {
			const grp = parseGroup(str, i + 1);
			tokens.push({ type: 'sup', val: grp.content });
			i = grp.end;
			continue;
		}
		if (str[i] === "'") { // Prime: x' -> x with superscript prime
			tokens.push({ type: 'sup', val: '′' });
			i++;
			continue;
		}

		// Numbers (integer or floating point)
		const numMatch = str.slice(i).match(/^(\d+(\.\d+)?)/);
		if (numMatch) {
			tokens.push({ type: 'num', val: numMatch[1] });
			i += numMatch[1].length;
			continue;
		}

		// Identifiers (letters or words)
		const idMatch = str.slice(i).match(/^([a-zA-Z]+)/);
		if (idMatch) {
			tokens.push({ type: 'id', val: idMatch[1] });
			i += idMatch[1].length;
			continue;
		}

		// Operators & Punctuation
		let char = str[i];
		if (char === '-') char = '−'; // true unicode mathematical minus
		tokens.push({ type: 'op', val: char });
		i++;
	}
	return tokens;
}

function renderTokens(tokens) {
	let res = '';
	let idx = 0;
	while (idx < tokens.length) {
		const t = tokens[idx];
		let baseHtml = '';

		if (t.type === 'text') {
			let prefix = '';
			let suffix = '';
			if (t.val.startsWith(' ')) prefix = '<mspace width="0.25em"/>';
			if (t.val.endsWith(' ')) suffix = '<mspace width="0.25em"/>';
			baseHtml = `${prefix}<mtext>${esc(t.val.trim())}</mtext>${suffix}`;
		} else if (t.type === 'id') {
			// Multi-letter words like 'cover', 'render', 'img', 'box' or units render upright in MathML
			if (t.val.length > 1) {
				baseHtml = `<mtext>${esc(t.val)}</mtext>`;
			} else {
				baseHtml = `<mi>${esc(t.val)}</mi>`;
			}
		} else if (t.type === 'num') {
			const next = tokens[idx + 1];
			const needsUnitSpace = next && (next.type === 'text' || next.type === 'id') && !next.val.startsWith(' ');
			baseHtml = `<mn>${esc(t.val)}</mn>${needsUnitSpace ? '<mspace width="0.16em"/>' : ''}`;
		} else if (t.type === 'op') {
			const isBinary = /^[=+\-−×·≈≤≥≠→]$/.test(t.val);
			baseHtml = isBinary
				? `<mo lspace="0.22em" rspace="0.22em">${esc(t.val)}</mo>`
				: `<mo>${esc(t.val)}</mo>`;
		} else if (t.type === 'space') {
			baseHtml = `<mspace width="${t.width || '0.222em'}"/>`;
		} else if (t.type === 'frac') {
			const numHtml = renderTokens(tokenize(t.num));
			const denHtml = renderTokens(tokenize(t.den));
			baseHtml = `<mfrac><mrow>${numHtml}</mrow><mrow>${denHtml}</mrow></mfrac>`;
		} else if (t.type === 'matrix') {
			const rows = t.inner.split(/\\\\/).map((r) => r.trim()).filter(Boolean);
			const tableHtml = rows.map((r) => {
				const cells = r.split('&').map((c) => `<mtd>${renderTokens(tokenize(c.trim()))}</mtd>`).join('');
				return `<mtr>${cells}</mtr>`;
			}).join('');
			const open = t.delim === 'paren' ? '(' : '[';
			const close = t.delim === 'paren' ? ')' : ']';
			baseHtml = `<mrow><mo>${open}</mo><mtable>${tableHtml}</mtable><mo>${close}</mo></mrow>`;
		}

		// Check if immediately followed by subscript and/or superscript
		const next1 = tokens[idx + 1];
		let subVal = null;
		let supVal = null;

		if (next1 && next1.type === 'sub') {
			subVal = next1.val;
			idx++;
			if (tokens[idx + 1] && tokens[idx + 1].type === 'sup') {
				supVal = tokens[idx + 1].val;
				idx++;
			}
		} else if (next1 && next1.type === 'sup') {
			supVal = next1.val;
			idx++;
			if (tokens[idx + 1] && tokens[idx + 1].type === 'sub') {
				subVal = tokens[idx + 1].val;
				idx++;
			}
		}

		if (subVal !== null && supVal !== null) {
			const subHtml = renderTokens(tokenize(subVal));
			const supHtml = renderTokens(tokenize(supVal));
			res += `<msubsup>${baseHtml}<mrow>${subHtml}</mrow><mrow>${supHtml}</mrow></msubsup>`;
		} else if (subVal !== null) {
			const subHtml = renderTokens(tokenize(subVal));
			res += `<msub>${baseHtml}<mrow>${subHtml}</mrow></msub>`;
		} else if (supVal !== null) {
			const supHtml = renderTokens(tokenize(supVal));
			res += `<msup>${baseHtml}<mrow>${supHtml}</mrow></msup>`;
		} else {
			res += baseHtml;
		}

		idx++;
	}
	return res;
}

export function latexToMathML(latex, display = false) {
	const trimmed = latex.trim();
	if (!trimmed) return '';
	const body = renderTokens(tokenize(trimmed));
	return display
		? `<math display="block" class="math-display"><mrow>${body}</mrow></math>`
		: `<math class="math-inline"><mrow>${body}</mrow></math>`;
}
