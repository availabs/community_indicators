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
  { name: "Occupation",
    variables: [
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
  constructor(...args) {
    super(...args);

    this.name = "Dot Density";
    this.active = true;
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

const bgPointsLayerFactory = () => new BgPointsLayer();

export default bgPointsLayerFactory;
