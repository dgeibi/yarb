import React from 'react'
import { css } from 'emotion'
import { Route, Link } from 'react-router-dom'
import Dynamic from './components/Dynamic'

import Button from './components/Button'

const paths = ['/', '/about/']

const linkCSS = css`
  &:focus {
    outline: 0;
  }
`
function Frame({ pathname }) {
  return (
    <div
      css={css`
        text-align: center;
      `}
    >
      <h1
        css={css`
          color: #298;
        `}
      >
        Welcome to {pathname}!
      </h1>
      <div
        css={css`
          & > a + a {
            margin-left: 5px;
          }
        `}
      >
        {paths.map(p => (
          <Link to={p} key={p} disabled={p === pathname} css={linkCSS}>
            <Button>{p}</Button>
          </Link>
        ))}

        <Route
          path="/about/"
          render={() => <Dynamic import={() => import('./pages/About')} />}
        />
      </div>
    </div>
  )
}

export default Frame
