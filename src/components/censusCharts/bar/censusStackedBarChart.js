import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import {falcorGraph} from "store/falcorGraph";
import {ResponsiveBar} from '@nivo/bar'
var numeral = require('numeral')

class CensusStackedBarChart extends React.Component {
    _isMounted = false;
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
            return falcorGraph.get(['acs',[...this.props.geoid,...this.props.compareGeoid],year,[...census_subvars]],['acs','config'])
    .then(response =>{
            return response
        })
    })
    }

    componentDidUpdate(oldProps){
        if (this.state.value !== this.state.temp){
            this.transformData().then(res =>{
                this.setState({
                    graphData1 : res[1],
                    temp : this.state.value
                });
        })
        }

        if (oldProps.geoid !== this.props.geoid){
            this.transformData().then(res =>{
                this.setState({
                    graphData1 : res[1],
                })
            })
        }

    }

    componentWillMount()
    {
        this._isMounted = true;
        this.transformData().then(res =>{
            this.setState({
                graphData1 : res[1],
            })
        })

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    transformData() {
        return new Promise((resolve,reject) => {
            this.fetchFalcorDeps().then(response => {
                if(this.props.PopulationByAge) {
                    let year = parseFloat(this.state.value);
                    let geoid = this.props.geoid;
                    let cenKey_age = this.props.censusKey;
                    let censusConfig = {};
                    let responseData_age = {};
                    let axisData_m = [];
                    let axisData_f = [];
                    let axisData = [];
                    let stackData_m = [];
                    let stackData_f = [];
                    let stackData = [];
                    let obj = {};


                    censusConfig = response.json.acs.config
                    responseData_age = response.json.acs[geoid][year]
                    //----------------------------- For the age by population graph -----------------------------
                    Object.keys(responseData_age).forEach(function (res, index) {
                        if (index > 2 && index !== 26) {
                            Object.keys(censusConfig).forEach(function (config, i) {
                                if (res.slice(0, -5) === config) {
                                    Object.values(censusConfig[config].variables).forEach(function (subvar, i) {
                                        if (res === subvar.value) {
                                            if (subvar.name.includes('Male')) {
                                                axisData_m.push({
                                                    "age": subvar.name.slice(5),
                                                    "Male": responseData_age[res],
                                                    "MaleColor1": "rgb(82, 65, 119)"
                                                })

                                                stackData_m.push({
                                                    "age": subvar.name.slice(5),
                                                    "Male": responseData_age[res]
                                                })


                                            } else if (subvar.name.includes('Female')) {
                                                axisData_f.push({
                                                    "Female": responseData_age[res],
                                                    "FemaleColor1": "rgb(229, 148, 93)"
                                                })

                                                stackData_f.push({
                                                    "Female": -(parseFloat(responseData_age[res]))
                                                })

                                            }
                                        }
                                    })
                                }
                            })
                        }

                    })
                    Object.values(axisData_f).forEach(function (axis_f, i) {
                        obj = {...axisData_m[i], ...axis_f}
                        axisData.push(obj)
                    })

                    Object.values(stackData_f).forEach(function (stack_f, i) {
                        obj = {...stackData_m[i], ...stack_f}
                        stackData.push(obj)
                    })

                    resolve([axisData,stackData])
                }

                if(this.props.PovertyPopulationBySex) {
                    let year = parseFloat(this.state.value);
                    let responseData_sex = response.json.acs[this.props.geoid][year];
                    let censusConfig = response.json.acs.config;
                    let stackDataPoverty_m = []
                    let axisDataPoverty_m = []
                    let stackDataNotPoverty_m = []
                    let axisDataNotPoverty_m = []
                    let stackDataPoverty_f = []
                    let axisDataPoverty_f = []
                    let stackDataNotPoverty_f = []
                    let axisDataNotPoverty_f = []
                    let stackDataMale = []
                    let axisDataMale = []
                    let stackDataFemale = []
                    let axisDataFemale = []
                    let axisData = []
                    let stackData = [];

                    /*
                    axisData.push(
                        {
                        'status':'18 years',
                        'MaleP': -(parseFloat(20000)),
                        'MaleColorP': "rgb(82, 65, 119)",
                        'FemaleP':-(parseFloat(30000)),
                        'FemaleColor': "rgb(82, 65, 119)",
                        'MaleNP':10000,
                        'MaleColorNP': "rgb(82, 65, 119)",
                        'FemaleNP':5000,
                        'FemaleColorNP': "rgb(82, 65, 119)",

                        },
                        {
                        "status":'25 years',
                        'Male': 10000,
                        'MaleColor': "rgb(82, 65, 119)",
                        'Female': 5000,
                        'FemaleColor': "rgb(82, 65, 119)"

                        }
                    )
                    stackData.push(
                        {
                            'status':'18 years',
                            'MaleP': -(parseFloat(20000)),
                            'FemaleP':-(parseFloat(30000)),
                            'MaleNP':10000,
                            'FemaleNP':5000

                        },
                        {
                            "status":'25 years',
                            'Male': 10000,
                            'Female': 5000,


                        }
                     */

                    Object.keys(responseData_sex).forEach(function (res, index) {
                        if (index >= 4 && index <= 16) {
                            Object.keys(censusConfig).forEach(function (config) {
                                if (res.slice(0, -5) === config) {
                                    Object.values(censusConfig[config].variables).forEach(function (subvar) {
                                        if (res === subvar.value) {
                                            axisDataPoverty_m.push({
                                                "age": subvar.name.slice(5),
                                                "MaleNumber": responseData_sex[res],
                                                "MaleColor1": "rgb(82, 65, 119)"
                                            })
                                            stackDataPoverty_m.push({
                                                "age": subvar.name.slice(5),
                                                "MaleNumber": parseFloat(responseData_sex[res]),
                                            })
                                        }
                                    })
                                }
                            })
                        }
                        if (index >= 32 && index <= 44) {
                            Object.keys(censusConfig).forEach(function (config) {
                                if (res.slice(0, -5) === config) {
                                    Object.values(censusConfig[config].variables).forEach(function (subvar) {
                                        if (res === subvar.value) {
                                            axisDataNotPoverty_m.push({
                                                "age": subvar.name.slice(5),
                                                "MaleNumber": responseData_sex[res],
                                                "MaleColor1": "rgb(82, 65, 119)"
                                            })
                                            stackDataNotPoverty_m.push({
                                                "age": subvar.name.slice(5),
                                                "MaleNumber": responseData_sex[res],
                                            })
                                        }
                                    })
                                }
                            })
                        }
                        if (index >= 18 && index <= 30) {
                            Object.keys(censusConfig).forEach(function (config) {
                                if (res.slice(0, -5) === config) {
                                    Object.values(censusConfig[config].variables).forEach(function (subvar) {
                                        if (res === subvar.value) {
                                            axisDataPoverty_f.push({
                                                "age": subvar.name.slice(6),
                                                "FemaleNumber": responseData_sex[res],
                                                "FemaleColor1": "rgb(82, 65, 119)"
                                            })
                                            stackDataPoverty_f.push({
                                                "age": subvar.name.slice(6),
                                                "FemaleNumber": -parseFloat(responseData_sex[res]),
                                            })
                                        }
                                    })
                                }
                            })
                        }
                        if (index >= 46 && index <= 59) {
                            Object.keys(censusConfig).forEach(function (config) {
                                if (res.slice(0, -5) === config) {
                                    Object.values(censusConfig[config].variables).forEach(function (subvar) {
                                        if (res === subvar.value) {
                                            axisDataNotPoverty_f.push({
                                                "age": subvar.name.slice(6),
                                                "FemaleNumber": responseData_sex[res],
                                                "FemaleColor1": "rgb(82, 65, 119)"
                                            })
                                            stackDataNotPoverty_f.push({
                                                "age": subvar.name.slice(6),
                                                "FemaleNumber": -(parseFloat(responseData_sex[res])),
                                            })
                                        }
                                    })
                                }
                            })
                        }

                    })

                    axisDataPoverty_m.forEach(function (axis, i) {
                        axisDataMale.push({
                            'age': axis.age,
                            'MalePoverty': parseFloat(axis.MaleNumber),
                            'colorP': axis.MaleColor1,
                            'MaleNotPoverty': parseFloat(axisDataNotPoverty_m[i].MaleNumber),
                            'colorNP': axisDataNotPoverty_m[i].MaleColor1


                        })
                        stackDataMale.push({
                            'age': axis.age,
                            'MalePoverty': parseFloat(stackDataPoverty_m[i].MaleNumber),
                            'MaleNotPoverty': parseFloat(stackDataNotPoverty_m[i].MaleNumber)
                        })

                    })

                    axisDataPoverty_f.forEach(function (axis, i) {
                        axisDataFemale.push({
                            'age': axis.age,
                            'FemalePoverty': parseFloat(axis.FemaleNumber),
                            'colorP': axis.FemaleColor1,
                            'FemaleNotPoverty': parseFloat(axisDataNotPoverty_f[i].FemaleNumber),
                            'colorNP': axisDataNotPoverty_f[i].FemaleColor1

                        })
                        stackDataFemale.push({
                            'age': axis.age,
                            'FemalePoverty': (parseFloat(stackDataPoverty_f[i].FemaleNumber)),
                            'FemaleNotPoverty': parseFloat(stackDataNotPoverty_f[i].FemaleNumber)
                        })
                    })
                    Object.values(axisDataFemale).forEach(function (axis_f, i) {
                        let obj = {...axisDataMale[i], ...axis_f}
                        axisData.push(obj)
                    })
                    Object.values(stackDataFemale).forEach(function (stack_f, i) {
                        let obj = {...stackDataMale[i], ...stack_f}
                        stackData.push(obj)
                    })

                    resolve([axisData,stackData])

                }

                if(this.props.CivilianStatus) {
                    let year = parseFloat(this.state.value);
                    let responseData_vet = response.json.acs[this.props.geoid][year];
                    let censusConfig = response.json.acs.config;
                    let stackDataVeteran_m =[]
                    let axisDataVeteran_m = []
                    let stackDataVeteran_f = []
                    let axisDataVeteran_f = []
                    let stackDataNotVeteran_m =[]
                    let axisDataNotVeteran_m = []
                    let stackDataNotVeteran_f = []
                    let axisDataNotVeteran_f = []
                    let stackDataMale = []
                    let axisDataMale = []
                    let stackDataFemale = []
                    let axisDataFemale = []
                    let axisData = []
                    let stackData =[];
                    Object.keys(responseData_vet).forEach(function (res, index) {
                        if (index >= 7 && index <= 21) {
                            Object.keys(censusConfig).forEach(function (config) {
                                if (res.slice(0, -5) === config) {
                                    Object.values(censusConfig[config].variables).forEach(function (subvar,i) {
                                        if (i>5 && i <21){
                                            if(subvar.name.includes('non')){
                                                if (res === subvar.value) {
                                                    axisDataNotVeteran_m.push({
                                                        "age": subvar.name.slice(5,-10),
                                                        "MaleNumber": responseData_vet[res],
                                                        "MaleColor1": "#4BE5E3"
                                                    })
                                                    stackDataNotVeteran_m.push({
                                                        "age": subvar.name.slice(5,-10),
                                                        "MaleNumber": responseData_vet[res],
                                                    })
                                                }
                                            }
                                            else if (subvar.name.includes('veteran') && !subvar.name.includes('Total') && !subvar.name.includes('non')){
                                                if (res === subvar.value) {
                                                    axisDataVeteran_m.push({
                                                        "age": subvar.name.slice(5,-10),
                                                        "MaleNumber": responseData_vet[res],
                                                        "MaleColor1": "#4BE5E3"
                                                    })
                                                    stackDataVeteran_m.push({
                                                        "age": subvar.name.slice(5,-10),
                                                        "MaleNumber": responseData_vet[res],
                                                    })
                                                }
                                            }
                                        }

                                    })
                                }
                            })
                        }
                        if(index >=25){
                            Object.keys(censusConfig).forEach(function (config) {
                                if (res.slice(0, -5) === config) {
                                    Object.values(censusConfig[config].variables).forEach(function (subvar,i) {
                                        if (i>=24){
                                            if(subvar.name.includes('non')){
                                                if (res === subvar.value) {
                                                    axisDataNotVeteran_f.push({
                                                        "age": subvar.name.slice(6,-8),
                                                        "FemaleNumber": responseData_vet[res],
                                                        "MaleColor1": "rgb(82, 65, 119)"
                                                    })
                                                    stackDataNotVeteran_f.push({
                                                        "age": subvar.name.slice(6,-8),
                                                        "FemaleNumber": -(parseFloat(responseData_vet[res])),
                                                    })
                                                }
                                            }
                                            else if(subvar.name.includes('veteran') && !subvar.name.includes('Total') && !subvar.name.includes('non')){
                                                if (res === subvar.value) {
                                                    axisDataVeteran_f.push({
                                                        "age": subvar.name.slice(6,-8),
                                                        "FemaleNumber": responseData_vet[res],
                                                        "MaleColor1": "rgb(82, 65, 119)"
                                                    })
                                                    stackDataVeteran_f.push({
                                                        "age": subvar.name.slice(6,-8),
                                                        "FemaleNumber": -(parseFloat(responseData_vet[res])),
                                                    })
                                                }
                                            }
                                        }

                                    })
                                }
                            })
                        }

                    })

                    axisDataVeteran_m.forEach(function (axis, i) {
                        axisDataMale.push({
                            'age': axis.age,
                            'MaleVeteran': parseFloat(axis.MaleNumber),
                            'colorP': axis.MaleColor1,
                            'MaleNotVeteran': parseFloat(axisDataNotVeteran_m[i].MaleNumber),
                            'colorNP': axisDataNotVeteran_m[i].MaleColor1


                        })
                        stackDataMale.push({
                            'age': axis.age,
                            'MaleVeteran': parseFloat(stackDataVeteran_m[i].MaleNumber),
                            'MaleNotVeteran': parseFloat(stackDataNotVeteran_m[i].MaleNumber)
                        })

                    })

                    axisDataVeteran_f.forEach(function (axis, i) {
                        axisDataFemale.push({
                            'age': axis.age,
                            'FemaleVeteran': parseFloat(axis.FemaleNumber),
                            'colorP': axis.FemaleColor1,
                            'FemaleNotVeteran': parseFloat(axisDataNotVeteran_f[i].FemaleNumber),
                            'colorNP': axisDataNotVeteran_f[i].FemaleColor1

                        })
                        stackDataFemale.push({
                            'age': axis.age,
                            'FemaleVeteran': (parseFloat(stackDataVeteran_f[i].FemaleNumber)),
                            'FemaleNotVeteran': parseFloat(stackDataNotVeteran_f[i].FemaleNumber)
                        })
                    })

                    Object.values(axisDataFemale).forEach(function (axis_f, i) {
                        let obj = {...axisDataMale[i], ...axis_f}
                        axisData.push(obj)
                    })
                    Object.values(stackDataFemale).forEach(function (stack_f, i) {
                        let obj = {...stackDataMale[i], ...stack_f}
                        stackData.push(obj)
                    })

                    resolve([axisData,stackData])
                }

                })
            })



    }


    render () {
        const style={
            height: 500
        }
        if (this.props.PopulationByAge === true) {
            return(
                <div style={style}>
                <ResponsiveBar
            data={this.state.graphData1}
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
                    "legendPosition": "middle",
                    "legendOffset": -50,

            }}
            markers={[
                    {
                        axis: 'x',
                        value: 0,
                        lineStyle: { stroke: '#E5945D', strokeWidth: 1 },
                        textColor: { fill: '#E5945D' },
                        legend: 'FEMALE POPULATION',
                        legendPosition: 'bottom-left',
                        legendOrientation: 'horizontal',
                        legendOffsetY: 420,
                    },
            {
                axis: 'x',
                    value: 0,
                lineStyle: { stroke: '#4C24A2', strokeWidth: 1 },
                textColor: { fill: '#4C24A2' },
                legend: 'MALE POPULATION',
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

        if(this.props.PovertyPopulationBySex){
            return(
                <div style={style}>
                <ResponsiveBar
            data={this.state.graphData1}
            margin={{
                top: 60,
                    right: 80,
                    bottom: 60,
                    left: 80
            }}
            indexBy="age"
            keys={["MalePoverty","MaleNotPoverty","FemalePoverty","FemaleNotPoverty"]}
            padding={0.5}
            layout = "horizontal"
            labelTextColor="inherit:darker(1.6)"
            labelSkipWidth={16}
            labelSkipHeight={16}
            labelFormat= ".0s"
            minValue={-30000}
            maxValue={30000}
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
                    "legendPosition": "middle",
                    "legendOffset": -50,

            }}
            markers={[
                    {
                        axis: 'x',
                        value: 0,
                        lineStyle: { stroke: '#EF2642', strokeWidth: 1 },
                        textStyle: { fill: '#EF2642' },
                        legend: 'FEMALES',
                        legendPosition: 'bottom-left',
                        legendOrientation: 'horizontal',
                        legendOffsetY: 420,
                    },
            {
                axis: 'x',
                    value: 0,
                lineStyle: { stroke: '#2A738A', strokeWidth: 1 },
                textStyle: { fill: '#2A738A' },
                legend: 'MALES',
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
                        "itemsSpacing": 5,
                        "symbolSize": 20
                    }
                    ]}
            tooltipFormat={value => `${Math.abs(value)}`
        }
            colors={[
                    '#82BDCF',
                '#2A738A',
                '#E295A0',
                '#EF2642'
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

        if(this.props.CivilianStatus){
            return(
                <div style={style}>
                <ResponsiveBar
            data={this.state.graphData1}
            margin={{
                top: 60,
                    right: 80,
                    bottom: 60,
                    left: 80
            }}
            indexBy="age"
            keys={["MaleVeteran","MaleNotVeteran","FemaleVeteran","FemaleNotVeteran"]}
            padding={0.8}
            layout = "horizontal"
            labelTextColor="inherit:darker(1.6)"
            labelSkipWidth={16}
            labelSkipHeight={16}
            labelFormat= ".0s"
            minValue={-45000}
            maxValue={45000}
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
                    "legendPosition": "middle",
                    "legendOffset": -50,

            }}
            markers={[
                    {
                        axis: 'x',
                        value: 0,
                        lineStyle: { stroke: '#EF2642', strokeWidth: 1 },
                        textStyle: { fill: '#EF2642' },
                        legend: 'FEMALES',
                        legendPosition: 'bottom-left',
                        legendOrientation: 'horizontal',
                        legendOffsetY: 420,
                    },
            {
                axis: 'x',
                    value: 0,
                lineStyle: { stroke: '#2A738A', strokeWidth: 1 },
                textStyle: { fill: '#2A738A' },
                legend: 'MALES',
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
                        "itemsSpacing": 5,
                        "symbolSize": 20
                    }
                    ]}
            tooltipFormat={value => `${Math.abs(value)}`
        }
            colors={[
                    '#82BDCF',
                '#2A738A',
                '#E295A0',
                '#EF2642'
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
        censusKey: [],
        geoid: [],
        compareGeoid: [],
        PopulationByAge: false,
        PovertyPopulationBySex: false,
        CivilianStatus: false,

    }

}


const mapDispatchToProps = { };

const mapStateToProps = (state,ownProps) => {
    return {
        geoid:ownProps.geoid,
        graph: state.graph // so componentWillReceiveProps will get called.
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CensusStackedBarChart))
