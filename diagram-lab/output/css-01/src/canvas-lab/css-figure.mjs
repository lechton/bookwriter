/* ============================================================
   css-figure.mjs — the CSS Figure panel generator (canvas-lab prototype)
   ------------------------------------------------------------
   The css-01 twin of a11y-canvas.mjs. Where the accessibility canvas
   annotates invisible assistive states over a mocked page, the CSS
   figure draws the geometry itself: box edges, margins, floats, free
   space. It follows various/demo UI/design_instructions.md: flat
   pastel fills, 1px same-hue borders, thin indigo measurement lines,
   dashed purple "invisible forces", a mono caption under every figure.

   Consumed by build-demo.mjs from a ```figure fenced block:

   ```figure mode="box" layout="compare" caption="One declaration, two widths."
   verdict=wrong | tag=content-box
   width=120 height=56 padding=16 border=2 margin=20
   ---
   verdict=right | tag=border-box
   sizing=border-box
   width=120 height=56 padding=16 border=2 margin=20
   ```

   Scenes are separated by a `---` line. Each scene line is a list of
   `key=value` pairs separated by `|`. Every mode documents its keys
   next to its renderer below.

   Modes:  box · margin · float · float-text · center
   Layout: single (default) · compare (two scenes side by side)
   Width:  2/3 (default) · full

   Geometry law: the renderer computes every coordinate from the
   declared CSS values (the same arithmetic the browser performs), so a
   figure can never show a layout its code does not produce. Where the
   scene uses live CSS (floats, text wrap) the values are the real ones.
   ============================================================ */

const esc = (v) => String(v)
	.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/* ---------------- palette (design_instructions.md) ---------------- */

const C = {
	stageBg: '#F8FAFC', stageEdge: '#E2E8F0',
	// item: flat pastel orange, same-hue darker edge
	item: '#FFD6A5', itemEdge: '#F0A35E', itemText: '#9A5B1E',
	// container whose extent matters: pale lavender
	parent: '#F3E8FF', parentEdge: '#D8B4FE', parentText: '#7E22CE',
	// neutral container: white with slate edge
	frame: '#FFFFFF', frameEdge: '#CBD5E1', frameText: '#64748B',
	// box model bands
	margin: '#FFE8D1', marginText: '#C2410C',
	border: '#F1E3B4', borderText: '#A16207',
	padding: '#D9F2E3', paddingText: '#15803D',
	content: '#D6E6FB', contentText: '#1D4ED8',
	// annotations
	dim: '#6366F1',        // measurement lines and labels
	force: '#A855F7',      // invisible forces: dashed + dot
	text: '#334155', muted: '#64748B', faint: '#94A3B8',
	wrong: '#BE123C', wrongBg: '#FFE4E6', wrongEdge: '#FECDD3',
	right: '#15803D', rightBg: '#DCFCE7', rightEdge: '#86EFAC',
};

const MONO = "'JetBrains Mono', 'IBM Plex Mono', Menlo, monospace";
const SANS = "Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/* ---------------- parsing ---------------- */

function parseScenes(source) {
	const scenes = [];
	let cur = {};
	const flush = () => { if (Object.keys(cur).length) scenes.push(cur); cur = {}; };
	for (const raw of source.split(/\r?\n/)) {
		const line = raw.trim();
		if (!line || line.startsWith('#')) continue;
		if (line === '---') { flush(); continue; }
		for (const part of line.split('|')) {
			const m = part.trim().match(/^([\w-]+)\s*=\s*(.*)$/);
			if (m) cur[m[1]] = m[2].replace(/^"|"$/g, '').trim();
		}
	}
	flush();
	return scenes;
}

const num = (v, d) => (v === undefined || v === '' ? d : Number(v));

/* ---------------- SVG primitives ---------------- */

// A dimension line in the engineering-drawing sense: a thin line with
// perpendicular end ticks and a mono label. Horizontal when y1 === y2.
function dim(x1, y1, x2, y2, label, opts = {}) {
	const color = opts.color || C.dim;
	const horizontal = y1 === y2;
	const t = 4; // tick half-length
	const ticks = horizontal
		? `<line x1="${x1}" y1="${y1 - t}" x2="${x1}" y2="${y1 + t}"/><line x1="${x2}" y1="${y2 - t}" x2="${x2}" y2="${y2 + t}"/>`
		: `<line x1="${x1 - t}" y1="${y1}" x2="${x1 + t}" y2="${y1}"/><line x1="${x2 - t}" y1="${y2}" x2="${x2 + t}" y2="${y2}"/>`;
	let text = '';
	if (label) {
		if (horizontal) {
			const cx = (x1 + x2) / 2;
			const y = opts.below ? y1 + 14 : y1 - 6;
			text = `<text x="${cx}" y="${y}" text-anchor="middle">${esc(label)}</text>`;
		} else if (opts.rotate) {
			// Long labels on a vertical dimension read along the line, bottom to top,
			// the engineering-drawing convention; keeps the figure narrow.
			const cy = (y1 + y2) / 2, x = x1 + 12;
			text = `<text x="${x}" y="${cy}" text-anchor="middle" transform="rotate(-90 ${x} ${cy})">${esc(label)}</text>`;
		} else {
			const cy = (y1 + y2) / 2 + 4;
			const x = opts.left ? x1 - 8 : x1 + 8;
			text = `<text x="${x}" y="${cy}" text-anchor="${opts.left ? 'end' : 'start'}">${esc(label)}</text>`;
		}
	}
	return `<g class="cf-dim" stroke="${color}" fill="${color}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>${ticks}${text}</g>`;
}

// An invisible force: dashed line with a solid dot at its midpoint.
function force(x1, y1, x2, y2, label, opts = {}) {
	const color = opts.color || C.force;
	const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2;
	const horizontal = y1 === y2;
	const text = label
		? (horizontal
			? `<text x="${cx}" y="${cy - 8}" text-anchor="middle">${esc(label)}</text>`
			: `<text x="${cx + 9}" y="${cy + 4}" text-anchor="start">${esc(label)}</text>`)
		: '';
	return `<g class="cf-force" stroke="${color}" fill="${color}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-dasharray="5 4"/><circle cx="${cx}" cy="${cy}" r="4" stroke="none"/>${text}</g>`;
}

// A direction arrow: solid 2px line with a flat triangle head.
function arrow(x1, y1, x2, y2, label, opts = {}) {
	const color = opts.color || C.force;
	const id = `ah-${Math.abs(Math.round(x1 * 31 + y1 * 17 + x2 * 7 + y2)).toString(36)}-${color.slice(1)}`;
	const text = label ? `<text x="${(x1 + x2) / 2}" y="${y1 - 7}" text-anchor="middle">${esc(label)}</text>` : '';
	return `<defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 1 L 9 5 L 0 9 z" fill="${color}"/></marker></defs><g class="cf-arrow" stroke="${color}" fill="${color}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="2" marker-end="url(#${id})"/>${text}</g>`;
}

const svgOpen = (w, h) => `<svg class="cf-overlay" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`;

// A flat pastel box (HTML), absolutely positioned inside the scene.
function box(x, y, w, h, fill, edge, extra = '') {
	return `<div class="cf-box" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${fill};border-color:${edge};${extra}"></div>`;
}

// A small mono label placed inside a band, top-left.
function bandLabel(x, y, text, color, bg) {
	const backing = bg ? `background:${bg};padding:1px 3px;margin:-1px -3px;border-radius:2px;` : '';
	return `<span class="cf-band-label" style="left:${x}px;top:${y}px;color:${color};${backing}">${esc(text)}</span>`;
}

// The mono selector tag that names a box (`.teaser`, `img.lede`).
function tag(x, y, text, color, bg) {
	return `<span class="cf-tag" style="left:${x}px;top:${y}px;color:${color};background:${bg || 'transparent'}">${esc(text)}</span>`;
}

const scene = (w, h, inner) => `<div class="cf-scene" style="width:${w}px;height:${h}px">${inner}</div>`;

/* ============================================================
   MODE: box — the concentric box model bands
   keys: width height padding border margin sizing(content-box|border-box) label
   The rendered width is computed exactly as the browser computes it.
   ============================================================ */
function renderBox(s) {
	const sizing = s.sizing === 'border-box' ? 'border-box' : 'content-box';
	const W = num(s.width, 120), H = num(s.height, 56);
	const p = num(s.padding, 16), b = num(s.border, 2), m = num(s.margin, 20);
	// content box dimensions after the sizing rule
	const cw = sizing === 'border-box' ? W - 2 * p - 2 * b : W;
	const ch = sizing === 'border-box' ? H - 2 * p - 2 * b : H;
	const borderW = cw + 2 * p + 2 * b, borderH = ch + 2 * p + 2 * b;
	const outerW = borderW + 2 * m, outerH = borderH + 2 * m;
	const pad = 14, dimGap = 30;
	const sw = outerW + 2 * pad, sh = outerH + 2 * pad + dimGap;
	const ox = pad, oy = pad;

	let html = '';
	// margin band: dashed edge because the margin has no visible edge in the browser
	html += box(ox, oy, outerW, outerH, C.margin, '#FDBA74', 'border-style:dashed');
	html += bandLabel(ox + 6, oy + 3, `margin ${m}`, C.marginText);
	const bx = ox + m, by = oy + m;
	html += box(bx, by, borderW, borderH, C.border, '#E3C56D');
	const px = bx + b, py = by + b;
	html += box(px, py, borderW - 2 * b, borderH - 2 * b, C.padding, '#86EFAC');
	// The border band is too thin to hold a label, so its label borrows the
	// padding band's bottom row, right-aligned, in the border color.
	html += bandLabel(px + 6, py + 3, `padding ${p}`, C.paddingText);
	html += `<span class="cf-band-label" style="right:${sw - (px + borderW - 2 * b) + 6}px;top:${py + borderH - 2 * b - 12}px;color:${C.borderText}">border ${b}</span>`;
	const cx = px + p, cy = py + p;
	html += box(cx, cy, cw, ch, C.content, '#93C5FD');
	html += `<span class="cf-band-label cf-center" style="left:${cx}px;top:${cy}px;width:${cw}px;height:${ch}px;color:${C.contentText}">${cw} × ${ch}</span>`;
	if (s.label) html += tag(ox, oy - 12, s.label, C.muted);

	// the width the browser reports for the border box
	const dy = oy + outerH + 16;
	let svg = svgOpen(sw, sh);
	svg += dim(bx, dy, bx + borderW, dy, `${sizing === 'border-box' ? 'width' : 'rendered'} ${borderW}px`, { below: true });
	svg += '</svg>';
	return scene(sw, sh, html + svg);
}

/* ============================================================
   MODE: margin — vertical margins meeting between two stacked blocks
   keys: a (margin-bottom of the first block) b (margin-top of the second)
         label-a label-b context(flow|flex)
   In normal flow the margins collapse to max(a, b); in a flex column
   they do not and the gap is a + b.
   ============================================================ */
function renderMargin(s) {
	const a = num(s.a, 24), b = num(s.b, 16);
	const flex = s.context === 'flex';
	const gap = flex ? a + b : Math.max(a, b);
	const W = 188, blockH = 40, pad = 14, dimCol = 66;
	const sw = W + pad * 2 + dimCol, sh = pad * 2 + blockH * 2 + gap;
	const x = pad, y1 = pad, y2 = y1 + blockH + gap;

	let html = '';
	html += box(x, y1, W, blockH, C.item, C.itemEdge);
	html += `<span class="cf-band-label cf-center" style="left:${x}px;top:${y1}px;width:${W}px;height:${blockH}px;color:${C.itemText}">${esc(s['label-a'] || 'h2.headline')}</span>`;
	// margin bands: A's margin-bottom hangs below A; B's margin-top rises above B.
	// In flow the two bands overlap; drawn with a small horizontal inset so both edges read.
	const inset = flex ? 0 : 10;
	html += box(x, y1 + blockH, W, a, C.margin, '#FDBA74', 'border-style:dashed');
	html += box(x + inset, y2 - b, W - 2 * inset, b, C.margin, '#FDBA74', 'border-style:dashed;background:rgba(255,232,209,0.85)');
	// Labels are painted after both bands so neither band covers a label. In
	// flow the bands overlap, so the second label sits at the bottom of its
	// band, right-aligned, clear of the first label at the top.
	// A band-colored backing under each label masks the dashed edge of the other band.
	html += bandLabel(x + 6, y1 + blockH + 2, `margin-bottom ${a}`, C.marginText, C.margin);
	html += flex
		? bandLabel(x + 6, y2 - b + 2, `margin-top ${b}`, C.marginText, C.margin)
		: `<span class="cf-band-label" style="right:${sw - (x + W - inset) + 6}px;top:${y2 - 12}px;color:${C.marginText};background:${C.margin};padding:1px 3px;margin:-1px -3px;border-radius:2px">margin-top ${b}</span>`;
	html += box(x, y2, W, blockH, C.item, C.itemEdge);
	html += `<span class="cf-band-label cf-center" style="left:${x}px;top:${y2}px;width:${W}px;height:${blockH}px;color:${C.itemText}">${esc(s['label-b'] || 'p.dek')}</span>`;

	let svg = svgOpen(sw, sh);
	const dx = x + W + 22;
	svg += dim(dx, y1 + blockH, dx, y2, `${gap}px`);
	svg += '</svg>';
	return scene(sw, sh, html + svg);
}

/* ============================================================
   MODE: float — floated children and the parent that (does not) contain them
   keys: items(3) float(left|right) contain(none|flow-root) parent(.teaser)
   Live floats: the children really float; the parent really collapses.
   Prince 16 ignores display:flow-root, so containment is applied with a
   clearfix class that produces the identical geometry in every renderer.
   ============================================================ */
function renderFloat(s) {
	const n = num(s.items, 3), side = s.float === 'right' ? 'right' : 'left';
	const contain = s.contain && s.contain !== 'none';
	const itemW = 52, itemH = 40, gap = 6, ppad = 10, pborder = 2;
	const parentW = n * itemW + (n - 1) * gap + 2 * ppad + 24; // room so the floats read as floats
	const pad = 10, arrowRow = 40, dimCol = 44;
	const parentH = contain ? itemH + 2 * ppad + 2 * pborder : 2 * ppad + 2 * pborder;
	const sw = parentW + pad * 2 + dimCol;
	const sh = pad + arrowRow + Math.max(parentH, itemH + ppad + pborder) + pad + 8;
	const x = pad, y = pad + arrowRow;

	let items = '';
	for (let i = 0; i < n; i++) {
		items += `<div class="cf-float-item" style="float:${side};width:${itemW}px;height:${itemH}px;margin-${side === 'left' ? 'right' : 'left'}:${i < n - 1 ? gap : 0}px">img</div>`;
	}
	const parent = `<div class="cf-parent${contain ? ' cf-contain' : ''}" style="left:${x}px;top:${y}px;width:${parentW}px;padding:${ppad}px;border-width:${pborder}px">${items}</div>`;
	const label = tag(x, y - 13, s.parent || '.teaser', C.parentText);

	let svg = svgOpen(sw, sh);
	// float direction arrow above the items
	const ax1 = x + ppad + pborder + n * itemW + (n - 1) * gap, ax2 = x + ppad + pborder;
	const ay = y - 24; // its own row above the selector tag
	svg += side === 'left' ? arrow(ax1 - 8, ay, ax2 + 6, ay, `float: ${side}`) : arrow(ax2, ay, ax1, ay, `float: ${side}`);
	// parent height measurement
	const dx = x + parentW + 18;
	svg += dim(dx, y, dx, y + parentH, `height ${parentH}px`, { rotate: true });
	svg += '</svg>';
	return scene(sw, sh, label + parent + svg);
}

/* ============================================================
   MODE: float-text — an image floated inside running text
   keys: float(left|right) margin("0 16 8 0") clear(none|left|both) width(300) lines
   The text really wraps; the float's margin is drawn as the band that
   keeps the words off the image.
   ============================================================ */
function renderFloatText(s) {
	const side = s.float === 'right' ? 'right' : 'left';
	const mv = (s.margin || '0 16 8 0').split(/\s+/).map(Number);
	const [mt, mr, mb, ml] = mv.length === 4 ? mv : [mv[0], mv[1] ?? mv[0], mv[2] ?? mv[0], mv[3] ?? mv[1] ?? mv[0]];
	const clear = s.clear && s.clear !== 'none' ? s.clear : '';
	const W = num(s.width, 262);
	const imgW = 84, imgH = 62;
	const text = s.text || 'The council voted 7 to 2 to extend the tram line past the harbour after a four hour hearing.';
	const byline = s.byline || 'By Arthur Vane, City Desk';

	// The margin band is a floated wrapper whose padding equals the margin,
	// so the words wrap around the exact same edge the real margin produces.
	// Its dashed edge is a real border (Prince drops `outline`); the 1px is
	// taken from the padding so the outer edge stays on the true margin edge.
	const bw = 1;
	const padv = [mt, mr, mb, ml].map((v) => Math.max(0, v - bw));
	const band = `<div class="cf-margin-band" style="float:${side};border-width:${bw}px;padding:${padv[0]}px ${padv[1]}px ${padv[2]}px ${padv[3]}px"><div class="cf-img" style="width:${imgW}px;height:${imgH}px">img.lede</div></div>`;
	const para = `<p class="cf-text">${esc(text)}</p>`;
	const by = `<p class="cf-byline${clear ? ' is-cleared' : ''}" style="${clear ? `clear:${clear}` : ''}">${esc(byline)}</p>`;
	const article = `<div class="cf-article" style="width:${W}px">${band}${para}${by}</div>`;
	const legend = `<span class="cf-legend"><i style="background:${C.margin};border-color:#FDBA74"></i>margin ${mt} ${mr} ${mb} ${ml}${clear ? `<i class="cf-legend-line"></i>clear: ${clear}` : ''}</span>`;
	return `<div class="cf-scene cf-scene-flow" style="width:${W}px">${article}${legend}</div>`;
}

/* ============================================================
   MODE: center — a fixed-width block inside a wider parent
   keys: parent(260 = the parent's content-box width, the containing block)
         width(120) method(auto|text-align) label parent_label
   With margin auto the free space splits equally; with text-align the
   box stays at the left edge and only its inline content moves.
   ============================================================ */
function renderCenter(s) {
	const innerW = num(s.parent, 260), W = num(s.width, 120), H = 44;
	const auto = (s.method || 'auto') === 'auto';
	const pad = 10, ppad = 11, pborder = 1;
	const P = innerW + 2 * ppad + 2 * pborder;
	const sw = P + 2 * pad, sh = H + 2 * ppad + 2 * pborder + 2 * pad + 8;
	const x = pad, y = pad + 8;
	const innerX = x + pborder + ppad;
	const childX = auto ? innerX + (innerW - W) / 2 : innerX;
	const childY = y + pborder + ppad;

	let html = box(x, y, P, H + 2 * ppad + 2 * pborder, C.frame, C.frameEdge);
	html += tag(x, y - 13, s.parent_label || '.hero', C.frameText);
	html += box(childX, childY, W, H, C.item, C.itemEdge);
	html += `<span class="cf-band-label cf-center" style="left:${childX}px;top:${childY}px;width:${W}px;height:${H}px;color:${C.itemText}">${esc(s.label || 'div.cta')}</span>`;

	let svg = svgOpen(sw, sh);
	const cy = childY + H / 2;
	if (auto) {
		const a = (innerW - W) / 2;
		svg += force(innerX, cy, childX, cy, `auto ${a}px`);
		svg += force(childX + W, cy, innerX + innerW, cy, `auto ${a}px`);
	} else {
		svg += force(childX + W, cy, innerX + innerW, cy, `free ${innerW - W}px`);
	}
	svg += '</svg>';
	return scene(sw, sh, html + svg);
}

const MODES = { box: renderBox, margin: renderMargin, float: renderFloat, 'float-text': renderFloatText, center: renderCenter };

/* ---------------- panel ---------------- */

function verdictPill(s) {
	if (s.verdict === 'wrong') return `<span class="cf-pill is-wrong">WRONG${s.tag ? ` · ${esc(s.tag)}` : ''}</span>`;
	if (s.verdict === 'right') return `<span class="cf-pill is-right">RIGHT${s.tag ? ` · ${esc(s.tag)}` : ''}</span>`;
	if (s.tag) return `<span class="cf-pill">${esc(s.tag)}</span>`;
	return '';
}

export function renderCssFigure(source, attrs = {}, figNumber = '') {
	const mode = attrs.mode || 'box';
	const render = MODES[mode];
	if (!render) {
		console.warn(`  note figure: unknown mode "${mode}"`);
		return `<p><em>[figure: unknown mode ${esc(mode)}]</em></p>`;
	}
	const scenes = parseScenes(source);
	const compare = attrs.layout === 'compare' || scenes.length === 2;
	const widthClass = attrs.width === 'full' ? 'w-full' : 'w-2-3';

	const panels = scenes.map((s) => {
		const cls = ['cf-panel'];
		if (s.verdict === 'wrong') cls.push('is-wrong');
		if (s.verdict === 'right') cls.push('is-right');
		return `<div class="${cls.join(' ')}">${verdictPill(s)}${render({ ...s, __mode: mode })}</div>`;
	}).join('\n');

	const caption = attrs.caption
		? `<figcaption>${figNumber ? `Fig ${esc(figNumber)}: ` : ''}${esc(attrs.caption)}</figcaption>`
		: '';

	return `<style>${figureCss()}</style>\n<figure class="css-figure ${widthClass} mode-${mode}${compare ? ' is-compare' : ''}">\n<div class="cf-stage${compare ? ' cf-compare' : ''}">\n${panels}\n</div>\n${caption}\n</figure>`;
}

/* ---------------- stylesheet (inlined once per figure, like the a11y canvas) ---------------- */

function figureCss() {
	return `
.css-figure { margin: 1.9rem 0 2.1rem; font-family: ${SANS}; color: ${C.text}; break-inside: avoid; page-break-inside: avoid; }
.css-figure.w-2-3 .cf-stage { max-width: 660px; margin: 0 auto; }
.css-figure.w-full .cf-stage { max-width: 100%; }

/* the master canvas: flat, rounded, 1px same-hue edge, generous padding */
.cf-stage { background: ${C.stageBg}; border: 1px solid ${C.stageEdge}; border-radius: 10px; padding: 26px 24px 22px; display: flex; justify-content: center; align-items: flex-start; gap: 20px; }
.cf-stage.cf-compare { padding: 26px 18px 22px; }
.cf-panel { position: relative; display: flex; flex-direction: column; align-items: center; gap: 12px; flex: 0 1 auto; }
.cf-compare .cf-panel { flex: 1 1 0; min-width: 0; }

/* verdict pills: flat, small, no shadow; neutral pill for plain contrasts */
.cf-pill { font-family: ${MONO}; font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em; padding: 3px 10px; border-radius: 99px; border: 1px solid ${C.frameEdge}; background: #fff; color: ${C.muted}; white-space: nowrap; }
.cf-pill.is-wrong { color: ${C.wrong}; background: ${C.wrongBg}; border-color: ${C.wrongEdge}; }
.cf-pill.is-right { color: ${C.right}; background: ${C.rightBg}; border-color: ${C.rightEdge}; }

/* the scene: a fixed pixel canvas with absolutely placed boxes and one SVG overlay */
.cf-scene { position: relative; flex: none; }
.cf-scene-flow { display: flex; flex-direction: column; gap: 10px; }
.cf-box { position: absolute; box-sizing: border-box; border: 1.5px solid; border-radius: 4px; }
.cf-overlay { position: absolute; left: 0; top: 0; overflow: visible; pointer-events: none; }
.cf-overlay text { font-family: ${MONO}; font-size: 10.5px; font-weight: 500; stroke: none; }
.cf-overlay .cf-dim line { stroke-width: 1; }
.cf-overlay .cf-force line { stroke-width: 1.5; }

.cf-band-label { position: absolute; font-family: ${MONO}; font-size: 10px; font-weight: 500; letter-spacing: 0.01em; white-space: nowrap; line-height: 1; }
.cf-band-label.cf-center { display: flex; align-items: center; justify-content: center; font-size: 11px; }
.cf-tag { position: absolute; font-family: ${MONO}; font-size: 10.5px; font-weight: 700; white-space: nowrap; line-height: 1; }

/* float mode: a live lavender parent with live floated children */
.cf-parent { position: absolute; box-sizing: border-box; background: ${C.parent}; border: 2px solid ${C.parentEdge}; border-radius: 6px; }
.cf-parent.cf-contain::after { content: ""; display: block; clear: both; }
.cf-float-item { box-sizing: border-box; background: ${C.item}; border: 1.5px solid ${C.itemEdge}; border-radius: 4px; font-family: ${MONO}; font-size: 10px; color: ${C.itemText}; display: flex; align-items: center; justify-content: center; }

/* float-text mode: real text wrapping a real float */
.cf-article { background: #fff; border: 1px solid ${C.frameEdge}; border-radius: 6px; padding: 12px 14px; box-sizing: border-box; }
.cf-article::after { content: ""; display: block; clear: both; }
.cf-margin-band { background: ${C.margin}; border: 1px dashed #FDBA74; border-radius: 3px; box-sizing: border-box; }
.cf-img { box-sizing: border-box; background: ${C.item}; border: 1.5px solid ${C.itemEdge}; border-radius: 3px; font-family: ${MONO}; font-size: 10px; color: ${C.itemText}; display: flex; align-items: center; justify-content: center; }
.cf-text { margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 11.5px; line-height: 1.45; color: ${C.text}; text-align: left; }
.cf-byline { margin: 8px 0 0; font-family: ${SANS}; font-size: 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: ${C.muted}; }
.cf-byline.is-cleared { border-top: 1.5px dashed ${C.force}; padding-top: 6px; }
.cf-legend { font-family: ${MONO}; font-size: 10px; color: ${C.muted}; display: flex; align-items: center; gap: 6px; }
.cf-legend i { display: inline-block; width: 12px; height: 9px; border: 1px dashed; border-radius: 2px; }
.cf-legend .cf-legend-line { width: 14px; height: 0; border: none; border-top: 1.5px dashed ${C.force}; margin-left: 8px; }

/* caption: centered, mono, muted, numbered */
.css-figure figcaption { margin-top: 10px; text-align: center; font-family: ${MONO}; font-size: 12px; line-height: 1.5; color: ${C.muted}; }

@media print {
  .css-figure { break-inside: avoid; page-break-inside: avoid; }
}
`.trim();
}
