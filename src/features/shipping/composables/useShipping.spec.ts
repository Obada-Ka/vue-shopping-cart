import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useShipping } from './useShipping'

describe('useShipping', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('exposes the store state with initial values', () => {
    const { cost, isCalculating } = useShipping()
    expect(cost.value).toBeNull()
    expect(isCalculating.value).toBe(false)
  })

  it('cost and isCalculating stay reactive after destructuring (storeToRefs)', () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    const { cost, isCalculating, calculateShipping } = useShipping()

    calculateShipping()
    expect(isCalculating.value).toBe(true)

    vi.advanceTimersByTime(500)

    expect(isCalculating.value).toBe(false)
    expect(cost.value).toBe(15)
  })

  it('calculateShipping delegates to the store and produces a cost', () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0)

    const { cost, calculateShipping } = useShipping()
    calculateShipping()
    vi.advanceTimersByTime(500)

    expect(cost.value).toBe(5)
  })

  it('resetShipping delegates to the store and clears cost', () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    const { cost, calculateShipping, resetShipping } = useShipping()
    calculateShipping()
    vi.advanceTimersByTime(500)
    expect(cost.value).not.toBeNull()

    resetShipping()

    expect(cost.value).toBeNull()
  })

  it('two calls to useShipping() share the same underlying store (Pinia singleton)', () => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    const first = useShipping()
    const second = useShipping()

    first.calculateShipping()
    vi.advanceTimersByTime(500)

    expect(second.cost.value).toBe(first.cost.value)
  })
})
