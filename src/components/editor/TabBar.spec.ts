import { describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { mount } from '@vue/test-utils'
import TabBar from './TabBar.vue'

async function mountTabBar(initialPath: string) {
  setActivePinia(createPinia())
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', redirect: '/about' },
      { path: '/about', component: { template: '<div/>' } },
      { path: '/projects', component: { template: '<div/>' } },
      { path: '/projects/:id', component: { template: '<div/>' } },
      { path: '/experiences', component: { template: '<div/>' } },
      { path: '/skills', component: { template: '<div/>' } },
      { path: '/contacts', component: { template: '<div/>' } },
    ],
  })
  router.push(initialPath)
  await router.isReady()
  const wrapper = mount(TabBar, { global: { plugins: [router, createPinia()] } })
  return { wrapper, router }
}

describe('TabBar', () => {
  it('renders five fixed tabs and marks the active one', async () => {
    const { wrapper } = await mountTabBar('/about')
    const tabs = wrapper.findAll('.tab')
    expect(tabs).toHaveLength(5)
    expect(wrapper.find('.tab.active').text()).toContain('about.dart')
  })

  it('adds a detail tab on a project detail route', async () => {
    const { wrapper } = await mountTabBar('/projects/proj_x')
    expect(wrapper.findAll('.tab')).toHaveLength(6)
    expect(wrapper.find('.tab.active').text()).toContain('project.md')
  })
})
