import { describe, it, expect } from 'vitest'
import { contact, contactMdLines } from './contact'

describe('contact', () => {
  it('has real email, phone, and social urls', () => {
    expect(contact.email).toBe('alfauzansepta@gmail.com')
    expect(contact.socials.map((s) => s.label)).toEqual(['LinkedIn', 'GitHub', 'Medium'])
    expect(contact.socials.every((s) => s.url !== '#')).toBe(true)
  })

  it('renders markdown source lines including social links', () => {
    const lines = contactMdLines()
    const joined = lines.map((l) => l.tokens.map((t) => t.text).join('')).join('\n')
    expect(joined).toContain('**Email:** alfauzansepta@gmail.com')
    expect(joined).toContain('[LinkedIn]')
  })
})
