import {
  maleColor,
  femaleColor
} from "../graphConfig/utils"

export default [
 {
      type:"CensusStatBox",
      title:'Total Bike/Ped ',
      censusKeys:["B08006_014E", "B08006_015E"],
      amount:true,
      yearPosition: "block",
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
         h:8,
       },

  },

  {
      type:"CensusStatBox",
      title:'Bike/Ped as a Percent of Total Commuters',
      sumType: 'pct',
      yearPosition: "block",
      censusKeys:["B08006_014E", "B08006_015E"],
      divisorKey: "B23025_001E",
      valueSuffix: '%',
      maximumFractionDigits: 1,
      showCompareYear: true,
      layout:{
         w:3,
         h:4,
      }
   },



  {
      type:"CensusStatBox",
      title:'Total Public Transportation ',
      censusKeys:["B08006_008E"],
      yearPosition: "block",
      showCompareYear: true,
      amount:true,
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:4,
         x:0
      }
   },

  {
      type:"CensusStatBox",
      title:'Public Transportation as a Percent of Total Commuters',
      sumType: 'pct',
      yearPosition: "block",
      censusKeys:["B08006_008E"],
      divisorKey: "B23025_001E",
      valueSuffix: '%',
      maximumFractionDigits: 1,
      showCompareYear: true,
      layout:{
         w:3,
         h:4,
         x:0
      }
   },

   {
      title:'Public Transportation as a Percent of Total Commuters',
      type: "CensusBarChart",
      censusKeys:["B08006_008E"],
      divisorKey: "B23025_001E",
      groupBy: "geoids",
      layout:{
         w:9,
         h:8
      }
    },

    {
      type:"CensusStatBox",
      title:'Total No Vehicle Available',
      censusKeys:[ "B08541_002E",],
      showCompareYear: true,
      yearPosition: "block",
      amount:true,
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:6
      }
   },



  {
    type: "CensusBarChart",
    title: "Vehicle Availability",
    censusKeys: [
    "B08541_002E",
    "B08541_003E",
    "B08541_004E",
    "B08541_005E"
    ],
    layout:{
      w:9,
      h:6
    }
  },
]
