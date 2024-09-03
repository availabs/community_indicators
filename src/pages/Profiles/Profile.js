import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import GridLayout from 'pages/Analysis/GraphLayout/GridLayout.js'
// import subMenus from './submenu.js'
import ProfileHeader from './components/ProfileHeader'
//import GraphLayout from 'pages/Analysis/GraphLayout'
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'
import { falcorChunkerNice } from "store/falcorGraph"
import SearchCompare from './components/SearchCompare'
import { withRouter } from "react-router-dom"

import {
  setYear,
  setCompareYear,
  setYearAndCompareYear
} from "store/modules/user"

import OptionsModal from "components/censusCharts/OptionsModal"

import { processBaseConfig } from "./graphConfig/utils"
import BASE_GRAPH_CONFIG from './graphConfig'

import Sidebar from "./Sidebar"

import get from "lodash.get"
import debounce from "lodash.debounce"

import { ACS_DATA_YEARS } from "./graphConfig/utils"

const ALL_CENSUS_KEYS = Object.values(BASE_GRAPH_CONFIG)
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

const otherRegex = /unsd|zcta/

class Profile extends React.Component {
  constructor(props) {
      super(props);
      this.renderCategory = this.renderCategory.bind(this);

      this.state = {
        GRAPH_CONFIG: this.processConfig()
      }
      this.processConfig = this.processConfig.bind(this);
      this._loadConfig = this._loadConfig.bind(this);
      this.loadConfig = debounce(this._loadConfig, 250);

  }
  componentDidMount() {
    window.addEventListener("resize", this.loadConfig);

    const year = get(this.props, ["match", "params", "year"], null);
    const compareYear = get(this.props, ["match", "params", "compareYear"], null);

    if (year && compareYear) {
      this.props.setYearAndCompareYear(year, compareYear);
    }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.loadConfig);
  }
  componentDidUpdate(oldProps) {
    if (oldProps.geoid !== this.props.geoid) {
      this._loadConfig();
    }
  }
  processConfig() {
    const CONFIG = { ...BASE_GRAPH_CONFIG };
    // if (otherRegex.test(this.props.geoid)) {
    //   delete CONFIG.Links;
    // }
    return processBaseConfig(CONFIG, this.props);
  }
  _loadConfig() {
    this.setState({ GRAPH_CONFIG: this.processConfig() });
  }

  fetchFalcorDeps() {
    const geoids = [this.props.geoid, this.props.compareGeoid].filter(Boolean);
    return falcorChunkerNice(["acs", "meta", ALL_CENSUS_KEYS, "label"])
      .then(() => {
        return this.props.falcor.get(
          ["geo", geoids, ["name", "zcta", "unsd"]]
        )
      });
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
                      setGeoid={ geoid => this.setGeoid(geoid) }
                      graphs={
                        configData.map(d => {
                          const data = {
                            ...d,
                            year: this.props.year,
                            years: ACS_DATA_YEARS
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

//     searchNav(type, compareId) {
// // console.log('set compreId', compareId, this.props)
//       if(type === 'add') {
//         this.props.history.push(`/profile/${this.props.geoid}/compare/${compareId}`)
//       } else if (type === 'remove') {
//         this.props.history.push(`/profile/${this.props.geoid}`)
//       }
//     }

    setGeoid(geoid) {
      if (this.props.compareGeoid === null) {
        this.props.history.push(`/profile/${ geoid }`)
      }
      else {
        this.props.history.push(`/profile/${ geoid }/compare/${ this.props.compareGeoid }`)
      }
      this.forceUpdate();
    }
    setCompareGeoid(compareGeoid) {
      if (compareGeoid === null) {
        this.props.history.push(`/profile/${this.props.geoid}`)
      }
      else {
        this.props.history.push(`/profile/${this.props.geoid}/compare/${compareGeoid}`)
      }
      this.forceUpdate();
    }

    render() {
        const categories = Object.keys(this.state.GRAPH_CONFIG)
          .map((category, i) =>
              this.renderCategory(category, this.state.GRAPH_CONFIG[category], i)
          )
        return (
            <div>
                <ProfileHeader geoids={ [this.props.geoid] }
                  year={ this.props.year }
                  compareYear={ this.props.compareYear }
                  years={ ACS_DATA_YEARS }/>
                <div className='content-w' style={{ width: '100%', marginTop: '95vh', position: 'relative', zIndex: 4}}>
                    <div className="os-tabs-controls content-w"  style={{position: 'sticky', top: 49, justifyContent: 'center',  zIndex:9999}}>
                        <Sidebar
                          year={ this.props.year }
                          compareYear={ this.props.compareYear }
                          years={ ACS_DATA_YEARS }
                          geoid={ this.props.geoid }
                          setGeoid={ geoid => this.setGeoid(geoid) }
                          compareGeoid={ this.props.compareGeoid }
                          setYear={ year => this.props.setYear(year) }
                          setCompareYear={ compareYear => this.props.setCompareYear(compareYear) }
                          setCompareGeoid={ compareGeoid => this.setCompareGeoid(compareGeoid)}/>

                        <NavBar GRAPH_CONFIG={ this.state.GRAPH_CONFIG }/>

                    </div>
                    <div className='container' style={ { paddingBottom: "10rem" } }>
                        {categories}
                    </div>
                </div>
                <OptionsModal />
            </div>

        )
    }
}

export const NavBar = ({ GRAPH_CONFIG, ...props }) => {
  const [ref, setRef] = React.useState(null),
    [hide, setHide] = React.useState(0);

  const onResize = React.useCallback(e => {
    if (ref) {
      setHide(ref.scrollWidth > ref.clientWidth);
    }
  }, [ref])
  React.useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    }
  }, [onResize]);

  React.useEffect(() => {
    if (ref) {
      setHide(ref.scrollWidth > ref.clientWidth);
    }
  }, [ref, hide])
  return (
    <ul className="nav nav-tabs upper" ref={ setRef }
      style={ {
        flexWrap: 'nowrap', flex: '1 1', display: 'flex',
        overflow: "hidden", height: hide ? "0px" : "auto"
      } }>
      { Object.keys(GRAPH_CONFIG).map(category =>
          <li className="nav-item" style={ { flex: '1 1', margin: "0px 0px 2px 0px" } } key={ category }>
            <Link style={ { textAlign: 'center', padding: "0.5rem 1rem calc(0.5rem - 2px) 1rem", margin: "0rem" } }
              activeClass="active" spy={ true } offset={ -90 }
              className="nav-link" to={ category }>
              { category.toUpperCase() }
            </Link>
          </li>
        )
      }
    </ul>
  )
}

const mapStateToProps = (state, ownProps) => ({
  geoGraph: state.graph.geo,
  router: state.router,
  geoid: get(ownProps, ["match", "params", "geoid"], "36"),
  compareGeoid: get(ownProps, ["match", "params", "compare"], null),
  user: state.user,
  year: state.user.year,
  compareYear: state.user.compareYear
  // year: get(ownProps, ["match", "params", "year"], state.user.year),
  // compareYear: get(ownProps, ["match", "params", "compareYear"], state.user.compareYear)
})

const mapDispatchToProps = {
  setYear,
  setCompareYear,
  setYearAndCompareYear
};

const component = withRouter(connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(Profile)));

export default [
  {
      path: ['/profile/:geoid', '/profile/:geoid/:year/:compareYear', '/profile/:geoid/compare/:compare', '/profile/:geoid/:year/compare/:compare/:compareYear'],
      exact: true,
      name: 'Profile',
      mainNav: false,
      menuSettings: {
          image: 'none',
          'scheme': 'color-scheme-dark',
          style: 'color-style-default'
      },
      // subMenus,
      auth: false,
      component
  },
  // {
  //     path: '/profile/:geoid/compare/:compare',
  //     exact: true,
  //     name: 'Profile',
  //     mainNav: false,
  //     menuSettings: {
  //         image: 'none',
  //         'scheme': 'color-scheme-dark',
  //         style: 'color-style-default'
  //     },
  //     // subMenus,
  //     auth: false,
  //     component: withRouter(component)
  // }
]
