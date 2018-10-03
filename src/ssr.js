import React from 'react'
import { renderStylesToString } from 'emotion-server'
import { renderToString } from 'react-dom/server'
import createApp from './utils/createApp'

export default ({ outputName }) => {
  const App = createApp({ pathname: outputName })
  return renderStylesToString(renderToString(<App />))
}
