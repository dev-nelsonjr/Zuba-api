import * as model from './model'

import * as services from './services'

export const list = async ctx => {
  const { month, year } = ctx.state.validatedQuery
  const transactions = await services.getListByMonth({
    month: month - 1,
    year,
    userId: ctx.auth.user.id,
  })

  ctx.body = transactions
}

export const create = async ctx => {
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
