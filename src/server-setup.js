import koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import swagger from 'swagger-injector'

import { router } from './routes'
import { errorHandler } from './middlewares/error-handler'

const app = new koa()

app.use(errorHandler)
app.use(cors())
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

app.use(
  swagger.koa({
    path: `${__dirname}/../DOCS/openapi.json`,
  })
)

export { app }
