import { afterEach, describe, it, expect, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useTypewriter } from './useTypewriter'

function makeHarness() {
  return defineComponent({
    setup() {
      const { text, done } = useTypewriter('hello', { speedMs: 10 })
      return { text, done }
    },
    template: `<div><span class="t">{{ text }}</span><span class="d">{{ done }}</span></div>`,
  })
}

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('useTypewriter', () => {
  it('types text progressively then completes', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }))
    const wrapper = mount(makeHarness())

    vi.advanceTimersByTime(30)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.t').text()).toBe('hel')

    vi.advanceTimersByTime(30)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.t').text()).toBe('hello')
    expect(wrapper.find('.d').text()).toBe('true')
  })

  it('renders full text instantly under reduced motion', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} }))
    const wrapper = mount(makeHarness())

    expect(wrapper.find('.t').text()).toBe('hello')
    expect(wrapper.find('.d').text()).toBe('true')
  })
})
