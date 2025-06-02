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
  const user = await prisma.user.update({
    where: { id: ctx.params.id },
    data: ctx.request.body,
  })
  ctx.body = 'List of users'
}
export const remove = async ctx => {
  const user = await prisma.user.delete({
    where: { id: ctx.params.id },
  })
  ctx.body = 'List of users'
}
