import React from 'react'

import CensusBarChart from "./bar/censusBarChart.js"
import CensusCompareBarChart from "./bar/censusCompareBarChart.js"
import CensusStackedBarChart from "./bar/CensusStackedBarChart"
import CensusLineChart from "./line/censusLineChart.js"
import CensusPieChart from "./pie/CensusPieChart.js"
import CensusStatBox from "./statBox/index.js"
import TextBox from "./TextBox"
import CensusMap from "./map"
import CensusRadarGraph from "./radar"
import CensusTreemap from "./treemap"
import ZCTAList from "./links/ZCTAList"
import UNSDList from "./links/UNSDList"
import QCEWStackedBarChart from "./qcew/QCEWStackedBarChart"
import QCEWStatBox from "./qcew/QCEWStatBox"

const NA = ({ type }) =>
  <div style={ {
      width: "100%", height: "100%",
      display: "flex", justifyContent: "center", alignItems: "center",
      fontSize: "1.5rem", fontWeight: "bold"
    } }>
    { type } Not Implmented
  </div>

export default {
  CensusTreemap,
  CensusBarChart,
  CensusCompareBarChart,
  CensusStackedBarChart,
  CensusLineChart,
  CensusPieChart,
  CensusStatBox,
  TextBox,
  CensusMap,
  CensusRadarGraph,
  ZCTAList,
  UNSDList,
  QCEWStackedBarChart,
  QCEWStatBox,
  NA
}
