import {prisma} from '../../data'

export const create = prisma.transaction.create
export const findMany = prisma.transaction.findMany
export const update = prisma.transaction.updateMany
