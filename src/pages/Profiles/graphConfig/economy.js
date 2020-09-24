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
            h: 5,
            w: 12
             }
        },


  {
      type:"CensusStatBox",
      title:'Percent of Populaion Over 16 Years-old, Not in Labor Force',
      sumType: 'pct',
      censusKeys:["B23025_007E"],
      divisorKey: "B23025_001E",
      showCompareYear: true,
      invertColors: true,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:9
      }
   },

 
  {
    type: "CensusBarChart",
    title: "Employment Status for the Population 16 Years and Over",
    orientation: "horizontal",
    marginLeft: 250,
    legendPosition: "bottom-right",
    censusKeys: ["B23025_001E...B23025_007E"],
    layout:{
         w:9,
         h:9
      }
  },

  {
      type:"CensusStatBox",
      title:'Percent of Labor Force Unemployed (census proxy for unemployment rate)',
      sumType: 'pct',
      censusKeys:["B23025_005E"],
      divisorKey: "B23025_001E",
      showCompareYear: true,
      valueSuffix: '%',
      invertColors: true,
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:9
      }
   },
 
  {
    type: "CensusStackedBarChart",
    title: "Labor Force Participation",
    showCompareGeoid: false,
    orientation: "horizontal",
    marginLeft: 275,
    layout:{
         w:9,
         h:9
      },
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
    title: "Industry by Median Earnings",
    orientation: "horizontal",
    layout: { h: 12 },
    marginLeft: 480,
    yFormat: "$,d",
    censusKeys: ["B24031_001E...B24031_027E"],
    removeLeading: 1,
    layout:{
         w:12,
         h:17,
      }

  },
  
    {
      type: "TextBox",
      header: "Upstate Alliance for the Creative Economy",
      subheader: "Data, Reports",
      body: "",
      link: "http://www.upstatecreative.org/",
      layout: {
            h: 5,
            w: 12
             }
    },

    {
      type: "TextBox",
      header: "Center for Economic Growth (CEG) - Economic Scorecard",
      subheader: "Reports and Visualizations",
      body: "CEG’s Capital Region Economic Scorecards are a quarterly feature of the organization’s newsletter, The CEG Indicator, and are oﬀered exclusively to our investors. These scorecards track 30 mostly local economic indicators to provide our investors with insights into the health of the region’s economy and the direction in which it is headed. There are ﬁve scorecards: Quarterly Performance Overview; Economic Conditions, Manufacturing, Consumer and Transportation.",
      link: "http://go.ceg.org/l/189672/2019-07-24/l2gpl6",
      layout: {
            h: 7,
            w: 12
             }
    }
]

export default configLoader(BASE_CONFIG);
