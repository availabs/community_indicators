
module.exports = [
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
         "i":"1",
         "static":false
      },
      "geoids":[
         "36001"
      ]
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
         "i":"2",
         "static":false
      },
      "geoid":[
         "36001"
      ]
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
         "i":"5",
         "static":false
      },
      "geoid":[
         "36001"
      ]
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
         "i":"4",
         "static":false
      },
      "geoid":[
         "36001"
      ]
   },
   {
      "id":"6",
      "type":"CensusStatBox",
      "censusKey":[
         "B17001_001E"
      ],
     
     
      "layout":{
         "w":2,
         "h":13,
         "x":0,
         "y":18,
         "i":"6",
         "static":false
      },
      "geoid":[
         "36001"
      ]
   },
   {
      "id":"7",
      "type":"CensusLineChart",
      "censusKeys":[
         "B17001_001E"
      ],
      "layout":{
         "w":10,
         "h":13,
         "x":2,
         "y":18,
         "i":"7",
         "static":false
      },
      "geoid":[
         "36001"
      ]
   },
   /*{
      "id":"8",
      "type":"CensusStatBox",
      "censusKey":[
         "B25002"
      ],
      "housing":true,
      "colorRange":[

      ],
      "layout":{
         "w":2,
         "h":13,
         "x":0,
         "y":31,
         "i":"8",
         "static":false
      },
      "geoid":[
         "36001"
      ]
   },
   {
      "id":"9",
      "type":"CensusStackedLineChart",
      "censusKey":[
         "B25002"
      ],
      "colorRange":[

      ],
      "layout":{
         "w":10,
         "h":13,
         "x":2,
         "y":31,
         "i":"9",
         "static":false
      },
      "geoid":[
         "36001"
      ]
   },
   {
      "id":"10",
      "type":"CensusStatBox",
      "censusKey":[
         "B15003"
      ],
      "education":true,
      "colorRange":[

      ],
      "layout":{
         "w":2,
         "h":13,
         "x":0,
         "y":44,
         "i":"10",
         "static":false
      },
      "geoid":[
         "36001"
      ]
   },
   {
      "id":"11",
      "type":"CensusMultiStackedLineChart",
      "censusKey":[
         "B15003"
      ],
      "colorRange":[

      ],
      "education":true,
      "layout":{
         "w":10,
         "h":13,
         "x":2,
         "y":44,
         "i":"11",
         "static":false
      },
      "geoid":[
         "36001"
      ]
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
         "i":"12",
         "static":false
      },
      "geoid":[
         "36001"
      ]
   }*/
]