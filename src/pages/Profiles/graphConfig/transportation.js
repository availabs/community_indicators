import {
  configLoader,
  maleColor,
  femaleColor
} from "./utils"

const BASE_CONFIG = [
  {
          type: "TextBox",
          header: "TRANSPORTATION",
          body: "This section provides indicators on how the labor force in our region commutes to work and on car ownership.",
          layout: {
            h: 3,
            w: 12
             }
        },

   {
      type:"CensusStatBox",
      title:'Total Bike/Ped ',
      censusKeys:["B08006_014E", "B08006_015E"],
      amount:true,
      showCompareYear: true,
      // yearPosition: "block",
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:6
      }
   },
  {
      type:"CensusStatBox",
      title:'Bike/Ped as a Percent of Total Commuters',
      sumType: 'pct',
      // yearPosition: "block",
      showCompareYear: true,
      censusKeys:["B08006_014E", "B08006_015E"],
      divisorKey: "B23025_001E",
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:6,
         x:0
      }
   },


  {
    type: "CensusBarChart",
    title: "Means of Transportation to Work",
    censusKeys: [
      "B08006_002E",
      "B08006_003E",
      "B08006_004E",
      "B08006_005E",
      "B08006_006E",
      "B08006_007E",
      "B08006_008E",
      "B08006_009E",
      "B08006_014E",
      "B08006_015E",
      "B08006_016E",
      "B08006_017E"
      ],
    orientation: "horizontal",
    marginLeft: 300,
    layout:{
         w:9,
         h:12,
      }
  },


   {
      type:"CensusStatBox",
      title:'Total Public Transportation ',
      censusKeys:["B08006_008E"],
      showCompareYear: true,
      // yearPosition: "block",
      amount:true,
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:6
      }
   },

  {
      type:"CensusStatBox",
      title:'Public Transportation as a Percent of Total Commuters',
      sumType: 'pct',
      showCompareYear: true,
      censusKeys:["B08006_008E"],
      divisorKey: "B23025_001E",
      valueSuffix: '%',
      // yearPosition: "block",
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:6,
         x:0
      }
   },

  {
    title: "Means of Transportation to Work by Sex",
    type: "CensusStackedBarChart",
    showCompareGeoid: false,
    marginLeft: 340,
    left: {
      key: "Male", color: maleColor,
      keys: [
       "B08006_019E",
       "B08006_020E",
       "B08006_021E",
       "B08006_022E",
       "B08006_023E",
       "B08006_024E",
       "B08006_025E",
       "B08006_016E",
       "B08006_031E",
       "B08006_032E",
       "B08006_033E",
       "B08006_034E"
       ]
    },
    right: {
      key: "Female", color: femaleColor,
      keys: [
        "B08006_036E",
       "B08006_037E",
       "B08006_038E",
       "B08006_039E",
       "B08006_040E",
       "B08006_041E",
       "B08006_042E",
       "B08006_043E",
       "B08006_048E",
       "B08006_049E",
       "B08006_050E",
        "B08006_051E"
        ]
    },
    labels: [
      "Car, Truck or Van",
      "Car, Truck or Van, Drove Alone",
      "Car, Truck or Van, Carpooled",
      "Car, Truck or Van, 2-Person Carpool",
      "Car, Truck or Van, 3-Person Carpool",
      "Car, Truck or Van, 4-Person Carpool",
      "Public Transportation (Excluding Taxi)",
      "Public Transportation (Excluding Taxi), Bus or Trolley Bus",
      "Bicycle",
      "Walked",
      "Taxicab, Motorcycle, or Other",
      "Worked at Home"
    ],
    layout:{
         w:9,
         h:12,

      }
  },
  {
      type:"CensusStatBox",
      title:'Total No Vehicle Available',
      censusKeys:[ "B08541_002E",],
      showCompareYear: true,
      // yearPosition: "block",
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

   {
      type:"CensusStatBox",
      title:'Total Worked at Home ',
      censusKeys:[ "B08006_017E"],
      showCompareYear: true,
      // yearPosition: "block",
      amount:true,
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:6
      }
   },

  {
      type:"CensusStatBox",
      title:'Work at Home as a Percent of Total Commuters',
      sumType: 'pct',
      // yearPosition: "block",
      showCompareYear: true,
      censusKeys:["B08006_017E"],
      divisorKey: "B23025_001E",
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:6,
         x:0
      }
   },



  {
    type: "CensusLineChart",
    title: "Means of Transportation to Work",
    censusKeys: [
      "B08006_014E",
      "B08006_015E",
      "B08006_017E"
      ],
    marginLeft: 100,
    layout:{
         w:9,
         h:12,
      }
  },

  {
    type: "CensusBarChart",
    title: "Travel Time to Work",
    censusKeys: ["B08303_002E...B08303_013E"],
    orientation: "horizontal",
    marginLeft: 130
  },
  {
    type: "CensusStackedBarChart",
    title: "Travel Time to Work by Sex",
    showCompareGeoid: false,
    left: {
      key: "Male", color: maleColor,
      keys: ["B08412_015E...B08412_026E"]
    },
    right: {
      key: "Female", color: femaleColor,
      keys: ["B08412_028E...B08412_039E"]
    },
    marginLeft: 130,
    labels: [
      "Less Than 5 Minutes",
      "5 to 9 Minutes",
      "10 to 14 Minutes",
      "15 to 19 Minutes",
      "20 to 24 Minutes",
      "25 to 29 Minutes",
      "30 to 34 Minutes",
      "35 to 39 Minutes",
      "40 to 44 Minutes",
      "45 to 59 Minutes",
      "60 to 89 Minutes",
      "90 or More Minutes"
    ]
  },


  {
    type: "CensusBarChart",
    title: "Travelled by Public Transportation to Work by Earnings",
    censusKeys: ["B08119_028E...B08119_036E"],
    orientation: "horizontal",
    marginLeft: 330
  },
  {
    type: "CensusBarChart",
    title: "Walked to Work by Earnings",
    censusKeys: ["B08119_037E...B08119_045E"],
    orientation: "horizontal",
    marginLeft: 175
  },
  {
    type: "CensusBarChart",
    title: "Walked to Work by Age",
    censusKeys: ["B08101_033E...B08101_040E"],
    orientation: "horizontal",
    marginLeft: 175
  },

]

export default configLoader(BASE_CONFIG);
