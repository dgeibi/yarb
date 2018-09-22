const commandLineArgs = require('command-line-args')
const runTask = require('./runTask')

const { NODE_ENV, HOST, PORT } = process.env

const options = commandLineArgs([
  { name: 'task', defaultOption: true, defaultValue: 'dev' },
  {
    name: 'env',
    type: String,
    defaultValue: NODE_ENV || 'development',
  },
  {
    name: 'port',
    type: Number,
    defaultValue: PORT || 8080,
  },
  {
    name: 'host',
    type: String,
    defaultValue: HOST || '0.0.0.0',
  },
  {
    name: 'configPath',
    type: String,
    defaultValue: 'webpack.config.js',
  },
])

runTask(options).catch(err => {
  console.error(err)
})
