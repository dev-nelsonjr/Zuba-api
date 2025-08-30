import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { prisma } from '../src/data'

 const findOrCreate = async({ where, data }) => {
  const user = await prisma.user.findUnique({ where })
  return user || prisma.user.create({ data })
}

export const getUserAndToken = async ({ email = 'test@test.com', password = '1234' } = {}) => {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  const user = await findOrCreate({
    where: { email },
    data: { email, password: hashedPassword }
  })

  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)

  return { token, user }
}
