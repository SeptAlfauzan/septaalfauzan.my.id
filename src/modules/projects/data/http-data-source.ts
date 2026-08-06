import type { ProjectDataSource } from './project-data-source'
import type { ProjectDto, ProjectsResponseDto } from './types'

const ENDPOINT = import.meta.env.VITE_MICROCMS_ENDPOINT
const API_KEY = import.meta.env.VITE_MICROCMS_API_KEY

if (!ENDPOINT || !API_KEY) {
  throw new Error(
    'Missing MicroCMS configuration: VITE_MICROCMS_ENDPOINT and VITE_MICROCMS_API_KEY must be set',
  )
}

export class HttpProjectDataSource implements ProjectDataSource {
  async fetchProjects(): Promise<ProjectsResponseDto> {
    const res = await fetch(`${ENDPOINT}/projects`, {
      headers: { 'X-MICROCMS-API-KEY': API_KEY },
    })
    if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`)
    return (await res.json()) as ProjectsResponseDto
  }

  async fetchProjectById(id: string): Promise<ProjectDto | null> {
    const res = await fetch(`${ENDPOINT}/projects/${id}`, {
      headers: { 'X-MICROCMS-API-KEY': API_KEY },
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`Failed to fetch project: ${res.status}`)
    return (await res.json()) as ProjectDto
  }
}
