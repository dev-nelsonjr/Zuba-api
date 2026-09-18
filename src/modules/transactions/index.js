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
  const { description, value, type, dueDate } = ctx.request.body

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

  if (!transaction.count) {
    ctx.status = 404
    ctx.body = { error: 'Transaction not found' }
    return
  }

  ctx.body = transaction
}

export const remove = async ctx => {
  const transaction = await model.removeMany({
    where: {
      id: ctx.params.id,
      userId: ctx.auth.user.id,
    },
  })

  if (!transaction.count) {
    ctx.status = 404
    ctx.body = { error: 'Transaction not found' }
    return
  }

  ctx.body = { id: ctx.params.id }
}
