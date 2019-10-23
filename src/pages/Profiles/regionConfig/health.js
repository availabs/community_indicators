import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const year = 2017;

const BASE_CONFIG = [
     {
      type:"CensusStatBox",
      title:'Covered by Health Insurance',
      censusKeys:["B18135_001E"],
      compareYear: year - 1,
      year,
      maximumFractionDigits: 1,
      layout:{
         w:12,
         h:3
      }
   },
  {
      type:"CensusStatBox",
      title:'Percent Health Coverage',
      sumType: 'pct',
      censusKeys:["B18135_001E"],
      divisorKey: "B01003_001E",
      compareYear: year - 1,
      year,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:12,
         h:3
      }
   },

   {
      title:'Percent Health Coverage',
      type: "CensusBarChart",
      censusKeys:["B18135_001E"],
      divisorKey: "B01003_001E",
      groupBy: "geoids"
    },

]

export default configLoader(BASE_CONFIG);
