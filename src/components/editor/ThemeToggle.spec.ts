import { beforeEach, describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeToggle from './ThemeToggle.vue'

beforeEach(() => {
  document.documentElement.dataset.theme = 'dark'
})

describe('ThemeToggle', () => {
  it('toggles the html data-theme attribute on click', async () => {
    const wrapper = mount(ThemeToggle)
    expect(document.documentElement.dataset.theme).toBe('dark')

    await wrapper.find('button').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('light')

    await wrapper.find('button').trigger('click')
    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
