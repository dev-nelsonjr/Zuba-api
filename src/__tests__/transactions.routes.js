import request from 'supertest'
import { getUserAndToken } from '../../tests/auth'

import { prisma } from '../data'
import { app } from '../server-setup'

const server = app.listen()

afterAll(done => {
  server.close(done)
})

beforeEach(async () => {
  await prisma.transaction.deleteMany({})
  await prisma.user.deleteMany({})
})

describe('Transaction routes', () => {
  it('should throw error when try create transaction without auth', async () => {
    const res = await request(server).post('/transactions').send({
      description: 'test Transaction',
      value: '10.05',
    })

    expect(res.status).toBe(401)
  })

  it('should create transaction to logged in user', async () => {
    const transactionData = {
      description: 'test Transaction',
      value: '10.05',
    }

    const { user, token } = await getUserAndToken()

    const res = await request(server)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send(transactionData)

    expect(res.status).toBe(200)
    expect(res.body.id).toBeTruthy()
    expect(res.body.description).toBe(transactionData.description)
    expect(res.body.value).toBe(transactionData.value)
    expect(res.body.userId).toBe(user.id)
  })

  it('should throw error when try create transaction without value', async () => {
    const { token } = await getUserAndToken()

    const res = await request(server)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'No way' })

    expect(res.status).toBe(400)
  })

  it('should throw error when try create transaction without description', async () => {
    const { token } = await getUserAndToken()

    const res = await request(server)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ value: '10.05' })

    expect(res.status).toBe(400)
  })
})
