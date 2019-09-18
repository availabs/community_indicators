import React from "react"
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import get from 'lodash.get'

class CensusName extends React.Component {
  static defaultProps = {
    censusKeys: []
  }
  fetchFalcorDeps() {
    return this.props.falcor.get(
      ["acs", "meta", this.props.censusKeys, "label"]
    );
  }
  render() {
    return (
      <>
        { this.props.censusNames.join(", ") }
      </>
    )
  }
}

const mapStateToProps = (state, props) => ({
  censusNames: getCensusNames(state, props)
})

const getCensusNames = (state, props) =>
  get(props, "censusKeys", [])
    .map(key => get(state, ["graph", "acs", "meta", key, "label"], key))

export default connect(mapStateToProps, null)(reduxFalcor(CensusName));
