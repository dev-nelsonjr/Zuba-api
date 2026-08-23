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
  const {
    description,
    value,
    type = 'revenue',
    dueDate,
  } = ctx.request.body

  const transaction = await model.create({
    data: {
      userId: ctx.auth.user.id,
      description,
      value,
      type,
      dueDate: dueDate || new Date(),
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
    data: ctx.request.body,
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
