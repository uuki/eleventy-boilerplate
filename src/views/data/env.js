const path = require('path')
const envPath = path.join(process.env.PWD, 'config', 'env')
const env = require(envPath)

module.exports = {
  isDev: env.isDev,
}
