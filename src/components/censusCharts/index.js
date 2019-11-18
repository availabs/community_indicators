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
import TextBox from "./TextBox"
import CensusMap from "./map"

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
    TextBox,
    CensusMap,
    NE,
    NA
}
