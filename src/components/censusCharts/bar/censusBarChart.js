import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import {falcorGraph} from "store/falcorGraph";
import BarChart from "components/charts/bar/simple"
import { ResponsiveBar } from '@nivo/bar'
import {Bar} from '@nivo/bar'
import { Line } from '@nivo/line'
import {ResponsiveLine} from '@nivo/line'
var numeral = require('numeral')

class CensusBarChart extends React.Component {
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


    componentWillMount()
    {
        this.languageData().then(res =>{
            this.setState({
                graphData2 : res
            })
        })

    }


    languageData(){
        return new Promise((resolve,reject) => {
            this.fetchFalcorDeps().then(response => {
                let geoid = this.props.geoids;
        let langData_vw = []; //Speak English very well
        let langData_nvw = [];// Speak English less than very well
        let langData = [];
        let responseData_language = {};
        let cenKey_language = 'B16001';
        let censusConfig = {};
        let year = 2015
        Object.values(response.json).forEach(function(value,i){
            censusConfig = value['config']
            Object.values(value).forEach(function(val,i){
                if ( i === 0){
                    responseData_language = val[year]
                }
            })
        })
        Object.keys(responseData_language).forEach(function(language,i){
            if (language.slice(0,-5) === cenKey_language){
                Object.keys(censusConfig).forEach(function(config,i){
                    if (language.slice(0,-5) === config){
                        Object.values(censusConfig[config].variables).forEach(function(subvar,i){
                            if (language === subvar.value){
                                if(subvar.name.includes('Speak English very well')){
                                    langData_vw.push({
                                        "language":subvar.name.split('Speak')[0],
                                        "Speakers":responseData_language[language]
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
                    }
                })
            }

        })

        let subvarColors = ['#C01616','#091860','#E0E540','#C15E0A','#074F28','#564B8E','#287F2C','#1AA3CB','#790576',
            '#F7C9B9','#F4F3AF' , '#C2ECF3','#F4AD4D','#2AF70E','#D8AFE7','#88DE73' ,'#718CD1','#EA6A7D',
            '#C01616','#091860','#E0E540','#C15E0A','#074F28','#564B8E','#287F2C'
        ]
        Object.values(langData_nvw).forEach(function(nvw,i){
            //if (i < 2){
            if(nvw.language === langData_vw[i].language){
                langData.push({
                    "language" : nvw.language,
                    "Speakers" : parseFloat(nvw.Speakers) + parseFloat(langData_vw[i].Speakers),
                    "Percent" : parseFloat((parseFloat(nvw.Speakers) / (parseFloat(langData_vw[i].Speakers) + parseFloat(nvw.Speakers)) * 100).toFixed(2)),
                    "language_color" : subvarColors[i]
                })
            }
            //}

        })
        langData.sort(function(a,b){
            var a1 = parseFloat(a.Percent)
            var b1 = parseFloat(b.Percent)
            return b1 - a1
        })
        resolve(langData)
    })
    })

    }

    render () {
        if(Object.values(this.props.censusKey).includes('B16001') && Object.values(this.props.geoid).includes('36001')){
            return(
                <div>
                <Bar
            data={this.state.graphData2}
            width={900}
            height={500}
            indexBy="language"
            keys = {["Percent"]}
            margin={{
                "top": 100,
                    "right": 130,
                    "bottom": 170,
                    "left": 60
            }}
            padding={0.3}
            colors = 'set3'
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
                    "legendPosition": "center",
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

            markers={[
                    {
                        axis: 'x',
                        value: 0,
                        legend: 'Language',
                        legendPosition: 'top-left',
                        legendOrientation: 'horizontal',
                        legendOffsetX: 100,
                        legendOffsetY: 20,
                    }
                    ]}
            theme={{
                "tooltip": {
                    "container": {
                        "fontSize": "13px"
                    }
                },
                "labels": {
                    "textColor": "#555"
                }
            }}
            />
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
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CensusBarChart))
