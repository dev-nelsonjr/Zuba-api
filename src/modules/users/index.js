import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { omit } from 'ramda'

import * as model from './model'
import { decodeBasicToken } from './services'

const sanitizeUser = user => omit(['password'], user)

export const login = async ctx => {
  try {
    const [email, password] = decodeBasicToken(
      ctx.request.headers.authorization
    )

    const user = await model.findUnique({
      where: { email, password },
    })

    if (!user) {
      ctx.status = 404
      return
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)
    ctx.body = { user: sanitizeUser(user), token }
  } catch (error) {
    if (error.custom) {
      ctx.status = 400
      return
    }

    throw error
  }
}

export const signup = async ctx => {
  const saltRounds = 10

  const hashedPassword = await bcrypt.hash(ctx.request.body.password, saltRounds)

  const user = await model.create({
    data: {
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      password: hashedPassword,
    },
  })

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)
  ctx.body = { user: sanitizeUser(user), token }
}

export const update = async ctx => {
  const { name, email, firebaseToken } = ctx.request.body

  const user = await model.update({
    where: { id: ctx.auth.user.id },
    data: { name, email, firebaseToken },
  })

  ctx.body = sanitizeUser(user)
}

export const remove = async ctx => {
  await model.remove({
    where: { id: ctx.auth.user.id },
  })

  ctx.body = { id: ctx.auth.user.id }
}
