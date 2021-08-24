import React from "react"

// import { Link } from "react-router-dom"
import deepequal from "deep-equal"
import get from "lodash.get"
import debounce from "lodash.debounce"

import MapLayer from "AvlMap/MapLayer"

import { falcorGraph, falcorChunkerNice } from "store/falcorGraph";

import { getColorRange } from 'constants/color-ranges'

// const r1 = getColorRange(9, "Set1"),
//   r2 = getColorRange(9, "Set3");

// const DEFAULT_COLORS = getColorRange(9, "Set1")

// for (let i = 0; i < 9; ++i) {
//   DEFAULT_COLORS.push(r1[i], r2[i]);
// }

const DEFAULT_COLORS = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff']

const GREATER_COUNTIES = ['36001','36083','36093','36091','36039','36021','36115','36113'];

const CensusConfig = [

//----------------------------------Economy-------------------------------------

  { name: "Industry by Occupation for the Civilian Employed Population 16 Years and Over",
    variables: [
      { key: 'C24050_001E',
        name: "Total"
      },
      { key: 'C24050_002E',
        name: "Agriculture, forestry, fishing and hunting, and mining"
      },
      { key: 'C24050_003E',
        name: "Construction"
      },
      { key: 'C24050_004E',
        name: "Manufacturing"
      },
      { key: 'C24050_005E',
        name: "Wholesale trade"
      },
      { key: 'C24050_006E',
        name: "Retail trade"
      },
      { key: 'C24050_007E',
        name: "Transportation and warehousing, and utilities"
      },
      { key: 'C24050_008E',
        name: "Information"
      },
      { key: 'C24050_009E',
        name: "Finance and insurance, and real estate, and rental and leasing"
      },
      { key: 'C24050_010E',
        name: "Professional, scientific, and management, and administrative, and waste management services"
      },
      { key: 'C24050_011E',
        name: "Educational services, and health care and social assistance"
      },
      { key: 'C24050_012E',
        name: "Arts, entertainment, and recreation, and accommodation and food services"
      },
      { key: 'C24050_013E',
        name: "Other services, except public administration"
      },
      { key: 'C24050_014E',
        name: "Public administration"
      }
    ]
  },

  {
    name: "Employment Status for the Population 16 Years and Over",
    variables: [
      { key: 'B23025_002E',
        name: "Population 16 years and over in the labor force"
      }
    ]
  },

  {
    name: "Household Income in the Past 12 Months (In 2017 Inflation-Adjusted Dollars)",
    variables: [
      { key: ['B19001_014E', 'B19001_015E', 'B19001_016E', 'B19001_017E'],
        name: "$100,000 or more"
      },
      { key: 'B19025_001E',
        name: "Aggregate household income"
      },
      { key: ['B19001_002E', 'B19001_003E', 'B19001_004E', 'B19001_005E'],
        name: "Less than $24,999"
      }
    ]
  },

  {
    name: "Poverty Status in the Past 12 Months by Sex by Age",
    variables: [
      { key: 'B17001_002E',
        name: "Persons in Poverty - Income in the past 12 months below poverty level"
      }
    ]
  },

//----------------------------------Education-------------------------------------

  {
    name: "Educational Attainment for the Population 25 Years And Over",
    variables: [
      { key: 'B15003_021E',
        name: "Associate's degree"
      },
      { key: 'B15003_022E',
        name: "Bachelor's degree"
      },
      { key: 'B15003_025E',
        name: "Doctorate degree"
      },
      { key: 'B15003_023E',
        name: "Master's degree"
      },
      { key: 'B15003_024E',
        name: "Professional school degree"
      },
      { key: 'B15003_017E',
        name: "Regular high school diploma"
      }
    ]  
  },

  {
    name: "School Enrollment by Level of School for the Population 3 Years and Over",
    variables: [      
      { key: 'B14001_008E',
        name: "Enrolled in college, undergraduate years"
      },
      { key: 'B14001_005E',
        name: "Enrolled in grade 1 to grade 4"
      },
      { key: 'B14001_006E',
        name: "Enrolled in grade 5 to grade 8"
      },
      { key: 'B14001_007E',
        name: "Enrolled in grade 9 to grade 12"
      },      
      { key: 'B14001_004E',
        name: "Enrolled in kindergarten"
      },
      { key: 'B14001_003E',
        name: "Enrolled in nursery school, preschool"
      },  
      { key: 'Graduate or professional school',
        name: "B14001_009E"
      },
      { key: ['B15003_022E', 'B15003_025E', 'B15003_023E'],
        name: "Bachelor's Degree Or Higher"
      },
      { key: 'B14001_002E',
        name: "Total enrolled in school"
      }
    ]  
  },

//----------------------------------Housing-------------------------------------

  {
    name: "Year Structure Built",
    variables: [
      { key: 'B25034_011E',
        name: "Housing Units Built 1939 or earlier"
      },
      { key: 'B25034_010E',
        name: "Housing Units Built 1940 to 1949"
      },
      { key: 'B25034_009E',
        name: "Housing Units Built 1950 to 1959"
      },
      { key: 'B25034_008E',
        name: "Housing Units Built 1960 to 1969"
      },
      { key: 'B25034_007E',
        name: "Housing Units Built 1970 to 1979"
      },
      { key: 'B25034_006E',
        name: "Housing Units Built 1980 to 1989"
      },
      { key: 'B25034_005E',
        name: "Housing units built 1990 to 1999"
      },
      { key: 'B25034_004E',
        name: "Housing units built 2000 to 2009"
      },
      { key: ['B25034_003E', 'B25034_002E'],
        name: "Housing Units Built 2010 or later"
      }
    ]
  },

    {
    name: "Occupancy Status",
    variables: [
      { key: 'B25002_001E',
        name: "Total Housing Units"
      },
      { key: 'B25002_003E',
        name: "Vacant housing units"
      }
    ]
  },

    {
    name: "Tenure by House Heating Fuel",
    variables: [
      { key: 'B25117_002E',
        name: "Owner occupied housing units"
      },
      { key: 'B25117_009E',
        name: "Owner occupied housing units with Solar"
      },
      { key: 'B25117_012E',
        name: "Renter occupied housing units"
      },
      { key: 'B25117_019E',
        name: "Renter occupied housing units with Solar"
      }
    ]
  },

//----------------------------------Social Welfare-------------------------------------

  {
    name: "Population Born Outside The United States",
    variables: [
      { key: 'B05005_004E',
        name: "Entered country 2010 or later"
      },
      { key: 'B05005_009E',
        name: "Entered country 2000 to 2009"
      },
      { key: 'B05002_009E',
        name: "Total Born Outside The United States"
      }
    ]
  },

    {
    name: "Receipt of Supplemental Security Income (SS), Cash Public Assistance Income, or Food Stamps/SNAP in the Past 12 Months by Household Type for Children Under 18 Years in Households",
    variables: [
      { key: 'B09010_001E',
        name: "Households receiving welfare"
      }
    ]
  },

  {
    name: "Geographical Mobility in the Past Year for the Current Residence--Population 1 Year And Over",
    variables: [
      { key: 'B07204_002E',
        name: "Lived in the same house 1 year ago"
      },
      { key: 'B07204_016E',
        name: "Moved from abroad"
      },
      { key: 'B07204_006E',
        name: "Moved from different county within same state"
      },
      { key: 'B07204_011E',
        name: "Moved from different state"
      },
      { key: 'B07204_005E',
        name: "Moved within same county"
      }
    ]
  },

  {
    name: "Race",
    variables: [
//      { key: 'B02001_001E',
//        name: "Total Population"
//     },
      { key: 'B02001_004E',
        name: "American Indian and Alaska Native alone"
      },
      { key: 'B02001_005E',
        name: "Asian alone"
      },
      { key: 'B02001_003E',
        name: "Black or African American alone"
      },
      { key: 'B02001_006E',
        name: "Native Hawaiian and Other Pacific Islander alone"
      },
      { key: 'B02001_007E',
        name: "Some other race alone"
      },
      { key: 'B02001_008E',
        name: "Two or more races"
      },
      { key: 'B02001_002E',
        name: "White alone"
      }
    ]
  },

  {
    name: "Ethnicity",
    variables: [
      { key: 'B03001_003E',
        name: "Hispanic or Latino"
      },
      { key: 'B03001_002E',
        name: "Not Hispanic or Latino"
      }
    ]
  },

//----------------------------------Transportation-------------------------------------

   {
    name: "Means of Transportation to Work for Workers 16 Years And Over",
    variables: [
      { key: 'B08006_004E',
        name: "Car, truck, or van - carpooled to work"
      },
      { key: 'B08006_003E',
        name: "Car, truck, or van - drove alone to work"
      },
      { key: 'B08006_008E',
        name: "Public transportation (excluding taxicab) to work"
      },
      { key: 'B08006_016E',
        name: "Taxicab, motorcycle, bicycle, or other means to work"
      },
      { key: ['B08101_034E', 'B08101_035E', 'B08101_036E', 'B08101_037E', 'B08101_038E', 'B08101_039E', 'B08101_040E'],
        name: "Walked to work"
      },
      { key: ['B08101_050E', 'B08101_051E', 'B08101_052E', 'B08101_053E', 'B08101_054E', 'B08101_055E', 'B08101_056E'],
        name: "Worked at home"
      },
      { key: 'B08103_003E',
        name: "Median age of persons who carpooled to work"
      },
      { key: 'B08103_002E',
        name: "Median age of persons who drove alone to work"
      },
      { key: 'B08103_004E',
        name: "Median age of persons who to took public transit to work"
      },
      { key: 'B08103_006E',
        name: "Median age of persons who took a taxicab, motorcycle, bicycle, or other means to work"
      },
      { key: 'B08103_005E',
        name: "Median age of persons who walked to work"
      },
      { key: 'B08103_007E',
        name: "Median age of persons who worked at home"
      }
    ]
  },

  {
    name: "Household Size by Vehicles Available",
    variables: [
      { key: 'B08201_002E',
        name: "Households with No Vehicles"
      }
    ]
  },

  {
    name: "Travel Time to Work",
    variables: [
      { key: ['B08012_003E', 'B08012_002E'],
        name: "Less than 10 minutes travel time to work"
      },
      { key: 'B08012_004E',
        name: "10 to 14 minutes travel time to work"
      },
      { key: 'B08012_005E',
        name: "15 to 19 minutes travel time to work"
      },
      { key: 'B08012_006E',
        name: "20 to 24 minutes travel time to work "
      },
      { key: 'B08012_007E',
        name: "25 to 29 minutes travel time to work"
      },
      { key: 'B08012_008E',
        name: "30 to 34 minutes travel time to work"
      },
      { key: ['B08012_009E', 'B08012_010E'],
        name: "35 to 44 minutes travel time to work"
      },
      { key: 'B08012_011E',
        name: "45 to 59 minutes travel time to work"
      },
      { key: ['B08012_012E', 'B08012_013E'],
        name: "60 or more minutes travel time to work"
      }
    ]
  },

  {
    name: "Means of Transportation to Work by Place of Work--State and County Level",
    variables: [
      { key: 'B08130_003E',
        name: "Worked in county of residence"
      },
      { key: 'B08130_004E',
        name: "Worked outside county of residence"
      }
    ]
  }
]

const getCensusKeys = (layer, keysOnly = true) => {
  const censusValue = get(layer, ["filters", "census", "value"]);
  return CensusConfig.reduce((a, c) => {
    if (keysOnly) {
      return censusValue === c.name ? c.variables.map(v => v.key) : a;
    }
    return censusValue === c.name ? c.variables : a;
  }, []);
}

const CensusLegend = ({ layer }) => {
  const censusValue = get(layer, ["filters", "census", "value"]);
  const censusKeys = getCensusKeys(layer, false);
  return (
    <div style={ {
      display: "grid",
      gap: "0.25rem",
      gridTemplateColumns: "repeat(1, minmax(0, 1fr))"
    } }>
      <div style={ {
        fontWeight: "bold",
        fontSize: "1.5rem"
      } }>
        { censusValue }
      </div>
      { censusKeys.map((ck, i)=> (
          <div key={ ck.key }
            style={ {
              display: "flex",
              alignItems: "center"
            } }>
            <div style={ {
              width: "1.5rem",
              height: "1.5rem",
              minWidth: "1.5rem",
              minHeight: "1.5rem",
              borderRadius: "0.25rem",
              backgroundColor: DEFAULT_COLORS[i],
              marginRight: "0.25rem"
            } }/>
            <div style={ {
              fontSize: "0.9rem",
              lineHeight: "0.9rem"
            } }>
              { ck.name }
            </div>
          </div>
        ))
      }
    </div>
  )
}

class BgPointsLayer extends MapLayer {
  constructor(options = {}) {
    super("Dot Density", options);

    this.version = 2.0; // ONLY SET THIS IF YOU KNOW WHAT IT MEANS!!!

    this.colors = {};

    this.filters = {};
    this.filters.census = {
      name: "Census Variables",
      type: "single",
      domain: CensusConfig.map(c => ({
        value: c.name, ...c
      }))
    };

    this._updateMap = this._updateMap.bind(this);
    this.updateMap = debounce(this._updateMap, 500);
    this.fetchData = this.fetchData.bind(this);
  }
  onAdd(map) {
    return this.fetchData();
  }
  fetchData() {
    const censusKeys = getCensusKeys(this);
    this.infoBoxes.censusLegend.show = Boolean(censusKeys.length);

    return falcorGraph.get(["geo", GREATER_COUNTIES, ["tracts", "name"]])
      .then(res => {
        this.falcorCache = falcorGraph.getCache();
        if (censusKeys.length) {
          const tracts = GREATER_COUNTIES.reduce((a, c) => {
            a.push(...get(res, ["json", "geo", c, "tracts"], []));
            return a;
          }, []);
          return falcorChunkerNice(["acs", tracts, 2019, censusKeys])
            .then(() => {
              this.falcorCache = falcorGraph.getCache();
              this.map.on("sourcedata", this.updateMap);
              this.updateMap();
            });
        }
      })
  }
  onRemove(map) {
    map.off("sourcedata", this.updateMap);
  }
  _updateMap() {
    const features = this.map.querySourceFeatures("tract_points", { sourceLayer: "tract_points_2019" });

    const geoidIndices = {};

    const featuresByGeoid = features.reduce((a, c) => {
      const geoid = c.properties.geoid;
      if (!(geoid in geoidIndices)) {
        geoidIndices[geoid] = a.length;
        a.push([geoid, []]);
      }
      a[geoidIndices[geoid]][1].push(c);
      return a;
    }, []);

    const cache = falcorGraph.getCache();

    const colors = {};

    featuresByGeoid.forEach(([geoid, features]) => {
      features.sort((a, b) => {
        if (a.properties.d === b.properties.d) {
          return a.properties.i - b.properties.i;
        }
        return b.properties.d - a.properties.d;
      })

      if (!(geoid in colors)) {
        colors[geoid] = {};
      }

      const ckValues = getCensusKeys(this)
        .map((k, i) => ({ k, v: get(cache, ["acs", geoid, 2019, k], 0), c: DEFAULT_COLORS[i] }))
        .sort((a, b) => b.v - a.v);

      let ckIndex = 0;

      const done = () => {
        return ckValues.reduce((a, c) => {
          return a && (c.v <= 0);
        }, true)
      }

      while (features.length && !done()) {
        const feature = features.pop();

        const { d, i } = feature.properties;

        let checked = 0;

        while (checked < (ckValues.length * 2)) {
          const data = ckValues[ckIndex % ckValues.length];
          ckIndex %= ckValues.length;

          ++checked;

          if (data.v <= 0) {
            ++ckIndex;
            continue;
          }
          else if (data.v >= d) {
            colors[geoid][i] = data.c;
            data.v -= d;
          }
          else if (checked <= ckValues.length) {
            ++ckIndex;
            continue;
          }
          else {
            colors[geoid][i] = data.c;
            data.v -= d;
          }

          break;
        }
      }
    });

    const paint = ["case"];
    const filter = ["any"]

    for (const geoid in colors) {
      paint.push(
        ["all",
          ["==", ["get", "geoid"], geoid],
          ["has", ["to-string", ["get", "i"]], ["literal", colors[geoid]]]
        ],
        ["get", ["to-string", ["get", "i"]], ["literal", colors[geoid]]]
      )
      filter.push([
        "all",
        ["==", ["get", "geoid"], geoid],
        ["has", ["to-string", ["get", "i"]], ["literal", colors[geoid]]]
      ])
    }
    paint.push("#000");

    this.map.setPaintProperty("tract_points", "circle-color", paint);
    this.map.setFilter("tract_points", filter)
  }
  render() {

  }
  // popover = {
  //   layers: ["tract_points"],
  //   dataFunc: function(topFeature, features) {
  //     const tractSet = new Set(),
  //       countySet = new Set();
  //
  //     const cKeys = getCensusKeys(this, false);
  //
  //     const countyMap = features.reduce((a, c) => {
  //       const tract = c.properties.geoid,
  //         county = tract.slice(0, 5);
  //       if (!a.has(county)) {
  //         a.set(county, new Set());
  //       }
  //       a.get(county).add(tract);
  //       return a;
  //     }, new Map());
  //     return [...countyMap.entries()].reduce((a, c) => {
  //       const [county, tracts] = c;
  //       a.push(
  //         `${ get(this.falcorCache, ["geo", county, "name"]) }`
  //       );
  //       tracts.forEach(tract => {
  //         a.push(
  //           ["Tract", tract],
  //         )
  //         cKeys.forEach(ck => {
  //           a.push([
  //             ck.name,
  //             get(this.falcorCache, ["acs", tract, 2019, ck])
  //           ]);
  //         });
  //       });
  //       return a;
  //     }, []);
  //   }
  // }
  infoBoxes = {
    censusLegend: {
      title: null,
      closable: false,
      comp: CensusLegend,
      show: false
    }
  }
  sources = [
    { id: "tract_points",
      source: {
        type: "vector",
        url: "https://tiles.availabs.org/data/tract_points_2019.json"
      }
    }
  ]
  layers = [
    { id: "tract_points",
      source: "tract_points",
      "source-layer": "tract_points_2019",
      type: "circle",
      paint: {
        "circle-color": "#f00",
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          10, 2,
          15, 4,
          20, 8
        ]
      }
    }
  ]
}

const bgPointsLayerFactory = args => new BgPointsLayer(args);

export default bgPointsLayerFactory;
