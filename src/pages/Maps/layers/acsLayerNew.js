import React from "react"

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
    .then(() => {
      this.mapActions.toggle.disabled = false;
      this.mapActions.reset.disabled = false;
      map.easeTo({ pitch: 65, bearing: 45, duration: 3000 });
    })
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
  }
  render(map) {
    const cache = falcorGraph.getCache(),
      geoids = this.getGeoids(),
      threeD = this.threeD,
      geolevel = this.filters.geolevel.value,
      property = geolevel === "blockgroup" ? "GEOID" : "geoid",

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
      this.geoData = { ...this.geoData, ...valueMap };

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

/*
  SOME POSSIBLE FORMATS
  ",d" ==> number with commas
  "$,d" ==> number with commas and leading $ sign
  ",.2%" ==> number converted to percent with commas
              2 digits after decimal point
              with following % sign
*/

const DEFAULT_CONFIG_INDEX = 0;

const CENSUS_FILTER_CONFIG = [

  { name: "Total Population",
    censusKeys: ["B01003_001E"]
  },

  { name: "Median Household Income",
    censusKeys: ["B19013_001E"],
    format: fmoney

  },

  { name: "Percent Poverty Rate",
    censusKeys: ["B17001_002E"],
    divisorKeys: ["B17001_001E"]
  },

  { name: "Percent Vacant Housing Units",
    censusKeys: ["B25002_003E"],
    divisorKeys: ['B25002_001E']
  },

  { name: "Percent Health Care Coverage",
    censusKeys: ["B18135_001E"],
    divisorKeys: ["B01003_001E"]
  },

  { name: "Percent of Population with No High School Diploma or Equivalent",
    censusKeys: ['B15003_002E...B15003_016E'],
    divisorKeys: ['B01003_001E']
  },

  { name: "Median Earnings - Less than high school graduate",
    censusKeys: ['B20004_002E'],
    format: "$,d"
  },
  

  { name: "Total Ages 5-19 Not Enrolled in School",
    censusKeys:["B14003_023E...B14003_026E", "B14003_051E...B14003_054E"],
  },

  { name: "Percent Ages 3-4 Enrolled in School",
    censusKeys: ['B14003_004E', 'B14003_013E', 'B14003_032E', 'B14003_041E'],
    divisorKeys: ['B14003_004E', 'B14003_013E', 'B14003_022E', 'B14003_032E', 'B14003_041E', 'B14003_050E']
  },

  { name: "Bike/Ped as a Percent of Total Commuters",
    censusKeys: ["B08006_014E", "B08006_015E"],
    divisorKeys: ["B23025_001E"]
  }

].map(processConfig)

export default (options = {}) => new ACS_Layer("ACS Layer", {
  ...options,

  version: 2.0, // ONLY SET THIS IF YOU KNOW WHAT IT MEANS!!!

  falcorCache: {},
  geoData: {},

  threeD: true,

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

  popover: {
    layers: ["counties", "cousubs", "tracts", "blockgroup"],
    dataFunc: function(topFeature, features) {
      let geoid = get(topFeature, ["properties", "geoid"], "");
      if (!geoid) {
        geoid = get(topFeature, ["properties", "GEOID"], "");
      }

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
        data.push([this.filters.census.value, format(value)])
      }

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
        { name: "County Subdivisions", value: "cousubs" },
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
      type: "single",
      domain: CENSUS_FILTER_CONFIG,
      value: CENSUS_FILTER_CONFIG[DEFAULT_CONFIG_INDEX].value
    }
  },

  // infoBoxes: {
  //   test: {
  //     title: "TEST INFO BOX",
  //     comp: () => <div>TESTING INFO BOX</div>,
  //     show: true
  //   }
  // },

  // modals: {
  //   test: {
  //     comp: () => (
  //       <iframe src="http://localhost:3000/share/embed?type=%22CensusStackedBarChart%22&geoids=%5B%2236001%22%5D&compareGeoid=null&title=%22Means%20of%20Transportation%20to%20Work%20by%20Sex%22&marginLeft=340&left=%7B%22key%22:%22Male%22,%22color%22:%22__HASH__99ccff%22,%22keys%22:%5B%22B08006_019E%22,%22B08006_020E%22,%22B08006_021E%22,%22B08006_022E%22,%22B08006_023E%22,%22B08006_024E%22,%22B08006_025E%22,%22B08006_026E%22,%22B08006_027E%22,%22B08006_028E%22,%22B08006_029E%22,%22B08006_030E%22,%22B08006_031E%22,%22B08006_032E%22,%22B08006_033E%22,%22B08006_034E%22%5D%7D&right=%7B%22key%22:%22Female%22,%22color%22:%22__HASH__ffafcc%22,%22keys%22:%5B%22B08006_036E%22,%22B08006_037E%22,%22B08006_038E%22,%22B08006_039E%22,%22B08006_040E%22,%22B08006_041E%22,%22B08006_042E%22,%22B08006_043E%22,%22B08006_044E%22,%22B08006_045E%22,%22B08006_046E%22,%22B08006_047E%22,%22B08006_048E%22,%22B08006_049E%22,%22B08006_050E%22,%22B08006_051E%22%5D%7D&labels=%5B%22Car,%20Truck%20or%20Van%22,%22Car,%20Truck%20or%20Van,%20Drove%20Alone%22,%22Car,%20Truck%20or%20Van,%20Carpooled%22,%22Car,%20Truck%20or%20Van,%202-Person%20Carpool%22,%22Car,%20Truck%20or%20Van,%203-Person%20Carpool%22,%22Car,%20Truck%20or%20Van,%204-Person%20Carpool%22,%22Public%20Transportation%20(Excluding%20Taxi)%22,%22Public%20Transportation%20(Excluding%20Taxi),%20Bus%20or%20Trolley%20Bus%22,%22Public%20Transportation%20(Excluding%20Taxi),%20Streetcar%20or%20Trolley%20Car%22,%22Public%20Transportation%20(Excluding%20Taxi),%20Subway%20or%20Elevated%22,%22Public%20Transportation%20(Excluding%20Taxi),%20Railroad%22,%22Public%20Transportation%20(Excluding%20Taxi),%20Ferryboat%22,%22Bicycle%22,%22Walked%22,%22Taxicab,%20Motorcycle,%20or%20Other%22,%22Worked%20at%20Home%22%5D" width="1080" height="360" style={ { border: "2px solid #ccc", borderRadius: "4px" } }/>
  //     )
  //   }
  // },

  legend: {
    title: ({ layer }) => <>{ layer.filters.census.value }</>,
    type: "quantize",
    types: ["quantile", "quantize"],
    active: true,
    domain: [],
    range: [...LEGEND_COLOR_RANGE],
    format: CENSUS_FILTER_CONFIG[DEFAULT_CONFIG_INDEX].format
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
