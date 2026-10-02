/* ============================================================
   a11y-canvas.mjs — the Accessibility Canvas panel generator
   ------------------------------------------------------------
   Renders a browser-window mockup of the National Times site
   with accessibility annotation layers: focus order, landmarks,
   screen reader announcements, contrast chips, alt text,
   keyboard keys, ARIA state, Core Web Vitals.

   Consumed by build-lectures.mjs from a ```canvas fenced block:

   ```canvas title="national-times — checkout form"
   url=www.nationaltimes.com/subscribe
   masthead | The National Times | landmark=banner
   nav | World; Politics; Culture | landmark=navigation
   h1 | Subscribe to The National Times
   input |  | label="Email address" | focus=1
   button | Subscribe | focus=2 | sr="Subscribe, button"
   sr | "Email address, edit text, required"
   ```

   Element lines:  `type | content | annotations`
   Standalone lines: `url=…`, `zoom=…`, or a strip:
   `sr | text`, `kbd | Tab`, `contrast | fg on bg | ratio verdict`,
   `vitals | LCP=4.2s poor; INP=120ms good; CLS=0.02 good`,
   `focus-order | Email → Subscribe → Refund policy`
   ============================================================ */

const escapeHtml = (value) => String(value)
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#39;');

const ELEMENT_TYPES = new Set([
	'skip', 'masthead', 'nav', 'h1', 'h2', 'h3', 'heading', 'text', 'image', 'button',
	'link', 'input', 'select', 'dialog', 'switch', 'badge', 'list', 'card', 'footer', 'region',
	'tab', 'tablist', 'menu', 'combobox',
]);

const STRIP_TYPES = new Set(['sr', 'kbd', 'contrast', 'vitals', 'focus-order']);

// Annotations: key=value (quoted when the value has spaces) or bare flags.
function parseAnnotations(raw, lineNumber) {
	const annotations = {};
	const flagRe = /(\w[-\w]*)=("[^"]*"|\S+)|(\bfocus\b|\bwrong\b|\bright\b|\bunlabelled\b|\bsr-only\b|\bvisually-hidden\b|\bghost\b)/g;
	let m;
	while ((m = flagRe.exec(raw)) !== null) {
		if (m[3]) {
			if (m[3] === 'focus') {
				// bare `focus` gets its number later, in reading order
				annotations.focus = annotations.focus || '';
			} else {
				annotations[m[3]] = true;
			}
			continue;
		}
		const key = m[1];
		const value = m[2].replace(/^"|"$/g, '');
		annotations[key] = value;
	}
	return annotations;
}

function parseLine(rawLine, index) {
	const line = rawLine.replace(/\t/g, '  ').trim();
	if (!line || line.startsWith('#')) return null;
	const parts = line.split('|').map((p) => p.trim());

	// Key=value chrome lines.
	if (/^(url|zoom)=/.test(parts[0]) && parts.length === 1) {
		const [key, value] = parts[0].split('=');
		return { kind: 'chrome', key, value, index };
	}

	const type = parts[0].toLowerCase();
	if (STRIP_TYPES.has(type)) {
		return { kind: 'strip', type, content: parts.slice(1).join(' | '), index };
	}
	if (ELEMENT_TYPES.has(type)) {
		return {
			kind: 'element',
			type,
			content: parts[1] || '',
			annotations: parseAnnotations(parts.slice(2).join(' '), index),
			index,
		};
	}
	console.warn(`  note canvas line ${index + 1}: unknown element "${parts[0]}"; rendered as a generic block`);
	return { kind: 'element', type: 'region', content: parts[1] || parts[0], annotations: parseAnnotations(parts.slice(2).join(' '), index), index };
}

function contrastVerdict(value) {
	const keyword = /(pass|good|fail|poor|bad)/i.exec(value)?.[1]?.toLowerCase();
	const ratio = parseFloat(value);
	if (keyword === 'pass' || keyword === 'good') return true;
	if (keyword === 'fail' || keyword === 'poor' || keyword === 'bad') return false;
	return ratio >= 4.5;
}

const pictureSvg = '<svg class="ac-picture" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="8.5" r="1.8"/><path d="M3.5 18.5 9 12.5l3.5 4 3-3 5 5"/><rect x="2.5" y="4" width="19" height="16" rx="2"/></svg>';



/* ---------------- element renderers ---------------- */

function annotationChips(a) {
	const chips = [];
	if (a.aria) {
		const [name, value] = a.aria.includes('=') ? a.aria.split('=') : [a.aria, ''];
		chips.push(`<span class="ac-chip ac-aria">aria-${escapeHtml(name)}${value ? `=&quot;${escapeHtml(value)}&quot;` : ''}</span>`);
	}
	if (a.contrast) {
		const pass = contrastVerdict(a.contrast);
		chips.push(`<span class="ac-chip ac-contrast ${pass ? 'pass' : 'fail'}">${pass ? 'PASS' : 'FAIL'} ${escapeHtml(a.contrast.replace(/\s*(pass|good|fail|poor|bad)\s*/i, ''))}</span>`);
	}
	if (a.kbd) chips.push(`<span class="ac-keycap">${escapeHtml(a.kbd)}</span>`);
	if (a.sr) chips.push(`<span class="ac-chip ac-sr"><b>SR</b> ${escapeHtml(a.sr)}</span>`);
	return chips.join('');
}


function wrapAnnotations(inner, a, levelClass, label, isInput) {
	const classes = ['ui-element', `ac-${a.__type}`];
	if (levelClass) classes.push(levelClass);
	if (a.wrong) classes.push('is-wrong', 'has-validity');
	if (a.right) classes.push('is-right', 'has-validity');
	if (a['sr-only'] || a['visually-hidden']) classes.push('is-sr-only');
	if (a.landmark) classes.push('has-landmark');
	if (a.focus !== undefined) classes.push('has-focus');
    if (a.sr) classes.push('has-sr');
    if (isInput) classes.push('ui-form-group');

	const zIndex = 100 - (a.__index || 0);
	let html = `<div class="${classes.join(' ')}" style="z-index: ${zIndex};">`;
	
	if (a.landmark) {
		html += `<div class="meta-layer meta-landmark-box"></div>`;
		html += `<div class="meta-layer meta-landmark-tag">&lt;${escapeHtml(a.landmark)}&gt;</div>`;
	}
	
	if (a.wrong || a.right) {
		html += `<div class="meta-layer meta-validity-outline"></div>`;
		let tagText = '';
		if (a.wrong) {
			tagText = typeof a.wrong === 'string' ? `WRONG: ${a.wrong.toUpperCase()}` : (a.__type === 'button' ? 'WRONG: NOT KEYBOARD OPERABLE' : 'WRONG: PLACEHOLDER ONLY');
		} else if (a.__type === 'button') {
			tagText = typeof a.right === 'string' ? `RIGHT: ${a.right.toUpperCase()}` : 'RIGHT: NATIVE BUTTON';
		} else {
			tagText = typeof a.right === 'string' ? `RIGHT: ${a.right.toUpperCase()}` : 'RIGHT: HAS LABEL';
		}
		html += `<div class="meta-layer meta-validity-tag">${tagText}</div>`;
	}

	html += label || '';
	
	const hasFocus = a.focus !== undefined && a.focus !== 'none' && a.focus !== 'invisible';
	const hasGhost = !!a.ghost;
	const hasSr = !!a.sr;
	const hasCustomOutline = a.style && a.style.includes('outline:');

	let controlLayers = '';
	if (hasGhost) {
		controlLayers += `<div class="meta-layer meta-ghost-outline"></div>`;
		controlLayers += `<div class="meta-layer meta-ghost-badge">✕ 0px</div>`;
	}
	if (hasFocus) {
		if (!hasCustomOutline) {
			controlLayers += `<div class="meta-layer meta-focus-outline"></div>`;
		}
		controlLayers += `<div class="meta-layer meta-focus-badge">${a.focus === '' ? '' : escapeHtml(String(a.focus))}</div>`;
	}

	if (hasFocus || hasGhost || isInput) {
		const wrapperClass = isInput ? 'ui-control-wrapper is-input' : 'ui-control-wrapper';
		html += `<div class="${wrapperClass}">${controlLayers}${inner}</div>`;
	} else {
		html += inner;
	}

	if (hasSr) {
		html += `<div class="meta-layer meta-sr-tooltip"><span class="meta-sr-badge">Screen Reader</span><span>${escapeHtml(a.sr)}</span></div>`;
	}

	if (a.note) {
		const noteCls = a.wrong ? 'note-wrong' : (a.right ? 'note-right' : 'note-info');
		html += `<div class="meta-note-chip ${noteCls}">${escapeHtml(a.note)}</div>`;
	}

	html += `</div>`;
	return html;
}

function renderElement(entry) {
	const a = { ...entry.annotations, __type: entry.type };
	const content = escapeHtml(entry.content);
	switch (entry.type) {
		case 'skip':
			return wrapAnnotations(`<span class="ac-skip-link">${content || 'Skip to main content'}</span>`, a);
		case 'masthead':
			return wrapAnnotations(`<div class="ui-masthead">${content || 'The National Times'}</div>`, a);
		case 'nav': {
			const links = entry.content.split(';').map((s) => s.trim()).filter(Boolean);
			return wrapAnnotations(`<nav class="ui-nav">${links.map((l) => `<span>${escapeHtml(l)}</span>`).join('')}</nav>`, a);
		}
		case 'h1':
			return wrapAnnotations(`<div class="ui-h1">${content}</div>`, a);
		case 'heading':
		case 'h2':
		case 'h3':
			return wrapAnnotations(`<span class="ac-h-tag">${(entry.type === 'heading' ? 'H1' : entry.type).toUpperCase()}</span><span class="ac-heading">${content}</span>`, a);
		case 'text':
			return wrapAnnotations(`<p class="ui-text">${content}</p>`, a);
		case 'image': {
			const alt = entry.annotations.alt;
			let altChip = '';
			if (alt !== undefined) {
				if (alt === 'missing') {
					altChip = `<div class="ac-chip-row"><span class="ac-chip fail">alt MISSING</span></div>`;
				} else if (alt === '' || alt === '""' || alt === 'null') {
					altChip = `<div class="ac-chip-row"><span class="ac-chip pass">alt=&quot;&quot; (null)</span></div>`;
				} else {
					altChip = `<div class="ac-chip-row"><span class="ac-chip pass">alt: &quot;${escapeHtml(alt)}&quot;</span></div>`;
				}
			}
			return wrapAnnotations(
				`<div class="ac-image">${pictureSvg}<span class="ac-image-file">${content || 'image'}</span></div>${altChip}`,
				{ ...a, alt: undefined }
			);
		}
		case 'button': {
			const styleAttr = a.style ? ` style="${escapeHtml(a.style)}"` : '';
			return wrapAnnotations(`<div class="ui-button"${styleAttr}>${content}</div>`, a);
		}
		case 'link':
			return wrapAnnotations(`<span class="ac-inline-link">${content}</span>`, a);
		case 'input': {
			const labelHtml = entry.annotations.label
				? `<label class="ui-label">${escapeHtml(entry.annotations.label)}</label>`
				: entry.annotations.unlabelled
					? ``
					: '';
			const placeholder = entry.annotations.placeholder ? escapeHtml(entry.annotations.placeholder) : '';
            const value = content ? content : placeholder;
            const brokenClass = entry.annotations.unlabelled ? 'is-broken' : '';
			return wrapAnnotations(`<div class="ui-input ${brokenClass}">${escapeHtml(value)}</div>`, { ...a, label: undefined, placeholder: undefined }, null, labelHtml, true);
		}
		case 'select':
			return wrapAnnotations(`<div class="ac-input ac-select">${content}<span class="ac-caret">▾</span></div>`, a);
		case 'dialog': {
			const title = content || 'Renew Subscription';
			const isWrong = !!a.wrong;
			const isRight = !!a.right;
			const actionLabel = a.action ? escapeHtml(a.action) : 'Renew ($12)';
			const modalScene = `
				<div class="ui-modal-scene">
					<div class="ui-modal-backdrop ${isRight ? 'is-inert' : ''}">
						<div class="ui-modal-bg-doc">
							<div class="ui-modal-bg-bar">
								<span class="ui-modal-bg-tag">&lt;main${isRight ? ' inert' : ''}&gt;</span>
								${isWrong ? '<span class="ui-modal-leak-badge">Tab escaped</span>' : '<span class="ui-modal-inert-badge">inert</span>'}
							</div>
							<span class="ui-modal-bg-link ${isWrong ? 'has-leaked-focus' : ''}">Article: Transit Report</span>
						</div>
					</div>
					<div class="ui-modal-dialog">
						<div class="ui-modal-header">
							<span class="ui-modal-dialog-tag">&lt;dialog&gt;</span>
							<span class="ui-modal-title">${escapeHtml(title)}</span>
						</div>
						<div class="ui-modal-body">Subscription expired. Renew to continue reading.</div>
						<div class="ui-modal-actions">
							<span class="ui-modal-btn ${isRight ? 'has-trapped-focus' : ''}">${actionLabel}</span>
							<span class="ui-modal-btn ui-modal-btn-ghost">Close</span>
						</div>
					</div>
				</div>
			`;
			return wrapAnnotations(modalScene, { ...a, ghost: undefined, focus: undefined });
		}
		case 'switch': {
			const isChecked = a.checked !== undefined || content.toLowerCase().includes('on');
			const label = content || 'Toggle';
			return wrapAnnotations(`
				<div class="ui-switch ${isChecked ? 'is-checked' : ''}">
					<span class="ui-switch-track"><span class="ui-switch-thumb"></span></span>
					<span class="ui-switch-label">${escapeHtml(label)}</span>
				</div>
			`, a);
		}
		case 'badge':
			return wrapAnnotations(`<span class="ui-badge">${content}</span>`, a);
		case 'list': {
			const items = entry.content.split(';').map((s) => s.trim()).filter(Boolean);
			return wrapAnnotations(`<ul class="ac-list">${items.map((l) => `<li>${escapeHtml(l)}</li>`).join('')}</ul>`, a);
		}
		case 'card': {
			const styleAttr = a.style ? ` style="${escapeHtml(a.style)}"` : '';
			return wrapAnnotations(`<div class="ac-card"${styleAttr}><div class="ac-card-headline">${content}</div><i></i><i></i></div>`, a);
		}
		case 'footer':
			return wrapAnnotations(`<div class="ui-footer">${content}</div>`, a);
		case 'tab':
		case 'tablist': {
			const tabs = entry.content.split(';').map((s) => s.trim()).filter(Boolean);
			const activeIdx = a.active !== undefined ? Number(a.active) : 0;
			const tabsHtml = tabs.map((t, idx) => {
				const isActive = idx === activeIdx;
				return `<span class="ui-tab-item ${isActive ? 'is-active' : ''}">${escapeHtml(t)}</span>`;
			}).join('');
			return wrapAnnotations(`<div class="ui-tablist">${tabsHtml}</div>`, a);
		}
		case 'menu': {
			const items = entry.content.split(';').map((s) => s.trim()).filter(Boolean);
			const itemsHtml = items.map((it, idx) => {
				return `<div class="ui-menu-item ${idx === 0 ? 'is-active' : ''}">${escapeHtml(it)}</div>`;
			}).join('');
			return wrapAnnotations(`<div class="ui-menu-dropdown">${itemsHtml}</div>`, a);
		}
		case 'combobox': {
			const parts = entry.content.split(';').map(s => s.trim()).filter(Boolean);
			const label = parts[0] || 'Search archives...';
			const options = parts.slice(1);
			return wrapAnnotations(`
				<div class="ui-combobox">
					<div class="ui-combobox-input">${escapeHtml(label)} <span class="ui-combobox-caret">▾</span></div>
					${options.length ? `<div class="ui-combobox-listbox">${options.map((opt, i) => `<div class="ui-combobox-option ${i === 0 ? 'is-active' : ''}">${escapeHtml(opt)}</div>`).join('')}</div>` : ''}
				</div>
			`, a);
		}
		default:
			return wrapAnnotations(`<div class="ac-generic">${content}</div>`, a);
	}
}

/* ---------------- strips and chrome ---------------- */

function renderStrip(entry) {
	switch (entry.type) {
		case 'sr':
			return `<div class="ac-strip ac-strip-sr"><span class="ac-strip-tag">Screen reader</span><span class="ac-strip-text">${escapeHtml(entry.content)}</span></div>`;
		case 'kbd':
			return `<div class="ac-strip ac-strip-kbd"><span class="ac-strip-tag">Key</span><span class="ac-keycap big">${escapeHtml(entry.content)}</span></div>`;
		case 'contrast': {
			const [pair, verdict] = entry.content.split('|').map((s) => s.trim());
			const colors = (pair || '').split(/\s+on\s+/i);
			const pass = contrastVerdict(verdict || '');
			return `<div class="ac-strip ac-strip-contrast"><span class="ac-strip-tag">Contrast</span><span class="ac-swatch" style="background:${escapeHtml(colors[1] || '#fff')};color:${escapeHtml(colors[0] || '#000')};border:1px solid #d0d4d9;">Aa</span><span class="ac-strip-text">${escapeHtml(pair || '')}</span><span class="ac-chip ${pass ? 'pass' : 'fail'}">${pass ? 'PASS' : 'FAIL'} ${escapeHtml(verdict || '')}</span></div>`;
		}
		case 'vitals': {
			const items = entry.content.split(';').map((s) => s.trim()).filter(Boolean).map((item) => {
				const m = item.match(/^(\w[\w-]*)=(.+?)(\s+(good|poor|ni|needs-improvement))?$/i);
				if (!m) return `<span class="ac-chip">${escapeHtml(item)}</span>`;
				const grade = (m[4] || '').toLowerCase();
				const cls = grade === 'good' ? 'pass' : grade === 'poor' ? 'fail' : 'warn';
				return `<span class="ac-chip ${cls}"><b>${escapeHtml(m[1])}</b> ${escapeHtml(m[2])}${grade ? ` · ${grade === 'ni' ? 'needs improvement' : escapeHtml(grade)}` : ''}</span>`;
			});
			return `<div class="ac-strip ac-strip-vitals"><span class="ac-strip-tag">Field data</span>${items.join('')}</div>`;
		}
		case 'focus-order': {
			const stops = entry.content.split(/→|->/).map((s) => s.trim()).filter(Boolean);
			return `<div class="ac-strip ac-strip-focus"><span class="ac-strip-tag">Focus order</span>${stops.map((s, i) => `<span class="ac-chip ac-focus-chip"><b>${i + 1}</b> ${escapeHtml(s)}</span>`).join('<span class="ac-arrow">→</span>')}</div>`;
		}
		default:
			return '';
	}
}

/* ---------------- panel ---------------- */

export function renderA11yCanvas(source, title = '', options = {}) {
	const entries = source.split(/\r?\n/).map(parseLine).filter(Boolean);
	const url = entries.find((e) => e.kind === 'chrome' && e.key === 'url')?.value || 'www.nationaltimes.com';
	const zoom = entries.find((e) => e.kind === 'chrome' && e.key === 'zoom')?.value || '';

	let focusCounter = 0;
	const elements = entries.filter((e) => e.kind === 'element').map((e) => {
		if (e.annotations.focus === '') {
			focusCounter += 1;
			e.annotations.focus = String(focusCounter);
		} else if (e.annotations.focus !== undefined && e.annotations.focus !== 'none' && e.annotations.focus !== 'invisible') {
			focusCounter = Math.max(focusCounter, Number(e.annotations.focus) || 0);
		}
		return e;
	});

	const elementsHtml = elements.map((e, i) => {
		e.annotations.__index = i;
		return renderElement(e);
	}).join('\n');

	const widthClass = options.width === 'half' ? 'w-half'
		: options.width === 'full' ? 'w-full'
		: 'w-2-3'; // default 2/3 width
	const layoutClass = options.layout === 'compare' ? 'layout-compare'
		: options.layout === 'row' ? 'layout-row'
		: (elements.length <= 2 ? 'layout-compare' : '');
	const surfaceClass = options.surface === 'dark' ? 'surface-dark' : '';

	const displayTitle = title || url;

	const browserChrome = `
<div class="browser-window">
	<div class="browser-chrome">
		<div class="browser-dots">
			<div class="browser-dot red"></div>
			<div class="browser-dot yellow"></div>
			<div class="browser-dot green"></div>
		</div>
		<div class="browser-title">
			<svg class="w-3 h-3" style="width:11px;height:11px;margin-right:6px;color:#059669;display:inline-block;vertical-align:-1px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
			${escapeHtml(displayTitle)}
		</div>
		${zoom ? `<div class="browser-zoom">ZOOM ${escapeHtml(zoom)}</div>` : '<div style="width:40px;"></div>'}
	</div>
	<div class="mock-page show-landmarks show-sr show-focus show-validity ${layoutClass} ${surfaceClass}">
		${elementsHtml}
	</div>
</div>`;

	return `<style>${canvasCss()}</style>\n<div class="a11y-canvas ${widthClass}">\n${browserChrome}\n</div>`;
}

function canvasCss() {
	return `
:root {
    --meta-landmark: #ea580c;
    --meta-landmark-bg: #fff7ed;
    --meta-focus: #0284c7;
    --meta-sr: #7c3aed;
    --meta-sr-bg: #f5f3ff;
    --meta-wrong: #e11d48;
    --meta-right: #059669;
    
    --font-ui: 'Inter', -apple-system, system-ui, sans-serif;
    --font-serif: 'Lora', Georgia, serif;
    --font-meta: 'JetBrains Mono', Menlo, monospace;
}

/* Base Canvas Container */
.a11y-canvas {
    font-family: var(--font-ui);
    color: #0f172a;
    margin: 2rem 0;
    break-inside: avoid;
    page-break-inside: avoid;
}

/* Width Modifiers */
.a11y-canvas.w-half .browser-window {
    max-width: 480px;
    margin: 0 auto;
}
.a11y-canvas.w-2-3 .browser-window {
    max-width: 660px;
    margin: 0 auto;
}
.a11y-canvas.w-full .browser-window {
    max-width: 100%;
}

/* The Browser Chrome */
.browser-window {
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05);
    break-inside: avoid;
    page-break-inside: avoid;
}
.browser-chrome {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 14px;
    background: #f8fafc;
    border-bottom: 1px solid #cbd5e1;
}
.browser-dots { display: flex; gap: 5px; }
.browser-dot { width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; }
.browser-dot.red { background: #fca5a5; }
.browser-dot.yellow { background: #fde047; }
.browser-dot.green { background: #86efac; }
.browser-title {
    flex: 1;
    font-family: var(--font-meta);
    font-size: 0.72rem;
    font-weight: 700;
    color: #475569;
    letter-spacing: 0.02em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.browser-url { flex: 1; max-width: 400px; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 4px 10px; font-size: 0.75rem; color: #64748b; }

/* The UI Layer (The actual mocked page) */
.mock-page {
    position: relative;
    padding: 24px 28px;
    background: #f8fafc;
    background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
    background-size: 20px 20px;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
}

/* Minimal 2-Element Comparison Layout */
.mock-page.layout-compare {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 28px;
    padding: 24px 20px;
    flex-wrap: wrap;
}
.mock-page.layout-compare .meta-validity-outline {
    display: none;
}
.mock-page.layout-compare .ui-element {
    margin-bottom: 0;
    flex: 1 1 200px;
    max-width: 270px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 16px 16px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.04);
    position: relative;
}
.mock-page.layout-compare .meta-validity-tag {
    top: -11px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    padding: 3px 12px;
    border-radius: 99px;
    white-space: nowrap;
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}
/* In compare mode, suppress the numbered tab-stop circle (1) as it makes no sense in a 2-element comparison */
.mock-page.layout-compare .meta-focus-badge {
    display: none !important;
}
/* In compare mode, suppress outer landmark boxes and tags that clash with top validity tags */
.mock-page.layout-compare .meta-landmark-box,
.mock-page.layout-compare .meta-landmark-tag {
    display: none !important;
}
/* In compare mode, let screen reader tooltips flow naturally above note chips to eliminate text overlap */
.mock-page.layout-compare .meta-sr-tooltip {
    position: relative;
    top: auto;
    left: auto;
    margin-top: 12px;
    width: auto;
    display: flex;
    align-items: center;
    gap: 6px;
    z-index: 10;
}
.mock-page.layout-compare .meta-sr-tooltip::before {
    left: 50%;
    margin-left: -4px;
}
.mock-page.layout-compare .ui-element.has-sr {
    margin-bottom: 0;
    padding-bottom: 16px;
}
.mock-page.layout-compare .has-sr .meta-note-chip {
    margin-top: 10px;
}

/* UI Control Wrapper */
.ui-control-wrapper {
    position: relative;
    display: inline-block;
    vertical-align: middle;
}
.ui-control-wrapper.is-input {
    width: 100%;
    max-width: 300px;
}

/* Ghost Outline for Invisible Focus */
.meta-ghost-outline {
    position: absolute;
    inset: -5px;
    border: 2px dashed #f43f5e;
    border-radius: 8px;
    pointer-events: none;
    box-shadow: 0 0 0 1px rgba(244, 63, 94, 0.15);
}
.meta-ghost-badge {
    position: absolute;
    top: -10px;
    right: -8px;
    background: #f43f5e;
    color: white;
    font-family: var(--font-meta);
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    padding: 2px 7px;
    border-radius: 99px;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    white-space: nowrap;
    z-index: 60;
}

/* Status Note Chips */
.meta-note-chip {
    margin-top: 14px;
    font-family: var(--font-meta);
    font-size: 0.7rem;
    font-weight: 700;
    padding: 3px 10px;
    border-radius: 99px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    letter-spacing: 0.02em;
    text-align: center;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.has-sr .meta-note-chip {
    margin-top: 48px;
}
.meta-note-chip.note-wrong {
    background: #ffe4e6;
    color: #be123c;
    border: 1px solid #fecdd3;
}
.meta-note-chip.note-right {
    background: #e0f2fe;
    color: #0369a1;
    border: 1px solid #bae6fd;
}
.meta-note-chip.note-info {
    background: #f1f5f9;
    color: #334155;
    border: 1px solid #cbd5e1;
}

.ui-element {
    position: relative;
    margin-bottom: 24px;
    transition: all 0.3s ease;
}

/* Selectively add space ONLY for elements that have a Screen Reader tooltip */
.ui-element.has-sr { margin-bottom: 72px; }
.ui-form-group.has-sr { margin-bottom: 72px; }

/* Dynamically tint the SR tooltip based on validity */
.is-right .meta-sr-tooltip, .is-right .meta-sr-tooltip::before {
    background: var(--meta-right);
    box-shadow: 0 10px 15px -3px rgba(5, 150, 105, 0.3);
}
.is-wrong .meta-sr-tooltip, .is-wrong .meta-sr-tooltip::before {
    background: var(--meta-wrong);
    box-shadow: 0 10px 15px -3px rgba(225, 29, 72, 0.3);
}

.ui-masthead { font-family: var(--font-serif); font-size: 2rem; font-weight: 700; text-align: center; border-bottom: 4px double #0f172a; padding-bottom: 8px; color: #0f172a; }
.ui-nav { font-size: 0.85rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; font-weight: 600; color: #334155; text-transform: uppercase; letter-spacing: 0.05em; display: flex; justify-content: center; gap: 24px; }
.ui-h1 { font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-top: 16px; margin-bottom: 4px;}
.ui-text { font-size: 0.95rem; color: #475569; margin-bottom: 16px; }

.ui-form-group { margin-bottom: 24px; }
.ui-label { font-size: 0.85rem; font-weight: 600; color: #334155; display: block; margin-bottom: 6px; }
.ui-input { width: 100%; max-width: 300px; border: 1px solid #94a3b8; border-radius: 6px; padding: 10px 14px; font-size: 0.95rem; color: #64748b; background: #fff; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); outline: none; min-height: 20px; box-sizing: content-box; }
.ui-input.is-broken { border-color: #cbd5e1; color: #94a3b8; }

.ui-button { display: inline-block; background: #2563eb; color: #fff; font-size: 0.95rem; font-weight: 600; padding: 10px 28px; border-radius: 6px; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2); cursor: pointer; border: none; }
.ac-inline-link { color: #2563eb; text-decoration: underline; font-weight: 600; font-size: 0.95rem; display: inline-block; }
.ac-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px 18px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.ac-card-headline { font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
.ac-card i { display: block; height: 8px; background: #f1f5f9; border-radius: 4px; margin-bottom: 6px; width: 90%; }
.ac-card i:last-child { width: 65%; margin-bottom: 0; }
.ui-footer { margin-top: 48px; padding: 24px; background: #1e293b; color: #f8fafc; font-size: 0.85rem; border-radius: 8px; text-align: center; }

/* Modal Dialog Pattern */
.ui-modal-scene {
    position: relative;
    width: 236px;
    height: 142px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #cbd5e1;
    background: #f1f5f9;
}
.ui-modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    z-index: 1;
    display: flex;
    flex-direction: column;
    padding: 6px 8px;
}
.ui-modal-backdrop.is-inert {
    background: rgba(15, 23, 42, 0.6);
    filter: grayscale(0.8);
}
.ui-modal-bg-doc {
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.ui-modal-bg-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.ui-modal-bg-tag {
    font-family: var(--font-meta);
    font-size: 0.58rem;
    font-weight: 700;
    color: #94a3b8;
}
.ui-modal-leak-badge {
    font-family: var(--font-meta);
    font-size: 0.52rem;
    font-weight: 800;
    color: #f43f5e;
    background: #ffe4e6;
    padding: 1px 4px;
    border-radius: 3px;
}
.ui-modal-inert-badge {
    font-family: var(--font-meta);
    font-size: 0.52rem;
    font-weight: 700;
    color: #94a3b8;
    background: rgba(255, 255, 255, 0.15);
    padding: 1px 4px;
    border-radius: 3px;
}
.ui-modal-bg-link {
    font-size: 0.65rem;
    color: #bae6fd;
    text-decoration: underline;
    display: inline-block;
    width: fit-content;
    padding: 1px 4px;
    border-radius: 2px;
}
.ui-modal-bg-link.has-leaked-focus {
    outline: 2px solid #38bdf8;
    outline-offset: 1px;
    background: rgba(56, 189, 248, 0.3);
    color: #ffffff;
    font-weight: 700;
}
.ui-modal-dialog {
    position: absolute;
    top: 36px;
    left: 8px;
    right: 8px;
    bottom: 6px;
    z-index: 10;
    background: #ffffff;
    border-radius: 6px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    border: 1px solid #cbd5e1;
    padding: 6px 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.ui-modal-header {
    display: flex;
    align-items: center;
    gap: 5px;
}
.ui-modal-dialog-tag {
    font-family: var(--font-meta);
    font-size: 0.55rem;
    font-weight: 700;
    color: #0284c7;
    background: #e0f2fe;
    padding: 1px 3px;
    border-radius: 3px;
}
.ui-modal-title {
    font-size: 0.7rem;
    font-weight: 700;
    color: #0f172a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.ui-modal-body {
    font-size: 0.6rem;
    color: #64748b;
    line-height: 1.2;
    margin: 2px 0 4px;
}
.ui-modal-actions {
    display: flex;
    gap: 5px;
    justify-content: flex-end;
    align-items: center;
}
.ui-modal-btn {
    font-size: 0.62rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 4px;
    background: #0f172a;
    color: #ffffff;
    cursor: pointer;
}
.ui-modal-btn.has-trapped-focus {
    outline: 2px solid #0284c7;
    outline-offset: 2px;
    box-shadow: 0 0 0 1px #ffffff;
}
.ui-modal-btn-ghost {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #cbd5e1;
}

/* Switch & Badge Components */
.ui-switch {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}
.ui-switch-track {
    width: 36px;
    height: 20px;
    background: #cbd5e1;
    border-radius: 99px;
    position: relative;
    transition: background 0.2s ease;
}
.ui-switch.is-checked .ui-switch-track {
    background: #059669;
}
.ui-switch-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    background: #ffffff;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    transition: transform 0.2s ease;
}
.ui-switch.is-checked .ui-switch-thumb {
    transform: translateX(16px);
}
.ui-switch-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #1e293b;
}

.ui-badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 99px;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    font-size: 0.75rem;
    font-weight: 700;
    color: #334155;
}

/* Tablist Pattern */
.ui-tablist {
    display: flex;
    gap: 4px;
    background: #f1f5f9;
    padding: 4px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
}
.ui-tab-item {
    font-size: 0.72rem;
    font-weight: 600;
    padding: 5px 11px;
    border-radius: 6px;
    color: #64748b;
    background: transparent;
    border: 1px solid transparent;
}
.ui-tab-item.is-active {
    background: #ffffff;
    color: #0f172a;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border-color: #e2e8f0;
}

/* Menu Dropdown Pattern */
.ui-menu-dropdown {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    padding: 4px;
    min-width: 140px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.ui-menu-item {
    font-size: 0.74rem;
    padding: 5px 10px;
    border-radius: 4px;
    color: #1e293b;
    font-weight: 500;
}
.ui-menu-item.is-active {
    background: #f1f5f9;
    color: #0f172a;
    font-weight: 600;
}

/* Combobox Pattern */
.ui-combobox {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 160px;
}
.ui-combobox-input {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 0.76rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #0f172a;
}
.ui-combobox-caret {
    font-size: 0.65rem;
    color: #64748b;
}
.ui-combobox-listbox {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    padding: 3px;
    display: flex;
    flex-direction: column;
    gap: 1px;
}
.ui-combobox-option {
    font-size: 0.72rem;
    padding: 4px 8px;
    border-radius: 4px;
    color: #334155;
}
.ui-combobox-option.is-active {
    background: #0284c7;
    color: #ffffff;
    font-weight: 600;
}
.ui-h2 {
    font-family: var(--font-serif);
    font-size: 1.2rem;
    font-weight: 700;
    color: #0f172a;
}

/* Meta-Layer Annotations */
.meta-layer {
    position: absolute;
    font-family: var(--font-meta);
    z-index: 50;
    pointer-events: none;
}

/* Landmarks */
.meta-landmark-box {
    inset: -8px;
    border: 2px dashed var(--meta-landmark);
    border-radius: 8px;
    background: rgba(255, 247, 237, 0.3);
}
.meta-landmark-tag {
    top: -12px;
    left: 12px;
    color: var(--meta-landmark);
    background: var(--meta-landmark-bg);
    border: 1px solid var(--meta-landmark);
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: 4px;
    box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.1);
}

/* Screen Reader Tooltips */
.meta-sr-tooltip {
    top: 100%;
    left: 0;
    margin-top: 12px;
    background: var(--meta-sr);
    color: white;
    font-size: 0.7rem;
    padding: 5px 8px;
    border-radius: 6px;
    white-space: normal;
    max-width: 210px;
    box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.3);
    display: flex;
    align-items: center;
    gap: 6px;
}
.meta-sr-tooltip::before {
    content: '';
    position: absolute;
    top: -4px;
    left: 16px;
    width: 8px; height: 8px;
    background: var(--meta-sr);
    transform: rotate(45deg);
}
.meta-sr-badge {
    background: rgba(255,255,255,0.25);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.65rem;
    font-weight: 800;
}

/* Focus Order */
.meta-focus-badge {
    position: absolute;
    top: -10px;
    right: -8px;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--meta-focus);
    color: white;
    border: 2px solid white;
    border-radius: 99px;
    font-size: 0.72rem;
    font-weight: 800;
    box-shadow: 0 0 0 2px var(--meta-focus), 0 3px 5px rgba(0,0,0,0.2);
    z-index: 60;
}
.meta-focus-outline {
    position: absolute;
    inset: -5px;
    border: 3px solid var(--meta-focus);
    border-radius: 8px;
    pointer-events: none;
}

/* Surface Dark mode for dark containers/footers */
.mock-page.surface-dark {
    background: #090d16;
    background-image: radial-gradient(#1e293b 1px, transparent 1px);
}
.mock-page.surface-dark.layout-compare .ui-element {
    background: #0f172a;
    border-color: #334155;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
}
.mock-page.surface-dark .meta-note-chip.note-wrong {
    background: #450a0a;
    color: #fca5a5;
    border-color: #7f1d1d;
}
.mock-page.surface-dark .meta-note-chip.note-right {
    background: #082f49;
    color: #7dd3fc;
    border-color: #0369a1;
}

/* Validity */
.meta-validity-outline {
    inset: -6px;
    border: 2px solid transparent;
    border-left-width: 6px;
    border-radius: 8px;
}
.meta-validity-tag {
    top: -12px;
    left: 10px;
    color: white;
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    padding: 2px 8px;
    border-radius: 4px;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2);
}

.is-wrong .meta-validity-outline { border-color: var(--meta-wrong); background: linear-gradient(90deg, rgba(225, 29, 72, 0.05) 0%, transparent 100%); }
.is-right .meta-validity-outline { border-color: var(--meta-right); background: linear-gradient(90deg, rgba(5, 150, 105, 0.05) 0%, transparent 100%); }
.is-wrong .meta-validity-tag { background: var(--meta-wrong); }
.is-right .meta-validity-tag { background: var(--meta-right); }

.relative-wrapper { position: relative; display: inline-block; width: 100%; max-width: 300px; }
.relative-wrapper .ui-button { max-width: none; width: auto; }

/* Image element */
.ac-image {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 14px 18px;
    color: #475569;
    font-size: 0.85rem;
    font-family: var(--font-meta);
}
.ac-picture {
    width: 24px;
    height: 24px;
    color: #64748b;
    flex-shrink: 0;
}
.ac-image-file {
    font-weight: 600;
}
.ac-chip-row {
    margin-top: 8px;
    display: flex;
    gap: 8px;
}
.ac-chip {
    font-family: var(--font-meta);
    font-size: 0.7rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}
.ac-chip.pass { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
.ac-chip.fail { background: #ffe4e6; color: #be123c; border: 1px solid #fca5a5; }

`.trim();
}
