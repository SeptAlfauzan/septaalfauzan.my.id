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
