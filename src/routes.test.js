import request from 'supertest'
import { app } from './server-setup'

const server = app.listen()

describe("users routes", () => {
  it("should return not found with wrong email", async () => {
    // prepare
      const email = 'wrong@gmail.com'
      const password = '123456'

    //execute
     const result = await request(server).get('/login').auth(email, password)

    // expectation
     console.log(result.status)

  })})

  describe("users routes", () => {
  it("should return not found with wrong password", async () => {
    // prepare
      const email = 'nson@gmail.com'
      const password = 'wrong'

    //execute
     const result = await request(server).get('/login').auth(email, password)

    // expectation
     console.log(result.status)

  })})
