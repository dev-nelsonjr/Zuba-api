/* global require, __dirname */

const fs = require('fs')
const path = require('path')
const swaggerjsdoc = require('swagger-jsdoc')
const definition = require('./definition')

const options = {
  definition,
  apis: [path.join(__dirname, '../src/routes.js')],
  failOnErrors: true,
}

const openapiSpecification = swaggerjsdoc(options)

fs.writeFileSync(
  path.join(__dirname, 'openapi.json'),
  JSON.stringify(openapiSpecification, null, 2)
)

