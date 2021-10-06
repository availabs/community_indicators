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

import ChartBase, { LoadingIndicator, NoData } from "../ChartBase"

import { fnum } from "utils/sheldusUtils"

import { getColorRange } from 'constants/color-ranges'

import QCEWTitle from "./QCEWTitle"

const r1 = getColorRange(9, "Set1"),
  r2 = getColorRange(9, "Set3");

const DEFAULT_COLORS = []

for (let i = 0; i < 9; ++i) {
  DEFAULT_COLORS.push(r1[i], r2[i]);
}

const NAICS = [
  '11','22','23','31-33',
  '42','44-45','48-49',
  '51','52','53','54','55','56',
  '61','62','71','72','81'
]

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

class QCEWStackedBarChart extends ChartBase {
  static defaultProps = {
    geoids: [],
    year: 2019,
    years: [2014, 2015, 2016, 2017, 2018, 2019],
    dataType: "annual_avg_emplvl",
    yFormat: ",d",
    marginLeft: 75,
    marginRight: 300,
    marginTop: 10,
    showAllYears: false,
    showOptions: true,
    title: ""
  }

  container = React.createRef();

  getGeoName = geoid => get(this.props.geoGraph, [geoid, "name"], geoid);
  getNaicsTitle = (naics, trim = false) => {
    const title = get(this.naicsMap, [naics, "title"], naics);
    if (!trim) return title;

    const max = 40;
    return title.length > max ? title.slice(0, max).trim() + "..." : title;
  }
  getValue = (geoid, year, code) => get(this.props, ["qcewGraph", "annual", geoid, year, code, this.props.dataType], 0)

  componentDidMount() {
    super.componentDidMount();
    fetch("https://raw.githubusercontent.com/availabs/kauffman-atlas/master/src/static/data/naicsKeys.json")
      .then(res => res.json())
      .then(res => { this.naicsMap = res; });
  }
  getFalcorDeps() {
    const years = this.props.showAllYears ? this.props.years : this.props.year;
    return this.props.falcor.get(
      ["qcew", "annual", this.props.geoids, years, NAICS, this.props.dataType],
      ['geo', this.props.geoids, 'name']
    )
  }
  processDataForViewing() {
    const years = this.props.showAllYears ? this.props.years : [this.props.year];

    const data = [];
    years.forEach(year => {
      NAICS.forEach(code => {
        this.props.geoids.forEach(geoid => {
          data.push({
            geoid,
            name: this.getGeoName(geoid),
            year,
            "naics code": code,
            "naics label": this.getNaicsTitle(code),
            "data type": this.props.dataType,
            value: this.getValue(geoid, year, code)
          })
        })
      })
    })
    return { data, keys: ["geoid", "name", "year", "naics code", "naics label", "data type", "value"] };
  }
  render() {

    const fmt = this.props.yFormat === "fnum" ? fnum : format(this.props.yFormat);

    return !this.state.loading && !this.props.data.length ? <NoData { ...this.state }/> : (
      <div style={ { width: "100%", height: "100%", position: "relative" } }
        id={ this.props.id }
        ref={ this.container }>

        <LoadingIndicator { ...this.state }/>

        <div style={ { height: "30px" } }>
          <div style={ { maxWidth: this.props.showOptions ? "calc(100% - 285px)" : "100%" } }>
            <QCEWTitle title={ this.props.title }
              source={ this.props.source }/>
          </div>
          { !this.props.showOptions ? null :
            <Options tableTitle={ this.props.title }
              processDataForViewing={ this.processDataForViewing.bind(this) }
              width={ this.container.current && this.container.current.clientWidth }
              height={ this.container.current && this.container.current.clientHeight }
              id={ this.props.id }
              layout={ { ...this.props.layout } }
              embedProps={ {
                id: this.props.id,
                geoids: [...this.props.geoids],
                // compareGeoid: this.props.compareGeoid,
                // showCompareGeoid: this.props.showCompareGeoid,
                year: this.props.year
              } }/>
          }
        </div>
        <div style={ { height: "calc(100% - 30px)", position: "relative" } } id={ this.props.id }>

          <ResponsiveBar data={ this.props.data }
            indexBy="key"
            keys={ NAICS }
            colors={ DEFAULT_COLORS }
            margin={ {
              right: this.props.marginRight,
              top: this.props.marginTop,
              bottom: 30,
              left: this.props.marginLeft
            } }
            layers={ [
              LegendFactory(this.getNaicsTitle),
              'grid', 'axes', 'bars', 'markers', 'annotations'
            ] }
            labelSkipWidth={ 75 }
            labelSkipHeight={ 12 }
            labelFormat={ fmt }
            tooltip={
              ({ color, indexValue, value, id }) => (
                <Tooltip id={ this.getNaicsTitle(id) }
                  value={ fmt(value) }
                  color={ color }
                  label={ this.getGeoName(indexValue) }/>
              )
            }
            axisLeft={ {
              format: fmt
            } }
            axisBottom={ {
              format: this.getGeoName
            } }/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  data: getQCEWData(state, props),
  years: props.years.filter(y => +y >= 2014),
  qcewGraph: get(state, ["graph", "qcew"], {}),
  geoGraph: get(state, ["graph", "geo"], {}),
  allGeoids: [...props.geoids, props.compareGeoid].filter(Boolean)
})

export default connect(mapStateToProps)(reduxFalcor(QCEWStackedBarChart));

const getQCEWData = (state, props) => {
  if (props.showAllYears) {
    const { dataType, geoids: [geoid] } = props;
    return props.years.filter(y => +y >= 2014)
      .map(year => {
        return NAICS.reduce((a, c) => {
          a[c] = get(state, ["graph", "qcew", "annual", geoid, year, c, dataType], 0)
          return a;
        }, { key: String(year) });
      });
  }
  const { year, dataType } = props;
  return props.geoids.map(geoid => {
    return NAICS.reduce((a, c) => {
      a[c] = get(state, ["graph", "qcew", "annual", geoid, year, c, dataType], 0)
      return a;
    }, { key: geoid });
  });
}

const LegendFactory = getNaicsTitle =>
  graph => {
    return (
      <g style={ { transform: `translate(${ graph.width }px, -${ graph.margin.top }px)` } }>
        {
          NAICS.slice().reverse().map((k, i) =>
            <g style={ { transform: `translate(10px, ${ i * 19 + 10 }px)` } } key={ k }>
              <rect width="15" height="15" fill={ DEFAULT_COLORS[NAICS.length - 1 - i] }/>
              <text x="19" y="13" fontFamily="sans-serif" fontSize="0.75rem">
                { getNaicsTitle(k, true) }
              </text>
            </g>
          )
        }
      </g>
    )
  }
