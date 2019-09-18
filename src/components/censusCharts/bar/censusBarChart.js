import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";

import { ResponsiveBar } from '@nivo/bar'
import { getColorRange } from 'constants/color-ranges'

import Options from '../Options'
import Title from "../ComponentTitle"

import { scaleOrdinal } from "d3-scale"
import { format } from "d3-format"

import get from "lodash.get"
import styled from "styled-components"

import GeoName from 'components/censusCharts/geoname'
import CensusName from 'components/censusCharts/CensusName'

const DEFAULT_COLORS = getColorRange(12, "Set3")

const TooltipContainer = styled.div`
  display: flex;
  > div {
    margin-right: 5px;
  }
  > div:last-child {
    margin-right: 0px;
  }
`

const Tooltip = ({ color, value, label, geoid }) =>
  <TooltipContainer>
    <div style={ { width: "15px", height: "15px", background: color, marginRight: "5px" } }/>
    <div><GeoName geoid={ geoid }/></div>
    <div style={ { marginRight: "5px", fontWeight: "bold" } }><CensusName key={ label } censusKeys={ [label] }/></div>
    <div>{ value }</div>
  </TooltipContainer>

class CensusBarChart extends React.Component {
  fetchFalcorDeps() {
    return this.props.falcor.get(
        ['acs', this.props.geoids, this.props.years, this.props.censusKeys]
    )
  }
  render() {
    const colors = scaleOrdinal()
      .domain(this.props.geoids)
      .range(DEFAULT_COLORS);
    const fmt = format(this.props.yFormat);
    // console.log('data', this.props.barData)
    if(this.props.sorted) {
      this.props.barData.sort((a,b) => a[this.props.geoids[0]] - b[this.props.geoids[0]])
    }
    const getKeyName = key => get(this.props.acsGraph, ["meta", key, "label"], key);
    return (
      <div style={ { width: "100%", height: "100%" } }>
        <div style={ { height: "30px" } }>
          <div style={ { maxWidth: "calc(100% - 285px)" } }><Title title={ this.props.title }/></div>
          <Options />
        </div>
        <div style={ { height: "calc(100% - 30px)"} }>
          <ResponsiveBar indexBy={ "id" }
            keys={ this.props.geoids }
            data={ this.props.barData }
            margin={ { top: 10, right: 20,
              bottom: this.props.axisBottom ? 30 : 20,
              left: this.props.marginLeft } }
            colors={ d => colors(d.id) }
            labelSkipWidth={ 100 }
            labelFormat={ fmt }
            groupMode="grouped"
            animation={this.props.animation}
            layout={this.props.orientation}
            tooltip={ ({ color, indexValue, value, id, ...rest }) => (//console.log("REST:", rest),
                <Tooltip geoid={ id }
                  value={ fmt(value) }
                  color={ color }
                  label={ indexValue }/>
              )
            }
            axisLeft={ {
              format: this.props.orientation === 'horizontal' ? getKeyName : fmt
            } }
            axisBottom={
              !this.props.axisBottom ? null : {
                format: this.props.orientation === "horizontal" ? fmt : getKeyName
              }
            }/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  barData: getBarData(state, props),
  acsGraph: get(state, ["graph", "acs"], {})
})

const getBarData = (state, props) =>
  props.censusKeys.reduce((a, c) => {
    const bar = { id: c };
    props.geoids.forEach(geoid => {
      const year = get(props, "years[0]", 2015);
      bar[geoid] = get(state, ["graph", "acs", geoid, year, c], 0);
    })
    a.push(bar);
    return a;
  }, [])

const ConnectedCensusBarChart = connect(mapStateToProps, null)(reduxFalcor(CensusBarChart));

ConnectedCensusBarChart.defaultProps = {
  years: [2015],
  yFormat: ",d",
  axisBottom: true,
  marginLeft: 75,
  orientation: 'vertical',
  animation: false
}

export default ConnectedCensusBarChart
