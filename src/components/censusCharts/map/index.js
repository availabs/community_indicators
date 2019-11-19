import React from "react"

import mapboxgl from "mapbox-gl"

import AvlMap from "AvlMap"
import MapLayer from "AvlMap/MapLayer"
import { register, unregister } from "AvlMap/ReduxMiddleware"

import { UPDATE as REDUX_UPDATE } from 'utils/redux-falcor'

import Title from "../ComponentTitle"

import deepequal from "deep-equal"
import get from "lodash.get"
import * as d3scale from "d3-scale"
import { extent } from "d3-array";
import { format as d3format } from "d3-format"

import { fnum, fmoney } from "utils/sheldusUtils"

import { falcorGraph, falcorChunkerNiceWithUpdate } from "store/falcorGraph";

import { getColorRange } from "constants/color-ranges"
const NUM_COLORS = 8;
const LEGEND_COLOR_RANGE = getColorRange(NUM_COLORS, "Oranges").slice(0, NUM_COLORS - 1);

// blues = ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"]
const BORDER_COLOR = "#2171b5"
const HOVER_COLOR = "#6baed6";

class CensusMap extends React.Component {
  censusLayer = LayerFactory(this.props);
  render() {
    return (
      <div style={ { width: "100%", height: "100%", overflow: "hidden", borderRadius: "4px" } }>
        <div style={ { height: "30px", maxWidth: "calc(100% - 285px)" } }>
          <Title title={ this.props.title }/>
        </div>
        <div style={ { height: "calc(100% - 30px)", width: "100%" } }>
          <AvlMap sidebar={ false }
            id={ this.props.id }
            layers={ [this.censusLayer] }
            layerProps={ {
              [this.censusLayer.name]: {
                year: this.props.year,
                geoids: this.props.geoids
              }
            } }/>
        </div>
      </div>
    )
  }
}

export default CensusMap

const COUNTIES = [
  '36001', '36083', '36093', '36091',
  '36039','36021','36115','36113'
].sort((a, b) => +a - +b);

class CensusLayer extends MapLayer {
  constructor(options) {
    super("Census Layer", options);

    this.falcorCache = {};
    this.active = true;
    this.showAttributesModal = false;
    this.geolevel = "blockgroup";
    this.zoomToBounds = true;
  }
  onAdd() {
    register(this, REDUX_UPDATE, ["graph"]);

    return falcorChunkerNiceWithUpdate(
      ["geo", COUNTIES, ["cousubs", "name"]]
    )
    .then(res => {
      const cousubs = COUNTIES.reduce((a, c) => {
        a.push(...get(this.falcorCache, ["geo", c, "cousubs", "value"], []));
        return a;
      }, [])
      return falcorChunkerNiceWithUpdate(["geo", cousubs, "name"])
    })
    .then(() => this.fetchData());
  }
  onRemove(map) {
    unregister(this);
  }

  receiveMessage(action, data) {
    this.falcorCache = data;
  }

	receiveProps(oldProps, newProps) {
    this.year = newProps.year;
    this.geoids = [...newProps.geoids];
    this.zoomToBounds = this.zoomToBounds || !deepequal(oldProps.geoids, newProps.geoids);
	}

  getGeoids() {
    return this.geoids.reduce((a, c) => {
      a.push(...get(this.falcorCache, ["geo", c, this.geolevel, "value"], []));
      return a;
    }, []);
  }
  resetView() {
    if (!this.map) return;

    const bounds = this.getBounds();

    if (bounds.isEmpty()) return;

    const options = {
      padding: {
        top: 50,
        right: 400,
        bottom: 50,
        left: 10
      },
      bearing: 0,
      pitch: 0,
      offset: [0, 0]
    }


    const paddingOffset = [options.padding.left - options.padding.right, options.padding.top - options.padding.bottom],
      lateralPadding = Math.min(options.padding.right, options.padding.left),
      verticalPadding = Math.min(options.padding.top, options.padding.bottom);
    options.offset = [options.offset[0] + paddingOffset[0], options.offset[1] + paddingOffset[1]];

    const offset = new mapboxgl.Point(options.offset),
      tr = this.map.transform,
      nw = tr.project(bounds.getNorthWest()),
      se = tr.project(bounds.getSouthEast()),
      size = se.sub(nw);

    const theta = options.bearing * (Math.PI / 180),
    	W = size.x * Math.abs( Math.cos(theta) ) + size.y * Math.abs( Math.sin(theta) ),
    	H = size.x * Math.abs( Math.sin(theta) ) + size.y * Math.abs( Math.cos(theta) ),

    	scaleX = (tr.width - lateralPadding * 2 - Math.abs(offset.x) * 2) / W,
    	scaleY = (tr.height - verticalPadding * 2 - Math.abs(offset.y) * 2) / H;

    if (scaleY < 0 || scaleX < 0) {
    	if (typeof console !== "undefined") console.warn('Map cannot fit within canvas with the given bounds, padding, and/or offset.');
        return this;
    }

    options.center = tr.unproject(nw.add(se).div(2));
    options.zoom = Math.min(tr.scaleZoom(tr.scale * Math.min(scaleX, scaleY)), tr.maxZoom);

console.log("OPTIONS:", W, H, scaleX, scaleY, options)
    this.map.easeTo(options);
  }
  getBounds(map = this.map) {
    const regex = /BOX\((.+)\)/;
    return this.geoids.reduce((a, c) => {
      const b = get(this.falcorCache, ["geo", c, "boundingBox", "value"], ""),
        match = regex.exec(b);
      if (match) {
        const split = match[1].split(","),
          box = split.map(s => s.split(" "))
        a.extend(box);
      }
      return a;
    }, new mapboxgl.LngLatBounds())
  }
  fetchData() {
    const geolevel = this.geolevel,
      year = this.year,
      census = this.censusKeys,
      geoids = this.geoids;

    return falcorChunkerNiceWithUpdate(
      ["geo", geoids, [geolevel, "boundingBox"]]
    )
    .then(() => {
      const cache = this.falcorCache,
        subGeoids = geoids.reduce((a, c) => {
          a.push(...get(cache, ["geo", c, geolevel, "value"], []))
          return a;
        }, []);
      return falcorChunkerNiceWithUpdate(
        ["acs", subGeoids, year, census]
      )
    })
  }
  render(map) {
    const geoids = this.getGeoids();

    map.setFilter(this.geolevel, ["in", "geoid", ...geoids]);

    const cousubs = this.geoids.reduce((a, c) => {
      if (c.length === 5) {
        const d = get(this.falcorCache, ["geo", c, "cousubs", "value"], []);
        a.push(...d);
      }
      else if (c.length === 11) {
        a.push(c);
      }
      return a;
    }, [])
    if (cousubs.length > 1) {
      map.setFilter("cousubs-symbol", ["in", "geoid", ...cousubs]);
      map.setFilter("cousubs-line", ["in", "geoid", ...cousubs]);
      const nameMap = cousubs.reduce((a, c) => {
        a[c] = get(this.falcorCache, ["geo", c, "name"], `Cousub ${ c }`);
        return a;
      }, {})
      map.setLayoutProperty("cousubs-symbol", "text-field",
        ["get", ["to-string", ["get", "geoid"]], ["literal", nameMap]]
      )
    }
    else {
      map.setFilter("cousubs-symbol", ["in", "geoid", "none"]);
      map.setFilter("cousubs-line", ["in", "geoid", "none"]);
    }

    if (this.zoomToBounds) {
      const bounds = this.getBounds();
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: { top: 50, right: 400, bottom: 50, left: 10 } });
        this.zoomToBounds = false;
      }
    }

    const valueMap = geoids.reduce((a, c) => {
      let value = this.censusKeys.reduce((aa, cc) => {
        const v = get(this.falcorCache, ["acs", c, this.year, cc], -666666666);
        if (v !== -666666666) {
          aa += v;
        }
        return aa;
      }, 0);
      const divisor = this.divisorKeys.reduce((aa, cc) => {
        const v = get(this.falcorCache, ["acs", c, this.year, cc], -666666666);
        if (v != -666666666) {
          aa += v;
        }
        return aa;
      }, 0)
      if (divisor !== 0) {
        value /= divisor;
      }
      a[c] = value;
      return a;
    }, {})
    const values = Object.values(valueMap);

    this.geoData = valueMap;

    const colorScale = this.getColorScale(values),
      colors = {};
    for (const key in valueMap) {
      colors[key] = colorScale(valueMap[key]);
    }
    geoids.forEach(geoid => {
      colors[geoid] = get(colors, geoid, "#000")
    })
    const colorKeys = Object.keys(colors);

    map.setPaintProperty(this.geolevel, "fill-color",
      ["case",
        ["boolean", ["feature-state", "hover"], false], HOVER_COLOR,
        ["match", ["to-string", ["get", "geoid"]], colorKeys,
          ["get", ["to-string", ["get", "geoid"]], ["literal", colors]],
          "#000"
        ]
      ]
    )
  }
  getColorScale(domain) {
    switch (this.legend.type) {
      case "quantile":
        this.legend.domain = domain;
        return d3scale.scaleQuantile()
          .domain(this.legend.domain)
          .range(this.legend.range);
      case "quantize":
        this.legend.domain = extent(domain)
        return d3scale.scaleQuantize()
          .domain(this.legend.domain)
          .range(this.legend.range);
    }
  }
}

const LayerFactory = props => {
  return new CensusLayer({
    geoids: props.geoids || [],
    year: props.year || 2017,
    censusKeys: props.censusKeys || [],
    divisorKeys: props.divisorKeys || [],

    legend: {
      type: "quantile",
      domain: [],
      range: LEGEND_COLOR_RANGE,
      format: props.format || fnum
    },

    popover: {
      layers: ["blockgroup"],
      dataFunc: function(topFeature, features) {
        let geoid = get(topFeature, ["properties", "geoid"], "");

        const data = [];

        const value = get(this.geoData, [geoid], null);
        if (value !== null) {
          const format = (typeof this.legend.format === "function") ? this.legend.format : d3format(this.legend.format);
          data.push(["Value", format(value)])
        }

        return data;
      }
    },

    mapActions: {
      // reset: {
      //   Icon: () => <span className="fa fa-2x fa-home"/>,
      //   tooltip: "Reset View",
      //   action: function() {
      //     this.resetView();
      //   }
      // }
      // test: {
      //   tooltip: "Test iframe",
      //   Icon: () => <span className="fa fa-2x fa-car"/>,
      //   action: function() {
      //     this.doAction(["toggleModal", "test"]);
      //   }
      // },
    },

    onHover: {
      layers: ["blockgroup"]
    },

    sources: [
      // { id: "counties",
      //   source: {
      //     'type': "vector",
      //     'url': 'mapbox://am3081.a8ndgl5n'
      //   },
      // },
      { id: "cousubs",
        source: {
          'type': "vector",
          'url': 'mapbox://am3081.36lr7sic'
        },
      },
      // { id: "tracts",
      //   source: {
      //     'type': "vector",
      //     'url': 'mapbox://am3081.2x2v9z60'
      //   },
      // },
      {
        id: "blockgroup",
        source: {
            'type': "vector",
            'url': 'mapbox://am3081.52dbm7po'
        }
      }
    ],

    layers: [
      // { 'id': 'counties',
      //   'source': 'counties',
      //   'source-layer': 'counties',
      //   'type': 'fill',
      //   filter : ['in', 'geoid', 'none']
      // },
      // { 'id': 'tracts',
      //   'source': 'tracts',
      //   'source-layer': 'tracts',
      //   'type': 'fill',
      //   filter : ['in', 'geoid', 'none']
      // },
      {
        id: "blockgroup",
        source: "blockgroup",
        'source-layer': "blockgroups",
        'type': 'fill',
        filter : ['in', 'geoid', 'none']
      },
      { 'id': 'cousubs-line',
        'source': 'cousubs',
        'source-layer': 'cousubs',
        'type': 'line',
        filter : ['in', 'geoid', 'none'],
        paint: {
          "line-color": BORDER_COLOR,
          "line-width": 2
        }
      },
      { 'id': 'cousubs-symbol',
        'source': 'cousubs',
        'source-layer': 'cousubs',
        'type': 'symbol',
        filter : ['in', 'geoid', 'none'],
        layout: {
          "symbol-placement": "point",
          "text-size": 12,
          "text-allow-overlap": true,
          "text-ignore-placement": true
        },
        paint: {
          "text-color": "#000"
        }
      }
    ]
  })
}
