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
