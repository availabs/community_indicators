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
      showCompareYear: true,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      invertColors: true,
      layout:{
         w:4,
         h:4,
         x: 4
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
        showCompareYear: true,
      title: "Total Households",
      layout:{
         w:6,
         h:4
      }
   },
   {
      type:"CensusStatBox",
      censusKeys:[
        "B22001_002E",
        ],
        showCompareYear: true,
        invertColors: true,
      title: "Households that Received Food Stamps/SNAP in the Past 12 Months",
      layout:{
         w:6,
         h:4
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
      title: "Households with Children Under Age 18",
      layout:{
         w:6,
         h:4
      }
   },

   {
      type:"CensusStatBox",
      censusKeys:[
        "B09010_002E",
        ],
        showCompareYear: true,
        invertColors: true,
      title: "Households with Children Under Age 18 that Received Supplemental Security Income (SSI), Cash Public Assistance Income, or Food Stamps/SNAP",
      layout:{
         w:6,
         h:4
      }
   },

          {
      title: "Percent of Households with Children Under Age 18 that Received Supplemental Security Income (SSI), Cash Public Assistance Income, or Food Stamps/SNAP",
      type: "CensusBarChart",
      marginTop: 35,
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
      showCompareYear: true,
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
      censusKeys:['B21001_002E'],
      maximumFractionDigits: 1,
      layout:{
         w:9,
         h:9,
      }
   },
]

export default configLoader(BASE_CONFIG);
