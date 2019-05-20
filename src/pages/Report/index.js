import React, { Component } from 'react';
import { connect } from 'react-redux';
import Element from 'components/light-admin/containers/Element'
import styled from "styled-components";
import AvlMap from 'AvlMap'
import TractsLayer from 'components/layers/TractsLayers.js'
import CensusPieCompare from "components/censusCharts/pie/censusPieCompare"
import CensusDomGraph from 'components/censusCharts/bar/censusDomGraph'
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
    name: 'Report',
    auth: false,
    component: Home
}

