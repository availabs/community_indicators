import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import {falcorGraph} from "store/falcorGraph";
import {Bar} from '@nivo/bar'
var numeral = require('numeral')

class CensusStackedBarChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 2014,
            temp:2014,
            graphData1: [],
            graphData2: [],
            graphData3: [],
            graphData4: []
        }
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    fetchFalcorDeps() {
        let year = [2010,2011,2012,2013,2014,2015,2016]
        let census_var = this.props.censusKey
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
            return falcorGraph.get(['acs',[...this.props.geoid,...this.props.compareGeoid],year,[...census_subvars]],['acs','config'])
    .then(response =>{
            return response
        })
    })

        //return this.props.censusKey.reduce((a, c) => a.then(() => falcorGraph.get(['acs',[...this.props.geoids,...this.props.compareGeoid],year,c],['acs','config'])), Promise.resolve())
        //return this.props.censusKey.reduce((a,c) => a.then(() => falcorGraph.get(['acs',[...this.props.geoids,...this.props.compareGeoid],year,c])),Promise.resolve())
    }

    componentDidUpdate(){
        if (this.state.value !== this.state.temp){
            this.transformData().then(res =>{
                this.setState({
                    graphData1 : res[1],
                    temp : this.state.value
                });
        })
        }



    }

    componentWillMount()
    {
        this.transformData().then(res =>{
            this.setState({
                graphData1 : res[1],
            })
        })

    }

    transformData() {
        return new Promise((resolve,reject) => {
            this.fetchFalcorDeps().then(response => {
                let year = parseFloat(this.state.value);
        let geoid = this.props.geoids;
        let cenKey_age = this.props.censusKey[0];
        let censusConfig = {};
        let responseData_age = {};
        let axisData_m = [];
        let axisData_f =[];
        let axisData =[];
        let stackData_m = [];
        let stackData_f = [];
        let stackData = [];
        let obj ={};
        if (year === 2014){
            Object.values(response.json).forEach(function(value,i){
                censusConfig = value['config']
                if (value[geoid] !== undefined){
                    Object.keys(value[geoid]).forEach(function(val,i){
                        if (val === '2014'){
                            responseData_age = value[geoid][val]

                        }

                    })
                }

            })
        }

        if (year === 2010){
            Object.values(response.json).forEach(function(value,i){
                censusConfig = value['config']
                if (value[geoid] !== undefined){
                    Object.keys(value[geoid]).forEach(function(val,i){
                        if (val === '2010'){
                            responseData_age = value[geoid][val]

                        }

                    })
                }

            })

        }

        if (year === 2011){
            Object.values(response.json).forEach(function(value,i){
                censusConfig = value['config']
                if (value[geoid] !== undefined){
                    Object.keys(value[geoid]).forEach(function(val,i){
                        if (val === '2011'){
                            responseData_age = value[geoid][val]

                        }

                    })
                }

            })

        }

        if (year === 2012){
            Object.values(response.json).forEach(function(value,i){
                censusConfig = value['config']
                if (value[geoid] !== undefined){
                    Object.keys(value[geoid]).forEach(function(val,i){
                        if (val === '2012'){
                            responseData_age = value[geoid][val]

                        }

                    })
                }

            })

        }

        if (year === 2013){
            Object.values(response.json).forEach(function(value,i){
                censusConfig = value['config']
                Object.values(value).forEach(function(val,i){
                    if ( i === 0){
                        responseData_age = val[year]
                    }
                })
            })

        }

        if (year === 2015){
            Object.values(response.json).forEach(function(value,i){
                censusConfig = value['config']
                if (value[geoid] !== undefined){
                    Object.keys(value[geoid]).forEach(function(val,i){
                        if (val === '2015'){
                            responseData_age = value[geoid][val]

                        }

                    })
                }

            })

        }
        if (year === 2016){
            Object.values(response.json).forEach(function(value,i){
                censusConfig = value['config']
                if (value[geoid] !== undefined){
                    Object.keys(value[geoid]).forEach(function(val,i){
                        if (val === '2016'){
                            responseData_age = value[geoid][val]

                        }

                    })
                }

            })

        }
        if (year === 2017){
            Object.values(response.json).forEach(function(value,i){
                censusConfig = value['config']
                if (value[geoid] !== undefined){
                    Object.keys(value[geoid]).forEach(function(val,i){
                        if (val === '2017'){
                            responseData_age = value[geoid][val]

                        }

                    })
                }

            })

        }

        //----------------------------- For the age by population graph -----------------------------
        Object.keys(responseData_age).forEach(function(res,index){
            if (res.slice(0,-5)===cenKey_age){
                if (index > 2 && index !== 26){
                    Object.keys(censusConfig).forEach(function(config,i){
                        if (res.slice(0,-5) === config){
                            Object.values(censusConfig[config].variables).forEach(function(subvar,i) {
                                if (res === subvar.value) {
                                    if (subvar.name.includes('Male')) {
                                        axisData_m.push({
                                            "age": subvar.name.slice(5),
                                            "Male": responseData_age[res],
                                            "MaleColor1": "rgb(82, 65, 119)"
                                        })

                                        stackData_m.push({
                                            "age" : subvar.name.slice(5),
                                            "Male":responseData_age[res]
                                        })


                                    }
                                    else if (subvar.name.includes('Female')) {
                                        axisData_f.push({
                                            "Female": responseData_age[res],
                                            "FemaleColor1": "rgb(229, 148, 93)"
                                        })

                                        stackData_f.push({
                                            "Female" : -(parseFloat(responseData_age[res]))
                                        })

                                    }
                                }
                            })
                        }
                    })
                }
            }

        })
        Object.values(axisData_f).forEach(function(axis_f,i){
            obj = {...axisData_m[i],...axis_f}
            axisData.push(obj)
        })

        Object.values(stackData_f).forEach(function(stack_f,i){
            obj = {...stackData_m[i],...stack_f}
            stackData.push(obj)
        })
        resolve([axisData,stackData])
    })
    })


    }


    render () {
        if (Object.values(this.props.censusKey).includes('B01001') && Object.values(this.props.geoid).includes('36001')) {
            return(
                <div>
                <Bar
            data={this.state.graphData1}
            width={900}
            height={500}
            margin={{
                top: 60,
                    right: 80,
                    bottom: 60,
                    left: 80
            }}
            indexBy="age"
            keys={["Male","Female"]}
            padding={0.3}
            layout = "horizontal"
            labelTextColor="inherit:darker(1.6)"
            labelSkipWidth={16}
            labelSkipHeight={16}
            labelFormat= ".0s"
            minValue={-12000}
            maxValue={12000}
            enableGridX = {true}
            enableGridY={false}
            axisTop={{tickSize: 0,
                tickPadding: 12,
                format: v => `${Math.abs(v)}`
            }}
            axisBottom={{
                legendOffset: 50,
                    tickSize: 0,
                    tickPadding: 12,
                    format: v => `${Math.abs(v)}`
            }}
            axisLeft={{
                "orient": "left",
                    "tickSize": 5,
                    "tickPadding": 5,
                    "tickRotation": 0,
                    "legendPosition": "center",
                    "legendOffset": -50,

            }}
            markers={[
                    {
                        axis: 'x',
                        value: 0,
                        lineStyle: { stroke: '#E5945D', strokeWidth: 1 },
                        textStyle: { fill: '#E5945D' },
                        legend: 'FEMALE',
                        legendPosition: 'bottom-left',
                        legendOrientation: 'horizontal',
                        legendOffsetY: 420,
                    },
            {
                axis: 'x',
                    value: 0,
                lineStyle: { stroke: '#4C24A2', strokeWidth: 1 },
                textStyle: { fill: '#4C24A2' },
                legend: 'MALE',
                    legendPosition: 'bottom-right',
                legendOrientation: 'horizontal',
                legendOffsetY: 420,
            },
            {
                axis: 'x',
                    value: 0,
                legend: 'Age',
                legendPosition: 'bottom-right',
                legendOrientation: 'horizontal',
                legendOffsetX: 300,
                legendOffsetY: -300
            }
        ]}
            legends={[
                    {
                        "dataFrom": "keys",
                        "anchor": "bottom",
                        "direction": "row",
                        "translateX": 30,
                        "translateY": 65,
                        "itemWidth": 100,
                        "itemHeight": 20,
                        "itemsSpacing": 2,
                        "symbolSize": 20
                    }
                    ]}
            tooltipFormat={value => `${Math.abs(value)}`
        }
            colors={[
                    '#4C24A2',
                '#E5945D',
        ]}
            />
            <label><h4>{this.state.value}</h4>
            <input
            id="typeinp"
            type="range"
            min='2010'max='2016'
            value={this.state.value}
            onChange={this.handleChange}
            step="1" />
                </label>
                </div>
        )
        }


    }


    static defaultProps = {
        censusKey: ['B01001','B16001','B19013','B23008'], //'B19013',,
        geoids: ['36001'],
        compareGeoid: []
    }

}


const mapDispatchToProps = { };

const mapStateToProps = state => {
    return {
        graph: state.graph // so componentWillReceiveProps will get called.
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CensusStackedBarChart))
