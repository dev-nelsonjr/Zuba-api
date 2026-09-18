import * as model from './model'
import firebaseAdmin from '~/interfaces/firebase'
import {
  getListByMonth,
  getTodayTransactions,
  sendNotifications,
} from './services'

jest.mock('./model')
jest.mock('~/interfaces/firebase', () => ({
  __esModule: true,
  default: {
    getMessaging: jest.fn(),
  },
}))

let mockSendEach

beforeEach(() => {
  mockSendEach = jest.fn()
  firebaseAdmin.getMessaging.mockReturnValue({ sendEach: mockSendEach })
})

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

  it('should only find pending transactions due today', async () => {
    model.findMany.mockResolvedValue([])

    await getTodayTransactions()

    expect(model.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          resolved: false,
        }),
      })
    )
  })

  it('should ignore notifications without a Firebase token', async () => {
    const transactions = [
      {
        description: 'Electricity bill',
        user: { firebaseToken: null },
      },
    ]

    await sendNotifications(transactions)

    expect(mockSendEach).not.toHaveBeenCalled()
  })

  it('should send notifications to users with a Firebase token', async () => {
    const transactions = [
      {
        description: 'Electricity bill',
        user: { firebaseToken: 'firebase-token' },
      },
    ]

    await sendNotifications(transactions)

    expect(mockSendEach).toHaveBeenCalledWith([
      {
        notification: {
          title: 'Today is the due date for a bill.',
          body: "Your bill 'Electricity bill' is due today.",
        },
        token: 'firebase-token',
      },
    ])
  })
})
