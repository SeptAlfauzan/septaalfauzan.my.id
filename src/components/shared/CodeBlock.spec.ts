import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CodeBlock from './CodeBlock.vue'
import { line, plain, kw, com } from '@/types/code'

describe('CodeBlock', () => {
  const lines = [
    line(com('// hello')),
    line(kw('class'), plain(' '), plain('A')),
  ]

  it('renders each line and token with the right classes', () => {
    const wrapper = mount(CodeBlock, { props: { lines } })
    const rows = wrapper.findAll('.line')
    expect(rows).toHaveLength(2)
    expect(rows[0]!.find('span').classes()).toContain('tok-com')
    expect(rows[1]!.findAll('span')[0]!.classes()).toContain('tok-kw')
    expect(rows[1]!.findAll('span')[1]!.element.textContent).toBe(' ')
  })

  it('shows a typed cursor after the first line when requested', () => {
    const wrapper = mount(CodeBlock, { props: { lines, cursor: true } })
    expect(wrapper.findAll('.typed-cursor')).toHaveLength(1)
  })
})
