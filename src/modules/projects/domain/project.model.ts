import type { ProjectDto, ProjectImage } from '../data/types'

export interface Project {
  id: string
  createdAt: string
  publishedAt: string
  name: string
  description: string
  markdownAdditionals: string
  images: ProjectImage[]
}

export function fromDto(dto: ProjectDto): Project {
  return {
    id: dto.id,
    createdAt: dto.createdAt,
    publishedAt: dto.publishedAt,
    name: dto.projectName,
    description: dto.projectDesc,
    markdownAdditionals: dto.markdownAdditionals ?? '',
    images: dto.images?.images ?? [],
  }
}
