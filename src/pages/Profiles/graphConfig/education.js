import {
  configLoader,
  maleColor,
  femaleColor
} from "./utils"

const year = 2017;

const BASE_CONFIG = [

      {
          type: "TextBox",
          header: "EDUCATION",
          body: "Education is key to preparing children for success as adults and for ensuring the economic and civic vitality of our region. ",
          layout: {
            h: 3,
            w: 12
             }
        },

 {
      type:"CensusStatBox",
      title: "Total With No High School Diploma or Equivalent",
      censusKeys:['B15003_002E...B15003_016E'],
      showCompareYear: true,
      maximumFractionDigits: 1,
      invertColors: true,
      layout:{
         w:6,
         h:4,
      }
   },

   {
      type:"CensusStatBox",
      title: "Percent of Population with No High School Diploma or Equivalent",
      sumType: 'pct',
      divisorKey: "B23025_001E",
      valueSuffix: '%',
      maximumFractionDigits: 1,
      censusKeys:['B15003_002E...B15003_016E'],
      divisorKeys:['B01003_001E'],
      showCompareYear: true,
      invertColors: true,
      layout:{
         w:6,
         h:4,
      }
   },


        {
            type: 'CensusBarChart',
            title: 'Educational Attainment',
            orientation: 'horizontal',
            marginLeft: 225,
            censusKeys: [
              'B15003_016E...B15003_025E'
              // 'B15003_002E...B15003_025E',
            ],
            description: ["Testing", "Testing"]
        },

          {
              type: 'CensusPieChart',
              title: 'Educational Attainment',
              legendWidth: 260,
              censusKeys: [
                'B15003_016E...B15003_025E'
                // 'B15003_002E...B15003_025E',
              ],
              description: ["Testing", "Testing"]
          },
        {
          title: "Sex by School Enrollment by Level of School by Type of School",
          type: "CensusStackedBarChart",
          marginLeft: 310,
          layout: { h: 12 },
          left: {
            key: "Male", color: maleColor,
            keys: ["B14002_004E...B14002_025E"]
          },
          right: {
            key: "Female", color: femaleColor,
            keys: ["B14002_028E...B14002_049E"]
          },
          labels: [
            "Enrolled in nursery school preschool",
            "Enrolled in nursery school preschool, Public school",
            "Enrolled in nursery school preschool, Private school",
            "Enrolled in kindergarten",
            "Enrolled in kindergarten, Public School",
            "Enrolled in kindergarten, Private School",
            "Enrolled in grade 1 to grade 4",
            "Enrolled in grade 1 to grade 4, Public School",
            "Enrolled in grade 1 to grade 4, Private School",
            "Enrolled in grade 5 to grade 8",
            "Enrolled in grade 5 to grade 8, Public School",
            "Enrolled in grade 5 to grade 8, Private School",
            "Enrolled in grade 9 to grade 12",
            "Enrolled in grade 9 to grade 12, Public School",
            "Enrolled in grade 9 to grade 12, Private School",
            "Enrolled in college undergraduate years",
            "Enrolled in college undergraduate years, Public School",
            "Enrolled in college undergraduate years, Private School",
            "Enrolled in graduate or professional school",
            "Enrolled in graduate or professional school, Public School",
            "Enrolled in graduate or professional school, Private School"
          ]
        },

    {
      type:"CensusStatBox",
      title: "Total Ages 5-19 Not Enrolled in School",
      censusKeys:["B14003_023E", "B14003_024E", "B14003_025E", "B14003_026E", "B14003_051E", "B14003_052E", "B14003_053E","B14003_054E"],
      amount:true,
      showCompareYear: true,
      maximumFractionDigits: 1,
      invertColors: true,
      layout:{
         w:6,
         h:3,
      }
   },

   {
      type:"CensusStatBox",
      title: "Percent Ages 3-4 Enrolled in School",
      censusKeys:['B14003_004E', 'B14003_013E', 'B14003_032E', 'B14003_041E'],
      divisorKeys:['B14003_004E', 'B14003_013E', 'B14003_022E', 'B14003_032E', 'B14003_041E', 'B14003_050E' ],
      sumType: 'pct',
      valueSuffix: '%',
      maximumFractionDigits: 1,
      showCompareYear: true,
      layout:{
         w:6,
         h:3,
      }
   },


        {
          type: 'CensusStackedBarChart',
          broadCensusKey: 'B14003',
          left: { key: "Male", slice: [0, 24], color: maleColor },
          right: { key: "Female", slice: [24, 48], color: femaleColor },
          marginLeft: 250,
          layout: { h: 12 },
          labels: [
            'Ages 3 and 4, enrolled in school',
            'Ages 5 to 9, enrolled in school',
            'Ages 10 to 14, enrolled in school',
            'Ages 15 to 17, enrolled in school',
            'Ages 18 and 19, enrolled in school',
            'Ages 20 to 24, enrolled in school',
            'Ages 25 to 34, enrolled in school',
            'Ages 35 and over, enrolled in school',
            'Ages 3 and 4, enrolled in private school',
            'Ages 5 to 9, enrolled in private school',
            'Ages 10 to 14, enrolled in private school',
            'Ages 15 to 17, enrolled in private school',
            'Ages 18 and 19, enrolled in private school',
            'Ages 20 to 24, enrolled in private school',
            'Ages 25 to 34, enrolled in private school',
            'Ages 35 and over, enrolled in private school',
            'Ages 3 and 4, not enrolled in school',
            'Ages 5 to 9, not enrolled in school',
            'Ages 10 to 14, not enrolled in school',
            'Ages 15 to 17, not enrolled in school',
            'Ages 18 and 19, not enrolled in school',
            'Ages 20 to 24, not enrolled in school',
            'Ages 25 to 34, not enrolled in school',
            'Ages 35 and over, not enrolled in school'
          ]
        },

        {
          title: "Median Earnings by Sex by Educational Attainment Ages 25 and Over",
          type: "CensusStackedBarChart",
          yFormat: "$,d",
          marginLeft: 310,
          left: {
            key: "Male", color: maleColor,
            keys: ["B20004_008E...B20004_012E"]
          },
          right: {
            key: "Female", color: femaleColor,
            keys: ["B20004_014E...B20004_018E"]
          },
          labels: [
            "Less than high school graduate",
            "High school graduate",
            "Some college or associate's degree",
            "EBachelor's degree",
            "Graduate or professional degree",
          ]
        },

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
