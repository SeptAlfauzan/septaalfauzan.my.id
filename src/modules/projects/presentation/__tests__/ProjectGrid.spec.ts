import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectGrid from '../components/ProjectGrid.vue'
import ProjectCard from '../components/ProjectCard.vue'
import type { Project } from '@/modules/projects/domain/project.model'

const projects: Project[] = [
  {
    id: 'p1',
    createdAt: '',
    publishedAt: '',
    name: 'One',
    description: '',
    markdownAdditionals: '',
    images: [],
  },
]

describe('ProjectGrid', () => {
  it('shows a skeleton while loading', () => {
    const wrapper = mount(ProjectGrid, {
      props: { projects: [], loading: true, error: null },
    })

    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true)
  })

  it('shows the error and emits retry', async () => {
    const wrapper = mount(ProjectGrid, {
      props: { projects: [], loading: false, error: 'boom' },
    })

    expect(wrapper.text()).toContain('boom')
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })

  it('shows an empty state', () => {
    const wrapper = mount(ProjectGrid, {
      props: { projects: [], loading: false, error: null },
    })

    expect(wrapper.text()).toContain('No projects yet')
  })

  it('renders a card per project and forwards open', async () => {
    const wrapper = mount(ProjectGrid, {
      props: { projects, loading: false, error: null },
    })

    const card = wrapper.findComponent(ProjectCard)
    expect(card.exists()).toBe(true)

    card.vm.$emit('open', 'p1')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('open')).toEqual([['p1']])
  })
})
