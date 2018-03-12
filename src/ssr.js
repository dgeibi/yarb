import React from 'react'
import { renderStylesToString } from 'emotion-server'
import { renderToString } from 'react-dom/server'
import createApp from './createApp'

export default pathname => {
  const App = createApp({ pathname })
  return renderStylesToString(renderToString(<App pathname={pathname} />))
}
