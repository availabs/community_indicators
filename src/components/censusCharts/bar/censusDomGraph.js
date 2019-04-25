import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";

import get from 'lodash.get'

import styled from "styled-components";

import { fnum } from "utils/sheldusUtils"

import COLOR_RANGES from "constants/color-ranges"



let GraphListItem =  styled.li`
	display: flex;
    flex-flow: row nowrap;
    cursor: pointer;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: .59975em;
    color: #5c6587;
    transition: all 80ms linear;
`

let GraphIcon = styled.i`
	margin-right: .8em;
    color: ${props => props.color || '#5c6587'};
    font-size: 35px;
    height: 40px;
    transition: all 80ms linear;
    flex: 0 0 40px;
`

let BarContainer = styled.div`
	display: flex;
    flex-flow: column nowrap;
    flex: 1 0 auto;
    max-width: calc(100% - (40px + 1.333em));
`
let GraphLabel = styled.div`
	display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
`
let NameLabel = styled.span`
	font-size: .6667em;
    font-weight: 900;
    line-height: 1.25;
    letter-spacing: .1em;
    text-transform: uppercase;
    font-weight: 500;
`

let NumberLabel = styled.span`
	font-feature-settings: "tnum";
    text-align: right;
    font-size: .6667em;
    font-weight: 900;
    line-height: 1.25;
    letter-spacing: .1em;
    text-transform: uppercase;
    font-weight: 500;
`

let Bar = styled.div`
	position: relative;
    margin-top: .25em;
    width: 100%;
    height: .5em;
    border-radius: .25em;
    background-color: rgba(92,101,135,.6);
`
let BarValue = styled.div`
	height: .5em;
    border-radius: .25em;
	width: ${props => props.width || 0}%;
    left: ${props => props.left || 0}%;
    background-color: ${props => props.color || 'rgb(39, 216, 136)'};
`

class CensusDomGraph extends React.Component{
    constructor(props) {
        super(props);

    }

    domData(){
            let response = this.props.graph;
            let data =[];
            if(!response.acs || !response.acs.config) {
                return []
            }
            let censusConfig = response.acs.config.value[this.props.censusKey].variables;
            if (this.props.geoid.length === 1){
                let domData = response.acs[this.props.geoid][this.props.year];
                let colors = COLOR_RANGES[Object.keys(domData).shift().length+1].filter(d => d.name === 'Set3')[0].colors
                Object.keys(domData).forEach(function(dom,i){
                    if(i !== 0){
                        data.push({
                            'name' : censusConfig[i].name,
                            'value': domData[dom],
                            'color': colors[i]
                        })
                    }
                })
            }
            /*
            else{
                console.log(this.props.geoid);
                let domData = [];
                let year = this.props.year;
                this.props.geoid.forEach(function(geoid){
                    domData = response.acs[geoid][year];
                    console.log('domData',domData);
                    let colors = COLOR_RANGES[Object.keys(domData).shift().length+1].filter(d => d.name === 'Set3')[0].colors;
                    Object.keys(domData).forEach(function(dom,i){
                        console.log('dom',i+i)
                    })

                })

            }
             */
            return data


    }

    renderCensusSelector(data) {
        try {
            let totalPopulation = [];
            data.forEach(function(value){
                totalPopulation.push(value.value)
            });
            let barTotal = totalPopulation.reduce((a,c) => a+c);
            data.sort((a, b) => (a.value < b.value) ? 1 : -1);
            return data.map(bar =>{
            const name = bar.name;
                return (
                    <GraphListItem>
                        <BarContainer>
                            <GraphLabel>
                                <NameLabel>
                                    {name}
                                </NameLabel>
                                <NumberLabel>
                                    { fnum(bar.value) }
                                </NumberLabel>
                            </GraphLabel>
                        <Bar>
                            <BarValue width={((bar.value / barTotal) * 100)} color={bar.color}/>
                        </Bar>
                        </BarContainer>
                    </GraphListItem>
            )
             })

        } catch (e) {
            return "Loading..."


        }

    }

    render() {
        let calculatedData = this.domData()
        return (
            <div>
            <ul style={{paddingLeft: 50, paddingRight: '2em'}}>
                { this.renderCensusSelector(calculatedData) }
            </ul>
            </div>
        )
    }

    static defaultProps = {
        censusKey: [],
        geoids: [],
        year: ['2016'],
        data: []
    }

}

const mapDispatchToProps = { };

const mapStateToProps = (state,ownProps) => {
    return {
        geoid: ownProps.geoid,
        graph: state.graph // so componentWillReceiveProps will get called.
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CensusDomGraph))
