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
