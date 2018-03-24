const path = require('path')
const internalIp = require('internal-ip')
const getTasks = require('./tasks')

function normalizeConfig(config, ...args) {
  if (typeof config === 'function') return config(...args)
  return config
}

module.exports = async function run({
  task,
  host,
  mode = 'production',
  port = 8080,
  configPath = path.resolve('webpack.config.js'),
}) {
  let webpackConfig
  const configPathToDisplay = path.relative(process.cwd(), configPath)
  try {
    webpackConfig = require(configPath) // eslint-disable-line
  } catch (e) {
    throw Error(`webpack config \`${configPathToDisplay}\` failed to load`)
  }
  const env = {
    mode,
  }
  const config = await normalizeConfig(webpackConfig, env)
  if (typeof config !== 'object' || config === null) {
    throw Error(
      `webpack config \`${configPathToDisplay}\` is not a right config`
    )
  }
  console.log(`webpack config \`${configPathToDisplay}\` loaded`)
  // eslint-disable-next-line
  host = host === '0.0.0.0' || !host ? internalIp.v4.sync() : host
  const outputPath =
    (config.output && config.output.path) || path.resolve('dist')

  const tasks = getTasks({
    outputPath,
    host,
    port,
    config,
  })
  if (typeof tasks[task] === 'function') {
    return tasks[task]()
  }
  throw Error(`task(${task}) not exists`)
}
