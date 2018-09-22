import React from 'react'
import createHistory from './createHistory'
import Root from '../components/Root'

export default ({ pathname } = {}) => {
  const opts = {}
  if (process.env.PRERENDER || typeof document === 'undefined') {
    opts.initialEntries = [pathname]
  }
  const history = createHistory(opts)
  const App = () => <Root history={history} />
  return App
}
