import * as transactionServices from '~/modules/transactions/services'

export const dashboard = async ctx => {
  const where = {
    month: ctx.request.query.month - 1,
    userId: ctx.auth.user.id,
  }

  const transactions = await transactionServices.getListByMonth(where)
  const monthBalance = await transactionServices.getMonthBalance(where)

  ctx.body = {
    ...monthBalance,
    docs: transactions,
  }
}
