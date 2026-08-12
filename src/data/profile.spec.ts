import { describe, it, expect } from 'vitest'
import { profile, aboutCodeLines } from './profile'

describe('profile', () => {
  it('has real identity and resume url', () => {
    expect(profile.name).toBe('Septa Alfauzan')
    expect(profile.resumeUrl).toContain('drive.google.com')
  })

  it('builds about.dart lines with the typed comment first', () => {
    const lines = aboutCodeLines('// Hello, I\'m Septa Alfauzan 👋')
    expect(lines[0].tokens[0]).toEqual({ cls: 'tok-com', text: '// Hello, I\'m Septa Alfauzan 👋' })
    expect(lines.length).toBeGreaterThan(20)
  })
})
