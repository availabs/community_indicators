import {
  configLoader,
  maleColor,
  femaleColor
} from "./utils"

const BASE_CONFIG = [
    {
        type: 'CensusBarChart',
        broadCensusKey: 'B19119',
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
        broadCensusKey: 'B16001',
        orientation: 'horizontal',
        marginLeft: 350,
        sorted: true,
        layout: { h: 18 }
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013A'
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013B'
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013C'
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013D'
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013E'
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013F'
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013G'
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013H'
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013I'
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
