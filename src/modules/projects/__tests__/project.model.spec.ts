import { describe, it, expect } from 'vitest'
import { fromDto } from '../domain/project.model'
import type { ProjectDto } from '../data/types'

const baseDto: ProjectDto = {
  id: 'p1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  publishedAt: '2026-01-02T00:00:00.000Z',
  revisedAt: '2026-01-01T00:00:00.000Z',
  projectName: 'Dummy',
  projectDesc: 'Description here',
  markdownAdditionals: '# Links',
  images: {
    fieldId: 'carouselImages',
    images: [{ url: 'https://example.com/a.png', height: 500, width: 1024 }],
  },
}

describe('fromDto', () => {
  it('maps a full DTO to the Project model', () => {
    expect(fromDto(baseDto)).toEqual({
      id: 'p1',
      createdAt: '2026-01-01T00:00:00.000Z',
      publishedAt: '2026-01-02T00:00:00.000Z',
      name: 'Dummy',
      description: 'Description here',
      markdownAdditionals: '# Links',
      images: [{ url: 'https://example.com/a.png', height: 500, width: 1024 }],
    })
  })

  it('defaults missing optional fields', () => {
    const partial = {
      ...baseDto,
      markdownAdditionals: undefined,
      images: undefined,
    } as unknown as ProjectDto

    const project = fromDto(partial)
    expect(project.markdownAdditionals).toBe('')
    expect(project.images).toEqual([])
  })
})
