import { createStore, combineReducers, applyMiddleware } from 'redux'
import { reducer as graph } from 'utils/redux-falcor';

import user from './modules/user'

import options from "./modules/options"

import {AvlInTheMiddle} from "AvlMap/ReduxMiddleware"

import messages from "./modules/messages"

import thunk from 'redux-thunk'

// if (process.env.NODE_ENV === 'development') {
//   const devToolsExtension = window.devToolsExtension;

//   if (typeof devToolsExtension === 'function') {
//     enhancers.push(devToolsExtension());
//   }
// }

// Build the middleware for intercepting and dispatching navigation actions
const middleware = [
	thunk,
	AvlInTheMiddle
]

const store = createStore(
  combineReducers({
    user,
    messages,
    graph,
		options
  }),
  applyMiddleware(...middleware)
)

export default store
