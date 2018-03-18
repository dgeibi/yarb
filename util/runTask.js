const path = require('path')
const fs = require('fs')
const runWebpack = require('./runWebpack')
const serveStatic = require('./serveStatic')
const getConfig = require('../webpack.config')

module.exports = async function run({
  task,
  mode = 'production',
  host = '0.0.0.0',
  port = 8080,
}) {
  const config = await getConfig({
    mode,
  })

  const outputPath =
    (config.output && config.output.path) || path.resolve('dist')

  const tasks = {
    serve: forceBuild =>
      Promise.resolve(
        (forceBuild || !fs.existsSync(outputPath)) && tasks.build()
      )
        .then(() =>
          serveStatic({
            host,
            port,
            root: outputPath,
          })
        )
        .then(actualPort => {
          const isZero = host === '0.0.0.0'
          console.log(
            `serving at http://${isZero ? 'localhost' : host}:${actualPort}`
          )
          if (isZero) {
            console.log(`actual host is ${host}`)
          }
        }),

    dev() {
      const convert = require('koa-connect')
      const history = require('connect-history-api-fallback')
      return require('webpack-serve')({
        host: 'localhost', // todo: https://github.com/webpack-contrib/webpack-serve/issues/56
        config,
        port,
        add: app => {
          app.use(convert(history()))
        },
      })
    },

    stage() {
      return tasks.serve(true)
    },

    build() {
      const rimraf = require('rimraf')
      console.log(`rm -rf ${outputPath}`)
      rimraf.sync(outputPath)

      return runWebpack(config).then(stats => {
        console.log(
          stats.toString({
            chunks: false,
            colors: true,
          })
        )
        if (stats.hasErrors()) throw Error('webpack build has errors')
      })
    },
  }

  if (typeof tasks[task] === 'function') {
    return tasks[task]()
  }

  throw Error(`task(${task}) not exists`)
}
