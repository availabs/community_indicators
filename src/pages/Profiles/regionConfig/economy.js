import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const year = 2017;

const BASE_CONFIG = [
  {
      type:"CensusStatBox",
      title:'Percent of Labor Force Unemployed',
      sumType: 'pct',
      censusKeys:["B23025_005E"],
      divisorKey: "B23025_001E",
      showCompareYear: true,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:4,
         h:3,
         x:4
      }
   },

   {
      title:'Percent of Labor Force Unemployed',
      type: "CensusBarChart",
      censusKeys:["B23025_005E"],
      divisorKey: "B23025_001E",
      groupBy: "geoids"
    },

     {
      type:"CensusStatBox",
      title:'Percent of Population Over 16 Years-old, Not in Labor Force',
      sumType: 'pct',
      censusKeys:["B23025_007E"],
      divisorKey: "B23025_001E",
      showCompareYear: true,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:4,
         h:3,
         x: 4
      }
   },

   {
      title:'Percent of Population Over 16 Years-old, Not in Labor Force',
      type: "CensusBarChart",
      censusKeys:["B23025_007E"],
      divisorKey: "B23025_001E",
      groupBy: "geoids"
    },
]

export default configLoader(BASE_CONFIG);
