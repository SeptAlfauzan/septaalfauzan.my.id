# Portfolio Code-Editor Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio SPA as a VS Code–style editor UI (title bar, activity bar, file explorer, tabs, status bar, minimap) with a dark/light GitHub-palette theme, 5 file panels (about.dart / experience.log / projects.json / skills.yaml / contact.md) plus a per-project detail tab backed by the existing MicroCMS module.

**Architecture:** `App.vue` becomes a thin root rendering `EditorWindow.vue`, the editor shell. The shell wraps `<RouterView>` in `.editor-content`; routes map 1:1 to "files". All styling lives in one global stylesheet `src/assets/editor.css` ported verbatim from the mockup (components are structural only, no scoped styles, except the existing projects module components which get token-ified scoped styles). Static content lives in typed `src/data/*.ts` files; projects stay on the existing MicroCMS clean-architecture module unchanged.

**Tech Stack:** Vue 3.5 (`<script setup>` TS), vue-router 5, Pinia 3, Vite 7, Vitest + @vue/test-utils 2, Cypress 15, JetBrains Mono (Google Fonts). No new dependencies.

## Global Constraints

- Code style: Prettier (semi `false`, single quote, printWidth 100). No code comments unless required. ESLint + oxlint must pass.
- TypeScript strict per project tsconfig; use `import type` for type-only imports. Use `@/` alias for all imports.
- Design tokens, spacing, radii, and all CSS MUST come from `src/assets/editor.css` (ported from the mockup). Do not introduce new hex colors or arbitrary values outside editor.css.
- Mockup visual source of truth: `portfolio-redesign.html` (pasted in the session that produced this plan). Port its structure/copy verbatim; do not re-derive values by eye.
- Copy rules: About/skills/contact copy come from the mockup; experience copy comes from the current `ExperiencesView.vue` (all 4 roles); social + résumé URLs come from the current site (real, not `#`).
- Motion is limited to exactly three moments: panel fade (280ms), theme transition (250ms), one-time typewriter (32ms/char). `prefers-reduced-motion: reduce` must disable all of them (global CSS override + instant typewriter text).
- Accessibility: `:focus-visible` 2px `var(--blue)` outline + 2px offset on all interactive elements; traffic lights, status bar, minimap, and tab `×` are decorative (`aria-hidden`); tabs and sidebar files are real buttons; `aria-selected` on tabs.
- No `localStorage`/`sessionStorage`. Theme is in-memory only, dark default.
- Project data module (`src/modules/projects/`) must keep its public interfaces (store state/actions, `Project` model, component props/emits) unchanged so existing unit tests keep passing. Only presentation styling may change.
- All commands run from repo root. Primary package manager: bun (`bun.lock` present).

---

### Task 1: Global editor stylesheet, fonts, entry wiring

**Files:**
- Create: `src/assets/editor.css`
- Delete: `src/assets/main.css`, `src/assets/base.css`
- Modify: `src/main.ts`, `index.html`

**Interfaces:**
- Produces: global CSS classes consumed by every later task: `.window`, `.titlebar`, `.traffic`, `.theme-toggle`, `.body`, `.activitybar`, `.sidebar`, `.tree-folder`, `.tree-file`, `.editor`, `.tabbar`, `.tab`, `.editor-content`, `.panel`, `.code-block`, `.line`, `.tok-*`, `.typed-cursor`, `.split`, `.code-col`, `.preview-card`, `.avatar`, `.btn`, `.pill`, `.pill-row`, `.stat-line`, `.log-list`, `.commit`, `.commit-meta`, `.hash`, `.refs`, `.commit-subject`, `.commit-body`, `.commit-bullets`, `.json-line`, `.grid`, `.card`, `.card-thumb`, `.card-body`, `.card-link`, `.more-note`, `.yaml-block`, `.yaml-key`, `.yaml-dash`, `.yaml-val`, `.yaml-group`, `.contact-preview`, `.contact-row`, `.social-row`, `.minimap`, `.statusbar`, `.lang`, `.ldot`, `.branch`, Vue transition `name="panel"`, focus-visible, reduced-motion, and the `@media` breakpoints (1150/900/720).
- Produces: `index.html` has `<html lang="en" data-theme="dark">` + JetBrains Mono font links.

- [ ] **Step 1: Write `src/assets/editor.css`**

Create `src/assets/editor.css` with the exact content below (this is the mockup `<style>` block, ported; structural `.panel` display toggling is removed since the router swaps panels, and Vue transition classes replace the raw `@keyframes` hookup):

```css
:root, :root[data-theme='dark']{
  --bg-page:#010409;
  --bg-app:#0d1117;
  --bg-panel:#161b22;
  --bg-editor:#0d1117;
  --bg-hover:#1c2128;
  --bg-active:#172033;
  --border:#30363d;
  --border-soft:#21262d;
  --text:#c9d1d9;
  --text-bright:#f0f6fc;
  --text-muted:#8b949e;
  --text-dim:#484f58;
  --purple:#d2a8ff;
  --green:#7ee787;
  --blue:#58a6ff;
  --cyan:#79c0ff;
  --orange:#ffa657;
  --red:#ff7b72;
  --yellow:#e3b341;
  --strblue:#a5d6ff;
  --btn-primary-text:#0c0d14;
  --font: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace;
  --radius:12px;
}

:root[data-theme='light']{
  --bg-page:#eef1f4;
  --bg-app:#f6f8fa;
  --bg-panel:#f6f8fa;
  --bg-editor:#ffffff;
  --bg-hover:#eaeef2;
  --bg-active:#ddf4ff;
  --border:#d0d7de;
  --border-soft:#eaeef2;
  --text:#1f2328;
  --text-bright:#0e1116;
  --text-muted:#59636e;
  --text-dim:#8c959f;
  --purple:#8250df;
  --green:#1a7f37;
  --blue:#0969da;
  --cyan:#0550ae;
  --orange:#953800;
  --red:#cf222e;
  --yellow:#9a6700;
  --strblue:#0a3069;
  --btn-primary-text:#ffffff;
}

*{ box-sizing:border-box; }
html,body{ height:100%; }
body{
  margin:0;
  font-family:var(--font);
  background:var(--bg-page);
  color:var(--text);
  transition:background-color .25s ease, color .25s ease;
  background-image:
    radial-gradient(circle at 15% 0%, rgba(88,166,255,0.08), transparent 40%),
    radial-gradient(circle at 85% 100%, rgba(210,168,255,0.07), transparent 40%),
    radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px);
  background-size: auto, auto, 22px 22px;
  background-position: 0 0, 0 0, 0 0;
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:28px 16px;
}
:root[data-theme='light'] body{
  background-image:
    linear-gradient(rgba(9,105,218,0.10) 1px, transparent 1px),
    linear-gradient(90deg, rgba(9,105,218,0.10) 1px, transparent 1px);
  background-size: 26px 26px, 26px 26px;
  background-position: 0 0, 0 0;
}
::selection{ background:rgba(88,166,255,0.35); color:var(--text-bright); }
a{ color:inherit; }
button{ font-family:inherit; }

a:focus-visible, button:focus-visible, [tabindex]:focus-visible{
  outline:2px solid var(--blue);
  outline-offset:2px;
  border-radius:4px;
}

@media (prefers-reduced-motion: reduce){
  *{ animation-duration:0.001ms !important; transition-duration:0.001ms !important; }
}

.window{
  width:100%;
  max-width:1320px;
  background:var(--bg-editor);
  border:1px solid var(--border);
  border-radius:var(--radius);
  overflow:hidden;
  box-shadow: 0 30px 80px -20px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.02) inset;
  display:flex;
  flex-direction:column;
  transition:background-color .25s ease, border-color .25s ease, box-shadow .25s ease;
}
:root[data-theme='light'] .window{
  box-shadow: 0 30px 70px -28px rgba(31,35,40,0.22), 0 0 0 1px rgba(31,35,40,0.02) inset;
}

.titlebar{
  height:42px;
  flex:0 0 auto;
  background:var(--bg-app);
  border-bottom:1px solid var(--border);
  display:flex;
  align-items:center;
  padding:0 14px;
  gap:14px;
}
.traffic{ display:flex; gap:8px; }
.traffic span{ width:12px; height:12px; border-radius:50%; display:inline-block; }
.traffic .r{ background:#ff5f57; }
.traffic .y{ background:#febc2e; }
.traffic .g{ background:#28c840; }
.titlebar-title{
  flex:1;
  text-align:center;
  font-size:12px;
  color:var(--text-muted);
  letter-spacing:.3px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  padding:0 8px;
}
.titlebar-title b{ color:var(--text); font-weight:600; }
.theme-toggle{
  width:52px;
  height:26px;
  flex:0 0 auto;
  display:flex;
  align-items:center;
  justify-content:center;
  background:var(--bg-panel);
  border:1px solid var(--border);
  border-radius:20px;
  cursor:pointer;
  color:var(--text-muted);
  transition:border-color .15s ease, color .15s ease;
}
.theme-toggle:hover{ color:var(--text-bright); border-color:var(--blue); }
.theme-toggle svg{ width:14px; height:14px; }
.theme-toggle .icon-moon{ display:none; }
:root[data-theme='light'] .theme-toggle .icon-sun{ display:none; }
:root[data-theme='light'] .theme-toggle .icon-moon{ display:block; }

.body{
  display:flex;
  min-height:640px;
  max-height:78vh;
}

.activitybar{
  width:48px;
  flex:0 0 auto;
  background:var(--bg-app);
  border-right:1px solid var(--border);
  display:flex;
  flex-direction:column;
  align-items:center;
  padding:14px 0;
  gap:18px;
}
.activitybar .a-icon{
  width:22px; height:22px;
  display:flex; align-items:center; justify-content:center;
  color:var(--text-muted);
  border-left:2px solid transparent;
  cursor:default;
}
.activitybar .a-icon.active{ color:var(--text-bright); }
.activitybar .a-icon svg{ width:18px; height:18px; }
.activitybar .avatar-mini{
  margin-top:auto;
  width:26px; height:26px;
  border-radius:6px;
  background:linear-gradient(135deg,var(--blue),var(--purple));
  display:flex; align-items:center; justify-content:center;
  font-size:10px; font-weight:700; color:var(--btn-primary-text);
}

.sidebar{
  width:236px;
  flex:0 0 auto;
  background:var(--bg-panel);
  border-right:1px solid var(--border);
  padding:14px 0;
  overflow-y:auto;
}
.sidebar-label{
  font-size:11px;
  letter-spacing:1.5px;
  color:var(--text-muted);
  padding:0 16px 10px;
}
.tree-folder{
  font-size:12.5px;
  color:var(--text-muted);
  padding:4px 12px;
  display:flex;
  align-items:center;
  gap:6px;
  letter-spacing:.3px;
}
.tree-folder .chev{ font-size:10px; }
.tree-files{ padding-left:8px; margin-top:2px; }
.tree-file{
  display:flex;
  align-items:center;
  gap:9px;
  padding:6px 12px 6px 26px;
  font-size:13px;
  color:var(--text-muted);
  cursor:pointer;
  border-left:2px solid transparent;
  background:none;
  width:100%;
  text-align:left;
}
.tree-file:hover{ background:var(--bg-hover); color:var(--text); }
.tree-file.active{
  background:var(--bg-active);
  color:var(--text-bright);
  border-left-color:var(--blue);
}
.tree-file .dot{ width:8px; height:8px; border-radius:2px; flex:0 0 auto; }

.sidebar-note{
  margin-top:22px;
  padding:12px 16px;
  font-size:11.5px;
  color:var(--text-dim);
  line-height:1.6;
}

.editor{
  flex:1 1 auto;
  display:flex;
  flex-direction:column;
  min-width:0;
}
.tabbar{
  display:flex;
  background:var(--bg-panel);
  border-bottom:1px solid var(--border);
  overflow-x:auto;
  flex:0 0 auto;
  scrollbar-width:none;
}
.tabbar::-webkit-scrollbar{ display:none; }
.tab{
  display:flex;
  align-items:center;
  gap:8px;
  padding:10px 16px;
  font-size:12.5px;
  color:var(--text-muted);
  background:none;
  border:none;
  border-right:1px solid var(--border);
  cursor:pointer;
  white-space:nowrap;
}
.tab:hover{ color:var(--text); background:var(--bg-hover); }
.tab.active{
  color:var(--text-bright);
  background:var(--bg-editor);
  box-shadow: inset 0 -2px 0 var(--blue);
}
.tab .dot{ width:7px; height:7px; border-radius:2px; }
.tab .x{ opacity:.45; margin-left:2px; font-size:11px; }

.editor-content{
  flex:1 1 auto;
  overflow-y:auto;
  background:var(--bg-editor);
  position:relative;
}
.editor-content::-webkit-scrollbar{ width:10px; }
.editor-content::-webkit-scrollbar-thumb{ background:var(--border); border-radius:6px; }
.editor-content::-webkit-scrollbar-thumb:hover{ background:var(--text-dim); }

.panel{ padding:26px 30px 40px; }
.panel-enter-active{ animation:fadeIn .28s ease; }
.panel-leave-active{ animation:fadeIn .28s ease reverse; }
@keyframes fadeIn{ from{ opacity:0; transform:translateY(4px);} to{ opacity:1; transform:translateY(0);} }

.code-block{ counter-reset:line; font-size:13px; line-height:1.85; }
.code-block .line{
  display:flex;
  white-space:pre-wrap;
  word-break:break-word;
}
.code-block .line::before{
  counter-increment:line;
  content: counter(line);
  display:inline-block;
  width:34px;
  flex:0 0 auto;
  text-align:right;
  margin-right:18px;
  color:var(--text-dim);
  user-select:none;
}
.code{ color:var(--text); }
.tok-kw{ color:var(--purple); }
.tok-type{ color:var(--cyan); }
.tok-str{ color:var(--strblue); }
.tok-com{ color:var(--text-muted); font-style:italic; }
.tok-fn{ color:var(--blue); }
.tok-num{ color:var(--orange); }
.tok-prop{ color:var(--cyan); }
.tok-punc{ color:var(--text-muted); }
.tok-bright{ color:var(--text-bright); font-weight:600; }

.typed-cursor{
  display:inline-block;
  width:7px; height:14px;
  background:var(--blue);
  margin-left:2px;
  vertical-align:middle;
  animation:blink 1s step-end infinite;
}
@keyframes blink{ 50%{ opacity:0; } }

.split{ display:flex; gap:34px; align-items:flex-start; }
.split .code-col{ flex:1 1 auto; min-width:0; }
.preview-card{
  width:250px;
  flex:0 0 auto;
  background:var(--bg-panel);
  border:1px solid var(--border);
  border-radius:10px;
  padding:20px;
}
.avatar{
  width:64px; height:64px;
  border-radius:10px;
  background:linear-gradient(135deg,var(--blue),var(--purple));
  display:flex; align-items:center; justify-content:center;
  font-size:22px; font-weight:700; color:var(--btn-primary-text);
  margin-bottom:14px;
}
.preview-card h3{ margin:0 0 2px; font-size:15px; color:var(--text-bright); }
.preview-card .role{ font-size:12px; color:var(--text-muted); margin-bottom:16px; }
.btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  width:100%;
  padding:10px 14px;
  border-radius:7px;
  border:1px solid var(--border);
  background:var(--bg-active);
  color:var(--text-bright);
  font-size:12.5px;
  font-weight:600;
  text-decoration:none;
  cursor:pointer;
  transition:transform .15s ease, border-color .15s ease, background .15s ease;
}
.btn:hover{ transform:translateY(-1px); border-color:var(--blue); background:var(--bg-hover); }
.btn.primary{ background:var(--blue); color:var(--btn-primary-text); border-color:var(--blue); }
.btn.primary:hover{ filter:brightness(1.08); }
.pill-row{ display:flex; flex-wrap:wrap; gap:6px; margin-top:16px; }
.pill{
  font-size:10.5px;
  padding:4px 8px;
  border-radius:5px;
  background:var(--bg-editor);
  border:1px solid var(--border-soft);
  color:var(--text-muted);
}
.stat-line{
  margin-top:16px;
  padding-top:14px;
  border-top:1px solid var(--border-soft);
  font-size:11px;
  color:var(--text-dim);
  line-height:1.9;
}
.stat-line b{ color:var(--text); font-weight:600; }

.log-list{ position:relative; padding-left:20px; }
.log-list::before{
  content:"";
  position:absolute;
  left:5px; top:6px; bottom:6px;
  width:1px;
  background:var(--border);
}
.commit{ position:relative; margin-bottom:34px; }
.commit:last-child{ margin-bottom:0; }
.commit::before{
  content:"";
  position:absolute;
  left:-20px; top:4px;
  width:11px; height:11px;
  border-radius:50%;
  background:var(--bg-editor);
  border:2px solid var(--blue);
}
.commit-meta{ font-size:12px; margin-bottom:10px; }
.commit-meta .hash{ color:var(--orange); }
.commit-meta .refs{ color:var(--purple); margin-left:6px; }
.commit-meta .line2{ color:var(--text-muted); margin-top:3px; }
.commit-subject{
  font-size:14.5px;
  font-weight:700;
  color:var(--text-bright);
  margin:2px 0 10px;
}
.commit-body{ font-size:13px; color:var(--text); line-height:1.7; margin-bottom:10px; }
.commit-bullets{ list-style:none; margin:0; padding:0; }
.commit-bullets li{
  position:relative;
  padding-left:18px;
  font-size:13px;
  color:var(--text);
  line-height:1.75;
}
.commit-bullets li::before{
  content:"–";
  position:absolute; left:0; color:var(--cyan);
}

.json-line{ font-size:13px; color:var(--text-muted); margin-bottom:18px; }
.json-line .k{ color:var(--cyan); }
.grid{ display:grid; grid-template-columns:repeat(2,1fr); gap:18px; }
.card{
  border:1px solid var(--border);
  border-radius:10px;
  background:var(--bg-panel);
  overflow:hidden;
  transition:transform .18s ease, border-color .18s ease, box-shadow .18s ease;
  cursor:pointer;
}
.card:hover{ transform:translateY(-3px); border-color:var(--blue); box-shadow:0 14px 30px -14px rgba(122,162,247,0.35); }
.card-thumb{
  height:92px;
  width:100%;
  object-fit:cover;
  display:flex; align-items:center; justify-content:center;
}
.card-thumb--placeholder{
  background:linear-gradient(135deg,#1c2540,#26314f);
  color:var(--text-muted);
  font-weight:700;
  font-size:14px;
}
.card-thumb svg{ width:30px; height:30px; }
.card-body{ padding:16px 18px 18px; }
.card-body h4{ margin:0 0 6px; font-size:14.5px; color:var(--text-bright); }
.card-body p{ margin:0 0 12px; font-size:12.5px; color:var(--text); line-height:1.6; }
.card-link{
  font-size:12px;
  color:var(--blue);
  text-decoration:none;
  display:inline-flex;
  align-items:center;
  gap:5px;
  background:none;
  border:none;
  padding:0;
  cursor:pointer;
}
.card-link:hover{ text-decoration:underline; }
.more-note{
  margin-top:18px;
  font-size:12px;
  color:var(--text-dim);
}
.more-note code{ color:var(--text-muted); }

.yaml-block{ font-size:13px; line-height:1.9; }
.yaml-key{ color:var(--cyan); }
.yaml-dash{ color:var(--text-dim); }
.yaml-val{ color:var(--green); }
.yaml-group{ margin-bottom:20px; }

.contact-preview{
  width:280px;
}
.contact-preview h3{ margin:0 0 6px; font-size:16px; color:var(--text-bright); }
.contact-preview p{ margin:0 0 18px; font-size:12.5px; color:var(--text-muted); line-height:1.7; }
.contact-row{ display:flex; justify-content:space-between; font-size:12.5px; padding:9px 0; border-top:1px solid var(--border-soft); }
.contact-row:first-of-type{ border-top:none; }
.contact-row span:first-child{ color:var(--text-muted); }
.contact-row a{ color:var(--blue); text-decoration:none; }
.contact-row a:hover{ text-decoration:underline; }
.social-row{ display:flex; gap:8px; margin-top:16px; }
.social-row a{
  flex:1;
  text-align:center;
  font-size:12px;
  padding:9px 0;
  border:1px solid var(--border);
  border-radius:7px;
  color:var(--text);
  text-decoration:none;
}
.social-row a:hover{ border-color:var(--blue); color:var(--text-bright); }

.minimap{
  width:56px;
  flex:0 0 auto;
  background:var(--bg-panel);
  border-left:1px solid var(--border);
  padding:16px 10px;
  display:flex;
  flex-direction:column;
  gap:5px;
}
.minimap span{ height:3px; border-radius:2px; background:var(--border); }

.statusbar{
  height:26px;
  flex:0 0 auto;
  background:var(--bg-app);
  border-top:1px solid var(--border);
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 14px;
  font-size:11px;
  color:var(--text-muted);
}
.statusbar .left, .statusbar .right{ display:flex; align-items:center; gap:16px; }
.statusbar .branch{ color:var(--green); }
.statusbar .lang{ display:flex; align-items:center; gap:6px; }
.statusbar .lang .ldot{ width:8px; height:8px; border-radius:50%; }

.detail-title{ font-size:16px; color:var(--text-bright); margin:0 0 4px; }
.detail-meta{ font-size:12px; color:var(--text-muted); margin-bottom:16px; }
.detail-desc{ font-size:13px; color:var(--text); line-height:1.7; margin:14px 0; }

@media (max-width:1150px){ .minimap{ display:none; } }
@media (max-width:900px){
  .activitybar, .sidebar{ display:none; }
  .body{ max-height:none; min-height:560px; }
}
@media (max-width:720px){
  .split{ flex-direction:column; }
  .preview-card{ width:100%; }
  .grid{ grid-template-columns:1fr; }
  .panel{ padding:20px 16px 34px; }
  .titlebar-title{ font-size:10.5px; }
  .code-block{ font-size:12px; }
  .code-block .line::before{ width:22px; margin-right:10px; }
}
```

- [ ] **Step 2: Update `index.html`**

Rewrite `index.html` to:

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
  <head>
    <meta charset="UTF-8">
    <link rel="icon" href="/favicon.ico">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Septa Alfauzan — portfolio.dev</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 3: Update `src/main.ts`**

Replace the contents of `src/main.ts` with:

```ts
import './assets/editor.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
```

- [ ] **Step 4: Delete old stylesheets and verify build**

Run:
```bash
rm src/assets/main.css src/assets/base.css
bun run type-check && bun run build-only
```
Expected: type-check and build pass. Build output contains no reference to `terminal.css`.

- [ ] **Step 5: Commit**

```bash
git add src/assets/editor.css src/main.ts index.html
git rm src/assets/main.css src/assets/base.css
git commit -m "feat: port code-editor global stylesheet and entry wiring"
```

---

### Task 2: Code token types + static data files

**Files:**
- Create: `src/types/code.ts`, `src/data/profile.ts`, `src/data/experience.ts`, `src/data/skills.ts`, `src/data/contact.ts`
- Test: `src/types/code.spec.ts`, `src/data/profile.spec.ts`, `src/data/experience.spec.ts`, `src/data/skills.spec.ts`, `src/data/contact.spec.ts`

**Interfaces:**
- Produces: `CodeToken { cls: string; text: string }`, `CodeLine { tokens: CodeToken[] }`, token helpers `plain/kw/typ/str/com/fn/num/prop/punc/bright(text)`, `line(...tokens)`, `blank()`.
- Produces: `profile: Profile` (`{ name, role, location, tagline, resumeUrl, stack: string[], stats: {before,bold,after}[] }`) and `aboutCodeLines(comment: string): CodeLine[]`.
- Produces: `experiences: Experience[]` (`{ hash, refs?, author, dateRange, subject, body, bullets: string[] }`).
- Produces: `skillGroups: SkillGroup[]` (`{ key, items: string[] }`).
- Produces: `contact: Contact` (`{ email, phone, phoneHref, socials: {label,url}[] }`) and `contactMdLines(): CodeLine[]`.

- [ ] **Step 1: Write the failing tests**

Create `src/types/code.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { line, blank, plain, kw, com } from './code'

describe('code line helpers', () => {
  it('builds a line from tokens', () => {
    expect(line(kw('class'), plain(' '), com('// x'))).toEqual({
      tokens: [
        { cls: 'tok-kw', text: 'class' },
        { cls: 'code', text: ' ' },
        { cls: 'tok-com', text: '// x' },
      ],
    })
  })

  it('builds a blank line', () => {
    expect(blank()).toEqual({ tokens: [] })
  })
})
```

Create `src/data/profile.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { profile, aboutCodeLines } from './profile'

describe('profile', () => {
  it('has real identity and resume url', () => {
    expect(profile.name).toBe('Septa Alfauzan')
    expect(profile.resumeUrl).toContain('drive.google.com')
  })

  it('builds about.dart lines with the typed comment first', () => {
    const lines = aboutCodeLines('// Hello, I\'m Septa Alfauzan 👋')
    expect(lines[0].tokens[0]).toEqual({ cls: 'tok-com', text: '// Hello, I\'m Septa Alfauzan 👋' })
    expect(lines.length).toBeGreaterThan(20)
  })
})
```

Create `src/data/experience.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { experiences } from './experience'

describe('experience', () => {
  it('contains all four roles', () => {
    expect(experiences).toHaveLength(4)
    expect(experiences.map((e) => e.subject)).toEqual(
      expect.arrayContaining([
        'Mobile Developer @ Delta HQ',
        'Mobile Developer @ Tensai Innovation',
        'Mobile Developer Mentor @ Bangkit Academy (by Google)',
        'Android Developer Intern @ Algostudio',
      ]),
    )
  })

  it('marks the first commit as HEAD', () => {
    expect(experiences[0]?.refs).toContain('HEAD')
  })
})
```

Create `src/data/skills.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { skillGroups } from './skills'

describe('skills', () => {
  it('has the four yaml groups and no web-development duplicate', () => {
    expect(skillGroups.map((g) => g.key)).toEqual([
      'mobile_development',
      'architecture',
      'backend_integration',
      'tools',
    ])
  })

  it('lists Flutter under mobile development', () => {
    const mobile = skillGroups.find((g) => g.key === 'mobile_development')
    expect(mobile?.items).toContain('Flutter')
  })
})
```

Create `src/data/contact.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { contact, contactMdLines } from './contact'

describe('contact', () => {
  it('has real email, phone, and social urls', () => {
    expect(contact.email).toBe('alfauzansepta@gmail.com')
    expect(contact.socials.map((s) => s.label)).toEqual(['LinkedIn', 'GitHub', 'Medium'])
    expect(contact.socials.every((s) => s.url !== '#')).toBe(true)
  })

  it('renders markdown source lines including social links', () => {
    const lines = contactMdLines()
    const joined = lines.map((l) => l.tokens.map((t) => t.text).join('')).join('\n')
    expect(joined).toContain('**Email:** alfauzansepta@gmail.com')
    expect(joined).toContain('[LinkedIn]')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bun run test:unit --run src/types/code.spec.ts src/data/profile.spec.ts src/data/experience.spec.ts src/data/skills.spec.ts src/data/contact.spec.ts`

Expected: FAIL — modules not found (`Cannot find module './code'` etc.). Note: if `bun run test:unit` doesn't accept trailing file args, run `bunx vitest run src/types/code.spec.ts src/data/profile.spec.ts src/data/experience.spec.ts src/data/skills.spec.ts src/data/contact.spec.ts` instead.

- [ ] **Step 3: Write `src/types/code.ts`**

```ts
export interface CodeToken {
  cls: string
  text: string
}

export interface CodeLine {
  tokens: CodeToken[]
}

function tok(cls: string, text: string): CodeToken {
  return { cls, text }
}

export const plain = (text: string): CodeToken => tok('code', text)
export const kw = (text: string): CodeToken => tok('tok-kw', text)
export const typ = (text: string): CodeToken => tok('tok-type', text)
export const str = (text: string): CodeToken => tok('tok-str', text)
export const com = (text: string): CodeToken => tok('tok-com', text)
export const fn = (text: string): CodeToken => tok('tok-fn', text)
export const num = (text: string): CodeToken => tok('tok-num', text)
export const prop = (text: string): CodeToken => tok('tok-prop', text)
export const punc = (text: string): CodeToken => tok('tok-punc', text)
export const bright = (text: string): CodeToken => tok('tok-bright', text)

export function line(...tokens: CodeToken[]): CodeLine {
  return { tokens }
}

export function blank(): CodeLine {
  return { tokens: [] }
}
```

- [ ] **Step 4: Write `src/data/profile.ts`**

```ts
import type { CodeLine } from '@/types/code'
import { line, blank, kw, typ, str, num, com, fn, plain } from '@/types/code'

export interface ProfileStat {
  before: string
  bold: string
  after: string
}

export interface Profile {
  name: string
  role: string
  location: string
  tagline: string
  resumeUrl: string
  stack: string[]
  stats: ProfileStat[]
}

export const profile: Profile = {
  name: 'Septa Alfauzan',
  role: 'Software Engineer, Mobile',
  location: 'Surabaya, Indonesia',
  tagline: 'Mobile Engineer · Flutter & Native',
  resumeUrl:
    'https://drive.google.com/file/d/1Ubv2crCzDHV0yKea2qPwq3jtaPdim1vm/view?usp=sharing',
  stack: ['Flutter', 'Kotlin', 'SwiftUI', 'Compose'],
  stats: [
    { before: '', bold: '2+ yrs', after: ' production mobile dev' },
    { before: 'Shipping to ', bold: 'Play Store & App Store', after: '' },
    { before: 'Clients across ', bold: 'ID & Japan', after: '' },
  ],
}

const BIO_LINES = [
  "I'm a mobile developer focused on building",
  'scalable, production-grade apps using Flutter',
  "and Android. I don't just write code — I handle",
  'the full lifecycle: requirements, integration,',
  'deployment, and post-release stability.',
]

const FOCUS = [
  'Migrating & scaling apps used by 1000s of users',
  'Shipping apps from scratch to Play & App Store',
  'Integrating backend, IoT & realtime pipelines',
]

export function aboutCodeLines(comment: string): CodeLine[] {
  return [
    line(com(comment)),
    blank(),
    line(kw('import'), plain(' '), str("'package:portfolio/core.dart'"), plain(';')),
    blank(),
    line(com('/// Mobile Engineer · Surabaya, Indonesia')),
    line(kw('class'), plain(' '), typ('Septa'), plain(' '), kw('extends'), plain(' '), typ('Developer'), plain(' {')),
    line(plain('  '), kw('final'), plain(' '), typ('String'), plain(' name = '), str("'Septa Alfauzan'"), plain(';')),
    line(plain('  '), kw('final'), plain(' '), typ('String'), plain(' role = '), str("'Software Engineer, Mobile'"), plain(';')),
    line(plain('  '), kw('final'), plain(' '), typ('int'), plain(' experienceYears = '), num('2'), plain(';')),
    blank(),
    line(plain('  '), kw('final'), plain(' '), typ('List'), plain('<'), typ('String'), plain('> stack = [')),
    line(plain('    '), str("'Flutter'"), plain(', '), str("'Kotlin'"), plain(', '), str("'Swift'"), plain(', '), str("'Jetpack Compose'"), plain(',')),
    line(plain('  '), plain('];')),
    blank(),
    line(plain('  '), com('/// With 2+ years in mobile development, I build')),
    line(plain('  '), com('/// production-ready apps used by real users — from')),
    line(plain('  '), com('/// SIM management platforms to IoT systems and')),
    line(plain('  '), com('/// enterprise tools. Currently shipping to Play')),
    line(plain('  '), com('/// Store & App Store for international clients.')),
    line(plain('  '), typ('String'), plain(' '), kw('get'), plain(' '), fn('bio'), plain(' => '), str("'''")),
    ...BIO_LINES.map((b) => line(plain('    '), plain(b))),
    line(plain('  '), str("''';")),
    blank(),
    line(plain('  '), typ('List'), plain('<'), typ('String'), plain('> '), fn('focus'), plain('() => [')),
    ...FOCUS.map((f) => line(plain('    '), str(`'${f}'`), plain(','))),
    line(plain('  '), plain('];')),
    line(plain('}')),
  ]
}
```

- [ ] **Step 5: Write `src/data/experience.ts`**

```ts
export interface Experience {
  hash: string
  refs?: string
  author: string
  dateRange: string
  subject: string
  body: string
  bullets: string[]
}

export const experiences: Experience[] = [
  {
    hash: '9f3a1c2',
    refs: '(HEAD -> main, origin/main)',
    author: 'Septa Alfauzan',
    dateRange: 'Feb 2025 — Present',
    subject: 'Mobile Developer @ Delta HQ',
    body: 'Leading development of production mobile applications used by thousands of users across international markets.',
    bullets: [
      'Migrated & revamped JP SMART SIM app using Flutter → resulted in 7,000+ new device acquisitions',
      'Built DeltaHQ PMS mobile app from scratch, handling full lifecycle (requirement → CI/CD → store release)',
      'Integrated Micro CMS enabling non-technical teams to manage in-app promotional content',
      'Collaborated directly with Japanese enterprise clients to translate business needs into scalable solutions',
      'Stabilized legacy apps by reducing crashes and improving reliability',
    ],
  },
  {
    hash: '6b7d4e1',
    author: 'Septa Alfauzan',
    dateRange: 'Oct 2023 — Jan 2025',
    subject: 'Mobile Developer @ Tensai Innovation',
    body: 'Worked on diverse real-world systems including IoT, AI, and hardware integrations.',
    bullets: [
      'Developed IoT smart greenhouse app for Bank Indonesia (real-time monitoring)',
      'Built NFC-based applications and Bluetooth-controlled robot systems',
      'Implemented AI-integrated learning platform using Gemini API',
      'Improved WebSocket reliability → reduced latency and connection drops',
      'Applied MVVM and BLoC/Cubit architecture across projects',
    ],
  },
  {
    hash: '2a1f8c0',
    author: 'Septa Alfauzan',
    dateRange: 'Feb 2024 — Jul 2024',
    subject: 'Mobile Developer Mentor @ Bangkit Academy (by Google)',
    body: 'Mentored and guided Android development students at scale.',
    bullets: [
      'Led 23 students with 4.81/5 mentorship rating',
      'Teaching Assistant for 14 instructor-led sessions (4.95/5 rating)',
      'Helped increase graduation rate to 93%',
    ],
  },
  {
    hash: '4e0b2a9',
    author: 'Septa Alfauzan',
    dateRange: 'Aug 2023 — Sep 2023',
    subject: 'Android Developer Intern @ Algostudio',
    body: 'Early-stage experience building and managing mobile projects.',
    bullets: [
      'Developed employee attendance application',
      'Designed user-friendly UI based on user requirements',
      'Led intern team using Agile methodology and Jira',
    ],
  },
]
```

- [ ] **Step 6: Write `src/data/skills.ts`**

```ts
export interface SkillGroup {
  key: string
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  { key: 'mobile_development', items: ['Flutter', 'Android (Jetpack Compose, SDK)'] },
  { key: 'architecture', items: ['MVVM', 'Clean Architecture', 'BLoC / Cubit'] },
  { key: 'backend_integration', items: ['REST API', 'WebSocket', 'Firebase, Micro CMS'] },
  {
    key: 'tools',
    items: ['Git', 'Jira', 'CI/CD', 'TestFlight', 'Firebase App Distribution'],
  },
]
```

- [ ] **Step 7: Write `src/data/contact.ts`**

```ts
import type { CodeLine } from '@/types/code'
import { line, blank, plain, fn, bright, punc } from '@/types/code'

export interface SocialLink {
  label: string
  url: string
}

export interface Contact {
  email: string
  phone: string
  phoneHref: string
  socials: SocialLink[]
}

export const contact: Contact = {
  email: 'alfauzansepta@gmail.com',
  phone: '+62 821-323-514-998',
  phoneHref: 'tel:+6282132351498',
  socials: [
    { label: 'LinkedIn', url: 'http://linkedin.com/in/septa-alfauzan-a11a891b0/' },
    { label: 'GitHub', url: 'http://github.com/septAlfauzan/' },
    { label: 'Medium', url: 'https://medium.com/@alfauzansepta' },
  ],
}

export function contactMdLines(): CodeLine[] {
  return [
    line(bright("# Let's work together")),
    blank(),
    line(plain('Open to mobile engineering roles, freelance')),
    line(plain('builds, and interesting collaborations.')),
    blank(),
    line(bright('**Email:**'), plain(' '), fn(contact.email)),
    line(bright('**Phone:**'), plain(' '), fn(contact.phone)),
    blank(),
    line(punc('---')),
    ...contact.socials.map((s) => line(punc('-'), plain(' ['), fn(s.label), plain(`](${s.url})`))),
  ]
}
```

- [ ] **Step 8: Run all five specs to verify they pass**

Run: `bunx vitest run src/types/code.spec.ts src/data/profile.spec.ts src/data/experience.spec.ts src/data/skills.spec.ts src/data/contact.spec.ts`

Expected: 5 files PASS.

- [ ] **Step 9: Commit**

```bash
git add src/types/code.ts src/data/profile.ts src/data/experience.ts src/data/skills.ts src/data/contact.ts src/types/code.spec.ts src/data/profile.spec.ts src/data/experience.spec.ts src/data/skills.spec.ts src/data/contact.spec.ts
git commit -m "feat: add code token helpers and static portfolio data"
```

---

### Task 3: `useTheme` composable

**Files:**
- Create: `src/composables/useTheme.ts`
- Test: `src/composables/useTheme.spec.ts`

**Interfaces:**
- Produces: `useTheme(): { isDark: Ref<boolean>, toggle: () => void }`. `toggle()` flips `isDark` and writes `document.documentElement.dataset.theme` to `'dark' | 'light'`. Initial value read from the existing `data-theme` attribute.
- Consumes: `document.documentElement.dataset.theme` (set by `index.html`).

- [ ] **Step 1: Write the failing test**

Create `src/composables/useTheme.spec.ts`:

```ts
import { beforeEach, describe, it, expect } from 'vitest'
import { useTheme } from './useTheme'

beforeEach(() => {
  document.documentElement.dataset.theme = 'dark'
})

describe('useTheme', () => {
  it('starts dark by default', () => {
    const { isDark } = useTheme()
    expect(isDark.value).toBe(true)
  })

  it('toggles to light and back', () => {
    const { isDark, toggle } = useTheme()

    toggle()
    expect(isDark.value).toBe(false)
    expect(document.documentElement.dataset.theme).toBe('light')

    toggle()
    expect(isDark.value).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bunx vitest run src/composables/useTheme.spec.ts`
Expected: FAIL — `Cannot find module './useTheme'`.

- [ ] **Step 3: Write `src/composables/useTheme.ts`**

```ts
import { ref } from 'vue'

const isDark = ref(document.documentElement.dataset.theme !== 'light')

function apply() {
  document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light'
}

function toggle() {
  isDark.value = !isDark.value
  apply()
}

export function useTheme() {
  return { isDark, toggle }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bunx vitest run src/composables/useTheme.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/composables/useTheme.ts src/composables/useTheme.spec.ts
git commit -m "feat: add useTheme composable"
```

---

### Task 4: `useEditorTabs` composable

**Files:**
- Create: `src/composables/useEditorTabs.ts`
- Test: `src/composables/useEditorTabs.spec.ts`

**Interfaces:**
- Produces:
  - `FileMeta { route: string; file: string; dot: string; lang: string; pos: string }`
  - `FILES: FileMeta[]` — 5 entries: `/about` `about.dart` `var(--blue)` `Dart` `Ln 33, Col 2`; `/experiences` `experience.log` `var(--text-muted)` `Log` `Ln 42, Col 1`; `/projects` `projects.json` `var(--yellow)` `JSON` `Ln 4, Col 1`; `/skills` `skills.yaml` `var(--purple)` `YAML` `Ln 19, Col 1`; `/contacts` `contact.md` `var(--blue)` `Markdown` `Ln 11, Col 1`.
  - `slugify(name: string): string`
  - `detailFileMeta(projectName: string | null): FileMeta` — `{ route: '/projects/:id', file: '<slug>.md' | 'project.md', dot: 'var(--cyan)', lang: 'Markdown', pos: 'Ln 12, Col 1' }`
  - `activeFileMeta(routePath: string, projectName: string | null): FileMeta` — detail meta when route starts with `/projects/` but isn't exactly `/projects`; otherwise matching FILES entry (fallback `FILES[0]`).

- [ ] **Step 1: Write the failing test**

Create `src/composables/useEditorTabs.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { FILES, slugify, activeFileMeta, detailFileMeta } from './useEditorTabs'

describe('useEditorTabs', () => {
  it('defines the five fixed files', () => {
    expect(FILES.map((f) => f.file)).toEqual([
      'about.dart',
      'experience.log',
      'projects.json',
      'skills.yaml',
      'contact.md',
    ])
  })

  it('slugifies project names to file slugs', () => {
    expect(slugify('HRIS Mobile Platform')).toBe('hris-mobile-platform')
    expect(slugify('  Smart  Greenhouse IoT ')).toBe('smart-greenhouse-iot')
  })

  it('maps plain routes to their file meta', () => {
    expect(activeFileMeta('/about', null).file).toBe('about.dart')
    expect(activeFileMeta('/projects', null).file).toBe('projects.json')
  })

  it('maps detail routes to a project file meta', () => {
    const meta = activeFileMeta('/projects/proj_hris', 'HRIS Mobile')
    expect(meta.file).toBe('hris-mobile.md')
    expect(meta.lang).toBe('Markdown')
    expect(meta.dot).toBe('var(--cyan)')
  })

  it('falls back to a generic project file before data loads', () => {
    expect(detailFileMeta(null).file).toBe('project.md')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bunx vitest run src/composables/useEditorTabs.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/composables/useEditorTabs.ts`**

```ts
export interface FileMeta {
  route: string
  file: string
  dot: string
  lang: string
  pos: string
}

export const FILES: FileMeta[] = [
  { route: '/about', file: 'about.dart', dot: 'var(--blue)', lang: 'Dart', pos: 'Ln 33, Col 2' },
  { route: '/experiences', file: 'experience.log', dot: 'var(--text-muted)', lang: 'Log', pos: 'Ln 42, Col 1' },
  { route: '/projects', file: 'projects.json', dot: 'var(--yellow)', lang: 'JSON', pos: 'Ln 4, Col 1' },
  { route: '/skills', file: 'skills.yaml', dot: 'var(--purple)', lang: 'YAML', pos: 'Ln 19, Col 1' },
  { route: '/contacts', file: 'contact.md', dot: 'var(--blue)', lang: 'Markdown', pos: 'Ln 11, Col 1' },
]

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function detailFileMeta(projectName: string | null): FileMeta {
  return {
    route: '/projects/:id',
    file: `${projectName ? slugify(projectName) : 'project'}.md`,
    dot: 'var(--cyan)',
    lang: 'Markdown',
    pos: 'Ln 12, Col 1',
  }
}

export function activeFileMeta(routePath: string, projectName: string | null): FileMeta {
  if (routePath.startsWith('/projects/') && routePath !== '/projects') {
    return detailFileMeta(projectName)
  }
  return FILES.find((f) => routePath.startsWith(f.route)) ?? FILES[0]
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bunx vitest run src/composables/useEditorTabs.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/composables/useEditorTabs.ts src/composables/useEditorTabs.spec.ts
git commit -m "feat: add useEditorTabs file/status mapping"
```

---

### Task 5: `useTypewriter` composable

**Files:**
- Create: `src/composables/useTypewriter.ts`
- Test: `src/composables/useTypewriter.spec.ts`

**Interfaces:**
- Produces: `useTypewriter(fullText: string, opts?: { speedMs?: number }): { text: Ref<string>, done: Ref<boolean> }`. Types the string progressively at `speedMs` intervals (default 32). If `prefers-reduced-motion: reduce` matches, `text` is set to `fullText` immediately and `done` is `true`. Clears the interval on unmount.
- Consumes: `window.matchMedia` — must guard for environments without `matchMedia` (jsdom).

- [ ] **Step 1: Write the failing test**

Create `src/composables/useTypewriter.spec.ts`:

```ts
import { afterEach, describe, it, expect, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useTypewriter } from './useTypewriter'

function makeHarness() {
  return defineComponent({
    setup() {
      const { text, done } = useTypewriter('hello', { speedMs: 10 })
      return { text, done }
    },
    template: `<div><span class="t">{{ text }}</span><span class="d">{{ done }}</span></div>`,
  })
}

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('useTypewriter', () => {
  it('types text progressively then completes', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }))
    const wrapper = mount(makeHarness())

    vi.advanceTimersByTime(30)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.t').text()).toBe('hel')

    vi.advanceTimersByTime(30)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.t').text()).toBe('hello')
    expect(wrapper.find('.d').text()).toBe('true')
  })

  it('renders full text instantly under reduced motion', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} }))
    const wrapper = mount(makeHarness())

    expect(wrapper.find('.t').text()).toBe('hello')
    expect(wrapper.find('.d').text()).toBe('true')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bunx vitest run src/composables/useTypewriter.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/composables/useTypewriter.ts`**

```ts
import { onUnmounted, ref } from 'vue'

export function useTypewriter(fullText: string, opts: { speedMs?: number } = {}) {
  const speedMs = opts.speedMs ?? 32
  const text = ref('')
  const done = ref(false)

  const reduceMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let timer: ReturnType<typeof setInterval> | null = null

  if (reduceMotion) {
    text.value = fullText
    done.value = true
  } else {
    let i = 0
    timer = setInterval(() => {
      i++
      text.value = fullText.slice(0, i)
      if (i >= fullText.length) {
        done.value = true
        if (timer) clearInterval(timer)
      }
    }, speedMs)
  }

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  return { text, done }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bunx vitest run src/composables/useTypewriter.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/composables/useTypewriter.ts src/composables/useTypewriter.spec.ts
git commit -m "feat: add reduced-motion-aware useTypewriter composable"
```

---

### Task 6: `CodeBlock` shared component

**Files:**
- Create: `src/components/shared/CodeBlock.vue`
- Test: `src/components/shared/CodeBlock.spec.ts`

**Interfaces:**
- Consumes: `CodeLine[]` from `@/types/code`, optional `cursor?: boolean`.
- Produces: renders `<div class="code-block">` with one `<div class="line">` per line; each token a `<span :class="cls">`; when `cursor` is true, appends a `<span class="typed-cursor">` after the first line's tokens. Line numbers come from the CSS `counter` in editor.css — no JS gutter needed.

- [ ] **Step 1: Write the failing test**

Create `src/components/shared/CodeBlock.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CodeBlock from './CodeBlock.vue'
import { line, plain, kw, com } from '@/types/code'

describe('CodeBlock', () => {
  const lines = [
    line(com('// hello')),
    line(kw('class'), plain(' '), plain('A')),
  ]

  it('renders each line and token with the right classes', () => {
    const wrapper = mount(CodeBlock, { props: { lines } })
    const rows = wrapper.findAll('.line')
    expect(rows).toHaveLength(2)
    expect(rows[0]!.find('span').classes()).toContain('tok-com')
    expect(rows[1]!.findAll('span')[0]!.classes()).toContain('tok-kw')
    expect(rows[1]!.findAll('span')[1]!.text()).toBe(' ')
  })

  it('shows a typed cursor after the first line when requested', () => {
    const wrapper = mount(CodeBlock, { props: { lines, cursor: true } })
    expect(wrapper.findAll('.typed-cursor')).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bunx vitest run src/components/shared/CodeBlock.spec.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Write `src/components/shared/CodeBlock.vue`**

```vue
<script setup lang="ts">
import type { CodeLine } from '@/types/code'

defineProps<{
  lines: CodeLine[]
  cursor?: boolean
}>()
</script>

<template>
  <div class="code-block">
    <div v-for="(l, i) in lines" :key="i" class="line">
      <template v-for="(t, j) in l.tokens" :key="j">
        <span :class="t.cls">{{ t.text }}</span>
      </template>
      <span v-if="cursor && i === 0" class="typed-cursor"></span>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bunx vitest run src/components/shared/CodeBlock.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/shared/CodeBlock.vue src/components/shared/CodeBlock.spec.ts
git commit -m "feat: add CodeBlock line-numbered component"
```

---

### Task 7: Editor shell layout + routing

**Files:**
- Create: `src/components/editor/EditorWindow.vue`, `TitleBar.vue`, `ThemeToggle.vue`, `ActivityBar.vue`, `FileExplorer.vue`, `TabBar.vue`, `StatusBar.vue`, `Minimap.vue`
- Modify: `src/App.vue` (rewrite), `src/router/index.ts`
- Test: `src/components/editor/ThemeToggle.spec.ts`, `src/components/editor/TabBar.spec.ts`, `src/components/editor/StatusBar.spec.ts`

**Interfaces:**
- Consumes: `useTheme` (Task 3), `FILES`/`activeFileMeta`/`detailFileMeta` (Task 4), `useProjectsStore` from `@/modules/projects/presentation/projects.store`.
- Produces: the full shell. `App.vue` renders `<EditorWindow/>`. Router gets `/` → redirect `/about`.

- [ ] **Step 1: Write the failing tests**

Create `src/components/editor/ThemeToggle.spec.ts`:

```ts
import { beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeToggle from './ThemeToggle.vue'

beforeEach(() => {
  document.documentElement.dataset.theme = 'dark'
})

describe('ThemeToggle', () => {
  it('toggles the html data-theme attribute on click', async () => {
    const wrapper = mount(ThemeToggle)
    expect(document.documentElement.dataset.theme).toBe('dark')

    await wrapper.find('button').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('light')

    await wrapper.find('button').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
```

Create `src/components/editor/TabBar.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory, RouterView } from 'vue-router'
import { mount } from '@vue/test-utils'
import TabBar from './TabBar.vue'

async function mountTabBar(initialPath: string) {
  setActivePinia(createPinia())
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', redirect: '/about' },
      { path: '/about', component: { template: '<div/>' } },
      { path: '/projects', component: { template: '<div/>' } },
      { path: '/projects/:id', component: { template: '<div/>' } },
      { path: '/experiences', component: { template: '<div/>' } },
      { path: '/skills', component: { template: '<div/>' } },
      { path: '/contacts', component: { template: '<div/>' } },
    ],
  })
  router.push(initialPath)
  await router.isReady()
  const wrapper = mount(TabBar, { global: { plugins: [router, createPinia()] } })
  return { wrapper, router }
}

describe('TabBar', () => {
  it('renders five fixed tabs and marks the active one', async () => {
    const { wrapper } = await mountTabBar('/about')
    const tabs = wrapper.findAll('.tab')
    expect(tabs).toHaveLength(5)
    expect(wrapper.find('.tab.active').text()).toContain('about.dart')
  })

  it('adds a detail tab on a project detail route', async () => {
    const { wrapper } = await mountTabBar('/projects/proj_x')
    expect(wrapper.findAll('.tab')).toHaveLength(6)
    expect(wrapper.find('.tab.active').text()).toContain('project.md')
  })
})
```

Create `src/components/editor/StatusBar.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { mount } from '@vue/test-utils'
import StatusBar from './StatusBar.vue'

async function mountStatusBar(initialPath: string) {
  setActivePinia(createPinia())
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/about', component: { template: '<div/>' } },
      { path: '/skills', component: { template: '<div/>' } },
    ],
  })
  router.push(initialPath)
  await router.isReady()
  const wrapper = mount(StatusBar, { global: { plugins: [router, createPinia()] } })
  return wrapper
}

describe('StatusBar', () => {
  it('shows the active file language', async () => {
    const wrapper = await mountStatusBar('/about')
    expect(wrapper.text()).toContain('Dart')

    const skills = await mountStatusBar('/skills')
    expect(skills.text()).toContain('YAML')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bunx vitest run src/components/editor/ThemeToggle.spec.ts src/components/editor/TabBar.spec.ts src/components/editor/StatusBar.spec.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Write `src/components/editor/ThemeToggle.vue`**

```vue
<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { isDark, toggle } = useTheme()
</script>

<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggle"
  >
    <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
    <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  </button>
</template>
```

- [ ] **Step 4: Write `src/components/editor/TitleBar.vue`**

```vue
<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
</script>

<template>
  <header class="titlebar">
    <div class="traffic" aria-hidden="true">
      <span class="r"></span><span class="y"></span><span class="g"></span>
    </div>
    <div class="titlebar-title">
      <b>septa@portfolio</b> — ~/portfolio — code
    </div>
    <ThemeToggle />
  </header>
</template>
```

- [ ] **Step 5: Write `src/components/editor/ActivityBar.vue`**

```vue
<template>
  <div class="activitybar" aria-hidden="true">
    <div class="a-icon active" title="Explorer">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
        <path d="M4 5h6l2 3h8v11H4z" />
      </svg>
    </div>
    <div class="a-icon" title="Search — coming soon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
        <circle cx="11" cy="11" r="6" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    </div>
    <div class="a-icon" title="Source Control — main">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
        <circle cx="6" cy="6" r="2.2" />
        <circle cx="6" cy="18" r="2.2" />
        <circle cx="18" cy="12" r="2.2" />
        <path d="M6 8v8M8 6h4a4 4 0 0 1 4 4" />
      </svg>
    </div>
    <div class="avatar-mini">SA</div>
  </div>
</template>
```

- [ ] **Step 6: Write `src/components/editor/FileExplorer.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FILES, activeFileMeta, detailFileMeta } from '@/composables/useEditorTabs'
import { useProjectsStore } from '@/modules/projects/presentation/projects.store'

const route = useRoute()
const router = useRouter()
const store = useProjectsStore()

const isDetail = computed(
  () => route.path.startsWith('/projects/') && route.path !== '/projects',
)
const active = computed(() => activeFileMeta(route.path, store.currentProject?.name ?? null))
const detail = computed(() =>
  isDetail.value ? detailFileMeta(store.currentProject?.name ?? null) : null,
)

function go(path: string) {
  router.push(path)
}
</script>

<template>
  <nav class="sidebar" aria-label="File explorer">
    <div class="sidebar-label">EXPLORER</div>
    <div class="tree-folder">
      <span class="chev" aria-hidden="true">▾</span> PORTFOLIO
    </div>
    <div class="tree-files">
      <button
        v-for="f in FILES"
        :key="f.route"
        type="button"
        class="tree-file"
        :class="{ active: active.route === f.route }"
        @click="go(f.route)"
      >
        <span class="dot" :style="{ background: f.dot }"></span>{{ f.file }}
      </button>
      <button v-if="detail" type="button" class="tree-file active">
        <span class="dot" :style="{ background: detail.dot }"></span>{{ detail.file }}
      </button>
    </div>
    <div class="sidebar-note">
      Surabaya, Indonesia<br />
      Mobile Engineer · Flutter &amp; Native
    </div>
  </nav>
</template>
```

- [ ] **Step 7: Write `src/components/editor/TabBar.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FILES, activeFileMeta, detailFileMeta } from '@/composables/useEditorTabs'
import { useProjectsStore } from '@/modules/projects/presentation/projects.store'

const route = useRoute()
const router = useRouter()
const store = useProjectsStore()

const isDetail = computed(
  () => route.path.startsWith('/projects/') && route.path !== '/projects',
)
const active = computed(() => activeFileMeta(route.path, store.currentProject?.name ?? null))
const detail = computed(() =>
  isDetail.value ? detailFileMeta(store.currentProject?.name ?? null) : null,
)

function go(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="tabbar" role="tablist" aria-label="Open files">
    <button
      v-for="f in FILES"
      :key="f.route"
      type="button"
      role="tab"
      class="tab"
      :class="{ active: active.route === f.route }"
      :aria-selected="active.route === f.route"
      @click="go(f.route)"
    >
      <span class="dot" :style="{ background: f.dot }"></span>{{ f.file }}<span class="x" aria-hidden="true">×</span>
    </button>
    <button
      v-if="detail"
      type="button"
      role="tab"
      class="tab active"
      aria-selected="true"
    >
      <span class="dot" :style="{ background: detail.dot }"></span>{{ detail.file }}<span class="x" aria-hidden="true">×</span>
    </button>
  </div>
</template>
```

- [ ] **Step 8: Write `src/components/editor/StatusBar.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { activeFileMeta } from '@/composables/useEditorTabs'
import { useProjectsStore } from '@/modules/projects/presentation/projects.store'

const route = useRoute()
const store = useProjectsStore()

const meta = computed(() => activeFileMeta(route.path, store.currentProject?.name ?? null))
</script>

<template>
  <footer class="statusbar" aria-hidden="true">
    <div class="left">
      <span class="branch">⎇ main</span>
      <span>0 problems</span>
    </div>
    <div class="right">
      <span class="lang">
        <span class="ldot" :style="{ background: meta.dot }"></span>{{ meta.lang }}
      </span>
      <span>{{ meta.pos }}</span>
      <span>UTF-8</span>
      <span>LF</span>
    </div>
  </footer>
</template>
```

- [ ] **Step 9: Write `src/components/editor/Minimap.vue`**

```vue
<script setup lang="ts">
const widths = [40, 65, 30, 80, 55, 20, 70, 45, 60, 35, 75, 50, 25, 65, 40]
</script>

<template>
  <div class="minimap" aria-hidden="true">
    <span v-for="(w, i) in widths" :key="i" :style="{ width: w + '%' }"></span>
  </div>
</template>
```

- [ ] **Step 10: Write `src/components/editor/EditorWindow.vue`**

```vue
<script setup lang="ts">
import TitleBar from './TitleBar.vue'
import ActivityBar from './ActivityBar.vue'
import FileExplorer from './FileExplorer.vue'
import TabBar from './TabBar.vue'
import StatusBar from './StatusBar.vue'
import Minimap from './Minimap.vue'
</script>

<template>
  <div class="window">
    <TitleBar />
    <div class="body">
      <ActivityBar />
      <FileExplorer />
      <div class="editor">
        <TabBar />
        <div class="editor-content">
          <RouterView v-slot="{ Component }">
            <Transition name="panel" mode="out-in">
              <component :is="Component" :key="$route.fullPath" />
            </Transition>
          </RouterView>
        </div>
      </div>
      <Minimap />
    </div>
    <StatusBar />
  </div>
</template>
```

- [ ] **Step 11: Rewrite `src/App.vue`**

Replace the entire file with:

```vue
<script setup lang="ts">
import EditorWindow from '@/components/editor/EditorWindow.vue'
</script>

<template>
  <EditorWindow />
</template>
```

- [ ] **Step 12: Update `src/router/index.ts`**

Replace the `home` route block with a redirect:

```ts
{
  path: '/',
  redirect: '/about',
},
```

and remove the `HomeView` import (line 2: `import HomeView from '../views/HomeView.vue'`).

- [ ] **Step 13: Run the three specs + type-check to verify pass**

Run: `bunx vitest run src/components/editor/ThemeToggle.spec.ts src/components/editor/TabBar.spec.ts src/components/editor/StatusBar.spec.ts && bun run type-check`

Expected: 3 spec files PASS; type-check PASS. (`bun run type-check` may report pre-existing errors in views that later tasks rewrite — if so, note them and continue; they must be gone by Task 14.)

- [ ] **Step 14: Commit**

```bash
git add src/components/editor src/App.vue src/router/index.ts
git commit -m "feat: add code-editor shell layout and routing"
```

---

### Task 8: `AboutView` (about.dart panel)

**Files:**
- Rewrite: `src/views/AboutView.vue`
- Test: `src/views/AboutView.spec.ts`

**Interfaces:**
- Consumes: `profile`, `aboutCodeLines` (Task 2), `CodeBlock` (Task 6), `useTypewriter` (Task 5).
- Produces: the landing panel — split layout: `CodeBlock` of about.dart (typed first comment, `cursor` while typing) + preview card (SA avatar, name, role, résumé button, pills, stat lines).

- [ ] **Step 1: Write the failing test**

Create `src/views/AboutView.spec.ts`:

```ts
import { afterEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutView from './AboutView.vue'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('AboutView', () => {
  it('renders name, role, résumé link, and stack pills', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} }))
    const wrapper = mount(AboutView)

    expect(wrapper.text()).toContain('Septa Alfauzan')
    expect(wrapper.find('.role').text()).toContain('Mobile')
    const resume = wrapper.find('a.btn.primary')
    expect(resume.attributes('href')).toContain('drive.google.com')
    expect(wrapper.findAll('.pill').length).toBeGreaterThanOrEqual(4)
  })

  it('types the first comment line under reduced motion instantly', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} }))
    const wrapper = mount(AboutView)

    expect(wrapper.text()).toContain("// Hello, I'm Septa Alfauzan")
    expect(wrapper.find('.typed-cursor').exists()).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bunx vitest run src/views/AboutView.spec.ts`
Expected: FAIL — current AboutView has no avatar/pills/résumé link.

- [ ] **Step 3: Rewrite `src/views/AboutView.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import CodeBlock from '@/components/shared/CodeBlock.vue'
import { profile, aboutCodeLines } from '@/data/profile'
import { useTypewriter } from '@/composables/useTypewriter'

const typed = useTypewriter("// Hello, I'm Septa Alfauzan 👋")
const lines = computed(() => aboutCodeLines(typed.text.value))
</script>

<template>
  <section class="panel">
    <div class="split">
      <div class="code-col">
        <CodeBlock :lines="lines" :cursor="!typed.done" />
      </div>

      <div class="preview-card">
        <div class="avatar">SA</div>
        <h3>{{ profile.name }}</h3>
        <div class="role">{{ profile.tagline }}</div>
        <a
          :href="profile.resumeUrl"
          target="_blank"
          rel="noopener"
          class="btn primary"
        >
          ↓ Download Résumé
        </a>
        <div class="pill-row">
          <span v-for="s in profile.stack" :key="s" class="pill">{{ s }}</span>
        </div>
        <div class="stat-line">
          <template v-for="(stat, i) in profile.stats" :key="i">
            {{ stat.before }}<b>{{ stat.bold }}</b>{{ stat.after }}<br />
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bunx vitest run src/views/AboutView.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/views/AboutView.vue src/views/AboutView.spec.ts
git commit -m "feat: rewrite About as about.dart panel"
```

---

### Task 9: `ExperiencesView` (experience.log panel)

**Files:**
- Rewrite: `src/views/ExperiencesView.vue`
- Test: `src/views/ExperiencesView.spec.ts`

**Interfaces:**
- Consumes: `experiences` (Task 2).
- Produces: `.log-list` with one `.commit` per experience (hash, refs, author/date, subject, body, bullets).

- [ ] **Step 1: Write the failing test**

Create `src/views/ExperiencesView.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ExperiencesView from './ExperiencesView.vue'

describe('ExperiencesView', () => {
  it('renders all four roles as commits with the first marked HEAD', () => {
    const wrapper = mount(ExperiencesView)

    expect(wrapper.findAll('.commit')).toHaveLength(4)
    expect(wrapper.text()).toContain('9f3a1c2')
    expect(wrapper.text()).toContain('(HEAD -> main, origin/main)')
    expect(wrapper.text()).toContain('Mobile Developer @ Delta HQ')
    expect(wrapper.text()).toContain('Android Developer Intern @ Algostudio')
    expect(wrapper.text()).toContain('93%')
  })

  it('renders bullets for the current role', () => {
    const wrapper = mount(ExperiencesView)
    const first = wrapper.find('.commit')
    expect(first.findAll('li').length).toBe(5)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bunx vitest run src/views/ExperiencesView.spec.ts`
Expected: FAIL — no `.commit` elements in current view.

- [ ] **Step 3: Rewrite `src/views/ExperiencesView.vue`**

```vue
<script setup lang="ts">
import { experiences } from '@/data/experience'
</script>

<template>
  <section class="panel">
    <div class="log-list">
      <article v-for="e in experiences" :key="e.hash" class="commit">
        <div class="commit-meta">
          <span class="hash">{{ e.hash }}</span>
          <span v-if="e.refs" class="refs">{{ e.refs }}</span>
          <div class="line2">Author: {{ e.author }} &nbsp;·&nbsp; Date: {{ e.dateRange }}</div>
        </div>
        <h3 class="commit-subject">{{ e.subject }}</h3>
        <p class="commit-body">{{ e.body }}</p>
        <ul v-if="e.bullets.length" class="commit-bullets">
          <li v-for="(b, i) in e.bullets" :key="i">{{ b }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bunx vitest run src/views/ExperiencesView.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/views/ExperiencesView.vue src/views/ExperiencesView.spec.ts
git commit -m "feat: rewrite Experiences as git-log experience.log panel"
```

---

### Task 10: `SkillsView` (skills.yaml panel)

**Files:**
- Rewrite: `src/views/SkillsView.vue`
- Test: `src/views/SkillsView.spec.ts`

**Interfaces:**
- Consumes: `skillGroups` (Task 2).
- Produces: `.yaml-block` with one `.yaml-group` per group (key + items).

- [ ] **Step 1: Write the failing test**

Create `src/views/SkillsView.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkillsView from './SkillsView.vue'

describe('SkillsView', () => {
  it('renders yaml groups with no web-development duplicate', () => {
    const wrapper = mount(SkillsView)

    expect(wrapper.findAll('.yaml-group')).toHaveLength(4)
    expect(wrapper.text()).toContain('mobile_development:')
    expect(wrapper.text()).toContain('Flutter')
    expect(wrapper.text()).toContain('Firebase, Micro CMS')
    expect(wrapper.text()).not.toContain('Web Development')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bunx vitest run src/views/SkillsView.spec.ts`
Expected: FAIL — no `.yaml-group` in current view.

- [ ] **Step 3: Rewrite `src/views/SkillsView.vue`**

```vue
<script setup lang="ts">
import { skillGroups } from '@/data/skills'
</script>

<template>
  <section class="panel">
    <div class="yaml-block">
      <div v-for="g in skillGroups" :key="g.key" class="yaml-group">
        <div><span class="yaml-key">{{ g.key }}:</span></div>
        <div v-for="item in g.items" :key="item">
          <span class="yaml-dash">&nbsp;&nbsp;-</span> <span class="yaml-val">{{ item }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bunx vitest run src/views/SkillsView.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/views/SkillsView.vue src/views/SkillsView.spec.ts
git commit -m "feat: rewrite Skills as skills.yaml panel, drop duplicate"
```

---

### Task 11: `ContactView` (contact.md panel)

**Files:**
- Rewrite: `src/views/ContactView.vue`
- Test: `src/views/ContactView.spec.ts`

**Interfaces:**
- Consumes: `contact`, `contactMdLines` (Task 2), `CodeBlock` (Task 6).
- Produces: split layout — markdown source `CodeBlock` + `.preview-card.contact-preview` with email/phone rows and social buttons (real URLs).

- [ ] **Step 1: Write the failing test**

Create `src/views/ContactView.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactView from './ContactView.vue'

describe('ContactView', () => {
  it('renders markdown source and a rendered preview with real links', () => {
    const wrapper = mount(ContactView)

    const mailto = wrapper.find('a[href="mailto:alfauzansepta@gmail.com"]')
    expect(mailto.exists()).toBe(true)

    const linkedIn = wrapper.find('a[href="http://linkedin.com/in/septa-alfauzan-a11a891b0/"]')
    expect(linkedIn.exists()).toBe(true)

    expect(wrapper.findAll('.contact-row')).toHaveLength(2)
    expect(wrapper.text()).toContain("Let's work together")
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bunx vitest run src/views/ContactView.spec.ts`
Expected: FAIL — current view lacks those selectors.

- [ ] **Step 3: Rewrite `src/views/ContactView.vue`**

```vue
<script setup lang="ts">
import CodeBlock from '@/components/shared/CodeBlock.vue'
import { contact, contactMdLines } from '@/data/contact'
</script>

<template>
  <section class="panel">
    <div class="split">
      <div class="code-col">
        <CodeBlock :lines="contactMdLines()" />
      </div>

      <div class="preview-card contact-preview">
        <h3>Let's work together.</h3>
        <p>Preview — this is how contact.md renders.</p>
        <div class="contact-row">
          <span>Email</span>
          <a :href="`mailto:${contact.email}`">{{ contact.email }}</a>
        </div>
        <div class="contact-row">
          <span>Phone</span>
          <a :href="contact.phoneHref">{{ contact.phone }}</a>
        </div>
        <div class="social-row">
          <a
            v-for="s in contact.socials"
            :key="s.label"
            :href="s.url"
            target="_blank"
            rel="noopener"
          >
            {{ s.label }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bunx vitest run src/views/ContactView.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/views/ContactView.vue src/views/ContactView.spec.ts
git commit -m "feat: rewrite Contact as contact.md panel"
```

---

### Task 12: Restyle projects grid + card for editor theme

**Files:**
- Rewrite: `src/modules/projects/presentation/components/ProjectCard.vue`, `ProjectGrid.vue`
- Modify: `src/views/ProjectsView.vue`
- Update tests: `src/modules/projects/presentation/__tests__/ProjectCard.spec.ts`, `ProjectGrid.spec.ts`

**Interfaces:**
- Consumes: existing `Project` model, existing props/emits: `ProjectCard` `{ project: Project }` emits `open: [id]`; `ProjectGrid` `{ projects, loading, error }` emits `open` / `retry`.
- Produces: cards styled as mockup `.card` (thumb image, placeholder gradient tile when no image, name, description, "→ view details" button); grid as `.grid`; skeleton/error/empty states in editor tokens. ProjectsView adds the `.json-line` header. All existing specs' assertions (text, `img` src, `button` click → `open`, `aria-busy`, retry emit, "No projects yet") must keep passing.

- [ ] **Step 1: Write the failing (updated) tests**

Update `src/modules/projects/presentation/__tests__/ProjectCard.spec.ts` to the full contents below (adds placeholder-tile test, keeps existing assertions):

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectCard from '../components/ProjectCard.vue'
import type { Project } from '@/modules/projects/domain/project.model'

const project: Project = {
  id: 'p1',
  createdAt: '',
  publishedAt: '',
  name: 'Dummy',
  description: 'A long description',
  markdownAdditionals: '',
  images: [{ url: 'https://example.com/thumb.png', height: 100, width: 200 }],
}

describe('ProjectCard', () => {
  it('renders name, description, and thumbnail', () => {
    const wrapper = mount(ProjectCard, { props: { project } })

    expect(wrapper.text()).toContain('Dummy')
    expect(wrapper.text()).toContain('A long description')
    expect(wrapper.find('img').attributes('src')).toBe(project.images[0]?.url)
  })

  it('emits open with the project id on details click', async () => {
    const wrapper = mount(ProjectCard, { props: { project } })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('open')).toEqual([['p1']])
  })

  it('renders a placeholder tile when there is no image', () => {
    const noImage: Project = { ...project, images: [] }
    const wrapper = mount(ProjectCard, { props: { project: noImage } })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.card-thumb--placeholder').exists()).toBe(true)
  })
})
```

Update `src/modules/projects/presentation/__tests__/ProjectGrid.spec.ts` to add a card class assertion to the last test:

```ts
  it('renders a card per project and forwards open', async () => {
    const wrapper = mount(ProjectGrid, {
      props: { projects, loading: false, error: null },
    })

    const card = wrapper.findComponent(ProjectCard)
    expect(card.exists()).toBe(true)
    expect(wrapper.find('.card').exists()).toBe(true)

    card.vm.$emit('open', 'p1')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('open')).toEqual([['p1']])
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `bunx vitest run src/modules/projects/presentation/__tests__/ProjectCard.spec.ts src/modules/projects/presentation/__tests__/ProjectGrid.spec.ts`
Expected: FAIL — `.card` / `.card-thumb--placeholder` selectors missing.

- [ ] **Step 3: Rewrite `src/modules/projects/presentation/components/ProjectCard.vue`**

```vue
<script setup lang="ts">
import type { Project } from '@/modules/projects/domain/project.model'

defineProps<{ project: Project }>()

const emit = defineEmits<{ open: [id: string] }>()
</script>

<template>
  <article class="card" @click="emit('open', project.id)">
    <img
      v-if="project.images[0]"
      :src="project.images[0].url"
      :alt="project.name"
      class="card-thumb"
    />
    <div v-else class="card-thumb card-thumb--placeholder" aria-hidden="true">SA</div>
    <div class="card-body">
      <h4>{{ project.name }}</h4>
      <p>{{ project.description }}</p>
      <button type="button" class="card-link" @click.stop="emit('open', project.id)">
        → view details
      </button>
    </div>
  </article>
</template>
```

- [ ] **Step 4: Rewrite `src/modules/projects/presentation/components/ProjectGrid.vue`**

```vue
<script setup lang="ts">
import type { Project } from '@/modules/projects/domain/project.model'
import ProjectCard from './ProjectCard.vue'

defineProps<{
  projects: Project[]
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  open: [id: string]
  retry: []
}>()

function openProject(id: string) {
  emit('open', id)
}
</script>

<template>
  <div
    v-if="loading"
    class="grid"
    aria-busy="true"
    aria-label="Loading projects"
  >
    <div v-for="n in 3" :key="n" class="card">
      <div class="card-thumb card-thumb--placeholder" aria-hidden="true" />
      <div class="card-body">
        <div class="pill">…</div>
      </div>
    </div>
  </div>

  <div v-else-if="error" class="more-note" role="status">
    <p>{{ error }}</p>
    <button type="button" class="card-link" @click="emit('retry')">retry</button>
  </div>

  <div v-else-if="projects.length === 0" class="more-note" role="status">
    <p>No projects yet</p>
  </div>

  <div v-else class="grid">
    <ProjectCard
      v-for="project in projects"
      :key="project.id"
      :project="project"
      @open="openProject"
    />
  </div>
</template>
```

Note: the skeleton rows reuse `.card` + `.pill` styles from editor.css so no scoped styles are needed. Delete the component's `<style scoped>` block.

- [ ] **Step 5: Update `src/views/ProjectsView.vue`**

Replace the template section (keep the `<script setup>` as-is) with:

```vue
<template>
  <section class="panel">
    <div class="json-line">
      <span class="k">"projects"</span>: <span class="tok-punc">[</span>
      <span class="tok-com">// {{ projects.length }} shipped — click a card for details</span>
    </div>
    <ProjectGrid
      :projects="projects"
      :loading="loading"
      :error="error"
      @open="openProject"
      @retry="store.loadProjects"
    />
  </section>
</template>
```

- [ ] **Step 6: Run all projects-module unit tests to verify pass**

Run: `bunx vitest run src/modules/projects`
Expected: ALL PASS (Card, Grid, Carousel, MarkdownContent, store, use-cases, data sources, model).

- [ ] **Step 7: Commit**

```bash
git add src/modules/projects/presentation/components src/views/ProjectsView.vue
git commit -m "feat: restyle project cards and grid for editor theme"
```

---

### Task 13: Restyle project detail + carousel + markdown

**Files:**
- Rewrite: `src/views/ProjectDetailView.vue`
- Modify: `src/modules/projects/presentation/components/ProjectCarousel.vue`, `MarkdownContent.vue`
- Tests: existing `ProjectCarousel.spec.ts`, `MarkdownContent.spec.ts` must keep passing (no changes unless markup breaks them).

**Interfaces:**
- Consumes: existing store API (`loadProjectDetail`, `currentProject`, `loading`, `error`), `ProjectCarousel` `{ images, alt }`, `MarkdownContent` `{ markdown }`.
- Produces: detail panel using `.detail-title`, `.detail-meta`, `.detail-desc`, carousel and markdown restyled with editor tokens.

- [ ] **Step 1: Run existing tests to confirm baseline**

Run: `bunx vitest run src/modules/projects/presentation/__tests__/ProjectCarousel.spec.ts src/modules/projects/presentation/__tests__/MarkdownContent.spec.ts`
Expected: PASS (baseline before restyle).

- [ ] **Step 2: Rewrite `src/modules/projects/presentation/components/ProjectCarousel.vue`**

Keep the `<script setup>` and template markup identical (buttons, img, figcaption — tests rely on them), only replace the `<style scoped>` block with:

```css
.project-carousel {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.carousel-image {
  flex: 1;
  min-width: 0;
  height: clamp(240px, 45vh, 420px);
  width: 100%;
  object-fit: cover;
  border: 1px solid var(--border);
  border-radius: 10px;
}

.carousel-btn {
  flex: 0 0 auto;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  border-radius: 7px;
  width: 34px;
  height: 34px;
}

.carousel-btn:hover {
  color: var(--text-bright);
  border-color: var(--blue);
}

.carousel-counter {
  text-align: center;
  flex: 0 0 auto;
  font-size: 12px;
  color: var(--text-muted);
}
```

- [ ] **Step 3: Modify `src/modules/projects/presentation/components/MarkdownContent.vue`**

Keep the `<script setup>` and template identical; replace the `<style scoped>` block with:

```css
.markdown-body {
  margin-top: 1.5rem;
  line-height: 1.6;
  font-size: 13px;
  color: var(--text);
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin: 1rem 0 0.5rem;
  color: var(--text-bright);
}

.markdown-body :deep(h2) {
  border-bottom: 1px solid var(--border);
  padding-bottom: 0.25rem;
}

.markdown-body :deep(a) {
  color: var(--blue);
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.5rem;
}

.markdown-body :deep(code) {
  background: var(--bg-hover);
  padding: 0.125rem 0.25rem;
}
```

- [ ] **Step 4: Rewrite `src/views/ProjectDetailView.vue`**

```vue
<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '@/modules/projects/presentation/projects.store'
import MarkdownContent from '@/modules/projects/presentation/components/MarkdownContent.vue'
import ProjectCarousel from '@/modules/projects/presentation/components/ProjectCarousel.vue'

const route = useRoute()
const store = useProjectsStore()
const { currentProject, loading, error } = storeToRefs(store)

const projectId = computed(() => String(route.params.id ?? ''))

onMounted(() => {
  store.loadProjectDetail(projectId.value)
})

watch(projectId, (id) => {
  store.loadProjectDetail(id)
})

function retry() {
  store.loadProjectDetail(projectId.value)
}
</script>

<template>
  <section class="panel">
    <RouterLink to="/projects" class="card-link">← back to projects</RouterLink>

    <div v-if="loading" class="detail-desc" aria-busy="true">
      <p>Loading project…</p>
    </div>

    <div v-else-if="error" class="detail-desc" role="status">
      <p>{{ error }}</p>
      <button type="button" class="card-link" @click="retry">retry</button>
    </div>

    <article v-else-if="currentProject">
      <h2 class="detail-title">{{ currentProject.name }}</h2>
      <div class="detail-meta">published {{ currentProject.publishedAt.slice(0, 10) }}</div>
      <ProjectCarousel :images="currentProject.images" :alt="currentProject.name" />
      <p class="detail-desc">{{ currentProject.description }}</p>
      <MarkdownContent
        v-if="currentProject.markdownAdditionals"
        :markdown="currentProject.markdownAdditionals"
      />
    </article>

    <div v-else class="detail-desc" role="status">
      <p>Project not found.</p>
      <RouterLink to="/projects" class="card-link">← back to projects</RouterLink>
    </div>
  </section>
</template>
```

- [ ] **Step 5: Run tests + type-check to verify pass**

Run: `bunx vitest run src/modules/projects && bun run type-check`
Expected: ALL PASS; type-check PASS (all previously-dangling view errors now resolved since every view is rewritten).

- [ ] **Step 6: Commit**

```bash
git add src/views/ProjectDetailView.vue src/modules/projects/presentation/components/ProjectCarousel.vue src/modules/projects/presentation/components/MarkdownContent.vue
git commit -m "feat: restyle project detail, carousel, and markdown for editor theme"
```

---

### Task 14: Remove dead components and stale references

**Files:**
- Delete: `src/views/HomeView.vue`, `src/components/HelloWorld.vue`, `src/components/TheWelcome.vue`, `src/components/WelcomeItem.vue`, `src/components/ProfilePic.vue`, `src/components/SkillItem.vue`, `src/assets/logo.svg`, `src/components/__tests__/HelloWorld.spec.ts`
- Modify: `package.json` (remove `gsap` dependency)

**Interfaces:**
- Consumes: nothing; all consumers were rewritten in Tasks 7–13.
- Produces: a repo where `grep -r "gsap\|HelloWorld\|HomeView\|ProfilePic\|SkillItem\|TheWelcome\|WelcomeItem" src` returns nothing.

- [ ] **Step 1: Verify nothing references the dead components**

Run:
```bash
grep -rn "gsap\|HomeView\|HelloWorld\|TheWelcome\|WelcomeItem\|ProfilePic\|SkillItem" src --include="*.vue" --include="*.ts" --include="*.spec.ts" || true
```
Expected: only matches inside files being deleted (`HelloWorld.spec.ts`, `HomeView.vue`, etc.). If `gsap` appears anywhere else, stop and inspect before deleting.

- [ ] **Step 2: Delete files**

Run:
```bash
rm src/views/HomeView.vue src/components/HelloWorld.vue src/components/TheWelcome.vue src/components/WelcomeItem.vue src/components/ProfilePic.vue src/components/SkillItem.vue src/assets/logo.svg src/components/__tests__/HelloWorld.spec.ts
```

- [ ] **Step 3: Remove gsap dependency**

Run: `bun remove gsap`

- [ ] **Step 4: Verify full suite passes**

Run: `bun run type-check && bun run lint && bun run test:unit && bun run build`

Expected: type-check, lint, all unit tests, and build all pass.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: remove dead components and gsap dependency"
```

---

### Task 15: Cypress e2e coverage

**Files:**
- Delete: `cypress/e2e/example.cy.ts`, `cypress/fixtures/example.json`
- Create: `cypress/e2e/portfolio.cy.ts`
- Modify: `package.json` `test:e2e` script (build preview with `VITE_USE_MOCK_API=true` so project data resolves offline)

**Interfaces:**
- Consumes: the built app served by `wrangler dev` at `http://localhost:4173`.
- Produces: e2e specs covering redirect, tab/sidebar nav, theme toggle, and project-card → detail-tab flow. Mock projects come from `src/modules/projects/data/mock-data.ts` (ids include `proj_hris`, `proj_iot`).

- [ ] **Step 1: Write `cypress/e2e/portfolio.cy.ts`**

```ts
describe('portfolio code-editor', () => {
  it('redirects the root to about.dart and renders the shell', () => {
    cy.visit('/')
    cy.url().should('include', '/about')
    cy.get('.titlebar-title').should('contain', 'septa@portfolio')
    cy.get('.statusbar').should('contain', 'Dart')
  })

  it('navigates via sidebar and tabs, keeping the url in sync', () => {
    cy.visit('/about')

    cy.get('.tree-file').contains('experience.log').click()
    cy.url().should('include', '/experiences')
    cy.get('.commit-subject').first().should('contain', 'Delta HQ')
    cy.get('.tab.active').should('contain', 'experience.log')

    cy.get('.tab').contains('skills.yaml').click()
    cy.url().should('include', '/skills')
    cy.get('.yaml-block').should('contain', 'mobile_development:')

    cy.get('.tree-file').contains('contact.md').click()
    cy.url().should('include', '/contacts')
    cy.get('.contact-row').first().should('contain', 'alfauzansepta@gmail.com')
  })

  it('toggles the theme', () => {
    cy.visit('/about')
    cy.get('html').should('have.attr', 'data-theme', 'dark')

    cy.get('.theme-toggle').click()
    cy.get('html').should('have.attr', 'data-theme', 'light')

    cy.get('.theme-toggle').click()
    cy.get('html').should('have.attr', 'data-theme', 'dark')
  })

  it('opens a project detail tab from the grid', () => {
    cy.visit('/projects')
    cy.get('.json-line').should('contain', '"projects"')
    cy.get('.card').first().click()
    cy.url().should('match', /\/projects\/.+/)
    cy.get('.tab.active').should('contain', '.md')
    cy.get('.detail-title').should('exist')
  })
})
```

- [ ] **Step 2: Delete the example e2e + fixture**

Run: `rm cypress/e2e/example.cy.ts cypress/fixtures/example.json`

- [ ] **Step 3: Update the `test:e2e` script in `package.json`**

Replace:
```json
    "test:e2e": "start-server-and-test preview http://localhost:4173 'cypress run --e2e'",
```
with:
```json
    "test:e2e": "start-server-and-test 'VITE_USE_MOCK_API=true bun run build-only && wrangler dev' http://localhost:4173 'cypress run --e2e'",
```

- [ ] **Step 4: Run the e2e suite**

Run: `bun run test:e2e`
Expected: all 4 e2e tests pass. If `wrangler dev` binds a different port, the `start-server-and-test` URL stays `http://localhost:4173` (server URL) — adjust only the server command if `wrangler dev` needs `--port 4173`.

- [ ] **Step 5: Commit**

```bash
git add cypress/e2e/portfolio.cy.ts package.json
git rm cypress/e2e/example.cy.ts cypress/fixtures/example.json
git commit -m "test: add portfolio editor e2e coverage"
```

---

### Task 16: Final verification pass

**Files:**
- None (verification only).

**Interfaces:**
- Consumes: everything from Tasks 1–15.

- [ ] **Step 1: Run the full quality gates**

Run:
```bash
bun run type-check
bun run lint
bun run test:unit
bun run build
bun run test:e2e
```
Expected: all pass.

- [ ] **Step 2: Manual responsive + motion check**

Run `bun run dev`, open at 1440/1024/768/375px widths:
- ≥1150: activitybar + sidebar + minimap visible
- 900–1150: minimap hidden
- <900: activitybar + sidebar hidden, tabs-only nav
- <720: About/Contact splits stack, project grid 1 column, code 12px
- Toggle theme (dark default); toggle `prefers-reduced-motion: reduce` in devtools and confirm the about.dart comment appears instantly with no cursor.
- Confirm tab↔sidebar active states stay in sync after clicking both.
- Confirm no console errors and no broken images on any panel.

- [ ] **Step 3: Final commit of any fix-ups**

```bash
git add -A && git commit -m "chore: verification fixups"
```

- [ ] **Step 4: Report completion against Definition of Done**

Confirm against the spec §10 checklist: 6 panels implemented, both themes AA, tab/sidebar sync, reduced-motion instant, responsive at 4 widths, no console errors / broken images, Lighthouse a11y ≥ 95 (run `npx lighthouse http://localhost:4173 --quiet --chrome-flags="--headless"` on the preview build if available, or record as pending).
