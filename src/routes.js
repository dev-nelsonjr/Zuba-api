import Router from 'koa-router'

import { authCheck } from './middlewares/auth-check'

import * as users from './modules/users'
import * as transactions from './modules/transactions'
import { dashboard } from './modules/bff/dashboard'

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
router.post('/signup', users.signup)

// Users (account)
router.put('/profile', authCheck, users.update)
router.delete('/profile', authCheck, users.remove)

router.post('/transactions', authCheck, transactions.create)
router.get('/transactions', authCheck, transactions.list)
router.put('/transactions/:id', authCheck, transactions.update)
router.delete('/transactions/:id', authCheck, transactions.remove)

//BFF Routes
router.get('/dashboard', authCheck, dashboard)
