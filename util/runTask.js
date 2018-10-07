const path = require('path')
const internalIp = require('internal-ip')
const getTasks = require('./tasks')

function normalizeConfig(config, ...args) {
  if (typeof config === 'function') return config(...args)
  return config
}

const expected = ['dev', 'build', 'stage', 'serve']

module.exports = async function run({ task, host, env, port, configPath }) {
  if (!expected.includes(task)) {
    console.error(`unexpected task "${task}"`)
    process.exit(1)
  }
  if (env) {
    process.env.NODE_ENV = env
  }
  let webpackConfig
  const configFullPath = path.resolve(configPath)
  const configPathToDisplay = path.relative(process.cwd(), configFullPath)
  try {
    webpackConfig = require(configFullPath) // eslint-disable-line
  } catch (e) {
    e.message = `webpack config \`${configPathToDisplay}\` failed to load\n${
      e.message
    }`
    throw e
  }
  const config = await normalizeConfig(webpackConfig, {
    env,
  })
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
