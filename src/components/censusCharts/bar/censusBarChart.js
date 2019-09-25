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
import CensusLabel, { getCensusKeyLabel } from 'components/censusCharts/CensusLabel'

const DEFAULT_COLORS = getColorRange(8, "Set2")

const TooltipContainer = styled.div`
  display: flex;
  > div {
    margin-right: 5px;
  }
  > div:last-child {
    margin-right: 0px;
  }
`

const Tooltip = ({ color, value, label, id, removeLeading }) =>
  <TooltipContainer>
    <div style={ { width: "15px", height: "15px", background: color, marginRight: "5px" } }/>
    <div>{ id }</div>
    <div style={ { marginRight: "5px", fontWeight: "bold" } }>
      { label }
    </div>
    <div>{ value }</div>
  </TooltipContainer>

class CensusBarChart extends React.Component {
  static defaultProps = {
    years: [2015],
    yFormat: ",d",
    axisBottom: true,
    marginLeft: 75,
    marginRight: 20,
    orientation: 'vertical',
    animation: false,
    groupMode: "grouped",
    groupBy: "censusKeys",
    censusKeyLabels: {}
  }
  fetchFalcorDeps() {
    return this.props.falcor.get(
        ['acs', this.props.allGeoids, this.props.years, this.props.censusKeys],
        ["geo", this.props.allGeoids, "name"]
    )
  }
  render() {
    const colors = scaleOrdinal()
      .domain(this.props.geoids)
      .range(DEFAULT_COLORS);
    const fmt = format(this.props.yFormat);
    // console.log('data', this.props.barData)
    if (this.props.sorted) {
      this.props.barData.sort((a ,b) => a[this.props.geoids[0]] - b[this.props.geoids[0]]);
    }

    const getIdName = key => this.props.groupBy === "geoids" ?
      (
        key in this.props.censusKeyLabels ?
        this.props.censusKeyLabels[key] :
        getCensusKeyLabel(key, this.props.acsGraph, this.props.removeLeading)
      )
      : get(this.props.geoGraph, [key, "name"], key);

    const getKeyName = key => this.props.groupBy === "censusKeys" ?
      (
        key in this.props.censusKeyLabels ?
        this.props.censusKeyLabels[key] :
        getCensusKeyLabel(key, this.props.acsGraph, this.props.removeLeading)
      )
      : get(this.props.geoGraph, [key, "name"], key);

    return (
      <div style={ { width: "100%", height: "100%" } }>
        <div style={ { height: "30px" } }>
          <div style={ { maxWidth: "calc(100% - 285px)" } }><Title title={ this.props.title }/></div>
          <Options />
        </div>
        <div style={ { height: "calc(100% - 30px)"} }>
          <ResponsiveBar indexBy={ "id" }
            keys={ this.props.groupBy === "censusKeys" ? this.props.allGeoids : this.props.censusKeys }
            data={ this.props.barData }
            margin={ {
              right: this.props.marginRight,
              top: 10,
              bottom: this.props.axisBottom ? 30 : 20,
              left: this.props.marginLeft } }
            colors={ d => colors(d.id) }
            labelSkipWidth={ 100 }
            labelSkipHeight={ 12 }
            labelFormat={ fmt }
            groupMode={ this.props.groupMode }
            layout={this.props.orientation}
            tooltip={ ({ color, indexValue, value, id, ...rest }) => (//console.log("REST:", rest),
                <Tooltip id={ getIdName(id) }
                  value={ fmt(value) }
                  color={ color }
                  label={ getKeyName(indexValue) }/>
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
  acsGraph: get(state, ["graph", "acs"], {}),
  geoGraph: get(state, ["graph", "geo"], {}),
  allGeoids: [...props.geoids, props.compareGeoid].filter(geoid => Boolean(geoid))
})

const getBarData = (state, props) => {
  if (get(props, "groupBy", "censusKeys") === "censusKeys") {
    return groupByCensusKeys(state, props);
  }
  return groupByGeoids(state, props);
}
const groupByCensusKeys = (state, props) =>
  props.censusKeys.reduce((a, c) => {
    a.push(
      [...props.geoids, props.compareGeoid].filter(geoid => Boolean(geoid))
        .reduce((aa, cc, ii) => {
          const year = get(props, "years[0]", 2015),
            value = +get(state, ["graph", "acs", cc, year, c], 0);
          if (value !== -666666666) {
            aa[cc] = value;
            ++aa.num;
          }
          return aa;
        }, { id: c, num: 0 })
    );
    return a;
  }, [])
  .filter(d => d.num > 0);
const groupByGeoids = (state, props) =>
  [...props.geoids, props.compareGeoid].filter(geoid => Boolean(geoid))
    .reduce((a, c) => {
      a.push(
        props.censusKeys.reduce((aa, cc, ii) => {
          const year = get(props, "years[0]", 2015),
            value = +get(state, ["graph", "acs", c, year, cc], 0);
          if (value !== -666666666) {
            aa[cc] = value;
            ++aa.num;
          }
          return aa;
        }, { id: c, num: 0 })
      )
      return a;
    }, [])
    .filter(d => d.num > 0);

export default connect(mapStateToProps, null)(reduxFalcor(CensusBarChart));
