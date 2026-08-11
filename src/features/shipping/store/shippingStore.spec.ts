import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useShippingStore } from './shippingStore'

describe('shippingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('starts with cost null and isCalculating false', () => {
    const store = useShippingStore()
    expect(store.cost).toBeNull()
    expect(store.isCalculating).toBe(false)
  })

  it('sets isCalculating true immediately when calculateShipping is called', () => {
    vi.useFakeTimers()
    const store = useShippingStore()

    store.calculateShipping()

    expect(store.isCalculating).toBe(true)
    expect(store.cost).toBeNull()
  })

  it('sets a cost within the 5.00–25.00 range after the mocked delay, and clears isCalculating', () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    const store = useShippingStore()
    store.calculateShipping()

    vi.advanceTimersByTime(500)

    expect(store.cost).toBe(15)
    expect(store.isCalculating).toBe(false)
  })

  it('rounds the cost to 2 decimal places', () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0.123456)

    const store = useShippingStore()
    store.calculateShipping()
    vi.advanceTimersByTime(500)

    expect(store.cost).toBe(7.47)
  })

  it('resetShipping sets cost back to null', () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    const store = useShippingStore()
    store.calculateShipping()
    vi.advanceTimersByTime(500)
    expect(store.cost).not.toBeNull()

    store.resetShipping()

    expect(store.cost).toBeNull()
  })

  it('resetShipping is a no-op (still null) when nothing was calculated yet', () => {
    const store = useShippingStore()
    store.resetShipping()
    expect(store.cost).toBeNull()
  })
})
