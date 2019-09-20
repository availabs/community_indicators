import {
  configLoader,
  maleColor,
  femaleColor
} from "./utils"

const BASE_CONFIG = [
  {
    type: "CensusStackedBarChart",
    title: "Labor Force Participation",
    orientation: "horizontal",
    marginLeft: 275,
    left: {
      key: "Male", color: maleColor,
      keys: [
        "C23002A_004E...C23002A_009E",
        "C23002A_011E...C23002A_014E"
      ]
    },
    right: {
      key: "Female", color: femaleColor,
      keys: [
        "C23002A_017E...C23002A_022E",
        "C23002A_024E...C23002A_027E"
      ]
    },
    labels: [
      "16 to 64 years In labor force",
      "16 to 64 years In labor force In Armed Forces",
      "16 to 64 years In labor force Civilian",
      "16 to 64 years In labor force Civilian Employed",
      "16 to 64 years In labor force Civilian Unemployed",
      "16 to 64 years Not in labor force",
      "65 years and over In labor force",
      "65 years and over In labor force Employed",
      "65 years and over In labor force Unemployed",
      "65 years and over Not in labor force"
    ]
  },
  {
    type: "CensusBarChart",
    title: "Employment Status for the Population 16 Years and Over",
    orientation: "horizontal",
    marginLeft: 250,
    censusKeys: ["B23025_001E...B23025_007E"]
  },
  {
    type: "CensusBarChart",
    title: "Industry by Median Earnings",
    orientation: "horizontal",
    layout: { h: 12 },
    marginLeft: 480,
    yFormat: "$,d",
    censusKeys: ["B24031_001E...B24031_027E"],
    removeLeading: 1
  },
  {
    type: "CensusLineChart",
    title: "Median Household Income by Race",
    censusKeys: ["B19013A_001E...B19013I_001E"],
    marginLeft: 75,
    yFormat: "$,d"
  },
  {
    type: "CensusLineChart",
    title: "Median Household Income by Household Size",
    censusKeys: ["B19019_001E...B19019_008E"],
    marginLeft: 75,
    yFormat: "$,d"
  }
]

export default configLoader(BASE_CONFIG);
