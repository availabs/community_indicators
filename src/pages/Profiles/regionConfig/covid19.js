import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const BASE_CONFIG = [

    {
          type: "TextBox",
          header: "Population 60 Years and Older",
          body: "Population over the age of 60 years old is the highest risk age bracket.",
          layout: {
            h: 3,
            w: 12
             }
    },
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
      format: '.1%',
      geolevel: "cousubs",
      maximumFractionDigits: 1,
       layout: {
         h: 18,
         w: 12
       }
     },

//HEALTHCARE SECTION

    {
          type: "TextBox",
          header: "Number of Workers in the Health Care Industries",
          body: "Workers in the health care industries are at higher risk of contracting and spreading the virus.",
          layout: {
            h: 3,
            w: 12
             }
    },
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
      format: '.1%',
      geolevel: "cousubs",
      maximumFractionDigits: 1,
       layout: {
         h: 18,
         w: 12
       }
     },
//HOSPITALITY SECTION

    {
          type: "TextBox",
          header: "Job Risk",
          body: "Workers in the hospitality and leisure industries are at higher risk of job loss.",
          layout: {
            h: 3,
            w: 12
             }
    },
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
      format: '.1%',
      geolevel: "cousubs",
      maximumFractionDigits: 1,
       layout: {
         h: 18,
         w: 12
       }
     },

//WORK FROM HOME SECTION

    {
          type: "TextBox",
          header: "Commuters Who Reported Working From Home Before COVID-19",
          body: "Workers who reported working from home before COVID-19 are a positive indicator of communities at lower risk of transmission.",
          layout: {
            h: 3,
            w: 12
             }
  },
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
      divisorKeys: ["B08006_001E"],
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
      divisorKeys: ["B08006_001E"],
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
      divisorKeys: ["B08006_001E"],
      sumType: 'pct',
      format: '.1%',
      geolevel: "cousubs",
      maximumFractionDigits: 1,
       layout: {
         h: 18,
         w: 12
       }
     },
   
]

export default configLoader(BASE_CONFIG)
