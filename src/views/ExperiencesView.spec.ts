import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ExperiencesView from './ExperiencesView.vue'

describe('ExperiencesView', () => {
  it('renders all four roles as commits with the first marked HEAD', () => {
    const wrapper = mount(ExperiencesView)

    expect(wrapper.findAll('.commit')).toHaveLength(4)
    expect(wrapper.text()).toContain('9f3a1c2')
    expect(wrapper.text()).toContain('(HEAD -> main, origin/main)')
    expect(wrapper.text()).toContain('Mobile Developer @ Delta HQ')
    expect(wrapper.text()).toContain('Android Developer Intern @ Algostudio')
    expect(wrapper.text()).toContain('93%')
  })

  it('renders bullets for the current role', () => {
    const wrapper = mount(ExperiencesView)
    const first = wrapper.find('.commit')
    expect(first.findAll('li').length).toBe(5)
  })
})
