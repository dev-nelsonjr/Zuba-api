import { Prisma } from '@prisma/client'
import { prisma } from '../../data'

export const aggregate = prisma.transaction.aggregate
export const groupBy = prisma.transaction.groupBy
export const removeMany = prisma.transaction.deleteMany
export const findMany = prisma.transaction.findMany

const normalizeTransactionData = data => {
  if (data.value === undefined) {
    return data
  }

  const value = new Prisma.Decimal(data.value)
  const type = data.type || (value.isNegative() ? 'expense' : 'revenue')
  const absoluteValue = value.abs()

  return {
    ...data,
    type,
    value: type === 'expense' ? absoluteValue.negated() : absoluteValue,
  }
}

export const create = ({ data, ...params }) =>
  prisma.transaction.create({
    ...params,
    data: normalizeTransactionData(data),
  })

export const updateMany = ({ data, ...params }) =>
  prisma.transaction.updateMany({
    ...params,
    data: normalizeTransactionData(data),
  })
