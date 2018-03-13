/* eslint-disable global-require */
export default (...args) => {
  if (process.env.isSSR) {
    return require('history/createMemoryHistory').default(...args)
  }
  return require('history/createBrowserHistory').default(...args)
}
