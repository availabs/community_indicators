import {
  configLoader,
  maleColor,
  femaleColor
} from "./utils"

const BASE_CONFIG = [
    {
          type: "TextBox",
          header: "SOCIAL WELFARE",
          body: "This section covers issues related to fabric of our community",
          layout: { 
            h: 3,
            w: 12
             }
        },


    {
        type: 'CensusStackedBarChart',
        broadCensusKey: 'B01001',
        left: { key: "Male", slice: [2, 25], color: maleColor },
        right: { key: "Female", slice: [26, 49], color: femaleColor },
        layout: { h: 12 },
        marginLeft: 115,
        labels: [
          'Under Age 5',
          'Ages 5-9',
          'Ages 10-14',
          'Ages 15-17',
          'Ages 18-19',
          'Ages 20',
          'Ages 21',
          'Ages 22-24',
          'Ages 25-29',
          'Ages 30-34',
          'Ages 35-39',
          'Ages 40-44',
          'Ages 45-49',
          'Ages 50-54',
          'Ages 55-59',
          'Ages 60-61',
          'Ages 62-64',
          'Ages 65-66',
          'Ages 67-69',
          'Ages 70-74',
          'Ages 75-79',
          'Ages 80-84',
          'Ages 85 and over'
        ]
    },
        {
        type:'CensusStackedBarChart',
        broadCensusKey: 'B17001',
        left: { key: "Below Poverty Level", slice: [0, 26] },
        right: { key: "Above Poverty Level", slice: [26, 52] },
        marginLeft: 150,
        layout: { h: 12 },
        labels: [
          'Male Under age 5',
          'Male age 5',
          'Male ages 6-11',
          'Male ages 12-14',
          'Male ages 15',
          'Male ages 16-17',
          'Male ages 18-24',
          'Male ages 25-34',
          'Male ages 35-44',
          'Male ages 45-54',
          'Male ages 55-64',
          'Male ages 65-74',
          'Male ages 75 and over',
          'Female Under age 5',
          'Female age 5',
          'Female ages 6-11',
          'Female ages 12-14',
          'Female ages 15',
          'Female ages 16-17',
          'Female ages 18-24',
          'Female ages 25-34',
          'Female ages 35-44',
          'Female ages 45-54',
          'Female ages 55-64',
          'Female ages 65-74',
          'Female ages 75 and over',
        ]
    },
    {
        type: 'CensusBarChart',
        title: "Language Spoken at Home by Ability to Speak English",
        censusKeys: [
          'B16001_004E',
          'B16001_005E',
          'B16001_007E',
          'B16001_008E',
          'B16001_010E',
          'B16001_011E',
          'B16001_013E',
          'B16001_014E',
          'B16001_016E',
          'B16001_017E',
          'B16001_019E',
          'B16001_020E',
          'B16001_022E',
          'B16001_023E',
          'B16001_094E',
          'B16001_095E',
          'B16001_030E',
          'B16001_031E',
          'B16001_034E',
          'B16001_035E',
          'B16001_037E',
          'B16001_038E',
          'B16001_040E',
          'B16001_041E',
          'B16001_043E',
          'B16001_044E',
          'B16001_091E',
          'B16001_092E',
          'B16001_049E',
          'B16001_050E',
          'B16001_052E',
          'B16001_053E',
          'B16001_055E',
          'B16001_056E',
          'B16001_058E',
          'B16001_059E',
          'B16001_061E',
          'B16001_062E',
          'B16001_064E',
          'B16001_065E',
          'B16001_067E',
          'B16001_068E',
          'B16001_070E',
          'B16001_071E',
          'B16001_073E',
          'B16001_074E',
          'B16001_076E',
          'B16001_077E',
        ],
        orientation: 'horizontal',
        marginLeft: 500,
        sorted: true,
        layout: { h: 18 }
    },

   
    {
        type:'CensusStackedBarChart',
        broadCensusKey: 'B21001',
        left: { key: "Male", slice: [5, 20], color: maleColor },
        right: { key: "Female", slice: [23, 38], color: femaleColor },
        marginLeft: 175,
        labels: [
          'Total 18-34',
          '18-34 years, veteran',
          '18-34 years, non-veteran',
          'Total 35-54 years',
          '35-54 years, veteran',
          '35-54 years, non-veteran',
          'Total 55-64 years',
          '55-64 years, veteran',
          '55-64 years, non-veteran',
          'Total 65-74 years',
          '65-74 years, veteran',
          '65-74 years, non-veteran',
          'Total 75 years and over',
          '75 years and over, veteran',
          '75 years and over, non-veteran',
        ]
    },

        {
        
      type: "CensusLineChart",
      title: "Receipt of Food Stamps/SNAP by Race",
      marginLeft: 75,
      censusKeys: [
        "B22005A_001E",
        "B22005B_001E",
        "B22005C_001E",
        "B22005D_001E",
        "B22005E_001E",
        "B22005F_001E",
        "B22005G_001E",
        "B22005H_001E",
        "B22005I_001E"
      ],
      censusKeyLabels: {
        "B22005A_001E": "White",
        "B22005B_001E": "Black or African American Alone",
        "B22005C_001E": "American Indian and Alaska Native",
        "B22005D_001E": "Asian",
        "B22005E_001E": "Native Hawaiian and Other Pacific Islander",
        "B22005F_001E": "Some Other Race Alone",
        "B22005G_001E": "Two or More Races",
        "B22005H_001E": "White Alone, Not Hispanic or Latino",
       "B22005I_001E": "Hispanic or Latino"
      }
    },

    

      {
      type: "TextBox",
      header: "Food Access Research Atlas by the United States Department of Agriculture",
      subheader: "Data Visualization",
      body: "Map of Food Insecure Areas (nearest grocery store is within 1 and 10 miles.",
      link: "https://map.feedingamerica.org/",
      layout: { 
            h: 3,
            w: 12
             }

    },
    {
      type: "TextBox",
      header: "Child Care Regulated Programs",
      subheader: "Data",
      body: "Information on OCFS regulated child care programs, which includes program overview information and violation history.",
      link: "https://data.ny.gov/Human-Services/Child-Care-Regulated-Programs/cb42-qumz/data",
      layout: { 
            h: 3,
            w: 12
             }
    },
    {
      type: "TextBox",
      header: "New York State Division of Criminal Justice Services" ,
      subheader: "Data Downloads and Report Publications" ,
      body: "Criminal justice data by county from New York State Division of Criminal Justice Services including Violent Crimes, Domestic Violence Victims, Arrests, Dispositions, Youth Justice Data, and more",
      link: "https://www.criminaljustice.ny.gov/crimnet/ojsa/stats.htm",
      layout: { 
            h: 3,
            w: 12
             }
    }

]

export default configLoader(BASE_CONFIG);
