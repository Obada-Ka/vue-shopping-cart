import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import ClearProducts from './ClearProducts.vue'

const mockIsLoading = ref(false)

vi.mock('../composables/useProducts', () => ({
  useProducts: () => ({
    isLoading: mockIsLoading
  })
}))

const BaseButtonStub = {
  name: 'BaseButton',
  props: ['loading', 'color', 'size'],
  emits: ['clear'],
  template: '<button class="base-button-stub" @click="$emit(\'clear\')"><slot /></button>'
}

describe('ClearProducts', () => {
  beforeEach(() => {
    mockIsLoading.value = false
  })

  it('renders the "Clear Cart" label', () => {
    const wrapper = mount(ClearProducts, { global: { stubs: { BaseButton: BaseButtonStub } } })
    expect(wrapper.text()).toContain('Clear Cart')
  })

  it('emits "clear" when clicked', async () => {
    const wrapper = mount(ClearProducts, { global: { stubs: { BaseButton: BaseButtonStub } } })

    await wrapper.find('.base-button-stub').trigger('click')

    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it("forwards isLoading to BaseButton's loading prop", () => {
    mockIsLoading.value = true
    const wrapper = mount(ClearProducts, { global: { stubs: { BaseButton: BaseButtonStub } } })

    expect(wrapper.findComponent(BaseButtonStub).props('loading')).toBe(true)
  })
})
