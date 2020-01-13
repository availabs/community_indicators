import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import GridLayout from 'pages/Analysis/GraphLayout/GridLayout.js'
import subMenus from './submenu.js'
import ProfileHeader from './components/ProfileHeader'
//import GraphLayout from 'pages/Analysis/GraphLayout'
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import { falcorChunkerNice } from "store/falcorGraph"
import SearchCompare from './components/SearchCompare'

import { setYear, setCompareYear } from "store/modules/user"

import OptionsModal from "components/censusCharts/OptionsModal"

import GRAPH_CONFIG from './graphConfig'

import Sidebar from "./Sidebar"

import styled from "styled-components"
import get from "lodash.get"

import { YEARS } from "./graphConfig/utils"

const ALL_CENSUS_KEYS = Object.values(GRAPH_CONFIG)
  .reduce((a, c) =>
    [...a,
      ...c.reduce((a, c) =>
        [...a,
          ...(c.censusKey ? [c.censusKey] : c.censusKeys ? c.censusKeys : []),
          ...(c.divisorKey ? [c.divisorKey] : c.divisorKeys ? c.divisorKeys : [])
        ]
      , [])
    ]
  , [])

const Footer = styled.div`
  position: relative;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.2),
              -1px -1px 2px 0 rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
  margin-bottom: 10px;
  border-radius: 4px;
`
const Header = styled.div`
  font-size: 1.5rem;
`
const SubHeader = styled.div`
  font-size: 0.75rem;
  margin-top: -7px;
  margin-bottom: 5px;
`
const Body = styled.div`
  font-size: 1rem;
`
const Href = styled.a`
  font-size: 1rem;
  position: absolute;
  top: 10px;
  right: 20px;
`

// const YEARS = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017]

const GetFooter = ({ type, value }) =>
  type === "header" ? <Header>{ value }</Header> :
  type === "subheader" ? <SubHeader>{ value }</SubHeader> :
  type === "body" ? <Body>{ value }</Body> :
  type === "link" ? <Href target="_blank" className="btn btn-sm btn-success" href={ value }>Link</Href> :
  null

const ProfileFooter = ({ data }) =>
  <div>
    {
      data.map((d, i) =>
        <Footer key={ i }>
          { d.map((d, i) => <GetFooter key={ i } { ...d }/>) }
        </Footer>
      )
    }
  </div>



class Profile extends React.Component{
  constructor(props) {
      super(props);
      this.renderCategory = this.renderCategory.bind(this);
      this.searchNav = this.searchNav.bind(this);
  }

  fetchFalcorDeps() {
    return falcorChunkerNice(["acs", "meta", ALL_CENSUS_KEYS, "label"])
      .then(() => this.props.falcor.get(["geo", [this.props.geoid, this.props.compareGeoid].filter(Boolean), "name"]));
  }

  renderCategory(name, configData, i) {
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
                        )
                        .map(d => {
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
                      geoid={ this.props.geoid }
                      compareGeoid={ this.props.compareGeoid }
                      verticalCompact={false}/>
            </Element>
        )
    }

    searchNav(type, compareId) {
      console.log('set compreId', compareId, this.props)
      if(type === 'add') {
        this.props.history.push(`/profile/${this.props.geoid}/compare/${compareId}`)
      } else if (type === 'remove') {
        this.props.history.push(`/profile/${this.props.geoid}`)
      }
    }

    setGeoid(geoid) {
      if (this.props.compareGeoid === null) {
        this.props.history.push(`/profile/${ geoid }`)
      }
      else {
        this.props.history.push(`/profile/${ geoid }/compare/${ this.props.compareGeoid }`)
      }
    }
    setCompareGeoid(compareGeoid) {
      if (compareGeoid === null) {
        this.props.history.push(`/profile/${this.props.geoid}`)
      }
      else {
        this.props.history.push(`/profile/${this.props.geoid}/compare/${compareGeoid}`)
      }
    }

    render() {
        const categories = Object.keys(GRAPH_CONFIG).map((category, i) =>
            this.renderCategory(category, GRAPH_CONFIG[category], i)
        )
// console.log("PROFILE COMPARE GEOID:", this.props.compareGeoid)
        return (
            <div>
                <ProfileHeader geoids={ [this.props.geoid] }
                  year={ this.props.year }
                  compareYear={ this.props.compareYear }
                  years={ YEARS }/>
                <div className='content-w' style={{ width: '100%', marginTop: '95vh', position: 'relative', zIndex: 4}}>
                    <div className="os-tabs-controls content-w"  style={{position: 'sticky', top: 49, justifyContent: 'center',  zIndex:9999}}>
                        <Sidebar
                          year={ this.props.year }
                          compareYear={ this.props.compareYear }
                          years={ YEARS }
                          geoid={ this.props.geoid }
                          setGeoid={ geoid => this.setGeoid(geoid) }
                          compareGeoid={ this.props.compareGeoid }
                          setYear={ year => this.props.setYear(year) }
                          setCompareYear={ compareYear => this.props.setCompareYear(compareYear) }
                          setCompareGeoid={ compareGeoid => this.setCompareGeoid(compareGeoid)}/>
                        <ul className="nav nav-tabs upper " style={{flexWrap: 'nowrap', flex: '1 1', display:'flex'}}>

                            {/*<li className="nav-item" style={{flex: '1 1'}} key={ 'search' }>
                              <SearchCompare onChange={this.searchNav} compare={this.props.compareGeoid} />
                            </li>*/}
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
  geoGraph: state.graph.geo,
  router: state.router,
  years: state.user.years,
  geoid: get(ownProps, ["match", "params", "geoid"], "36"),
  compareGeoid: get(ownProps, ["match", "params", "compare"], null),
  user: state.user,
  year: state.user.year,
  compareYear: state.user.compareYear
})

const mapDispatchToProps = {
  setYear,
  setCompareYear
};

const component = connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Profile));

export default [
  {
      path: '/profile/:geoid',
      exact: true,
      name: 'Profile',
      mainNav: false,
      menuSettings: {
          image: 'none',
          'scheme': 'color-scheme-dark',
          style: 'color-style-default'
      },
      subMenus,
      auth: false,
      component
  },
  {
      path: '/profile/:geoid/compare/:compare',
      exact: true,
      name: 'Profile',
      mainNav: false,
      menuSettings: {
          image: 'none',
          'scheme': 'color-scheme-dark',
          style: 'color-style-default'
      },
      subMenus,
      auth: false,
      component
  }
]
