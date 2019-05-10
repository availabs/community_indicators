import React, { Component } from 'react';
import { connect } from 'react-redux';
import Element from 'components/light-admin/containers/Element'
import styled from "styled-components";

import CensusStackedBarChart from "components/censusCharts/bar/censusStackedBarChart"
import CensusBarChart from "components/censusCharts/bar/censusBarChart"
import CensusGroupedBarChart from "components/censusCharts/bar/censusGroupedBarChart"
import CensusLineChart from "components/censusCharts/line/censusLineChart"
import CensusStackedLineChart from "components/censusCharts/line/censusStackedLineChart"
import CensusMultiStackedLineChart from "components/censusCharts/line/censusMultiStackedLineChart"
import CensusPieChart from "components/censusCharts/pie/censusPieChart"
import AvlMap from 'AvlMap'
import TractsLayer from 'components/layers/TractsLayers.js'
import CensusPieCompare from "components/censusCharts/pie/censusPieCompare"
import CensusDomGraph from 'components/censusCharts/bar/censusDomGraph'
import CensusStatBox from 'components/censusCharts/statBox/censusStatBox.js'

import subMenus from 'pages/Report/countyPage-submenu.js'
class Home extends Component {
    constructor(props){
        super(props);
        this.state ={
            update: {id:0}
        }
        this.onMeasureClick = this.onMeasureClick.bind(this)
    }
    onMeasureClick (d) {
        TractsLayer.filters.censvar.value = d;
        let update = Object.assign({},this.state.update);
        update.id = update.id+1;
        this.setState({update})
    }
    render () {
        return (
            <div>
            <Element>
            <div style={{height:5000}}>
            <h4>Demographics</h4>
            <div class="Demographics" style={{color:'rgba(0,0,0,.8)',fontSize:'12px',fontWeight: '400',display: 'flex', alignContent: 'center', alignItems:'center', justifyContent:'flex-start',flexWrap: 'wrap',flexDirection:'row',margin: '0 5px'}}>
                <CensusStatBox geoid={['36001']} censusKey={['B01003']} year={['2017']}/>
                <CensusStatBox geoid={['36001']} censusKey={['B01002']} year={['2017']}/>
            </div>
            <CensusStackedBarChart geoid={['36001']} censusKey={['B01001']}/>
            <CensusBarChart geoid={['36001']} censusKey={['B16001']}/>
            <CensusGroupedBarChart geoid={['36001']} compareGeoid={['36']} censusKey={['B23008']}/>
            <div class="Economy" style={{color:'rgba(0,0,0,.8)',fontSize:'12px',fontWeight: '400',display: 'flex', alignContent: 'center', alignItems:'center', justifyContent:'flex-start',flexWrap: 'wrap',flexDirection:'row',margin: '0 5px'}}>
            <CensusLineChart geoid={['36001']} censusKey={['B19013']}/>
            <h4>Economy
            <CensusStatBox geoid={['36001']} censusKey={['B19013']} amount={true}/>
            </h4>
            </div>
            <div class="Poverty" style={{color:'rgba(0,0,0,.8)',fontSize:'12px',fontWeight: '400',display: 'flex', alignContent: 'center', alignItems:'center', justifyContent:'flex-start',flexWrap: 'wrap',flexDirection:'row',margin: '0 5px'}}>
            <CensusLineChart geoid={['36001']} censusKey={['B17001']}/>
            <h4>Poverty
            <CensusStatBox geoid={['36001']} censusKey={['B17001']} poverty={true}/>
            </h4>
            </div>
            <div class="Housing" style={{color:'rgba(0,0,0,.8)',fontSize:'12px',fontWeight: '400',display: 'flex', alignContent: 'center', alignItems:'center', justifyContent:'flex-start',flexWrap: 'wrap',flexDirection:'row',margin: '0 5px'}}>
            <CensusStackedLineChart geoid={['36001']} censusKey={['B25002']}/>
            <h4>Housing
            <CensusStatBox geoid={['36001']} censusKey={['B25002']} housing={true}/>
            </h4>
            </div>
            <div class="Education" style={{color:'rgba(0,0,0,.8)',fontSize:'12px',fontWeight: '400',display: 'flex', alignContent: 'center', alignItems:'center', justifyContent:'flex-start',flexWrap: 'wrap',flexDirection:'row',margin: '0 5px'}}>
            <CensusMultiStackedLineChart geoid={['36001']} censusKey={['B15003']}/>
            <h4>Education
            <CensusStatBox geoid={['36001']} censusKey={['B15003']} education={true}/>
            </h4>
            </div>
            <h1> Racial Population for the year 2017 </h1>
            <CensusPieChart geoid={['36001']} censusKey={['B02001']} year={['2017']}/>
            <h1>Racial Population</h1>
            <CensusPieCompare geoid={['36001','36083','36093','36091','36039','36021','36115','36113']} censusKey={['B02001']}/>
            <div style={{width: '90%', height: '100vh', display: 'flex', alignContent: 'stretch', alignItems:'stretch', marginLeft: 40}}>
            <div style={{height: '100vh', width: '50vw'}}>
            <div style={{padding: 20, position: 'relative'}}>
                <CensusDomGraph
                    geoid={['36001','36083','36093']}
                    censusKey={['B02001']}
                    onClick={this.onMeasureClick} />
            </div>
            </div>
            <div style={{height: '90vh', width: '50%'}}>
            <AvlMap
                    sidebar={false}
                    scrollZoom={false}
                    zoom={6}
                    update={[this.state.update]}
                    style={'mapbox://styles/am3081/cjt7mqq7b2r5f1fo0iw1zzgu7'}
                    fitBounds={[
                            [
                                -75.84467427717281,
                                38.538851525354666
                            ],
                        [
                            -70.7626953125,
                        45.042478050891546
                ]]}
                    layers={[TractsLayer]}
            />
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
        style: 'color-style-default',
        subemenustyle: 'sub-menu-style-over'
    },
    subMenus:subMenus,
    name: 'Home',
    auth: false,
    component: Home
}

