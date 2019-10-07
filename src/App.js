import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router-dom';

import { login } from './store/modules/user';

import { auth } from './store/modules/user';
// comp
import Layout from './layouts/Layout'
import Routes from './routes'

import { ThemeProvider }  from 'styled-components';
import theme from 'components/common/themes/light'

import './App.css';

import Messages from "./components/messages"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAuthenticating: false
    }
  }

  componentWillMount() {
    this.props.auth();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.user.attempts) {
      this.setState({ isAuthenticating: false });
    }
  }

  render() {
    let activeGeoid = null
    let location = this.props.router.location.pathname.split('/')
    if (location[1] === 'profile') {
      activeGeoid = location[2]
    }
    console.log('app render props',this.props, activeGeoid, location)

    return (
      <ThemeProvider theme={theme}>
        <div className="all-wrapper solid-bg-all">
          <Switch>
          {
          	Routes.map((route,i) => {
              return (
    	    			<Layout
                  activeGeoid = {activeGeoid}
                  key = {i}
                  { ...route }
                  isAuthenticating = { this.state.isAuthenticating }
                  authed = { this.props.user.authed }
                  router = {this.props.router}
                  user = {this.props.user}
                  menuSettings = { route.menuSettings ?  route.menuSettings  : {} }
                  routes={route.routes}
    	    				menus = { Routes }
                  breadcrumbs = {route.breadcrumbs}
    	    			/>
    	    		)
  	    	  })
          }
          </Switch>
          <Messages />
        </div>
      </ThemeProvider>
    );
  }
}



const mapStateToProps = state => {
  return {
    user: state.user,
    router: state.router
  };
};

export default connect(mapStateToProps, { auth })(App);
