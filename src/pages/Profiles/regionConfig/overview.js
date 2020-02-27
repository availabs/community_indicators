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
      yearPosition: "block",
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

   //   {
   //    type:"CensusStatBox",
   //    censusKeys:["B01003_001E"],
   //    showCompareYear: true,
   //    title: "",
   //    yearPosition: "block",
   //    layout:{
   //       w:3,
   //       h:9,
         
   //    }
   // },



    {
      type:"CensusStatBox",
      title: "Median Household Income",
      valuePrefix:'$',
      sumType: 'avg',
      censusKeys:["B19013_001E"],
      groupBy: "geoids",
      yearPosition: "block",
      layout:{
         w:3,
         h:9,
         x:0
      }
   },

   {
      type:"CensusBarChart",
      title: "Median Household Income",
      censusKeys:[
        "B19013A_001E",
        "B19013B_001E",
        "B19013D_001E",
        "B19013I_001E",
      ],
      censusKeyLabels:{
        "B19013A_001E": "White",
        "B19013B_001E": "Black or African American",
        "B19013D_001E": "Asian",
        "B19013I_001E": "Hispanic or Latino"
      },
      marginLeft: 75,
      yFormat: "$,d",
      legendWidth: 175,

      layout:{
         w:9,
         h:9
      }
   },

  {
      type:"CensusStatBox",
      title: "Per Capital Income",
      valuePrefix:'$',
      sumType: 'avg',
      censusKeys:["B19301_001E"],
      groupBy: "geoids",
      yearPosition: "block",
      layout:{
         w:3,
         h:9,
         x:0
      }
   },

   {
      type: 'CensusBarChart',
      title: "Per Capita Income By Race and Ethnicity",
      // orientation: 'horizontal',
      censusKeys: [
        "B19301A_001E",
        "B19301B_001E",
        "B19301D_001E",
        "B19301I_001E"
      ],
      censusKeyLabels: {
        "B19301A_001E": "White",
        "B19301B_001E": "Black or African American",
        "B19301D_001E": "Asian",
        "B19301I_001E": "Hispanic or Latino"      },
      yFormat: "$,d",
      layout:{
         w:9,
         h:9,
        },
    },

    {
      type: 'CensusBarChart',
      title: 'Population by Race by County',
      censusKeys: [
        'B02008_001E', 
        'B02009_001E', 
        'B02011_001E', 
        'B03002_012E'
      ],
      censusKeyLabels:{
        'B02008_001E': "White",
        'B02009_001E': "Black or African American",
        'B02011_001E': "Asian",
        'B03002_012E': "Hispanic or Latino"
      },
      layout: {
        w:12,
        h: 9

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
