import * as model from './model'

export const getMonthBalance = async ({ month, ...params }) => {
  const where = {
    ...params,
    dueDate: {
      gte: new Date(2025, month, 1),
      lt: new Date(2025, month + 1, 1),
    },
    
  }
  const balance = await model.groupBy({
    by: ['type'],
    where,
    _sum: {
      value: true,
    },
  })

  const summary = balance.reduce((memo, current) => ({
    ...memo,
    [current.type]: current._sum.value,
  }), {})

  return {
    ...summary,
    balance: parseFloat(((summary.revenue * 100) + (summary.expense * 100))/100)
 } 
}

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