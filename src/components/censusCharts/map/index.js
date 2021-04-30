import React from "react"
import { Link, withRouter } from "react-router-dom"

import mapboxgl from "mapbox-gl"

import AvlMap from "AvlMap"
import MapLayer from "AvlMap/MapLayer"
import { register, unregister } from "AvlMap/ReduxMiddleware"

import { UPDATE as REDUX_UPDATE } from 'utils/redux-falcor'

import Title from "../ComponentTitle"
import Options from '../Options'

import deepequal from "deep-equal"
import get from "lodash.get"
import * as d3selection from "d3-selection"
import * as d3scale from "d3-scale"
import { extent } from "d3-array";
import { format as d3format } from "d3-format"

import { fnum, fmoney } from "utils/sheldusUtils"

import { falcorGraph, falcorChunkerNiceWithUpdate } from "store/falcorGraph";

import LightTheme from "components/common/themes/light_new"

import { makeCensusFormula } from "../makeCensusFormula"

import { getColorRange } from "constants/color-ranges"
const NUM_COLORS = 8;
const LEGEND_COLOR_RANGE = getColorRange(NUM_COLORS, "Oranges").slice(0, NUM_COLORS - 1);

// blues = ["#eff3ff", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#084594"]
const BORDER_COLOR = "#3282b6"//"#4292c6"
const HOVER_COLOR = "#6baed6";

class CensusMap extends React.Component {
  static defaultProps = {
    showOptions: true,
    censusKeys: [],
    subtractKeys: [],
    divisorKeys: [],
    geolevel: "blockgroup",
    year: 2017,
    geoids: [],
    compareGeoid: null,
    format: ",d",
    description: ""
  }
  censusLayer = LayerFactory(this.props);

  processDataForViewing() {
    const cousubs = this.censusLayer.geoids.reduce((a, c) => {
      a.push(...get(this.censusLayer, ["falcorCache", "geo", c, "cousubs", "value"], []));
      return a;
    }, [])
    const bgsInCousubs = cousubs.reduce((a, c) => {
      a[c] = get(this.censusLayer, ["falcorCache", "geo", c, this.props.geolevel, "value"], []);
      return a;
    }, {})

    const data = this.censusLayer.getGeoids()
      .reduce((a, c) => {
        a.push({
          cousub: Object.keys(bgsInCousubs).reduce((aa, cc) =>
            bgsInCousubs[cc].includes(c) ? get(this.censusLayer, ["falcorCache", "geo", cc, "name"], aa) : aa
          , "Unknown Cousub"),
          county: get(this.censusLayer, ["falcorCache", "geo", c.slice(0, 5), "name"], "Unknown County"),
          "geo level": this.props.geolevel,
          geoid: c,
          "census keys": makeCensusFormula(this.props),
          [this.props.title]: get(this.censusLayer, ["geoData", c], "no data")
        })
        return a;
      }, [])

    return { data,
      keys: ["county", "cousub", "geo level", "geoid", "census keys", this.props.title]
    };
  }
  saveImage() {
    const canvas = d3selection.select(`#${ this.props.id } canvas.mapboxgl-canvas`).node(),
      newCanvas = document.createElement("canvas");

    newCanvas.width = +canvas.width + 20;
    newCanvas.height = +canvas.height + 80;

    const context = newCanvas.getContext("2d")

    context.fillStyle = "#fff";
    context.fillRect(0, 0, +canvas.width + 20, +canvas.height + 80);

    context.drawImage(canvas, 10, 40);

    const legendWidth = 400;

    let x = 10, y = 30;
    context.font = "1.2rem sans-serif";
    context.fillStyle = "currentColor";
    context.fillText(this.props.title, 10, 30);
    context.fillText(`US Census ${ this.props.year } American Community Survey 5-Year Estimates`, 10, +canvas.height + 65);

    x = +newCanvas.width - legendWidth - 10;
    y = 40;

    context.fillStyle = LightTheme.sidePanelHeaderBg;
    context.fillRect(x, y, legendWidth, 35);

    x += 5;
    y += 5;
    const w = (legendWidth - 10) / this.censusLayer.legend.range.length;
    this.censusLayer.legend.range.forEach((c, i) => {
      context.fillStyle = c;
      context.fillRect(x + i * w, y, w, 10);
    })

    let scale;

    switch (this.censusLayer.legend.type) {
      case "quantile":
        scale = d3scale.scaleQuantile()
          .domain(this.censusLayer.legend.domain)
          .range(this.censusLayer.legend.range);
        break;
      case "quantize":
        scale = d3scale.scaleQuantize()
          .domain(this.censusLayer.legend.domain)
          .range(this.censusLayer.legend.range);
        break;
    }

    const format = (typeof this.censusLayer.legend.format === "function") ?
      this.censusLayer.legend.format :
      d3format(this.censusLayer.legend.format);

    y += 23;
    context.fillStyle = LightTheme.textColor;
    context.font = "12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif";
    context.textAlign = "right";
    this.censusLayer.legend.range.forEach((c, i) => {
      const text = format(scale.invertExtent(c)[1]);
      context.fillText(text, x + w + i * w, y);
    })

    return newCanvas;//.toDataURL();//canvas.toDataURL();
  }
  render() {
    return (
      <div style={ { width: "100%", height: "100%", overflow: "hidden", borderRadius: "4px" } }>
        <div style={ { height: "30px", maxWidth: "calc(100% - 285px)", marginBottom: "5px" } }>
          <Title { ...this.props }/>
          { !this.props.showOptions ? null :
            <Options tableTitle={ this.props.title }
              processDataForViewing={ () => this.processDataForViewing() }
              id={ this.props.id }
              layout={ { ...this.props.layout } }
              saveImage={ fn => this.saveImage(fn) }
              embedProps={ {
                type: this.props.type,
                title: this.props.title,
                geoids: [...this.props.geoids],
                compareGeoid: this.props.compareGeoid,
                censusKeys: [...this.props.censusKeys],
                subtractKeys: [...this.props.subtractKeys],
                divisorKeys: [...this.props.divisorKeys],
                format: this.props.format,
                year: this.props.year,
                geolevel: this.props.geolevel
              } }/>
          }
        </div>
        <div style={ { height: "calc(100% - 35px)", width: "100%" } }>
          <AvlMap sidebar={ false }
            // style={ "mapbox://styles/am3081/ck3971lrq00g71co3ud6ye42i" }
            preserveDrawingBuffer={ true }
            id={ this.props.id }
            layers={ [this.censusLayer] }
            forceCompact={ true }
            layerProps={ {
              [this.censusLayer.name]: {
                title: this.props.title,
                year: this.props.year,
                geoids: [
                  ...this.props.geoids,
                  this.props.compareGeoid
                ].filter(Boolean)
              }
            } }/>
        </div>
      </div>
    )
  }
}

export default withRouter(CensusMap)

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
    this.zoomToBounds = true;
  }
  onAdd() {
// console.log("ON ADD:", this);
    register(this, REDUX_UPDATE, ["graph"]);

    return this.fetchData();
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
    this.title = newProps.title;
    this.zoomToBounds = this.zoomToBounds || !deepequal(oldProps.geoids, newProps.geoids);
	}

  getGeoids() {
    return this.geoids.reduce((a, c) => {
      a.push(...get(this.falcorCache, ["geo", c, this.geolevel, "value"], []));
      return a;
    }, []);
  }
  resetView() {
    if (!this.map) return false;

    const bounds = this.getBounds();

    if (bounds.isEmpty()) return false;

    const tr = this.map.transform,
      nw = tr.project(bounds.getNorthWest()),
      se = tr.project(bounds.getSouthEast()),
      size = se.sub(nw);

    const options = {
      padding: {
        top: 50,
        right: Math.min(50, tr.width * 0.075),
        bottom: Math.min(50, tr.height * 0.075),
        left: Math.min(50, tr.width * 0.075)
      },
      bearing: 0,
      pitch: 0
    }

    options.offset = [
      (options.padding.left - options.padding.right) * 0.5,
      (options.padding.top - options.padding.bottom) * 0.5
    ];

    const scaleX = (tr.width - (options.padding.left + options.padding.right)) / size.x,
      scaleY = (tr.height - (options.padding.top + options.padding.bottom)) / size.y;

    options.center = tr.unproject(nw.add(se).div(2));
    options.zoom = Math.min(tr.scaleZoom(tr.scale * Math.min(scaleX, scaleY)), tr.maxZoom);

    this.map.easeTo(options);

    return true;
  }
  getBounds() {
    const regex = /BOX\((.+)\)/;

    // return this.geoids.reduce((a, c) => {
    return this.getGeoids().reduce((a, c) => {
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
    const regex = /unsd|zcta/;
    const counties = this.geoids.reduce((a, c) => {
      c.length !== 7 && !regex.test(c) && a.push(c.slice(0, 5));
      return a;
    }, []);

// console.log("counties", counties)
    const requests = [
      ["geo", counties, ["name", "cousubs"]],
      ["geo", this.geoids, ["cousubs", this.geolevel, "boundingBox", "name"]]
    ]

    const getGeoms = this.geoids.reduce((a, c) => {
      return a || regex.test(c);
    }, false)
    if (getGeoms) {
      requests.push(["geo", this.geoids.filter(geoid => regex.test(geoid)), "geom"])
    }

    return falcorChunkerNiceWithUpdate(...requests)
      .then(() => {
        const cousubs = this.getAllCousubs();

        return falcorChunkerNiceWithUpdate(["geo", cousubs, ["name", this.geolevel]])
      })
      .then(() => {
        const subGeoids = this.geoids.reduce((a, c) => {
            a.push(...get(this.falcorCache, ["geo", c, this.geolevel, "value"], []))
            return a;
          }, []);

  // console.log("subGeoids", subGeoids)
        return falcorChunkerNiceWithUpdate(
          ["acs", subGeoids, this.year,
            [...this.censusKeys, ...this.divisorKeys, ...this.subtractKeys]
          ],
          ["geo", subGeoids, "boundingBox"],
          ["geo", [...new Set(subGeoids.map(geoid => geoid.slice(0, 5)))], "name"]
        )
      })
      .then(() => {
        if (getGeoms) {
          this.map.getSource("geojson-geom")
            .setData({
              type: "FeatureCollection",
              features: this.geoids
                .filter(geoid => regex.test(geoid))
                .map(geoid => {
                  return {
                    properties: { geoid },
                    geometry: JSON.parse(get(this.falcorCache, ["geo", geoid, "geom", "value"]))
                  }
                })
            })
        }
      })
  }
  getAllCousubs() {
    const regex = /zcta|unsd/
    return this.geoids
      .filter(geoid => geoid.length !== 7)
      .map(geoid => {
        return regex.test(geoid) ? geoid : geoid.slice(0, 5)
      })
      .reduce((a, c) => {
        a.push(...get(this.falcorCache, ["geo", c, "cousubs", "value"], []));
        return a;
      }, []);
  }
  render(map) {
    const geoids = this.getGeoids();

    map.setFilter(this.geolevel, ["in", "geoid", ...geoids]);

    // const cousubs = this.geoids.reduce((a, c) => {
    //   if (c.length === 5) {
    //     const d = get(this.falcorCache, ["geo", c, "cousubs", "value"], []);
    //     a.push(...d);
    //   }
    //   else if (c.length === 10) {
    //     a.push(c);
    //   }
    //   return a;
    // }, [])
    // if (cousubs.length > 0) {
    //   map.setFilter("cousubs-line", ["in", "geoid", ...cousubs]);
    // }
    // else {
    // }

    if ((this.geoids.length === 1) && (this.geoids[0].length === 7)) {
      const geoid = this.geoids[0];
      map.setFilter("places-line", ["in", "geoid", geoid]);
      map.setFilter("places-symbol", ["in", "geoid", geoid]);
      const name = get(this.falcorCache, ["geo", geoid, "name"], "");
      map.setLayoutProperty("places-symbol", "text-field", name);

      map.setFilter("cousubs-symbol", ["in", "geoid", "none"]);
      map.setFilter("cousubs-line", ["in", "geoid", "none"]);
    }
    else {
      map.setFilter("places-line", ["in", "geoid", "none"]);
      map.setFilter("places-symbol", ["in", "geoid", "none"]);

      const allCousubs = this.getAllCousubs(),
        nameMap = allCousubs.reduce((a, c) => {
          a[c] = get(this.falcorCache, ["geo", c, "name"], `Cousub ${ c }`);
          return a;
        }, {});

console.log("COUSBS:", allCousubs, this.falcorCache)

      map.setLayoutProperty("cousubs-symbol", "text-field",
        ["get", ["to-string", ["get", "geoid"]], ["literal", nameMap]]
      )
      map.setFilter("cousubs-symbol", ["in", "geoid", ...allCousubs]);
    }


    this.zoomToBounds && this.resetView() && (this.zoomToBounds = false);

    const valueMap = geoids.reduce((a, c) => {
      let value = this.censusKeys.reduce((aa, cc) => {
        const v = get(this.falcorCache, ["acs", c, this.year, cc], -666666666);
        if (v !== -666666666) {
          aa += v;
        }
        return aa;
      }, 0);
      value -= this.subtractKeys.reduce((aa, cc) => {
        const v = get(this.falcorCache, ["acs", c, this.year, cc], -666666666);
        if (v !== -666666666) {
          aa += v;
        }
        return aa;
      }, 0)
      const divisor = this.divisorKeys.reduce((aa, cc) => {
        const v = get(this.falcorCache, ["acs", c, this.year, cc], -666666666);
// console.log("??????", c, this.year, cc, v)
        if (v != -666666666) {
          aa += v;
        }
        return aa;
      }, 0)
// console.log("DIVISOR:", divisor, this.divisorKeys, this.falcorCache)
      if (divisor !== 0) {
        value /= divisor;
      }
      a[c] = value;
      return a;
    }, {})

    this.geoData = valueMap;

    const values = Object.values(valueMap);
    if (!values.length) return;

    const colorScale = this.getColorScale(values),
      colors = {};
    for (const key in valueMap) {
      colors[key] = colorScale(valueMap[key]);
    }
    geoids.forEach(geoid => {
      colors[geoid] = get(colors, geoid, "#000")
    })

    map.setPaintProperty(this.geolevel, "fill-color",
      ["case",
        ["boolean", ["feature-state", "hover"], false], HOVER_COLOR,
        ["case",
          ["has", ["to-string", ["get", "geoid"]], ["literal", colors]],
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
    geoids: [
      ...props.geoids,
      props.compareGeoid
    ].filter(Boolean) || [],
    year: props.year || 2017,
    censusKeys: props.censusKeys || [],
    subtractKeys: props.subtractKeys || [],
    divisorKeys: props.divisorKeys || [],

    setGeoid: props.setGeoid,
    test: JSON.stringify(props),

    legend: {
      type: "quantile",
      domain: [],
      range: LEGEND_COLOR_RANGE,
      format: props.format || fnum
    },

    geolevel: get(props, "geolevel", "blockgroup"), //"blockgroup",

    onClick: {
      layers: ["blockgroup", "cousubs"],
      dataFunc: function(features) {
        const geoid = get(features, [0, "properties", "geoid"]);
        geoid && this.setGeoid(geoid);
      }
    },

    popover: {
      layers: ["blockgroup", "cousubs"],
      dataFunc: function(topFeature, features) {
        const geoid = get(topFeature, ["properties", "geoid"], null),
          county = geoid.slice(0, 5),
          countyName = get(this.falcorCache, ["geo", county, "name"], ""),
          data = [
            [`${ countyName }${ countyName && " "}Blockgroup`, geoid.slice(5)]
          ],
          value = get(this.geoData, [geoid], null);

        if (value !== null) {
          const format = (typeof this.legend.format === "function") ? this.legend.format : d3format(this.legend.format);
          data.push([this.title, format(value)])
        }
        data.push(["Click to open profile."])

        return data;
      }
    },

    mapActions: {
      reset: {
        Icon: () => <span className="fa fa-2x fa-home"/>,
        tooltip: "Reset View",
        action: function() {
          this.resetView();
        }
      }
      // test: {
      //   tooltip: "Test iframe",
      //   Icon: () => <span className="fa fa-2x fa-car"/>,
      //   action: function() {
      //     this.doAction(["toggleModal", "test"]);
      //   }
      // },
    },

    onHover: {
      layers: ["blockgroup", "cousubs"]
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
      { id: "blockgroup",
        source: {
            'type': "vector",
            'url': 'mapbox://am3081.52dbm7po'
        }
      },
      { id: "places",
        source: {
          type: "vector",
          url: "mapbox://am3081.6u9e7oi9"
        }
      },
      { id: "geojson-geom",
        source: {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] }
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
        filter : ['in', 'geoid', 'none'],
        paint: {
          "fill-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            6, 1.0,
            12, 0.33
          ]
        }
      },

      { 'id': 'cousubs',
        'source': 'cousubs',
        'source-layer': 'cousubs',
        'type': 'fill',
        filter : ['in', 'geoid', 'none'],
        paint: {
          "fill-opacity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            10, 1.0,
            20, 0.5
          ]
        }
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
          // "text-allow-overlap": true,
          // "text-ignore-placement": true
        },
        paint: {
          "text-color": "#000"
        }
      },

      { id: 'places-line',
        source: 'places',
        'source-layer': 'places',
        type: 'line',
        filter: ['in', 'geoid', 'none'],
        paint: {
          'line-color': BORDER_COLOR,
          'line-width': 2
        }
      },
      { id: 'places-symbol',
        source: 'places',
        'source-layer': 'places',
        type: 'symbol',
        filter: ['in', 'geoid', 'none'],
        layout: {
          "symbol-placement": "point",
          "text-size": 12,
          // "text-allow-overlap": true,
          // "text-ignore-placement": true
        },
        paint: {
          "text-color": "#000"
        }
      },
      { id: "geojson-geom",
        source: "geojson-geom",
        type: "line",
        // filter : ['in', 'geoid', 'none'],
        paint: {
          "line-color": BORDER_COLOR,
          "line-width": 2
        }
      },
    ]
  })
}
