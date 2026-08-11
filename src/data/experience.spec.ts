import { describe, it, expect } from 'vitest'
import { experiences } from './experience'

describe('experience', () => {
  it('contains all four roles', () => {
    expect(experiences).toHaveLength(4)
    expect(experiences.map((e) => e.subject)).toEqual(
      expect.arrayContaining([
        'Mobile Developer @ Delta HQ',
        'Mobile Developer @ Tensai Innovation',
        'Mobile Developer Mentor @ Bangkit Academy (by Google)',
        'Android Developer Intern @ Algostudio',
      ]),
    )
  })

  it('marks the first commit as HEAD', () => {
    expect(experiences[0]?.refs).toContain('HEAD')
  })
})
