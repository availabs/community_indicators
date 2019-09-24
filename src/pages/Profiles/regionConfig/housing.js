import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const year = 2017;

const BASE_CONFIG = [
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
         w:12,
         h:3,
         x:0
      }
   },
   {
      title: "Vacant Housing Units",
      year,
      type:"CensusStatBox",
      censusKeys:["B25002_003E"],
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
      layout:{
         w:12,
         h:3,
         x:0
      },
   },

]

export default configLoader(BASE_CONFIG);
