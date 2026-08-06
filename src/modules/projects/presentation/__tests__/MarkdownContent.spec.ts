import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MarkdownContent from '../components/MarkdownContent.vue'

describe('MarkdownContent', () => {
  it('renders markdown as HTML', () => {
    const wrapper = mount(MarkdownContent, {
      props: { markdown: '# Title\n\nA paragraph with **bold**.' },
    })

    expect(wrapper.find('.markdown-body h1').text()).toBe('Title')
    expect(wrapper.html()).toContain('<strong>bold</strong>')
  })

  it('strips unsafe HTML', () => {
    const wrapper = mount(MarkdownContent, {
      props: { markdown: '<script>alert("x")</script>Safe' },
    })

    expect(wrapper.find('script').exists()).toBe(false)
    expect(wrapper.text()).toContain('Safe')
  })
})
