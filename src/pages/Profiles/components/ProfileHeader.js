
import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'
import AvlMap from 'AvlMap'
import HeaderLayerFactory from './HeaderLayer'
import styled from 'styled-components'

import GeoName from 'components/censusCharts/geoname'
import StatBox from 'components/censusCharts/statBox'

import deepequal from "deep-equal"

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
    flex-grow: 0;
    color: #efefef;
    font-size: 5em;
    font-weight: 500;
    font-family: "Proxima Nova W01";
    line-height: 1.5em;
    text-shadow:-1px -1px 0 #446,
        1px -1px 0 #446,
       -1px 1px 0 #446,
       1px 1px 0 #446;
    text-align:center;
    margin-bottom: 10px;
    padding: 0px 40px;
    > span.fa {
      display: none;
      margin-right: 20px;
    }
    ${ props => props.canToggle ? `
      cursor: pointer;
      :hover {
        background: rgba(0,0,0,0.3);
        > span.fa {
          display: inline-block;
        }
      }
    ` : `` }
`

let StatContainer = styled.div`
    flex-grow: 1;
    position: relative;
    max-width: 520px;
    margin: 0 auto;
    color: #efefef;
    background: rgba(0,0,0,0.3);
    borderRadius: 4;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    > * {
      width: 50%;
    }
`

const StyledToggle = styled.div`
`
const RegionToggle = ({ title, toggle }) =>
  <StyledToggle >
    { title }
  </StyledToggle>

class ProfileHeader extends Component {
  HeaderLayer = HeaderLayerFactory(this.props.geoids);

  componentDidUpdate(oldProps) {
    if (!deepequal(this.props.geoids, this.HeaderLayer.geoids)) {
      this.HeaderLayer.geoids = [...this.props.geoids];
      this.HeaderLayer.doAction(["fetchLayerData"]);
    }
  }
    render () {

console.log("PROFILE HEADER:", this.props)

        return (
                <div>

                    <HeaderContainer >
                        <div style={{
                            height: 400, display: "flex", flexDirection: "column",
                            justifyContent: "center"
                          }}>
                            <LandingHeader canToggle={ Boolean(this.props.regionToggle) }
                              onClick={ Boolean(this.props.regionToggle) ? this.props.regionToggle : null }>
                                <span className="fa fa-hand-o-up"/>
                                {
                                    this.props.title ?
                                    this.props.title
                                    : <GeoName geoids={this.props.geoids} />
                                }
                            </LandingHeader>

                            <StatContainer>
                                <div style={ { position: "relative" } }>
                                  <StatBox
                                    title={'Population'}
                                    year={ this.props.year }
                                    years={ this.props.years }
                                    compareYear={ this.props.compareYear }
                                    censusKeys={['B01003_001E']}
                                    geoids={this.props.geoids}
                                    yearPosition="none"/>
                                </div>
                                <div style={ { position: "relative" } }>
                                  <StatBox
                                    title={'Median Age'}
                                    year={ this.props.year }
                                    years={ this.props.years }
                                    censusKeys={['B01002_001E']}
                                    geoids={this.props.geoids}
                                    sumType='avg'
                                    maximumFractionDigits={1}
                                    yearPosition="none"/>
                                </div>
                                <div style={ { position: "relative" } }>
                                  <StatBox
                                    title={'Average Median Household Income'}
                                    year={ this.props.year }
                                    years={ this.props.years }
                                    valuePrefix={'$'}
                                    censusKeys={['B19013_001E']}
                                    geoids={this.props.geoids}
                                    sumType='avg'
                                    yearPosition="none"/>
                                </div>
                                <div style={ { position: "relative" } }>
                                  <StatBox
                                    title={'Poverty Rate'}
                                    year={ this.props.year }
                                    years={ this.props.years }
                                    compareYear={ this.props.compareYear }
                                    censusKeys={['B17001_002E']}
                                    valueSuffix={'%'}
                                    maximumFractionDigits={1}
                                    sumType='pct'
                                    divisorKeys={['B17001_001E']}
                                    yearPosition="none"
                                    invertColors={ true }
                                    geoids={this.props.geoids}/>
                                </div>

                            </StatContainer>

                        </div>
                    </HeaderContainer>

                    <div style={{width: '100%', height: '100vh', backgroundColor: '#333', position: 'fixed', top: 0, left: 0}}>
                        <AvlMap key={ this.props.region }
                            sidebar={false}
                            scrollZoom={false}
                            style={'mapbox://styles/am3081/cjfxdhwbu06jo2rqn1w0l9x9t'}
                            zoom={ 8 }
                            layers={[this.HeaderLayer]}
                            mapControl={false}
                        />
                    </div>
                </div>

        )
    }
    static defaultProps = {
        geoids: []
    }
}

const mapStateToProps = state => {
    return {
        geoGraph: state.graph.geo,
        router: state.router
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(ProfileHeader))
