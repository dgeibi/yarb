/* eslint-disable global-require */
export default (...args) => {
  if (process.env.PRERENDER || typeof document === 'undefined') {
    return require('history/createMemoryHistory').default(...args)
  }
  return require('history/createBrowserHistory').default(...args)
}
