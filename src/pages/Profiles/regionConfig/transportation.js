import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const year = 2017;

const BASE_CONFIG = [
 {
      type:"CensusStatBox",
      title:'Total Bike/Ped ',
      censusKeys:["B08006_014E", "B08006_015E"],
      amount:true,
      compareYear: year - 1,
      year,
      maximumFractionDigits: 1,
      layout:{
         w:6,
         h:3
      }
   },
  {
      type:"CensusStatBox",
      title:'Bike/Ped as a Percent of Total Commuters',
      sumType: 'pct',
      censusKeys:["B08006_014E", "B08006_015E"],
      divisorKey: "B23025_001E",
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:6,
         h:3
      }
   },

  {
      type:"CensusStatBox",
      title:'Total Public Transportation ',
      censusKeys:["B08006_008E"],
      compareYear: year - 1,
      year,      
      amount:true,
      maximumFractionDigits: 1,
      layout:{
         w:6,
         h:3
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
      layout:{
         w:6,
         h:3
      }
   },
]

export default configLoader(BASE_CONFIG);
