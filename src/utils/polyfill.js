import setprototypeof from 'setprototypeof'
import 'core-js/modules/es6.object.keys'
import 'core-js/modules/es6.promise'
import 'core-js/modules/es6.set'
import 'core-js/modules/es6.map'
import 'core-js/modules/es6.weak-map' // ie 10
import 'core-js/modules/web.dom.iterable'
import 'regenerator-runtime/runtime'

Object.setPrototypeOf = setprototypeof
