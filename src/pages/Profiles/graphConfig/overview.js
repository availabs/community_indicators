import {
  configLoader,
  maleColor,
  femaleColor
} from "./utils"

const BASE_CONFIG = [

   {
      type:"CensusStatBox",
      censusKeys:["B01003_001E"],
      showCompareYear: true,
      title: "Population",
      layout:{
         w:3,
         h:6
      }
   },
   {
      id:"2",
      type:"CensusStatBox",
      title: "Median Age",
      showCompareYear: true,
      censusKeys:["B01002_001E"],
      maximumFractionDigits: 1,
      demographics:true,
      layout:{
         w:3,
         h:6,
         x: 0
      }
   },
     {
       type: "CensusMap",
       title: "Population",
       censusKeys: ["B01003_001E"],
       layout: {
         h: 12,
         w: 9
       }
     },

   {
        type: 'CensusStackedBarChart',
        broadCensusKey: 'B01001',
        left: { key: "Male", slice: [2, 25], color: maleColor },
        right: { key: "Female", slice: [26, 49], color: femaleColor },
        layout: { h: 12 },
        marginLeft: 115,
        labels: [
          'Under Age 5',
          'Ages 5-9',
          'Ages 10-14',
          'Ages 15-17',
          'Ages 18-19',
          'Ages 20',
          'Ages 21',
          'Ages 22-24',
          'Ages 25-29',
          'Ages 30-34',
          'Ages 35-39',
          'Ages 40-44',
          'Ages 45-49',
          'Ages 50-54',
          'Ages 55-59',
          'Ages 60-61',
          'Ages 62-64',
          'Ages 65-66',
          'Ages 67-69',
          'Ages 70-74',
          'Ages 75-79',
          'Ages 80-84',
          'Ages 85 and over'
        ]
    },
   {
      type:"CensusStatBox",
      title: "Median Household Income",
      valuePrefix:'$',
      showCompareYear: true,
      censusKeys:["B19013_001E"],
      layout:{
         w:3,
         h:9,
         x:0
      }
   },
   {
      type:"CensusLineChart",
      title: "Median Household Income",
      censusKeys:["B19013_001E"],
      marginLeft: 75,
      yFormat: "$,d",
      legendWidth: 175,
      censusKeyLabels: {
        B19013_001E: "Median Household Income"
      },
      layout:{
         w:9,
         h:9
      }
   },

   {
      type:"CensusStatBox",
      title:'Poverty Rate',
      sumType: 'pct',
      censusKeys:["B17001_002E"],
      divisorKey: "B17001_001E",
      showCompareYear: true,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      invertColors: true,
      layout:{
         w:2,
         h:9
      }
   },
   {
      type:"CensusLineChart",
      title: "% of Population with income in the past 12 months below poverty level",
      censusKeys:["B17001_002E"],
      divisorKeys: ["B17001_001E"],
      sumType: 'pct',
      yFormat: ",.1%",
      legendWidth: 175,
      layout:{
         w:10,
         h:9
      },
   },

   {
      title: "Percent Vacant Housing Units",
      type:"CensusStatBox",
      sumType: 'pct',
      showCompareYear: true,
      invertColors: true,
      censusKeys:["B25002_003E"],
      divisorKey: 'B25002_001E',
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:4,
         x:0
      }
   },
   {
      title: "Vacant Housing Units",
      type:"CensusStatBox",
      censusKeys:["B25002_003E"],
      layout:{
         w:3,
         h:3,
         x:0
      },
   },
   {
      title: "Occupied Housing Units",
      type:"CensusStatBox",
      censusKeys:["B25002_002E"],
      layout:{
         w:3,
         h:3,
         x:0
      },
   },
   {
      type:"CensusLineChart",
      title: "Percent Vacant Housing Units",
      legendWidth: 175,
      sumType: 'pct',
      yFormat: ",.1%",
      censusKeys:["B25002_003E"],
      divisorKeys:["B25002_001E"],
      layout:{
         w:9,
         h:10
      }
   },

       {
      type: "CensusLineChart",
      title: "Per Capita Income By Race and Ethnicity",
      marginLeft: 75,
      yFormat: "$,d",
      showCompare: false,
      legendWidth: 270,
      censusKeys: [
        "B19301A_001E",
        "B19301B_001E",
        "B19301D_001E",
        "B19301I_001E"
      ],
      censusKeyLabels: {
        "B19301A_001E": "White",
        "B19301B_001E": "Black or African American Alone",
        "B19301D_001E": "Asian",
        "B19301I_001E": "Hispanic or Latino"      }
    },
    {
      type: "CensusRadarGraph",
      title: "Per Capita Income",
      format: "$,d",
      censusKeys: [
        "B19301A_001E",
        "B19301B_001E",
        "B19301C_001E",
        "B19301D_001E",
        "B19301E_001E",
        "B19301F_001E",
        "B19301G_001E",
        "B19301H_001E",
        "B19301I_001E"
      ],
      censusKeyLabels: {
        "B19301A_001E": "White",
        "B19301B_001E": "Black or African American Alone",
        "B19301C_001E": "American Indian and Alaska Native",
        "B19301D_001E": "Asian",
        "B19301E_001E": "Native Hawaiian and Other Pacific Islander",
        "B19301F_001E": "Some Other Race Alone",
        "B19301G_001E": "Two or More Races",
        "B19301H_001E": "White Alone, Not Hispanic or Latino",
        "B19301I_001E": "Hispanic or Latino"
      }
    },

    // { type: "CensusBarChart",
    //   title: "TEST",
    //   censusKeys: ["B19301A_001E...B19301I_001E"],
    //   censusKeyLabels: {
    //     "B19301A_001E": "White",
    //     "B19301B_001E": "Black or African American Alone",
    //     "B19301C_001E": "American Indian and Alaska Native",
    //     "B19301D_001E": "Asian",
    //     "B19301E_001E": "Native Hawaiian and Other Pacific Islander",
    //     "B19301F_001E": "Some Other Race Alone",
    //     "B19301G_001E": "Two or More Races",
    //     "B19301H_001E": "White Alone, Not Hispanic or Latino",
    //     "B19301I_001E": "Hispanic or Latino"      },
    //   groupBy: "geoids",
    //   groupMode: "stacked",
    //   yFormat: "$,d"
    // },

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
      type: "TextBox",
      header: "ALICE from United Way",
      subheader: "Reports, Visualizations, and Data Downloads",
      body: "The ALICE (Asset Limited, Income Constrained, Employed) Project was initiated by United Way of Northern New Jersey several years ago to bring focus to the families and individuals who work but whose salaries do not provide sufficient resources to meet basic needs. The ALICE Project developed a methodology using publicly available census, employment, wage, cost of living and other data to help to understand the extent of ALICE in our communities, those who are above the federal poverty level, but below a sustainable wage.",
      link: "https://www.unitedforalice.org/new-york",
      layout: {
        h: 6
      }
     }
]

export default configLoader(BASE_CONFIG)
