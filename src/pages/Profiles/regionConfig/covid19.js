import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

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
       type: "CensusBarChart",
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
      groupBy: 'geoids',
      sumType: 'pct',
      divisorKeys: ["B01001_001E"],
      valueSuffix: '%',
      maximumFractionDigits: 1,
       layout: {
         h: 9,
         w: 12
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
      divisorKeys: ["B01001_001E"],
      valueSuffix: '%',
      maximumFractionDigits: 1,
       layout: {
         h: 18,
         w: 12
       }
     },

//HOSPITALITY SECTION

    {
      type:"CensusStatBox",
      censusKeys:[
      "C24030_051E",
      "C24030_024E"
      ],
      showCompareYear: true,
      title: "Population in the Hospitality Industries",
      showColors: false,
      layout:{
         w:6,
         h:4
      }
   },
           {
      id:"2",
      type:"CensusStatBox",
      title: "Percent of Workers in the Hospitality Industries",
      showCompareYear: true,
      showColors: false,
      censusKeys:[
      "C24030_051E",
      "C24030_024E"
      ],
      sumType: 'pct',
      divisorKeys: ["C24030_001E"],
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
       type: "CensusBarChart",
       title: "Percent of Workers in the Hospitality Industries by County",
      censusKeys:[
        "C24030_051E",
        "C24030_024E"
        ],
      divisorKeys: ["C24030_001E"],
      groupBy: 'geoids',
      sumType: 'pct',
      valueSuffix: '%',
      maximumFractionDigits: 1,
       layout: {
         h: 9,
         w: 12
       }
     },
  {
       type: "CensusMap",
       title: "Percent of Workers in the Hospitality Industries",
      censusKeys:[
        "C24030_051E",
        "C24030_024E"
        ],
      divisorKeys: ["C24030_001E"],
      sumType: 'pct',
      valueSuffix: '%',
      maximumFractionDigits: 1,
       layout: {
         h: 18,
         w: 12
       }
     },

//HEALTHCARE SECTION

    {
      type:"CensusStatBox",
      censusKeys:[
      "C24030_023E",
      "C24030_050E"
      ],
      showCompareYear: true,
      title: "Population in the Healthcare Industries",
      showColors: false,
      layout:{
         w:6,
         h:4
      }
   },
           {
      id:"2",
      type:"CensusStatBox",
      title: "Percent of Workers in the Healthcare Industries",
      showCompareYear: true,
      showColors: false,
      censusKeys:[
      "C24030_023E",
      "C24030_050E"
      ],
      divisorKeys: ["C24030_001E"],
      sumType: 'pct',
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
       type: "CensusBarChart",
       title: "Percent of Workers in the Healthcare Industries by County",
      censusKeys:[
      "C24030_023E",
      "C24030_050E"
      ],
      divisorKeys: ["C24030_001E"],
      groupBy: 'geoids',
      sumType: 'pct',
      valueSuffix: '%',
      maximumFractionDigits: 1,
       layout: {
         h: 9,
         w: 12
       }
     },
  {
       type: "CensusMap",
       title: "Percent of Workers in the Healthcare Industries",
      censusKeys:[
      "C24030_023E",
      "C24030_050E"
      ],
      divisorKeys: ["C24030_001E"],
      sumType: 'pct',
      valueSuffix: '%',
      maximumFractionDigits: 1,
       layout: {
         h: 18,
         w: 12
       }
     },

//WORK FROM HOME SECTION

    {
      type:"CensusStatBox",
      censusKeys:["B08006_017E"],
      showCompareYear: true,
      title: "Commuters Who Reported Working From Home Before COVID-19",
      showColors: false,
      layout:{
         w:6,
         h:4
      }
   },
           {
      id:"2",
      type:"CensusStatBox",
      title: "Percent of Commuters Who Reported Working From Home Before COVID-19",
      showCompareYear: true,
      showColors: false,
      censusKeys:["B08006_017E"],
      divisorKeys: ["B23025_001E"],
      sumType: 'pct',
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
       type: "CensusBarChart",
       title: "Percent of Commuters Who Reported Working From Home Before COVID-19",
      censusKeys:["B08006_017E"],
      divisorKeys: ["B23025_001E"],
      groupBy: 'geoids',
      sumType: 'pct',
      valueSuffix: '%',
      maximumFractionDigits: 1,
       layout: {
         h: 9,
         w: 12
       }
     },
  {
       type: "CensusMap",
       title: "Percent of Commuters Who Reported Working From Home Before COVID-19",
      censusKeys:["B08006_017E"],
      divisorKeys: ["B23025_001E"],
      sumType: 'pct',
      valueSuffix: '%',
      maximumFractionDigits: 1,
       layout: {
         h: 18,
         w: 12
       }
     },
   
]

export default configLoader(BASE_CONFIG)
