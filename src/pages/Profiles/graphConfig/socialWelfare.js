import CENSUS_CONFIG from "./censusConfig"

const BASE_CONFIG = [
    {
        type: 'CensusBarChart',
        broadCensusKey: 'B19119',
        years: ['2017'],
        yFormat: "$,d"
    },
    {
        type: 'CensusStackedBarChart',
        broadCensusKey: 'B01001',
        left: { key: "Male", slice: [2, 25], color: '#5588ee' },
        right: { key: "Female", slice: [26, 49], color: '#e68fac' },
        labels: [
          'Under Age 5',
          'Ages 5-9',
          'Ages 10-14',
          'Ages 15-17',
          'Ages 18-19',
          'Ages 20',
          'Ages 21',
          'Ages 22-24',
          'Ages 25-29',
          'Ages 30-34',
          'Ages 35-39',
          'Ages 40-44',
          'Ages 45-49',
          'Ages 50-54',
          'Ages 55-59',
          'Ages 60-61',
          'Ages 62-64',
          'Ages 65-66',
          'Ages 67-69',
          'Ages 70-74',
          'Ages 75-79',
          'Ages 80-84',
          'Ages 85 and over'
        ]
    },
    {
        type: 'CensusBarChart',
        broadCensusKey: 'B16001',
        axisBottom: false,
        marginLeft: 50
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013A'
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013B',
        layout: { w: 6 }
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013C',
        layout: { w: 6 }
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013D',
        layout: { w: 6 }
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013E',
        layout: { w: 6 }
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013F',
        layout: { w: 6 }
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013G',
        layout: { w: 6 }
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013H',
        layout: { w: 6 }
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013I',
        layout: { w: 6 }
    },
    {
        type:'CensusStackedBarChart',
        broadCensusKey: 'B17001',
        left: { key: "Below Poverty Level", slice: [0, 26] },
        right: { key: "Above Poverty Level", slice: [26, 52] },
        marginLeft: 150,
        labels: [
          'Male Under 5',
          'Male 5 years',
          'Male 6-11 years',
          'Male 12-14 years',
          'Male 15 years',
          'Male 16-17 years',
          'Male 18-24 years',
          'Male 25-34 years',
          'Male 35-44 years',
          'Male 45-54 years',
          'Male 55-64 years',
          'Male 65-74 years',
          'Male 75 years and over',
          'Female Under 5',
          'Female 5 years',
          'Female 6-11 years',
          'Female 12-14 years',
          'Female 15 years',
          'Female 16-17 years',
          'Female 18-24 years',
          'Female 25-34 years',
          'Female 35-44 years',
          'Female 45-54 years',
          'Female 55-64 years',
          'Female 65-74 years',
          'Female 75 years and over',
        ]
    },
    {
        type:'CensusStackedBarChart',
        broadCensusKey: 'B21001',
        left: { key: "Male", slice: [5, 20], color: '#5588ee' },
        right: { key: "Female", slice: [23, 38], color: '#e68fac' },
        marginLeft: 200,
        labels: [
          'Total 18-34 years',
          '18-34 years, veteran',
          '18-34 years, non-veteran',
          'Total 35-54 years',
          '35-54 years, veteran',
          '35-54 years, non-veteran',
          'Total 55-64 years',
          '55-64 years, veteran',
          '55-64 years, non-veteran',
          'Total 65-74 years',
          '65-74 years, veteran',
          '65-74 years, non-veteran',
          'Total 75 years and over',
          '75 years and over, veteran',
          '75 years and over, non-veteran',
        ]
    }

]

let x = 0, y = 0, h = 0;
const DEFAULT_LAYOUT = {
  w: 12,
  h: 12,
  static: true
}

export default (
  () => BASE_CONFIG.map((config, i) => {
    if (config["broadCensusKey"]) {
      const bk = CENSUS_CONFIG[config["broadCensusKey"]];
      config.censusKeys = bk.variables.map(v => v.value);
      config.getKeyName = key => bk.variables.reduce((a, c) => c.value === key ? c.name : a, key)
      config.name = bk.name;
    }
    else {
      config.getKeyName = config.getKeyName || (key => key);
    }
    config.id = i.toString();

    const layout = Object.assign({}, DEFAULT_LAYOUT, config.layout)

    if ((layout.w + x) > 12) {
      x = 0;
      y += h;
      h = 0;
    }
    h = Math.max(h, layout.h)
    config.layout = {
      ...layout,
      i: config.id,
      x,
      y
    }
    x += config.layout.w;

    return config;
  })
)()
