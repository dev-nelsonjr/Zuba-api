import { prisma } from '../../data'

export const aggregate = prisma.transaction.aggregate
export const groupBy = prisma.transaction.groupBy
export const removeMany = prisma.transaction.deleteMany
export const findMany = prisma.transaction.findMany

export const create = ({ data, ...params }) =>
  prisma.transaction.create({
    ...params,
    data: {
      ...data,
      type: data.value > 0 ? 'revenue' : 'expense',
    },
  })

export const updateMany = ({ data, ...params }) =>
  prisma.transaction.updateMany({
    ...params,
    data: {
      ...data,
      type: data.value > 0 ? 'revenue' : 'expense',
    },
  })
