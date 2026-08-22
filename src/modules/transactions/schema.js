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

export const periodSchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce
    .number()
    .int()
    .min(2000)
    .max(2100)
    .default(() => new Date().getFullYear()),
})
