import pg from "pg"
import { Readable, pipeline } from "stream"
import fs from "fs"
import https from "https"

import { rollup as d3rollup, groups as d3groups } from "d3-array"

import * as turf from "@turf/turf"

import { MarsConfig, CensusApiKey } from "./config.mjs"

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

const main = async () => {
  const client = new pg.Client(MarsConfig);
  await client.connect();

  const sql = `
    SELECT geoid, ST_AsGeoJSON(geom) AS geom, ST_Extent(geom) AS bbox
    FROM geo.tl_2019_36_bg
    WHERE substring(geoid from 1 for 5) = ANY($1)
    GROUP BY 1, 2
  `
  const res = await client.query(sql, [['36001']])//,'36083','36093','36091','36039','36021','36115','36113']]);

  const rows = res.rows.map(row => ({
    geoid: row.geoid,
    geom: JSON.parse(row.geom),
    bbox: row.bbox.slice(4, -1).split(/[ ,]/).map(c => +c)
  }))

  const byCounty = d3groups(rows, r => getCounty(r.geoid), r => getTract(r.geoid));

  const allData = [];

  for (const [county, tracts] of byCounty) {
    for (const [tract, bgs] of tracts) {
console.log(county, tract, bgs)
      const data = await fetch(getAcsUrl(county, tract));
      allData.push(...data.slice(1));
    }
  }

  const bgPopMap = allData.reduce((a, c) => {
    a.set(c.slice(1).join(""), +c[0]);
    return a;
  }, new Map());

  const collection = {
    type: "FeatureCollection",
    features: []
  };

  for (const row of rows) {
    const { geoid, geom, bbox } = row;
    const pop = bgPopMap.get(geoid);

console.log(geoid, pop)

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
  }

  const geoJSON = JSON.stringify(collection);

  await new Promise((resolve, reject) => {
    pipeline(
      Readable.from([geoJSON]),
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

  client.end();
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

const getAcsUrl = (county, tract) =>
  "https://api.census.gov/data/" +
	`${ acsYear }/acs/acs5?` +
	`key=${ CensusApiKey }` +
	`&get=B01003_001E` +
  `&for=block+group:*` +
  `&in=state:36+county:${ county }+tract:${ tract }`;

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
