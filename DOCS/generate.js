const fs = require('fs')
const path = require('path')
const swaggerjsdoc = require("swagger-jsdoc")

const options = {
definition: {
  openapi: '3.0.0',
  info: {
    title: 'Zuba API',
    version: '1.0.0'
},
},
apis: [path.join(__dirname, '../src/routes.js')]
}

const openapiSpecification = swaggerjsdoc(options)

fs.writeFileSync(path.join(__dirname, 'openapi.json'), JSON.stringify(openapiSpecification))

