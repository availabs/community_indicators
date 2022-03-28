import React from 'react';

import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";

import { Link } from "react-router-dom"

import get from "lodash.get"

import ChartBase, { LoadingIndicator, NoData } from "../ChartBase"
import { Button } from "components/AvlStuff/AvlTable"
import Geoname from "../geoname"
import { Input } from "components/common/styled-components"

class UNSDList extends ChartBase {
  constructor(...args) {
    super(...args);
    this.state = {
      ...this.state,
      searchString: "",
      page: 0
    };
  }

  getFalcorDeps() {
    return this.props.falcor.get(
      ["geo", this.props.geoids, ["unsd"]]
    ).then(res => {
      const UNSDs = this.props.geoids.reduce((a, c) => {
        const UNSDs = get(res, ["json", "geo", c, "unsd"], []);
        a.push(...UNSDs);
        return a;
      }, []);
      return UNSDs.length && this.props.falcor.get(["geo", UNSDs, ["geoid", "name", "grades"]])
    })
  }

  nextPage() {
    const maxPage = Math.max(Math.ceil(this.props.unsdList.length / 8) - 1, 0)
    this.setState({ page: Math.min(maxPage, this.state.page + 1 )});
  }
  prevPage() {
    this.setState({ page: Math.max(0, this.state.page - 1 )});
  }

  setSearchString(searchString) {
    this.setState({ searchString });
  }

  render() {
    const filtered = this.props.unsdList
      .filter(({ name }) =>
        String(name).toLowerCase()
          .includes(this.state.searchString.toLowerCase())
      );

    const maxPage = Math.max(Math.ceil(filtered.length / 8) - 1, 0),
      page = Math.min(maxPage, this.state.page);

    const data = filtered
      .slice(page * 8, page * 8 + 8);

    const keys = ["name", "grades", "Local Education Agency"];

    return !this.state.loading && !filtered.length ?
      <NoData noDataMessage="No School Districts found"/> : (
      <div style={ {
        width: "100%", height: "100%", position: "relative"
      } }>

        <LoadingIndicator { ...this.state }/>

        <div style={ {
          padding: '8px 0px 0px 10px',
          fontSize: "1.2rem",
          height: "30px",
          width: "100%"
        } }>
          { this.props.title }
        </div>

        <div style={ { height: "calc(100% - 30px)", padding: "10px" } }>
          <div style={ { display: "flex" } }>
            <div style={ { flexGrow: 1, display: "flex" } }>
              <Button onClick={ e => this.prevPage() }
                disabled={ page === 0 }>
                <span className="fa fa-chevron-left"/>
              </Button>
              <div style={ {
                flexGrow: 1, display: "flex",
                justifyContent: "center",
                alignItems: "center"
              } }>
                <div style={ { width: "25%" } }>
                  <Input type="text" value={ this.state.searchString }
    								onChange={ ({ target: { value } }) => this.setSearchString(value) }
    								placeholder="search for a school district..."/>
                </div>
                <span style={ { marginLeft: "1rem" } }>
                  Page { page + 1 } of { maxPage + 1 }
                </span>
              </div>
            </div>
            <div style={ { flexGrow: 0, display: "flex" } }>
              <Button onClick={ e => this.nextPage() }
                disabled={ page === maxPage }>
                <span className="fa fa-chevron-right"/>
              </Button>
            </div>
          </div>
          <table className="table table-sm">
            <thead>
              <tr>
                { keys.map(col => (
                    <th key={ col }> { col }</th>
                  ))
                }
              </tr>
            </thead>
            <tbody>
              { data.map(d => (
                  <tr key={ d.unsd }>
                    <td>
                      <Link to={ `/profile/${ d.unsd }` } target="_top">
                        { d.name }
                      </Link>
                    </td>
                    <td>{ d.grades }</td>
                    <td>{ d.lea }</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state, props) => ({
  unsdList: getUNSDList(state, props),
  acsGraph: get(state, ["graph", "acs"], {}),
  geoGraph: get(state, ["graph", "geo"], {}),
  allGeoids: [...props.geoids, props.compareGeoid].filter(Boolean)
})

export default connect(mapStateToProps)(reduxFalcor(UNSDList));

const getUNSDList = (state, props) => {
  return props.geoids.reduce((a, c) => {
    a.push(...get(state, ["graph", "geo", c, "unsd", "value"], []));
    return a;
  }, []).map(unsd => {
    return {
      name: get(state, ["graph", "geo", unsd, "name"]),
      grades: get(state, ["graph", "geo", unsd, "grades"]),
      lea: unsd.slice(7),
      unsd
    }
  }).sort((a, b) => a.name && b.name ? a.name.localeCompare(b.name) : 0);
}
