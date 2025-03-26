import React from "react"

import { Link } from "react-router-dom"

import MapLayer from "AvlMap/MapLayer"
import Animator from "AvlMap/LayerAnimator"

import styled from "styled-components"
import get from "lodash.get"
import deepequal from "deep-equal"
import { extent } from "d3-array";
import * as d3scale from "d3-scale"
import { format as d3format } from "d3-format"

import { falcorGraph, falcorChunkerNiceWithUpdate } from "store/falcorGraph";
import { getColorRange } from "constants/color-ranges"

import { UPDATE as REDUX_UPDATE } from 'utils/redux-falcor'

import { register, unregister } from "AvlMap/ReduxMiddleware"

import { fnum, fmoney } from "utils/sheldusUtils"

import OptionsBox from "./infoboxes/OptionsBox"
import OptionsModal from "./modals/OptionsModal"

import { Button } from "components/common/styled-components"

// ORANGES: ["#feedde", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#8c2d04"]
const HOVER_COLOR = "#f16913";

const LEGEND_COLOR_RANGE = getColorRange(7, "Blues");

const keyRegex = /\w{6}(\w?)_(\d{3})\w/

const ALPHABET = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
  "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
]

const expandKeys = keys =>
  keys.reduce((a, c) => [...a, ...expandKeyRange(c)], [])
const expandKeyRange = key => {
  const split = key.split("...");
  if (split.length === 1) return split;
  const [start, end] = split,
    matchStart = keyRegex.exec(start),
    matchEnd = keyRegex.exec(end);

  if (matchStart[1] !== matchEnd[1] &&
      matchStart[2] === matchEnd[2]) {
    const s = matchStart[1],
      e = matchEnd[1],
      keys = [];
    let c = s;
    while (c <= e) {
      keys.push(start.replace(`${ s }_`, `${ c }_`));
      const index = ALPHABET.indexOf(c);
      c = ALPHABET[index + 1]
    }
    return keys;
  }
  else if (matchStart[2] !== matchEnd[2] &&
            matchStart[1] === matchEnd[1]) {
    const s = +matchStart[2],
      e = +matchEnd[2],
      keys = [];
    for (let i = s; i <= e; ++i) {
      keys.push(start.replace(`_${ matchStart[2] }`, `_${ (`000${ i }`).slice(-3) }`));
    }
    return keys;
  }
  return [start];
}

const processConfig = config => {
  const newConfig = {
// supply defaults
    censusKeys: [],
    divisorKeys: [],
    asDensity: false,

    format: get(config, ["divisorKeys", "length"], 0) ? ",.1%" : fnum,

// override default values
    ...config,

// always use name as value
    value: config.name
  }

  newConfig.censusKeys = expandKeys(newConfig.censusKeys);
  newConfig.divisorKeys = expandKeys(newConfig.divisorKeys);

  return newConfig;
}

const COUNTIES = [
  '36001', '36083', '36093', '36091',
  '36039','36021','36115','36113'
].sort((a, b) => +a - +b);

const YEARS = [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014];
// const YEARS = [2019, 2018, 2017, 2016, 2015, 2014];

class ACS_Layer extends MapLayer {
  getLayerYears() {
    const year = this.filters.year.value;

    const lYear = year < 2020 ? 2017 : 2020;
    const oYear = year < 2020 ? 2020 : 2017;

    return [lYear, oYear];
  }
  onAdd(map) {
    const year = this.filters.year.value;

    register(this, REDUX_UPDATE, ["graph"]);

    return falcorGraph.get(
      ["geo", COUNTIES, year, ["cousubs", "zcta", "unsd"]],
      ["geo", COUNTIES, "year", year, "name"]
    )
    .then(res => {

      const cousubs = COUNTIES.reduce((a, c) => {
        a.push(...get(res, ["json", "geo", c, year, "cousubs"], []));
        return a;
      }, []);

      const zctas = COUNTIES.reduce((a, c) => {
        a.push(...get(res, ["json", "geo", c, year, "zcta"], []));
        return a;
      }, []);

      const unsds = COUNTIES.reduce((a, c) => {
        a.push(...get(res, ["json", "geo", c, year, "unsd"], []));
        return a;
      }, []);

      const layerYears = this.getLayerYears();

      map.setFilter(`cousubs-labels-${ layerYears[0] }`, ["in", "geoid", ...cousubs]);
      map.setFilter(`cousubs-outline-${ layerYears[0] }`, ["in", "geoid", ...cousubs]);

      map.setFilter(`cousubs-labels-${ layerYears[1] }`, ["in", "geoid", "none"]);
      map.setFilter(`cousubs-outline-${ layerYears[1] }`, ["in", "geoid", "none"]);

      return falcorChunkerNiceWithUpdate(["geo", [...cousubs, ...unsds], "year", year, "name"])
        .then(() => {
          const nameMap = cousubs.reduce((a, c) => {
            a[c] = get(this.falcorCache, ["geo", c, "year", year, "name"], `Cousub ${ c }`);
            return a;
          }, {})
          map.setLayoutProperty("cousubs-labels-2017", "text-field",
            ["get", ["to-string", ["get", "geoid"]], ["literal", nameMap]]
          )
          map.setLayoutProperty("cousubs-labels-2020", "text-field",
            ["get", ["to-string", ["get", "geoid"]], ["literal", nameMap]]
          )

          const cache = falcorGraph.getCache();

          const areaGroups = [
            { name: "Counties",
              options: COUNTIES.map(geoid => ({
                value: geoid,
                name: get(cache, ["geo", geoid, "year", year, "name"], geoid)
              })).sort((a, b) => a.name.localeCompare(b.name))
            },
            { name: "Municipalities",
              options: cousubs.map(geoid => ({
                value: geoid,
                name: get(cache, ["geo", geoid, "year", year, "name"], geoid)
              })).sort((a, b) => a.name.localeCompare(b.name))
            },
            { name: "UNSDs",
              options: unsds.map(geoid => ({
                value: geoid,
                name: get(cache, ["geo", geoid, "year", year, "name"], geoid)
              })).sort((a, b) => a.name.localeCompare(b.name))
            },
            { name: "ZCTAs",
              options: zctas.map(geoid => ({
                value: geoid,
                name: geoid.replace("-36", " ").toUpperCase()
              })).sort((a, b) => a.name.localeCompare(b.name))
            }
          ]
          this.filters.area.groups = areaGroups;
          this.filters.area.domain = areaGroups.reduce((a, c) => {
            a.push(...c.options);
            return a;
          }, []);
          // this.filterAreas();
        })
    })
    .then(() => this.fetchData())
    .then(() => {
      this.mapActions.toggle.disabled = false;
      this.mapActions.reset.disabled = false;
      this.threeD && map.easeTo({ pitch: 65, bearing: 45, duration: 3000 });
    })
  }
  onRemove(map) {
    unregister(this);
  }

  // filterAreas() {
  //   // console.log("FILTER AREAS:", this);
  //   const year = this.filters.year.value;
  //
  //   const cache = falcorGraph.getCache();
  //
  //   const cousubs = COUNTIES.reduce((a, c) => {
  //     a.push(...get(cache, ["geo", c, year, "cousubs", "value"], []));
  //     return a;
  //   }, []);
  //
  //   const zctas = COUNTIES.reduce((a, c) => {
  //     a.push(...get(cache, ["geo", c, year, "zcta", "value"], []));
  //     return a;
  //   }, []);
  //
  //   const unsds = COUNTIES.reduce((a, c) => {
  //     a.push(...get(cache, ["geo", c, year, "unsd", "value"], []));
  //     return a;
  //   }, []);
  //
  //   const filterMuni = this.filters.muni.value,
  //     filterCounty = this.filters.county.value,
  //     filterZCTA = this.filters.zcta.value,
  //     filterUNSD = this.filters.unsd.value;
  //
  //   this.filters.area.domain = [
  //     ...COUNTIES,
  //     ...cousubs,
  //     ...zctas,
  //     ...unsds
  //   ]
  //   .filter(geoid => {
  //     return (
  //       !(filterMuni || filterCounty || filterZCTA || filterUNSD) ||
  //       (filterMuni && (geoid.length === 10)) ||
  //       (filterCounty && (geoid.length === 5)) ||
  //       (filterZCTA && geoid.includes("zcta")) ||
  //       (filterUNSD && geoid.includes("unsd"))
  //     );
  //   })
  //   .map(geoid => ({
  //     value: geoid,
  //     name: /zcta/.test(geoid) ?
  //       geoid.replace("-36", " ").toUpperCase() :
  //       get(cache, ["geo", geoid, "name"], geoid)
  //   }))
  //   .sort((a, b) => {
  //     if (/zcta/.test(a.value) && !/zcta/.test(b.value)) {
  //       return 1;
  //     }
  //     else if (/zcta/.test(b.value) && !/zcta/.test(a.value)) {
  //       return -1;
  //     }
  //     else if (/zcta/.test(b.value) && /zcta/.test(a.value)) {
  //       return a.value.localeCompare(b.value);
  //     }
  //     else if (/unsd/.test(a.value) && !/unsd/.test(b.value)) {
  //       return 1;
  //     }
  //     else if (/unsd/.test(b.value) && !/unsd/.test(a.value)) {
  //       return -1;
  //     }
  //     else if (/unsd/.test(b.value) && /unsd/.test(a.value)) {
  //       return a.name.localeCompare(b.name);
  //     }
  //     else if (a.value.length === b.value.length) {
  //       return +a.value - +b.value;
  //     }
  //     else if (a.value.length < b.value.length) {
  //       return +a.value < +b.value.slice(0, 5);
  //     }
  //     else if (a.value.length > b.value.length) {
  //       return +a.value.slice(0, 5) - +b.value;
  //     }
  //   })
  // }
  onFilterFetch(filterName, prev, curr) {
    if (filterName in ["muni"]) {
      return Promise.resolve();
    }
    return this.fetchData();
  }

	receiveProps(oldProps, newProps) {
    this.history = newProps.history;
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
    const year = this.filters.year.value;

    return this.getBaseGeoids().reduce((a, c) => {
      a.push(...get(this.falcorCache, ["geo", c, year, geolevel, "value"], []));
      return a;
    }, []);
  }
  selectGeoid(geoid) {
    if (!geoid) return;

    if (this.selectedGeoids.includes(geoid)) return;

    this.infoBoxes.selectedGeoids.show = true;

    if (this.selectedGeoids.length === 2) {
      this.selectedGeoids = [this.selectedGeoids[1], geoid];
    }
    else {
      this.selectedGeoids.push(geoid);
    }
    this.forceUpdate();
  }
  removeSelectedGeoid(geoid) {
    this.selectedGeoids = this.selectedGeoids.filter(g => g !== geoid);
    this.infoBoxes.selectedGeoids.show = Boolean(this.selectedGeoids.length);
    this.forceUpdate();
  }
  viewProfile() {
    const [g1, g2] = this.selectedGeoids,
      url = `/profile/${ g1 }${ g2 ? `/compare/${ g2 }` : "" }`;

    this.infoBoxes.selectedGeoids.show = false;
    this.selectedGeoids = [];

    this.history.push(url);
  }
  fetchData() {
    const geolevel = this.filters.geolevel.value,
      year = this.filters.year.value,
      filter = this.filters.census,
      value = filter.value,
      census = [
        ...filter.domain.reduce((a, c) => c.value === value ? c.censusKeys : a, []),
        ...filter.domain.reduce((a, c) => c.value === value ? c.divisorKeys : a, [])
      ];

    const geoids = this.getBaseGeoids();

    // falcorGraph.get(["geo", geoids.slice(0, 10), year, geolevel])
    //   .then(res => console.log("RES:", res));

    return falcorChunkerNiceWithUpdate(
      ["geo", geoids, year, geolevel]
    )
    .then(() => {
      const cache = falcorGraph.getCache(),
        subGeoids = geoids.reduce((a, c) => {
          a.push(...get(cache, ["geo", c, year, geolevel, "value"], []))
          return a;
        }, []);

      return falcorChunkerNiceWithUpdate(
        ["acs", subGeoids, year, census]
      )
    })
  }
  toggle3D() {
    this.threeD = !this.threeD;
    const mapPitch = this.map.getPitch(),
      mapBearing = this.map.getBearing();

    if ((mapPitch < (65 * 0.5)) && this.threeD) {
      const bearing = Math.abs(mapBearing) < 45 ? (Math.sign(mapBearing) || 1) * 45 : mapBearing;
      this.map.easeTo({ pitch: 65, bearing, duration: 2000 });
    }
    else if ((mapPitch !== 0) && !this.threeD) {
      this.map.easeTo({ pitch: 0, bearing: 0, duration: 2000 });
    }
    if (this.threeD) {
      this.map.setLayoutProperty(`cousubs-labels-2017`, "visibility", "none")
      this.map.setLayoutProperty(`cousubs-outline-2017`, "visibility", "none")

      this.map.setLayoutProperty(`cousubs-labels-2020`, "visibility", "none")
      this.map.setLayoutProperty(`cousubs-outline-2020`, "visibility", "none")
    }
    else {
      const years = this.getLayerYears();

      this.map.setLayoutProperty(`cousubs-labels-${ years[0] }`, "visibility", "visible")
      this.map.setLayoutProperty(`cousubs-outline-${ years[0] }`, "visibility", "visible")

      this.map.setLayoutProperty(`cousubs-labels-${ years[1] }`, "visibility", "none")
      this.map.setLayoutProperty(`cousubs-outline-${ years[1] }`, "visibility", "none")
    }
  }
  render(map) {

    const cache = falcorGraph.getCache(),
      geoids = this.getGeoids(),
      threeD = this.threeD,

      years = this.getLayerYears(),
      geolevel = `${ this.filters.geolevel.value }-${ years[0] }`,

      year = this.filters.year.value,

      censusFilter = this.filters.census,
      censusValue = censusFilter.value,
      censusKeys = censusFilter.domain.reduce((a, c) => c.value === censusValue ? c.censusKeys : a, []),
      divisorKeys = censusFilter.domain.reduce((a, c) => c.value === censusValue ? c.divisorKeys : a, []);

    this.legend.format = censusFilter.domain.reduce((a, c) => c.value === censusValue ? c.format : a, ",d");

    const valueMap = geoids.reduce((a, c) => {
      let value = censusKeys.reduce((aa, cc) => {
        const v = get(cache, ["acs", c, year, cc], -666666666);
        if (v !== -666666666) {
          aa += v;
        }
        return aa;
      }, 0);
      const divisor = divisorKeys.reduce((aa, cc) => {
        const v = get(cache, ["acs", c, year, cc], -666666666);
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
      const oldGeolevel = get(prevMeta, "geolevel", geolevel);
      map.setPaintProperty(oldGeolevel, "fill-extrusion-height",
        ["get", ["to-string", ["get", "geoid"]], ["literal", values]]
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
      this.geoData = { ...this.geoData, ...valueMap };

      const oldGeolevel = get(prevMeta, "geolevel", false);
      if (oldGeolevel && (oldGeolevel !== geolevel)) {
        map.setFilter(oldGeolevel, ["in", "none", "none"]);
      }
      map.setFilter(geolevel, ["in", "geoid", ...geoids]);
      this.colorAnimators[geolevel].start({
        to: colors,
        callback: values => {
          map.setPaintProperty(geolevel, "fill-extrusion-color",
        		["case",
        			["boolean", ["feature-state", "hover"], false], HOVER_COLOR,
              ["match", ["to-string", ["get", "geoid"]], colorKeys,
                ["get", ["to-string", ["get", "geoid"]], ["literal", values]],
                "#000"
              ]
        		]
          )
        } // END callback
      })
    }
    const callback = values => {
      map.setPaintProperty(geolevel, "fill-extrusion-height",
        ["get", ["to-string", ["get", "geoid"]], ["literal", values]]
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

/*
  SOME POSSIBLE FORMATS
  ",d" ==> number with commas
  "$,d" ==> number with commas and leading $ sign
  ",.2%" ==> number converted to percent with commas
              2 digits after decimal point
              with following % sign
*/

const DEFAULT_CONFIG_INDEX = 0;
let currentGroup = null;

const CENSUS_FILTER_CONFIG = [

//---------------------------------------------- OVERVIEW ----------------------------------------------
  { name: "Population 25 Years And Over with an Associate's degree",
    censusKeys: ["B15003_021E"],
    group: "Overview",
    type: "DotDensity",
  },

  { name: "Civilian Employed Population 16 Years And Over by Industry",
    censusKeys: [
      "C24050_002E",
      "C24050_012E",
      "C24050_001E",
      "C24050_003E",
      "C24050_011E",
      "C24050_009E",
      "C24050_008E",
      "C24050_004E",
      "C24050_013E",
      ],
    censusKeyLabels: {
      "C24050_002E" : 'Agriculture, forestry, fishing and hunting, and mining',
      "C24050_012E" : 'Arts, entertainment, and recreation, and accommodation and food service',
      "C24050_001E" : 'Civilian Employed Population 16 Years And Over',
      "C24050_003E" : 'Construction',
      "C24050_011E" : 'Educational services, and health care and social assistance',
      "C24050_009E" : 'Finance and insurance, and real estate and rental and leasing',
      "C24050_008E" : 'Information',
      "C24050_004E" : 'Manufacturing',
      "C24050_013E" : 'Other services, except public administration',
      },
    group: "Overview",
    type: "DotDensity"
  },

  { name: "Total Population",
    censusKeys: ["B01003_001E"],
    group: "Overview"
  },

// Choropleths

 { name: "Percent Lived in the same house 1 year ago",
    censusKeys: ['B07204_002E'],
    divisorKeys: ['B07204_001E'],
    group: "Overview"
  },

 { name: "Percent Moved from abroad",
    censusKeys: ['B07204_016E'],
    divisorKeys: ['B07204_001E'],
    group: "Overview"
  },

 { name: "Percent Moved from different county within same state",
    censusKeys: ['B07204_006E'],
    divisorKeys: ['B07204_001E'],
    group: "Overview"
  },

 { name: "Percent Moved from different state",
    censusKeys: ['B07204_011E'],
    divisorKeys: ['B07204_001E'],
    group: "Overview"
  },

 { name: "Percent Moved within same county",
    censusKeys: ['B07204_005E'],
    divisorKeys: ['B07204_001E'],
    group: "Overview"
  },

 { name: "Median age",
    censusKeys: ['B01002_001E'],
    group: "Overview"
  },

 { name: "Percent With A Disability",
    censusKeys: ['B26108_062E'],
    divisorKeys: ['B26108_061E'],
    group: "Overview"
  },

 { name: "Percent American Indian and Alaska Native alone",
    censusKeys: ['B02001_004E'],
    divisorKeys: ['B02001_001E'],
    group: "Overview"
  },

 { name: "Percent Asian alone",
    censusKeys: ['B02001_005E'],
    divisorKeys: ['B02001_001E'],
    group: "Overview"
  },

 { name: "Percent Black or African American alone",
    censusKeys: ['B02001_003E'],
    divisorKeys: ['B02001_001E'],
    group: "Overview"
  },

 { name: "Percent Hispanic or Latino",
    censusKeys: ['B03001_003E'],
    divisorKeys: ['B02001_001E'],
    group: "Overview"
  },

 { name: "Percent Native Hawaiian and Other Pacific Islander alone",
    censusKeys: ['B02001_006E'],
    divisorKeys: ['B02001_001E'],
    group: "Overview"
  },

 { name: "Percent Not Hispanic or Latino",
    censusKeys: ['B03001_002E'],
    divisorKeys: ['B02001_001E'],
    group: "Overview"
  },

 { name: "Percent Some other race alone",
    censusKeys: ['B02001_007E'],
    divisorKeys: ['B02001_001E'],
    group: "Overview"
  },

 { name: "Percent Two or more races",
    censusKeys: ['B02001_008E'],
    divisorKeys: ['B02001_001E'],
    group: "Overview"
  },

 { name: "Percent White alone",
    censusKeys: ['B02001_002E'],
    divisorKeys: ['B02001_001E'],
    group: "Overview"
  },

//---------------------------------------------- ECONOMY ----------------------------------------------
  {name: "Percent of Workers in the Hospitality Industries",
    censusKeys:[
        "C24030_051E",
        "C24030_024E"
        ],
      divisorKeys: ["C24030_001E"],
      group: "Economy"
  },

  { name: "Worked at Home as a Percent of Total Commuters",
      censusKeys:["B08006_017E"],
      divisorKeys: ["B23025_001E"],
      group: "Economy"

  },

// Choropleths

 { name: "Percent Agriculture, forestry, fishing and hunting, and mining",
    censusKeys: ['C24050_002E'],
    divisorKeys: ['C24050_001E'],
    group: "Economy"
  },

      { name: "Percent Arts, entertainment, and recreation, and accommodation and food services",
    censusKeys: ['C24050_012E'],
    divisorKeys: ['C24050_001E'],
    group: "Economy"
  },

      { name: "Percent Construction",
    censusKeys: ['C24050_003E'],
    divisorKeys: ['C24050_001E'],
    group: "Economy"
  },

      { name: "Percent Educational services, and health care and social assistance",
    censusKeys: ['C24050_011E'],
    divisorKeys: ['C24050_001E'],
    group: "Economy"
  },

  { name: "Percent Finance and insurance, and real estate and rental and leasing",
    censusKeys: ['C24050_009E'],
    divisorKeys: ['C24050_001E'],
    group: "Economy"
  },

  { name: "Percent Information",
    censusKeys: ['C24050_008E'],
    divisorKeys: ['C24050_001E'],
    group: "Economy"
  },

  { name: "Percent Manufacturing",
    censusKeys: ['C24050_004E'],
    divisorKeys: ['C24050_001E'],
    group: "Economy"
  },

  { name: "Percent Other services, except public administration",
    censusKeys: ['C24050_013E'],
    divisorKeys: ['C24050_001E'],
    group: "Economy"
  },

  { name: "Percent Professional, scientific, and management, and administrative and waste management services",
    censusKeys: ['C24050_010E'],
    divisorKeys: ['C24050_001E'],
    group: "Economy"
  },

   { name: "Percent Public administration",
    censusKeys: ['C24050_014E'],
    divisorKeys: ['C24050_001E'],
    group: "Economy"
  },

   { name: "Percent Retail trade",
    censusKeys: ['C24050_006E'],
    divisorKeys: ['C24050_001E'],
    group: "Economy"
  },

  { name: "Percent Transportation and warehousing, and utilities",
    censusKeys: ['C24050_007E'],
    divisorKeys: ['C24050_001E'],
    group: "Economy"
  },

  { name: "Percent Wholesale trade",
    censusKeys: ['C24050_005E'],
    divisorKeys: ['C24050_001E'],
    group: "Economy"
  },

  { name: "Percent Population 16 years and over in the labor force",
    censusKeys: ['B23025_002E'],
    divisorKeys: ['B23025_001E'],
    group: "Economy"
  },

  { name: "Percent Worked in county of residence",
    censusKeys: ['B08130_003E'],
    divisorKeys: ['B08130_001E'],
    group: "Economy"
  },

  { name: "Percent Worked outside county of residence",
    censusKeys: ['B08130_004E'],
    divisorKeys: ['B08130_001E'],
    group: "Economy"
  },

//---------------------------------------------- SOCIAL WELFARE ----------------------------------------------


  { name: "Median Earnings - Less than high school graduate",
    censusKeys: ['B20004_002E'],
    format: "$,d",
    group: "Social Welfare"
  },

  { name: "Percent Poverty Rate",
    censusKeys: ["B17001_002E"],
    divisorKeys: ["B17001_001E"],
    group: "Social Welfare"
  },

  { name: "GINI Index",
    censusKeys: ["B19083_001E"],
    group: "Social Welfare",
    format: ".2f"
  },

// Choropleths

  { name: "Percent country entered 2000 to 2009",
    censusKeys: ['B05005_009E'],
    divisorKeys: ['B05005_001E'],
    group: "Social Welfare"
  },

      { name: "Percent country entered 2010 or later",
    censusKeys: ['B05005_009E'],
    divisorKeys: ['B05005_001E'],
    group: "Social Welfare"
  },

/* duplicate above?
      { name: "Gini Index of Inequality",
    censusKeys: ['B19083_001E'],
    group: "Social Welfare"
  },
*/
      { name: "Median household income",
    censusKeys: ['B19013_001E'],
    group: "Social Welfare"
  },

        { name: "Percent Housholds with $100,000 or more",
    censusKeys: ['B19001_014E', 'B19001_015E', 'B19001_016E', 'B19001_017E'],
    divisorKeys: ['B19001_001E'],
    group: "Social Welfare"
  },

        { name: "Percent Housholds with Less than $24,999",
    censusKeys: ['B19001_002E', 'B19001_003E', 'B19001_004E', 'B19001_005E'],
    divisorKeys: ['B19001_001E'],
    group: "Social Welfare"
  },

        { name: "Poverty Rate",
    censusKeys: ['B17001_002E'],
    divisorKeys: ['B17001_001E'],
    group: "Social Welfare"
  },

        { name: "Percent Households receiving welfare",
    censusKeys: ['B09010_002E'],
    divisorKeys: ['B09010_001E'],
    group: "Social Welfare"
  },

          { name: "Percent Limited English speaking households",
    censusKeys: ['C16002_004E', 'C16002_007E', 'C16002_010E', 'C16002_013E'],
    divisorKeys: ['C16002_001E'],
    group: "Social Welfare"
  },

//---------------------------------------------- HEALTH ----------------------------------------------
  { name: "Percent Health Care Coverage",
    censusKeys: [
        "B27001_004E",
          "B27001_007E",
          "B27001_010E",
          "B27001_013E",
          "B27001_016E",
          "B27001_019E",
          "B27001_022E",
          "B27001_025E",
          "B27001_028E",
          "B27001_032E",
          "B27001_035E",
          "B27001_038E",
          "B27001_041E",
          "B27001_044E",
          "B27001_047E",
          "B27001_050E",
          "B27001_053E",
          "B27001_056E",
        ],
    divisorKeys: ["B27001_001E"],
    group: "Health"
  },

  { name: "Percent of Population Over 60",
    censusKeys:[
        "B01001_018E",
        "B01001_019E",
        "B01001_020E",
        "B01001_021E",
        "B01001_022E",
        "B01001_023E",
        "B01001_024E",
        "B01001_025E",
        "B01001_042E",
        "B01001_043E",
        "B01001_044E",
        "B01001_045E",
        "B01001_046E",
        "B01001_047E",
        "B01001_048E",
        "B01001_049E",
      ],
      divisorKeys: ["B01001_001E"],
      group: "Health"

  },

//---------------------------------------------- EDUCATION ----------------------------------------------
  { name: "Percent of Population with No High School Diploma or Equivalent",
    censusKeys: ['B15003_002E...B15003_016E'],
    divisorKeys: ['B01003_001E'],
    group: "Education"
  },

  { name: "Total Ages 5-19 Not Enrolled in School",
    censusKeys:["B14003_023E...B14003_026E", "B14003_051E...B14003_054E"],
    group: "Education"
  },

  { name: "Percent Ages 3-4 Enrolled in School",
    censusKeys: ['B14003_004E', 'B14003_013E', 'B14003_032E', 'B14003_041E'],
    divisorKeys: ['B14003_004E', 'B14003_013E', 'B14003_022E', 'B14003_032E', 'B14003_041E', 'B14003_050E'],
    group: "Education"
  },

// Choropleths

  { name: "Percent Associate's degree",
    censusKeys: ['B15003_021E'],
    divisorKeys: ['B15003_001E'],
    group: "Education"
  },

  { name: "Percent Bachelor's degree",
    censusKeys: ['B15003_022E'],
    divisorKeys: ['B15003_001E'],
    group: "Education"
  },

  { name: "Percent Doctorate degree",
    censusKeys: ['B15003_025E'],
    divisorKeys: ['B15003_001E'],
    group: "Education"
  },

  { name: "Percent Master's degree",
    censusKeys: ['B15003_023E'],
    divisorKeys: ['B15003_001E'],
    group: "Education"
  },

  { name: "Percent Professional school degree",
    censusKeys: ['B15003_024E'],
    divisorKeys: ['B15003_001E'],
    group: "Education"
  },

    { name: "Percent Regular high school diploma",
    censusKeys: ['B15003_017E'],
    divisorKeys: ['B15003_001E'],
    group: "Education"
  },

    { name: "Percent Enrolled in college, undergraduate years",
    censusKeys: ['B14001_008E'],
    divisorKeys: ['B14001_001E'],
    group: "Education"
  },

    { name: "Percent Enrolled in grade 1 to grade 4",
    censusKeys: ['B14001_005E'],
    divisorKeys: ['B14001_001E'],
    group: "Education"
  },

    { name: "Percent Enrolled in grade 5 to grade 8",
    censusKeys: ['B14001_006E'],
    divisorKeys: ['B14001_001E'],
    group: "Education"
  },

    { name: "Percent Enrolled in grade 9 to grade 12",
    censusKeys: ['B14001_007E'],
    divisorKeys: ['B14001_001E'],
    group: "Education"
  },

    { name: "Percent Enrolled in kindergarten",
    censusKeys: ['B14001_004E'],
    divisorKeys: ['B14001_001E'],
    group: "Education"
  },

    { name: "Percent Enrolled in nursery school, preschool",
    censusKeys: ['B14001_003E'],
    divisorKeys: ['B14001_001E'],
    group: "Education"
  },

    { name: "Percent Enrolled in school",
    censusKeys: ['B14001_002E'],
    divisorKeys: ['B14001_001E'],
    group: "Education"
  },

      { name: "Percent Graduate or professional school",
    censusKeys: ['B14001_009E'],
    divisorKeys: ['B14001_001E'],
    group: "Education"
  },

//---------------------------------------------- HOUSING ----------------------------------------------
  {   name: "Percent Homeowners 65 and Older",
      censusKeys:["B25007_009E", "B25007_010E", "B25007_011E"],
      divisorKeys: ['B25007_001E'],
      group: "Housing"
  },

// Choropleths

      { name: "Percent Housing Units Built 1939 or earlier",
    censusKeys: ['B25034_011E'],
    divisorKeys: ['B25034_001E'],
    group: "Housing"
  },

      { name: "Percent Housing Units Built 1940 to 1949",
    censusKeys: ['B25034_010E'],
    divisorKeys: ['B25034_001E'],
    group: "Housing"
  },

        { name: "Percent Housing Units Built 1950 to 1959",
    censusKeys: ['B25034_009E'],
    divisorKeys: ['B25034_001E'],
    group: "Housing"
  },

      { name: "Percent Housing Units Built 1960 to 1969",
    censusKeys: ['B25034_008E'],
    divisorKeys: ['B25034_001E'],
    group: "Housing"
  },

        { name: "Percent Housing Units Built 1970 to 1979",
    censusKeys: ['B25034_007E'],
    divisorKeys: ['B25034_001E'],
    group: "Housing"
  },

      { name: "Percent Housing Units Built 1980 to 1989",
    censusKeys: ['B25034_006E'],
    divisorKeys: ['B25034_001E'],
    group: "Housing"
  },

        { name: "Percent Housing units built 1990 to 1999",
    censusKeys: ['B25034_005E'],
    divisorKeys: ['B25034_001E'],
    group: "Housing"
  },

      { name: "Percent Housing units built 2000 to 2009",
    censusKeys: ['B25034_004E'],
    divisorKeys: ['B25034_001E'],
    group: "Housing"
  },

        { name: "Percent Housing units built 2010 or later",
    censusKeys: ['B25034_003E', 'B25034_002E'],
    divisorKeys: ['B25034_001E'],
    group: "Housing"
  },

      { name: "Percent Occupied housing units",
    censusKeys: ['B25002_002E'],
    divisorKeys: ['B25034_001E'],
    group: "Housing"
  },

  { name: "Total Vacant Housing Units",
    censusKeys: ["B25002_003E"],
    // divisorKeys: ['B25002_001E'],
    group: "Housing"
  },

  { name: "Percent Vacant housing units",
    censusKeys: ['B25002_003E'],
    divisorKeys: ['B25034_001E'],
    group: "Housing"
  },

      { name: "Percent Owner occupied housing units",
    censusKeys: ['B25117_002E'],
    divisorKeys: ['B25117_001E'],
    group: "Housing"
  },

        { name: "Percent Owner occupied housing units with Solar ",
    censusKeys: ['B25117_009E'],
    divisorKeys: ['B25117_001E'],
    group: "Housing"
  },

      { name: "Percent Renter occupied housing units",
    censusKeys: ['B25117_012E'],
    divisorKeys: ['B25117_001E'],
    group: "Housing"
  },

        { name: "Percent Renter occupied housing units with Solar",
    censusKeys: ['B25117_019E'],
    divisorKeys: ['B25117_001E'],
    group: "Housing"
  },

//---------------------------------------------- TRANSPORTATION ----------------------------------------------
  { name: "Bike/Ped as a Percent of Total Commuters",
    censusKeys: ["B08006_014E", "B08006_015E"],
    divisorKeys: ["B23025_001E"],
    group: "Transportation"
  },

// Choropleths

 { name: "Percent Households with No Vehicles",
    censusKeys: ['B08201_002E'],
    divisorKeys: ['B08201_001E'],
    group: "Transportation"
  },

 { name: "Percent Car, truck, or van - carpooled to work",
    censusKeys: ['B08006_004E'],
    divisorKeys: ['B080011_001E'],
    group: "Transportation"
  },

 { name: "Percent Car, truck, or van - drove alone to work",
    censusKeys: ['B08006_003E'],
    divisorKeys: ['B080011_001E'],
    group: "Transportation"
  },

 { name: "Percent Public transportation (excluding taxicab) to work",
    censusKeys: ['B08006_008E'],
    divisorKeys: ['B080011_001E'],
    group: "Transportation"
  },

 { name: "Percent Taxicab, motorcycle, bicycle, or other means to work",
    censusKeys: ['B08006_016E'],
    divisorKeys: ['B080011_001E'],
    group: "Transportation"
  },

 { name: "Percent Walked to work",
    censusKeys: ['B08006_015E'],
    divisorKeys: ['B080011_001E'],
    group: "Transportation"
  },

 { name: "Percent Worked at home",
    censusKeys: ['B08006_017E'],
    divisorKeys: ['B080011_001E'],
    group: "Transportation"
  },

   { name: "Percent workers no vehicle available",
    censusKeys: ['B08014_002E'],
    divisorKeys: ['B08014_001E'],
    group: "Transportation"
  },

//------------------------------------- End of New Organization Progress --------------------------------------

].map(processConfig);

const Close = styled.span`
  text-align: right;
  cursor: pointer;
  color: currentColor;
  &:hover {
    color: #b00;
  }
`

const Geoid = ({ geoid, remove, compare = false }) => {
  return !geoid ? null : (
    <div style={ { width: "100%", display: "flex", marginBottom: "0.25rem" } }>
      <div style={ { width: "46%", textAlign: "right", paddingRight: "0.5rem" } }>
        { compare ? "Compare " : "" }GEOID:
      </div>
      <div style={ { width: "46%", paddingLeft: "0.5rem" } }>
        { geoid }
      </div>
      <div style={ { width: "8%" } }>
        <Close className="fa fa-times"
          onClick={ e => remove(geoid) }/>
      </div>
    </div>
  )
}
const LinkButton = styled(Link)`
  text-decoration: none;
  ${ Button } {
    text-decoration: none;
  }
  &:hover {
    text-decoration: none;
  }
  ${ Button }:hover {
    text-decoration: none;
  }
`

const SelectedGeoids = ({ layer }) => {
  const [g1, g2] = layer.selectedGeoids;
  const year = +layer.filters.year.value;

  const remove = React.useMemo(() => {
    return layer.removeSelectedGeoid.bind(layer);
  }, [layer]);

  const href = React.useMemo(() => {
    const cYear = Math.max(2010, year - 5);
    if (g1 && g2) {
      return `/profile/${ g1 }/${ year }/compare/${ g2 }/${ cYear }`;
    }
    return `/profile/${ g1 }/${ year }/${ cYear }`;
  }, [g1, g2, year]);

  return (
    <div style={ {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontSize: "1rem"
    } }>
      <Geoid geoid={ g1 } remove={ remove }/>
      <Geoid geoid={ g2 } remove={ remove } compare/>
      <div>
        <LinkButton to={ href }>
          <Button>
            { g2 ? "Compare" : "View" } Profile{ g2 ? "s" : "" }
          </Button>
        </LinkButton>
      </div>
    </div>
  )
}

export default (options = {}) => new ACS_Layer("ACS Layer", {
  ...options,

  version: 2.0, // ONLY SET THIS IF YOU KNOW WHAT IT MEANS!!!

  selectedGeoids: [],

  falcorCache: {},
  geoData: {},

  threeD: false,

  animator: new Animator(),
  colorAnimators: {
    "counties-2017": new Animator({ baseValue: "#fff" }),
    "cousubs-2017": new Animator({ baseValue: "#fff" }),
    "tracts-2017": new Animator({ baseValue: "#fff" }),
    "blockgroup-2017": new Animator({ baseValue: "#fff" }),
    "zcta-2017": new Animator({ baseValue: "#fff" }),
    "unsd-2017": new Animator({ baseValue: "#fff" }),

    "counties-2020": new Animator({ baseValue: "#fff" }),
    "cousubs-2020": new Animator({ baseValue: "#fff" }),
    "tracts-2020": new Animator({ baseValue: "#fff" }),
    "blockgroup-2020": new Animator({ baseValue: "#fff" }),
    "zcta-2020": new Animator({ baseValue: "#fff" }),
    "unsd-2020": new Animator({ baseValue: "#fff" }),
  },

  onHover: {
    layers: [
      'counties-2017', 'cousubs-2017', 'tracts-2017', 'blockgroup-2017', "zcta-2017", "unsd-2017",
      'counties-2020', 'cousubs-2020', 'tracts-2020', 'blockgroup-2020', "zcta-2020", "unsd-2020"
    ],
    // dataFunc: function(features, point, lngLat, layerName) {
    // 	// DO SOME STUFF
    // }
  },

  onClick: {
    layers: [
      'counties-2017', 'cousubs-2017', 'tracts-2017', 'blockgroup-2017', "zcta-2017", "unsd-2017",
      'counties-2020', 'cousubs-2020', 'tracts-2020', 'blockgroup-2020', "zcta-2020", "unsd-2020"
    ],
    dataFunc: function(features, point, lngLat, layer, e) {
      const geoid = get(features, [0, "properties", "geoid"]);
      this.selectGeoid(geoid);
      // this.history.push("/profile/" + geoid);
    }
  },

  popover: {
    layers: [
      'counties-2017', 'cousubs-2017', 'tracts-2017', 'blockgroup-2017', "zcta-2017", "unsd-2017",
      'counties-2020', 'cousubs-2020', 'tracts-2020', 'blockgroup-2020', "zcta-2020", "unsd-2020"
    ],
    setPinnedState: true,
    onPinned: function(features, lngLat, point) {
      const geoid = get(features, [0, "properties", "geoid"], null);
      geoid && this.map && this.map.setFilter(`${ this.filters.geolevel.value }-line`, ["in", "geoid", geoid]);
    },
    onUnPinned: function() {
      this.map && this.map.setFilter(`${ this.filters.geolevel.value }-line`, ["in", "geoid", "none"]);
    },
    dataFunc: function(topFeature, features) {
      let geoid = get(topFeature, ["properties", "geoid"], "");

      const year = this.filters.year.value;

      const data = [];

      let name = "";
      if (/^zcta-*/.test(geoid)) {
        name = `ZIP Code ${ geoid.slice(-5) }`
      }
      else if (/^unsd-*/.test(geoid) || geoid.length < 11) {
        name = get(this.falcorCache, ["geo", geoid, "year", year, "name"], geoid);
      }
      else if (geoid.length === 11) {
        const county = get(this.falcorCache, ["geo", geoid.slice(0, 5), "year", year, "name"], "County");
        name = county + " Tract " + geoid.slice(5);
      }
      else if (geoid.length === 12) {
        const county = get(this.falcorCache, ["geo", geoid.slice(0, 5), "year", year, "name"], "County");
        name = county + " Block Group " + geoid.slice(5);
      }
      if (name) data.push(name);

      const value = get(this.geoData, [geoid], null);
      if (value !== null) {
        const format = (typeof this.legend.format === "function") ? this.legend.format : d3format(this.legend.format);
        data.push([this.filters.census.value, format(value)])
      }
      // data.push([<Link to={ `/profile/${ geoid }` }>View Profile</Link>]);
      data.push(["Click to view in profile."]);

      return data;
    }
  },

  baseMapSettings: {
    zoom: 7.8,
    center: [-73.8014, 42.91]
  },

  filters: {
    // areaFilterToggle: {
    //   name: "Area Filter Toggles",
    //   type: ""
    // },
    // county: {
    //   name: "Show Counties in Area",
    //   type: "checkbox",
    //   value: false,
    //   onChange: function(prev, curr) {
    //     this.filterAreas();
    //   }
    // },
    // muni: {
    //   name: "Show Municipalities in Area",
    //   type: "checkbox",
    //   value: false,
    //   onChange: function(prev, curr) {
    //     this.filterAreas();
    //   }
    // },
    // unsd: {
    //   name: "Show UNSDs in Area",
    //   type: "checkbox",
    //   value: false,
    //   onChange: function(prev, curr) {
    //     this.filterAreas();
    //   }
    // },
    // zcta: {
    //   name: "Show ZCTAs in Area",
    //   type: "checkbox",
    //   value: false,
    //   onChange: function(prev, curr) {
    //     this.filterAreas();
    //   }
    // },
    area: {
      name: "Area",
      type: "multi-grouped",
      value: [],
      domain: [],
      groups: []
    },
    geolevel: {
      name: 'Geography Level',
      type: 'single',
      domain: [
        { name: "Counties", value: "counties" },
        { name: "Municipalities", value: "cousubs" },
        { name: "Tracts", value: "tracts" },
        { name: "Block Groups", value: "blockgroup" },
        { name: "Zip Codes", value: "zcta" },
        { name: "Unified School Districts", value: "unsd" }
      ],
      value: 'cousubs'
    },
    year: {
      name: "Year",
      type: "single",
      domain: YEARS,
      value: YEARS[0]
    },
    census: {
      name: "Census Labels",
      type: "grouped",
      domain: CENSUS_FILTER_CONFIG,
      value: CENSUS_FILTER_CONFIG[DEFAULT_CONFIG_INDEX].value,
      groups: CENSUS_FILTER_CONFIG.reduce((a, c) => {
        if (get(a, [a.length - 1, "name"]) !== c.group) {
        // if (c.group !== currentGroup) {
          // currentGroup = c.group;
          a.push({
            name: c.group,
            options: []
          });
        }
        a[a.length - 1].options.push(c);
        return a;
      }, [])
    },
    opacity: {
      name: "Opacity",
      type: "slider",
      value: 1,
      min: 0,
      max: 1,
      onChange: function(oldValue, newValue) {
// console.log("SLIDER:", oldValue, newValue)
        if (this.map) {
          ['counties-2017', 'cousubs-2017', 'tracts-2017', 'blockgroup-2017', 'zcta-2017', 'unsd-2017',
            'counties-2020', 'cousubs-2020', 'tracts-2020', 'blockgroup-2020', 'zcta-2020', 'unsd-2020'
          ].forEach(l => {
            this.map.setPaintProperty(l, "fill-extrusion-opacity", newValue)
          })
        }
      }
    }
  },

  infoBoxes: {
    selectedGeoids: {
      title: null,
      closable: false,
      comp: SelectedGeoids,
      show: false
    },
    controls: {
      title: () => null,
      closable: false,
      comp: OptionsBox,
      show: true
    }
  },

  // infoBoxes: {
  //   test: {
  //     title: "TEST INFO BOX",
  //     comp: () => <div>TESTING INFO BOX</div>,
  //     show: true
  //   }
  // },

  modals: {
    options: {
      comp: OptionsModal,
      position: "top",
      startSize: [1000, 550]
    }
  },

  legend: {
    title: ({ layer }) => <>{ layer.filters.census.value }</>,
    type: "quantile",
    types: ["quantile", "quantize"],
    active: true,
    domain: [],
    range: [...LEGEND_COLOR_RANGE],
    format: CENSUS_FILTER_CONFIG[DEFAULT_CONFIG_INDEX].format
  },

  attributesTableOptions: {
    dataFunc: function({ layer, geoid }) {
      const censusName = this.filters.census.value,
        value = get(this, ["geoData", geoid], "no data");

      return { layer, geoid,
        "census name": censusName,
        value
      };
    }
  },

  mapActions: {
    // test: {
    //   tooltip: "Test iframe",
    //   Icon: () => <span className="fa fa-2x fa-car"/>,
    //   action: function() {
    //     this.doAction(["toggleModal", "test"]);
    //   }
    // },
		toggle: {
			Icon: ({ layer }) => (
        <div style={ { paddingBottom: "2px" } }>
          <span className={ `fa fa-2x fa-chevron-${ layer.threeD ? "down" : "up" }` }/>
        </div>
      ),
			tooltip: ({ layer }) => <>{ `Toogle 3D ${ layer.threeD ? "Off" : "On" }` }</>,
			action: function() {
        if (this.map) {
          this.toggle3D();
          this.render(this.map);
        }
			},
      disabled: true,
      disableFor: 2500
		},
    reset: {
      Icon: () => <span className="fa fa-2x fa-home"/>,
      tooltip: "Reset View",
      disableFor: 2500,
      disabled: true,
      action: function() {
        const bearing = this.threeD ? 45 : 0,
          pitch = this.threeD ? 65 : 0;
        if (this.map) {
          this.map.easeTo({
            ...this.baseMapSettings,
            pitch,
            bearing,
            duration: 2000
          })
        }
      }
    }
  },

  sources: [
    // { id: "the-one-tile",
    //   source: {
    //     type: "vector",
    //     url: "mapbox://am3081.9rcqae8k"
    //   }
    // }
    { id: "counties-2017",
      source: {
        'type': "vector",
        'url': 'mapbox://am3081.a8ndgl5n'
      },
    },
    { id: "cousubs-2017",
      source: {
        'type': "vector",
        'url': 'mapbox://am3081.36lr7sic'
      },
    },
    { id: "tracts-2017",
      source: {
        'type': "vector",
        'url': 'mapbox://am3081.2x2v9z60'
      },
    },
    { id: "blockgroup-2017",
      source: {
          'type': "vector",
          'url': 'mapbox://am3081.52dbm7po'
      }
    },
    { id: "zcta-2017",
      source: {
          'type': "vector",
          'url': `https://tiles.availabs.org/data/zip_codes_2017.json`
      }
    },
    { id: "unsd-2017",
      source: {
          'type': "vector",
          'url': 'https://tiles.availabs.org/data/school_districts_2017.json'
      }
    },

    { id: "counties-2020",
      source: {
        'type': "vector",
        'url': 'https://tiles.availabs.org/data/tl_2020_36_county.json'
      },
    },
    { id: "cousubs-2020",
      source: {
        'type': "vector",
        'url': 'https://tiles.availabs.org/data/tl_2020_36_cousub.json'
      },
    },
    { id: "tracts-2020",
      source: {
        'type': "vector",
        'url': 'https://tiles.availabs.org/data/tl_2020_36_tract.json'
      },
    },
    { id: "blockgroup-2020",
      source: {
          'type': "vector",
          'url': 'https://tiles.availabs.org/data/tl_2020_36_bg.json'
      }
    },
    { id: "zcta-2020",
      source: {
          'type': "vector",
          'url': `https://tiles.availabs.org/data/tl_2020_36_zcta.json`
      }
    },
    { id: "unsd-2020",
      source: {
          'type': "vector",
          'url': 'https://tiles.availabs.org/data/tl_2020_36_unsd.json'
      }
    }
  ],

  layers: [
    { 'id': 'counties-2017',
      'source': 'counties-2017',
      'source-layer': 'counties',
      'type': 'fill-extrusion',
      filter : ['in', 'geoid', 'none']
    },
    { 'id': 'cousubs-2017',
      'source': 'cousubs-2017',
      'source-layer': 'cousubs',
      'type': 'fill-extrusion',
      filter : ['in', 'geoid', 'none']
    },
    { 'id': 'tracts-2017',
      'source': 'tracts-2017',
      'source-layer': 'tracts',
      'type': 'fill-extrusion',
      filter : ['in', 'geoid', 'none']
    },
    { id: "blockgroup-2017",
      source: "blockgroup-2017",
      'source-layer': "blockgroups",
      'type': 'fill-extrusion',
      filter : ['in', 'geoid', 'none']
    },
    { id: "zcta-2017",
      source: "zcta-2017",
      'source-layer': "tl_2017_36_zcta510",
      'type': 'fill-extrusion',
      filter : ['in', 'geoid', 'none']
    },
    { id: "unsd-2017",
      source: "unsd-2017",
      'source-layer': "tl_2017_36_unsd",
      'type': 'fill-extrusion',
      filter : ['in', 'geoid', 'none']
    },

    { id: 'cousubs-outline-2017',
      source: 'cousubs-2017',
      'source-layer': 'cousubs',
      type: 'line',
      filter : ['in', 'geoid', 'none'],
      paint: {
        "line-color": "#ddd",
        "line-width": 1
      }
    },

    { 'id': 'counties-line-2017',
      'source': 'counties-2017',
      'source-layer': 'counties',
      'type': 'line',
      paint: {
        "line-width": 2,
        "line-color": HOVER_COLOR,
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "pinned"], false],
          1.0, 0.0
        ]
      }
    },
    { 'id': 'cousubs-line-2017',
      'source': 'cousubs-2017',
      'source-layer': 'cousubs',
      'type': 'line',
      paint: {
        "line-width": 2,
        "line-color": HOVER_COLOR,
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "pinned"], false],
          1.0, 0.0
        ]
      }
    },
    { 'id': 'tracts-line-2017',
      'source': 'tracts-2017',
      'source-layer': 'tracts',
      'type': 'line',
      paint: {
        "line-width": 2,
        "line-color": HOVER_COLOR,
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "pinned"], false],
          1.0, 0.0
        ]
      }
    },
    { 'id': 'blockgroup-line-2017',
      'source': 'blockgroup-2017',
      'source-layer': 'blockgroups',
      'type': 'line',
      paint: {
        "line-width": 2,
        "line-color": HOVER_COLOR,
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "pinned"], false],
          1.0, 0.0
        ]
      }
    },

    { id: 'cousubs-labels-2017',
      source: 'cousubs-2017',
      'source-layer': 'cousubs',
      type: 'symbol',
      filter : ['in', 'geoid', 'none'],
      layout: {
        "symbol-placement": "point",
        "text-size": 12
      },
      paint: {
        "text-color": "#000"
      }
    },


    { 'id': 'counties-2020',
      'source': 'counties-2020',
      'source-layer': 'tl_2020_us_county',
      'type': 'fill-extrusion',
      filter : ['in', 'geoid', 'none']
    },
    { 'id': 'cousubs-2020',
      'source': 'cousubs-2020',
      'source-layer': 'tl_2020_36_cousub',
      'type': 'fill-extrusion',
      filter : ['in', 'geoid', 'none']
    },
    { 'id': 'tracts-2020',
      'source': 'tracts-2020',
      'source-layer': 'tl_2020_36_tract',
      'type': 'fill-extrusion',
      filter : ['in', 'geoid', 'none']
    },
    { id: "blockgroup-2020",
      source: "blockgroup-2020",
      'source-layer': "tl_2020_36_bg",
      'type': 'fill-extrusion',
      filter : ['in', 'geoid', 'none']
    },
    { id: "zcta-2020",
      source: "zcta-2020",
      'source-layer': "tl_2020_36_zcta",
      'type': 'fill-extrusion',
      filter : ['in', 'geoid', 'none']
    },
    { id: "unsd-2020",
      source: "unsd-2020",
      'source-layer': "tl_2020_36_unsd",
      'type': 'fill-extrusion',
      filter : ['in', 'geoid', 'none']
    },

    { id: 'cousubs-outline-2020',
      source: 'cousubs-2020',
      'source-layer': 'tl_2020_36_cousub',
      type: 'line',
      filter : ['in', 'geoid', 'none'],
      paint: {
        "line-color": "#ddd",
        "line-width": 1
      }
    },

    { 'id': 'counties-line-2020',
      'source': 'counties-2020',
      'source-layer': 'tl_2020_us_county',
      'type': 'line',
      paint: {
        "line-width": 2,
        "line-color": HOVER_COLOR,
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "pinned"], false],
          1.0, 0.0
        ]
      }
    },
    { 'id': 'cousubs-line-2020',
      'source': 'cousubs-2020',
      'source-layer': 'tl_2020_36_cousub',
      'type': 'line',
      paint: {
        "line-width": 2,
        "line-color": HOVER_COLOR,
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "pinned"], false],
          1.0, 0.0
        ]
      }
    },
    { 'id': 'tracts-line-2020',
      'source': 'tracts-2020',
      'source-layer': 'tl_2020_36_tract',
      'type': 'line',
      paint: {
        "line-width": 2,
        "line-color": HOVER_COLOR,
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "pinned"], false],
          1.0, 0.0
        ]
      }
    },
    { 'id': 'blockgroup-line-2020',
      'source': 'blockgroup-2020',
      'source-layer': 'tl_2020_36_bg',
      'type': 'line',
      paint: {
        "line-width": 2,
        "line-color": HOVER_COLOR,
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "pinned"], false],
          1.0, 0.0
        ]
      }
    },

    { id: 'cousubs-labels-2020',
      source: 'cousubs-2020',
      'source-layer': 'tl_2020_36_cousub',
      type: 'symbol',
      filter : ['in', 'geoid', 'none'],
      layout: {
        "symbol-placement": "point",
        "text-size": 12
      },
      paint: {
        "text-color": "#000"
      }
    }
  ],
})
