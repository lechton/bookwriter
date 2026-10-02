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
	['module', 'shell'],
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
	return file.split('/').pop().replace(/\.ts$/, '');
}

// Test files never take part in the runtime wiring; they appear in the left
// file tree only and never draw a box on the canvas.
const isTestFile = (file) => /\.spec\.ts$/.test(file) || /\.test\.ts$/.test(file);

function inferKind(file) {
	const name = displayName(file).toLowerCase();
	if (name.includes('module')) return 'shell';
	if (name.includes('controller')) return 'navigation';
	if (name.includes('service') || name.includes('repository')) return 'card';
	if (name.includes('guard') || name.includes('middleware')) return 'badge';
	if (name.includes('pipe') || name.includes('filter') || name.includes('interceptor')) return 'generic';
	if (name === 'main') return 'button';
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
	if (!/^[A-Za-z0-9_.\/-]+\.(ts|js|json)$/.test(file)) {
		throw new Error(`components block line ${lineNumber}: "${parts[0]}" must be a .ts, .js, or .json file path`);
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
		throw new Error('components block must contain at least one .ts entry');
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

// Canonical tree grouping: top-level folders, files exactly one level deep,
// computed from the filename suffix the way the NestJS CLI itself groups
// roles. Controllers live in controllers/, services (and repositories) in
// services/, module files in modules/, and everything else (main.ts, DTOs,
// guards, pipes, filters, interceptors, entities) in src/. The suffix match
// accepts both kebab-case (users.controller.ts, the CLI convention) and
// PascalCase (UsersController.ts) filenames. Author path prefixes are
// ignored; the grouping is computed from the filename so the tree is always
// the canonical shape. Test files appear in the LEFT FILE TREE only: the
// right canvas shows the runtime wiring, and a spec file never runs in it.
function folderFor(file) {
	if (/\.?controller\.ts$/i.test(file)) return 'controllers';
	if (/\.?(?:service|repository)\.ts$/i.test(file)) return 'services';
	if (/\.?module\.ts$/i.test(file)) return 'modules';
	return 'src';
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
const tsIcon = '<svg class="component-explorer-icon component-explorer-js" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M8 12h8"/><path d="M8 16h5"/></svg>';

function renderFileTree(nodes, activePath) {
	return `<ul class="component-explorer-tree">${orderFileNodes(nodes).map((node) => {
		const isFolder = node.children.length > 0;
		const active = node.isFile && node.path === activePath ? ' active' : '';
		const children = isFolder ? renderFileTree(node.children, activePath) : '';
		const fileIcon = folderIcon ? (isFolder ? folderIcon : tsIcon) : tsIcon;
		return `<li><div class="component-explorer-tree-label${active}">${fileIcon}<span>${escapeHtml(node.name)}</span></div>${children}</li>`;
	}).join('')}</ul>`;
}

// The fourth field is the component's observable outcome, authored by hand
// from the lecture's actual code and values: the HTTP response body, the
// status line, or the console output the lecture's code really produces.
// Lines are separated by ";;" and may carry **bold** for the load-bearing
// value. When present, these lines replace the deterministic mock surface: a
// panel must never show an empty placeholder where the learner should see
// the computed result.
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
	const renderedChildren = node.children.filter((child) => !isTestFile(child.file));
	const children = renderedChildren.length
		? `<div class="component-explorer-children">${renderedChildren.map(renderComponentNode).join('')}</div>`
		: '';
	return `<div class="component-explorer-node${kindClass}"><div class="component-explorer-label"><span>${escapeHtml(displayName(node.file))}</span>${props}</div>${renderSurface(node)}${children}</div>`;
}

export function renderComponentExplorer(source, title = '') {
	const root = parseComponentTree(source);
	const fileTree = buildFileTree(root);
	const activeNode = root.children.find((child) => !isTestFile(child.file)) || root;
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
