/* eslint-disable global-require */
export default (...args) => {
  if (typeof document === 'undefined') {
    return require('history/createMemoryHistory').default(...args)
  }
  return require('history/createBrowserHistory').default(...args)
}
