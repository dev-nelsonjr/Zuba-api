import 'dotenv/config'

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

const app = new Koa()
import { router } from './routes.js'

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())

export { app }
