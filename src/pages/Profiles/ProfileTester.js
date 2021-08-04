import React from "react"

import { connect } from 'react-redux';
import { reduxFalcor } from 'utils/redux-falcor'

import get from "lodash.get"

class ProfileTester extends React.Component {
  fetchFalcorDeps() {
    return this.props.falcor.get([
      "acs", "36001", "2018", ["S2401_C01_019E", "TEST_FAKE"]
    ]).then(res => console.log("RES:", res))
  }
  render() {
    return (
      <div className='content-w'
        style={ {
          width: '100%', height: "100vh", paddingTop: "5rem", position: 'relative', zIndex: 4
        } }>
        <div className="container">
          ???????????????????????????????
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  acsGraph: get(state, ["graph", "acs"], {})
})
export default connect(mapStateToProps)(reduxFalcor(ProfileTester))
