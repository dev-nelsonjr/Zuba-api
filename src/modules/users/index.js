import { prisma } from '~/data'

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
    const user = await prisma.user.create({
      data: ctx.request.body,
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
