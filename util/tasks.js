const runWebpack = require('./runWebpack')
const serveStatic = require('./serveStatic')
const fs = require('fs')

module.exports = ({ outputPath, host, port, config }) => {
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
          console.log(`serving at http://${host}:${actualPort}`)
        }),

    dev() {
      const convert = require('koa-connect')
      const history = require('connect-history-api-fallback')
      return require('webpack-serve')({
        host,
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
  return tasks
}
