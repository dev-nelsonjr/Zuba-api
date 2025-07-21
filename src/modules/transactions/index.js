import * as model from './model'

export const create = async ctx => {
 const transaction = await model.create({
  data: {
    ...ctx.request.body,
    userId: ctx.auth.user.id,
  }
 })

 ctx.body = transaction
}
