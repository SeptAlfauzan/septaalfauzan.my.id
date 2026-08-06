import type { ProjectDataSource } from './project-data-source'
import type { ProjectDto, ProjectsResponseDto } from './types'

export class HttpProjectDataSource implements ProjectDataSource {
  private ensureConfig(): void {
    if (!import.meta.env.VITE_MICROCMS_ENDPOINT || !import.meta.env.VITE_MICROCMS_API_KEY) {
      throw new Error(
        'Missing MicroCMS configuration: VITE_MICROCMS_ENDPOINT and VITE_MICROCMS_API_KEY must be set',
      )
    }
  }

  async fetchProjects(): Promise<ProjectsResponseDto> {
    this.ensureConfig()
    const res = await fetch(`${import.meta.env.VITE_MICROCMS_ENDPOINT}/projects`, {
      headers: { 'X-MICROCMS-API-KEY': import.meta.env.VITE_MICROCMS_API_KEY },
    })
    if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`)
    return (await res.json()) as ProjectsResponseDto
  }

  async fetchProjectById(id: string): Promise<ProjectDto | null> {
    this.ensureConfig()
    const res = await fetch(`${import.meta.env.VITE_MICROCMS_ENDPOINT}/projects/${id}`, {
      headers: { 'X-MICROCMS-API-KEY': import.meta.env.VITE_MICROCMS_API_KEY },
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`)
    return (await res.json()) as ProjectDto
  }
}
