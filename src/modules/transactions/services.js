import * as model from './model'

export const getListByMonth = ({ month, ...params }) =>
  model.findMany({
    where: {
      ...params,
      dueDate: {
        gte: new Date(2025, month, 1),
        lt: new Date(2025, month + 1, 1),
      },
    },
  })

export const balanceCalcByList = transactions => {
  const balance = transactions.reduce(
    (memo, transaction) => ({
      ...memo,
      ...((parseFloat(transaction.value) * 100) > 0
        ? { revenue: memo.revenue + (parseFloat(transaction.value) * 100) }
        : { expense: memo.expense + (parseFloat(transaction.value) * 100) }),
    }),
    {
      expense: 0,
      revenue: 0,
    }
  )
  return {
    expense: (parseFloat(balance.expense) / 100).toFixed(2),
    revenue: (parseFloat(balance.revenue) / 100).toFixed(2),
    balance: (
      parseFloat(balance.revenue + balance.expense) / 100
    ).toFixed(2),
  }
}
