import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { prisma } from '~/data'

import { decodeBasicToken } from './services'

export const login = async ctx => {
  let email, password
  try {
    ;[email, password] = decodeBasicToken(ctx.headers.authorization)
  } catch (error) {
    ctx.status = 401
    ctx.body = { message: 'Invalid authorization header format' }
    console.log('Error decoding basic token:', error)
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      ctx.status = 404
      ctx.body = { message: 'User not found' }
      return
    }

    const passwordEqual = await bcrypt.compare(password, user.password)
    if (!passwordEqual) {
      ctx.status = 401
      ctx.body = { message: 'Invalid credentials' }
      return
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)
    ctx.body = { user, token }
  } catch (error) {
    if (error.custom) {
      ctx.status = 400
      return
    }
    ctx.status = 500
    ctx.body = { message: 'Internal server error' }
    return
  }
}

export const list = async ctx => {
  try {
    const users = await prisma.user.findMany()

    ctx.body = users
  } catch (error) {
    ctx.status = 500
    ctx.body = { message: 'Failed to retrieve users' }
    return
  }
}
export const create = async ctx => {
  try {
    const saltRounds = 10

    const hashedPassword = await bcrypt.hash(
      ctx.request.body.password,
      saltRounds
    )

    const user = await prisma.user.create({
      data: {
        name: ctx.request.body.name,
        email: ctx.request.body.email,
        password: hashedPassword,
      },
    })
    ctx.body = user
  } catch (err) {
    ctx.status = 500
    ctx.body = 'User creation error'
    return
  }
}
export const update = async ctx => {
  try {
    const { name, email, password } = ctx.request.body
    const user = await prisma.user.update({
      where: { id: ctx.params.id },
      data,
    })
    ctx.body = user
  } catch (err) {
    ctx.status = 500
    ctx.body = 'User update error'
    return
  }
}
export const remove = async ctx => {
  try {
    const user = await prisma.user.delete({
      where: { id: ctx.params.id },
    })
    ctx.body = { id: ctx.params.id, message: 'User deleted successfully' }
  } catch (err) {
    ctx.status = 500
    ctx.body = 'user deletion error'
    return
  }
}
