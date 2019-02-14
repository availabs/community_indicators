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

import COLOR_RANGES from "constants/color-ranges"
import {falcorGraph} from "store/falcorGraph";
import MapLayer from "AvlMap/MapLayer"
// const QUANTILE_RANGE = COLOR_RANGES[5].reduce((a, c) => c.name === "RdYlBu" ? c.colors : a)
const QUANTILE_RANGE = COLOR_RANGES[5].reduce((a, c) => c.name === "Spectral" ? c.colors : a)
const NON_ORDINAL_LEGEND = {
    type: "quantile",
    types: ["quantile", "quantize"],
    //format: getMeasureFormat.bind(null, "full_marke"),
    vertical: false,
    range: QUANTILE_RANGE
}
const counties = ['36001','36083','36093','36091','36039','36021','36115','36113'];
const year = [2014,2015,2016,2017,2018];
let countyCousubs =[]
let countyTracts =[]
let acsCensusCousubs =[]
let acsCensusTracts =[]
class acsLayer extends MapLayer{


    onAdd(map) {
        super.onAdd(map)
        this.loading = true;
        return falcorGraph.get(['acs', 'config'])
            .then(res => {
                let censusConfig = res.json.acs.config
                this.filters.measures.domain = Object.keys(censusConfig).map(function(key){
                    return {name: censusConfig[key].name,value:key}

                })
                this.filters.submeasure.domain = censusConfig[this.filters.measures.value]
                    .variables.map(function(subvar){
                        return {name: subvar.name,value:subvar.value}
                    })


                this.acsConfig = censusConfig
                this.filters.geolevel.domain = ['counties','cousubs','tracts']
                //console.log('I get here')
                return this.fetchData()
                    .then(data => this.receiveData(map, data))
                    .then(() => this.loading = false)
            })

    }

    fetchData(){
        console.log('fetch data')
        return falcorGraph.get(
            ['acs',counties,[this.filters.year.value],[this.filters.measures.value]],
            ['geo',counties,[this.filters.geolevel.value]]
        ).then(data => {
            console.log('first data', data)
            if (this.filters.geolevel.value === 'counties') {
                console.log('gonna return data')
                return data
            }

        else if (this.filters.geolevel.value === 'cousubs') {
            Object.values(data.json.geo).forEach(function (acsGeoLevel) {
                countyCousubs.push(acsGeoLevel.cousubs)

            })
            acsCensusCousubs = countyCousubs.flat(1)
        }

        else{
            Object.values(data.json.geo).forEach(function(acsGeoLevel){
                countyTracts.push(acsGeoLevel.tracts)

            })
            acsCensusTracts = countyTracts.flat(1)
        }

        if(this.filters.geolevel.value === 'cousubs'){
            return falcorGraph.get(
                ['acs', acsCensusCousubs, [this.filters.year.value], [this.filters.measures.value]]
            ).then(res => {
            return res
        })
        }

        if (this.filters.geolevel.value === 'tracts') {
            return falcorGraph.get(
                ['acs', acsCensusTracts, [this.filters.year.value], [this.filters.measures.value]]
            ).then(res => {
                return res
            })
        }
        })
        }


    receiveData(map,data){
        console.log('recieve data called', data)
        const geolevel = this.filters.geolevel.value;
        let graph = data.json.acs,

        values = {},
        colors = {},

        domain = [];
        let min = Infinity,
        max = -Infinity,

        scale;
        if(geolevel === 'counties'){
            counties.forEach(geoid => {
                let acsVar = graph[geoid][this.filters.year.value][this.filters.measures.value]
                let subVar = [this.filters.submeasure.value]
                let value = acsVar[subVar]
                domain.push(value);
            values[geoid] = value

            min = Math.min(min, value);

            max = Math.max(max, value);
        })
            map.setFilter('counties',['in','geoid',...counties])
            map.setFilter('cousubs',['in','geoid', ''])
            map.setFilter('tracts',['in','geoid', ''])
        }

        if(geolevel === 'cousubs'){
            acsCensusCousubs.forEach(cousub => {
                if (cousub !== undefined){
                let acsVar = graph[cousub][this.filters.year.value][this.filters.measures.value]
                let subVar = [this.filters.submeasure.value]
                let value = acsVar[subVar]
                domain.push(value);
                values[cousub] = value

                min = Math.min(min, value);

                max = Math.max(max, value);
            }
        })
            map.setFilter('cousubs',['in','geoid',...acsCensusCousubs.filter(d => d)])
            map.setFilter('counties',['in','geoid', ''])
            map.setFilter('tracts',['in','geoid', ''])
        }
        if (geolevel === 'tracts'){
            acsCensusTracts.forEach(tract => {
                if (tract !== undefined){
                let acsVar = graph[tract][this.filters.year.value][this.filters.measures.value]
                let subVar = [this.filters.submeasure.value]
                let value = acsVar[subVar]
                domain.push(value);
                values[tract] = value

                min = Math.min(min, value);

                max = Math.max(max, value);
            }
        })
            map.setFilter('tracts',['in','geoid',...acsCensusTracts.filter(d => d)])
            map.setFilter('cousubs',['in','geoid', ''])
            map.setFilter('counties',['in','geoid', ''])

        }
        const type = this.legend.type,
            range = this.legend.range;
        switch (type) {
            case "quantile":
                scale = scaleQuantile()
                    .domain(domain)
                    .range(range);
                this.legend.domain = domain;
                break;
            case "quantize":
                scale = scaleQuantize()
                    .domain([min, max])
                    .range(range);
                this.legend.domain = [min, max];
                break;
        }
        for (const pid in values) {
            colors[pid] = scale(values[pid])
        }

            map.setPaintProperty(this.filters.geolevel.value,'fill-color',['get',['to-string',['get','geoid']],['literal',colors]])

        }

}

const buildingsLayer = new acsLayer("ACS Layer", {
        active: true,
        loading: true,
        sources: [
            { id: "counties",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.1ggw4eku'
                },
            },
            { id: "cousubs",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.dlnvkxdi'
                },
            },
            { id: "tracts",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.92hcxki8'
                },
            }

        ],

        layers: [
            { 'id': 'counties',
                'source': 'counties',
                'source-layer': 'counties',
                'type': 'fill',
                'paint': {
                    'fill-color': 'rgba(196, 0, 0, 0.1)',
                },
                filter : ['all',['in','geoid',...counties]]
            },
            { 'id': 'cousubs',
                'source': 'cousubs',
                'source-layer': 'cousubs',
                'type': 'fill',
                'paint': {
                    'fill-color': 'rgba(195, 0, 0, 0.1)',
                },
                filter : ['in','geoid','']
            },
            { 'id': 'tracts',
                'source': 'tracts',
                'source-layer': 'tracts',
                'type': 'fill',
                'paint': {
                    'fill-color': 'rgba(196, 0, 0, 0.1)',
                },
                filter : ['in','geoid','']
            }
        ],

        popover: {
                layers: ['counties'],
                dataFunc: feature =>
            ["Buildings", ["Test",feature.properties.geoid]]
    },
        legend: {
            ...NON_ORDINAL_LEGEND,

        active: true,
        domain: [],
        title: "Parcel Legend"
    },

    modal: {
    comp: () => <h1>TEST MODAL</h1>,
    show: false
},
filters: {

            year: {
                name: 'year',
                type: 'dropdown',
                domain: [2014,2015,2016,2017],
                value: 2014
            },
            geolevel:{
                name: 'geolevel',
                    type: 'dropdown',
                    domain: [],
                    value: 'counties'
            },
            measures: {
                name: "measures",
                type: "dropdown",
                domain: [],
                value: "B01003",
                    onChange: (map, layer, value) => {
                    Object.keys(layer.acsConfig).forEach(function(item){
                        if (value === item){


                            layer.filters.submeasure = {
                                    name:'submeasure',
                                    type: 'dropdown',
                                    domain: layer.acsConfig[item].variables.map(d => {
                                        return {name:d.name, value:d.value}
                                    }),
                                    value: layer.acsConfig[item].variables.map(d => d.value)[0]
                                }
                        }
                    })
                    
                    layer.component.forceUpdate()
                }
            },
            submeasure: {
                name:'submeasure',
                    type: 'dropdown',
                    domain: [],
                    value: 'B01003_001E'
            }

},

actions: [
    {
        Icon: ArrowDown,
        action: ["toggleModal"],
        tooltip: "Toggle Modal"
    },
    {
        Icon: ArrowRight,
        action: ["toggleInfoBox", "test"],
        tooltip: "Toggle Info Box"
    }

],
    infoBoxes: {
    test: {
        comp: () => <h4>INFO BOX</h4>,
        show: false
    }
}
})



export default buildingsLayer