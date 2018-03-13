import React from 'react'
import { css } from 'emotion'
import { Route } from 'react-router-dom'
import Dynamic from '../components/Dynamic'

import { LinkButton } from '../components/Button'

const paths = ['/', '/about/']

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
          <LinkButton to={p} key={p} disabled={p === pathname}>
            {p}
          </LinkButton>
        ))}

        <Route
          path="/about/"
          render={() => <Dynamic import={() => import('../pages/About')} />}
        />
      </div>
    </div>
  )
}

export default Frame
