import {
  configLoader,
  maleColor,
  femaleColor
} from "./utils"

const BASE_CONFIG = [
    {
        type: 'CensusBarChart',
        title: "Median Family Income by Family Size",
        censusKeys: [
          'B19119_001E',
          'B19119_002E',
          'B19119_003E',
          'B19119_004E',
          'B19119_005E',
          'B19119_006E',
          'B19119_007E'

        ],
        censusKeyNames: {
          'B19119_001E': 'Total',
          'B19119_002E': '2-person families',
          'B19119_003E': '3-person families',
          'B19119_004E': '4-person families',
          'B19119_005E': '5-person families',
          'B19119_006E': '6-person families',
          'B19119_007E': '7-person families'
        },
        years: ['2017'],
        yFormat: "$,d"
    },
    {
        type: 'CensusStackedBarChart',
        broadCensusKey: 'B01001',
        left: { key: "Male", slice: [2, 25], color: maleColor },
        right: { key: "Female", slice: [26, 49], color: femaleColor },
        layout: { h: 12 },
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
        censusKeyNames: {
          'B16001_004E': 'Spanish or Spanish Creole Speak English very well',
          'B16001_005E': 'Spanish or Spanish Creole Speak English Less than very well',
          'B16001_007E': 'French (incl. Patois,Cajun) Speak English very well',
          'B16001_008E': 'French (incl. Patois,Cajun) Speak English Less than very well',
          'B16001_010E': 'French Creole Speak English very well',
          'B16001_011E': 'French Creole Speak English Less than very well',
          'B16001_013E': 'Italian Speak English very well',
          'B16001_014E': 'Italian Speak English Less than very well',
          'B16001_016E': 'Portuguese or Portuguese Creole Speak English very well',
          'B16001_017E': 'Portuguese or Portuguese Creole Speak English Less than very well',
          'B16001_019E': 'German Speak English very well',
          'B16001_020E': 'German Speak English Less than very well',
          'B16001_022E': 'Yiddish Speak English very well',
          'B16001_023E': 'Yiddish Speak English Less than very well',
          'B16001_094E': 'Tagalog Speak English very well ',
          'B16001_095E': 'Tagalog Speak English Less than very well ',
          'B16001_030E': 'Greek Speak English very well',
          'B16001_031E': 'Greek Speak English Less than very well',
          'B16001_034E': 'Russian Speak English very well',
          'B16001_035E': 'Russian Speak English Less than very well',
          'B16001_037E': 'Polish Speak English very well',
          'B16001_038E': 'Polish Speak English Less than very well',
          'B16001_040E': 'Serbo-Croatian Speak English very well',
          'B16001_041E': 'Serbo-Croatian Speak English Less than very well',
          'B16001_043E': 'Other Salvic Languages Speak English very well',
          'B16001_044E': 'Other Salvic Languages Speak English Less than very well',
          'B16001_091E': 'Other Asian Languages Speak English very well ',
          'B16001_092E': 'Other Asian Languages Speak English Less than very well ',
          'B16001_049E': 'Persian Speak English very well',
          'B16001_050E': 'Persian Speak English Less than very well',
          'B16001_052E': 'Gujarati Speak English very well',
          'B16001_053E': 'Gujarati Speak English Less than very well',
          'B16001_055E': 'Hindi Speak English very well',
          'B16001_056E': 'Hindi Speak English Less than very well',
          'B16001_058E': 'Urdu Speak English very well',
          'B16001_059E': 'Urdu Speak English Less than very well',
          'B16001_061E': 'Other Indic languages Speak English very well',
          'B16001_062E': 'Other Indic languages Speak English Less than very well',
          'B16001_064E': 'Other Indo-European languages Speak English very well',
          'B16001_065E': 'Other Indo-European languages Speak English Less than very well',
          'B16001_067E': 'Chinese Speak English very well',
          'B16001_068E': 'Chinese Speak English Less than very well',
          'B16001_070E': 'Japanese Speak English very well',
          'B16001_071E': 'Japanese Speak English Less than very well',
          'B16001_073E': 'Korean Speak English very well',
          'B16001_074E': 'Korean Speak English Less than very well',
          'B16001_076E': 'Mon-Khmer Cambodian Speak English very well',
          'B16001_077E': 'Mon-Khmer Cambodian Speak English Less than very well',
        },
        orientation: 'horizontal',
        marginLeft: 350,
        sorted: true,
        layout: { h: 18 }
    },
    {
      title: "Median Household Income by Race",
      type: 'CensusLineChart',
      censusKeys: [
        'B19013A_001E',
        'B19013B_001E',
        'B19013C_001E',
        'B19013D_001E',
        'B19013E_001E',
        'B19013F_001E',
        'B19013G_001E',
        'B19013H_001E',
        'B19013I_001E'
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
        type:'CensusStackedBarChart',
        broadCensusKey: 'B21001',
        left: { key: "Male", slice: [5, 20], color: maleColor },
        right: { key: "Female", slice: [23, 38], color: femaleColor },
        marginLeft: 200,
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
      type: "ProfileFooter",
      data: [
        [
          { type: "header", value: "ALICE from United Way" },
          { type: "subheader", value: "Reports, Visualizations, and Data Downloads" },
          { type: "body", value: "The ALICE (Asset Limited, Income Constrained, Employed) Project was initiated by United Way of Northern New Jersey several years ago to bring focus to the families and individuals who work but whose salaries do not provide sufficient resources to meet basic needs. The ALICE Project developed a methodology using publicly available census, employment, wage, cost of living and other data to help to understand the extent of ALICE in our communities, those who are above the federal poverty level, but below a sustainable wage." },
          { type: "link", value: "https://www.unitedforalice.org/new-york" }
        ],
        [
          { type: "header", value: "New York State Division of Criminal Justice Services" },
          { type: "subheader", value: "Data Downloads and Report Publications" },
          { type: "body", value: "Criminal justice data by county from New York State Division of Criminal Justice Services including Violent Crimes, Domestic Violence Victims, Arrests, Dispositions, Youth Justice Data, and more" },
          { type: "link", value: "https://www.criminaljustice.ny.gov/crimnet/ojsa/stats.htm" }
        ]
      ]
    }

]

export default configLoader(BASE_CONFIG);
