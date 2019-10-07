import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import {falcorGraph} from "store/falcorGraph";
import { ResponsiveLine } from '@nivo/line'
import Options from '../Options'
import Title from "../ComponentTitle"
import GeoName from 'components/censusCharts/geoname'
import CensusLabel, { getCensusKeyLabel } from 'components/censusCharts/CensusLabel'
import get from 'lodash.get'

import { format } from "d3-format"

import { getColorRange } from "constants/color-ranges"

class CensusLineChart extends React.Component {

    fetchFalcorDeps () {
      const geoids = [...this.props.geoids, this.props.compareGeoid].filter(geoid => Boolean(geoid));
        return falcorGraph.get(
            ['acs', geoids,
              this.props.years,
              [...this.props.divisorKeys, ...this.props.censusKeys]
            ],
            ["geo", geoids, "name"],
            ["acs", "meta", [...this.props.censusKeys, ...this.props.divisorKeys], "label"]
        )
        // .then(data =>{
        //     console.log('testing test data', ['acs',this.props.geoid,this.props.years,[...this.props.divisorKeys, ...this.props.censusKeys]], data)
        // })
    }

    processGeoid(geoid) {
      return this.props.censusKeys.map((censusKey,index) => {
          return {
              "id": `${ geoid }-${ censusKey }`,
              geoid,
              censusKey,
              "title": this.props.title,
              "data" : this.props.years.map(year => {
                  let value = get(this.props, `acs[${ geoid }][${ year }][${ censusKey }]`, 0)

                  if(this.props.sumType === 'pct') {
                      const divisor = get(this.props, `acs[${ geoid }][${year}][${this.props.divisorKeys[index]}]`, 1);
                      if ((divisor !== null) && !isNaN(divisor)) {
                        value = value / divisor;
                      }
                  }

                  return {
                      x: +year,
                      y: value
                  }
              }).filter(({ y }) => y !== -666666666)
          }
      })
    }

    lineData () {
        const data = this.processGeoid(this.props.geoids[0]);

        if (this.props.compareGeoid && this.props.showCompare) {
          data.push(...this.processGeoid(this.props.compareGeoid));
        }
        return data;
    }

    getTableData(geoid) {
      const getKeyName = key =>
        key in this.props.censusKeyLabels ? this.props.censusKeyLabels[key] :
        getCensusKeyLabel(key, this.props.acs, this.props.removeLeading),

        yFormat = format(this.props.yFormat);

      const data = [];
      for (const year of this.props.years) {
        this.props.censusKeys.forEach((key, i) => {
          const row = { geoid, year, "census key": key };
          row.name = get(this.props.geoGraph, [geoid, "name"], geoid);
          row["census label"] = getKeyName(key);
          let value = get(this.props, ['acs', geoid, year, key], 0);

          if (this.props.sumType === 'pct') {
            const divisorKey = this.props.divisorKeys[i],
              divisor = get(this.props, ['acs', geoid, year, divisorKey], 1);
            if ((divisor !== null) && !isNaN(divisor)) {
              value = value / divisor;
            }
            row["divisor key"] = divisorKey;
            row["divisor label"] = getKeyName(divisorKey);
          }
          row.value = value;//yFormat(value);

          data.push(row);
        })
      }
      return data;
    }
    processDataForViewing() {
      const data = this.getTableData(this.props.geoids[0]),
        keys = ["geoid", "name", "year", "census key", "census label"];

      if (this.props.sumType === "pct") {
        keys.push("divisor key", "divisor label");
      }
      keys.push("value");

      return {
        data,
        keys
      };
    }

    render () {
        const title = this.props.title,
          yFormat = format(this.props.yFormat),
          getKeyName = key =>
            this.props.divisorKeys.length ? "Value" :
            key in this.props.censusKeyLabels ? this.props.censusKeyLabels[key] :
            getCensusKeyLabel(key, this.props.acs, this.props.removeLeading);
console.log("THEME:", this.props);
        return(
            <div style={{height: '100%'}}>
              <div style={ { height: "30px", maxWidth: "calc(100% - 285px)" } }>
                <Title title={ title }/>
                { !this.props.showOptions ? null :
                  <Options tableTitle={ this.props.title }
                    processDataForViewing={ this.processDataForViewing.bind(this) }
                    id={ this.props.id }
                    layout={ { ...this.props.layout } }
                    embedProps={ {
                      type: "CensusLineChart",
                      title: this.props.title,
                      geoids: [...this.props.geoids],
                      compareGeoid: this.props.compareGeoid,
                      sumType: this.props.sumType,
                      censusKeys: [...this.props.censusKeys],
                      divisorKeys: [...this.props.divisorKeys],
                      yFormat: this.props.yFormat,
                      marginLeft: this.props.marginLeft,
                      stacked: this.props.stacked,
                      curve: this.props.curve,
                      theme: JSON.parse(JSON.stringify(this.props.theme).replace(/[#]/g, "__HASH__")),
                      years: [...this.props.years]
                    } }/>
                }
              </div>
              <div style={ { height: "calc(100% - 30px)" } } id={ this.props.id }>
                <ResponsiveLine
                    data={ this.lineData() }
                    margin={{
                            "top": 30,
                            "right": 20,
                            "bottom": 30,
                            "left": this.props.marginLeft
                    }}
                    xScale={{
                        "type": "point"
                    }}
                    yScale={{
                        "type": 'linear',
                            "stacked": this.props.stacked,
                            "min": 'auto',
                            "max": 'auto'
                    }}
                    colors={ getColorRange(8, "Set2") }
                    curve={this.props.curve}
                    theme={this.props.theme}
                    lineWidth = {2.5}
                    dotSize={5}
                    dotColor="inherit:darker(0.3)"
                    dotBorderWidth={2}
                    dotBorderColor="#ffffff"
                    enableDotLabel={false}
                    dotLabel="y"
                    dotLabelYOffset={-12}
                    animate={false}
                    enableGridX={true}
                    enableGridY={true}
                    enableArea={false}
                    areaOpacity={0.35}
                    motionStiffness={90}
                    motionDamping={15}
                    axisLeft={ {
                      format: yFormat
                    } }
                    tooltip={({ id, indexValue, value, color, data }) => (
                      <table>
                        <thead>
                          <tr>
                            <th colSpan="4" style={ { fontSize: "1rem" } }>Year: { id }</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            data.map(({ data, serie: { id, censusKey, geoid, color } }) =>
                              <tr key={ id }>
                                <td style={ { paddingRight: "5px" } }><div style={ { width: "15px", height: "15px", background: color } }/></td>
                                <td style={ { paddingRight: "5px" } }><GeoName geoids={ [geoid] }/></td>
                                <td style={ { paddingRight: "5px" } }>{ getKeyName(censusKey) }</td>
                                <td style={ { textAlign: "right" } }>{ yFormat(data.y) }</td>
                              </tr>
                            )
                          }
                        </tbody>
                      </table>
                    )}/>
                </div>
           </div>
        )
    }

    static defaultProps = {
        censusKeys: ['B19013_001E'], //'B19013',,
        divisorKeys: [],
        geoids: ['36001'],
        colorRange:['#047bf8','#6610f2','#6f42c1','#e83e8c','#e65252','#fd7e14','#fbe4a0','#24b314','#20c997','#5bc0de'],
        years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
        curve: 'cardinal',
        title: '',
        stacked: false,
        yFormat: ',d',
        marginLeft: 50,
        showCompare: true,
        compareGeoid: null,
        censusKeyLabels: {},
        showOptions: true,
        sumType: "sum"
    }

}


const mapDispatchToProps = { };

const mapStateToProps = (state, ownProps) => ({
  acs: get(state, `graph.acs`, {}),
  geoGraph: get(state, 'graph.geo', {}),
  theme: state.user.theme
})
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CensusLineChart))
