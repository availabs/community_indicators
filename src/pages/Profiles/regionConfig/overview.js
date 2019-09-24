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
            orientation: 'vertical',
            marginLeft: 225,
            censusKeys: [
              'B01003_001E'
              // 'B15003_002E...B15003_025E',
            ],
            layout:{
         w:12,
         h:12,
         x:0,
        },

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
