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
