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
        marginLeft: 260,
        sorted: true,
        //axisBottom: false,
        layout: { h:24 }
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013A'
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013B',
        layout: { w: 6 }
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013C',
        layout: { w: 6 }
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013D',
        layout: { w: 6 }
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013E',
        layout: { w: 6 }
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013F',
        layout: { w: 6 }
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013G',
        layout: { w: 6 }
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013H',
        layout: { w: 6 }
    },
    {
        type: 'CensusLineChart',
        broadCensusKey: 'B19013I',
        layout: { w: 6 }
    },
    {
        type:'CensusStackedBarChart',
        broadCensusKey: 'B17001',
        left: { key: "Below Poverty Level", slice: [0, 26] },
        right: { key: "Above Poverty Level", slice: [26, 52] },
        marginLeft: 150,
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
        left: { key: "Male ages", slice: [5, 20], color: maleColor },
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
          { type: "header", value: "TEST HEADER" },
          { type: "subheader", value: "SUBHEADER" },
          { type: "body", value: "SOME TEXT HERE!!!" },
          { type: "link", value: "A LINK" }
        ],
        [
          { type: "header", value: "TEST HEADER" },
          { type: "subheader", value: "SUBHEADER" },
          { type: "body", value: "SOME TEXT HERE!!!" },
          { type: "link", value: "A LINK" }
        ]
      ]
    }

]

export default configLoader(BASE_CONFIG);
