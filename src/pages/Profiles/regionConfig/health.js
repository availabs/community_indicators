import {
  maleColor,
  femaleColor
} from "../graphConfig/utils"

export default [
     {
      type:"CensusStatBox",
      title:'Covered by Health Insurance',
      censusKeys:[
          "B27001_004E",
          "B27001_007E",
          "B27001_010E",
          "B27001_013E",
          "B27001_016E",
          "B27001_019E",
          "B27001_022E",
          "B27001_025E",
          "B27001_028E",
          "B27001_032E",
          "B27001_035E",
          "B27001_038E",
          "B27001_041E",
          "B27001_044E",
          "B27001_047E",
          "B27001_050E",
          "B27001_053E",
          "B27001_056E",
          ],
      showCompareYear: true,
      yearPosition: "block",
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:5
      }
   },
  {
      type:"CensusStatBox",
      title:'Percent Health Coverage',
      sumType: 'pct',
      yearPosition: "block",
      censusKeys:[
          "B27001_004E",
          "B27001_007E",
          "B27001_010E",
          "B27001_013E",
          "B27001_016E",
          "B27001_019E",
          "B27001_022E",
          "B27001_025E",
          "B27001_028E",
          "B27001_032E",
          "B27001_035E",
          "B27001_038E",
          "B27001_041E",
          "B27001_044E",
          "B27001_047E",
          "B27001_050E",
          "B27001_053E",
          "B27001_056E",
          ],
      divisorKey: "B27001_001E",
      showCompareYear: true,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:5,
         x:0
      }
   },

   {
      title:'Percent Health Coverage',
      type: "CensusBarChart",
      censusKeys:[
          "B27001_004E",
          "B27001_007E",
          "B27001_010E",
          "B27001_013E",
          "B27001_016E",
          "B27001_019E",
          "B27001_022E",
          "B27001_025E",
          "B27001_028E",
          "B27001_032E",
          "B27001_035E",
          "B27001_038E",
          "B27001_041E",
          "B27001_044E",
          "B27001_047E",
          "B27001_050E",
          "B27001_053E",
          "B27001_056E",
          ],
      divisorKey: "B27001_001E",
      groupBy: "geoids",
      layout:{
         w:9,
         h:10
      }
    },

      {
      type:"CensusStatBox",
      title:'Veterans',
      censusKeys:['B21001_002E'],
      showCompareYear: true,
      yearPosition: "block",
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
      showColors:false,
      censusKeys:['B21001_002E'],
      maximumFractionDigits: 1,
      layout:{
         w:9,
         h:9,
      }
   },

]
