import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxFalcor} from "utils/redux-falcor";
import {falcorGraph} from "store/falcorGraph";
import TrackVisibility from 'react-on-screen';
import get from 'lodash.get'

class CensusStatBox extends React.Component{
    constructor(props) {
        super(props);
        this.calculateValues = this.calculateValues.bind(this)
    }
    fetchFalcorDeps(){
        let censusConfig ={};
        let census_subvars = [];
        let years = [this.props.year]
        if(this.props.compareYear) {
            years.push(this.props.compareYear)
        }
        return falcorGraph
            .get(['acs',this.props.geoids,years, this.props.censusKey])
            .then(response =>{
                console.log('got data', response)
                return response
            })
    }

    calculateValues(){

        let value = this.props.geoids
            .map(geoid => get(this.props.graph, `acs.${geoid}.${this.props.year}.${this.props.censusKey}`, 0))
            .reduce((a,b) => a + b )

        if(!value) {
            return {value: '', change: ''}  
        } 

        let change = 0
        console.log('compareYear', this.props.compareYear)

        if(this.props.compareYear) {
            let compareValue = this.props.geoids
                .map(geoid => get(this.props.graph, `acs.${geoid}.${this.props.compareYear}.${this.props.censusKey}`, 0))
                .reduce((a,b) => a + b )


            change = (((value - compareValue) / compareValue) * 100)
            // console.log('comparevalue', this.props.compareYear)

            change = isNaN(change) ? '' : change.toFixed(2)
        }

        return {
            value,
            change
        }
    }

    render(){
        let displayData = this.calculateValues()
        return(
            <div className='el-tablo' style={{padding: 10}}>
                
                <div className='title' style={{fontSize: '1.2em', textAlign: 'center'}}> 
                    {this.props.title}
                </div>
                
                <div className='value' style={{ textAlign: 'center', display: 'block'}}>
                    {this.props.valuePrefix}{displayData.value.toLocaleString()}
                </div>
                {this.props.compareYear &&
                    <div className='' style={{ textAlign: 'center'}}> 
                        {displayData.change}% Growth 
                    </div>
                 }
            </div>
        )

    }

    static defaultProps = {
        censusKey: 'B01003_001E', //'B19013',,
        geoids: ['36001'],
        year:'2016',
        colorRange:[]
    }
}

const mapDispatchToProps = { };

const mapStateToProps = (state) => {
    return {
        graph: state.graph // so componentWillReceiveProps will get called.
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(reduxFalcor(CensusStatBox))