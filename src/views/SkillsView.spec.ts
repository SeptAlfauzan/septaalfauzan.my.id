import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkillsView from './SkillsView.vue'

describe('SkillsView', () => {
  it('renders yaml groups with no web-development duplicate', () => {
    const wrapper = mount(SkillsView)

    expect(wrapper.findAll('.yaml-group')).toHaveLength(4)
    expect(wrapper.text()).toContain('mobile_development:')
    expect(wrapper.text()).toContain('Flutter')
    expect(wrapper.text()).toContain('Firebase, Micro CMS')
    expect(wrapper.text()).not.toContain('Web Development')
  })
})
