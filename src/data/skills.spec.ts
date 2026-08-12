import { describe, it, expect } from 'vitest'
import { skillGroups } from './skills'

describe('skills', () => {
  it('has the four yaml groups and no web-development duplicate', () => {
    expect(skillGroups.map((g) => g.key)).toEqual([
      'mobile_development',
      'architecture',
      'backend_integration',
      'tools',
    ])
  })

  it('lists Flutter under mobile development', () => {
    const mobile = skillGroups.find((g) => g.key === 'mobile_development')
    expect(mobile?.items).toContain('Flutter')
  })
})
