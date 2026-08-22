import * as transactionServices from '~/modules/transactions/services'

export const dashboard = async ctx => {
  const { month, year } = ctx.state.validatedQuery
  const where = {
    month: month - 1,
    year,
    userId: ctx.auth.user.id,
  }

  const total = await transactionServices.getBalance({ userId: where.userId })
  const transactions = await transactionServices.getListByMonth(where)
  const monthBalance = await transactionServices.getMonthBalance(where)

  ctx.body = {
    ...monthBalance,
    total,
    docs: transactions,
  }
}
