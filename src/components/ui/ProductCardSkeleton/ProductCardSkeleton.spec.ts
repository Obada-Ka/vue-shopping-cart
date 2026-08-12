import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import ProductCardSkeleton from './ProductCardSkeleton.vue'
describe('ProductCardSkeleton.vue', () => {
  const createWrapper = () => mount(ProductCardSkeleton)

  it('renders without crashing', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the main skeleton container with proper layout classes', () => {
    const wrapper = createWrapper()
    const container = wrapper.find('.skeleton-card')

    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('border-b')
    expect(container.classes()).toContain('border-divider')
  })

  it('renders animated skeleton pulse placeholders', () => {
    const wrapper = createWrapper()
    const animatedElements = wrapper.findAll('.animate-pulse')

    expect(animatedElements).toHaveLength(7)
  })

  it('renders all key grid section placeholders', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('.product-area').exists()).toBe(true)
    expect(wrapper.find('.price-value').exists()).toBe(true)
    expect(wrapper.find('.qty-value').exists()).toBe(true)
    expect(wrapper.find('.total-value').exists()).toBe(true)
  })
})
