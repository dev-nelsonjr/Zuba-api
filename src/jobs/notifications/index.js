import {
  getTodayTransactions,
  sendNotifications,
} from '~/modules/transactions/services'

const main = async () => {
  const transactions = await getTodayTransactions()
  await sendNotifications(transactions)
  console.log('finish')
}

main()
