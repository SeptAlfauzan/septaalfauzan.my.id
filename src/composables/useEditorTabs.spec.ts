import { describe, it, expect } from 'vitest'
import { FILES, slugify, activeFileMeta, detailFileMeta } from './useEditorTabs'

describe('useEditorTabs', () => {
  it('defines the five fixed files', () => {
    expect(FILES.map((f) => f.file)).toEqual([
      'about.dart',
      'experience.log',
      'projects.json',
      'skills.yaml',
      'contact.md',
    ])
  })

  it('slugifies project names to file slugs', () => {
    expect(slugify('HRIS Mobile Platform')).toBe('hris-mobile-platform')
    expect(slugify('  Smart  Greenhouse IoT ')).toBe('smart-greenhouse-iot')
  })

  it('maps plain routes to their file meta', () => {
    expect(activeFileMeta('/about', null).file).toBe('about.dart')
    expect(activeFileMeta('/projects', null).file).toBe('projects.json')
  })

  it('maps detail routes to a project file meta', () => {
    const meta = activeFileMeta('/projects/proj_hris', 'HRIS Mobile')
    expect(meta.file).toBe('hris-mobile.md')
    expect(meta.lang).toBe('Markdown')
    expect(meta.dot).toBe('var(--cyan)')
  })

  it('falls back to a generic project file before data loads', () => {
    expect(detailFileMeta(null).file).toBe('project.md')
  })
})
