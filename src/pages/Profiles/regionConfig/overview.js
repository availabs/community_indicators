import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const year = 2017;

const BASE_CONFIG = [

   {
      type:"CensusStatBox",
      censusKeys:["B01003_001E"],
      year,
      compareYear: year - 1,
      title: "Population",
      layout:{
         w:12,
         h:3
      }
   },

    {
      type: 'CensusBarChart',
      title: 'Population by County',
      censusKeys: ['B01003_001E'],
      groupBy: "geoids"
    },

    {
      title: "Poverty Rates by County",
      type: "CensusBarChart",
      censusKeys: ["B17001_002E"],
      divisorKeys: ["B17001_001E"],
      groupBy: "geoids"
    }








   // {
   //    "id":"12",
   //    "type":"CensusGroupedBarChart",
   //    "censusKey":[
   //       "B23008"
   //    ],
   //    "compareGeoid":[
   //       "36"
   //    ],
   //    "colorRange":[
   //
   //    ],
   //    "layout":{
   //       "w":12,
   //       "h":13,
   //       "x":0,
   //       "y":41,
   //       "i":"12"
   //    },
   //    "geoid":[
   //       "36001"
   //    ]
   // },

]

export default configLoader(BASE_CONFIG)
