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
