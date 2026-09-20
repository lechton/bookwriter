const escapeHtml = (value) => String(value)
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#39;');

const HOOK_RE = /^use[A-Z][A-Za-z0-9]*$/;
const KEYWORDS = new Set([
	'let', 'const', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
	'await', 'async', 'import', 'export', 'default', 'from', 'true', 'false', 'null', 'undefined'
]);

const KNOWN_KINDS = new Set([
	'shell',
	'header',
	'navigation',
	'profile',
	'badge',
	'counter',
	'card',
	'form',
	'table',
	'button',
	'branch',
	'instances',
	'generic',
]);

const KIND_ALIASES = new Map([
	['app', 'shell'],
	['nav', 'navigation'],
	['sidebar', 'navigation'],
	['user', 'profile'],
	['avatar', 'profile'],
	['status', 'badge'],
	['pill', 'badge'],
	['count', 'counter'],
	['grid', 'table'],
	['list', 'table'],
	['input', 'form'],
	['conditional', 'branch'],
	['repeat', 'instances'],
	['loop', 'instances'],
]);

const isModuleFile = (file) => /\.(js|ts)$/.test(file);

function normalisePath(path) {
	return (path || '')
		.trim()
		.replace(/\\/g, '/')
		.replace(/^\.\/+/, '')
		.replace(/^\/+/, '')
		.replace(/^src\/+/, '');
}

function displayName(file) {
	return file.split('/').pop().replace(/\.(jsx|tsx)$/, '');
}

function inferKind(file) {
	if (/\.(js|ts)$/.test(file)) return 'generic';
	const name = displayName(file).toLowerCase();
	if (name.includes('app') || name.includes('layout') || name.includes('page')) return 'shell';
	if (name.includes('header')) return 'header';
	if (name.includes('sidebar') || name.includes('nav')) return 'navigation';
	if (name.includes('profile') || name.includes('user')) return 'profile';
	if (name.includes('badge') || name.includes('status')) return 'badge';
	if (name.includes('counter') || name.includes('count')) return 'counter';
	if (name.includes('table') || name.includes('grid')) return 'table';
	if (name.includes('form') || name.includes('input') || name.includes('login')) return 'form';
	if (name.includes('button')) return 'button';
	if (name.includes('card') || name.includes('product')) return 'card';
	if (name.includes('branch') || name.includes('conditional')) return 'branch';
	return 'generic';
}

function normaliseKind(rawKind, file) {
	const requested = (rawKind || '').trim().toLowerCase().replace(/\s+/g, '-');
	const kind = KIND_ALIASES.get(requested) || requested || inferKind(file);
	return KNOWN_KINDS.has(kind) ? kind : 'generic';
}

function tokenizeLine(content) {
	if (!content) return '';

	let out = '';
	let i = 0;
	const n = content.length;

	const isIdentStart = (c) => /[A-Za-z_$]/.test(c);
	const isIdent = (c) => /[A-Za-z0-9_$]/.test(c);

	while (i < n) {
		// Comments: // ...
		if (content[i] === '/' && content[i + 1] === '/') {
			const cmt = content.slice(i);
			out += `<span class="cce-hl-cmt">${escapeHtml(cmt)}</span>`;
			break;
		}

		// Strings: ", ', `
		if (content[i] === '"' || content[i] === "'" || content[i] === '`') {
			const quote = content[i];
			let j = i + 1;
			while (j < n && content[j] !== quote) {
				if (content[j] === '\\') j++;
				j++;
			}
			const lit = content.slice(i, Math.min(j + 1, n));
			out += `<span class="cce-hl-str">${escapeHtml(lit)}</span>`;
			i = j + 1;
			continue;
		}

		// JSX Tags: </Tag> or <Tag ... or <Tag />
		if (content[i] === '<') {
			// Closing tag </Tag>
			if (content[i + 1] === '/') {
				let j = i + 2;
				while (j < n && (isIdent(content[j]) || content[j] === '.')) j++;
				const tagName = content.slice(i, j);
				out += `<span class="cce-hl-tag">${escapeHtml(tagName)}</span>`;
				i = j;
				continue;
			}
			// Opening tag <Tag
			if (isIdentStart(content[i + 1])) {
				let j = i + 1;
				while (j < n && (isIdent(content[j]) || content[j] === '.')) j++;
				const tagName = content.slice(i, j);
				out += `<span class="cce-hl-tag">${escapeHtml(tagName)}</span>`;
				i = j;
				continue;
			}
		}

		// JSX Tag closing: > or />
		if (content[i] === '/' && content[i + 1] === '>') {
			out += `<span class="cce-hl-tag">/&gt;</span>`;
			i += 2;
			continue;
		}
		if (content[i] === '>') {
			out += `<span class="cce-hl-tag">&gt;</span>`;
			i++;
			continue;
		}

		// Identifiers, keywords, hooks, props
		if (isIdentStart(content[i])) {
			let j = i + 1;
			while (j < n && isIdent(content[j])) j++;
			const word = content.slice(i, j);

			// Check if followed by '=' -> JSX prop attribute
			let k = j;
			while (k < n && (content[k] === ' ' || content[k] === '\t')) k++;
			if (k < n && content[k] === '=') {
				out += `<span class="cce-hl-attr">${escapeHtml(word)}</span>`;
				i = j;
				continue;
			}

			if (HOOK_RE.test(word)) {
				out += `<span class="cce-hl-hook">${escapeHtml(word)}</span>`;
			} else if (KEYWORDS.has(word)) {
				out += `<span class="cce-hl-kw">${escapeHtml(word)}</span>`;
			} else if (k < n && content[k] === '(') {
				out += `<span class="cce-hl-fn">${escapeHtml(word)}</span>`;
			} else {
				out += `<span class="cce-hl-ident">${escapeHtml(word)}</span>`;
			}
			i = j;
			continue;
		}

		// Numbers
		if (/\d/.test(content[i]) && (i === 0 || !isIdent(content[i - 1]))) {
			const m = content.slice(i).match(/^\d+(\.\d+)?/);
			if (m) {
				out += `<span class="cce-hl-num">${escapeHtml(m[0])}</span>`;
				i += m[0].length;
				continue;
			}
		}

		// Punctuation and braces
		if (content[i] === '{' || content[i] === '}') {
			out += `<span class="cce-hl-brace">${escapeHtml(content[i])}</span>`;
		} else if (content[i] === '(' || content[i] === ')') {
			out += `<span class="cce-hl-paren">${escapeHtml(content[i])}</span>`;
		} else {
			out += escapeHtml(content[i]);
		}
		i++;
	}

	return out;
}

function formatCodeLine(rawCode) {
	const indentMatch = rawCode.match(/^(\s*)/);
	const indentStr = indentMatch ? indentMatch[1] : '';
	const content = rawCode.slice(indentStr.length);
	const leadingSpaces = indentStr.replace(/ /g, '&nbsp;').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
	return leadingSpaces + tokenizeLine(content);
}

function parseEntry(rawLine, lineNumber) {
	const expanded = rawLine.replace(/\t/g, '  ');
	const match = expanded.match(/^(\s*)(.*)$/);
	const indentation = match[1].length;
	const content = match[2].trim();
	if (!content) return null;
	if (indentation % 2 !== 0) {
		throw new Error(`component-code block line ${lineNumber}: indentation must use two spaces per level`);
	}

	const parts = content.split('|').map((part) => part.trim());
	if (parts.length > 4) {
		throw new Error(`component-code block line ${lineNumber}: use at most four pipe-separated fields`);
	}

	const file = normalisePath(parts[0]);
	if (!/^[A-Za-z0-9_./-]+\.(jsx|tsx|js|ts)$/.test(file)) {
		throw new Error(`component-code block line ${lineNumber}: "${parts[0]}" must be a .jsx, .tsx, .js, or .ts file path`);
	}

	if (parts[1] && /^\[(?:role|explain|desc):/i.test(parts[1])) {
		throw new Error(`component-code block line ${lineNumber}: [role: ...] payload must be placed in field 4 (renders), not field 2 (props). Use format: file | props | kind | [role: ...]`);
	}
	if (parts[2] && /^\[(?:role|explain|desc):/i.test(parts[2])) {
		throw new Error(`component-code block line ${lineNumber}: [role: ...] payload must be placed in field 4 (renders), not field 3 (kind). Use format: file | props | kind | [role: ...]`);
	}

	return {
		file,
		props: parts[1] || '',
		kind: normaliseKind(parts[2], file),
		renders: parts[3] || '',
		depth: indentation / 2,
		children: [],
	};
}

export function parseComponentTree(source) {
	const roots = [];
	const stack = [];
	const lines = source.split(/\r?\n/);

	for (let index = 0; index < lines.length; index += 1) {
		const entry = parseEntry(lines[index], index + 1);
		if (!entry) continue;
		if (entry.depth > stack.length) {
			throw new Error(`component-code block line ${index + 1}: a child cannot skip a tree level`);
		}

		const parent = entry.depth === 0 ? null : stack[entry.depth - 1];
		if (parent) {
			parent.children.push(entry);
		} else {
			roots.push(entry);
		}
		stack[entry.depth] = entry;
		stack.length = entry.depth + 1;
	}

	if (roots.length === 0) {
		throw new Error('component-code block must contain at least one entry');
	}
	if (roots.length > 1) {
		throw new Error(`component-code block has multiple root components (${roots.map((r) => r.file).join(', ')}). A component tree must have exactly one root. If subsequent components are children, indent them with 2 spaces per level.`);
	}

	return roots[0];
}

function renderRenderItem(raw, node) {
	const text = raw.trim();
	// 0. Role / Explanation callout: [role: ...] or [explain: ...] or [desc: ...]
	const mRole = text.match(/^\[(?:role|explain|desc):\s*([\s\S]+?)\]$/i);
	if (mRole) {
		const rawText = mRole[1].trim();
		const formatted = escapeHtml(rawText)
			.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
			.replace(/`([^`]+)`/g, '<code>$1</code>');
		return `<div class="surface-ui-role"><p class="surface-ui-role-text">${formatted}</p></div>`;
	}
	// 1. Code snippet: [code: ...] or `...` or code: ...
	const mCode = text.match(/^\[code:[ \t]?([\s\S]+?)\]$/i) || text.match(/^code:[ \t]?(.+)$/i) || text.match(/^`([^`]+)`$/);
	if (mCode) {
		return `<div class="surface-ui-code"><code>${formatCodeLine(mCode[1].replace(/\s+$/, ''))}</code></div>`;
	}
	// 2. Input field: [input: ...] or [placeholder...]
	const mInput = text.match(/^\[(?:input:\s*)?([^\]]+\.\.\.)\]$/i) || text.match(/^\[input:\s*([^\]]+)\]$/i) || text.match(/^input:\s*(.+)$/i);
	if (mInput) {
		return `<div class="surface-ui-input"><span class="surface-ui-input-placeholder">${escapeHtml(mInput[1].trim())}</span></div>`;
	}
	// 3. Status / Alert banner: [status: ...] or status: ... or [alert: ...]
	const mStatus = text.match(/^\[(?:status|alert):\s*([^\]]+)\]$/i) || text.match(/^(?:status|alert):\s*(.+)$/i);
	if (mStatus) {
		return `<div class="surface-ui-status"><span class="surface-ui-status-dot"></span><span class="surface-ui-status-text">${escapeHtml(mStatus[1].trim())}</span></div>`;
	}
	// 4. Badge / Tag: [badge: ...] or badge: ... or [tag: ...]
	const mBadge = text.match(/^\[(?:badge|tag):\s*([^\]]+)\]$/i) || text.match(/^(?:badge|tag):\s*(.+)$/i);
	if (mBadge) {
		return `<span class="surface-ui-badge">${escapeHtml(mBadge[1].trim())}</span>`;
	}
	// 5. Button: [button: ...] or [Button Label] or kind="button"
	const mBtn = text.match(/^\[(?:button:\s*)?([^\]]+)\]$/i) || text.match(/^button:\s*(.+)$/i);
	if (mBtn && !mBtn[1].includes(';;')) {
		return `<span class="surface-ui-btn">${escapeHtml(mBtn[1].trim())}</span>`;
	}
	if (node && node.kind === 'button' && !text.startsWith('[') && !text.startsWith('`')) {
		return `<span class="surface-ui-btn">${escapeHtml(text)}</span>`;
	}
	// 6. Fallback styled render line
	return `<span class="surface-render-line">${escapeHtml(text)}</span>`;
}

function renderSurface(node) {
	const name = escapeHtml(displayName(node.file));
	switch (node.kind) {
		case 'badge':
			return '<div class="component-explorer-surface surface-badge">STATUS</div>';
		case 'counter':
			return '<div class="component-explorer-surface surface-counter"><span class="surface-button">+ ADD</span><strong>5</strong></div>';
		case 'header':
			return '<div class="component-explorer-surface surface-header"><strong>NEWSROOM</strong><span></span><span></span></div>';
		case 'navigation':
			return '<div class="component-explorer-surface surface-navigation"><i></i><i></i><i></i></div>';
		case 'card':
			return '<div class="component-explorer-surface surface-card"><span></span><i></i><i></i></div>';
		case 'form':
			return '<div class="component-explorer-surface surface-form"><span></span><span></span><b>SUBMIT</b></div>';
		case 'table':
			return '<div class="component-explorer-surface surface-table"><i></i><i></i><i></i></div>';
		case 'button':
			return '<div class="component-explorer-surface surface-button-only">ACTION</div>';
		case 'branch':
			return '<div class="component-explorer-surface surface-branch"><span>CONDITIONAL BRANCH</span></div>';
		default:
			return `<div class="component-explorer-surface surface-generic">${name}</div>`;
	}
}

function renderComponentNode(node) {
	const kindClass = ` component-kind-${node.kind}`;
	const props = (node.props && node.props.trim().toLowerCase() !== 'none')
		? `<span class="component-explorer-props">${escapeHtml(node.props)}</span>`
		: '';
	const renderedChildren = node.children.filter((child) => !isModuleFile(child.file));

	let topSurface = '';

	if (node.renders) {
		const items = node.renders
			.split(';;')
			.map((line) => line.trim())
			.filter(Boolean);

		topSurface = `<div class="component-explorer-surface surface-render">${items.map((l) => renderRenderItem(l, node)).join('')}</div>`;
	} else if (renderedChildren.length === 0) {
		topSurface = renderSurface(node);
	}

	const children = renderedChildren.length
		? `<div class="component-explorer-children">${renderedChildren.map(renderComponentNode).join('')}</div>`
		: '';

	return `<div class="component-explorer-node${kindClass}"><div class="component-explorer-label"><span>${escapeHtml(displayName(node.file))}</span>${props}</div>${topSurface}${children}</div>`;
}

export function renderComponentCodeExplorer(source, title = '') {
	const root = parseComponentTree(source);
	const explorerTitle = title || 'Component Code Architecture';
	const ariaLabel = `Component hierarchy for ${explorerTitle}`;

	return `<section class="component-explorer component-code-explorer" aria-label="${escapeHtml(ariaLabel)}">
	<div class="component-explorer-bar">
		<div class="component-explorer-dots"><i></i><i></i><i></i></div>
		<span class="component-explorer-title">${escapeHtml(explorerTitle)}</span>
	</div>
	<div class="component-explorer-stage cce-stage-full">
		<div class="component-explorer-canvas cce-canvas-full">${renderComponentNode(root)}</div>
	</div>
</section>`;
}
