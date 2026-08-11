import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createNewProduct, fetchProducts } from './productsApi'

const VALID_PRODUCT = {
  id: 1,
  title: 'Backpack',
  price: 109.95,
  description: 'A great backpack',
  category: "men's clothing",
  image: 'https://example.com/backpack.png'
}

function mockFetchOnce(response: Partial<Response> & { jsonValue?: unknown }): void {
  const { jsonValue, ...rest } = response

  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve(jsonValue),
      ...rest
    })
  )
}

describe('productsApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('fetchProducts', () => {
    it('returns a validated array of products on success', async () => {
      mockFetchOnce({
        jsonValue: [VALID_PRODUCT]
      })

      const result = await fetchProducts()

      expect(result).toEqual([VALID_PRODUCT])

      expect(globalThis.fetch).toHaveBeenCalledWith('https://fakestoreapi.com/products')
    })

    it('throws when the response is not ok', async () => {
      mockFetchOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        jsonValue: []
      })

      await expect(fetchProducts()).rejects.toThrow(/Failed to fetch products/)
    })

    it('throws via Zod when the response array contains a malformed product', async () => {
      mockFetchOnce({
        jsonValue: [
          {
            id: 1,
            title: 'Missing fields'
          }
        ]
      })

      await expect(fetchProducts()).rejects.toThrow()
    })

    it('throws via Zod when the response is not an array', async () => {
      mockFetchOnce({
        jsonValue: {
          notAnArray: true
        }
      })

      await expect(fetchProducts()).rejects.toThrow()
    })

    it('returns an empty array when the API returns an empty array', async () => {
      mockFetchOnce({
        jsonValue: []
      })

      const result = await fetchProducts()

      expect(result).toEqual([])
    })
  })

  describe('createNewProduct', () => {
    it('POSTs the input and returns a Product with placeholder fields filled in', async () => {
      mockFetchOnce({
        jsonValue: {
          id: 21,
          title: 'New Product',
          price: 29
        }
      })

      const result = await createNewProduct({
        title: 'New Product',
        price: 29
      })

      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://fakestoreapi.com/products',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: 'New Product',
            price: 29
          })
        })
      )

      expect(result).toEqual({
        id: 21,
        title: 'New Product',
        price: 29,
        description: 'No description available',
        category: 'uncategorized',
        image: ''
      })
    })

    it('throws when the response is not ok', async () => {
      mockFetchOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        jsonValue: {}
      })

      await expect(
        createNewProduct({
          title: 'X',
          price: 1
        })
      ).rejects.toThrow(/Failed to fetch product/)
    })

    it('throws via Zod when the response is missing required fields', async () => {
      mockFetchOnce({
        jsonValue: {
          id: 21
        }
      })

      await expect(
        createNewProduct({
          title: 'X',
          price: 1
        })
      ).rejects.toThrow()
    })
  })
})
