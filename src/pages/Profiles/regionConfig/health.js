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
      maximumFractionDigits: 1,
      layout:{
         w:6,
         h:4
      }
   },
  {
      type:"CensusStatBox",
      title:'Percent Health Coverage',
      sumType: 'pct',
      censusKeys:["B18135_001E"],
      divisorKey: "B01003_001E",
      showCompareYear: true,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:6,
         h:4
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
