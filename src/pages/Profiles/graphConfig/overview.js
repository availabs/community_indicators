import {
  configLoader,
  maleColor,
  femaleColor
} from "./utils"

const year = 2017;

const BASE_CONFIG = [
   {
      "type":"CensusStatBox",
      "censusKey":"B01003_001E",
      year,
      compareYear: 2016,
      "title": "Population",
      "layout":{
         "w":3,
         "h":3
      }
   },
   {
      "id":"2",
      "type":"CensusStatBox",
      "title": "Median Age",
      "censusKey":"B01002_001E",
      maximumFractionDigits: 1,
      year,
      "demographics":true,
      "layout":{
         "w":3,
         "h":3
      }
   },
   {
      "type":"CensusStatBox",
      "title": "Median Household Income",
      valuePrefix:'$',
      "censusKey":"B19013_001E",
      "amount":true,
      year,
      "layout":{
         "w":3,
         "h":9,
         "x":0
      }
   },
   {
      "type":"CensusLineChart",
      title: "Median Household Income",
      "censusKeys":[
         "B19013_001E"
      ],
      "layout":{
         "w":9,
         "h":9
      }
   },

   {
      type:"CensusStatBox",
      title:'Poverty Rate',
      sumType: 'pct',
      censusKey:"B17001_002E",
      divisorKey: "B17001_001E",
      year,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      "layout":{
         "w":3,
         "h":9
      }
   },
   {
      type:"CensusLineChart",
      title: "% of Population with income in the past 12 months below poverty level",
      censusKeys:["B17001_002E"],
      divisorKeys: ["B17001_001E"],
      sumType: 'pct',
      "layout":{
         "w":9,
         "h":9
      },
   },

   {
      title: "Percent Vacant Housing Units",
      type:"CensusStatBox",
      sumType: 'pct',
      censusKey:"B25002_003E",
      divisorKey: 'B25002_001E',
      year,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      "layout":{
         "w":3,
         "h":3,
         "x":0
      }
   },
   {
      title: "Vacant Housing Units",
      year,
      type:"CensusStatBox",
      censusKey:"B25002_003E",
      "layout":{
         "w":3,
         "h":3,
         "x":0
      },
   },
   {
      title: "Occupied Housing Units",
      year,
      type:"CensusStatBox",
      censusKey:"B25002_002E",
      "layout":{
         "w":3,
         "h":3,
         "x":0
      },
   },
   {
      "type":"CensusLineChart",
      title: "Percent Vacant Housing Units",
      sumType: 'pct',
      censusKeys:["B25002_003E"],
      divisorKeys:["B25002_001E"],
      "layout":{
         "w":9,
         "h":9
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
    {
      type: "ProfileFooter",
      data: [
        [
          { type: "header", value: "Center for Economic Growth (CEG) - Economic Scorecard" },
          { type: "subheader", value: "Reports and Visualizations" },
          { type: "body", value: "CEG’s Capital Region Economic Scorecards are a quarterly feature of the organization’s newsletter, The CEG Indicator, and are oﬀered exclusively to our investors. These scorecards track 30 mostly local economic indicators to provide our investors with insights into the health of the region’s economy and the direction in which it is headed. There are ﬁve scorecards: Quarterly Performance Overview; Economic Conditions, Manufacturing, Consumer and Transportation." },
          { type: "link", value: "http://go.ceg.org/l/189672/2019-07-24/l2gpl6" }
        ]
      ]
    }
]

export default configLoader(BASE_CONFIG)
