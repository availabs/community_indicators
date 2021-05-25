import React from 'react';

import deepequal from "deep-equal"
import debounce from "lodash.debounce"

export const LoadingIndicator = ({ loading = true }) =>
  !loading ? null :
  <div style={ {
      position: "absolute",
      top: 0, bottom: 0, left: 0, right: 0,
      backgroundColor: "rgba(0, 0, 0, 0.25)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "2rem",
      fontWeight: "bold",
      zIndex: 1000
    } }>
    Loading...
  </div>

export const NoData = ({ noDataMessage }) =>
  <div style={ {
      height: "100%", width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "1.5rem",
      fontWeight: "bold"
    } }>
    { noDataMessage }
  </div>

export default class ChartBase extends React.Component {
    constructor(...args) {
      super(...args);
      this.state = {
        loading: false,
        noDataMessage: "Initializing, please wait..."
      };
      this._fetchFalcorDeps = this._fetchFalcorDeps.bind(this);
      this.debounced = debounce(this._fetchFalcorDeps, 250);
    }
    MOUNTED = false;
    componentDidMount() {
      this.MOUNTED = true;
      setTimeout(() => this.setState({ noDataMessage: "This census data variable is not available at this geography." }), 125);
    }
    componentWillUnmount() {
      this.MOUNTED = false;
    }
    setState(...args) {
      this.MOUNTED && super.setState(...args);
    }

    startTimeout = null;
    stopTimeout = null;

    getFalcorDeps() {
// console.log("<ChartBase::getFalcorDeps>", this.props.type)
      return Promise.resolve();
    }
    _fetchFalcorDeps() {
      this.startLoading();
      return this.getFalcorDeps()
        .then(() => this.stopLoading());
    }
    fetchFalcorDeps() {
// console.log("<ChartBase::fetchFalcorDeps>", this.props.type)
      return Promise.resolve(this.debounced());
    };
    startLoading() {
      clearTimeout(this.startTimeout);
      this.startTimeout = setTimeout(() => this.setState({ loading: true }), this.state.loading ? 250 : 50);
    }
    stopLoading() {
      clearTimeout(this.startTimeout);
      clearTimeout(this.stopTimeout);
      this.stopTimeout = setTimeout(() => this.setState({ loading: false }), this.state.loading ? 500: 50);
    }
    componentDidUpdate(oldProps) {
      if (!deepequal(this.props.geoids, oldProps.geoids) ||
          (this.props.compareGeoid !== oldProps.compareGeoid)) {
        this.fetchFalcorDeps();
      }
    }
}
