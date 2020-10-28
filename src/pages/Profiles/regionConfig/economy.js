import {
  maleColor,
  femaleColor
} from "../graphConfig/utils"

export default [
  {
      type:"CensusStatBox",
      title:'Percent of Labor Force Unemployed (census proxy for unemployment rate)',
      sumType: 'pct',
      censusKeys:["B23025_005E"],
      divisorKey: "B23025_001E",
      showCompareYear: true,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      yearPosition: "block",
      invertColors: true,
      layout:{
         w:3,
         h:9,
      }
   },

   {
      title:'Percent of Labor Force Unemployed',
      type: "CensusBarChart",
      censusKeys:["B23025_005E"],
      divisorKey: "B23025_001E",
      groupBy: "geoids",
      layout:{
         w:9,
         h:9,
      }
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
      invertColors: true,
      yearPosition: "block",
      layout:{
         w:3,
         h:9,
      }
   },

   {
      title:'Percent of Population Over 16 Years-old, Not in Labor Force',
      type: "CensusBarChart",
      censusKeys:["B23025_007E"],
      divisorKey: "B23025_001E",
      groupBy: "geoids",
      layout:{
         w:9,
         h:9,
      }
    },
]
