# Design — Portfolio "Code Editor" Redesign

**Owner:** Septa Alfauzan
**Date:** 2026-08-11
**Status:** Approved for planning
**Repo:** septaalfauzan.my.id (Vue 3 SPA, Cloudflare Workers)
**Canonical visual source:** `portfolio-redesign.html` (static mockup, provided by owner). Visuals, spacing, and motion port verbatim from it. Where this doc and the mockup disagree, the mockup wins for visuals/motion; this doc wins for architecture/data/a11y.

## 1. Background

Current site is a light "terminal prompt" theme (monospace, graph-paper background, typewriter/scramble hero in `App.vue`) with a left sidebar + right content panel swapping per nav item. Known issues:

- Broken profile picture (`ProfilePic.vue` renders broken image icon).
- Large unused whitespace below the fold on every section.
- Flat visual system: black/white + single blue accent, no depth, no hover states.
- `Skills` has a duplicate "Web Development" section repeating "Mobile Development" verbatim.

Goal: rebuild as a VS Code–like code-editor chrome (title bar, activity bar, file explorer, tabs, status bar). Each nav section is a "file" whose type matches content:

| Route | File | Renders as |
|---|---|---|
| `/about` | `about.dart` | Dart class + profile preview card (landing, typewriter) |
| `/experiences` | `experience.log` | git-log commit timeline |
| `/projects` | `projects.json` | JSON header + project card grid (MicroCMS) |
| `/skills` | `skills.yaml` | YAML groups |
| `/contacts` | `contact.md` | Markdown source + rendered preview |
| `/projects/:id` | `<slug>.md` (dynamic tab) | project detail (carousel + markdown) |

Light/dark theme toggle (GitHub Dark default / GitHub Light), dark is default on load. In-memory theme only (no `localStorage`).

## 2. Decisions (resolved in brainstorming)

| Question | Decision |
|---|---|
| Mockup file | Provided by owner; port structure/CSS/copy verbatim |
| Projects data source | **Keep MicroCMS + `/projects/:id` detail page** (live module, not static) |
| Routing | **Routes = tabs**; editor shell wraps router; deep-linkable, back button works |
| Projects panel content | Renders live MicroCMS projects (mockup cards are placeholder tiles only) |
| Detail in editor | **New tab per project** (`<slug>.md`) alongside 5 fixed tabs |
| Experience content | git-log style, **all 4 roles** from current site (Delta HQ, Tensai, Bangkit, Algostudio) |
| Social links | Real URLs from current `ContactView.vue` (mockup `#` placeholders discarded) |
| Résumé link | Real Google Drive URL from current `App.vue` |
| Skills duplicate | Dropped (mockup omits "Web Development") |
| Profile picture | `SA` initials avatar (mockup) — permanently fixes broken-image bug |
| Theme default | Dark; in-memory toggle, no persistence |
| Minimap | Included per mockup, hidden <1150px |

## 3. Design tokens

CSS custom properties on `:root` / `:root[data-theme='dark']` and `:root[data-theme='light']`, ported verbatim from mockup. Dark = GitHub Dark palette, Light = GitHub Light palette. `--btn-primary-text` flips per theme (dark theme blue is pale enough for dark text; light theme blue requires white text).

Body backgrounds per theme:
- **Dark:** dual radial glow (`rgba(88,166,255,0.08)` @ 15% 0%, `rgba(210,168,255,0.07)` @ 85% 100%) + 1px dot grid at 22px.
- **Light:** graph-paper blue grid (`rgba(9,105,218,0.10)`, 26px cell).

Font: **JetBrains Mono** (400/500/600/700 + italic 400), Google Fonts. Monospace throughout (intentional theme choice).

## 4. Architecture

```
App.vue (thin root)
└── EditorWindow.vue
    ├── TitleBar (traffic lights, title, ThemeToggle)
    ├── ActivityBar (3 decorative icons + SA avatar-mini)
    ├── FileExplorer (sidebar: EXPLORER / PORTFOLIO tree)
    ├── editor column
    │   ├── TabBar (5 RouterLink tabs + conditional detail tab)
    │   └── editor-content
    │       └── <Transition name="panel" mode="out-in"><RouterView/></Transition>
    ├── Minimap (decorative)
    └── StatusBar (branch, lang+color+pos, UTF-8/LF)
```

- `App.vue` stays a thin root: renders `<EditorWindow/>` + `<RouterView>` wiring (or EditorWindow wraps RouterView). `EditorWindow.vue` is the shell. RouterView is the active panel. Per-route transition = mockup fadeIn (280ms, 4px translateY).
- Routes: `/` redirects to `/about`. `/about`, `/experiences`, `/projects`, `/skills`, `/contacts`, `/projects/:id`.
- `/projects/:id` renders a dynamic tab titled from the loaded project name (slugified, `.md` extension). Until data loads, tab shows generic `project.md`.

### Files

| Path | Change |
|---|---|
| `src/App.vue` | Thin root; render editor shell |
| `src/components/editor/EditorWindow.vue` | New shell (titlebar→statusbar frame) |
| `src/router/index.ts` | Add `/` → redirect `/about`; rest unchanged |
| `src/main.ts` | Remove `terminal.css` import; import new editor stylesheet |
| `src/assets/main.css`, `base.css` | Replaced by `src/assets/editor.css` (mockup CSS verbatim) |
| `src/views/AboutView.vue` | Panel: about.dart CodeBlock + preview card |
| `src/views/ExperiencesView.vue` | Panel: git-log commits from `experience.ts` |
| `src/views/ProjectsView.vue` | Panel: JSON header + ProjectGrid (MicroCMS) |
| `src/views/SkillsView.vue` | Panel: YAML groups from `skills.ts` |
| `src/views/ContactView.vue` | Panel: markdown source + rendered preview |
| `src/views/ProjectDetailView.vue` | Restyle; keep store logic |
| `src/modules/projects/presentation/components/{ProjectCard,ProjectGrid,ProjectCarousel,MarkdownContent}.vue` | Restyle w/ editor tokens; logic untouched |
| `src/composables/useTheme.ts` | New |
| `src/composables/useEditorTabs.ts` | New |
| `src/composables/useTypewriter.ts` | New |
| `src/data/profile.ts`, `experience.ts`, `skills.ts`, `contact.ts` | New, typed, mockup copy verbatim |
| Delete | `HomeView.vue`, `HelloWorld.vue`, `TheWelcome.vue`, `WelcomeItem.vue`, `ProfilePic.vue`, `SkillItem.vue`, `logo.svg` |
| Delete | `src/components/__tests__/HelloWorld.spec.ts` |

## 5. Components

- **Layout** (`src/components/editor/`): `EditorWindow.vue`, `TitleBar.vue`, `ActivityBar.vue`, `FileExplorer.vue`, `TabBar.vue`, `StatusBar.vue`, `Minimap.vue`, `ThemeToggle.vue`.
- **Shared:** `CodeBlock.vue` — props `lines: { text: string; tokens: { cls: string; text: string }[] }[]`; line-number gutter via `v-for` index. Token classes: `tok-kw`, `tok-type`, `tok-str`, `tok-com`, `tok-fn`, `tok-num`, `tok-prop`, `tok-punc`, `tok-bright`.
- **Panels** = routed views (see §4).
- **Composables:**
  - `useTheme` — `theme` ref, `toggle()`, writes `documentElement.dataset.theme`.
  - `useEditorTabs` — `FILES` map (route → file name + dot color), `STATUS` map (lang/color/pos per route), `activeFile(route)`, detail-tab derivation.
  - `useTypewriter` — types first comment line of `about.dart` at 32ms/char; renders instantly if `prefers-reduced-motion: reduce`.

## 6. Data flow & error handling

- Static data: `src/data/*.ts` synchronous, typed.
- Projects: unchanged clean-architecture module. `ProjectsView → store.loadProjects() → getProjectsUseCase → repository → http (MicroCMS) | mock fallback`. Card click / detail link → `router.push('/projects/:id')` → `ProjectDetailView → store.loadProjectDetail(id)`. Latest-request-wins + env-guard kept as-is.
- **Grid states:** skeleton card shells while loading; error state with retry (`loadProjects()` re-call); empty state. Missing `images[0]` → gradient tile placeholder (mockup style) — no broken images.
- **Detail states:** existing loading/error/retry in store + back-to-projects affordance; failed fetch keeps tab navigable.

## 7. A11y, motion, responsive

- `:focus-visible` → 2px `var(--blue)` outline + 2px offset (mockup verbatim) on all interactive elements.
- Tab order: theme toggle → sidebar files → tabs → panel content. Traffic lights, status bar, minimap, and tab `×` are decorative → `aria-hidden`, non-focusable.
- Tabs + sidebar files are real buttons/RouterLinks, keyboard-operable.
- Sidebar hidden <900px → tab bar is sole nav.
- WCAG AA: GitHub's shipped palette pairs pass for body text on panel backgrounds.
- **Motion (only 3 moments):** panel transition (280ms fade+translateY), theme transition (250ms colors), one-time typewriter (32ms/char). Global `prefers-reduced-motion: reduce` override → 0.001ms durations + instant typewriter text.
- **Responsive:** ≥1150px full layout; 900–1150px no minimap; <900px no activitybar/sidebar; <720px splits stack, grid 1-col, panel padding reduced, code 12px + narrower gutter.

## 8. Content mapping

- **profile.ts:** name, role, location (Surabaya, Indonesia), stats (`2+ yrs`, Play/App Store, ID & Japan clients), stack (`Flutter, Kotlin, Swift, Jetpack Compose`), bio/focus strings → drives about.dart lines + preview card (pills, stat-line).
- **experience.ts:** 4 commits, first carries `(HEAD -> main, origin/main)` refs. Delta HQ (Feb 2025—Present, 5 bullets), Tensai Innovation (Oct 2023—Jan 2025, 5 bullets), Bangkit mentor (Feb 2024—Jul 2024, 3 bullets incl. 4.81/5 rating, 93% graduation), Algostudio intern (Aug 2023—Sep 2023, 3 bullets). Hashes decorative.
- **skills.ts:** `mobile_development`, `architecture`, `backend_integration`, `tools` (from current SkillsView, no Web Dev duplicate).
- **contact.ts:** email `alfauzansepta@gmail.com`, phone `+62 821-323-514-998`, socials: LinkedIn `http://linkedin.com/in/septa-alfauzan-a11a891b0/`, GitHub `http://github.com/septAlfauzan/`, Medium `https://medium.com/@alfauzansepta`.

## 9. Testing

- **Vitest unit:** keep projects-module specs; update `ProjectCard`/`ProjectGrid`/`ProjectCarousel`/`MarkdownContent` specs if markup changes; new specs for `useTheme`, `useEditorTabs`, and panel rendering from data files; delete `HelloWorld.spec.ts`.
- **Cypress e2e:** tab↔sidebar sync, theme toggle, project card → detail tab, keyboard navigation.
- **Gates:** `npm run type-check`, `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e`; manual responsive check at 1440/1024/768/375.

## 10. Definition of done

- [ ] All 6 panels implemented (5 files + project detail), content-complete from data files / MicroCMS
- [ ] Dark + light themes pass WCAG AA for body text and interactive elements
- [ ] Tab/sidebar sync; keyboard-operable end to end
- [ ] Reduced-motion users get instant text, no typewriter delay
- [ ] Responsive matches mockup at 1440/1024/768/375px
- [ ] No console errors; no broken images (avatar fix included)
- [ ] Lighthouse a11y ≥ 95
- [ ] All existing projects-module unit tests + new specs pass
- [ ] gsap removed from `App.vue` (dep removal from package.json optional)

## 11. Open items (non-blocking)

- Real project screenshots: MicroCMS images serve as thumbs; higher-fidelity shots can be swapped in MicroCMS later (no code change).
- More projects: adding/removing projects is a MicroCMS content change, not a code change.
