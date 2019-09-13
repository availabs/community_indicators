import React from 'react'
import CensusBarChart from "./bar/censusBarChart.js"
import CensusBar from './censusBar'
import CensusDomGraph from "./bar/censusDomGraph.js"
import CensusGroupedBarChart from "./bar/censusGroupedBarChart.js"
import CensusStackedBarChart from "./bar/censusStackedBarChart.js"
import CensusLineChart from "./line/censusLineChart.js"
import CensusMultiStackedLineChart from "./line/censusMultiStackedLineChart.js"
import CensusStackedLineChart from "./line/censusStackedLineChart.js"
import CensusPieChart from "./pie/censusPieChart.js"
import CensusPieCompare from "./pie/censusPieCompare.js"
import CensusStatBox from "./statBox/index.js"
import TractLayer from "../layers/TractsLayers.js"

const NA = ({ type, state, routes }) =>
<div>
{ type } Not Implmented
<div>state:<br />{ JSON.stringify(state) }</div>
</div>

const NE = ((props) => (<div>{props.type} Doesn't Exist</div>))

export default {
    CensusBarChart,
    CensusBar,
    CensusDomGraph,
    CensusGroupedBarChart,
    CensusStackedBarChart,
    CensusLineChart,
    CensusMultiStackedLineChart,
    CensusStackedLineChart,
    CensusPieChart,
    CensusPieCompare,
    CensusStatBox,
    TractLayer,
    NE,
    NA
}

export const GRAPH_TYPES = {
    overview:
        [
            {type: "Language Bar Graph", category: "Bar Graphs"},
            {type: "Racial Population Dom Graph", category: "Bar Graphs"},
            {type: "Parents Bar Graph", category: "Bar Graphs"},
            {type: "Population by Sex Bar Graph", category: "Bar Graphs"},
            {type: "Median Income Line Graph", category: "Line Graphs"},
            {type: "Poverty level Line Graph", category: "Line Graph"},
            {type: "Education level Line Graph", category: "Line Graphs"},
            {type: "Housing units Line Graph", category: "Line Graphs"},
            {type: "Racial Population 2017", category: "Pie Graphs"},
            {type: "Racial Population", category: "Pie Graphs"},
            {type: "Population Stat Box", category: "Stat Box"},
            {type: "Median Age Stat Box", category: "Stat Box"},
            {type: "Household income Stat Box", category: "Stat Box"},
            {type: "Housing units Stat Box", category: "Stat Box"},
            {type: "Education Level Stat Box", category: "Stat Box"}
        ]


};