import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import GridLayout from 'pages/Analysis/GraphLayout/GridLayout.js'
//import GraphLayout from 'pages/Analysis/GraphLayout'
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

// import subMenus from './submenu.js'
import subMenus from "./submenu"

import Profiles from './Profile'
import ShareEmbed from "./ShareEmbed"
import ProfileHeader from './components/ProfileHeader'
import GRAPH_CONFIG from './regionConfig'

import { setYear, setCompareYear } from "store/modules/user"
import { falcorChunkerNice } from "store/falcorGraph"

import OptionsModal from "components/censusCharts/OptionsModal"

import Sidebar from "./Sidebar"

import { YEARS } from "./graphConfig/utils"

// const YEARS = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017]
console.log("MENUS:", subMenus)
const ALL_CENSUS_KEYS = Object.values(GRAPH_CONFIG)
  .reduce((a, c) =>
    [...a, ...c.reduce((a, c) => [...a, ...(c.censusKey ? [c.censusKey] : c.censusKeys ? c.censusKeys : [])], [])]
  , [])

const REGIONS = {
  "Capital Region": ['36001','36083','36093','36091'],
  "Greater Capital Region": ['36001','36083','36093','36091','36039','36021','36115','36113']
}

class Profile extends React.Component{

  fetchFalcorDeps() {
    return falcorChunkerNice(["acs", "meta", ALL_CENSUS_KEYS, "label"])
      .then(() => this.props.falcor.get(["geo", [this.props.geoid, this.props.compareGeoid].filter(Boolean), "name"]));
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
                    year: this.props.year,
                    years: YEARS
                  };
                  if (data.showCompareYear) {
                    data.compareYear = this.props.compareYear;
                  }
                  return data;
                })
              }
              geoids={ REGIONS[this.props.region] }
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
            <ProfileHeader region={ this.props.region }
              title={ this.props.region }
              geoids={ REGIONS[this.props.region] }
                year={ this.props.year }
                compareYear={ this.props.compareYear }/>

            <div className='content-w' style={{ width: '100%', marginTop: '90vh', position: 'relative', zIndex: 4}}>
              <div className="os-tabs-controls content-w"  style={{position: 'sticky', top: 49, justifyContent: 'center',  zIndex:9999}}>
                  <Sidebar years={ YEARS }
                    year={ this.props.year }
                    compareYear={ this.props.compareYear }
                    setGeoid={ geoid => this.setGeoid(geoid) }
                    setYear={ year => this.props.setYear(year) }
                    setCompareYear={ compareYear => this.props.setCompareYear(compareYear) }/>
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

const mapStateToProps = (state, ownProps) => ({
  year: state.user.year,
  compareYear: state.user.compareYear
})

const mapDispatchToProps = {
  setYear,
  setCompareYear
};

const Component = connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Profile));

const Factory = region =>
  ({ ...props }) => <Component { ...props } region={ region }/>

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
        name: 'Capital Region',
        auth:false,
        subMenus: [subMenus[0].filter(({ path }) =>
          REGIONS['Capital Region'].reduce((a, c) =>
            a || path.includes(c)
          , false)
        )],
        component: Factory("Capital Region")
    },
    {
        icon: 'os-icon-home',
        path: '/profiles-greater',
        mainNav: true,
        exact: true,
        menuSettings:{
            image: 'none',
            scheme: 'color-scheme-dark',
            style: 'color-style-default'
        },
        name: 'Greater Capital Region',
        auth:false,
        subMenus: subMenus,
        component: Factory("Greater Capital Region")
    },
    ...Profiles,
    ShareEmbed
]
