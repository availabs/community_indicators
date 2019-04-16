import React, { Component } from 'react';
import { connect } from 'react-redux';
import Element from 'components/light-admin/containers/Element'
//import CensusBarChart from "components/censusCharts/censusBarChart"
import CensusStackedBarChart from "components/censusCharts/bar/censusStackedBarChart"
import CensusBarChart from "components/censusCharts/bar/censusBarChart"
import CensusGroupedBarChart from "components/censusCharts/bar/censusGroupedBarChart"
import CensusLineChart from "components/censusCharts/line/censusLineChart"
class Home extends Component {
    render () {
        return (
            <div>
            <Element>
            Report
            Test 123
            <div style = {{height : 10000}}>
            <CensusStackedBarChart geoid={['36001']} censusKey={['B01001']}/>
            <CensusBarChart geoid={['36001']} censusKey={['B16001']}/>
            <CensusGroupedBarChart geoid={['36001']} compareGeoid={['36']} censusKey={['B23008']}/>
            <CensusLineChart geoid={['36001']} censusKey={['B19013']} />
            </div>
        </Element>
        </div>
    )
    }
}

export default {
    icon: 'os-icon-home',
    path: '/report',
    exact: true,
    mainNav: true,
    menuSettings: {
        image: 'none',
        scheme: 'color-scheme-dark',
        position: 'menu-position-left',
        layout: 'menu-layout-mini',
        style: 'color-style-default'
    },
    name: 'Home',
    auth: false,
    component: Home
}

