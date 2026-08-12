import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactView from './ContactView.vue'

describe('ContactView', () => {
  it('renders markdown source and a rendered preview with real links', () => {
    const wrapper = mount(ContactView)

    const mailto = wrapper.find('a[href="mailto:alfauzansepta@gmail.com"]')
    expect(mailto.exists()).toBe(true)

    const linkedIn = wrapper.find('a[href="http://linkedin.com/in/septa-alfauzan-a11a891b0/"]')
    expect(linkedIn.exists()).toBe(true)

    expect(wrapper.findAll('.contact-row')).toHaveLength(2)
    expect(wrapper.text()).toContain("Let's work together")
  })
})
