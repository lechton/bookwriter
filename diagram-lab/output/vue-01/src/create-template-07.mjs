import { writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '../md-lectures/figures/templates');

const SVG_FOLDER = `<svg class="vce-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fde047" stroke="#ca8a04" stroke-width="1.5" d="M2 5.5C2 4.119 3.119 3 4.5 3h4.764c.732 0 1.425.327 1.887.89l1.698 2.072A1.5 1.5 0 0 0 13.91 6.5H19.5C20.881 6.5 22 7.619 22 9v10.5c0 1.381-1.119 2.5-2.5 2.5h-15C3.119 22 2 20.881 2 19.5v-14z"/></svg>`;
const SVG_VUE = `<svg class="vce-icon" viewBox="0 0 256 221" aria-hidden="true"><path fill="#42b883" d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36z"/><path fill="#35495e" d="M0 0l128 220.8L256 0h-51.2L128 132.48L49.92 0H0z"/></svg>`;
const SVG_TS = `<svg class="vce-icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="4" fill="#3178c6"/><path fill="#ffffff" d="M7 8h6v2.5h-1.7V17h-2.6v-6.5H7V8zm8.2 4.6c.7-.4 1.3-.7 1.9-.7.7 0 1.1.3 1.1.7 0 .5-.4.8-1.2 1.1l-.8.3c-1.4.5-2.2 1.4-2.2 2.6 0 1.7 1.4 2.7 3.4 2.7 1 0 1.8-.2 2.6-.7l-.6-2.1c-.6.4-1.3.6-1.9.6-.7 0-1.1-.3-1.1-.7 0-.4.3-.7 1.1-1l.8-.3c1.5-.6 2.3-1.4 2.3-2.7 0-1.6-1.3-2.6-3.3-2.6-.9 0-1.8.2-2.5.6l.4 2.1z"/></svg>`;

const t07 = `<div class="component-explorer vce-theme">
  <style>
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
      padding: 1.85rem 1rem 0.95rem;
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
    /* Semantic Kinds */
    .vce-theme .kind-card { border-color: #2563eb; background: #eff6ff; }
    .vce-theme .kind-card > .vce-node-label { background: #2563eb; }
    .vce-theme .kind-counter { border-color: #059669; background: #ecfdf5; }
    .vce-theme .kind-counter > .vce-node-label { background: #059669; }

    /* Decomposed Sub-component: Cart Item Stepper Row */
    .vce-theme .item-row-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.6rem;
      padding: 0.65rem 0.8rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 7px;
    }
    .vce-theme .item-info {
      display: flex;
      flex-direction: column;
    }
    .vce-theme .item-name {
      font-size: 0.82rem;
      font-weight: 800;
      color: #0f172a;
    }
    .vce-theme .item-unit-price {
      font-size: 0.72rem;
      color: #64748b;
      font-family: "JetBrains Mono", monospace;
    }
    .vce-theme .item-stepper {
      display: flex;
      align-items: center;
      gap: 5px;
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 5px;
      padding: 2px 5px;
    }
    .vce-theme .btn-mini-step {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 3px;
      font-size: 0.75rem;
      font-weight: 700;
      color: #334155;
      cursor: pointer;
    }
    .vce-theme .step-qty {
      font-size: 0.8rem;
      font-weight: 800;
      font-family: "JetBrains Mono", monospace;
      color: #0f172a;
      min-width: 14px;
      text-align: center;
    }
    .vce-theme .item-line-total {
      font-size: 0.86rem;
      font-weight: 800;
      color: #0f172a;
      font-family: "JetBrains Mono", monospace;
    }
    .vce-theme .btn-item-remove {
      font-size: 0.7rem;
      font-weight: 700;
      color: #dc2626;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 4px;
      padding: 3px 6px;
      cursor: pointer;
    }

    /* Sub-component 2: Summary Row */
    .vce-theme .summary-card {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      padding: 0.65rem 0.8rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 7px;
    }
    .vce-theme .summary-metric-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.74rem;
      color: #475569;
    }
    .vce-theme .summary-metric-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.3rem;
      padding-top: 0.4rem;
      border-top: 1.5px solid #e2e8f0;
      font-weight: 800;
      color: #0f172a;
      font-size: 0.88rem;
      font-family: "JetBrains Mono", monospace;
    }
  </style>

  <div class="vce-bar">
    <div class="vce-dots"><i></i><i></i><i></i></div>
    <span class="vce-title">CartItemRow.vue — Component Explorer (Step 2: Sub-Component Zoom)</span>
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
                <span>CartDrawer.vue</span>
              </div>
            </li>
            <li>
              <div class="vce-tree-label active">
                ${SVG_VUE}
                <span>CartItemRow.vue</span>
              </div>
            </li>
            <li>
              <div class="vce-tree-label">
                ${SVG_VUE}
                <span>CartSummary.vue</span>
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
              <div class="vce-tree-label">
                ${SVG_TS}
                <span>cart.ts</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <div class="vce-stage">
      <div class="vce-canvas">
        <!-- Sub-Component 1: Isolated Item Row -->
        <div class="vce-node kind-card">
          <div class="vce-node-label">
            <span>CartItemRow.vue</span>
            <span class="vce-node-props">:item="switchPack" @update:qty="onQty"</span>
          </div>
          <div class="item-row-card">
            <div class="item-info">
              <span class="item-name">Mechanical Switch Pack</span>
              <span class="item-unit-price">$32.00 / unit</span>
            </div>
            <div class="item-stepper">
              <button class="btn-mini-step">−</button>
              <span class="step-qty">1</span>
              <button class="btn-mini-step">+</button>
            </div>
            <span class="item-line-total">$32.00</span>
            <button class="btn-item-remove">✕</button>
          </div>
        </div>

        <!-- Sub-Component 2: Isolated Summary Box -->
        <div class="vce-node kind-counter" style="margin-top: 0.85rem;">
          <div class="vce-node-label">
            <span>CartSummary.vue</span>
            <span class="vce-node-props">:subtotal="74.50"</span>
          </div>
          <div class="summary-card">
            <div class="summary-metric-row">
              <span>Standard Shipping:</span>
              <span style="color: #059669; font-weight: 700;">Free</span>
            </div>
            <div class="summary-metric-total">
              <span style="font-family: -apple-system, sans-serif; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Subtotal Due</span>
              <span>$74.50</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

writeFileSync(join(TEMPLATES_DIR, '07-progressive-decomposition-step2.html'), t07, 'utf8');
console.log('Successfully created Template 07 (Progressive Decomposition Step 2)!');
