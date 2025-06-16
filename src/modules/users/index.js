import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { prisma } from '~/data'

export const login = async ctx => {
  try {
    const { email, password } = ctx.request.body

    const [user] = await prisma.user.findMany({
      where: { email, password },
    })

    if (!user) {
      ctx.status = 404
      return
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)
    ctx.body = { user, token }
  } catch (error) {
    ctx.status = 500
    ctx.body = 'Ups! Something went wrong'
    return
  }
}

export const list = async ctx => {
  try {
    const users = await prisma.user.findMany()

    ctx.body = users
  } catch (error) {
    ctx.status = 500
    ctx.body = 'Ups! Something went wrong'
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
    ctx.body = 'Ups! Something went wrong'
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
    ctx.body = 'Ups! Something went wrong'
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
    ctx.body = 'Ups! Something went wrong'
    return
  }
}
