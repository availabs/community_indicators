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
      yearPosition: "block",
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
      type:"CensusStatBox",
      title: "Median Household Income",
      valuePrefix:'$',
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
      censusKeys:[
         "B19013_001E"
      ],
      marginLeft: 75,
      yFormat: "$,d",
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
      layout:{
         w:10,
         h:9
      },
   },

   {
      title: "Percent Vacant Housing Units",
      type:"CensusStatBox",
      sumType: 'pct',
      censusKeys:["B25002_003E"],
      divisorKey: 'B25002_001E',
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:3,
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
      sumType: 'pct',
      yFormat: ",.1%",
      censusKeys:["B25002_003E"],
      divisorKeys:["B25002_001E"],
      layout:{
         w:9,
         h:9
      }
   },

       {
      type: "CensusLineChart",
      title: "Per Capita Income",
      marginLeft: 75,
      yFormat: "$,d",
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
        "B19301I_001E": "Hispanic or Latino"      }
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
      type: "ProfileFooter",
      data: [
        [
          { type: "header", value: "ALICE from United Way" },
          { type: "subheader", value: "Reports, Visualizations, and Data Downloads" },
          { type: "body", value: "The ALICE (Asset Limited, Income Constrained, Employed) Project was initiated by United Way of Northern New Jersey several years ago to bring focus to the families and individuals who work but whose salaries do not provide sufficient resources to meet basic needs. The ALICE Project developed a methodology using publicly available census, employment, wage, cost of living and other data to help to understand the extent of ALICE in our communities, those who are above the federal poverty level, but below a sustainable wage." },
          { type: "link", value: "https://www.unitedforalice.org/new-york" }
        ]
      ]
     }
]

export default configLoader(BASE_CONFIG)
