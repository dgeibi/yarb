const webpack = require('webpack')
const fs = require('fs')
const runWebpack = require('./runWebpack')
const serveStatic = require('./serveStatic')

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
      const WebpackDevServer = require('webpack-dev-server')
      const serverConfig = {
        stats: {
          colors: true,
        },
        hot: true,
        port,
        host,
      }
      config.plugins.push(new webpack.HotModuleReplacementPlugin())
      WebpackDevServer.addDevServerEntrypoints(config, serverConfig)
      const compiler = webpack(config)
      const server = new WebpackDevServer(compiler, serverConfig)
      server.listen(port, host, () => {
        console.log(`serving at http://${host}:${port}`)
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
