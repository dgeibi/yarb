import React from 'react'
import { css } from 'emotion'
import { Route } from 'react-router-dom'
import loadable from '../utils/loadable'

import { LinkButton } from '../components/Button'

const pages = [
  {
    path: '/about/',
    component: loadable(() => import('../pages/About')),
  },
]

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
        {process.env.routes.map(p => (
          <LinkButton to={p} key={p} disabled={p === pathname}>
            {p}
          </LinkButton>
        ))}
        {pages.map(({ path, component }) => (
          <Route key={path} path={path} component={component} />
        ))}
      </div>
    </div>
  )
}

export default Frame
