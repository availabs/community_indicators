import React from 'react';

import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";

import { Link } from "react-router-dom"

import get from "lodash.get"

import ChartBase, { LoadingIndicator, NoData } from "../ChartBase"
import GeoName from "../geoname"

class ZCTAList extends ChartBase {
  getFalcorDeps() {
    return this.props.falcor.get(
      ["geo", this.props.geoids, this.props.year, ["zcta"]]
    )
  }
  render() {
    return !this.state.loading && !this.props.zctaList.length ?
      <NoData noDataMessage="No ZIP Codes found"/> : (
      <div style={ {
        width: "100%", height: "100%", position: "relative", borderRadius: "4px"
      } }>

        <LoadingIndicator { ...this.state }/>

        <div style={ {
          padding: '8px 0px 0px 10px',
          fontSize: "1.2rem",
          height: "30px", width: "100%"
        } }>
          { this.props.title }
        </div>

        <div style={ { height: "calc(100% - 30px)" } }>
          <div style={ { display: "flex", flexWrap: "wrap", padding: "10px" } }>
            { this.props.zctaList.map(zcta => (
                <Link key={ zcta } to={ `/profile/${ zcta }` } target="_top">
                  <div style={ { padding: "0.25rem 0.5rem" } }>
                    <GeoName geoid={ zcta }/>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  zctaList: getZCTAList(state, props),
  acsGraph: get(state, ["graph", "acs"], {}),
  geoGraph: get(state, ["graph", "geo"], {}),
  allGeoids: [...props.geoids, props.compareGeoid].filter(Boolean)
})

export default connect(mapStateToProps)(reduxFalcor(ZCTAList));

const getZCTAList = (state, props) => {
  return props.geoids.reduce((a, c) => {
    a.push(...get(state, ["graph", "geo", c, props.year, "zcta", "value"], []));
    return a;
  }, []).sort((a, b) => +a - +b);
}
