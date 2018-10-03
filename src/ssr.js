import React from 'react'
import { renderStylesToString } from 'emotion-server'
import { renderToString } from 'react-dom/server'
import createApp from './utils/createApp'

const normalize = filename =>
  `/${filename.replace(/index.html$/, '').replace(/^\//, '')}`

export default ({ outputName }) => {
  const App = createApp({
    pathname: normalize(outputName),
  })
  return renderStylesToString(renderToString(<App />))
}
