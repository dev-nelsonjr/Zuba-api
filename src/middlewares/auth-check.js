import jwt from 'jsonwebtoken'
import * as userModel from '../modules/users/model'

export const decodeBearerToken = bearerToken => {
  if (!bearerToken) {
    return false
  }

  const [type, token] = bearerToken.split(' ')

  if (type !== 'Bearer') {
    return false
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    return false
  }
}

export const authCheck = async (ctx, next) => {
  const decodedToken = decodeBearerToken(ctx.headers.authorization)

  if (!decodedToken?.sub) {
    ctx.status = 401
    return
  }

  const user = await userModel.findUnique({
    where: { id: decodedToken.sub },
  })

  if (user) {
    ctx.auth = { user }
    return next()
  }

  ctx.status = 401
}
