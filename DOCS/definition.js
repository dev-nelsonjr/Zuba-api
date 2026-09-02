/* global module */

module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Zuba API',
    version: '1.0.0',
    description: 'API for authentication and personal finance management.',
  },
  tags: [
    { name: 'General', description: 'Service status operations' },
    { name: 'Authentication', description: 'Account access operations' },
    { name: 'Users', description: 'Authenticated user operations' },
    { name: 'Transactions', description: 'Financial transaction operations' },
    { name: 'Dashboard', description: 'Monthly financial summary operations' },
  ],
  components: {
    securitySchemes: {
      basicAuth: {
        type: 'http',
        scheme: 'basic',
        description: 'Use the user email as username and the password as password.',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    parameters: {
      TransactionId: {
        in: 'path',
        name: 'id',
        required: true,
        schema: { type: 'string' },
        description: 'Transaction identifier.',
      },
      Month: {
        in: 'query',
        name: 'month',
        required: true,
        schema: { type: 'integer', minimum: 1, maximum: 12 },
        description: 'Calendar month from 1 to 12.',
      },
      Year: {
        in: 'query',
        name: 'year',
        required: false,
        schema: {
          type: 'integer',
          minimum: 2000,
          maximum: 2100,
        },
        description: 'Calendar year. Defaults to the current year.',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        required: ['error'],
        properties: {
          error: { type: 'string' },
        },
      },
      User: {
        type: 'object',
        required: ['id', 'email', 'createdAt', 'updatedAt'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string', nullable: true },
          email: { type: 'string', format: 'email' },
          firebaseToken: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          deletedAt: { type: 'string', format: 'date-time', nullable: true },
        },
      },
      AuthResponse: {
        type: 'object',
        required: ['user', 'token'],
        properties: {
          user: { $ref: '#/components/schemas/User' },
          token: { type: 'string', description: 'JWT used by protected routes.' },
        },
      },
      SignupInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 1 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 4, format: 'password' },
        },
      },
      UpdateUserInput: {
        type: 'object',
        minProperties: 1,
        properties: {
          name: { type: 'string', minLength: 1 },
          email: { type: 'string', format: 'email' },
          firebaseToken: { type: 'string', nullable: true },
        },
      },
      Transaction: {
        type: 'object',
        required: ['id', 'userId', 'description', 'value', 'resolved'],
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          description: { type: 'string' },
          value: {
            type: 'string',
            pattern: '^-?\\d+(\\.\\d{1,2})?$',
            example: '-42.50',
            description: 'Decimal value serialized as a string.',
          },
          recurrence: {
            type: 'string',
            enum: ['weekly', 'monthly', 'yearly'],
            nullable: true,
          },
          installments: { type: 'integer', nullable: true },
          isSubscription: { type: 'boolean', nullable: true },
          dueDate: { type: 'string', format: 'date-time', nullable: true },
          type: {
            type: 'string',
            enum: ['expense', 'revenue'],
            nullable: true,
          },
          resolved: { type: 'boolean' },
        },
      },
      TransactionInput: {
        type: 'object',
        required: ['description', 'value'],
        properties: {
          description: { type: 'string', minLength: 1 },
          value: {
            oneOf: [
              { type: 'number' },
              { type: 'string', pattern: '^-?\\d+(\\.\\d{1,2})?$' },
            ],
          },
          dueDate: { type: 'string', format: 'date-time' },
          type: { type: 'string', enum: ['expense', 'revenue'] },
        },
      },
      UpdateTransactionInput: {
        type: 'object',
        minProperties: 1,
        properties: {
          description: { type: 'string', minLength: 1 },
          value: {
            oneOf: [
              { type: 'number' },
              { type: 'string', pattern: '^-?\\d+(\\.\\d{1,2})?$' },
            ],
          },
          dueDate: { type: 'string', format: 'date-time' },
          type: { type: 'string', enum: ['expense', 'revenue'] },
          resolved: { type: 'boolean' },
        },
      },
      Dashboard: {
        type: 'object',
        required: ['expense', 'revenue', 'total', 'docs'],
        properties: {
          expense: { type: 'number' },
          revenue: { type: 'number' },
          total: { type: 'number' },
          docs: {
            type: 'array',
            items: { $ref: '#/components/schemas/Transaction' },
          },
        },
      },
    },
    responses: {
      InvalidBody: {
        description: 'The request body is invalid.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { error: 'Invalid request body' },
          },
        },
      },
      InvalidQuery: {
        description: 'The query parameters are invalid.',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: { error: 'Invalid query parameters' },
          },
        },
      },
      Unauthorized: {
        description: 'The access token is missing, invalid, or no longer belongs to a user.',
      },
    },
  },
}
