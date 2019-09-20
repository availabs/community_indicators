import {
  configLoader,
  maleColor,
  femaleColor
} from "./utils"

const BASE_CONFIG = [
  {
    type: "CensusBarChart",
    title: "Means of Transportation to Work",
    censusKeys: ["B08006_002E...B08006_017E"],
    orientation: "horizontal",
    marginLeft: 490,
    marginRight: 30
  },
  {
    title: "Means of Transportation to Work by Sex",
    type: "CensusStackedBarChart",
    marginLeft: 340,
    left: {
      key: "Male", color: maleColor,
      keys: ["B08006_019E...B08006_034E"]
    },
    right: {
      key: "Female", color: femaleColor,
      keys: ["B08006_036E...B08006_051E"]
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
      "Public Transportation (Excluding Taxi), Streetcar or Trolley Car",
      "Public Transportation (Excluding Taxi), Subway or Elevated",
      "Public Transportation (Excluding Taxi), Railroad",
      "Public Transportation (Excluding Taxi), Ferryboat",
      "Bicycle",
      "Walked",
      "Taxicab, Motorcycle, or Other",
      "Worked at Home"
    ]
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
    title: "Vehicle Availability",
    censusKeys: ["B08541_002E...B08541_005E"]
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
  {
    type: "CensusBarChart",
    title: "Means of Transportation to Work by Workers' Earnings",
    censusKeys: ["B08119_002E...B08119_063E"],
    orientation: "horizontal",
    marginLeft: 330,
    layout: { h: 21 }
  }
]

export default configLoader(BASE_CONFIG);
