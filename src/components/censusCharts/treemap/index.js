import React from "react"
import { connect } from "react-redux"
import { reduxFalcor} from "utils/redux-falcor";

import { ResponsiveTreeMap } from '@nivo/treemap'

import * as d3scale from "d3-scale"
import * as d3format from "d3-format"
import * as d3selection from "d3-selection"
import * as d3shape from "d3-shape"

import get from "lodash.get"
import styled from "styled-components"

import Options from '../Options'
import Title from "../ComponentTitle"

import GeoName from 'components/censusCharts/geoname'
import CensusLabel, { getCensusKeyLabel } from 'components/censusCharts/CensusLabel'

import ChartBase, { LoadingIndicator, NoData } from "../ChartBase"

import { getColorRange } from 'constants/color-ranges'
const DEFAULT_COLORS = getColorRange(12, "Set3")

const d3 = {
  ...d3scale,
  ...d3format,
  ...d3selection,
  ...d3shape
}

const DEFAULT_MARGIN = 10;

class CensusTreemap extends ChartBase {
  static defaultProps = {
    year: 2017,
    years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020],
    margin: DEFAULT_MARGIN,
    format: ",d",
    description: [],
    showOptions: true
  }

  container = React.createRef();
  grid = React.createRef();
  header = React.createRef();

  getFalcorDeps() {
    return this.props.falcor.get(
      ['acs', this.props.allGeoids, this.props.years,
        [...this.props.censusKeys,
          ...this.props.censusKeysMoE]
      ],
      ["geo", this.props.allGeoids, "year", this.props.year, "name"],
      ["acs", "meta", this.props.censusKeys, "label"]
    )
  }
  processDataForViewing() {
    const getKeyLabel = key =>
      key in this.props.censusKeyLabels ? this.props.censusKeyLabels[key] :
      getCensusKeyLabel(key, this.props.acsGraph, this.props.removeLeading);

    const year = this.props.year;

    return {
      data: this.props.allGeoids.reduce((a, geoid) => {
        this.props.censusKeys.forEach(ck => {
          const regex = /^(.+)E$/,
            M = ck.replace(regex, (m, p1) => p1 + "M"),
            moe = +get(this.props, ["acsGraph", geoid, year, M], "unknown");

          a.push({
            geoid,
            name: get(this.props.geoGraph, [geoid, "year", year, "name"], geoid),
            year,
            "census key": ck,
            "census label": getKeyLabel(ck),
            value: get(this.props, ["acsGraph", geoid, year, ck], -666666666),
            moe
          })
        })
        return a;
      }, []),
      keys: ["geoid", "name", "year", "census key", "census label", "value", "moe"]
    }
  }
  render() {
    const treeData = this.props.treeData,
      num = treeData.length,
      headerHeight = get(this.header, ["current", "clientHeight"], 0),
      gridHeight = get(this.grid, ["current", "clientHeight"], 0) - 5;

// console.log("DATA:", treeData, num)

    return !this.state.loading && !this.props.treeData ? <NoData { ...this.state }/> : (
      <div style={ { width: "100%", height: "100%", position: "relative" } }
        id={ this.props.id }
        ref={ this.container }>

        <LoadingIndicator { ...this.state }/>

        <div style={ { height: "30px", maxWidth: "calc(100% - 285px)" } }>
          <Title { ...this.props } multi/>
          { !this.props.showOptions ? null :
            <Options tableTitle={ this.props.title }
              processDataForViewing={ this.processDataForViewing.bind(this) }
              width={ this.container.current && this.container.current.clientWidth }
              height={ this.container.current && this.container.current.clientHeight }
              id={ this.props.id }
              layout={ { ...this.props.layout } }
              embedProps={ {
                id: this.props.id,
                year: this.props.year,
                geoids: [...this.props.geoids],
                compareGeoid: this.props.compareGeoid
              } }/>
          }
        </div>
        <div ref={ this.grid }
          style={ {
            display: "grid",
            height: "calc(100% - 30px)",
            gridTemplateColumns: treeData.map(d => `calc(${ 100 / num }% - ${ (4 * (num - 1)) / num }px)`).join(" "),
            gridColumnGap: "4px",
            marginTop: `5px`
          } }>
          { treeData.map(({ geoid, data }, i) => (
              <div key={ geoid } style={ { height: `${ gridHeight }px` } }>
                { num < 2 ? null :
                  <div ref={ i === 0 ? this.header : null }
                    style={ { textAlign: "center" } }>
                    <GeoName geoids={ [geoid] }/>
                  </div>
                }
                <div style={ {
                  height: `${ gridHeight - headerHeight }px`,
                  padding: "0px 7px 7px 7px"
                } }>
                  <ResponsiveTreeMap root={ data }
                    margin={ { top: 2, right: 2, bottom: 2, left: 2 } }
                    identity="title"
                    value="value"
                    colors={ ({ color }) => color }
                    labelTextColor="currentColor"
                    borderColor="currentColor"
                    borderWidth={ 4 }/>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  treeData: getTreeData(state, props),
  censusKeyLabels: getCensusKeyLabels(state, props),
  acsGraph: get(state, ["graph", "acs"], {}),
  geoGraph: get(state, ["graph", "geo"], {}),
  allGeoids: [...props.geoids, props.compareGeoid].filter(Boolean)
})
const mapDispatchToProps = {

}
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CensusTreemap));

const getCensusKeyLabels = (state, props) => {
  const walkTree = (node, labels) => {
    if (node.children) {
      node.children.forEach(node => {
        walkTree(node, labels);
      })
    }
    else {
      labels[node.censusKey] = node.title;
    }
    return labels;
  }
  return walkTree(props.tree, {})
}

const getTreeData = (state, props) => {

  const allGeoids = [...get(props, "geoids", []), props.compareGeoid].filter(Boolean);

// console.log("GEOIDS:", allGeoids)

  const walkTree = (node, geoid, year, isRoot = false) => {
    if (node.children) {
      node.children.forEach((n, i) => {
        n.color = n.color || (isRoot ? DEFAULT_COLORS[i % DEFAULT_COLORS.length] : node.color);
        walkTree(n, geoid, year);
      });
    }
    else {
      const value = get(state, ["graph", "acs", geoid, year, node.censusKey], -666666666);
      if (value !== -666666666) {
        node.value = value;
      }
      else {
        node.value = 1;
      }
    }
    return node;
  }

  return allGeoids.slice(0, 1).map(geoid => {
    return {
      geoid,
      data: walkTree(JSON.parse(JSON.stringify(props.tree)), geoid, props.year, true)
    };
  })
}
