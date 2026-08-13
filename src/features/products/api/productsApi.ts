import z from 'zod'

import { productSchema, type Product } from '@/domain/product/product.schema'

import { createProductResponseSchema, type CreateProductInput } from '../types'

const PRODUCTS_API_URL = import.meta.env.VITE_PRODUCTS_API_URL

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_API_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`)
  }
  const json: unknown = await response.json()
  return z.array(productSchema).parse(json)
}

export async function createNewProduct(productInput: CreateProductInput): Promise<Product> {
  const response = await fetch(PRODUCTS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productInput)
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`)
  }
  const json: unknown = await response.json()
  const created = createProductResponseSchema.parse(json)
  return {
    ...created,
    description: 'No description available',
    category: 'uncategorized',
    image: ''
  }
}
