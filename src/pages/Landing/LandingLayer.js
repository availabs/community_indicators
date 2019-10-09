import React from "react"
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";

// import MapLayer from "components/AvlMap/MapLayer"
// import React from "react"
// import styled from 'styled-components';

import * as d3scale from "d3-scale"

import MapLayer from "AvlMap/MapLayer.js"

import { falcorGraph } from "store/falcorGraph"

import mapboxgl from 'mapbox-gl/dist/mapbox-gl'

import COLOR_RANGES from "constants/color-ranges"

var geojsonExtent = require('@mapbox/geojson-extent');


const counties = ['36001','36083','36093','36091','36039','36021','36115','36113'];

export const getGeo = (map, filter, source, sourceLayer) => {
  return new Promise(resolve => {
    const listener = () => {
      if (
        !(map.isMoving() || map.isZooming() || map.isRotating()) &&
        map.areTilesLoaded()
      ) {
        map.off('render', listener);
        const d = map.querySourceFeatures(source, {
          filter: filter,
          sourceLayer: sourceLayer
        });
        return resolve(d)
      }
    };
    map.on('render', listener);
    map.setPitch(65)

  })
}


class TractLayer extends MapLayer{

    onAdd(map){
        let tracts = []


        return falcorGraph.get(['geo',[...counties],['tracts','blockgroup']],['acs','config'])
            .then(data =>{
                let tracts = []
                let bg = []

                this.subvars = data.json.acs.config['B01003'].variables;
                counties.forEach(function(geoid,i){
                    tracts.push(...data.json.geo[geoid].tracts)

                    bg.push(...data.json.geo[geoid].blockgroup)
                })
                this.tracts = tracts;
                this.blockgroups = bg
                this.config = data.json.acs.config


                let filter = ['all', ['in', 'GEOID', ...this.blockgroups]]
                map.setFilter('bg-layer', filter);

                let bounds = [-74.53742980957031, 42.02277326296911, -73.24155807495117, 43.80851750264139]
                // getGeo(map, filter, 'bg', "tl_2017_36_bg")
                // .then(features => {

                //     this.geom = features.reduce((out,feat) => {
                //             out[feat.properties.GEOID] = feat.properties.ALAND / 1000
                //         return out
                //     },{})

                //     console.log('', this.geom)

                //

                //     console.log('bounds', bounds)

                // })
                fetch('/data/bg_area.json')
                    .then(response => response.json())
                    .then(bg_area => {
                        console.log('data', data)
                        this.geom = bg_area
                        this.fetchData().then(data => this.receiveData(map, data))

                })

                map.setPitch(65)




                //rotateCamera(0,map);

            })
    }
    fetchData(){
        let censusSubvars = [];
        this.subvars.forEach(function(subvar,i){
            censusSubvars.push(subvar.value)
        })
        console.time('falcor get census')

        let requests = []
        let chunkSize = 500
        for (let i = 0; i < this.blockgroups.length; i += chunkSize) {
          requests.push(this.blockgroups.slice(i, i + chunkSize))
        }


    return requests
      .reduce((a, c) => a.then(() => falcorGraph.get(
        ['acs',c,['2016'],[...censusSubvars]])),
      Promise.resolve())

    }
    receiveData(map,data) {
        data = falcorGraph.getCache()
        console.timeEnd('falcor get census')
        let censusSubVar = this.filters.censvar.value;
        let censVars = this.config['B01003'].variables;
        let censusSubVarKey = '';
        let index = 0;
        // console.log('bounds',bounds)
        function rotateCamera(timestamp) {
            // clamp the rotation between 0 -360 degrees
            // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
            map.rotateTo((timestamp / 1000) % 360, {duration: 0});
            // Request the next frame of the animation.
            requestAnimationFrame(rotateCamera);
        }

        censVars.forEach(function(subvars,i){
            if (subvars.name === censusSubVar){
                censusSubVarKey = subvars.value
                index = i
            }
        });


        let keyDomain = Object.keys(data.acs)
            .filter(d => d !== 'config')
            .reduce((out, curr) => {
                if(data.acs[curr] && this.geom[curr]){
                    out[curr] = data.acs[curr]['2016']['B01003_001E'] / (this.geom[curr]);
                }
                return out;
            }, {});

        let popSum = Object.keys(data.acs)
            .filter(d => d !== 'config')
            .reduce((out, curr) => {
                if(data.acs[curr] && this.geom[curr]){
                    out += data.acs[curr]['2016']['B01003_001E'];
                }
                return out;
            }, 0);
        let areaSum = Object.keys(data.acs)
            .filter(d => d !== 'config')
            .reduce((out, curr) => {
                if(data.acs[curr] && this.geom[curr]){
                    out += (this.geom[curr])
                }
                return out;
            }, 0);
        console.log('pop: ', popSum)
        console.log('area: ', areaSum)
        let values = Object.values(keyDomain).sort((a,b) => a - b )

        let min = Math.min(...values)
        let max = Math.max(...values)

        map.setPaintProperty(
            'bg-layer',
            'fill-extrusion-color',
            [
               'interpolate',
                ['linear'],
                ["get", ["to-string", ["get", "GEOID"]], ["literal", keyDomain]],
                min,'#160e23',
                max*0.02,'#00617f',
                max*0.8,'#55e9ff'
            ]
        );

        map.setPaintProperty(
            'bg-layer',
            'fill-extrusion-height',
            [
                'interpolate',
                ['linear'],
                ["get", ["to-string", ["get", "GEOID"]], ["literal", keyDomain]],
                min, 0,
                max, 10000
            ]

        )

        map.setPaintProperty(
            'bg-layer',
            'fill-extrusion-opacity',
            1
        );

        /*let renderGeo = map.queryRenderedFeatures({ layers: ['bg-layer'] })

        let tractsGeo = map.querySourceFeatures("bg",
            {
                sourceLayer:"tl_2017_36_bg",
                // filter: ['all', ['in', 'GEOID', ...this.blockgroups]]
            }
        )
        let geojson = {type:'FeatureCollection', features: tractsGeo}
                console.log('tracts Geo',tractsGeo, renderGeo)
        let bounds =  geojsonExtent(geojson)*/

        rotateCamera(0)
    }
}


const tractLayer = new TractLayer("Tracts Layer", {
    active: true,
    showAttributesModal: false,
    tracts: [],
    sources: [
        {
            "id": "composite",
            source:{
                "type": "vector",
                "url": "mapbox://mapbox.mapbox-streets-v7"

            }
        },
        {
            id: "bg",
            source: {
                'type': "vector",
                'url': 'mapbox://am3081.02eswc9t'
            }
        },

    ],
    layers: [
        { 'id': 'bg-layer',
            'source': 'bg',
            'source-layer': 'tl_2017_36_bg',
            'type': 'fill-extrusion',
            'paint': {
                'fill-extrusion-color': 'rgba(0, 0, 0, 0.01)',
                'fill-extrusion-base': 0,
                'fill-extrusion-height': 0,
                'fill-extrusion-opacity': 0.0
            },
            beneath: 'place-neighbourhood'
        },


        // { 'id': 'counties-layer',
        //     'source': 'counties',
        //     'source-layer': 'counties',
        //     'type': 'line',
        //     'paint': {
        //         'line-color': '#fefefe',
        //         'line-width': 1
        //     }
        // }

    ],
    filters:{
        censvar:{
            name: "censvar",
            type: "hidden",
            domain: [],
            value: "White"
        },
        year:{
            name: 'year',
            type: 'hidden',
            domain: [],
            value: '2016'
        }
    }

});

export default tractLayer
