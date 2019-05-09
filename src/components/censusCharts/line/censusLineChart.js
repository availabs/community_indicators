import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import {falcorGraph} from "store/falcorGraph";
import { Line } from '@nivo/line'
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
    {
        if(oldProps.geoid !== this.props.geoid){
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
                let response_lineData = [];
        let response_data = {};
        let years = [2010,2011,2012,2013,2014,2015,2016];
        let cenKey_income = this.props.censusKey;
        let lineData = [];
        let censusConfig = {};
        let axis_data = [];
        Object.values(response.json).forEach(function(value){
            censusConfig = value['config'];
            Object.values(value).forEach(function(val,i){
                if ( i === 0){
                    response_data = val
                }
            })
        })
        Object.keys(response_data).forEach(function(response){
            Object.keys(response_data[response]).forEach(function(data){
                if (data === (cenKey_income + '_001E') ){
                    response_lineData.push(response_data[response][cenKey_income + '_001E'])
                }

            })
        })

        response_lineData.forEach(function(value,index){
            axis_data.push({
                "x" : years[index],
                "y" : parseInt(value)
            })


        })

        axis_data = axis_data.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
        })
        lineData.push({
            "id": 'years',
            "color": "hsl(157, 70%, 50%)",
            "data" : axis_data
        })
        resolve(lineData)
    })
    })


    }
    render () {
        if (Object.values(this.props.censusKey).includes('B19013')){
            return(
                <div>
                <Line
            data={this.state.graphData3}
            width={900}
            height={500}
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
            lineWidth = {2.5}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                "orient": "bottom",
                    "tickSize": 5,
                    "tickPadding": 5,
                    "tickRotation": 0,
                    "legend": "Median Household Income in the Past 12 Months (In 2010 Inflation-Adjusted Dollars)",
                    "legendOffset": 36,
                    "legendPosition": "center"
            }}
            axisLeft={{
                "orient": "left",
                    "tickSize": 5,
                    "tickPadding": 5,
                    "tickRotation": 0,
                    "legend": "Median Income",
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
            <text>
            <b><big>{this.props.geoid}</big></b>
            <br/> <br/>
            Year : {id}
        <br/>
            Median Income : ${Object.values(data)[0]['data'].y}
                </text>
        )}

            />
            </div>
        )
        }
        if(Object.values(this.props.censusKey).includes('B17001')){
            return(
                <div>
                <Line
            data={this.state.graphData3}
            width={900}
            height={500}
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
                    "legend": "Income in the past 12 months below poverty level",
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
            <text>
            <b><big>{this.props.geoid}</big></b>
            <br/> <br/>
            Year : {id}
        <br/>
            Income : ${Object.values(data)[0]['data'].y}
                </text>
        )}

            />
            </div>
        )
        }


    }

    static defaultProps = {
        censusKey: ['B19013'], //'B19013',,
        geoid: ['36001']
    }

}


const mapDispatchToProps = { };

const mapStateToProps = (state,ownProps) => {
    return {
        geoid:ownProps.geoid,
        graph: state.graph // so componentWillReceiveProps will get called.
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CensusLineChart))
