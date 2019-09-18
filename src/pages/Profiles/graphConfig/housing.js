import {
  configLoader,
  maleColor,
  femaleColor
} from "./utils"

const BASE_CONFIG = [
  // { "type":"CensusMultiStackedLineChart",
  //   "censusKey":["B25004"],
  //   "VacantHousing":true,
  //   "colorRange":[],
  //   "layout": {
  //     "w":4,"h":14,"x":0,"y":72,"i":"27","static":false
  //   }
  // },
  // { "type":"CensusStackedBarChart",
  //   "censusKey":["B25118"],
  //   "layout": {
  //     "w":11,"h":17,"x":0,"y":17,"i":"28","static":true
  //   }
  // },
  { "type": "CensusBarChart",
    "broadCensusKey": "B25087",
    orientation: 'horizontal',
    marginLeft: 300,
    //axisBottom: false,
    "layout": {
      "h": 18
    }
  },
  { "type":"CensusStackedBarChart",
    "broadCensusKey": "B25091",
    orientation: 'horizontal',
    marginLeft: 140,
    left: { key: "With Mortgage", slice: [0, 9] },
    right: { key: "Without Mortgage", slice: [9, 18] },
    labels: [
      'Less than 10.0 percent',
      '10.0 to 14.9 percent',
      '15.0 to 19.9 percent',
      '20.0 to 24.9 percent',
      '25.0 to 29.9 percent',
      '30.0 to 34.9 percent',
      '35.0 to 39.9 percent',
      '40.0 to 49.9 percent',
      '50.0 percent or more',
    ]
  },
  // { "type":"CensusStackedBarChart",
  //   "censusKey":["B25091"],
  //   "layout": {
  //     "w":11,"h":17,"x":0,"y":0,"i":"31","static":true
  //   }
  // },
  // { "type":"CensusStatBox",
  //   "censusKey":["B25091"],
  //   "year":["2017"],
  //   "layout": {
  //     "w":2,"h":5,"x":0,"y":62,"i":"32","static":false
  //   }
  // },
  // { "type":"CensusStatBox",
  //   "censusKey":["B25091"],
  //   "year":["2017"],
  //   "layout": {
  //     "w":2,"h":5,"x":0,"y":67,"i":"33","static":false
  //   }
  // }

 {
      type: "ProfileFooter",
      data: [
        [
          { type: "header", value: "US Census Building Permits Survey" },
          { type: "subheader", value: "Data Downloads" },
          { type: "body", value: "This page provides data on the number of new housing units authorized by building permits. Data are available monthly, year- to- date, and annually at the national, state, selected metropolitan area, county and place levels. The data are from the Building Permits Survey." },
          { type: "link", value: "https://www.census.gov/construction/bps/" }
        ]
      ]
    }

]

export default configLoader(BASE_CONFIG);
