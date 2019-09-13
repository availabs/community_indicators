import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import {falcorGraph} from "store/falcorGraph";
import { ResponsiveLine } from '@nivo/line'
import Options from '../Options'
import GeoName from 'components/censusCharts/geoname'
import get from 'lodash.get'



class CensusLineChart extends React.Component {
    
    fetchFalcorDeps () {
        return falcorGraph.get(
            ['acs',this.props.geoid,this.props.years,[...this.props.divisorKeys, ...this.props.censusKeys]]
        ).then(data =>{
            console.log('testing test data', ['acs',this.props.geoid,this.props.years,[...this.props.divisorKeys, ...this.props.censusKeys]], data)
        })
    }

    lineData () {
        console.log('line data', this.props.acs)
        return this.props.censusKeys.map((censusKey,index) => {
            return {
                "id": censusKey,
                "color": this.props.colorRange[index % this.props.colorRange.length],
                "title": this.props.title,
                "data" : this.props.years.map(year => {
                    let value = get(this.props, `acs[${this.props.geoids[0]}][${year}][${censusKey}]`, 0)
                    
                    if(this.props.sumType === 'pct') {
                        let divisor = get(this.props, `acs[${this.props.geoids[0]}][${year}][${this.props.divisorKeys[index]}]`, 1) 
                        value /= divisor
                        value *= 100
                    }

                    return {
                        x: +year,
                        y: value
                    }
                })
            }    
        })
    }

    render () {
       
        let title = this.props.title
        let graphData = this.lineData()
        console.log('test 123', this.props.theme, graphData, this.props.colorRange)
        return(
            <div style={{height: '100%'}}>
                <h6 style={{position: 'absolute', top: 0, left: 0, padding: '8px 12px'}}>{this.props.title}</h6>
                <Options />
                <ResponsiveLine
                    data={graphData}
                    margin={{
                            "top": 30,
                            "right": 20,
                            "bottom": 60,
                            "left": 60
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
                    <div>
                        <h6>{title}</h6>
                        <h6><GeoName geoid={this.props.geoid} /></h6>
                         Year : {id}
                        <br/>
                        Value: {Object.values(data)[0]['data'].y.toLocaleString()}
                    </div>
                    )}

                />
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
