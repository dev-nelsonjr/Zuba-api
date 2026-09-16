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
  it('should reject transaction creation without authentication', async () => {
    const res = await request(server).post('/transactions').send({
      description: 'Test transaction',
      value: '10.05',
    })

    expect(res.status).toBe(401)
  })

  it('should return unauthorized with invalid token', async () => {
    const res = await request(server)
      .post('/transactions')
      .set('Authorization', 'Bearer invalid-token')
      .send({
        description: 'Test transaction',
        value: '10.05',
      })

    expect(res.status).toBe(401)
  })

  it('should create a transaction for the authenticated user', async () => {
    const transactionData = {
      description: 'Test transaction',
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

  it('should reject transaction creation without a value', async () => {
    const { token } = await getUserAndToken()

    const res = await request(server)
      .post('/transactions')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Missing value' })

    expect(res.status).toBe(400)
  })

  it('should reject transaction creation without a description', async () => {
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

  it('should update transaction status', async () => {
    const { user, token } = await getUserAndToken()
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        description: 'Electricity bill',
        value: '-75.00',
        type: 'expense',
      },
    })

    const res = await request(server)
      .put(`/transactions/${transaction.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ resolved: true })

    const updatedTransaction = await prisma.transaction.findUnique({
      where: { id: transaction.id },
    })

    expect(res.status).toBe(200)
    expect(res.body.count).toBe(1)
    expect(updatedTransaction.resolved).toBe(true)
  })

  it('should delete a transaction owned by the authenticated user', async () => {
    const { user, token } = await getUserAndToken()
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        description: 'Old transaction',
        value: '25.00',
        type: 'revenue',
      },
    })

    const res = await request(server)
      .delete(`/transactions/${transaction.id}`)
      .set('Authorization', `Bearer ${token}`)

    const deletedTransaction = await prisma.transaction.findUnique({
      where: { id: transaction.id },
    })

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(transaction.id)
    expect(deletedTransaction).toBeNull()
  })

  it('should not delete a transaction owned by another user', async () => {
    const { user } = await getUserAndToken()
    const { token } = await getUserAndToken({ email: 'other@test.com' })
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        description: 'Private transaction',
        value: '25.00',
        type: 'revenue',
      },
    })

    await request(server)
      .delete(`/transactions/${transaction.id}`)
      .set('Authorization', `Bearer ${token}`)

    const storedTransaction = await prisma.transaction.findUnique({
      where: { id: transaction.id },
    })

    expect(storedTransaction).not.toBeNull()
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
