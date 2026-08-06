import type { ProjectDto, ProjectsResponseDto } from './types'

export interface ProjectDataSource {
  fetchProjects(): Promise<ProjectsResponseDto>
  fetchProjectById(id: string): Promise<ProjectDto | null>
}
