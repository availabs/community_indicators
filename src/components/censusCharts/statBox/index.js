import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";

import Geoname from "../geoname"

import ChartBase, { LoadingIndicator } from "../ChartBase"

import get from 'lodash.get'
import styled from "styled-components"

import Title from "../ComponentTitle"

const YearDiv = styled.div`
  position: absolute;
  text-align: left;
  bottom: 10px;
  left: 20px;
`

const ValueContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > div {
    justify-content: center;
  }
  > div:last-child {
    justify-content: flex-start;
  }
`

class CensusStatBox extends ChartBase {
    getFalcorDeps() {
      return this.props.falcor.get(
        ['acs',
          [...this.props.geoids,
            this.props.compareGeoid
          ].filter(Boolean),
          this.props.years,
          [...this.props.censusKeys,
            ...this.props.divisorKeys,
            ...this.props.subtractKeys
          ]
        ]
      ).then(res => console.log("RES:", res))
    }

    calculateValues(geoids){
      const getValue = (g, y, c) => {
        const v = get(this.props.graph, ["acs", g, y, c], -666666666);
        return v === -666666666 ? 0 : v;
      }

      let value = geoids.reduce((a, c) =>
        a + this.props.censusKeys.reduce((aa, cc) =>
          aa + getValue(c, this.props.year, cc)
        , 0)
      , 0)
      const sub = geoids.reduce((a, c) =>
        a + this.props.subtractKeys.reduce((aa, cc) =>
          aa + getValue(c, this.props.year, cc)
        , 0)
      , 0)

      value -= sub;

        // let value = geoids
        //     .map(geoid => get(this.props.graph, `acs.${geoid}.${this.props.year}.${this.props.censusKey}`, 0))
        //     .reduce((a,b) => a + b )

        if(this.props.sumType === 'avg') {
            value /= geoids.length
        } else if (this.props.sumType === 'pct') {
            // let divisorValue = geoids
            // .map(geoid => get(this.props.graph, `acs.${geoid}.${this.props.year}.${this.props.divisorKey}`, 0))
            // .reduce((a,b) => a + b )
              let divisorValue = geoids.reduce((a, c) =>
                a + this.props.divisorKeys.reduce((aa, cc) =>
                  aa + getValue(c, this.props.year, cc)
                , 0)
              , 0)

            // console.log('calculateValues', value, divisorValue, value / divisorValue * 100)
            value /= divisorValue
            value *= 100
        }

        // console.log('got the value', value)
        if(!value) {
            return {value: '', change: ''}
        }

        let change = 0
        // console.log('compareYear', this.props.compareYear)

        if(this.props.compareYear) {
          let compareValue = geoids.reduce((a, c) =>
            a + this.props.censusKeys.reduce((aa, cc) =>
              aa + getValue(c, this.props.compareYear, cc)
            , 0)
          , 0)
          let sub = geoids.reduce((a, c) =>
            a + this.props.subtractKeys.reduce((aa, cc) =>
              aa + getValue(c, this.props.compareYear, cc)
            , 0)
          , 0)
          compareValue -= sub;
            // let compareValue = geoids
            //     .map(geoid => get(this.props.graph, `acs.${geoid}.${this.props.compareYear}.${this.props.censusKey}`, 0))
            //     .reduce((a,b) => a + b )

            if (this.props.sumType === 'pct') {
                // let divisorValue = geoids
                //   .map(geoid => get(this.props.graph, `acs.${geoid}.${this.props.year}.${this.props.divisorKey}`, 0))
                //   .reduce((a,b) => a + b )
                  let divisorValue = geoids.reduce((a, c) =>
                    a + this.props.divisorKeys.reduce((aa, cc) =>
                      aa + getValue(c, this.props.year, cc)
                    , 0)
                  , 0)

                // console.log('calculateValues', value, divisorValue, value / divisorValue * 100)
                compareValue /= divisorValue
                compareValue *= 100
            }



            change = (((value - compareValue) / compareValue) * 100)
            // console.log('comparevalue', this.props.compareYear)

            change = isNaN(change) ? 0 : +change.toFixed(2);
        }

        return {
            value,
            change
        }
    }

    renderStuff(geoids, compareStuff) {

        let { value, change } = this.calculateValues(geoids),
          growthColors = [this.props.increaseColor, this.props.decreaseColor];
        this.props.invertColors && growthColors.reverse();

        if (!this.props.showColors) {
          growthColors = ["currentColor", "currentColor"];
        }
        else if (change && (Math.abs(change) < this.props.colorThresholdPercent)) {
          growthColors = ["currentColor", "currentColor"];
        }

        const growthColor = change ? growthColors[change > 0 ? 0 : 1] : "currentColor";

      return compareStuff && !value ? null : (
        <div style={ {
            color: growthColor,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
          } }>

          <div style={ {
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          } }>
            { this.props.compareGeoid &&
              <div style={ { marginRight: "10px" } }>
                <Geoname geoids={ geoids }/>
              </div>
            }
            <div className='value'
              style={ {
                display: 'block',
                fontSize: !value ? "1rem" : this.props.compareGeoid ? "2rem" : "2.5rem",
                textAlign: "center"
              } }>
              { value && this.props.valuePrefix }
              { value ? value.toLocaleString('en-us',{maximumFractionDigits: this.props.maximumFractionDigits}) : "This census data variable is not available at this geography." }
              { value && this.props.valueSuffix }
            </div>
          </div>

          { this.props.compareYear && change ?
            <div style={ { textAlign: 'center', marginTop: "-10px" } }>
                { Math.abs(change) }% {change >= 0 ? 'Growth' : 'Decline' }
            </div> : null
           }
        </div>
      )
    }

    render() {

      return this.state.loading ? <LoadingIndicator /> : (
          <div style={ { height: "100%", position: "relative" } }>
            <div className='el-tablo'
              style={ {
                padding: "10px",
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              } }>
              <Title { ...this.props } center className='title'/>
              <ValueContainer>
                { this.renderStuff(this.props.geoids) }
                {
                  !this.props.compareGeoid ? null :
                  this.renderStuff([this.props.compareGeoid], true)
                }
              </ValueContainer>
            </div>
            { this.props.compareYear && (this.props.yearPosition !== "none") ?
              <YearDiv position={ this.props.yearPosition }>
                 <b>{ this.props.year }</b> vs <b>{ this.props.compareYear }</b>
              </YearDiv> : null
            }
          </div>
        )

    }

    static defaultProps = {
        censusKeys: [],
        geoids: [],
        compareGeoid: null,
        years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
        year:'2017',
        compareYear: null,
        maximumFractionDigits: 0,
        subtractKeys: [],
        divisorKeys: [],
        yearPosition: "bottom-left",
        increaseColor: "#090",
        decreaseColor: "#900",
        invertColors: false,
        showColors: true,
        colorThresholdPercent: 1,
        id: "CensusStatBox",
        type: "CensusStatBox"
    }
}

const mapDispatchToProps = { };

const mapStateToProps = (state) => {
    return {
        graph: state.graph // so componentWillReceiveProps will get called.
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CensusStatBox))
