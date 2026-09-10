import koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import swagger from 'swagger-injector'

import { router } from './routes'
import { errorHandler } from './middlewares/error-handler'

const app = new koa()
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map(origin => origin.trim())

app.use(errorHandler)
app.use(
  cors({
    origin: ctx => {
      const requestOrigin = ctx.get('Origin')

      if (allowedOrigins.includes('*') || !requestOrigin) return '*'
      if (allowedOrigins.includes(requestOrigin)) return requestOrigin

      return ''
    },
  })
)
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

app.use(
  swagger.koa({
    path: `${__dirname}/../DOCS/openapi.json`,
  })
)

export { app }
