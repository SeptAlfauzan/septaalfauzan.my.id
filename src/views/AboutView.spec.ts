import { afterEach, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutView from './AboutView.vue'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('AboutView', () => {
  it('renders name, role, résumé link, and stack pills', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} }))
    const wrapper = mount(AboutView)

    expect(wrapper.text()).toContain('Septa Alfauzan')
    expect(wrapper.find('.role').text()).toContain('Mobile')
    const resume = wrapper.find('a.btn.primary')
    expect(resume.attributes('href')).toContain('drive.google.com')
    expect(wrapper.findAll('.pill').length).toBeGreaterThanOrEqual(4)
  })

  it('types the first comment line under reduced motion instantly', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} }))
    const wrapper = mount(AboutView)

    expect(wrapper.text()).toContain("// Hello, I'm Septa Alfauzan")
    expect(wrapper.find('.typed-cursor').exists()).toBe(false)
  })
})
