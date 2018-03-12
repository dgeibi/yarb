import React from 'react'
import { css } from 'emotion'
import { hot } from 'react-hot-loader'

function App({ pathname }) {
  return (
    <h1
      css={css`
        text-align: center;
        color: #298;
      `}
    >
      Welcome to {pathname}!
    </h1>
  )
}

export default hot(module)(App)
