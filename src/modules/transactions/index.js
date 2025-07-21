import { Prisma } from '@prisma/client'
import * as model from './model'

export const create = async ctx => {
try{
 const transaction = await model.create({
  data: {
    description: ctx.request.body.description,
    ...(ctx.request.body.value && { value: parseFloat(ctx.request.body.value) }),
    userId: ctx.auth.user.id,
  }
})

ctx.body = transaction
} catch(error){
  if (error instanceof Prisma.PrismaClientValidationError) {
    ctx.status = 400
    return
  }

  return Promise.reject(error)
}
}
