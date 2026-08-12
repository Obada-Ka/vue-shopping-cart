import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

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

  const findInput = (wrapper: ReturnType<typeof createWrapper>) =>
    wrapper.find('input[aria-label="Quantity"]')

  it('renders current modelValue in the input', () => {
    const wrapper = createWrapper({ modelValue: 3 })
    expect((findInput(wrapper).element as HTMLInputElement).value).toBe('3')
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

  describe('manual input', () => {
    it('strips non-digit characters as the user types', async () => {
      const wrapper = createWrapper({ modelValue: 0 })
      const input = findInput(wrapper)

      await input.setValue('12a3b')

      expect((input.element as HTMLInputElement).value).toBe('123')
    })

    it('emits the parsed value on blur when it differs from modelValue', async () => {
      const wrapper = createWrapper({ modelValue: 5 })
      const input = findInput(wrapper)

      await input.setValue('9')
      await input.trigger('blur')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([9])
    })

    it('does not emit on blur when the typed value equals the current modelValue', async () => {
      const wrapper = createWrapper({ modelValue: 5 })
      const input = findInput(wrapper)

      await input.setValue('5')
      await input.trigger('blur')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('clamps a typed value above max down to max on blur', async () => {
      const wrapper = createWrapper({ modelValue: 5, max: 10 })
      const input = findInput(wrapper)

      await input.setValue('999')
      await input.trigger('blur')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([10])
      expect((input.element as HTMLInputElement).value).toBe('10')
    })

    it('clamps a typed value below min up to min on blur', async () => {
      const wrapper = createWrapper({ modelValue: 5, min: 2 })
      const input = findInput(wrapper)

      await input.setValue('0')
      await input.trigger('blur')

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
    })

    it('reverts to the last valid modelValue when the field is left empty on blur', async () => {
      const wrapper = createWrapper({ modelValue: 5 })
      const input = findInput(wrapper)

      await input.setValue('')
      await input.trigger('blur')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      expect((input.element as HTMLInputElement).value).toBe('5')
    })

    it('commits the value and blurs when Enter is pressed', async () => {
      const container = document.createElement('div')
      document.body.appendChild(container)

      const wrapper = mount(QuantityStepper, {
        props: { modelValue: 5 },
        attachTo: container
      })
      const input = findInput(wrapper)

      await input.setValue('8')
      ;(input.element as HTMLInputElement).focus()
      await input.trigger('keydown', { key: 'Enter' })

      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([8])

      wrapper.unmount()
      container.remove()
    })

    it('updates the displayed input value when modelValue changes externally (e.g. via +/- buttons)', async () => {
      const wrapper = createWrapper({ modelValue: 5 })
      const input = findInput(wrapper)

      await wrapper.setProps({ modelValue: 7 })

      expect((input.element as HTMLInputElement).value).toBe('7')
    })
  })
})
