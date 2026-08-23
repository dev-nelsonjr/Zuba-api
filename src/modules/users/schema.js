import { z } from 'zod'

export const signupSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  password: z.string().min(4),
})

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    email: z.email().optional(),
    firebaseToken: z.string().trim().min(1).nullable().optional(),
  })
  .refine(data => Object.keys(data).length > 0)
