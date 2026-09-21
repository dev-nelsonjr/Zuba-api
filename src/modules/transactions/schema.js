import { z } from 'zod'

const money = z.union([
  z.number().finite(),
  z.string().regex(/^-?\d+(\.\d{1,2})?$/),
])

const dueDate = z.iso.datetime({ offset: true }).refine(value => {
  const today = new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Sao_Paulo',
  })

  return value.slice(0, 10) >= today
})

export const createTransactionSchema = z.object({
  description: z.string().trim().min(1),
  value: money,
  dueDate: dueDate.optional(),
  type: z.enum(['expense', 'revenue']).optional(),
})

export const updateTransactionSchema = createTransactionSchema
  .partial()
  .extend({
    resolved: z.boolean().optional(),
  })
  .refine(data => Object.keys(data).length > 0)
  .refine(data => !data.type || data.value !== undefined)

export const periodSchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce
    .number()
    .int()
    .min(2000)
    .max(2100)
    .default(() => new Date().getFullYear()),
})
