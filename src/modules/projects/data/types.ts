export interface ProjectImage {
  url: string
  height: number
  width: number
}

export interface ProjectImages {
  fieldId: string
  images: ProjectImage[]
}

export interface ProjectDto {
  id: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
  projectName: string
  projectDesc: string
  markdownAdditionals: string
  images: ProjectImages
}

export interface ProjectsResponseDto {
  contents: ProjectDto[]
  totalCount: number
  offset: number
  limit: number
}
