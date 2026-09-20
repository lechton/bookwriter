const escapeHtml = (value) => String(value)
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#39;');

const folderSvg = `<svg class="fe-icon fe-icon-folder" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 5.5C2 4.119 3.119 3 4.5 3h4.764c.732 0 1.425.327 1.887.89l1.698 2.072A1.5 1.5 0 0 0 13.91 6.5H19.5C20.881 6.5 22 7.619 22 9v10.5c0 1.381-1.119 2.5-2.5 2.5h-15C3.119 22 2 20.881 2 19.5v-14z" fill="#fcd34d" stroke="#d97706"/></svg>`;

const reactSvg = `<svg class="fe-icon fe-icon-react" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="2.2" fill="#0284c7"/><ellipse cx="12" cy="12" rx="10" ry="4.2"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)"/></svg>`;

const jsSvg = `<svg class="fe-icon fe-icon-js" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#fef3c7"/><polyline points="14 2 14 8 20 8"/><path d="M10 13v4a1 1 0 0 1-2 0"/><path d="M14 13h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2v2"/></svg>`;

const cssSvg = `<svg class="fe-icon fe-icon-css" viewBox="0 0 24 24" fill="none" stroke="#db2777" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#fdf2f8"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>`;

const genericFileSvg = `<svg class="fe-icon fe-icon-file" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#f1f5f9"/><polyline points="14 2 14 8 20 8"/></svg>`;

function getFileIcon(name) {
	if (/\.(jsx|tsx)$/i.test(name)) return reactSvg;
	if (/\.(js|ts|mjs)$/i.test(name)) return jsSvg;
	if (/\.(css|scss)$/i.test(name)) return cssSvg;
	return genericFileSvg;
}

function classifyRoleClass(role) {
	const r = (role || '').toLowerCase();
	if (r.includes('shell') || r.includes('root') || r.includes('layout')) return 'fe-role-shell';
	if (r.includes('form') || r.includes('boundary') || r.includes('action')) return 'fe-role-boundary';
	if (r.includes('consumer') || r.includes('hook') || r.includes('status')) return 'fe-role-consumer';
	if (r.includes('button') || r.includes('leaf') || r.includes('ui') || r.includes('widget')) return 'fe-role-leaf';
	if (r.includes('server') || r.includes('api') || r.includes('network')) return 'fe-role-server';
	if (r.includes('state') || r.includes('reducer') || r.includes('store')) return 'fe-role-state';
	return 'fe-role-generic';
}

function parseFileExplorerSource(source) {
	const rawLines = source.split(/\r?\n/);
	const items = [];

	for (let i = 0; i < rawLines.length; i++) {
		const raw = rawLines[i];
		if (!raw.trim() || raw.trim().startsWith('#')) continue;

		const spaceLine = raw.replace(/\t/g, '  ');
		const indentMatch = spaceLine.match(/^(\s*)/);
		const indentSpaces = indentMatch ? indentMatch[1].length : 0;
		const depth = Math.floor(indentSpaces / 2);

		const parts = raw.trim().split('|').map((p) => p.trim());
		const target = parts[0] || '';
		const role = parts[1] || '';
		const desc = parts[2] || '';

		const isFolder = target.endsWith('/') || (!target.includes('.') && !role && !desc);
		const cleanName = isFolder ? target.replace(/\/+$/, '') + '/' : target;

		items.push({
			name: cleanName,
			isFolder,
			role,
			desc,
			depth,
		});
	}

	return items;
}

function computeTreeStructure(items) {
	const result = [];
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const segments = [];

		for (let col = 0; col < item.depth; col++) {
			if (col === item.depth - 1) {
				// Immediate parent connector
				let isLast = true;
				for (let k = i + 1; k < items.length; k++) {
					if (items[k].depth < item.depth) break;
					if (items[k].depth === item.depth) {
						isLast = false;
						break;
					}
				}
				segments.push(isLast ? 'l' : 't');
			} else {
				// Ancestor pass-through line
				let hasFutureSibling = false;
				for (let k = i + 1; k < items.length; k++) {
					if (items[k].depth <= col) break;
					if (items[k].depth === col + 1) {
						hasFutureSibling = true;
						break;
					}
				}
				segments.push(hasFutureSibling ? 'line' : 'blank');
			}
		}

		const hasChildren = (i < items.length - 1) && (items[i + 1].depth > item.depth);

		result.push({
			...item,
			segments,
			hasChildren,
		});
	}
	return result;
}

export function renderFileExplorer(source, title = '') {
	const rawItems = parseFileExplorerSource(source);
	const items = computeTreeStructure(rawItems);
	const explorerTitle = title || 'Project Files & Architecture';

	let rowsHtml = '';
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const icon = item.isFolder ? folderSvg : getFileIcon(item.name);

		const roleBadge = item.role
			? `<span class="fe-badge ${classifyRoleClass(item.role)}">${escapeHtml(item.role)}</span>`
			: '<span class="fe-badge fe-badge-folder">Directory</span>';

		const descText = item.desc
			? escapeHtml(item.desc).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>')
			: (item.isFolder ? '<span class="fe-muted">Contains component modules</span>' : '');

		const segsHtml = item.segments.map((s) => `<span class="fe-seg fe-seg-${s}"></span>`).join('');

		rowsHtml += `
		<div class="fe-row ${item.isFolder ? 'fe-row-folder' : 'fe-row-file'}">
			<div class="fe-cell fe-cell-file">
				<div class="fe-file-name">
					${segsHtml}
					<div class="fe-icon-slot ${item.hasChildren ? 'has-children' : ''}">
						${icon}
					</div>
					<span class="fe-name-text">${escapeHtml(item.name)}</span>
				</div>
			</div>
			<div class="fe-cell fe-cell-role">
				${roleBadge}
			</div>
			<div class="fe-cell fe-cell-desc">
				<div class="fe-desc-text">${descText}</div>
			</div>
		</div>`;
	}

	return `
<section class="file-explorer" aria-label="${escapeHtml(explorerTitle)}">
	<div class="file-explorer-bar">
		<div class="file-explorer-dots"><i></i><i></i><i></i></div>
		<span class="file-explorer-title">${escapeHtml(explorerTitle)}</span>
	</div>
	<div class="file-explorer-body">
		<div class="fe-table">
			<div class="fe-header-row">
				<div class="fe-header-cell fe-cell-file">FILE / DIRECTORY</div>
				<div class="fe-header-cell fe-cell-role">ROLE</div>
				<div class="fe-header-cell fe-cell-desc">ARCHITECTURAL RESPONSIBILITY</div>
			</div>
			${rowsHtml}
		</div>
	</div>
</section>`;
}
