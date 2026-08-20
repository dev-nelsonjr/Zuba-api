import { z } from 'zod'

const money = z.union([
  z.number().finite(),
  z.string().regex(/^-?\d+(\.\d{1,2})?$/),
])

export const createTransactionSchema = z.object({
  description: z.string().trim().min(1),
  value: money,
  dueDate: z.iso.datetime({ offset: true }).optional(),
  type: z.enum(['expense', 'revenue']).optional(),
})
