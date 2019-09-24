import React from "react"
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";

// import MapLayer from "components/AvlMap/MapLayer"
// import React from "react"
// import styled from 'styled-components';

import * as d3scale from "d3-scale"

import MapLayer from "AvlMap/MapLayer.js"

import { falcorGraph, falcorChunkerNice } from "store/falcorGraph"

import mapboxgl from 'mapbox-gl/dist/mapbox-gl'

import COLOR_RANGES from "constants/color-ranges"

import get from "lodash.get"

var geojsonExtent = require('@mapbox/geojson-extent');

class TractLayer extends MapLayer{

    onAdd(map){
      super.onAdd();

      map.setPitch(65);
      const rotateCamera = timestamp => {
          map.rotateTo((timestamp * 0.001) % 360, { duration: 0 });
          this.animation = requestAnimationFrame(rotateCamera);
      }
      rotateCamera(0);

      return fetch('/data/bg_area.json')
        .then(response => response.json())
        .then(bg_area => {
            this.geom = bg_area
            this.doAction(["fetchLayerData"])
        })
    }
    fetchData() {
      return falcorChunkerNice(["geo", this.geoids, "blockgroup"])
        .then(res => {
          const blockgroups = this.geoids.reduce((a, c) => {
            a.push(...get(res, ["json", "geo", c, "blockgroup"], []))
            return a;
          }, [])
          return falcorChunkerNice(["acs", blockgroups, 2016, this.censusKeys])
            .then(() => blockgroups)
        })
    }
    receiveData(map, blockgroups) {
        const filter = ['all', ['in', 'GEOID', ...blockgroups]];
        map.setFilter('bg-layer', filter);

        const rendered = map.querySourceFeatures("bg", { sourceLayer: "tl_2017_36_bg", filter });
console.log("RENDERED:", rendered)

        const data = falcorGraph.getCache();

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

    }
}


const tractLayer = new TractLayer("Tracts Layer", {
    active: true,

    geoids: ['36001', '36083', '36093', '36091', '36039', '36021', '36115', '36113'],
    censusKeys: ["B01003_001E"],

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
            domain: ["B01003_001E"],
            value: "B01003_001E"
        },
        year:{
            name: 'year',
            type: 'hidden',
            domain: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
            value: 2017
        },
        geo: {
            name: 'geographies',
            type: 'hidden',
            domain: [],
            value: ['36001','36083','36093','36091','36039','36021','36115','36113']
        }
    }


});

export default tractLayer
