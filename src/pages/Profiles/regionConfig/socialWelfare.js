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
      yearPosition: "block",
      layout:{
         w:3,
         h:8,
         x: 0
      }
   },

    {
      title: "Poverty Rates by County",
      type: "CensusBarChart",
      censusKeys: ["B17001_002E"],
      divisorKeys: ["B17001_001E"],
      groupBy: "geoids",
      layout:{
         w:9,
         h:8,
      }
    },

   {
      type:"CensusStatBox",
      censusKeys:["B22001_002E"],
      divisorKey: "B17001_001E",
      sumType: 'pct',
      showCompareYear: true,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      invertColors: true,
      title: "Percent of Households Receiving Food Stamps/SNAP",
      yearPosition: "block",
      layout:{
         w:3,
         h:5
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
      yearPosition: "block",
      layout:{
         w:3,
         h:5,
         x:0
      }
   },

       {
      title: "Percent of Households that Received Food Stamps/SNAP in the Past 12 Months",
      type: "CensusBarChart",
      censusKeys: ["B22001_002E"],
      divisorKeys: ["B22001_001E"],
      groupBy: "geoids",
      layout:{
        w:9,
        h:10
      }
    },

    {
          type: "TextBox",
          header: "Households with Children Under Age 18 that Received Supplemental Security Income (SSI), Cash Public Assistance Income, or Food Stamps/SNAP Over the Last 12 Months",
         layout: {
            h: 3,
            w: 12
             }
        },

   {
      type:"CensusStatBox",
      censusKeys:["B09010_002E",],
      divisorKey:"B09010_001E",
      sumType: 'pct',
      showCompareYear: true,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      invertColors: true,
      yearPosition: "block",
      title: "Percent of Households that Received Support",
      layout:{
         w:3,
         h:5
      }
   },

   {
      type:"CensusStatBox",
      censusKeys:[
        "B09010_002E",
        ],
        showCompareYear: true,
        invertColors: true,
      title: "Households that Received Support",
      yearPosition: "block",
      layout:{
         w:3,
         h:5,
         x:0      }
   },

          {
      title: "Percent of Households with Children Under Age 18 that Received Support",
      type: "CensusBarChart",
      marginTop: 35,
      censusKeys: ["B09010_002E"],
      divisorKeys: ["B09010_001E"],
      groupBy: "geoids",
      layout:{
         w:9,
         h:10
      }
    },

]

export default configLoader(BASE_CONFIG);
