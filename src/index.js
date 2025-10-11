import { app } from './server-setup'

app.listen(process.env.PORT || process.env.SERVER_PORT)
