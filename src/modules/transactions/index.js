import { Prisma } from '@prisma/client'
import * as model from './model'

import * as services from './services'

export const list = async ctx => {
  const transactions = await services.getListByMonth({
    month: ctx.request.query.month,
    userId: ctx.auth.user.id,
  })

  ctx.body = transactions
}

export const create = async ctx => {
  try {
    const transaction = await model.create({
      data: {
        userId: ctx.auth.user.id,
        description: ctx.request.body.description,

        ...(ctx.request.body.dueDate && {
          dueDate: ctx.request.body.dueDate,
        }),

        ...(ctx.request.body.value && {
          value: ctx.request.body.value,
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

export const update = async ctx => {
  const transaction = await model.updateMany({
    where: {
      id: ctx.params.id,
      userId: ctx.auth.user.id,
    },
    data: {
      description: ctx.request.body.description,
      ...(ctx.request.body.value && {
        value: ctx.request.body.value,
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

export const balance = async ctx => {
  ctx.body = 100000
}
