import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const BASE_CONFIG = [

   {
      title: "Total Housing Units",
      type:"CensusStatBox",
      censusKeys:["B25002_001E"],
      showCompareYear: true,
      layout:{
         w:4,
         h:4
      },
   },
   {
      title: "Occupied Housing Units",
      type:"CensusStatBox",
      censusKeys:["B25002_002E"],
      showCompareYear: true,
      layout:{
         w:4,
         h:4,
      },
   },

   {
      title: "Percent Occupied Housing Units",
      type:"CensusStatBox",
      sumType: 'pct',
      censusKeys:["B25002_002E"],
      divisorKey: 'B25002_001E',
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:4,
         h:4,
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
      type:"CensusStatBox",
      censusKeys:["B25002_003E"],
      showCompareYear: true,
      layout:{
         w:6,
         h:4,
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
         w:6,
         h:4,
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
