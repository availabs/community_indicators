import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Router } from "react-router-dom"

import { FalcorProvider } from 'utils/redux-falcor'
import { falcorGraph } from 'store/falcorGraph'

import store, { history } from './store'
import App from './App';

import registerServiceWorker from './registerServiceWorker';

import { ThemeProvider }  from 'styled-components'
import theme from 'components/common/themes/light_new'
import AvlMap from "./AvlMap"

ReactDOM.render(
  <Provider store={store}>
  	<FalcorProvider store={store} falcor={falcorGraph}>
	    <Router history={history}>
        <ConnectedRouter history={history}>
  	     	<App />
        </ConnectedRouter>
	    </Router>
	   </FalcorProvider>
  </Provider>,
  // <div style={{height:"75vh",width:"100vw",display:"block",position:"relative"}}>
  //   <ThemeProvider theme={theme}>
  //     <AvlMap />
  //   </ThemeProvider>
  // </div>,
  document.getElementById('root')
)

// registerServiceWorker();
