require('dotenv-safe/config');

const { exec } = require('child_process');

process.env.DATABASE_URL = `${process.env.DB_URL}_testdb02?schema=test_schema`

// @TODO transform in syncronous execution to avoid race condition
exec('yarn db:migrate')

module.exports = {}
