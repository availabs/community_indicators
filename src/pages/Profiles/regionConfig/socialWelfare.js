import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const year = 2017;

const BASE_CONFIG = [
  { 
      type:"CensusStatBox",
      censusKeys:["B22005A_001E",
        "B22005B_001E",
        "B22005C_001E",
        "B22005D_001E",
        "B22005E_001E",
        "B22005F_001E",
        "B22005G_001E",
        "B22005H_001E",
        "B22005I_001E"],
      year,
      compareYear: year - 1,
      title: "Number of People Receiving Food Stamps/SNAP",
      layout:{
         w:12,
         h:3
      }
   },

   {
      type:"CensusStatBox",
      title:'Poverty Rate',
      sumType: 'pct',
      censusKeys:["B17001_002E"],
      divisorKey: "B17001_001E",
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
      type:"CensusStatBox",
      title:'Veterans',
      censusKeys:['B21001_002E'],
      compareYear: year - 1,
      year,
      maximumFractionDigits: 1,
      layout:{
         w:12,
         h:3
      }
   },
]

export default configLoader(BASE_CONFIG);
