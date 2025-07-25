import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { prisma } from '../../data/index.js'
import { decodeBasicToken } from './services.js'
import './model.js'

export const login = async ctx => {
  let email, password
  try {
    ;[email, password] = decodeBasicToken(ctx.request.headers.authorization)

    const user = await prisma.user.findUnique({
      where: { email, password: password },
    })

    if (!user) {
      ctx.status = 401
      ctx.body = { message: 'Invalid credentials' }
      return
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)
    ctx.body = { user, token }
  } catch (error) {
    if (error.custom) {
      ctx.status = 401
      ctx.body = { message: error.message }
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

    const { name, email, password } = ctx.request.body

    if (!email || !password) {
      ctx.status = 400
      ctx.body = { message: 'Email and password are required.' }
      return
    }

    const hashedPassword = await bcrypt.hash(
      password,
      saltRounds
    )

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    })
    ctx.body = user
  } catch (err) {
    console.error('User creation error:', err)
    ctx.status = 500
    ctx.body = { message: 'User creation error' }
    return
  }
}

export const update = async ctx => {
  try {
    const { name, email, password } = ctx.request.body

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (email) dataToUpdate.email = email;
    if (password) dataToUpdate.password = await bcrypt.hash(password, 10)

    const user = await prisma.user.update({
      where: { id: ctx.params.id },
      data: dataToUpdate,
    })
    ctx.body = user
  } catch (err) {
    console.error('User update error:', err)
    ctx.status = 500
    ctx.body = { message: 'User update error' }
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
    console.error('User deletion error:', err)
    ctx.status = 500
    ctx.body = { message: 'User deletion error' }
    return
  }
}
