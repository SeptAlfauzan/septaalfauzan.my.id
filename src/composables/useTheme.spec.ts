import { beforeEach, describe, it, expect } from 'vitest'
import { useTheme } from './useTheme'

beforeEach(() => {
  document.documentElement.dataset.theme = 'dark'
})

describe('useTheme', () => {
  it('starts dark by default', () => {
    const { isDark } = useTheme()
    expect(isDark.value).toBe(true)
  })

  it('toggles to light and back', () => {
    const { isDark, toggle } = useTheme()

    toggle()
    expect(isDark.value).toBe(false)
    expect(document.documentElement.dataset.theme).toBe('light')

    toggle()
    expect(isDark.value).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
