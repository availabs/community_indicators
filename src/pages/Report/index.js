import React, { Component } from 'react';
import { connect } from 'react-redux';
import Element from 'components/light-admin/containers/Element'
import CensusStackedBarChart from "components/censusCharts/bar/censusStackedBarChart"
import CensusBarChart from "components/censusCharts/bar/censusBarChart"
import CensusGroupedBarChart from "components/censusCharts/bar/censusGroupedBarChart"
import CensusLineChart from "components/censusCharts/line/censusLineChart"
import CensusPieChart from "components/censusCharts/pie/censusPieChart"
import CensusPieCompare from "components/censusCharts/pie/censusPieCompare"
import CensusDomGraph from 'components/censusCharts/bar/censusDomGraph'
class Home extends Component {
    render () {

        return (
            <div>
            <Element>
                <div style = {{height :800}}>
                <h1> Racial Population </h1>
                <CensusPieCompare geoid={['36001','36083','36093','36091','36039','36021','36115','36113']} censusKey={['B02001']}/>
                    <div style={{height: '100vh', width: '50vw'}}>
                    <div style={{padding: 20, position: 'relative'}}>
                        <CensusDomGraph geoid={['36001']} censusKey={['B02001']}/>
                    </div>
                    </div>
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

