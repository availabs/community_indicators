
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import AvlMap from 'AvlMap'
// import LandingLayer from './LandingLayer'
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


class ProfileHeader extends Component {
    render () {
        return (
            <div>
                <div style={flexStyle}>
                    <div style={{height: 400}}>
                        <LandingHeader>
                            {this.props.geoid}
                        </LandingHeader>
                        <div className='container' style={{maxWidth: '869px', color: '#efefef', background: 'rgba(0,0,0,0.3)', borderRadius: 4, display:'flex'}}>
                            <StatBox 
                                title={'Population'}
                                year={this.props.years.latest}
                                compareYear={this.props.years.latest-1}
                                censusKey={'B01003_001E'}
                                geoids={[this.props.geoid]}
                            />
                        </div>
                    </div>
                </div> 
                <div style={{width: '100vw', height: '100vh', backgroundColor: '#333', position: 'fixed', top: 0, left: 0}}>
                    {/*
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
                    */}
                </div>

            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        geoGraph: state.graph.geo,
        router: state.router,
        years: state.user.years
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ProfileHeader))