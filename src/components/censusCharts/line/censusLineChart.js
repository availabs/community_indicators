import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import {falcorGraph} from "store/falcorGraph";
import { ResponsiveLine } from '@nivo/line'
import GeoName from 'components/censusCharts/geoname'
import get from 'lodash.get'



class Options extends React.Component {
  render () {
    return (

     <div className="os-tabs-controls" style={{position: 'absolute', top: 0, right: 0, zIndex: 999}}>
       <ul className="nav nav-tabs smaller">
          <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#tab_overview">View Data</a></li>
          <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#tab_sales">Save Image</a></li>
          <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#tab_sales">Share Embed</a></li>
       </ul>
    </div>
    );
  }
}

class CensusLineChart extends React.Component {
    
    fetchFalcorDeps () {
        return falcorGraph.get(
            ['acs',this.props.geoid,this.props.years,this.props.censusKeys],
            ['acs','config']
        )
    }

    lineData () {
        console.log('in line Data', this.props.colorRange)
        return [{
            "id": 'years',
            "color": this.props.colorRange[0],
            "title": this.props.title,
            "data" : this.props.years.map(year => {
                return {
                    x: +year,
                    y: get(this.props, `acs[${this.props.geoids[0]}][${year}][${this.props.censusKeys[0]}]`, 0)
                }
            })    
        }]    
    }

    render () {
       
        let title = this.props.title
        let graphData = this.lineData()
        console.log('test 123', this.props.theme, graphData, this.props.colorRange)
        return(
            <div style={{height: '100%'}}>
                <h6>{this.props.title}</h6>
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
        geoids: ['36001'],
        PovertyPopulationBySex: false,
        colorRange:['#047bf8'],
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
