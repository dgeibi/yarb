import React from 'react'
import { css } from 'emotion'
import { LinkButton } from '../components/Button'

export default function About() {
  return (
    <div
      css={css`
        margin-top: 30px;
        color: yellow;
        font-size: 4rem;
      `}
    >
      <LinkButton href="https://github.com/dgeibi/yarb">
        Fork Me on GitHub
      </LinkButton>
    </div>
  )
}
