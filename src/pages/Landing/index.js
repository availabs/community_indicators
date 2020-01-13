
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import AvlMap from 'AvlMap'
import LandingLayer, { counties } from './LandingLayer'
import styled from 'styled-components'
import StatBox from 'components/censusCharts/statBox'

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
                            CAPITAL REGION INDICATORS ({ this.props.year })
                        </LandingHeader>
                        <div className='container' style={{maxWidth: '869px', color: '#efefef', background: 'rgba(0,0,0,0.3)', borderRadius: 4}}>
                            <div className='row'>
                                 <div className='col-md-6' style={{ padding: 15}}>
                                    <p style={{fontSize: '1.1em'}}>
                                    The Capital Region Indicators website aggregates and monitors local information that tells the story of New York State's Greater Capital Region.
                                    By analyzing and then planning action from a common set of data, we can work together to measure our
                                    progress and transform our region for the better.
                                    </p>
                                </div>
                                <div className='col-md-6' style={{ padding: 15, textAlign: 'center'}}>
                                    <StatBox
                                        title={'Population'}
                                        year={ this.props.year }
                                        censusKeys={['B01003_001E']}
                                        geoids={counties}
                                        yearPosition="none"
                                    />
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

const mapStateToProps = state => ({
  year: state.user.year
})

export default {
    icon: 'icon-map',
    path: '/',
    exact: true,
    mainNav: false,
    title: 'Welcome to Community Indicators',
    menuSettings: {image: 'none', 'scheme': 'color-scheme-dark'},
    name: 'Home',
    auth: false,
    component: connect(mapStateToProps)(Home)
}
