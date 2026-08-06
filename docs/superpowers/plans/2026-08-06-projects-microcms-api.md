# Projects → MicroCMS API Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make MicroCMS the default data source for the Projects feature and fix the store request-sequencing race.

**Architecture:** `di.ts` selects the data source — HTTP by default, mock only when `VITE_USE_MOCK_API === 'true'`. `http-data-source.ts` gets typed JSON responses and a fail-fast guard for missing env vars. `projects.store.ts` `loadProjectDetail` uses a monotonic request token so a stale response can never overwrite a newer one.

**Tech Stack:** Vue 3, TypeScript, Vite 7, Vitest 4, Pinia 3. Env vars via `import.meta.env` (Vite `VITE_` prefix). Bun as package manager.

## Global Constraints

- Work happens on branch `feat/projects`.
- Commands run with `bun` (e.g. `bun vitest run`, `bun run type-check`). If bun unavailable, `npx` equivalents of `vitest`/`vue-tsc` are acceptable.
- `noUncheckedIndexedAccess` is enabled — index access on arrays returns `T | undefined`.
- `.env` is gitignored and holds the real API key. NEVER commit it. `.env.example` carries placeholders only.
- Existing project convention: relative imports inside `src/modules/projects/`; type-only imports use `import type`.
- The API key ships in the client bundle (read-only key, personal portfolio) — known, accepted trade-off. No code changes for this.
- No changes to `types.ts`, domain mappers, or mock data (real API response shape verified identical to existing DTOs).
- No new `http-data-source` unit tests (Approach B, not C). Data-source changes verified by type-check + full suite + manual dev run.

---

### Task 1: Environment configuration

**Files:**
- Modify: `.env`
- Create: `.env.example`

**Interfaces:**
- Consumes: nothing
- Produces: env vars `VITE_MICROCMS_API_KEY`, `VITE_MICROCMS_ENDPOINT` (used by Task 3); documented placeholders in `.env.example`

- [ ] **Step 1: Rewrite `.env`**

Replace the entire contents of `.env` with:

```ini
VITE_MICROCMS_API_KEY="your-microcms-api-key"
VITE_MICROCMS_ENDPOINT="https://porfolio-septaalfauzan.microcms.io/api/v1"
```

The old line `X-MICROCMS-API-KEY="..."` must be removed — Vite only exposes `VITE_`-prefixed vars, and the data source reads `VITE_MICROCMS_API_KEY`.

- [ ] **Step 2: Create `.env.example`**

Create `.env.example` at repo root with:

```ini
# MicroCMS read-only API key (never commit the real value)
VITE_MICROCMS_API_KEY="your-microcms-api-key"
# MicroCMS Content API base URL — v1 path, WITHOUT the /projects suffix
VITE_MICROCMS_ENDPOINT="https://your-service.microcms.io/api/v1"
```

- [ ] **Step 3: Verify**

Run: `cat .env` — must show exactly the two `VITE_` lines, no `X-MICROCMS-API-KEY`.
Run: `git status --short` — must NOT list `.env` (gitignored); must list `.env.example` as untracked.

- [ ] **Step 4: Commit**

```bash
git add .env.example
git commit -m "chore: document MicroCMS env vars in .env.example"
```

`.env` is intentionally NOT added (gitignored, contains the secret).

---

### Task 2: HTTP default in dependency injection

**Files:**
- Modify: `src/modules/projects/presentation/di.ts`

**Interfaces:**
- Consumes: `import.meta.env.VITE_USE_MOCK_API` (unset → HTTP)
- Produces: unchanged exports `getProjectsUseCase`, `getProjectByIdUseCase` (consumed by Task 4's store spec via its existing `vi.mock('../presentation/di')`)

- [ ] **Step 1: Write the failing test**

There is no new test for this task — `di.ts` is module-mocked in the store spec (`vi.mock('../presentation/di', ...)`), and the selection logic is a one-line env check. Verification is the full existing suite still passing with HTTP as default (proves the store never depended on mock behavior).

- [ ] **Step 2: Run the suite to confirm green baseline before the change**

Run: `bun vitest run`
Expected: all tests pass (10 files, 23+ tests).

- [ ] **Step 3: Flip the default in `di.ts`**

Replace the selection lines in `src/modules/projects/presentation/di.ts`:

```ts
const useHttpApi = import.meta.env.VITE_USE_HTTP_API === 'true'
const dataSource = useHttpApi ? new HttpProjectDataSource() : new MockProjectDataSource()
```

with:

```ts
const useMockApi = import.meta.env.VITE_USE_MOCK_API === 'true'
const dataSource = useMockApi ? new MockProjectDataSource() : new HttpProjectDataSource()
```

- [ ] **Step 4: Verify tests + type-check**

Run: `bun vitest run` — expected all pass.
Run: `bun run type-check` — expected clean (no errors).

- [ ] **Step 5: Commit**

```bash
git add src/modules/projects/presentation/di.ts
git commit -m "feat: make MicroCMS HTTP data source the default"
```

---

### Task 3: Harden HTTP data source

**Files:**
- Modify: `src/modules/projects/data/http-data-source.ts`

**Interfaces:**
- Consumes: env vars `VITE_MICROCMS_ENDPOINT`, `VITE_MICROCMS_API_KEY` (from Task 1); types `ProjectDataSource`, `ProjectDto`, `ProjectsResponseDto` (existing)
- Produces: same class `HttpProjectDataSource` with `fetchProjects(): Promise<ProjectsResponseDto>` and `fetchProjectById(id: string): Promise<ProjectDto | null>` — unchanged signatures, now with typed JSON + module-level env guard. Consumed by `di.ts` (Task 2).

- [ ] **Step 1: Write the failing test**

No new unit test (Approach B excludes data-source tests — see Global Constraints). The behavior change is verified by type-check (typed casts compile) and the dev run in the final verification task.

- [ ] **Step 2: Replace the whole file body**

Replace the entire contents of `src/modules/projects/data/http-data-source.ts`:

```ts
import type { ProjectDataSource } from './project-data-source'
import type { ProjectDto, ProjectsResponseDto } from './types'

const ENDPOINT = import.meta.env.VITE_MICROCMS_ENDPOINT
const API_KEY = import.meta.env.VITE_MICROCMS_API_KEY

if (!ENDPOINT || !API_KEY) {
  throw new Error(
    'Missing MicroCMS configuration: VITE_MICROCMS_ENDPOINT and VITE_MICROCMS_API_KEY must be set',
  )
}

export class HttpProjectDataSource implements ProjectDataSource {
  async fetchProjects(): Promise<ProjectsResponseDto> {
    const res = await fetch(`${ENDPOINT}/projects`, {
      headers: { 'X-MICROCMS-API-KEY': API_KEY },
    })
    if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`)
    return (await res.json()) as ProjectsResponseDto
  }

  async fetchProjectById(id: string): Promise<ProjectDto | null> {
    const res = await fetch(`${ENDPOINT}/projects/${id}`, {
      headers: { 'X-MICROCMS-API-KEY': API_KEY },
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`)
    return (await res.json()) as ProjectDto
  }
}
```

- [ ] **Step 3: Verify type-check + suite**

Run: `bun run type-check` — expected clean.
Run: `bun vitest run` — expected all pass (existing tests untouched, http-data-source not imported by any test).

- [ ] **Step 4: Commit**

```bash
git add src/modules/projects/data/http-data-source.ts
git commit -m "refactor: type JSON responses and guard missing MicroCMS env vars"
```

---

### Task 4: Fix store request-sequencing race

**Files:**
- Modify: `src/modules/projects/presentation/projects.store.ts`
- Test: `src/modules/projects/__tests__/projects.store.spec.ts`

**Interfaces:**
- Consumes: `getProjectByIdUseCase.execute(id: string): Promise<Project | null>` (via existing `di.ts` mock in the spec); `Project` type from `../domain/project.model`
- Produces: unchanged store API (`loadProjects`, `loadProjectDetail`, `clearError`, state refs `projects`, `currentProject`, `loading`, `error`) — behavior change only: latest request wins

- [ ] **Step 1: Write the failing test**

Append this test to `src/modules/projects/__tests__/projects.store.spec.ts` (after the existing `keeps currentProject null when detail is missing` test):

```ts
it('keeps the latest requested project when requests resolve out of order', async () => {
  let resolveFirst!: (p: Project | null) => void
  let resolveSecond!: (p: Project | null) => void
  mockedDetail
    .mockImplementationOnce(() => new Promise<Project | null>((r) => { resolveFirst = r }))
    .mockImplementationOnce(() => new Promise<Project | null>((r) => { resolveSecond = r }))
  const store = useProjectsStore()

  const first = store.loadProjectDetail('first')
  const second = store.loadProjectDetail('second')

  resolveSecond({ ...project, id: 'second' })
  await second
  resolveFirst({ ...project, id: 'first' })
  await first

  expect(store.currentProject?.id).toBe('second')
  expect(store.loading).toBe(false)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun vitest run src/modules/projects/__tests__/projects.store.spec.ts -t "out of order"`
Expected: FAIL — `currentProject?.id` is `'first'`, not `'second'` (stale response overwrote the newer one).

- [ ] **Step 3: Implement the fix**

Add a module-scope counter above `loadProjectDetail` and gate every state write on it in `src/modules/projects/presentation/projects.store.ts`:

```ts
  let detailRequestSeq = 0

  async function loadProjectDetail(id: string) {
    const seq = ++detailRequestSeq
    loading.value = true
    error.value = null
    currentProject.value = null
    try {
      const project = await getProjectByIdUseCase.execute(id)
      if (seq !== detailRequestSeq) return
      currentProject.value = project
    } catch (e) {
      if (seq !== detailRequestSeq) return
      error.value = e instanceof Error ? e.message : 'Failed to load project'
    } finally {
      if (seq === detailRequestSeq) loading.value = false
    }
  }
```

Place `let detailRequestSeq = 0` immediately before the `loadProjectDetail` function declaration (inside the store setup function body, alongside the existing `ref` declarations).

- [ ] **Step 4: Run the store spec to verify it passes**

Run: `bun vitest run src/modules/projects/__tests__/projects.store.spec.ts`
Expected: all 6 store tests pass (4 existing + new out-of-order test + the new assertion is inside the same added test — the file goes from 4 to 5 `it` blocks).

- [ ] **Step 5: Run full suite + type-check**

Run: `bun vitest run` — expected all pass.
Run: `bun run type-check` — expected clean.

- [ ] **Step 6: Commit**

```bash
git add src/modules/projects/presentation/projects.store.ts src/modules/projects/__tests__/projects.store.spec.ts
git commit -m "fix: latest-request-wins in loadProjectDetail to prevent stale overwrite"
```

---

### Task 5: Final verification

**Files:**
- No source changes

**Interfaces:**
- Consumes: all completed tasks

- [ ] **Step 1: Full gate**

Run, in order, and confirm each passes:

```bash
bun vitest run
bun run type-check
bun run build
bun run lint
```

Expected: all tests pass; type-check clean; build succeeds; lint 0 errors / 0 warnings.

- [ ] **Step 2: Manual dev run against real API**

Run: `bun run dev` (or `npm run dev`).
Open the app and verify:
1. `/projects` renders the live project(s) from MicroCMS (currently 1 dummy project) — NOT mock data.
2. Clicking `check details` opens `/projects/{id}` and shows the detail page with carousel images.
3. Navigate to a nonexistent id (e.g. `/projects/not-a-real-id`) — shows the missing/error state, no crash.
4. Confirm in browser Network tab: requests go to `https://porfolio-septaalfauzan.microcms.io/api/v1/projects/...` with the `X-MICROCMS-API-KEY` header.

- [ ] **Step 3: Close the loop in the SDD ledger**

Append to `.superpowers/sdd/progress.md`:

```
## 2026-08-06 MicroCMS API wiring complete
- HTTP default via di.ts (VITE_USE_MOCK_API opt-out)
- http-data-source: typed json + env guard
- loadProjectDetail race fixed (latest-request-wins) + test
- Spec: docs/superpowers/specs/2026-08-06-projects-microcms-api-design.md
```
