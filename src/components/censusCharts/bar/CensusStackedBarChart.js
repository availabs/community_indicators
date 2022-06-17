import React from "react"

import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";

import ChartBase, { LoadingIndicator, NoData } from "../ChartBase"

import { ResponsiveBar } from '@nivo/bar'
import { getColorRange } from 'constants/color-ranges'

import Options from '../Options'
import ComponentTitle from "../ComponentTitle"

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

const Tooltip = ({ color, value, id, data }) =>
  <TooltipContainer>
    <div style={ {
      width: "15px", height: "15px",
      background: color,
      marginRight: "5px"
    } }/>
    <div style={ { marginRight: "5px", fontWeight: "bold" } }>
      { data.keyMap[id] }
    </div>
    <div>{ value }</div>
  </TooltipContainer>

class CensusStackedBarChart extends ChartBase {
  static defaultProps = {
    year: 2017,
    years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
    yFormat: ",d",
    marginLeft: 75,
    marginRight: 300,
    marginTop: 10,
    orientation: 'vertical',
    animation: false,
    groupMode: "grouped",
    groupBy: "censusKeys",
    censusKeys: [],
    subtractKeys: [],
    divisorKeys: [],
    censusKeysMoE: [],
    subtractKeysMoE: [],
    divisorKeysMoE: [],
    censusKeyLabels: {},
    showOptions: true,
    sorted: false,
    showLegend: true,
    description: []
  }

  container = React.createRef();

  getFalcorDeps() {
    return this.props.falcor.get(
        ['acs', this.props.allGeoids, this.props.years,
          [...this.props.censusKeys, ...this.props.divisorKeys,
            ...this.props.censusKeysMoE, ...this.props.divisorKeysMoE
          ]
        ],
        ["geo", this.props.allGeoids, "name"],
        ["acs", "meta", [...this.props.censusKeys, ...this.props.divisorKeys], "label"]
    )
  }

  processDataForViewing() {
    const { barData, keys } = this.props.barData;
    const fmt = format(this.props.yFormat),
      getKeyName = key => key in this.props.censusKeyLabels ?
        this.props.censusKeyLabels[key] :
        getCensusKeyLabel(key, this.props.acsGraph, this.props.removeLeading);

    const [geoid] = this.props.geoids,
      name = get(this.props.geoGraph, [geoid, "name"], geoid);

    const data = barData.reduce((a, c) => {
      keys.forEach(k => {
        if (c[k]) {
          a.push({
            geoid, name,
            year: this.props.year,
            "census key": c.ckMap[k],
            "census label": c.keyMap[k],
            value: c[k]
          })
        }
      })
      return a;
    }, [])

    return { data, keys: ["geoid", "name", "year", "census key", "census label", "value"] };
  }

  render() {
    // const colors = scaleOrdinal()
    //   // .domain(this.props.groupBy === "censusKeys" ? this.props.allGeoids : this.props.divisorKeys.length ? ["value"] : this.props.censusKeys)
    //   .domain(this.props.allGeoids)
    //   .range(DEFAULT_COLORS);

    const { barData, keys } = this.props.barData;

    const fmt = format(this.props.yFormat);

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

    return !this.state.loading && !barData.length ?
      <NoData { ...this.state }/> : (
      <div style={ { width: "100%", height: "100%", position: "relative" } }
        id={ this.props.id }
        ref={ this.container }>

        <LoadingIndicator { ...this.state }/>

        <div style={ { height: "30px" } }>
          <div style={ { maxWidth: this.props.showOptions ? "calc(100% - 285px)" : "100%" } }>
            <ComponentTitle { ...this.props } multi/>
          </div>
          { !this.props.showOptions ? null :
            <Options tableTitle={ this.props.title }
              processDataForViewing={ this.processDataForViewing.bind(this) }
              id={ this.props.id }
              layout={ { ...this.props.layout } }
              width={ this.container.current && this.container.current.clientWidth }
              height={ this.container.current && this.container.current.clientHeight }
              embedProps={ {
                id: this.props.id,
                year: this.props.year,
                geoids: [...this.props.geoids],
                compareGeoid: this.props.compareGeoid
              } }/>
          }
        </div>

        <div style={ { height: `calc(100% - 30px)`, position: "relative" } }>
          <ResponsiveBar indexBy="index"
            data={ barData } keys={ keys }
            margin={ {
              right: this.props.marginRight,
              top: this.props.marginTop,
              bottom: 30,
              left: this.props.marginLeft } }
            colors={ d => get(d, ["data", "colorMap", d.id], "#000") }
            // colors={ d => this.props.groupBy === "censusKeys" ? colors(d.id) : colors(d.data.geoid) }
            labelSkipWidth={ 75 }
            labelSkipHeight={ 12 }
            labelFormat={ fmt }
            groupMode="stacked"
            layers={ [
              // showDescription ? DescriptionFactory(this.props.description) : null,
              LegendFactory(this.props.stackByYear),
              'grid', 'axes', 'bars', 'markers', 'annotations'
            ].filter(Boolean) }
            layout={ this.props.orientation }
            tooltip={ ({ color, value, id, data }) => (//console.log("REST:", rest),
                <Tooltip data={ data }
                  id={ id }
                  value={ fmt(value) }
                  color={ color }/>
              )
            }
            axisLeft={ {
              format: this.props.orientation === 'horizontal' ? getKeyName : fmt
            } }
            axisBottom={ {
              format: this.props.orientation === "horizontal" ? fmt : getKeyName
            } }/>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  barData: getBarData(state, props),
  acsGraph: get(state, ["graph", "acs"], {}),
  geoGraph: get(state, ["graph", "geo"], {}),
  allGeoids: [...props.geoids, props.compareGeoid].filter(Boolean)
})

export default connect(mapStateToProps, null)(reduxFalcor(CensusStackedBarChart));

const getBarData = (state, props) => {

  const [geoid] = props.geoids;

  let barData = [], keys = [];

  if (props.stackByYear && props.stacks) {
    const years = props.years;

    keys = props.stacks.map((s, i) => `key-${ i }`);

    barData = years.map(year => {
      const bar = {
        index: String(year),
        keyMap: {},
        ckMap: {},
        colorMap: {}
      }
      return props.stacks.reduce((a, c, i) => {
        const value = +get(state, ["graph", "acs", geoid, year, c.censusKey], -666666666);

        if (value !== -666666666) {
          const key = `key-${ i }`;
          a[key] = value;
          a.keyMap[key] = c.title;
          a.ckMap[key] = c.censusKey;
          a.colorMap[key] = c.color || DEFAULT_COLORS[i]
        }
        return a;
      }, bar)
    })
  }
  else {
    const year = get(props, "year", 2017);

    let numKeys = 0;

    barData = get(props, "bars", [])
      .map(bar => {
        numKeys = Math.max(numKeys, bar.stacks.length);

        const data = {
          index: bar.title,
          keyMap: {},
          ckMap: {},
          colorMap: {}
        }
        return bar.stacks.reduce((a, c, i) => {
          const value = +get(state, ["graph", "acs", geoid, year, c.censusKey], -666666666);

          if (value !== -666666666) {
            const key = `key-${ i }`;
            a[key] = value;
            a.keyMap[key] = c.title;
            a.ckMap[key] = c.censusKey;
            a.colorMap[key] = c.color || bar.color || DEFAULT_COLORS[i]
          }
          return a;
        }, data);
      });

    for (let n = 0; n < numKeys; ++n) {
      keys.push(`key-${ n }`);
    }

    barData.sort((a, b) => {
      const [aTotal, bTotal] = keys.reduce((aa, c) => {
        return [
          aa[0] + get(a, c, 0),
          aa[1] + get(b, c, 0)
        ]
      }, [0, 0]);
      return aTotal - bTotal;
    })

  }

  return { barData, keys };
}

const LegendFactory = stackByYear =>
  graph => {
    const data = stackByYear ? graph.data.slice(0, 1) : graph.data.slice().reverse();
    const keys = stackByYear ? graph.keys.slice().reverse() : graph.keys;
    return (
      <g style={ { transform: `translate(${ graph.width }px, -${ graph.margin.top }px)` } }>
        {
          data.reduce((a, c, i) => {
            const items = keys.reduce((aa, cc, ii) => {
              if (c[cc]) {
                aa.push(
                  <g key={ ii }
                    style={ {
                      transform: `translate(10px, ${ (a.length + ii) * 19 + 10 }px)`
                    } }>
                    <rect width="15" height="15" fill={ c.colorMap[cc] }/>
                    <text x="19" y="13" fontFamily="sans-serif" fontSize="12px">
                      { c.keyMap[cc].length > 40 ?
                        c.keyMap[cc].slice(0, 40).trim() + "..." :
                        c.keyMap[cc]
                      }
                    </text>
                  </g>
                )
              }
              return aa;
            }, [])
            a.push(...items);
            return a;
          }, [])
        }
      </g>
    )
  }
