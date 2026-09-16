import request from 'supertest'
import jwt from 'jsonwebtoken'
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

describe('User routes', () => {
  it('should return not found for an incorrect password', async () => {
    const email = 'test@test.com'
    const password = 'wrong'

    const result = await request(server).post('/login').auth(email, password)

    expect(result.status).toBe(404)
  })

  it('should return not found for an unknown email', async () => {
    const email = 'wrong@wrong.com'
    const password = '1234'

    const result = await request(server).post('/login').auth(email, password)

    expect(result.status).toBe(404)
  })

  it('should authenticate a user with valid credentials', async () => {
    const email = 'unique@test.com'
    const password = '1234'
    const { user } = await getUserAndToken({ email, password })

    const result = await request(server).post('/login').auth(email, password)
    const decodedToken = jwt.verify(result.body.token, process.env.JWT_SECRET)

    expect(result.status).toBe(200)
    expect(result.body.user).toBeTruthy()
    expect(result.body.token).toBeTruthy()
    expect(result.body.user.id).toBe(user.id)
    expect(result.body.user.email).toBe(email)
    expect(result.body.user.password).toBeFalsy()

    expect(decodedToken.sub).toBe(user.id)
  })

  it('should create user without returning password', async () => {
    const userData = {
      name: 'New User',
      email: 'new-user@test.com',
      password: '1234',
    }

    const result = await request(server).post('/signup').send(userData)

    expect(result.status).toBe(200)
    expect(result.body.user.name).toBe(userData.name)
    expect(result.body.user.email).toBe(userData.email)
    expect(result.body.user.password).toBeFalsy()
    expect(result.body.token).toBeTruthy()
  })

  it('should reject signup with invalid email', async () => {
    const result = await request(server).post('/signup').send({
      name: 'New User',
      email: 'invalid-email',
      password: '1234',
    })

    expect(result.status).toBe(400)
    expect(result.body.error).toBe('Invalid request body')
  })

  it('should update profile without returning password', async () => {
    const { user, token } = await getUserAndToken()
    const firebaseToken = 'firebase-token'

    const result = await request(server)
      .put('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ firebaseToken })

    expect(result.status).toBe(200)
    expect(result.body.id).toBe(user.id)
    expect(result.body.firebaseToken).toBe(firebaseToken)
    expect(result.body.password).toBeFalsy()
  })

  it('should reject profile update with invalid email', async () => {
    const { token } = await getUserAndToken()

    const result = await request(server)
      .put('/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'invalid-email' })

    expect(result.status).toBe(400)
    expect(result.body.error).toBe('Invalid request body')
  })
})
