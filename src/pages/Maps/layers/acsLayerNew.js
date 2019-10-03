import React from "react"

import MapLayer from "AvlMap/MapLayer"

import get from "lodash.get"
import deepequal from "deep-equal"
import { extent } from "d3-array";
import * as d3scale from "d3-scale"
import { interpolate } from "d3-interpolate"
import * as d3color from "d3-color"

import { falcorGraph, falcorChunkerNiceWithUpdate } from "store/falcorGraph";
import { getColorRange } from "constants/color-ranges"

import { UPDATE as REDUX_UPDATE } from 'utils/redux-falcor'

import { register, unregister } from "AvlMap/ReduxMiddleware"

const LEGEND_COLOR_RANGE = getColorRange(5, "Blues");

let ID = 0;

class Animator {
  static EasingFunctions = {
    linear: t => t,
    easeInQuad: t => t * t,
    easeOutQuad: t => t * (2 - t),
    easeInOutQuad: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: t => t * t * t,
    easeOutCubic: t => (--t) * t * t + 1,
    easeInOutCubic: t => t < .5 ? 4 * t * t * t : (t-1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeInQuart: t => t * t * t * t,
    easeOutQuart: t => 1 - (--t) * t * t * t,
    easeInOutQuart: t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
    easeInQuint: t => t * t * t * t * t,
    easeOutQuint: t => 1 + (--t) * t * t * t * t,
    easeInOutQuint: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
  }
  constructor(options = {}) {
    const {
      ease = "easeInOutQuad",
      baseValue = 0,
      duration = 2000,
      verbose = false
    } = options;

    this.verbose = verbose;

    this.baseValue = baseValue;

    this.requests = [];

    this.prev = {};
    this.prevMeta = {};

    this.ease = get(Animator.EasingFunctions, ease, Animator.EasingFunctions["easeInOutQuad"]);
    this.duration = duration;

    this.timeout = null;
  }
  start(requests) {
    if (!Array.isArray(requests)) {
      requests = [requests];
    }
    for (const { to, callback, meta = {}, animateIf = () => true } of requests) {
      if (to === undefined) {
        this.requests.push({ callback, meta })
      }
      else {
        const request = {
          to,
          callback,
          meta,
          animateIf
        };
        this.requests.push(request);
      }
    }
    this.getRequest();
  }
  initRequest(request) {
    if (typeof request.to === "function") {
      request.to = request.to(this.prevMeta);
    }
    if (!Object.keys(request.to).length) {
      for (const key in this.prev) {
        request.to[key] = this.baseValue;
      }
    }
    request.meta = { ...this.prevMeta, ...request.meta };
    request.from = { ...this.prev };
    request.current = { ...this.prev };
    request.timer = 0;
    request.now = Date.now();
    request.duration = this.duration;
  }
  getRequest() {
    if ((this.timeout === null) && this.requests.length) {
      const request = this.requests.shift();

      if (request.to === undefined) {
        request.callback(this.prevMeta);
        this.prevMeta = { ...this.prevMeta, ...request.meta };
        this.getRequest();
      }
      else if (request.animateIf(this.prevMeta)) {
        this.initRequest(request);
        this.timeout = requestAnimationFrame(() => this.animate(request));
      }
      else {
        this.prevMeta = { ...this.prevMeta, ...request.meta };
        this.getRequest();
      }
    }
  }
  animate(request) {
    const now = Date.now();
    request.timer += (now - request.now);
    request.now = now;

    const t = Math.min(1.0, request.timer / request.duration),
      ease = this.ease(t);

    for (const key in request.to) {
      const from = get(request, ["from", key], this.baseValue),
        to = get(request, ["to", key], this.baseValue),
        interpolator = interpolate(from, to);
      request.current[key] = interpolator(ease);
    }
    request.callback(request.current, this.prevMeta);

    if (t < 1.0) {
      this.timeout = requestAnimationFrame(() => this.animate(request));
    }
    else {
      this.timeout = null;
      this.prev = { ...request.current };
      this.prevMeta = { ...this.prevMeta, ...request.meta };
      this.getRequest();
    }
  }
}

const COUNTIES = [
  '36001', '36083', '36093', '36091',
  '36039','36021','36115','36113'
].sort((a, b) => +a - +b);
const YEARS = [2017, 2016, 2015, 2014];

class ACS_Layer extends MapLayer {
  onAdd(map) {
    register(this, REDUX_UPDATE, ["graph"]);

    this.mapActions.test.disabled = false;
    return falcorGraph.get(
      ["geo", COUNTIES, ["cousubs", "name"]]
    )
    .then(res => {
      const cousubs = COUNTIES.reduce((a, c) => {
        a.push(...get(res, ["json", "geo", c, "cousubs"], []));
        return a;
      }, [])
      return falcorChunkerNiceWithUpdate(["geo", cousubs, "name"])
        .then(() => {
          const cache = falcorGraph.getCache();
          this.filters.area.domain = [
            ...COUNTIES,
            ...cousubs
          ]
          .sort((a, b) => {
            if (a.length === b.length) {
              return +a - +b;
            }
            if (a.length < b.length) {
              return +a < +b.slice(0, 5);
            }
            if (a.length > b.length) {
              return +a.slice(0, 5) - +b;
            }
          })
          .map(geoid => ({
            value: geoid,
            name: get(cache, ["geo", geoid, "name"], geoid)
          }))
        })
    })
    .then(() => this.fetchData())
  }
  onRemove(map) {
    unregister(this);
  }
  receiveMessage(action, data) {
    this.falcorCache = data;
  }
  getBaseGeoids() {
    let geoids = COUNTIES;

    const area = this.filters.area.value;

    if (area.length) {
      geoids = area;
    }
    return geoids;
  }
  getGeoids() {
    const geolevel = this.filters.geolevel.value;

    return this.getBaseGeoids().reduce((a, c) => {
      a.push(...get(this.falcorCache, ["geo", c, geolevel, "value"], []))
      return a;
    }, []);
  }
  fetchData() {
    const geolevel = this.filters.geolevel.value,
      year = this.filters.year.value,
      census = this.filters.census.value;

    const geoids = this.getBaseGeoids();

    return falcorChunkerNiceWithUpdate(
      ["geo", geoids, geolevel]
    )
    .then(() => {
      const cache = falcorGraph.getCache(),
        subGeoids = geoids.reduce((a, c) => {
          a.push(...get(cache, ["geo", c, geolevel, "value"], []))
          return a;
        }, []);
      return falcorChunkerNiceWithUpdate(
        ["acs", subGeoids, year, census]
      )
    })
  }
  toggle3D() {
    this.threeD = !this.threeD;
    const pitch = this.map.getPitch()
    if ((pitch < 45) && this.threeD) {
      this.map.easeTo({ pitch: 65, duration: 2000 });
    }
    else if ((pitch !== 0) && !this.threeD) {
      this.map.easeTo({ pitch: 0, bearing: 0, duration: 2000 });
    }
  }
  render(map) {
    const cache = falcorGraph.getCache(),
      geoids = this.getGeoids(),
      threeD = this.threeD,
      geolevel = this.filters.geolevel.value,
      property = geolevel === "blockgroup" ? "GEOID" : "geoid";

    const valueMap = geoids.reduce((a, c) => {
      const value = get(cache, ["acs", c, this.filters.year.value, this.filters.census.value], null);
      if ((value !== null) && (value !== -666666666)) {
        a[c] = value;
      }
      return a;
    }, {})
    const values = Object.values(valueMap);

    const colorScale = this.getColorScale(values),
      colors = {};
    for (const key in valueMap) {
      colors[key] = colorScale(valueMap[key]);
    }
    geoids.forEach(geoid => {
      colors[geoid] = get(colors, geoid, "#000")
    })
    const colorKeys = Object.keys(colors);

    const heightScale = d3scale.scaleLinear()
      .domain(extent(values))
      .range([0, threeD ? 50000 : 0]);
    const newValueMap = geoids.reduce((a, c) => {
      a[c] = heightScale(get(valueMap, c, 0))
      return a;
    }, {});

    const exit = (values, prevMeta) => {
      const oldGeolevel = get(prevMeta, "geolevel", geolevel),
        oldProperty = oldGeolevel === "blockgroup" ? "GEOID" : "geoid";
      map.setPaintProperty(oldGeolevel, "fill-extrusion-height",
        ["get", ["to-string", ["get", oldProperty]], ["literal", values]]
      );
    }
    const exitIf = prevMeta => {
      const oldGeolevel = get(prevMeta, "geolevel", false),
        oldThreeD = get(prevMeta, "threeD", threeD),
        oldGeoids = get(prevMeta, "geoids", []);

      return (oldGeolevel && (oldGeolevel !== geolevel) && threeD) ||
        (oldThreeD && !threeD) ||
        ((oldGeolevel === geolevel) && (geoids.length < oldGeoids.length) && threeD);
    }
    const exitTo = prevMeta => {
      const oldGeolevel = get(prevMeta, "geolevel", false),
        oldThreeD = get(prevMeta, "threeD", threeD),
        oldGeoids = get(prevMeta, "geoids", []);

      if ((oldGeolevel === geolevel) && (geoids.length < oldGeoids.length)) {
        const to = {};
        oldGeoids.forEach(geoid => {
          to[geoid] = get(newValueMap, geoid, 0);
        })
        return to;
      }
      return {};
    }
    const filterAndPaint = prevMeta => {
      const oldGeolevel = get(prevMeta, "geolevel", false);
      if (oldGeolevel && (oldGeolevel !== geolevel)) {
        map.setFilter(oldGeolevel, ["in", "none", "none"]);
      }
      map.setFilter(geolevel, ["in", property, ...geoids]);
      this.colorAnimators[geolevel].start({
        to: colors,
        callback: values => {
          map.setPaintProperty(geolevel, "fill-extrusion-color",
        		["case",
        			["boolean", ["feature-state", "hover"], false], "#900",
              ["match", ["to-string", ["get", property]], colorKeys,
                ["get", ["to-string", ["get", property]], ["literal", values]],
                "#000"
              ]
        		]
          )
        } // END callback
      })
    }
    const callback = values => {
      map.setPaintProperty(geolevel, "fill-extrusion-height",
        ["get", ["to-string", ["get", property]], ["literal", values]]
      );
    }
    const animateIf = () => threeD;
    this.animator.start([
      { to: exitTo, callback: exit, animateIf: exitIf },
      { callback: filterAndPaint },
      { to: newValueMap, callback, animateIf, meta: { geoids, geolevel, threeD } }
    ])
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

export default (options = {}) => new ACS_Layer("ACS Layer", {
  ...options,

  version: 2.0,

  falcorCache: {},

  geoids: [],
  threeD: false,

  animator: new Animator(),
  colorAnimators: {
    "counties": new Animator({ baseValue: "#fff" }),
    "cousubs": new Animator({ baseValue: "#fff" }),
    "tracts": new Animator({ baseValue: "#fff" }),
    "blockgroup": new Animator({ baseValue: "#fff" })
  },

  // onHover: {
  //   layers: ['counties', 'cousubs', 'tracts', 'blockgroup'],
  //   // dataFunc: function(features, point, lngLat, layerName) {
  //   // 	// DO SOME STUFF
  //   // }
  // },

  filters: {
    area: {
      name: "Area",
      type: "multi",
      value: [],
      domain: []
    },
    geolevel: {
      name: 'Geography Level',
      type: 'single',
      domain: [
        { name: "Counties", value: "counties" },
        { name: "County Subdivisions", value: "cousubs" },
        { name: "Tracts", value: "tracts" },
        { name: "Block Groups", value: "blockgroup" }
      ],
      value: 'tracts',
      onChange: function(oldValue, newValue) {
        if (oldValue !== newValue) {
          this.oldGeolevel = oldValue;
        }
      }
    },
    year: {
      name: "Year",
      type: "single",
      domain: YEARS,
      value: YEARS[0]
    },
    census: {
      name: "Census Labels",
      type: "single",
      domain: [
        { name: "Total Population", value: "B01003_001E" },
        { name: "Median Household Income", value: "B19013_001E" },
        { name: "Median Household Income", value: "B19013_001E" },
        { name: "Median Household Income", value: "B19013_001E" }
      ],
      value: "B01003_001E",
      onChange: function(oldValue, newValue) {
        switch (newValue) {
          case "B19013_001E":
          case "B19013_001E":
            this.legend.format = "$,d";
            break;
          default:
            this.legend.format = ",d";
        }
      }
    }
  },

  legend: {
    title: ({ layer }) => <>{ layer.filters.census.domain.reduce((a, c) => layer.filters.census.value === c.value ? c.name : a, "ACS Layer") }</>,
    type: "quantile",
    types: ["quantile", "quantize"],
    active: true,
    domain: [],
    range: LEGEND_COLOR_RANGE,
    format: ",d"
  },

  mapActions: {
		test: {
			Icon: () => <span className="fa fa-lg fa-car"/>,
			tooltip: "Toogle 3D",
			action: function() {
        if (this.map) {
          this.toggle3D();
          this.render(this.map);
        }
			},
      disabled: true,
      disableFor: 2500
		}
  },

  sources: [
    { id: "counties",
      source: {
        'type': "vector",
        'url': 'mapbox://am3081.1ggw4eku'
      },
    },
    { id: "cousubs",
      source: {
        'type': "vector",
        'url': 'mapbox://am3081.dlnvkxdi'
      },
    },
    { id: "tracts",
      source: {
        'type': "vector",
        'url': 'mapbox://am3081.92hcxki8'
      },
    },
    {
      id: "blockgroup",
      source: {
          'type': "vector",
          'url': 'mapbox://am3081.02eswc9t'
      }
    }
  ],

  layers: [
    { 'id': 'counties',
      'source': 'counties',
      'source-layer': 'counties',
      'type': 'fill-extrusion',
      filter : ['in', 'geoid', 'none']
    },
    { 'id': 'cousubs',
      'source': 'cousubs',
      'source-layer': 'cousubs',
      'type': 'fill-extrusion',
      filter : ['in', 'geoid', 'none']
    },
    { 'id': 'tracts',
      'source': 'tracts',
      'source-layer': 'tracts',
      'type': 'fill-extrusion',
      filter : ['in', 'geoid', 'none']
    },
    {
      id: "blockgroup",
      source: "blockgroup",
      'source-layer': "tl_2017_36_bg",
      'type': 'fill-extrusion',
      filter : ['in', 'GEOID', 'none']
    }
  ],
})
