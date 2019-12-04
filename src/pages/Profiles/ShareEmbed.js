import React from "react"
import { connect } from "react-redux";

import get from "lodash.get";

import CensusBarChart from "components/censusCharts/bar/censusBarChart"
import CensusStackedBarChart from "components/censusCharts/bar/censusStackedBarChart"
import CensusLineChart from "components/censusCharts/line/censusLineChart"
import CensusMap from "components/censusCharts/map"
import CensusPieChart from "components/censusCharts/pie/CensusPieChart"

import PROFILE_CONFIG from "pages/Profiles/graphConfig"
import REGION_CONFIG from "pages/Profiles/regionConfig"

const TYPES = {
  CensusBarChart,
  CensusStackedBarChart,
  CensusLineChart,
  CensusMap,
  CensusPieChart
}
const NotYetImplemented = ({ type }) =>
  <h1>{ type } NOT YET IMPLEMENTED</h1>

const CONFIG_MAP = [
  ...[].concat(...Object.values(PROFILE_CONFIG)),
  ...[].concat(...Object.values(REGION_CONFIG)),
].reduce((a, c) => ({
  ...a,
  [c.id]: c
}), {})

class ShareEmbed extends React.Component {
  render() {
    const { id, ...rest } = this.props.embedProps,
      config = get(CONFIG_MAP, id, {}),
      { type } = config,
      Chart = get(TYPES, type, () => <NotYetImplemented type={ type }/>);
    return (
      <div style={ { width: "100%", height: "100%" } }>
        <Chart { ...rest } { ...config }
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
