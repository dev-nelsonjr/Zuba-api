import koa from 'koa'
import bodyParser from 'koa-bodyparser'
import swagger from 'swagger-injector'

import { router } from './routes'

const app = new koa()

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

app.use(
  swagger.koa({
  path: `${__dirname}/../DOCS/openapi.json`,
  })
)

export { app }
