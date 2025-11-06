import { prisma } from '../../data'

export const aggregate = prisma.transaction.aggregate
export const removeMany = prisma.transaction.deleteMany
export const findMany = prisma.transaction.findMany
export const create = prisma.transaction.create
export const updateMany = prisma.transaction.updateMany