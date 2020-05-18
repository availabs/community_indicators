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

   
]

export default configLoader(BASE_CONFIG)
