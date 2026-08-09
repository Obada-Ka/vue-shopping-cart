import z from 'zod'

import { productSchema, type Product } from '@/domain/product/product.schema'

const PRODUCTS_API_URL = 'https://fakestoreapi.com/products'

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_API_URL)
  console.log('url', PRODUCTS_API_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`)
  }
  const json: unknown = await response.json()
  console.log('Fetched products:', json)
  return z.array(productSchema).parse(json)
}
