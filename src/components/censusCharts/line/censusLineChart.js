import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import {falcorGraph} from "store/falcorGraph";
import { ResponsiveLine } from '@nivo/line'
var numeral = require('numeral')

class CensusLineChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 2014,
            temp:2014,
            graphData3: [],
        }
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    fetchFalcorDeps() {
        let year = [2010,2011,2012,2013,2014,2015,2016]
        let census_var = this.props.censusKey;
        let censusConfig ={}
        let census_subvars = []
        return falcorGraph.get(['acs','config'])
            .then(res=> {
            Object.values(res.json.acs).forEach(function (config, i) {
                censusConfig = config
            })

            Object.keys(censusConfig).forEach(function (censvar, i) {
                if (census_var.includes(censvar)) {
                    Object.values(censusConfig[censvar].variables).forEach(function (subvar, i) {
                        census_subvars.push(subvar.value)
                    })
                }
            })
            return falcorGraph.get(['acs',[...this.props.geoid],year,[...census_subvars]],['acs','config'])
    .then(response =>{

            return response
        })
    })
    }

    componentWillMount(){
        this.lineData().then(res =>{
            this.setState({
                graphData3 : res
            })
        })
    }

    componentDidUpdate(oldProps)
    {if(oldProps.geoid !== this.props.geoid){
        this.lineData().then(res =>{
            this.setState({
                graphData3 : res
            })
        })
    }


    }

    lineData(){
        return new Promise((resolve,reject) => {
            this.fetchFalcorDeps().then(response => {
        let response_data = response.json.acs[this.props.geoid];
        let years = [2010,2011,2012,2013,2014,2015,2016];
        let lineData = [];
        let censusConfig = response.json.acs.config[this.props.censusKey].variables;
        let axis_data = [];

        Object.keys(response_data).forEach(function(item,i){
            if (item !== '$__path'){
                let testData = response_data[item]
                censusConfig.forEach(function(config,j){
                    if ( j === 0){
                        if (Number.isNaN(parseInt(testData[config.value]))){
                            axis_data.push({
                                "x" : years[i],
                                "y" : 0
                            })
                        }
                        else{
                            axis_data.push({
                                "x" : years[i],
                                "y" : parseInt(testData[config.value])
                            })
                        }

                    }
                })
            }
        })
        lineData.push({
            "id": 'years',
            "color": "#9CCD58",
            "title": censusConfig[0].name,
            "data" : axis_data
        })
        resolve(lineData)
    })
    })


    }
    render () {
        const style = {
            height:'100%'
        };
       
        let title = this.state.graphData3.map(d => d.title)[0]
       if (this.props.PovertyPopulationBySex === false){
           let colors =[]
           if(this.props.colorRange !== undefined && this.props.colorRange.length > 0){
               colors = this.props.colorRange
           }else{
               colors = this.state.graphData3.map(d => d.color)
           }
           if(this.props)
            console.log('test 123', this.props.theme)
            return(
            <div style={style}>
            <ResponsiveLine
            theme={this.props.theme}
            
            data={this.state.graphData3}
            margin={{
                "top": 30,
                    "right": 150,
                    "bottom": 60,
                    "left": 60
            }}
            xScale={{
                "type": "point"
            }}
            yScale={{
                "type": 'linear',
                    "stacked": false,
                    "min": 'auto',
                    "max": 'auto'
            }}
            curve= 'linear'
            colors={colors}
            theme={this.props.theme}
            lineWidth = {2.5}
            axisTop={null}
            axisRight={null}
            dotSize={5}
            dotColor="inherit:darker(0.3)"
            dotBorderWidth={2}
            dotBorderColor="#ffffff"
            enableDotLabel={false}
            dotLabel="y"
            dotLabelYOffset={-12}
            animate={true}
            enableGridX={true}
            enableGridY={true}
            enableArea={false}
            areaOpacity={0.35}
            motionStiffness={90}
            motionDamping={15}
            legends={[
                    {
                        "anchor": "bottom-right",
                        "direction": "column",
                        "justify": false,
                        "translateX": 100,
                        "translateY": 0,
                        "itemsSpacing": 0,
                        "itemDirection": "left-to-right",
                        "itemWidth": 80,
                        "itemHeight": 20,
                        "itemOpacity": 0.75,
                        "symbolSize": 12,
                        "symbolShape": "circle",
                        "symbolBorderColor": "rgba(0, 0, 0, .5)",
                        "effects": [
                            {
                                "on": "hover",
                                "style": {
                                    "itemBackground": "rgba(0, 0, 0, .03)",
                                    "itemOpacity": 1
                                }
                            }
                        ]
                    }
                    ]}
            tooltip={({ id, indexValue, value, color, data }) => (
            <div>
            <h6>{title}</h6>
            <b><big>{this.props.geoid}</big></b>
            <br/> <br/>
            Year : {id}
            <br/>
            Median Income: ${Object.values(data)[0]['data'].y}
            </div>
        )}

            />
           </div>
        )
        }
        if(this.props.PovertyPopulationBySex === true){
            let colors =[]
            if(this.props.colorRange !== undefined && this.props.colorRange.length > 0){
                colors = this.props.colorRange
            }else{
                colors = this.state.graphData3.map(d => d.color)
            }
            return(
            <div style={style}>
            <ResponsiveLine
                theme={this.props.theme}
            
            data={this.state.graphData3}
            margin={{
                "top": 30,
                    "right": 150,
                    "bottom": 60,
                    "left": 140
            }}
            xScale={{
                "type": "point"
            }}
            yScale={{
                "type": 'linear',
                    "stacked": false,
                    "min": 'auto',
                    "max": 'auto'
            }}
            curve= 'linear'
            colors={colors}
            lineWidth = {2.5}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                "orient": "bottom",
                    "tickSize": 5,
                    "tickPadding": 5,
                    "tickRotation": 0,
                    "legend": "Poverty Status",
                    "legendOffset": 36,
                    "legendPosition": "center"
            }}
            axisLeft={{
                "orient": "left",
                    "tickSize": 5,
                    "tickPadding": 5,
                    "tickRotation": 0,
                    "legend": "Income in the past months below poverty level",
                    "legendOffset": -60,
                    "legendPosition": "center"
            }}
            dotSize={5}
            dotColor="inherit:darker(0.3)"
            dotBorderWidth={2}
            dotBorderColor="#ffffff"
            enableDotLabel={false}
            dotLabel="y"
            dotLabelYOffset={-12}
            animate={true}
            enableGridX={true}
            enableGridY={true}
            enableArea={false}
            areaOpacity={0.35}
            theme={this.props.theme}
            
            motionStiffness={90}
            motionDamping={15}

            legends={[
                    {
                        "anchor": "bottom-right",
                        "direction": "column",
                        "justify": false,
                        "translateX": 100,
                        "translateY": 0,
                        "itemsSpacing": 0,
                        "itemDirection": "left-to-right",
                        "itemWidth": 80,
                        "itemHeight": 20,
                        "itemOpacity": 0.75,
                        "symbolSize": 12,
                        "symbolShape": "circle",
                        "symbolBorderColor": "rgba(0, 0, 0, .5)",
                        "effects": [
                            {
                                "on": "hover",
                                "style": {
                                    "itemBackground": "rgba(0, 0, 0, .03)",
                                    "itemOpacity": 1
                                }
                            }
                        ]
                    }
                    ]}
            tooltip={({ id, indexValue, value, color,data }) => (
            <div>
            <b><big>{this.props.geoid}</big></b>
            <br/> <br/>
            Year : {id}
            <br/>
            Income : ${Object.values(data)[0]['data'].y}
            </div>
        )}

            />
            </div>

        )
        }


    }

    static defaultProps = {
        censusKey: ['B19013'], //'B19013',,
        geoid: ['36001'],
        PovertyPopulationBySex: false,
        colorRange:[]
    }

}


const mapDispatchToProps = { };

const mapStateToProps = (state,ownProps) => {
    return {
        geoid:ownProps.geoid,
        graph: state.graph, // so componentWillReceiveProps will get called.
        theme: state.user.theme
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CensusLineChart))
