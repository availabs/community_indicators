import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import {falcorGraph} from "store/falcorGraph";
import {ResponsiveBar} from '@nivo/bar'
import ColorRanges from 'constants/color-ranges'
var numeral = require('numeral')

class CensusBarChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 2014,
            temp:2014,
            graphData2: [],
            graphData10: [],
            height:0,
            width:0
        }
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    fetchFalcorDeps() {
        let census_var = this.props.censusKey;
        let censusConfig ={};
        let census_subvars = [];
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
            return falcorGraph.get(['acs',[...this.props.geoid],[...this.props.year],[...census_subvars]],['acs','config'])
    .then(response =>{
            return response
        })
    })

    }


    componentWillMount()
    {

        this.languageData().then(res =>{
            this.setState({
                graphData2 : res
            })
        })

        this.familyData().then(res =>{
            this.setState({
                graphData10: res
            })
        })

    }

    componentDidUpdate(oldProps,oldState){
        if(oldProps.geoid !== this.props.geoid){
            this.languageData().then(res =>{
                this.setState({
                    graphData2 : res
                })
            })

            this.familyData().then(res =>{
                this.setState({
                    graphData10: res
                })
            })

        }
    }


    languageData(){
        return new Promise((resolve,reject) => {
            this.fetchFalcorDeps().then(response => {
                let langData_vw = []; //Speak English very well
                let langData_nvw = [];// Speak English less than very well
                let langData = [];
                let censusConfig = response.json.acs.config[this.props.censusKey].variables;
                let responseData_language = response.json.acs[this.props.geoid][this.props.year]
                Object.keys(responseData_language).forEach(function (language, i) {
                    censusConfig.forEach(function (subvar) {
                        if (language === subvar.value) {
                            if (subvar.name.includes('Speak English very well')) {
                                langData_vw.push({
                                    "language": subvar.name.split('Speak')[0],
                                    "Speakers": responseData_language[language]
                                })
                            }
                            else if (subvar.name.includes('Speak English Less than very well')) {
                                langData_nvw.push({
                                    "language": subvar.name.split('Speak')[0],
                                    "Speakers": responseData_language[language]
                                })
                            }
                        }
                    })

                })


                let subvarColors = ['#C01616', '#091860', '#E0E540', '#C15E0A', '#074F28', '#564B8E', '#287F2C', '#1AA3CB', '#790576',
                    '#F7C9B9', '#F4F3AF', '#C2ECF3', '#F4AD4D', '#2AF70E', '#D8AFE7', '#88DE73', '#718CD1', '#EA6A7D',
                    '#C01616', '#091860', '#E0E540', '#C15E0A', '#074F28', '#564B8E', '#287F2C'
                ]

                Object.values(langData_nvw).forEach(function (nvw, i) {
                        langData.push({
                            "language": nvw.language,
                            "Speakers": parseFloat(nvw.Speakers) + parseFloat(langData_vw[i].Speakers),
                            "Percent": parseFloat((parseFloat(nvw.Speakers) / (parseFloat(langData_vw[i].Speakers) + parseFloat(nvw.Speakers)) * 100).toFixed(2)),
                            "language_color": subvarColors[i]
                        })

                })
                langData.sort(function (a, b) {
                    var a1 = parseFloat(a.Percent)
                    var b1 = parseFloat(b.Percent)
                    return b1 - a1
                })
                resolve(langData)
            })
        })


    }

    familyData(){
        return new Promise((resolve,reject) => {
            this.fetchFalcorDeps().then(response =>{
                let responseData_family =response.json.acs[this.props.geoid][this.props.year];
                let censusConfig = response.json.acs.config[this.props.censusKey].variables;
                let familyData = [];
                let colors = ['#C01616','#091860','#E0E540','#C15E0A','#074F28','#564B8E','#287F2C']
                Object.keys(responseData_family).filter(d => d !== '$__path').forEach(function(item){
                    censusConfig.forEach(function(config,j){
                        if ( j !== 0){
                            if (responseData_family[config.value] < 0){
                                familyData.push({
                                    "family":config.name,
                                    "familyIncome":Math.abs(responseData_family[config.value])/1000,
                                    "color": colors[j]
                                })
                            }
                            else{
                                familyData.push({
                                    "family":config.name,
                                    "familyIncome":responseData_family[config.value],
                                    "color": colors[j]
                                })
                            }
                        }
                    })

                })

                resolve(familyData)
            })
        })
    }



    render () {
        const style = {
            height:500
        };
        if(this.props.familyIncome === false){
        return(
            <div style={style}>
            <ResponsiveBar
            data={this.state.graphData2}
            indexBy="language"
            keys = {["Percent"]}
            margin={{
                "top": 100,
                    "right": 130,
                    "bottom": 170,
                    "left": 60
            }}
            padding={0.3}
            colors = {this.state.graphData2.map(d => d.language_color)}
            colorBy = "index"
            layout = "vertical"
            borderColor="inherit:darker(1.6)"
            enableGridX = {true}
            enableGridY={true}
            axisBottom={{
                "orient": "bottom",
                    "tickSize": 5,
                    "tickPadding": 5,
                    "tickRotation": -90,
                    "legendPosition": "middle",
                    "legendOffset": 36
            }}
            axisLeft={{
                "orient": "left",
                    "tickSize": 5,
                    "tickPadding": 5,
                    "tickRotation": 0,
                    "legendPosition": "middle",
                    "legendOffset": -50,
                    "legend" : "% of Population Not Speaking English Very Well",
                    format: v => `${v}%`
            }}
            labelSkipWidth={12}
            labelSkipHeight={36}
            enableLabel = {false}
            labelTextColor="inherit:darker(1.6)"
            labelFormat = "0"
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            tooltip={({ id, indexValue, value, color,data }) => (
            <text>
            <b><big>{indexValue}</big></b>
            <br/> <br/>
            {['Total Speakers']} : {data.Speakers}
        <br/>
            {id} Speaking English less than very well: {value}%
        </text>
        )}
            />
            </div>
        )
        }
        if(this.props.familyIncome === true){
            return(
                <div style={style}>
                <ResponsiveBar
            data={this.state.graphData10}
            indexBy="family"
            keys = {["familyIncome"]}
            margin={{
                "top": 100,
                    "right": 130,
                    "bottom": 170,
                    "left": 60
            }}
            minValue={0}
            maxValue={200000}
            padding={0.5}
            colors = {this.state.graphData10.map(d => d.color)}
            colorBy = "index"
            layout = "vertical"
            borderColor="inherit:darker(1.6)"
            enableGridX = {true}
            enableGridY={true}
            axisBottom={{
                "orient": "bottom",
                    "tickSize": 5,
                    "tickPadding": 5,
                    "tickRotation": -90,
                    "legendPosition": "middle",
                    "legendOffset": 36
            }}
            axisLeft={{
                "orient": "left",
                    "tickSize": 5,
                    "tickPadding": 5,
                    "tickRotation": 0,
                    "legendPosition": "middle",
                    "legendOffset": -50,
                    "legend" : "Median Income by Family Size",
                    format: v => `${v}`
            }}
            labelSkipWidth={12}
            labelSkipHeight={36}
            enableLabel = {false}
            labelTextColor="inherit:darker(1.6)"
            labelFormat = "0"
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            tooltip={({ id, indexValue, value, color,data }) => (
            <text>
            <b><big>{indexValue}</big></b>
            <br/> <br/>
            {['Family Size']} : {data.family}
        <br/>
            Median Income by Family Size: ${value}
        </text>
        )}
            />
            </div>
        )
        }



    }


    static defaultProps = {
        year: ['2015'],
        censusKey: [],
        geoid: [],
        familyIncome: false
    }

}


const mapDispatchToProps = { };

const mapStateToProps = (state,ownProps) => {
    return {
        geoid:ownProps.geoid,
        censusKey:ownProps.censusKey,
        graph: state.graph // so componentWillReceiveProps will get called.
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CensusBarChart))
