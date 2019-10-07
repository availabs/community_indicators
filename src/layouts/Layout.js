import React from 'react';
import { Route, Redirect } from "react-router-dom";

// Layout Components
import Menu from 'components/light-admin/menu'
import BreadcrumbBar from 'components/light-admin/breadcrumb-bar'
import ContentContainer from 'components/light-admin/containers/ContentContainer'

const DefaultLayout = ({component: Component, ...rest}) => {
  if ( rest.isAuthenticating ) {
    return (
      <Route {...rest} render={matchProps => (
        <div className="all-wrapper solid-bg-all">
          <div className="layout-w">
            <Menu {...rest} />
            <ContentContainer>
              ... Authenticating ...
            </ContentContainer>
          </div>
        </div>
      )} />
    )
  }

  return checkAuth(rest) ?
  (
    <Redirect
      to={{
        pathname: "/login",
        state: { from: rest.router.location }
      }}
    />
  ) : (
    rest.useLayout === false ?
      <Route { ...rest } render={ matchProps => (
        <div style={ { height: "100vh", paddingBottom: "20px" } }>
          <Component {...matchProps} {...rest}/>
        </div>
      )}/>
    :
      <Route {...rest} render={matchProps => (
        <div className="layout-w">
          { rest.menuSettings.display === 'none' ? '' : <Menu {...rest} /> }
          <BreadcrumbBar layout={rest.breadcrumbs} match={rest.computedMatch}/>
          <ContentContainer>
            <Component {...matchProps} {...rest}/>
          </ContentContainer>
        </div>
      )} />
  )
}

function checkAuth (props) {
  return (props.auth && !props.authed)
}

export default DefaultLayout
