import React from 'react';
import GridLayout from 'pages/Analysis/GraphLayout/GridLayout.js'
//import GraphLayout from 'pages/Analysis/GraphLayout'
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import subMenus from './submenu.js'
import Profiles from './Profile'
import ProfileHeader from './components/ProfileHeader'
import GRAPH_CONFIG from './regionConfig'

import OptionsModal from "components/censusCharts/OptionsModal"

const ALL_CENSUS_KEYS = Object.values(GRAPH_CONFIG)
  .reduce((a, c) =>
    [...a, ...c.reduce((a, c) => [...a, ...(c.censusKey ? [c.censusKey] : c.censusKeys ? c.censusKeys : [])], [])]
  , [])

const geoids = ['36001','36083','36093','36091','36039','36021','36115','36113']

class ReportIndex extends React.Component{
  state = {
    graphConfig: GRAPH_CONFIG
  }

  renderCategory(name, configData) {
      return (
        <Element name={name} key={ name }>
            <div className='content-box'>
                <div className='element-wrapper'>
                    <h4 className='element-header'>{ name.toUpperCase() }</h4>
                    <div classname='element-content'>
                        <GridLayout
                          sideWidth={800}
                          minifiedWidth={1}
                          isOpen={1}
                          title={''}
                          graphs={
                            configData.filter(d =>
                              (d.type !== "ProfileFooter") && (d.type !== "ProfileHeader")
                            )
                          }
                          geoids={ ['36001','36083','36093','36091','36039','36021','36115','36113'] }
                          compareGeoid={ this.props.compareGeoid }
                          verticalCompact={false}
                        />
                    </div>
                </div>
            </div>
        </Element>
      )
    }

  render() {
      const categories = Object.keys(GRAPH_CONFIG).map(category =>
        this.renderCategory(category, GRAPH_CONFIG[category])
      )
      return(
          <div >
            <ProfileHeader
                title={`Greater Capital Region`}
                geoids={['36001','36083','36093','36091','36039','36021','36115','36113']}
            />
            <div className='content-w' style={{ width: '100%', marginTop: '90vh', position: 'relative', zIndex: 4}}>
              <div className="os-tabs-controls content-w"  style={{position: 'sticky', top: 49, justifyContent: 'center',  zIndex:9999}}>
                <ul className="nav nav-tabs upper " style={{flexWrap: 'nowrap', flex: '1 1', display:'flex'}}>
                  {
                    Object.keys(GRAPH_CONFIG).map(category => {
                      return (
                        <li className="nav-item" style={{flex: '1 1'}} key={ category }>
                          <Link style={{textAlign: 'center'}} activeClass="active" spy={true} offset={-90} className="nav-link" to={category}>
                            {category.toUpperCase()}
                          </Link>
                        </li>

                      )
                    })
                  }
                </ul>
              </div>
              <div className='container'>
                  {categories}
              </div>
            </div>
            <OptionsModal />
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
