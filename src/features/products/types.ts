import z from 'zod'

export const createProductResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number()
})

export interface CreateProductInput {
  title: string
  price: number
}
