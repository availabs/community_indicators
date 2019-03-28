import React, { Component } from 'react';
import { connect } from 'react-redux';
import Element from 'components/light-admin/containers/Element'
import CensusBarChart from "components/censusCharts/censusBarChart"

class Home extends Component {
    render () {
        return (
            <div>
            <Element>
            Report
            Test 123
            <div style = {{height : 10000}}>
            <CensusBarChart censusKey ={['B01001','B16001']}/>
            <CensusBarChart geoid={['36001']} compareGeoid ={['36']} />

            </div>
            {/*<CensusBarChart censusKey='B03046' />  geoid={['36001']} censusKey = {['B01001','B16001']}*/}
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