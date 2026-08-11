import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import ShippingCalculator from './ShippingCalculator.vue'

const mockCost = ref<number | null>(null)
const mockIsCalculating = ref(false)
const mockCalculateShipping = vi.fn()
const mockResetShipping = vi.fn()

vi.mock('../composables/useShipping', () => ({
  useShipping: () => ({
    cost: mockCost,
    isCalculating: mockIsCalculating,
    calculateShipping: mockCalculateShipping,
    resetShipping: mockResetShipping
  })
}))

const BaseButtonStub = {
  name: 'BaseButton',
  props: ['disabled', 'color', 'type'],
  template: '<button class="base-button-stub" :disabled="disabled"><slot /></button>'
}

function createWrapper() {
  return mount(ShippingCalculator, {
    global: { stubs: { BaseButton: BaseButtonStub } }
  })
}

async function fillForm(wrapper: ReturnType<typeof createWrapper>) {
  const inputs = wrapper.findAll('input')
  await inputs[0]?.setValue('Berlin')
  await inputs[1]?.setValue('Main St')
  await inputs[2]?.setValue('10115')
}

describe('ShippingCalculator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCost.value = null
    mockIsCalculating.value = false
  })

  it('disables the submit button when all fields are empty', () => {
    const wrapper = createWrapper()
    expect(wrapper.findComponent(BaseButtonStub).props('disabled')).toBe(true)
  })

  it('disables the submit button when only some fields are filled', async () => {
    const wrapper = createWrapper()
    await wrapper.findAll('input')[0]?.setValue('Berlin')

    expect(wrapper.findComponent(BaseButtonStub).props('disabled')).toBe(true)
  })

  it('enables the submit button once all three fields are filled', async () => {
    const wrapper = createWrapper()
    await fillForm(wrapper)

    expect(wrapper.findComponent(BaseButtonStub).props('disabled')).toBe(false)
  })

  it('treats whitespace-only input as empty (still disabled)', async () => {
    const wrapper = createWrapper()
    const inputs = wrapper.findAll('input')
    await inputs[0]?.setValue('   ')
    await inputs[1]?.setValue('   ')
    await inputs[2]?.setValue('   ')

    expect(wrapper.findComponent(BaseButtonStub).props('disabled')).toBe(true)
  })

  it('calls calculateShipping on submit when the form is valid', async () => {
    const wrapper = createWrapper()
    await fillForm(wrapper)

    await wrapper.find('form').trigger('submit')

    expect(mockCalculateShipping).toHaveBeenCalledTimes(1)
  })

  it('does not call calculateShipping on submit when the form is invalid', async () => {
    const wrapper = createWrapper()

    await wrapper.find('form').trigger('submit')

    expect(mockCalculateShipping).not.toHaveBeenCalled()
  })

  it('calls resetShipping when all fields transition from filled to empty', async () => {
    const wrapper = createWrapper()
    await fillForm(wrapper)
    expect(mockResetShipping).not.toHaveBeenCalled()

    const inputs = wrapper.findAll('input')
    await inputs[0]?.setValue('')
    await inputs[1]?.setValue('')
    await inputs[2]?.setValue('')
    await flushPromises()

    expect(mockResetShipping).toHaveBeenCalledTimes(1)
  })

  it('does not call resetShipping just from clearing one of several fields', async () => {
    const wrapper = createWrapper()
    await fillForm(wrapper)

    await wrapper.findAll('input')[0]?.setValue('')
    await flushPromises()

    expect(mockResetShipping).not.toHaveBeenCalled()
  })

  it('renders the shipping cost row when cost is set', () => {
    mockCost.value = 15.5
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('$15.50')
  })

  it('does not render the shipping cost row when cost is null', () => {
    mockCost.value = null
    const wrapper = createWrapper()
    expect(wrapper.text()).not.toContain('Shipping cost')
  })

  it('shows "Calculating…" and disables the button while isCalculating is true', async () => {
    mockIsCalculating.value = true
    const wrapper = createWrapper()
    await fillForm(wrapper)

    expect(wrapper.text()).toContain('Calculating…')
    expect(wrapper.findComponent(BaseButtonStub).props('disabled')).toBe(true)
  })

  it('shows "Calculate Shipping" label when not calculating', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Calculate Shipping')
  })
})
