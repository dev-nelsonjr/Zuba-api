export const validateQuery = schema => async (ctx, next) => {
  const result = schema.safeParse(ctx.request.query)

  if (!result.success) {
    ctx.status = 400
    ctx.body = { error: 'Invalid query parameters' }
    return
  }

  ctx.state.validatedQuery = result.data
  await next()
}
