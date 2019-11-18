import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const BASE_CONFIG = [

   {
      type:"CensusStatBox",
      censusKeys:["B01003_001E"],
      showCompareYear: true,
      title: "Population",
      layout:{
         w:4,
         h:3,
         x: 4
      }
   },

    {
      type: 'CensusBarChart',
      title: 'Population by County',
      censusKeys: ['B01003_001E'],
      groupBy: "geoids"
    },






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
