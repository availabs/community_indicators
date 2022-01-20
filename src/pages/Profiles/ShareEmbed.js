import React from "react"
import { connect } from "react-redux";

import get from "lodash.get";

import CensusBarChart from "components/censusCharts/bar/censusBarChart"
import CensusCompareBarChart from "components/censusCharts/bar/censusCompareBarChart"
import CensusStackedBarChart from "components/censusCharts/bar/CensusStackedBarChart"
import CensusLineChart from "components/censusCharts/line/censusLineChart"
import CensusMap from "components/censusCharts/map"
import CensusPieChart from "components/censusCharts/pie/CensusPieChart"
import CensusRadarChart from "components/censusCharts/radar"

import PROFILE_CONFIG from "pages/Profiles/graphConfig"
import REGION_CONFIG from "pages/Profiles/regionConfig"
import { processBaseConfig } from "./graphConfig/utils"

const TYPES = {
  CensusBarChart,
  CensusCompareBarChart,
  CensusStackedBarChart,
  CensusLineChart,
  CensusMap,
  CensusPieChart,
  CensusRadarChart
}
const NotYetImplemented = ({ type }) =>
  <h1>{ type } NOT YET IMPLEMENTED</h1>

const CONFIG_MAP = [
  ...[].concat(...Object.values(processBaseConfig(PROFILE_CONFIG))),
  ...[].concat(...Object.values(processBaseConfig(REGION_CONFIG))),
].reduce((a, c) => ({
  ...a,
  [c.id]: c
}), {})

class ShareEmbed extends React.Component {
  render() {
    const { id, ...rest } = this.props.embedProps,
      config = get(CONFIG_MAP, id, {}),
      { type, ...configRest } = config,
      Chart = get(TYPES, type, () => <NotYetImplemented type={ type }/>);

    return (
      <div style={ { width: "100%", height: "100%" } }>
        <Chart { ...rest } { ...configRest }
          showOptions={ false }/>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  embedProps: getShareEmbedProps(state, props)
})

const getShareEmbedProps = (state, props) => {
  const url = decodeURI(get(props, ["location", "search"], "").slice(1));
  if (!url) return {};
  const split = url.split("&");
  return split.reduce((a, c) => {
    let [key, value] = c.split("=");
    a[key] = JSON.parse(value);
    if ((key === "left") || (key === "right")) {
      const censusKeys = get(a, ["censusKeys"], []);
      a["censusKeys"] = [...censusKeys, ...a[key].keys];
    }
    return a;
  }, {});
}

export default {
  path: '/share/embed',
  exact: true,
  auth: false,
  useLayout: false,
  component: connect(mapStateToProps, null)(ShareEmbed)
}
