module.exports = [

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
        id: '5',
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
        id :'6',
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
        id :'7',
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
        id: '8',
        type: 'CensusLineChart',
        censusKey: ['B17001'],
        layout: {
            static: false,
            h: 14,
            w: 7,
            x: 0,
            y: 0
        }
    },
    {
        id :'9',
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
        id: '10',
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
        id :'11',
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
        id: '12',
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
        id:'13',
        type: 'CensusStackedBarChart',
        censusKey:['B01001'],
        layout:{
            static: false,
            h:16,
            w:10,
            x:0,
            y:0
        }
    },
    // need to ask about it
    {
        id:'14',
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

]

