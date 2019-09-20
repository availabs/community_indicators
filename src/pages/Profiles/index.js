import React from 'react';
import subMenus from './submenu.js'
import Profiles from './Profile'
import ProfileHeader from './components/ProfileHeader'
import GRAPH_CONFIG from './graphConfig'

class ReportIndex extends React.Component{
  state = {
    graphConfig: GRAPH_CONFIG
  }
  render() {
      return(
          <div >
              <ProfileHeader
                  title={`Greater Capital Region`}
                  geoids={['36001','36083','36093','36091','36039','36021','36115','36113']}
              />
          </div>
      )
  }
}

export default [
    {
        icon: 'os-icon-home',
        path: '/profiles',
        mainNav: true,
        exact: true,
        menuSettings:{
            image: 'none',
            scheme: 'color-scheme-dark',
            style: 'color-style-default'
        },
        name: 'Profiles',
        auth:false,
        subMenus: subMenus,
        component: ReportIndex
    },
    ...Profiles
]
