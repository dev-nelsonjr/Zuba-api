import Router from '@koa/router'

import { authCheck } from './middlewares/auth-check'
import { validateBody } from './middlewares/validate-body'
import { validateQuery } from './middlewares/validate-query'

import * as users from './modules/users'
import { signupSchema, updateUserSchema } from './modules/users/schema'
import * as transactions from './modules/transactions'
import {
  createTransactionSchema,
  periodSchema,
  updateTransactionSchema,
} from './modules/transactions/schema'
import { dashboard } from './modules/bff/dashboard'

export const router = new Router()

/**
 * @openapi
 * /:
 *   get:
 *     summary: Echo query parameters
 *     tags: [General]
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

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check API availability
 *     tags: [General]
 *     responses:
 *       '200':
 *         description: The API is available.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [status]
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
router.get('/health', ctx => {
  ctx.body = { status: 'ok' }
})

// Auth
/**
 * @openapi
 * /login:
 *   post:
 *     summary: Authenticate a user
 *     description: Sends the email and password through HTTP Basic authentication.
 *     tags: [Authentication]
 *     security:
 *       - basicAuth: []
 *     responses:
 *       '200':
 *         description: User authenticated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '400':
 *         description: The Basic authorization header is malformed.
 *       '404':
 *         description: The credentials do not match a user.
 */
router.post('/login', users.login)

/**
 * @openapi
 * /signup:
 *   post:
 *     summary: Create a user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupInput'
 *     responses:
 *       '200':
 *         description: Account created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       '400':
 *         $ref: '#/components/responses/InvalidBody'
 */
router.post('/signup', validateBody(signupSchema), users.signup)

// Users (account)
/**
 * @openapi
 * /profile:
 *   put:
 *     summary: Update the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       '200':
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         $ref: '#/components/responses/InvalidBody'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *   delete:
 *     summary: Delete the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id]
 *               properties:
 *                 id:
 *                   type: string
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put('/profile', authCheck, validateBody(updateUserSchema), users.update)
router.delete('/profile', authCheck, users.remove)

/**
 * @openapi
 * /transactions:
 *   post:
 *     summary: Create a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       '200':
 *         description: Transaction created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       '400':
 *         $ref: '#/components/responses/InvalidBody'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *   get:
 *     summary: List transactions for a month
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Month'
 *       - $ref: '#/components/parameters/Year'
 *     responses:
 *       '200':
 *         description: Transactions from the selected month.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       '400':
 *         $ref: '#/components/responses/InvalidQuery'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post(
  '/transactions',
  authCheck,
  validateBody(createTransactionSchema),
  transactions.create
)
router.get(
  '/transactions',
  authCheck,
  validateQuery(periodSchema),
  transactions.list
)

/**
 * @openapi
 * /transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TransactionId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTransactionInput'
 *     responses:
 *       '200':
 *         description: Number of transactions updated for the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [count]
 *               properties:
 *                 count:
 *                   type: integer
 *       '400':
 *         $ref: '#/components/responses/InvalidBody'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/TransactionId'
 *     responses:
 *       '200':
 *         description: Delete request completed for the authenticated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [id]
 *               properties:
 *                 id:
 *                   type: string
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
router.put(
  '/transactions/:id',
  authCheck,
  validateBody(updateTransactionSchema),
  transactions.update
)
router.delete('/transactions/:id', authCheck, transactions.remove)

//BFF Routes
/**
 * @openapi
 * /dashboard:
 *   get:
 *     summary: Get the monthly dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Month'
 *       - $ref: '#/components/parameters/Year'
 *     responses:
 *       '200':
 *         description: Balances and transactions for the selected month.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Dashboard'
 *       '400':
 *         $ref: '#/components/responses/InvalidQuery'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get('/dashboard', authCheck, validateQuery(periodSchema), dashboard)
