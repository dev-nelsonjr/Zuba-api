import { app } from './server-setup.js'

const PORT = process.env.SERVER_PORT || 9901
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`)
})
