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
import deepequal from "deep-equal"

class TractLayer extends MapLayer {
    constructor(...args) {
      super(...args);
      this.animationDuration = 4000;
      this.timer = this.animationDuration;
      this.now = 0;
      this.startAnimation = this.startAnimation.bind(this);
    }
    onAdd(map){
      map.setPitch(65);
      this.startAnimation();

      return fetch('/data/bg_area.json')
        .then(response => response.json())
        .then(bg_area => {
            this.geom = bg_area
            this.doAction(["fetchLayerData"])
        })
    }
    onRemove(map) {
      cancelAnimationFrame(this.animation);
    }
    fetchData() {
      return falcorChunkerNice(["geo", this.geoids, "blockgroup"])
        .then(res => {
          this.blockgroups = this.geoids.reduce((a, c) => {
            a.push(...get(res, ["json", "geo", c, "blockgroup"], []))
            return a;
          }, [])
          return falcorChunkerNice(["acs", this.blockgroups, this.year, this.censusKey])
            .then(() => falcorGraph.call(["geo", "blockgroup", "centroid"], this.blockgroups))
            .then(res => {
              const centroid = get(res, ["json", "geo", "blockgroup", "centroid", "coordinates"], null);
              if (!deepequal(centroid, this.centroid)) {
                this.centroid = centroid;
                this.restartAnimation();
              }
            });
        })
    }

    restartAnimation(settings) {
      this.timer += this.animationDuration;
    }
    startAnimation(timestamp = 0) {
      this.timer += (timestamp - this.now);
      this.now = timestamp;

      if (this.timer >= this.animationDuration) {
        this.timer = 0;
        const args = {
          bearing: (timestamp * 0.001) % 360,
          duration: this.animationDuration,
          easing: d => d,
          zoom: this.geoids.length === 1 ? 10.5 : 8
        }
        if (this.centroid) {
          args.center = [...this.centroid];
        }
        this.map.easeTo({ ...args });
      }
      this.animation = requestAnimationFrame(this.startAnimation);
    }

    render(map) {
        map.setFilter('bg-layer', ['in', 'GEOID', ...this.blockgroups]);

        const cache = falcorGraph.getCache();

        const keyDomain = this.blockgroups.reduce((a, c) => {
          a[c] = get(cache, ["acs", c, this.year, this.censusKey], 0) / get(this.geom, [c], 1);
          return a;
        }, {})

        // let keyDomain = Object.keys(data.acs)
        //     .filter(d => d !== 'config')
        //     .reduce((out, curr) => {
        //         if(data.acs[curr] && this.geom[curr]){
        //             out[curr] = data.acs[curr]['2016']['B01003_001E'] / (this.geom[curr]);
        //         }
        //         return out;
        //     }, {});
        //
        // let popSum = Object.keys(data.acs)
        //     .filter(d => d !== 'config')
        //     .reduce((out, curr) => {
        //         if(data.acs[curr] && this.geom[curr]){
        //             out += data.acs[curr]['2016']['B01003_001E'];
        //         }
        //         return out;
        //     }, 0);
        // let areaSum = Object.keys(data.acs)
        //     .filter(d => d !== 'config')
        //     .reduce((out, curr) => {
        //         if(data.acs[curr] && this.geom[curr]){
        //             out += (this.geom[curr])
        //         }
        //         return out;
        //     }, 0);

        const values = Object.values(keyDomain).sort((a, b) => a - b),
          min = values[0],
          max = values[values.length - 1];

        map.setPaintProperty(
            'bg-layer',
            'fill-extrusion-color',
            [
               'interpolate',
                ['linear'],
                ["get", ["to-string", ["get", "GEOID"]], ["literal", keyDomain]],
                min, '#160e23',
                max, '#55e9ff'
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
    }
}



export default () =>
  new TractLayer("Tracts Layer", {
    active: true,

    geoids: ['36001', '36083', '36093', '36091', '36039', '36021', '36115', '36113'],
    censusKey: "B01003_001E",
    blockgroups: [],
    centroid: null,
    year: 2017,

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
                'fill-extrusion-color': '#000',
                'fill-extrusion-base': 0,
                'fill-extrusion-height': 0,
                'fill-extrusion-opacity': 1
            },
            beneath: 'place-neighbourhood',
            filter: ["in", "GEOID", "none"]
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
    // filters:{
    //     censvar:{
    //         name: "censvar",
    //         type: "hidden",
    //         domain: ["B01003_001E"],
    //         value: "B01003_001E"
    //     },
    //     year:{
    //         name: 'year',
    //         type: 'hidden',
    //         domain: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017],
    //         value: 2017
    //     },
    //     geo: {
    //         name: 'geographies',
    //         type: 'hidden',
    //         domain: [],
    //         value: ['36001','36083','36093','36091','36039','36021','36115','36113']
    //     }
    // }


  });
