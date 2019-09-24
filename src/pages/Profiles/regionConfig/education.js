import {
  configLoader,
  maleColor,
  femaleColor
} from "../graphConfig/utils"

const year = 2017;

const BASE_CONFIG = [
     {
      type:"CensusStatBox",
      title: "Total With No High School Diploma or Equivalent",
      censusKeys:['B15003_002E...B15003_016E'],
      amount:true,
       compareYear: year - 1,
      year,
      maximumFractionDigits: 1,
      layout:{
         w:6,
         h:4,
      }
   },

   {
      type:"CensusStatBox",
      title: "Percent of Population with No High School Diploma or Equivalent",
      sumType: 'pct',
      divisorKey: "B23025_001E",
      valueSuffix: '%',
      maximumFractionDigits: 1,
      censusKeys:['B15003_002E...B15003_016E'],
      divisorKeys:['B01003_001E'],
      amount:true,
       compareYear: year - 1,
      year,
      layout:{
         w:6,
         h:4,
      }
   },

   {
      type:"CensusStatBox",
      title: "Total High School Diploma or Equivalent and No College",
      censusKeys:['B15003_017E','B15003_018E'],
      amount:true,
       compareYear: year - 1,
      year,
      maximumFractionDigits: 1,
      layout:{
         w:4,
         h:4,
      }
   },

   {
      type:"CensusStatBox",
      title: "Some College but No Degree",
      censusKeys:['B15003_019E','B15003_020E'],
      amount:true,
       compareYear: year - 1,
      year,
      maximumFractionDigits: 1,
      layout:{
         w:4,
         h:4,
      }
   },

   {
      type:"CensusStatBox",
      title: "Associate Degree or Higher",
      censusKeys:['B15003_021E...B15003_025E'],
      amount:true,
       compareYear: year - 1,
      year,
      maximumFractionDigits: 1,
      layout:{
         w:4,
         h:4,
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
         w:12,
         h:18,
         x:0,
        },
    },

    {
      type:"CensusStatBox",
      title: "Total Ages 5-19 Not Enrolled in School",
      censusKeys:["B14003_023E", "B14003_024E", "B14003_025E", "B14003_026E", "B14003_051E", "B14003_052E", "B14003_053E","B14003_054E"],
      amount:true,
       compareYear: year - 1,
      year,
      maximumFractionDigits: 1,
      layout:{
         w:6,
         h:3,
      }
   },

   {
      type:"CensusStatBox",
      title: "Percent Ages 3-4 Enrolled in School",
      censusKeys:['B14003_004E', 'B14003_013E', 'B14003_032E', 'B14003_041E'],
      sumType: 'pct',
      divisorKeys:['B14003_004E', 'B14003_013E', 'B14003_022E', 'B14003_032E', 'B14003_041E', 'B14003_050E' ],
      valueSuffix: '%',
      maximumFractionDigits: 1,
       compareYear: year - 1,
      year,
      layout:{
         w:6,
         h:3,
      }
   },
]

export default configLoader(BASE_CONFIG);
