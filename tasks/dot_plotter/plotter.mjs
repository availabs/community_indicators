import pg from "pg"
import { Readable, pipeline } from "stream"
import fs from "fs"
import https from "https"

import { rollup as d3rollup, groups as d3groups } from "d3-array"

import * as turf from "@turf/turf"

import { PlutoConfig, CensusApiKey } from "./config.mjs"

const args = process.argv.slice(2);

const [outFile, acsYear] = args.reduce((a, c, i) => {
  if (c === "-o") {
    a[0] = args[i + 1];
  }
  else if (c === "-y") {
    a[1] = args[i + 1];
  }
  return a;
}, [null, null]);

const Counties = [
  '36001', '36083', '36093', '36091',
  '36039', '36021', '36115', '36113'
]

const main = async () => {
  const client = new pg.Client(PlutoConfig);
  await client.connect();

console.log("STARTING QUERY")
console.time("FINISHED QUERY")

  const sql = `
    SELECT geoid, ST_Extent(geom) AS bbox,
      ST_AsGeoJSON(
        ST_Collect(ST_Buffer(ST_Intersection(wkb_geometry, geom), 0.00125))
      ) AS geom
    FROM tl_2019_36_tract
    JOIN conflation.conflation_map_2019_v0_6_0
    ON ST_Intersects(wkb_geometry, geom)
    WHERE substring(geoid from 1 for 5) = ANY($1)
    AND n > 1 AND n < 7
    GROUP BY 1
  `
  const res = await client.query(sql, [Counties]);

  client.end();

console.timeEnd("FINISHED QUERY");

  const rows = res.rows.map(row => ({
    geoid: row.geoid,
    geom: JSON.parse(row.geom),
    bbox: row.bbox.slice(4, -1).split(/[ ,]/).map(c => +c)
  }))

  const byCounty = d3groups(rows, r => getCounty(r.geoid));

  const allData = [];

console.log("RETRIEVING ACS DATA");
console.time("RETREIVED ACS DATA");
  for (const [county, tracts] of byCounty) {
    const data = await fetch(getAcsUrl(county));
    allData.push(...data.slice(1));
  }
console.timeEnd("RETREIVED ACS DATA");

  const popMap = allData.reduce((a, c) => {
    a.set(c.slice(1).join(""), +c[0]);
    return a;
  }, new Map());

  const collection = {
    type: "FeatureCollection",
    features: []
  };

console.log("PROCESSING TRACTS");
console.time("PROCESSED TRACTS");
  rows.forEach(({ geoid, geom, bbox }, i) => {
    const pop = popMap.get(geoid);

console.log(`PROCESSING GEOID ${ geoid }`);
console.time(`PROCESSED GEOID ${ geoid }`);

    const lngLatSet = new Set();

    let index = 0;
    while (index < pop) {
      const lngLat = randomPoint(bbox);
      const key = lngLat.join("|");
      if (lngLatSet.has(key)) continue;

      lngLatSet.add(key);

      const point = turf.point(lngLat, { geoid, i: index, d: 1 }, { id: collection.features.length });

      if (turf.booleanIntersects(geom, point)) {
        ++index;
        collection.features.push(point);
      }
    }
console.timeEnd(`PROCESSED GEOID ${ geoid }`);
const remaining = rows.length - 1 - i;
remaining && console.log(`${ remaining } GEOIDs REMAINING`);
  })
console.timeEnd("PROCESSED TRACTS");

  await new Promise((resolve, reject) => {
    pipeline(
      Readable.from([JSON.stringify(collection)]),
      fs.createWriteStream(outFile),
      // process.stdout,
      err => {
        if (err) {
          reject(err);
        } else {
          resolve(null);
        }
      }
    )
  });
}

const randomFloat = (min, max) => {
  const range = max - min;
  return Math.random() * range + min;
}
const randomPoint = bbox => {
  return [
    randomFloat(bbox[0], bbox[2]),
    randomFloat(bbox[1], bbox[3])
  ]
}

const getState = geoid => geoid.slice(0, 2);
const getCounty = geoid => geoid.slice(2, 5);
const getTract = geoid => geoid.slice(5, 11);
const getBlockgroup = geoid => geoid.slice(11);

const getAcsUrl = (county) =>
  "https://api.census.gov/data/" +
	`${ acsYear }/acs/acs5?` +
	`key=${ CensusApiKey }` +
	`&get=B01003_001E` +
  `&for=tract:*` +
  `&in=state:36+county:${ county }`;

const fetch = url => {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      const { statusCode } = res;

      if (statusCode !== 200) {
        return reject(new Error(`URL ${ url } failed, with: ${ statusCode }`));
      }

      res.on('error', reject);

      const chunks = [];
      res.on('data', chunk => {
        chunks.push(chunk);
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(chunks.join("")));
        }
        catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  })
}

if (outFile && acsYear) {
  main()
}
else {
  console.log("USAGE: node ./main.js -o <out file> -y <year>");
}
