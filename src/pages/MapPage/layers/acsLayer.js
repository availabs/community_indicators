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
const counties = ['36001','36083','36093','36091','36039','360021','36115','36113'];

const year = [2014,2015,2016,2017,2018];
class acsLayer extends MapLayer{

    /* commented it to debug the below functions to understand Response code :0git
    onAdd(map) {
        console.log('in add hello')
        super.onAdd(map)
        this.loading = true;
        console.log('loading...')
        return falcorGraph.get(['acs','config'])
            .then(res => {
            console.log(typeof res)
            //let censusConfig = ;
            console.log('censusConfig')
        })


        /*
        .then(res => {
            var censusConfig = res.json.acs.config.key;
            console.log('censusConfig', censusConfig)
        })
         */

    fetchData(){
        console.log('got to fetch data');
        return falcorGraph.get(
            ['geo', counties, [this.filters.year.value], [this.filters.measures.value]]
        ).then(data => {
            console.log('fetch data',data);
            return data
        })

    }
    receiveData(map,data){
        console.log('receive data',data);


               let graph = data.json.geo,

                values = {},
                colors = {},

                domain = [];

            let min = Infinity,
                max = -Infinity,

                scale;

            counties.forEach(geoid => {
                const value = graph[geoid][this.filters.year.value][this.filters.measures.value];
            values[geoid] = value;
            domain.push(value);
            min = Math.min(min, value);
            max = Math.max(max, value);
        })

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
            console.log(colors);
            map.setPaintProperty('counties','fill-color',['get',['to-string',['get','geoid']],['literal',colors]])
        }

}



const buildingsLayer = new acsLayer("ACS Layer", {
        active: true,
        sources: [
            { id: "counties",
                source: {
                    'type': "vector",
                    'url': 'mapbox://am3081.1ggw4eku'
                }
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
                domain: [2015,2016,2017],
                value: 2017
            },
            measures: {
                name: "measures",
                type: "dropdown",
                domain: ['population','poverty','non_english_speaking','under_5','over_64','vulnerable','population_change','poverty_change','non_english_speaking_change','under_5_change','over_64_change','vulnerable_change'],
                value: "population"
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