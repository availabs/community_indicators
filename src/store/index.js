import { createStore, combineReducers, applyMiddleware } from 'redux'
import { routerReducer, routerMiddleware, syncHistoryWithStore } from 'react-router-redux'
import { reducer as graph } from 'utils/redux-falcor';

import user from './modules/user'

import options from "./modules/options"

import {AvlInTheMiddle} from "AvlMap/ReduxMiddleware"

import messages from "./modules/messages"

import { createBrowserHistory } from 'history'
import thunk from 'redux-thunk'

// if (process.env.NODE_ENV === 'development') {
//   const devToolsExtension = window.devToolsExtension;

//   if (typeof devToolsExtension === 'function') {
//     enhancers.push(devToolsExtension());
//   }
// }

const history = createBrowserHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = [
	routerMiddleware(history),
	thunk,
	AvlInTheMiddle
]

const store = createStore(
  combineReducers({
    user,
    messages,
    graph,
    router: routerReducer,
		options
  }),
  applyMiddleware(...middleware)
)

export default store
export {
	history
}
