import { prisma } from '../../data'

export const removeMany = prisma.transaction.deleteMany

export const findMany = async params => {
  const result = await prisma.transaction.findMany(params)

  return result.map(doc => ({
    ...doc,
    value: parseFloat(doc.value / 100).toFixed(2),
  }))
}

export const create = ({ data, ...params }) =>
  prisma.transaction.create({
    ...params,
    data: {
      ...data,
      value: parseFloat(data.value) * 100,
    },
  })

export const updateMany = ({ data, ...params }) =>
  prisma.transaction.updateMany({
    ...params,
    data: {
      ...data,
      value: data.value * 100,
    },
  })
