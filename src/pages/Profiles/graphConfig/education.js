import {
  configLoader,
  maleColor,
  femaleColor
} from "./utils"

const BASE_CONFIG = [
        {
            type: 'CensusBarChart',
            broadCensusKey: 'B15003',
            axisBottom: false
        },
        {
          type: 'CensusStackedBarChart',
          broadCensusKey: 'B14003',
          left: { key: "Male", slice: [0, 24], color: maleColor },
          right: { key: "Female", slice: [24, 48], color: femaleColor },
          marginLeft: 225,
          labels: [
            'ages 3 and 4, enrolled in school',
            'ages 5 to 9, enrolled in school',
            'ages 10 to 14, enrolled in school',
            'ages 15 to 17, enrolled in school',
            'ages 18 and 19, enrolled in school',
            'ages 20 to 24, enrolled in school',
            'ages 25 to 34, enrolled in school',
            'ages 35 and over, enrolled in school',
            'ages 3 and 4, enrolled in private school',
            'ages 5 to 9, enrolled in private school',
            'ages 10 to 14, enrolled in private school',
            'ages 15 to 17, enrolled in private school',
            'ages 18 and 19, enrolled in private school',
            'ages 20 to 24, enrolled in private school',
            'ages 25 to 34, enrolled in private school',
            'ages 35 and over, enrolled in private school',
            'ages 3 and 4, not enrolled in school',
            'ages 5 to 9, not enrolled in school',
            'ages 10 to 14, not enrolled in school',
            'ages 15 to 17, not enrolled in school',
            'ages 18 and 19, not enrolled in school',
            'ages 20 to 24, not enrolled in school',
            'ages 25 to 34, not enrolled in school',
            'ages 35 and over, not enrolled in school'
          ]
        },
   //  {
   //      id:'26',
   //      type:'CensusStackedBarChart',
   //      censusKey:['B14003'],
   //      schoolEnrollmentAge:true,
   //      colorRange:[],
   //      layout:{
   //          static: true,
   //          h:17,
   //          w:12,
   //          x:0,
   //          y:14
   //      }
   //  },
   //  {
   //      id:'27',
   //      type:'CensusStackedBarChart',
   //      censusKey:['B14003'],
   //      schoolEnrollmentAge:true,
   //      colorRange:[],
   //      layout:{
   //          static: true,
   //          h:17,
   //          w:9,
   //          x:0,
   //          y:31
   //      }
   //  },
   //  {
   //    title: "Test",
   //    "type": "CensusStatBox",
   //    "censusKey": "B15003_002E",
   //    amount: true,
   //    "layout": {
   //       "w":2,
   //       "h":12
   //    }
   // },
   // {
   //    "id":"11",
   //    "type":"CensusMultiStackedLineChart",
   //    "censusKey":[
   //       "B15003"
   //    ],
   //    "colorRange":[
   //
   //    ],
   //    "education":true,
   //    "layout":{
   //       "w":10,
   //       "h":13,
   //       "x":2,
   //       "y":44,
   //       "i":"11"
   //    },
   //    "geoid":[
   //       "36001"
   //    ]
   // },

 {
      type: "ProfileFooter",
      data: [
        [
          { type: "header", value: "ELSi from the National Center for Education Statistics" },
          { type: "subheader", value: "Data Downloads" },
          { type: "body", value: "The Elementary/Secondary Information System (ElSi) is an NCES web application that allows users to quickly view public and private school data and create custom tables and charts using data from the Common Core of Data (CCD) and Private School Survey (PSS). ElSi utilizes variables that are frequently requested by users for producing tables. It is a fast, easy way to obtain basic statistical data on U.S. schools. When generating custom tables, ElSi allows the user to choose row variables, column variables and filters to refine the data included in tables produced. Data includes School Attendance Rates Kindergarten Readiness, Absenteeism K-3, Dropouts, Grade 3 Pass Rates, Grade 3 Reading, Public High School Graduation Rates, Participation in Free Lunch, and more." },
          { type: "link", value: "https://nces.ed.gov/ccd/elsi/" }
        ]
      ]
    }

]

export default configLoader(BASE_CONFIG)
