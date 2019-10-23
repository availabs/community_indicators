import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const year = 2017;

const BASE_CONFIG = [

   {
      title: "Total Housing Units",
      year,
      type:"CensusStatBox",
      censusKeys:["B25002_001E"],
      compareYear: year - 1,
      year,
      layout:{
         w:12,
         h:3,
         x:0
      },
   },
   {
      title: "Occupied Housing Units",
      year,
      type:"CensusStatBox",
      censusKeys:["B25002_002E"],
      compareYear: year - 1,
      year,
      layout:{
         w:6,
         h:3,
      },
   },

   {
      title: "Percent Occupied Housing Units",
      type:"CensusStatBox",
      sumType: 'pct',
      censusKeys:["B25002_002E"],
      divisorKey: 'B25002_001E',
      year,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:6,
         h:3,
      }
   },

     {
      title:"Percent Occupied Housing Units",
      type: "CensusBarChart",
      censusKeys:["B25002_002E"],
      divisorKey: 'B25002_001E',
      groupBy: "geoids"
    },

   {
      title: "Vacant Housing Units",
      year,
      type:"CensusStatBox",
      censusKeys:["B25002_003E"],
      compareYear: year - 1,
      year,
      layout:{
         w:6,
         h:3,
      },
   }, 

   {
      title: "Percent Vacant Housing Units",
      type:"CensusStatBox",
      sumType: 'pct',
      censusKeys:["B25002_003E"],
      divisorKey: 'B25002_001E',
      year,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:6,
         h:3,
      }
   },

  {
      title:"Percent Vacant Housing Units",
      type: "CensusBarChart",
      censusKeys:["B25002_003E"],
      divisorKey: 'B25002_001E',
      groupBy: "geoids"
    },


]

export default configLoader(BASE_CONFIG);
