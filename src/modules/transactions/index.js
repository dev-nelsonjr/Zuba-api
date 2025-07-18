import * as model from './model'

export const create = async ctx => {
 if (!ctx?.request?.headers?.authorization){
  ctx.status = 401
  return
 }

 const transaction = await model.create({
  data: ctx.request.body,
 })

 ctx.body = transaction
}
