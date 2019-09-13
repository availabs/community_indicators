
export default [
   {
      "id":"1",
      "type":"CensusStatBox",
      "censusKey":"B01003_001E",
      "year":"2017",
      compareYear: 2016,
      "title": "Population",
      "layout":{
         "w":2,
         "h":3,
         "x":0,
         "y":0,
         "i":"1"
      }
   },
   {
      "id":"2",
      "type":"CensusStatBox",
      "title": "Median Age",
      "censusKey":"B01002_001E",
      "year":"2017",
      "demographics":true,
      "layout":{
         "w":2,
         "h":3,
         "x":2,
         "y":0,
         "i":"2"
      }
   },
   {
      "id":"5",
      "type":"CensusStatBox",
      "title": "Median Household Income",
      "censusKey":"B19013_001E",
      "amount":true,
      "layout":{
         "w":2,
         "h":13,
         "x":0,
         "y":3,
         "i":"5"
      }
   },
   {
      "id":"4",
      "type":"CensusLineChart",
      title: "Median Household Income",
      "censusKeys":[
         "B19013_001E"
      ],
      "layout":{
         "w":10,
         "h":13,
         "x":2,
         "y":3,
         "i":"4"
      }
   },
   {
      id:"6",
      type:"CensusStatBox",
      title:'Poverty Rate',
      sumType: 'pct',
      censusKey:"B17001_002E",
      divisorKey: "B17001_001E",
      valueSuffix: '%',
      maximumFractionDigits: 1,
      "layout":{
         "w":2,
         "h":13,
         "x":0,
         "y":18,
         "i":"6"
      }
   },
   {
      "id":"7",
      type:"CensusLineChart",
      title: "% of Population with income in the past 12 months below poverty level",
      censusKeys:["B17001_002E"],
      divisorKeys: ["B17001_001E"],
      sumType: 'pct',
      "layout":{
         "w":10,
         "h":13,
         "x":2,
         "y":18,
         "i":"7"
      },
   },
   {
      id:"8",
      title: "Percent Vacant Housing Units",
      type:"CensusStatBox",
      sumType: 'pct',
      censusKey:"B25002_003E",
      divisorKey: 'B25002_001E',
      valueSuffix: '%',
      maximumFractionDigits: 1,
      "layout":{
         "w":2,
         "h":4,
         "x":0,
         "y":31,
         "i":"8"
      },
      "geoid":[
         "36001"
      ]
   },
   {
      id:"9",
      title: "Vacant Housing Units",
      type:"CensusStatBox",
      censusKey:"B25002_003E",
      "layout":{
         "w":2,
         "h":4,
         "x":0,
         "y":35,
         "i":"9"
      },
   },
   {
      id:"39",
      title: "Occupied Housing Units",
      type:"CensusStatBox",
      censusKey:"B25002_002E",
      "layout":{
         "w":2,
         "h":4,
         "x":0,
         "y":39,
         "i":"39"
      },
   },
   {
      "id":"100",
      "type":"CensusLineChart",
      title: "Percent Vacant Housing Units",
      sumType: 'pct',
      censusKeys:["B25002_003E"],
      divisorKeys:["B25002_001E"],
      "layout":{
         "w":10,
         "h":12,
         "x":2,
         "y":31,
         "i":"100"
      }
   },
   {
      "id":"12",
      "type":"CensusGroupedBarChart",
      "censusKey":[
         "B23008"
      ],
      "compareGeoid":[
         "36"
      ],
      "colorRange":[

      ],
      "layout":{
         "w":12,
         "h":13,
         "x":0,
         "y":57,
         "i":"12"
      },
      "geoid":[
         "36001"
      ]
   },
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
