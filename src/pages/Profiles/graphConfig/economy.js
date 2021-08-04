import {
  maleColor,
  femaleColor
} from "./utils"

export default [
  {
          type: "TextBox",
          header: "ECONOMY",
          body: "The economic security of individuals and families is essential to achieving the values of American society. For complex reasons, this financial security is beyond the means of many in our community.",
          layout: {
            h: 5,
            w: 12
             }
        },
 { type: "QCEWStatBox",
      title: "Annual Average Employment Level",

// THESWE ARE THE AVAILABLE DATA TYPES:
// ['annual_avg_emplvl', 'total_annual_wages', 'lq_annual_avg_emplvl', 'lq_total_annual_wages']
      dataType: "annual_avg_emplvl",

// THE PROPERTY BELOW WILL CAUSE THIS COMPONENT TO BE HIDDEN FOR NON-COUNTIES.
// MAKE SURE ANY COMPONENTS THAT USE THIS HAVE A COMBINED WIDTH OF 12!!!
// THIS WILL ENSURE AN ENTIRE LINE IS HIDDEN.
      showForGeoidLength: 5,
      showCompareYear: true,

// USE THE PROPERTY BELOW TO SHOW ALL YEARS OF DATA FOR THE NON-REGIONAL PROFILE PAGES.
      showAllYears: true,

      layout: {
        w: 3,
        h: 6
      }
    },
    { type: "QCEWStatBox",
      valuePrefix: "$",
      format: "fnum",
      title: "Total Annual Wages",

// THESWE ARE THE AVAILABLE DATA TYPES:
// ['annual_avg_emplvl', 'total_annual_wages', 'lq_annual_avg_emplvl', 'lq_total_annual_wages']
      dataType: "total_annual_wages",

// THE PROPERTY BELOW WILL CAUSE THIS COMPONENT TO BE HIDDEN FOR NON-COUNTIES.
// MAKE SURE ANY COMPONENTS THAT USE THIS HAVE A COMBINED WIDTH OF 12!!!
// THIS WILL ENSURE AN ENTIRE LINE IS HIDDEN.
      showForGeoidLength: 5,
      showCompareYear: true,

// USE THE PROPERTY BELOW TO SHOW ALL YEARS OF DATA FOR THE NON-REGIONAL PROFILE PAGES.
      showAllYears: true,

      layout: {
        x: 0,
        w: 3,
        h: 6
      }
    },
    { type: "QCEWStackedBarChart",
      title: "Annual Average Employment Level",

// THESWE ARE THE AVAILABLE DATA TYPES:
// ['annual_avg_emplvl', 'total_annual_wages', 'lq_annual_avg_emplvl', 'lq_total_annual_wages']
      dataType: "annual_avg_emplvl",

// THE PROPERTY BELOW WILL CAUSE THIS COMPONENT TO BE HIDDEN FOR NON-COUNTIES.
// MAKE SURE ANY COMPONENTS THAT USE THIS HAVE A COMBINED WIDTH OF 12!!!
// THIS WILL ENSURE AN ENTIRE LINE IS HIDDEN.
      showForGeoidLength: 5,

// USE THE PROPERTY BELOW TO SHOW ALL YEARS OF DATA FOR THE NON-REGIONAL PROFILE PAGES.
      showAllYears: true,

      layout: {
        w: 9,
        h: 12
      }
    },

   { type: "CensusTreemap",
      title: "Industries by civilian employed population 16 years and over",
      layout:{
         w: 12,
         h: 12
      },
      tree: {
        title: "Industries by Occupation",
        children: [
          { title: "Agriculture, forestry, fishing and hunting, and mining",
            children: [
              { title: "Agriculture, forestry, fishing and hunting",
                censusKey: "S2403_C01_003E"
              },
              { title: "Mining, quarrying, and oil and gas extraction",
                censusKey: "S2403_C01_004E"
              },
            ],
          },
          { title: "Construction",
            children: [
              { title: "Construction",
                censusKey: "S2403_C01_005E"
              },
            ],
          },
          { title: "Manufacturing",
            children: [
              { title: "Manufacturing",
                censusKey: "S2403_C01_006E"
              },
            ],
          },
          { title: "Trade",
            children: [
              { title: "Wholesale trade",
                censusKey: "S2403_C01_007E"
              },
              { title: "Retail trade",
                censusKey: "S2403_C01_008E"
              },
            ],
          },
          { title: "Transportation and warehousing, and utilities",
            children: [
              { title: "Transportation and warehousing",
                censusKey: "S2403_C01_010E"
              },
              { title: "Utilities",
                censusKey: "S2403_C01_011E"
              },
            ],
          },
          { title: "Information",
            children: [
              { title: "Information",
                censusKey: "S2403_C01_012E"
              },
            ],
          },
          { title: "Finance and insurance, and real estate and rental and leasing",
            children: [
              { title: "Finance and insurance",
                censusKey: "S2403_C01_014E"
              },
              { title: "Real estate and rental and leasing",
                censusKey: "S2403_C01_015E"
              },
            ]
          },
          { title: "Professional, scientific, and management, and administrative and waste management services",
            children: [
              { title: "Professional, scientific, and technical services",
                censusKey: "S2403_C01_017E"
              },
              { title: "Management of companies and enterprises",
                censusKey: "S2403_C01_018E"
              },
              { title: "Administrative and support and waste management services",
                censusKey: "S2403_C01_019E"
              },
            ],
          },
          { title: "Educational services, and health care and social assistance",
            children: [
              { title: "Educational services",
                censusKey: "S2403_C01_021E"
              },
              { title: "Health care and social assistance",
                censusKey: "S2403_C01_022E"
              },
            ],
          },
          { title: "Arts, entertainment, and recreation, and accommodation and food services",
            children: [
              { title: "Arts, entertainment, and recreation",
                censusKey: "S2403_C01_024E"
              },
              { title: "Accommodation and food services",
                censusKey: "S2403_C01_025E"
              },
            ],
          },
          { title: "Other services",
            children: [
              { title: "Other services, except public administration",
                censusKey: "S2403_C01_026E"
              },
              { title: "Public administration",
                censusKey: "S2403_C01_027E"
              },
            ]
          },
        ],
      },
    },

   { type: "CensusTreemap",
      title: "Occupations by civilian employed population 16 years and over",
      layout:{
         w: 12,
         h: 12
      },
      tree: {
        title: "Occupations",
        children: [
          { title: "Management, business, science, and arts occupations",
            children: [
              { title: "Management, business, and financial occupations",
                censusKey: "S2401_C01_003E"
              },
              { title: "Management occupations",
                censusKey: "S2401_C01_004E"
              },
              { title: "Business and financial operations occupations",
                censusKey: "S2401_C01_005E"
              },
              { title: "Computer, engineering, and science occupations",
                censusKey: "S2401_C01_006E"
              },
              { title: "Computer and mathematical occupations",
                censusKey: "S2401_C01_007E"
              },
              { title: "Architecture and engineering occupations",
                censusKey: "S2401_C01_008E"
              },
              { title: "Life, physical, and social science occupations",
                censusKey: "S2401_C01_009E"
              },
              { title: "Education, legal, community service, arts, and media occupations",
                censusKey: "S2401_C01_010E"
              },
              { title: "Community and social service occupations",
                censusKey: "S2401_C01_011E"
              },
              { title: "Legal occupations",
                censusKey: "S2401_C01_012E"
              },
              { title: "Educational instruction, and library occupations",
                censusKey: "S2401_C01_013E"
              },
              { title: "Arts, design, entertainment, sports, and media occupations",
                censusKey: "S2401_C01_014E"
              },
              { title: "Healthcare practitioners and technical occupations",
                censusKey: "S2401_C01_015E"
              },
              { title: "Health diagnosing and treating practitioners and other technical occupations",
                censusKey: "S2401_C01_016E"
              },
              { title: "Health technologists and technicians",
                censusKey: "S2401_C01_017E"
              },
            ],
          },
          { title: "Service Occupation",
            children: [
              { title: "Healthcare support occupations",
                censusKey: "S2401_C01_019E"
              },
              { title: "Protective service occupations",
                censusKey: "S2401_C01_020E"
              },
              { title: "Firefighting and prevention, and other protective service workers including supervisors",
                censusKey: "S2401_C01_021E"
              },
              { title: "Law enforcement workers including supervisors",
                censusKey: "S2401_C01_022E"
              },
              { title: "Food preparation and serving related occupations",
                censusKey: "S2401_C01_023E"
              },
              { title: "Building and grounds cleaning and maintenance occupations",
                censusKey: "S2401_C01_024E"
              },
              { title: "Personal care and service occupations",
                censusKey: "S2401_C01_025E"
              },
            ],
          },
          { title: "Sales and Office Occupations",
            children: [
              { title: "Sales and related occupations",
                censusKey: "S2401_C01_027E"
              },
              { title: "Office and administrative support occupations",
                censusKey: "S2401_C01_028E"
              },
            ],
          },
          { title: "Natural resources, construction, and maintenance occupations",
            children: [
              { title: "Farming, fishing, and forestry occupations",
                censusKey: "S2401_C01_030E"
              },
              { title: "Construction and extraction occupations",
                censusKey: "S2401_C01_031E"
              },
              { title: "Installation, maintenance, and repair occupations",
                censusKey: "S2401_C01_032E"
              },
            ],
          },
          
          { title: "Production, transportation, and material moving occupations",
            children: [
              { title: "Production occupations",
                censusKey: "S2401_C01_034E"
              },
              { title: "Transportation occupations",
                censusKey: "S2401_C01_035E"
              },
              { title: "Material moving occupations",
                censusKey: "S2401_C01_036E"
              },
            ]
          },
        ],
      },
    },  

  {
      type:"CensusStatBox",
      title:'Percent of Population Over 16 Years-old, Not in Labor Force',
      sumType: 'pct',
      censusKeys:["B23025_007E"],
      divisorKey: "B23025_001E",
      showCompareYear: true,
      invertColors: true,
      valueSuffix: '%',
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:9
      }
   },




  {
    type: "CensusBarChart",
    title: "Employment Status for the Population 16 Years and Over",
    orientation: "horizontal",
    marginLeft: 250,
    legendPosition: "bottom-right",
    censusKeys: ["B23025_001E...B23025_007E"],
    hideWhenCompact: true,
    layout:{
         w:9,
         h:9
      }
  },

  {
      type:"CensusStatBox",
      title:'Percent of Labor Force Unemployed (census proxy for unemployment rate)',
      sumType: 'pct',
      censusKeys:["B23025_005E"],
      divisorKey: "B23025_001E",
      showCompareYear: true,
      valueSuffix: '%',
      invertColors: true,
      maximumFractionDigits: 1,
      layout:{
         w:3,
         h:9
      }
   },

  {
    type: "CensusStackedBarChart",
    title: "Labor Force Participation",
    showCompareGeoid: false,
    orientation: "horizontal",
    marginLeft: 275,
    layout:{
         w:9,
         h:9
      },
    left: {
      key: "Male", color: maleColor,
      keys: [
        "C23002A_004E...C23002A_009E",
        "C23002A_011E...C23002A_014E"
      ]
    },
    right: {
      key: "Female", color: femaleColor,
      keys: [
        "C23002A_017E...C23002A_022E",
        "C23002A_024E...C23002A_027E"
      ]
    },
    labels: [
      "16 to 64 years In labor force",
      "16 to 64 years In labor force In Armed Forces",
      "16 to 64 years In labor force Civilian",
      "16 to 64 years In labor force Civilian Employed",
      "16 to 64 years In labor force Civilian Unemployed",
      "16 to 64 years Not in labor force",
      "65 years and over In labor force",
      "65 years and over In labor force Employed",
      "65 years and over In labor force Unemployed",
      "65 years and over Not in labor force"
    ]
  },

  {
    type: "CensusBarChart",
    title: "Industry by Median Earnings",
    orientation: "horizontal",
    layout: { h: 12 },
    marginLeft: 480,
    yFormat: "$,d",
    censusKeys: ["B24031_001E...B24031_027E"],
    removeLeading: 1,
    hideWhenCompact: true,
    layout:{
         w:12,
         h:17,
      }

  },

    {
      type: "TextBox",
      header: "Upstate Alliance for the Creative Economy",
      subheader: "Data, Reports",
      body: "",
      link: "http://www.upstatecreative.org/",
      layout: {
            h: 5,
            w: 12
             }
    },

    {
      type: "TextBox",
      header: "Center for Economic Growth (CEG) - Economic Scorecard",
      subheader: "Reports and Visualizations",
      body: "CEG’s Capital Region Economic Scorecards are a quarterly feature of the organization’s newsletter, The CEG Indicator, and are oﬀered exclusively to our investors. These scorecards track 30 mostly local economic indicators to provide our investors with insights into the health of the region’s economy and the direction in which it is headed. There are ﬁve scorecards: Quarterly Performance Overview; Economic Conditions, Manufacturing, Consumer and Transportation.",
      link: "http://go.ceg.org/l/189672/2019-07-24/l2gpl6",
      layout: {
            h: 7,
            w: 12
             }
    }
]
