import React from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";

import { ResponsiveBar } from '@nivo/bar'
import { getColorRange } from 'constants/color-ranges'

import { scaleOrdinal } from "d3-scale"
import { format } from "d3-format"

import get from "lodash.get"
import styled from "styled-components"

import GeoName from 'components/censusCharts/geoname'

const DEFAULT_COLORS = getColorRange(3, "Set3")

class HorizontalBarChart extends React.Component {
  state = {
    year: 2015
  }
  fetchFalcorDeps() {
    return this.props.falcor.get(
        ['acs', this.props.geoids, this.props.years, this.props.censusKeys]
    )
  }
  getBarData() {
    const leftVars = this.props.censusKeys.slice(...this.props.left.slice),
      rightVars = this.props.censusKeys.slice(...this.props.right.slice);
    return this.props.labels.map((label, i) => ({
      label,
      left: get(this.props.acsGraph, [this.props.geoids[0], this.state.year, leftVars[i]], 0) * -1,
      right: get(this.props.acsGraph, [this.props.geoids[0], this.state.year, rightVars[i]], 0)
    }));
  }
  render() {
    const fmt = format(",d");
    const colors = ({ id }) => get(this.props, [id, "color"], false) || DEFAULT_COLORS[id === "left" ? 0 : 2]
    return (
      <div style={ { width: "100%", height: "100%" } }>
        <div style={ { height: "30px", display: "flex" } }>
          <div style={ { lineHeight: "30px", fontSize: "20px", width: "20%", paddingLeft: "20px", whiteSpace: "nowrap" } }>{ this.props.name }</div>
          <div style={ { width: "60%", fontSize: "15px", display: "flex", justifyContent: "center", alignItems: "center" } }>
            { this.props.left.key }
            <div style={ { width: "20px", height: "20px", margin: "0px 5px", background: colors({ id: "left" }) } }/>
            <div style={ { width: "20px", height: "20px", margin: "0px 5px", background: colors({ id: "right" }) } }/>
            { this.props.right.key }
          </div>
          <div style={ { width: "20%", fontSize: "15px", paddingRight: "20px", display: "flex", alignItems: "center", justifyContent: "end" } }>
            <span style={ { marginRight: "10px" } }>Year: { this.state.year }</span>
            <input type="range"
              min={ this.props.years[0] }
              max={ this.props.years[this.props.years.length - 1] }
              value={ this.state.year }
              onChange={ e => this.setState({ year: e.target.value }) }
              step="1"/>
          </div>
        </div>
        <div style={ { height: "calc(100% - 30px)" } }>
          <ResponsiveBar data={ this.getBarData() }
            indexBy="label"
            keys={ ["left", "right"] }
            colors={ colors }
            margin={ { top: 0, right: 20, bottom: 30, left: this.props.marginLeft } }
            layout = "horizontal"
            enableLabel={ false }
            axisBottom={ {
              format: d => fmt(Math.abs(d))
            } }/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  acsGraph: get(state, ["graph", "acs"], {})
})

const ConnectedHorizontalBarChart = connect(mapStateToProps, null)(reduxFalcor(HorizontalBarChart));

ConnectedHorizontalBarChart.defaultProps = {
  years: [2010, 2011, 2012, 2013, 2014, 2015, 2016],
  marginLeft: 100
}

export default ConnectedHorizontalBarChart;
