import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const BASE_CONFIG = [
     {
      type:"CensusStatBox",
      title:'Covered by Health Insurance',
      censusKeys:["B18135_001E"],
      showCompareYear: true,
      yearPosition: "block",
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:5
      }
   },
  {
      type:"CensusStatBox",
      title:'Percent Health Coverage',
      sumType: 'pct',
      yearPosition: "block",
      censusKeys:["B18135_001E"],
      divisorKey: "B01003_001E",
      showCompareYear: true,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:5,
         x:0
      }
   },

   {
      title:'Percent Health Coverage',
      type: "CensusBarChart",
      censusKeys:["B18135_001E"],
      divisorKey: "B01003_001E",
      groupBy: "geoids",
      layout:{
         w:9,
         h:10
      }
    },

      {
      type:"CensusStatBox",
      title:'Veterans',
      censusKeys:['B21001_002E'],
      showCompareYear: true,
      yearPosition: "block",
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:9,
      }
   },

     {
      type:"CensusBarChart",
      title:'Veterans',
      groupBy: "geoids",
      showColors:false,
      censusKeys:['B21001_002E'],
      maximumFractionDigits: 1,
      layout:{
         w:9,
         h:9,
      }
   },

]

export default configLoader(BASE_CONFIG);
