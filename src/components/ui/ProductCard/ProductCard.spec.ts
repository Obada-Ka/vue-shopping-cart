import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import ProductCard from './ProductCard.vue'

describe('ProductCard.vue', () => {
  const mockProduct = {
    id: 101,
    title: 'Wireless Headphones',
    description: 'High quality noise-canceling headphones',
    image: 'https://example.com/headphones.jpg',
    price: 99.99,
    quantity: 2,
    total: 199.98
  }

  const createWrapper = (props = {}) => {
    return mount(ProductCard, {
      props: {
        product: mockProduct,
        ...props
      },
      global: {
        stubs: {
          QuantityStepper: true,
          X: true
        }
      }
    })
  }

  it('renders product details correctly', () => {
    const wrapper = createWrapper()

    expect(wrapper.find('h3').text()).toBe(mockProduct.title)
    expect(wrapper.find('p').text()).toBe(mockProduct.description)
    expect(wrapper.find('.price-value').text()).toBe('$99.99')
    expect(wrapper.find('.total-value').text()).toBe('$199.98')
  })

  it('renders image when image URL is provided', () => {
    const wrapper = createWrapper()

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe(mockProduct.image)
    expect(img.attributes('alt')).toBe(mockProduct.title)
    expect(wrapper.text()).not.toContain('No image available')
  })

  it('renders fallback text when image URL is empty or missing', () => {
    const wrapper = createWrapper({
      product: { ...mockProduct, image: '' }
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('No image available')
  })

  it('emits "remove" event with product id when remove button is clicked', async () => {
    const wrapper = createWrapper()

    const removeButton = wrapper.find('button[aria-label="Remove product"]')
    await removeButton.trigger('click')

    const removeEvents = wrapper.emitted('remove')
    expect(removeEvents).toBeTruthy()
    expect(removeEvents?.[0]).toEqual([mockProduct.id])
  })

  it('binds quantity to QuantityStepper and emits "quantity-change" on update', async () => {
    const wrapper = createWrapper()

    const stepper = wrapper.findComponent({ name: 'QuantityStepper' })
    expect(stepper.exists()).toBe(true)
    expect(stepper.props('modelValue')).toBe(mockProduct.quantity)

    const newQuantity = 5
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await stepper.vm.$emit('update:modelValue', newQuantity)

    const quantityChangeEvents = wrapper.emitted('quantity-change')
    expect(quantityChangeEvents).toBeTruthy()
    expect(quantityChangeEvents?.[0]).toEqual([mockProduct.id, newQuantity])
  })

  it('formats prices with two decimal places', () => {
    const wrapper = createWrapper({
      product: { ...mockProduct, price: 10, total: 20 }
    })

    expect(wrapper.find('.price-value').text()).toBe('$10.00')
    expect(wrapper.find('.total-value').text()).toBe('$20.00')
  })
})
