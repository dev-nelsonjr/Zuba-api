import * as model from './model'
import { getListByMonth } from './services'

jest.mock('./model')
jest.mock('~/interfaces/firebase', () => ({
  __esModule: true,
  default: {},
}))

describe('Transaction services', () => {
  it('should filter transactions by current year', async () => {
    // prepare
    const month = 0
    const year = new Date().getFullYear()

    model.findMany.mockResolvedValue([])

    // execution
    await getListByMonth({ month, userId: 'user-id' })

    // expectation
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
