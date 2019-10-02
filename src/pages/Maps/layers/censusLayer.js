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
/*
Note: for the county 36039-
    The measure Median Age by sex (B01002) doesn`t work
    for the blockgroup (index = 33) as one of the submeasures is negative
    and the step expression needs the values to be in ascending order as range

    counties | Blockgroups length
   - 36001   | 235
   - 36083   | 125
   - 36093   | 138
   - 36091   | 139
   - 36039   | 43
   - 36021   | 61
   - 36115   | 46
   - 36113   | 47

 */
const counties = ['36001','36083','36093','36091','36039','36021','36115','36113'];
const requests = [],
    num = 50;
let censusConfig = {}
class CensusLayer extends MapLayer{
    onAdd(map){
        super.onAdd(map)
        let blockGroups = [];
        return falcorGraph.get(['geo',counties,'blockgroup'],['acs','config'])
            .then(res => {
                Object.values(res.json.geo).forEach(function(item){
                     if (item.blockgroup !== undefined){
                         blockGroups.push(item.blockgroup)
                     }
            })
            this.censusBlockGroups = blockGroups.flat(1)
            Object.keys(res.json.acs.config).forEach(function(cenKey,i) {
                if (cenKey === 'B01003' || cenKey === 'B02001' || cenKey === 'B19057' || cenKey === 'B23025') {
                    censusConfig[cenKey] = res.json.acs.config[cenKey];
                }
            })
            this.filters.measures.domain = Object.keys(censusConfig).map(function(key){
                return {name: censusConfig[key].name,value:key}
            })
            this.acsConfig = censusConfig
            map.setFilter('density_layer',['in','GEOID',...this.censusBlockGroups]);
            map.setFilter('bg_layer',['in','GEOID',...this.censusBlockGroups]);
            return this.fetchData().then(data => this.receiveData(map, data))
            })

    }

    fetchData(){
        const requests = [],
            num = 150;
        for (let i = 0; i < this.censusBlockGroups.length; i += num) {
            requests.push(this.censusBlockGroups.slice(i, i + num))
        }
        let census_route = [];
        let census_config = this.acsConfig;
        let census_topvar = this.filters.measures.value;
        Object.keys(this.acsConfig).forEach(function(census_var,i){
            if(census_topvar === census_var){
                census_config[census_var].variables.forEach(function(census_subvar,i){
                    census_route.push(census_subvar.value)
                })
            }
        })
        return requests.reduce((a, c) => a.then(() => falcorGraph.get(['acs', c, [this.filters.year.value], [...census_route]])), Promise.resolve())

    }

    receiveData(map,result){
        this.fetchData().then(res=>{
            let subvars = [];
            let paintInfo = [];
            let year = this.filters.year.value;
            let measure = this.filters.measures.value;
            let graph = falcorGraph.getCache();
            Object.values(graph).forEach(function(value,i){
                Object.values(value).forEach(function(geoval,i){
                    if (geoval[year] !== undefined){
                        Object.keys(geoval[year]).forEach(function(acsvar,i){
                            if (acsvar.slice(0,-5) === measure){
                                subvars.push(acsvar)
                            }
                        })
                    }
                })

            })

            subvars = subvars.filter(function(elem, index, self) {
                return index === self.indexOf(elem);
            })
            let config = this.acsConfig
            let legend_domain = []
            let colors = ['#8dd3c7']
            //------------------- If there is only one sub variable----------------------------------------
            if (subvars.length === 1){
            let subvarColors = 'rgba(0,0,0,0)';
            paintInfo =[
                "match",
                ["get", "GEOID"]];
            Object.values(config[subvars[0].slice(0,-5)]).forEach(function(item,index) {
                if(index === 1){
                    item.forEach(function(value){
                        legend_domain.push(value.name)
                    })
                }
            });
            this.censusBlockGroups.forEach((blockGroup,index) => {
                let subVariable = graph.acs[blockGroup][this.filters.year.value];
            let stepper = [["step",
                ["get", "i"],
                '#8dd3c7']];
            let sum = 0;
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
        })
            paintInfo.push("rgba(0,0,0,0)");
            this.legend.range = colors;
            this.legend.domain = legend_domain;
            map.setPaintProperty('density_layer', 'circle-color', paintInfo)


        }
        //---------------------If there are multiple subvariables------------------------------------
            else{
                    subvars.shift()
                    let subvarColors = ColorRanges[subvars.length+1].filter(d => d.name === 'Set3')[0].colors
                    let trans_color = '#ffffff'
                    let paintInfo =[
                        "match",
                        ["get", "GEOID"]];
                    Object.values(config[subvars[0].slice(0,-5)]).forEach(function(item,index) {
                        if(index === 1){
                            item.forEach(function(value,i){
                                if (i>0){
                                    legend_domain.push(value.name)
                                }

                            })
                        }
                    })
                    this.censusBlockGroups.forEach((blockGroup,index) => {
                        //if(index === 33){
                        let subVariable = graph.acs[blockGroup][this.filters.year.value]
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
                                        paintInfo.push([blockGroup])
                                        paintInfo.push(...stepper)
                                    }
                                    //}
                    })
                    paintInfo.push("rgba(0,0,0,0)");
                    let paintInfo_str = JSON.stringify(paintInfo)
                    colors.forEach(function(color,index){
                        if (!paintInfo_str.includes(color)){
                            colors.splice(index,1)
                        }
                    })
                    this.legend.range = colors;
                    this.legend.domain = legend_domain;
                    map.setPaintProperty('density_layer', 'circle-color', paintInfo)
                    }
        })


    }


}

export default (options = {}) => new CensusLayer("Census Layer", {
        ...options,
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
                    'circle-color': 'rgb(171, 72, 33)'
                }
            },
            {
                'id':'bg_layer',
                  'source' : 'block_groups',
                  'source-layer' : 'tl_2017_36_bg',
                  'type' : 'fill',
                  'paint' : {
                       'fill-color': 'rgba(255,255,255, 0.05)',

                  }
            }
        ],
        popover: {
                layers: ['bg_layer'],
                vertical: true,
                dataFunc: function(feature) {
                    if (this.filters.measures.value !== 'B01003'){
                        const graph = falcorGraph.getCache().acs[feature.properties.GEOID];
                        let measure = this.filters.measures.value
                        const acs_config = falcorGraph.getCache().acs['config'];
                        try{
                            let subVar_values ={}
                            let subVarNames = []
                            let subVarValues = []
                            let popoverData = []
                            Object.values(graph).forEach(function(item){
                                Object.keys(item).forEach(function(acsVar){
                                    if(acsVar.slice(0,-5) === measure){
                                        subVar_values = item[acsVar]
                                        acs_config.value[acsVar.slice(0,-5)].variables.forEach(function(subvar,i){
                                            if (i> 0){
                                                subVarNames.push(subvar.name)
                                                subVarValues.push(subVar_values)
                                            }

                                        })
                                    }
                                })
                            })
                            subVarNames = subVarNames.filter(function(elem, index, self) {
                                return index === self.indexOf(elem);
                            })
                            subVarValues = subVarValues.filter(function(elem, index, self) {
                                return index === self.indexOf(elem);
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
                    }else{
                        const graph = falcorGraph.getCache().acs[feature.properties.GEOID];
                        let measure = this.filters.measures.value
                        const acs_config = falcorGraph.getCache().acs['config'];
                        try{
                            let subVar_values ={}
                            let subVarNames = []
                            let subVarValues = []
                            let popoverData = []
                            Object.values(graph).forEach(function(item){
                                Object.keys(item).forEach(function(acsVar){
                                    if(acsVar.slice(0,-5) === measure){
                                        subVar_values = item[acsVar]
                                        acs_config.value[acsVar.slice(0,-5)].variables.forEach(function(subvar,i){
                                                subVarNames.push(subvar.name)
                                                subVarValues.push(subVar_values)

                                        })
                                    }
                                })
                            })
                            subVarNames = subVarNames.filter(function(elem, index, self) {
                                return index === self.indexOf(elem);
                            })
                            subVarValues = subVarValues.filter(function(elem, index, self) {
                                return index === self.indexOf(elem);
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

            }
        },
        legend:{
            type: "ordinal",
            types: ["ordinal"],
            title: "Census Legend",
            active: true,
            vertical: true,
            range: ['#8dd3c7'],
            domain: ['Overall Population']
        },
        filters: {

            year: {
                name: 'year',
                type: 'dropdown',
                domain: [2017,2016,2015,2014], // not yet working for 2014,2015
                value: 2017
            },
            measures: {
                name: "measures",
                type: "dropdown",
                domain: [],
                value: "B01003",
            }
        }

})
