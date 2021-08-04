import React from "react"

// import { Link } from "react-router-dom"
import get from "lodash.get"

import MapLayer from "AvlMap/MapLayer"

import { falcorGraph, falcorChunkerNice } from "store/falcorGraph";

const GREATER_COUNTIES = ['36001','36083','36093','36091','36039','36021','36115','36113'];

class BgPointsLayer extends MapLayer {
  name = "Dot Density";
  active = true;
  version = 2.0; // ONLY SET THIS IF YOU KNOW WHAT IT MEANS!!!
  onAdd(map) {
    return falcorGraph.get(
      ["geo", GREATER_COUNTIES, "blockgroup"]
    )
    .then(res => {
      const bgs = GREATER_COUNTIES.reduce((a, c) => {
        return a.concat(get(res, ["json", "geo", c, "blockgroup"], []));
      }, []);
console.log("BGs:", bgs)
    })
  }
  popover = {
    layers: ["bg_points"],
    dataFunc: function(topFeature, features) {
      return features.reduce((a, { properties }) => {
        a.push(
          ["Geo ID", properties.geoid],
          ["Density", properties.d]
        );
        return a;
      }, [])
    }
  }
  sources = [
    { id: "bg_points",
      source: {
        type: "vector",
        url: "https://tiles.availabs.org/data/bg_points_2019.json"
      }
    }
  ]
  layers = [
    { id: "bg_points",
      source: "bg_points",
      "source-layer": "bg_points_2019",
      type: "circle",
      paint: {
        "circle-color": "#f00",
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          5, 1,
          10, 2,
          20, 3
        ]
      }
    }
  ]
}

const bgPointsLayerFactory = () => new BgPointsLayer();

export default bgPointsLayerFactory;
