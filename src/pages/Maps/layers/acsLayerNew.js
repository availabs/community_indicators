import React from "react"

import { Link } from "react-router-dom"

import MapLayer from "AvlMap/MapLayer"
import Animator from "AvlMap/LayerAnimator"

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

const YEARS = [2017, 2016, 2015, 2014];

class ACS_Layer extends MapLayer {
  onAdd(map) {
    register(this, REDUX_UPDATE, ["graph"]);

    return falcorGraph.get(
      ["geo", COUNTIES, ["cousubs", "name"]]
    )
    .then(res => {
      const cousubs = COUNTIES.reduce((a, c) => {
        a.push(...get(res, ["json", "geo", c, "cousubs"], []));
        return a;
      }, [])

      map.setFilter('cousubs-labels', ["in", "geoid", ...cousubs])
      map.setFilter('cousubs-outline', ["in", "geoid", ...cousubs])

      return falcorChunkerNiceWithUpdate(["geo", cousubs, "name"])
        .then(() => {
          const nameMap = cousubs.reduce((a, c) => {
            a[c] = get(this.falcorCache, ["geo", c, "name"], `Cousub ${ c }`);
            return a;
          }, {})
          map.setLayoutProperty("cousubs-labels", "text-field",
            ["get", ["to-string", ["get", "geoid"]], ["literal", nameMap]]
          )
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
    .then(() => {
      this.mapActions.toggle.disabled = false;
      this.mapActions.reset.disabled = false;
      this.threeD && map.easeTo({ pitch: 65, bearing: 45, duration: 3000 });
    })
  }
  onRemove(map) {
    unregister(this);
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

    return this.getBaseGeoids().reduce((a, c) => {
      a.push(...get(this.falcorCache, ["geo", c, geolevel, "value"], []));
      return a;
    }, []);
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
      this.map.setLayoutProperty('cousubs-labels', "visibility", "none")
      this.map.setLayoutProperty('cousubs-outline', "visibility", "none")
    }
    else {
      this.map.setLayoutProperty('cousubs-labels', "visibility", "visible")
      this.map.setLayoutProperty('cousubs-outline', "visibility", "visible")
    }
  }
  render(map) {
    const cache = falcorGraph.getCache(),
      geoids = this.getGeoids(),
      threeD = this.threeD,
      geolevel = this.filters.geolevel.value,

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
  { name: "Total Population",
    censusKeys: ["B01003_001E"],
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
    censusKeys: ["B19058"],
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

//---------------------------------------------- HOUSING ----------------------------------------------
  { name: "Percent Vacant Housing Units",
    censusKeys: ["B25002_003E"],
    divisorKeys: ['B25002_001E'],
    group: "Housing"
  },

  {   name: "Percent Homeowners 65 and Older",
      censusKeys:["B25007_009E", "B25007_010E", "B25007_011E"],
      divisorKeys: ['B25007_001E'],
      group: "Housing"
  },
//---------------------------------------------- TRANSPORTATION ----------------------------------------------
  { name: "Bike/Ped as a Percent of Total Commuters",
    censusKeys: ["B08006_014E", "B08006_015E"],
    divisorKeys: ["B23025_001E"],
    group: "Transportation"
  },

//------------------------------------- End of New Organization Progress --------------------------------------

].map(processConfig);

export default (options = {}) => new ACS_Layer("ACS Layer", {
  ...options,

  version: 2.0, // ONLY SET THIS IF YOU KNOW WHAT IT MEANS!!!

  falcorCache: {},
  geoData: {},

  threeD: false,

  animator: new Animator(),
  colorAnimators: {
    "counties": new Animator({ baseValue: "#fff" }),
    "cousubs": new Animator({ baseValue: "#fff" }),
    "tracts": new Animator({ baseValue: "#fff" }),
    "blockgroup": new Animator({ baseValue: "#fff" })
  },

  onHover: {
    layers: ['counties', 'cousubs', 'tracts', 'blockgroup'],
    // dataFunc: function(features, point, lngLat, layerName) {
    // 	// DO SOME STUFF
    // }
  },

  onClick: {
    layers: ["counties", "cousubs", "tracts", "blockgroup"],
    dataFunc: function(features) {
      const geoid = get(features, [0, "properties", "geoid"]);
      // geoid && this.setGeoid(geoid);
      this.history.push("/profile/" + geoid);
      console.log("GEOID:", geoid, this.history)
    }
  },

  popover: {
    layers: ["counties", "cousubs", "tracts", "blockgroup"],
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

      const data = [];

      let name = "";
      if (geoid.length < 11) {
        name = get(this.falcorCache, ["geo", geoid, "name"], geoid);
      }
      else if (geoid.length === 11) {
        const county = get(this.falcorCache, ["geo", geoid.slice(0, 5), "name"], "County");
        name = county + " Tract " + geoid.slice(5);
      }
      else if (geoid.length === 12) {
        const county = get(this.falcorCache, ["geo", geoid.slice(0, 5), "name"], "County");
        name = county + " Block Group " + geoid.slice(5);
      }
      if (name) data.push(name);

      const value = get(this.geoData, [geoid], null);
      if (value !== null) {
        const format = (typeof this.legend.format === "function") ? this.legend.format : d3format(this.legend.format);
        data.push([this.filters.census.value, format(value)])
      }
      // data.push([<Link to={ `/profile/${ geoid }` }>View Profile</Link>]);
      data.push(["Click to open profile."]);

      return data;
    }
  },

  baseMapSettings: {
    zoom: 7.8,
    center: [-73.8014, 42.91]
  },

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
        { name: "Municipalities", value: "cousubs" },
        { name: "Tracts", value: "tracts" },
        { name: "Block Groups", value: "blockgroup" }
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
        if (c.group !== currentGroup) {
          currentGroup = c.group;
          a.push({
            name: currentGroup,
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
      value: 0.8,
      min: 0,
      max: 1,
      onChange: function(oldValue, newValue) {
// console.log("SLIDER:", oldValue, newValue)
        this.map && ['counties', 'cousubs', 'tracts', 'blockgroup'].forEach(l => {
          this.map.setPaintProperty(l, "fill-extrusion-opacity", newValue)
        })
      }
    }
  },

  infoBoxes: {
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
    { id: "counties",
      source: {
        'type': "vector",
        'url': 'mapbox://am3081.a8ndgl5n'
      },
    },
    { id: "cousubs",
      source: {
        'type': "vector",
        'url': 'mapbox://am3081.36lr7sic'
      },
    },
    { id: "tracts",
      source: {
        'type': "vector",
        'url': 'mapbox://am3081.2x2v9z60'
      },
    },
    {
      id: "blockgroup",
      source: {
          'type': "vector",
          'url': 'mapbox://am3081.52dbm7po'
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
      'source-layer': "blockgroups",
      'type': 'fill-extrusion',
      filter : ['in', 'geoid', 'none']
    },

    { id: 'cousubs-outline',
      source: 'cousubs',
      'source-layer': 'cousubs',
      type: 'line',
      filter : ['in', 'geoid', 'none'],
      paint: {
        "line-color": "#b00",
        "line-width": 1
      }
    },

    { 'id': 'counties-line',
      'source': 'counties',
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
    { 'id': 'cousubs-line',
      'source': 'cousubs',
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
    { 'id': 'tracts-line',
      'source': 'tracts',
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
    { 'id': 'blockgroup-line',
      'source': 'blockgroup',
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

    { id: 'cousubs-labels',
      source: 'cousubs',
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
    }
  ],
})
