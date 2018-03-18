import React from 'react'
import createHistory from './utils/createHistory'

import Root from './layouts/Root'

export default ({ pathname } = {}) => {
  const opts = {}
  if (process.env.isSSR || typeof document === 'undefined') {
    opts.initialEntries = [pathname]
  }
  const history = createHistory(opts)

  const App = () => <Root history={history} />
  return App
}
