import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectCarousel from '../components/ProjectCarousel.vue'

const images = [
  { url: 'https://example.com/1.png', height: 100, width: 200 },
  { url: 'https://example.com/2.png', height: 100, width: 200 },
]

const imgA = { url: 'https://example.com/a.png', height: 100, width: 200 }
const imgB = { url: 'https://example.com/b.png', height: 100, width: 200 }
const imgC = { url: 'https://example.com/c.png', height: 100, width: 200 }

describe('ProjectCarousel', () => {
  it('shows the first image initially', () => {
    const wrapper = mount(ProjectCarousel, { props: { images, alt: 'Project' } })

    expect(wrapper.find('img').attributes('src')).toBe(images[0]?.url)
    expect(wrapper.text()).toContain('1 / 2')
  })

  it('navigates next and wraps to first', async () => {
    const wrapper = mount(ProjectCarousel, { props: { images, alt: 'Project' } })
    const buttons = wrapper.findAll('button')

    await buttons[1]!.trigger('click')
    expect(wrapper.find('img').attributes('src')).toBe(images[1]?.url)

    await buttons[1]!.trigger('click')
    expect(wrapper.find('img').attributes('src')).toBe(images[0]?.url)
  })

  it('navigates prev and wraps to last', async () => {
    const wrapper = mount(ProjectCarousel, { props: { images, alt: 'Project' } })
    const buttons = wrapper.findAll('button')

    await buttons[0]!.trigger('click')
    expect(wrapper.find('img').attributes('src')).toBe(images[1]?.url)
  })

  it('resets the index when images change', async () => {
    const wrapper = mount(ProjectCarousel, {
      props: { images: [imgA, imgB, imgC], alt: 'Project' },
    })
    const buttons = wrapper.findAll('button')

    await buttons[1]!.trigger('click')
    expect(wrapper.text()).toContain('2 / 3')

    await wrapper.setProps({ images: [imgA] })
    expect(wrapper.text()).toContain('1 / 1')
  })
})
