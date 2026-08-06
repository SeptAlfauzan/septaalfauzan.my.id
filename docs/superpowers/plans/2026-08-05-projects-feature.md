# Projects Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/projects` list page and `/projects/:id` detail page with layered data/repository/use-case/store architecture, mock data now, swappable to MicroCMS HTTP later.

**Architecture:** Feature module `src/modules/projects/` with one-way dependency chain: Pinia store → use-case → repository → data source (mock/HTTP). Interfaces at data-source and repository boundaries. Domain model mapped from DTOs. Markdown rendered via `marked` + `DOMPurify`.

**Tech Stack:** Vue 3 (`<script setup lang="ts">`), Pinia, Vue Router 5, Vite 7, Vitest 4 + `@vue/test-utils`, bun, terminal.css. New deps: `marked`, `dompurify`.

## Global Constraints

- Path alias: `@/*` → `./src/*`. Prefer `@/` imports inside `src/`.
- `noUncheckedIndexedAccess` is ON — array/indexed access may return `undefined`; guard it.
- Tests live in `__tests__/` dirs (excluded from `vue-tsc --build`; run via vitest).
- Commands:
  - Unit tests (single file): `npx vitest run <path>`
  - Full unit: `npx vitest run`
  - Type-check: `npm run type-check`
  - Lint: `npm run lint` (auto-fixes)
  - Build: `npm run build`
- Package manager: bun. Install with `bun add marked dompurify`.
- UI: terminal aesthetic. Use `terminal.css` classes `terminal-card`, `btn btn-default`. Accent color `#1a95e1`. Terminal-styled button label is `check details`.
- DTO field names come straight from the API (camelCase, MicroCMS style). Domain model uses short names (`projectName` → `name`, `projectDesc` → `description`).
- No new dependencies beyond `marked` and `dompurify`.

## File Structure

```
src/modules/projects/
  data/
    types.ts                       # DTO types mirroring API JSON
    mock-data.ts                   # 3 mock projects (DTO shape)
    project-data-source.ts         # ProjectDataSource interface
    mock-data-source.ts            # MockProjectDataSource (400ms delay)
    http-data-source.ts            # HttpProjectDataSource (unused by default)
  domain/
    project.model.ts               # Project model + fromDto mapper
    project.repository.ts          # ProjectRepository interface + ProjectRepositoryImpl
    use-cases/
      get-projects.use-case.ts     # GetProjectsUseCase
      get-project-by-id.use-case.ts# GetProjectByIdUseCase
  presentation/
    di.ts                          # composition root (mock default, env flag for HTTP)
    projects.store.ts              # Pinia store (viewmodel)
    components/
      MarkdownContent.vue
      ProjectCarousel.vue
      ProjectCard.vue
      ProjectGrid.vue
    __tests__/
      MarkdownContent.spec.ts
      ProjectCarousel.spec.ts
      ProjectCard.spec.ts
      ProjectGrid.spec.ts
  __tests__/
    project.model.spec.ts
    mock-data-source.spec.ts
    get-projects.use-case.spec.ts
    get-project-by-id.use-case.spec.ts
    projects.store.spec.ts
src/views/
  ProjectsView.vue                 # /projects
  ProjectDetailView.vue            # /projects/:id
```

Modified: `src/router/index.ts` (2 routes), `src/App.vue` (nav link).

---

### Task 1: Install deps + data layer

**Files:**
- Create: `src/modules/projects/data/types.ts`
- Create: `src/modules/projects/data/mock-data.ts`
- Create: `src/modules/projects/data/project-data-source.ts`
- Create: `src/modules/projects/data/mock-data-source.ts`
- Create: `src/modules/projects/data/http-data-source.ts`
- Test: `src/modules/projects/__tests__/mock-data-source.spec.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `ProjectImage`, `ProjectImages`, `ProjectDto`, `ProjectsResponseDto` (from `data/types.ts`)
  - `ProjectDataSource` interface: `fetchProjects(): Promise<ProjectsResponseDto>`, `fetchProjectById(id: string): Promise<ProjectDto | null>`
  - `MockProjectDataSource implements ProjectDataSource`
  - `HttpProjectDataSource implements ProjectDataSource`

- [ ] **Step 1: Install dependencies**

```bash
bun add marked dompurify
```

Expected: adds `marked` + `dompurify` to `package.json` deps.

- [ ] **Step 2: Write the failing test**

`src/modules/projects/__tests__/mock-data-source.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { MockProjectDataSource } from '../data/mock-data-source'

describe('MockProjectDataSource', () => {
  it('fetches a project list response', async () => {
    const ds = new MockProjectDataSource()
    const response = await ds.fetchProjects()
    expect(response.totalCount).toBeGreaterThan(0)
    expect(response.contents[0]?.projectName).toBeTruthy()
  })

  it('returns null for an unknown id', async () => {
    const ds = new MockProjectDataSource()
    expect(await ds.fetchProjectById('does-not-exist')).toBeNull()
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/modules/projects/__tests__/mock-data-source.spec.ts`
Expected: FAIL — module `../data/mock-data-source` does not exist.

- [ ] **Step 4: Write `data/types.ts`**

```ts
export interface ProjectImage {
  url: string
  height: number
  width: number
}

export interface ProjectImages {
  fieldId: string
  images: ProjectImage[]
}

export interface ProjectDto {
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

export interface ProjectsResponseDto {
  contents: ProjectDto[]
  totalCount: number
  offset: number
  limit: number
}
```

- [ ] **Step 5: Write `data/mock-data.ts`**

Three projects. First is the real API sample verbatim; two are portfolio-plausible fakes.

```ts
import type { ProjectDto } from './types'

export const mockProjects: ProjectDto[] = [
  {
    id: '8_ak9spxa08c',
    createdAt: '2026-08-05T10:26:23.766Z',
    updatedAt: '2026-08-05T10:26:23.766Z',
    publishedAt: '2026-08-05T10:26:23.766Z',
    revisedAt: '2026-08-05T10:26:23.766Z',
    projectName: 'dummy',
    projectDesc:
      'lorem ipsum doaLorem ipsum dolor sit amet, duis aliquip aliqua ad velit. Duis anim sed aute in ullamco tempor minim cupidatat id do. Cillum qui enim incididunt deserunt laboris in id et in proident sunt. Commodo sed qui pariatur nulla in ut cillum voluptate est incididunt dolore sunt. Aliquip cillum mollit id fugiat velit eiusmod cupidatat in deserunt in excepteur.\n\nIncididunt quis consequat quis nulla irure anim officia aliqua in in. Labore dolore aliquip culpa ut quis tempor pariatur proident deserunt. Magna ut excepteur anim consectetur culpa labore pariatur in sunt enim aute ea. Ut nisi voluptate dolor magna laboris labore commodo pariatur proident.\n\nDolore id veniam eiusmod fugiat in ut cupidatat aliquip quis. Ut duis excepteur incididunt proident quis nostrud culpa. Tempor excepteur pariatur reprehenderit esse veniam esse duis ex in. Et in irure irure duis ad nisi magna irure. Ad irure ea duis culpa nulla occaecat velit. Nulla in ut nulla ut laboris consequat non magna velit reprehenderit in.',
    markdownAdditionals:
      '# Useful Links\n\n## 📱 Google Play Store\nDownload the app here:\nhttps://play.google.com/store/apps/details?id=com.example.myapp\n\n## 💬 Reddit Discussion\nJoin the discussion:\nhttps://www.reddit.com/r/androiddev/comments/abcdef/example_post_title/\n\n## Alternative Markdown Format\n\n- **Play Store:** <https://play.google.com/store/apps/details?id=com.example.myapp>\n- **Reddit:** <https://www.reddit.com/r/androiddev/comments/abcdef/example_post_title/>',
    images: {
      fieldId: 'carouselImages',
      images: [
        {
          url: 'https://images.microcms-assets.io/assets/da58f335d548467a9a561bf3a1f9438c/74067a2485f64a5f93e84c4596effb78/feature-graphic%20(1).png',
          height: 500,
          width: 1024,
        },
        {
          url: 'https://images.microcms-assets.io/assets/da58f335d548467a9a561bf3a1f9438c/0a5144b79d384e33812558e9cf42d7d2/virgil.jpeg',
          height: 358,
          width: 637,
        },
      ],
    },
  },
  {
    id: 'proj_hris',
    createdAt: '2025-01-15T08:00:00.000Z',
    updatedAt: '2025-06-01T08:00:00.000Z',
    publishedAt: '2025-03-10T08:00:00.000Z',
    revisedAt: '2025-06-01T08:00:00.000Z',
    projectName: 'HRIS Mobile Platform',
    projectDesc:
      'End-to-end HRIS mobile system covering attendance, payroll, and employee workflows. Handled the full lifecycle from requirements through CI/CD to Play Store and App Store deployment, reducing manual operations through digitalization of internal business processes.',
    markdownAdditionals:
      '# Useful Links\n\n## 🏢 Company\n- **Official Site:** https://example.com/hris\n\n## 🔧 Features\n- Attendance tracking with geolocation\n- Payroll review and payslip history\n- Employee leave management\n- Push notification reminders',
    images: {
      fieldId: 'carouselImages',
      images: [
        { url: 'https://picsum.photos/seed/hris-1/1024/500', height: 500, width: 1024 },
        { url: 'https://picsum.photos/seed/hris-2/637/358', height: 358, width: 637 },
      ],
    },
  },
  {
    id: 'proj_iot',
    createdAt: '2024-06-01T08:00:00.000Z',
    updatedAt: '2024-11-20T08:00:00.000Z',
    publishedAt: '2024-08-15T08:00:00.000Z',
    revisedAt: '2024-11-20T08:00:00.000Z',
    projectName: 'Smart Greenhouse IoT',
    projectDesc:
      'IoT smart greenhouse app for Bank Indonesia with real-time sensor monitoring. Integrated WebSocket for live telemetry, reducing latency and connection drops while enabling remote greenhouse control from a mobile app.',
    markdownAdditionals:
      '# Useful Links\n\n## 🌱 Project Demo\n- **Live Demo:** https://example.com/greenhouse\n- **GitHub:** https://github.com/septAlfauzan/smart-greenhouse\n\n## 📊 Tech Stack\n- Flutter\n- WebSocket\n- MQTT / IoT sensors',
    images: {
      fieldId: 'carouselImages',
      images: [
        { url: 'https://picsum.photos/seed/greenhouse-1/1024/500', height: 500, width: 1024 },
        { url: 'https://picsum.photos/seed/greenhouse-2/637/358', height: 358, width: 637 },
      ],
    },
  },
]
```

- [ ] **Step 6: Write `data/project-data-source.ts`**

```ts
import type { ProjectDto, ProjectsResponseDto } from './types'

export interface ProjectDataSource {
  fetchProjects(): Promise<ProjectsResponseDto>
  fetchProjectById(id: string): Promise<ProjectDto | null>
}
```

- [ ] **Step 7: Write `data/mock-data-source.ts`**

```ts
import { mockProjects } from './mock-data'
import type { ProjectDataSource } from './project-data-source'
import type { ProjectDto, ProjectsResponseDto } from './types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class MockProjectDataSource implements ProjectDataSource {
  async fetchProjects(): Promise<ProjectsResponseDto> {
    await delay(400)
    return {
      contents: mockProjects,
      totalCount: mockProjects.length,
      offset: 0,
      limit: 10,
    }
  }

  async fetchProjectById(id: string): Promise<ProjectDto | null> {
    await delay(400)
    return mockProjects.find((p) => p.id === id) ?? null
  }
}
```

- [ ] **Step 8: Write `data/http-data-source.ts`** (scaffold — unused by default)

```ts
import type { ProjectDataSource } from './project-data-source'
import type { ProjectDto, ProjectsResponseDto } from './types'

const ENDPOINT = import.meta.env.VITE_MICROCMS_ENDPOINT
const API_KEY = import.meta.env.VITE_MICROCMS_API_KEY

export class HttpProjectDataSource implements ProjectDataSource {
  async fetchProjects(): Promise<ProjectsResponseDto> {
    const res = await fetch(`${ENDPOINT}/projects`, {
      headers: { 'X-MICROCMS-API-KEY': API_KEY },
    })
    if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`)
    return res.json()
  }

  async fetchProjectById(id: string): Promise<ProjectDto | null> {
    const res = await fetch(`${ENDPOINT}/projects/${id}`, {
      headers: { 'X-MICROCMS-API-KEY': API_KEY },
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`)
    return res.json()
  }
}
```

- [ ] **Step 9: Run tests to verify they pass**

Run: `npx vitest run src/modules/projects/__tests__/mock-data-source.spec.ts`
Expected: 2 passing.

- [ ] **Step 10: Type-check + commit**

```bash
npm run type-check
git add src/modules/projects
git commit -m "feat: add projects data layer with mock and http data sources"
```

Expected: type-check passes (no errors), commit succeeds.

---

### Task 2: Domain model + mapper

**Files:**
- Create: `src/modules/projects/domain/project.model.ts`
- Test: `src/modules/projects/__tests__/project.model.spec.ts`

**Interfaces:**
- Consumes: `ProjectDto`, `ProjectImage` from `data/types.ts` (Task 1).
- Produces:
  - `interface Project { id: string; createdAt: string; publishedAt: string; name: string; description: string; markdownAdditionals: string; images: ProjectImage[] }`
  - `fromDto(dto: ProjectDto): Project`

- [ ] **Step 1: Write the failing test**

`src/modules/projects/__tests__/project.model.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { fromDto } from '../domain/project.model'
import type { ProjectDto } from '../data/types'

const baseDto: ProjectDto = {
  id: 'p1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  publishedAt: '2026-01-02T00:00:00.000Z',
  revisedAt: '2026-01-01T00:00:00.000Z',
  projectName: 'Dummy',
  projectDesc: 'Description here',
  markdownAdditionals: '# Links',
  images: {
    fieldId: 'carouselImages',
    images: [{ url: 'https://example.com/a.png', height: 500, width: 1024 }],
  },
}

describe('fromDto', () => {
  it('maps a full DTO to the Project model', () => {
    expect(fromDto(baseDto)).toEqual({
      id: 'p1',
      createdAt: '2026-01-01T00:00:00.000Z',
      publishedAt: '2026-01-02T00:00:00.000Z',
      name: 'Dummy',
      description: 'Description here',
      markdownAdditionals: '# Links',
      images: [{ url: 'https://example.com/a.png', height: 500, width: 1024 }],
    })
  })

  it('defaults missing optional fields', () => {
    const partial = {
      ...baseDto,
      markdownAdditionals: undefined,
      images: undefined,
    } as unknown as ProjectDto

    const project = fromDto(partial)
    expect(project.markdownAdditionals).toBe('')
    expect(project.images).toEqual([])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/modules/projects/__tests__/project.model.spec.ts`
Expected: FAIL — module `../domain/project.model` does not exist.

- [ ] **Step 3: Write `domain/project.model.ts`**

```ts
import type { ProjectDto, ProjectImage } from '../data/types'

export interface Project {
  id: string
  createdAt: string
  publishedAt: string
  name: string
  description: string
  markdownAdditionals: string
  images: ProjectImage[]
}

export function fromDto(dto: ProjectDto): Project {
  return {
    id: dto.id,
    createdAt: dto.createdAt,
    publishedAt: dto.publishedAt,
    name: dto.projectName,
    description: dto.projectDesc,
    markdownAdditionals: dto.markdownAdditionals ?? '',
    images: dto.images?.images ?? [],
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/modules/projects/__tests__/project.model.spec.ts`
Expected: 2 passing.

- [ ] **Step 5: Type-check + commit**

```bash
npm run type-check
git add src/modules/projects/domain src/modules/projects/__tests__/project.model.spec.ts
git commit -m "feat: add Project domain model and DTO mapper"
```

Expected: type-check passes, commit succeeds.

---

### Task 3: Repository + use-cases

**Files:**
- Create: `src/modules/projects/domain/project.repository.ts`
- Create: `src/modules/projects/domain/use-cases/get-projects.use-case.ts`
- Create: `src/modules/projects/domain/use-cases/get-project-by-id.use-case.ts`
- Test: `src/modules/projects/__tests__/get-projects.use-case.spec.ts`
- Test: `src/modules/projects/__tests__/get-project-by-id.use-case.spec.ts`

**Interfaces:**
- Consumes: `Project`, `fromDto` (Task 2); `ProjectDataSource` (Task 1).
- Produces:
  - `interface ProjectRepository { getProjects(): Promise<Project[]>; getProjectById(id: string): Promise<Project | null> }`
  - `class ProjectRepositoryImpl implements ProjectRepository` — constructor `(dataSource: ProjectDataSource)`.
  - `class GetProjectsUseCase` — constructor `(repository: ProjectRepository)`, method `execute(): Promise<Project[]>` (sorts by `publishedAt` descending).
  - `class GetProjectByIdUseCase` — constructor `(repository: ProjectRepository)`, method `execute(id: string): Promise<Project | null>`.

- [ ] **Step 1: Write the failing tests**

`src/modules/projects/__tests__/get-projects.use-case.spec.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'
import { GetProjectsUseCase } from '../domain/use-cases/get-projects.use-case'
import type { ProjectRepository } from '../domain/project.repository'
import type { Project } from '../domain/project.model'

const makeProject = (id: string, publishedAt: string): Project => ({
  id,
  createdAt: '',
  publishedAt,
  name: id,
  description: '',
  markdownAdditionals: '',
  images: [],
})

describe('GetProjectsUseCase', () => {
  it('returns projects sorted newest first', async () => {
    const repository: ProjectRepository = {
      getProjects: vi.fn().mockResolvedValue([
        makeProject('old', '2025-01-01T00:00:00.000Z'),
        makeProject('new', '2026-01-01T00:00:00.000Z'),
      ]),
      getProjectById: vi.fn(),
    }

    const useCase = new GetProjectsUseCase(repository)
    const result = await useCase.execute()

    expect(result.map((p) => p.id)).toEqual(['new', 'old'])
  })
})
```

`src/modules/projects/__tests__/get-project-by-id.use-case.spec.ts`:

```ts
import { describe, it, expect, vi } from 'vitest'
import { GetProjectByIdUseCase } from '../domain/use-cases/get-project-by-id.use-case'
import type { ProjectRepository } from '../domain/project.repository'
import type { Project } from '../domain/project.model'

const project: Project = {
  id: 'p1',
  createdAt: '',
  publishedAt: '',
  name: 'Dummy',
  description: '',
  markdownAdditionals: '',
  images: [],
}

describe('GetProjectByIdUseCase', () => {
  it('returns the project for a known id', async () => {
    const repository: ProjectRepository = {
      getProjects: vi.fn(),
      getProjectById: vi.fn().mockResolvedValue(project),
    }

    const useCase = new GetProjectByIdUseCase(repository)
    expect(await useCase.execute('p1')).toEqual(project)
  })

  it('returns null for an unknown id', async () => {
    const repository: ProjectRepository = {
      getProjects: vi.fn(),
      getProjectById: vi.fn().mockResolvedValue(null),
    }

    const useCase = new GetProjectByIdUseCase(repository)
    expect(await useCase.execute('missing')).toBeNull()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run:
```bash
npx vitest run src/modules/projects/__tests__/get-projects.use-case.spec.ts
npx vitest run src/modules/projects/__tests__/get-project-by-id.use-case.spec.ts
```
Expected: FAIL — modules `../domain/use-cases/*` do not exist.

- [ ] **Step 3: Write `domain/project.repository.ts`**

```ts
import type { ProjectDataSource } from '../data/project-data-source'
import { fromDto, type Project } from './project.model'

export interface ProjectRepository {
  getProjects(): Promise<Project[]>
  getProjectById(id: string): Promise<Project | null>
}

export class ProjectRepositoryImpl implements ProjectRepository {
  constructor(private readonly dataSource: ProjectDataSource) {}

  async getProjects(): Promise<Project[]> {
    const response = await this.dataSource.fetchProjects()
    return response.contents.map(fromDto)
  }

  async getProjectById(id: string): Promise<Project | null> {
    const dto = await this.dataSource.fetchProjectById(id)
    return dto ? fromDto(dto) : null
  }
}
```

- [ ] **Step 4: Write `domain/use-cases/get-projects.use-case.ts`**

```ts
import type { Project } from '../project.model'
import type { ProjectRepository } from '../project.repository'

export class GetProjectsUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(): Promise<Project[]> {
    const projects = await this.repository.getProjects()
    return projects.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  }
}
```

- [ ] **Step 5: Write `domain/use-cases/get-project-by-id.use-case.ts`**

```ts
import type { Project } from '../project.model'
import type { ProjectRepository } from '../project.repository'

export class GetProjectByIdUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(id: string): Promise<Project | null> {
    return this.repository.getProjectById(id)
  }
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run:
```bash
npx vitest run src/modules/projects/__tests__/get-projects.use-case.spec.ts
npx vitest run src/modules/projects/__tests__/get-project-by-id.use-case.spec.ts
```
Expected: 1 passing, then 2 passing.

- [ ] **Step 7: Type-check + commit**

```bash
npm run type-check
git add src/modules/projects/domain
git commit -m "feat: add projects repository and use cases"
```

Expected: type-check passes, commit succeeds.

---

### Task 4: Composition root + Pinia store

**Files:**
- Create: `src/modules/projects/presentation/di.ts`
- Create: `src/modules/projects/presentation/projects.store.ts`
- Test: `src/modules/projects/__tests__/projects.store.spec.ts`

**Interfaces:**
- Consumes: `MockProjectDataSource`, `HttpProjectDataSource`, `ProjectRepositoryImpl`, `GetProjectsUseCase`, `GetProjectByIdUseCase`, `Project` (Tasks 1–3).
- Produces:
  - `di.ts` exports singletons `getProjectsUseCase: GetProjectsUseCase`, `getProjectByIdUseCase: GetProjectByIdUseCase`.
  - Store (`useProjectsStore`) state: `projects: Project[]`, `currentProject: Project | null`, `loading: boolean`, `error: string | null`; actions: `loadProjects()`, `loadProjectDetail(id: string)`, `clearError()`.

- [ ] **Step 1: Write the failing test**

`src/modules/projects/__tests__/projects.store.spec.ts`:

```ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('../presentation/di', () => ({
  getProjectsUseCase: { execute: vi.fn() },
  getProjectByIdUseCase: { execute: vi.fn() },
}))

import { useProjectsStore } from '../presentation/projects.store'
import { getProjectsUseCase, getProjectByIdUseCase } from '../presentation/di'
import type { Project } from '../domain/project.model'

const mockedList = vi.mocked(getProjectsUseCase.execute)
const mockedDetail = vi.mocked(getProjectByIdUseCase.execute)

const project: Project = {
  id: 'p1',
  createdAt: '',
  publishedAt: '',
  name: 'Dummy',
  description: 'desc',
  markdownAdditionals: '# x',
  images: [],
}

describe('projects store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('loads projects into state', async () => {
    mockedList.mockResolvedValue([project])
    const store = useProjectsStore()

    await store.loadProjects()

    expect(store.projects).toEqual([project])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('sets error and clears loading when load fails', async () => {
    mockedList.mockRejectedValue(new Error('boom'))
    const store = useProjectsStore()

    await store.loadProjects()

    expect(store.error).toBe('boom')
    expect(store.loading).toBe(false)
  })

  it('loads a project detail', async () => {
    mockedDetail.mockResolvedValue(project)
    const store = useProjectsStore()

    await store.loadProjectDetail('p1')

    expect(store.currentProject).toEqual(project)
  })

  it('keeps currentProject null when detail is missing', async () => {
    mockedDetail.mockResolvedValue(null)
    const store = useProjectsStore()

    await store.loadProjectDetail('missing')

    expect(store.currentProject).toBeNull()
    expect(store.error).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/modules/projects/__tests__/projects.store.spec.ts`
Expected: FAIL — module `../presentation/di` does not exist.

- [ ] **Step 3: Write `presentation/di.ts`**

```ts
import { HttpProjectDataSource } from '../data/http-data-source'
import { MockProjectDataSource } from '../data/mock-data-source'
import { ProjectRepositoryImpl } from '../domain/project.repository'
import { GetProjectByIdUseCase } from '../domain/use-cases/get-project-by-id.use-case'
import { GetProjectsUseCase } from '../domain/use-cases/get-projects.use-case'

const useHttpApi = import.meta.env.VITE_USE_HTTP_API === 'true'
const dataSource = useHttpApi ? new HttpProjectDataSource() : new MockProjectDataSource()
const repository = new ProjectRepositoryImpl(dataSource)

export const getProjectsUseCase = new GetProjectsUseCase(repository)
export const getProjectByIdUseCase = new GetProjectByIdUseCase(repository)
```

- [ ] **Step 4: Write `presentation/projects.store.ts`**

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Project } from '../domain/project.model'
import { getProjectByIdUseCase, getProjectsUseCase } from './di'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadProjects() {
    loading.value = true
    error.value = null
    try {
      projects.value = await getProjectsUseCase.execute()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load projects'
    } finally {
      loading.value = false
    }
  }

  async function loadProjectDetail(id: string) {
    loading.value = true
    error.value = null
    currentProject.value = null
    try {
      currentProject.value = await getProjectByIdUseCase.execute(id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load project'
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    projects,
    currentProject,
    loading,
    error,
    loadProjects,
    loadProjectDetail,
    clearError,
  }
})
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/modules/projects/__tests__/projects.store.spec.ts`
Expected: 4 passing.

- [ ] **Step 6: Type-check + commit**

```bash
npm run type-check
git add src/modules/projects/presentation/di.ts src/modules/projects/presentation/projects.store.ts src/modules/projects/__tests__/projects.store.spec.ts
git commit -m "feat: add projects composition root and Pinia store"
```

Expected: type-check passes, commit succeeds.

---

### Task 5: MarkdownContent component

**Files:**
- Create: `src/modules/projects/presentation/components/MarkdownContent.vue`
- Test: `src/modules/projects/presentation/__tests__/MarkdownContent.spec.ts`

**Interfaces:**
- Consumes: nothing (marked + dompurify).
- Produces: `MarkdownContent` — prop `markdown: string`, renders sanitized HTML inside `.markdown-body`.

- [ ] **Step 1: Write the failing test**

`src/modules/projects/presentation/__tests__/MarkdownContent.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MarkdownContent from '../components/MarkdownContent.vue'

describe('MarkdownContent', () => {
  it('renders markdown as HTML', () => {
    const wrapper = mount(MarkdownContent, {
      props: { markdown: '# Title\n\nA paragraph with **bold**.' },
    })

    expect(wrapper.find('.markdown-body h1').text()).toBe('Title')
    expect(wrapper.html()).toContain('<strong>bold</strong>')
  })

  it('strips unsafe HTML', () => {
    const wrapper = mount(MarkdownContent, {
      props: { markdown: '<script>alert("x")</script>Safe' },
    })

    expect(wrapper.find('script').exists()).toBe(false)
    expect(wrapper.text()).toContain('Safe')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/modules/projects/presentation/__tests__/MarkdownContent.spec.ts`
Expected: FAIL — module `../components/MarkdownContent.vue` does not exist.

- [ ] **Step 3: Write `MarkdownContent.vue`**

```vue
<script setup lang="ts">
import { computed } from 'vue'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

const props = defineProps<{ markdown: string }>()

const html = computed(() =>
  DOMPurify.sanitize(marked.parse(props.markdown, { async: false }) as string),
)
</script>

<template>
  <div class="markdown-body" v-html="html" />
</template>

<style scoped>
.markdown-body {
  margin-top: 1.5rem;
  line-height: 1.6;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3) {
  margin: 1rem 0 0.5rem;
}

.markdown-body :deep(h2) {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.25rem;
}

.markdown-body :deep(a) {
  color: #1a95e1;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.5rem;
}

.markdown-body :deep(code) {
  background: rgba(181, 222, 255, 0.15);
  padding: 0.125rem 0.25rem;
}
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/modules/projects/presentation/__tests__/MarkdownContent.spec.ts`
Expected: 2 passing.

- [ ] **Step 5: Type-check + commit**

```bash
npm run type-check
git add src/modules/projects/presentation/components/MarkdownContent.vue src/modules/projects/presentation/__tests__/MarkdownContent.spec.ts
git commit -m "feat: add MarkdownContent component with marked + DOMPurify"
```

Expected: type-check passes, commit succeeds.

---

### Task 6: ProjectCarousel component

**Files:**
- Create: `src/modules/projects/presentation/components/ProjectCarousel.vue`
- Test: `src/modules/projects/presentation/__tests__/ProjectCarousel.spec.ts`

**Interfaces:**
- Consumes: `ProjectImage` from `data/types.ts` (Task 1).
- Produces: `ProjectCarousel` — props `images: ProjectImage[]`, `alt: string`; prev button (`aria-label="Previous image"`), next button (`aria-label="Next image"`), counter `current / total`, wraps at both ends.

- [ ] **Step 1: Write the failing test**

`src/modules/projects/presentation/__tests__/ProjectCarousel.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectCarousel from '../components/ProjectCarousel.vue'

const images = [
  { url: 'https://example.com/1.png', height: 100, width: 200 },
  { url: 'https://example.com/2.png', height: 100, width: 200 },
]

describe('ProjectCarousel', () => {
  it('shows the first image initially', () => {
    const wrapper = mount(ProjectCarousel, { props: { images, alt: 'Project' } })

    expect(wrapper.find('img').attributes('src')).toBe(images[0]?.url)
    expect(wrapper.text()).toContain('1 / 2')
  })

  it('navigates next and wraps to first', async () => {
    const wrapper = mount(ProjectCarousel, { props: { images, alt: 'Project' } })
    const buttons = wrapper.findAll('button')

    await buttons[1]!.trigger('click')
    expect(wrapper.find('img').attributes('src')).toBe(images[1]?.url)

    await buttons[1]!.trigger('click')
    expect(wrapper.find('img').attributes('src')).toBe(images[0]?.url)
  })

  it('navigates prev and wraps to last', async () => {
    const wrapper = mount(ProjectCarousel, { props: { images, alt: 'Project' } })
    const buttons = wrapper.findAll('button')

    await buttons[0]!.trigger('click')
    expect(wrapper.find('img').attributes('src')).toBe(images[1]?.url)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/modules/projects/presentation/__tests__/ProjectCarousel.spec.ts`
Expected: FAIL — module `../components/ProjectCarousel.vue` does not exist.

- [ ] **Step 3: Write `ProjectCarousel.vue`**

```vue
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ProjectImage } from '@/modules/projects/data/types'

const props = defineProps<{ images: ProjectImage[]; alt: string }>()

const currentIndex = ref(0)

const currentImage = computed(() => props.images[currentIndex.value])

function next() {
  if (props.images.length === 0) return
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

function prev() {
  if (props.images.length === 0) return
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}
</script>

<template>
  <figure v-if="currentImage" class="project-carousel">
    <button
      type="button"
      class="carousel-btn"
      aria-label="Previous image"
      @click="prev"
    >
      ‹
    </button>
    <img :src="currentImage.url" :alt="alt" class="carousel-image" />
    <button
      type="button"
      class="carousel-btn"
      aria-label="Next image"
      @click="next"
    >
      ›
    </button>
    <figcaption class="carousel-counter">
      {{ currentIndex + 1 }} / {{ images.length }}
    </figcaption>
  </figure>
</template>

<style scoped>
.project-carousel {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}

.carousel-image {
  flex: 1;
  min-width: 0;
  max-height: 420px;
  width: 100%;
  object-fit: contain;
}

.carousel-btn {
  flex: 0 0 auto;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}

.carousel-counter {
  text-align: center;
  flex: 0 0 auto;
}
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/modules/projects/presentation/__tests__/ProjectCarousel.spec.ts`
Expected: 3 passing.

- [ ] **Step 5: Type-check + commit**

```bash
npm run type-check
git add src/modules/projects/presentation/components/ProjectCarousel.vue src/modules/projects/presentation/__tests__/ProjectCarousel.spec.ts
git commit -m "feat: add ProjectCarousel component"
```

Expected: type-check passes, commit succeeds.

---

### Task 7: ProjectCard component

**Files:**
- Create: `src/modules/projects/presentation/components/ProjectCard.vue`
- Test: `src/modules/projects/presentation/__tests__/ProjectCard.spec.ts`

**Interfaces:**
- Consumes: `Project` from `domain/project.model.ts` (Task 2).
- Produces: `ProjectCard` — prop `project: Project`; emits `open(id: string)` when the `check details` button is clicked; shows first image thumbnail, name, 2-line-clamped description.

- [ ] **Step 1: Write the failing test**

`src/modules/projects/presentation/__tests__/ProjectCard.spec.ts`:

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

  it('emits open with the project id on check details click', async () => {
    const wrapper = mount(ProjectCard, { props: { project } })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('open')).toEqual([['p1']])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/modules/projects/presentation/__tests__/ProjectCard.spec.ts`
Expected: FAIL — module `../components/ProjectCard.vue` does not exist.

- [ ] **Step 3: Write `ProjectCard.vue`**

```vue
<script setup lang="ts">
import type { Project } from '@/modules/projects/domain/project.model'

defineProps<{ project: Project }>()

const emit = defineEmits<{ open: [id: string] }>()
</script>

<template>
  <article class="terminal-card project-card">
    <img
      v-if="project.images[0]"
      :src="project.images[0].url"
      :alt="project.name"
      class="project-thumb"
    />
    <div class="project-body">
      <h3 class="project-name">{{ project.name }}</h3>
      <p class="project-desc">{{ project.description }}</p>
      <button class="btn btn-default" @click="emit('open', project.id)">
        check details
      </button>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.project-thumb {
  display: block;
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.project-body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  flex: 1;
}

.project-name {
  margin: 0;
}

.project-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-body .btn {
  margin-top: auto;
  align-self: flex-start;
}
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/modules/projects/presentation/__tests__/ProjectCard.spec.ts`
Expected: 2 passing.

- [ ] **Step 5: Type-check + commit**

```bash
npm run type-check
git add src/modules/projects/presentation/components/ProjectCard.vue src/modules/projects/presentation/__tests__/ProjectCard.spec.ts
git commit -m "feat: add ProjectCard component"
```

Expected: type-check passes, commit succeeds.

---

### Task 8: ProjectGrid component

**Files:**
- Create: `src/modules/projects/presentation/components/ProjectGrid.vue`
- Test: `src/modules/projects/presentation/__tests__/ProjectGrid.spec.ts`

**Interfaces:**
- Consumes: `Project`, `ProjectCard` (Tasks 2, 7).
- Produces: `ProjectGrid` — props `projects: Project[]`, `loading: boolean`, `error: string | null`; emits `open(id: string)`, `retry()`. Renders skeleton (loading), error+retry, empty state, or responsive card grid.

- [ ] **Step 1: Write the failing test**

`src/modules/projects/presentation/__tests__/ProjectGrid.spec.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectGrid from '../components/ProjectGrid.vue'
import ProjectCard from '../components/ProjectCard.vue'
import type { Project } from '@/modules/projects/domain/project.model'

const projects: Project[] = [
  {
    id: 'p1',
    createdAt: '',
    publishedAt: '',
    name: 'One',
    description: '',
    markdownAdditionals: '',
    images: [],
  },
]

describe('ProjectGrid', () => {
  it('shows a skeleton while loading', () => {
    const wrapper = mount(ProjectGrid, {
      props: { projects: [], loading: true, error: null },
    })

    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true)
  })

  it('shows the error and emits retry', async () => {
    const wrapper = mount(ProjectGrid, {
      props: { projects: [], loading: false, error: 'boom' },
    })

    expect(wrapper.text()).toContain('boom')
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })

  it('shows an empty state', () => {
    const wrapper = mount(ProjectGrid, {
      props: { projects: [], loading: false, error: null },
    })

    expect(wrapper.text()).toContain('No projects yet')
  })

  it('renders a card per project and forwards open', async () => {
    const wrapper = mount(ProjectGrid, {
      props: { projects, loading: false, error: null },
    })

    const card = wrapper.findComponent(ProjectCard)
    expect(card.exists()).toBe(true)

    card.vm.$emit('open', 'p1')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('open')).toEqual([['p1']])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/modules/projects/presentation/__tests__/ProjectGrid.spec.ts`
Expected: FAIL — module `../components/ProjectGrid.vue` does not exist.

- [ ] **Step 3: Write `ProjectGrid.vue`**

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
    class="project-grid"
    aria-busy="true"
    aria-label="Loading projects"
  >
    <div v-for="n in 3" :key="n" class="terminal-card project-skeleton">
      <div class="skeleton-block skeleton-image" />
      <div class="skeleton-block" />
      <div class="skeleton-block skeleton-line" />
    </div>
  </div>

  <div v-else-if="error" class="project-status" role="status">
    <p>{{ error }}</p>
    <button class="btn btn-default" @click="emit('retry')">retry</button>
  </div>

  <div v-else-if="projects.length === 0" class="project-status" role="status">
    <p>No projects yet</p>
  </div>

  <div v-else class="project-grid">
    <ProjectCard
      v-for="project in projects"
      :key="project.id"
      :project="project"
      @open="openProject"
    />
  </div>
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.project-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.skeleton-block {
  height: 1rem;
  border-radius: 4px;
  background: rgba(181, 222, 255, 0.15);
  animation: skeletonPulse 1.2s ease-in-out infinite;
}

.skeleton-image {
  height: 140px;
  width: 100%;
}

.skeleton-line {
  width: 60%;
}

.project-status {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

@keyframes skeletonPulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}
</style>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/modules/projects/presentation/__tests__/ProjectGrid.spec.ts`
Expected: 4 passing.

- [ ] **Step 5: Type-check + commit**

```bash
npm run type-check
git add src/modules/projects/presentation/components/ProjectGrid.vue src/modules/projects/presentation/__tests__/ProjectGrid.spec.ts
git commit -m "feat: add ProjectGrid component with loading, error, and empty states"
```

Expected: type-check passes, commit succeeds.

---

### Task 9: Views, routes, nav — integration

**Files:**
- Create: `src/views/ProjectsView.vue`
- Create: `src/views/ProjectDetailView.vue`
- Modify: `src/router/index.ts`
- Modify: `src/App.vue`

**Interfaces:**
- Consumes: `useProjectsStore`, `ProjectGrid`, `ProjectCarousel`, `MarkdownContent` (Tasks 4, 5, 6, 8).
- Produces: routes `projects` (`/projects`) and `project-detail` (`/projects/:id`); nav link `Projects` between Experiences and Skills.

- [ ] **Step 1: Write `src/views/ProjectsView.vue`**

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProjectsStore } from '@/modules/projects/presentation/projects.store'
import ProjectGrid from '@/modules/projects/presentation/components/ProjectGrid.vue'

const router = useRouter()
const store = useProjectsStore()
const { projects, loading, error } = storeToRefs(store)

onMounted(() => {
  store.loadProjects()
})

function openProject(id: string) {
  router.push(`/projects/${id}`)
}
</script>

<template>
  <main>
    <h2>Projects</h2>
    <ProjectGrid
      :projects="projects"
      :loading="loading"
      :error="error"
      @open="openProject"
      @retry="store.loadProjects"
    />
  </main>
</template>
```

- [ ] **Step 2: Write `src/views/ProjectDetailView.vue`**

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
  <main>
    <RouterLink to="/projects" class="back-link">← projects</RouterLink>

    <div v-if="loading" class="detail-skeleton" aria-busy="true">
      <div class="skeleton-block" />
      <div class="skeleton-block skeleton-wide" />
    </div>

    <div v-else-if="error" class="project-status" role="status">
      <p>{{ error }}</p>
      <button class="btn btn-default" @click="retry">retry</button>
    </div>

    <article v-else-if="currentProject">
      <h2>{{ currentProject.name }}</h2>
      <ProjectCarousel
        :images="currentProject.images"
        :alt="currentProject.name"
      />
      <p class="project-desc">{{ currentProject.description }}</p>
      <MarkdownContent
        v-if="currentProject.markdownAdditionals"
        :markdown="currentProject.markdownAdditionals"
      />
    </article>

    <div v-else class="project-status" role="status">
      <p>Project not found.</p>
      <RouterLink to="/projects" class="btn btn-default">← back to projects</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 1rem;
}

.project-desc {
  margin: 1rem 0;
}

.detail-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.skeleton-block {
  height: 1.5rem;
  border-radius: 4px;
  background: rgba(181, 222, 255, 0.15);
  animation: skeletonPulse 1.2s ease-in-out infinite;
}

.skeleton-wide {
  height: 12rem;
}

.project-status {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}

@keyframes skeletonPulse {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 1;
  }
}
</style>
```

- [ ] **Step 3: Register routes in `src/router/index.ts`**

Current file content:

```ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import ExperiencesView from '@/views/ExperiencesView.vue'
import SkillsView from '@/views/SkillsView.vue'
import ContactView from '@/views/ContactView.vue'
```

Add two imports after `ContactView`:

```ts
import ProjectsView from '@/views/ProjectsView.vue'
import ProjectDetailView from '@/views/ProjectDetailView.vue'
```

Add two route entries after the `/contacts` entry (inside the `routes` array):

```ts
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView,
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: ProjectDetailView,
    },
```

- [ ] **Step 4: Add nav link in `src/App.vue`**

Inside the `<nav class="main-nav">` block, add `Projects` between `Experiences` and `Skills`:

```html
        <RouterLink active-class="active-router" to="/experiences">Experiences</RouterLink>
        <RouterLink active-class="active-router" to="/projects">Projects</RouterLink>
        <RouterLink active-class="active-router" to="/skills">Skills</RouterLink>
```

- [ ] **Step 5: Run full test suite**

Run: `npx vitest run`
Expected: all suites pass (existing HelloWorld + 9 new suites).

- [ ] **Step 6: Type-check + lint + build**

```bash
npm run type-check
npm run lint
npm run build
```

Expected: type-check clean, lint clean, build succeeds (dist output produced).

- [ ] **Step 7: Manual smoke check**

Run: `npm run dev`
Open `http://localhost:5173`, click `Projects` in nav. Verify:
- Grid shows 3 project cards with thumbnails.
- `check details` navigates to `/projects/:id`.
- Detail shows carousel (next/prev wraps), description, rendered markdown (`# Useful Links`, links, lists).
- Unknown id e.g. `/projects/nope` shows "Project not found."

- [ ] **Step 8: Commit**

```bash
git add src/views/ProjectsView.vue src/views/ProjectDetailView.vue src/router/index.ts src/App.vue
git commit -m "feat: add projects list and detail views with routes and nav"
```

Expected: commit succeeds.

---

## Self-Review

**Spec coverage:**

- `/projects` list page — Task 9 (ProjectsView + route). ✓
- `/projects/:id` detail — Task 9 (ProjectDetailView + route). ✓
- `check details` terminal button — Task 7 (ProjectCard). ✓
- Carousel — Task 6. ✓
- Markdown via marked + DOMPurify — Task 5. ✓
- Layered data/repo/use-case/store — Tasks 1, 2, 3, 4. ✓
- Mock data, swappable to HTTP — Task 1 (mock + http data sources), Task 4 (di env flag). ✓
- Loading/error/empty/not-found states — Task 8 (grid), Task 9 (detail). ✓
- Tests per layer — Tasks 1–8. ✓
- Nav link — Task 9. ✓

**Placeholder scan:** No TBD/TODO/"similar to Task N". All code blocks complete.

**Type consistency:** `ProjectDataSource` methods consistent across Task 1 impls, Task 3 repository, Task 4 di. `Project`/`fromDto` names match across Tasks 2, 3, 7, 8, 9. Use-case `execute` signatures match store calls (Task 4). `open`/`retry` emit names consistent between components and views.
