export const validateBody = schema => async (ctx, next) => {
  const result = schema.safeParse(ctx.request.body)

  if (!result.success) {
    ctx.status = 400
    ctx.body = { error: 'Invalid request body' }
    return
  }

  ctx.request.body = result.data
  await next()
}
