import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const BASE_CONFIG = [

   {
      title: "Total Housing Units",
      type:"CensusStatBox",
      yearPosition: "block",
      censusKeys:["B25002_001E"],
      showCompareYear: true,
      layout:{
         w:3,
         h:4
      },

   },
   //  {
   //    title: "Total Housing Units",
   //    type:"CensusLineChart",
   //    sumType: 'sum',
   //    showCompare: true,
   //    censusKeys:["B25002_001E"],
   //    groupBy: "geoids",
   //    layout:{
   //       w:9,
   //       h:8
   //    },

   // },
   {
      title: "Occupied Housing Units",
      type:"CensusStatBox",
      yearPosition: "block",
      censusKeys:["B25002_002E"],
      showCompareYear: true,
      layout:{
         w:3,
         h:4,
         x:0
      },
   },

   {
      title: "Percent Occupied Housing Units",
      type:"CensusStatBox",
      yearPosition: "block",
      sumType: 'pct',
      showCompareYear: true,
      censusKeys:["B25002_002E"],
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
      title:"Percent Occupied Housing Units",
      type: "CensusBarChart",
      censusKeys:["B25002_002E"],
      divisorKey: 'B25002_001E',
      groupBy: "geoids",
      layout:{
         w:9,
         h:12,

      }
    },

   {
      title: "Vacant Housing Units",
      type:"CensusStatBox",
      yearPosition: "block",
      censusKeys:["B25002_003E"],
      showCompareYear: true,
      invertColors: true,
      layout:{
         w:3,
         h:4,
      },
   },

   {
      title: "Percent Vacant Housing Units",
      type:"CensusStatBox",
      yearPosition: "block",
      sumType: 'pct',
      censusKeys:["B25002_003E"],
      divisorKey: 'B25002_001E',
      valueSuffix: '%',
      showCompareYear: true,
      invertColors: true,
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:4,
         x:0
      }
   },

  {
      title:"Percent Vacant Housing Units",
      type: "CensusBarChart",
      censusKeys:["B25002_003E"],
      divisorKey: 'B25002_001E',
      groupBy: "geoids",
      layout:{
         w:9,
         h:8,

      }
    },


]

export default configLoader(BASE_CONFIG);
