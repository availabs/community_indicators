module.exports = [
    {
        id:'13',
        type:'CensusBarChart',
        censusKey:['B19119'],
        year: ['2017'],
        familyIncome:true,
        layout: {
            static: false,
            i: '13',
            h: 12,
            w: 12,
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
            i: '14',
            h:12,
            w:12,
            x:0,
            y:12
        }
    },
    {
        id: '15',
        type: 'CensusBarChart',
        censusKey: ['B16001'],
        language:true,
        colorRange:[],
        layout: {
            static: false,
            i: '15',
            h: 12,
            w: 12,
            x: 0,
            y: 24,
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
    /*{
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
*/

]