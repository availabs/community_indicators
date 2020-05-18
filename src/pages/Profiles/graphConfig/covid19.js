import {
  configLoader,
  maleColor,
  femaleColor
} from "./utils"

const BASE_CONFIG = [

   {
      type:"CensusStatBox",
      censusKeys:[
        "B01001_018E",
        "B01001_019E",
        "B01001_020E",
        "B01001_021E",
        "B01001_022E",
        "B01001_023E",
        "B01001_024E",
        "B01001_025E",
        "B01001_042E",
        "B01001_043E",
        "B01001_044E",
        "B01001_045E",
        "B01001_046E",
        "B01001_047E",
        "B01001_048E",
        "B01001_049E",
      ],
      showCompareYear: true,
      title: "Population 60 Years and Older",
      showColors: false,
      layout:{
         w:6,
         h:4
      }
   },
   {
      id:"2",
      type:"CensusStatBox",
      title: "Percent of Population Over 60",
      showCompareYear: true,
      showColors: false,
      censusKeys:[
        "B01001_018E",
        "B01001_019E",
        "B01001_020E",
        "B01001_021E",
        "B01001_022E",
        "B01001_023E",
        "B01001_024E",
        "B01001_025E",
        "B01001_042E",
        "B01001_043E",
        "B01001_044E",
        "B01001_045E",
        "B01001_046E",
        "B01001_047E",
        "B01001_048E",
        "B01001_049E",
      ],
      sumType: 'pct',
      divisorKeys: ["B01001_001E"],
      valueSuffix: '%',
      maximumFractionDigits: 1,
      showColors: false,
      demographics:true,
      layout:{
         w:6,
         h:4,
      }
   },
     {
       type: "CensusMap",
       title: "Percent Over 60",
       censusKeys:[
        "B01001_018E",
        "B01001_019E",
        "B01001_020E",
        "B01001_021E",
        "B01001_022E",
        "B01001_023E",
        "B01001_024E",
        "B01001_025E",
        "B01001_042E",
        "B01001_043E",
        "B01001_044E",
        "B01001_045E",
        "B01001_046E",
        "B01001_047E",
        "B01001_048E",
        "B01001_049E",
      ],
      sumType: 'pct',
      divisorKey: "B01001_001E",
      format: ".1%",
       layout: {
         h: 12,
         w: 12,
         x: 0
       }
     },

   // {
   //      type: 'CensusStackedBarChart',
   //      broadCensusKey: 'B01001',
   //      showCompareGeoid: false,
   //      left: { key: "Male", slice: [17, 25], color: maleColor },
   //      right: { key: "Female", slice: [41, 49], color: femaleColor },
   //      layout: { h: 12 },
   //      marginLeft: 115,
   //      labels: [
   //        'Ages 60-61',
   //        'Ages 62-64',
   //        'Ages 65-66',
   //        'Ages 67-69',
   //        'Ages 70-74',
   //        'Ages 75-79',
   //        'Ages 80-84',
   //        'Ages 85 and over'
   //      ]
   //  },



   {
      type:"CensusStatBox",
      title: "Number of Workers in the Hospitality Industries",
      showCompareYear: true,
      censusKeys:[
      "C24030_051E",
      "C24030_024E"
      ],
      showColors: false,
      layout:{
         w:6,
         h:4,
         x:0
      }
   },
   {
      type:"CensusStatBox",
      title:'Percent of Workers in the Hospitality Industries',
      sumType: 'pct',
      censusKeys:[
      "C24030_051E",
      "C24030_024E"
      ],
      divisorKey: "C24030_001E",
      showCompareYear: true,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      showColors: false,
      layout:{
         w:6,
         h:4,
      }
   },

   {
       type: "CensusMap",
       title: "Percent of Workers in the Hospitality Industries",
      censusKeys:[
        "C24030_051E",
        "C24030_024E"
        ],
      divisorKey: "C24030_001E",
      sumType: 'pct',
      format: ".1%",
       layout: {
         h: 12,
         w: 12
       }
     },
   {
      type:"CensusStatBox",
      title: "Number of Workers in the Health Care Industries",
      showCompareYear: true,
      censusKeys:[
      "C24030_023E",
      "C24030_050E"
        ],
      showColors: false,
      layout:{
         w:6,
         h:4,
         x:0
      }
   },
     {
      type:"CensusStatBox",
      title:'Percent of Workers in the Health Care Industries',
      sumType: 'pct',
      censusKeys:[
      "C24030_023E",
      "C24030_050E"
        ],
      divisorKey: "C24030_001E",
      showCompareYear: true,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      showColors: false,
      layout:{
         w:6,
         h:4,
      }
   },
   {
       type: "CensusMap",
       title: "Percent of Workers in the Health Care Industries",
      censusKeys:[
      "C24030_023E",
      "C24030_050E"
        ],
      divisorKey: "C24030_001E",
      sumType: 'pct',
      format: ".1%",
       layout: {
         h: 12,
         w: 12
       }
     },

  {
      type:"CensusStatBox",
      title:'Commuters Who Reported Working From Home Before COVID-19',
      censusKeys:[ "B08006_017E"],
      showCompareYear: true,
      // yearPosition: "block",
      amount:true,
      maximumFractionDigits: 1,
      showColors: false,
      layout:{
         w:6,
         h:4,
         x:0
      }
   },
  {
      type:"CensusStatBox",
      title:'Percent of Commuters Who Reported Working From Home Before COVID-19',
      sumType: 'pct',
      // yearPosition: "block",
      showCompareYear: true,
      censusKeys:["B08006_017E"],
      divisorKey: "B08006_001E",
      valueSuffix: '%',
      maximumFractionDigits: 1,
      showColors: false,
      layout:{
         w:6,
         h:4,
      }
   },
      {
       type: "CensusMap",
       title: "Percent of Commuters Who Reported Working From Home Before COVID-19",
      censusKeys:["B08006_017E"],
      divisorKey: "B08006_001E",
      sumType: 'pct',
      format: ".1%",
       layout: {
         h: 12,
         w: 12
       }
     },
]

export default configLoader(BASE_CONFIG)
