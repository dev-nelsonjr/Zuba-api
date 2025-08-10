import jwt from 'jsonwebtoken'

import * as model from './model'
import * as userModel from '../users/model'

export const create = async ctx => {
 if (!ctx?.request?.headers?.authorization){
  ctx.status = 401
  return false
 }

 const [type, token] = ctx?.request?.headers?.authorization.split(' ')

 if( type !== 'Bearer' ){
  ctx.status = 401
  return false
 }

 const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

const user = await userModel.findUnique({
 where: { id: decodedToken.sub },
})

 if(!user){
  ctx.status = 401
  return false
 }

 const transaction = await model.create({
  data: {
    ...ctx.request.body,
    userId: user.id,
  }
 })

 ctx.body = transaction
}
