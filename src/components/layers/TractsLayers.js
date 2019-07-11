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

const counties = ['36001','36083','36093','36091','36039','36021','36115','36113'];
class TractLayer extends MapLayer{

    onAdd(map){
        let tracts = []
        return falcorGraph.get(['geo',[...counties],'tracts'],['acs','config'])
            .then(data =>{
                this.subvars = data.json.acs.config['B02001'].variables;
                counties.forEach(function(geoid,i){
                    tracts.push(...data.json.geo[geoid].tracts)
                })
                this.tracts = tracts;
                this.config = data.json.acs.config
                map.setFilter('tracts-layer', ['all', ['in', 'geoid', ...tracts]]);
                //map.querySourceFeatures('tracts',sourceLayer:'tracts')
                this.fetchData().then(data => this.receiveData(map, data))

            })
    }
    fetchData(){
        if(!this.subvars) return Promise.resolve({})
        let censusSubvars = [];
        this.subvars.forEach(function(subvar,i){
            censusSubvars.push(subvar.value)
        })
        return falcorGraph.get(['acs',this.tracts,['2016'],[...censusSubvars]])
            .then(data =>{
                return data
            })
    }
    receiveData(map,data) {
        if(!this.config) return;
        
        let censusSubVar = this.filters.censvar.value;
        let censVars = this.config['B02001'].variables;
        let censusSubVarKey = '';
        let index = 0;
        censVars.forEach(function(subvars,i){
            if (subvars.name === censusSubVar){
                censusSubVarKey = subvars.value
                index = i
            }
        });
        let keyDomain = Object.keys(data.json.acs).filter(d => d != '$__path').reduce((out, curr) => {
            out[curr] = data.json.acs[curr]['2016'][censusSubVarKey];
            return out;
        }, {});
        let range = [["#EAD676","#E3CA56","#C6A612","#fee493","#fee392"],
            ["#CFAFD1","#773D7A","#5F1463","#966E99","#7A497E"],
            ['#DF3939','#8E1212','#D88383','#F34F4F','#8E0606'],
            ['#4794C5','#377195','#2B94D6','#214861','#1270AD'],
            ['#E9A248','#C17515','#F0BD7C','#D69139','#F6D1A3'],
            ['#94E84F','#77CB32','#BBDE9F','#B4EF84','#98BC7A'],
            ['#F18AEE','#D948D5','#F0B2EE','#A434A1','#DC16D7'],
            ['#DAD5DA','#D1CED1','#A99FA9','#D0CAD0','#757475']];
        let colorScale = d3scale.scaleThreshold()
            .domain([500,5000,10000,15000])
            .range(range[index-1]);
        let mapColors = Object.keys(keyDomain).reduce((out,curr) => {
            out[curr] = colorScale(keyDomain[curr]);
            return out;
        },{});
        map.setPaintProperty(
            'tracts-layer',
            'fill-color',
            ["get", ["to-string", ["get", "geoid"]], ["literal", mapColors]]
        );
        map.setPaintProperty(
            'tracts-layer',
            'fill-opacity',
            0.7
        );
    }
}


const tractLayer = new TractLayer("Tracts Layer", {
    active: true,
    loading: true,
    sources: [
        { id: "tracts",
            source: {
                'type': "vector",
                'url': 'mapbox://am3081.92hcxki8'
            }
        }
    ],
    layers: [
        { 'id': 'tracts-layer',
            'source': 'tracts',
            'source-layer': 'tracts',
            'type': 'fill',
            'paint': {
                'fill-color': 'rgba(196, 0, 0, 0.1)',
            }
        }
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