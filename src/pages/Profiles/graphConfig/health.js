import {
  configLoader,
  maleColor,
  femaleColor
} from "./utils"

const BASE_CONFIG = [
  {
    type: "CensusBarChart",
    title: "Age by Disability Status by Health Insurance Coverage Status",
    censusKeys: ["B18135_002E...B18135_034E"],
    orientation: "horizontal",
    marginLeft: 550,
    layout: { h: 12 }
  }
]

export default configLoader(BASE_CONFIG);
