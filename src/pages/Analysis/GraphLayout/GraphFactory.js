import React from 'react'
import CensusCharts from 'components/censusCharts/'
import TrackVisibility from 'react-on-screen';

export default ({ graph, ...rest }) => {
    const graphType = graph.type.split(' ').join(''),
        Graph = CensusCharts[graphType] || CensusCharts['NA']
    return (
        <TrackVisibility offset={100}>
        <GraphHider Graph={Graph} { ...rest } graph ={graph }/>
        </TrackVisibility>
)
}

const GraphHider = ({isVisible, Graph, graph, ...rest}) => {
    return isVisible ?
    <Graph {...rest} {...graph} /> :
    <div>Loading...</div>
}