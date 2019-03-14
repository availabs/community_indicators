import React from "react"

import {
    ArrowDown,
    ArrowRight
} from "components/common/icons"

import {
    scaleQuantile,
    scaleOrdinal,
    scaleQuantize
} from "d3-scale"
import MapLayer from "AvlMap/MapLayer"
import {falcorGraph} from "store/falcorGraph";
import ColorRanges from 'constants/color-ranges'

const counties = ['36001','36083','36093','36091','36039','36021','36115','36113'];
const year = [2016,2017,2018];
let blockGroups = []
class CensusLayer extends MapLayer{
    onAdd(map){
        console.log('in add')
        super.onAdd(map)
        this.loading = true;
        return falcorGraph.get(['geo',['36001','36083','36093','36091'],'blockgroup'],['acs','config'])
            .then(res => {
                Object.values(res.json.geo).forEach(function(item){
                     if (item.blockgroup !== undefined){
                         blockGroups.push(item.blockgroup)
                     }
            })
            this.censusBlockGroups = blockGroups.flat(1)
            let censusConfig = res.json.acs.config
            this.filters.measures.domain = Object.keys(censusConfig).map(function(key){
                return {name: censusConfig[key].name,value:key}
            })
            this.acsConfig = censusConfig
            map.setFilter('density_layer',['in','GEOID',...this.censusBlockGroups])
            map.setFilter('bg_layer',['in','GEOID',...this.censusBlockGroups])
            return this.fetchData().then(data => this.receiveData(map, data))
            })

    }

    fetchData(){
        console.log('in fetch')
        return falcorGraph.get(['acs',this.censusBlockGroups,[this.filters.year.value],[this.filters.measures.value]])
            .then(data => {
                return data
            })

    }

    receiveData(map,data){
        console.log('in receive data')
        let graph = data.json.acs,
            domain = [];
        let config = this.acsConfig
        let legend_domain = []
        let colors = ['#8dd3c7']
        let subvars = Object.keys(graph[this.censusBlockGroups[0]][this.filters.year.value][this.filters.measures.value])
        //------------------- If there is only one sub variable----------------------------------------
        if (subvars.length === 1){
            let subvarColors = 'rgba(0,0,0,0)'
            let paintInfo =[
                "match",
                ["get", "GEOID"]]
            Object.values(config[subvars[0].slice(0,-5)]).forEach(function(item,index) {
                if(index === 1){
                    item.forEach(function(value){
                        legend_domain.push(value.name)
                    })
                }
            })
            this.censusBlockGroups.forEach((blockGroup,index) => {
                //if(index < 100){
                let subVariable = graph[blockGroup][this.filters.year.value][this.filters.measures.value]
                console.log('subVariable', subVariable)
                let stepper = [["step",
                    ["get", "i"],
                    '#8dd3c7']]
                let sum = 0
                subvars.forEach(function(subvar, i) {
                    let value = parseFloat(subVariable[subvar])
                    if(value !== 0){
                        stepper[0].push(
                            sum += value,
                            subvarColors
                        )
                    }
                })
                paintInfo.push([blockGroup])
                paintInfo.push(...stepper)
            //}
            })
            paintInfo.push("rgba(0,0,0,0)")
            this.legend.range = colors;
            this.legend.domain = legend_domain;
            console.log('paintInfo',JSON.stringify(paintInfo))
            //console.log('legend.domain',this.legend.domain)
            //console.log('legend.range', this.legend.range)
            map.setPaintProperty('density_layer', 'circle-color', paintInfo)
        }
        //---------------------If there are multiple subvariables------------------------------------
        else{
            //console.log('subvars',subvars)
            let subvarColors = ColorRanges[subvars.length+1].filter(d => d.name === 'Set3')[0].colors
            let trans_color = '#ffffff'
            let paintInfo =[
                "match",
                ["get", "GEOID"]]
            Object.values(config[subvars[0].slice(0,-5)]).forEach(function(item,index) {
                if(index === 1){
                    item.forEach(function(value){
                        legend_domain.push(value.name)
                    })
                }
            })
            this.censusBlockGroups.forEach((blockGroup,index) => {
                //if(index < 100){
                let subVariable = graph[blockGroup][this.filters.year.value][this.filters.measures.value]
                console.log('subVariable', subVariable)
                let stepper = [["step",
                    ["get", "i"],
                    subvarColors[0]]]

                let sum = 0
                subvars.forEach(function(subvar, i) {
                let value = parseFloat(subVariable[subvar])
                    if(value !== 0){
                        stepper[0].push(
                            sum += value,
                            subvarColors[i+1]
                        )
                        if (colors.indexOf(subvarColors[i+1]) === -1){
                            colors.push(subvarColors[i+1])
                        }
                    }
                })
                if (sum !== 0){
                    Object.values(stepper).forEach(function(step) {
                        step.splice(step.length-1,1,trans_color)
                    })
                    paintInfo.push([blockGroup])
                    paintInfo.push(...stepper)
                }
                else{
                    stepper[0].push(0,'#ffffff')
                    console.log('stepper',stepper)
                    paintInfo.push([blockGroup])
                    paintInfo.push(...stepper)
                }
            //}
            })
            paintInfo.push("rgba(0,0,0,0)")
            let paintInfo_str = JSON.stringify(paintInfo)
            colors.forEach(function(color,index){
                if (!paintInfo_str.includes(color)){
                    colors.splice(index,1)
                }
            })
            this.legend.range = colors;
            this.legend.domain = legend_domain;
            console.log('paintInfo',JSON.stringify(paintInfo))
            //console.log('legend.domain',this.legend.domain)
            //console.log('legend.range', this.legend.range)
            map.setPaintProperty('density_layer', 'circle-color', paintInfo)
        }

    }

}

const censusLayer = new CensusLayer("Census Layer", {
        active: true,
        loading: true,
        sources: [
            { id: "dot_density",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.a7icspqd'
                }
            },
            {
                id: "block_groups",
                source:{
                    'type':"vector",
                    'url': 'mapbox://am3081.02eswc9t'
                }
            }

        ],
        layers: [
            { 'id': 'density_layer',
                'source': 'dot_density',
                'source-layer': 'ny_whole',
                'type': 'circle',
                'paint': {
                    'circle-radius':[
                        "interpolate",
                        ["linear"],
                        ["zoom"],
                        0,
                        1,
                        14,
                        1.5,
                        22,
                        2
                    ],
                    'circle-opacity': 0.8,
                    'circle-color': ['string', '#bab']
                }
            },
            {
                'id':'bg_layer',
                  'source' : 'block_groups',
                  'source-layer' : 'tl_2017_36_bg',
                  'type' : 'fill',
                  'paint' : {
                       'fill-color': 'rgba(196, 0, 0, 0.1)',

                  }
            }
        ],
        popover: {
                layers: ['bg_layer'],
                vertical: true,
                dataFunc: feature => {
            const graph = falcorGraph.getCache().acs[feature.properties.GEOID];
            let measure = censusLayer.filters.measures.value
            const acs_config = falcorGraph.getCache().acs['config'];
            try{
                let subVar_values ={}
                let subVarNames = []
                let subVarValues = []
                let popoverData = []
                Object.values(graph).forEach(function(item){
                    Object.keys(item).forEach(function(acsVar){
                        if(acsVar === measure){
                            subVar_values = item[acsVar].value
                            acs_config.value[acsVar].variables.forEach(function(subvar){
                                subVarNames.push([subvar.name])
                                subVarValues.push([subVar_values[subvar.value]])
                            })
                        }

                    })
                })
                popoverData = [feature.properties.GEOID]
                subVarNames.forEach(function(name,i){
                    popoverData.push([name,subVarValues[i]])
                })
                return popoverData
            }
            catch (e){
                return []
            }
            }
        },
        legend:{
            type: "ordinal",
            types: ["ordinal"],
            title: "Census Legend",
            active: true,
            vertical: true,
            range: ['#8dd3c7'],
            domain: ['A']
        },
        filters: {

            year: {
                name: 'year',
                type: 'dropdown',
                domain: [2014, 2015, 2016, 2017],
                value: 2014
            },
            measures: {
                name: "measures",
                type: "dropdown",
                domain: [],
                value: "B01003",
            }
        }

})


export default censusLayer;