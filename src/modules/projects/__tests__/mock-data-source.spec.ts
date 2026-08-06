import { describe, it, expect } from 'vitest'
import { MockProjectDataSource } from '../data/mock-data-source'

describe('MockProjectDataSource', () => {
  it('fetches a project list response', async () => {
    const ds = new MockProjectDataSource()
    const response = await ds.fetchProjects()
    expect(response.totalCount).toBeGreaterThan(0)
    expect(response.contents[0]?.projectName).toBeTruthy()
  })

  it('returns null for an unknown id', async () => {
    const ds = new MockProjectDataSource()
    expect(await ds.fetchProjectById('does-not-exist')).toBeNull()
  })
})
