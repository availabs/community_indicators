import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const BASE_CONFIG = [

         {
      type:"CensusStatBox",
      title: "Total Ages 5-19 Not Enrolled in School (census proxy for dropout rate)",
      censusKeys:["B14003_023E", "B14003_024E", "B14003_025E", "B14003_026E", "B14003_051E", "B14003_052E", "B14003_053E","B14003_054E"],
      amount:true,
      yearPosition: "block",
      showCompareYear: true,
      invertColors: true,
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:5,
      }
   },

   {
      type:"CensusStatBox",
      title: "Percent Ages 3-4 Enrolled in School",
      censusKeys:['B14003_004E', 'B14003_013E', 'B14003_032E', 'B14003_041E'],
      sumType: 'pct',
      yearPosition: "block",
      divisorKeys:['B14003_004E', 'B14003_013E', 'B14003_022E', 'B14003_032E', 'B14003_041E', 'B14003_050E' ],
      valueSuffix: '%',
      maximumFractionDigits: 1,
      showCompareYear: true,
      layout:{
         w:3,
         h:5,
         x:0
      }
   },

    {
      title:"Percent Ages 3-4 Enrolled in School",
      type: "CensusBarChart",
      censusKeys: ['B14003_004E', 'B14003_013E', 'B14003_032E', 'B14003_041E'],
      divisorKeys: ['B14003_004E', 'B14003_013E', 'B14003_022E', 'B14003_032E', 'B14003_041E', 'B14003_050E' ],
      groupBy: "geoids",
      layout:{
         w:9,
         h:10,
      }
    },

     {
      type:"CensusStatBox",
      title: "Total With No High School Diploma or Equivalent",
      censusKeys:['B15003_002E...B15003_016E'],
      amount:true,
      yearPosition: "block",
      showCompareYear: true,
      invertColors: true,
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:5,
      }
   },

   {
      type:"CensusStatBox",
      title: "Percent of Population with No High School Diploma or Equivalent",
      sumType: 'pct',
      yearPosition: "block",
      divisorKey: "B23025_001E",
      valueSuffix: '%',
      maximumFractionDigits: 1,
      censusKeys:['B15003_002E...B15003_016E'],
      divisorKeys:['B01003_001E'],
      amount:true,
      invertColors: true,
      showCompareYear: true,
      layout:{
         w:3,
         h:5,
         x:0
      }
   },

       {
      title: "Percent of Population with No High School Diploma or Equivalent",
      type: "CensusBarChart",
      censusKeys: ['B15003_002E...B15003_016E'],
      divisorKeys: ['B01003_001E'],
      groupBy: "geoids",
      layout:{
         w:9,
         h:10,
      }
    },

   {
      type:"CensusStatBox",
      title: "Total High School Diploma or Equivalent and No College",
      censusKeys:['B15003_017E','B15003_018E'],
      amount:true,
      yearPosition: "block",
      showCompareYear: true,
      invertColors: true,
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:6,
      }
   },

   {
      type:"CensusStatBox",
      title: "Some College but No Degree",
      censusKeys:['B15003_019E','B15003_020E'],
      amount:true,
      yearPosition: "block",
      invertColors: true,
      showCompareYear: true,
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:6,
         x:0
      }
   },

   {
      type:"CensusStatBox",
      title: "Associate Degree or Higher",
      censusKeys:['B15003_021E...B15003_025E'],
      amount:true,
      yearPosition: "block",
      showCompareYear: true,
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:6,
         x:0
      }
   },

     {
            type: 'CensusBarChart',
            title: 'Educational Attainment',
            orientation: 'horizontal',
            marginLeft: 225,
            censusKeys: [
              'B15003_016E...B15003_025E'
              // 'B15003_002E...B15003_025E',
            ],
            layout:{
         w:9,
         h:18,
        },
    },

      {
      type: 'CensusPieChart',
      title: 'Educational Attainment',
      censusKeys: [
        'B15003_016E...B15003_025E'
        // 'B15003_002E...B15003_025E',
      ],
      piesPerRow: 4,
      legendWidth: 260,
      layout: {
        h: 12
      }
  },

]

export default configLoader(BASE_CONFIG);
