import React from 'react';

import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";

import { Link } from "react-router-dom"

import { ResponsiveBar } from '@nivo/bar'

import get from "lodash.get"
import styled from "styled-components"
import { format } from "d3-format"

import Options from '../Options'
import Title from "../ComponentTitle"

import Geoname from "../geoname"

import ChartBase, { LoadingIndicator, NoData } from "../ChartBase"

import { fnum } from "utils/sheldusUtils"

import QCEWTitle from "./QCEWTitle"

const YearDiv = styled.div`
  position: absolute;
  text-align: left;
  bottom: 10px;
  left: 20px;
`

const ValueContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > div {
    justify-content: center;
  }
  > div:last-child {
    justify-content: flex-start;
  }
`

const NAICS = [
  '11','22','23','31-33',
  '42','44-45','48-49',
  '51','52','53','54','55','56',
  '61','62','71','72','81'
]

class QCEWStatBox extends ChartBase {

  static defaultProps = {
    geoids: [],
    compareGeoid: null,
    years: [2014, 2015, 2016, 2017, 2018, 2019],
    year: '2018',
    compareYear: null,
    dataType: "annual_avg_emplvl",
    format: ",d",
    maximumFractionDigits: 0,
    yearPosition: "bottom-left",
    increaseColor: "#090",
    decreaseColor: "#900",
    invertColors: false,
    showColors: true,
    colorThresholdPercent: 1
  }

  getGeoName = geoid => get(this.props.geoGraph, [geoid, "name"], geoid);
  getNaicsTitle = (naics, trim = false) => {
    const title = get(this.naicsMap, [naics, "title"], naics);
    if (!trim) return title;

    const max = 40;
    return title.length > max ? title.slice(0, max).trim() + "..." : title;
  }
  getValue = (geoid, year, code) =>
    +get(this.props, ["qcewGraph", "annual", geoid, year, code, this.props.dataType], 0);

  componentDidMount() {
    super.componentDidMount();
    fetch("https://raw.githubusercontent.com/availabs/kauffman-atlas/master/src/static/data/naicsKeys.json")
      .then(res => res.json())
      .then(res => { this.naicsMap = res; });
  }
  getFalcorDeps() {
    return this.props.falcor.get(
      ["qcew", "annual", this.props.geoids, this.props.years, NAICS, this.props.dataType],
      ['geo', this.props.geoids, 'name']
    )
  }

  calculateValues(geoids) {
    let value = geoids.reduce((a, c) => {
      return a + NAICS.reduce((aa, cc) => {
        return aa + this.getValue(c, this.props.year, cc)
      }, 0);
    }, 0);

    value /= geoids.length;

    if (!value) {
      return { value: '', change: '' };
    }

    let change = 0;

    if (this.props.compareYear) {
      let compareValue = geoids.reduce((a, c) => {
        return a + NAICS.reduce((aa, cc) => {
          return aa + this.getValue(c, this.props.compareYear, cc)
        }, 0);
      }, 0);
      change = (((value - compareValue) / compareValue) * 100);
      change = isNaN(change) ? 0 : +change.toFixed(2);
    }

    return { value, change };
  }

  renderStuff(geoids, compareStuff = false) {
    const { value, change } = this.calculateValues(geoids);

    let growthColors = [this.props.increaseColor, this.props.decreaseColor];
    this.props.invertColors && growthColors.reverse();
    if (!this.props.showColors) {
      growthColors = ["currentColor", "currentColor"];
    }
    else if (change && (Math.abs(change) < this.props.colorThresholdPercent)) {
      growthColors = ["currentColor", "currentColor"];
    }

    const growthColor = change ? growthColors[change > 0 ? 0 : 1] : "currentColor";

    const fmt = this.props.format === "fnum" ? fnum : format(this.props.format);

    return compareStuff && !value ? null : (
      <div style={ {
        color: growthColor,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      } }>

        <div style={ {
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        } }>
          { this.props.compareGeoid &&
            <div style={ { marginRight: "10px" } }>
              <Geoname geoids={ geoids }/>
            </div>
          }
          <div className='value'
            style={ {
              display: 'block',
              fontSize: !value ? "1rem" : this.props.compareGeoid ? "2rem" : "2.5rem",
              textAlign: "center"
            } }>
            { value && this.props.valuePrefix }
            { value ? fmt(value) : "Data is not available at this geography." }
            { value && this.props.valueSuffix }
          </div>
        </div>

        { this.props.compareYear && change ?
          <div style={ { textAlign: 'center', marginTop: "-10px" } }>
            { Math.abs(change) }% { change >= 0 ? 'Growth' : 'Decline' }
          </div> : null
         }
      </div>
    )
  }

  render() {
    return this.state.loading ? <LoadingIndicator /> : (
      <div style={ { height: "100%", position: "relative" } }>
        <div className='el-tablo'
          style={ {
            padding: "10px",
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          } }>
          <QCEWTitle center
            title={ this.props.title }
            source={ this.props.source }/>
          <ValueContainer>
            { this.renderStuff(this.props.geoids) }
            {
              !this.props.compareGeoid ? null :
              this.renderStuff([this.props.compareGeoid], true)
            }
          </ValueContainer>
        </div>
        { this.props.compareYear && (this.props.yearPosition !== "none") ?
          <YearDiv position={ this.props.yearPosition }>
             <b>{ this.props.year }</b> vs <b>{ this.props.compareYear }</b>
          </YearDiv> : null
        }
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  // data: getQCEWData(state, props),
  qcewGraph: get(state, ["graph", "qcew"], {}),
  years: props.years.filter(y => +y >= 2014),
  geoGraph: get(state, ["graph", "geo"], {}),
  allGeoids: [...props.geoids, props.compareGeoid].filter(Boolean)
})

export default connect(mapStateToProps)(reduxFalcor(QCEWStatBox));
