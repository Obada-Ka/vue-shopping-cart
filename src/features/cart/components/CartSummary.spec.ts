import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import CartSummary from './CartSummary.vue'

const mockToastSuccess = vi.fn<(message: string) => void>()
const mockToastWarning = vi.fn<(message: string) => void>()

vi.mock('vue-sonner', () => ({
  toast: {
    success: (message: string): void => {
      mockToastSuccess(message)
    },
    warning: (message: string): void => {
      mockToastWarning(message)
    }
  }
}))

const BaseButtonStub = {
  name: 'BaseButton',
  props: ['disabled', 'color'],
  emits: ['click'],
  template:
    '<button class="base-button-stub" :disabled="disabled" @click="$emit(\'click\')"><slot /></button>'
}

const DEFAULT_PROPS = { subtotal: 100, shipping: 10, tax: 20, total: 130 }

function createWrapper(props = DEFAULT_PROPS) {
  return mount(CartSummary, {
    props,
    global: { stubs: { BaseButton: BaseButtonStub } }
  })
}

describe('CartSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders subtotal, shipping, tax, and total formatted to 2 decimal places', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('$100.00')
    expect(wrapper.text()).toContain('$10.00')
    expect(wrapper.text()).toContain('$20.00')
    expect(wrapper.text()).toContain('$130.00')
  })

  it('renders the row labels', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Subtotals')
    expect(wrapper.text()).toContain('Shipping')
    expect(wrapper.text()).toContain('Tax (20%)')
    expect(wrapper.text()).toContain('Totals')
  })

  it('disables checkout when subtotal is 0', () => {
    const wrapper = createWrapper({ ...DEFAULT_PROPS, subtotal: 0 })
    expect(wrapper.findComponent(BaseButtonStub).props('disabled')).toBe(true)
  })

  it('does NOT disable checkout when shipping is 0 (shipping is optional)', () => {
    const wrapper = createWrapper({ ...DEFAULT_PROPS, shipping: 0 })
    expect(wrapper.findComponent(BaseButtonStub).props('disabled')).toBe(false)
  })

  it('enables checkout whenever subtotal is non-zero', () => {
    const wrapper = createWrapper()
    expect(wrapper.findComponent(BaseButtonStub).props('disabled')).toBe(false)
  })

  it('emits "checkout" when the button is clicked and enabled', async () => {
    const wrapper = createWrapper()

    await wrapper.find('.base-button-stub').trigger('click')

    expect(wrapper.emitted('checkout')).toHaveLength(1)
  })

  it('shows a success toast and emits checkout when shipping has been calculated', async () => {
    const wrapper = createWrapper({ ...DEFAULT_PROPS, shipping: 10 })

    await wrapper.find('.base-button-stub').trigger('click')

    expect(mockToastSuccess).toHaveBeenCalledWith('Proceeding to checkout!')
    expect(mockToastWarning).not.toHaveBeenCalled()
    expect(wrapper.emitted('checkout')).toHaveLength(1)
  })

  it('shows a warning toast instead of success when shipping is 0, but still emits checkout', async () => {
    const wrapper = createWrapper({ ...DEFAULT_PROPS, shipping: 0 })

    await wrapper.find('.base-button-stub').trigger('click')

    expect(mockToastWarning).toHaveBeenCalledWith('Proceeding without a calculated shipping cost')
    expect(mockToastSuccess).not.toHaveBeenCalled()
    expect(wrapper.emitted('checkout')).toHaveLength(1)
  })

  it('handles a total of 0 correctly (all zero inputs)', () => {
    const wrapper = createWrapper({ subtotal: 0, shipping: 0, tax: 0, total: 0 })
    expect(wrapper.text()).toContain('$0.00')
  })
})
