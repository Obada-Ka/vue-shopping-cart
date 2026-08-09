import { z } from 'zod'

export const cartItemSchema = z.object({
  productId: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
  total: z.number()
})

export type CartItem = z.infer<typeof cartItemSchema>
