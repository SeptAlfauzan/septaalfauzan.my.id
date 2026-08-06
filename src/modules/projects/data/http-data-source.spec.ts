import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { HttpProjectDataSource } from './http-data-source'

describe('HttpProjectDataSource', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_MICROCMS_ENDPOINT', 'https://example.microcms.io/api/v1')
    vi.stubEnv('VITE_MICROCMS_API_KEY', 'test-key')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('throws a clear error when env vars are missing', async () => {
    vi.stubEnv('VITE_MICROCMS_ENDPOINT', '')
    vi.stubEnv('VITE_MICROCMS_API_KEY', '')
    const source = new HttpProjectDataSource()

    await expect(source.fetchProjects()).rejects.toThrow('Missing MicroCMS configuration')
  })

  it('fetches projects with the MicroCMS auth header', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ contents: [], totalCount: 0, offset: 0, limit: 10 }),
    })
    vi.stubGlobal('fetch', fetchMock)
    const source = new HttpProjectDataSource()

    await source.fetchProjects()

    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.microcms.io/api/v1/projects',
      { headers: { 'X-MICROCMS-API-KEY': 'test-key' } },
    )
  })
})
