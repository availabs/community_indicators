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
    marginLeft: 280,
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
  { type: "CensusBarChart",
    title: "Mortgate Status and Selected MOnthly Owner Costs",
    orientation: "horizontal",
    marginLeft: 260,
    censusKeys: [
      "B25087_001E",
      "B25087_002E",
      "B25087_003E",
      "B25087_004E",
      "B25087_005E",
      "B25087_006E",
      "B25087_007E",
      "B25087_008E",
      "B25087_009E",
      "B25087_010E",
      "B25087_011E",
      "B25087_012E",
      "B25087_013E",
      "B25087_014E",
      "B25087_015E",
      "B25087_016E",
      "B25087_017E",
      "B25087_018E",
      "B25087_019E"
    ]
  },
  { type: "CensusStackedBarChart",
    title: "Tenure by Household Icome in the Past 12 Months",
    marginLeft: 140,
    left: { key: "Owner Occupied",
      keys: [
        "B25118_003E",
        "B25118_004E",
        "B25118_005E",
        "B25118_006E",
        "B25118_007E",
        "B25118_008E",
        "B25118_009E",
        "B25118_010E",
        "B25118_011E",
        "B25118_012E",
        "B25118_013E"
      ] },
    right: { key: "Renter Occupied",
      keys: [
        "B25118_015E",
        "B25118_016E",
        "B25118_017E",
        "B25118_018E",
        "B25118_019E",
        "B25118_020E",
        "B25118_021E",
        "B25118_022E",
        "B25118_023E",
        "B25118_024E",
        "B25118_025E"
      ] },
    labels: [
      "Less Than $5,000",
      "$5,000 to $9,999",
      "$10,000 to $14,999",
      "$15,000 to $19,999",
      "$20,000 to $24,999",
      "$25,000 to $34,999",
      "$35,000 to $49,999",
      "$50,000 to $74,999",
      "$75,000 to $99,999",
      "$100,000 to $149,999",
      "$150,000 or more"
    ]
  },
  { type: "CensusLineChart",
    title: "Vacancy Status",
    censusKeys: [
      "B25004_001E",
      "B25004_002E",
      "B25004_003E",
      "B25004_004E",
      "B25004_005E",
      "B25004_006E",
      "B25004_007E",
      "B25004_008E"
    ]
  },

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
