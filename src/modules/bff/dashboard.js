import * as transactionServices from '~/modules/transactions/services'

export const dashboard = async ctx => {
  const month = ctx.request.query.month - 1

  const transactions = await transactionServices.getListByMonth({
    month,
    userId: ctx.auth.user.id,
  })

  const monthBalance = transactionServices.balanceCalcByList(transactions)

  ctx.body = {
    ...monthBalance,
    docs: transactions,
  }
}
