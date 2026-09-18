import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '../md-lectures/figures/templates');

const SVG_FOLDER = `<svg class="vce-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fde047" stroke="#ca8a04" stroke-width="1.5" d="M2 5.5C2 4.119 3.119 3 4.5 3h4.764c.732 0 1.425.327 1.887.89l1.698 2.072A1.5 1.5 0 0 0 13.91 6.5H19.5C20.881 6.5 22 7.619 22 9v10.5c0 1.381-1.119 2.5-2.5 2.5h-15C3.119 22 2 20.881 2 19.5v-14z"/></svg>`;
const SVG_VUE = `<svg class="vce-icon" viewBox="0 0 256 221" aria-hidden="true"><path fill="#42b883" d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36z"/><path fill="#35495e" d="M0 0l128 220.8L256 0h-51.2L128 132.48L49.92 0H0z"/></svg>`;
const SVG_TS = `<svg class="vce-icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="4" fill="#3178c6"/><path fill="#ffffff" d="M7 8h6v2.5h-1.7V17h-2.6v-6.5H7V8zm8.2 4.6c.7-.4 1.3-.7 1.9-.7.7 0 1.1.3 1.1.7 0 .5-.4.8-1.2 1.1l-.8.3c-1.4.5-2.2 1.4-2.2 2.6 0 1.7 1.4 2.7 3.4 2.7 1 0 1.8-.2 2.6-.7l-.6-2.1c-.6.4-1.3.6-1.9.6-.7 0-1.1-.3-1.1-.7 0-.4.3-.7 1.1-1l.8-.3c1.5-.6 2.3-1.4 2.3-2.7 0-1.6-1.3-2.6-3.3-2.6-.9 0-1.8.2-2.5.6l.4 2.1z"/></svg>`;

const COMMON_CSS = `
    .component-explorer.vce-theme {
      margin: 1.5rem auto;
      max-width: 680px;
      background: #ffffff;
      border: 1px solid #aeb8c5;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(15, 23, 42, 0.07), 0 1px 2px rgba(15, 23, 42, 0.04);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .vce-theme .vce-bar {
      display: flex;
      align-items: center;
      padding: 10px 14px;
      background: linear-gradient(to bottom, #ffffff, #edf1f5);
      border-bottom: 1px solid #aeb8c5;
    }
    .vce-theme .vce-dots {
      display: flex;
      gap: 7px;
    }
    .vce-theme .vce-dots i {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      display: inline-block;
    }
    .vce-theme .vce-dots i:nth-child(1) { background: #ef6259; border: 1px solid #d94d46; }
    .vce-theme .vce-dots i:nth-child(2) { background: #f3b62f; border: 1px solid #d79c1f; }
    .vce-theme .vce-dots i:nth-child(3) { background: #55bd55; border: 1px solid #3da543; }
    .vce-theme .vce-title {
      flex: 1;
      text-align: center;
      color: #475569;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      user-select: none;
      padding-right: 48px;
    }
    .vce-theme .vce-window {
      display: flex;
      min-height: 290px;
      background: #ffffff;
    }
    /* Left Sidebar: File Tree */
    .vce-theme .vce-sidebar {
      flex: 0 0 31%;
      padding: 1.1rem 0.95rem;
      background: #fdfdfd;
      border-right: 1px solid #cbd5e1;
      color: #0f172a;
      font-size: 0.84rem;
    }
    .vce-theme .vce-sidebar-title {
      padding: 0 0 0.65rem 0.25rem;
      margin-bottom: 0.65rem;
      border-bottom: 1px solid #e2e8f0;
      color: #64748b;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.09em;
      text-transform: uppercase;
    }
    .vce-theme .vce-tree,
    .vce-theme .vce-tree ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .vce-theme .vce-tree ul {
      padding-left: 1.25rem;
    }
    .vce-theme .vce-tree li {
      position: relative;
      margin: 0;
      padding: 2px 0;
    }
    .vce-theme .vce-tree li::before,
    .vce-theme .vce-tree li::after {
      position: absolute;
      left: -0.62rem;
      content: "";
    }
    .vce-theme .vce-tree li::before {
      top: 0.95rem;
      width: 0.62rem;
      border-top: 1px solid #cbd5e1;
    }
    .vce-theme .vce-tree li::after {
      top: 0;
      width: 0;
      height: 100%;
      border-left: 1px solid #cbd5e1;
    }
    .vce-theme .vce-sidebar > .vce-tree > li::before,
    .vce-theme .vce-sidebar > .vce-tree > li::after {
      display: none;
    }
    .vce-theme .vce-tree li:last-child::after {
      height: 0.95rem;
    }
    .vce-theme .vce-tree-label {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.28rem 0.38rem;
      border-radius: 5px;
      color: #0f172a;
      font-weight: 500;
      white-space: nowrap;
      user-select: none;
      font-size: 0.8rem;
    }
    .vce-theme .vce-tree-label.active {
      background: #e0f2fe;
      color: #0369a1;
      font-weight: 700;
    }
    .vce-theme .vce-icon {
      width: 1.05rem;
      height: 1.05rem;
      flex: none;
    }
    /* Right Stage: Component Canvas */
    .vce-theme .vce-stage {
      display: flex;
      flex: 1;
      min-width: 0;
      align-items: center;
      justify-content: center;
      padding: 1.6rem;
      background: #f1f5f9;
      box-shadow: inset 1px 0 3px rgba(15, 23, 42, 0.025);
    }
    .vce-theme .vce-canvas {
      width: 100%;
      max-width: 440px;
      margin: 0 auto;
    }
    .vce-theme .vce-node {
      position: relative;
      margin-top: 0.85rem;
      padding: 1.85rem 1rem 0.9rem;
      border: 2px dashed #94a3b8;
      border-radius: 9px;
      background: #fff;
      box-shadow: 0 4px 8px -4px rgba(15, 23, 42, 0.12);
    }
    .vce-theme .vce-node:first-child { margin-top: 0; }
    .vce-theme .vce-node-label {
      position: absolute;
      top: -2px;
      left: -2px;
      display: flex;
      align-items: baseline;
      max-width: calc(100% + 4px);
      padding: 0.3rem 0.65rem;
      border-top-left-radius: 7px;
      border-bottom-right-radius: 6px;
      color: #fff;
      font-family: "JetBrains Mono", monospace;
      font-size: 0.74rem;
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0.01em;
    }
    .vce-theme .vce-node-props {
      margin-left: 0.45rem;
      color: inherit;
      font-weight: 400;
      font-style: italic;
      opacity: 0.9;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /* Semantic Kinds & Colors */
    .vce-theme .kind-shell { border-color: #475569; background: #f8fafc; }
    .vce-theme .kind-shell > .vce-node-label { background: #475569; }
    .vce-theme .kind-counter { border-color: #059669; background: #ecfdf5; }
    .vce-theme .kind-counter > .vce-node-label { background: #059669; }
    .vce-theme .kind-badge { border-color: #d97706; background: #fffbeb; }
    .vce-theme .kind-badge > .vce-node-label { background: #d97706; }
    .vce-theme .kind-card { border-color: #2563eb; background: #eff6ff; }
    .vce-theme .kind-card > .vce-node-label { background: #2563eb; }
    .vce-theme .kind-branch { border-color: #db2777; background: #fdf2f8; }
    .vce-theme .kind-branch > .vce-node-label { background: #db2777; }
    .vce-theme .kind-form { border-color: #0891b2; background: #ecfeff; }
    .vce-theme .kind-form > .vce-node-label { background: #0891b2; }
    .vce-theme .kind-button { border-color: #059669; background: #ecfdf5; }
    .vce-theme .kind-button > .vce-node-label { background: #059669; }
    .vce-theme .kind-wrong { border-color: #dc2626; background: #fef2f2; }
    .vce-theme .kind-wrong > .vce-node-label { background: #dc2626; }
    .vce-theme .kind-store { border-color: #7c3aed; background: #faf5ff; }
    .vce-theme .kind-store > .vce-node-label { background: #7c3aed; }

    /* Children & Surface */
    .vce-theme .vce-children {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      margin-top: 0.2rem;
    }
    .vce-theme .vce-surface {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      width: 100%;
    }
    .vce-theme .vce-surface-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.45rem 0.7rem;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      background: #ffffff;
      color: #1f2937;
      font-size: 0.78rem;
      line-height: 1.35;
    }
    .vce-theme .vce-surface-line strong {
      color: #111827;
      font-weight: 800;
    }
    .vce-theme .vce-tag-pill {
      font-size: 0.68rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 3px;
      letter-spacing: 0.02em;
    }
    .vce-theme .pill-core { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
    .vce-theme .pill-compiler { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .vce-theme .pill-state { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .vce-theme .pill-wrong { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .vce-theme .vce-btn-ctrl {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 0.38rem 0.75rem;
      background: #059669;
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 4px;
      border: 1px solid #047857;
      box-shadow: 0 1px 2px rgba(0,0,0,0.08);
    }
    .vce-theme .vce-input-mock {
      display: inline-block;
      padding: 0.35rem 0.6rem;
      background: #ffffff;
      border: 1.5px solid #0891b2;
      border-radius: 4px;
      font-family: "JetBrains Mono", monospace;
      font-size: 0.76rem;
      color: #0f172a;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.06);
    }
`;

// TEMPLATE 02
const t02 = `<div class="component-explorer vce-theme">
  <style>
${COMMON_CSS}
  </style>

  <div class="vce-bar">
    <div class="vce-dots"><i></i><i></i><i></i></div>
    <span class="vce-title">ArticleFeed.vue — Component Explorer</span>
  </div>

  <div class="vce-window">
    <aside class="vce-sidebar">
      <div class="vce-sidebar-title">Project Files</div>
      <ul class="vce-tree">
        <li>
          <div class="vce-tree-label">
            ${SVG_FOLDER}
            <span>components</span>
          </div>
          <ul class="vce-tree">
            <li>
              <div class="vce-tree-label active">
                ${SVG_VUE}
                <span>ArticleFeed.vue</span>
              </div>
            </li>
            <li>
              <div class="vce-tree-label">
                ${SVG_VUE}
                <span>ArticleCard.vue</span>
              </div>
            </li>
          </ul>
        </li>
        <li>
          <div class="vce-tree-label">
            ${SVG_FOLDER}
            <span>data</span>
          </div>
          <ul class="vce-tree">
            <li>
              <div class="vce-tree-label">
                ${SVG_TS}
                <span>articles.ts</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <div class="vce-stage">
      <div class="vce-canvas">
        <div class="vce-node kind-shell">
          <div class="vce-node-label">
            <span>ArticleFeed</span>
            <span class="vce-node-props">:articles="list" (count={3})</span>
          </div>

          <!-- Strictly 3 Child Components (The Rule of 3) -->
          <div class="vce-children">
            <div class="vce-node kind-card">
              <div class="vce-node-label">
                <span>ArticleCard</span>
                <span class="vce-node-props">:key="101"</span>
              </div>
              <div class="vce-surface">
                <div class="vce-surface-line">
                  <span><strong>Reactivity Engine in Depth</strong></span>
                  <span class="vce-tag-pill pill-core">Core</span>
                </div>
              </div>
            </div>

            <div class="vce-node kind-card">
              <div class="vce-node-label">
                <span>ArticleCard</span>
                <span class="vce-node-props">:key="102"</span>
              </div>
              <div class="vce-surface">
                <div class="vce-surface-line">
                  <span><strong>Virtual DOM &amp; Patch Flags</strong></span>
                  <span class="vce-tag-pill pill-compiler">Compiler</span>
                </div>
              </div>
            </div>

            <div class="vce-node kind-card">
              <div class="vce-node-label">
                <span>ArticleCard</span>
                <span class="vce-node-props">:key="103"</span>
              </div>
              <div class="vce-surface">
                <div class="vce-surface-line">
                  <span><strong>Pinia Store Architecture</strong></span>
                  <span class="vce-tag-pill pill-state">State</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

// TEMPLATE 03: Parent-Child Props & Emits
const t03 = `<div class="component-explorer vce-theme">
  <style>
${COMMON_CSS}
  </style>

  <div class="vce-bar">
    <div class="vce-dots"><i></i><i></i><i></i></div>
    <span class="vce-title">UserProfile.vue — Component Explorer</span>
  </div>

  <div class="vce-window">
    <aside class="vce-sidebar">
      <div class="vce-sidebar-title">Project Files</div>
      <ul class="vce-tree">
        <li>
          <div class="vce-tree-label">
            ${SVG_FOLDER}
            <span>components</span>
          </div>
          <ul class="vce-tree">
            <li>
              <div class="vce-tree-label active">
                ${SVG_VUE}
                <span>UserProfile.vue</span>
              </div>
            </li>
            <li>
              <div class="vce-tree-label">
                ${SVG_VUE}
                <span>StatusBadge.vue</span>
              </div>
            </li>
            <li>
              <div class="vce-tree-label">
                ${SVG_VUE}
                <span>ActionButton.vue</span>
              </div>
            </li>
          </ul>
        </li>
        <li>
          <div class="vce-tree-label">
            ${SVG_FOLDER}
            <span>types</span>
          </div>
          <ul class="vce-tree">
            <li>
              <div class="vce-tree-label">
                ${SVG_TS}
                <span>user.ts</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <div class="vce-stage">
      <div class="vce-canvas">
        <div class="vce-node kind-shell">
          <div class="vce-node-label">
            <span>UserProfile</span>
            <span class="vce-node-props">userName="Elena Rostova"</span>
          </div>

          <div class="vce-surface" style="margin-bottom: 0.65rem;">
            <div class="vce-surface-line">
              <span>Current Profile:</span>
              <span><strong>Elena Rostova</strong> · Senior Editor</span>
            </div>
          </div>

          <div class="vce-children">
            <!-- Downward Prop Target -->
            <div class="vce-node kind-badge">
              <div class="vce-node-label">
                <span>StatusBadge</span>
                <span class="vce-node-props">:status="active" (Prop ▾)</span>
              </div>
              <div class="vce-surface">
                <div class="vce-surface-line">
                  <span>Account state:</span>
                  <span class="vce-tag-pill pill-state">● Active Subscriber</span>
                </div>
              </div>
            </div>

            <!-- Upward Emit Source -->
            <div class="vce-node kind-button">
              <div class="vce-node-label">
                <span>ActionButton</span>
                <span class="vce-node-props">@select="onSelect" (Emit ▴)</span>
              </div>
              <div class="vce-surface">
                <div class="vce-surface-line">
                  <span>Dispatched action:</span>
                  <span class="vce-btn-ctrl">Toggle Subscription (@click)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

// TEMPLATE 04: Symmetrical Comparative Duel
const t04 = `<div class="component-explorer vce-theme">
  <style>
${COMMON_CSS}
  </style>

  <div class="vce-bar">
    <div class="vce-dots"><i></i><i></i><i></i></div>
    <span class="vce-title">ReactivityDuel.vue — Component Explorer (Symmetrical Duel)</span>
  </div>

  <div class="vce-window">
    <aside class="vce-sidebar">
      <div class="vce-sidebar-title">Project Files</div>
      <ul class="vce-tree">
        <li>
          <div class="vce-tree-label">
            ${SVG_FOLDER}
            <span>components</span>
          </div>
          <ul class="vce-tree">
            <li>
              <div class="vce-tree-label">
                ${SVG_VUE}
                <span>CounterBroken.vue</span>
              </div>
            </li>
            <li>
              <div class="vce-tree-label active">
                ${SVG_VUE}
                <span>CounterReactive.vue</span>
              </div>
            </li>
          </ul>
        </li>
        <li>
          <div class="vce-tree-label">
            ${SVG_FOLDER}
            <span>composables</span>
          </div>
          <ul class="vce-tree">
            <li>
              <div class="vce-tree-label">
                ${SVG_TS}
                <span>useCounter.ts</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <div class="vce-stage">
      <div class="vce-canvas">
        <div class="vce-children" style="gap: 1rem; margin-top: 0;">
          <!-- Wrong Duel Side -->
          <div class="vce-node kind-wrong">
            <div class="vce-node-label">
              <span>CounterBroken</span>
              <span class="vce-node-props">✕ BROKEN: const { count } = state</span>
            </div>
            <div class="vce-surface">
              <div class="vce-surface-line">
                <span>DOM rendered value:</span>
                <strong>0 (Stale frozen)</strong>
              </div>
              <div class="vce-surface-line">
                <span>Engine status:</span>
                <span class="vce-tag-pill pill-wrong">Proxy severed on destructure</span>
              </div>
            </div>
          </div>

          <!-- Right Duel Side -->
          <div class="vce-node kind-counter">
            <div class="vce-node-label">
              <span>CounterReactive</span>
              <span class="vce-node-props">✓ REACTIVE: toRefs(state).count</span>
            </div>
            <div class="vce-surface">
              <div class="vce-surface-line">
                <span>DOM rendered value:</span>
                <strong>5 (Live updated)</strong>
              </div>
              <div class="vce-surface-line">
                <span>Engine status:</span>
                <span class="vce-tag-pill pill-state">Proxy getter/setter active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

// TEMPLATE 05: Two-Way Binding & defineModel
const t05 = `<div class="component-explorer vce-theme">
  <style>
${COMMON_CSS}
  </style>

  <div class="vce-bar">
    <div class="vce-dots"><i></i><i></i><i></i></div>
    <span class="vce-title">SearchFilter.vue — Component Explorer</span>
  </div>

  <div class="vce-window">
    <aside class="vce-sidebar">
      <div class="vce-sidebar-title">Project Files</div>
      <ul class="vce-tree">
        <li>
          <div class="vce-tree-label">
            ${SVG_FOLDER}
            <span>components</span>
          </div>
          <ul class="vce-tree">
            <li>
              <div class="vce-tree-label">
                ${SVG_VUE}
                <span>SearchFilter.vue</span>
              </div>
            </li>
            <li>
              <div class="vce-tree-label active">
                ${SVG_VUE}
                <span>SearchBox.vue</span>
              </div>
            </li>
          </ul>
        </li>
        <li>
          <div class="vce-tree-label">
            ${SVG_FOLDER}
            <span>composables</span>
          </div>
          <ul class="vce-tree">
            <li>
              <div class="vce-tree-label">
                ${SVG_TS}
                <span>useSearch.ts</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <div class="vce-stage">
      <div class="vce-canvas">
        <div class="vce-node kind-shell">
          <div class="vce-node-label">
            <span>SearchFilter</span>
            <span class="vce-node-props">searchQuery="climate"</span>
          </div>

          <div class="vce-surface" style="margin-bottom: 0.65rem;">
            <div class="vce-surface-line">
              <span>Parent ref state:</span>
              <span>query = <strong>"climate"</strong></span>
            </div>
          </div>

          <div class="vce-children">
            <div class="vce-node kind-form">
              <div class="vce-node-label">
                <span>SearchBox</span>
                <span class="vce-node-props">v-model="searchQuery" (defineModel)</span>
              </div>
              <div class="vce-surface">
                <div class="vce-surface-line">
                  <span>Input field:</span>
                  <span class="vce-input-mock">climate</span>
                </div>
                <div class="vce-surface-line">
                  <span>Sync status:</span>
                  <span class="vce-tag-pill pill-state">✓ Live two-way binding</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

// TEMPLATE 06: Pinia Store Architecture
const t06 = `<div class="component-explorer vce-theme">
  <style>
${COMMON_CSS}
  </style>

  <div class="vce-bar">
    <div class="vce-dots"><i></i><i></i><i></i></div>
    <span class="vce-title">AccountDashboard.vue — Component Explorer</span>
  </div>

  <div class="vce-window">
    <aside class="vce-sidebar">
      <div class="vce-sidebar-title">Project Files</div>
      <ul class="vce-tree">
        <li>
          <div class="vce-tree-label">
            ${SVG_FOLDER}
            <span>components</span>
          </div>
          <ul class="vce-tree">
            <li>
              <div class="vce-tree-label">
                ${SVG_VUE}
                <span>NavBar.vue</span>
              </div>
            </li>
            <li>
              <div class="vce-tree-label active">
                ${SVG_VUE}
                <span>AccountCard.vue</span>
              </div>
            </li>
          </ul>
        </li>
        <li>
          <div class="vce-tree-label">
            ${SVG_FOLDER}
            <span>stores</span>
          </div>
          <ul class="vce-tree">
            <li>
              <div class="vce-tree-label active">
                ${SVG_TS}
                <span>auth.ts</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <div class="vce-stage">
      <div class="vce-canvas">
        <!-- Pinia Global Store Compartment -->
        <div class="vce-node kind-store">
          <div class="vce-node-label">
            <span>pinia: useAuthStore</span>
            <span class="vce-node-props">State &amp; Getters</span>
          </div>
          <div class="vce-surface">
            <div class="vce-surface-line">
              <span>Store user:</span>
              <strong>"Elena Rostova" (Role: Editor)</strong>
            </div>
            <div class="vce-surface-line">
              <span>Getter isAuthenticated:</span>
              <span class="vce-tag-pill pill-state">true</span>
            </div>
          </div>
        </div>

        <!-- Consumer Component Card -->
        <div class="vce-node kind-card" style="margin-top: 0.85rem;">
          <div class="vce-node-label">
            <span>AccountCard</span>
            <span class="vce-node-props">storeToRefs(auth)</span>
          </div>
          <div class="vce-surface">
            <div class="vce-surface-line">
              <span>Rendered greeting:</span>
              <span>Welcome back, <strong>Elena</strong></span>
            </div>
            <div class="vce-surface-line">
              <span>Action dispatch:</span>
              <span class="vce-btn-ctrl">Logout (auth.logout())</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

writeFileSync(join(TEMPLATES_DIR, '02-list-repeat-3-items.html'), t02, 'utf8');
writeFileSync(join(TEMPLATES_DIR, '03-parent-child-props-emits.html'), t03, 'utf8');
writeFileSync(join(TEMPLATES_DIR, '04-compare-wrong-right.html'), t04, 'utf8');
writeFileSync(join(TEMPLATES_DIR, '05-two-way-binding.html'), t05, 'utf8');
writeFileSync(join(TEMPLATES_DIR, '06-pinia-store-dispatch.html'), t06, 'utf8');

console.log('Successfully updated templates 02 through 06 with authentic VCE standard!');
