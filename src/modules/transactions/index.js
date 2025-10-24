import { Prisma } from '@prisma/client'
import * as model from './model'

export const create = async ctx => {
  try {
    const transaction = await model.create({
      data: {
        userId: ctx.auth.user.id,
        description: ctx.request.body.description,
        dueDate: ctx.request.body.dueDate,

        ...(ctx.request.body.dueDate && { dueDate: ctx.request.body.dueDate }),

        ...(ctx.request.body.value && {
          value: parseFloat(ctx.request.body.value),
        }),
      },
    })

    ctx.body = transaction
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      ctx.status = 400
      return
    }

    return Promise.reject(error)
  }
}

export const list = async ctx => {
  const month = ctx.request.query.month - 1

  const transactions = await model.findMany({
    where: {
      userId: ctx.auth.user.id,
      dueDate: {
        gte: new Date(2025, month, 1),
        lt: new Date(2025, month + 1, 1),
      },
    },
  })

  ctx.body = transactions
}


export const update = async ctx => {
  const transaction = await model.updateMany({
    where: {
      id: ctx.params.id,
      userId: ctx.auth.user.id,
    },
    data: {
      description: ctx.request.body.description,
      ...(ctx.request.body.value && {
        value: parseFloat(ctx.request.body.value),
      }),

      ...(ctx.request.body.dueDate && { dueDate: ctx.request.body.dueDate }),
    },
  })

  ctx.body = transaction
}

export const remove = async ctx => {
  await model.removeMany({
    where: {
      id: ctx.params.id,
      userId: ctx.auth.user.id,
    },
  })

  ctx.body = { id: ctx.params.id }
}
