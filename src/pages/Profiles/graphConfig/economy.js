import {
  configLoader,
  maleColor,
  femaleColor
} from "./utils"

const BASE_CONFIG = [
  {
          type: "TextBox",
          header: "ECONOMY",
          body: "The economic security of individuals and families is essential to achieving the values of American society. For complex reasons, this financial security is beyond the means of many in our community.",
          layout: { 
            h: 3,
            w: 12
             }
        },

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
    yFormat: "$,d",
    showCompare: false
  },
  {
    type: "CensusLineChart",
    title: "Median Household Income by Household Size",
    censusKeys: ["B19019_001E...B19019_008E"],
    marginLeft: 75,
    yFormat: "$,d",
    showCompare: false
  },

      {
        type: 'CensusBarChart',
        title: "Median Family Income by Family Size",
        censusKeys: ['B19119_001E...B19119_007E'],
        years: ['2017'],
        yFormat: "$,d"
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

export default configLoader(BASE_CONFIG);
