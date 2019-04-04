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
            value: 2014
        }
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    fetchFalcorDeps() {
        let year = [2010,2011,2012,2013,2014,2015,2016]
        //return this.props.censusKey.reduce((a, c) => a.then(() => falcorGraph.get(['acs',[...this.props.geoids,...this.props.compareGeoid],year,c],['acs','config'])), Promise.resolve())
        return this.props.censusKey.reduce((a,c) => a.then(() => falcorGraph.get(['acs',[...this.props.geoids,...this.props.compareGeoid],year,c],['acs','config'])),Promise.resolve())
    }

    componentDidUpdate(){
        if(this.state.value !== 2014){
            this.fetchFalcorDeps().then(response => this.transformData(response))
        }

    }

    lineData(data){
        console.log('in lineData')
        data = this.props.falcor.getCache()
        console.log('response',data)
        let response_lineData = []
        let response_data = {}
        let geoid = this.props.geoids
        let years = []
        let cenKey_income = this.props.censusKey[0]
        let lineData = []
        let censusConfig = {}
        let axis_data = []
        Object.values(data).forEach(function(value,i){
            response_data = value[geoid]
            years.push(...Object.keys(value[geoid]))
            censusConfig = value['config'].value

        })
        Object.values(response_data).forEach(function(response,i){
            response_lineData.push(response[cenKey_income])
        })
        response_lineData.forEach(function(value,index){
            Object.keys(censusConfig).forEach(function(config,i){
                Object.values(censusConfig[config].variables).forEach(function(subvar,i){
                    if (Object.keys(value.value).toString() === subvar.value){
                        axis_data.push({
                            "x" : years[index],
                            "y" : parseInt(value.value[subvar.value])
                        })
                    }

                })
            })

        })
        lineData.push({
            "id": 'years',
            "color": "hsl(157, 70%, 50%)",
            "data" : axis_data
        })
        console.log('lineData',lineData)
        return lineData

    }

    compareData(data) {
        console.log('in compareData')
        data = this.props.falcor.getCache()
        console.log('response',data)
        let response_countyData = {}
        let response_stateData = {}
        let year = 2014
        let cenKey_parent = this.props.censusKey[1]
        let stateData =[]
        let countyData =[]
        let censusConfig ={}
        let compareData = []
        Object.values(data).forEach(function(value,i){
            // for the state of NY
            if (value['36'][year][cenKey_parent] !== undefined){
                response_stateData = value['36'][year][cenKey_parent].value
            }

            if (value['36001'][year][cenKey_parent] !== undefined){
                response_countyData = value['36001'][year][cenKey_parent].value
            }
            if (value['config'] !== undefined){
                censusConfig = value['config'].value
            }
        })
        Object.keys(response_stateData).forEach(function(stData,i){
            Object.keys(censusConfig).forEach(function(config,i){
                if (stData.slice(0,-5) === config){
                    Object.values(censusConfig[config].variables).forEach(function(subvar,i){
                        if (stData === subvar.value){
                            if (subvar.name.includes("Total")){
                                stateData.push({
                                    "Total" : response_stateData[stData]
                                })
                            }
                            if(subvar.name.includes("Living with two parent")){
                                stateData.push({
                                    "Living with 2 Parents" : response_stateData[stData]
                                })
                            }
                            if(subvar.name.includes("Living with mother")){
                                stateData.push({
                                    "Living with mother" : response_stateData[stData]
                                })
                            }
                            if (subvar.name.includes("Living with father")){
                                stateData.push({
                                    "Living with father" : response_stateData[stData]
                                })
                            }
                        }
                    })
                }
            })
        })


        var obj1 ={}
        stateData.forEach(function(each_val,i){
            if (obj1[Object.keys(each_val)]){
                obj1[Object.keys(each_val)] += parseFloat(Object.values(each_val));
            }else{
                obj1[Object.keys(each_val)] = parseFloat(Object.values(each_val));
            }
        })

        Object.keys(response_countyData).forEach(function(ctData,i){
            Object.keys(censusConfig).forEach(function(config,i){
                if (ctData.slice(0,-5) === config){
                    Object.values(censusConfig[config].variables).forEach(function(subvar,i){
                        if (ctData === subvar.value){
                            if (subvar.name.includes("Total")){
                                countyData.push({
                                    "Total" : response_countyData[ctData]
                                })
                            }
                            if(subvar.name.includes("Living with two parent")){
                                countyData.push({
                                    "Living with 2 Parents" : response_countyData[ctData]
                                })
                            }
                            if(subvar.name.includes("Living with mother")){
                                countyData.push({
                                    "Living with mother" : response_countyData[ctData]
                                })
                            }
                            if (subvar.name.includes("Living with father")){
                                countyData.push({
                                    "Living with father" : response_countyData[ctData]
                                })
                            }
                        }
                    })
                }
            })
        })
        var obj2 ={}
        countyData.forEach(function(each_val,i){
            if (obj2[Object.keys(each_val)]){
                obj2[Object.keys(each_val)] += parseFloat(Object.values(each_val));
            }else{
                obj2[Object.keys(each_val)] = parseFloat(Object.values(each_val));
            }
        })

        var obj1_percent =[] // state
        obj1_percent.push({
            "Total Living with two parents" : (parseFloat(obj1[Object.keys(obj1)[1]])),
            "Living with two parents": ((parseFloat(obj1[Object.keys(obj1)[1]])/parseFloat(obj1[Object.keys(obj1)[0]]) * 100).toFixed(2)),
            "Total Living with father": (parseFloat(obj1[Object.keys(obj1)[2]])),
            "Living with father" : ((parseFloat(obj1[Object.keys(obj1)[2]])/parseFloat(obj1[Object.keys(obj1)[0]]) * 100).toFixed(2)),
            "Total Living with mother": (parseFloat(obj1[Object.keys(obj1)[3]])),
            "Living with mother" : ((parseFloat(obj1[Object.keys(obj1)[3]])/parseFloat(obj1[Object.keys(obj1)[0]]) * 100).toFixed(2)),
        })

        var obj2_percent = [] // county
        obj2_percent.push({
            "Total Living with two parents": (parseFloat(obj2[Object.keys(obj2)[1]])),
            "Living with two parents" : ((parseFloat(obj2[Object.keys(obj2)[1]])/parseFloat(obj2[Object.keys(obj2)[0]]) * 100).toFixed(2)),
            "Total Living with father": (parseFloat(obj2[Object.keys(obj2)[2]])),
            "Living with father" : ((parseFloat(obj2[Object.keys(obj2)[2]])/parseFloat(obj2[Object.keys(obj2)[0]]) * 100).toFixed(2)),
            "Total Living with mother" : (parseFloat(obj2[Object.keys(obj2)[3]])),
            "Living with mother" : ((parseFloat(obj2[Object.keys(obj2)[3]])/parseFloat(obj2[Object.keys(obj2)[0]]) * 100).toFixed(2))
        })

        Object.values(obj1_percent).forEach(function(obj1,i){
                compareData.push({
                    "Category" : Object.keys(obj1)[1],
                    "Two Parents in Albany County" :  numeral(parseFloat(Object.values(obj1)[0])).format('0.00a'),
                    "Albany county" : Object.values(obj1)[1],
                    "countyColor" : '#DAF7A6',
                    "Two Parents in New York State": numeral(parseFloat(Object.values(obj2_percent[i])[0])).format('0.00a'),
                    "New York state" : Object.values(obj2_percent[i])[1],
                    "stateColor" : '#FFC300'
                },
                {
                    "Category": Object.keys(obj1)[3],
                    "One Parent(father) in Albany County" : numeral(parseFloat(Object.values(obj1)[2])).format('0.0a'),
                    "Albany county": Object.values(obj1)[3],
                    "countyColor": '#FF5733',
                    "One Parent(father) in New York State" : numeral(parseFloat(Object.values(obj2_percent[i])[2])).format('0.0a'),
                    "New York state": Object.values(obj2_percent[i])[3],
                    "stateColor" : '#C70039'
                },
                {
                    "Category": Object.keys(obj1)[5],
                    "One Parent(mother) in Albany County": numeral(parseFloat(Object.values(obj1)[4])).format('0.0a'),
                    "Albany county": Object.values(obj1)[5],
                    "countyColor": '#00A01B',
                    "One Parent(mother) in New York State": numeral(parseFloat(Object.values(obj2_percent[i])[4])).format('0.0a'),
                    "New York state": Object.values(obj2_percent[i])[5],
                    "stateColor": '#0091A0'
                }
                )
        })
        return compareData
    }

    languageData(response){
        response = this.props.falcor.getCache()
        let geoid = this.props.geoids
        let langData_vw = [] //Speak English very well
        let langData_nvw = []// Speak English less than very well
        let langData = []
        let responseData_language = {}
        let cenKey_language = this.props.censusKey[1]
        let censusConfig = {}
        Object.values(response).forEach(function(value,i){
            censusConfig = value['config'].value
            Object.keys(value[geoid]['2014']).forEach(function(each_key,i){
                if (each_key === cenKey_language){
                    responseData_language = value[geoid]['2014'][each_key].value

                }
            })
        })

        Object.keys(responseData_language).forEach(function(language,i){
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
        return langData
    }

    transformData(response) {
        console.log('in transform data')
        let year = parseFloat(this.state.value)
        response = this.props.falcor.getCache()
        console.log('response',response)
        let geoid = this.props.geoids
        let cenKey_age = this.props.censusKey[0]
        let censusConfig = {}
        let responseData_age = {}
        let axisData_m = []
        let axisData_f =[]
        let axisData =[]
        let stackData_m = []
        let stackData_f = []
        let stackData = []

        let obj ={}
        if (year === 2014){
            Object.values(response).forEach(function(value,i){
                responseData_age = value[geoid][year][cenKey_age].value
                censusConfig = value['config'].value
            })
        }

        if (year === 2010){
            if (response.acs[geoid]['2010'] !== undefined){
                responseData_age = response.acs[geoid][year][cenKey_age].value
                censusConfig = response.acs['config'].value
            }

        }

        if (year === 2011){
            if (response.acs[geoid]['2011'] !== undefined){
                responseData_age = response.acs[geoid][year][cenKey_age].value
                censusConfig = response.acs['config'].value
            }

        }

        if (year === 2012){
            if (response.acs[geoid]['2012'] !== undefined){
                responseData_age = response.acs[geoid][year][cenKey_age].value
                censusConfig = response.acs['config'].value
            }

        }

        if (year === 2013){
            if (response.acs[geoid]['2013'] !== undefined){
                responseData_age = response.acs[geoid][year][cenKey_age].value
                censusConfig = response.acs['config'].value
            }

        }

        if (year === 2015){
            if (response.acs[geoid]['2015'] !== undefined){
                responseData_age = response.acs[geoid][year][cenKey_age].value
                censusConfig = response.acs['config'].value
            }

        }
        if (year === 2016){
            if (response.acs[geoid]['2016'] !== undefined){
                responseData_age = response.acs[geoid][year][cenKey_age].value
                censusConfig = response.acs['config'].value
            }

        }
        /*
        if (year === 2017){
            if (response.acs[geoid]['2017'] !== undefined){
                responseData_age = response.acs[geoid][year][cenKey].value
                censusConfig = response.acs['config'].value
            }

        }
         */
        //----------------------------- For the age by population graph -----------------------------
        Object.keys(responseData_age).forEach(function(res,index){
            if (index > 1 && index !== 25){
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
            })
        Object.values(axisData_f).forEach(function(axis_f,i){
            obj = {...axisData_m[i],...axis_f}
            axisData.push(obj)
        })

        Object.values(stackData_f).forEach(function(stack_f,i){
            obj = {...stackData_m[i],...stack_f}
            stackData.push(obj)
        })

        return [axisData,stackData]
    }


    render () {
        console.log('in render')
        this.lineData(this.props.graph.acs)
        if (this.props.compareGeoid.length === 0){
            let graphData2 = this.transformData(this.props.graph.acs)[1]
            let graphData3 = this.languageData(this.props.graph.acs)
            return(
                <div>
                <Bar
            data={graphData2}
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
            min='2010' max='2016'
            value={this.state.value}
            onChange={this.handleChange}
            step="1"
                />
                </label>


            <Bar
            data={graphData3}
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
            legends={[
                    {
                        "effects": [
                            {
                                "on": "hover",
                                "style": {
                                    "itemOpacity": 1
                                }
                            }
                        ]
                    }
                    ]}
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

        );
        }
        else{
            let graphData4 = this.compareData(this.props.graph.acs)
            let graphData5 = this.lineData(this.props.graph.acs)
            console.log('graphData5',graphData5)
            return(
            <div>
            <Bar
            data={graphData4}
            width={900}
            height={500}
            indexBy="Category"
            keys = {["Albany county","New York state"]}
            margin={{
                "top": 100,
                    "right": 130,
                    "bottom": 170,
                    "left": 60
            }}
            padding={0.1}
            groupMode="grouped"
            colors = 'nivo'
            colorBy = "id"
            layout = "vertical"
            borderColor="inherit:darker(1.6)"
            enableGridX = {true}
            enableGridY={true}
            axisBottom={{
                "orient": "bottom",
                    "tickSize": 5,
                    "tickPadding": 5,
                    "tickRotation": 0,
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
                    "legend" : "Percentage of Population",
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
            markers={[
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
            tooltip={({ id, indexValue, value, color,data }) => (
            <text>
            <b><big>{indexValue}</big></b>
            <br/> <br/>
            {id} :{(id.includes('Albany county')) ? Object.values(data)[4] : Object.values(data)[1]}, {value}%
            </text>
            )}
            />
            <Line
            data={graphData5}
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
            <b><big>Albany County</big></b>
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
        }
    static defaultProps = {
        censusKey: ['B19013','B23008'], //'B01001','B16001',
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

/*

change the cenKey_parent in compareData if you include censusKey as attribute in index
 */