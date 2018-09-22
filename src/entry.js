module.exports = process.env.PRERENDER ? require('./ssr') : require('./client')
