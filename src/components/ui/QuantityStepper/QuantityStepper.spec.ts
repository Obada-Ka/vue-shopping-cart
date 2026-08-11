import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import QuantityStepper from './QuantityStepper.vue'

describe('QuantityStepper.vue', () => {
  const createWrapper = (props = {}) => {
    return mount(QuantityStepper, {
      props: {
        modelValue: 5,
        ...props
      }
    })
  }

  it('renders current modelValue', () => {
    const wrapper = createWrapper({ modelValue: 3 })
    expect(wrapper.text()).toContain('3')
  })

  it('emits "update:modelValue" with decremented value when decrease button is clicked', async () => {
    const wrapper = createWrapper({ modelValue: 5 })

    const decreaseBtn = wrapper.find('button[aria-label="Decrease quantity"]')
    await decreaseBtn.trigger('click')

    const emitEvents = wrapper.emitted('update:modelValue')
    expect(emitEvents).toBeTruthy()
    expect(emitEvents?.[0]).toEqual([4])
  })

  it('emits "update:modelValue" with incremented value when increase button is clicked', async () => {
    const wrapper = createWrapper({ modelValue: 5 })

    const increaseBtn = wrapper.find('button[aria-label="Increase quantity"]')
    await increaseBtn.trigger('click')

    const emitEvents = wrapper.emitted('update:modelValue')
    expect(emitEvents).toBeTruthy()
    expect(emitEvents?.[0]).toEqual([6])
  })

  describe('min boundary checks', () => {
    it('disables decrease button when modelValue is less than or equal to min', () => {
      const wrapper = createWrapper({ modelValue: 1, min: 1 })

      const decreaseBtn = wrapper.find('button[aria-label="Decrease quantity"]')
      expect((decreaseBtn.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('does not emit "update:modelValue" when clicking disabled decrease button', async () => {
      const wrapper = createWrapper({ modelValue: 0, min: 0 })

      const decreaseBtn = wrapper.find('button[aria-label="Decrease quantity"]')
      await decreaseBtn.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('max boundary checks', () => {
    it('disables increase button when modelValue is greater than or equal to max', () => {
      const wrapper = createWrapper({ modelValue: 10, max: 10 })

      const increaseBtn = wrapper.find('button[aria-label="Increase quantity"]')
      expect((increaseBtn.element as HTMLButtonElement).disabled).toBe(true)
    })

    it('does not emit "update:modelValue" when clicking disabled increase button', async () => {
      const wrapper = createWrapper({ modelValue: 10, max: 10 })

      const increaseBtn = wrapper.find('button[aria-label="Increase quantity"]')
      await increaseBtn.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  it('uses default min (0) and max (Infinity) when not provided', () => {
    const wrapper = createWrapper({ modelValue: 0 })

    const decreaseBtn = wrapper.find('button[aria-label="Decrease quantity"]')
    const increaseBtn = wrapper.find('button[aria-label="Increase quantity"]')

    expect((decreaseBtn.element as HTMLButtonElement).disabled).toBe(true)

    expect((increaseBtn.element as HTMLButtonElement).disabled).toBe(false)
  })
})
