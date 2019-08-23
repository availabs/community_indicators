
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import AvlMap from 'AvlMap'
import LandingLayer from './LandingLayer'
import styled from 'styled-components'

let flexStyle = {width: '100vw',
 height: '100vh',
 position: 'fixed',
 top: 0,
 left: 0,
 zIndex: 998,
 display: 'flex',
 justifyContent:'center',
 alignItems: 'center'
}

let LandingHeader = styled.h1`
    color: #efefef;
    font-size: 5em;
    font-weight: 500;
    font-family: "Proxima Nova W01";
    line-height: 0.9;
    text-shadow:-1px -1px 0 #446,
        1px -1px 0 #446,
       -1px 1px 0 #446,
       1px 1px 0 #446;
    text-align:center;
`

class Home extends Component {
    render () {
        return (
            <div>
                <div style={flexStyle}>
                    <div style={{height: 400}}>
                        <LandingHeader>
                            CAPITAL DISTRICT CITIES
                        </LandingHeader>
                        <div className='container' style={{maxWidth: '869px', color: '#efefef', background: 'rgba(0,0,0,0.3)', borderRadius: 4}}>
                            <div className='row'>
                                 <div className='col-md-6' style={{ padding: 15}}> 
                                    <p style={{fontSize: '1.1em'}}>
                                    CDCI aggregates and monitors local information that tells the story of  New York's Capital District. 
                                    By analyzing and then planning action from a common set of data, we can work together to measure our 
                                    progress and transform our region for the better. 
                                    </p>
                                </div>
                                <div className='col-md-6' style={{ padding: 15, textAlign: 'center'}}> 
                                   <div style={{color: '#efefef', fontSize: '3em', lineHeight: 1, fontWeight: '100'}}>Population</div>
                                   <div style={{color: '#efefef', fontSize: '4em', lineHeight: 1, fontWeight: '100'}}>1,032,180</div>
                                   <div style={{color: '#efefef', fontSize: '2em', lineHeight: 1, fontWeight: '100'}}>&nbsp;89.25 person / km<sup>2</sup></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
                <div style={{width: '100vw', height: '100vh', backgroundColor: '#333', position: 'fixed', top: 0, left: 0}}>
                    <AvlMap
                        sidebar={false}
                        scrollZoom={false}
                        zoom={10}
                        style={'mapbox://styles/am3081/cjfxdhwbu06jo2rqn1w0l9x9t'}
                        fitBounds={[
                            [
                                -75.84467427717281,
                                38.538851525354666
                            ],
                            [
                                -70.7626953125,
                            45.042478050891546
                            ]   
                        ]}
                        layers={[LandingLayer]}
                        mapControl={false}
                    />
                </div>
            </div>

        )
    }
}

export default {
    icon: 'icon-map',
    path: '/',
    exact: true,
    mainNav: false,
    title: 'Welcome to Community Indicators',
    menuSettings: {image: 'none', 'scheme': 'color-scheme-dark'},
    name: 'Home',
    auth: false,
    component: Home
}