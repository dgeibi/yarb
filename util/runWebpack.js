const webpack = require('webpack')

module.exports = function runWebpack(config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        reject(err)
        return
      }
      resolve(stats)
    })
  })
}
