import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import {falcorGraph} from "store/falcorGraph";
import { ResponsiveLine } from '@nivo/line'
import Options from '../Options'
import Title from "../ComponentTitle"
import GeoName from 'components/censusCharts/geoname'
import get from 'lodash.get'



class CensusLineChart extends React.Component {

    fetchFalcorDeps () {
        return falcorGraph.get(
            ['acs',this.props.geoid,this.props.years,[...this.props.divisorKeys, ...this.props.censusKeys]]
        )
        // .then(data =>{
        //     console.log('testing test data', ['acs',this.props.geoid,this.props.years,[...this.props.divisorKeys, ...this.props.censusKeys]], data)
        // })
    }

    lineData () {
        //console.log('line data', this.props.acs)
        return this.props.censusKeys.map((censusKey,index) => {
            return {
                "id": censusKey,
                "color": this.props.colorRange[index % this.props.colorRange.length],
                "title": this.props.title,
                "data" : this.props.years.map(year => {
                    let value = get(this.props, `acs[${this.props.geoids[0]}][${year}][${censusKey}]`, 0)

                    if(this.props.sumType === 'pct') {
                        const divisor = get(this.props, `acs[${this.props.geoids[0]}][${year}][${this.props.divisorKeys[index]}]`, 1);
                        if ((divisor !== null) && !isNaN(divisor)) {
                          value /= divisor
                          value *= 100
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

    render () {
        const title = this.props.title;
        return(
            <div style={{height: '100%'}}>
              <div style={ { height: "30px" } }>
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
                            "left": 100
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
                    curve={this.props.curve}
                    theme={this.props.theme}
                    lineWidth = {2.5}
                    dotSize={5}
                    dotColor="inherit:darker(0.3)"
                    dotBorderWidth={2}
                    dotBorderColor="#ffffff"
                    enableDotLabel={false}
                    dotLabel="y"
                    colorBy={d => d.color}
                    dotLabelYOffset={-12}
                    animate={false}
                    enableGridX={true}
                    enableGridY={true}
                    enableArea={false}
                    areaOpacity={0.35}
                    motionStiffness={90}
                    motionDamping={15}
                    tooltip={({ id, indexValue, value, color, data }) => (
                      <table>
                        <thead>
                          <tr>
                            <th colSpan="3"><GeoName geoid={ this.props.geoid }/></th>
                          </tr>
                          <tr>
                            <th colSpan="3">Year: { id }</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            data.map(({ data, serie: { id, color } }) =>
                              <tr key={ id }>
                                <td style={ { paddingRight: "5px" } }><div style={ { width: "15px", height: "15px", background: color } }/></td>
                                <td style={ { paddingRight: "5px" } }>{ id }</td>
                                <td style={ { textAlign: "right" } }>{ data.y }</td>
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
        PovertyPopulationBySex: false,
        colorRange:['#047bf8','#6610f2','#6f42c1','#e83e8c','#e65252','#fd7e14','#fbe4a0','#24b314','#20c997','#5bc0de'],
        years: [2010,2011,2012,2013,2014,2015,2016],
        curve: 'cardinal',
        title: '',
        stacked: false
    }

}


const mapDispatchToProps = { };

const mapStateToProps = (state,ownProps) => {
    return {
        acs: get(state, `graph.acs`, {}),
        theme: state.user.theme
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CensusLineChart))
