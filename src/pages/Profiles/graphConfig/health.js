import {
  configLoader,
  maleColor,
  femaleColor
} from "./utils"

const BASE_CONFIG = [
  {
          type: "TextBox",
          header: "HEALTH",
          body: "This section takes a population-based approach to our region's health by exploring access to health care, and will one day include indicators measuring the prevalence of selected diseases, mortality rates and behavioral health.",
          layout: { 
            h: 3,
            w: 12
             }
        },
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
