import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import CartHeaders from './CartHeaders.vue'

describe('CartHeaders.vue', () => {
  it('renders all titles passed via props', () => {
    const titles = ['Product', 'Price', 'Quantity', 'Total']
    const wrapper = mount(CartHeaders, {
      props: { titles }
    })

    const titleDivs = wrapper.find('div').findAll(':scope > div')
    expect(titleDivs).toHaveLength(titles.length)

    titles.forEach((title, index) => {
      expect(titleDivs[index]?.text()).toBe(title)
    })
  })

  it('applies the text-center class to all titles except the first one', () => {
    const titles = ['First', 'Second', 'Third']
    const wrapper = mount(CartHeaders, {
      props: { titles }
    })

    const titleDivs = wrapper.find('div').findAll(':scope > div')

    expect(titleDivs[0]?.classes()).not.toContain('text-center')
    expect(titleDivs[1]?.classes()).toContain('text-center')
    expect(titleDivs[2]?.classes()).toContain('text-center')
  })

  it('computes correct gridTemplateColumns inline style based on titles length', () => {
    const titles = ['Col 1', 'Col 2', 'Col 3']
    const wrapper = mount(CartHeaders, {
      props: { titles }
    })

    const container = wrapper.find('div')

    expect(container.attributes('style')).toContain('grid-template-columns: 2fr 1fr 1fr;')
  })

  it('handles a single title correctly without trailing extra columns', () => {
    const titles = ['Only One']
    const wrapper = mount(CartHeaders, {
      props: { titles }
    })

    const container = wrapper.find('div')
    const titleDivs = wrapper.find('div').findAll(':scope > div')

    expect(titleDivs).toHaveLength(1)
    expect(titleDivs[0]?.classes()).not.toContain('text-center')
    expect(container.attributes('style')).toContain('grid-template-columns: 2fr;')
  })
})
