import { Router, Route } from 'react-router-dom'
import React from 'react'
import { hot } from 'react-hot-loader'

import Frame from './Frame'

const Root = ({ history }) => (
  <Router history={history}>
    <Route
      path="/"
      render={() => <Frame pathname={history.location.pathname} />}
    />
  </Router>
)

export default hot(module)(Root)
