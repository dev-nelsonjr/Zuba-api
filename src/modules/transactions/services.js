import * as model from './model'

export const getMonthBalance = async ({ month, ...params }) => {
  const where = {
      ...params,
      dueDate: {
        gte: new Date(2025, month, 1),
        lt: new Date(2025, month + 1, 1),
      },
    
  }
  const balance = await model.aggregate({
    where ,
    _sum: {
      value: true,
    },
  })

  const expense = await model.aggregate({
    where: {
      ...where,
      value: {
        lt: 0
      },
      },
    _sum: {value: true},
  })

  const revenue = await model.aggregate({
    where: {
      ...where,
      value: {
        gt: 0
      }
    } ,
    _sum: {value: true},
  })

  return {expense: expense._sum.value, revenue: revenue._sum.value, balance: balance._sum.value}
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