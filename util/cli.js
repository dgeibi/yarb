const runTask = require('./runTask')

const expected = ['build', 'dev', 'stage', 'serve']
const [task = expected[0]] = process.argv.slice(2)

if (!expected.includes(task)) {
  console.error(Error(`unexpected task "${task}"`))
  process.exit(1)
}

runTask({
  task,
  mode: task === 'dev' ? 'development' : 'production',
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 8080,
}).catch(err => {
  console.error(err)
})
