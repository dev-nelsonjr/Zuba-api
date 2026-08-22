export const errorHandler = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    const status = error.status || 500

    ctx.status = status
    ctx.body = error.expose ? error.message : 'Internal Server Error'

    if (status >= 500) {
      console.error(error)
    }
  }
}
