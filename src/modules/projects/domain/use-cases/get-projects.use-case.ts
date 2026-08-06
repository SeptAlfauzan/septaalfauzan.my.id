import type { Project } from '../project.model'
import type { ProjectRepository } from '../project.repository'

export class GetProjectsUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(): Promise<Project[]> {
    const projects = await this.repository.getProjects()
    return projects.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  }
}
