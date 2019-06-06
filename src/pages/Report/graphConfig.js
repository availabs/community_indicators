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

    overview :[{"id":"1","type":"CensusStatBox","censusKey":["B01003"],"year":["2017"],"demographics":true,"colorRange":[],"layout":{"w":2,"h":5,"x":0,"y":0,"i":"1","static":false},"geoid":["36001"]},{"id":"2","type":"CensusStatBox","censusKey":["B01002"],"year":["2017"],"demographics":true,"colorRange":[],"layout":{"w":2,"h":5,"x":0,"y":9,"i":"2","static":false},"geoid":["36001"]},{"id":"3","type":"CensusPieChart","censusKey":["B02001"],"year":["2017"],"single":true,"colorRange":[],"layout":{"w":4,"h":6,"x":0,"y":14,"i":"3","static":false},"geoid":["36001"]},{"id":"4","type":"CensusLineChart","censusKey":["B19013"],"colorRange":[],"layout":{"w":4,"h":14,"x":0,"y":20,"i":"4","static":false},"geoid":["36001"]},{"id":"5","type":"CensusStatBox","censusKey":["B19013"],"amount":true,"colorRange":[],"layout":{"w":2,"h":5,"x":0,"y":34,"i":"5","static":false},"geoid":["36001"]},{"id":"6","type":"CensusStatBox","censusKey":["B17001"],"poverty":true,"colorRange":[],"layout":{"w":2,"h":5,"x":0,"y":39,"i":"6","static":false},"geoid":["36001"]},{"id":"7","type":"CensusLineChart","censusKey":["B17001"],"PovertyPopulationBySex":true,"colorRange":[],"layout":{"w":4,"h":14,"x":0,"y":44,"i":"7","static":false},"geoid":["36001"]},{"id":"8","type":"CensusStatBox","censusKey":["B25002"],"housing":true,"colorRange":[],"layout":{"w":2,"h":5,"x":0,"y":58,"i":"8","static":false},"geoid":["36001"]},{"id":"9","type":"CensusStackedLineChart","censusKey":["B25002"],"colorRange":[],"layout":{"w":4,"h":14,"x":0,"y":63,"i":"9","static":false},"geoid":["36001"]},{"id":"10","type":"CensusStatBox","censusKey":["B15003"],"education":true,"colorRange":[],"layout":{"w":2,"h":5,"x":0,"y":77,"i":"10","static":false},"geoid":["36001"]},{"id":"11","type":"CensusMultiStackedLineChart","censusKey":["B15003"],"education":true,"colorRange":[],"layout":{"w":4,"h":14,"x":0,"y":82,"i":"11","static":false},"geoid":["36001"]},{"id":"12","type":"CensusGroupedBarChart","censusKey":["B23008"],"compareGeoid":["36"],"colorRange":[],"layout":{"w":4,"h":14,"x":0,"y":96,"i":"12","static":false},"geoid":["36001"]}],

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


    ],
    //---------------------------------------Education------------------------------------
    education:[
        {
            id:'25',
            type:'CensusBarChart',
            censusKey:['B15003'],
            educationalAttainment: true,
            colorRange:[],
            layout:{
                static:true,
                h:14,
                w:10,
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
                w:11,
                x:0,
                y:0
            }
        },

    ],
    housing:[
        {
            id:'27',
            type:'CensusMultiStackedLineChart',
            censusKey:['B25004'],
            VacantHousing:true,
            colorRange:[],
            layout:{
                w:4,
                h:14,
                x:0,
                y:82,
                static:false
            }

        },
        {
            id:'28',
            type:'CensusStackedBarChart',
            censusKey:['B25118'],
            TenureHouseholdIncome:true,
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
            id:'29',
            type:'CensusStackedBarChart',
            censusKey:['B25087'],
            MortgageStatus:true,
            colorRange:[],
            layout:{
                static: true,
                h:17,
                w:11,
                x:0,
                y:0
            }
        },
    ]

}

