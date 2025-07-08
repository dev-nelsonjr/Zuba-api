import request from 'supertest'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { prisma } from '../src/data'

import { app } from './server-setup.js'

const server = app.listen()

describe("users routes", () => {
  beforeAll(async () => {
   await prisma.user.deleteMany({})
  })
  afterAll(async () => {
    await prisma.$disconnect()
    server.close()
  })

  it("should return not found with wrong email", async () => {
    // prepare
      const email = 'wrong@gmail.com'
      const password = '123456'

    //execute
     const result = await request(server).post('/login').auth(email, password)

    // expectation
     expect(result.status).toBe(401)

  })})

  it("should return not found with wrong password", async () => {
    // prepare
      const email = 'nson@gmail.com'
      const password = 'wrong'

    //execute
     const result = await request(server).post('/login').auth(email, password)

    // expectation
      expect(result.status).toBe(401)

  })

   it("should return logged in user by correct credentials", async () => {
    // prepare
      const email = 'nson@gmail.com'
      const password = '123456'

      const saltRounds = 10
      const hashedPassword = await bcrypt.hash( password, saltRounds )

      const user = await prisma.user.create({
        data: { email, password: hashedPassword },
      })

    //execute
     const result = await request(server).post('/login').auth(email, password)
     const decodedToken = jwt.verify(result.body.token, process.env.JWT_SECRET)

    // expectation
     expect(result.status).toBe(200)
     expect(result.body.user).toBeTruthy()
     expect(result.body.token).toBeTruthy()
     expect(result.body.user.id).toBe(user.id)
     expect(result.body.user.email).toBe(email)
     expect(result.body.user.password).toBeFalsy()

     expect(decodedToken.sub).toBe(user.id)

  })
