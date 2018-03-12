module.exports = (port, root) => {
  const finalhandler = require('finalhandler')
  const http = require('http')
  const serveStatic = require('serve-static')
  const detectPort = require('detect-port')
  return detectPort(port).then(newPort => {
    if (newPort !== port) {
      console.log(`port: ${port} was occupied, try port: ${newPort}`)
    }
    const serve = serveStatic(root)
    http
      .createServer((req, res) => {
        serve(req, res, finalhandler(req, res))
      })
      .listen(newPort)
    return newPort
  })
}
