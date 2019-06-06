module.exports = {

    /*
    NOTES :

    1)While copy pasting from the console.log, please make sure to copy the whole array (of objects)
    and paste it here as the value pair of the key overview or socialWelfare(respectively)

    2) For Graph Type : CensusStatBox
        colorRange array is as following:
        1st color : Main title color ( Demographics, housing Poverty, Education etc..)
        2nd color : SubTitle color ( Overall population, median age etc ...)
        3rd color : Year color( 2017 etc)
        4th color : Value color

     */

    //-------------------------------------------Overview--------------------------------------

    overview :[
   {
      "id":"13",
      "type":"CensusBarChart",
      "censusKey":[
         "B19119"
      ],
      "year":[
         "2017"
      ],
      "familyIncome":true,
      "colorRange":[

      ],
      "layout":{
         "static":false,
         "h":14,
         "w":8,
         "x":0,
         "y":0
      },
      "geoid":[
         "36083"
      ]
   },
   {
      "id":"14",
      "type":"CensusStackedBarChart",
      "censusKey":[
         "B01001"
      ],
      "PopulationByAge":true,
      "colorRange":[

      ],
      "layout":{
         "static":true,
         "h":16,
         "w":10,
         "x":0,
         "y":0
      },
      "geoid":[
         "36083"
      ]
   },
   {
      "id":"15",
      "type":"CensusBarChart",
      "censusKey":[
         "B16001"
      ],
      "colorRange":[

      ],
      "layout":{
         "static":false,
         "h":14,
         "w":10,
         "x":0,
         "y":0
      },
      "geoid":[
         "36083"
      ]
   },
   {
      "id":"16",
      "type":"CensusLineChart",
      "censusKey":[
         "B19013A"
      ],
      "colorRange":[

      ],
      "layout":{
         "static":false,
         "h":14,
         "w":7,
         "x":0,
         "y":0
      },
      "geoid":[
         "36083"
      ]
   },
   {
      "id":"17",
      "type":"CensusLineChart",
      "censusKey":[
         "B19013B"
      ],
      "colorRange":[

      ],
      "layout":{
         "static":false,
         "h":14,
         "w":7,
         "x":0,
         "y":0
      },
      "geoid":[
         "36083"
      ]
   },
   {
      "id":"18",
      "type":"CensusLineChart",
      "censusKey":[
         "B19013C"
      ],
      "colorRange":[

      ],
      "layout":{
         "static":false,
         "h":14,
         "w":7,
         "x":0,
         "y":0
      },
      "geoid":[
         "36083"
      ]
   },
   {
      "id":"19",
      "type":"CensusLineChart",
      "censusKey":[
         "B19013D"
      ],
      "colorRange":[

      ],
      "layout":{
         "static":false,
         "h":14,
         "w":7,
         "x":0,
         "y":0
      },
      "geoid":[
         "36083"
      ]
   },
   {
      "id":"20",
      "type":"CensusLineChart",
      "censusKey":[
         "B19013E"
      ],
      "colorRange":[

      ],
      "layout":{
         "static":false,
         "h":14,
         "w":7,
         "x":0,
         "y":0
      },
      "geoid":[
         "36083"
      ]
   },
   {
      "id":"21",
      "type":"CensusLineChart",
      "censusKey":[
         "B19013F"
      ],
      "colorRange":[

      ],
      "layout":{
         "static":false,
         "h":14,
         "w":7,
         "x":0,
         "y":0
      },
      "geoid":[
         "36083"
      ]
   },
   {
      "id":"22",
      "type":"CensusLineChart",
      "censusKey":[
         "B19013G"
      ],
      "colorRange":[

      ],
      "layout":{
         "static":false,
         "h":14,
         "w":7,
         "x":0,
         "y":0
      },
      "geoid":[
         "36083"
      ]
   },
   {
      "id":"11",
      "type":"CensusLineChart",
      "censusKey":[
         "B19013H"
      ],
      "colorRange":[

      ],
      "layout":{
         "static":false,
         "h":14,
         "w":7,
         "x":0,
         "y":0
      },
      "geoid":[
         "36083"
      ]
   },
   {
      "id":"12",
      "type":"CensusLineChart",
      "censusKey":[
         "B19013I"
      ],
      "colorRange":[

      ],
      "layout":{
         "static":false,
         "h":14,
         "w":7,
         "x":0,
         "y":0
      },
      "geoid":[
         "36083"
      ]
   },
   {
      "id":"23",
      "type":"CensusStackedBarChart",
      "censusKey":[
         "B17001"
      ],
      "PovertyPopulationBySex":true,
      "colorRange":[

      ],
      "layout":{
         "static":true,
         "h":17,
         "w":11,
         "x":0,
         "y":0
      },
      "geoid":[
         "36083"
      ]
   },
   {
      "id":"24",
      "type":"CensusStackedBarChart",
      "censusKey":[
         "B21001"
      ],
      "CivilianStatus":true,
      "colorRange":[

      ],
      "layout":{
         "static":true,
         "h":17,
         "w":11,
         "x":0,
         "y":0
      },
      "geoid":[
         "36083"
      ]
   }
],

    //---------------------------------------Social Welfare------------------------------------
    socialWelfare:[
        {
            id:'13',
            type:'CensusBarChart',
            censusKey:['B19119'],
            year: ['2017'],
            familyIncome:true,
            colorRange: [],
            layout: {
                static: false,
                h: 14,
                w: 8,
                x: 0,
                y: 0
            }
        },
        {
            id:'14', // The year slider doesn`t work if static is false
            type: 'CensusStackedBarChart',
            censusKey:['B01001'],
            PopulationByAge:true,
            colorRange:[],
            layout:{
                static: true,
                h:16,
                w:10,
                x:0,
                y:0
            }
        },
        {
            id: '15',
            type: 'CensusBarChart',
            censusKey: ['B16001'],
            colorRange:[],
            layout: {
                static: false,
                h: 14,
                w: 10,
                x: 0,
                y: 0,
            }
        },
        {
            id: '16',
            type: 'CensusLineChart',
            censusKey: ['B19013A'],
            colorRange:[],
            layout: {
                static: false,
                h: 14,
                w: 7,
                x: 0,
                y: 0
            }
        },
        {
            id: '17',
            type: 'CensusLineChart',
            censusKey: ['B19013B'],
            colorRange:[],
            layout: {
                static: false,
                h: 14,
                w: 7,
                x: 0,
                y: 0
            }
        },
        {
            id: '18',
            type: 'CensusLineChart',
            censusKey: ['B19013C'],
            colorRange:[],
            layout: {
                static: false,
                h: 14,
                w: 7,
                x: 0,
                y: 0
            }
        },
        {
            id: '19',
            type: 'CensusLineChart',
            censusKey: ['B19013D'],
            colorRange:[],
            layout: {
                static: false,
                h: 14,
                w: 7,
                x: 0,
                y: 0
            }
        },
        {
            id: '20',
            type: 'CensusLineChart',
            censusKey: ['B19013E'],
            colorRange:[],
            layout: {
                static: false,
                h: 14,
                w: 7,
                x: 0,
                y: 0
            }
        },
        {
            id: '21',
            type: 'CensusLineChart',
            censusKey: ['B19013F'],
            colorRange:[],
            layout: {
                static: false,
                h: 14,
                w: 7,
                x: 0,
                y: 0
            }
        },
        {
            id: '22',
            type: 'CensusLineChart',
            censusKey: ['B19013G'],
            colorRange:[],
            layout: {
                static: false,
                h: 14,
                w: 7,
                x: 0,
                y: 0
            }
        },
        {
            id: '11',
            type: 'CensusLineChart',
            censusKey: ['B19013H'],
            colorRange:[],
            layout: {
                static: false,
                h: 14,
                w: 7,
                x: 0,
                y: 0
            }
        },
        {
            id: '12',
            type: 'CensusLineChart',
            censusKey: ['B19013I'],
            colorRange:[],
            layout: {
                static: false,
                h: 14,
                w: 7,
                x: 0,
                y: 0
            }
        },
        {
            id:'23', // The year slider doesn`t work if static is false
            type:'CensusStackedBarChart',
            censusKey:['B17001'],
            PovertyPopulationBySex: true,
            colorRange:[],
            layout:{
                static: true,
                h:17,
                w:11,
                x:0,
                y:0
            }
        },
        {
            id:'24',// The year slider doesn`t work if static is false
            type:'CensusStackedBarChart',
            censusKey:['B21001'],
            CivilianStatus: true,
            colorRange:[],
            layout :{
                static: true,
                h:17,
                w:11,
                x:0,
                y:0
            }
        },

    ]
}

