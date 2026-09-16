import * as model from './model'
import { getListByMonth } from './services'

jest.mock('./model')
jest.mock('~/interfaces/firebase', () => ({
  __esModule: true,
  default: {},
}))

describe('Transaction services', () => {
  it('should filter transactions by selected year', async () => {
    const month = 0
    const year = 2025

    model.findMany.mockResolvedValue([])

    await getListByMonth({ month, year, userId: 'user-id' })

    expect(model.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-id',
        dueDate: {
          gte: new Date(year, month, 1),
          lt: new Date(year, month + 1, 1),
        },
      },
    })
  })
})
