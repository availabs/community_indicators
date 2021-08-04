import React from "react"

// import { Link } from "react-router-dom"

import MapLayer from "AvlMap/MapLayer"

class BgPointsLayer extends MapLayer {
  name = "Dot Density";
  active = true;
  version = 2.0; // ONLY SET THIS IF YOU KNOW WHAT IT MEANS!!!
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
