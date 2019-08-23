
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import AvlMap from 'AvlMap'
 import HeaderLayer from './HeaderLayer'
import styled from 'styled-components'
import StatBox from 'components/censusCharts/statBox'

let HeaderContainer = styled.div` 
 width: 100vw;
 height: 100vh;
 position: fixed;
 top: 0;
 left: 0;
 display: flex;
 justify-content:center;
 align-items: center;
 background-image: linear-gradient(rgba(20,27,46,.5),rgba(20,27,46,.3) 10%,rgba(20,27,46,.5) 80%,#293145);
 z-index:2
 `

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

let StatContainer = styled.div`
    max-width: 520px;
    color: #efefef;
    background: rgba(0,0,0,0.3);
    borderRadius: 4;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`

// let LandingHeader = styled.h1`
//     color: #efefef;
//     font-size: 5em;
//     font-weight: 500;
//     font-family: "Proxima Nova W01";
//     line-height: 0.9;
//     text-shadow:-1px -1px 0 #446,
//         1px -1px 0 #446,
//        -1px 1px 0 #446,
//        1px 1px 0 #446;
//     text-align:center
//     background: none;
// `


class ProfileHeader extends Component {
    // fetchFalcorDeps() {
    //     let censusConfig ={};
    //     let census_subvars = [];
    //     let years = [this.props.year]
    //     if(this.props.compareYear) {
    //         years.push(this.props.compareYear)
    //     }
    //     return this.props.falcor
    //         .get(['acs',this.props.geoids,years, this.props.censusKey])
    //         .then(response =>{
    //             console.log('got data', response)
    //             return response
    //         })
    // }

    render () {
        return (
                <div>
                    <HeaderContainer >
                        <div style={{height: 400}}>
                            <LandingHeader>
                                {this.props.geoid}
                            </LandingHeader>
                            <div className='container'>
                                <StatContainer>
                                    <StatBox 
                                        title={'Population'}
                                        year={this.props.years.latest}
                                        compareYear={this.props.years.latest-1}
                                        censusKey={'B01003_001E'}
                                        geoids={[this.props.geoid]}
                                    />
                                    <StatBox 
                                        title={'Median Age'}
                                        year={this.props.years.latest}
                                        censusKey={'B01002_001E'}
                                        geoids={[this.props.geoid]}
                                    />
                                    <StatBox 
                                        title={'Median Household Income'}
                                        year={this.props.years.latest}
                                        compareYear={this.props.years.latest-1}
                                        valuePrefix={'$'}
                                        censusKey={'B19013_001E'}
                                        geoids={[this.props.geoid]}
                                    />
                                    <StatBox 
                                        title={'Poverty Rate'}
                                        year={this.props.years.latest}
                                        compareYear={this.props.years.latest-1}
                                        censusKey={'B17001_002E'}
                                        geoids={[this.props.geoid]}
                                    />
                                    <StatBox 
                                        title={'Poverty Rate'}
                                        year={this.props.years.latest}
                                        compareYear={this.props.years.latest-1}
                                        censusKey={'B17001_002E'}
                                        geoids={[this.props.geoid]}
                                    />
                                </StatContainer>
                            </div>
                        </div>
                    </HeaderContainer>
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
                        layers={[HeaderLayer]}
                        mapControl={false}
                    />
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