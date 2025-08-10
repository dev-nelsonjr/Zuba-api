import Router from 'koa-router'

import * as users from './modules/users'
import * as transactions from './modules/transactions'

export const router = new Router()

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     basicAuth:
 *       type: http
 *       scheme: basic
 * tags:
 *   - name: Authentication
 *     description: Authentication operations
 *   - name: Users
 *     description: User-related operations
 *   - name: General
 *     description: General operations
 */

/**
 * @openapi
 * /:
 *   get:
 *     summary: Example root route
 *     tags:
 *      - General
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         description: Username for testing
 *     responses:
 *       '200':
 *         description: Successful response with the query param.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 */
router.get('/', ctx => {
  ctx.body = ctx.query
  ctx.status = 200
})

// Auth
router.post('/login', users.login)

// Users
router.get('/users', users.list)
router.post('/users', users.create)
router.put('/users/:id', users.update)
router.delete('/users/:id', users.remove)

router.post('/transactions', transactions.create)
