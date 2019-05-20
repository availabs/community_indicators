import React from 'react'
import CensusCharts from 'components/censusCharts/'

export default ({ graph, ...rest }) => {
    const graphType = graph.type.split(' ').join(''),
        Graph = CensusCharts[graphType] || CensusCharts['NA']
    return (
        <Graph { ...rest } { ...graph }/>
)
}