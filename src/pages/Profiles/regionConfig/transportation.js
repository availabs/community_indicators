import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const BASE_CONFIG = [
 {
      type:"CensusStatBox",
      title:'Total Bike/Ped ',
      censusKeys:["B08006_014E", "B08006_015E"],
      amount:true,
      showCompareYear: true,
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:4
      }
   }, 

      {
      title:'Bike/Ped as a Percent of Total Commuters',
      type: "CensusBarChart",
      censusKeys:["B08006_014E", "B08006_015E"],
      divisorKey: "B23025_001E",
      groupBy: "geoids",
      layout:{
         w:9,
         h:9,
       },

  },

  {
      type:"CensusStatBox",
      title:'Bike/Ped as a Percent of Total Commuters',
      sumType: 'pct',
      censusKeys:["B08006_014E", "B08006_015E"],
      divisorKey: "B23025_001E",
      valueSuffix: '%',
      maximumFractionDigits: 1,
      showCompareYear: true,
      layout:{
         w:3,
         h:5,
      }
   },



  {
      type:"CensusStatBox",
      title:'Total Public Transportation ',
      censusKeys:["B08006_008E"],
      showCompareYear: true,
      amount:true,
      maximumFractionDigits: 1,
      layout:{
         w:6,
         h:4,
      }
   },

  {
      type:"CensusStatBox",
      title:'Public Transportation as a Percent of Total Commuters',
      sumType: 'pct',
      censusKeys:["B08006_008E"],
      divisorKey: "B23025_001E",
      valueSuffix: '%',
      maximumFractionDigits: 1,
      showCompareYear: true,
      layout:{
         w:6,
         h:4
      }
   },

   {
      title:'Public Transportation as a Percent of Total Commuters',
      type: "CensusBarChart",
      censusKeys:["B08006_008E"],
      divisorKey: "B23025_001E",
      groupBy: "geoids"
    },
]

export default configLoader(BASE_CONFIG);
