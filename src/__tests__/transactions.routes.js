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

  it('should return unauthorized with invalid token', async () => {
    const res = await request(server)
      .post('/transactions')
      .set('Authorization', 'Bearer invalid-token')
      .send({
        description: 'test Transaction',
        value: '10.05',
      })

    expect(res.status).toBe(401)
  })

  it('should create transaction to logged in user', async () => {
    const transactionData = {
      description: 'test Transaction',
      value: '10.05',
      type: 'expense',
    }

    const { user, token } = await getUserAndToken()

    const res = await request(server)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send(transactionData)

    expect(res.status).toBe(200)
    expect(res.body.id).toBeTruthy()
    expect(res.body.description).toBe(transactionData.description)
    expect(res.body.value).toBe('-10.05')
    expect(res.body.type).toBe(transactionData.type)
    expect(res.body.dueDate).toBeTruthy()
    expect(res.body.userId).toBe(user.id)
  })

  it('should infer expense type from a negative value', async () => {
    const { token } = await getUserAndToken()

    const res = await request(server)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'Inferred expense',
        value: '-10.05',
      })

    expect(res.status).toBe(200)
    expect(res.body.type).toBe('expense')
    expect(res.body.value).toBe('-10.05')
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

  it('should reject transaction with invalid value', async () => {
    const { token } = await getUserAndToken()

    const res = await request(server)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Invalid transaction', value: 'ten' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Invalid request body')
  })

  it('should reject transaction update with invalid value', async () => {
    const { token } = await getUserAndToken()

    const res = await request(server)
      .put('/transactions/transaction-id')
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 'ten' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Invalid request body')
  })

  it('should reject dashboard request with invalid period', async () => {
    const { token } = await getUserAndToken()

    const res = await request(server)
      .get('/dashboard')
      .query({ month: 13, year: 2025 })
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Invalid query parameters')
  })

  it('should accept dashboard request without year for older clients', async () => {
    const { token } = await getUserAndToken()

    const res = await request(server)
      .get('/dashboard')
      .query({ month: 1 })
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
  })
})
