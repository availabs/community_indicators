import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const year = 2017;

const BASE_CONFIG = [
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
      title: "Poverty Rates by County",
      type: "CensusBarChart",
      censusKeys: ["B17001_002E"],
      divisorKeys: ["B17001_001E"],
      groupBy: "geoids"
    },
    
   { 
      type:"CensusStatBox",
      censusKeys:[
        "B22001_001E",
        ],
      year,
      compareYear: year - 1,
      title: "Total Households",
      layout:{
         w:6,
         h:3
      }
   },
   { 
      type:"CensusStatBox",
      censusKeys:[
        "B22001_002E",
        ],
      year,
      compareYear: year - 1,
      title: "Households that Received Food Stamps/SNAP in the Past 12 Months",
      layout:{
         w:6,
         h:3
      }
   },

       {
      title: "Percent of Households that Received Food Stamps/SNAP in the Past 12 Months",
      type: "CensusBarChart",
      censusKeys: ["B22001_002E"],
      divisorKeys: ["B22001_001E"],
      groupBy: "geoids"
    },



   { 
      type:"CensusStatBox",
      censusKeys:[
        "B09010_001E",
        ],
      year,
      compareYear: year - 1,
      title: "Households with Children Under Age 18",
      layout:{
         w:6,
         h:5
      }
   },

   { 
      type:"CensusStatBox",
      censusKeys:[
        "B09010_002E",
        ],
      year,
      compareYear: year - 1,
      title: "Households with Children Under Age 18 that Received Supplemental Security Income (SSI), Cash Public Assistance Income, or Food Stamps/SNAP",
      layout:{
         w:6,
         h:5
      }
   },

          {
      title: "Percent of Households with Children Under Age 18 that Received Supplemental Security Income (SSI), Cash Public Assistance Income, or Food Stamps/SNAP",
      type: "CensusBarChart",
      censusKeys: ["B09010_002E"],
      divisorKeys: ["B09010_001E"],
      groupBy: "geoids",
      layout:{
         w:12,
         h:10
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