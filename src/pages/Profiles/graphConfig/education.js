// Education
module.exports =[
        {
            id:'25',
            type:'CensusBarChart',
            censusKey:['B15003'],
            educationalAttainment: true,
            colorRange:[],
            layout:{
                static:true,
                h:14,
                w:12,
                x:0,
                y:0
            }
        },
    {
        id:'26',
        type:'CensusStackedBarChart',
        censusKey:['B14003'],
        schoolEnrollmentAge:true,
        colorRange:[],
        layout:{
            static: true,
            h:17,
            w:12,
            x:0,
            y:14
        }
    },
    {
        id:'27',
        type:'CensusStackedBarChart',
        censusKey:['B14003'],
        schoolEnrollmentAge:true,
        colorRange:[],
        layout:{
            static: true,
            h:17,
            w:9,
            x:0,
            y:31
        }
    },
    {
      "id":"10",
      "type":"CensusStatBox",
      "censusKey":[
         "B15003"
      ],
      "education":true,
      "colorRange":[

      ],
      "layout":{
         "w":2,
         "h":13,
         "x":0,
         "y":44,
         "i":"10"
      },
      "geoid":[
         "36001"
      ]
   },
   {
      "id":"11",
      "type":"CensusMultiStackedLineChart",
      "censusKey":[
         "B15003"
      ],
      "colorRange":[

      ],
      "education":true,
      "layout":{
         "w":10,
         "h":13,
         "x":2,
         "y":44,
         "i":"11"
      },
      "geoid":[
         "36001"
      ]
   },

]