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
      title: "Regional Population",
      layout:{
         w:3,
         h:9,
         
      }
   },

    {
      type: 'CensusBarChart',
      title: 'Population by County',
      censusKeys: ['B01003_001E'],
      groupBy: "geoids",
      layout: {
        w:9,
        h: 9

      }

    },

    {
      type:"CensusStatBox",
      title: "Median Household Income",
      valuePrefix:'$',
      censusKeys:["B19013_001E"],
      groupBy: "geoids",
      layout:{
         w:3,
         h:9,
         x:0
      }
   },

   {
      type:"CensusBarChart",
      title: "Median Household Income",
      censusKeys:["B19013_001E"],
      marginLeft: 75,
      yFormat: "$,d",
      legendWidth: 175,
      groupBy: "geoids",
      layout:{
         w:9,
         h:9
      }
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
