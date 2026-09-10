import { app } from './server-setup'
import { prisma } from './data'

const server = app.listen(process.env.PORT || process.env.SERVER_PORT)

const shutdown = signal => {
  console.log(`${signal} received, closing server`)

  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}

process.once('SIGTERM', () => shutdown('SIGTERM'))
process.once('SIGINT', () => shutdown('SIGINT'))
