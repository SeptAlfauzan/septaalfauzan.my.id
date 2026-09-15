import { afterEach, describe, it, expect } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import SakuPrivacyView from './SakuPrivacyView.vue'

let wrapper: VueWrapper | undefined

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
})

function mountView() {
  wrapper = mount(SakuPrivacyView)
  return wrapper
}

describe('SakuPrivacyView', () => {
  it('renders Indonesian policy by default', () => {
    const w = mountView()

    expect(w.text()).toContain('Kebijakan Privasi')
    expect(w.get('h1').text()).toBe('Saku')
    expect(w.text()).toContain('Aplikasi pencatat keuangan pribadi')
    expect(w.find('a[href="mailto:alfauzansepta@gmail.com"]').exists()).toBe(true)
    expect(document.title).toBe('Kebijakan Privasi — Saku')
    expect(document.documentElement.lang).toBe('id')
  })

  it('switches to English and back via the language toggle', async () => {
    const w = mountView()

    const enSection = w.find('section[lang="en"]')
    const idSection = w.find('section[lang="id"]')

    await w.findAll('button')[1].trigger('click')
    await w.vm.$nextTick()

    expect(enSection.isVisible()).toBe(true)
    expect(idSection.isVisible()).toBe(false)
    expect(enSection.text()).toContain('How Data Is Stored')
    expect(document.title).toBe('Privacy Policy — Saku')
    expect(document.documentElement.lang).toBe('en')

    await w.findAll('button')[0].trigger('click')
    await w.vm.$nextTick()

    expect(idSection.isVisible()).toBe(true)
    expect(enSection.isVisible()).toBe(false)
    expect(document.documentElement.lang).toBe('id')
  })

  it('marks the active language button with aria-current', async () => {
    const w = mountView()
    const buttons = w.findAll('button')

    expect(buttons[0].attributes('aria-current')).toBe('true')
    expect(buttons[1].attributes('aria-current')).toBe('false')

    await buttons[1].trigger('click')
    await w.vm.$nextTick()

    expect(buttons[0].attributes('aria-current')).toBe('false')
    expect(buttons[1].attributes('aria-current')).toBe('true')
  })
})