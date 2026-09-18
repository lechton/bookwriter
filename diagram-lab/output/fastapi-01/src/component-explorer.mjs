const escapeHtml = (value) => String(value)
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#39;');

const KIND_ALIASES = new Map([
	['app', 'shell'],
	['layout', 'shell'],
	['page', 'shell'],
	['navigation', 'navigation'],
	['nav', 'navigation'],
	['input', 'form'],
	['condition', 'branch'],
	['conditional', 'branch'],
	['instance', 'instances'],
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

function normalisePath(file) {
	return file
		.trim()
		.replace(/^\.\/+/, '')
		.replace(/^\/+/, '')
		.replace(/^src\/+/, '');
}

function displayName(file) {
	return file.split('/').pop().replace(/\.(jsx|tsx)$/, '');
}

function inferKind(file) {
	// Shared logic modules (.js / .ts) have no DOM surface of their own; they
	// always render as a generic module node.
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

function parseEntry(rawLine, lineNumber) {
	const expanded = rawLine.replace(/\t/g, '  ');
	const match = expanded.match(/^(\s*)(.*)$/);
	const indentation = match[1].length;
	const content = match[2].trim();
	if (!content) return null;
	if (indentation % 2 !== 0) {
		throw new Error(`components block line ${lineNumber}: indentation must use two spaces per level`);
	}

	const parts = content.split('|').map((part) => part.trim());
	if (parts.length > 4) {
		throw new Error(`components block line ${lineNumber}: use at most four pipe-separated fields`);
	}

	const file = normalisePath(parts[0]);
	if (!/^[A-Za-z0-9_./-]+\.(jsx|tsx|js|ts)$/.test(file)) {
		throw new Error(`components block line ${lineNumber}: "${parts[0]}" must be a .jsx, .tsx, .js, or .ts file path`);
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
			throw new Error(`components block line ${index + 1}: a child cannot skip a tree level`);
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
		throw new Error('components block must contain at least one .jsx entry');
	}
	if (roots.length > 1) {
		throw new Error('components block must contain exactly one root entry');
	}

	return roots[0];
}

function walk(node, callback) {
	callback(node);
	for (const child of node.children) walk(child, callback);
}

// Canonical tree grouping: top-level folders, files exactly one level deep.
// .jsx/.tsx component files live in components/, shared-logic modules (.js/.ts)
// in state/ (shown only when a module exists). Author path prefixes are
// ignored; the grouping is computed from the file type so the tree is always
// the canonical shape. Modules appear in the LEFT FILE TREE only: the right
// canvas shows the rendered visual hierarchy, and a logic module never renders.
const isModuleFile = (file) => /\.(js|ts)$/.test(file);

function folderFor(file) {
	return isModuleFile(file) ? 'state' : 'components';
}

function buildFileTree(rootComponent) {
	const root = { name: '', path: '', children: [], isFile: false };

	function addFile(file) {
		const folder = folderFor(file);
		const base = file.split('/').pop();
		let folderNode = root.children.find((candidate) => candidate.name === folder);
		if (!folderNode) {
			folderNode = { name: folder, path: folder, children: [], isFile: false };
			root.children.push(folderNode);
		}
		if (!folderNode.children.some((candidate) => candidate.name === base)) {
			folderNode.children.push({ name: base, path: `${folder}/${base}`, children: [], isFile: true });
		}
	}

	walk(rootComponent, (node) => addFile(node.file));
	return root;
}

function orderFileNodes(nodes) {
	return [...nodes].sort((a, b) => {
		const aFolder = a.children.length > 0;
		const bFolder = b.children.length > 0;
		if (aFolder !== bFolder) return aFolder ? -1 : 1;
		return a.name.localeCompare(b.name);
	});
}

const folderIcon = '<svg class="component-explorer-icon component-explorer-folder" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5.5C2 4.119 3.119 3 4.5 3h4.764c.732 0 1.425.327 1.887.89l1.698 2.072A1.5 1.5 0 0 0 13.91 6.5H19.5C20.881 6.5 22 7.619 22 9v10.5c0 1.381-1.119 2.5-2.5 2.5h-15C3.119 22 2 20.881 2 19.5v-14z"/></svg>';
const componentIcon = '<svg class="component-explorer-icon component-explorer-component" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"/></svg>';
const jsIcon = '<svg class="component-explorer-icon component-explorer-js" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9.5 13c-.8 1-1.5 1.7-1.5 2.5s.7 1.5 1.5 2.5"/><path d="M14.5 13c.8 1 1.5 1.7 1.5 2.5s-.7 1.5-1.5 2.5"/></svg>';

function renderFileTree(nodes, activePath) {
	return `<ul class="component-explorer-tree">${orderFileNodes(nodes).map((node) => {
		const isFolder = node.children.length > 0;
		const active = node.isFile && node.path === activePath ? ' active' : '';
		const children = isFolder ? renderFileTree(node.children, activePath) : '';
		const fileIcon = /\.(jsx|tsx)$/.test(node.name) ? componentIcon : jsIcon;
		return `<li><div class="component-explorer-tree-label${active}">${isFolder ? folderIcon : fileIcon}<span>${escapeHtml(node.name)}</span></div>${children}</li>`;
	}).join('')}</ul>`;
}

// The fourth field is the component's real rendered UI, authored by hand from
// the lecture's actual code and values. Lines are separated by ";;" and may
// carry **bold** for the load-bearing value. When present, these lines replace
// the deterministic mock surface: a panel must never show an empty placeholder
// where the learner should see the computed result.
function renderInline(text) {
	return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function renderSurface(node) {
	const name = escapeHtml(displayName(node.file));
	if (node.renders) {
		const lines = node.renders
			.split(';;')
			.map((line) => line.trim())
			.filter(Boolean)
			.map((line) => `<span class="surface-render-line">${renderInline(line)}</span>`)
			.join('');
		return `<div class="component-explorer-surface surface-render">${lines}</div>`;
	}
	switch (node.kind) {
		case 'profile':
			return '<div class="component-explorer-surface surface-profile"><span class="surface-avatar"></span><span class="surface-lines"><i></i><i></i></span></div>';
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
		case 'instances': {
			const countMatch = node.props.match(/\b(\d+)\b/);
			const count = Math.max(2, Math.min(8, Number(countMatch?.[1] || 3)));
			const instances = Array.from({ length: count }, (_, index) => `<span><b>#${index + 1}</b>${name}</span>`).join('');
			return `<div class="component-explorer-surface surface-instances">${instances}</div>`;
		}
		case 'shell':
			return node.children.length ? '' : `<div class="component-explorer-surface surface-generic">${name}</div>`;
		default:
			return `<div class="component-explorer-surface surface-generic">${name}</div>`;
	}
}

function renderComponentNode(node) {
	const kindClass = ` component-kind-${node.kind}`;
	const props = node.props ? `<span class="component-explorer-props">${escapeHtml(node.props)}</span>` : '';
	const renderedChildren = node.children.filter((child) => !isModuleFile(child.file));
	const children = renderedChildren.length
		? `<div class="component-explorer-children">${renderedChildren.map(renderComponentNode).join('')}</div>`
		: '';
	return `<div class="component-explorer-node${kindClass}"><div class="component-explorer-label"><span>${escapeHtml(displayName(node.file))}</span>${props}</div>${renderSurface(node)}${children}</div>`;
}

export function renderComponentExplorer(source, title = '') {
	const root = parseComponentTree(source);
	const fileTree = buildFileTree(root);
	const activeNode = root.children.find((child) => !isModuleFile(child.file)) || root;
const activePath = `${folderFor(activeNode.file)}/${activeNode.file.split('/').pop()}`;
	const explorerTitle = title || 'Component Explorer';
	const ariaLabel = `Component hierarchy for ${explorerTitle}`;

	return `<section class="component-explorer" aria-label="${escapeHtml(ariaLabel)}">
	<div class="component-explorer-bar">
		<div class="component-explorer-dots"><i></i><i></i><i></i></div>
		<span class="component-explorer-title">${escapeHtml(explorerTitle)}</span>
	</div>
	<div class="component-explorer-window">
		<aside class="component-explorer-sidebar">
			<div class="component-explorer-sidebar-title">Project Files</div>
			${renderFileTree(fileTree.children, activePath)}
		</aside>
		<div class="component-explorer-stage">
			<div class="component-explorer-canvas">${renderComponentNode(root)}</div>
		</div>
	</div>
</section>`;
}
