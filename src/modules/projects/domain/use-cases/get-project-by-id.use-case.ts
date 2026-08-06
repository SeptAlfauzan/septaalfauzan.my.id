import type { Project } from '../project.model'
import type { ProjectRepository } from '../project.repository'

export class GetProjectByIdUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(id: string): Promise<Project | null> {
    return this.repository.getProjectById(id)
  }
}
