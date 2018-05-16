import './utils/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import createApp from './createApp'
import 'normalize.css'
import './global.css'

const App = createApp()

const renderMethod =
  process.env.NODE_ENV === 'production' ? 'hydrate' : 'render'

ReactDOM[renderMethod](<App />, document.getElementById('root'))
