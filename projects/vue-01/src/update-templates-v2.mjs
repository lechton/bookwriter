import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '../md-lectures/figures/templates');
const PRODUCTION_DIR = join(__dirname, '../md-lectures/figures');

const SVG_FOLDER = `<svg class="vce-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="#fde047" stroke="#ca8a04" stroke-width="1.5" d="M2 5.5C2 4.119 3.119 3 4.5 3h4.764c.732 0 1.425.327 1.887.89l1.698 2.072A1.5 1.5 0 0 0 13.91 6.5H19.5C20.881 6.5 22 7.619 22 9v10.5c0 1.381-1.119 2.5-2.5 2.5h-15C3.119 22 2 20.881 2 19.5v-14z"/></svg>`;
const SVG_VUE = `<svg class="vce-icon" viewBox="0 0 256 221" aria-hidden="true"><path fill="#42b883" d="M204.8 0H256L128 220.8L0 0h97.92L128 51.2L157.44 0h47.36z"/><path fill="#35495e" d="M0 0l128 220.8L256 0h-51.2L128 132.48L49.92 0H0z"/></svg>`;
const SVG_TS = `<svg class="vce-icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="4" fill="#3178c6"/><path fill="#ffffff" d="M7 8h6v2.5h-1.7V17h-2.6v-6.5H7V8zm8.2 4.6c.7-.4 1.3-.7 1.9-.7.7 0 1.1.3 1.1.7 0 .5-.4.8-1.2 1.1l-.8.3c-1.4.5-2.2 1.4-2.2 2.6 0 1.7 1.4 2.7 3.4 2.7 1 0 1.8-.2 2.6-.7l-.6-2.1c-.6.4-1.3.6-1.9.6-.7 0-1.1-.3-1.1-.7 0-.4.3-.7 1.1-1l.8-.3c1.5-.6 2.3-1.4 2.3-2.7 0-1.6-1.3-2.6-3.3-2.6-.9 0-1.8.2-2.5.6l.4 2.1z"/></svg>`;

const BASE_CSS = `
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
    .vce-theme .kind-shell { border-color: #475569; background: #f8fafc; }
    .vce-theme .kind-shell > .vce-node-label { background: #475569; }
    .vce-theme .kind-counter { border-color: #059669; background: #ecfdf5; }
    .vce-theme .kind-counter > .vce-node-label { background: #059669; }
    .vce-theme .kind-badge { border-color: #d97706; background: #fffbeb; }
    .vce-theme .kind-badge > .vce-node-label { background: #d97706; }
    .vce-theme .kind-card { border-color: #2563eb; background: #eff6ff; }
    .vce-theme .kind-card > .vce-node-label { background: #2563eb; }
    .vce-theme .kind-button { border-color: #059669; background: #ecfdf5; }
    .vce-theme .kind-button > .vce-node-label { background: #059669; }
    .vce-theme .kind-wrong { border-color: #dc2626; background: #fef2f2; }
    .vce-theme .kind-wrong > .vce-node-label { background: #dc2626; }
    .vce-theme .kind-store { border-color: #7c3aed; background: #faf5ff; }
    .vce-theme .kind-store > .vce-node-label { background: #7c3aed; }
    .vce-theme .kind-form { border-color: #0891b2; background: #ecfeff; }
    .vce-theme .kind-form > .vce-node-label { background: #0891b2; }

    .vce-theme .vce-children {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      margin-top: 0.2rem;
    }
`;

// ==========================================
// TEMPLATE 01: The Counter Widget
// ==========================================
const t01 = `<div class="component-explorer vce-theme">
  <style>
${BASE_CSS}
    /* Counter Widget Styles */
    .vce-theme .counter-widget {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 0.8rem 1rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
    }
    .vce-theme .counter-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .vce-theme .counter-number {
      font-size: 2.2rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
    }
    .vce-theme .counter-caption {
      font-size: 0.72rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .vce-theme .counter-btn-row {
      display: flex;
      gap: 0.6rem;
      width: 100%;
      max-width: 260px;
    }
    .vce-theme .btn-stepper {
      flex: 1;
      padding: 0.55rem 0.8rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .vce-theme .btn-dec {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #334155;
    }
    .vce-theme .btn-inc {
      background: #059669;
      border: 1px solid #047857;
      color: #ffffff;
      box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
    }
  </style>

  <div class="vce-bar">
    <div class="vce-dots"><i></i><i></i><i></i></div>
    <span class="vce-title">CounterButton.vue — Component Explorer</span>
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
                <span>CounterButton.vue</span>
              </div>
            </li>
            <li>
              <div class="vce-tree-label">
                ${SVG_VUE}
                <span>HeaderNav.vue</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <div class="vce-stage">
      <div class="vce-canvas">
        <div class="vce-node kind-counter">
          <div class="vce-node-label">
            <span>CounterButton.vue</span>
            <span class="vce-node-props">:step="1"</span>
          </div>

          <!-- Pure Archetypical Counter UI (No Meta Descriptions) -->
          <div class="counter-widget">
            <div class="counter-display">
              <span class="counter-number">5</span>
              <span class="counter-caption">Items in Cart</span>
            </div>
            <div class="counter-btn-row">
              <button class="btn-stepper btn-dec">− Decrease</button>
              <button class="btn-stepper btn-inc">+ Increase</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

// ==========================================
// TEMPLATE 02: The Article Feed (Rule of 3)
// ==========================================
const t02 = `<div class="component-explorer vce-theme">
  <style>
${BASE_CSS}
    /* Elegant Flat Article Cards */
    .vce-theme .article-list {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .vce-theme .article-card-body {
      padding: 0.55rem 0.75rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
    }
    .vce-theme .article-top-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .vce-theme .article-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.25;
    }
    .vce-theme .article-category {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 3px;
      flex: none;
      letter-spacing: 0.02em;
    }
    .vce-theme .cat-metro { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
    .vce-theme .cat-world { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .vce-theme .cat-biz { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .vce-theme .article-snippet {
      font-size: 0.73rem;
      color: #475569;
      line-height: 1.35;
      margin: 4px 0 5px;
    }
    .vce-theme .article-byline {
      font-size: 0.68rem;
      color: #64748b;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .vce-theme .dot-sep { color: #94a3b8; }
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
            <span>ArticleFeed.vue</span>
            <span class="vce-node-props">:articles="3"</span>
          </div>

          <!-- Pure Archetypical Article Cards (No Meta Descriptions) -->
          <div class="vce-children">
            <div class="vce-node kind-card">
              <div class="vce-node-label">
                <span>ArticleCard.vue</span>
                <span class="vce-node-props">:key="101"</span>
              </div>
              <div class="article-card-body">
                <div class="article-top-row">
                  <span class="article-title">Transit Overhaul Approved for Metro District</span>
                  <span class="article-category cat-metro">Metro</span>
                </div>
                <p class="article-snippet">City council votes to fund four light rail extensions starting this winter.</p>
                <div class="article-byline">
                  <span>Marcus Vance</span>
                  <span class="dot-sep">·</span>
                  <span>4 min read</span>
                </div>
              </div>
            </div>

            <div class="vce-node kind-card">
              <div class="vce-node-label">
                <span>ArticleCard.vue</span>
                <span class="vce-node-props">:key="102"</span>
              </div>
              <div class="article-card-body">
                <div class="article-top-row">
                  <span class="article-title">Clean Energy Accord Signed by Five Nations</span>
                  <span class="article-category cat-world">World</span>
                </div>
                <p class="article-snippet">Historic treaty pledges joint investment in offshore wind and modern transmission grids.</p>
                <div class="article-byline">
                  <span>Elena Rostova</span>
                  <span class="dot-sep">·</span>
                  <span>6 min read</span>
                </div>
              </div>
            </div>

            <div class="vce-node kind-card">
              <div class="vce-node-label">
                <span>ArticleCard.vue</span>
                <span class="vce-node-props">:key="103"</span>
              </div>
              <div class="article-card-body">
                <div class="article-top-row">
                  <span class="article-title">Port Automation Talks Enter Critical Stage</span>
                  <span class="article-category cat-biz">Economy</span>
                </div>
                <p class="article-snippet">Logistics operators and union leaders meet in Geneva to resolve scheduling disputes.</p>
                <div class="article-byline">
                  <span>Julian Hayes</span>
                  <span class="dot-sep">·</span>
                  <span>3 min read</span>
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

// ==========================================
// TEMPLATE 03: User Profile & Actions
// ==========================================
const t03 = `<div class="component-explorer vce-theme">
  <style>
${BASE_CSS}
    /* Profile Widget */
    .vce-theme .profile-header {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.65rem 0.8rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 7px;
      margin-bottom: 0.65rem;
    }
    .vce-theme .avatar-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #0f172a;
      color: #ffffff;
      font-size: 0.78rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: none;
    }
    .vce-theme .profile-text {
      display: flex;
      flex-direction: column;
    }
    .vce-theme .profile-name {
      font-size: 0.84rem;
      font-weight: 800;
      color: #0f172a;
    }
    .vce-theme .profile-role {
      font-size: 0.72rem;
      color: #64748b;
      font-weight: 500;
    }
    .vce-theme .status-badge-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.45rem 0.75rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
    }
    .vce-theme .status-pill-active {
      font-size: 0.72rem;
      font-weight: 700;
      color: #047857;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .vce-theme .status-detail {
      font-size: 0.7rem;
      color: #64748b;
      font-weight: 600;
    }
    .vce-theme .action-btn-row {
      display: flex;
      gap: 0.5rem;
    }
    .vce-theme .action-btn-row button {
      flex: 1;
      padding: 0.45rem 0.7rem;
      font-size: 0.76rem;
      font-weight: 700;
      border-radius: 5px;
      cursor: pointer;
    }
    .vce-theme .btn-following {
      background: #059669;
      border: 1px solid #047857;
      color: #ffffff;
    }
    .vce-theme .btn-message {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #334155;
    }
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
      </ul>
    </aside>

    <div class="vce-stage">
      <div class="vce-canvas">
        <div class="vce-node kind-shell">
          <div class="vce-node-label">
            <span>UserProfile.vue</span>
          </div>

          <!-- Archetypical Profile Header (No Meta Descriptions) -->
          <div class="profile-header">
            <div class="avatar-circle">ER</div>
            <div class="profile-text">
              <span class="profile-name">Elena Rostova</span>
              <span class="profile-role">Senior Science Correspondent</span>
            </div>
          </div>

          <div class="vce-children">
            <!-- Child 1: StatusBadge.vue -->
            <div class="vce-node kind-badge">
              <div class="vce-node-label">
                <span>StatusBadge.vue</span>
                <span class="vce-node-props">:status="active"</span>
              </div>
              <div class="status-badge-box">
                <span class="status-pill-active">● Active Contributor</span>
                <span class="status-detail">Verified Press Pass</span>
              </div>
            </div>

            <!-- Child 2: ActionButton.vue -->
            <div class="vce-node kind-button">
              <div class="vce-node-label">
                <span>ActionButton.vue</span>
              </div>
              <div class="action-btn-row">
                <button class="btn-following">Following</button>
                <button class="btn-message">Message</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

// ==========================================
// TEMPLATE 04: The Music Player Duel
// ==========================================
const t04 = `<div class="component-explorer vce-theme">
  <style>
${BASE_CSS}
    /* Music Player Archetype */
    .vce-theme .player-card {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      padding: 0.75rem 0.85rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 7px;
    }
    .vce-theme .player-track-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .vce-theme .player-title {
      font-size: 0.82rem;
      font-weight: 800;
      color: #0f172a;
    }
    .vce-theme .player-artist {
      font-size: 0.72rem;
      color: #64748b;
      font-weight: 500;
    }
    .vce-theme .player-progress-bar {
      width: 100%;
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      position: relative;
      overflow: visible;
    }
    .vce-theme .progress-fill-frozen {
      width: 0%;
      height: 100%;
      background: #94a3b8;
      border-radius: 3px;
    }
    .vce-theme .progress-fill-active {
      width: 58%;
      height: 100%;
      background: #059669;
      border-radius: 3px;
      position: relative;
    }
    .vce-theme .progress-fill-active::after {
      content: "";
      position: absolute;
      right: -4px;
      top: -3px;
      width: 12px;
      height: 12px;
      background: #ffffff;
      border: 2.5px solid #059669;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    }
    .vce-theme .player-timestamps {
      display: flex;
      justify-content: space-between;
      font-size: 0.68rem;
      font-weight: 700;
      color: #64748b;
      font-family: "JetBrains Mono", monospace;
    }
    .vce-theme .player-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }
    .vce-theme .btn-track-step {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #475569;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .vce-theme .btn-play-state {
      padding: 5px 16px;
      font-size: 0.76rem;
      font-weight: 800;
      border-radius: 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .vce-theme .btn-state-paused {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #334155;
    }
    .vce-theme .btn-state-playing {
      background: #059669;
      border: 1px solid #047857;
      color: #ffffff;
      box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
    }
  </style>

  <div class="vce-bar">
    <div class="vce-dots"><i></i><i></i><i></i></div>
    <span class="vce-title">MusicPlayer.vue — Component Explorer (Symmetrical Comparison)</span>
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
                <span>PlayerBroken.vue</span>
              </div>
            </li>
            <li>
              <div class="vce-tree-label active">
                ${SVG_VUE}
                <span>PlayerReactive.vue</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <div class="vce-stage">
      <div class="vce-canvas">
        <div class="vce-children" style="gap: 1rem; margin-top: 0;">
          <!-- Broken Music Player -->
          <div class="vce-node kind-wrong">
            <div class="vce-node-label">
              <span>PlayerBroken.vue</span>
              <span class="vce-node-props">✕ BROKEN</span>
            </div>
            <div class="player-card">
              <div class="player-track-info">
                <span class="player-title">Solaris Drift</span>
                <span class="player-artist">Kavinsky · Nightcall EP</span>
              </div>
              <div class="player-progress-bar">
                <div class="progress-fill-frozen"></div>
              </div>
              <div class="player-timestamps">
                <span>00:00</span>
                <span>04:15</span>
              </div>
              <div class="player-controls">
                <button class="btn-track-step">⏮</button>
                <button class="btn-play-state btn-state-paused">▶ Play</button>
                <button class="btn-track-step">⏭</button>
              </div>
            </div>
          </div>

          <!-- Reactive Music Player -->
          <div class="vce-node kind-counter">
            <div class="vce-node-label">
              <span>PlayerReactive.vue</span>
              <span class="vce-node-props">✓ REACTIVE</span>
            </div>
            <div class="player-card">
              <div class="player-track-info">
                <span class="player-title">Solaris Drift</span>
                <span class="player-artist">Kavinsky · Nightcall EP</span>
              </div>
              <div class="player-progress-bar">
                <div class="progress-fill-active"></div>
              </div>
              <div class="player-timestamps">
                <span>02:28</span>
                <span>04:15</span>
              </div>
              <div class="player-controls">
                <button class="btn-track-step">⏮</button>
                <button class="btn-play-state btn-state-playing">⏸ Pause</button>
                <button class="btn-track-step">⏭</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

// ==========================================
// TEMPLATE 05: Search Filter & Two-Way Input
// ==========================================
const t05 = `<div class="component-explorer vce-theme">
  <style>
${BASE_CSS}
    /* Search Box & Query UI */
    .vce-theme .search-input-shell {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.55rem 0.8rem;
      background: #ffffff;
      border: 1.5px solid #0891b2;
      border-radius: 6px;
      box-shadow: 0 1px 2px rgba(8, 145, 178, 0.08);
    }
    .vce-theme .search-icon {
      color: #0891b2;
      width: 14px;
      height: 14px;
      flex: none;
    }
    .vce-theme .search-text {
      flex: 1;
      font-family: "JetBrains Mono", monospace;
      font-size: 0.82rem;
      color: #0f172a;
      font-weight: 600;
    }
    .vce-theme .search-clear-btn {
      color: #94a3b8;
      font-size: 0.8rem;
      font-weight: 700;
      background: #f1f5f9;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .vce-theme .search-results-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.75rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      margin-bottom: 0.65rem;
    }
    .vce-theme .results-count {
      font-size: 0.78rem;
      font-weight: 700;
      color: #0f172a;
    }
    .vce-theme .results-pill {
      font-size: 0.68rem;
      font-weight: 700;
      color: #0891b2;
      background: #ecfeff;
      border: 1px solid #a5f3fc;
      padding: 2px 7px;
      border-radius: 4px;
    }
    .vce-theme .filter-chips {
      display: flex;
      gap: 0.45rem;
      margin-top: 0.5rem;
    }
    .vce-theme .filter-chip {
      font-size: 0.68rem;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #475569;
    }
    .vce-theme .filter-chip.active {
      background: #0891b2;
      border-color: #0e7490;
      color: #ffffff;
      font-weight: 700;
    }
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
      </ul>
    </aside>

    <div class="vce-stage">
      <div class="vce-canvas">
        <div class="vce-node kind-shell">
          <div class="vce-node-label">
            <span>SearchFilter.vue</span>
          </div>

          <!-- Archetypical Search Results (No Meta Descriptions) -->
          <div class="search-results-bar">
            <span class="results-count">14 stories found for "climate"</span>
            <span class="results-pill">Live Sync</span>
          </div>

          <div class="vce-children">
            <div class="vce-node kind-form">
              <div class="vce-node-label">
                <span>SearchBox.vue</span>
                <span class="vce-node-props">v-model="query"</span>
              </div>
              <div class="search-input-shell">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <span class="search-text">climate</span>
                <span class="search-clear-btn">✕</span>
              </div>
              <div class="filter-chips">
                <span class="filter-chip active">All (14)</span>
                <span class="filter-chip">Investigative (8)</span>
                <span class="filter-chip">Opinion (6)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

// ==========================================
// TEMPLATE 06: Pinia Store & Cart Drawer
// ==========================================
const t06 = `<div class="component-explorer vce-theme">
  <style>
${BASE_CSS}
    /* Shopping Bag Archetype */
    .vce-theme .store-header-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.55rem 0.75rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
    }
    .vce-theme .store-user {
      font-size: 0.8rem;
      font-weight: 800;
      color: #0f172a;
    }
    .vce-theme .store-auth-badge {
      font-size: 0.68rem;
      font-weight: 700;
      color: #6d28d9;
      background: #f5f3ff;
      border: 1px solid #ddd6fe;
      padding: 2px 7px;
      border-radius: 4px;
    }
    .vce-theme .bag-card {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.7rem 0.85rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 7px;
    }
    .vce-theme .bag-item-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.76rem;
      color: #334155;
      padding-bottom: 0.35rem;
      border-bottom: 1px solid #f1f5f9;
    }
    .vce-theme .bag-item-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    .vce-theme .bag-item-title {
      font-weight: 600;
    }
    .vce-theme .bag-item-price {
      font-weight: 800;
      color: #0f172a;
      font-family: "JetBrains Mono", monospace;
    }
    .vce-theme .bag-total-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.35rem;
      padding-top: 0.45rem;
      border-top: 1.5px solid #e2e8f0;
    }
    .vce-theme .total-label {
      font-size: 0.74rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .vce-theme .total-val {
      font-size: 0.95rem;
      font-weight: 800;
      color: #0f172a;
      font-family: "JetBrains Mono", monospace;
    }
    .vce-theme .btn-checkout {
      width: 100%;
      margin-top: 0.4rem;
      padding: 0.55rem;
      background: #059669;
      border: 1px solid #047857;
      border-radius: 5px;
      color: #ffffff;
      font-size: 0.8rem;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>

  <div class="vce-bar">
    <div class="vce-dots"><i></i><i></i><i></i></div>
    <span class="vce-title">CartDrawer.vue — Component Explorer</span>
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
                <span>CartDrawer.vue</span>
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
                <span>cart.ts</span>
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
            <span>pinia: useCartStore</span>
          </div>
          <div class="store-header-box">
            <span class="store-user">Elena Rostova</span>
            <span class="store-auth-badge">Verified Member · Free Shipping</span>
          </div>
        </div>

        <!-- Consumer Component Card -->
        <div class="vce-node kind-card" style="margin-top: 0.85rem;">
          <div class="vce-node-label">
            <span>CartDrawer.vue</span>
            <span class="vce-node-props">:items="3"</span>
          </div>

          <!-- Pure Archetypical Cart Drawer (No Meta Descriptions) -->
          <div class="bag-card">
            <div class="bag-item-row">
              <span class="bag-item-title">Mechanical Switch Pack</span>
              <span class="bag-item-price">$32.00</span>
            </div>
            <div class="bag-item-row">
              <span class="bag-item-title">Desk Mat (Midnight Navy)</span>
              <span class="bag-item-price">$28.50</span>
            </div>
            <div class="bag-item-row">
              <span class="bag-item-title">Braided USB-C Cable (2m)</span>
              <span class="bag-item-price">$14.00</span>
            </div>

            <div class="bag-total-row">
              <span class="total-label">Total</span>
              <span class="total-val">$74.50</span>
            </div>

            <button class="btn-checkout">Checkout ($74.50)</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

// Also update production figure 01-01-proxy-trap.html
const fig01 = `<div class="component-explorer vce-theme">
  <style>
${BASE_CSS}
    .vce-theme .counter-widget {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 0.8rem 1rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
    }
    .vce-theme .counter-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .vce-theme .counter-number {
      font-size: 2.2rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
    }
    .vce-theme .counter-caption {
      font-size: 0.72rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .vce-theme .counter-btn-row {
      display: flex;
      gap: 0.6rem;
      width: 100%;
      max-width: 260px;
    }
    .vce-theme .btn-stepper {
      flex: 1;
      padding: 0.55rem 0.8rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .vce-theme .btn-dec {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #334155;
    }
    .vce-theme .btn-inc {
      background: #059669;
      border: 1px solid #047857;
      color: #ffffff;
      box-shadow: 0 2px 4px rgba(5, 150, 105, 0.2);
    }
  </style>

  <div class="vce-bar">
    <div class="vce-dots"><i></i><i></i><i></i></div>
    <span class="vce-title">CartCounter.vue — Component Explorer</span>
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
                <span>CartCounter.vue</span>
              </div>
            </li>
            <li>
              <div class="vce-tree-label">
                ${SVG_VUE}
                <span>HeaderNav.vue</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </aside>

    <div class="vce-stage">
      <div class="vce-canvas">
        <div class="vce-node kind-counter">
          <div class="vce-node-label">
            <span>CartCounter.vue</span>
          </div>

          <div class="counter-widget">
            <div class="counter-display">
              <span class="counter-number">0</span>
              <span class="counter-caption">Shopping Bag Items</span>
            </div>
            <div class="counter-btn-row">
              <button class="btn-stepper btn-dec">− Remove</button>
              <button class="btn-stepper btn-inc">+ Add Item</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;

writeFileSync(join(TEMPLATES_DIR, '01-single-control.html'), t01, 'utf8');
writeFileSync(join(TEMPLATES_DIR, '02-list-repeat-3-items.html'), t02, 'utf8');
writeFileSync(join(TEMPLATES_DIR, '03-parent-child-props-emits.html'), t03, 'utf8');
writeFileSync(join(TEMPLATES_DIR, '04-compare-wrong-right.html'), t04, 'utf8');
writeFileSync(join(TEMPLATES_DIR, '05-two-way-binding.html'), t05, 'utf8');
writeFileSync(join(TEMPLATES_DIR, '06-pinia-store-dispatch.html'), t06, 'utf8');
writeFileSync(join(PRODUCTION_DIR, '01-01-proxy-trap.html'), fig01, 'utf8');

console.log('Successfully written archetypical templates 01-06 and production figure with zero meta-descriptions!');
