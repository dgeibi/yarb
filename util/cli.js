const path = require('path')
const runWebpack = require('./runWebpack')
const serveStatic = require('./serveStatic')
const getConfig = require('../webpack.config')

const expected = ['build', 'dev', 'stage']
const [command = expected[0]] = process.argv.slice(2)

if (!expected.includes(command)) {
  console.error(`unexpected command "${command}"`)
  process.exit(1)
}

const config = getConfig({
  command,
})

const outputPath = (config.output && config.output.path) || path.resolve('dist')

const handlers = {
  dev() {
    return require('webpack-serve')({
      config,
    })
  },

  stage() {
    return this.build()
      .then(stats => {
        if (stats.hasErrors()) throw Error('give up serving')
        return serveStatic(8080, outputPath)
      })
      .then(port => {
        console.log(`serving at http://localhost:${port}`)
      })
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
      return stats
    })
  },
}

handlers[command]().catch(err => {
  console.log(err)
})
