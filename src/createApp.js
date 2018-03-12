import React from 'react'
import { createBrowserHistory, createMemoryHistory } from 'history'

import Root from './Root'

export default ({ pathname } = {}) => {
  const history = process.env.isSSR
    ? createMemoryHistory({
        initialEntries: [pathname],
      })
    : createBrowserHistory()

  const App = () => <Root history={history} />
  return App
}
