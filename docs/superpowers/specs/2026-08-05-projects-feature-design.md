# Projects Feature Design

Date: 2026-08-05
Status: Approved (design), pending implementation plan

## Goal

Add a Projects section to the personal portfolio site: a `/projects` menu entry listing project cards, and a `/projects/:id` detail page. Data comes from a layered data/repository/use-case/store architecture. Mock data is used for now; the layers are designed so the mock data source can be swapped for the real MicroCMS HTTP API without touching presentation code.

## Decisions

- **Navigation pattern**: dedicated routes `/projects` and `/projects/:id`. Shareable URLs, back button works, matches existing router pattern.
- **Architecture style**: TS modules + Pinia (viewmodel = Pinia store). Repository as TS class behind an interface, use cases as plain async functions. Not OOP clean-arch classes (no DI container in Vue, reactivity fights class instances, YAGNI for a single-domain portfolio site). Conceptual clean-arch boundaries preserved.
- **Markdown rendering**: `marked` + `DOMPurify` (sanitize before injection).
- **UI scope**: keep terminal.css aesthetic; add new pages styled to match.
- **Detail images**: basic prev/next carousel (API field `carouselImages`).
- **Card action**: terminal-style button `[ check details ]` navigates to detail. Card itself is not clickable.

## Architecture

Feature module under `src/modules/projects/`, four layers bottom-up. Dependencies point down only: store → use-case → repository → data source → mock/HTTP. Every layer depends on the layer below through an interface, so swapping mock↔HTTP changes only `di.ts`.

```
src/modules/projects/
  data/
    types.ts                  # raw DTO types mirroring the API JSON exactly
    mock-data.ts              # 3 mock projects (DTO shape, incl. markdownAdditionals + carousel images)
    project-data-source.ts    # interface: fetchProjects(), fetchProjectById(id)
    mock-data-source.ts       # MockProjectDataSource — returns DTOs, ~400ms simulated delay
    http-data-source.ts       # HttpProjectDataSource — real MicroCMS fetch, reads env var, unused by default
  domain/
    project.model.ts          # Project domain model + fromDto mapper
    project.repository.ts     # interface: getProjects(), getProjectById(id)
    mock-project.repository.ts# maps DTO → domain model
    use-cases/
      get-projects.use-case.ts
      get-project-by-id.use-case.ts
  presentation/
    projects.store.ts         # Pinia store (viewmodel/state layer)
    di.ts                     # wiring: store ← use-cases ← repo ← data source (mock default, env flag for HTTP)
```

### Data types (`data/types.ts`)

Exact API shape:

```ts
interface ProjectImage { url: string; height: number; width: number }
interface ProjectImages { fieldId: string; images: ProjectImage[] }
interface ProjectDto {
  id: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
  projectName: string
  projectDesc: string
  markdownAdditionals: string
  images: ProjectImages
}
interface ProjectsResponseDto {
  contents: ProjectDto[]
  totalCount: number
  offset: number
  limit: number
}
```

### Domain model (`project.model.ts`)

```ts
interface Project {
  id: string
  createdAt: string
  publishedAt: string
  name: string
  description: string
  markdownAdditionals: string
  images: ProjectImage[]
}
```

`fromDto(dto: ProjectDto): Project` maps and flattens `images.images`. Missing optional fields default to empty string / empty array (do not crash on partial payloads).

### Data flow

Detail page:

```
route.params.id → store.loadProjectDetail(id)
  → getProjectByIdUseCase.execute(id)
    → repository.getProjectById(id)
      → dataSource.fetchProjectById(id)   // mock: ~400ms delay
  → store.currentProject / loading / error
```

List page: same chain via `getProjectsUseCase` → `store.projects`.

### Store state (`presentation/projects.store.ts`)

- `projects: Project[]`
- `currentProject: Project | null`
- `loading: boolean`
- `error: string | null`
- Actions: `loadProjects()`, `loadProjectDetail(id)`, `clearError()`

`di.ts` is the single composition root: store receives use-case instances; use-cases receive repository; repository receives data source. Default wiring uses `MockProjectDataSource`; env flag (e.g. `VITE_USE_HTTP_API`) selects `HttpProjectDataSource`.

## Routing & Pages

Routes added to `src/router/index.ts`:

- `/projects` → `ProjectsView`
- `/projects/:id` → `ProjectDetailView`

App.vue nav gains a `/projects` `RouterLink` styled like existing links.

### ProjectsView

- Heading `~/projects`
- Responsive terminal-styled grid: `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))`
- Each `ProjectCard` shows: first carousel image as thumbnail, `projectName`, 2-line clamped excerpt of `projectDesc`, terminal `.btn` `check details` → `router.push('/projects/' + id)`
- States: loading (skeleton cards), error (message + retry), empty ("No projects yet")

### ProjectDetailView

- Reads `:id` from route, calls `loadProjectDetail(id)`
- Back link `← projects`
- `projectName` as heading
- `ProjectCarousel` (images, prev/next, index counter, alt = projectName)
- `projectDesc` paragraph
- `markdownAdditionals` rendered via `MarkdownContent`
- States: loading (skeleton), error (message + retry), not-found (404 text when id unknown)

## Components

| Component | Type | Props / Behavior |
|---|---|---|
| `MarkdownContent.vue` | atom | `markdown: string` → sanitized HTML (`DOMPurify.sanitize(marked.parse(markdown))`), `.markdown-body` scoped styles |
| `ProjectCarousel.vue` | molecule | `images: ProjectImage[]`, `alt: string`; prev/next buttons, `--index` counter, first image default; wraps at ends |
| `ProjectCard.vue` | molecule | `project: Project`; thumbnail, name, excerpt, terminal `check details` button → emits `open` |
| `ProjectGrid.vue` | organism | `projects`, `loading`, `error`, `empty` states; renders cards; retry callback |
| skeleton components | atom | pulse/terminal placeholder while loading |
| `ProjectsView` / `ProjectDetailView` | page | wire store → components |

## Error Handling

- Use-case returns `Project | null` for missing id → view renders not-found.
- Store catches data-source failures → `error` state + retry re-invokes the use-case.
- Mapper is defensive: partial DTOs (missing images/markdown) do not throw.

## Testing

Vitest + `@vue/test-utils` (existing setup).

Unit (`src/modules/projects/__tests__/`):

- `project.model.spec.ts` — DTO→model mapping: full shape, missing images/markdown handled
- `get-projects.use-case.spec.ts` — fake repo, returns list
- `get-project-by-id.use-case.spec.ts` — returns project, null on missing id
- `projects.store.spec.ts` — mock data source injected via di: load success sets state + loading lifecycle, failure sets error, detail loads `currentProject`

Component (`src/components/__tests__/`):

- `ProjectCard.spec.ts` — renders name/desc/thumbnail, emits `open` on button click
- `ProjectCarousel.spec.ts` — first image shown, next/prev cycles, wraps, counter updates
- `MarkdownContent.spec.ts` — markdown → HTML, unsafe HTML stripped

Verification: `npm run type-check`, `npm run lint`, `npm run build`, `npm run test:unit`.

## Dependencies Added

- `marked`
- `dompurify` (v3+ ships its own TS types)

## Out of Scope

- Real MicroCMS API integration (HTTP data source scaffold provided, not activated)
- Site-wide visual redesign
- Projects CRUD/admin
