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
    year: 2017,
    years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
    yFormat: ",d",
    axisBottom: true,
    marginLeft: 75,
    marginRight: 20,
    orientation: 'vertical',
    animation: false,
    groupMode: "grouped",
    groupBy: "censusKeys",
    divisorKeys: [],
    censusKeyLabels: {},
    showOptions: true,
    sorted: false
  }
  fetchFalcorDeps() {
    return this.props.falcor.get(
        ['acs', this.props.allGeoids, this.props.years,
          [...this.props.censusKeys, ...this.props.divisorKeys]
        ],
        ["geo", this.props.allGeoids, "name"],
        ["acs", "meta", [...this.props.censusKeys, ...this.props.divisorKeys], "label"]
    )
    .then(res => {
if (this.props.title === "Language Spoken at Home by Ability to Speak English") {
  console.log("RES:", res)
}
    })
  }
  processDataForViewing() {
  const fmt = format(this.props.yFormat),
    getKeyName = key => key in this.props.censusKeyLabels ?
      this.props.censusKeyLabels[key] :
      getCensusKeyLabel(key, this.props.acsGraph, this.props.removeLeading);

    if (this.props.divisorKeys.length && this.props.groupBy === "geoids") {
      const data = [],
        keys = ["geoid", "name", "year"];

      this.props.censusKeys.forEach((k, i) => {
        keys.push(`census key ${ i + 1 }`, `census label ${ i + 1 }`);
      })

      keys.push("sum")

      this.props.divisorKeys.forEach((k, i) => {
        keys.push(`divisor key ${ i + 1 }`, `divisor label ${ i + 1 }`);
      })

      keys.push("divisor", "value");

      for (const geoid of this.props.allGeoids) {
        const row = { geoid };
        row.name = get(this.props.geoGraph, [geoid, "name"], geoid);
        row.year = get(this.props, "year", 2017);

        this.props.censusKeys.forEach((k, i) => {
          row[`census key ${ i + 1 }`] = k;
          row[`census label ${ i + 1 }`] = getKeyName(k);
        })
        row["sum"] = this.props.censusKeys.reduce((a, c) => {
          const value = get(this.props.acsGraph, [geoid, row.year, c], -666666666)
          if (value !== -666666666) {
            a += value;
          }
          return a;
        }, 0)

        this.props.divisorKeys.forEach((k, i) => {
          row[`divisor key ${ i + 1 }`] = k;
          row[`divisor label ${ i + 1 }`] = getKeyName(k);
        })
        row["divisor"] = this.props.divisorKeys.reduce((a, c) => {
          const value = get(this.props.acsGraph, [geoid, row.year, c], -666666666)
          if (value !== -666666666) {
            a += value;
          }
          return a;
        }, 0)

        row["value"] = row["sum"] / (row["divisor"] === 0 ? 1 : row["divisor"]);

        data.push(row);
      }
      return { data, keys };
    }
    const data = [],
      keys = ["geoid", "name", "year", "census key", "census label", "value"]

    for (const key of this.props.censusKeys) {
      for (const geoid of this.props.allGeoids) {
        const row = { geoid }
        row.name = get(this.props.geoGraph, [geoid, "name"], geoid);
        row.year = get(this.props, "year", 2017);
        row["census key"] = key;
        row["census label"] = getKeyName(key);
        row.value = (get(this.props.acsGraph, [geoid, row.year, key], -666666666));

        data.push(row);
      }
    }

    return { data, keys };
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
        this.props.divisorKeys.length ? "Value" :
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

    const getLabel = key => this.props.groupBy === "censusKeys" ?
      (
        key in this.props.censusKeyLabels ?
        this.props.censusKeyLabels[key] :
        getCensusKeyLabel(key, this.props.acsGraph, this.props.removeLeading)
      )
      // : this.props.divisorKeys.length ? "Value"
      : get(this.props.geoGraph, [key, "name"], key);

    return (
      <div style={ { width: "100%", height: "100%" } } id={ this.props.id }>
        <div style={ { height: "30px" } }>
          <div style={ { maxWidth: this.props.showOptions ? "calc(100% - 285px)" : "100%" } }>
            <Title title={ this.props.title }/>
          </div>
          { !this.props.showOptions ? null :
            <Options tableTitle={ this.props.title }
              processDataForViewing={ this.processDataForViewing.bind(this) }
              id={ this.props.id }
              layout={ { ...this.props.layout } }
              embedProps={ {
                type: this.props.type,
                year: this.props.year,
                geoids: [...this.props.geoids],
                compareGeoid: this.props.compareGeoid,
                censusKeys: [...this.props.censusKeys],
                divisorKeys: [...this.props.divisorKeys],
                groupBy: this.props.groupBy,
                groupMode: this.props.groupMode,
                title: this.props.title,
                marginRight: this.props.marginRight,
                marginLeft: this.props.marginLeft,
                axisBottom: this.props.axisBottom,
                orientation: this.props.orientation,
                yFormat: this.props.yFormat,
                sorted: this.props.sorted
              } }/>
          }
        </div>
        <div style={ { height: "calc(100% - 30px)"} }>
          <ResponsiveBar indexBy={ "id" }
            keys={ this.props.groupBy === "censusKeys" ? this.props.allGeoids : this.props.divisorKeys.length ? ["value"] : this.props.censusKeys }
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
                  label={ getLabel(indexValue) }/>
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
          const year = get(props, "year", 2017),
            value = +get(state, ["graph", "acs", cc, year, c], -666666666);
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
      const divisorKeys = get(props, "divisorKeys", []);
      if (divisorKeys.length) {
        const value = props.censusKeys.reduce((aa, cc, ii) => {
          const year = get(props, "year", 2017),
            value = +get(state, ["graph", "acs", c, year, cc], 0);
          if (value !== -666666666) {
            aa += value;
          }
          return aa;
        }, 0)
        const divisor = props.divisorKeys.reduce((aa, cc, ii) => {
          const year = get(props, "year", 2017),
            value = +get(state, ["graph", "acs", c, year, cc], 0);
          if (value !== -666666666) {
            aa += value;
          }
          return aa;
        }, 0)
        a.push({
          id: c,
          value: divisor === 0 ? value : value / divisor,
          num: 1
        })
      }
      else {
        a.push(
          props.censusKeys.reduce((aa, cc, ii) => {
            const year = get(props, "year", 2017),
              value = +get(state, ["graph", "acs", c, year, cc], 0);
            if (value !== -666666666) {
              aa[cc] = value;
              ++aa.num;
            }
            return aa;
          }, { id: c, num: 0 })
        )
      }
      return a;
    }, [])
    .filter(d => d.num > 0);

export default connect(mapStateToProps, null)(reduxFalcor(CensusBarChart));
