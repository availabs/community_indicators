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

const DEFAULT_COLORS = getColorRange(8, "Set2").slice(6)

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
    <div><GeoName geoids={ [geoid] }/></div>
    <div style={ { marginRight: "5px", fontWeight: "bold" } }>{ label }</div>
    <div>{ value }</div>
  </TooltipContainer>

class HorizontalBarChart extends React.Component {
  static defaultProps = {
    years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
    marginLeft: 100
  }
  state = {
    year: this.props.years[this.props.years.length - 1]
  }
  fetchFalcorDeps() {
    return this.props.falcor.get(
        ['acs', this.props.allGeoids, this.props.years, this.props.censusKeys],
        ["geo", this.props.allGeoids, "name"]
    )
  }
  getBarData() {
    const leftVars = this.props.left.keys,
      rightVars = this.props.right.keys;
    return this.props.labels.map((label, i) => {
      const bar = { label };
      this.props.allGeoids.forEach(geoid => {
        bar[`left-${ geoid }`] = get(this.props.acsGraph, [geoid, this.state.year, leftVars[i]], 0) * -1
        bar[`right-${ geoid }`] = get(this.props.acsGraph, [geoid, this.state.year, rightVars[i]], 0)
      })
      return bar;
    })
  }
  getBarDataOld() {
    const leftVars = this.props.left.keys,
      rightVars = this.props.right.keys;
    return this.props.labels.map((label, i) => ({
      label,
      left: get(this.props.acsGraph, [this.props.geoids[0], this.state.year, leftVars[i]], 0) * -1,
      right: get(this.props.acsGraph, [this.props.geoids[0], this.state.year, rightVars[i]], 0)
    }));
  }
  processDataForViewing() {
    const data = [],
      keys = ["geoid", "name", "year", "census key", "census label", "value"],

      leftKeys = this.props.left.keys,
      leftLabel = this.props.left.key,

      rightKeys = this.props.right.keys,
      rightLabel = this.props.right.key;

    this.props.labels.forEach((label, i) => {
      for (const geoid of this.props.allGeoids) {
        const baseRow = {
          geoid,
          name: get(this.props.geoGraph, [geoid, "name"], geoid),
          year: this.state.year
        }

        const row1 = { ...baseRow };
        row1["census key"] = leftKeys[i];
        row1["census label"] = `${ label }, ${ leftLabel }`;
        row1.value = get(this.props.acsGraph, [geoid, baseRow.year, leftKeys[i]], 0);
        data.push(row1);

        const row2 = { ...baseRow };
        row2["census key"] = rightKeys[i];
        row2["census label"] = `${ label }, ${ rightLabel }`;
        row2.value = get(this.props.acsGraph, [geoid, baseRow.year, rightKeys[i]], 0);
        data.push(row2);
      }
    })

    return { data, keys };
  }
  render() {
    const fmt = format(",d");

    const left = get(this.props, ["left", "color"], DEFAULT_COLORS[0]),
      right = get(this.props, ["right", "color"], DEFAULT_COLORS[1]);

    const darken = (color, i) => {
      const r = parseInt(color.slice(1, 3), 16),
        g = parseInt(color.slice(3, 5), 16),
        b = parseInt(color.slice(5), 16);
      return "#" + (r - 32 * i).toString(16) + (g - 32 * i).toString(16) + (b - 32 * i).toString(16)
    }

    const colors = this.props.allGeoids.reduce((a, c, i) => {
      a[`left-${ c }`] = darken(left, i);
      a[`right-${ c }`] = darken(right, i);
      return a;
    }, { left, right });

    const getColors = id => colors[id];

    const keys = this.props.allGeoids.reduce((a, c) => [...a, `left-${ c }`, `right-${ c }`], [])
      .sort((a, b) => a.includes("left") ? -1 : 1);

    return (
      <div style={ { width: "100%", height: "100%" } }>
        <div style={ { height: "30px" } }>
          <div style={ { maxWidth: "calc(100% - 285px)" } }><Title title={ this.props.title }/></div>
          <Options processDataForViewing={ this.processDataForViewing.bind(this) }
            tableTitle={ this.props.title }/>
        </div>
        <div style={ { height: "calc(100% - 60px)" } }>
          <ResponsiveBar data={ this.getBarData() }
            colors={ ({ id }) => getColors(id) }
            indexBy="label"
            keys={ keys }
            margin={ { top: 10, right: 20, bottom: 30, left: this.props.marginLeft } }
            layout="horizontal"
            groupMode={ this.props.allGeoids.length > 1 ? "grouped" : "stacked" }
            enableLabel={ true }
            labelFormat={ d => fmt(Math.abs(d)) }
            labelSkipWidth={ 100 }
            labelSkipHeight={ 12 }
            axisBottom={ {
              format: d => fmt(Math.abs(d))
            } }
            tooltip={ ({ color, indexValue, value, id, ...rest }) => (
                <Tooltip
                  value={ fmt(Math.abs(value)) }
                  color={ color }
                  geoid={ id.split("-")[1] }
                  label={ `${ indexValue }` }/>
              )
            }/>
        </div>
        <div style={ { height: "30px", display: "flex" } }>
          <div style={ { width: "60%", fontSize: "15px", display: "flex", justifyContent: "center", alignItems: "center" } }>
            { this.props.left.key }
            <div style={ { width: "20px", height: "20px", margin: "0px 2.5px 0px 5px", background: getColors("left") } }/>
            <div style={ { width: "20px", height: "20px", margin: "0px 5px 0px 2.5px", background: getColors("right") } }/>
            { this.props.right.key }
          </div>
          <div style={ { width: "40%", fontSize: "15px", paddingRight: "20px", display: "flex", alignItems: "center", justifyContent: "flex-end" } }>
            <span style={ { marginRight: "10px" } }>Year: { this.state.year }</span>
            <input type="range"
              min={ this.props.years[0] }
              max={ this.props.years[this.props.years.length - 1] }
              value={ this.state.year }
              onChange={ e => this.setState({ year: e.target.value }) }
              step="1"/>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  acsGraph: get(state, ["graph", "acs"], {}),
  geoGraph: get(state, ["graph", "geo"], {}),
  allGeoids: [...props.geoids, props.compareGeoid].filter(geoid => Boolean(geoid))
})

export default connect(mapStateToProps, null)(reduxFalcor(HorizontalBarChart));
