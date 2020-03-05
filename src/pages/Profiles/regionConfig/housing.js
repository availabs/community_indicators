import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const BASE_CONFIG = [

   {
      title: "Total Housing Units",
      type:"CensusStatBox",
      yearPosition: "block",
      censusKeys:["B25002_001E"],
      showCompareYear: true,
      layout:{
         w:3,
         h:4
      },

   },
   //  {
   //    title: "Total Housing Units",
   //    type:"CensusLineChart",
   //    sumType: 'sum',
   //    showCompare: true,
   //    censusKeys:["B25002_001E"],
   //    groupBy: "geoids",
   //    layout:{
   //       w:9,
   //       h:8
   //    },

   // },
   {
      title: "Occupied Housing Units",
      type:"CensusStatBox",
      yearPosition: "block",
      censusKeys:["B25002_002E"],
      showCompareYear: true,
      layout:{
         w:3,
         h:4,
         x:0
      },
   },

   {
      title: "Percent Occupied Housing Units",
      type:"CensusStatBox",
      yearPosition: "block",
      sumType: 'pct',
      showCompareYear: true,
      censusKeys:["B25002_002E"],
      divisorKey: 'B25002_001E',
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:4,
         x:0
      }
   },

     {
      title:"Percent Occupied Housing Units",
      type: "CensusBarChart",
      censusKeys:["B25002_002E"],
      divisorKey: 'B25002_001E',
      groupBy: "geoids",
      layout:{
         w:9,
         h:12,

      }
    },

   {
      title: "Vacant Housing Units - Includes For Sale Vacant, Sold Vacant, and Other Vacant",
      type:"CensusStatBox",
      yearPosition: "block",
      censusKeys:["B25004_004E", "B25004_005E", "B25004_008E"],
      showCompareYear: true,
      invertColors: true,
      layout:{
         w:3,
         h:4,
      },
   },

   {
      title: "Percent Vacant Housing Units",
      type:"CensusStatBox",
      yearPosition: "block",
      sumType: 'pct',
      censusKeys:["B25004_004E", "B25004_005E", "B25004_008E"],
      divisorKey: 'B25002_001E',
      valueSuffix: '%',
      showCompareYear: true,
      invertColors: true,
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:4,
         x:0
      }
   },

  {
      title:"Percent Vacant Housing Units",
      type: "CensusBarChart",
      censusKeys:["B25002_003E"],
      divisorKey: 'B25002_001E',
      groupBy: "geoids",
      layout:{
         w:9,
         h:8,

      }
    },

         {
      title: "Percent Homeowners 65 and Older",
      type:"CensusStatBox",
      sumType: 'pct',
      censusKeys:["B25007_009E", "B25007_010E", "B25007_011E"],
      divisorKey: 'B25007_001E',
      valueSuffix: '%',
      showCompareYear: true,
      showColors: false,
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:6,
         x:0
      }
   },

    {
       
      title:"Percent Homeowners 65 and Older",
      type: "CensusBarChart",
      censusKeys:["B25007_009E", "B25007_010E", "B25007_011E"],
      divisorKey: 'B25007_001E',
      groupBy: "geoids",
      layout:{
         w:9,
         h:12,

      }
    },
    //  {  
    //   title:"Percent Homeowners 65 and Older",
    //   type: "CensusBarChart",
    //   sumType:'sum',
    //   groupBy:'geoids',
    //   censusKeys:["B25007_009E", "B25007_010E", "B25007_011E"],
    //    layout:{
    //      w:9,
    //      h:12,
    //   },
    // },

     {
      title: "Homeowners 65 and Older",
      type:"CensusStatBox",
      censusKeys:["B25007_009E", "B25007_010E", "B25007_011E"],
      showCompareYear: true,
      showColors: false,
      layout:{
         w:3,
         h:6,
      },
   },

      {
      type:"CensusStatBox",
      title:'Number of Mortgages with Monthly Owner Costs Above 30%',
      censusKeys:["B25091_008E", "B25091_009E", "B25091_010E", "B25091_011E", "B25091_019E", "B25091_020E", "B25091_021E", "B25091_022E"],
      showCompareYear: true,
      invertColors: true,
      layout:{
         w:3,
         h:9,
         x:0
      }
   },

      {
      type:"CensusLineChart",
      title:'Number of Mortgages with Monthly Owner Costs Above 30%',
      censusKeys:["B25091_008E", "B25091_009E", "B25091_010E", "B25091_011E", "B25091_019E", "B25091_020E", "B25091_021E", "B25091_022E"],
      showCompareYear: true,
      invertColors: true,
      layout:{
         w:9,
         h:9,
      }
   },


]

export default configLoader(BASE_CONFIG);
