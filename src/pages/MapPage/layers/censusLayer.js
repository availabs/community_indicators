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
const counties = ['36001','36083','36093','36091','36039','36021','36115','36113'];
const year = [2016,2017,2018];
let blockGroups = []
class CensusLayer extends MapLayer{
    onAdd(map){
        console.log('in add')
        super.onAdd(map)
        this.loading = true;
        return falcorGraph.get(['geo',counties,'blockgroup'],['acs','config'])
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
            this.filters.BlockGroups.domain = this.censusBlockGroups
            map.setFilter('density_layer',['in','GEOID',...this.censusBlockGroups])
            return this.fetchData()
            })

    }

    fetchData(){
        console.log('in fetch')
        return falcorGraph.get(['acs',[this.filters.BlockGroups.value],[this.filters.year.value],[this.filters.measures.value]]
        ).then(data => {
            console.log('fetch data',data)
            return data
        })

    }

    receiveData(map,data){
        console.log('receive data')
        /*
        let graph = data.json.acs,

            values = {},
            colors = {},

            domain = [];
        let min = Infinity,
            max = -Infinity,

            scale;
         */
        //console.log('graph',graph)
    }




}
const censusLayer = new CensusLayer("Census Layer", {
        active: false,
        loading: true,
        sources: [
            { id: "dot_density",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.a7icspqd'
                }
            },

        ],
        layers: [
            { 'id': 'density_layer',
                'source': 'dot_density',
                'source-layer': 'ny_whole',
                'type': 'circle',
                'paint_circle': {
                    'circle-radius': 1,
                    'circle-opacity': 0.8,
                    'circle-color': ['string', '#bab']
                }
            }
        ],
        filters: {

            year: {
                name: 'year',
                type: 'dropdown',
                domain: [2014, 2015, 2016, 2017],
                value: 2014
            },
            BlockGroups:{
                name: 'BlockGroups',
                type: 'dropdown',
                domain: [],
                value: '360010137054'
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