import { describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { mount } from '@vue/test-utils'
import StatusBar from './StatusBar.vue'

async function mountStatusBar(initialPath: string) {
  setActivePinia(createPinia())
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/about', component: { template: '<div/>' } },
      { path: '/skills', component: { template: '<div/>' } },
    ],
  })
  router.push(initialPath)
  await router.isReady()
  const wrapper = mount(StatusBar, { global: { plugins: [router, createPinia()] } })
  return wrapper
}

describe('StatusBar', () => {
  it('shows the active file language', async () => {
    const wrapper = await mountStatusBar('/about')
    expect(wrapper.text()).toContain('Dart')

    const skills = await mountStatusBar('/skills')
    expect(skills.text()).toContain('YAML')
  })
})
