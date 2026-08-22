import { errorHandler } from './error-handler'

describe('Error handler', () => {
  it('should hide unexpected error details', async () => {
    const error = new Error('Database unavailable')
    const ctx = {}
    const log = jest.spyOn(console, 'error').mockImplementation(() => {})

    await errorHandler(ctx, async () => {
      throw error
    })

    expect(ctx.status).toBe(500)
    expect(ctx.body).toBe('Internal Server Error')
    expect(log).toHaveBeenCalledWith(error)

    log.mockRestore()
  })

  it('should preserve exposed HTTP errors', async () => {
    const error = Object.assign(new Error('Invalid request'), {
      status: 400,
      expose: true,
    })
    const ctx = {}

    await errorHandler(ctx, async () => {
      throw error
    })

    expect(ctx.status).toBe(400)
    expect(ctx.body).toBe('Invalid request')
  })
})
