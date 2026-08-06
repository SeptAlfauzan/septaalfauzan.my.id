import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectCard from '../components/ProjectCard.vue'
import type { Project } from '@/modules/projects/domain/project.model'

const project: Project = {
  id: 'p1',
  createdAt: '',
  publishedAt: '',
  name: 'Dummy',
  description: 'A long description',
  markdownAdditionals: '',
  images: [{ url: 'https://example.com/thumb.png', height: 100, width: 200 }],
}

describe('ProjectCard', () => {
  it('renders name, description, and thumbnail', () => {
    const wrapper = mount(ProjectCard, { props: { project } })

    expect(wrapper.text()).toContain('Dummy')
    expect(wrapper.text()).toContain('A long description')
    expect(wrapper.find('img').attributes('src')).toBe(project.images[0]?.url)
  })

  it('emits open with the project id on check details click', async () => {
    const wrapper = mount(ProjectCard, { props: { project } })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('open')).toEqual([['p1']])
  })
})
