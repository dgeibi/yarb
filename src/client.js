import './utils/polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import createApp from './utils/createApp'
import './global.css'

const App = createApp()

ReactDOM.hydrate(<App />, document.getElementById('root'))
