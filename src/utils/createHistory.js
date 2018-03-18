/* eslint-disable global-require */
export default (...args) => {
  if (process.env.isSSR || typeof document === 'undefined') {
    return require('history/createMemoryHistory').default(...args)
  }
  return require('history/createBrowserHistory').default(...args)
}
