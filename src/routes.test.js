import request from 'supertest'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { prisma } from './data'
import { app } from './server-setup'

const server = app.listen()

beforeEach(async () => {
  await prisma.transaction.deleteMany({})
  await prisma.user.deleteMany({})
})

describe('User routes', () => {
  it('should return not found with wrong password', async () => {
    //setup
    const email = 'test@test.com'
    const password = 'wrong'

    //execute
    const result = await request(server).post('/login').auth(email, password)

    //expec
    expect(result.status).toBe(404)
  })

  it('should return not found with wrong email', async () => {
    //setup
    const email = 'wrong@wrong.com'
    const password = '1234'

    //execute
    const result = await request(server).post('/login').auth(email, password)

    //expec
    expect(result.status).toBe(404)
  })

  it('should return logged in user by correct credentials', async () => {
    //setup
    const email = 'test@test.com'
    const password = '1234'

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds).then()

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    })
    //execute
    const result = await request(server).post('/login').auth(email, password)
    const decodedToken = jwt.verify(result.body.token, process.env.JWT_SECRET)

    //expec
    expect(result.status).toBe(200)
    expect(result.body.user).toBeTruthy()
    expect(result.body.token).toBeTruthy()
    expect(result.body.user.id).toBe(user.id)
    expect(result.body.user.email).toBe(email)
    expect(result.body.user.password).toBeFalsy()

    expect(decodedToken.sub).toBe(user.id)
  })
})

describe('Transaction routes', () => {
  
  it('should throw error when try create transaction without auth', async() => {
    const res = await request(server).post('/transactions').send({
      description: 'test Transaction',
      value: 10.05,
    })

    expect(res.status).toBe(401)
  })

  it.todo('should create transaction to logged in user')

  it.todo('should throw error when try create transaction without value')
})
