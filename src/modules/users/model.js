import bcrypt from 'bcrypt'
import { omit } from 'ramda'
import { prisma } from '../../data/index.js'

const passwordCheck = async (params, next) => {
  const { password: passwordPlainText, ...where } = params.args.where

  const result = await next({
    ...params,
    args: {
      ...params.args,
      where,
    },
  })

  if (!result || !passwordPlainText) {
    return null
  }

  const passwordEquals = await bcrypt.compare(passwordPlainText, result.password)
  if (!passwordEquals) {
    return null
  }

  return result
}

prisma.$use(async (params, next) => {
  if (params.model !== 'User' || params.action !== 'findUnique') {
    return next(params)
  }

  const result = params.args.where && params.args.where.password
    ? await passwordCheck(params, next)
    : await next(params)

  if (result) {
    return omit(['password'], result)
  }

  return result
})
