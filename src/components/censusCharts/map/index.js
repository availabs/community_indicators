import React from "react"

import AvlMap from "AvlMap"
import MapLayer from "AvlMap/MapLayer"
import { register, unregister } from "AvlMap/ReduxMiddleware"

import { UPDATE as REDUX_UPDATE } from 'utils/redux-falcor'

import get from "lodash.get"
import * as d3scale from "d3-scale"
import { extent } from "d3-array";
import { format as d3format } from "d3-format"

import { fnum, fmoney } from "utils/sheldusUtils"

import { falcorGraph, falcorChunkerNiceWithUpdate } from "store/falcorGraph";

import { getColorRange } from "constants/color-ranges"
const LEGEND_COLOR_RANGE = getColorRange(7, "Blues");

class CensusMap extends React.Component {
  censusLayer = LayerFactory(this.props);
  componentDidUpdate(oldProps) {
    if (oldProps.year !== this.props.year) {
      AvlMap.doAction([this.props.id, "fetchLayerData", this.censusLayer.name])
    }
  }
  render() {
    return (
      <div style={ { width: "100%", height: "100%" } }>
        <AvlMap sidebar={ false }
          id={ this.props.id }
          layers={ [this.censusLayer] }
          layerProps={ {
            [this.censusLayer.name]: {
              year: this.props.year
            }
          } }/>
      </div>
    )
  }
}

export default CensusMap

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

    return this.fetchData();
  }
  onRemove(map) {
    unregister(this);
  }
  receiveMessage(action, data) {
    this.falcorCache = data;
  }
  onPropsChange(oldProps, newProps) {
    this.year = newProps.year;
    this.doAction(["fetchData"]);
  }
  getGeoids() {
    return this.geoids.reduce((a, c) => {
      a.push(...get(this.falcorCache, ["geo", c, this.geolevel, "value"], []));
      return a;
    }, []);
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

    if (this.zoomToBounds) {
      for (const geoid of this.geoids) {
        const b = get(this.falcorCache, ["geo", geoid, "boundingBox", "value"], ""),
          regex = /BOX\((.+)\)/,
          match = regex.exec(b);
        if (match) {
          const split = match[1].split(","),
            box = split.map(s => s.split(" "))
          map.fitBounds(box, { padding: { top: 50, right: 350, bottom: 50, left: 10 } });
          this.zoomToBounds = false;
        }
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

    const HOVER_COLOR = "#f16913";

    map.setPaintProperty(this.geolevel, "fill-extrusion-color",
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
      title: props.title || "Legend",
      type: "quantile",
      domain: [],
      range: LEGEND_COLOR_RANGE,
      format: props.format || fnum
    },

    popover: {
      layers: ["counties", "cousubs", "tracts", "blockgroup"],
      dataFunc: function(topFeature, features) {
        let geoid = get(topFeature, ["properties", "geoid"], "");

        const data = [];

        let name = "";
        if (geoid.length < 11) {
          name = get(this.falcorCache, ["geo", geoid, "name"], geoid);
        }
        else if (geoid.length === 11) {
          const county = get(this.falcorCache, ["geo", geoid.slice(0, 5), "name"], "County");
          name = county + " Tract";
        }
        else if (geoid.length === 12) {
          const county = get(this.falcorCache, ["geo", geoid.slice(0, 5), "name"], "County");
          name = county + " Block Group";
        }
        if (name) data.push(name);

        const value = get(this.geoData, [geoid], null);
        if (value !== null) {
          const format = (typeof this.legend.format === "function") ? this.legend.format : d3format(this.legend.format);
          data.push([this.legend.title, format(value)])
        }
        // data.push({
        //   type: "link",
        //   link: "View Profile",
        //   href: `/profile/${ geoid }`
        // })

        return data;
      }
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
      // { id: "cousubs",
      //   source: {
      //     'type': "vector",
      //     'url': 'mapbox://am3081.36lr7sic'
      //   },
      // },
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
      //   'type': 'fill-extrusion',
      //   filter : ['in', 'geoid', 'none']
      // },
      // { 'id': 'cousubs',
      //   'source': 'cousubs',
      //   'source-layer': 'cousubs',
      //   'type': 'fill-extrusion',
      //   filter : ['in', 'geoid', 'none']
      // },
      // { 'id': 'tracts',
      //   'source': 'tracts',
      //   'source-layer': 'tracts',
      //   'type': 'fill-extrusion',
      //   filter : ['in', 'geoid', 'none']
      // },
      {
        id: "blockgroup",
        source: "blockgroup",
        'source-layer': "blockgroups",
        'type': 'fill-extrusion',
        filter : ['in', 'geoid', 'none']
      }
    ]
  })
}
