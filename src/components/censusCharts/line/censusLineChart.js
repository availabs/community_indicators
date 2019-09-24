import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import {falcorGraph} from "store/falcorGraph";
import { ResponsiveLine } from '@nivo/line'
import Options from '../Options'
import Title from "../ComponentTitle"
import GeoName from 'components/censusCharts/geoname'
import CensusName, { getCensusKeyName } from 'components/censusCharts/CensusName'
import get from 'lodash.get'

import { format } from "d3-format"

import { getColorRange } from "constants/color-ranges"

class CensusLineChart extends React.Component {

    fetchFalcorDeps () {
        return falcorGraph.get(
            ['acs', [...this.props.geoids, this.props.compareGeoid].filter(geoid => Boolean(geoid)),
              this.props.years,
              [...this.props.divisorKeys, ...this.props.censusKeys]
            ]
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

    render () {
        const title = this.props.title,
          yFormat = format(this.props.yFormat),
          getKeyName = key =>
            this.props.divisorKeys.length ? "Value" :
            getCensusKeyName(key, this.props.acs, this.props.removeLeading);
        return(
            <div style={{height: '100%'}}>
              <div style={ { height: "30px", maxWidth: "calc(100% - 285px)" } }>
                <Title title={ title }/>
                <Options />
              </div>
              <div style={ { height: "calc(100% - 30px)" } }>
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
        compareGeoid: null
    }

}


const mapDispatchToProps = { };

const mapStateToProps = (state, ownProps) => ({
  acs: get(state, `graph.acs`, {}),
  theme: state.user.theme
})
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CensusLineChart))
