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
        censusKey: ['B01001'],
        PopulationByAge:true,
        colorRange:[]
    },
    {
        type: 'CensusBarChart',
        broadCensusKey: 'B16001',
        axisBottom: false
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013A'
    },
    /*{
        id: '17',
        type: 'CensusLineChart',
        censusKey: ['B19013B'],
        colorRange:[],
        layout: {
            static: false,
            h: 14,
            w: 7,
            x: 0,
            y: 0
        }
    },
    {
        id: '18',
        type: 'CensusLineChart',
        censusKey: ['B19013C'],
        colorRange:[],
        layout: {
            static: false,
            h: 14,
            w: 7,
            x: 0,
            y: 0
        }
    },
    {
        id: '19',
        type: 'CensusLineChart',
        censusKey: ['B19013D'],
        colorRange:[],
        layout: {
            static: false,
            h: 14,
            w: 7,
            x: 0,
            y: 0
        }
    },
    {
        id: '20',
        type: 'CensusLineChart',
        censusKey: ['B19013E'],
        colorRange:[],
        layout: {
            static: false,
            h: 14,
            w: 7,
            x: 0,
            y: 0
        }
    },
    {
        id: '21',
        type: 'CensusLineChart',
        censusKey: ['B19013F'],
        colorRange:[],
        layout: {
            static: false,
            h: 14,
            w: 7,
            x: 0,
            y: 0
        }
    },
    {
        id: '22',
        type: 'CensusLineChart',
        censusKey: ['B19013G'],
        colorRange:[],
        layout: {
            static: false,
            h: 14,
            w: 7,
            x: 0,
            y: 0
        }
    },
    {
        id: '11',
        type: 'CensusLineChart',
        censusKey: ['B19013H'],
        colorRange:[],
        layout: {
            static: false,
            h: 14,
            w: 7,
            x: 0,
            y: 0
        }
    },
    {
        id: '12',
        type: 'CensusLineChart',
        censusKey: ['B19013I'],
        colorRange:[],
        layout: {
            static: false,
            h: 14,
            w: 7,
            x: 0,
            y: 0
        }
    },
    {
        id:'23', // The year slider doesn`t work if static is false
        type:'CensusStackedBarChart',
        censusKey:['B17001'],
        PovertyPopulationBySex: true,
        colorRange:[],
        layout:{
            static: true,
            h:17,
            w:11,
            x:0,
            y:0
        }
    },
    {
        id:'24',// The year slider doesn`t work if static is false
        type:'CensusStackedBarChart',
        censusKey:['B21001'],
        CivilianStatus: true,
        colorRange:[],
        layout :{
            static: true,
            h:17,
            w:11,
            x:0,
            y:0
        }
    },
*/

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
