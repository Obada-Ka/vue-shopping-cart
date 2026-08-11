import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import AddProduct from './AddProduct.vue'

const mockAddProduct = vi.fn()
const mockIsLoading = ref(false)

vi.mock('../composables/useProducts', () => ({
  useProducts: () => ({
    addProduct: mockAddProduct,
    isLoading: mockIsLoading
  })
}))

const BaseButtonStub = {
  name: 'BaseButton',
  props: ['loading', 'color', 'size'],
  emits: ['click'],
  template: '<button class="base-button-stub" @click="$emit(\'click\')"><slot /></button>'
}

describe('AddProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockIsLoading.value = false
  })

  it('renders the "Add Item" label', () => {
    const wrapper = mount(AddProduct, { global: { stubs: { BaseButton: BaseButtonStub } } })
    expect(wrapper.text()).toContain('Add Item')
  })

  it('calls addProduct with the fixed { title, price } payload on click', async () => {
    const wrapper = mount(AddProduct, { global: { stubs: { BaseButton: BaseButtonStub } } })

    await wrapper.find('.base-button-stub').trigger('click')

    expect(mockAddProduct).toHaveBeenCalledWith({ title: 'New Product', price: 29 })
    expect(mockAddProduct).toHaveBeenCalledTimes(1)
  })

  it("forwards isLoading to BaseButton's loading prop", () => {
    mockIsLoading.value = true
    const wrapper = mount(AddProduct, { global: { stubs: { BaseButton: BaseButtonStub } } })

    expect(wrapper.findComponent(BaseButtonStub).props('loading')).toBe(true)
  })
})
