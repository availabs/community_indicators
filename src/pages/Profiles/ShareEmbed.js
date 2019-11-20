import React from "react"
import { connect } from "react-redux";

import get from "lodash.get";

import CensusBarChart from "components/censusCharts/bar/censusBarChart"
import CensusStackedBarChart from "components/censusCharts/bar/censusStackedBarChart"
import CensusLineChart from "components/censusCharts/line/censusLineChart"
import CensusMap from "components/censusCharts/map"

const TYPES = {
  CensusBarChart,
  CensusStackedBarChart,
  CensusLineChart,
  CensusMap
}
const NotYetImplemented = ({ type }) =>
  <h1>{ type } NOT YET IMPLEMENTED</h1>

class ShareEmbed extends React.Component {
  render() {
    const { type, ...rest } = this.props.embedProps;
    const Chart = get(TYPES, [type], () => <NotYetImplemented type={ type }/>);
    return (
      <div style={ { width: "100%", height: "100%" } }>
        <Chart { ...rest }
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
    value = value.replace(/__HASH__/g, "#");
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
