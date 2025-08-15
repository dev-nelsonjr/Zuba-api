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

export const list = async ctx => {
  try {
    const transactions = await model.findMany({
      where: {
        userId: ctx.auth.user.id
      }
    })
    ctx.body = transactions
  } catch (error) {
    console.error(error)
    ctx.status = 500;
    ctx.body = { message: 'internal server error' };
  }
}

export const update = async ctx => {
  const transaction = await model.updateMany({
    where: {
       id: ctx.params.id,
       userId: ctx.auth.user.id
      },
    data: {
      description: ctx.request.body.description,
      value: parseFloat(ctx.request.body.value),
      },
  })

  ctx.body = transaction
}

export const remove = async ctx => {
  await model.removeMany({
    where: {
      id: ctx.params.id,
      userId: ctx.auth.user.id
    }
  })

  ctx.body = { id: ctx.params.id }
}
