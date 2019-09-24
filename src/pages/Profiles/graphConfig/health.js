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
  },

  {
      type: "ProfileFooter",
      data: [
        [
          { type: "header", value: "New York State Community Health Indicator Reports (CHIRS)" },
          { type: "subheader", value: "Data, Reports, and Visualizations" },
          { type: "body", value: "The New York State Community Health Indicator Reports (CHIRS) were developed in 2012, and are annually updated to consolidate and provide information regarding health indicators in the County Health Assessment Indicators (CHAI) for all communities in New York. Data previously provided in these reports have now been incorporated into the CHIRS Dashboard and are displayed in enhanced, more interactive data views. The CHIRS Dashboard tracks about 350 indicators organized by 15 health topics, and is updated annually to include the most recent year of data available for these indicators. Additionally, each of 62 counties in NYS has their own dashboard which allows for comparison of each county's data in relationship to that county's region and NYS totals, and includes at-a-glance comparisons of the two most recent data points. Visualizations include tables, maps, charts, and graphs at the state and county levels. This dashboard is a key resource for assessing county trends and can assist in tracking intervention progress." },
          { type: "link", value: "https://www.health.ny.gov/statistics/chac/indicators/" }
        ]
      ]
    }
]

export default configLoader(BASE_CONFIG);
