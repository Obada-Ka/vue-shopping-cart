import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, computed } from 'vue'

const mockProducts = ref([
  {
    id: 1,
    title: 'Wireless Earbuds',
    description: 'Noise-canceling earphones',
    image: 'https://example.com/item1.jpg',
    price: 50
  },
  {
    id: 2,
    title: 'Mechanical Keyboard',
    description: 'RGB Backlit mechanical keyboard',
    image: 'https://example.com/item2.jpg',
    price: 100
  }
])
const mockIsLoading = ref(false)
const mockError = ref<string | null>(null)
const mockLoadProducts = vi.fn()
const mockRemoveProduct = vi.fn()
const mockClearProducts = vi.fn()

const mockCartItems = ref([
  { productId: 1, name: 'Wireless Earbuds', price: 50, quantity: 1, total: 50 },
  { productId: 2, name: 'Mechanical Keyboard', price: 100, quantity: 2, total: 200 }
])
const mockCartTotal = computed(() => mockCartItems.value.reduce((sum, item) => sum + item.total, 0))
const mockItemCount = computed(() =>
  mockCartItems.value.reduce((sum, item) => sum + item.quantity, 0)
)
const mockUpdateQuantity = vi.fn()
const mockRemoveFromCart = vi.fn()
const mockClearCart = vi.fn()

const mockShippingCost = ref<number | null>(15)
const mockIsCalculating = ref(false)
const mockCalculateShipping = vi.fn()
const mockResetShipping = vi.fn()

vi.mock('@/features/products', () => ({
  useProducts: () => ({
    products: mockProducts,
    isLoading: mockIsLoading,
    error: mockError,
    loadProducts: mockLoadProducts,
    removeProduct: mockRemoveProduct,
    clearProducts: mockClearProducts
  })
}))

vi.mock('@/features/cart', () => ({
  useCart: () => ({
    items: mockCartItems,
    itemCount: mockItemCount,
    cartTotal: mockCartTotal,
    updateQuantity: mockUpdateQuantity,
    removeFromCart: mockRemoveFromCart,
    clearCart: mockClearCart
  })
}))

vi.mock('@/features/shipping', () => ({
  useShipping: () => ({
    cost: mockShippingCost,
    isCalculating: mockIsCalculating,
    calculateShipping: mockCalculateShipping,
    resetShipping: mockResetShipping
  })
}))

import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton/index.ts'
import CartSummary from '@/features/cart/components/CartSummary.vue'
import ClearProducts from '@/features/products/components/ClearProducts.vue'

import ShoppingCartPage from './ShoppingCartPage.vue'

describe('ShoppingCartPage.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockIsLoading.value = false
    mockError.value = null
    mockShippingCost.value = 15

    mockProducts.value = [
      {
        id: 1,
        title: 'Wireless Earbuds',
        description: 'Noise-canceling earphones',
        image: 'https://example.com/item1.jpg',
        price: 50
      },
      {
        id: 2,
        title: 'Mechanical Keyboard',
        description: 'RGB Backlit mechanical keyboard',
        image: 'https://example.com/item2.jpg',
        price: 100
      }
    ]

    mockCartItems.value = [
      { productId: 1, name: 'Wireless Earbuds', price: 50, quantity: 1, total: 50 },
      { productId: 2, name: 'Mechanical Keyboard', price: 100, quantity: 2, total: 200 }
    ]
  })

  const createWrapper = () => {
    return mount(ShoppingCartPage, {
      global: {
        stubs: {
          ProductCardSkeleton: { template: '<div class="skeleton-stub"></div>' },
          ProductCard: {
            template: '<div class="product-card-stub" data-testid="product-card"></div>',
            props: ['product']
          },
          CartHeaders: true,
          CartSummary: true,
          AddProduct: true,
          ClearProducts: {
            template: '<button class="clear-products-stub" @click="$emit(\'clear\')">Clear</button>'
          },
          ShippingCalculator: true,
          X: true
        }
      }
    })
  }

  it('renders cart page components when products exist', () => {
    const wrapper = createWrapper()

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findAll('.product-card-stub')).toHaveLength(2)
    expect(wrapper.findAll('.skeleton-stub')).toHaveLength(0)
    expect(mockLoadProducts).toHaveBeenCalledTimes(1)
  })

  it('shows 5 skeletons while products are loading', () => {
    mockIsLoading.value = true

    const wrapper = createWrapper()

    expect(wrapper.findAllComponents(ProductCardSkeleton)).toHaveLength(5)
    expect(wrapper.findAll('.product-card-stub')).toHaveLength(0)
  })

  it('displays empty cart UI when no products exist and loading is complete', () => {
    mockProducts.value = []
    mockCartItems.value = []

    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Your cart is empty')
    expect(wrapper.findAll('.product-card-stub')).toHaveLength(0)
    expect(wrapper.find('.clear-products-stub').exists()).toBe(false)
  })

  it('calculates totals correctly (Subtotal + Tax 20% + Shipping)', () => {
    const wrapper = createWrapper()
    const summaryComponent = wrapper.findComponent(CartSummary)

    expect(summaryComponent.props('subtotal')).toBe(250)
    expect(summaryComponent.props('tax')).toBe(50)
    expect(summaryComponent.props('shipping')).toBe(15)
    expect(summaryComponent.props('total')).toBe(315)
  })

  it('opens and closes mobile summary drawer on button toggle', async () => {
    const wrapper = createWrapper()

    const toggleBtn = wrapper.find('button[type="button"]')
    expect(toggleBtn.text()).toContain('View Cart Summary')

    await toggleBtn.trigger('click')

    expect(document.body.classList.contains('overflow-hidden')).toBe(true)
  })

  it('triggers clear all handlers when ClearProducts emits clear event', async () => {
    const wrapper = createWrapper()
    const clearBtn = wrapper.findComponent(ClearProducts)

    expect(clearBtn.exists()).toBe(true)
    await clearBtn.find('button').trigger('click')

    expect(mockClearProducts).toHaveBeenCalledTimes(1)
    expect(mockClearCart).toHaveBeenCalledTimes(1)
    expect(mockResetShipping).toHaveBeenCalledTimes(1)
  })
})
