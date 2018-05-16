const commandLineArgs = require('command-line-args')

const runTask = require('./runTask')

const options = commandLineArgs([
  { name: 'task', defaultOption: true, defaultValue: 'dev' },
  {
    name: 'env',
    type: String,
    defaultValue: process.env.NODE_ENV || 'development',
  },
  {
    name: 'port',
    type: Number,
    defaultValue: process.env.PORT || 8080,
  },
  {
    name: 'host',
    type: String,
    defaultValue: process.env.HOST || '0.0.0.0',
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
