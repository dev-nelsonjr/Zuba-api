import {prisma} from '../../data'

export const create = prisma.transaction.create
