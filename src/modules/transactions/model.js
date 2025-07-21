import {prisma} from '../../data'

export const create = prisma.transaction.create
export const findMany = prisma.transaction.findMany
