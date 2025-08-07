import bcrypt from 'bcrypt'
import { omit } from 'ramda'
import { prisma } from '../../data'

export const findMany = prisma.user.findMany
export const create = prisma.user.create
export const update = prisma.user.update
export const remove = prisma.user.delete

export const findUnique = async params => {
  const { password: passwordPlainText, ...where } = params.where

  const result = await prisma.user.findUnique({
    ...params,
    where
  })

  if (!result || !passwordPlainText) {
    return result
  }

  const passwordEqual = await bcrypt.compare(passwordPlainText, result.password)

  if (!passwordEqual) {
    return false
  }

  return omit(['password'], result)
}
