import { beforeEach, describe, it, expect } from 'vitest'
import { useTheme } from './useTheme'

beforeEach(() => {
  document.documentElement.dataset.theme = 'light'
})

describe('useTheme', () => {
  it('starts light by default', () => {
    const { isDark } = useTheme()
    expect(isDark.value).toBe(false)
  })

  it('toggles to dark and back', () => {
    const { isDark, toggle } = useTheme()

    toggle()
    expect(isDark.value).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('dark')

    toggle()
    expect(isDark.value).toBe(false)
    expect(document.documentElement.dataset.theme).toBe('light')
  })
})
