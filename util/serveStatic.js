module.exports = ({ port, root, host = 'localhost' }) => {
  const finalhandler = require('finalhandler')
  const http = require('http')
  const serveStatic = require('serve-static')
  const detectPort = require('detect-port')
  return detectPort(port).then(actualPort => {
    if (actualPort !== port) {
      console.log(`port: ${port} was occupied, try port: ${actualPort}`)
    }
    const serve = serveStatic(root)
    const server = http.createServer((req, res) => {
      serve(req, res, finalhandler(req, res))
    })
    return new Promise((resolve, reject) => {
      server.once('error', reject)
      server.listen(actualPort, host, () => {
        resolve(server.address().port)
        server.removeListener('error', reject)
      })
    })
  })
}
