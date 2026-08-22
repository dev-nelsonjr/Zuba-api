import { addDays } from 'date-fns'
import firebaseAdmin from '~/interfaces/firebase'

import * as model from './model'

export const getBalance = async where => {
  const balance = await model.aggregate({
    where,
    _sum: {
      value: true,
    },
  })
  return balance._sum.value
}

export const getMonthBalance = async ({ month, year, ...params }) => {
  const where = {
    ...params,
    dueDate: {
      gte: new Date(year, month, 1),
      lt: new Date(year, month + 1, 1),
    },
  }
  const balance = await model.groupBy({
    by: ['type'],
    where,
    _sum: {
      value: true,
    },
  })

  const summary = balance.reduce(
    (memo, current) => ({
      ...memo,
      [current.type]: current._sum.value,
    }),
    {
      expense: 0,
      revenue: 0,
    }
  )

  return {
    ...summary,
    balance: parseFloat((summary.revenue * 100 + summary.expense * 100) / 100),
  }
}

export const getListByMonth = ({ month, year, ...params }) => {
  return model.findMany({
    where: {
      ...params,
      dueDate: {
        gte: new Date(year, month, 1),
        lt: new Date(year, month + 1, 1),
      },
    },
  })
}

export const getTodayTransactions = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const day = today.getDate()

  return model.findMany({
    where: {
      dueDate: {
        gte: new Date(year, month, day, 0, 0),
        lt: addDays(new Date(year, month, day, 0, 0), 1),
      },
    },
    include: {
      user: true,
    },
  })
}

export const sendNotifications = transactions => {
  const messages = transactions.map(transaction => ({
    notification: {
      title: 'Today is the due date for a bill.',
      body: `Your bill '${transaction.description}' is due today.`,
    },
    token: transaction.user.firebaseToken,
  }))

  return firebaseAdmin.getMessaging().sendEach(messages)
}
