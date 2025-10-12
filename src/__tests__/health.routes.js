import request from 'supertest'

import { app } from '../server-setup'

const server = app.listen()

afterAll(done => {
  server.close(done)
})

describe('Health route', () => {
  it('should return API status', async () => {
    const response = await request(server).get('/health')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'ok' })
  })
})
