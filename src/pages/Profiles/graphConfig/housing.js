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
    marginLeft: 160,
    //axisBottom: false,
    "layout": {
      "w": 6,
      
    }
  },
  { "type":"CensusBarChart",
    "broadCensusKey": "B25087",
    orientation: 'horizontal',
            marginLeft: 160,
    // axisBottom: false,
    "layout": {
      "w":6,
    },
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
