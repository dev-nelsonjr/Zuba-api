import { Prisma } from '@prisma/client'

import * as model from './model'

export const create = async ctx => {
try{
 const transaction = await model.create({
  data: {
    ...ctx.request.body,
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
