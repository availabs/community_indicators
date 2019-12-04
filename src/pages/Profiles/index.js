import React from 'react';
import GridLayout from 'pages/Analysis/GraphLayout/GridLayout.js'
//import GraphLayout from 'pages/Analysis/GraphLayout'
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import subMenus from './submenu.js'
import Profiles from './Profile'
import ShareEmbed from "./ShareEmbed"
import ProfileHeader from './components/ProfileHeader'
import GRAPH_CONFIG from './regionConfig'

import OptionsModal from "components/censusCharts/OptionsModal"

import Sidebar from "./Sidebar"

const YEARS = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017]

const ALL_CENSUS_KEYS = Object.values(GRAPH_CONFIG)
  .reduce((a, c) =>
    [...a, ...c.reduce((a, c) => [...a, ...(c.censusKey ? [c.censusKey] : c.censusKeys ? c.censusKeys : [])], [])]
  , [])

const REGIONS = {
  "Capital Region": ['36001','36083','36093','36091'],
  "Greater Capital Region": ['36001','36083','36093','36091','36039','36021','36115','36113']
}

class ReportIndex extends React.Component{

  state = {
    year: 2017,
    compareYear: 2016,
    region: "Capital Region"
  }

  regionToggle() {
    const region = this.state.region === "Capital Region" ? "Greater Capital Region" : "Capital Region";
    this.setState({ region })
  }

  renderCategory(name, configData) {
      return (
        <Element name={name} key={ name }>
            <div className='element-wrapper'
              style={ { padding: 0, marginTop: 1 === 0 ? 0 : "20px" } }>
                <h4 className='element-header'
                  style={ { marginBottom: "1rem" } }>
                  { name.toUpperCase() }
                </h4>
            </div>
            <GridLayout
              sideWidth={800}
              minifiedWidth={1}
              isOpen={1}
              title={''}
              graphs={
                configData.filter(d =>
                  (d.type !== "ProfileFooter") && (d.type !== "ProfileHeader")
                ).map(d => {
                  const data = {
                    ...d,
                    year: this.state.year,
                    years: YEARS
                  };
                  if (data.showCompareYear) {
                    data.compareYear = this.state.compareYear;
                  }
                  return data;
                })
              }
              geoids={ REGIONS[this.state.region] }
              verticalCompact={false}
            />
        </Element>
      )
    }

    setGeoid(geoid) {
      this.props.history.push(`/profile/${ geoid }`)
    }

  render() {
      const categories = Object.keys(GRAPH_CONFIG).map(category =>
        this.renderCategory(category, GRAPH_CONFIG[category])
      )
      return(
          <div>
            <ProfileHeader regionToggle={ () => this.regionToggle() }
              title={ this.state.region }
              geoids={ REGIONS[this.state.region] }/>

            <div className='content-w' style={{ width: '100%', marginTop: '90vh', position: 'relative', zIndex: 4}}>
              <div className="os-tabs-controls content-w"  style={{position: 'sticky', top: 49, justifyContent: 'center',  zIndex:9999}}>
                  <Sidebar { ...this.state } years={ YEARS }
                    setGeoid={ geoid => this.setGeoid(geoid) }
                    setYear={ year => this.setState({ year }) }
                    setCompareYear={ compareYear => this.setState({ compareYear }) }
                    region={ this.state.region }
                    regionToggle={ () => this.regionToggle() }/>
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
        name: 'Community Profiles',
        auth:false,
        subMenus: subMenus,
        component: ReportIndex
    },
    ...Profiles,
    ShareEmbed
]
