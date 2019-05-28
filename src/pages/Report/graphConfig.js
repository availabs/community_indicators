module.exports = {
    //-------------------------------------------Overview--------------------------------------
    overview :[
        {
            id: '1',
            type: 'CensusStatBox',
            censusKey: ['B01003'],
            year: ['2017'],
            demographics: true,
            layout: {
                static: false,
                h: 5,
                w: 2,
                x: 0,
                y: 0,
            }
        },
        {
            id: '2',
            type: 'CensusStatBox',
            censusKey: ['B01002'],
            year: ['2017'],
            demographics: true,
            layout: {
                static: false,
                h: 5,
                w: 2,
                x: 0,
                y: 0,
            }
        },
        {
            id: '3',
            type: 'CensusPieChart',
            censusKey: ['B02001'],
            year: ['2017'],
            single: true,
            layout: {
                static: false,
                h: 6,
                w: 5,
                x: 0,
                y: 0,
            }
        },
        {
            id: '4',
            type: 'CensusLineChart',
            censusKey: ['B19013'],
            layout: {
                static: false,
                h: 14,
                w: 7,
                x: 0,
                y: 0
            }
        },
        {
            id :'5',
            type:'CensusStatBox',
            censusKey:['B19013'],
            amount:true,
            layout:{
                static:false,
                h: 5,
                w: 2,
                x:0,
                y:0
            }
        },
        {
            id :'6',
            type:'CensusStatBox',
            censusKey:['B17001'],
            poverty:true,
            layout:{
                static:false,
                h: 5,
                w: 2,
                x:0,
                y:0
            }
        },
        {
            id: '7',
            type: 'CensusLineChart',
            censusKey: ['B17001'],
            PovertyPopulationBySex:true,
            layout: {
                static: false,
                h: 14,
                w: 7,
                x: 0,
                y: 0
            }
        },
        {
            id :'8',
            type:'CensusStatBox',
            censusKey:['B25002'],
            housing:true,
            layout:{
                static:false,
                h: 5,
                w: 2,
                x:0,
                y:0
            }
        },
        {
            id: '9',
            type: 'CensusStackedLineChart',
            censusKey: ['B25002'],
            layout: {
                static: false,
                h: 14,
                w: 8,
                x: 0,
                y: 0
            }
        },
        {
            id :'10',
            type:'CensusStatBox',
            censusKey:['B15003'],
            education:true,
            layout:{
                static:false,
                h: 5,
                w: 2,
                x:0,
                y:0
            }
        },
        {
            id: '11',
            type: 'CensusMultiStackedLineChart',
            censusKey: ['B15003'],
            layout: {
                static: false,
                h: 14,
                w: 8,
                x: 0,
                y: 0
            }
        },
        {
            id:'12',
            type: 'CensusGroupedBarChart',
            censusKey:['B23008'],
            compareGeoid:['36'],
            layout: {
                static: false,
                h: 14,
                w: 8,
                x: 0,
                y: 0
            }
        }
    ],

    //---------------------------------------Social Welfare-----------------------------------
    socialWelfare:[
        {
            id:'13',
            type:'CensusBarChart',
            censusKey:['B19119'],
            year: ['2017'],
            familyIncome:true,
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

